/**
 * UFC Poly title-order keys must join Odds API / Pinnacle away_home tape
 * and remap sides so Choi on a Pitbull-vs-Choi card reads Pin −256, not +222.
 *
 * Run: node tests/testUfcTapeFlip.mjs
 */
import assert from 'node:assert/strict';
import {
  flipUFCGameKey,
  lookupPinnGame,
  remapUFCPinnSides,
  canonicalUFCKey,
  isUFCFlipAlias,
} from '../scripts/lib/ufcFighters.js';
import { steamForGame } from '../src/lib/steamMove.js';

const tapeKey = 'doohochoi_patriciopitbull';
const polyKey = 'patriciopitbull_doohochoi';

const tapeRow = {
  awayTeam: 'Dooho Choi',
  homeTeam: 'Patricio Pitbull',
  current: { away: -256, home: 222 },
  opener: { t: 1, away: -269, home: 223, fairBook: 'pinnacle' },
  history: [
    { t: 1, away: -269, home: 223, fairBook: 'pinnacle' },
    { t: 2, away: -256, home: 222, fairBook: 'pinnacle' },
  ],
  movement: { away: 13, home: -1, direction: 'home' },
  ev: { away: -0.7, home: 0.8 },
  bestAway: -265,
  bestHome: 230,
  bestAwayBook: 'draftkings',
  bestHomeBook: 'fanduel',
  allBooks: {
    pinnacle: { away: -256, home: 222, name: 'Pinnacle' },
    draftkings: { away: -265, home: 230, name: 'DraftKings' },
  },
  fairBook: 'pinnacle',
  commence: '2026-09-19T21:00:00Z',
};

const hist = { UFC: { [tapeKey]: tapeRow } };

assert.equal(flipUFCGameKey(polyKey), tapeKey);

const remapped = remapUFCPinnSides(tapeRow);
assert.equal(remapped.current.away, 222);
assert.equal(remapped.current.home, -256);
assert.equal(remapped.awayTeam, 'Patricio Pitbull');
assert.equal(remapped.homeTeam, 'Dooho Choi');
assert.equal(remapped.movement.direction, 'away');
assert.equal(remapped.allBooks.pinnacle.home, -256);
assert.equal(tapeRow.current.away, -256, 'remap must not mutate the tape row');

const hit = lookupPinnGame(hist, 'UFC', polyKey);
assert.ok(hit, 'Poly-order key must find the flipped tape row');
assert.equal(hit.current.home, -256);
assert.equal(hit.current.away, 222);
assert.equal(lookupPinnGame(hist, 'UFC', tapeKey).current.away, -256);
assert.equal(lookupPinnGame(hist, 'NHL', polyKey), null);
assert.equal(lookupPinnGame(hist, 'UFC', 'nobody_here'), null);

const steamHome = steamForGame(hist, 'UFC', polyKey, {
  marketType: 'ml',
  sideNorm: 'home',
  nowSec: 2,
});
assert.ok(steamHome?.lastHour, 'steam must attach to the remapped Poly key');
assert.ok(steamHome.tip, 'observed tape emits a steam tip even when juice is fading');

const miss = steamForGame({ UFC: {} }, 'UFC', polyKey, { marketType: 'ml', sideNorm: 'home' });
assert.equal(miss.show, false);
assert.equal(miss.tip, null);

const live = new Set(['charlesjourdain_marlonvera']);
assert.equal(
  canonicalUFCKey('marlonvera_charlesjourdain', { preferred: live }),
  'charlesjourdain_marlonvera',
);
assert.equal(isUFCFlipAlias('marlonvera_charlesjourdain', { preferred: live }), true);
assert.equal(isUFCFlipAlias('charlesjourdain_marlonvera', { preferred: live }), false);
assert.equal(isUFCFlipAlias('charlesjourdain_marlonvera', { also: live }), false);
{
  const both = new Set(['charlesjourdain_marlonvera', 'marlonvera_charlesjourdain']);
  const poly = new Set(['charlesjourdain_marlonvera']);
  assert.equal(
    canonicalUFCKey('marlonvera_charlesjourdain', { preferred: both, also: poly }),
    'charlesjourdain_marlonvera',
  );
}

console.log('testUfcTapeFlip: all passed');
