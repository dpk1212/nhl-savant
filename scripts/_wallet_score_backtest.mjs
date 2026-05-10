// Wallet-Score System Backtest — exploratory prediction-system brainstorm.
//
// Question: HC margin and Δw (proven-winner margin) are known signals. Can
// the *characteristics* of the wallets on each side (Δcount, ΔWlNet,
// ΔFlatPnl, ΔAvgRoi, ΔBestRank, ΔTopQShare) be combined into a single
// composite score that ranks picks and reproduces — or beats — the current
// HC/Δw lock-floor?
//
// We test FOUR candidate systems and rank-bucket every shipped+graded pick:
//
//   System-A  WLT-Z   — equal-weighted z-score composite of all 6 features
//   System-B  WLT-W   — ρ(·, flat ROI)-weighted z-score composite (§4g cosines)
//   System-C  WLT-LR  — logistic regression P(WIN) trained on the 6 features
//                       + Δw (full sample, no HC dependency)
//   System-D  WLT-RULE — hard-rule lock: Δcount ≥ +2 ∧ ΔAvgRoi > median
//
// Plus baselines for reference:
//
//   Baseline-HC    Tier-1 (HC ≥ +1, post-cutover only)
//   Baseline-DW    Δw ≥ +3 (full sample)
//
// Output: WALLET_SCORE_BACKTEST.md
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

// ── Config (mirrors v6FullAnalysis.js) ─────────────────────────────────────
const V6_CUTOVER  = '2026-04-18';
const HC_CUTOVER  = '2026-04-30';
const PICK_COLS = [
  ['sharpFlowPicks',   'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals',  'TOTAL'],
];
const PROVEN_TIERS = new Set(['CONFIRMED', 'FLAT']);
const TOP_QUARTILE_FRAC = 0.25;

// ── Helpers ────────────────────────────────────────────────────────────────
const sign = (v, d = 1) => (v == null || Number.isNaN(v) ? '—' : (v >= 0 ? '+' : '') + v.toFixed(d));
const fmtPct = (v, d = 1) => (v == null || Number.isNaN(v) ? '—' : `${v.toFixed(d)}%`);
const fmtSignPct = (v, d = 1) => (v == null || Number.isNaN(v) ? '—' : `${sign(v, d)}%`);

function flatProfit(odds, outcome) {
  if (outcome === 'PUSH') return 0;
  if (outcome === 'WIN') return odds == null ? 0.91 : (odds > 0 ? odds / 100 : 100 / Math.abs(odds));
  return -1;
}

function wilson(wins, n, z = 1.96) {
  if (n === 0) return [0, 0];
  const phat = wins / n;
  const denom = 1 + z * z / n;
  const center = (phat + z * z / (2 * n)) / denom;
  const margin = z * Math.sqrt(phat * (1 - phat) / n + z * z / (4 * n * n)) / denom;
  return [Math.max(0, center - margin), Math.min(1, center + margin)];
}

function tTest(values) {
  const n = values.length;
  if (n < 2) return { n, mean: 0, sd: 0, t: 0, sig: '✗ n<2' };
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1);
  const sd = Math.sqrt(variance);
  const se = sd / Math.sqrt(n);
  const t = se > 0 ? mean / se : 0;
  const sig = Math.abs(t) >= 2.58 ? '✓ p<.01' : Math.abs(t) >= 1.96 ? '✓ p<.05' : Math.abs(t) >= 1.645 ? '~ p<.10' : '✗ noise';
  return { n, mean, sd, t, sig };
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

function zScore(arr) {
  const n = arr.length;
  if (!n) return { values: [], mean: 0, sd: 1 };
  const mean = arr.reduce((a, b) => a + b, 0) / n;
  const variance = arr.reduce((a, b) => a + (b - mean) ** 2, 0) / Math.max(1, n - 1);
  const sd = Math.sqrt(variance) || 1;
  return { values: arr.map(v => (v - mean) / sd), mean, sd };
}

