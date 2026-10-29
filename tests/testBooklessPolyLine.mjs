/**
 * CS2 / LoL / ATP have no book. Hero and the open→now line follow
 * Polymarket until the ticket seals. Astralis home, Oct 29 2026.
 */
import assert from 'node:assert/strict';
import {
  isBooklessLineSport,
  mapLockedPickToCardFixture,
} from '../src/components/sharpFlow/cards/mapPositionCard.js';

assert.equal(isBooklessLineSport('CS2'), true);
assert.equal(isBooklessLineSport('ATP'), true);
assert.equal(isBooklessLineSport('LOL'), true);
assert.equal(isBooklessLineSport('NHL'), false);

const poly = {
  CS2: {
    innercircleesports_astralis: {
      awayProb: 40.5,
      homeProb: 59.5,
      priceHistory: {
        points: [53.5, 47.5, 46.5, 48.5, 48.5, 42.5, 40.5],
        open: 53.5,
        current: 40.5,
      },
    },
  },
};

const astralis = mapLockedPickToCardFixture({
  key: '2026-10-29_CS2_innercircleesports_astralis:home',
  sport: 'CS2',
  gameKey: 'innercircleesports_astralis',
  marketType: 'ml',
  side: 'home',
  pickSide: 'home',
  team: 'Astralis',
  odds: -114,
  units: 4,
  lockPinnOdds: -106,
  pinnacleOdds: -106,
  away: 'Inner Circle Esports',
  home: 'Astralis',
  gameTime: Date.now() + 30 * 60 * 1000,
}, { polyData: poly });

assert.equal(astralis.heroOdds, -147, `hero should be live Poly, got ${astralis.heroOdds}`);
assert.equal(astralis.fairLine, -147);
assert.equal(astralis.currentFairOdds, -147);
assert.equal(astralis.pinPath[0].odds, 115);
assert.equal(astralis.pinPath.at(-1).odds, -147);
assert.match(astralis.mainNowLabel || astralis.flaggedAtLabel || '', /flagged at -114/);
assert.ok(Math.abs(astralis.toWin - (4 * 100 / 147)) < 0.001);

console.log('testBooklessPolyLine: ok');
