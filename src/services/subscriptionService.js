import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Stripe Price IDs for each tier
 * These match the payment links provided
 */
export const STRIPE_PRICES = {
  scout: 'price_1QRu1eIRTqv9BYnSm3prmj02',  // $7.99/week, 5-day trial
  elite: 'price_1QRu1eIRTqv9BYnSm3prmj03',  // $25.99/month, 7-day trial
  pro: 'price_1QRu1eIRTqv9BYnSm3prmj00'    // $150/year, 10-day trial
};

/**
 * Tier display information
 */
export const TIER_INFO = {
  scout: {
    name: 'Scout',
    price: '$7.99',
    period: 'week',
    trial: '5-day',
    description: 'Test Drive +EV Betting',
    features: [
      'All daily picks',
      'Performance tracking',
      'Expert analysis',
      'Model transparency'
    ]
  },
  elite: {
    name: 'Elite',
    price: '$25.99',
    period: 'month',
    trial: '7-day',
    description: 'Serious +EV Hunter',
    popular: true,
    features: [
      'All daily picks',
      'Performance tracking',
      'Expert analysis',
      'Model transparency',
      'Priority support'
    ]
  },
  pro: {
    name: 'SAVANT PRO',
    price: '$150',
    period: 'year',
    trial: '10-day',
    description: 'Professional Edge Seeker',
    savings: 'Save 50% vs monthly',
    features: [
      'All daily picks',
      'Performance tracking',
      'Expert analysis',
      'Model transparency',
      'Priority support',
      'Annual performance reports'
    ]
  }
};

/**
 * Check if user has an active subscription
 */
export async function checkSubscriptionStatus(user) {
  if (!user?.uid) {
    return { tier: 'free', isActive: false };
  }

  try {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return { tier: 'free', isActive: false };
    }

    const data = userDoc.data();
    const isActive = ['active', 'trialing'].includes(data.status) && 
                    ['scout', 'elite', 'pro'].includes(data.tier);

    return {
      tier: data.tier || 'free',
      status: data.status,
      isActive,
      isTrial: data.status === 'trialing',
      stripeCustomerId: data.stripeCustomerId,
      subscriptionId: data.subscriptionId
    };
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return { tier: 'free', isActive: false };
  }
}

/**
 * Create Stripe checkout session
 * Redirects user to Stripe checkout page
 */
export async function createCheckoutSession(user, tier) {
  if (!user?.uid) {
    throw new Error('User must be authenticated to subscribe');
  }

  const priceId = STRIPE_PRICES[tier];
  if (!priceId) {
    throw new Error(`Invalid tier: ${tier}`);
  }

  try {
    // Get the Stripe payment link (we're using pre-built payment links)
    const paymentLinks = {
      scout: 'https://buy.stripe.com/aFa9ATg5U3UfdMl6a11Jm02',
      elite: 'https://buy.stripe.com/aFaeVdg5UduP6jT6a11Jm03',
      pro: 'https://buy.stripe.com/aFa5kD06WcqL0Zz0PH1Jm00'
    };

    // For now, redirect to Stripe payment link
    // In production, you'd want to add client_reference_id to link user
    const paymentLink = paymentLinks[tier];
    
    // Add user email as URL parameter if possible
    const url = new URL(paymentLink);
    if (user.email) {
      url.searchParams.set('prefilled_email', user.email);
    }
    // Add client reference ID to identify user after payment
    url.searchParams.set('client_reference_id', user.uid);

    return url.toString();
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

/**
 * Get Stripe Customer Portal URL
 * For managing billing, invoices, and cancellations
 */
export async function getCustomerPortalUrl(user) {
  if (!user?.uid) {
    throw new Error('User must be authenticated');
  }

  try {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists() || !userDoc.data().stripeCustomerId) {
      throw new Error('No Stripe customer found');
    }

    // This would typically call a Cloud Function to generate portal session
    // For now, return null and handle in UI
    console.log('Customer portal URL generation requires backend implementation');
    return null;
  } catch (error) {
    console.error('Error getting customer portal URL:', error);
    throw error;
  }
}

/**
 * Cancel subscription
 * This should call a Cloud Function to cancel via Stripe API
 */
export async function cancelSubscription(subscriptionId) {
  if (!subscriptionId) {
    throw new Error('No subscription ID provided');
  }

  try {
    // This would call a Cloud Function to cancel the subscription
    // For now, direct users to Stripe Customer Portal
    console.log('Subscription cancellation requires backend implementation');
    throw new Error('Please use the billing portal to manage your subscription');
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
}

