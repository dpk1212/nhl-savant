/**
 * Total mini rung. From 2026-11-16.
 *
 * A mini is 0.75× up to 1.5× of that wallet's sport usual, measured on
 * bets dated before this morning. The wallet is tier 4 or 5, form on,
 * and the sport book is at least 15 days old. Skill is how far those
 * prior totals beat the price on this side of the number and at this
 * size of the number: over or under, then the band inside the sport.
 * The exact band at 4 bets, otherwise that band and its neighbors on
 * the same side at 6. Eight points or more qualifies.
 *
 * The side is 3u when the market press edge is 5 or more and the line
 * is flat. Press edge is the FOR wallets' win rate minus 52.4, rounded
 * to a tenth. Flat is a steam M that rounds to 0. A shorten, a line
 * moving against, and a press edge under 5 stay on the stake that arrived.
 *
 * This replaces the stake that arrived. Manual stake, an operator kill,
 * the T-15 freeze, and a graded ticket stay at the caller. Four sports.
 * Total only.
 */

import { buildTrustState, isTrustOn } from './walletTrustStatus.js';

export const TOTAL_MINI_FROM = '2026-11-16';
export const TOTAL_MINI_RATIO_MIN = 0.75;
export const TOTAL_MINI_RATIO_MAX = 1.5;
export const TOTAL_MINI_SKILL = 8;
export const TOTAL_MINI_EXACT_N = 4;
export const TOTAL_MINI_WIDE_N = 6;
export const TOTAL_MINI_PRESS = 5;
export const TOTAL_MINI_UNITS = 3;
export const TOTAL_MINI_STAKE_TIER = 'TOTAL-MINI';
export const TOTAL_MINI_RESCUED_BY = 'total-mini';

const SPORTS = new Set(['NHL', 'NBA', 'NFL', 'CFB']);
const TOTAL_MAG = {
  NHL: ['to 5.5', '6', '6.5', '7+'],
  NBA: ['under 220', '220s', '230s', '240+'],
  NFL: ['under 43', '43 to 47', '47 to 51', '51+'],
  CFB: ['under 50', '50 to 58', '58 to 66', '66+'],
};

let bookIndex = new Map();

export function isTotalMiniLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= TOTAL_MINI_FROM;
}

export function setTotalMiniBook(index) {
  bookIndex = index instanceof Map ? index : new Map();
}

export function totalMiniBookIndex() {
  return bookIndex;
}

export function normTotalMiniSport(sport) {
  const u = String(sport || '').toUpperCase();
  return (u === 'NCAAF' || u === 'NCAAFB') ? 'CFB' : u;
}

export function normTotalMiniMarket(market) {
  const u = String(market || '').toUpperCase();
  if (u === 'ML' || u === 'MONEYLINE' || u === 'H2H') return 'ML';
  if (u.includes('SPREAD')) return 'SPREAD';
  if (u.includes('TOTAL')) return 'TOTAL';
  return u;
}

export function totalMiniWalletId(row) {
  return String(row?.walletShort || row?.wallet || '').slice(-6).toLowerCase();
}

export function totalMagnitude(sport, line) {
  const n = Number(line);
  const sp = normTotalMiniSport(sport);
  if (!Number.isFinite(n) || !TOTAL_MAG[sp]) return null;
  if (sp === 'NHL') {
    if (n < 6) return 'to 5.5';
    if (n < 6.5) return '6';
    if (n < 7) return '6.5';
    return '7+';
  }
  if (sp === 'NBA') {
    if (n < 220) return 'under 220';
    if (n < 230) return '220s';
    if (n < 240) return '230s';
    return '240+';
  }
  if (sp === 'NFL') {
    if (n < 43) return 'under 43';
    if (n < 47) return '43 to 47';
    if (n < 51) return '47 to 51';
    return '51+';
  }
  if (n < 50) return 'under 50';
  if (n < 58) return '50 to 58';
  if (n < 66) return '58 to 66';
  return '66+';
}

function bookKey(sport, wallet) {
  return `${sport}|${wallet}`;
}