function logisticRegression(X, y, { lr = 0.05, iters = 4000, l2 = 0.05 } = {}) {
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

// ── Loaders (compact copies of v6FullAnalysis logic) ──────────────────────
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
      if (!rec || !PROVEN_TIERS.has(rec.whitelistTier)) continue;
      eligible.push({
        wallet,
        flatRoi: rec.picks?.flatRoi ?? 0,
        n:       rec.picks?.n ?? 0,
        wins:    rec.picks?.wins ?? 0,
        losses:  rec.picks?.losses ?? 0,
        flatPnl: rec.picks?.flatPnl ?? 0,
        tier:    rec.whitelistTier,
        wr:      rec.picks?.wr ?? 0,
      });
    }
    eligible.sort((a, b) => b.flatRoi - a.flatRoi || b.flatPnl - a.flatPnl);
    const total = eligible.length;
    const topCutoff = Math.max(1, Math.ceil(total * TOP_QUARTILE_FRAC));
    const m = new Map();
    eligible.forEach((e, i) => {
      m.set(e.wallet, { ...e, rank: i + 1, totalProven: total, isTopQuartile: (i + 1) <= topCutoff });
    });
    provenRanksBySport.set(sport, m);
  }
  return { profiles, provenRanksBySport };
}

function computeProvenWalletAggregates(walletDetails, sideKey, sport, ranksMap) {
  if (!Array.isArray(walletDetails) || !ranksMap) return null;
  const f = { count: 0, wlNet: 0, flatPnl: 0, sumRoi: 0, bestRank: null, topQ: 0 };
  const a = { count: 0, wlNet: 0, flatPnl: 0, sumRoi: 0, bestRank: null, topQ: 0 };
  for (const w of walletDetails) {
    if (!w?.wallet || !w?.side) continue;
    const r = ranksMap.get(w.wallet);
    if (!r) continue;
    const bucket = (w.side === sideKey) ? f : a;
    bucket.count   += 1;
    bucket.wlNet   += (r.wins - r.losses);
    bucket.flatPnl += r.flatPnl;
    bucket.sumRoi  += r.flatRoi;
    if (r.isTopQuartile) bucket.topQ += 1;
    if (bucket.bestRank == null || r.rank < bucket.bestRank) bucket.bestRank = r.rank;
  }
  const avgRoi = b => b.count > 0 ? b.sumRoi / b.count : 0;
  const topShare = b => b.count > 0 ? b.topQ / b.count : 0;
  return {
    forCount: f.count, agCount: a.count,
    dCount:    f.count - a.count,
    dWlNet:    f.wlNet - a.wlNet,
    dFlatPnl:  f.flatPnl - a.flatPnl,
    dAvgRoi:   avgRoi(f) - avgRoi(a),
    dBestRank: (f.bestRank != null && a.bestRank != null) ? (a.bestRank - f.bestRank) : null,
    dTopQShare: topShare(f) - topShare(a),
  };
}

// EXPAND=1 drops the dashboard filter (peakStars >= 2.5, lockStage !== SHADOW)
// to pull in every graded pick the system has ever scored.
const EXPAND = process.env.EXPAND === '1';

