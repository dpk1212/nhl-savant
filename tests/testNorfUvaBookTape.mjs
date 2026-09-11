/**
 * Norfolk State @ Virginia 2026-09-11: no ML on Odds API, Poly-copied
 * pinnacleOdds must not invent EV against another handicap.
 * Usage: node tests/testNorfUvaBookTape.mjs
 */
import assert from 'node:assert/strict';
import { makeCFBGameKey } from '../scripts/lib/cfbTeams.js';
import { mapLockedPickToCardFixture } from '../src/components/sharpFlow/cards/mapPositionCard.js';

assert.equal(
  makeCFBGameKey('Norfolk State Spartans', 'Virginia Cavaliers'),
  'norf_uva',
);

const commence = Date.parse('2026-09-11T23:00:00Z');
const fixture = mapLockedPickToCardFixture({
  key: '2026-09-11_CFB_norf_uva_spread:home',
  sport: 'CFB',
  gameKey: 'norf_uva',
  marketType: 'spread',
  side: 'home',
  pickSide: 'home',
  team: 'Virginia',
  line: -44.5,
  odds: -134,
  book: 'Polymarket',
  oddsSource: 'poly_avgPrice',
  pinnacleOdds: -134,
  lockPinnOdds: -134,
  units: 0,
  gameTime: commence,
  status: 'PENDING',
  away: 'Norfolk State',
  home: 'Virginia',
  vaultPositions: [
    { side: 'home', entryLine: -44.5, avgPrice: 0.751, invested: 2083 },
    { side: 'home', entryLine: -43.5, avgPrice: 0.572, invested: 478 },
  ],
}, {
  pinnacleHistory: { CFB: {} },
});

assert.ok(
  fixture.evFlagged == null || Math.abs(fixture.evFlagged) < 1,
  `poly-copied −134 vs −302 must not paint −17.9% EV, got ${fixture.evFlagged}`,
);

console.log('testNorfUvaBookTape: ok');
