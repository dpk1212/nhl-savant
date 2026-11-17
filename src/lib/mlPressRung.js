/**
 * Moneyline press rung. From 2026-11-16, and the summer-edge size from
 * 2026-11-17.
 *
 * Through 2026-11-16 a press is 1.5× or more of that wallet's sport usual.
 * Full size is the press band of the biggest press: 3× or more is 5, 2×
 * up to 3× is 4, and 1.5× up to 2× is 3. When that band is not established,
 * full size is 4. −150 through −425 is that full size. Pick'em up to the
 * price just before −150, with steam of 4.5 or more, is three quarters.
 * Every other press is 0.
 *
 * From 2026-11-17 the size is the summer edge of the side. A wallet counts
 * when it is tier 4 or 5, form on, the sport book is at least 15 days old,
 * and its prior moneylines in this exact odds band are 8 points over the
 * price, with at least 4 of those bets. Money share, Door-2, and a seasoned
 * press do not enter. Full size is 4. An edge of 5 or more is that full
 * size at any steam and any price. An edge under 5 is the same full size
 * when the line has shortened, and 0 when it has not. A missing edge does
 * not move the stake. A price juicier than −425 stays where the juice mute
 * left it.
 *
 * This replaces the stake that arrived. Manual stake, an operator kill,
 * the T-15 freeze, and a graded ticket stay at the caller. NHL, NBA, NFL,
 * CFB, and CBB.
 */

import { pressBand } from './pressLadderOverlay.js';
import {
  ML_MINI_EXACT_N,
  ML_MINI_SKILL,
  mlMiniBookIndex,
  mlMiniWalletId,
  mlPriceBand,
} from './mlMiniRung.js';

export const ML_PRESS_FROM = '2026-11-16';
export const ML_PRESS_EDGE_FROM = '2026-11-17';
export const ML_PRESS_EDGE_MIN = 5;
export const ML_PRESS_RATIO_MIN = 1.5;
export const ML_PRESS_FULL_DEFAULT = 4;
export const ML_PRESS_FULL_ODDS = -150;
export const ML_PRESS_JUICE_ODDS = -425;
export const ML_PRESS_PICKEM_IMPLIED = 0.476;
export const ML_PRESS_FULL_IMPLIED = 0.6;
export const ML_PRESS_STEAM = 4.5;
export const ML_PRESS_STAKE_TIER = 'ML-PRESS';
export const ML_PRESS_RESCUED_BY = 'ml-press';
export const ML_PRESS_MUTED_BY = 'ml-press';

const SPORTS = new Set(['NHL', 'NBA', 'NFL', 'CFB', 'CBB']);

export function isMlPressLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= ML_PRESS_FROM;
}

export function isMlPressEdgeLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= ML_PRESS_EDGE_FROM;
}

export function normMlPressSport(sport) {
  const u = String(sport || '').toUpperCase();
  if (u === 'NCAAF' || u === 'NCAAFB') return 'CFB';
  if (u === 'NCAAB' || u === 'NCAAMB') return 'CBB';
  return u;
}

export function normMlPressMarket(market) {
  const u = String(market || '').toUpperCase();
  if (u === 'ML' || u === 'MONEYLINE' || u === 'H2H') return 'ML';
  if (u.includes('SPREAD')) return 'SPREAD';
  if (u.includes('TOTAL')) return 'TOTAL';
  return u;
}

export function pressFullSize(ratio) {
  const band = pressBand(Number(ratio));
  return band == null ? ML_PRESS_FULL_DEFAULT : band;
}

export function pressQuarterSize(full) {
  const n = Number(full);
  if (!Number.isFinite(n)) return pressQuarterSize(ML_PRESS_FULL_DEFAULT);
  return Math.round(n * 75) / 100;
}

function impliedOf(odds) {
  const n = Number(odds);
  if (!Number.isFinite(n) || Math.abs(n) < 100) return null;
  return n < 0 ? (-n) / (-n + 100) : 100 / (n + 100);
}

