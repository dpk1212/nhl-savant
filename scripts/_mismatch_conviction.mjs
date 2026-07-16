/**
 * _mismatch_conviction.mjs — add the third dimension (bet size vs wallet's
 * average = conviction) to MISMATCH, testing WHERE it belongs.
 *
 * Forms tested (all causal, as-of percentiles like the supermetric run):
 *   M0  mismatch (current): mean asymPctl FOR − AG, no conviction
 *   M1  symmetric conviction: each wallet's asymPctl × w(sr)   [died before, retest]
 *   M2  fish-only conviction: bad wallets (pctl<.35) get × w(sr), others flat
 *   M3  both-tails conviction: bad AND good (pctl>.65) get × w(sr), middle flat
 *   M4  additive conviction: mismatch + dumbMoneyAg bonus (conviction mass of fish AG)
 *   M5  sqrt-dampened symmetric: asymPctl × sqrt(min(sr,4))
 *   w(sr) = min(sr / 1.5, 2), floor 0.25 for tiny bets  (sr = invested / wallet avg)
 *
 * Direct linearity checks:
 *   L1: WR by max fish-AG sizeRatio bin (is a big-betting fish better than small?)
 *   L2: WR by conviction-weighted fish-AG mass bins
 *   L3: same for star-FOR conviction (does OUR side's size matter?)
 *
 * Eval: AUC full/holdout (May10+ n≈814, cut Jun 19), holdout quintiles,
 * rule table vs M0, and Path C use case (does conviction form rank better?).
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

const FROM = '2026-05-10', HIST_FROM = '2026-04-01', K = 12, RATED_N = 5;

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
  const G = k => { if (!st.has(k)) st.set(k, { w: 0, l: 0 }); return st.get(k); };
  const eb = x => { const n = x.w + x.l; return { p: (x.w + 0.5 * K) / (n + K), prec: n / (n + K) }; };
  const vAsym = p => p < 0.35 ? 2 * (p - 0.5) : (p - 0.5);
  const convW = sr => Math.max(0.25, Math.min((sr || 0) / 1.5, 2));

  const rows = []; let ei = 0;
  while (ei < events.length) {
    const d = events[ei].date; const day = [];
    while (ei < events.length && events[ei].date === d) day.push(events[ei++]);

    const tables = new Map();
    for (const e of day) {
      if (tables.has(e.sport)) continue;
      const vals = [];
      for (const [key, x] of st) {
        if (!key.endsWith('|' + e.sport) || x.w + x.l < RATED_N) continue;
        vals.push(eb(x).p);
      }
      vals.sort((a, b) => a - b);
      tables.set(e.sport, vals);
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
      const rF = forWd.filter(w => w.pctl != null), rA = agWd.filter(w => w.pctl != null);
      if (!rF.length || !rA.length) continue;

      // M0 current
      const m0 = 100 * (mean(rF.map(w => vAsym(w.pctl))) - mean(rA.map(w => vAsym(w.pctl))));
      // M1 symmetric conviction multiplier
      const m1 = 100 * (mean(rF.map(w => vAsym(w.pctl) * convW(w.sizeRatio))) - mean(rA.map(w => vAsym(w.pctl) * convW(w.sizeRatio))));
      // M2 fish-only conviction (bad wallets amplified by size; good/neutral flat)
      const fishConv = w => w.pctl < 0.35 ? vAsym(w.pctl) * convW(w.sizeRatio) : vAsym(w.pctl);
      const m2 = 100 * (mean(rF.map(fishConv)) - mean(rA.map(fishConv)));
      // M3 both tails conviction
      const tailConv = w => (w.pctl < 0.35 || w.pctl > 0.65) ? vAsym(w.pctl) * convW(w.sizeRatio) : vAsym(w.pctl);
      const m3 = 100 * (mean(rF.map(tailConv)) - mean(rA.map(tailConv)));
      // M4 additive: mismatch + fish-AG conviction mass bonus (and penalty for fish-FOR mass)
      const fishMass = arr => sum(arr.filter(w => w.pctl < 0.35).map(w => (0.5 - w.pctl) * convW(w.sizeRatio)));
      const m4 = m0 + 40 * (fishMass(rA) - fishMass(rF));
      // M5 sqrt-dampened symmetric
      const m5 = 100 * (mean(rF.map(w => vAsym(w.pctl) * Math.sqrt(Math.min(w.sizeRatio || 0.5, 4)))) - mean(rA.map(w => vAsym(w.pctl) * Math.sqrt(Math.min(w.sizeRatio || 0.5, 4)))));

      // linearity raw features
      const fishA = rA.filter(w => w.pctl <= 0.35);
      const maxFishAgSr = fishA.length ? Math.max(...fishA.map(w => w.sizeRatio)) : null;
      const fishAgMass = fishMass(rA);
      const starF = rF.filter(w => w.pctl >= 0.65);
      const maxStarForSr = starF.length ? Math.max(...starF.map(w => w.sizeRatio)) : null;

      rows.push({
        date: e.date, won: e.won, flat: flatRet(e.odds, e.won === 1),
        m0, m1, m2, m3, m4, m5,
        maxFishAgSr, fishAgMass, maxStarForSr,
        nFishA: fishA.length, nStarF: starF.length,
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

  // ── AUC bake-off ──
  const aucs = {};
  for (const m of ['m0', 'm1', 'm2', 'm3', 'm4', 'm5']) {
    aucs[m] = {
      full: rnd(auc(chron.map(r => ({ s: r[m], y: r.won })))),
      holdout: rnd(auc(test.map(r => ({ s: r[m], y: r.won })))),
      train: rnd(auc(train.map(r => ({ s: r[m], y: r.won })))),
    };
  }

  // ── linearity checks ──
  const binStat = (set, key, edges) => {
    const out = [];
    for (let b = 0; b < edges.length - 1; b++) {
      const h = set.filter(r => r[key] != null && r[key] >= edges[b] && r[key] < edges[b + 1]);
      if (h.length < 8) { out.push({ bin: `${edges[b]}–${edges[b + 1]}`, n: h.length }); continue; }
      out.push({ bin: `${edges[b]}–${edges[b + 1]}`, n: h.length,
        wr: rnd(100 * mean(h.map(r => r.won)), 1), flat: rnd(100 * mean(h.map(r => r.flat)), 1) });
    }
    return out;
  };
  const linearity = {
    // among sides WITH a fish against: does the fish's size matter?
    fishAgSize: binStat(chron.filter(r => r.nFishA >= 1), 'maxFishAgSr', [0, 0.5, 1.0, 1.5, 2.5, 100]),
    fishAgMass: binStat(chron.filter(r => r.nFishA >= 1), 'fishAgMass', [0, 0.1, 0.2, 0.35, 0.6, 100]),
    starForSize: binStat(chron.filter(r => r.nStarF >= 1), 'maxStarForSr', [0, 0.5, 1.0, 1.5, 2.5, 100]),
  };

  // ── holdout quintiles for best forms ──
  const quintOf = m => {
    const ok = [...test].sort((a, b) => a[m] - b[m]);
    const out = [];
    for (let q = 0; q < 5; q++) {
      const a = (q * ok.length / 5) | 0, b = ((q + 1) * ok.length / 5) | 0;
      const h = ok.slice(a, b);
      out.push({ q: q + 1, lo: rnd(h[0][m], 1), hi: rnd(h[h.length - 1][m], 1), n: h.length,
        wr: rnd(100 * mean(h.map(r => r.won)), 1), flat: rnd(100 * mean(h.map(r => r.flat)), 1) });
    }
    return out;
  };
  const quints = { m0: quintOf('m0'), m1: quintOf('m1'), m2: quintOf('m2'), m4: quintOf('m4') };

  // monthly stability of the m1 top-25% rule
  const m1Th = [...train].map(r => r.m1).sort((a, b) => b - a)[Math.floor(train.length * 0.25)];
  const months = [...new Set(chron.map(r => r.date.slice(0, 7)))].sort();
  const m1Monthly = months.map(m => {
    const h = chron.filter(r => r.date.slice(0, 7) === m && r.m1 >= m1Th);
    if (!h.length) return { m, n: 0 };
    return { m, n: h.length, wr: rnd(100 * mean(h.map(r => r.won)), 1), flat: rnd(100 * mean(h.map(r => r.flat)), 1) };
  });

  // ── rule table: top-slice comparisons at matched volume ──
  const topSlice = (m, frac) => {
    const th = [...train].map(r => r[m]).sort((a, b) => b - a)[Math.floor(train.length * frac)];
    const seg = set => { const h = set.filter(r => r[m] >= th); if (!h.length) return { n: 0 };
      const k2 = sum(h.map(r => r.won));
      return { n: h.length, wr: rnd(100 * k2 / h.length, 1), flat: rnd(100 * mean(h.map(r => r.flat)), 1), p: rnd(binomP(k2, h.length, baseWr), 4) }; };
    return { threshold: rnd(th, 1), train: seg(train), test: seg(test), all: seg(chron) };
  };
  const rules = {};
  for (const m of ['m0', 'm1', 'm2', 'm3', 'm4', 'm5']) {
    rules[`${m}_top15`] = topSlice(m, 0.15);
    rules[`${m}_top25`] = topSlice(m, 0.25);
  }

  const out = {
    meta: { n: chron.length, nTest: test.length, cutDate: test[0].date, baseWr: rnd(100 * baseWr, 1) },
    forms: {
      m0: 'current mismatch (no conviction)',
      m1: 'symmetric: every wallet × conv(sr)',
      m2: 'fish-only: bad wallets × conv(sr)',
      m3: 'both tails × conv(sr)',
      m4: 'additive: m0 + 40·(fishAgMass − fishForMass)',
      m5: 'symmetric × sqrt(sr)',
    },
    aucs, linearity, quints, rules, m1Monthly, m1Threshold: rnd(m1Th, 1),
  };
  writeFileSync('/tmp/mismatch_conviction.json', JSON.stringify(out));
  console.log(JSON.stringify(out, null, 1));
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
