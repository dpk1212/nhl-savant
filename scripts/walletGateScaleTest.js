/**
 * walletGateScaleTest.js — does the wallet-tier signal lift performance
 * AT EVERY Σ bucket, or is it a noise artifact in one or two cells?
 *
 * Question we are answering: if I take any Σ bucket (3, 4, 5, 6, 7+) and
 * within that bucket split picks by tier-quality gate (e.g. HC dominance,
 * net CONFIRMED ≥ +1, no FLAT contamination), does the IN-gate cohort
 * consistently beat the OUT-gate cohort? If yes, the logic generalizes
 * and we can apply it across the floor. If only some Σ buckets show
 * lift, it's likely sample-cell noise.
 *
 * For each Σ bucket × each gate:
 *   raw_n, raw_wr, raw_roi
 *   in_n, in_wr, in_roi
 *   out_n, out_wr, out_roi
 *   lift_wr = in_wr - out_wr     ("does the gate select winners?")
 *   lift_roi = in_roi - out_roi
 *   z-score and p-value on the WR difference (two-proportion z-test)
 *
 * Output:
 *   §1. Σ bucket inventory (raw cohorts, no gate)
 *   §2. Per-gate × per-Σ bucket lift table — the headline matrix
 *   §3. Pooled tests — weighted average lift, "consistent in N/5 buckets"
 *   §4. Per-sport replication of the lift matrix
 *   §5. Verdict: which gates generalize across Σ?
 *
 * Lens: point-in-time tiers (L2) — same as prior backtests.
 *
 * Output file: WALLET_GATE_SCALE_TEST.md
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

const V6_CUTOVER  = '2026-04-18';
const QUALITY_CUT = 30;
const HC_RATIO    = 1.5;
const MIN_BETS    = 2;

// v7.1 — `--monitor` runs the same gate-scale test but bounds the sample to
// the last `--monitor-days=N` days (default 7) and to v7.1-stamped picks
// (`v8_systemVersion === '7.1'`). Used for live cohort sanity-checks
// post-deploy. Pre-cutover sample is unchanged when monitor is off.
const argv = process.argv.slice(2);
const MONITOR_MODE = argv.includes('--monitor');
const MONITOR_DAYS = (() => {
  const arg = argv.find(a => a.startsWith('--monitor-days='));
  return arg ? Math.max(1, parseInt(arg.split('=')[1], 10)) : 7;
})();
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

function normCdf(z) {
  if (!Number.isFinite(z)) return 0.5;
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989422804 * Math.exp(-z * z / 2);
  let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}
// Two-proportion z-test (two-sided): H0: p_in == p_out
function twoPropZ(winsIn, nIn, winsOut, nOut) {
  if (nIn < 2 || nOut < 2) return { z: null, p: null };
  const pIn = winsIn / nIn;
  const pOut = winsOut / nOut;
  const pPool = (winsIn + winsOut) / (nIn + nOut);
  const se = Math.sqrt(pPool * (1 - pPool) * (1 / nIn + 1 / nOut));
  if (se === 0 || !Number.isFinite(se)) return { z: null, p: null };
  const z = (pIn - pOut) / se;
  const p = 2 * (1 - normCdf(Math.abs(z)));
  return { z, p };
}

// ── Build point-in-time tier timeline (mirrors prior scripts) ──────
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
    } else {
      walletKeyToFull.set(key, key);
    }
  }

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
  return { tierAsOf, walletKeyToFull };
}

// ── Per-pick aggregation ───────────────────────────────────────────
function aggregateTier(walletDetails, sideKey, sport, date, lensFn) {
  const out = {
    confFor: 0, confAg: 0, flatFor: 0, flatAg: 0,
    hcConfFor: 0, hcConfAg: 0, qFor: 0, qAg: 0,
    forW: 0, agW: 0,
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

// ── Loader ─────────────────────────────────────────────────────────
async function loadShippedPicks(lensFn) {
  const rows = [];
  // v7.1 — when --monitor is set, restrict to the trailing N-day window
  // AND v7.1-stamped picks. Ensures the cohort table reflects the new
  // system, not the pre-deploy backtest.
  let dateFloor = V6_CUTOVER;
  if (MONITOR_MODE) {
    const cut = new Date();
    cut.setDate(cut.getDate() - MONITOR_DAYS);
    const monitorFrom = cut.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
    if (monitorFrom > dateFloor) dateFloor = monitorFrom;
    console.log(`[monitor] sample bounded to date >= ${dateFloor} AND v8_systemVersion === '7.1'`);
  }
  for (const [col, market] of PICK_COLS) {
    const snap = await db.collection(col).where('date', '>=', dateFloor).get();
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
        // Monitor mode: drop anything not stamped under v7.1.
        if (MONITOR_MODE && side.v8_systemVersion !== '7.1') continue;
        const peak = side.peak || side.lock || {};
        if ((peak?.stars ?? 0) < 2.5) continue;
        const odds = peak?.peakOdds ?? side.lock?.lockOdds ?? peak?.odds ?? side.lock?.odds ?? null;
        const won = oc === 'WIN' ? 1 : 0;
        const wd = peak?.v8Scoring?.walletDetails;

        const t = aggregateTier(wd, sideKey, sport, date, lensFn);
        const dw = t.dwLegacy;
        const dq = t.dq;

        // We ONLY include picks where Δw ≥ +1 AND Δq ≥ +1 (matches the v7
        // matrix entry condition). Σ ≤ +2 still appears below if (Δw=1,Δq=1).
        if (dw < 1 || dq < 1) continue;

        const flat = odds != null ? flatProfit(odds, won === 1) : 0;

        rows.push({
          date, sport, market, sideKey, docId: doc.id,
          dw, dq, sum: dw + dq,
          ...t,
          odds, won, flat,
        });
      }
    }
  }
  return rows;
}

// ── Σ bucketing ────────────────────────────────────────────────────
function sigmaBucket(sum) {
  if (sum <= 2) return 'Σ≤2';
  if (sum === 3) return 'Σ=3';
  if (sum === 4) return 'Σ=4';
  if (sum === 5) return 'Σ=5';
  if (sum === 6) return 'Σ=6';
  return 'Σ≥7';
}
const SIGMA_ORDER = ['Σ=3', 'Σ=4', 'Σ=5', 'Σ=6', 'Σ≥7'];

// ── Aggregate metrics ──────────────────────────────────────────────
function summarize(rows) {
  if (!rows.length) return { n: 0, wins: 0, losses: 0, wr: null, flatRoi: null, flatPnl: 0 };
  const wins = rows.filter(r => r.won === 1).length;
  const losses = rows.length - wins;
  const wr = wins / rows.length * 100;
  const flatPnl = rows.reduce((s, r) => s + r.flat, 0);
  const flatRoi = (flatPnl / rows.length) * 100;
  return { n: rows.length, wins, losses, wr, flatRoi, flatPnl };
}

// ── Gates being tested ─────────────────────────────────────────────
const GATES = [
  ['G_CONF',     'CONFIRMED_for ≥ 1',                       r => r.confFor >= 1],
  ['G_NETCONF',  '(CONF_for − CONF_ag) ≥ +1',                r => (r.confFor - r.confAg) >= 1],
  ['G_NOFLAT',   'CONF_for ≥ 1 ∧ FLAT_for = 0',              r => r.confFor >= 1 && r.flatFor === 0],
  ['G_HC',       'HC_for ≥ 1 ∧ HC_ag = 0  (HC dominance)',  r => r.hcConfFor >= 1 && r.hcConfAg === 0],
  ['G_PURITY',   'HC dominance OR pure CONFIRMED',           r => (r.hcConfFor >= 1 && r.hcConfAg === 0) || (r.confFor >= 1 && r.flatFor === 0)],
  ['G_NETCONF_OR_HC', '(CONF_for−CONF_ag) ≥ +1 OR HC dominance', r => ((r.confFor - r.confAg) >= 1) || (r.hcConfFor >= 1 && r.hcConfAg === 0)],
];

(async () => {
  console.log('[1/3] Building point-in-time tier timeline…');
  const { tierAsOf, walletKeyToFull } = await buildTierTimeline();
  const lens = (walletKey, sport, date) => {
    const canonical = walletKeyToFull.get(walletKey) || walletKey;
    return tierAsOf(canonical, sport, date);
  };

  console.log('[2/3] Loading shipped picks (Δw ≥ +1, Δq ≥ +1)…');
  const all = await loadShippedPicks(lens);
  const dates = [...new Set(all.map(r => r.date))].sort();
  console.log(`      ${all.length} picks · ${dates.length} days · ${dates[0]} → ${dates[dates.length - 1]}`);

  console.log('[3/3] Computing per-Σ × per-gate lifts…');

  const out = [];
  const nowET = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
  out.push('# WALLET-GATE SCALE TEST — does the tier signal lift EVERY Σ bucket?');
  out.push('');
  out.push(`Generated: ${nowET} ET · sample ${all.length} picks · ${dates[0]} → ${dates[dates.length - 1]} (${dates.length} days)`);
  out.push('');
  out.push('**The right question.** Forget cell-level absolute WR. The question is: when we apply a wallet-tier gate INSIDE a Σ bucket, do the IN-gate picks consistently outperform the OUT-gate picks? If yes (in 4+ of 5 Σ buckets), the gate is real signal that scales across the floor. If no (mixed up/down across buckets), it\'s sample noise.');
  out.push('');
  out.push('**Lens.** Point-in-time tiers (L2, validated in `WALLET_PREDICTIVENESS_BACKTEST.md`).');
  out.push('');
  out.push('**Sample.** Every shipped side since v6 cutover with `Δw ≥ +1 ∧ Δq ≥ +1` (the v7 matrix-entry cone).');
  out.push('');

  // §1. Σ inventory
  out.push('---');
  out.push('## §1. Σ bucket inventory (raw — no gate)');
  out.push('');
  out.push('| Σ | N | W-L | WR | Flat ROI | Net flat |');
  out.push('|---|---|---|---|---|---|');
  for (const sb of SIGMA_ORDER) {
    const rows = all.filter(r => sigmaBucket(r.sum) === sb);
    const s = summarize(rows);
    out.push(`| ${sb} | ${s.n} | ${s.wins}-${s.losses} | ${pct(s.wr)} | ${sign(s.flatRoi, 1)}% | ${sign(s.flatPnl, 2)}u |`);
  }
  out.push('');

  // §2. Per-gate × per-Σ lift matrix
  out.push('---');
  out.push('## §2. Per-gate × per-Σ lift matrix');
  out.push('');
  out.push('For each (gate, Σ) cell: `IN-gate WR vs OUT-gate WR`. Lift_WR = WR_in − WR_out (positive = gate selects winners). Lift_ROI = flat ROI_in − flat ROI_out.');
  out.push('A gate that lifts in **all 5 buckets** is real signal that scales. Mixed up/down → noise.');
  out.push('');

  // For each gate, build a table
  for (const [gid, desc, fn] of GATES) {
    out.push(`### \`${gid}\` — ${desc}`);
    out.push('');
    out.push('| Σ | N total | IN-gate (n / WR / ROI) | OUT-gate (n / WR / ROI) | Lift_WR (pp) | Lift_ROI (pp) | z-test p |');
    out.push('|---|---|---|---|---|---|---|');
    let positiveBuckets = 0;
    let evaluatedBuckets = 0;
    let pooledLiftWr = 0;
    let pooledLiftRoi = 0;
    let pooledN = 0;
    for (const sb of SIGMA_ORDER) {
      const rows = all.filter(r => sigmaBucket(r.sum) === sb);
      const inRows = rows.filter(fn);
      const outRows = rows.filter(r => !fn(r));
      const sIn = summarize(inRows);
      const sOut = summarize(outRows);
      const liftWr  = (sIn.wr  != null && sOut.wr  != null) ? sIn.wr  - sOut.wr  : null;
      const liftRoi = (sIn.flatRoi != null && sOut.flatRoi != null) ? sIn.flatRoi - sOut.flatRoi : null;
      const z = twoPropZ(sIn.wins, sIn.n, sOut.wins, sOut.n);
      if (liftWr != null && sIn.n >= 2 && sOut.n >= 2) {
        evaluatedBuckets++;
        if (liftWr > 0) positiveBuckets++;
        pooledLiftWr  += liftWr * sIn.n;
        pooledLiftRoi += (liftRoi ?? 0) * sIn.n;
        pooledN += sIn.n;
      }
      const inFmt = sIn.n  ? `${sIn.n} / ${pct(sIn.wr)} / ${sign(sIn.flatRoi, 1)}%`   : 'n=0';
      const outFmt = sOut.n ? `${sOut.n} / ${pct(sOut.wr)} / ${sign(sOut.flatRoi, 1)}%` : 'n=0';
      const liftWrFmt = liftWr != null ? sign(liftWr, 1) : '—';
      const liftRoiFmt = liftRoi != null ? `${sign(liftRoi, 1)}%` : '—';
      const pFmt = z.p != null ? z.p.toFixed(3) : '—';
      out.push(`| ${sb} | ${rows.length} | ${inFmt} | ${outFmt} | ${liftWrFmt} | ${liftRoiFmt} | ${pFmt} |`);
    }
    const avgLiftWr = pooledN ? pooledLiftWr / pooledN : null;
    const avgLiftRoi = pooledN ? pooledLiftRoi / pooledN : null;
    out.push(`| **Pooled** | **${all.length}** | **lift_WR (weighted)** | | **${sign(avgLiftWr, 1)} pp** | **${sign(avgLiftRoi, 1)}%** | (positive in **${positiveBuckets}/${evaluatedBuckets}** buckets) |`);
    out.push('');
  }

  // §3. Gate-comparison summary
  out.push('---');
  out.push('## §3. Gate-comparison summary');
  out.push('');
  out.push('Which gate produces the most consistent and largest lift across Σ buckets?');
  out.push('');
  out.push('| Gate | Buckets w/ positive lift | Avg lift_WR (pp) | Avg lift_ROI (pp) | Verdict |');
  out.push('|---|---|---|---|---|');
  for (const [gid, desc, fn] of GATES) {
    let positiveBuckets = 0;
    let evaluatedBuckets = 0;
    let pooledLiftWr = 0;
    let pooledLiftRoi = 0;
    let pooledN = 0;
    for (const sb of SIGMA_ORDER) {
      const rows = all.filter(r => sigmaBucket(r.sum) === sb);
      const inRows = rows.filter(fn);
      const outRows = rows.filter(r => !fn(r));
      const sIn = summarize(inRows);
      const sOut = summarize(outRows);
      if (sIn.n >= 2 && sOut.n >= 2) {
        evaluatedBuckets++;
        if (sIn.wr > sOut.wr) positiveBuckets++;
        pooledLiftWr  += (sIn.wr - sOut.wr) * sIn.n;
        pooledLiftRoi += (sIn.flatRoi - sOut.flatRoi) * sIn.n;
        pooledN += sIn.n;
      }
    }
    const avgLiftWr = pooledN ? pooledLiftWr / pooledN : null;
    const avgLiftRoi = pooledN ? pooledLiftRoi / pooledN : null;
    let verdict;
    if (positiveBuckets === evaluatedBuckets && avgLiftWr >= 5) verdict = '**SCALES — strong**';
    else if (positiveBuckets >= evaluatedBuckets - 1 && avgLiftWr >= 3) verdict = '**SCALES — moderate**';
    else if (positiveBuckets >= Math.ceil(evaluatedBuckets * 0.6) && avgLiftWr > 0) verdict = 'mixed — partial scale';
    else verdict = '**NOISE — does not scale**';
    out.push(`| \`${gid}\` | ${positiveBuckets}/${evaluatedBuckets} | ${sign(avgLiftWr, 1)} pp | ${sign(avgLiftRoi, 1)}% | ${verdict} |`);
  }
  out.push('');

  // §4. Per-sport replication for the strongest gate
  out.push('---');
  out.push('## §4. Per-sport replication — does the best gate scale ACROSS sports too?');
  out.push('');
  out.push('Picking the gate with the most positive buckets in §3 and replicating per sport. If a gate truly scales, it should lift in every sport AND every Σ.');
  out.push('');
  const sports = [...new Set(all.map(r => r.sport))].sort();
  for (const [gid, desc, fn] of GATES) {
    out.push(`### \`${gid}\` — ${desc}`);
    out.push('');
    out.push('| Sport | Σ | N | IN n/WR/ROI | OUT n/WR/ROI | Lift_WR | Lift_ROI |');
    out.push('|---|---|---|---|---|---|---|');
    for (const sport of sports) {
      for (const sb of SIGMA_ORDER) {
        const rows = all.filter(r => r.sport === sport && sigmaBucket(r.sum) === sb);
        if (rows.length === 0) continue;
        const inRows = rows.filter(fn);
        const outRows = rows.filter(r => !fn(r));
        const sIn = summarize(inRows);
        const sOut = summarize(outRows);
        const inFmt = sIn.n  ? `${sIn.n}/${pct(sIn.wr)}/${sign(sIn.flatRoi, 0)}%`   : 'n=0';
        const outFmt = sOut.n ? `${sOut.n}/${pct(sOut.wr)}/${sign(sOut.flatRoi, 0)}%` : 'n=0';
        const liftWr = (sIn.wr != null && sOut.wr != null) ? sign(sIn.wr - sOut.wr, 1) : '—';
        const liftRoi = (sIn.flatRoi != null && sOut.flatRoi != null) ? sign(sIn.flatRoi - sOut.flatRoi, 1) + '%' : '—';
        out.push(`| ${sport} | ${sb} | ${rows.length} | ${inFmt} | ${outFmt} | ${liftWr} | ${liftRoi} |`);
      }
    }
    out.push('');
  }

  // §5. Verdict
  out.push('---');
  out.push('## §5. Decision');
  out.push('');
  out.push('**A gate scales** if it produces a positive WR lift in 4+/5 Σ buckets AND the pooled lift is ≥ +3pp WR. Below that bar, treat as cell-level noise — do not deploy.');
  out.push('');
  out.push('See §3 verdict column for the call. Take only gates labelled "SCALES" forward to v7.1 sizing/lock-rule changes.');
  out.push('');

  out.push('---');
  out.push('## §6. Caveats');
  out.push('');
  out.push('- Sample is short (13 days). Per-Σ-bucket Ns are small; per-(Σ, sport) cells are tiny. The matrix is most reliable when patterns are **directionally consistent** rather than statistically significant in each cell.');
  out.push('- Gates we test are not orthogonal — `G_PURITY` ⊃ `G_NOFLAT`, `G_NETCONF_OR_HC` ⊃ `G_NETCONF`, etc. The "best" gate is the simplest one that scales.');
  out.push('- If a gate "scales" but the pooled lift is small (<+3pp WR), it is real but weak signal — treat as a sizing tilt, not a binary lock filter.');
  out.push('');

  const md = out.join('\n');
  const outName = MONITOR_MODE ? 'WALLET_GATE_SCALE_TEST_MONITOR.md' : 'WALLET_GATE_SCALE_TEST.md';
  const outPath = join(REPO_ROOT, outName);
  writeFileSync(outPath, md);
  console.log(`      Wrote ${outPath}${MONITOR_MODE ? `  (monitor: trailing ${MONITOR_DAYS}d, v7.1-only)` : ''}`);
  process.exit(0);
})().catch(err => {
  console.error(err);
  process.exit(1);
});
