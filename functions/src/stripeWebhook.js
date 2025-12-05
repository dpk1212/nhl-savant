const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Stripe = require('stripe');

const db = admin.firestore();

// Initialize Stripe lazily with correct Firebase config
let stripe = null;
const getStripe = () => {
  if (!stripe) {
    // Use Firebase config (set via: firebase functions:config:set stripe.secret_key="sk_...")
    const secretKey = functions.config().stripe?.secret_key || process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error('Stripe secret key not configured');
    }
    stripe = new Stripe(secretKey);
  }
  return stripe;
};

/**
 * Stripe Webhook Handler
 * Handles subscription lifecycle events and updates Firestore
 */
exports.handleStripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  // Use Firebase config for webhook secret
  const webhookSecret = functions.config().stripe?.webhook_secret || process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Initialize Stripe
    const stripeClient = getStripe();
    
    // Verify webhook signature
    event = stripeClient.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('⚠️ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('✅ Stripe Event:', event.type);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
      
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).send('Webhook processing failed');
  }
});

/**
 * Handle successful checkout session
 * Creates or updates user subscription in Firestore
 * 
 * FIX: If client_reference_id is missing, find user by email
 */
async function handleCheckoutCompleted(session) {
  console.log('💰 Checkout completed:', session.id);
  console.log('Session details:', {
    client_reference_id: session.client_reference_id,
    customer: session.customer,
    customer_email: session.customer_email,
    subscription: session.subscription
  });

  let userId = session.client_reference_id;
  const customerId = session.customer;
  const subscriptionId = session.subscription;
  const customerEmail = session.customer_email || session.customer_details?.email;

  // FIX: If no client_reference_id, try to find user by email
  if (!userId && customerEmail) {
    console.log(`No client_reference_id, searching for user by email: ${customerEmail}`);
    
    const usersSnapshot = await db.collection('users')
      .where('email', '==', customerEmail)
      .limit(1)
      .get();
    
    if (!usersSnapshot.empty) {
      userId = usersSnapshot.docs[0].id;
      console.log(`✅ Found user by email: ${userId}`);
    } else {
      console.error(`❌ No user found for email: ${customerEmail}`);
      console.error('User must sign up on the site BEFORE checking out!');
      return;
    }
  }

  if (!userId) {
    console.error('❌ No client_reference_id and no email to find user');
    return;
  }

  try {
    // Get subscription details from Stripe
    const stripeClient = getStripe();
    const subscription = await stripeClient.subscriptions.retrieve(subscriptionId);
    const priceId = subscription.items.data[0].price.id;

    // Map price ID to tier
    const tier = getTierFromPriceId(priceId);

    // Calculate trial end date
    let trialEndsAt = null;
    if (subscription.trial_end) {
      trialEndsAt = admin.firestore.Timestamp.fromMillis(subscription.trial_end * 1000);
    }

    // Update user document with ALL subscription fields
    const userRef = db.collection('users').doc(userId);
    const isActive = ['active', 'trialing'].includes(subscription.status);
    const isTrial = subscription.status === 'trialing';
    
    await userRef.set({
      tier,
      status: subscription.status, // 'trialing', 'active', etc.
      isActive,  // ✅ FIX: Include isActive field
      isTrial,   // ✅ FIX: Include isTrial field
      stripeCustomerId: customerId,
      subscriptionId: subscriptionId,
      trialEndsAt: trialEndsAt,
      currentPeriodEnd: subscription.current_period_end 
        ? new Date(subscription.current_period_end * 1000).toISOString() 
        : null,
      cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    console.log(`✅ User ${userId} upgraded to ${tier} (${subscription.status}, isActive: ${isActive})`);
  } catch (error) {
    console.error('Error handling checkout:', error);
    throw error;
  }
}

/**
 * Handle subscription created
 */
async function handleSubscriptionCreated(subscription) {
  console.log('🆕 Subscription created:', subscription.id);

  const customerId = subscription.customer;
  const priceId = subscription.items.data[0].price.id;
  const tier = getTierFromPriceId(priceId);

  try {
    // Find user by customer ID
    const usersSnapshot = await db.collection('users')
      .where('stripeCustomerId', '==', customerId)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      console.error('No user found for customer:', customerId);
      return;
    }

    const userDoc = usersSnapshot.docs[0];
    const userId = userDoc.id;

    let trialEndsAt = null;
    if (subscription.trial_end) {
      trialEndsAt = admin.firestore.Timestamp.fromMillis(subscription.trial_end * 1000);
    }

    const isActive = ['active', 'trialing'].includes(subscription.status);
    const isTrial = subscription.status === 'trialing';
    
    await userDoc.ref.update({
      tier,
      status: subscription.status,
      isActive,  // ✅ FIX: Include isActive field
      isTrial,   // ✅ FIX: Include isTrial field
      subscriptionId: subscription.id,
      trialEndsAt: trialEndsAt,
      currentPeriodEnd: subscription.current_period_end 
        ? new Date(subscription.current_period_end * 1000).toISOString() 
        : null,
      cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`✅ User ${userId} subscription created: ${tier} (isActive: ${isActive})`);
  } catch (error) {
    console.error('Error handling subscription created:', error);
  }
}

/**
 * Handle subscription updated
 * Triggered when subscription status changes (including cancellation scheduled)
 */
async function handleSubscriptionUpdated(subscription) {
  console.log('🔄 Subscription updated:', subscription.id, 'status:', subscription.status);

  const customerId = subscription.customer;
  const priceId = subscription.items.data[0].price.id;
  const tier = getTierFromPriceId(priceId);

  try {
    // Find user by customer ID
    const usersSnapshot = await db.collection('users')
      .where('stripeCustomerId', '==', customerId)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      console.error('No user found for customer:', customerId);
      return;
    }

    const userDoc = usersSnapshot.docs[0];
    const userId = userDoc.id;

    let trialEndsAt = null;
    if (subscription.trial_end) {
      trialEndsAt = admin.firestore.Timestamp.fromMillis(subscription.trial_end * 1000);
    }

    // ✅ FIX: Properly determine active status
    // A subscription is only truly active if status is active/trialing AND not expired
    const isActive = ['active', 'trialing'].includes(subscription.status);
    const isTrial = subscription.status === 'trialing';
    
    // Calculate days remaining
    let daysRemaining = 0;
    if (subscription.current_period_end) {
      const periodEnd = new Date(subscription.current_period_end * 1000);
      const now = new Date();
      const diffTime = periodEnd - now;
      daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }

    await userDoc.ref.update({
      tier: isActive ? tier : 'free',  // Downgrade tier if not active
      status: subscription.status, // 'active', 'past_due', 'canceled', etc.
      isActive,
      isTrial,
      daysRemaining,
      trialEndsAt: trialEndsAt,
      currentPeriodEnd: subscription.current_period_end 
        ? new Date(subscription.current_period_end * 1000).toISOString() 
        : null,
      cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`✅ User ${userId} subscription updated: ${tier} (status: ${subscription.status}, isActive: ${isActive}, cancelAtPeriodEnd: ${subscription.cancel_at_period_end})`);
  } catch (error) {
    console.error('Error handling subscription updated:', error);
  }
}

/**
 * Handle subscription deleted/canceled
 * Downgrade user to free tier - THIS IS THE CRITICAL ONE!
 */
async function handleSubscriptionDeleted(subscription) {
  console.log('❌ Subscription deleted:', subscription.id);

  const customerId = subscription.customer;

  try {
    // Find user by customer ID
    const usersSnapshot = await db.collection('users')
      .where('stripeCustomerId', '==', customerId)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      console.error('No user found for customer:', customerId);
      return;
    }

    const userDoc = usersSnapshot.docs[0];
    const userId = userDoc.id;

    // ✅ FIX: Downgrade to free tier with ALL fields updated
    await userDoc.ref.update({
      tier: 'free',
      status: 'canceled',
      isActive: false,        // ✅ CRITICAL: Mark as inactive!
      isTrial: false,
      daysRemaining: 0,
      subscriptionId: null,
      trialEndsAt: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`✅ User ${userId} downgraded to free tier (isActive: false)`);
  } catch (error) {
    console.error('Error handling subscription deleted:', error);
  }
}

/**
 * Handle successful payment
 */
async function handlePaymentSucceeded(invoice) {
  console.log('💳 Payment succeeded:', invoice.id);

  const customerId = invoice.customer;
  const subscriptionId = invoice.subscription;

  try {
    // Find user by customer ID
    const usersSnapshot = await db.collection('users')
      .where('stripeCustomerId', '==', customerId)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      console.error('No user found for customer:', customerId);
      return;
    }

    const userDoc = usersSnapshot.docs[0];

    // Update status to active if it was past_due
    await userDoc.ref.update({
      status: 'active',
      isActive: true,  // ✅ FIX: Ensure isActive is set
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`✅ Payment succeeded for user ${userDoc.id} (isActive: true)`);
  } catch (error) {
    console.error('Error handling payment succeeded:', error);
  }
}

/**
 * Handle failed payment
 * Mark subscription as past_due but keep access (Stripe handles grace period)
 */
async function handlePaymentFailed(invoice) {
  console.log('⚠️ Payment failed:', invoice.id);

  const customerId = invoice.customer;

  try {
    // Find user by customer ID
    const usersSnapshot = await db.collection('users')
      .where('stripeCustomerId', '==', customerId)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      console.error('No user found for customer:', customerId);
      return;
    }

    const userDoc = usersSnapshot.docs[0];

    // Mark as past_due (keep isActive true during grace period - Stripe handles final cancellation)
    await userDoc.ref.update({
      status: 'past_due',
      // Note: Keep isActive true during payment retry period
      // Stripe will send subscription.deleted when all retries fail
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`⚠️ User ${userDoc.id} payment failed - marked as past_due (still has access during grace period)`);
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}

/**
 * Map Stripe Price ID to subscription tier
 */
function getTierFromPriceId(priceId) {
  // Map your Stripe price IDs to tiers
  const priceMap = {
    // These are the price IDs from your Stripe payment links
    // You'll need to extract the actual price IDs from your Stripe dashboard
    'price_scout': 'scout',
    'price_elite': 'elite',
    'price_pro': 'pro'
  };

  // For now, extract from payment link patterns
  // You'll need to update this with actual price IDs from Stripe
  if (priceId.includes('scout') || priceId.includes('7.99') || priceId.includes('week')) {
    return 'scout';
  } else if (priceId.includes('elite') || priceId.includes('25.99') || priceId.includes('month')) {
    return 'elite';
  } else if (priceId.includes('pro') || priceId.includes('150') || priceId.includes('year')) {
    return 'pro';
  }

  console.warn('Unknown price ID:', priceId);
  return 'free';
}