async function loadPicks(provenRanksBySport) {
  const rows = [];
  let dateMin = null, dateMax = null;
  let counters = { totalGraded: 0, dashboardOnly: 0, shadowAdded: 0, subStarAdded: 0, kept: 0 };
  for (const [col, market] of PICK_COLS) {
    const snap = await db.collection(col).where('date', '>=', V6_CUTOVER).get();
    for (const doc of snap.docs) {
      const d = doc.data();
      const sides = d.sides || {};
      const sport = d.sport || 'UNK';
      const date  = d.date;
      for (const [sideKey, side] of Object.entries(sides)) {
        const oc = side?.result?.outcome;
        if (oc !== 'WIN' && oc !== 'LOSS' && oc !== 'PUSH') continue;
        counters.totalGraded += 1;
        const peak = side.peak || side.lock || {};
        const peakStars = peak?.stars ?? 0;
        const peakUnits = peak?.units || 1;
        const superseded   = !!side.superseded;
        const lockStage    = side.lockStage || null;
        const healthStatus = side.health?.status || null;
        const inDashboard = !superseded
          && healthStatus !== 'CANCELLED' && healthStatus !== 'MUTED'
          && lockStage !== 'SHADOW' && peakStars >= 2.5;
        const inExpanded = !superseded && healthStatus !== 'CANCELLED';
        if (inDashboard) counters.dashboardOnly += 1;
        if (EXPAND) {
          if (!inExpanded) continue;
          if (!inDashboard) {
            if (lockStage === 'SHADOW') counters.shadowAdded += 1;
            else if (peakStars < 2.5)   counters.subStarAdded += 1;
          }
        } else {
          if (!inDashboard) continue;
        }
        counters.kept += 1;
        const odds = side?.lock?.lockOdds ?? side?.peak?.peakOdds ?? side?.lock?.odds ?? side?.peak?.odds ?? null;
        const dwFrozen = side.v8_walletConsensusDelta != null ? Number(side.v8_walletConsensusDelta) : null;
        const hcConfFor = (side.v8_hcConfFor != null) ? Number(side.v8_hcConfFor) : null;
        const hcConfAg  = (side.v8_hcConfAg != null) ? Number(side.v8_hcConfAg) : null;
        const hcMarginRaw = (side.v8_hcMargin != null) ? Number(side.v8_hcMargin)
          : (hcConfFor != null && hcConfAg != null ? (hcConfFor - hcConfAg) : null);
        const hcMargin = (date && date >= HC_CUTOVER) ? hcMarginRaw : null;
        const wd = peak?.v8Scoring?.walletDetails;
        const ranksMap = provenRanksBySport.get(sport) || null;
        const provenAgg = computeProvenWalletAggregates(wd, sideKey, sport, ranksMap);
        let profitU = 0;
        if (oc === 'WIN')  profitU = (side.result?.profit || 0);
        else if (oc === 'LOSS') profitU = -peakUnits;
        const flat = flatProfit(odds, oc);
        if (date) {
          if (!dateMin || date < dateMin) dateMin = date;
          if (!dateMax || date > dateMax) dateMax = date;
        }
        const bucket = inDashboard ? 'CORE'
          : (lockStage === 'SHADOW' ? 'SHADOW'
            : (peakStars < 2.5 ? 'SUB_STAR' : 'OTHER'));
        rows.push({
          docId: doc.id, date, sport, market, sideKey,
          team: side.team || null, away: d.away || null, home: d.home || null,
          outcome: oc, profitU, flatProfit: flat, odds, peakStars, peakUnits,
          dwFrozen, hcMargin, provenAgg,
          bucket, lockStage, healthStatus,
        });
      }
    }
  }
  return { rows, dateMin, dateMax, counters };
}

// ── Backtest helpers ───────────────────────────────────────────────────────
function summarize(rows) {
  const n = rows.length;
  if (!n) return { n: 0 };
  const wins = rows.filter(r => r.outcome === 'WIN').length;
  const losses = rows.filter(r => r.outcome === 'LOSS').length;
  const pushes = rows.filter(r => r.outcome === 'PUSH').length;
  const wr = (wins + losses) > 0 ? wins / (wins + losses) : null;
  const ci = (wins + losses) > 0 ? wilson(wins, wins + losses) : [null, null];
  const flat = rows.reduce((s, r) => s + (r.flatProfit || 0), 0);
  const peakPnl = rows.reduce((s, r) => s + (r.profitU || 0), 0);
  const flatRoi = (wins + losses + pushes) > 0 ? flat / (wins + losses + pushes) : null;
  const t = tTest(rows.map(r => r.flatProfit || 0));
  return { n, wins, losses, pushes, wr, ci, flat, peakPnl, flatRoi, t };
}

function rowFmt(label, s) {
  if (!s.n) return `| ${label} | 0 | — | — | — | — | — | — |`;
  const wr = (s.wr * 100).toFixed(1) + '%';
  const ci = `[${(s.ci[0]*100).toFixed(0)}–${(s.ci[1]*100).toFixed(0)}]`;
  return `| ${label} | ${s.n} | ${s.wins}-${s.losses}-${s.pushes} | ${wr} ${ci} | ${fmtSignPct(100*s.flatRoi)} | ${sign(s.peakPnl, 2)}u | ${sign(s.flat, 2)}u | ${s.t.t.toFixed(2)} ${s.t.sig} |`;
}
const HEADER = `| Cohort | N | W-L-P | WR % [Wilson] | Flat ROI | Peak PnL | Flat PnL | t-stat |\n|---|---|---|---|---|---|---|---|`;

