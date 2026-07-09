import { useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import {
  onesignalSyncPaidIdentity,
  onesignalDisableForNonPaid,
  onesignalLogout,
} from '../lib/onesignal';

/**
 * PaidPushGate — keep OneSignal External ID + `paid` tag in sync.
 *
 * Does NOT request notification permission. Opt-in lives on Account
 * (#/account) so users see directions and choose Enable Lock Alerts.
 *
 * Option A: sign-out only clears External ID (subscription stays).
 * Sub lapse → paid=false + optOut.
 *
 * Free-path is deferred ~5s so Stripe background sync can promote
 * free→paid without a false untag race on login.
 */
export default function PaidPushGate() {
  const { user, loading: authLoading } = useAuth();
  const { isPremium, loading: subLoading } = useSubscription(user);
  const lastPaidKey = useRef('');

  useEffect(() => {
    if (authLoading || subLoading) return;

    if (!user) {
      lastPaidKey.current = 'anon';
      onesignalLogout();
      return;
    }

    if (isPremium) {
      const key = `paid:${user.uid}`;
      if (lastPaidKey.current === key) return;
      lastPaidKey.current = key;
      onesignalSyncPaidIdentity({ uid: user.uid });
      return;
    }

    // Not premium yet — wait for Stripe sync before untagging.
    const uid = user.uid;
    const timer = setTimeout(() => {
      const key = `free:${uid}`;
      if (lastPaidKey.current === key) return;
      lastPaidKey.current = key;
      onesignalDisableForNonPaid();
    }, 5000);

    return () => clearTimeout(timer);
  }, [user, isPremium, authLoading, subLoading]);

  return null;
}
