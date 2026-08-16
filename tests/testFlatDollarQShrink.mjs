/**
 * Flat-dollar Q shrinks thin-sample ROI toward the n-weighted peer mean.
 * Usage: node tests/testFlatDollarQShrink.mjs
 */
import assert from 'node:assert/strict';
import {
  FLAT_DOLLAR_Q_SHRINK_N0,
  shrinkRoiTowardMean,
  nWeightedMean,
  scoreFlatDollarRows,
  quartileFromScores,
  buildFlatDollarQBySport,
} from '../src/lib/walletClvSkill.js';

assert.equal(FLAT_DOLLAR_Q_SHRINK_N0, 40);

const sThin = shrinkRoiTowardMean(54, 4, 6, 40);
assert.ok(sThin > 9 && sThin < 12, `3-1 +54% should collapse near ~10, got ${sThin}`);
const sFat = shrinkRoiTowardMean(8, 180, 6, 40);
assert.ok(Math.abs(sFat - 7.64) < 0.15, `180-bet +8% barely moves, got ${sFat}`);
assert.ok(sThin - 6 < 54 - 6, 'thin moves toward the mean');

assert.equal(shrinkRoiTowardMean(54, 0, 6, 40), 6, 'n=0 fully shrinks');
assert.equal(nWeightedMean([54, 8], [4, 180]), (4 * 54 + 180 * 8) / 184);

function rec(id, n, roi) {
  return [id, 'MLB', 'CONFIRMED', roi, roi, roi, n];
}
function profiles(entries) {
  const m = new Map();
  for (const [id, sport, tier, flatA, dol, flatB, n] of entries) {
    const key = String(id).toLowerCase();
    if (!m.has(key)) m.set(key, { bySport: {} });
    m.get(key).bySport[sport] = {
      whitelistTier: tier,
      picks: { flatRoi: flatA, n },
      positions: { dollarRoi: dol, positionFlatRoi: flatB, n },
    };
  }
  return m;
}

// Equal n → affine shrink → same rank as raw.
const equal = profiles([
  rec('aaaaaa', 10, 40),
  rec('bbbbbb', 10, 20),
  rec('cccccc', 10, 5),
  rec('dddddd', 10, -5),
]);
const qEq = buildFlatDollarQBySport(equal);
assert.equal(qEq.get('MLB')?.get('aaaaaa'), 1);
assert.equal(qEq.get('MLB')?.get('dddddd'), 4);

// Established +15% n=200 vs lottery +54% n=4.
const mixed = profiles([
  rec('thin00', 4, 54),
  rec('fatg00', 200, 15),
  rec('mid000', 80, 5),
  rec('low000', 80, -2),
]);
const scores = scoreFlatDollarRows([
  { wallet: 'thin00', flatA: 54, nA: 4, flatB: 54, nB: 4, dol: 54, nDol: 4 },
  { wallet: 'fatg00', flatA: 15, nA: 200, flatB: 15, nB: 200, dol: 15, nDol: 200 },
  { wallet: 'mid000', flatA: 5, nA: 80, flatB: 5, nB: 80, dol: 5, nDol: 80 },
  { wallet: 'low000', flatA: -2, nA: 80, flatB: -2, nB: 80, dol: -2, nDol: 80 },
]);
assert.ok(scores.get('fatg00') > scores.get('thin00'), '200-bet +15% outranks 3-1 +54% after shrink');
assert.ok(scores.get('thin00') > scores.get('mid000'));
assert.ok(scores.get('mid000') > scores.get('low000'));
const qMix = quartileFromScores(scores);
assert.equal(qMix.get('fatg00'), 1);
assert.equal(qMix.get('low000'), 4);

const qLive = buildFlatDollarQBySport(mixed);
assert.equal(qLive.get('MLB')?.get('low000'), 4);

console.log('testFlatDollarQShrink: ok', {
  sThin: +sThin.toFixed(2),
  sFat: +sFat.toFixed(2),
  thinScore: +scores.get('thin00').toFixed(3),
  fatScore: +scores.get('fatg00').toFixed(3),
  qThin: qMix.get('thin00'),
  qFat: qMix.get('fatg00'),
});
