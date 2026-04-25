/**
 * dailyV6Report.js — Sharp Intel v6 master daily report.
 *
 * One-stop consolidated report of every v6-era metric:
 *
 *   §1. Sample summary
 *   §2. Daily PnL by lock-floor cohort (Δw × Δq buckets)
 *   §3. v8 Vault-Star bucket performance — the "hidden field"
 *       (5★ / 4.5★ are the elite tier we lock at peak units)
 *   §4. Sharp Vault hidden-star performance from sharp_action_positions.v8_stars
 *   §5. Full (Δw × Δq) win matrix + cohort cross-tabs
 *   §6. Wallet roster growth (per-sport snapshot + daily cumulative)
 *   §7. Wallet winners descriptives (cohort summary, quartiles, archetypes)
 *
 * Single Firestore pass: loads sharpWalletProfiles + every graded side
 * from sharpFlow{Picks,Spreads,Totals} once, then computes everything
 * in memory. Replaces the need to chain winMatrix / walletGrowthReport /
 * walletWinnersDescriptives / sharpVaultV8Analysis as separate jobs.
 *
 * Mirrors the live SharpFlow.jsx engine:
 *   - WHITELIST_CONSENSUS_VERSION = 6
 *   - QUALITY_CONTRIB_CUT         = 30
 *   - vaultStarFromDeltas         (identical formula)
 *
 * v8_vaultStar is recomputed against the LIVE sharpWalletProfiles
 * snapshot for every graded side — same approach as winMatrix.js — so
 * yesterday's grades reflect today's whitelist (eliminates drift from
 * tier promotions/demotions that happened after the pick locked).
 *
 * Output: DAILY_V6_REPORT.md
 *
 * Usage:  node scripts/dailyV6Report.js
 *         node scripts/dailyV6Report.js --min-bets=3   (default 2)
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

// ── Config ──────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const MIN_BETS_ARG = argv.find(a => a.startsWith('--min-bets='));
const MIN_BETS = MIN_BETS_ARG ? parseInt(MIN_BETS_ARG.split('=')[1], 10) : 2;

const V6_CUTOVER  = '2026-04-18'; // first day with v8Scoring.walletDetails
const QUALITY_CUT = 30;
const WHITELIST_TIERS = new Set(['CONFIRMED', 'FLAT']);
const PICK_COLS = [
  ['sharpFlowPicks',   'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals',  'TOTAL'],
];
const VAULT_COLLECTION = 'sharp_action_positions';
const OPPOSITE = { home: 'away', away: 'home', over: 'under', under: 'over' };

const DW_BUCKETS = [-3, -2, -1, 0, 1, 2, 3];
const DQ_BUCKETS = [-3, -2, -1, 0, 1, 2, 3];
const MIN_N_FOR_ROI = 3;

const STAR_BUCKETS = [
  { label: '5.0★ (ELITE)',     min: 5.0, max: 5.0 },
  { label: '4.5★',             min: 4.5, max: 4.5 },
  { label: '4.0★',             min: 4.0, max: 4.0 },
  { label: '3.5★ (LOCK FLR)',  min: 3.5, max: 3.5 },
  { label: '3.0★',             min: 3.0, max: 3.0 },
  { label: '2.5★',             min: 2.5, max: 2.5 },
  { label: '≤2.0★ (DEEP MUTE)', min: 1.0, max: 2.0 },
];

// ── Tiny helpers ────────────────────────────────────────────────────────────
const americanToDecimal = (o) => (o > 0 ? 1 + o / 100 : 1 + 100 / Math.abs(o));
const flatProfit = (odds, won) => {
  if (odds == null) return won ? 0.91 : -1;
  return won ? americanToDecimal(odds) - 1 : -1;
};
const sign = (v, d = 1) => (v == null || Number.isNaN(v) ? '—' : (v >= 0 ? '+' : '') + v.toFixed(d));
const fmtPct = (v, d = 1) => (v == null || Number.isNaN(v) ? '—' : `${v.toFixed(d)}%`);
const fmtSignPct = (v, d = 1) => (v == null || Number.isNaN(v) ? '—' : `${sign(v, d)}%`);
const fmtMoneyShort = (v) => {
  if (v == null || Number.isNaN(v)) return '—';
  const abs = Math.abs(v);
  if (abs >= 1_000_000) return `${v < 0 ? '-' : ''}$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000)     return `${v < 0 ? '-' : ''}$${(abs / 1_000).toFixed(1)}K`;
  return `${v < 0 ? '-' : ''}$${abs.toFixed(0)}`;
};
const mdHeader = (cols) => `| ${cols.join(' | ')} |\n|${cols.map(() => '---').join('|')}|`;

function quantile(sorted, q) {
  if (!sorted.length) return null;
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  return sorted[base + 1] != null ? sorted[base] + rest * (sorted[base + 1] - sorted[base]) : sorted[base];
}
function distrib(vals) {
  const s = [...vals].filter(v => v != null && !Number.isNaN(v)).sort((a, b) => a - b);
  if (!s.length) return { min: null, q25: null, median: null, q75: null, max: null, mean: null };
  const mean = s.reduce((a, b) => a + b, 0) / s.length;
  return { min: s[0], q25: quantile(s, 0.25), median: quantile(s, 0.5), q75: quantile(s, 0.75), max: s[s.length - 1], mean };
}
function dayDiff(d1, d2) {
  const a = new Date(d1 + 'T00:00:00Z').getTime();
  const b = new Date(d2 + 'T00:00:00Z').getTime();
  return Math.round((b - a) / 86400000);
}

// ── v6 Two-Factor Vault Star (mirror SharpFlow.jsx) ────────────────────────
function vaultStarFromDeltas(dw, dq) {
  if (dw >= 3 || (dw >= 2 && dq >= 1)) return 5.0;
  let base;
  if (dw <= -2)      base = 1.0;
  else if (dw === -1) base = 1.5;
  else if (dw === 0)  base = 2.5;
  else if (dw === 1)  base = 3.5;
  else                base = 4.5; // dw === 2 but dq < 1
  let adj = 0;
  if (dq <= -2)      adj = -1.0;
  else if (dq <= 0)  adj = -0.5;
  else if (dq >= 3)  adj = 0.5;
  return Math.max(1.0, Math.min(5.0, base + adj));
}

// Recompute Δw / Δq for one side against the LIVE sharpWalletProfiles
// snapshot. Mirrors winMatrix.js / SharpFlow.jsx::computeWalletConsensus.
function computeDeltas(walletDetails, sideKey, sport, profiles) {
  if (!Array.isArray(walletDetails) || !sideKey) {
    return { dw: 0, dq: 0, forW: 0, agW: 0, qFor: 0, qAg: 0, hadDetails: false };
  }
  const forSet = new Set();
  const agSet  = new Set();
  for (const d of walletDetails) {
    if (!d?.wallet || !d?.side) continue;
    const shortId = String(d.wallet).slice(-6);
    const tier = profiles.get(shortId)?.bySport?.[sport]?.whitelistTier;
    if (!WHITELIST_TIERS.has(tier)) continue;
    if (d.side === sideKey) forSet.add(shortId);
    else                    agSet.add(shortId);
  }
  let qFor = 0, qAg = 0;
  for (const d of walletDetails) {
    if ((d?.contribution ?? 0) < QUALITY_CUT) continue;
    if (d.side === sideKey) qFor++;
    else if (d.side)        qAg++;
  }
  return {
    forW: forSet.size, agW: agSet.size, dw: forSet.size - agSet.size,
    qFor, qAg, dq: qFor - qAg,
    hadDetails: walletDetails.length > 0,
  };
}

function clampDelta(v, lo, hi) { return v <= lo ? lo : (v >= hi ? hi : v); }
function cellKey(dw, dq) {
  const cw = clampDelta(dw, DW_BUCKETS[0], DW_BUCKETS[DW_BUCKETS.length - 1]);
  const cq = clampDelta(dq, DQ_BUCKETS[0], DQ_BUCKETS[DQ_BUCKETS.length - 1]);
  return `${cw >= 0 ? '+' : ''}${cw},${cq >= 0 ? '+' : ''}${cq}`;
}

// ── Main load ──────────────────────────────────────────────────────────────
//
// Returns:
//   profiles   Map<shortId, profile>
//   pickRows   array of one-row-per-graded-side records:
//                { date, sport, market, sideKey, dw, dq, vaultStar,
//                  outcome ('WIN'|'LOSS'|'PUSH'), flatPnl, odds }
//   walletBets array of one-row-per-(wallet × graded-game):
//                { date, sport, market, wallet, invested, won, flat,
//                  dollarPnl }
//   meta       { totalSidesScanned, gradedSidesUsable, dateMin, dateMax,
//                ungraded, missingDeltas }
async function loadEverything() {
  const profSnap = await db.collection('sharpWalletProfiles').get();
  const profiles = new Map();
  for (const d of profSnap.docs) profiles.set(d.id, d.data());

  const pickRows   = [];
  const walletBets = [];
  let totalSidesScanned = 0;
  let gradedSidesUsable = 0;
  let dateMin = null, dateMax = null;

  for (const [col, market] of PICK_COLS) {
    const snap = await db.collection(col).where('date', '>=', V6_CUTOVER).get();
    for (const doc of snap.docs) {
      const d = doc.data();
      const sides = d.sides || {};
      const sport = d.sport || 'UNK';
      const date  = d.date;

      // Identify the winning side once per game (so we can credit
      // wallet bets that landed on either side).
      let winningSide = null;
      for (const sk of Object.keys(sides)) {
        const oc = sides[sk]?.result?.outcome;
        if (oc === 'WIN')  { winningSide = sk; break; }
        if (oc === 'LOSS' && OPPOSITE[sk]) { winningSide = OPPOSITE[sk]; break; }
      }

      // Per-side rows for matrix / vault-star analysis.
      for (const [sideKey, side] of Object.entries(sides)) {
        totalSidesScanned += 1;
        if (side.superseded) continue;
        const oc = side?.result?.outcome;
        if (oc !== 'WIN' && oc !== 'LOSS' && oc !== 'PUSH') continue;
        const peak = side.peak || side.lock || {};
        const wd = peak?.v8Scoring?.walletDetails || [];
        if (!wd.length) continue;
        const { dw, dq, hadDetails } = computeDeltas(wd, sideKey, sport, profiles);
        if (!hadDetails) continue;

        const odds = side?.lock?.lockOdds ?? side?.peak?.peakOdds
                  ?? side?.lock?.odds     ?? side?.peak?.odds ?? null;
        const won = oc === 'WIN';
        const flat = oc === 'PUSH' ? 0 : flatProfit(odds, won);
        const vaultStar = vaultStarFromDeltas(dw, dq);

        gradedSidesUsable += 1;
        if (date) {
          if (!dateMin || date < dateMin) dateMin = date;
          if (!dateMax || date > dateMax) dateMax = date;
        }

        pickRows.push({
          date, sport, market, sideKey,
          dw, dq, vaultStar,
          outcome: oc, flatPnl: flat, odds,
        });
      }

      // Per-wallet rows for roster / descriptives. Only games with a
      // resolved winning side contribute — pushes are skipped because
      // there's no "won/lost" on this dimension.
      if (winningSide) {
        const seen = new Set();
        for (const [sideKey, side] of Object.entries(sides)) {
          const peak = side.peak || side.lock;
          const wd = peak?.v8Scoring?.walletDetails;
          if (!Array.isArray(wd)) continue;
          for (const w of wd) {
            if (!w.wallet || !w.side) continue;
            const dedupe = `${doc.id}_${w.wallet}`;
            if (seen.has(dedupe)) continue;
            seen.add(dedupe);
            const betSide = sides[w.side];
            const betOdds = betSide?.peak?.odds ?? betSide?.lock?.odds ?? peak.odds ?? 0;
            const won = w.side === winningSide ? 1 : 0;
            const flat = flatProfit(betOdds, won === 1);
            const invested = Number(w.invested ?? 0);
            walletBets.push({
              gameKey: doc.id, date, sport, market,
              wallet: w.wallet, invested,
              won, flat, dollarPnl: invested * flat,
            });
          }
        }
      }
    }
  }

  return {
    profiles, pickRows, walletBets,
    meta: { totalSidesScanned, gradedSidesUsable, dateMin, dateMax },
  };
}

// ── Cohort definitions (lock-floor framing) ────────────────────────────────
const COHORTS = [
  { id: 'super_top',  label: 'SUPER TOP (Δw≥+2 ∧ Δq≥+2)',          f: (dw, dq) => dw >= 2 && dq >= 2 },
  { id: 'top',        label: 'TOP (Δw≥+2 ∧ Δq≤+1)',                f: (dw, dq) => dw >= 2 && dq <= 1 },
  { id: 'floor_b',    label: 'FLOOR-B (Δw=+1 ∧ Δq≥+2)',            f: (dw, dq) => dw === 1 && dq >= 2 },
  { id: 'floor_a',    label: 'FLOOR-A (Δw=+1 ∧ Δq=+1)',            f: (dw, dq) => dw === 1 && dq === 1 },
  { id: 'sub_floor',  label: 'SUB-FLOOR (Δw=+1 ∧ Δq≤0)',           f: (dw, dq) => dw === 1 && dq <= 0 },
  { id: 'mute_zero',  label: 'MUTE Δw=0  (winners flat)',          f: (dw)     => dw === 0 },
  { id: 'mute_neg',   label: 'MUTE Δw≤−1 (winners fading/killed)', f: (dw)     => dw <= -1 },
];
const LOCK_COHORT_IDS = new Set(['super_top', 'top', 'floor_b', 'floor_a']); // what we'd actually lock

function emptyAgg() { return { n: 0, w: 0, l: 0, p: 0, pnl: 0 }; }
function pushAgg(a, row) {
  a.n  += 1;
  a.pnl += (row.flatPnl || 0);
  if (row.outcome === 'WIN')  a.w += 1;
  else if (row.outcome === 'LOSS') a.l += 1;
  else if (row.outcome === 'PUSH') a.p += 1;
}
function finalizeAgg(a) {
  const wlTotal = a.w + a.l;
  const wr = wlTotal === 0 ? null : (a.w / wlTotal) * 100;
  const roi = a.n === 0 ? null : (a.pnl / a.n) * 100;
  return { ...a, wr, roi };
}

async function loadSharpVaultRows() {
  const snap = await db.collection(VAULT_COLLECTION)
    .where('status', '==', 'GRADED')
    .get();

  const rows = [];
  for (const doc of snap.docs) {
    const d = doc.data();
    if (!d.date || d.date < V6_CUTOVER) continue;
    // Match SHARP_VAULT_V8_REPORT: vaultQualified=false is shadow-only and
    // should not be included in the Sharp Vault win-rate audit.
    if (d.vaultQualified === false) continue;
    if (d.result !== 'WIN' && d.result !== 'LOSS') continue;
    const invested = Number(d.size ?? d.invested ?? 0);
    const settledPnl = Number(d.settledPnl ?? 0);
    if (invested <= 0) continue;
    const hiddenStars = Number(d.v8_stars ?? NaN);
    if (Number.isNaN(hiddenStars)) continue;

    rows.push({
      date: d.date,
      sport: d.sport || 'UNK',
      market: d.marketType || 'UNK',
      hiddenStars,
      outcome: d.result,
      won: d.result === 'WIN',
      invested,
      settledPnl,
      dollarRoi: invested > 0 ? (settledPnl / invested) * 100 : null,
    });
  }
  rows.sort((a, b) => a.date.localeCompare(b.date));
  return rows;
}

function emptyVaultAgg() { return { n: 0, w: 0, l: 0, invested: 0, pnl: 0 }; }
function pushVaultAgg(a, row) {
  a.n += 1;
  if (row.outcome === 'WIN') a.w += 1;
  else if (row.outcome === 'LOSS') a.l += 1;
  a.invested += row.invested || 0;
  a.pnl += row.settledPnl || 0;
}
function finalizeVaultAgg(a) {
  return {
    ...a,
    wr: a.n ? (a.w / a.n) * 100 : null,
    dollarRoi: a.invested > 0 ? (a.pnl / a.invested) * 100 : null,
  };
}
function vaultStarBand(row) {
  if (row.hiddenStars >= 5.0) return '5★';
  if (row.hiddenStars >= 4.0) return '4★';
  if (row.hiddenStars >= 3.0) return '3★';
  if (row.hiddenStars >= 2.0) return '2★';
  return '<2★';
}

// ── Main ────────────────────────────────────────────────────────────────────
(async () => {
  console.log('Loading sharpWalletProfiles + every graded v6-era pick…');
  const { profiles, pickRows, walletBets, meta } = await loadEverything();
  console.log('Loading Sharp Vault hidden-star positions…');
  const vaultRows = await loadSharpVaultRows();
  const allDates  = [...new Set(pickRows.map(r => r.date))].sort();
  const sports    = [...new Set(pickRows.map(r => r.sport))].sort();
  const markets   = [...new Set(pickRows.map(r => r.market))].sort();
  const vaultSports = [...new Set(vaultRows.map(r => r.sport))].sort();
  console.log(`  ${profiles.size} wallet profiles · ${meta.gradedSidesUsable} graded sides usable (of ${meta.totalSidesScanned} scanned) · ${walletBets.length} wallet-bets · ${allDates.length} graded dates · ${vaultRows.length} Sharp Vault hidden-star positions`);

  const nowET = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
  const out = [];
  out.push('# Sharp Intel v6 — Daily Master Report');
  out.push('');
  out.push(`_Auto-generated **${nowET} ET** by \`scripts/dailyV6Report.js\`. Do not edit by hand._`);
  out.push('');
  out.push(`v6 cutover: **${V6_CUTOVER}** · whitelist source: live \`sharpWalletProfiles\` (${profiles.size} profiles, tiers \`CONFIRMED\` + \`FLAT\`) · quality cut: contribution ≥ ${QUALITY_CUT}.`);
  out.push('');

  // ═══════════════════════════════════════════════════════════════════════════
  // §1. SAMPLE SUMMARY
  // ═══════════════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §1. Sample summary');
  out.push('');
  out.push(mdHeader(['Metric', 'Value']));
  out.push(`| Graded sides scanned | ${meta.totalSidesScanned} |`);
  out.push(`| Graded sides w/ walletDetails | **${meta.gradedSidesUsable}** |`);
  out.push(`| Wallet-bets observed | ${walletBets.length} |`);
  out.push(`| Sharp Vault hidden-star positions | ${vaultRows.length} |`);
  out.push(`| Unique wallets observed | ${new Set(walletBets.map(b => b.wallet)).size} |`);
  out.push(`| Graded date range | ${meta.dateMin || '—'} … ${meta.dateMax || '—'} |`);
  out.push(`| Sports represented | ${sports.join(', ') || '—'} |`);
  out.push(`| Markets represented | ${markets.join(', ') || '—'} |`);
  out.push('');

  // Top-line: total v6 PnL across the whole sample, broken by lock-eligible
  // vs everything else — i.e. "if we'd actually played the system".
  const lockable = pickRows.filter(r => COHORTS.find(c => LOCK_COHORT_IDS.has(c.id) && c.f(r.dw, r.dq)));
  const lockAgg = finalizeAgg(lockable.reduce((a, r) => { pushAgg(a, r); return a; }, emptyAgg()));
  const allAgg  = finalizeAgg(pickRows.reduce((a, r) => { pushAgg(a, r); return a; }, emptyAgg()));
  out.push(mdHeader(['Cohort', 'N', 'W-L-P', 'WR%', 'flat ROI', 'flat P/L (u)']));
  out.push(`| **All graded sides** | ${allAgg.n} | ${allAgg.w}-${allAgg.l}-${allAgg.p} | ${fmtPct(allAgg.wr)} | ${fmtSignPct(allAgg.roi)} | ${sign(allAgg.pnl, 2)} |`);
  out.push(`| **Lock-eligible (Δw≥+1 ∧ Δq≥+1) — what v6 plays** | ${lockAgg.n} | ${lockAgg.w}-${lockAgg.l}-${lockAgg.p} | ${fmtPct(lockAgg.wr)} | ${fmtSignPct(lockAgg.roi)} | ${sign(lockAgg.pnl, 2)} |`);
  out.push('');

  // ═══════════════════════════════════════════════════════════════════════════
  // §2. DAILY PnL BY (Δw × Δq) COHORT
  // ═══════════════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §2. Daily PnL by (Δw × Δq) lock-floor cohort');
  out.push('');
  out.push('Each graded date split by its picks\' lock-floor cohort. **LOCK** column = picks that the v6 engine would have actually locked (super top + top + floor-A + floor-B). Cumulative running total is on the rightmost column.');
  out.push('');
  out.push(mdHeader([
    'Date',
    'TOTAL N · WR · PnL',
    'LOCK (Δw≥+1 ∧ Δq≥+1)',
    'SUPER TOP',
    'TOP',
    'FLOOR-A (1,1)',
    'FLOOR-B (1,≥2)',
    'SUB-FLOOR',
    'MUTE Δw=0',
    'MUTE Δw≤−1',
    'Cum LOCK PnL',
  ]));
  let cumLockPnl = 0;
  for (const date of allDates) {
    const day = pickRows.filter(r => r.date === date);
    const totalAgg = finalizeAgg(day.reduce((a, r) => { pushAgg(a, r); return a; }, emptyAgg()));
    const cohortAggs = {};
    for (const co of COHORTS) {
      const slice = day.filter(r => co.f(r.dw, r.dq));
      cohortAggs[co.id] = finalizeAgg(slice.reduce((a, r) => { pushAgg(a, r); return a; }, emptyAgg()));
    }
    const lockSlice = day.filter(r => LOCK_COHORT_IDS.has((COHORTS.find(c => c.f(r.dw, r.dq)) || {}).id));
    const lockAggDay = finalizeAgg(lockSlice.reduce((a, r) => { pushAgg(a, r); return a; }, emptyAgg()));
    cumLockPnl += (lockAggDay.pnl || 0);

    const cell = (a) => a.n === 0 ? '—' : `${a.n} · ${fmtPct(a.wr, 0)} · ${sign(a.pnl, 2)}u`;
    out.push(`| ${date} | ${cell(totalAgg)} | **${cell(lockAggDay)}** | ${cell(cohortAggs.super_top)} | ${cell(cohortAggs.top)} | ${cell(cohortAggs.floor_a)} | ${cell(cohortAggs.floor_b)} | ${cell(cohortAggs.sub_floor)} | ${cell(cohortAggs.mute_zero)} | ${cell(cohortAggs.mute_neg)} | ${sign(cumLockPnl, 2)}u |`);
  }
  out.push('');
  out.push('### Cohort cumulative roll-up');
  out.push('');
  out.push(mdHeader(['Cohort', 'N', 'W-L-P', 'WR%', 'flat ROI%', 'flat P/L (u)']));
  for (const co of COHORTS) {
    const slice = pickRows.filter(r => co.f(r.dw, r.dq));
    const a = finalizeAgg(slice.reduce((acc, r) => { pushAgg(acc, r); return acc; }, emptyAgg()));
    if (a.n === 0) { out.push(`| ${co.label} | 0 | — | — | — | — |`); continue; }
    const isLock = LOCK_COHORT_IDS.has(co.id) ? '**' : '';
    out.push(`| ${isLock}${co.label}${isLock} | ${a.n} | ${a.w}-${a.l}-${a.p} | ${fmtPct(a.wr)} | ${fmtSignPct(a.roi)} | ${sign(a.pnl, 2)} |`);
  }
  out.push('');

  // ═══════════════════════════════════════════════════════════════════════════
  // §3. v8 VAULT-STAR BUCKET PERFORMANCE — the "hidden field"
  // ═══════════════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §3. v8 Vault-Star bucket performance (the hidden `v8_vaultStar` field)');
  out.push('');
  out.push('Every graded side bucketed by its `v8_vaultStar` value (recomputed from `vaultStarFromDeltas(Δw, Δq)` against the LIVE whitelist). 5★ and 4.5★ are the elite cohort the engine sizes to peak units — this section tells you whether they\'re actually earning that spot.');
  out.push('');
  out.push(mdHeader([
    'Vault-Star bucket', 'N', 'W-L-P', 'WR%', 'flat ROI%', 'flat P/L (u)', 'Avg odds',
  ]));
  for (const b of STAR_BUCKETS) {
    const slice = pickRows.filter(r => r.vaultStar >= b.min && r.vaultStar <= b.max);
    const a = finalizeAgg(slice.reduce((acc, r) => { pushAgg(acc, r); return acc; }, emptyAgg()));
    if (a.n === 0) { out.push(`| ${b.label} | 0 | — | — | — | — | — |`); continue; }
    const oddsSlice = slice.map(r => r.odds).filter(v => v != null);
    const avgOdds = oddsSlice.length ? (oddsSlice.reduce((s, v) => s + v, 0) / oddsSlice.length) : null;
    out.push(`| ${b.label} | ${a.n} | ${a.w}-${a.l}-${a.p} | ${fmtPct(a.wr)} | ${fmtSignPct(a.roi)} | ${sign(a.pnl, 2)} | ${avgOdds == null ? '—' : sign(avgOdds, 0)} |`);
  }
  out.push('');

  // Per-sport vault-star table for the elite buckets only — answers
  // "are 5★ NHL picks earning their stars vs MLB vs NBA?"
  out.push('### Elite (≥4.5★) by sport');
  out.push('');
  out.push(mdHeader(['Sport', 'N', 'W-L-P', 'WR%', 'flat ROI%', 'flat P/L (u)']));
  for (const sport of sports) {
    const slice = pickRows.filter(r => r.sport === sport && r.vaultStar >= 4.5);
    const a = finalizeAgg(slice.reduce((acc, r) => { pushAgg(acc, r); return acc; }, emptyAgg()));
    if (a.n === 0) { out.push(`| ${sport.toUpperCase()} | 0 | — | — | — | — |`); continue; }
    out.push(`| ${sport.toUpperCase()} | ${a.n} | ${a.w}-${a.l}-${a.p} | ${fmtPct(a.wr)} | ${fmtSignPct(a.roi)} | ${sign(a.pnl, 2)} |`);
  }
  out.push('');

  // Daily vault-star band timeline — quick visual on whether the elite
  // buckets are carrying or dragging on any given day.
  out.push('### Daily Vault-Star PnL band');
  out.push('');
  out.push('Per-day flat PnL split into three bands — `5★` (peak units), `4.5–4.0★` (heavy units), `≤3.5★` (sub-elite). Use this to spot days where the elite tier dominated vs days where the floor tier carried.');
  out.push('');
  out.push(mdHeader(['Date', '5★ N · PnL', '4.5–4.0★ N · PnL', '≤3.5★ N · PnL', 'TOTAL PnL']));
  for (const date of allDates) {
    const day = pickRows.filter(r => r.date === date);
    const tier1 = day.filter(r => r.vaultStar >= 5.0);
    const tier2 = day.filter(r => r.vaultStar >= 4.0 && r.vaultStar < 5.0);
    const tier3 = day.filter(r => r.vaultStar < 4.0);
    const a1 = finalizeAgg(tier1.reduce((a, r) => { pushAgg(a, r); return a; }, emptyAgg()));
    const a2 = finalizeAgg(tier2.reduce((a, r) => { pushAgg(a, r); return a; }, emptyAgg()));
    const a3 = finalizeAgg(tier3.reduce((a, r) => { pushAgg(a, r); return a; }, emptyAgg()));
    const tot = (a1.pnl || 0) + (a2.pnl || 0) + (a3.pnl || 0);
    const cell = (a) => a.n === 0 ? '—' : `${a.n} · ${sign(a.pnl, 2)}u`;
    out.push(`| ${date} | ${cell(a1)} | ${cell(a2)} | ${cell(a3)} | ${sign(tot, 2)}u |`);
  }
  out.push('');

  // ═══════════════════════════════════════════════════════════════════════════
  // §4. SHARP VAULT HIDDEN-STAR PERFORMANCE
  // ═══════════════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §4. Sharp Vault hidden-star performance (`sharp_action_positions.v8_stars`)');
  out.push('');
  out.push('This is the Sharp Vault-only check from the hidden `v8_stars` field on individual `sharp_action_positions`. It excludes `vaultQualified=false` shadow rows and includes only graded WIN/LOSS positions since the v6 cutover.');
  out.push('');
  out.push('### §4a. Hidden-star win rates');
  out.push('');
  out.push(mdHeader(['Hidden star band', 'N', 'W-L', 'WR%', 'Total invested', 'Total PnL', '$ ROI']));
  const vaultBands = ['5★', '4★', '3★', '2★', '<2★'];
  for (const band of vaultBands) {
    const slice = vaultRows.filter(r => vaultStarBand(r) === band);
    const a = finalizeVaultAgg(slice.reduce((acc, r) => { pushVaultAgg(acc, r); return acc; }, emptyVaultAgg()));
    if (!a.n) { out.push(`| ${band} | 0 | — | — | — | — | — |`); continue; }
    out.push(`| ${band} | ${a.n} | ${a.w}-${a.l} | ${fmtPct(a.wr)} | ${fmtMoneyShort(a.invested)} | ${fmtMoneyShort(a.pnl)} | ${fmtSignPct(a.dollarRoi)} |`);
  }
  const vaultElite = finalizeVaultAgg(vaultRows.filter(r => r.hiddenStars >= 4.0).reduce((acc, r) => { pushVaultAgg(acc, r); return acc; }, emptyVaultAgg()));
  const vaultNonElite = finalizeVaultAgg(vaultRows.filter(r => r.hiddenStars < 4.0).reduce((acc, r) => { pushVaultAgg(acc, r); return acc; }, emptyVaultAgg()));
  out.push(`| **4★+ combined** | **${vaultElite.n}** | **${vaultElite.w}-${vaultElite.l}** | **${fmtPct(vaultElite.wr)}** | **${fmtMoneyShort(vaultElite.invested)}** | **${fmtMoneyShort(vaultElite.pnl)}** | **${fmtSignPct(vaultElite.dollarRoi)}** |`);
  out.push(`| **<4★ combined** | **${vaultNonElite.n}** | **${vaultNonElite.w}-${vaultNonElite.l}** | **${fmtPct(vaultNonElite.wr)}** | **${fmtMoneyShort(vaultNonElite.invested)}** | **${fmtMoneyShort(vaultNonElite.pnl)}** | **${fmtSignPct(vaultNonElite.dollarRoi)}** |`);
  out.push('');

  out.push('### §4b. 5★ / 4★ hidden-star performance by sport');
  out.push('');
  out.push(mdHeader(['Sport', '5★ N · WR · $ROI · PnL', '4★ N · WR · $ROI · PnL', '4★+ combined']));
  const vaultCell = (rows) => {
    const a = finalizeVaultAgg(rows.reduce((acc, r) => { pushVaultAgg(acc, r); return acc; }, emptyVaultAgg()));
    if (!a.n) return '—';
    return `${a.n} · ${fmtPct(a.wr, 0)} · ${fmtSignPct(a.dollarRoi, 0)} · ${fmtMoneyShort(a.pnl)}`;
  };
  for (const sport of vaultSports) {
    const bySport = vaultRows.filter(r => r.sport === sport);
    out.push(`| ${sport.toUpperCase()} | ${vaultCell(bySport.filter(r => vaultStarBand(r) === '5★'))} | ${vaultCell(bySport.filter(r => vaultStarBand(r) === '4★'))} | **${vaultCell(bySport.filter(r => r.hiddenStars >= 4.0))}** |`);
  }
  out.push('');

  out.push('### §4c. Daily 4★+ Sharp Vault timeline');
  out.push('');
  out.push(mdHeader(['Date', '4★+ N', 'W-L', 'WR%', '$ ROI', 'PnL']));
  for (const date of [...new Set(vaultRows.map(r => r.date))].sort()) {
    const slice = vaultRows.filter(r => r.date === date && r.hiddenStars >= 4.0);
    const a = finalizeVaultAgg(slice.reduce((acc, r) => { pushVaultAgg(acc, r); return acc; }, emptyVaultAgg()));
    if (!a.n) continue;
    out.push(`| ${date} | ${a.n} | ${a.w}-${a.l} | ${fmtPct(a.wr)} | ${fmtSignPct(a.dollarRoi)} | ${fmtMoneyShort(a.pnl)} |`);
  }
  out.push('');

  // ═══════════════════════════════════════════════════════════════════════════
  // §5. FULL (Δw × Δq) WIN MATRIX
  // ═══════════════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §5. Full (Δ_winner × Δ_quality) win matrix');
  out.push('');
  out.push(`Cell format: \`N · W-L-P · WR% · ROI%\`. Extreme axes (±3) are clamped. ROI% hidden when N < ${MIN_N_FOR_ROI}. **Lock floor: Δw ≥ +1 ∧ Δq ≥ +1.**`);
  out.push('');
  function buildMatrix(rows) {
    const cells = {};
    for (const w of DW_BUCKETS) for (const q of DQ_BUCKETS) {
      cells[`${w >= 0 ? '+' : ''}${w},${q >= 0 ? '+' : ''}${q}`] = emptyAgg();
    }
    for (const r of rows) {
      const k = cellKey(r.dw, r.dq);
      pushAgg(cells[k], r);
    }
    return cells;
  }
  function mdMatrix(title, cells, n) {
    out.push(`### ${title} (N = ${n})`);
    out.push('');
    out.push('| | ' + DQ_BUCKETS.map(q => `**Δq${q >= 0 ? '+' : ''}${q}**`).join(' | ') + ' |');
    out.push('|---|' + DQ_BUCKETS.map(() => '---').join('|') + '|');
    for (const w of DW_BUCKETS) {
      const row = [`**Δw${w >= 0 ? '+' : ''}${w}**`];
      for (const q of DQ_BUCKETS) {
        const k = `${w >= 0 ? '+' : ''}${w},${q >= 0 ? '+' : ''}${q}`;
        const c = finalizeAgg(cells[k]);
        if (c.n === 0) { row.push('—'); continue; }
        const wrStr  = c.wr  == null ? '—' : `${c.wr.toFixed(0)}%`;
        const roiStr = c.n >= MIN_N_FOR_ROI && c.roi != null ? ` \`${sign(c.roi, 0)}%\`` : '';
        row.push(`N=${c.n} · ${c.w}-${c.l}${c.p ? `-${c.p}` : ''} · ${wrStr}${roiStr}`);
      }
      out.push('| ' + row.join(' | ') + ' |');
    }
    out.push('');
  }
  mdMatrix('All markets', buildMatrix(pickRows), pickRows.length);
  for (const sport of sports) {
    const slice = pickRows.filter(r => r.sport === sport);
    if (!slice.length) continue;
    mdMatrix(`Sport — ${sport.toUpperCase()}`, buildMatrix(slice), slice.length);
  }
  for (const market of markets) {
    const slice = pickRows.filter(r => r.market === market);
    if (!slice.length) continue;
    mdMatrix(`Market — ${market}`, buildMatrix(slice), slice.length);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // §6. WALLET ROSTER GROWTH & PROFITABILITY
  // ═══════════════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §6. Wallet roster growth & profitability');
  out.push('');
  out.push(`"Tracked in sport X" = a wallet has placed **≥ ${MIN_BETS} bets** in X within the sample. "Profitable" = cumulative flat PnL > 0. Source: \`v8Scoring.walletDetails\` on every graded v6-era game.`);
  out.push('');

  function summarizeWallets(rows) {
    const byWallet = new Map();
    for (const b of rows) {
      if (!byWallet.has(b.wallet)) byWallet.set(b.wallet, []);
      byWallet.get(b.wallet).push(b);
    }
    const wallets = [];
    for (const [wallet, bs] of byWallet) {
      const n = bs.length;
      const wins = bs.filter(b => b.won === 1).length;
      const flatPnl = bs.reduce((a, b) => a + (b.flat || 0), 0);
      const invested = bs.reduce((a, b) => a + (b.invested || 0), 0);
      const dollarPnl = bs.reduce((a, b) => a + (b.dollarPnl || 0), 0);
      wallets.push({
        wallet, n, wins, losses: n - wins,
        wr: (wins / n) * 100, flatPnl, flatRoi: (flatPnl / n) * 100,
        invested, dollarPnl,
        dollarRoi: invested > 0 ? (dollarPnl / invested) * 100 : null,
      });
    }
    return wallets;
  }

  // Per-sport snapshot.
  const sportSnapshots = {};
  out.push('### §6a. Per-sport wallet snapshot');
  out.push('');
  out.push(mdHeader(['Sport', 'Total wallets seen', `Tracked (≥${MIN_BETS})`, 'Profitable', '% prof', 'WR ≥ 50%', 'WR ≥ 60%', 'WR ≥ 70%']));
  for (const sport of sports) {
    const slice = walletBets.filter(b => b.sport === sport);
    const allW = summarizeWallets(slice);
    const tracked = allW.filter(w => w.n >= MIN_BETS);
    const profitable = tracked.filter(w => w.flatPnl > 0);
    const wr50 = tracked.filter(w => w.wr >= 50);
    const wr60 = tracked.filter(w => w.wr >= 60);
    const wr70 = tracked.filter(w => w.wr >= 70);
    sportSnapshots[sport] = { uniqueAll: new Set(slice.map(b => b.wallet)).size, tracked, profitable, wr50, wr60, wr70 };
    const pct = tracked.length ? (profitable.length / tracked.length * 100).toFixed(0) : '—';
    out.push(`| ${sport.toUpperCase()} | ${sportSnapshots[sport].uniqueAll} | ${tracked.length} | ${profitable.length} | ${pct}% | ${wr50.length} | ${wr60.length} | ${wr70.length} |`);
  }
  const allFlat = summarizeWallets(walletBets);
  const trAll = allFlat.filter(w => w.n >= MIN_BETS);
  const prAll = trAll.filter(w => w.flatPnl > 0);
  out.push(`| **ALL (any sport)** | **${new Set(walletBets.map(b => b.wallet)).size}** | **${trAll.length}** | **${prAll.length}** | **${trAll.length ? (prAll.length / trAll.length * 100).toFixed(0) : '—'}%** | **${trAll.filter(w => w.wr >= 50).length}** | **${trAll.filter(w => w.wr >= 60).length}** | **${trAll.filter(w => w.wr >= 70).length}** |`);
  out.push('');

  // Daily roster growth.
  out.push('### §6b. Daily roster growth (cumulative through each date)');
  out.push('');
  out.push(`Format: \`tracked (profitable)\`. For each date D, recompute the roster using every bet up to and including D.`);
  out.push('');
  const growthCols = ['Date', 'ALL', ...sports.map(s => s.toUpperCase())];
  out.push(mdHeader(growthCols));
  for (const date of allDates) {
    const upTo = walletBets.filter(b => b.date <= date);
    const row = [date];
    const allW = summarizeWallets(upTo);
    const trA = allW.filter(w => w.n >= MIN_BETS);
    const prA = trA.filter(w => w.flatPnl > 0);
    row.push(`${trA.length} (${prA.length})`);
    for (const sport of sports) {
      const ws = summarizeWallets(upTo.filter(b => b.sport === sport));
      const tr = ws.filter(w => w.n >= MIN_BETS);
      const pr = tr.filter(w => w.flatPnl > 0);
      row.push(`${tr.length} (${pr.length})`);
    }
    out.push(`| ${row.join(' | ')} |`);
  }
  out.push('');

  // Top profitable wallets per sport.
  out.push('### §6c. Top 10 profitable wallets by sport');
  out.push('');
  for (const sport of sports) {
    const { tracked } = sportSnapshots[sport];
    const top = [...tracked].sort((a, b) => b.flatRoi - a.flatRoi).slice(0, 10);
    if (!top.length) continue;
    out.push(`#### ${sport.toUpperCase()}`);
    out.push('');
    out.push(mdHeader(['#', 'Wallet', 'N', 'W', 'L', 'WR%', 'Flat PnL (u)', 'Flat ROI', '$ PnL']));
    top.forEach((w, i) => {
      out.push(`| ${i + 1} | ${w.wallet} | ${w.n} | ${w.wins} | ${w.losses} | ${w.wr.toFixed(1)}% | ${sign(w.flatPnl, 2)} | ${fmtSignPct(w.flatRoi)} | ${fmtMoneyShort(w.dollarPnl)} |`);
    });
    out.push('');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // §7. WALLET WINNERS DESCRIPTIVES
  // ═══════════════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §7. Wallet winners — descriptive stats');
  out.push('');
  out.push(`Every (wallet × sport) row where the wallet has ≥ ${MIN_BETS} bets in the sport AND flat PnL > 0. A wallet can appear in multiple sports.`);
  out.push('');

  function buildWalletSportRows(rows, sport) {
    const slice = rows.filter(b => b.sport === sport);
    const byWallet = new Map();
    for (const b of slice) {
      if (!byWallet.has(b.wallet)) byWallet.set(b.wallet, []);
      byWallet.get(b.wallet).push(b);
    }
    const out = [];
    for (const [wallet, bs] of byWallet) {
      const n = bs.length;
      if (n < MIN_BETS) continue;
      const wins = bs.filter(b => b.won === 1).length;
      const sizes = bs.map(b => b.invested || 0);
      const sortedSizes = [...sizes].sort((a, b) => a - b);
      const avgSize = sizes.reduce((a, b) => a + b, 0) / n;
      const maxSize = Math.max(...sizes);
      const invested = sizes.reduce((a, b) => a + b, 0);
      const dollarPnl = bs.reduce((a, b) => a + (b.dollarPnl || 0), 0);
      const flatPnl = bs.reduce((a, b) => a + (b.flat || 0), 0);
      const flatRoi = (flatPnl / n) * 100;
      const dollarRoi = invested > 0 ? (dollarPnl / invested) * 100 : null;
      const dates = [...new Set(bs.map(b => b.date))].sort();
      const span = dayDiff(dates[0], dates[dates.length - 1]) + 1;
      const betsPerDay = n / span;
      out.push({
        wallet, sport,
        n, wins, losses: n - wins, wr: (wins / n) * 100,
        avgSize, medSize: quantile(sortedSizes, 0.5), maxSize, invested,
        dollarPnl, dollarRoi, flatPnl, flatRoi,
        firstDate: dates[0], lastDate: dates[dates.length - 1],
        daysActive: dates.length, span, betsPerDay,
      });
    }
    return out;
  }
  const winnerRows = [];
  for (const sport of sports) winnerRows.push(...buildWalletSportRows(walletBets, sport).filter(r => r.flatPnl > 0));

  // §7a — Per-sport winner cohort summary.
  out.push('### §7a. Winner cohort summary by sport');
  out.push('');
  out.push(mdHeader(['Sport', 'Winners', 'Σ bets', 'Σ invested', 'Σ $PnL', 'Mean WR%', 'Mean N', 'Mean avg $', 'Mean bets/day', 'Mean flat ROI']));
  for (const sport of sports) {
    const w = winnerRows.filter(r => r.sport === sport);
    if (!w.length) { out.push(`| ${sport.toUpperCase()} | 0 | — | — | — | — | — | — | — | — |`); continue; }
    const sumN = w.reduce((a, b) => a + b.n, 0);
    const sumInv = w.reduce((a, b) => a + b.invested, 0);
    const sumPnl = w.reduce((a, b) => a + b.dollarPnl, 0);
    const meanWr = w.reduce((a, b) => a + b.wr, 0) / w.length;
    const meanN = sumN / w.length;
    const meanSize = w.reduce((a, b) => a + b.avgSize, 0) / w.length;
    const meanBpd = w.reduce((a, b) => a + b.betsPerDay, 0) / w.length;
    const meanRoi = w.reduce((a, b) => a + b.flatRoi, 0) / w.length;
    out.push(`| ${sport.toUpperCase()} | ${w.length} | ${sumN} | ${fmtMoneyShort(sumInv)} | ${fmtMoneyShort(sumPnl)} | ${meanWr.toFixed(1)}% | ${meanN.toFixed(1)} | ${fmtMoneyShort(meanSize)} | ${meanBpd.toFixed(2)} | ${fmtSignPct(meanRoi)} |`);
  }
  if (winnerRows.length) {
    const sumN = winnerRows.reduce((a, b) => a + b.n, 0);
    const sumInv = winnerRows.reduce((a, b) => a + b.invested, 0);
    const sumPnl = winnerRows.reduce((a, b) => a + b.dollarPnl, 0);
    const meanWr = winnerRows.reduce((a, b) => a + b.wr, 0) / winnerRows.length;
    const meanN = sumN / winnerRows.length;
    const meanSize = winnerRows.reduce((a, b) => a + b.avgSize, 0) / winnerRows.length;
    const meanBpd = winnerRows.reduce((a, b) => a + b.betsPerDay, 0) / winnerRows.length;
    const meanRoi = winnerRows.reduce((a, b) => a + b.flatRoi, 0) / winnerRows.length;
    out.push(`| **ALL** | **${winnerRows.length}** | **${sumN}** | **${fmtMoneyShort(sumInv)}** | **${fmtMoneyShort(sumPnl)}** | **${meanWr.toFixed(1)}%** | **${meanN.toFixed(1)}** | **${fmtMoneyShort(meanSize)}** | **${meanBpd.toFixed(2)}** | **${fmtSignPct(meanRoi)}** |`);
  }
  out.push('');

  // §7b — Quartile distribution of winners.
  out.push('### §7b. Winner cohort — quartile distribution');
  out.push('');
  out.push('Spread across every winning (wallet × sport) row. Tells you the typical winner profile vs the outliers.');
  out.push('');
  const metrics = [
    ['N (bets)',       winnerRows.map(r => r.n),          (v) => v.toFixed(1)],
    ['WR %',           winnerRows.map(r => r.wr),         (v) => v.toFixed(1) + '%'],
    ['Flat ROI %',     winnerRows.map(r => r.flatRoi),    (v) => fmtSignPct(v)],
    ['$ ROI %',        winnerRows.map(r => r.dollarRoi).filter(v => v != null), (v) => fmtSignPct(v)],
    ['Avg bet ($)',    winnerRows.map(r => r.avgSize),    fmtMoneyShort],
    ['Median bet ($)', winnerRows.map(r => r.medSize),    fmtMoneyShort],
    ['Max bet ($)',    winnerRows.map(r => r.maxSize),    fmtMoneyShort],
    ['Σ invested',     winnerRows.map(r => r.invested),   fmtMoneyShort],
    ['$ PnL',          winnerRows.map(r => r.dollarPnl),  fmtMoneyShort],
    ['Days active',    winnerRows.map(r => r.daysActive), (v) => v.toFixed(1)],
    ['Span (days)',    winnerRows.map(r => r.span),       (v) => v.toFixed(1)],
    ['Bets / day',     winnerRows.map(r => r.betsPerDay), (v) => v.toFixed(2)],
  ];
  out.push(mdHeader(['Metric', 'Min', 'Q25', 'Median', 'Q75', 'Max', 'Mean']));
  for (const [name, vals, fmt] of metrics) {
    const d = distrib(vals);
    out.push(`| ${name} | ${d.min == null ? '—' : fmt(d.min)} | ${d.q25 == null ? '—' : fmt(d.q25)} | ${d.median == null ? '—' : fmt(d.median)} | ${d.q75 == null ? '—' : fmt(d.q75)} | ${d.max == null ? '—' : fmt(d.max)} | ${d.mean == null ? '—' : fmt(d.mean)} |`);
  }
  out.push('');

  // §7c — Cadence archetypes.
  out.push('### §7c. Winner cadence archetypes');
  out.push('');
  out.push('Where do our winners cluster? Snipers fire rarely but big; volume bettors grind everything. Tells you which trade-frequency profile actually pays.');
  out.push('');
  const archetype = (r) => {
    if (r.n <= 3)  return 'Sniper (≤3 bets)';
    if (r.n <= 6)  return 'Sharp (4–6 bets)';
    if (r.n <= 10) return 'Grinder (7–10 bets)';
    return 'Volume (>10 bets)';
  };
  const order = ['Sniper (≤3 bets)', 'Sharp (4–6 bets)', 'Grinder (7–10 bets)', 'Volume (>10 bets)'];
  const buckets = new Map(order.map(k => [k, []]));
  for (const r of winnerRows) buckets.get(archetype(r)).push(r);
  out.push(mdHeader(['Archetype', 'Winners', 'Σ bets', 'Mean WR%', 'Mean flat ROI', 'Mean avg $', 'Mean bets/day', 'Σ $ PnL']));
  for (const k of order) {
    const rs = buckets.get(k);
    if (!rs.length) { out.push(`| ${k} | 0 | — | — | — | — | — | — |`); continue; }
    const sumN = rs.reduce((a, b) => a + b.n, 0);
    const mWr = rs.reduce((a, b) => a + b.wr, 0) / rs.length;
    const mRoi = rs.reduce((a, b) => a + b.flatRoi, 0) / rs.length;
    const mSize = rs.reduce((a, b) => a + b.avgSize, 0) / rs.length;
    const mBpd = rs.reduce((a, b) => a + b.betsPerDay, 0) / rs.length;
    const sumPnl = rs.reduce((a, b) => a + b.dollarPnl, 0);
    out.push(`| ${k} | ${rs.length} | ${sumN} | ${mWr.toFixed(1)}% | ${fmtSignPct(mRoi)} | ${fmtMoneyShort(mSize)} | ${mBpd.toFixed(2)} | ${fmtMoneyShort(sumPnl)} |`);
  }
  out.push('');

  // ─── Footer ────────────────────────────────────────────────────────────────
  out.push('---');
  out.push('');
  out.push(`_Driven by \`scripts/dailyV6Report.js\` · regenerates daily via \`.github/workflows/daily-v6-report.yml\` · WHITELIST_CONSENSUS_VERSION = 6 · QUALITY_CONTRIB_CUT = ${QUALITY_CUT}_`);
  out.push('');

  const outPath = join(REPO_ROOT, 'DAILY_V6_REPORT.md');
  writeFileSync(outPath, out.join('\n'));
  console.log(`\nWrote ${outPath}  (${out.length} lines)`);

  // Console summary.
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log(`  SHARP INTEL v6 — DAILY MASTER REPORT (${nowET} ET)`);
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`Sample: ${meta.gradedSidesUsable} graded sides · ${walletBets.length} wallet-bets · ${allDates.length} dates (${meta.dateMin} → ${meta.dateMax})`);
  console.log(`All sides:    N=${allAgg.n}  WR=${fmtPct(allAgg.wr)}  flatROI=${fmtSignPct(allAgg.roi)}  PnL=${sign(allAgg.pnl, 2)}u`);
  console.log(`Lock-eligible: N=${lockAgg.n}  WR=${fmtPct(lockAgg.wr)}  flatROI=${fmtSignPct(lockAgg.roi)}  PnL=${sign(lockAgg.pnl, 2)}u`);
  console.log('\nVault-Star buckets:');
  for (const b of STAR_BUCKETS) {
    const slice = pickRows.filter(r => r.vaultStar >= b.min && r.vaultStar <= b.max);
    const a = finalizeAgg(slice.reduce((acc, r) => { pushAgg(acc, r); return acc; }, emptyAgg()));
    console.log(`  ${b.label.padEnd(18)} N=${String(a.n).padStart(3)}  WR=${fmtPct(a.wr).padStart(6)}  ROI=${fmtSignPct(a.roi).padStart(7)}  PnL=${sign(a.pnl, 2).padStart(7)}u`);
  }
  console.log('\nLock-floor cohorts:');
  for (const co of COHORTS) {
    const slice = pickRows.filter(r => co.f(r.dw, r.dq));
    const a = finalizeAgg(slice.reduce((acc, r) => { pushAgg(acc, r); return acc; }, emptyAgg()));
    const tag = LOCK_COHORT_IDS.has(co.id) ? '★' : ' ';
    console.log(`  ${tag} ${co.label.padEnd(45)} N=${String(a.n).padStart(3)}  WR=${fmtPct(a.wr).padStart(6)}  ROI=${fmtSignPct(a.roi).padStart(7)}  PnL=${sign(a.pnl, 2).padStart(7)}u`);
  }
  console.log('\nWallet roster:');
  console.log(`  Tracked (≥${MIN_BETS}): ${trAll.length}   Profitable: ${prAll.length}   WR≥60: ${trAll.filter(w => w.wr >= 60).length}`);
  console.log('\nSharp Vault hidden stars:');
  console.log(`  4★+ positions: ${vaultElite.n}   WR=${fmtPct(vaultElite.wr)}   $ROI=${fmtSignPct(vaultElite.dollarRoi)}   PnL=${fmtMoneyShort(vaultElite.pnl)}`);

  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
