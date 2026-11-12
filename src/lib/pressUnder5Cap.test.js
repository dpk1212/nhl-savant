import assert from 'node:assert/strict';
import test from 'node:test';
import {
  PRESS_UNDER5_CAP_FROM,
  applyPressUnder5Cap,
  pressUnder5CapStamp,
} from './pressUnder5Cap.js';

test('a press edge under 5 is capped at 1 and 5 or more keeps the stake', () => {
  const under = applyPressUnder5Cap({
    units: 4, pressEdge: 4.9, pickDate: PRESS_UNDER5_CAP_FROM,
  });
  assert.equal(under.action, 'CAP');
  assert.equal(under.units, 1);
  assert.equal(under.capped, true);
  assert.equal(under.edge, 4.9);
  assert.equal(under.unitsPrePolicy, 4);
  const stamp = pressUnder5CapStamp(under);
  assert.equal(stamp.v8_pressUnder5Cap, true);
  assert.equal(stamp.v8_pressUnder5CapEdge, 4.9);
  assert.equal(stamp.v8_unitsPrePressUnder5Cap, 4);

  const atFive = applyPressUnder5Cap({
    units: 5, pressEdge: 5, pickDate: PRESS_UNDER5_CAP_FROM,
  });
  assert.equal(atFive.action, 'HOLD');
  assert.equal(atFive.units, 5);
  assert.equal(atFive.capped, false);
  assert.equal(atFive.edge, 5);
  assert.equal(pressUnder5CapStamp(atFive).v8_pressUnder5Cap, false);

  const over = applyPressUnder5Cap({
    units: 6, pressEdge: 12.4, pickDate: PRESS_UNDER5_CAP_FROM,
  });
  assert.equal(over.units, 6);
  assert.equal(over.capped, false);
});

test('a missing press edge is not capped, and a stake at 1 or under stays', () => {
  const missing = applyPressUnder5Cap({
    units: 3, pressEdge: null, pickDate: PRESS_UNDER5_CAP_FROM,
  });
  assert.equal(missing.action, 'PASS');
  assert.equal(missing.units, 3);
  assert.equal(missing.capped, false);
  assert.equal(missing.edge, null);

  const one = applyPressUnder5Cap({
    units: 1, pressEdge: 2.2, pickDate: PRESS_UNDER5_CAP_FROM,
  });
  assert.equal(one.action, 'HOLD');
  assert.equal(one.units, 1);
  assert.equal(one.capped, false);

  const half = applyPressUnder5Cap({
    units: 0.5, pressEdge: 1, pickDate: PRESS_UNDER5_CAP_FROM,
  });
  assert.equal(half.units, 0.5);
  assert.equal(half.capped, false);

  const zero = applyPressUnder5Cap({
    units: 0, pressEdge: 0.4, pickDate: PRESS_UNDER5_CAP_FROM,
  });
  assert.equal(zero.units, 0);
  assert.equal(zero.capped, false);
});

test('the tenth is the stamp, every market, and the floor does not lift', () => {
  const tenth = applyPressUnder5Cap({
    units: 2.5, pressEdge: 4.94, pickDate: PRESS_UNDER5_CAP_FROM,
  });
  assert.equal(tenth.edge, 4.9);
  assert.equal(tenth.units, 1);
  const up = applyPressUnder5Cap({
    units: 2, pressEdge: 4.95, pickDate: PRESS_UNDER5_CAP_FROM,
  });
  assert.equal(up.edge, 5);
  assert.equal(up.units, 2);
  assert.equal(up.capped, false);

  for (const market of ['ML', 'SPREAD', 'TOTAL']) {
    const r = applyPressUnder5Cap({
      units: 3, pressEdge: 3.1, pickDate: PRESS_UNDER5_CAP_FROM, market,
    });
    assert.equal(r.units, 1, market);
  }
});