function roundTenth(value) {
  if (value == null || value === '') return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return Math.round(n * 10) / 10;
}

export function steamCoversPress(m) {
  const r = roundTenth(m);
  return r != null && r >= ML_PRESS_STEAM;
}

/** A shorten. 0.04 rounds to 0 and is not one. */
export function steamIsPositiveTenth(m) {
  const r = roundTenth(m);
  return r != null && r > 0;
}

/** Points over the price in the exact band. Null until that band has 4 bets. */
export function exactBandSkill(bands, price) {
  const band = mlPriceBand(price);
  if (band == null || !Array.isArray(bands)) return null;
  const cell = bands[band];
  if (!cell || !(cell[0] >= ML_MINI_EXACT_N)) return null;
  return 100 * (cell[1] / cell[0] - cell[2] / cell[0]);
}

function finiteEdge(edge) {
  const n = Number(edge);
  return edge != null && Number.isFinite(n) ? n : null;
}

/**
 * full, middle, out, or juice. Juice is juicier than −425 and is left alone.
 * Middle is +110 up to the price just before −150.
 */
export function pressPriceZone(odds, price) {
  const american = Number(odds);
  const hasAmerican = Number.isFinite(american) && Math.abs(american) >= 100;
  if (hasAmerican && american < ML_PRESS_JUICE_ODDS) return 'juice';
  const implied = hasAmerican
    ? impliedOf(american)
    : (price > 0 && price < 1 ? price : null);
  if (implied == null) return null;
  if (!hasAmerican && implied > (425 / 525)) return 'juice';
  if (hasAmerican) {
    if (american <= ML_PRESS_FULL_ODDS && american >= ML_PRESS_JUICE_ODDS) return 'full';
  } else if (implied >= ML_PRESS_FULL_IMPLIED) return 'full';
  if (implied >= ML_PRESS_PICKEM_IMPLIED && implied < ML_PRESS_FULL_IMPLIED) return 'middle';
  return 'out';
}

function bookOf(book) {
  return book instanceof Map ? book : mlMiniBookIndex();
}

function lookup(book, sport, wallet) {
  return book.get(`${sport}|${wallet}`) || null;
}

/**
 * Good-wallet presses on one side. Ratio is invested divided by the
 * morning sport usual.
 */
export function qualifyingPresses({ sport, side, positions, book = null } = {}) {
  const index = bookOf(book);
  const sp = normMlPressSport(sport);
  const mySide = String(side || '').toLowerCase();
  const out = [];
  if (!SPORTS.has(sp) || !mySide) return out;
  for (const raw of positions || []) {
    const wallet = mlMiniWalletId(raw);
    const rowSide = String(raw?.side || '').toLowerCase();
    if (rowSide !== mySide || !wallet) continue;
    const info = lookup(index, sp, wallet);
    if (!info?.good) continue;
    const invested = Number(raw?.invested ?? raw?.size);
    const ratio = info.usual > 0 && invested > 0 ? invested / info.usual : null;
    if (!(ratio >= ML_PRESS_RATIO_MIN)) continue;
    const price = Number(raw?.avgPrice ?? raw?.price);
    out.push({
      wallet,
      ratio,
      price: price > 0 && price < 1 ? price : null,
    });
  }
  return out;
}

/**
 * Wallets already 8 points over the price in the exact band of the bet
 * they have on this side. Any size.
 */
export function qualifyingRangeWallets({ sport, side, positions, book = null } = {}) {
  const index = bookOf(book);
  const sp = normMlPressSport(sport);
  const mySide = String(side || '').toLowerCase();
  const out = [];
  if (!SPORTS.has(sp) || !mySide) return out;
  for (const raw of positions || []) {
    const wallet = mlMiniWalletId(raw);
    const rowSide = String(raw?.side || '').toLowerCase();
    if (rowSide !== mySide || !wallet) continue;
    const info = lookup(index, sp, wallet);
    if (!info?.good) continue;
    const price = Number(raw?.avgPrice ?? raw?.price);
    if (!(price > 0 && price < 1)) continue;
    const skill = exactBandSkill(info.bands, price);
    if (!(skill >= ML_MINI_SKILL)) continue;
    out.push({ wallet, skill, price });
  }
  return out;
}

