/**
 * Moneyline mini rung. From 2026-11-16.
 *
 * A mini is 0.75× up to 1.5× of that wallet's sport usual, measured on
 * bets dated before this morning. The wallet is tier 4 or 5, form on,
 * and the sport book is at least 15 days old. Skill is how far those
 * prior moneyline bets beat the price in this odds band: the exact band
 * at 4 bets, otherwise the band and its neighbors at 6. Eight points or
 * more qualifies.
 *
 * Nobody against, any number on our side: 3u, or 4u when the line has
 * shortened. Somebody against: 0, or 2u when the line has shortened.
 * The shorten is the steam M, rounded to a tenth, above 0.
 *
 * This is the size for that side. It replaces the stake that arrived.
 * Manual stake, an operator kill, the T-15 freeze, and a graded ticket
 * stay at the caller. NHL, NBA, NFL, CFB, and CBB. Moneyline only.
 */

import { buildTrustState, isTrustOn } from './walletTrustStatus.js';

export const ML_MINI_FROM = '2026-11-16';
export const ML_MINI_RATIO_MIN = 0.75;
export const ML_MINI_RATIO_MAX = 1.5;
export const ML_MINI_SKILL = 8;
export const ML_MINI_EXACT_N = 4;
export const ML_MINI_WIDE_N = 6;
export const ML_MINI_CLEAR_UNITS = 3;
export const ML_MINI_STEAM_UNITS = 4;
export const ML_MINI_OTHER_UNITS = 2;
export const ML_MINI_STAKE_TIER = 'ML-MINI';
export const ML_MINI_RESCUED_BY = 'ml-mini';
export const ML_MINI_MUTED_BY = 'ml-mini';

const SPORTS = new Set(['NHL', 'NBA', 'NFL', 'CFB', 'CBB']);

let bookIndex = new Map();

export function isMlMiniLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= ML_MINI_FROM;
}

export function setMlMiniBook(index) {
  bookIndex = index instanceof Map ? index : new Map();
}

export function mlMiniBookIndex() {
  return bookIndex;
}

export function normMlMiniSport(sport) {
  const u = String(sport || '').toUpperCase();
  if (u === 'NCAAF' || u === 'NCAAFB') return 'CFB';
  if (u === 'NCAAB' || u === 'NCAAMB') return 'CBB';
  return u;
}

export function normMlMiniMarket(market) {
  const u = String(market || '').toUpperCase();
  if (u === 'ML' || u === 'MONEYLINE' || u === 'H2H') return 'ML';
  if (u.includes('SPREAD')) return 'SPREAD';
  if (u.includes('TOTAL')) return 'TOTAL';
  return u;
}

export function mlMiniWalletId(row) {
  return String(row?.walletShort || row?.wallet || '').slice(-6).toLowerCase();
}

export function mlPriceBand(price) {
  const p = Number(price);
  if (!(p > 0 && p < 1)) return null;
  if (p >= 0.75) return 6;
  if (p >= 0.667) return 5;
  if (p >= 0.6) return 4;
  if (p >= 0.524) return 3;
  if (p >= 0.476) return 2;
  if (p >= 0.333) return 1;
  return 0;
}

function emptyBands() {
  return Array.from({ length: 7 }, () => [0, 0, 0]);
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

function addBand(cell, won, price) {
  cell[0] += 1;
  cell[1] += won ? 1 : 0;
  cell[2] += price;
}

function edgeOf(cell) {
  if (!cell || !(cell[0] > 0)) return null;
  return 100 * (cell[1] / cell[0] - cell[2] / cell[0]);
}

/** Points over the price in the odds band. Null when the read is too thin. */
export function mlMiniSkill(bands, price) {
  const band = mlPriceBand(price);
  if (band == null || !Array.isArray(bands)) return null;
  const exact = bands[band];
  if (exact && exact[0] >= ML_MINI_EXACT_N) return edgeOf(exact);
  const wide = [0, 0, 0];
  for (const ix of [band - 1, band, band + 1]) {
    const cell = bands[ix];
    if (!cell) continue;
    wide[0] += cell[0];
    wide[1] += cell[1];
    wide[2] += cell[2];
  }
  if (wide[0] >= ML_MINI_WIDE_N) return edgeOf(wide);
  return null;
}

function roundSteam(m) {
  const n = Number(m);
  if (!Number.isFinite(n)) return null;
  return Math.round(n * 10) / 10;
}

export function steamIsPositive(m) {
  const r = roundSteam(m);
  return r != null && r > 0;
}

/**
 * Good wallets, as of the morning in `asOf`. Key is sport|wallet.
 * usual is the mean invested before that morning. bands are the seven
 * moneyline price cells, each [n, wins, sum of price].
 */
export function buildMlMiniBook(rows, asOf) {
  const index = new Map();
  if (typeof asOf !== 'string' || asOf.length < 10) return index;
  const byWallet = new Map();
  for (const row of rows || []) {
    const wallet = mlMiniWalletId(row);
    const date = String(row?.date || '').slice(0, 10);
    const sport = normMlMiniSport(row?.sport);
    if (!wallet || date.length < 10 || !sport || date >= asOf) continue;
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
      const bands = emptyBands();
      let n = 0;
      let invested = 0;
      for (const row of bets) {
        const won = wonOf(row);
        const price = Number(row.avgPrice ?? row.price);
        const date = String(row.date).slice(0, 10);
        if (won == null || !(price > 0 && price < 1)) continue;
        trustRows.push({ date, price, won, key: `${date}|${row.gameKey || ''}|${row.side || ''}` });
        const inv = Number(row.invested ?? row.size);
        if (inv > 0) { n += 1; invested += inv; }
        if (normMlMiniMarket(row.marketType || row.market) === 'ML') {
          const band = mlPriceBand(price);
          if (band != null) addBand(bands[band], won, price);
        }
      }
      const state = buildTrustState(trustRows, { asOf });
      const age = state.firstBetDate ? daysBetween(state.firstBetDate, asOf) : null;
      const good = state.tier >= 4 && isTrustOn(state.status) && age >= 15;
      if (!good) continue;
      index.set(bookKey(sport, wallet), {
        good: true,
        usual: n > 0 ? invested / n : null,
        bands,
      });
    }
  }
  return index;
}

