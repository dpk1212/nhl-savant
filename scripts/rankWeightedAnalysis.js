/**
 * rankWeightedAnalysis.js — does WHO the proven winners are matter
 * beyond the count-based Δw / Δq margins?
 *
 * Today's lock floor (v7.0) treats every whitelisted whale equally:
 * Δw = forW − agW (just counts). But two picks with Δw = +2 can be very
 * different:
 *   A: rank-1 whale + rank-2 whale on our side  → "elite stack"
 *   B: rank-100 whale + rank-150 whale on our side → "fringe stack"
 *
 * The walletDetails array (frozen on peak.v8Scoring.walletDetails) already
 * snapshots each wallet's rank, walletBase quality score, roiNorm, lifetime
 * ROI/PnL, and contribution AT STAMP TIME. So we can compute several
 * quality-weighted margins per pick and test whether any of them predicts
 * outcomes better than the raw counts.
 *
 * Sections:
 *   §0. Data coverage           — what fraction of picks have rank/quality fields
 *   §1. Univariate              — ρ(quality margin, outcome) vs the count-based ρ
 *   §2. Quality at fixed Σ      — does "elite Σ=+5" beat "fringe Σ=+5"?
 *   §3. Best-wallet differential — does the single best whale on our side matter?
 *   §4. Logistic regression      — does adding quality margins lift fit beyond margins?
 *   §5. v7.2 floor candidates    — quality-gated locks
 *   §6. Verdict
 *
 * Local-only — saves to QUALITY_WEIGHTED_ANALYSIS.md, no commit.
 */

import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

if (!admin.apps.length) {
  const sakPath = join(__dirname, '..', 'serviceAccountKey.json');
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
const PICK_COLS = [['sharpFlowPicks', 'ML'], ['sharpFlowSpreads', 'SPREAD'], ['sharpFlowTotals', 'TOTAL']];
const QUALITY_CUT = 30;

const americanToDecimal = (o) => (o > 0 ? 1 + o / 100 : 1 + 100 / Math.abs(o));
const flatProfit = (o, win) => (win ? americanToDecimal(o) - 1 : -1);
const sign = (v, d = 2) => v == null || Number.isNaN(v) ? '—' : (v >= 0 ? '+' : '') + v.toFixed(d);
const pct = (v, d = 1) => v == null || Number.isNaN(v) ? '—' : v.toFixed(d) + '%';
const mdHeader = (cols) => `| ${cols.join(' | ')} |\n|${cols.map(() => '---').join('|')}|`;

// ── stats ─────────────────────────────────────────────────────────────
function mean(xs) { return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN; }
function stdev(xs) {
  if (xs.length < 2) return NaN;
  const m = mean(xs);
  return Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - 1));
}
function pearson(xs, ys) {
  const n = xs.length;
  if (n < 3) return null;
  const mx = mean(xs), my = mean(ys);
  let num = 0, dx = 0, dy = 0;
  for (let i = 0; i < n; i++) { const a = xs[i] - mx, b = ys[i] - my; num += a * b; dx += a * a; dy += b * b; }
  const den = Math.sqrt(dx * dy);
  return den === 0 ? 0 : num / den;
}
function pearsonSig(xs, ys) {
  const r = pearson(xs, ys);
  if (r == null) return { r: null, p: null, sig: false };
  const n = xs.length;
  if (n < 4) return { r, p: null, sig: false };
  const z = 0.5 * Math.log((1 + r) / (1 - r));
  const se = 1 / Math.sqrt(n - 3);
  const zStat = z / se;
  const p = 2 * (1 - normCdf(Math.abs(zStat)));
  return { r, p, sig: p < 0.05 };
}
function normCdf(z) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989422804 * Math.exp(-z * z / 2);
  let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}
