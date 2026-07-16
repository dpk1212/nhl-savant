/**
 * _additive_winprob_model.mjs — Additive logistic P(win) bakeoff
 *
 * Features (plan):
 *   1) agsV12
 *   2) conviction: mean FOR sizeRatio + top2Size − meanSize
 *   3) EDGE (causal FOR−AG sport WR, n≥8) — prefer stamped when present
 *   4) %+CLV top2 (causal as-of date)
 *   5) RANK / SHARP path one-hots
 *   + hcMargin, topUnopp, topVsTop, deltaQ, sport MLB/SOC
 *
 * Does NOT train on market odds. Edge = p_model − p_market.
 * Local-only research. No Firestore writes.
 *
 *   node scripts/_additive_winprob_model.mjs
 */
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import {
  buildClvLedgerFromPositions,
  computeForTop2PctPos,
  shortWalletId,
  CLV_HIST_FROM,
} from '../src/lib/walletClvSkill.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
if (!admin.apps.length) {
  const sak = join(root, 'serviceAccountKey.json');
  admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(sak, 'utf8'))) });
}
const db = admin.firestore();

const DEPLOY = '2026-06-01';
const HIST_FROM = '2026-04-01';
const MIN_N = 8;

const AGS_TIERS = new Set(['ELITE', 'LOCK', 'PREMIUM', 'LEAN', 'WEAK', 'SOLID', 'STRONG']);

const mean = xs => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : null);
const sum = xs => xs.reduce((s, x) => s + x, 0);
const rnd = (x, n = 4) => (!Number.isFinite(x) ? null : Math.round(x * 10 ** n) / 10 ** n);
const shortId = w => shortWalletId(w);

function impliedProb(odds) {
  if (odds == null || odds === 0 || !Number.isFinite(Number(odds))) return null;
  const o = Number(odds);
  return o < 0 ? Math.abs(o) / (Math.abs(o) + 100) : 100 / (o + 100);
}
function flatRet(odds, won) {
  if (!odds) return won ? 0.91 : -1;
  return won ? (odds > 0 ? odds / 100 : 100 / Math.abs(odds)) : -1;
}
function profitAt(u, o, won) {
  if (!u) return 0;
  if (!won) return -u;
  return o < 0 ? u * (100 / Math.abs(o)) : u * (o / 100);
}

function auc(pairs) {
  const pos = pairs.filter(p => p.y === 1);
  const neg = pairs.filter(p => p.y === 0);
  if (!pos.length || !neg.length) return null;
  const all = [...pairs].sort((a, b) => a.s - b.s);
  let rank = 1;
  let i = 0;
  let rPos = 0;
  while (i < all.length) {
    let j = i;
    while (j < all.length && all[j].s === all[i].s) j++;
    const avg = (rank + rank + (j - i) - 1) / 2;
    for (let k = i; k < j; k++) if (all[k].y === 1) rPos += avg;
    rank += j - i;
    i = j;
  }
  return (rPos - pos.length * (pos.length + 1) / 2) / (pos.length * neg.length);
}
function logloss(ps, ys) {
  return mean(ys.map((y, i) => {
    const p = Math.min(1 - 1e-9, Math.max(1e-9, ps[i]));
    return y ? -Math.log(p) : -Math.log(1 - p);
  }));
}
function brier(ps, ys) {
  return mean(ys.map((y, i) => (ps[i] - y) ** 2));
}

