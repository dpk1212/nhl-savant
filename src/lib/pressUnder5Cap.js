/**
 * Press-edge under-5 cap. The shrink that matches the seat lift.
 *
 * A stamped press edge under 5 is capped at 1 unit. 5 or more keeps the
 * stake the rest of the card already gave it. A missing press edge is
 * not capped. Every market. Does not add units to the 5+ side.
 *
 * Runs after the seat, the press-edge clamp, the 1-unit rescue, and the
 * odds cap. A stake already at 1 or under stays. A zero stays zero.
 * The floor does not lift it. Manual stake, operator kill, T-15 freeze,
 * and graded tickets win at the call site. From 2026-11-10.
 */

import { stampedPressEdge } from './pressLadderOverlay.js';

export const PRESS_UNDER5_CAP_FROM = '2026-11-10';
export const PRESS_UNDER5_CAP_MAX = 5;
export const PRESS_UNDER5_CAP_UNITS = 1;

export function isPressUnder5CapLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= PRESS_UNDER5_CAP_FROM;
}

/**
 * @returns {{
 *   units: number, action: 'CAP'|'HOLD'|'PASS'|'EXEMPT',
 *   capped: boolean, edge: number|null, unitsPrePolicy: number,
 * }}
 */
export function applyPressUnder5Cap({
  units,
  pressEdge = null,
  pickDate = null,
  manual = false,
} = {}) {
  const pre = Number.isFinite(Number(units)) ? Math.max(0, Number(units)) : 0;
  const edge = stampedPressEdge(pressEdge);
  const out = (action, next = pre, capped = false) => ({
    units: next,
    action,
    capped,
    edge,
    unitsPrePolicy: pre,
  });
  if (manual === true) return out('EXEMPT');
  if (!isPressUnder5CapLive(pickDate)) return out('EXEMPT');
  if (edge == null) return out('PASS');
  if (!(edge < PRESS_UNDER5_CAP_MAX)) return out('HOLD');
  if (!(pre > PRESS_UNDER5_CAP_UNITS)) return out('HOLD');
  return out('CAP', PRESS_UNDER5_CAP_UNITS, true);
}

export function pressUnder5CapStamp(policy) {
  if (!policy || policy.action === 'EXEMPT') return {};
  return {
    v8_pressUnder5Cap: policy.capped === true,
    v8_pressUnder5CapEdge: policy.edge ?? null,
    v8_unitsPrePressUnder5Cap: Number.isFinite(policy.unitsPrePolicy)
      ? policy.unitsPrePolicy
      : null,
  };
}
