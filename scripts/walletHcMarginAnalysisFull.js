/**
 * walletHcMarginAnalysisFull.js — does HC margin select winners in the FULL
 * universe of picks (LOCKED + LEAN + SHADOW + MUTED + CANCELLED), not just
 * the shipped subset?
 *
 * Built on the same point-in-time tier infrastructure as walletGateScaleTest /
 * walletHcMarginAnalysis. Differences vs the shipped-only analysis:
 *
 *   - REMOVES the lockStage='SHADOW' filter
 *   - REMOVES the health.status ∈ {MUTED, CANCELLED} filter
 *   - REMOVES the peak.stars ≥ 2.5 filter
 *   - REMOVES the Δw≥+1 ∧ Δq≥+1 filter (we want to see Δw=0/-1/-2 too)
 *   - KEEPS  the superseded filter (avoids double-counting flipped sides)
 *
 * Outputs WALLET_HC_MARGIN_ANALYSIS_FULL.md with:
 *   §0  State distribution + per-state baseline WR/ROI
 *   §1  HC margin tier × state cell matrix
 *   §2  THE OVERRIDE TEST — would HC margin save MUTED/CANCELLED picks?
 *   §3  THE FLOOR-LOWER TEST — would HC margin save SHADOW picks?
 *   §4  Per-Σ × HC margin on the full sample (not just shipped)
 *   §5  Verdict — what's the action?
 *
 * Lens: point-in-time tiers (L2). Same tier timeline as walletGateScaleTest.
 */
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');

if (!admin.apps.length) {
  const sakPath = join(REPO_ROOT, 'serviceAccountKey.json');
  if (existsSync(sakPath)) {
    admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(sakPath, 'utf8'))) });
  } else {
    admin.initializeApp({ credential: admin.credential.cert({
      project_id: process.env.VITE_FIREBASE_PROJECT_ID,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }) });
  }
}
const db = admin.firestore();

const V6_CUTOVER  = '2026-04-18';
const QUALITY_CUT = 30;
const HC_RATIO    = 1.5;
const MIN_BETS    = 2;
const PICK_COLS = [['sharpFlowPicks', 'ML'], ['sharpFlowSpreads', 'SPREAD'], ['sharpFlowTotals', 'TOTAL']];
const OPPOSITE = { home: 'away', away: 'home', over: 'under', under: 'over' };

const americanToDecimal = (o) => (o === 0 ? 1.91 : (o > 0 ? 1 + o / 100 : 1 + 100 / Math.abs(o)));
const flatProfit = (o, win) => (win ? americanToDecimal(o) - 1 : -1);
const sign = (v, d = 1) => v == null || Number.isNaN(v) ? '—' : (v >= 0 ? '+' : '') + v.toFixed(d);
const pct  = (v, d = 1) => v == null || Number.isNaN(v) ? '—' : v.toFixed(d) + '%';

function normCdf(z) {
  if (!Number.isFinite(z)) return 0.5;
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989422804 * Math.exp(-z * z / 2);
  let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}
function twoPropZ(winsIn, nIn, winsOut, nOut) {
  if (nIn < 2 || nOut < 2) return { z: null, p: null };
  const pIn = winsIn / nIn, pOut = winsOut / nOut;
  const pPool = (winsIn + winsOut) / (nIn + nOut);
  const se = Math.sqrt(pPool * (1 - pPool) * (1 / nIn + 1 / nOut));
  if (se === 0 || !Number.isFinite(se)) return { z: null, p: null };
  const z = (pIn - pOut) / se;
  return { z, p: 2 * (1 - normCdf(Math.abs(z))) };
}

