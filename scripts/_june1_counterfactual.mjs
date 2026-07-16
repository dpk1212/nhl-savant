/**
 * _june1_counterfactual.mjs — "would we have beaten the ACTUAL book?"
 *
 * Strict deploy simulation:
 *   - All thresholds fit on May 10–31 data ONLY (knowable before June 1).
 *   - Applied unchanged to the actual stamped AGS-U book Jun 1 → today.
 *   - Baseline = actual stamped units → actual PnL (production truth).
 *   - Metrics (EDGE, agWeak, MISMATCH2) computed causally as-of each day.
 *
 * Policies (each deployable June 1, none removes a pick):
 *   P1 SIZE     ±1u on staked picks by MISMATCH2 (May thresholds)
 *   P2 SOFTCUT  composite bottom slice → 1u
 *   P3 CGUARD   Path C (SHARP/SHARP-PRIME) with weak MISMATCH2 → 1u
 *   P4 COMBO    P1 + P3
 * Output: total stake/PnL/ROI vs baseline, monthly, weekly cumulative series.
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

const HIST_FROM = '2026-04-01', FIT_FROM = '2026-05-10', DEPLOY = '2026-06-01';
const K = 12, RATED_N = 5;

const shortId = w => String(w || '').toLowerCase().slice(-6);
const mean = xs => xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : null;
const rnd = (x, n = 2) => !Number.isFinite(x) ? null : Math.round(x * 10 ** n) / 10 ** n;
function profitAt(u, o, won) {
  if (!u) return 0;
  if (!won) return -u;
  return o < 0 ? u * (100 / Math.abs(o)) : u * (o / 100);
}
function oddsCap(u, o) {
  if (!Number.isFinite(o) || o === 0) return u;
  if (o >= 200) return Math.min(u, 1);
  if (o >= 151) return Math.min(u, 1.5);
  if (o >= 100) return Math.min(u, 2.5);
  return u;
}
const PATH_MAP = {
  SUPER: 'A', TOP: 'A', 'TOP+': 'A', MINI: 'A', 'MINI-': 'A', CONFIRMED: 'A',
  RANK: 'B', SHARP: 'C', 'SHARP-PRIME': 'C', DISSENT: 'D', WINNER: 'E',
};

(async () => {
  const cols = ['sharpFlowPicks', 'sharpFlowSpreads', 'sharpFlowTotals'];

  // ── full causal event walk to compute metrics for every graded side ──
  const events = [];
  const stampedByKey = new Map(); // production picks (Jun 1+ staked AGS-U)
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
        const key = `${data.date}|${sport}|${doc.id}|${sideKey}`;
        events.push({ key, date: data.date, sport, sideKey, won: res.outcome === 'WIN' ? 1 : 0, odds: Number(sd.odds ?? (sd.peak || {}).odds ?? 0) || 0, wallets });

        const promotedBy = sd.promotedBy || data.promotedBy || '';
        const units = Number(sd.finalUnits ?? sd.v8_agsUnitsApplied ?? 0) || 0;
        const tier = sd.v8_hcStakeTier || null;
        if (data.date >= DEPLOY && String(promotedBy).startsWith('ags-unified') && units > 0 && tier !== 'FADE') {
          stampedByKey.set(key, { units, tier, path: PATH_MAP[tier] || 'UNK' });
        }
      }
    }
  }
  events.sort((a, b) => a.date < b.date ? -1 : 1);

  const st = new Map();
  const G = k => { if (!st.has(k)) st.set(k, { w: 0, l: 0 }); return st.get(k); };
  const eb = x => { const n = x.w + x.l; return { p: (x.w + 0.5 * K) / (n + K), prec: n / (n + K) }; };
  const vAsym = p => p < 0.35 ? 2 * (p - 0.5) : (p - 0.5);
  const convW = sr => Math.max(0.25, Math.min((sr || 0) / 1.5, 2));

  const metricRows = []; let ei = 0;
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
      const forWd = e.wallets.filter(w => w.side === e.sideKey);
      const agWd = e.wallets.filter(w => w.side !== e.sideKey);
      if (!forWd.length || !agWd.length) continue;
      for (const w of [...forWd, ...agWd]) w.pctl = pctlOf(w.id, e.sport);
      const rF = forWd.filter(w => w.pctl != null), rA = agWd.filter(w => w.pctl != null);
      const wMean = arr => { let n = 0, dn = 0; for (const w of arr) { const { p, prec } = eb(G(w.id + '|' + e.sport)); n += p * prec; dn += prec; } return dn > 0 ? n / dn : 0.5; };
      const bayesEdge = 100 * (wMean(forWd) - wMean(agWd));
      const agWeak = 100 * (0.5 - wMean(agWd));
      const m2 = (rF.length && rA.length)
        ? 100 * (mean(rF.map(w => vAsym(w.pctl) * convW(w.sizeRatio))) - mean(rA.map(w => vAsym(w.pctl) * convW(w.sizeRatio)))) : null;
      metricRows.push({ key: e.key, date: e.date, won: e.won, odds: e.odds, bayesEdge, agWeak, m2 });
    }
    for (const e of day) for (const w of e.wallets) {
      if (w.side !== e.sideKey) continue;
      const x = G(w.id + '|' + e.sport); if (e.won) x.w++; else x.l++;
    }
  }

  const byKey = new Map(metricRows.map(r => [r.key, r]));

  // ── fit thresholds on MAY ONLY ──
  const may = metricRows.filter(r => r.date >= FIT_FROM && r.date < DEPLOY && r.m2 != null);
  const q = (arr, p) => { const s = [...arr].sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.floor(p * s.length))]; };
  const m2Vals = may.map(r => r.m2);
  const TH = {
    m2Top: q(m2Vals, 0.75),       // top-25% boundary in May
    m2Bot: q(m2Vals, 0.15),       // bottom-15% boundary
    m2Med: q(m2Vals, 0.50),       // median (for Path C guard)
  };
  const compOf = r => 0.5 * (r.m2 ?? 0) + 0.3 * (r.agWeak ?? 0) + 0.2 * (r.bayesEdge ?? 0);
  const compVals = may.map(compOf);
  TH.compBot = q(compVals, 0.15);

  // ── build the deploy book (actual staked picks Jun 1+) ──
  const book = [];
  for (const [key, s] of stampedByKey) {
    const m = byKey.get(key);
    if (!m) continue;
    book.push({ ...m, units: s.units, tier: s.tier, path: s.path });
  }
  book.sort((a, b) => a.date < b.date ? -1 : 1);

  const summarize = (rows, unitsFn) => {
    let w = 0, stake = 0, pnl = 0;
    for (const r of rows) {
      const u = oddsCap(typeof unitsFn === 'function' ? unitsFn(r) : unitsFn, r.odds);
      if (r.won) w++;
      stake += u;
      pnl += profitAt(u, r.odds, r.won);
    }
    return { n: rows.length, wr: rows.length ? rnd(100 * w / rows.length, 1) : null, stake: rnd(stake), pnl: rnd(pnl), roi: stake > 0 ? rnd(100 * pnl / stake, 1) : null };
  };

  // ── policies ──
  const pathCap = { A: 6, B: 4, C: 4, D: 1, E: 6, UNK: 6 };
  const POL = {
    BASELINE: r => r.units,
    P1_SIZE: r => {
      if (r.m2 == null) return r.units;
      if (r.m2 >= TH.m2Top) return Math.min(r.units + 1, pathCap[r.path]);
      if (r.m2 <= TH.m2Bot) return Math.max(r.units - 1, 1);
      return r.units;
    },
    P2_SOFTCUT: r => compOf(r) <= TH.compBot ? Math.min(r.units, 1) : r.units,
    P3_CGUARD: r => (r.path === 'C' && (r.m2 == null || r.m2 < TH.m2Med)) ? Math.min(r.units, 1) : r.units,
    P4_COMBO: r => {
      let u = POL.P1_SIZE(r);
      if (r.path === 'C' && (r.m2 == null || r.m2 < TH.m2Med)) u = Math.min(u, 1);
      return u;
    },
    P5_UPONLY: r => (r.m2 != null && r.m2 >= TH.m2Top) ? Math.min(r.units + 1, pathCap[r.path]) : r.units,
    P6_DOWNONLY: r => (r.m2 != null && r.m2 <= TH.m2Bot) ? Math.max(r.units - 1, 1) : r.units,
    P7_AGWEAK: r => r.agWeak >= 4 ? Math.min(r.units + 1, pathCap[r.path]) : r.units,
    P8_EDGE5: r => r.bayesEdge >= 5 ? Math.min(r.units + 1, pathCap[r.path]) : r.units,
  };

  const results = {};
  const months = [...new Set(book.map(r => r.date.slice(0, 7)))].sort();
  const basePnl = summarize(book, POL.BASELINE).pnl;
  for (const [name, fn] of Object.entries(POL)) {
    const total = summarize(book, fn);
    results[name] = {
      total, deltaPnl: rnd(total.pnl - basePnl, 1),
      monthly: months.map(m => ({ m, ...summarize(book.filter(r => r.date.slice(0, 7) === m), fn) })),
    };
  }

  // per-path baseline within this opposed book + what the C guard touched
  const perPath = {};
  for (const p of ['A', 'B', 'C', 'UNK']) {
    const pool = book.filter(r => r.path === p);
    if (!pool.length) continue;
    perPath[p] = {
      base: summarize(pool, r => r.units),
      weakM2: summarize(pool.filter(r => r.m2 == null || r.m2 < TH.m2Med), r => r.units),
      strongM2: summarize(pool.filter(r => r.m2 != null && r.m2 >= TH.m2Med), r => r.units),
      topM2: summarize(pool.filter(r => r.m2 != null && r.m2 >= TH.m2Top), r => r.units),
    };
  }

  // weekly cumulative PnL series (baseline vs P4)
  const dates = [...new Set(book.map(r => r.date))].sort();
  const weekly = [];
  let cumBase = 0, cumP1 = 0, cumP4 = 0;
  for (const d of dates) {
    for (const r of book.filter(x => x.date === d)) {
      cumBase += profitAt(oddsCap(POL.BASELINE(r), r.odds), r.odds, r.won);
      cumP1 += profitAt(oddsCap(POL.P1_SIZE(r), r.odds), r.odds, r.won);
      cumP4 += profitAt(oddsCap(POL.P4_COMBO(r), r.odds), r.odds, r.won);
    }
    weekly.push({ d, base: rnd(cumBase, 1), p1: rnd(cumP1, 1), p4: rnd(cumP4, 1) });
  }

  // coverage: how many staked picks had m2 available?
  const cov = rnd(100 * book.filter(r => r.m2 != null).length / book.length, 1);

  const out = {
    meta: { nBook: book.length, coverage: cov, thresholds: { m2Top: rnd(TH.m2Top, 1), m2Bot: rnd(TH.m2Bot, 1), m2Med: rnd(TH.m2Med, 1), compBot: rnd(TH.compBot, 1) }, fitWindow: `${FIT_FROM}..${DEPLOY}`, mayN: may.length },
    results, perPath, weekly: weekly.filter((_, i) => i % 3 === 0 || i === weekly.length - 1),
  };
  writeFileSync('/tmp/june1_counterfactual.json', JSON.stringify(out));
  console.log(JSON.stringify({ meta: out.meta, results: Object.fromEntries(Object.entries(results).map(([k, v]) => [k, { ...v.total, dPnl: v.deltaPnl }])), perPath }, null, 1));
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
