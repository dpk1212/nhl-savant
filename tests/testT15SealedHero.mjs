/**
 * After T-15, hero stays on the sealed shop ticket — not live tape.
 * Usage: npx tsx tests/testT15SealedHero.mjs
 */
import assert from 'node:assert/strict';
import { resolvePayOdds } from '../src/lib/payOdds.js';
import { mapLockedPickToCardFixture } from '../src/components/sharpFlow/cards/mapPositionCard.js';

{
  const r = resolvePayOdds({
    stampedOdds: -114,
    bookOnLine: -116,
    polyReceipt: -111,
    bookLabel: 'Pinnacle',
    oddsSource: 't15_best_available',
    fairBook: 'poly_avgPrice',
  });
  assert.equal(r.payOdds, -114);
  assert.equal(r.demotedPoly, false);
}

const chiCommence = Date.now() - (20 * 60 * 1000);
const chiFreeze = chiCommence - (15 * 60 * 1000);
const chiT = Math.floor(chiFreeze / 1000);
const chiFixture = mapLockedPickToCardFixture({
  key: '2026-09-20_NFL_min_chi_total:under',
  sport: 'NFL',
  gameKey: 'min_chi',
  marketType: 'total',
  side: 'under',
  team: 'Under 47',
  line: 47,
  odds: -114,
  flaggedLine: 47.5,
  flaggedOdds: -111,
  book: 'Pinnacle',
  oddsSource: 't15_best_available',
  fairBook: 't15_best_available',
  t15Sealed: true,
  units: 4,
  lockPinnOdds: -111,
  pinnacleOdds: -111,
  gameTime: chiCommence,
  status: 'PENDING',
  away: 'Vikings',
  home: 'Bears',
}, {
  pinnacleHistory: {
    NFL: {
      min_chi: {
        totalHistory: [
          { t: chiT - 3600, line: 47.5, overOdds: -110, underOdds: -110 },
          { t: chiT, line: 47, overOdds: -106, underOdds: -114 },
          { t: chiT + 300, line: 47, overOdds: -104, underOdds: -116 },
        ],
        totalCurrent: { line: 47, overOdds: -104, underOdds: -116 },
        fairTotalBook: 'Pinnacle',
      },
    },
  },
});
assert.equal(chiFixture.pickLabel, 'Under 47');
assert.equal(chiFixture.heroOdds, -114, 'hero stays on sealed T-15 juice');
assert.ok(String(chiFixture.flaggedAtLabel || '').includes('47.5'), `vault 47.5 under hero, got ${chiFixture.flaggedAtLabel}`);

console.log('testT15SealedHero: ok');
