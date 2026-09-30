/**
 * ML pin-against size cap — do not publish 5–6u into a live Pinnacle walk away.
 *
 * Steam-era actual (2026-08-19 → 09-25, v12 staked, not tracked):
 *   ML pin lock→close against  23-19  +11.5u  — NOT a mute.
 *   6u ML against  n=0.  6u ML with  3-0.
 *   4u+ ML against  8-4  +1.1u  vs with  12-4  +13.2u.
 * GOLD stack HOLDs 6u. This overlay still caps, even in_stack.
 *
 * ML only. SPREAD / TOTAL EXEMPT.
 * CAP 4u. Never 0u. Never repath / flip.
 * Fail-open HOLD when we cannot read this-side pin.
 * Manual stake exempt at the call site.
 *
 * Against (live tape, not close):
 *   this-side implied, first Pinnacle print → current, Δ ≤ −1.0pp
 *   OR juice lengthen ≥ 3% (decimalDropPct ≤ −3).
 *
 * Going-forward only. Roll-back: ML_PIN_AGAINST_CAP_FROM = '9999-01-01'.
 */
import { decimalDropPct, STEAM_EVENT_PCT } from './steamMove.js';
import { normalizeMarketType } from './marketSkillMuteOverlay.js';

export const ML_PIN_AGAINST_CAP_FROM = '2026-09-29';
export const ML_PIN_AGAINST_SIZE_CAP = 4;
export const ML_PIN_AGAINST_MIN_PP = 1.0;
export const ML_PIN_AGAINST_CAPPED_BY = 'ml-pin-against-cap';

export function isMlPinAgainstCapLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= ML_PIN_AGAINST_CAP_FROM;
}

function impliedProb(american) {
  const a = Number(american);
  if (!Number.isFinite(a) || a === 0) return null;
  return a < 0 ? Math.abs(a) / (Math.abs(a) + 100) : 100 / (a + 100);
}

function sideAmerican(row, side) {
  if (!row || typeof row !== 'object') return null;
  const s = String(side || '').toLowerCase();
  if (s === 'home') return Number.isFinite(Number(row.home)) ? Number(row.home) : null;
  if (s === 'away') return Number.isFinite(Number(row.away)) ? Number(row.away) : null;
  if (s === 'draw') return Number.isFinite(Number(row.draw)) ? Number(row.draw) : null;
  return null;
}

function firstPinnaclePrint(pinnGame) {
  const hist = Array.isArray(pinnGame?.history) ? pinnGame.history : [];
  for (const pt of hist) {
    if (pt && typeof pt === 'object'
      && String(pt.fairBook || '').toLowerCase() === 'pinnacle') {
      return pt;
    }
  }
  return null;
}

/**
 * Live ML implied move on our side, first Pinnacle print → current.
 * Positive = shortened toward us. Negative = line walked away (Braves).
 */
export function measureMlPinAgainst(pinnGame, side) {
  if (!pinnGame || typeof pinnGame !== 'object') {
    return { dpp: null, dropPct: null, against: false, reason: 'no_pin' };
  }
  const firstPin = firstPinnaclePrint(pinnGame) || pinnGame.opener || null;
  const current = pinnGame.current
    || (Array.isArray(pinnGame.history) && pinnGame.history.length
      ? pinnGame.history[pinnGame.history.length - 1]
      : null);
  const openA = sideAmerican(firstPin, side);
  const curA = sideAmerican(current, side);
  const openP = impliedProb(openA);
  const curP = impliedProb(curA);
  const dpp = (openP != null && curP != null) ? +((curP - openP) * 100).toFixed(2) : null;
  const dropPct = decimalDropPct(openA, curA);
  const ppAgainst = Number.isFinite(dpp) && dpp <= -ML_PIN_AGAINST_MIN_PP;
  const juiceAgainst = Number.isFinite(dropPct) && dropPct <= -STEAM_EVENT_PCT;
  if (openA == null || curA == null) {
    return { dpp, dropPct, against: false, reason: 'no_side_odds', openA, curA };
  }
  return {
    dpp,
    dropPct,
    against: !!(ppAgainst || juiceAgainst),
    reason: ppAgainst ? 'implied_pp' : (juiceAgainst ? 'juice_lengthen' : 'not_against'),
    openA,
    curA,
  };
}

function pack({
  units,
  action,
  reason = null,
  cappedBy = null,
  unitsPrePolicy,
  dpp = null,
  dropPct = null,
} = {}) {
  return {
    units,
    action,
    reason,
    cappedBy,
    unitsPrePolicy,
    dpp: Number.isFinite(dpp) ? dpp : null,
    dropPct: Number.isFinite(dropPct) ? dropPct : null,
  };
}

/**
 * @returns {{
 *   units: number,
 *   action: 'PASS'|'EXEMPT'|'HOLD'|'CAP',
 *   reason: string|null,
 *   cappedBy: string|null,
 *   unitsPrePolicy: number,
 *   dpp: number|null,
 *   dropPct: number|null,
 * }}
 */
export function applyMlPinAgainstSizeCapOverlay({
  units,
  marketType = null,
  side = null,
  pinnGame = null,
  pickDate = null,
} = {}) {
  const pre = Number.isFinite(units) ? Math.max(0, units) : 0;
  if (!(pre > 0)) {
    return pack({ units: 0, action: 'PASS', reason: null, unitsPrePolicy: pre });
  }
  if (!isMlPinAgainstCapLive(pickDate)) {
    return pack({
      units: pre, action: 'EXEMPT', reason: 'pre_cutover', unitsPrePolicy: pre,
    });
  }
  const mkt = normalizeMarketType(marketType);
  if (mkt !== 'ML') {
    return pack({
      units: pre, action: 'EXEMPT', reason: 'market_exempt', unitsPrePolicy: pre,
    });
  }

  const move = measureMlPinAgainst(pinnGame, side);
  if (move.reason === 'no_pin' || move.reason === 'no_side_odds') {
    return pack({
      units: pre, action: 'HOLD', reason: move.reason, unitsPrePolicy: pre,
      dpp: move.dpp, dropPct: move.dropPct,
    });
  }
  if (!move.against) {
    return pack({
      units: pre, action: 'HOLD', reason: 'not_against', unitsPrePolicy: pre,
      dpp: move.dpp, dropPct: move.dropPct,
    });
  }
  if (pre <= ML_PIN_AGAINST_SIZE_CAP + 1e-9) {
    return pack({
      units: pre, action: 'HOLD', reason: 'already_le4', unitsPrePolicy: pre,
      dpp: move.dpp, dropPct: move.dropPct,
    });
  }
  return pack({
    units: ML_PIN_AGAINST_SIZE_CAP,
    action: 'CAP',
    reason: move.reason,
    cappedBy: ML_PIN_AGAINST_CAPPED_BY,
    unitsPrePolicy: pre,
    dpp: move.dpp,
    dropPct: move.dropPct,
  });
}