test('two moneylines stop at 2 and every other press edge under 5 stays at 1', () => {
  const fourteen = applyPressUnder5Cap({
    units: 6, pressEdge: -1.6, pickDate: PRESS_UNDER5_CAP_FROM,
    market: 'ML', for14: 1, against: 0, ledger: true, seatId: 'lead14',
  });
  assert.equal(fourteen.action, 'CAP');
  assert.equal(fourteen.units, 2);
  assert.equal(fourteen.capUnits, 2);
  assert.equal(pressUnder5CapStamp(fourteen).v8_pressUnder5CapUnits, 2);

  const fourteenAtTwo = applyPressUnder5Cap({
    units: 2, pressEdge: 3.1, pickDate: PRESS_UNDER5_CAP_FROM,
    market: 'ML', for14: 1, against: 0, ledger: true,
  });
  assert.equal(fourteenAtTwo.action, 'HOLD');
  assert.equal(fourteenAtTwo.units, 2);
  assert.equal(fourteenAtTwo.capped, false);

  const fourteenUnder = applyPressUnder5Cap({
    units: 1, pressEdge: -1.6, pickDate: PRESS_UNDER5_CAP_FROM,
    market: 'ML', for14: 1, against: 0, ledger: true,
  });
  assert.equal(fourteenUnder.units, 1);
  assert.equal(fourteenUnder.capped, false);

  const fresh = applyPressUnder5Cap({
    units: 3, pressEdge: -18.5, pickDate: PRESS_UNDER5_CAP_FROM,
    market: 'ML', seatId: 't5_young',
  });
  assert.equal(fresh.units, 2);
  assert.equal(fresh.capped, true);

  const freshSpread = applyPressUnder5Cap({
    units: 3, pressEdge: 3.2, pickDate: PRESS_UNDER5_CAP_FROM,
    market: 'SPREAD', seatId: 't5_young',
  });
  assert.equal(freshSpread.units, 1);

  const fourteenSpread = applyPressUnder5Cap({
    units: 4, pressEdge: 1, pickDate: PRESS_UNDER5_CAP_FROM,
    market: 'TOTAL', for14: 1, against: 0, ledger: true,
  });
  assert.equal(fourteenSpread.units, 1);

  const fourteenAgainst = applyPressUnder5Cap({
    units: 4, pressEdge: 2, pickDate: PRESS_UNDER5_CAP_FROM,
    market: 'ML', for14: 1, against: 1, ledger: true, seatId: 'lead14',
  });
  assert.equal(fourteenAgainst.units, 1);

  const heldSix = applyPressUnder5Cap({
    units: 3, pressEdge: 4.3, pickDate: PRESS_UNDER5_CAP_FROM,
    market: 'ML', seatId: 'lead6', for14: 0, against: 0, ledger: true,
  });
  assert.equal(heldSix.units, 1);

  const kept = applyPressUnder5Cap({
    units: 3, pressEdge: 5, pickDate: PRESS_UNDER5_CAP_FROM,
    market: 'ML', seatId: 't5_young',
  });
  assert.equal(kept.units, 3);
  assert.equal(kept.capped, false);
});

test('a spread or total under 0 goes to 0, and a moneyline under 0 stays on the cap', () => {
  const spread = applyPressUnder5Cap({
    units: 4, pressEdge: -0.4, pickDate: PRESS_UNDER5_CAP_FROM, market: 'SPREAD',
  });
  assert.equal(spread.action, 'ZERO');
  assert.equal(spread.units, 0);
  assert.equal(spread.capped, true);
  assert.equal(spread.edge, -0.4);
  assert.equal(pressUnder5CapStamp(spread).v8_pressUnder5CapUnits, 0);

  const total = applyPressUnder5Cap({
    units: 1, pressEdge: -2.1, pickDate: PRESS_UNDER5_CAP_FROM, market: 'TOTAL',
  });
  assert.equal(total.action, 'ZERO');
  assert.equal(total.units, 0);

  const atZero = applyPressUnder5Cap({
    units: 3, pressEdge: 0, pickDate: PRESS_UNDER5_CAP_FROM, market: 'SPREAD',
  });
  assert.equal(atZero.action, 'CAP');
  assert.equal(atZero.units, 1);

  const missing = applyPressUnder5Cap({
    units: 3, pressEdge: null, pickDate: PRESS_UNDER5_CAP_FROM, market: 'TOTAL',
  });
  assert.equal(missing.action, 'PASS');
  assert.equal(missing.units, 3);

  const ml = applyPressUnder5Cap({
    units: 4, pressEdge: -0.4, pickDate: PRESS_UNDER5_CAP_FROM, market: 'ML',
  });
  assert.equal(ml.action, 'CAP');
  assert.equal(ml.units, 1);
});

test('the cap does not run before Nov 10 and a manual stake stays', () => {
  const before = applyPressUnder5Cap({
    units: 4, pressEdge: 1, pickDate: '2026-11-09',
  });
  assert.equal(before.action, 'EXEMPT');
  assert.equal(before.units, 4);
  assert.deepEqual(pressUnder5CapStamp(before), {});

  const manual = applyPressUnder5Cap({
    units: 4, pressEdge: 1, pickDate: PRESS_UNDER5_CAP_FROM, manual: true,
  });
  assert.equal(manual.action, 'EXEMPT');
  assert.equal(manual.units, 4);
});
