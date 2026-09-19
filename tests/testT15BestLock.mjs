/**
 * T-15 lock takes the best available sportsbook number, not the flagged vault line.
 * Run: node tests/testT15BestLock.mjs
 */
import assert from 'node:assert/strict';
import {
  bestAvailableTicket,
  flaggedSnapshotFromPeakLock,
  isT15BestLockLive,
} from '../src/lib/t15BestLock.js';

assert.equal(isT15BestLockLive('2026-09-19'), true);
assert.equal(isT15BestLockLive('2026-09-18'), false);

const siuTape = {
  allSpreadBooks: {
    draftkings: { away: 103, home: -125, awayLine: 37.5, homeLine: -37.5, name: 'DraftKings' },
    fanduel: { away: 103, home: -125, awayLine: 41.5, homeLine: -41.5, name: 'FanDuel' },
    lowvig: { away: 110, home: -130, awayLine: 45.5, homeLine: -45.5, name: 'LowVig' },
  },
  spreadCurrent: { awayLine: 38.5, awayOdds: -110, homeLine: -38.5, homeOdds: -110 },
  fairSpreadBook: 'pinnacle',
};

const best = bestAvailableTicket({
  pinnGame: siuTape,
  marketType: 'SPREAD',
  side: 'away',
  flagged: { line: 37.5, odds: 156, book: 'Polymarket', oddsSource: 'poly_avgPrice' },
});
assert.equal(best.line, 41.5);
assert.equal(best.odds, 103);
assert.equal(best.book, 'FanDuel');
assert.equal(best.oddsSource, 't15_best_available');

const noTape = bestAvailableTicket({
  pinnGame: null,
  marketType: 'SPREAD',
  side: 'away',
  flagged: { line: 37.5, odds: 156, book: 'Polymarket' },
});
assert.equal(noTape.line, 37.5);
assert.equal(noTape.odds, 156);
assert.equal(noTape.source, 'flagged_fallback');

const tot = bestAvailableTicket({
  pinnGame: {
    allTotalBooks: {
      draftkings: { line: 52.5, over: -110, under: -110, name: 'DraftKings' },
      fanduel: { line: 51.5, over: -105, under: -115, name: 'FanDuel' },
    },
  },
  marketType: 'TOTAL',
  side: 'over',
});
assert.equal(tot.line, 51.5);
assert.equal(tot.odds, -105);

const under = bestAvailableTicket({
  pinnGame: {
    allTotalBooks: {
      draftkings: { line: 52.5, over: -110, under: -110, name: 'DraftKings' },
      fanduel: { line: 51.5, over: -105, under: -115, name: 'FanDuel' },
    },
  },
  marketType: 'TOTAL',
  side: 'under',
});
assert.equal(under.line, 52.5);

const ml = bestAvailableTicket({
  pinnGame: {
    allBooks: {
      draftkings: { away: -150, home: 130, name: 'DraftKings' },
      fanduel: { away: -145, home: 125, name: 'FanDuel' },
    },
    current: { away: -148, home: 128 },
    fairBook: 'pinnacle',
  },
  marketType: 'ML',
  side: 'home',
});
assert.equal(ml.odds, 130);
assert.equal(ml.book, 'DraftKings');

const flagged = flaggedSnapshotFromPeakLock(
  { line: 37.5, odds: 156, book: 'Polymarket', oddsSource: 'poly_avgPrice' },
  { line: 37.5, odds: 103 },
);
assert.equal(flagged.line, 37.5);
assert.equal(flagged.odds, 156);

console.log('testT15BestLock: all passed');
