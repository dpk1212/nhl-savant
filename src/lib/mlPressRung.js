/**
 * Moneyline press rung. From 2026-11-16.
 *
 * A press is 1.5× or more of that wallet's sport usual, measured on bets
 * dated before this morning. The wallet is tier 4 or 5, form on, and the
 * sport book is at least 15 days old. NHL, NBA, NFL, CFB, and CBB.
 *
 * Full size is the press band of the biggest press on the side: 3× or
 * more is 5, 2× up to 3× is 4, and 1.5× up to 2× is 3. When that band is
 * not established, full size is 4.
 *
 * −150 through −425 is that full size. A price juicier than −425 stays
 * where the juice mute left it. Pick'em up to the price just before −150,
 * with steam of 4.5 or more, is three quarters of the full size. Every
 * other press on the side is 0. Pick'em starts at +110.
 *
 * This replaces the stake that arrived. Manual stake, an operator kill,
 * the T-15 freeze, and a graded ticket stay at the caller.
 */

import { pressBand } from './pressLadderOverlay.js';
import { mlMiniBookIndex, mlMiniWalletId } from './mlMiniRung.js';

export const ML_PRESS_FROM = '2026-11-16';
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
 * @returns {{
 *   fires: boolean, action: 'STAKE'|'MUTE'|'PASS'|'EXEMPT',
 *   units: number, unitsPre: number, full: number|null, zone: string|null,
 *   steam: number|null, ratio: number|null, wallets: string[],
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
    ratio: null,
    wallets: [],
  };
  if (manual === true || killed === true) return { ...base, action: 'EXEMPT' };
  if (!isMlPressLive(pickDate)) return { ...base, action: 'EXEMPT' };
  if (normMlPressMarket(market) !== 'ML' || !SPORTS.has(normMlPressSport(sport))) {
    return { ...base, action: 'PASS' };
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
    v8_mlPressRatio: policy.ratio ?? null,
    v8_mlPressWallets: policy.wallets || [],
    v8_unitsPreMlPress: policy.unitsPre,
  };
}
