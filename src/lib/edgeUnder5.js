/**
 * Edge under 5, from 2026-11-05. NHL, NBA, NFL, CFB.
 *
 * Adjusted 2026-11-06. One mute. A locked play comes off when the blended
 * edge is under 5 and steam is off. Steam on stays, including under 5.
 * A blended edge of 5 or higher stays. A missing blend stays. Steam that
 * was not stamped off stays. There is no rescue: the gap-band hold and the
 * NBA moneyline-favorite hold are gone.
 *
 * The blend is the market win rate pulled toward the wallet's other
 * markets in that sport (K = 10), then averaged across the wallets on our
 * side and compared with the price. Spreads and totals use 52.4. A
 * moneyline with no American price is not scored. Compared at the tenth.
 *
 * A stake already at 0 stays there, so an earlier mute keeps its reason.
 * A side this mute already zeroed stays zero. The next sync does not
 * turn it back on.
 *
 * The 2-unit gap freeze still reads the press edge. It is a size hold,
 * not a rescue, so a ticket already in that band does not pick up a unit.
 */

export const EDGE_UNDER5_FROM = '2026-11-05';
export const EDGE_UNDER5_MAX = 5;
export const EDGE_UNDER5_GAP_MIN = 2;
export const EDGE_UNDER5_GAP_MAX = 3;
export const EDGE_UNDER5_MUTED_BY = 'edge-under-5';
export const BLEND_EDGE_K = 10;
export const BLEND_EDGE_MIN_N = 10;
export const BLEND_ST_IMPLIED_PCT = 52.4;

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

/** Same tenth the card stores. Missing stays missing. */
export function stampedEdge(edge) {
  if (edge == null || edge === '') return null;
  if (!Number.isFinite(Number(edge))) return null;
  const rounded = Math.round(Number(edge) * 10) / 10;
  return rounded === 0 ? 0 : rounded;
}

/** Press-edge read for the 2-unit gap freeze. Missing counts as 0. */
export function edgeUnder5Value(edge) {
  const stamped = stampedEdge(edge);
  return stamped == null ? 0 : stamped;
}

export function inEdgeGapBand(units) {
  const n = Number(units);
  return Number.isFinite(n) && n >= EDGE_UNDER5_GAP_MIN && n < EDGE_UNDER5_GAP_MAX;
}

/**
 * The gap rung adds 1u under 3. A stake already in the 2-unit band whose
 * press edge is under 5 stays put. An edge of 5 or more still takes the
 * extra unit. This does not put a muted play back on.
 */
export function gapBandStays({ units, pressEdge = null, pickDate = null } = {}) {
  if (!isEdgeUnder5Live(pickDate)) return false;
  if (!inEdgeGapBand(units)) return false;
  return edgeUnder5Value(pressEdge) < EDGE_UNDER5_MAX;
}

function wrPct(book) {
  const n = Number(book?.n) || 0;
  if (!(n > 0)) return null;
  const wins = Number(book?.wins);
  if (Number.isFinite(wins)) return Number(((100 * wins) / n).toFixed(1));
  const wr = Number(book?.wr);
  if (!Number.isFinite(wr)) return null;
  return Number(wr.toFixed(1));
}

function winsOf(book) {
  const wins = Number(book?.wins);
  if (Number.isFinite(wins)) return wins;
  const n = Number(book?.n) || 0;
  const wr = Number(book?.wr);
  if (!(n > 0) || !Number.isFinite(wr)) return null;
  return (wr / 100) * n;
}

/**
 * Market win rate pulled toward the wallet's other markets in that sport.
 * Null when the sport book is thinner than 10.
 */
export function blendWalletWr(sportBook, marketBook) {
  if (!sportBook || !(Number(sportBook.n) >= BLEND_EDGE_MIN_N)) return null;
  const wrS = wrPct(sportBook);
  if (wrS == null) return null;
  const mN = Number(marketBook?.n) || 0;
  const sN = Number(sportBook.n);
  if (!marketBook || mN < 1 || sN <= mN) return wrS;
  const otherN = sN - mN;
  if (!(otherN > 0)) return wrS;
  const wrM = wrPct(marketBook);
  const sWins = winsOf(sportBook);
  const mWins = winsOf(marketBook);
  if (wrM == null || sWins == null || mWins == null) return wrS;
  const wrO = Number(((100 * (sWins - mWins)) / otherN).toFixed(1));
  return (mN * wrM + BLEND_EDGE_K * wrO) / (mN + BLEND_EDGE_K);
}

