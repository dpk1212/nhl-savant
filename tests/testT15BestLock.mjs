/**
 * T-15 lock takes the best available sportsbook number, not the flagged vault line.
 * Run: node tests/testT15BestLock.mjs
 */
import assert from 'node:assert/strict';
import {
  bestAvailableTicket,
  snapshotBookRail,
  flaggedSnapshotFromPeakLock,
  formatLockAlertPickText,
  isT15BestLockLive,
  lockAlertSealSidePatch,
  lockTicketTeamLabel,
  planLockAlertSeal,
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
assert.equal(best.line, 38.5);
assert.equal(best.odds, -110);
assert.equal(best.book, 'pinnacle');
assert.equal(best.oddsSource, 't15_best_available');

const rail = snapshotBookRail({
  pinnGame: siuTape,
  marketType: 'SPREAD',
  side: 'away',
  ticketLine: 41.5,
});
assert.deepEqual(rail.map((b) => b.name), ['FanDuel']);
assert.equal(rail[0].odds, 103);
assert.equal(rail[0].line, 41.5);
assert.equal(rail[0].best, true);

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

const mcneese = bestAvailableTicket({
  pinnGame: {
    allBooks: {
      fanduel: { away: 198, home: -250, name: 'FanDuel' },
      draftkings: { away: 175, home: -222, name: 'DraftKings' },
      betmgm: { away: 190, home: -235, name: 'BetMGM' },
      polymarket: { away: 146, home: -146, name: 'Polymarket' },
    },
  },
  marketType: 'ML',
  side: 'home',
  flagged: { odds: -146, book: 'Polymarket', oddsSource: 'poly_avgPrice' },
});
assert.equal(mcneese.odds, -222);
assert.equal(mcneese.book, 'DraftKings');

const southern = bestAvailableTicket({
  pinnGame: {
    allSpreadBooks: {
      pinnacle: { away: -104, home: -104, awayLine: -17, homeLine: 17, name: 'Pinnacle' },
      matchbook: { away: -120, home: 100, awayLine: -17, homeLine: 17, name: 'Matchbook' },
      novig: { away: -100000, home: -2339, awayLine: -38.5, homeLine: 38.5, name: 'Novig' },
    },
    spreadCurrent: { awayLine: -17, awayOdds: -104, homeLine: 17, homeOdds: -104 },
    fairSpreadBook: 'pinnacle',
  },
  marketType: 'SPREAD',
  side: 'home',
  flagged: { line: 18.5, odds: -109, book: 'Polymarket' },
});
assert.equal(southern.line, 17);
assert.equal(southern.odds, 100);
assert.equal(southern.book, 'Matchbook');

const wisconsin = bestAvailableTicket({
  pinnGame: {
    allTotalBooks: {
      pinnacle: { line: 44, over: -105, under: -111, name: 'Pinnacle' },
      matchbook: { line: 44, over: -110, under: -104, name: 'Matchbook' },
      novig: { line: 61.5, over: -100000, under: -1329, name: 'Novig' },
    },
    totalCurrent: { line: 44, overOdds: -105, underOdds: -111 },
    fairTotalBook: 'pinnacle',
  },
  marketType: 'TOTAL',
  side: 'under',
  flagged: { line: 44.5, odds: -110, book: 'Polymarket' },
});
assert.equal(wisconsin.line, 44);
assert.equal(wisconsin.odds, -104);
assert.equal(wisconsin.book, 'Matchbook');

const insaneOnly = bestAvailableTicket({
  pinnGame: {
    allSpreadBooks: {
      novig: { away: -100000, home: -2339, awayLine: -38.5, homeLine: 38.5, name: 'Novig' },
    },
    spreadCurrent: { awayLine: -17, awayOdds: -104, homeLine: 17, homeOdds: -100000 },
  },
  marketType: 'SPREAD',
  side: 'home',
  flagged: { line: 18.5, odds: -109, book: 'Polymarket' },
});
assert.equal(insaneOnly.line, 18.5);
assert.equal(insaneOnly.odds, -109);
assert.equal(insaneOnly.source, 'flagged_fallback');

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

{
  const ticket = resolveLockDisplayTicket({
    sd: {
      lockAlertSentAt: 1,
      peak: { line: 18.5, odds: -109, team: 'Georgia Southern' },
      lock: { line: 18.5, odds: -109, book: 'Polymarket', team: 'Georgia Southern' },
    },
    pinnGame: {
      allSpreadBooks: {
        novig: { away: -100000, home: -2339, awayLine: -38.5, homeLine: 38.5, name: 'Novig' },
      },
      spreadCurrent: { awayLine: -17, awayOdds: -104, homeLine: 17, homeOdds: 100 },
      fairSpreadBook: 'pinnacle',
    },
    marketType: 'SPREAD',
    side: 'home',
    pickDate: '2026-09-26',
  });
  assert.equal(ticket.line, 18.5);
  assert.equal(ticket.odds, -109);
  assert.equal(ticket.source, 'sealed');
}

assert.equal(
  lockTicketTeamLabel({ marketType: 'total', side: 'under', line: 11, fallbackTeam: 'Under 10.5' }),
  'Under 11',
);

{
  // Sox @ Astros 2026-09-29: push must shop Over 8 before it sends, and keep 7.5 flagged.
  const sd = {
    peak: { line: 7.5, odds: -128, book: 'Polymarket', oddsSource: 'poly_avgPrice', team: 'Over 7.5' },
    lock: { line: 7.5, odds: -128, book: 'Polymarket', oddsSource: 'poly_avgPrice', team: 'Over 7.5' },
  };
  const board = {
    totalCurrent: { line: 8, overOdds: -115, underOdds: -105 },
    fairTotalBook: 'pinnacle',
    allTotalBooks: {
      pinnacle: { line: 8, over: -115, under: -105, name: 'pinnacle' },
      draftkings: { line: 8, over: -110, under: -110, name: 'DraftKings' },
    },
  };
  const plan = planLockAlertSeal({
    sd, pinnGame: board, marketType: 'TOTAL', side: 'over', pickDate: '2026-09-29',
  });
  assert.equal(plan.write, true);
  assert.equal(plan.line, 8);
  assert.equal(plan.reason, 'shop');
  const patch = lockAlertSealSidePatch(plan, sd, 1);
  assert.equal(patch.lock.line, 8);
  assert.equal(patch.lock.book, 'DraftKings');
  assert.equal(patch.lock.oddsSource, 't15_best_available');
  assert.equal(patch.flagged.line, 7.5);
  assert.equal(patch.v8_lockBestAtT15, true);
  assert.equal(
    formatLockAlertPickText({
      market: 'TOTAL', sideKey: 'over', line: plan.line,
      away: 'Chicago White Sox', home: 'Houston Astros',
    }),
    'Chicago White Sox @ Houston Astros Over 8',
  );

  const again = planLockAlertSeal({
    sd: { ...sd, v8_lockBestAtT15: true, lock: patch.lock },
    pinnGame: { totalCurrent: { line: 8.5, overOdds: -120, underOdds: 100 }, fairTotalBook: 'pinnacle' },
    marketType: 'TOTAL', side: 'over', pickDate: '2026-09-29',
  });
  assert.equal(again.write, false);
  assert.equal(again.line, 8);
  assert.equal(again.reason, 'already_sealed');

  const late = planLockAlertSeal({
    sd, pinnGame: board, marketType: 'TOTAL', side: 'over', pickDate: '2026-09-29', gameStarted: true,
  });
  assert.equal(late.write, false);
  assert.equal(late.line, 7.5);
  assert.equal(late.reason, 'game_started');

  const missing = planLockAlertSeal({
    sd, pinnGame: null, marketType: 'TOTAL', side: 'over', pickDate: '2026-09-29',
  });
  assert.equal(missing.write, false);
  assert.equal(missing.line, 7.5);
  assert.equal(missing.reason, 'no_book');
}

console.log('testT15BestLock: all passed');
