import assert from 'node:assert/strict';
import test from 'node:test';
import { applyFavJuiceMuteOverlay } from './walletClvSkill.js';
import { applyOgEdgeStake } from './ogEdgeStake.js';

const live = { pickDate: '2026-11-15', sport: 'NFL', odds: -110 };

test('a 10+ stake over 1 and under 3 doubles', () => {
  assert.equal(applyOgEdgeStake({ ...live, units: 2, edge: 10 }).units, 4);
  assert.equal(applyOgEdgeStake({ ...live, units: 2, edge: 10 }).action, 'DOUBLE');
  assert.equal(applyOgEdgeStake({ ...live, units: 1.5, edge: 18 }).units, 3);
  assert.equal(applyOgEdgeStake({ ...live, units: 2.5, edge: 30 }).units, 5);
  assert.equal(applyOgEdgeStake({ ...live, units: 3, edge: 12 }).action, 'HOLD');
  assert.equal(applyOgEdgeStake({ ...live, units: 4, edge: 12 }).units, 4);
});

test('a 1u stake at 10 or more is muted', () => {
  const one = applyOgEdgeStake({ ...live, units: 1, edge: 14 });
  assert.equal(one.action, 'MUTE');
  assert.equal(one.units, 0);
  assert.equal(applyOgEdgeStake({ ...live, units: 1, edge: 30.9 }).units, 0);
});

test('5 up to 10 keeps the stake and caps it at 2.5', () => {
  assert.equal(applyOgEdgeStake({ ...live, units: 1, edge: 5 }).units, 1);
  assert.equal(applyOgEdgeStake({ ...live, units: 1, edge: 5 }).action, 'HOLD');
  assert.equal(applyOgEdgeStake({ ...live, units: 2, edge: 7 }).units, 2);
  assert.equal(applyOgEdgeStake({ ...live, units: 2.5, edge: 9.9 }).units, 2.5);
  const cap = applyOgEdgeStake({ ...live, units: 3, edge: 5 });
  assert.equal(cap.action, 'CAP');
  assert.equal(cap.units, 2.5);
  assert.equal(applyOgEdgeStake({ ...live, units: 4, edge: 9 }).units, 2.5);
});

test('a moneyline under 5 stays when the price has shortened', () => {
  const kept = applyOgEdgeStake({ ...live, market: 'ML', units: 2, edge: 4, move: 3.2 });
  assert.equal(kept.action, 'RESCUE');
  assert.equal(kept.units, 2);
  assert.equal(applyOgEdgeStake({ ...live, market: 'ML', units: 1, edge: 1.5, move: 0.06 }).units, 1);
  assert.equal(applyOgEdgeStake({ ...live, market: 'ML', units: 2, edge: 4, move: 0 }).action, 'MUTE');
  assert.equal(applyOgEdgeStake({ ...live, market: 'ML', units: 2, edge: 4, move: 0.04 }).action, 'MUTE');
  assert.equal(applyOgEdgeStake({ ...live, market: 'ML', units: 2, edge: 4, move: -1.4 }).action, 'MUTE');
  assert.equal(applyOgEdgeStake({ ...live, market: 'ML', units: 2, edge: 4, move: null }).action, 'MUTE');
  assert.equal(applyOgEdgeStake({ ...live, market: 'SPREAD', units: 2, edge: 4, move: 6 }).action, 'MUTE');
  assert.equal(applyOgEdgeStake({ ...live, market: 'TOTAL', units: 2, edge: 4, move: 6 }).units, 0);
  assert.equal(applyOgEdgeStake({ ...live, market: 'ML', units: 3, edge: 4, move: 6 }).action, 'HOLD');
});

test('under 5 mutes a stake under 3 and keeps 3 or more', () => {
  for (const units of [1, 1.5, 2, 2.5]) {
    const out = applyOgEdgeStake({ ...live, units, edge: 4.9 });
    assert.equal(out.action, 'MUTE');
    assert.equal(out.units, 0);
  }
  assert.equal(applyOgEdgeStake({ ...live, units: 3, edge: 0 }).units, 3);
  assert.equal(applyOgEdgeStake({ ...live, units: 4, edge: -6 }).action, 'HOLD');
});

test('a missing edge stays put, and every sport is in', () => {
  assert.equal(applyOgEdgeStake({ ...live, units: 2, edge: null }).action, 'PASS');
  assert.equal(applyOgEdgeStake({ ...live, units: 2, edge: null }).units, 2);
  const cbb = applyOgEdgeStake({ ...live, sport: 'CBB', units: 2, edge: 20 });
  assert.equal(cbb.action, 'DOUBLE');
  assert.equal(cbb.units, 4);
  assert.equal(applyOgEdgeStake({ ...live, pickDate: '2026-11-14', units: 1, edge: 4 }).units, 1);
  assert.equal(applyOgEdgeStake({ ...live, units: 2, edge: 12, manual: true }).action, 'EXEMPT');
  assert.equal(applyOgEdgeStake({ ...live, units: 2, edge: 4, killed: true }).units, 2);
});

test('juice at -425 still zeros, even at EDGE 10+ or 5+', () => {
  const juice = applyFavJuiceMuteOverlay({ units: 3, odds: -473, pickDate: '2026-11-15' });
  assert.equal(juice.action, 'MUTE');
  assert.equal(juice.units, 0);
  const afterHigh = applyOgEdgeStake({ ...live, units: juice.units, edge: 19.4, odds: -473 });
  assert.equal(afterHigh.units, 0);
  const mid = applyFavJuiceMuteOverlay({ units: 3, odds: -426, pickDate: '2026-11-15' });
  assert.equal(mid.action, 'MUTE');
  const afterMid = applyOgEdgeStake({ ...live, units: mid.units, edge: 9.9, odds: -426 });
  assert.equal(afterMid.units, 0);
  const hold = applyFavJuiceMuteOverlay({ units: 3, odds: -425, pickDate: '2026-11-15' });
  assert.equal(hold.action, 'HOLD');
  assert.equal(hold.units, 3);
  const cap = applyOgEdgeStake({ ...live, units: hold.units, edge: 9.9, odds: -425 });
  assert.equal(cap.action, 'CAP');
  assert.equal(cap.units, 2.5);
  const one = applyOgEdgeStake({ ...live, units: 1, edge: 16.4, odds: -200 });
  assert.equal(one.action, 'MUTE');
  assert.equal(one.units, 0);
});

test('the odds cap binds after the double', () => {
  const dog = applyOgEdgeStake({ ...live, units: 2, edge: 15, odds: 130 });
  assert.equal(dog.action, 'DOUBLE');
  assert.equal(dog.units, 2.5);
  const longer = applyOgEdgeStake({ ...live, units: 2, edge: 15, odds: 180 });
  assert.equal(longer.units, 1.5);
  const pickem = applyOgEdgeStake({ ...live, units: 2, edge: 15, odds: 110 });
  assert.equal(pickem.units, 4);
});
