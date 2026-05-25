// scripts/_agsu_deep_feature_lab.mjs
//
// AGS-U DEEP FEATURE LAB — exhaustive strict-causal feature search
// ────────────────────────────────────────────────────────────────────────────
// Tests ~50 candidate features against universal win/loss. All features use
// LEAKAGE-FREE inputs:
//   1. walletDetail fields frozen at scoring time (roi, pnl, rank, roiNorm,
//      pnlNorm, rankNorm, walletBase, sizeRatio, convictionMult, contribution)
//   2. Strict pre-D featured-pick stats (each wallet's wins/losses/wr/flatRoi
//      from picks settled BEFORE the test pick's date)
//
// Feature families tested:
//   A. Existing v10 baseline: dCount, dHcCount, dConvictionAvg, dHcSizeRatio, forContribShare
//   B. Sum/avg/max ROI: dSumRoi, dAvgRoi, dMaxRoi (frozen + pre-D variants)
//   C. Sum/avg/max PnL: dSumPnl, dAvgPnl, dMaxPnl
//   D. Combined W/L: dSumWins, dSumLosses, dSumWMinusL (the user's ask)
//   E. Rank-based: dSumRankNorm, dMaxRankNorm, dMinRank, dLeaderboardCount
//   F. Side indicators: bestRoiOnFor, bestRankOnFor, bestPnlOnFor (binary)
//   G. Top-N consensus: top1RoiFor, top3RoiFor minus AGAINST equivalents
//   H. HC variants: dHcSumRoi, dHcAvgRoi, dHcSumPnl, dHcSumRankNorm, dHcSumWr,
//      dHcSumFlatRoi (pre-D), dHcWinnerCount
//   I. Cross-source: dCombinedRoi (avg of pre-D flatRoi and frozen Source B roi)
//   J. Top-level (any-sport) profile aggregates already tested in prior lab
// ────────────────────────────────────────────────────────────────────────────
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync, writeFileSync } from 'fs';
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

// ─── data loaders ─────────────────────────────────────────────────────────
async function loadProfiles() {
  const m = new Map();
  const snap = await db.collection('sharpWalletProfiles').get();
  for (const d of snap.docs) m.set(d.id, d.data());
  return m;
}
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
        const oddsRaw = peak.odds ?? side.odds ?? side.result?.odds ?? null;
        let oddsDec = 1.91;
        if (oddsRaw != null) {
          const v = Number(oddsRaw);
          if (Number.isFinite(v)) {
            if (v > 100) oddsDec = (v / 100) + 1;
            else if (v < -100) oddsDec = 1 + (100 / Math.abs(v));
            else if (v > 1.01 && v < 10) oddsDec = v;
          }
        }
        all.push({ date, sport, market: col, sideKey, y: oc === 'WIN' ? 1 : 0, walletDetails: wd, oddsDec });
      }
    }
  }
  all.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  return all;
}
function buildWalletHistory(all) {
  const wallets = new Map();
  for (const p of all) {
    for (const w of p.walletDetails) {
      if (!w?.wallet || !w?.side) continue;
      const wonForWallet = (w.side === p.sideKey ? p.y === 1 : p.y === 0);
      const pnl = wonForWallet ? (p.oddsDec - 1) : -1;
      if (!wallets.has(w.wallet)) wallets.set(w.wallet, []);
      wallets.get(w.wallet).push({ date: p.date, sport: p.sport, won: wonForWallet ? 1 : 0, pnl });
    }
  }
  for (const arr of wallets.values()) arr.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  return wallets;
}
function preDStats(history, date, sport = null) {
  let wins = 0, n = 0, pnl = 0;
  for (const h of history) {
    if (h.date >= date) break;
    if (sport && h.sport !== sport) continue;
    n += 1; if (h.won) wins += 1; pnl += h.pnl;
  }
  if (n === 0) return null;
  return { n, wins, losses: n - wins, wr: wins / n, flatRoi: pnl / n, flatPnl: pnl };
}
function isProven(profiles, w, sport) {
  const t = profiles.get(w)?.bySport?.[sport]?.whitelistTier;
  return t === 'CONFIRMED' || t === 'FLAT';
}
function isHc(profiles, w, sport, sizeRatio) {
  return profiles.get(w)?.bySport?.[sport]?.whitelistTier === 'CONFIRMED' && Number(sizeRatio) >= 0.10;
}

