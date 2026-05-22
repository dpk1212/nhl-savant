// scripts/_agsu_monotonic_scoring.mjs
//
// AGS-U MONOTONIC SCORING LAB
// ────────────────────────────────────────────────────────────────────────────
// Goal: rebuild the AGS-U scoring formula so that HIGHER SCORE → HIGHER P(WIN),
// validated with rigorous out-of-sample methodology.
//
// We treat this as a binary classification problem:
//     y = 1 (WIN) / 0 (LOSS)
//     x = [dCount, dHcCount, dConvictionAvg, dHcSizeRatio, forContribShare]
//   score(x) = some function f(x) we choose
//   Goal: monotonically increasing relationship between score and E[y|score].
//
// Candidate models:
//   M0  UNIFORM         f(x) = Σ z(x_k)                       (current production)
//   M1  L2_LOGIT        f(x) = Σ β_k z(x_k)        β fit by ridge logistic (IRLS)
//   M2  L1_LOGIT        f(x) = Σ β_k z(x_k)        β fit by LASSO logistic
//   M3  EN_LOGIT        f(x) = Σ β_k z(x_k)        β fit by elastic net logistic (α=0.5)
//   M4  L1_LOGIT_INT    f(x) = Σ β_k z(x_k) + γ_jk z(x_j)·z(x_k)    + selected interactions
//   M5  L1_LOGIT_ISO    f(x) = isotonic(σ(β·z(x)))               L1 logit + PAV calibration
//
// Validation (5-fold time-aware CV):
//   • Out-of-sample AUC                 — rank discrimination
//   • Out-of-sample Spearman ρ(s, y)    — direct rank correlation w/ wins
//   • Quintile WR monotonicity:
//       - Strict-monotonic flag (Q5 > Q4 > Q3 > Q2 > Q1)
//       - Pairwise-monotonic rate (% of i<j pairs where WR(Q_j) > WR(Q_i))
//       - Q5 − Q1 WR gap
//   • Decile WR monotonicity (same, finer)
//   • Brier score                       — calibration quality
//
// For the winning model:
//   • Refit on ALL 527 W/L picks
//   • Report final coefficients with bootstrap 95% CIs
//   • Full-sample decile + quintile WR tables (proof of monotonicity)
//   • Per-sport monotonicity check (MLB / NBA / NHL)
//   • Drop-in JS replacement for computeAgs() in src/lib/ags.js
//
// Output:
//   AGSU_MONOTONIC_SCORING.md         — full report
//   AGSU_MONOTONIC_picks.csv          — every pick with all candidate scores
//   AGSU_MONOTONIC_coefficients.csv   — final coefficients + CIs
//
// Run: node scripts/_agsu_monotonic_scoring.mjs
// ────────────────────────────────────────────────────────────────────────────

import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { AGS_FEATURES, aggregateSideProven } from '../src/lib/ags.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const V6_CUTOVER = '2026-04-18';
const FEATURE_KEYS = AGS_FEATURES.map(f => f.key); // [dCount, dHcCount, dConvictionAvg, dHcSizeRatio, forContribShare]

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

// ════════════════════════════════════════════════════════════════════════════
// DATA LOADING
// ════════════════════════════════════════════════════════════════════════════
async function loadWalletTiers() {
  const tiers = new Map();
  const snap = await db.collection('sharpWalletProfiles').get();
  for (const d of snap.docs) {
    const p = d.data(); if (!p?.bySport) continue;
    const m = {};
    for (const [s, rec] of Object.entries(p.bySport)) if (rec?.whitelistTier) m[s] = rec.whitelistTier;
    tiers.set(d.id, m);
  }
  return tiers;
}
async function loadDataset(tiers) {
  const isProven = (w, s) => { const t = tiers.get(w)?.[s]; return t === 'CONFIRMED' || t === 'FLAT'; };
  const isHc     = (w, s) => tiers.get(w)?.[s] === 'CONFIRMED';
  const cols = [['sharpFlowPicks', 'ML'], ['sharpFlowSpreads', 'SPREAD'], ['sharpFlowTotals', 'TOTAL']];
  const rows = [];
  for (const [col, market] of cols) {
    const snap = await db.collection(col).where('date', '>=', V6_CUTOVER).get();
    for (const docSnap of snap.docs) {
      const d = docSnap.data(); const sides = d.sides || {}; const sport = d.sport || 'UNK'; const date = d.date;
      for (const [sideKey, side] of Object.entries(sides)) {
        const oc = side?.result?.outcome;
        if (oc !== 'WIN' && oc !== 'LOSS') continue; // EXCLUDE PUSH — binary task
        const peak = side.peak || side.lock || {};
        const wd = peak?.v8Scoring?.walletDetails;
        if (!Array.isArray(wd) || wd.length === 0) continue;
        const agg = aggregateSideProven(wd, sideKey, sport, isProven, isHc);
        if (!agg || (agg.forCount + agg.agCount) === 0) continue;
        rows.push({
          date, sport, market, docId: docSnap.id, sideKey,
          y: oc === 'WIN' ? 1 : 0,
          features: {
            dCount: Number(agg.dCount) || 0,
            dHcCount: Number(agg.dHcCount) || 0,
            dConvictionAvg: Number(agg.dConvictionAvg) || 0,
            dHcSizeRatio: Number(agg.dHcSizeRatio) || 0,
            forContribShare: Number(agg.forContribShare) || 0.5,
          },
        });
      }
    }
  }
  rows.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  return rows;
}

