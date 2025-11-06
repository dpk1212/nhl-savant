import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe (publishable key)
let stripePromise = null;

export const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    
    if (!publishableKey) {
      console.warn('Stripe publishable key not configured');
      return null;
    }

    stripePromise = loadStripe(publishableKey);
  }
  
  return stripePromise;
};

/**
 * Redirect to Stripe checkout
 * Using pre-built Stripe payment links
 */
export async function redirectToCheckout(tier, user) {
  const paymentLinks = {
    scout: 'https://buy.stripe.com/aFa9ATg5U3UfdMl6a11Jm02',
    elite: 'https://buy.stripe.com/aFaeVdg5UduP6jT6a11Jm03',
    pro: 'https://buy.stripe.com/aFa5kD06WcqL0Zz0PH1Jm00'
  };

  const paymentLink = paymentLinks[tier];
  if (!paymentLink) {
    throw new Error(`Invalid tier: ${tier}`);
  }

  // Add user metadata as URL parameters
  const url = new URL(paymentLink);
  
  if (user?.email) {
    url.searchParams.set('prefilled_email', user.email);
  }
  
  if (user?.uid) {
    url.searchParams.set('client_reference_id', user.uid);
  }

  // Redirect to Stripe checkout
  window.location.href = url.toString();
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
    trialDays: 2
  },
  elite: {
    name: 'Elite',
    price: 25.99,
    currency: 'USD',
    interval: 'month',
    trialDays: 3,
    popular: true
  },
  pro: {
    name: 'SAVANT PRO',
    price: 150.00,
    currency: 'USD',
    interval: 'year',
    trialDays: 5,
    savings: 'Save 50%'
  }
};

