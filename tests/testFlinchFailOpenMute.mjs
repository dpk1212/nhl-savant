/**
 * Flinch / fail-open leftover mute (2026-08-19+).
 * Must 0u the two leftover classes and HOLD every other ticket at exact units.
 * Usage: node tests/testFlinchFailOpenMute.mjs
 */
import assert from 'assert';
import { readFileSync, existsSync } from 'fs';
import {
  applyFlinchFailOpenMuteOverlay,
  applyConfirmedUnoppUnitFloor,
  isFlinchFailOpenMuteLive,
  FLINCH_FAIL_OPEN_MUTE_FROM,
  FLINCH_MUTED_BY,
  FAIL_OPEN_SUB4_MUTED_BY,
  CONFIRMED_UNOPP_UNITS,
} from '../src/lib/walletClvSkill.js';

let n = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  n++;
}

function mute(args) {
  return applyFlinchFailOpenMuteOverlay({ pickDate: '2026-08-19', ...args });
}

ok(isFlinchFailOpenMuteLive('2026-08-19'), 'live on cutover');
ok(!isFlinchFailOpenMuteLive('2026-08-18'), 'not live before cutover');
ok(FLINCH_FAIL_OPEN_MUTE_FROM === '2026-08-19', 'cutover date');

// ── MUTE: believed-then-cut (August shapes) ──────────────────────────────
{
  const r = mute({ units: 2.5, odds: 146, edge: 3, tapeAction: 'HOLD', tier: 'RANK' });
  ok(r.action === 'MUTE' && r.units === 0, 'RANK +146 2.5u HOLD → mute');
  ok(r.mutedBy === FLINCH_MUTED_BY, 'believed-cut stamp');
  ok(r.unitsPrePolicy === 2.5, 'preserves pre units');
  ok(r.reason.includes('odds_capped_native4'), 'native4 plus-money flag');
}
{
  const r = mute({ units: 2, odds: 240, edge: 7.7, tapeAction: 'HOLD', tier: 'RANK' });
  ok(r.action === 'MUTE' && r.units === 0, 'RANK +240 2u (not exact cap step) → mute');
}
{
  const r = mute({ units: 1, odds: 251, edge: 23.8, tapeAction: 'BOOST', tier: 'SHARP' });
  ok(r.action === 'MUTE' && r.units === 0, 'SHARP +251 1u BOOST E≥10 → mute');
  ok(r.mutedBy === FLINCH_MUTED_BY, 'BOOST leftover is believed-cut not FO');
}
{
  const r = mute({ units: 2.5, odds: 122, edge: 12.3, tapeAction: 'HOLD', tier: 'SHARP-LEAN' });
  ok(r.action === 'MUTE' && r.units === 0, 'SHARP-LEAN E≥10 still <4 → mute');
}
{
  const r = mute({ units: 3, odds: -111, edge: 10.4, tapeAction: 'BOOST', tier: 'SHARP' });
  ok(r.action === 'MUTE' && r.units === 0, 'SHARP −111 3u BOOST leftover → mute');
}
{
  const r = mute({ units: 2.5, odds: 132, edge: 7.1, tapeAction: 'HOLD', tier: 'TOP' });
  ok(r.action === 'MUTE' && r.units === 0, 'TOP +132 2.5u odds-cap → mute');
}
{
  const r = mute({ units: 1, odds: -249, edge: 4.4, tapeAction: 'BOOST', tier: 'SHARP-LEAN' });
  ok(r.action === 'MUTE' && r.units === 0, 'BOOST then E-band 1u leftover → mute');
}
{
  const r = mute({ units: 1.5, odds: 170, edge: -4.1, tapeAction: 'BOOST', tier: 'CONFIRMED-Q1' });
  ok(r.action === 'MUTE' && r.units === 0, 'Q1 BOOST leftover → mute');
}
{
  const r = mute({ units: 1, odds: 120, edge: -6.2, tapeAction: 'BOOST', tier: 'CONFIRMED-UNOPP' });
  ok(r.action === 'MUTE' && r.units === 0, 'UNOPP +120 BOOST leftover → mute');
}

