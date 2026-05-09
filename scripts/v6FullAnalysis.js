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
 * lock time (frozen v8_walletConsensus* + v8_hc* + peak.* fields) and run:
 *
 *   §1.  Sample summary + power analysis (does this N let us detect edge?)
 *   §2.  Univariate signal analysis — Δw, HC margin, Δw+HC sum.  Δq dropped
 *        per directive (irrelevant once we restrict to proven wallets).
 *   §3.  Bivariate HC × Δw matrix (post-cutover only) with Wilson 95% CIs,
 *        plus row/col marginals and v7.4 lock-zone anatomy.
 *   §4.  Proven-wallet feature predictors — even without HC/Δw, can the
 *        characteristics of the qualified-roster wallets on each side
 *        (count, W−L net, flatPnl, avg ROI, sport rank, top-quartile
 *        share) predict the winner?  Ranks features by |ρ(·, flat ROI)|.
 *   §AGS. Aggregate Score deep dive (point-in-time / out-of-sample) —
 *        coverage, tier ladder, per-feature univariate predictiveness,
 *        score-mover share, pairwise feature correlation, drop-one
 *        ablation, multivariate logistic, and a composite ranking telling
 *        you which of the 6 inputs is doing the work and which are ballast.
 *        Every AGS score in this section is computed under leakage-free
 *        controls: PIT proven gate (chronological tier lens via
 *        scripts/lib/pitTierLens.js — a wallet counts as proven only if
 *        its FLAT/CONFIRMED threshold was crossed strictly BEFORE the
 *        pick's date) and walk-forward calibration (mean/SD per feature
 *        recomputed at each pick date from prior picks only). The §AGS-0a
 *        sub-section shows the in-sample-vs-OOS deltas at the production
 *        thresholds so you can see exactly how much of the prior fire
 *        ladder was leakage.
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

import {
  AGS_FEATURES,
  AGS_FALLBACK_CALIBRATION,
  AGS_LOCK_FLOOR,
  AGS_MUTE_FLOOR,
  AGS_DW1_FLOOR,
  AGS_MIN_PROVEN_WALLETS,
  aggregateSideProven,
  computeAgs,
  agsTierFromValue,
} from '../src/lib/ags.js';
import { buildPitTierLens } from './lib/pitTierLens.js';

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
// HC margin only existed from v7.1 cutover (2026-04-30). Pre-cutover picks
// have no HC stamp and we DO NOT retro-fit. Any HC analytic in this report
// is scoped to picks dated >= HC_CUTOVER only.
const HC_CUTOVER  = '2026-04-30';
const PICK_COLS = [
  ['sharpFlowPicks',   'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals',  'TOTAL'],
];
const MIN_N_FOR_ROI = 3;
// Proven roster = CONFIRMED ∪ FLAT per sport (the "qualified wallet" gate
// the dashboard now uses). WR50 is excluded by design — user's directive:
// "we only use proven winners now".
const PROVEN_TIERS = new Set(['CONFIRMED', 'FLAT']);
const TOP_QUARTILE_FRAC = 0.25;
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

// ── AGS calibration loader ────────────────────────────────────────────────
// Pulls the live `agsCalibration/current` doc from Firestore. Falls back
// to the hardcoded last-known-good values in src/lib/ags.js when the cron
// hasn't seeded yet or the doc is missing fields. The returned object has
// the exact shape `computeAgs()` expects: `{ normalizers, quintiles,
// thresholds, sampleSize, dateRange, computedAt, source }`.
async function loadAgsCalibration() {
  try {
    const doc = await db.collection('agsCalibration').doc('current').get();
    if (doc.exists) {
      const data = doc.data();
      if (data?.normalizers) return data;
    }
  } catch (e) {
    // fall through
  }
  return AGS_FALLBACK_CALIBRATION;
}

// ── Wallet profile loader ─────────────────────────────────────────────────
//
// Builds `walletProfiles: Map<walletShort, profile>` and a per-sport ranked
// proven-wallet roster sorted by `picks.flatRoi`. The ranking lets us
// answer "is this wallet in the top quartile of proven wallets in NBA?"
// without re-sorting per pick.
//
// `provenRanksBySport[sport]` is a Map<walletShort, { rank, totalProven,
//   isTopQuartile, flatRoi, n }> for every wallet that's CONFIRMED or
// FLAT in that sport. Rank is 1-indexed (1 = best flatRoi).
async function loadWalletProfiles() {
  const snap = await db.collection('sharpWalletProfiles').get();
  const profiles = new Map();
  for (const d of snap.docs) profiles.set(d.id, d.data());

  const provenRanksBySport = new Map();
  const sports = new Set();
  for (const p of profiles.values()) {
    if (p?.bySport) for (const s of Object.keys(p.bySport)) sports.add(s);
  }
  for (const sport of sports) {
    const eligible = [];
    for (const [wallet, p] of profiles) {
      const rec = p?.bySport?.[sport];
      if (!rec) continue;
      if (!PROVEN_TIERS.has(rec.whitelistTier)) continue;
      eligible.push({
        wallet,
        flatRoi: rec.picks?.flatRoi ?? 0,
        n:       rec.picks?.n ?? 0,
        wins:    rec.picks?.wins ?? 0,
        losses:  rec.picks?.losses ?? 0,
        flatPnl: rec.picks?.flatPnl ?? 0,
        tier:    rec.whitelistTier,
        wr:      rec.picks?.wr ?? 0,
        latestLbRank: p?.latestLbRank ?? null,
      });
    }
    eligible.sort((a, b) => b.flatRoi - a.flatRoi || b.flatPnl - a.flatPnl);
    const totalProven = eligible.length;
    const topCutoff = Math.max(1, Math.ceil(totalProven * TOP_QUARTILE_FRAC));
    const m = new Map();
    eligible.forEach((e, i) => {
      m.set(e.wallet, {
        ...e,
        rank: i + 1,
        totalProven,
        isTopQuartile: (i + 1) <= topCutoff,
      });
    });
    provenRanksBySport.set(sport, m);
  }
  return { profiles, provenRanksBySport };
}

// Per-pick proven-wallet aggregates. Walks `walletDetails` and partitions
// proven wallets (CONFIRMED ∪ FLAT in this pick's sport) by side. Returns
// per-side and delta features.
//
// `For` = wallets that backed the pick's side (sideKey).
// `Ag`  = wallets that backed the opposite side (the "shadow" side).
function computeProvenWalletAggregates(walletDetails, sideKey, sport, ranksMap) {
  if (!Array.isArray(walletDetails) || !ranksMap) return null;
  const f = { count: 0, wlNet: 0, flatPnl: 0, sumRoi: 0, bestRank: null,
              topQ: 0, totalN: 0, walletList: [] };
  const a = { count: 0, wlNet: 0, flatPnl: 0, sumRoi: 0, bestRank: null,
              topQ: 0, totalN: 0, walletList: [] };

  for (const w of walletDetails) {
    if (!w?.wallet || !w?.side) continue;
    const r = ranksMap.get(w.wallet);
    if (!r) continue;                              // not proven in this sport
    const bucket = (w.side === sideKey) ? f : a;
    bucket.count   += 1;
    bucket.wlNet   += (r.wins - r.losses);
    bucket.flatPnl += r.flatPnl;
    bucket.sumRoi  += r.flatRoi;
    bucket.totalN  += r.n;
    if (r.isTopQuartile) bucket.topQ += 1;
    if (bucket.bestRank == null || r.rank < bucket.bestRank) bucket.bestRank = r.rank;
    bucket.walletList.push({ wallet: w.wallet, rank: r.rank, flatRoi: r.flatRoi });
  }

  const avgRoi = (b) => b.count > 0 ? b.sumRoi / b.count : 0;
  const topShare = (b) => b.count > 0 ? b.topQ / b.count : 0;

  return {
    forCount: f.count, agCount: a.count,
    dCount:   f.count - a.count,
    forWlNet: f.wlNet, agWlNet: a.wlNet,
    dWlNet:   f.wlNet - a.wlNet,
    forFlatPnl: f.flatPnl, agFlatPnl: a.flatPnl,
    dFlatPnl:   f.flatPnl - a.flatPnl,
    forAvgRoi: avgRoi(f), agAvgRoi: avgRoi(a),
    dAvgRoi:   avgRoi(f) - avgRoi(a),
    forBestRank: f.bestRank, agBestRank: a.bestRank,
    // Better rank = lower number. dBestRank > 0 means the For side has a
    // BETTER (lower-numbered) best rank than Ag side.
    dBestRank: (f.bestRank != null && a.bestRank != null)
      ? (a.bestRank - f.bestRank)
      : null,
    forTopQShare: topShare(f), agTopQShare: topShare(a),
    dTopQShare:   topShare(f) - topShare(a),
    forTopQCount: f.topQ, agTopQCount: a.topQ,
    dTopQCount:   f.topQ - a.topQ,
  };
}

// Opposite-side mapping — used to credit a wallet's bet as a WIN on the
// non-winning side as a LOSS on its mirror side (mirrors dailyV6Report).
const OPPOSITE_SIDE = { home: 'away', away: 'home', over: 'under', under: 'over' };

// Quick decimal-odds helper (mirrors dailyV6Report flatProfit). Used by
// the Source-A walletBets builder so the PIT tier lens has the same
// per-bet flat returns the production cohort lens uses.
function flatPnlFromOddsAndOutcome(odds, won) {
  if (won == null) return 0;
  const dec = (odds == null || odds === 0)
    ? 1.91
    : (odds > 0 ? 1 + odds / 100 : 1 + 100 / Math.abs(odds));
  return won ? dec - 1 : -1;
}

// ── Main load — adapted from dailyV6Report.loadEverything but with full
//    feature extraction for downstream analysis. Also builds Source-A
//    walletBets (one row per wallet per graded pick) so the PIT tier
//    lens has the chronological event stream it needs. ──────────────────────
async function loadPicks(provenRanksBySport) {
  const rows = [];
  const walletBets = [];   // Source A — for the PIT tier lens
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

      // Identify the winning side once per game so we can credit each
      // wallet's bet as W or L (mirrors dailyV6Report.loadEverything).
      let winningSide = null;
      for (const sk of Object.keys(sides)) {
        const oc = sides[sk]?.result?.outcome;
        if (oc === 'WIN')  { winningSide = sk; break; }
        if (oc === 'LOSS' && OPPOSITE_SIDE[sk]) { winningSide = OPPOSITE_SIDE[sk]; break; }
      }
      if (winningSide && date) {
        const seen = new Set();
        for (const [, sideObj] of Object.entries(sides)) {
          const peakObj = sideObj.peak || sideObj.lock;
          const wdAny = peakObj?.v8Scoring?.walletDetails;
          if (!Array.isArray(wdAny)) continue;
          for (const w of wdAny) {
            if (!w?.wallet || !w?.side) continue;
            const dedupe = `${doc.id}_${w.wallet}`;
            if (seen.has(dedupe)) continue;
            seen.add(dedupe);
            const betSide = sides[w.side];
            const betOdds = betSide?.peak?.odds ?? betSide?.lock?.odds ?? peakObj?.odds ?? 0;
            const won = w.side === winningSide ? 1 : 0;
            walletBets.push({
              date, sport, wallet: w.wallet, won,
              flat: flatPnlFromOddsAndOutcome(betOdds, won),
            });
          }
        }
      }

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

        // === Frozen HC stamps (v7.1+) ===
        // hcMargin = hcConfFor − hcConfAg. Only valid for picks dated
        // ≥ HC_CUTOVER (2026-04-30); pre-cutover docs have no HC stamp
        // and we leave the field null. We do NOT retro-fit.
        const hcDominant = (side.v8_hcDominant != null) ? !!side.v8_hcDominant : null;
        const hcConfFor  = (side.v8_hcConfFor  != null) ? Number(side.v8_hcConfFor)  : null;
        const hcConfAg   = (side.v8_hcConfAg   != null) ? Number(side.v8_hcConfAg)   : null;
        const hcMarginRaw = (side.v8_hcMargin != null) ? Number(side.v8_hcMargin)
          : (hcConfFor != null && hcConfAg != null ? (hcConfFor - hcConfAg) : null);
        const hcMargin = (date && date >= HC_CUTOVER) ? hcMarginRaw : null;

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

        // === Wallet details + contribution sums (lightweight — Δq cuts dropped) ===
        // We retain the raw walletDetails handle for two purposes:
        //   1. Δq fallback for legacy picks where v8_walletConsensusQualityMargin
        //      stamp is missing (still useful for the §11 logistic baseline,
        //      even though §3 / §4 no longer report Δq cuts).
        //   2. Computing the new proven-wallet per-side aggregates below.
        const wd = peak?.v8Scoring?.walletDetails;
        if (dqFrozen == null && Array.isArray(wd) && wd.length) {
          const recomputed = qualityMarginFromWalletDetails(wd, sideKey);
          if (recomputed != null) dqFrozen = recomputed;
        }
        let sumContribFor = 0, sumContribAg = 0;
        if (Array.isArray(wd)) {
          for (const w of wd) {
            if (!w?.side) continue;
            const c = w.contribution ?? 0;
            if (w.side === sideKey) sumContribFor += c;
            else                    sumContribAg += c;
          }
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

        // === NEW: Proven-wallet per-side aggregates (W/L, ROI, sport rank,
        // top-quartile membership) — driven by sharpWalletProfiles roster.
        const ranksMap = provenRanksBySport.get(sport) || null;
        const provenAgg = computeProvenWalletAggregates(wd, sideKey, sport, ranksMap);

        // === NEW (AGS): retrospective AGS aggregate over proven wallets.
        // Identical formula to production (`aggregateSideProven` in
        // src/lib/ags.js). The §AGS section pulls every feature out of
        // this aggregate and computes z-scored components downstream once
        // the calibration is loaded in main(). Stashed raw here so we can
        // do drop-one ablations and pairwise feature analysis.
        const isProvenInSport = (walletShort, sp) => !!provenRanksBySport.get(sp)?.has(walletShort);
        const agsAggRaw = (Array.isArray(wd) && wd.length)
          ? aggregateSideProven(wd, sideKey, sport, isProvenInSport)
          : null;

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
          // frozen HC stamps (post-cutover only; null otherwise)
          hcDominant, hcConfFor, hcConfAg, hcMargin,
          dwHcSum: (dwFrozen != null && hcMargin != null) ? (dwFrozen + hcMargin) : null,
          // contribution sums (Δq cuts dropped — see §4 rewrite)
          sumContribFor, sumContribAg, dContrib, maxContribFor, meanBaseFor,
          // proven-wallet per-side aggregates (new §4 input)
          provenAgg,
          // AGS raw aggregate (z-scored components attached post-load in main())
          // and a handle to the raw walletDetails so AGS sub-feature work can
          // re-aggregate at will. agsResult attached after calibration is loaded.
          walletDetails: Array.isArray(wd) ? wd : null,
          agsAggRaw,
          agsResult: null,
          // criteria
          criteria, evEdge, regime, sharpCount, totalInvested,
          moneyPct, walletPct, consensusGrade, criteriaMet,
        });
      }
    }
  }

  return { rows, walletBets, meta: { scanned, dateMin, dateMax } };
}

