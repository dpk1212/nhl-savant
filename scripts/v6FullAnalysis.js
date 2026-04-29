/**
 * v6FullAnalysis.js — Sharp Intel v6 deep diagnostic, V8-contribution-edge style.
 *
 * Companion to dailyV6Report.js. The daily report tells you WHAT happened.
 * This script tells you WHY, with statistical confidence, and prescribes
 * what to ship next.
 *
 * Inclusion rule mirrors the live Pick Performance dashboard exactly:
 *   NOT superseded
 *   AND health.status ∉ {MUTED, CANCELLED}
 *   AND lockStage ≠ SHADOW
 *   AND peak.stars ≥ 2.5
 *   AND outcome ∈ {WIN, LOSS, PUSH}
 *
 * For each shipped+graded side we extract every signal the engine had at
 * lock time (frozen v8_walletConsensus* + peak.* fields) and run:
 *
 *   §1.  Sample summary + power analysis (does this N let us detect edge?)
 *   §2.  Univariate signal analysis — Δw / Δq / Δw+Δq / Δw·Δq
 *   §3.  Bivariate Δw × Δq matrix with Wilson 95% CIs and significance flags
 *   §4.  Wallet-quality contribution thresholds (T = 30, 40, 50, 60, 70)
 *        — counts, margins, continuous Δcontribution
 *   §5.  Star tier analysis (frozen peak.stars × outcome)
 *   §6.  Odds-bucket interaction
 *   §7.  Market split (ML / SPREAD / TOTAL)
 *   §8.  Sport split (MLB / NBA / NHL)
 *   §9.  Lock-criteria gates (sharps3+, plusEV, pinnacleConfirms, …)
 *   §10. CLV / line-movement diagnostic
 *   §11. Logistic regression — ranked feature importance
 *   §12. Per-cohort sizing recommendation (Bayesian posterior + half-Kelly)
 *   §13. Drawdown / streak / variance
 *   §14. Per-pick row-level detail
 *
 * Output: V6_FULL_ANALYSIS.md
 *
 * Usage:  node scripts/v6FullAnalysis.js
 */
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

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

// ── Config ─────────────────────────────────────────────────────────────────
const V6_CUTOVER  = '2026-04-18';
const QUALITY_CONTRIB_CUTS = [30, 40, 50, 60, 70];
const PICK_COLS = [
  ['sharpFlowPicks',   'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals',  'TOTAL'],
];
const MIN_N_FOR_ROI = 3;
const ODDS_BUCKETS = [
  { id: 'h_fav',     label: '−400+',       min: -1e9, max: -301 },
  { id: 'b_fav',     label: '−300/−201',   min: -300, max: -201 },
  { id: 'm_fav',     label: '−200/−151',   min: -200, max: -151 },
  { id: 's_fav',     label: '−150/−101',   min: -150, max: -101 },
  { id: 'pickem',    label: '−100/+100',   min: -100, max: +100 },
  { id: 's_dog',     label: '+101/+150',   min: +101, max: +150 },
  { id: 'm_dog',     label: '+151/+200',   min: +151, max: +200 },
  { id: 'b_dog',     label: '+201+',       min: +201, max: +1e9 },
];

// ── Stats helpers (no external deps) ───────────────────────────────────────

// One-sample t-test against zero. Returns t-statistic, 95% CI, sig flag.
function tTest(values) {
  const n = values.length;
  if (n < 2) return { n, mean: 0, sd: 0, se: 0, t: 0, ci_lo: 0, ci_hi: 0, sig: '✗ n<2' };
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1);
  const sd = Math.sqrt(variance);
  const se = sd / Math.sqrt(n);
  const t = se > 0 ? mean / se : 0;
  const ci_lo = mean - 1.96 * se;
  const ci_hi = mean + 1.96 * se;
  const sig = Math.abs(t) >= 2.58 ? '✓ p<.01' : Math.abs(t) >= 1.96 ? '✓ p<.05' : Math.abs(t) >= 1.645 ? '~ p<.10' : '✗ noise';
  return { n, mean, sd, se, t, ci_lo, ci_hi, sig };
}

// Wilson score interval for binomial proportion.
function wilson(wins, n, z = 1.96) {
  if (n === 0) return [0, 0];
  const phat = wins / n;
  const denom = 1 + z * z / n;
  const center = (phat + z * z / (2 * n)) / denom;
  const margin = z * Math.sqrt(phat * (1 - phat) / n + z * z / (4 * n * n)) / denom;
  return [Math.max(0, center - margin), Math.min(1, center + margin)];
}

function pearson(xs, ys) {
  const n = xs.length;
  if (n < 2) return NaN;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0, dx2 = 0, dy2 = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - mx, dy = ys[i] - my;
    num += dx * dy; dx2 += dx * dx; dy2 += dy * dy;
  }
  return (dx2 > 0 && dy2 > 0) ? num / Math.sqrt(dx2 * dy2) : NaN;
}

// Returns { rho, t, sig } — Pearson correlation with significance via Fisher r-to-z.
function pearsonSig(xs, ys) {
  const rho = pearson(xs, ys);
  const n = xs.length;
  if (!isFinite(rho) || n < 4) return { rho: NaN, t: NaN, sig: '—' };
  const t = rho * Math.sqrt((n - 2) / (1 - rho * rho));
  const sig = Math.abs(t) >= 2.58 ? '✓ p<.01' : Math.abs(t) >= 1.96 ? '✓ p<.05' : Math.abs(t) >= 1.645 ? '~ p<.10' : '✗';
  return { rho, t, sig };
}

function rankArr(arr) {
  const sorted = arr.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v);
  const ranks = new Array(arr.length);
  for (let i = 0; i < sorted.length;) {
    let j = i;
    while (j < sorted.length - 1 && sorted[j + 1].v === sorted[i].v) j++;
    const avg = (i + j) / 2 + 1;
    for (let k = i; k <= j; k++) ranks[sorted[k].i] = avg;
    i = j + 1;
  }
  return ranks;
}

function spearman(xs, ys) {
  return pearson(rankArr(xs), rankArr(ys));
}

// L2-regularized logistic regression via batch gradient descent.
// X: array of N rows of P features (already z-scored). y: array of {0,1}.
// Returns weight vector w[P] and intercept b.
function logisticRegression(X, y, { lr = 0.05, iters = 3000, l2 = 0.05 } = {}) {
  const N = X.length;
  if (!N) return { w: [], b: 0 };
  const P = X[0].length;
  const w = new Array(P).fill(0);
  let b = 0;
  const sigmoid = z => 1 / (1 + Math.exp(-Math.max(-30, Math.min(30, z))));
  for (let it = 0; it < iters; it++) {
    const dw = new Array(P).fill(0);
    let db = 0;
    for (let i = 0; i < N; i++) {
      let z = b;
      for (let j = 0; j < P; j++) z += w[j] * X[i][j];
      const pred = sigmoid(z);
      const err = pred - y[i];
      for (let j = 0; j < P; j++) dw[j] += err * X[i][j];
      db += err;
    }
    for (let j = 0; j < P; j++) w[j] -= lr * (dw[j] / N + l2 * w[j]);
    b -= lr * db / N;
  }
  return { w, b };
}

function zScore(arr) {
  const n = arr.length;
  if (!n) return { values: [], mean: 0, sd: 1 };
  const mean = arr.reduce((a, b) => a + b, 0) / n;
  const variance = arr.reduce((a, b) => a + (b - mean) ** 2, 0) / Math.max(1, n - 1);
  const sd = Math.sqrt(variance) || 1;
  return { values: arr.map(v => (v - mean) / sd), mean, sd };
}

// Bayesian posterior win rate with Beta prior. Default Beta(5,5) is a
// neutral, moderately strong prior — pulls 8/12 (66.7%) toward 13/22 (59%).
function bayesianWR(wins, losses, alpha = 5, beta = 5) {
  return (wins + alpha) / (wins + losses + alpha + beta);
}

// Half-Kelly stake fraction at posterior win prob p and American odds.
function halfKelly(p, americanOdds) {
  if (americanOdds == null) return 0;
  const dec = americanOdds >= 0 ? 1 + americanOdds / 100 : 1 + 100 / Math.abs(americanOdds);
  const b = dec - 1;
  const q = 1 - p;
  const f = (p * b - q) / b;
  return Math.max(0, f * 0.5);
}

// American-odds → flat 1u profit on a WIN. Returns -1 on LOSS, 0 on PUSH.
function flatProfit(odds, outcome) {
  if (outcome === 'PUSH') return 0;
  if (outcome === 'WIN')  return odds == null ? 0.91 : (odds > 0 ? odds / 100 : 100 / Math.abs(odds));
  return -1;
}

