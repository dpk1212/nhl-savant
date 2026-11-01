/**
 * Gap-lead rescue. From 2026-10-30.
 *
 * Each morning, inside one sport and one market, a wallet's last-30-day
 * dollar ROI is the graded bets dated before that morning. Five bets are
 * enough. There is no peer minimum. Tonight's invested stake-weights those
 * ROIs on each side.
 *
 * The side ships when two or more qualified wallets are on it, the other
 * side has a score, our score leads by 40 points, and the other score is
 * negative. A side at zero goes to 3u. A side already under 3u gets +1.
 * A side at 3u or more stays. The odds cap and the -425 favorite mute still
 * apply, and neither one may shrink a stake that is already on the side.
 * A stake already on the other side mutes the rescue and the +1.
 * NHL, NBA, NFL, CFB. Moneyline, spread, total.
 */

import { oddsCap } from './oddsCap.js';

export const GAP_LEAD_FROM = '2026-10-30';
export const GAP_LEAD_MIN_N = 5;
export const GAP_LEAD_MIN_WALLETS = 2;
export const GAP_LEAD_MARGIN = 40;
export const GAP_LEAD_RESCUE_UNITS = 3;
export const GAP_LEAD_BOOST_UNDER = 3;
export const GAP_LEAD_STAKE_TIER = 'GAP-LEAD';
export const GAP_LEAD_RESCUED_BY = 'gap-lead';
export const GAP_LEAD_PROMOTED_BY = 'gap-lead';
export const GAP_LEAD_FAV_JUICE = -425;

const SPORTS = new Set(['NHL', 'NBA', 'NFL', 'CFB']);
const MARKETS = new Set(['ML', 'SPREAD', 'TOTAL']);

let bookIndex = new Map();

export function isGapLeadLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= GAP_LEAD_FROM;
}

export function gapLeadWindowStart(asOf) {
  return new Date(Date.parse(`${asOf}T00:00:00Z`) - 30 * 86400000).toISOString().slice(0, 10);
}

export function setGapLeadBooks(index) {
  bookIndex = index instanceof Map ? index : new Map();
}

export function gapLeadBookIndex() {
  return bookIndex;
}

export function normGapSport(sport) {
  const u = String(sport || '').toUpperCase();
  return (u === 'NCAAF' || u === 'NCAAFB') ? 'CFB' : u;
}

export function normGapMarket(market) {
  const u = String(market || '').toUpperCase();
  if (u === 'ML' || u === 'MONEYLINE' || u === 'H2H') return 'ML';
  if (u === 'SPREAD' || u === 'SPREADS') return 'SPREAD';
  if (u === 'TOTAL' || u === 'TOTALS') return 'TOTAL';
  return u;
}

function normSide(side) {
  const u = String(side || '').toLowerCase();
  return (u === 'home' || u === 'away' || u === 'over' || u === 'under') ? u : '';
}

function opposite(side) {
  return { home: 'away', away: 'home', over: 'under', under: 'over' }[side] || '';
}

function walletId(p) {
  return String(p?.walletShort || p?.wallet || '').slice(-6).toLowerCase();
}

function bookKey(sport, market, wallet) {
  return `${sport}|${market}|${wallet}`;
}

function isBookLeg(row) {
  if (!row || row.postponed === true) return false;
  if (String(row.result || '').toUpperCase() === 'PUSH') return false;
  if (String(row.status || '').toUpperCase() !== 'GRADED') return false;
  const invested = Number(row.invested);
  const settled = Number(row.settledPnl);
  if (!(invested > 0) || !Number.isFinite(settled) || settled === 0) return false;
  const sport = normGapSport(row.sport);
  const market = normGapMarket(row.marketType);
  if (!SPORTS.has(sport) || !MARKETS.has(market)) return false;
  const date = String(row.date || '').slice(0, 10);
  const wallet = walletId(row);
  if (date.length < 10 || !wallet) return false;
  return true;
}

/**
 * Dollar ROI for every wallet with 5+ market bets before `asOf`.
 * A board with fewer than 4 wallets still counts. Rank is a different rule.
 */
export function buildGapLeadBooks(rows, asOf) {
  const index = new Map();
  if (typeof asOf !== 'string' || asOf.length < 10) return index;
  const since = gapLeadWindowStart(asOf);
  const books = new Map();
  for (const row of rows || []) {
    if (!isBookLeg(row)) continue;
    const date = String(row.date).slice(0, 10);
    if (date < since || date >= asOf) continue;
    const sport = normGapSport(row.sport);
    const market = normGapMarket(row.marketType);
    const wallet = walletId(row);
    const key = bookKey(sport, market, wallet);
    let book = books.get(key);
    if (!book) {
      book = { sport, market, wallet, n: 0, invested: 0, settled: 0 };
      books.set(key, book);
    }
    book.n += 1;
    book.invested += Number(row.invested);
    book.settled += Number(row.settledPnl);
  }
  for (const book of books.values()) {
    if (book.n < GAP_LEAD_MIN_N || !(book.invested > 0)) continue;
    index.set(bookKey(book.sport, book.market, book.wallet), {
      n: book.n,
      dol: (100 * book.settled) / book.invested,
    });
  }
  return index;
}

