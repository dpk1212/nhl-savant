/**
 * _deep_winner_model.mjs — push past linear models.
 *
 * 1. Bayesian EDGE: empirical-Bayes shrunk wallet WR (no n≥8 cliff),
 *    precision-weighted FOR−AG posterior means. Expands universe.
 * 2. Gradient-boosted trees (depth 2–3, logloss) with early stopping,
 *    evaluated by expanding-window time-series CV — GBM finds its own
 *    interactions/nonlinearities.
 * 3. Honest bakeoff: EDGE, bayesEdge, E5×HC, INTERACT logit, GBM
 *    (internal / +market) across CV folds + final holdout.
 *
 * Local-only research. No writes to Firestore.
 */
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
if (!admin.apps.length) {
  const sak = join(__dirname, '../serviceAccountKey.json');
  admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(sak, 'utf8'))) });
}
const db = admin.firestore();

const FROM = '2026-05-10';        // expanded era (boards warm from Apr)
const HIST_FROM = '2026-04-01';
const MIN_N = 8;                  // legacy EDGE eligibility
const PRIOR_K = 12;               // EB prior strength (pseudo-picks at 50%)

const shortId = w => String(w || '').toLowerCase().slice(-6);
const mean = xs => xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : null;
const sum = xs => xs.reduce((s, x) => s + x, 0);
const rnd = (x, n = 4) => !Number.isFinite(x) ? null : Math.round(x * 10 ** n) / 10 ** n;
const a2d = o => o > 0 ? 1 + o / 100 : 1 + 100 / Math.abs(o);
const flatRet = (odds, won) => !odds ? (won ? 0.91 : -1) : (won ? a2d(odds) - 1 : -1);

function erf(x){const s=Math.sign(x);x=Math.abs(x);const t=1/(1+0.3275911*x);return s*(1-((((1.061405429*t-1.453152027)*t+1.421413741)*t-0.284496736)*t+0.254829592)*t*Math.exp(-x*x));}
const normCdf = z => 0.5 * (1 + erf(z / Math.SQRT2));
function binomCI(k, n, z = 1.96){ const p=k/n, den=1+z*z/n; const c=(p+z*z/(2*n))/den; const h=z*Math.sqrt(p*(1-p)/n+z*z/(4*n*n))/den; return [c-h, c+h]; }
function auc(pairs){
  const pos = pairs.filter(p => p.y === 1), neg = pairs.filter(p => p.y === 0);
  if (!pos.length || !neg.length) return null;
  // rank-based O(n log n)
  const all = [...pairs].sort((a, b) => a.s - b.s);
  let rank = 1, i = 0, rPos = 0;
  while (i < all.length) {
    let j = i; while (j < all.length && all[j].s === all[i].s) j++;
    const avg = (rank + rank + (j - i) - 1) / 2;
    for (let k = i; k < j; k++) if (all[k].y === 1) rPos += avg;
    rank += j - i; i = j;
  }
  return (rPos - pos.length * (pos.length + 1) / 2) / (pos.length * neg.length);
}
function aucBoot(pairs, B = 400){
  const a0 = auc(pairs); const s = [];
  for (let b = 0; b < B; b++) {
    const samp = []; for (let i = 0; i < pairs.length; i++) samp.push(pairs[(Math.random() * pairs.length) | 0]);
    const a = auc(samp); if (a != null) s.push(a);
  }
  s.sort((x, y) => x - y);
  return { auc: a0, lo: s[(0.025 * s.length) | 0], hi: s[(0.975 * s.length) | 0] };
}
const logloss = (ps, ys) => mean(ys.map((y, i) => { const p = Math.min(1 - 1e-9, Math.max(1e-9, ps[i])); return y ? -Math.log(p) : -Math.log(1 - p); }));

