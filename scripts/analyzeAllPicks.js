/**
 * CBB Performance Analysis — Comprehensive Tracker
 *
 * Tracks all system signals across SPREADS and TOTALS:
 *
 * SPREADS (90/10 DR/HS blend):
 *   - MOS tier breakdown (MAXIMUM→BASE, 5→1u)
 *   - Both models cover vs single model
 *   - Line movement: FOR / NEUTRAL / AGAINST
 *   - Fav vs Dog
 *
 * TOTALS (20/80 DR/HS blend):
 *   - MOT tier breakdown (MAXIMUM→MARKET_CONFIRMED, 5→1u)
 *   - Direction: OVER vs UNDER
 *   - Model agreement vs disagreement
 *   - Line movement: FOR / NEUTRAL / AGAINST
 *
 * Run daily via GitHub Actions or manually.
 */

import 'dotenv/config';
import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      project_id: process.env.VITE_FIREBASE_PROJECT_ID,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

function getETDate(offset = 0) {
  const now = new Date();
  const et = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  et.setDate(et.getDate() + offset);
  return `${et.getFullYear()}-${String(et.getMonth() + 1).padStart(2, '0')}-${String(et.getDate()).padStart(2, '0')}`;
}

function getMonday() {
  const now = new Date();
  const et = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const day = et.getDay();
  const diff = et.getDate() - day + (day === 0 ? -6 : 1);
  et.setDate(diff);
  return `${et.getFullYear()}-${String(et.getMonth() + 1).padStart(2, '0')}-${String(et.getDate()).padStart(2, '0')}`;
}

function calcStats(bets) {
  if (!bets.length) return null;
  const w = bets.filter(b => b.won).length;
  const l = bets.length - w;
  const u = bets.reduce((s, b) => s + b.units, 0);
  const p = bets.reduce((s, b) => s + b.profit, 0);
  const roi = u > 0 ? (p / u * 100) : 0;
  return { w, l, n: w + l, pct: w / (w + l) * 100, units: u, profit: p, roi };
}

function fmtRow(label, stats) {
  if (!stats) {
    console.log(`  ${label.padEnd(32)}│  --`);
    return;
  }
  const icon = stats.roi >= 5 ? '🟢' : stats.roi >= 0 ? '🟡' : '🔴';
  const record = `${stats.w}-${stats.l}`;
  console.log(
    `  ${icon} ${label.padEnd(30)}│ ${String(stats.n).padStart(4)} │ ` +
    `${record.padStart(7)} │ ${stats.pct.toFixed(1).padStart(5)}% │ ` +
    `${stats.units.toFixed(0).padStart(5)}u │ ` +
    `${(stats.profit >= 0 ? '+' : '') + stats.profit.toFixed(1) + 'u'}${' '.repeat(Math.max(1, 8 - ((stats.profit >= 0 ? '+' : '') + stats.profit.toFixed(1) + 'u').length))}│ ` +
    `${(stats.roi >= 0 ? '+' : '') + stats.roi.toFixed(1)}%`
  );
}

function printHeader(label) {
  console.log(`\n  ─── ${label} ${'─'.repeat(Math.max(1, 88 - label.length))}`);
  console.log('  Segment                         │ Bets │  Record │ Cover% │ Units │ Profit  │ ROI');
  console.log('  ' + '─'.repeat(96));
}

// ─── MAIN ─────────────────────────────────────────────────────────────

