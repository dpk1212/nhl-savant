/**
 * v13 moneyline. From 2026-11-19.
 *
 * A wallet qualifies on its moneyline book only, the bets dated before
 * this morning. Tier 4 or 5, form on, and that book is at least 15 days
 * old. The branch fires when one of those wallets is on this side and
 * none of them is on the other side, and the summer edge is 0 or more.
 *
 * Edge 0 up to 10. Steam against is 0. Flat through a shorten under 4.5
 * is 4 at −110 or shorter, and 2 from +110 through the prices in between.
 * A shorten of 4.5 up to 10 is 0.75. A shorten of 10 or more is 4.
 *
 * Edge 10 or more. Steam against is 0. A flat line and any shorten take
 * the price: −150 or shorter is 3, and a price longer than −150 is 1.5.
 *
 * A missing edge, a missing steam, an edge under 0, and a price juicier
 * than −425 stay on the stake that arrived. The juice check runs before
 * every size, so a shorten cannot put a juiced favorite back on.
 *
 * This is the size for that side. It replaces the stake that arrived.
 * Manual stake, an operator kill, the T-15 freeze, and a graded ticket
 * stay at the caller. NHL, NBA, NFL, and CFB. Moneyline only.
 */

import { buildTrustState, isTrustOn } from './walletTrustStatus.js';
import { mlMiniWalletId, mlPriceBand, normMlMiniMarket, normMlMiniSport } from './mlMiniRung.js';

export const V13_ML_FROM = '2026-11-19';
export const V13_ML_EDGE_MAX = 10;
export const V13_ML_STEAM_MID = 4.5;
export const V13_ML_STEAM_HEAVY = 10;
export const V13_ML_FAVORITE_ODDS = -110;
export const V13_ML_HIGH_ODDS = -150;
export const V13_ML_JUICE_ODDS = -425;
export const V13_ML_FAVORITE_UNITS = 4;
export const V13_ML_LONG_UNITS = 2;
export const V13_ML_MID_UNITS = 0.75;
export const V13_ML_HEAVY_UNITS = 4;
export const V13_ML_HIGH_FULL_UNITS = 3;
export const V13_ML_HIGH_LONG_UNITS = 1.5;
export const V13_ML_STAKE_TIER = 'V13-ML';
export const V13_ML_RESCUED_BY = 'v13-ml';
export const V13_ML_MUTED_BY = 'v13-ml';

const SPORTS = new Set(['NHL', 'NBA', 'NFL', 'CFB']);

let bookIndex = new Map();

export function isV13MlLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= V13_ML_FROM;
}

export function setV13MlBook(index) {
  bookIndex = index instanceof Map ? index : new Map();
}

export function v13MlBookIndex() {
  return bookIndex;
}

function bookKey(sport, wallet) {
  return `${sport}|${wallet}`;
}

function wonOf(row) {
  const r = String(row?.result || row?.outcome || '').toUpperCase();
  if (r === 'WIN' || row?.won === true || row?.won === 1) return true;
  if (r === 'LOSS' || row?.won === false || row?.won === 0) return false;
  return null;
}

function daysBetween(a, b) {
  return Math.round((Date.parse(`${b.slice(0, 10)}T00:00:00Z`) - Date.parse(`${a.slice(0, 10)}T00:00:00Z`)) / 86400000);
}

function roundTenth(value) {
  if (value == null || value === '') return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return Math.round(n * 10) / 10;
}

function finiteEdge(edge) {
  const n = Number(edge);
  return edge != null && Number.isFinite(n) ? n : null;
}

function impliedOf(odds) {
  const n = Number(odds);
  if (!Number.isFinite(n) || Math.abs(n) < 100) return null;
  return n < 0 ? (-n) / (-n + 100) : 100 / (n + 100);
}

function americanAndImplied(odds, price) {
  const american = Number(odds);
  const hasAmerican = Number.isFinite(american) && Math.abs(american) >= 100;
  const implied = hasAmerican
    ? impliedOf(american)
    : (price > 0 && price < 1 ? price : null);
  return { american, hasAmerican, implied };
}

/** favorite, long, or juice. Long is +110 and the prices between +110 and −110. */
export function v13PriceZone(odds, price) {
  const { american, hasAmerican, implied } = americanAndImplied(odds, price);
  if (hasAmerican && american < V13_ML_JUICE_ODDS) return 'juice';
  if (implied == null) return null;
  if (!hasAmerican && implied > (425 / 525)) return 'juice';
  const favoriteAt = impliedOf(V13_ML_FAVORITE_ODDS);
  if (hasAmerican) {
    if (american <= V13_ML_FAVORITE_ODDS) return 'favorite';
    return 'long';
  }
  if (implied >= favoriteAt) return 'favorite';
  return 'long';
}