// ─── Tier timeline (mirrors walletGateScaleTest.js) ───────────────────
async function buildTierTimeline() {
  const profSnap = await db.collection('sharpWalletProfiles').get();
  const profiles = new Map();
  profSnap.forEach(doc => profiles.set(doc.id, doc.data()));
  const walletKeyToFull = new Map();
  for (const [key, p] of profiles) {
    const full = p.walletAddress || null;
    if (full) {
      walletKeyToFull.set(key, full);
      walletKeyToFull.set(full.slice(-6), full);
      walletKeyToFull.set(full.slice(0, 6), full);
    } else walletKeyToFull.set(key, key);
  }

  const aBets = [];
  for (const [col] of PICK_COLS) {
    const snap = await db.collection(col).where('date', '>=', V6_CUTOVER).get();
    for (const doc of snap.docs) {
      const d = doc.data();
      const sport = d.sport || 'UNK', date = d.date, sides = d.sides || {};
      let winningSide = null;
      for (const sk of Object.keys(sides)) {
        const oc = sides[sk]?.result?.outcome;
        if (oc === 'WIN') { winningSide = sk; break; }
        if (oc === 'LOSS' && OPPOSITE[sk]) { winningSide = OPPOSITE[sk]; break; }
      }
      if (!winningSide) continue;
      const seen = new Set();
      const peakOddsBySide = new Map();
      for (const [sk, sd] of Object.entries(sides)) {
        peakOddsBySide.set(sk, sd?.peak?.peakOdds ?? sd?.lock?.lockOdds ?? sd?.peak?.odds ?? sd?.lock?.odds ?? 0);
      }
      for (const [, side] of Object.entries(sides)) {
        const peak = side.peak || side.lock || {};
        const wd = peak?.v8Scoring?.walletDetails;
        if (!Array.isArray(wd)) continue;
        for (const w of wd) {
          if (!w.wallet || !w.side) continue;
          const dedupe = `${doc.id}_${w.wallet}`;
          if (seen.has(dedupe)) continue;
          seen.add(dedupe);
          aBets.push({ date, sport, wallet: w.wallet, won: w.side === winningSide ? 1 : 0, odds: peakOddsBySide.get(w.side) ?? 0 });
        }
      }
    }
  }

  const bSnap = await db.collection('sharp_action_positions').where('status', '==', 'GRADED').get();
  const bBets = [];
  bSnap.forEach(doc => {
    const d = doc.data();
    if (!d.wallet) return;
    const invested = Number(d.invested ?? d.size ?? 0);
    if (invested <= 0) return;
    const settledPnl = Number(d.settledPnl ?? d.positionPnl ?? 0);
    const walletShort = d.walletShort || String(d.wallet).slice(0, 6);
    bBets.push({ date: d.date, sport: d.sport, walletShort, invested, settledPnl });
  });

  const events = [];
  for (const b of aBets) {
    const canonical = walletKeyToFull.get(b.wallet) || b.wallet;
    events.push({ date: b.date, sport: b.sport, canonical, source: 'A', payload: b });
  }
  for (const b of bBets) {
    const canonical = walletKeyToFull.get(b.walletShort) || b.walletShort;
    events.push({ date: b.date, sport: b.sport, canonical, source: 'B', payload: b });
  }
  events.sort((x, y) => (x.date || '').localeCompare(y.date || ''));

  const stat = new Map();
  const getStat = (c, s) => {
    const k = `${c}|${s}`;
    let st = stat.get(k);
    if (!st) { st = { aN: 0, aWins: 0, aFlatPnl: 0, bN: 0, bInvested: 0, bPnl: 0, firstWR50: null, firstFlat: null, firstConfirmed: null }; stat.set(k, st); }
    return st;
  };
  for (const e of events) {
    if (!e.sport || !e.canonical) continue;
    const s = getStat(e.canonical, e.sport);
    if (e.source === 'A') { s.aN++; s.aWins += e.payload.won; s.aFlatPnl += flatProfit(e.payload.odds, e.payload.won === 1); }
    else { s.bN++; s.bInvested += e.payload.invested; s.bPnl += e.payload.settledPnl; }
    const aMet  = s.aN >= MIN_BETS && s.aFlatPnl > 0;
    const aWr50 = s.aN >= MIN_BETS && s.aWins / s.aN >= 0.5;
    const bMet  = s.bN >= MIN_BETS && s.bInvested > 0 && (s.bPnl / s.bInvested) > 0;
    if (aMet && bMet && !s.firstConfirmed) s.firstConfirmed = e.date;
    if (aMet         && !s.firstFlat)      s.firstFlat      = e.date;
    if (aWr50        && !s.firstWR50)      s.firstWR50      = e.date;
  }
  function tierAsOf(canonical, sport, date) {
    const k = `${canonical}|${sport}`;
    const s = stat.get(k);
    if (!s) return null;
    if (s.firstConfirmed && s.firstConfirmed <= date) return 'CONFIRMED';
    if (s.firstFlat      && s.firstFlat      <= date) return 'FLAT';
    if (s.firstWR50      && s.firstWR50      <= date) return 'WR50';
    return null;
  }
  return { tierAsOf, walletKeyToFull };
}

