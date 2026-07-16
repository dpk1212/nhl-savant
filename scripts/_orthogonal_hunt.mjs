/**
 * _orthogonal_hunt.mjs — find a second EDGE + build the WINNER SCORE.
 *
 * Part 1: new feature families (not EDGE/size/HC):
 *   - teamForm / oppForm / formDiff  (as-of team record from our graded picks)
 *   - streak features (wallet last-5 form, FOR−AG)
 *   - market-specialist wallet WR (wallet WR on this market type, as-of)
 *   - cross-sport wallet WR (global prior)
 *   - odds features: fav/dog, odds move peak→final
 *   - concentration: money Herfindahl, WR variance
 *   - attention: total wallets, total money (log)
 *   - dow, market type
 * Evaluate univariate AUC (full + last-40% holdout) and incremental value
 * over BayesEdge+HC.
 *
 * Part 2: WINNER SCORE = calibrated logistic on the best stack.
 *   Train ≤70%, isotonic-bin calibration on train, monotone check on holdout.
 */
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(join(__dirname, '../serviceAccountKey.json'), 'utf8'))) });
}
const db = admin.firestore();

const FROM = '2026-05-10';
const HIST_FROM = '2026-04-01';
const MIN_N = 8;
const KPRIOR = 12;

const shortId = w => String(w || '').toLowerCase().slice(-6);
const mean = xs => xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : null;
const sum = xs => xs.reduce((s, x) => s + x, 0);
const rnd = (x, n = 3) => !Number.isFinite(x) ? null : Math.round(x * 10 ** n) / 10 ** n;
const a2d = o => o > 0 ? 1 + o / 100 : 1 + 100 / Math.abs(o);
const flatRet = (o, w) => !o ? (w ? 0.91 : -1) : (w ? a2d(o) - 1 : -1);
function erf(x){const s=Math.sign(x);x=Math.abs(x);const t=1/(1+0.3275911*x);return s*(1-((((1.061405429*t-1.453152027)*t+1.421413741)*t-0.284496736)*t+0.254829592)*t*Math.exp(-x*x));}
const normCdf = z => 0.5 * (1 + erf(z / Math.SQRT2));
function binomCI(k, n, z = 1.96){ const p = k / n, den = 1 + z*z/n; const c = (p + z*z/(2*n)) / den; const h = z * Math.sqrt(p*(1-p)/n + z*z/(4*n*n)) / den; return [c - h, c + h]; }
function auc(pairs){
  const pos = pairs.filter(p => p.y === 1).length, neg = pairs.length - pos;
  if (!pos || !neg) return null;
  const all = [...pairs].sort((a, b) => a.s - b.s);
  let rank = 1, i = 0, rPos = 0;
  while (i < all.length) {
    let j = i; while (j < all.length && all[j].s === all[i].s) j++;
    const avg = (2 * rank + (j - i) - 1) / 2;
    for (let k = i; k < j; k++) if (all[k].y === 1) rPos += avg;
    rank += j - i; i = j;
  }
  return (rPos - pos * (pos + 1) / 2) / (pos * neg);
}
function aucBoot(pairs, B = 400){
  const a0 = auc(pairs); const s = [];
  for (let b = 0; b < B; b++) {
    const samp = []; for (let i = 0; i < pairs.length; i++) samp.push(pairs[(Math.random() * pairs.length) | 0]);
    const a = auc(samp); if (a != null) s.push(a);
  }
  s.sort((x, y) => x - y);
  return { auc: rnd(a0), lo: rnd(s[(0.025 * s.length) | 0]), hi: rnd(s[(0.975 * s.length) | 0]) };
}

