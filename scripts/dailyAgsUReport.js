/**
 * Sharp Intel — AGS-Unified Daily Performance & Calibration Report
 * ──────────────────────────────────────────────────────────────────────────
 * Single canonical monitoring artifact for V12 production.
 * Core read (§1–12): PnL · live stack · paths · tape era (Jul15+) skill bands
 * (EDGE/NetCLV/Tape) · side profile · sport · stake cal · mute · recent picks ·
 * score health · wallets · ops.
 * Appendices: model versions · feature lab (research).
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
  AGS_V12_DISPLAY_TIERS,
  AGS_V12_STAKE_TIER_META,
} from '../src/lib/ags.js';
import {
  TAPE_MUTE_BELOW,
  TAPE_BOOST_ABOVE,
  TAPE_BOOST_MULT,
  TAPE_SIZING_LIVE_FROM,
  TAPE_EDGE_WEIGHT,
  TAPE_NET_WEIGHT,
  EDGE_PRIOR_AG_WR,
  NET_CLV_PRIOR_AG,
  computeTapeScore,
  computeNetMeanPrior,
  hydrateClvLedger,
  CLV_LEDGER_COLLECTION,
  CLV_LEDGER_DOC_ID,
  shortWalletId,
  isTapeSizingLive,
} from '../src/lib/walletClvSkill.js';

/** Tape / side-profile analysis window (EDGE+TAPE stamps). */
const SIDE_PROFILE_FROM = TAPE_SIZING_LIVE_FROM;

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

// Short staking-PATH labels for per-pick tables (audit trail + recent picks).
// These are the internal levers (one per pick), grouped into the 5 user-facing
// display tiers elsewhere. Keep in sync with AGS_V12_STAKE_PATH in src/lib/ags.js.
const PATH_SHORT = {
  SUPER: 'HC-2', 'TOP+': 'HC-1+$', TOP: 'HC-1', RANK: '2-for-0',
  'SHARP-PRIME': 'SHARP+', SHARP: 'SHARP', 'SHARP-LEAN': 'SHARP~', MINI: 'MINI', 'MINI-': 'MINI-',
  CONFIRMED: 'CONF', DISSENT: 'PATH-D', WINNER: 'WIN-E', MONITORING: 'WATCH', FADE: 'PASS',
};
const pathShort = (k) => PATH_SHORT[k] || k || '—';

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
// 1-D logistic calibration: fit p = sigmoid(a + b·x) by Newton/IRLS so a raw
// score (e.g. the V12 [-1,+1] wallet-quality differential, which is NOT a
// probability) can be mapped to a win probability and scored with Brier.
// Returns { a, b } in the ORIGINAL x units, or null if N is too small / degenerate.
// NOTE: when used on the same picks it's evaluated against, the resulting Brier
// is IN-SAMPLE (mildly optimistic) — always label it as such in the report.
function logisticFit1D(x, y) {
  if (!Array.isArray(x) || x.length !== y.length || x.length < 8) return null;
  const mx = avg(x), sx = std(x) || 1;            // standardize for stability
  const xs = x.map(v => (v - mx) / sx);
  let a = 0, b = 0;
  for (let iter = 0; iter < 50; iter++) {
    let g0 = 0, g1 = 0, h00 = 0, h01 = 0, h11 = 0;
    for (let i = 0; i < xs.length; i++) {
      const p = sigmoid(a + b * xs[i]);
      const w = Math.max(p * (1 - p), 1e-6);
      const err = p - y[i];
      g0 += err; g1 += err * xs[i];
      h00 += w; h01 += w * xs[i]; h11 += w * xs[i] * xs[i];
    }
    const det = h00 * h11 - h01 * h01;
    if (Math.abs(det) < 1e-9) break;
    const da = (h11 * g0 - h01 * g1) / det;
    const db = (h00 * g1 - h01 * g0) / det;
    a -= da; b -= db;
    if (Math.abs(da) < 1e-7 && Math.abs(db) < 1e-7) break;
  }
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  // de-standardize: a + b·((x−mx)/sx) = (a − b·mx/sx) + (b/sx)·x
  return { a: a - b * mx / sx, b: b / sx };
}
const logisticProb = (fit, x) => (fit ? sigmoid(fit.a + fit.b * x) : null);
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

// ── Extended statistical helpers (used by § 12 V12 Statistical Monitor) ─

// Pearson product-moment correlation. Returns null when N<3 or sd=0.
function pearson(x, y) {
  if (x.length !== y.length || x.length < 3) return null;
  const mx = avg(x), my = avg(y);
  let num = 0, dx = 0, dy = 0;
  for (let i = 0; i < x.length; i++) {
    const a = x[i] - mx, b = y[i] - my;
    num += a * b; dx += a * a; dy += b * b;
  }
  const den = Math.sqrt(dx * dy);
  return den > 0 ? num / den : null;
}

// Linear regression y = a + b·x. Returns { slope, intercept, r2, rmse, n }.
// r² here is identical to pearson(x,y)² (univariate case), included for
// readability of the report ("predictive R²").
function linRegR2(x, y) {
  if (x.length !== y.length || x.length < 3) return null;
  const r = pearson(x, y);
  if (r == null) return null;
  const mx = avg(x), my = avg(y);
  const sx = std(x), sy = std(y);
  const slope = sx > 0 ? r * (sy / sx) : 0;
  const intercept = my - slope * mx;
  let sse = 0;
  for (let i = 0; i < x.length; i++) {
    const yhat = intercept + slope * x[i];
    sse += (y[i] - yhat) ** 2;
  }
  const rmse = Math.sqrt(sse / x.length);
  return { slope, intercept, r2: r * r, rmse, n: x.length, r };
}

// Two-sample Kolmogorov-Smirnov statistic. Measures the maximum vertical
// gap between the score CDFs of winners vs losers — larger ⇒ better
// separation. Returns null when either group is empty.
function ksStat(scoresPos, scoresNeg) {
  if (!Array.isArray(scoresPos) || !Array.isArray(scoresNeg)) return null;
  if (scoresPos.length === 0 || scoresNeg.length === 0) return null;
  const all = [...scoresPos.map(s => ({ s, k: 1 })), ...scoresNeg.map(s => ({ s, k: 0 }))]
    .sort((a, b) => a.s - b.s);
  let cumPos = 0, cumNeg = 0;
  const np = scoresPos.length, nn = scoresNeg.length;
  let d = 0;
  for (const p of all) {
    if (p.k === 1) cumPos++; else cumNeg++;
    const gap = Math.abs(cumPos / np - cumNeg / nn);
    if (gap > d) d = gap;
  }
  return d;
}

// Sample skewness (Fisher–Pearson).
function sampleSkew(arr) {
  if (arr.length < 3) return null;
  const m = avg(arr), s = std(arr);
  if (s === 0) return 0;
  const n = arr.length;
  const sum = arr.reduce((acc, v) => acc + ((v - m) / s) ** 3, 0);
  return (n / ((n - 1) * (n - 2))) * sum;
}
// Sample excess kurtosis (Fisher).
function sampleKurt(arr) {
  if (arr.length < 4) return null;
  const m = avg(arr), s = std(arr);
  if (s === 0) return 0;
  const n = arr.length;
  const sum = arr.reduce((acc, v) => acc + ((v - m) / s) ** 4, 0);
  return ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * sum
       - (3 * (n - 1) ** 2) / ((n - 2) * (n - 3));
}

// Linear-interpolated quantile on a *sorted* array.
function quantile(sortedArr, q) {
  if (!sortedArr.length) return null;
  const i = (sortedArr.length - 1) * q;
  const lo = Math.floor(i), hi = Math.ceil(i);
  if (lo === hi) return sortedArr[lo];
  return sortedArr[lo] + (sortedArr[hi] - sortedArr[lo]) * (i - lo);
}

// Deterministic LCG so bootstrap CIs reproduce identically across runs
// for the same input — the report has to be diffable.
function makeRng(seed = 0xC0FFEE) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0xFFFFFFFF;
  };
}

// Bootstrap CI helper. `iters` resamples (with replacement) of `data`,
// applies `statFn` to each, returns { mean, lo, hi, sd } for a given
// confidence level (default 95%).
function bootstrapCI(data, statFn, { iters = 1000, conf = 0.95, seed = 0xBEEF } = {}) {
  if (!Array.isArray(data) || data.length < 3) return null;
  const rng = makeRng(seed);
  const n = data.length;
  const samples = [];
  for (let it = 0; it < iters; it++) {
    const resample = new Array(n);
    for (let i = 0; i < n; i++) resample[i] = data[(rng() * n) | 0];
    const s = statFn(resample);
    if (Number.isFinite(s)) samples.push(s);
  }
  if (samples.length < 10) return null;
  samples.sort((a, b) => a - b);
  const alpha = (1 - conf) / 2;
  return {
    mean: avg(samples),
    sd: std(samples),
    lo: quantile(samples, alpha),
    hi: quantile(samples, 1 - alpha),
    n: samples.length,
  };
}

// ── Linear algebra helpers (used by § 17 Feature Lab multivariate OLS) ─
// Small / dense routines, suitable for p ≤ ~12 and n ≤ ~1000 (we have
// ~300 picks and ≤ 8 features at a time, so this is cheap).

function transpose(A) {
  const rows = A.length, cols = A[0].length;
  const T = Array.from({ length: cols }, () => new Array(rows));
  for (let i = 0; i < rows; i++)
    for (let j = 0; j < cols; j++)
      T[j][i] = A[i][j];
  return T;
}

function matMul(A, B) {
  const aRows = A.length, aCols = A[0].length, bCols = B[0].length;
  const C = Array.from({ length: aRows }, () => new Array(bCols).fill(0));
  for (let i = 0; i < aRows; i++) {
    for (let k = 0; k < aCols; k++) {
      const a = A[i][k];
      for (let j = 0; j < bCols; j++) C[i][j] += a * B[k][j];
    }
  }
  return C;
}

function matVec(A, v) {
  const rows = A.length, cols = A[0].length;
  const r = new Array(rows).fill(0);
  for (let i = 0; i < rows; i++) {
    let s = 0;
    for (let j = 0; j < cols; j++) s += A[i][j] * v[j];
    r[i] = s;
  }
  return r;
}

// Invert a square matrix via Gauss-Jordan with partial pivoting. Returns
// null if the matrix is numerically singular (so callers can degrade
// gracefully — typically means two features in the panel are collinear).
function gaussJordanInverse(A) {
  const n = A.length;
  // Augment with identity → [A | I].
  const M = A.map((row, i) => [
    ...row,
    ...Array.from({ length: n }, (_, j) => i === j ? 1 : 0),
  ]);
  for (let i = 0; i < n; i++) {
    let pivot = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(M[k][i]) > Math.abs(M[pivot][i])) pivot = k;
    }
    if (pivot !== i) { const tmp = M[i]; M[i] = M[pivot]; M[pivot] = tmp; }
    const div = M[i][i];
    if (!Number.isFinite(div) || Math.abs(div) < 1e-12) return null;
    for (let j = 0; j < 2 * n; j++) M[i][j] /= div;
    for (let k = 0; k < n; k++) {
      if (k === i) continue;
      const f = M[k][i];
      if (f === 0) continue;
      for (let j = 0; j < 2 * n; j++) M[k][j] -= f * M[i][j];
    }
  }
  return M.map(row => row.slice(n));
}

// Ordinary Least Squares: β = (X'X)^-1 X'y. X is n×p (each row a sample),
// y is length n. Returns { beta, r2, adjR2, n, p, residSd } or null on
// singular design. Add a column of 1s yourself if you want an intercept.
function olsRegression(X, y) {
  if (!Array.isArray(X) || !Array.isArray(y) || X.length === 0) return null;
  if (X.length !== y.length) return null;
  const n = X.length, p = X[0].length;
  if (n <= p) return null;
  const XT = transpose(X);
  const XTX = matMul(XT, X);
  const XTXinv = gaussJordanInverse(XTX);
  if (!XTXinv) return null;
  const XTy = matVec(XT, y);
  const beta = matVec(XTXinv, XTy);
  const yhat = matVec(X, beta);
  const meanY = avg(y);
  let ssRes = 0, ssTot = 0;
  for (let i = 0; i < n; i++) {
    ssRes += (y[i] - yhat[i]) ** 2;
    ssTot += (y[i] - meanY) ** 2;
  }
  const r2 = ssTot > 0 ? 1 - ssRes / ssTot : 0;
  // Adjusted R² accounts for free parameters — important when comparing
  // models with different numbers of features.
  const adjR2 = 1 - (1 - r2) * (n - 1) / Math.max(1, n - p - 1);
  const residSd = Math.sqrt(ssRes / Math.max(1, n - p));
  // Standard errors of β (diagonal of σ² (X'X)^-1).
  const seBeta = new Array(p);
  const sigma2 = ssRes / Math.max(1, n - p);
  for (let i = 0; i < p; i++) {
    const v = sigma2 * XTXinv[i][i];
    seBeta[i] = v > 0 ? Math.sqrt(v) : 0;
  }
  return { beta, seBeta, r2, adjR2, n, p, residSd, yhat };
}

// Standardize a column (subtract mean, divide by sd). Used to make
// multivariate β rankings interpretable as "standardized importance".
function zScoreColumn(xs) {
  const m = avg(xs);
  const s = std(xs);
  if (s === 0) return xs.map(() => 0);
  return xs.map(v => (v - m) / s);
}

// Bucket-by-tercile aggregator (low/mid/high) of a continuous feature `xs`
// alongside a binary outcome `wins` and a unit-return series `unitReturns`.
// Returns three buckets each with N, win%, ROI.
function tercileBuckets(xs, wins, unitReturns, units) {
  if (xs.length < 6) return null;
  const sorted = [...xs].sort((a, b) => a - b);
  const lo = quantile(sorted, 1/3);
  const hi = quantile(sorted, 2/3);
  const buckets = { lo: [], mid: [], hi: [] };
  for (let i = 0; i < xs.length; i++) {
    const v = xs[i];
    const key = v <= lo ? 'lo' : v <= hi ? 'mid' : 'hi';
    buckets[key].push({ x: v, won: wins[i], pnl: unitReturns[i], stake: units[i] });
  }
  const summarize = (arr) => {
    if (!arr.length) return { n: 0, w: 0, l: 0, roi: null, winPct: null };
    const w = arr.filter(r => r.won === 1).length;
    const l = arr.filter(r => r.won === 0).length;
    const totalPnl = arr.reduce((s, r) => s + r.pnl, 0);
    const totalStake = arr.reduce((s, r) => s + r.stake, 0);
    return {
      n: arr.length, w, l,
      roi: totalStake > 0 ? (totalPnl / totalStake) * 100 : null,
      winPct: (w + l) > 0 ? w / (w + l) : null,
      lo: arr[0]?.x,
      hi: arr[arr.length - 1]?.x,
    };
  };
  return {
    cuts: { lo, hi },
    lo:  summarize(buckets.lo),
    mid: summarize(buckets.mid),
    hi:  summarize(buckets.hi),
  };
}

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
        // walletDetails frozen at scoring time — the V12 score is derived
        // directly from this array. peak preferred, lock fallback. Each
        // entry: { wallet, side, sizeRatio, contribution, ... } where
        // `wallet` is the lower-6-hex short id (matches sharpWalletProfiles
        // docIds), `side` is 'home'|'away'|'over'|'under'.
        const walletDetails = (peak.v8Scoring?.walletDetails || lock.v8Scoring?.walletDetails || [])
          .filter(w => w && w.wallet && w.side);

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
        const miniHcMargin = Number.isFinite(sd.v8_miniHcMargin)
          ? sd.v8_miniHcMargin
          : ((sd.v8_miniHcConfFor || 0) - (sd.v8_miniHcConfAg || 0));
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
          // v12.1 product stake tier (SUPER/TOP/CONFIRMED/MONITORING/FADE).
          // Null on pre-cutover picks (kept on the score-quintile ladder).
          hcStakeTier: sd.v8_hcStakeTier || null,
          // Winner-align (v12abcde) — stamped by syncPickStateAuthoritative
          winnerAlignEdge: Number.isFinite(sd.v8_winnerAlignEdge) ? sd.v8_winnerAlignEdge : null,
          winnerAlignMeanFor: Number.isFinite(sd.v8_winnerAlignMeanFor) ? sd.v8_winnerAlignMeanFor : null,
          winnerAlignMeanAg: Number.isFinite(sd.v8_winnerAlignMeanAg) ? sd.v8_winnerAlignMeanAg : null,
          winnerAlignTopFor: Number.isFinite(sd.v8_winnerAlignTopFor) ? sd.v8_winnerAlignTopFor : null,
          winnerAlignTopAg: Number.isFinite(sd.v8_winnerAlignTopAg) ? sd.v8_winnerAlignTopAg : null,
          winnerAlignForN: Number.isFinite(sd.v8_winnerAlignForN) ? sd.v8_winnerAlignForN : null,
          winnerAlignAgN: Number.isFinite(sd.v8_winnerAlignAgN) ? sd.v8_winnerAlignAgN : null,
          winnerAlignHasBoth: sd.v8_winnerAlignHasBoth === true,
          winnerAlignFadeTop60: sd.v8_winnerAlignFadeTop60 === true,
          winnerAlignMeanBehind5: sd.v8_winnerAlignMeanBehind5 === true,
          winnerAlignHasTop5For: sd.v8_winnerAlignHasTop5For === true,
          winnerAlignHasTop5Ag: sd.v8_winnerAlignHasTop5Ag === true,
          winnerAlignTopUnopp: sd.v8_winnerAlignTopUnopp === true,
          winnerAlignEliteUnopp: sd.v8_winnerAlignEliteUnopp === true,
          winnerAlignTopVsTop: sd.v8_winnerAlignTopVsTop === true,
          winnerAlignAction: sd.v8_winnerAlignAction || null,
          winnerAlignEvaluatedAt: sd.v8_winnerAlignEvaluatedAt || null,
          mutedBy: sd.mutedBy || null,
          // TAPE sizing (live 2026-07-15+) — score / action / pre-tape path units
          // FOR-side components always kept for W/L profile even when unopposed.
          tapeScore: Number.isFinite(sd.v8_tapeScore) ? sd.v8_tapeScore : null,
          tapeAction: sd.v8_tapeAction || null,
          unitsPreTape: Number.isFinite(sd.v8_unitsPreTape) ? sd.v8_unitsPreTape : null,
          netMeanPrior: Number.isFinite(sd.v8_netMeanPrior) ? sd.v8_netMeanPrior : null,
          netClvMeanFor: Number.isFinite(sd.v8_netClvMeanFor) ? sd.v8_netClvMeanFor : null,
          netClvMeanAg: Number.isFinite(sd.v8_netClvMeanAg) ? sd.v8_netClvMeanAg : null,
          netClvNFor: Number.isFinite(sd.v8_netClvNFor) ? sd.v8_netClvNFor : null,
          netClvNAg: Number.isFinite(sd.v8_netClvNAg) ? sd.v8_netClvNAg : null,
          provenFor, provenAg,
          provenTotal: (provenFor ?? 0) + (provenAg ?? 0),
          hcMargin, miniHcMargin,
          hcConfFor: sd.v8_hcConfFor ?? 0,
          hcConfAg:  sd.v8_hcConfAg ?? 0,
          hcDominant: !!sd.v8_hcDominant,
          clv,
          closeProb, lockPinnProb,
          status: sd.status,
          healthStatus: sd.health?.status || 'ACTIVE',
          schemaVersion,
          walletDetails,
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
  report.push(`# AGS-Unified — V12 Daily Monitor`);
  report.push('');
  report.push(`**Generated:** ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'full', timeStyle: 'short' })} ET`);
  report.push('');
  report.push(`**Model:** \`${schemaLive}\` · **Live since:** ${v12From || '—'} (${v12Days ?? '—'} days) · **Tape / side-profile era:** ${SIDE_PROFILE_FROM}+`);
  report.push('');
  report.push(`Production book = **Paths A–D** (HC / RANK / SHARP / DISSENT) → fadeTop mute → **TAPE** mute/boost. Numbers below are V12-scoped (pick date ≥ ${v12From || 'TBD'}) unless marked Appendix.`);
  report.push('');
  report.push(`## Contents`);
  report.push('');
  report.push(`1. Executive Summary · 2. Live Stack · 3. Daily Scoreboard · **4. Path & Modifier Board** · 5. Tape Era (${SIDE_PROFILE_FROM}+) · 6. Sport/Market · 7. Mute · 8. Recent Picks · 9. Predictive Health · 10. Wallets · 11. Ops`);
  report.push('');
  report.push(`Appendix A — Model Versions · Appendix B — Feature Lab`);
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
  report.push(`| Date       | Sport | Mkt    | Team / Side             | Odds  | Stake  | AGS-U  | Score   | Path     | Quint | HCm  | Top Driver           | Outcome | PnL (u)    | CLV    |`);
  report.push(`|------------|-------|--------|-------------------------|-------|--------|--------|---------|----------|-------|------|----------------------|---------|------------|--------|`);
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
      + ` | ${(r.agsTier || '—').padEnd(7)} | ${pathShort(r.hcStakeTier).padEnd(8)} | Q${r.agsQuintile || '?'}`.padEnd(8)
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
    report.push(`### V12 score bands (diagnostic — not the live unit sizer)`);
    report.push('');
    report.push(`Score ≤ 0 still mutes (FADE). Positive bands below are **labels only** — live units come from Paths A–D + TAPE (§ 2 / § 4), not this ladder.`);
    report.push('');
    report.push(`| Boundary | V12 score cut | Band label |`);
    report.push(`|----------|---------------|------------|`);
    const v12q = liveCal.v12Quintiles;
    const rows = [
      ['q80',  v12q.q80, 'ELITE'],
      ['q60',  v12q.q60, 'PREMIUM'],
      ['q40',  v12q.q40, 'LOCK'],
      ['q20',  v12q.q20, 'LEAN'],
      ['—',    0.0,      'WEAK (score > 0)'],
      ['mute', '—',      'FADE (score ≤ 0 → 0u)'],
    ];
    for (const [k, val, tier] of rows) {
      const valStr = typeof val === 'number' ? fmtSigned(val, 3) : String(val);
      report.push(`| ${k.padEnd(8)} | ${valStr.padStart(13)} | ${tier} |`);
    }
    report.push('');
    report.push(`> **Odds cap** (still live): ≤2.5u at +100 · ≤1.5u at +151 · ≤1.0u at +200.`);
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
    const SPORTS = ['MLB', 'NBA', 'NHL', 'SOC'];
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
          hcStakeTier: sd.v8_hcStakeTier || null,
          winnerAlignEdge: Number.isFinite(sd.v8_winnerAlignEdge) ? sd.v8_winnerAlignEdge : null,
          winnerAlignAction: sd.v8_winnerAlignAction || null,
          winnerAlignHasBoth: sd.v8_winnerAlignHasBoth === true,
          winnerAlignHasTop5For: sd.v8_winnerAlignHasTop5For === true,
          winnerAlignHasTop5Ag: sd.v8_winnerAlignHasTop5Ag === true,
          winnerAlignTopUnopp: sd.v8_winnerAlignTopUnopp === true,
          winnerAlignEliteUnopp: sd.v8_winnerAlignEliteUnopp === true,
          winnerAlignTopVsTop: sd.v8_winnerAlignTopVsTop === true,
          winnerAlignFadeTop60: sd.v8_winnerAlignFadeTop60 === true,
          winnerAlignMeanBehind5: sd.v8_winnerAlignMeanBehind5 === true,
          mutedBy: sd.mutedBy || null,
          tapeScore: Number.isFinite(sd.v8_tapeScore) ? sd.v8_tapeScore : null,
          tapeAction: sd.v8_tapeAction || null,
          unitsPreTape: Number.isFinite(sd.v8_unitsPreTape) ? sd.v8_unitsPreTape : null,
          netMeanPrior: Number.isFinite(sd.v8_netMeanPrior) ? sd.v8_netMeanPrior : null,
          netClvMeanFor: Number.isFinite(sd.v8_netClvMeanFor) ? sd.v8_netClvMeanFor : null,
          netClvMeanAg: Number.isFinite(sd.v8_netClvMeanAg) ? sd.v8_netClvMeanAg : null,
          netClvNFor: Number.isFinite(sd.v8_netClvNFor) ? sd.v8_netClvNFor : null,
          netClvNAg: Number.isFinite(sd.v8_netClvNAg) ? sd.v8_netClvNAg : null,
          winnerAlignMeanFor: Number.isFinite(sd.v8_winnerAlignMeanFor) ? sd.v8_winnerAlignMeanFor : null,
          winnerAlignMeanAg: Number.isFinite(sd.v8_winnerAlignMeanAg) ? sd.v8_winnerAlignMeanAg : null,
          winnerAlignForN: Number.isFinite(sd.v8_winnerAlignForN) ? sd.v8_winnerAlignForN : null,
          winnerAlignAgN: Number.isFinite(sd.v8_winnerAlignAgN) ? sd.v8_winnerAlignAgN : null,
          agsV12: Number.isFinite(sd.v8_agsV12) ? sd.v8_agsV12 : null,
          team: sd.team || sideKey,
          sideKey,
          // walletDetails needed for §5 skill-band as-of EDGE/net (stamp-else-asof)
          walletDetails: (peak.v8Scoring?.walletDetails || lock.v8Scoring?.walletDetails || [])
            .filter(w => w && w.wallet && w.side),
        });
      }
    }
  }
  return rows;
}