/** short, longer, or juice. Short is −150 or shorter. Longer is every price past that. */
export function v13HighPriceZone(odds, price) {
  const { american, hasAmerican, implied } = americanAndImplied(odds, price);
  if (hasAmerican && american < V13_ML_JUICE_ODDS) return 'juice';
  if (implied == null) return null;
  if (!hasAmerican && implied > (425 / 525)) return 'juice';
  const shortAt = impliedOf(V13_ML_HIGH_ODDS);
  if (hasAmerican) {
    if (american <= V13_ML_HIGH_ODDS) return 'short';
    return 'longer';
  }
  if (implied >= shortAt) return 'short';
  return 'longer';
}

/**
 * Qualified moneyline wallets, as of the morning in `asOf`.
 * Key is sport|wallet. Spreads and totals never enter the book.
 */
export function buildV13MlBook(rows, asOf) {
  const index = new Map();
  if (typeof asOf !== 'string' || asOf.length < 10) return index;
  const byWallet = new Map();
  for (const row of rows || []) {
    if (row?.postponed === true) continue;
    const wallet = mlMiniWalletId(row);
    const date = String(row?.date || '').slice(0, 10);
    const sport = normMlMiniSport(row?.sport);
    if (!wallet || date.length < 10 || !SPORTS.has(sport) || date >= asOf) continue;
    if (normMlMiniMarket(row?.marketType || row?.market) !== 'ML') continue;
    if (!byWallet.has(wallet)) byWallet.set(wallet, []);
    byWallet.get(wallet).push(row);
  }
  for (const [wallet, list] of byWallet) {
    const bySport = new Map();
    for (const row of list) {
      const sport = normMlMiniSport(row.sport);
      if (!bySport.has(sport)) bySport.set(sport, []);
      bySport.get(sport).push(row);
    }
    for (const [sport, bets] of bySport) {
      const trustRows = [];
      for (const row of bets) {
        const won = wonOf(row);
        const price = Number(row.avgPrice ?? row.price);
        const date = String(row.date).slice(0, 10);
        if (won == null || !(price > 0 && price < 1)) continue;
        const band = mlPriceBand(price);
        trustRows.push({ date, price, won, key: `${date}|${band ?? ''}` });
      }
      const state = buildTrustState(trustRows, { asOf });
      const age = state.firstBetDate ? daysBetween(state.firstBetDate, asOf) : null;
      if (!(state.tier >= 4 && isTrustOn(state.status) && age >= 15)) continue;
      index.set(bookKey(sport, wallet), { good: true });
    }
  }
  return index;
}

export function serializeV13MlBook(index, asOf) {
  const rows = [];
  for (const key of index?.keys?.() || []) {
    const [sport, wallet] = String(key).split('|');
    rows.push({ sport, wallet });
  }
  rows.sort((a, b) => a.sport.localeCompare(b.sport) || a.wallet.localeCompare(b.wallet));
  return { asOf, rows };
}

export function hydrateV13MlBook(payload) {
  const index = new Map();
  for (const row of payload?.rows || []) {
    if (!row?.sport || !row?.wallet) continue;
    index.set(bookKey(row.sport, row.wallet), { good: true });
  }
  return index;
}

function lookup(book, sport, wallet) {
  return book.get(bookKey(sport, wallet)) || null;
}

function viewPosition(row) {
  return {
    wallet: mlMiniWalletId(row),
    side: String(row?.side || '').toLowerCase(),
    market: normMlMiniMarket(row?.marketType || row?.market),
  };
}

function bookOf(book) {
  return book instanceof Map ? book : bookIndex;
}

/** Qualified wallets with a moneyline position on this side. */
export function qualifyingV13Wallets({ sport, side, positions, book = null } = {}) {
  const index = bookOf(book);
  const sp = normMlMiniSport(sport);
  const mySide = String(side || '').toLowerCase();
  const out = [];
  if (!SPORTS.has(sp) || !mySide) return out;
  const seen = new Set();
  for (const raw of positions || []) {
    const row = viewPosition(raw);
    if (row.market && row.market !== 'ML') continue;
    if (row.side !== mySide || !row.wallet || seen.has(row.wallet)) continue;
    if (!lookup(index, sp, row.wallet)?.good) continue;
    seen.add(row.wallet);
    out.push(row.wallet);
  }
  return out;
}