// Source B — graded position rows from `sharp_action_positions`. Used
// as the dollar-ROI confirmation half of the CONFIRMED tier rule.
async function loadPositionRows() {
  const rows = [];
  const snap = await db.collection('sharp_action_positions').where('status', '==', 'GRADED').get();
  for (const doc of snap.docs) {
    const d = doc.data();
    if (!d?.wallet || !d?.date || d.date < V6_CUTOVER) continue;
    const invested = Number(d.invested ?? d.size ?? 0);
    const settledPnl = Number(d.settledPnl ?? d.positionPnl ?? 0);
    if (invested <= 0) continue;
    rows.push({
      date: d.date,
      sport: d.sport || 'UNK',
      wallet: d.walletShort || String(d.wallet).slice(-6).toLowerCase(),
      invested, settledPnl,
    });
  }
  return rows;
}

// ── Helpers used by the new §2 / §3 / §4 sections ─────────────────────────
//
// `picksHcEra(rows)` returns only picks dated >= HC_CUTOVER (i.e., picks that
// could carry an HC stamp). Use this for any HC-axis analytic so we don't
// dilute with pre-cutover rows where hcMargin is structurally null.
function picksHcEra(rows) {
  return rows.filter(p => p.date && p.date >= HC_CUTOVER);
}

// HC-margin bucket label.
function hcBucketLabel(v) {
  if (v == null) return null;
  if (v <= -2) return 'HC ≤ −2';
  if (v === -1) return 'HC = −1';
  if (v === 0) return 'HC = 0';
  if (v === 1) return 'HC = +1';
  if (v === 2) return 'HC = +2';
  return 'HC ≥ +3';
}
const HC_BUCKETS = ['HC ≤ −2', 'HC = −1', 'HC = 0', 'HC = +1', 'HC = +2', 'HC ≥ +3'];

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
//
// Two pillars now: Δw (winner margin, full-sample) and HC margin (post-cutover
// only). Δq buckets dropped per directive — quality margin is downstream of
// the proven-wallet roster, which we already filter on, so Δq is double-
// counting and adds no information once we restrict to proven wallets.
function buildSection2(out, picks) {
  sectionHeader(out, '§2. Univariate signal analysis',
    'For each axis: bucket performance + Pearson/Spearman correlation with WIN and flat ROI.');

  // ─── §2a. Δw alone — full sample ─────────────────────────────────────────
  out.push('### §2a. Δw — winner margin (frozen, full sample)');
  out.push('');
  const dwBuckets = ['Δw ≤ −2', 'Δw = −1', 'Δw = 0', 'Δw = +1', 'Δw = +2', 'Δw ≥ +3'];
  const dwUniverse = picks.filter(p => p.dwFrozen != null);
  bucketTable(out, dwUniverse, p => {
    const v = p.dwFrozen;
    if (v <= -2) return 'Δw ≤ −2';
    if (v === -1) return 'Δw = −1';
    if (v === 0) return 'Δw = 0';
    if (v === 1) return 'Δw = +1';
    if (v === 2) return 'Δw = +2';
    return 'Δw ≥ +3';
  }, dwBuckets);
  const dwR  = pearsonSig(dwUniverse.map(p => p.dwFrozen), dwUniverse.map(p => p.outcome === 'WIN' ? 1 : 0));
  const dwRf = pearsonSig(dwUniverse.map(p => p.dwFrozen), dwUniverse.map(p => p.flatProfit));
  out.push('');
  out.push(`**Pearson ρ(Δw, WIN) = ${dwR.rho?.toFixed(3) ?? '—'}** ${dwR.sig}  ·  **ρ(Δw, flat ROI) = ${dwRf.rho?.toFixed(3) ?? '—'}** ${dwRf.sig}  (N=${dwUniverse.length})`);

  // ─── §2b. HC margin — post-cutover only ──────────────────────────────────
  out.push('');
  out.push(`### §2b. HC margin — high-conviction proven-wallet margin (post-cutover ${HC_CUTOVER})`);
  out.push('');
  out.push('HC = `hcConfFor − hcConfAg`. "High-conviction" wallets = `CONFIRMED` tier with `sizeRatio ≥ 1.5×` their own median bet. Pre-cutover picks have no HC stamp and are excluded from this analysis (no retro-fit).');
  out.push('');
  const hcUniverse = picksHcEra(picks).filter(p => p.hcMargin != null);
  bucketTable(out, hcUniverse, p => hcBucketLabel(p.hcMargin), HC_BUCKETS);
  const hcR  = pearsonSig(hcUniverse.map(p => p.hcMargin), hcUniverse.map(p => p.outcome === 'WIN' ? 1 : 0));
  const hcRf = pearsonSig(hcUniverse.map(p => p.hcMargin), hcUniverse.map(p => p.flatProfit));
  out.push('');
  out.push(`**Pearson ρ(HC, WIN) = ${hcR.rho?.toFixed(3) ?? '—'}** ${hcR.sig}  ·  **ρ(HC, flat ROI) = ${hcRf.rho?.toFixed(3) ?? '—'}** ${hcRf.sig}  (N=${hcUniverse.length})`);
  out.push('');
  out.push(`Spearman rank ρ(HC, flat ROI) = ${spearman(hcUniverse.map(p => p.hcMargin), hcUniverse.map(p => p.flatProfit))?.toFixed(3) ?? '—'}.`);

  // ─── §2c. Δw + HC sum — combined scalar (post-cutover only) ───────────────
  out.push('');
  out.push('### §2c. Δw + HC — combined scalar (post-cutover only)');
  out.push('');
  out.push('Sum of the two axes the engine actually relies on. Captures the v7.4 lock-floor logic (`HC ≥ +1` OR `Σ ≥ +5`) in a single ranked predictor.');
  out.push('');
  const dwHcUniverse = picksHcEra(picks).filter(p => p.dwFrozen != null && p.hcMargin != null);
  const dwHcBuckets = ['Σ ≤ 0', 'Σ = +1', 'Σ = +2', 'Σ = +3', 'Σ = +4', 'Σ = +5', 'Σ ≥ +6'];
  bucketTable(out, dwHcUniverse, p => {
    const v = p.dwHcSum;
    if (v <= 0) return 'Σ ≤ 0';
    if (v === 1) return 'Σ = +1';
    if (v === 2) return 'Σ = +2';
    if (v === 3) return 'Σ = +3';
    if (v === 4) return 'Σ = +4';
    if (v === 5) return 'Σ = +5';
    return 'Σ ≥ +6';
  }, dwHcBuckets);
  const sumR  = pearsonSig(dwHcUniverse.map(p => p.dwHcSum), dwHcUniverse.map(p => p.outcome === 'WIN' ? 1 : 0));
  const sumRf = pearsonSig(dwHcUniverse.map(p => p.dwHcSum), dwHcUniverse.map(p => p.flatProfit));
  out.push('');
  out.push(`**Pearson ρ(Δw+HC, WIN) = ${sumR.rho?.toFixed(3) ?? '—'}** ${sumR.sig}  ·  **ρ(Σ, flat ROI) = ${sumRf.rho?.toFixed(3) ?? '—'}** ${sumRf.sig}  (N=${dwHcUniverse.length})`);

  // ─── §2d. Which axis is the strongest single predictor? ─────────────────
  out.push('');
  out.push('### §2d. Which axis is the strongest single predictor?');
  out.push('');
  out.push('Comparison restricted to the post-cutover sample where every axis has a value (so the rows are apples-to-apples). N = ' + dwHcUniverse.length + '.');
  out.push('');
  out.push('| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | Verdict |');
  out.push('|---|---|---|---|---|');
  const cmpRow = (label, vals, ws, fs) => {
    const r1 = pearsonSig(vals, ws);
    const r2 = pearsonSig(vals, fs);
    const r3 = spearman(vals, fs);
    out.push(`| ${label} | ${r1.rho?.toFixed(3) ?? '—'} ${r1.sig} | ${r2.rho?.toFixed(3) ?? '—'} ${r2.sig} | ${r3?.toFixed(3) ?? '—'} | ${Math.abs(r2.rho || 0) >= 0.2 ? 'meaningful' : 'weak'} |`);
  };
  const ws = dwHcUniverse.map(p => p.outcome === 'WIN' ? 1 : 0);
  const fs = dwHcUniverse.map(p => p.flatProfit);
  cmpRow('Δw',                dwHcUniverse.map(p => p.dwFrozen),  ws, fs);
  cmpRow('HC margin',         dwHcUniverse.map(p => p.hcMargin),  ws, fs);
  cmpRow('Δw + HC',           dwHcUniverse.map(p => p.dwHcSum),   ws, fs);
  cmpRow('peak.stars',        dwHcUniverse.map(p => p.peakStars), ws, fs);
  cmpRow('vault.star',        dwHcUniverse.map(p => p.vaultStar ?? 0), ws, fs);
  cmpRow('lock.stars',        dwHcUniverse.map(p => p.lockStars), ws, fs);
}

