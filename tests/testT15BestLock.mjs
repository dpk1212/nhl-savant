/**
 * T-15 lock takes the best available sportsbook number, not the flagged vault line.
 * Run: node tests/testT15BestLock.mjs
 */
import assert from 'node:assert/strict';
import {
  bestAvailableTicket,
  flaggedSnapshotFromPeakLock,
  formatLockAlertPickText,
  isT15BestLockLive,
  lockTicketTeamLabel,
  resolveLockDisplayTicket,
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

{
  // sea_col 2026-09-20: alert used peak 10.5 while UI sealed Under 11.
  const sd = {
    v8_lockBestAtT15: true,
    peak: { line: 10.5, odds: -115, team: 'Under 10.5' },
    lock: { line: 11, odds: -110, book: 'FanDuel', oddsSource: 't15_best_available', team: 'Under 11' },
  };
  const ticket = resolveLockDisplayTicket({
    sd, marketType: 'TOTAL', side: 'under', pickDate: '2026-09-20',
  });
  assert.equal(ticket.line, 11);
  assert.equal(ticket.source, 'sealed');
  assert.equal(
    formatLockAlertPickText({
      market: 'TOTAL',
      sideKey: 'under',
      line: ticket.line,
      away: 'Seattle Mariners',
      home: 'Colorado Rockies',
    }),
    'Seattle Mariners @ Colorado Rockies Under 11',
  );
}

{
  const tape = {
    allTotalBooks: {
      draftkings: { line: 10.5, over: -110, under: -110, name: 'DraftKings' },
      fanduel: { line: 11, over: -115, under: -105, name: 'FanDuel' },
    },
  };
  const ticket = resolveLockDisplayTicket({
    sd: { peak: { line: 10.5, odds: -115, team: 'Under 10.5' } },
    pinnGame: tape,
    marketType: 'TOTAL',
    side: 'under',
    pickDate: '2026-09-20',
  });
  assert.equal(ticket.line, 11, 'unsealed alert still uses shop-best, not flagged 10.5');
}

assert.equal(
  lockTicketTeamLabel({ marketType: 'total', side: 'under', line: 11, fallbackTeam: 'Under 10.5' }),
  'Under 11',
);

console.log('testT15BestLock: all passed');
