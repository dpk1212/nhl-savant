/**
 * FOOLS flat → hard 1u clamp (replaces 0u mute / prior [1u, 2u]).
 * Usage: node tests/testFoolsClamp.mjs
 */
import assert from 'assert';
import {
  applyFoolsGoldMuteOverlay,
  FOOLS_CLAMP_MIN_U,
  FOOLS_CLAMP_MAX_U,
} from '../src/lib/walletClvSkill.js';

let n = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  n++;
}

ok(FOOLS_CLAMP_MIN_U === 1 && FOOLS_CLAMP_MAX_U === 1, 'hard 1u band');

const base = {
  bestForTier: 'FLAT',
  tier: 'SHARP-LEAN',
  pickDate: '2026-08-06',
  edge: 8,
};

{
  const r = applyFoolsGoldMuteOverlay({ ...base, units: 2.5 });
  ok(r.action === 'CLAMP' && r.units === FOOLS_CLAMP_MAX_U, 'cap 2.5 → 1');
  ok(r.mutedBy == null, 'clamp does not set mutedBy');
  ok(r.unitsPrePolicy === 2.5, 'preserves pre units');
}
{
  const r = applyFoolsGoldMuteOverlay({ ...base, units: 0.25 });
  ok(r.action === 'CLAMP' && r.units === FOOLS_CLAMP_MIN_U, 'floor 0.25 → 1');
}
{
  const r = applyFoolsGoldMuteOverlay({ ...base, units: 1.5 });
  ok(r.action === 'CLAMP' && r.units === 1, 'prior mid-band 1.5 → 1');
}
{
  const r = applyFoolsGoldMuteOverlay({ ...base, units: 1 });
  ok(r.action === 'HOLD' && r.units === 1, 'already 1u unchanged');
}
{
  const r = applyFoolsGoldMuteOverlay({ ...base, units: 1, bestForTier: 'CONFIRMED' });
  ok(r.action === 'HOLD' && r.units === 1, 'CONFIRMED not clamped');
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

console.log(`OK — ${n} assertions`);
