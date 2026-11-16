/**
 * Spread steam rung. From 2026-11-16.
 *
 * The wallet is tier 4 or 5, form on, and the sport book is at least 15
 * days old. Skill is how far those prior spreads beat the price on this
 * side of the number and at this size of the number: laying or getting,
 * then the band. The exact band at 4 bets, otherwise that band and its
 * neighbors on the same side at 6. Eight points or more qualifies.
 * Any stake size qualifies.
 *
 * A shorten of 4.5 or more, rounded to a tenth, sets the side to 3u.
 * The same 3u covers 4.5 up to 10 and 10 or more. A smaller move, a flat
 * line, and a line moving against stay on the stake that arrived.
 *
 * This replaces the stake that arrived. Manual stake, an operator kill,
 * the T-15 freeze, and a graded ticket stay at the caller. NHL, NBA, NFL,
 * CFB, and CBB. Spread only.
 */

import { buildTrustState, isTrustOn } from './walletTrustStatus.js';
import { signedSpreadEntryLine } from './spreadLineSign.js';

export const SPREAD_STEAM_FROM = '2026-11-16';
export const SPREAD_STEAM_SKILL = 8;
export const SPREAD_STEAM_EXACT_N = 4;
export const SPREAD_STEAM_WIDE_N = 6;
export const SPREAD_STEAM_MIN = 4.5;
export const SPREAD_STEAM_UNITS = 3;
export const SPREAD_STEAM_STAKE_TIER = 'SPREAD-STEAM';
export const SPREAD_STEAM_RESCUED_BY = 'spread-steam';

const SPORTS = new Set(['NHL', 'NBA', 'NFL', 'CFB', 'CBB']);
const SPREAD_MAG = {
  NHL: ['1.5', '2.5+'],
  NBA: ['to 3', '3 to 7', '7 to 10', '10+'],
  NFL: ['to 3', '3 to 7', '7 to 10', '10+'],
  CFB: ['to 7', '7 to 14', '14 to 21', '21+'],
  CBB: ['to 3', '3 to 7', '7 to 10', '10+'],
};

let bookIndex = new Map();

export function isSpreadSteamLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= SPREAD_STEAM_FROM;
}

export function setSpreadSteamBook(index) {
  bookIndex = index instanceof Map ? index : new Map();
}

export function spreadSteamBookIndex() {
  return bookIndex;
}

export function normSpreadSteamSport(sport) {
  const u = String(sport || '').toUpperCase();
  if (u === 'NCAAF' || u === 'NCAAFB') return 'CFB';
  if (u === 'NCAAB' || u === 'NCAAMB') return 'CBB';
  return u;
}

export function normSpreadSteamMarket(market) {
  const u = String(market || '').toUpperCase();
  if (u === 'ML' || u === 'MONEYLINE' || u === 'H2H') return 'ML';
  if (u.includes('SPREAD')) return 'SPREAD';
  if (u.includes('TOTAL')) return 'TOTAL';
  return u;
}

export function spreadSteamWalletId(row) {
  return String(row?.walletShort || row?.wallet || '').slice(-6).toLowerCase();
}

export function spreadSign(line) {
  const n = Number(line);
  if (!Number.isFinite(n)) return null;
  if (n <= -0.5) return 'laying';
  if (n >= 0.5) return 'getting';
  return 'pk';
}