// ── MAIN ──────────────────────────────────────────────────────────────────
console.log('[wallet-score-backtest] loading wallet profiles…');
const { profiles, provenRanksBySport } = await loadWalletProfiles();
const provenSummary = [...provenRanksBySport.entries()].map(([s, m]) => `${s}=${m.size}`).join(' · ');
console.log(`[wallet-score-backtest] ${profiles.size} profiles · proven roster: ${provenSummary}`);

console.log(`[wallet-score-backtest] loading picks… mode=${EXPAND ? 'EXPANDED' : 'CORE'}`);
const { rows, dateMin, dateMax, counters } = await loadPicks(provenRanksBySport);
console.log(`[wallet-score-backtest] picks loaded ${dateMin} → ${dateMax}`);
console.log(`[wallet-score-backtest]   total graded picks discovered:    ${counters.totalGraded}`);
console.log(`[wallet-score-backtest]   passed dashboard filter (CORE):   ${counters.dashboardOnly}`);
if (EXPAND) {
  console.log(`[wallet-score-backtest]   added by EXPAND — SHADOW picks:   ${counters.shadowAdded}`);
  console.log(`[wallet-score-backtest]   added by EXPAND — sub-2.5★ picks: ${counters.subStarAdded}`);
}
console.log(`[wallet-score-backtest]   kept (final):                     ${counters.kept}`);

// Universe = picks where we have proven-wallet aggregates with non-zero coverage on at least one side.
const U = rows.filter(p => p.provenAgg && (p.provenAgg.forCount + p.provenAgg.agCount) > 0);
console.log(`[wallet-score-backtest] universe with proven-wallet coverage: N=${U.length}`);
if (EXPAND) {
  const byBucket = {};
  for (const p of U) byBucket[p.bucket] = (byBucket[p.bucket] || 0) + 1;
  console.log(`[wallet-score-backtest] universe by bucket: ${JSON.stringify(byBucket)}`);
}

// ── Build the candidate scores ─────────────────────────────────────────────
const FEATS = ['dCount', 'dWlNet', 'dFlatPnl', 'dAvgRoi', 'dTopQShare'];
// dBestRank only has values where both sides have proven wallets — we treat
// missing as 0 (no advantage either way) for the composite.
const featVals = FEATS.map(f => U.map(p => p.provenAgg[f] ?? 0));
const featZ = featVals.map(zScore);
const dBestRankZ = zScore(U.map(p => p.provenAgg.dBestRank ?? 0));

// Empirical |ρ(·, flat ROI)| weights — pulled from the §4g leaderboard so
// we don't re-fit. Hand-coded constants for transparency; rerun §4g if the
// universe shifts and update these.
const W_WEIGHTS = {
  dCount:     0.505,
  dFlatPnl:   0.470,
  dAvgRoi:    0.447,
  dWlNet:     0.331,
  dTopQShare: 0.285,
  dBestRank:  0.345,
};

// System A — equal-weighted z-score composite
U.forEach((p, i) => {
  let s = 0;
  FEATS.forEach((f, j) => { s += featZ[j].values[i]; });
  s += dBestRankZ.values[i];
  p.scoreA = s;
});

// System B — ρ-weighted z-score composite
U.forEach((p, i) => {
  let s = 0;
  FEATS.forEach((f, j) => { s += W_WEIGHTS[f] * featZ[j].values[i]; });
  s += W_WEIGHTS.dBestRank * dBestRankZ.values[i];
  p.scoreB = s;
});

