/**
 * CS2 / LoL / ATP have no book. Hero and the open→now line follow
 * Polymarket until the ticket seals. Astralis home, Oct 29 2026.
 */
import assert from 'node:assert/strict';
import {
  isBooklessLineSport,
  mapLockedPickToCardFixture,
  parseCommenceMs,
} from '../src/components/sharpFlow/cards/mapPositionCard.js';
import { lockedCardToWin } from '../src/lib/cardPayout.js';

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

assert.equal(parseCommenceMs(1763003700), 1763003700000, 'unix seconds → ms');
assert.equal(parseCommenceMs(1763003700000), 1763003700000);

const shangPoly = {
  ATP: {
    danesweeny_junchengshang: {
      awayProb: 36.5,
      homeProb: 63.5,
      priceHistory: { points: [36.5], open: 36.5, current: 36.5 },
    },
  },
};

const shangLive = mapLockedPickToCardFixture({
  key: '2026-11-12_ATP_danesweeny_junchengshang:home',
  sport: 'ATP',
  gameKey: 'danesweeny_junchengshang',
  marketType: 'ml',
  side: 'home',
  pickSide: 'home',
  team: 'Shang',
  odds: -100,
  units: 2,
  away: 'Dane Sweeny',
  home: 'Juncheng Shang',
  gameTime: Date.now() + 2 * 60 * 60 * 1000,
}, { polyData: shangPoly });
assert.equal(shangLive.heroOdds, -174, `live hero is board −174, got ${shangLive.heroOdds}`);
assert.equal(shangLive.bestOdds, -174, `shop juice matches hero, got ${shangLive.bestOdds}`);
assert.ok(Math.abs(shangLive.toWin - (2 * 100 / 174)) < 0.01, `toWin from −174, got ${shangLive.toWin}`);

const shangFrozen = mapLockedPickToCardFixture({
  key: '2026-11-12_ATP_danesweeny_junchengshang:home',
  sport: 'ATP',
  gameKey: 'danesweeny_junchengshang',
  marketType: 'ml',
  side: 'home',
  pickSide: 'home',
  team: 'Shang',
  odds: -100,
  units: 2,
  away: 'Dane Sweeny',
  home: 'Juncheng Shang',
  gameTime: Date.now() - 20 * 60 * 1000,
}, { polyData: shangPoly });
assert.equal(shangFrozen.heroOdds, -174, `frozen even-money stamp yields to board, got ${shangFrozen.heroOdds}`);
assert.equal(shangFrozen.bestOdds, -174);
assert.ok(Math.abs(shangFrozen.toWin - (2 * 100 / 174)) < 0.01, `frozen toWin from −174, got ${shangFrozen.toWin}`);

const shangSealed = mapLockedPickToCardFixture({
  key: '2026-11-12_ATP_danesweeny_junchengshang:home',
  sport: 'ATP',
  gameKey: 'danesweeny_junchengshang',
  marketType: 'ml',
  side: 'home',
  pickSide: 'home',
  team: 'Shang',
  odds: -174,
  units: 2,
  away: 'Dane Sweeny',
  home: 'Juncheng Shang',
  gameTime: Date.now() - 20 * 60 * 1000,
}, {
  polyData: {
    ATP: {
      danesweeny_junchengshang: {
        awayProb: 34,
        homeProb: 66,
        priceHistory: { points: [34], open: 34, current: 34 },
      },
    },
  },
});
assert.equal(shangSealed.heroOdds, -174, 'real freeze stamp stays when board walks');
assert.ok(Math.abs(shangSealed.toWin - (2 * 100 / 174)) < 0.01);

const face = lockedCardToWin({
  sport: 'ATP',
  units: 2,
  toWin: 2,
  paintedOdds: -174,
});
assert.ok(
  Math.abs(face - (2 * 100 / 174)) < 1e-9,
  `card face pays painted −174, not even money, got ${face}`,
);

console.log('testBooklessPolyLine: ok');