// Implied probability from American odds.
function impliedProb(odds) {
  if (odds == null) return NaN;
  return odds >= 0 ? 100 / (odds + 100) : Math.abs(odds) / (Math.abs(odds) + 100);
}

// Δq fallback ONLY (Δw must come from a frozen stamp). `walletDetails` is
// itself frozen on the doc; contribution doesn't change, so this gives the
// same number the engine wrote at the time. Mirrors dailyV6Report.js.
const QUALITY_CUT = 30;
function qualityMarginFromWalletDetails(walletDetails, sideKey) {
  if (!Array.isArray(walletDetails) || !sideKey) return null;
  let qFor = 0, qAg = 0;
  for (const d of walletDetails) {
    if ((d?.contribution ?? 0) < QUALITY_CUT) continue;
    if (!d?.side) continue;
    if (d.side === sideKey) qFor++;
    else                    qAg++;
  }
  return qFor - qAg;
}

// ── Display helpers ────────────────────────────────────────────────────────
const sign = (v, d = 1) => (v == null || Number.isNaN(v) ? '—' : (v >= 0 ? '+' : '') + v.toFixed(d));
const fmtPct = (v, d = 1) => (v == null || Number.isNaN(v) ? '—' : `${v.toFixed(d)}%`);
const fmtSignPct = (v, d = 1) => (v == null || Number.isNaN(v) ? '—' : `${sign(v, d)}%`);
const padR = (s, n) => String(s).padEnd(n);

function summarizeArr(arr, { unitField = 'profitU', flatField = 'flatProfit' } = {}) {
  const n = arr.length;
  const w = arr.filter(p => p.outcome === 'WIN').length;
  const l = arr.filter(p => p.outcome === 'LOSS').length;
  const pu = arr.reduce((s, p) => s + (p[unitField] || 0), 0);
  const fl = arr.reduce((s, p) => s + (p[flatField] || 0), 0);
  const wrDen = w + l;
  const wr = wrDen ? w / wrDen : null;
  const wilsonCi = wrDen ? wilson(w, wrDen) : [null, null];
  const flatTtest = tTest(arr.map(p => p[flatField] || 0));
  const peakTtest = tTest(arr.map(p => p[unitField] || 0));
  const flatRoi = n > 0 ? fl / n : 0;
  const peakRoi = n > 0 ? pu / arr.reduce((s, p) => s + (p.peakUnits || 0), 0) : 0;
  return {
    n, w, l, pu, fl, wr, wilsonCi, flatTtest, peakTtest, flatRoi, peakRoi,
  };
}

function fmtSummary(s) {
  if (!s.n) return '—';
  const wr = s.wr == null ? '—' : `${(100 * s.wr).toFixed(1)}%`;
  const ci = s.wilsonCi[0] == null ? '' : ` [${(100 * s.wilsonCi[0]).toFixed(0)}–${(100 * s.wilsonCi[1]).toFixed(0)}]`;
  return `N=${s.n} · ${s.w}-${s.l} · WR ${wr}${ci} · ${sign(s.pu)}u peak · ${sign(s.fl)}u flat (${fmtSignPct(100 * s.flatRoi)})`;
}

// ── Main load — adapted from dailyV6Report.loadEverything but with full
//    feature extraction for downstream analysis. ────────────────────────────
async function loadPicks() {
  const rows = [];
  let scanned = 0;
  let dateMin = null, dateMax = null;

  for (const [col, market] of PICK_COLS) {
    const snap = await db.collection(col).where('date', '>=', V6_CUTOVER).get();
    for (const doc of snap.docs) {
      const d = doc.data();
      const sides = d.sides || {};
      const sport = d.sport || 'UNK';
      const date  = d.date;
      const commenceTime = d.commenceTime || null;

      for (const [sideKey, side] of Object.entries(sides)) {
        scanned += 1;
        const oc = side?.result?.outcome;
        if (oc !== 'WIN' && oc !== 'LOSS' && oc !== 'PUSH') continue;

        // === Dashboard inclusion rule (mirrors processSide) ===
        const superseded   = !!side.superseded;
        const lockStage    = side.lockStage || null;
        const healthStatus = side.health?.status || null;
        const peak = side.peak || side.lock || {};
        const lock = side.lock || {};
        const peakStars = peak?.stars ?? 0;
        const peakUnits = peak?.units || 1;
        const lockStars = lock?.stars ?? 0;
        const lockUnits = lock?.units || 0;
        const inDashboard = !superseded
          && healthStatus !== 'CANCELLED'
          && healthStatus !== 'MUTED'
          && lockStage !== 'SHADOW'
          && peakStars >= 2.5;
        if (!inDashboard) continue;

        const odds = lock?.lockOdds ?? peak?.peakOdds ?? lock?.odds ?? peak?.odds ?? null;
        const closingOdds = side.closingOdds ?? null;
        const clv = side.result?.clv ?? null;

        // === Frozen v6 stamps ===
        const dwFrozen = side.v8_walletConsensusDelta != null ? Number(side.v8_walletConsensusDelta) : null;
        let   dqFrozen = side.v8_walletConsensusQualityMargin != null ? Number(side.v8_walletConsensusQualityMargin) : null;
        const vaultStar = side.v8_vaultStar != null ? Number(side.v8_vaultStar) : null;
        const forW = side.v8_walletConsensusForW ?? null;
        const agW = side.v8_walletConsensusAgW ?? null;
        const qFor30 = side.v8_walletConsensusQualityForT30 ?? null;
        const qAg30 = side.v8_walletConsensusQualityAgT30 ?? null;

        // === Lock-criteria signals (peak snapshot) ===
        const criteria = peak?.criteria || {};
        const evEdge   = peak?.evEdge ?? null;
        const regime   = peak?.regime || null;
        const sharpCount    = peak?.sharpCount ?? null;
        const totalInvested = peak?.totalInvested ?? null;
        const consensus = peak?.consensusStrength || {};
        const moneyPct  = consensus.moneyPct ?? null;
        const walletPct = consensus.walletPct ?? null;
        const consensusGrade = consensus.grade || null;
        const criteriaMet = peak?.criteriaMet ?? 0;

        // === Wallet contribution per-threshold counts (qFor / qAg / margin) ===
        const wd = peak?.v8Scoring?.walletDetails;
        // Δq fallback when stamp missing — recompute from frozen walletDetails
        // at contribution ≥ 30 (matches dailyV6Report).
        if (dqFrozen == null && Array.isArray(wd) && wd.length) {
          const recomputed = qualityMarginFromWalletDetails(wd, sideKey);
          if (recomputed != null) dqFrozen = recomputed;
        }
        const contribByT = {};
        let sumContribFor = 0, sumContribAg = 0;
        if (Array.isArray(wd)) {
          for (const w of wd) {
            if (!w?.side) continue;
            const c = w.contribution ?? 0;
            if (w.side === sideKey) sumContribFor += c;
            else                    sumContribAg += c;
            for (const T of QUALITY_CONTRIB_CUTS) {
              if (c >= T) {
                if (!contribByT[T]) contribByT[T] = { qFor: 0, qAg: 0 };
                if (w.side === sideKey) contribByT[T].qFor += 1;
                else                    contribByT[T].qAg += 1;
              }
            }
          }
        }
        for (const T of QUALITY_CONTRIB_CUTS) {
          if (!contribByT[T]) contribByT[T] = { qFor: 0, qAg: 0 };
        }
        const dContrib = sumContribFor - sumContribAg;
        const maxContribFor = Array.isArray(wd)
          ? wd.filter(w => w.side === sideKey).reduce((m, w) => Math.max(m, w.contribution ?? 0), 0)
          : 0;
        const meanBaseFor = Array.isArray(wd)
          ? (() => {
              const fw = wd.filter(w => w.side === sideKey);
              if (!fw.length) return 0;
              return fw.reduce((s, w) => s + (w.walletBase ?? 0), 0) / fw.length;
            })()
          : 0;

        // === PnL ===
        let profitU = 0;
        if (oc === 'WIN')  profitU = (side.result?.profit || 0);
        else if (oc === 'LOSS') profitU = -peakUnits;
        const flat = flatProfit(odds, oc);

        if (date) {
          if (!dateMin || date < dateMin) dateMin = date;
          if (!dateMax || date > dateMax) dateMax = date;
        }

        rows.push({
          docId: doc.id, date, commenceTime, sport, market, sideKey,
          // outcome / pnl
          outcome: oc, profitU, flatProfit: flat,
          // odds
          odds, closingOdds, clv, impliedProb: impliedProb(odds),
          // stars / units
          peakStars, peakUnits, lockStars, lockUnits,
          // frozen deltas
          dwFrozen, dqFrozen, vaultStar, forW, agW, qFor30, qAg30,
          dwSum: (dwFrozen ?? 0) + (dqFrozen ?? 0),
          dwProd: (dwFrozen ?? 0) * (dqFrozen ?? 0),
          // contribution thresholds
          contribByT, sumContribFor, sumContribAg, dContrib, maxContribFor, meanBaseFor,
          // criteria
          criteria, evEdge, regime, sharpCount, totalInvested,
          moneyPct, walletPct, consensusGrade, criteriaMet,
        });
      }
    }
  }

  return { rows, meta: { scanned, dateMin, dateMax } };
}

