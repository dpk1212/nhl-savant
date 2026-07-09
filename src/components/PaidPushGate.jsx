import { useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import {
  onesignalEnableForPaidUser,
  onesignalDisableForNonPaid,
  onesignalLogout,
} from '../lib/onesignal';

/**
 * PaidPushGate — OneSignal is for paid active users only.
 *
 * isPremium = tier in scout|elite|pro AND status in active|trialing
 * (same rule as useSubscription). Free / logged-out never get prompted.
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
      onesignalEnableForPaidUser({
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
