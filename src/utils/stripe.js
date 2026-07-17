import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase/config';
import { trackEvent } from './analytics';

/**
 * Redirect to Stripe Checkout via Cloud Function
 * 
 * Uses a server-side Checkout Session instead of Payment Links.
 * This guarantees one Stripe customer per Firebase user (no duplicates).
 */
export async function redirectToCheckout(tier, user) {
  if (!tier || !['scout', 'elite', 'pro'].includes(tier)) {
    console.error('Invalid tier:', tier);
    alert('Invalid subscription tier.');
    return;
  }

  if (!user?.uid) {
    console.error('No authenticated user');
    alert('Please sign in first.');
    return;
  }

  try {
    console.log('Creating checkout session for tier:', tier);
    // GA4 recommended event — single choke point covering every checkout
    // entry (Sharp Flow paywall, Pricing page, post-auth continuation).
    trackEvent('begin_checkout', {
      currency: 'USD',
      value: PRICING[tier].price,
      items: [{ item_id: tier, item_name: PRICING[tier].name }],
      trial_days: PRICING[tier].trialDays,
    });
    const createCheckoutSession = httpsCallable(functions, 'createCheckoutSession');
    const result = await createCheckoutSession({ tier });

    if (result.data?.url) {
      window.location.href = result.data.url;
    } else {
      throw new Error('No checkout URL returned');
    }
  } catch (error) {
    console.error('Checkout error:', error);
    const message = error?.message || '';
    if (message.includes('already have an active subscription')) {
      alert('You already have an active subscription. Manage it from your Account page.');
    } else {
      alert('Unable to start checkout. Please try again or contact support.');
    }
  }
}

/**
 * Tier pricing information
 */
export const PRICING = {
  scout: {
    name: 'Scout',
    price: 7.99,
    currency: 'USD',
    interval: 'week',
    trialDays: 5
  },
  elite: {
    name: 'Elite',
    price: 25.99,
    currency: 'USD',
    interval: 'month',
    trialDays: 7,
    popular: true
  },
  pro: {
    name: 'SAVANT PRO',
    price: 150.00,
    currency: 'USD',
    interval: 'year',
    trialDays: 10,
    savings: 'Save 50%'
  }
};

