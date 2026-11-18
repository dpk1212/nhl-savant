/**
 * Odds and size books for the Action expand tiles.
 * One bucket everywhere: mlPriceBand on the fill price, size versus
 * this sport's usual. The page matches the stamps. It does not re-bucket.
 */
import { mlPriceBand } from './mlMiniRung.js';
import { sizeBandKeyFromRatio } from './sizeRatioBands.js';

export const PRICE_BAND_LABEL = {
  0: '+201 or longer',
  1: '+111 to +200',
  2: '−110 to +110',
  3: '−111 to −149',
  4: '−150 to −199',
  5: '−200 to −299',
  6: '−300 or shorter',
};

export const SIZE_BAND_CHIP = {
  light: '<0.5× light',
  lean: '0.5× lean',
  full: '1× full',
  press: '1.5×+ press',
};

const SIZE_KEYS = ['light', 'lean', 'full', 'press'];

export function priceBandLabel(band) {
  if (band == null || band === '') return null;
  return PRICE_BAND_LABEL[Number(band)] || null;
}

export function sizeBandChip(band) {
  return SIZE_BAND_CHIP[band] || null;
}

/** 1–1.5× is full. The row used to call that band usual. */
export function sizeWord(band, ratio) {
  if (band === 'press' || (Number.isFinite(ratio) && ratio >= 1.5)) return 'press';
  if (band === 'light' || (Number.isFinite(ratio) && ratio < 0.5)) return 'light';
  if (band === 'lean' || (Number.isFinite(ratio) && ratio < 1)) return 'lean';
  return 'full';
}

export function isPushBet(bet) {
  return Number.isFinite(Number(bet?.settledPnl)) && Math.abs(Number(bet.settledPnl)) <= 1e-9;
}

/** Fill price in 0–1. avgPrice first, then American odds. */
export function fillProb(bet) {
  const raw = Number(bet?.avgPrice ?? bet?.entryAvgPrice);
  if (Number.isFinite(raw) && raw > 0) {
    const p = raw > 1 && raw <= 100 ? raw / 100 : raw;
    if (p > 0 && p < 1) return p;
  }
  const odds = Number(bet?.pinnacleOdds ?? bet?.bestRetailOdds ?? bet?.odds);
  if (!Number.isFinite(odds) || odds === 0) return null;
  const abs = Math.abs(odds);
  const p = odds < 0 ? abs / (abs + 100) : 100 / (odds + 100);
  return p > 0 && p < 1 ? p : null;
}

export function priceBandOf(bet) {
  return mlPriceBand(fillProb(bet));
}

function wonOf(bet) {
  if (Number.isFinite(Number(bet?.settledPnl))) return Number(bet.settledPnl) > 0;
  return bet?.won === 1 || bet?.won === true;
}

function bookOf(bets) {
  if (!bets.length) return null;
  let wins = 0;
  let invested = 0;
  let pnl = 0;
  for (const bet of bets) {
    if (wonOf(bet)) wins += 1;
    invested += Number(bet.invested) || 0;
    pnl += Number(bet.settledPnl) || 0;
  }
  const n = bets.length;
  return {
    n,
    wins,
    losses: n - wins,
    invested: Math.round(invested),
    settledPnl: Math.round(pnl),
    dollarRoi: invested > 0 ? +((pnl / invested) * 100).toFixed(1) : null,
    wr: +((wins / n) * 100).toFixed(1),
  };
}

function pack(groups) {
  const out = {};
  for (const [key, group] of Object.entries(groups)) {
    const all = bookOf(group.all);
    const l30 = bookOf(group.l30);
    if (!all && !l30) continue;
    out[key] = {};
    if (l30) out[key].l30 = l30;
    if (all) out[key].all = all;
  }
  return out;
}

/**
 * Sport × market books. Pushes are out. Missing fill price is unpriced.
 * Size is invested / the sport usual passed in, never the cross-sport usual.
 */
export function marketBandBooks(bets, { usual = null, cutoff = null } = {}) {
  const price = Object.fromEntries(['0', '1', '2', '3', '4', '5', '6'].map((key) => [key, { l30: [], all: [] }]));
  const size = Object.fromEntries(SIZE_KEYS.map((key) => [key, { l30: [], all: [] }]));
  let unpriced = 0;
  let decidedN = 0;
  const sportUsual = Number(usual);
  for (const bet of bets || []) {
    if (!bet || isPushBet(bet)) continue;
    decidedN += 1;
    const inWindow = !cutoff || (bet.date && String(bet.date) >= cutoff);
    const band = priceBandOf(bet);
    if (band == null) unpriced += 1;
    else {
      const cell = price[String(band)];
      cell.all.push(bet);
      if (inWindow) cell.l30.push(bet);
    }
    const invested = Number(bet.invested);
    if (Number.isFinite(sportUsual) && sportUsual > 0 && invested > 0) {
      const key = sizeBandKeyFromRatio(invested / sportUsual);
      if (key && size[key]) {
        size[key].all.push(bet);
        if (inWindow) size[key].l30.push(bet);
      }
    }
  }
  return {
    priceBands: pack(price),
    sizeBands: pack(size),
    unpriced,
    decidedN,
  };
}

/** True when this graded ticket is inside the selected tile. */
export function actionTileMatch(leg, filter, ticket) {
  if (!filter || filter === 'sport') return true;
  const market = String(leg?.marketType || '').toUpperCase();
  const want = String(ticket?.marketType || '').toUpperCase();
  if (market !== want) return false;
  if (filter === 'market') return true;
  if (filter === 'odds') {
    return ticket?.ticketPriceBand != null
      && leg?.priceBand != null
      && Number(leg.priceBand) === Number(ticket.ticketPriceBand);
  }
  if (filter === 'size') {
    return !!ticket?.ticketSizeBand && leg?.sizeBand === ticket.ticketSizeBand;
  }
  return false;
}
