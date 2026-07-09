/**
 * OneSignal helpers — Web Push for PAID ACTIVE users only.
 *
 * Init lives in index.html with autoPrompt disabled. Free / logged-out
 * visitors never see a permission prompt. Paid users opt in from Account
 * settings; PaidPushGate only syncs identity/tags (no auto-prompt).
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
 * Paid identity sync only — login + tags. Does NOT request permission.
 * Used by PaidPushGate so Account remains the opt-in surface.
 */
export async function onesignalSyncPaidIdentity({ uid, email, tier, status }) {
  if (!uid) return;
  await withOneSignal(async (OneSignal) => {
    await OneSignal.login(String(uid));
    await OneSignal.User.addTags({
      paid: 'true',
      tier: String(tier || ''),
      status: String(status || ''),
      email: email || '',
    });
  });
}

/**
 * Read current browser push state for Account UI.
 * @returns {{ supported: boolean, permission: boolean|'default'|false, optedIn: boolean, subscriptionId: string|null }}
 */
export async function onesignalGetPushStatus() {
  let result = {
    supported: false,
    permission: false,
    optedIn: false,
    subscriptionId: null,
  };
  await withOneSignal(async (OneSignal) => {
    const supported =
      typeof OneSignal.Notifications?.isPushSupported === 'function'
        ? await OneSignal.Notifications.isPushSupported()
        : !!OneSignal.Notifications?.permissionSupported;
    const permission = OneSignal.Notifications?.permission;
    const optedIn = !!OneSignal.User?.PushSubscription?.optedIn;
    const subscriptionId = OneSignal.User?.PushSubscription?.id || null;
    result = {
      supported: !!supported,
      permission: permission === true || permission === 'granted' ? true : permission === false || permission === 'denied' ? false : 'default',
      optedIn,
      subscriptionId,
    };
  });
  return result;
}

/**
 * Explicit opt-in from Account: login → tag → request permission → opt in.
 */
export async function onesignalEnableForPaidUser({ uid, email, tier, status }) {
  if (!uid) return { ok: false, reason: 'no_uid' };
  let outcome = { ok: false, reason: 'unknown' };
  await withOneSignal(async (OneSignal) => {
    await OneSignal.login(String(uid));
    await OneSignal.User.addTags({
      paid: 'true',
      tier: String(tier || ''),
      status: String(status || ''),
      email: email || '',
      lock_alerts: 'true',
    });
    if (OneSignal.Notifications?.requestPermission) {
      await OneSignal.Notifications.requestPermission();
    }
    if (OneSignal.User?.PushSubscription?.optIn) {
      await OneSignal.User.PushSubscription.optIn();
    }
    const optedIn = !!OneSignal.User?.PushSubscription?.optedIn;
    const permission = OneSignal.Notifications?.permission;
    outcome = {
      ok: optedIn,
      reason: optedIn
        ? 'subscribed'
        : permission === false || permission === 'denied'
          ? 'denied'
          : 'not_subscribed',
      optedIn,
      permission,
      subscriptionId: OneSignal.User?.PushSubscription?.id || null,
    };
  });
  return outcome;
}

/** Paid user turns off lock alerts on this browser. */
export async function onesignalOptOutPush() {
  await withOneSignal(async (OneSignal) => {
    await OneSignal.User.addTags({ lock_alerts: 'false' });
    if (OneSignal.User?.PushSubscription?.optOut) {
      await OneSignal.User.PushSubscription.optOut();
    }
  });
}

/** When subscription lapses — stop push for this browser. */
export async function onesignalDisableForNonPaid() {
  await withOneSignal(async (OneSignal) => {
    await OneSignal.User.addTags({ paid: 'false', lock_alerts: 'false' });
    if (OneSignal.User?.PushSubscription?.optOut) {
      await OneSignal.User.PushSubscription.optOut();
    }
  });
}
