/**
 * rankTodayLocks.js — Order today's LOCKED picks by V8.1 contribution signal.
 *
 * Pulls every pick side from sharpFlowPicks / Spreads / Totals for today
 * where lockStage === 'LOCKED', tags each with contribTier + qFor/qAg/margin,
 * and prints a ranked table from most to least confident.
 */

import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');

// v6 Two-Factor constants — kept in lockstep with src/pages/SharpFlow.jsx
// so we compute Δw / Δq the same way the live system does.
const QUALITY_CONTRIB_CUT = 30;

// Load the win-matrix the companion script (scripts/winMatrix.js) produces.
// Running rankTodayLocks.js right after winMatrix.js in the same workflow
// guarantees these two views are in sync (same whitelist snapshot, same
// T=30 cut, same clamped ±3 axes).
function loadWinMatrix() {
  const p = join(REPO_ROOT, 'public', 'win_matrix.json');
  if (!existsSync(p)) return null;
  try { return JSON.parse(readFileSync(p, 'utf8')); }
  catch { return null; }
}
function clampAxis(v, buckets) {
  const lo = buckets[0], hi = buckets[buckets.length - 1];
  if (v <= lo) return lo;
  if (v >= hi) return hi;
  return v;
}
function cellKey(dw, dq, matrix) {
  if (!matrix) return null;
  const cw = clampAxis(dw, matrix.config.dwBuckets);
  const cq = clampAxis(dq, matrix.config.dqBuckets);
  return `${cw >= 0 ? '+' : ''}${cw},${cq >= 0 ? '+' : ''}${cq}`;
}
function lookupCell(dw, dq, matrix, sport = null) {
  if (!matrix) return null;
  const key = cellKey(dw, dq, matrix);
  if (!key) return null;
  const sportCells = sport ? matrix.cells.bySport?.[sport] || {} : null;
  const allCells   = matrix.cells.all || {};
  return {
    key,
    all:   allCells[key]   || null,
    sport: sportCells?.[key] || null,
  };
}

if (!admin.apps.length) {
  const sakPath = join(__dirname, '../serviceAccountKey.json');
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
const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });

const COLS = [
  ['sharpFlowPicks', 'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals', 'TOTAL'],
];

// Phase 2 — load sharpWalletProfiles once so we can recompute the
// wallet-consensus (Δ = forW − agW) for each pick.
async function loadWalletProfiles() {
  const snap = await db.collection('sharpWalletProfiles').get();
  const map = new Map();
  snap.forEach(d => map.set(d.id, d.data()));
  return map;
}

function isWhitelistedForSport(walletShort, sport, profiles) {
  const t = profiles.get(walletShort)?.bySport?.[sport]?.whitelistTier;
  return t === 'CONFIRMED' || t === 'FLAT';
}

function classifyDelta(forW, agW) {
  const delta = forW - agW;
  const verdict =
    delta >= 2 ? 'STRONG_FOR' :
    delta === 1 ? 'LEAN_FOR' :
    delta === 0 ? 'NEUTRAL' :
    delta === -1 ? 'FADE_WEAK' : 'FADE_STRONG';
  return { delta, verdict };
}