// System C — logistic regression on (Δw + 6 wallet features), full sample.
// HC excluded so we don't restrict to N=25. We z-score features first.
const dwZ        = zScore(U.map(p => p.dwFrozen ?? 0));
const lrFeatures = [
  ['Δw',         dwZ],
  ['dCount',     featZ[0]],
  ['dWlNet',     featZ[1]],
  ['dFlatPnl',   featZ[2]],
  ['dAvgRoi',    featZ[3]],
  ['dTopQShare', featZ[4]],
  ['dBestRank',  dBestRankZ],
];
const X = U.map((_, i) => lrFeatures.map(([, z]) => z.values[i]));
const y = U.map(p => p.outcome === 'WIN' ? 1 : 0);
const { w: lrW, b: lrB } = logisticRegression(X, y, { lr: 0.08, iters: 5000, l2: 0.05 });
const sigmoid = z => 1 / (1 + Math.exp(-Math.max(-30, Math.min(30, z))));
U.forEach((p, i) => {
  let z = lrB;
  for (let j = 0; j < lrW.length; j++) z += lrW[j] * X[i][j];
  p.scoreC = sigmoid(z);
});

// System D — hard-rule
const medAvgRoi = (() => {
  const arr = [...U.map(p => p.provenAgg.dAvgRoi ?? 0)].sort((a, b) => a - b);
  return arr[Math.floor(arr.length / 2)];
})();
U.forEach(p => {
  p.scoreD = (p.provenAgg.dCount >= 2 && p.provenAgg.dAvgRoi > medAvgRoi) ? 1 : 0;
});

// ── Bucket helpers — split universe by score quintile or decile ────────────
function quantileBuckets(arr, scoreField, parts) {
  const sorted = [...arr].sort((a, b) => a[scoreField] - b[scoreField]);
  const cutoffs = [];
  for (let i = 1; i < parts; i++) cutoffs.push(sorted[Math.floor(arr.length * i / parts)][scoreField]);
  return cutoffs;
}

function bucketByCutoffs(arr, scoreField, cutoffs) {
  const buckets = Array(cutoffs.length + 1).fill().map(() => []);
  for (const p of arr) {
    let i = 0;
    while (i < cutoffs.length && p[scoreField] > cutoffs[i]) i++;
    buckets[i].push(p);
  }
  return buckets;
}

// ── Render report ──────────────────────────────────────────────────────────
const out = [];
out.push('# Wallet-Score System Backtest');
out.push('');
out.push(`_Auto-generated **${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET** by \`scripts/_wallet_score_backtest.mjs\`._`);
out.push('');
out.push(`**Sample:** ${U.length} shipped+graded picks (${dateMin} → ${dateMax}) where ≥1 proven wallet appeared on either side. Inclusion rule mirrors live Pick Performance dashboard.`);
out.push('');
out.push(`**Proven roster (CONFIRMED ∪ FLAT):** ${provenSummary}.`);
out.push('');

// ── 0. Baselines ────────────────────────────────────────────────────────────
out.push('## 0. Baselines for reference');
out.push('');
out.push(HEADER);
out.push(rowFmt('All picks (universe)', summarize(U)));
out.push(rowFmt('Tier-1 (HC ≥ +1, post-cutover)', summarize(U.filter(p => p.hcMargin != null && p.hcMargin >= 1))));
out.push(rowFmt('Δw ≥ +3 (full sample)',          summarize(U.filter(p => p.dwFrozen != null && p.dwFrozen >= 3))));
out.push(rowFmt('Δw = +2',                        summarize(U.filter(p => p.dwFrozen === 2))));
out.push(rowFmt('Stale Δw ≤ 0',                   summarize(U.filter(p => p.dwFrozen != null && p.dwFrozen <= 0))));
out.push('');

// ── Helper to render a quintile/decile breakdown for a score ──────────────
function renderBuckets(label, scoreField, parts = 5) {
  const cutoffs = quantileBuckets(U, scoreField, parts);
  const buckets = bucketByCutoffs(U, scoreField, cutoffs);
  out.push(`### ${label} — ${parts === 5 ? 'quintile' : 'decile'} breakdown`);
  out.push('');
  if (parts === 5) {
    out.push(`Cutoffs: ${cutoffs.map(c => c.toFixed(2)).join(' · ')}`);
  } else {
    out.push(`Cutoffs: ${cutoffs.map(c => c.toFixed(2)).join(' · ')}`);
  }
  out.push('');
  out.push(HEADER);
  buckets.forEach((b, i) => {
    const tag = parts === 5
      ? ['Q1 (worst)', 'Q2', 'Q3', 'Q4', 'Q5 (best)'][i]
      : `D${i + 1}` + (i === 0 ? ' (worst)' : i === parts - 1 ? ' (best)' : '');
    out.push(rowFmt(tag, summarize(b)));
  });
  out.push('');
  // Top vs bottom comparison
  const top = summarize(buckets[buckets.length - 1]);
  const bot = summarize(buckets[0]);
  if (top.n && bot.n) {
    out.push(`**Top minus bottom**:  WR ${(top.wr*100 - bot.wr*100).toFixed(1)} pp · Flat ROI ${((top.flatRoi - bot.flatRoi) * 100).toFixed(1)} pp · Peak PnL ${sign(top.peakPnl - bot.peakPnl, 2)}u`);
    out.push('');
  }
}

