/**
 * maxSR sub-4 mute (2026-08-20+).
 * Must 0u remaining sub-4u with maxSR < 1 and HOLD every other ticket exact.
 * Usage: node tests/testMaxSrSub4Mute.mjs
 */
import assert from 'assert';
import {
  applyMaxSrSub4MuteOverlay,
  applyFlinchFailOpenMuteOverlay,
  maxForSizeRatio,
  isMaxSrSub4MuteLive,
  MAX_SR_SUB4_MUTE_FROM,
  MAX_SR_SUB4_MUTE_THR,
  MAX_SR_SUB4_MUTED_BY,
} from '../src/lib/walletClvSkill.js';

let n = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  n++;
}

function mute(args) {
  return applyMaxSrSub4MuteOverlay({ pickDate: '2026-08-20', ...args });
}

ok(isMaxSrSub4MuteLive('2026-08-20'), 'live on cutover');
ok(!isMaxSrSub4MuteLive('2026-08-19'), 'not live before cutover');
ok(MAX_SR_SUB4_MUTE_FROM === '2026-08-20', 'cutover date');
ok(MAX_SR_SUB4_MUTE_THR === 1.0, 'threshold 1.0');

// ── MUTE: sub-4 + maxSR < 1 ──────────────────────────────────────────────
{
  const r = mute({ units: 1, maxSR: 0.43 });
  ok(r.action === 'MUTE' && r.units === 0, '1u maxSR 0.43 → mute');
  ok(r.mutedBy === MAX_SR_SUB4_MUTED_BY, 'maxsr-sub4 stamp');
  ok(r.unitsPrePolicy === 1, 'preserves pre units');
  ok(r.reason === 'maxsr_lt_1', 'reason');
}
{
  const r = mute({ units: 3, maxSR: 0.91 });
  ok(r.action === 'MUTE' && r.units === 0, '3u maxSR 0.91 → mute');
}
{
  const r = mute({ units: 2.5, maxSR: 0.999 });
  ok(r.action === 'MUTE' && r.units === 0, 'just under 1 → mute');
}
{
  const r = mute({ units: 1.13, maxSR: 0.13 });
  ok(r.action === 'MUTE' && r.units === 0, '1.13u weak SR → mute');
}

// ── HOLD / EXEMPT: rest of the book (identity) ───────────────────────────
function holdExact(args, expectU, msg) {
  const r = mute(args);
  ok(r.units === expectU, `${msg} units ${r.units} === ${expectU}`);
  ok(r.action === 'HOLD' || r.action === 'EXEMPT', `${msg} action ${r.action}`);
  ok(r.mutedBy == null, `${msg} no mutedBy`);
}

holdExact({ units: 1, maxSR: 1.0 }, 1, 'exactly 1.0 HOLD');
holdExact({ units: 1, maxSR: 1.27 }, 1, '1u maxSR ≥1 HOLD');
holdExact({ units: 3, maxSR: 1.31 }, 3, '3u maxSR ≥1 HOLD');
holdExact({ units: 2.03, maxSR: 1.5 }, 2.03, 'exact unit identity on HOLD');
holdExact({ units: 1, maxSR: null }, 1, 'missing maxSR HOLD (no invent)');
holdExact({ units: 3, maxSR: undefined }, 3, 'undefined maxSR HOLD');
holdExact({ units: 2, maxSR: NaN }, 2, 'NaN maxSR HOLD');

{
  const r = mute({ units: 4, maxSR: 0.2 });
  ok(r.action === 'EXEMPT' && r.units === 4, '4u+ never muted even if SR weak');
  ok(r.reason === 'units_ge_4', '4u fence');
}
{
  const r = mute({ units: 5.4, maxSR: 0.11 });
  ok(r.action === 'EXEMPT' && r.units === 5.4, '5.4u EXEMPT');
}
{
  const r = applyMaxSrSub4MuteOverlay({
    units: 1, maxSR: 0.43, pickDate: '2026-08-19',
  });
  ok(r.action === 'EXEMPT' && r.units === 1, 'pre-cutover does not rewrite history');
}
{
  const r = mute({ units: 0, maxSR: 0.2 });
  ok(r.action === 'PASS' && r.units === 0, 'already 0u stays PASS');
}