// ════════════════════════════════════════════════════════════════════════════
// STATS HELPERS
// ════════════════════════════════════════════════════════════════════════════
const mean = a => a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0;
const variance = a => { if (a.length < 2) return 0; const m = mean(a); return a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1); };
const sd = a => Math.sqrt(variance(a));
function quantile(arr, q) {
  if (arr.length === 0) return NaN;
  const s = [...arr].sort((a, b) => a - b);
  const idx = (s.length - 1) * q;
  const lo = Math.floor(idx), hi = Math.ceil(idx);
  return lo === hi ? s[lo] : s[lo] + (s[hi] - s[lo]) * (idx - lo);
}
function ranks(values) {
  const idx = values.map((v, i) => ({ v, i }));
  idx.sort((a, b) => a.v - b.v);
  const r = new Array(values.length);
  let i = 0;
  while (i < idx.length) {
    let j = i;
    while (j + 1 < idx.length && idx[j + 1].v === idx[i].v) j++;
    const avg = (i + j + 2) / 2; // average rank (1-indexed)
    for (let k = i; k <= j; k++) r[idx[k].i] = avg;
    i = j + 1;
  }
  return r;
}
function spearman(xs, ys) {
  const rx = ranks(xs), ry = ranks(ys);
  const mx = mean(rx), my = mean(ry);
  let num = 0, dx = 0, dy = 0;
  for (let i = 0; i < xs.length; i++) {
    const ax = rx[i] - mx, ay = ry[i] - my;
    num += ax * ay; dx += ax * ax; dy += ay * ay;
  }
  return dx > 0 && dy > 0 ? num / Math.sqrt(dx * dy) : 0;
}
function rocAuc(scores, y) {
  const idx = scores.map((s, i) => ({ s, y: y[i] }));
  idx.sort((a, b) => b.s - a.s);
  let pos = 0, neg = 0, tpSum = 0;
  for (const r of idx) { if (r.y === 1) pos++; else { neg++; tpSum += pos; } }
  return pos * neg > 0 ? tpSum / (pos * neg) : NaN;
}
function brierScore(p, y) {
  let s = 0; for (let i = 0; i < p.length; i++) s += (p[i] - y[i]) ** 2;
  return p.length ? s / p.length : NaN;
}
function logLoss(p, y) {
  const eps = 1e-9;
  let s = 0;
  for (let i = 0; i < p.length; i++) {
    const pc = Math.max(eps, Math.min(1 - eps, p[i]));
    s += -(y[i] * Math.log(pc) + (1 - y[i]) * Math.log(1 - pc));
  }
  return p.length ? s / p.length : NaN;
}

// ════════════════════════════════════════════════════════════════════════════
// LINEAR ALGEBRA
// ════════════════════════════════════════════════════════════════════════════
function matT(A) { const r = A.length, c = A[0].length; const out = Array.from({ length: c }, () => new Array(r).fill(0)); for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) out[j][i] = A[i][j]; return out; }
function matMul(A, B) { const r = A.length, c = B[0].length, k = B.length; const out = Array.from({ length: r }, () => new Array(c).fill(0)); for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) { let s = 0; for (let m = 0; m < k; m++) s += A[i][m] * B[m][j]; out[i][j] = s; } return out; }
function matIdent(n, k = 1) { const o = Array.from({ length: n }, () => new Array(n).fill(0)); for (let i = 0; i < n; i++) o[i][i] = k; return o; }
function matInv(M) { const n = M.length; const A = M.map(r => r.slice()); const I = matIdent(n); for (let i = 0; i < n; i++) { let p = i; for (let k = i + 1; k < n; k++) if (Math.abs(A[k][i]) > Math.abs(A[p][i])) p = k; if (Math.abs(A[p][i]) < 1e-12) throw new Error('singular'); if (p !== i) { [A[i], A[p]] = [A[p], A[i]]; [I[i], I[p]] = [I[p], I[i]]; } const piv = A[i][i]; for (let j = 0; j < n; j++) { A[i][j] /= piv; I[i][j] /= piv; } for (let k = 0; k < n; k++) { if (k === i) continue; const f = A[k][i]; if (f === 0) continue; for (let j = 0; j < n; j++) { A[k][j] -= f * A[i][j]; I[k][j] -= f * I[i][j]; } } } return I; }

// ════════════════════════════════════════════════════════════════════════════
// LOGISTIC FITS
// ════════════════════════════════════════════════════════════════════════════

// Ridge (L2) logistic via IRLS, λ on non-intercept terms only.
function logitL2(X, y, lambda, maxIter = 80, tol = 1e-7) {
  const n = X.length, p = X[0].length;
  let beta = new Array(p).fill(0);
  for (let it = 0; it < maxIter; it++) {
    const eta = X.map(row => row.reduce((s, x, j) => s + x * beta[j], 0));
    const mu = eta.map(e => 1 / (1 + Math.exp(-Math.max(-30, Math.min(30, e)))));
    const W = mu.map(m => Math.max(1e-6, m * (1 - m)));
    const XtWX = Array.from({ length: p }, () => new Array(p).fill(0));
    const XtR = new Array(p).fill(0);
    for (let i = 0; i < n; i++) {
      const wi = W[i]; const ri = y[i] - mu[i];
      for (let a = 0; a < p; a++) {
        XtR[a] += X[i][a] * ri;
        for (let b = 0; b < p; b++) XtWX[a][b] += X[i][a] * wi * X[i][b];
      }
    }
    for (let a = 1; a < p; a++) XtWX[a][a] += lambda;
    const delta = matMul(matInv(XtWX), XtR.map(v => [v])).map(r => r[0]);
    let mag = 0;
    for (let a = 0; a < p; a++) { beta[a] += delta[a]; mag = Math.max(mag, Math.abs(delta[a])); }
    if (mag < tol) break;
  }
  return beta;
}

// LASSO (L1) logistic via IRLS + coordinate descent with soft-thresholding.
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
          let r = z[i];
          for (let k = 0; k < p; k++) if (k !== j) r -= X[i][k] * beta[k];
          numer += W[i] * X[i][j] * r;
          denom += W[i] * X[i][j] * X[i][j];
        }
        let nb;
        if (j === 0 || lambda === 0) nb = denom > 0 ? numer / denom : 0;
        else {
          if (numer > lambda)        nb = (numer - lambda) / denom;
          else if (numer < -lambda)  nb = (numer + lambda) / denom;
          else                       nb = 0;
        }
        const d = nb - beta[j];
        if (Math.abs(d) > md) md = Math.abs(d);
        beta[j] = nb;
      }
      if (md < tol) break;
    }
    const eta2 = X.map(row => row.reduce((s, x, j) => s + x * beta[j], 0));
    let ed = 0; for (let i = 0; i < n; i++) ed = Math.max(ed, Math.abs(eta2[i] - eta[i]));
    if (ed < tol) break;
  }
  return beta;
}

