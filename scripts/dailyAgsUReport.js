/**
 * Sharp Intel — AGS-Unified Daily Performance & Calibration Report
 * ──────────────────────────────────────────────────────────────────────────
 * Single canonical monitoring artifact for the AGS-U sharp-intelligence
 * pipeline. Replaces v6 / v7 / v8 dailies as the source of truth for:
 *
 *   • Is AGS-U making money? Per tier? Per quintile? Per sport?
 *   • Is AGS-U CALIBRATED — does the tier ladder predict outcomes monotonically?
 *   • Are the active L1-pruned features still earning their slot?
 *   • Is the sizing ladder (2× / 1.5× / 1.1× / 0.5× / 0.2×) capturing edge?
 *   • Is the hard-mute floor (q20) suppressing the right picks?
 *   • Are there cron / grader / sizing anomalies that need attention?
 *
 * VERSION-AGNOSTIC: every reference to active features / weights / quintiles
 * is loaded at runtime from `src/lib/ags.js`. When the model is bumped (v9 →
 * v10 → v11 → …) this script automatically reflects the new structure.
 * Historical picks stamped under older schemas are accommodated via a
 * `legacyFeatures` decomposition so the analysis sections still render.
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
//
// IMPORTANT: every AGS-U model bump (v9 → v10 → v11 → v12 → …) writes its
// OWN string into `promotedBy` ('ags-unified-v9', 'ags-unified-v10', etc.).
// The tag is NOT sticky across bumps — the cron stamps the live schema
// version each time it scores. So we must match on the PREFIX, not the
// exact v9 string, or every post-v9 production pick will silently fall out
// of the report (we hit exactly that bug on 2026-06-03 when v12 went live).
const AGSU_PROMOTION_PREFIX = 'ags-unified-v';
const isAgsuPromotion = (tag) => typeof tag === 'string' && tag.startsWith(AGSU_PROMOTION_PREFIX);

// AGS-U sizing ladder multipliers (must match scripts/syncPickStateAuthoritative.js).
const TIER_MULT = { ELITE: 2.00, PREMIUM: 1.50, LOCK: 1.10, LEAN: 0.50, WEAK: 0.20, FADE: 0.00 };
const TIER_ORDER = ['ELITE', 'PREMIUM', 'LOCK', 'LEAN', 'WEAK', 'FADE'];

// v12 ABSOLUTE units ladder (not a multiplier — see syncPickStateAuthoritative
// `unitsFromAgsV12` and ags.js `agsV12SizeMultiplier`). After ladder lookup
// the value is run through `oddsCap` (which clamps long underdogs down to
// 2.5 / 1.5 / 1.0 at +100 / +151 / +200 thresholds), so the realised stake
// can legitimately fall below the ladder target on +odds — that is NOT a
// drift bug, it's the cap doing its job.
const V12_TIER_UNITS = { ELITE: 5.00, PREMIUM: 3.00, LOCK: 1.00, LEAN: 0.50, WEAK: 0.25, FADE: 0.00 };
// Maximum stake by american-odds band, mirroring oddsCap in
// syncPickStateAuthoritative.js. Used by § 13 to distinguish legitimate
// odds-cap clamping from a real sizing pipeline regression.
function oddsCapForReport(units, odds) {
  if (!Number.isFinite(odds)) return units;
  if (odds >= 200) return Math.min(units, 1.0);
  if (odds >= 151) return Math.min(units, 1.5);
  if (odds >= 100) return Math.min(units, 2.5);
  return units;
}
const TIER_QUINTILE_LABEL = {
  ELITE:   '≥ q90',
  PREMIUM: 'q80–q90',
  LOCK:    'q60–q80',
  LEAN:    'q40–q60',
  WEAK:    'q20–q40',
  FADE:    '< q20',
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
async function loadAllAgsuGradedPicks() {
  const rows = [];
  let cutover = null;
  for (const [colName, mktType] of PICK_COLLECTIONS) {
    const snap = await db.collection(colName).get();
    for (const doc of snap.docs) {
      const data = doc.data();
      if (!data.sides) continue;
      for (const [sideKey, sd] of Object.entries(data.sides)) {
        if (sd.superseded) continue;
        const lock = sd.lock || {};
        const peak = sd.peak || lock;

        if (isAgsuPromotion(sd.promotedBy) && data.date && (!cutover || data.date < cutover)) {
          cutover = data.date;
        }

        if ((sd.status || data.status) !== 'COMPLETED') continue;
        const res = sd.result || data.result || {};
        if (!res.outcome) continue;
        if (!isAgsuPromotion(sd.promotedBy)) continue;

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
        const agsTier = sd.v8_agsTier || sd.v8_lockTier || null;
        const agsQuintile = Number.isFinite(sd.v8_agsQuintile) ? sd.v8_agsQuintile : null;
        const agsComponents = sd.v8_agsComponents || null;
        // v12 wallet-quality model stamps. Co-exist with v11 stamps during
        // the transition so § 0b can compare v11 vs v12 rank power honestly,
        // and § 13 can do an in-depth audit of v12 production behaviour.
        const agsV12 = Number.isFinite(sd.v8_agsV12) ? sd.v8_agsV12 : null;
        const agsV12Tier = sd.v8_agsV12Tier || null;
        const agsV12Quintile = Number.isFinite(sd.v8_agsV12Quintile) ? sd.v8_agsV12Quintile : null;
        const agsV12UnitsApplied = Number.isFinite(sd.v8_agsV12UnitsApplied) ? sd.v8_agsV12UnitsApplied : null;
        // Per-side wallet-quality means (when the cron stamps them; not all
        // v12 implementations write these — guard accordingly).
        const agsV12ForMean = Number.isFinite(sd.v8_agsV12ForMean) ? sd.v8_agsV12ForMean : null;
        const agsV12AgMean = Number.isFinite(sd.v8_agsV12AgMean) ? sd.v8_agsV12AgMean : null;
        const agsV12ForCount = Number.isFinite(sd.v8_agsV12ForCount) ? sd.v8_agsV12ForCount : null;
        const agsV12AgCount = Number.isFinite(sd.v8_agsV12AgCount) ? sd.v8_agsV12AgCount : null;
        const provenFor = sd.v8_agsProvenForCount ?? null;
        const provenAg = sd.v8_agsProvenAgCount ?? null;
        const hcMargin = Number.isFinite(sd.v8_hcMargin)
          ? sd.v8_hcMargin
          : ((sd.v8_hcConfFor || 0) - (sd.v8_hcConfAg || 0));
        const schemaVersion = sd.v8_agsCalibrationSchema || sd.v8_agsSchema || null;

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
          ags, agsTier, agsQuintile, agsComponents,
          agsV12, agsV12Tier, agsV12Quintile, agsV12UnitsApplied,
          agsV12ForMean, agsV12AgMean, agsV12ForCount, agsV12AgCount,
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

function buildHeader(report, cutover, liveCal, eras) {
  const today = etToday();
  const schemaLive = liveCal?.schemaVersion || AGS_FALLBACK_CALIBRATION.schemaVersion;
  const v12From = v12EffectiveFrom(eras);
  const v12Days = v12From
    ? Math.max(1, Math.floor((new Date(today) - new Date(v12From)) / 86400000) + 1)
    : null;
  report.push(`# AGS-Unified — V12 Performance Monitor`);
  report.push('');
  report.push(`**Generated:** ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'full', timeStyle: 'short' })} ET`);
  report.push('');
  report.push(`**Active model:** \`${schemaLive}\` · **V12 went live:** ${v12From || '— (not yet shipped)'} · **Days live:** ${v12Days ?? '—'}`);
  report.push('');
  report.push(`> This report is a **CEO-grade monitor of V12 in production**. The only non-V12 section is § 2 (model version comparison), kept so you can see V12's results in the context of every prior model bump. Everything else — daily trajectory, tier scoreboard, score reliability, mute-rule audit, wallet-quality inputs, operational health — is **strictly V12-scoped** (pick date ≥ ${v12From || 'TBD'}) so cron back-fill of V12 stamps onto older picks can't contaminate the production numbers.`);
  report.push('');
}

function buildActiveModelCard(report, liveCal) {
  report.push(`## § 0a — Active Model`);
  report.push('');
  report.push(`The composite scoring model — what every lock/mute/sizing decision is built on. Pulled at runtime from \`src/lib/ags.js\` so this report never drifts.`);
  report.push('');
  report.push(`**Schema version:** \`${liveCal?.schemaVersion || AGS_FALLBACK_CALIBRATION.schemaVersion}\``);
  report.push(`**Calibration source:** \`${liveCal?.source || 'fallback'}\` · sample N = ${liveCal?.sampleSize ?? '—'} · range ${liveCal?.dateRange?.from ?? '—'} → ${liveCal?.dateRange?.to ?? '—'}`);
  report.push('');
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
    alerts.push(`🚨 **No graded AGS-U picks since cutover.** Either the cutover date (${cutover}) is wrong, the grader is stuck, or no picks have been promoted via \`${AGSU_PROMOTION_PREFIX}*\`.`);
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

function buildRecentPicks(report, rows, n) {
  report.push(`## § 6 — Recent Picks (Last ${n})`);
  report.push('');
  report.push(`Most-recent graded AGS-U picks. Use this to spot anomalies (high-AGS losers, low-AGS winners, sizing surprises).`);
  report.push('');
  const recent = rows.slice(-n).reverse();
  report.push(`| Date       | Sport | Mkt    | Team / Side             | Odds  | Stake  | AGS-U  | Tier    | Quint | HCm  | Top Driver           | Outcome | PnL (u)    | CLV    |`);
  report.push(`|------------|-------|--------|-------------------------|-------|--------|--------|---------|-------|------|----------------------|---------|------------|--------|`);
  for (const r of recent) {
    const teamLabel = `${r.team || r.sideKey}`.substring(0, 23);
    const oddsStr = r.peakOdds > 0 ? `+${r.peakOdds}` : `${r.peakOdds}`;
    const outcomeStr = r.tracked ? 'TRACKED' : (r.won === 1 ? 'WIN' : 'LOSS');
    const profitStr = r.tracked ? '0.00u' : fmtSigned(r.profit) + 'u';
    const clvStr = r.clv != null ? fmtSigned(r.clv * 100, 1) + '%' : '—';
    // Top driver = largest |β · z| contributor (uses whichever features are
    // present on this pick, active or legacy).
    let topDriver = '—';
    if (r.agsComponents) {
      let best = null, bestAbs = 0;
      for (const key of ALL_OBSERVED_FEATURE_KEYS) {
        const z = Number(r.agsComponents[key]);
        if (!Number.isFinite(z)) continue;
        const w = AGS_WEIGHTS[key];
        const contrib = Number.isFinite(w) ? w * z : z;  // fallback to raw z if weight unknown
        if (Math.abs(contrib) > bestAbs) { best = key; bestAbs = Math.abs(contrib); }
      }
      if (best) {
        const z = r.agsComponents[best];
        const w = AGS_WEIGHTS[best];
        const contrib = Number.isFinite(w) ? w * z : z;
        topDriver = `${FEATURE_LABELS[best] || best} ${fmtSigned(contrib, 2)}`;
      }
    }
    report.push(`| ${r.date.padEnd(10)} | ${(r.sport || '').padEnd(5)} | ${(r.marketType || '').padEnd(6)} | ${teamLabel.padEnd(23)}`
      + ` | ${oddsStr.padStart(5)} | ${(r.units.toFixed(2)+'u').padStart(6)} | ${fmtSigned(r.ags).padStart(6)}`
      + ` | ${(r.agsTier || '—').padEnd(7)} | Q${r.agsQuintile || '?'}`.padEnd(8)
      + `   | ${fmtSigned(r.hcMargin, 0).padStart(4)} | ${topDriver.padEnd(20)} | ${outcomeStr.padEnd(7)} | ${profitStr.padStart(10)} | ${clvStr.padStart(6)} |`);
  }
  report.push('');
}

function buildSizingAudit(report, rows) {
  report.push(`## § 7 — Sizing Audit`);
  report.push('');
  report.push(`Does the AGS-U sizing ladder (ELITE 2× → WEAK 0.2×) actually capture more edge per unit at the top? If the per-stake ROI is FLAT across tiers, we're just risking more on the same edge — and a flat-stake strategy would beat the laddered one.`);
  report.push('');
  report.push(`| Tier     | N    | Total Stake | PnL (u)    | ROI %     | PnL / pick | Per-unit Return |`);
  report.push(`|----------|------|-------------|------------|-----------|------------|-----------------|`);
  for (const tier of TIER_ORDER) {
    const tRows = rows.filter(r => r.agsTier === tier);
    const agg = aggregate(tRows);
    if (agg.n === 0) continue;
    const perUnit = agg.totalStake > 0 ? agg.profit / agg.totalStake : null;
    report.push(`| ${tier.padEnd(8)} | ${String(agg.n).padStart(4)} | ${agg.totalStake.toFixed(2).padStart(11)} | ${fmtSigned(agg.profit).padStart(10)}`
      + ` | ${(agg.roi != null ? agg.roi.toFixed(1)+'%' : '—').padStart(9)} | ${(agg.flat != null ? fmtSigned(agg.flat) : '—').padStart(10)}`
      + ` | ${(perUnit != null ? fmtSigned(perUnit, 3) : '—').padStart(15)} |`);
  }
  report.push('');
  report.push(`> If **Per-unit Return** is materially higher for ELITE than for WEAK/LEAN, the ladder is justified. If they're within ~5%, the ladder is risking more capital for the same return per dollar.`);
  report.push('');
}

function buildMuteValidation(report, allRows, liveCal) {
  report.push(`## § 8 — SHADOW / Hard-Mute Validation`);
  report.push('');
  const q20 = liveCal?.quintiles?.q20 ?? AGS_FALLBACK_CALIBRATION.quintiles.q20;
  report.push(`Below-q20 AGS-U values are SHADOWed (never shipped). Live q20 = **${fmtSigned(q20, 3)}**. We validate the floor by looking at sides that WOULD HAVE GRADED if shipped — if they lose at >50%, the mute is working.`);
  report.push('');
  const shadowRows = allRows.filter(r => Number.isFinite(r.ags) && r.ags < q20 && r.won != null);
  if (shadowRows.length === 0) {
    report.push(`No SHADOWed graded picks in the sample. Mute floor untestable.`);
    report.push('');
    return;
  }
  const wouldHaveAgg = aggregate(shadowRows.map(r => ({ ...r, units: 1.0, profit: r.won ? (r.peakOdds < 0 ? 100/Math.abs(r.peakOdds) : r.peakOdds/100) : -1 })));
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

  report.push(`| Check                                                          | Count | Verdict                                            |`);
  report.push(`|----------------------------------------------------------------|-------|----------------------------------------------------|`);
  report.push(`| Graded picks with \`tracked=true\` AND \`finalUnits > 0\`         | ${String(trackedShipped.length).padStart(5)} | ${trackedShipped.length === 0 ? '🟢 grader is correct' : '🚨 grader regression — see betTracking.js'} |`);
  report.push(`| Graded picks with \`tracked=true\` AND \`finalUnits == 0\`        | ${String(trackedZero.length).padStart(5)} | ${trackedZero.length === 0 ? '🟢 no zero-unit tracks' : '🟡 informational only — true tracked plays'} |`);
  report.push(`| LOCK+ tier picks with \`finalUnits == 0\` (sizing regression)   | ${String(sizingRegression.length).padStart(5)} | ${sizingRegression.length === 0 ? '🟢 sizing pipeline healthy' : '🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U'} |`);
  report.push(`| Live picks (not graded yet) with \`finalUnits > 0\`             | ${String(ungradedWithFinalUnits.length).padStart(5)} | ${ungradedWithFinalUnits.length > 0 ? '🟢 picks queued for grading' : '🟡 no live shipped picks pending'} |`);
  report.push(`| AGS-U promoted picks missing \`v8_ags\` value                   | ${String(missingAgs.length).padStart(5)} | ${missingAgs.length === 0 ? '🟢 every pick has an AGS-U' : '🟡 some picks missing AGS-U — cron lag or stale doc'} |`);
  report.push(`| AGS-U promoted picks missing \`agsTier\`                        | ${String(missingTier.length).padStart(5)} | ${missingTier.length === 0 ? '🟢 every pick has a tier' : '🟡 some picks missing tier classification'} |`);
  report.push(`| Single-wallet shipped picks (\`provenWalletCount == 1\`)       | ${String(singleWalletShipped.length).padStart(5)} | 🟡 informational — AGS-U calibration controls sample adequacy |`);
  report.push('');

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
  const isV12Active = /v12/.test(liveCal.schemaVersion || '');
  report.push(`The live \`agsCalibration/current\` document — what the cron and UI both read at runtime to score & size every pick. **This is the actual thresholds V12 is using right now.**`);
  report.push('');
  report.push(`- **Computed at:** ${liveCal.computedAt || '—'}`);
  report.push(`- **Schema version:** \`${liveCal.schemaVersion || '—'}\` ${isV12Active ? '🟢 (V12 active)' : '⚠ not V12'}`);
  report.push(`- **Source:** ${liveCal.source || '—'}`);
  report.push(`- **Sample size:** ${liveCal.sampleSize ?? '—'}`);
  report.push(`- **Date range:** ${liveCal.dateRange?.from || '—'} → ${liveCal.dateRange?.to || '—'}`);
  report.push('');

  // V12-specific block: show v12 quintile cuts + absolute ladder (the
  // actual production decision rules right now). The v11 logit quintiles
  // are not what V12 ships from — they're inherited cruft on the doc.
  if (isV12Active && liveCal.v12Quintiles) {
    report.push(`### V12 wallet-quality score thresholds (live)`);
    report.push('');
    report.push(`These are the cuts on the V12 score (in [-1, +1]) that decide which tier each pick lands in, and therefore how many units it ships at.`);
    report.push('');
    report.push(`| Boundary | V12 score cut | Tier band start | Stake (absolute units) |`);
    report.push(`|----------|---------------|-----------------|------------------------|`);
    const v12q = liveCal.v12Quintiles;
    const rows = [
      ['q80',  v12q.q80, 'ELITE',   '5.00u'],
      ['q60',  v12q.q60, 'PREMIUM', '3.00u'],
      ['q40',  v12q.q40, 'LOCK',    '1.00u'],
      ['q20',  v12q.q20, 'LEAN',    '0.50u'],
      ['—',    0.0,      'WEAK',    '0.25u  (any score in (0, q20])'],
      ['mute', '—',      'FADE',    '0.00u  (any score ≤ 0)'],
    ];
    for (const [k, val, tier, stake] of rows) {
      const valStr = typeof val === 'number' ? fmtSigned(val, 3) : String(val);
      report.push(`| ${k.padEnd(8)} | ${valStr.padStart(13)} | ${tier.padEnd(15)} | ${stake.padEnd(22)} |`);
    }
    report.push('');
    report.push(`> **Odds cap.** Regardless of tier, stake is clamped by american odds: ≤2.5u at +100, ≤1.5u at +151, ≤1.0u at +200. Keeps a long-underdog ELITE from blowing up the bankroll.`);
    report.push('');
  } else if (liveCal.quintiles) {
    // Pre-V12 fallback: show the v11 logit quintiles & multiplier ladder.
    report.push(`### Score thresholds (legacy v11 logit space — fallback if V12 not active)`);
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

// Tag a pick row with the AGS-U model version that was authoritative IN
// PRODUCTION on the day the pick was made. Strictly date-based against the
// calibration-history effective-from schedule.
//
// We DO NOT use feature-signature shortcuts (e.g. "row has dSumRankNorm →
// v11") because the live cron continuously back-fills the v11 feature
// surface AND the v12 score on every pick during model transitions — using
// stamp presence would falsely tag v12-era picks as v11 (and vice-versa).
// Pick date vs calibration cutover is the only reliable signal for "which
// model was driving the ship/mute/size decision on the day this pick fired."
function modelEraForPick(row, eras) {
  if (!row.date || eras.length === 0) return 'unknown';
  let match = 'unknown';
  for (const e of eras) {
    if (row.date >= e.effectiveFrom) match = e.version;
    else break;
  }
  return match;
}

// Pick out the v12 effective-from date from the calibration-history eras.
// Returns null if v12 hasn't shipped yet.
function v12EffectiveFrom(eras) {
  const e = eras.find(x => /v12/.test(x.version));
  return e ? e.effectiveFrom : null;
}

// All AGSU-promoted rows that fell within the v12 production window
// (date-only filter, ignores backfilled v12 stamps on older picks).
function v12EraRows(rows, eras) {
  const from = v12EffectiveFrom(eras);
  if (!from) return [];
  return rows.filter(r => r.date && r.date >= from);
}

function buildVersionComparison(report, rows, eras) {
  report.push(`## § 0b — AGS-U Model Version Comparison`);
  report.push('');
  report.push(`How does the latest model (**${eras[eras.length-1]?.version ?? 'live'}**) compare against prior versions? Picks are tagged **strictly by pick date** against the calibration-history cutover schedule below — that's the only signal that's robust to the cron back-filling v11/v12 stamps on historical picks during a transition.`);
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
    // Rank/calibration metrics: each era uses ITS OWN model's score so we
    // honestly measure that model's separating power. v11 score is a logit
    // (sigmoid → probability); v12 score is a wallet-quality mean ratio in
    // [-1, +1] and is NOT a probability, so we skip Brier for v12 to avoid
    // misleading apples-to-oranges comparisons. AUC is rank-based and
    // works on both.
    const scoreFn = isV12 ? (r => r.agsV12) : (r => r.ags);
    const withAgs = eraRows.filter(r => Number.isFinite(scoreFn(r)) && r.won != null);
    const auc = rocAuc(withAgs.map(scoreFn), withAgs.map(r => r.won));
    const brier = isV12
      ? null
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
      const eraRows = tagged.filter(r => r._era === version);
      const tierAgs = {};
      for (const t of ['ELITE', 'PREMIUM', 'LOCK', 'LEAN', 'WEAK']) {
        tierAgs[t] = aggregate(eraRows.filter(r => r.agsTier === t));
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

// ── CEO-grade V12 monitoring builders ───────────────────────────────────
// These are the top-level builders that compose the post-§2 report. Each
// answers a single CEO-level question in plain English, then backs the
// answer with numbers. Section ordering in main() is:
//   §1  Executive Summary (verdict + TL;DR card)
//   §2  Model version comparison (kept — see buildVersionComparison)
//   §3  What V12 actually is (plain-English primer)
//   §4  Daily trajectory (cumulative PnL since launch)
//   §5  Tier scoreboard (which tiers earn, sizing drift detection)
//   §6  Sport × market matrix (where edge lives)
//   §7  Score-band reliability (is V12 score predictive?)
//   §8  Mute-rule effectiveness (counterfactual on muted picks)
//   §9  V12 vs V11 differentiation (Spearman ρ on raw scores)
//   §10 Wallet-quality inputs (what V12 is "seeing")
//   §11 Recent V12 live picks (audit trail, last 30)
//   §12 Operational health (sizing pipeline, wallet pool)
//   §13 Live calibration snapshot (what thresholds V12 uses right now)
//
// All v12-scoped sections use date-only filtering via v12EraRows() so
// historical v11-era picks that the cron back-filled v12 scores onto
// cannot contaminate the production numbers.

// Convenience: compute v12 stats once and pass them around for the CEO
// summary card. Keeps the math in one place.
function computeV12Stats(agsuRows, allRowsAgsu, eras) {
  const v12From = v12EffectiveFrom(eras);
  if (!v12From) return null;
  const today = etToday();
  const daysLive = Math.max(1, Math.floor((new Date(today) - new Date(v12From)) / 86400000) + 1);
  const v12Rows = v12EraRows(agsuRows, eras);
  const v12RowsAll = v12EraRows(allRowsAgsu, eras);

  const agg = aggregate(v12Rows);
  const liveRows = v12Rows.filter(r => (r.units || 0) > 0 && !r.tracked);
  const mutedRows = v12Rows.filter(r => (r.units || 0) === 0 || r.tracked);

  // Most recent day with picks
  const dates = [...new Set(v12RowsAll.map(r => r.date))].sort();
  const lastDate = dates[dates.length - 1] || null;
  const lastDayRows = lastDate ? v12Rows.filter(r => r.date === lastDate) : [];
  const lastDayAgg = aggregate(lastDayRows);

  // Counterfactual on muted picks
  let mutedCfPnl = 0, mutedCfWins = 0, mutedCfLosses = 0;
  for (const r of mutedRows) {
    if (r.won == null) continue;
    if (r.won === 1) mutedCfWins++; else mutedCfLosses++;
    const odds = r.peakOdds || r.lockOdds;
    const win = r.won === 1
      ? (odds < 0 ? 100 / Math.abs(odds) : odds / 100)
      : -1;
    mutedCfPnl += win;
  }
  const mutedCfN = mutedCfWins + mutedCfLosses;
  const mutedCfRoi = mutedCfN > 0 ? (mutedCfPnl / mutedCfN) * 100 : null;

  return {
    v12From, daysLive,
    v12Rows, v12RowsAll, liveRows, mutedRows,
    agg, lastDate, lastDayAgg,
    mutedCfPnl, mutedCfRoi, mutedCfN, mutedCfWins, mutedCfLosses,
    perDayPnl: daysLive > 0 ? agg.profit / daysLive : null,
  };
}

// § 1 — CEO Executive Summary card
function buildV12CeoExecutive(report, stats, eras) {
  report.push(`## § 1 — Executive Summary`);
  report.push('');
  if (!stats) {
    report.push(`_(V12 has not yet shipped — section will populate when the v12 calibration is written to history.)_`);
    report.push('');
    return;
  }
  const { daysLive, v12From, v12Rows, v12RowsAll, liveRows, mutedRows, agg, lastDate, lastDayAgg, mutedCfRoi, mutedCfN, mutedCfPnl, perDayPnl } = stats;

  // Overall verdict — based on ROI: >+3% green, -3%..+3% yellow, <-3% red.
  let verdict, verdictTone;
  if (agg.n === 0) { verdict = 'WAITING'; verdictTone = '🟡'; }
  else if (agg.roi != null && agg.roi > 3) { verdict = 'WINNING'; verdictTone = '🟢'; }
  else if (agg.roi != null && agg.roi < -3) { verdict = 'LOSING'; verdictTone = '🚨'; }
  else { verdict = 'BREAK-EVEN'; verdictTone = '🟡'; }

  report.push(`> ${verdictTone} **V12 is currently ${verdict}.** Since going live on **${v12From}** (${daysLive} day${daysLive === 1 ? '' : 's'} ago), V12 has evaluated **${v12RowsAll.length}** picks, shipped **${liveRows.length}** for real money (${pct(liveRows.length, v12RowsAll.length)} ship rate), and muted the other **${v12RowsAll.length - liveRows.length}**. On the shipped picks V12 has gone **${agg.w}-${agg.l}** (${pct(agg.w, agg.n)} win), staked **${agg.totalStake.toFixed(2)}u**, and returned **${fmtSigned(agg.profit)}u** at **${agg.roi != null ? (agg.roi >= 0 ? '+' : '') + agg.roi.toFixed(1) + '%' : '—'} ROI**.`);
  report.push('');

  report.push(`### Snapshot`);
  report.push('');
  report.push(`| Metric                              | Value                          |`);
  report.push(`|-------------------------------------|--------------------------------|`);
  report.push(`| Days V12 has been authoritative     | ${String(daysLive).padStart(30)} |`);
  report.push(`| Picks V12 has evaluated             | ${String(v12RowsAll.length).padStart(30)} |`);
  report.push(`| Picks SHIPPED (units > 0)           | ${String(liveRows.length).padStart(30)} |`);
  report.push(`| Picks MUTED (score ≤ 0, FADE)       | ${String(v12RowsAll.length - liveRows.length).padStart(30)} |`);
  report.push(`| Ship rate                           | ${pct(liveRows.length, v12RowsAll.length).padStart(30)} |`);
  report.push(`| Live W-L                            | ${(agg.w+'-'+agg.l).padStart(30)} |`);
  report.push(`| Live Win %                          | ${pct(agg.w, agg.n).padStart(30)} |`);
  report.push(`| Live PnL (units)                    | ${fmtSigned(agg.profit).padStart(30)} |`);
  report.push(`| Live ROI                            | ${(agg.roi != null ? (agg.roi>=0?'+':'') + agg.roi.toFixed(1)+'%' : '—').padStart(30)} |`);
  report.push(`| Avg PnL / day                       | ${(perDayPnl != null ? fmtSigned(perDayPnl) + 'u' : '—').padStart(30)} |`);
  report.push(`| Most recent action (${lastDate || '—'})  | ${(lastDayAgg.n + ' live, ' + lastDayAgg.w + '-' + lastDayAgg.l + ', ' + fmtSigned(lastDayAgg.profit) + 'u').padStart(30)} |`);
  report.push('');

  // Top wins / watch items — pulled from the deeper sections.
  const wins = [];
  const watch = [];

  if (agg.roi != null && agg.roi > 3) {
    wins.push(`V12 is profitable at **${(agg.roi).toFixed(1)}% ROI** across ${agg.n} live picks (${fmtSigned(agg.profit)}u real PnL).`);
  }
  if (mutedCfRoi != null && mutedCfRoi < -3) {
    wins.push(`Mute rule is **saving money** — the ${mutedCfN} muted picks would have lost ${fmtSigned(mutedCfPnl)}u at flat 1u (${mutedCfRoi.toFixed(1)}% counterfactual ROI). V12 correctly rejected losers.`);
  }
  if (perDayPnl != null && perDayPnl > 0) {
    wins.push(`V12 is generating **${fmtSigned(perDayPnl)}u/day** on average since launch.`);
  }

  if (mutedCfRoi != null && mutedCfRoi > 3) {
    watch.push(`🚨 Mute rule is **costing money** — the ${mutedCfN} muted picks would have earned ${fmtSigned(mutedCfPnl)}u at flat 1u (${mutedCfRoi.toFixed(1)}% counterfactual ROI). V12 is throwing away edge — loosen the wallet-quality threshold.`);
  }
  // Tier inversion check
  const posTiers = ['ELITE', 'PREMIUM', 'LOCK', 'LEAN', 'WEAK'];
  const tierRois = posTiers.map(t => aggregate(v12Rows.filter(r => r.agsV12Tier === t)).roi).filter(v => v != null);
  if (tierRois.length >= 3) {
    const tierMono = monoScore(tierRois);
    if (tierMono >= (tierRois.length - 2)) {
      watch.push(`🚨 Tier ladder is **inverted** — high tiers are earning LESS than low tiers (monoScore = ${tierMono}). The score is upside-down on this sample; review §5.`);
    } else if (tierMono > 0) {
      watch.push(`🟡 Tier ladder is **partially inverted** — high tiers aren't cleanly out-earning low tiers (monoScore = ${tierMono}). Watch §5.`);
    }
  }
  // Per-sport callouts
  const sports = [...new Set(v12Rows.map(r => r.sport))];
  for (const sport of sports) {
    const sportAgg = aggregate(v12Rows.filter(r => r.sport === sport));
    if (sportAgg.n >= 5 && sportAgg.roi != null) {
      if (sportAgg.roi > 10) wins.push(`**${sport}** is V12's strongest sport: ${sportAgg.n} live, ${sportAgg.w}-${sportAgg.l}, ${sportAgg.roi.toFixed(1)}% ROI, ${fmtSigned(sportAgg.profit)}u.`);
      if (sportAgg.roi < -10) watch.push(`🟡 **${sport}** is bleeding: ${sportAgg.n} live, ${sportAgg.w}-${sportAgg.l}, ${sportAgg.roi.toFixed(1)}% ROI, ${fmtSigned(sportAgg.profit)}u. Consider scaling back V12's exposure here while it's the active model.`);
    }
  }
  // Per-market callouts
  const markets = ['ML', 'SPREAD', 'TOTAL'];
  for (const mkt of markets) {
    const mktAgg = aggregate(v12Rows.filter(r => r.marketType === mkt));
    if (mktAgg.n >= 5 && mktAgg.roi != null) {
      if (mktAgg.roi < -10) watch.push(`🟡 **${mkt}** market is bleeding under V12: ${mktAgg.n} live, ${mktAgg.w}-${mktAgg.l}, ${mktAgg.roi.toFixed(1)}% ROI, ${fmtSigned(mktAgg.profit)}u.`);
      if (mktAgg.roi > 15) wins.push(`**${mkt}** is V12's strongest market: ${mktAgg.n} live, ${mktAgg.w}-${mktAgg.l}, +${mktAgg.roi.toFixed(1)}% ROI.`);
    }
  }
  // Sample size warning
  if (agg.n < 20) {
    watch.push(`🟡 **Sample is still small** — only ${agg.n} live picks across ${daysLive} days. ROI/Win% will swing wildly until ~40-60 picks. Don't make big policy changes off ${agg.n}-pick samples.`);
  }

  if (wins.length > 0) {
    report.push(`### What's working`);
    report.push('');
    for (const w of wins.slice(0, 5)) report.push(`- ${w}`);
    report.push('');
  }
  if (watch.length > 0) {
    report.push(`### What to watch`);
    report.push('');
    for (const w of watch.slice(0, 5)) report.push(`- ${w}`);
    report.push('');
  }
}

// § 3 — Plain-English primer on what V12 actually is
function buildV12Primer(report) {
  report.push(`## § 3 — What V12 Actually Is (Plain English)`);
  report.push('');
  report.push(`Every prior AGS-Unified model (v9 → v11) was a **logistic regression** on a handful of hand-crafted features (count of sharp wallets FOR vs AGAINST, sum of sharp-wallet sizing ratios, leaderboard rank deltas, etc.). The score was a log-odds; ladder tiers were calibrated quintiles of that score; sizing was the v11 base × tier multiplier (2× / 1.5× / 1.1× / 0.5× / 0.2× / 0×).`);
  report.push('');
  report.push(`**V12 is fundamentally different.** It's a **single feature** that summarises the *quality difference* between the sharp money on the FOR side and the sharp money on the AGAINST side, then maps that difference to an absolute stake.`);
  report.push('');
  report.push(`Per pick:`);
  report.push('');
  report.push(`1. **Score every wallet on each side** with a quality formula \`Q = tierWeight × cappedROI × boundedSizeRatio × nReliab\`. Sharper wallets (better historical ROI, higher leaderboard tier, larger reliable sample) get bigger Qs.`);
  report.push(`2. **Take the mean Q on each side.** \`forMean\` = average wallet quality FOR the pick; \`againstMean\` = average AGAINST.`);
  report.push(`3. **The V12 score is the bounded ratio of the difference:** \`score = (forMean − againstMean) / max(|forMean|, |againstMean|, ε)\`. Bounded to [-1, +1]. Positive = sharp money is meaningfully better-quality on the FOR side. Negative or zero = it isn't.`);
  report.push('');
  report.push(`Three hard rules built on that score:`);
  report.push('');
  report.push(`- **Mute rule:** if score ≤ 0, the pick is FADE — **zero stake, no exception**. This replaces v11's calibrated-quintile q20 floor.`);
  report.push(`- **Absolute ladder (no multiplier):** score band → fixed units. **ELITE 5.00u · PREMIUM 3.00u · LOCK 1.00u · LEAN 0.50u · WEAK 0.25u · FADE 0.00u.** The stake is the answer, not a multiplier on a per-market base.`);
  report.push(`- **Odds cap:** long underdogs at +100 / +151 / +200 thresholds are capped down to 2.5 / 1.5 / 1.0u respectively, regardless of tier. Prevents one bad +200 ELITE from blowing up the bankroll.`);
  report.push('');
  report.push(`**Why this matters for monitoring.** V12 has no multi-feature attribution to audit — there's just **one** number, and either the wallet-quality formula is identifying sharper sides than the market is or it isn't. The sections below tell you exactly that, broken down by tier, sport, market, score band, and time.`);
  report.push('');
}

// § 4 — V12 Daily Production Scoreboard
function buildV12DailyScoreboard(report, stats) {
  report.push(`## § 4 — V12 Daily Production Scoreboard`);
  report.push('');
  if (!stats || stats.v12Rows.length === 0) {
    report.push(`_(no graded V12-era picks yet)_`);
    report.push('');
    return;
  }
  const { v12Rows, v12RowsAll, daysLive, perDayPnl, agg } = stats;
  report.push(`Day-by-day production since V12 went live. **Evaluated** = picks V12 scored that day. **Live** = picks shipped at units > 0 (real money). **Muted** = picks V12 rejected (score ≤ 0, FADE tier). **Cumulative PnL** is the running total of live unit profit/loss since launch.`);
  report.push('');
  const dates = [...new Set(v12RowsAll.map(r => r.date))].sort();
  report.push(`| Date       | Evaluated | Live | Muted | W-L (live) | Win %  | Stake (u) | PnL (u)    | ROI       | Cum PnL    |`);
  report.push(`|------------|-----------|------|-------|------------|--------|-----------|------------|-----------|------------|`);
  let cumPnl = 0;
  for (const d of dates) {
    const dayAll = v12RowsAll.filter(r => r.date === d);
    const dayGraded = v12Rows.filter(r => r.date === d);
    const dayAgg = aggregate(dayGraded);
    const muted = dayGraded.filter(r => (r.units || 0) === 0 || r.tracked).length;
    cumPnl += dayAgg.profit;
    report.push(`| ${d.padEnd(10)} | ${String(dayAll.length).padStart(9)} | ${String(dayAgg.n).padStart(4)} | ${String(muted).padStart(5)} | ${(dayAgg.w+'-'+dayAgg.l).padEnd(10)} | ${pct(dayAgg.w, dayAgg.n).padStart(6)} | ${dayAgg.totalStake.toFixed(2).padStart(9)} | ${fmtSigned(dayAgg.profit).padStart(10)} | ${(dayAgg.roi != null ? dayAgg.roi.toFixed(1)+'%' : '—').padStart(9)} | ${fmtSigned(cumPnl).padStart(10)} |`);
  }
  report.push('');

  // Narrative: trend interpretation
  if (dates.length >= 3) {
    const recentDays = dates.slice(-3);
    const recentRows = v12Rows.filter(r => recentDays.includes(r.date));
    const recentAgg = aggregate(recentRows);
    const olderDays = dates.slice(0, -3);
    const olderRows = v12Rows.filter(r => olderDays.includes(r.date));
    const olderAgg = aggregate(olderRows);
    let trendNote = '';
    if (recentAgg.roi != null && olderAgg.roi != null) {
      const delta = recentAgg.roi - olderAgg.roi;
      if (Math.abs(delta) < 3) trendNote = `Last 3 days (${recentAgg.roi.toFixed(1)}% ROI) is roughly **in-line** with the prior window (${olderAgg.roi.toFixed(1)}%). V12 is in a steady state.`;
      else if (delta > 0) trendNote = `🟢 Last 3 days (${recentAgg.roi.toFixed(1)}% ROI) is **+${delta.toFixed(1)}pp better** than the prior window (${olderAgg.roi.toFixed(1)}%). V12 is accelerating.`;
      else trendNote = `🟡 Last 3 days (${recentAgg.roi.toFixed(1)}% ROI) is **${delta.toFixed(1)}pp worse** than the prior window (${olderAgg.roi.toFixed(1)}%). Watch for further regression.`;
    }
    if (trendNote) {
      report.push(`> **Trajectory.** ${trendNote}`);
      report.push('');
    }
  }

  report.push(`> **Bottom line.** ${daysLive} day${daysLive === 1 ? '' : 's'} live, ${agg.n} live picks shipped, **${fmtSigned(agg.profit)}u total PnL** at **${agg.roi != null ? (agg.roi>=0?'+':'') + agg.roi.toFixed(1)+'%' : '—'} ROI**, averaging **${perDayPnl != null ? fmtSigned(perDayPnl) + 'u' : '—'} per day**.`);
  report.push('');
}

// § 5 — V12 Tier scoreboard + sizing drift
function buildV12TierAnalysis(report, stats) {
  report.push(`## § 5 — V12 By Tier (Where The Money Comes From)`);
  report.push('');
  if (!stats || stats.v12Rows.length === 0) {
    report.push(`_(no graded V12-era picks yet)_`);
    report.push('');
    return;
  }
  const { v12Rows } = stats;
  report.push(`V12 buckets every shipped pick into a tier (ELITE → WEAK) based on the score band, then stakes an absolute number of units per the ladder. **If the model is working, ELITE picks should out-earn PREMIUM, which should out-earn LOCK, and so on** — the ladder is V12's bet that higher scores deserve more capital.`);
  report.push('');
  report.push(`**Expected** is the ladder target before any odds-cap. **Avg stake actual** is what was actually staked (lower on positive odds because \`oddsCap\` clamps long underdogs). **Drift** = actual − expected. If Drift is materially negative on negative-odds picks, that's a sizing pipeline bug.`);
  report.push('');
  report.push(`| Tier     | Ladder | N   | W-L    | Win %  | Avg V12 score | Expected | Avg stake actual | Drift  | Total Stake | PnL (u)    | ROI       |`);
  report.push(`|----------|--------|-----|--------|--------|---------------|----------|------------------|--------|-------------|------------|-----------|`);
  const tierStats = {};
  for (const tier of TIER_ORDER) {
    const tierRows = v12Rows.filter(r => r.agsV12Tier === tier);
    const tagg = aggregate(tierRows);
    tierStats[tier] = tagg;
    if (tagg.n + tagg.trackedN === 0) continue;
    const avgScore = tierRows.length ? avg(tierRows.map(r => r.agsV12).filter(Number.isFinite)) : null;
    const expected = V12_TIER_UNITS[tier];
    const liveRowsTier = tierRows.filter(r => (r.units || 0) > 0 && !r.tracked);
    const avgStake = liveRowsTier.length ? avg(liveRowsTier.map(r => r.units)) : null;
    const drift = (avgStake != null) ? avgStake - expected : null;
    report.push(`| ${tier.padEnd(8)} | ${(expected.toFixed(2)+'u').padStart(6)} | ${String(tagg.n + tagg.trackedN).padStart(3)} | ${(tagg.w+'-'+tagg.l).padEnd(6)} | ${pct(tagg.w, tagg.n).padStart(6)} | ${(avgScore != null ? fmtSigned(avgScore, 3) : '—').padStart(13)} | ${(expected.toFixed(2)+'u').padStart(8)} | ${(avgStake != null ? avgStake.toFixed(2)+'u' : '—').padStart(16)} | ${(drift != null ? fmtSigned(drift, 2)+'u' : '—').padStart(6)} | ${tagg.totalStake.toFixed(2).padStart(11)} | ${fmtSigned(tagg.profit).padStart(10)} | ${(tagg.roi != null ? tagg.roi.toFixed(1)+'%' : '—').padStart(9)} |`);
  }
  report.push('');

  // Monotonicity verdict
  const posTiers = ['ELITE', 'PREMIUM', 'LOCK', 'LEAN', 'WEAK'];
  const rois = posTiers.map(t => tierStats[t].roi).filter(v => v != null);
  const winRates = posTiers.map(t => tierStats[t].realWinRate).filter(v => v != null);
  if (rois.length >= 2) {
    const roiMono = monoScore(rois);
    const winMono = monoScore(winRates);
    const verdict = (m, n) => m <= -(n-2) ? '🟢 monotonic' : m >= (n-2) ? '🚨 inverted' : '🟡 partial';
    report.push(`> **Ladder monotonicity** (positive tiers ELITE → WEAK only). ROI score \`${roiMono}\` ${verdict(roiMono, rois.length)} · Win-rate score \`${winMono}\` ${verdict(winMono, winRates.length)}. **${verdict(roiMono, rois.length).includes('monotonic') ? 'The ladder is working — V12 sizes high-edge picks more and they\'re returning more.' : verdict(roiMono, rois.length).includes('inverted') ? 'The ladder is upside-down — V12 is staking the wrong picks the most. This is the #1 thing to fix.' : 'Partial — the ladder is in the right direction overall but has rough spots. Watch a few more days before reacting.'}**`);
    report.push('');
  }

  // Per-pick sizing drift — only flag non-odds-cap discrepancies
  const drifters = [];
  for (const r of v12Rows) {
    if (!r.agsV12Tier) continue;
    const expected = V12_TIER_UNITS[r.agsV12Tier];
    const expectedCapped = oddsCapForReport(expected, r.peakOdds);
    const actual = r.units || 0;
    const diff = actual - expectedCapped;
    if (Math.abs(diff) >= 0.05) drifters.push({ r, expected, expectedCapped, actual, diff });
  }
  report.push(`### Sizing pipeline integrity`);
  report.push('');
  if (drifters.length > 0) {
    report.push(`🚨 **${drifters.length} picks deviate from the V12 ladder by > ±0.05u** even after accounting for the production odds-cap. Investigate \`unitsFromAgsV12\` in \`syncPickStateAuthoritative.js\`.`);
    report.push('');
    report.push(`| Date       | Sport | Mkt    | Pick                    | Odds  | V12   | Tier     | Expected (capped) | Actual | Drift  |`);
    report.push(`|------------|-------|--------|-------------------------|-------|-------|----------|-------------------|--------|--------|`);
    for (const d of drifters.slice(0, 25)) {
      const r = d.r;
      const teamLabel = `${r.team || r.sideKey || ''}`.substring(0, 23);
      const oddsStr = r.peakOdds > 0 ? `+${r.peakOdds}` : `${r.peakOdds}`;
      report.push(`| ${r.date.padEnd(10)} | ${(r.sport || '').padEnd(5)} | ${(r.marketType || '').padEnd(6)} | ${teamLabel.padEnd(23)} | ${oddsStr.padStart(5)} | ${fmtSigned(r.agsV12, 3).padStart(5)} | ${(r.agsV12Tier || '—').padEnd(8)} | ${(d.expectedCapped.toFixed(2)+'u').padStart(17)} | ${(d.actual.toFixed(2)+'u').padStart(6)} | ${fmtSigned(d.diff, 2).padStart(6)} |`);
    }
    if (drifters.length > 25) report.push(`| _… and ${drifters.length - 25} more_ |`);
    report.push('');
  } else {
    report.push(`🟢 **No sizing drift detected.** Every shipped V12 pick's actual stake matches the ladder target (after odds-cap) within ±0.05u. The sizing pipeline is healthy.`);
    report.push('');
  }
}

// § 6 — V12 By Sport & Market
function buildV12SportMarketAnalysis(report, stats) {
  report.push(`## § 6 — V12 By Sport & Market (Where The Edge Is)`);
  report.push('');
  if (!stats || stats.v12Rows.length === 0) {
    report.push(`_(no graded V12-era picks yet)_`);
    report.push('');
    return;
  }
  const { v12Rows } = stats;
  report.push(`V12 finds different amounts of edge in different sports and bet types. This grid shows live performance per sport × market cell. Each cell: \`N · Win% · ROI\` over LIVE shipped picks (units > 0).`);
  report.push('');
  const sports = [...new Set(v12Rows.map(r => r.sport))].sort();
  const markets = ['ML', 'SPREAD', 'TOTAL'];
  report.push(`| Sport | ${markets.map(m => m.padEnd(22)).join(' | ')} | All                    |`);
  report.push(`|-------|${markets.map(() => '------------------------').join('|')}|------------------------|`);
  for (const sport of sports) {
    const sportRows = v12Rows.filter(r => r.sport === sport);
    const cells = markets.map(m => {
      const a = aggregate(sportRows.filter(r => r.marketType === m));
      if (a.n === 0) return '—';
      return `${a.n}n · ${pct(a.w, a.n)} · ${a.roi != null ? (a.roi>=0?'+':'') + a.roi.toFixed(1)+'%' : '—'}`;
    });
    const all = aggregate(sportRows);
    const allCell = all.n === 0 ? '—' : `${all.n}n · ${pct(all.w, all.n)} · ${all.roi != null ? (all.roi>=0?'+':'') + all.roi.toFixed(1)+'%' : '—'}`;
    report.push(`| ${sport.padEnd(5)} | ${cells.map(c => c.padEnd(22)).join(' | ')} | ${allCell.padEnd(22)} |`);
  }
  const allCells = markets.map(m => {
    const a = aggregate(v12Rows.filter(r => r.marketType === m));
    if (a.n === 0) return '—';
    return `${a.n}n · ${pct(a.w, a.n)} · ${a.roi != null ? (a.roi>=0?'+':'') + a.roi.toFixed(1)+'%' : '—'}`;
  });
  const overall = aggregate(v12Rows);
  const overallCell = overall.n === 0 ? '—' : `${overall.n}n · ${pct(overall.w, overall.n)} · ${overall.roi != null ? (overall.roi>=0?'+':'') + overall.roi.toFixed(1)+'%' : '—'}`;
  report.push(`| **All** | ${allCells.map(c => `**${c}**`.padEnd(22)).join(' | ')} | ${('**'+overallCell+'**').padEnd(22)} |`);
  report.push('');

  // Best / worst callouts
  const cells = [];
  for (const sport of sports) {
    for (const mkt of markets) {
      const a = aggregate(v12Rows.filter(r => r.sport === sport && r.marketType === mkt));
      if (a.n >= 3 && a.roi != null) cells.push({ sport, mkt, ...a });
    }
  }
  if (cells.length > 0) {
    const best = cells.slice().sort((a, b) => b.roi - a.roi)[0];
    const worst = cells.slice().sort((a, b) => a.roi - b.roi)[0];
    report.push(`> **V12's strongest sub-market:** ${best.sport} ${best.mkt} — ${best.n} live, ${best.w}-${best.l}, ${(best.roi >= 0 ? '+' : '') + best.roi.toFixed(1)}% ROI, ${fmtSigned(best.profit)}u PnL.`);
    if (worst.roi < 0 && worst.sport !== best.sport && worst.mkt !== best.mkt) {
      report.push(`> **V12's weakest sub-market:** ${worst.sport} ${worst.mkt} — ${worst.n} live, ${worst.w}-${worst.l}, ${worst.roi.toFixed(1)}% ROI, ${fmtSigned(worst.profit)}u PnL. Consider tightening V12's threshold here.`);
    }
    report.push('');
  }
}

// § 7 — V12 Score-band reliability
function buildV12ScoreReliability(report, stats) {
  report.push(`## § 7 — Does V12 Actually Predict Outcomes? (Score Reliability)`);
  report.push('');
  if (!stats || stats.v12Rows.length === 0) {
    report.push(`_(no graded V12-era picks yet)_`);
    report.push('');
    return;
  }
  const { v12Rows } = stats;
  report.push(`If V12's score is real signal — not just a number — then **higher scores should win more often than the market is pricing**. This table buckets every graded V12 pick by score band and compares the realized win rate (what actually happened) against the market-implied win rate (what the closing odds said would happen). The gap, **Edge**, is V12's claimed alpha. Positive Edge in the high bands means V12 is finding mispricings the market hasn't.`);
  report.push('');
  const v12Bands = [
    { label: '> 0.9 (strongest)',  lo: 0.9,   hi: Infinity },
    { label: '0.7 – 0.9',           lo: 0.7,   hi: 0.9 },
    { label: '0.5 – 0.7',           lo: 0.5,   hi: 0.7 },
    { label: '0.25 – 0.5',          lo: 0.25,  hi: 0.5 },
    { label: '(0, 0.25]',           lo: 0,     hi: 0.25 },
    { label: '≤ 0 (MUTED)',         lo: -Infinity, hi: 0 },
  ];
  report.push(`| V12 score band     | N   | Live N | W-L    | Realized | Implied | Edge       | ROI (live)|`);
  report.push(`|--------------------|-----|--------|--------|----------|---------|------------|-----------|`);
  let strongBandEdge = null;
  let muteBandRealized = null;
  for (const b of v12Bands) {
    const bandRows = v12Rows.filter(r => {
      if (!Number.isFinite(r.agsV12)) return false;
      if (b.lo === -Infinity) return r.agsV12 <= b.hi;
      if (b.hi === Infinity) return r.agsV12 > b.lo;
      return r.agsV12 > b.lo && r.agsV12 <= b.hi;
    });
    if (bandRows.length === 0) continue;
    const bandAgg = aggregate(bandRows);
    const n = bandRows.length;
    const wins = bandRows.filter(r => r.won === 1).length;
    const realized = n > 0 ? wins / n * 100 : null;
    const impliedVals = bandRows.map(r => americanToImplied(r.lockOdds || r.peakOdds)).filter(Number.isFinite);
    const implied = impliedVals.length ? avg(impliedVals) * 100 : null;
    const edge = (realized != null && implied != null) ? realized - implied : null;
    if (b.label.startsWith('> 0.9') && edge != null) strongBandEdge = edge;
    if (b.label.startsWith('≤ 0') && realized != null) muteBandRealized = realized;
    report.push(`| ${b.label.padEnd(18)} | ${String(n).padStart(3)} | ${String(bandAgg.n).padStart(6)} | ${(bandAgg.w+'-'+bandAgg.l).padEnd(6)} | ${(realized != null ? realized.toFixed(1)+'%' : '—').padStart(8)} | ${(implied != null ? implied.toFixed(1)+'%' : '—').padStart(7)} | ${(edge != null ? (edge>=0?'+':'') + edge.toFixed(1)+'pp' : '—').padStart(10)} | ${(bandAgg.roi != null ? bandAgg.roi.toFixed(1)+'%' : '—').padStart(9)} |`);
  }
  report.push('');
  // Narrative
  const notes = [];
  if (strongBandEdge != null) {
    if (strongBandEdge > 3) notes.push(`🟢 **Strong-score band (> 0.9) wins ${strongBandEdge.toFixed(1)}pp more often than the market expects** — V12's high-confidence picks are real signal.`);
    else if (strongBandEdge < -3) notes.push(`🚨 **Strong-score band (> 0.9) wins ${strongBandEdge.toFixed(1)}pp LESS than the market expects** — V12 is misidentifying its highest-confidence picks. This is bad.`);
    else notes.push(`🟡 **Strong-score band (> 0.9) edge is +${strongBandEdge.toFixed(1)}pp** — borderline. Larger sample needed before declaring V12's top tier as real alpha.`);
  }
  if (muteBandRealized != null) {
    if (muteBandRealized < 50) notes.push(`🟢 **Mute band (≤ 0) actually wins only ${muteBandRealized.toFixed(1)}%** — V12 correctly identifies these as losers. The mute rule is justified.`);
    else if (muteBandRealized > 55) notes.push(`🚨 **Mute band (≤ 0) wins ${muteBandRealized.toFixed(1)}%** — these picks actually win MORE than half the time. V12 is rejecting winners. Loosen the mute threshold.`);
    else notes.push(`🟡 **Mute band wins ${muteBandRealized.toFixed(1)}%** — roughly coin-flip. The mute rule isn't obviously wrong, but it's not capturing strong rejection either. §8 quantifies the dollar impact.`);
  }
  for (const n of notes) {
    report.push(`> ${n}`);
    report.push('');
  }
}

// § 8 — V12 Mute-rule effectiveness
function buildV12MuteAudit(report, stats) {
  report.push(`## § 8 — V12 Mute Rule: Saving Money or Throwing Away Edge?`);
  report.push('');
  if (!stats || stats.mutedRows.length === 0) {
    report.push(`_(no muted V12-era picks yet)_`);
    report.push('');
    return;
  }
  const { mutedRows, mutedCfPnl, mutedCfRoi, mutedCfN, mutedCfWins, mutedCfLosses } = stats;
  report.push(`V12 muted **${mutedRows.length}** graded picks (any pick with score ≤ 0). This sub-section asks the most important question about V12: **were those rejections correct?**`);
  report.push('');
  report.push(`The audit is a counterfactual — if every muted pick had been shipped at a flat 1-unit stake (same risk per pick), what would the bottom line look like? If muting saved money, V12's rule is justified. If muting cost money, V12 is throwing away edge and the wallet-quality threshold should be loosened.`);
  report.push('');
  report.push(`| Metric                              | Value                |`);
  report.push(`|-------------------------------------|----------------------|`);
  report.push(`| Muted picks (graded)                | ${String(mutedCfN).padStart(20)} |`);
  report.push(`| Muted W-L                           | ${(mutedCfWins+'-'+mutedCfLosses).padStart(20)} |`);
  report.push(`| Muted Win %                         | ${(mutedCfN > 0 ? (mutedCfWins/mutedCfN*100).toFixed(1)+'%' : '—').padStart(20)} |`);
  report.push(`| Counterfactual PnL at flat 1u       | ${fmtSigned(mutedCfPnl).padStart(20)} |`);
  report.push(`| Counterfactual ROI at flat 1u       | ${(mutedCfRoi != null ? mutedCfRoi.toFixed(1)+'%' : '—').padStart(20)} |`);
  report.push('');
  let verdict, dollarImpact;
  if (mutedCfRoi == null) {
    verdict = '_(insufficient sample for a verdict)_';
  } else if (mutedCfRoi < -3) {
    dollarImpact = mutedCfPnl;  // negative ⇒ money saved
    verdict = `🟢 **THE MUTE RULE IS SAVING MONEY.** The picks V12 rejected would have lost **${fmtSigned(dollarImpact)}u** at a flat 1u stake — a counterfactual ROI of **${mutedCfRoi.toFixed(1)}%**. V12 is correctly identifying losers and refusing to ship them. **Keep the mute rule as-is.**`;
  } else if (mutedCfRoi > 3) {
    dollarImpact = mutedCfPnl;
    verdict = `🚨 **THE MUTE RULE IS COSTING MONEY.** The picks V12 rejected would have EARNED **${fmtSigned(dollarImpact)}u** at a flat 1u stake — a counterfactual ROI of **+${mutedCfRoi.toFixed(1)}%**. V12 is throwing away edge by being too restrictive. **Loosen the wallet-quality threshold** (e.g. allow scores < 0 down to some negative floor instead of zero).`;
  } else {
    verdict = `🟡 **The mute rule is approximately break-even** (counterfactual ROI ${mutedCfRoi.toFixed(1)}%, within ±3pp). V12 isn't actively destroying value on the muted pool but also isn't capturing edge there. No urgent action — keep monitoring.`;
  }
  report.push(`### Verdict`);
  report.push('');
  report.push(verdict);
  report.push('');
}

// § 9 — V12 vs V11 Differentiation
function buildV12VsV11Differentiation(report, stats) {
  report.push(`## § 9 — How Different is V12 from V11? (Pick Selection)`);
  report.push('');
  if (!stats || stats.v12Rows.length === 0) {
    report.push(`_(no graded V12-era picks yet)_`);
    report.push('');
    return;
  }
  const { v12Rows } = stats;
  const shared = v12Rows.filter(r => Number.isFinite(r.ags) && Number.isFinite(r.agsV12));
  if (shared.length === 0) {
    report.push(`_(no shared-stamp picks to compare)_`);
    report.push('');
    return;
  }
  report.push(`The cron continues to compute the v11 score (\`v8_ags\`) on every pick during the transition, even though V12 is now the authoritative model. That lets us answer a critical question: **is V12 just a re-skin of V11 with new sizes, or is it picking fundamentally different bets?**`);
  report.push('');
  report.push(`The cleanest test is **Spearman rank correlation** between v11 score and V12 score on the same picks. ρ ≈ +1.0 means the two models agree on which picks are strongest (so V12 is basically a sizing change). ρ ≈ 0 means they're orthogonal (V12 is picking completely different bets). ρ < 0 means they actively *disagree* — what V11 ranks high, V12 ranks low.`);
  report.push('');
  const v11Scores = shared.map(r => r.ags);
  const v12Scores = shared.map(r => r.agsV12);
  const rho = spearman(v11Scores, v12Scores);
  report.push(`| Metric                              | Value                |`);
  report.push(`|-------------------------------------|----------------------|`);
  report.push(`| Shared graded picks                 | ${String(shared.length).padStart(20)} |`);
  report.push(`| Spearman ρ (v11 vs V12 score)       | ${fmtN(rho, 3).padStart(20)} |`);
  report.push('');
  let interp;
  if (rho == null) {
    interp = '_(insufficient sample)_';
  } else if (rho > 0.7) {
    interp = `🟡 **V12 and V11 largely agree** — ρ = ${rho.toFixed(3)}. V12 is mostly a sizing redesign on top of V11's selection. The mute rule and absolute ladder are the main behavioural differences; pick selection is similar.`;
  } else if (rho > 0.2) {
    interp = `🟢 **V12 is meaningfully different from V11** — ρ = ${rho.toFixed(3)}. The two models agree on the broad direction but materially disagree on which picks deserve the most weight. V12's wallet-quality formula is doing real work.`;
  } else if (rho > -0.2) {
    interp = `🟢 **V12 is essentially independent of V11** — ρ = ${rho.toFixed(3)}. The two models are picking fundamentally different bets. Whether V12 outperforms V11 in this window (see § 2) tells you whether the wallet-quality redesign is paying off.`;
  } else {
    interp = `🟢 **V12 actively disagrees with V11** — ρ = ${rho.toFixed(3)}. The two models are ranking picks in nearly-opposite order. V12 is a fundamentally different bet-selection model, NOT a v11 tweak. If V12's results in § 2 are good, that disagreement is V12's whole edge.`;
  }
  report.push(`> ${interp}`);
  report.push('');
  report.push(`> **Why this is the only honest V11-vs-V12 comparison here.** The Firestore \`v8_agsTier\` stamp is overwritten by V12 in production, so any tier-confusion-matrix comparison would be artificially 100% diagonal. The raw scores (\`v8_ags\` and \`v8_agsV12\`) are still distinct, so Spearman ρ on those is the cleanest signal.`);
  report.push('');
}

// § 10 — V12 Wallet-quality inputs
function buildV12WalletQualityInputs(report, stats) {
  report.push(`## § 10 — V12 Wallet-Quality Inputs (What V12 Is "Seeing")`);
  report.push('');
  if (!stats || stats.v12Rows.length === 0) {
    report.push(`_(no graded V12-era picks yet)_`);
    report.push('');
    return;
  }
  const { v12Rows } = stats;
  const withMeans = v12Rows.filter(r => Number.isFinite(r.agsV12ForMean) && Number.isFinite(r.agsV12AgMean));
  if (withMeans.length === 0) {
    report.push(`_(the cron isn't stamping per-side wallet-quality means yet — this section will populate once \`v8_agsV12ForMean\` / \`v8_agsV12AgMean\` are being written. Until then, all you can see is the final V12 score in § 7.)_`);
    report.push('');
    return;
  }
  report.push(`V12's score is the bounded difference of two averages: the mean wallet quality FOR the pick minus the mean wallet quality AGAINST it. Surfacing those raw inputs lets you see whether V12 is "looking at" the right things: does V12 ship picks because the FOR-side wallets are genuinely sharper, or because the AGAINST-side has no wallets at all (which can artificially inflate the score)?`);
  report.push('');
  const forMeanAvg = avg(withMeans.map(r => r.agsV12ForMean));
  const agMeanAvg = avg(withMeans.map(r => r.agsV12AgMean));
  const forCountAvg = avg(withMeans.map(r => r.agsV12ForCount || 0));
  const agCountAvg = avg(withMeans.map(r => r.agsV12AgCount || 0));
  report.push(`### Average per-side wallet quality (across ${withMeans.length} V12-era picks)`);
  report.push('');
  report.push(`| Side    | Avg Q (mean)       | Avg # contributing wallets |`);
  report.push(`|---------|--------------------|----------------------------|`);
  report.push(`| FOR     | ${fmtSigned(forMeanAvg, 3).padStart(18)} | ${forCountAvg.toFixed(1).padStart(26)} |`);
  report.push(`| AGAINST | ${fmtSigned(agMeanAvg, 3).padStart(18)} | ${agCountAvg.toFixed(1).padStart(26)} |`);
  report.push('');

  // One-sided support
  const oneSidedFor = withMeans.filter(r => (r.agsV12ForCount || 0) >= 3 && (r.agsV12AgCount || 0) === 0);
  const oneSidedAg = withMeans.filter(r => (r.agsV12AgCount || 0) >= 3 && (r.agsV12ForCount || 0) === 0);
  if (oneSidedFor.length > 0 || oneSidedAg.length > 0) {
    report.push(`### One-sided wallet support (high-variance picks)`);
    report.push('');
    report.push(`- **${oneSidedFor.length}** picks had ≥ 3 FOR-side wallets but **zero** AGAINST-side wallets. V12 score is high here because the AGAINST mean defaults to 0, not because of genuine quality contrast.`);
    report.push(`- **${oneSidedAg.length}** picks had ≥ 3 AGAINST-side wallets but **zero** FOR-side wallets. Mirror case.`);
    report.push('');
    if (oneSidedFor.length > 0) {
      const agg = aggregate(oneSidedFor);
      report.push(`> One-sided FOR picks have gone **${agg.w}-${agg.l}** (${pct(agg.w, agg.n)} win) at **${(agg.roi != null ? (agg.roi>=0?'+':'') + agg.roi.toFixed(1)+'%' : '—')} ROI**. If this materially underperforms the all-picks average, the one-sided trigger should be tightened (e.g. require ≥ N AGAINST wallets before scoring).`);
      report.push('');
    }
  }

  // Wallet count distribution
  report.push(`### Wallet count distribution per pick`);
  report.push('');
  const forCounts = withMeans.map(r => r.agsV12ForCount || 0).sort((a, b) => a - b);
  const agCounts = withMeans.map(r => r.agsV12AgCount || 0).sort((a, b) => a - b);
  const pctile = (arr, p) => arr.length === 0 ? null : arr[Math.min(arr.length - 1, Math.floor(p * arr.length))];
  report.push(`| Side    | min | p25 | p50 | p75 | max |`);
  report.push(`|---------|-----|-----|-----|-----|-----|`);
  report.push(`| FOR     | ${String(pctile(forCounts, 0)).padStart(3)} | ${String(pctile(forCounts, 0.25)).padStart(3)} | ${String(pctile(forCounts, 0.5)).padStart(3)} | ${String(pctile(forCounts, 0.75)).padStart(3)} | ${String(pctile(forCounts, 0.99) ?? '—').padStart(3)} |`);
  report.push(`| AGAINST | ${String(pctile(agCounts, 0)).padStart(3)} | ${String(pctile(agCounts, 0.25)).padStart(3)} | ${String(pctile(agCounts, 0.5)).padStart(3)} | ${String(pctile(agCounts, 0.75)).padStart(3)} | ${String(pctile(agCounts, 0.99) ?? '—').padStart(3)} |`);
  report.push('');
}

// § 11 — Recent V12 live picks (audit trail)
function buildV12RecentLivePicks(report, stats, n = 30) {
  report.push(`## § 11 — Recent V12 Live Picks (Audit Trail)`);
  report.push('');
  if (!stats || stats.liveRows.length === 0) {
    report.push(`_(no live V12 picks yet)_`);
    report.push('');
    return;
  }
  const { liveRows } = stats;
  const recent = liveRows
    .slice()
    .sort((a, b) => a.date < b.date ? 1 : a.date > b.date ? -1 : 0)
    .slice(0, n);
  report.push(`The last ${recent.length} picks V12 actually shipped (units > 0). This is the audit trail — every row is a real bet that risked real money, with the V12 score that drove the decision and the realised outcome.`);
  report.push('');
  report.push(`| Date       | Sport | Mkt    | Pick                    | Odds  | V12   | Tier     | Stake | Outcome | PnL (u)    |`);
  report.push(`|------------|-------|--------|-------------------------|-------|-------|----------|-------|---------|------------|`);
  for (const r of recent) {
    const teamLabel = `${r.team || r.sideKey || ''}`.substring(0, 23);
    const oddsStr = r.peakOdds > 0 ? `+${r.peakOdds}` : `${r.peakOdds}`;
    const outcome = r.won === 1 ? 'WIN' : r.won === 0 ? 'LOSS' : '—';
    report.push(`| ${r.date.padEnd(10)} | ${(r.sport || '').padEnd(5)} | ${(r.marketType || '').padEnd(6)} | ${teamLabel.padEnd(23)} | ${oddsStr.padStart(5)} | ${(Number.isFinite(r.agsV12) ? fmtSigned(r.agsV12, 3) : '—').padStart(5)} | ${(r.agsV12Tier || '—').padEnd(8)} | ${((r.units||0).toFixed(2)+'u').padStart(5)} | ${outcome.padEnd(7)} | ${fmtSigned(r.profit).padStart(10)} |`);
  }
  report.push('');
}

// ── § 13 — V12 Deep Performance Monitor ─────────────────────────────────
// Everything in this section is V12-ONLY and date-scoped to the v12 era
// (so cron back-fill of v12 scores onto historical picks can't contaminate
// production metrics). Sub-sections:
//   A. Daily trajectory
//   B. Tier × production scoreboard (with absolute-ladder drift)
//   C. Sizing drift (per-pick) — only flags non-odds-cap discrepancies
//   D. Per-sport × per-market matrix
//   E. Score-band reliability (calibration on the v12 axis)
//   F. Mute-rule effectiveness (counterfactual at flat 1u on FADE picks)
//   G. V12 vs V11 tier disagreement on shared picks
//   H. Wallet-quality audit (when per-side mean stamps exist)
//   I. Recent v12 picks (last 20 shipped)
function buildV12DeepMonitor(report, agsuRows, allRows, eras, liveCal) {
  report.push(`## § 13 — V12 Deep Performance Monitor`);
  report.push('');

  const v12From = v12EffectiveFrom(eras);
  if (!v12From) {
    report.push(`_(v12 not yet in calibration history — section will populate when v12 ships)_`);
    report.push('');
    return;
  }

  const today = etToday();
  const daysLive = Math.max(1, Math.floor((new Date(today) - new Date(v12From)) / 86400000) + 1);
  const v12Rows = v12EraRows(agsuRows, eras);
  const v12RowsAll = v12EraRows(allRows.filter(r => isAgsuPromotion(r.promotedBy)), eras);

  report.push(`V12 went authoritative on **${v12From}** (${daysLive} day${daysLive === 1 ? '' : 's'} live). This section monitors v12 IN PRODUCTION — every metric is scoped to AGSU-promoted picks dated ≥ ${v12From}, so cron back-fill of v12 stamps onto historical v11-era picks cannot contaminate the numbers. Pool size: **${v12Rows.length}** graded picks · **${v12RowsAll.length}** sides total (graded + pending).`);
  report.push('');

  if (v12Rows.length === 0) {
    report.push(`_(no graded v12-era picks yet)_`);
    report.push('');
    return;
  }

  // ── A. Daily trajectory ────────────────────────────────────────────
  report.push(`### A. V12 daily trajectory`);
  report.push('');
  report.push(`Day-by-day production. **Evaluated** = AGSU picks made that day (graded + pending). **Live** = units > 0 and not tracked. **Muted** = FADE / 0u / tracked. **Cumulative PnL** is the running total of live PnL across v12's life.`);
  report.push('');
  const dates = [...new Set(v12RowsAll.map(r => r.date))].sort();
  report.push(`| Date       | Evaluated | Live | Muted | W-L (live) | Win %  | Stake (u) | PnL (u)    | ROI       | Cum PnL    |`);
  report.push(`|------------|-----------|------|-------|------------|--------|-----------|------------|-----------|------------|`);
  let cumPnl = 0;
  for (const d of dates) {
    const dayAll = v12RowsAll.filter(r => r.date === d);
    const dayGraded = v12Rows.filter(r => r.date === d);
    const agg = aggregate(dayGraded);
    const muted = dayGraded.filter(r => (r.units || 0) === 0 || r.tracked).length;
    cumPnl += agg.profit;
    report.push(`| ${d.padEnd(10)} | ${String(dayAll.length).padStart(9)} | ${String(agg.n).padStart(4)} | ${String(muted).padStart(5)} | ${(agg.w+'-'+agg.l).padEnd(10)} | ${pct(agg.w, agg.n).padStart(6)} | ${agg.totalStake.toFixed(2).padStart(9)} | ${fmtSigned(agg.profit).padStart(10)} | ${(agg.roi != null ? agg.roi.toFixed(1)+'%' : '—').padStart(9)} | ${fmtSigned(cumPnl).padStart(10)} |`);
  }
  report.push('');

  // ── B. Production tier scoreboard ──────────────────────────────────
  report.push(`### B. V12 production tier scoreboard`);
  report.push('');
  report.push(`Performance broken down by the v12 tier the cron stamped at lock. **Expected** is the absolute-ladder target before odds-cap; **Avg stake actual** is the realised average (lower is fine on positive odds because \`oddsCap\` clamps long underdogs). **Drift** = Avg stake − Expected. Drift > 0 or drift < –1.0u on negative odds is a sizing-pipeline regression.`);
  report.push('');
  report.push(`| Tier     | Ladder | N   | W-L    | Win %  | Avg AGS-v12 | Expected | Avg stake actual | Drift  | Total Stake | PnL (u)    | ROI       |`);
  report.push(`|----------|--------|-----|--------|--------|-------------|----------|------------------|--------|-------------|------------|-----------|`);
  const tierStats = {};
  for (const tier of TIER_ORDER) {
    const tierRows = v12Rows.filter(r => r.agsV12Tier === tier);
    const agg = aggregate(tierRows);
    tierStats[tier] = agg;
    if (agg.n + agg.trackedN === 0) continue;
    const avgScore = tierRows.length ? avg(tierRows.map(r => r.agsV12).filter(Number.isFinite)) : null;
    const expected = V12_TIER_UNITS[tier];
    const liveRows = tierRows.filter(r => (r.units || 0) > 0 && !r.tracked);
    const avgStake = liveRows.length ? avg(liveRows.map(r => r.units)) : null;
    const drift = (avgStake != null) ? avgStake - expected : null;
    report.push(`| ${tier.padEnd(8)} | ${(expected.toFixed(2)+'u').padStart(6)} | ${String(agg.n + agg.trackedN).padStart(3)} | ${(agg.w+'-'+agg.l).padEnd(6)} | ${pct(agg.w, agg.n).padStart(6)} | ${(avgScore != null ? fmtSigned(avgScore, 3) : '—').padStart(11)} | ${(expected.toFixed(2)+'u').padStart(8)} | ${(avgStake != null ? avgStake.toFixed(2)+'u' : '—').padStart(16)} | ${(drift != null ? fmtSigned(drift, 2)+'u' : '—').padStart(6)} | ${agg.totalStake.toFixed(2).padStart(11)} | ${fmtSigned(agg.profit).padStart(10)} | ${(agg.roi != null ? agg.roi.toFixed(1)+'%' : '—').padStart(9)} |`);
  }
  report.push('');
  // Monotonicity on positive tiers
  const posTiers = ['ELITE', 'PREMIUM', 'LOCK', 'LEAN', 'WEAK'];
  const rois = posTiers.map(t => tierStats[t].roi).filter(v => v != null);
  const winRates = posTiers.map(t => tierStats[t].realWinRate).filter(v => v != null);
  if (rois.length >= 2) {
    const roiMono = monoScore(rois);
    const winMono = monoScore(winRates);
    const verdict = (m, n) => m <= -(n-2) ? '🟢 monotonic' : m >= (n-2) ? '🚨 inverted' : '🟡 partial';
    report.push(`> **Monotonicity (positive tiers ELITE → WEAK).** ROI score \`${roiMono}\` ${verdict(roiMono, rois.length)} · Win-rate score \`${winMono}\` ${verdict(winMono, winRates.length)}. ELITE should out-earn PREMIUM should out-earn LOCK… If inverted, the v12 score is upside-down on this sample (sizing the wrong picks the most).`);
    report.push('');
  }

  // ── C. Per-pick sizing drift (only flag non-odds-cap discrepancies) ─
  const drifters = [];
  for (const r of v12Rows) {
    if (!r.agsV12Tier) continue;
    const expected = V12_TIER_UNITS[r.agsV12Tier];
    const expectedCapped = oddsCapForReport(expected, r.peakOdds);
    const actual = r.units || 0;
    const diff = actual - expectedCapped;
    if (Math.abs(diff) >= 0.05) drifters.push({ r, expected, expectedCapped, actual, diff });
  }
  if (drifters.length > 0) {
    report.push(`### C. V12 sizing drift (per-pick)`);
    report.push('');
    report.push(`🚨 **${drifters.length} picks deviate from the v12 ladder** by more than ±0.05u after applying the same odds-cap the production cron uses. Investigate \`unitsFromAgsV12\` in \`syncPickStateAuthoritative.js\` and re-stamp via the sync script.`);
    report.push('');
    report.push(`| Date       | Sport | Mkt    | Pick                    | Odds  | v12   | Tier     | Expected (cap) | Actual | Drift  |`);
    report.push(`|------------|-------|--------|-------------------------|-------|-------|----------|----------------|--------|--------|`);
    for (const d of drifters.slice(0, 25)) {
      const r = d.r;
      const teamLabel = `${r.team || r.sideKey || ''}`.substring(0, 23);
      const oddsStr = r.peakOdds > 0 ? `+${r.peakOdds}` : `${r.peakOdds}`;
      report.push(`| ${r.date.padEnd(10)} | ${(r.sport || '').padEnd(5)} | ${(r.marketType || '').padEnd(6)} | ${teamLabel.padEnd(23)} | ${oddsStr.padStart(5)} | ${fmtSigned(r.agsV12, 3).padStart(5)} | ${(r.agsV12Tier || '—').padEnd(8)} | ${(d.expectedCapped.toFixed(2)+'u').padStart(14)} | ${(d.actual.toFixed(2)+'u').padStart(6)} | ${fmtSigned(d.diff, 2).padStart(6)} |`);
    }
    if (drifters.length > 25) report.push(`| _… and ${drifters.length - 25} more_ |`);
    report.push('');
  } else {
    report.push(`### C. V12 sizing drift (per-pick)`);
    report.push('');
    report.push(`🟢 **No sizing drift detected.** Every v12 pick's stamped \`finalUnits\` matches the ladder target after odds-cap, within ±0.05u tolerance.`);
    report.push('');
  }

  // ── D. Per-sport × per-market matrix ──────────────────────────────
  report.push(`### D. V12 performance by sport × market`);
  report.push('');
  report.push(`Where is v12 finding edge? Each cell shows \`N · Win% · ROI\` over LIVE picks (units > 0).`);
  report.push('');
  const sports = [...new Set(v12Rows.map(r => r.sport))].sort();
  const markets = ['ML', 'SPREAD', 'TOTAL'];
  report.push(`| Sport | ${markets.map(m => m.padEnd(20)).join(' | ')} | All                  |`);
  report.push(`|-------|${markets.map(() => '----------------------').join('|')}|----------------------|`);
  for (const sport of sports) {
    const sportRows = v12Rows.filter(r => r.sport === sport);
    const cells = markets.map(m => {
      const a = aggregate(sportRows.filter(r => r.marketType === m));
      if (a.n === 0) return '—';
      return `${a.n}n · ${pct(a.w, a.n)} · ${a.roi != null ? (a.roi>=0?'+':'') + a.roi.toFixed(1)+'%' : '—'}`;
    });
    const all = aggregate(sportRows);
    const allCell = all.n === 0 ? '—' : `${all.n}n · ${pct(all.w, all.n)} · ${all.roi != null ? (all.roi>=0?'+':'') + all.roi.toFixed(1)+'%' : '—'}`;
    report.push(`| ${sport.padEnd(5)} | ${cells.map(c => c.padEnd(20)).join(' | ')} | ${allCell.padEnd(20)} |`);
  }
  // All sports row
  const allCells = markets.map(m => {
    const a = aggregate(v12Rows.filter(r => r.marketType === m));
    if (a.n === 0) return '—';
    return `${a.n}n · ${pct(a.w, a.n)} · ${a.roi != null ? (a.roi>=0?'+':'') + a.roi.toFixed(1)+'%' : '—'}`;
  });
  const overall = aggregate(v12Rows);
  const overallCell = overall.n === 0 ? '—' : `${overall.n}n · ${pct(overall.w, overall.n)} · ${overall.roi != null ? (overall.roi>=0?'+':'') + overall.roi.toFixed(1)+'%' : '—'}`;
  report.push(`| **All** | ${allCells.map(c => `**${c}**`.padEnd(20)).join(' | ')} | ${('**' + overallCell + '**').padEnd(20)} |`);
  report.push('');

  // ── E. Score-band reliability ─────────────────────────────────────
  report.push(`### E. V12 score-band reliability`);
  report.push('');
  report.push(`Does v12 score actually predict outcomes? Picks bucketed by v12 score. **Realized** = win rate among graded picks in the band; **Implied** = average market implied probability. **Edge** = Realized − Implied (positive = v12 is finding mispricings the market doesn't).`);
  report.push('');
  const v12Bands = [
    { label: '> 0.9 (strong)',   lo: 0.9,   hi: Infinity },
    { label: '0.7 – 0.9',         lo: 0.7,   hi: 0.9 },
    { label: '0.5 – 0.7',         lo: 0.5,   hi: 0.7 },
    { label: '0.25 – 0.5',        lo: 0.25,  hi: 0.5 },
    { label: '(0, 0.25]',         lo: 0,     hi: 0.25 },
    { label: '≤ 0 (MUTE rule)',   lo: -Infinity, hi: 0 },
  ];
  report.push(`| v12 band         | N   | Live N | W-L    | Realized | Implied | Edge       | ROI (live)|`);
  report.push(`|------------------|-----|--------|--------|----------|---------|------------|-----------|`);
  for (const b of v12Bands) {
    const bandRows = v12Rows.filter(r => {
      if (!Number.isFinite(r.agsV12)) return false;
      if (b.lo === -Infinity) return r.agsV12 <= b.hi;
      if (b.hi === Infinity) return r.agsV12 > b.lo;
      return r.agsV12 > b.lo && r.agsV12 <= b.hi;
    });
    if (bandRows.length === 0) continue;
    const agg = aggregate(bandRows);
    const n = bandRows.length;
    const wins = bandRows.filter(r => r.won === 1).length;
    const realized = n > 0 ? wins / n * 100 : null;
    const impliedVals = bandRows.map(r => americanToImplied(r.lockOdds || r.peakOdds)).filter(Number.isFinite);
    const implied = impliedVals.length ? avg(impliedVals) * 100 : null;
    const edge = (realized != null && implied != null) ? realized - implied : null;
    report.push(`| ${b.label.padEnd(16)} | ${String(n).padStart(3)} | ${String(agg.n).padStart(6)} | ${(agg.w+'-'+agg.l).padEnd(6)} | ${(realized != null ? realized.toFixed(1)+'%' : '—').padStart(8)} | ${(implied != null ? implied.toFixed(1)+'%' : '—').padStart(7)} | ${(edge != null ? (edge>=0?'+':'') + edge.toFixed(1)+'pp' : '—').padStart(10)} | ${(agg.roi != null ? agg.roi.toFixed(1)+'%' : '—').padStart(9)} |`);
  }
  report.push('');
  report.push(`> The **MUTE band (≤ 0)** is what v12 chose NOT to ship. If those picks win at > ~52%, the mute rule is too aggressive and is throwing away edge. The mute audit in §F quantifies the dollar impact.`);
  report.push('');

  // ── F. Mute-rule effectiveness ────────────────────────────────────
  const muted = v12Rows.filter(r => r.agsV12Tier === 'FADE' || (Number.isFinite(r.agsV12) && r.agsV12 <= 0));
  if (muted.length > 0) {
    report.push(`### F. V12 mute-rule effectiveness (counterfactual on FADE picks)`);
    report.push('');
    report.push(`v12 muted **${muted.length}** graded picks (score ≤ 0). If those had each been shipped at a flat 1u stake, this is what would have happened. The verdict tells you whether the mute rule is **saving money** (good) or **throwing away edge** (bad).`);
    report.push('');
    let cfPnl = 0;
    let cfWins = 0;
    let cfLosses = 0;
    for (const r of muted) {
      if (r.won == null) continue;
      if (r.won === 1) cfWins++; else cfLosses++;
      const odds = r.peakOdds || r.lockOdds;
      const win = r.won === 1
        ? (odds < 0 ? 100 / Math.abs(odds) : odds / 100)
        : -1;
      cfPnl += win;
    }
    const cfN = cfWins + cfLosses;
    const cfWinRate = cfN > 0 ? cfWins / cfN * 100 : null;
    const cfRoi = cfN > 0 ? cfPnl / cfN * 100 : null;
    report.push(`| Metric                              | Value                |`);
    report.push(`|-------------------------------------|----------------------|`);
    report.push(`| Muted picks (graded)                | ${String(cfN).padStart(20)} |`);
    report.push(`| Muted W-L                           | ${(cfWins+'-'+cfLosses).padStart(20)} |`);
    report.push(`| Muted Win %                         | ${(cfWinRate != null ? cfWinRate.toFixed(1)+'%' : '—').padStart(20)} |`);
    report.push(`| Flat-1u counterfactual PnL          | ${fmtSigned(cfPnl).padStart(20)} |`);
    report.push(`| Flat-1u counterfactual ROI          | ${(cfRoi != null ? cfRoi.toFixed(1)+'%' : '—').padStart(20)} |`);
    report.push('');
    let verdict;
    if (cfRoi == null) verdict = '_(insufficient sample)_';
    else if (cfRoi < -3) verdict = `🟢 **MUTE IS SAVING MONEY.** Muted picks would have lost ${fmtSigned(cfPnl)}u at flat 1u — v12 correctly identified losers.`;
    else if (cfRoi > 3) verdict = `🚨 **MUTE IS COSTING MONEY.** Muted picks would have earned ${fmtSigned(cfPnl)}u at flat 1u — v12 is throwing away edge. Loosen the wallet-quality threshold.`;
    else verdict = `🟡 **Mute is approximately break-even** (±3% ROI). v12 is not destroying value on the muted pool, but it's also not capturing much either.`;
    report.push(`**Verdict:** ${verdict}`);
    report.push('');
  }

  // ── G. V12 vs V11 tier disagreement on shared picks ───────────────
  // KNOWN LIMITATION: `syncPickStateAuthoritative.js` overwrites
  // `v8_agsTier` with the v12 tier whenever v12 is the authoritative model.
  // That means on v12-era picks `r.agsTier === r.agsV12Tier` by
  // construction — the confusion matrix below is therefore ALWAYS 100%
  // diagonal and is rendered only as a structural sanity check. To make
  // this section analytically useful we'd need to re-derive the v11 tier
  // from the still-stamped v11 score `r.ags` against the v11 quintile
  // calibration (a future addition to liveCal export).
  const shared = v12Rows.filter(r => Number.isFinite(r.ags) && Number.isFinite(r.agsV12) && r.agsTier && r.agsV12Tier);
  if (shared.length > 0) {
    report.push(`### G. V12 vs V11 tier comparison (shared picks)`);
    report.push('');
    const stampedAgreementOnly = shared.every(r => r.agsTier === r.agsV12Tier);
    if (stampedAgreementOnly) {
      report.push(`> 🟡 **Comparison degraded.** \`syncPickStateAuthoritative.js\` overwrites the Firestore \`v8_agsTier\` stamp with the v12 tier whenever v12 is authoritative. So on every v12-era pick the stamped v11 tier *equals* the v12 tier by construction — a true v11-vs-v12 confusion matrix would require re-deriving the v11 tier from the still-stamped v11 SCORE (\`v8_ags\`) against the v11 quintile calibration. Until the v11 quintile cal is plumbed into \`liveCal\`, this sub-section is intentionally suppressed to avoid showing a misleading 100% agreement.`);
      report.push('');
      // Show v11 vs v12 SCORE rank correlation instead — that IS unaffected
      // by the tier overwrite, and tells us if the two models even sort picks
      // the same way.
      const v11Scores = shared.map(r => r.ags);
      const v12Scores = shared.map(r => r.agsV12);
      const rho = spearman(v11Scores, v12Scores);
      report.push(`> **Spearman ρ (v11 score vs v12 score):** \`${fmtN(rho, 3)}\` on **${shared.length}** shared picks. ρ ≈ +1 = the two models rank the same picks the same way (so v12 isn't adding new sorting signal, just a new sizing rule). ρ < +0.5 = v12 is sorting picks materially differently from v11 — that's where the v12 wallet-quality formula actually changes which bets get the most stake.`);
      report.push('');
    } else {
      const cols = TIER_ORDER;
      report.push(`Confusion matrix on **${shared.length}** v12-era picks where both v11 and v12 stamped a tier.`);
      report.push('');
      report.push(`| v11 ↓ \\\\ v12 → | ${cols.map(c => c.padEnd(8)).join(' | ')} | Total |`);
      report.push(`|----------------|${cols.map(() => '----------').join('|')}|-------|`);
      for (const v11T of TIER_ORDER) {
        const row = shared.filter(r => r.agsTier === v11T);
        if (row.length === 0) continue;
        const cells = cols.map(v12T => row.filter(r => r.agsV12Tier === v12T).length);
        report.push(`| ${v11T.padEnd(14)} | ${cells.map(n => String(n).padStart(8)).join(' | ')} | ${String(row.length).padStart(5)} |`);
      }
      const totals = cols.map(c => shared.filter(r => r.agsV12Tier === c).length);
      report.push(`| **Total**      | ${totals.map(n => String(n).padStart(8)).join(' | ')} | ${String(shared.length).padStart(5)} |`);
      report.push('');
      const agreed = shared.filter(r => r.agsTier === r.agsV12Tier).length;
      const upgraded = shared.filter(r => TIER_ORDER.indexOf(r.agsV12Tier) < TIER_ORDER.indexOf(r.agsTier)).length;
      const downgraded = shared.filter(r => TIER_ORDER.indexOf(r.agsV12Tier) > TIER_ORDER.indexOf(r.agsTier)).length;
      const upgradedAgg = aggregate(shared.filter(r => TIER_ORDER.indexOf(r.agsV12Tier) < TIER_ORDER.indexOf(r.agsTier)));
      const downgradedAgg = aggregate(shared.filter(r => TIER_ORDER.indexOf(r.agsV12Tier) > TIER_ORDER.indexOf(r.agsTier)));
      const agreedAgg = aggregate(shared.filter(r => r.agsTier === r.agsV12Tier));
      report.push(`> **Agreement** ${pct(agreed, shared.length)} · **v12 upgraded** ${pct(upgraded, shared.length)} · **v12 downgraded** ${pct(downgraded, shared.length)}.`);
      report.push('');
      report.push(`| Disagreement type | Live N | W-L | Win % | ROI       | PnL (u)    |`);
      report.push(`|-------------------|--------|-----|-------|-----------|------------|`);
      report.push(`| Agreed            | ${String(agreedAgg.n).padStart(6)} | ${(agreedAgg.w+'-'+agreedAgg.l).padEnd(3)} | ${pct(agreedAgg.w, agreedAgg.n).padStart(5)} | ${(agreedAgg.roi != null ? agreedAgg.roi.toFixed(1)+'%' : '—').padStart(9)} | ${fmtSigned(agreedAgg.profit).padStart(10)} |`);
      report.push(`| v12 upgraded      | ${String(upgradedAgg.n).padStart(6)} | ${(upgradedAgg.w+'-'+upgradedAgg.l).padEnd(3)} | ${pct(upgradedAgg.w, upgradedAgg.n).padStart(5)} | ${(upgradedAgg.roi != null ? upgradedAgg.roi.toFixed(1)+'%' : '—').padStart(9)} | ${fmtSigned(upgradedAgg.profit).padStart(10)} |`);
      report.push(`| v12 downgraded    | ${String(downgradedAgg.n).padStart(6)} | ${(downgradedAgg.w+'-'+downgradedAgg.l).padEnd(3)} | ${pct(downgradedAgg.w, downgradedAgg.n).padStart(5)} | ${(downgradedAgg.roi != null ? downgradedAgg.roi.toFixed(1)+'%' : '—').padStart(9)} | ${fmtSigned(downgradedAgg.profit).padStart(10)} |`);
      report.push('');
      report.push(`> **Reading this.** If "v12 upgraded" out-performs "v12 downgraded", v12 is making **good** discretionary calls vs v11. If the other way, v12's disagreements are systematically wrong and the wallet-quality formula needs work.`);
      report.push('');
    }
  }

  // ── H. Wallet-quality audit (per-side means, when available) ───────
  const withMeans = v12Rows.filter(r => Number.isFinite(r.agsV12ForMean) && Number.isFinite(r.agsV12AgMean));
  if (withMeans.length > 0) {
    report.push(`### H. V12 wallet-quality audit (per-side means)`);
    report.push('');
    report.push(`v12's score is the per-side mean of \`Q = tierWeight × cappedROI × boundedSizeRatio × nReliab\` minus the AGAINST-side mean. This table shows how concentrated wallet quality is on each side.`);
    report.push('');
    const forMeanAvg = avg(withMeans.map(r => r.agsV12ForMean));
    const agMeanAvg = avg(withMeans.map(r => r.agsV12AgMean));
    const forCountAvg = avg(withMeans.map(r => r.agsV12ForCount || 0));
    const agCountAvg = avg(withMeans.map(r => r.agsV12AgCount || 0));
    report.push(`| Side    | Avg Q (mean)       | Avg # contributing wallets |`);
    report.push(`|---------|--------------------|----------------------------|`);
    report.push(`| FOR     | ${fmtSigned(forMeanAvg, 3).padStart(18)} | ${forCountAvg.toFixed(1).padStart(26)} |`);
    report.push(`| AGAINST | ${fmtSigned(agMeanAvg, 3).padStart(18)} | ${agCountAvg.toFixed(1).padStart(26)} |`);
    report.push('');
    // One-sided warning
    const oneSidedFor = withMeans.filter(r => (r.agsV12ForCount || 0) >= 3 && (r.agsV12AgCount || 0) === 0);
    const oneSidedAg = withMeans.filter(r => (r.agsV12AgCount || 0) >= 3 && (r.agsV12ForCount || 0) === 0);
    if (oneSidedFor.length > 0 || oneSidedAg.length > 0) {
      report.push(`> 🟡 **One-sided wallet support.** ${oneSidedFor.length} picks had FOR-side wallets but zero AGAINST-side wallets · ${oneSidedAg.length} picks had AGAINST-side wallets but zero FOR-side. v12 is comfortable scoring these because the AGAINST mean defaults to 0, but they're high-variance bets — track separately.`);
      report.push('');
    }
  }

  // ── I. Recent v12 live picks ───────────────────────────────────────
  const recentLive = v12Rows
    .filter(r => (r.units || 0) > 0 && !r.tracked)
    .sort((a, b) => a.date < b.date ? 1 : a.date > b.date ? -1 : 0)
    .slice(0, 20);
  if (recentLive.length > 0) {
    report.push(`### I. V12 recent live picks (last ${recentLive.length})`);
    report.push('');
    report.push(`| Date       | Sport | Mkt    | Pick                    | Odds  | v12   | Tier     | Stake | Outcome | PnL (u)    |`);
    report.push(`|------------|-------|--------|-------------------------|-------|-------|----------|-------|---------|------------|`);
    for (const r of recentLive) {
      const teamLabel = `${r.team || r.sideKey || ''}`.substring(0, 23);
      const oddsStr = r.peakOdds > 0 ? `+${r.peakOdds}` : `${r.peakOdds}`;
      const outcome = r.won === 1 ? 'WIN' : r.won === 0 ? 'LOSS' : '—';
      report.push(`| ${r.date.padEnd(10)} | ${(r.sport || '').padEnd(5)} | ${(r.marketType || '').padEnd(6)} | ${teamLabel.padEnd(23)} | ${oddsStr.padStart(5)} | ${(Number.isFinite(r.agsV12) ? fmtSigned(r.agsV12, 3) : '—').padStart(5)} | ${(r.agsV12Tier || '—').padEnd(8)} | ${((r.units||0).toFixed(2)+'u').padStart(5)} | ${outcome.padEnd(7)} | ${fmtSigned(r.profit).padStart(10)} |`);
    }
    report.push('');
  }
}

// ── Main ─────────────────────────────────────────────────────────────────
async function main() {
  console.log('AGS-U daily report — loading data...');
  const [{ rows: agsuRows, cutover }, allRows, liveCal, modelEras] = await Promise.all([
    loadAllAgsuGradedPicks(),
    loadAllGradedAndShadowPicks(),
    loadLiveCalibration(),
    loadModelEras(),
  ]);
  console.log(`  AGS-U graded picks:    ${agsuRows.length}`);
  console.log(`  All sides (any state): ${allRows.length}`);
  console.log(`  Cutover:               ${cutover}`);
  console.log(`  Active model schema:   ${liveCal?.schemaVersion || AGS_FALLBACK_CALIBRATION.schemaVersion}`);
  console.log(`  Active features:       [${ACTIVE_FEATURE_KEYS.join(', ')}]`);
  console.log(`  Model eras detected:   ${modelEras.map(e => `${e.version}@${e.effectiveFrom}`).join(' | ')}`);

  const report = [];
  // Pre-compute V12 stats once and pass to every V12 section so they all
  // agree on the same numbers (no risk of section A and section D running
  // slightly-different filters and showing different counts).
  const allRowsAgsu = allRows.filter(r => isAgsuPromotion(r.promotedBy));
  const v12Stats = computeV12Stats(agsuRows, allRowsAgsu, modelEras);

  buildHeader(report, cutover, liveCal, modelEras);

  // § 1 — CEO executive summary card
  buildV12CeoExecutive(report, v12Stats, modelEras);

  // § 2 — Model version comparison (only non-V12 section, kept per spec)
  const verStart = report.length;
  buildVersionComparison(report, agsuRows, modelEras);
  for (let i = verStart; i < report.length; i++) {
    report[i] = report[i].replace(/^## § 0b — AGS-U Model Version Comparison/, '## § 2 — Model Version Comparison (V9 → V10 → V11 → V12)');
  }

  // §§ 3-11 — V12 deep CEO monitoring
  buildV12Primer(report);
  buildV12DailyScoreboard(report, v12Stats);
  buildV12TierAnalysis(report, v12Stats);
  buildV12SportMarketAnalysis(report, v12Stats);
  buildV12ScoreReliability(report, v12Stats);
  buildV12MuteAudit(report, v12Stats);
  buildV12VsV11Differentiation(report, v12Stats);
  buildV12WalletQualityInputs(report, v12Stats);
  buildV12RecentLivePicks(report, v12Stats, 30);

  // §§ 12-13 — Operational sanity. Same builder, but the call signature
  // expects (allRows, agsuRows) — keep it on the AGSU subset so the
  // pipeline-health checks scope to current model output.
  // Re-number headings via in-place find/replace so the section numbers
  // match the new running order (§12 ops health, §13 calibration).
  const opsStart = report.length;
  buildOperationalHealth(report, allRowsAgsu, agsuRows);
  // Re-label "## § 10 — Operational Health" → "## § 12 — Operational Health (V12 pipeline sanity)"
  for (let i = opsStart; i < report.length; i++) {
    report[i] = report[i].replace(/^## § 10 — Operational Health/, '## § 12 — Operational Health (V12 pipeline sanity)');
  }

  const calStart = report.length;
  buildCalibrationSnapshot(report, liveCal);
  for (let i = calStart; i < report.length; i++) {
    report[i] = report[i].replace(/^## § 11 — Calibration Snapshot/, '## § 13 — Live Calibration Snapshot (V12 thresholds in use)');
  }

  const wpStart = report.length;
  await buildWalletPoolHealth(report);
  for (let i = wpStart; i < report.length; i++) {
    report[i] = report[i].replace(/^## § 12 — Wallet Pool Health/, '## § 14 — Wallet Pool Health (V12 input supply)');
  }

  report.push(`---`);
  report.push('');
  report.push(`*Report generated by \`scripts/dailyAgsUReport.js\` — single source of truth for V12 monitoring. Imports the active model surface from \`src/lib/ags.js\` at runtime so it auto-tracks model bumps. Triggered daily by \`.github/workflows/daily-agsu-report.yml\` at 8:30am ET; can also be run manually via the Actions tab "Run workflow" button.*`);

  const out = report.join('\n');
  const outPath = join(REPO_ROOT, 'DAILY_AGSU_REPORT.md');
  writeFileSync(outPath, out, 'utf8');
  console.log(`✓ Wrote ${outPath} (${out.length.toLocaleString()} chars)`);
}

main().catch(err => {
  console.error('FATAL', err);
  process.exit(1);
}).finally(() => process.exit(0));
