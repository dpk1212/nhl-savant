/**
 * _fade_june_expanded.mjs — FADE rules on the EXPANDED June 1+ universe.
 *
 * Expansion: every graded side where the OPPOSING side has wallet data,
 * even if the side itself has zero backing wallets (unstaked). FADE only
 * needs the opposition's records, so these sides are scoreable.
 *
 * Wallet history warm-up from Apr 1 (causal, as-of). Evaluation Jun 1+.
 * Outputs: rule table (train/holdout/all + monthly), opposed-vs-unstaked
 * breakdown, agWeak quintile continuum (predict winners AND losers).
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

const FROM = '2026-06-01';
const HIST_FROM = '2026-04-01';
const K = 12, HC_RATIO = 1.5;

const shortId = w => String(w || '').toLowerCase().slice(-6);
const mean = xs => xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : null;
const sum = xs => xs.reduce((s, x) => s + x, 0);
const rnd = (x, n = 3) => !Number.isFinite(x) ? null : Math.round(x * 10 ** n) / 10 ** n;
const a2d = o => o > 0 ? 1 + o / 100 : 1 + 100 / Math.abs(o);
const flatRet = (o, w) => !o ? (w ? 0.91 : -1) : (w ? a2d(o) - 1 : -1);
function erf(x){const s=Math.sign(x);x=Math.abs(x);const t=1/(1+0.3275911*x);return s*(1-((((1.061405429*t-1.453152027)*t+1.421413741)*t-0.284496736)*t+0.254829592)*t*Math.exp(-x*x));}
const binomP = (k, n, p0) => n < 5 ? null : 1 - 0.5 * (1 + erf(((k - n * p0) / Math.sqrt(n * p0 * (1 - p0))) / Math.SQRT2));
const binomPLow = (k, n, p0) => n < 5 ? null : 0.5 * (1 + erf(((k - n * p0) / Math.sqrt(n * p0 * (1 - p0))) / Math.SQRT2));

(async () => {
  const cols = [['sharpFlowPicks', 'ML'], ['sharpFlowSpreads', 'SPREAD'], ['sharpFlowTotals', 'TOTAL']];
  const events = [];
  for (const [col, mkt] of cols) {
    const snap = await db.collection(col).get();
    for (const doc of snap.docs) {
      const data = doc.data();
      if (!data?.date || data.date < HIST_FROM || !data.sides) continue;
      const sport = data.sport || 'NHL';
      // collect wallets per game once (walletDetails usually lists both sides)
      const sideEntries = Object.entries(data.sides).filter(([, sd]) => !sd.superseded);
      const gameWallets = []; const seen = new Set();
      for (const [, sd] of sideEntries) {
        const scor = (sd.peak || {}).v8Scoring || (sd.lock || {}).v8Scoring || {};
        for (const w of (scor.walletDetails || [])) {
          const id = shortId(w.walletShort || w.wallet);
          if (!id || seen.has(id) || !w.side) continue;
          seen.add(id);
          gameWallets.push({ id, side: w.side, sizeRatio: Number(w.sizeRatio || 0) || 0 });
        }
      }
      if (!gameWallets.length) continue;
      for (const [sideKey, sd] of sideEntries) {
        const res = sd.result || {};
        if (res.outcome !== 'WIN' && res.outcome !== 'LOSS') continue;
        events.push({
          date: data.date, sport, mkt, sideKey,
          won: res.outcome === 'WIN' ? 1 : 0,
          odds: Number(sd.odds ?? (sd.peak || {}).odds ?? 0) || 0,
          wallets: gameWallets,
        });
      }
    }
  }
  events.sort((a, b) => a.date < b.date ? -1 : 1);

  const st = new Map();
  const G = k2 => { if (!st.has(k2)) st.set(k2, { w: 0, l: 0 }); return st.get(k2); };
  const rows = []; let i = 0;
  while (i < events.length) {
    const d = events[i].date; const day = [];
    while (i < events.length && events[i].date === d) day.push(events[i++]);

    for (const e of day) {
      if (e.date < FROM) continue;
      const forWd = e.wallets.filter(w => w.side === e.sideKey);
      const agWd = e.wallets.filter(w => w.side !== e.sideKey);
      if (!agWd.length) continue;                    // FADE needs opposition data only
      const eb = x => { const n = x.w + x.l; return { p: (x.w + 0.5 * K) / (n + K), prec: n / (n + K) }; };
      const wMean = arr => { let n = 0, dn = 0; for (const w of arr) { const { p, prec } = eb(G(w.id + '|' + e.sport)); n += p * prec; dn += prec; } return dn > 0 ? n / dn : 0.5; };
      const agWeak = 100 * (0.5 - wMean(agWd));
      const forStr = forWd.length ? 100 * (wMean(forWd) - 0.5) : null;
      const bayesEdge = forWd.length ? forStr + agWeak : null;
      const hcF = forWd.filter(w => w.sizeRatio >= HC_RATIO), hcA = agWd.filter(w => w.sizeRatio >= HC_RATIO);
      const dHcSize = (hcF.length || hcA.length) ? (hcF.length ? mean(hcF.map(w => w.sizeRatio)) : 0) - (hcA.length ? mean(hcA.map(w => w.sizeRatio)) : 0) : 0;
      const hcGate = (hcF.length - hcA.length) >= 1 || dHcSize > 0 || (hcF.length >= 1 && hcA.length === 0) ? 1 : 0;
      rows.push({
        date: e.date, month: e.date.slice(0, 7), sport: e.sport, mkt: e.mkt,
        won: e.won, flat: flatRet(e.odds, e.won === 1), odds: e.odds,
        agWeak, forStr, bayesEdge, hcGate, hcAgN: hcA.length, agN: agWd.length,
        staked: forWd.length > 0 ? 1 : 0,
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

  const seg = (set, fn) => { const h = set.filter(fn); if (!h.length) return { n: 0 };
    const k2 = sum(h.map(r => r.won));
    return { n: h.length, wr: rnd(100 * k2 / h.length, 1), flat: rnd(100 * mean(h.map(r => r.flat)), 1), p: rnd(binomP(k2, h.length, baseWr), 4), pLow: rnd(binomPLow(k2, h.length, baseWr), 4) };
  };
  const tri = fn => ({ train: seg(train, fn), test: seg(test, fn), all: seg(chron, fn) });

  const gateFn = r => r.bayesEdge != null && r.bayesEdge >= 5 && r.hcGate;

  const R = {
    'agWeak>=2': r => r.agWeak >= 2,
    'agWeak>=3': r => r.agWeak >= 3,
    'agWeak>=4': r => r.agWeak >= 4,
    'agWeak>=5': r => r.agWeak >= 5,
    'agWeak>=6': r => r.agWeak >= 6,
    'agWeak>=4 & HC': r => r.agWeak >= 4 && r.hcGate,
    'agWeak>=4 & noHcAg': r => r.agWeak >= 4 && r.hcAgN === 0,
    'agWeak>=4 UNSTAKED only': r => r.agWeak >= 4 && !r.staked,
    'agWeak>=4 staked only': r => r.agWeak >= 4 && r.staked,
    'GATE (BayesE5+HC)': gateFn,
    'GATE OR (agWeak>=4 & HC)': r => gateFn(r) || (r.agWeak >= 4 && r.hcGate),
    'GATE OR agWeak>=4': r => gateFn(r) || r.agWeak >= 4,
    // loser prediction: strong opposition
    'LOSER: agWeak<=-4': r => r.agWeak <= -4,
    'LOSER: agWeak<=-4 & hcAg>=1': r => r.agWeak <= -4 && r.hcAgN >= 1,
    'LOSER: agWeak<=-6': r => r.agWeak <= -6,
    'LOSER: middle |agWeak|<2': r => Math.abs(r.agWeak) < 2,
    'LOSER: middle -2..+3.5': r => r.agWeak >= -2 && r.agWeak <= 3.5,
    'LOSER: unstaked (no backers)': r => !r.staked,
    // mirror checks: does backing proven winners LOSE in June+?
    'MIRROR: forStr>=4': r => r.forStr != null && r.forStr >= 4,
    'MIRROR: forStr>=6': r => r.forStr != null && r.forStr >= 6,
    'MIRROR: forStr>=4 & HC': r => r.forStr != null && r.forStr >= 4 && r.hcGate,
  };
  const rules = Object.entries(R).map(([name, fn]) => ({ name, ...tri(fn) })).filter(x => x.all.n >= 10);

  // monthly for headline rules
  const months = [...new Set(chron.map(r => r.month))].sort();
  const monthly = {};
  for (const name of ['agWeak>=4', 'agWeak>=4 & HC', 'GATE OR agWeak>=4', 'LOSER: agWeak<=-4']) {
    monthly[name] = months.map(m => ({ m, ...seg(chron.filter(r => r.month === m), R[name]) }));
  }

  // continuum: agWeak quintiles → WR (winners AND losers prediction)
  const sorted = [...chron].sort((a, b) => a.agWeak - b.agWeak);
  const quint = [];
  for (let q = 0; q < 5; q++) {
    const a = (q * sorted.length / 5) | 0, b = ((q + 1) * sorted.length / 5) | 0;
    const h = sorted.slice(a, b);
    const impliedOf = r => r.odds ? (r.odds > 0 ? 100 / (r.odds + 100) : Math.abs(r.odds) / (Math.abs(r.odds) + 100)) : null;
    const imps = h.map(impliedOf).filter(x => x != null);
    quint.push({ q: q + 1, lo: rnd(h[0].agWeak, 1), hi: rnd(h[h.length - 1].agWeak, 1),
      n: h.length, wr: rnd(100 * mean(h.map(r => r.won)), 1), flat: rnd(100 * mean(h.map(r => r.flat)), 1),
      meanImplied: rnd(100 * mean(imps), 1), nOdds: imps.length,
      hcAgShare: rnd(100 * mean(h.map(r => r.hcAgN >= 1 ? 1 : 0)), 1) });
  }

  // breakdown
  const split = {
    all: seg(chron, () => true),
    staked: seg(chron, r => r.staked === 1),
    unstaked: seg(chron, r => r.staked === 0),
    unstakedFade4: tri(r => r.agWeak >= 4 && !r.staked),
  };

  const out = {
    meta: { n: chron.length, nTrain: train.length, nTest: test.length, cutDate: test[0]?.date, baseWr: rnd(100 * baseWr, 1),
      staked: chron.filter(r => r.staked).length, unstaked: chron.filter(r => !r.staked).length, months },
    rules, monthly, quint, split,
  };
  writeFileSync('/tmp/fade_june_expanded.json', JSON.stringify(out));
  console.log('done n=' + chron.length);
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