function sideScore(rows, sport, market, side, books) {
  const byWallet = new Map();
  for (const row of rows) {
    if (row.side !== side || !row.wallet) continue;
    const info = books.get(bookKey(sport, market, row.wallet));
    if (!info) continue;
    const invested = Number(row.invested);
    if (!(invested > 0)) continue;
    const cur = byWallet.get(row.wallet) || { wallet: row.wallet, invested: 0, dol: info.dol, n: info.n };
    cur.invested += invested;
    byWallet.set(row.wallet, cur);
  }
  const wallets = [...byWallet.values()];
  const invested = wallets.reduce((sum, w) => sum + w.invested, 0);
  if (!(invested > 0)) return { wallets, l30: null };
  const l30 = wallets.reduce((sum, w) => sum + w.dol * w.invested, 0) / invested;
  return { wallets, l30 };
}

function view(position) {
  return {
    wallet: walletId(position),
    side: normSide(position?.side),
    invested: Number(position?.invested),
  };
}

/**
 * One side of one game. `positions` is every wallet on that game and market,
 * both sides. Uses the books last passed to setGapLeadBooks.
 */
export function evaluateGapLead({ sport, market, side, pickDate, positions, books = null }) {
  const empty = {
    fires: false, ours: null, other: null, margin: null, wallets: [], reason: null,
  };
  const index = books instanceof Map ? books : bookIndex;
  const sp = normGapSport(sport);
  const mkt = normGapMarket(market);
  const mySide = normSide(side);
  if (!isGapLeadLive(pickDate) || !SPORTS.has(sp) || !MARKETS.has(mkt) || !mySide) {
    return { ...empty, reason: 'not_live' };
  }
  const rows = (positions || []).map(view);
  const ours = sideScore(rows, sp, mkt, mySide, index);
  const opp = sideScore(rows, sp, mkt, opposite(mySide), index);
  if (ours.wallets.length < GAP_LEAD_MIN_WALLETS) {
    return { ...empty, ours: ours.l30, other: opp.l30, wallets: ours.wallets, reason: 'need_two_wallets' };
  }
  if (opp.l30 == null) {
    return { ...empty, ours: ours.l30, other: null, wallets: ours.wallets, reason: 'other_side_unscored' };
  }
  const margin = ours.l30 - opp.l30;
  if (!(margin >= GAP_LEAD_MARGIN) || !(opp.l30 < 0)) {
    return { ...empty, ours: ours.l30, other: opp.l30, margin, wallets: ours.wallets, reason: 'gap_short' };
  }
  return {
    fires: true,
    ours: ours.l30,
    other: opp.l30,
    margin,
    wallets: ours.wallets,
    reason: 'gap_lead',
  };
}

function roundUnits(units) {
  return Math.round(units * 100) / 100;
}

/** Rescue a zero to 3u, or add 1u when the side is already under 3. Never shrinks. */
export function applyGapLeadRescue({
  units, odds = null, sport, market, side, pickDate, positions, books = null,
  opponentUnits = 0,
}) {
  const ev = evaluateGapLead({ sport, market, side, pickDate, positions, books });
  const current = Number(units);
  const safe = Number.isFinite(current) && current > 0 ? current : 0;
  if (Number(opponentUnits) > 0) {
    return { ...ev, fires: false, action: 'hold', units: safe, reason: 'pick_against' };
  }
  if (!ev.fires) return { ...ev, action: 'hold', units: safe };
  if (Number.isFinite(odds) && odds < GAP_LEAD_FAV_JUICE) {
    return { ...ev, action: 'hold', units: safe, reason: 'fav_juice' };
  }
  if (safe + 0.001 >= GAP_LEAD_BOOST_UNDER) return { ...ev, action: 'hold', units: safe };
  const raw = safe <= 0 ? GAP_LEAD_RESCUE_UNITS : safe + 1;
  const capped = roundUnits(oddsCap(raw, Number.isFinite(odds) ? odds : null));
  if (!(capped > safe + 0.001)) return { ...ev, action: 'hold', units: safe };
  return { ...ev, action: safe > 0 ? 'boost' : 'rescue', units: capped };
}

export function gapLeadStamp(policy) {
  if (!policy?.fires) return {};
  return {
    v8_gapLead: true,
    v8_gapLeadAction: policy.action,
    v8_gapLeadUnits: policy.units,
    v8_gapLeadOurs: policy.ours,
    v8_gapLeadOther: policy.other,
    v8_gapLeadMargin: policy.margin,
    v8_gapLeadWallets: (policy.wallets || []).map((w) => w.wallet),
  };
}