/** Median of finite values (for train-fold imputation). */
function median(xs) {
  const s = xs.filter(Number.isFinite).sort((a, b) => a - b);
  if (!s.length) return 0;
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

/**
 * Ridge logistic on z-scored features (IRLS).
 * Continuous features with nulls are imputed to train median before z-score.
 */
function fitLogit(set, names, lambda = 8) {
  const stats = {};
  const imputed = set.map(r => ({ ...r }));
  for (const n of names) {
    const xs = set.map(r => Number(r[n])).filter(Number.isFinite);
    const fill = xs.length ? median(xs) : 0;
    const m0 = mean(xs.length ? xs : [fill]) || 0;
    const sd = Math.sqrt(mean((xs.length ? xs : [fill]).map(x => (x - m0) ** 2)) || 1) || 1;
    stats[n] = { m: m0, sd, fill };
    for (const r of imputed) {
      if (!Number.isFinite(Number(r[n]))) r[n] = fill;
    }
  }
  const Z = r => names.map(n => {
    const raw = Number(r[n]);
    const v = Number.isFinite(raw) ? raw : stats[n].fill;
    return (v - stats[n].m) / stats[n].sd;
  });
  const X = imputed.map(r => [1, ...Z(r)]);
  const y = imputed.map(r => r.won);
  const p = names.length + 1;
  let beta = Array(p).fill(0);
  for (let it = 0; it < 40; it++) {
    const probs = X.map(x => {
      let s = 0;
      for (let j = 0; j < p; j++) s += beta[j] * x[j];
      return 1 / (1 + Math.exp(-Math.max(-20, Math.min(20, s))));
    });
    const W = probs.map(pi => Math.max(1e-6, pi * (1 - pi)));
    const A = Array.from({ length: p }, () => Array(p).fill(0));
    const bb = Array(p).fill(0);
    for (let r = 0; r < X.length; r++) {
      const eta = X[r].reduce((s, xj, j) => s + beta[j] * xj, 0);
      const zi = eta + (y[r] - probs[r]) / W[r];
      for (let a = 0; a < p; a++) {
        bb[a] += X[r][a] * W[r] * zi;
        for (let b = 0; b < p; b++) A[a][b] += X[r][a] * W[r] * X[r][b];
      }
    }
    for (let a = 1; a < p; a++) A[a][a] += lambda;
    const M = A.map((row, r2) => [...row, bb[r2]]);
    for (let c = 0; c < p; c++) {
      let piv = c;
      for (let r2 = c + 1; r2 < p; r2++) if (Math.abs(M[r2][c]) > Math.abs(M[piv][c])) piv = r2;
      [M[c], M[piv]] = [M[piv], M[c]];
      const dv = M[c][c] || 1e-12;
      for (let cc = c; cc <= p; cc++) M[c][cc] /= dv;
      for (let r2 = 0; r2 < p; r2++) {
        if (r2 === c) continue;
        const f2 = M[r2][c];
        for (let cc = c; cc <= p; cc++) M[r2][cc] -= f2 * M[c][cc];
      }
    }
    beta = M.map(row => row[p]);
  }
  return {
    beta,
    stats,
    names,
    predict(r) {
      const z = Z(r);
      let s = beta[0];
      for (let j = 0; j < z.length; j++) s += beta[j + 1] * z[j];
      return 1 / (1 + Math.exp(-Math.max(-20, Math.min(20, s))));
    },
  };
}

function resolveAgsuTier(sd) {
  const t = sd.v8_agsTier || sd.v8_agsV12Tier || sd.v8_lockTier || null;
  if (typeof t === 'string' && t !== 'UNKNOWN' && AGS_TIERS.has(t)) return t;
  // also accept any non-empty stamped tier string used in production
  if (typeof sd.v8_agsTier === 'string' && sd.v8_agsTier && sd.v8_agsTier !== 'UNKNOWN') return sd.v8_agsTier;
  if (typeof sd.v8_agsV12Tier === 'string' && sd.v8_agsV12Tier && sd.v8_agsV12Tier !== 'UNKNOWN') return sd.v8_agsV12Tier;
  return null;
}

function isUiStakedGraded(data, sd) {
  if (!data?.date || data.date < DEPLOY) return false;
  if (sd.superseded || sd.cancelled || data.cancelled) return false;
  if (sd.result?.tracked === true) return false;
  const out = sd.result?.outcome;
  if (out !== 'WIN' && out !== 'LOSS') return false;
  if (!resolveAgsuTier(sd)) return false;
  const units = Number(sd.finalUnits ?? sd.v8_agsV12UnitsApplied ?? sd.v8_agsUnitsApplied ?? 0) || 0;
  return units > 0;
}

(async () => {
  console.error('Loading CLV ledger from sharp_action_positions…');
  const posSnap = await db.collection('sharp_action_positions').where('status', '==', 'GRADED').get();
  const gradedPos = posSnap.docs.map(d => d.data());
  const clvLedger = buildClvLedgerFromPositions(gradedPos, { since: CLV_HIST_FROM });
  console.error(`CLV ledger wallets=${clvLedger.size} positions=${gradedPos.length}`);

  console.error('Loading sharpFlow picks/spreads/totals…');
  const cols = ['sharpFlowPicks', 'sharpFlowSpreads', 'sharpFlowTotals'];
  /** All graded W/L events with wallets (for causal boards), plus June+ UI staked subset. */
  const events = [];

  for (const col of cols) {
    const snap = await db.collection(col).get();
    for (const doc of snap.docs) {
      const data = doc.data();
      if (!data?.date || data.date < HIST_FROM || !data.sides) continue;
      const sport = data.sport || 'NHL';
      const mkt = col === 'sharpFlowSpreads' ? 'spread' : col === 'sharpFlowTotals' ? 'total' : 'ml';
      for (const [sideKey, sd] of Object.entries(data.sides)) {
        if (sd.superseded) continue;
        const res = sd.result || {};
        if (res.outcome !== 'WIN' && res.outcome !== 'LOSS') continue;
        const peak = sd.peak || {};
        const lock = sd.lock || {};
        const scor = peak.v8Scoring || lock.v8Scoring || {};
        const wd = scor.walletDetails || [];
        const wallets = [];
        const seen = new Set();
        for (const w of wd) {
          const id = shortId(w.walletShort || w.wallet);
          if (!id || seen.has(id) || !w.side) continue;
          seen.add(id);
          wallets.push({
            id,
            side: w.side,
            sizeRatio: Number(w.sizeRatio ?? w.betMultiplier ?? 0) || 0,
            invested: Number(w.invested || 0) || 0,
            contribution: Number(w.contribution || 0) || 0,
          });
        }
        const odds = Number(lock.odds ?? sd.odds ?? peak.odds ?? 0) || 0;
        const units = Number(sd.finalUnits ?? sd.v8_agsV12UnitsApplied ?? sd.v8_agsUnitsApplied ?? 0) || 0;
        const ui = isUiStakedGraded(data, sd);
        events.push({
          key: `${data.date}|${sport}|${doc.id}|${sideKey}`,
          date: data.date,
          sport,
          mkt,
          docId: doc.id,
          sideKey,
          won: res.outcome === 'WIN' ? 1 : 0,
          odds,
          units,
          profit: Number(res.profit ?? profitAt(units, odds, res.outcome === 'WIN')) || 0,
          wallets,
          ui,
          agsV12: Number(sd.v8_agsV12 ?? peak.v8_agsV12 ?? 0) || 0,
          agsTier: resolveAgsuTier(sd),
          hcMargin: Number(sd.v8_hcMargin ?? peak.v8_hcMargin ?? 0) || 0,
          hcTier: sd.v8_hcStakeTier || null,
          stampedEdge: sd.v8_winnerAlignEdge != null ? Number(sd.v8_winnerAlignEdge) : null,
          stampedTopUnopp: sd.v8_winnerAlignTopUnopp === true || sd.v8_winnerAlignTopUnopp === 1 ? 1 : (sd.v8_winnerAlignTopUnopp === false || sd.v8_winnerAlignTopUnopp === 0 ? 0 : null),
          stampedTopVsTop: sd.v8_winnerAlignTopVsTop === true || sd.v8_winnerAlignTopVsTop === 1 ? 1 : (sd.v8_winnerAlignTopVsTop === false || sd.v8_winnerAlignTopVsTop === 0 ? 0 : null),
          stampedClvTop2: sd.v8_forTop2PctPos != null ? Number(sd.v8_forTop2PctPos) : null,
          deltaQ: Number(sd.v8_walletConsensusQualityMargin ?? scor.deltaQuality ?? 0) || 0,
          deltaW: Number(sd.v8_walletConsensusDelta ?? scor.deltaWinner ?? 0) || 0,
          walletDetails: wd,
        });
      }
    }
  }
  events.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  console.error(`events=${events.length} uiStaked=${events.filter(e => e.ui).length}`);

  // Causal sport WR boards (day-walk)
  const st = new Map();
  const S = (id, s) => {
    const k = `${id}|${s}`;
    if (!st.has(k)) st.set(k, { w: 0, l: 0 });
    return st.get(k);
  };
  const wrOf = (id, s) => {
    const x = S(id, s);
    const n = x.w + x.l;
    return n < MIN_N ? null : (100 * x.w) / n;
  };
  const topIds = sport => {
    const rows = [];
    for (const [k, v] of st) {
      if (!k.endsWith(`|${sport}`)) continue;
      const n = v.w + v.l;
      if (n < MIN_N) continue;
      const wr = (100 * v.w) / n;
      rows.push({ id: k.split('|')[0], wr, n });
    }
    rows.sort((a, b) => b.wr - a.wr || b.n - a.n);
    return new Set(rows.slice(0, 5).map(r => r.id));
  };

  const rows = [];
  let i = 0;
  while (i < events.length) {
    const d = events[i].date;
    const day = [];
    while (i < events.length && events[i].date === d) day.push(events[i++]);

    const topsBy = new Map();
    for (const e of day) if (!topsBy.has(e.sport)) topsBy.set(e.sport, topIds(e.sport));

    for (const e of day) {
      if (!e.ui) continue;
      const forWd = e.wallets.filter(w => w.side === e.sideKey);
      const agWd = e.wallets.filter(w => w.side !== e.sideKey);

      // Conviction from FOR wallets
      const forSizes = forWd.map(w => w.sizeRatio).filter(x => x > 0);
      const meanSize = forSizes.length ? mean(forSizes) : null;
      const top2Sizes = [...forSizes].sort((a, b) => b - a).slice(0, 2);
      const top2Size = top2Sizes.length ? mean(top2Sizes) : null;
      const top2MinusMean = top2Size != null && meanSize != null ? top2Size - meanSize : null;

      // Causal EDGE
      const forW = [];
      const agW = [];
      for (const w of e.wallets) {
        const wr = wrOf(w.id, e.sport);
        if (wr == null) continue;
        (w.side === e.sideKey ? forW : agW).push(wr);
      }
      const causalEdge =
        forW.length && agW.length ? mean(forW) - mean(agW) : null;
      const edge =
        e.stampedEdge != null && Number.isFinite(e.stampedEdge)
          ? e.stampedEdge
          : causalEdge;

      // Top5 unopposed / topVsTop
      const tops = topsBy.get(e.sport) || new Set();
      const forTop = forWd.filter(w => tops.has(w.id)).length;
      const agTop = agWd.filter(w => tops.has(w.id)).length;
      const topUnoppCausal = forTop >= 1 && agTop === 0 ? 1 : 0;
      const topVsTopCausal = forTop >= 1 && agTop >= 1 ? 1 : 0;
      const topUnopp =
        e.stampedTopUnopp != null ? e.stampedTopUnopp : topUnoppCausal;
      const topVsTop =
        e.stampedTopVsTop != null ? e.stampedTopVsTop : topVsTopCausal;

      // CLV top2 (null kept — impute per train fold later)
      let clvTop2 = e.stampedClvTop2;
      if (clvTop2 == null || !Number.isFinite(clvTop2)) {
        const c = computeForTop2PctPos(e.walletDetails, e.sideKey, e.date, clvLedger);
        clvTop2 = c.top2Pct;
      }

      const tier = e.hcTier || '';
      const isRank = tier === 'RANK' ? 1 : 0;
      const isSharp = tier === 'SHARP' || tier === 'SHARP-PRIME' ? 1 : 0;
      const isPathA = ['SUPER', 'TOP', 'TOP+', 'MINI', 'MINI-', 'CONFIRMED'].includes(tier) ? 1 : 0;

      const pMkt = impliedProb(e.odds);
      if (pMkt == null) continue;

      rows.push({
        key: e.key,
        date: e.date,
        sport: e.sport,
        mkt: e.mkt,
        won: e.won,
        odds: e.odds,
        units: e.units,
        profit: e.profit,
        flat: flatRet(e.odds, e.won === 1),
        pMkt,
        agsV12: e.agsV12,
        conviction: meanSize,
        top2MinusMean,
        edge,
        edgeMissing: edge == null ? 1 : 0,
        clvTop2,
        clvMissing: clvTop2 == null ? 1 : 0,
        isRank,
        isSharp,
        isPathA,
        hcMargin: e.hcMargin,
        topUnopp,
        topVsTop,
        deltaQ: e.deltaQ,
        deltaW: e.deltaW,
        isMLB: e.sport === 'MLB' ? 1 : 0,
        isSOC: e.sport === 'SOC' ? 1 : 0,
        forN: forWd.length,
        agN: agWd.length,
        hcTier: tier || 'UNTIERED',
        agsTier: e.agsTier,
        stampedEdge: e.stampedEdge != null ? 1 : 0,
        stampedClv: e.stampedClvTop2 != null ? 1 : 0,
      });
    }

    // Update boards AFTER scoring the day (causal)
    for (const e of day) {
      for (const w of e.wallets) {
        if (w.side !== e.sideKey) continue;
        const s = S(w.id, e.sport);
        if (e.won) s.w++;
        else s.l++;
      }
    }
  }

  console.error(`feature rows=${rows.length}`);

  const missing = {
    n: rows.length,
    edgeMissing: rows.filter(r => r.edgeMissing).length,
    clvMissing: rows.filter(r => r.clvMissing).length,
    zeroConviction: rows.filter(r => !r.conviction).length,
    stampedEdge: rows.filter(r => r.stampedEdge).length,
    stampedClv: rows.filter(r => r.stampedClv).length,
    bySport: {},
    byPath: {},
  };
  for (const r of rows) {
    missing.bySport[r.sport] = (missing.bySport[r.sport] || 0) + 1;
    missing.byPath[r.hcTier] = (missing.byPath[r.hcTier] || 0) + 1;
  }

  // Feature sets
  const FEATS_FULL = [
    'agsV12',
    'conviction',
    'top2MinusMean',
    'edge',
    'clvTop2',
    'isRank',
    'isSharp',
    'hcMargin',
    'topUnopp',
    'topVsTop',
    'deltaQ',
    'isMLB',
    'isSOC',
  ];
  const FEATS_CORE5 = ['agsV12', 'conviction', 'edge', 'clvTop2', 'isRank'];
  const FEATS_AGS = ['agsV12'];
  const FEATS_EDGE = ['edge'];
  const LAMBDA = 8;

  const chron = [...rows].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  // Complete cases: real EDGE + CLV + conviction
  const complete = chron.filter(r => !r.edgeMissing && !r.clvMissing && Number.isFinite(r.conviction));
  console.error(`complete-case rows=${complete.length}`);

  // Univariate AUC (full sample — descriptive only)
  const uniAuc = {};
  for (const f of FEATS_FULL) {
    const sub = chron.filter(r => Number.isFinite(Number(r[f])));
    if (sub.length < 40) continue;
    uniAuc[f] = rnd(auc(sub.map(r => ({ s: Number(r[f]), y: r.won }))), 4);
  }

  const nFolds = 4;
  const foldSize = Math.max(40, Math.floor(chron.length / (nFolds + 1)));
  const folds = [];
  for (let f = 0; f < nFolds; f++) {
    const trainEnd = foldSize * (f + 1);
    const testEnd = Math.min(chron.length, trainEnd + foldSize);
    if (testEnd <= trainEnd || trainEnd < 100) continue; // need ≥100 train for stability
    folds.push({ train: chron.slice(0, trainEnd), test: chron.slice(trainEnd, testEnd) });
  }

  function evalModel(test, predictFn) {
    const ps = test.map(r => predictFn(r));
    const ys = test.map(r => r.won);
    const pairs = test.map((r, i) => ({ s: ps[i], y: r.won }));
    return {
      n: test.length,
      auc: rnd(auc(pairs), 4),
      logloss: rnd(logloss(ps, ys), 4),
      brier: rnd(brier(ps, ys), 4),
    };
  }

  const cv = {
    market: [],
    agsV12: [],
    edge: [],
    core5: [],
    full: [],
  };

  for (const [fi, fold] of folds.entries()) {
    const { train, test } = fold;
    cv.market.push(evalModel(test, r => r.pMkt));
    const mAgs = fitLogit(train, FEATS_AGS, LAMBDA);
    cv.agsV12.push(evalModel(test, r => mAgs.predict(r)));
    const mEdge = fitLogit(train, FEATS_EDGE, LAMBDA);
    cv.edge.push(evalModel(test, r => mEdge.predict(r)));
    const mCore = fitLogit(train, FEATS_CORE5, LAMBDA);
    cv.core5.push(evalModel(test, r => mCore.predict(r)));
    const mFull = fitLogit(train, FEATS_FULL, LAMBDA);
    cv.full.push(evalModel(test, r => mFull.predict(r)));
    console.error(
      `fold ${fi + 1}: mkt=${cv.market[fi].auc} ags=${cv.agsV12[fi].auc} edge=${cv.edge[fi].auc} core5=${cv.core5[fi].auc} full=${cv.full[fi].auc} (train=${train.length} test=${test.length})`,
    );
  }

  // Complete-case CV (same fold dates, filtered)
  const cvComplete = { market: [], full: [], n: complete.length };
  if (complete.length >= 150) {
    const cFoldSize = Math.max(30, Math.floor(complete.length / (nFolds + 1)));
    for (let f = 0; f < nFolds; f++) {
      const trainEnd = cFoldSize * (f + 1);
      const testEnd = Math.min(complete.length, trainEnd + cFoldSize);
      if (testEnd <= trainEnd || trainEnd < 80) continue;
      const train = complete.slice(0, trainEnd);
      const test = complete.slice(trainEnd, testEnd);
      cvComplete.market.push(evalModel(test, r => r.pMkt));
      const m = fitLogit(train, FEATS_FULL, LAMBDA);
      cvComplete.full.push(evalModel(test, r => m.predict(r)));
    }
  }

  const avgAuc = arr => rnd(mean(arr.map(x => x.auc).filter(Number.isFinite)), 4);
  const cvSummary = {
    folds: folds.length,
    lambda: LAMBDA,
    market: { meanAuc: avgAuc(cv.market), folds: cv.market },
    agsV12: { meanAuc: avgAuc(cv.agsV12), folds: cv.agsV12 },
    edge: { meanAuc: avgAuc(cv.edge), folds: cv.edge },
    core5: { meanAuc: avgAuc(cv.core5), folds: cv.core5 },
    full: { meanAuc: avgAuc(cv.full), folds: cv.full },
    completeCase: {
      n: cvComplete.n,
      folds: cvComplete.full.length,
      market: avgAuc(cvComplete.market),
      full: avgAuc(cvComplete.full),
    },
    univariateAuc: uniAuc,
  };

  // Expanding-window OOS predictions for full model (for edge buckets)
  const oosP = new Map(); // key → p_hat
  for (const fold of folds) {
    const m = fitLogit(fold.train, FEATS_FULL, LAMBDA);
    for (const r of fold.test) oosP.set(r.key, m.predict(r));
  }
  // Also fit on all-but-last-holdout for coefficient rank (final 70% train / 30% holdout)
  const holdCut = Math.floor(chron.length * 0.7);
  const trainH = chron.slice(0, holdCut);
  const testH = chron.slice(holdCut);
  const finalModel = fitLogit(trainH, FEATS_FULL, LAMBDA);
  const holdEval = {
    market: evalModel(testH, r => r.pMkt),
    agsV12: evalModel(testH, r => fitLogit(trainH, FEATS_AGS, LAMBDA).predict(r)),
    edge: evalModel(testH, r => fitLogit(trainH, FEATS_EDGE, LAMBDA).predict(r)),
    core5: evalModel(testH, r => fitLogit(trainH, FEATS_CORE5, LAMBDA).predict(r)),
    full: evalModel(testH, r => finalModel.predict(r)),
  };
  // Fill any missing OOS with finalModel (early rows not in CV test)
  for (const r of chron) {
    if (!oosP.has(r.key)) oosP.set(r.key, finalModel.predict(r));
  }

  const coefRank = FEATS_FULL.map((n, j) => ({
    feature: n,
    beta_z: rnd(finalModel.beta[j + 1], 4),
    abs: Math.abs(finalModel.beta[j + 1]),
    trainMean: rnd(finalModel.stats[n].m, 4),
    trainSd: rnd(finalModel.stats[n].sd, 4),
  })).sort((a, b) => b.abs - a.abs);
  coefRank.forEach((c, i) => { c.rank = i + 1; });

  // Edge buckets on OOS predictions where available from CV folds only
  const oosRows = chron
    .filter(r => folds.some(f => f.test.some(t => t.key === r.key)))
    .map(r => {
      const pHat = oosP.get(r.key);
      const edgeVsMkt = pHat - r.pMkt;
      return { ...r, pHat, edgeVsMkt };
    });

  const scored = [...oosRows].sort((a, b) => a.edgeVsMkt - b.edgeVsMkt);
  const nQ = 5;
  const buckets = [];
  for (let q = 0; q < nQ; q++) {
    const a = Math.floor((q * scored.length) / nQ);
    const b = Math.floor(((q + 1) * scored.length) / nQ);
    const slice = scored.slice(a, b);
    const w = sum(slice.map(r => r.won));
    const units = sum(slice.map(r => r.units));
    const pnl = sum(slice.map(r => r.profit));
    const flatPnl = sum(slice.map(r => r.flat));
    buckets.push({
      quintile: q + 1,
      label: q === nQ - 1 ? 'top_edge' : q === 0 ? 'bottom_edge' : `Q${q + 1}`,
      n: slice.length,
      wr: rnd(100 * w / slice.length, 1),
      flatRoi: rnd(100 * mean(slice.map(r => r.flat)), 1),
      flatPnl: rnd(flatPnl, 2),
      unitsRoi: rnd(units > 0 ? (100 * pnl) / units : 0, 1),
      unitsPnl: rnd(pnl, 2),
      units: rnd(units, 1),
      meanEdgePp: rnd(100 * mean(slice.map(r => r.edgeVsMkt)), 2),
      meanPHat: rnd(mean(slice.map(r => r.pHat)), 3),
      meanPMkt: rnd(mean(slice.map(r => r.pMkt)), 3),
    });
  }

  const topBucket = buckets[buckets.length - 1];
  const passBar = {
    fullBeatsMarket:
      cvSummary.full.meanAuc != null &&
      cvSummary.market.meanAuc != null &&
      cvSummary.full.meanAuc > cvSummary.market.meanAuc + 0.01,
    fullBeatsBestSingle: (() => {
      const bestSingle = Math.max(cvSummary.agsV12.meanAuc || 0, cvSummary.edge.meanAuc || 0);
      return cvSummary.full.meanAuc != null && cvSummary.full.meanAuc > bestSingle + 0.005;
    })(),
    topEdgePositiveRoi: topBucket && topBucket.n >= 40 && topBucket.unitsRoi > 0,
    topEdgeN: topBucket?.n ?? 0,
    verdict: null,
  };
  passBar.verdict =
    passBar.fullBeatsMarket && passBar.fullBeatsBestSingle && passBar.topEdgePositiveRoi
      ? 'PASS — something here'
      : passBar.fullBeatsMarket || passBar.topEdgePositiveRoi
        ? 'MIXED — directional signal, not full bar'
        : 'FAIL — no clear additive edge vs market/singles';

  const baseline = {
    n: chron.length,
    w: sum(chron.map(r => r.won)),
    l: chron.length - sum(chron.map(r => r.won)),
    wr: rnd(100 * mean(chron.map(r => r.won)), 1),
    units: rnd(sum(chron.map(r => r.units)), 1),
    profit: rnd(sum(chron.map(r => r.profit)), 2),
  };
  baseline.roi = rnd(baseline.units > 0 ? (100 * baseline.profit) / baseline.units : 0, 1);

  const out = {
    meta: {
      generatedAt: new Date().toISOString(),
      deployFrom: DEPLOY,
      model: 'additive_ridge_logistic_zscored',
      lambda: LAMBDA,
      featsFull: FEATS_FULL,
      featsCore5: FEATS_CORE5,
      note: 'Market odds NOT used as training features. Edge = p_hat - p_mkt. Causal EDGE/CLV when stamps missing. Nulls → train-fold median.',
    },
    baseline,
    missingness: missing,
    cvSummary,
    holdout30: holdEval,
    intercept: rnd(finalModel.beta[0], 4),
    coefficientRank: coefRank,
    edgeBucketsOos: buckets,
    passBar,
    sampleTopEdge: scored.slice(-8).map(r => ({
      date: r.date,
      sport: r.sport,
      odds: r.odds,
      won: r.won,
      pHat: rnd(r.pHat, 3),
      pMkt: rnd(r.pMkt, 3),
      edgePp: rnd(100 * r.edgeVsMkt, 1),
      agsV12: rnd(r.agsV12, 3),
      edge: rnd(r.edge, 1),
      clvTop2: rnd(r.clvTop2, 1),
      conviction: rnd(r.conviction, 2),
    })),
  };

  const jsonPath = join(root, 'tmp_additive_winprob_june1.json');
  writeFileSync(jsonPath, JSON.stringify(out, null, 2));
  const csvPath = join(root, 'tmp_additive_winprob_june1_rows.csv');
  const csvHeader = [
    'date', 'sport', 'mkt', 'won', 'odds', 'units', 'profit', 'pMkt', 'pHat', 'edgeVsMkt',
    ...FEATS_FULL, 'hcTier', 'agsTier',
  ].join(',');
  const csvLines = [csvHeader];
  for (const r of chron) {
    const pHat = oosP.get(r.key);
    const edgeVsMkt = pHat - r.pMkt;
    csvLines.push([
      r.date, r.sport, r.mkt, r.won, r.odds, r.units, rnd(r.profit, 3), rnd(r.pMkt, 4), rnd(pHat, 4), rnd(edgeVsMkt, 4),
      ...FEATS_FULL.map(f => (Number.isFinite(Number(r[f])) ? rnd(r[f], 4) : '')),
      r.hcTier, r.agsTier,
    ].join(','));
  }
  writeFileSync(csvPath, csvLines.join('\n') + '\n');

  // Markdown report
  const lines = [];
  lines.push('# Additive Win-Prob Model — June 1+ staked book');
  lines.push('');
  lines.push(`Generated: ${out.meta.generatedAt}`);
  lines.push('');
  lines.push('## Universe');
  lines.push(`- n=${baseline.n} · ${baseline.w}-${baseline.l} · WR ${baseline.wr}% · ${baseline.units}u · PnL ${baseline.profit}u · ROI ${baseline.roi}%`);
  lines.push(`- Filter: date≥${DEPLOY}, !tracked, AGS-U tier, finalUnits>0, W/L only`);
  lines.push(`- Missing EDGE: ${missing.edgeMissing} · Missing CLV: ${missing.clvMissing} · Complete-case n=${complete.length}`);
  lines.push('');
  lines.push('## Model');
  lines.push('```');
  lines.push('logit(P(win)) = β0 + Σ βk · z(xk)');
  lines.push('edge_vs_mkt   = P(win) − implied(odds)');
  lines.push('```');
  lines.push(`- Ridge λ=${LAMBDA} on non-intercept; z-scored on train fold; nulls → train median`);
  lines.push('- **Odds not trained** — only for edge / ROI buckets');
  lines.push('');
  lines.push('## CV bakeoff (expanding-window, mean AUC, train≥100)');
  lines.push('| Model | mean AUC |');
  lines.push('|-------|----------|');
  lines.push(`| Market implied | ${cvSummary.market.meanAuc} |`);
  lines.push(`| agsV12 alone | ${cvSummary.agsV12.meanAuc} |`);
  lines.push(`| EDGE alone | ${cvSummary.edge.meanAuc} |`);
  lines.push(`| Core5 (ags+conv+edge+clv+RANK) | ${cvSummary.core5.meanAuc} |`);
  lines.push(`| **Full additive** | **${cvSummary.full.meanAuc}** |`);
  if (cvSummary.completeCase.folds) {
    lines.push(`| Complete-case full (n=${cvSummary.completeCase.n}) | ${cvSummary.completeCase.full} (mkt ${cvSummary.completeCase.market}) |`);
  }
  lines.push('');
  lines.push('### Univariate AUC (descriptive, full sample)');
  lines.push('| Feature | AUC |');
  lines.push('|---------|-----|');
  for (const [f, a] of Object.entries(uniAuc).sort((a, b) => (b[1] || 0) - (a[1] || 0))) {
    lines.push(`| ${f} | ${a} |`);
  }
  lines.push('');
  lines.push('### Holdout last 30%');
  lines.push(`| market ${holdEval.market.auc} · ags ${holdEval.agsV12.auc} · edge ${holdEval.edge.auc} · core5 ${holdEval.core5.auc} · **full ${holdEval.full.auc}** |`);
  lines.push('');
  lines.push('## Coefficient rank (|β| on z-scored features, final 70% train)');
  lines.push('| Rank | Feature | β_z |');
  lines.push('|------|---------|-----|');
  for (const c of coefRank) {
    lines.push(`| ${c.rank} | ${c.feature} | ${c.beta_z} |`);
  }
  lines.push('');
  lines.push('## Edge quintiles (OOS CV predictions)');
  lines.push('| Q | n | WR | flat ROI | units ROI | units PnL | mean edge pp |');
  lines.push('|---|---|----|----------|-----------|-----------|--------------|');
  for (const b of buckets) {
    lines.push(`| ${b.label} | ${b.n} | ${b.wr}% | ${b.flatRoi}% | ${b.unitsRoi}% | ${b.unitsPnl}u | ${b.meanEdgePp} |`);
  }
  lines.push('');
  lines.push('## Pass bar');
  lines.push(`- Full beats market (+1pp AUC): **${passBar.fullBeatsMarket}**`);
  lines.push(`- Full beats best single (+0.5pp): **${passBar.fullBeatsBestSingle}**`);
  lines.push(`- Top edge quintile ROI>0 & n≥40: **${passBar.topEdgePositiveRoi}** (n=${passBar.topEdgeN}, ROI=${topBucket?.unitsRoi}%)`);
  lines.push(`- **Verdict: ${passBar.verdict}**`);
  lines.push('');
  lines.push('## Interpretation notes');
  lines.push('- Market implied alone is a strong baseline (favorites win more); beating it is the real bar.');
  lines.push('- Gates (CLV cancel, top_cap, RANK) can still have value as *policies* even if linear combo does not beat market AUC.');
  lines.push('- Negative β on a feature means higher values associate with *lower* win rate in the joint model (collinearity possible).');
  lines.push('');
  lines.push('## Artifacts');
  lines.push('- `tmp_additive_winprob_june1.json`');
  lines.push('- `tmp_additive_winprob_june1_rows.csv`');
  lines.push('- `scripts/_additive_winprob_model.mjs`');
  lines.push('');

  const mdPath = join(root, 'ADDITIVE_WINPROB_REPORT.md');
  writeFileSync(mdPath, lines.join('\n'));

  console.log('\n========== ADDITIVE WINPROB ==========');
  console.log(JSON.stringify({ baseline, cvSummary: {
    market: cvSummary.market.meanAuc,
    agsV12: cvSummary.agsV12.meanAuc,
    edge: cvSummary.edge.meanAuc,
    core5: cvSummary.core5.meanAuc,
    full: cvSummary.full.meanAuc,
    completeCase: cvSummary.completeCase,
    uniTop: Object.entries(uniAuc).sort((a, b) => b[1] - a[1]).slice(0, 5),
  }, topCoefs: coefRank.slice(0, 5), topBucket, passBar }, null, 2));
  console.log(`\nWrote ${jsonPath}`);
  console.log(`Wrote ${csvPath}`);
  console.log(`Wrote ${mdPath}`);
  process.exit(0);
})().catch(err => {
  console.error(err);
  process.exit(1);
});