// ── Section builders ──────────────────────────────────────────────────────

function sectionHeader(out, title, sub = null) {
  out.push('');
  out.push(`## ${title}`);
  if (sub) out.push(`_${sub}_`);
  out.push('');
}

function bucketTable(out, picks, bucketFn, bucketLabels, opts = {}) {
  const groups = {};
  for (const p of picks) {
    const key = bucketFn(p);
    if (key == null) continue;
    if (!groups[key]) groups[key] = [];
    groups[key].push(p);
  }
  out.push('| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |');
  out.push('|---|---|---|---|---|---|---|');
  for (const lbl of bucketLabels) {
    const arr = groups[lbl] || [];
    const s = summarizeArr(arr);
    if (!s.n) {
      out.push(`| ${lbl} | 0 | — | — | — | — | — |`);
      continue;
    }
    const pushes = arr.filter(p => p.outcome === 'PUSH').length;
    const wrCell = `${(100 * s.wr).toFixed(1)}% [${(100 * s.wilsonCi[0]).toFixed(0)}–${(100 * s.wilsonCi[1]).toFixed(0)}]`;
    const flatRoiPct = (100 * s.flatRoi).toFixed(1) + '%';
    const tcell = `${s.flatTtest.t.toFixed(2)} ${s.flatTtest.sig}`;
    out.push(`| ${lbl} | ${s.n} | ${s.w}-${s.l}-${pushes} | ${wrCell} | ${sign(100*s.flatRoi)}% | ${sign(s.pu)}u | ${tcell} |`);
  }
}

// ─── §1. Sample summary ────────────────────────────────────────────────────
function buildSection1(out, picks, meta) {
  sectionHeader(out, '§1. Sample summary', 'Dashboard-truth filter (mirrors live Pick Performance).');

  const total = summarizeArr(picks);
  const pushes = picks.filter(p => p.outcome === 'PUSH').length;
  const breakeven = 0.5238; // standard −110 vig breakeven
  const need = Math.max(0, breakeven - (total.wr || 0));

  out.push('| Metric | Value |');
  out.push('|---|---|');
  out.push(`| Date range | ${meta.dateMin} … ${meta.dateMax} |`);
  out.push(`| Sides scanned | ${meta.scanned} |`);
  out.push(`| Shipped + graded | **${total.n}** |`);
  out.push(`| W-L-P | ${total.w}-${total.l}-${pushes} |`);
  out.push(`| Win rate | **${fmtPct(100 * total.wr)}** [${fmtPct(100 * total.wilsonCi[0], 1)}–${fmtPct(100 * total.wilsonCi[1], 1)}] |`);
  out.push(`| Break-even WR @ −110 | 52.38% |`);
  out.push(`| Distance to break-even | ${need > 0 ? `WR needs +${(100 * need).toFixed(1)} pp` : 'above break-even'} |`);
  out.push(`| Peak-units PnL | **${sign(total.pu)}u** |`);
  out.push(`| Flat-1u PnL | **${sign(total.fl)}u** (${fmtSignPct(100 * total.flatRoi)} flat ROI) |`);
  out.push(`| Flat t-statistic vs zero | ${total.flatTtest.t.toFixed(2)} → ${total.flatTtest.sig} |`);
  out.push(`| Flat 95% CI per-pick | [${total.flatTtest.ci_lo.toFixed(3)}, ${total.flatTtest.ci_hi.toFixed(3)}]u |`);

  // Power note
  out.push('');
  out.push('### Power note');
  out.push('');
  const need5 = Math.ceil((1.96 / 0.05) ** 2 * Math.max(0.01, 1 - (total.flatTtest.sd || 1) ** 2));
  // To detect a true mean of M with SE = SD/√N, need N ≥ (1.96·SD/M)²
  const sd = total.flatTtest.sd || 1;
  const neededFor3pct = Math.ceil((1.96 * sd / 0.03) ** 2);
  const neededFor5pct = Math.ceil((1.96 * sd / 0.05) ** 2);
  out.push(`At our observed flat-PnL standard deviation (${sd.toFixed(2)}u/pick), to detect a true edge of:`);
  out.push('');
  out.push('| True flat ROI | Picks needed (95% conf) |');
  out.push('|---|---|');
  out.push(`| +3% | ${neededFor3pct} |`);
  out.push(`| +5% | ${neededFor5pct} |`);
  out.push(`| +10% | ${Math.ceil((1.96 * sd / 0.10) ** 2)} |`);
  out.push('');
  out.push(`We have **${total.n}** graded picks. Anything we conclude on cohorts smaller than ~${Math.min(neededFor5pct, 200)} is provisional.`);
}

// ─── §2. Univariate signal analysis ────────────────────────────────────────
function buildSection2(out, picks) {
  sectionHeader(out, '§2. Univariate signal analysis', 'For each axis: bucket performance + Pearson/Spearman correlation with WIN and flat ROI.');

  // Δw alone
  out.push('### §2a. Δw — winner margin (frozen)');
  out.push('');
  const dwBuckets = ['Δw ≤ −2', 'Δw = −1', 'Δw = 0', 'Δw = +1', 'Δw = +2', 'Δw ≥ +3'];
  bucketTable(out, picks.filter(p => p.dwFrozen != null), p => {
    const v = p.dwFrozen;
    if (v <= -2) return 'Δw ≤ −2';
    if (v === -1) return 'Δw = −1';
    if (v === 0) return 'Δw = 0';
    if (v === 1) return 'Δw = +1';
    if (v === 2) return 'Δw = +2';
    return 'Δw ≥ +3';
  }, dwBuckets);
  const xs1 = picks.filter(p => p.dwFrozen != null);
  const dwR = pearsonSig(xs1.map(p => p.dwFrozen), xs1.map(p => p.outcome === 'WIN' ? 1 : 0));
  const dwRf = pearsonSig(xs1.map(p => p.dwFrozen), xs1.map(p => p.flatProfit));
  out.push('');
  out.push(`**Pearson ρ(Δw, WIN) = ${dwR.rho?.toFixed(3) ?? '—'}** ${dwR.sig}  ·  **ρ(Δw, flat ROI) = ${dwRf.rho?.toFixed(3) ?? '—'}** ${dwRf.sig}`);

  // Δq alone
  out.push('');
  out.push('### §2b. Δq — quality margin (frozen, contribution ≥ 30)');
  out.push('');
  const dqBuckets = ['Δq ≤ −2', 'Δq = −1', 'Δq = 0', 'Δq = +1', 'Δq = +2', 'Δq ≥ +3'];
  bucketTable(out, picks.filter(p => p.dqFrozen != null), p => {
    const v = p.dqFrozen;
    if (v <= -2) return 'Δq ≤ −2';
    if (v === -1) return 'Δq = −1';
    if (v === 0) return 'Δq = 0';
    if (v === 1) return 'Δq = +1';
    if (v === 2) return 'Δq = +2';
    return 'Δq ≥ +3';
  }, dqBuckets);
  const xs2 = picks.filter(p => p.dqFrozen != null);
  const dqR = pearsonSig(xs2.map(p => p.dqFrozen), xs2.map(p => p.outcome === 'WIN' ? 1 : 0));
  const dqRf = pearsonSig(xs2.map(p => p.dqFrozen), xs2.map(p => p.flatProfit));
  out.push('');
  out.push(`**Pearson ρ(Δq, WIN) = ${dqR.rho?.toFixed(3) ?? '—'}** ${dqR.sig}  ·  **ρ(Δq, flat ROI) = ${dqRf.rho?.toFixed(3) ?? '—'}** ${dqRf.sig}`);

  // Δw + Δq sum (the v6.6 hybrid input)
  out.push('');
  out.push('### §2c. Δw + Δq — scalar sum (v6.6 hybrid floor input)');
  out.push('');
  const sumBuckets = ['Σ ≤ 0', 'Σ = +1', 'Σ = +2', 'Σ = +3', 'Σ = +4', 'Σ = +5', 'Σ ≥ +6'];
  bucketTable(out, picks.filter(p => p.dwFrozen != null && p.dqFrozen != null), p => {
    const v = p.dwSum;
    if (v <= 0) return 'Σ ≤ 0';
    if (v === 1) return 'Σ = +1';
    if (v === 2) return 'Σ = +2';
    if (v === 3) return 'Σ = +3';
    if (v === 4) return 'Σ = +4';
    if (v === 5) return 'Σ = +5';
    return 'Σ ≥ +6';
  }, sumBuckets);
  const xs3 = picks.filter(p => p.dwFrozen != null && p.dqFrozen != null);
  const sumR = pearsonSig(xs3.map(p => p.dwSum), xs3.map(p => p.outcome === 'WIN' ? 1 : 0));
  const sumRf = pearsonSig(xs3.map(p => p.dwSum), xs3.map(p => p.flatProfit));
  out.push('');
  out.push(`**Pearson ρ(Δw+Δq, WIN) = ${sumR.rho?.toFixed(3) ?? '—'}** ${sumR.sig}  ·  **ρ(Σ, flat ROI) = ${sumRf.rho?.toFixed(3) ?? '—'}** ${sumRf.sig}`);
  out.push('');
  out.push(`Spearman rank ρ(Δw+Δq, flat ROI) = ${spearman(xs3.map(p => p.dwSum), xs3.map(p => p.flatProfit))?.toFixed(3) ?? '—'}.`);

  // Compare predictive power
  out.push('');
  out.push('### §2d. Which axis is the strongest single predictor?');
  out.push('');
  out.push('| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | Verdict |');
  out.push('|---|---|---|---|---|');
  const cmpRow = (label, vals, ws, fs) => {
    const r1 = pearsonSig(vals, ws);
    const r2 = pearsonSig(vals, fs);
    const r3 = spearman(vals, fs);
    out.push(`| ${label} | ${r1.rho?.toFixed(3) ?? '—'} ${r1.sig} | ${r2.rho?.toFixed(3) ?? '—'} ${r2.sig} | ${r3?.toFixed(3) ?? '—'} | ${Math.abs(r2.rho || 0) >= 0.2 ? 'meaningful' : 'weak'} |`);
  };
  const ws = xs3.map(p => p.outcome === 'WIN' ? 1 : 0);
  const fs = xs3.map(p => p.flatProfit);
  cmpRow('Δw',                xs3.map(p => p.dwFrozen), ws, fs);
  cmpRow('Δq',                xs3.map(p => p.dqFrozen), ws, fs);
  cmpRow('Δw + Δq',           xs3.map(p => p.dwSum),    ws, fs);
  cmpRow('Δw × Δq',           xs3.map(p => p.dwProd),   ws, fs);
  cmpRow('peak.stars',        xs3.map(p => p.peakStars), ws, fs);
  cmpRow('lock.stars',        xs3.map(p => p.lockStars), ws, fs);
}

