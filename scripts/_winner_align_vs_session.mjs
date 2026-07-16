/**
 * _winner_align_vs_session.mjs — implemented WINNER-ALIGN spec vs this
 * session's upgrades, on the same Jun 1+ muted pool + staked book.
 *
 * IMPLEMENTED (branch, live 2026-07-12), per docs/WINNER_ALIGN_IMPLEMENTATION.md:
 *   EDGE = legacy: mean FOR sport-WR − mean AG WR, wallets with picks.n ≥ 8 (raw WR)
 *   E1 rescue: muted score>0 + EDGE≥3 → 3u / EDGE≥5 → 4u / EDGE≥10 → 6u (no HC req)
 *   Mute: mean EDGE ≤ −5 → 0u
 *
 * SESSION UPGRADES tested as deltas:
 *   1) BayesEdge (EB-shrunk, no n≥8 cliff) instead of legacy EDGE — same rules
 *   2) HC gate required on the rescue (the -10.5% floodgate fix)
 *   3) + FADE+HC rescue lane (agWeak≥4 ∧ HC) — EDGE can't see these
 *   4) Flood-zone HC: exclude sizeRatio ≥ 2.5 wallets from HC status
 * All causal as-of; actual odds; odds-capped units.
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
const K = 12, MIN_N = 8, HC_RATIO = 1.5, FLOOD = 2.5;

const shortId = w => String(w || '').toLowerCase().slice(-6);
const mean = xs => xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : null;
const rnd = (x, n = 2) => !Number.isFinite(x) ? null : Math.round(x * 10 ** n) / 10 ** n;
function profitAt(u, o, won) { if (!u) return 0; if (!won) return -u; return o < 0 ? u * (100 / Math.abs(o)) : u * (o / 100); }
function oddsCap(u, o) {
  if (!Number.isFinite(o) || o === 0) return u;
  if (o >= 200) return Math.min(u, 1);
  if (o >= 151) return Math.min(u, 1.5);
  if (o >= 100) return Math.min(u, 2.5);
  return u;
}

(async () => {
  const cols = [['sharpFlowPicks', 'ML'], ['sharpFlowSpreads', 'SPREAD'], ['sharpFlowTotals', 'TOTAL']];
  const events = [];
  const stamped = new Map();
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
          if (tier !== 'FADE') stamped.set(key, { units, tier, agsV12, mkt, team: String(sd.team || sideKey), away: data.away || '', home: data.home || '' });
        }
      }
    }
  }
  events.sort((a, b) => a.date < b.date ? -1 : 1);

  const st = new Map();
  const G = k => { if (!st.has(k)) st.set(k, { w: 0, l: 0 }); return st.get(k); };

  const byKey = new Map(); let ei = 0;
  while (ei < events.length) {
    const d = events[ei].date; const day = [];
    while (ei < events.length && events[ei].date === d) day.push(events[ei++]);
    for (const e of day) {
      const forWd = e.wallets.filter(w => w.side === e.sideKey);
      const agWd = e.wallets.filter(w => w.side !== e.sideKey);
      if (!agWd.length) continue;
      // legacy EDGE (raw WR, n>=8 cliff)
      const rawWr = arr => {
        const xs = [];
        for (const w of arr) { const x = G(w.id + '|' + e.sport); const n = x.w + x.l; if (n >= MIN_N) xs.push(100 * x.w / n); }
        return xs.length ? mean(xs) : null;
      };
      const fWr = forWd.length ? rawWr(forWd) : null, aWr = rawWr(agWd);
      const legacyEdge = (fWr != null && aWr != null) ? fWr - aWr : null;
      // BayesEdge + agWeak
      const eb = x => { const n = x.w + x.l; return { p: (x.w + 0.5 * K) / (n + K), prec: n / (n + K) }; };
      const wMean = arr => { let n = 0, dn = 0; for (const w of arr) { const { p, prec } = eb(G(w.id + '|' + e.sport)); n += p * prec; dn += prec; } return dn > 0 ? n / dn : 0.5; };
      const bayesEdge = forWd.length ? 100 * (wMean(forWd) - wMean(agWd)) : null;
      const agWeak = 100 * (0.5 - wMean(agWd));
      // HC gates: standard + flood-filtered
      const hcOf = (maxSr) => {
        const inBand = w => w.sizeRatio >= HC_RATIO && (maxSr == null || w.sizeRatio < maxSr);
        const hf = forWd.filter(inBand), ha = agWd.filter(inBand);
        const dHc = (hf.length || ha.length) ? (hf.length ? mean(hf.map(w => w.sizeRatio)) : 0) - (ha.length ? mean(ha.map(w => w.sizeRatio)) : 0) : 0;
        return (hf.length - ha.length) >= 1 || dHc > 0 || (hf.length >= 1 && ha.length === 0) ? 1 : 0;
      };
      byKey.set(e.key, { date: e.date, won: e.won, odds: e.odds, legacyEdge, bayesEdge, agWeak, hcGate: hcOf(null), hcBand: hcOf(FLOOD) });
    }
    for (const e of day) for (const w of e.wallets) {
      if (w.side !== e.sideKey) continue;
      const x = G(w.id + '|' + e.sport); if (e.won) x.w++; else x.l++;
    }
  }

  const staked = [], muted = [];
  for (const [key, s] of stamped) {
    const m = byKey.get(key);
    if (!m) continue;
    const row = { ...m, ...s };
    if (s.units > 0 && s.tier !== 'MONITORING') staked.push(row);
    else if (s.agsV12 > 0) muted.push(row);
  }

  const summarize = rows => {
    let w = 0, stake = 0, pnl = 0, n = 0;
    for (const r of rows) {
      if (r.u <= 0) continue;
      n++;
      const u = oddsCap(r.u, r.odds);
      if (r.won) w++;
      stake += u; pnl += profitAt(u, r.odds, r.won);
    }
    return { n, wr: n ? rnd(100 * w / n, 1) : null, stake: rnd(stake), pnl: rnd(pnl), roi: stake > 0 ? rnd(100 * pnl / stake, 1) : null };
  };

  // ── RESCUE LANE comparison on the same muted pool ──
  const eTier = (edge) => edge >= 10 ? 6 : edge >= 5 ? 4 : edge >= 3 ? 3 : 0;
  const lanes = {
    'IMPLEMENTED: legacyEDGE>=3 tiers (no HC)': r => r.legacyEdge != null ? eTier(r.legacyEdge) : 0,
    'swap metric: BayesEdge>=3 tiers (no HC)': r => r.bayesEdge != null ? eTier(r.bayesEdge) : 0,
    'add gate: legacyEDGE>=3 tiers AND HC': r => (r.legacyEdge != null && r.hcGate) ? eTier(r.legacyEdge) : 0,
    'SESSION: BayesEdge>=5 AND HC @3u': r => (r.bayesEdge != null && r.bayesEdge >= 5 && r.hcGate) ? 3 : 0,
    'SESSION: + FADE lane (agWeak>=4 AND HC) @3u': r => ((r.bayesEdge != null && r.bayesEdge >= 5 && r.hcGate) || (r.agWeak >= 4 && r.hcGate)) ? 3 : 0,
    'SESSION w/ flood-filtered HC band': r => ((r.bayesEdge != null && r.bayesEdge >= 5 && r.hcBand) || (r.agWeak >= 4 && r.hcBand)) ? 3 : 0,
  };
  const rescueCmp = {};
  for (const [name, fn] of Object.entries(lanes)) {
    rescueCmp[name] = summarize(muted.map(r => ({ ...r, u: fn(r) })));
  }

  // ── HC band effect on the staked book quality slice ──
  const hcCmp = {
    'staked & hcGate (any size)': summarize(staked.filter(r => r.hcGate).map(r => ({ ...r, u: r.units }))),
    'staked & hcBand (1.5-2.5 only)': summarize(staked.filter(r => r.hcBand).map(r => ({ ...r, u: r.units }))),
    'staked & flood-only HC (>=2.5 drives gate)': summarize(staked.filter(r => r.hcGate && !r.hcBand).map(r => ({ ...r, u: r.units }))),
  };

  // ── legacy vs Bayes on muted pool coverage ──
  const coverage = {
    mutedTotal: muted.length,
    legacyEdgeAvailable: muted.filter(r => r.legacyEdge != null).length,
    bayesAvailable: muted.filter(r => r.bayesEdge != null).length,
  };

  // ── PICK-BY-PICK dump: every muted pick either lane touches ──
  const shippedU = r => r.legacyEdge != null ? eTier(r.legacyEdge) : 0;
  const sessionU = r => ((r.bayesEdge != null && r.bayesEdge >= 5 && r.hcGate) || (r.agWeak >= 4 && r.hcGate)) ? 3 : 0;
  const pickList = muted
    .filter(r => shippedU(r) > 0 || sessionU(r) > 0)
    .sort((a, b) => a.date < b.date ? -1 : a.date > b.date ? 1 : 0)
    .map(r => {
      const su = oddsCap(shippedU(r), r.odds), xu = oddsCap(sessionU(r), r.odds);
      return {
        date: r.date, sport: (r.mkt === 'TOTAL' ? '' : '') + (r.team || ''), mkt: r.mkt,
        game: r.away && r.home ? `${r.away} @ ${r.home}` : '',
        team: r.team, odds: r.odds,
        legacyEdge: rnd(r.legacyEdge, 1), bayesEdge: rnd(r.bayesEdge, 1), agWeak: rnd(r.agWeak, 1), hc: r.hcGate,
        shipped: rnd(su, 1), session: rnd(xu, 1),
        result: r.won ? 'W' : 'L',
        shippedPnl: rnd(profitAt(su, r.odds, r.won), 2),
        sessionPnl: rnd(profitAt(xu, r.odds, r.won), 2),
      };
    });
  let cumS = 0, cumX = 0;
  for (const p of pickList) { cumS += p.shippedPnl; cumX += p.sessionPnl; p.cumShipped = rnd(cumS, 1); p.cumSession = rnd(cumX, 1); }

  const out = { coverage, rescueCmp, hcCmp, pickList };
  writeFileSync('/tmp/winner_align_vs_session.json', JSON.stringify(out));
  console.log(JSON.stringify({ coverage, rescueCmp, nPicks: pickList.length }, null, 1));
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
