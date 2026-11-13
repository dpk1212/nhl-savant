/**
 * Locked card face: tennis pays the American next to the pick.
 * Usage: node tests/testCardPayout.mjs
 */
import assert from 'node:assert/strict';
import {
  isBooklessCardSport,
  toWinFromAmerican,
  lockedCardToWin,
} from '../src/lib/cardPayout.js';

assert.equal(isBooklessCardSport('ATP'), true);
assert.equal(isBooklessCardSport('NHL'), false);

assert.ok(Math.abs(toWinFromAmerican(-174, 2) - (2 * 100 / 174)) < 1e-9);
assert.equal(toWinFromAmerican(100, 2), 2);

const shang = lockedCardToWin({
  sport: 'ATP',
  units: 2,
  toWin: 2,
  paintedOdds: -174,
});
assert.ok(
  Math.abs(shang - (2 * 100 / 174)) < 1e-9,
  `Shang card to-win from −174, got ${shang}`,
);
assert.equal(
  lockedCardToWin({ sport: 'NHL', units: 2, toWin: 1.85, paintedOdds: 110 }),
  1.85,
  'book sports keep ticket to-win, not shop gold',
);

console.log('testCardPayout: ok');
