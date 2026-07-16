/**
 * _for_vs_ag_supermetric.mjs — search for the best FOR-vs-AGAINST wallet
 * relationship metric: rank/percentile × conviction × counts.
 *
 * Percentiles: each day, rank every rated wallet (n≥5 graded, EB-shrunk WR)
 * within its sport — as-of, causal. Tiers: top/bottom 10% and 20%.
 *
 * Metrics tested (side-level, FOR vs AG):
 *   pctlEdge        mean percentile FOR − AG
 *   convPctlEdge    Σ(pctl−.5)·min(sr,3) FOR − AG  (rank × relative size)
 *   asymEdge        like pctlEdge but bad wallets weighted 2× (bad persists)
 *   mix10 / mix20   (topFor + botAg) − (topAg + botFor) tier counts
 *   convMix20       same counts but conviction-scaled (sr/1.5 capped at 2)
 *   smartDumb       smart whales FOR (pctl≥.7 & sr≥1.5) + dumb whales AG
 *                   (pctl≤.3 & sr≥1.5) − mirror terms
 *   nBal            wallet-count balance (nFor−nAg)/(nFor+nAg)
 *   refs: bayesEdge, agWeak
 *
 * Output: AUC full/holdout, holdout quintiles for best metrics, the user's
 * exact hypothesis cells, rule table with HC combos, June 1+ subset.
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

const FROM = '2026-05-10', HIST_FROM = '2026-04-01', K = 12, HC_RATIO = 1.5, RATED_N = 5;

const shortId = w => String(w || '').toLowerCase().slice(-6);
const mean = xs => xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : null;
const sum = xs => xs.reduce((s, x) => s + x, 0);
const rnd = (x, n = 3) => !Number.isFinite(x) ? null : Math.round(x * 10 ** n) / 10 ** n;
const a2d = o => o > 0 ? 1 + o / 100 : 1 + 100 / Math.abs(o);
const flatRet = (o, w) => !o ? (w ? 0.91 : -1) : (w ? a2d(o) - 1 : -1);
function erf(x){const s=Math.sign(x);x=Math.abs(x);const t=1/(1+0.3275911*x);return s*(1-((((1.061405429*t-1.453152027)*t+1.421413741)*t-0.284496736)*t+0.254829592)*t*Math.exp(-x*x));}
const binomP = (k, n, p0) => n < 5 ? null : 1 - 0.5 * (1 + erf(((k - n * p0) / Math.sqrt(n * p0 * (1 - p0))) / Math.SQRT2));
function auc(pairs){
  const pos = pairs.filter(p => p.y === 1).length, neg = pairs.length - pos;
  if (!pos || !neg) return null;
  const all = [...pairs].sort((a, b) => a.s - b.s);
  let rank = 1, i = 0, rPos = 0;
  while (i < all.length) {
    let j = i; while (j < all.length && all[j].s === all[i].s) j++;
    const avg = (2 * rank + (j - i) - 1) / 2;
    for (let k2 = i; k2 < j; k2++) if (all[k2].y === 1) rPos += avg;
    rank += j - i; i = j;
  }
  return (rPos - pos * (pos + 1) / 2) / (pos * neg);
}

(async () => {
  const cols = [['sharpFlowPicks', 'ML'], ['sharpFlowSpreads', 'SPREAD'], ['sharpFlowTotals', 'TOTAL']];
  const events = [];
  for (const [col] of cols) {
    const snap = await db.collection(col).get();
    for (const doc of snap.docs) {
      const data = doc.data();
      if (!data?.date || data.date < HIST_FROM || !data.sides) continue;
      const sport = data.sport || 'NHL';
      for (const [sideKey, sd] of Object.entries(data.sides)) {
        if (sd.superseded) continue;
        const res = sd.result || {};
        if (res.outcome !== 'WIN' && res.outcome !== 'LOSS') continue;
        const scor = (sd.peak || {}).v8Scoring || (sd.lock || {}).v8Scoring || {};
        const wallets = []; const seen = new Set();
        for (const w of (scor.walletDetails || [])) {
          const id = shortId(w.walletShort || w.wallet);
          if (!id || seen.has(id) || !w.side) continue;
          seen.add(id);
          wallets.push({ id, side: w.side, sizeRatio: Number(w.sizeRatio || 0) || 0 });
        }
        if (!wallets.length) continue;
        events.push({ date: data.date, sport, sideKey, won: res.outcome === 'WIN' ? 1 : 0, odds: Number(sd.odds ?? (sd.peak || {}).odds ?? 0) || 0, wallets });
      }
    }
  }
  events.sort((a, b) => a.date < b.date ? -1 : 1);

  const st = new Map();
  const G = k2 => { if (!st.has(k2)) st.set(k2, { w: 0, l: 0 }); return st.get(k2); };
  const eb = x => { const n = x.w + x.l; return { p: (x.w + 0.5 * K) / (n + K), prec: n / (n + K), n }; };

  const rows = []; let i = 0;
  while (i < events.length) {
    const d = events[i].date; const day = [];
    while (i < events.length && events[i].date === d) day.push(events[i++]);

    // as-of percentile tables per sport (rated wallets only)
    const tables = new Map();
    const sports = new Set(day.map(e => e.sport));
    for (const s of sports) {
      const vals = [];
      for (const [key, x] of st) {
        if (!key.endsWith('|' + s)) continue;
        if (x.w + x.l >= RATED_N) vals.push(eb(x).p);
      }
      vals.sort((a, b) => a - b);
      tables.set(s, vals);
    }
    const pctlOf = (id, s) => {
      const x = st.get(id + '|' + s); if (!x || x.w + x.l < RATED_N) return null;
      const vals = tables.get(s); if (!vals || vals.length < 10) return null;
      const p = eb(x).p;
      let lo = 0, hi = vals.length;
      while (lo < hi) { const m = (lo + hi) >> 1; if (vals[m] < p) lo = m + 1; else hi = m; }
      let hi2 = lo; while (hi2 < vals.length && vals[hi2] <= p) hi2++;
      return ((lo + hi2) / 2) / vals.length;
    };

    for (const e of day) {
      if (e.date < FROM) continue;
      const forWd = e.wallets.filter(w => w.side === e.sideKey);
      const agWd = e.wallets.filter(w => w.side !== e.sideKey);
      if (!forWd.length || !agWd.length) continue;

      for (const w of [...forWd, ...agWd]) w.pctl = pctlOf(w.id, e.sport);
      const ratedF = forWd.filter(w => w.pctl != null), ratedA = agWd.filter(w => w.pctl != null);

      // refs
      const wMean = arr => { let n = 0, dn = 0; for (const w of arr) { const { p, prec } = eb(G(w.id + '|' + e.sport)); n += p * prec; dn += prec; } return dn > 0 ? n / dn : 0.5; };
      const bayesEdge = 100 * (wMean(forWd) - wMean(agWd));
      const agWeak = 100 * (0.5 - wMean(agWd));
      const hcF = forWd.filter(w => w.sizeRatio >= HC_RATIO), hcA = agWd.filter(w => w.sizeRatio >= HC_RATIO);
      const dHcSize = (hcF.length || hcA.length) ? (hcF.length ? mean(hcF.map(w => w.sizeRatio)) : 0) - (hcA.length ? mean(hcA.map(w => w.sizeRatio)) : 0) : 0;
      const hcGate = (hcF.length - hcA.length) >= 1 || dHcSize > 0 || (hcF.length >= 1 && hcA.length === 0) ? 1 : 0;

      // percentile metrics
      const pctlEdge = (ratedF.length && ratedA.length) ? 100 * (mean(ratedF.map(w => w.pctl)) - mean(ratedA.map(w => w.pctl))) : null;
      const conv = w => Math.min(w.sizeRatio || 0, 3);
      const convSum = arr => sum(arr.map(w => (w.pctl - 0.5) * conv(w)));
      const convPctlEdge = (ratedF.length && ratedA.length) ? 100 * (convSum(ratedF) - convSum(ratedA)) / Math.max(1, ratedF.length + ratedA.length) : null;
      const vAsym = p => p < 0.35 ? 2 * (p - 0.5) : (p - 0.5);
      const asymEdge = (ratedF.length && ratedA.length) ? 100 * (mean(ratedF.map(w => vAsym(w.pctl))) - mean(ratedA.map(w => vAsym(w.pctl)))) : null;

      // tier counts
      const cnt = (arr, f) => arr.filter(f).length;
      const top10F = cnt(ratedF, w => w.pctl >= 0.9), top10A = cnt(ratedA, w => w.pctl >= 0.9);
      const bot10F = cnt(ratedF, w => w.pctl <= 0.1), bot10A = cnt(ratedA, w => w.pctl <= 0.1);
      const top20F = cnt(ratedF, w => w.pctl >= 0.8), top20A = cnt(ratedA, w => w.pctl >= 0.8);
      const bot20F = cnt(ratedF, w => w.pctl <= 0.2), bot20A = cnt(ratedA, w => w.pctl <= 0.2);
      const mix10 = (top10F + bot10A) - (top10A + bot10F);
      const mix20 = (top20F + bot20A) - (top20A + bot20F);
      const cw = w => Math.min((w.sizeRatio || 0) / 1.5, 2);
      const convMix20 = sum(ratedF.filter(w => w.pctl >= 0.8).map(cw)) + sum(ratedA.filter(w => w.pctl <= 0.2).map(cw))
                      - sum(ratedA.filter(w => w.pctl >= 0.8).map(cw)) - sum(ratedF.filter(w => w.pctl <= 0.2).map(cw));

      // smart/dumb whales
      const smartF = cnt(ratedF, w => w.pctl >= 0.7 && w.sizeRatio >= HC_RATIO);
      const smartA = cnt(ratedA, w => w.pctl >= 0.7 && w.sizeRatio >= HC_RATIO);
      const dumbF = cnt(ratedF, w => w.pctl <= 0.3 && w.sizeRatio >= HC_RATIO);
      const dumbA = cnt(ratedA, w => w.pctl <= 0.3 && w.sizeRatio >= HC_RATIO);
      const smartDumb = (smartF + dumbA) - (smartA + dumbF);

      const nBal = (forWd.length - agWd.length) / (forWd.length + agWd.length);

      rows.push({
        date: e.date, won: e.won, flat: flatRet(e.odds, e.won === 1),
        bayesEdge, agWeak, hcGate,
        pctlEdge, convPctlEdge, asymEdge, mix10, mix20, convMix20, smartDumb, nBal,
        top10F, top10A, bot10F, bot10A, top20F, top20A, bot20F, bot20A,
        smartF, smartA, dumbF, dumbA,
        nRatedF: ratedF.length, nRatedA: ratedA.length,
      });
    }

    for (const e of day) for (const w of e.wallets) {
      if (w.side !== e.sideKey) continue;
      const x = G(w.id + '|' + e.sport); if (e.won) x.w++; else x.l++;
    }
  }

  const chron = [...rows].sort((a, b) => a.date < b.date ? -1 : 1);
  const cut = Math.floor(chron.length * 0.6);
  const train = chron.slice(0, cut), test = chron.slice(cut);
  const baseWr = mean(chron.map(r => r.won));
  const june = chron.filter(r => r.date >= '2026-06-01');

  const seg = (set, fn) => { const h = set.filter(fn); if (!h.length) return { n: 0 };
    const k2 = sum(h.map(r => r.won));
    return { n: h.length, wr: rnd(100 * k2 / h.length, 1), flat: rnd(100 * mean(h.map(r => r.flat)), 1), p: rnd(binomP(k2, h.length, baseWr), 4) }; };
  const tri = fn => ({ train: seg(train, fn), test: seg(test, fn), all: seg(chron, fn), june: seg(june, fn) });

  // metric AUCs
  const metrics = ['bayesEdge', 'agWeak', 'pctlEdge', 'convPctlEdge', 'asymEdge', 'mix10', 'mix20', 'convMix20', 'smartDumb', 'nBal'];
  const aucs = {};
  for (const m of metrics) {
    const ok = chron.filter(r => r[m] != null && Number.isFinite(r[m]));
    const okT = test.filter(r => r[m] != null && Number.isFinite(r[m]));
    aucs[m] = { n: ok.length, full: rnd(auc(ok.map(r => ({ s: r[m], y: r.won })))), holdout: rnd(auc(okT.map(r => ({ s: r[m], y: r.won })))) };
  }

  // user's exact hypothesis cells (top/bot 20% for sample; 10% too)
  const hypo = {
    'top20For>=2 (alone)': tri(r => r.top20F >= 2),
    'top20For>=2 & bot20Ag=0': tri(r => r.top20F >= 2 && r.bot20A === 0),
    'top20For>=2 & bot20Ag>=1': tri(r => r.top20F >= 2 && r.bot20A >= 1),
    'top20For>=2 & bot20Ag>=2': tri(r => r.top20F >= 2 && r.bot20A >= 2),
    'top20For>=1 & bot20Ag>=1': tri(r => r.top20F >= 1 && r.bot20A >= 1),
    'bot20Ag>=2 (alone)': tri(r => r.bot20A >= 2),
    'top10For>=1 (alone)': tri(r => r.top10F >= 1),
    'top10For>=1 & bot10Ag>=1': tri(r => r.top10F >= 1 && r.bot10A >= 1),
    'top10For>=2': tri(r => r.top10F >= 2),
  };

  // rule table for composite metrics
  const R = {
    'mix20>=2': r => r.mix20 >= 2,
    'mix20>=3': r => r.mix20 >= 3,
    'mix20>=4': r => r.mix20 >= 4,
    'mix20>=2 & HC': r => r.mix20 >= 2 && r.hcGate,
    'mix20>=3 & HC': r => r.mix20 >= 3 && r.hcGate,
    'mix10>=1': r => r.mix10 >= 1,
    'mix10>=2': r => r.mix10 >= 2,
    'mix10>=2 & HC': r => r.mix10 >= 2 && r.hcGate,
    'convMix20>=2': r => r.convMix20 >= 2,
    'convMix20>=3': r => r.convMix20 >= 3,
    'convMix20>=4': r => r.convMix20 >= 4,
    'convMix20>=2.5 & HC': r => r.convMix20 >= 2.5 && r.hcGate,
    'smartDumb>=1': r => r.smartDumb >= 1,
    'smartDumb>=2': r => r.smartDumb >= 2,
    'dumbWhaleAg>=1 & smartAg=0': r => r.dumbA >= 1 && r.smartA === 0,
    'smartF>=1 & dumbA>=1': r => r.smartF >= 1 && r.dumbA >= 1,
    'pctlEdge>=15': r => r.pctlEdge != null && r.pctlEdge >= 15,
    'pctlEdge>=25': r => r.pctlEdge != null && r.pctlEdge >= 25,
    'asymEdge>=10': r => r.asymEdge != null && r.asymEdge >= 10,
    'asymEdge>=15': r => r.asymEdge != null && r.asymEdge >= 15,
    'asymEdge>=10 & HC': r => r.asymEdge != null && r.asymEdge >= 10 && r.hcGate,
    'convPctlEdge>=8': r => r.convPctlEdge != null && r.convPctlEdge >= 8,
    'convPctlEdge>=12': r => r.convPctlEdge != null && r.convPctlEdge >= 12,
    'convPctlEdge>=8 & HC': r => r.convPctlEdge != null && r.convPctlEdge >= 8 && r.hcGate,
    'REF GATE (BayesE5+HC)': r => r.bayesEdge >= 5 && r.hcGate,
    'REF FADE+HC (agWeak>=4&HC)': r => r.agWeak >= 4 && r.hcGate,
  };
  const rules = Object.entries(R).map(([name, fn]) => ({ name, ...tri(fn) })).filter(x => x.all.n >= 15)
    .sort((a, b) => (b.all.flat ?? -999) - (a.all.flat ?? -999));

  // quintiles for the best composite (decided after aucs; compute for several)
  const quintOf = m => {
    const ok = [...test.filter(r => r[m] != null && Number.isFinite(r[m]))].sort((a, b) => a[m] - b[m]);
    if (ok.length < 60) return null;
    const out = [];
    for (let q = 0; q < 5; q++) {
      const a = (q * ok.length / 5) | 0, b = ((q + 1) * ok.length / 5) | 0;
      const h = ok.slice(a, b);
      out.push({ q: q + 1, lo: rnd(h[0][m], 2), hi: rnd(h[h.length - 1][m], 2), n: h.length,
        wr: rnd(100 * mean(h.map(r => r.won)), 1), flat: rnd(100 * mean(h.map(r => r.flat)), 1) });
    }
    return out;
  };
  const quints = { convMix20: quintOf('convMix20'), mix20: quintOf('mix20'), asymEdge: quintOf('asymEdge'), convPctlEdge: quintOf('convPctlEdge'), bayesEdge: quintOf('bayesEdge') };

  // overlap analysis: asymEdge>=10 & HC vs the two reference rules
  const asymHc = r => r.asymEdge != null && r.asymEdge >= 10 && r.hcGate;
  const gateFn = r => r.bayesEdge >= 5 && r.hcGate;
  const fadeHcFn = r => r.agWeak >= 4 && r.hcGate;
  const months = [...new Set(chron.map(r => r.date.slice(0, 7)))].sort();
  const overlap = {
    asymHcN: chron.filter(asymHc).length,
    inGate: chron.filter(r => asymHc(r) && gateFn(r)).length,
    inFadeHc: chron.filter(r => asymHc(r) && fadeHcFn(r)).length,
    newOnly: seg(chron, r => asymHc(r) && !gateFn(r) && !fadeHcFn(r)),
    newOnlyTrain: seg(train, r => asymHc(r) && !gateFn(r) && !fadeHcFn(r)),
    newOnlyTest: seg(test, r => asymHc(r) && !gateFn(r) && !fadeHcFn(r)),
    superUnion: tri(r => asymHc(r) || gateFn(r) || fadeHcFn(r)),
    monthly: months.map(m => ({ m, ...seg(chron.filter(r => r.date.slice(0, 7) === m), asymHc) })),
    unionMonthly: months.map(m => ({ m, ...seg(chron.filter(r => r.date.slice(0, 7) === m), r => asymHc(r) || gateFn(r) || fadeHcFn(r)) })),
  };

  const out = {
    meta: { n: chron.length, nTrain: train.length, nTest: test.length, cutDate: test[0].date, baseWr: rnd(100 * baseWr, 1),
      ratedCoverage: rnd(100 * mean(chron.map(r => (r.nRatedF > 0 && r.nRatedA > 0) ? 1 : 0)), 1) },
    aucs, hypo, rules, quints, overlap,
  };
  writeFileSync('/tmp/supermetric.json', JSON.stringify(out));
  console.log('done n=' + chron.length);
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