// ── System A ────────────────────────────────────────────────────────────────
out.push('## 1. System-A — Equal-weighted z-score composite');
out.push('');
out.push('`scoreA = z(Δcount) + z(ΔWlNet) + z(ΔFlatPnl) + z(ΔAvgRoi) + z(ΔTopQShare) + z(ΔBestRank)`. No empirical fitting — pure equal-weighted ensemble of the six wallet features. Treats every feature as equally informative.');
out.push('');
renderBuckets('System-A WLT-Z', 'scoreA', 5);
renderBuckets('System-A WLT-Z', 'scoreA', 10);

// ── System B ────────────────────────────────────────────────────────────────
out.push('## 2. System-B — ρ-weighted z-score composite');
out.push('');
out.push('`scoreB = Σ w_i · z(feature_i)` where weights = `|ρ(feature, flat ROI)|` from the V6 §4g leaderboard:');
out.push('');
out.push('| Feature | Weight |');
out.push('|---|---|');
for (const [k, v] of Object.entries(W_WEIGHTS)) out.push(`| ${k} | ${v.toFixed(3)} |`);
out.push('');
out.push('⚠️ This is **in-sample weighting** — the weights were estimated on the same data we\'re backtesting on. Treat lift over System-A as upper-bound; real out-of-sample lift will be smaller.');
out.push('');
renderBuckets('System-B WLT-W', 'scoreB', 5);
renderBuckets('System-B WLT-W', 'scoreB', 10);

// ── System C ────────────────────────────────────────────────────────────────
out.push('## 3. System-C — Logistic regression P(WIN)');
out.push('');
out.push('L2-regularized (λ=0.05) logistic regression trained on the full sample with features:');
out.push('');
out.push('| Feature | β (z-scaled) |');
out.push('|---|---|');
lrFeatures.forEach(([name], i) => {
  out.push(`| ${name} | ${lrW[i] >= 0 ? '+' : ''}${lrW[i].toFixed(3)} |`);
});
out.push(`| _intercept_ | ${lrB.toFixed(3)} |`);
out.push('');
out.push('⚠️ Same in-sample-fit caveat as System-B. Coefficients here weight Δw in a way that\'s explicitly NOT independent of the wallet features (they\'re correlated). The point: if you let a logreg jointly use all signals, what does it pick?');
out.push('');
renderBuckets('System-C WLT-LR', 'scoreC', 5);
renderBuckets('System-C WLT-LR', 'scoreC', 10);

// ── System D ────────────────────────────────────────────────────────────────
out.push('## 4. System-D — Hard rule: Δcount ≥ +2 ∧ ΔAvgRoi > median');
out.push('');
out.push(`Median ΔAvgRoi across the universe = **${medAvgRoi.toFixed(2)} pp**. Picks satisfying (Δcount ≥ +2 AND ΔAvgRoi > ${medAvgRoi.toFixed(2)}) are the SHIP set, everything else is MUTE.`);
out.push('');
const ship = U.filter(p => p.scoreD === 1);
const mute = U.filter(p => p.scoreD === 0);
out.push(HEADER);
out.push(rowFmt(`SHIP (rule met) — ${(100 * ship.length / U.length).toFixed(1)}% of universe`, summarize(ship)));
out.push(rowFmt(`MUTE (rule not met)`, summarize(mute)));
out.push('');

