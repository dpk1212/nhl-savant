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
  return tierPts + regimePts + marginPts + qForPts + concPenalty + starPts + eliteBonus;
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
  // edge count for the leftmost column
  m.edges = Object.values(m).filter(v => v === '★').length;
  m.warns = Object.values(m).filter(v => v === '!').length;
  return m;
}

async function loadToday() {
  const rows = [];
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
  console.log(`\n=== Today's Locked Picks ranked by V8.1 + live-edge markers (${today}) ===\n`);
  if (!rows.length) {
    console.log('No locked picks found for today.');
    process.exit(0);
  }

  // Header
  console.log(
    'RK | Edges | Tier       | Pick                                         | ★   | u    | Odds   | mgn   | Δctrb  | maxRoi | meanB  | Regime        | Top% | PromotedBy'
  );
  console.log('-'.repeat(185));

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
    const regime = `${r.regime || '—'}${mk.regime}`.padEnd(13);
    const top = r.topShare != null ? (r.topShare * 100).toFixed(0) + '%' : '—';
    const prom = r.promotedBy ?? '—';

    console.log(
      `${String(i + 1).padStart(2)} | ${edgesCol} | ${tier} | ${pick} | ${String(r.stars).padEnd(3)} | ${String(r.units).padEnd(4)} | ${(r.odds >= 0 ? '+' : '') + r.odds}`.padEnd(104) +
        `| ${mgn.padEnd(5)} | ${dctrb} | ${maxRoi} | ${meanB} | ${regime} | ${top.padEnd(4)} | ${prom}`
    );
  });

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

  console.log('\nLegend — Edges column counts ★ markers below (higher = more confirmed-live edges stacked):');
  console.log('  ★ Tier       = contribTier = STRONG  (game-level V8.1 sweet spot)');
  console.log('  ★ mgn        = contribMargin = +1    (§6a: +42% flat ROI, 3/3 positive days)');
  console.log('  ★ Δctrb      = Σfor − Σag ∈ (50, 100]  (§6a: +71.8% flat ROI, 2/2 positive days)');
  console.log('  ★ maxRoi     = maxRoiN_F ≥ 70        (§6a: +30.7% flat ROI, 3/3 positive days)');
  console.log('  ★ meanB      = meanBase_F ≥ 55       (§6a: +33.9% flat ROI, 3/3 positive days; live V8.3 bonus)');
  console.log('  ★ Regime     = CLEAR_MOVE            (live V8.2 +0.5u bonus; +30% flat ROI)');
  console.log('');
  console.log('  ! mgn        = contribMargin = 0     (bleeder — confirmed losing sample)');
  console.log('  ! Δctrb      = Σfor − Σag ∈ (0, 50]  (§6a: 3/3 losing days, -80% flat)');
  console.log('  ! maxRoi / meanB = ≥ threshold above is ★; < 50 on meanBase_F earns !');
  console.log('  ! Regime     = NO_MOVE');
  console.log('  ! Tier       = LEAN');
  console.log('');
  console.log('  Rows are sorted by (Edges ★ count DESC, Warns ! count ASC, raw V8 score DESC).');
  console.log('  "Top%" column is concentration — lower = broader wallet agreement.');
  console.log('');
  console.log('Share-confidence rule of thumb:');
  console.log('  • 4+ edges, 0 warns → top-tier shareable lock / unit-bumped pick');
  console.log('  • 3 edges, 0 warns → confident share');
  console.log('  • 2 edges with STRONG or CLEAR_MOVE → standard share');
  console.log('  • Any row with warns ≥ 2 → consider SHADOW only regardless of edges');
  process.exit(0);
})();
