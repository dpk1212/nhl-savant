/**
 * floorLoweringTierGates.js — should v7.0 lower its LOCK floor from
 * Σ ≥ +5 to Σ ≥ +3 or Σ ≥ +4 with a wallet-TIER side-gate?
 *
 * Background: the existing FLOOR_LOWERING_ANALYSIS tested LB-rank,
 * opposition, regime, and market gates inside Σ=+4 and concluded most
 * don't rescue the cell credibly. It did NOT test the wallet-tier
 * gates that the WALLET_FEATURE_PREDICTIVENESS study identified as
 * the highest-leverage signals (CONFIRMED tier and HC-CONFIRMED).
 *
 * This report fills that gap. For every pick at Σ ∈ {3, 4} with
 * Δw ≥ +1 ∧ Δq ≥ +1 (the LEAN cell under v7), we test gates derived
 * from the vault findings:
 *
 *   G1  CONFIRMED_for ≥ 1                            ("any proven backer")
 *   G2  CONFIRMED_for ≥ 2                            ("multiple proven backers")
 *   G3  (CONFIRMED_for − CONFIRMED_ag) ≥ 1           ("CONFIRMED net margin")
 *   G4  (CONFIRMED_for − CONFIRMED_ag) ≥ 2           ("strong CONFIRMED margin")
 *   G5  HC_CONFIRMED_for ≥ 1                         ("any HC backer")
 *   G6  HC_CONFIRMED_for ≥ 1 ∧ HC_CONFIRMED_ag = 0   ("HC dominance")
 *   G7  CONFIRMED_for ≥ 1 ∧ FLAT_for = 0             ("zero FLAT contamination")
 *   G8  CONFIRMED_for ≥ 1 ∧ CONFIRMED_ag = 0         ("no proven opposition")
 *   G9  G3 ∨ G6                                      ("net CONFIRMED OR HC dominance")
 *   G10 G4 ∨ G6                                      ("strong CONFIRMED margin OR HC dominance")
 *
 * Each gate is evaluated on Σ=3 alone, Σ=4 alone, and Σ ∈ {3,4} pooled.
 *
 * All tier evaluations use POINT-IN-TIME tiers (chronologically replayed
 * Source A + B qualification) to avoid lookahead bias.
 *
 * Output: FLOOR_LOWERING_TIER_GATES.md
 *
 * Usage:
 *   node scripts/floorLoweringTierGates.js
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
    admin.initializeApp({
      credential: admin.credential.cert({
        project_id: process.env.VITE_FIREBASE_PROJECT_ID,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
}
const db = admin.firestore();

// ── Constants ──────────────────────────────────────────────────────
const V6_CUTOVER  = '2026-04-18';
const QUALITY_CUT = 30;
const HC_RATIO    = 1.5;
const MIN_BETS    = 2;
const PICK_COLS = [
  ['sharpFlowPicks',   'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals',  'TOTAL'],
];
const OPPOSITE = { home: 'away', away: 'home', over: 'under', under: 'over' };

// ── Helpers ────────────────────────────────────────────────────────
const americanToDecimal = (o) => (o === 0 ? 1.91 : (o > 0 ? 1 + o / 100 : 1 + 100 / Math.abs(o)));
const flatProfit = (o, win) => (win ? americanToDecimal(o) - 1 : -1);
const sign = (v, d = 1) => v == null || Number.isNaN(v) ? '—' : (v >= 0 ? '+' : '') + v.toFixed(d);
const pct  = (v, d = 1) => v == null || Number.isNaN(v) ? '—' : v.toFixed(d) + '%';

function wilson(wins, n, z = 1.96) {
  if (n === 0) return [0, 0];
  const p = wins / n;
  const denom = 1 + z * z / n;
  const center = (p + z * z / (2 * n)) / denom;
  const margin = z * Math.sqrt((p * (1 - p) + z * z / (4 * n)) / n) / denom;
  return [Math.max(0, center - margin), Math.min(1, center + margin)];
}
function mean(xs) { return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN; }
function stdev(xs) {
  if (xs.length < 2) return NaN;
  const m = mean(xs);
  return Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - 1));
}
function normCdf(z) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989422804 * Math.exp(-z * z / 2);
  let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}
function tTestVsZero(xs) {
  const n = xs.length;
  if (n < 2) return { t: null, p: null, sig: false };
  const m = mean(xs);
  const s = stdev(xs);
  if (s === 0 || !Number.isFinite(s)) return { t: null, p: null, sig: false };
  const t = m / (s / Math.sqrt(n));
  const p = 2 * (1 - normCdf(Math.abs(t)));
  return { t, p, sig: p < 0.05 };
}
function summarize(rows) {
  if (!rows.length) return { n: 0 };
  const wins = rows.filter(r => r.won === 1).length;
  const losses = rows.length - wins;
  const wr = (wins / rows.length) * 100;
  const flat = rows.reduce((s, r) => s + r.flat, 0);
  const flatRoi = (flat / rows.length) * 100;
  const peak = rows.reduce((s, r) => s + r.peakPnl, 0);
  const [lo, hi] = wilson(wins, rows.length);
  const t = tTestVsZero(rows.map(r => r.flat));
  return { n: rows.length, wins, losses, wr, wrLo: lo * 100, wrHi: hi * 100, flat, flatRoi, peak, t: t.t, p: t.p, sig: t.sig };
}
function fmt(s) {
  if (!s || s.n === 0) return '—';
  return `${s.n}p · ${s.wins}-${s.losses} · ${pct(s.wr)} · ${sign(s.flatRoi, 1)}%${s.sig ? ' ✓' : ''}`;
}
function fmtRow(s) {
  if (!s || s.n === 0) return '0 | — | — | — | — | — |';
  return `${s.n} | ${pct(s.wr, 1)} (${pct(s.wrLo, 1)}–${pct(s.wrHi, 1)}) | ${sign(s.flatRoi, 1)}%${s.sig ? ' ✓' : ''} | ${sign(s.peak, 2)}u | ${s.t != null ? s.t.toFixed(2) : '—'} | ${s.p != null ? s.p.toFixed(3) : '—'}`;
}

// ── Build point-in-time tier timeline (mirrors walletPredictivenessBacktest) ──
async function buildTierTimeline() {
  // Load profiles for canonical address bridging
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
    } else {
      walletKeyToFull.set(key, key);
    }
  }

  // Source A — every wallet bet from walletDetails on graded sides
  const aBets = [];
  for (const [col] of PICK_COLS) {
    const snap = await db.collection(col).where('date', '>=', V6_CUTOVER).get();
    for (const doc of snap.docs) {
      const d = doc.data();
      const sport = d.sport || 'UNK';
      const date = d.date;
      const sides = d.sides || {};
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
      for (const [sideKey, side] of Object.entries(sides)) {
        const peak = side.peak || side.lock || {};
        const wd = peak?.v8Scoring?.walletDetails;
        if (!Array.isArray(wd)) continue;
        for (const w of wd) {
          if (!w.wallet || !w.side) continue;
          const dedupe = `${doc.id}_${w.wallet}`;
          if (seen.has(dedupe)) continue;
          seen.add(dedupe);
          aBets.push({
            date,
            sport,
            wallet: w.wallet,
            won: w.side === winningSide ? 1 : 0,
            odds: peakOddsBySide.get(w.side) ?? 0,
          });
        }
      }
    }
  }

  // Source B — graded sharp_action_positions
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
  function getStat(canonical, sport) {
    const k = `${canonical}|${sport}`;
    let s = stat.get(k);
    if (!s) {
      s = { aN: 0, aWins: 0, aFlatPnl: 0, bN: 0, bInvested: 0, bPnl: 0,
            firstWR50: null, firstFlat: null, firstConfirmed: null };
      stat.set(k, s);
    }
    return s;
  }
  for (const e of events) {
    if (!e.sport || !e.canonical) continue;
    const s = getStat(e.canonical, e.sport);
    if (e.source === 'A') {
      s.aN += 1;
      s.aWins += e.payload.won;
      s.aFlatPnl += flatProfit(e.payload.odds, e.payload.won === 1);
    } else {
      s.bN += 1;
      s.bInvested += e.payload.invested;
      s.bPnl += e.payload.settledPnl;
    }
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

  return { profiles, walletKeyToFull, tierAsOf };
}

// ── Per-pick aggregation: tier-based counts ────────────────────────
function aggregateTier(walletDetails, sideKey, sport, date, lensFn) {
  const out = {
    confFor: 0, confAg: 0,
    flatFor: 0, flatAg: 0,
    hcConfFor: 0, hcConfAg: 0,
    qFor: 0, qAg: 0,
    forW: 0, agW: 0,             // legacy whitelist (CONFIRMED + FLAT)
  };
  if (!Array.isArray(walletDetails) || !sideKey) return out;
  for (const w of walletDetails) {
    if (!w?.side || !w?.wallet) continue;
    const isFor = w.side === sideKey;
    const tier = lensFn(w.wallet, sport, date);
    const sizeRatio = Number(w.sizeRatio ?? 0);
    const hc = sizeRatio >= HC_RATIO;
    if (tier === 'CONFIRMED') {
      if (isFor) { out.confFor++; if (hc) out.hcConfFor++; }
      else       { out.confAg++;  if (hc) out.hcConfAg++; }
    } else if (tier === 'FLAT') {
      if (isFor) out.flatFor++; else out.flatAg++;
    }
    if (tier === 'CONFIRMED' || tier === 'FLAT') {
      if (isFor) out.forW++; else out.agW++;
    }
    if ((Number(w.contribution) || 0) >= QUALITY_CUT) {
      if (isFor) out.qFor++; else out.qAg++;
    }
  }
  out.dwLegacy = out.forW - out.agW;
  out.dwConf   = out.confFor - out.confAg;
  out.dq       = out.qFor - out.qAg;
  return out;
}

// ── Loader (mirrors floorLoweringAnalysis.js inclusion rule) ───────
async function loadPicks(lensFn) {
  const rows = [];
  for (const [col, market] of PICK_COLS) {
    const snap = await db.collection(col).where('date', '>=', V6_CUTOVER).get();
    for (const doc of snap.docs) {
      const d = doc.data();
      const sport = d.sport || 'UNK';
      const date = d.date;
      for (const [sideKey, side] of Object.entries(d.sides || {})) {
        const oc = side?.result?.outcome;
        if (oc !== 'WIN' && oc !== 'LOSS') continue;
        if (side.superseded) continue;
        if (side.health?.status === 'CANCELLED' || side.health?.status === 'MUTED') continue;
        if (side.lockStage === 'SHADOW') continue;
        const peak = side.peak || side.lock || {};
        if ((peak?.stars ?? 0) < 2.5) continue;

        const odds = peak?.peakOdds ?? side.lock?.lockOdds ?? peak?.odds ?? side.lock?.odds ?? null;
        const peakUnits = peak?.units || 1;
        const won = oc === 'WIN' ? 1 : 0;
        const wd = peak?.v8Scoring?.walletDetails;

        // Derive Δw_legacy and Δq from frozen walletDetails using point-in-time tiers
        const t = aggregateTier(wd, sideKey, sport, date, lensFn);
        const dw = t.dwLegacy;
        const dq = t.dq;

        const flat = odds != null ? flatProfit(odds, won === 1) : 0;
        const peakPnl = won ? (peakUnits * (americanToDecimal(odds) - 1)) : -peakUnits;

        rows.push({
          date, sport, market, sideKey, docId: doc.id,
          dw, dq, sum: dw + dq,
          ...t,
          odds, won, peakUnits, peakPnl,
          flat,
        });
      }
    }
  }
  return rows;
}

// ── Main ───────────────────────────────────────────────────────────
(async () => {
  console.log('[1/3] Building point-in-time tier timeline…');
  const { tierAsOf, walletKeyToFull } = await buildTierTimeline();
  const lens = (walletKey, sport, date) => {
    const canonical = walletKeyToFull.get(walletKey) || walletKey;
    return tierAsOf(canonical, sport, date);
  };

  console.log('[2/3] Loading and aggregating graded picks under L2 tiers…');
  const all = await loadPicks(lens);
  const dates = [...new Set(all.map(r => r.date))].sort();

  console.log(`      ${all.length} graded sides · ${dates.length} days · ${dates[0]} → ${dates[dates.length - 1]}`);
  console.log('[3/3] Running gate analysis…');

  // Cohort definitions (using point-in-time Δw_legacy + Δq from frozen wd)
  const σ3 = all.filter(r => r.sum === 3 && r.dw >= 1 && r.dq >= 1);
  const σ4 = all.filter(r => r.sum === 4 && r.dw >= 1 && r.dq >= 1);
  const σ34 = all.filter(r => (r.sum === 3 || r.sum === 4) && r.dw >= 1 && r.dq >= 1);
  const σ5 = all.filter(r => r.sum === 5 && r.dw >= 1 && r.dq >= 1);
  const σ6plus = all.filter(r => r.sum >= 6 && r.dw >= 1 && r.dq >= 1);
  const v70Lock = all.filter(r => r.sum >= 5 && r.dw >= 1 && r.dq >= 1);

  const out = [];
  const nowET = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

  out.push('# FLOOR-LOWERING WITH WALLET-TIER GATES');
  out.push('');
  out.push(`Generated: ${nowET} ET · sample ${all.length} graded sides · ${dates[0]} → ${dates[dates.length - 1]} (${dates.length} days)`);
  out.push('');
  out.push('**Question.** The vault analysis showed CONFIRMED wallets win at 59.3% / +9.7pp lift, while FLAT wallets bleed at 43.6% / −5.1pp lift. HC-CONFIRMED wallets (sizeRatio ≥ 1.5×) hit 63–70% WR. Does this give us enough signal to lower the v7.0 LOCK floor from `Σ ≥ +5` to `Σ ≥ +3` or `Σ ≥ +4` for picks where the wallet composition is favourable?');
  out.push('');
  out.push('**Lens.** All tier evaluations use POINT-IN-TIME tiers from chronological replay — the L2 lens validated in `WALLET_PREDICTIVENESS_BACKTEST.md`. Δw and Δq are recomputed under L2 tiers from the frozen walletDetails on each pick.');
  out.push('');
  out.push('**Inclusion rule** mirrors live Pick Performance dashboard. WR shown with Wilson 95% CI; ✓ = t-test vs zero clears p < 0.05.');
  out.push('');

  // §1. Reference cohorts
  out.push('---');
  out.push('## §1. Reference cohorts (under L2 tiers)');
  out.push('');
  out.push('| Cohort | N | WR (95% CI) | Flat ROI | Peak PnL | t | p |');
  out.push('|---|---|---|---|---|---|---|');
  out.push(`| v7.0 LOCK baseline (Σ ≥ +5) | ${fmtRow(summarize(v70Lock))} |`);
  out.push(`| Σ = +5 alone | ${fmtRow(summarize(σ5))} |`);
  out.push(`| Σ ≥ +6 alone | ${fmtRow(summarize(σ6plus))} |`);
  out.push(`| Σ = +4 LEAN cell | ${fmtRow(summarize(σ4))} |`);
  out.push(`| Σ = +3 LEAN cell | ${fmtRow(summarize(σ3))} |`);
  out.push(`| Σ ∈ {3, 4} (full LEAN cohort) | ${fmtRow(summarize(σ34))} |`);
  out.push('');
  out.push('Note. Δw_legacy here is recomputed under L2 (point-in-time) tiers from frozen walletDetails. This may differ slightly from the dwFrozen stamp, which used the live profiles cache at lock time. Σ values in the L2 lens reflect what each pick *actually represented* given the wallets\' state on the pick date.');
  out.push('');

  // §2. Tier composition of LEAN cells
  out.push('---');
  out.push('## §2. Tier composition of LEAN cells (Σ ∈ {3, 4})');
  out.push('');
  function tierBreakdown(rows, label) {
    const totalConf = rows.reduce((s, r) => s + r.confFor, 0);
    const totalConfAg = rows.reduce((s, r) => s + r.confAg, 0);
    const totalFlat = rows.reduce((s, r) => s + r.flatFor, 0);
    const totalFlatAg = rows.reduce((s, r) => s + r.flatAg, 0);
    const totalHc = rows.reduce((s, r) => s + r.hcConfFor, 0);
    const totalHcAg = rows.reduce((s, r) => s + r.hcConfAg, 0);
    const withConf1 = rows.filter(r => r.confFor >= 1).length;
    const withConf2 = rows.filter(r => r.confFor >= 2).length;
    const withHc = rows.filter(r => r.hcConfFor >= 1).length;
    const noFlat = rows.filter(r => r.flatFor === 0 && r.confFor >= 1).length;
    return { label, totalConf, totalConfAg, totalFlat, totalFlatAg, totalHc, totalHcAg,
             withConf1, withConf2, withHc, noFlat, n: rows.length };
  }
  const cmp34 = tierBreakdown(σ34, 'Σ ∈ {3,4}');
  const cmp3 = tierBreakdown(σ3, 'Σ = +3');
  const cmp4 = tierBreakdown(σ4, 'Σ = +4');
  out.push('| Cohort | N | CONFIRMED for/ag | FLAT for/ag | HC-CONF for/ag | ≥1 CONF backing | ≥2 CONF backing | ≥1 HC backing | CONF backing & 0 FLAT |');
  out.push('|---|---|---|---|---|---|---|---|---|');
  for (const c of [cmp34, cmp3, cmp4]) {
    out.push(`| ${c.label} | ${c.n} | ${c.totalConf}/${c.totalConfAg} | ${c.totalFlat}/${c.totalFlatAg} | ${c.totalHc}/${c.totalHcAg} | ${c.withConf1} (${pct(100 * c.withConf1 / Math.max(c.n, 1))}) | ${c.withConf2} (${pct(100 * c.withConf2 / Math.max(c.n, 1))}) | ${c.withHc} (${pct(100 * c.withHc / Math.max(c.n, 1))}) | ${c.noFlat} (${pct(100 * c.noFlat / Math.max(c.n, 1))}) |`);
  }
  out.push('');

  // §3. Gate evaluation
  out.push('---');
  out.push('## §3. Tier-based rescue gates');
  out.push('');
  out.push('Each gate filters the LEAN cohort to a wallet-composition subset. Useful gate: holds N ≥ 6, lifts flat ROI > 0, ideally clears p < 0.05.');
  out.push('');

  const GATES = [
    ['G1', 'CONFIRMED_for ≥ 1',                                                  r => r.confFor >= 1],
    ['G2', 'CONFIRMED_for ≥ 2',                                                  r => r.confFor >= 2],
    ['G3', '(CONF_for − CONF_ag) ≥ 1',                                            r => (r.confFor - r.confAg) >= 1],
    ['G4', '(CONF_for − CONF_ag) ≥ 2',                                            r => (r.confFor - r.confAg) >= 2],
    ['G5', 'HC_CONFIRMED_for ≥ 1',                                                r => r.hcConfFor >= 1],
    ['G6', 'HC_CONFIRMED_for ≥ 1 ∧ HC_CONFIRMED_ag = 0',                          r => r.hcConfFor >= 1 && r.hcConfAg === 0],
    ['G7', 'CONFIRMED_for ≥ 1 ∧ FLAT_for = 0',                                    r => r.confFor >= 1 && r.flatFor === 0],
    ['G8', 'CONFIRMED_for ≥ 1 ∧ CONFIRMED_ag = 0',                                r => r.confFor >= 1 && r.confAg === 0],
    ['G9', '(CONF_for − CONF_ag) ≥ 1  OR  HC dominance',                          r => ((r.confFor - r.confAg) >= 1) || (r.hcConfFor >= 1 && r.hcConfAg === 0)],
    ['G10', '(CONF_for − CONF_ag) ≥ 2  OR  HC dominance',                         r => ((r.confFor - r.confAg) >= 2) || (r.hcConfFor >= 1 && r.hcConfAg === 0)],
  ];

  for (const [cohortLabel, cohort] of [['Σ ∈ {3, 4} pooled', σ34], ['Σ = +4 alone', σ4], ['Σ = +3 alone', σ3]]) {
    out.push(`### §3.${cohortLabel === 'Σ ∈ {3, 4} pooled' ? 'a' : (cohortLabel.includes('+4') ? 'b' : 'c')} ${cohortLabel}`);
    out.push('');
    out.push('| Gate | Description | N | WR (95% CI) | Flat ROI | Peak PnL | t | p |');
    out.push('|---|---|---|---|---|---|---|---|');
    out.push(`| (none) | full cohort | ${fmtRow(summarize(cohort))} |`);
    for (const [gid, desc, fn] of GATES) {
      const sub = cohort.filter(fn);
      out.push(`| ${gid} | ${desc} | ${fmtRow(summarize(sub))} |`);
    }
    out.push('');
  }

  // §4. Combined-floor projections
  out.push('---');
  out.push('## §4. Combined-floor projections');
  out.push('');
  out.push('Each row is a candidate v7.1 LOCK rule. "lift vs v7.0" = (flat ROI − v7.0 baseline flat ROI). The shipped slate is everything that meets the rule.');
  out.push('');
  const v70Sum = summarize(v70Lock);
  const FLOORS = [
    ['v7.0 baseline (Σ ≥ +5)',                                              r => r.dw >= 1 && r.dq >= 1 && r.sum >= 5],
    ['Σ ≥ +5 OR (Σ = +4 ∧ G3: net CONFIRMED ≥ +1)',                        r => (r.dw >= 1 && r.dq >= 1) && (r.sum >= 5 || (r.sum === 4 && (r.confFor - r.confAg) >= 1))],
    ['Σ ≥ +5 OR (Σ = +4 ∧ G4: net CONFIRMED ≥ +2)',                        r => (r.dw >= 1 && r.dq >= 1) && (r.sum >= 5 || (r.sum === 4 && (r.confFor - r.confAg) >= 2))],
    ['Σ ≥ +5 OR (Σ = +4 ∧ G6: HC dominance)',                              r => (r.dw >= 1 && r.dq >= 1) && (r.sum >= 5 || (r.sum === 4 && r.hcConfFor >= 1 && r.hcConfAg === 0))],
    ['Σ ≥ +5 OR (Σ = +4 ∧ G7: CONF ≥ 1, no FLAT)',                         r => (r.dw >= 1 && r.dq >= 1) && (r.sum >= 5 || (r.sum === 4 && r.confFor >= 1 && r.flatFor === 0))],
    ['Σ ≥ +5 OR (Σ = +4 ∧ G9: CONF≥1 OR HC dominance)',                    r => (r.dw >= 1 && r.dq >= 1) && (r.sum >= 5 || (r.sum === 4 && (((r.confFor - r.confAg) >= 1) || (r.hcConfFor >= 1 && r.hcConfAg === 0))))],
    ['Σ ≥ +5 OR (Σ ∈ {3,4} ∧ G3: net CONFIRMED ≥ +1)',                     r => (r.dw >= 1 && r.dq >= 1) && (r.sum >= 5 || ((r.sum === 3 || r.sum === 4) && (r.confFor - r.confAg) >= 1))],
    ['Σ ≥ +5 OR (Σ ∈ {3,4} ∧ G4: net CONFIRMED ≥ +2)',                     r => (r.dw >= 1 && r.dq >= 1) && (r.sum >= 5 || ((r.sum === 3 || r.sum === 4) && (r.confFor - r.confAg) >= 2))],
    ['Σ ≥ +5 OR (Σ ∈ {3,4} ∧ G6: HC dominance)',                           r => (r.dw >= 1 && r.dq >= 1) && (r.sum >= 5 || ((r.sum === 3 || r.sum === 4) && r.hcConfFor >= 1 && r.hcConfAg === 0))],
    ['Σ ≥ +5 OR (Σ ∈ {3,4} ∧ G9)',                                          r => (r.dw >= 1 && r.dq >= 1) && (r.sum >= 5 || ((r.sum === 3 || r.sum === 4) && (((r.confFor - r.confAg) >= 1) || (r.hcConfFor >= 1 && r.hcConfAg === 0))))],
    ['Σ ≥ +4 (no gate — fully lower)',                                      r => r.dw >= 1 && r.dq >= 1 && r.sum >= 4],
    ['Σ ≥ +3 (no gate — fully lower)',                                      r => r.dw >= 1 && r.dq >= 1 && r.sum >= 3],
  ];
  out.push('| Floor rule | N | WR (95% CI) | Flat ROI | Peak PnL | t | p | lift vs v7.0 |');
  out.push('|---|---|---|---|---|---|---|---|');
  for (const [label, fn] of FLOORS) {
    const sub = all.filter(fn);
    const s = summarize(sub);
    const lift = (s.flatRoi != null && v70Sum.flatRoi != null) ? s.flatRoi - v70Sum.flatRoi : null;
    out.push(`| ${label} | ${fmtRow(s)} | ${sign(lift, 1)}% |`);
  }
  out.push('');

  // §5. Per-sport for the most promising candidates
  out.push('---');
  out.push('## §5. Per-sport breakdown (most promising candidates)');
  out.push('');
  const sports = [...new Set(all.map(r => r.sport))].sort();
  const SPORT_FLOORS = [
    ['Σ ≥ +5 OR (Σ = +4 ∧ G6: HC dominance)',                              r => (r.dw >= 1 && r.dq >= 1) && (r.sum >= 5 || (r.sum === 4 && r.hcConfFor >= 1 && r.hcConfAg === 0))],
    ['Σ ≥ +5 OR (Σ = +4 ∧ G3: net CONFIRMED ≥ +1)',                        r => (r.dw >= 1 && r.dq >= 1) && (r.sum >= 5 || (r.sum === 4 && (r.confFor - r.confAg) >= 1))],
    ['Σ ≥ +5 OR (Σ ∈ {3,4} ∧ G4: net CONFIRMED ≥ +2)',                     r => (r.dw >= 1 && r.dq >= 1) && (r.sum >= 5 || ((r.sum === 3 || r.sum === 4) && (r.confFor - r.confAg) >= 2))],
    ['Σ ≥ +5 OR (Σ ∈ {3,4} ∧ G6: HC dominance)',                           r => (r.dw >= 1 && r.dq >= 1) && (r.sum >= 5 || ((r.sum === 3 || r.sum === 4) && r.hcConfFor >= 1 && r.hcConfAg === 0))],
  ];
  for (const [label, fn] of SPORT_FLOORS) {
    out.push(`### ${label}`);
    out.push('');
    out.push('| Sport | N | WR (95% CI) | Flat ROI | Peak PnL | t | p |');
    out.push('|---|---|---|---|---|---|---|');
    for (const sport of sports) {
      const sub = all.filter(r => r.sport === sport && fn(r));
      out.push(`| ${sport} | ${fmtRow(summarize(sub))} |`);
    }
    out.push('');
  }

  // §6. Pick-level diff — what gets newly admitted under the best candidate?
  out.push('---');
  out.push('## §6. Pick-level diff — newly admitted Σ=+4 picks under each gate');
  out.push('');
  out.push('What the gates would actually promote from LEAN → LOCKED, and how those picks performed.');
  out.push('');

  for (const [gid, desc, fn] of [['G3', '(CONF_for − CONF_ag) ≥ 1', r => (r.confFor - r.confAg) >= 1],
                                  ['G6', 'HC dominance', r => r.hcConfFor >= 1 && r.hcConfAg === 0]]) {
    out.push(`### ${gid}: ${desc}`);
    out.push('');
    out.push('| Date | Sport | Mkt | Pick | Σ | (Δw, Δq) | CONF for/ag | HC for/ag | Outcome | Flat | Peak |');
    out.push('|---|---|---|---|---|---|---|---|---|---|---|');
    const adm = σ34.filter(fn).sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    for (const r of adm) {
      out.push(`| ${r.date} | ${r.sport} | ${r.market} | \`${r.docId}\` ${r.sideKey} | ${r.sum} | (${r.dw}, ${r.dq}) | ${r.confFor}/${r.confAg} | ${r.hcConfFor}/${r.hcConfAg} | ${r.won === 1 ? 'WIN' : 'LOSS'} | ${sign(r.flat, 2)} | ${sign(r.peakPnl, 2)}u |`);
    }
    out.push('');
  }

  // §7. Decision rule
  out.push('---');
  out.push('## §7. Decision applied');
  out.push('');
  out.push('Pre-registered rule for floor lowering (calibrated to vault findings — same as `WALLET_PREDICTIVENESS_PLAYBOOK §6` LOOSEN arm):');
  out.push('');
  out.push('1. **PROMOTED bucket WR ≥ 56%** (between baseline 50% and HC ceiling 63%).');
  out.push('2. **PROMOTED bucket flat ROI ≥ +5%** (positive EV after vig).');
  out.push('3. **N ≥ 6 promoted picks** (avoid acting on rounding error).');
  out.push('4. **Combined floor flat ROI within 5pp of v7.0 baseline** (don\'t crash overall ROI).');
  out.push('5. **Holds in ≥ 2 of 3 sports** for cross-sport robustness.');
  out.push('');
  out.push('| Floor candidate | N gain | Promoted WR | Promoted Flat ROI | Combined ROI | ΔROI vs v7 | Verdict |');
  out.push('|---|---|---|---|---|---|---|');
  for (const [label, fn] of FLOORS) {
    if (label.includes('baseline')) continue;
    const v70Set = new Set(v70Lock.map(r => `${r.docId}|${r.sideKey}`));
    const promoted = all.filter(r => fn(r) && !v70Set.has(`${r.docId}|${r.sideKey}`));
    const combined = all.filter(fn);
    const sP = summarize(promoted);
    const sC = summarize(combined);
    const lift = (sC.flatRoi != null && v70Sum.flatRoi != null) ? sC.flatRoi - v70Sum.flatRoi : null;
    const sportsHeld = sports.filter(sp => {
      const sub = promoted.filter(r => r.sport === sp);
      const ss = summarize(sub);
      return ss.n >= 2 && ss.flatRoi != null && ss.flatRoi >= 0;
    }).length;
    const evaluatedSports = sports.filter(sp => promoted.some(r => r.sport === sp)).length;
    const passes = sP.n >= 6 && sP.wr >= 56 && sP.flatRoi >= 5 && (lift != null && lift >= -5) && sportsHeld >= 2;
    out.push(`| ${label} | +${sP.n} | ${pct(sP.wr)} | ${sign(sP.flatRoi, 1)}% | ${sign(sC.flatRoi, 1)}% | ${sign(lift, 1)}% | ${passes ? '**SHIP**' : 'KILL'} (${sportsHeld}/${evaluatedSports} sports) |`);
  }
  out.push('');

  out.push('---');
  out.push('## §8. Notes & caveats');
  out.push('');
  out.push('- All Δw / Δq values recomputed under L2 (point-in-time) tiers, NOT the dwFrozen stamps. This may shift some picks across Σ buckets relative to the original v7 stamping. The v7.0 baseline row in §1 / §4 reflects the L2-recomputed Σ ≥ +5 set, which is what matters for an apples-to-apples comparison.');
  out.push('- Sample window is short (~12 days). Per-sport per-gate cells are noisy; treat as directional, not definitive.');
  out.push('- Σ=+3 cell decomposes into (Δw=+1, Δq=+2) and (Δw=+2, Δq=+1). Σ=+4 decomposes into (1,3), (2,2), (3,1). The wallet-tier composition may differ across these sub-cells.');
  out.push('- HC threshold = `sizeRatio ≥ 1.5×`. HC-CONFIRMED is a strict subset of CONFIRMED.');
  out.push('- "PROMOTED" in §7 = picks newly admitted to LOCK by each candidate that v7.0 (Σ ≥ +5) would not have shipped at full units. LEAN picks (Σ=3,4) under v7 are tracked at 0u; the candidates here would ship them at full ladder units.');
  out.push('');

  const md = out.join('\n');
  const outPath = join(REPO_ROOT, 'FLOOR_LOWERING_TIER_GATES.md');
  writeFileSync(outPath, md);
  console.log(`      Wrote ${outPath}`);
  process.exit(0);
})().catch(err => {
  console.error(err);
  process.exit(1);
});
