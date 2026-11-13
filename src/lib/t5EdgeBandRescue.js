/**
 * Tier-5 market-edge rescue. From 2026-11-13.
 *
 * Runs after the press gate, the quality veto, and the press-edge hole
 * have already left the side at 0, and after the press-under-5 cap.
 * A zero becomes 3u when every line holds. A side that already has a
 * stake is not raised. The next cycle scores it again until the freeze:
 * if the edge leaves the band, or the other side gets a stake, it is 0.
 *
 * The edge is the wallet's market book on v8_t4: 100 × (wins ÷ n −
 * average price), decided bets in this market only, walked to the
 * morning of the pick. The list on the stamp is the trusted one.
 * Tier 5 is an edge of 8 or more. The band is the deepest of those
 * edges, from 8 up to but not including 12.
 *
 * The label is the quality veto on any market, or the press-edge hole
 * on a moneyline. The press gate, the steam mute, the moneyline door,
 * and the fade stay shut. Manual stake, operator kill, and the freeze
 * win at the call site.
 */

export const T5_EDGE_BAND_FROM = '2026-11-13';
export const T5_EDGE_BAND_MIN = 8;
export const T5_EDGE_BAND_MAX = 12;
export const T5_EDGE_BAND_UNITS = 3;
export const T5_EDGE_BAND_ODDS_MIN = -425;
export const T5_EDGE_BAND_ODDS_MAX = 200;
export const T5_EDGE_BAND_RESCUED_BY = 't5-edge-band';
export const T5_EDGE_BAND_STAKE_TIER = 'T5-BAND';

const SPORTS = new Set(['NHL', 'NBA', 'NFL', 'CFB']);
const MARKETS = new Set(['ML', 'SPREAD', 'TOTAL']);

export function normT5EdgeSport(sport) {
  const u = String(sport || '').toUpperCase();
  return (u === 'NCAAF' || u === 'NCAAFB') ? 'CFB' : u;
}

export function normT5EdgeMarket(market) {
  const u = String(market || '').toUpperCase();
  if (u === 'ML' || u === 'MONEYLINE' || u === 'H2H') return 'ML';
  if (u === 'SPREAD' || u === 'SPREADS') return 'SPREAD';
  if (u === 'TOTAL' || u === 'TOTALS') return 'TOTAL';
  return u;
}

export function isT5EdgeBandLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= T5_EDGE_BAND_FROM;
}

/** Deepest tier-5 edge on our side of the market-book stamp. */
export function deepestTier5Edge(t4) {
  const rows = Array.isArray(t4?.for) ? t4.for : [];
  let best = null;
  for (const row of rows) {
    if (Number(row?.tier) !== 5) continue;
    const edge = Number(row.edge);
    if (!Number.isFinite(edge)) continue;
    if (best == null || edge > best) best = edge;
  }
  return best;
}

/**
 * The label the card would stamp. Higher-priority mutes stay shut.
 * A press-edge hole that is not a moneyline stays 0, including when
 * the quality veto would also have applied.
 */
export function t5EdgeBandLabel({
  units = 0,
  killed = false,
  cbb = false,
  pressApplied = false,
  favJuice = false,
  edgeUnder5 = false,
  t5Mute = false,
  doorCut = false,
  hole = false,
  pressEdgeNet = false,
  quality = false,
  market = null,
} = {}) {
  if (killed || cbb || !pressApplied) return null;
  if (Number(units) > 0) return null;
  if (favJuice || edgeUnder5 || t5Mute || doorCut) return null;
  const mkt = normT5EdgeMarket(market);
  if (hole && mkt === 'ML') return 'hole';
  // A hole spread, and the closers mute, keep the press-edge label.
  if (hole || pressEdgeNet) return null;
  if (quality) return 'quality';
  return null;
}

/**
 * @returns {{
 *   units: number, action: 'RESCUE'|'PASS'|'EXEMPT',
 *   edge: number|null, label: string|null, unitsPrePolicy: number,
 * }}
 */
export function applyT5EdgeBandRescue({
  units,
  pickDate = null,
  sport = null,
  market = null,
  odds = null,
  opponentUnits = 0,
  t4 = null,
  label = null,
  manual = false,
  killed = false,
} = {}) {
  const pre = Number.isFinite(Number(units)) ? Math.max(0, Number(units)) : 0;
  const edge = deepestTier5Edge(t4);
  const out = (action, next = pre) => ({
    units: next,
    action,
    edge,
    label: action === 'RESCUE' ? label : null,
    unitsPrePolicy: pre,
  });
  if (manual || killed) return out('EXEMPT');
  if (!isT5EdgeBandLive(pickDate)) return out('EXEMPT');
  if (pre > 0) return out('PASS');
  if (label !== 'quality' && label !== 'hole') return out('PASS');
  const sp = normT5EdgeSport(sport);
  const mkt = normT5EdgeMarket(market);
  if (!SPORTS.has(sp) || !MARKETS.has(mkt)) return out('PASS');
  if (label === 'hole' && mkt !== 'ML') return out('PASS');
  const price = Number(odds);
  if (!Number.isFinite(price) || price === 0) return out('PASS');
  if (price < T5_EDGE_BAND_ODDS_MIN || price > T5_EDGE_BAND_ODDS_MAX) return out('PASS');
  if (Number(opponentUnits) > 0) return out('PASS');
  if (edge == null || edge < T5_EDGE_BAND_MIN || edge >= T5_EDGE_BAND_MAX) return out('PASS');
  return out('RESCUE', T5_EDGE_BAND_UNITS);
}

export function t5EdgeBandStamp(policy) {
  if (!policy || policy.action !== 'RESCUE') return {};
  return {
    v8_t5EdgeBand: true,
    v8_t5EdgeBandEdge: policy.edge,
    v8_t5EdgeBandLabel: policy.label,
  };
}
