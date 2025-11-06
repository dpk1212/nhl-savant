const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Stripe = require('stripe');

// Don't initialize Stripe at module level - do it inside the function
let stripe = null;

const getStripe = () => {
  if (!stripe) {
    const secretKey = functions.config().stripe?.secret_key || process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error('Stripe secret key not configured. Run: firebase functions:config:set stripe.secret_key="sk_..."');
    }
    stripe = new Stripe(secretKey);
  }
  return stripe;
};

/**
 * HTTPS Callable Function - Check User's Subscription Status
 * 
 * This function queries Stripe directly to get the user's current subscription
 * No webhook dependency - always accurate, source of truth is Stripe
 * 
 * Call from frontend:
 * const result = await checkSubscription({ email: user.email });
 */
exports.checkSubscription = functions.https.onCall(async (data, context) => {
  try {
    // Initialize Stripe (lazy loading)
    const stripe = getStripe();
    
    // Ensure user is authenticated
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be signed in');
    }

    const userId = context.auth.uid;
    const userEmail = data.email || context.auth.token.email;

    if (!userEmail) {
      throw new functions.https.HttpsError('invalid-argument', 'Email is required');
    }

    console.log(`Checking subscription for user: ${userId}, email: ${userEmail}`);

    // Step 1: Find Stripe customer by email
    const customers = await stripe.customers.list({
      email: userEmail,
      limit: 1
    });

    if (customers.data.length === 0) {
      console.log('No Stripe customer found');
      // No customer = free user
      return {
        tier: 'free',
        status: 'active',
        isActive: false,
        isTrial: false,
        daysRemaining: 0,
        source: 'stripe_api'
      };
    }

    const customer = customers.data[0];
    console.log(`Found Stripe customer: ${customer.id}`);

    // Step 2: Get active subscriptions for this customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'all', // Get all statuses to check trials, active, etc.
      limit: 10
    });

    // Find the most recent active or trialing subscription
    const activeSubscription = subscriptions.data.find(sub => 
      ['active', 'trialing'].includes(sub.status)
    );

    if (!activeSubscription) {
      console.log('No active subscription found');
      // Has customer account but no active subscription
      return {
        tier: 'free',
        status: 'inactive',
        isActive: false,
        isTrial: false,
        daysRemaining: 0,
        stripeCustomerId: customer.id,
        source: 'stripe_api'
      };
    }

    console.log(`Found active subscription: ${activeSubscription.id}, status: ${activeSubscription.status}`);

    // Step 3: Determine tier from subscription metadata or price
    // Check metadata first (most reliable)
    let tier = activeSubscription.metadata?.tier;

    // If no metadata, determine from price nickname or product name
    if (!tier && activeSubscription.items.data.length > 0) {
      const price = activeSubscription.items.data[0].price;
      const productId = price.product;
      
      // Fetch product to get name
      const product = await stripe.products.retrieve(productId);
      const productName = (product.name || '').toLowerCase();
      
      // Map product name to tier
      if (productName.includes('scout')) {
        tier = 'scout';
      } else if (productName.includes('elite')) {
        tier = 'elite';
      } else if (productName.includes('pro') || productName.includes('savant')) {
        tier = 'pro';
      } else {
        // Fallback: use price interval
        if (price.recurring?.interval === 'week') tier = 'scout';
        else if (price.recurring?.interval === 'month') tier = 'elite';
        else if (price.recurring?.interval === 'year') tier = 'pro';
      }
    }

    // Default to scout if we still couldn't determine
    if (!tier) {
      tier = 'scout';
    }

    // Step 4: Calculate trial info
    const isTrial = activeSubscription.status === 'trialing';
    let daysRemaining = 0;
    
    if (isTrial && activeSubscription.trial_end) {
      const trialEnd = new Date(activeSubscription.trial_end * 1000);
      const now = new Date();
      const diffTime = trialEnd - now;
      daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }

    // Step 5: Build response
    const subscriptionData = {
      tier,
      status: activeSubscription.status,
      isActive: true,
      isTrial,
      daysRemaining,
      stripeCustomerId: customer.id,
      subscriptionId: activeSubscription.id,
      currentPeriodEnd: new Date(activeSubscription.current_period_end * 1000).toISOString(),
      cancelAtPeriodEnd: activeSubscription.cancel_at_period_end,
      source: 'stripe_api',
      checkedAt: new Date().toISOString()
    };

    console.log('Subscription data:', subscriptionData);

    // Step 6: Update Firestore (cache the result)
    await admin.firestore().collection('users').doc(userId).set({
      ...subscriptionData,
      email: userEmail,
      lastSubscriptionCheck: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    return subscriptionData;

  } catch (error) {
    console.error('Error checking subscription:', error);
    
    // Return detailed error for debugging
    throw new functions.https.HttpsError(
      'internal',
      'Failed to check subscription status',
      { originalError: error.message }
    );
  }
});

