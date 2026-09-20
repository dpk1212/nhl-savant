/**
 * Lock alert preference encoded in the single OneSignal tag `paid`
 * (org plan allows only one custom tag — see ONESIGNAL.md).
 *
 * Values:
 *   all      — full book, every staked lock
 *   all_c    — conservative book, every staked lock
 *   edge11   — full book, EDGE ≥ LOCK_ALERT_EDGE_MIN only
 *   edge11_c — conservative book, EDGE ≥ min only
 *   false    — not entitled / lapsed (no sends)
 *   true     — legacy; treated as `all`
 */

import { UNIT_DISPLAY_SCALE, normalizeUnitDisplayScale } from './unitDisplayScale.js';

export const LOCK_ALERT_EDGE_MIN = 11;

export const LOCK_ALERT_MODE = Object.freeze({
  ALL: 'all',
  EDGE11: 'edge11',
  OFF: 'false',
});

export const PAID_TAG = Object.freeze({
  ALL: 'all',
  ALL_CONSERVATIVE: 'all_c',
  EDGE11: 'edge11',
  EDGE11_CONSERVATIVE: 'edge11_c',
  OFF: 'false',
});

/** Browser-only cache so All vs Top does not snap back when OneSignal getTags is stale/empty. */
export const LOCK_ALERT_MODE_STORAGE_KEY = 'nhlSavant.lockAlertMode';

export function isLockAlertMode(value) {
  return value === LOCK_ALERT_MODE.ALL || value === LOCK_ALERT_MODE.EDGE11;
}

export function paidTagScale(paidTag) {
  return paidTag === PAID_TAG.ALL_CONSERVATIVE || paidTag === PAID_TAG.EDGE11_CONSERVATIVE
    ? UNIT_DISPLAY_SCALE.CONSERVATIVE
    : UNIT_DISPLAY_SCALE.FULL;
}

/** Compose the single `paid` tag from All/Top + Full/Conservative. */
export function composePaidTag(mode, scale = UNIT_DISPLAY_SCALE.FULL) {
  const conservative = normalizeUnitDisplayScale(scale) === UNIT_DISPLAY_SCALE.CONSERVATIVE;
  if (mode === LOCK_ALERT_MODE.EDGE11) {
    return conservative ? PAID_TAG.EDGE11_CONSERVATIVE : PAID_TAG.EDGE11;
  }
  if (mode === LOCK_ALERT_MODE.ALL) {
    return conservative ? PAID_TAG.ALL_CONSERVATIVE : PAID_TAG.ALL;
  }
  return PAID_TAG.OFF;
}

/** @param {unknown} paidTag */
export function normalizeLockAlertMode(paidTag) {
  if (paidTag === LOCK_ALERT_MODE.EDGE11 || paidTag === PAID_TAG.EDGE11_CONSERVATIVE) {
    return LOCK_ALERT_MODE.EDGE11;
  }
  if (
    paidTag === LOCK_ALERT_MODE.ALL
    || paidTag === PAID_TAG.ALL_CONSERVATIVE
    || paidTag === 'true'
  ) {
    return LOCK_ALERT_MODE.ALL;
  }
  return LOCK_ALERT_MODE.OFF;
}

/** True when the tag is an explicit mode (not missing / false). */
export function paidTagIsExplicitMode(paidTag) {
  return paidTag === LOCK_ALERT_MODE.EDGE11
    || paidTag === PAID_TAG.EDGE11_CONSERVATIVE
    || paidTag === LOCK_ALERT_MODE.ALL
    || paidTag === PAID_TAG.ALL_CONSERVATIVE
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
 * When confirming paid entitlement, keep All vs Top and Full vs Conservative.
 * Legacy `true` and missing/false → `all` (or `all_c` when scale is conservative).
 * @param {unknown} currentPaidTag
 * @param {unknown} [scale]
 */
export function paidTagForEntitlement(currentPaidTag, scale) {
  const mode = normalizeLockAlertMode(currentPaidTag);
  const resolvedScale = scale != null
    ? normalizeUnitDisplayScale(scale)
    : paidTagScale(currentPaidTag);
  if (mode === LOCK_ALERT_MODE.EDGE11) return composePaidTag(LOCK_ALERT_MODE.EDGE11, resolvedScale);
  return composePaidTag(LOCK_ALERT_MODE.ALL, resolvedScale);
}

/**
 * Tag to write on a confirmed-paid visit. `null` = do not write.
 *
 * Restore false → stored preference or all. Still do not invent all when
 * getTags is empty: that can overwrite a live edge11 on another device.
 * Scale suffix (`_c`) is applied from the stored unit book.
 *
 * @param {unknown} current
 * @param {unknown} stored
 * @param {unknown} [storedScale]
 * @returns {string|null}
 */
export function paidTagToWriteOnPaidVisit(current, stored, storedScale) {
  const scale = normalizeUnitDisplayScale(storedScale);
  if (stored === LOCK_ALERT_MODE.EDGE11) return composePaidTag(LOCK_ALERT_MODE.EDGE11, scale);
  if (current === LOCK_ALERT_MODE.EDGE11 || current === PAID_TAG.EDGE11_CONSERVATIVE) {
    const composed = composePaidTag(LOCK_ALERT_MODE.EDGE11, scale);
    return composed === current ? null : composed;
  }
  if (current === LOCK_ALERT_MODE.OFF) return composePaidTag(LOCK_ALERT_MODE.ALL, scale);
  if (paidTagIsExplicitMode(current)) return paidTagForEntitlement(current, storedScale);
  return null;
}

/**
 * OneSignal notification filters for a lock at the given EDGE + unit book.
 * Full: `all` + legacy `true` (+ `edge11` when EDGE ≥ min).
 * Conservative: `all_c` (+ `edge11_c` when EDGE ≥ min).
 * @param {number|null|undefined} edge
 * @param {{ scale?: string }} [opts]
 */
export function onesignalFiltersForEdge(edge, { scale = UNIT_DISPLAY_SCALE.FULL } = {}) {
  const conservative = normalizeUnitDisplayScale(scale) === UNIT_DISPLAY_SCALE.CONSERVATIVE;
  if (conservative) {
    const filters = [
      { field: 'tag', key: 'paid', relation: '=', value: PAID_TAG.ALL_CONSERVATIVE },
    ];
    if (Number.isFinite(edge) && edge >= LOCK_ALERT_EDGE_MIN) {
      filters.push({ operator: 'OR' });
      filters.push({
        field: 'tag',
        key: 'paid',
        relation: '=',
        value: PAID_TAG.EDGE11_CONSERVATIVE,
      });
    }
    return filters;
  }
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