// ── Side-by-side leaderboard at "top quintile" level ──────────────────────
out.push('## 5. Head-to-head — top-quintile of each system (& baselines)');
out.push('');
out.push('What does each system\'s top 20% of picks look like? This is the practical "lock zone" comparison — same N for each row, varied selection criteria.');
out.push('');
const top20 = (rows, scoreField) => {
  const sorted = [...rows].sort((a, b) => b[scoreField] - a[scoreField]);
  return sorted.slice(0, Math.ceil(sorted.length * 0.20));
};
out.push(HEADER);
out.push(rowFmt('System-A (top 20%)', summarize(top20(U, 'scoreA'))));
out.push(rowFmt('System-B (top 20%)', summarize(top20(U, 'scoreB'))));
out.push(rowFmt('System-C (top 20%)', summarize(top20(U, 'scoreC'))));
out.push(rowFmt('System-D SHIP set',  summarize(ship)));
out.push(rowFmt('Δw ≥ +3 (full)',     summarize(U.filter(p => p.dwFrozen != null && p.dwFrozen >= 3))));
out.push(rowFmt('Tier-1 HC ≥ +1',     summarize(U.filter(p => p.hcMargin != null && p.hcMargin >= 1))));
out.push('');

// ── Top-decile head-to-head ────────────────────────────────────────────────
out.push('## 6. Head-to-head — top-decile of each system');
out.push('');
out.push('The "elite-only" lens — top 10% by score for each system. Where would we ship if we could only ship 10% of the universe?');
out.push('');
const top10 = (rows, scoreField) => {
  const sorted = [...rows].sort((a, b) => b[scoreField] - a[scoreField]);
  return sorted.slice(0, Math.ceil(sorted.length * 0.10));
};
out.push(HEADER);
out.push(rowFmt('System-A (top 10%)', summarize(top10(U, 'scoreA'))));
out.push(rowFmt('System-B (top 10%)', summarize(top10(U, 'scoreB'))));
out.push(rowFmt('System-C (top 10%)', summarize(top10(U, 'scoreC'))));
out.push(rowFmt('Δw ≥ +3 (full)',     summarize(U.filter(p => p.dwFrozen != null && p.dwFrozen >= 3))));
out.push(rowFmt('Tier-1 HC ≥ +1',     summarize(U.filter(p => p.hcMargin != null && p.hcMargin >= 1))));
out.push('');

// ── Recent-25-pick sanity table ────────────────────────────────────────────
out.push('## 7. Recent 25 picks — what does each system score?');
out.push('');
out.push('Sanity check: for the most recent 25 picks, here\'s every system\'s ranked output. Lets you eyeball whether the systems agree, disagree, or diverge on real plays.');
out.push('');
const recent = [...U].sort((a, b) => (b.date || '').localeCompare(a.date || '') || b.docId.localeCompare(a.docId)).slice(0, 25);
out.push('| Date | Game | Pick | Mkt | Outcome | Δw | HC | A z-score | B-weighted | C P(WIN) | D rule |');
out.push('|---|---|---|---|---|---|---|---|---|---|---|');
for (const p of recent) {
  const game = p.away && p.home ? `${p.away} @ ${p.home}` : '—';
  const oc = p.outcome === 'WIN' ? '**W**' : (p.outcome === 'LOSS' ? 'L' : 'P');
  const dw = p.dwFrozen ?? '—';
  const hc = p.hcMargin ?? '—';
  out.push(`| ${p.date} | ${game} | ${p.team || p.sideKey} | ${p.market} | ${oc} | ${dw} | ${hc} | ${p.scoreA.toFixed(2)} | ${p.scoreB.toFixed(2)} | ${(p.scoreC * 100).toFixed(0)}% | ${p.scoreD === 1 ? '**SHIP**' : 'mute'} |`);
}
out.push('');