// ─── per-pick wallet enrichment ─────────────────────────────────────────
function enrichSplit(p, profiles, walletsHist) {
  const F = [], A = [];
  for (const wd of p.walletDetails) {
    if (!wd?.wallet || !wd?.side) continue;
    if (!isProven(profiles, wd.wallet, p.sport)) continue;
    const hist = walletsHist.get(wd.wallet) || [];
    const preS = preDStats(hist, p.date, p.sport);
    const preA = preDStats(hist, p.date, null);
    const obj = {
      wallet: wd.wallet,
      // walletDetail frozen (no leakage)
      invested: Number(wd.invested) || 0,
      roi: Number(wd.roi) || 0,
      pnl: Number(wd.pnl) || 0,
      rank: Number(wd.rank) || null,
      hasLeaderboardRank: Number.isFinite(Number(wd.rank)) && Number(wd.rank) > 0,
      roiNorm: Number(wd.roiNorm) || 0,
      pnlNorm: Number(wd.pnlNorm) || 0,
      rankNorm: Number(wd.rankNorm) || 0,
      walletBase: Number(wd.walletBase) || 50,
      sizeRatio: Number(wd.sizeRatio) || 1,
      convictionMult: Number(wd.convictionMult) || 1,
      contribution: Number(wd.contribution) || 0,
      isHc: isHc(profiles, wd.wallet, p.sport, wd.sizeRatio),
      // strict pre-D
      preSN:       preS?.n        || 0,
      preSWins:    preS?.wins     || 0,
      preSLosses:  preS?.losses   || 0,
      preSWr:      preS?.wr       || 0,
      preSFlatRoi: preS?.flatRoi  || 0,
      preSFlatPnl: preS?.flatPnl  || 0,
      preAN:       preA?.n        || 0,
      preAWins:    preA?.wins     || 0,
      preALosses:  preA?.losses   || 0,
      preAWr:      preA?.wr       || 0,
      preAFlatRoi: preA?.flatRoi  || 0,
      preAFlatPnl: preA?.flatPnl  || 0,
    };
    (wd.side === p.sideKey ? F : A).push(obj);
  }
  return { F, A };
}

// ─── helpers ────────────────────────────────────────────────────────────
const sum = (arr, fn) => arr.reduce((s, w) => s + (Number(fn(w)) || 0), 0);
const avg = (arr, fn) => arr.length ? sum(arr, fn) / arr.length : 0;
const maxOr = (arr, fn, def = 0) => arr.length ? arr.reduce((m, w) => Math.max(m, Number(fn(w)) || -Infinity), -Infinity) : def;
const minOr = (arr, fn, def = 999999) => arr.length ? arr.reduce((m, w) => {
  const v = Number(fn(w)); if (!Number.isFinite(v)) return m; return Math.min(m, v);
}, Infinity) : def;
const cnt = (arr, fn) => arr.filter(w => fn(w)).length;
const hc = (arr) => arr.filter(w => w.isHc);

