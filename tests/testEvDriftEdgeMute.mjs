/**
 * Ev-drift × EDGE mute (2026-08-26+).
 * Absolute-last post-created mute: any path.
 * CUT if EDGE≥15 AND dEv≤−1.5 AND currentEv < −1.
 * HOLD / fail-open when EDGE or Ev endpoints missing — never invents.
 * Still-+EV tickets that merely drifted down from a great open HOLD.
 * Usage: node tests/testEvDriftEdgeMute.mjs
 */
import assert from 'assert';
import {
  applyEvDriftEdgeMuteOverlay,
  applyTopCrowdedConvictionMuteOverlay,
  isEvDriftEdgeMuteLive,
  EV_DRIFT_EDGE_MUTE_FROM,
  EV_DRIFT_EDGE_MUTED_BY,
  EV_DRIFT_EDGE_MIN,
  EV_DRIFT_DEV_MAX,
  EV_DRIFT_CURRENT_MAX,
} from '../src/lib/walletClvSkill.js';
import {
  resolveTicketEvDrift,
  cleanTapeEvPct,
} from '../src/lib/ticketTapeCapture.js';

let n = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  n++;
}

function mute(args) {
  return applyEvDriftEdgeMuteOverlay({ pickDate: '2026-08-26', ...args });
}

ok(isEvDriftEdgeMuteLive('2026-08-26'), 'live on cutover');
ok(!isEvDriftEdgeMuteLive('2026-08-25'), 'not live before cutover');
ok(EV_DRIFT_EDGE_MUTE_FROM === '2026-08-26', 'cutover date');
ok(EV_DRIFT_EDGE_MIN === 15, 'EDGE thr');
ok(EV_DRIFT_DEV_MAX === -1.5, 'dEv thr');
ok(EV_DRIFT_CURRENT_MAX === -1, 'currentEv thr');
ok(EV_DRIFT_EDGE_MUTED_BY === 'ev-drift-edge', 'mutedBy stamp');

// ── MUTE: EDGE≥15 ∧ dEv≤−1.5 ∧ currentEv < −1 ────────────────────────────
{
  const r = mute({
    units: 5.4, edge: 16, firstEv: 0.5, currentEv: -1.3, dEv: -1.8,
  });
  ok(r.action === 'MUTE' && r.units === 0, 'high-E drifted into −EV → mute');
  ok(r.mutedBy === EV_DRIFT_EDGE_MUTED_BY, 'ev-drift-edge stamp');
  ok(r.unitsPrePolicy === 5.4, 'preserves pre units');
  ok(r.reason === 'ev_drift_edge', 'reason');
}
{
  const r = mute({
    units: 5.4, edge: 15, firstEv: 1.0, currentEv: -1.01, // dEv ≈ -2.0
  });
  ok(r.action === 'MUTE' && r.units === 0, 'EDGE exactly 15 + current just under −1 → mute');
}
{
  const r = mute({
    units: 1.0, edge: 28, firstEv: 1.0, currentEv: -2.0, dEv: -3.0,
  });
  ok(r.action === 'MUTE' && r.units === 0, 'any path / small units still mute when EDGE hot');
}

// ── HOLD: below thr / missing / improved / still +EV ─────────────────────
function holdExact(args, expectU, msg) {
  const r = mute(args);
  ok(r.units === expectU, `${msg} units ${r.units} === ${expectU}`);
  ok(r.action === 'HOLD' || r.action === 'EXEMPT', `${msg} action ${r.action}`);
  ok(r.mutedBy == null, `${msg} no mutedBy`);
}

holdExact({
  units: 5.4, edge: 14.9, firstEv: 2, currentEv: -5, dEv: -7,
}, 5.4, 'EDGE just under 15 HOLD');
holdExact({
  units: 5.4, edge: 20, firstEv: 1, currentEv: -0.4, dEv: -1.4,
}, 5.4, 'dEv just above −1.5 HOLD');
holdExact({
  units: 5.4, edge: 22, firstEv: -1, currentEv: 1, dEv: 2,
}, 5.4, 'improved Ev HOLD');
holdExact({
  units: 5.4, edge: 30, firstEv: 12.2, currentEv: 9.5, dEv: -2.7,
}, 5.4, 'drifted but still +EV HOLD (SOC-style)');
holdExact({
  units: 5.4, edge: 20, firstEv: 2, currentEv: -1.0, dEv: -3.0,
}, 5.4, 'currentEv exactly −1 HOLD (strict <)');
holdExact({
  units: 5.4, edge: null, firstEv: 1, currentEv: -5, dEv: -6,
}, 5.4, 'missing EDGE fail-open');
holdExact({
  units: 5.4, edge: 20, firstEv: null, currentEv: -5, dEv: null,
}, 5.4, 'missing firstEv fail-open');
holdExact({
  units: 5.4, edge: 20, firstEv: 1, currentEv: null, dEv: null,
}, 5.4, 'missing currentEv fail-open');
holdExact({
  units: 2.03, edge: 8, firstEv: 0, currentEv: -3, dEv: -3,
}, 2.03, 'low-E identity exact');

