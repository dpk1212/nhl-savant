/**
 * Spread/total fat mute (2026-09-17+).
 * Mute leftover BOTH any units + arriving ≥4u on SPREAD/TOTAL. ML exempt.
 * Usage: node tests/testStFatMuteOverlay.mjs
 */
import assert from 'assert';
import {
  applyStFatMuteOverlay,
  isLeftoverBoth,
  isStFatMarket,
  isStFatMuteLive,
  leftoverBothKnown,
  ST_FAT_ARRIVING_MIN,
  ST_FAT_MUTE_FROM,
  ST_FAT_MUTED_BY,
} from '../src/lib/stFatMuteOverlay.js';
import {
  BOTH_E10_EDGE_MIN,
  TAPE_BOOST_ABOVE,
} from '../src/lib/walletClvSkill.js';

let n = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  n++;
}

function run(args) {
  return applyStFatMuteOverlay({
    pickDate: '2026-09-17',
    marketType: 'TOTAL',
    ...args,
  });
}

ok(isStFatMuteLive('2026-09-17'), 'live on cutover');
ok(!isStFatMuteLive('2026-09-16'), 'not live before cutover');
ok(ST_FAT_MUTE_FROM === '2026-09-17', 'cutover date');
ok(ST_FAT_MUTED_BY === 'st-fat', 'mutedBy');
ok(ST_FAT_ARRIVING_MIN === 4, 'arriving floor is 4u');
ok(isStFatMarket('TOTAL') && isStFatMarket('spread') && isStFatMarket('SPREAD'), 'S/T markets');
ok(!isStFatMarket('ML') && !isStFatMarket('ml') && !isStFatMarket('MONEYLINE'), 'ML not a fat market');
ok(BOTH_E10_EDGE_MIN === 10, 'BOTH edge matches skill floor');
ok(TAPE_BOOST_ABOVE === 2.89, 'BOTH tape matches skill floor');

ok(isLeftoverBoth({ bothMode: 'BOTH' }), 'mode BOTH is leftover BOTH');
ok(!isLeftoverBoth({ bothMode: 'ONE', edge: 12, tape: 1.0 }), 'ONE is not BOTH');
ok(isLeftoverBoth({ edge: 10, tape: 2.89 }), 'EDGE 10 + tape boost is BOTH');
ok(!isLeftoverBoth({ edge: 9.99, tape: 3.5 }), 'EDGE just under 10 is not BOTH');
ok(!isLeftoverBoth({ edge: 20, tape: 2.88 }), 'tape just under boost is not BOTH');
ok(!isLeftoverBoth({ edge: 20, tape: null }), 'missing tape is not proven BOTH');
ok(leftoverBothKnown({ bothMode: 'ONE' }), 'ONE mode is known not-BOTH');
ok(leftoverBothKnown({ edge: 8, tape: 1 }), 'finite edge+tape is known');
ok(!leftoverBothKnown({ bothMode: null, edge: 12, tape: null }), 'missing tape is unknown');

{
  const r = run({ units: 5.4, bothMode: 'BOTH', steamArriving: false });
  ok(r.action === 'MUTE' && r.units === 0, 'leftover BOTH 5.4u mutes');
  ok(r.mutedBy === ST_FAT_MUTED_BY, 'BOTH mute stamp');
  ok(r.reason === 'st_fat_both', 'BOTH reason');
  ok(r.unitsPrePolicy === 5.4, 'preserves pre units');
  ok(r.both === true, 'both flag');
}
{
  const r = run({ units: 2.7, bothMode: 'BOTH', steamArriving: false });
  ok(r.action === 'MUTE' && r.units === 0, 'climate-shrunk BOTH 2.7u still mutes');
  ok(r.reason === 'st_fat_both', 'shrunk BOTH uses both reason');
}
{
  const r = run({ units: 2, edge: 26, tape: 3.1, steamArriving: false });
  ok(r.action === 'MUTE' && r.reason === 'st_fat_both', 'BOTH from EDGE+tape numbers, any units');
}
{
  const r = run({ units: 5.4, bothMode: 'ONE', edge: 12, tape: 1.2, steamArriving: false });
  ok(r.action === 'HOLD' && r.units === 5.4 && r.mutedBy == null, 'ONE leftover is not Layer 2');
}

