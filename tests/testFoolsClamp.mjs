/**
 * FOOLS flat-led → hard 0u MUTE (cancel). Replaces prior 1u clamp.
 * Usage: node tests/testFoolsClamp.mjs
 */
import assert from 'assert';
import {
  applyFoolsGoldMuteOverlay,
  FOOLS_GOLD_MUTE_TIERS,
} from '../src/lib/walletClvSkill.js';

let n = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  n++;
}

ok(FOOLS_GOLD_MUTE_TIERS.has('CONFIRMED-UNOPP'), 'promote tier in FOOLS allowlist');

const base = {
  bestForTier: 'FLAT',
  tier: 'SHARP-LEAN',
  pickDate: '2026-08-06',
  edge: 8,
};

{
  const r = applyFoolsGoldMuteOverlay({ ...base, units: 2.5 });
  ok(r.action === 'MUTE' && r.units === 0, 'cap path → 0u MUTE');
  ok(r.mutedBy === 'fools-gold-flat', 'sets mutedBy');
  ok(r.unitsPrePolicy === 2.5, 'preserves pre units');
  ok(r.reason === 'fools_flat_cancel', 'hard reason when EDGE≥7');
}
{
  const r = applyFoolsGoldMuteOverlay({ ...base, units: 1, edge: 3 });
  ok(r.action === 'MUTE' && r.units === 0, '1u FLAT-led → 0u');
  ok(r.reason === 'fools_flat_cancel_soft', 'soft reason when EDGE<7');
}
{
  const r = applyFoolsGoldMuteOverlay({ ...base, units: 5, bestForTier: 'CONFIRMED' });
  ok(r.action === 'HOLD' && r.units === 5, 'CONFIRMED not muted');
}
{
  const r = applyFoolsGoldMuteOverlay({ ...base, units: 5, tier: 'DISSENT' });
  ok(r.action === 'EXEMPT' && r.units === 5, 'DISSENT exempt');
}
{
  const r = applyFoolsGoldMuteOverlay({ ...base, units: 3, pickDate: '2026-08-04' });
  ok(r.action === 'EXEMPT' && r.units === 3, 'pre-cutover exempt');
}
{
  const r = applyFoolsGoldMuteOverlay({ ...base, units: 0 });
  ok(r.action === 'PASS' && r.units === 0, 'zero stays pass');
}
{
  const r = applyFoolsGoldMuteOverlay({
    ...base, units: 2, tier: 'CONFIRMED-UNOPP', bestForTier: 'FLAT',
  });
  ok(r.action === 'MUTE' && r.units === 0, 'CONFIRMED-UNOPP still FOOLS-eligible if FLAT-led');
}
{
  const r = applyFoolsGoldMuteOverlay({
    ...base, units: 2, tier: 'CONFIRMED-UNOPP', bestForTier: 'CONFIRMED',
  });
  ok(r.action === 'HOLD' && r.units === 2, 'CONFIRMED-UNOPP HOLD when best FOR CONFIRMED');
}

console.log(`OK — ${n} assertions`);
