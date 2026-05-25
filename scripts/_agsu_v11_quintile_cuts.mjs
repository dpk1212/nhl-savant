// scripts/_agsu_v11_quintile_cuts.mjs
// Quick utility: compute v11 score distribution + quintile cuts on the full sample.
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');

const V6_CUTOVER = '2026-04-18';
const HIST_START = '2025-01-01';

if (!admin.apps.length) {
  const sakPath = join(REPO_ROOT, 'serviceAccountKey.json');
  if (existsSync(sakPath)) {
    admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(sakPath, 'utf8'))) });
  }
}
const db = admin.firestore();

// v11 coefficients from deep lab
const W = { intercept: 0.0887, dCount: 0.5371, dHcSizeRatio: 0.2787, dSumRankNorm: -0.2740, dWinnerCtPreA: -0.1916 };
const NORM = {
  dCount:        { mean: 1.1237, sd: 1.4971 },
  dHcSizeRatio:  { mean: 1.2031, sd: 5.4462 },
  dSumRankNorm:  { mean: 62.3701, sd: 91.0889 },
  dWinnerCtPreA: { mean: 0.6685, sd: 1.1208 },
};

async function loadProfiles() { const m = new Map(); const s = await db.collection('sharpWalletProfiles').get(); for (const d of s.docs) m.set(d.id, d.data()); return m; }
async function loadAllPicks() {
  const cols = ['sharpFlowPicks', 'sharpFlowSpreads', 'sharpFlowTotals'];
  const all = [];
  for (const col of cols) {
    const snap = await db.collection(col).where('date', '>=', HIST_START).get();
    for (const docSnap of snap.docs) {
      const d = docSnap.data();
      const sides = d.sides || {};
      const sport = d.sport || 'UNK'; const date = d.date;
      for (const [sideKey, side] of Object.entries(sides)) {
        const oc = side?.result?.outcome;
        if (oc !== 'WIN' && oc !== 'LOSS') continue;
        const peak = side.peak || side.lock || {};
        const wd = peak?.v8Scoring?.walletDetails;
        if (!Array.isArray(wd) || wd.length === 0) continue;
        all.push({ date, sport, sideKey, y: oc === 'WIN' ? 1 : 0, walletDetails: wd });
      }
    }
  }
  all.sort((a, b) => a.date.localeCompare(b.date));
  return all;
}
function buildHist(all) {
  const w = new Map();
  for (const p of all) for (const d of p.walletDetails) {
    if (!d?.wallet || !d?.side) continue;
    const won = (d.side === p.sideKey ? p.y === 1 : p.y === 0) ? 1 : 0;
    if (!w.has(d.wallet)) w.set(d.wallet, []);
    w.get(d.wallet).push({ date: p.date, sport: p.sport, won });
  }
  for (const arr of w.values()) arr.sort((a, b) => a.date.localeCompare(b.date));
  return w;
}
function preWr(history, date) {
  let n = 0, wins = 0, pnl = 0;
  for (const h of history) { if (h.date >= date) break; n++; if (h.won) { wins++; pnl += 0.91; } else { pnl -= 1; } }
  return n === 0 ? null : { n, wr: wins / n, flatRoi: pnl / n };
}
const isProven = (profiles, w, sport) => { const t = profiles.get(w)?.bySport?.[sport]?.whitelistTier; return t === 'CONFIRMED' || t === 'FLAT'; };
const isHc = (profiles, w, sport, sr) => profiles.get(w)?.bySport?.[sport]?.whitelistTier === 'CONFIRMED' && Number(sr) >= 0.10;

function computeAgg(p, profiles, hist) {
  let fCount = 0, aCount = 0, fHcSR = 0, aHcSR = 0, fRN = 0, aRN = 0, fW = 0, aW = 0;
  for (const w of p.walletDetails) {
    if (!w?.wallet || !w?.side) continue;
    if (!isProven(profiles, w.wallet, p.sport)) continue;
    const isF = w.side === p.sideKey;
    if (isF) fCount++; else aCount++;
    if (isHc(profiles, w.wallet, p.sport, w.sizeRatio)) {
      const sr = Number(w.sizeRatio) || 0;
      if (isF) fHcSR += sr; else aHcSR += sr;
    }
    const rn = Number(w.rankNorm) || 0;
    if (isF) fRN += rn; else aRN += rn;
    const h = hist.get(w.wallet) || [];
    const ah = preWr(h, p.date);
    if (ah && ah.n >= 5 && ah.flatRoi > 0) { if (isF) fW++; else aW++; }
  }
  if (fCount + aCount === 0) return null;
  return { dCount: fCount - aCount, dHcSizeRatio: fHcSR - aHcSR, dSumRankNorm: fRN - aRN, dWinnerCtPreA: fW - aW };
}
const z = (v, k) => (v - NORM[k].mean) / NORM[k].sd;
function score(a) {
  return W.intercept + W.dCount * z(a.dCount, 'dCount') + W.dHcSizeRatio * z(a.dHcSizeRatio, 'dHcSizeRatio')
       + W.dSumRankNorm * z(a.dSumRankNorm, 'dSumRankNorm') + W.dWinnerCtPreA * z(a.dWinnerCtPreA, 'dWinnerCtPreA');
}
function quantile(arr, q) { const s = [...arr].sort((a, b) => a - b); const idx = (s.length - 1) * q; const lo = Math.floor(idx), hi = Math.ceil(idx); return lo === hi ? s[lo] : s[lo] + (s[hi] - s[lo]) * (idx - lo); }

(async () => {
  const profiles = await loadProfiles();
  const all = await loadAllPicks();
  const hist = buildHist(all);
  const scores = [];
  for (const p of all) {
    if (p.date < V6_CUTOVER) continue;
    const a = computeAgg(p, profiles, hist);
    if (!a) continue;
    scores.push(score(a));
  }
  console.log(`n=${scores.length}`);
  console.log(`min=${Math.min(...scores).toFixed(3)}  max=${Math.max(...scores).toFixed(3)}  mean=${(scores.reduce((s,x)=>s+x,0)/scores.length).toFixed(3)}`);
  console.log(`q05=${quantile(scores, 0.05).toFixed(4)}`);
  console.log(`q10=${quantile(scores, 0.10).toFixed(4)}`);
  console.log(`q20=${quantile(scores, 0.20).toFixed(4)}`);
  console.log(`q40=${quantile(scores, 0.40).toFixed(4)}`);
  console.log(`q50=${quantile(scores, 0.50).toFixed(4)}`);
  console.log(`q60=${quantile(scores, 0.60).toFixed(4)}`);
  console.log(`q80=${quantile(scores, 0.80).toFixed(4)}`);
  console.log(`q90=${quantile(scores, 0.90).toFixed(4)}`);
  console.log(`q95=${quantile(scores, 0.95).toFixed(4)}`);
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
