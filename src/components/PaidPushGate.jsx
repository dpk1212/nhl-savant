import { useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import {
  onesignalSyncPaidIdentity,
  onesignalLogout,
} from '../lib/onesignal';

/**
 * PaidPushGate — keep OneSignal External ID + `paid` tag in sync.
 *
 * Does NOT request notification permission. Opt-in lives on Account
 * (#/account) so users see directions and choose Enable Lock Alerts
 * (All plays vs Top tier EDGE 11+).
 *
 * Sign-out: clear External ID only (push subscription stays).
 * Paid visit: restore paid=all|edge11 if a flicker wrote paid=false.
 * Never client-untag. Stripe webhook is the only paid=false writer.
 * Client untag + no restore dropped paid, still-opted-in users from
 * Friday lock blasts while Account still showed Lock alerts on.
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

    if (!isPremium) return;

    const key = `paid:${user.uid}`;
    if (lastPaidKey.current === key) return;
    lastPaidKey.current = key;
    onesignalSyncPaidIdentity({ uid: user.uid });
  }, [user, isPremium, authLoading, subLoading]);

  return null;
}
