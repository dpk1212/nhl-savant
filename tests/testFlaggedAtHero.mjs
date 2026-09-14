/**
 * Graded ML: book stays the hero; Poly receipt is `flagged at -125 (56%)`.
 * Usage: node tests/testFlaggedAtHero.mjs
 */
import assert from 'node:assert/strict';
import { fmtFlaggedAtLabel, fmtAmericanWithPm } from '../src/lib/oddsEv.js';
import { mapLockedPickToCardFixture } from '../src/components/sharpFlow/cards/mapPositionCard.js';

assert.equal(fmtFlaggedAtLabel(-125), 'flagged at -125 (56%)');
assert.equal(fmtFlaggedAtLabel(-116, 'Over 6.5'), 'flagged at Over 6.5 · -116 (54%)');
assert.equal(fmtFlaggedAtLabel(null), null);
assert.equal(fmtAmericanWithPm(-126), '-126 (56%)');

const commence = Date.parse('2026-09-13T18:25:00Z');

// Post T-15: SharpFlow already demoted pick.odds to book. Poly lives on polyReceipt.
const vikings = mapLockedPickToCardFixture({
  key: '2026-09-13_NFL_gb_min:home',
  sport: 'NFL',
  gameKey: 'gb_min',
  marketType: 'ml',
  side: 'home',
  pickSide: 'home',
  team: 'Vikings',
  odds: -126,
  units: 2,
  book: 'Polymarket',
  oddsSource: 'poly_avgPrice',
  lockPinnOdds: -126,
  pinnacleOdds: -126,
  polyReceipt: -125,
  gameTime: commence,
  lockedAt: commence - 8 * 3600_000,
  status: 'COMPLETED',
  outcome: 'WIN',
  profit: 1.6,
  away: 'Packers',
  home: 'Vikings',
});

assert.equal(vikings.heroOdds, -126, `hero is book, got ${vikings.heroOdds}`);
assert.equal(vikings.mainNowLabel, 'flagged at -125 (56%)', vikings.mainNowLabel);

const cubs = mapLockedPickToCardFixture({
  key: '2026-09-13_MLB_pit_chc_total:over',
  sport: 'MLB',
  gameKey: 'pit_chc',
  marketType: 'total',
  side: 'over',
  pickSide: 'over',
  team: 'Over 6.5',
  line: 6.5,
  odds: -141,
  units: 4,
  book: 'Polymarket',
  oddsSource: 'poly_avgPrice',
  lockPinnOdds: -141,
  pinnacleOdds: -141,
  polyReceipt: -116,
  gameTime: commence,
  lockedAt: commence - 8 * 3600_000,
  status: 'COMPLETED',
  outcome: 'WIN',
  profit: 3.45,
  away: 'Pittsburgh Pirates',
  home: 'Chicago Cubs',
});

assert.equal(cubs.heroOdds, -141);
assert.equal(cubs.mainNowLabel, 'flagged at -116 (54%)', cubs.mainNowLabel);

const sameJuice = mapLockedPickToCardFixture({
  key: 'same-juice:home',
  sport: 'NFL',
  gameKey: 'x_y',
  marketType: 'ml',
  side: 'home',
  pickSide: 'home',
  team: 'Home',
  odds: -110,
  units: 1,
  lockPinnOdds: -110,
  pinnacleOdds: -110,
  polyReceipt: -110,
  gameTime: commence,
  status: 'COMPLETED',
  outcome: 'WIN',
  profit: 0.91,
  away: 'Away',
  home: 'Home',
});
assert.equal(sameJuice.mainNowLabel, null, `hide when juice matches, got ${sameJuice.mainNowLabel}`);

console.log('testFlaggedAtHero: ok');
