/**
 * _fade_robustness.mjs — stress-test the FADE finding (agWeak).
 *  - threshold sweep agWeak >= 2..7, alone and & HC
 *  - monthly WR/ROI stability
 *  - sport & market breakdown
 *  - overlap with GATE (BayesE5+HC): jaccard, union stats
 *  - forStr sweep for contrast (proof of asymmetry)
 *  - combined product policy: GATE ∪ FADE volume/WR/ROI by month
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

const FROM = '2026-05-10', HIST_FROM = '2026-04-01', K = 12, HC_RATIO = 1.5;
const shortId = w => String(w || '').toLowerCase().slice(-6);
const mean = xs => xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : null;
const sum = xs => xs.reduce((s, x) => s + x, 0);
const rnd = (x, n = 3) => !Number.isFinite(x) ? null : Math.round(x * 10 ** n) / 10 ** n;
const a2d = o => o > 0 ? 1 + o / 100 : 1 + 100 / Math.abs(o);
const flatRet = (o, w) => !o ? (w ? 0.91 : -1) : (w ? a2d(o) - 1 : -1);
function erf(x){const s=Math.sign(x);x=Math.abs(x);const t=1/(1+0.3275911*x);return s*(1-((((1.061405429*t-1.453152027)*t+1.421413741)*t-0.284496736)*t+0.254829592)*t*Math.exp(-x*x));}
const binomP = (k, n, p0) => n < 5 ? null : 1 - 0.5 * (1 + erf(((k - n * p0) / Math.sqrt(n * p0 * (1 - p0))) / Math.SQRT2));

(async () => {
  const cols = [['sharpFlowPicks', 'ML'], ['sharpFlowSpreads', 'SPREAD'], ['sharpFlowTotals', 'TOTAL']];
  const events = [];
  for (const [col, mkt] of cols) {
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
        const wallets = []; const seen = new Set();
        for (const w of (scor.walletDetails || [])) {
          const id = shortId(w.walletShort || w.wallet);
          if (!id || seen.has(id) || !w.side) continue;
          seen.add(id);
          wallets.push({ id, side: w.side, sizeRatio: Number(w.sizeRatio || 0) || 0 });
        }
        if (!wallets.length) continue;
        events.push({ date: data.date, sport, mkt, sideKey, won: res.outcome === 'WIN' ? 1 : 0, odds: Number(sd.odds ?? peak.odds ?? 0) || 0, wallets });
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
      if (!forWd.length || !agWd.length) continue;
      const eb = x => { const n = x.w + x.l; return { p: (x.w + 0.5 * K) / (n + K), prec: n / (n + K) }; };
      const wMean = arr => { let n = 0, dn = 0; for (const w of arr) { const { p, prec } = eb(G(w.id + '|' + e.sport)); n += p * prec; dn += prec; } return dn > 0 ? n / dn : 0.5; };
      const forStr = 100 * (wMean(forWd) - 0.5);
      const agWeak = 100 * (0.5 - wMean(agWd));
      const bayesEdge = forStr + agWeak;
      const hcF = forWd.filter(w => w.sizeRatio >= HC_RATIO), hcA = agWd.filter(w => w.sizeRatio >= HC_RATIO);
      const dHcSize = (hcF.length || hcA.length) ? (hcF.length ? mean(hcF.map(w => w.sizeRatio)) : 0) - (hcA.length ? mean(hcA.map(w => w.sizeRatio)) : 0) : 0;
      const hcGate = (hcF.length - hcA.length) >= 1 || dHcSize > 0 || (hcF.length >= 1 && hcA.length === 0) ? 1 : 0;
      rows.push({ date: e.date, month: e.date.slice(0, 7), sport: e.sport, mkt: e.mkt, won: e.won, flat: flatRet(e.odds, e.won === 1), forStr, agWeak, bayesEdge, hcGate });
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
    const k2 = sum(h.map(r => r.won)); return { n: h.length, wr: rnd(100 * k2 / h.length, 1), flat: rnd(100 * mean(h.map(r => r.flat)), 1), p: rnd(binomP(k2, h.length, baseWr), 4) }; };
  const tri = fn => ({ train: seg(train, fn), test: seg(test, fn), all: seg(chron, fn) });

  const gateFn = r => r.bayesEdge >= 5 && r.hcGate;

  // sweeps
  const sweep = {};
  for (const t of [2, 3, 4, 5, 6, 7]) {
    sweep[`agWeak>=${t}`] = tri(r => r.agWeak >= t);
    sweep[`agWeak>=${t} & HC`] = tri(r => r.agWeak >= t && r.hcGate);
    sweep[`forStr>=${t}`] = tri(r => r.forStr >= t);
    sweep[`forStr>=${t} & HC`] = tri(r => r.forStr >= t && r.hcGate);
  }

  // monthly stability for headline rules
  const months = [...new Set(chron.map(r => r.month))].sort();
  const monthly = {};
  for (const [name, fn] of [['agWeak>=4', r => r.agWeak >= 4], ['agWeak>=4 & HC', r => r.agWeak >= 4 && r.hcGate], ['GATE', gateFn], ['GATE OR (agWeak>=4 & HC)', r => gateFn(r) || (r.agWeak >= 4 && r.hcGate)], ['GATE OR agWeak>=4', r => gateFn(r) || r.agWeak >= 4]]) {
    monthly[name] = months.map(m => { const s = seg(chron.filter(r => r.month === m), fn); return { m, ...s }; });
  }

  // sport / market breakdown for agWeak>=4
  const bySport = {}, byMkt = {};
  for (const s of [...new Set(chron.map(r => r.sport))]) bySport[s] = seg(chron.filter(r => r.sport === s), r => r.agWeak >= 4);
  for (const m of [...new Set(chron.map(r => r.mkt))]) byMkt[m] = seg(chron.filter(r => r.mkt === m), r => r.agWeak >= 4);

  // overlap with gate
  const fadeHc = chron.filter(r => r.agWeak >= 4 && r.hcGate);
  const gateSet = chron.filter(gateFn);
  const both = chron.filter(r => gateFn(r) && r.agWeak >= 4 && r.hcGate);
  const fadeOnly = chron.filter(r => !gateFn(r) && r.agWeak >= 4 && r.hcGate);
  const gateOnly = chron.filter(r => gateFn(r) && !(r.agWeak >= 4 && r.hcGate));
  const overlap = {
    gateN: gateSet.length, fadeHcN: fadeHc.length, bothN: both.length,
    fadeOnly: seg(chron, r => !gateFn(r) && r.agWeak >= 4 && r.hcGate),
    gateOnly: seg(chron, r => gateFn(r) && !(r.agWeak >= 4 && r.hcGate)),
    both: seg(chron, r => gateFn(r) && r.agWeak >= 4 && r.hcGate),
    union: tri(r => gateFn(r) || (r.agWeak >= 4 && r.hcGate)),
    unionSoft: tri(r => gateFn(r) || r.agWeak >= 4),
  };

  const out = { meta: { n: chron.length, cutDate: test[0].date, baseWr: rnd(100 * baseWr, 1), months }, sweep, monthly, bySport, byMkt, overlap };
  writeFileSync('/tmp/fade_robustness.json', JSON.stringify(out));
  console.log('done');
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