function aggregateTier(walletDetails, sideKey, sport, date, lensFn) {
  const out = { confFor: 0, confAg: 0, flatFor: 0, flatAg: 0, hcConfFor: 0, hcConfAg: 0, qFor: 0, qAg: 0, forW: 0, agW: 0 };
  if (!Array.isArray(walletDetails) || !sideKey) return out;
  for (const w of walletDetails) {
    if (!w?.side || !w?.wallet) continue;
    const isFor = w.side === sideKey;
    const tier = lensFn(w.wallet, sport, date);
    const sizeRatio = Number(w.sizeRatio ?? 0);
    const hc = sizeRatio >= HC_RATIO;
    if (tier === 'CONFIRMED') { if (isFor) { out.confFor++; if (hc) out.hcConfFor++; } else { out.confAg++; if (hc) out.hcConfAg++; } }
    else if (tier === 'FLAT') { if (isFor) out.flatFor++; else out.flatAg++; }
    if (tier === 'CONFIRMED' || tier === 'FLAT') { if (isFor) out.forW++; else out.agW++; }
    if ((Number(w.contribution) || 0) >= QUALITY_CUT) { if (isFor) out.qFor++; else out.qAg++; }
  }
  out.dwLegacy = out.forW - out.agW;
  out.dwConf   = out.confFor - out.confAg;
  out.dq       = out.qFor - out.qAg;
  out.hcMargin = out.hcConfFor - out.hcConfAg;
  return out;
}

function classifyState(side) {
  if (side.health?.status === 'CANCELLED') return 'CANCELLED';
  if (side.health?.status === 'MUTED') return 'MUTED';
  if (side.lockStage === 'SHADOW') return 'SHADOW';
  const peak = side.peak || side.lock || {};
  const peakUnits = peak?.units ?? 0;
  if (side.v8_lockTier === 'LEAN' || peakUnits === 0) return 'LEAN';
  return 'LOCKED';
}

async function loadAllSides(lensFn) {
  const rows = [];
  for (const [col, market] of PICK_COLS) {
    const snap = await db.collection(col).where('date', '>=', V6_CUTOVER).get();
    for (const doc of snap.docs) {
      const d = doc.data();
      const sport = d.sport || 'UNK', date = d.date;
      for (const [sideKey, side] of Object.entries(d.sides || {})) {
        const oc = side?.result?.outcome;
        if (oc !== 'WIN' && oc !== 'LOSS') continue;
        if (side.superseded) continue;
        const peak = side.peak || side.lock || {};
        const odds = peak?.peakOdds ?? side.lock?.lockOdds ?? peak?.odds ?? side.lock?.odds ?? null;
        const won = oc === 'WIN' ? 1 : 0;
        const wd = peak?.v8Scoring?.walletDetails;
        const t = aggregateTier(wd, sideKey, sport, date, lensFn);
        const flat = odds != null ? flatProfit(odds, won === 1) : 0;
        const dw = t.dwLegacy, dq = t.dq, sum = dw + dq;
        const state = classifyState(side);
        const peakUnits = peak?.units ?? 0;
        const peakStars = peak?.stars ?? 0;
        rows.push({
          date, sport, market, sideKey, docId: doc.id,
          dw, dq, sum, ...t, odds, won, flat, state,
          peakUnits, peakStars,
        });
      }
    }
  }
  return rows;
}

