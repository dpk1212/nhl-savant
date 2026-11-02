import assert from 'node:assert/strict';
import test from 'node:test';
import {
  cbbPolyGameKey,
  findCbbTeamInMap,
  isMainCBBGameSlug,
} from './cbbGameKey.js';

const map = new Map([
  ['winthrop', 'Winthrop'],
  ['winthropeagles', 'Winthrop'],
  ['queens', 'Queens University of Charlotte'],
  ['queensncroyals', 'Queens University of Charlotte'],
  ['mercer', 'Mercer'],
  ['mercerbears', 'Mercer'],
  ['miami', 'Miami (FL)'],
  ['miamihurricanes', 'Miami (FL)'],
  ['iuindy', 'IUPUI'],
  ['iuindyjaguars', 'IUPUI'],
]);

test('a main college basketball slug is a game', () => {
  assert.equal(isMainCBBGameSlug('cbb-winth-queen-2026-11-02'), true);
  assert.equal(isMainCBBGameSlug('cbb-rein-merc-2026-11-02'), true);
  assert.equal(isMainCBBGameSlug('which-teams-will-be-a-1-seed-in-the-2027-ncaa-tournament'), false);
  assert.equal(isMainCBBGameSlug('cbb-2027-mens-college-basketball-champion'), false);
});

test('a known school keeps its canonical name', () => {
  assert.equal(findCbbTeamInMap(map, 'Winthrop Eagles'), 'Winthrop');
  assert.equal(
    cbbPolyGameKey(map, 'Winthrop Eagles', 'Queens (NC) Royals'),
    'winthrop_queensuniversityofcharlotte',
  );
});

test('an unknown school keeps the Polymarket title in the key', () => {
  assert.equal(
    cbbPolyGameKey(map, 'Reinhardt Eagles', 'Mercer Bears'),
    'reinhardteagles_mercer',
  );
  assert.equal(
    cbbPolyGameKey(map, 'Miami-Middletown ThunderHawks', 'IU Indy Jaguars'),
    'miamimiddletownthunderhawks_iupui',
  );
  assert.equal(findCbbTeamInMap(map, 'Miami Hurricanes'), 'Miami (FL)');
});
