import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../firebase/config';

/**
 * Subscription hook for managing user subscription state
 * 
 * NEW APPROACH:
 * 1. On mount: Call Cloud Function to check Stripe directly
 * 2. Listen to Firestore for cached updates (faster subsequent loads)
 * 3. Periodically refresh from Stripe (every 5 min)
 */
export function useSubscription(user) {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState(null);

  // Function to check subscription via Cloud Function (source of truth: Stripe)
  const refreshSubscriptionFromStripe = async () => {
    if (!user?.email) return;

    try {
      console.log('Checking subscription status from Stripe...');
      const checkSubscription = httpsCallable(functions, 'checkSubscription');
      const result = await checkSubscription({ email: user.email });
      console.log('Subscription result from Stripe:', result.data);
      
      setSubscription(result.data);
      setLastCheck(Date.now());
      setLoading(false);
    } catch (error) {
      console.error('Error checking subscription from Stripe:', error);
      // Fallback to free tier on error
      setSubscription({
        tier: 'free',
        status: 'active',
        isActive: false,
        isTrial: false,
        daysRemaining: 0,
        error: error.message
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.uid) {
      setSubscription({
        tier: 'free',
        status: 'active',
        isActive: false,
        isTrial: false,
        daysRemaining: 0
      });
      setLoading(false);
      return;
    }

    // 1. First, check Stripe directly (source of truth)
    refreshSubscriptionFromStripe();

    // 2. Also listen to Firestore for cached updates (faster on subsequent loads)
    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        // Calculate trial days remaining
        let daysRemaining = 0;
        let isTrial = false;
        if (data.trialEndsAt && data.status === 'trialing') {
          const trialEnd = data.trialEndsAt.toDate();
          const now = new Date();
          const diffTime = trialEnd - now;
          daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          isTrial = daysRemaining > 0;
        }

        // Determine if subscription is active
        const isActive = ['active', 'trialing'].includes(data.status) && 
                        ['scout', 'elite', 'pro'].includes(data.tier);

        setSubscription({
          tier: data.tier || 'free',
          status: data.status || 'active',
          stripeCustomerId: data.stripeCustomerId,
          subscriptionId: data.subscriptionId,
          trialEndsAt: data.trialEndsAt,
          isActive,
          isTrial,
          daysRemaining: Math.max(0, daysRemaining),
          createdAt: data.createdAt,
          lastLoginAt: data.lastLoginAt
        });
      } else {
        // User document doesn't exist yet (shouldn't happen after auth)
        setSubscription({
          tier: 'free',
          status: 'active',
          isActive: false,
          isTrial: false,
          daysRemaining: 0
        });
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching subscription:', error);
      setLoading(false);
    });

    // 3. Set up periodic refresh from Stripe (every 5 minutes)
    const refreshInterval = setInterval(() => {
      const timeSinceLastCheck = Date.now() - (lastCheck || 0);
      if (timeSinceLastCheck > 5 * 60 * 1000) { // 5 minutes
        console.log('Refreshing subscription from Stripe (periodic check)...');
        refreshSubscriptionFromStripe();
      }
    }, 60 * 1000); // Check every minute if refresh is needed

    return () => {
      unsubscribe();
      clearInterval(refreshInterval);
    };
  }, [user?.uid, user?.email]);

  return {
    ...subscription,
    loading,
    isPremium: subscription?.isActive || false,
    isFree: subscription?.tier === 'free' || !subscription?.isActive,
    refresh: refreshSubscriptionFromStripe // Expose manual refresh
  };
}