// Score ~ compact ranking key that merges every edge signal we have.
// Higher = more confident.
//
// Weights tuned from V8_GOLDILOCKS_REPORT.md (N=35, 2026-04-18..20):
//   - maxRoiN_F is the single strongest continuous predictor
//       ρ(maxRoiN_F, won) = +0.471  |  ρ(maxRoiN_F, flat ROI) = +0.496
//   - meanBase_F is #2           (+0.387 / +0.339)
//   - qFor(roiNorm≥50, no size) outranks contribution≥50 now (+0.267 vs +0.174)
//   - regime = CLEAR_MOVE alone is 75% WR / +33% flat / +46% wtd (N=8)
function confidenceScore(s) {
  const tierPts = { STRONG: 1000, STANDARD: 500, LEAN: 0, MUTE: -500 }[s.contribTier] ?? 0;
  const regimePts = s.regime === 'CLEAR_MOVE' ? 300 : s.regime === 'NEAR_START' ? 100 : 0;
  const marginPts = 50 * (s.contribMargin ?? 0);
  const qForPts = 30 * (s.qFor50 ?? 0);
  const concPenalty = s.topShare ? -40 * s.topShare : 0;    // penalize 1-wallet concentration
  const starPts = 10 * (s.stars ?? 0);

  // NEW: elite-wallet bonuses (top continuous predictors in current sample)
  let eliteBonus = 0;
  if ((s.maxRoiN_F ?? 0) >= 70) eliteBonus += 250;       // "elite ROI wallet on side"
  else if ((s.maxRoiN_F ?? 0) >= 50) eliteBonus += 120;
  if ((s.meanBase_F ?? 0) >= 55) eliteBonus += 120;      // "avg for-side quality is high"
  if ((s.qForROI50 ?? 0) >= 2) eliteBonus += 100;        // ≥2 wallets in top-50% ROI on side

  // Phase 2 — wallet-consensus bonus (Δ = whitelistedForW − whitelistedAgW).
  // Backtest: following a ≥2 whitelisted-sharp pile-on with zero opposition
  // was the single strongest discrete signal across NBA/MLB/NHL picks
  // (see PHASE_2_WALLET_CONSENSUS_PLAN.md §1). Rank it accordingly.
  let consensusBonus = 0;
  if (s.wlDelta != null) {
    if (s.wlDelta >= 2) consensusBonus += 350;           // STRONG_FOR (promotion-eligible)
    else if (s.wlDelta === 1) consensusBonus += 120;     // LEAN_FOR
    else if (s.wlDelta === -1) consensusBonus -= 180;    // FADE_WEAK
    else if (s.wlDelta <= -2) consensusBonus -= 400;     // FADE_STRONG
  }
  return tierPts + regimePts + marginPts + qForPts + concPenalty + starPts + eliteBonus + consensusBonus;
}

// ── Live-edge markers ────────────────────────────────────────────────
// Every pick cell that hits a *confirmed* live-positive bucket gets a
// trailing ★. Cells in *confirmed bleeder* buckets get a trailing !.
// Confirmed = "every day positive" / "every day negative" in
// V8_DAILY_PNL.md §6a stability scoreboard (2026-04-18..20, N=42).
//   +  maxRoiN_F ≥ 70           → +30.7% flat, 3/3 days
//   +  meanBase_F ≥ 55          → +33.9% flat, 3/3 days
//   +  contribMargin = +1       → +42.0% flat, 3/3 days
//   +  Δcontrib ∈ (50, 100]     → +71.8% flat, 2/2 days
//   +  regime = CLEAR_MOVE      → V8.2 live flat +0.5u; +30% flat ROI N=11
//   +  contribTier = STRONG     → V8.1 STRONG rule (baseline promotion)
//   -  meanBase_F < 50          → -36% flat
//   -  Δcontrib ∈ (0, 50]       → -80.2% flat, 3/3 days
//   -  contribMargin = 0        → -34% flat, bleeder
//   -  regime = NO_MOVE         → -100% flat (0-for-3 in sample)
//   -  contribTier = LEAN       → -34% flat, 3/3 losing days
function markers(s) {
  const m = {};
  // maxRoiN_F
  m.maxRoi = (s.maxRoiN_F ?? 0) >= 70 ? '★' : '';
  // meanBase_F
  m.meanBase = (s.meanBase_F ?? 0) >= 55 ? '★' : (s.meanBase_F ?? 0) < 50 ? '!' : '';
  // contribMargin — exactly +1 is the stable sweet spot; 0 is a bleeder
  m.margin = s.contribMargin === 1 ? '★' : s.contribMargin === 0 ? '!' : '';
  // Δcontribution (for − against)
  const dctrb = (s.sumContribFor ?? 0) - (s.sumContribAg ?? 0);
  m.dctrb = dctrb > 50 && dctrb <= 100 ? '★' : dctrb > 0 && dctrb <= 50 ? '!' : '';
  // regime
  m.regime = s.regime === 'CLEAR_MOVE' ? '★' : s.regime === 'NO_MOVE' ? '!' : '';
  // contribTier
  m.tier = s.contribTier === 'STRONG' ? '★' : s.contribTier === 'LEAN' ? '!' : '';
  // Phase 2 wallet-consensus (Δ = whitelisted For − whitelisted Against)
  m.wDelta = (s.wlDelta ?? 0) >= 2 ? '★' : (s.wlDelta ?? 0) <= -1 ? '!' : '';
  // edge count for the leftmost column
  m.edges = Object.values(m).filter(v => v === '★').length;
  m.warns = Object.values(m).filter(v => v === '!').length;
  return m;
}