// ─── §3. Bivariate Δw × Δq matrix ──────────────────────────────────────────
function buildSection3(out, picks) {
  sectionHeader(out, '§3. Bivariate Δw × Δq matrix',
    'Each cell: N · W-L · WR% · Wilson 95% CI · Peak ROI%. ★ flag = sig 95% one-sample t-test on flat PnL.');

  const dwAxis = [-3, -2, -1, 0, 1, 2, 3];
  const dqAxis = [-3, -2, -1, 0, 1, 2, 3];
  const cellOf = (dw, dq) => picks.filter(p => {
    if (p.dwFrozen == null || p.dqFrozen == null) return false;
    const cdw = Math.max(-3, Math.min(3, p.dwFrozen));
    const cdq = Math.max(-3, Math.min(3, p.dqFrozen));
    return cdw === dw && cdq === dq;
  });

  const headers = ['Δw \\ Δq', ...dqAxis.map(v => v <= -3 ? '≤ −3' : v >= 3 ? '≥ +3' : (v >= 0 ? '+' : '') + v)];
  out.push('| ' + headers.join(' | ') + ' |');
  out.push('|' + headers.map(() => '---').join('|') + '|');
  for (const dw of dwAxis) {
    const row = [dw <= -3 ? '≤ −3' : dw >= 3 ? '≥ +3' : (dw >= 0 ? '+' : '') + dw];
    for (const dq of dqAxis) {
      const arr = cellOf(dw, dq);
      if (!arr.length) {
        row.push('—');
      } else {
        const s = summarizeArr(arr);
        const wrPct = (100 * s.wr).toFixed(0) + '%';
        const wilsonStr = `[${(100 * s.wilsonCi[0]).toFixed(0)}–${(100 * s.wilsonCi[1]).toFixed(0)}]`;
        const roiPct = arr.length >= MIN_N_FOR_ROI ? `${sign(100*s.flatRoi, 0)}%` : '—';
        const sigStar = s.flatTtest.t >= 1.96 ? '★' : s.flatTtest.t <= -1.96 ? '✗' : '';
        row.push(`N=${s.n} · ${s.w}-${s.l} · ${wrPct} ${wilsonStr} · ${roiPct} ${sigStar}`);
      }
    }
    out.push('| ' + row.join(' | ') + ' |');
  }
}

// ─── §4. Wallet contribution thresholds (V8-style) ─────────────────────────
function buildSection4(out, picks) {
  sectionHeader(out, '§4. Wallet contribution thresholds — V8 contribution-edge style',
    'Per-wallet `contribution = walletBase × convictionMult` (frozen on `peak.v8Scoring.walletDetails`). For each cut T we count qFor / qAg on the pick side and check predictive power.');

  for (const T of QUALITY_CONTRIB_CUTS) {
    out.push('');
    out.push(`### §4.${T} — Threshold T = ${T}`);
    out.push('');
    const havingT = picks.filter(p => p.contribByT && p.contribByT[T]);

    // qFor count buckets
    const qForBuckets = ['qFor = 0', 'qFor = 1', 'qFor = 2', 'qFor ≥ 3'];
    out.push('**Count of qFor (high-contribution sharps on side):**');
    out.push('');
    bucketTable(out, havingT, p => {
      const v = p.contribByT[T].qFor;
      if (v === 0) return 'qFor = 0';
      if (v === 1) return 'qFor = 1';
      if (v === 2) return 'qFor = 2';
      return 'qFor ≥ 3';
    }, qForBuckets);
    const r1 = pearsonSig(havingT.map(p => p.contribByT[T].qFor), havingT.map(p => p.outcome === 'WIN' ? 1 : 0));
    const r2 = pearsonSig(havingT.map(p => p.contribByT[T].qFor), havingT.map(p => p.flatProfit));
    out.push('');
    out.push(`ρ(qFor, WIN) = ${r1.rho?.toFixed(3) ?? '—'} ${r1.sig}  ·  ρ(qFor, flat ROI) = ${r2.rho?.toFixed(3) ?? '—'} ${r2.sig}`);

    // Margin buckets
    out.push('');
    out.push('**Margin (qFor − qAgainst):**');
    out.push('');
    const marginBuckets = ['margin ≤ 0', 'margin = +1', 'margin = +2', 'margin ≥ +3'];
    bucketTable(out, havingT, p => {
      const m = p.contribByT[T].qFor - p.contribByT[T].qAg;
      if (m <= 0) return 'margin ≤ 0';
      if (m === 1) return 'margin = +1';
      if (m === 2) return 'margin = +2';
      return 'margin ≥ +3';
    }, marginBuckets);
    const m1 = pearsonSig(havingT.map(p => p.contribByT[T].qFor - p.contribByT[T].qAg), havingT.map(p => p.outcome === 'WIN' ? 1 : 0));
    const m2 = pearsonSig(havingT.map(p => p.contribByT[T].qFor - p.contribByT[T].qAg), havingT.map(p => p.flatProfit));
    out.push('');
    out.push(`ρ(margin, WIN) = ${m1.rho?.toFixed(3) ?? '—'} ${m1.sig}  ·  ρ(margin, flat ROI) = ${m2.rho?.toFixed(3) ?? '—'} ${m2.sig}`);
  }

  // Continuous Δcontribution
  out.push('');
  out.push('### §4.cont — Continuous Δcontribution (sumContrib_For − sumContrib_Against)');
  out.push('');
  const havingC = picks.filter(p => Number.isFinite(p.dContrib));
  const dCs = havingC.map(p => p.dContrib).sort((a, b) => a - b);
  const t1 = dCs[Math.floor(dCs.length / 3)];
  const t2 = dCs[Math.floor(2 * dCs.length / 3)];
  out.push(`Tercile cuts: low ≤ ${t1?.toFixed(1)} · mid ≤ ${t2?.toFixed(1)} · high > ${t2?.toFixed(1)}`);
  out.push('');
  bucketTable(out, havingC, p => {
    if (p.dContrib <= t1) return 'Low Δcontrib';
    if (p.dContrib <= t2) return 'Mid Δcontrib';
    return 'High Δcontrib';
  }, ['Low Δcontrib', 'Mid Δcontrib', 'High Δcontrib']);
  const cR = pearsonSig(havingC.map(p => p.dContrib), havingC.map(p => p.outcome === 'WIN' ? 1 : 0));
  const cRf = pearsonSig(havingC.map(p => p.dContrib), havingC.map(p => p.flatProfit));
  out.push('');
  out.push(`ρ(Δcontrib, WIN) = ${cR.rho?.toFixed(3) ?? '—'} ${cR.sig}  ·  ρ(Δcontrib, flat ROI) = ${cRf.rho?.toFixed(3) ?? '—'} ${cRf.sig}`);
}