function wilson(wins, n, z = 1.96) {
  if (n === 0) return [0, 0];
  const p = wins / n;
  const denom = 1 + z * z / n;
  const center = (p + z * z / (2 * n)) / denom;
  const margin = z * Math.sqrt((p * (1 - p) + z * z / (4 * n)) / n) / denom;
  return [Math.max(0, center - margin), Math.min(1, center + margin)];
}
function tTestVsZero(xs) {
  const n = xs.length;
  if (n < 2) return { t: null, p: null, sig: false };
  const m = mean(xs);
  const s = stdev(xs);
  if (s === 0) return { t: null, p: null, sig: false };
  const t = m / (s / Math.sqrt(n));
  const p = 2 * (1 - normCdf(Math.abs(t)));
  return { t, p, sig: p < 0.05, mean: m };
}
function logreg(X, y, { lr = 0.05, iters = 4000, l2 = 0.5 } = {}) {
  const n = X.length, k = X[0].length;
  const w = new Array(k).fill(0);
  let b = 0;
  for (let it = 0; it < iters; it++) {
    const gw = new Array(k).fill(0);
    let gb = 0;
    for (let i = 0; i < n; i++) {
      let z = b;
      for (let j = 0; j < k; j++) z += w[j] * X[i][j];
      const p = 1 / (1 + Math.exp(-z));
      const err = p - y[i];
      gb += err;
      for (let j = 0; j < k; j++) gw[j] += err * X[i][j];
    }
    for (let j = 0; j < k; j++) gw[j] = gw[j] / n + (l2 / n) * w[j];
    gb /= n;
    for (let j = 0; j < k; j++) w[j] -= lr * gw[j];
    b -= lr * gb;
  }
  let llSat = 0, llNull = 0;
  const yMean = mean(y);
  for (let i = 0; i < n; i++) {
    let z = b;
    for (let j = 0; j < k; j++) z += w[j] * X[i][j];
    const p = 1 / (1 + Math.exp(-z));
    llSat += y[i] * Math.log(Math.max(p, 1e-9)) + (1 - y[i]) * Math.log(Math.max(1 - p, 1e-9));
    llNull += y[i] * Math.log(yMean) + (1 - y[i]) * Math.log(1 - yMean);
  }
  return { w, b, mcfaddenR2: 1 - llSat / llNull };
}
function zscore(arr) {
  const m = mean(arr);
  const s = stdev(arr) || 1;
  return arr.map(v => (v - m) / s);
}

// ── Per-pick quality aggregation from walletDetails ───────────────────
//   Inputs: walletDetails[] = { wallet, side, rank, walletBase, roiNorm,
//                               rankNorm, pnlNorm, roi, pnl, contribution, ... }
//   For each wallet on the side ∈ {pickSide, oppositeSide(pickSide)} we
//   aggregate quality metrics, then take the difference (for − against).
//
// Notes:
//   - rankInverse uses 1 / max(rank, 1) so smaller rank ⇒ bigger weight.
//   - rank is null for wallets outside the leaderboard top — we assign a
//     floor of 999 so they contribute negligibly to rankInverse rather
//     than being dropped.
function aggregateQuality(walletDetails, sideKey) {
  const stats = {
    forW: 0, agW: 0,
    sumBase_for: 0, sumBase_ag: 0,
    sumRoiNorm_for: 0, sumRoiNorm_ag: 0,
    sumRankInv_for: 0, sumRankInv_ag: 0,
    sumLifetimeRoi_for: 0, sumLifetimeRoi_ag: 0,
    sumContribQ_for: 0, sumContribQ_ag: 0,  // contribution-weighted (q-only)
    bestRank_for: null, bestRank_ag: null,
    meanBase_for: null, meanBase_ag: null,
    nWithRank_for: 0, nWithRank_ag: 0,
    nWithBase_for: 0, nWithBase_ag: 0,
  };
  if (!Array.isArray(walletDetails) || !sideKey) return null;

  const baseFor = [];
  const baseAg = [];
  for (const w of walletDetails) {
    if (!w?.side) continue;
    const isFor = w.side === sideKey;
    if (isFor) stats.forW++; else stats.agW++;

    const rank = (w.rank != null && Number.isFinite(w.rank)) ? Number(w.rank) : null;
    const rankInv = 1 / Math.max(rank ?? 999, 1);
    const base = (w.walletBase != null && Number.isFinite(w.walletBase)) ? Number(w.walletBase) : null;
    const roiN = (w.roiNorm != null && Number.isFinite(w.roiNorm)) ? Number(w.roiNorm) : null;
    const lroi = (w.roi != null && Number.isFinite(w.roi)) ? Number(w.roi) : null;
    const contrib = (w.contribution != null && Number.isFinite(w.contribution)) ? Number(w.contribution) : 0;

    if (isFor) {
      stats.sumRankInv_for += rankInv;
      if (rank != null) {
        stats.nWithRank_for++;
        if (stats.bestRank_for == null || rank < stats.bestRank_for) stats.bestRank_for = rank;
      }
      if (base != null) { stats.sumBase_for += base; baseFor.push(base); stats.nWithBase_for++; }
      if (roiN != null) stats.sumRoiNorm_for += roiN;
      if (lroi != null) stats.sumLifetimeRoi_for += lroi;
      if (contrib >= QUALITY_CUT) stats.sumContribQ_for += contrib;
    } else {
      stats.sumRankInv_ag += rankInv;
      if (rank != null) {
        stats.nWithRank_ag++;
        if (stats.bestRank_ag == null || rank < stats.bestRank_ag) stats.bestRank_ag = rank;
      }
      if (base != null) { stats.sumBase_ag += base; baseAg.push(base); stats.nWithBase_ag++; }
      if (roiN != null) stats.sumRoiNorm_ag += roiN;
      if (lroi != null) stats.sumLifetimeRoi_ag += lroi;
      if (contrib >= QUALITY_CUT) stats.sumContribQ_ag += contrib;
    }
  }
  stats.meanBase_for = baseFor.length ? mean(baseFor) : null;
  stats.meanBase_ag  = baseAg.length  ? mean(baseAg)  : null;

  return {
    ...stats,
    deltaRankInv:    stats.sumRankInv_for - stats.sumRankInv_ag,
    deltaBase:       stats.sumBase_for - stats.sumBase_ag,
    deltaRoiNorm:    stats.sumRoiNorm_for - stats.sumRoiNorm_ag,
    deltaLifetimeRoi: stats.sumLifetimeRoi_for - stats.sumLifetimeRoi_ag,
    deltaContribQ:   stats.sumContribQ_for - stats.sumContribQ_ag,
    // best-rank differential: positive = our best is better-ranked than theirs
    //   (using 999 as floor for missing values keeps the sign meaningful).
    deltaBestRank:   (stats.bestRank_ag ?? 999) - (stats.bestRank_for ?? 999),
  };
}