async function loadToday() {
  const rows = [];
  const profiles = await loadWalletProfiles();
  for (const [col, mkt] of COLS) {
    const snap = await db.collection(col).where('date', '==', today).get();
    for (const doc of snap.docs) {
      const d = doc.data();
      const sides = d.sides || {};
      for (const [sideKey, side] of Object.entries(sides)) {
        if (side.lockStage && side.lockStage !== 'LOCKED') continue;
        const peak = side.peak || side.lock;
        if (!peak) continue;
        const v8 = peak.v8Scoring || {};
        rows.push({
          market: mkt,
          sport: d.sport,
          gameKey: d.gameKey,
          away: d.away,
          home: d.home,
          team: side.team,
          side: sideKey,
          stars: peak.stars ?? 0,
          units: peak.units ?? 0,
          odds: peak.odds ?? 0,
          book: peak.book ?? '',
          regime: peak.regime ?? side.promotedRegime ?? 'UNKNOWN',
          lockStage: side.lockStage ?? 'LOCKED',
          contribTier: side.contribTier ?? null,
          promotedBy: side.promotedBy ?? null,
          qFor50: null,
          qAg50: null,
          contribMargin: null,
          topShare: v8.topShare ?? null,
          wps: v8.walletPlayScore ?? null,
          walletCountFor: v8.walletCountFor ?? null,
          walletCountAgainst: v8.walletCountAgainst ?? null,
        });
        // Re-derive qFor/qAg/margin from walletDetails if present (robust even for pre-V8.1 picks)
        const wd = v8.walletDetails || [];
        const consensusSide = v8.consensusSide || sideKey;
        const forW = wd.filter(w => w.side === consensusSide);
        const agW = wd.filter(w => w.side && w.side !== consensusSide);
        const last = rows[rows.length - 1];
        last.qFor50 = forW.filter(w => (w.contribution ?? 0) >= 50).length;
        last.qAg50 = agW.filter(w => (w.contribution ?? 0) >= 50).length;
        last.contribMargin = last.qFor50 - last.qAg50;
        last.maxContribFor = forW.reduce((m, w) => Math.max(m, w.contribution ?? 0), 0);
        last.sumContribFor = forW.reduce((s, w) => s + (w.contribution ?? 0), 0);
        last.sumContribAg = agW.reduce((s, w) => s + (w.contribution ?? 0), 0);
        // NEW: elite-wallet features (strongest continuous predictors in V8_GOLDILOCKS_REPORT)
        last.maxRoiN_F = forW.reduce((m, w) => Math.max(m, w.roiNorm ?? 0), 0);
        last.meanBase_F = forW.length
          ? forW.reduce((s, w) => s + (w.walletBase ?? 0), 0) / forW.length
          : 0;
        last.qForROI50 = forW.filter(w => (w.roiNorm ?? 0) >= 50).length;
        last.qForROI70 = forW.filter(w => (w.roiNorm ?? 0) >= 70).length;

        // Phase 2 — wallet consensus (whitelisted wallets only, per sport)
        const wlFor = forW.filter(w => isWhitelistedForSport(w.wallet, d.sport, profiles));
        const wlAg  = agW.filter(w => isWhitelistedForSport(w.wallet, d.sport, profiles));
        last.wlForW = wlFor.length;
        last.wlAgW  = wlAg.length;
        const cls = classifyDelta(last.wlForW, last.wlAgW);
        last.wlDelta = cls.delta;
        last.wlVerdict = cls.verdict;

        // v6 two-factor quality margin — exactly mirrors computeWalletConsensus
        // in SharpFlow.jsx: count wallets (either side) with contribution ≥ 30.
        let qFor30 = 0, qAg30 = 0;
        for (const row of wd) {
          if ((row?.contribution ?? 0) < QUALITY_CONTRIB_CUT) continue;
          if (row.side === consensusSide) qFor30 += 1;
          else if (row.side) qAg30 += 1;
        }
        last.qForT30 = qFor30;
        last.qAgT30  = qAg30;
        last.qualityMargin = qFor30 - qAg30;
        // Preserve the stamped values too (source of truth for what's in Firebase)
        last.wlStampedDelta = side.v8_walletConsensusDelta ?? null;
        last.wlStampedVerdict = side.v8_walletConsensusVerdict ?? null;

        // Derive tier client-side if backend didn't
        if (!last.contribTier && wd.length) {
          if (last.contribMargin < 0) last.contribTier = 'MUTE';
          else if ((last.qFor50 >= 3 && last.qAg50 === 0) || (last.qFor50 >= 2 && last.contribMargin >= 1)) last.contribTier = 'STRONG';
          else if (last.qFor50 >= 1 && last.contribMargin >= 1 && last.maxContribFor >= 50) last.contribTier = 'STANDARD';
          else last.contribTier = 'LEAN';
        }
        last.score = confidenceScore(last);
      }
    }
  }
  // Attach edge markers to every row, then sort by (edges desc, warns asc, score desc)
  rows.forEach(r => { r._mk = markers(r); });
  return rows.sort((a, b) => {
    if (b._mk.edges !== a._mk.edges) return b._mk.edges - a._mk.edges;
    if (a._mk.warns !== b._mk.warns) return a._mk.warns - b._mk.warns;
    return b.score - a.score;
  });
}