// ─── FEATURE DEFINITIONS ────────────────────────────────────────────────
const FEATURES = {
  // ── A. Existing v10 baseline ──────────────────────────────────────
  dCount:          ({ F, A }) => F.length - A.length,
  dConvictionAvg:  ({ F, A }) => avg(F, w => w.convictionMult) - avg(A, w => w.convictionMult),
  dHcCount:        ({ F, A }) => hc(F).length - hc(A).length,
  dHcSizeRatio:    ({ F, A }) => sum(hc(F), w => w.sizeRatio) - sum(hc(A), w => w.sizeRatio),
  forContribShare: ({ F, A }) => { const t = sum(F, w => w.contribution) + sum(A, w => w.contribution); return t > 0 ? sum(F, w => w.contribution) / t : 0.5; },

  // ── B. ROI (Source B aggregate, frozen on walletDetail) ──────────
  dSumRoi:        ({ F, A }) => sum(F, w => w.roi) - sum(A, w => w.roi),
  dAvgRoi:        ({ F, A }) => avg(F, w => w.roi) - avg(A, w => w.roi),
  dMaxRoi:        ({ F, A }) => maxOr(F, w => w.roi, 0) - maxOr(A, w => w.roi, 0),
  dSumRoiNorm:    ({ F, A }) => sum(F, w => w.roiNorm) - sum(A, w => w.roiNorm),
  dAvgRoiNorm:    ({ F, A }) => avg(F, w => w.roiNorm) - avg(A, w => w.roiNorm),
  dMaxRoiNorm:    ({ F, A }) => maxOr(F, w => w.roiNorm, 0) - maxOr(A, w => w.roiNorm, 0),

  // ── C. PnL (Source B settledPnl, frozen) ─────────────────────────
  dSumPnl:        ({ F, A }) => sum(F, w => w.pnl) - sum(A, w => w.pnl),
  dSumPnlNorm:    ({ F, A }) => sum(F, w => w.pnlNorm) - sum(A, w => w.pnlNorm),
  dMaxPnlNorm:    ({ F, A }) => maxOr(F, w => w.pnlNorm, 0) - maxOr(A, w => w.pnlNorm, 0),

  // ── D. Combined W/L from pre-D featured picks (the user's ask) ────
  dSumPreSWins:    ({ F, A }) => sum(F, w => w.preSWins) - sum(A, w => w.preSWins),
  dSumPreSLosses:  ({ F, A }) => sum(F, w => w.preSLosses) - sum(A, w => w.preSLosses),
  dSumPreSWMinusL: ({ F, A }) => sum(F, w => w.preSWins - w.preSLosses) - sum(A, w => w.preSWins - w.preSLosses),
  dSumPreAWMinusL: ({ F, A }) => sum(F, w => w.preAWins - w.preALosses) - sum(A, w => w.preAWins - w.preALosses),
  dSumPreSN:       ({ F, A }) => sum(F, w => w.preSN) - sum(A, w => w.preSN),
  // ROI / WR from pre-D featured picks
  dSumPreSFlatRoi: ({ F, A }) => sum(F, w => w.preSFlatRoi) - sum(A, w => w.preSFlatRoi),
  dAvgPreSFlatRoi: ({ F, A }) => avg(F, w => w.preSFlatRoi) - avg(A, w => w.preSFlatRoi),
  dSumPreSFlatPnl: ({ F, A }) => sum(F, w => w.preSFlatPnl) - sum(A, w => w.preSFlatPnl),
  dSumPreSWr:      ({ F, A }) => sum(F, w => w.preSWr) - sum(A, w => w.preSWr),
  dAvgPreSWr:      ({ F, A }) => avg(F, w => w.preSWr) - avg(A, w => w.preSWr),
  dSumPreAFlatRoi: ({ F, A }) => sum(F, w => w.preAFlatRoi) - sum(A, w => w.preAFlatRoi),
  dAvgPreAFlatRoi: ({ F, A }) => avg(F, w => w.preAFlatRoi) - avg(A, w => w.preAFlatRoi),
  dAvgPreAWr:      ({ F, A }) => avg(F, w => w.preAWr) - avg(A, w => w.preAWr),
  // Winner counts
  dWinnerCtPreS:   ({ F, A }) => cnt(F, w => w.preSN >= 3 && w.preSFlatRoi > 0) - cnt(A, w => w.preSN >= 3 && w.preSFlatRoi > 0),
  dWinnerCtPreA:   ({ F, A }) => cnt(F, w => w.preAN >= 5 && w.preAFlatRoi > 0) - cnt(A, w => w.preAN >= 5 && w.preAFlatRoi > 0),
  dWinnerCtPreA10: ({ F, A }) => cnt(F, w => w.preAN >= 5 && w.preAFlatRoi > 10) - cnt(A, w => w.preAN >= 5 && w.preAFlatRoi > 10),

  // ── E. Rank-based (lower rank = better, but rankNorm inverts so higher = better) ──
  dSumRankNorm:    ({ F, A }) => sum(F, w => w.rankNorm) - sum(A, w => w.rankNorm),
  dMaxRankNorm:    ({ F, A }) => maxOr(F, w => w.rankNorm, 0) - maxOr(A, w => w.rankNorm, 0),
  dAvgRankNorm:    ({ F, A }) => avg(F, w => w.rankNorm) - avg(A, w => w.rankNorm),
  dLeaderboardCt:  ({ F, A }) => cnt(F, w => w.hasLeaderboardRank) - cnt(A, w => w.hasLeaderboardRank),
  dSumLbWalletsByRank:({ F, A }) => {
    // For wallets that have rank, sum of (101 - rank) — bigger weight to higher ranks
    return sum(F.filter(w => w.hasLeaderboardRank), w => Math.max(0, 101 - w.rank)) -
           sum(A.filter(w => w.hasLeaderboardRank), w => Math.max(0, 101 - w.rank));
  },

  // ── F. Side indicators (binary 0/1) — which side has the best wallet ──
  bestRoiOnFor:    ({ F, A }) => { const fb = maxOr(F, w => w.roi, -Infinity); const ab = maxOr(A, w => w.roi, -Infinity); return fb > ab ? 1 : (fb < ab ? -1 : 0); },
  bestPnlOnFor:    ({ F, A }) => { const fb = maxOr(F, w => w.pnl, -Infinity); const ab = maxOr(A, w => w.pnl, -Infinity); return fb > ab ? 1 : (fb < ab ? -1 : 0); },
  bestRankOnFor:   ({ F, A }) => { const fb = maxOr(F.filter(w => w.hasLeaderboardRank), w => w.rankNorm, -Infinity); const ab = maxOr(A.filter(w => w.hasLeaderboardRank), w => w.rankNorm, -Infinity); return fb > ab ? 1 : (fb < ab ? -1 : 0); },
  bestContribOnFor:({ F, A }) => { const fb = maxOr(F, w => w.contribution, -Infinity); const ab = maxOr(A, w => w.contribution, -Infinity); return fb > ab ? 1 : (fb < ab ? -1 : 0); },
  bestPreSRoiOnFor:({ F, A }) => { const fb = maxOr(F.filter(w => w.preSN >= 3), w => w.preSFlatRoi, -Infinity); const ab = maxOr(A.filter(w => w.preSN >= 3), w => w.preSFlatRoi, -Infinity); return fb > ab ? 1 : (fb < ab ? -1 : 0); },

  // ── G. Top-N consensus (best 3 wallets each side) ────────────────
  top3DeltaRoi: ({ F, A }) => {
    const top3 = (arr) => [...arr].sort((a, b) => b.roi - a.roi).slice(0, 3);
    return sum(top3(F), w => w.roi) - sum(top3(A), w => w.roi);
  },
  top3DeltaRankNorm: ({ F, A }) => {
    const top3 = (arr) => [...arr].sort((a, b) => b.rankNorm - a.rankNorm).slice(0, 3);
    return sum(top3(F), w => w.rankNorm) - sum(top3(A), w => w.rankNorm);
  },
  top3DeltaPreSRoi: ({ F, A }) => {
    const top3 = (arr) => [...arr].sort((a, b) => b.preSFlatRoi - a.preSFlatRoi).slice(0, 3);
    return sum(top3(F), w => w.preSFlatRoi) - sum(top3(A), w => w.preSFlatRoi);
  },

  // ── H. HC variants (CONFIRMED tier + sizeRatio ≥ HC_RATIO) ────────
  dHcSumRoi:        ({ F, A }) => sum(hc(F), w => w.roi) - sum(hc(A), w => w.roi),
  dHcAvgRoi:        ({ F, A }) => avg(hc(F), w => w.roi) - avg(hc(A), w => w.roi),
  dHcSumPnl:        ({ F, A }) => sum(hc(F), w => w.pnl) - sum(hc(A), w => w.pnl),
  dHcSumRankNorm:   ({ F, A }) => sum(hc(F), w => w.rankNorm) - sum(hc(A), w => w.rankNorm),
  dHcSumPreSFlatRoi:({ F, A }) => sum(hc(F), w => w.preSFlatRoi) - sum(hc(A), w => w.preSFlatRoi),
  dHcAvgPreSWr:     ({ F, A }) => avg(hc(F), w => w.preSWr) - avg(hc(A), w => w.preSWr),
  dHcSumPreSWMinusL:({ F, A }) => sum(hc(F), w => w.preSWins - w.preSLosses) - sum(hc(A), w => w.preSWins - w.preSLosses),
  dHcWinnerCt:      ({ F, A }) => cnt(hc(F), w => w.preSN >= 3 && w.preSFlatRoi > 0) - cnt(hc(A), w => w.preSN >= 3 && w.preSFlatRoi > 0),
  dHcContribShare:  ({ F, A }) => { const t = sum(hc(F), w => w.contribution) + sum(hc(A), w => w.contribution); return t > 0 ? sum(hc(F), w => w.contribution) / t : 0.5; },

  // ── I. Cross-source ensemble ──────────────────────────────────────
  dCombinedRoiAvg:  ({ F, A }) => avg(F, w => 0.5 * (w.roi + w.preSFlatRoi)) - avg(A, w => 0.5 * (w.roi + w.preSFlatRoi)),
  dCombinedQuality: ({ F, A }) => avg(F, w => 0.5 * (w.roiNorm + w.preSWr * 100)) - avg(A, w => 0.5 * (w.roiNorm + w.preSWr * 100)),

  // ── J. Size × quality interactions ───────────────────────────────
  dSumRoiSize:      ({ F, A }) => sum(F, w => w.roi * w.sizeRatio) - sum(A, w => w.roi * w.sizeRatio),
  dSumPreSRoiSize:  ({ F, A }) => sum(F, w => w.preSFlatRoi * w.sizeRatio) - sum(A, w => w.preSFlatRoi * w.sizeRatio),
};
const FEATURE_NAMES = Object.keys(FEATURES);