// ── Loader ────────────────────────────────────────────────────────────
async function loadPicks() {
  const rows = [];
  for (const [col, market] of PICK_COLS) {
    const snap = await db.collection(col).where('date', '>=', V6_CUTOVER).get();
    for (const doc of snap.docs) {
      const d = doc.data();
      const sport = d.sport || 'UNK';
      const date = d.date;
      for (const [sideKey, side] of Object.entries(d.sides || {})) {
        const oc = side?.result?.outcome;
        if (oc !== 'WIN' && oc !== 'LOSS') continue;
        if (side.superseded) continue;
        if (side.health?.status === 'CANCELLED' || side.health?.status === 'MUTED') continue;
        if (side.lockStage === 'SHADOW') continue;
        const peak = side.peak || side.lock || {};
        const peakStars = peak?.stars ?? 0;
        if (peakStars < 2.5) continue;

        const odds = peak?.peakOdds ?? side.lock?.lockOdds ?? peak?.odds ?? side.lock?.odds ?? null;
        const peakUnits = peak?.units || 1;
        const won = oc === 'WIN' ? 1 : 0;

        const dwFrozen = side.v8_walletConsensusDelta;
        const dqFrozen = side.v8_walletConsensusQualityMargin;
        const wd = peak?.v8Scoring?.walletDetails;

        const q = aggregateQuality(wd, sideKey);
        if (!q || q.forW + q.agW === 0) continue;

        // Δw / Δq — prefer frozen stamp, else recompute from walletDetails
        const dw = dwFrozen != null ? Number(dwFrozen) : (q.forW - q.agW);
        let dq = dqFrozen != null ? Number(dqFrozen) : null;
        if (dq == null) {
          let qf = 0, qa = 0;
          for (const w of (wd || [])) {
            if ((w?.contribution ?? 0) < QUALITY_CUT || !w?.side) continue;
            if (w.side === sideKey) qf++; else qa++;
          }
          dq = qf - qa;
        }

        const flat = odds != null ? flatProfit(odds, won === 1) : null;
        const peakPnl = won ? (peakUnits * (americanToDecimal(odds) - 1)) : -peakUnits;

        rows.push({
          date, sport, market, sideKey,
          dw, dq, sum: dw + dq,
          // quality-weighted margins (continuous, not counts)
          dRankInv:     q.deltaRankInv,
          dBase:        q.deltaBase,
          dRoiNorm:     q.deltaRoiNorm,
          dLifetimeRoi: q.deltaLifetimeRoi,
          dContribQ:    q.deltaContribQ,
          dBestRank:    q.deltaBestRank,
          meanBase_for: q.meanBase_for,
          bestRank_for: q.bestRank_for,
          // raw aggregates for context
          sumBase_for:    q.sumBase_for,
          sumBase_ag:     q.sumBase_ag,
          sumRankInv_for: q.sumRankInv_for,
          sumRankInv_ag:  q.sumRankInv_ag,
          forW: q.forW, agW: q.agW,
          nWithRank_for:  q.nWithRank_for,
          nWithBase_for:  q.nWithBase_for,
          odds, won, peakUnits, peakPnl,
          flat: flat ?? 0,
        });
      }
    }
  }
  return rows;
}