const STATES = ['LOCKED', 'LEAN', 'SHADOW', 'MUTED', 'CANCELLED'];
const sigmaBucket = (s) => s <= 0 ? 'Σ≤0' : s === 1 ? 'Σ=1' : s === 2 ? 'Σ=2' : s === 3 ? 'Σ=3' : s === 4 ? 'Σ=4' : s === 5 ? 'Σ=5' : s === 6 ? 'Σ=6' : 'Σ≥7';
const SIGMA_ORDER = ['Σ≤0', 'Σ=1', 'Σ=2', 'Σ=3', 'Σ=4', 'Σ=5', 'Σ=6', 'Σ≥7'];

function summarize(rows) {
  if (!rows.length) return { n: 0, wins: 0, losses: 0, wr: null, flatRoi: null, flatPnl: 0 };
  const wins = rows.filter(r => r.won === 1).length;
  const flatPnl = rows.reduce((s, r) => s + r.flat, 0);
  return { n: rows.length, wins, losses: rows.length - wins, wr: wins / rows.length * 100, flatRoi: (flatPnl / rows.length) * 100, flatPnl };
}

(async () => {
  console.log('[1/3] Building tier timeline…');
  const { tierAsOf, walletKeyToFull } = await buildTierTimeline();
  const lens = (walletKey, sport, date) => {
    const canonical = walletKeyToFull.get(walletKey) || walletKey;
    return tierAsOf(canonical, sport, date);
  };
  console.log('[2/3] Loading FULL universe of graded sides since v6 cutover…');
  const all = await loadAllSides(lens);
  const dates = [...new Set(all.map(r => r.date))].sort();
  console.log(`      ${all.length} sides · ${dates.length} days · ${dates[0]} → ${dates[dates.length - 1]}`);

  console.log('[3/3] Running full-universe HC margin analysis…');
  const out = [];
  const nowET = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
  out.push('# WALLET HC MARGIN ANALYSIS — FULL UNIVERSE (LOCKED + LEAN + SHADOW + MUTED + CANCELLED)');
  out.push('');
  out.push(`Generated: ${nowET} ET · sample ${all.length} sides · ${dates[0]} → ${dates[dates.length - 1]} (${dates.length} days)`);
  out.push('');
  out.push('**Why this analysis exists.** The shipped-only HC margin analysis (`WALLET_HC_MARGIN_ANALYSIS.md`) only looked at the ~89 picks that cleared the lock floor. This expands the lens to **every side ever written to Firestore since v6 cutover** — including the SHADOW (didn\'t qualify), MUTED (signal faded), and CANCELLED (winners-against) cohorts. The question: does HC margin select winners even in the killed cohorts? If yes, the floor / mute / cancel rules are over-aggressive.');
  out.push('');
  out.push('**Sample.** Every graded side (`outcome ∈ {WIN, LOSS}`) since 2026-04-18 with `superseded ≠ true`. NO floor / state / star filters.');
  out.push('');

  // ─── §0. State distribution ───────────────────────────────────────
  out.push('---');
  out.push('## §0. State distribution + baseline WR/ROI per state');
  out.push('');
  out.push('| State | N | W-L | WR | flat ROI | net flat |');
  out.push('|---|---|---|---|---|---|');
  for (const st of STATES) {
    const s = summarize(all.filter(r => r.state === st));
    if (!s.n) { out.push(`| ${st} | 0 | — | — | — | — |`); continue; }
    out.push(`| ${st} | ${s.n} | ${s.wins}-${s.losses} | ${pct(s.wr)} | ${sign(s.flatRoi, 1)}% | ${sign(s.flatPnl, 2)}u |`);
  }
  const total = summarize(all);
  out.push(`| **TOTAL** | **${total.n}** | **${total.wins}-${total.losses}** | **${pct(total.wr)}** | **${sign(total.flatRoi, 1)}%** | **${sign(total.flatPnl, 2)}u** |`);
  out.push('');

  // ─── §1. State × HC margin matrix ─────────────────────────────────
  out.push('---');
  out.push('## §1. State × HC margin tier matrix');
  out.push('');
  out.push('Three HC margin tiers within each state. Cells with N < 3 are noise (shown for inventory).');
  out.push('');
  out.push('| State | HC_m ≤0 (n / WR / ROI) | HC_m = +1 (n / WR / ROI) | HC_m ≥ +2 (n / WR / ROI) |');
  out.push('|---|---|---|---|');
  for (const st of STATES) {
    const rs = all.filter(r => r.state === st);
    const lo = summarize(rs.filter(r => r.hcMargin <= 0));
    const m1 = summarize(rs.filter(r => r.hcMargin === 1));
    const m2 = summarize(rs.filter(r => r.hcMargin >= 2));
    const fmt = s => s.n ? `${s.n} / ${pct(s.wr, 0)} / ${sign(s.flatRoi, 0)}%` : '—';
    out.push(`| ${st} | ${fmt(lo)} | ${fmt(m1)} | ${fmt(m2)} |`);
  }
  out.push('');

  // ─── §2. The override test — MUTED / CANCELLED + HC margin ────────
  out.push('---');
  out.push('## §2. THE OVERRIDE TEST — does HC margin save MUTED / CANCELLED picks?');
  out.push('');
  out.push('If MUTED / CANCELLED picks with positive HC margin actually win, the health-engine MUTE/CANCEL rules are over-aggressive and HC margin should override them.');
  out.push('');
  for (const st of ['MUTED', 'CANCELLED']) {
    const rs = all.filter(r => r.state === st);
    if (!rs.length) { out.push(`### ${st} — no picks in sample`); out.push(''); continue; }
    out.push(`### ${st} cohort (N=${rs.length} total)`);
    out.push('');
    out.push('| HC margin | n | W-L | WR | flat ROI | net flat | Δw / Δq context |');
    out.push('|---|---|---|---|---|---|---|');
    const tiers = [
      ['≤−1', r => r.hcMargin <= -1],
      ['= 0', r => r.hcMargin === 0],
      ['= +1', r => r.hcMargin === 1],
      ['≥ +2', r => r.hcMargin >= 2],
    ];
    for (const [label, pred] of tiers) {
      const cohort = rs.filter(pred);
      const s = summarize(cohort);
      if (!s.n) { out.push(`| ${label} | 0 | — | — | — | — | — |`); continue; }
      const avgDw = (cohort.reduce((a, r) => a + r.dw, 0) / cohort.length).toFixed(1);
      const avgDq = (cohort.reduce((a, r) => a + r.dq, 0) / cohort.length).toFixed(1);
      out.push(`| ${label} | ${s.n} | ${s.wins}-${s.losses} | ${pct(s.wr)} | ${sign(s.flatRoi, 1)}% | ${sign(s.flatPnl, 2)}u | avg Δw=${avgDw} Δq=${avgDq} |`);
    }
    // Override z-test: HC_m ≥ +1 vs HC_m ≤ 0 within this state
    const hi = rs.filter(r => r.hcMargin >= 1);
    const lo = rs.filter(r => r.hcMargin <= 0);
    const sHi = summarize(hi), sLo = summarize(lo);
    const z = twoPropZ(sHi.wins, sHi.n, sLo.wins, sLo.n);
    if (sHi.n && sLo.n) {
      out.push('');
      out.push(`**${st} ∧ HC_m ≥ +1 vs ≤ 0:** WR diff = ${sign((sHi.wr ?? 0) - (sLo.wr ?? 0), 1)} pp · ROI diff = ${sign((sHi.flatRoi ?? 0) - (sLo.flatRoi ?? 0), 1)}% · z-test p = ${z.p != null ? z.p.toFixed(3) : '—'}`);
      out.push('');
    }
  }

  // ─── §3. The floor-lower test — SHADOW + HC margin ────────────────
  out.push('---');
  out.push('## §3. THE FLOOR-LOWER TEST — does HC margin save SHADOW picks?');
  out.push('');
  out.push('SHADOW picks didn\'t qualify for the lock floor (Δw < +1 OR Δq < +1 OR Σ < +3, depending on era). If SHADOW + HC_m ≥ +1 actually wins, we should consider letting HC margin promote SHADOW → LEAN/LOCK.');
  out.push('');
  const shadow = all.filter(r => r.state === 'SHADOW');
  if (!shadow.length) {
    out.push('_No SHADOW picks in sample._');
    out.push('');
  } else {
    out.push(`SHADOW cohort total: **N=${shadow.length}**`);
    out.push('');
    out.push('| HC margin | n | W-L | WR | flat ROI | net flat | avg Δw / avg Δq |');
    out.push('|---|---|---|---|---|---|---|');
    const tiers = [
      ['≤−1', r => r.hcMargin <= -1],
      ['= 0', r => r.hcMargin === 0],
      ['= +1', r => r.hcMargin === 1],
      ['≥ +2', r => r.hcMargin >= 2],
    ];
    for (const [label, pred] of tiers) {
      const cohort = shadow.filter(pred);
      const s = summarize(cohort);
      if (!s.n) { out.push(`| ${label} | 0 | — | — | — | — | — |`); continue; }
      const avgDw = (cohort.reduce((a, r) => a + r.dw, 0) / cohort.length).toFixed(1);
      const avgDq = (cohort.reduce((a, r) => a + r.dq, 0) / cohort.length).toFixed(1);
      out.push(`| ${label} | ${s.n} | ${s.wins}-${s.losses} | ${pct(s.wr)} | ${sign(s.flatRoi, 1)}% | ${sign(s.flatPnl, 2)}u | ${avgDw} / ${avgDq} |`);
    }
    out.push('');
    const hi = shadow.filter(r => r.hcMargin >= 1);
    const lo = shadow.filter(r => r.hcMargin <= 0);
    const sHi = summarize(hi), sLo = summarize(lo);
    const z = twoPropZ(sHi.wins, sHi.n, sLo.wins, sLo.n);
    if (sHi.n && sLo.n) {
      out.push(`**SHADOW ∧ HC_m ≥ +1 vs ≤ 0:** WR diff = ${sign((sHi.wr ?? 0) - (sLo.wr ?? 0), 1)} pp · ROI diff = ${sign((sHi.flatRoi ?? 0) - (sLo.flatRoi ?? 0), 1)}% · z-test p = ${z.p != null ? z.p.toFixed(3) : '—'}`);
      out.push('');
    }
  }

  // ─── §4. Per-Σ × HC margin on FULL sample ─────────────────────────
  out.push('---');
  out.push('## §4. Per-Σ × HC margin tier — FULL SAMPLE (all states)');
  out.push('');
  out.push('Same Test 1 from `WALLET_HC_MARGIN_ANALYSIS.md` but on the full universe (no state filter, no Δw/Δq floor).');
  out.push('Bucket by Σ all the way down to Σ ≤ 0 — so we see the killed cohorts.');
  out.push('');
  out.push('| Σ | total N | HC_m ≤0 (n / WR / ROI) | HC_m =+1 (n / WR / ROI) | HC_m ≥+2 (n / WR / ROI) |');
  out.push('|---|---|---|---|---|');
  for (const sb of SIGMA_ORDER) {
    const rs = all.filter(r => sigmaBucket(r.sum) === sb);
    if (!rs.length) { out.push(`| ${sb} | 0 | — | — | — |`); continue; }
    const lo = summarize(rs.filter(r => r.hcMargin <= 0));
    const m1 = summarize(rs.filter(r => r.hcMargin === 1));
    const m2 = summarize(rs.filter(r => r.hcMargin >= 2));
    const fmt = s => s.n ? `${s.n} / ${pct(s.wr, 0)} / ${sign(s.flatRoi, 0)}%` : '—';
    out.push(`| ${sb} | ${rs.length} | ${fmt(lo)} | ${fmt(m1)} | ${fmt(m2)} |`);
  }
  out.push('');

  // ─── §4b. Lift test: HC_m ≥ +1 vs ≤0 at each Σ on full sample ─────
  out.push('### §4b. Lift_WR / Lift_ROI by Σ — full sample, HC_m ≥ +1 vs ≤ 0');
  out.push('');
  out.push('| Σ | OUT (≤0) WR / ROI | IN (≥+1) WR / ROI | Lift_WR | Lift_ROI | z-test p |');
  out.push('|---|---|---|---|---|---|');
  let pos = 0, evald = 0, pooledLW = 0, pooledLR = 0, pooledN = 0;
  for (const sb of SIGMA_ORDER) {
    const rs = all.filter(r => sigmaBucket(r.sum) === sb);
    const inR = rs.filter(r => r.hcMargin >= 1);
    const outR = rs.filter(r => r.hcMargin <= 0);
    const sIn = summarize(inR), sOut = summarize(outR);
    const lW = (sIn.wr != null && sOut.wr != null) ? sIn.wr - sOut.wr : null;
    const lR = (sIn.flatRoi != null && sOut.flatRoi != null) ? sIn.flatRoi - sOut.flatRoi : null;
    const z = twoPropZ(sIn.wins, sIn.n, sOut.wins, sOut.n);
    if (lW != null && sIn.n >= 2 && sOut.n >= 2) {
      evald++;
      if (lW > 0) pos++;
      pooledLW += lW * sIn.n;
      pooledLR += (lR ?? 0) * sIn.n;
      pooledN += sIn.n;
    }
    const inFmt = sIn.n ? `${pct(sIn.wr, 0)} / ${sign(sIn.flatRoi, 0)}%` : 'n=0';
    const outFmt = sOut.n ? `${pct(sOut.wr, 0)} / ${sign(sOut.flatRoi, 0)}%` : 'n=0';
    out.push(`| ${sb} | ${outFmt} | ${inFmt} | ${lW != null ? sign(lW, 1) : '—'} | ${lR != null ? sign(lR, 1) + '%' : '—'} | ${z.p != null ? z.p.toFixed(3) : '—'} |`);
  }
  const avgLW = pooledN ? pooledLW / pooledN : null;
  const avgLR = pooledN ? pooledLR / pooledN : null;
  out.push(`| **Pooled** | weighted | weighted | **${sign(avgLW, 1)} pp** | **${sign(avgLR, 1)}%** | (positive in **${pos}/${evald}** evaluated buckets) |`);
  out.push('');

  // ─── §5. Verdict & action ─────────────────────────────────────────
  out.push('---');
  out.push('## §5. Verdict & action');
  out.push('');
  out.push('**Read §2.** If MUTED ∧ HC_m ≥ +1 has WR ≥ 55% AND p < 0.20 (and N ≥ 5), the health engine is over-muting picks that have HC backing. Consider an HC-margin override on MUTE.');
  out.push('');
  out.push('**Read §2 (CANCELLED).** If CANCELLED ∧ HC_m ≥ +1 has WR ≥ 55% AND N ≥ 5, even the strong-dissent CANCEL rule is too aggressive. (Less likely to fire — CANCEL fires when ≥2 proven winners are AGAINST, which usually correlates with HC dissent too.)');
  out.push('');
  out.push('**Read §3.** If SHADOW ∧ HC_m ≥ +1 has WR ≥ 55% AND p < 0.10 (and N ≥ 10), HC margin should be allowed to PROMOTE SHADOW picks — i.e. the lock floor (currently Σ ≥ +3) should be relaxed for HC-backed picks.');
  out.push('');
  out.push('**Read §4b.** If pooled Lift_WR ≥ +20 pp on the FULL sample (currently +38 pp on shipped-only), the HC margin signal is universal — even stronger than the shipped-only analysis suggested.');
  out.push('');
  out.push('**Sample warning.** Each killed-state × HC_m cell is small. Treat any single cell with N < 5 as directional only; require N ≥ 10 before changing production rules.');
  out.push('');

  const md = out.join('\n');
  writeFileSync(join(REPO_ROOT, 'WALLET_HC_MARGIN_ANALYSIS_FULL.md'), md);
  console.log(`      Wrote WALLET_HC_MARGIN_ANALYSIS_FULL.md`);
  process.exit(0);
})().catch(err => { console.error(err); process.exit(1); });
