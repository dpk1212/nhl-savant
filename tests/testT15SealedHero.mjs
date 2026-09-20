/**
 * After T-15, hero stays on the sealed shop ticket — not live tape.
 * Usage: npx tsx tests/testT15SealedHero.mjs
 */
import assert from 'node:assert/strict';
import { resolvePayOdds } from '../src/lib/payOdds.js';
import { mapLockedPickToCardFixture } from '../src/components/sharpFlow/cards/mapPositionCard.js';

{
  const r = resolvePayOdds({
    stampedOdds: -114,
    bookOnLine: -116,
    polyReceipt: -111,
    bookLabel: 'Pinnacle',
    oddsSource: 't15_best_available',
    fairBook: 'poly_avgPrice',
  });
  assert.equal(r.payOdds, -114);
  assert.equal(r.demotedPoly, false);
}

const chiCommence = Date.now() - (20 * 60 * 1000);
const chiFreeze = chiCommence - (15 * 60 * 1000);
const chiT = Math.floor(chiFreeze / 1000);
const chiFixture = mapLockedPickToCardFixture({
  key: '2026-09-20_NFL_min_chi_total:under',
  sport: 'NFL',
  gameKey: 'min_chi',
  marketType: 'total',
  side: 'under',
  team: 'Under 47',
  line: 47,
  odds: -114,
  flaggedLine: 47.5,
  flaggedOdds: -111,
  book: 'Pinnacle',
  oddsSource: 't15_best_available',
  fairBook: 't15_best_available',
  t15Sealed: true,
  units: 4,
  lockPinnOdds: -111,
  pinnacleOdds: -111,
  gameTime: chiCommence,
  status: 'PENDING',
  away: 'Vikings',
  home: 'Bears',
}, {
  pinnacleHistory: {
    NFL: {
      min_chi: {
        totalHistory: [
          { t: chiT - 3600, line: 47.5, overOdds: -110, underOdds: -110 },
          { t: chiT, line: 47, overOdds: -106, underOdds: -114 },
          { t: chiT + 300, line: 47, overOdds: -104, underOdds: -116 },
        ],
        totalCurrent: { line: 47, overOdds: -104, underOdds: -116 },
        fairTotalBook: 'Pinnacle',
      },
    },
  },
});
assert.equal(chiFixture.pickLabel, 'Under 47');
assert.equal(chiFixture.heroOdds, -114, 'hero stays on sealed T-15 juice');
assert.ok(String(chiFixture.flaggedAtLabel || '').includes('47.5'), `vault 47.5 under hero, got ${chiFixture.flaggedAtLabel}`);

{
  // phi_nym 2026-09-20: in-play main moved to +4.5; Matchbook leftover
  // +1.5 @ +430 was painting as locked gold. Hero must stay on T-15 FD.
  const commence = Date.now() - (80 * 60 * 1000);
  const freeze = commence - (15 * 60 * 1000);
  const f = mapLockedPickToCardFixture({
    key: '2026-09-20_MLB_phi_nym_spread:home',
    sport: 'MLB',
    gameKey: 'phi_nym',
    marketType: 'spread',
    side: 'home',
    pickSide: 'home',
    team: 'Mets',
    line: 1.5,
    odds: -122,
    flaggedOdds: -117,
    book: 'FanDuel',
    oddsSource: 't15_best_available',
    fairBook: 't15_best_available',
    t15Sealed: true,
    units: 3,
    commenceMs: commence,
    gameTime: commence,
    status: 'PENDING',
    away: 'Philadelphia Phillies',
    home: 'New York Mets',
  }, {
    pinnacleHistory: {
      MLB: {
        phi_nym: {
          commence: new Date(commence).toISOString(),
          spreadCurrent: {
            homeLine: 4.5, awayLine: -4.5, homeOdds: -125, awayOdds: 103, isMain: true,
          },
          fairSpreadBook: 'Pinnacle',
          bestHomeSpread: { line: 4.5, odds: -135, book: 'DraftKings' },
          allSpreadBooks: {
            matchbook: {
              away: -909, home: 430, awayLine: -1.5, homeLine: 1.5, name: 'Matchbook',
            },
            fanduel: {
              away: 108, home: -144, awayLine: -4.5, homeLine: 4.5, name: 'FanDuel',
            },
            pinnacle: {
              away: 103, home: -125, awayLine: -4.5, homeLine: 4.5, name: 'Pinnacle',
            },
          },
          spreadHistory: [
            {
              t: Math.floor(freeze / 1000),
              homeLine: 1.5, awayLine: -1.5, homeOdds: -121, awayOdds: 108, isMain: true,
            },
          ],
        },
      },
    },
  });
  assert.equal(f.pickLabel, 'Mets +1.5');
  assert.equal(f.heroOdds, -122, `pay ticket stays −122, got ${f.heroOdds}`);
  assert.equal(f.bestOdds, -122, `gold chip stays −122, got ${f.bestOdds}`);
  assert.ok(f.bestOdds !== 430, 'Matchbook leftover +430 must not be gold');
  assert.notEqual(String(f.bestBook || '').toLowerCase(), 'matchbook');
  assert.ok(
    !((f.books || []).some((b) => Number(b.odds) === 430)),
    'live leftover +430 must not sit on the frozen rail',
  );
}

console.log('testT15SealedHero: ok');