function computeFeatures(p, profiles, wallets) {
  const split = enrichSplit(p, profiles, wallets);
  const out = {};
  for (const k of FEATURE_NAMES) out[k] = Number(FEATURES[k](split)) || 0;
  out.__nWallets = split.F.length + split.A.length;
  return out;
}

// ─── stats / fit helpers ────────────────────────────────────────────────
const mean = a => a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0;
const variance = a => { if (a.length < 2) return 0; const m = mean(a); return a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1); };
const sd = a => Math.sqrt(variance(a));
function ranks(v) {
  const idx = v.map((x, i) => ({ x, i })); idx.sort((a, b) => a.x - b.x);
  const r = new Array(v.length); let i = 0;
  while (i < idx.length) {
    let j = i; while (j + 1 < idx.length && idx[j + 1].x === idx[i].x) j++;
    const avg = (i + j + 2) / 2; for (let k = i; k <= j; k++) r[idx[k].i] = avg; i = j + 1;
  }
  return r;
}
function spearman(xs, ys) {
  if (!xs.length) return 0;
  const rx = ranks(xs), ry = ranks(ys); const mx = mean(rx), my = mean(ry);
  let n = 0, dx = 0, dy = 0;
  for (let i = 0; i < xs.length; i++) { const ax = rx[i] - mx, ay = ry[i] - my; n += ax * ay; dx += ax * ax; dy += ay * ay; }
  return dx > 0 && dy > 0 ? n / Math.sqrt(dx * dy) : 0;
}
function rocAuc(scores, y) {
  const idx = scores.map((s, i) => ({ s, y: y[i] })).sort((a, b) => b.s - a.s);
  let pos = 0, neg = 0, tp = 0;
  for (const r of idx) { if (r.y === 1) pos++; else { neg++; tp += pos; } }
  return pos * neg > 0 ? tp / (pos * neg) : NaN;
}
function quintileGap(scores, ys) {
  if (scores.length < 10) return NaN;
  const idx = scores.map((s, i) => ({ s, y: ys[i] })).sort((a, b) => a.s - b.s);
  const sz = Math.floor(idx.length / 5);
  const q1 = idx.slice(0, sz); const q5 = idx.slice(idx.length - sz);
  return q5.filter(p => p.y === 1).length / q5.length - q1.filter(p => p.y === 1).length / q1.length;
}
function meanSd(values) { const n = values.length; if (!n) return { mean: 0, sd: 1 }; const m = mean(values); return { mean: m, sd: sd(values) || 1 }; }
function logitL1(X, y, lambda, maxOuter = 60, maxInner = 80, tol = 1e-6) {
  const n = X.length, p = X[0].length;
  let beta = new Array(p).fill(0);
  for (let it = 0; it < maxOuter; it++) {
    const eta = X.map(row => row.reduce((s, x, j) => s + x * beta[j], 0));
    const mu  = eta.map(e => 1 / (1 + Math.exp(-Math.max(-30, Math.min(30, e)))));
    const W   = mu.map(m => Math.max(1e-6, m * (1 - m)));
    const z   = eta.map((e, i) => e + (y[i] - mu[i]) / W[i]);
    for (let inner = 0; inner < maxInner; inner++) {
      let md = 0;
      for (let j = 0; j < p; j++) {
        let numer = 0, denom = 0;
        for (let i = 0; i < n; i++) {
          let r = z[i]; for (let k = 0; k < p; k++) if (k !== j) r -= X[i][k] * beta[k];
          numer += W[i] * X[i][j] * r; denom += W[i] * X[i][j] * X[i][j];
        }
        let nb;
        if (j === 0 || lambda === 0) nb = denom > 0 ? numer / denom : 0;
        else if (numer > lambda)        nb = (numer - lambda) / denom;
        else if (numer < -lambda)       nb = (numer + lambda) / denom;
        else                            nb = 0;
        const d = nb - beta[j]; if (Math.abs(d) > md) md = Math.abs(d); beta[j] = nb;
      }
      if (md < tol) break;
    }
    const eta2 = X.map(row => row.reduce((s, x, j) => s + x * beta[j], 0));
    let ed = 0; for (let i = 0; i < n; i++) ed = Math.max(ed, Math.abs(eta2[i] - eta[i]));
    if (ed < tol) break;
  }
  return beta;
}
function fitAndCV(rows, keys, lambda, k = 5) {
  const sorted = [...rows].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  const n = sorted.length;
  const foldSz = Math.ceil(n / k);
  const oosS = []; const oosY = []; const oosSp = [];
  for (let f = 0; f < k; f++) {
    const valStart = f * foldSz, valEnd = Math.min(n, valStart + foldSz);
    const train = [...sorted.slice(0, valStart), ...sorted.slice(valEnd)];
    const val = sorted.slice(valStart, valEnd);
    if (train.length < 30 || val.length === 0) continue;
    const norm = {}; for (const k2 of keys) norm[k2] = meanSd(train.map(r => r.features[k2]));
    const X = train.map(r => [1, ...keys.map(k2 => (r.features[k2] - norm[k2].mean) / (norm[k2].sd || 1))]);
    const y = train.map(r => r.y);
    const beta = logitL1(X, y, lambda);
    for (const v of val) {
      const score = beta[0] + keys.reduce((s, k2, j) => s + beta[j + 1] * ((v.features[k2] - norm[k2].mean) / (norm[k2].sd || 1)), 0);
      oosS.push(score); oosY.push(v.y); oosSp.push(v.sport);
    }
  }
  if (!oosS.length) return null;
  const o = { auc: rocAuc(oosS, oosY), sp: spearman(oosS, oosY), q5q1: quintileGap(oosS, oosY), n: oosS.length, bySport: {} };
  for (const sp of ['MLB', 'NBA', 'NHL']) {
    const idxs = oosSp.map((s, i) => s === sp ? i : -1).filter(i => i >= 0);
    if (idxs.length < 20) continue;
    const sc = idxs.map(i => oosS[i]); const yy = idxs.map(i => oosY[i]);
    o.bySport[sp] = { n: sc.length, auc: rocAuc(sc, yy), sp: spearman(sc, yy), q5q1: quintileGap(sc, yy) };
  }
  return o;
}
function fitFull(rows, keys, lambda) {
  const norm = {}; for (const k of keys) norm[k] = meanSd(rows.map(r => r.features[k]));
  const X = rows.map(r => [1, ...keys.map(k => (r.features[k] - norm[k].mean) / (norm[k].sd || 1))]);
  const y = rows.map(r => r.y);
  return { beta: logitL1(X, y, lambda), norm };
}
const fmtPct = v => v == null || !Number.isFinite(v) ? '—' : (v * 100).toFixed(1) + '%';

