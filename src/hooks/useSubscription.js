import { useState, useEffect, useCallback } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../firebase/config';

/**
 * Subscription hook for managing user subscription state
 * 
 * SAFEGUARDS ADDED:
 * 1. On mount: Call Cloud Function to check Stripe directly (syncs to Firebase!)
 * 2. Listen to Firestore for cached updates (faster subsequent loads)
 * 3. Auto-sync on login if Firebase has no subscription but Stripe does
 * 4. Periodic refresh every 5 min
 */
export function useSubscription(user) {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState(null);
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null); // 'syncing', 'synced', 'error'

  // Function to check subscription via Cloud Function (source of truth: Stripe)
  // This also SYNCS the subscription to Firebase!
  const refreshSubscriptionFromStripe = useCallback(async (forceSync = false) => {
    if (!user?.email) return;

    try {
      if (forceSync) {
        console.log('🔄 Force syncing subscription from Stripe...');
        setSyncStatus('syncing');
      } else {
        console.log('Checking subscription status from Stripe...');
      }
      
      const checkSubscription = httpsCallable(functions, 'checkSubscription');
      const result = await checkSubscription({ email: user.email });
      console.log('Subscription result from Stripe:', result.data);
      
      setSubscription(result.data);
      setLastCheck(Date.now());
      setLoading(false);
      
      if (forceSync) {
        setSyncStatus(result.data?.isActive ? 'synced' : 'no_subscription');
      }
      
      return result.data;
    } catch (error) {
      console.error('Error checking subscription from Stripe:', error);
      setSyncStatus('error');
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
      return null;
    }
  }, [user?.email]);

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

  // Check if user is returning (has visited before)
  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('nhlsavant_has_visited');
    setIsReturningUser(!!hasVisitedBefore);
    
    if (!hasVisitedBefore) {
      localStorage.setItem('nhlsavant_has_visited', 'true');
    }
  }, []);

  return {
    ...subscription,
    loading,
    isPremium: subscription?.isActive || false,
    isFree: subscription?.tier === 'free' || !subscription?.isActive,
    isReturningUser,
    syncStatus,
    refresh: refreshSubscriptionFromStripe // Pass true to force sync from Stripe
  };
}

