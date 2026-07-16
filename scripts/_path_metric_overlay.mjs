/**
 * _path_metric_overlay.mjs — how EDGE + MISMATCH improve paths A/B/C/D/E
 * WITHOUT HC gates and WITHOUT crushing volume.
 *
 * Uses stamped AGS-U picks (Jun 1+) with actual path tiers + units.
 * Computes causal EDGE, agWeak, MISMATCH from as-of wallet history.
 *
 * Tests (volume-aware):
 *   1) BASELINE per path (stamped units)
 *   2) SIZE overlay — same picks, ±1u by metric within path (no new picks)
 *   3) SOFT CUT — demote bottom 15% metric picks to 1u (minimal volume loss)
 *   4) RESCUE — add MONITORING picks with metric signal (volume expansion)
 *   5) Per-path metric quintiles (does metric rank within each path?)
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

const FROM = '2026-06-01', HIST_FROM = '2026-04-01';
const K = 12, RATED_N = 5, HC_RATIO = 1.5;
const PATH_MAP = {
  SUPER: 'A', TOP: 'A', 'TOP+': 'A', MINI: 'A', 'MINI-': 'A', CONFIRMED: 'A',
  RANK: 'B', SHARP: 'C', 'SHARP-PRIME': 'C', DISSENT: 'D', WINNER: 'E',
  MONITORING: 'MUTE', FADE: 'FADE',
};

const shortId = w => String(w || '').toLowerCase().slice(-6);
const mean = xs => xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : null;
const sum = xs => xs.reduce((s, x) => s + x, 0);
const rnd = (x, n = 2) => !Number.isFinite(x) ? null : Math.round(x * 10 ** n) / 10 ** n;
function profitAt(u, o, won) {
  if (!u) return 0;
  if (!won) return -u;
  return o < 0 ? u * (100 / Math.abs(o)) : u * (o / 100);
}
function oddsCap(u, o) {
  if (!Number.isFinite(o)) return u;
  if (o >= 200) return Math.min(u, 1);
  if (o >= 151) return Math.min(u, 1.5);
  if (o >= 100) return Math.min(u, 2.5);
  return u;
}

function summarize(rows, unitsFn) {
  let w = 0, stake = 0, pnl = 0;
  for (const r of rows) {
    const u = oddsCap(typeof unitsFn === 'function' ? unitsFn(r) : unitsFn, r.odds);
    if (r.won) w++; else;
    stake += u;
    pnl += profitAt(u, r.odds, r.won);
  }
  const n = rows.length;
  return { n, wr: n ? rnd(100 * w / n, 1) : null, stake: rnd(stake), pnl: rnd(pnl), roi: stake > 0 ? rnd(100 * pnl / stake, 1) : null };
}

function pathOf(tier) {
  if (!tier) return 'UNK';
  return PATH_MAP[tier] || 'OTHER';
}

(async () => {
  // ── load stamped picks ──
  const cols = [['sharpFlowPicks', 'ML'], ['sharpFlowSpreads', 'SPREAD'], ['sharpFlowTotals', 'TOTAL']];
  const picks = [];
  for (const [col, mkt] of cols) {
    const snap = await db.collection(col).where('date', '>=', FROM).get();
    for (const doc of snap.docs) {
      const data = doc.data();
      if (!data.sides) continue;
      for (const [sideKey, sd] of Object.entries(data.sides)) {
        if (sd.superseded) continue;
        const res = sd.result || {};
        if (res.outcome !== 'WIN' && res.outcome !== 'LOSS') continue;
        const promotedBy = sd.promotedBy || data.promotedBy || '';
        if (!String(promotedBy).startsWith('ags-unified')) continue;
        const peak = sd.peak || {}, lock = sd.lock || {};
        const scor = peak.v8Scoring || lock.v8Scoring || {};
        const wd = scor.walletDetails || [];
        const wallets = []; const seen = new Set();
        for (const w of wd) {
          const id = shortId(w.walletShort || w.wallet);
          if (!id || seen.has(id) || !w.side) continue;
          seen.add(id);
          wallets.push({ id, side: w.side, sizeRatio: Number(w.sizeRatio || 0) || 0 });
        }
        if (!wallets.length) continue;
        picks.push({
          date: data.date, sport: data.sport || 'NHL', mkt, sideKey,
          won: res.outcome === 'WIN', odds: Number(sd.odds ?? peak.odds ?? 0) || 0,
          units: Number(sd.finalUnits ?? sd.v8_agsUnitsApplied ?? 0) || 0,
          tier: sd.v8_hcStakeTier || null,
          path: pathOf(sd.v8_hcStakeTier),
          agsV12: Number(sd.v8_agsV12) || 0,
          wallets,
        });
      }
    }
  }
  picks.sort((a, b) => a.date < b.date ? -1 : 1);

  // ── causal wallet state for metrics ──
  const st = new Map();
  const G = k => { if (!st.has(k)) st.set(k, { w: 0, l: 0 }); return st.get(k); };
  const eb = x => { const n = x.w + x.l; return { p: (x.w + 0.5 * K) / (n + K), prec: n / (n + K) }; };
  const vAsym = p => p < 0.35 ? 2 * (p - 0.5) : (p - 0.5);

  // build event list for causal walk
  const allEvents = [];
  for (const [col, mkt] of cols) {
    const snap = await db.collection(col).get();
    for (const doc of snap.docs) {
      const data = doc.data();
      if (!data?.date || data.date < HIST_FROM || !data.sides) continue;
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
          wallets.push({ id, side: w.side });
        }
        if (!wallets.length) continue;
        allEvents.push({ date: data.date, sport: data.sport || 'NHL', sideKey, won: res.outcome === 'WIN' ? 1 : 0, wallets });
      }
    }
  }
  allEvents.sort((a, b) => a.date < b.date ? -1 : 1);

  const metricByKey = new Map();
  let ei = 0;
  while (ei < allEvents.length) {
    const d = allEvents[ei].date; const day = [];
    while (ei < allEvents.length && allEvents[ei].date === d) day.push(allEvents[ei++]);
    const tables = new Map();
    for (const e of day) {
      const s = e.sport;
      if (!tables.has(s)) {
        const vals = [];
        for (const [key, x] of st) {
          if (!key.endsWith('|' + s) || x.w + x.l < RATED_N) continue;
          vals.push(eb(x).p);
        }
        vals.sort((a, b) => a - b);
        tables.set(s, vals);
      }
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
      const ratedF = forWd.filter(w => w.pctl != null), ratedA = agWd.filter(w => w.pctl != null);
      const wMean = arr => { let n = 0, dn = 0; for (const w of arr) { const { p, prec } = eb(G(w.id + '|' + e.sport)); n += p * prec; dn += prec; } return dn > 0 ? n / dn : 0.5; };
      const bayesEdge = 100 * (wMean(forWd) - wMean(agWd));
      const agWeak = 100 * (0.5 - wMean(agWd));
      const mismatch = (ratedF.length && ratedA.length)
        ? 100 * (mean(ratedF.map(w => vAsym(w.pctl))) - mean(ratedA.map(w => vAsym(w.pctl)))) : null;
      metricByKey.set(`${e.date}|${e.sport}|${e.sideKey}`, { bayesEdge, agWeak, mismatch });
    }
    for (const e of day) for (const w of e.wallets) {
      if (w.side !== e.sideKey) continue;
      const x = G(w.id + '|' + e.sport); if (e.won) x.w++; else x.l++;
    }
  }

  // attach metrics to picks
  for (const p of picks) {
    const m = metricByKey.get(`${p.date}|${p.sport}|${p.sideKey}`) || {};
    Object.assign(p, m);
  }

  const staked = picks.filter(p => p.units > 0 && p.path !== 'FADE');
  const muted = picks.filter(p => p.path === 'MUTE' && p.agsV12 > 0);
  const cut = Math.floor(picks.length * 0.6);
  const trainCut = picks[cut]?.date;

  // ── 1) BASELINE per path ──
  const baseline = {};
  for (const path of ['A', 'B', 'C', 'D', 'E', 'MUTE', 'ALL_STAKED']) {
    const pool = path === 'ALL_STAKED' ? staked : path === 'MUTE' ? muted : picks.filter(p => p.path === path && (path === 'MUTE' || p.units > 0));
    baseline[path] = {
      all: summarize(pool, r => r.units),
      train: summarize(pool.filter(r => r.date < trainCut), r => r.units),
      test: summarize(pool.filter(r => r.date >= trainCut), r => r.units),
      n: pool.length,
    };
  }

  // ── 2) SIZE overlay — same picks, metric-based unit adjust ──
  // Path-specific caps from production ladder
  const pathCap = { A: 6, B: 4, C: 4, D: 1, E: 6 };
  const sizeOverlay = (r) => {
    const base = r.units;
    if (!base) return 0;
    let u = base;
    const strong = (r.mismatch != null && r.mismatch >= 8) || r.agWeak >= 4 || r.bayesEdge >= 5;
    const weak = (r.mismatch != null && r.mismatch <= -5) || r.bayesEdge <= -3;
    if (strong) u = Math.min(base + 1, pathCap[r.path] || 6);
    else if (weak) u = Math.max(base - 1, r.path === 'A' && ['CONFIRMED', 'MINI-'].includes(r.tier) ? 1 : 1);
    return u;
  };
  const sizePool = staked;
  const overlaySize = {
    all: summarize(sizePool, sizeOverlay),
    train: summarize(sizePool.filter(r => r.date < trainCut), sizeOverlay),
    test: summarize(sizePool.filter(r => r.date >= trainCut), sizeOverlay),
    volChange: rnd(100 * (summarize(sizePool, sizeOverlay).stake - summarize(sizePool, r => r.units).stake) / summarize(sizePool, r => r.units).stake, 1),
  };

  // ── 3) SOFT CUT — bottom 15% by composite score → 1u (not 0u) ──
  const scoreOf = r => (r.mismatch ?? 0) * 0.5 + (r.agWeak ?? 0) * 0.3 + (r.bayesEdge ?? 0) * 0.2;
  const sortedStaked = [...staked].sort((a, b) => scoreOf(a) - scoreOf(b));
  const cutN = Math.floor(staked.length * 0.15);
  const softCutSet = new Set(sortedStaked.slice(0, cutN).map(r => `${r.date}|${r.sport}|${r.sideKey}`));
  const softCut = {
    all: summarize(staked, r => softCutSet.has(`${r.date}|${r.sport}|${r.sideKey}`) ? Math.min(r.units, 1) : r.units),
    train: summarize(staked.filter(r => r.date < trainCut), r => softCutSet.has(`${r.date}|${r.sport}|${r.sideKey}`) ? Math.min(r.units, 1) : r.units),
    test: summarize(staked.filter(r => r.date >= trainCut), r => softCutSet.has(`${r.date}|${r.sport}|${r.sideKey}`) ? Math.min(r.units, 1) : r.units),
    nCut: cutN,
    volChange: rnd(100 * (summarize(staked, r => softCutSet.has(`${r.date}|${r.sport}|${r.sideKey}`) ? Math.min(r.units, 1) : r.units).stake - summarize(staked, r => r.units).stake) / summarize(staked, r => r.units).stake, 1),
  };

  // ── 4) RESCUE — add muted picks, NO HC, metric only ──
  const rescueRules = {
    'EDGE>=3': r => r.bayesEdge >= 3,
    'agWeak>=4': r => r.agWeak >= 4,
    'mismatch>=8': r => r.mismatch != null && r.mismatch >= 8,
    'EDGE>=3 OR agWeak>=4': r => r.bayesEdge >= 3 || r.agWeak >= 4,
    'EDGE>=3 OR mismatch>=8': r => r.bayesEdge >= 3 || (r.mismatch != null && r.mismatch >= 8),
  };
  const rescue = {};
  for (const [name, fn] of Object.entries(rescueRules)) {
    const adds = muted.filter(fn);
    const unitsFn = r => {
      if (r.units > 0) return r.units;
      if (!fn(r)) return 0;
      if (r.bayesEdge >= 5 || r.agWeak >= 4) return oddsCap(3, r.odds);
      return oddsCap(2, r.odds);
    };
    const combined = picks.filter(p => p.path !== 'FADE');
    rescue[name] = {
      adds: adds.length,
      addsOnly: summarize(adds, r => oddsCap(r.bayesEdge >= 5 || r.agWeak >= 4 ? 3 : 2, r.odds)),
      book: summarize(combined, unitsFn),
      volChange: rnd(100 * (summarize(combined, unitsFn).stake - summarize(staked, r => r.units).stake) / summarize(staked, r => r.units).stake, 1),
    };
  }

  // ── 5) Per-path metric quintiles (within staked picks per path) ──
  const pathQuint = {};
  for (const path of ['A', 'B', 'C']) {
    const pool = staked.filter(p => p.path === path && p.mismatch != null);
    if (pool.length < 25) continue;
    const sorted = [...pool].sort((a, b) => a.mismatch - b.mismatch);
    const qs = [];
    for (let q = 0; q < 5; q++) {
      const a = (q * sorted.length / 5) | 0, b = ((q + 1) * sorted.length / 5) | 0;
      const h = sorted.slice(a, b);
      qs.push({ q: q + 1, n: h.length, wr: rnd(100 * mean(h.map(r => r.won ? 1 : 0)), 1),
        roi: summarize(h, r => r.units).roi, lo: rnd(h[0].mismatch, 1), hi: rnd(h[h.length - 1].mismatch, 1) });
    }
    pathQuint[path] = qs;
  }

  // ── 6) Per-path: which metric ranks best within path? ──
  const pathMetricAuc = {};
  for (const path of ['A', 'B', 'C', 'MUTE']) {
    const pool = (path === 'MUTE' ? muted : staked.filter(p => p.path === path));
    if (pool.length < 20) continue;
    const aucOf = m => {
      const ok = pool.filter(r => r[m] != null);
      if (ok.length < 15) return null;
      const pos = ok.filter(r => r.won).length, neg = ok.length - pos;
      if (!pos || !neg) return null;
      const all = [...ok].sort((a, b) => a[m] - b[m]);
      let rank = 1, i = 0, rPos = 0;
      while (i < all.length) {
        let j = i; while (j < all.length && all[j][m] === all[i][m]) j++;
        const avg = (2 * rank + (j - i) - 1) / 2;
        for (let k2 = i; k2 < j; k2++) if (all[k2].won) rPos += avg;
        rank += j - i; i = j;
      }
      return rnd((rPos - pos * (pos + 1) / 2) / (pos * neg));
    };
    pathMetricAuc[path] = { bayesEdge: aucOf('bayesEdge'), agWeak: aucOf('agWeak'), mismatch: aucOf('mismatch') };
  }

  const out = {
    meta: { nPicks: picks.length, nStaked: staked.length, nMuted: muted.length, trainCut, baseStaked: summarize(staked, r => r.units) },
    baseline, overlaySize, softCut, rescue, pathQuint, pathMetricAuc,
  };
  writeFileSync('/tmp/path_metric_overlay.json', JSON.stringify(out));
  console.log(JSON.stringify(out, null, 1));
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
