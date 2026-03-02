/**
 * CBB Edge Health Monitor
 *
 * Daily health check: Is our edge still alive, shifting, or dying?
 * Tracks rolling windows (7d, 14d, 30d, all-time) for every
 * statistical assumption the system is built on.
 *
 * EDGE ASSUMPTIONS MONITORED:
 *   1. DR has systematic OVER bias (~+1.67 pts on totals)
 *   2. HS has 57.5% directional accuracy on totals
 *   3. 20/80 DR/HS blend outperforms 90/10 for totals
 *   4. DR UNDER sweet spot (-5 to -8 vs opener) is 85%+ accurate
 *   5. Lower MOT = higher accuracy (inverse relationship)
 *   6. BothCover filter adds edge for spreads
 *   7. Line movement kill filter saves money on spreads
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

// ─── DATE HELPERS ────────────────────────────────────────────────────

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

// ─── STATS HELPERS ───────────────────────────────────────────────────

function calcStats(bets) {
  if (!bets.length) return null;
  const w = bets.filter(b => b.won).length;
  const l = bets.length - w;
  const u = bets.reduce((s, b) => s + b.units, 0);
  const p = bets.reduce((s, b) => s + b.profit, 0);
  const roi = u > 0 ? (p / u * 100) : 0;
  return { w, l, n: w + l, pct: w / (w + l) * 100, units: u, profit: p, roi };
}

function avg(arr) {
  return arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : null;
}

function medianVal(arr) {
  if (!arr.length) return null;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function maeVal(arr) {
  return arr.length ? arr.reduce((s, v) => s + Math.abs(v), 0) / arr.length : null;
}

function rmseVal(arr) {
  return arr.length ? Math.sqrt(arr.reduce((s, v) => s + v * v, 0) / arr.length) : null;
}

// ─── VISUALIZATION HELPERS ───────────────────────────────────────────

function printHistogram(title, buckets, maxWidth = 35) {
  console.log(`\n  ${title}`);
  const maxCount = Math.max(...buckets.map(b => b.count), 1);
  for (const b of buckets) {
    const barLen = Math.round((b.count / maxCount) * maxWidth);
    const bar = '█'.repeat(barLen);
    const suffix = b.annotation ? `  ${b.annotation}` : '';
    console.log(`  ${b.label.padStart(10)} │${bar} ${b.count}${suffix}`);
  }
}

function printMatrix(title, rowDefs, colDefs, allBets) {
  console.log(`\n  ${title}`);
  const colW = 14;
  const rowW = 24;
  let hdr = ' '.repeat(rowW) + '│';
  for (const c of colDefs) hdr += c.label.padStart(colW) + '│';
  console.log(`  ${hdr}`);
  console.log(`  ${'─'.repeat(rowW)}┼${colDefs.map(() => '─'.repeat(colW)).join('┼')}┼`);

  for (const r of rowDefs) {
    const rBets = allBets.filter(r.fn);
    let row = `  ${r.label.padEnd(rowW)}│`;
    for (const c of colDefs) {
      const cell = rBets.filter(c.fn);
      if (!cell.length) {
        row += '--'.padStart(colW) + '│';
      } else {
        const wins = cell.filter(b => b.won).length;
        const pct = (wins / cell.length * 100).toFixed(0);
        row += `${pct}% (${cell.length})`.padStart(colW) + '│';
      }
    }
    console.log(row);
  }
}

function getTrend(shortVal, longVal, alertLow, alertHigh) {
  if (shortVal == null || longVal == null) return '  --    ';
  if (alertLow != null && shortVal <= alertLow) return '⚠ ALERT ';
  if (alertHigh != null && shortVal >= alertHigh) return '⚠ ALERT ';
  const diff = shortVal - longVal;
  const base = Math.abs(longVal) || 1;
  const pctDiff = (diff / base) * 100;
  if (pctDiff > 15) return '↑ STRONG';
  if (pctDiff > 5) return '↑ UP    ';
  if (pctDiff < -15) return '↓ WEAK  ';
  if (pctDiff < -5) return '↓ DOWN  ';
  return '→ STABLE';
}

function fmtSigned(val, decimals = 1) {
  if (val == null) return '--';
  return `${val >= 0 ? '+' : ''}${val.toFixed(decimals)}`;
}

// ─── TABLE HELPERS ───────────────────────────────────────────────────

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

// ─── MAIN ────────────────────────────────────────────────────────────

async function analyze() {
  const today = getETDate(0);
  const yesterday = getETDate(-1);
  const monday = getMonday();
  const d7 = getETDate(-7);
  const d14 = getETDate(-14);
  const d30 = getETDate(-30);

  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                        CBB EDGE HEALTH MONITOR — Daily Signal Tracker                              ║');
  console.log('╠═══════════════════════════════════════════════════════════════════════════════════════════════════════╣');
  console.log('║  SPREADS: 90/10 DR/HS │ Both must cover │ Kill if line ≥0.5 against │ MOS-tiered sizing           ║');
  console.log('║  TOTALS:  20/80 DR/HS │ DR UNDER boost │ MOT cap outliers │ floor 0.5 │ MOT-tiered sizing        ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════════════════════════════════╝');
  console.log(`\n  Today: ${today} | Yesterday: ${yesterday} | Week: ${monday}`);
  console.log(`  Rolling: 7d (${d7}) | 14d (${d14}) | 30d (${d30})\n`);

  // ─── DATA QUERIES ──────────────────────────────────────────────────

  const [completedSnap, evalSnap] = await Promise.all([
    db.collection('basketball_bets').where('status', '==', 'COMPLETED').get(),
    db.collection('basketball_bets').where('type', '==', 'EVALUATION').get(),
  ]);

  // ─── PROCESS COMPLETED BETS ────────────────────────────────────────

  const spreads = [];
  const totals = [];

  for (const docSnap of completedSnap.docs) {
    const d = docSnap.data();
    const result = d.result?.outcome;
    if (!result || result === 'PENDING') continue;

    const won = result === 'WIN';
    const date = d.date || '';
    const market = d.bet?.market || d.betType || 'UNKNOWN';

    const actualAway = d.result?.awayScore ?? null;
    const actualHome = d.result?.homeScore ?? null;
    const actualTotal = d.result?.totalScore ?? (actualAway != null && actualHome != null ? actualAway + actualHome : null);

    const drAway = d.prediction?.dratingsAwayScore ?? null;
    const drHome = d.prediction?.dratingsHomeScore ?? null;
    const hsAway = d.prediction?.haslametricsAwayScore ?? null;
    const hsHome = d.prediction?.haslametricsHomeScore ?? null;
    const drPredTotal = drAway != null && drHome != null ? drAway + drHome : null;
    const hsPredTotal = hsAway != null && hsHome != null ? hsAway + hsHome : null;

    if (market === 'SPREAD' || market === 'ATS') {
      const mos = d.spreadAnalysis?.marginOverSpread ?? d.bet?.mos ?? null;
      const bothCover = d.spreadAnalysis?.bothModelsCover ?? false;
      const spread = d.spreadAnalysis?.spread ?? d.bet?.spread ?? null;
      const openerSpread = d.spreadAnalysis?.openerSpread ?? null;
      const isFavorite = d.spreadAnalysis?.isFavorite ?? (spread !== null ? spread < 0 : null);
      const movementTier = d.spreadAnalysis?.movementTier ?? d.betRecommendation?.movementTier ?? 'UNKNOWN';
      const lineMovement = d.spreadAnalysis?.lineMovement ?? d.betRecommendation?.lineMovement ?? null;

      const units = d.bet?.units ?? d.prediction?.unitSize ?? 1;
      const profit = won ? units * (100 / 110) : -units;

      spreads.push({
        date, mos: mos || 0, won, units, profit,
        isFavorite, bothCover, movementTier, lineMovement,
        spread, openerSpread,
        drPredTotal, hsPredTotal, actualTotal,
        hasMOS: mos !== null,
        id: docSnap.id,
      });
    } else if (market === 'TOTAL' || market === 'TOTALS') {
      const mot = d.totalsAnalysis?.marginOverTotal ?? d.betRecommendation?.marginOverTotal ?? null;
      const direction = d.bet?.direction ?? d.totalsAnalysis?.direction ?? 'UNKNOWN';
      const drTotal = drPredTotal;
      const hsTotal = hsPredTotal;
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

      const openerTotal = d.totalsAnalysis?.openerTotal ?? d.betRecommendation?.openerTotal ?? null;

      let retroBlendDir = null;
      let blend9010Dir = null;
      if (drTotal != null && hsTotal != null && marketTotal != null) {
        retroBlendDir = ((drTotal * 0.20) + (hsTotal * 0.80)) > marketTotal ? 'OVER' : 'UNDER';
        blend9010Dir = ((drTotal * 0.90) + (hsTotal * 0.10)) > marketTotal ? 'OVER' : 'UNDER';
      }

      let drMarginVsOpener = null;
      let drSignal = null;
      if (drTotal != null && openerTotal != null) {
        drMarginVsOpener = drTotal - openerTotal;
        if (drMarginVsOpener <= -5 && drMarginVsOpener > -8) drSignal = 'DR_SWEET_SPOT';
        else if (drMarginVsOpener <= -3 && drMarginVsOpener > -5) drSignal = 'DR_UNDER';
        else if (drMarginVsOpener < 0) drSignal = 'DR_SLIGHT_UNDER';
      }

      let drDirCorrect = null;
      let hsDirCorrect = null;
      if (drTotal != null && marketTotal != null && actualTotal != null) {
        const drPredDir = drTotal > marketTotal ? 'OVER' : 'UNDER';
        const actualDir = actualTotal > marketTotal ? 'OVER' : 'UNDER';
        drDirCorrect = drPredDir === actualDir;
      }
      if (hsTotal != null && marketTotal != null && actualTotal != null) {
        const hsPredDir = hsTotal > marketTotal ? 'OVER' : 'UNDER';
        const actualDir = actualTotal > marketTotal ? 'OVER' : 'UNDER';
        hsDirCorrect = hsPredDir === actualDir;
      }

      const drTotalError = drTotal != null && actualTotal != null ? drTotal - actualTotal : null;
      const hsTotalError = hsTotal != null && actualTotal != null ? hsTotal - actualTotal : null;

      totals.push({
        date, mot: mot || 0, won, units, profit,
        direction, modelsAgree, movementTier, lineMovement,
        drTotal, hsTotal, marketTotal, openerTotal,
        retroBlendDir, blend9010Dir,
        drMarginVsOpener, drSignal,
        drDirCorrect, hsDirCorrect,
        drTotalError, hsTotalError,
        actualTotal,
        hasMOT: mot !== null,
        id: docSnap.id,
      });
    }
  }

  // ─── PROCESS EVALUATIONS (for bet funnel) ──────────────────────────

  const evaluations = [];
  for (const docSnap of evalSnap.docs) {
    const d = docSnap.data();
    if (d.type !== 'EVALUATION') continue;

    const date = d.date || '';
    const md = d.modelData || {};
    const op = d.openers || {};

    const awayOpener = op.awayOpener ?? op.awaySpread ?? null;
    const homeOpener = op.homeOpener ?? op.homeSpread ?? null;
    const openerTotal = op.openerTotal ?? op.total ?? null;

    const drRawMargin = md.drRawMargin ?? null;
    const hsRawMargin = md.hsRawMargin ?? null;
    const blendedMargin = md.blendedMargin ?? null;
    const drTotal = md.drTotal ?? null;
    const hsTotal = md.hsTotal ?? null;

    let bestMOS = null;
    let bestBothCover = false;
    let hasSpreadData = false;

    if (blendedMargin != null && awayOpener != null) {
      hasSpreadData = true;
      const awayEval = awayOpener;
      const awayMOS = blendedMargin - (-awayEval);
      const awayDrCovers = drRawMargin != null ? drRawMargin > -awayEval : false;
      const awayHsCovers = hsRawMargin != null ? hsRawMargin > -awayEval : false;

      bestMOS = awayMOS;
      bestBothCover = awayDrCovers && awayHsCovers;

      if (homeOpener != null) {
        const homeMOS = (-blendedMargin) - (-homeOpener);
        const homeDrCovers = drRawMargin != null ? (-drRawMargin) > -homeOpener : false;
        const homeHsCovers = hsRawMargin != null ? (-hsRawMargin) > -homeOpener : false;

        if (homeMOS > awayMOS) {
          bestMOS = homeMOS;
          bestBothCover = homeDrCovers && homeHsCovers;
        }
      }
    }

    let mot = null;
    let totDir = null;
    let hasTotalsData = false;

    if (drTotal != null && hsTotal != null && openerTotal != null) {
      hasTotalsData = true;
      const blendedTotal = (drTotal * 0.20) + (hsTotal * 0.80);
      mot = Math.abs(blendedTotal - openerTotal);
      totDir = blendedTotal > openerTotal ? 'OVER' : 'UNDER';
    }

    evaluations.push({
      date, hasSpreadData, hasTotalsData,
      bestMOS, bestBothCover, mot, totDir,
    });
  }

  console.log(`  Loaded: ${spreads.length} spread bets | ${totals.length} totals bets | ${evaluations.length} game evaluations\n`);

  // ═══════════════════════════════════════════════════════════════════════
  //  EDGE VITALS — Rolling window tracker
  // ═══════════════════════════════════════════════════════════════════════

  console.log('═'.repeat(105));
  console.log('  ╔══════════════════════════════════════════════════════════════════════════════════════════════╗');
  console.log('  ║                                    EDGE VITALS                                             ║');
  console.log('  ║              Is our edge ALIVE, SHIFTING, or DYING? Rolling window tracker.                ║');
  console.log('  ╚══════════════════════════════════════════════════════════════════════════════════════════════╝');
  console.log('═'.repeat(105));

  const windows = [
    { label: '7d', fn: b => b.date >= d7 },
    { label: '14d', fn: b => b.date >= d14 },
    { label: '30d', fn: b => b.date >= d30 },
    { label: 'All', fn: () => true },
  ];

  function computeVital(bets, metricFn) {
    return windows.map(w => metricFn(bets.filter(w.fn)));
  }

  const drBiasVals = computeVital(totals, bets => {
    const errs = bets.filter(b => b.drTotalError != null).map(b => b.drTotalError);
    return errs.length >= 3 ? avg(errs) : null;
  });

  const hsDirAccVals = computeVital(totals, bets => {
    const w = bets.filter(b => b.hsDirCorrect != null);
    return w.length >= 3 ? (w.filter(b => b.hsDirCorrect).length / w.length * 100) : null;
  });

  const drDirAccVals = computeVital(totals, bets => {
    const w = bets.filter(b => b.drDirCorrect != null);
    return w.length >= 3 ? (w.filter(b => b.drDirCorrect).length / w.length * 100) : null;
  });

  const blendWinVals = computeVital(totals, bets => {
    return bets.length >= 3 ? (bets.filter(b => b.won).length / bets.length * 100) : null;
  });

  const drSweetVals = computeVital(totals, bets => {
    const s = bets.filter(b => b.drSignal === 'DR_SWEET_SPOT');
    return s.length >= 2 ? (s.filter(b => b.won).length / s.length * 100) : null;
  });

  const lowMOTVals = computeVital(totals, bets => {
    const lo = bets.filter(b => b.mot > 0 && b.mot < 1);
    return lo.length >= 3 ? (lo.filter(b => b.won).length / lo.length * 100) : null;
  });

  const bothCoverVals = computeVital(spreads, bets => {
    const bc = bets.filter(b => b.bothCover);
    return bc.length >= 3 ? (bc.filter(b => b.won).length / bc.length * 100) : null;
  });

  const lineKillVals = computeVital(spreads, bets => {
    const ag = bets.filter(b => b.lineMovement != null && b.lineMovement < 0);
    return ag.length >= 2 ? (ag.filter(b => b.won).length / ag.length * 100) : null;
  });

  const spreadWinVals = computeVital(spreads, bets => {
    return bets.length >= 3 ? (bets.filter(b => b.won).length / bets.length * 100) : null;
  });

  const vW = 12;
  console.log(`\n  ${'Signal'.padEnd(32)}│${'7d'.padStart(vW)}│${'14d'.padStart(vW)}│${'30d'.padStart(vW)}│${'All'.padStart(vW)}│ Trend`);
  console.log(`  ${'─'.repeat(32)}┼${'─'.repeat(vW)}┼${'─'.repeat(vW)}┼${'─'.repeat(vW)}┼${'─'.repeat(vW)}┼${'─'.repeat(10)}`);

  function printVital(name, vals, fmt, alertLow, alertHigh) {
    const cells = vals.map(v => v == null ? '--' : fmt(v));
    const trend = getTrend(vals[0], vals[3], alertLow, alertHigh);
    console.log(`  ${name.padEnd(32)}│${cells[0].padStart(vW)}│${cells[1].padStart(vW)}│${cells[2].padStart(vW)}│${cells[3].padStart(vW)}│ ${trend}`);
  }

  printVital('DR OVER Bias (avg error)', drBiasVals, v => fmtSigned(v), 0.5, 3.0);
  printVital('DR Direction Acc (totals)', drDirAccVals, v => `${v.toFixed(1)}%`, 45, null);
  printVital('HS Direction Acc (totals)', hsDirAccVals, v => `${v.toFixed(1)}%`, 52, null);
  printVital('20/80 Blend Win% (totals)', blendWinVals, v => `${v.toFixed(1)}%`, 55, null);
  printVital('DR UNDER Sweet Spot Acc', drSweetVals, v => `${v.toFixed(0)}%`, 60, null);
  printVital('Low MOT (<1) Accuracy', lowMOTVals, v => `${v.toFixed(1)}%`, 55, null);
  printVital('BothCover Spread Win%', bothCoverVals, v => `${v.toFixed(1)}%`, 50, null);
  printVital('Spread Overall Win%', spreadWinVals, v => `${v.toFixed(1)}%`, 50, null);
  printVital('Line AGAINST Win% (sprd)', lineKillVals, v => `${v.toFixed(0)}%`, null, 55);

  console.log(`\n  Legend: → STABLE | ↑ STRONG/UP (edge growing) | ↓ WEAK/DOWN (edge fading) | ⚠ ALERT (threshold breached)`);
  console.log(`  Thresholds: DR bias 0.5-3.0 | HS dir >52% | Blend >55% | Sweet >60% | MOT<1 >55% | BothCover >50%`);

  // ═══════════════════════════════════════════════════════════════════════
  //  PREDICTION ERROR & BIAS TRACKING
  // ═══════════════════════════════════════════════════════════════════════

  console.log('\n\n' + '═'.repeat(105));
  console.log('  PREDICTION ERROR & BIAS TRACKING');
  console.log('═'.repeat(105));

  const drTotErrors = totals.filter(b => b.drTotalError != null).map(b => b.drTotalError);
  const hsTotErrors = totals.filter(b => b.hsTotalError != null).map(b => b.hsTotalError);

  const allDRErrors = [...drTotErrors];
  const allHSErrors = [...hsTotErrors];
  for (const s of spreads) {
    if (s.drPredTotal != null && s.actualTotal != null) allDRErrors.push(s.drPredTotal - s.actualTotal);
    if (s.hsPredTotal != null && s.actualTotal != null) allHSErrors.push(s.hsPredTotal - s.actualTotal);
  }

  if (allDRErrors.length >= 5) {
    console.log(`\n  TOTAL SCORE PREDICTION ERROR (predicted - actual) — All completed bets (n=${allDRErrors.length})`);
    console.log(`  ${'Metric'.padEnd(22)}│${'DRatings'.padStart(12)}│${'Haslametrics'.padStart(14)}`);
    console.log(`  ${'─'.repeat(22)}┼${'─'.repeat(12)}┼${'─'.repeat(14)}`);
    console.log(`  ${'Mean Bias'.padEnd(22)}│${fmtSigned(avg(allDRErrors)).padStart(12)}│${fmtSigned(avg(allHSErrors)).padStart(14)}`);
    console.log(`  ${'Median'.padEnd(22)}│${fmtSigned(medianVal(allDRErrors)).padStart(12)}│${fmtSigned(medianVal(allHSErrors)).padStart(14)}`);
    console.log(`  ${'MAE'.padEnd(22)}│${maeVal(allDRErrors).toFixed(1).padStart(12)}│${maeVal(allHSErrors).toFixed(1).padStart(14)}`);
    console.log(`  ${'RMSE'.padEnd(22)}│${rmseVal(allDRErrors).toFixed(1).padStart(12)}│${rmseVal(allHSErrors).toFixed(1).padStart(14)}`);
    console.log(`  ${'Sample Size'.padEnd(22)}│${String(allDRErrors.length).padStart(12)}│${String(allHSErrors.length).padStart(14)}`);

    const drBias = avg(allDRErrors);
    const hsBias = avg(allHSErrors);
    console.log(`\n  Interpretation:`);
    console.log(`    DR: ${drBias > 0.5 ? 'OVER bias confirmed (' + fmtSigned(drBias) + ' pts avg)' : drBias < -0.5 ? 'UNDER bias (' + fmtSigned(drBias) + ' pts avg)' : 'Balanced (no significant bias)'}`);
    console.log(`    HS: ${hsBias > 0.5 ? 'OVER bias (' + fmtSigned(hsBias) + ' pts avg)' : hsBias < -0.5 ? 'UNDER bias (' + fmtSigned(hsBias) + ' pts avg)' : 'Balanced (no significant bias)'}`);

    function buildErrorBuckets(errors) {
      const buckets = [];
      const ranges = [
        { label: '≤-12', lo: -Infinity, hi: -12 },
        { label: '-12:-10', lo: -12, hi: -10 },
        { label: '-10:-8', lo: -10, hi: -8 },
        { label: '-8:-6', lo: -8, hi: -6 },
        { label: '-6:-4', lo: -6, hi: -4 },
        { label: '-4:-2', lo: -4, hi: -2 },
        { label: '-2:0', lo: -2, hi: 0 },
        { label: '0:+2', lo: 0, hi: 2 },
        { label: '+2:+4', lo: 2, hi: 4 },
        { label: '+4:+6', lo: 4, hi: 6 },
        { label: '+6:+8', lo: 6, hi: 8 },
        { label: '+8:+10', lo: 8, hi: 10 },
        { label: '+10:+12', lo: 10, hi: 12 },
        { label: '≥+12', lo: 12, hi: Infinity },
      ];
      for (const r of ranges) {
        const count = errors.filter(e => e >= r.lo && e < r.hi).length;
        if (count > 0) buckets.push({ label: r.label, count });
      }
      return buckets;
    }

    printHistogram('DR Error Distribution (predicted - actual)', buildErrorBuckets(allDRErrors));
    console.log(`  ${''.padStart(10)} Mean: ${fmtSigned(avg(allDRErrors))} pts`);

    printHistogram('HS Error Distribution (predicted - actual)', buildErrorBuckets(allHSErrors));
    console.log(`  ${''.padStart(10)} Mean: ${fmtSigned(avg(allHSErrors))} pts`);
  }

  if (drTotErrors.length >= 5) {
    const drDirBets = totals.filter(b => b.drDirCorrect != null);
    const hsDirBets = totals.filter(b => b.hsDirCorrect != null);
    if (drDirBets.length) {
      const drAcc = drDirBets.filter(b => b.drDirCorrect).length / drDirBets.length * 100;
      const hsAcc = hsDirBets.filter(b => b.hsDirCorrect).length / hsDirBets.length * 100;
      console.log(`\n  DIRECTIONAL ACCURACY — Totals (predicted O/U vs actual O/U)`);
      console.log(`    DR: ${drAcc.toFixed(1)}% (${drDirBets.filter(b => b.drDirCorrect).length}/${drDirBets.length})${drAcc < 50 ? ' ← worse than coin flip' : ''}`);
      console.log(`    HS: ${hsAcc.toFixed(1)}% (${hsDirBets.filter(b => b.hsDirCorrect).length}/${hsDirBets.length})${hsAcc > 55 ? ' ← edge' : ''}`);
      console.log(`    Gap: HS leads by ${(hsAcc - drAcc).toFixed(1)}pp`);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  TIER × LINE MOVEMENT MATRICES
  // ═══════════════════════════════════════════════════════════════════════

  console.log('\n\n' + '═'.repeat(105));
  console.log('  TIER × LINE MOVEMENT MATRICES');
  console.log('═'.repeat(105));

  const moveCols = [
    { label: 'FOR', fn: b => b.lineMovement != null && b.lineMovement > 0 },
    { label: 'FLAT/UNK', fn: b => b.lineMovement === 0 || b.lineMovement == null },
    { label: 'AGAINST', fn: b => b.lineMovement != null && b.lineMovement < 0 },
    { label: 'ALL', fn: () => true },
  ];

  if (spreads.length) {
    const mosTierRows = [
      { label: 'MAXIMUM (4+)', fn: b => b.mos >= 4 },
      { label: 'ELITE (3-4)', fn: b => b.mos >= 3 && b.mos < 4 },
      { label: 'STRONG (2.5-3)', fn: b => b.mos >= 2.5 && b.mos < 3 },
      { label: 'SOLID (2-2.5)', fn: b => b.mos >= 2 && b.mos < 2.5 },
      { label: 'Below Floor (<2)', fn: b => b.mos > 0 && b.mos < 2 },
    ];
    printMatrix('SPREAD: MOS TIER × LINE MOVEMENT (Win% / n)', mosTierRows, moveCols, spreads);
  }

  if (totals.length) {
    const motTierRows = [
      { label: 'MAXIMUM (5+)', fn: b => b.mot >= 5 },
      { label: 'ELITE (4-5)', fn: b => b.mot >= 4 && b.mot < 5 },
      { label: 'STRONG (3-4)', fn: b => b.mot >= 3 && b.mot < 4 },
      { label: 'SOLID (2-3)', fn: b => b.mot >= 2 && b.mot < 3 },
      { label: 'BASE (1-2)', fn: b => b.mot >= 1 && b.mot < 2 },
      { label: 'TIGHT (<1)', fn: b => b.mot > 0 && b.mot < 1 },
    ];
    printMatrix('TOTALS: MOT TIER × LINE MOVEMENT (Win% / n)', motTierRows, moveCols, totals);

    const drSigCols = [
      { label: 'SWEET(-5:-8)', fn: b => b.drSignal === 'DR_SWEET_SPOT' },
      { label: 'UNDER(-3:-5)', fn: b => b.drSignal === 'DR_UNDER' },
      { label: 'SLIGHT(<-3)', fn: b => b.drSignal === 'DR_SLIGHT_UNDER' },
      { label: 'OVER(bias)', fn: b => b.drMarginVsOpener != null && b.drMarginVsOpener >= 0 },
    ];
    const dirRows = [
      { label: 'OVER bets', fn: b => b.direction === 'OVER' },
      { label: 'UNDER bets', fn: b => b.direction === 'UNDER' },
      { label: 'ALL', fn: () => true },
    ];
    printMatrix('TOTALS: DIRECTION × DR CONTRARIAN SIGNAL (Win% / n)', dirRows, drSigCols, totals);
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  BET FUNNEL — Filter cascade
  // ═══════════════════════════════════════════════════════════════════════

  console.log('\n\n' + '═'.repeat(105));
  console.log('  BET FUNNEL — What gets filtered at each stage');
  console.log('═'.repeat(105));

  const funnelPeriods = [
    { label: 'Last 7 Days', fn: e => e.date >= d7, bfn: b => b.date >= d7 },
    { label: 'Last 14 Days', fn: e => e.date >= d14, bfn: b => b.date >= d14 },
    { label: 'All Time', fn: () => true, bfn: () => true },
  ];

  for (const fp of funnelPeriods) {
    const evals = evaluations.filter(fp.fn);
    if (!evals.length) continue;

    const spreadEvals = evals.filter(e => e.hasSpreadData);
    const totalsEvals = evals.filter(e => e.hasTotalsData);

    const spdMOSPass = spreadEvals.filter(e => e.bestMOS != null && e.bestMOS >= 2.0);
    const spdMOSConfirm = spreadEvals.filter(e => e.bestMOS != null && e.bestMOS >= 1.5 && e.bestMOS < 2.0);
    const spdBothPass = spdMOSPass.filter(e => e.bestBothCover);
    const spdSingle = spdMOSPass.filter(e => !e.bestBothCover);

    const totMOTPass = totalsEvals.filter(e => e.mot != null && e.mot >= 0.5);
    const totMOTFail = totalsEvals.filter(e => e.mot != null && e.mot < 0.5);

    const periodSpreads = spreads.filter(fp.bfn);
    const periodTotals = totals.filter(fp.bfn);

    console.log(`\n  ─── ${fp.label} ─────────────────────────────────────────────`);
    console.log(`  Total games evaluated:         ${String(evals.length).padStart(5)}`);
    console.log(`  ├─ SPREADS with odds:          ${String(spreadEvals.length).padStart(5)}  (${evals.length ? (spreadEvals.length / evals.length * 100).toFixed(0) : 0}%)`);
    console.log(`  │  ├─ MOS >= 2.0:              ${String(spdMOSPass.length).padStart(5)}  (${spreadEvals.length ? (spdMOSPass.length / spreadEvals.length * 100).toFixed(0) : 0}% of eligible)`);
    console.log(`  │  │  ├─ Both models cover:    ${String(spdBothPass.length).padStart(5)}  (${spdMOSPass.length ? (spdBothPass.length / spdMOSPass.length * 100).toFixed(0) : 0}% pass rate)`);
    console.log(`  │  │  │  └─ Actual spread bets:${String(periodSpreads.length).padStart(5)}`);
    console.log(`  │  │  └─ Single cover only:    ${String(spdSingle.length).padStart(5)}  ← filtered out`);
    console.log(`  │  ├─ MOS 1.5-2.0 (confirm):   ${String(spdMOSConfirm.length).padStart(4)}`);
    console.log(`  │  └─ MOS < 1.5 (no edge):     ${String(Math.max(0, spreadEvals.length - spdMOSPass.length - spdMOSConfirm.length)).padStart(4)}`);
    console.log(`  ├─ TOTALS with odds:           ${String(totalsEvals.length).padStart(5)}  (${evals.length ? (totalsEvals.length / evals.length * 100).toFixed(0) : 0}%)`);
    console.log(`  │  ├─ MOT >= 0.5:              ${String(totMOTPass.length).padStart(5)}  (${totalsEvals.length ? (totMOTPass.length / totalsEvals.length * 100).toFixed(0) : 0}% of eligible)`);
    console.log(`  │  │  └─ Actual totals bets:   ${String(periodTotals.length).padStart(5)}`);
    console.log(`  │  └─ MOT < 0.5 (no edge):     ${String(totMOTFail.length).padStart(5)}`);

    const spdSelectivity = evals.length > 0 ? (periodSpreads.length / evals.length * 100).toFixed(1) : '0';
    const totSelectivity = evals.length > 0 ? (periodTotals.length / evals.length * 100).toFixed(1) : '0';
    console.log(`  │`);
    console.log(`  └─ Selectivity: Spreads ${spdSelectivity}% | Totals ${totSelectivity}%`);
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  DISTRIBUTION HISTOGRAMS
  // ═══════════════════════════════════════════════════════════════════════

  console.log('\n\n' + '═'.repeat(105));
  console.log('  DISTRIBUTION HISTOGRAMS');
  console.log('═'.repeat(105));

  if (spreads.length) {
    const mosRanges = [
      { label: '0-1', lo: 0, hi: 1 }, { label: '1-2', lo: 1, hi: 2 },
      { label: '2-2.5', lo: 2, hi: 2.5 }, { label: '2.5-3', lo: 2.5, hi: 3 },
      { label: '3-4', lo: 3, hi: 4 }, { label: '4-5', lo: 4, hi: 5 },
      { label: '5+', lo: 5, hi: 999 },
    ];
    const mosBuckets = mosRanges.map(r => {
      const inRange = spreads.filter(b => b.mos >= r.lo && b.mos < r.hi);
      const wins = inRange.filter(b => b.won).length;
      return {
        label: r.label, count: inRange.length,
        annotation: inRange.length > 0 ? `(${wins}W ${inRange.length - wins}L = ${(wins / inRange.length * 100).toFixed(0)}%)` : '',
      };
    });
    printHistogram('MOS Distribution — Spread Bets (count + W/L)', mosBuckets);
  }

  if (totals.length) {
    const motRanges = [
      { label: '<0.5', lo: 0, hi: 0.5 }, { label: '0.5-1', lo: 0.5, hi: 1 },
      { label: '1-2', lo: 1, hi: 2 }, { label: '2-3', lo: 2, hi: 3 },
      { label: '3-4', lo: 3, hi: 4 }, { label: '4-5', lo: 4, hi: 5 },
      { label: '5+', lo: 5, hi: 999 },
    ];
    const motBuckets = motRanges.map(r => {
      const inRange = totals.filter(b => b.mot >= r.lo && b.mot < r.hi);
      const wins = inRange.filter(b => b.won).length;
      return {
        label: r.label, count: inRange.length,
        annotation: inRange.length > 0 ? `(${wins}W ${inRange.length - wins}L = ${(wins / inRange.length * 100).toFixed(0)}%)` : '',
      };
    });
    printHistogram('MOT Distribution — Totals Bets (count + W/L)', motBuckets);
  }

  if (spreads.some(b => b.lineMovement != null)) {
    const lmRanges = [
      { label: '≤-2', lo: -Infinity, hi: -2 }, { label: '-2:-1', lo: -2, hi: -1 },
      { label: '-1:0', lo: -1, hi: 0 }, { label: '0', lo: 0, hi: 0.001 },
      { label: '0:+1', lo: 0.001, hi: 1 }, { label: '+1:+2', lo: 1, hi: 2 },
      { label: '≥+2', lo: 2, hi: Infinity },
    ];
    const lmBuckets = lmRanges.map(r => ({
      label: r.label,
      count: spreads.filter(b => b.lineMovement != null && b.lineMovement >= r.lo && b.lineMovement < r.hi).length,
    }));
    printHistogram('Spread Line Movement (opener → current, + = FOR us)', lmBuckets);
  }

  if (totals.some(b => b.lineMovement != null)) {
    const lmRanges = [
      { label: '≤-2', lo: -Infinity, hi: -2 }, { label: '-2:-1', lo: -2, hi: -1 },
      { label: '-1:0', lo: -1, hi: 0 }, { label: '0', lo: 0, hi: 0.001 },
      { label: '0:+1', lo: 0.001, hi: 1 }, { label: '+1:+2', lo: 1, hi: 2 },
      { label: '≥+2', lo: 2, hi: Infinity },
    ];
    const lmBuckets = lmRanges.map(r => ({
      label: r.label,
      count: totals.filter(b => b.lineMovement != null && b.lineMovement >= r.lo && b.lineMovement < r.hi).length,
    }));
    printHistogram('Totals Line Movement (opener → current, + = FOR us)', lmBuckets);
  }

  const evalMOSData = evaluations.filter(e => e.bestMOS != null);
  if (evalMOSData.length) {
    const ranges = [
      { label: '<0', lo: -999, hi: 0 }, { label: '0-1', lo: 0, hi: 1 },
      { label: '1-2', lo: 1, hi: 2 }, { label: '2-3', lo: 2, hi: 3 },
      { label: '3-4', lo: 3, hi: 4 }, { label: '4+', lo: 4, hi: 999 },
    ];
    const buckets = ranges.map(r => ({
      label: r.label,
      count: evalMOSData.filter(e => e.bestMOS >= r.lo && e.bestMOS < r.hi).length,
      annotation: r.lo >= 2 ? '← bet zone' : '',
    }));
    printHistogram(`All Evaluated Games — MOS Distribution (n=${evalMOSData.length})`, buckets);
  }

  const evalMOTData = evaluations.filter(e => e.mot != null);
  if (evalMOTData.length) {
    const ranges = [
      { label: '<0.5', lo: 0, hi: 0.5 }, { label: '0.5-1', lo: 0.5, hi: 1 },
      { label: '1-2', lo: 1, hi: 2 }, { label: '2-3', lo: 2, hi: 3 },
      { label: '3+', lo: 3, hi: 999 },
    ];
    const buckets = ranges.map(r => ({
      label: r.label,
      count: evalMOTData.filter(e => e.mot >= r.lo && e.mot < r.hi).length,
      annotation: r.lo >= 0.5 ? '← bet zone' : '',
    }));
    printHistogram(`All Evaluated Games — MOT Distribution (n=${evalMOTData.length})`, buckets);
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  DETAILED PERFORMANCE — SPREADS
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

    printHeader('MOS TIER BREAKDOWN');
    const MOS_TIERS = [
      { name: 'MAXIMUM (5u) MOS 4+', fn: b => b.mos >= 4 },
      { name: 'ELITE (4u)   MOS 3-4', fn: b => b.mos >= 3 && b.mos < 4 },
      { name: 'STRONG (3u)  MOS 2.5-3', fn: b => b.mos >= 2.5 && b.mos < 3 },
      { name: 'SOLID (2u)   MOS 2.25-2.5', fn: b => b.mos >= 2.25 && b.mos < 2.5 },
      { name: 'BASE (1u)    MOS 2-2.25', fn: b => b.mos >= 2 && b.mos < 2.25 },
    ];
    for (const t of MOS_TIERS) fmtRow(t.name, calcStats(sBets.filter(t.fn)));
    const belowFloor = sBets.filter(b => b.mos > 0 && b.mos < 2);
    if (belowFloor.length) fmtRow('(below floor) MOS <2', calcStats(belowFloor));

    printHeader('MODEL AGREEMENT (bothCover)');
    fmtRow('Both models cover', calcStats(sBets.filter(b => b.bothCover)));
    fmtRow('Single model only', calcStats(sBets.filter(b => !b.bothCover)));

    printHeader('LINE MOVEMENT');
    fmtRow('Line moved FOR us', calcStats(sBets.filter(b => b.lineMovement != null && b.lineMovement > 0)));
    fmtRow('Line FLAT', calcStats(sBets.filter(b => b.lineMovement === 0)));
    fmtRow('Line moved AGAINST', calcStats(sBets.filter(b => b.lineMovement != null && b.lineMovement < 0)));
    fmtRow('Movement unknown', calcStats(sBets.filter(b => b.lineMovement == null)));

    printHeader('FAVORITE vs UNDERDOG');
    fmtRow('FAVORITES', calcStats(sBets.filter(b => b.isFavorite === true)));
    fmtRow('UNDERDOGS', calcStats(sBets.filter(b => b.isFavorite === false)));

    printHeader('COMPOSITE: Both Cover + Line Movement');
    fmtRow('Both cover + line FOR', calcStats(sBets.filter(b => b.bothCover && b.lineMovement > 0)));
    fmtRow('Both cover + line FLAT', calcStats(sBets.filter(b => b.bothCover && b.lineMovement === 0)));
    fmtRow('Both cover + line AGAINST', calcStats(sBets.filter(b => b.bothCover && b.lineMovement != null && b.lineMovement < 0)));
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  DETAILED PERFORMANCE — TOTALS
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

    printHeader('DIRECTION');
    fmtRow('OVER bets', calcStats(tBets.filter(b => b.direction === 'OVER')));
    fmtRow('UNDER bets', calcStats(tBets.filter(b => b.direction === 'UNDER')));

    printHeader('MOT TIER BREAKDOWN');
    const MOT_TIERS = [
      { name: 'MAXIMUM (5u) MOT 5+', fn: b => b.mot >= 5 },
      { name: 'ELITE (4u)   MOT 4-5', fn: b => b.mot >= 4 && b.mot < 5 },
      { name: 'STRONG (3u)  MOT 3-4', fn: b => b.mot >= 3 && b.mot < 4 },
      { name: 'SOLID (2u)   MOT 2.5-3', fn: b => b.mot >= 2.5 && b.mot < 3 },
      { name: 'BASE (1u)    MOT 2-2.5', fn: b => b.mot >= 2 && b.mot < 2.5 },
      { name: 'MKT_CONF     MOT 0.5-2', fn: b => b.mot >= 0.5 && b.mot < 2 },
    ];
    for (const t of MOT_TIERS) fmtRow(t.name, calcStats(tBets.filter(t.fn)));
    const belowFloor = tBets.filter(b => b.mot > 0 && b.mot < 0.5);
    if (belowFloor.length) fmtRow('(below floor) MOT <0.5', calcStats(belowFloor));

    printHeader('MODEL AGREEMENT (DR vs HS direction)');
    fmtRow('Both agree on direction', calcStats(tBets.filter(b => b.modelsAgree === true)));
    fmtRow('Models DISAGREE', calcStats(tBets.filter(b => b.modelsAgree === false)));
    fmtRow('Agreement unknown', calcStats(tBets.filter(b => b.modelsAgree == null)));

    printHeader('LINE MOVEMENT');
    fmtRow('Line moved FOR us', calcStats(tBets.filter(b => b.lineMovement != null && b.lineMovement > 0)));
    fmtRow('Line FLAT', calcStats(tBets.filter(b => b.lineMovement === 0)));
    fmtRow('Line moved AGAINST', calcStats(tBets.filter(b => b.lineMovement != null && b.lineMovement < 0)));
    fmtRow('Movement unknown', calcStats(tBets.filter(b => b.lineMovement == null)));

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

    printHeader('COMPOSITE: Direction + Agreement');
    fmtRow('OVER + models agree', calcStats(tBets.filter(b => b.direction === 'OVER' && b.modelsAgree === true)));
    fmtRow('OVER + models disagree', calcStats(tBets.filter(b => b.direction === 'OVER' && b.modelsAgree === false)));
    fmtRow('UNDER + models agree', calcStats(tBets.filter(b => b.direction === 'UNDER' && b.modelsAgree === true)));
    fmtRow('UNDER + models disagree', calcStats(tBets.filter(b => b.direction === 'UNDER' && b.modelsAgree === false)));

    const withDRSignal = tBets.filter(b => b.drSignal != null);
    if (withDRSignal.length || tBets.some(b => b.drMarginVsOpener != null)) {
      printHeader('DR CONTRARIAN UNDER SIGNAL (vs opener)');
      fmtRow('DR_SWEET_SPOT (-5 to -8)', calcStats(tBets.filter(b => b.drSignal === 'DR_SWEET_SPOT')));
      fmtRow('DR_UNDER (-3 to -5)', calcStats(tBets.filter(b => b.drSignal === 'DR_UNDER')));
      fmtRow('DR slight under (0 to -3)', calcStats(tBets.filter(b => b.drSignal === 'DR_SLIGHT_UNDER')));
      fmtRow('DR says OVER (with bias)', calcStats(tBets.filter(b => b.drMarginVsOpener != null && b.drMarginVsOpener >= 0)));
    }

    printHeader('MOT OUTLIER ANALYSIS');
    fmtRow('MOT < 1.0 (tight calls)', calcStats(tBets.filter(b => b.mot > 0 && b.mot < 1)));
    fmtRow('MOT 1.0 - 2.0', calcStats(tBets.filter(b => b.mot >= 1 && b.mot < 2)));
    fmtRow('MOT 2.0 - 3.0', calcStats(tBets.filter(b => b.mot >= 2 && b.mot < 3)));
    fmtRow('MOT 3.0 - 4.0', calcStats(tBets.filter(b => b.mot >= 3 && b.mot < 4)));
    fmtRow('MOT 4.0+ (outlier)', calcStats(tBets.filter(b => b.mot >= 4)));
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  DAILY TREND
  // ═══════════════════════════════════════════════════════════════════════

  console.log('\n' + '═'.repeat(105));
  console.log('  DAILY TREND (Last 14 Days)');
  console.log('═'.repeat(105));
  console.log();
  console.log('  Date          Spread             Totals             Combined');
  console.log('                W-L   %    P/L     W-L   %    P/L     W-L   %    P/L');
  console.log('  ' + '─'.repeat(85));

  for (let i = 1; i <= 14; i++) {
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
  //  SYSTEM CONFIGURATION
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
  console.log('    MOT Floor:      0.5 (tight calls are 70%+ accurate)');
  console.log('    MOT Cap:        MOT 4+ capped at 2u, MOT 6+ capped at 1u');
  console.log('    DR UNDER Boost: +2u sweet spot (-5 to -8), +1u moderate (-3 to -5)');
  console.log('    Movement Gate:  Kill if FLAGGED');
  console.log('    Sizing:         MOT base → DR boost → MOT cap → movement gate');
  console.log('');
  console.log('  EDGE ASSUMPTIONS TO MONITOR:');
  console.log('    1. DR OVER bias ~+1.67 pts on totals (if < +0.5, edge may be gone)');
  console.log('    2. HS directional accuracy ~57.5% on totals (if < 52%, recalibrate)');
  console.log('    3. 20/80 blend > 90/10 for totals direction (if inverts, switch back)');
  console.log('    4. DR UNDER sweet spot (-5 to -8 vs opener) 85%+ accurate');
  console.log('    5. Lower MOT = higher accuracy (if inverts, MOT cap is wrong)');
  console.log('    6. BothCover adds edge for spreads (if < 50%, gate hurts)');
  console.log('    7. Line movement kill saves money (if kill zone wins > 55%, too aggressive)');

  console.log('\n' + '═'.repeat(105));
  console.log('  EDGE HEALTH MONITOR COMPLETE');
  console.log('═'.repeat(105) + '\n');

  process.exit(0);
}

analyze().catch(err => {
  console.error('Analysis failed:', err.message);
  process.exit(1);
});
