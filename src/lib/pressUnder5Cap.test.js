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
