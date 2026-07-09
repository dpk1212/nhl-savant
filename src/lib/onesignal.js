/**
 * OneSignal helpers — Web Push for PAID ACTIVE users only.
 *
 * Init lives in index.html with autoPrompt disabled. Free / logged-out
 * visitors never see a permission prompt. Paid users (scout|elite|pro +
 * active|trialing) are opted in from PaidPushGate.
 *
 * App ID: d8fcb504-8d29-4354-a9e4-8b612d3eafeb
 * Service worker: /OneSignalSDKWorker.js
 */

function withOneSignal(fn) {
  if (typeof window === 'undefined') return Promise.resolve();
  window.OneSignalDeferred = window.OneSignalDeferred || [];
  return new Promise((resolve) => {
    window.OneSignalDeferred.push(async (OneSignal) => {
      try {
        await fn(OneSignal);
      } catch (err) {
        console.warn('[OneSignal]', err?.message || err);
      } finally {
        resolve();
      }
    });
  });
}

/** Link push subscription to Firebase uid (External ID). */
export function onesignalLogin(uid) {
  if (!uid) return Promise.resolve();
  return withOneSignal(async (OneSignal) => {
    await OneSignal.login(String(uid));
  });
}

/** Clear External ID on sign-out. */
export function onesignalLogout() {
  return withOneSignal(async (OneSignal) => {
    await OneSignal.logout();
  });
}

export function onesignalAddTags(tags) {
  if (!tags || typeof tags !== 'object') return Promise.resolve();
  return withOneSignal(async (OneSignal) => {
    await OneSignal.User.addTags(tags);
  });
}

/**
 * Paid-only subscribe: login → tag → request permission → opt in.
 * Safe to call repeatedly; no-ops if already opted in.
 */
export async function onesignalEnableForPaidUser({ uid, email, tier, status }) {
  if (!uid) return;
  await withOneSignal(async (OneSignal) => {
    await OneSignal.login(String(uid));
    await OneSignal.User.addTags({
      paid: 'true',
      tier: String(tier || ''),
      status: String(status || ''),
      email: email || '',
    });
    const already = OneSignal.User?.PushSubscription?.optedIn;
    if (already) return;
    // Native permission (dashboard Auto Prompt must be OFF)
    if (OneSignal.Notifications?.requestPermission) {
      await OneSignal.Notifications.requestPermission();
    }
    if (OneSignal.User?.PushSubscription?.optIn) {
      await OneSignal.User.PushSubscription.optIn();
    }
  });
}

/** When subscription lapses — stop push for this browser. */
export async function onesignalDisableForNonPaid() {
  await withOneSignal(async (OneSignal) => {
    await OneSignal.User.addTags({ paid: 'false' });
    if (OneSignal.User?.PushSubscription?.optOut) {
      await OneSignal.User.PushSubscription.optOut();
    }
  });
}