export function serializeMlMiniBook(index, asOf) {
  const rows = [];
  for (const [key, info] of index?.entries?.() || []) {
    const [sport, wallet] = String(key).split('|');
    rows.push({
      sport, wallet, usual: info.usual ?? null, bands: info.bands,
    });
  }
  rows.sort((a, b) => a.sport.localeCompare(b.sport) || a.wallet.localeCompare(b.wallet));
  return { asOf, rows };
}

export function hydrateMlMiniBook(payload) {
  const index = new Map();
  for (const row of payload?.rows || []) {
    if (!row?.sport || !row?.wallet) continue;
    index.set(bookKey(row.sport, row.wallet), {
      good: true,
      usual: Number.isFinite(Number(row.usual)) ? Number(row.usual) : null,
      bands: Array.isArray(row.bands) ? row.bands : emptyBands(),
    });
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
    invested: Number(row?.invested ?? row?.size),
    price: Number(row?.avgPrice ?? row?.price),
  };
}

/**
 * Qualifying minis on one side. `book` defaults to the morning book last
 * passed to setMlMiniBook.
 */
export function qualifyingMinis({ sport, side, positions, book = null } = {}) {
  const index = book instanceof Map ? book : bookIndex;
  const sp = normMlMiniSport(sport);
  const mySide = String(side || '').toLowerCase();
  const out = [];
  if (!SPORTS.has(sp) || !mySide) return out;
  for (const raw of positions || []) {
    const row = viewPosition(raw);
    if (row.side !== mySide || !row.wallet) continue;
    const info = lookup(index, sp, row.wallet);
    if (!info?.good) continue;
    const ratio = info.usual > 0 && row.invested > 0 ? row.invested / info.usual : null;
    if (!(ratio >= ML_MINI_RATIO_MIN && ratio < ML_MINI_RATIO_MAX)) continue;
    const skill = mlMiniSkill(info.bands, row.price);
    if (!(skill >= ML_MINI_SKILL)) continue;
    out.push({ wallet: row.wallet, ratio, skill, price: row.price });
  }
  return out;
}

function againstCount(positions, sport, side, book) {
  const sp = normMlMiniSport(sport);
  const mySide = String(side || '').toLowerCase();
  const against = new Set();
  for (const raw of positions || []) {
    const row = viewPosition(raw);
    if (!row.wallet || row.side === mySide || !row.side) continue;
    const info = lookup(book, sp, row.wallet);
    if (info?.good) against.add(row.wallet);
  }
  return against.size;
}

/**
 * @returns {{
 *   fires: boolean, action: 'STAKE'|'MUTE'|'PASS'|'EXEMPT',
 *   units: number, unitsPre: number, stake: number|null,
 *   skill: number|null, against: number, steam: number|null, wallets: string[],
 * }}
 */
export function applyMlMiniRung({
  units = 0,
  pickDate = null,
  sport = null,
  market = null,
  side = null,
  positions = null,
  steam = null,
  manual = false,
  killed = false,
  book = null,
} = {}) {
  const pre = Number.isFinite(Number(units)) ? Math.max(0, Number(units)) : 0;
  const index = book instanceof Map ? book : bookIndex;
  const move = roundSteam(steam);
  const base = {
    fires: false,
    units: pre,
    unitsPre: pre,
    stake: null,
    skill: null,
    against: 0,
    steam: move,
    wallets: [],
  };
  if (manual === true || killed === true) return { ...base, action: 'EXEMPT' };
  if (!isMlMiniLive(pickDate)) return { ...base, action: 'EXEMPT' };
  if (normMlMiniMarket(market) !== 'ML' || !SPORTS.has(normMlMiniSport(sport))) {
    return { ...base, action: 'PASS' };
  }
  const minis = qualifyingMinis({ sport, side, positions, book: index });
  if (!minis.length) return { ...base, action: 'PASS' };
  const against = againstCount(positions, sport, side, index);
  const positive = steamIsPositive(move);
  const best = minis.slice().sort((a, b) => b.skill - a.skill)[0];
  const fired = {
    ...base,
    fires: true,
    skill: best.skill,
    against,
    wallets: minis.map((m) => m.wallet),
  };
  if (against === 0) {
    const stake = positive ? ML_MINI_STEAM_UNITS : ML_MINI_CLEAR_UNITS;
    return { ...fired, action: 'STAKE', units: stake, stake };
  }
  if (positive) {
    return { ...fired, action: 'STAKE', units: ML_MINI_OTHER_UNITS, stake: ML_MINI_OTHER_UNITS };
  }
  return { ...fired, action: 'MUTE', units: 0, stake: 0 };
}

export function mlMiniStamp(policy) {
  if (!policy || policy.action === 'EXEMPT' || policy.action === 'PASS') return {};
  return {
    v8_mlMini: true,
    v8_mlMiniAction: policy.action,
    v8_mlMiniUnits: policy.units,
    v8_mlMiniSkill: policy.skill ?? null,
    v8_mlMiniAgainst: policy.against,
    v8_mlMiniSteam: policy.steam ?? null,
    v8_mlMiniWallets: policy.wallets || [],
    v8_unitsPreMlMini: policy.unitsPre,
  };
}