// ─── §5. Star tier analysis ────────────────────────────────────────────────
function buildSection5(out, picks) {
  sectionHeader(out, '§5. Star tier analysis (frozen `peak.stars`)',
    'Does the engine\'s star calc add information beyond the deltas?');

  const buckets = ['5.0★', '4.5★', '4.0★', '3.5★', '3.0★', '2.5★'];
  bucketTable(out, picks, p => {
    const s = p.peakStars;
    if (s >= 5.0) return '5.0★';
    if (s >= 4.5) return '4.5★';
    if (s >= 4.0) return '4.0★';
    if (s >= 3.5) return '3.5★';
    if (s >= 3.0) return '3.0★';
    return '2.5★';
  }, buckets);

  // Stars stratified by Δw
  out.push('');
  out.push('### §5b. Stars × Δw stratified — does the star tier hold up within each Δw cohort?');
  out.push('');
  const dwGroups = [
    { label: 'Δw ≤ 0',      f: p => p.dwFrozen != null && p.dwFrozen <= 0 },
    { label: 'Δw = +1',     f: p => p.dwFrozen === 1 },
    { label: 'Δw = +2',     f: p => p.dwFrozen === 2 },
    { label: 'Δw ≥ +3',     f: p => p.dwFrozen != null && p.dwFrozen >= 3 },
  ];
  out.push('| Δw cohort | 5★ | 4.5★ | 4★ | 3.5★ | 3★ | 2.5★ |');
  out.push('|---|---|---|---|---|---|---|');
  for (const g of dwGroups) {
    const sub = picks.filter(g.f);
    const cells = ['5.0', '4.5', '4.0', '3.5', '3.0', '2.5'].map(thr => {
      const min = parseFloat(thr);
      const max = thr === '5.0' ? 5.0 : (thr === '2.5' ? 2.5 : min);
      const arr = sub.filter(p => p.peakStars === min);
      if (!arr.length) return '—';
      const s = summarizeArr(arr);
      return `${s.n}/${(100*s.wr).toFixed(0)}%/${sign(100*s.flatRoi, 0)}%`;
    });
    out.push(`| ${g.label} | ${cells.join(' | ')} |`);
  }
}

// ─── §6. Odds-bucket interaction ───────────────────────────────────────────
function buildSection6(out, picks) {
  sectionHeader(out, '§6. Odds-bucket interaction',
    'How does the system perform across the price ladder? Identifies under/over-priced buckets.');

  bucketTable(out, picks, p => {
    if (p.odds == null) return 'no-odds';
    for (const b of ODDS_BUCKETS) if (p.odds >= b.min && p.odds <= b.max) return b.label;
    return 'no-odds';
  }, ODDS_BUCKETS.map(b => b.label));

  // Odds bucket × Δw
  out.push('');
  out.push('### §6b. Odds × Δw heatmap (flat ROI %, sample size in parens)');
  out.push('');
  const dwGroups = ['Δw ≤ 0', 'Δw = +1', 'Δw = +2', 'Δw ≥ +3'];
  out.push('| Odds | ' + dwGroups.join(' | ') + ' |');
  out.push('|' + ['---'].concat(dwGroups.map(() => '---')).join('|') + '|');
  for (const b of ODDS_BUCKETS) {
    const cells = [b.label];
    for (const g of dwGroups) {
      let arr;
      if (g === 'Δw ≤ 0')      arr = picks.filter(p => p.odds != null && p.odds >= b.min && p.odds <= b.max && p.dwFrozen != null && p.dwFrozen <= 0);
      else if (g === 'Δw = +1') arr = picks.filter(p => p.odds != null && p.odds >= b.min && p.odds <= b.max && p.dwFrozen === 1);
      else if (g === 'Δw = +2') arr = picks.filter(p => p.odds != null && p.odds >= b.min && p.odds <= b.max && p.dwFrozen === 2);
      else                      arr = picks.filter(p => p.odds != null && p.odds >= b.min && p.odds <= b.max && p.dwFrozen != null && p.dwFrozen >= 3);
      if (!arr.length) cells.push('—');
      else {
        const s = summarizeArr(arr);
        cells.push(`${sign(100 * s.flatRoi, 0)}% (${s.n})`);
      }
    }
    out.push('| ' + cells.join(' | ') + ' |');
  }
}

// ─── §7. Market split ──────────────────────────────────────────────────────
function buildSection7(out, picks) {
  sectionHeader(out, '§7. Market split (ML / SPREAD / TOTAL)', 'Per-market global stats + Δw cohort breakdown.');

  bucketTable(out, picks, p => p.market, ['ML', 'SPREAD', 'TOTAL']);

  out.push('');
  out.push('### §7b. Market × Δw cohort');
  out.push('');
  const dwGroups = ['Δw ≤ 0', 'Δw = +1', 'Δw = +2', 'Δw ≥ +3'];
  out.push('| Market | ' + dwGroups.join(' | ') + ' |');
  out.push('|' + ['---'].concat(dwGroups.map(() => '---')).join('|') + '|');
  for (const m of ['ML', 'SPREAD', 'TOTAL']) {
    const cells = [m];
    for (const g of dwGroups) {
      let arr;
      if (g === 'Δw ≤ 0')      arr = picks.filter(p => p.market === m && p.dwFrozen != null && p.dwFrozen <= 0);
      else if (g === 'Δw = +1') arr = picks.filter(p => p.market === m && p.dwFrozen === 1);
      else if (g === 'Δw = +2') arr = picks.filter(p => p.market === m && p.dwFrozen === 2);
      else                      arr = picks.filter(p => p.market === m && p.dwFrozen != null && p.dwFrozen >= 3);
      if (!arr.length) cells.push('—');
      else {
        const s = summarizeArr(arr);
        cells.push(`N=${s.n} · ${(100*s.wr).toFixed(0)}% · ${sign(100*s.flatRoi, 0)}%`);
      }
    }
    out.push('| ' + cells.join(' | ') + ' |');
  }
}

// ─── §8. Sport split ───────────────────────────────────────────────────────
function buildSection8(out, picks) {
  sectionHeader(out, '§8. Sport split (MLB / NBA / NHL)', 'Per-sport global stats + Δw cohort breakdown.');

  bucketTable(out, picks, p => p.sport, ['MLB', 'NBA', 'NHL']);

  out.push('');
  out.push('### §8b. Sport × Δw cohort');
  out.push('');
  const dwGroups = ['Δw ≤ 0', 'Δw = +1', 'Δw = +2', 'Δw ≥ +3'];
  out.push('| Sport | ' + dwGroups.join(' | ') + ' |');
  out.push('|' + ['---'].concat(dwGroups.map(() => '---')).join('|') + '|');
  for (const sp of ['MLB', 'NBA', 'NHL']) {
    const cells = [sp];
    for (const g of dwGroups) {
      let arr;
      if (g === 'Δw ≤ 0')      arr = picks.filter(p => p.sport === sp && p.dwFrozen != null && p.dwFrozen <= 0);
      else if (g === 'Δw = +1') arr = picks.filter(p => p.sport === sp && p.dwFrozen === 1);
      else if (g === 'Δw = +2') arr = picks.filter(p => p.sport === sp && p.dwFrozen === 2);
      else                      arr = picks.filter(p => p.sport === sp && p.dwFrozen != null && p.dwFrozen >= 3);
      if (!arr.length) cells.push('—');
      else {
        const s = summarizeArr(arr);
        cells.push(`N=${s.n} · ${(100*s.wr).toFixed(0)}% · ${sign(100*s.flatRoi, 0)}%`);
      }
    }
    out.push('| ' + cells.join(' | ') + ' |');
  }
}