function againstWallets(positions, sport, side, book) {
  const sp = normMlMiniSport(sport);
  const mySide = String(side || '').toLowerCase();
  const against = new Set();
  for (const raw of positions || []) {
    const row = viewPosition(raw);
    if (row.market && row.market !== 'ML') continue;
    if (!row.wallet || !row.side || row.side === mySide) continue;
    if (lookup(book, sp, row.wallet)?.good) against.add(row.wallet);
  }
  return against.size;
}

/**
 * @returns {{
 *   fires: boolean, action: 'STAKE'|'MUTE'|'PASS'|'EXEMPT',
 *   units: number, unitsPre: number, zone: string|null,
 *   steam: number|null, edge: number|null, against: number, wallets: string[],
 * }}
 */
export function applyV13MlPath({
  units = 0,
  pickDate = null,
  sport = null,
  market = null,
  side = null,
  positions = null,
  odds = null,
  price = null,
  steam = null,
  edge = null,
  manual = false,
  killed = false,
  book = null,
} = {}) {
  const pre = Number.isFinite(Number(units)) ? Math.max(0, Number(units)) : 0;
  const move = roundTenth(steam);
  const base = {
    fires: false,
    units: pre,
    unitsPre: pre,
    zone: null,
    steam: move,
    edge: finiteEdge(edge),
    against: 0,
    wallets: [],
  };
  if (manual === true || killed === true) return { ...base, action: 'EXEMPT' };
  if (!isV13MlLive(pickDate)) return { ...base, action: 'EXEMPT' };
  if (normMlMiniMarket(market) !== 'ML' || !SPORTS.has(normMlMiniSport(sport))) {
    return { ...base, action: 'PASS' };
  }
  const index = bookOf(book);
  const wallets = qualifyingV13Wallets({ sport, side, positions, book: index });
  if (!wallets.length) return { ...base, action: 'PASS' };
  const against = againstWallets(positions, sport, side, index);
  const armed = { ...base, fires: true, against, wallets };
  if (against > 0) return { ...armed, action: 'PASS' };
  if (armed.edge == null || armed.edge < 0) return { ...armed, action: 'PASS' };
  if (move == null) return { ...armed, action: 'PASS' };
  if (move < 0) return { ...armed, action: 'MUTE', units: 0, zone: 'against' };
  if (armed.edge >= V13_ML_EDGE_MAX) {
    const high = v13HighPriceZone(odds, price);
    if (high === 'juice' || high == null) return { ...armed, action: 'PASS', zone: high || null };
    if (high === 'short') {
      return { ...armed, action: 'STAKE', units: V13_ML_HIGH_FULL_UNITS, zone: high };
    }
    return { ...armed, action: 'STAKE', units: V13_ML_HIGH_LONG_UNITS, zone: high };
  }
  const zone = v13PriceZone(odds, price);
  if (zone === 'juice') return { ...armed, action: 'PASS', zone };
  if (move >= V13_ML_STEAM_HEAVY) {
    return { ...armed, action: 'STAKE', units: V13_ML_HEAVY_UNITS, zone: 'heavy' };
  }
  if (move >= V13_ML_STEAM_MID) {
    return { ...armed, action: 'STAKE', units: V13_ML_MID_UNITS, zone: 'mid' };
  }
  if (zone == null) return { ...armed, action: 'PASS' };
  if (zone === 'favorite') {
    return { ...armed, action: 'STAKE', units: V13_ML_FAVORITE_UNITS, zone };
  }
  return { ...armed, action: 'STAKE', units: V13_ML_LONG_UNITS, zone };
}

export function v13MlStamp(policy) {
  if (!policy || policy.action === 'EXEMPT' || policy.action === 'PASS') return {};
  return {
    v8_v13Ml: true,
    v8_v13MlAction: policy.action,
    v8_v13MlUnits: policy.units,
    v8_v13MlZone: policy.zone ?? null,
    v8_v13MlSteam: policy.steam ?? null,
    v8_v13MlEdge: policy.edge ?? null,
    v8_v13MlAgainst: policy.against ?? 0,
    v8_v13MlWallets: policy.wallets || [],
    v8_unitsPreV13Ml: policy.unitsPre,
  };
}