{
  const r = run({ units: 4, bothMode: 'ONE', steamArriving: true });
  ok(r.action === 'MUTE' && r.units === 0, 'arriving 4u mutes');
  ok(r.reason === 'st_fat_arriving_4u', 'arriving reason');
  ok(r.mutedBy === ST_FAT_MUTED_BY, 'arriving mute stamp');
}
{
  const r = run({ units: 3, bothMode: 'ONE', steamArriving: true });
  ok(r.action === 'HOLD' && r.units === 3, 'arriving 3u stays (not promoted)');
}
{
  const r = run({ units: 3.99, edge: 5, tape: 1, steamArriving: true });
  ok(r.action === 'HOLD' && r.units === 3.99, 'arriving just under 4u stays');
}
{
  const r = run({ units: 6, bothMode: 'ONE', steamArriving: false });
  ok(r.action === 'HOLD' && r.units === 6, 'fat leftover that is not BOTH and not arriving stays');
}

{
  const r = run({
    units: 5.4, bothMode: 'BOTH', steamArriving: true,
  });
  ok(r.action === 'MUTE' && r.reason === 'st_fat_both', 'BOTH wins over arriving when both fire');
}

{
  const r = applyStFatMuteOverlay({
    units: 5.4, pickDate: '2026-09-17', marketType: 'ML',
    bothMode: 'BOTH', steamArriving: true,
  });
  ok(r.action === 'EXEMPT' && r.units === 5.4, 'ML BOTH+arriving 4u+ is exempt');
  ok(r.reason === 'ml_exempt', 'ML exempt reason');
  ok(r.mutedBy == null, 'ML does not stamp mutedBy');
}
{
  const r = applyStFatMuteOverlay({
    units: 4, pickDate: '2026-09-17', marketType: 'ml',
    steamArriving: true, bothMode: 'ONE',
  });
  ok(r.action === 'EXEMPT' && r.units === 4, 'lowercase ml exempt');
}

{
  const r = applyStFatMuteOverlay({
    units: 5.4, pickDate: '2026-09-16', marketType: 'TOTAL',
    bothMode: 'BOTH', steamArriving: true,
  });
  ok(r.action === 'EXEMPT' && r.units === 5.4, 'pre-cutover does not rewrite history');
  ok(r.reason === 'pre_cutover', 'pre-cutover reason');
}
{
  const r = run({ units: 0, bothMode: 'BOTH', steamArriving: true });
  ok(r.action === 'PASS' && r.units === 0, 'already 0u stays PASS');
}

{
  const r = run({ units: 4, bothMode: null, edge: null, tape: null, steamArriving: null });
  ok(r.action === 'HOLD' && r.units === 4, 'BOTH unknown + arriving unknown fail-open');
  ok(r.reason === 'st_fat_fail_open', 'fail-open reason');
  ok(r.mutedBy == null, 'fail-open is not a mute');
}
{
  const r = run({ units: 5.4, bothMode: null, edge: null, tape: null, steamArriving: false });
  ok(r.action === 'HOLD' && r.units === 5.4 && r.reason == null, 'unproven BOTH with known not-arriving holds');
}
{
  const r = run({ units: 4, bothMode: null, edge: null, tape: null, steamArriving: true });
  ok(r.action === 'MUTE' && r.reason === 'st_fat_arriving_4u', 'arriving 4u still mutes when BOTH unknown');
}

{
  const r = applyStFatMuteOverlay({
    units: 4, pickDate: '2026-09-17', marketType: 'SPREAD',
    bothMode: 'BOTH', steamArriving: false,
  });
  ok(r.action === 'MUTE' && r.reason === 'st_fat_both', 'SPREAD BOTH mutes');
}

console.log(`ok ${n} st-fat mute checks`);