// ── MUTE: sub-4 FAIL_OPEN ────────────────────────────────────────────────
{
  const r = mute({ units: 1, odds: 122, edge: null, tapeAction: 'FAIL_OPEN', tier: 'DISSENT' });
  ok(r.action === 'MUTE' && r.units === 0, 'DISSENT 1u FAIL_OPEN → mute');
  ok(r.mutedBy === FAIL_OPEN_SUB4_MUTED_BY, 'fail-open-sub4 stamp');
}
{
  const r = mute({ units: 3, odds: -120, edge: null, tapeAction: 'FAIL_OPEN', tier: 'CONFIRMED-Q1' });
  ok(r.action === 'MUTE' && r.units === 0, 'Q1 3u FAIL_OPEN → mute');
}
{
  const r = mute({ units: 1.5, odds: 113, edge: null, tapeAction: 'fail-open', tier: 'SHARP-LEAN' });
  ok(r.action === 'MUTE' && r.units === 0, 'normalizes fail-open spelling');
}

// ── HOLD / EXEMPT: rest of the book (identity) ───────────────────────────
function holdExact(args, expectU, msg) {
  const r = mute(args);
  ok(r.units === expectU, `${msg} units ${r.units} === ${expectU}`);
  ok(r.action === 'HOLD' || r.action === 'EXEMPT', `${msg} action ${r.action}`);
  ok(r.mutedBy == null, `${msg} no mutedBy`);
}

holdExact(
  { units: 3, odds: -112, edge: 4.4, tapeAction: 'HOLD', tier: 'RANK' },
  3, 'RANK 3u favorite HOLD E<10',
);
holdExact(
  { units: 3, odds: -186, edge: 4.7, tapeAction: 'HOLD', tier: 'RANK' },
  3, 'RANK 3u heavy fav (EDGE band leftover, not odds-cap)',
);
holdExact(
  { units: 3, odds: 114, edge: 0.2, tapeAction: 'HOLD', tier: 'RANK' },
  3, 'RANK +114 (≤+120) not odds-capped',
);
holdExact(
  { units: 1, odds: -110, edge: -0.5, tapeAction: 'HOLD', tier: 'TOP' },
  1, 'TOP 1u favorite without BOOST/E10',
);
holdExact(
  { units: 1, odds: -103, edge: 2, tapeAction: 'HOLD', tier: 'DISSENT' },
  1, 'DISSENT with scored tape (not FAIL_OPEN)',
);
holdExact(
  { units: 1, odds: -110, edge: null, tapeAction: 'HOLD', tier: 'CONFIRMED-UNOPP' },
  1, 'naturally small UNOPP HOLD',
);
holdExact(
  { units: 1.5, odds: -102, edge: 5, tapeAction: 'HOLD', tier: 'SHARP-LEAN' },
  1.5, 'SHARP-LEAN 1.5u HOLD E<10',
);
holdExact(
  { units: 3, odds: -111, edge: 5.2, tapeAction: 'HOLD', tier: 'SHARP' },
  3, 'unboosted SHARP 3u E<10',
);
holdExact(
  { units: 3, odds: -113, edge: 3.3, tapeAction: 'HOLD', tier: 'MINI-' },
  3, 'MINI- not native-4u',
);

{
  const r = mute({ units: 4, odds: 146, edge: 20, tapeAction: 'BOOST', tier: 'RANK' });
  ok(r.action === 'EXEMPT' && r.units === 4, '4u+ BOOST never muted');
  ok(r.reason === 'units_ge_4', '4u fence');
}
{
  const r = mute({ units: 5.4, odds: -170, edge: 19, tapeAction: 'BOOST', tier: 'SHARP-LEAN' });
  ok(r.action === 'EXEMPT' && r.units === 5.4, 'BOOST that landed ≥4u never muted');
}
{
  const r = mute({ units: 4, odds: -215, edge: null, tapeAction: 'FAIL_OPEN', tier: 'TOP' });
  ok(r.action === 'EXEMPT' && r.units === 4, 'FAIL_OPEN TOP 4u never muted');
}
{
  const r = mute({ units: 6, odds: -110, edge: 25, tapeAction: 'BOOST', tier: 'SUPER' });
  ok(r.action === 'EXEMPT' && r.units === 6, 'SUPER 6u never muted');
}
{
  const r = applyFlinchFailOpenMuteOverlay({
    units: 2.5, odds: 146, edge: 3, tapeAction: 'HOLD', tier: 'RANK', pickDate: '2026-08-18',
  });
  ok(r.action === 'EXEMPT' && r.units === 2.5, 'pre-cutover does not rewrite history');
}
{
  const r = mute({ units: 0, odds: 146, tapeAction: 'HOLD', tier: 'RANK' });
  ok(r.action === 'PASS' && r.units === 0, 'already 0u stays PASS');
}

