import assert from 'node:assert/strict';
import test from 'node:test';
import { oddsCap } from './oddsCap.js';

test('favorites through +120 keep their stake', () => {
  assert.equal(oddsCap(4, -174), 4);
  assert.equal(oddsCap(4, 120), 4);
  assert.equal(oddsCap(4, -110), 4);
});

test('+200 ships at 1 unit and anything longer does not stake', () => {
  assert.equal(oddsCap(4, 200), 1);
  assert.equal(oddsCap(0.5, 200), 0.5);
  assert.equal(oddsCap(4, 201), 0);
  assert.equal(oddsCap(1, 250), 0);
  assert.equal(oddsCap(3, 150), 2.5);
  assert.equal(oddsCap(3, 151), 1.5);
});

test('a missing price does not invent a mute', () => {
  assert.equal(oddsCap(2, null), 2);
  assert.equal(oddsCap(2, undefined), 2);
});