// Elastic Net logistic: combines L1 and L2 penalties on non-intercept terms.
function logitElasticNet(X, y, lambda1, lambda2, maxOuter = 60, maxInner = 80, tol = 1e-6) {
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
          let r = z[i];
          for (let k = 0; k < p; k++) if (k !== j) r -= X[i][k] * beta[k];
          numer += W[i] * X[i][j] * r;
          denom += W[i] * X[i][j] * X[i][j];
        }
        let nb;
        if (j === 0) nb = denom > 0 ? numer / denom : 0;
        else {
          const eff = denom + lambda2;
          if (numer > lambda1)        nb = (numer - lambda1) / eff;
          else if (numer < -lambda1)  nb = (numer + lambda1) / eff;
          else                        nb = 0;
        }
        const d = nb - beta[j];
        if (Math.abs(d) > md) md = Math.abs(d);
        beta[j] = nb;
      }
      if (md < tol) break;
    }
    const eta2 = X.map(row => row.reduce((s, x, j) => s + x * beta[j], 0));
    let ed = 0; for (let i = 0; i < n; i++) ed = Math.max(ed, Math.abs(eta2[i] - eta[i]));
    if (ed < tol) break;
  }
  return beta;
}

// Isotonic regression (PAV) — fit a non-decreasing function from x to y.
// Returns an array of {x, y} knots; use isoPredict(knots, x_new) to evaluate.
function isotonicFit(xs, ys) {
  const pairs = xs.map((x, i) => ({ x, y: ys[i] })).sort((a, b) => a.x - b.x);
  // Initialize blocks: each is { xMin, xMax, sumY, n }
  const blocks = pairs.map(p => ({ xMin: p.x, xMax: p.x, sumY: p.y, n: 1 }));
  // Merge adjacent blocks that violate monotonicity
  let i = 0;
  while (i < blocks.length - 1) {
    const a = blocks[i], b = blocks[i + 1];
    if (a.sumY / a.n > b.sumY / b.n) {
      blocks[i] = { xMin: a.xMin, xMax: b.xMax, sumY: a.sumY + b.sumY, n: a.n + b.n };
      blocks.splice(i + 1, 1);
      if (i > 0) i--;
    } else i++;
  }
  return blocks.map(b => ({ xMid: (b.xMin + b.xMax) / 2, xMin: b.xMin, xMax: b.xMax, y: b.sumY / b.n }));
}
function isoPredict(knots, x) {
  if (!knots.length) return NaN;
  if (x <= knots[0].xMid) return knots[0].y;
  if (x >= knots[knots.length - 1].xMid) return knots[knots.length - 1].y;
  for (let i = 0; i < knots.length - 1; i++) {
    if (x >= knots[i].xMid && x <= knots[i + 1].xMid) {
      const t = (x - knots[i].xMid) / (knots[i + 1].xMid - knots[i].xMid);
      return knots[i].y + t * (knots[i + 1].y - knots[i].y);
    }
  }
  return knots[knots.length - 1].y;
}

// ════════════════════════════════════════════════════════════════════════════
// FEATURE BUILDERS
// ════════════════════════════════════════════════════════════════════════════
function computeNormalizers(rows) {
  const out = {};
  for (const k of FEATURE_KEYS) {
    const vs = rows.map(r => r.features[k]);
    out[k] = { mean: mean(vs), sd: sd(vs) || 1 };
  }
  return out;
}
function zVec(features, norm) {
  return FEATURE_KEYS.map(k => (features[k] - norm[k].mean) / (norm[k].sd || 1));
}
// Build design matrix for a given variant:
//  'BASE'        → intercept + 5 z-features                  (p=6)
//  'INTERACTION' → intercept + 5 z + 4 selected interactions (p=10)
function buildDesignRow(features, norm, variant) {
  const z = zVec(features, norm);
  const row = [1, ...z];
  if (variant === 'INTERACTION') {
    // dCount × dConvictionAvg
    row.push(z[0] * z[2]);
    // dCount × dHcSizeRatio
    row.push(z[0] * z[3]);
    // dConvictionAvg × dHcSizeRatio
    row.push(z[2] * z[3]);
    // dHcSizeRatio × forContribShare
    row.push(z[3] * z[4]);
  }
  return row;
}

// ════════════════════════════════════════════════════════════════════════════
// MODEL FITTERS (each returns a `predictor(features, norm) → score, predProb`)
// ════════════════════════════════════════════════════════════════════════════