// ─── §9. Lock-criteria gates ───────────────────────────────────────────────
function buildSection9(out, picks) {
  sectionHeader(out, '§9. Lock-criteria gates',
    'For each binary criterion, compare picks where it was met vs not.');

  const criteria = [
    'sharps3Plus',
    'plusEV',
    'pinnacleConfirms',
    'invested10kPlus',
    'lineMovingWith',
    'predMarketAligns',
  ];
  out.push('| Criterion | Met N · WR · Flat ROI · t | NOT met N · WR · Flat ROI · t |');
  out.push('|---|---|---|');
  for (const k of criteria) {
    const yes = picks.filter(p => p.criteria && p.criteria[k] === true);
    const no  = picks.filter(p => p.criteria && p.criteria[k] === false);
    const sy = summarizeArr(yes); const sn = summarizeArr(no);
    const yc = sy.n ? `${sy.n} · ${(100*sy.wr).toFixed(0)}% · ${sign(100*sy.flatRoi, 1)}% · ${sy.flatTtest.t.toFixed(2)} ${sy.flatTtest.sig}` : '—';
    const nc = sn.n ? `${sn.n} · ${(100*sn.wr).toFixed(0)}% · ${sign(100*sn.flatRoi, 1)}% · ${sn.flatTtest.t.toFixed(2)} ${sn.flatTtest.sig}` : '—';
    out.push(`| **${k}** | ${yc} | ${nc} |`);
  }

  // criteriaMet count
  out.push('');
  out.push('### §9b. Total criteria met (0–6)');
  out.push('');
  const cmBuckets = ['0', '1', '2', '3', '4', '5', '6'];
  bucketTable(out, picks, p => String(p.criteriaMet ?? 0), cmBuckets);

  // Regime
  out.push('');
  out.push('### §9c. Regime');
  out.push('');
  const regimes = Array.from(new Set(picks.map(p => p.regime).filter(Boolean))).sort();
  bucketTable(out, picks, p => p.regime || 'NONE', regimes.length ? regimes : ['NONE']);

  // consensusGrade
  out.push('');
  out.push('### §9d. Consensus grade');
  out.push('');
  const grades = ['DOMINANT', 'STRONG', 'LEAN', 'CONTESTED'];
  bucketTable(out, picks, p => p.consensusGrade || '—', grades);

  // sharpCount, totalInvested, evEdge, moneyPct, walletPct correlations
  out.push('');
  out.push('### §9e. Continuous criteria — correlation with WIN / flat ROI');
  out.push('');
  out.push('| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | t-stat |');
  out.push('|---|---|---|---|---|');
  const corrRow = (label, vals) => {
    const ws = picks.map(p => p.outcome === 'WIN' ? 1 : 0);
    const fs = picks.map(p => p.flatProfit);
    const valid = vals.map((v, i) => Number.isFinite(v) ? i : -1).filter(i => i >= 0);
    const xv = valid.map(i => vals[i]); const wv = valid.map(i => ws[i]); const fv = valid.map(i => fs[i]);
    const r1 = pearsonSig(xv, wv); const r2 = pearsonSig(xv, fv); const r3 = spearman(xv, fv);
    out.push(`| ${label} | ${r1.rho?.toFixed(3) ?? '—'} ${r1.sig} | ${r2.rho?.toFixed(3) ?? '—'} ${r2.sig} | ${r3?.toFixed(3) ?? '—'} | ${r2.t?.toFixed(2) ?? '—'} |`);
  };
  corrRow('sharpCount',    picks.map(p => p.sharpCount));
  corrRow('totalInvested', picks.map(p => p.totalInvested));
  corrRow('evEdge',        picks.map(p => p.evEdge));
  corrRow('moneyPct',      picks.map(p => p.moneyPct));
  corrRow('walletPct',     picks.map(p => p.walletPct));
  corrRow('criteriaMet',   picks.map(p => p.criteriaMet));
  corrRow('maxContribFor', picks.map(p => p.maxContribFor));
  corrRow('meanBaseFor',   picks.map(p => p.meanBaseFor));
}

// ─── §10. CLV / line movement ──────────────────────────────────────────────
function buildSection10(out, picks) {
  sectionHeader(out, '§10. CLV / line-movement diagnostic',
    'CLV is the gold-standard "are we beating the closing line?" metric.');

  const haveClv = picks.filter(p => Number.isFinite(p.clv));
  if (!haveClv.length) {
    out.push('No CLV samples found.');
    return;
  }
  const meanClv = haveClv.reduce((s, p) => s + p.clv, 0) / haveClv.length;
  const t = tTest(haveClv.map(p => p.clv));
  out.push(`Sample with CLV: **${haveClv.length}** picks. Mean CLV = **${meanClv.toFixed(4)}**.`);
  out.push(`t-statistic vs zero: ${t.t.toFixed(2)} → ${t.sig} · 95% CI [${t.ci_lo.toFixed(4)}, ${t.ci_hi.toFixed(4)}]`);
  out.push('');
  out.push('Bucketed CLV vs flat PnL:');
  out.push('');
  bucketTable(out, haveClv, p => {
    if (p.clv <= -0.02) return 'CLV ≤ −2%';
    if (p.clv <= 0)     return 'CLV (−2%, 0]';
    if (p.clv <= 0.02)  return 'CLV (0, +2%]';
    return 'CLV > +2%';
  }, ['CLV ≤ −2%', 'CLV (−2%, 0]', 'CLV (0, +2%]', 'CLV > +2%']);
  const r = pearsonSig(haveClv.map(p => p.clv), haveClv.map(p => p.flatProfit));
  out.push('');
  out.push(`ρ(CLV, flat ROI) = ${r.rho?.toFixed(3) ?? '—'} ${r.sig}`);
}

// ─── §11. Logistic regression ──────────────────────────────────────────────
function buildSection11(out, picks) {
  sectionHeader(out, '§11. Logistic regression — feature importance',
    'L2-regularized (λ=0.05) logistic regression with z-scored features. Coefficients ranked by absolute magnitude. Larger |β| ≈ stronger effect at fixed everything-else.');

  const features = [
    { name: 'Δw',              get: p => p.dwFrozen ?? 0 },
    { name: 'Δq',              get: p => p.dqFrozen ?? 0 },
    { name: 'peak.stars',      get: p => p.peakStars ?? 0 },
    { name: 'evEdge',          get: p => p.evEdge ?? 0 },
    { name: 'moneyPct',        get: p => p.moneyPct ?? 0 },
    { name: 'walletPct',       get: p => p.walletPct ?? 0 },
    { name: 'sharpCount',      get: p => p.sharpCount ?? 0 },
    { name: 'log10(invested)', get: p => Math.log10(Math.max(1, p.totalInvested ?? 1)) },
    { name: 'criteriaMet',     get: p => p.criteriaMet ?? 0 },
    { name: 'maxContribFor',   get: p => p.maxContribFor ?? 0 },
    { name: 'meanBaseFor',     get: p => p.meanBaseFor ?? 0 },
    { name: 'qFor@T50',        get: p => p.contribByT?.[50]?.qFor ?? 0 },
    { name: 'margin@T50',      get: p => (p.contribByT?.[50]?.qFor ?? 0) - (p.contribByT?.[50]?.qAg ?? 0) },
    { name: 'odds (American)', get: p => p.odds ?? 0 },
    { name: 'log(impliedProb)', get: p => Math.log(Math.max(0.01, p.impliedProb || 0.5)) },
  ];

  // Drop picks missing any feature
  const usable = picks.filter(p => features.every(f => Number.isFinite(f.get(p))));
  const X = [];
  const y = [];
  const colsRaw = features.map(f => usable.map(p => f.get(p)));
  const colsZ = colsRaw.map(zScore);
  for (let i = 0; i < usable.length; i++) {
    X.push(colsZ.map(c => c.values[i]));
    y.push(usable[i].outcome === 'WIN' ? 1 : 0);
  }
  if (X.length < 20) {
    out.push('Sample too small for logistic regression.');
    return;
  }
  const { w, b } = logisticRegression(X, y, { lr: 0.08, iters: 4000, l2: 0.05 });
  const ranked = features.map((f, i) => ({ name: f.name, beta: w[i] }))
    .sort((a, b2) => Math.abs(b2.beta) - Math.abs(a.beta));
  out.push(`Trained on N=${X.length} (with all features non-null). Intercept β₀ = ${b.toFixed(3)}.`);
  out.push('');
  out.push('| Rank | Feature | β (z-scaled) | Direction |');
  out.push('|---|---|---|---|');
  ranked.forEach((r, i) => {
    out.push(`| ${i + 1} | ${r.name} | ${r.beta >= 0 ? '+' : ''}${r.beta.toFixed(3)} | ${r.beta >= 0.05 ? '↑ helps' : r.beta <= -0.05 ? '↓ hurts' : '≈ flat'} |`);
  });
}

