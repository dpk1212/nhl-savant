/**
 * The seal keeps the hero number. A live book on another number does not replace it.
 * Usage: node tests/testLockShopNumber.mjs
 */
import assert from 'node:assert/strict';
import { bestAvailableTicket, lockShopHasNumber } from '../src/lib/t15BestLock.js';

const receipt = { line: -2.5, odds: 113, book: 'Polymarket', oddsSource: 'poly_avgPrice' };

const boardOnPlus3 = {
  fairSpreadBook: 'Pinnacle',
  spreadCurrent: { awayLine: 3, awayOdds: -108, homeLine: -3, homeOdds: -108 },
  spreadLines: [
    { awayLine: 2.5, awayOdds: -115, homeLine: -2.5, homeOdds: -105 },
    { awayLine: 3, awayOdds: -108, homeLine: -3, homeOdds: -112 },
  ],
  allSpreadBooks: {
    fanduel: { name: 'FanDuel', awayLine: 3, away: -115, homeLine: -3, home: -105 },
    matchbook: { name: 'Matchbook', awayLine: 3, away: -104, homeLine: -3, home: -116 },
  },
};

const fallback = bestAvailableTicket({
  pinnGame: boardOnPlus3,
  marketType: 'spread',
  side: 'away',
  flagged: receipt,
});
assert.equal(fallback.source, 'flagged_fallback');
assert.equal(fallback.line, -2.5);
assert.equal(fallback.odds, 113);
assert.equal(fallback.book, 'Polymarket');
assert.equal(lockShopHasNumber(boardOnPlus3, 'spread', 'away', -2.5), false);

const bookOnTheNumber = {
  allSpreadBooks: {
    draftkings: { name: 'DraftKings', awayLine: -2.5, away: 118, homeLine: 2.5, home: -140 },
  },
};
const shop = bestAvailableTicket({
  pinnGame: bookOnTheNumber,
  marketType: 'spread',
  side: 'away',
  flagged: receipt,
});
assert.equal(shop.source, 't15_best_available');
assert.equal(shop.line, -2.5);
assert.equal(shop.odds, 118);
assert.equal(shop.book, 'DraftKings');
assert.equal(lockShopHasNumber(bookOnTheNumber, 'spread', 'away', -2.5), true);

console.log('lock shop number ok');
