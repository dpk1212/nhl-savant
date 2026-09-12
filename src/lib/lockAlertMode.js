/**
 * Lock alert preference encoded in the single OneSignal tag `paid`
 * (org plan allows only one custom tag — see ONESIGNAL.md).
 *
 * Values:
 *   all     — every staked lock (default / migrates legacy `true`)
 *   edge11  — only locks with EDGE ≥ LOCK_ALERT_EDGE_MIN
 *   false   — not entitled / lapsed (no sends)
 *   true    — legacy; treated as `all` by send filters + normalizers
 */

export const LOCK_ALERT_EDGE_MIN = 11;

export const LOCK_ALERT_MODE = Object.freeze({
  ALL: 'all',
  EDGE11: 'edge11',
  OFF: 'false',
});

/** Browser-only cache so All vs Top does not snap back when OneSignal getTags is stale/empty. */
export const LOCK_ALERT_MODE_STORAGE_KEY = 'nhlSavant.lockAlertMode';

export function isLockAlertMode(value) {
  return value === LOCK_ALERT_MODE.ALL || value === LOCK_ALERT_MODE.EDGE11;
}

/** @param {unknown} paidTag */
export function normalizeLockAlertMode(paidTag) {
  if (paidTag === LOCK_ALERT_MODE.EDGE11) return LOCK_ALERT_MODE.EDGE11;
  if (paidTag === LOCK_ALERT_MODE.ALL || paidTag === 'true') return LOCK_ALERT_MODE.ALL;
  return LOCK_ALERT_MODE.OFF;
}

/** True when the tag is an explicit mode (not missing / false). */
export function paidTagIsExplicitMode(paidTag) {
  return paidTag === LOCK_ALERT_MODE.EDGE11
    || paidTag === LOCK_ALERT_MODE.ALL
    || paidTag === 'true';
}

export function readStoredLockAlertMode() {
  try {
    if (typeof localStorage === 'undefined') return null;
    const v = localStorage.getItem(LOCK_ALERT_MODE_STORAGE_KEY);
    return isLockAlertMode(v) ? v : null;
  } catch (_) {
    return null;
  }
}

export function writeStoredLockAlertMode(mode) {
  if (!isLockAlertMode(mode)) return;
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(LOCK_ALERT_MODE_STORAGE_KEY, mode);
  } catch (_) {
    /* private mode */
  }
}

/**
 * When confirming paid entitlement, keep an explicit preference.
 * Legacy `true` and missing/false → `all`.
 * @param {unknown} currentPaidTag
 */
export function paidTagForEntitlement(currentPaidTag) {
  const mode = normalizeLockAlertMode(currentPaidTag);
  if (mode === LOCK_ALERT_MODE.EDGE11) return LOCK_ALERT_MODE.EDGE11;
  return LOCK_ALERT_MODE.ALL;
}

/**
 * Tag to write on a confirmed-paid visit. `null` = do not write.
 *
 * Account "Lock alerts on" is optedIn. Sends require paid ∈ {all,true,edge11}.
 * A Stripe/Firestore flicker used to set paid=false, then this path refused
 * to restore because false is not an "explicit mode" — paid users stayed
 * subscribed and selected, but dropped out of every lock blast.
 *
 * Restore false → stored preference or all. Still do not invent all when
 * getTags is empty: that can overwrite a live edge11 on another device.
 *
 * @param {unknown} current
 * @param {unknown} stored
 * @returns {'all'|'edge11'|null}
 */
export function paidTagToWriteOnPaidVisit(current, stored) {
  if (stored === LOCK_ALERT_MODE.EDGE11) return LOCK_ALERT_MODE.EDGE11;
  if (current === LOCK_ALERT_MODE.EDGE11) return null;
  if (current === LOCK_ALERT_MODE.OFF) return LOCK_ALERT_MODE.ALL;
  if (paidTagIsExplicitMode(current)) return paidTagForEntitlement(current);
  return null;
}

/**
 * OneSignal notification filters for a lock at the given EDGE.
 * Always includes `all` + legacy `true`. Adds `edge11` when EDGE ≥ min.
 * @param {number|null|undefined} edge
 */
export function onesignalFiltersForEdge(edge) {
  const filters = [
    { field: 'tag', key: 'paid', relation: '=', value: LOCK_ALERT_MODE.ALL },
    { operator: 'OR' },
    { field: 'tag', key: 'paid', relation: '=', value: 'true' },
  ];
  if (Number.isFinite(edge) && edge >= LOCK_ALERT_EDGE_MIN) {
    filters.push({ operator: 'OR' });
    filters.push({
      field: 'tag',
      key: 'paid',
      relation: '=',
      value: LOCK_ALERT_MODE.EDGE11,
    });
  }
  return filters;
}

/**
 * Resolve stamped EDGE on a locked side (stamp only — no as-of replay).
 * @param {object|null|undefined} sd
 * @param {number} [priorAg=50]
 */
export function sideLockAlertEdge(sd, priorAg = 50) {
  if (!sd) return null;
  if (Number.isFinite(sd.v8_winnerAlignEdge)) return Number(sd.v8_winnerAlignEdge);
  if (Number.isFinite(sd.v8_winnerAlignMeanFor)) {
    const ag = Number.isFinite(sd.v8_winnerAlignMeanAg)
      ? Number(sd.v8_winnerAlignMeanAg)
      : priorAg;
    return Number(sd.v8_winnerAlignMeanFor) - ag;
  }
  return null;
}