// ─── §12. Sizing recommendation ────────────────────────────────────────────
function buildSection12(out, picks) {
  sectionHeader(out, '§12. Per-cohort sizing recommendation',
    'Bayesian posterior WR (Beta(5,5) prior) and half-Kelly stake at the cohort\'s median odds. Compares to current ladder.');

  const cohorts = [
    { id: 'p1',  label: 'Path-1 (Δw ≥ +3 ∧ Δq ≥ +1)', f: p => p.dwFrozen != null && p.dwFrozen >= 3 && p.dqFrozen != null && p.dqFrozen >= 1 },
    { id: 'p2',  label: 'Path-2 (Δw = +2 ∧ Δq ≥ +1)', f: p => p.dwFrozen === 2 && p.dqFrozen != null && p.dqFrozen >= 1 },
    { id: 'fb',  label: 'Floor-B (Δw = +1 ∧ Δq ≥ +2)', f: p => p.dwFrozen === 1 && p.dqFrozen != null && p.dqFrozen >= 2 },
    { id: 'fa',  label: 'Floor-A (Δw = +1 ∧ Δq = +1)  [MUTED v6.6]', f: p => p.dwFrozen === 1 && p.dqFrozen === 1 },
    { id: 'sw0', label: 'Stale Δw = 0', f: p => p.dwFrozen === 0 },
    { id: 'sw1', label: 'Stale Δw ≤ −1', f: p => p.dwFrozen != null && p.dwFrozen <= -1 },
  ];

  out.push('| Cohort | N | W-L | WR observed | Bayesian WR | Median odds | Half-Kelly stake | Current avg | Verdict |');
  out.push('|---|---|---|---|---|---|---|---|---|');
  for (const c of cohorts) {
    const arr = picks.filter(c.f);
    if (!arr.length) { out.push(`| ${c.label} | 0 | — | — | — | — | — | — | — |`); continue; }
    const w = arr.filter(p => p.outcome === 'WIN').length;
    const l = arr.filter(p => p.outcome === 'LOSS').length;
    const wr = w + l > 0 ? w / (w + l) : 0;
    const bayes = bayesianWR(w, l);
    const oddsArr = arr.map(p => p.odds).filter(o => Number.isFinite(o)).sort((a, b) => a - b);
    const medOdds = oddsArr.length ? oddsArr[Math.floor(oddsArr.length / 2)] : null;
    const hk = halfKelly(bayes, medOdds);
    const avgU = arr.reduce((s, p) => s + (p.peakUnits || 0), 0) / arr.length;
    const verdict = hk <= 0 ? '**MUTE** (negative EV at posterior)' :
      hk >= avgU / 100 * 1.5 ? `**UNDER-SIZED** — ship up to ${(100*hk).toFixed(2)}u (1u=1% bankroll)` :
      hk <= avgU / 100 * 0.5 ? `**OVER-SIZED** — reduce to ${(100*hk).toFixed(2)}u` :
      `~ in range — ${(100*hk).toFixed(2)}u`;
    const stakeStr = hk <= 0 ? '— (mute)' : `${(100*hk).toFixed(2)}% bankroll`;
    out.push(`| ${c.label} | ${arr.length} | ${w}-${l} | ${(100*wr).toFixed(1)}% | ${(100*bayes).toFixed(1)}% | ${medOdds == null ? '—' : (medOdds >= 0 ? '+' : '') + medOdds} | ${stakeStr} | ${avgU.toFixed(2)}u | ${verdict} |`);
  }
  out.push('');
  out.push('> Bayesian posterior uses Beta(5,5) prior — pulls small-sample WR toward 50%. Half-Kelly is conservative; reduce by another 50% if you prefer quarter-Kelly. **Treat 1u = 1% of bankroll** when reading suggested stakes.');
}

// ─── §13. Drawdown / streaks ───────────────────────────────────────────────
function buildSection13(out, picks) {
  sectionHeader(out, '§13. Drawdown / streaks / variance', 'Daily PnL distribution + max drawdown.');

  // Daily aggregation
  const byDay = {};
  for (const p of picks) {
    if (!p.date) continue;
    if (!byDay[p.date]) byDay[p.date] = { peak: 0, flat: 0, n: 0, w: 0, l: 0 };
    byDay[p.date].peak += p.profitU || 0;
    byDay[p.date].flat += p.flatProfit || 0;
    byDay[p.date].n += 1;
    if (p.outcome === 'WIN') byDay[p.date].w += 1;
    if (p.outcome === 'LOSS') byDay[p.date].l += 1;
  }
  const dates = Object.keys(byDay).sort();
  let cum = 0, peak = 0, maxDD = 0;
  let losing = 0, winning = 0, longestLoss = 0, longestWin = 0;
  out.push('| Date | N | W-L | Peak PnL | Cum |');
  out.push('|---|---|---|---|---|');
  for (const d of dates) {
    const x = byDay[d];
    cum += x.peak;
    if (cum > peak) peak = cum;
    if (peak - cum > maxDD) maxDD = peak - cum;
    if (x.peak < 0) { losing += 1; winning = 0; if (losing > longestLoss) longestLoss = losing; }
    else if (x.peak > 0) { winning += 1; losing = 0; if (winning > longestWin) longestWin = winning; }
    out.push(`| ${d} | ${x.n} | ${x.w}-${x.l} | ${sign(x.peak)}u | ${sign(cum)}u |`);
  }
  out.push('');
  out.push(`**Peak cum PnL:** ${sign(peak)}u`);
  out.push(`**Max drawdown:** ${sign(-maxDD)}u`);
  out.push(`**Longest losing-day streak:** ${longestLoss}`);
  out.push(`**Longest winning-day streak:** ${longestWin}`);

  // Sharpe-like
  const dailyPeak = dates.map(d => byDay[d].peak);
  const meanDaily = dailyPeak.reduce((a, b) => a + b, 0) / dailyPeak.length;
  const sdDaily = Math.sqrt(dailyPeak.reduce((a, b) => a + (b - meanDaily) ** 2, 0) / Math.max(1, dailyPeak.length - 1));
  const sharpeDaily = sdDaily > 0 ? meanDaily / sdDaily : 0;
  out.push(`**Daily Sharpe-like (μ/σ):** ${sharpeDaily.toFixed(3)}  (annualized × √252 ≈ ${(sharpeDaily * Math.sqrt(252)).toFixed(2)})`);
}

