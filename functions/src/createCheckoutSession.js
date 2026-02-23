const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Stripe = require('stripe');

const db = admin.firestore();

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || functions.config().stripe?.secret_key;

let stripe = null;
const getStripe = () => {
  if (!stripe) {
    if (!STRIPE_SECRET_KEY) {
      throw new Error('Stripe secret key not configured. Add STRIPE_SECRET_KEY to functions/.env');
    }
    stripe = new Stripe(STRIPE_SECRET_KEY);
  }
  return stripe;
};

/**
 * Price IDs for each tier — set these from your Stripe Dashboard
 * 
 * To find them: Stripe Dashboard > Products > click product > copy Price ID (starts with price_)
 * 
 * IMPORTANT: Update these with your actual Stripe Price IDs.
 * If not set here, the function falls back to looking up products by name.
 */
const PRICE_IDS = {
  scout: process.env.STRIPE_PRICE_SCOUT || null,
  elite: process.env.STRIPE_PRICE_ELITE || null,
  pro: process.env.STRIPE_PRICE_PRO || null,
};

const TRIAL_DAYS = {
  scout: 5,
  elite: 7,
  pro: 10,
};

/**
 * Look up the Price ID for a tier dynamically from Stripe products
 * Only used when PRICE_IDS env vars aren't set
 */
async function findPriceForTier(tier) {
  const stripeClient = getStripe();

  if (PRICE_IDS[tier]) {
    return PRICE_IDS[tier];
  }

  const products = await stripeClient.products.list({ active: true, limit: 100 });

  for (const product of products.data) {
    const name = (product.name || '').toLowerCase();
    const metaTier = product.metadata?.tier;

    if (metaTier === tier || name.includes(tier)) {
      const prices = await stripeClient.prices.list({
        product: product.id,
        active: true,
        limit: 1,
      });
      if (prices.data.length > 0) {
        console.log(`Found price for ${tier}: ${prices.data[0].id} (product: ${product.name})`);
        return prices.data[0].id;
      }
    }
  }

  // Last resort: match by interval
  const intervalMap = { scout: 'week', elite: 'month', pro: 'year' };
  const prices = await stripeClient.prices.list({ active: true, limit: 100, type: 'recurring' });
  const match = prices.data.find(p => p.recurring?.interval === intervalMap[tier]);
  if (match) {
    console.log(`Found price for ${tier} by interval: ${match.id}`);
    return match.id;
  }

  throw new Error(`No Stripe price found for tier: ${tier}`);
}

/**
 * Find existing Stripe customer or create one — guarantees exactly one per Firebase user
 */
async function findOrCreateCustomer(userId, userEmail) {
  const stripeClient = getStripe();
  const userRef = db.collection('users').doc(userId);
  const userDoc = await userRef.get();
  const existingCustomerId = userDoc.exists ? userDoc.data().stripeCustomerId : null;

  // 1. If user already has a linked customer, verify it still exists
  if (existingCustomerId) {
    try {
      const customer = await stripeClient.customers.retrieve(existingCustomerId);
      if (customer && !customer.deleted) {
        console.log(`Reusing existing Stripe customer: ${customer.id}`);
        return customer;
      }
    } catch (err) {
      console.log(`Linked customer ${existingCustomerId} not found, will search/create`);
    }
  }

  // 2. Search by email — reuse if found
  const existing = await stripeClient.customers.list({ email: userEmail, limit: 1 });
  if (existing.data.length > 0) {
    const customer = existing.data[0];
    console.log(`Found existing customer by email: ${customer.id}`);
    await userRef.set({ stripeCustomerId: customer.id }, { merge: true });
    return customer;
  }

  // 3. Create new customer — only path that creates a new one
  const customer = await stripeClient.customers.create({
    email: userEmail,
    metadata: { firebaseUID: userId },
  });
  console.log(`Created new Stripe customer: ${customer.id}`);
  await userRef.set({ stripeCustomerId: customer.id }, { merge: true });
  return customer;
}

/**
 * Create Stripe Checkout Session
 *
 * Replaces Payment Links to eliminate duplicate customers.
 * - Finds or creates exactly ONE Stripe customer per Firebase user
 * - Locks the email so users can't change it at checkout
 * - Attaches Firebase UID as metadata for reliable webhook linking
 *
 * Frontend usage:
 *   const result = await httpsCallable(functions, 'createCheckoutSession')({ tier: 'scout' });
 *   window.location.href = result.data.url;
 */
exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be signed in');
  }

  const userId = context.auth.uid;
  const userEmail = context.auth.token.email;
  const tier = data.tier;

  if (!tier || !['scout', 'elite', 'pro'].includes(tier)) {
    throw new functions.https.HttpsError('invalid-argument', 'Valid tier required: scout, elite, or pro');
  }

  console.log(`Creating checkout session: user=${userId}, email=${userEmail}, tier=${tier}`);

  try {
    const stripeClient = getStripe();
    const customer = await findOrCreateCustomer(userId, userEmail);
    const priceId = await findPriceForTier(tier);
    const trialDays = TRIAL_DAYS[tier] || 7;

    // Check if customer already has an active subscription
    const subs = await stripeClient.subscriptions.list({
      customer: customer.id,
      status: 'all',
      limit: 10,
    });
    const activeSub = subs.data.find(s => ['active', 'trialing'].includes(s.status));
    if (activeSub) {
      throw new functions.https.HttpsError(
        'already-exists',
        'You already have an active subscription. Manage it from your Account page.'
      );
    }

    // Check if customer has ever had a trial (prevent trial abuse)
    const hadTrial = subs.data.some(s => s.trial_end !== null);

    const successUrl = data.successUrl || 'https://nhlsavant.com/?checkout=success';
    const cancelUrl = data.cancelUrl || 'https://nhlsavant.com/pricing';

    const sessionParams = {
      customer: customer.id,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: userId,
      metadata: { firebaseUID: userId, tier },
      subscription_data: {
        metadata: { firebaseUID: userId, tier },
      },
      allow_promotion_codes: true,
    };

    // Only grant trial if they haven't had one before
    if (!hadTrial) {
      sessionParams.subscription_data.trial_period_days = trialDays;
    } else {
      console.log(`Customer ${customer.id} already had a trial — skipping trial`);
    }

    const session = await stripeClient.checkout.sessions.create(sessionParams);
    console.log(`Checkout session created: ${session.id}, url: ${session.url}`);

    return { url: session.url, sessionId: session.id };
  } catch (error) {
    if (error instanceof functions.https.HttpsError) throw error;
    console.error('Error creating checkout session:', error);
    throw new functions.https.HttpsError('internal', 'Failed to create checkout session');
  }
});
