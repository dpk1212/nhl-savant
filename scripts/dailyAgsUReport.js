/**
 * Sharp Intel — AGS-Unified Daily Performance & Calibration Report
 * ──────────────────────────────────────────────────────────────────────────
 * Single canonical monitoring artifact for the AGS-U sharp-intelligence
 * pipeline. Replaces v6 / v7 / v8 dailies as the source of truth for:
 *
 *   • Is AGS-U making money? Per tier? Per quintile? Per sport?
 *   • Is AGS-U CALIBRATED — does the tier ladder predict outcomes monotonically?
 *   • Are the active features still earning their slot?
 *   • Is the sizing ladder capturing edge?
 *   • Is the mute floor / mute rule suppressing the right picks?
 *   • Are there cron / grader / sizing anomalies that need attention?
 *
 * MODEL-AGNOSTIC core: every reference to active v11 features / weights /
 * quintiles is loaded at runtime from `src/lib/ags.js`. When the v11 model
 * is bumped (v9 → v10 → v11 → …) the v11 sections auto-track.
 *
 * V12 EXTENSIONS (added 2026-06-03 alongside the wallet-quality-model rollout):
 *   §0a Active Model — auto-switches between v11 logistic and v12 single-
 *       feature wallet-quality model cards based on liveCal.schemaVersion.
 *   §1b V12 Tier Calibration — same monotonicity test as §1 but for the
 *       v12 ABSOLUTE-units ladder (5/3/1/0.5/0.25u, mute-by-rule).
 *   §2b V12 Quintile Calibration — positive-only quintile bucketing.
 *   §5b V12 Calibration Reliability — band × realized.
 *   §6  Recent Picks — side-by-side v11 + v12 score/tier columns with a
 *       disagreement-direction flag (▲ v12 upgrades, ▼ v12 downgrades).
 *   §7  Sizing Audit — v11 ladder AND v12 ladder tables with stake-drift flags.
 *   §8  Mute Validation — v11 calibrated floor AND v12 score≤0 rule.
 *  §10  Op Health — v12 FADE-but-LOCKED, ladder→ship drift, stamp drift,
 *       v11↔v12 tier disagreement counters.
 *  §11  Calibration Snapshot — BOTH v11 quintiles AND v12Quintiles + ladder.
 *  §13  V11 vs V12 Head-to-Head — confusion matrix + counterfactual PnL
 *       on the shared pool.
 *  §14  V12 Wallet Quality Audit — score distribution, FOR/AGAINST quality
 *       means, win rate by FOR-mean tercile.
 *
 * Because the cron stamps `v8_agsTier` with the v12 tier (v12 is
 * authoritative), the v11 tier on v12-era picks is RECONSTRUCTED from the
 * stamped `v8_ags` score using the live v11 calibration so §13 stays
 * meaningful through the transition.
 *
 * READS the FINAL graded state — what the user actually saw at lock time
 * (finalUnits stamped at T-15) compared to the realized outcome. Never
 * recomputes against today's whitelist (that's the v6 survivorship bug we
 * exterminated on 2026-05-05).
 *
 * Output:  DAILY_AGSU_REPORT.md  (committed by .github/workflows/daily-agsu-report.yml)
 * Usage:   node scripts/dailyAgsUReport.js
 *          node scripts/dailyAgsUReport.js --recent=30  (default 20)
 */
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import {
  AGS_FEATURES,
  AGS_WEIGHTS,
  AGS_FALLBACK_CALIBRATION,
  AGS_ABSOLUTE_MUTE_FLOOR,
  AGS_V12_FALLBACK_CALIBRATION,
  AGS_V12_TIER_META,
  agsTierFromValue,
  agsQuintileFromValue,
  agsV12TierFromValue,
  agsV12QuintileFromValue,
  agsV12SizeMultiplier,
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

// ── CLI flags ────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const RECENT_N = (() => {
  const a = argv.find(x => x.startsWith('--recent='));
  return a ? parseInt(a.split('=')[1], 10) : 20;
})();

// ── Constants ────────────────────────────────────────────────────────────
const PICK_COLLECTIONS = [
  ['sharpFlowPicks',   'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals',  'TOTAL'],
];

// AGS-U cutover — the first day picks were promoted with the unified
// composite as the sole gating decision. Picks before this date were
// promoted by legacy v7/v8 routes and are excluded from AGS-U performance
// accounting (they'd contaminate the calibration story).
const AGSU_PROMOTION_TAG = 'ags-unified-v9';  // promoted-by tag is sticky across model bumps

// AGS-U sizing ladder multipliers (must match scripts/syncPickStateAuthoritative.js).
// v11: multipliers applied on top of a per-market base stake.
const TIER_MULT = { ELITE: 2.00, PREMIUM: 1.50, LOCK: 1.10, LEAN: 0.50, WEAK: 0.20, FADE: 0.00 };
const TIER_ORDER = ['ELITE', 'PREMIUM', 'LOCK', 'LEAN', 'WEAK', 'FADE'];
const TIER_QUINTILE_LABEL = {
  ELITE:   '≥ q90',
  PREMIUM: 'q80–q90',
  LOCK:    'q60–q80',
  LEAN:    'q40–q60',
  WEAK:    'q20–q40',
  FADE:    '< q20',
};

// v12: ABSOLUTE units (ladder IS the stake, not a multiplier). FADE = mute (score ≤ 0).
// Source: src/lib/ags.js::agsV12SizeMultiplier — must stay aligned.
const V12_TIER_UNITS = { ELITE: 5.00, PREMIUM: 3.00, LOCK: 1.00, LEAN: 0.50, WEAK: 0.25, FADE: 0.00 };
const V12_TIER_QUINTILE_LABEL = {
  ELITE:   '> q80 (positives)',
  PREMIUM: 'q60–q80',
  LOCK:    'q40–q60',
  LEAN:    'q20–q40',
  WEAK:    '(0, q20]',
  FADE:    '≤ 0 (MUTE)',
};

// Active model surface — pulled at runtime from src/lib/ags.js so this
// report never drifts when the model is bumped.
const ACTIVE_FEATURE_KEYS = AGS_FEATURES.map(f => f.key);
const ACTIVE_FEATURE_META = AGS_FEATURES.map(f => ({
  key: f.key,
  label: f.label,
  family: f.family,
  modelSign: AGS_WEIGHTS[f.key] >= 0 ? '+' : '−',
  modelDirection: AGS_WEIGHTS[f.key] >= 0 ? 'PRO-CONSENSUS' : 'CONTRARIAN',
  weight: AGS_WEIGHTS[f.key] ?? 0,
}));

// Union of every feature key we expect to see on either current or legacy
// pick components — used so the univariate table still renders for picks
// stamped under v9/v10 schemas before the v11 cutover.
const LEGACY_FEATURE_KEYS = ['dCount', 'dHcCount', 'dConvictionAvg', 'dHcSizeRatio', 'forContribShare'];
const ALL_OBSERVED_FEATURE_KEYS = Array.from(new Set([...ACTIVE_FEATURE_KEYS, ...LEGACY_FEATURE_KEYS]));

// Pretty labels for any feature we may show in tables (active + legacy).
const FEATURE_LABELS = {
  dCount:          'Δcount',
  dHcSizeRatio:    'ΔHCsizeRatio',
  dSumRankNorm:    'ΔΣrankNorm',
  dWinnerCtPreA:   'Δwinners',
  dHcCount:        'ΔHCcount',
  dConvictionAvg:  'ΔavgConv',
  forContribShare: 'forShare',
};

// ── Helpers ──────────────────────────────────────────────────────────────
const etToday = () => new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }))
  .toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
const etNDaysAgo = (n) => {
  const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
  d.setDate(d.getDate() - n);
  return d.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
};
const etYesterday = () => etNDaysAgo(1);

function americanToImplied(odds) {
  if (!odds || odds === 0) return null;
  return odds < 0 ? Math.abs(odds) / (Math.abs(odds) + 100) : 100 / (odds + 100);
}
function oddsBand(odds) {
  if (odds == null) return '—';
  const p = americanToImplied(odds);
  if (p == null) return '—';
  if (p >= 0.65) return 'HEAVY_FAV';
  if (p >= 0.55) return 'MOD_FAV';
  if (p >= 0.48) return 'PICK_EM';
  if (p >= 0.40) return 'MOD_DOG';
  return 'LONG_DOG';
}
const pct = (n, d) => d > 0 ? ((n / d) * 100).toFixed(1) + '%' : '—';
const fmtN = (n, d=2) => n != null && Number.isFinite(n) ? n.toFixed(d) : '—';
const fmtSigned = (n, d=2) => n != null && Number.isFinite(n)
  ? (n >= 0 ? '+' : '') + n.toFixed(d) : '—';
const avg = (arr) => arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : 0;
const std = (arr) => {
  if (arr.length < 2) return 0;
  const m = avg(arr);
  return Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / (arr.length - 1));
};
function spearman(x, y) {
  if (x.length !== y.length || x.length < 3) return null;
  const n = x.length;
  const rank = (arr) => {
    const sorted = arr.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v);
    const ranks = new Array(n);
    for (let i = 0; i < n; i++) ranks[sorted[i].i] = i + 1;
    return ranks;
  };
  const rx = rank(x), ry = rank(y);
  const d2 = rx.reduce((s, r, i) => s + (r - ry[i]) ** 2, 0);
  return 1 - (6 * d2) / (n * (n * n - 1));
}
function pointBiserial(numeric, binary) {
  if (numeric.length !== binary.length || numeric.length < 3) return null;
  const m1 = avg(numeric.filter((_, i) => binary[i] === 1));
  const m0 = avg(numeric.filter((_, i) => binary[i] === 0));
  const sd = std(numeric);
  const n1 = binary.filter(b => b === 1).length;
  const n0 = binary.length - n1;
  if (sd === 0 || n0 === 0 || n1 === 0) return null;
  const N = binary.length;
  return ((m1 - m0) / sd) * Math.sqrt((n1 * n0) / (N * N));
}
function brierScore(predictedProbs, outcomes) {
  if (predictedProbs.length !== outcomes.length || predictedProbs.length === 0) return null;
  let sum = 0;
  for (let i = 0; i < predictedProbs.length; i++) {
    sum += (predictedProbs[i] - outcomes[i]) ** 2;
  }
  return sum / predictedProbs.length;
}
// AUC via Mann-Whitney U.
function rocAuc(scores, outcomes) {
  if (scores.length !== outcomes.length || scores.length < 3) return null;
  const pairs = scores.map((s, i) => ({ s, y: outcomes[i] })).sort((a, b) => b.s - a.s);
  let pos = 0, neg = 0, tp = 0;
  for (const r of pairs) {
    if (r.y === 1) pos++; else { neg++; tp += pos; }
  }
  return pos > 0 && neg > 0 ? tp / (pos * neg) : null;
}
// Monotonicity score: +N when sequence strictly increases, -N when strictly decreases.
function monoScore(arr) {
  let s = 0;
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > arr[i - 1]) s++;
    else if (arr[i] < arr[i - 1]) s--;
  }
  return s;
}
// Sigmoid (matches src/lib/ags::agsScoreToProb).
const sigmoid = (z) => 1 / (1 + Math.exp(-Math.max(-30, Math.min(30, z))));

// ── Data Loader ──────────────────────────────────────────────────────────
// `liveCal` is passed in so we can reconstruct the v11 tier from the stamped
// v11 score (sd.v8_ags) — `syncPickStateAuthoritative.js` overwrites
// `sd.v8_agsTier` with the v12 tier when v12 fires, so the raw stamp is no
// longer the v11 tier on v12-era picks. Re-classifying from v8_ags + the
// live calibration restores the v11 decision for §13 head-to-head.
async function loadAllAgsuGradedPicks(liveCal = null) {
  const rows = [];
  let cutover = null;
  const v11CalForReconstruction = (liveCal && liveCal.quintiles) ? liveCal : AGS_FALLBACK_CALIBRATION;
  for (const [colName, mktType] of PICK_COLLECTIONS) {
    const snap = await db.collection(colName).get();
    for (const doc of snap.docs) {
      const data = doc.data();
      if (!data.sides) continue;
      for (const [sideKey, sd] of Object.entries(data.sides)) {
        if (sd.superseded) continue;
        const lock = sd.lock || {};
        const peak = sd.peak || lock;

        if (sd.promotedBy === AGSU_PROMOTION_TAG && data.date && (!cutover || data.date < cutover)) {
          cutover = data.date;
        }

        if ((sd.status || data.status) !== 'COMPLETED') continue;
        const res = sd.result || data.result || {};
        if (!res.outcome) continue;
        if (sd.promotedBy !== AGSU_PROMOTION_TAG) continue;

        const won = res.outcome === 'WIN' ? 1 : res.outcome === 'LOSS' ? 0 : null;
        if (won === null) continue;

        const units = sd.finalUnits ?? sd.v8_agsUnitsApplied ?? peak.units ?? lock.units ?? 0;
        const oddsForProfit = peak.odds || lock.odds || 0;
        const computedProfit = won
          ? (oddsForProfit < 0 ? units * (100 / Math.abs(oddsForProfit)) : units * (oddsForProfit / 100))
          : -units;
        const profit = Number.isFinite(res.profit) ? res.profit : computedProfit;
        const tracked = res.tracked === true || units === 0;

        const ags = Number.isFinite(sd.v8_ags) ? sd.v8_ags : null;
        // v11 tier resolution: when v12 is active, syncPickStateAuthoritative
        // overwrites sd.v8_agsTier with the v12 tier. To preserve the v11
        // decision for §13 head-to-head we re-derive v11 tier from sd.v8_ags
        // using the live v11 calibration whenever v8_ags is present.
        const agsTierReconstructed = ags != null
          ? agsTierFromValue(ags, v11CalForReconstruction)
          : null;
        const agsQuintileReconstructed = ags != null
          ? agsQuintileFromValue(ags, v11CalForReconstruction)
          : null;
        // Prefer reconstruction; fall back to whatever the stamp says (legacy picks
        // pre-v12 will have a stamped value that equals the reconstruction).
        const agsTier = agsTierReconstructed || sd.v8_agsTier || sd.v8_lockTier || null;
        const agsQuintile = Number.isFinite(agsQuintileReconstructed)
          ? agsQuintileReconstructed
          : (Number.isFinite(sd.v8_agsQuintile) ? sd.v8_agsQuintile : null);
        // Also expose the raw stamp for op-health debugging (so we can detect
        // when the stamp has drifted from the reconstructed value).
        const agsTierStamped = sd.v8_agsTier || null;
        const agsComponents = sd.v8_agsComponents || null;
        const provenFor = sd.v8_agsProvenForCount ?? null;
        const provenAg = sd.v8_agsProvenAgCount ?? null;
        const hcMargin = Number.isFinite(sd.v8_hcMargin)
          ? sd.v8_hcMargin
          : ((sd.v8_hcConfFor || 0) - (sd.v8_hcConfAg || 0));
        const schemaVersion = sd.v8_agsCalibrationSchema || sd.v8_agsSchema || null;

        // v12 surface — stamped by syncPickStateAuthoritative.js alongside v11.
        // Presence of v8_agsV12 is the authoritative "this pick was scored under v12" marker.
        const agsV12 = Number.isFinite(sd.v8_agsV12) ? sd.v8_agsV12 : null;
        const agsV12Tier = sd.v8_agsV12Tier || null;
        const agsV12Quintile = Number.isFinite(sd.v8_agsV12Quintile) ? sd.v8_agsV12Quintile : null;
        const agsV12UnitsApplied = Number.isFinite(sd.v8_agsV12UnitsApplied) ? sd.v8_agsV12UnitsApplied : null;
        const agsV12UnitsRaw = Number.isFinite(sd.v8_agsV12UnitsRaw) ? sd.v8_agsV12UnitsRaw : null;
        const agsV12ForMean = Number.isFinite(sd.v8_agsV12ForMean) ? sd.v8_agsV12ForMean : null;
        const agsV12AgMean = Number.isFinite(sd.v8_agsV12AgMean) ? sd.v8_agsV12AgMean : null;
        const agsV12ForCount = Number.isFinite(sd.v8_agsV12ForCount) ? sd.v8_agsV12ForCount : null;
        const agsV12AgCount = Number.isFinite(sd.v8_agsV12AgCount) ? sd.v8_agsV12AgCount : null;
        const agsV12CalibrationSource = sd.v8_agsV12CalibrationSource || null;

        const lockOdds = lock.odds || 0;
        const peakOdds = peak.odds || lockOdds;
        const closingOdds = sd.closingOdds || null;
        const lockPinnProb = americanToImplied(lock.pinnacleOdds || lockOdds);
        const closeProb = americanToImplied(closingOdds);
        const clv = (lockPinnProb && closeProb) ? closeProb - lockPinnProb : null;

        rows.push({
          docId: doc.id,
          date: data.date,
          sport: data.sport || 'NHL',
          marketType: mktType,
          team: sd.team || sideKey,
          sideKey,
          away: data.away || '',
          home: data.home || '',
          won, profit, units, tracked,
          rawTracked: res.tracked === true,
          lockOdds, peakOdds, oddsBand: oddsBand(peakOdds || lockOdds),
          lockStars: lock.stars || 0,
          peakStars: peak.stars || lock.stars || 0,
          ags, agsTier, agsTierStamped, agsQuintile, agsComponents,
          provenFor, provenAg,
          provenTotal: (provenFor ?? 0) + (provenAg ?? 0),
          hcMargin,
          hcConfFor: sd.v8_hcConfFor ?? 0,
          hcConfAg:  sd.v8_hcConfAg ?? 0,
          hcDominant: !!sd.v8_hcDominant,
          clv,
          closeProb, lockPinnProb,
          status: sd.status,
          healthStatus: sd.health?.status || 'ACTIVE',
          schemaVersion,
          // v12
          agsV12, agsV12Tier, agsV12Quintile,
          agsV12UnitsApplied, agsV12UnitsRaw,
          agsV12ForMean, agsV12AgMean,
          agsV12ForCount, agsV12AgCount,
          agsV12CalibrationSource,
          lockStage: sd.lockStage || null,
        });
      }
    }
  }
  rows.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  return { rows, cutover };
}

