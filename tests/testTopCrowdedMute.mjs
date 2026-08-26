/**
 * TOP crowded-conviction mute (2026-08-26+).
 * Absolute-last post-created mute: TOP/TOP+ only.
 * CUT if leadSR≥3 OR EDGE<10 OR (roiNorm≥42 ∧ leadSR≥2).
 * HOLD identity on every other ticket — never resizes/repaths.
 * Usage: node tests/testTopCrowdedMute.mjs
 */
import assert from 'assert';
import {
  applyTopCrowdedConvictionMuteOverlay,
  applyNoConfirmedMuteOverlay,
  leadForSizeRatio,
  meanForRoiNorm,
  isTopCrowdedMuteLive,
  TOP_CROWDED_MUTE_FROM,
  TOP_CROWDED_MUTED_BY,
  TOP_CROWDED_LEAD_SR_WHALE,
  TOP_CROWDED_EDGE_MIN,
  TOP_CROWDED_ROINORM_THR,
  TOP_CROWDED_LEAD_SR_A2,
} from '../src/lib/walletClvSkill.js';

let n = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  n++;
}

function mute(args) {
  return applyTopCrowdedConvictionMuteOverlay({ pickDate: '2026-08-26', ...args });
}

ok(isTopCrowdedMuteLive('2026-08-26'), 'live on cutover');
ok(!isTopCrowdedMuteLive('2026-08-25'), 'not live before cutover');
ok(TOP_CROWDED_MUTE_FROM === '2026-08-26', 'cutover date');
ok(TOP_CROWDED_LEAD_SR_WHALE === 3, 'whale thr');
ok(TOP_CROWDED_EDGE_MIN === 10, 'edge thr');
ok(TOP_CROWDED_ROINORM_THR === 42, 'roiNorm thr');
ok(TOP_CROWDED_LEAD_SR_A2 === 2, 'A2 leadSR thr');

// ── MUTE: A ∪ A2 clauses ─────────────────────────────────────────────────
{
  const r = mute({
    units: 5.4, tier: 'TOP', leadSR: 3.2, edge: 15, forRoiNormMean: 20,
  });
  ok(r.action === 'MUTE' && r.units === 0, 'whale leadSR≥3 → mute');
  ok(r.mutedBy === TOP_CROWDED_MUTED_BY, 'top-crowded stamp');
  ok(r.unitsPrePolicy === 5.4, 'preserves pre units');
  ok(r.clauses.includes('whale_leadsr'), 'whale clause');
  ok(r.reason.includes('whale_leadsr'), 'reason names clause');
}
{
  const r = mute({
    units: 4, tier: 'TOP+', leadSR: 1.1, edge: 8.5, forRoiNormMean: 10,
  });
  ok(r.action === 'MUTE' && r.units === 0, 'soft EDGE<10 → mute');
  ok(r.clauses.includes('soft_edge'), 'soft_edge clause');
}
{
  const r = mute({
    units: 5, tier: 'TOP', leadSR: 2.1, edge: 12, forRoiNormMean: 45,
  });
  ok(r.action === 'MUTE' && r.units === 0, 'sharp trap roiNorm≥42∧leadSR≥2 → mute');
  ok(r.clauses.includes('sharp_trap'), 'sharp_trap clause');
}
{
  const r = mute({
    units: 5.4, tier: 'TOP', leadSR: 3.5, edge: 7, forRoiNormMean: 50,
  });
  ok(r.action === 'MUTE' && r.units === 0, 'all three clauses can fire together');
  ok(r.clauses.length === 3, 'three clauses');
}

// ── HOLD / EXEMPT: rest of the book (identity — no other math) ───────────
function holdExact(args, expectU, msg) {
  const r = mute(args);
  ok(r.units === expectU, `${msg} units ${r.units} === ${expectU}`);
  ok(r.action === 'HOLD' || r.action === 'EXEMPT', `${msg} action ${r.action}`);
  ok(r.mutedBy == null, `${msg} no mutedBy`);
}

// Clean TOP keep — none of the three clauses
holdExact({
  units: 5.4, tier: 'TOP', leadSR: 1.8, edge: 14, forRoiNormMean: 30,
}, 5.4, 'clean TOP keep');
holdExact({
  units: 4, tier: 'TOP+', leadSR: 1.5, edge: 10, forRoiNormMean: 41,
}, 4, 'EDGE exactly 10 HOLD (strict <)');
holdExact({
  units: 5, tier: 'TOP', leadSR: 2.9, edge: 11, forRoiNormMean: 41.9,
}, 5, 'below all thr HOLD');
holdExact({
  units: 5.4, tier: 'TOP', leadSR: 2.5, edge: 12, forRoiNormMean: null,
}, 5.4, 'missing roiNorm → A2 does not invent');
holdExact({
  units: 5.4, tier: 'TOP', leadSR: null, edge: 12, forRoiNormMean: 50,
}, 5.4, 'missing leadSR → whale/A2 do not invent');
holdExact({
  units: 5.4, tier: 'TOP', leadSR: 2.5, edge: null, forRoiNormMean: 30,
}, 5.4, 'missing EDGE → soft clause does not invent');

