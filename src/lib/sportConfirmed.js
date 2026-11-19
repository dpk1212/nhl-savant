/**
 * Confirmed is the sport book, then the tier reads the bets that are
 * actually bets. Same game, side, stake, and dollars on a later date
 * is one bet. An empty game key stays, because there is nothing to
 * match it to. A win is dollars above zero. Win rate and dollar ROI
 * are rounded to a tenth, the same way the profile stores them.
 * Confirmed is 6 or more graded bets, win rate at least 55, and dollar
 * ROI above 3.
 */

import { isDoor2ConfirmedPositions } from './whitelistTier.js';

function marketOf(row) {
  return String(row?.marketType || row?.market || '').toUpperCase();
}

function dollarsOf(row) {
  if (row?.settledPnl != null && row.settledPnl !== '' && Number.isFinite(Number(row.settledPnl))) {
    return Number(row.settledPnl);
  }
  const result = String(row?.result || '').toUpperCase();
  const won = row?.won === true || row?.won === 1 || result === 'WIN';
  const lost = row?.won === false || row?.won === 0 || result === 'LOSS';
  if (!won && !lost) return null;
  const invested = Number(row?.invested ?? row?.size);
  const stake = invested > 0 ? invested : 100;
  const price = Number(row?.avgPrice ?? row?.price);
  if (won && price > 0 && price < 1) return (stake * (1 - price)) / price;
  return won ? stake : -stake;
}

function stakeOf(row) {
  const invested = Number(row?.invested ?? row?.size);
  return invested > 0 ? invested : 100;
}

/** Collapse a later copy. Keeps the earliest date. */
export function dedupePositionCopies(rows) {
  const out = [];
  const at = new Map();
  for (const row of rows || []) {
    const gameKey = String(row?.gameKey || '').toLowerCase();
    if (!gameKey) {
      out.push(row);
      continue;
    }
    const key = [
      String(row?.sport || '').toUpperCase(),
      marketOf(row),
      gameKey,
      String(row?.side || '').toLowerCase(),
      Math.round(Number(row?.invested) || 0),
      Math.round(Number(row?.settledPnl) || 0),
    ].join('|');
    const i = at.get(key);
    if (i == null) {
      at.set(key, out.length);
      out.push(row);
      continue;
    }
    if (String(row?.date || '') < String(out[i]?.date || '')) out[i] = row;
  }
  return out;
}

/** The sport book's n, win rate, and dollar ROI, on collapsed bets. */
export function sportBookPositions(rows) {
  let n = 0;
  let wins = 0;
  let invested = 0;
  let pnl = 0;
  for (const row of dedupePositionCopies(rows)) {
    const pnlRow = dollarsOf(row);
    if (pnlRow == null) continue;
    n += 1;
    if (pnlRow > 0) wins += 1;
    invested += stakeOf(row);
    pnl += pnlRow;
  }
  return {
    n,
    wins,
    wr: n ? +((wins / n) * 100).toFixed(1) : 0,
    invested,
    settledPnl: pnl,
    dollarRoi: invested > 0 ? +((pnl / invested) * 100).toFixed(1) : null,
  };
}

export function sportBookConfirmed(rows) {
  return isDoor2ConfirmedPositions(sportBookPositions(rows));
}
