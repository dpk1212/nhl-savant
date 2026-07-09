import { useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import {
  onesignalSyncPaidIdentity,
  onesignalDisableForNonPaid,
  onesignalLogout,
} from '../lib/onesignal';

/**
 * PaidPushGate — keep OneSignal identity/tags in sync for paid users.
 *
 * Does NOT request notification permission. Opt-in lives on Account
 * (#/account) so users see directions and choose Enable Lock Alerts.
 *
 * Option A entitlement: sign-out only clears External ID (subscription
 * stays — alerts still fire offline). Sub lapse → optOut + paid=false.
 *
 * isPremium = tier in scout|elite|pro AND status in active|trialing
 */
export default function PaidPushGate() {
  const { user, loading: authLoading } = useAuth();
  const { isPremium, loading: subLoading, tier, status } = useSubscription(user);
  const lastKey = useRef('');

  useEffect(() => {
    if (authLoading || subLoading) return;

    if (!user) {
      if (lastKey.current !== 'anon') {
        lastKey.current = 'anon';
        onesignalLogout();
      }
      return;
    }

    const key = `${user.uid}:${isPremium ? 'paid' : 'free'}:${tier || ''}`;
    if (lastKey.current === key) return;
    lastKey.current = key;

    if (isPremium) {
      onesignalSyncPaidIdentity({
        uid: user.uid,
        email: user.email,
        tier,
        status,
      });
    } else {
      onesignalDisableForNonPaid();
    }
  }, [user, isPremium, authLoading, subLoading, tier, status]);

  return null;
}