function cellKey(sign, mag) {
  return `${sign}|${mag}`;
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

function addCell(cell, won, price) {
  cell[0] += 1;
  cell[1] += won ? 1 : 0;
  cell[2] += price;
}

function edgeOf(cell) {
  if (!cell || !(cell[0] > 0)) return null;
  return 100 * (cell[1] / cell[0] - cell[2] / cell[0]);
}

function roundTenth(value) {
  if (value == null || value === '') return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return Math.round(n * 10) / 10;
}

export function totalLineOf(row) {
  const n = Number(row?.totalLine ?? row?.entryLine);
  return Number.isFinite(n) ? n : null;
}

export function pressCoversTotalMini(edge) {
  const r = roundTenth(edge);
  return r != null && r >= TOTAL_MINI_PRESS;
}

export function steamIsFlat(m) {
  return roundTenth(m) === 0;
}

/** Points over the price in the line cell. Null when the read is too thin. */
export function totalMiniSkill(cells, sport, side, line) {
  const sign = side === 'over' || side === 'under' ? side : null;
  const mag = totalMagnitude(sport, line);
  if (!sign || !mag || !cells) return null;
  const exact = cells[cellKey(sign, mag)];
  if (exact && exact[0] >= TOTAL_MINI_EXACT_N) return edgeOf(exact);
  const mags = TOTAL_MAG[normTotalMiniSport(sport)] || [];
  const ix = mags.indexOf(mag);
  if (ix < 0) return null;
  const wide = [0, 0, 0];
  for (const jx of [ix - 1, ix, ix + 1]) {
    const name = mags[jx];
    if (!name) continue;
    const cell = cells[cellKey(sign, name)];
    if (!cell) continue;
    wide[0] += cell[0];
    wide[1] += cell[1];
    wide[2] += cell[2];
  }
  if (wide[0] >= TOTAL_MINI_WIDE_N) return edgeOf(wide);
  return null;
}

/**
 * Good wallets, as of the morning in `asOf`. Key is sport|wallet.
 * usual is the mean invested before that morning. cells are
 * over|band or under|band → [n, wins, sum of price].
 */
export function buildTotalMiniBook(rows, asOf) {
  const index = new Map();
  if (typeof asOf !== 'string' || asOf.length < 10) return index;
  const byWallet = new Map();
  for (const row of rows || []) {
    const wallet = totalMiniWalletId(row);
    const date = String(row?.date || '').slice(0, 10);
    const sport = normTotalMiniSport(row?.sport);
    if (!wallet || date.length < 10 || !sport || date >= asOf) continue;
    if (!byWallet.has(wallet)) byWallet.set(wallet, []);
    byWallet.get(wallet).push(row);
  }
  for (const [wallet, list] of byWallet) {
    const bySport = new Map();
    for (const row of list) {
      const sport = normTotalMiniSport(row.sport);
      if (!bySport.has(sport)) bySport.set(sport, []);
      bySport.get(sport).push(row);
    }
    for (const [sport, bets] of bySport) {
      const trustRows = [];
      const cells = {};
      let n = 0;
      let invested = 0;
      for (const row of bets) {
        const won = wonOf(row);
        const price = Number(row.avgPrice ?? row.price);
        const date = String(row.date).slice(0, 10);
        if (won == null || !(price > 0 && price < 1)) continue;
        trustRows.push({ date, price, won, key: `${date}|${row.gameKey || ''}|${row.side || ''}|${row.marketType || ''}` });
        const inv = Number(row.invested ?? row.size);
        if (inv > 0) { n += 1; invested += inv; }
        if (normTotalMiniMarket(row.marketType || row.market) !== 'TOTAL') continue;
        const side = String(row.side || '').toLowerCase();
        const line = totalLineOf(row);
        const mag = totalMagnitude(sport, line);
        if ((side !== 'over' && side !== 'under') || !mag) continue;
        const key = cellKey(side, mag);
        if (!cells[key]) cells[key] = [0, 0, 0];
        addCell(cells[key], won, price);
      }
      const state = buildTrustState(trustRows, { asOf });
      const age = state.firstBetDate ? daysBetween(state.firstBetDate, asOf) : null;
      const good = state.tier >= 4 && isTrustOn(state.status) && age >= 15;
      if (!good) continue;
      index.set(bookKey(sport, wallet), {
        good: true,
        usual: n > 0 ? invested / n : null,
        cells,
      });
    }
  }
  return index;
}

export function serializeTotalMiniBook(index, asOf) {
  const rows = [];
  for (const [key, info] of index?.entries?.() || []) {
    const [sport, wallet] = String(key).split('|');
    rows.push({
      sport, wallet, usual: info.usual ?? null, cells: info.cells || {},
    });
  }
  rows.sort((a, b) => a.sport.localeCompare(b.sport) || a.wallet.localeCompare(b.wallet));
  return { asOf, rows };
}

export function hydrateTotalMiniBook(payload) {
  const index = new Map();
  for (const row of payload?.rows || []) {
    if (!row?.sport || !row?.wallet) continue;
    index.set(bookKey(row.sport, row.wallet), {
      good: true,
      usual: Number.isFinite(Number(row.usual)) ? Number(row.usual) : null,
      cells: row.cells && typeof row.cells === 'object' ? row.cells : {},
    });
  }
  return index;
}

function lookup(book, sport, wallet) {
  return book.get(bookKey(sport, wallet)) || null;
}

/**
 * Qualifying total minis on one side. `book` defaults to the morning book
 * last passed to setTotalMiniBook.
 */
export function qualifyingTotalMinis({ sport, side, positions, book = null } = {}) {
  const index = book instanceof Map ? book : bookIndex;
  const sp = normTotalMiniSport(sport);
  const mySide = String(side || '').toLowerCase();
  const out = [];
  if (!SPORTS.has(sp) || (mySide !== 'over' && mySide !== 'under')) return out;
  for (const raw of positions || []) {
    const wallet = totalMiniWalletId(raw);
    const rowSide = String(raw?.side || '').toLowerCase();
    if (rowSide !== mySide || !wallet) continue;
    const info = lookup(index, sp, wallet);
    if (!info?.good) continue;
    const invested = Number(raw?.invested ?? raw?.size);
    const ratio = info.usual > 0 && invested > 0 ? invested / info.usual : null;
    if (!(ratio >= TOTAL_MINI_RATIO_MIN && ratio < TOTAL_MINI_RATIO_MAX)) continue;
    const line = totalLineOf(raw);
    const skill = totalMiniSkill(info.cells, sp, mySide, line);
    if (!(skill >= TOTAL_MINI_SKILL)) continue;
    out.push({ wallet, ratio, skill, line });
  }
  return out;
}

/**
 * @returns {{
 *   fires: boolean, action: 'STAKE'|'PASS'|'EXEMPT',
 *   units: number, unitsPre: number, stake: number|null,
 *   skill: number|null, press: number|null, steam: number|null, wallets: string[],
 * }}
 */
export function applyTotalMiniRung({
  units = 0,
  pickDate = null,
  sport = null,
  market = null,
  side = null,
  positions = null,
  press = null,
  steam = null,
  manual = false,
  killed = false,
  book = null,
} = {}) {
  const pre = Number.isFinite(Number(units)) ? Math.max(0, Number(units)) : 0;
  const index = book instanceof Map ? book : bookIndex;
  const move = roundTenth(steam);
  const edge = roundTenth(press);
  const base = {
    fires: false,
    units: pre,
    unitsPre: pre,
    stake: null,
    skill: null,
    press: edge,
    steam: move,
    wallets: [],
  };
  if (manual === true || killed === true) return { ...base, action: 'EXEMPT' };
  if (!isTotalMiniLive(pickDate)) return { ...base, action: 'EXEMPT' };
  if (normTotalMiniMarket(market) !== 'TOTAL' || !SPORTS.has(normTotalMiniSport(sport))) {
    return { ...base, action: 'PASS' };
  }
  const quals = qualifyingTotalMinis({ sport, side, positions, book: index });
  if (!quals.length) return { ...base, action: 'PASS' };
  const best = quals.slice().sort((a, b) => b.skill - a.skill)[0];
  const held = {
    ...base,
    skill: best.skill,
    wallets: quals.map((q) => q.wallet),
  };
  if (!pressCoversTotalMini(edge) || !steamIsFlat(move)) return { ...held, action: 'PASS' };
  return {
    ...held,
    fires: true,
    action: 'STAKE',
    units: TOTAL_MINI_UNITS,
    stake: TOTAL_MINI_UNITS,
  };
}

export function totalMiniStamp(policy) {
  if (!policy || policy.action !== 'STAKE') return {};
  return {
    v8_totalMini: true,
    v8_totalMiniAction: policy.action,
    v8_totalMiniUnits: policy.units,
    v8_totalMiniSkill: policy.skill ?? null,
    v8_totalMiniPress: policy.press ?? null,
    v8_totalMiniSteam: policy.steam ?? null,
    v8_totalMiniWallets: policy.wallets || [],
    v8_unitsPreTotalMini: policy.unitsPre,
  };
}
