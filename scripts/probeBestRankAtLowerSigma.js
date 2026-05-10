/**
 * probeBestRankAtLowerSigma.js — does the v7.1-candidate ΔbestRank ≥ +10
 * gate rescue any picks from the LEAN cohort (Σ ∈ {3, 4})?
 *
 * Same dashboard-truth loader and aggregation logic as
 * scripts/rankWeightedAnalysis.js, just zoomed in on the lower Σ slices.
 *
 * Local-only — prints a markdown-shaped summary to stdout.
 */

import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
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
const sign = (v, d = 1) => v == null || Number.isNaN(v) ? '—' : (v >= 0 ? '+' : '') + v.toFixed(d);
const pct = (v, d = 1) => v == null || Number.isNaN(v) ? '—' : v.toFixed(d) + '%';

function wilson(wins, n, z = 1.96) {
  if (n === 0) return [0, 0];
  const p = wins / n;
  const denom = 1 + z * z / n;
  const center = (p + z * z / (2 * n)) / denom;
  const margin = z * Math.sqrt((p * (1 - p) + z * z / (4 * n)) / n) / denom;
  return [Math.max(0, center - margin), Math.min(1, center + margin)];
}
function mean(xs) { return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN; }
function stdev(xs) {
  if (xs.length < 2) return NaN;
  const m = mean(xs);
  return Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - 1));
}
function normCdf(z) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989422804 * Math.exp(-z * z / 2);
  let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}
function tTestVsZero(xs) {
  const n = xs.length;
  if (n < 2) return { t: null, p: null, sig: false };
  const m = mean(xs);
  const s = stdev(xs);
  if (s === 0) return { t: null, p: null, sig: false };
  const t = m / (s / Math.sqrt(n));
  const p = 2 * (1 - normCdf(Math.abs(t)));
  return { t, p, sig: p < 0.05 };
}

function aggregateBestRank(walletDetails, sideKey) {
  if (!Array.isArray(walletDetails)) return { bestRank_for: null, bestRank_ag: null, forW: 0, agW: 0 };
  let bestRank_for = null, bestRank_ag = null;
  let forW = 0, agW = 0;
  for (const w of walletDetails) {
    if (!w?.side) continue;
    const isFor = w.side === sideKey;
    if (isFor) forW++; else agW++;
    if (w.rank == null || !Number.isFinite(w.rank)) continue;
    const r = Number(w.rank);
    if (isFor) {
      if (bestRank_for == null || r < bestRank_for) bestRank_for = r;
    } else {
      if (bestRank_ag == null  || r < bestRank_ag)  bestRank_ag = r;
    }
  }
  return { bestRank_for, bestRank_ag, forW, agW };
}

async function loadPicks() {
  const rows = [];
  for (const [col] of PICK_COLS) {
    const snap = await db.collection(col).where('date', '>=', V6_CUTOVER).get();
    for (const doc of snap.docs) {
      const d = doc.data();
      const sport = d.sport || 'UNK';
      for (const [sideKey, side] of Object.entries(d.sides || {})) {
        const oc = side?.result?.outcome;
        if (oc !== 'WIN' && oc !== 'LOSS') continue;
        if (side.superseded) continue;
        if (side.health?.status === 'CANCELLED' || side.health?.status === 'MUTED') continue;
        if (side.lockStage === 'SHADOW') continue;
        const peak = side.peak || side.lock || {};
        if ((peak?.stars ?? 0) < 2.5) continue;

        const odds = peak?.peakOdds ?? side.lock?.lockOdds ?? peak?.odds ?? side.lock?.odds ?? null;
        const peakUnits = peak?.units || 1;
        const won = oc === 'WIN' ? 1 : 0;
        const wd = peak?.v8Scoring?.walletDetails;

        let dw = side.v8_walletConsensusDelta != null ? Number(side.v8_walletConsensusDelta) : null;
        let dq = side.v8_walletConsensusQualityMargin != null ? Number(side.v8_walletConsensusQualityMargin) : null;
        if (dq == null && Array.isArray(wd)) {
          let qf = 0, qa = 0;
          for (const w of wd) {
            if ((w?.contribution ?? 0) < QUALITY_CUT || !w?.side) continue;
            if (w.side === sideKey) qf++; else qa++;
          }
          dq = qf - qa;
        }
        if (dw == null || dq == null) continue;

        const { bestRank_for, bestRank_ag, forW, agW } = aggregateBestRank(wd, sideKey);
        const dBestRank = (bestRank_ag ?? 999) - (bestRank_for ?? 999);

        const flat = odds != null ? flatProfit(odds, won === 1) : null;
        const peakPnl = won ? (peakUnits * (americanToDecimal(odds) - 1)) : -peakUnits;

        rows.push({
          sport, sideKey, dw, dq, sum: dw + dq,
          forW, agW, bestRank_for, bestRank_ag, dBestRank,
          odds, won, peakUnits, peakPnl,
          flat: flat ?? 0,
        });
      }
    }
  }
  return rows;
}

