/**
 * Locked-card trust book: all-time Source B, sport×market or sport.
 * Usage: node tests/testSourceBTrustBook.mjs
 */
import assert from 'node:assert/strict';
import { sourceBPreferredBook } from '../src/lib/walletSportBook.js';

const profile = {
  bySport: {
    NBA: {
      picks: { n: 6, wins: 5, losses: 1, wr: 83, flatRoi: 44 },
      positions: { n: 19, wins: 12, losses: 7, wr: 63, positionFlatRoi: 7, dollarRoi: 9 },
      byMarket: {
        ML: {
          positions: { n: 8, wins: 6, losses: 2, wr: 75, positionFlatRoi: 18, dollarRoi: 22 },
        },
        SPREAD: {
          positions: { n: 11, wins: 4, losses: 7, wr: 36, positionFlatRoi: -12, dollarRoi: -8 },
        },
      },
    },
    NHL: {
      picks: { n: 5, wins: 5, losses: 0, wr: 100, flatRoi: 80 },
      positions: { n: 1, wins: 1, losses: 0, wr: 100, positionFlatRoi: 40 },
      byMarket: {
        ML: { positions: { n: 1, wins: 1, losses: 0, wr: 100, positionFlatRoi: 40 } },
      },
    },
  },
};

const ml = sourceBPreferredBook(profile, 'NBA', 'ML');
assert.equal(ml.scope, 'market');
assert.equal(ml.wins, 6);
assert.equal(ml.losses, 2);
assert.equal(ml.roi, 18);
assert.notEqual(ml.wins, 5, 'featured 5-1 picks are not the trust book');

const spread = sourceBPreferredBook(profile, 'NBA', 'SPREAD');
assert.equal(spread.scope, 'sport', 'a losing market book loses to the profitable sport book');
assert.equal(spread.wins, 12);
assert.equal(spread.losses, 7);
assert.equal(spread.roi, 7);

const thin = sourceBPreferredBook(profile, 'NHL', 'ML');
assert.equal(thin, null, 'a one-bet Source B book is not a sample');

const missing = sourceBPreferredBook(profile, 'MLB', 'ML');
assert.equal(missing, null);

console.log('testSourceBTrustBook: ok');