// ── Gradient boosting (logloss, shallow regression trees on gradients) ──
function quantiles(vals, q = 14){
  const s = [...vals].filter(Number.isFinite).sort((a, b) => a - b);
  const out = new Set();
  for (let i = 1; i < q; i++) out.add(s[Math.min(s.length - 1, (i * s.length / q) | 0)]);
  return [...out];
}
function buildThresholds(X, featIdx){
  return featIdx.map(j => quantiles(X.map(r => r[j])));
}
function fitTree(X, g, h, featIdx, thresholds, depth, minChild = 12, lambda = 1){
  // returns tree node; leaf value = -G/(H+λ)
  function best(rowsIdx){
    const G = sum(rowsIdx.map(i => g[i])), H = sum(rowsIdx.map(i => h[i]));
    let bestGain = 1e-6, bestJ = -1, bestT = 0, bestL = null, bestR = null;
    for (let fj = 0; fj < featIdx.length; fj++) {
      const j = featIdx[fj];
      for (const t of thresholds[fj]) {
        let GL = 0, HL = 0, nL = 0;
        for (const i of rowsIdx) if (X[i][j] <= t) { GL += g[i]; HL += h[i]; nL++; }
        const nR = rowsIdx.length - nL;
        if (nL < minChild || nR < minChild) continue;
        const GR = G - GL, HR = H - HL;
        const gain = GL * GL / (HL + lambda) + GR * GR / (HR + lambda) - G * G / (H + lambda);
        if (gain > bestGain) { bestGain = gain; bestJ = j; bestT = t; }
      }
    }
    if (bestJ < 0) return null;
    const L = [], R = [];
    for (const i of rowsIdx) (X[i][bestJ] <= bestT ? L : R).push(i);
    return { j: bestJ, t: bestT, L, R, gain: bestGain };
  }
  function grow(rowsIdx, d){
    if (d >= depth || rowsIdx.length < 2 * minChild) {
      const G = sum(rowsIdx.map(i => g[i])), H = sum(rowsIdx.map(i => h[i]));
      return { leaf: -G / (H + lambda) };
    }
    const sp = best(rowsIdx);
    if (!sp) { const G = sum(rowsIdx.map(i => g[i])), H = sum(rowsIdx.map(i => h[i])); return { leaf: -G / (H + lambda) }; }
    return { j: sp.j, t: sp.t, gain: sp.gain, left: grow(sp.L, d + 1), right: grow(sp.R, d + 1) };
  }
  return grow([...Array(X.length).keys()].filter(i => h[i] > 0 || true), 0);
}
function predTree(node, x){ while (node.leaf === undefined) node = x[node.j] <= node.t ? node.left : node.right; return node.leaf; }

function fitGBM(Xtr, ytr, Xva, yva, opts = {}){
  const { nTrees = 250, lr = 0.06, depth = 3, minChild = 14, lambda = 2, patience = 30, colSample = 0.8 } = opts;
  const nF = Xtr[0].length;
  const base = Math.log((mean(ytr) + 1e-6) / (1 - mean(ytr) + 1e-6));
  let Ftr = Xtr.map(() => base), Fva = Xva.map(() => base);
  const trees = [];
  let bestVaLL = Infinity, bestIter = 0;
  const featImp = Array(nF).fill(0);
  for (let m = 0; m < nTrees; m++) {
    const p = Ftr.map(f => 1 / (1 + Math.exp(-f)));
    const g = p.map((pi, i) => pi - ytr[i]);
    const h = p.map(pi => Math.max(1e-6, pi * (1 - pi)));
    const featIdx = [];
    while (featIdx.length < Math.max(3, (nF * colSample) | 0)) {
      const j = (Math.random() * nF) | 0; if (!featIdx.includes(j)) featIdx.push(j);
    }
    const thresholds = buildThresholds(Xtr, featIdx);
    const tree = fitTree(Xtr, g, h, featIdx, thresholds, depth, minChild, lambda);
    trees.push(tree);
    collectImp(tree, featImp);
    for (let i = 0; i < Xtr.length; i++) Ftr[i] += lr * predTree(tree, Xtr[i]);
    for (let i = 0; i < Xva.length; i++) Fva[i] += lr * predTree(tree, Xva[i]);
    const va = logloss(Fva.map(f => 1 / (1 + Math.exp(-f))), yva);
    if (va < bestVaLL - 1e-5) { bestVaLL = va; bestIter = m; }
    if (m - bestIter > patience) break;
  }
  const used = trees.slice(0, bestIter + 1);
  return {
    nUsed: used.length, base, lr, featImp,
    predict(x){ let f = base; for (const t of used) f += lr * predTree(t, x); return 1 / (1 + Math.exp(-f)); },
  };
}
function collectImp(node, imp){ if (node.leaf !== undefined) return; imp[node.j] += node.gain || 0; collectImp(node.left, imp); collectImp(node.right, imp); }

