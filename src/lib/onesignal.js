/**
 * OneSignal helpers — Web Push for PAID ACTIVE users only.
 *
 * Init lives in index.html with autoPrompt disabled. Free / logged-out
 * visitors never see a permission prompt. Paid users opt in from Account
 * settings; PaidPushGate only syncs identity + the `paid` tag.
 *
 * Option A: logout clears External ID only (device stays subscribed so
 * lock alerts work without being signed in). Lapse/free → paid=false + optOut.
 *
 * Tag plan limit: only use the single tag `paid` ("true"|"false"). Extra
 * tags (tier/email/lock_alerts) hit OneSignal entitlements-tag-limit (409).
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

/** Set tags — keep payloads tiny (plan tag limit). */
export function onesignalAddTags(tags) {
  if (!tags || typeof tags !== 'object') return Promise.resolve();
  return withOneSignal(async (OneSignal) => {
    await OneSignal.User.addTags(tags);
  });
}

/**
 * Paid identity sync only — login + paid=true. Does NOT request permission.
 * Used by PaidPushGate so Account remains the opt-in surface.
 */
export async function onesignalSyncPaidIdentity({ uid }) {
  if (!uid) return;
  await withOneSignal(async (OneSignal) => {
    await OneSignal.login(String(uid));
    await OneSignal.User.addTags({ paid: 'true' });
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

/** Welcome push after first successful Enable (template Lock Alerts Enabled). */
export const ONESIGNAL_ENABLE_TEMPLATE_ID = '43652cb9-f99a-47a7-a0ce-2eea9a1001e4';
export const ONESIGNAL_LOCK_TEMPLATE_ID = '451e41a3-2bdf-4758-a779-ec59a8fecf36';

/**
 * Explicit opt-in from Account: login → paid=true → request permission → opt in.
 */
export async function onesignalEnableForPaidUser({ uid }) {
  if (!uid) return { ok: false, reason: 'no_uid' };
  let outcome = { ok: false, reason: 'unknown' };
  await withOneSignal(async (OneSignal) => {
    await OneSignal.login(String(uid));
    await OneSignal.User.addTags({ paid: 'true' });
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

/** Paid user turns off lock alerts on this browser (keeps paid tag). */
export async function onesignalOptOutPush() {
  await withOneSignal(async (OneSignal) => {
    if (OneSignal.User?.PushSubscription?.optOut) {
      await OneSignal.User.PushSubscription.optOut();
    }
  });
}

/** When subscription lapses — untag + stop push for this browser. */
export async function onesignalDisableForNonPaid() {
  await withOneSignal(async (OneSignal) => {
    await OneSignal.User.addTags({ paid: 'false' });
    if (OneSignal.User?.PushSubscription?.optOut) {
      await OneSignal.User.PushSubscription.optOut();
    }
  });
}
