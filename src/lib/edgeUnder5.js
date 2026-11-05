/**
 * Edge under 5, from 2026-11-05. NHL, NBA, NFL, CFB.
 *
 * Graded v12+ stakes, Oct 6–Nov 4: edge under 5 was 114-85, −17.7u on
 * 491.5u. Two cells inside it were green in both October halves. The rest
 * was 75-73, −42.4u. An edge of 5 or more stays.
 *
 *   Hold  a morning gap (two wallets, a 40-point lead, the other side
 *         negative) on a stake already in the 2-unit band, from 2 up to
 *         but not including 3. 10-4, +10.0u. The gap's extra unit stays
 *         off that band, so the ticket ships at the size that won.
 *   Hold  an NBA moneyline juicier than −100, any size. 30-8, +16.2u.
 *         The one ticket in both holds is kept once.
 *   Mute  every other stake whose press edge is under 5, including a
 *         missing edge, which the count scored as 0.
 *
 * Runs after the gap rung, on the units that would ship. A stake already
 * at 0 stays there, so the −425 favorite mute, a manual stake, and an
 * operator kill are not reopened. Compared at the stamped tenth, the same
 * number the card stores on v8_pressEdge.
 */

export const EDGE_UNDER5_FROM = '2026-11-05';
export const EDGE_UNDER5_MAX = 5;
export const EDGE_UNDER5_GAP_MIN = 2;
export const EDGE_UNDER5_GAP_MAX = 3;
export const EDGE_UNDER5_FAV_ODDS = -100;
export const EDGE_UNDER5_MUTED_BY = 'edge-under-5';

const SPORTS = new Set(['NHL', 'NBA', 'NFL', 'CFB']);

export function isEdgeUnder5Live(pickDate) {
  return typeof pickDate === 'string' && pickDate >= EDGE_UNDER5_FROM;
}

export function normEdgeSport(sport) {
  const u = String(sport || '').toUpperCase();
  return (u === 'NCAAF' || u === 'NCAAFB') ? 'CFB' : u;
}

export function normEdgeMarket(market) {
  const u = String(market || '').toUpperCase();
  if (u === 'ML' || u === 'MONEYLINE' || u === 'H2H') return 'ML';
  if (u === 'SPREAD' || u === 'SPREADS') return 'SPREAD';
  if (u === 'TOTAL' || u === 'TOTALS') return 'TOTAL';
  return u;
}

export function edgeUnder5Owns(pickDate, sport) {
  return isEdgeUnder5Live(pickDate) && SPORTS.has(normEdgeSport(sport));
}

/** Same tenth the card stores on v8_pressEdge. Missing stays missing. */
export function stampedEdge(edge) {
  if (edge == null || edge === '') return null;
  const n = Number(edge);
  if (!Number.isFinite(n)) return null;
  const rounded = Math.round(n * 10) / 10;
  return rounded === 0 ? 0 : rounded;
}

/** Missing edge counts as 0, which is under 5. */
export function edgeUnder5Value(edge) {
  const stamped = stampedEdge(edge);
  return stamped == null ? 0 : stamped;
}

export function inEdgeGapBand(units) {
  const n = Number(units);
  return Number.isFinite(n) && n >= EDGE_UNDER5_GAP_MIN && n < EDGE_UNDER5_GAP_MAX;
}

/**
 * The gap rung adds 1u under 3. From this date, a stake already in the
 * 2-unit band whose edge is under 5 stays put. An edge of 5 or more still
 * takes the extra unit.
 */
export function gapBandStays({ units, pressEdge = null, pickDate = null } = {}) {
  if (!isEdgeUnder5Live(pickDate)) return false;
  if (!inEdgeGapBand(units)) return false;
  return edgeUnder5Value(pressEdge) < EDGE_UNDER5_MAX;
}

function nbaMlFavorite(sport, market, odds) {
  if (normEdgeSport(sport) !== 'NBA') return false;
  if (normEdgeMarket(market) !== 'ML') return false;
  const n = Number(odds);
  return Number.isFinite(n) && n < EDGE_UNDER5_FAV_ODDS;
}

/**
 * @returns {{
 *   units: number, action: 'MUTE'|'HOLD'|'PASS'|'EXEMPT', reason: string|null,
 *   mutedBy: string|null, unitsPrePolicy: number, clause: 'under5'|'gap2'|'nba-ml-fav'|null,
 * }}
 */
export function applyEdgeUnder5Mute({
  units,
  pressEdge = null,
  pickDate = null,
  sport = null,
  market = null,
  odds = null,
  gapFires = false,
} = {}) {
  const pre = Number.isFinite(Number(units)) ? Math.max(0, Number(units)) : 0;
  const out = (action, reason = null, clause = null, next = pre, mutedBy = null) => ({
    units: next,
    action,
    reason,
    mutedBy,
    unitsPrePolicy: pre,
    clause,
  });
  if (!edgeUnder5Owns(pickDate, sport)) return out('EXEMPT');
  if (!(pre > 0)) return out('PASS');
  if (!(edgeUnder5Value(pressEdge) < EDGE_UNDER5_MAX)) return out('PASS');
  if (gapFires === true && inEdgeGapBand(pre)) {
    return out('HOLD', 'edge_under_5_gap2', 'gap2');
  }
  if (nbaMlFavorite(sport, market, odds)) {
    return out('HOLD', 'edge_under_5_nba_ml_fav', 'nba-ml-fav');
  }
  return out('MUTE', 'edge_under_5', 'under5', 0, EDGE_UNDER5_MUTED_BY);
}

export function edgeUnder5Stamp(policy) {
  if (!policy || policy.action === 'EXEMPT') return {};
  return {
    v8_edgeUnder5Action: policy.action,
    v8_edgeUnder5Reason: policy.reason ?? null,
    v8_edgeUnder5Clause: policy.clause ?? null,
    v8_unitsPreEdgeUnder5: policy.unitsPrePolicy,
  };
}
