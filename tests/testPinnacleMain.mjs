/**
 * MAIN = closest to pick'em, not highest max / last alt.
 * Usage: node tests/testPinnacleMain.mjs
 */
import assert from 'node:assert/strict';
import {
  pickMainTotalFromBoard,
  pickMainTotalFromPinnapi,
  pickMainSpreadFromBoard,
} from '../src/lib/pinnacleMain.js';

const milBoard = [
  { line: 6.5, overOdds: -204, underOdds: 166, max: 1875 },
  { line: 7, overOdds: -163, underOdds: 138, max: 1875 },
  { line: 7.5, overOdds: -121, underOdds: 104, max: 1875 },
  { line: 8, overOdds: -109, underOdds: -103, max: 1875 },
  { line: 8.5, overOdds: 114, underOdds: -133, max: 1875 },
  { line: 9, overOdds: 147, underOdds: -175, max: 1875 },
  { line: 9.5, overOdds: 172, underOdds: -212, max: 1875 },
];

const main = pickMainTotalFromBoard(milBoard);
assert.equal(main.line, 8, 'MIL@LAD main is 8, not 9.5');
assert.equal(main.underOdds, -103);

const pinned = pickMainTotalFromPinnapi({
  '6.5': { points: 6.5, over: 1.49, under: 2.66, max: 1875 },
  '8': { points: 8, over: 1.917, under: 1.971, max: 1875 },
  '9.5': { points: 9.5, over: 2.72, under: 1.472, max: 1875 },
});
assert.equal(Number(pinned.points), 8);

const spread = pickMainSpreadFromBoard([
  { homeLine: 3, awayLine: -3, homeOdds: -325, awayOdds: 265 },
  { homeLine: 1, awayLine: -1, homeOdds: 100, awayOdds: -112 },
  { homeLine: 1.5, awayLine: -1.5, homeOdds: -117, awayOdds: 102 },
]);
assert.equal(spread.homeLine, 1);

console.log('testPinnacleMain: ok');