// ── maxForSizeRatio helper ───────────────────────────────────────────────
{
  const wd = [
    { side: 'home', sizeRatio: 0.4 },
    { side: 'home', sizeRatio: 1.2 },
    { side: 'away', sizeRatio: 3.0 },
  ];
  ok(maxForSizeRatio(wd, 'home') === 1.2, 'max on home');
  ok(maxForSizeRatio(wd, 'away') === 3.0, 'max on away');
  ok(maxForSizeRatio(wd, 'draw') == null, 'missing side null');
}
{
  const wd = [
    { side: 'home', direction: 'FOR', sizeRatio: 0.5 },
    { side: 'home', direction: 'AG', sizeRatio: 9.0 },
  ];
  ok(maxForSizeRatio(wd, 'home') === 0.5, 'AG direction excluded');
}
{
  const wd = { a: { side: 'over', sizeRatio: 0.7 }, b: { side: 'over', sizeRatio: 0.9 } };
  ok(maxForSizeRatio(wd, 'over') === 0.9, 'object map of walletDetails');
}

// ── Pipeline: flinch then maxSR — neither rescales keepers ───────────────
{
  // Keeper: after flinch HOLD, maxSR ≥1 → still exact units
  const afterFlinch = applyFlinchFailOpenMuteOverlay({
    units: 3, odds: -112, edge: 4.4, tapeAction: 'HOLD', tier: 'RANK', pickDate: '2026-08-20',
  });
  ok(afterFlinch.units === 3 && afterFlinch.action === 'HOLD', 'flinch HOLD 3u');
  const afterSr = applyMaxSrSub4MuteOverlay({
    units: afterFlinch.units, maxSR: 1.31, pickDate: '2026-08-20',
  });
  ok(afterSr.units === 3 && afterSr.action === 'HOLD', 'maxSR HOLD keeps 3u');
}
{
  // Cut target: flinch HOLD, then maxSR mute
  const afterFlinch = applyFlinchFailOpenMuteOverlay({
    units: 1, odds: -110, edge: -0.5, tapeAction: 'HOLD', tier: 'SHARP', pickDate: '2026-08-20',
  });
  ok(afterFlinch.units === 1, 'flinch leaves 1u');
  const afterSr = applyMaxSrSub4MuteOverlay({
    units: afterFlinch.units, maxSR: 0.35, pickDate: '2026-08-20',
  });
  ok(afterSr.action === 'MUTE' && afterSr.units === 0, 'maxSR cuts after flinch');
}
{
  // Already flinch-muted → maxSR PASS (0u in)
  const afterFlinch = applyFlinchFailOpenMuteOverlay({
    units: 1, odds: 251, edge: 23.8, tapeAction: 'BOOST', tier: 'SHARP', pickDate: '2026-08-20',
  });
  ok(afterFlinch.action === 'MUTE' && afterFlinch.units === 0, 'flinch already 0');
  const afterSr = applyMaxSrSub4MuteOverlay({
    units: afterFlinch.units, maxSR: 0.2, pickDate: '2026-08-20',
  });
  ok(afterSr.action === 'PASS' && afterSr.units === 0, 'maxSR PASS on already 0');
}

// August counterfactual: the 24 maxSR<1 remaining sub-4u would mute; ≥1 hold
{
  const samples = [
    { u: 1, sr: 0.13, mute: true },
    { u: 3, sr: 0.91, mute: true },
    { u: 1, sr: 1.79, mute: false },
    { u: 3, sr: 1.31, mute: false },
    { u: 4, sr: 0.15, mute: false }, // 4u fence
    { u: 5.06, sr: 0.21, mute: false },
  ];
  for (const s of samples) {
    const r = mute({ units: s.u, maxSR: s.sr });
    if (s.mute) {
      ok(r.action === 'MUTE' && r.units === 0, `sample mute ${s.u}u sr=${s.sr}`);
    } else {
      ok(r.units === s.u && r.action !== 'MUTE', `sample keep ${s.u}u sr=${s.sr}`);
    }
  }
}

console.log(`OK — ${n} assertions`);
