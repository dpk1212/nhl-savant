/**
 * oppositionAnalysis.js — does opposition matter beyond Δw / Δq?
 *
 * Question: under v7.0, lock-tier is driven by (Δw, Δq) and Σ=Δw+Δq.
 * But Δw=+2 with 0 opposing whales is a very different signal from
 * Δw=+2 with 6 opposing whales (forW=8/agW=6 vs forW=2/agW=0).
 * Same margin, opposite picture of "contested edge."
 *
 * This script tests whether absolute opposition counts (agW, qAg) carry
 * predictive information beyond the margins, and whether a v7.1 floor
 * with an opposition-gate would beat the current Σ ≥ +5 cut.
 *
 * Sections:
 *   §1. Univariate predictiveness  — ρ(forW,outcome), ρ(agW,outcome) etc.
 *   §2. Margin-constant splits      — does opposition matter at fixed Δw / Δq?
 *   §3. (Δw × agW) cross-tab        — N/WR/flat ROI for every cell
 *   §4. (Δq × qAg) cross-tab        — same
 *   §5. Dominance ratios            — forW/(forW+agW), qFor/(qFor+qAg)
 *   §6. Logistic regression         — does adding (agW, qAg) lift fit vs (Δw, Δq) baseline?
 *   §7. Opposition-gated v7.1 floor candidates — quantified
 *
 * Local-only — saves to OPPOSITION_ANALYSIS.md, no commit.
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

// ── stats helpers ─────────────────────────────────────────────────────
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
  // Fisher r-to-z
  const z = 0.5 * Math.log((1 + r) / (1 - r));
  const se = 1 / Math.sqrt(n - 3);
  const zStat = z / se;
  // two-tailed p via normal approx
  const p = 2 * (1 - normCdf(Math.abs(zStat)));
  return { r, p, sig: p < 0.05 };
}
function normCdf(z) {
  // Abramowitz & Stegun 7.1.26
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

// Logistic regression — L2-regularized batch gradient descent.
function logreg(X, y, { lr = 0.05, iters = 4000, l2 = 0.5 } = {}) {
  const n = X.length, k = X[0].length;
  const w = new Array(k).fill(0);
  let b = 0;
  for (let it = 0; it < iters; it++) {
    const gw = new Array(k).fill(0);
    let gb = 0;
    let loss = 0;
    for (let i = 0; i < n; i++) {
      let z = b;
      for (let j = 0; j < k; j++) z += w[j] * X[i][j];
      const p = 1 / (1 + Math.exp(-z));
      const err = p - y[i];
      gb += err;
      for (let j = 0; j < k; j++) gw[j] += err * X[i][j];
      loss += -y[i] * Math.log(Math.max(p, 1e-9)) - (1 - y[i]) * Math.log(Math.max(1 - p, 1e-9));
    }
    for (let j = 0; j < k; j++) gw[j] = gw[j] / n + (l2 / n) * w[j];
    gb /= n;
    for (let j = 0; j < k; j++) w[j] -= lr * gw[j];
    b -= lr * gb;
  }
  // pseudo R² (McFadden)
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

// ── Δq fallback (matches dailyV6Report.js / v6FullAnalysis.js) ────────
function recomputeFromWalletDetails(wd, sideKey) {
  if (!Array.isArray(wd)) return { qFor: 0, qAg: 0 };
  let qFor = 0, qAg = 0;
  for (const w of wd) {
    if ((w?.contribution ?? 0) < QUALITY_CUT) continue;
    if (w.side === sideKey) qFor++;
    else if (w.side) qAg++;
  }
  return { qFor, qAg };
}

// ── Loader (mirrors v6FullAnalysis.js dashboard-truth filter) ─────────
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

        let dwFrozen = side.v8_walletConsensusDelta != null ? Number(side.v8_walletConsensusDelta) : null;
        let dqFrozen = side.v8_walletConsensusQualityMargin != null ? Number(side.v8_walletConsensusQualityMargin) : null;
        let forW    = side.v8_walletConsensusForW;
        let agW     = side.v8_walletConsensusAgW;
        let qFor30  = side.v8_walletConsensusQualityForT30;
        let qAg30   = side.v8_walletConsensusQualityAgT30;

        const wd = peak?.v8Scoring?.walletDetails;

        // Fallback: recompute qFor / qAg from walletDetails when missing
        if ((qFor30 == null || qAg30 == null) && Array.isArray(wd)) {
          const r = recomputeFromWalletDetails(wd, sideKey);
          if (qFor30 == null) qFor30 = r.qFor;
          if (qAg30 == null) qAg30 = r.qAg;
          if (dqFrozen == null) dqFrozen = r.qFor - r.qAg;
        }
        // Fallback: forW / agW from walletDetails — but these need the
        // whitelist cache, which wasn't loaded at stamp-time for some
        // older picks. Here we approximate forW/agW from walletDetails
        // wallet-side counts only, INCLUDING all wallets (not just
        // whitelisted) — this is a coarser proxy but lets us include
        // those rows in the analysis. They'll be flagged in coverage.
        let usedFallbackForW = false;
        if ((forW == null || agW == null) && Array.isArray(wd)) {
          let f = 0, a = 0;
          for (const w of wd) {
            if (!w?.side) continue;
            if (w.side === sideKey) f++; else a++;
          }
          if (forW == null) { forW = f; usedFallbackForW = true; }
          if (agW == null)  { agW = a; usedFallbackForW = true; }
          if (dwFrozen == null) dwFrozen = f - a;
        }

        if (dwFrozen == null || dqFrozen == null || forW == null || agW == null || qFor30 == null || qAg30 == null) continue;

        const flat = odds != null ? flatProfit(odds, won === 1) : null;
        const peakPnl = won ? (peakUnits * (americanToDecimal(odds) - 1)) : -peakUnits;

        rows.push({
          date, sport, market, sideKey,
          dw: Number(dwFrozen), dq: Number(dqFrozen),
          forW: Number(forW), agW: Number(agW),
          qFor: Number(qFor30), qAg: Number(qAg30),
          sum: Number(dwFrozen) + Number(dqFrozen),
          odds, won, peakUnits, peakPnl,
          flat: flat ?? 0,
          fallbackForW: usedFallbackForW,
        });
      }
    }
  }
  return rows;
}

// ── Cohort summary ────────────────────────────────────────────────────
function summarize(rows, label = '') {
  if (!rows.length) return { n: 0, label };
  const wins = rows.filter(r => r.won === 1).length;
  const losses = rows.length - wins;
  const wr = wins / rows.length;
  const flat = rows.reduce((s, r) => s + r.flat, 0);
  const flatRoi = (flat / rows.length) * 100;
  const peak = rows.reduce((s, r) => s + r.peakPnl, 0);
  const [lo, hi] = wilson(wins, rows.length);
  const t = tTestVsZero(rows.map(r => r.flat));
  return {
    label, n: rows.length, wins, losses,
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
  const fallbackCount = all.filter(r => r.fallbackForW).length;
  console.log(`  ${all.length} graded sides loaded · ${fallbackCount} used walletDetails fallback for forW/agW.`);

  const byDate = [...new Set(all.map(r => r.date))].sort();
  const sports = [...new Set(all.map(r => r.sport))].sort();
  const out = [];
  const nowET = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

  out.push('# Opposition Analysis — does it matter beyond Δw / Δq?');
  out.push('');
  out.push(`Generated: ${nowET} ET`);
  out.push('');
  out.push(`**Question.** Under v7.0 the lock floor is driven by (Δw, Δq) and Σ. But "Δw=+2 with 0 opposition" (forW=2/agW=0) and "Δw=+2 with 6 opposition" (forW=8/agW=6) are very different pictures of contested edge. This report tests whether the absolute opposition counts (\`agW\` for proven-winner pushback, \`qAg\` for quality-wallet pushback) carry predictive information **above and beyond** the margins.`);
  out.push('');
  out.push(`**Coverage.** ${all.length} graded sides · ${V6_CUTOVER} → ${byDate[byDate.length - 1]} (${byDate.length} days) · sports: ${sports.join(', ')}. Inclusion mirrors the live Pick Performance dashboard. ${fallbackCount} sides used walletDetails fallback because the frozen \`v8_walletConsensusForW/AgW\` stamp was missing (typical for the very first cutover days when the whitelist cache was still warming).`);
  out.push('');
  out.push('Statistical convention: \`flat ROI\` = mean profit per pick at 1u flat staking. \`✓\` next to a flat ROI marks t-test against zero clearing p < 0.05 (two-tailed). Wilson 95% CIs reported on key WR cells.');
  out.push('');

  // ════════════════════════════════════════════════════════════════════
  // §1. Univariate predictiveness — does opposition matter at all?
  // ════════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §1. Univariate predictiveness');
  out.push('');
  out.push('Pearson ρ between each raw signal and the flat-1u outcome (positive = signal predicts wins). \`✓\` = p < 0.05 by Fisher r-to-z.');
  out.push('');
  const ys = all.map(r => r.flat);
  const features = [
    { name: 'Δw (winner margin)',     vals: all.map(r => r.dw),  notes: 'baseline' },
    { name: 'Δq (quality margin)',    vals: all.map(r => r.dq),  notes: 'baseline' },
    { name: 'Σ = Δw + Δq',            vals: all.map(r => r.sum), notes: 'v7.0 floor signal' },
    { name: 'forW (proven for-side)', vals: all.map(r => r.forW),notes: 'how many whales backing' },
    { name: 'agW (proven against)',   vals: all.map(r => r.agW), notes: 'absolute opposition' },
    { name: 'qFor (quality for)',     vals: all.map(r => r.qFor),notes: 'high-contribution backing' },
    { name: 'qAg (quality against)',  vals: all.map(r => r.qAg), notes: 'high-contribution opposition' },
    { name: 'forW + qFor (raw stack)',vals: all.map(r => r.forW + r.qFor), notes: 'total weight on side' },
    { name: 'agW + qAg (raw push)',   vals: all.map(r => r.agW + r.qAg),   notes: 'total opposing weight' },
    { name: '−agW (negated)',         vals: all.map(r => -r.agW),  notes: 'sign-aligned with "edge"' },
  ];
  out.push(mdHeader(['Feature', 'ρ vs flat outcome', 'p', 'sig', 'notes']));
  for (const f of features) {
    const { r, p, sig } = pearsonSig(f.vals, ys);
    out.push(`| ${f.name} | ${r != null ? r.toFixed(3) : '—'} | ${p != null ? p.toFixed(3) : '—'} | ${sig ? '✓' : ''} | ${f.notes} |`);
  }
  out.push('');
  out.push('If \`agW\` (or \`qAg\`) shows a meaningful negative ρ on its own, opposition is a real predictor in raw form. If it\'s ~0, opposition only matters through its contribution to Δw (which is forW − agW).');
  out.push('');

  // ════════════════════════════════════════════════════════════════════
  // §2. Margin-constant splits — does opposition still matter at fixed Δ?
  // ════════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §2. Margin-constant splits');
  out.push('');
  out.push('Hold Δw (or Δq) fixed and split by opposition. If "clean" picks materially beat "contested" picks at the same margin, that\'s a real opposition signal beyond Δ.');
  out.push('');
  out.push('### §2a. Within each Δw level — split by `agW`');
  out.push('');
  out.push(mdHeader(['Δw', 'agW = 0 (clean)', 'agW = 1', 'agW ≥ 2 (contested)']));
  for (const dw of [1, 2, 3, 4, 5]) {
    const slice = all.filter(r => r.dw === dw);
    if (slice.length === 0) continue;
    const clean = summarize(slice.filter(r => r.agW === 0));
    const one   = summarize(slice.filter(r => r.agW === 1));
    const cont  = summarize(slice.filter(r => r.agW >= 2));
    out.push(`| Δw=${dw}+ (N=${slice.length}) | ${fmt(clean)} | ${fmt(one)} | ${fmt(cont)} |`);
  }
  out.push('');
  out.push('### §2b. Within each Δq level — split by `qAg`');
  out.push('');
  out.push(mdHeader(['Δq', 'qAg = 0 (clean)', 'qAg = 1', 'qAg ≥ 2 (contested)']));
  for (const dq of [1, 2, 3, 4, 5]) {
    const slice = all.filter(r => r.dq === dq);
    if (slice.length === 0) continue;
    const clean = summarize(slice.filter(r => r.qAg === 0));
    const one   = summarize(slice.filter(r => r.qAg === 1));
    const cont  = summarize(slice.filter(r => r.qAg >= 2));
    out.push(`| Δq=${dq} (N=${slice.length}) | ${fmt(clean)} | ${fmt(one)} | ${fmt(cont)} |`);
  }
  out.push('');
  out.push('### §2c. Within each Σ level — split by total opposition `(agW + qAg)`');
  out.push('');
  out.push(mdHeader(['Σ', 'opp = 0 (clean)', 'opp = 1', 'opp = 2', 'opp ≥ 3 (heavy)']));
  for (const s of [3, 4, 5, 6, 7, 8]) {
    const slice = all.filter(r => r.sum === s);
    if (slice.length === 0) continue;
    const o0 = summarize(slice.filter(r => (r.agW + r.qAg) === 0));
    const o1 = summarize(slice.filter(r => (r.agW + r.qAg) === 1));
    const o2 = summarize(slice.filter(r => (r.agW + r.qAg) === 2));
    const o3 = summarize(slice.filter(r => (r.agW + r.qAg) >= 3));
    out.push(`| Σ=${s} (N=${slice.length}) | ${fmt(o0)} | ${fmt(o1)} | ${fmt(o2)} | ${fmt(o3)} |`);
  }
  out.push('');
  out.push('Cells: \`N · W-L · WR · flat ROI\`. Right-shift = more opposition. If the right column is materially worse than the left at the same Σ, opposition is a real separator.');
  out.push('');

  // ════════════════════════════════════════════════════════════════════
  // §3. (Δw × agW) cross-tab
  // ════════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §3. (Δw × agW) cross-tab — full matrix');
  out.push('');
  out.push('Each cell shows N · WR · flat ROI. Read down a column to see how each level of opposition performs across margins; read across to see how each margin scales with opposition.');
  out.push('');
  const dwLevels = [...new Set(all.map(r => r.dw))].filter(v => v >= 0).sort((a, b) => a - b);
  const agwLevels = [...new Set(all.map(r => r.agW))].sort((a, b) => a - b);
  out.push(mdHeader(['Δw \\\\ agW', ...agwLevels.map(a => `agW=${a}`), 'row total']));
  for (const dw of dwLevels) {
    const rowCells = [];
    let rowTotal = [];
    for (const a of agwLevels) {
      const cell = all.filter(r => r.dw === dw && r.agW === a);
      rowTotal = rowTotal.concat(cell);
      if (cell.length === 0) { rowCells.push('—'); continue; }
      const s = summarize(cell);
      rowCells.push(`${s.n} · ${pct(s.wr, 0)} · ${sign(s.flatRoi, 0)}%`);
    }
    const tot = summarize(rowTotal);
    out.push(`| **Δw=${dw}** | ${rowCells.join(' | ')} | ${fmt(tot)} |`);
  }
  out.push('');

  // ════════════════════════════════════════════════════════════════════
  // §4. (Δq × qAg) cross-tab
  // ════════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §4. (Δq × qAg) cross-tab');
  out.push('');
  const dqLevels = [...new Set(all.map(r => r.dq))].filter(v => v >= 0).sort((a, b) => a - b);
  const qagLevels = [...new Set(all.map(r => r.qAg))].sort((a, b) => a - b);
  out.push(mdHeader(['Δq \\\\ qAg', ...qagLevels.map(a => `qAg=${a}`), 'row total']));
  for (const dq of dqLevels) {
    const rowCells = [];
    let rowTotal = [];
    for (const a of qagLevels) {
      const cell = all.filter(r => r.dq === dq && r.qAg === a);
      rowTotal = rowTotal.concat(cell);
      if (cell.length === 0) { rowCells.push('—'); continue; }
      const s = summarize(cell);
      rowCells.push(`${s.n} · ${pct(s.wr, 0)} · ${sign(s.flatRoi, 0)}%`);
    }
    const tot = summarize(rowTotal);
    out.push(`| **Δq=${dq}** | ${rowCells.join(' | ')} | ${fmt(tot)} |`);
  }
  out.push('');

  // ════════════════════════════════════════════════════════════════════
  // §5. Dominance ratios — winner-side share of total whales
  // ════════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §5. Dominance ratios');
  out.push('');
  out.push('`winnerDom` = forW / (forW + agW) — what fraction of proven whales are with us. Same for quality. Ratios collapse the (forW, agW) plane to one number that\'s scale-free.');
  out.push('');
  const withDom = all.filter(r => (r.forW + r.agW) > 0);
  const withQDom = all.filter(r => (r.qFor + r.qAg) > 0);
  out.push('### §5a. winner-dominance bins (forW / (forW + agW))');
  out.push('');
  out.push(mdHeader(['winnerDom', 'cohort']));
  for (const [lo, hi, label] of [[0, 0.5, '< 50% (minority pick)'], [0.5, 0.75, '50–75%'], [0.75, 1.0, '75–100%'], [1.0, 1.001, '= 100% (no proven opposition)']]) {
    const slice = withDom.filter(r => {
      const d = r.forW / (r.forW + r.agW);
      return d >= lo && d < hi;
    });
    out.push(`| ${label} | ${fmt(summarize(slice))} |`);
  }
  out.push('');
  out.push('### §5b. quality-dominance bins (qFor / (qFor + qAg))');
  out.push('');
  out.push(mdHeader(['qualityDom', 'cohort']));
  for (const [lo, hi, label] of [[0, 0.5, '< 50%'], [0.5, 0.75, '50–75%'], [0.75, 1.0, '75–100%'], [1.0, 1.001, '= 100% (no quality opposition)']]) {
    const slice = withQDom.filter(r => {
      const d = r.qFor / (r.qFor + r.qAg);
      return d >= lo && d < hi;
    });
    out.push(`| ${label} | ${fmt(summarize(slice))} |`);
  }
  out.push('');

  // ════════════════════════════════════════════════════════════════════
  // §6. Logistic regression — does opposition lift fit beyond margins?
  // ════════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §6. Logistic regression — opposition incremental fit');
  out.push('');
  out.push('Three nested models on outcome ∈ {0, 1}. All features z-scored before fit. McFadden pseudo-R² shows incremental explanatory power. If model B (margins+opposition) noticeably beats model A (margins only), opposition adds signal.');
  out.push('');
  // Build feature matrices
  const yBin = all.map(r => r.won);
  const dwZ = zscore(all.map(r => r.dw));
  const dqZ = zscore(all.map(r => r.dq));
  const sumZ = zscore(all.map(r => r.sum));
  const forWZ = zscore(all.map(r => r.forW));
  const agWZ = zscore(all.map(r => r.agW));
  const qForZ = zscore(all.map(r => r.qFor));
  const qAgZ = zscore(all.map(r => r.qAg));

  const modelA = logreg(all.map((_, i) => [dwZ[i], dqZ[i]]), yBin);
  const modelB = logreg(all.map((_, i) => [dwZ[i], dqZ[i], agWZ[i], qAgZ[i]]), yBin);
  const modelC = logreg(all.map((_, i) => [forWZ[i], agWZ[i], qForZ[i], qAgZ[i]]), yBin);

  out.push('### §6a. Model A — baseline (margins only)');
  out.push('');
  out.push(`Features: \`Δw, Δq\`  · McFadden R² = **${modelA.mcfaddenR2.toFixed(3)}**`);
  out.push('');
  out.push(`- β(Δw) = ${modelA.w[0].toFixed(3)}  ·  β(Δq) = ${modelA.w[1].toFixed(3)}  ·  intercept = ${modelA.b.toFixed(3)}`);
  out.push('');
  out.push('### §6b. Model B — margins + opposition');
  out.push('');
  out.push(`Features: \`Δw, Δq, agW, qAg\`  · McFadden R² = **${modelB.mcfaddenR2.toFixed(3)}**`);
  out.push('');
  out.push(`- β(Δw) = ${modelB.w[0].toFixed(3)}  ·  β(Δq) = ${modelB.w[1].toFixed(3)}  ·  β(agW) = ${modelB.w[2].toFixed(3)}  ·  β(qAg) = ${modelB.w[3].toFixed(3)}  ·  intercept = ${modelB.b.toFixed(3)}`);
  out.push('');
  out.push('### §6c. Model C — raw counts (no margins)');
  out.push('');
  out.push(`Features: \`forW, agW, qFor, qAg\`  · McFadden R² = **${modelC.mcfaddenR2.toFixed(3)}**`);
  out.push('');
  out.push(`- β(forW) = ${modelC.w[0].toFixed(3)}  ·  β(agW) = ${modelC.w[1].toFixed(3)}  ·  β(qFor) = ${modelC.w[2].toFixed(3)}  ·  β(qAg) = ${modelC.w[3].toFixed(3)}  ·  intercept = ${modelC.b.toFixed(3)}`);
  out.push('');
  const liftBoverA = modelB.mcfaddenR2 - modelA.mcfaddenR2;
  out.push(`**Δ R² (B − A) = ${liftBoverA >= 0 ? '+' : ''}${liftBoverA.toFixed(3)}.** ${liftBoverA > 0.005 ? 'Opposition adds non-trivial fit beyond the margins.' : 'Adding opposition counts barely moves the model — most of the predictive signal is already captured by Δw and Δq.'}`);
  out.push('');

  // ════════════════════════════════════════════════════════════════════
  // §7. Opposition-gated v7.1 floor candidates
  // ════════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §7. Opposition-gated v7.1 floor candidates');
  out.push('');
  out.push('What if v7.0 (\`Σ ≥ +5\`) added an opposition gate? Each row below is a candidate floor; metrics are over the same dashboard-truth sample. The "lift vs Σ≥+5" column compares flat ROI against the v7.0 baseline.');
  out.push('');
  const baseline = all.filter(r => r.dw >= 1 && r.dq >= 1 && r.sum >= 5);
  const baseS = summarize(baseline);
  const candidates = [
    { label: 'v7.0 baseline (Σ ≥ +5)',                           f: r => r.dw >= 1 && r.dq >= 1 && r.sum >= 5 },
    { label: 'Σ ≥ +5 ∧ agW = 0',                                 f: r => r.dw >= 1 && r.dq >= 1 && r.sum >= 5 && r.agW === 0 },
    { label: 'Σ ≥ +5 ∧ agW ≤ 1',                                 f: r => r.dw >= 1 && r.dq >= 1 && r.sum >= 5 && r.agW <= 1 },
    { label: 'Σ ≥ +5 ∧ qAg = 0',                                 f: r => r.dw >= 1 && r.dq >= 1 && r.sum >= 5 && r.qAg === 0 },
    { label: 'Σ ≥ +5 ∧ qAg ≤ 1',                                 f: r => r.dw >= 1 && r.dq >= 1 && r.sum >= 5 && r.qAg <= 1 },
    { label: 'Σ ≥ +5 ∧ (agW + qAg) ≤ 1',                          f: r => r.dw >= 1 && r.dq >= 1 && r.sum >= 5 && (r.agW + r.qAg) <= 1 },
    { label: 'Σ ≥ +5 ∧ (agW + qAg) = 0  (strict clean lock)',     f: r => r.dw >= 1 && r.dq >= 1 && r.sum >= 5 && (r.agW + r.qAg) === 0 },
    { label: 'Σ ≥ +4 ∧ agW = 0 (rescue floor with clean gate)',   f: r => r.dw >= 1 && r.dq >= 1 && r.sum >= 4 && r.agW === 0 },
    { label: 'Σ ≥ +4 ∧ qAg = 0',                                  f: r => r.dw >= 1 && r.dq >= 1 && r.sum >= 4 && r.qAg === 0 },
    { label: 'Σ ≥ +3 ∧ (agW + qAg) = 0 (cleanest possible)',      f: r => r.dw >= 1 && r.dq >= 1 && r.sum >= 3 && (r.agW + r.qAg) === 0 },
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
  out.push(`Reading the table: a floor that **shrinks N moderately while lifting flat ROI by ≥ +10pp** is a real win. A floor that lifts ROI but cuts N below ~15 is over-fit to noise. The v7.0 baseline is **N=${baseS.n} · ${pct(baseS.wr, 1)} WR · ${sign(baseS.flatRoi, 1)}% flat ROI**.`);
  out.push('');

  // ── verdict ──
  out.push('---');
  out.push('## §8. Verdict');
  out.push('');
  out.push('Read the report end-to-end before tightening the floor — opposition signals are noisy at small N. Sanity rules:');
  out.push('');
  out.push('1. If §1 shows ρ(agW, outcome) is near zero AND §6 ΔR² (B−A) < 0.005 → opposition is **already absorbed** by Δw. Don\'t add a gate.');
  out.push('2. If §2c shows Σ=+5 cells with opp=0 materially beating opp≥3 → opposition IS a separator at fixed Σ. Worth a floor candidate from §7.');
  out.push('3. Pick a §7 candidate only if (a) lift ≥ +10pp flat ROI, (b) N ≥ 20, (c) t-stat ≥ 1.96.');
  out.push('');

  const outPath = join(__dirname, '..', 'OPPOSITION_ANALYSIS.md');
  writeFileSync(outPath, out.join('\n'));
  console.log(`\nReport written → ${outPath}`);
  console.log('Key numbers:');
  console.log(`  Baseline (Σ≥+5): N=${baseS.n} · WR ${pct(baseS.wr, 1)} · flat ROI ${sign(baseS.flatRoi, 1)}%`);
  for (const c of candidates.slice(1, 7)) {
    const s = summarize(all.filter(c.f));
    console.log(`  ${c.label.padEnd(45)} → N=${String(s.n).padStart(3)} · WR ${pct(s.wr, 1).padStart(6)} · flat ROI ${sign(s.flatRoi, 1).padStart(6)}%${s.sig ? ' ✓' : ''}`);
  }

  process.exit(0);
})();