// ── Cohort summarizer ─────────────────────────────────────────────────
function summarize(rows) {
  if (!rows.length) return { n: 0 };
  const wins = rows.filter(r => r.won === 1).length;
  const losses = rows.length - wins;
  const wr = wins / rows.length;
  const flat = rows.reduce((s, r) => s + r.flat, 0);
  const flatRoi = (flat / rows.length) * 100;
  const peak = rows.reduce((s, r) => s + r.peakPnl, 0);
  const [lo, hi] = wilson(wins, rows.length);
  const t = tTestVsZero(rows.map(r => r.flat));
  return {
    n: rows.length, wins, losses,
    wr: wr * 100, wrLo: lo * 100, wrHi: hi * 100,
    flat, flatRoi, peak,
    t: t.t, p: t.p, sig: t.sig,
  };
}
function fmt(s) {
  if (!s || s.n === 0) return '— · — · —';
  const sigMark = s.sig ? ' ✓' : '';
  return `${s.n}p / ${s.wins}-${s.losses} · ${pct(s.wr)} · ${sign(s.flatRoi, 1)}% flat${sigMark}`;
}

// ── Main ──────────────────────────────────────────────────────────────
(async () => {
  console.log('Loading graded picks (dashboard-truth filter)…');
  const all = await loadPicks();
  console.log(`  ${all.length} graded sides loaded.`);

  // Coverage check — how many have populated quality fields?
  const nWithBase    = all.filter(r => r.sumBase_for > 0 || r.sumBase_ag > 0).length;
  const nWithRank    = all.filter(r => r.sumRankInv_for > 0 || r.sumRankInv_ag > 0).length;
  const nWithBestRank = all.filter(r => r.bestRank_for != null).length;

  const byDate = [...new Set(all.map(r => r.date))].sort();
  const sports = [...new Set(all.map(r => r.sport))].sort();
  const out = [];
  const nowET = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

  out.push('# Quality-Weighted Margin Analysis — does WHO matters beyond HOW MANY?');
  out.push('');
  out.push(`Generated: ${nowET} ET`);
  out.push('');
  out.push(`**Question.** v7.0 uses count-based margins: Δw = forW − agW, Δq = qFor − qAg. Every whitelisted whale counts equally. But \`peak.v8Scoring.walletDetails[]\` already snapshots each wallet's leaderboard rank, walletBase quality score, normalized ROI, and lifetime ROI **at stamp time**. So we can construct quality-weighted margins (e.g. Σ\`walletBase\`_for − Σ\`walletBase\`_against, Σ(1/rank)_for − Σ(1/rank)_against, single best-wallet differential) and test whether they predict outcomes better than raw counts.`);
  out.push('');
  out.push(`**Coverage.** ${all.length} graded sides · ${V6_CUTOVER} → ${byDate[byDate.length - 1]} (${byDate.length} days) · sports: ${sports.join(', ')}.`);
  out.push('');
  out.push(`**Quality-field availability** (per-side): walletBase populated on ${nWithBase}/${all.length} (${pct(100 * nWithBase / all.length)}); leaderboard rank populated on at least one wallet on ${nWithRank}/${all.length} (${pct(100 * nWithRank / all.length)}); best-rank on for-side present on ${nWithBestRank}/${all.length} (${pct(100 * nWithBestRank / all.length)}). Inclusion mirrors the live Pick Performance dashboard.`);
  out.push('');

  // ════════════════════════════════════════════════════════════════════
  // §1. Univariate predictiveness — quality margins vs count margins
  // ════════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §1. Univariate predictiveness');
  out.push('');
  out.push('Pearson ρ between each candidate signal and the flat-1u outcome. The first two rows are the v7.0 count-based baseline; everything below is a quality-weighted alternative. \`✓\` = p < 0.05 by Fisher r-to-z.');
  out.push('');
  const ys = all.map(r => r.flat);
  const features = [
    { name: 'Δw (count, baseline)',                       vals: all.map(r => r.dw) },
    { name: 'Δq (count, baseline)',                       vals: all.map(r => r.dq) },
    { name: 'Σ = Δw + Δq (v7.0 floor)',                   vals: all.map(r => r.sum) },
    { name: 'ΔwalletBase  (Σ base_for − Σ base_against)', vals: all.map(r => r.dBase) },
    { name: 'ΔrankInv     (Σ 1/rank_for − Σ 1/rank_ag)',  vals: all.map(r => r.dRankInv) },
    { name: 'ΔroiNorm     (Σ roiNorm_for − Σ roiNorm_ag)', vals: all.map(r => r.dRoiNorm) },
    { name: 'ΔlifetimeRoi (Σ raw lifetime ROI delta)',    vals: all.map(r => r.dLifetimeRoi) },
    { name: 'ΔcontribQ    (Σ contrib≥30 weight)',         vals: all.map(r => r.dContribQ) },
    { name: 'ΔbestRank    (best wallet rank advantage)',  vals: all.map(r => r.dBestRank) },
    { name: 'meanBase_for (avg quality on our side)',     vals: all.map(r => r.meanBase_for ?? 0) },
  ];
  out.push(mdHeader(['Feature', 'ρ vs flat outcome', 'p', 'sig']));
  for (const f of features) {
    const { r, p, sig } = pearsonSig(f.vals, ys);
    out.push(`| ${f.name} | ${r != null ? r.toFixed(3) : '—'} | ${p != null ? p.toFixed(3) : '—'} | ${sig ? '✓' : ''} |`);
  }
  out.push('');
  out.push('**How to read.** If a quality-weighted feature (\`ΔwalletBase\`, \`ΔrankInv\`, \`ΔroiNorm\`) clearly beats Δw / Σ on ρ, that\'s evidence WHO matters beyond HOW MANY. If they cluster around the count-based ρ, quality is already absorbed by counts.');
  out.push('');

  // ════════════════════════════════════════════════════════════════════
  // §2. Quality at fixed Σ — does an "elite" Σ=+5 beat a "fringe" Σ=+5?
  // ════════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §2. Quality at fixed Σ');
  out.push('');
  out.push('Hold the count-based Σ constant and split each cell by quality. If the top-quartile bucket of \`ΔwalletBase\` (or \`ΔrankInv\`) materially beats the bottom quartile at the same Σ, we\'re leaving edge on the table by treating all whales equally.');
  out.push('');

  // Quartile breakdown helper, computed within each Σ cell to keep the
  // cohort comparable. Falls back to a 50/50 split when N < 8.
  function splitByQuality(slice, key) {
    if (slice.length < 4) return { lo: [], hi: [] };
    const sorted = [...slice].sort((a, b) => a[key] - b[key]);
    if (slice.length < 8) {
      const mid = Math.floor(sorted.length / 2);
      return { lo: sorted.slice(0, mid), hi: sorted.slice(mid) };
    }
    const q = Math.floor(sorted.length / 4);
    return { lo: sorted.slice(0, q), hi: sorted.slice(-q) };
  }

  out.push('### §2a. Within each Σ — split by `ΔwalletBase` (low vs high quality stack)');
  out.push('');
  out.push(mdHeader(['Σ', 'low ΔwalletBase (bottom 25%)', 'high ΔwalletBase (top 25%)', 'high − low (flat ROI lift)']));
  for (const s of [3, 4, 5, 6, 7, 8]) {
    const slice = all.filter(r => r.sum === s);
    if (slice.length === 0) continue;
    const { lo, hi } = splitByQuality(slice, 'dBase');
    const sLo = summarize(lo), sHi = summarize(hi);
    const lift = (sHi.flatRoi != null && sLo.flatRoi != null) ? sHi.flatRoi - sLo.flatRoi : null;
    out.push(`| Σ=${s} (N=${slice.length}) | ${fmt(sLo)} | ${fmt(sHi)} | ${lift != null ? sign(lift, 1) + '%' : '—'} |`);
  }
  out.push('');

  out.push('### §2b. Within each Σ — split by `ΔrankInv` (low vs high rank-weighted stack)');
  out.push('');
  out.push(mdHeader(['Σ', 'low ΔrankInv (bottom 25%)', 'high ΔrankInv (top 25%)', 'high − low (flat ROI lift)']));
  for (const s of [3, 4, 5, 6, 7, 8]) {
    const slice = all.filter(r => r.sum === s);
    if (slice.length === 0) continue;
    const { lo, hi } = splitByQuality(slice, 'dRankInv');
    const sLo = summarize(lo), sHi = summarize(hi);
    const lift = (sHi.flatRoi != null && sLo.flatRoi != null) ? sHi.flatRoi - sLo.flatRoi : null;
    out.push(`| Σ=${s} (N=${slice.length}) | ${fmt(sLo)} | ${fmt(sHi)} | ${lift != null ? sign(lift, 1) + '%' : '—'} |`);
  }
  out.push('');

  out.push('### §2c. Within each Δw — split by `meanBase_for` (avg quality of our backers)');
  out.push('');
  out.push(mdHeader(['Δw', 'low meanBase_for (bottom 25%)', 'high meanBase_for (top 25%)', 'high − low']));
  for (const dw of [1, 2, 3, 4]) {
    const slice = all.filter(r => r.dw === dw);
    if (slice.length === 0) continue;
    const { lo, hi } = splitByQuality(slice, 'meanBase_for');
    const sLo = summarize(lo), sHi = summarize(hi);
    const lift = (sHi.flatRoi != null && sLo.flatRoi != null) ? sHi.flatRoi - sLo.flatRoi : null;
    out.push(`| Δw=${dw} (N=${slice.length}) | ${fmt(sLo)} | ${fmt(sHi)} | ${lift != null ? sign(lift, 1) + '%' : '—'} |`);
  }
  out.push('');

  // ════════════════════════════════════════════════════════════════════
  // §3. Best-wallet differential — does the single best whale matter?
  // ════════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §3. Best-wallet differential');
  out.push('');
  out.push('Forget aggregates. Does the *single best-ranked* wallet on each side carry signal? "best wallet on our side ranked top-10" vs "best wallet on our side ranked 50+" at the same Σ.');
  out.push('');

  out.push('### §3a. Bins by `bestRank_for` (lower = better)');
  out.push('');
  out.push(mdHeader(['bestRank_for', 'cohort']));
  const bestRankBins = [
    { label: 'top-5 (rank ≤ 5)',     f: r => r.bestRank_for != null && r.bestRank_for <= 5 },
    { label: 'top-10 (rank 6–10)',   f: r => r.bestRank_for != null && r.bestRank_for > 5  && r.bestRank_for <= 10 },
    { label: 'top-25 (rank 11–25)',  f: r => r.bestRank_for != null && r.bestRank_for > 10 && r.bestRank_for <= 25 },
    { label: '26–50',                f: r => r.bestRank_for != null && r.bestRank_for > 25 && r.bestRank_for <= 50 },
    { label: '50+',                  f: r => r.bestRank_for != null && r.bestRank_for > 50 },
    { label: 'no ranked wallet',     f: r => r.bestRank_for == null },
  ];
  for (const b of bestRankBins) {
    out.push(`| ${b.label} | ${fmt(summarize(all.filter(b.f)))} |`);
  }
  out.push('');

  out.push('### §3b. Bins by `ΔbestRank` (our best vs their best)');
  out.push('');
  out.push('Positive = our best wallet outranks theirs. \`agBest=999\` (no ranked opp wallet) gets bucketed into "very large advantage."');
  out.push('');
  out.push(mdHeader(['ΔbestRank', 'cohort']));
  const dBestBins = [
    { label: '≥ +50 (huge edge)',    f: r => r.dBestRank >= 50 },
    { label: '+10 … +49',            f: r => r.dBestRank >= 10  && r.dBestRank < 50 },
    { label: '+1 … +9',              f: r => r.dBestRank >= 1   && r.dBestRank < 10 },
    { label: '0 (parity)',           f: r => r.dBestRank === 0 },
    { label: '−1 … −49 (we trail)',  f: r => r.dBestRank < 0    && r.dBestRank > -50 },
    { label: '≤ −50 (huge deficit)', f: r => r.dBestRank <= -50 },
  ];
  for (const b of dBestBins) {
    out.push(`| ${b.label} | ${fmt(summarize(all.filter(b.f)))} |`);
  }
  out.push('');

  // ════════════════════════════════════════════════════════════════════
  // §4. Logistic regression
  // ════════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §4. Logistic regression — does quality lift fit beyond margins?');
  out.push('');
  out.push('Three nested models on outcome ∈ {0, 1}, all features z-scored. McFadden pseudo-R² shows incremental fit. If model B (margins + quality) beats model A (margins only), WHO adds signal beyond HOW MANY.');
  out.push('');
  const yBin = all.map(r => r.won);
  const dwZ = zscore(all.map(r => r.dw));
  const dqZ = zscore(all.map(r => r.dq));
  const dBaseZ = zscore(all.map(r => r.dBase));
  const dRankInvZ = zscore(all.map(r => r.dRankInv));
  const dRoiNormZ = zscore(all.map(r => r.dRoiNorm));
  const dBestRankZ = zscore(all.map(r => r.dBestRank));

  const modelA = logreg(all.map((_, i) => [dwZ[i], dqZ[i]]), yBin);
  const modelB = logreg(all.map((_, i) => [dwZ[i], dqZ[i], dBaseZ[i], dRankInvZ[i]]), yBin);
  const modelC = logreg(all.map((_, i) => [dBaseZ[i], dRankInvZ[i], dRoiNormZ[i], dBestRankZ[i]]), yBin);

  out.push('### §4a. Model A — count baseline');
  out.push('');
  out.push(`Features: \`Δw, Δq\`  · McFadden R² = **${modelA.mcfaddenR2.toFixed(3)}**`);
  out.push('');
  out.push(`- β(Δw) = ${modelA.w[0].toFixed(3)}  ·  β(Δq) = ${modelA.w[1].toFixed(3)}  ·  intercept = ${modelA.b.toFixed(3)}`);
  out.push('');
  out.push('### §4b. Model B — counts + quality');
  out.push('');
  out.push(`Features: \`Δw, Δq, ΔwalletBase, ΔrankInv\`  · McFadden R² = **${modelB.mcfaddenR2.toFixed(3)}**`);
  out.push('');
  out.push(`- β(Δw) = ${modelB.w[0].toFixed(3)}  ·  β(Δq) = ${modelB.w[1].toFixed(3)}  ·  β(ΔwalletBase) = ${modelB.w[2].toFixed(3)}  ·  β(ΔrankInv) = ${modelB.w[3].toFixed(3)}  ·  intercept = ${modelB.b.toFixed(3)}`);
  out.push('');
  out.push('### §4c. Model C — pure quality (no counts)');
  out.push('');
  out.push(`Features: \`ΔwalletBase, ΔrankInv, ΔroiNorm, ΔbestRank\`  · McFadden R² = **${modelC.mcfaddenR2.toFixed(3)}**`);
  out.push('');
  out.push(`- β(ΔwalletBase) = ${modelC.w[0].toFixed(3)}  ·  β(ΔrankInv) = ${modelC.w[1].toFixed(3)}  ·  β(ΔroiNorm) = ${modelC.w[2].toFixed(3)}  ·  β(ΔbestRank) = ${modelC.w[3].toFixed(3)}  ·  intercept = ${modelC.b.toFixed(3)}`);
  out.push('');
  const liftBA = modelB.mcfaddenR2 - modelA.mcfaddenR2;
  const liftCA = modelC.mcfaddenR2 - modelA.mcfaddenR2;
  out.push(`**Δ R² (B − A) = ${liftBA >= 0 ? '+' : ''}${liftBA.toFixed(3)}.** ${liftBA > 0.01 ? 'Quality is adding non-trivial fit beyond Δw/Δq.' : 'Quality features are essentially redundant with the counts.'}`);
  out.push('');
  out.push(`**Δ R² (C − A) = ${liftCA >= 0 ? '+' : ''}${liftCA.toFixed(3)}.** ${liftCA > 0 ? 'A pure-quality model fits at least as well as counts alone — quality is the underlying signal.' : 'Pure-quality model is weaker than counts — counts encode something quality doesn\'t.'}`);
  out.push('');

  // ════════════════════════════════════════════════════════════════════
  // §5. v7.2 floor candidates — quality-gated locks
  // ════════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §5. v7.2 floor candidates — quality-gated locks');
  out.push('');
  out.push('What if v7.0 (\`Σ ≥ +5\`) added a quality gate? Each row is a candidate floor; metrics are over the same dashboard-truth sample. The "lift vs Σ≥+5" column compares flat ROI against the v7.0 baseline.');
  out.push('');

  // Determine sample-derived thresholds for the quality cuts so they
  // aren't hard-coded magic numbers — pick the median ΔwalletBase and
  // ΔrankInv among the Σ ≥ +5 cohort to define "above-typical quality."
  const baselineRows = all.filter(r => r.dw >= 1 && r.dq >= 1 && r.sum >= 5);
  const baselineBaseSorted    = [...baselineRows].sort((a, b) => a.dBase    - b.dBase);
  const baselineRankInvSorted = [...baselineRows].sort((a, b) => a.dRankInv - b.dRankInv);
  const medBase    = baselineBaseSorted.length    ? baselineBaseSorted[Math.floor(baselineBaseSorted.length / 2)].dBase    : 0;
  const medRankInv = baselineRankInvSorted.length ? baselineRankInvSorted[Math.floor(baselineRankInvSorted.length / 2)].dRankInv : 0;

  const baseS = summarize(baselineRows);
  const candidates = [
    { label: 'v7.0 baseline (Σ ≥ +5)',                                                     f: r => r.dw >= 1 && r.dq >= 1 && r.sum >= 5 },
    { label: `Σ ≥ +5 ∧ ΔwalletBase ≥ ${medBase.toFixed(0)} (median of baseline)`,           f: r => r.dw >= 1 && r.dq >= 1 && r.sum >= 5 && r.dBase >= medBase },
    { label: `Σ ≥ +5 ∧ ΔrankInv ≥ ${medRankInv.toFixed(2)} (median of baseline)`,           f: r => r.dw >= 1 && r.dq >= 1 && r.sum >= 5 && r.dRankInv >= medRankInv },
    { label: 'Σ ≥ +5 ∧ bestRank_for ≤ 25 (a top-25 whale on our side)',                    f: r => r.dw >= 1 && r.dq >= 1 && r.sum >= 5 && r.bestRank_for != null && r.bestRank_for <= 25 },
    { label: 'Σ ≥ +5 ∧ bestRank_for ≤ 10 (a top-10 whale)',                                f: r => r.dw >= 1 && r.dq >= 1 && r.sum >= 5 && r.bestRank_for != null && r.bestRank_for <= 10 },
    { label: 'Σ ≥ +5 ∧ ΔbestRank ≥ +10 (our best ranks ≥ 10 ahead of theirs)',             f: r => r.dw >= 1 && r.dq >= 1 && r.sum >= 5 && r.dBestRank >= 10 },
    { label: 'Σ ≥ +5 ∧ ΔbestRank ≥ 0 (our best matches or beats theirs)',                  f: r => r.dw >= 1 && r.dq >= 1 && r.sum >= 5 && r.dBestRank >= 0 },
    { label: 'Σ ≥ +4 ∧ bestRank_for ≤ 10 (rescue floor, top-10 quality gate)',             f: r => r.dw >= 1 && r.dq >= 1 && r.sum >= 4 && r.bestRank_for != null && r.bestRank_for <= 10 },
    { label: `Σ ≥ +4 ∧ ΔwalletBase ≥ ${medBase.toFixed(0)}`,                                f: r => r.dw >= 1 && r.dq >= 1 && r.sum >= 4 && r.dBase >= medBase },
    { label: 'pure quality: ΔwalletBase ≥ p75 of all picks (no Σ floor)',                  f: (() => { const sorted = [...all].sort((a, b) => a.dBase - b.dBase); const p75 = sorted[Math.floor(sorted.length * 0.75)]?.dBase ?? Infinity; return r => r.dBase >= p75; })() },
  ];

  out.push(mdHeader(['Floor', 'N', 'WR (95% CI)', 'flat ROI', 'peak PnL', 't', 'p', 'lift vs v7.0']));
  for (const c of candidates) {
    const slice = all.filter(c.f);
    const s = summarize(slice);
    if (s.n === 0) {
      out.push(`| ${c.label} | 0 | — | — | — | — | — | — |`);
      continue;
    }
    const lift = baseS.n ? s.flatRoi - baseS.flatRoi : 0;
    const sigMark = s.sig ? ' ✓' : '';
    out.push(`| ${c.label} | ${s.n} | ${pct(s.wr, 1)} (${pct(s.wrLo, 1)}–${pct(s.wrHi, 1)}) | ${sign(s.flatRoi, 1)}%${sigMark} | ${sign(s.peak, 2)}u | ${s.t != null ? s.t.toFixed(2) : '—'} | ${s.p != null ? s.p.toFixed(3) : '—'} | ${sign(lift, 1)}% |`);
  }
  out.push('');
  out.push(`**Reading the table.** A floor that **shrinks N moderately while lifting flat ROI by ≥ +10pp** is a real win. A floor that lifts ROI but cuts N below ~15 is over-fit to noise. The v7.0 baseline is **N=${baseS.n} · ${pct(baseS.wr, 1)} WR · ${sign(baseS.flatRoi, 1)}% flat ROI**.`);
  out.push('');

  // ════════════════════════════════════════════════════════════════════
  // §6. Verdict scaffolding
  // ════════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §6. Verdict scaffolding');
  out.push('');
  out.push('Read §1 + §4 first to know whether quality is a real lever, then §2 + §5 to see if it\'s actionable. Sanity rules:');
  out.push('');
  out.push('1. If §1 shows ρ(ΔwalletBase) ≤ ρ(Σ) AND §4 ΔR² (B − A) < 0.01 → quality is **already absorbed** by counts. Don\'t add a quality gate.');
  out.push('2. If §2a/2b shows a consistent flat-ROI lift in the high-quality column at fixed Σ → quality IS a separator at fixed counts. Worth a §5 candidate.');
  out.push('3. Pick a §5 candidate only if (a) lift ≥ +10pp flat ROI, (b) N ≥ 20, (c) t-stat ≥ 1.96.');
  out.push('4. If §3 shows \`top-5 / top-10\` whale presence vastly outperforms "no ranked wallet" → that\'s a clean, simple, explainable gate (\`bestRank_for ≤ 10\`).');
  out.push('');

  const outPath = join(__dirname, '..', 'QUALITY_WEIGHTED_ANALYSIS.md');
  writeFileSync(outPath, out.join('\n'));
  console.log(`\nReport written → ${outPath}`);
  console.log('Key numbers:');
  console.log(`  Baseline (Σ≥+5): N=${baseS.n} · WR ${pct(baseS.wr, 1)} · flat ROI ${sign(baseS.flatRoi, 1)}%`);
  for (const c of candidates.slice(1)) {
    const s = summarize(all.filter(c.f));
    console.log(`  ${c.label.padEnd(70)} → N=${String(s.n).padStart(3)} · WR ${pct(s.wr, 1).padStart(6)} · flat ROI ${sign(s.flatRoi, 1).padStart(6)}%${s.sig ? ' ✓' : ''}`);
  }

  process.exit(0);
})();
