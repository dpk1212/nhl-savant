/**
 * Spread/total fat mute — last step after board-share.
 *
 * Ship (2026-09-17+):
 *   SPREAD / TOTAL only. Moneyline never touched.
 *   Mute leftover BOTH (EDGE ≥ 10 AND tape ≥ boost) at any current units,
 *   including climate-shrunk 2–3u that were minted 5.4u.
 *   Mute arriving (steam off→on) when current units ≥ 4 (after Policy T
 *   mid bump + unit-tier promote).
 *   BOTH wins the reason if both fire.
 *
 * Fail-open when BOTH cannot be proven AND arriving is unknown.
 * Missing EDGE or tape is not BOTH (do not mute on that rule).
 * Does not resize. Does not repath. Manual stake exempt at the call site.
 */
import {
  BOTH_E10_EDGE_MIN,
  TAPE_BOOST_ABOVE,
} from './walletClvSkill.js';

export const ST_FAT_MUTE_FROM = '2026-09-17';
export const ST_FAT_MUTED_BY = 'st-fat';
export const ST_FAT_ARRIVING_MIN = 4; // inclusive
export const ST_FAT_MARKETS = new Set(['SPREAD', 'TOTAL']);

export function isStFatMuteLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= ST_FAT_MUTE_FROM;
}

export function isStFatMarket(marketType) {
  return ST_FAT_MARKETS.has(String(marketType || '').toUpperCase());
}

function asFinite(v) {
  if (v == null || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function asBoolOrNull(v) {
  if (v === true) return true;
  if (v === false) return false;
  return null;
}

function pack({
  units,
  action,
  reason = null,
  mutedBy = null,
  unitsPrePolicy,
  both = false,
  steamArriving = false,
  bothKnown = false,
  arrivingKnown = false,
} = {}) {
  return {
    units,
    action,
    reason,
    mutedBy,
    unitsPrePolicy,
    both: !!both,
    steamArriving: !!steamArriving,
    bothKnown: !!bothKnown,
    arrivingKnown: !!arrivingKnown,
  };
}

/**
 * BOTH = leftover EDGE≥10 AND tape BOOST. Prefer the skill-floor mode
 * stamp when present; otherwise score the two inputs the floor uses.
 */
export function isLeftoverBoth({
  bothMode = null,
  edge = null,
  tape = null,
} = {}) {
  if (String(bothMode || '').toUpperCase() === 'BOTH') return true;
  const e = asFinite(edge);
  const t = asFinite(tape);
  return e != null && t != null
    && e >= BOTH_E10_EDGE_MIN
    && t >= TAPE_BOOST_ABOVE;
}

export function leftoverBothKnown({
  bothMode = null,
  edge = null,
  tape = null,
} = {}) {
  const mode = String(bothMode || '').toUpperCase();
  if (mode === 'BOTH' || mode === 'ONE' || mode === 'PASS') return true;
  return asFinite(edge) != null && asFinite(tape) != null;
}

/**
 * @returns {{
 *   units: number,
 *   action: 'PASS'|'EXEMPT'|'HOLD'|'MUTE',
 *   reason: string|null,
 *   mutedBy: string|null,
 *   unitsPrePolicy: number,
 *   both: boolean,
 *   steamArriving: boolean,
 *   bothKnown: boolean,
 *   arrivingKnown: boolean,
 * }}
 */
export function applyStFatMuteOverlay({
  units,
  pickDate = null,
  marketType = null,
  bothMode = null,
  edge = null,
  tape = null,
  steamArriving = null,
} = {}) {
  const pre = Number.isFinite(units) ? Math.max(0, units) : 0;
  const arriving = asBoolOrNull(steamArriving);
  const both = isLeftoverBoth({ bothMode, edge, tape });
  const bothKnown = leftoverBothKnown({ bothMode, edge, tape });
  const arrivingKnown = arriving != null;

  const hold = (action = 'HOLD', reason = null) => pack({
    units: pre,
    action,
    reason,
    mutedBy: null,
    unitsPrePolicy: pre,
    both,
    steamArriving: arriving === true,
    bothKnown,
    arrivingKnown,
  });

  const mute = (reason) => pack({
    units: 0,
    action: 'MUTE',
    reason,
    mutedBy: ST_FAT_MUTED_BY,
    unitsPrePolicy: pre,
    both,
    steamArriving: arriving === true,
    bothKnown,
    arrivingKnown,
  });

  if (!(pre > 0)) {
    return pack({
      units: 0,
      action: 'PASS',
      reason: null,
      mutedBy: null,
      unitsPrePolicy: pre,
      both,
      steamArriving: arriving === true,
      bothKnown,
      arrivingKnown,
    });
  }
  if (!isStFatMuteLive(pickDate)) return hold('EXEMPT', 'pre_cutover');
  if (!isStFatMarket(marketType)) return hold('EXEMPT', 'ml_exempt');

  if (!bothKnown && !arrivingKnown) {
    return hold('HOLD', 'st_fat_fail_open');
  }

  if (both) return mute('st_fat_both');
  if (arriving === true && pre >= ST_FAT_ARRIVING_MIN) {
    return mute('st_fat_arriving_4u');
  }
  return hold('HOLD', null);
}
