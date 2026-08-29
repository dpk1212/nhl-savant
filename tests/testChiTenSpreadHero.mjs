/**
 * CHI@TEN 2026-08-29 locked spread card: Bears +2.5 hero must use PIN −108,
 * not Poly/+110, when same-line book spread juice is minus-money.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { mapLockedPickToCardFixture } from '../src/components/sharpFlow/cards/mapPositionCard.js';

const spreadPos = JSON.parse(fs.readFileSync('./public/sharp_spread_positions.json', 'utf8'));
const pinn = JSON.parse(fs.readFileSync('./public/pinnacle_history.json', 'utf8'));
const awayPos = spreadPos.NFL.chi_ten.positions.filter((p) => p.side === 'away');
const commence = new Date('2026-08-29T22:00:00Z').getTime();

const fixture = mapLockedPickToCardFixture({
  key: '2026-08-29_NFL_chi_ten_spread:away',
  sport: 'NFL',
  gameKey: 'chi_ten',
  marketType: 'spread',
  side: 'away',
  pickSide: 'away',
  team: 'Bears +2.5',
  line: 2.5,
  odds: 110,
  units: 1,
  lockPinnOdds: -108,
  pinnacleOdds: -108,
  gameTime: commence,
  lockedAt: commence - 8 * 3600_000,
  status: 'PENDING',
  away: 'Bears',
  home: 'Titans',
  vaultPositions: awayPos,
}, {
  pinnacleHistory: pinn,
  spreadPositions: spreadPos,
});

assert.equal(fixture.pickLabel, 'Bears +2.5');
assert.equal(fixture.ticketLine, 2.5);
assert.equal(fixture.heroOdds, -108, `hero must be book spread juice, got ${fixture.heroOdds}`);
assert.equal(fixture.lockOdds, -108);
assert.equal(fixture.gotOdds, -108);
assert.equal(fixture.polyEntryOdds, 106, 'PM cell keeps Poly receipt');
assert.equal(fixture.currentFairOdds, -108);
assert.equal(fixture.sharpEntryOdds, -105);
assert.equal(fixture.instrumentVariant, 'ALT');
assert.ok(
  fixture.evFlagged == null || fixture.evFlagged <= 0,
  `fake +EV from +110 vs −108 fair should be gone, got ${fixture.evFlagged}`,
);

console.log('testChiTenSpreadHero: ok');
