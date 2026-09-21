/**
 * NFL Polymarket game slugs vs futures.
 * Usage: node tests/testNflPolySlug.mjs
 */
import assert from 'node:assert/strict';
import { isMainNFLGameSlug, makeNFLGameKey } from '../scripts/lib/nflTeams.js';

assert.equal(isMainNFLGameSlug('nfl-nyg-la-2026-09-22'), true);
assert.equal(isMainNFLGameSlug('nfl-car-ari-2026-08-07'), true);
assert.equal(isMainNFLGameSlug('pro-football-2026-champion-20260729185915366'), false);
assert.equal(isMainNFLGameSlug('pro-football-2026-mvp-winner'), false);
assert.equal(isMainNFLGameSlug('nfl-super-bowl-winner-2026'), false);
assert.equal(makeNFLGameKey('Giants', 'Rams'), 'nyg_lar');
assert.equal(makeNFLGameKey('New York Giants', 'Los Angeles Rams'), 'nyg_lar');

console.log('testNflPolySlug: ok');
