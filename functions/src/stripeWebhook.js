const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const db = admin.firestore();

/**
 * Stripe Webhook Handler
 * Handles subscription lifecycle events and updates Firestore
 */
exports.handleStripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
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
 */
async function handleCheckoutCompleted(session) {
  console.log('💰 Checkout completed:', session.id);

  const userId = session.client_reference_id;
  const customerId = session.customer;
  const subscriptionId = session.subscription;

  if (!userId) {
    console.error('No client_reference_id (userId) in session');
    return;
  }

  try {
    // Get subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const priceId = subscription.items.data[0].price.id;

    // Map price ID to tier
    const tier = getTierFromPriceId(priceId);

    // Calculate trial end date
    let trialEndsAt = null;
    if (subscription.trial_end) {
      trialEndsAt = admin.firestore.Timestamp.fromMillis(subscription.trial_end * 1000);
    }

    // Update user document
    const userRef = db.collection('users').doc(userId);
    await userRef.set({
      tier,
      status: subscription.status, // 'trialing', 'active', etc.
      stripeCustomerId: customerId,
      subscriptionId: subscriptionId,
      trialEndsAt: trialEndsAt,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    console.log(`✅ User ${userId} upgraded to ${tier} (${subscription.status})`);
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

    await userDoc.ref.update({
      tier,
      status: subscription.status,
      subscriptionId: subscription.id,
      trialEndsAt: trialEndsAt,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`✅ User ${userId} subscription created: ${tier}`);
  } catch (error) {
    console.error('Error handling subscription created:', error);
  }
}

/**
 * Handle subscription updated
 * Triggered when subscription status changes
 */
async function handleSubscriptionUpdated(subscription) {
  console.log('🔄 Subscription updated:', subscription.id);

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

    await userDoc.ref.update({
      tier,
      status: subscription.status, // 'active', 'past_due', 'canceled', etc.
      trialEndsAt: trialEndsAt,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`✅ User ${userId} subscription updated: ${tier} (${subscription.status})`);
  } catch (error) {
    console.error('Error handling subscription updated:', error);
  }
}

/**
 * Handle subscription deleted/canceled
 * Downgrade user to free tier
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

    // Downgrade to free tier
    await userDoc.ref.update({
      tier: 'free',
      status: 'canceled',
      subscriptionId: null,
      trialEndsAt: null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`✅ User ${userId} downgraded to free tier`);
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
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`✅ Payment succeeded for user ${userDoc.id}`);
  } catch (error) {
    console.error('Error handling payment succeeded:', error);
  }
}

/**
 * Handle failed payment
 * Mark subscription as past_due
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

    // Mark as past_due
    await userDoc.ref.update({
      status: 'past_due',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`⚠️ User ${userDoc.id} payment failed - marked as past_due`);
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