async function main() {
  console.log('[deep] loading…');
  const profiles = await loadProfiles();
  const allPicks = await loadAllPicks();
  console.log(`[deep] profiles=${profiles.size}  picks=${allPicks.length}`);
  const wallets = buildWalletHistory(allPicks);

  const rows = [];
  for (const p of allPicks) {
    if (p.date < V6_CUTOVER) continue;
    const f = computeFeatures(p, profiles, wallets);
    if (f.__nWallets === 0) continue;
    rows.push({ date: p.date, sport: p.sport, market: p.market, y: p.y, features: f });
  }
  console.log(`[deep] test rows: ${rows.length} (${FEATURE_NAMES.length} features)`);
  console.log('[deep] sport counts:', { MLB: rows.filter(r => r.sport === 'MLB').length, NBA: rows.filter(r => r.sport === 'NBA').length, NHL: rows.filter(r => r.sport === 'NHL').length });

  // ─── 1. Univariate ─────────────────────────────────────────────────
  const sports = ['ALL', 'MLB', 'NBA', 'NHL'];
  const subsets = { ALL: rows, MLB: rows.filter(r => r.sport === 'MLB'), NBA: rows.filter(r => r.sport === 'NBA'), NHL: rows.filter(r => r.sport === 'NHL') };
  const uni = {};
  for (const sp of sports) {
    const slice = subsets[sp]; if (slice.length < 20) continue;
    const arr = [];
    for (const k of FEATURE_NAMES) {
      const xs = slice.map(r => r.features[k]); const ys = slice.map(r => r.y);
      arr.push({ feat: k, sp: spearman(xs, ys), auc: rocAuc(xs, ys), q5q1: quintileGap(xs, ys) });
    }
    arr.sort((a, b) => Math.abs(b.sp) - Math.abs(a.sp));
    uni[sp] = arr;
  }

  console.log('\n[deep] TOP 10 UNIVARIATE on ALL:');
  for (const r of uni.ALL.slice(0, 10)) console.log(`  ${r.feat.padEnd(22)} ρ=${r.sp.toFixed(3).padStart(6)}  AUC=${r.auc.toFixed(3)}  Q5-Q1=${fmtPct(r.q5q1)}`);
  console.log('\n[deep] TOP 10 UNIVARIATE on MLB:');
  for (const r of uni.MLB.slice(0, 10)) console.log(`  ${r.feat.padEnd(22)} ρ=${r.sp.toFixed(3).padStart(6)}  AUC=${r.auc.toFixed(3)}  Q5-Q1=${fmtPct(r.q5q1)}`);

  // ─── 2. Forward stepwise ───────────────────────────────────────────
  console.log('\n[deep] forward stepwise (this may take a minute)…');
  function forwardStepwise(rows, maxK = 8, lambda = 1.5) {
    const remaining = new Set(FEATURE_NAMES);
    const selected = []; let bestAuc = 0.5; const trace = [];
    while (selected.length < maxK && remaining.size > 0) {
      let best = null;
      for (const cand of remaining) {
        const cv = fitAndCV(rows, [...selected, cand], lambda, 5);
        if (!cv) continue;
        if (!best || cv.auc > best.auc) best = { feat: cand, ...cv };
      }
      if (!best) break;
      if (best.auc <= bestAuc + 0.002 && selected.length > 0) { trace.push({ ...best, accepted: false }); break; }
      trace.push({ ...best, accepted: true });
      selected.push(best.feat); remaining.delete(best.feat); bestAuc = best.auc;
      console.log(`[deep]   added ${best.feat.padEnd(22)} → AUC=${best.auc.toFixed(3)}  MLB=${best.bySport?.MLB?.auc?.toFixed(3)||'—'}  NBA=${best.bySport?.NBA?.auc?.toFixed(3)||'—'}  NHL=${best.bySport?.NHL?.auc?.toFixed(3)||'—'}`);
    }
    return { selected, trace, finalAuc: bestAuc };
  }
  const step = forwardStepwise(rows, 8, 1.5);

  let finalFit = null, finalCV = null;
  if (step.selected.length) {
    finalFit = fitFull(rows, step.selected, 1.5);
    finalCV = fitAndCV(rows, step.selected, 1.5, 5);
  }

  // ─── Write report ───────────────────────────────────────────────────
  const stamp = new Date().toISOString();
  const lines = [];
  lines.push('# AGS-U Deep Feature Lab');
  lines.push('');
  lines.push(`_Generated: ${stamp}_`);
  lines.push('');
  lines.push(`${FEATURE_NAMES.length} candidate features tested with strict-causal 5-fold time-aware CV on ${rows.length} W/L picks since ${V6_CUTOVER}.`);
  lines.push('');
  lines.push(`Sport counts: MLB=${subsets.MLB.length} NBA=${subsets.NBA.length} NHL=${subsets.NHL.length}.`);
  lines.push('');
  lines.push('---');
  lines.push('');

  lines.push('## Univariate rankings');
  lines.push('');
  for (const sp of sports) {
    if (!uni[sp]) continue;
    lines.push(`### ${sp} (n=${subsets[sp].length}) — top 20 by |ρ|`);
    lines.push('');
    lines.push('| feature | ρ | AUC | Q5−Q1 |');
    lines.push('|---|---|---|---|');
    for (const r of uni[sp].slice(0, 20)) lines.push(`| \`${r.feat}\` | ${r.sp.toFixed(3)} | ${r.auc.toFixed(3)} | ${fmtPct(r.q5q1)} |`);
    lines.push('');
  }

  lines.push('## Forward stepwise');
  lines.push('');
  lines.push(`Selected: \`[${step.selected.join(', ')}]\`  ·  Final CV AUC = **${step.finalAuc.toFixed(3)}**`);
  lines.push('');
  lines.push('| step | added | AUC | MLB | NBA | NHL | Q5-Q1 | accepted |');
  lines.push('|---|---|---|---|---|---|---|---|');
  for (let i = 0; i < step.trace.length; i++) {
    const t = step.trace[i];
    const mlb = t.bySport?.MLB?.auc?.toFixed(3) ?? '—';
    const nba = t.bySport?.NBA?.auc?.toFixed(3) ?? '—';
    const nhl = t.bySport?.NHL?.auc?.toFixed(3) ?? '—';
    lines.push(`| ${i + 1} | \`${t.feat}\` | ${t.auc.toFixed(3)} | ${mlb} | ${nba} | ${nhl} | ${fmtPct(t.q5q1)} | ${t.accepted ? '✓' : '✗'} |`);
  }
  lines.push('');

  if (finalFit && finalCV) {
    lines.push('### Final fit');
    lines.push('');
    lines.push(`Universal CV: AUC=${finalCV.auc.toFixed(3)}  ρ=${finalCV.sp.toFixed(3)}  Q5-Q1=${fmtPct(finalCV.q5q1)}`);
    lines.push('');
    lines.push('| sport | n | AUC | ρ | Q5-Q1 |');
    lines.push('|---|---|---|---|---|');
    for (const sp of ['MLB', 'NBA', 'NHL']) {
      const r = finalCV.bySport[sp]; if (!r) continue;
      lines.push(`| ${sp} | ${r.n} | ${r.auc.toFixed(3)} | ${r.sp.toFixed(3)} | ${fmtPct(r.q5q1)} |`);
    }
    lines.push('');
    lines.push('Coefficients:');
    lines.push('');
    lines.push('| term | β |');
    lines.push('|---|---|');
    lines.push(`| intercept | ${finalFit.beta[0].toFixed(4)} |`);
    for (let i = 0; i < step.selected.length; i++) lines.push(`| ${step.selected[i]} | ${finalFit.beta[i + 1].toFixed(4)} |`);
    lines.push('');
    lines.push('Normalizers:');
    lines.push('');
    lines.push('| feature | mean | sd |');
    lines.push('|---|---|---|');
    for (const k of step.selected) lines.push(`| ${k} | ${finalFit.norm[k].mean.toFixed(4)} | ${finalFit.norm[k].sd.toFixed(4)} |`);
    lines.push('');
  }

  lines.push('---');
  lines.push(`_Generated by \`scripts/_agsu_deep_feature_lab.mjs\` · ${stamp}_`);
  writeFileSync(join(REPO_ROOT, 'AGSU_DEEP_FEATURE_LAB.md'), lines.join('\n'));
  console.log('[deep] → AGSU_DEEP_FEATURE_LAB.md');

  console.log(`\n[deep] STEPWISE WINNER: AUC=${step.finalAuc.toFixed(3)}  [${step.selected.join(', ')}]`);
  if (finalCV) {
    for (const sp of ['MLB', 'NBA', 'NHL']) {
      const r = finalCV.bySport[sp]; if (!r) continue;
      console.log(`  ${sp}: AUC=${r.auc.toFixed(3)}  ρ=${r.sp.toFixed(3)}  Q5-Q1=${fmtPct(r.q5q1)}`);
    }
  }
  process.exit(0);
}

main().catch(err => { console.error('[deep] fatal:', err); process.exit(1); });
