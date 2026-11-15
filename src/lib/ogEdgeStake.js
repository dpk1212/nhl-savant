/**
 * Summer EDGE on the four-sport card, after the ladder has sized the bet
 * and the seat has stopped moving it. From 2026-11-15.
 *
 * EDGE is the winner-align number (mean FOR sport win rate, minus the
 * against side, or minus 50). It is not the press edge.
 *
 * 10 or more, and the stake is over 1 and under 3: double it. The odds
 * cap still binds, so a dog longer than +120 cannot leave at the raw
 * double. A 1u stake at 10 or more is muted. Under 10, a stake under 3
 * is muted and a stake of 3 or more stays. A missing edge does not move
 * the stake. Manual stake, operator kill, the T-15 freeze, and a graded
 * ticket stay at the caller.
 */

import { oddsCap } from './oddsCap.js';

export const OG_EDGE_STAKE_FROM = '2026-11-15';
export const OG_EDGE_MIN = 10;
export const OG_EDGE_KEEP_UNITS = 3;
export const OG_EDGE_SPORTS = new Set(['NHL', 'NBA', 'NFL', 'CFB']);

function round2(n) {
  return Math.round(n * 100) / 100;
}

export function isOgEdgeStakeLive(pickDate, sport) {
  return typeof pickDate === 'string'
    && pickDate >= OG_EDGE_STAKE_FROM
    && OG_EDGE_SPORTS.has(String(sport || '').toUpperCase());
}

/**
 * @returns {{
 *   units: number, action: 'DOUBLE'|'MUTE'|'HOLD'|'PASS'|'EXEMPT',
 *   edge: number|null, unitsPre: number,
 * }}
 */
export function applyOgEdgeStake({
  units,
  edge = null,
  pickDate = null,
  sport = null,
  odds = null,
  manual = false,
  killed = false,
} = {}) {
  const pre = Number.isFinite(Number(units)) ? Math.max(0, round2(Number(units))) : 0;
  const e = Number(edge);
  const hasEdge = edge != null && Number.isFinite(e);
  const out = (action, next = pre) => ({
    units: round2(next),
    action,
    edge: hasEdge ? e : null,
    unitsPre: pre,
  });
  if (manual === true || killed === true) return out('EXEMPT');
  if (!isOgEdgeStakeLive(pickDate, sport)) return out('EXEMPT');
  if (!hasEdge) return out('PASS');
  if (!(pre > 0)) return out('HOLD', 0);
  if (e >= OG_EDGE_MIN) {
    if (pre <= 1) return out('MUTE', 0);
    if (pre < OG_EDGE_KEEP_UNITS) {
      const doubled = round2(pre * 2);
      const capped = Number.isFinite(Number(odds)) ? round2(oddsCap(doubled, Number(odds))) : doubled;
      return out(capped === pre ? 'HOLD' : 'DOUBLE', capped);
    }
    return out('HOLD');
  }
  if (pre < OG_EDGE_KEEP_UNITS) return out('MUTE', 0);
  return out('HOLD');
}

export function ogEdgeStakeStamp(policy) {
  if (!policy || policy.action === 'EXEMPT') return {};
  return {
    v8_ogEdgeStakeAction: policy.action,
    v8_ogEdgeStakeEdge: policy.edge ?? null,
    v8_ogEdgeStakeUnits: Number.isFinite(policy.units) ? policy.units : null,
    v8_unitsPreOgEdgeStake: Number.isFinite(policy.unitsPre) ? policy.unitsPre : null,
  };
}