(async () => {
  const cols = [['sharpFlowPicks', 'ML'], ['sharpFlowSpreads', 'SPREAD'], ['sharpFlowTotals', 'TOTAL']];
  const events = [];
  for (const [col, mkt] of cols) {
    const snap = await db.collection(col).get();
    for (const doc of snap.docs) {
      const data = doc.data();
      if (!data?.date || data.date < HIST_FROM || !data.sides) continue;
      const sport = data.sport || 'NHL';
      const sideKeys = Object.keys(data.sides);
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
          wallets.push({ id, side: w.side, sizeRatio: Number(w.sizeRatio || 0) || 0, invested: Number(w.invested || 0) || 0 });
        }
        if (!wallets.length) continue;
        const otherKey = sideKeys.find(k => k !== sideKey);
        const otherTeam = otherKey ? String(data.sides[otherKey]?.team || otherKey) : null;
        const odds = Number(sd.odds ?? peak.odds ?? 0) || 0;
        const peakOdds = Number(peak.odds ?? 0) || 0;
        const lockOdds = Number(lock.odds ?? 0) || 0;
        events.push({
          docId: doc.id, date: data.date, sport, mkt, sideKey,
          team: String(sd.team || sideKey), otherTeam,
          won: res.outcome === 'WIN' ? 1 : 0, odds, peakOdds, lockOdds, wallets,
        });
      }
    }
  }
  events.sort((a, b) => a.date < b.date ? -1 : 1);

  // ── as-of state ──
  const st = new Map();          // wallet|sport → {w,l}
  const stMkt = new Map();       // wallet|sport|mkt → {w,l}
  const stGlob = new Map();      // wallet → {w,l}
  const streaks = new Map();     // wallet|sport → recent results array (max 6)
  const teamRec = new Map();     // team|sport → recent results array (max 12)

  const G = (map, k) => { if (!map.has(k)) map.set(k, { w: 0, l: 0 }); return map.get(k); };
  const wrOf = (id, s) => { const x = G(st, id + '|' + s); const n = x.w + x.l; return n < MIN_N ? null : 100 * x.w / n; };
  const ebOf = (id, s) => { const x = G(st, id + '|' + s); const n = x.w + x.l; return { p: (x.w + 0.5 * KPRIOR) / (n + KPRIOR), prec: n / (n + KPRIOR) }; };
  const ebMkt = (id, s, m) => { const x = G(stMkt, id + '|' + s + '|' + m); const n = x.w + x.l; return { p: (x.w + 0.5 * KPRIOR) / (n + KPRIOR), prec: n / (n + KPRIOR) }; };
  const ebGlob = (id) => { const x = G(stGlob, id); const n = x.w + x.l; return { p: (x.w + 0.5 * KPRIOR) / (n + KPRIOR), prec: n / (n + KPRIOR) }; };
  const streakOf = (id, s) => { const a = streaks.get(id + '|' + s) || []; return a.length >= 3 ? mean(a) : null; };
  const teamForm = (team, s) => { const a = teamRec.get(team + '|' + s) || []; return a.length >= 4 ? mean(a) : null; };

  const rows = []; let i = 0;
  while (i < events.length) {
    const d = events[i].date; const day = [];
    while (i < events.length && events[i].date === d) day.push(events[i++]);

    for (const e of day) {
      if (e.date < FROM) continue;
      const forWd = e.wallets.filter(w => w.side === e.sideKey);
      const agWd = e.wallets.filter(w => w.side !== e.sideKey);
      if (!forWd.length || !agWd.length) continue;

      // BayesEdge + HC (established stack)
      const ebSide = arr => { let n = 0, dn = 0; for (const w of arr) { const { p, prec } = ebOf(w.id, e.sport); n += p * prec; dn += prec; } return dn > 0 ? n / dn : 0.5; };
      const bayesEdge = 100 * (ebSide(forWd) - ebSide(agWd));
      const hcFor = forWd.filter(w => w.sizeRatio >= 1.5).length, hcAg = agWd.filter(w => w.sizeRatio >= 1.5).length;
      const hf = forWd.filter(w => w.sizeRatio >= 1.5), ha = agWd.filter(w => w.sizeRatio >= 1.5);
      const dHcSize = (hf.length || ha.length) ? (hf.length ? mean(hf.map(w => w.sizeRatio)) : 0) - (ha.length ? mean(ha.map(w => w.sizeRatio)) : 0) : 0;
      const hcGate = (hcFor - hcAg) >= 1 || dHcSize > 0 || (hcFor >= 1 && hcAg === 0) ? 1 : 0;
      // legacy edge for reference
      const forW = [], agW = [];
      for (const w of e.wallets) { const wr = wrOf(w.id, e.sport); if (wr == null) continue; (w.side === e.sideKey ? forW : agW).push(wr); }
      const edge = (forW.length && agW.length) ? mean(forW) - mean(agW) : null;

      // ── NEW FAMILIES ──
      // 1. team form
      const tf = teamForm(e.team, e.sport);
      const of_ = e.otherTeam ? teamForm(e.otherTeam, e.sport) : null;
      const formDiff = (tf != null && of_ != null) ? 100 * (tf - of_) : null;

      // 2. wallet streak (last-5 form) FOR−AG
      const sf = forWd.map(w => streakOf(w.id, e.sport)).filter(x => x != null);
      const sa = agWd.map(w => streakOf(w.id, e.sport)).filter(x => x != null);
      const dStreak = (sf.length && sa.length) ? 100 * (mean(sf) - mean(sa)) : null;

      // 3. market-specialist edge
      const mktSide = arr => { let n = 0, dn = 0; for (const w of arr) { const { p, prec } = ebMkt(w.id, e.sport, e.mkt); n += p * prec; dn += prec; } return dn > 0 ? n / dn : 0.5; };
      const mktEdge = 100 * (mktSide(forWd) - mktSide(agWd));

      // 4. global (cross-sport) edge
      const globSide = arr => { let n = 0, dn = 0; for (const w of arr) { const { p, prec } = ebGlob(w.id); n += p * prec; dn += prec; } return dn > 0 ? n / dn : 0.5; };
      const globEdge = 100 * (globSide(forWd) - globSide(agWd));

      // 5. odds features
      const implied = e.odds ? (e.odds > 0 ? 100 / (e.odds + 100) : Math.abs(e.odds) / (Math.abs(e.odds) + 100)) : 0.5;
      const isFav = implied > 0.5 ? 1 : 0;
      const oddsMove = (e.peakOdds && e.lockOdds) ? (a2d(e.peakOdds) - a2d(e.lockOdds)) : 0; // + means price shortened (steam toward us)

      // 6. concentration
      const mF = sum(forWd.map(w => Math.max(0, w.invested)));
      const herf = mF > 0 ? sum(forWd.map(w => (Math.max(0, w.invested) / mF) ** 2)) : 1;
      const wrsF = forWd.map(w => { const x = G(st, w.id + '|' + e.sport); const n = x.w + x.l; return n >= 4 ? x.w / n : null; }).filter(x => x != null);
      const wrVarF = wrsF.length >= 2 ? mean(wrsF.map(x => (x - mean(wrsF)) ** 2)) : null;

      // 7. attention
      const nWallets = e.wallets.length;
      const logMoney = Math.log10(1 + sum(e.wallets.map(w => Math.max(0, w.invested))));

      // 8. calendar / market
      const dow = new Date(e.date + 'T12:00:00Z').getUTCDay();
      const isWeekend = dow === 0 || dow === 6 ? 1 : 0;
      const isTotal = e.mkt === 'TOTAL' ? 1 : 0;

      rows.push({
        date: e.date, sport: e.sport, mkt: e.mkt, won: e.won, flat: flatRet(e.odds, e.won === 1),
        bayesEdge, hcGate, edge,
        formDiff, teamF: tf != null ? 100 * tf : null, dStreak, mktEdge, globEdge,
        implied, isFav, oddsMove, herf, wrVarF, nWallets, logMoney, isWeekend, isTotal,
        gate: bayesEdge >= 5 && hcGate ? 1 : 0,
      });
    }

    // update states AFTER day
    for (const e of day) {
      for (const w of e.wallets) {
        if (w.side !== e.sideKey) continue;
        const a = G(st, w.id + '|' + e.sport); const b = G(stMkt, w.id + '|' + e.sport + '|' + e.mkt); const c = G(stGlob, w.id);
        if (e.won) { a.w++; b.w++; c.w++; } else { a.l++; b.l++; c.l++; }
        const k = w.id + '|' + e.sport;
        const arr = streaks.get(k) || []; arr.push(e.won); if (arr.length > 5) arr.shift(); streaks.set(k, arr);
      }
      // team records (each graded side = one result for that team; totals excluded)
      if (e.mkt !== 'TOTAL') {
        const k = e.team + '|' + e.sport;
        const arr = teamRec.get(k) || []; arr.push(e.won); if (arr.length > 10) arr.shift(); teamRec.set(k, arr);
      }
    }
  }

  console.error(`rows=${rows.length}`);
  const chron = [...rows].sort((a, b) => a.date < b.date ? -1 : 1);
  const cut = Math.floor(chron.length * 0.6);
  const train = chron.slice(0, cut), test = chron.slice(cut);

  // ── Part 1: univariate + incremental ──
  const feats = ['bayesEdge', 'edge', 'formDiff', 'teamF', 'dStreak', 'mktEdge', 'globEdge',
    'implied', 'isFav', 'oddsMove', 'herf', 'wrVarF', 'nWallets', 'logMoney', 'isWeekend', 'isTotal', 'hcGate'];
  const uni = {};
  for (const f of feats) {
    const sub = rows.filter(r => r[f] != null && Number.isFinite(r[f]));
    const subT = test.filter(r => r[f] != null && Number.isFinite(r[f]));
    if (sub.length < 60) continue;
    uni[f] = {
      n: sub.length,
      full: aucBoot(sub.map(r => ({ s: r[f], y: r.won }))),
      holdout: subT.length > 50 ? aucBoot(subT.map(r => ({ s: r[f], y: r.won }))) : null,
    };
  }

  // incremental over BayesEdge+HC: logistic base vs base+feature (train→test AUC delta)
  function fitLogit(set, names, lambda = 3){
    const stats = {};
    for (const n of names) {
      const xs = set.map(r => Number(r[n])).filter(Number.isFinite);
      const m0 = mean(xs) || 0, sd = Math.sqrt(mean(xs.map(x => (x - m0) ** 2)) || 1) || 1;
      stats[n] = { m: m0, sd };
    }
    const Z = r => names.map(n => { const v = Number(r[n]); return Number.isFinite(v) ? (v - stats[n].m) / stats[n].sd : 0; });
    const X = set.map(r => [1, ...Z(r)]);
    const y = set.map(r => r.won);
    const p = names.length + 1;
    let beta = Array(p).fill(0);
    for (let it = 0; it < 30; it++) {
      const probs = X.map(x => { let s = 0; for (let j = 0; j < p; j++) s += beta[j] * x[j]; return 1 / (1 + Math.exp(-Math.max(-20, Math.min(20, s)))); });
      const W = probs.map(pi => Math.max(1e-6, pi * (1 - pi)));
      const A = Array.from({ length: p }, () => Array(p).fill(0)); const bb = Array(p).fill(0);
      for (let r = 0; r < X.length; r++) {
        const eta = X[r].reduce((s, xj, j) => s + beta[j] * xj, 0);
        const zi = eta + (y[r] - probs[r]) / W[r];
        for (let a = 0; a < p; a++) { bb[a] += X[r][a] * W[r] * zi; for (let b = 0; b < p; b++) A[a][b] += X[r][a] * W[r] * X[r][b]; }
      }
      for (let a = 1; a < p; a++) A[a][a] += lambda;
      const M = A.map((row, r2) => [...row, bb[r2]]);
      for (let c = 0; c < p; c++) {
        let piv = c; for (let r2 = c + 1; r2 < p; r2++) if (Math.abs(M[r2][c]) > Math.abs(M[piv][c])) piv = r2;
        [M[c], M[piv]] = [M[piv], M[c]];
        const dv = M[c][c] || 1e-12; for (let cc = c; cc <= p; cc++) M[c][cc] /= dv;
        for (let r2 = 0; r2 < p; r2++) { if (r2 === c) continue; const f2 = M[r2][c]; for (let cc = c; cc <= p; cc++) M[r2][cc] -= f2 * M[c][cc]; }
      }
      beta = M.map(row => row[p]);
    }
    return { beta, stats, names, predict(r){ const z = Z(r); let s = beta[0]; for (let j = 0; j < z.length; j++) s += beta[j + 1] * z[j]; return 1 / (1 + Math.exp(-Math.max(-20, Math.min(20, s)))); } };
  }

  const BASE = ['bayesEdge', 'hcGate'];
  const baseM = fitLogit(train, BASE);
  const baseAuc = auc(test.map(r => ({ s: baseM.predict(r), y: r.won })));
  const incr = [];
  for (const f of feats) {
    if (BASE.includes(f) || f === 'edge') continue;
    const m = fitLogit(train, [...BASE, f]);
    const a = auc(test.map(r => ({ s: m.predict(r), y: r.won })));
    incr.push({ f, holdoutAuc: rnd(a), delta: rnd(a - baseAuc) });
  }
  incr.sort((a, b) => b.delta - a.delta);

  // ── Part 2: WINNER SCORE ──
  // engineered interaction + candidate stacks, pick best holdout AUC
  for (const r of rows) { r.edgeXhc = (r.bayesEdge || 0) * r.hcGate; r.edgeXimp = (r.bayesEdge || 0) * (r.implied - 0.5); }
  const stacks = {
    base: ['bayesEdge', 'hcGate'],
    baseX: ['bayesEdge', 'hcGate', 'edgeXhc'],
    market: ['bayesEdge', 'hcGate', 'edgeXhc', 'implied'],
    marketFav: ['bayesEdge', 'hcGate', 'edgeXhc', 'implied', 'isFav'],
    full: ['bayesEdge', 'hcGate', 'edgeXhc', 'implied', 'isFav', 'formDiff'],
    fullStreak: ['bayesEdge', 'hcGate', 'edgeXhc', 'implied', 'isFav', 'formDiff', 'dStreak'],
  };
  const stackEval = {};
  let bestKey = null, bestAuc = -1;
  for (const [k, fs] of Object.entries(stacks)) {
    const m = fitLogit(train, fs);
    const a = auc(test.map(r => ({ s: m.predict(r), y: r.won })));
    stackEval[k] = { feats: fs, holdoutAuc: rnd(a) };
    if (a > bestAuc) { bestAuc = a; bestKey = k; }
  }
  const SCORE_FEATS = stacks[bestKey];
  const scoreM = fitLogit(train, SCORE_FEATS);

  // isotonic-ish calibration: train decile bins → empirical WR, monotone pool-adjacent
  const trainScored = train.map(r => ({ p: scoreM.predict(r), y: r.won })).sort((a, b) => a.p - b.p);
  const nb = 10; const bins = [];
  for (let b = 0; b < nb; b++) {
    const a = (b * trainScored.length / nb) | 0, c = ((b + 1) * trainScored.length / nb) | 0;
    const h = trainScored.slice(a, c);
    bins.push({ lo: h[0].p, hi: h[h.length - 1].p, wr: mean(h.map(x => x.y)), n: h.length });
  }
  // pool adjacent violators
  for (let pass = 0; pass < nb; pass++) {
    for (let b = 0; b + 1 < bins.length; b++) {
      if (bins[b].wr > bins[b + 1].wr) {
        const merged = { lo: bins[b].lo, hi: bins[b + 1].hi, wr: (bins[b].wr * bins[b].n + bins[b + 1].wr * bins[b + 1].n) / (bins[b].n + bins[b + 1].n), n: bins[b].n + bins[b + 1].n };
        bins.splice(b, 2, merged);
      }
    }
  }
  const calibrate = p => {
    for (const b of bins) if (p <= b.hi) return b.wr;
    return bins[bins.length - 1].wr;
  };
  const winnerScore = r => 100 * calibrate(scoreM.predict(r));

  // holdout monotone check: score deciles → WR
  const teScored = test.map(r => ({ ...r, ws: winnerScore(r), raw: scoreM.predict(r) })).sort((a, b) => a.raw - b.raw);
  const dec = [];
  const nd = 5;
  for (let b = 0; b < nd; b++) {
    const a = (b * teScored.length / nd) | 0, c = ((b + 1) * teScored.length / nd) | 0;
    const h = teScored.slice(a, c);
    const k = sum(h.map(x => x.won)); const [lo, hi] = binomCI(k, h.length);
    dec.push({ q: b + 1, n: h.length, scoreLo: rnd(h[0].ws, 1), scoreHi: rnd(h[h.length - 1].ws, 1),
      wr: rnd(100 * k / h.length, 1), ci: [rnd(100 * lo, 1), rnd(100 * hi, 1)], flat: rnd(100 * mean(h.map(x => x.flat)), 1) });
  }
  const scoreAuc = aucBoot(test.map(r => ({ s: scoreM.predict(r), y: r.won })));
  const spearman = (() => {
    const xs = teScored.map(x => x.raw), ys = teScored.map(x => x.won);
    const n = xs.length; const rk = a => { const idx = a.map((v, i2) => ({ v, i: i2 })).sort((p, q) => p.v - q.v); const r2 = Array(n); for (let i2 = 0; i2 < n;) { let j = i2; while (j < n && idx[j].v === idx[i2].v) j++; const avg = (i2 + j - 1) / 2 + 1; for (let k2 = i2; k2 < j; k2++) r2[idx[k2].i] = avg; i2 = j; } return r2; };
    const rx = rk(xs), ry = rk(ys); const mx = mean(rx), my = mean(ry);
    let num = 0, dx = 0, dy = 0; for (let i2 = 0; i2 < n; i2++) { const a = rx[i2] - mx, b = ry[i2] - my; num += a * b; dx += a * a; dy += b * b; }
    return rnd(num / Math.sqrt(dx * dy));
  })();

  // gate cross-check inside score
  const gateT = test.filter(r => r.gate === 1);
  const gateWr = gateT.length ? rnd(100 * mean(gateT.map(r => r.won)), 1) : null;

  // does score beat pure market rank? top-20% by score vs top-20% by implied, holdout WR + flat ROI
  const topBy = (key) => {
    const s = [...test].sort((a, b) => b[key] - a[key]).slice(0, Math.floor(test.length * 0.2));
    const k = sum(s.map(x => x.won)); const [lo2, hi2] = binomCI(k, s.length);
    return { n: s.length, wr: rnd(100 * k / s.length, 1), ci: [rnd(100 * lo2, 1), rnd(100 * hi2, 1)], flat: rnd(100 * mean(s.map(x => x.flat)), 1) };
  };
  for (const r of test) r._score = scoreM.predict(r);
  const vsMarket = { byScore: topBy('_score'), byImplied: topBy('implied') };

  // score bands (absolute thresholds usable in prod)
  const bands = [[62, 101], [55, 62], [48, 55], [0, 48]].map(([lo2, hi2]) => {
    const h = test.filter(r => { const w = 100 * calibrate(r._score); return w >= lo2 && w < hi2; });
    if (!h.length) return null;
    const k = sum(h.map(x => x.won));
    return { band: `${lo2}–${hi2 === 101 ? '+' : hi2}`, n: h.length, wr: rnd(100 * k / h.length, 1), flat: rnd(100 * mean(h.map(x => x.flat)), 1) };
  }).filter(Boolean);

  const out = {
    meta: { n: rows.length, nTrain: train.length, nTest: test.length, cutDate: test[0].date, baseWrTest: rnd(100 * mean(test.map(r => r.won)), 1) },
    baseAuc: rnd(baseAuc),
    uni, incr, stackEval, bestStack: bestKey,
    scoreFeats: SCORE_FEATS,
    scoreCoefs: SCORE_FEATS.map((f, j) => ({ f, b: rnd(scoreM.beta[j + 1]), mean: rnd(scoreM.stats[f].m), sd: rnd(scoreM.stats[f].sd) })),
    intercept: rnd(scoreM.beta[0]),
    calibBins: bins.map(b => ({ lo: rnd(b.lo), hi: rnd(b.hi), wr: rnd(100 * b.wr, 1), n: b.n })),
    holdout: { scoreAuc, spearman, deciles: dec, gateRefWr: gateWr, gateRefN: gateT.length, vsMarket, bands },
  };
  writeFileSync('/tmp/orthogonal_hunt.json', JSON.stringify(out));
  console.log(JSON.stringify(out, null, 2));
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
