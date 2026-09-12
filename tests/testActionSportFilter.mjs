/**
 * Action-tab sport rail / row filter.
 * Usage: node tests/testActionSportFilter.mjs
 */
import assert from 'node:assert/strict';
import {
  actionSportMatches,
  filterActionRows,
  sportsWithActionPositions,
} from '../src/lib/confirmedActionDesk.js';

assert.equal(actionSportMatches('CFB', 'All'), true);
assert.equal(actionSportMatches('CFB', 'ALL'), true);
assert.equal(actionSportMatches('CFB', 'CFB'), true);
assert.equal(actionSportMatches('cfb', 'CFB'), true);
assert.equal(actionSportMatches('MLB', 'CFB'), false);

const rows = [
  { sport: 'CFB', invested: 2000, skillKey: 'high', sizeRatio: 1, opposed: 'clear', pinMove: 'with' },
  { sport: 'MLB', invested: 2000, skillKey: 'high', sizeRatio: 1, opposed: 'clear', pinMove: 'with' },
];
assert.equal(filterActionRows(rows, { sport: 'All' }).length, 2);
assert.deepEqual(filterActionRows(rows, { sport: 'CFB' }).map((r) => r.sport), ['CFB']);
assert.deepEqual(filterActionRows(rows, { sport: 'mlb' }).map((r) => r.sport), ['MLB']);

const cfbOnly = sportsWithActionPositions(
  { CFB: { unlv_tex: { positions: [{ wallet: '0x1', invested: 900 }] } } },
  { MLB: {} },
  null,
);
assert.equal(cfbOnly.has('CFB'), true, 'CFB totals-only feed still counts for the Action rail');
assert.equal(cfbOnly.has('MLB'), false, 'empty MLB object is not on the rail');

const spreadOnly = sportsWithActionPositions(
  {},
  { SOC: { liv_ars: { positions: [{ wallet: '0x2' }] } } },
);
assert.equal(spreadOnly.has('SOC'), true, 'spread-only sport stays filterable on Action');

console.log('testActionSportFilter: ok');
