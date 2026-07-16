/**
 * _wallet_mix_alpha.mjs — mine wallet IDENTITY & COMPOSITION, internal only.
 *
 * Thesis: track wallets → when the right mix lands for/against, there's edge.
 * Beyond aggregate EDGE/HC, per-wallet as-of records give us:
 *   - ELITE wallets (shrunk WR ≥ .58, n≥10) and FISH (≤ .44, n≥10) per side
 *   - PRO WHALE: elite AND HC (sizeRatio ≥ 1.5) on this pick
 *   - HC-SKILL: a wallet's as-of record specifically on its high-conviction bets
 *   - RECENCY edge: exponential-decay WR (recent form > ancient history)
 *   - ROI edge: profit-weighted, not just WR
 *   - STAR edge: best single wallet FOR vs best AG (star power vs averages)
 *   - EDGE decomposition: back-winners component vs fade-losers component
 * Then exhaustive rule/combo search judged by WR + flat ROI, train vs holdout,
 * plus "gate expansion" (OR) and "second pocket" (non-gate) analysis.
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
const K = 12;              // EB prior strength
const DECAY = 0.94;        // recency decay per pick (~halflife 11 picks)
const HC_RATIO = 1.5;

const shortId = w => String(w || '').toLowerCase().slice(-6);
const mean = xs => xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : null;
const sum = xs => xs.reduce((s, x) => s + x, 0);
const rnd = (x, n = 3) => !Number.isFinite(x) ? null : Math.round(x * 10 ** n) / 10 ** n;
const a2d = o => o > 0 ? 1 + o / 100 : 1 + 100 / Math.abs(o);
const flatRet = (o, w) => !o ? (w ? 0.91 : -1) : (w ? a2d(o) - 1 : -1);
function erf(x){const s=Math.sign(x);x=Math.abs(x);const t=1/(1+0.3275911*x);return s*(1-((((1.061405429*t-1.453152027)*t+1.421413741)*t-0.284496736)*t+0.254829592)*t*Math.exp(-x*x));}
const normCdf = z => 0.5 * (1 + erf(z / Math.SQRT2));
// one-sided binomial p vs p0 (normal approx)
const binomP = (k, n, p0) => n < 5 ? null : 1 - normCdf((k - n * p0) / Math.sqrt(n * p0 * (1 - p0)));
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
        const wd = scor.walletDetails || [];
        const wallets = []; const seen = new Set();
        for (const w of wd) {
          const id = shortId(w.walletShort || w.wallet);
          if (!id || seen.has(id) || !w.side) continue;
          seen.add(id);
          wallets.push({ id, side: w.side, sizeRatio: Number(w.sizeRatio || 0) || 0, invested: Number(w.invested || 0) || 0 });
        }
        if (!wallets.length) continue;
        events.push({ date: data.date, sport, mkt, sideKey, won: res.outcome === 'WIN' ? 1 : 0, odds: Number(sd.odds ?? peak.odds ?? 0) || 0, wallets });
      }
    }
  }
  events.sort((a, b) => a.date < b.date ? -1 : 1);

  // ── per-wallet|sport as-of state ──
  // w,l overall · hw,hl on HC picks only · dw,dn recency-decayed · pnl,nb flat ROI
  const st = new Map();
  const G = k2 => { if (!st.has(k2)) st.set(k2, { w: 0, l: 0, hw: 0, hl: 0, dw: 0, dn: 0, pnl: 0, nb: 0 }); return st.get(k2); };

  const rows = []; let i = 0;
  while (i < events.length) {
    const d = events[i].date; const day = [];
    while (i < events.length && events[i].date === d) day.push(events[i++]);

    for (const e of day) {
      if (e.date < FROM) continue;
      const forWd = e.wallets.filter(w => w.side === e.sideKey);
      const agWd = e.wallets.filter(w => w.side !== e.sideKey);
      if (!forWd.length || !agWd.length) continue;

      const stat = w => G(w.id + '|' + e.sport);
      const eb = x => { const n = x.w + x.l; return { p: (x.w + 0.5 * K) / (n + K), prec: n / (n + K), n }; };
      const ebHc = x => { const n = x.hw + x.hl; return { p: (x.hw + 0.5 * K) / (n + K), prec: n / (n + K), n }; };
      const ebRec = x => { return { p: (x.dw + 0.5 * 6) / (x.dn + 6), prec: x.dn / (x.dn + 6) }; };
      const roiSh = x => x.pnl / (x.nb + 8); // shrunk per-bet ROI

      const wMean = (arr, f) => { let n = 0, dn = 0; for (const w of arr) { const { p, prec } = f(stat(w)); n += p * prec; dn += prec; } return dn > 0 ? n / dn : 0.5; };

      // established spine
      const bayesEdge = 100 * (wMean(forWd, eb) - wMean(agWd, eb));
      const hcF = forWd.filter(w => w.sizeRatio >= HC_RATIO), hcA = agWd.filter(w => w.sizeRatio >= HC_RATIO);
      const dHcSize = (hcF.length || hcA.length) ? (hcF.length ? mean(hcF.map(w => w.sizeRatio)) : 0) - (hcA.length ? mean(hcA.map(w => w.sizeRatio)) : 0) : 0;
      const hcGate = (hcF.length - hcA.length) >= 1 || dHcSize > 0 || (hcF.length >= 1 && hcA.length === 0) ? 1 : 0;

      // EDGE decomposition
      const forStr = 100 * (wMean(forWd, eb) - 0.5);   // back-winners component
      const agWeak = 100 * (0.5 - wMean(agWd, eb));    // fade-losers component

      // identity tiers
      const isElite = w => { const x = stat(w); const n = x.w + x.l; return n >= 10 && eb(x).p >= 0.58; };
      const isFish = w => { const x = stat(w); const n = x.w + x.l; return n >= 10 && eb(x).p <= 0.44; };
      const eliteFor = forWd.filter(isElite).length, eliteAg = agWd.filter(isElite).length;
      const fishFor = forWd.filter(isFish).length, fishAg = agWd.filter(isFish).length;
      const proWhaleFor = forWd.filter(w => isElite(w) && w.sizeRatio >= HC_RATIO).length;
      const proWhaleAg = agWd.filter(w => isElite(w) && w.sizeRatio >= HC_RATIO).length;
      const fishWhaleAg = agWd.filter(w => isFish(w) && w.sizeRatio >= HC_RATIO).length; // proven loser betting big against us
      const fishWhaleFor = forWd.filter(w => isFish(w) && w.sizeRatio >= HC_RATIO).length;

      // star power: best single wallet each side (precision-adjusted)
      const starOf = arr => Math.max(...arr.map(w => { const x = eb(stat(w)); return x.prec >= 0.4 ? x.p : 0.5; }), 0.5);
      const starEdge = 100 * (starOf(forWd) - starOf(agWd));

      // HC-skill: among HC wallets on each side, their as-of record ON HC PICKS
      const hcSkillEdge = (hcF.length || hcA.length)
        ? 100 * ((hcF.length ? wMean(hcF, ebHc) : 0.5) - (hcA.length ? wMean(hcA, ebHc) : 0.5)) : 0;

      // recency edge
      const recEdge = 100 * (wMean(forWd, ebRec) - wMean(agWd, ebRec));

      // ROI edge (profit skill, not just WR)
      const roiEdge = 100 * (mean(forWd.map(w => roiSh(stat(w)))) - mean(agWd.map(w => roiSh(stat(w)))));

      rows.push({
        date: e.date, sport: e.sport, mkt: e.mkt, won: e.won, flat: flatRet(e.odds, e.won === 1),
        bayesEdge, hcGate, forStr, agWeak,
        eliteFor, eliteAg, dElite: eliteFor - eliteAg,
        fishFor, fishAg, dFish: fishAg - fishFor,
        proWhaleFor, proWhaleAg, dProWhale: proWhaleFor - proWhaleAg,
        fishWhaleAg, fishWhaleFor,
        starEdge, hcSkillEdge, recEdge, roiEdge,
      });
    }

    // update states AFTER the day (causal)
    for (const e of day) {
      for (const w of e.wallets) {
        if (w.side !== e.sideKey) continue;
        const x = G(w.id + '|' + e.sport);
        if (e.won) x.w++; else x.l++;
        if (w.sizeRatio >= HC_RATIO) { if (e.won) x.hw++; else x.hl++; }
        x.dw = x.dw * DECAY + (e.won ? 1 : 0); x.dn = x.dn * DECAY + 1;
        x.pnl += flatRet(e.odds, e.won === 1); x.nb++;
      }
    }
  }

  console.error(`rows=${rows.length}`);
  const chron = [...rows].sort((a, b) => a.date < b.date ? -1 : 1);
  const cut = Math.floor(chron.length * 0.6);
  const train = chron.slice(0, cut), test = chron.slice(cut);
  const baseWr = mean(chron.map(r => r.won));

  // ── univariate AUC (continuous features) ──
  const contFeats = ['bayesEdge', 'forStr', 'agWeak', 'dElite', 'dFish', 'dProWhale', 'starEdge', 'hcSkillEdge', 'recEdge', 'roiEdge'];
  const uni = {};
  for (const f of contFeats) {
    uni[f] = {
      full: rnd(auc(chron.map(r => ({ s: r[f], y: r.won })))),
      holdout: rnd(auc(test.map(r => ({ s: r[f], y: r.won })))),
    };
  }

  // ── rule library ──
  const R = {
    'GATE (BayesE5+HC)': r => r.bayesEdge >= 5 && r.hcGate,
    'dElite>=1': r => r.dElite >= 1,
    'dElite>=2': r => r.dElite >= 2,
    'elite unopposed (F>=1,A=0)': r => r.eliteFor >= 1 && r.eliteAg === 0,
    'elite unopposed x2': r => r.eliteFor >= 2 && r.eliteAg === 0,
    'proWhaleFor>=1': r => r.proWhaleFor >= 1,
    'proWhale unopposed': r => r.proWhaleFor >= 1 && r.proWhaleAg === 0,
    'proWhale unopposed, no eliteAg': r => r.proWhaleFor >= 1 && r.proWhaleAg === 0 && r.eliteAg === 0,
    'dFish>=1 (fade fish)': r => r.dFish >= 1,
    'dFish>=2': r => r.dFish >= 2,
    'fish unopposed (A>=1,F=0)': r => r.fishAg >= 1 && r.fishFor === 0,
    'fishWhaleAg>=1 (loser bets big vs us)': r => r.fishWhaleAg >= 1,
    'fishWhaleAg>=1 & fishWhaleFor=0': r => r.fishWhaleAg >= 1 && r.fishWhaleFor === 0,
    'starEdge>=6': r => r.starEdge >= 6,
    'starEdge>=10': r => r.starEdge >= 10,
    'hcSkillEdge>=5': r => r.hcSkillEdge >= 5,
    'hcSkillEdge>=8': r => r.hcSkillEdge >= 8,
    'recEdge>=5': r => r.recEdge >= 5,
    'recEdge>=8': r => r.recEdge >= 8,
    'roiEdge>=3': r => r.roiEdge >= 3,
    'roiEdge>=5': r => r.roiEdge >= 5,
    'forStr>=4 (back winners)': r => r.forStr >= 4,
    'agWeak>=4 (fade losers)': r => r.agWeak >= 4,
    // mixes: identity + conviction + edge
    'dElite>=1 & HC': r => r.dElite >= 1 && r.hcGate,
    'proWhale unopp & E>=3': r => r.proWhaleFor >= 1 && r.proWhaleAg === 0 && r.bayesEdge >= 3,
    'dFish>=1 & HC': r => r.dFish >= 1 && r.hcGate,
    'dFish>=1 & E>=3': r => r.dFish >= 1 && r.bayesEdge >= 3,
    'recEdge>=5 & HC': r => r.recEdge >= 5 && r.hcGate,
    'roiEdge>=3 & HC': r => r.roiEdge >= 3 && r.hcGate,
    'starEdge>=6 & HC': r => r.starEdge >= 6 && r.hcGate,
    'hcSkillEdge>=5 & HC': r => r.hcSkillEdge >= 5 && r.hcGate,
    'agWeak>=4 & HC': r => r.agWeak >= 4 && r.hcGate,
    'forStr>=4 & HC': r => r.forStr >= 4 && r.hcGate,
    // triple stacks (inside gate)
    'GATE & dElite>=1': r => r.bayesEdge >= 5 && r.hcGate && r.dElite >= 1,
    'GATE & recEdge>=5': r => r.bayesEdge >= 5 && r.hcGate && r.recEdge >= 5,
    'GATE & roiEdge>=3': r => r.bayesEdge >= 5 && r.hcGate && r.roiEdge >= 3,
    'GATE & starEdge>=6': r => r.bayesEdge >= 5 && r.hcGate && r.starEdge >= 6,
    'GATE & dFish>=1': r => r.bayesEdge >= 5 && r.hcGate && r.dFish >= 1,
    'GATE & agWeak>=4': r => r.bayesEdge >= 5 && r.hcGate && r.agWeak >= 4,
  };

  const evalRule = fn => {
    const seg = set => {
      const h = set.filter(fn);
      if (!h.length) return { n: 0 };
      const k2 = sum(h.map(r => r.won));
      return { n: h.length, wr: rnd(100 * k2 / h.length, 1), flat: rnd(100 * mean(h.map(r => r.flat)), 1), p: rnd(binomP(k2, h.length, baseWr), 4) };
    };
    return { train: seg(train), test: seg(test), all: seg(chron) };
  };

  const rules = Object.entries(R).map(([name, fn]) => ({ name, ...evalRule(fn) }))
    .filter(x => x.all.n >= 20)
    .sort((a, b) => (b.all.flat ?? -999) - (a.all.flat ?? -999));

  // ── gate expansion: GATE OR X (product volume) ──
  const gateFn = R['GATE (BayesE5+HC)'];
  const expansions = [];
  for (const [name, fn] of Object.entries(R)) {
    if (name.startsWith('GATE')) continue;
    const or = r => gateFn(r) || fn(r);
    const ev = evalRule(or);
    const evX = evalRule(r => fn(r) && !gateFn(r)); // the incremental picks only
    if (evX.all.n >= 15) expansions.push({ name: `GATE OR ${name}`, ...ev, incr: evX });
  }
  expansions.sort((a, b) => (b.incr.all.flat ?? -999) - (a.incr.all.flat ?? -999));

  // ── second pocket: best rules among NON-gate sides only ──
  const nonGate = chron.filter(r => !gateFn(r));
  const nonGateTrain = train.filter(r => !gateFn(r)), nonGateTest = test.filter(r => !gateFn(r));
  const pocket = [];
  for (const [name, fn] of Object.entries(R)) {
    if (name.startsWith('GATE')) continue;
    const seg = set => { const h = set.filter(fn); if (h.length < 8) return { n: h.length };
      const k2 = sum(h.map(r => r.won)); return { n: h.length, wr: rnd(100 * k2 / h.length, 1), flat: rnd(100 * mean(h.map(r => r.flat)), 1), p: rnd(binomP(k2, h.length, baseWr), 4) }; };
    const tr = seg(nonGateTrain), te = seg(nonGateTest), al = seg(nonGate);
    if (al.n >= 20) pocket.push({ name, train: tr, test: te, all: al });
  }
  pocket.sort((a, b) => (b.all.flat ?? -999) - (a.all.flat ?? -999));

  const out = {
    meta: { n: chron.length, nTrain: train.length, nTest: test.length, cutDate: test[0].date, baseWr: rnd(100 * baseWr, 1) },
    uni, rules, expansions: expansions.slice(0, 15), pocket: pocket.slice(0, 15),
  };
  writeFileSync('/tmp/wallet_mix_alpha.json', JSON.stringify(out));
  console.log(JSON.stringify(out, null, 1));
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
