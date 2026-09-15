/**
 * DWCS ingest — Poly titles omit the letters "UFC", and US books often have
 * no h2h row. Prefix strip + poly-only window must still produce fight keys.
 * Usage: node tests/testDwcsUfcIngest.mjs
 */
import assert from 'node:assert/strict';
import {
  extractUFCFightersFromTitle,
  isMainUFCFightSlug,
  isUFCBrandedTitle,
  isUFCMarketTitle,
  isUfcPolyOnlyWindow,
  makeUFCGameKey,
  matchUFCPositionTitle,
  stripUFCEventPrefix,
} from '../scripts/lib/ufcFighters.js';

const DWCS_CARD = [
  {
    slug: 'ufc-zevhun-mayper-2026-09-15',
    title: "Dana White's Contender Series: Zevan Hunt vs. Mayton Perea (Welterweight, Main Card)",
    startTime: '2026-09-15T23:00:00Z',
    a: 'Zevan Hunt',
    b: 'Mayton Perea',
    key: 'zevanhunt_maytonperea',
  },
  {
    slug: 'ufc-oscrav-igo5-2026-09-15',
    title: "Dana White's Contender Series: Oscar Ravello vs. Igor Cavalcanti (Middleweight, Main Card)",
    startTime: '2026-09-15T23:00:00Z',
    a: 'Oscar Ravello',
    b: 'Igor Cavalcanti',
    key: 'oscarravello_igorcavalcanti',
  },
  {
    slug: 'ufc-ednsan-akbabd-2026-09-15',
    title: "Dana White's Contender Series: Ednilson Santos vs. Akbar Abdullaev (Lightweight, Main Card)",
    startTime: '2026-09-15T23:00:00Z',
    a: 'Ednilson Santos',
    b: 'Akbar Abdullaev',
    key: 'ednilsonsantos_akbarabdullaev',
  },
  {
    slug: 'ufc-huggui-luiher-2026-09-15',
    title: "Dana White's Contender Series: Hugo Guillon vs. Luis Hernandez (Middleweight, Main Card)",
    startTime: '2026-09-15T23:00:00Z',
    a: 'Hugo Guillon',
    b: 'Luis Hernandez',
    key: 'hugoguillon_luishernandez',
  },
  {
    slug: 'ufc-ant38-tyswil-2026-09-15',
    title: "Dana White's Contender Series: Antonio Monteiro vs. Tyshawn Williams (Featherweight, Main Card)",
    startTime: '2026-09-15T23:00:00Z',
    a: 'Antonio Monteiro',
    b: 'Tyshawn Williams',
    key: 'antoniomonteiro_tyshawnwilliams',
  },
];

assert.equal(
  stripUFCEventPrefix("Dana White's Contender Series: Zevan Hunt vs. Mayton Perea"),
  'Zevan Hunt vs. Mayton Perea',
);
assert.equal(
  stripUFCEventPrefix('Dana White’s Contender Series: Zevan Hunt vs. Mayton Perea'),
  'Zevan Hunt vs. Mayton Perea',
);
assert.equal(
  stripUFCEventPrefix('DWCS: Zevan Hunt vs. Mayton Perea'),
  'Zevan Hunt vs. Mayton Perea',
);
assert.equal(
  stripUFCEventPrefix('Contender Series: Zevan Hunt vs. Mayton Perea'),
  'Zevan Hunt vs. Mayton Perea',
);

assert.equal(
  isUFCBrandedTitle("Dana White's Contender Series: Zevan Hunt vs. Mayton Perea"),
  true,
);
assert.equal(
  isUFCMarketTitle("Dana White's Contender Series: Zevan Hunt vs. Mayton Perea"),
  true,
);
assert.equal(isUFCBrandedTitle('Zevan Hunt vs. Mayton Perea'), false);

const nowTue = Date.parse('2026-09-15T17:50:00Z');
assert.equal(isUfcPolyOnlyWindow('2026-09-15T23:00:00Z', nowTue), true);
assert.equal(isUfcPolyOnlyWindow('2026-09-19T21:00:00Z', nowTue), false); // UFC 331 ~99h out
assert.equal(isUfcPolyOnlyWindow('2026-09-12T18:00:00Z', nowTue), false); // Noche ~71h back
assert.equal(isUfcPolyOnlyWindow(null, nowTue), false);

for (const fight of DWCS_CARD) {
  assert.equal(isMainUFCFightSlug(fight.slug), true, fight.slug);
  const pair = extractUFCFightersFromTitle(fight.title);
  assert.ok(pair, `extract ${fight.title}`);
  assert.equal(pair[0], fight.a, `fighter A ${fight.title}`);
  assert.equal(pair[1], fight.b, `fighter B ${fight.title}`);
  assert.notEqual(pair[0].toLowerCase().includes('contender'), true, 'prefix glued to A');
  const k1 = makeUFCGameKey(pair[0], pair[1]);
  const k2 = makeUFCGameKey(pair[1], pair[0]);
  assert.equal(k1, fight.key, `${fight.title} key`);
  assert.ok(k1 && !k1.includes('danawhite'), `brand in key ${k1}`);

  // Empty Odds API schedule: poly-only window still admits tonight's card.
  const validUFC = new Set();
  const keyFromBooks = validUFC.has(k1) ? k1 : validUFC.has(k2) ? k2 : null;
  assert.equal(keyFromBooks, null);
  const polyOnly = !keyFromBooks
    && isMainUFCFightSlug(fight.slug)
    && (k1 || k2)
    && isUfcPolyOnlyWindow(fight.startTime, nowTue);
  assert.equal(polyOnly, true, `poly-only ${fight.slug}`);
}

const todaysGames = {};
for (const fight of DWCS_CARD) {
  todaysGames[`UFC:${fight.key}`] = { away: fight.a, home: fight.b };
}
const pos = matchUFCPositionTitle(DWCS_CARD[0].title, todaysGames);
assert.ok(pos, 'matchUFCPositionTitle DWCS ML title');
assert.equal(pos.key, DWCS_CARD[0].key);
assert.equal(pos.sport, 'UFC');

console.log('testDwcsUfcIngest: ok');
