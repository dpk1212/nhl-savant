const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Stripe = require('stripe');

// Get Stripe config - PREFER process.env (new method), fallback to functions.config() (deprecated)
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || functions.config().stripe?.secret_key;

// Lazy load Stripe
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
 * Create Stripe Customer Portal Session
 * 
 * This allows users to:
 * - Cancel subscriptions
 * - Update payment methods
 * - View invoices
 * - Download receipts
 * 
 * Usage from frontend:
 * const result = await createPortalSession({ returnUrl: window.location.href });
 * window.location.href = result.data.url;
 */
exports.createPortalSession = functions.https.onCall(async (data, context) => {
  try {
    const stripe = getStripe();

    // Ensure user is authenticated
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be signed in');
    }

    const userId = context.auth.uid;
    const userEmail = context.auth.token.email;
    const returnUrl = data.returnUrl || 'https://yourdomain.com/account';

    console.log(`Creating portal session for user: ${userId}, email: ${userEmail}`);

    const db = admin.firestore();
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    let customerId = userDoc.exists ? userDoc.data().stripeCustomerId : null;

    if (customerId) {
      try {
        const existing = await stripe.customers.retrieve(customerId);
        if (existing.deleted) customerId = null;
      } catch {
        customerId = null;
      }
    }

    if (!customerId) {
      const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        await userRef.set({ stripeCustomerId: customerId }, { merge: true });
      } else {
        throw new functions.https.HttpsError(
          'not-found',
          'No billing account found. Please subscribe first from the Pricing page.'
        );
      }
    }

    console.log(`Using customer: ${customerId}`);

    // Step 2: Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    console.log(`Portal session created: ${session.url}`);

    return {
      url: session.url
    };

  } catch (error) {
    console.error('Error creating portal session:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to create billing portal session',
      { originalError: error.message }
    );
  }
});

