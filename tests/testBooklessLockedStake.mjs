import assert from 'node:assert/strict';
import { booklessLockedStakeOdds, isBooklessMlSport } from '../src/lib/ticketInstrument.js';

assert.equal(isBooklessMlSport('CS2'), true);
assert.equal(isBooklessMlSport('ATP'), true);
assert.equal(isBooklessMlSport('LOL'), true);
assert.equal(isBooklessMlSport('NBA'), false);

// BakS ML 2026-11-13: sealed at −101, live board −700. Stake stays −101.
assert.equal(booklessLockedStakeOdds(-101, -700), -101);
assert.equal(booklessLockedStakeOdds(-200, -200), -200);
assert.equal(booklessLockedStakeOdds(119, -150), 119);
assert.equal(booklessLockedStakeOdds(null, -700), -700);
assert.equal(booklessLockedStakeOdds(0, -174), -174);

console.log('bookless locked stake ok');
