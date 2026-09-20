/**
 * Full vs Conservative unit display.
 * Usage: node tests/testUnitDisplayScale.mjs
 */
import assert from 'assert';
import {
  UNIT_DISPLAY_SCALE,
  isUnitDisplayScale,
  normalizeUnitDisplayScale,
  scaleUnits,
} from '../src/lib/unitDisplayScale.js';

let n = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  n++;
}

ok(isUnitDisplayScale('full') && isUnitDisplayScale('conservative'), 'known scales');
ok(!isUnitDisplayScale('half') && !isUnitDisplayScale(null), 'unknown rejected');

ok(normalizeUnitDisplayScale('conservative') === UNIT_DISPLAY_SCALE.CONSERVATIVE, 'conservative stays');
ok(normalizeUnitDisplayScale('full') === UNIT_DISPLAY_SCALE.FULL, 'full stays');
ok(normalizeUnitDisplayScale(null) === UNIT_DISPLAY_SCALE.FULL, 'missing → full');
ok(normalizeUnitDisplayScale('nope') === UNIT_DISPLAY_SCALE.FULL, 'junk → full');

ok(scaleUnits(6, 'full') === 6, 'full 6 stays 6');
ok(scaleUnits(3, 'full') === 3, 'full 3 stays 3');
ok(scaleUnits(0.5, 'full') === 0.5, 'full lean stays');

ok(scaleUnits(6, 'conservative') === 3, '6u → 3u');
ok(scaleUnits(5, 'conservative') === 2.5, '5u → 2.5u');
ok(scaleUnits(4, 'conservative') === 2, '4u → 2u');
ok(scaleUnits(3, 'conservative') === 1.5, '3u → 1.5u');
ok(scaleUnits(2, 'conservative') === 1, '2u → 1u');
ok(scaleUnits(1, 'conservative') === 0.5, '1u → 0.5u');
ok(scaleUnits(0.5, 'conservative') === 0.25, '0.5u → 0.25u');
ok(scaleUnits(0, 'conservative') === 0, 'zero stays zero');
ok(scaleUnits(-3, 'conservative') === -1.5, 'loss profit halves');
ok(scaleUnits(0.89, 'conservative') === 0.45, 'win profit halves');
ok(scaleUnits(null, 'conservative') === 0, 'null → 0');

console.log(`ok ${n}`);
