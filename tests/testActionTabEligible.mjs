/**
 * Action tab eligibility — same gates as ConfirmedActionDesk (pills off).
 * Usage: node tests/testActionTabEligible.mjs
 */
import assert from 'node:assert/strict';
import { isActionTabEligible, MIN_ACTION_INVESTED } from '../src/lib/confirmedActionDesk.js';

assert.equal(MIN_ACTION_INVESTED, 500);

assert.equal(isActionTabEligible({
  whitelistTier: 'CONFIRMED',
  invested: 500,
  sizeRatio: 0.4,
  sportRec: { whitelistTier: 'CONFIRMED' },
}), true, 'CONFIRMED $500+ paints (non size-skill)');

assert.equal(isActionTabEligible({
  whitelistTier: 'FLAT',
  invested: 5000,
  sizeRatio: 2,
  sportRec: { whitelistTier: 'FLAT' },
}), false, 'FLAT never paints');

assert.equal(isActionTabEligible({
  whitelistTier: 'CONFIRMED',
  invested: 499,
  sizeRatio: 2,
  sportRec: { whitelistTier: 'CONFIRMED' },
}), false, 'sub-$500 hidden');

assert.equal(isActionTabEligible({
  whitelistTier: 'CONFIRMED',
  invested: 800,
  sizeRatio: 0.6,
  sportRec: { whitelistTier: 'CONFIRMED', whitelistRescue: 'size-skill' },
}), false, 'size-skill CONFIRMED needs ≥1.0×');

assert.equal(isActionTabEligible({
  whitelistTier: 'CONFIRMED',
  invested: 800,
  sizeRatio: 1.0,
  sportRec: { whitelistTier: 'CONFIRMED', whitelistRescue: 'size-skill' },
}), true, 'size-skill CONFIRMED at 1.0× paints');

console.log('testActionTabEligible: ok');
