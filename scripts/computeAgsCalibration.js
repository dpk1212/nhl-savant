// computeAgsCalibration — daily job that refreshes the AGS-Unified v9
// calibration doc.
//
// Output: Firestore doc `agsCalibration/current` with shape:
//   {
//     normalizers: { dCount: { mean, sd }, dHcCount: { mean, sd }, ... },
//     quintiles: { q20, q40, q50, q60, q80, q90 },
//     thresholds: { hardMuteFloor (=q20), lockFloor (=q60),
//                   premiumFloor (=q80), eliteFloor (=q90) },
//     sampleSize: <int>,
//     dateRange: { from: 'YYYY-MM-DD', to: 'YYYY-MM-DD' },
//     computedAt: ISO timestamp,
//     source: 'cron'
//   }
//
// Read by both scripts/syncPickStateAuthoritative.js and src/pages/SharpFlow.jsx
// to drive AGS-U scoring of live picks. Falls back to AGS_FALLBACK_CALIBRATION
// in src/lib/ags.js when this doc is unavailable.
//
// Sample = V6 cutover (2026-04-18+), dashboard-truth filter (peakStars ≥ 2.5
// ∧ ¬SHADOW ∧ ¬MUTED ∧ ¬CANCELLED ∧ ¬superseded), graded picks only,
// whitelist-filtered aggregates with HC subset (CONFIRMED tier ∧ sizeRatio
// ≥ 1.5×). The 5 v9 features are computed by aggregateSideProven in
// src/lib/ags.js — keep that file as the single source of truth.
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import {
  AGS_FEATURES,
  AGS_ABSOLUTE_MUTE_FLOOR,
  aggregateSideProven,
} from '../src/lib/ags.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');

