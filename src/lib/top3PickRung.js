/**
 * Top-3 pick rung. From 2026-10-29.
 *
 * Each morning, inside one sport and one market, rank wallets by last-30-day
 * dollar ROI on bets dated before that morning. Need 5 bets and at least 4
 * wallets, or there is no rank. Stake the top 3 when the price is a pick'em
 * (−100 through +120, or 45¢ up to just under 52¢), the bet is under 1.5×
 * their usual size, and no other top-3 wallet is on the other side.
 *
 * 1× to 1.5× → 4u. Under 1× → 2u. Never downsizes a larger stake.
 * NHL, NBA, NFL, CFB. Moneyline, spread, total.
 */

export const TOP3_PICK_FROM = '2026-10-29';
export const TOP3_PICK_STAKE_TIER = 'TOP3-PICK';
export const TOP3_PICK_RESCUED_BY = 'top3-pick';
export const TOP3_PICK_PROMOTED_BY = 'top3-pick';

const SPORTS = new Set(['NHL', 'NBA', 'NFL', 'CFB']);
const MARKETS = new Set(['ML', 'SPREAD', 'TOTAL']);

let rankIndex = new Map();

export function isTop3PickLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= TOP3_PICK_FROM;
}

export function top3PickWindowStart(asOf) {
  return new Date(Date.parse(`${asOf}T00:00:00Z`) - 30 * 86400000).toISOString().slice(0, 10);
}

export function setTop3PickRanks(index) {
  rankIndex = index instanceof Map ? index : new Map();
}

export function top3PickRankIndex() {
  return rankIndex;
}

export function normTop3Sport(sport) {
  const u = String(sport || '').toUpperCase();
  return (u === 'NCAAF' || u === 'NCAAFB') ? 'CFB' : u;
}