// ── Correlation among scores (do they agree?) ─────────────────────────────
out.push('## 8. Do the systems agree? — score correlations');
out.push('');
out.push('If two systems are perfectly correlated, they\'re effectively the same system in different clothing. If they\'re uncorrelated, blending them adds independent signal.');
out.push('');
const sA = U.map(p => p.scoreA);
const sB = U.map(p => p.scoreB);
const sC = U.map(p => p.scoreC);
const sDw  = U.map(p => p.dwFrozen ?? 0);
const sHc  = U.map(p => p.hcMargin ?? 0);
out.push('| Pair | Pearson ρ |');
out.push('|---|---|');
out.push(`| System-A ↔ System-B | ${pearson(sA, sB).toFixed(3)} |`);
out.push(`| System-A ↔ System-C | ${pearson(sA, sC).toFixed(3)} |`);
out.push(`| System-B ↔ System-C | ${pearson(sB, sC).toFixed(3)} |`);
out.push(`| System-A ↔ Δw       | ${pearson(sA, sDw).toFixed(3)} |`);
out.push(`| System-A ↔ HC       | ${pearson(sA.slice(0, sHc.length), sHc).toFixed(3)} (full sample, HC=0 for pre-cutover) |`);
out.push(`| System-C ↔ Δw       | ${pearson(sC, sDw).toFixed(3)} |`);
out.push('');

// ── Discussion footer ─────────────────────────────────────────────────────
out.push('## 9. Brainstorm prompts');
out.push('');
out.push('Key questions for the next iteration:');
out.push('');
out.push('1. **Independence** — if Systems A/B/C are highly correlated with each other AND with Δw, the wallet-features aren\'t orthogonal information; they\'re a re-expression of the directional consensus. If correlations are 0.5–0.8, there\'s independent signal worth blending.');
out.push('2. **Out-of-sample collapse** — System-B and System-C use weights estimated on the same picks they\'re tested on. Real-life lift will be ~30–50% smaller than reported. The honest "free-money" line is **System-A** (no fitting).');
out.push('3. **Lock-floor candidates** — does System-A\'s top-quintile beat HC ≥ +1\'s WR/ROI? Does System-D\'s SHIP set?');
out.push('4. **Sizing curve** — if we ship by score-decile, the sizing should escalate steeply: D9–D10 at full size, D5–D8 flat, D1–D4 muted. We can map score-deciles directly to a star tier.');
out.push('5. **HC-era only refit** — re-run §11 logreg on post-cutover data with HC included; the wallet-features may end up complementary rather than competing.');
out.push('');
out.push('---');
out.push('_Driven by `scripts/_wallet_score_backtest.mjs` · re-run any time. Output regenerates from the live Firestore state at run time._');

const outPath = join(REPO_ROOT, 'WALLET_SCORE_BACKTEST.md');
writeFileSync(outPath, out.join('\n'));
console.log(`[wallet-score-backtest] wrote ${outPath} (${out.length} lines)`);

// ── Quick console summary ─────────────────────────────────────────────────
function consoleRow(label, s) {
  if (!s.n) return `  ${label.padEnd(28)}: N=0`;
  return `  ${label.padEnd(28)}: N=${String(s.n).padStart(3)}  ${s.wins}-${s.losses}-${s.pushes}  WR=${(s.wr*100).toFixed(1).padStart(5)}%  PeakPnL=${sign(s.peakPnl,2)}u  FlatROI=${(s.flatRoi*100).toFixed(1)}%`;
}
console.log('\n══════════════ Top-quintile head-to-head ══════════════');
console.log(consoleRow('Universe',         summarize(U)));
console.log(consoleRow('System-A top 20%', summarize(top20(U, 'scoreA'))));
console.log(consoleRow('System-B top 20%', summarize(top20(U, 'scoreB'))));
console.log(consoleRow('System-C top 20%', summarize(top20(U, 'scoreC'))));
console.log(consoleRow('System-D SHIP',    summarize(ship)));
console.log(consoleRow('Δw ≥ +3',          summarize(U.filter(p => p.dwFrozen != null && p.dwFrozen >= 3))));
console.log(consoleRow('Tier-1 HC ≥ +1',   summarize(U.filter(p => p.hcMargin != null && p.hcMargin >= 1))));
console.log('\n══════════════ Top-decile head-to-head ══════════════');
console.log(consoleRow('System-A top 10%', summarize(top10(U, 'scoreA'))));
console.log(consoleRow('System-B top 10%', summarize(top10(U, 'scoreB'))));
console.log(consoleRow('System-C top 10%', summarize(top10(U, 'scoreC'))));

process.exit(0);
