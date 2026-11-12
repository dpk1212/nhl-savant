/**
 * Press-edge under-5 cap. The shrink that matches the seat lift.
 *
 * A stamped press edge under 5 is capped at 1 unit. Two moneyline cells
 * stop at 2 instead: a 14-day lead with nobody tier 5 against, and a
 * fresh tier 5 (on our side, none held 6 days). 5 or more keeps the
 * stake the rest of the card already gave it. A missing press edge is
 * not capped. Does not add units to the 5+ side, and does not lift a
 * stake already under the ceiling.
 *
 * A spread or a total whose market edge is under 0 goes to 0. The cap
 * would have left that bet at 1, and that unit loses. A moneyline under
 * 0 still takes the cap. A missing edge is not zeroed and not capped.
 *
 * Runs after the seat, the press-edge clamp, the 1-unit rescue, and the
 * odds cap. A zero stays zero. Manual stake, operator kill, T-15 freeze,
 * and graded tickets win at the call site. From 2026-11-10.
 */

import { stampedPressEdge } from './pressLadderOverlay.js';

export const PRESS_UNDER5_CAP_FROM = '2026-11-10';
export const PRESS_UNDER5_CAP_MAX = 5;
export const PRESS_UNDER5_CAP_UNITS = 1;
export const PRESS_UNDER5_CAP_ML_UNITS = 2;

function isMoneyline(market) {
  const u = String(market || '').toUpperCase();
  return u === 'ML' || u === 'MONEYLINE';
}

function isSpreadOrTotal(market) {
  const u = String(market || '').toUpperCase();
  return u === 'SPREAD' || u === 'SPREADS' || u === 'TOTAL' || u === 'TOTALS';
}

/** Ceiling for a press edge under 5. The two moneyline cells stop at 2. */
export function pressUnder5CapCeiling({
  market = null,
  seatId = null,
  for14 = 0,
  against = 0,
  ledger = false,
} = {}) {
  if (!isMoneyline(market)) return PRESS_UNDER5_CAP_UNITS;
  const fourteenEmpty = ledger === true && Number(for14) >= 1 && Number(against) === 0;
  const fresh = seatId === 't5_young';
  if (fourteenEmpty || fresh) return PRESS_UNDER5_CAP_ML_UNITS;
  return PRESS_UNDER5_CAP_UNITS;
}

export function isPressUnder5CapLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= PRESS_UNDER5_CAP_FROM;
}

/**
 * @returns {{
 *   units: number, action: 'CAP'|'ZERO'|'HOLD'|'PASS'|'EXEMPT',
 *   capped: boolean, edge: number|null, unitsPrePolicy: number,
 *   capUnits: number|null,
 * }}
 */
export function applyPressUnder5Cap({
  units,
  pressEdge = null,
  pickDate = null,
  manual = false,
  market = null,
  seatId = null,
  for14 = 0,
  against = 0,
  ledger = false,
} = {}) {
  const pre = Number.isFinite(Number(units)) ? Math.max(0, Number(units)) : 0;
  const edge = stampedPressEdge(pressEdge);
  const ceiling = pressUnder5CapCeiling({ market, seatId, for14, against, ledger });
  const out = (action, next = pre, capped = false, capUnits = null) => ({
    units: next,
    action,
    capped,
    edge,
    unitsPrePolicy: pre,
    capUnits,
  });
  if (manual === true) return out('EXEMPT');
  if (!isPressUnder5CapLive(pickDate)) return out('EXEMPT');
  if (edge == null) return out('PASS');
  if (isSpreadOrTotal(market) && edge < 0) {
    if (!(pre > 0)) return out('HOLD', 0, false, 0);
    return out('ZERO', 0, true, 0);
  }
  if (!(edge < PRESS_UNDER5_CAP_MAX)) return out('HOLD');
  if (!(pre > ceiling)) return out('HOLD', pre, false, ceiling);
  return out('CAP', ceiling, true, ceiling);
}

export function pressUnder5CapStamp(policy) {
  if (!policy || policy.action === 'EXEMPT') return {};
  return {
    v8_pressUnder5Cap: policy.capped === true,
    v8_pressUnder5CapEdge: policy.edge ?? null,
    v8_pressUnder5CapUnits: Number.isFinite(policy.capUnits) ? policy.capUnits : null,
    v8_unitsPrePressUnder5Cap: Number.isFinite(policy.unitsPrePolicy)
      ? policy.unitsPrePolicy
      : null,
  };
}
