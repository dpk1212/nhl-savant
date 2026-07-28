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

/** @param {unknown} paidTag */
export function normalizeLockAlertMode(paidTag) {
  if (paidTag === LOCK_ALERT_MODE.EDGE11) return LOCK_ALERT_MODE.EDGE11;
  if (paidTag === LOCK_ALERT_MODE.ALL || paidTag === 'true') return LOCK_ALERT_MODE.ALL;
  return LOCK_ALERT_MODE.OFF;
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