// ── main ──
(async () => {
  const cols = ['sharpFlowPicks', 'sharpFlowSpreads', 'sharpFlowTotals'];
  const events = [];
  for (const col of cols) {
    const snap = await db.collection(col).get();
    for (const doc of snap.docs) {
      const data = doc.data();
      if (!data?.date || data.date < HIST_FROM || !data.sides) continue;
      const sport = data.sport || 'NHL';
      for (const [sideKey, sd] of Object.entries(data.sides)) {
        if (sd.superseded) continue;
        const res = sd.result || {};
        if (res.outcome !== 'WIN' && res.outcome !== 'LOSS') continue;
        const peak = sd.peak || {}, lock = sd.lock || {}, scor = peak.v8Scoring || lock.v8Scoring || {};
        const wd = scor.walletDetails || [];
        const wallets = []; const seen = new Set();
        for (const w of wd) {
          const id = shortId(w.walletShort || w.wallet);
          if (!id || seen.has(id) || !w.side) continue;
          seen.add(id);
          wallets.push({
            id, side: w.side,
            sizeRatio: Number(w.sizeRatio || 0) || 0,
            contribution: Number(w.contribution || 0) || 0,
            walletBase: Number(w.walletBase || 0) || 0,
            roiNorm: Number(w.roiNorm || 0) || 0,
            invested: Number(w.invested || 0) || 0,
          });
        }
        if (!wallets.length) continue;
        const odds = Number(sd.odds ?? peak.odds ?? 0) || 0;
        events.push({
          date: data.date, sport, sideKey, won: res.outcome === 'WIN' ? 1 : 0, odds, wallets,
          deltaW: Number(sd.v8_walletConsensusDelta ?? scor.deltaWinner ?? 0) || 0,
          deltaQ: Number(sd.v8_walletConsensusQualityMargin ?? scor.deltaQuality ?? 0) || 0,
          agsV12: Number(sd.v8_agsV12 ?? 0) || 0,
          hcMargin: Number(sd.v8_hcMargin ?? peak.v8_hcMargin ?? 0) || 0,
        });
      }
    }
  }
  events.sort((a, b) => a.date < b.date ? -1 : 1);

  // as-of wallet boards
  const st = new Map();
  const K = (id, s) => id + '|' + s;
  const S = (id, s) => { const k = K(id, s); if (!st.has(k)) st.set(k, { w: 0, l: 0, ret: 0, n: 0 }); return st.get(k); };
  const wrOf = (id, s) => { const x = S(id, s); const n = x.w + x.l; return n < MIN_N ? null : 100 * x.w / n; };
  const ebOf = (id, s) => { const x = S(id, s); const n = x.w + x.l; return { p: (x.w + 0.5 * PRIOR_K) / (n + PRIOR_K), w: n / (n + PRIOR_K), n }; };
  const strOf = (id, s) => { const x = S(id, s); return x.n < MIN_N ? null : (x.ret / x.n) * Math.sqrt(x.n); };
  const topIds = (sport) => {
    const rows = [];
    for (const [k, v] of st) { if (!k.endsWith('|' + sport) || v.n < MIN_N) continue; rows.push({ id: k.split('|')[0], str: (v.ret / v.n) * Math.sqrt(v.n) }); }
    rows.sort((a, b) => b.str - a.str);
    return new Set(rows.slice(0, 5).map(r => r.id));
  };

  const rows = []; let i = 0;
  while (i < events.length) {
    const d = events[i].date; const day = [];
    while (i < events.length && events[i].date === d) day.push(events[i++]);
    const topsBy = new Map();
    for (const e of day) if (!topsBy.has(e.sport)) topsBy.set(e.sport, topIds(e.sport));

    for (const e of day) {
      if (e.date < FROM) continue;
      const forWd = e.wallets.filter(w => w.side === e.sideKey);
      const agWd = e.wallets.filter(w => w.side !== e.sideKey);
      if (!forWd.length || !agWd.length) continue; // opposed universe (expanded: EB needs no n≥8)

      const m = (a, f) => a.length ? mean(a.map(f)) : 0;
      const mx = (a, f) => a.length ? Math.max(...a.map(f)) : 0;

      // legacy EDGE (n≥8 cliff)
      const forW = [], agW = [];
      for (const w of e.wallets) {
        const wr = wrOf(w.id, e.sport); if (wr == null) continue;
        (w.side === e.sideKey ? forW : agW).push({ wr, str: strOf(w.id, e.sport), ...w });
      }
      const hasLegacy = forW.length > 0 && agW.length > 0;
      const edge = hasLegacy ? m(forW, w => w.wr) - m(agW, w => w.wr) : 0;
      const meanAg = hasLegacy ? m(agW, w => w.wr) : 50;
      const topFor = hasLegacy ? mx(forW, w => w.wr) : 0;
      const topAg = hasLegacy ? mx(agW, w => w.wr) : 0;
      const fs = forW.filter(w => w.str != null), as_ = agW.filter(w => w.str != null);
      const dStrength = (fs.length && as_.length) ? m(fs, w => w.str) - m(as_, w => w.str) : 0;

      // Bayesian EDGE — every wallet contributes, precision-weighted
      const ebSide = arr => {
        let num = 0, den = 0;
        for (const w of arr) { const { p, w: prec } = ebOf(w.id, e.sport); num += p * prec; den += prec; }
        return den > 0 ? { p: num / den, prec: den } : { p: 0.5, prec: 0 };
      };
      const ebFor = ebSide(forWd), ebAg = ebSide(agWd);
      const bayesEdge = 100 * (ebFor.p - ebAg.p);
      const bayesPrec = Math.min(ebFor.prec, ebAg.prec);
      // conviction-weighted variant
      const ebSideConv = arr => {
        let num = 0, den = 0;
        for (const w of arr) { const { p, w: prec } = ebOf(w.id, e.sport); const wt = prec * Math.max(0.5, Math.min(3, w.sizeRatio || 1)); num += p * wt; den += wt; }
        return den > 0 ? num / den : 0.5;
      };
      const bayesEdgeConv = 100 * (ebSideConv(forWd) - ebSideConv(agWd));

      const tops = topsBy.get(e.sport) || new Set();
      const netT5 = forWd.filter(w => tops.has(w.id)).length - agWd.filter(w => tops.has(w.id)).length;

      const meanSizeFor = m(forWd, w => w.sizeRatio), meanSizeAg = m(agWd, w => w.sizeRatio);
      const dSize = meanSizeFor - meanSizeAg;
      const sizeShare = (meanSizeFor + meanSizeAg) > 0 ? meanSizeFor / (meanSizeFor + meanSizeAg) : 0.5;
      const maxForSize = mx(forWd, w => w.sizeRatio), maxAgSize = mx(agWd, w => w.sizeRatio);
      const hcFor = forWd.filter(w => w.sizeRatio >= 1.5).length, hcAg = agWd.filter(w => w.sizeRatio >= 1.5).length;
      const hf = forWd.filter(w => w.sizeRatio >= 1.5), ha = agWd.filter(w => w.sizeRatio >= 1.5);
      const dHcSize = (hf.length || ha.length) ? m(hf, w => w.sizeRatio) - m(ha, w => w.sizeRatio) : 0;
      const unopposedHc = hcFor >= 1 && hcAg === 0 ? 1 : 0;
      const hcGate = (hcFor - hcAg) >= 1 || dHcSize > 0 || unopposedHc ? 1 : 0;
      const tf = sum(forWd.map(w => w.contribution)), ta = sum(agWd.map(w => w.contribution));
      const forContribShare = (tf + ta) > 0 ? tf / (tf + ta) : 0.5;
      const dBase = m(forWd, w => w.walletBase) - m(agWd, w => w.walletBase);
      const dRoiNorm = m(forWd, w => w.roiNorm) - m(agWd, w => w.roiNorm);
      const moneyFor = sum(forWd.map(w => w.invested)), moneyAg = sum(agWd.map(w => w.invested));
      const moneyShare = (moneyFor + moneyAg) > 0 ? moneyFor / (moneyFor + moneyAg) : 0.5;
      const implied = e.odds ? (e.odds > 0 ? 100 / (e.odds + 100) : Math.abs(e.odds) / (Math.abs(e.odds) + 100)) : 0.5;
      const fadeStrongAg = topAg >= 60 && topAg > topFor ? 1 : 0;

      rows.push({
        date: e.date, sport: e.sport, won: e.won, flat: flatRet(e.odds, e.won === 1),
        hasLegacy: hasLegacy ? 1 : 0,
        edge, meanAg, dStrength, bayesEdge, bayesEdgeConv, bayesPrec,
        netT5, dSize, sizeShare, maxForSize, maxAgSize, dHcSize, hcGate, unopposedHc,
        hcMarginWd: hcFor - hcAg, forContribShare, moneyShare, dBase, dRoiNorm,
        deltaW: e.deltaW, deltaQ: e.deltaQ, agsV12: e.agsV12, hcMargin: e.hcMargin,
        forCount: forWd.length, agCount: agWd.length, dCount: forWd.length - agWd.length,
        implied, fadeStrongAg,
        isMLB: e.sport === 'MLB' ? 1 : 0,
      });
    }
    for (const e of day) for (const w of e.wallets) {
      if (w.side !== e.sideKey) continue;
      const s = S(w.id, e.sport);
      if (e.won) { s.w++; s.ret++; } else { s.l++; s.ret--; }
      s.n++;
    }
  }

  console.error(`rows=${rows.length} legacy=${rows.filter(r => r.hasLegacy).length}`);

  const FEATS_INT = ['edge', 'bayesEdge', 'bayesEdgeConv', 'bayesPrec', 'meanAg', 'dStrength', 'netT5',
    'dSize', 'sizeShare', 'maxForSize', 'maxAgSize', 'dHcSize', 'hcGate', 'unopposedHc', 'hcMarginWd',
    'forContribShare', 'moneyShare', 'dBase', 'dRoiNorm', 'deltaW', 'deltaQ', 'agsV12', 'hcMargin',
    'forCount', 'agCount', 'dCount', 'isMLB'];
  const FEATS_MKT = [...FEATS_INT, 'implied', 'fadeStrongAg'];

  const toX = (set, feats) => set.map(r => feats.map(f => Number.isFinite(r[f]) ? r[f] : 0));

  // ── time-series CV: 4 expanding folds ──
  const chron = [...rows].sort((a, b) => a.date < b.date ? -1 : 1);
  const nFolds = 4;
  const foldSize = Math.floor(chron.length / (nFolds + 1));
  const folds = [];
  for (let f = 0; f < nFolds; f++) {
    const trainEnd = foldSize * (f + 1);
    const testEnd = Math.min(chron.length, trainEnd + foldSize);
    folds.push({ train: chron.slice(0, trainEnd), test: chron.slice(trainEnd, testEnd) });
  }

  function evalScore(set, scoreFn){
    const pairs = set.map(r => ({ s: scoreFn(r), y: r.won }));
    return auc(pairs);
  }
  function evalTop(set, scoreFn, frac = 0.2){
    const scored = set.map(r => ({ ...r, s: scoreFn(r) })).sort((a, b) => a.s - b.s);
    const top = scored.slice(Math.floor(scored.length * (1 - frac)));
    const k = sum(top.map(r => r.won));
    const p0 = mean(set.map(r => r.won));
    const z = (k / top.length - p0) / Math.sqrt(p0 * (1 - p0) / top.length);
    return { n: top.length, wr: rnd(100 * k / top.length, 1), flat: rnd(100 * mean(top.map(r => r.flat)), 1), pOne: rnd(1 - normCdf(z), 4) };
  }

  const cv = { edge: [], bayes: [], bayesConv: [], gbmInt: [], gbmMkt: [], gate: [] };
  const gbmImpAgg = Object.fromEntries(FEATS_MKT.map(f => [f, 0]));

  for (const [fi, fold] of folds.entries()) {
    const { train, test } = fold;
    // inner validation split for early stopping
    const cut = Math.floor(train.length * 0.8);
    const tr = train.slice(0, cut), va = train.slice(cut);

    cv.edge.push(evalScore(test, r => r.edge));
    cv.bayes.push(evalScore(test, r => r.bayesEdge));
    cv.bayesConv.push(evalScore(test, r => r.bayesEdgeConv));
    cv.gate.push(evalScore(test, r => (r.edge >= 5 && r.hcGate ? 1 : 0)));

    const gbmI = fitGBM(toX(tr, FEATS_INT), tr.map(r => r.won), toX(va, FEATS_INT), va.map(r => r.won), { depth: 3 });
    cv.gbmInt.push(evalScore(test, r => gbmI.predict(FEATS_INT.map(f => Number.isFinite(r[f]) ? r[f] : 0))));

    const gbmM = fitGBM(toX(tr, FEATS_MKT), tr.map(r => r.won), toX(va, FEATS_MKT), va.map(r => r.won), { depth: 3 });
    cv.gbmMkt.push(evalScore(test, r => gbmM.predict(FEATS_MKT.map(f => Number.isFinite(r[f]) ? r[f] : 0))));
    FEATS_MKT.forEach((f, j) => gbmImpAgg[f] += gbmM.featImp[j]);
    console.error(`fold ${fi + 1}: edge=${rnd(cv.edge[fi], 3)} bayes=${rnd(cv.bayes[fi], 3)} gbmInt=${rnd(cv.gbmInt[fi], 3)} gbmMkt=${rnd(cv.gbmMkt[fi], 3)} (trees ${gbmI.nUsed}/${gbmM.nUsed})`);
  }

  // ── final holdout: last 30% ──
  const cutFinal = Math.floor(chron.length * 0.7);
  const trF = chron.slice(0, cutFinal), teF = chron.slice(cutFinal);
  const cut2 = Math.floor(trF.length * 0.8);
  const gbmIntF = fitGBM(toX(trF.slice(0, cut2), FEATS_INT), trF.slice(0, cut2).map(r => r.won), toX(trF.slice(cut2), FEATS_INT), trF.slice(cut2).map(r => r.won), { depth: 3 });
  const gbmMktF = fitGBM(toX(trF.slice(0, cut2), FEATS_MKT), trF.slice(0, cut2).map(r => r.won), toX(trF.slice(cut2), FEATS_MKT), trF.slice(cut2).map(r => r.won), { depth: 3 });

  const scoreIntF = r => gbmIntF.predict(FEATS_INT.map(f => Number.isFinite(r[f]) ? r[f] : 0));
  const scoreMktF = r => gbmMktF.predict(FEATS_MKT.map(f => Number.isFinite(r[f]) ? r[f] : 0));

  const holdout = {
    n: teF.length, from: teF[0].date, to: teF[teF.length - 1].date,
    baseWr: rnd(100 * mean(teF.map(r => r.won)), 1),
    edge: aucBoot(teF.map(r => ({ s: r.edge, y: r.won }))),
    bayesEdge: aucBoot(teF.map(r => ({ s: r.bayesEdge, y: r.won }))),
    bayesEdgeConv: aucBoot(teF.map(r => ({ s: r.bayesEdgeConv, y: r.won }))),
    gbmInternal: aucBoot(teF.map(r => ({ s: scoreIntF(r), y: r.won }))),
    gbmMarket: aucBoot(teF.map(r => ({ s: scoreMktF(r), y: r.won }))),
    top20: {
      edge: evalTop(teF, r => r.edge),
      bayesEdge: evalTop(teF, r => r.bayesEdge),
      gbmInternal: evalTop(teF, r => scoreIntF(r)),
      gbmMarket: evalTop(teF, r => scoreMktF(r)),
    },
    top10: {
      gbmInternal: evalTop(teF, r => scoreIntF(r), 0.1),
      gbmMarket: evalTop(teF, r => scoreMktF(r), 0.1),
    },
    gateRef: (() => {
      const g = teF.filter(r => r.edge >= 5 && r.hcGate);
      if (g.length < 8) return null;
      const k = sum(g.map(r => r.won)); const [lo, hi] = binomCI(k, g.length);
      return { n: g.length, wr: rnd(100 * k / g.length, 1), ci: [rnd(100 * lo, 1), rnd(100 * hi, 1)], flat: rnd(100 * mean(g.map(r => r.flat)), 1) };
    })(),
  };

  // GBM quintiles on holdout (internal)
  const scoredI = teF.map(r => ({ ...r, p: scoreIntF(r) })).sort((a, b) => a.p - b.p);
  const gbmQs = [];
  for (let q = 0; q < 5; q++) {
    const a = (q * scoredI.length / 5) | 0, b = ((q + 1) * scoredI.length / 5) | 0;
    const h = scoredI.slice(a, b);
    const k = sum(h.map(x => x.won)); const [lo, hi] = binomCI(k, h.length);
    gbmQs.push({ q: q + 1, n: h.length, wr: rnd(100 * k / h.length, 1), ci: [rnd(100 * lo, 1), rnd(100 * hi, 1)], meanP: rnd(100 * mean(h.map(x => x.p)), 1), flat: rnd(100 * mean(h.map(x => x.flat)), 1) });
  }

  // Bayes edge quintiles on full expanded universe
  const scoredB = [...rows].sort((a, b) => a.bayesEdge - b.bayesEdge);
  const bayesQs = [];
  for (let q = 0; q < 5; q++) {
    const a = (q * scoredB.length / 5) | 0, b = ((q + 1) * scoredB.length / 5) | 0;
    const h = scoredB.slice(a, b);
    const k = sum(h.map(x => x.won));
    bayesQs.push({ q: q + 1, n: h.length, wr: rnd(100 * k / h.length, 1), lo: rnd(h[0].bayesEdge, 1), hi: rnd(h[h.length - 1].bayesEdge, 1), flat: rnd(100 * mean(h.map(x => x.flat)), 1) });
  }

  const imp = Object.entries(gbmImpAgg).map(([f, v]) => ({ f, imp: rnd(v, 1) })).sort((a, b) => b.imp - a.imp);
  const impTotal = sum(imp.map(x => x.imp));
  const impPct = imp.map(x => ({ f: x.f, pct: rnd(100 * x.imp / impTotal, 1) }));

  const out = {
    meta: {
      n: rows.length, nLegacy: rows.filter(r => r.hasLegacy).length,
      from: FROM, to: chron[chron.length - 1].date, baseWr: rnd(100 * mean(rows.map(r => r.won)), 1),
      priorK: PRIOR_K, folds: nFolds,
      sports: Object.fromEntries([...new Set(rows.map(r => r.sport))].map(s => [s, rows.filter(r => r.sport === s).length])),
    },
    cvMeanAuc: Object.fromEntries(Object.entries(cv).map(([k, v]) => [k, rnd(mean(v.filter(Number.isFinite)), 3)])),
    cvPerFold: Object.fromEntries(Object.entries(cv).map(([k, v]) => [k, v.map(x => rnd(x, 3))])),
    holdout, gbmQs, bayesQs, featureImportance: impPct.slice(0, 18),
  };
  writeFileSync('/tmp/deep_winner_model.json', JSON.stringify(out));
  console.log(JSON.stringify(out, null, 2));
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