// Load every sharp wallet profile keyed by lower-6-hex shortname — the
// same id format used in walletDetails on each pick. Each value is the
// raw profile doc data (whitelistTier, bySport.{MLB,NBA,NHL}.{picks,
// positions, whitelistTier, ...}, etc.).
//
// Used by § 13 to enrich the wallet-influence table with current tier /
// prior ROI / prior pick count for each wallet that drove a V12 pick.
// Returns Map<walletShort, profileData>.
async function loadWalletProfilesMap() {
  const map = new Map();
  try {
    const snap = await db.collection('sharpWalletProfiles').get();
    for (const d of snap.docs) {
      // Profile docIds are the FULL wallet address; walletDetails uses
      // lower-6-hex. Try both — prefer the data's `walletShort` field
      // when present, otherwise compute from docId.
      const data = d.data();
      const short = (data?.walletShort
        ? String(data.walletShort).toLowerCase()
        : String(d.id).slice(-6).toLowerCase());
      map.set(short, { ...data, _id: d.id, _short: short });
    }
  } catch (_) { /* swallow — section will degrade gracefully */ }
  return map;
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
    // (sigmoid → probability) so its Brier is direct. v12 score is a
    // wallet-quality mean ratio in [-1, +1] and is NOT a probability, so we
    // first calibrate it to a win probability with an in-sample 1-D logistic
    // fit, then score Brier on that. AUC is rank-based and works on both.
    const scoreFn = isV12 ? (r => r.agsV12) : (r => r.ags);
    const withAgs = eraRows.filter(r => Number.isFinite(scoreFn(r)) && r.won != null);
    const auc = rocAuc(withAgs.map(scoreFn), withAgs.map(r => r.won));
    let brier;
    if (isV12) {
      const fit = logisticFit1D(withAgs.map(scoreFn), withAgs.map(r => r.won));
      brier = fit ? brierScore(withAgs.map(r => logisticProb(fit, scoreFn(r))), withAgs.map(r => r.won)) : null;
    } else {
      brier = brierScore(withAgs.map(r => sigmoid(r.ags)), withAgs.map(r => r.won));
    }
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
    report.push(`> **On v12's Brier.** The v12 score is a bounded \`[-1, +1]\` wallet-quality differential, not a probability. To make Brier comparable to the older logit models, the score is mapped to a win probability via an **in-sample 1-D logistic calibration** (\`p = sigmoid(a + b·score)\`). Because it's fit on the same picks it scores, treat it as a mildly optimistic floor on true calibration error — the per-staking-book breakdown in § 9 is the more actionable read.`);
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
//   §5  Tier scoreboard + path slices (RANK / PATH-D / EDGE / TAPE)
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

// ── § 5a — RANK-RESCUE (2-for-0 wallet slice · v12ab book) ───────────────────
// Mirrors the production rule in syncPickStateAuthoritative.js: a v12-shipped
// (score>0) pick that v12a's HC sizer muted to 0u is rescued to 4u when the FOR
// side is "2-for-0" — ≥2 ELIGIBLE whitelist wallets backing, 0 against. Eligible
// = whitelistTier ∈ {CONFIRMED,FLAT,WR50} AND bySport[sport].picks.n ≥ 8. Went
// live 2026-06-21; this section tracks (A) actually-stamped RANK picks going
// forward and (B) a reconstruction over the whole v12 era for immediate context.
const RANK_RESCUE_UNITS = 4;
function rankEligible(profile, sport) {
  const rec = profile?.bySport?.[sport];
  if (!rec) return false;
  const t = rec.whitelistTier;
  if (t !== 'CONFIRMED' && t !== 'FLAT' && t !== 'WR50') return false;
  return (Number(rec.picks?.n) || 0) >= 8;
}
function rankSliceQualifies(walletDetails, sideKey, sport, walletProfiles) {
  if (!Array.isArray(walletDetails) || !sideKey || !sport || !walletProfiles) return false;
  let backing = 0, against = 0; const seen = new Set();
  for (const w of walletDetails) {
    const short = String(w.walletShort || w.wallet || '').slice(-6).toLowerCase();
    if (!short || seen.has(short)) continue; seen.add(short);
    const profile = walletProfiles.get(short) || walletProfiles.get(short.toUpperCase());
    if (!rankEligible(profile, sport)) continue;
    if (w.side === sideKey) backing++;
    else if (w.side) against++;
  }
  return backing >= 2 && against === 0;
}
// Per-unit profit at decimal odds; uniform 4u stake → PnL = perUnit × 4.
function perUnitReturn(won, odds) {
  if (won == null) return null;
  if (won === 1) return odds < 0 ? 100 / Math.abs(odds) : odds / 100;
  return -1;
}
function rescueAgg(picks) {
  const n = picks.length;
  const w = picks.filter(p => p.won === 1).length;
  const l = picks.filter(p => p.won === 0).length;
  const pnl = picks.reduce((s, p) => s + perUnitReturn(p.won, p.odds) * RANK_RESCUE_UNITS, 0);
  const flatPnl = picks.reduce((s, p) => s + perUnitReturn(p.won, p.odds), 0);
  return {
    n, w, l,
    winRate: n ? w / n : null,
    pnl,
    roi: n ? (flatPnl / n) * 100 : null,    // uniform stake → ROI = flat per-unit %
    stake: n * RANK_RESCUE_UNITS,
  };
}

function buildV12RankRescue(report, stats, walletProfiles) {
  report.push(`## § 5a — RANK-RESCUE Slice (2-for-0 wallet path · v12ab book)`);
  report.push('');
  if (!stats || stats.v12Rows.length === 0) {
    report.push(`_(no V12-era graded picks yet.)_`);
    report.push('');
    return;
  }
  const { v12Rows, daysLive } = stats;
  report.push(`> **What this is.** \`v12ab\` = the v12a book (HC-margin sizing) **plus** the RANK-RESCUE staking path that went live **2026-06-21**. The rule: a v12-shipped pick (score > 0) that the HC sizer mutes to 0u is staked at **${RANK_RESCUE_UNITS}u** when its FOR side is **2-for-0** — ≥2 eligible whitelist wallets backing (CONFIRMED/FLAT/WR50 with ≥8 settled in-sport picks) and 0 against. It **only rescues muted picks**; it never up-sizes a pick the HC ladder already staked.`);
  report.push('');

  // ── (B) Reconstruction over the v12 era ──────────────────────────────────
  // Re-derive the slice from frozen walletDetails + CURRENT profiles. "HC-muted"
  // = hcMargin < 1 AND miniHcMargin < 1 (what v12a HC-only sizes to 0u).
  const graded = v12Rows.filter(r => r.won != null && Array.isArray(r.walletDetails) && r.walletDetails.length);
  const rescue = [], hcStakedSlice = [];
  for (const r of graded) {
    const score = Number.isFinite(r.agsV12) ? r.agsV12 : null;
    if (score == null || score <= 0) continue;                 // must be v12-shipped
    if (!rankSliceQualifies(r.walletDetails, r.sideKey, r.sport, walletProfiles)) continue;
    const hcMuted = (r.hcMargin < 1) && (r.miniHcMargin < 1);   // v12a → 0u
    const odds = r.peakOdds || r.lockOdds || 0;
    (hcMuted ? rescue : hcStakedSlice).push({ won: r.won, odds, sport: r.sport, date: r.date });
  }
  const ra = rescueAgg(rescue);
  const days = Math.max(1, daysLive || 1);

  report.push(`### (B) Reconstruction over the V12 era (${stats.v12From} → today)`);
  report.push('');
  report.push(`> Re-derived from frozen \`walletDetails\` + **current** wallet profiles. Eligibility uses today's settled-pick counts, so this is a **mildly optimistic projection** (a wallet at ≥8 picks now may have had fewer at pick time). Live-stamped numbers in (A) are the ground truth.`);
  report.push('');
  report.push(`| Bucket | Picks | W-L | Win % | Stake | PnL | ROI | Per day |`);
  report.push(`|--------|------:|:---:|:-----:|------:|----:|----:|--------:|`);
  report.push(`| RANK-RESCUE (HC-muted → ${RANK_RESCUE_UNITS}u) | ${ra.n} | ${ra.w}-${ra.l} | ${ra.winRate != null ? (ra.winRate*100).toFixed(1)+'%' : '—'} | ${ra.stake.toFixed(0)}u | ${fmtSigned(ra.pnl)}u | ${ra.roi != null ? (ra.roi>=0?'+':'')+ra.roi.toFixed(1)+'%' : '—'} | ${(ra.n/days).toFixed(2)} |`);
  report.push('');
  report.push(`**2-for-0 picks the HC ladder ALREADY staked (NOT rescued — no hammer): ${hcStakedSlice.length}**`+(hcStakedSlice.length ? ` (${hcStakedSlice.filter(p=>p.won===1).length}-${hcStakedSlice.filter(p=>p.won===0).length}). These are left at their HC size — the slice adds no edge inside the HC book.` : '.'));
  report.push('');

  // Per-sport of the reconstructed rescue slice.
  const sports = [...new Set(rescue.map(p => p.sport))].sort();
  if (sports.length) {
    report.push(`#### RANK-RESCUE by sport (reconstructed)`);
    report.push('');
    report.push(`| Sport | Picks | W-L | Win % | PnL @${RANK_RESCUE_UNITS}u | ROI |`);
    report.push(`|-------|------:|:---:|:-----:|------:|----:|`);
    for (const sp of sports) {
      const a = rescueAgg(rescue.filter(p => p.sport === sp));
      report.push(`| ${sp} | ${a.n} | ${a.w}-${a.l} | ${a.winRate != null ? (a.winRate*100).toFixed(1)+'%' : '—'} | ${fmtSigned(a.pnl)}u | ${a.roi != null ? (a.roi>=0?'+':'')+a.roi.toFixed(1)+'%' : '—'} |`);
    }
    report.push('');
  }

  // ── (A) Live, actually-stamped RANK picks ────────────────────────────────
  const liveRank = v12Rows.filter(r => r.hcStakeTier === 'RANK' && r.won != null);
  const la = (() => {
    const n = liveRank.length, w = liveRank.filter(r => r.won===1).length, l = liveRank.filter(r => r.won===0).length;
    const pnl = liveRank.reduce((s, r) => s + (Number.isFinite(r.profit) ? r.profit : 0), 0);
    const stake = liveRank.reduce((s, r) => s + (r.units || 0), 0);
    return { n, w, l, winRate: n ? w/n : null, pnl, stake, roi: stake>0 ? pnl/stake*100 : null };
  })();
  report.push(`### (A) Live stamped RANK picks (ground truth — populates going forward)`);
  report.push('');
  if (la.n === 0) {
    const pending = v12Rows.filter(r => r.hcStakeTier === 'RANK').length;
    report.push(`_No graded RANK-stamped picks yet${pending ? ` (${pending} ungraded in flight)` : ''}. RANK-RESCUE went live 2026-06-21 — this fills in as the cron stamps and grades \`hcStakeTier=RANK\` picks._`);
  } else {
    report.push(`| Picks | W-L | Win % | Stake | PnL | ROI |`);
    report.push(`|------:|:---:|:-----:|------:|----:|----:|`);
    report.push(`| ${la.n} | ${la.w}-${la.l} | ${la.winRate != null ? (la.winRate*100).toFixed(1)+'%' : '—'} | ${la.stake.toFixed(0)}u | ${fmtSigned(la.pnl)}u | ${la.roi != null ? (la.roi>=0?'+':'')+la.roi.toFixed(1)+'%' : '—'} |`);
    report.push('');
    report.push(`| Date | Sport | Matchup | Side | Odds | Result | PnL |`);
    report.push(`|------|-------|---------|------|-----:|:------:|----:|`);
    for (const r of liveRank.sort((a,b)=> (a.date<b.date?1:-1)).slice(0, 30)) {
      report.push(`| ${r.date} | ${r.sport} | ${r.away}@${r.home} | ${r.team || r.sideKey} | ${r.peakOdds || r.lockOdds} | ${r.won===1?'WIN':'LOSS'} | ${fmtSigned(r.profit)}u |`);
    }
  }
  report.push('');

  // ── Incremental impact framing ───────────────────────────────────────────
  // NOTE: the historical v12-era live book was sized by the SCORE LADDER (many
  // small 0.25–1u picks), not the v12a HC ladder that is current production —
  // so we do NOT compare RANK volume against that headline count (apples-to-
  // oranges). RANK-RESCUE is incremental to the v12a HC book (HC+2→6u, HC+1→4u,
  // mini→3u, else muted), pulling 4u plays out of the muted bucket.
  report.push(`### Incremental impact`);
  report.push('');
  report.push(`> RANK-RESCUE sits **on top of the v12a HC book** — it stakes ${RANK_RESCUE_UNITS}u on picks the HC ladder would mute (0u), so every rescue is net-new volume, never an up-size. Reconstruction: **+${(ra.n/days).toFixed(2)} picks/day** (${ra.n} over ${days} days) at **${ra.roi != null ? (ra.roi>=0?'+':'')+ra.roi.toFixed(1)+'%' : '—'} ROI** / **${fmtSigned(ra.pnl)}u**, pulled from the muted pool — so no existing HC pick's size or grade changes. (The § 1 / § 4–5 headline book still reflects historical score-ladder sizing for picks shipped before v12a; only NEW picks size under v12a + RANK.)`);
  report.push('');
}

// ── § 5c — PATH-D / DISSENT (contribMargin ≤ 0 · v12abcd book) ─────────────
const PATH_D_UNITS = 1;
const PATH_D_LIVE_FROM = '2026-07-12';
function buildV12PathD(report, stats) {
  report.push(`## § 5c — PATH-D / DISSENT (contribMargin ≤ 0 · v12abcd book)`);
  report.push('');
  if (!stats) {
    report.push(`_(no V12-era graded picks yet.)_`);
    report.push('');
    return;
  }
  report.push(`> **What this is.** \`v12abcd\` = the v12abc book **plus** Path D. Rule (live **${PATH_D_LIVE_FROM}**): a v12-shipped pick (score > 0) that HC / RANK / SHARP left at **0u** is staked at **${PATH_D_UNITS}u** when **MLB** · american odds ≤ **+200** · wallet \`contribMargin ≤ 0\` (Σ FOR contribution − Σ AGAINST ≤ 0) · \`maxShare < 0.35\`. Tier stamp: \`DISSENT\`. Source signal: §17 Feature Lab unused inverse \`wd contribMargin\`. Never up-sizes an already-staked pick.`);
  report.push('');

  const { v12Rows, v12RowsAll } = stats;
  const liveD = (v12RowsAll || v12Rows).filter(r => r.hcStakeTier === 'DISSENT');
  const liveGraded = liveD.filter(r => r.won != null);
  report.push(`### (A) Live stamped DISSENT picks (ground truth — populates going forward)`);
  report.push('');
  if (liveGraded.length === 0) {
    const pending = liveD.filter(r => r.won == null).length;
    report.push(`_No graded DISSENT-stamped picks yet${pending ? ` (${pending} ungraded in flight)` : ''}. Path D went live ${PATH_D_LIVE_FROM} — this fills in as \`hcStakeTier=DISSENT\` picks grade._`);
  } else {
    const a = aggregate(liveGraded);
    report.push(`| Picks | W-L | Win % | Stake | PnL | ROI |`);
    report.push(`|-------|-----|-------|-------|-----|-----|`);
    report.push(`| ${a.n} | ${a.w}-${a.l} | ${pct(a.w, a.n)} | ${a.totalStake.toFixed(1)}u | ${fmtSigned(a.profit)}u | ${a.roi != null ? (a.roi>=0?'+':'')+a.roi.toFixed(1)+'%' : '—'} |`);
    const pending = liveD.filter(r => r.won == null).length;
    if (pending) report.push(`_Also ${pending} ungraded DISSENT pick(s) in flight._`);
  }
  report.push('');
  report.push(`> Path D is **additive mute volume only**. Track it separately from Path C — same mute pool, different gate (contribution dissent vs proven-$ forCount).`);
  report.push('');
}


// ── § 5d — WINNER-ALIGN (EDGE mute / size / rescue · v12abcde) ─────────────
const WINNER_ALIGN_LIVE_FROM = '2026-07-12';
const WINNER_ALIGN_RESCUE_E10 = 6;
const WINNER_ALIGN_RESCUE_E5 = 4;
const WINNER_ALIGN_RESCUE_E3 = 3;

/**
 * Fill EDGE / tape analysis fields from **stamped** FOR-side components when
 * the composite was left blank (legacy unopposed FAIL_OPEN rows).
 * Does NOT profile-replay wallets (no lookahead).
 */
function fillForSideEdgeTapeFromStamps(rows) {
  if (!Array.isArray(rows)) return;
  for (const r of rows) {
    if (!Number.isFinite(r.winnerAlignEdge) && Number.isFinite(r.winnerAlignMeanFor)) {
      const ag = Number.isFinite(r.winnerAlignMeanAg) ? r.winnerAlignMeanAg : EDGE_PRIOR_AG_WR;
      r.winnerAlignEdge = r.winnerAlignMeanFor - ag;
      r.winnerAlignEdgeSource = Number.isFinite(r.winnerAlignMeanAg) ? 'derived_stamped' : 'ag_prior_50';
    }
    if (!Number.isFinite(r.tapeScore)
      && Number.isFinite(r.winnerAlignEdge)
      && Number.isFinite(r.netMeanPrior)) {
      r.tapeScore = computeTapeScore(r.winnerAlignEdge, r.netMeanPrior);
      r.tapeScoreSource = 'derived_stamped';
    }
  }
}

// ── § 5 skill-band windows (EDGE · NetCLV · Tape · Jun15+ / Jul15+ / yesterday) ──
const SKILL_BAND_FROM = '2026-06-15';
const SKILL_BAND_WR_FROM = '2026-04-18';
const SKILL_BAND_MIN_WR_N = 8;
const SKILL_PATH_MAP = {
  SUPER: 'A', TOP: 'A', 'TOP+': 'A', MINI: 'A', 'MINI-': 'A', CONFIRMED: 'A',
  RANK: 'B',
  SHARP: 'C', 'SHARP-LEAN': 'C', 'SHARP-PRIME': 'C',
  DISSENT: 'D', WINNER: 'E',
};
const SKILL_OPPOSITE = { home: 'away', away: 'home', over: 'under', under: 'over' };
const EDGE_NET_BANDS = ['<5', '5–10', '≥10'];
const TAPE_POLICY_BANDS = ['<0', '0–2.89', '≥2.89'];

function skillPathOf(tier) {
  return SKILL_PATH_MAP[tier] || '?';
}
function edgeNetBand(v) {
  if (v == null || !Number.isFinite(v)) return 'missing';
  if (v < 5) return '<5';
  if (v < 10) return '5–10';
  return '≥10';
}
function tapePolicyBand(t) {
  if (t == null || !Number.isFinite(t)) return 'missing';
  if (t < TAPE_MUTE_BELOW) return '<0';
  if (t < TAPE_BOOST_ABOVE) return '0–2.89';
  return '≥2.89';
}
function fmtSkillRoi(roi) {
  if (roi == null || !Number.isFinite(roi)) return '—';
  return `${roi >= 0 ? '+' : ''}${roi.toFixed(1)}%`;
}
function fmtShortYmd(ymd) {
  if (!ymd || ymd.length < 10) return ymd || '—';
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const m = Number(ymd.slice(5, 7));
  const d = Number(ymd.slice(8, 10));
  return `${months[m - 1] || '??'} ${d}`;
}

/** Causal featured-WR ledger from graded allRows (stamp-else-asof EDGE). */
function buildFeaturedWrLedgerFromRows(allRows) {
  const byDoc = new Map();
  for (const r of allRows || []) {
    if (!r?.docId || !r.date || r.date < SKILL_BAND_WR_FROM) continue;
    if (r.superseded) continue;
    if (r.won !== 0 && r.won !== 1) continue;
    if (!byDoc.has(r.docId)) byDoc.set(r.docId, []);
    byDoc.get(r.docId).push(r);
  }
  const map = new Map(); // short → sport → [{date, won}]
  for (const rows of byDoc.values()) {
    const date = rows[0]?.date;
    const sport = rows[0]?.sport;
    if (!date || !sport) continue;
    let winningSide = null;
    for (const r of rows) {
      if (r.won === 1) { winningSide = r.sideKey; break; }
      if (r.won === 0 && SKILL_OPPOSITE[r.sideKey]) {
        winningSide = SKILL_OPPOSITE[r.sideKey];
        break;
      }
    }
    if (!winningSide) continue;
    const seen = new Set();
    for (const r of rows) {
      for (const w of r.walletDetails || []) {
        if (!w?.wallet || !w.side) continue;
        const short = shortWalletId(w.walletShort || w.wallet);
        if (!short || seen.has(short)) continue;
        seen.add(short);
        if (!map.has(short)) map.set(short, new Map());
        const bySport = map.get(short);
        if (!bySport.has(sport)) bySport.set(sport, []);
        bySport.get(sport).push({ date, won: w.side === winningSide ? 1 : 0 });
      }
    }
  }
  for (const bySport of map.values()) {
    for (const arr of bySport.values()) arr.sort((a, b) => a.date.localeCompare(b.date));
  }
  return map;
}

function featuredWrAsOf(ledger, walletShort, sport, asOfDate) {
  const arr = ledger.get(walletShort)?.get(sport);
  if (!arr || !asOfDate) return null;
  let n = 0, wins = 0;
  for (const e of arr) {
    if (e.date >= asOfDate) break;
    n++;
    wins += e.won;
  }
  if (n < SKILL_BAND_MIN_WR_N) return null;
  return (100 * wins) / n;
}

function asofEdgeFromWd(wd, side, sport, date, wrLedger) {
  const seen = new Set();
  const forW = [], agW = [];
  for (const w of wd || []) {
    const s = shortWalletId(w?.walletShort || w?.wallet);
    if (!s || seen.has(s)) continue;
    seen.add(s);
    const wr = featuredWrAsOf(wrLedger, s, sport, date);
    if (wr == null) continue;
    if (w.side === side) forW.push(wr);
    else if (w.side) agW.push(wr);
  }
  if (!forW.length) return null;
  const meanFor = forW.reduce((a, b) => a + b, 0) / forW.length;
  const meanAg = agW.length ? agW.reduce((a, b) => a + b, 0) / agW.length : null;
  return meanFor - (meanAg ?? EDGE_PRIOR_AG_WR);
}

function skillAgg(arr) {
  const w = arr.filter(r => r.won === 1).length;
  const n = arr.length;
  const stake = arr.reduce((s, r) => s + (r.units || 0), 0);
  const pnl = arr.reduce((s, r) => s + (Number.isFinite(r.profit) ? r.profit : 0), 0);
  return {
    n,
    wins: w,
    losses: n - w,
    record: n ? `${w}–${n - w}` : '—',
    wr: n ? +(100 * w / n).toFixed(1) : null,
    stake: +stake.toFixed(1),
    pnl: +pnl.toFixed(1),
    roi: stake ? +(100 * pnl / stake).toFixed(1) : null,
  };
}

function skillMetricWindow(pool, metricKey, bandFn, bands) {
  const withM = pool.filter(r => Number.isFinite(r[metricKey]));
  const allPaths = {};
  for (const b of [...bands, 'All']) {
    const cell = b === 'All' ? pool : pool.filter(r => bandFn(r[metricKey]) === b);
    if (cell.length) allPaths[b] = skillAgg(cell);
  }
  const byPath = {};
  for (const p of ['A', 'B', 'C']) {
    const pathRows = pool.filter(r => r.path === p);
    if (!pathRows.length) continue;
    byPath[p] = {};
    for (const b of bands) {
      const cell = pathRows.filter(r => bandFn(r[metricKey]) === b);
      if (cell.length) {
        const a = skillAgg(cell);
        byPath[p][b] = { wr: a.wr, n: a.n, record: a.record, roi: a.roi };
      }
    }
  }
  return {
    n: pool.length,
    coverage: withM.length,
    stampN: pool.filter(r => r[`${metricKey}Src`] === 'stamp').length,
    asofN: pool.filter(r => r[`${metricKey}Src`] === 'asof').length,
    allPaths,
    byPath,
  };
}

/**
 * Staked graded Jun15+ · EDGE/net/tape = stamp if present else as-of
 * (featured WR / causal CLV ledger / computeTapeScore).
 */
async function computeSkillBandWindows(allRows) {
  const yesterday = etYesterday();
  const jul15 = TAPE_SIZING_LIVE_FROM;
  const wrLedger = buildFeaturedWrLedgerFromRows(allRows);

  let clvLedger = new Map();
  try {
    const snap = await db.collection(CLV_LEDGER_COLLECTION).doc(CLV_LEDGER_DOC_ID).get();
    if (snap.exists) clvLedger = hydrateClvLedger(snap.data() || {});
  } catch (_) { /* degrade to stamps-only for net/tape as-of */ }

  const enriched = [];
  for (const r of allRows || []) {
    if (!r?.date || r.date < SKILL_BAND_FROM) continue;
    if (r.superseded) continue;
    if (r.won !== 0 && r.won !== 1) continue;
    if (r.tracked) continue;
    const units = Number(r.units) || 0;
    if (!(units > 0)) continue;

    const wd = r.walletDetails || [];
    let edge = null, edgeSrc = 'none';
    if (Number.isFinite(r.winnerAlignEdge)) {
      edge = r.winnerAlignEdge;
      edgeSrc = 'stamp';
    } else if (Number.isFinite(r.winnerAlignMeanFor)) {
      // Composite blank on some unopposed / FAIL_OPEN rows — FOR mean still stamped.
      const ag = Number.isFinite(r.winnerAlignMeanAg) ? r.winnerAlignMeanAg : EDGE_PRIOR_AG_WR;
      edge = r.winnerAlignMeanFor - ag;
      edgeSrc = 'stamp';
    } else {
      const e = asofEdgeFromWd(wd, r.sideKey, r.sport, r.date, wrLedger);
      if (e != null) { edge = e; edgeSrc = 'asof'; }
    }

    let net = null, netSrc = 'none';
    if (Number.isFinite(r.netMeanPrior)) {
      net = r.netMeanPrior;
      netSrc = 'stamp';
    } else if (Number.isFinite(r.netClvMeanFor)) {
      const ag = Number.isFinite(r.netClvMeanAg) ? r.netClvMeanAg : NET_CLV_PRIOR_AG;
      net = r.netClvMeanFor - ag;
      netSrc = 'stamp';
    } else if (clvLedger.size && wd.length) {
      const n = computeNetMeanPrior(wd, r.sideKey, r.date, clvLedger);
      if (n?.netMeanPrior != null) { net = n.netMeanPrior; netSrc = 'asof'; }
    }

    let tape = null, tapeSrc = 'none';
    if (Number.isFinite(r.tapeScore)) {
      tape = r.tapeScore;
      tapeSrc = 'stamp';
    } else {
      const t = computeTapeScore(edge, net);
      if (t != null) {
        tape = t;
        tapeSrc = (edgeSrc === 'asof' || netSrc === 'asof') ? 'asof' : 'stamp';
      }
    }

    enriched.push({
      date: r.date,
      path: skillPathOf(r.hcStakeTier),
      units,
      won: r.won,
      profit: Number.isFinite(r.profit) ? r.profit : (r.won === 1 ? 0 : -units),
      edge, edgeSrc,
      net, netSrc,
      tape, tapeSrc,
    });
  }

  const windows = [
    { label: `Jun 15+`, pred: (r) => r.date >= SKILL_BAND_FROM },
    { label: `Jul 15+`, pred: (r) => r.date >= jul15 },
    { label: `Yesterday (${fmtShortYmd(yesterday)})`, pred: (r) => r.date === yesterday },
  ];

  return {
    yesterday,
    clvWallets: clvLedger.size,
    wrWallets: wrLedger.size,
    nRows: enriched.length,
    edge: windows.map((w) => ({ label: w.label, ...skillMetricWindow(enriched.filter(w.pred), 'edge', edgeNetBand, EDGE_NET_BANDS) })),
    net: windows.map((w) => ({ label: w.label, ...skillMetricWindow(enriched.filter(w.pred), 'net', edgeNetBand, EDGE_NET_BANDS) })),
    tape: windows.map((w) => ({ label: w.label, ...skillMetricWindow(enriched.filter(w.pred), 'tape', tapePolicyBand, TAPE_POLICY_BANDS) })),
  };
}

function pushSkillMetricTables(report, name, subtitle, windows, bands, pathHeaders) {
  report.push(`#### ${name}`);
  report.push('');
  report.push(`_${subtitle}_`);
  report.push('');
  for (const w of windows) {
    report.push(`##### ${w.label} · ${w.n} tickets · cov ${w.coverage}/${w.n} (stamp ${w.stampN} / as-of ${w.asofN})`);
    report.push('');
    report.push(`| Band | n | Record | WR | ROI |`);
    report.push(`|------|--:|:------:|---:|----:|`);
    for (const b of [...bands, 'All']) {
      const a = w.allPaths[b];
      if (!a) continue;
      report.push(`| ${b} | ${a.n} | ${a.record} | ${a.wr != null ? a.wr.toFixed(1) + '%' : '—'} | ${fmtSkillRoi(a.roi)} |`);
    }
    report.push('');
    const paths = ['A', 'B', 'C'].filter((p) => w.byPath[p]);
    if (paths.length) {
      report.push(`| Path | ${pathHeaders.join(' | ')} |`);
      report.push(`|------|${pathHeaders.map(() => '---:').join('|')}|`);
      for (const p of paths) {
        const cells = bands.map((b) => {
          const c = w.byPath[p][b];
          return c ? `${c.wr}% (${c.n})` : '—';
        });
        report.push(`| ${p} | ${cells.join(' | ')} |`);
      }
      report.push('');
    }
  }
}

async function buildSkillBandWindows(report, allRows) {
  report.push(`### 5b — Skill bands (EDGE · NetCLV · Tape)`);
  report.push('');
  report.push(`Staked graded (\`finalUnits > 0\`, WIN/LOSS). Metric = **stamp if present, else as-of** (featured sport WR n≥${SKILL_BAND_MIN_WR_N} / causal CLV ledger / \`computeTapeScore\`). Windows: **Jun 15+** · **Jul 15+** · **yesterday**.`);
  report.push('');
  report.push(`- **EDGE** bands: \`<5\` / \`5–10\` / \`≥10\` · mean FOR WR − (mean AG ?? ${EDGE_PRIOR_AG_WR})`);
  report.push(`- **NetCLV** bands: same · mean FOR %+CLV − (mean AG ?? ${NET_CLV_PRIOR_AG})`);
  report.push(`- **Tape** bands: policy \`<${TAPE_MUTE_BELOW}\` / mid / \`≥${TAPE_BOOST_ABOVE}\` · \`${TAPE_EDGE_WEIGHT}·(EDGE/10) + ${TAPE_NET_WEIGHT}·(netCLV/10)\``);
  report.push('');

  let data;
  try {
    data = await computeSkillBandWindows(allRows);
  } catch (err) {
    report.push(`_(skill-band compute failed: ${err?.message || err})_`);
    report.push('');
    return;
  }

  if (!data.nRows) {
    report.push(`_No staked graded tickets from ${SKILL_BAND_FROM}+ yet._`);
    report.push('');
    return;
  }

  // One-line headline from Jun15+ EDGE ≥10 vs 5–10
  const junEdge = data.edge[0];
  const eHi = junEdge?.allPaths['≥10'];
  const eMid = junEdge?.allPaths['5–10'];
  if (eHi && eMid) {
    report.push(`> **Watch:** EDGE ≥10 is the separator (Jun15+ ${eHi.record} · ${eHi.wr}% · ${fmtSkillRoi(eHi.roi)}); **5–10 is the hole** (${eMid.record} · ${eMid.wr}% · ${fmtSkillRoi(eMid.roi)}). Net ≥10 can flip cold in the Jul15+ window — read across metrics.`);
    report.push('');
  }

  pushSkillMetricTables(
    report, 'EDGE', 'mean FOR sport WR − (mean AG ?? 50)',
    data.edge, EDGE_NET_BANDS, ['E<5 WR', '5–10 WR', '≥10 WR'],
  );
  pushSkillMetricTables(
    report, 'NetCLV', `mean FOR causal %+CLV − (mean AG ?? ${NET_CLV_PRIOR_AG}) · bands mirror EDGE`,
    data.net, EDGE_NET_BANDS, ['N<5 WR', '5–10 WR', '≥10 WR'],
  );
  pushSkillMetricTables(
    report, 'Tape', `${TAPE_EDGE_WEIGHT}·(EDGE/10) + ${TAPE_NET_WEIGHT}·(netCLV/10) · mute <${TAPE_MUTE_BELOW} · boost ≥${TAPE_BOOST_ABOVE}`,
    data.tape, TAPE_POLICY_BANDS, ['<0 WR', '0–2.89 WR', '≥2.89 WR'],
  );
}

/** @deprecated LOOKAHEAD — do not use for historical EDGE tables. Current profiles on old dates. Kept only if needed for live ungraded diagnostics. */
function enrichWinnerAlignEdge(rows, walletProfiles) {
  if (!walletProfiles || !walletProfiles.size) return;
  for (const r of rows) {
    if (Number.isFinite(r.winnerAlignEdge)) continue;
    const wd = r.walletDetails;
    if (!Array.isArray(wd) || !r.sideKey || !r.sport) continue;
    const fors = [], ags = [];
    const seen = new Set();
    for (const w of wd) {
      const short = String(w.wallet || w.walletShort || '').slice(-6).toLowerCase();
      if (!short || seen.has(short)) continue;
      seen.add(short);
      const prof = walletProfiles.get(short);
      const rec = prof?.bySport?.[r.sport];
      const n = Number(rec?.picks?.n) || 0;
      const wr = Number(rec?.picks?.wr);
      if (n < 8 || !Number.isFinite(wr)) continue;
      if (w.side === r.sideKey) fors.push(wr);
      else if (w.side) ags.push(wr);
    }
    if (!fors.length) continue;
    const meanFor = fors.reduce((s, x) => s + x, 0) / fors.length;
    const meanAg = ags.length ? ags.reduce((s, x) => s + x, 0) / ags.length : null;
    r.winnerAlignEdge = meanFor - (meanAg != null ? meanAg : EDGE_PRIOR_AG_WR);
    r.winnerAlignMeanFor = meanFor;
    r.winnerAlignMeanAg = meanAg;
    r.winnerAlignTopFor = Math.max(...fors);
    r.winnerAlignTopAg = ags.length ? Math.max(...ags) : null;
    r.winnerAlignEdgeSource = meanAg != null ? 'profile_replay' : 'profile_replay_ag_prior_50';
  }
}

function edgeBucket(edge) {
  if (!Number.isFinite(edge)) return 'NA';
  if (edge >= 10) return 'E10+';
  if (edge >= 5) return 'E5-10';
  if (edge >= 3) return 'E3-5';
  if (edge >= 0) return 'E0-3';
  if (edge > -5) return 'E-5-0';
  return 'E≤-5';
}

function flat1uPnl(rows) {
  let flat = 0, w = 0, l = 0;
  for (const r of rows) {
    if (r.won === 1) {
      w++;
      const o = r.peakOdds || r.lockOdds;
      flat += o < 0 ? 100 / Math.abs(o) : o / 100;
    } else if (r.won === 0) {
      l++;
      flat -= 1;
    }
  }
  return { w, l, n: w + l, flat };
}

function stakedPnl(rows) {
  let n = 0, pnl = 0, stake = 0, w = 0, l = 0;
  for (const r of rows) {
    if ((r.units || 0) <= 0 || r.tracked) continue;
    if (r.won == null) continue;
    n++;
    stake += r.units || 0;
    pnl += r.profit || 0;
    if (r.won === 1) w++; else if (r.won === 0) l++;
  }
  return { n, w, l, stake, pnl, roi: stake > 0 ? (pnl / stake) * 100 : null };
}

function buildV12WinnerAlign(report, stats, walletProfiles) {
  report.push(`## § 5d — WINNER-ALIGN (EDGE + Top-Winner Policy E · v12abcde)`);
  report.push('');
  if (!stats) {
    report.push(`_(no V12-era graded picks yet.)_`);
    report.push('');
    return;
  }
  report.push(`> **What this is.** \`v12abcde\` Path E stamps. **From 2026-07-15:** EDGE stake overrides (size / WINNER rescue / Policy E) are **frozen**; sizing is **TAPE** on path units (mute tape&lt;0 · boost ≥2.89 ×1.35 · fail-open). Winner-align still stamps EDGE and mutes **fadeTop≥60** only. See \`docs/TAPE_SIZING.md\`.`);
  report.push(`> **2026-07-12..14 (historical):** MUTE fadeTop≥60 / EDGE≤−5; SIZE by EDGE; RESCUE WINNER @ 6/4/3; TOP-WINNER E caps/floors/junk.`);
  report.push('');
  report.push(`> **Findings to watch (causal Jun1+):** EDGE predicts winners better than AGS/HC/Δw (AUC~0.58). Not linear — money in **E10+ (Q5)**; toxic zone **E−5→0**. **Top-Winner E CF ≈ +30u** vs v12abcd production — watch §F whether live stamps match.`);
  report.push('');

  const { v12Rows, v12RowsAll } = stats;
  // DO NOT enrich historical rows with current sharpWalletProfiles WR.
  // That is lookahead (same bug that inflated EDGE CFs to 74%). Stamps only.

  // (A) Live WINNER rescues — overall + by EDGE band
  const liveW = (v12RowsAll || v12Rows).filter(r => r.hcStakeTier === 'WINNER');
  const liveGraded = liveW.filter(r => r.won != null);
  report.push(`### (A) Live stamped WINNER rescues`);
  report.push('');
  if (liveGraded.length === 0) {
    const pending = liveW.filter(r => r.won == null).length;
    report.push(`_No graded WINNER picks yet${pending ? ` (${pending} ungraded in flight)` : ''}. Fills in as \`hcStakeTier=WINNER\` grades._`);
  } else {
    const a = aggregate(liveGraded);
    report.push(`| Slice | Picks | W-L | Win % | Stake | PnL | ROI |`);
    report.push(`|-------|-------|-----|-------|-------|-----|-----|`);
    report.push(`| ALL WINNER | ${a.n} | ${a.w}-${a.l} | ${pct(a.w, a.n)} | ${a.totalStake.toFixed(1)}u | ${fmtSigned(a.profit)}u | ${a.roi != null ? (a.roi>=0?'+':'')+a.roi.toFixed(1)+'%' : '—'} |`);
    for (const [label, pred] of [
      ['E10+ (6u target)', r => Number.isFinite(r.winnerAlignEdge) && r.winnerAlignEdge >= 10],
      ['E5–10 (4u)', r => Number.isFinite(r.winnerAlignEdge) && r.winnerAlignEdge >= 5 && r.winnerAlignEdge < 10],
      ['E3–5 (3u)', r => Number.isFinite(r.winnerAlignEdge) && r.winnerAlignEdge >= 3 && r.winnerAlignEdge < 5],
    ]) {
      const sub = aggregate(liveGraded.filter(pred));
      if (sub.n + sub.trackedN === 0) continue;
      report.push(`| ${label} | ${sub.n} | ${sub.w}-${sub.l} | ${pct(sub.w, sub.n)} | ${sub.totalStake.toFixed(1)}u | ${fmtSigned(sub.profit)}u | ${sub.roi != null ? (sub.roi>=0?'+':'')+sub.roi.toFixed(1)+'%' : '—'} |`);
    }
  }
  report.push('');

  // (B) EDGE margin ladder — full monitoring
  report.push(`### (B) EDGE margin ladder (every stamped V12 play)`);
  report.push('');
  report.push(`Mean FOR−AG sport WR (pp) from **stamped** \`v8_winnerAlignEdge\` only (cron live write — near-causal post-cutover).`);
  report.push('');
  report.push(`> ⚠️ **Never replay current profiles onto old dates for EDGE.** That is lookahead. Table = **stamps only**. Pre-cutover graded rows will show low coverage until post-2026-07-12 fills in.`);
  report.push('');
  const stamped = v12Rows.filter(r => Number.isFinite(r.winnerAlignEdge));
  const buckets = ['E10+', 'E5-10', 'E3-5', 'E0-3', 'E-5-0', 'E≤-5'];
  report.push(`| EDGE bucket | N | W-L | Win % | Flat 1u PnL | Staked N | Staked PnL | Staked ROI |`);
  report.push(`|-------------|---|-----|-------|-------------|----------|------------|------------|`);
  if (stamped.length === 0) {
    report.push(`| _(no stamped EDGE yet — winner-align live 2026-07-12)_ |  |  |  |  |  |  |  |`);
  } else {
    const wrByBucket = [];
    for (const b of buckets) {
      const rows = stamped.filter(r => edgeBucket(r.winnerAlignEdge) === b);
      if (!rows.length) {
        report.push(`| ${b.padEnd(11)} |   0 | —     |     — |           — |        0 |          — |          — |`);
        continue;
      }
      const f = flat1uPnl(rows);
      const s = stakedPnl(rows);
      const wr = f.n > 0 ? (100 * f.w / f.n) : null;
      if (wr != null) wrByBucket.push({ b, wr });
      report.push(`| ${b.padEnd(11)} | ${String(f.n).padStart(3)} | ${(f.w+'-'+f.l).padEnd(5)} | ${pct(f.w, f.n).padStart(5)} | ${fmtSigned(f.flat).padStart(11)} | ${String(s.n).padStart(8)} | ${fmtSigned(s.pnl).padStart(10)} | ${s.roi != null ? ((s.roi>=0?'+':'')+s.roi.toFixed(1)+'%').padStart(10) : '—'.padStart(10)} |`);
    }
    // Monotonicity on the ordered buckets that have data (low→high EDGE)
    const ordered = [...wrByBucket].reverse(); // E≤-5 … E10+ already listed high→low; reverse for low→high
    let steps = 0, ok = 0;
    for (let i = 1; i < ordered.length; i++) {
      steps++;
      if (ordered[i].wr >= ordered[i - 1].wr) ok++;
    }
    report.push('');
    report.push(`_Monotonicity (WR rises with EDGE bucket, low→high): **${ok}/${steps}** steps. Expect stepwise climb; toxic mid (E−5→0) can undercut E≤−5._`);
  }
  report.push('');
  report.push(`_Stamped EDGE coverage: **${stamped.length}/${v12Rows.length}** graded V12 rows (${v12Rows.length ? ((100 * stamped.length / v12Rows.length).toFixed(0)) : 0}%)._`);
  report.push('');

  // (B2) Findings watch — Q5 / toxic / bad-staked
  report.push(`### (B2) Findings watch`);
  report.push('');
  const e10 = stamped.filter(r => r.winnerAlignEdge >= 10);
  const eNegMid = stamped.filter(r => r.winnerAlignEdge > -5 && r.winnerAlignEdge < 0);
  const eNeg = stamped.filter(r => r.winnerAlignEdge < 0);
  const eNegStaked = eNeg.filter(r => (r.units || 0) > 0 && !r.tracked);
  const f10 = flat1uPnl(e10);
  const fMid = flat1uPnl(eNegMid);
  const sNeg = stakedPnl(eNegStaked);
  report.push(`| Watch | N | W-L | Win % | Flat / Staked PnL | Target |`);
  report.push(`|-------|---|-----|-------|-------------------|--------|`);
  report.push(`| **E10+ (extreme / Q5)** | ${f10.n} | ${f10.w}-${f10.l} | ${pct(f10.w, f10.n)} | flat ${fmtSigned(f10.flat)}u | Should lead book — sized to **6u** |`);
  report.push(`| **E−5→0 (toxic mid)** | ${fMid.n} | ${fMid.w}-${fMid.l} | ${pct(fMid.w, fMid.n)} | flat ${fmtSigned(fMid.flat)}u | Worst WR zone historically — shrink/mute |`);
  report.push(`| **EDGE&lt;0 still staked** | ${sNeg.n} | ${sNeg.w}-${sNeg.l} | ${pct(sNeg.w, sNeg.n)} | staked ${fmtSigned(sNeg.pnl)}u | Should be **≤1u** after bad-EDGE shrink |`);
  report.push('');

  // (C) Mute actions
  const mutedWA = v12Rows.filter(r => r.mutedBy === 'winner_align_fade' || r.winnerAlignAction === 'mute');
  report.push(`### (C) Winner-align mutes`);
  report.push('');
  if (!mutedWA.length) {
    report.push(`_No graded picks stamped \`mutedBy=winner_align_fade\` yet (pre-cutover history won’t carry the stamp)._`);
  } else {
    const f = flat1uPnl(mutedWA);
    report.push(`| Muted N | W-L | Counterfactual flat 1u (if we had bet) |`);
    report.push(`|---------|-----|----------------------------------------|`);
    report.push(`| ${f.n} | ${f.w}-${f.l} | ${fmtSigned(f.flat)}u |`);
    const byWhy = [
      ['fadeTop60', r => r.winnerAlignFadeTop60],
      ['meanBehind5', r => r.winnerAlignMeanBehind5],
    ];
    for (const [why, pred] of byWhy) {
      const sub = mutedWA.filter(pred);
      if (!sub.length) continue;
      const sf = flat1uPnl(sub);
      report.push(`- ${why}: ${sf.n} picks · CF flat ${fmtSigned(sf.flat)}u · ${pct(sf.w, sf.n)} WR`);
    }
  }
  report.push('');

  // (D) Action mix — mute / size / rescue / top_* / none
  report.push(`### (D) Winner-align actions (stamped)`);
  report.push('');
  const withAction = v12Rows.filter(r => r.winnerAlignAction);
  const ALL_ACTIONS = ['mute', 'size', 'rescue', 'top_floor', 'top_cap', 'top_junk'];
  if (!withAction.length) {
    report.push(`_No \`v8_winnerAlignAction\` stamps on graded rows yet._`);
  } else {
    report.push(`| Action | N | W-L | Win % | Avg u | Staked N | Staked PnL | Staked ROI | vs book WR |`);
    report.push(`|--------|---|-----|-------|-------|----------|------------|------------|------------|`);
    const bookFlat = flat1uPnl(stamped.length ? stamped : v12Rows);
    const bookWr = bookFlat.n > 0 ? (100 * bookFlat.w / bookFlat.n) : null;
    for (const act of ALL_ACTIONS) {
      const rows = withAction.filter(r => r.winnerAlignAction === act);
      if (!rows.length) continue;
      const f = flat1uPnl(rows);
      const s = stakedPnl(rows);
      const avgU = s.n > 0 ? (s.stake / s.n) : 0;
      const wr = f.n > 0 ? (100 * f.w / f.n) : null;
      const dWr = wr != null && bookWr != null ? wr - bookWr : null;
      report.push(
        `| ${act.padEnd(9)} | ${f.n} | ${f.w}-${f.l} | ${pct(f.w, f.n)} | ${avgU.toFixed(2)} | ${s.n} | ${fmtSigned(s.pnl)}u | ${s.roi != null ? ((s.roi>=0?'+':'')+s.roi.toFixed(1)+'%') : '—'} | ${dWr != null ? ((dWr>=0?'+':'')+dWr.toFixed(1)+'pp') : '—'} |`
      );
    }
    const other = withAction.filter(r => !ALL_ACTIONS.includes(r.winnerAlignAction));
    if (other.length) {
      const f = flat1uPnl(other);
      report.push(`| _(other)_ | ${f.n} | ${f.w}-${f.l} | ${pct(f.w, f.n)} | — | — | — | — | — |`);
    }
  }
  report.push('');

  // (E) Independence vs AGS — EDGE works when AGS is weak?
  report.push(`### (E) EDGE vs AGS independence`);
  report.push('');
  const withBoth = stamped.filter(r => Number.isFinite(r.agsV12));
  if (withBoth.length < 20) {
    report.push(`_Need more stamped EDGE + AGS rows (have ${withBoth.length})._`);
  } else {
    const scores = withBoth.map(r => r.agsV12).sort((a, b) => a - b);
    const med = scores[Math.floor(scores.length / 2)];
    const edge5 = withBoth.filter(r => r.winnerAlignEdge >= 5);
    const edge5LowAgs = edge5.filter(r => r.agsV12 < med);
    const agsTop = [...withBoth].sort((a, b) => b.agsV12 - a.agsV12).slice(0, Math.max(1, Math.floor(withBoth.length / 5)));
    const agsTopNoE5 = agsTop.filter(r => r.winnerAlignEdge < 5);
    const fE5lo = flat1uPnl(edge5LowAgs);
    const fAgsNo = flat1uPnl(agsTopNoE5);
    report.push(`| Slice | N | W-L | Win % | Flat 1u |`);
    report.push(`|-------|---|-----|-------|---------|`);
    report.push(`| EDGE≥5 + below-median AGS | ${fE5lo.n} | ${fE5lo.w}-${fE5lo.l} | ${pct(fE5lo.w, fE5lo.n)} | ${fmtSigned(fE5lo.flat)}u |`);
    report.push(`| AGS top-quintile, EDGE&lt;5 | ${fAgsNo.n} | ${fAgsNo.w}-${fAgsNo.l} | ${pct(fAgsNo.w, fAgsNo.n)} | ${fmtSigned(fAgsNo.flat)}u |`);
    report.push('');
    report.push(`_If EDGE≥5 / low-AGS stays green while high-AGS / low-EDGE fades, EDGE is doing real work — not AGS in disguise._`);
  }
  report.push('');

  // ── (F) TOP-WINNER POLICY E — the new rules ────────────────────────────
  report.push(`### (F) Top-Winner Policy E — is each rule helping or hurting?`);
  report.push('');
  report.push(`> **How to read.** Each row is picks where that **state** or **action** was stamped. Compare Win % / staked ROI to the stamped-EDGE book baseline. Green = helping; red = hurting. Actions (\`top_floor\` / \`top_cap\` / \`top_junk\`) are what the live sizer actually did.`);
  report.push('');

  const allPool = v12RowsAll || v12Rows;
  const bookBase = stamped.length ? stamped : v12Rows;
  const bookF = flat1uPnl(bookBase);
  const bookS = stakedPnl(bookBase);
  const bookWrPct = bookF.n > 0 ? (100 * bookF.w / bookF.n) : null;

  function rowImpact(label, rows, note = '') {
    const f = flat1uPnl(rows);
    const s = stakedPnl(rows);
    const avgU = s.n > 0 ? s.stake / s.n : 0;
    const wr = f.n > 0 ? (100 * f.w / f.n) : null;
    const dWr = wr != null && bookWrPct != null ? wr - bookWrPct : null;
    const dRoi = s.roi != null && bookS.roi != null ? s.roi - bookS.roi : null;
    const flag = dWr == null ? '' : dWr >= 3 ? ' ✅' : dWr <= -3 ? ' ⚠️' : '';
    return (
      `| ${label} | ${f.n} | ${f.w}-${f.l} | ${pct(f.w, f.n)}${flag} | ${avgU.toFixed(2)} | ${s.n} | ${fmtSigned(s.pnl)}u | ${s.roi != null ? ((s.roi>=0?'+':'')+s.roi.toFixed(1)+'%') : '—'} | ${dWr != null ? ((dWr>=0?'+':'')+dWr.toFixed(1)+'pp') : '—'} | ${dRoi != null ? ((dRoi>=0?'+':'')+dRoi.toFixed(1)+'pp') : '—'} |${note ? ` ${note}` : ''}`
    );
  }

  report.push(`_Baseline (stamped EDGE book): **${bookF.n}** graded · **${pct(bookF.w, bookF.n)}** WR · staked ROI **${bookS.roi != null ? ((bookS.roi>=0?'+':'')+bookS.roi.toFixed(1)+'%') : '—'}**_`);
  report.push('');
  report.push(`#### (F1) Actions — what Policy E actually did`);
  report.push('');
  report.push(`| Rule applied | N | W-L | Win % | Avg u | Staked N | Staked PnL | ROI | ΔWR vs book | ΔROI vs book |`);
  report.push(`|--------------|---|-----|-------|-------|----------|------------|-----|-------------|--------------|`);
  const topActions = [
    ['top_floor (size UP unopposed)', r => r.winnerAlignAction === 'top_floor'],
    ['top_cap (opposed → ≤1u)', r => r.winnerAlignAction === 'top_cap'],
    ['top_junk (no-Top5 + EDGE&lt;5 → 0)', r => r.winnerAlignAction === 'top_junk'],
    ['rescue (EDGE≥3 WINNER)', r => r.winnerAlignAction === 'rescue'],
    ['mute (fadeTop / meanBehind)', r => r.winnerAlignAction === 'mute'],
    ['size (EDGE ladder resize)', r => r.winnerAlignAction === 'size'],
  ];
  let anyTopAct = false;
  for (const [label, pred] of topActions) {
    const rows = v12Rows.filter(pred);
    if (!rows.length) continue;
    anyTopAct = true;
    report.push(rowImpact(label, rows));
  }
  if (!anyTopAct) {
    report.push(`| _(no Policy E / WA actions on graded rows yet — fills as post-cutover picks grade)_ |  |  |  |  |  |  |  |  |  |`);
  }
  report.push('');

  report.push(`#### (F2) States — ticket shape flags (even if action was something else)`);
  report.push('');
  report.push(`These are the **conditions** Policy E looks at. A ticket can be elite-unopposed without \`top_floor\` if Path A/B/C already sized it high enough.`);
  report.push('');
  report.push(`| State | N | W-L | Win % | Avg u | Staked N | Staked PnL | ROI | ΔWR vs book | ΔROI vs book |`);
  report.push(`|-------|---|-----|-------|-------|----------|------------|-----|-------------|--------------|`);
  const stateRows = [
    ['Elite unopposed (WR60+ FOR, no WR60 AG)', r => r.winnerAlignEliteUnopp],
    ['Top5 unopposed (Top5 FOR, no Top5 AG)', r => r.winnerAlignTopUnopp],
    ['Top vs Top (Top5 both sides)', r => r.winnerAlignTopVsTop],
    ['Has Top5 FOR', r => r.winnerAlignHasTop5For],
    ['No Top5 FOR', r => r.winnerAlignHasBoth && !r.winnerAlignHasTop5For],
    ['Top5 on AG only', r => r.winnerAlignHasTop5Ag && !r.winnerAlignHasTop5For],
    ['Elite unopp + EDGE≥5', r => r.winnerAlignEliteUnopp && Number.isFinite(r.winnerAlignEdge) && r.winnerAlignEdge >= 5],
    ['Top5 unopp + EDGE≥5', r => r.winnerAlignTopUnopp && Number.isFinite(r.winnerAlignEdge) && r.winnerAlignEdge >= 5],
    ['No Top5 + EDGE&lt;5 (junk zone)', r => r.winnerAlignHasBoth && !r.winnerAlignHasTop5For && Number.isFinite(r.winnerAlignEdge) && r.winnerAlignEdge < 5],
  ];
  let anyState = false;
  for (const [label, pred] of stateRows) {
    const rows = v12Rows.filter(pred);
    if (!rows.length) continue;
    anyState = true;
    report.push(rowImpact(label, rows));
  }
  if (!anyState) {
    report.push(`| _(no Top5/elite stamps on graded rows yet)_ |  |  |  |  |  |  |  |  |  |`);
  }
  report.push('');

  report.push(`#### (F3) Sizing discipline — are floors/caps landing on the right sizes?`);
  report.push('');
  const floorRows = v12Rows.filter(r => r.winnerAlignAction === 'top_floor');
  const capRows = v12Rows.filter(r => r.winnerAlignAction === 'top_cap');
  const junkRows = v12Rows.filter(r => r.winnerAlignAction === 'top_junk');
  if (!floorRows.length && !capRows.length && !junkRows.length) {
    report.push(`_No top_floor / top_cap / top_junk graded yet._`);
  } else {
    report.push(`| Action | Target size | Avg actual u | % at target | N |`);
    report.push(`|--------|-------------|--------------|-------------|---|`);
    if (floorRows.length) {
      const atE10 = floorRows.filter(r => Number.isFinite(r.winnerAlignEdge) && r.winnerAlignEdge >= 10);
      const atE5 = floorRows.filter(r => Number.isFinite(r.winnerAlignEdge) && r.winnerAlignEdge >= 5 && r.winnerAlignEdge < 10);
      for (const [lab, rows, target] of [
        ['top_floor @ E10+', atE10, 6],
        ['top_floor @ E5–10', atE5, 4],
      ]) {
        if (!rows.length) continue;
        const avg = rows.reduce((s, r) => s + (r.units || 0), 0) / rows.length;
        const hit = rows.filter(r => Math.abs((r.units || 0) - target) < 0.15).length;
        report.push(`| ${lab} | ${target}u | ${avg.toFixed(2)}u | ${pct(hit, rows.length)} | ${rows.length} |`);
      }
    }
    if (capRows.length) {
      const avg = capRows.reduce((s, r) => s + (r.units || 0), 0) / capRows.length;
      const hit = capRows.filter(r => (r.units || 0) <= 1.05).length;
      report.push(`| top_cap | ≤1u | ${avg.toFixed(2)}u | ${pct(hit, capRows.length)} | ${capRows.length} |`);
    }
    if (junkRows.length) {
      const avg = junkRows.reduce((s, r) => s + (r.units || 0), 0) / junkRows.length;
      const hit = junkRows.filter(r => (r.units || 0) <= 0).length;
      report.push(`| top_junk | 0u | ${avg.toFixed(2)}u | ${pct(hit, junkRows.length)} | ${junkRows.length} |`);
    }
  }
  report.push('');

  // Counterfactual: junk cuts — if we HAD bet them (flat 1u)
  if (junkRows.length) {
    const jf = flat1uPnl(junkRows);
    report.push(`_Junk-cut counterfactual (if we had bet flat 1u instead of cutting): **${jf.w}-${jf.l}** · ${pct(jf.w, jf.n)} · flat ${fmtSigned(jf.flat)}u — want this **red** (cutting helped)._`);
    report.push('');
  }

  report.push(`#### (F4) Today / in-flight — rules applied (ungraded + graded)`);
  report.push('');
  const todayEt = (() => {
    try {
      return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
    } catch {
      return new Date().toISOString().slice(0, 10);
    }
  })();
  const recentDates = [...new Set(allPool.map(r => r.date))].sort().slice(-3);
  const focusDates = recentDates.includes(todayEt) ? recentDates : [...recentDates, todayEt].filter(Boolean);
  const focus = allPool.filter(r => focusDates.includes(r.date) && r.winnerAlignAction);
  if (!focus.length) {
    report.push(`_No winner-align actions stamped on last ${focusDates.join(', ') || 'dates'} yet (pre-T-15 cycles write stamps as they fire)._`);
  } else {
    report.push(`Picks on **${focusDates.join(', ')}** with a stamped action. Outcome blank = still in flight.`);
    report.push('');
    report.push(`| Date | Sport | Mkt | Pick | EDGE | Action | Flags | Path | u | Out | PnL |`);
    report.push(`|------|-------|-----|------|------|--------|-------|------|---|-----|-----|`);
    const sorted = [...focus].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
    for (const r of sorted.slice(0, 60)) {
      const flags = [
        r.winnerAlignEliteUnopp ? 'eliteU' : null,
        r.winnerAlignTopUnopp ? 'topU' : null,
        r.winnerAlignTopVsTop ? 'TvT' : null,
        r.winnerAlignHasTop5For ? 'T5for' : null,
        r.winnerAlignHasTop5Ag && !r.winnerAlignHasTop5For ? 'T5ag' : null,
      ].filter(Boolean).join(',') || '—';
      const team = `${r.team || r.sideKey || ''}`.substring(0, 16);
      const edgeStr = Number.isFinite(r.winnerAlignEdge) ? fmtSigned(r.winnerAlignEdge, 1) : '—';
      const out = r.won === 1 ? 'W' : r.won === 0 ? 'L' : '·';
      const pnl = r.won != null ? fmtSigned(r.profit) : '—';
      report.push(
        `| ${r.date} | ${(r.sport || '').padEnd(3)} | ${(r.marketType || '').padEnd(3)} | ${team.padEnd(16)} | ${edgeStr.padStart(5)} | ${(r.winnerAlignAction || '—').padEnd(9)} | ${flags.padEnd(18)} | ${pathShort(r.hcStakeTier).padEnd(6)} | ${((r.units || 0).toFixed(1))} | ${out} | ${pnl} |`
      );
    }
    if (sorted.length > 60) report.push(`_… +${sorted.length - 60} more_`);
  }
  report.push('');

  report.push(`#### (F5) Helping / hurting scoreboard (quick verdict)`);
  report.push('');
  const verdicts = [];
  function pushVerdict(name, rows, wantHighWr) {
    if (rows.length < 5) {
      verdicts.push(`- **${name}**: n=${rows.length} — _need ≥5 graded to call_`);
      return;
    }
    const f = flat1uPnl(rows);
    const wr = f.n ? (100 * f.w / f.n) : null;
    const s = stakedPnl(rows);
    if (wantHighWr) {
      const ok = wr != null && bookWrPct != null && wr >= bookWrPct;
      verdicts.push(`- **${name}**: ${f.w}-${f.l} (${pct(f.w, f.n)}) · staked ${fmtSigned(s.pnl)}u · ${ok ? '✅ helping (≥ book WR)' : '⚠️ underperforming book WR'}`);
    } else {
      // junk cut / mute — want LOW CF WR (cutting dogs)
      const ok = wr != null && wr < 48;
      verdicts.push(`- **${name}** (want weak CF WR): ${f.w}-${f.l} (${pct(f.w, f.n)}) CF flat ${fmtSigned(f.flat)}u · ${ok ? '✅ cutting dogs' : '⚠️ may be cutting winners'}`);
    }
  }
  pushVerdict('top_floor', floorRows, true);
  pushVerdict('elite unopp @ E5+', v12Rows.filter(r => r.winnerAlignEliteUnopp && Number.isFinite(r.winnerAlignEdge) && r.winnerAlignEdge >= 5), true);
  pushVerdict('top_cap / topVsTop', [...capRows, ...v12Rows.filter(r => r.winnerAlignTopVsTop)], false);
  pushVerdict('top_junk', junkRows, false);
  for (const v of verdicts) report.push(v);
  report.push('');

  report.push(`> Track WINNER ROI separately from RANK/SHARP/DISSENT — same mute pool, different gate (sport-WR EDGE). Policy E actions must stay green on §F1/F5 or we roll back the junk cut / floors.`);
  report.push('');
}

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
  // Best / worst sport (single callout each — avoid "strongest" spam)
  const sportAggs = [...new Set(v12Rows.map(r => r.sport))]
    .map(sport => ({ sport, ...aggregate(v12Rows.filter(r => r.sport === sport)) }))
    .filter(s => s.n >= 5 && s.roi != null);
  if (sportAggs.length) {
    const best = [...sportAggs].sort((a, b) => b.roi - a.roi)[0];
    const worst = [...sportAggs].sort((a, b) => a.roi - b.roi)[0];
    if (best.roi > 10) {
      wins.push(`Best sport: **${best.sport}** — ${best.n} live, ${best.w}-${best.l}, ${best.roi.toFixed(1)}% ROI, ${fmtSigned(best.profit)}u.`);
    }
    if (worst.roi < -10 && worst.sport !== best.sport) {
      watch.push(`🟡 Weakest sport: **${worst.sport}** — ${worst.n} live, ${worst.w}-${worst.l}, ${worst.roi.toFixed(1)}% ROI, ${fmtSigned(worst.profit)}u.`);
    }
  }
  // Tape-era snapshot (forward-looking window)
  const tapeEra = liveRows.filter(r => r.date >= SIDE_PROFILE_FROM && (r.won === 1 || r.won === 0));
  if (tapeEra.length >= 3) {
    const tAgg = aggregate(tapeEra);
    wins.push(
      `Tape era (${SIDE_PROFILE_FROM}+): **${tAgg.w}-${tAgg.l}** · ${tAgg.roi != null ? ((tAgg.roi >= 0 ? '+' : '') + tAgg.roi.toFixed(1) + '%') : '—'} ROI · ${fmtSigned(tAgg.profit)}u on ${tAgg.n} graded — see § 5.`,
    );
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

// § 2 — How production sizing works TODAY (not the legacy score ladder)
function buildV12Primer(report) {
  report.push(`## § 2 — Live Stack (how picks size today)`);
  report.push('');
  report.push(`V12 still **scores** a side as a wallet-quality differential (\`forMean\` vs \`agMean\` → score in [-1, +1]). Score ≤ 0 → FADE (0u). What changed is **how positive-score sides get sized**:`);
  report.push('');
  report.push(`| Step | What runs | Units |`);
  report.push(`|------|-----------|-------|`);
  report.push(`| A | HC-margin path | SUPER 6u · TOP 4u · MINI 3u · CONFIRMED 1u |`);
  report.push(`| B | RANK rescue (muted + 2-for-0 whitelist) | 4u |`);
  report.push(`| C | SHARP / SHARP-LEAN EDGE/net rescue (+ MINI- cut) | 1.5–3u |`);
  report.push(`| D | DISSENT mute rescue (MLB contribMargin≤0) | 1u |`);
  report.push(`| E | fadeTop≥60 mute only (EDGE size/rescue **frozen**) | — |`);
  report.push(`| TAPE | From **${SIDE_PROFILE_FROM}**: mute tape&lt;0 · hold mid · boost ≥2.89 ×1.35 | path units |`);
  report.push('');
  report.push(`**Stamps we keep for analysis (every shipped side):** depth (\`#F/#A\`, proven, V12 counts) + quality (ForWR, ForCLV, EDGE, Tape). Unopposed sides still get FOR numbers (EDGE uses AG prior ${EDGE_PRIOR_AG_WR}). Compare WIN vs LOSS in § 5.`);
  report.push('');
  report.push(`Odds cap still clamps long dogs (+100 / +151 / +200 → max 2.5 / 1.5 / 1.0u). Legacy ELITE→WEAK score-ladder units are **not** the live sizer — ignore them if you see them in old notes.`);
  report.push('');
}

// § 3 — Daily scoreboard (recent days first; full history summarized)
function buildV12DailyScoreboard(report, stats) {
  report.push(`## § 3 — Daily Scoreboard`);
  report.push('');
  if (!stats || stats.v12Rows.length === 0) {
    report.push(`_(no graded V12-era picks yet)_`);
    report.push('');
    return;
  }
  const { v12Rows, v12RowsAll, daysLive, perDayPnl, agg } = stats;
  const dates = [...new Set(v12RowsAll.map(r => r.date))].sort();
  const RECENT_DAYS = 21;
  const recentDates = dates.slice(-RECENT_DAYS);
  const priorDates = dates.slice(0, -RECENT_DAYS);

  // Cum PnL through end of prior window so recent table continues the book
  let cumPnl = 0;
  for (const d of priorDates) {
    cumPnl += aggregate(v12Rows.filter(r => r.date === d)).profit;
  }
  if (priorDates.length) {
    const priorAgg = aggregate(v12Rows.filter(r => priorDates.includes(r.date)));
    report.push(`**Full book:** ${daysLive}d · ${agg.n} live · ${agg.w}-${agg.l} · **${fmtSigned(agg.profit)}u** · ${agg.roi != null ? ((agg.roi >= 0 ? '+' : '') + agg.roi.toFixed(1) + '%') : '—'} ROI · ${perDayPnl != null ? fmtSigned(perDayPnl) + 'u/day' : '—'}.`);
    report.push('');
    report.push(`_Prior to table (${priorDates[0]} → ${priorDates[priorDates.length - 1]}): ${priorAgg.n} live · ${priorAgg.w}-${priorAgg.l} · ${fmtSigned(priorAgg.profit)}u · cum through prior = ${fmtSigned(cumPnl)}u._`);
    report.push('');
  }

  report.push(`Last **${recentDates.length}** calendar days with activity. **Live** = units > 0 · **Muted** = graded FADE / 0u · **Cum PnL** = running total since V12 launch.`);
  report.push('');
  report.push(`| Date       | Evaluated | Live | Muted | W-L (live) | Win %  | Stake (u) | PnL (u)    | ROI       | Cum PnL    |`);
  report.push(`|------------|-----------|------|-------|------------|--------|-----------|------------|-----------|------------|`);
  for (const d of recentDates) {
    const dayAll = v12RowsAll.filter(r => r.date === d);
    const dayGraded = v12Rows.filter(r => r.date === d);
    const dayAgg = aggregate(dayGraded);
    const muted = dayGraded.filter(r => (r.units || 0) === 0 || r.tracked).length;
    cumPnl += dayAgg.profit;
    report.push(`| ${d.padEnd(10)} | ${String(dayAll.length).padStart(9)} | ${String(dayAgg.n).padStart(4)} | ${String(muted).padStart(5)} | ${(dayAgg.w+'-'+dayAgg.l).padEnd(10)} | ${pct(dayAgg.w, dayAgg.n).padStart(6)} | ${dayAgg.totalStake.toFixed(2).padStart(9)} | ${fmtSigned(dayAgg.profit).padStart(10)} | ${(dayAgg.roi != null ? dayAgg.roi.toFixed(1)+'%' : '—').padStart(9)} | ${fmtSigned(cumPnl).padStart(10)} |`);
  }
  report.push('');

  if (recentDates.length >= 3) {
    const last3 = recentDates.slice(-3);
    const recentAgg = aggregate(v12Rows.filter(r => last3.includes(r.date)));
    const olderAgg = aggregate(v12Rows.filter(r => !last3.includes(r.date)));
    if (recentAgg.roi != null && olderAgg.roi != null) {
      const delta = recentAgg.roi - olderAgg.roi;
      let trendNote;
      if (Math.abs(delta) < 3) trendNote = `Last 3 days (${recentAgg.roi.toFixed(1)}% ROI) ≈ prior book (${olderAgg.roi.toFixed(1)}%).`;
      else if (delta > 0) trendNote = `🟢 Last 3 days (${recentAgg.roi.toFixed(1)}% ROI) **+${delta.toFixed(1)}pp** vs prior (${olderAgg.roi.toFixed(1)}%).`;
      else trendNote = `🟡 Last 3 days (${recentAgg.roi.toFixed(1)}% ROI) **${delta.toFixed(1)}pp** vs prior (${olderAgg.roi.toFixed(1)}%).`;
      report.push(`> **Trajectory.** ${trendNote}`);
      report.push('');
    }
  }
}

/** Flat 1u counterfactual PnL for one muted / 0u side. */
function unitCfPnl(r) {
  if (r.won === 1) {
    const o = Number(r.peakOdds || r.lockOdds);
    if (Number.isFinite(o) && o > 0) return o / 100;
    if (Number.isFinite(o) && o < 0) return 100 / Math.abs(o);
    return 1;
  }
  if (r.won === 0) return -1;
  return null;
}

function leverBook(rows, { mode = 'staked' } = {}) {
  // mode: 'staked' = real units/profit · 'flat1u' = mute CF
  let n = 0, w = 0, l = 0, stake = 0, pnl = 0;
  for (const r of rows) {
    if (r.won !== 0 && r.won !== 1) continue;
    n++;
    if (r.won === 1) w++; else l++;
    if (mode === 'flat1u') {
      stake += 1;
      const p = unitCfPnl(r);
      if (p != null) pnl += p;
    } else {
      stake += r.units || 0;
      pnl += Number.isFinite(r.profit) ? r.profit : 0;
    }
  }
  return {
    n, w, l, stake, pnl,
    winPct: n ? (100 * w) / n : null,
    roi: stake > 0 ? (pnl / stake) * 100 : null,
    avgPnl: n ? pnl / n : null,
  };
}

const ALL_STAKE_PATHS = [
  { key: 'SUPER',       u: '6u',   layer: 'A', label: 'HC-2 SUPER' },
  { key: 'TOP+',        u: '5u',   layer: 'A/C', label: 'HC-1 TOP+ ($ boost)' },
  { key: 'TOP',         u: '4u',   layer: 'A', label: 'HC-1 TOP' },
  { key: 'RANK',        u: '4u',   layer: 'B', label: 'RANK 2-for-0 rescue' },
  { key: 'SHARP-PRIME', u: '4u',   layer: 'C', label: 'SHARP-PRIME rescue (legacy)' },
  { key: 'SHARP',       u: '3u',   layer: 'C', label: 'SHARP EDGE/net BOTH' },
  { key: 'SHARP-LEAN',  u: '1.5u', layer: 'C', label: 'SHARP-LEAN EDGE/net ONE' },
  { key: 'MINI',        u: '3u',   layer: 'A', label: 'MINI (gate-pass)' },
  { key: 'MINI-',       u: '1u',   layer: 'C', label: 'MINI- (gate-cut)' },
  { key: 'CONFIRMED',   u: '1u',   layer: 'A', label: 'CONFIRMED margin3+' },
  { key: 'DISSENT',     u: '1u',   layer: 'D', label: 'DISSENT rescue' },
  { key: 'WINNER',      u: '3-6u', layer: 'E', label: 'WINNER (legacy EDGE)' },
];

/**
 * § 4 — Path & Modifier Board
 * Daily leaderboard of EVERY staking path + EVERY post-stack modifier
 * (tape mute/hold/boost/fail-open, fadeTop mute, score mute).
 */
function buildV12PathModifierBoard(report, stats) {
  report.push(`## § 4 — Path & Modifier Board`);
  report.push('');
  report.push(`> **Daily read.** Every lever that can put units on a ticket or change size after stacking. Paths A–D stamp the base; fadeTop / TAPE mute·hold·boost after. Ranked best → worst. Thin N stays listed so nothing hides.`);
  report.push('');

  if (!stats?.v12Rows?.length) {
    report.push(`_(no V12 rows yet)_`);
    report.push('');
    return;
  }

  const { v12Rows, v12RowsAll } = stats;
  const gradedStaked = v12Rows.filter(r =>
    r.hcStakeTier && r.hcStakeTier !== 'MONITORING' && r.won != null && (r.units || 0) > 0);
  const allGraded = (v12RowsAll || v12Rows).filter(r => r.won === 0 || r.won === 1);
  const maxDate = gradedStaked.map(r => r.date).sort().slice(-1)[0]
    || allGraded.map(r => r.date).sort().slice(-1)[0];
  const d7 = maxDate
    ? new Date(new Date(maxDate).getTime() - 7 * 86400000).toISOString().slice(0, 10)
    : null;
  const lastDay = maxDate;

  // ── Path rows (always all keys) ──────────────────────────────────────────
  const pathRows = ALL_STAKE_PATHS.map(p => {
    const all = gradedStaked.filter(r => r.hcStakeTier === p.key);
    const recent = d7 ? all.filter(r => r.date >= d7) : [];
    const day = lastDay ? all.filter(r => r.date === lastDay) : [];
    const book = leverBook(all);
    const r7 = leverBook(recent);
    const yd = leverBook(day);
    return { ...p, book, r7, yd, all };
  });

  // ── Modifier rows ────────────────────────────────────────────────────────
  const tapeEra = allGraded.filter(r => r.date >= SIDE_PROFILE_FROM);
  const modifiers = [
    {
      key: 'tape_BOOST',
      layer: 'TAPE',
      label: 'Tape BOOST (≥2.89 ×1.35)',
      mode: 'staked',
      rows: gradedStaked.filter(r => r.tapeAction === 'BOOST' && r.date >= SIDE_PROFILE_FROM),
      note: 'sized UP after path',
    },
    {
      key: 'tape_HOLD',
      layer: 'TAPE',
      label: 'Tape HOLD (mid)',
      mode: 'staked',
      rows: gradedStaked.filter(r => r.tapeAction === 'HOLD' && r.date >= SIDE_PROFILE_FROM),
      note: 'kept path units',
    },
    {
      key: 'tape_FAIL_OPEN',
      layer: 'TAPE',
      label: 'Tape FAIL_OPEN (missing)',
      mode: 'staked',
      rows: gradedStaked.filter(r => r.tapeAction === 'FAIL_OPEN' && r.date >= SIDE_PROFILE_FROM),
      note: 'no tape score → path size',
    },
    {
      key: 'tape_MUTE',
      layer: 'TAPE',
      label: 'Tape MUTE (tape<0 → 0u)',
      mode: 'flat1u',
      rows: tapeEra.filter(r =>
        r.tapeAction === 'MUTE' || r.mutedBy === 'tape-weak'),
      note: 'CF = flat 1u if shipped',
    },
    {
      key: 'fadeTop_MUTE',
      layer: 'E',
      label: 'fadeTop≥60 MUTE',
      mode: 'flat1u',
      rows: allGraded.filter(r =>
        r.mutedBy === 'winner_align_fade' || r.winnerAlignAction === 'mute'),
      note: 'CF = flat 1u if shipped',
    },
    {
      key: 'score_FADE',
      layer: 'score',
      label: 'Score FADE (≤0 → 0u)',
      mode: 'flat1u',
      rows: allGraded.filter(r =>
        (r.units || 0) === 0 && (r.agsV12 != null ? r.agsV12 <= 0 : r.tracked)),
      note: 'CF = flat 1u if shipped',
    },
  ].map(m => {
    const book = leverBook(m.rows, { mode: m.mode });
    const recent = d7 ? m.rows.filter(r => r.date >= d7) : [];
    const r7 = leverBook(recent, { mode: m.mode });
    const day = lastDay ? m.rows.filter(r => r.date === lastDay) : [];
    const yd = leverBook(day, { mode: m.mode });
    return { ...m, book, r7, yd };
  });

  // ── At a glance ──────────────────────────────────────────────────────────
  const rankablePaths = pathRows.filter(p => p.book.n >= 5 && p.book.roi != null)
    .sort((a, b) => b.book.roi - a.book.roi);
  // Staked mods: higher ROI = better. Mute CF: more negative ROI = better (saved $).
  const stakedMods = modifiers.filter(m => m.mode === 'staked' && m.book.n >= 3 && m.book.roi != null)
    .sort((a, b) => b.book.roi - a.book.roi);
  const muteMods = modifiers.filter(m => m.mode === 'flat1u' && m.book.n >= 3 && m.book.roi != null)
    .sort((a, b) => a.book.roi - b.book.roi); // most negative first = best mute

  report.push(`### At a glance — BEST / WORST`);
  report.push('');
  report.push(`_As of last graded day **${lastDay || '—'}**. Paths ≥5 graded · modifiers ≥3. Staked ROI: higher better. Mute CF: **more negative = better** (avoided losers)._`);
  report.push('');

  report.push(`#### Paths`);
  report.push('');
  if (!rankablePaths.length) {
    report.push(`_Need ≥5 graded on a path._`);
  } else {
    report.push(`| | Path | Layer | N | W-L | ROI | PnL | u/pick | 7d ROI |`);
    report.push(`|-:|------|-------|--:|:---:|----:|----:|-------:|-------:|`);
    const nShow = Math.min(3, Math.floor(rankablePaths.length / 2) || 1);
    const best = rankablePaths.slice(0, nShow);
    const worstKeys = new Set(best.map(p => p.key));
    const worst = [...rankablePaths].reverse().filter(p => !worstKeys.has(p.key)).slice(0, nShow);
    best.forEach((p, i) => {
      report.push(
        `| 🟢 ${i + 1} | ${p.label} | ${p.layer} | ${p.book.n} | ${p.book.w}-${p.book.l} | ${fmtSigned(p.book.roi, 1)}% | ${fmtSigned(p.book.pnl)}u | ${fmtSigned(p.book.avgPnl, 2)}u | ${p.r7.roi != null ? fmtSigned(p.r7.roi, 1) + '%' : '—'} |`,
      );
    });
    worst.forEach((p, i) => {
      report.push(
        `| 🔴 ${i + 1} | ${p.label} | ${p.layer} | ${p.book.n} | ${p.book.w}-${p.book.l} | ${fmtSigned(p.book.roi, 1)}% | ${fmtSigned(p.book.pnl)}u | ${fmtSigned(p.book.avgPnl, 2)}u | ${p.r7.roi != null ? fmtSigned(p.r7.roi, 1) + '%' : '—'} |`,
      );
    });
  }
  report.push('');

  report.push(`#### Modifiers — staked (HOLD / BOOST / FAIL_OPEN)`);
  report.push('');
  if (!stakedMods.length) {
    report.push(`_Need ≥3 graded tape stamps._`);
  } else {
    report.push(`| | Modifier | N | W-L | ROI | PnL | Note |`);
    report.push(`|-:|----------|--:|:---:|----:|----:|------|`);
    // Always show every staked modifier once, tagged best→worst by ROI.
    stakedMods.forEach((m, i) => {
      const tag = i === 0 ? '🟢 best' : i === stakedMods.length - 1 ? '🔴 worst' : `${i + 1}`;
      report.push(`| ${tag} | ${m.label} | ${m.book.n} | ${m.book.w}-${m.book.l} | ${fmtSigned(m.book.roi, 1)}% | ${fmtSigned(m.book.pnl)}u | ${m.note} |`);
    });
  }
  report.push('');

  report.push(`#### Modifiers — mutes (CF: did we dodge losers?)`);
  report.push('');
  if (!muteMods.length) {
    report.push(`_No graded mute stamps yet (or N&lt;3)._`);
  } else {
    report.push(`| | Modifier | N | W-L | CF ROI | CF PnL | Read |`);
    report.push(`|-:|----------|--:|:---:|-------:|-------:|------|`);
    muteMods.forEach((m, i) => {
      const good = m.book.roi < -3;
      const bad = m.book.roi > 3;
      const tag = good ? '🟢 saving $' : bad ? '🔴 costing $' : '🟡 flat';
      report.push(
        `| ${i + 1} | ${m.label} | ${m.book.n} | ${m.book.w}-${m.book.l} | ${fmtSigned(m.book.roi, 1)}% | ${fmtSigned(m.book.pnl)}u | ${tag} |`,
      );
    });
  }
  report.push('');

  // ── (A) All paths ────────────────────────────────────────────────────────
  report.push(`### (A) Every staking path`);
  report.push('');
  report.push(`| Path | Key | Layer | u | N | W-L | Win% | Stake | PnL | ROI | u/pick | 7d N | 7d ROI | Last day PnL | Verdict |`);
  report.push(`|------|-----|-------|--:|--:|:---:|-----:|------:|----:|----:|-------:|-----:|-------:|-------------:|---------|`);
  for (const p of pathRows) {
    const b = p.book;
    let verdict = '—';
    if (b.n === 0) verdict = 'pending';
    else if (b.n < 5) verdict = 'thin';
    else if (b.roi <= -15 && (p.u === '6u' || p.u === '5u' || p.u === '4u' || p.u === '3u')) verdict = '🔴 cut';
    else if (b.roi <= -8) verdict = '🟠 watch';
    else if (b.roi >= 15 && (p.u === '1u' || p.u === '3u')) verdict = '🟢 room';
    else if (b.roi >= 5) verdict = '🟢 OK';
    else verdict = '🟡 flat';
    // Flag 7d collapse
    if (b.n >= 5 && p.r7.n >= 3 && p.r7.roi != null && b.roi != null && p.r7.roi < b.roi - 20) {
      verdict = '🔻 cooling';
    }
    report.push(
      `| ${p.label} | \`${p.key}\` | ${p.layer} | ${p.u} | ${b.n} | ${b.n ? `${b.w}-${b.l}` : '—'} | ${b.winPct != null ? b.winPct.toFixed(1) + '%' : '—'} | ${b.stake.toFixed(1)}u | ${fmtSigned(b.pnl)}u | ${b.roi != null ? fmtSigned(b.roi, 1) + '%' : '—'} | ${b.avgPnl != null ? fmtSigned(b.avgPnl, 2) + 'u' : '—'} | ${p.r7.n} | ${p.r7.roi != null ? fmtSigned(p.r7.roi, 1) + '%' : '—'} | ${p.yd.n ? fmtSigned(p.yd.pnl) + 'u' : '—'} | ${verdict} |`,
    );
  }
  report.push('');

  // ── (B) All modifiers ────────────────────────────────────────────────────
  report.push(`### (B) Every post-stack modifier`);
  report.push('');
  report.push(`Mutes use **flat 1u CF** (what if we had shipped). Tape HOLD/BOOST/FAIL_OPEN use **real staked PnL**.`);
  report.push('');
  report.push(`| Modifier | Layer | Mode | N | W-L | Win% | Stake/CF | PnL | ROI | 7d N | 7d ROI | Last day |`);
  report.push(`|----------|-------|------|--:|:---:|-----:|---------:|----:|----:|-----:|-------:|---------:|`);
  for (const m of modifiers) {
    const b = m.book;
    report.push(
      `| ${m.label} | ${m.layer} | ${m.mode === 'flat1u' ? 'CF 1u' : 'staked'} | ${b.n} | ${b.n ? `${b.w}-${b.l}` : '—'} | ${b.winPct != null ? b.winPct.toFixed(1) + '%' : '—'} | ${b.stake.toFixed(1)}u | ${fmtSigned(b.pnl)}u | ${b.roi != null ? fmtSigned(b.roi, 1) + '%' : '—'} | ${m.r7.n} | ${m.r7.roi != null ? fmtSigned(m.r7.roi, 1) + '%' : '—'} | ${m.yd.n ? fmtSigned(m.yd.pnl) + 'u' : '—'} |`,
    );
  }
  report.push('');

  // ── (C) Path × Tape crosstab (tape era staked) ───────────────────────────
  report.push(`### (C) Path × Tape (staked · ${SIDE_PROFILE_FROM}+)`);
  report.push('');
  const tapeActs = ['HOLD', 'BOOST', 'FAIL_OPEN'];
  const eraStaked = gradedStaked.filter(r => r.date >= SIDE_PROFILE_FROM);
  report.push(`| Path | HOLD n/ROI | BOOST n/ROI | FAIL_OPEN n/ROI |`);
  report.push(`|------|------------|-------------|-----------------|`);
  for (const p of ALL_STAKE_PATHS) {
    const cells = tapeActs.map(act => {
      const rows = eraStaked.filter(r => r.hcStakeTier === p.key && r.tapeAction === act);
      const b = leverBook(rows);
      if (!b.n) return '—';
      return `${b.n} / ${b.roi != null ? fmtSigned(b.roi, 0) + '%' : '—'}`;
    });
    if (cells.every(c => c === '—')) continue;
    report.push(`| ${p.key} | ${cells[0]} | ${cells[1]} | ${cells[2]} |`);
  }
  report.push('');

  // ── (D) Last graded day movers ───────────────────────────────────────────
  report.push(`### (D) Last graded day movers (${lastDay || '—'})`);
  report.push('');
  const dayMovers = pathRows
    .filter(p => p.yd.n > 0)
    .sort((a, b) => b.yd.pnl - a.yd.pnl);
  if (!dayMovers.length) {
    report.push(`_No graded staked picks on ${lastDay || 'last day'}._`);
  } else {
    report.push(`| Path | N | W-L | PnL | ROI |`);
    report.push(`|------|--:|:---:|----:|----:|`);
    for (const p of dayMovers) {
      report.push(
        `| ${p.label} | ${p.yd.n} | ${p.yd.w}-${p.yd.l} | ${fmtSigned(p.yd.pnl)}u | ${p.yd.roi != null ? fmtSigned(p.yd.roi, 1) + '%' : '—'} |`,
      );
    }
  }
  report.push('');
  report.push(`_Rollups + trajectory charts below. Tape deep-dive: § 5._`);
  report.push('');
}

// § 4b — Display-tier rollups + trajectory (companion to Path & Modifier Board)
function buildV12TierAnalysis(report, stats) {
  report.push(`### Path rollups & trajectory`);
  report.push('');
  if (!stats || stats.v12Rows.length === 0) {
    report.push(`_(no graded V12-era picks yet)_`);
    report.push('');
    return;
  }
  const { v12Rows } = stats;
  const v121Rows = v12Rows.filter(r => r.hcStakeTier);
  if (v121Rows.length === 0) {
    report.push(`_(no HC/path-stamped picks yet)_`);
    report.push('');
    return;
  }
  {
    report.push(`Display tiers (UI buckets) — detail lives in **§ 4 Path & Modifier Board** above.`);
    report.push('');
    report.push(`| Tier (paths)              | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |`);
    report.push(`|---------------------------|-------|-----|--------|--------|-------------|------------|-----------|`);
    // Condensed to the 5 shared display tiers (AGS_V12_DISPLAY_TIERS) so the
    // report and the live Tier Performance UI bucket picks identically. Each
    // tier rolls up its internal staking paths (e.g. SHARP PLAY = RANK 2-for-0
    // + SHARP/SHARP-PRIME proven-$ rescues).
    const staked = { n: 0, w: 0, l: 0, stake: 0, profit: 0 };
    for (const dt of AGS_V12_DISPLAY_TIERS) {
      const stRows = v121Rows.filter(r => dt.paths.includes(r.hcStakeTier));
      const sagg = aggregate(stRows);
      if (sagg.n + sagg.trackedN === 0) continue;
      staked.n += sagg.n; staked.w += sagg.w; staked.l += sagg.l;
      staked.stake += sagg.totalStake; staked.profit += sagg.profit;
      const label = `${dt.label} (${dt.paths.join('/')})`;
      report.push(`| ${label.padEnd(25)} | ${dt.unitsLabel.padStart(5)} | ${String(sagg.n + sagg.trackedN).padStart(3)} | ${(sagg.w+'-'+sagg.l).padEnd(6)} | ${pct(sagg.w, sagg.n).padStart(6)} | ${sagg.totalStake.toFixed(2).padStart(11)} | ${fmtSigned(sagg.profit).padStart(10)} | ${(sagg.roi != null ? sagg.roi.toFixed(1)+'%' : '—').padStart(9)} |`);
    }
    const stakedRoi = staked.stake > 0 ? (staked.profit / staked.stake) * 100 : null;
    report.push(`| **STAKED TOTAL** | ${'—'.padStart(5)} | ${String(staked.n).padStart(3)} | ${(staked.w+'-'+staked.l).padEnd(6)} | ${pct(staked.w, staked.n).padStart(6)} | ${staked.stake.toFixed(2).padStart(11)} | ${fmtSigned(staked.profit).padStart(10)} | ${(stakedRoi != null ? (stakedRoi>=0?'+':'')+stakedRoi.toFixed(1)+'%' : '—').padStart(9)} |`);
    report.push('');

    // ── Granular — every individual staking path on its own ────────────────
    // The condensed table above is what users see (5 tiers); this breaks each
    // tier back into its component LEVERS so each path can be judged on its own
    // win-rate / ROI / stake. SHARP PLAY = RANK 2-for-0 + SHARP + SHARP+; TOP =
    // HC-1 + HC-1+$; LEAN = CONF + MINI-. Path labels match the per-pick tables.
    const PATHS = [
      { key: 'SUPER',       u: '6u', label: 'A · HC-2 (model max)' },
      { key: 'TOP+',        u: '5u', label: 'A/C · HC-1 + $-boost' },
      { key: 'TOP',         u: '4u', label: 'A · HC-1 (model)' },
      { key: 'RANK',        u: '4u', label: 'B · 2-for-0 rescue' },
      { key: 'SHARP-PRIME', u: '4u', label: 'C · proven-$ prime (legacy)' },
      { key: 'SHARP-LEAN',  u: '1.5u', label: 'C · EDGE/net ONE' },
      { key: 'SHARP',       u: '3u', label: 'C · proven-$ consensus' },
      { key: 'MINI',        u: '3u', label: 'A · mini-HC (gate-pass)' },
      { key: 'MINI-',       u: '1u', label: 'C · mini gate-cut' },
      { key: 'CONFIRMED',   u: '1u', label: 'A · margin 3+' },
      { key: 'DISSENT',     u: '1u', label: 'D · CM≤0 dissent' },
      { key: 'WINNER',      u: '3-6u', label: 'E · winner-align EDGE' },
    ];
    report.push(`#### Granular — by individual staking path`);
    report.push('');
    report.push(`| Path                  | Key         | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |`);
    report.push(`|-----------------------|-------------|-------|-----|--------|--------|-------------|------------|-----------|`);
    for (const p of PATHS) {
      const pr = aggregate(v121Rows.filter(r => r.hcStakeTier === p.key));
      // Show ALL levers (even 0-graded) so the full ladder is visible — the
      // v12abc overlay paths (TOP+/SHARP/SHARP+/MINI-) went live 2026-06-26
      // and read "pending" until their first picks grade.
      const tot = pr.n + pr.trackedN;
      const wl = tot === 0 ? 'pending' : `${pr.w}-${pr.l}`;
      report.push(`| ${p.label.padEnd(21)} | ${p.key.padEnd(11)} | ${p.u.padStart(5)} | ${String(tot).padStart(3)} | ${wl.padEnd(6)} | ${(tot===0?'—':pct(pr.w, pr.n)).padStart(6)} | ${pr.totalStake.toFixed(2).padStart(11)} | ${fmtSigned(pr.profit).padStart(10)} | ${(pr.roi != null ? pr.roi.toFixed(1)+'%' : '—').padStart(9)} |`);
    }
    report.push('');

    // Monitoring volume line — informational only (0u, excluded from staked).
    const monRows = v121Rows.filter(r => r.hcStakeTier === 'MONITORING');
    const monGraded = monRows.filter(r => r.won != null);
    const monW = monGraded.filter(r => r.won === 1).length;
    const monL = monGraded.filter(r => r.won === 0).length;
    report.push(`> **MONITORING volume:** ${monRows.length} picks tracked at 0u${monGraded.length ? ` (would-be ${monW}-${monL}, ${pct(monW, monGraded.length)} win)` : ''}. Shown to users for context; **not** part of the staked record, units, or ROI.`);
    report.push('');

    // ── § 5b — Path trajectory time-series (Mermaid line charts) ───────────
    // Per staking tier: cumulative PnL (u) and cumulative win% over the live
    // timeline, so each path can be monitored for trend (is it earning or
    // bleeding, and is its hit-rate holding?). Charts roll the granular paths
    // up into the 5 shared display tiers (same buckets as the table above) —
    // granular paths individually have too few graded picks to trend cleanly.
    const gradedTS = v121Rows.filter(r => r.won != null && r.hcStakeTier && r.hcStakeTier !== 'MONITORING' && r.date);
    const tsDates = [...new Set(gradedTS.map(r => r.date))].sort();
    if (tsDates.length >= 2) {
      const xLabels = '[' + tsDates.map(d => `"${d.slice(5)}"`).join(', ') + ']';
      report.push(`### Path trajectory (cum PnL & win%)`);
      report.push('');
      report.push(`One line per display tier. Down-sloping PnL = path over-staked for what it returns. Pair with § 4 board.`);
      report.push('');

      // Fixed palette so the emoji legend below reliably maps to each line.
      const PALETTE = ['#3b82f6', '#22c55e', '#f97316', '#ef4444', '#a855f7'];
      const SWATCH  = ['🔵', '🟢', '🟠', '🔴', '🟣'];

      // Build one carried-forward cumulative series per display tier.
      const series = [];
      for (const dt of AGS_V12_DISPLAY_TIERS) {
        const tierRows = gradedTS.filter(r => dt.paths.includes(r.hcStakeTier));
        const tierDays = new Set(tierRows.map(r => r.date));
        if (tierRows.length < 2 || tierDays.size < 2) continue;
        let cumPnl = 0, cw = 0, cl = 0;
        const pnlSeries = [], wrSeries = [];
        for (const d of tsDates) {
          for (const r of tierRows.filter(x => x.date === d)) {
            cumPnl += (r.profit || 0);
            if (r.won === 1) cw++; else if (r.won === 0) cl++;
          }
          pnlSeries.push(Number(cumPnl.toFixed(2)));
          wrSeries.push(cw + cl > 0 ? Math.round((cw / (cw + cl)) * 100) : 0);
        }
        series.push({ label: dt.label, paths: dt.paths, pnlSeries, wrSeries, cw, cl, cumPnl });
      }

      if (series.length === 0) {
        report.push(`_(no tier has ≥2 graded days yet — charts will appear as volume builds)_`);
        report.push('');
      } else {
        const palette = series.map((_, i) => PALETTE[i % PALETTE.length]).join(',');
        const initDirective = `%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "${palette}"}}}}%%`;

        // Legend (color key) — emoji order matches PALETTE order.
        report.push(`**Lines:** ${series.map((s, i) => `${SWATCH[i % SWATCH.length]} ${s.label} (${s.cw}-${s.cl}, ${fmtSigned(s.cumPnl)}u)`).join('  ·  ')}`);
        report.push('');

        // Chart 1 — cumulative PnL, one line per tier.
        const allPnl = series.flatMap(s => s.pnlSeries);
        const pMin = Math.min(0, ...allPnl), pMax = Math.max(0, ...allPnl);
        const pLo = Math.floor(pMin - Math.max(1, Math.abs(pMin) * 0.1));
        const pHi = Math.ceil(pMax + Math.max(1, Math.abs(pMax) * 0.1));
        report.push('```mermaid');
        report.push(initDirective);
        report.push('xychart-beta');
        report.push(`    title "Cumulative PnL by path (u)"`);
        report.push(`    x-axis ${xLabels}`);
        report.push(`    y-axis "PnL (u)" ${pLo} --> ${pHi}`);
        for (const s of series) report.push(`    line [${s.pnlSeries.join(', ')}]`);
        report.push('```');
        report.push('');

        // Chart 2 — cumulative win%, one line per tier.
        report.push('```mermaid');
        report.push(initDirective);
        report.push('xychart-beta');
        report.push(`    title "Cumulative win rate by path (%)"`);
        report.push(`    x-axis ${xLabels}`);
        report.push(`    y-axis "Win %" 0 --> 100`);
        for (const s of series) report.push(`    line [${s.wrSeries.join(', ')}]`);
        report.push('```');
        report.push('');
      }
    }
  }

}

// § 6 — V12 By Sport & Market
function buildV12SportMarketAnalysis(report, stats) {
  report.push(`## § 6 — Sport & Market`);
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

// § 7 — Stake calibration: are we over/under-sizing each path?
function buildV12StakeCalibration(report, stats) {
  report.push(`## § 7 — Stake Calibration`);
  report.push('');
  if (!stats || stats.v12Rows.length === 0) {
    report.push(`_(no graded V12-era picks yet)_`);
    report.push('');
    return;
  }
  // Only staked, graded picks (MONITORING is 0u and never staked).
  const staked = stats.v12Rows.filter(r =>
    r.hcStakeTier && r.hcStakeTier !== 'MONITORING' && r.won != null && (r.units || 0) > 0 && r.date);
  if (staked.length === 0) {
    report.push(`_(no graded staked picks under the v12abcd ladder yet)_`);
    report.push('');
    return;
  }
  report.push(`Each path ships at a **fixed unit size**. This section asks the sizing question directly: **for the units we're risking on each path, is the realized PnL justifying that size?** A path staked at 6u that loses money is far more dangerous than a 1u path with the same win-rate, because every loss costs 6× as much. The read is simple:`);
  report.push('');
  report.push(`- **Avg PnL / pick** is the single most important column — it's the average units won or lost *every time that path fires*, already accounting for both win-rate and stake size. Negative = that path is bleeding at its current size.`);
  report.push(`- **Recent vs all-time ROI** (last 7 days) is the over-time monitor: a path whose recent ROI is collapsing below its all-time ROI is degrading *now*, before the cumulative line in § 5b bends.`);
  report.push(`- **Verdict** flags paths to cut (over-sized + losing) or paths with room to grow (small size + strongly earning).`);
  report.push('');

  const PATHS = [
    { key: 'SUPER',       u: 6, label: 'HC-2 (model max)' },
    { key: 'TOP+',        u: 5, label: 'HC-1 + $-boost' },
    { key: 'TOP',         u: 4, label: 'HC-1 (model)' },
    { key: 'RANK',        u: 4, label: '2-for-0 rescue' },
    { key: 'SHARP-PRIME', u: 4, label: 'proven-$ prime' },
    { key: 'SHARP',       u: 3, label: 'proven-$ consensus' },
    { key: 'MINI',        u: 3, label: 'mini-HC (gate-pass)' },
    { key: 'MINI-',       u: 1, label: 'mini gate-cut' },
    { key: 'CONFIRMED',   u: 1, label: 'margin 3+' },
  ];

  // Recent window = picks dated within the last 7 calendar days of action.
  const maxDate = staked.map(r => r.date).sort().slice(-1)[0];
  const cutoff = new Date(new Date(maxDate).getTime() - 7 * 86400000).toISOString().slice(0, 10);

  report.push(`| Path                  | Units | N   | W-L    | Win %  | ROI       | PnL (u)    | Avg PnL/pick | Recent ROI (7d) | Verdict                 |`);
  report.push(`|-----------------------|-------|-----|--------|--------|-----------|------------|--------------|-----------------|-------------------------|`);
  const barLabels = [], barVals = [];
  for (const p of PATHS) {
    const rows = staked.filter(r => r.hcStakeTier === p.key);
    if (rows.length === 0) continue;
    const n = rows.length;
    const w = rows.filter(r => r.won === 1).length;
    const l = n - w;
    const stake = rows.reduce((s, r) => s + (r.units || 0), 0);
    const pnl = rows.reduce((s, r) => s + (r.profit || 0), 0);
    const roi = stake > 0 ? (pnl / stake) * 100 : null;
    const avgPnl = n > 0 ? pnl / n : null;
    const recentRows = rows.filter(r => r.date >= cutoff);
    const recentStake = recentRows.reduce((s, r) => s + (r.units || 0), 0);
    const recentPnl = recentRows.reduce((s, r) => s + (r.profit || 0), 0);
    const recentRoi = recentStake > 0 ? (recentPnl / recentStake) * 100 : null;
    // Sizing verdict.
    let verdict;
    if (n < 6) verdict = '⚪ thin — hold';
    else if (roi <= -15 && p.u >= 3) verdict = '🔴 over-sized — cut';
    else if (roi <= -8) verdict = '🟠 bleeding — watch';
    else if (roi >= 15 && p.u <= 3) verdict = '🟢 under-sized — room';
    else if (roi >= 5) verdict = '🟢 earning — size OK';
    else verdict = '🟡 ~break-even';
    report.push(`| ${p.label.padEnd(21)} | ${(p.u+'u').padStart(5)} | ${String(n).padStart(3)} | ${(w+'-'+l).padEnd(6)} | ${pct(w, n).padStart(6)} | ${(roi != null ? (roi>=0?'+':'')+roi.toFixed(1)+'%' : '—').padStart(9)} | ${fmtSigned(pnl).padStart(10)} | ${(avgPnl != null ? fmtSigned(avgPnl, 2)+'u' : '—').padStart(12)} | ${(recentRoi != null ? (recentRoi>=0?'+':'')+recentRoi.toFixed(1)+'%' : '—').padStart(15)} | ${verdict.padEnd(23)} |`);
    if (n >= 3 && avgPnl != null) { barLabels.push(p.key); barVals.push(Number(avgPnl.toFixed(2))); }
  }
  report.push('');

  // Bar chart — avg PnL/pick by path (the over/under-size signal at a glance).
  if (barLabels.length >= 2) {
    const lo = Math.floor(Math.min(0, ...barVals) - 0.5);
    const hi = Math.ceil(Math.max(0, ...barVals) + 0.5);
    report.push(`Avg PnL per pick by path — bars below 0 are paths losing money at their current stake:`);
    report.push('');
    report.push('```mermaid');
    report.push('xychart-beta');
    report.push(`    title "Avg PnL per pick by path (u, ≥3 graded)"`);
    report.push(`    x-axis [${barLabels.map(k => `"${k}"`).join(', ')}]`);
    report.push(`    y-axis "u / pick" ${lo} --> ${hi}`);
    report.push(`    bar [${barVals.join(', ')}]`);
    report.push('```');
    report.push('');
  }
  report.push(`> **Over-time view:** § 5b charts each tier's cumulative PnL and win% across the full timeline — use it to confirm whether a "bleeding" verdict here is a genuine downtrend or just a rough patch. A path that's over-sized **and** trending down in § 5b is the one to resize first.`);
  report.push('');
}

// § 8 — V12 Mute-rule effectiveness
function buildV12MuteAudit(report, stats) {
  report.push(`## § 7 — Mute Audit`);
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

// § 9 — v12abcd AUC / Brier by staking book
function buildV12abcDiscrimination(report, stats) {
  report.push(`## § 9 — v12abcde AUC / Brier (by staking book)`);
  report.push('');
  if (!stats || stats.v12Rows.length === 0) {
    report.push(`_(no graded V12-era picks yet)_`);
    report.push('');
    return;
  }
  const { v12Rows } = stats;
  report.push(`The score that drives every pick is the same V12 number; the **a / ab / abc / abcd / abcde** books differ only in *which picks they choose to stake*. This panel asks, for the picks each book actually ships: does the V12 score still **discriminate** winners from losers (AUC), and is it **calibrated** (Brier)? If a newer overlay (ab adds RANK; abc adds proven-\$; abcd adds Path D; abcde adds WINNER) drags AUC/Brier down, it's buying volume at the cost of signal quality.`);
  report.push('');
  report.push(`- **AUC** — P(score of a winner > score of a loser). 0.50 = coin flip · 0.55 = real edge · 0.60+ = strong.`);
  report.push(`- **Brier (cal)** — mean squared error of a win probability obtained by an **in-sample** logistic calibration of the score. Lower = better; 0.25 = the coin-flip prior.`);
  report.push(`- **Brier (market)** — same metric on the closing-odds implied probability, as a benchmark. **Δ = market − model**; positive means V12 is better-calibrated than the market.`);
  report.push('');

  // Book membership by staking path (MONITORING is never staked).
  const BOOK_A   = ['SUPER', 'TOP', 'TOP+', 'MINI', 'MINI-', 'CONFIRMED']; // HC-margin core (incl. its $-modifiers)
  const BOOK_RANK = ['RANK'];                                              // ab adds 2-for-0 rescue
  const BOOK_SHARP = ['SHARP', 'SHARP-LEAN', 'SHARP-PRIME'];              // abc Path C (+ legacy PRIME)
  const BOOK_D = ['DISSENT'];                                              // abcd adds Path D contribMargin rescue
  const BOOK_E = ['WINNER'];                                               // abcde adds winner-align EDGE rescue
  const books = [
    { key: 'v12a',     label: 'v12a (Path A · HC core)',       paths: BOOK_A },
    { key: 'v12ab',    label: 'v12ab (+ Path B RANK)',         paths: [...BOOK_A, ...BOOK_RANK] },
    { key: 'v12abc',   label: 'v12abc (+ Path C SHARP)',       paths: [...BOOK_A, ...BOOK_RANK, ...BOOK_SHARP] },
    { key: 'v12abcd',  label: 'v12abcd (+ Path D DISSENT)',    paths: [...BOOK_A, ...BOOK_RANK, ...BOOK_SHARP, ...BOOK_D] },
    { key: 'v12abcde', label: 'v12abcde (+ Path E WINNER)',    paths: [...BOOK_A, ...BOOK_RANK, ...BOOK_SHARP, ...BOOK_D, ...BOOK_E] },
  ];

  report.push(`| Book                         | Graded N | W-L    | Win %  | AUC    | Brier (cal) | Brier (market) | Δ vs market |`);
  report.push(`|------------------------------|----------|--------|--------|--------|-------------|----------------|-------------|`);
  const rowsByBook = {};
  for (const bk of books) {
    const br = v12Rows.filter(r =>
      r.hcStakeTier && bk.paths.includes(r.hcStakeTier) &&
      Number.isFinite(r.agsV12) && r.won != null);
    rowsByBook[bk.key] = br;
    if (br.length === 0) {
      report.push(`| ${bk.label.padEnd(28)} | ${'0'.padStart(8)} | ${'—'.padEnd(6)} | ${'—'.padStart(6)} | ${'—'.padStart(6)} | ${'—'.padStart(11)} | ${'—'.padStart(14)} | ${'—'.padStart(11)} |`);
      continue;
    }
    const scores = br.map(r => r.agsV12);
    const outs = br.map(r => r.won);
    const w = outs.filter(o => o === 1).length;
    const l = outs.length - w;
    const auc = rocAuc(scores, outs);
    const fit = logisticFit1D(scores, outs);
    const brierCal = fit ? brierScore(br.map(r => logisticProb(fit, r.agsV12)), outs) : null;
    const mktRows = br.filter(r => Number.isFinite(americanToImplied(r.lockOdds || r.peakOdds)));
    const brierMkt = mktRows.length
      ? brierScore(mktRows.map(r => americanToImplied(r.lockOdds || r.peakOdds)), mktRows.map(r => r.won))
      : null;
    const dMkt = (brierCal != null && brierMkt != null) ? brierMkt - brierCal : null;
    report.push(`| ${bk.label.padEnd(28)} | ${String(br.length).padStart(8)} | ${(w+'-'+l).padEnd(6)} | ${pct(w, br.length).padStart(6)} | ${fmtN(auc, 3).padStart(6)} | ${fmtN(brierCal, 4).padStart(11)} | ${fmtN(brierMkt, 4).padStart(14)} | ${(dMkt != null ? fmtSigned(dMkt, 4) : '—').padStart(11)} |`);
  }
  report.push('');

  // Narrative: did the overlays help or hurt discrimination?
  const aucOf = (key) => {
    const br = rowsByBook[key];
    return br && br.length >= 3 ? rocAuc(br.map(r => r.agsV12), br.map(r => r.won)) : null;
  };
  const aA = aucOf('v12a'), aAbcd = aucOf('v12abcd') ?? aucOf('v12abc');
  if (aA != null && aAbcd != null) {
    const d = aAbcd - aA;
    const tip = aucOf('v12abcd') != null ? 'v12abcd' : 'v12abc';
    if (d <= -0.02) {
      report.push(`> 🟡 **The overlays dilute discrimination** — AUC falls ${fmtN(aA,3)} (v12a) → ${fmtN(aAbcd,3)} (${tip}), Δ = ${fmtSigned(d,3)}. Rescue paths add volume on picks where the V12 score sorts winners less cleanly. Justified only if their standalone ROI (see § 5) pays for the lower signal quality.`);
    } else if (d >= 0.02) {
      report.push(`> 🟢 **The overlays improve discrimination** — AUC rises ${fmtN(aA,3)} (v12a) → ${fmtN(aAbcd,3)} (${tip}), Δ = ${fmtSigned(d,3)}. The rescue paths are landing on picks the score still ranks well.`);
    } else {
      report.push(`> 🟢 **The overlays are signal-neutral** — AUC ${fmtN(aA,3)} (v12a) → ${fmtN(aAbcd,3)} (${tip}), Δ = ${fmtSigned(d,3)}. They add volume without degrading how well the score separates winners from losers.`);
    }
    report.push('');
  }
  report.push(`> ⚠ **In-sample caveat.** Brier (cal) uses a logistic fit on the same picks it scores, so it's a mildly optimistic floor on true calibration error. AUC is rank-based and needs no fit. Track both week-over-week — a rising Brier or an AUC drifting toward 0.50 is the early warning that the score is decaying before ROI follows.`);
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
    report.push(`_(the cron isn't stamping per-side wallet-quality means yet — this section will populate once \`v8_agsV12ForMean\` / \`v8_agsV12AgMean\` are being written. Until then, all you can see is the final V12 score in § 12.)_`);
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

// ── § 5e — TAPE sizing impact (mute / hold / boost · live 2026-07-15+) ────
function pathUnitsGuess(r) {
  if (Number.isFinite(r.unitsPreTape) && r.unitsPreTape > 0) return r.unitsPreTape;
  const meta = AGS_V12_STAKE_TIER_META[r.hcStakeTier];
  return Number.isFinite(meta?.units) && meta.units > 0 ? meta.units : null;
}

function cfProfitAtUnits(won, odds, units) {
  if (won == null || !(units > 0)) return null;
  if (won === 1) {
    if (!Number.isFinite(odds) || odds === 0) return units; // flat 1u fallback
    return odds < 0 ? units * (100 / Math.abs(odds)) : units * (odds / 100);
  }
  return -units;
}

function tapeAgg(rows) {
  let n = 0, w = 0, l = 0, stake = 0, pnl = 0;
  for (const r of rows) {
    if (r.won == null) continue;
    n++;
    stake += r.units || 0;
    pnl += Number.isFinite(r.profit) ? r.profit : 0;
    if (r.won === 1) w++; else if (r.won === 0) l++;
  }
  return { n, w, l, stake, pnl, roi: stake > 0 ? (pnl / stake) * 100 : null };
}

function buildV12TapeSizing(report, stats) {
  report.push(`## § 5 — Tape Era (sizing + side profile · ${TAPE_SIZING_LIVE_FROM}+)`);
  report.push('');
  if (!stats) {
    report.push(`_(no V12-era picks yet.)_`);
    report.push('');
    return;
  }
  report.push(`### 5a — TAPE sizing impact`);
  report.push('');
  report.push(`From **${TAPE_SIZING_LIVE_FROM}**, path units are resized by **TAPE** = \`${TAPE_EDGE_WEIGHT}·(EDGE/10) + ${TAPE_NET_WEIGHT}·(netCLV/10)\`: mute if tape &lt; ${TAPE_MUTE_BELOW} · hold mid · boost if ≥ ${TAPE_BOOST_ABOVE} (×${TAPE_BOOST_MULT}, 6u cap). Missing tape = fail-open. See \`docs/TAPE_SIZING.md\`.`);
  report.push('');

  const era = (stats.v12RowsAll || stats.v12Rows || []).filter(r => isTapeSizingLive(r.date));
  const stamped = era.filter(r => r.tapeAction || Number.isFinite(r.tapeScore) || r.mutedBy === 'tape-weak');
  const graded = stamped.filter(r => r.won != null);
  report.push(`### Coverage`);
  report.push('');
  report.push(`| Window | Sides | With tape stamp | Graded w/ stamp |`);
  report.push(`|--------|------:|----------------:|----------------:|`);
  report.push(`| ≥ ${TAPE_SIZING_LIVE_FROM} | ${era.length} | ${stamped.length} | ${graded.length} |`);
  report.push('');
  if (stamped.length === 0) {
    report.push(`_No TAPE stamps yet in the live window — fills as the cron writes \`v8_tapeScore\` / \`v8_tapeAction\` / \`v8_unitsPreTape\`._`);
    report.push('');
    return;
  }

  // (A) By action — include 0u mutes (not just units>0 live book)
  report.push(`### (A) By tape action (stamped + graded)`);
  report.push('');
  if (graded.length === 0) {
    report.push(`_No graded tape-stamped picks yet in the live window — tables fill as ${TAPE_SIZING_LIVE_FROM}+ locks settle._`);
    report.push('');
  } else {
    report.push(`| Action | N | W-L | Win % | Stake | PnL (u) | ROI |`);
    report.push(`|--------|--:|:---:|------:|------:|--------:|----:|`);
    const ACTIONS = ['MUTE', 'HOLD', 'BOOST', 'FAIL_OPEN', 'PASS'];
    for (const act of ACTIONS) {
      const rows = graded.filter(r => (r.tapeAction || (r.mutedBy === 'tape-weak' ? 'MUTE' : null)) === act);
      if (!rows.length) continue;
      const a = tapeAgg(rows);
      report.push(
        `| ${act.padEnd(9)} | ${a.n} | ${a.w}-${a.l} | ${a.n ? ((100 * a.w / a.n).toFixed(1) + '%') : '—'} | ${a.stake.toFixed(2)}u | ${fmtSigned(a.pnl)}u | ${a.roi != null ? ((a.roi >= 0 ? '+' : '') + a.roi.toFixed(1) + '%') : '—'} |`,
      );
    }
    report.push('');
  }

  // (B) Score ladder
  report.push(`### (B) Tape score ladder (graded, score present)`);
  report.push('');
  report.push(`| Tape bucket | Rule | N | W-L | Win % | Staked PnL |`);
  report.push(`|-------------|------|--:|:---:|------:|-----------:|`);
  const buckets = [
    { key: `mute (<${TAPE_MUTE_BELOW})`, test: (t) => t < TAPE_MUTE_BELOW },
    { key: `hold (${TAPE_MUTE_BELOW}–${TAPE_BOOST_ABOVE})`, test: (t) => t >= TAPE_MUTE_BELOW && t < TAPE_BOOST_ABOVE },
    { key: `boost (≥${TAPE_BOOST_ABOVE})`, test: (t) => t >= TAPE_BOOST_ABOVE },
  ];
  const withScore = graded.filter(r => Number.isFinite(r.tapeScore));
  for (const b of buckets) {
    const rows = withScore.filter(r => b.test(r.tapeScore));
    const a = tapeAgg(rows);
    report.push(
      `| ${b.key} | ${b.key.startsWith('mute') ? '→ 0u' : b.key.startsWith('boost') ? `×${TAPE_BOOST_MULT}` : 'path u'} | ${a.n} | ${a.w}-${a.l} | ${a.n ? ((100 * a.w / a.n).toFixed(1) + '%') : '—'} | ${fmtSigned(a.pnl)}u |`,
    );
  }
  report.push('');
  report.push(`_Score coverage: **${withScore.length}/${graded.length}** graded stamped rows have \`v8_tapeScore\`._`);
  report.push('');

  // (C) Counterfactual impact
  report.push(`### (C) Counterfactual impact vs path units`);
  report.push('');
  report.push(`> **Mute CF:** path units that tape zeroed — if those had shipped, what PnL? Positive Δ = tape saved money (avoided losses). **Boost CF:** actual PnL − PnL at path size (pre-boost). Positive Δ = boost added value.`);
  report.push('');

  const mutes = graded.filter(r =>
    r.tapeAction === 'MUTE' || r.mutedBy === 'tape-weak',
  );
  let muteCf = 0, muteN = 0, muteSaved = 0, muteMissed = 0;
  for (const r of mutes) {
    const pu = pathUnitsGuess(r);
    if (!(pu > 0) || r.won == null) continue;
    const would = cfProfitAtUnits(r.won, r.peakOdds || r.lockOdds, pu);
    if (would == null) continue;
    muteN++;
    muteCf += -would; // actual 0 − would
    if (would < 0) muteSaved += -would;
    else muteMissed += would;
  }
  report.push(`| Mute CF | N | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |`);
  report.push(`|---------|--:|------------------------:|-----------------:|---------------:|------------:|`);
  report.push(
    `| tape-weak → 0u | ${muteN} | ${fmtSigned(-muteCf)}u | ${fmtSigned(muteCf)}u | ${fmtSigned(muteSaved)}u | ${fmtSigned(muteMissed)}u |`,
  );
  report.push('');

  const boosts = graded.filter(r => r.tapeAction === 'BOOST' && (r.units || 0) > 0 && r.won != null);
  let boostN = 0, boostAct = 0, boostPath = 0;
  for (const r of boosts) {
    const pu = pathUnitsGuess(r)
      || (Number.isFinite(r.units) ? r.units / TAPE_BOOST_MULT : null);
    if (!(pu > 0)) continue;
    const pathP = cfProfitAtUnits(r.won, r.peakOdds || r.lockOdds, pu);
    const actP = Number.isFinite(r.profit) ? r.profit : cfProfitAtUnits(r.won, r.peakOdds || r.lockOdds, r.units);
    if (pathP == null || actP == null) continue;
    boostN++;
    boostAct += actP;
    boostPath += pathP;
  }
  report.push(`| Boost CF | N | PnL @ path u | PnL @ boosted | Δ (boost value) |`);
  report.push(`|----------|--:|-------------:|--------------:|----------------:|`);
  report.push(
    `| tape ≥ ${TAPE_BOOST_ABOVE} ×${TAPE_BOOST_MULT} | ${boostN} | ${fmtSigned(boostPath)}u | ${fmtSigned(boostAct)}u | ${fmtSigned(boostAct - boostPath)}u |`,
  );
  report.push('');
  report.push(`> Path units for CF prefer stamped \`v8_unitsPreTape\`; else ladder default for \`v8_hcStakeTier\`. Early tape-era picks may lack \`unitsPreTape\` until the next cron cycle backfills.`);
  report.push('');

  // Recent mutes/boosts list
  const notable = stamped
    .filter(r => r.tapeAction === 'MUTE' || r.tapeAction === 'BOOST' || r.mutedBy === 'tape-weak')
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    .slice(0, 15);
  if (notable.length) {
    report.push(`### (D) Recent mute / boost events`);
    report.push('');
    report.push(`| Date | Sport | Pick | Path | Tape | Act | Pre-u | Final | Outcome |`);
    report.push(`|------|-------|------|------|-----:|-----|------:|------:|---------|`);
    for (const r of notable) {
      const pre = pathUnitsGuess(r);
      const act = r.tapeAction || (r.mutedBy === 'tape-weak' ? 'MUTE' : '—');
      const out = r.won === 1 ? 'WIN' : r.won === 0 ? 'LOSS' : '—';
      report.push(
        `| ${r.date} | ${r.sport || ''} | ${(r.team || r.sideKey || '').substring(0, 22)} | ${pathShort(r.hcStakeTier)} | ${Number.isFinite(r.tapeScore) ? r.tapeScore.toFixed(2) : '—'} | ${act} | ${pre != null ? pre.toFixed(2) + 'u' : '—'} | ${((r.units || 0).toFixed(2))}u | ${out} |`,
      );
    }
    report.push('');
  }
}

// § 5b / § 9 helpers — side profile (depth + quality) for WIN vs LOSS analysis
function meanFinite(vals) {
  const xs = vals.filter(Number.isFinite);
  if (!xs.length) return null;
  return xs.reduce((s, x) => s + x, 0) / xs.length;
}

function medianFinite(vals) {
  const xs = vals.filter(Number.isFinite).sort((a, b) => a - b);
  if (!xs.length) return null;
  const mid = Math.floor(xs.length / 2);
  return xs.length % 2 ? xs[mid] : (xs[mid - 1] + xs[mid]) / 2;
}

/** Raw sharp depth from frozen walletDetails (FOR / AGAINST). */
function sharpDepthFromWd(r) {
  const wd = Array.isArray(r.walletDetails) ? r.walletDetails : [];
  if (!wd.length || !r.sideKey) return { sharpFor: null, sharpAg: null };
  let sharpFor = 0;
  let sharpAg = 0;
  const seen = new Set();
  for (const w of wd) {
    const short = String(w.wallet || w.walletShort || '').slice(-6).toLowerCase();
    if (!short || seen.has(short)) continue;
    seen.add(short);
    if (w.side === r.sideKey) sharpFor++;
    else if (w.side) sharpAg++;
  }
  return { sharpFor, sharpAg };
}

/** Enrich a live row with derived side-profile fields used in §5f. */
function enrichSideProfileRow(r) {
  const { sharpFor, sharpAg } = sharpDepthFromWd(r);
  const provenFor = Number.isFinite(r.provenFor) ? r.provenFor : null;
  const provenAg = Number.isFinite(r.provenAg) ? r.provenAg : null;
  return {
    ...r,
    sharpFor,
    sharpAg,
    sharpMargin: sharpFor != null && sharpAg != null ? sharpFor - sharpAg : null,
    provenFor,
    provenAg,
    provenMargin: provenFor != null && provenAg != null ? provenFor - provenAg : null,
    v12ForN: Number.isFinite(r.agsV12ForCount) ? r.agsV12ForCount : null,
    v12AgN: Number.isFinite(r.agsV12AgCount) ? r.agsV12AgCount : null,
    waForN: Number.isFinite(r.winnerAlignForN) ? r.winnerAlignForN : null,
    waAgN: Number.isFinite(r.winnerAlignAgN) ? r.winnerAlignAgN : null,
    clvForN: Number.isFinite(r.netClvNFor) ? r.netClvNFor : null,
    clvAgN: Number.isFinite(r.netClvNAg) ? r.netClvNAg : null,
    forWr: Number.isFinite(r.winnerAlignMeanFor) ? r.winnerAlignMeanFor : null,
    agWr: Number.isFinite(r.winnerAlignMeanAg) ? r.winnerAlignMeanAg : null,
    topFor: Number.isFinite(r.winnerAlignTopFor) ? r.winnerAlignTopFor : null,
    topAg: Number.isFinite(r.winnerAlignTopAg) ? r.winnerAlignTopAg : null,
    edge: Number.isFinite(r.winnerAlignEdge) ? r.winnerAlignEdge : null,
    forClv: Number.isFinite(r.netClvMeanFor) ? r.netClvMeanFor : null,
    agClv: Number.isFinite(r.netClvMeanAg) ? r.netClvMeanAg : null,
    netClv: Number.isFinite(r.netMeanPrior) ? r.netMeanPrior : null,
    tape: Number.isFinite(r.tapeScore) ? r.tapeScore : null,
    v12Score: Number.isFinite(r.agsV12) ? r.agsV12 : null,
    v12ForMean: Number.isFinite(r.agsV12ForMean) ? r.agsV12ForMean : null,
    v12AgMean: Number.isFinite(r.agsV12AgMean) ? r.agsV12AgMean : null,
    unopposed: sharpAg != null ? (sharpAg === 0 ? 1 : 0) : null,
    hasBothWa: r.winnerAlignHasBoth === true ? 1 : (r.winnerAlignHasBoth === false ? 0 : null),
  };
}

const SIDE_PROFILE_METRICS = [
  { key: 'sharpFor', label: '#F sharps', family: 'depth', higherHelps: true },
  { key: 'sharpAg', label: '#A sharps', family: 'depth', higherHelps: false },
  { key: 'sharpMargin', label: '#F − #A', family: 'depth', higherHelps: true },
  { key: 'provenFor', label: 'proven F', family: 'depth', higherHelps: true },
  { key: 'provenAg', label: 'proven A', family: 'depth', higherHelps: false },
  { key: 'provenMargin', label: 'proven F−A', family: 'depth', higherHelps: true },
  { key: 'v12ForN', label: 'v12 F count', family: 'depth', higherHelps: true },
  { key: 'v12AgN', label: 'v12 A count', family: 'depth', higherHelps: false },
  { key: 'waForN', label: 'WA ForN', family: 'depth', higherHelps: true },
  { key: 'waAgN', label: 'WA AgN', family: 'depth', higherHelps: false },
  { key: 'clvForN', label: 'CLV ForN', family: 'depth', higherHelps: true },
  { key: 'clvAgN', label: 'CLV AgN', family: 'depth', higherHelps: false },
  { key: 'unopposed', label: 'unopposed (A=0)', family: 'depth', higherHelps: null },
  { key: 'forWr', label: 'ForWR', family: 'quality', higherHelps: true },
  { key: 'agWr', label: 'AgWR', family: 'quality', higherHelps: false },
  { key: 'topFor', label: 'TopFor WR', family: 'quality', higherHelps: true },
  { key: 'topAg', label: 'TopAg WR', family: 'quality', higherHelps: false },
  { key: 'edge', label: 'EDGE', family: 'quality', higherHelps: true },
  { key: 'forClv', label: 'ForCLV', family: 'quality', higherHelps: true },
  { key: 'agClv', label: 'AgCLV', family: 'quality', higherHelps: false },
  { key: 'netClv', label: 'netCLV', family: 'quality', higherHelps: true },
  { key: 'tape', label: 'Tape', family: 'quality', higherHelps: true },
  { key: 'v12Score', label: 'V12 score', family: 'quality', higherHelps: true },
  { key: 'v12ForMean', label: 'V12 forMean', family: 'quality', higherHelps: true },
  { key: 'v12AgMean', label: 'V12 agMean', family: 'quality', higherHelps: false },
];

/**
 * § 5f — Side Profile Analysis (tape era · SIDE_PROFILE_FROM+)
 * Track depth + quality on every shipped side; compare WIN vs LOSS means
 * to find which underlying metrics separate winners from losers.
 */
function buildV12SideProfileAnalysis(report, stats) {
  report.push(`### 5c — Side profile (WIN vs LOSS)`);
  report.push('');
  report.push(`From **${SIDE_PROFILE_FROM}** we stamp depth + quality on every shipped side. Compare means on **WIN vs LOSS**. Separators are gate/sizing candidates; flat metrics are noise. N is still early — treat ranks as hypotheses.`);
  report.push('');

  if (!stats?.liveRows?.length) {
    report.push(`_(no live V12 picks yet)_`);
    report.push('');
    return;
  }

  const era = stats.liveRows
    .filter(r => r.date >= SIDE_PROFILE_FROM && (r.won === 1 || r.won === 0))
    .map(enrichSideProfileRow);
  const wins = era.filter(r => r.won === 1);
  const losses = era.filter(r => r.won === 0);
  const wAgg = aggregate(era);

  report.push(`### Coverage`);
  report.push('');
  report.push(`| Window | Graded live | W-L | Win % | Stake | PnL |`);
  report.push(`|--------|------------:|:---:|------:|------:|----:|`);
  report.push(
    `| ≥ ${SIDE_PROFILE_FROM} | ${era.length} | ${wAgg.w}-${wAgg.l} | ${era.length ? ((100 * wAgg.w / era.length).toFixed(1) + '%') : '—'} | ${wAgg.totalStake.toFixed(2)}u | ${fmtSigned(wAgg.profit)}u |`,
  );
  report.push('');

  if (era.length < 5) {
    report.push(`_Need ≥5 graded live picks in the ${SIDE_PROFILE_FROM}+ window — tables fill as tape-era locks settle._`);
    report.push('');
    return;
  }

  // Per-metric WIN vs LOSS means + separation
  const rows = [];
  for (const m of SIDE_PROFILE_METRICS) {
    const wVals = wins.map(r => r[m.key]).filter(Number.isFinite);
    const lVals = losses.map(r => r[m.key]).filter(Number.isFinite);
    const allPairs = era
      .map(r => ({ x: r[m.key], y: r.won }))
      .filter(p => Number.isFinite(p.x) && (p.y === 0 || p.y === 1));
    const cov = allPairs.length;
    if (cov < 3) {
      rows.push({
        ...m, cov, covPct: era.length ? cov / era.length : 0,
        meanW: meanFinite(wVals), meanL: meanFinite(lVals),
        medW: medianFinite(wVals), medL: medianFinite(lVals),
        delta: null, auc: null, rho: null, pb: null, sep: 0,
      });
      continue;
    }
    const meanW = meanFinite(wVals);
    const meanL = meanFinite(lVals);
    const delta = meanW != null && meanL != null ? meanW - meanL : null;
    const xs = allPairs.map(p => p.x);
    const ys = allPairs.map(p => p.y);
    const auc = rocAuc(xs, ys);
    const rho = spearman(xs, ys);
    const pb = pointBiserial(xs, ys);
    const sep = auc != null ? Math.abs(auc - 0.5) : 0;
    rows.push({
      ...m, cov, covPct: cov / era.length,
      meanW, meanL, medW: medianFinite(wVals), medL: medianFinite(lVals),
      delta, auc, rho, pb, sep,
    });
  }

  report.push(`### (A) Metric means — WIN side vs LOSS side`);
  report.push('');
  report.push(`Δ = mean(WIN) − mean(LOSS). Positive Δ on a “higher helps” metric = winners look stronger on that axis.`);
  report.push('');
  report.push(`| Family | Metric | Cov | mean WIN | mean LOSS | Δ (W−L) | med WIN | med LOSS |`);
  report.push(`|--------|--------|----:|---------:|----------:|--------:|--------:|---------:|`);
  for (const r of rows) {
    if (r.cov < 3) continue;
    report.push(
      `| ${r.family.padEnd(7)} | ${r.label.padEnd(16)} | ${r.cov}/${era.length} | ${r.meanW != null ? r.meanW.toFixed(2) : '—'} | ${r.meanL != null ? r.meanL.toFixed(2) : '—'} | ${r.delta != null ? fmtSigned(r.delta, 2) : '—'} | ${r.medW != null ? r.medW.toFixed(2) : '—'} | ${r.medL != null ? r.medL.toFixed(2) : '—'} |`,
    );
  }
  report.push('');

  report.push(`### (B) Separation rank — which metrics tell W from L`);
  report.push('');
  report.push(`AUC: chance a random WIN scores higher than a random LOSS on that metric (0.50 = coin flip). Sorted by |AUC−0.5|. ρ / r_pb = Spearman / point-biserial vs won.`);
  report.push('');
  const ranked = rows.filter(r => r.cov >= 5 && r.auc != null).sort((a, b) => b.sep - a.sep);
  if (!ranked.length) {
    report.push(`_Not enough coverage yet for separation ranks._`);
  } else {
    report.push(`| Rank | Metric | Family | Cov | AUC | ρ | r_pb | Δ (W−L) | Read |`);
    report.push(`|-----:|--------|--------|----:|----:|--:|-----:|--------:|------|`);
    ranked.forEach((r, i) => {
      let read = 'flat';
      if (r.sep >= 0.04) {
        const winHigher = r.auc >= 0.5;
        const expected = r.higherHelps == null
          ? null
          : (r.higherHelps ? winHigher : !winHigher);
        if (r.sep >= 0.08) {
          read = expected == null
            ? (winHigher ? 'WIN higher' : 'LOSS higher')
            : (expected ? '🟢 sep OK' : '🔴 inverted');
        } else {
          read = expected == null
            ? (winHigher ? 'mild WIN↑' : 'mild LOSS↑')
            : (expected ? '🟡 mild OK' : '🟡 mild inv');
        }
      }
      report.push(
        `| ${String(i + 1).padStart(4)} | ${r.label.padEnd(16)} | ${r.family.padEnd(7)} | ${r.cov}/${era.length} | ${r.auc.toFixed(3)} | ${r.rho != null ? fmtSigned(r.rho, 3) : '—'} | ${r.pb != null ? fmtSigned(r.pb, 3) : '—'} | ${r.delta != null ? fmtSigned(r.delta, 2) : '—'} | ${read} |`,
      );
    });
  }
  report.push('');

  // Headline: separators that move in the expected direction (or unopposed)
  const strong = ranked.filter(r => {
    if (r.sep < 0.04 || r.covPct < 0.5) return false;
    if (r.higherHelps == null) return true;
    const winHigher = r.auc >= 0.5;
    return r.higherHelps ? winHigher : !winHigher;
  });
  report.push(`### (C) Working read`);
  report.push('');
  report.push(`_N=${era.length} is still early — treat ranks as hypotheses, not gates._`);
  report.push('');
  if (!strong.length) {
    report.push(`_No metric yet clears mild separation (|AUC−0.5| ≥ 0.04) in the expected direction at ≥50% coverage._`);
  } else {
    for (const r of strong.slice(0, 8)) {
      const dir = r.auc >= 0.5 ? 'higher on WINs' : 'higher on LOSSes';
      report.push(
        `- **${r.label}** — AUC ${r.auc.toFixed(3)} · Δ ${r.delta != null ? fmtSigned(r.delta, 2) : '—'} · ${dir} (cov ${r.cov}/${era.length})`,
      );
    }
  }
  report.push('');
  report.push(`_Stamped / derived only — no wallet profile replay. Unopposed sides keep FOR quality (EDGE uses AG prior ${EDGE_PRIOR_AG_WR}). Audit trail rows: § 11._`);
  report.push('');
}

function buildV12RecentLivePicks(report, stats, n = 30, walletProfiles = null) {
  report.push(`## § 8 — Recent Live Picks (Audit Trail)`);
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
  report.push(`The last ${recent.length} picks V12 actually shipped (units > 0). Audit trail keeps **quality + depth** on every row (unopposed included) so WIN vs LOSS sides can be profiled.`);
  report.push('');
  report.push(`> **Depth:** \`#F/#A\` = unique sharps FOR/AGAINST from frozen \`walletDetails\` · \`pF/pA\` = proven (HC_BASE) counts. **Quality:** ForWR / ForCLV / EDGE / Tape (AG blanks use priors; live \`TapeAct\` stays what the sizer did).`);
  report.push('');
  // Stamped quality + depth — no wallet profile-replay (lookahead).
  report.push(`| Date       | Sport | Mkt    | Pick                    | Odds  | V12   | Path     | #F/#A | pF/pA | ForWR | ForCLV | EDGE   | Tape  | TapeAct  | Stake | Outcome | PnL (u)    |`);
  report.push(`|------------|-------|--------|-------------------------|-------|-------|----------|------:|------:|------:|-------:|--------|------:|----------|------:|---------|------------|`);
  for (const r of recent) {
    const teamLabel = `${r.team || r.sideKey || ''}`.substring(0, 23);
    const oddsStr = r.peakOdds > 0 ? `+${r.peakOdds}` : `${r.peakOdds}`;
    const outcome = r.won === 1 ? 'WIN' : r.won === 0 ? 'LOSS' : '—';
    const { sharpFor, sharpAg } = sharpDepthFromWd(r);
    const depthStr = sharpFor != null ? `${sharpFor}/${sharpAg}` : '—';
    const provenStr = (r.provenFor != null || r.provenAg != null)
      ? `${r.provenFor ?? 0}/${r.provenAg ?? 0}`
      : '—';
    const forWrStr = Number.isFinite(r.winnerAlignMeanFor) ? r.winnerAlignMeanFor.toFixed(1) : '—';
    const forClvStr = Number.isFinite(r.netClvMeanFor) ? r.netClvMeanFor.toFixed(1) : '—';
    const edgeStr = Number.isFinite(r.winnerAlignEdge) ? fmtSigned(r.winnerAlignEdge, 1) : '—';
    const tapeStr = Number.isFinite(r.tapeScore) ? r.tapeScore.toFixed(2) : '—';
    const tapeAct = r.tapeAction || (r.mutedBy === 'tape-weak' ? 'MUTE' : '—');
    report.push(
      `| ${r.date.padEnd(10)} | ${(r.sport || '').padEnd(5)} | ${(r.marketType || '').padEnd(6)} | ${teamLabel.padEnd(23)} | ${oddsStr.padStart(5)} | ${(Number.isFinite(r.agsV12) ? fmtSigned(r.agsV12, 3) : '—').padStart(5)} | ${pathShort(r.hcStakeTier).padEnd(8)} | ${depthStr.padStart(5)} | ${provenStr.padStart(5)} | ${forWrStr.padStart(5)} | ${forClvStr.padStart(6)} | ${edgeStr.padStart(6)} | ${tapeStr.padStart(5)} | ${tapeAct.padEnd(8)} | ${((r.units||0).toFixed(2)+'u').padStart(5)} | ${outcome.padEnd(7)} | ${fmtSigned(r.profit).padStart(10)} |`
    );
  }
  report.push('');

  report.push(`> Full WIN vs LOSS means + separation ranks: **§ 5b**.`);
  report.push('');
}

// ── § 12 — V12 Statistical Monitor (predictive-power diagnostics) ──────
//
// Quantitative health check on the V12 score. Everything in this section
// answers ONE question: "How well does our score actually predict the
// thing we want to predict?" If V12's number is meaningful, you should
// see strong discrimination (AUC > 0.55), meaningful rank correlation
// with PnL, and stable AUC week-over-week. If the metrics decay, V12 is
// losing its edge before the ROI numbers in § 1 visibly cross zero.
//
// Sub-sections:
//   A. Discrimination — AUC, KS, Spearman, point-biserial
//   B. Predictive R² — score vs unit-return regression
//   C. Per-feature correlation — V12 inputs (forMean/agMean/counts/proven)
//   D. Score distribution moments
//   E. Per-sport discrimination
//   F. Stability — rolling 7-day AUC across the V12 window
//   G. Bootstrap 95% CI on overall V12 ROI
function buildV12StatisticalMonitor(report, stats) {
  report.push(`## § 9 — Predictive Health`);
  report.push('');
  report.push(`Does the V12 score separate winners from losers (not just make money by luck)? Watch **AUC**: 0.50 = coin flip · 0.55 = usable · 0.60+ = strong. Rolling AUC below 0.50 = score is dying before ROI does.`);
  report.push('');
  if (!stats || stats.liveRows.length < 10) {
    report.push(`_(need at least 10 graded V12 live picks for the stat tests; currently have ${stats?.liveRows.length ?? 0}.)_`);
    report.push('');
    return;
  }

  const live = stats.liveRows.filter(r => Number.isFinite(r.agsV12) && r.won != null);
  const scores = live.map(r => r.agsV12);
  const wins = live.map(r => r.won);
  const units = live.map(r => r.units || 0);
  const unitReturns = live.map(r => (r.units > 0 ? r.profit / r.units : 0));
  const profits = live.map(r => r.profit);

  // ────────────────────────────────────────────────────────────────────
  // 12A — Discrimination metrics
  // ────────────────────────────────────────────────────────────────────
  const auc = rocAuc(scores, wins);
  const spearmanScoreWon = spearman(scores, wins);
  const spearmanScorePnl = spearman(scores, unitReturns);
  const pb = pointBiserial(scores, wins);
  const scoresWin = scores.filter((_, i) => wins[i] === 1);
  const scoresLoss = scores.filter((_, i) => wins[i] === 0);
  const ks = ksStat(scoresWin, scoresLoss);

  report.push(`### 12A — Discrimination: does V12 actually separate winners from losers?`);
  report.push('');
  report.push(`Five lenses on **one** question: *do higher scores go with wins?* They're independent on purpose — AUC and KS look at the **ranking** (do winners sit higher than losers regardless of scale), while the correlations (Spearman / point-biserial) look at the **strength and consistency** of that relationship. When they all agree, the signal is trustworthy; when they disagree, the edge is fragile. All computed over **live shipped picks** (units > 0) with a graded outcome.`);
  report.push('');
  report.push(`| Metric                                | Value    | Plain-English read                                                                 |`);
  report.push(`|---------------------------------------|----------|------------------------------------------------------------------------------------|`);
  report.push(`| AUC (ROC)                             | ${fmtN(auc, 3).padStart(8)} | 0.50 = coin flip · 0.55 = real edge · 0.60+ = strong · _interpret as P(score(win) > score(loss))_ |`);
  report.push(`| KS statistic                          | ${fmtN(ks, 3).padStart(8)} | Max gap between win-score CDF and loss-score CDF. 0.15+ ⇒ meaningful separation     |`);
  report.push(`| Spearman ρ(score, won)                | ${fmtSigned(spearmanScoreWon, 3).padStart(8)} | Rank-correlation of score and binary outcome. Above 0.10 = useful signal           |`);
  report.push(`| Spearman ρ(score, unit-return)        | ${fmtSigned(spearmanScorePnl, 3).padStart(8)} | Higher score should mean higher per-unit return. Above 0.10 = useful signal        |`);
  report.push(`| Point-biserial r(score, won)          | ${fmtSigned(pb, 3).padStart(8)} | Parametric cousin of Spearman ρ. Above 0.10 = useful signal                        |`);
  report.push('');
  const aucVerdict = auc == null ? '—'
    : auc >= 0.60 ? '🟢 **Strong** — score is genuinely sorting outcomes'
    : auc >= 0.55 ? '🟢 **Modest but real** — score has measurable edge'
    : auc >= 0.52 ? '🟡 **Weak** — barely separating; close to a coin flip'
    : auc >= 0.48 ? '🟠 **Random** — score is not predicting outcomes; PnL is variance, not edge'
    : '🔴 **Anti-signal** — V12 is sorting in the WRONG direction. Investigate immediately.';
  report.push(`> **AUC verdict:** ${aucVerdict}`);
  report.push('');

  // ────────────────────────────────────────────────────────────────────
  // 12B — Predictive R² (score → per-pick unit return)
  // ────────────────────────────────────────────────────────────────────
  const regUnitReturn = linRegR2(scores, unitReturns);
  const regWon = linRegR2(scores, wins);
  const regProfit = linRegR2(scores, profits);
  report.push(`### 12B — Predictive R² (regression of outcome on V12 score)`);
  report.push('');
  report.push(`How much of the variance in actual outcomes does the V12 score actually explain? R² is the canonical "% of variance explained" — but with binary/sparse outcomes, R² is structurally small. The slope and direction matter at least as much as the magnitude.`);
  report.push('');
  report.push(`| Target              | N    | slope (β)  | intercept  | R²     | r       | RMSE    | reads as                                                |`);
  report.push(`|---------------------|------|------------|------------|--------|---------|---------|---------------------------------------------------------|`);
  for (const [name, reg] of [['per-pick unit-return', regUnitReturn], ['won (binary)', regWon], ['per-pick PnL (u)', regProfit]]) {
    if (!reg) { report.push(`| ${name.padEnd(19)} | —    | —          | —          | —      | —       | —       | not enough data                                          |`); continue; }
    const dir = reg.slope > 0 ? 'positive (higher score ⇒ better outcome)' : reg.slope < 0 ? 'negative (higher score ⇒ WORSE outcome)' : 'flat';
    report.push(`| ${name.padEnd(19)} | ${String(reg.n).padStart(4)} | ${fmtSigned(reg.slope, 4).padStart(10)} | ${fmtSigned(reg.intercept, 4).padStart(10)} | ${fmtN(reg.r2, 4).padStart(6)} | ${fmtSigned(reg.r, 3).padStart(7)} | ${fmtN(reg.rmse, 3).padStart(7)} | ${dir.padEnd(56)} |`);
  }
  report.push('');
  report.push(`> Even a "small" R² of 0.02–0.05 is meaningful for sports picks — outcomes are 50%+ noise floor. The signs of the slopes and the direction of r are the primary check: if **slope < 0** on per-pick PnL, V12 is **anti-predictive** for sizing decisions and the ladder needs revisiting.`);
  report.push('');

  // ────────────────────────────────────────────────────────────────────
  // 12C — Per-feature correlation (V12 inputs)
  // ────────────────────────────────────────────────────────────────────
  const withMeans = live.filter(r => Number.isFinite(r.agsV12ForMean) && Number.isFinite(r.agsV12AgMean));
  report.push(`### 12C — Per-feature correlation (V12's actual inputs vs outcome)`);
  report.push('');
  report.push(`The score above is a *blend* of inputs. Here we crack it open and test each ingredient **on its own**: FOR-side wallet quality, AGAINST-side wallet quality, how many wallets are on each side, and how many are \`proven\` (HC_BASE). For each one we ask "does this ingredient, by itself, line up with winning?" Two columns answer it: **r** (Pearson — strength of a straight-line relationship) and **ρ** (Spearman — same idea but rank-based, so one weird pick can't distort it). Numbers near **0** mean that ingredient is contributing noise, not signal; we'd want to down-weight it. A sign that's *backwards* (e.g. AGAINST-side quality showing a positive correlation with our wins) means the input is wired against us. The most important sanity check: \`agsV12ForMean\` should be **positive**, \`agsV12AgMean\` should be **negative**.`);
  report.push('');
  if (withMeans.length < 10) {
    report.push(`_(only ${withMeans.length} picks have per-side wallet-quality means stamped — feature-level tests need ≥ 10. Section will fill in once more picks ship.)_`);
    report.push('');
  } else {
    const featureSpecs = [
      ['agsV12ForMean',   'mean Q of FOR-side wallets — higher should help'],
      ['agsV12AgMean',    'mean Q of AGAINST-side wallets — higher should HURT (negative correlation expected)'],
      ['agsV12ForCount',  'count of contributing FOR-side wallets'],
      ['agsV12AgCount',   'count of contributing AGAINST-side wallets'],
      ['provenFor',       'count of proven (HC_BASE) FOR wallets'],
      ['provenAg',        'count of proven (HC_BASE) AGAINST wallets'],
    ];
    const ws = withMeans.map(r => r.won);
    const ur = withMeans.map(r => (r.units > 0 ? r.profit / r.units : 0));
    report.push(`| Feature           | N   | r(feature, won) | ρ(feature, won) | r(feature, unit-return) | ρ(feature, unit-return) | reads as                                                       |`);
    report.push(`|-------------------|-----|-----------------|------------------|--------------------------|--------------------------|----------------------------------------------------------------|`);
    for (const [key, meaning] of featureSpecs) {
      const xs = withMeans.map(r => r[key]).filter(Number.isFinite);
      if (xs.length < 10) {
        report.push(`| ${key.padEnd(17)} | ${String(xs.length).padStart(3)} | —               | —                | —                        | —                        | not stamped on enough picks                                    |`);
        continue;
      }
      const indices = withMeans.map((r, i) => Number.isFinite(r[key]) ? i : -1).filter(i => i >= 0);
      const xv = indices.map(i => withMeans[i][key]);
      const yv = indices.map(i => ws[i]);
      const uv = indices.map(i => ur[i]);
      const r_w = pearson(xv, yv);
      const r_u = pearson(xv, uv);
      const s_w = spearman(xv, yv);
      const s_u = spearman(xv, uv);
      report.push(`| ${key.padEnd(17)} | ${String(xv.length).padStart(3)} | ${fmtSigned(r_w, 3).padStart(15)} | ${fmtSigned(s_w, 3).padStart(16)} | ${fmtSigned(r_u, 3).padStart(24)} | ${fmtSigned(s_u, 3).padStart(24)} | ${meaning.padEnd(62)} |`);
    }
    report.push('');

    // Tercile-bucket the strongest pair (forMean vs unit-return) for visual confirmation.
    const xsFm = withMeans.map(r => r.agsV12ForMean);
    const buckets = tercileBuckets(xsFm, ws, ur, withMeans.map(r => r.units || 0));
    if (buckets) {
      report.push(`#### Tercile breakdown — forMean vs realised ROI`);
      report.push('');
      report.push(`If \`agsV12ForMean\` is doing real work, the high-tercile bucket should out-perform the low-tercile bucket on ROI. If they're flat or inverted, the FOR-side mean is not the driver of edge.`);
      report.push('');
      report.push(`| Bucket            | range                  | N   | W-L     | Win %   | ROI       |`);
      report.push(`|-------------------|------------------------|-----|---------|---------|-----------|`);
      for (const [label, b] of [['LOW (≤ p33)', buckets.lo], ['MID (p33–p67)', buckets.mid], ['HIGH (> p67)', buckets.hi]]) {
        const range = b.lo != null && b.hi != null ? `${fmtN(b.lo, 3)} … ${fmtN(b.hi, 3)}` : '—';
        report.push(`| ${label.padEnd(17)} | ${range.padEnd(22)} | ${String(b.n).padStart(3)} | ${(b.w+'-'+b.l).padEnd(7)} | ${(b.winPct != null ? (b.winPct*100).toFixed(1)+'%' : '—').padStart(7)} | ${(b.roi != null ? (b.roi>=0?'+':'') + b.roi.toFixed(1)+'%' : '—').padStart(9)} |`);
      }
      report.push('');
    }
  }

  // ────────────────────────────────────────────────────────────────────
  // 12D — Score distribution moments
  // ────────────────────────────────────────────────────────────────────
  const sortedScores = [...scores].sort((a, b) => a - b);
  const meanS = avg(scores);
  const sdS = std(scores);
  const skewS = sampleSkew(scores);
  const kurtS = sampleKurt(scores);
  report.push(`### 12D — Score distribution shape`);
  report.push('');
  report.push(`Distribution-level diagnostics on the V12 score itself. Big shifts in mean/sd day-over-day mean V12 is shipping a meaningfully different population of picks. Heavy skew or fat tails (high kurtosis) are warnings that a small number of extreme scores are doing all the work.`);
  report.push('');
  report.push(`| Stat              | Value     | reads as                                                       |`);
  report.push(`|-------------------|-----------|----------------------------------------------------------------|`);
  report.push(`| N (live picks)    | ${String(scores.length).padStart(9)} | live shipped & graded V12 picks                                 |`);
  report.push(`| Mean              | ${fmtSigned(meanS, 4).padStart(9)} | average score across live picks                                 |`);
  report.push(`| SD                | ${fmtN(sdS, 4).padStart(9)} | dispersion — higher SD ⇒ V12 ships a wider spread of conviction |`);
  report.push(`| Skewness          | ${fmtSigned(skewS, 3).padStart(9)} | + = right tail (rare super-strong picks) · − = left tail        |`);
  report.push(`| Excess kurtosis   | ${fmtSigned(kurtS, 3).padStart(9)} | 0 = normal · > 3 = fat tails (small N driving the ROI signal)    |`);
  report.push(`| p10 / p50 / p90   | ${fmtSigned(quantile(sortedScores, 0.10), 3)} / ${fmtSigned(quantile(sortedScores, 0.50), 3)} / ${fmtSigned(quantile(sortedScores, 0.90), 3)} | bottom-decile / median / top-decile V12 score                   |`);
  report.push(`| min / max         | ${fmtSigned(sortedScores[0], 3)} / ${fmtSigned(sortedScores[sortedScores.length-1], 3)} | extreme scores observed on live picks                            |`);
  report.push('');

  // ────────────────────────────────────────────────────────────────────
  // 12E — Per-sport discrimination
  // ────────────────────────────────────────────────────────────────────
  const sports = [...new Set(live.map(r => r.sport).filter(Boolean))].sort();
  report.push(`### 12E — Discrimination by sport`);
  report.push('');
  report.push(`AUC computed separately per sport — V12 may be sharp in one market and noise in another. Small-N sports are flagged with \`(N<20)\` so you don't over-react to early outcomes.`);
  report.push('');
  report.push(`| Sport | N    | W-L    | Win %   | ROI       | AUC    | ρ(score, won) | reads as                                  |`);
  report.push(`|-------|------|--------|---------|-----------|--------|---------------|-------------------------------------------|`);
  for (const sp of sports) {
    const sub = live.filter(r => r.sport === sp);
    const agg = aggregate(sub);
    const ss = sub.map(r => r.agsV12);
    const ww = sub.map(r => r.won);
    const a = rocAuc(ss, ww);
    const rho = spearman(ss, ww);
    const flag = sub.length < 20 ? ' (N<20)' : '';
    const verdict = a == null ? '—'
      : a >= 0.58 ? 'strong'
      : a >= 0.53 ? 'real'
      : a >= 0.48 ? 'noise'
      : 'anti-signal';
    report.push(`| ${sp.padEnd(5)} | ${String(sub.length).padStart(4)} | ${(agg.w+'-'+agg.l).padEnd(6)} | ${pct(agg.w, agg.n).padStart(7)} | ${(agg.roi != null ? (agg.roi>=0?'+':'') + agg.roi.toFixed(1)+'%' : '—').padStart(9)} | ${fmtN(a, 3).padStart(6)} | ${fmtSigned(rho, 3).padStart(13)} | ${(verdict + flag).padEnd(41)} |`);
  }
  report.push('');

  // ────────────────────────────────────────────────────────────────────
  // 12F — Rolling 7-day AUC (stability over time)
  // ────────────────────────────────────────────────────────────────────
  report.push(`### 12F — Stability: predictive edge over time (rolling 7-day window)`);
  report.push('');
  report.push(`This is the **decay alarm**. We recompute the same two signals on a moving 7-day window and chart them so you can *see* the trend rather than read it off a wall of numbers:`);
  report.push('');
  report.push(`- **Rolling AUC** — is the score still separating winners from losers *recently*? A line drifting toward 0.50 = the edge is fading.`);
  report.push(`- **Rolling edge (pp)** — realized win% minus the market-implied win% baked into the closing odds. This is the part that actually pays: a positive line means V12 is still beating the price the market set, *right now*.`);
  report.push('');
  const dates = [...new Set(live.map(r => r.date))].sort();
  if (dates.length < 7) {
    report.push(`_(need at least 7 calendar days of V12 picks for a rolling window; currently have ${dates.length}.)_`);
    report.push('');
  } else {
    // Step every 1 day; if too many rows trim to most recent 14.
    const windowDays = 7;
    const allWindows = [];
    for (let i = windowDays - 1; i < dates.length; i++) {
      const endDate = dates[i];
      const startDate = dates[Math.max(0, i - windowDays + 1)];
      const win = live.filter(r => r.date >= startDate && r.date <= endDate);
      if (win.length < 5) continue;
      const ss = win.map(r => r.agsV12);
      const ww = win.map(r => r.won);
      const agg = aggregate(win);
      const realized = agg.n > 0 ? (agg.w / agg.n) * 100 : null;
      const impliedVals = win.map(r => americanToImplied(r.lockOdds || r.peakOdds)).filter(Number.isFinite);
      const implied = impliedVals.length ? avg(impliedVals) * 100 : null;
      const edge = (realized != null && implied != null) ? realized - implied : null;
      allWindows.push({ endDate, startDate, n: win.length, w: agg.w, l: agg.l, roi: agg.roi, auc: rocAuc(ss, ww), edge });
    }
    const recent = allWindows.slice(-14);

    // ── Rolling AUC + rolling edge line charts ───────────────────────────
    const chartWins = recent.filter(r => Number.isFinite(r.auc));
    if (chartWins.length >= 3) {
      const xLabels = '[' + chartWins.map(r => `"${r.endDate.slice(5)}"`).join(', ') + ']';
      const aucSeries = chartWins.map(r => Number(r.auc.toFixed(3)));
      const aLo = Math.min(0.4, Math.floor(Math.min(...aucSeries) * 20) / 20);
      const aHi = Math.max(0.65, Math.ceil(Math.max(...aucSeries) * 20) / 20);
      report.push(`**Rolling AUC** (0.50 = coin-flip line; above is signal, below is anti-signal):`);
      report.push('');
      report.push('```mermaid');
      report.push('xychart-beta');
      report.push(`    title "Rolling 7-day AUC (window end date)"`);
      report.push(`    x-axis ${xLabels}`);
      report.push(`    y-axis "AUC" ${aLo} --> ${aHi}`);
      report.push(`    line [${aucSeries.join(', ')}]`);
      report.push('```');
      report.push('');
      const edgeWins = chartWins.filter(r => Number.isFinite(r.edge));
      if (edgeWins.length >= 3) {
        const xe = '[' + edgeWins.map(r => `"${r.endDate.slice(5)}"`).join(', ') + ']';
        const edgeSeries = edgeWins.map(r => Number(r.edge.toFixed(1)));
        const eLo = Math.floor(Math.min(0, ...edgeSeries) - 1);
        const eHi = Math.ceil(Math.max(0, ...edgeSeries) + 1);
        report.push(`**Rolling edge vs market** (pp; 0 = exactly market price, above 0 = beating the close):`);
        report.push('');
        report.push('```mermaid');
        report.push('xychart-beta');
        report.push(`    title "Rolling 7-day edge: realized − implied win% (pp)"`);
        report.push(`    x-axis ${xe}`);
        report.push(`    y-axis "edge (pp)" ${eLo} --> ${eHi}`);
        report.push(`    line [${edgeSeries.join(', ')}]`);
        report.push('```');
        report.push('');
      }
    }

    report.push(`Underlying windows (each anchored on its END date):`);
    report.push('');
    report.push(`| Window end | Days | N    | W-L    | Win %   | ROI       | AUC    | Edge vs mkt |`);
    report.push(`|------------|------|------|--------|---------|-----------|--------|-------------|`);
    for (const r of recent) {
      report.push(`| ${r.endDate.padEnd(10)} | ${String(windowDays).padStart(4)} | ${String(r.n).padStart(4)} | ${(r.w+'-'+r.l).padEnd(6)} | ${pct(r.w, r.w + r.l).padStart(7)} | ${(r.roi != null ? (r.roi>=0?'+':'') + r.roi.toFixed(1)+'%' : '—').padStart(9)} | ${fmtN(r.auc, 3).padStart(6)} | ${(r.edge != null ? (r.edge>=0?'+':'')+r.edge.toFixed(1)+'pp' : '—').padStart(11)} |`);
    }
    report.push('');
    if (allWindows.length >= 3) {
      const aucs = allWindows.map(w => w.auc).filter(Number.isFinite);
      if (aucs.length >= 3) {
        const firstHalf = aucs.slice(0, Math.floor(aucs.length / 2));
        const secondHalf = aucs.slice(Math.floor(aucs.length / 2));
        const delta = avg(secondHalf) - avg(firstHalf);
        const trend = delta > 0.02 ? '🟢 **AUC is trending UP** — V12 is sharpening'
                    : delta < -0.02 ? '🔴 **AUC is trending DOWN** — V12 is degrading; investigate quintile cutoffs and wallet pool drift'
                    : '🟡 **AUC is roughly flat** — no meaningful drift, V12 holding steady';
        report.push(`> ${trend} (${fmtN(avg(firstHalf), 3)} avg in first half → ${fmtN(avg(secondHalf), 3)} avg in second half · Δ = ${fmtSigned(delta, 3)})`);
        report.push('');
      }
    }
  }

  // ────────────────────────────────────────────────────────────────────
  // 12G — Bootstrap 95% CI on V12 ROI
  // ────────────────────────────────────────────────────────────────────
  report.push(`### 12G — Bootstrap 95% confidence intervals (1000 resamples)`);
  report.push('');
  report.push(`Resample the live V12 picks (with replacement, 1000 iterations) and recompute key stats on each resample. The 2.5th–97.5th percentiles give a 95% confidence band — anything narrower means we can be confident the metric isn't just luck; anything wider means current N is too low to claim a trend.`);
  report.push('');
  const pickLevel = live.map(r => ({ profit: r.profit, units: r.units || 0, won: r.won, score: r.agsV12 }));
  const ciRoi = bootstrapCI(pickLevel, (resample) => {
    const totalStake = resample.reduce((s, x) => s + x.units, 0);
    const totalPnl = resample.reduce((s, x) => s + x.profit, 0);
    return totalStake > 0 ? (totalPnl / totalStake) * 100 : NaN;
  });
  const ciWinPct = bootstrapCI(pickLevel, (resample) => {
    const decided = resample.filter(x => x.won != null);
    if (decided.length === 0) return NaN;
    return (decided.filter(x => x.won === 1).length / decided.length) * 100;
  });
  const ciAuc = bootstrapCI(pickLevel, (resample) => {
    const ss = resample.map(x => x.score).filter(Number.isFinite);
    const ww = resample.map(x => x.won).filter(v => v != null);
    if (ss.length !== ww.length || ss.length < 3) return NaN;
    return rocAuc(ss, ww);
  });
  const ciFlat = bootstrapCI(pickLevel, (resample) => {
    const ws = resample.filter(x => x.won != null);
    if (ws.length === 0) return NaN;
    const wins = ws.filter(x => x.won === 1).length;
    const losses = ws.filter(x => x.won === 0).length;
    return wins - losses;
  });
  report.push(`| Metric                       | Point estimate | 95% CI               | Reads as                                                  |`);
  report.push(`|------------------------------|----------------|----------------------|-----------------------------------------------------------|`);
  if (ciRoi)    report.push(`| ROI (%)                      | ${(stats.agg.roi != null ? (stats.agg.roi>=0?'+':'') + stats.agg.roi.toFixed(1)+'%' : '—').padStart(14)} | [${fmtSigned(ciRoi.lo, 1)}%, ${fmtSigned(ciRoi.hi, 1)}%]  | If CI crosses 0%, ROI is statistically indistinguishable from break-even |`);
  if (ciWinPct) report.push(`| Win %                        | ${pct(stats.agg.w, stats.agg.n).padStart(14)} | [${fmtN(ciWinPct.lo, 1)}%, ${fmtN(ciWinPct.hi, 1)}%]  | Range you'd expect the long-run win rate to fall in            |`);
  if (ciAuc)    report.push(`| AUC                          | ${fmtN(auc, 3).padStart(14)} | [${fmtN(ciAuc.lo, 3)}, ${fmtN(ciAuc.hi, 3)}]    | If CI lo ≤ 0.50, edge is not statistically established yet      |`);
  if (ciFlat)   report.push(`| Wins − Losses                | ${(stats.agg.w - stats.agg.l).toString().padStart(14)} | [${ciFlat.lo.toFixed(0)}, ${ciFlat.hi.toFixed(0)}]      | Flat-bet hit count range                                       |`);
  report.push('');
  if (ciRoi) {
    const includesZero = ciRoi.lo < 0 && ciRoi.hi > 0;
    const fullyPositive = ciRoi.lo > 0;
    const fullyNegative = ciRoi.hi < 0;
    const verdict = fullyPositive ? '🟢 **ROI is statistically positive** (entire 95% CI > 0) — edge is established with current sample'
                  : fullyNegative ? '🔴 **ROI is statistically negative** (entire 95% CI < 0) — losing is not variance, it is the expected outcome on V12 currently'
                  : includesZero  ? '🟡 **ROI CI crosses zero** — current sample size cannot distinguish edge from break-even. Keep shipping picks and re-check'
                  : '—';
    report.push(`> ${verdict}`);
    report.push('');
  }
}

// ── § 13 — V12 Wallet Influence & Performance ───────────────────────────
//
// Two questions answered:
//   1. Which wallets are most influencing the picks V12 ships?  (count of
//      live-side appearances, share of total contribution)
//   2. When a wallet appears on the FOR side of a V12 pick, how does that
//      pick perform on average?  (per-wallet W-L, ROI, with min-N filter)
//
// Inputs: stats.liveRows (each row carries walletDetails frozen at scoring
// time) and a walletProfilesMap loaded once at the top of main() so we can
// enrich each wallet row with its current tier / prior ROI / prior N.
function buildV12WalletInfluence(report, stats, walletProfiles) {
  report.push(`## § 10 — Wallet Influence`);
  report.push('');
  report.push(`> **Why this section matters.** V12 is built entirely on what the qualifying wallets do — the score is literally a difference of their mean qualities on each side of the pick. If 80% of our shipped picks are driven by the same 5 wallets, V12 is concentrated risk on those wallets' continued performance. This section names who they are and how they're doing.`);
  report.push('');
  if (!stats || stats.liveRows.length === 0) {
    report.push(`_(no live V12 picks yet)_`);
    report.push('');
    return;
  }
  // Only consider picks whose FOR side we can identify (sideKey is the
  // side we picked; walletDetails entries with side === sideKey are the
  // wallets that informed the BUY decision).
  const live = stats.liveRows.filter(r => r.walletDetails && r.walletDetails.length > 0 && r.won != null);
  if (live.length === 0) {
    report.push(`_(no V12 picks have walletDetails stamped yet — section will populate once peak.v8Scoring.walletDetails are being written to graded picks)_`);
    report.push('');
    return;
  }

  // Per-wallet accumulator. We track BOTH sides: appearances on FOR vs AG
  // (so we can ALSO surface anti-signals from wallets that consistently
  // bet the wrong side).
  const W = new Map();  // walletShort -> { forN, agN, forWins, forLosses, forPnl, forStake, sizeRatios, sports, lastSeen }
  for (const pick of live) {
    for (const wd of pick.walletDetails) {
      const w = wd.wallet;
      if (!w) continue;
      const rec = W.get(w) || {
        wallet: w,
        forN: 0, agN: 0,
        forWins: 0, forLosses: 0,
        forPnl: 0, forStake: 0,
        sizeRatios: [],
        sports: new Set(),
        lastSeen: '',
      };
      rec.sports.add(pick.sport);
      if (pick.date > rec.lastSeen) rec.lastSeen = pick.date;
      if (wd.side === pick.sideKey) {
        // Wallet was on the side V12 picked → they "influenced" this bet.
        rec.forN += 1;
        if (pick.won === 1) rec.forWins += 1;
        else if (pick.won === 0) rec.forLosses += 1;
        rec.forPnl += pick.profit;
        rec.forStake += pick.units || 0;
        if (Number.isFinite(wd.sizeRatio)) rec.sizeRatios.push(wd.sizeRatio);
      } else {
        rec.agN += 1;
      }
      W.set(w, rec);
    }
  }
  const wallets = [...W.values()].map(r => ({
    ...r,
    sportsList: [...r.sports].sort(),
    forWinPct: (r.forWins + r.forLosses) > 0 ? r.forWins / (r.forWins + r.forLosses) : null,
    forRoi:    r.forStake > 0 ? (r.forPnl / r.forStake) * 100 : null,
    avgSizeRatio: r.sizeRatios.length ? avg(r.sizeRatios) : null,
  }));

  // ────────────────────────────────────────────────────────────────────
  // 13A — Overview / influence concentration
  // ────────────────────────────────────────────────────────────────────
  const totalForAppearances = wallets.reduce((s, r) => s + r.forN, 0);
  const uniqueForWallets = wallets.filter(r => r.forN > 0).length;
  const avgForPerPick = live.reduce((s, r) => s + r.walletDetails.filter(wd => wd.side === r.sideKey).length, 0) / live.length;
  // Concentration: what fraction of FOR-side appearances come from the
  // top-N wallets? Useful for spotting key-person risk in the wallet pool.
  const sortedByForN = [...wallets].sort((a, b) => b.forN - a.forN);
  const cumShare = (n) => {
    const slice = sortedByForN.slice(0, n);
    return slice.reduce((s, r) => s + r.forN, 0) / Math.max(1, totalForAppearances);
  };
  report.push(`### 13A — Influence overview`);
  report.push('');
  report.push(`| Metric                                       | Value                                                     |`);
  report.push(`|----------------------------------------------|-----------------------------------------------------------|`);
  report.push(`| Live V12 picks analysed                      | ${String(live.length).padStart(57)} |`);
  report.push(`| Unique wallets ever on a FOR side            | ${String(uniqueForWallets).padStart(57)} |`);
  report.push(`| Avg FOR-side wallets per pick                | ${avgForPerPick.toFixed(2).padStart(57)} |`);
  report.push(`| Top-5 wallets' share of all FOR appearances  | ${(cumShare(5) * 100).toFixed(1).padStart(56)}% |`);
  report.push(`| Top-10 wallets' share of all FOR appearances | ${(cumShare(10) * 100).toFixed(1).padStart(56)}% |`);
  report.push(`| Top-20 wallets' share of all FOR appearances | ${(cumShare(20) * 100).toFixed(1).padStart(56)}% |`);
  report.push('');
  if (cumShare(5) > 0.50) {
    report.push(`> 🟡 **Top-5 wallets drive over 50% of FOR-side influence.** Concentrated risk — if any one of these wallets goes cold or stops betting, V12's signal degrades materially. Section 13B names them.`);
    report.push('');
  } else if (cumShare(10) > 0.70) {
    report.push(`> 🟡 **Top-10 wallets drive over 70% of FOR-side influence.** Moderately concentrated. Worth monitoring.`);
    report.push('');
  } else {
    report.push(`> 🟢 **Influence is well-distributed** — no single wallet (or small cluster) dominates V12's picks.`);
    report.push('');
  }

  // ────────────────────────────────────────────────────────────────────
  // 13B — Top 20 most-influential wallets
  // ────────────────────────────────────────────────────────────────────
  report.push(`### 13B — Top 20 most-influential wallets (by # FOR-side appearances on V12 live picks)`);
  report.push('');
  report.push(`These are the wallets V12 is "listening to" the most. Each row also shows how the picks they were FOR have actually performed since V12 went live, plus their current whitelist tier / prior ROI from the wallet-profile snapshot.`);
  report.push('');
  report.push(`| Rank | Wallet  | Sports     | FOR# | AG#  | W-L    | Win %   | ROI       | PnL (u)   | Avg sizeR | Tier        | Prior ROI | Prior N | Last seen  |`);
  report.push(`|------|---------|------------|------|------|--------|---------|-----------|-----------|-----------|-------------|-----------|---------|------------|`);
  const top20 = sortedByForN.slice(0, 20);
  for (let i = 0; i < top20.length; i++) {
    const r = top20[i];
    const profile = walletProfiles?.get(r.wallet);
    // Aggregate prior stats across the sports we actually picked them on.
    let tier = '—', priorRoi = null, priorN = null;
    if (profile?.bySport) {
      const pickedSports = r.sportsList.filter(sp => profile.bySport[sp]);
      const sportData = pickedSports.map(sp => profile.bySport[sp]).filter(Boolean);
      if (sportData.length > 0) {
        // Use the highest-tier label across the sports they showed up in.
        const tierOrder = { CONFIRMED: 4, FLAT: 3, WR50: 2, null: 1 };
        const best = sportData.reduce((acc, sd) => (tierOrder[sd.whitelistTier] ?? 0) > (tierOrder[acc.whitelistTier] ?? 0) ? sd : acc);
        tier = best.whitelistTier || '—';
        // Aggregate prior N and prior ROI weighted by N across all sports
        // they're profiled in (covers cross-sport bettors cleanly).
        let totN = 0, totRoiN = 0;
        for (const sd of sportData) {
          const n = sd.picks?.n ?? 0;
          const roi = sd.picks?.flatRoi ?? 0;
          totN += n;
          totRoiN += roi * n;
        }
        priorN = totN || null;
        priorRoi = totN > 0 ? totRoiN / totN : null;
      }
    }
    report.push(`| ${String(i+1).padStart(4)} | ${r.wallet.padEnd(7)} | ${r.sportsList.join(',').padEnd(10)} | ${String(r.forN).padStart(4)} | ${String(r.agN).padStart(4)} | ${(r.forWins+'-'+r.forLosses).padEnd(6)} | ${(r.forWinPct != null ? (r.forWinPct*100).toFixed(1)+'%' : '—').padStart(7)} | ${(r.forRoi != null ? (r.forRoi>=0?'+':'') + r.forRoi.toFixed(1)+'%' : '—').padStart(9)} | ${fmtSigned(r.forPnl).padStart(9)} | ${(r.avgSizeRatio != null ? r.avgSizeRatio.toFixed(2)+'×' : '—').padStart(9)} | ${tier.padEnd(11)} | ${(priorRoi != null ? (priorRoi>=0?'+':'') + priorRoi.toFixed(1)+'%' : '—').padStart(9)} | ${(priorN != null ? String(priorN) : '—').padStart(7)} | ${r.lastSeen.padEnd(10)} |`);
  }
  report.push('');

  // ────────────────────────────────────────────────────────────────────
  // 13C — Best performing wallets (min N filter)
  // ────────────────────────────────────────────────────────────────────
  const MIN_N = 10;
  const eligible = wallets.filter(r => r.forN >= MIN_N && r.forRoi != null);
  report.push(`### 13C — Best-performing wallets (ROI when on the FOR side; min ${MIN_N} appearances)`);
  report.push('');
  report.push(`Among wallets with at least **${MIN_N} FOR-side appearances** on live V12 picks, ranked by realised ROI. These are the wallets whose presence on a pick should give the most confidence going forward.`);
  report.push('');
  if (eligible.length === 0) {
    report.push(`_(no wallet has reached ${MIN_N} FOR-side appearances yet — section will populate as picks accumulate)_`);
    report.push('');
  } else {
    const best = [...eligible].sort((a, b) => b.forRoi - a.forRoi).slice(0, 15);
    report.push(`| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |`);
    report.push(`|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|`);
    for (let i = 0; i < best.length; i++) {
      const r = best[i];
      report.push(`| ${String(i+1).padStart(4)} | ${r.wallet.padEnd(7)} | ${r.sportsList.join(',').padEnd(10)} | ${String(r.forN).padStart(4)} | ${(r.forWins+'-'+r.forLosses).padEnd(6)} | ${(r.forWinPct != null ? (r.forWinPct*100).toFixed(1)+'%' : '—').padStart(7)} | ${(r.forRoi != null ? (r.forRoi>=0?'+':'') + r.forRoi.toFixed(1)+'%' : '—').padStart(10)} | ${fmtSigned(r.forPnl).padStart(9)} | ${(r.avgSizeRatio != null ? r.avgSizeRatio.toFixed(2)+'×' : '—').padStart(9)} | ${r.lastSeen.padEnd(10)} |`);
    }
    report.push('');

    // ────────────────────────────────────────────────────────────────
    // 13D — Worst performing wallets
    // ────────────────────────────────────────────────────────────────
    report.push(`### 13D — Worst-performing wallets (potential anti-signals; min ${MIN_N} appearances)`);
    report.push('');
    report.push(`Same filter, sorted ROI ascending. Wallets that consistently lose when they're on V12's FOR side. If any of these are appearing in §13B's top influencers, V12 is being dragged down by chronic losers — those wallets may need to be downgraded from the qualifying pool (see \`exportWalletProfiles.js\`).`);
    report.push('');
    const worst = [...eligible].sort((a, b) => a.forRoi - b.forRoi).slice(0, 15);
    report.push(`| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |`);
    report.push(`|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|`);
    for (let i = 0; i < worst.length; i++) {
      const r = worst[i];
      report.push(`| ${String(i+1).padStart(4)} | ${r.wallet.padEnd(7)} | ${r.sportsList.join(',').padEnd(10)} | ${String(r.forN).padStart(4)} | ${(r.forWins+'-'+r.forLosses).padEnd(6)} | ${(r.forWinPct != null ? (r.forWinPct*100).toFixed(1)+'%' : '—').padStart(7)} | ${(r.forRoi != null ? (r.forRoi>=0?'+':'') + r.forRoi.toFixed(1)+'%' : '—').padStart(10)} | ${fmtSigned(r.forPnl).padStart(9)} | ${(r.avgSizeRatio != null ? r.avgSizeRatio.toFixed(2)+'×' : '—').padStart(9)} | ${r.lastSeen.padEnd(10)} |`);
    }
    report.push('');

    // Cross-check: are any losers in the top-20 influencers? That's a
    // direct call-out for the model team.
    const topInfluencerSet = new Set(top20.map(r => r.wallet));
    const dragWallets = worst.filter(r => topInfluencerSet.has(r.wallet) && r.forRoi < -5);
    if (dragWallets.length > 0) {
      report.push(`> 🔴 **${dragWallets.length} wallet(s) appear in BOTH the top-20 most-influential list AND the worst-performers list with ROI < −5%.** They are actively dragging V12's results down while having heavy say in pick generation. Candidates: ${dragWallets.map(d => `\`${d.wallet}\` (FOR# ${d.forN}, ROI ${d.forRoi.toFixed(1)}%)`).join(', ')}.`);
      report.push('');
    }
  }
}

// ── § 17 — AGS-U Full-History Feature Lab ──────────────────────────────
//
// Retrospective feature analysis on **every AGS-U promoted live pick
// since cutover** (not just the V12 era). Two purposes:
//   1. Identify which features actually moved the needle on win-rate and
//      ROI — both individually (univariate) and in concert (multivariate
//      OLS regression with standardized β rankings).
//   2. Cross-reference the data-driven "best features" against what V12
//      currently uses. Surface anything V12 is leaving on the table.
//
// We extract ~22 candidate features per pick from the stamps we already
// hold in Firestore: V12 score itself, V12 wallet-quality means / counts,
// proven-wallet margins, HC margin, lock-time line probability, CLV,
// peak/lock stars, and a suite of derived metrics computed from the
// frozen walletDetails (counts, size ratios, contributions on each side).
//
// Sub-sections:
//   17A. Available feature panel
//   17B. Univariate impact table (sorted by |r(unit-return)|)
//   17C. Tercile-bucket ROI for the top features
//   17D. Multicollinearity check (pairwise correlation matrix)
//   17E. Multivariate OLS — standardized β rankings + multiple R²
//   17F. V12 vs the data-driven best — what V12 ignores, what it weights right
//   17G. Actionable recommendations
//
// IMPORTANT design notes:
//   - Restricted to LIVE picks (units > 0, tracked=false) so analysis maps
//     directly to real-money decisions.
//   - Features that are absent on >40% of picks are still included in the
//     univariate panel (per-feature N-aware) but excluded from the
//     multivariate matrix (OLS needs a complete row).
//   - Standardized β = OLS β on z-scored features → outcome. Lets you
//     compare apples-to-apples across features with different scales.

// Compute the full feature panel for a single pick. Missing values
// surface as null, not 0 (the analysis is N-aware per feature).
function extractFeaturesForPick(r) {
  const wd = Array.isArray(r.walletDetails) ? r.walletDetails : [];
  // Identify wallets on the FOR side using sideKey when present
  // (handles 'home' / 'away' / 'over' / 'under' uniformly).
  const forWds = wd.filter(w => w.side && w.side === r.sideKey);
  const agWds  = wd.filter(w => w.side && w.side !== r.sideKey);
  const sumFor = (key) => forWds.reduce((s, w) => s + (Number(w[key]) || 0), 0);
  const sumAg  = (key) => agWds.reduce((s, w) => s + (Number(w[key]) || 0), 0);
  const avgFor = (key) => forWds.length ? sumFor(key) / forWds.length : null;
  const avgAg  = (key) => agWds.length  ? sumAg(key)  / agWds.length  : null;
  const maxFor = (key) => forWds.length ? Math.max(...forWds.map(w => Number(w[key]) || 0)) : null;

  const wdForCount = forWds.length || null;
  const wdAgCount  = agWds.length || null;
  const wdContribFor = sumFor('contribution');
  const wdContribAg  = sumAg('contribution');
  const wdContribTotal = wdContribFor + wdContribAg;

  return {
    // ── V12 stamps (back-filled on all picks)
    agsV12:            Number.isFinite(r.agsV12) ? r.agsV12 : null,
    agsV12ForMean:     Number.isFinite(r.agsV12ForMean) ? r.agsV12ForMean : null,
    agsV12AgMean:      Number.isFinite(r.agsV12AgMean) ? r.agsV12AgMean : null,
    qMargin:           (Number.isFinite(r.agsV12ForMean) && Number.isFinite(r.agsV12AgMean)) ? r.agsV12ForMean - r.agsV12AgMean : null,
    agsV12ForCount:    Number.isFinite(r.agsV12ForCount) ? r.agsV12ForCount : null,
    agsV12AgCount:     Number.isFinite(r.agsV12AgCount) ? r.agsV12AgCount : null,
    countMargin:       (Number.isFinite(r.agsV12ForCount) && Number.isFinite(r.agsV12AgCount)) ? r.agsV12ForCount - r.agsV12AgCount : null,
    // ── V11 / proven-pool stamps (universal across cutover)
    ags:               Number.isFinite(r.ags) ? r.ags : null,
    provenFor:         Number.isFinite(r.provenFor) ? r.provenFor : null,
    provenAg:          Number.isFinite(r.provenAg) ? r.provenAg : null,
    provenTotal:       Number.isFinite(r.provenTotal) ? r.provenTotal : null,
    provenMargin:      (Number.isFinite(r.provenFor) && Number.isFinite(r.provenAg)) ? r.provenFor - r.provenAg : null,
    hcMargin:          Number.isFinite(r.hcMargin) ? r.hcMargin : null,
    // ── Line / market features
    lockPinnProb:      Number.isFinite(r.lockPinnProb) ? r.lockPinnProb : null,
    clv:               Number.isFinite(r.clv) ? r.clv : null,
    peakStars:         Number.isFinite(r.peakStars) ? r.peakStars : null,
    // ── Wallet-detail-derived (richer than agsV12*Count)
    wdForCount,
    wdAgCount,
    wdForAvgSizeRatio: avgFor('sizeRatio'),
    wdAgAvgSizeRatio:  avgAg('sizeRatio'),
    wdSizeMargin:      (avgFor('sizeRatio') != null && avgAg('sizeRatio') != null) ? avgFor('sizeRatio') - avgAg('sizeRatio') : null,
    wdContribFor,
    wdContribAg,
    wdContribMargin:   wdContribFor - wdContribAg,
    wdMaxForContrib:   maxFor('contribution'),
    wdMaxContribShare: wdContribTotal > 0 ? maxFor('contribution') / wdContribTotal : null,
  };
}

// Human-readable label + plain-English meaning for every feature in the panel.
const FEATURE_LAB_META = {
  agsV12:            { label: 'agsV12',            meaning: 'V12 score itself — bounded wallet-quality differential' },
  agsV12ForMean:     { label: 'V12 forMean',       meaning: 'Mean wallet quality (Q) of FOR-side proven wallets' },
  agsV12AgMean:      { label: 'V12 agMean',        meaning: 'Mean wallet quality (Q) of AGAINST-side proven wallets' },
  qMargin:           { label: 'qMargin',           meaning: 'forMean − agMean (raw difference, pre-bounding)' },
  agsV12ForCount:    { label: 'V12 forCount',      meaning: 'Count of proven FOR-side wallets contributing to V12' },
  agsV12AgCount:     { label: 'V12 agCount',       meaning: 'Count of proven AGAINST-side wallets' },
  countMargin:       { label: 'countMargin',       meaning: 'forCount − agCount (signed wallet-count advantage)' },
  ags:               { label: 'ags (v11)',         meaning: 'V11 logistic composite score — predecessor of V12' },
  provenFor:         { label: 'provenFor',         meaning: 'Count of HC_BASE (CONFIRMED/FLAT) wallets FOR the pick' },
  provenAg:          { label: 'provenAg',          meaning: 'Count of HC_BASE wallets AGAINST the pick' },
  provenTotal:       { label: 'provenTotal',       meaning: 'Total HC_BASE wallets touching the game' },
  provenMargin:      { label: 'provenMargin',      meaning: 'provenFor − provenAg' },
  hcMargin:          { label: 'hcMargin',          meaning: 'High-conviction margin from v11 — signed conviction differential' },
  lockPinnProb:      { label: 'lockPinnProb',      meaning: 'Pinnacle implied probability at lock time (the line itself)' },
  clv:               { label: 'clv',               meaning: 'Closing line value — how far line moved in our favour' },
  peakStars:         { label: 'peakStars',         meaning: 'Star rating at peak (heuristic conviction grade)' },
  wdForCount:        { label: 'wd forCount',       meaning: 'Wallet-detail-derived FOR side count (any wallet, not just HC_BASE)' },
  wdAgCount:         { label: 'wd agCount',        meaning: 'Wallet-detail-derived AGAINST side count' },
  wdForAvgSizeRatio: { label: 'wd forAvgSize',     meaning: 'Avg sizeRatio of FOR-side wallets (size vs their own avg)' },
  wdAgAvgSizeRatio:  { label: 'wd agAvgSize',      meaning: 'Avg sizeRatio of AGAINST-side wallets' },
  wdSizeMargin:      { label: 'wd sizeMargin',     meaning: 'forAvgSize − agAvgSize (signed sizing advantage)' },
  wdContribFor:      { label: 'wd contribFor',     meaning: 'Σ contribution (walletBase × convictionMult) on FOR side' },
  wdContribAg:       { label: 'wd contribAg',      meaning: 'Σ contribution on AGAINST side' },
  wdContribMargin:   { label: 'wd contribMargin',  meaning: 'forContrib − agContrib (total weighted-money advantage)' },
  wdMaxForContrib:   { label: 'wd maxForContrib',  meaning: 'Max single-wallet contribution on FOR side' },
  wdMaxContribShare: { label: 'wd maxShare',       meaning: 'Largest single contribution / total (concentration risk)' },
};

// What V12 actually uses today — so § 17F can call out anything else
// that ranked highly but V12 ignores.
const V12_ACTIVE_FEATURE_SET = new Set([
  'agsV12', 'agsV12ForMean', 'agsV12AgMean', 'qMargin',
  'agsV12ForCount', 'agsV12AgCount',
]);

function buildAgsFeatureLab(report, agsuRows) {
  report.push(`## § 17 — AGS-U Full-History Feature Lab`);
  report.push('');
  report.push(`> **Why this section matters.** V12 makes a deliberate bet that **wallet-quality mean ratio** is the single best predictor of pick outcomes. This section tests that assumption against ~${agsuRows.length} graded AGS-U picks since cutover. For every plausible feature we have stamped on a pick, we measure how strongly it correlates with **winning** and with **per-unit PnL** — first individually, then in concert via multivariate regression. The closing sub-section (§17F) cross-references the data-driven top features against the ones V12 actually uses, so any signal V12 is leaving on the table is named explicitly.`);
  report.push('');

  const live = agsuRows.filter(r => !r.tracked && r.won != null && (r.units || 0) > 0);
  if (live.length < 30) {
    report.push(`_(need at least 30 graded live AGS-U picks for feature analysis; currently have ${live.length}.)_`);
    report.push('');
    return;
  }

  // Build the panel.
  const panel = live.map(r => extractFeaturesForPick(r));
  const wins = live.map(r => r.won);
  const unitReturns = live.map(r => (r.units > 0 ? r.profit / r.units : 0));
  const units = live.map(r => r.units || 0);
  const featureNames = Object.keys(FEATURE_LAB_META);

  // ────────────────────────────────────────────────────────────────────
  // 17A — Feature panel coverage
  // ────────────────────────────────────────────────────────────────────
  report.push(`### 17A — Candidate feature panel & coverage`);
  report.push('');
  report.push(`We test ${featureNames.length} candidate features across ${live.length} live graded picks. "Coverage %" = share of picks where the feature is non-null (some features are only stamped on V12-era picks, some on lock time, etc.). Features below ~40% coverage are still tested univariately but **excluded from the multivariate regression** in §17E because OLS requires complete rows.`);
  report.push('');
  const coverage = {};
  for (const k of featureNames) coverage[k] = panel.filter(p => p[k] != null && Number.isFinite(p[k])).length;
  report.push(`| Feature              | Coverage          | Meaning                                                              |`);
  report.push(`|----------------------|-------------------|----------------------------------------------------------------------|`);
  for (const k of featureNames) {
    const cov = coverage[k];
    const pctStr = `${cov} / ${live.length} (${((cov/live.length)*100).toFixed(0)}%)`;
    const v12flag = V12_ACTIVE_FEATURE_SET.has(k) ? ' 🟢' : '   ';
    report.push(`| ${(FEATURE_LAB_META[k].label + v12flag).padEnd(20)} | ${pctStr.padEnd(17)} | ${FEATURE_LAB_META[k].meaning.padEnd(68)} |`);
  }
  report.push('');
  report.push(`> 🟢 = feature is currently consumed by V12. All others are observed but unused.`);
  report.push('');

  // ────────────────────────────────────────────────────────────────────
  // 17B — Univariate impact
  // ────────────────────────────────────────────────────────────────────
  const univariate = featureNames.map((key) => {
    const indices = panel.map((p, i) => Number.isFinite(p[key]) ? i : -1).filter(i => i >= 0);
    if (indices.length < 20) return null;
    const xs = indices.map(i => panel[i][key]);
    const ys = indices.map(i => wins[i]);
    const us = indices.map(i => unitReturns[i]);
    const r_won  = pearson(xs, ys);
    const rho_won = spearman(xs, ys);
    const pb_won = pointBiserial(xs, ys);
    const r_pnl  = pearson(xs, us);
    const rho_pnl = spearman(xs, us);
    const aucForFeature = rocAuc(xs, ys);
    return { key, label: FEATURE_LAB_META[key].label, n: xs.length, r_won, rho_won, pb_won, r_pnl, rho_pnl, auc: aucForFeature };
  }).filter(Boolean);
  // Rank by |r(unit-return)| — that's the strongest "this moves PnL" signal.
  univariate.sort((a, b) => Math.abs(b.r_pnl ?? 0) - Math.abs(a.r_pnl ?? 0));

  report.push(`### 17B — Univariate impact (each feature on its own)`);
  report.push('');
  report.push(`Each row tests one feature in isolation. Sorted by **|r(feature, unit-return)|** descending — i.e. the strongest correlations with per-unit profit are at the top. Use the **AUC** column for a clean "does this one feature beat a coin flip at separating winners from losers" read.`);
  report.push('');
  report.push(`| Rank | Feature              | N   | V12? | r(won)    | ρ(won)    | r(unit-ret) | ρ(unit-ret) | AUC    |`);
  report.push(`|------|----------------------|-----|------|-----------|-----------|-------------|-------------|--------|`);
  for (let i = 0; i < univariate.length; i++) {
    const u = univariate[i];
    const v12flag = V12_ACTIVE_FEATURE_SET.has(u.key) ? ' 🟢 ' : '    ';
    report.push(`| ${String(i+1).padStart(4)} | ${u.label.padEnd(20)} | ${String(u.n).padStart(3)} | ${v12flag} | ${fmtSigned(u.r_won, 3).padStart(9)} | ${fmtSigned(u.rho_won, 3).padStart(9)} | ${fmtSigned(u.r_pnl, 3).padStart(11)} | ${fmtSigned(u.rho_pnl, 3).padStart(11)} | ${fmtN(u.auc, 3).padStart(6)} |`);
  }
  report.push('');
  // Quick narrative on top 3.
  const top3 = univariate.slice(0, 3);
  const topNonV12 = univariate.find(u => !V12_ACTIVE_FEATURE_SET.has(u.key));
  if (top3.length === 3) {
    report.push(`> **Top 3 univariate features by PnL correlation:** ${top3.map(u => `\`${u.label}\` (r = ${fmtSigned(u.r_pnl, 3)})`).join(', ')}.`);
    report.push('');
  }
  if (topNonV12 && Math.abs(topNonV12.r_pnl ?? 0) > 0.05) {
    report.push(`> 🟡 **Highest-ranked feature NOT used by V12:** \`${topNonV12.label}\` — r(unit-ret) = ${fmtSigned(topNonV12.r_pnl, 3)}, AUC = ${fmtN(topNonV12.auc, 3)}. If this stays at the top of the table after another month of picks, V12 should be revised to incorporate it.`);
    report.push('');
  }

  // ────────────────────────────────────────────────────────────────────
  // 17C — Tercile-bucket ROI for top 5 features
  // ────────────────────────────────────────────────────────────────────
  report.push(`### 17C — Tercile-bucket ROI for the top 5 features`);
  report.push('');
  report.push(`Splits each feature into thirds (low / mid / high) and shows realised ROI in each bucket. If the feature is genuinely impactful, you should see a **monotonic ROI gradient** (high bucket > mid > low, or vice-versa). Flat or inverted bucket ROIs mean the correlation is noise.`);
  report.push('');
  for (const u of univariate.slice(0, 5)) {
    const indices = panel.map((p, i) => Number.isFinite(p[u.key]) ? i : -1).filter(i => i >= 0);
    const xs = indices.map(i => panel[i][u.key]);
    const ys = indices.map(i => wins[i]);
    const us = indices.map(i => unitReturns[i]);
    const stakes = indices.map(i => units[i]);
    const b = tercileBuckets(xs, ys, us, stakes);
    if (!b) continue;
    report.push(`#### \`${u.label}\` · r(unit-ret) = ${fmtSigned(u.r_pnl, 3)} · AUC = ${fmtN(u.auc, 3)}`);
    report.push('');
    report.push(`| Bucket            | range                    | N   | W-L     | Win %   | ROI       |`);
    report.push(`|-------------------|--------------------------|-----|---------|---------|-----------|`);
    for (const [labelB, bk] of [['LOW (≤ p33)', b.lo], ['MID (p33–p67)', b.mid], ['HIGH (> p67)', b.hi]]) {
      const range = bk.lo != null && bk.hi != null ? `${fmtN(bk.lo, 3)} … ${fmtN(bk.hi, 3)}` : '—';
      report.push(`| ${labelB.padEnd(17)} | ${range.padEnd(24)} | ${String(bk.n).padStart(3)} | ${(bk.w+'-'+bk.l).padEnd(7)} | ${(bk.winPct != null ? (bk.winPct*100).toFixed(1)+'%' : '—').padStart(7)} | ${(bk.roi != null ? (bk.roi>=0?'+':'') + bk.roi.toFixed(1)+'%' : '—').padStart(9)} |`);
    }
    report.push('');
    const rois = [b.lo.roi, b.mid.roi, b.hi.roi].filter(v => v != null);
    if (rois.length === 3) {
      const monoUp = rois[0] < rois[1] && rois[1] < rois[2];
      const monoDown = rois[0] > rois[1] && rois[1] > rois[2];
      const flag = monoUp ? '🟢 strictly monotone UP (higher feature ⇒ higher ROI)'
                 : monoDown ? '🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)'
                 : '🟡 non-monotonic across buckets — correlation may be partially noise';
      report.push(`> ${flag}`);
      report.push('');
    }
  }

  // ────────────────────────────────────────────────────────────────────
  // 17D — Multicollinearity check
  // ────────────────────────────────────────────────────────────────────
  // Take top 8 features by univariate impact for the multivariate work.
  const TOP_K = 8;
  const topFeatures = univariate.slice(0, TOP_K);
  report.push(`### 17D — Multicollinearity check (pairwise correlation among top ${TOP_K} features)`);
  report.push('');
  report.push(`Before running multivariate OLS, check whether the top features are measuring redundant things. **|r| > 0.85** is a red flag — the regression will inflate standard errors and β estimates become unstable. In that case, drop one of the pair before interpreting §17E.`);
  report.push('');
  // Build all complete-row indices for ALL top features simultaneously.
  const completeIdx = panel.map((p, i) => topFeatures.every(f => Number.isFinite(p[f.key])) ? i : -1).filter(i => i >= 0);
  if (completeIdx.length < 30) {
    report.push(`_(only ${completeIdx.length} picks have ALL top ${TOP_K} features stamped — too few for stable multivariate analysis. Univariate panel above is still reliable.)_`);
    report.push('');
  } else {
    // Pairwise correlation matrix
    const cols = topFeatures.map(f => completeIdx.map(i => panel[i][f.key]));
    const header = `| feat \\ feat | ${topFeatures.map(f => f.label.padEnd(14)).join(' | ')} |`;
    const sep    = `|-------------|${topFeatures.map(() => '----------------').join('|')}|`;
    report.push(header);
    report.push(sep);
    let maxPair = { r: 0, a: '', b: '' };
    for (let i = 0; i < topFeatures.length; i++) {
      const cells = topFeatures.map((_, j) => {
        if (i === j) return ' 1.000        ';
        const r = pearson(cols[i], cols[j]);
        return (r == null ? '—' : fmtSigned(r, 3)).padStart(14);
      });
      if (i < topFeatures.length - 1) {
        for (let j = i + 1; j < topFeatures.length; j++) {
          const r = pearson(cols[i], cols[j]);
          if (r != null && Math.abs(r) > Math.abs(maxPair.r)) maxPair = { r, a: topFeatures[i].label, b: topFeatures[j].label };
        }
      }
      report.push(`| ${topFeatures[i].label.padEnd(11)} | ${cells.join(' | ')} |`);
    }
    report.push('');
    if (Math.abs(maxPair.r) > 0.85) {
      report.push(`> 🔴 **Strong collinearity detected:** \`${maxPair.a}\` and \`${maxPair.b}\` have r = ${fmtSigned(maxPair.r, 3)}. They're measuring nearly the same thing. The multivariate β estimates below will split credit between them unreliably; treat the looser of the two as a noise channel.`);
      report.push('');
    } else if (Math.abs(maxPair.r) > 0.65) {
      report.push(`> 🟡 **Moderate collinearity:** \`${maxPair.a}\` ↔ \`${maxPair.b}\` r = ${fmtSigned(maxPair.r, 3)}. Multivariate β are still informative but the two features carry overlapping information.`);
      report.push('');
    } else {
      report.push(`> 🟢 **No problematic collinearity** — max pairwise |r| = ${fmtN(Math.abs(maxPair.r), 3)} between \`${maxPair.a}\` and \`${maxPair.b}\`. Multivariate β are interpretable independently.`);
      report.push('');
    }

    // ──────────────────────────────────────────────────────────────────
    // 17E — Multivariate OLS regression
    // ──────────────────────────────────────────────────────────────────
    report.push(`### 17E — Multivariate OLS: standardized β for top ${TOP_K} features`);
    report.push('');
    report.push(`Regress **per-pick unit-return** on the z-scored top features simultaneously. The standardized **β** tells you "how much does a 1-σ change in this feature shift per-unit PnL, holding the others constant." Compare |β| across features to rank impact when controlling for the others — this is the multivariate sibling of the univariate r column above.`);
    report.push('');
    // Build the design matrix (standardized + intercept column).
    const Y_unitRet = completeIdx.map(i => unitReturns[i]);
    const Xstd = topFeatures.map(f => zScoreColumn(completeIdx.map(i => panel[i][f.key])));
    // Add intercept column of 1s
    const designMat = completeIdx.map((_, row) => [1, ...topFeatures.map((_, k) => Xstd[k][row])]);
    const ols = olsRegression(designMat, Y_unitRet);
    if (!ols) {
      report.push(`_(OLS solve failed — design matrix is singular; likely collinear features. Re-check §17D.)_`);
      report.push('');
    } else {
      const labels = ['(intercept)', ...topFeatures.map(f => f.label)];
      const v12Flags = ['   ', ...topFeatures.map(f => V12_ACTIVE_FEATURE_SET.has(f.key) ? ' 🟢' : '   ')];
      // Pack & rank by |β| (skip intercept).
      const rows = ols.beta.map((b, i) => ({ label: labels[i], v12: v12Flags[i], beta: b, se: ols.seBeta[i], t: ols.seBeta[i] > 0 ? b / ols.seBeta[i] : null, idx: i }));
      const intercept = rows[0];
      const featRows = rows.slice(1).sort((a, b) => Math.abs(b.beta) - Math.abs(a.beta));
      report.push(`**Model fit:** N = ${ols.n} picks · features = ${ols.p - 1} (+ intercept) · multiple R² = **${fmtN(ols.r2, 4)}** · adjusted R² = **${fmtN(ols.adjR2, 4)}** · residual sd = ${fmtN(ols.residSd, 3)}`);
      report.push('');
      report.push(`| Rank | Feature              | V12? | β (std)    | SE       | t-stat   | |β| rank |`);
      report.push(`|------|----------------------|------|------------|----------|----------|----------|`);
      for (let i = 0; i < featRows.length; i++) {
        const r = featRows[i];
        const tFlag = r.t != null
          ? (Math.abs(r.t) >= 2 ? ' (sig.)' : Math.abs(r.t) >= 1.5 ? ' (~sig)' : '       ')
          : '       ';
        report.push(`| ${String(i+1).padStart(4)} | ${r.label.padEnd(20)} | ${r.v12} | ${fmtSigned(r.beta, 4).padStart(10)} | ${fmtN(r.se, 4).padStart(8)} | ${(fmtSigned(r.t, 2) + tFlag).padStart(8)} | ${String(i+1).padStart(8)} |`);
      }
      report.push(`| —    | ${intercept.label.padEnd(20)} | ${intercept.v12} | ${fmtSigned(intercept.beta, 4).padStart(10)} | ${fmtN(intercept.se, 4).padStart(8)} | ${(fmtSigned(intercept.t, 2)).padStart(8)} | —        |`);
      report.push('');
      report.push(`> **|t-stat| ≥ 2** ≈ p < 0.05 (roughly significant). \`(~sig)\` flags |t| ≥ 1.5 — suggestive but not conclusive at our sample size. A feature with a large univariate r but small multivariate β is being **explained away** by other features in the panel.`);
      report.push('');

      // ────────────────────────────────────────────────────────────────
      // 17F — V12 vs the data-driven best
      // ────────────────────────────────────────────────────────────────
      report.push(`### 17F — V12 vs the data-driven best`);
      report.push('');
      report.push(`Cross-reference: of the top ${TOP_K} features by multivariate |β|, which does V12 actually use, and which does it ignore?`);
      report.push('');
      const usedByV12 = featRows.filter(r => topFeatures.find(f => f.label === r.label && V12_ACTIVE_FEATURE_SET.has(f.key)));
      const ignoredByV12 = featRows.filter(r => topFeatures.find(f => f.label === r.label && !V12_ACTIVE_FEATURE_SET.has(f.key)));
      const usedPct = featRows.length > 0 ? (usedByV12.length / featRows.length * 100).toFixed(0) : '—';
      report.push(`- **${usedByV12.length} / ${featRows.length}** top multivariate features are inputs to V12 (${usedPct}%).`);
      report.push(`- V12 consumes: ${usedByV12.length === 0 ? '_(none of the top features)_' : usedByV12.map(r => `\`${r.label}\` (β = ${fmtSigned(r.beta, 3)})`).join(', ')}`);
      report.push(`- V12 IGNORES: ${ignoredByV12.length === 0 ? '_(none — V12 covers every top feature)_' : ignoredByV12.map(r => `\`${r.label}\` (β = ${fmtSigned(r.beta, 3)}, t = ${fmtSigned(r.t, 2)})`).join(', ')}`);
      report.push('');

      // Compare AUC of V12 score alone vs AUC of the multivariate fit.
      const v12Scores = completeIdx.map(i => panel[i].agsV12).filter(Number.isFinite);
      const v12Wins   = completeIdx.filter(i => Number.isFinite(panel[i].agsV12)).map(i => wins[i]);
      const v12Auc    = v12Scores.length === v12Wins.length ? rocAuc(v12Scores, v12Wins) : null;
      // Build predicted ŷ from the multivariate fit and use it as a "model score" to compute AUC vs wins.
      const winsAligned = completeIdx.map(i => wins[i]);
      const yhatRet = ols.yhat;  // predicted unit-return; rank-equivalent for AUC
      const mvAuc = rocAuc(yhatRet, winsAligned);
      report.push(`| Model                              | AUC    | reads as                                                         |`);
      report.push(`|------------------------------------|--------|------------------------------------------------------------------|`);
      report.push(`| V12 score alone                    | ${fmtN(v12Auc, 3).padStart(6)} | how well V12's single number sorts winners from losers           |`);
      report.push(`| Multivariate OLS on top ${TOP_K} features | ${fmtN(mvAuc, 3).padStart(6)} | best AUC achievable by linearly combining the top features         |`);
      report.push('');
      report.push(`> ⚠ **Honesty caveat.** The multivariate AUC is **in-sample** — the model was fit on the same picks it's being scored against. Expect the true out-of-sample AUC to be lower by ~0.03–0.08, depending on how much of the gap is overfit. The point of this row is not to declare V12 "worse" but to flag the **maximum upside** still on the table; if even a haircutted out-of-sample version of the multivariate beats V12 by a clear margin, the feature set should be reconsidered.`);
      report.push('');
      if (v12Auc != null && mvAuc != null) {
        const gap = mvAuc - v12Auc;
        if (gap >= 0.04) {
          report.push(`> 🟡 **AUC gap = +${gap.toFixed(3)}.** The multivariate combination of currently-stamped features achieves materially better discrimination than V12's single score. Adding the top non-V12 features into the model could lift AUC by ~${(gap * 100).toFixed(1)}pp.`);
        } else if (gap >= 0.015) {
          report.push(`> 🟢 **AUC gap = +${gap.toFixed(3)}.** Modest but real — extra features marginally improve discrimination. Worth tracking; revisit when sample doubles.`);
        } else if (gap >= -0.015) {
          report.push(`> 🟢 **AUC gap ≈ 0** — V12 is capturing essentially all the linear signal available in the panel. The remaining features are noise.`);
        } else {
          report.push(`> ⚠ **AUC gap = ${gap.toFixed(3)}** (multivariate WORSE than V12 alone). Likely overfitting noise — V12's simpler form is genuinely better. Don't add features.`);
        }
        report.push('');
      }

      // ────────────────────────────────────────────────────────────────
      // 17G — Actionable recommendations
      // ────────────────────────────────────────────────────────────────
      report.push(`### 17G — Actionable recommendations`);
      report.push('');
      const recs = [];
      // 1. Top non-V12 feature with both strong univariate signal AND multivariate signal
      const candidates = featRows.filter(r => {
        const matched = topFeatures.find(f => f.label === r.label);
        return matched && !V12_ACTIVE_FEATURE_SET.has(matched.key) && Math.abs(r.t ?? 0) >= 1.5;
      });
      if (candidates.length > 0) {
        recs.push(`Consider adding one or more of these features to V12: ${candidates.slice(0, 3).map(c => `\`${c.label}\` (β = ${fmtSigned(c.beta, 3)}, t = ${fmtSigned(c.t, 2)})`).join(', ')}. They have a real multivariate effect after controlling for V12's existing inputs.`);
      }
      // 2. V12 features with weak multivariate β — candidates for simplification
      const weakV12 = featRows.filter(r => {
        const matched = topFeatures.find(f => f.label === r.label);
        return matched && V12_ACTIVE_FEATURE_SET.has(matched.key) && Math.abs(r.t ?? 0) < 0.8 && Math.abs(r.beta) < 0.01;
      });
      if (weakV12.length > 0) {
        recs.push(`Inputs V12 currently uses but that show weak multivariate signal: ${weakV12.map(r => `\`${r.label}\``).join(', ')}. They may be contributing noise rather than information.`);
      }
      // 3. Sample size guidance
      if (live.length < 500) {
        recs.push(`Sample size is currently ${live.length} live picks — statistically meaningful but tight. Treat single-feature recommendations as provisional until N ≥ 500. The rankings will firm up as the daily cron accumulates more graded picks.`);
      }
      // 4. R² interpretation
      if (ols.adjR2 < 0.02) {
        recs.push(`Adjusted R² of ${ols.adjR2.toFixed(4)} confirms that **sports picks are dominated by variance** — no realistic linear combination of stamped features will explain more than a few percent of outcome variance. The value of V12 (or any future model) lies in capturing the small, persistent signal at the top of the score distribution, not in high R² explanation.`);
      }
      if (recs.length === 0) {
        recs.push(`No high-confidence model-revision signal at current sample size. V12's feature selection is well-matched to what the data supports.`);
      }
      for (const rec of recs) report.push(`- ${rec}`);
      report.push('');
    }
  }
}

// ── § 14 — V12 Deep Performance Monitor (legacy block, kept for backwards
//   compatibility — slated for removal once the new monitor sections cover
//   every chart we still rely on) ────────────────────────────────────────
function buildV12DeepMonitorLegacy(report, agsuRows, allRows, eras, liveCal) {
  // intentionally unused; the old buildV12DeepMonitor body remains below
  // for grep-ability. Not invoked from main(). Remove in a follow-up PR.
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
  const [{ rows: agsuRows, cutover }, allRows, liveCal, modelEras, walletProfiles] = await Promise.all([
    loadAllAgsuGradedPicks(),
    loadAllGradedAndShadowPicks(),
    loadLiveCalibration(),
    loadModelEras(),
    loadWalletProfilesMap(),
  ]);
  console.log(`  AGS-U graded picks:    ${agsuRows.length}`);
  console.log(`  All sides (any state): ${allRows.length}`);
  console.log(`  Wallet profiles:       ${walletProfiles.size}`);
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
  // Keep FOR-side EDGE/TAPE analysis numbers on unopposed / legacy FAIL_OPEN rows
  // from stamped meanFor + netCLV (no wallet profile replay).
  fillForSideEdgeTapeFromStamps(v12Stats.v12Rows);
  fillForSideEdgeTapeFromStamps(v12Stats.v12RowsAll);

  buildHeader(report, cutover, liveCal, modelEras);

  // ── Core (read top-to-bottom) ───────────────────────────────────────────
  buildV12CeoExecutive(report, v12Stats, modelEras);
  buildV12Primer(report);
  buildV12DailyScoreboard(report, v12Stats);
  buildV12PathModifierBoard(report, v12Stats);
  buildV12TierAnalysis(report, v12Stats);
  buildV12TapeSizing(report, v12Stats);
  await buildSkillBandWindows(report, allRows);
  buildV12SideProfileAnalysis(report, v12Stats);
  buildV12SportMarketAnalysis(report, v12Stats);
  buildV12MuteAudit(report, v12Stats);
  buildV12RecentLivePicks(report, v12Stats, 30, walletProfiles);
  buildV12StatisticalMonitor(report, v12Stats);
  buildV12WalletInfluence(report, v12Stats, walletProfiles);

  // ── § 11 Ops (calibration + pool + pipeline) ───────────────────────────
  report.push(`## § 11 — Ops & Calibration`);
  report.push('');
  const opsStart = report.length;
  buildOperationalHealth(report, allRowsAgsu, agsuRows);
  for (let i = opsStart; i < report.length; i++) {
    report[i] = report[i]
      .replace(/^## § 10 — Operational Health.*$/, '### Pipeline sanity')
      .replace(/^## § 14 — Operational Health.*$/, '### Pipeline sanity');
  }
  const calStart = report.length;
  buildCalibrationSnapshot(report, liveCal);
  for (let i = calStart; i < report.length; i++) {
    report[i] = report[i]
      .replace(/^## § 11 — Calibration Snapshot.*$/, '### Live calibration thresholds')
      .replace(/^## § 15 — Live Calibration Snapshot.*$/, '### Live calibration thresholds');
  }
  const wpStart = report.length;
  await buildWalletPoolHealth(report);
  for (let i = wpStart; i < report.length; i++) {
    report[i] = report[i]
      .replace(/^## § 12 — Wallet Pool Health.*$/, '### Wallet pool')
      .replace(/^## § 16 — Wallet Pool Health.*$/, '### Wallet pool');
  }

  // ── Appendices (history / research — not the daily read) ───────────────
  report.push(`---`);
  report.push('');
  const verStart = report.length;
  buildVersionComparison(report, agsuRows, modelEras);
  for (let i = verStart; i < report.length; i++) {
    report[i] = report[i].replace(
      /^## § 0b — AGS-U Model Version Comparison/,
      '## Appendix A — Model Versions',
    );
  }
  const labStart = report.length;
  buildAgsFeatureLab(report, agsuRows);
  for (let i = labStart; i < report.length; i++) {
    report[i] = report[i].replace(/^## § 17 —/, '## Appendix B —');
  }

  report.push(`---`);
  report.push('');
  report.push(`*Generated by \`scripts/dailyAgsUReport.js\` · workflow \`daily-agsu-report.yml\` · V12-scoped unless Appendix.*`);

  const out = report.join('\n');
  const outPath = join(REPO_ROOT, 'DAILY_AGSU_REPORT.md');
  writeFileSync(outPath, out, 'utf8');
  console.log(`✓ Wrote ${outPath} (${out.length.toLocaleString()} chars)`);
}

main().catch(err => {
  console.error('FATAL', err);
  process.exit(1);
}).finally(() => process.exit(0));
