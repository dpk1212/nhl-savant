/**
 * OneSignal helpers — Web Push SDK is initialized in index.html.
 * Use these from React to identify users and tag segments.
 *
 * App ID: d8fcb504-8d29-4354-a9e4-8b612d3eafeb (public client id)
 * Service worker: /OneSignalSDKWorker.js (must stay at site root)
 */

function withOneSignal(fn) {
  if (typeof window === 'undefined') return;
  window.OneSignalDeferred = window.OneSignalDeferred || [];
  window.OneSignalDeferred.push(async (OneSignal) => {
    try {
      await fn(OneSignal);
    } catch (err) {
      console.warn('[OneSignal]', err?.message || err);
    }
  });
}

/** Link the current push subscription to a Firebase uid (External ID). */
export function onesignalLogin(uid) {
  if (!uid) return;
  withOneSignal(async (OneSignal) => {
    await OneSignal.login(String(uid));
  });
}

/** Clear External ID on sign-out (keeps anonymous push subscription). */
export function onesignalLogout() {
  withOneSignal(async (OneSignal) => {
    await OneSignal.logout();
  });
}

/** Set tags for segmentation (e.g. { tier: 'premium', sport: 'MLB' }). */
export function onesignalAddTags(tags) {
  if (!tags || typeof tags !== 'object') return;
  withOneSignal(async (OneSignal) => {
    await OneSignal.User.addTags(tags);
  });
}