{
  const r = applyEvDriftEdgeMuteOverlay({
    units: 5.4, edge: 20, firstEv: 1, currentEv: -5, dEv: -6,
    pickDate: '2026-08-25',
  });
  ok(r.action === 'EXEMPT' && r.units === 5.4, 'pre-cutover does not rewrite history');
}
{
  const r = mute({
    units: 0, edge: 20, firstEv: 1, currentEv: -5, dEv: -6,
  });
  ok(r.action === 'PASS' && r.units === 0, 'already 0u stays PASS');
}

// ── resolveTicketEvDrift helper ──────────────────────────────────────────
{
  const log = [
    { gate: 'first', evPct: 1.5, fair: -110 },
    { gate: 'hourly', evPct: 0.2, fair: -110 },
    { gate: 't15', evPct: -1.0, fair: -110 },
  ];
  const d = resolveTicketEvDrift(log, null);
  ok(d.firstEv === 1.5, 'first from gate');
  ok(d.currentEv === -1.0, 'current prefers t15');
  ok(d.dEv === -2.5, 'dEv first→t15');
}
{
  const log = [
    { gate: 'first', evPct: 0.5, fair: -110 },
    { gate: 'hourly', evPct: 0.1, fair: -110 },
  ];
  const d = resolveTicketEvDrift(log, { evPct: -1.2, fairOdds: -115 });
  ok(d.firstEv === 0.5 && d.currentEv === -1.2 && d.dEv === -1.7, 'live snap wins current');
}
{
  const log = [{ gate: 'first', evPct: 0, fair: 0 }];
  const d = resolveTicketEvDrift(log, { evPct: 5, fairOdds: 0 });
  ok(d.firstEv == null && d.currentEv == null && d.dEv == null, 'fair=0 sentinel → null');
}
{
  ok(cleanTapeEvPct(3.1, -113) === 3.1, 'clean ok');
  ok(cleanTapeEvPct(0, 0) == null, 'clean sentinel');
}

// ── Pipeline: topCrowded then evDrift — neither rescales keepers ─────────
{
  const afterCrowd = applyTopCrowdedConvictionMuteOverlay({
    units: 5.4, tier: 'SHARP', leadSR: 9, edge: 20, forRoiNormMean: 50,
    pickDate: '2026-08-26',
  });
  ok(afterCrowd.units === 5.4 && afterCrowd.action === 'EXEMPT', 'SHARP EXEMPT from topCrowded');
  const afterDrift = applyEvDriftEdgeMuteOverlay({
    units: afterCrowd.units,
    edge: 20,
    firstEv: 2.1,
    currentEv: -8.1,
    dEv: -10.2,
    pickDate: '2026-08-26',
  });
  ok(afterDrift.units === 0 && afterDrift.action === 'MUTE', 'evDrift mutes SHARP high-E');
  ok(afterDrift.mutedBy === EV_DRIFT_EDGE_MUTED_BY, 'ev-drift mutedBy');
}
{
  const afterCrowd = applyTopCrowdedConvictionMuteOverlay({
    units: 5.4, tier: 'TOP', leadSR: 1.5, edge: 16, forRoiNormMean: 20,
    pickDate: '2026-08-26',
  });
  ok(afterCrowd.units === 5.4 && afterCrowd.action === 'HOLD', 'clean TOP keep');
  const afterDrift = applyEvDriftEdgeMuteOverlay({
    units: afterCrowd.units,
    edge: 16,
    firstEv: 0.5,
    currentEv: 0.4,
    dEv: -0.1,
    pickDate: '2026-08-26',
  });
  ok(afterDrift.units === 5.4 && afterDrift.action === 'HOLD', 'flat drift keep exact 5.4');
}

console.log(`ok — ${n} assertions (Ev-drift × EDGE mute)`);