// Identity: HOLD must not round or rescale
{
  const r = mute({ units: 2.03, odds: -105, edge: 4, tapeAction: 'HOLD', tier: 'SHARP' });
  ok(r.units === 2.03 && r.action === 'HOLD', 'exact unit identity on HOLD');
}

// Q1/UNOPP restore then mute — floor cannot revive a leftover stub
{
  const oddsCapFn = (u) => u;
  const restored = applyConfirmedUnoppUnitFloor({
    units: 0,
    odds: 120,
    unoppResult: { qualifies: true },
    oddsCapFn,
  });
  ok(restored.floored && restored.units === CONFIRMED_UNOPP_UNITS, 'UNOPP floor restores 1u');
  const after = mute({
    units: restored.units, odds: 120, edge: -6.2, tapeAction: 'BOOST', tier: 'CONFIRMED-UNOPP',
  });
  ok(after.action === 'MUTE' && after.units === 0, 'BOOST UNOPP still muted after floor');
}
{
  const oddsCapFn = (u) => u;
  const restored = applyConfirmedUnoppUnitFloor({
    units: 0,
    odds: -110,
    unoppResult: { qualifies: true },
    oddsCapFn,
  });
  const after = mute({
    units: restored.units, odds: -110, edge: -5, tapeAction: 'HOLD', tier: 'CONFIRMED-UNOPP',
  });
  ok(after.action === 'HOLD' && after.units === 1, 'natural UNOPP HOLD survives after floor');
}

console.log(`OK — ${n} assertions`);

// Optional: replay reconstructed August live book if the audit dump is present.
const AUG_DUMP = '/opt/cursor/artifacts/august_staked_picks.json';
if (existsSync(AUG_DUMP)) {
  const aug = JSON.parse(readFileSync(AUG_DUMP, 'utf8'));
  const NATIVE4 = new Set(['SUPER', 'TOP', 'TOP+', 'RANK']);
  function wasMuteTarget(p) {
    if (!(p.units < 4)) return false;
    const act = String(p.tapeAct || '').toUpperCase().replace(/-/g, '_');
    if (act === 'FAIL_OPEN') return true;
    if (p.oddsCappedLikely) return true;
    if (NATIVE4.has(p.path) && p.odds > 120) return true;
    if (act === 'BOOST') return true;
    if (p.edge != null && p.edge >= 10) return true;
    return false;
  }
  let muted = 0;
  let held = 0;
  for (const p of aug) {
    const r = mute({
      units: p.units,
      odds: p.odds,
      edge: p.edge,
      tapeAction: p.tapeAct,
      tier: p.path,
    });
    const wantMute = wasMuteTarget(p);
    if (wantMute) {
      ok(r.action === 'MUTE' && r.units === 0, `Aug mute ${p.date} ${p.pick} ${p.units}u`);
      muted++;
    } else {
      ok(r.units === p.units, `Aug identity ${p.date} ${p.pick} ${p.units}u stayed ${r.units}`);
      ok(r.action !== 'MUTE', `Aug not muted ${p.date} ${p.pick}`);
      held++;
    }
  }
  ok(muted === 39, `August mute pile is 39 (got ${muted})`);
  ok(held === 182 - 39, `August keepers 143 (got ${held})`);
  console.log(`OK — August replay muted=${muted} held=${held}`);
}