async function analyze() {
  const today = getETDate(0);
  const yesterday = getETDate(-1);
  const monday = getMonday();

  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                    CBB PERFORMANCE ANALYSIS — Full System Tracker                               ║');
  console.log('╠═══════════════════════════════════════════════════════════════════════════════════════════════════╣');
  console.log('║  SPREADS: 90/10 DR/HS blend │ Both models must cover │ Kill if line moves ≥0.5 against         ║');
  console.log('║  TOTALS:  20/80 DR/HS blend │ No agreement required  │ MOT floor 1.5 (1.0 w/ confirm)         ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝');
  console.log(`\n  Today: ${today} | Yesterday: ${yesterday} | Week start: ${monday}\n`);

  const snap = await db.collection('basketball_bets').where('status', '==', 'COMPLETED').get();

  const spreads = [];
  const totals = [];

  for (const docSnap of snap.docs) {
    const d = docSnap.data();
    const result = d.result?.outcome;
    if (!result || result === 'PENDING') continue;

    const won = result === 'WIN';
    const date = d.date || '';
    const market = d.bet?.market || d.betType || 'UNKNOWN';

    if (market === 'SPREAD' || market === 'ATS') {
      const mos = d.spreadAnalysis?.marginOverSpread ?? d.bet?.mos ?? null;
      const bothCover = d.spreadAnalysis?.bothModelsCover ?? false;
      const spread = d.spreadAnalysis?.spread ?? d.bet?.spread ?? null;
      const isFavorite = d.spreadAnalysis?.isFavorite ?? (spread !== null ? spread < 0 : null);
      const movementTier = d.spreadAnalysis?.movementTier ?? d.betRecommendation?.movementTier ?? 'UNKNOWN';
      const lineMovement = d.spreadAnalysis?.lineMovement ?? d.betRecommendation?.lineMovement ?? null;

      const units = d.bet?.units ?? d.prediction?.unitSize ?? 1;
      const profit = won ? units * (100 / 110) : -units;

      spreads.push({
        date, mos: mos || 0, won, units, profit,
        isFavorite, bothCover, movementTier, lineMovement,
        hasMOS: mos !== null,
        id: docSnap.id,
      });
    } else if (market === 'TOTAL' || market === 'TOTALS') {
      const mot = d.totalsAnalysis?.marginOverTotal ?? d.betRecommendation?.marginOverTotal ?? null;
      const direction = d.bet?.direction ?? d.totalsAnalysis?.direction ?? 'UNKNOWN';
      const drTotal = d.prediction?.dratingsAwayScore != null && d.prediction?.dratingsHomeScore != null
        ? d.prediction.dratingsAwayScore + d.prediction.dratingsHomeScore : null;
      const hsTotal = d.prediction?.haslametricsAwayScore != null && d.prediction?.haslametricsHomeScore != null
        ? d.prediction.haslametricsAwayScore + d.prediction.haslametricsHomeScore : null;
      const marketTotal = d.bet?.total ?? d.totalsAnalysis?.marketTotal ?? null;

      let modelsAgree = null;
      if (drTotal != null && hsTotal != null && marketTotal != null) {
        const drOver = drTotal > marketTotal;
        const hsOver = hsTotal > marketTotal;
        modelsAgree = (drOver && hsOver) || (!drOver && !hsOver);
      }

      const movementTier = d.totalsAnalysis?.movementTier ?? d.betRecommendation?.movementTier ?? 'UNKNOWN';
      const lineMovement = d.totalsAnalysis?.lineMovement ?? d.betRecommendation?.lineMovement ?? null;

      const units = d.bet?.units ?? d.prediction?.unitSize ?? 1;
      const profit = won ? units * (100 / 110) : -units;

      let retroBlendDir = null;
      if (drTotal != null && hsTotal != null && marketTotal != null) {
        const blend2080 = (drTotal * 0.20) + (hsTotal * 0.80);
        retroBlendDir = blend2080 > marketTotal ? 'OVER' : 'UNDER';
      }

      totals.push({
        date, mot: mot || 0, won, units, profit,
        direction, modelsAgree, movementTier, lineMovement,
        drTotal, hsTotal, marketTotal, retroBlendDir,
        hasMOT: mot !== null,
        id: docSnap.id,
      });
    }
  }

  console.log(`  Loaded: ${spreads.length} spread bets, ${totals.length} totals bets\n`);

  // ═══════════════════════════════════════════════════════════════════════
  //  SPREADS ANALYSIS
  // ═══════════════════════════════════════════════════════════════════════

  const periods = [
    { label: 'ALL TIME', sfn: () => true },
    { label: 'THIS WEEK', sfn: b => b.date >= monday },
    { label: 'YESTERDAY', sfn: b => b.date === yesterday },
  ];

  for (const period of periods) {
    const sBets = spreads.filter(period.sfn);
    if (!sBets.length) continue;

    console.log('\n' + '═'.repeat(105));
    console.log(`  SPREADS — ${period.label} (${sBets.length} bets)`);
    console.log('═'.repeat(105));

    const overall = calcStats(sBets);
    console.log(`\n  OVERALL: ${overall.w}-${overall.l} (${overall.pct.toFixed(1)}%) | ` +
      `${overall.units.toFixed(0)}u risked | ${overall.profit >= 0 ? '+' : ''}${overall.profit.toFixed(1)}u | ` +
      `${overall.roi >= 0 ? '+' : ''}${overall.roi.toFixed(1)}% ROI`);

    // MOS tier breakdown
    printHeader('MOS TIER BREAKDOWN');
    const MOS_TIERS = [
      { name: 'MAXIMUM (5u) MOS 4+',      fn: b => b.mos >= 4 },
      { name: 'ELITE (4u)   MOS 3-4',     fn: b => b.mos >= 3 && b.mos < 4 },
      { name: 'STRONG (3u)  MOS 2.5-3',   fn: b => b.mos >= 2.5 && b.mos < 3 },
      { name: 'SOLID (2u)   MOS 2.25-2.5', fn: b => b.mos >= 2.25 && b.mos < 2.5 },
      { name: 'BASE (1u)    MOS 2-2.25',  fn: b => b.mos >= 2 && b.mos < 2.25 },
    ];
    for (const t of MOS_TIERS) fmtRow(t.name, calcStats(sBets.filter(t.fn)));

    const belowFloor = sBets.filter(b => b.mos > 0 && b.mos < 2);
    if (belowFloor.length) fmtRow('(below floor) MOS <2', calcStats(belowFloor));

    // Both models cover
    printHeader('MODEL AGREEMENT (bothCover)');
    fmtRow('Both models cover', calcStats(sBets.filter(b => b.bothCover)));
    fmtRow('Single model only', calcStats(sBets.filter(b => !b.bothCover)));

    // Line movement
    printHeader('LINE MOVEMENT');
    fmtRow('Line moved FOR us', calcStats(sBets.filter(b => b.lineMovement != null && b.lineMovement > 0)));
    fmtRow('Line FLAT', calcStats(sBets.filter(b => b.lineMovement === 0)));
    fmtRow('Line moved AGAINST', calcStats(sBets.filter(b => b.lineMovement != null && b.lineMovement < 0)));
    fmtRow('Movement unknown', calcStats(sBets.filter(b => b.lineMovement == null)));

    // Fav vs Dog
    printHeader('FAVORITE vs UNDERDOG');
    fmtRow('FAVORITES', calcStats(sBets.filter(b => b.isFavorite === true)));
    fmtRow('UNDERDOGS', calcStats(sBets.filter(b => b.isFavorite === false)));

    // Composite: both cover + line movement
    printHeader('COMPOSITE: Both Cover + Line Movement');
    fmtRow('Both cover + line FOR', calcStats(sBets.filter(b => b.bothCover && b.lineMovement > 0)));
    fmtRow('Both cover + line FLAT', calcStats(sBets.filter(b => b.bothCover && b.lineMovement === 0)));
    fmtRow('Both cover + line AGAINST', calcStats(sBets.filter(b => b.bothCover && b.lineMovement != null && b.lineMovement < 0)));
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  TOTALS ANALYSIS
  // ═══════════════════════════════════════════════════════════════════════

  for (const period of periods) {
    const tBets = totals.filter(period.sfn);
    if (!tBets.length) continue;

    console.log('\n' + '═'.repeat(105));
    console.log(`  TOTALS — ${period.label} (${tBets.length} bets)`);
    console.log('═'.repeat(105));

    const overall = calcStats(tBets);
    console.log(`\n  OVERALL: ${overall.w}-${overall.l} (${overall.pct.toFixed(1)}%) | ` +
      `${overall.units.toFixed(0)}u risked | ${overall.profit >= 0 ? '+' : ''}${overall.profit.toFixed(1)}u | ` +
      `${overall.roi >= 0 ? '+' : ''}${overall.roi.toFixed(1)}% ROI`);

    // Direction
    printHeader('DIRECTION');
    fmtRow('OVER bets', calcStats(tBets.filter(b => b.direction === 'OVER')));
    fmtRow('UNDER bets', calcStats(tBets.filter(b => b.direction === 'UNDER')));

    // MOT tier breakdown
    printHeader('MOT TIER BREAKDOWN');
    const MOT_TIERS = [
      { name: 'MAXIMUM (5u) MOT 5+',      fn: b => b.mot >= 5 },
      { name: 'ELITE (4u)   MOT 4-5',     fn: b => b.mot >= 4 && b.mot < 5 },
      { name: 'STRONG (3u)  MOT 3-4',     fn: b => b.mot >= 3 && b.mot < 4 },
      { name: 'SOLID (2u)   MOT 2.5-3',   fn: b => b.mot >= 2.5 && b.mot < 3 },
      { name: 'BASE (1u)    MOT 2-2.5',   fn: b => b.mot >= 2 && b.mot < 2.5 },
      { name: 'MKT_CONF     MOT 1.5-2',   fn: b => b.mot >= 1.5 && b.mot < 2 },
    ];
    for (const t of MOT_TIERS) fmtRow(t.name, calcStats(tBets.filter(t.fn)));

    const belowFloor = tBets.filter(b => b.mot > 0 && b.mot < 1.5);
    if (belowFloor.length) fmtRow('(below floor) MOT <1.5', calcStats(belowFloor));

    // Model agreement
    printHeader('MODEL AGREEMENT (DR vs HS direction)');
    fmtRow('Both agree on direction', calcStats(tBets.filter(b => b.modelsAgree === true)));
    fmtRow('Models DISAGREE', calcStats(tBets.filter(b => b.modelsAgree === false)));
    fmtRow('Agreement unknown', calcStats(tBets.filter(b => b.modelsAgree == null)));

    // Line movement
    printHeader('LINE MOVEMENT');
    fmtRow('Line moved FOR us', calcStats(tBets.filter(b => b.lineMovement != null && b.lineMovement > 0)));
    fmtRow('Line FLAT', calcStats(tBets.filter(b => b.lineMovement === 0)));
    fmtRow('Line moved AGAINST', calcStats(tBets.filter(b => b.lineMovement != null && b.lineMovement < 0)));
    fmtRow('Movement unknown', calcStats(tBets.filter(b => b.lineMovement == null)));

    // Retro 20/80 blend analysis
    const withRetro = tBets.filter(b => b.retroBlendDir != null);
    if (withRetro.length) {
      printHeader('20/80 BLEND RETRO ANALYSIS');
      const wouldFlip = withRetro.filter(b => b.retroBlendDir !== b.direction);
      const sameDir = withRetro.filter(b => b.retroBlendDir === b.direction);
      fmtRow('20/80 agrees with bet', calcStats(sameDir));
      fmtRow('20/80 would have FLIPPED', calcStats(wouldFlip));

      if (wouldFlip.length) {
        const flipWins = wouldFlip.filter(b => !b.won).length;
        const flipLosses = wouldFlip.filter(b => b.won).length;
        console.log(`\n  → ${wouldFlip.length} bets would flip: ${flipWins} would become WINS, ${flipLosses} would become LOSSES`);
      }
    }

    // Composite: direction + agreement
    printHeader('COMPOSITE: Direction + Agreement');
    fmtRow('OVER + models agree', calcStats(tBets.filter(b => b.direction === 'OVER' && b.modelsAgree === true)));
    fmtRow('OVER + models disagree', calcStats(tBets.filter(b => b.direction === 'OVER' && b.modelsAgree === false)));
    fmtRow('UNDER + models agree', calcStats(tBets.filter(b => b.direction === 'UNDER' && b.modelsAgree === true)));
    fmtRow('UNDER + models disagree', calcStats(tBets.filter(b => b.direction === 'UNDER' && b.modelsAgree === false)));
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  COMBINED DAILY TREND
  // ═══════════════════════════════════════════════════════════════════════

  console.log('\n' + '═'.repeat(105));
  console.log('  DAILY TREND (Last 7 Days)');
  console.log('═'.repeat(105));
  console.log();
  console.log('  Date          Spread             Totals             Combined');
  console.log('                W-L   %    P/L     W-L   %    P/L     W-L   %    P/L');
  console.log('  ' + '─'.repeat(85));

  for (let i = 1; i <= 7; i++) {
    const d = getETDate(-i);
    const dayS = spreads.filter(b => b.date === d);
    const dayT = totals.filter(b => b.date === d);
    if (!dayS.length && !dayT.length) continue;

    const sStats = calcStats(dayS);
    const tStats = calcStats(dayT);
    const allDay = [...dayS, ...dayT];
    const cStats = calcStats(allDay);

    const fmtSeg = (s) => {
      if (!s) return '  --   --   --  ';
      const rec = `${s.w}-${s.l}`;
      return `${rec.padStart(5)} ${s.pct.toFixed(0).padStart(3)}% ${(s.profit >= 0 ? '+' : '') + s.profit.toFixed(1) + 'u'}`.padEnd(20);
    };

    const icon = cStats && cStats.roi >= 0 ? '🟢' : '🔴';
    console.log(`  ${icon} ${d}    ${fmtSeg(sStats)}${fmtSeg(tStats)}${fmtSeg(cStats)}`);
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  SYSTEM CONFIGURATION SNAPSHOT
  // ═══════════════════════════════════════════════════════════════════════

  console.log('\n' + '═'.repeat(105));
  console.log('  CURRENT SYSTEM CONFIGURATION');
  console.log('═'.repeat(105));
  console.log('');
  console.log('  SPREADS:');
  console.log('    Blend:          90% DRatings / 10% Haslametrics');
  console.log('    Agreement:      Both models must cover (bothCover required)');
  console.log('    MOS Floor:      2.0 standard / 1.5 with market confirm');
  console.log('    Movement Gate:  Kill if line moves ≥0.5 AGAINST');
  console.log('    Sizing:         MOS-tiered (1-5u)');
  console.log('');
  console.log('  TOTALS:');
  console.log('    Blend:          20% DRatings / 80% Haslametrics');
  console.log('    Agreement:      Not required (blend handles direction)');
  console.log('    MOT Floor:      1.5 standard / 1.0 with market confirm');
  console.log('    Movement Gate:  Kill if FLAGGED');
  console.log('    Sizing:         MOT-tiered (1-5u)');
  console.log('');
  console.log('  RATIONALE:');
  console.log('    - HS has 57.5% directional accuracy on totals vs DR 45%');
  console.log('    - DR has systematic +1.67pt OVER bias on totals');
  console.log('    - 20/80 blend achieved 64.7% WR on historical totals bets');
  console.log('    - Model disagreement at 20/80 is actually MORE accurate (78.3%)');
  console.log('    - Line movement is non-predictive for totals');

  console.log('\n' + '═'.repeat(105));
  console.log('  ANALYSIS COMPLETE');
  console.log('═'.repeat(105) + '\n');

  process.exit(0);
}

analyze().catch(err => {
  console.error('Analysis failed:', err.message);
  process.exit(1);
});
