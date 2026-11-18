/**
 * Odds and size tiles share one bucket with the rung.
 * Run: node tests/testActionBandTiles.mjs
 */
import { mlPriceBand } from '../src/lib/mlMiniRung.js';
import { sizeBandKeyFromRatio } from '../src/lib/sizeRatioBands.js';
import {
  actionTileMatch,
  marketBandBooks,
  priceBandOf,
  sizeWord,
} from '../src/lib/actionBandBooks.js';
import { _test } from '../src/lib/confirmedActionDesk.js';

const { contextRollupsFromProfile } = _test;

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

assert(sizeWord('full', 1.1) === 'full', '1.1× is full');
assert(sizeWord('lean', 0.6) === 'lean', 'lean stays lean');
assert(sizeWord('press', 1.6) === 'press', 'press stays press');

const usual = 609;
assert(sizeBandKeyFromRatio(675 / usual) === 'full', '$675 / $609 is full');
assert(mlPriceBand(108 / 208) === 2, '−108 is the pick’em band');
assert(priceBandOf({ odds: 144 }) === 1, '+144 is not the pick’em band');
assert(priceBandOf({ odds: 150 }) === 1, '+150 is not the pick’em band');
assert(priceBandOf({ avgPrice: 0.2, odds: -200 }) === 0, 'fill price wins over the displayed odds');

function bet({ price, invested, pnl, market = 'TOTAL', date = '2026-11-08' }) {
  return {
    date,
    market,
    avgPrice: price,
    invested,
    settledPnl: pnl,
    won: pnl > 0 ? 1 : 0,
  };
}

const band2 = [
  bet({ price: 0.5, invested: 675, pnl: 2000 }),
  bet({ price: 0.5, invested: 675, pnl: -400 }),
  bet({ price: 0.5, invested: 1500, pnl: 1500 }),
  bet({ price: 0.5, invested: 1500, pnl: 1500 }),
  bet({ price: 0.5, invested: 1500, pnl: 1500 }),
  bet({ price: 0.5, invested: 1500, pnl: -800 }),
  bet({ price: 0.5, invested: 155, pnl: 200 }),
  bet({ price: 0.5, invested: 155, pnl: 200 }),
  bet({ price: 0.5, invested: 155, pnl: 200 }),
  bet({ price: 0.5, invested: 155, pnl: -400 }),
];
const extras = [
  bet({ price: null, invested: 400, pnl: 50 }),
  bet({ price: 0.9, invested: 400, pnl: 0 }),
];
extras[0].avgPrice = null;
const books = marketBandBooks([...band2, ...extras], { usual, cutoff: '2026-10-19' });
const odds = books.priceBands['2'].l30;
assert(odds.n === 10 && odds.wins === 7 && odds.losses === 3, `odds record ${odds.wins}-${odds.losses} n=${odds.n}`);
assert(odds.settledPnl === 5500, `odds dollars ${odds.settledPnl}`);
assert(odds.dollarRoi === 69, `odds roi ${odds.dollarRoi}`);
assert(odds.wr === 70, `odds wins ${odds.wr}`);
assert(books.priceBands['2'].all.n === odds.n, 'all-time matches the last 30 days');
const sized = books.sizeBands.full.l30;
assert(sized.n === 2 && sized.wins === 1 && sized.losses === 1, `size record ${sized.wins}-${sized.losses}`);
const priceN = Object.values(books.priceBands).reduce((sum, cell) => sum + cell.all.n, 0);
const sizeN = Object.values(books.sizeBands).reduce((sum, cell) => sum + cell.all.n, 0);
assert(priceN + books.unpriced === books.decidedN, 'price bands plus unpriced equal the market');
assert(sizeN === books.decidedN, 'size bands equal the market');
assert(books.decidedN === 11, 'the push stays out');

const legs = [
  ...band2.map((row) => ({ ...row, marketType: 'TOTAL', priceBand: 2, sizeBand: sizeBandKeyFromRatio(row.invested / usual) })),
  { marketType: 'ML', priceBand: 1, sizeBand: 'lean', odds: 144 },
  { marketType: 'ML', priceBand: 1, sizeBand: 'lean', odds: 150 },
  ...Array.from({ length: 12 }, () => ({ marketType: 'TOTAL', priceBand: 4, sizeBand: 'press' })),
];
const ticket = { marketType: 'TOTAL', ticketPriceBand: 2, ticketSizeBand: 'full' };
const oddsHits = legs.filter((leg) => actionTileMatch(leg, 'odds', ticket));
assert(oddsHits.length === 10, `10 of 24 match, got ${oddsHits.length} of ${legs.length}`);
assert(legs.length === 24, `list ${legs.length}`);
assert(oddsHits.every((leg) => leg.priceBand === 2 && leg.marketType === 'TOTAL'), 'only stamped totals in the band');
assert(actionTileMatch(legs[10], 'odds', ticket) === false, 'the +144 moneyline stays out');
const sizeHits = legs.filter((leg) => actionTileMatch(leg, 'size', ticket));
assert(sizeHits.length === 2, `size highlight ${sizeHits.length}`);

const prof = {
  bySport: {
    CBB: {
      positions: { n: 24, wins: 15, losses: 9, wr: 62.5, dollarRoi: 45, settledPnl: 6600 },
      recentActionWindow: { days: 30, n: 24, wins: 15, losses: 9, wr: 63, dollarRoi: 45, settledPnl: 6600 },
      byMarket: {
        TOTAL: {
          positions: { n: 22, wins: 14, losses: 8, dollarRoi: 46, settledPnl: 6100 },
          recentActionWindow: { days: 30, n: 22, wins: 14, losses: 8, wr: 64, dollarRoi: 46, settledPnl: 6100 },
          priceBands: books.priceBands,
          sizeBands: books.sizeBands,
        },
      },
    },
  },
};
const roll = contextRollupsFromProfile(prof, 'CBB', 'TOTAL', { priceBand: 2, sizeBand: 'full' });
assert(roll.sportAction.record === '15-9', roll.sportAction.record);
assert(roll.marketAction.record === '14-8', roll.marketAction.record);
assert(roll.oddsAction.record === '7-3' && roll.oddsAction.settledPnl === 5500, 'odds tile');
assert(roll.oddsAction.roi === 69 && roll.oddsAction.wr === 70, 'odds rates');
assert(roll.oddsLabel === '−110 to +110', roll.oddsLabel);
assert(roll.sizeAction.n === 2 && roll.sizeAction.record === '1-1', 'size tile');
assert(roll.sizeLabel === '1× full', roll.sizeLabel);
assert(roll.sizeAction.n < 5, 'size tile is a small sample');

console.log('testActionBandTiles: ok');
