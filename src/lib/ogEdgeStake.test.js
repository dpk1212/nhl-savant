import assert from 'node:assert/strict';
import test from 'node:test';
import { applyFavJuiceMuteOverlay } from './walletClvSkill.js';
import { applyOgEdgeStake, ogEdgeLastWins } from './ogEdgeStake.js';

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

test('under 10 mutes a stake under 3 and keeps 3 or more', () => {
  for (const units of [1, 1.5, 2, 2.5]) {
    const out = applyOgEdgeStake({ ...live, units, edge: 9.9 });
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

test('EDGE of 10 or more is the last size', () => {
  assert.equal(ogEdgeLastWins(10), true);
  assert.equal(ogEdgeLastWins(19.4), true);
  assert.equal(ogEdgeLastWins(9.9), false);
  assert.equal(ogEdgeLastWins(null), false);
  const bills = applyOgEdgeStake({ ...live, units: 3, edge: 19.4, odds: -473 });
  assert.equal(bills.action, 'HOLD');
  assert.equal(bills.units, 3);
  const one = applyOgEdgeStake({ ...live, units: 1, edge: 16.4, odds: -200 });
  assert.equal(one.action, 'MUTE');
  assert.equal(one.units, 0);
  const juice = applyFavJuiceMuteOverlay({ units: 3, odds: -473, pickDate: '2026-11-15' });
  assert.equal(juice.action, 'MUTE');
  const afterJuice = ogEdgeLastWins(19.4) ? 3 : juice.units;
  assert.equal(afterJuice, 3);
  const held = applyOgEdgeStake({ ...live, units: afterJuice, edge: 19.4, odds: -473 });
  assert.equal(held.action, 'HOLD');
  assert.equal(held.units, 3);
  const under = applyFavJuiceMuteOverlay({ units: 3, odds: -473, pickDate: '2026-11-15' });
  const afterUnder = ogEdgeLastWins(9.9) ? 3 : under.units;
  assert.equal(afterUnder, 0);
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