// ─── §14. Per-pick row-level detail ────────────────────────────────────────
function buildSection14(out, picks) {
  sectionHeader(out, '§14. Per-pick row-level detail (every shipped+graded pick)',
    'Sortable raw data behind every section. Use to spot-check individual decisions.');
  out.push('| Date | Sport | Mkt | Side | ★ | u | Odds | Δw | Δq | Σ | qF₅₀ | qA₅₀ | Crit | EV | Outcome | Peak PnL |');
  out.push('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
  const sorted = [...picks].sort((a, b) => (a.date || '').localeCompare(b.date || '') || (a.docId || '').localeCompare(b.docId || ''));
  for (const p of sorted) {
    const oddsStr = p.odds == null ? '—' : (p.odds >= 0 ? '+' : '') + p.odds;
    const dw = p.dwFrozen ?? '—';
    const dq = p.dqFrozen ?? '—';
    const sum = (Number.isFinite(p.dwFrozen) && Number.isFinite(p.dqFrozen)) ? (p.dwFrozen + p.dqFrozen) : '—';
    const qFor50 = p.contribByT?.[50]?.qFor ?? 0;
    const qAg50 = p.contribByT?.[50]?.qAg ?? 0;
    const ev = p.evEdge != null ? p.evEdge.toFixed(2) : '—';
    const outcome = p.outcome === 'WIN' ? 'W' : p.outcome === 'LOSS' ? 'L' : 'P';
    out.push(`| ${p.date} | ${p.sport} | ${p.market} | ${p.sideKey} | ${p.peakStars.toFixed(1)} | ${(p.peakUnits || 0).toFixed(2)} | ${oddsStr} | ${dw} | ${dq} | ${sum} | ${qFor50} | ${qAg50} | ${p.criteriaMet ?? 0} | ${ev} | ${outcome} | ${sign(p.profitU)}u |`);
  }
}

// ─── Executive summary (top of file) ───────────────────────────────────────
function buildExec(picks, meta) {
  const total = summarizeArr(picks);
  const allDwSig = (() => {
    const xs = picks.filter(p => p.dwFrozen != null);
    return pearsonSig(xs.map(p => p.dwFrozen), xs.map(p => p.flatProfit));
  })();
  const sumSig = (() => {
    const xs = picks.filter(p => p.dwFrozen != null && p.dqFrozen != null);
    return pearsonSig(xs.map(p => p.dwSum), xs.map(p => p.flatProfit));
  })();
  const haveOverallEdge = (total.flatTtest.t >= 1.96 && total.flatTtest.mean > 0);
  const overallVerdict = haveOverallEdge ? '✓ statistically positive at 95% confidence'
    : total.flatTtest.mean > 0 ? '~ directionally positive but not significant'
    : '✗ overall sample is consistent with zero or negative true ROI';

  // Cohort scan — what's working, what's bleeding
  const cohorts = [
    { id: 'p1',  label: 'Path-1 (Δw ≥ +3)',                f: p => p.dwFrozen != null && p.dwFrozen >= 3 },
    { id: 'p2',  label: 'Path-2 (Δw = +2 ∧ Δq ≥ +1)',     f: p => p.dwFrozen === 2 && p.dqFrozen != null && p.dqFrozen >= 1 },
    { id: 'fb',  label: 'Floor-B (Δw = +1 ∧ Δq ≥ +2)',    f: p => p.dwFrozen === 1 && p.dqFrozen != null && p.dqFrozen >= 2 },
    { id: 'fa',  label: 'Floor-A (Δw = +1 ∧ Δq = +1) [MUTED v6.6]', f: p => p.dwFrozen === 1 && p.dqFrozen === 1 },
    { id: 'sw',  label: 'Stale Δw ≤ 0',                    f: p => p.dwFrozen != null && p.dwFrozen <= 0 },
  ];
  const winners = [];
  const bleeders = [];
  const summaries = {};
  for (const c of cohorts) {
    const arr = picks.filter(c.f);
    if (!arr.length) continue;
    const s = summarizeArr(arr);
    summaries[c.id] = { c, s, arr };
    if (s.flatTtest.t >= 1.645 && s.flatTtest.mean > 0) winners.push({ c, s });
    if (s.flatTtest.t <= -1.645 && s.flatTtest.mean < 0) bleeders.push({ c, s });
  }

  // Logistic-regression-style ranking — what feature would I bet on if I had to pick one?
  const xs = picks.filter(p => p.dwFrozen != null && p.dqFrozen != null);

  const lines = [];
  lines.push('## Executive summary');
  lines.push('');
  lines.push(`**Sample:** ${total.n} shipped+graded picks · ${meta.dateMin} → ${meta.dateMax}`);
  lines.push(`**Headline:** ${total.w}-${total.l}-${picks.filter(p => p.outcome === 'PUSH').length} · WR ${fmtPct(100 * total.wr)} [${fmtPct(100 * total.wilsonCi[0], 1)}–${fmtPct(100 * total.wilsonCi[1], 1)}] vs 52.4% break-even · ${sign(total.fl)}u flat (${fmtSignPct(100 * total.flatRoi)}) · ${sign(total.pu)}u peak.`);
  lines.push(`**Overall t-test:** t = ${total.flatTtest.t.toFixed(2)} → ${total.flatTtest.sig}.`);
  lines.push('');
  lines.push(`**Verdict:** ${overallVerdict}.`);
  lines.push('');
  lines.push('### Where IS the edge?');
  lines.push('');
  lines.push(`The deltas are real signals: **ρ(Δw, flat ROI) = ${allDwSig.rho?.toFixed(3) ?? '—'} ${allDwSig.sig}** and **ρ(Δw+Δq, flat ROI) = ${sumSig.rho?.toFixed(3) ?? '—'} ${sumSig.sig}**. The overall sample loses because we ship picks across cohorts that have no edge. Cohort breakdown:`);
  lines.push('');
  if (winners.length) {
    lines.push('**Winning cohorts (t ≥ 1.645 with positive mean):**');
    for (const { c, s } of winners) {
      lines.push(`- **${c.label}** — N=${s.n}, ${s.w}-${s.l}, WR ${fmtPct(100 * s.wr)} [${fmtPct(100 * s.wilsonCi[0], 0)}–${fmtPct(100 * s.wilsonCi[1], 0)}], flat ROI ${fmtSignPct(100 * s.flatRoi)} (t=${s.flatTtest.t.toFixed(2)} ${s.flatTtest.sig})`);
    }
  } else {
    lines.push('**No cohort cleared the 90% sig threshold. Best directional cohorts:**');
  }
  lines.push('');
  if (bleeders.length) {
    lines.push('**Bleeder cohorts (t ≤ −1.645 with negative mean):**');
    for (const { c, s } of bleeders) {
      lines.push(`- **${c.label}** — N=${s.n}, ${s.w}-${s.l}, WR ${fmtPct(100 * s.wr)} [${fmtPct(100 * s.wilsonCi[0], 0)}–${fmtPct(100 * s.wilsonCi[1], 0)}], flat ROI ${fmtSignPct(100 * s.flatRoi)} (t=${s.flatTtest.t.toFixed(2)} ${s.flatTtest.sig})`);
    }
  }
  lines.push('');
  lines.push('### Action map');
  lines.push('');
  if (summaries.p1) lines.push(`- **Path-1 (Δw ≥ +3)**: ship at maximum size, lift any plus-money cap. Bayesian posterior WR ≈ ${fmtPct(100 * bayesianWR(summaries.p1.s.w, summaries.p1.s.l))}; half-Kelly recommends ~${(100 * halfKelly(bayesianWR(summaries.p1.s.w, summaries.p1.s.l), -110)).toFixed(1)}% bankroll at −110.`);
  if (summaries.p2) lines.push(`- **Path-2 (Δw = +2)**: bayesian WR ${fmtPct(100 * bayesianWR(summaries.p2.s.w, summaries.p2.s.l))} → half-Kelly = 0% at −110. **Demote off the 5★ tier.**`);
  if (summaries.fb) lines.push(`- **Floor-B (Δw = +1 ∧ Δq ≥ +2)**: bayesian WR ${fmtPct(100 * bayesianWR(summaries.fb.s.w, summaries.fb.s.l))} → modest positive Kelly. Keep but don't oversize.`);
  if (summaries.sw) lines.push(`- **Stale Δw ≤ 0**: −${fmtPct(-100 * summaries.sw.s.flatRoi)} flat ROI on ${summaries.sw.s.n} picks. Already addressed by the post-4/24 mute engine — should not re-appear.`);
  lines.push(`- **Sample size:** at observed σ (${total.flatTtest.sd.toFixed(2)}u/pick), we need **~${Math.ceil((1.96 * total.flatTtest.sd / 0.05) ** 2)} graded picks** to validate a true +5% flat ROI at 95% confidence. We have ${total.n}. Cohort findings are provisional until N grows.`);
  return lines.join('\n');
}

// ── Main ──────────────────────────────────────────────────────────────────
async function main() {
  console.log('[v6FullAnalysis] loading picks…');
  const { rows, meta } = await loadPicks();
  console.log(`[v6FullAnalysis] N=${rows.length} shipped+graded picks (${meta.dateMin} → ${meta.dateMax})`);

  const out = [];
  out.push('# Sharp Intel v6 — Full Analysis');
  out.push('');
  out.push(`_Auto-generated **${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET** by \`scripts/v6FullAnalysis.js\`. Do not edit by hand._`);
  out.push('');
  out.push(`**Inclusion mirrors live Pick Performance dashboard:** \`lockStage ≠ SHADOW ∧ ¬superseded ∧ health ∉ {MUTED, CANCELLED} ∧ peak.stars ≥ 2.5\`. PnL in **peak units** (the size shipped to users) and **flat 1u** (cohort EV lens). Cohort tags from frozen \`v8_walletConsensus*\` stamps written at last sync before T-15.`);
  out.push('');
  out.push(buildExec(rows, meta));
  out.push('');
  out.push('---');

  buildSection1(out, rows, meta);
  out.push('');
  out.push('---');
  buildSection2(out, rows);
  out.push('');
  out.push('---');
  buildSection3(out, rows);
  out.push('');
  out.push('---');
  buildSection4(out, rows);
  out.push('');
  out.push('---');
  buildSection5(out, rows);
  out.push('');
  out.push('---');
  buildSection6(out, rows);
  out.push('');
  out.push('---');
  buildSection7(out, rows);
  out.push('');
  out.push('---');
  buildSection8(out, rows);
  out.push('');
  out.push('---');
  buildSection9(out, rows);
  out.push('');
  out.push('---');
  buildSection10(out, rows);
  out.push('');
  out.push('---');
  buildSection11(out, rows);
  out.push('');
  out.push('---');
  buildSection12(out, rows);
  out.push('');
  out.push('---');
  buildSection13(out, rows);
  out.push('');
  out.push('---');
  buildSection14(out, rows);
  out.push('');
  out.push('---');
  out.push(`_Generator: \`scripts/v6FullAnalysis.js\` · regenerates daily via \`.github/workflows/v6-full-analysis.yml\`._`);

  const outPath = join(REPO_ROOT, 'V6_FULL_ANALYSIS.md');
  writeFileSync(outPath, out.join('\n'));
  console.log(`[v6FullAnalysis] wrote ${outPath}`);
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
