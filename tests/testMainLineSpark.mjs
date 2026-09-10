/**
 * Plan A: ticket juice stays on the spark; main-line hops are a separate path.
 * Usage: node tests/testMainLineSpark.mjs
 */
import assert from 'node:assert/strict';
import {
  buildMainLinePath,
  mainLineHops,
} from '../src/lib/pinnacleMain.js';
import { buildLockedMarketOdds } from '../src/components/sharpFlow/cards/mapPositionCard.js';
import { fmtMainLineMove } from '../src/lib/pinnacleMain.js';

const now = 1_800_000_000;

// Mixed alts at the same t must not pick'em 47.5 or 50 after isMain=48 exists.
const tnfHist = [
  { t: now - 6 * 3600, line: 47.5, overOdds: -119, underOdds: 100, isMain: false, max: 5000 },
  { t: now - 6 * 3600, line: 48, overOdds: -109, underOdds: -107, isMain: true, max: 5000 },
  { t: now - 6 * 3600, line: 50, overOdds: 120, underOdds: -144, isMain: false, max: 5000 },
  { t: now - 3600, line: 47.5, overOdds: -120, underOdds: 101, max: 10000 },
  { t: now - 3600, line: 50, overOdds: 118, underOdds: -141, max: 10000 },
  { t: now - 60, line: 47.5, overOdds: -108, underOdds: -106, isMain: false, max: 50000 },
  { t: now - 60, line: 48, overOdds: 101, underOdds: -114, isMain: true, max: 50000 },
  { t: now - 60, line: 50, overOdds: 133, underOdds: -153, isMain: false, max: 50000 },
];

const path = buildMainLinePath(tnfHist, { marketType: 'total', sideNorm: 'over' });
assert.equal(path.length, 2, `main path ${path.length}`);
assert.equal(path[0].line, 48);
assert.equal(path[1].line, 48);
assert.equal(path[0].odds, -109);
assert.equal(path[1].odds, 101);
assert.deepEqual(mainLineHops(path), [], 'flat 48 is not a hop');

// Real walk: 47.5 → 48.5. Partial alt-only cycle in the middle must not flash 50.
const walkHist = [
  { t: now - 6 * 3600, line: 47.5, overOdds: -110, underOdds: -110, isMain: true, max: 2000 },
  { t: now - 3 * 3600, line: 50, overOdds: 140, underOdds: -160, max: 2000 },
  { t: now - 60, line: 48.5, overOdds: -108, underOdds: -112, isMain: true, max: 8000 },
];
const walk = buildMainLinePath(walkHist, { marketType: 'total', sideNorm: 'over' });
assert.deepEqual(walk.map((p) => p.line), [47.5, 48.5]);
const hops = mainLineHops(walk);
assert.equal(hops.length, 1);
assert.equal(hops[0].fromLine, 47.5);
assert.equal(hops[0].line, 48.5);

const market = buildLockedMarketOdds(
  {
    sport: 'NFL',
    gameKey: 'sf_lar',
    marketType: 'total',
    side: 'over',
    team: 'Over 50',
    line: 50,
    odds: 141,
  },
  {
    NFL: {
      sf_lar: {
        totalOpener: { t: now - 8 * 3600, line: 48.5, overOdds: -105, underOdds: -111, max: 2000 },
        totalCurrent: { line: 48, overOdds: 101, underOdds: -114, max: 50000, isMain: true },
        totalHistory: tnfHist,
        bestOver: { line: 48.5, odds: -102, book: 'DraftKings' },
        bestUnder: { line: 47.5, odds: -102, book: 'FanDuel' },
      },
    },
  },
);

assert.equal(market.openMainLine, 48.5, `open main ${market.openMainLine}`);
assert.equal(market.nowMainLine, 48, `now main ${market.nowMainLine}`);
assert.ok(Array.isArray(market.linePath) && market.linePath[0].line === 48.5);
assert.equal(market.bestOdds, null, 'BEST must not be DK -102 on 48.5 for an Over 50 ticket');
assert.equal(market.liveBestOdds, -102, 'off-line best stays on liveBest, not the strip');
assert.ok(market.pinPath.every((p) => p.odds === 120 || p.odds === 118 || p.odds === 133),
  `ticket tape must stay on 50, got ${JSON.stringify(market.pinPath.map((p) => p.odds))}`);

assert.equal(fmtMainLineMove(48.5, 48), '48.5→48');
assert.equal(fmtMainLineMove(48, 48), '48');
assert.equal(fmtMainLineMove(-3, -3.5, { spread: true }), '-3→-3.5');
assert.equal(fmtMainLineMove(1.5, 1.5, { spread: true }), '+1.5');

console.log('testMainLineSpark.mjs: ok');
