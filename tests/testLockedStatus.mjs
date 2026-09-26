/**
 * Pending is pregame. In progress is past commence and still ungraded.
 * Usage: node tests/testLockedStatus.mjs
 */
import assert from 'node:assert/strict';
import { lockedStatusBucket } from '../src/lib/lockedStatus.js';

const now = Date.parse('2026-09-26T21:36:00Z');
const later = now + 60 * 60 * 1000;
const earlier = now - 60 * 60 * 1000;

assert.equal(lockedStatusBucket({ commenceMs: later }, now), 'pending');
assert.equal(lockedStatusBucket({ commenceMs: earlier }, now), 'inprogress');
assert.equal(lockedStatusBucket({ commenceMs: now }, now), 'inprogress');
assert.equal(lockedStatusBucket({}, now), 'pending');
assert.equal(lockedStatusBucket({ commenceMs: earlier, outcome: 'WIN' }, now), 'won');
assert.equal(lockedStatusBucket({ commenceMs: later, outcome: 'LOSS' }, now), 'lost');
assert.equal(lockedStatusBucket({ commenceMs: earlier, outcome: 'PUSH' }, now), 'resolved');
assert.equal(lockedStatusBucket({ commenceMs: earlier, status: 'COMPLETED' }, now), 'resolved');

console.log('testLockedStatus: all passed');
