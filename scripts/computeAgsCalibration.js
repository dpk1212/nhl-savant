// computeAgsCalibration — daily job that refreshes the AGS-Unified v11
// calibration doc.
//
// Output: Firestore doc `agsCalibration/current` with shape:
//   {
//     normalizers: { dCount: { mean, sd }, dHcSizeRatio: { mean, sd },
//                    dSumRankNorm: { mean, sd }, dWinnerCtPreA: { mean, sd } },
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
// Sample = V6 cutover (2026-04-18+), graded picks only, whitelist-filtered
// aggregates with HC subset (CONFIRMED tier ∧ sizeRatio ≥ 1.5×). The 4 v11
// features are computed by aggregateSideProven in src/lib/ags.js — keep that
// file as the single source of truth.
//
// v11 — dWinnerCtPreA requires walletStatsFn (top-level profile.picks lookup);
// this job now passes that through aggregateSideProven for parity with the
// live cron/UI scoring path.
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import {
  AGS_FEATURES,
  AGS_WEIGHTS,
  AGS_ABSOLUTE_MUTE_FLOOR,
  aggregateSideProven,
  aggregateSideV12,
  agsV12ScoreFromQualities,
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

// ── Wallet tier + top-level pick aggregate map ──────────────────────────────
// v11 — we now also persist `walletPicksAgg` (the top-level `profile.picks`
// block) so the dWinnerCtPreA feature can resolve at calibration time.
async function loadWalletData() {
  const tiers = new Map();          // walletShort → { sport → tier }
  const walletPicksAgg = new Map(); // walletShort → { picksN, picksFlatRoi } (top-level any-sport)
  // v12: per-sport prior stats { tier, priorN, priorRoi }. Built from
  // profile.bySport[sport].picks (n + flatRoi) and bySport[sport].whitelistTier.
  const walletPriorBySport = new Map(); // walletShort → { sport → { tier, priorN, priorRoi } }
  const snap = await db.collection('sharpWalletProfiles').get();
  for (const d of snap.docs) {
    const p = d.data();
    if (!p?.bySport) continue;
    const tierMap = {};
    const priorMap = {};
    for (const [sport, rec] of Object.entries(p.bySport)) {
      if (rec?.whitelistTier) tierMap[sport] = rec.whitelistTier;
      priorMap[sport] = {
        tier: rec?.whitelistTier || null,
        priorN: Number(rec?.picks?.n) || 0,
        priorRoi: Number(rec?.picks?.flatRoi) || 0,
      };
    }
    tiers.set(d.id, tierMap);
    walletPriorBySport.set(d.id, priorMap);
    if (p.picks) {
      walletPicksAgg.set(d.id, {
        picksN: Number(p.picks.n) || 0,
        picksFlatRoi: Number(p.picks.flatRoi) || 0,
      });
    }
  }
  return { tiers, walletPicksAgg, walletPriorBySport };
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

// v11 — wallet's top-level profile.picks aggregate at scoring time. Drives
// the dWinnerCtPreA feature.
function buildWalletStatsFn(walletPicksAgg) {
  return (walletShort) => walletPicksAgg.get(walletShort) || null;
}

// v12 — wallet's per-sport prior stats { tier, priorN, priorRoi } at scoring
// time. Drives the agsV12 quality formula. Uses profile.bySport[sport].picks
// (n + flatRoi) which is refreshed every cron cycle by exportWalletProfiles.
// Near-causal in production; for calibration we use the current profile
// snapshot (slight forward bias, same simplification as v11 calibration —
// the distribution shape we need for quintile cuts is preserved).
function buildWalletPriorStatsFn(walletPriorBySport) {
  return (walletShort, sport) => {
    if (!walletShort || !sport) return null;
    const m = walletPriorBySport.get(walletShort);
    return m ? (m[sport] || null) : null;
  };
}

// ── Sample loader ──────────────────────────────────────────────────────────
// V6 cutover universe with full feature stack (walletDetails + outcome).
// Includes BOTH SHIPPED and SHADOW picks — the AGS-U calibration must reflect
// the full distribution the model will score against, not just the picks the
// (now-retired) matrix happened to publish. Verified empirically: SHADOW
// picks are 55% WR vs SHIPPED 50% WR (the matrix was over-filtering winners
// out of the calibration), so excluding them biased q-thresholds upward.
async function loadHistoricalAggregates(isProvenFn, isHcEligibleFn, walletStatsFn, walletPriorStatsFn) {
  const aggs = [];     // v11 aggregates
  const v12Scores = []; // v12 raw scores (one per pick)
  let dateMin = null, dateMax = null;
  let counts = { graded: 0, withDetails: 0, kept: 0, v12Kept: 0 };

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

        // v11 aggregate (used for v11 normalizers + quintiles)
        const agg = aggregateSideProven(wd, sideKey, sport, isProvenFn, isHcEligibleFn, walletStatsFn);
        if (agg && (agg.forCount + agg.agCount) > 0) {
          if (date) {
            if (!dateMin || date < dateMin) dateMin = date;
            if (!dateMax || date > dateMax) dateMax = date;
          }
          aggs.push(agg);
          counts.kept += 1;
        }

        // v12 score (used for v12 positive-only quintiles)
        const aggV12 = aggregateSideV12(wd, sideKey, sport, walletPriorStatsFn);
        if (aggV12 && Number.isFinite(aggV12.score)) {
          v12Scores.push(aggV12.score);
          counts.v12Kept += 1;
        }
      }
    }
  }
  return { aggs, v12Scores, dateMin, dateMax, counts };
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

  console.log('[ags-calibration] loading wallet tiers + per-sport priors + top-level picks aggregate…');
  const { tiers, walletPicksAgg, walletPriorBySport } = await loadWalletData();
  const isProvenFn = buildIsProvenFn(tiers);
  const isHcEligibleFn = buildIsHcEligibleFn(tiers);
  const walletStatsFn = buildWalletStatsFn(walletPicksAgg);
  const walletPriorStatsFn = buildWalletPriorStatsFn(walletPriorBySport);
  console.log(`[ags-calibration]   tier map: ${tiers.size} wallets · profile.picks: ${walletPicksAgg.size} wallets · per-sport priors: ${walletPriorBySport.size} wallets`);

  console.log('[ags-calibration] loading historical sample (V6 cutover, full universe, graded)…');
  const { aggs, v12Scores, dateMin, dateMax, counts } = await loadHistoricalAggregates(isProvenFn, isHcEligibleFn, walletStatsFn, walletPriorStatsFn);
  console.log(`[ags-calibration]   counts: graded=${counts.graded}  withDetails=${counts.withDetails}  v11-kept=${counts.kept}  v12-kept=${counts.v12Kept}`);
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

  // 2. Compute AGS for every historical row using the new normalizers and
  //    the v10 logistic-regression weights (AGS_WEIGHTS), then derive
  //    quintile boundaries from the resulting score distribution. This
  //    MUST mirror computeAgs() in src/lib/ags.js exactly so that the
  //    quintile cuts placed in Firestore line up with the live score
  //    output. Any change to AGS_WEIGHTS over there will be reflected
  //    here automatically via the imported constant.
  const agsValues = aggs.map(a => {
    let total = Number(AGS_WEIGHTS.intercept) || 0;
    for (const f of AGS_FEATURES) {
      const { mean, sd } = normalizers[f.key];
      if (!Number.isFinite(mean) || !Number.isFinite(sd) || sd === 0) continue;
      const z = (Number(a[f.key] || 0) - mean) / sd;
      const w = Number(AGS_WEIGHTS[f.key]) || 0;
      total += w * z;
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
  console.log(`[ags-calibration]   v11 quintiles:  q20=${quintiles.q20.toFixed(2)} (HARD MUTE floor)  q40=${quintiles.q40.toFixed(2)} (LEAN 0.50×)  q60=${quintiles.q60.toFixed(2)} (LOCK 1.10×)  q80=${quintiles.q80.toFixed(2)} (PREMIUM 1.50×)  q90=${quintiles.q90.toFixed(2)} (ELITE 2.00×)`);

  // 2b. v12 quintile boundaries — computed on the POSITIVE-only score
  //     distribution (zero/negative scores are muted by rule, not by
  //     calibration, so they don't belong in the quintile cuts).
  const v12Positive = v12Scores.filter(s => s > 0).sort((a, b) => a - b);
  const v12Neg = v12Scores.filter(s => s < 0).length;
  const v12Zero = v12Scores.filter(s => s === 0).length;
  let v12Quintiles = null;
  if (v12Positive.length >= 25) { // need a real distribution; below 25 we hold the fallback
    v12Quintiles = {
      q20: quantile(v12Positive, 0.20),
      q40: quantile(v12Positive, 0.40),
      q60: quantile(v12Positive, 0.60),
      q80: quantile(v12Positive, 0.80),
    };
    console.log(`[ags-calibration]   v12 quintiles (positives-only n=${v12Positive.length}):  q20=${v12Quintiles.q20.toFixed(3)} (WEAK→LEAN)  q40=${v12Quintiles.q40.toFixed(3)} (LEAN→LOCK)  q60=${v12Quintiles.q60.toFixed(3)} (LOCK→PREMIUM)  q80=${v12Quintiles.q80.toFixed(3)} (PREMIUM→ELITE)`);
    console.log(`[ags-calibration]   v12 score-sign distribution: neg=${v12Neg}  zero=${v12Zero}  positive=${v12Positive.length}  total=${v12Scores.length}`);
  } else {
    console.warn(`[ags-calibration]   v12 positive sample too small (n=${v12Positive.length}) — omitting v12Quintiles from doc; fallback in src/lib/ags.js will be used.`);
  }

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
    schemaVersion: 'ags-unified-v12', // v12 is now authoritative for sizing
    weights: { ...AGS_WEIGHTS }, // v11 model weights that produced quintiles{}
  };

  // v12 calibration block — read by the cron + UI to apply the ladder
  // (0.25/0.50/1.00/3.00/5.00 units) to positive scores; non-positive
  // scores are muted by rule. When v12Quintiles is omitted (sample too
  // small), the fallback in src/lib/ags.js (AGS_V12_FALLBACK_CALIBRATION)
  // is used by both readers.
  if (v12Quintiles) {
    doc.v12Quintiles = v12Quintiles;
    doc.v12 = {
      sampleSize: v12Positive.length,
      totalSampleSize: v12Scores.length,
      signDistribution: { negative: v12Neg, zero: v12Zero, positive: v12Positive.length },
      computedAt: doc.computedAt,
    };
  }

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