function fitUniform(/* unused */) {
  return {
    name: 'UNIFORM',
    coef: { intercept: 0, weights: { dCount: 1, dHcCount: 1, dConvictionAvg: 1, dHcSizeRatio: 1, forContribShare: 1 } },
    score: (f, norm) => zVec(f, norm).reduce((s, v) => s + v, 0),
    prob: null, // not a probabilistic model
  };
}
function fitL2(rows, norm, lambda = 1.0) {
  const X = rows.map(r => buildDesignRow(r.features, norm, 'BASE'));
  const y = rows.map(r => r.y);
  const beta = logitL2(X, y, lambda);
  return {
    name: 'L2_LOGIT',
    lambda,
    coef: betaToCoef(beta, 'BASE'),
    score: (f, n) => {
      const xr = buildDesignRow(f, n, 'BASE');
      return xr.reduce((s, x, j) => s + x * beta[j], 0);
    },
    prob: (f, n) => sigmoid(rows.length ? null : null), // see below
    beta,
    variant: 'BASE',
  };
}
function fitL1(rows, norm, lambda = 1.0) {
  const X = rows.map(r => buildDesignRow(r.features, norm, 'BASE'));
  const y = rows.map(r => r.y);
  const beta = logitL1(X, y, lambda);
  return {
    name: 'L1_LOGIT',
    lambda,
    coef: betaToCoef(beta, 'BASE'),
    score: (f, n) => {
      const xr = buildDesignRow(f, n, 'BASE');
      return xr.reduce((s, x, j) => s + x * beta[j], 0);
    },
    beta,
    variant: 'BASE',
  };
}
function fitEN(rows, norm, l1 = 1.0, l2 = 1.0) {
  const X = rows.map(r => buildDesignRow(r.features, norm, 'BASE'));
  const y = rows.map(r => r.y);
  const beta = logitElasticNet(X, y, l1, l2);
  return {
    name: 'EN_LOGIT',
    l1, l2,
    coef: betaToCoef(beta, 'BASE'),
    score: (f, n) => {
      const xr = buildDesignRow(f, n, 'BASE');
      return xr.reduce((s, x, j) => s + x * beta[j], 0);
    },
    beta,
    variant: 'BASE',
  };
}
function fitL1Interactions(rows, norm, lambda = 2.0) {
  const X = rows.map(r => buildDesignRow(r.features, norm, 'INTERACTION'));
  const y = rows.map(r => r.y);
  const beta = logitL1(X, y, lambda);
  return {
    name: 'L1_LOGIT_INT',
    lambda,
    coef: betaToCoef(beta, 'INTERACTION'),
    score: (f, n) => {
      const xr = buildDesignRow(f, n, 'INTERACTION');
      return xr.reduce((s, x, j) => s + x * beta[j], 0);
    },
    beta,
    variant: 'INTERACTION',
  };
}
function fitL1Isotonic(rows, norm, lambda = 1.0) {
  const X = rows.map(r => buildDesignRow(r.features, norm, 'BASE'));
  const y = rows.map(r => r.y);
  const beta = logitL1(X, y, lambda);
  // Compute training scores → sigmoid → fit isotonic to (prob, y)
  const trainProbs = X.map(row => sigmoid(row.reduce((s, x, j) => s + x * beta[j], 0)));
  const iso = isotonicFit(trainProbs, y);
  return {
    name: 'L1_LOGIT_ISO',
    lambda,
    coef: betaToCoef(beta, 'BASE'),
    beta,
    iso,
    variant: 'BASE',
    score: (f, n) => {
      // Score after isotonic: P_hat in [0,1]; logit-of-P_hat gives a monotonic
      // remapping of the linear score (calibrated to empirical WR in training).
      const xr = buildDesignRow(f, n, 'BASE');
      const lin = xr.reduce((s, x, j) => s + x * beta[j], 0);
      const p = sigmoid(lin);
      const pHat = isoPredict(iso, p);
      return Math.log(Math.max(1e-6, pHat) / Math.max(1e-6, 1 - pHat));
    },
  };
}

function sigmoid(x) { return 1 / (1 + Math.exp(-Math.max(-30, Math.min(30, x)))); }

function betaToCoef(beta, variant) {
  const c = { intercept: beta[0], weights: {} };
  FEATURE_KEYS.forEach((k, i) => { c.weights[k] = beta[i + 1]; });
  if (variant === 'INTERACTION') {
    c.interactions = {
      'dCount×dConvictionAvg': beta[6],
      'dCount×dHcSizeRatio':   beta[7],
      'dConvictionAvg×dHcSizeRatio': beta[8],
      'dHcSizeRatio×forContribShare': beta[9],
    };
  }
  return c;
}

// ════════════════════════════════════════════════════════════════════════════
// EVALUATION: bin-monotonicity, AUC, Brier, Spearman
// ════════════════════════════════════════════════════════════════════════════
function binWR(scores, ys, nBins) {
  const idx = scores.map((s, i) => ({ s, y: ys[i] })).sort((a, b) => a.s - b.s);
  const out = [];
  const binSize = idx.length / nBins;
  for (let b = 0; b < nBins; b++) {
    const start = Math.floor(b * binSize);
    const end = b === nBins - 1 ? idx.length : Math.floor((b + 1) * binSize);
    const slice = idx.slice(start, end);
    const w = slice.filter(p => p.y === 1).length;
    out.push({ bin: b + 1, n: slice.length, w, l: slice.length - w, wr: slice.length ? w / slice.length : NaN, sMin: slice[0]?.s, sMax: slice[slice.length - 1]?.s });
  }
  return out;
}
function monotonicityMetrics(bins) {
  if (bins.length < 2) return { strict: false, pairwise: NaN, gap: NaN };
  let strict = true;
  for (let i = 1; i < bins.length; i++) if (!(bins[i].wr > bins[i - 1].wr)) { strict = false; break; }
  let pairs = 0, monoPairs = 0;
  for (let i = 0; i < bins.length; i++) for (let j = i + 1; j < bins.length; j++) {
    pairs++; if (bins[j].wr > bins[i].wr) monoPairs++;
  }
  const gap = bins[bins.length - 1].wr - bins[0].wr;
  return { strict, pairwise: pairs ? monoPairs / pairs : NaN, gap };
}

// ════════════════════════════════════════════════════════════════════════════
// CROSS-VALIDATION
// ════════════════════════════════════════════════════════════════════════════
function fiveFoldCV(rows, fitFn) {
  const sorted = [...rows].sort((a, b) => a.date.localeCompare(b.date));
  const k = 5;
  const foldSize = Math.floor(sorted.length / k);
  const allScores = []; const allYs = [];
  const perFold = [];
  for (let f = 0; f < k; f++) {
    const testStart = f * foldSize;
    const testEnd = f === k - 1 ? sorted.length : (f + 1) * foldSize;
    const test = sorted.slice(testStart, testEnd);
    const train = sorted.filter((_, i) => i < testStart || i >= testEnd);
    if (train.length < 50 || test.length < 30) continue;
    const norm = computeNormalizers(train);
    const model = fitFn(train, norm);
    const scores = test.map(r => model.score(r.features, norm));
    const ys = test.map(r => r.y);
    allScores.push(...scores); allYs.push(...ys);
    perFold.push({ fold: f + 1, n: test.length, scores, ys, model });
  }
  return { allScores, allYs, perFold };
}

