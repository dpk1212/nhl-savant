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
const AGSU_PROMOTION_TAG = 'ags-unified-v9';  // promoted-by tag is sticky across model bumps

// AGS-U sizing ladder multipliers (must match scripts/syncPickStateAuthoritative.js).
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
        const agsTier = sd.v8_agsTier || sd.v8_lockTier || null;
        const agsQuintile = Number.isFinite(sd.v8_agsQuintile) ? sd.v8_agsQuintile : null;
        const agsComponents = sd.v8_agsComponents || null;
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
  report.push(`Live calibration document used by both the cron and the UI:`);
  report.push('');
  report.push(`- **Computed at:** ${liveCal.computedAt || '—'}`);
  report.push(`- **Schema version:** \`${liveCal.schemaVersion || '—'}\``);
  report.push(`- **Source:** ${liveCal.source || '—'}`);
  report.push(`- **Sample size:** ${liveCal.sampleSize ?? '—'}`);
  report.push(`- **Date range:** ${liveCal.dateRange?.from || '—'} → ${liveCal.dateRange?.to || '—'}`);
  report.push(`- **Absolute mute floor:** ${fmtSigned(AGS_ABSOLUTE_MUTE_FLOOR, 2)} (safety bound below q20)`);
  report.push('');
  if (liveCal.quintiles) {
    report.push(`**AGS-U quintile boundaries (logit-score space):**`);
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
  if (liveCal.normalizers) {
    report.push(`**Feature normalizers (mean / sd) — z-scoring inputs to the model:**`);
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
      report.push(`> **⚠ Drift detected:** the calibration doc was written with different β coefficients than \`src/lib/ags.js\` exports. Re-deploy or re-run \`scripts/computeAgsCalibration.js\` to align: ${driftKeys.map(k => `\`${k}\``).join(', ')}.`);
      report.push('');
    } else {
      report.push(`> ✅ Calibration weights match \`src/lib/ags.js\` — no drift.`);
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

// ── Main ─────────────────────────────────────────────────────────────────
async function main() {
  console.log('AGS-U daily report — loading data...');
  const [{ rows: agsuRows, cutover }, allRows, liveCal] = await Promise.all([
    loadAllAgsuGradedPicks(),
    loadAllGradedAndShadowPicks(),
    loadLiveCalibration(),
  ]);
  console.log(`  AGS-U graded picks:    ${agsuRows.length}`);
  console.log(`  All sides (any state): ${allRows.length}`);
  console.log(`  Cutover:               ${cutover}`);
  console.log(`  Active model schema:   ${liveCal?.schemaVersion || AGS_FALLBACK_CALIBRATION.schemaVersion}`);
  console.log(`  Active features:       [${ACTIVE_FEATURE_KEYS.join(', ')}]`);

  const report = [];
  buildHeader(report, cutover, liveCal);
  buildActiveModelCard(report, liveCal);
  buildExecutiveSummary(report, agsuRows, cutover);
  buildTierCalibration(report, agsuRows);
  buildQuintileCalibration(report, agsuRows);
  buildModelRankingMetrics(report, agsuRows);
  buildUnivariateFeatures(report, agsuRows);
  buildFeatureAttribution(report, agsuRows);
  buildHcCrossTab(report, agsuRows);
  buildReliability(report, agsuRows);
  buildRecentPicks(report, agsuRows, RECENT_N);
  buildSizingAudit(report, agsuRows);
  buildMuteValidation(report, allRows, liveCal);
  buildDailyTrend(report, agsuRows);
  buildOperationalHealth(report, allRows.filter(r => r.promotedBy === AGSU_PROMOTION_TAG), agsuRows);
  buildCalibrationSnapshot(report, liveCal);
  await buildWalletPoolHealth(report);

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
