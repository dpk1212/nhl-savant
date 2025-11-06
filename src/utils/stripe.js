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
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to: https://dashboard.stripe.com/test/payment-links
 * 2. Click "New" to create a payment link for each tier
 * 3. Configure:
 *    - Scout: $7.99/week with 2-day trial
 *    - Elite: $25.99/month with 3-day trial  
 *    - Pro: $150/year with 5-day trial
 * 4. In "After payment" settings, set success URL to: https://yourdomain.com/?checkout=success
 * 5. Copy the payment link URL (starts with https://buy.stripe.com/...)
 * 6. Paste it below
 * 7. IMPORTANT: In product settings, add metadata: tier=scout (or elite/pro)
 */
export async function redirectToCheckout(tier, user) {
  // ✅ CONFIGURED - Your actual Stripe payment links
  const paymentLinks = {
    scout: 'https://buy.stripe.com/aFa9ATg5U3UfdMl6a11Jm02',
    elite: 'https://buy.stripe.com/aFaeVdg5UduP6jT6a11Jm03',
    pro: 'https://buy.stripe.com/aFa5kD06WcqL0Zz0PH1Jm00'
  };

  const paymentLink = paymentLinks[tier];
  
  // Check if payment links are configured
  if (!paymentLink || paymentLink.includes('YOUR_')) {
    console.error('⚠️ Stripe payment links not configured!');
    alert('Payment system is not configured yet. Please contact support.');
    return;
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
  console.log('Redirecting to Stripe checkout:', tier);
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

