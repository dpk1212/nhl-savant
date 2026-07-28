/**
 * OneSignal helpers — Web Push for PAID ACTIVE users only.
 *
 * Init lives in index.html with autoPrompt disabled. Free / logged-out
 * visitors never see a permission prompt. Paid users opt in from Account
 * settings; PaidPushGate only syncs identity + the `paid` tag.
 *
 * Persistence (critical):
 * - Explicit Enable → optIn. Explicit Turn off → optOut.
 * - We NEVER auto-optOut on free/lapse/logout. Audience is gated by tag
 *   paid ∈ {all, edge11, true} in sendLockAlerts. Auto-optOut was wiping
 *   Enable after brief isPremium=false races (Stripe sync lag / check errors).
 * - Logout clears External ID only (device stays subscribed).
 * - Lapse/free → paid=false only (stops sends; subscription stays so
 *   re-subscribe resumes alerts without tapping Enable again).
 *
 * Tag plan limit: only use the single tag `paid`. Values:
 *   all | edge11 | false  (legacy `true` = all)
 * Extra tags (tier/email/lock_alerts) hit OneSignal entitlements-tag-limit (409).
 *
 * App ID: d8fcb504-8d29-4354-a9e4-8b612d3eafeb
 * Service worker: /OneSignalSDKWorker.js
 */

import {
  LOCK_ALERT_MODE,
  normalizeLockAlertMode,
  paidTagForEntitlement,
} from './lockAlertMode.js';

export {
  LOCK_ALERT_MODE,
  LOCK_ALERT_EDGE_MIN,
  normalizeLockAlertMode,
} from './lockAlertMode.js';

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

async function readPaidTag(OneSignal) {
  try {
    if (typeof OneSignal.User?.getTags === 'function') {
      const tags = await OneSignal.User.getTags();
      return tags?.paid ?? null;
    }
  } catch (_) {
    /* ignore */
  }
  return null;
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
 * Paid identity sync only — login + preserve lock preference.
 * Does NOT request permission. Used by PaidPushGate.
 * Never overwrites edge11/all with legacy true.
 */
export async function onesignalSyncPaidIdentity({ uid }) {
  if (!uid) return;
  await withOneSignal(async (OneSignal) => {
    await OneSignal.login(String(uid));
    const current = await readPaidTag(OneSignal);
    const next = paidTagForEntitlement(current);
    await OneSignal.User.addTags({ paid: next });
  });
}

/**
 * Read current browser push state for Account UI.
 * @returns {{ supported: boolean, permission: boolean|'default'|false, optedIn: boolean, subscriptionId: string|null, lockMode: 'all'|'edge11'|'false' }}
 */
export async function onesignalGetPushStatus() {
  let result = {
    supported: false,
    permission: false,
    optedIn: false,
    subscriptionId: null,
    lockMode: LOCK_ALERT_MODE.ALL,
  };
  await withOneSignal(async (OneSignal) => {
    const supported =
      typeof OneSignal.Notifications?.isPushSupported === 'function'
        ? await OneSignal.Notifications.isPushSupported()
        : !!OneSignal.Notifications?.permissionSupported;
    const permission = OneSignal.Notifications?.permission;
    const optedIn = !!OneSignal.User?.PushSubscription?.optedIn;
    const subscriptionId = OneSignal.User?.PushSubscription?.id || null;
    const paidTag = await readPaidTag(OneSignal);
    const lockMode = normalizeLockAlertMode(paidTag);
    result = {
      supported: !!supported,
      permission: permission === true || permission === 'granted' ? true : permission === false || permission === 'denied' ? false : 'default',
      optedIn,
      subscriptionId,
      // UI default for radios: OFF → show All as selected when enabling
      lockMode: lockMode === LOCK_ALERT_MODE.OFF ? LOCK_ALERT_MODE.ALL : lockMode,
    };
  });
  return result;
}

/** Welcome push after first successful Enable (template Lock Alerts Enabled). */
export const ONESIGNAL_ENABLE_TEMPLATE_ID = '43652cb9-f99a-47a7-a0ce-2eea9a1001e4';
export const ONESIGNAL_LOCK_TEMPLATE_ID = '451e41a3-2bdf-4758-a779-ec59a8fecf36';

/**
 * Explicit opt-in from Account: login → paid=all|edge11 → request permission → opt in.
 * @param {{ uid: string, mode?: 'all'|'edge11' }} opts
 */
export async function onesignalEnableForPaidUser({ uid, mode = LOCK_ALERT_MODE.ALL }) {
  if (!uid) return { ok: false, reason: 'no_uid' };
  const paidValue =
    mode === LOCK_ALERT_MODE.EDGE11 ? LOCK_ALERT_MODE.EDGE11 : LOCK_ALERT_MODE.ALL;
  let outcome = { ok: false, reason: 'unknown' };
  await withOneSignal(async (OneSignal) => {
    await OneSignal.login(String(uid));
    await OneSignal.User.addTags({ paid: paidValue });
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
      lockMode: paidValue,
    };
  });
  return outcome;
}

/**
 * Change lock alert mode while already subscribed (no permission prompt).
 * @param {'all'|'edge11'} mode
 */
export async function onesignalSetLockAlertMode(mode) {
  const paidValue =
    mode === LOCK_ALERT_MODE.EDGE11 ? LOCK_ALERT_MODE.EDGE11 : LOCK_ALERT_MODE.ALL;
  await withOneSignal(async (OneSignal) => {
    await OneSignal.User.addTags({ paid: paidValue });
  });
  return paidValue;
}

/** Paid user turns off lock alerts on this browser (keeps paid preference tag). */
export async function onesignalOptOutPush() {
  await withOneSignal(async (OneSignal) => {
    if (OneSignal.User?.PushSubscription?.optOut) {
      await OneSignal.User.PushSubscription.optOut();
    }
  });
}

/**
 * When subscription lapses / free path — untag only.
 * Do NOT optOut: that made Account flip "Lock alerts off" after Enable
 * whenever isPremium briefly read false. Sends already require paid=all|edge11|true.
 */
export async function onesignalDisableForNonPaid() {
  await withOneSignal(async (OneSignal) => {
    await OneSignal.User.addTags({ paid: LOCK_ALERT_MODE.OFF });
  });
}