export function normTop3Market(market) {
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

function num(v) {
  if (v == null || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function walletId(p) {
  return String(p?.walletShort || p?.wallet || '').slice(-6).toLowerCase();
}

function rankKey(sport, market, wallet) {
  return `${sport}|${market}|${wallet}`;
}

/** American −100 through +120. Else 45¢ up to just under 52¢. −110 is a favorite. */
export function isTop3PickPrice(odds, avgPrice) {
  if (Number.isFinite(odds) && odds !== 0) return odds > -101 && odds <= 120;
  const px = Number(avgPrice);
  if (px > 0 && px < 1) return px >= 0.45 && px < 0.52;
  return false;
}

export function top3SizeRatio(position) {
  const stamped = num(position?.betMultiplier);
  if (stamped != null && stamped > 0) return stamped;
  const model = num(position?.v8_sizeRatio);
  if (model != null && model > 0) return model;
  return null;
}

function isRankLeg(row) {
  if (!row || row.postponed === true) return false;
  if (String(row.result || '').toUpperCase() === 'PUSH') return false;
  if (String(row.status || '').toUpperCase() !== 'GRADED') return false;
  const invested = Number(row.invested);
  const settled = Number(row.settledPnl);
  if (!(invested > 0) || !Number.isFinite(settled) || settled === 0) return false;
  const sport = normTop3Sport(row.sport);
  const market = normTop3Market(row.marketType);
  if (!SPORTS.has(sport) || !MARKETS.has(market)) return false;
  const date = String(row.date || '').slice(0, 10);
  const wallet = walletId(row);
  if (date.length < 10 || !wallet) return false;
  return true;
}

/**
 * Morning rank. Rows are position docs. Only bets dated before `asOf` and
 * inside the prior 30 calendar days count. Rank 1 is the highest dollar ROI.
 */
export function buildTop3PickRanks(rows, asOf) {
  const index = new Map();
  if (!isTop3PickLive(asOf)) return index;
  const since = top3PickWindowStart(asOf);
  const books = new Map();
  for (const row of rows || []) {
    if (!isRankLeg(row)) continue;
    const date = String(row.date).slice(0, 10);
    if (date < since || date >= asOf) continue;
    const sport = normTop3Sport(row.sport);
    const market = normTop3Market(row.marketType);
    const wallet = walletId(row);
    const key = `${sport}|${market}|${wallet}`;
    let book = books.get(key);
    if (!book) {
      book = { sport, market, wallet, n: 0, wins: 0, invested: 0, settled: 0 };
      books.set(key, book);
    }
    const settled = Number(row.settledPnl);
    book.n += 1;
    book.invested += Number(row.invested);
    book.settled += settled;
    if (settled > 0) book.wins += 1;
  }
  const byBoard = new Map();
  for (const book of books.values()) {
    if (book.n < 5 || !(book.invested > 0)) continue;
    book.dol = (100 * book.settled) / book.invested;
    const board = `${book.sport}|${book.market}`;
    if (!byBoard.has(board)) byBoard.set(board, []);
    byBoard.get(board).push(book);
  }
  for (const people of byBoard.values()) {
    if (people.length < 4) continue;
    people.sort((a, b) => b.dol - a.dol || b.n - a.n || a.wallet.localeCompare(b.wallet));
    people.forEach((book, i) => {
      index.set(rankKey(book.sport, book.market, book.wallet), {
        rank: i + 1,
        n: book.n,
        wins: book.wins,
        losses: book.n - book.wins,
        dol: book.dol,
      });
    });
  }
  return index;
}

function lookup(index, sport, market, wallet) {
  return index.get(rankKey(sport, market, wallet)) || null;
}

function view(position) {
  return {
    wallet: walletId(position),
    side: normSide(position?.side),
    sr: top3SizeRatio(position),
    odds: num(position?.pinnacleOdds ?? position?.odds),
    avgPrice: num(position?.avgPrice),
  };
}

/**
 * One side of one game. `positions` is every wallet on that game and market,
 * both sides. Uses the ranks last passed to setTop3PickRanks.
 */
export function evaluateTop3Pick({ sport, market, side, pickDate, positions, ranks = null }) {
  const empty = { fires: false, units: 0, wallets: [], bestSr: null, reason: null };
  const index = ranks instanceof Map ? ranks : rankIndex;
  const sp = normTop3Sport(sport);
  const mkt = normTop3Market(market);
  const mySide = normSide(side);
  if (!isTop3PickLive(pickDate) || !SPORTS.has(sp) || !MARKETS.has(mkt) || !mySide) {
    return { ...empty, reason: 'not_live' };
  }
  const rows = (positions || []).map(view).filter((r) => r.wallet && r.side);
  const opp = opposite(mySide);
  const against = rows.filter((r) => r.side === opp && (lookup(index, sp, mkt, r.wallet)?.rank || 99) <= 3);
  if (against.length) {
    return { ...empty, reason: 'top3_against', against: against.map((r) => r.wallet) };
  }
  const qualifying = [];
  for (const row of rows) {
    if (row.side !== mySide) continue;
    const info = lookup(index, sp, mkt, row.wallet);
    if (!info || info.rank > 3) continue;
    if (!(Number.isFinite(row.sr) && row.sr < 1.5)) continue;
    if (!isTop3PickPrice(row.odds, row.avgPrice)) continue;
    qualifying.push({ ...row, rank: info.rank, n: info.n, wins: info.wins, losses: info.losses, dol: info.dol });
  }
  if (!qualifying.length) return { ...empty, reason: 'no_qualifying_wallet' };
  qualifying.sort((a, b) => b.sr - a.sr || a.rank - b.rank);
  const bestSr = qualifying[0].sr;
  return {
    fires: true,
    units: bestSr >= 1 ? 4 : 2,
    wallets: qualifying,
    bestSr,
    reason: 'top3_pick',
  };
}

/** Raise a side to 4u or 2u. A bigger stake already on the side stays. */
export function applyTop3PickRung({ units, sport, market, side, pickDate, positions, ranks = null }) {
  const ev = evaluateTop3Pick({ sport, market, side, pickDate, positions, ranks });
  const current = Number(units);
  const safe = Number.isFinite(current) && current > 0 ? current : 0;
  if (!ev.fires) return { ...ev, action: 'hold', units: safe };
  if (safe + 0.001 >= ev.units) return { ...ev, action: 'hold', units: safe };
  return { ...ev, action: safe > 0 ? 'floor' : 'rescue', units: ev.units };
}

export function top3PickStamp(policy) {
  if (!policy?.fires) return {};
  return {
    v8_top3Pick: true,
    v8_top3PickUnits: policy.units,
    v8_top3PickBestSr: policy.bestSr,
    v8_top3PickWallets: (policy.wallets || []).map((w) => `${w.wallet}#${w.rank}`),
  };
}