function summarize(rows) {
  if (!rows.length) return { n: 0 };
  const wins = rows.filter(r => r.won === 1).length;
  const losses = rows.length - wins;
  const wr = (wins / rows.length) * 100;
  const flat = rows.reduce((s, r) => s + r.flat, 0);
  const flatRoi = (flat / rows.length) * 100;
  const peak = rows.reduce((s, r) => s + r.peakPnl, 0);
  const [lo, hi] = wilson(wins, rows.length);
  const t = tTestVsZero(rows.map(r => r.flat));
  return { n: rows.length, wins, losses, wr, wrLo: lo * 100, wrHi: hi * 100, flat, flatRoi, peak, t: t.t, p: t.p, sig: t.sig };
}
function row(label, s) {
  if (!s || s.n === 0) return `| ${label} | 0 | — | — | — | — | — |`;
  return `| ${label} | ${s.n} | ${pct(s.wr, 1)} (${pct(s.wrLo, 1)}–${pct(s.wrHi, 1)}) | ${sign(s.flatRoi, 1)}%${s.sig ? ' ✓' : ''} | ${sign(s.peak, 2)}u | ${s.t != null ? s.t.toFixed(2) : '—'} | ${s.p != null ? s.p.toFixed(3) : '—'} |`;
}

(async () => {
  const all = await loadPicks();
  console.log(`# ΔbestRank gate at lower Σ — does it rescue any LEANs?\n`);
  console.log(`Loaded ${all.length} graded sides.\n`);

  console.log(`Reminder of the v7.1 candidate from the full analysis:`);
  console.log(`  Σ ≥ +5 ∧ ΔbestRank ≥ +10  →  N=27, WR 70.4%, flat ROI +55.0% ✓ (p=0.034)\n`);

  console.log(`## Σ = 3 (current LEAN cohort)\n`);
  console.log(`| Floor | N | WR (95% CI) | flat ROI | peak PnL | t | p |`);
  console.log(`|---|---|---|---|---|---|---|`);
  console.log(row('Σ = 3 (all)',                                  summarize(all.filter(r => r.sum === 3))));
  console.log(row('Σ = 3 ∧ ΔbestRank ≥ 0  (parity or better)',    summarize(all.filter(r => r.sum === 3 && r.dBestRank >= 0))));
  console.log(row('Σ = 3 ∧ ΔbestRank ≥ +10',                      summarize(all.filter(r => r.sum === 3 && r.dBestRank >= 10))));
  console.log(row('Σ = 3 ∧ ΔbestRank ≥ +50  (huge edge)',         summarize(all.filter(r => r.sum === 3 && r.dBestRank >= 50))));
  console.log(row('Σ = 3 ∧ bestRank_for ≤ 25',                    summarize(all.filter(r => r.sum === 3 && r.bestRank_for != null && r.bestRank_for <= 25))));
  console.log('');

  console.log(`## Σ = 4 (current LEAN cohort)\n`);
  console.log(`| Floor | N | WR (95% CI) | flat ROI | peak PnL | t | p |`);
  console.log(`|---|---|---|---|---|---|---|`);
  console.log(row('Σ = 4 (all)',                                  summarize(all.filter(r => r.sum === 4))));
  console.log(row('Σ = 4 ∧ ΔbestRank ≥ 0',                        summarize(all.filter(r => r.sum === 4 && r.dBestRank >= 0))));
  console.log(row('Σ = 4 ∧ ΔbestRank ≥ +10',                      summarize(all.filter(r => r.sum === 4 && r.dBestRank >= 10))));
  console.log(row('Σ = 4 ∧ ΔbestRank ≥ +50',                      summarize(all.filter(r => r.sum === 4 && r.dBestRank >= 50))));
  console.log(row('Σ = 4 ∧ bestRank_for ≤ 25',                    summarize(all.filter(r => r.sum === 4 && r.bestRank_for != null && r.bestRank_for <= 25))));
  console.log('');

  console.log(`## Σ ∈ {3, 4} combined (entire LEAN cohort)\n`);
  console.log(`| Floor | N | WR (95% CI) | flat ROI | peak PnL | t | p |`);
  console.log(`|---|---|---|---|---|---|---|`);
  console.log(row('Σ ∈ {3,4} (all)',                              summarize(all.filter(r => r.sum >= 3 && r.sum <= 4))));
  console.log(row('Σ ∈ {3,4} ∧ ΔbestRank ≥ 0',                    summarize(all.filter(r => r.sum >= 3 && r.sum <= 4 && r.dBestRank >= 0))));
  console.log(row('Σ ∈ {3,4} ∧ ΔbestRank ≥ +10',                  summarize(all.filter(r => r.sum >= 3 && r.sum <= 4 && r.dBestRank >= 10))));
  console.log(row('Σ ∈ {3,4} ∧ ΔbestRank ≥ +50',                  summarize(all.filter(r => r.sum >= 3 && r.sum <= 4 && r.dBestRank >= 50))));
  console.log(row('Σ ∈ {3,4} ∧ bestRank_for ≤ 25',                summarize(all.filter(r => r.sum >= 3 && r.sum <= 4 && r.bestRank_for != null && r.bestRank_for <= 25))));
  console.log('');

  console.log(`## Reference — Σ ≥ +5 (full LOCK cohort, repeated for context)\n`);
  console.log(`| Floor | N | WR (95% CI) | flat ROI | peak PnL | t | p |`);
  console.log(`|---|---|---|---|---|---|---|`);
  console.log(row('Σ ≥ +5 (all, v7.0 baseline)',                  summarize(all.filter(r => r.sum >= 5))));
  console.log(row('Σ ≥ +5 ∧ ΔbestRank ≥ +10 (v7.1 candidate)',    summarize(all.filter(r => r.sum >= 5 && r.dBestRank >= 10))));
  console.log('');

  console.log(`## Combined v7.1 candidate — "Σ ≥ +5 OR (Σ ∈ {3,4} ∧ ΔbestRank ≥ +10)"\n`);
  console.log(`If the gate rescues lower-Σ picks, this combined floor would be the right v7.1 lock universe.\n`);
  console.log(`| Floor | N | WR (95% CI) | flat ROI | peak PnL | t | p |`);
  console.log(`|---|---|---|---|---|---|---|`);
  console.log(row('Σ ≥ +5  (baseline LOCK)',                                                summarize(all.filter(r => r.sum >= 5))));
  console.log(row('Σ ≥ +5  ∧ ΔbestRank ≥ +10',                                              summarize(all.filter(r => r.sum >= 5 && r.dBestRank >= 10))));
  console.log(row('Σ ≥ +5 OR (Σ∈{3,4} ∧ ΔbestRank ≥ +10)  → expand candidate',              summarize(all.filter(r => r.sum >= 5 || (r.sum >= 3 && r.sum <= 4 && r.dBestRank >= 10)))));
  console.log(row('Σ ≥ +5 OR (Σ∈{3,4} ∧ ΔbestRank ≥ +50)',                                  summarize(all.filter(r => r.sum >= 5 || (r.sum >= 3 && r.sum <= 4 && r.dBestRank >= 50)))));
  console.log('');

  process.exit(0);
})();
