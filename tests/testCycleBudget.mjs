import assert from 'node:assert/strict';
import {
  DISCOVER_INTERVAL_MS,
  shouldKeepPreviousBoard,
  supplementIsFresh,
} from '../scripts/lib/cycleBudget.js';

const now = Date.parse('2026-11-03T17:30:00.000Z');
assert.equal(supplementIsFresh('2026-11-03T17:00:00.000Z', now), true);
assert.equal(supplementIsFresh('2026-11-03T16:29:00.000Z', now), false);
assert.equal(supplementIsFresh(undefined, now), false);
assert.equal(supplementIsFresh(new Date(now - DISCOVER_INTERVAL_MS).toISOString(), now), false);

assert.equal(shouldKeepPreviousBoard(20, 1486), false);
assert.equal(shouldKeepPreviousBoard(149, 1486), true);
assert.equal(shouldKeepPreviousBoard(0, 1486), false);
assert.equal(shouldKeepPreviousBoard(10, 0), false);

console.log('cycleBudget ok');
