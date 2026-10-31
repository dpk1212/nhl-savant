/**
 * Outside the 2-point window the hero walks to the live number.
 * Inside the window, and when a book is on the ticket number, it stays.
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

const walked = bestAvailableTicket({
  pinnGame: boardOnPlus3,
  marketType: 'spread',
  side: 'away',
  flagged: receipt,
});
assert.equal(walked.source, 't15_best_available');
assert.equal(walked.line, 3);
assert.equal(walked.odds, -104);
assert.equal(walked.book, 'Matchbook');
assert.equal(lockShopHasNumber(boardOnPlus3, 'spread', 'away', -2.5), false);

const bethune = bestAvailableTicket({
  pinnGame: {
    fairSpreadBook: 'Pinnacle',
    spreadCurrent: { awayLine: 1.5, awayOdds: -115, homeLine: -1.5, homeOdds: -105 },
    allSpreadBooks: {
      fanduel: { name: 'FanDuel', awayLine: 1.5, away: -110, homeLine: -1.5, home: -110 },
      draftkings: { name: 'DraftKings', awayLine: 1.5, away: -108, homeLine: -1.5, home: -112 },
      betmgm: { name: 'BetMGM', awayLine: 1.5, away: -110, homeLine: -1.5, home: -110 },
    },
  },
  marketType: 'spread',
  side: 'away',
  flagged: { line: 7.5, odds: -133, book: 'Polymarket', oddsSource: 'poly_avgPrice' },
});
assert.equal(bethune.line, 1.5);
assert.equal(bethune.odds, -108);
assert.equal(bethune.book, 'DraftKings');

const insideWindow = bestAvailableTicket({
  pinnGame: {
    allSpreadBooks: {
      pinnacle: { away: -104, home: -104, awayLine: -17, homeLine: 17, name: 'Pinnacle' },
      matchbook: { away: -120, home: 100, awayLine: -17, homeLine: 17, name: 'Matchbook' },
    },
    spreadCurrent: { awayLine: -17, awayOdds: -104, homeLine: 17, homeOdds: -104 },
  },
  marketType: 'spread',
  side: 'home',
  flagged: { line: 18.5, odds: -109, book: 'Polymarket' },
});
assert.equal(insideWindow.source, 'flagged_fallback');
assert.equal(insideWindow.line, 18.5);
assert.equal(insideWindow.odds, -109);

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