if (!admin.apps.length) {
  const sakPath = join(REPO_ROOT, 'serviceAccountKey.json');
  if (existsSync(sakPath)) {
    admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(sakPath, 'utf8'))) });
  } else {
    admin.initializeApp({
      credential: admin.credential.cert({
        project_id: process.env.VITE_FIREBASE_PROJECT_ID,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
}
const db = admin.firestore();

const V6_CUTOVER = '2026-04-18';
const PICK_COLS = [
  ['sharpFlowPicks', 'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals', 'TOTAL'],
];

const DRY_RUN = process.env.DRY_RUN === '1';

// ── Wallet tier map ────────────────────────────────────────────────────────
async function loadWalletTiers() {
  const tiers = new Map(); // walletShort → { sport → tier }
  const snap = await db.collection('sharpWalletProfiles').get();
  for (const d of snap.docs) {
    const p = d.data();
    if (!p?.bySport) continue;
    const map = {};
    for (const [sport, rec] of Object.entries(p.bySport)) {
      if (rec?.whitelistTier) map[sport] = rec.whitelistTier;
    }
    tiers.set(d.id, map);
  }
  return tiers;
}

function buildIsProvenFn(tiers) {
  return (walletShort, sport) => {
    if (!walletShort) return false;
    const t = tiers.get(walletShort)?.[sport];
    return t === 'CONFIRMED' || t === 'FLAT';
  };
}

// HC eligibility — CONFIRMED tier only (stricter than isProven). The
// HC_RATIO sizeRatio threshold is enforced inside aggregateSideProven.
function buildIsHcEligibleFn(tiers) {
  return (walletShort, sport) => {
    if (!walletShort) return false;
    const t = tiers.get(walletShort)?.[sport];
    return t === 'CONFIRMED';
  };
}

// ── Sample loader ──────────────────────────────────────────────────────────
// V6 cutover universe with full feature stack (walletDetails + outcome).
// Includes BOTH SHIPPED and SHADOW picks — the AGS-U calibration must reflect
// the full distribution the model will score against, not just the picks the
// (now-retired) matrix happened to publish. Verified empirically: SHADOW
// picks are 55% WR vs SHIPPED 50% WR (the matrix was over-filtering winners
// out of the calibration), so excluding them biased q-thresholds upward.
async function loadHistoricalAggregates(isProvenFn, isHcEligibleFn) {
  const aggs = [];
  let dateMin = null, dateMax = null;
  let counts = { graded: 0, withDetails: 0, kept: 0 };

  for (const [col] of PICK_COLS) {
    const snap = await db.collection(col).where('date', '>=', V6_CUTOVER).get();
    for (const doc of snap.docs) {
      const d = doc.data();
      const sides = d.sides || {};
      const sport = d.sport || 'UNK';
      const date = d.date;
      for (const [sideKey, side] of Object.entries(sides)) {
        const oc = side?.result?.outcome;
        if (oc !== 'WIN' && oc !== 'LOSS' && oc !== 'PUSH') continue;
        counts.graded += 1;

        const peak = side.peak || side.lock || {};
        const wd = peak?.v8Scoring?.walletDetails;
        if (!Array.isArray(wd) || wd.length === 0) continue;
        counts.withDetails += 1;

        const agg = aggregateSideProven(wd, sideKey, sport, isProvenFn, isHcEligibleFn);
        if (!agg || (agg.forCount + agg.agCount) === 0) continue;
        counts.kept += 1;

        if (date) {
          if (!dateMin || date < dateMin) dateMin = date;
          if (!dateMax || date > dateMax) dateMax = date;
        }
        aggs.push(agg);
      }
    }
  }
  return { aggs, dateMin, dateMax, counts };
}

// ── Stats helpers ──────────────────────────────────────────────────────────
function meanSd(values) {
  const n = values.length;
  if (!n) return { mean: 0, sd: 1, n: 0 };
  const m = values.reduce((a, b) => a + b, 0) / n;
  const v = values.reduce((a, b) => a + (b - m) ** 2, 0) / Math.max(1, n - 1);
  const sd = Math.sqrt(v) || 1;
  return { mean: m, sd, n };
}

function quantile(sortedArr, p) {
  if (!sortedArr.length) return 0;
  const idx = Math.max(0, Math.min(sortedArr.length - 1, Math.floor(p * (sortedArr.length - 1))));
  return sortedArr[idx];
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  const startedAt = Date.now();
  console.log(`[ags-calibration] starting${DRY_RUN ? ' (DRY_RUN)' : ''}`);

  console.log('[ags-calibration] loading wallet tiers…');
  const tiers = await loadWalletTiers();
  const isProvenFn = buildIsProvenFn(tiers);
  const isHcEligibleFn = buildIsHcEligibleFn(tiers);
  console.log(`[ags-calibration]   tier map: ${tiers.size} wallets with profile records`);

  console.log('[ags-calibration] loading historical sample (V6 cutover, full universe, graded)…');
  const { aggs, dateMin, dateMax, counts } = await loadHistoricalAggregates(isProvenFn, isHcEligibleFn);
  console.log(`[ags-calibration]   counts: graded=${counts.graded}  withDetails=${counts.withDetails}  kept=${counts.kept}`);
  console.log(`[ags-calibration]   date range: ${dateMin} → ${dateMax}`);

  if (aggs.length < 30) {
    console.error(`[ags-calibration] sample too small (N=${aggs.length}). Refusing to overwrite calibration.`);
    process.exit(1);
  }

  // 1. Normalizers (mean, sd) per AGS feature.
  const normalizers = {};
  for (const f of AGS_FEATURES) {
    const xs = aggs.map(a => Number(a[f.key] || 0));
    const { mean, sd, n } = meanSd(xs);
    normalizers[f.key] = { mean, sd };
    console.log(`[ags-calibration]   ${f.key.padEnd(18)} mean=${mean.toFixed(3)}  sd=${sd.toFixed(3)}  n=${n}`);
  }

  // 2. Compute AGS for every historical row using the new normalizers,
  //    then derive quintile boundaries.
  const agsValues = aggs.map(a => {
    let total = 0;
    for (const f of AGS_FEATURES) {
      const { mean, sd } = normalizers[f.key];
      if (!Number.isFinite(mean) || !Number.isFinite(sd) || sd === 0) continue;
      total += f.sign * ((Number(a[f.key] || 0) - mean) / sd);
    }
    return total;
  }).sort((a, b) => a - b);

  const quintiles = {
    q20: quantile(agsValues, 0.20),
    q40: quantile(agsValues, 0.40),
    q50: quantile(agsValues, 0.50),
    q60: quantile(agsValues, 0.60),
    q80: quantile(agsValues, 0.80),
    q90: quantile(agsValues, 0.90),
  };
  console.log(`[ags-calibration]   quintiles:  q20=${quintiles.q20.toFixed(2)} (HARD MUTE floor)  q40=${quintiles.q40.toFixed(2)} (LEAN 0.50×)  q60=${quintiles.q60.toFixed(2)} (LOCK 1.10×)  q80=${quintiles.q80.toFixed(2)} (PREMIUM 1.50×)  q90=${quintiles.q90.toFixed(2)} (ELITE 2.00×)`);

  // 3. Build the v9 calibration doc. The four threshold values are the
  //    bands that drive every action — there is no separate gate logic.
  //    AGS-U values below q20 are HARD MUTED (size = 0). Values between
  //    q20 and q60 ship at reduced size (LEAN/WEAK). Values ≥ q60 lock
  //    at full or boosted units. `AGS_ABSOLUTE_MUTE_FLOOR` is exported
  //    from src/lib/ags.js as a safety bound — q20 can never permit a
  //    pick below it to ship even on a pathological calibration.
  const doc = {
    normalizers,
    quintiles,
    thresholds: {
      hardMuteFloor: Math.max(quintiles.q20, AGS_ABSOLUTE_MUTE_FLOOR),
      lockFloor:     quintiles.q60,
      premiumFloor:  quintiles.q80,
      eliteFloor:    quintiles.q90,
    },
    sampleSize: aggs.length,
    dateRange: { from: dateMin, to: dateMax },
    computedAt: new Date().toISOString(),
    durationMs: Date.now() - startedAt,
    source: 'cron',
    schemaVersion: 'ags-unified-v9',
  };

  if (DRY_RUN) {
    console.log('[ags-calibration] DRY_RUN — would write:');
    console.log(JSON.stringify(doc, null, 2));
  } else {
    await db.collection('agsCalibration').doc('current').set(doc, { merge: false });
    // Append a dated history doc for drift tracking.
    const histId = (dateMax || new Date().toISOString().slice(0, 10));
    await db.collection('agsCalibration').doc(`history-${histId}`).set(doc, { merge: false });
    console.log(`[ags-calibration] wrote agsCalibration/current  (also history-${histId})  N=${aggs.length}  durationMs=${Date.now() - startedAt}`);
  }
}

main().then(() => process.exit(0)).catch(e => {
  console.error('[ags-calibration] FAILED', e);
  process.exit(1);
});
