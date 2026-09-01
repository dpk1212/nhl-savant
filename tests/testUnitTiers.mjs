/**
 * Unit-tier scoreboard buckets (Bankroll Lens tiles).
 * Run: node tests/testUnitTiers.mjs
 */
import assert from 'node:assert/strict';
import {
  AGS_V12_UNIT_TIERS,
  AGS_V12_DISPLAY_TIERS,
  agsV12UnitTierFromUnits,
  aggregateAgsuUnitTiers,
} from '../src/lib/ags.js';

assert.equal(AGS_V12_UNIT_TIERS.length, 5, 'exactly 5 unit tiles');
assert.deepEqual(
  AGS_V12_UNIT_TIERS.map((t) => t.key),
  ['MAX', 'TOP', 'MID', 'STRONG', 'LEAN'],
);
assert.equal(AGS_V12_DISPLAY_TIERS.length, 5, 'path tiles unchanged');
assert.ok(AGS_V12_DISPLAY_TIERS.some((t) => t.key === 'SHARP'), 'path SHARP still exists for cards');

assert.equal(agsV12UnitTierFromUnits(0), null);
assert.equal(agsV12UnitTierFromUnits(-1), null);
assert.equal(agsV12UnitTierFromUnits(null), null);
assert.equal(agsV12UnitTierFromUnits('x'), null);

const edges = [
  [0.25, 'LEAN'], [0.5, 'LEAN'], [0.75, 'LEAN'], [1, 'LEAN'], [1.01, 'LEAN'],
  [1.13, 'MID'], [1.25, 'MID'], [1.35, 'MID'], [1.5, 'MID'], [2, 'MID'], [2.5, 'MID'], [2.51, 'MID'],
  [3, 'STRONG'], [3.01, 'STRONG'],
  [3.75, 'TOP'], [4, 'TOP'], [4.05, 'TOP'], [5, 'TOP'], [5.06, 'TOP'], [5.4, 'TOP'], [5.41, 'TOP'],
  [5.4, 'TOP'], [6, 'MAX'], [6.5, 'MAX'],
];
for (const [u, want] of edges) {
  assert.equal(agsV12UnitTierFromUnits(u), want, `${u}u → ${want}`);
}

{
  const agg = aggregateAgsuUnitTiers([
    { date: '2026-06-02', units: 6, outcome: 'WIN', profit: 4.8 },
    { date: '2026-06-01', units: 6, outcome: 'LOSS' },
    { date: '2026-06-03', units: 1, outcome: 'PUSH' },
    { date: '2026-06-04', units: 1.5, outcome: null },
    { date: '2026-06-05', units: 3, outcome: 'WIN', profit: 2.7, tracked: true },
    { date: '2026-06-06', units: 0, outcome: 'WIN', profit: 0 },
    { date: '2026-06-07', units: 4, outcome: 'WIN', profit: 3.2 },
  ]);
  assert.equal(agg.MAX.wins, 1);
  assert.equal(agg.MAX.losses, 1);
  assert.equal(agg.MAX.units, 12);
  assert.equal(agg.MAX.profit, 4.8 - 6);
  assert.equal(agg.LEAN.pushes, 1);
  assert.equal(agg.LEAN.units, 1, 'PUSH stake counts');
  assert.equal(agg.MID.pending, 1);
  assert.equal(agg.STRONG.tracked, 1);
  assert.equal(agg.STRONG.wins, 0, 'tracked not in W-L');
  assert.equal(agg.TOP.wins, 1);
  assert.equal(agg.TOP.units, 4);
}

{
  const picks = [
    { units: 1, outcome: 'LOSS' },
    { units: 2.5, outcome: 'WIN', profit: 2 },
    { units: 3, outcome: 'WIN', profit: 2.4 },
    { units: 5.4, outcome: 'WIN', profit: 4 },
    { units: 6, outcome: 'WIN', profit: 4.8 },
  ];
  const agg = aggregateAgsuUnitTiers(picks);
  assert.equal(agg.LEAN.losses, 1);
  assert.equal(agg.MID.wins, 1);
  assert.equal(agg.STRONG.wins, 1);
  assert.equal(agg.TOP.wins, 1);
  assert.equal(agg.MAX.wins, 1);
}

console.log('testUnitTiers: ok');