function impliedPct(market, odds) {
  const m = normEdgeMarket(market);
  if (m !== 'ML') return BLEND_ST_IMPLIED_PCT;
  const o = Number(odds);
  if (!Number.isFinite(o) || o === 0) return null;
  return (o < 0 ? Math.abs(o) / (Math.abs(o) + 100) : 100 / (o + 100)) * 100;
}

/** Mean blended win rate minus the price, at the tenth. Null when unscored. */
export function blendEdgeFromWrs(wrs, market, odds) {
  const nums = (wrs || []).filter((n) => Number.isFinite(Number(n))).map(Number);
  if (!nums.length) return null;
  const implied = impliedPct(market, odds);
  if (implied == null) return null;
  const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
  return Math.round((mean - implied) * 10) / 10;
}

function profileNode(walletProfiles, wallet) {
  if (!walletProfiles || wallet == null || wallet === '') return null;
  const raw = String(wallet);
  const short = raw.slice(-6).toLowerCase();
  if (typeof walletProfiles.get === 'function') {
    return walletProfiles.get(short)
      || walletProfiles.get(short.toUpperCase())
      || walletProfiles.get(raw.toLowerCase())
      || null;
  }
  return walletProfiles[short]
    || walletProfiles[short.toUpperCase()]
    || walletProfiles[raw.toLowerCase()]
    || null;
}

function sportRecord(profile, sport) {
  const by = profile?.bySport;
  if (!by || typeof by !== 'object') return null;
  const norm = normEdgeSport(sport);
  return by[norm] || by[sport] || (norm === 'CFB' ? (by.NCAAF || by.NCAAFB) : null) || null;
}

/**
 * Blended edge for the wallets whose largest ticket is on this side.
 * Reads the profile sport book and that sport's market book.
 */
export function blendEdgeFromWallets({
  walletDetails = null,
  side = null,
  sport = null,
  market = null,
  walletProfiles = null,
  odds = null,
} = {}) {
  const best = new Map();
  for (const wd of walletDetails || []) {
    if (!wd || !wd.side || !wd.wallet) continue;
    const invested = Number(wd.invested) || 0;
    if (!(invested > 0)) continue;
    const id = String(wd.wallet).slice(-6).toLowerCase();
    const prev = best.get(id);
    if (!prev || invested > prev.invested) best.set(id, { side: wd.side, invested });
  }
  const wrs = [];
  const mkt = normEdgeMarket(market);
  for (const [id, row] of best) {
    if (row.side !== side) continue;
    const rec = sportRecord(profileNode(walletProfiles, id), sport);
    const wr = blendWalletWr(rec?.positions, rec?.byMarket?.[mkt]?.positions);
    if (wr != null) wrs.push(wr);
  }
  return blendEdgeFromWrs(wrs, mkt, odds);
}

/**
 * @returns {{
 *   units: number, action: 'MUTE'|'PASS'|'EXEMPT', reason: string|null,
 *   mutedBy: string|null, unitsPrePolicy: number,
 *   clause: 'under5'|'stay'|null, blendEdge: number|null, steamOn: boolean|null,
 * }}
 */
export function applyEdgeUnder5Mute({
  units,
  blendEdge = null,
  steamOn = null,
  pickDate = null,
  sport = null,
  alreadyOff = false,
} = {}) {
  const pre = Number.isFinite(Number(units)) ? Math.max(0, Number(units)) : 0;
  const edge = stampedEdge(blendEdge);
  const steam = steamOn === true ? true : steamOn === false ? false : null;
  const out = (action, reason = null, clause = null, next = pre, mutedBy = null) => ({
    units: next,
    action,
    reason,
    mutedBy,
    unitsPrePolicy: pre,
    clause,
    blendEdge: edge,
    steamOn: steam,
  });
  if (alreadyOff === true) {
    return out('MUTE', 'edge_under_5_stay', 'stay', 0, EDGE_UNDER5_MUTED_BY);
  }
  if (!edgeUnder5Owns(pickDate, sport)) return out('EXEMPT');
  if (!(pre > 0)) return out('PASS');
  if (steam !== false) return out('PASS');
  if (edge == null) return out('PASS');
  if (!(edge < EDGE_UNDER5_MAX)) return out('PASS');
  return out('MUTE', 'edge_under_5', 'under5', 0, EDGE_UNDER5_MUTED_BY);
}

export function edgeUnder5Stamp(policy) {
  if (!policy || policy.action === 'EXEMPT') return {};
  return {
    v8_edgeUnder5Action: policy.action,
    v8_edgeUnder5Reason: policy.reason ?? null,
    v8_edgeUnder5Clause: policy.clause ?? null,
    v8_unitsPreEdgeUnder5: policy.unitsPrePolicy,
    v8_blendEdge: policy.blendEdge ?? null,
    v8_blendSteamOn: policy.steamOn ?? null,
  };
}
