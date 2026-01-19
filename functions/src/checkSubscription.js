const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Stripe = require('stripe');

// Get Stripe config - PREFER process.env (new method), fallback to functions.config() (deprecated)
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || functions.config().stripe?.secret_key;

// Initialize Stripe lazily
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
 * HTTPS Callable Function - Check User's Subscription Status
 * 
 * This function queries Stripe directly to get the user's current subscription
 * No webhook dependency - always accurate, source of truth is Stripe
 * 
 * Call from frontend:
 * const result = await checkSubscription({ email: user.email });
 * 
 * Updated: Force redeploy with Stripe key
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
    
    // Also accept an alternate email for cases where Stripe checkout used different email
    const alternateEmail = data.alternateEmail;

    if (!userEmail) {
      throw new functions.https.HttpsError('invalid-argument', 'Email is required');
    }

    console.log(`Checking subscription for user: ${userId}, email: ${userEmail}, alternateEmail: ${alternateEmail || 'none'}`);

    // ═══════════════════════════════════════════════════════════════════════
    // STEP 0: Check if user already has a stripeCustomerId in Firestore
    // This handles cases where they checked out with a different email
    // ═══════════════════════════════════════════════════════════════════════
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    const existingCustomerId = userDoc.exists ? userDoc.data().stripeCustomerId : null;
    
    let customers = { data: [] };
    
    if (existingCustomerId) {
      // User already linked to a Stripe customer - use that directly
      console.log(`✅ User has existing stripeCustomerId: ${existingCustomerId}`);
      try {
        const existingCustomer = await stripe.customers.retrieve(existingCustomerId);
        if (existingCustomer && !existingCustomer.deleted) {
          customers.data = [existingCustomer];
          console.log(`Using linked Stripe customer: ${existingCustomer.email}`);
        }
      } catch (err) {
        console.log(`Existing customer ${existingCustomerId} not found, will search by email`);
      }
    }
    
    // If no linked customer, search by email(s)
    if (customers.data.length === 0) {
      // Step 1a: Search by primary email
      customers = await stripe.customers.list({
        email: userEmail,
        limit: 100
      });
      
      // Step 1b: If no results and alternate email provided, try that
      if (customers.data.length === 0 && alternateEmail) {
        console.log(`No customer found for ${userEmail}, trying alternate: ${alternateEmail}`);
        customers = await stripe.customers.list({
          email: alternateEmail,
          limit: 100
        });
      }
    }

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

    console.log(`Found ${customers.data.length} Stripe customer(s)`);

    // Step 2: Check ALL customers for active subscriptions (handles duplicate customer issue)
    let activeSubscription = null;
    let activeCustomer = null;

    for (const customer of customers.data) {
      console.log(`Checking customer: ${customer.id}`);
      
      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status: 'all',
        limit: 10
      });

      // Find active or trialing subscription
      const sub = subscriptions.data.find(s => ['active', 'trialing'].includes(s.status));
      
      if (sub) {
        activeSubscription = sub;
        activeCustomer = customer;
        console.log(`✅ Found active subscription on customer ${customer.id}`);
        break; // Found one, stop searching
      }
    }

    const customer = activeCustomer || customers.data[0];

    if (!activeSubscription) {
      console.log('No active subscription found - updating Firestore to reflect cancellation');
      
      // Build inactive subscription data
      const inactiveData = {
        tier: 'free',
        status: 'inactive',
        isActive: false,
        isTrial: false,
        daysRemaining: 0,
        stripeCustomerId: customer.id,
        source: 'stripe_api',
        checkedAt: new Date().toISOString()
      };
      
      // ✅ FIX: Actually update Firestore when subscription is cancelled/expired!
      await admin.firestore().collection('users').doc(userId).set({
        ...inactiveData,
        email: userEmail,
        subscriptionId: null,  // Clear old subscription ID
        cancelAtPeriodEnd: false,
        currentPeriodEnd: null,
        lastSubscriptionCheck: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      
      console.log(`✅ User ${userId} marked as inactive (no active Stripe subscription)`);
      
      return inactiveData;
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

