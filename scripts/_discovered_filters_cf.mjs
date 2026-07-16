/**
 * _discovered_filters_cf.mjs — apply THE DISCOVERED FILTERS (this session's
 * findings, full-strength thresholds) to the actual Jun 1+ stamped book.
 *
 * User directive: don't cripple to May-only thresholds — we discovered these
 * slicers on June+ data and want to see their full effect vs the ACTUAL book.
 * (In-sample by construction; that's the point of the question.)
 *
 * Discovered filters:
 *   EDGE≥5 (BayesEdge)  · agWeak≥4 (FADE)  · hcGate  · MISMATCH2≥30 (top slice)
 *
 * Policies vs ACTUAL BASELINE (stamped units):
 *   UP-SIZING (staked picks only):
 *     U1 EDGE≥5 → +1u          U2 agWeak≥4 → +1u       U3 M2≥30 → +1u
 *     U4 any trigger → +1u     U5 stack (+1 per trigger, cap path)
 *     U6 gate (E5+HC) → +2u
 *   CUTS:
 *     C1 all three negative (EDGE<0 & agWeak<0 & M2<0) → 1u
 *   RESCUES (MONITORING, score>0, 0u):
 *     R1 gate (E5+HC) @3u      R2 FADE+HC (agWeak≥4+HC) @3u
 *     R3 union @3u             R4 union @2u
 *   FULL SYSTEM: U4 + C1 + R3
 * Output: totals vs baseline, deltas, monthly, and the rescue pool detail.
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

const HIST_FROM = '2026-04-01', DEPLOY = '2026-06-01';
const K = 12, RATED_N = 5, HC_RATIO = 1.5;

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
const pathCap = { A: 6, B: 5, C: 5, D: 2, E: 6, UNK: 6 };

(async () => {
  const cols = ['sharpFlowPicks', 'sharpFlowSpreads', 'sharpFlowTotals'];
  const events = [];
  const stampedByKey = new Map();
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
        if (data.date >= DEPLOY && String(promotedBy).startsWith('ags-unified')) {
          const units = Number(sd.finalUnits ?? sd.v8_agsUnitsApplied ?? 0) || 0;
          const tier = sd.v8_hcStakeTier || null;
          const agsV12 = Number(sd.v8_agsV12) || 0;
          if (tier !== 'FADE') stampedByKey.set(key, { units, tier, agsV12, path: units > 0 ? (PATH_MAP[tier] || 'UNK') : (tier === 'MONITORING' || units === 0 ? 'MUTE' : 'UNK') });
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

  const byKey = new Map(); let ei = 0;
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
      if (!agWd.length) continue;
      for (const w of [...forWd, ...agWd]) w.pctl = pctlOf(w.id, e.sport);
      const rF = forWd.filter(w => w.pctl != null), rA = agWd.filter(w => w.pctl != null);
      const wMean = arr => { let n = 0, dn = 0; for (const w of arr) { const { p, prec } = eb(G(w.id + '|' + e.sport)); n += p * prec; dn += prec; } return dn > 0 ? n / dn : 0.5; };
      const agWeak = 100 * (0.5 - wMean(agWd));
      const bayesEdge = forWd.length ? 100 * (wMean(forWd) - wMean(agWd)) : null;
      const m2 = (rF.length && rA.length)
        ? 100 * (mean(rF.map(w => vAsym(w.pctl) * convW(w.sizeRatio))) - mean(rA.map(w => vAsym(w.pctl) * convW(w.sizeRatio)))) : null;
      const hcF = forWd.filter(w => w.sizeRatio >= HC_RATIO), hcA = agWd.filter(w => w.sizeRatio >= HC_RATIO);
      const dHcSize = (hcF.length || hcA.length) ? (hcF.length ? mean(hcF.map(w => w.sizeRatio)) : 0) - (hcA.length ? mean(hcA.map(w => w.sizeRatio)) : 0) : 0;
      const hcGate = (hcF.length - hcA.length) >= 1 || dHcSize > 0 || (hcF.length >= 1 && hcA.length === 0) ? 1 : 0;
      byKey.set(e.key, { date: e.date, won: e.won, odds: e.odds, bayesEdge, agWeak, m2, hcGate });
    }
    for (const e of day) for (const w of e.wallets) {
      if (w.side !== e.sideKey) continue;
      const x = G(w.id + '|' + e.sport); if (e.won) x.w++; else x.l++;
    }
  }

  // build book
  const staked = [], muted = [];
  for (const [key, s] of stampedByKey) {
    const m = byKey.get(key);
    if (!m) continue;
    const row = { ...m, ...s };
    if (s.units > 0 && s.path !== 'MUTE') staked.push(row);
    else if (s.agsV12 > 0) muted.push(row);
  }
  staked.sort((a, b) => a.date < b.date ? -1 : 1);
  muted.sort((a, b) => a.date < b.date ? -1 : 1);

  const summarize = rows => {
    let w = 0, stake = 0, pnl = 0;
    for (const r of rows) {
      if (r.u <= 0) continue;
      const u = oddsCap(r.u, r.odds);
      if (r.won) w++;
      stake += u;
      pnl += profitAt(u, r.odds, r.won);
    }
    const n = rows.filter(r => r.u > 0).length;
    return { n, wr: n ? rnd(100 * w / n, 1) : null, stake: rnd(stake), pnl: rnd(pnl), roi: stake > 0 ? rnd(100 * pnl / stake, 1) : null };
  };

  // discovered triggers
  const tE = r => r.bayesEdge != null && r.bayesEdge >= 5;
  const tF = r => r.agWeak != null && r.agWeak >= 4;
  const tM = r => r.m2 != null && r.m2 >= 30;
  const tGate = r => tE(r) && r.hcGate;
  const tFadeHc = r => tF(r) && r.hcGate;
  const allNeg = r => (r.bayesEdge ?? 0) < 0 && (r.agWeak ?? 0) < 0 && (r.m2 ?? 0) < 0;

  const POLICIES = {
    BASELINE: { stakedU: r => r.units, rescue: null },
    U1_EDGE5: { stakedU: r => tE(r) ? Math.min(r.units + 1, pathCap[r.path]) : r.units, rescue: null },
    U2_FADE4: { stakedU: r => tF(r) ? Math.min(r.units + 1, pathCap[r.path]) : r.units, rescue: null },
    U3_M2: { stakedU: r => tM(r) ? Math.min(r.units + 1, pathCap[r.path]) : r.units, rescue: null },
    U4_ANY: { stakedU: r => (tE(r) || tF(r) || tM(r)) ? Math.min(r.units + 1, pathCap[r.path]) : r.units, rescue: null },
    U5_STACK: { stakedU: r => Math.min(r.units + (tE(r) ? 1 : 0) + (tF(r) ? 1 : 0) + (tM(r) ? 1 : 0), pathCap[r.path]), rescue: null },
    U6_GATE2: { stakedU: r => tGate(r) ? Math.min(r.units + 2, 6) : r.units, rescue: null },
    C1_ALLNEG: { stakedU: r => allNeg(r) ? Math.min(r.units, 1) : r.units, rescue: null },
    R1_GATE: { stakedU: r => r.units, rescue: r => tGate(r) ? 3 : 0 },
    R2_FADEHC: { stakedU: r => r.units, rescue: r => tFadeHc(r) ? 3 : 0 },
    R3_UNION3: { stakedU: r => r.units, rescue: r => (tGate(r) || tFadeHc(r)) ? 3 : 0 },
    R4_UNION2: { stakedU: r => r.units, rescue: r => (tGate(r) || tFadeHc(r)) ? 2 : 0 },
    FULL_SYSTEM: {
      stakedU: r => {
        let u = (tE(r) || tF(r) || tM(r)) ? Math.min(r.units + 1, pathCap[r.path]) : r.units;
        if (allNeg(r)) u = Math.min(u, 1);
        return u;
      },
      rescue: r => (tGate(r) || tFadeHc(r)) ? 3 : 0,
    },
  };

  const months = [...new Set([...staked, ...muted].map(r => r.date.slice(0, 7)))].sort();
  const base = summarize(staked.map(r => ({ ...r, u: r.units })));
  const results = {};
  for (const [name, pol] of Object.entries(POLICIES)) {
    const rows = [
      ...staked.map(r => ({ ...r, u: pol.stakedU(r) })),
      ...(pol.rescue ? muted.map(r => ({ ...r, u: pol.rescue(r) })) : []),
    ];
    const total = summarize(rows);
    results[name] = {
      total, deltaPnl: rnd(total.pnl - base.pnl, 1), deltaStake: rnd(total.stake - base.stake, 1),
      monthly: months.map(m => ({ m, ...summarize(rows.filter(r => r.date.slice(0, 7) === m)) })),
    };
  }

  // rescue pool detail
  const rescueDetail = {
    mutedN: muted.length,
    gate: summarize(muted.filter(tGate).map(r => ({ ...r, u: 3 }))),
    fadeHc: summarize(muted.filter(tFadeHc).map(r => ({ ...r, u: 3 }))),
    union: summarize(muted.filter(r => tGate(r) || tFadeHc(r)).map(r => ({ ...r, u: 3 }))),
    unionMonthly: months.map(m => ({ m, ...summarize(muted.filter(r => r.date.slice(0, 7) === m && (tGate(r) || tFadeHc(r))).map(r => ({ ...r, u: 3 }))) })),
  };

  const out = { meta: { nStaked: staked.length, nMuted: muted.length, baseline: base }, results, rescueDetail };
  writeFileSync('/tmp/discovered_filters_cf.json', JSON.stringify(out));
  console.log(JSON.stringify({ meta: out.meta, results: Object.fromEntries(Object.entries(results).map(([k, v]) => [k, { ...v.total, dPnl: v.deltaPnl, dStake: v.deltaStake }])), rescueDetail }, null, 1));
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