function aggregate(rows) {
  const all = rows.filter(r => Number.isFinite(r.profit));
  const tracked = all.filter(r => r.tracked);
  const live = all.filter(r => !r.tracked);
  const trackedN = tracked.length;
  const trackedW = tracked.filter(r => r.won === 1).length;
  const trackedL = tracked.filter(r => r.won === 0).length;
  const n = live.length;
  const w = live.filter(r => r.won === 1).length;
  const l = live.filter(r => r.won === 0).length;
  const profit = live.reduce((s, r) => s + r.profit, 0);
  const totalStake = live.reduce((s, r) => s + (r.units || 0), 0);
  const realWinRate = n > 0 ? w / n : null;
  const roi = totalStake > 0 ? (profit / totalStake) * 100 : null;
  const flat = n > 0 ? profit / n : null;
  const clvVals = all.map(r => r.clv).filter(v => Number.isFinite(v));
  const avgClv = clvVals.length ? avg(clvVals) * 100 : null;
  const perUnitReturns = live
    .map(r => (r.units > 0 ? r.profit / r.units : null))
    .filter(v => v !== null);
  const sharpeLike = perUnitReturns.length > 2 && std(perUnitReturns) > 0
    ? (avg(perUnitReturns) / std(perUnitReturns)) * Math.sqrt(perUnitReturns.length)
    : null;
  return { n, w, l, profit, totalStake, realWinRate, roi, flat, avgClv, sharpeLike, trackedN, trackedW, trackedL };
}

// ── Section Builders ────────────────────────────────────────────────────

function buildHeader(report, cutover, liveCal) {
  const today = etToday();
  const daysLive = cutover
    ? Math.max(1, Math.floor((new Date(today) - new Date(cutover)) / 86400000))
    : null;
  const schemaLive = liveCal?.schemaVersion || AGS_FALLBACK_CALIBRATION.schemaVersion;
  report.push(`# AGS-Unified — Daily Monitoring Report`);
  report.push('');
  report.push(`**Generated:** ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'full', timeStyle: 'short' })} ET`);
  report.push(`**Active model:** \`${schemaLive}\` · **AGS-U cutover:** ${cutover || '— (no AGS-U promoted picks found)'} · **Days live:** ${daysLive ?? '—'}`);
  report.push('');
  report.push(`> **Scope.** Every row in this report comes from picks AGS-U actually promoted (\`promotedBy = ${AGSU_PROMOTION_TAG}\`). Picks promoted by legacy v7/v8 routes are excluded — they'd contaminate the calibration story. Within the AGS-U pool, each pick is classified as one of:`);
  report.push('');
  report.push(`> - **🟢 LIVE SHIPPED** — \`finalUnits > 0\` (ELITE/PREMIUM/LOCK/LEAN/WEAK). Real money risked, real W-L-PnL.`);
  report.push(`> - **⚪ TRACKED** — FADE tier, hard-muted to 0 units. Outcome graded for back-testing only; **excluded from W-L-PnL totals** (matches the dashboard's \`loadAllTimePnL\` math).`);
  report.push('');
  report.push(`> Headline tables show **LIVE** numbers. Tracked counts are surfaced in §11 and the per-pick table flags every TRACKED row.`);
  report.push('');
}

function buildActiveModelCard(report, liveCal) {
  report.push(`## § 0a — Active Model`);
  report.push('');
  report.push(`The composite scoring model — what every lock/mute/sizing decision is built on. Pulled at runtime from \`src/lib/ags.js\` so this report never drifts.`);
  report.push('');
  const schema = liveCal?.schemaVersion || AGS_FALLBACK_CALIBRATION.schemaVersion;
  const isV12 = /v12/.test(schema);
  report.push(`**Schema version:** \`${schema}\` ${isV12 ? '— wallet-quality model with absolute-units ladder' : '— logistic-regression model with multiplier ladder'}`);
  report.push(`**Calibration source:** \`${liveCal?.source || 'fallback'}\` · sample N = ${liveCal?.sampleSize ?? '—'} · range ${liveCal?.dateRange?.from ?? '—'} → ${liveCal?.dateRange?.to ?? '—'}`);
  report.push('');

  if (isV12) {
    // ── v12 model card ─────────────────────────────────────────────────
    report.push(`### Scoring formula (single feature, wallet-quality mean ratio)`);
    report.push('');
    report.push('```');
    report.push(`per-wallet quality Q = tierWeight × min(roi,30) × clamp(sizeRatio,0.5,2.5) × min(1, sqrt(priorN/20))`);
    report.push(`  tierWeight: CONFIRMED=3, FLAT=2, otherwise 0 (HC_BASE gate)`);
    report.push('');
    report.push(`per-side score (mean ratio):`);
    report.push(`  fMean = mean(Q for wallets on FOR side)`);
    report.push(`  aMean = mean(Q for wallets on AGAINST side)`);
    report.push(`  score = (fMean − aMean) / (fMean + aMean + 0.5)    ∈ ~[−1, +1]`);
    report.push('```');
    report.push('');
    report.push(`**Why the mean (not sum)?** Sum rewards crowd size and re-introduces the v11 "more sharps = worse outcome" inversion. Mean isolates wallet QUALITY per side, leaving the count effect to the size-ratio term inside Q.`);
    report.push('');
    report.push(`### Mute rule + tier ladder (ABSOLUTE units — no per-market base)`);
    report.push('');
    report.push(`| Tier     | Band                 | Units | Source                          |`);
    report.push(`|----------|----------------------|-------|---------------------------------|`);
    for (const tier of TIER_ORDER) {
      const label = V12_TIER_QUINTILE_LABEL[tier];
      const units = V12_TIER_UNITS[tier];
      report.push(`| ${tier.padEnd(8)} | ${label.padEnd(20)} | ${units.toFixed(2).padStart(5)} | \`agsV12SizeMultiplier\`         |`);
    }
    report.push('');
    report.push(`> **Mute rule:** score ≤ 0 → **FADE** (0 units, pick is cancelled / hidden from locked list). No separate calibrated mute floor — the rule IS the gate. The positive-only distribution is then split into 5 quintiles for tier assignment.`);
    report.push('');
    report.push(`> **Why 0.25/0.50/1.00/3.00/5.00?** Backtest (282 picks, 2026-05-14→05-31) showed per-tier ROI: ELITE +33%, PREMIUM +9%, LOCK −8%, LEAN +14%, WEAK −20%. The top-heavy ladder concentrates capital where edge actually lives while preserving volume above q20 so the lower tiers can still rotate. Net swing vs v11 production: **+70u PnL / +23pp ROI** on the same window.`);
    report.push('');
  } else {
    // ── v11 (legacy) model card ────────────────────────────────────────
    report.push(`### Features & coefficients (logistic-regression β on z-scored features)`);
    report.push('');
    report.push(`| feature           | family         | direction       | β        | meaning |`);
    report.push(`|-------------------|----------------|-----------------|----------|---------|`);
    report.push(`| intercept         | —              | —               | ${fmtSigned(AGS_WEIGHTS.intercept, 4)} | baseline log-odds |`);
    for (const f of ACTIVE_FEATURE_META) {
      const meaning = FEATURE_MEANING[f.key] || '—';
      report.push(`| \`${f.key}\`${' '.repeat(Math.max(0, 16 - f.key.length))} | ${f.family.padEnd(14)} | ${f.modelDirection.padEnd(15)} | ${fmtSigned(f.weight, 4)} | ${meaning} |`);
    }
    report.push('');
    report.push(`**Score range:** sigmoid(score) ≈ P(WIN | features). Score is summed weight·z(feature) plus intercept. **Tier ladder** uses calibration quintiles: ELITE ≥ q90 (2×), PREMIUM ≥ q80 (1.5×), LOCK ≥ q60 (1.1×), LEAN ≥ q40 (0.5×), WEAK ≥ q20 (0.2×), FADE < q20 (HARD MUTE 0×).`);
    report.push('');
    const contrarianCount = ACTIVE_FEATURE_META.filter(f => f.modelDirection === 'CONTRARIAN').length;
    const proCount = ACTIVE_FEATURE_META.filter(f => f.modelDirection === 'PRO-CONSENSUS').length;
    if (contrarianCount > 0) {
      report.push(`> **${proCount} PRO-CONSENSUS · ${contrarianCount} CONTRARIAN features.** Negative-β features fade-the-obvious-sharps: when known-winning wallets pile heavily on one side, that side WINS LESS often (the line has already moved). The model balances both effects.`);
      report.push('');
    }
  }

  // v11 surface is ALWAYS shown as legacy/comparator when v12 is the active
  // model, since v11 features are still being computed in parallel during
  // the v12 transition. This makes the head-to-head sections meaningful.
  if (isV12) {
    report.push(`### Legacy v11 logistic surface (still computed in parallel for §13 head-to-head)`);
    report.push('');
    report.push(`| feature           | β        | direction       |`);
    report.push(`|-------------------|----------|-----------------|`);
    report.push(`| intercept         | ${fmtSigned(AGS_WEIGHTS.intercept, 4).padStart(8)} | —               |`);
    for (const f of ACTIVE_FEATURE_META) {
      report.push(`| \`${f.key}\`${' '.repeat(Math.max(0, 16 - f.key.length))} | ${fmtSigned(f.weight, 4).padStart(8)} | ${f.modelDirection.padEnd(15)} |`);
    }
    report.push('');
    report.push(`> v11 stamps (\`v8_ags\`, \`v8_agsTier\`, \`v8_agsComponents\`) remain on every pick for back-test continuity and so §13 can compare the two models head-to-head. v11 is **not used for any live decision** in v12 mode.`);
    report.push('');
  }
}

// Per-feature, plain-English meaning — keep in sync with src/lib/ags.js comments.
const FEATURE_MEANING = {
  dCount:          'count(proven wallets FOR) − count(AGAINST)',
  dHcSizeRatio:    'Σ sizeRatio of HC wallets FOR − AGAINST',
  dSumRankNorm:    'Σ leaderboard rankNorm FOR − AGAINST (more rank quality FOR ⇒ contrarian flag)',
  dWinnerCtPreA:   'count of pre-D winning wallets FOR − AGAINST (more known winners FOR ⇒ contrarian flag)',
  dHcCount:        '[legacy v10] count(HC wallets FOR) − AGAINST',
  dConvictionAvg:  '[legacy v10] avg(convictionMult) FOR − AGAINST',
  forContribShare: '[legacy v10] this-side share of total contribution',
};

function buildExecutiveSummary(report, rows, cutover) {
  const overall = aggregate(rows);
  const last3 = aggregate(rows.filter(r => r.date >= etNDaysAgo(3)));
  const last7 = aggregate(rows.filter(r => r.date >= etNDaysAgo(7)));
  const yest  = aggregate(rows.filter(r => r.date === etYesterday()));

  const alerts = [];
  if (overall.n === 0) {
    alerts.push(`🚨 **No graded AGS-U picks since cutover.** Either the cutover date (${cutover}) is wrong, the grader is stuck, or no picks have been promoted via \`${AGSU_PROMOTION_TAG}\`.`);
  }
  if (overall.roi != null && overall.roi < -5 && last7.roi != null && last7.roi < -5) {
    alerts.push(`🚨 **All-time ROI ${overall.roi.toFixed(1)}% / 7-day ${last7.roi.toFixed(1)}%** — both negative ≥ 5%. AGS-U may be miscalibrated. Drill into §3 (tier ladder) and §10 (mute validation).`);
  } else if (last7.roi != null && last7.roi < -10) {
    alerts.push(`🟡 **7-day ROI ${last7.roi.toFixed(1)}%** — cold streak. Check §3 tier monotonicity to confirm it's not structural.`);
  }
  // Grader regression — same alert as before, still relevant.
  const graderRegression = rows.filter(r => r.rawTracked && r.units > 0).length;
  if (graderRegression > 0) {
    alerts.push(`🚨 **${graderRegression} graded picks have \`result.tracked = true\` despite \`finalUnits > 0\`.** Grader regression — the legacy LEAN-override is back. PnL is being zeroed on real money. See \`functions/src/betTracking.js\`.`);
  }
  // Locked-but-zero alert (this caught the v11 sizing bug discovered 2026-05-27).
  const lockedZero = rows.filter(r => r.tracked && Number.isFinite(r.ags) && r.ags >= 0.10 && r.agsTier && r.agsTier !== 'FADE' && r.agsTier !== 'WEAK');
  if (lockedZero.length > 0) {
    alerts.push(`🚨 **${lockedZero.length} picks shipped at 0u despite AGS-U ≥ +0.10 and tier ∉ {FADE, WEAK}.** Sizing pipeline regression — see §10 for doc IDs. \`v8_agsUnitsMult\` should be > 0 for these.`);
  }
  if (yest.n === 0 && last3.n === 0) {
    alerts.push(`🟡 **No graded picks in the last 3 days.** Could be a cron pause or a quiet slate. Verify scheduling in §13.`);
  }
  if (alerts.length === 0) {
    alerts.push(`🟢 **No automated alerts firing.** Headline numbers are in the expected envelope.`);
  }

  report.push(`## § 0 — Executive Summary & Alerts`);
  report.push('');
  report.push(`### Alerts`);
  for (const a of alerts) report.push(`- ${a}`);
  report.push('');
  report.push(`### Headline Numbers — LIVE shipped picks only`);
  report.push('');
  report.push(`| Window     | Live N | W-L   | Win %  | ROI       | PnL (u)    | CLV       | Avg Stake | Sharpe-like | Tracked |`);
  report.push(`|------------|--------|-------|--------|-----------|------------|-----------|-----------|-------------|---------|`);
  for (const [label, agg] of [['Yesterday', yest], ['Last 3 days', last3], ['Last 7 days', last7], ['All-time', overall]]) {
    const trackedCell = agg.trackedN > 0 ? `${agg.trackedN} (${agg.trackedW}-${agg.trackedL})` : '—';
    report.push(`| ${label.padEnd(10)} | ${String(agg.n).padStart(6)} | ${agg.w}-${agg.l}`.padEnd(15)
      + ` | ${pct(agg.w, agg.n).padStart(6)} | ${(agg.roi != null ? agg.roi.toFixed(1)+'%' : '—').padStart(9)}`
      + ` | ${fmtSigned(agg.profit).padStart(10)} | ${(agg.avgClv != null ? fmtSigned(agg.avgClv, 2)+'%' : '—').padStart(9)}`
      + ` | ${(agg.totalStake > 0 ? (agg.totalStake/agg.n).toFixed(2)+'u' : '—').padStart(9)} | ${(agg.sharpeLike != null ? agg.sharpeLike.toFixed(2) : '—').padStart(11)}`
      + ` | ${trackedCell.padStart(7)} |`);
  }
  report.push('');
  report.push(`> **Live N / W-L / ROI / PnL** match the dashboard exactly — tracked (FADE, 0u) picks are excluded. **Tracked** column = FADE-tier picks graded for back-testing only. **Sharpe-like** = per-pick mean unit return ÷ sd × √N.`);
  report.push('');
}

function buildTierCalibration(report, rows) {
  report.push(`## § 1 — AGS-U Tier Calibration`);
  report.push('');
  report.push(`The whole point of AGS-U is that higher tiers should win at higher rates AND earn higher ROI. If ELITE → PREMIUM → LOCK → LEAN → WEAK is **monotonically decreasing** in both win% and ROI, the ladder is working. If not, the calibration is broken and the sizing multipliers are amplifying noise.`);
  report.push('');
  report.push(`### All-time tier breakdown`);
  report.push('');
  report.push(`| Tier     | Band        | Ladder | N    | W-L    | Win %  | ROI       | PnL (u)    | Avg AGS-U | Avg Stake |`);
  report.push(`|----------|-------------|--------|------|--------|--------|-----------|------------|-----------|-----------|`);
  const tierStats = {};
  for (const tier of TIER_ORDER) {
    const tierRows = rows.filter(r => r.agsTier === tier);
    const agg = aggregate(tierRows);
    tierStats[tier] = agg;
    const avgAgs = tierRows.length ? avg(tierRows.map(r => r.ags).filter(Number.isFinite)) : null;
    report.push(`| ${tier.padEnd(8)} | ${TIER_QUINTILE_LABEL[tier].padEnd(11)} | ${TIER_MULT[tier].toFixed(2)}×`.padEnd(8)
      + `   | ${String(agg.n).padStart(4)} | ${(agg.w+'-'+agg.l).padEnd(6)} | ${pct(agg.w, agg.n).padStart(6)} | ${(agg.roi != null ? agg.roi.toFixed(1)+'%' : '—').padStart(9)}`
      + ` | ${fmtSigned(agg.profit).padStart(10)} | ${(avgAgs != null ? fmtSigned(avgAgs, 2) : '—').padStart(9)}`
      + ` | ${(agg.totalStake > 0 ? (agg.totalStake/agg.n).toFixed(2)+'u' : '—').padStart(9)} |`);
  }
  const winRates = TIER_ORDER.filter(t => tierStats[t].n > 0).map(t => tierStats[t].realWinRate ?? 0);
  const rois = TIER_ORDER.filter(t => tierStats[t].n > 0).map(t => tierStats[t].roi ?? 0);
  const winMono = monoScore(winRates);
  const roiMono = monoScore(rois);
  report.push('');
  report.push(`**Monotonicity score** (n−1 max, fully ordered ELITE→FADE = ${-(winRates.length-1)}, fully inverted = ${winRates.length-1}):`);
  report.push(`- Win % across tiers: \`${winMono}\` ${winMono <= -(winRates.length-2) ? '🟢 monotonic (good — ladder is sorting picks correctly)' : winMono === 0 ? '🟡 random — calibration unclear' : winMono >= 1 ? '🚨 inverted — higher tiers winning LESS than lower' : '🟡 partial — ladder mostly works but has noise'}`);
  report.push(`- ROI across tiers:   \`${roiMono}\` ${roiMono <= -(rois.length-2) ? '🟢 monotonic — sizing ladder is capturing edge' : roiMono === 0 ? '🟡 sizing not amplifying edge' : roiMono >= 1 ? '🚨 inverted — sizing ladder is destroying value' : '🟡 partial'}`);
  report.push('');
}

