/**
 * T-15 ticket freeze — stamped line/odds must not chase live books.
 */
import assert from 'node:assert/strict';
import {
  buildLockedMarketOdds,
  mapLockedPickToCardFixture,
  parseCommenceMs,
} from '../src/components/sharpFlow/cards/mapPositionCard.js';

const commence = Date.now() - (30 * 60 * 1000); // started 30m ago → past T-15
const freezeAt = commence - (15 * 60 * 1000);
const tPre = Math.floor((freezeAt - 60_000) / 1000);
const tPost = Math.floor((freezeAt + 60_000) / 1000);

const pinnacleHistory = {
  MLB: {
    oak_bos: {
      totalHistory: [
        { t: tPre - 3600, line: 9, overOdds: -113, underOdds: -107 },
        { t: tPre, line: 9, overOdds: -102, underOdds: -118 },
        { t: tPost, line: 8, overOdds: -101, underOdds: -119 },
      ],
      totalCurrent: { line: 8, overOdds: -101, underOdds: -119 },
      bestOver: { line: 8, odds: -101, book: 'DraftKings' },
      bestUnder: { line: 7.5, odds: 105, book: 'Fanxuel' },
      fairTotalBook: 'Pinnacle',
    },
  },
};

assert.equal(parseCommenceMs({ _seconds: 1_700_000_000 }), 1_700_000_000_000);
assert.equal(parseCommenceMs(1_700_000_000_000), 1_700_000_000_000);

const market = buildLockedMarketOdds(
  {
    sport: 'MLB',
    gameKey: 'oak_bos',
    marketType: 'total',
    side: 'over',
    team: 'Over 9',
    line: 9,
    odds: -102,
  },
  pinnacleHistory,
  { freezeAtMs: freezeAt },
);

assert.equal(market.ourLabel, 'Over 9');
assert.ok(market.pinSeries.every((o) => o === -113 || o === -102),
  `journey must stop at freeze, got ${JSON.stringify(market.pinSeries)}`);
assert.equal(market.pinSeries[market.pinSeries.length - 1], -102);
assert.equal(market.lineMoved, false);
assert.equal(market.liveLabel, null);
assert.equal(market.bestOdds, null, 'sealed ticket must not chase live best');
assert.notEqual(market.oppLabel, 'Under 7.5');

const fixture = mapLockedPickToCardFixture({
  key: '2026-08-08_MLB_oak_bos_total:over',
  sport: 'MLB',
  gameKey: 'oak_bos',
  marketType: 'total',
  side: 'over',
  team: 'Over 9',
  line: 9,
  odds: -102,
  units: 3,
  lockPinnOdds: -102,
  pinnacleOdds: -102,
  closingOdds: -101,
  gameTime: commence,
  lockedAt: commence - 8 * 3600_000,
  status: 'PENDING',
  away: 'Athletics',
  home: 'Boston Red Sox',
}, { pinnacleHistory });

assert.equal(fixture.pickLabel, 'Over 9');
assert.equal(fixture.lockOdds, -102);
assert.equal(fixture.nowOdds, -102, 'frozen nowOdds must not chase closingOdds');
assert.ok(!fixture.journey.includes(-101), 'journey must not include post-freeze odds');
assert.notEqual(fixture.oppMarketLabel, 'Under 7.5');

console.log('testT15TicketFreeze: ok');