/**
 * @returns {{
 *   fires: boolean, action: 'STAKE'|'MUTE'|'PASS'|'EXEMPT',
 *   units: number, unitsPre: number, full: number|null, zone: string|null,
 *   steam: number|null, edge: number|null, ratio: number|null, skill: number|null,
 *   wallets: string[],
 * }}
 */
export function applyMlPressRung({
  units = 0,
  pickDate = null,
  sport = null,
  market = null,
  side = null,
  positions = null,
  odds = null,
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
    full: null,
    zone: null,
    steam: move,
    edge: finiteEdge(edge),
    ratio: null,
    skill: null,
    wallets: [],
  };
  if (manual === true || killed === true) return { ...base, action: 'EXEMPT' };
  if (!isMlPressLive(pickDate)) return { ...base, action: 'EXEMPT' };
  if (normMlPressMarket(market) !== 'ML' || !SPORTS.has(normMlPressSport(sport))) {
    return { ...base, action: 'PASS' };
  }
  if (isMlPressEdgeLive(pickDate)) {
    const qualified = qualifyingRangeWallets({ sport, side, positions, book });
    if (!qualified.length) return { ...base, action: 'PASS' };
    const best = qualified.slice().sort((a, b) => b.skill - a.skill)[0];
    const zone = pressPriceZone(odds, best.price);
    const fired = {
      ...base,
      fires: true,
      full: ML_PRESS_FULL_DEFAULT,
      skill: best.skill,
      wallets: qualified.map((row) => row.wallet),
    };
    if (zone === 'juice') return { ...fired, action: 'PASS', zone: 'juice' };
    if (base.edge == null) return { ...fired, action: 'PASS' };
    if (base.edge >= ML_PRESS_EDGE_MIN) {
      return { ...fired, action: 'STAKE', units: ML_PRESS_FULL_DEFAULT, zone: 'full' };
    }
    if (steamIsPositiveTenth(move)) {
      return { ...fired, action: 'STAKE', units: ML_PRESS_FULL_DEFAULT, zone: 'steam' };
    }
    return { ...fired, action: 'MUTE', units: 0, zone: 'flat' };
  }
  const presses = qualifyingPresses({ sport, side, positions, book });
  if (!presses.length) return { ...base, action: 'PASS' };
  const ratio = Math.max(...presses.map((p) => p.ratio));
  const full = pressFullSize(ratio);
  const walletPrice = presses.slice().sort((a, b) => b.ratio - a.ratio)[0].price;
  const zone = pressPriceZone(odds, walletPrice);
  const fired = {
    ...base,
    fires: true,
    full,
    zone,
    ratio,
    wallets: presses.map((p) => p.wallet),
  };
  if (zone === 'juice' || zone == null) return { ...fired, action: 'PASS' };
  if (zone === 'full') return { ...fired, action: 'STAKE', units: full };
  if (zone === 'middle' && steamCoversPress(move)) {
    return { ...fired, action: 'STAKE', units: pressQuarterSize(full) };
  }
  return { ...fired, action: 'MUTE', units: 0 };
}

export function mlPressStamp(policy) {
  if (!policy || policy.action === 'EXEMPT' || policy.action === 'PASS') return {};
  return {
    v8_mlPress: true,
    v8_mlPressAction: policy.action,
    v8_mlPressUnits: policy.units,
    v8_mlPressFull: policy.full ?? null,
    v8_mlPressZone: policy.zone ?? null,
    v8_mlPressSteam: policy.steam ?? null,
    v8_mlPressEdge: policy.edge ?? null,
    v8_mlPressSkill: policy.skill ?? null,
    v8_mlPressRatio: policy.ratio ?? null,
    v8_mlPressWallets: policy.wallets || [],
    v8_unitsPreMlPress: policy.unitsPre,
  };
}