function buildQuintileCalibration(report, rows) {
  report.push(`## § 2 — AGS-U Quintile Calibration`);
  report.push('');
  report.push(`Quintile bucketing of raw AGS-U values (Q5 = highest AGS-U). Independent check on §1 — quintile assignment is the upstream lever, tier mapping is downstream. If quintiles look monotonic but tiers don't, the tier→multiplier mapping is the bug.`);
  report.push('');
  const quintiles = [1, 2, 3, 4, 5];
  report.push(`| Quintile | N    | W-L    | Win %  | ROI       | PnL (u)    | Avg AGS-U | Implied (from odds) | Calibrated P(WIN) |`);
  report.push(`|----------|------|--------|--------|-----------|------------|-----------|---------------------|-------------------|`);
  const winRates = [];
  for (const q of quintiles) {
    const qRows = rows.filter(r => r.agsQuintile === q);
    const agg = aggregate(qRows);
    const avgAgs = qRows.length ? avg(qRows.map(r => r.ags).filter(Number.isFinite)) : null;
    const impliedProbs = qRows.map(r => americanToImplied(r.lockOdds || r.peakOdds)).filter(Number.isFinite);
    const avgImplied = impliedProbs.length ? avg(impliedProbs) * 100 : null;
    const calibProb = avgAgs != null ? sigmoid(avgAgs) * 100 : null;
    if (agg.realWinRate != null) winRates.push(agg.realWinRate);
    report.push(`| Q${q}       | ${String(agg.n).padStart(4)} | ${(agg.w+'-'+agg.l).padEnd(6)} | ${pct(agg.w, agg.n).padStart(6)} | ${(agg.roi != null ? agg.roi.toFixed(1)+'%' : '—').padStart(9)}`
      + ` | ${fmtSigned(agg.profit).padStart(10)} | ${(avgAgs != null ? fmtSigned(avgAgs, 2) : '—').padStart(9)}`
      + ` | ${(avgImplied != null ? avgImplied.toFixed(1)+'%' : '—').padStart(19)}`
      + ` | ${(calibProb != null ? calibProb.toFixed(1)+'%' : '—').padStart(17)} |`);
  }
  const mono = monoScore(winRates);
  report.push('');
  report.push(`**Spearman ρ (quintile vs realized win%):** ${winRates.length >= 3 ? fmtN(spearman(quintiles.slice(0, winRates.length), winRates), 3) : '—'}  ·  monotonicity \`${mono}/${winRates.length-1}\``);
  report.push('');
  report.push(`> **Calibrated P(WIN)** = sigmoid(avg AGS-U) — what the model would predict from each quintile's average score. Compare to **Win %** column: if model probability ≈ realized win rate, the score is well-calibrated as a probability and not just a discriminative ranker.`);
  report.push('');
}

function buildModelRankingMetrics(report, rows) {
  report.push(`## § 2a — Model Ranking Quality`);
  report.push('');
  report.push(`How well does AGS-U rank winners above losers, overall and per sport? **AUC ≥ 0.55** is meaningful at our sample sizes; **AUC > 0.60** is strong; **AUC ≈ 0.50** is chance. **Brier** measures probability calibration (lower = better, 0.25 = coin-flip prior, sub-0.24 = beats market).`);
  report.push('');
  const withAgs = rows.filter(r => Number.isFinite(r.ags) && r.won != null);
  const allScores = withAgs.map(r => r.ags);
  const allOutcomes = withAgs.map(r => r.won);
  const allProbs = withAgs.map(r => sigmoid(r.ags));
  const overallAuc = rocAuc(allScores, allOutcomes);
  const overallSp = spearman(allScores, allOutcomes);
  const overallBrier = brierScore(allProbs, allOutcomes);
  const overallBpb = pointBiserial(allScores, allOutcomes);

  report.push(`### Overall (since cutover)`);
  report.push('');
  report.push(`| N | AUC   | Spearman ρ | Pt-biserial r | Brier (model) | Brier (market) | Δ vs market |`);
  report.push(`|---|-------|------------|---------------|---------------|----------------|-------------|`);
  const marketProbs = withAgs.map(r => americanToImplied(r.lockOdds || r.peakOdds)).map(p => Number.isFinite(p) ? p : 0.5);
  const marketBrier = brierScore(marketProbs, allOutcomes);
  const dBrier = (overallBrier != null && marketBrier != null) ? marketBrier - overallBrier : null;
  report.push(`| ${withAgs.length} | ${fmtN(overallAuc, 3)} | ${fmtN(overallSp, 3)} | ${fmtN(overallBpb, 3)} | ${fmtN(overallBrier, 4)} | ${fmtN(marketBrier, 4)} | ${dBrier != null ? fmtSigned(dBrier, 4) : '—'} |`);
  report.push('');

  report.push(`### Per sport`);
  report.push('');
  report.push(`| Sport | N    | AUC   | Spearman ρ | Top Q (Q5) WR | Bot Q (Q1) WR | Q5−Q1 gap |`);
  report.push(`|-------|------|-------|------------|---------------|---------------|-----------|`);
  const sports = [...new Set(withAgs.map(r => r.sport))].sort();
  for (const sp of sports) {
    const sub = withAgs.filter(r => r.sport === sp);
    if (sub.length < 20) {
      report.push(`| ${sp.padEnd(5)} | ${String(sub.length).padStart(4)} | —     | —          | —             | —             | —         |`);
      continue;
    }
    const auc = rocAuc(sub.map(r => r.ags), sub.map(r => r.won));
    const sp_r = spearman(sub.map(r => r.ags), sub.map(r => r.won));
    const q5 = aggregate(sub.filter(r => r.agsQuintile === 5));
    const q1 = aggregate(sub.filter(r => r.agsQuintile === 1));
    const gap = (q5.realWinRate != null && q1.realWinRate != null) ? (q5.realWinRate - q1.realWinRate) * 100 : null;
    report.push(`| ${sp.padEnd(5)} | ${String(sub.length).padStart(4)} | ${fmtN(auc, 3).padStart(5)} | ${fmtN(sp_r, 3).padStart(10)} | ${(q5.realWinRate != null ? (q5.realWinRate*100).toFixed(1)+'%' : '—').padStart(13)} | ${(q1.realWinRate != null ? (q1.realWinRate*100).toFixed(1)+'%' : '—').padStart(13)} | ${gap != null ? fmtSigned(gap, 1)+'pp' : '—'.padStart(9)} |`);
  }
  report.push('');
  report.push(`> **Reading this table:** the largest Q5−Q1 gap = the sport where AGS-U is doing the most work. Negative AUC (< 0.5) on a sport = the model is anti-predictive there and may need a per-sport coefficient set (see \`scripts/_agsu_final_fit.mjs\`).`);
  report.push('');
}

function buildUnivariateFeatures(report, rows) {
  report.push(`## § 3 — Univariate Feature Analysis (active features)`);
  report.push('');
  report.push(`Each active AGS-U feature scored on its own against W/L. **Corr(WIN)** should match the model's sign — positive features should correlate +, contrarian features should correlate −. **Lift** = top-decile ROI − bottom-decile ROI, in percentage points; positive lift means the feature is earning its slot.`);
  report.push('');
  report.push(`| Feature           | Family         | Sign | β       | N    | Mean   | SD     | Corr(WIN) | Sign OK? | Top-dec ROI | Bot-dec ROI | Lift   |`);
  report.push(`|-------------------|----------------|------|---------|------|--------|--------|-----------|----------|-------------|-------------|--------|`);
  for (const fm of ACTIVE_FEATURE_META) {
    const featRows = rows.filter(r => r.agsComponents && Number.isFinite(r.agsComponents[fm.key]));
    if (featRows.length === 0) {
      report.push(`| ${fm.label.padEnd(17)} | ${fm.family.padEnd(14)} | ${fm.modelSign}    | ${fmtSigned(fm.weight, 3).padStart(7)} | ${String(0).padStart(4)} | —      | —      | —         | —        | —           | —           | —      |`);
      continue;
    }
    const values = featRows.map(r => r.agsComponents[fm.key]);
    const outcomes = featRows.map(r => r.won);
    const mean = avg(values);
    const sd = std(values);
    const corr = pointBiserial(values, outcomes);
    const sorted = featRows.slice().sort((a, b) => a.agsComponents[fm.key] - b.agsComponents[fm.key]);
    const decN = Math.max(1, Math.floor(sorted.length / 10));
    const bot = sorted.slice(0, decN);
    const top = sorted.slice(-decN);
    const botRoi = aggregate(bot).roi;
    const topRoi = aggregate(top).roi;
    const lift = (topRoi != null && botRoi != null) ? topRoi - botRoi : null;
    // Sign sanity: model weighting expects β > 0 ⇒ corr > 0, β < 0 ⇒ corr < 0.
    const signOk = corr != null
      ? ((fm.weight > 0 && corr > 0) || (fm.weight < 0 && corr < 0) ? '🟢' : (Math.abs(corr) < 0.03 ? '🟡 weak' : '🚨 flipped'))
      : '—';
    report.push(`| ${fm.label.padEnd(17)} | ${fm.family.padEnd(14)} | ${fm.modelSign}    | ${fmtSigned(fm.weight, 3).padStart(7)}`
      + ` | ${String(featRows.length).padStart(4)}`
      + ` | ${mean.toFixed(2).padStart(6)} | ${sd.toFixed(2).padStart(6)} | ${(corr != null ? fmtSigned(corr, 3) : '—').padStart(9)} | ${signOk.padEnd(8)}`
      + ` | ${(topRoi != null ? topRoi.toFixed(1)+'%' : '—').padStart(11)} | ${(botRoi != null ? botRoi.toFixed(1)+'%' : '—').padStart(11)}`
      + ` | ${(lift != null ? (lift >= 0 ? '+' : '') + lift.toFixed(1) + 'pp' : '—').padStart(6)} |`);
  }
  report.push('');
  report.push(`> **Sign OK?** column flags features where the empirical correlation disagrees with the model's coefficient sign — a model-vs-data mismatch worth investigating. Weak (|corr| < 0.03) is shown but rarely actionable.`);
  report.push('');

  // Legacy features (only show if any pick has them but they're not active).
  const inactiveLegacy = LEGACY_FEATURE_KEYS.filter(k => !ACTIVE_FEATURE_KEYS.includes(k));
  const legacyRows = rows.filter(r => r.agsComponents && inactiveLegacy.some(k => Number.isFinite(r.agsComponents[k])));
  if (inactiveLegacy.length > 0 && legacyRows.length > 0) {
    report.push(`### Legacy features (no longer weighted in score — present on older picks for back-compat)`);
    report.push('');
    report.push(`| Feature           | N (historical) | Mean   | Corr(WIN) | Top-dec ROI | Bot-dec ROI | Lift   |`);
    report.push(`|-------------------|----------------|--------|-----------|-------------|-------------|--------|`);
    for (const key of inactiveLegacy) {
      const sub = rows.filter(r => r.agsComponents && Number.isFinite(r.agsComponents[key]));
      if (sub.length === 0) continue;
      const label = FEATURE_LABELS[key] || key;
      const values = sub.map(r => r.agsComponents[key]);
      const outcomes = sub.map(r => r.won);
      const mean = avg(values);
      const corr = pointBiserial(values, outcomes);
      const sorted = sub.slice().sort((a, b) => a.agsComponents[key] - b.agsComponents[key]);
      const decN = Math.max(1, Math.floor(sorted.length / 10));
      const botRoi = aggregate(sorted.slice(0, decN)).roi;
      const topRoi = aggregate(sorted.slice(-decN)).roi;
      const lift = (topRoi != null && botRoi != null) ? topRoi - botRoi : null;
      report.push(`| ${label.padEnd(17)} | ${String(sub.length).padStart(14)} | ${mean.toFixed(2).padStart(6)} | ${(corr != null ? fmtSigned(corr, 3) : '—').padStart(9)} | ${(topRoi != null ? topRoi.toFixed(1)+'%' : '—').padStart(11)} | ${(botRoi != null ? botRoi.toFixed(1)+'%' : '—').padStart(11)} | ${(lift != null ? (lift >= 0 ? '+' : '') + lift.toFixed(1) + 'pp' : '—').padStart(6)} |`);
    }
    report.push('');
  }
}

function buildFeatureAttribution(report, rows) {
  report.push(`## § 3a — Feature Contribution Attribution`);
  report.push('');
  report.push(`Decomposes the average WINNER vs LOSER along each active feature's contribution to the score (β · z). **Winner > Loser** is what we want — the feature is pushing wins up and losses down. If Winner ≤ Loser on a feature, that feature is fighting the model on real data.`);
  report.push('');
  const live = rows.filter(r => !r.tracked && r.agsComponents && r.won != null);
  if (live.length === 0) {
    report.push(`_(no live-shipped picks with components)_`);
    report.push('');
    return;
  }
  const wins = live.filter(r => r.won === 1);
  const losses = live.filter(r => r.won === 0);
  report.push(`| Feature           | β        | Avg contrib (WIN) | Avg contrib (LOSS) | Δ (WIN − LOSS) | Verdict |`);
  report.push(`|-------------------|----------|-------------------|--------------------|----------------|---------|`);
  for (const fm of ACTIVE_FEATURE_META) {
    const winContrib = avg(wins.map(r => (r.agsComponents[fm.key] ?? 0) * fm.weight).filter(Number.isFinite));
    const lossContrib = avg(losses.map(r => (r.agsComponents[fm.key] ?? 0) * fm.weight).filter(Number.isFinite));
    const delta = winContrib - lossContrib;
    const verdict = Math.abs(delta) < 0.01 ? '🟡 neutral' : delta > 0 ? '🟢 helping' : '🚨 hurting';
    report.push(`| ${fm.label.padEnd(17)} | ${fmtSigned(fm.weight, 4).padStart(8)} | ${fmtSigned(winContrib, 3).padStart(17)} | ${fmtSigned(lossContrib, 3).padStart(18)} | ${fmtSigned(delta, 3).padStart(14)} | ${verdict.padEnd(7)} |`);
  }
  report.push('');
  report.push(`> Contribution = β · z(feature). The sum across all features (plus intercept) is the AGS-U score. A feature is "helping" if its average contribution is higher on winners than losers — i.e. the feature is correctly orienting the score.`);
  report.push('');
}

function buildHcCrossTab(report, rows) {
  report.push(`## § 4 — Multivariate Cross-Tabs`);
  report.push('');
  report.push(`AGS-U is the composite, but HC margin is a single-feature signal we still track independently. Does HC margin add or subtract value WITHIN each tier?`);
  report.push('');
  report.push(`### Tier × HC margin`);
  report.push('');
  report.push(`| Tier     | HC ≤ 0       | HC = +1      | HC ≥ +2      | All          |`);
  report.push(`|----------|--------------|--------------|--------------|--------------|`);
  for (const tier of TIER_ORDER) {
    const tRows = rows.filter(r => r.agsTier === tier);
    if (tRows.length === 0) continue;
    const buckets = [
      ['HC ≤ 0',  tRows.filter(r => r.hcMargin <= 0)],
      ['HC = +1', tRows.filter(r => r.hcMargin === 1)],
      ['HC ≥ +2', tRows.filter(r => r.hcMargin >= 2)],
      ['All',     tRows],
    ];
    const cells = buckets.map(([_, sub]) => {
      const a = aggregate(sub);
      return a.n > 0 ? `${a.n}n ${pct(a.w, a.n)} ${a.roi != null ? (a.roi>=0?'+':'') + a.roi.toFixed(0)+'%' : '—'}` : '—';
    });
    report.push(`| ${tier.padEnd(8)} | ${cells[0].padEnd(12)} | ${cells[1].padEnd(12)} | ${cells[2].padEnd(12)} | ${cells[3].padEnd(12)} |`);
  }
  report.push('');
  report.push(`### Tier × Sport (all-time)`);
  report.push('');
  const sports = [...new Set(rows.map(r => r.sport))].sort();
  const head = `| Tier     | ${sports.map(s => s.padEnd(14)).join(' | ')} | All          |`;
  report.push(head);
  report.push(`|----------|${sports.map(() => '----------------').join('|')}|--------------|`);
  for (const tier of TIER_ORDER) {
    const tRows = rows.filter(r => r.agsTier === tier);
    if (tRows.length === 0) continue;
    const cells = sports.map(s => {
      const a = aggregate(tRows.filter(r => r.sport === s));
      return a.n > 0 ? `${a.n}n ${pct(a.w, a.n)} ${a.roi != null ? (a.roi>=0?'+':'') + a.roi.toFixed(0)+'%' : '—'}` : '—';
    });
    const all = aggregate(tRows);
    cells.push(`${all.n}n ${pct(all.w, all.n)} ${all.roi != null ? (all.roi>=0?'+':'') + all.roi.toFixed(0)+'%' : '—'}`);
    report.push(`| ${tier.padEnd(8)} | ${cells.map(c => c.padEnd(14)).join(' | ')} |`);
  }
  report.push('');
  report.push(`### Tier × Odds Band (all-time)`);
  report.push('');
  const bands = ['HEAVY_FAV', 'MOD_FAV', 'PICK_EM', 'MOD_DOG', 'LONG_DOG'];
  report.push(`| Tier     | ${bands.map(b => b.padEnd(13)).join(' | ')} |`);
  report.push(`|----------|${bands.map(() => '---------------').join('|')}|`);
  for (const tier of TIER_ORDER) {
    const tRows = rows.filter(r => r.agsTier === tier);
    if (tRows.length === 0) continue;
    const cells = bands.map(b => {
      const a = aggregate(tRows.filter(r => r.oddsBand === b));
      return a.n > 0 ? `${a.n}n ${pct(a.w, a.n)} ${a.roi != null ? (a.roi>=0?'+':'') + a.roi.toFixed(0)+'%' : '—'}` : '—';
    });
    report.push(`| ${tier.padEnd(8)} | ${cells.map(c => c.padEnd(13)).join(' | ')} |`);
  }
  report.push('');
}

