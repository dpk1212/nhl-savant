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

    // Step 1: Find Stripe customer by email
    const customers = await stripe.customers.list({
      email: userEmail,
      limit: 1
    });

    let customerId;

    if (customers.data.length === 0) {
      // No customer exists - create one
      console.log('No customer found, creating new customer');
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          firebaseUID: userId
        }
      });
      customerId = customer.id;

      // Save customer ID to Firestore
      await admin.firestore().collection('users').doc(userId).set({
        stripeCustomerId: customerId,
        email: userEmail
      }, { merge: true });
    } else {
      customerId = customers.data[0].id;
      console.log(`Found existing customer: ${customerId}`);
    }

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

