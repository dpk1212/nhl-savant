/**
 * Spread FLAGGED odds must match vault Poly entry when stamped lock.odds
 * is absurd (STL@CHC Cardinals +1.5 2026-08-14: +270 vs 55¢ → −124).
 */
import assert from 'node:assert/strict';
import {
  americanFromPolyPrice,
  preferVaultPolyTicketOdds,
  mapLockedPickToCardFixture,
} from '../src/components/sharpFlow/cards/mapPositionCard.js';

assert.equal(americanFromPolyPrice(0.554), -124);
assert.equal(americanFromPolyPrice(0.27), 270);

assert.equal(preferVaultPolyTicketOdds(270, -124), -124);
assert.equal(preferVaultPolyTicketOdds(-135, -124), -135, 'small book vs poly gap kept');
assert.equal(preferVaultPolyTicketOdds(null, -124), -124);
assert.equal(preferVaultPolyTicketOdds(270, null), 270);

const commence = Date.now() + (5 * 60 * 60 * 1000); // 5h out — pre T-15
const vaultPositions = [
  {
    wallet: '0xf7f0b0b1e9c0fe02ccad926916ee31aef74b912c',
    side: 'away',
    entryLine: 1.5,
    avgPrice: 0.554,
    invested: 1022,
    size: 1843,
    tier: 'ELITE',
  },
];

const fixture = mapLockedPickToCardFixture({
  key: '2026-08-14_MLB_stl_chc_spread:away',
  sport: 'MLB',
  gameKey: 'stl_chc',
  marketType: 'spread',
  side: 'away',
  pickSide: 'away',
  team: 'St. Louis Cardinals +1.5',
  line: 1.5,
  odds: 270, // bad stamp
  units: 1,
  lockPinnOdds: -143,
  pinnacleOdds: -143,
  gameTime: commence,
  lockedAt: commence - 8 * 3600_000,
  status: 'PENDING',
  away: 'St. Louis Cardinals',
  home: 'Chicago Cubs',
  vaultPositions,
}, {
  pinnacleHistory: {
    MLB: {
      stl_chc: {
        spreadCurrent: {
          homeLine: -1.5, awayLine: 1.5, homeOdds: 119, awayOdds: -135, isMain: true,
        },
        spreadHistory: [
          {
            t: Math.floor((commence - 8 * 3600_000) / 1000),
            awayLine: 1.5, awayOdds: -143, homeLine: -1.5, homeOdds: 119, isMain: true,
          },
        ],
        fairSpreadBook: 'draftkings',
      },
    },
  },
  spreadPositions: {
    MLB: {
      stl_chc: { positions: vaultPositions },
    },
  },
});

assert.equal(fixture.polyEntryOdds, -124, `poly entry expected -124, got ${fixture.polyEntryOdds}`);
assert.equal(fixture.lockOdds, -124, `FLAGGED/lockOdds must follow vault, got ${fixture.lockOdds}`);
assert.equal(fixture.gotOdds, -124);
assert.equal(fixture.odds, -124);
assert.ok(Math.abs(fixture.toWin - (1 * 100 / 124)) < 0.01,
  `toWin must use −124 juice, got ${fixture.toWin}`);

console.log('testSpreadFlaggedOdds: ok');