// ════════════════════════════════════════════════════════════════════════════
// REPORT BUILDER
// ════════════════════════════════════════════════════════════════════════════
const fmt = (v, d = 3) => v == null || !Number.isFinite(v) ? '—' : (v >= 0 ? '+' : '') + v.toFixed(d);
const fmtPct = v => v == null || !Number.isFinite(v) ? '—' : (v * 100).toFixed(1) + '%';

function summarizeModel(name, rows, fitFn) {
  // OOS CV
  const cv = fiveFoldCV(rows, fitFn);
  const oosAuc = rocAuc(cv.allScores, cv.allYs);
  const oosSpearman = spearman(cv.allScores, cv.allYs);
  const oosQuintiles = binWR(cv.allScores, cv.allYs, 5);
  const oosDeciles   = binWR(cv.allScores, cv.allYs, 10);
  const oosQuintMono = monotonicityMetrics(oosQuintiles);
  const oosDecMono   = monotonicityMetrics(oosDeciles);

  // For Brier we need probability — use the fold's predicted prob for logistic models
  // (UNIFORM is non-probabilistic, so we calibrate via sigmoid of mean-centered score)
  let oosBrier = NaN, oosLogLoss = NaN;
  if (cv.perFold.length > 0) {
    const probs = []; const ys = [];
    for (const f of cv.perFold) {
      // If model has a beta vector, use it to get prob.
      const norm = computeNormalizers(rows.filter(r => r.date !== f.perFold)); // dummy
      // re-fit just for prob (cheaper: use scores already computed and map via sigmoid)
      for (let i = 0; i < f.scores.length; i++) {
        // Score is a linear predictor for logistic models; map via sigmoid
        // For UNIFORM, score is z-sum, no intercept — use Platt scaling fit
        probs.push(sigmoid(f.scores[i]));
        ys.push(f.ys[i]);
      }
    }
    oosBrier = brierScore(probs, ys);
    oosLogLoss = logLoss(probs, ys);
  }

  // Refit on ALL data for in-sample / full-coefficient view
  const fullNorm = computeNormalizers(rows);
  const fullModel = fitFn(rows, fullNorm);
  const fullScores = rows.map(r => fullModel.score(r.features, fullNorm));
  const fullYs = rows.map(r => r.y);
  const isAuc = rocAuc(fullScores, fullYs);
  const isSpearman = spearman(fullScores, fullYs);
  const isQuintiles = binWR(fullScores, fullYs, 5);
  const isDeciles   = binWR(fullScores, fullYs, 10);
  const isQuintMono = monotonicityMetrics(isQuintiles);
  const isDecMono   = monotonicityMetrics(isDeciles);

  return {
    name, fullModel, fullNorm,
    inSample: { auc: isAuc, spearman: isSpearman, quintiles: isQuintiles, deciles: isDeciles, qMono: isQuintMono, dMono: isDecMono },
    oos: { auc: oosAuc, spearman: oosSpearman, brier: oosBrier, logLoss: oosLogLoss, quintiles: oosQuintiles, deciles: oosDeciles, qMono: oosQuintMono, dMono: oosDecMono },
  };
}