export function spreadMagnitude(sport, line) {
  const n = Number(line);
  if (!Number.isFinite(n)) return null;
  const abs = Math.abs(n);
  if (abs < 0.5) return 'pk';
  const sp = normSpreadSteamSport(sport);
  if (sp === 'NHL') return abs < 2 ? '1.5' : '2.5+';
  if (sp === 'CFB') {
    if (abs < 7.25) return 'to 7';
    if (abs < 14.25) return '7 to 14';
    if (abs < 21.25) return '14 to 21';
    return '21+';
  }
  if (sp !== 'NBA' && sp !== 'NFL' && sp !== 'CBB') return null;
  if (abs < 3.25) return 'to 3';
  if (abs < 7.25) return '3 to 7';
  if (abs < 10.25) return '7 to 10';
  return '10+';
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

function roundSteam(m) {
  const n = Number(m);
  if (!Number.isFinite(n)) return null;
  return Math.round(n * 10) / 10;
}

export function steamCoversSpreadRung(m) {
  const r = roundSteam(m);
  return r != null && r >= SPREAD_STEAM_MIN;
}

/** Points over the price in the line cell. Null when the read is too thin. */
export function spreadSteamSkill(cells, sport, line) {
  const sign = spreadSign(line);
  const mag = spreadMagnitude(sport, line);
  if (!sign || sign === 'pk' || !mag || mag === 'pk' || !cells) return null;
  const exact = cells[cellKey(sign, mag)];
  if (exact && exact[0] >= SPREAD_STEAM_EXACT_N) return edgeOf(exact);
  const mags = SPREAD_MAG[normSpreadSteamSport(sport)] || [];
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
  if (wide[0] >= SPREAD_STEAM_WIDE_N) return edgeOf(wide);
  return null;
}

/**
 * Good wallets, as of the morning in `asOf`. Key is sport|wallet.
 * cells are sign|magnitude → [n, wins, sum of price], spreads only.
 */
export function buildSpreadSteamBook(rows, asOf) {
  const index = new Map();
  if (typeof asOf !== 'string' || asOf.length < 10) return index;
  const byWallet = new Map();
  for (const row of rows || []) {
    const wallet = spreadSteamWalletId(row);
    const date = String(row?.date || '').slice(0, 10);
    const sport = normSpreadSteamSport(row?.sport);
    if (!wallet || date.length < 10 || !sport || date >= asOf) continue;
    if (!byWallet.has(wallet)) byWallet.set(wallet, []);
    byWallet.get(wallet).push(row);
  }
  for (const [wallet, list] of byWallet) {
    const bySport = new Map();
    for (const row of list) {
      const sport = normSpreadSteamSport(row.sport);
      if (!bySport.has(sport)) bySport.set(sport, []);
      bySport.get(sport).push(row);
    }
    for (const [sport, bets] of bySport) {
      const trustRows = [];
      const cells = {};
      for (const row of bets) {
        const won = wonOf(row);
        const price = Number(row.avgPrice ?? row.price);
        const date = String(row.date).slice(0, 10);
        if (won == null || !(price > 0 && price < 1)) continue;
        trustRows.push({ date, price, won, key: `${date}|${row.gameKey || ''}|${row.side || ''}|${row.marketType || ''}` });
        if (normSpreadSteamMarket(row.marketType || row.market) !== 'SPREAD') continue;
        const line = signedSpreadEntryLine(row);
        const sign = spreadSign(line);
        const mag = spreadMagnitude(sport, line);
        if (!sign || sign === 'pk' || !mag || mag === 'pk') continue;
        const key = cellKey(sign, mag);
        if (!cells[key]) cells[key] = [0, 0, 0];
        addCell(cells[key], won, price);
      }
      const state = buildTrustState(trustRows, { asOf });
      const age = state.firstBetDate ? daysBetween(state.firstBetDate, asOf) : null;
      const good = state.tier >= 4 && isTrustOn(state.status) && age >= 15;
      if (!good) continue;
      index.set(bookKey(sport, wallet), { good: true, cells });
    }
  }
  return index;
}

export function serializeSpreadSteamBook(index, asOf) {
  const rows = [];
  for (const [key, info] of index?.entries?.() || []) {
    const [sport, wallet] = String(key).split('|');
    rows.push({ sport, wallet, cells: info.cells || {} });
  }
  rows.sort((a, b) => a.sport.localeCompare(b.sport) || a.wallet.localeCompare(b.wallet));
  return { asOf, rows };
}

export function hydrateSpreadSteamBook(payload) {
  const index = new Map();
  for (const row of payload?.rows || []) {
    if (!row?.sport || !row?.wallet) continue;
    index.set(bookKey(row.sport, row.wallet), {
      good: true,
      cells: row.cells && typeof row.cells === 'object' ? row.cells : {},
    });
  }
  return index;
}

function lookup(book, sport, wallet) {
  return book.get(bookKey(sport, wallet)) || null;
}

/**
 * Qualifying spreads on one side. Any size. `book` defaults to the morning
 * book last passed to setSpreadSteamBook.
 */
export function qualifyingSpreadSteam({ sport, side, positions, book = null } = {}) {
  const index = book instanceof Map ? book : bookIndex;
  const sp = normSpreadSteamSport(sport);
  const mySide = String(side || '').toLowerCase();
  const out = [];
  if (!SPORTS.has(sp) || !mySide) return out;
  for (const raw of positions || []) {
    const wallet = spreadSteamWalletId(raw);
    const rowSide = String(raw?.side || '').toLowerCase();
    if (rowSide !== mySide || !wallet) continue;
    const info = lookup(index, sp, wallet);
    if (!info?.good) continue;
    const line = signedSpreadEntryLine(raw);
    const skill = spreadSteamSkill(info.cells, sp, line);
    if (!(skill >= SPREAD_STEAM_SKILL)) continue;
    out.push({ wallet, skill, line });
  }
  return out;
}

/**
 * @returns {{
 *   fires: boolean, action: 'STAKE'|'PASS'|'EXEMPT',
 *   units: number, unitsPre: number, stake: number|null,
 *   skill: number|null, steam: number|null, wallets: string[],
 * }}
 */
export function applySpreadSteamRung({
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
    steam: move,
    wallets: [],
  };
  if (manual === true || killed === true) return { ...base, action: 'EXEMPT' };
  if (!isSpreadSteamLive(pickDate)) return { ...base, action: 'EXEMPT' };
  if (normSpreadSteamMarket(market) !== 'SPREAD' || !SPORTS.has(normSpreadSteamSport(sport))) {
    return { ...base, action: 'PASS' };
  }
  const quals = qualifyingSpreadSteam({ sport, side, positions, book: index });
  if (!quals.length) return { ...base, action: 'PASS' };
  const best = quals.slice().sort((a, b) => b.skill - a.skill)[0];
  if (!steamCoversSpreadRung(move)) {
    return {
      ...base,
      skill: best.skill,
      wallets: quals.map((q) => q.wallet),
      action: 'PASS',
    };
  }
  return {
    ...base,
    fires: true,
    action: 'STAKE',
    units: SPREAD_STEAM_UNITS,
    stake: SPREAD_STEAM_UNITS,
    skill: best.skill,
    wallets: quals.map((q) => q.wallet),
  };
}

export function spreadSteamStamp(policy) {
  if (!policy || policy.action !== 'STAKE') return {};
  return {
    v8_spreadSteam: true,
    v8_spreadSteamAction: policy.action,
    v8_spreadSteamUnits: policy.units,
    v8_spreadSteamSkill: policy.skill ?? null,
    v8_spreadSteamMove: policy.steam ?? null,
    v8_spreadSteamWallets: policy.wallets || [],
    v8_unitsPreSpreadSteam: policy.unitsPre,
  };
}