function buildReliability(report, rows) {
  report.push(`## § 5 — Calibration Reliability (band × realized)`);
  report.push('');
  report.push(`Slice AGS-U into bands derived from the LIVE calibration and compare average implied probability (from market odds) to realized win rate. **Realized > Implied** = AGS-U finds edge the market doesn't price; **Realized ≈ Implied** = AGS-U is just re-stating favorite-ness; **Realized < Implied** = anti-edge.`);
  report.push('');
  // Use the live calibration quintiles to build the bands instead of hardcoded
  // v9 numbers that don't apply to the new score scale.
  const q = AGS_FALLBACK_CALIBRATION.quintiles;
  const bands = [
    { label: `≥ q90 (≥ ${fmtSigned(q.q90, 2)})`, lo: q.q90, hi: Infinity },
    { label: `q80–q90`, lo: q.q80, hi: q.q90 },
    { label: `q60–q80`, lo: q.q60, hi: q.q80 },
    { label: `q40–q60`, lo: q.q40, hi: q.q60 },
    { label: `q20–q40`, lo: q.q20, hi: q.q40 },
    { label: `< q20 (< ${fmtSigned(q.q20, 2)})`, lo: -Infinity, hi: q.q20 },
  ];
  report.push(`| AGS-U Band       | N    | Realized Win | Model P(WIN) | Implied Win | Edge (R−I)  | ROI       |`);
  report.push(`|------------------|------|--------------|--------------|-------------|-------------|-----------|`);
  const realized = [], implied = [];
  for (const b of bands) {
    const sub = rows.filter(r => Number.isFinite(r.ags) && r.ags >= b.lo && r.ags < b.hi);
    const agg = aggregate(sub);
    const impP = sub.map(r => americanToImplied(r.lockOdds || r.peakOdds)).filter(Number.isFinite);
    const impAvg = impP.length ? avg(impP) : null;
    const realAvg = agg.realWinRate;
    const modelP = sub.length ? avg(sub.map(r => sigmoid(r.ags))) : null;
    const edge = (realAvg != null && impAvg != null) ? (realAvg - impAvg) * 100 : null;
    if (realAvg != null && impAvg != null) { realized.push(realAvg); implied.push(impAvg); }
    report.push(`| ${b.label.padEnd(16)} | ${String(agg.n).padStart(4)} | ${(realAvg != null ? (realAvg*100).toFixed(1)+'%' : '—').padStart(12)}`
      + ` | ${(modelP != null ? (modelP*100).toFixed(1)+'%' : '—').padStart(12)}`
      + ` | ${(impAvg != null ? (impAvg*100).toFixed(1)+'%' : '—').padStart(11)}`
      + ` | ${(edge != null ? (edge>=0?'+':'') + edge.toFixed(1)+'pp' : '—').padStart(11)} | ${(agg.roi != null ? agg.roi.toFixed(1)+'%' : '—').padStart(9)} |`);
  }
  const allRows = rows.filter(r => Number.isFinite(r.ags));
  const brierImp = brierScore(
    allRows.map(r => americanToImplied(r.lockOdds || r.peakOdds)).filter(Number.isFinite),
    allRows.map(r => r.won),
  );
  const brierModel = brierScore(allRows.map(r => sigmoid(r.ags)), allRows.map(r => r.won));
  report.push('');
  report.push(`**Brier — model:** ${fmtN(brierModel, 4)}  ·  **Brier — market-implied:** ${fmtN(brierImp, 4)} (lower = better; 0.25 = coin-flip prior). Δ = ${brierModel != null && brierImp != null ? fmtSigned(brierImp - brierModel, 4) : '—'} (positive = model beats market).`);
  if (realized.length >= 3) {
    report.push(`**Edge correlation (realized vs implied):** Spearman ρ = ${fmtN(spearman(implied, realized), 3)}.`);
  }
  report.push('');
}

// ─────────────────────────────────────────────────────────────────────────
// V12 PARALLEL SECTIONS
// ─────────────────────────────────────────────────────────────────────────
// These mirror §1 / §2 / §5 but use v12 stamps (v8_agsV12, v8_agsV12Tier,
// v8_agsV12Quintile) instead of v11 stamps. They render iff at least one
// pick in the sample has v12 stamps; otherwise they emit a short note so
// the section anchors stay stable.

function v12Rows(rows) {
  return rows.filter(r => Number.isFinite(r.agsV12));
}

function buildTierCalibrationV12(report, rows, liveCal) {
  report.push(`## § 1b — V12 Tier Calibration (wallet-quality model)`);
  report.push('');
  const sub = v12Rows(rows);
  if (sub.length === 0) {
    report.push(`_(no graded picks yet stamped under v12 — back-fill scoring + grading will populate this section)_`);
    report.push('');
    return;
  }
  report.push(`Same monotonicity test as §1, but on the **v12 wallet-quality model**. Tiers are derived from \`v8_agsV12Tier\` (cron-stamped). The v12 ladder is **ABSOLUTE units** (no per-market base), so per-tier "Avg Stake" should equal the ladder value exactly when sizing is healthy.`);
  report.push('');
  report.push(`### All-time tier breakdown (v12-scored picks only)`);
  report.push('');
  report.push(`| Tier     | Band                 | Ladder | N    | W-L    | Win %  | ROI       | PnL (u)    | Avg AGS-v12 | Avg Stake |`);
  report.push(`|----------|----------------------|--------|------|--------|--------|-----------|------------|-------------|-----------|`);
  const tierStats = {};
  for (const tier of TIER_ORDER) {
    const tierRows = sub.filter(r => r.agsV12Tier === tier);
    const agg = aggregate(tierRows);
    tierStats[tier] = agg;
    const avgAgs = tierRows.length ? avg(tierRows.map(r => r.agsV12).filter(Number.isFinite)) : null;
    const ladderUnits = V12_TIER_UNITS[tier].toFixed(2) + 'u';
    report.push(`| ${tier.padEnd(8)} | ${V12_TIER_QUINTILE_LABEL[tier].padEnd(20)} | ${ladderUnits.padStart(6)}`
      + ` | ${String(agg.n).padStart(4)} | ${(agg.w+'-'+agg.l).padEnd(6)} | ${pct(agg.w, agg.n).padStart(6)} | ${(agg.roi != null ? agg.roi.toFixed(1)+'%' : '—').padStart(9)}`
      + ` | ${fmtSigned(agg.profit).padStart(10)} | ${(avgAgs != null ? fmtSigned(avgAgs, 3) : '—').padStart(11)}`
      + ` | ${(agg.totalStake > 0 ? (agg.totalStake/agg.n).toFixed(2)+'u' : '—').padStart(9)} |`);
  }
  // Monotonicity on POSITIVE tiers only (FADE = MUTE rule, not a calibration tier).
  const positiveTiers = ['ELITE', 'PREMIUM', 'LOCK', 'LEAN', 'WEAK'];
  const winRates = positiveTiers.filter(t => tierStats[t].n > 0).map(t => tierStats[t].realWinRate ?? 0);
  const rois = positiveTiers.filter(t => tierStats[t].n > 0).map(t => tierStats[t].roi ?? 0);
  const winMono = monoScore(winRates);
  const roiMono = monoScore(rois);
  report.push('');
  if (winRates.length >= 2) {
    report.push(`**Monotonicity score** (positive tiers ELITE→WEAK only; FADE excluded — mute is a rule, not a tier):`);
    report.push(`- Win % across tiers: \`${winMono}\` ${winMono <= -(winRates.length-2) ? '🟢 monotonic — wallet-quality ladder is sorting correctly' : winMono === 0 ? '🟡 random — wallet-quality model not separating' : winMono >= 1 ? '🚨 inverted — top tiers winning LESS than bottom' : '🟡 partial — ladder mostly works but has noise'}`);
    report.push(`- ROI across tiers:   \`${roiMono}\` ${roiMono <= -(rois.length-2) ? '🟢 monotonic — absolute-units ladder is capturing edge' : roiMono === 0 ? '🟡 sizing not amplifying edge' : roiMono >= 1 ? '🚨 inverted — top of ladder bleeding' : '🟡 partial'}`);
    report.push('');
  }
  // Mute-rule sanity: FADE-tier picks SHOULD be at 0u (mute rule). Surface stake leaks.
  const fadeWithStake = sub.filter(r => r.agsV12Tier === 'FADE' && r.units > 0);
  if (fadeWithStake.length > 0) {
    report.push(`> 🚨 **${fadeWithStake.length} FADE-tier picks shipped at > 0u** — the v12 mute rule (score ≤ 0 → 0 units) was bypassed. Investigate \`unitsFromAgsV12\` in syncPickStateAuthoritative.`);
    report.push('');
  }
}

function buildQuintileCalibrationV12(report, rows, liveCal) {
  report.push(`## § 2b — V12 Quintile Calibration`);
  report.push('');
  const sub = v12Rows(rows).filter(r => r.agsV12Quintile != null && r.agsV12Quintile >= 1 && r.agsV12Quintile <= 5);
  if (sub.length === 0) {
    report.push(`_(no graded v12 picks in the positive-score region yet)_`);
    report.push('');
    return;
  }
  report.push(`Quintile bucketing of v12 score — but the v12 sample is **positive-only** (score ≤ 0 is muted by rule, not assigned to a quintile). Q5 = highest v12 score. Implied (from odds) tests whether the v12 score is just re-stating favorite-ness or finding a real edge.`);
  report.push('');
  const quintiles = [1, 2, 3, 4, 5];
  report.push(`| Quintile | Band              | N    | W-L    | Win %  | ROI       | PnL (u)    | Avg v12 | Implied (from odds) |`);
  report.push(`|----------|-------------------|------|--------|--------|-----------|------------|---------|---------------------|`);
  const winRates = [];
  const cal = (liveCal?.v12Quintiles) ? liveCal : AGS_V12_FALLBACK_CALIBRATION;
  const qBands = {
    1: `(0, ${fmtN(cal.v12Quintiles.q20, 3)}]`,
    2: `(${fmtN(cal.v12Quintiles.q20, 3)}, ${fmtN(cal.v12Quintiles.q40, 3)}]`,
    3: `(${fmtN(cal.v12Quintiles.q40, 3)}, ${fmtN(cal.v12Quintiles.q60, 3)}]`,
    4: `(${fmtN(cal.v12Quintiles.q60, 3)}, ${fmtN(cal.v12Quintiles.q80, 3)}]`,
    5: `> ${fmtN(cal.v12Quintiles.q80, 3)}`,
  };
  for (const q of quintiles) {
    const qRows = sub.filter(r => r.agsV12Quintile === q);
    const agg = aggregate(qRows);
    const avgAgs = qRows.length ? avg(qRows.map(r => r.agsV12).filter(Number.isFinite)) : null;
    const impliedProbs = qRows.map(r => americanToImplied(r.lockOdds || r.peakOdds)).filter(Number.isFinite);
    const avgImplied = impliedProbs.length ? avg(impliedProbs) * 100 : null;
    if (agg.realWinRate != null) winRates.push(agg.realWinRate);
    report.push(`| Q${q}       | ${(qBands[q] || '—').padEnd(17)} | ${String(agg.n).padStart(4)} | ${(agg.w+'-'+agg.l).padEnd(6)} | ${pct(agg.w, agg.n).padStart(6)} | ${(agg.roi != null ? agg.roi.toFixed(1)+'%' : '—').padStart(9)}`
      + ` | ${fmtSigned(agg.profit).padStart(10)} | ${(avgAgs != null ? fmtN(avgAgs, 3) : '—').padStart(7)}`
      + ` | ${(avgImplied != null ? avgImplied.toFixed(1)+'%' : '—').padStart(19)} |`);
  }
  const mono = monoScore(winRates);
  report.push('');
  if (winRates.length >= 3) {
    report.push(`**Spearman ρ (quintile vs realized win%):** ${fmtN(spearman(quintiles.slice(0, winRates.length), winRates), 3)}  ·  monotonicity \`${mono}/${winRates.length-1}\``);
  } else {
    report.push(`(need ≥ 3 populated quintiles for monotonicity)`);
  }
  report.push('');
  // Mute-validation companion: how many picks were muted (score ≤ 0) vs shipped (score > 0)?
  const allV12 = v12Rows(rows);
  const muted = allV12.filter(r => r.agsV12Quintile === 0 || r.agsV12 <= 0);
  const shipped = allV12.filter(r => r.agsV12 > 0);
  report.push(`> **Mute-rule split:** ${muted.length} picks muted (score ≤ 0) · ${shipped.length} picks ladder-eligible (score > 0). Mute share = ${pct(muted.length, allV12.length)}.`);
  report.push('');
}

function buildReliabilityV12(report, rows, liveCal) {
  report.push(`## § 5b — V12 Calibration Reliability (band × realized)`);
  report.push('');
  const sub = v12Rows(rows).filter(r => Number.isFinite(r.agsV12) && r.won != null);
  if (sub.length === 0) {
    report.push(`_(no graded v12 picks with outcomes)_`);
    report.push('');
    return;
  }
  report.push(`Slice v12 score into bands derived from the LIVE v12 calibration (\`v12Quintiles\`). **Realized > Implied** = v12 finds edge the market doesn't price.`);
  report.push('');
  const cal = (liveCal?.v12Quintiles) ? liveCal : AGS_V12_FALLBACK_CALIBRATION;
  const q = cal.v12Quintiles;
  const bands = [
    { label: `> q80 (> ${fmtN(q.q80, 3)})`, lo: q.q80, hi: Infinity },
    { label: `q60–q80`, lo: q.q60, hi: q.q80 },
    { label: `q40–q60`, lo: q.q40, hi: q.q60 },
    { label: `q20–q40`, lo: q.q20, hi: q.q40 },
    { label: `(0, q20]`, lo: 0, hi: q.q20 },
    { label: `≤ 0 (MUTE)`, lo: -Infinity, hi: 0 },
  ];
  report.push(`| v12 Band         | N    | Realized Win | Implied Win | Edge (R−I)  | ROI       |`);
  report.push(`|------------------|------|--------------|-------------|-------------|-----------|`);
  for (const b of bands) {
    const inBand = sub.filter(r => {
      if (b.lo === -Infinity) return r.agsV12 <= b.hi;
      if (b.hi === Infinity)  return r.agsV12 >  b.lo;
      return r.agsV12 > b.lo && r.agsV12 <= b.hi;
    });
    // Count is graded picks in band (live + tracked both have outcomes — the
    // calibration question is "does the score predict outcome" regardless of
    // whether we shipped real money).
    const bandN = inBand.length;
    const winsInBand = inBand.filter(r => r.won === 1).length;
    const realAvg = bandN > 0 ? winsInBand / bandN : null;
    // Use aggregate for ROI (which respects tracked vs live PnL math).
    const agg = aggregate(inBand);
    const impP = bandN > 0 ? inBand.map(r => americanToImplied(r.lockOdds || r.peakOdds)).filter(Number.isFinite) : [];
    const impAvg = impP.length ? avg(impP) : null;
    const edge = (realAvg != null && impAvg != null) ? (realAvg - impAvg) * 100 : null;
    report.push(`| ${b.label.padEnd(16)} | ${String(bandN).padStart(4)} | ${(realAvg != null ? (realAvg*100).toFixed(1)+'%' : '—').padStart(12)}`
      + ` | ${(impAvg != null ? (impAvg*100).toFixed(1)+'%' : '—').padStart(11)}`
      + ` | ${(edge != null ? (edge>=0?'+':'') + edge.toFixed(1)+'pp' : '—').padStart(11)} | ${(agg.roi != null ? agg.roi.toFixed(1)+'%' : '—').padStart(9)} |`);
  }
  report.push('');
  report.push(`> The MUTE row (≤ 0) shows what would have happened if the v12 mute rule didn't fire. If that band wins at > 52%, the mute rule is too aggressive.`);
  report.push('');
}