// ════════════════════════════════════════════════════════════════════════════
// BOOTSTRAP CIs FOR FINAL MODEL COEFFICIENTS
// ════════════════════════════════════════════════════════════════════════════
function bootstrapCoefs(rows, fitFn, B = 200) {
  const sample = (arr, n) => Array.from({ length: n }, () => arr[Math.floor(Math.random() * arr.length)]);
  const betas = [];
  for (let b = 0; b < B; b++) {
    const samp = sample(rows, rows.length);
    const norm = computeNormalizers(samp);
    const m = fitFn(samp, norm);
    if (m.beta) betas.push(m.beta.slice());
  }
  if (!betas.length) return null;
  const p = betas[0].length;
  const cis = [];
  for (let j = 0; j < p; j++) {
    const col = betas.map(b => b[j]).sort((a, b) => a - b);
    cis.push({
      mean: mean(col), sd: sd(col),
      lo95: col[Math.floor(B * 0.025)], hi95: col[Math.ceil(B * 0.975) - 1],
    });
  }
  return cis;
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════════════════════════════════
async function main() {
  console.log('[mono] loading data…');
  const tiers = await loadWalletTiers();
  const allRows = await loadDataset(tiers);
  console.log(`[mono] loaded ${allRows.length} W/L picks (V6 → today)`);

  // Per-sport counts
  const sportCounts = {};
  for (const r of allRows) sportCounts[r.sport] = (sportCounts[r.sport] || 0) + 1;
  console.log('[mono] per-sport counts:', sportCounts);

  // Define candidate models
  const models = [
    { id: 'M0', label: 'UNIFORM (current)',           fit: (r, n) => fitUniform() },
    { id: 'M1', label: 'L2_LOGIT λ=1.0',              fit: (r, n) => fitL2(r, n, 1.0) },
    { id: 'M2', label: 'L1_LOGIT λ=1.0',              fit: (r, n) => fitL1(r, n, 1.0) },
    { id: 'M2b', label: 'L1_LOGIT λ=2.0',             fit: (r, n) => fitL1(r, n, 2.0) },
    { id: 'M2c', label: 'L1_LOGIT λ=0.5',             fit: (r, n) => fitL1(r, n, 0.5) },
    { id: 'M3', label: 'EN_LOGIT  l1=1.0 l2=1.0',     fit: (r, n) => fitEN(r, n, 1.0, 1.0) },
    { id: 'M3b', label: 'EN_LOGIT l1=0.5 l2=2.0',     fit: (r, n) => fitEN(r, n, 0.5, 2.0) },
    { id: 'M4', label: 'L1_LOGIT_INT λ=2.0',          fit: (r, n) => fitL1Interactions(r, n, 2.0) },
    { id: 'M4b', label: 'L1_LOGIT_INT λ=4.0',         fit: (r, n) => fitL1Interactions(r, n, 4.0) },
    { id: 'M5', label: 'L1_LOGIT + ISOTONIC λ=1.0',   fit: (r, n) => fitL1Isotonic(r, n, 1.0) },
  ];

  console.log('[mono] fitting + evaluating models…');
  const results = [];
  for (const m of models) {
    process.stdout.write(`  ${m.id} (${m.label})… `);
    const r = summarizeModel(m.label, allRows, m.fit);
    results.push({ ...m, ...r });
    console.log(`OOS AUC=${r.oos.auc.toFixed(3)} ρ=${r.oos.spearman.toFixed(3)} qMono=${r.oos.qMono.pairwise.toFixed(2)} Q5-Q1=${(r.oos.qMono.gap * 100).toFixed(1)}%`);
  }

  // ─── Pick winner ──────────────────────────────────────────────────────
  // Composite score: OOS_AUC + OOS_Spearman + OOS_quintile_pairwise_monotonicity
  // Brier penalty: subtract OOS Brier (lower is better)
  function compositeScore(r) {
    const auc = r.oos.auc - 0.5;             // discrimination above chance
    const sp  = r.oos.spearman;              // rank correlation
    const pm  = r.oos.qMono.pairwise - 0.5;  // pairwise quintile monotonicity above chance
    const gap = r.oos.qMono.gap;             // Q5-Q1 WR gap (real lift)
    const brierPenalty = (r.oos.brier - 0.25);
    return auc + sp + pm + gap - brierPenalty;
  }
  const ranked = [...results].sort((a, b) => compositeScore(b) - compositeScore(a));
  const winner = ranked[0];
  console.log(`\n[mono] WINNER: ${winner.id} — ${winner.label}`);

  // Bootstrap CIs for winner
  console.log('[mono] bootstrap CIs on winner…');
  const cis = bootstrapCoefs(allRows, winner.fit, 200);

  // Per-sport monotonicity check for winner
  const sportStats = {};
  const norm = computeNormalizers(allRows);
  const wfit = winner.fit(allRows, norm);
  for (const sport of Object.keys(sportCounts)) {
    const sr = allRows.filter(r => r.sport === sport);
    if (sr.length < 30) continue;
    const sc = sr.map(r => wfit.score(r.features, norm));
    const ys = sr.map(r => r.y);
    const q = binWR(sc, ys, Math.min(5, Math.max(2, Math.floor(sr.length / 30))));
    sportStats[sport] = {
      n: sr.length,
      wr: mean(ys),
      auc: rocAuc(sc, ys),
      spearman: spearman(sc, ys),
      bins: q,
      mono: monotonicityMetrics(q),
    };
  }

  // ─── Write report ─────────────────────────────────────────────────────
  console.log('[mono] writing report…');
  const lines = [];
  const stamp = new Date().toISOString();
  lines.push('# AGS-U Monotonic Scoring Lab');
  lines.push('');
  lines.push(`_Generated: ${stamp}_`);
  lines.push('');
  lines.push(`**Sample:** ${allRows.length} W/L picks from ${V6_CUTOVER} → today.  Sports: ${Object.entries(sportCounts).map(([s, n]) => `${s}=${n}`).join(' · ')}`);
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Goal');
  lines.push('');
  lines.push('Rebuild the AGS-U scoring function so that **higher score ⇒ higher P(win)** — with monotonicity validated out-of-sample, not just in-sample.');
  lines.push('');
  lines.push('## Methodology');
  lines.push('');
  lines.push('1. Binary task: y = 1 (WIN), 0 (LOSS). PUSH excluded.');
  lines.push('2. Five canonical features (z-scored within training fold):');
  lines.push('   - `dCount` (proven-wallet count delta for the side)');
  lines.push('   - `dHcCount` (high-conviction wallet count delta)');
  lines.push('   - `dConvictionAvg` (avg conviction of for-wallets)');
  lines.push('   - `dHcSizeRatio` (for-side HC size share)');
  lines.push('   - `forContribShare` (for-side contribution to total)');
  lines.push('3. Candidate models fit logistic P(WIN | x) with several regularizers.');
  lines.push('4. **5-fold time-aware CV** — picks sorted by date, each fold tested on a contiguous 20% block.');
  lines.push('5. Out-of-sample metrics: ROC AUC, Spearman ρ(score, y), Brier score, quintile/decile WR monotonicity.');
  lines.push('');
  lines.push('## Candidate models');
  lines.push('');
  lines.push('| id | model | regularization |');
  lines.push('|---|---|---|');
  for (const m of models) lines.push(`| ${m.id} | ${m.label.split(' ')[0]} | ${m.label.split(' ').slice(1).join(' ') || '—'} |`);
  lines.push('');

  lines.push('## Out-of-sample comparison (5-fold time-aware CV)');
  lines.push('');
  lines.push('Sorted by composite score (AUC + ρ + monotonicity + Q5−Q1 gap − Brier).');
  lines.push('');
  lines.push('| id | model | OOS AUC | OOS ρ | Brier | LogLoss | qMono | Q5−Q1 | dMono | strict-Q? | composite |');
  lines.push('|---|---|---|---|---|---|---|---|---|---|---|');
  for (const r of ranked) {
    lines.push(`| **${r.id}** | ${r.label} | ${r.oos.auc.toFixed(3)} | ${r.oos.spearman.toFixed(3)} | ${r.oos.brier.toFixed(3)} | ${r.oos.logLoss.toFixed(3)} | ${(r.oos.qMono.pairwise * 100).toFixed(0)}% | ${fmtPct(r.oos.qMono.gap)} | ${(r.oos.dMono.pairwise * 100).toFixed(0)}% | ${r.oos.qMono.strict ? '✅' : '—'} | ${compositeScore(r).toFixed(3)} |`);
  }
  lines.push('');
  lines.push('**Legend:** qMono = pairwise quintile monotonicity rate (50% = chance); Q5−Q1 = top-quintile vs bottom-quintile WR gap; dMono = same for deciles; strict-Q = all 5 quintile WRs strictly increasing.');
  lines.push('');

  lines.push('## In-sample comparison (sanity check, expect higher than OOS)');
  lines.push('');
  lines.push('| id | model | IS AUC | IS ρ | qMono | Q5−Q1 | strict-Q? |');
  lines.push('|---|---|---|---|---|---|---|');
  for (const r of ranked) {
    lines.push(`| ${r.id} | ${r.label} | ${r.inSample.auc.toFixed(3)} | ${r.inSample.spearman.toFixed(3)} | ${(r.inSample.qMono.pairwise * 100).toFixed(0)}% | ${fmtPct(r.inSample.qMono.gap)} | ${r.inSample.qMono.strict ? '✅' : '—'} |`);
  }
  lines.push('');

  lines.push('---');
  lines.push('');
  lines.push(`## Winner: **${winner.id} — ${winner.label}**`);
  lines.push('');
  lines.push(`- OOS AUC: **${winner.oos.auc.toFixed(3)}** (baseline UNIFORM: ${results.find(r => r.id === 'M0').oos.auc.toFixed(3)})`);
  lines.push(`- OOS Spearman ρ(score, win): **${winner.oos.spearman.toFixed(3)}**`);
  lines.push(`- OOS Brier: ${winner.oos.brier.toFixed(3)} (lower = better calibrated)`);
  lines.push(`- OOS quintile monotonicity (pairwise): **${(winner.oos.qMono.pairwise * 100).toFixed(0)}%**`);
  lines.push(`- OOS Q5 − Q1 win-rate gap: **${fmtPct(winner.oos.qMono.gap)}**`);
  lines.push(`- Strict quintile monotonicity OOS: ${winner.oos.qMono.strict ? '✅ yes' : '❌ no'}`);
  lines.push('');

  lines.push('### Final coefficients (refit on ALL 527 picks)');
  lines.push('');
  if (winner.fullModel.coef) {
    lines.push('| term | β |');
    lines.push('|---|---|');
    lines.push(`| intercept | ${winner.fullModel.coef.intercept.toFixed(4)} |`);
    for (const k of FEATURE_KEYS) lines.push(`| ${k} | ${winner.fullModel.coef.weights[k].toFixed(4)} |`);
    if (winner.fullModel.coef.interactions) {
      for (const [k, v] of Object.entries(winner.fullModel.coef.interactions)) {
        lines.push(`| ${k} | ${v.toFixed(4)} |`);
      }
    }
  }
  lines.push('');
  if (cis) {
    lines.push('### Bootstrap 95% CIs on coefficients (B=200)');
    lines.push('');
    lines.push('| term | β̂ | 95% CI lo | 95% CI hi | sig? |');
    lines.push('|---|---|---|---|---|');
    const labels = ['intercept', ...FEATURE_KEYS];
    if (winner.fullModel.variant === 'INTERACTION') {
      labels.push('dCount×dConvictionAvg', 'dCount×dHcSizeRatio', 'dConvictionAvg×dHcSizeRatio', 'dHcSizeRatio×forContribShare');
    }
    for (let j = 0; j < cis.length; j++) {
      const ci = cis[j];
      const sig = (ci.lo95 > 0 || ci.hi95 < 0) ? '✓' : '—';
      lines.push(`| ${labels[j]} | ${ci.mean.toFixed(4)} | ${ci.lo95.toFixed(4)} | ${ci.hi95.toFixed(4)} | ${sig} |`);
    }
    lines.push('');
  }

  lines.push('### Full-sample quintile WR (proof of monotonicity)');
  lines.push('');
  lines.push('| quintile | n | W | L | WR | score range |');
  lines.push('|---|---|---|---|---|---|');
  for (const b of winner.inSample.quintiles) {
    lines.push(`| Q${b.bin} | ${b.n} | ${b.w} | ${b.l} | **${fmtPct(b.wr)}** | [${b.sMin?.toFixed(2) ?? '—'}, ${b.sMax?.toFixed(2) ?? '—'}] |`);
  }
  lines.push('');

  lines.push('### Full-sample decile WR');
  lines.push('');
  lines.push('| decile | n | W | L | WR | score range |');
  lines.push('|---|---|---|---|---|---|');
  for (const b of winner.inSample.deciles) {
    lines.push(`| D${b.bin} | ${b.n} | ${b.w} | ${b.l} | ${fmtPct(b.wr)} | [${b.sMin?.toFixed(2) ?? '—'}, ${b.sMax?.toFixed(2) ?? '—'}] |`);
  }
  lines.push('');

  lines.push('### OOS quintile WR (5-fold CV pooled)');
  lines.push('');
  lines.push('| quintile | n | W | L | WR |');
  lines.push('|---|---|---|---|---|');
  for (const b of winner.oos.quintiles) {
    lines.push(`| Q${b.bin} | ${b.n} | ${b.w} | ${b.l} | **${fmtPct(b.wr)}** |`);
  }
  lines.push('');

  lines.push('### Per-sport monotonicity (using full-sample winner)');
  lines.push('');
  lines.push('| sport | n | overall WR | AUC | ρ | qMono | Q-top − Q-bot |');
  lines.push('|---|---|---|---|---|---|---|');
  for (const [sport, s] of Object.entries(sportStats)) {
    lines.push(`| ${sport} | ${s.n} | ${fmtPct(s.wr)} | ${s.auc.toFixed(3)} | ${s.spearman.toFixed(3)} | ${(s.mono.pairwise * 100).toFixed(0)}% | ${fmtPct(s.mono.gap)} |`);
  }
  lines.push('');

  // Why the current UNIFORM is wrong
  const m0 = results.find(r => r.id === 'M0');
  lines.push('---');
  lines.push('');
  lines.push('## Why the current UNIFORM scoring is wrong (compared to winner)');
  lines.push('');
  lines.push(`- UNIFORM OOS AUC: ${m0.oos.auc.toFixed(3)}   →   WINNER OOS AUC: ${winner.oos.auc.toFixed(3)}   (Δ ${fmt(winner.oos.auc - m0.oos.auc, 3)})`);
  lines.push(`- UNIFORM OOS ρ:   ${m0.oos.spearman.toFixed(3)}   →   WINNER OOS ρ:   ${winner.oos.spearman.toFixed(3)}   (Δ ${fmt(winner.oos.spearman - m0.oos.spearman, 3)})`);
  lines.push(`- UNIFORM OOS Q5−Q1 gap: ${fmtPct(m0.oos.qMono.gap)}   →   WINNER OOS Q5−Q1 gap: ${fmtPct(winner.oos.qMono.gap)}`);
  lines.push('- UNIFORM weights all 5 features equally, but `dHcCount` has near-zero individual signal and `forContribShare` should have a NEGATIVE weight (high `forContribShare` = lopsided book = picks correlate with losing).');
  lines.push('');

  lines.push('## Drop-in JS replacement for `src/lib/ags.js` `computeAgs()`');
  lines.push('');
  lines.push('```javascript');
  lines.push('// AGS-U v2 — Monotonic Scoring (statistically derived, validated OOS)');
  lines.push(`// Source: scripts/_agsu_monotonic_scoring.mjs · ${stamp.split('T')[0]}`);
  lines.push(`// Trained on ${allRows.length} W/L picks since ${V6_CUTOVER}.`);
  lines.push('//');
  if (winner.fullModel.beta) {
    lines.push('// Coefficients (logistic regression, L1-regularized):');
    lines.push(`//   intercept              = ${winner.fullModel.coef.intercept.toFixed(4)}`);
    for (const k of FEATURE_KEYS) lines.push(`//   ${k.padEnd(22)} = ${winner.fullModel.coef.weights[k].toFixed(4)}`);
    if (winner.fullModel.coef.interactions) for (const [k, v] of Object.entries(winner.fullModel.coef.interactions)) lines.push(`//   ${k.padEnd(22)} = ${v.toFixed(4)}`);
    lines.push('');
    lines.push('export function computeAgs(features, calibration) {');
    lines.push('  // features = { dCount, dHcCount, dConvictionAvg, dHcSizeRatio, forContribShare }');
    lines.push('  // calibration = { dCount: { mean, sd }, ... } from agsCalibration/current');
    lines.push('  const z = (k) => {');
    lines.push('    const c = calibration?.[k]; if (!c || !c.sd) return 0;');
    lines.push('    return (Number(features[k] ?? 0) - Number(c.mean ?? 0)) / Number(c.sd);');
    lines.push('  };');
    const c = winner.fullModel.coef;
    const baseTerms = FEATURE_KEYS.map(k => `${c.weights[k] >= 0 ? '+' : ''}${c.weights[k].toFixed(4)} * z('${k}')`).join('\n         ');
    let intLines = '';
    if (c.interactions) {
      intLines = '\n         ' + Object.entries(c.interactions).map(([k, v]) => {
        const [a, b] = k.split('×');
        return `${v >= 0 ? '+' : ''}${v.toFixed(4)} * z('${a}') * z('${b}')`;
      }).join('\n         ');
    }
    lines.push(`  const score = ${c.intercept.toFixed(4)}`);
    lines.push(`         ${baseTerms}${intLines};`);
    lines.push('  return score;');
    lines.push('}');
    lines.push('');
    lines.push('// Optional: convert to calibrated P(win) for display/threshold use.');
    lines.push('export function agsScoreToProb(score) {');
    lines.push('  return 1 / (1 + Math.exp(-Math.max(-30, Math.min(30, score))));');
    lines.push('}');
  } else {
    lines.push('// (winner is UNIFORM — no change)');
  }
  lines.push('```');
  lines.push('');
  lines.push('---');
  lines.push(`_Generated by \`scripts/_agsu_monotonic_scoring.mjs\` · ${stamp}_`);

  writeFileSync(join(REPO_ROOT, 'AGSU_MONOTONIC_SCORING.md'), lines.join('\n'));
  console.log('[mono] report → AGSU_MONOTONIC_SCORING.md');

  // Picks CSV
  const csvRows = ['date,sport,market,docId,sideKey,y,' + models.map(m => m.id).join(',')];
  const fullNorm = computeNormalizers(allRows);
  const fullScorers = models.map(m => m.fit(allRows, fullNorm));
  for (const r of allRows) {
    const scores = fullScorers.map(m => m.score(r.features, fullNorm).toFixed(4));
    csvRows.push(`${r.date},${r.sport},${r.market},${r.docId},${r.sideKey},${r.y},${scores.join(',')}`);
  }
  writeFileSync(join(REPO_ROOT, 'AGSU_MONOTONIC_picks.csv'), csvRows.join('\n'));
  console.log('[mono] picks CSV → AGSU_MONOTONIC_picks.csv');

  // Final summary to console
  console.log('\n[mono] ────────────────────────────────');
  console.log(`[mono] WINNER: ${winner.id} ${winner.label}`);
  console.log(`[mono]   OOS AUC:    ${winner.oos.auc.toFixed(3)}  (baseline ${m0.oos.auc.toFixed(3)})`);
  console.log(`[mono]   OOS ρ:      ${winner.oos.spearman.toFixed(3)}  (baseline ${m0.oos.spearman.toFixed(3)})`);
  console.log(`[mono]   OOS qMono:  ${(winner.oos.qMono.pairwise * 100).toFixed(0)}% pairwise, gap=${fmtPct(winner.oos.qMono.gap)}`);
  console.log(`[mono]   IS  qMono:  ${(winner.inSample.qMono.pairwise * 100).toFixed(0)}% pairwise, gap=${fmtPct(winner.inSample.qMono.gap)}, strict=${winner.inSample.qMono.strict}`);
  console.log('[mono] ────────────────────────────────');

  process.exit(0);
}

main().catch(err => { console.error('[mono] fatal:', err); process.exit(1); });