// Non-TOP tiers EXEMPT with exact unit identity
holdExact({
  units: 3, tier: 'RANK', leadSR: 9, edge: 1, forRoiNormMean: 99,
}, 3, 'RANK never muted');
holdExact({
  units: 2.03, tier: 'BOOST', leadSR: 5, edge: 2, forRoiNormMean: 80,
}, 2.03, 'BOOST exact identity');
holdExact({
  units: 1.13, tier: 'LEAN', leadSR: 4, edge: 0, forRoiNormMean: 90,
}, 1.13, 'LEAN exact identity');
holdExact({
  units: 5.4, tier: null, leadSR: 9, edge: 1, forRoiNormMean: 99,
}, 5.4, 'null tier EXEMPT');

{
  const r = applyTopCrowdedConvictionMuteOverlay({
    units: 5.4, tier: 'TOP', leadSR: 4, edge: 5, forRoiNormMean: 50,
    pickDate: '2026-08-25',
  });
  ok(r.action === 'EXEMPT' && r.units === 5.4, 'pre-cutover does not rewrite history');
}
{
  const r = mute({
    units: 0, tier: 'TOP', leadSR: 4, edge: 5, forRoiNormMean: 50,
  });
  ok(r.action === 'PASS' && r.units === 0, 'already 0u stays PASS');
}

// ── Helpers: leadForSizeRatio / meanForRoiNorm ───────────────────────────
{
  const wd = [
    { side: 'home', sizeRatio: 0.8, invested: 100, roiNorm: 20 },
    { side: 'home', sizeRatio: 2.1, invested: 500, roiNorm: 40 },
    { side: 'home', sizeRatio: 1.6, invested: 200, roiNorm: 50 },
    { side: 'away', sizeRatio: 9.0, invested: 999, roiNorm: 99 },
  ];
  ok(leadForSizeRatio(wd, 'home') === 2.1, 'HC-band lead prefers max ≥1.5');
  ok(Math.abs(meanForRoiNorm(wd, 'home') - (20 + 40 + 50) / 3) < 1e-9, 'mean roiNorm FOR');
  ok(leadForSizeRatio(wd, 'draw') == null, 'missing side null');
}
{
  const wd = [
    { side: 'home', sizeRatio: 0.4, invested: 10, roiNorm: 10 },
    { side: 'home', sizeRatio: 1.2, invested: 50, roiNorm: 30 },
  ];
  ok(leadForSizeRatio(wd, 'home') === 1.2, 'fallback max when no HC-band');
}
{
  const wd = [
    { side: 'home', direction: 'FOR', sizeRatio: 2.5, roiNorm: 40 },
    { side: 'home', direction: 'AG', sizeRatio: 9.0, roiNorm: 99 },
  ];
  ok(leadForSizeRatio(wd, 'home') === 2.5, 'AG direction excluded');
  ok(meanForRoiNorm(wd, 'home') === 40, 'AG roiNorm excluded');
}
{
  const wd = { a: { side: 'over', sizeRatio: 1.8, roiNorm: 22 }, b: { side: 'over', sizeRatio: 2.2, roiNorm: 44 } };
  ok(leadForSizeRatio(wd, 'over') === 2.2, 'object map of walletDetails');
  ok(Math.abs(meanForRoiNorm(wd, 'over') - 33) < 1e-9, 'object map mean');
}

// ── Pipeline: noConfirmed then topCrowded — neither rescales keepers ─────
{
  const afterNoConf = applyNoConfirmedMuteOverlay({
    units: 5.4, nConfirmed: 2, pickDate: '2026-08-26',
  });
  ok(afterNoConf.units === 5.4 && afterNoConf.action === 'HOLD', 'noConf HOLD 5.4u');
  const afterCrowd = applyTopCrowdedConvictionMuteOverlay({
    units: afterNoConf.units,
    tier: 'TOP',
    leadSR: 1.7,
    edge: 13,
    forRoiNormMean: 28,
    pickDate: '2026-08-26',
  });
  ok(afterCrowd.units === 5.4 && afterCrowd.action === 'HOLD', 'clean TOP keep exact after chain');
}
{
  const afterNoConf = applyNoConfirmedMuteOverlay({
    units: 5.4, nConfirmed: 1, pickDate: '2026-08-26',
  });
  const afterCrowd = applyTopCrowdedConvictionMuteOverlay({
    units: afterNoConf.units,
    tier: 'BOOST',
    leadSR: 9,
    edge: 1,
    forRoiNormMean: 99,
    pickDate: '2026-08-26',
  });
  ok(afterCrowd.units === 5.4 && afterCrowd.action === 'EXEMPT', 'BOOST identity through chain');
}
{
  // RANK ticket with whale SR — topCrowded must not touch
  const r = mute({
    units: 2.03, tier: 'RANK', leadSR: 8, edge: 3, forRoiNormMean: 70,
  });
  ok(r.units === 2.03 && r.action === 'EXEMPT', 'RANK whale SR untouched');
}

console.log(`ok — ${n} assertions (TOP crowded-conviction mute)`);
