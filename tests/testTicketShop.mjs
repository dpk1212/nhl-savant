import assert from 'node:assert/strict';
import { quoteTicketShop } from '../src/lib/shopTicketLine.js';

const history = {
  MLB: {
    tor_bal: {
      current: { away: -130, home: 118 },
      fairBook: 'pinnacle',
      bestAway: -125,
      bestAwayBook: 'FanDuel',
      bestHome: 120,
      bestHomeBook: 'DraftKings',
      allBooks: {
        fanduel: { name: 'FanDuel', away: -125, home: 112 },
        draftkings: { name: 'DraftKings', away: -128, home: 120 },
      },
      totalCurrent: { line: 8.5, overOdds: -102, underOdds: -120 },
      fairTotalBook: 'pinnacle',
      bestUnder: { line: 8.5, odds: -105, book: 'DraftKings' },
      bestOver: { line: 8.5, odds: 100, book: 'FanDuel' },
      allTotalBooks: {
        draftkings: { name: 'DraftKings', line: 8.5, over: -118, under: -105 },
        fanduel: { name: 'FanDuel', line: 8.5, over: 100, under: -112 },
      },
      spreadCurrent: { awayLine: 1.5, homeLine: -1.5, awayOdds: -115, homeOdds: -105 },
      bestAwaySpread: { line: 1.5, odds: -105, book: 'BetMGM' },
      allSpreadBooks: {
        betmgm: { name: 'BetMGM', awayLine: 1.5, homeLine: -1.5, away: -105, home: -115 },
      },
    },
  },
};

const under = quoteTicketShop(history, {
  sport: 'MLB', gameKey: 'tor_bal', marketType: 'TOTAL', side: 'under', entryLine: 8.5,
});
assert.equal(under.book, 'DraftKings');
assert.equal(under.odds, -105);
assert.ok(under.evPct > 0, `expected +EV, got ${under.evPct}`);
assert.equal(under.consensusOdds, -120);
assert.ok(under.books.some((b) => b.name === 'Pinnacle' && b.odds === -120));

const away = quoteTicketShop(history, {
  sport: 'MLB', gameKey: 'tor_bal', marketType: 'ML', side: 'away',
});
assert.equal(away.book, 'FanDuel');
assert.equal(away.odds, -125);
assert.ok(away.evPct > 0);

const spread = quoteTicketShop(history, {
  sport: 'MLB', gameKey: 'tor_bal', marketType: 'SPREAD', side: 'away', entryLine: 1.5,
});
assert.equal(spread.book, 'BetMGM');
assert.equal(spread.odds, -105);
assert.ok(spread.evPct > 0);

const offLine = quoteTicketShop(history, {
  sport: 'MLB', gameKey: 'tor_bal', marketType: 'SPREAD', side: 'away', entryLine: -3.5,
});
assert.equal(offLine, null);

const missing = quoteTicketShop(history, {
  sport: 'MLB', gameKey: 'no_game', marketType: 'ML', side: 'home',
});
assert.equal(missing, null);

console.log('ticket shop ok', { underEv: under.evPct, spreadEv: spread.evPct });
