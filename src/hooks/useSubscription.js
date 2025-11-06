import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Subscription hook for managing user subscription state
 * Syncs with Firestore users/{uid} collection in real-time
 */
export function useSubscription(user) {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

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

    // Subscribe to real-time updates from Firestore
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

    return () => unsubscribe();
  }, [user?.uid]);

  return {
    ...subscription,
    loading,
    isPremium: subscription?.isActive || false,
    isFree: subscription?.tier === 'free' || !subscription?.isActive
  };
}