function buildRecentPicks(report, rows, n) {
  report.push(`## § 6 — Recent Picks (Last ${n})`);
  report.push('');
  report.push(`Most-recent graded AGS-U picks. v11 and v12 scores are shown side-by-side; **Δ** flags rows where the two models disagree on tier (a high-value debugging signal during the v11→v12 transition).`);
  report.push('');
  const recent = rows.slice(-n).reverse();
  report.push(`| Date       | Sport | Mkt    | Team / Side             | Odds  | Stake  | v11 AGS | v11 Tier | v12 AGS | v12 Tier | Δ | Outcome | PnL (u)    | CLV    |`);
  report.push(`|------------|-------|--------|-------------------------|-------|--------|---------|----------|---------|----------|---|---------|------------|--------|`);
  for (const r of recent) {
    const teamLabel = `${r.team || r.sideKey}`.substring(0, 23);
    const oddsStr = r.peakOdds > 0 ? `+${r.peakOdds}` : `${r.peakOdds}`;
    const outcomeStr = r.tracked ? 'TRACKED' : (r.won === 1 ? 'WIN' : 'LOSS');
    const profitStr = r.tracked ? '0.00u' : fmtSigned(r.profit) + 'u';
    const clvStr = r.clv != null ? fmtSigned(r.clv * 100, 1) + '%' : '—';
    const v11AgsStr = Number.isFinite(r.ags) ? fmtSigned(r.ags) : '—';
    const v12AgsStr = Number.isFinite(r.agsV12) ? fmtSigned(r.agsV12, 3) : '—';
    const v11TierStr = r.agsTier || '—';
    const v12TierStr = r.agsV12Tier || '—';
    // Disagreement marker — only meaningful when BOTH versions stamped the pick.
    let deltaFlag = ' ';
    if (r.agsTier && r.agsV12Tier && r.agsTier !== r.agsV12Tier) {
      const v11Pos = TIER_ORDER.indexOf(r.agsTier);
      const v12Pos = TIER_ORDER.indexOf(r.agsV12Tier);
      if (v11Pos >= 0 && v12Pos >= 0) {
        deltaFlag = v12Pos < v11Pos ? '▲' : '▼';  // ▲ = v12 stronger, ▼ = v12 weaker
      } else {
        deltaFlag = '≠';
      }
    }
    report.push(`| ${r.date.padEnd(10)} | ${(r.sport || '').padEnd(5)} | ${(r.marketType || '').padEnd(6)} | ${teamLabel.padEnd(23)}`
      + ` | ${oddsStr.padStart(5)} | ${(r.units.toFixed(2)+'u').padStart(6)}`
      + ` | ${v11AgsStr.padStart(7)} | ${v11TierStr.padEnd(8)}`
      + ` | ${v12AgsStr.padStart(7)} | ${v12TierStr.padEnd(8)} | ${deltaFlag}`
      + ` | ${outcomeStr.padEnd(7)} | ${profitStr.padStart(10)} | ${clvStr.padStart(6)} |`);
  }
  report.push('');
  report.push(`> Δ column: \`▲\` v12 tier > v11 tier (v12 likes the pick more) · \`▼\` v12 tier < v11 tier · \`≠\` non-comparable disagreement (one side FADE) · blank = agree or only one model stamped. Pick rows where Δ is set and the OUTCOME contradicts v12 are the highest-priority debugging targets.`);
  report.push('');
}

function buildSizingAudit(report, rows) {
  report.push(`## § 7 — Sizing Audit`);
  report.push('');
  report.push(`Does the AGS-U sizing ladder actually capture more edge per unit at the top? If **Per-unit Return** is FLAT across tiers, we're just risking more on the same edge — and a flat-stake strategy would beat the laddered one. **Expected stake** is the ladder's target for that tier; **Avg stake actual** is the realized average. Drift between the two is a sizing-pipeline regression.`);
  report.push('');
  report.push(`### v11 ladder (legacy — multipliers × per-market base)`);
  report.push('');
  report.push(`| Tier     | N    | Total Stake | Avg stake | Expected | PnL (u)    | ROI %     | PnL / pick | Per-unit Return |`);
  report.push(`|----------|------|-------------|-----------|----------|------------|-----------|------------|-----------------|`);
  for (const tier of TIER_ORDER) {
    const tRows = rows.filter(r => r.agsTier === tier);
    const agg = aggregate(tRows);
    if (agg.n === 0) continue;
    const perUnit = agg.totalStake > 0 ? agg.profit / agg.totalStake : null;
    const avgStake = agg.n > 0 ? agg.totalStake / agg.n : null;
    const expected = `${TIER_MULT[tier].toFixed(2)}× base`;
    report.push(`| ${tier.padEnd(8)} | ${String(agg.n).padStart(4)} | ${agg.totalStake.toFixed(2).padStart(11)} | ${(avgStake != null ? avgStake.toFixed(2)+'u' : '—').padStart(9)} | ${expected.padStart(8)} | ${fmtSigned(agg.profit).padStart(10)}`
      + ` | ${(agg.roi != null ? agg.roi.toFixed(1)+'%' : '—').padStart(9)} | ${(agg.flat != null ? fmtSigned(agg.flat) : '—').padStart(10)}`
      + ` | ${(perUnit != null ? fmtSigned(perUnit, 3) : '—').padStart(15)} |`);
  }
  report.push('');

  // v12 ladder — only render when there's at least one v12 pick.
  const v12Sub = v12Rows(rows);
  if (v12Sub.length > 0) {
    report.push(`### v12 ladder (active — absolute units, mute-by-rule below zero)`);
    report.push('');
    report.push(`| Tier     | N    | Total Stake | Avg stake | Expected | PnL (u)    | ROI %     | PnL / pick | Per-unit Return |`);
    report.push(`|----------|------|-------------|-----------|----------|------------|-----------|------------|-----------------|`);
    for (const tier of TIER_ORDER) {
      const tRows = v12Sub.filter(r => r.agsV12Tier === tier);
      const agg = aggregate(tRows);
      if (agg.n === 0) continue;
      const perUnit = agg.totalStake > 0 ? agg.profit / agg.totalStake : null;
      const avgStake = agg.n > 0 ? agg.totalStake / agg.n : null;
      const expected = `${V12_TIER_UNITS[tier].toFixed(2)}u`;
      const drift = (avgStake != null && tier !== 'FADE')
        ? Math.abs(avgStake - V12_TIER_UNITS[tier])
        : 0;
      const driftFlag = drift > 0.05 ? ' 🚨' : '';
      report.push(`| ${tier.padEnd(8)} | ${String(agg.n).padStart(4)} | ${agg.totalStake.toFixed(2).padStart(11)} | ${(avgStake != null ? avgStake.toFixed(2)+'u'+driftFlag : '—').padStart(9)} | ${expected.padStart(8)} | ${fmtSigned(agg.profit).padStart(10)}`
        + ` | ${(agg.roi != null ? agg.roi.toFixed(1)+'%' : '—').padStart(9)} | ${(agg.flat != null ? fmtSigned(agg.flat) : '—').padStart(10)}`
        + ` | ${(perUnit != null ? fmtSigned(perUnit, 3) : '—').padStart(15)} |`);
    }
    report.push('');
    report.push(`> 🚨 in **Avg stake** column = realized average differs from expected ladder value by > 0.05u. Causes: odds-cap on heavy underdogs (legitimate), per-market override (legitimate for futures), \`unitsFromAgsV12\` bug (debug \`syncPickStateAuthoritative.js\`).`);
    report.push('');
  }

  report.push(`> If **Per-unit Return** is materially higher for ELITE than for WEAK/LEAN, the ladder is justified. If they're within ~5%, the ladder is risking more capital for the same return per dollar.`);
  report.push('');
}

function buildMuteValidation(report, allRows, liveCal) {
  report.push(`## § 8 — SHADOW / Hard-Mute Validation`);
  report.push('');

  // ── v11 mute floor (legacy) ────────────────────────────────────────
  const q20 = liveCal?.quintiles?.q20 ?? AGS_FALLBACK_CALIBRATION.quintiles.q20;
  report.push(`### v11 mute floor (calibration-based, q20 = ${fmtSigned(q20, 3)})`);
  report.push('');
  report.push(`Below-q20 v11 AGS-U values are SHADOWed (never shipped under v11). We validate the floor by looking at sides that WOULD HAVE GRADED if shipped — if they lose at >50%, the mute is working.`);
  report.push('');
  const shadowRows = allRows.filter(r => Number.isFinite(r.ags) && r.ags < q20 && r.won != null);
  if (shadowRows.length === 0) {
    report.push(`No SHADOWed graded picks in the sample. v11 mute floor untestable.`);
    report.push('');
  } else {
    const wouldHaveAgg = aggregate(shadowRows.map(r => ({ ...r, tracked: false, units: 1.0, profit: r.won ? (r.peakOdds < 0 ? 100/Math.abs(r.peakOdds) : r.peakOdds/100) : -1 })));
    report.push(`**Below-q20 SHADOWed picks that would have graded at a flat 1u stake:**`);
    report.push('');
    report.push(`- N: **${wouldHaveAgg.n}** · Win rate: **${pct(wouldHaveAgg.w, wouldHaveAgg.n)}** · Flat-1u PnL: **${fmtSigned(wouldHaveAgg.profit)}u** · ROI: **${wouldHaveAgg.roi != null ? wouldHaveAgg.roi.toFixed(1)+'%' : '—'}**`);
    const verdict = wouldHaveAgg.realWinRate != null
      ? (wouldHaveAgg.realWinRate < 0.45
          ? '🟢 Mute floor is working — SHADOWed picks lose at <45%.'
          : wouldHaveAgg.realWinRate < 0.52
          ? '🟡 Mute floor is borderline — SHADOWed picks land near break-even.'
          : '🚨 Mute floor may be too aggressive — SHADOWed picks win at ≥52%.')
      : '—';
    report.push(`- Verdict: ${verdict}`);
    report.push('');
  }

  // ── v12 mute RULE (score ≤ 0) ──────────────────────────────────────
  const v12Sub = allRows.filter(r => Number.isFinite(r.agsV12) && r.won != null);
  if (v12Sub.length > 0) {
    report.push(`### v12 mute rule (score ≤ 0 → FADE → 0 units)`);
    report.push('');
    report.push(`v12 has no calibrated mute floor — the rule IS the gate. A pick with v12 score ≤ 0 is FADE and gets 0 units regardless of v11 tier. We validate the rule by grading what muted picks WOULD have returned at a flat 1u.`);
    report.push('');
    const v12Muted = v12Sub.filter(r => r.agsV12 <= 0);
    const v12Live  = v12Sub.filter(r => r.agsV12 > 0);
    const mutedFlatAgg = aggregate(v12Muted.map(r => ({
      ...r, tracked: false, units: 1.0,
      profit: r.won ? (r.peakOdds < 0 ? 100/Math.abs(r.peakOdds) : r.peakOdds/100) : -1,
    })));
    const liveFlatAgg = aggregate(v12Live.map(r => ({
      ...r, tracked: false, units: 1.0,
      profit: r.won ? (r.peakOdds < 0 ? 100/Math.abs(r.peakOdds) : r.peakOdds/100) : -1,
    })));
    report.push(`| Population             | N    | Win %  | Flat-1u PnL | Flat ROI  |`);
    report.push(`|------------------------|------|--------|-------------|-----------|`);
    report.push(`| v12 muted (score ≤ 0) | ${String(mutedFlatAgg.n).padStart(4)} | ${pct(mutedFlatAgg.w, mutedFlatAgg.n).padStart(6)} | ${fmtSigned(mutedFlatAgg.profit).padStart(11)} | ${(mutedFlatAgg.roi != null ? mutedFlatAgg.roi.toFixed(1)+'%' : '—').padStart(9)} |`);
    report.push(`| v12 live  (score > 0) | ${String(liveFlatAgg.n).padStart(4)} | ${pct(liveFlatAgg.w, liveFlatAgg.n).padStart(6)} | ${fmtSigned(liveFlatAgg.profit).padStart(11)} | ${(liveFlatAgg.roi != null ? liveFlatAgg.roi.toFixed(1)+'%' : '—').padStart(9)} |`);
    report.push('');
    const v12Verdict = (mutedFlatAgg.realWinRate != null && liveFlatAgg.realWinRate != null)
      ? (liveFlatAgg.realWinRate > mutedFlatAgg.realWinRate + 0.03
          ? '🟢 v12 mute rule is **discriminating** — live picks win materially more than muted picks at flat stake.'
          : Math.abs(liveFlatAgg.realWinRate - mutedFlatAgg.realWinRate) <= 0.03
          ? '🟡 v12 mute rule is **break-even** — live and muted populations win at similar rates. Wallet-quality features may need re-tuning.'
          : '🚨 v12 mute rule is **inverted** — muted picks are winning MORE than live picks. The mute rule is throwing away edge.')
      : '_(insufficient sample to evaluate)_';
    report.push(`- Verdict: ${v12Verdict}`);
    report.push('');
  }
}

function buildDailyTrend(report, rows) {
  report.push(`## § 9 — Daily Trend (cumulative PnL)`);
  report.push('');
  const byDate = new Map();
  for (const r of rows) {
    if (!byDate.has(r.date)) byDate.set(r.date, []);
    byDate.get(r.date).push(r);
  }
  const dates = [...byDate.keys()].sort();
  if (dates.length === 0) {
    report.push(`No data.`);
    report.push('');
    return;
  }
  let cumProfit = 0, cumN = 0, cumW = 0;
  report.push(`| Date       | Live | W-L   | Win %  | Daily PnL  | Cum PnL    | Cum Win % | Trk | Bar                  |`);
  report.push(`|------------|------|-------|--------|------------|------------|-----------|-----|----------------------|`);
  let runningProfits = [];
  let rolling = 0;
  for (const d of dates) {
    const dayAgg = aggregate(byDate.get(d));
    rolling += dayAgg.profit;
    runningProfits.push(rolling);
  }
  const maxAbs = Math.max(1, ...runningProfits.map(p => Math.abs(p)));
  const barWidth = 20;
  for (let i = 0; i < dates.length; i++) {
    const d = dates[i];
    const dayAgg = aggregate(byDate.get(d));
    cumProfit += dayAgg.profit;
    cumN += dayAgg.n;
    cumW += dayAgg.w;
    const barLen = Math.round((Math.abs(cumProfit) / maxAbs) * barWidth);
    const bar = cumProfit >= 0 ? '█'.repeat(barLen).padEnd(barWidth, ' ') : ' '.repeat(barWidth - barLen) + '▓'.repeat(barLen);
    report.push(`| ${d} | ${String(dayAgg.n).padStart(4)} | ${(dayAgg.w+'-'+dayAgg.l).padEnd(5)}`
      + ` | ${pct(dayAgg.w, dayAgg.n).padStart(6)} | ${fmtSigned(dayAgg.profit).padStart(10)}`
      + ` | ${fmtSigned(cumProfit).padStart(10)} | ${pct(cumW, cumN).padStart(9)} | ${String(dayAgg.trackedN || 0).padStart(3)} | ${bar} |`);
  }
  report.push('');
  report.push(`> **Live** = picks AGS-U shipped with units > 0 (matches dashboard). **Trk** = same-day FADE picks (0u, back-test only). Daily PnL and Win % cover Live picks only.`);
  report.push(`> Bar length is proportional to absolute cumulative PnL. \`█\` = positive, \`▓\` = negative.`);
  report.push('');
}