// ─── §3. Bivariate Δw × HC matrix (post-cutover only) ─────────────────────
//
// Replaces the old Δw × Δq matrix. HC margin is the proven-wallet
// conviction signal; Δw is the broader proven-roster directional signal.
// They're conceptually orthogonal (HC = "do the BIG-stake proven wallets
// agree?"; Δw = "does the proven roster as a whole lean my way?"), so the
// 2D heatmap shows whether they reinforce, fight, or replicate each other.
function buildSection3(out, picks) {
  sectionHeader(out, '§3. Bivariate HC × Δw matrix (post-cutover ' + HC_CUTOVER + ' only)',
    'Each cell: N · W-L · WR% · Wilson 95% CI · flat ROI %. ★ flag = sig 95% one-sample t-test on flat PnL.');

  const universe = picksHcEra(picks).filter(p => p.dwFrozen != null && p.hcMargin != null);
  const dwAxis = [-3, -2, -1, 0, 1, 2, 3];
  const hcAxis = [-3, -2, -1, 0, 1, 2, 3];

  const cellOf = (hc, dw) => universe.filter(p => {
    const chc = Math.max(-3, Math.min(3, p.hcMargin));
    const cdw = Math.max(-3, Math.min(3, p.dwFrozen));
    return chc === hc && cdw === dw;
  });

  const lbl = v => v <= -3 ? '≤ −3' : v >= 3 ? '≥ +3' : (v >= 0 ? '+' : '') + v;

  const headers = ['HC \\ Δw', ...dwAxis.map(lbl)];
  out.push(`Universe N = ${universe.length} (post-cutover, both axes present).`);
  out.push('');
  out.push('| ' + headers.join(' | ') + ' |');
  out.push('|' + headers.map(() => '---').join('|') + '|');
  for (const hc of hcAxis) {
    const row = [lbl(hc)];
    for (const dw of dwAxis) {
      const arr = cellOf(hc, dw);
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

  // Marginal totals — collapse one axis at a time so we can see whether the
  // diagonal effect is real or whether one axis is dominating.
  out.push('');
  out.push('### §3b. Row totals (HC fixed, Δw collapsed)');
  out.push('');
  bucketTable(out, universe, p => hcBucketLabel(p.hcMargin), HC_BUCKETS);

  out.push('');
  out.push('### §3c. Column totals (Δw fixed, HC collapsed)');
  out.push('');
  const dwBuckets = ['Δw ≤ −2', 'Δw = −1', 'Δw = 0', 'Δw = +1', 'Δw = +2', 'Δw ≥ +3'];
  bucketTable(out, universe, p => {
    const v = p.dwFrozen;
    if (v <= -2) return 'Δw ≤ −2';
    if (v === -1) return 'Δw = −1';
    if (v === 0) return 'Δw = 0';
    if (v === 1) return 'Δw = +1';
    if (v === 2) return 'Δw = +2';
    return 'Δw ≥ +3';
  }, dwBuckets);

  // Lock-floor zone — current v7.4 lock floor is HC ≥ +1 OR (Δw ≥ +1 ∧ Δq ≥ +1
  // ∧ Σ ≥ 5). With Δq dropped, the practical lock-zone in HC-era is:
  //   Tier-1: HC ≥ +1 (any Δw)
  //   Tier-2: HC ≤ 0 ∧ Δw ≥ +2 (still strong winner-margin)
  //   No-ship: HC ≤ 0 ∧ Δw ≤ +1
  // The table below contrasts those three zones.
  out.push('');
  out.push('### §3d. Practical lock zones (v7.4 floor anatomy)');
  out.push('');
  const zoneFn = p => {
    if (p.hcMargin >= 1) return 'Tier-1: HC ≥ +1';
    if (p.dwFrozen >= 2) return 'Tier-2: HC ≤ 0 ∧ Δw ≥ +2';
    return 'No-ship zone: HC ≤ 0 ∧ Δw ≤ +1';
  };
  bucketTable(out, universe, zoneFn,
    ['Tier-1: HC ≥ +1', 'Tier-2: HC ≤ 0 ∧ Δw ≥ +2', 'No-ship zone: HC ≤ 0 ∧ Δw ≤ +1']);
}

// ─── §4. Proven-wallet feature predictors ─────────────────────────────────
//
// **NEW analysis (per user directive).** In the absence of HC margin / Δw,
// can the *characteristics* of the proven wallets themselves on each side
// predict the winner? For every pick we compute, restricted to wallets that
// are CONFIRMED ∪ FLAT in the pick's sport (the "qualified roster"):
//
//   For-side / Against-side aggregates:
//     count             — # of proven wallets on the side
//     wlNet             — Σ(wins − losses) across proven wallets in this sport
//     flatPnl           — Σ(flatPnl) across proven wallets in this sport (units)
//     avgRoi            — mean of per-wallet flatRoi (%)
//     bestRank          — best (lowest-#) sport rank on the side, where rank
//                          is determined by sorting proven wallets in the
//                          sport by flatRoi DESC
//     topQ count/share  — # / fraction of side's wallets that are in the top
//                          quartile of the sport's proven distribution
//
//   Per-pick deltas (For − Ag):
//     dCount, dWlNet, dFlatPnl, dAvgRoi, dBestRank, dTopQCount, dTopQShare
//
// Each delta is scored univariate against WIN / flat ROI. Strongly-signed
// deltas would mean: even without HC/Δw, *which* proven wallets are on
// the side carries predictive information.
//
// Universe restriction: picks where `provenAgg` is non-null AND at least
// one proven wallet appeared on the For OR Ag side (`forCount + agCount > 0`).
function buildSection4(out, picks) {
  sectionHeader(out, '§4. Proven-wallet feature predictors',
    'Even without HC / Δw, what do the *characteristics* of the proven wallets on each side tell us? Universe = `CONFIRMED ∪ FLAT` per sport. Δfeature = For-side − Against-side.');

  const universe = picks.filter(p =>
    p.provenAgg && (p.provenAgg.forCount + p.provenAgg.agCount) > 0
  );
  if (!universe.length) {
    out.push('No picks with proven-wallet aggregates available.');
    return;
  }
  out.push(`Universe N = ${universe.length} picks where ≥1 proven wallet appeared on either side.`);
  out.push('');

  // ── §4a. Δcount — how many more proven wallets on the For side? ─────────
  out.push('### §4a. ΔCount — proven-wallet count differential');
  out.push('');
  out.push('Crude version: do we win more often when the proven roster is *more numerous* on our side?');
  out.push('');
  bucketTable(out, universe, p => {
    const d = p.provenAgg.dCount;
    if (d <= -2) return 'Δcount ≤ −2 (heavy oppose)';
    if (d === -1) return 'Δcount = −1';
    if (d === 0) return 'Δcount = 0 (balanced)';
    if (d === 1) return 'Δcount = +1';
    if (d === 2) return 'Δcount = +2';
    return 'Δcount ≥ +3 (heavy support)';
  }, ['Δcount ≤ −2 (heavy oppose)', 'Δcount = −1', 'Δcount = 0 (balanced)',
       'Δcount = +1', 'Δcount = +2', 'Δcount ≥ +3 (heavy support)']);
  const dCountR  = pearsonSig(universe.map(p => p.provenAgg.dCount),
                              universe.map(p => p.outcome === 'WIN' ? 1 : 0));
  const dCountRf = pearsonSig(universe.map(p => p.provenAgg.dCount),
                              universe.map(p => p.flatProfit));
  out.push('');
  out.push(`**ρ(Δcount, WIN) = ${dCountR.rho?.toFixed(3) ?? '—'}** ${dCountR.sig}  ·  **ρ(Δcount, flat ROI) = ${dCountRf.rho?.toFixed(3) ?? '—'}** ${dCountRf.sig}`);

  // ── §4b. ΔWlNet — sum-of-wins-minus-losses across the wallets on each side
  out.push('');
  out.push('### §4b. ΔWlNet — sum-of-(wins − losses) across proven wallets on each side');
  out.push('');
  out.push('Each proven wallet brings its own historical W − L record (in this sport). ΔWlNet is `Σwl(For) − Σwl(Ag)`. A high ΔWlNet means the wallets backing our side have collectively won far more games over their tracked history than the wallets backing the opposing side.');
  out.push('');
  const wlVals = universe.map(p => p.provenAgg.dWlNet);
  const wlSorted = [...wlVals].sort((a, b) => a - b);
  const wlT1 = wlSorted[Math.floor(wlSorted.length / 5)];
  const wlT2 = wlSorted[Math.floor(2 * wlSorted.length / 5)];
  const wlT3 = wlSorted[Math.floor(3 * wlSorted.length / 5)];
  const wlT4 = wlSorted[Math.floor(4 * wlSorted.length / 5)];
  out.push(`Quintile cuts: ≤ ${wlT1?.toFixed(0)} · ≤ ${wlT2?.toFixed(0)} · ≤ ${wlT3?.toFixed(0)} · ≤ ${wlT4?.toFixed(0)} · > ${wlT4?.toFixed(0)}`);
  out.push('');
  bucketTable(out, universe, p => {
    const v = p.provenAgg.dWlNet;
    if (v <= wlT1) return 'Q1 (worst — heavy oppose)';
    if (v <= wlT2) return 'Q2';
    if (v <= wlT3) return 'Q3 (balanced)';
    if (v <= wlT4) return 'Q4';
    return 'Q5 (best — heavy support)';
  }, ['Q1 (worst — heavy oppose)', 'Q2', 'Q3 (balanced)', 'Q4', 'Q5 (best — heavy support)']);
  const wlR  = pearsonSig(wlVals, universe.map(p => p.outcome === 'WIN' ? 1 : 0));
  const wlRf = pearsonSig(wlVals, universe.map(p => p.flatProfit));
  out.push('');
  out.push(`**ρ(ΔWlNet, WIN) = ${wlR.rho?.toFixed(3) ?? '—'}** ${wlR.sig}  ·  **ρ(ΔWlNet, flat ROI) = ${wlRf.rho?.toFixed(3) ?? '—'}** ${wlRf.sig}`);

  // ── §4c. ΔFlatPnl — sum-of-flatPnL across the wallets on each side ──────
  out.push('');
  out.push('### §4c. ΔFlatPnl — sum-of-flatPnL across proven wallets on each side');
  out.push('');
  out.push('Same shape as §4b but using flatPnL (units) instead of W−L count. Captures which side has the *biggest cumulative-units winners* historically — slightly different from W−L because a 60%-WR low-volume wallet can have lower flatPnL than a 53%-WR high-volume wallet.');
  out.push('');
  const fpVals = universe.map(p => p.provenAgg.dFlatPnl);
  const fpSorted = [...fpVals].sort((a, b) => a - b);
  const fpT1 = fpSorted[Math.floor(fpSorted.length / 5)];
  const fpT2 = fpSorted[Math.floor(2 * fpSorted.length / 5)];
  const fpT3 = fpSorted[Math.floor(3 * fpSorted.length / 5)];
  const fpT4 = fpSorted[Math.floor(4 * fpSorted.length / 5)];
  out.push(`Quintile cuts (units): ≤ ${fpT1?.toFixed(2)} · ≤ ${fpT2?.toFixed(2)} · ≤ ${fpT3?.toFixed(2)} · ≤ ${fpT4?.toFixed(2)} · > ${fpT4?.toFixed(2)}`);
  out.push('');
  bucketTable(out, universe, p => {
    const v = p.provenAgg.dFlatPnl;
    if (v <= fpT1) return 'Q1';
    if (v <= fpT2) return 'Q2';
    if (v <= fpT3) return 'Q3';
    if (v <= fpT4) return 'Q4';
    return 'Q5';
  }, ['Q1', 'Q2', 'Q3', 'Q4', 'Q5']);
  const fpR  = pearsonSig(fpVals, universe.map(p => p.outcome === 'WIN' ? 1 : 0));
  const fpRf = pearsonSig(fpVals, universe.map(p => p.flatProfit));
  out.push('');
  out.push(`**ρ(ΔFlatPnl, WIN) = ${fpR.rho?.toFixed(3) ?? '—'}** ${fpR.sig}  ·  **ρ(ΔFlatPnl, flat ROI) = ${fpRf.rho?.toFixed(3) ?? '—'}** ${fpRf.sig}`);

  // ── §4d. ΔAvgRoi — average-of-flatRoi across the wallets on each side ────
  out.push('');
  out.push('### §4d. ΔAvgRoi — mean-of-flatRoi across proven wallets on each side');
  out.push('');
  out.push('Normalizes for volume: a side with 5 sharp wallets averaging +20% ROI scores higher than a side with 5 sharp wallets averaging +3% ROI, even if the W−L counts are similar. Pure quality lens.');
  out.push('');
  const arVals = universe.map(p => p.provenAgg.dAvgRoi);
  const arSorted = [...arVals].sort((a, b) => a - b);
  const arT1 = arSorted[Math.floor(arSorted.length / 5)];
  const arT2 = arSorted[Math.floor(2 * arSorted.length / 5)];
  const arT3 = arSorted[Math.floor(3 * arSorted.length / 5)];
  const arT4 = arSorted[Math.floor(4 * arSorted.length / 5)];
  out.push(`Quintile cuts (% ROI): ≤ ${arT1?.toFixed(1)} · ≤ ${arT2?.toFixed(1)} · ≤ ${arT3?.toFixed(1)} · ≤ ${arT4?.toFixed(1)} · > ${arT4?.toFixed(1)}`);
  out.push('');
  bucketTable(out, universe, p => {
    const v = p.provenAgg.dAvgRoi;
    if (v <= arT1) return 'Q1';
    if (v <= arT2) return 'Q2';
    if (v <= arT3) return 'Q3';
    if (v <= arT4) return 'Q4';
    return 'Q5';
  }, ['Q1', 'Q2', 'Q3', 'Q4', 'Q5']);
  const arR  = pearsonSig(arVals, universe.map(p => p.outcome === 'WIN' ? 1 : 0));
  const arRf = pearsonSig(arVals, universe.map(p => p.flatProfit));
  out.push('');
  out.push(`**ρ(ΔAvgRoi, WIN) = ${arR.rho?.toFixed(3) ?? '—'}** ${arR.sig}  ·  **ρ(ΔAvgRoi, flat ROI) = ${arRf.rho?.toFixed(3) ?? '—'}** ${arRf.sig}`);

  // ── §4e. Sport-rank comparison ──────────────────────────────────────────
  out.push('');
  out.push('### §4e. Sport-rank comparison — best rank on each side');
  out.push('');
  out.push('For each pick we look up the BEST (lowest-numbered) sport rank among proven wallets on each side. ΔBestRank > 0 = our side has a *better* (lower-numbered) top wallet than the opposite side.');
  out.push('');
  const haveRanks = universe.filter(p => p.provenAgg.dBestRank != null);
  bucketTable(out, haveRanks, p => {
    const d = p.provenAgg.dBestRank;
    if (d <= -5) return 'ΔBestRank ≤ −5 (we have worse #1 by ≥5)';
    if (d <= -1) return 'ΔBestRank ∈ [−4,−1]';
    if (d === 0) return 'ΔBestRank = 0 (tied)';
    if (d <= 4)  return 'ΔBestRank ∈ [+1,+4]';
    return 'ΔBestRank ≥ +5 (we have better #1 by ≥5)';
  }, ['ΔBestRank ≤ −5 (we have worse #1 by ≥5)', 'ΔBestRank ∈ [−4,−1]',
       'ΔBestRank = 0 (tied)', 'ΔBestRank ∈ [+1,+4]',
       'ΔBestRank ≥ +5 (we have better #1 by ≥5)']);
  const brR  = pearsonSig(haveRanks.map(p => p.provenAgg.dBestRank),
                          haveRanks.map(p => p.outcome === 'WIN' ? 1 : 0));
  const brRf = pearsonSig(haveRanks.map(p => p.provenAgg.dBestRank),
                          haveRanks.map(p => p.flatProfit));
  out.push('');
  out.push(`**ρ(ΔBestRank, WIN) = ${brR.rho?.toFixed(3) ?? '—'}** ${brR.sig}  ·  **ρ(ΔBestRank, flat ROI) = ${brRf.rho?.toFixed(3) ?? '—'}** ${brRf.sig}  (N=${haveRanks.length})`);

  // ── §4f. Top-quartile share differential ────────────────────────────────
  out.push('');
  out.push(`### §4f. ΔTopQ share — fraction-of-side that's in the sport's top quartile`);
  out.push('');
  out.push(`Top quartile = top ${(TOP_QUARTILE_FRAC * 100).toFixed(0)}% of proven wallets in the sport, ranked by flatRoi. Δshare > 0 = our side is more concentrated in elite wallets than the opposite.`);
  out.push('');
  bucketTable(out, universe, p => {
    const d = p.provenAgg.dTopQShare;
    if (d <= -0.30) return 'Δshare ≤ −30 pp';
    if (d <= -0.10) return 'Δshare ∈ [−30,−10] pp';
    if (d <= 0.10)  return 'Δshare ≈ 0 (±10 pp)';
    if (d <= 0.30)  return 'Δshare ∈ [+10,+30] pp';
    return 'Δshare ≥ +30 pp';
  }, ['Δshare ≤ −30 pp', 'Δshare ∈ [−30,−10] pp',
       'Δshare ≈ 0 (±10 pp)', 'Δshare ∈ [+10,+30] pp', 'Δshare ≥ +30 pp']);
  const tqR  = pearsonSig(universe.map(p => p.provenAgg.dTopQShare),
                          universe.map(p => p.outcome === 'WIN' ? 1 : 0));
  const tqRf = pearsonSig(universe.map(p => p.provenAgg.dTopQShare),
                          universe.map(p => p.flatProfit));
  out.push('');
  out.push(`**ρ(ΔTopQShare, WIN) = ${tqR.rho?.toFixed(3) ?? '—'}** ${tqR.sig}  ·  **ρ(ΔTopQShare, flat ROI) = ${tqRf.rho?.toFixed(3) ?? '—'}** ${tqRf.sig}`);

  // ── §4g. Predictor leaderboard — rank all the new features together ─────
  out.push('');
  out.push('### §4g. Predictor leaderboard — which proven-wallet feature is strongest?');
  out.push('');
  out.push('Apples-to-apples (same N for all rows). Sorted by |ρ(·, flat ROI)|.');
  out.push('');
  const ws = universe.map(p => p.outcome === 'WIN' ? 1 : 0);
  const fs = universe.map(p => p.flatProfit);
  const candidates = [
    ['Δcount',         universe.map(p => p.provenAgg.dCount)],
    ['ΔWlNet',         universe.map(p => p.provenAgg.dWlNet)],
    ['ΔFlatPnl',       universe.map(p => p.provenAgg.dFlatPnl)],
    ['ΔAvgRoi',        universe.map(p => p.provenAgg.dAvgRoi)],
    ['ΔTopQShare',     universe.map(p => p.provenAgg.dTopQShare)],
    ['ΔTopQCount',     universe.map(p => p.provenAgg.dTopQCount)],
  ];
  // ΔBestRank is computed only over rows where both sides have a proven
  // wallet; we score it on its own restricted N for fairness.
  const ranked = candidates.map(([name, vals]) => {
    const r1 = pearsonSig(vals, ws);
    const r2 = pearsonSig(vals, fs);
    const r3 = spearman(vals, fs);
    return { name, rho_win: r1.rho, win_sig: r1.sig, rho_roi: r2.rho, roi_sig: r2.sig, spear: r3 };
  }).sort((a, b) => Math.abs(b.rho_roi || 0) - Math.abs(a.rho_roi || 0));
  out.push('| Rank | Feature | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ |');
  out.push('|---|---|---|---|---|');
  ranked.forEach((r, i) => {
    out.push(`| ${i + 1} | **${r.name}** | ${r.rho_win?.toFixed(3) ?? '—'} ${r.win_sig} | ${r.rho_roi?.toFixed(3) ?? '—'} ${r.roi_sig} | ${r.spear?.toFixed(3) ?? '—'} |`);
  });
  out.push('');
  // ΔBestRank reported separately because of its restricted N.
  if (haveRanks.length) {
    const br = pearsonSig(haveRanks.map(p => p.provenAgg.dBestRank),
                          haveRanks.map(p => p.flatProfit));
    out.push(`_(ΔBestRank uses N=${haveRanks.length} subset where both sides had a proven wallet — ρ(flat ROI) = ${br.rho?.toFixed(3) ?? '—'} ${br.sig}.)_`);
  }
}

// ─── §AGS. Aggregate Score (AGS) deep dive ────────────────────────────────
//
// AGS = z-summed composite of 6 features computed from the proven-wallet
// (CONFIRMED ∪ FLAT) slice of `peak.v8Scoring.walletDetails[]`. The six
// features are defined in src/lib/ags.js → AGS_FEATURES and the active
// calibration (means/SDs per feature) is loaded from
// `agsCalibration/current` in Firestore (or the hardcoded fallback).
//
// This section answers two questions:
//   (a) Is AGS earning its place in the lock/mute logic?
//   (b) Of the six inputs, which are doing the work and which are ballast?
//
// **All numbers below are point-in-time / out-of-sample.** Each pick is
// scored using:
//   • PIT proven gate: a wallet counts as "proven" only if it had crossed
//     the FLAT or CONFIRMED threshold strictly BEFORE this pick's date,
//     using the chronological-event tier lens (`scripts/lib/pitTierLens.js`).
//   • Walk-forward calibration: feature means/SDs computed from picks
//     strictly BEFORE this pick's date. Cold-start (prior N < 30) uses
//     the live Firestore calibration as a stand-in.
// The §AGS-0a leakage audit at the top compares these PIT-OOS numbers
// against the in-sample-leaky version (today's tier + today's calibration)
// so you can see exactly how much the leakage was inflating the in-sample
// fire ladder.
//
// Sub-sections:
//   §AGS-0a. Leakage audit — in-sample vs PIT-OOS side-by-side
//   §AGS-1.  Coverage + distribution + tier counts (PIT-OOS)
//   §AGS-2.  AGS tier × outcome (the "fire ladder", PIT-OOS)
//   §AGS-3.  Per-feature univariate predictive power
//   §AGS-4.  Per-feature contribution to the AGS score itself (does it move?)
//   §AGS-5.  Pairwise feature correlation matrix (which inputs are redundant)
//   §AGS-6.  Drop-one ablation (recompute AGS leaving each feature out)
//   §AGS-7.  Multivariate logistic regression on the 6 z-scored features
//   §AGS-8.  Final ranked verdict + recommendations
function buildSectionAgs(out, picks, meta) {
  const cal = meta.agsCalibration;
  const calSrc = cal?.source || (cal === AGS_FALLBACK_CALIBRATION ? 'fallback' : 'firestore');
  sectionHeader(out, '§AGS. Aggregate Score deep dive (point-in-time / out-of-sample)',
    'Which of the six AGS inputs are pulling the weight, and is the composite earning its place vs. its parts? Numbers below are leakage-free (PIT proven gate + walk-forward calibration).');

  out.push('### §AGS-0. What AGS is, in one paragraph');
  out.push('');
  out.push('AGS aggregates the proven-wallet (`CONFIRMED` ∪ `FLAT`) slice of `peak.v8Scoring.walletDetails[]` into 6 *delta* features (FOR-side minus AGAINST-side), z-scores each one against a daily-recomputed calibration, and **sums the z-scores**. Equal sign-weighted — no fitted coefficients. Thresholds: `AGS ≥ +5` rescues a lock (route C), `AGS ≥ +3` confirms a thin Δw=+1 lock (v7.5 route B), `AGS < -1` mutes an otherwise-locking side (confirmation gate). Sizing multiplier scales [0.5, 1.0]× over [-1, +5].');
  out.push('');
  out.push(`**In-sample (live production) calibration**: source = \`${calSrc}\`, sampleSize = ${cal?.sampleSize ?? 'n/a'}, dateRange = ${cal?.dateRange?.from || '?'} → ${cal?.dateRange?.to || '?'}, computedAt = ${cal?.computedAt || '?'}. _This is what production scores against today; the §AGS-0a audit below shows how much its in-sample numbers diverge from the leakage-free walk-forward version._`);

  // ── §AGS-0a. Leakage audit (in-sample vs PIT-OOS) ──────────────────────
  // Two sources of leakage in the original §AGS analysis:
  //   1. "Proven" gate uses today's tier (a wallet that earned CONFIRMED
  //      last week was retroactively counted as proven for ALL their
  //      historical picks). Fix: PIT lens — tier-as-of-pick-date, strictly
  //      prior events only.
  //   2. Calibration normalizers and thresholds were tuned on a sample
  //      that overlaps with what we're now testing against. Fix: walk-
  //      forward — score each pick against calibration computed from
  //      strictly prior picks. Thresholds (+5/+3/-1) are still production
  //      constants; we just measure their OOS lift.
  // The audit table below shows the same fire ladder under both lenses.
  out.push('');
  out.push('### §AGS-0a. Leakage audit — in-sample vs point-in-time / out-of-sample');
  out.push('');
  out.push('Two sources of leakage existed in the prior version of this section: (1) a wallet was treated as "proven" if it currently has CONFIRMED/FLAT tier, even for picks made before it earned that status; (2) the AGS calibration normalizers (and the +5/+3/-1 thresholds tuned against them) were computed on data that overlaps with the test sample. The PIT/OOS pass replaces both: it uses a chronological tier lens (proven gate fires only on events strictly prior to the pick date) and walk-forward calibration (mean/SD per feature recomputed at each pick date from prior picks only, cold-started from live calibration when prior N < ' + meta.pitWalkMin + ').');
  out.push('');
  out.push(`Coverage: in-sample AGS computable on **${meta.agsCovered}** rows · PIT aggregate computable on **${meta.pitAggCovered}** rows (the proven wallet count drops because some wallets weren't yet proven on those early dates) · PIT walk-forward AGS computed on **${meta.pitAgsCovered}** rows (${meta.pitColdStartN} used the cold-start fallback calibration for the early dates).`);
  out.push('');
  out.push('Same rows, same outcomes — only the AGS scoring lens differs:');
  out.push('');
  // Cohort lift comparison at the production thresholds.
  const cmpRows = picks.filter(p => p?.agsResult?.ags != null && p?.agsResultPit?.ags != null);
  const isWin = (p) => p.outcome === 'WIN';
  const fireStat = (arr) => {
    const n = arr.length;
    const w = arr.filter(isWin).length;
    const wlDen = arr.filter(p => isWin(p) || p.outcome === 'LOSS').length;
    const wr = wlDen ? (w / wlDen) * 100 : null;
    const roi = n ? (arr.reduce((s, p) => s + (p.flatProfit || 0), 0) / n) * 100 : null;
    return { n, wr, roi };
  };
  const tierBuckets = ['ELITE (≥+7)', 'LOCK (+5..+7)', 'STRONG (+3..+5)', 'NEUTRAL (0..+3)', 'WEAK (−3..0)', 'FADE (<−3)'];
  const tierFromAgs = (a) => {
    if (a == null) return null;
    if (a >= 7) return tierBuckets[0];
    if (a >= 5) return tierBuckets[1];
    if (a >= 3) return tierBuckets[2];
    if (a >= 0) return tierBuckets[3];
    if (a >= -3) return tierBuckets[4];
    return tierBuckets[5];
  };
  out.push('| Tier | In-sample N · WR · ROI | PIT-OOS N · WR · ROI | Δ ROI (OOS − in-sample) |');
  out.push('|---|---|---|---|');
  for (const tier of tierBuckets) {
    const inArr  = cmpRows.filter(r => tierFromAgs(r.agsResult?.ags) === tier);
    const oosArr = cmpRows.filter(r => tierFromAgs(r.agsResultPit?.ags) === tier);
    const a = fireStat(inArr);
    const b = fireStat(oosArr);
    const fmtCell = (s) => s.n ? `${s.n} · ${s.wr != null ? s.wr.toFixed(0)+'%' : '—'} · ${s.roi != null ? sign(s.roi, 1)+'%' : '—'}` : '0 · — · —';
    const dRoi = (a.roi != null && b.roi != null) ? (b.roi - a.roi) : null;
    out.push(`| ${tier} | ${fmtCell(a)} | ${fmtCell(b)} | ${dRoi != null ? sign(dRoi, 1)+'pp' : '—'} |`);
  }
  out.push('');
  out.push('Production-threshold lift (the rules that actually fire):');
  out.push('');
  out.push('| Floor | In-sample fire | PIT-OOS fire | Δ ROI (OOS − in-sample) |');
  out.push('|---|---|---|---|');
  const floors = [
    ['AGS ≥ +5 (lock-floor route C)', AGS_LOCK_FLOOR],
    ['AGS ≥ +3 (Δw=+1 confirm route B)', AGS_DW1_FLOOR],
    ['AGS < −1 (mute veto)', AGS_MUTE_FLOOR],
  ];
  for (const [label, thresh] of floors) {
    const isMute = label.includes('mute');
    const inArr = cmpRows.filter(r => isMute ? (r.agsResult?.ags < thresh) : (r.agsResult?.ags >= thresh));
    const oosArr = cmpRows.filter(r => isMute ? (r.agsResultPit?.ags < thresh) : (r.agsResultPit?.ags >= thresh));
    const a = fireStat(inArr);
    const b = fireStat(oosArr);
    const fmtCell = (s) => s.n ? `N=${s.n}, WR=${s.wr?.toFixed(0) ?? '—'}%, ROI=${sign(s.roi, 1)}%` : 'N=0, —';
    const dRoi = (a.roi != null && b.roi != null) ? (b.roi - a.roi) : null;
    out.push(`| ${label} | ${fmtCell(a)} | ${fmtCell(b)} | ${dRoi != null ? sign(dRoi, 1)+'pp' : '—'} |`);
  }
  out.push('');
  out.push('_Reading: a large negative Δ in the LOCK / STRONG rows = the in-sample numbers were optimistically inflated by leakage. A small Δ = the original analysis was directionally honest. The PIT-OOS numbers are what the engine would have produced if every pick had been scored at the moment it was made._');

  // ── Holdout sub-cell — last 14 days only, PIT-OOS ─────────────────────
  // The walk-forward calibration's cold-start phase uses the live
  // calibration as a stand-in (early picks lack enough prior history).
  // The "true" out-of-sample window is the more recent picks where the
  // walk-forward calibration was computed entirely from prior data —
  // here we slice to the last 14 calendar days as the cleanest holdout.
  const allDates = [...new Set(picks.map(p => p.date).filter(Boolean))].sort();
  if (allDates.length >= 14) {
    const cutoffDate = allDates[allDates.length - 14];
    const recentRows = cmpRows.filter(r => r.date && r.date >= cutoffDate);
    if (recentRows.length >= 10) {
      out.push('');
      out.push(`#### §AGS-0a-recent. Last-14-days holdout (PIT-OOS, ${cutoffDate} → ${allDates[allDates.length - 1]}, N=${recentRows.length})`);
      out.push('');
      out.push('The cleanest out-of-sample window — every pick here was scored against a walk-forward calibration computed entirely from prior dates (no cold-start fallback in this slice).');
      out.push('');
      out.push('| Tier | N · WR · ROI |');
      out.push('|---|---|');
      for (const tier of tierBuckets) {
        const arr = recentRows.filter(r => tierFromAgs(r.agsResultPit?.ags) === tier);
        const s = fireStat(arr);
        const fmtCell = (s) => s.n ? `${s.n} · ${s.wr != null ? s.wr.toFixed(0)+'%' : '—'} · ${s.roi != null ? sign(s.roi, 1)+'%' : '—'}` : '0 · — · —';
        out.push(`| ${tier} | ${fmtCell(s)} |`);
      }
      out.push('');
      out.push('| Floor | Fire (PIT-OOS, last 14d) |');
      out.push('|---|---|');
      for (const [label, thresh] of floors) {
        const isMute = label.includes('mute');
        const arr = recentRows.filter(r => isMute ? (r.agsResultPit?.ags < thresh) : (r.agsResultPit?.ags >= thresh));
        const s = fireStat(arr);
        const fmtCell = (s) => s.n ? `N=${s.n}, WR=${s.wr?.toFixed(0) ?? '—'}%, ROI=${sign(s.roi, 1)}%` : 'N=0, —';
        out.push(`| ${label} | ${fmtCell(s)} |`);
      }
    }
  }
  out.push('');
  out.push('#### Reference: in-sample calibration normalizers (used only as cold-start fallback during PIT walk-forward)');
  out.push('');
  out.push('| Feature key | Family | Sign | Cal mean | Cal SD |');
  out.push('|---|---|---|---|---|');
  for (const f of AGS_FEATURES) {
    const norm = cal?.normalizers?.[f.key];
    out.push(`| \`${f.key}\` | ${f.family} | ${f.sign > 0 ? '+' : '−'} | ${norm?.mean?.toFixed(2) ?? '—'} | ${norm?.sd?.toFixed(2) ?? '—'} |`);
  }

  // Subset: rows where AGS could be computed retrospectively under PIT-OOS.
  const agsRows = picks.filter(p => p?.agsResultPit?.ags != null && Number.isFinite(p.agsResultPit.ags));
  if (agsRows.length < 10) {
    out.push('');
    out.push(`_AGS-eligible sample too small (${agsRows.length} rows). Need at least 10 to run the deep dive — exiting section._`);
    return;
  }

  // ── §AGS-1. Coverage + distribution + tier counts ──────────────────────
  out.push('');
  out.push('### §AGS-1. Coverage + distribution');
  out.push('');
  const coveragePct = (agsRows.length / picks.length) * 100;
  const agsValues = agsRows.map(p => p.agsResultPit.ags).sort((a, b) => a - b);
  const q = (p) => agsValues[Math.floor((agsValues.length - 1) * p)];
  out.push(`PIT-OOS AGS computable on **${agsRows.length}/${picks.length}** shipped+graded rows (${coveragePct.toFixed(0)}%). Rows drop out for two reasons: missing frozen \`walletDetails[]\` (older docs), or no wallet on either side was yet proven on this pick's date under the strict-prior PIT lens.`);
  out.push('');
  out.push('| Stat | AGS value |');
  out.push('|---|---|');
  out.push(`| Min | ${agsValues[0].toFixed(2)} |`);
  out.push(`| 20th pct | ${q(0.2).toFixed(2)} |`);
  out.push(`| 40th pct | ${q(0.4).toFixed(2)} |`);
  out.push(`| Median | ${q(0.5).toFixed(2)} |`);
  out.push(`| 60th pct | ${q(0.6).toFixed(2)} |`);
  out.push(`| 80th pct | ${q(0.8).toFixed(2)} |`);
  out.push(`| 90th pct | ${q(0.9).toFixed(2)} |`);
  out.push(`| Max | ${agsValues[agsValues.length - 1].toFixed(2)} |`);
  out.push('');
  out.push('**Tier counts (boundaries set in `src/lib/ags.js → agsTierFromValue`):**');
  out.push('');
  const tierOrder = ['ELITE', 'LOCK', 'STRONG', 'NEUTRAL', 'WEAK', 'FADE'];
  const tierBound = { ELITE: '≥ +7', LOCK: '+5..+7', STRONG: '+3..+5', NEUTRAL: '0..+3', WEAK: '−3..0', FADE: '< −3' };
  const tierCounts = Object.fromEntries(tierOrder.map(t => [t, 0]));
  for (const r of agsRows) tierCounts[r.agsResultPit.tier] = (tierCounts[r.agsResultPit.tier] || 0) + 1;
  out.push('| Tier | Range | N | Share |');
  out.push('|---|---|---|---|');
  for (const t of tierOrder) {
    const n = tierCounts[t] || 0;
    const share = (n / agsRows.length * 100).toFixed(1);
    out.push(`| **${t}** | ${tierBound[t]} | ${n} | ${share}% |`);
  }

  // ── §AGS-2. Tier × outcome (the fire ladder) ───────────────────────────
  out.push('');
  out.push('### §AGS-2. AGS tier × outcome — does the ladder pay?');
  out.push('');
  out.push('If the AGS calibration is right, win-rate and flat ROI should rise monotonically up the tier ladder. Sample sizes inside FADE/ELITE will be thin — read the directional signal, not the point estimate.');
  out.push('');
  bucketTable(out, agsRows, p => p.agsResultPit.tier, tierOrder);

  // ── §AGS-3. Per-feature univariate predictive power ────────────────────
  // For each of the 6 features we report:
  //   • raw Pearson r vs. WIN (binary outcome)
  //   • Pearson r vs. flat profit per pick
  //   • Spearman rank ρ vs. flat profit (robust to outliers)
  //   • 4-bucket WR/ROI table on the z-scored feature (z<-1, z∈[-1,0),
  //     z∈[0,1), z≥+1) — using the same cal mean/SD the production
  //     formula uses, so this is exactly what AGS sees.
  out.push('');
  out.push('### §AGS-3. Per-feature univariate predictive power');
  out.push('');
  out.push('Each of the 6 inputs evaluated on its own. \`r(WIN)\` and \`r(ROI)\` are the Pearson correlations against win-binary and flat profit; Spearman ρ is the rank-based version (robust to fat tails). The bucketed table partitions on the z-scored feature using the active calibration so a "z ≥ +1" row is exactly what the production AGS sees as a strongly positive contribution.');
  out.push('');
  const wins = agsRows.map(p => p.outcome === 'WIN' ? 1 : 0);
  const flats = agsRows.map(p => p.flatProfit);
  const featureSummaries = [];
  for (const f of AGS_FEATURES) {
    const raw = agsRows.map(p => Number(p.agsAggRawPit?.[f.key] ?? 0));
    const zs  = agsRows.map(p => Number(p.agsResultPit?.components?.[f.key] ?? 0));
    const rWin = pearsonSig(raw, wins);
    const rRoi = pearsonSig(raw, flats);
    const sRoi = spearman(raw, flats);
    featureSummaries.push({
      key: f.key, family: f.family,
      rWin: rWin.rho, rWinSig: rWin.sig,
      rRoi: rRoi.rho, rRoiSig: rRoi.sig,
      sRoi,
      meanZ: zs.reduce((s, v) => s + v, 0) / zs.length,
      meanAbsZ: zs.reduce((s, v) => s + Math.abs(v), 0) / zs.length,
    });
    out.push(`#### \`${f.key}\` (${f.family})`);
    out.push('');
    out.push(`r(WIN) = **${rWin.rho?.toFixed(3) ?? '—'}** ${rWin.sig} · r(ROI) = **${rRoi.rho?.toFixed(3) ?? '—'}** ${rRoi.sig} · Spearman ρ(ROI) = **${sRoi?.toFixed(3) ?? '—'}**.`);
    out.push('');
    const zBucket = (z) => {
      if (z < -1) return 'z < −1 (very negative)';
      if (z < 0)  return 'z ∈ [−1, 0)';
      if (z < 1)  return 'z ∈ [0, +1)';
      return 'z ≥ +1 (very positive)';
    };
    bucketTable(out, agsRows, p => zBucket(Number(p.agsResultPit?.components?.[f.key] ?? 0)),
      ['z < −1 (very negative)', 'z ∈ [−1, 0)', 'z ∈ [0, +1)', 'z ≥ +1 (very positive)']);
    out.push('');
  }

  // Sorted recap by |Spearman ρ|
  out.push('#### §AGS-3 recap — features sorted by univariate predictive power (|Spearman ρ vs. ROI|)');
  out.push('');
  out.push('| Rank | Feature | Family | r(WIN) | r(ROI) | Spearman ρ |');
  out.push('|---|---|---|---|---|---|');
  const sortedUni = [...featureSummaries].sort((a, b) => Math.abs(b.sRoi || 0) - Math.abs(a.sRoi || 0));
  sortedUni.forEach((f, i) => {
    out.push(`| ${i + 1} | \`${f.key}\` | ${f.family} | ${f.rWin?.toFixed(3) ?? '—'} ${f.rWinSig} | ${f.rRoi?.toFixed(3) ?? '—'} ${f.rRoiSig} | ${f.sRoi?.toFixed(3) ?? '—'} |`);
  });

  // ── §AGS-4. Per-feature contribution to AGS itself ─────────────────────
  // "Does this feature actually MOVE the score?" Mean signed z gives the
  // average pull; mean |z| gives the average magnitude. A feature with
  // mean |z| ≈ 0 contributes almost nothing to AGS regardless of its
  // theoretical importance — it's a dead input.
  out.push('');
  out.push('### §AGS-4. Per-feature contribution to the AGS score itself');
  out.push('');
  out.push('A feature with mean |z| ≈ 0 contributes almost nothing to AGS in practice — even if it correlates with outcome, the calibration normalizes it down to silence. This is the "is the input even moving the dial" check. **Share of |AGS|** = mean |z| ÷ Σ mean |z|, the average percentage of the absolute AGS magnitude this feature accounts for.');
  out.push('');
  const sumAbsZ = featureSummaries.reduce((s, f) => s + (f.meanAbsZ || 0), 0) || 1;
  const contribRows = featureSummaries.map(f => ({
    ...f,
    share: (f.meanAbsZ / sumAbsZ) * 100,
  })).sort((a, b) => b.meanAbsZ - a.meanAbsZ);
  out.push('| Rank | Feature | Mean signed z | Mean &#124;z&#124; | Share of &#124;AGS&#124; | Verdict |');
  out.push('|---|---|---|---|---|---|');
  contribRows.forEach((f, i) => {
    const verdict = f.meanAbsZ < 0.2 ? 'silent (<0.2)' : f.meanAbsZ < 0.5 ? 'mild' : f.meanAbsZ < 0.8 ? 'meaningful' : 'dominant';
    out.push(`| ${i + 1} | \`${f.key}\` | ${sign(f.meanZ, 3)} | ${f.meanAbsZ.toFixed(3)} | ${f.share.toFixed(1)}% | ${verdict} |`);
  });

  // ── §AGS-5. Pairwise feature correlation matrix ────────────────────────
  out.push('');
  out.push('### §AGS-5. Pairwise feature correlation (Pearson r between z-scored features)');
  out.push('');
  out.push('Two features with |r| ≥ 0.7 are double-counting. Two with |r| ≤ 0.2 are orthogonal — keeping both adds genuine information. The composite design assumes mostly orthogonal inputs; this matrix is the audit.');
  out.push('');
  const featureCols = AGS_FEATURES.map(f => f.key);
  const featureZArrs = Object.fromEntries(featureCols.map(k => [k,
    agsRows.map(p => Number(p.agsResultPit?.components?.[k] ?? 0))]));
  out.push('| | ' + featureCols.map(k => `\`${k}\``).join(' | ') + ' |');
  out.push('|---|' + featureCols.map(() => '---').join('|') + '|');
  for (const a of featureCols) {
    const cells = featureCols.map(b => {
      if (a === b) return '1.000';
      const r = pearson(featureZArrs[a], featureZArrs[b]);
      const tag = Math.abs(r) >= 0.7 ? ' ⚠' : '';
      return `${r >= 0 ? '+' : ''}${r.toFixed(3)}${tag}`;
    });
    out.push(`| \`${a}\` | ${cells.join(' | ')} |`);
  }
  out.push('');
  out.push('_⚠ flags |r| ≥ 0.7 — those pairs are essentially the same signal._');

  // ── §AGS-6. Drop-one ablation ──────────────────────────────────────────
  // For each feature, recompute AGS as the sum of the OTHER 5 z-scores
  // (preserving each feature's sign). Then evaluate three lenses:
  //   1. Discriminative power: Spearman ρ(ablated AGS, flat profit) — how
  //      well does the 5-feature composite still rank picks by outcome?
  //      Drop in |ρ| vs full-AGS = the marginal info that feature carried.
  //   2. Cohort-matched lift: take the top-K rows ranked by ablated AGS
  //      where K = baseline lock-floor N. ROI of that top-K vs baseline
  //      ROI = the lift this feature was buying us at fixed cohort size.
  //      (Avoids the cohort-shrink confound of a fixed-threshold cut.)
  //   3. Same-threshold cohort: the raw drop-one-and-cut cell, included
  //      for transparency but read with the caveat that fewer picks pass
  //      the threshold which mechanically inflates the surviving subset.
  out.push('');
  out.push('### §AGS-6. Drop-one ablation — what happens if we remove each feature?');
  out.push('');
  out.push('For each of the 6 inputs, recompute AGS as the **sum of the OTHER 5 z-scores** (each contribution preserved with its original sign), then evaluate three lenses. **The discriminative-power lens (Spearman ρ vs. outcome) is the cleanest** — a big drop in |ρ| means that feature carried marginal info the other five lacked. The cohort-matched lens compares apples-to-apples by holding cohort size fixed at the baseline lock-floor N. The same-threshold lens is included for transparency but read it with the caveat that removing a feature mechanically shrinks the cohort, so the surviving subset can look stronger purely from sample selection.');
  out.push('');
  // Baseline.
  const baselineLockArr = agsRows.filter(r => r.agsResultPit.ags >= AGS_LOCK_FLOOR);
  const baselineConfArr = agsRows.filter(r => r.agsResultPit.ags >= AGS_DW1_FLOOR);
  const sumStat = (arr) => {
    if (!arr.length) return { n: 0, wr: null, roi: null };
    const w = arr.filter(p => p.outcome === 'WIN').length;
    const wrDen = arr.filter(p => p.outcome === 'WIN' || p.outcome === 'LOSS').length;
    const roi = arr.reduce((s, p) => s + (p.flatProfit || 0), 0) / arr.length;
    return { n: arr.length, wr: wrDen ? w / wrDen : null, roi };
  };
  const baselineLock = sumStat(baselineLockArr);
  const baselineConf = sumStat(baselineConfArr);
  const lockK = baselineLock.n;
  const baselineFullSpear = spearman(agsRows.map(r => r.agsResultPit.ags), agsRows.map(r => r.flatProfit));
  out.push(`**Baseline (full 6-feature AGS):** Spearman ρ(AGS, flat ROI) = **${baselineFullSpear?.toFixed(3) ?? '—'}**. At AGS ≥ +${AGS_LOCK_FLOOR} fires N=${baselineLock.n}, WR=${baselineLock.wr != null ? (baselineLock.wr*100).toFixed(1)+'%' : '—'}, ROI=${baselineLock.roi != null ? sign(baselineLock.roi*100, 1)+'%' : '—'}. At AGS ≥ +${AGS_DW1_FLOOR} fires N=${baselineConf.n}, WR=${baselineConf.wr != null ? (baselineConf.wr*100).toFixed(1)+'%' : '—'}, ROI=${baselineConf.roi != null ? sign(baselineConf.roi*100, 1)+'%' : '—'}.`);
  out.push('');
  out.push('| Feature dropped | ρ(5-feat AGS, ROI) | ρ drop vs full | Top-' + lockK + ' ROI (matched cohort) | Top-' + lockK + ' lift loss vs baseline | Same-threshold ≥+5 cell |');
  out.push('|---|---|---|---|---|---|');
  const ablationRows = [];
  for (const f of AGS_FEATURES) {
    const droppedAgs = agsRows.map(r => {
      const comps = r.agsResultPit?.components || {};
      let s = 0;
      for (const ff of AGS_FEATURES) {
        if (ff.key === f.key) continue;
        s += ff.sign * Number(comps[ff.key] ?? 0);
      }
      return { row: r, agsAblated: s };
    });
    // 1. Discriminative power
    const ablSpear = spearman(droppedAgs.map(d => d.agsAblated), droppedAgs.map(d => d.row.flatProfit));
    const spearDrop = (baselineFullSpear != null && ablSpear != null) ? (Math.abs(baselineFullSpear) - Math.abs(ablSpear)) : null;
    // 2. Cohort-matched lift (top-K by ablated AGS, K = baseline lock-floor N)
    const sortedByAbl = [...droppedAgs].sort((a, b) => b.agsAblated - a.agsAblated);
    const topK = sortedByAbl.slice(0, lockK).map(d => d.row);
    const topKStat = sumStat(topK);
    const matchedLiftLoss = (baselineLock.roi != null && topKStat.roi != null) ? (baselineLock.roi - topKStat.roi) * 100 : null;
    // 3. Same-threshold (informational only)
    const sameThrArr = droppedAgs.filter(d => d.agsAblated >= AGS_LOCK_FLOOR).map(d => d.row);
    const sameThrStat = sumStat(sameThrArr);
    ablationRows.push({
      key: f.key, ablSpear, spearDrop,
      topKStat, matchedLiftLoss,
      sameThrStat,
    });
    const ablRoStr = ablSpear != null ? `${ablSpear >= 0 ? '+' : ''}${ablSpear.toFixed(3)}` : '—';
    const dropStr = spearDrop != null ? `${spearDrop >= 0 ? '−' : '+'}${Math.abs(spearDrop).toFixed(3)}` : '—';
    const topKCell = topKStat.n ? `WR=${(topKStat.wr*100).toFixed(0)}%, ROI=${sign(topKStat.roi*100, 1)}%` : '—';
    const liftStr = matchedLiftLoss != null ? `${sign(matchedLiftLoss, 1)}pp` : '—';
    const stCell = sameThrStat.n ? `N=${sameThrStat.n}, WR=${(sameThrStat.wr*100).toFixed(0)}%, ROI=${sign(sameThrStat.roi*100, 1)}%` : '—';
    out.push(`| \`${f.key}\` | ${ablRoStr} | ${dropStr} | ${topKCell} | ${liftStr} | ${stCell} |`);
  }
  out.push('');
  out.push('_Reading the **ρ drop** column: positive (`−0.0XX`) = dropping this feature **reduced** the AGS\'s ability to rank-order picks → the feature was carrying marginal info. Reading the **matched-cohort lift loss**: positive `+X pp` = the top-K of the 5-feature AGS earned LESS ROI than baseline → the feature was contributing positive lift._');
  out.push('');
  out.push('#### §AGS-6 recap — features ranked by marginal info (Spearman ρ drop)');
  out.push('');
  out.push('| Rank | Feature | ρ drop when removed | Matched-cohort lift loss | Verdict |');
  out.push('|---|---|---|---|---|');
  const ablSorted = [...ablationRows].sort((a, b) => (b.spearDrop || 0) - (a.spearDrop || 0));
  ablSorted.forEach((r, i) => {
    const verdict = (r.spearDrop || 0) > 0.02 ? 'carries marginal info' : (r.spearDrop || 0) > 0 ? 'mild marginal info' : 'redundant — other features cover it';
    const dropStr = r.spearDrop != null ? `${r.spearDrop >= 0 ? '−' : '+'}${Math.abs(r.spearDrop).toFixed(3)}` : '—';
    out.push(`| ${i + 1} | \`${r.key}\` | ${dropStr} | ${r.matchedLiftLoss != null ? sign(r.matchedLiftLoss, 1)+'pp' : '—'} | ${verdict} |`);
  });

  // ── §AGS-7. Multivariate logistic on z-scored features ─────────────────
  out.push('');
  out.push('### §AGS-7. Multivariate logistic regression on the 6 z-scored features');
  out.push('');
  out.push('Fit `logit(P(WIN)) = α + Σ βᵢ · zᵢ` on the AGS sample. Standardized inputs ⇒ |β| is a fair cross-feature importance signal. AGS itself uses **equal sign-weighted** sums (β=+1 for every feature); a fitted β much larger or smaller than 1 indicates the equal-weight assumption may be off for that input.');
  out.push('');
  // Build design matrix [n, 6] and y vector.
  const X = agsRows.map(r => AGS_FEATURES.map(f => Number(r.agsResultPit?.components?.[f.key] ?? 0)));
  const y = agsRows.map(r => r.outcome === 'WIN' ? 1 : 0);
  const lr = logisticRegression(X, y, { lr: 0.05, iters: 4000, l2: 0.05 });
  // Compute final log-loss on the training set so the reader can sanity-check fit.
  const sigmoid = z => 1 / (1 + Math.exp(-Math.max(-30, Math.min(30, z))));
  const eps = 1e-9;
  let logLoss = 0;
  for (let i = 0; i < X.length; i++) {
    let z = lr.b;
    for (let j = 0; j < lr.w.length; j++) z += lr.w[j] * X[i][j];
    const p = sigmoid(z);
    logLoss += -(y[i] * Math.log(p + eps) + (1 - y[i]) * Math.log(1 - p + eps));
  }
  logLoss /= Math.max(1, X.length);
  // Sort betas by |β|.
  const lrRows = AGS_FEATURES.map((f, i) => ({
    key: f.key, family: f.family, beta: lr.w[i] ?? 0,
  })).sort((a, b) => Math.abs(b.beta) - Math.abs(a.beta));
  out.push('| Rank | Feature | Family | β (z-input) | |β| | Direction |');
  out.push('|---|---|---|---|---|---|');
  lrRows.forEach((r, i) => {
    const dir = r.beta > 0.05 ? 'positive ↑' : r.beta < -0.05 ? 'negative ↓' : 'flat ≈ 0';
    out.push(`| ${i + 1} | \`${r.key}\` | ${r.family} | ${sign(r.beta, 3)} | ${Math.abs(r.beta).toFixed(3)} | ${dir} |`);
  });
  out.push('');
  out.push(`Intercept b = ${sign(lr.b, 3)} · Final log-loss = ${logLoss.toFixed(4)} · N = ${agsRows.length}.`);

  // ── §AGS-8. Final ranked verdict ───────────────────────────────────────
  // Combine all four importance lenses into one composite ranking. Each
  // lens contributes a 1..6 rank (1 = most important); the composite is
  // their average (lower = more important across lenses).
  out.push('');
  out.push('### §AGS-8. Final ranked verdict — composite importance across all four lenses');
  out.push('');
  out.push('Each feature gets a 1..6 rank in each lens (1 = most important). The **composite rank** is the average — lower is better. A feature that ranks low across all four lenses is a clear candidate to drop or down-weight; a feature that ranks high across all four is the engine\'s real workhorse.');
  out.push('');
  // Build per-lens rankings.
  const rankBy = (arr, scoreFn) => {
    const sorted = [...arr].sort((a, b) => scoreFn(b) - scoreFn(a));
    const map = new Map();
    sorted.forEach((r, i) => map.set(r.key, i + 1));
    return map;
  };
  const uniRank   = rankBy(featureSummaries, f => Math.abs(f.sRoi || 0));
  const moveRank  = rankBy(featureSummaries, f => f.meanAbsZ);
  const ablRank   = rankBy(ablationRows,     r => r.spearDrop || 0);
  const lrRank    = rankBy(lrRows,           r => Math.abs(r.beta));
  const composite = AGS_FEATURES.map(f => {
    const u = uniRank.get(f.key);
    const m = moveRank.get(f.key);
    const a = ablRank.get(f.key);
    const l = lrRank.get(f.key);
    const avg = (u + m + a + l) / 4;
    return { key: f.key, family: f.family, u, m, a, l, avg };
  }).sort((x, y) => x.avg - y.avg);
  out.push('| Composite rank | Feature | Family | Univariate (§AGS-3) | Score-mover (§AGS-4) | Drop-one (§AGS-6) | Logistic (§AGS-7) | Avg rank |');
  out.push('|---|---|---|---|---|---|---|---|');
  composite.forEach((f, i) => {
    out.push(`| ${i + 1} | \`${f.key}\` | ${f.family} | #${f.u} | #${f.m} | #${f.a} | #${f.l} | ${f.avg.toFixed(2)} |`);
  });

  // Plain-English conclusion.
  out.push('');
  out.push('#### Plain-English summary');
  out.push('');
  const top = composite[0];
  const bot = composite[composite.length - 1];
  const corrPairs = [];
  for (let i = 0; i < featureCols.length; i++) {
    for (let j = i + 1; j < featureCols.length; j++) {
      const r = pearson(featureZArrs[featureCols[i]], featureZArrs[featureCols[j]]);
      if (Math.abs(r) >= 0.7) corrPairs.push(`\`${featureCols[i]}\` ↔ \`${featureCols[j]}\` (r=${sign(r,2)})`);
    }
  }
  out.push(`- **Workhorse**: \`${top.key}\` (${top.family}) — ranks #${top.u}/#${top.m}/#${top.a}/#${top.l} across the four lenses. Whatever else changes, this one stays.`);
  out.push(`- **Weakest contributor**: \`${bot.key}\` (${bot.family}) — composite avg rank ${bot.avg.toFixed(2)}. Strong candidate to down-weight or drop in v9.`);
  if (corrPairs.length) {
    out.push(`- **Redundant pairs (|r| ≥ 0.7)**: ${corrPairs.join('; ')}. Each pair effectively double-counts the same signal in the composite.`);
  } else {
    out.push('- **No redundant pairs (|r| ≥ 0.7)** — every input carries some independent variance. The current 6-feature composite is well-orthogonalized.');
  }
  const silent = contribRows.filter(f => f.meanAbsZ < 0.2);
  if (silent.length) {
    out.push(`- **Silent inputs (mean |z| < 0.2)**: ${silent.map(f => `\`${f.key}\``).join(', ')}. These barely move the AGS score in practice — calibration is washing them out.`);
  }
  // v9 simplification suggestion — based on redundancy + univariate strength
  const carriesInfo = ablationRows.filter(r => (r.spearDrop || 0) > 0.01).map(r => r.key);
  if (carriesInfo.length && carriesInfo.length <= 3) {
    out.push(`- **v9 simplification candidate**: only \`${carriesInfo.join('`, `')}\` ${carriesInfo.length === 1 ? 'carries' : 'carry'} marginal info (Spearman ρ drop > 0.01 when removed). The other ${6 - carriesInfo.length} features add roughly nothing on top — a 2- or 3-feature composite would likely match the 6-feature AGS\'s discriminative power. **Don't remove them yet** — at N=${agsRows.length} we lack the power to distinguish "redundant in this sample" from "redundant in the population." Revisit once the sample doubles.`);
  }
  out.push(`- **In-sample calibration source**: \`${calSrc}\` (used as cold-start fallback for the first ${meta.pitColdStartN} of ${meta.pitAgsCovered} PIT rows where prior history was thin). ${calSrc === 'fallback' ? '⚠ The cron-refreshed Firestore calibration is not available — values are from the last hardcoded snapshot. Re-running `scripts/computeAgsCalibration.js` will refresh.' : 'Live calibration is loaded; the means/SDs above are this morning\'s.'}`);
  out.push(`- **Look-ahead controls**: PIT proven gate (strict-prior-events tier lens) + walk-forward feature calibration (mean/SD per feature recomputed at each pick date from prior picks only, ${meta.pitColdStartN}/${meta.pitAgsCovered} cold-started). Production thresholds (+5/+3/-1) were tuned on overlapping data and are still treated as fixed constants here — the §AGS-0a leakage audit shows the true lift those thresholds deliver out-of-sample.`);
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

  // Δq dropped per directive ("q margin doesn't matter and we only use proven
  // winners now"). HC margin and the new proven-wallet per-side aggregates
  // are added — they're the variables that should actually drive sizing.
  // Restricted to post-cutover universe so HC has a value for every row.
  const features = [
    { name: 'Δw',              get: p => p.dwFrozen ?? 0 },
    { name: 'HC margin',       get: p => p.hcMargin ?? 0 },
    { name: 'Δw + HC',         get: p => (p.dwFrozen ?? 0) + (p.hcMargin ?? 0) },
    { name: 'peak.stars',      get: p => p.peakStars ?? 0 },
    { name: 'vault.star',      get: p => p.vaultStar ?? 0 },
    { name: 'evEdge',          get: p => p.evEdge ?? 0 },
    { name: 'moneyPct',        get: p => p.moneyPct ?? 0 },
    { name: 'walletPct',       get: p => p.walletPct ?? 0 },
    { name: 'sharpCount',      get: p => p.sharpCount ?? 0 },
    { name: 'log10(invested)', get: p => Math.log10(Math.max(1, p.totalInvested ?? 1)) },
    { name: 'criteriaMet',     get: p => p.criteriaMet ?? 0 },
    // Proven-wallet per-side characteristics (new §4 features).
    { name: 'pw.Δcount',       get: p => p.provenAgg?.dCount ?? 0 },
    { name: 'pw.ΔWlNet',       get: p => p.provenAgg?.dWlNet ?? 0 },
    { name: 'pw.ΔFlatPnl',     get: p => p.provenAgg?.dFlatPnl ?? 0 },
    { name: 'pw.ΔAvgRoi',      get: p => p.provenAgg?.dAvgRoi ?? 0 },
    { name: 'pw.ΔTopQShare',   get: p => p.provenAgg?.dTopQShare ?? 0 },
    { name: 'odds (American)', get: p => p.odds ?? 0 },
    { name: 'log(impliedProb)', get: p => Math.log(Math.max(0.01, p.impliedProb || 0.5)) },
  ];

  // Restrict to HC-era picks (so HC margin is a real value, not 0-fill).
  picks = picksHcEra(picks);

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

  // Cohort definitions match the v7.4 lock-floor anatomy. HC-driven cohorts
  // (Tier-1) are scoped to post-cutover; Δw-driven cohorts (Tier-2 / stale)
  // use the full sample. Δq dropped per directive.
  const cohorts = [
    { id: 't1hc2', label: 'Tier-1a HC ≥ +2 (post-cutover)',         f: p => p.hcMargin != null && p.hcMargin >= 2 },
    { id: 't1hc1', label: 'Tier-1b HC = +1 (post-cutover)',         f: p => p.hcMargin === 1 },
    { id: 't2',    label: 'Tier-2 HC ≤ 0 ∧ Δw ≥ +2 (HC era)',      f: p =>
        p.date && p.date >= HC_CUTOVER && (p.hcMargin == null || p.hcMargin <= 0) && p.dwFrozen >= 2 },
    { id: 'p1',    label: 'Δw ≥ +3 (full sample)',                  f: p => p.dwFrozen != null && p.dwFrozen >= 3 },
    { id: 'sw0',   label: 'Stale Δw = 0',                            f: p => p.dwFrozen === 0 },
    { id: 'sw1',   label: 'Stale Δw ≤ −1',                          f: p => p.dwFrozen != null && p.dwFrozen <= -1 },
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
  out.push('| Date | Sport | Mkt | Side | ★ | u | Odds | Δw | HC | Δw+HC | pw.Δcnt | pw.ΔWl | EV | Outcome | Peak PnL |');
  out.push('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
  const sorted = [...picks].sort((a, b) => (a.date || '').localeCompare(b.date || '') || (a.docId || '').localeCompare(b.docId || ''));
  for (const p of sorted) {
    const oddsStr = p.odds == null ? '—' : (p.odds >= 0 ? '+' : '') + p.odds;
    const dw = p.dwFrozen ?? '—';
    const hc = p.hcMargin ?? '—';
    const sum = (Number.isFinite(p.dwFrozen) && Number.isFinite(p.hcMargin))
      ? (p.dwFrozen + p.hcMargin) : '—';
    const pwDcnt = p.provenAgg ? p.provenAgg.dCount : '—';
    const pwDwl  = p.provenAgg ? p.provenAgg.dWlNet : '—';
    const ev = p.evEdge != null ? p.evEdge.toFixed(2) : '—';
    const outcome = p.outcome === 'WIN' ? 'W' : p.outcome === 'LOSS' ? 'L' : 'P';
    out.push(`| ${p.date} | ${p.sport} | ${p.market} | ${p.sideKey} | ${p.peakStars.toFixed(1)} | ${(p.peakUnits || 0).toFixed(2)} | ${oddsStr} | ${dw} | ${hc} | ${sum} | ${pwDcnt} | ${pwDwl} | ${ev} | ${outcome} | ${sign(p.profitU)}u |`);
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

  // Cohort scan — what's working, what's bleeding. v7.4 cohorts driven by
  // HC margin and Δw (Δq dropped — proven-wallet filter renders it
  // double-counting). Two hard tiers, plus a "no-ship" mute lens.
  // HC-cohorts are scoped to post-HC_CUTOVER picks; Δw-only cohorts use the
  // full sample.
  const cohorts = [
    { id: 't1hc2', label: 'Tier-1a HC ≥ +2 (post-cutover)', f: p => p.hcMargin != null && p.hcMargin >= 2 },
    { id: 't1hc1', label: 'Tier-1b HC = +1 (post-cutover)', f: p => p.hcMargin === 1 },
    { id: 't2',    label: 'Tier-2 HC ≤ 0 ∧ Δw ≥ +2 (HC era)', f: p =>
        p.date && p.date >= HC_CUTOVER && (p.hcMargin == null || p.hcMargin <= 0) && p.dwFrozen >= 2 },
    { id: 'p1',    label: 'Δw ≥ +3 (full sample)',          f: p => p.dwFrozen != null && p.dwFrozen >= 3 },
    { id: 'sw',    label: 'Stale Δw ≤ 0 (full sample)',     f: p => p.dwFrozen != null && p.dwFrozen <= 0 },
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

  // HC margin signal (post-cutover only) — companion to Δw at the headline level.
  const hcSig = (() => {
    const xs = picks.filter(p => p.hcMargin != null);
    if (!xs.length) return { rho: null, sig: '—', n: 0 };
    const r = pearsonSig(xs.map(p => p.hcMargin), xs.map(p => p.flatProfit));
    return { ...r, n: xs.length };
  })();
  const dwHcSig = (() => {
    const xs = picks.filter(p => p.hcMargin != null && p.dwFrozen != null);
    if (!xs.length) return { rho: null, sig: '—', n: 0 };
    const r = pearsonSig(xs.map(p => p.dwHcSum), xs.map(p => p.flatProfit));
    return { ...r, n: xs.length };
  })();

  const lines = [];
  lines.push('## Executive summary');
  lines.push('');
  lines.push(`**Sample:** ${total.n} shipped+graded picks · ${meta.dateMin} → ${meta.dateMax}  (HC analyses scoped to post-cutover ${HC_CUTOVER}, ${hcSig.n} picks)`);
  lines.push(`**Headline:** ${total.w}-${total.l}-${picks.filter(p => p.outcome === 'PUSH').length} · WR ${fmtPct(100 * total.wr)} [${fmtPct(100 * total.wilsonCi[0], 1)}–${fmtPct(100 * total.wilsonCi[1], 1)}] vs 52.4% break-even · ${sign(total.fl)}u flat (${fmtSignPct(100 * total.flatRoi)}) · ${sign(total.pu)}u peak.`);
  lines.push(`**Overall t-test:** t = ${total.flatTtest.t.toFixed(2)} → ${total.flatTtest.sig}.`);
  lines.push('');
  lines.push(`**Verdict:** ${overallVerdict}.`);
  lines.push('');
  lines.push('### Where IS the edge?');
  lines.push('');
  lines.push(`The two real engine-signals are **Δw** (proven-roster directional consensus) and **HC** (high-conviction-wallet margin, post-cutover). Univariate correlations:`);
  lines.push('');
  lines.push(`- **ρ(Δw, flat ROI) = ${allDwSig.rho?.toFixed(3) ?? '—'} ${allDwSig.sig}**  (full sample, N=${picks.filter(p => p.dwFrozen != null).length})`);
  lines.push(`- **ρ(HC, flat ROI) = ${hcSig.rho?.toFixed(3) ?? '—'} ${hcSig.sig}**  (post-cutover, N=${hcSig.n})`);
  lines.push(`- **ρ(Δw+HC, flat ROI) = ${dwHcSig.rho?.toFixed(3) ?? '—'} ${dwHcSig.sig}**  (post-cutover, N=${dwHcSig.n})`);
  lines.push('');
  lines.push(`Cohort breakdown:`);
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
  const actBayesKelly = (s, oddsLabel = '−110') => {
    const bayes = bayesianWR(s.w, s.l);
    const hk = halfKelly(bayes, -110);
    return `Bayesian posterior WR ≈ ${fmtPct(100 * bayes)}, half-Kelly = **${(100 * hk).toFixed(1)}%** bankroll at ${oddsLabel}`;
  };
  if (summaries.t1hc2) lines.push(`- **Tier-1a (HC ≥ +2)** — N=${summaries.t1hc2.s.n}, WR ${fmtPct(100 * summaries.t1hc2.s.wr)}, flat ROI ${fmtSignPct(100 * summaries.t1hc2.s.flatRoi)}. ${actBayesKelly(summaries.t1hc2.s)} → **size aggressively**.`);
  if (summaries.t1hc1) lines.push(`- **Tier-1b (HC = +1)** — N=${summaries.t1hc1.s.n}, WR ${fmtPct(100 * summaries.t1hc1.s.wr)}, flat ROI ${fmtSignPct(100 * summaries.t1hc1.s.flatRoi)}. ${actBayesKelly(summaries.t1hc1.s)}.`);
  if (summaries.t2)    lines.push(`- **Tier-2 (HC ≤ 0 ∧ Δw ≥ +2, HC era)** — N=${summaries.t2.s.n}, WR ${fmtPct(100 * summaries.t2.s.wr)}, flat ROI ${fmtSignPct(100 * summaries.t2.s.flatRoi)}. Δw saves the pick when HC is silent.`);
  if (summaries.p1)    lines.push(`- **Δw ≥ +3 (full sample)** — N=${summaries.p1.s.n}, WR ${fmtPct(100 * summaries.p1.s.wr)}, flat ROI ${fmtSignPct(100 * summaries.p1.s.flatRoi)}. ${actBayesKelly(summaries.p1.s)}.`);
  if (summaries.sw)    lines.push(`- **Stale Δw ≤ 0 (full sample)** — ${fmtSignPct(100 * summaries.sw.s.flatRoi)} flat ROI on ${summaries.sw.s.n} picks. Already muted by v7.x; should not re-appear.`);
  lines.push(`- **Sample size:** at observed σ (${total.flatTtest.sd.toFixed(2)}u/pick), we need **~${Math.ceil((1.96 * total.flatTtest.sd / 0.05) ** 2)} graded picks** to validate a true +5% flat ROI at 95% confidence. We have ${total.n}. Cohort findings — especially HC subsets — are provisional until N grows.`);
  return lines.join('\n');
}

// ── Main ──────────────────────────────────────────────────────────────────
async function main() {
  console.log('[v6FullAnalysis] loading wallet profiles…');
  const { profiles, provenRanksBySport } = await loadWalletProfiles();
  const provenSummary = [...provenRanksBySport.entries()]
    .map(([sport, m]) => `${sport}=${m.size}`).join(' · ');
  console.log(`[v6FullAnalysis] ${profiles.size} wallet profiles · proven roster: ${provenSummary}`);

  console.log('[v6FullAnalysis] loading picks…');
  const { rows, walletBets, meta } = await loadPicks(provenRanksBySport);
  console.log(`[v6FullAnalysis] N=${rows.length} shipped+graded picks (${meta.dateMin} → ${meta.dateMax}), ${walletBets.length} wallet-bet events for PIT lens`);

  console.log('[v6FullAnalysis] loading Source-B positions for PIT tier lens…');
  const positionRows = await loadPositionRows();
  console.log(`[v6FullAnalysis] ${positionRows.length} graded position rows`);

  console.log('[v6FullAnalysis] building point-in-time tier lens (strict prior)…');
  const lens = buildPitTierLens(walletBets, positionRows, profiles, { strict: true });

  console.log('[v6FullAnalysis] loading AGS calibration (current snapshot, used as in-sample baseline)…');
  const agsCalibration = await loadAgsCalibration();
  const calSrc = agsCalibration.source || (agsCalibration === AGS_FALLBACK_CALIBRATION ? 'fallback' : 'firestore');
  console.log(`[v6FullAnalysis] AGS calibration: source=${calSrc}, sampleSize=${agsCalibration.sampleSize ?? 'n/a'}`);

  // ── In-sample AGS pass (today's tier + today's calibration) ──────────
  // Kept so the §AGS leakage-audit subsection can show how much the
  // numbers move when we strip out look-ahead.
  let agsCovered = 0;
  for (const r of rows) {
    if (!r.agsAggRaw) continue;
    const res = computeAgs(r.agsAggRaw, agsCalibration);
    if (!res || !Number.isFinite(res.ags)) continue;
    r.agsResult = res;
    agsCovered += 1;
  }
  console.log(`[v6FullAnalysis] in-sample AGS computable on ${agsCovered}/${rows.length} rows`);

  // ── PIT pass — re-aggregate every pick under the PIT proven gate ─────
  // Same `aggregateSideProven` formula, but the `isProven` callback
  // checks tier-as-of the pick's date (strictly prior events only).
  const pitProvenFn = (walletShort, sport, date) => lens.isProvenAsOf(walletShort, sport, date);
  let pitAggCovered = 0;
  for (const r of rows) {
    if (!Array.isArray(r.walletDetails) || !r.walletDetails.length) continue;
    const agg = aggregateSideProven(r.walletDetails, r.sideKey, r.sport,
      (w, s) => pitProvenFn(w, s, r.date));
    if (!agg || (agg.forCount + agg.agCount) === 0) continue;
    r.agsAggRawPit = agg;
    pitAggCovered += 1;
  }
  console.log(`[v6FullAnalysis] PIT-proven aggregate computable on ${pitAggCovered}/${rows.length} rows`);

  // ── Walk-forward calibration ─────────────────────────────────────────
  // For each pick (in date order), build a calibration {mean, sd} per
  // feature using ONLY rows strictly before this row's date that have a
  // valid PIT aggregate. Cold-start (prior N < WALK_MIN) uses the live
  // Firestore calibration as a stand-in. The PIT AGS for each row is
  // then computed against THAT row's prior-only calibration.
  const WALK_MIN = 30;
  const sortedRows = [...rows].filter(r => r.agsAggRawPit).sort((a, b) =>
    (a.date || '').localeCompare(b.date || ''));
  // Pre-compute per-feature prefix sums for fast walk-forward (sorted by date).
  // For each (date, feature), we need mean+sd of rows with date < D.
  // Simpler approach: at each row index i, the prior universe is rows[0..i-1].
  // We compute mean/sd lazily per row to keep code short; N≈140 → 140 × 6 ops.
  let pitAgsCovered = 0;
  let coldStartN = 0;
  for (let i = 0; i < sortedRows.length; i++) {
    const row = sortedRows[i];
    const priorRows = [];
    for (let j = 0; j < i; j++) {
      const pj = sortedRows[j];
      if (pj.date < row.date) priorRows.push(pj);
    }
    let calForRow;
    if (priorRows.length < WALK_MIN) {
      calForRow = agsCalibration;
      coldStartN += 1;
    } else {
      const normalizers = {};
      for (const f of AGS_FEATURES) {
        const vals = priorRows.map(p => Number(p.agsAggRawPit?.[f.key] ?? 0));
        const mean = vals.reduce((s, v) => s + v, 0) / vals.length;
        const variance = vals.reduce((s, v) => s + (v - mean) ** 2, 0) / Math.max(1, vals.length - 1);
        const sd = Math.sqrt(variance) || 1;
        normalizers[f.key] = { mean, sd };
      }
      calForRow = { normalizers, source: 'walk-forward', sampleSize: priorRows.length };
    }
    const res = computeAgs(row.agsAggRawPit, calForRow);
    if (res && Number.isFinite(res.ags)) {
      row.agsResultPit = res;
      row.agsCalSourceUsed = calForRow.source;
      row.agsCalSampleUsed = calForRow.sampleSize ?? null;
      pitAgsCovered += 1;
    }
  }
  console.log(`[v6FullAnalysis] PIT walk-forward AGS computed on ${pitAgsCovered}/${sortedRows.length} rows (${coldStartN} used cold-start fallback calibration)`);

  meta.agsCalibration = agsCalibration;
  meta.agsCovered = agsCovered;
  meta.pitAggCovered = pitAggCovered;
  meta.pitAgsCovered = pitAgsCovered;
  meta.pitColdStartN = coldStartN;
  meta.pitWalkMin = WALK_MIN;

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
  buildSectionAgs(out, rows, meta);
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
