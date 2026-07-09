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
 * Sign-out: clear External ID only (push subscription stays).
 * Sub lapse / free: paid=false tag only — never optOut (that wiped
 * persistent Enable when isPremium briefly flickered false).
 *
 * Free-path is deferred ~5s so Stripe background sync can promote
 * free→paid without a false untag race on login.
 */
export default function PaidPushGate() {
  const { user, loading: authLoading } = useAuth();
  const { isPremium, loading: subLoading } = useSubscription(user);
  const lastPaidKey = useRef('');
  // Once we've confirmed paid this session, never auto-untag on a flicker.
  // Only clear when user signs out or we see a stable free after the delay.
  const confirmedPaidUid = useRef(null);

  useEffect(() => {
    if (authLoading || subLoading) return;

    if (!user) {
      lastPaidKey.current = 'anon';
      confirmedPaidUid.current = null;
      onesignalLogout();
      return;
    }

    if (isPremium) {
      const key = `paid:${user.uid}`;
      confirmedPaidUid.current = user.uid;
      if (lastPaidKey.current === key) return;
      lastPaidKey.current = key;
      onesignalSyncPaidIdentity({ uid: user.uid });
      return;
    }

    // Not premium yet — wait for Stripe sync before untagging.
    // If we already confirmed paid this session, skip untag (flicker guard).
    const uid = user.uid;
    const timer = setTimeout(() => {
      if (confirmedPaidUid.current === uid) {
        // Still showing free after delay but we knew them paid — leave tags.
        // Stripe webhook / next successful sync will correct if they truly lapsed.
        return;
      }
      const key = `free:${uid}`;
      if (lastPaidKey.current === key) return;
      lastPaidKey.current = key;
      onesignalDisableForNonPaid();
    }, 5000);

    return () => clearTimeout(timer);
  }, [user, isPremium, authLoading, subLoading]);

  return null;
}