function buildOperationalHealth(report, allRows, agsuRows) {
  report.push(`## § 10 — Operational Health`);
  report.push('');
  const graded = allRows.filter(r => r.status === 'COMPLETED');
  const trackedShipped = graded.filter(r => r.tracked && r.units > 0);
  const trackedZero    = graded.filter(r => r.tracked && r.units === 0);
  const ungradedWithFinalUnits = allRows.filter(r => r.status !== 'COMPLETED' && r.units > 0);
  const missingAgs = allRows.filter(r => !Number.isFinite(r.ags));
  const missingTier = allRows.filter(r => !r.agsTier);
  const singleWalletShipped = allRows.filter(r => r.provenTotal != null && r.provenTotal === 1 && r.units > 0);

  // v11 sizing-pipeline regression: LOCKED picks at LOCK/PREMIUM/ELITE tier
  // but units = 0 (the bug discovered 2026-05-27). The cron computed strong
  // AGS-U but stamped v8_agsUnitsMult = 0, zeroing the stake.
  const sizingRegression = agsuRows.filter(r =>
    r.tracked && Number.isFinite(r.ags) && r.ags >= 0.10
    && r.agsTier && !['FADE', 'WEAK'].includes(r.agsTier)
  );

  // ── v12-specific health checks ─────────────────────────────────────
  // v12 picks (any row where the cron stamped v8_agsV12).
  const v12All = allRows.filter(r => Number.isFinite(r.agsV12));
  const v12Promoted = agsuRows.filter(r => Number.isFinite(r.agsV12));
  // 1. Picks where v12 says FADE/MUTED but lockStage is still LOCKED.
  //    These are picks the UI would show as "LOCKED IN" but the v12 cron has
  //    cancelled — exactly the bug class the user reported with the
  //    contradictory UI cards.
  const fadeButLocked = v12All.filter(r =>
    r.agsV12Tier === 'FADE'
    && (r.lockStage === 'LOCKED' || r.lockStage === 'LOCKED_PRELIM')
    && r.healthStatus !== 'MUTED' && r.healthStatus !== 'CANCELLED'
  );
  // 2. Picks where v8_agsV12UnitsApplied disagrees with finalUnits — i.e.
  //    the cron's v12 ladder value isn't what actually got shipped.
  const unitsMismatch = v12All.filter(r =>
    Number.isFinite(r.agsV12UnitsApplied)
    && r.units != null
    && Math.abs(Number(r.agsV12UnitsApplied) - Number(r.units)) > 0.01
    && r.units > 0  // ignore muted-by-other-reason rows
  );
  // 3. Picks scored under v12 but missing v8_agsV12Tier — cron stamped score
  //    but didn't classify tier (rare, indicates a partial write).
  const v12MissingTier = v12All.filter(r => Number.isFinite(r.agsV12) && !r.agsV12Tier);
  // 4. v11 vs v12 tier disagreement on LIVE-shipped (units > 0) picks. The
  //    delta column tells us where the two models materially diverge in
  //    production — useful for back-tests + sizing-impact attribution.
  const tierDisagreeShipped = agsuRows.filter(r =>
    r.units > 0 && r.agsTier && r.agsV12Tier && r.agsTier !== r.agsV12Tier
  );
  // 5. Stamp drift: the cron stamps `v8_agsTier` with the v12 tier. If
  //    that stamp differs from the v12 stamp, the cron's write is partial.
  const stampDrift = v12All.filter(r =>
    r.agsTierStamped && r.agsV12Tier && r.agsTierStamped !== r.agsV12Tier
  );

  report.push(`### v11 / cross-cutting checks`);
  report.push('');
  report.push(`| Check                                                          | Count | Verdict                                            |`);
  report.push(`|----------------------------------------------------------------|-------|----------------------------------------------------|`);
  report.push(`| Graded picks with \`tracked=true\` AND \`finalUnits > 0\`         | ${String(trackedShipped.length).padStart(5)} | ${trackedShipped.length === 0 ? '🟢 grader is correct' : '🚨 grader regression — see betTracking.js'} |`);
  report.push(`| Graded picks with \`tracked=true\` AND \`finalUnits == 0\`        | ${String(trackedZero.length).padStart(5)} | ${trackedZero.length === 0 ? '🟢 no zero-unit tracks' : '🟡 informational only — true tracked plays'} |`);
  report.push(`| LOCK+ v11 tier picks with \`finalUnits == 0\` (v11 sizing reg)  | ${String(sizingRegression.length).padStart(5)} | ${sizingRegression.length === 0 ? '🟢 v11 sizing pipeline healthy' : '🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U'} |`);
  report.push(`| Live picks (not graded yet) with \`finalUnits > 0\`             | ${String(ungradedWithFinalUnits.length).padStart(5)} | ${ungradedWithFinalUnits.length > 0 ? '🟢 picks queued for grading' : '🟡 no live shipped picks pending'} |`);
  report.push(`| AGS-U promoted picks missing \`v8_ags\` value                   | ${String(missingAgs.length).padStart(5)} | ${missingAgs.length === 0 ? '🟢 every pick has an AGS-U' : '🟡 some picks missing AGS-U — cron lag or stale doc'} |`);
  report.push(`| AGS-U promoted picks missing \`agsTier\`                        | ${String(missingTier.length).padStart(5)} | ${missingTier.length === 0 ? '🟢 every pick has a v11 tier' : '🟡 some picks missing v11 tier classification'} |`);
  report.push(`| Single-wallet shipped picks (\`provenWalletCount == 1\`)       | ${String(singleWalletShipped.length).padStart(5)} | 🟡 informational — AGS-U calibration controls sample adequacy |`);
  report.push('');

  // Only render v12 health block if v12 has stamped anything (otherwise the
  // numbers are misleading-by-omission rather than actionable).
  if (v12All.length > 0) {
    report.push(`### v12 health checks (${v12All.length} picks stamped under v12)`);
    report.push('');
    report.push(`| Check                                                          | Count | Verdict                                            |`);
    report.push(`|----------------------------------------------------------------|-------|----------------------------------------------------|`);
    report.push(`| v12 FADE-tier but \`lockStage=LOCKED\` (UI contradiction)      | ${String(fadeButLocked.length).padStart(5)} | ${fadeButLocked.length === 0 ? '🟢 no v12 FADE picks stuck in LOCKED state' : '🚨 syncPickStateAuthoritative not propagating v12 FADE to lockStage'} |`);
    report.push(`| \`v8_agsV12UnitsApplied\` ≠ \`finalUnits\` (ladder→ship drift)   | ${String(unitsMismatch.length).padStart(5)} | ${unitsMismatch.length === 0 ? '🟢 v12 ladder matches finalUnits exactly' : '🚨 v12 ladder value not propagating to finalUnits'} |`);
    report.push(`| v12-scored picks missing \`v8_agsV12Tier\`                      | ${String(v12MissingTier.length).padStart(5)} | ${v12MissingTier.length === 0 ? '🟢 every v12 pick has a tier' : '🟡 partial cron write — v12 score stamped without tier'} |`);
    report.push(`| \`v8_agsTier\` ≠ \`v8_agsV12Tier\` (cron stamp drift)            | ${String(stampDrift.length).padStart(5)} | ${stampDrift.length === 0 ? '🟢 v8_agsTier mirrors v12 tier exactly' : '🚨 syncPickStateAuthoritative partial write — UI may show wrong tier'} |`);
    report.push(`| v11 vs v12 tier disagreement on LIVE-shipped picks            | ${String(tierDisagreeShipped.length).padStart(5)} | ${tierDisagreeShipped.length === 0 ? '🟢 models agree on every shipped pick' : '🟡 informational — see §13 head-to-head for performance impact'} |`);
    report.push('');

    if (fadeButLocked.length > 0) {
      report.push(`**v12 FADE-but-LOCKED detail (these UI cards will display contradictory tags):**`);
      report.push('');
      report.push(`| Doc ID                              | Sport | v11 Tier | v12 Tier | v12 AGS | Stage    | Health  |`);
      report.push(`|-------------------------------------|-------|----------|----------|---------|----------|---------|`);
      for (const r of fadeButLocked.slice(0, 20)) {
        report.push(`| ${r.docId.padEnd(35)} | ${(r.sport||'').padEnd(5)} | ${(r.agsTier || '—').padEnd(8)} | ${(r.agsV12Tier || '—').padEnd(8)} | ${fmtSigned(r.agsV12, 3).padStart(7)} | ${(r.lockStage || '—').padEnd(8)} | ${(r.healthStatus || '—').padEnd(7)} |`);
      }
      report.push('');
    }

    if (unitsMismatch.length > 0) {
      report.push(`**v12 ladder ≠ finalUnits detail (sizing pipeline drift):**`);
      report.push('');
      report.push(`| Doc ID                              | Sport | v12 Tier | Ladder | Shipped | Δ      |`);
      report.push(`|-------------------------------------|-------|----------|--------|---------|--------|`);
      for (const r of unitsMismatch.slice(0, 20)) {
        const delta = (r.units || 0) - (r.agsV12UnitsApplied || 0);
        report.push(`| ${r.docId.padEnd(35)} | ${(r.sport||'').padEnd(5)} | ${(r.agsV12Tier || '—').padEnd(8)} | ${(Number(r.agsV12UnitsApplied).toFixed(2)+'u').padStart(6)} | ${(Number(r.units).toFixed(2)+'u').padStart(7)} | ${fmtSigned(delta, 2).padStart(6)} |`);
      }
      report.push('');
    }
  }

  if (trackedShipped.length > 0) {
    report.push(`**Tracked-shipped detail (these are the picks the grader wrongly marked 0u):**`);
    report.push('');
    report.push(`| Doc ID                              | Sport | Tier    | Units  | Outcome | Stamped Profit |`);
    report.push(`|-------------------------------------|-------|---------|--------|---------|----------------|`);
    for (const r of trackedShipped.slice(0, 20)) {
      report.push(`| ${r.docId.padEnd(35)} | ${(r.sport||'').padEnd(5)} | ${(r.agsTier || '—').padEnd(7)} | ${(r.units.toFixed(2)+'u').padStart(6)} | ${(r.won===1?'WIN':'LOSS').padEnd(7)} | ${fmtSigned(r.profit).padStart(14)}u |`);
    }
    report.push('');
  }

  if (sizingRegression.length > 0) {
    report.push(`**Sizing-regression detail (LOCK+ tier shipped at 0u — money left on the table):**`);
    report.push('');
    report.push(`| Doc ID                              | Sport | Tier    | AGS-U  | Outcome | "Lost" PnL (1u) |`);
    report.push(`|-------------------------------------|-------|---------|--------|---------|-----------------|`);
    for (const r of sizingRegression.slice(0, 30)) {
      const oneUnitPnl = r.won === 1
        ? (r.peakOdds < 0 ? 100 / Math.abs(r.peakOdds) : r.peakOdds / 100)
        : -1;
      report.push(`| ${r.docId.padEnd(35)} | ${(r.sport||'').padEnd(5)} | ${(r.agsTier || '—').padEnd(7)} | ${fmtSigned(r.ags).padStart(6)} | ${(r.won===1?'WIN':'LOSS').padEnd(7)} | ${fmtSigned(oneUnitPnl, 2).padStart(15)}u |`);
    }
    report.push('');
  }
}

function buildCalibrationSnapshot(report, liveCal) {
  report.push(`## § 11 — Calibration Snapshot`);
  report.push('');
  if (!liveCal) {
    report.push(`No \`agsCalibration/current\` document. The cron is running with the fallback constants in \`src/lib/ags.js\`.`);
    report.push('');
    return;
  }
  report.push(`Live calibration document used by both the cron and the UI:`);
  report.push('');
  report.push(`- **Computed at:** ${liveCal.computedAt || '—'}`);
  report.push(`- **Schema version:** \`${liveCal.schemaVersion || '—'}\``);
  report.push(`- **Source:** ${liveCal.source || '—'}`);
  report.push(`- **Sample size:** ${liveCal.sampleSize ?? '—'}${liveCal.totalSampleSize ? ` (positives) / ${liveCal.totalSampleSize} (all v9-graded picks in window)` : ''}`);
  report.push(`- **Date range:** ${liveCal.dateRange?.from || '—'} → ${liveCal.dateRange?.to || '—'}`);
  report.push(`- **v11 absolute mute floor:** ${fmtSigned(AGS_ABSOLUTE_MUTE_FLOOR, 2)} (safety bound below q20)`);
  report.push(`- **v12 mute rule:** \`score ≤ 0 → FADE → 0u\` (rule-based, no calibrated floor)`);
  report.push('');

  // ── v11 quintile boundaries (legacy / parallel) ────────────────────
  if (liveCal.quintiles) {
    report.push(`**v11 AGS-U quintile boundaries (logit-score space):**`);
    report.push('');
    report.push(`| Boundary | Value      | Action                |`);
    report.push(`|----------|------------|-----------------------|`);
    const labels = { q20: 'HARD MUTE floor', q40: 'LEAN floor (0.5×)', q50: '50th pctile', q60: 'LOCK floor (1.10×)', q80: 'PREMIUM floor (1.50×)', q90: 'ELITE floor (2.00×)' };
    for (const k of ['q20','q40','q50','q60','q80','q90']) {
      if (liveCal.quintiles[k] != null) {
        report.push(`| ${k.padEnd(8)} | ${fmtSigned(liveCal.quintiles[k], 4).padStart(10)} | ${(labels[k] || '').padEnd(21)} |`);
      }
    }
    report.push('');
  }

  // ── v12 quintile boundaries (active) ───────────────────────────────
  const v12Cal = liveCal.v12Quintiles ? liveCal : AGS_V12_FALLBACK_CALIBRATION;
  const v12CalSource = liveCal.v12Quintiles ? 'firestore (live)' : 'fallback (hardcoded in ags.js)';
  if (v12Cal.v12Quintiles) {
    report.push(`**v12 quintile boundaries (positive-score distribution, source: ${v12CalSource}):**`);
    report.push('');
    report.push(`| Boundary | Value      | Tier promoted | Units |`);
    report.push(`|----------|------------|---------------|-------|`);
    report.push(`| ≤ 0      | (rule)     | FADE          | 0.00  |`);
    if (v12Cal.v12Quintiles.q20 != null) report.push(`| q20      | ${fmtN(v12Cal.v12Quintiles.q20, 4).padStart(10)} | WEAK→LEAN     | 0.25→0.50 |`);
    if (v12Cal.v12Quintiles.q40 != null) report.push(`| q40      | ${fmtN(v12Cal.v12Quintiles.q40, 4).padStart(10)} | LEAN→LOCK     | 0.50→1.00 |`);
    if (v12Cal.v12Quintiles.q60 != null) report.push(`| q60      | ${fmtN(v12Cal.v12Quintiles.q60, 4).padStart(10)} | LOCK→PREMIUM  | 1.00→3.00 |`);
    if (v12Cal.v12Quintiles.q80 != null) report.push(`| q80      | ${fmtN(v12Cal.v12Quintiles.q80, 4).padStart(10)} | PREMIUM→ELITE | 3.00→5.00 |`);
    report.push('');
    if (!liveCal.v12Quintiles) {
      report.push(`> 🟡 **Live calibration doc has no \`v12Quintiles\` field** — the cron is using the fallback constants from \`src/lib/ags.js::AGS_V12_FALLBACK_CALIBRATION\`. Once \`computeAgsCalibration.js\` is updated to write v12 quintiles, this row will switch to "firestore (live)".`);
      report.push('');
    }
  }

  // ── v11 feature normalizers (still computed in parallel) ────────────
  if (liveCal.normalizers) {
    report.push(`**v11 feature normalizers (mean / sd) — z-scoring inputs to legacy logistic model:**`);
    report.push('');
    report.push(`| Feature           | β        | Mean   | SD     |`);
    report.push(`|-------------------|----------|--------|--------|`);
    for (const f of ACTIVE_FEATURE_META) {
      const n = liveCal.normalizers[f.key] || {};
      report.push(`| ${f.label.padEnd(17)} | ${fmtSigned(f.weight, 4).padStart(8)} | ${fmtN(n.mean).padStart(6)} | ${fmtN(n.sd).padStart(6)} |`);
    }
    report.push('');
  }
  if (liveCal.weights) {
    const driftKeys = ACTIVE_FEATURE_KEYS.filter(k => Math.abs((liveCal.weights[k] ?? 0) - (AGS_WEIGHTS[k] ?? 0)) > 1e-6);
    if (driftKeys.length > 0) {
      report.push(`> **⚠ v11 weight drift detected:** the calibration doc was written with different β coefficients than \`src/lib/ags.js\` exports. Re-deploy or re-run \`scripts/computeAgsCalibration.js\` to align: ${driftKeys.map(k => `\`${k}\``).join(', ')}.`);
      report.push('');
    } else {
      report.push(`> ✅ v11 calibration weights match \`src/lib/ags.js\` — no drift.`);
      report.push('');
    }
  }
}