// pad that keeps the marker glued to the number (★ / ! / '')
function padWithMark(value, mark, width) {
  const s = `${value}${mark ? mark : ' '}`;
  return s.padEnd(width);
}

(async () => {
  const rows = await loadToday();
  const matrix = loadWinMatrix();
  console.log(`\n=== Today's Locked Picks ranked by V8.1 + (Δw × Δq) historical cell (${today}) ===\n`);
  if (matrix) {
    const sample = matrix.sample || {};
    const dr = sample.dateRange || [];
    console.log(`Historical matrix:  N=${sample.gradedWithWalletDetails ?? '—'}  range=${dr[0] || '—'} … ${dr[1] || '—'}  generated=${matrix.generatedAt}`);
    console.log(`(see WIN_MATRIX.md for the full cross-tab; cell = clamp(Δw,±3) × clamp(Δq,±3))\n`);
  } else {
    console.log('[warn] public/win_matrix.json not found — run scripts/winMatrix.js first to get cell annotations.\n');
  }
  if (!rows.length) {
    console.log('No locked picks found for today.');
    process.exit(0);
  }

  // Attach the historical cell to each row so we can both print it inline
  // and group by it in the rollup below.
  rows.forEach(r => {
    r._cell = matrix ? lookupCell(r.wlDelta ?? 0, r.qualityMargin ?? 0, matrix, r.sport) : null;
  });

  // Header
  console.log(
    'RK | Edges | Tier       | Pick                                         | ★   | u    | Odds   | Δw/Δq  | Cell All (N,WR,ROI)    | Cell Sport (N,WR,ROI)  | mgn   | Δctrb  | maxRoi | meanB  | Verdict     | Regime        | PromotedBy'
  );
  console.log('-'.repeat(240));

  function cellLabel(c) {
    if (!c) return '—'.padEnd(22);
    const n  = `N=${c.n}`;
    const wr = c.wr == null ? '—' : `${c.wr.toFixed(0)}%`;
    const roi = (c.n >= (matrix?.config?.minNForRoi ?? 3) && c.roi != null)
      ? `${c.roi >= 0 ? '+' : ''}${c.roi.toFixed(0)}%`
      : '—';
    return `${n} ${c.w}-${c.l} ${wr} ${roi}`.padEnd(22);
  }

  rows.forEach((r, i) => {
    const mk = r._mk;
    const edgesCol = `${mk.edges}★${mk.warns ? ` ${mk.warns}!` : '   '}`.padEnd(5);
    const pick = `${r.sport} ${r.market} — ${r.team}`.padEnd(44);
    const tier = `${r.contribTier ?? '—'}${mk.tier}`.padEnd(10);
    const mgn = `${r.contribMargin >= 0 ? '+' : ''}${r.contribMargin}${mk.margin}`;
    const dctrbRaw = (r.sumContribFor - r.sumContribAg).toFixed(0);
    const dctrb = padWithMark(dctrbRaw, mk.dctrb, 6);
    const maxRoi = padWithMark((r.maxRoiN_F ?? 0).toFixed(0), mk.maxRoi, 6);
    const meanB  = padWithMark((r.meanBase_F ?? 0).toFixed(0), mk.meanBase, 6);
    const dwdq = `${r.wlDelta >= 0 ? '+' : ''}${r.wlDelta ?? 0}/${r.qualityMargin >= 0 ? '+' : ''}${r.qualityMargin ?? 0}`.padEnd(7);
    const cellAll   = cellLabel(r._cell?.all);
    const cellSport = cellLabel(r._cell?.sport);
    const verdict = (r.wlVerdict ?? '—').padEnd(11);
    const regime = `${r.regime || '—'}${mk.regime}`.padEnd(13);
    const prom = r.promotedBy ?? '—';

    console.log(
      `${String(i + 1).padStart(2)} | ${edgesCol} | ${tier} | ${pick} | ${String(r.stars).padEnd(3)} | ${String(r.units).padEnd(4)} | ${(r.odds >= 0 ? '+' : '') + r.odds}`.padEnd(104) +
        `| ${dwdq} | ${cellAll} | ${cellSport} | ${mgn.padEnd(5)} | ${dctrb} | ${maxRoi} | ${meanB} | ${verdict} | ${regime} | ${prom}`
    );
  });

  // ── (Δw × Δq) cell rollup — where are today's picks living on the matrix? ──
  if (matrix) {
    const byCell = new Map();
    for (const r of rows) {
      const key = r._cell?.key || 'unknown';
      if (!byCell.has(key)) byCell.set(key, []);
      byCell.get(key).push(r);
    }
    const ordered = [...byCell.entries()].sort((a, b) => {
      const ca = matrix.cells.all[a[0]] || {};
      const cb = matrix.cells.all[b[0]] || {};
      const roiA = ca.roi == null ? -999 : ca.roi;
      const roiB = cb.roi == null ? -999 : cb.roi;
      if (roiA !== roiB) return roiB - roiA;
      return (cb.n || 0) - (ca.n || 0);
    });
    console.log(`\n── Today's picks placed on the (Δw × Δq) matrix (sorted by cell ROI%) ──`);
    for (const [key, picks] of ordered) {
      const c = matrix.cells.all[key];
      const hdr = c
        ? `  [${key}]  N=${c.n}  ${c.w}-${c.l}${c.p ? `-${c.p}` : ''}  WR=${c.wr == null ? '—' : c.wr.toFixed(0) + '%'}  ROI=${c.n >= (matrix.config.minNForRoi ?? 3) && c.roi != null ? (c.roi >= 0 ? '+' : '') + c.roi.toFixed(0) + '%' : '—'}`
        : `  [${key}]  no historical data in this cell`;
      console.log(hdr);
      for (const r of picks) {
        const units = (r.units ?? 0).toFixed(2);
        const cs = r._cell?.sport;
        const sportNote = cs && cs.n >= (matrix.config.minNForRoi ?? 3)
          ? `    · ${r.sport}-only cell: N=${cs.n} ${cs.w}-${cs.l} WR=${cs.wr == null ? '—' : cs.wr.toFixed(0) + '%'} ROI=${cs.roi != null ? (cs.roi >= 0 ? '+' : '') + cs.roi.toFixed(0) + '%' : '—'}`
          : cs && cs.n > 0
            ? `    · ${r.sport}-only cell: N=${cs.n} ${cs.w}-${cs.l} (too small for ROI)`
            : '';
        console.log(`      ${r.sport} ${r.market} ${r.team}  ${r.stars}★ ${units}u  @ ${r.odds >= 0 ? '+' : ''}${r.odds}  Δw/Δq=${r.wlDelta >= 0 ? '+' : ''}${r.wlDelta}/${r.qualityMargin >= 0 ? '+' : ''}${r.qualityMargin}${sportNote}`);
      }
    }

    // Short color-coded read: which picks landed in elite / profitable /
    // breakeven / money-loser cells per the matrix?
    const elite = [], profitable = [], breakeven = [], bleeder = [];
    for (const r of rows) {
      const c = r._cell?.all;
      if (!c) continue;
      if (c.n < (matrix.config.minNForRoi ?? 3)) { breakeven.push(r); continue; }
      if ((c.roi ?? 0) >= 50 && (c.wr ?? 0) >= 75) elite.push(r);
      else if ((c.roi ?? 0) >= 15) profitable.push(r);
      else if ((c.roi ?? 0) > -15) breakeven.push(r);
      else bleeder.push(r);
    }
    function fmtPick(r) {
      return `${r.sport} ${r.market} ${r.team}  Δw/Δq=${r.wlDelta >= 0 ? '+' : ''}${r.wlDelta}/${r.qualityMargin >= 0 ? '+' : ''}${r.qualityMargin}  u=${(r.units ?? 0).toFixed(2)}`;
    }
    if (elite.length) {
      console.log(`\n  ELITE CELL (historical ROI ≥ +50%, WR ≥ 75%): ${elite.length}`);
      elite.forEach(r => console.log(`    ★ ${fmtPick(r)}`));
    }
    if (profitable.length) {
      console.log(`\n  PROFITABLE CELL (historical ROI ≥ +15%): ${profitable.length}`);
      profitable.forEach(r => console.log(`    + ${fmtPick(r)}`));
    }
    if (breakeven.length) {
      console.log(`\n  UNKNOWN / THIN CELL (N < 3 or ROI ∈ [−15%, +15%]): ${breakeven.length}`);
      breakeven.forEach(r => console.log(`    ? ${fmtPick(r)}`));
    }
    if (bleeder.length) {
      console.log(`\n  BLEEDER CELL (historical ROI < −15%): ${bleeder.length}`);
      bleeder.forEach(r => console.log(`    ! ${fmtPick(r)}`));
    }
  }

  // ── Phase 2 — Whitelist winner consensus roll-up ──────────────────────
  const strongFor = rows.filter(r => (r.wlDelta ?? 0) >= 2);
  const leanFor   = rows.filter(r => (r.wlDelta ?? 0) === 1);
  const fadeWeak  = rows.filter(r => (r.wlDelta ?? 0) === -1);
  const fadeStr   = rows.filter(r => (r.wlDelta ?? 0) <= -2);

  console.log(`\n── Wallet-Consensus Winner Margin (Δ = whitelisted For − Against) ──`);
  console.log(`  STRONG_FOR  (Δ ≥ +2, promotion-eligible): ${strongFor.length}`);
  console.log(`  LEAN_FOR    (Δ = +1, unit bonus only):    ${leanFor.length}`);
  console.log(`  FADE_WEAK   (Δ = −1, MUTE if enabled):    ${fadeWeak.length}`);
  console.log(`  FADE_STRONG (Δ ≤ −2, CANCEL if enabled):  ${fadeStr.length}`);

  if (strongFor.length) {
    console.log(`\n  Δ ≥ +2 picks (our premium wallet-consensus signal):`);
    strongFor.forEach(r => {
      const extras = [];
      if (r._mk.maxRoi)   extras.push(`maxRoi ${(r.maxRoiN_F ?? 0).toFixed(0)}★`);
      if (r._mk.meanBase) extras.push(`meanB ${(r.meanBase_F ?? 0).toFixed(0)}★`);
      if (r._mk.regime)   extras.push(`${r.regime}★`);
      if (r._mk.tier)     extras.push(`${r.contribTier}★`);
      if (r._mk.margin)   extras.push(`mgn ${r.contribMargin >= 0 ? '+' : ''}${r.contribMargin}★`);
      console.log(
        `    ${r.sport} ${r.market} ${r.team}  ` +
        `Δ=+${r.wlDelta} (for ${r.wlForW} / ag ${r.wlAgW})  ` +
        `${r.stars}★  u=${r.units}  ${r.contribTier ?? '—'}  ` +
        `${extras.length ? '· ' + extras.join(' · ') : ''}`
      );
    });
  }
  if (fadeWeak.length || fadeStr.length) {
    console.log(`\n  Δ ≤ −1 picks (profitable sharps are fading our side):`);
    [...fadeStr, ...fadeWeak].forEach(r => {
      console.log(
        `    ${r.sport} ${r.market} ${r.team}  ` +
        `Δ=${r.wlDelta} (for ${r.wlForW} / ag ${r.wlAgW})  ${r.wlVerdict}`
      );
    });
  }

  // Standouts roll-up
  const standouts = rows.filter(r => r._mk.edges >= 3);
  if (standouts.length) {
    console.log(`\n── Standouts (≥3 live edges) ──`);
    standouts.forEach(r => {
      const hit = [];
      if (r._mk.maxRoi)    hit.push(`maxRoiN_F ${(r.maxRoiN_F ?? 0).toFixed(0)}`);
      if (r._mk.meanBase)  hit.push(`meanBase_F ${(r.meanBase_F ?? 0).toFixed(0)}`);
      if (r._mk.margin)    hit.push(`margin ${r.contribMargin >= 0 ? '+' : ''}${r.contribMargin}`);
      if (r._mk.dctrb)     hit.push(`Δctrb ${(r.sumContribFor - r.sumContribAg).toFixed(0)}`);
      if (r._mk.regime)    hit.push(r.regime);
      if (r._mk.tier)      hit.push(r.contribTier);
      console.log(`  ${r._mk.edges}★  ${r.sport} ${r.market} ${r.team}  —  ${hit.join(' · ')}`);
    });
  }

  // Bleeders roll-up
  const bleeders = rows.filter(r => r._mk.warns >= 2);
  if (bleeders.length) {
    console.log(`\n── Bleeder watch (≥2 known warning buckets) ──`);
    bleeders.forEach(r => {
      const hit = [];
      if (r._mk.meanBase === '!') hit.push(`meanBase_F ${(r.meanBase_F ?? 0).toFixed(0)} < 50`);
      if (r._mk.margin === '!')   hit.push(`margin = 0`);
      if (r._mk.dctrb === '!')    hit.push(`Δctrb ∈ (0,50]`);
      if (r._mk.regime === '!')   hit.push(`NO_MOVE`);
      if (r._mk.tier === '!')     hit.push(`LEAN tier`);
      console.log(`  ${r._mk.warns}!  ${r.sport} ${r.market} ${r.team}  —  ${hit.join(' · ')}`);
    });
  }

  console.log('\nLegend:');
  console.log('  Δw/Δq       = live whitelist winner margin / quality (T=30) margin for this pick');
  console.log('  Cell All    = historical (N · W-L · WR% · ROI%) for this Δw/Δq cell across ALL sports');
  console.log('  Cell Sport  = same cell restricted to this pick\'s sport (often much thinner)');
  console.log('                — ROI hidden when N < 3 (cell too thin to trust)');
  console.log('                — axes clamped at ±3 (Δw+3 = Δw ≥ +3; Δw-3 = Δw ≤ −3)');
  console.log('                — see WIN_MATRIX.md for the full cross-tab');
  console.log('');
  console.log('Edge markers (★ = confirmed winning bucket; ! = confirmed losing bucket):');
  console.log('  ★ Tier       = contribTier = STRONG  (game-level V8.1 sweet spot)');
  console.log('  ★ mgn        = contribMargin = +1    (§6a: +42% flat ROI, 3/3 positive days)');
  console.log('  ★ Δctrb      = Σfor − Σag ∈ (50, 100]  (§6a: +71.8% flat ROI, 2/2 positive days)');
  console.log('  ★ maxRoi     = maxRoiN_F ≥ 70        (§6a: +30.7% flat ROI, 3/3 positive days)');
  console.log('  ★ meanB      = meanBase_F ≥ 55       (§6a: +33.9% flat ROI, 3/3 positive days; live V8.3 bonus)');
  console.log('  ★ Regime     = CLEAR_MOVE            (live V8.2 +0.5u bonus; +30% flat ROI)');
  console.log('  ★ wΔ         = whitelisted-sharp consensus Δ ≥ +2  (V8.2 STRONG_FOR, promotion-eligible, +0.25u)');
  console.log('');
  console.log('  ! mgn        = contribMargin = 0     (bleeder — confirmed losing sample)');
  console.log('  ! Δctrb      = Σfor − Σag ∈ (0, 50]  (§6a: 3/3 losing days, -80% flat)');
  console.log('  ! maxRoi / meanB = ≥ threshold above is ★; < 50 on meanBase_F earns !');
  console.log('  ! Regime     = NO_MOVE');
  console.log('  ! Tier       = LEAN');
  console.log('  ! wΔ         = whitelisted consensus Δ ≤ −1  (profitable sharps fading our side → MUTE/CANCEL)');
  console.log('');
  console.log('Rows are sorted by (Edges ★ count DESC, Warns ! count ASC, raw V8 score DESC).');
  console.log('');
  console.log('Share-confidence rule of thumb (combine the edge count with the cell):');
  console.log('  • Cell ROI ≥ +50% AND WR ≥ 75%       → ELITE — top-tier share, consider unit bump');
  console.log('  • Cell ROI ≥ +15%                    → PROFITABLE — confident share');
  console.log('  • Cell N < 3 or ROI ∈ [−15%, +15%]   → UNKNOWN/THIN — wait or share with caveat');
  console.log('  • Cell ROI < −15%                    → BLEEDER — SHADOW only, regardless of edge count');
  process.exit(0);
})();
