/**
 * Stepped dog odds cap.
 * Usage: node tests/testOddsCap.mjs
 */
import assert from 'node:assert/strict';
import { oddsCap } from '../src/lib/oddsCap.js';

assert.equal(oddsCap(4, -110), 4);
assert.equal(oddsCap(4, 120), 4);
assert.equal(oddsCap(4, 121), 2.5);
assert.equal(oddsCap(4, 150), 2.5);
assert.equal(oddsCap(4, 151), 1.5);
assert.equal(oddsCap(4, 199), 1.5);
assert.equal(oddsCap(4, 200), 1);
assert.equal(oddsCap(4, 250), 1);
assert.equal(oddsCap(0.5, 250), 0.5);
assert.equal(oddsCap(4, null), 4);
assert.equal(oddsCap(4, Number.NaN), 4);

console.log('testOddsCap: ok');