function buildHeadToHeadV11V12(report, rows) {
  report.push(`## § 13 — V11 vs V12 Head-to-Head`);
  report.push('');
  // Pool: every pick that has BOTH a v11 ags AND a v12 ags stamped AND a
  // graded outcome. This is the only fair comparison set — picks with only
  // v11 stamps are pre-v12-rollout, picks with only v12 are partial writes.
  const dual = rows.filter(r =>
    Number.isFinite(r.ags)
    && Number.isFinite(r.agsV12)
    && r.won != null
  );
  if (dual.length === 0) {
    report.push(`_(no graded picks have BOTH v11 and v12 stamps yet — back-fill scoring will populate this section)_`);
    report.push('');
    return;
  }
  report.push(`The most actionable comparison: every pick that was scored under BOTH v11 and v12. Same realized outcome, same odds, two different model decisions. Tells us which model would have made more money on the same opportunity set.`);
  report.push('');
  report.push(`**Comparison pool:** ${dual.length} graded picks with both v11 + v12 stamps.`);
  report.push('');

  // ── Headline: which model ranked winners better? ───────────────────
  // Note: v11 score is a logit (→ sigmoid for probability); v12 score is a
  // mean-ratio in [-1, +1] that ISN'T a probability. So we report AUC and
  // point-biserial r (both rank-based, no probability calibration assumed)
  // and skip Brier for the v12 column — calling Brier on a non-probability
  // is misleading. Use AUC + flat-stake counterfactual PnL below for the
  // actionable comparison.
  report.push(`### Ranking quality on the shared pool`);
  report.push('');
  const v11Auc   = rocAuc(dual.map(r => r.ags), dual.map(r => r.won));
  const v12Auc   = rocAuc(dual.map(r => r.agsV12), dual.map(r => r.won));
  const v11Corr  = pointBiserial(dual.map(r => r.ags), dual.map(r => r.won));
  const v12Corr  = pointBiserial(dual.map(r => r.agsV12), dual.map(r => r.won));
  report.push(`| Model | AUC   | Pt-biserial r | Verdict |`);
  report.push(`|-------|-------|---------------|---------|`);
  const aucDelta = (v11Auc != null && v12Auc != null) ? v12Auc - v11Auc : null;
  const v11Verdict = aucDelta != null
    ? (aucDelta > 0.02 ? '⚪ worse ranker than v12' : Math.abs(aucDelta) <= 0.02 ? '🟡 tied' : '🟢 better ranker than v12')
    : '—';
  const v12Verdict = aucDelta != null
    ? (aucDelta > 0.02 ? '🟢 better ranker than v11' : Math.abs(aucDelta) <= 0.02 ? '🟡 tied' : '⚪ worse ranker than v11')
    : '—';
  report.push(`| v11   | ${fmtN(v11Auc, 3).padStart(5)} | ${fmtN(v11Corr, 3).padStart(13)} | ${v11Verdict} |`);
  report.push(`| v12   | ${fmtN(v12Auc, 3).padStart(5)} | ${fmtN(v12Corr, 3).padStart(13)} | ${v12Verdict} |`);
  report.push('');
  report.push(`> Brier is omitted here because the v11 score is a logit (→ probability via sigmoid) and the v12 score is a mean-ratio in [−1, +1] that isn't a probability. AUC + pt-biserial r are rank-based and apples-to-apples. Per-version Brier vs the market is in §0b for each model on its own calibration.`);
  report.push('');

  // ── Counterfactual PnL: what would each model have made shipping its
  //    OWN ladder on this shared pool?
  report.push(`### Counterfactual PnL — each model ships its OWN ladder on the shared pool`);
  report.push('');
  const flatProfit = (r) => r.won === 1
    ? (r.peakOdds < 0 ? 100 / Math.abs(r.peakOdds) : r.peakOdds / 100)
    : -1;
  // v11: shipped stake = tier_mult * 1u (treating base as 1u for fairness).
  // v12: shipped stake = absolute ladder units.
  let v11Stake = 0, v11Pnl = 0;
  let v12Stake = 0, v12Pnl = 0;
  for (const r of dual) {
    const v11U = TIER_MULT[r.agsTier] ?? 0;
    const v12U = V12_TIER_UNITS[r.agsV12Tier] ?? 0;
    v11Stake += v11U;
    v11Pnl   += v11U * flatProfit(r);
    v12Stake += v12U;
    v12Pnl   += v12U * flatProfit(r);
  }
  const v11Roi = v11Stake > 0 ? (v11Pnl / v11Stake) * 100 : null;
  const v12Roi = v12Stake > 0 ? (v12Pnl / v12Stake) * 100 : null;
  report.push(`| Model | Total Stake | PnL (u)    | ROI %     | Avg stake/pick | Edge vs v11    |`);
  report.push(`|-------|-------------|------------|-----------|----------------|----------------|`);
  report.push(`| v11   | ${v11Stake.toFixed(2).padStart(11)} | ${fmtSigned(v11Pnl).padStart(10)} | ${(v11Roi != null ? v11Roi.toFixed(1)+'%' : '—').padStart(9)} | ${(v11Stake/dual.length).toFixed(2).padStart(14)}u | — (baseline) |`);
  const edgeRoi = (v11Roi != null && v12Roi != null) ? v12Roi - v11Roi : null;
  const edgePnl = v12Pnl - v11Pnl;
  report.push(`| v12   | ${v12Stake.toFixed(2).padStart(11)} | ${fmtSigned(v12Pnl).padStart(10)} | ${(v12Roi != null ? v12Roi.toFixed(1)+'%' : '—').padStart(9)} | ${(v12Stake/dual.length).toFixed(2).padStart(14)}u | ${(edgeRoi != null ? fmtSigned(edgeRoi, 1) + 'pp ROI / ' : '')}${fmtSigned(edgePnl)}u PnL |`);
  report.push('');
  report.push(`> Each model is judged on its OWN sizing decisions for the same opportunity set. v11 uses tier multipliers (treating base = 1u for fairness). v12 uses absolute-units ladder. Positive Δ = v12 generates more total value on identical picks.`);
  report.push('');

  // ── Tier disagreement matrix — where do they actually diverge? ─────
  report.push(`### Tier-agreement confusion matrix`);
  report.push('');
  const cols = TIER_ORDER;
  report.push(`| v11 ↓ \\\\ v12 → | ${cols.map(c => c.padEnd(8)).join(' | ')} | Total |`);
  report.push(`|----------------|${cols.map(() => '----------').join('|')}|-------|`);
  for (const v11T of TIER_ORDER) {
    const row = dual.filter(r => r.agsTier === v11T);
    if (row.length === 0) continue;
    const cells = cols.map(v12T => row.filter(r => r.agsV12Tier === v12T).length);
    const total = row.length;
    report.push(`| ${v11T.padEnd(14)} | ${cells.map(n => String(n).padStart(8)).join(' | ')} | ${String(total).padStart(5)} |`);
  }
  const totals = cols.map(c => dual.filter(r => r.agsV12Tier === c).length);
  report.push(`| **Total**      | ${totals.map(n => String(n).padStart(8)).join(' | ')} | ${String(dual.length).padStart(5)} |`);
  report.push('');
  const agreed = dual.filter(r => r.agsTier === r.agsV12Tier).length;
  const downgraded = dual.filter(r => TIER_ORDER.indexOf(r.agsV12Tier) > TIER_ORDER.indexOf(r.agsTier)).length;
  const upgraded = dual.filter(r => TIER_ORDER.indexOf(r.agsV12Tier) < TIER_ORDER.indexOf(r.agsTier)).length;
  report.push(`> **${pct(agreed, dual.length)}** of picks land in the same tier under both models. **${pct(upgraded, dual.length)}** were upgraded by v12 (v12 likes them more) · **${pct(downgraded, dual.length)}** were downgraded by v12. Off-diagonal cells are where the two models materially disagree.`);
  report.push('');

  // ── Performance by disagreement direction ──────────────────────────
  // Force `tracked: false, units: 1` so aggregate() counts every pick as
  // live at a flat 1u stake — these picks are real outcomes regardless of
  // whether v12 chose to ship them, and the comparison is the point of
  // the section.
  const asFlat = (r) => ({ ...r, tracked: false, units: 1, profit: flatProfit(r) });
  const sameTier = dual.filter(r => r.agsTier === r.agsV12Tier).map(asFlat);
  const upgradedPicks = dual.filter(r => TIER_ORDER.indexOf(r.agsV12Tier) < TIER_ORDER.indexOf(r.agsTier)).map(asFlat);
  const downgradedPicks = dual.filter(r => TIER_ORDER.indexOf(r.agsV12Tier) > TIER_ORDER.indexOf(r.agsTier)).map(asFlat);
  const agreedAgg     = aggregate(sameTier);
  const upgradedAgg   = aggregate(upgradedPicks);
  const downgradedAgg = aggregate(downgradedPicks);
  report.push(`### Performance by direction of disagreement (flat-1u counterfactual)`);
  report.push('');
  report.push(`| Bucket                     | N    | Win %  | Flat-1u ROI | Verdict |`);
  report.push(`|----------------------------|------|--------|-------------|---------|`);
  report.push(`| Agreement (same tier)      | ${String(agreedAgg.n).padStart(4)} | ${pct(agreedAgg.w, agreedAgg.n).padStart(6)} | ${(agreedAgg.roi != null ? agreedAgg.roi.toFixed(1)+'%' : '—').padStart(11)} | (baseline) |`);
  report.push(`| v12 UPgraded (v12 > v11)   | ${String(upgradedAgg.n).padStart(4)} | ${pct(upgradedAgg.w, upgradedAgg.n).padStart(6)} | ${(upgradedAgg.roi != null ? upgradedAgg.roi.toFixed(1)+'%' : '—').padStart(11)} | ${upgradedAgg.roi != null && agreedAgg.roi != null && upgradedAgg.roi > agreedAgg.roi ? '🟢 v12 upgrades are profitable' : upgradedAgg.n === 0 ? '_(no upgrades yet)_' : '🟡 mixed'} |`);
  report.push(`| v12 DOWNgraded (v12 < v11) | ${String(downgradedAgg.n).padStart(4)} | ${pct(downgradedAgg.w, downgradedAgg.n).padStart(6)} | ${(downgradedAgg.roi != null ? downgradedAgg.roi.toFixed(1)+'%' : '—').padStart(11)} | ${downgradedAgg.roi != null && downgradedAgg.roi < 0 ? '🟢 v12 correctly downgrades losers' : downgradedAgg.n === 0 ? '_(no downgrades yet)_' : '🟡 v12 may be over-cautious'} |`);
  report.push('');
  report.push(`> If **v12 upgrades** beat the baseline AND **v12 downgrades** underperform the baseline, v12 is materially improving the ranking. If both are noise around the baseline, the two models agree on what matters and the v12 win comes from sizing (top-heavy ladder).`);
  report.push('');
}

async function buildWalletQualityAuditV12(report, rows) {
  report.push(`## § 14 — V12 Wallet Quality Audit`);
  report.push('');
  const sub = v12Rows(rows);
  if (sub.length === 0) {
    report.push(`_(no v12-scored picks yet)_`);
    report.push('');
    return;
  }
  report.push(`The v12 model is a **single feature** — per-side mean of \`Q = tierWeight × cappedROI × boundedSizeRatio × nReliab\`. Visibility into this distribution is essential because there's no second feature to compensate when wallet quality misfires.`);
  report.push('');

  // ── Score distribution histogram ───────────────────────────────────
  const scores = sub.map(r => r.agsV12).sort((a, b) => a - b);
  const buckets = [-1, -0.5, -0.25, -0.1, 0, 0.1, 0.25, 0.5, 0.75, 0.9, 0.95, 1.0];
  report.push(`### v12 score distribution (n = ${scores.length})`);
  report.push('');
  report.push(`| Range            | Count | %      | Bar                                   |`);
  report.push(`|------------------|-------|--------|---------------------------------------|`);
  for (let i = 0; i < buckets.length - 1; i++) {
    const lo = buckets[i], hi = buckets[i + 1];
    const inRange = scores.filter(s => s >= lo && s < hi).length;
    const share = scores.length > 0 ? inRange / scores.length : 0;
    const bar = '█'.repeat(Math.round(share * 40));
    const label = `[${lo.toFixed(2).padStart(5)}, ${hi.toFixed(2).padStart(5)})`;
    report.push(`| ${label.padEnd(16)} | ${String(inRange).padStart(5)} | ${(share*100).toFixed(1).padStart(5)}% | ${bar.padEnd(37)} |`);
  }
  // edge bucket for max
  const top = scores.filter(s => s >= buckets[buckets.length - 1]).length;
  if (top > 0) {
    const share = top / scores.length;
    report.push(`| [ 1.00,  ∞   )   | ${String(top).padStart(5)} | ${(share*100).toFixed(1).padStart(5)}% | ${'█'.repeat(Math.round(share * 40)).padEnd(37)} |`);
  }
  report.push('');

  // ── Per-side mean wallet quality ───────────────────────────────────
  const withMeans = sub.filter(r => Number.isFinite(r.agsV12ForMean) && Number.isFinite(r.agsV12AgMean));
  if (withMeans.length > 0) {
    const forMeanAvg = avg(withMeans.map(r => r.agsV12ForMean));
    const agMeanAvg = avg(withMeans.map(r => r.agsV12AgMean));
    const forCountAvg = avg(withMeans.map(r => r.agsV12ForCount || 0));
    const agCountAvg = avg(withMeans.map(r => r.agsV12AgCount || 0));
    report.push(`### Per-side wallet-quality averages`);
    report.push('');
    report.push(`| Side    | Avg Q (mean)       | Avg # contributing wallets |`);
    report.push(`|---------|--------------------|----------------------------|`);
    report.push(`| FOR     | ${fmtN(forMeanAvg, 3).padStart(18)} | ${forCountAvg.toFixed(1).padStart(26)} |`);
    report.push(`| AGAINST | ${fmtN(agMeanAvg, 3).padStart(18)} | ${agCountAvg.toFixed(1).padStart(26)} |`);
    report.push('');
    const oneSided = sub.filter(r => (r.agsV12ForCount || 0) === 0 || (r.agsV12AgCount || 0) === 0);
    if (oneSided.length > 0) {
      report.push(`> 🟡 **${oneSided.length} picks (${pct(oneSided.length, sub.length)})** had wallets on ONLY ONE side. With no opposition, the v12 score is purely a function of FOR-side quality and can run extreme — flag candidates for manual review.`);
      report.push('');
    }
  }

  // ── Win rate by FOR-side quality concentration ─────────────────────
  if (withMeans.length >= 10) {
    const graded = withMeans.filter(r => r.won != null);
    if (graded.length > 0) {
      const sorted = graded.slice().sort((a, b) => a.agsV12ForMean - b.agsV12ForMean);
      const tercileN = Math.floor(sorted.length / 3);
      const buckets3 = [
        ['Bottom 1/3 FOR-mean', sorted.slice(0, tercileN)],
        ['Middle 1/3 FOR-mean', sorted.slice(tercileN, 2 * tercileN)],
        ['Top 1/3 FOR-mean',    sorted.slice(2 * tercileN)],
      ];
      report.push(`### Win-rate by FOR-side quality tercile`);
      report.push('');
      report.push(`| Bucket                 | N    | Win %  | Avg FOR mean Q | Avg AG mean Q  |`);
      report.push(`|------------------------|------|--------|----------------|----------------|`);
      for (const [label, bucket] of buckets3) {
        // Force tracked: false / units: 1 so aggregate() counts every pick as
        // a live flat-1u bet (this section studies the wallet-quality signal
        // regardless of whether the v12 mute rule chose to ship the pick).
        const agg = aggregate(bucket.map(r => ({ ...r, tracked: false, units: 1, profit: r.won === 1 ? 1 : -1 })));
        const fMean = avg(bucket.map(r => r.agsV12ForMean));
        const aMean = avg(bucket.map(r => r.agsV12AgMean));
        report.push(`| ${label.padEnd(22)} | ${String(agg.n).padStart(4)} | ${pct(agg.w, agg.n).padStart(6)} | ${fmtN(fMean, 3).padStart(14)} | ${fmtN(aMean, 3).padStart(14)} |`);
      }
      report.push('');
      report.push(`> If top-FOR-mean picks don't win at materially higher rates than bottom-FOR-mean picks, the wallet-quality feature isn't doing its job. The asymmetry vs AGAINST mean Q is the lever the (fMean − aMean) numerator exploits.`);
      report.push('');
    }
  }
}

async function buildWalletPoolHealth(report) {
  report.push(`## § 12 — Wallet Pool Health`);
  report.push('');
  report.push(`The size of the qualifying-wallet pool per sport is the upstream cap on AGS-U signal. Each sharp wallet is one data point per side; smaller pool ⇒ less signal. This section is the standing report on that pool.`);
  report.push('');
  try {
    const snap = await db.collection('sharpWalletProfiles').get();
    const SPORTS = ['MLB', 'NBA', 'NHL'];
    const c = {};
    for (const sp of SPORTS) c[sp] = { has: 0, CONFIRMED: 0, FLAT: 0, WR50: 0, null: 0 };
    for (const d of snap.docs) {
      const p = d.data();
      if (!p?.bySport) continue;
      for (const sp of SPORTS) {
        const rec = p.bySport[sp];
        if (!rec) continue;
        c[sp].has++;
        const t = rec.whitelistTier;
        if (t === 'CONFIRMED') c[sp].CONFIRMED++;
        else if (t === 'FLAT') c[sp].FLAT++;
        else if (t === 'WR50') c[sp].WR50++;
        else c[sp].null++;
      }
    }
    report.push(`| sport | wallet records | CONFIRMED | FLAT | WR50 | NULL | qualifying (C+F+WR50) |`);
    report.push(`|-------|----------------|-----------|------|------|------|------------------------|`);
    for (const sp of SPORTS) {
      const qual = c[sp].CONFIRMED + c[sp].FLAT + c[sp].WR50;
      report.push(`| ${sp.padEnd(5)} | ${String(c[sp].has).padStart(14)} | ${String(c[sp].CONFIRMED).padStart(9)} | ${String(c[sp].FLAT).padStart(4)} | ${String(c[sp].WR50).padStart(4)} | ${String(c[sp].null).padStart(4)} | ${String(qual).padStart(22)} |`);
    }
    report.push('');
    const mlbQual = c.MLB.CONFIRMED + c.MLB.FLAT + c.MLB.WR50;
    const nbaQual = c.NBA.CONFIRMED + c.NBA.FLAT + c.NBA.WR50;
    if (mlbQual > 0 && nbaQual > 0 && mlbQual / nbaQual < 0.5) {
      report.push(`> ⚠ **MLB pool is < 50% of NBA pool** (${mlbQual} vs ${nbaQual}). MLB AUC will be inherently capped by sample size. To meaningfully improve MLB further: broaden leaderboard ingestion or relax Source B threshold (\`exportWalletProfiles.js\`).`);
      report.push('');
    }
  } catch (e) {
    report.push(`(could not load wallet profiles: ${e.message})`);
    report.push('');
  }
}

// Loader for ALL graded picks regardless of promotion — used for SHADOW / mute
// validation and op-health checks.
async function loadAllGradedAndShadowPicks() {
  const rows = [];
  for (const [colName, mktType] of PICK_COLLECTIONS) {
    const snap = await db.collection(colName).get();
    for (const doc of snap.docs) {
      const data = doc.data();
      if (!data.sides) continue;
      for (const [sideKey, sd] of Object.entries(data.sides)) {
        const lock = sd.lock || {};
        const peak = sd.peak || lock;
        const res = sd.result || data.result || {};
        const won = res.outcome === 'WIN' ? 1 : res.outcome === 'LOSS' ? 0 : null;
        const units = sd.finalUnits ?? sd.v8_agsUnitsApplied ?? peak.units ?? lock.units ?? 0;
        const ags = Number.isFinite(sd.v8_ags) ? sd.v8_ags : null;
        rows.push({
          docId: doc.id,
          date: data.date,
          sport: data.sport,
          marketType: mktType,
          status: sd.status || data.status || null,
          won, profit: res.profit,
          units,
          tracked: res.tracked === true,
          ags,
          agsTier: sd.v8_agsTier || sd.v8_lockTier || null,
          agsQuintile: sd.v8_agsQuintile ?? null,
          peakOdds: peak.odds || lock.odds || 0,
          provenTotal: (sd.v8_agsProvenForCount ?? 0) + (sd.v8_agsProvenAgCount ?? 0),
          superseded: !!sd.superseded,
          lockStage: sd.lockStage,
          promotedBy: sd.promotedBy,
          agsV12: Number.isFinite(sd.v8_agsV12) ? sd.v8_agsV12 : null,
          agsV12Tier: sd.v8_agsV12Tier || null,
          agsV12Quintile: Number.isFinite(sd.v8_agsV12Quintile) ? sd.v8_agsV12Quintile : null,
          agsV12UnitsApplied: Number.isFinite(sd.v8_agsV12UnitsApplied) ? sd.v8_agsV12UnitsApplied : null,
          healthStatus: sd.health?.status || 'ACTIVE',
        });
      }
    }
  }
  return rows;
}

