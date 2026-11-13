import assert from 'node:assert/strict';
import test from 'node:test';
import {
  T5_EDGE_BAND_FROM,
  applyT5EdgeBandRescue,
  deepestTier5Edge,
  t5EdgeBandLabel,
  t5EdgeBandStamp,
} from './t5EdgeBandRescue.js';

function t4(edges) {
  return {
    for: edges.map((edge, i) => ({
      wallet: `w${i}`,
      tier: edge >= 8 ? 5 : 4,
      edge,
    })),
  };
}

const base = {
  units: 0,
  pickDate: T5_EDGE_BAND_FROM,
  sport: 'NBA',
  market: 'SPREAD',
  odds: -110,
  opponentUnits: 0,
  t4: t4([9.4]),
  label: 'quality',
};

test('the deepest tier-5 edge is the one the band reads', () => {
  assert.equal(deepestTier5Edge(t4([9, 4.2, 11.2])), 11.2);
  assert.equal(deepestTier5Edge(t4([6, 4])), null);
  assert.equal(deepestTier5Edge(null), null);
});

test('a quality veto in the band goes to 3 and the next edge does not', () => {
  const inBand = applyT5EdgeBandRescue(base);
  assert.equal(inBand.action, 'RESCUE');
  assert.equal(inBand.units, 3);
  assert.equal(inBand.label, 'quality');
  assert.equal(t5EdgeBandStamp(inBand).v8_t5EdgeBandEdge, 9.4);

  const at8 = applyT5EdgeBandRescue({ ...base, t4: t4([8]) });
  assert.equal(at8.units, 3);
  const under = applyT5EdgeBandRescue({ ...base, t4: t4([7.9]) });
  assert.equal(under.units, 0);
  const at12 = applyT5EdgeBandRescue({ ...base, t4: t4([12]) });
  assert.equal(at12.action, 'PASS');
  assert.equal(at12.units, 0);
  const deeper = applyT5EdgeBandRescue({ ...base, t4: t4([9, 13]) });
  assert.equal(deeper.units, 0);
  assert.equal(deeper.edge, 13);
});

test('a press-edge hole rescues a moneyline and leaves a spread at 0', () => {
  const ml = applyT5EdgeBandRescue({
    ...base, market: 'ML', label: 'hole', odds: 150, sport: 'NFL',
  });
  assert.equal(ml.units, 3);
  assert.equal(ml.label, 'hole');
  const spread = applyT5EdgeBandRescue({ ...base, market: 'SPREAD', label: 'hole' });
  assert.equal(spread.units, 0);
  const total = applyT5EdgeBandRescue({ ...base, market: 'TOTAL', label: 'quality', sport: 'CFB' });
  assert.equal(total.units, 3);
});

test('price, opponent, and an existing stake stay shut', () => {
  assert.equal(applyT5EdgeBandRescue({ ...base, odds: -425 }).units, 3);
  assert.equal(applyT5EdgeBandRescue({ ...base, odds: -426 }).units, 0);
  assert.equal(applyT5EdgeBandRescue({ ...base, odds: 200 }).units, 3);
  assert.equal(applyT5EdgeBandRescue({ ...base, odds: 201 }).units, 0);
  assert.equal(applyT5EdgeBandRescue({ ...base, opponentUnits: 1 }).units, 0);
  assert.equal(applyT5EdgeBandRescue({ ...base, units: 2 }).units, 2);
  assert.equal(applyT5EdgeBandRescue({ ...base, sport: 'CBB' }).units, 0);
  assert.equal(applyT5EdgeBandRescue({ ...base, sport: 'NCAAF' }).units, 3);
  assert.equal(applyT5EdgeBandRescue({ ...base, manual: true }).action, 'EXEMPT');
  assert.equal(applyT5EdgeBandRescue({ ...base, killed: true }).action, 'EXEMPT');
  assert.equal(applyT5EdgeBandRescue({ ...base, pickDate: '2026-11-12' }).action, 'EXEMPT');
});

test('the label is the quality veto or a moneyline hole, and the other mutes win', () => {
  const open = {
    units: 0, pressApplied: true, quality: true, market: 'SPREAD',
  };
  assert.equal(t5EdgeBandLabel(open), 'quality');
  assert.equal(t5EdgeBandLabel({ ...open, hole: true, market: 'ML' }), 'hole');
  assert.equal(t5EdgeBandLabel({ ...open, hole: true, market: 'SPREAD' }), null);
  assert.equal(t5EdgeBandLabel({ ...open, pressEdgeNet: true, hole: false }), null);
  assert.equal(t5EdgeBandLabel({ ...open, favJuice: true }), null);
  assert.equal(t5EdgeBandLabel({ ...open, edgeUnder5: true }), null);
  assert.equal(t5EdgeBandLabel({ ...open, doorCut: true }), null);
  assert.equal(t5EdgeBandLabel({ ...open, t5Mute: true }), null);
  assert.equal(t5EdgeBandLabel({ ...open, quality: false }), null);
  assert.equal(t5EdgeBandLabel({ ...open, units: 1.5 }), null);
  assert.equal(t5EdgeBandLabel({ ...open, killed: true }), null);
});
