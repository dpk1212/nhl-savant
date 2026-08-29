/**
 * Hero pay odds must match the hero line's sportsbook quote — not Poly soft.
 * Usage: node tests/testPayOddsCoherence.mjs
 */
import assert from 'node:assert/strict';
import { resolvePayOdds } from '../src/lib/payOdds.js';
import { mapLockedPickToCardFixture } from '../src/components/sharpFlow/cards/mapPositionCard.js';

// Unit: poly stamp demotes to same-line book.
{
  const r = resolvePayOdds({
    stampedOdds: 110,
    bookOnLine: -108,
    polyReceipt: 110,
    bookLabel: 'Polymarket',
    oddsSource: 'poly_avgPrice',
  });
  assert.equal(r.payOdds, -108, 'pay odds = book on line');
  assert.equal(r.polyReceipt, 110, 'poly kept as receipt');
  assert.equal(r.demotedPoly, true);
}

// Unit: book stamp stays.
{
  const r = resolvePayOdds({
    stampedOdds: -108,
    bookOnLine: -108,
    oddsSource: 'pinnacle',
    bookLabel: 'Pinnacle',
  });
  assert.equal(r.payOdds, -108);
  assert.equal(r.demotedPoly, false);
}

// chi_ten 2026-08-29: Bears +2.5 must not hero as +110 when tape is −108.
const t = Math.floor(Date.parse('2026-08-29T21:00:00Z') / 1000);
const commence = Date.parse('2026-08-29T22:00:00Z'); // past T-15 relative to "now" in fixture via gameTime
const fixture = mapLockedPickToCardFixture({
  key: '2026-08-29_NFL_chi_ten_spread:away',
  sport: 'NFL',
  gameKey: 'chi_ten',
  marketType: 'spread',
  side: 'away',
  team: 'Bears',
  line: 2.5,
  odds: 110, // poly soft
  book: 'Polymarket',
  oddsSource: 'poly_avgPrice',
  pinnacleOdds: -108,
  lockPinnOdds: -108,
  units: 2,
  gameTime: commence,
  status: 'PENDING',
  away: 'Bears',
  home: 'Titans',
  vaultPositions: [
    {
      side: 'away', outcome: 'CHI', entryLine: 2.5, avgPrice: 0.476, invested: 1960,
      title: 'Spread: TEN (-2.5)',
    },
    {
      side: 'away', outcome: 'CHI', entryLine: 2.5, avgPrice: 0.479, invested: 2042,
      title: 'Spread: TEN (-2.5)',
    },
  ],
}, {
  pinnacleHistory: {
    NFL: {
      chi_ten: {
        commence: '2026-08-29T22:00:00Z',
        spreadCurrent: { awayLine: 1, homeLine: -1, awayOdds: -112, homeOdds: -104, isMain: true },
        spreadHistory: [
          { t: t - 86000, awayLine: 2.5, awayOdds: -105, homeLine: -2.5, homeOdds: -111, isMain: true },
          { t: t - 20000, awayLine: 2.5, awayOdds: 100, homeLine: -2.5, homeOdds: -117, isMain: true },
          { t: t - 5000, awayLine: 2.5, awayOdds: -108, homeLine: -2.5, homeOdds: -108, isMain: true },
          { t: t - 1000, awayLine: 1, awayOdds: -112, homeLine: -1, homeOdds: -104, isMain: true },
        ],
      },
    },
  },
});

assert.equal(fixture.pickLabel, 'Bears +2.5');
assert.equal(fixture.heroOdds, -108, 'hero juice = same-line book, not poly +110');
assert.ok(Math.abs(fixture.toWin - (2 * 100 / 108)) < 0.01, `toWin from book, got ${fixture.toWin}`);
assert.ok(
  !Number.isFinite(fixture.polyEntryOdds) || Math.round(fixture.polyEntryOdds) === 110
  || Math.abs(fixture.polyEntryOdds - 110) <= 5,
  `poly receipt retained, got ${fixture.polyEntryOdds}`,
);
assert.equal(fixture.gotOdds, -108, 'TICKET strip uses book pay odds');

console.log('testPayOddsCoherence: ok');