async function loadLiveCalibration() {
  try {
    const d = await db.collection('agsCalibration').doc('current').get();
    if (d.exists) return d.data();
  } catch (_) { /* fall through to fallback */ }
  return null;
}

// Read the agsCalibration history collection to derive the "model era" each
// pick was scored under. Each history doc is keyed `history-YYYY-MM-DD`
// where the date is the calibration's sample-window end; the calibration
// itself becomes effective the NEXT day (when the cron next reads it). We
// return one entry per unique schemaVersion, marking its first effective
// date and its end date (= start of next version's effective date).
async function loadModelEras() {
  const snap = await db.collection('agsCalibration').get();
  const entries = [];
  snap.forEach(d => {
    if (d.id === 'current') return;
    const data = d.data();
    if (!data?.schemaVersion) return;
    const m = d.id.match(/^history-(\d{4}-\d{2}-\d{2})$/);
    if (!m) return;
    entries.push({ historyDate: m[1], schema: data.schemaVersion, computedAt: data.computedAt });
  });
  entries.sort((a, b) => a.historyDate.localeCompare(b.historyDate));
  const seen = new Set();
  const eras = [];
  for (const e of entries) {
    if (seen.has(e.schema)) continue;
    seen.add(e.schema);
    // Calibration written on day X (sample window ending X) becomes effective
    // for picks scored on day X+1.
    const next = new Date(e.historyDate + 'T00:00:00Z');
    next.setUTCDate(next.getUTCDate() + 1);
    eras.push({
      version: e.schema,
      effectiveFrom: next.toISOString().slice(0, 10),
      effectiveTo: null,  // filled below
    });
  }
  for (let i = 0; i < eras.length; i++) {
    eras[i].effectiveTo = (i + 1 < eras.length) ? eras[i + 1].effectiveFrom : null;
  }
  return eras;
}

// Tag a pick row with the AGS-U model version that scored it. Priority:
// 1. v12 stamp present (v8_agsV12 set) → v12 era (most authoritative for the
//    new model — the cron stamps v12 fields only when v12 ran)
// 2. v11-specific feature signature in components (dSumRankNorm /
//    dWinnerCtPreA were both introduced in v11)
// 3. Pick date vs the calibration-history effective-from dates
function modelEraForPick(row, eras) {
  if (Number.isFinite(row.agsV12)) {
    const v12Era = eras.find(e => /v12/.test(e.version));
    return v12Era ? v12Era.version : 'ags-unified-v12';
  }
  const c = row.agsComponents;
  if (c && (Number.isFinite(c.dSumRankNorm) || Number.isFinite(c.dWinnerCtPreA))) {
    const v11Era = eras.find(e => /v11$/.test(e.version));
    return v11Era ? v11Era.version : 'ags-unified-v11';
  }
  if (!row.date) return 'unknown';
  let match = 'unknown';
  for (const e of eras) {
    if (row.date >= e.effectiveFrom) match = e.version;
    else break;
  }
  return match;
}

// Return the score / tier / units to use when comparing performance across
// versions: v12 picks use v12 stamps, everyone else uses v11.
function rowForEra(row, eraVersion) {
  const isV12 = /v12/.test(eraVersion);
  return {
    score: isV12 ? row.agsV12 : row.ags,
    tier:  isV12 ? row.agsV12Tier : row.agsTier,
    quint: isV12 ? row.agsV12Quintile : row.agsQuintile,
  };
}

function buildVersionComparison(report, rows, eras) {
  report.push(`## § 0b — AGS-U Model Version Comparison`);
  report.push('');
  report.push(`How does the latest model (**${eras[eras.length-1]?.version ?? 'live'}**) compare against prior versions? Picks are tagged by the calibration that scored them — v11 by feature-signature (\`dSumRankNorm\` / \`dWinnerCtPreA\` present in components), earlier versions by pick date against the calibration-history cutover schedule below.`);
  report.push('');

  if (eras.length === 0) {
    report.push(`_(no calibration history found — comparison unavailable)_`);
    report.push('');
    return;
  }

  // Tag every pick.
  const tagged = rows.map(r => ({ ...r, _era: modelEraForPick(r, eras) }));
  const versions = eras.map(e => e.version);

  // Per-version summary stats.
  report.push(`### Headline performance by version`);
  report.push('');
  report.push(`| Version | Era                  | Days | Live N | Trk | W-L    | Win %  | ROI       | PnL (u)    | per-pick | AUC   | Brier (model) | Status   |`);
  report.push(`|---------|----------------------|------|--------|-----|--------|--------|-----------|------------|----------|-------|---------------|----------|`);
  const stats = {};
  for (let i = 0; i < eras.length; i++) {
    const era = eras[i];
    const isV12 = /v12/.test(era.version);
    const eraRows = tagged.filter(r => r._era === era.version);
    const agg = aggregate(eraRows);
    // AUC is rank-based so it works for both v11 (logit) and v12 (mean ratio).
    // Brier requires a probability — v11 sigmoids fine, v12 has no probability
    // interpretation so we skip it (rendering as '—').
    const scoreFn = isV12 ? (r => r.agsV12) : (r => r.ags);
    const withAgs = eraRows.filter(r => Number.isFinite(scoreFn(r)) && r.won != null);
    const auc = rocAuc(withAgs.map(scoreFn), withAgs.map(r => r.won));
    const brier = isV12
      ? null  // not a probability, comparison would be misleading
      : brierScore(withAgs.map(r => sigmoid(r.ags)), withAgs.map(r => r.won));
    const perPick = agg.flat;
    const endLabel = era.effectiveTo
      ? era.effectiveTo.slice(5)  // MM-DD without year
      : 'present';
    const eraLabel = `${era.effectiveFrom.slice(5)} → ${endLabel}`;
    const days = era.effectiveTo
      ? Math.max(1, Math.floor((new Date(era.effectiveTo) - new Date(era.effectiveFrom)) / 86400000))
      : Math.max(1, Math.floor((new Date(etToday()) - new Date(era.effectiveFrom)) / 86400000) + 1);
    const isLive = !era.effectiveTo;
    stats[era.version] = { agg, auc, brier, perPick, n: eraRows.length, days };
    report.push(`| ${era.version.replace('ags-unified-', '').padEnd(7)} | ${eraLabel.padEnd(20)} | ${String(days).padStart(4)} | ${String(agg.n).padStart(6)} | ${String(agg.trackedN).padStart(3)} | ${(agg.w+'-'+agg.l).padEnd(6)} | ${pct(agg.w, agg.n).padStart(6)} | ${(agg.roi != null ? agg.roi.toFixed(1)+'%' : '—').padStart(9)} | ${fmtSigned(agg.profit).padStart(10)} | ${(perPick != null ? fmtSigned(perPick, 2) : '—').padStart(8)} | ${fmtN(auc, 3).padStart(5)} | ${fmtN(brier, 4).padStart(13)} | ${(isLive ? '🟢 LIVE' : '⚪ retired').padEnd(8)} |`);
  }
  report.push('');

  // Pairwise improvement: latest vs each previous.
  if (versions.length >= 2) {
    const latest = versions[versions.length - 1];
    const latestStats = stats[latest];
    report.push(`### v${latest.replace('ags-unified-v', '')} vs prior versions`);
    report.push('');
    report.push(`| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |`);
    report.push(`|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|`);
    for (let i = 0; i < versions.length - 1; i++) {
      const prev = versions[i];
      const ps = stats[prev];
      const dN = latestStats.agg.n - ps.agg.n;
      const dWin = (latestStats.agg.realWinRate != null && ps.agg.realWinRate != null) ? (latestStats.agg.realWinRate - ps.agg.realWinRate) * 100 : null;
      const dRoi = (latestStats.agg.roi != null && ps.agg.roi != null) ? latestStats.agg.roi - ps.agg.roi : null;
      const dPp = (latestStats.perPick != null && ps.perPick != null) ? latestStats.perPick - ps.perPick : null;
      const dAuc = (latestStats.auc != null && ps.auc != null) ? latestStats.auc - ps.auc : null;
      const dBrier = (latestStats.brier != null && ps.brier != null) ? ps.brier - latestStats.brier : null;  // positive Δ = improvement (lower brier is better)
      // Verdict heuristic — count improvements in ROI / win / AUC / brier (each must be defined to count).
      const signals = [];
      if (dRoi != null) signals.push(dRoi >= 0 ? 1 : -1);
      if (dWin != null) signals.push(dWin >= 0 ? 1 : -1);
      if (dAuc != null) signals.push(dAuc >= 0 ? 1 : -1);
      if (dBrier != null) signals.push(dBrier >= 0 ? 1 : -1);
      const score = signals.reduce((a, b) => a + b, 0);
      const verdict = signals.length === 0 ? '—'
        : score >= signals.length - 1 ? '🟢 better'
        : score <= -(signals.length - 1) ? '🚨 worse'
        : '🟡 mixed';
      const latestShort = latest.replace('ags-unified-', '');
      const prevShort = prev.replace('ags-unified-', '');
      const compLabel = `${latestShort} − ${prevShort}`;
      report.push(`| ${compLabel.padEnd(18)} | ${(dN >= 0 ? '+' : '') + String(dN).padStart(5)} | ${(dWin != null ? fmtSigned(dWin, 1) + 'pp' : '—').padStart(9)} | ${(dRoi != null ? fmtSigned(dRoi, 1) + 'pp' : '—').padStart(10)} | ${(dPp != null ? fmtSigned(dPp, 3) : '—').padStart(15)} | ${(dAuc != null ? fmtSigned(dAuc, 3) : '—').padStart(8)} | ${(dBrier != null ? fmtSigned(dBrier, 4) : '—').padStart(10)} | ${verdict.padEnd(7)} |`);
    }
    report.push('');
    report.push(`> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).`);
    report.push('');
  }

  // Per-sport breakdown by version.
  const sports = [...new Set(tagged.map(r => r.sport))].sort();
  if (sports.length > 0 && versions.length > 1) {
    report.push(`### Per-sport win rate × version`);
    report.push('');
    report.push(`| Version | ${sports.map(s => s.padEnd(14)).join(' | ')} | All           |`);
    report.push(`|---------|${sports.map(() => '----------------').join('|')}|---------------|`);
    for (const version of versions) {
      const eraRows = tagged.filter(r => r._era === version);
      const cells = sports.map(s => {
        const a = aggregate(eraRows.filter(r => r.sport === s));
        return a.n > 0 ? `${a.n}n ${pct(a.w, a.n)} ${a.roi != null ? (a.roi>=0?'+':'') + a.roi.toFixed(0)+'%' : '—'}` : '—';
      });
      const all = aggregate(eraRows);
      const allCell = all.n > 0 ? `${all.n}n ${pct(all.w, all.n)} ${all.roi != null ? (all.roi>=0?'+':'') + all.roi.toFixed(0)+'%' : '—'}` : '—';
      const short = version.replace('ags-unified-', '');
      report.push(`| ${short.padEnd(7)} | ${cells.map(c => c.padEnd(14)).join(' | ')} | ${allCell.padEnd(13)} |`);
    }
    report.push('');
  }

  // Per-tier breakdown by version — answers "did each version's ELITE tier
  // actually win more than its LEAN tier?"
  if (versions.length > 1) {
    report.push(`### Per-tier ROI × version (monotonicity check across model history)`);
    report.push('');
    report.push(`| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |`);
    report.push(`|---------|---------------|---------------|---------------|---------------|---------------|---------------|`);
    for (const version of versions) {
      const isV12 = /v12/.test(version);
      const eraRows = tagged.filter(r => r._era === version);
      const tierKey = isV12 ? 'agsV12Tier' : 'agsTier';
      const tierAgs = {};
      for (const t of ['ELITE', 'PREMIUM', 'LOCK', 'LEAN', 'WEAK']) {
        tierAgs[t] = aggregate(eraRows.filter(r => r[tierKey] === t));
      }
      const cells = ['ELITE', 'PREMIUM', 'LOCK', 'LEAN', 'WEAK'].map(t => {
        const a = tierAgs[t];
        return a.n > 0 ? `${a.n}n ${a.roi != null ? (a.roi>=0?'+':'') + a.roi.toFixed(0)+'%' : '—'}` : '—';
      });
      const rois = ['ELITE', 'PREMIUM', 'LOCK', 'LEAN', 'WEAK']
        .map(t => tierAgs[t].roi)
        .filter(v => v != null);
      const mono = rois.length >= 2 ? monoScore(rois) : null;
      const monoLabel = mono == null ? '—'
        : mono <= -(rois.length - 2) ? `🟢 mono (${mono})`
        : mono >= (rois.length - 2) ? `🚨 inv (${mono})`
        : `🟡 partial (${mono})`;
      const short = version.replace('ags-unified-', '');
      report.push(`| ${short.padEnd(7)} | ${cells.map(c => c.padEnd(13)).join(' | ')} | ${monoLabel.padEnd(13)} |`);
    }
    report.push('');
    report.push(`> Monotonicity score on tier-ROI vector (ELITE → WEAK). Fully sorted (each tier earns LESS than the one above) = ${-3} for 4-tier samples / ${-4} for full ladder. Fully inverted = +3/+4. A NEW model that flips the ladder from inverted → monotonic is the strongest evidence the redesign worked.`);
    report.push('');
  }
}

// ── Main ─────────────────────────────────────────────────────────────────
async function main() {
  console.log('AGS-U daily report — loading data...');
  // Load calibration first so the picks loader can use it to reconstruct
  // the v11 tier on picks where v12 has overwritten the stamped tier.
  const liveCal = await loadLiveCalibration();
  const [{ rows: agsuRows, cutover }, allRows, modelEras] = await Promise.all([
    loadAllAgsuGradedPicks(liveCal),
    loadAllGradedAndShadowPicks(),
    loadModelEras(),
  ]);
  console.log(`  AGS-U graded picks:    ${agsuRows.length}`);
  console.log(`  All sides (any state): ${allRows.length}`);
  console.log(`  Cutover:               ${cutover}`);
  console.log(`  Active model schema:   ${liveCal?.schemaVersion || AGS_FALLBACK_CALIBRATION.schemaVersion}`);
  console.log(`  Active features:       [${ACTIVE_FEATURE_KEYS.join(', ')}]`);
  console.log(`  Model eras detected:   ${modelEras.map(e => `${e.version}@${e.effectiveFrom}`).join(' | ')}`);

  const report = [];
  buildHeader(report, cutover, liveCal);
  buildActiveModelCard(report, liveCal);
  buildVersionComparison(report, agsuRows, modelEras);
  buildExecutiveSummary(report, agsuRows, cutover);
  buildTierCalibration(report, agsuRows);
  buildTierCalibrationV12(report, agsuRows, liveCal);     // § 1b
  buildQuintileCalibration(report, agsuRows);
  buildQuintileCalibrationV12(report, agsuRows, liveCal); // § 2b
  buildModelRankingMetrics(report, agsuRows);
  buildUnivariateFeatures(report, agsuRows);
  buildFeatureAttribution(report, agsuRows);
  buildHcCrossTab(report, agsuRows);
  buildReliability(report, agsuRows);
  buildReliabilityV12(report, agsuRows, liveCal);         // § 5b
  buildRecentPicks(report, agsuRows, RECENT_N);
  buildSizingAudit(report, agsuRows);
  buildMuteValidation(report, allRows, liveCal);
  buildDailyTrend(report, agsuRows);
  buildOperationalHealth(report, allRows.filter(r => r.promotedBy === AGSU_PROMOTION_TAG), agsuRows);
  buildCalibrationSnapshot(report, liveCal);
  await buildWalletPoolHealth(report);
  buildHeadToHeadV11V12(report, agsuRows);                // § 13
  await buildWalletQualityAuditV12(report, agsuRows);     // § 14

  report.push(`---`);
  report.push('');
  report.push(`*Report generated by \`scripts/dailyAgsUReport.js\` — single source of truth for AGS-Unified monitoring. Imports active model surface from \`src/lib/ags.js\` at runtime so it auto-tracks model bumps. Triggered daily by \`.github/workflows/daily-agsu-report.yml\` at 8:30am ET; can also be run manually via the Actions tab "Run workflow" button.*`);

  const out = report.join('\n');
  const outPath = join(REPO_ROOT, 'DAILY_AGSU_REPORT.md');
  writeFileSync(outPath, out, 'utf8');
  console.log(`✓ Wrote ${outPath} (${out.length.toLocaleString()} chars)`);
}

main().catch(err => {
  console.error('FATAL', err);
  process.exit(1);
}).finally(() => process.exit(0));
