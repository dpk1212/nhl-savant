import assert from 'node:assert/strict';
import test from 'node:test';
import { cbbV12StakeMuted } from './cbbStakeMute.js';

test('college basketball stakes are held for ten days starting opening Monday', () => {
  assert.equal(cbbV12StakeMuted('CBB', '2026-11-02'), true);
  assert.equal(cbbV12StakeMuted('CBB', '2026-11-11'), true);
  assert.equal(cbbV12StakeMuted('CBB', '2026-11-12'), false);
  assert.equal(cbbV12StakeMuted('CBB', '2026-11-01'), false);
});

test('the four-sport book is not in the hold', () => {
  assert.equal(cbbV12StakeMuted('NBA', '2026-11-02'), false);
  assert.equal(cbbV12StakeMuted('NHL', '2026-11-05'), false);
  assert.equal(cbbV12StakeMuted('NFL', '2026-11-08'), false);
  assert.equal(cbbV12StakeMuted('CFB', '2026-11-07'), false);
});
