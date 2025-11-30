/**
 * BACKTEST: Unit Sizing Options with New Grading Formula
 * 
 * Tests 6 different unit sizing schemes on 157 historical bets
 * Uses Additive Formula: Adjusted EV = Predicted EV + (Historical ROI ÷ 2)
 * 
 * Compares: Current vs 5-Tier vs Kelly vs ROI-Prop vs Tight vs Fibonacci vs EV-Scaled
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import fs from 'fs/promises';
import { getUnitSize } from '../src/utils/staggeredUnits.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin
const serviceAccountPath = join(__dirname, '..', 'serviceAccountKey.json');
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

const app = initializeApp({
  credential: cert(serviceAccount)
});
const db = getFirestore(app);

// ============================================================================
// ODDS RANGE CLASSIFICATION
// ============================================================================

function getOddsRange(odds) {
  if (odds < -1000) return 'EXTREME_FAV';
  if (odds >= -1000 && odds < -500) return 'BIG_FAV';
  if (odds >= -500 && odds < -200) return 'MOD_FAV';
  if (odds >= -200 && odds < -150) return 'SLIGHT_FAV';
  if (odds >= -150 && odds < 150) return 'PICKEM';
  return 'DOG';
}

// ============================================================================
// HISTORICAL ODDS PERFORMANCE (From A+ Grade Analysis - ACTUAL DATA)
// ============================================================================

const ODDS_PERFORMANCE = {
  'EXTREME_FAV': { historicalROI: -49.5, sampleSize: 4 },   // From A+ analysis
  'BIG_FAV': { historicalROI: +15.7, sampleSize: 16 },      // From combined analysis
  'MOD_FAV': { historicalROI: -17.1, sampleSize: 35 },      // From A+ analysis  
  'SLIGHT_FAV': { historicalROI: +25.0, sampleSize: 18 },   // From A+ analysis
  'PICKEM': { historicalROI: -12.3, sampleSize: 47 },       // From A+ analysis
  'DOG': { historicalROI: +12.6, sampleSize: 14 }           // From A+ analysis
};

// ============================================================================
// NEW GRADING FORMULA (ADDITIVE)
// ============================================================================

function calculateNewGrade(predictedEV, odds, unitSizingScheme) {
  // Step 1: Get odds context
  const oddsRange = getOddsRange(odds);
  const contextPerformance = ODDS_PERFORMANCE[oddsRange];
  
  // Step 2: Calculate adjusted EV using ADDITIVE formula
  const adjustedEV = predictedEV + (contextPerformance.historicalROI / 2);
  
  // Step 3: Get grade and units based on unit sizing scheme
  const { grade, units } = unitSizingScheme(adjustedEV, predictedEV, odds, oddsRange);
  
  return {
    grade,
    units,
    predictedEV,
    adjustedEV,
    oddsRange
  };
}

// ============================================================================
// UNIT SIZING SCHEMES
// ============================================================================

// BASELINE: TRUE CURRENT SYSTEM (No new formula)
const BASELINE_SCHEME = {
  name: 'BASELINE (No Formula)',
  getUnits: (adjustedEV, predictedEV, odds, oddsRange) => {
    // Uses old grading system based only on predicted EV
    // IGNORES adjusted EV completely (baseline)
    let grade, units;
    if (predictedEV >= 5.0) {
      grade = 'A+'; units = 5.0;
    } else if (predictedEV >= 3.5) {
      grade = 'A'; units = 4.0;
    } else if (predictedEV >= 2.5) {
      grade = 'B+'; units = 2.0;
    } else if (predictedEV >= 1.5) {
      grade = 'B'; units = 1.5;
    } else {
      grade = 'C'; units = 0.5;
    }
    return { grade, units };
  }
};

// CURRENT SYSTEM WITH NEW FORMULA
const CURRENT_SCHEME = {
  name: 'CURRENT (With Formula)',
  getUnits: (adjustedEV, predictedEV, odds, oddsRange) => {
    // Uses old unit sizes but WITH new formula for grading
    let grade, units;
    if (adjustedEV >= 5.0) {
      grade = 'A+'; units = 5.0;
    } else if (adjustedEV >= 3.5) {
      grade = 'A'; units = 4.0;
    } else if (adjustedEV >= 2.5) {
      grade = 'B+'; units = 2.0;
    } else if (adjustedEV >= 1.5) {
      grade = 'B'; units = 1.5;
    } else {
      grade = 'C'; units = 0.5;
    }
    return { grade, units };
  }
};

// OPTION 1: 5-TIER (A+ to D)
const FIVE_TIER_SCHEME = {
  name: '5-TIER (A+ to D)',
  getUnits: (adjustedEV, predictedEV, odds, oddsRange) => {
    let grade, units;
    if (adjustedEV >= 8.0) {
      grade = 'A+'; units = 5.0;
    } else if (adjustedEV >= 5.0) {
      grade = 'A'; units = 3.5;
    } else if (adjustedEV >= 2.0) {
      grade = 'B'; units = 2.0;
    } else if (adjustedEV >= 0.0) {
      grade = 'C'; units = 1.0;
    } else {
      grade = 'D'; units = 0.5;
    }
    return { grade, units };
  }
};

// OPTION 2: KELLY CRITERION
const KELLY_SCHEME = {
  name: 'KELLY CRITERION',
  getUnits: (adjustedEV, predictedEV, odds, oddsRange) => {
    // Estimate win probability from adjusted EV and odds
    const decimalOdds = odds < 0 ? (100 / Math.abs(odds)) + 1 : (odds / 100) + 1;
    const impliedProb = 1 / decimalOdds;
    
    // Boost implied prob by adjusted EV
    const estimatedWinProb = impliedProb + (adjustedEV / 100);
    
    // Kelly formula: f = (bp - q) / b
    const b = decimalOdds - 1;
    const p = Math.min(0.95, Math.max(0.05, estimatedWinProb)); // Cap between 5-95%
    const q = 1 - p;
    
    const kelly = (b * p - q) / b;
    
    // Quarter-Kelly with scale factor
    const units = Math.max(0, Math.min(5, kelly * 0.25 * 20));
    
    let grade;
    if (units >= 4.0) grade = 'A+';
    else if (units >= 2.5) grade = 'A';
    else if (units >= 1.0) grade = 'B';
    else if (units >= 0.3) grade = 'C';
    else grade = 'D';
    
    return { grade, units: Math.round(units * 10) / 10 }; // Round to 1 decimal
  }
};

// OPTION 3: ROI-PROPORTIONAL
const ROI_PROP_SCHEME = {
  name: 'ROI-PROPORTIONAL',
  getUnits: (adjustedEV, predictedEV, odds, oddsRange) => {
    // Units = adjusted EV / 5% (normalized)
    const units = Math.max(0.5, Math.min(5, (adjustedEV / 5) * 3));
    
    let grade;
    if (adjustedEV >= 8.0) grade = 'A+';
    else if (adjustedEV >= 5.0) grade = 'A';
    else if (adjustedEV >= 2.0) grade = 'B';
    else if (adjustedEV >= 0.0) grade = 'C';
    else grade = 'D';
    
    return { grade, units: Math.round(units * 10) / 10 };
  }
};

// OPTION 4: TIGHTER RANGE (Conservative)
const TIGHT_SCHEME = {
  name: 'TIGHTER RANGE',
  getUnits: (adjustedEV, predictedEV, odds, oddsRange) => {
    let grade, units;
    if (adjustedEV >= 6.0) {
      grade = 'A'; units = 3.0;
    } else if (adjustedEV >= 2.0) {
      grade = 'B'; units = 2.0;
    } else {
      grade = 'C'; units = 1.0;
    }
    return { grade, units };
  }
};

// OPTION 5: FIBONACCI
const FIBONACCI_SCHEME = {
  name: 'FIBONACCI',
  getUnits: (adjustedEV, predictedEV, odds, oddsRange) => {
    let grade, units;
    if (adjustedEV >= 8.0) {
      grade = 'A+'; units = 5.0;
    } else if (adjustedEV >= 5.0) {
      grade = 'A'; units = 3.0;
    } else if (adjustedEV >= 2.0) {
      grade = 'B'; units = 2.0;
    } else if (adjustedEV >= 0.0) {
      grade = 'C'; units = 1.0;
    } else {
      grade = 'D'; units = 0.5;
    }
    return { grade, units };
  }
};

// OPTION 6: EV-SCALED (Continuous)
const EV_SCALED_SCHEME = {
  name: 'EV-SCALED',
  getUnits: (adjustedEV, predictedEV, odds, oddsRange) => {
    // Direct scaling: units = adjustedEV × 0.5
    const units = Math.max(0.5, Math.min(5, adjustedEV * 0.5));
    
    let grade;
    if (adjustedEV >= 8.0) grade = 'A+';
    else if (adjustedEV >= 5.0) grade = 'A';
    else if (adjustedEV >= 2.0) grade = 'B';
    else if (adjustedEV >= 0.0) grade = 'C';
    else grade = 'D';
    
    return { grade, units: Math.round(units * 10) / 10 };
  }
};

// ============================================================================
// BACKTEST FUNCTION
// ============================================================================

function backtestScheme(bets, scheme) {
  let totalRisked = 0;
  let totalProfit = 0;
  let wins = 0;
  let losses = 0;
  
  const gradeStats = {};
  const allGradedBets = [];
  
  for (const bet of bets) {
    if (!bet.result?.outcome) continue; // Skip pending
    
    const predictedEV = bet.prediction?.evPercent || 0;
    const odds = bet.bet.odds;
    
    // Calculate new grade and units
    const grading = calculateNewGrade(predictedEV, odds, scheme.getUnits);
    
    const isWin = bet.result.outcome === 'WIN';
    
    // Calculate profit
    let profit;
    if (isWin) {
      profit = grading.units * (odds > 0 ? odds / 100 : 100 / Math.abs(odds));
    } else {
      profit = -grading.units;
    }
    
    totalRisked += grading.units;
    totalProfit += profit;
    
    if (isWin) wins++;
    else losses++;
    
    // Track by grade
    if (!gradeStats[grading.grade]) {
      gradeStats[grading.grade] = {
        bets: 0,
        wins: 0,
        losses: 0,
        risked: 0,
        profit: 0
      };
    }
    
    gradeStats[grading.grade].bets++;
    gradeStats[grading.grade].risked += grading.units;
    gradeStats[grading.grade].profit += profit;
    if (isWin) gradeStats[grading.grade].wins++;
    else gradeStats[grading.grade].losses++;
    
    allGradedBets.push({
      ...bet,
      newGrade: grading.grade,
      newUnits: grading.units,
      adjustedEV: grading.adjustedEV,
      profit
    });
  }
  
  const roi = totalRisked > 0 ? (totalProfit / totalRisked) * 100 : 0;
  const winRate = wins + losses > 0 ? (wins / (wins + losses)) * 100 : 0;
  
  // Calculate grade ROIs
  for (const grade in gradeStats) {
    const stats = gradeStats[grade];
    stats.roi = stats.risked > 0 ? (stats.profit / stats.risked) * 100 : 0;
    stats.winRate = stats.bets > 0 ? (stats.wins / stats.bets) * 100 : 0;
  }
  
  return {
    schemeName: scheme.name,
    totalBets: wins + losses,
    wins,
    losses,
    winRate,
    totalRisked,
    totalProfit,
    roi,
    gradeStats,
    allGradedBets
  };
}

// ============================================================================
// MAIN BACKTEST
// ============================================================================

async function runBacktest() {
  console.log('\n╔════════════════════════════════════════════════════════════════════╗');
  console.log('║  🔬 BACKTEST: Unit Sizing with New Grading Formula               ║');
  console.log('║  Formula: Adjusted EV = Predicted EV + (Historical ROI ÷ 2)      ║');
  console.log('╚════════════════════════════════════════════════════════════════════╝\n');
  
  try {
    // Load all basketball bets
    const betsSnapshot = await db.collection('basketball_bets').get();
    const allBets = betsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const gradedBets = allBets.filter(bet => bet.result?.outcome);
    
    console.log(`📊 Loaded ${gradedBets.length} graded bets\n`);
    
    // Test all schemes
    const schemes = [
      BASELINE_SCHEME,  // True current system (no formula)
      CURRENT_SCHEME,   // Current units with new formula
      FIVE_TIER_SCHEME,
      KELLY_SCHEME,
      ROI_PROP_SCHEME,
      TIGHT_SCHEME,
      FIBONACCI_SCHEME,
      EV_SCALED_SCHEME
    ];
    
    const results = [];
    
    for (const scheme of schemes) {
      console.log(`⚙️  Testing ${scheme.name}...`);
      const result = backtestScheme(gradedBets, scheme);
      results.push(result);
    }
    
    console.log('\n✅ All schemes tested\n');
    
    // ========================================================================
    // DISPLAY RESULTS
    // ========================================================================
    
    // Sort by ROI
    results.sort((a, b) => b.roi - a.roi);
    
    console.log('╔════════════════════════════════════════════════════════════════════════════════════════════╗');
    console.log('║                           UNIT SIZING COMPARISON                                          ║');
    console.log('╠═══════════════════════════╦══════╦══════╦═══════╦════════════╦═════════════╦══════════════╣');
    console.log('║ Scheme                    ║ Bets ║ Wins ║  Win% ║   Risked   ║   Profit    ║     ROI%     ║');
    console.log('╠═══════════════════════════╬══════╬══════╬═══════╬════════════╬═════════════╬══════════════╣');
    
    for (const result of results) {
      const nameStr = result.schemeName.padEnd(25);
      const betsStr = String(result.totalBets).padStart(4);
      const winsStr = String(result.wins).padStart(4);
      const winRateStr = result.winRate.toFixed(1).padStart(4) + '%';
      const riskedStr = result.totalRisked.toFixed(1).padStart(10) + 'u';
      const profitStr = (result.totalProfit >= 0 ? '+' : '') + result.totalProfit.toFixed(2).padStart(11) + 'u';
      const roiStr = (result.roi >= 0 ? '+' : '') + result.roi.toFixed(1).padStart(5) + '%';
      
      console.log(`║ ${nameStr} ║ ${betsStr} ║ ${winsStr} ║ ${winRateStr} ║ ${riskedStr} ║ ${profitStr} ║ ${roiStr}     ║`);
    }
    
    console.log('╚═══════════════════════════╩══════╩══════╩═══════╩════════════╩═════════════╩══════════════╝\n');
    
    const bestScheme = results[0];
    console.log(`🏆 BEST SCHEME: ${bestScheme.schemeName}`);
    console.log(`   ROI: ${bestScheme.roi >= 0 ? '+' : ''}${bestScheme.roi.toFixed(2)}%`);
    console.log(`   Profit: ${bestScheme.totalProfit >= 0 ? '+' : ''}${bestScheme.totalProfit.toFixed(2)}u`);
    console.log(`   Risk Reduction: ${((1 - bestScheme.totalRisked / 400) * 100).toFixed(1)}% less risk than current\n`);
    
    // ========================================================================
    // DETAILED BREAKDOWN OF BEST SCHEME
    // ========================================================================
    
    console.log(`📊 DETAILED BREAKDOWN: ${bestScheme.schemeName}\n`);
    
    console.log('╔═══════════════════════════════════════════════════════════════════════════════════════╗');
    console.log('║                         PERFORMANCE BY GRADE                                         ║');
    console.log('╠═══════╦══════╦══════╦════════╦═══════╦════════════╦═════════════╦══════════════════╣');
    console.log('║ Grade ║ Bets ║ Wins ║ Losses ║  Win% ║   Risked   ║   Profit    ║      ROI%        ║');
    console.log('╠═══════╬══════╬══════╬════════╬═══════╬════════════╬═════════════╬══════════════════╣');
    
    // Sort grades by profitability
    const sortedGrades = Object.entries(bestScheme.gradeStats).sort((a, b) => b[1].roi - a[1].roi);
    
    for (const [grade, stats] of sortedGrades) {
      const gradeStr = grade.padEnd(5);
      const betsStr = String(stats.bets).padStart(4);
      const winsStr = String(stats.wins).padStart(4);
      const lossStr = String(stats.losses).padStart(6);
      const winRateStr = stats.winRate.toFixed(1).padStart(4) + '%';
      const riskedStr = stats.risked.toFixed(1).padStart(10) + 'u';
      const profitStr = (stats.profit >= 0 ? '+' : '') + stats.profit.toFixed(2).padStart(11) + 'u';
      const roiStr = (stats.roi >= 0 ? '+' : '') + stats.roi.toFixed(1).padStart(6) + '%';
      
      console.log(`║ ${gradeStr} ║ ${betsStr} ║ ${winsStr} ║ ${lossStr} ║ ${winRateStr} ║ ${riskedStr} ║ ${profitStr} ║ ${roiStr}        ║`);
    }
    
    console.log('╚═══════╩══════╩══════╩════════╩═══════╩════════════╩═════════════╩══════════════════╝\n');
    
    // ========================================================================
    // SAVE DETAILED REPORT
    // ========================================================================
    
    console.log('💾 Saving detailed reports...\n');
    
    const reportLines = [
      '# 🔬 UNIT SIZING BACKTEST RESULTS',
      '',
      `**Date:** ${new Date().toLocaleDateString()}`,
      `**Bets Analyzed:** ${gradedBets.length}`,
      `**Formula:** Adjusted EV = Predicted EV + (Historical ROI ÷ 2)`,
      '',
      '---',
      '',
      '## Overall Comparison',
      '',
      '| Scheme | Bets | Wins | Win% | Risked | Profit | ROI% |',
      '|--------|------|------|------|--------|--------|------|'
    ];
    
    for (const result of results) {
      reportLines.push(
        `| ${result.schemeName} | ${result.totalBets} | ${result.wins} | ${result.winRate.toFixed(1)}% | ${result.totalRisked.toFixed(1)}u | ${result.totalProfit >= 0 ? '+' : ''}${result.totalProfit.toFixed(2)}u | ${result.roi >= 0 ? '+' : ''}${result.roi.toFixed(1)}% |`
      );
    }
    
    reportLines.push('', `## Winner: ${bestScheme.schemeName}`, '');
    reportLines.push(`- **ROI:** ${bestScheme.roi >= 0 ? '+' : ''}${bestScheme.roi.toFixed(2)}%`);
    reportLines.push(`- **Profit:** ${bestScheme.totalProfit >= 0 ? '+' : ''}${bestScheme.totalProfit.toFixed(2)} units`);
    reportLines.push(`- **Risk Reduction:** ${((1 - bestScheme.totalRisked / 400) * 100).toFixed(1)}% vs current system`);
    reportLines.push(`- **Win Rate:** ${bestScheme.winRate.toFixed(1)}%`);
    
    reportLines.push('', '## Performance by Grade', '');
    reportLines.push('| Grade | Bets | Wins | Win% | Risked | Profit | ROI% |');
    reportLines.push('|-------|------|------|------|--------|--------|------|');
    
    for (const [grade, stats] of sortedGrades) {
      reportLines.push(
        `| ${grade} | ${stats.bets} | ${stats.wins} | ${stats.winRate.toFixed(1)}% | ${stats.risked.toFixed(1)}u | ${stats.profit >= 0 ? '+' : ''}${stats.profit.toFixed(2)}u | ${stats.roi >= 0 ? '+' : ''}${stats.roi.toFixed(1)}% |`
      );
    }
    
    reportLines.push('', '## Key Insights', '');
    
    // Find improvement vs baseline
    const baselineResult = results.find(r => r.schemeName === 'BASELINE (No Formula)');
    const improvement = bestScheme.roi - baselineResult.roi;
    const profitSwing = bestScheme.totalProfit - baselineResult.totalProfit;
    
    reportLines.push(`- **ROI Improvement:** ${improvement >= 0 ? '+' : ''}${improvement.toFixed(2)}% (from ${baselineResult.roi.toFixed(2)}% to ${bestScheme.roi.toFixed(2)}%)`);
    reportLines.push(`- **Profit Swing:** ${profitSwing >= 0 ? '+' : ''}${profitSwing.toFixed(2)} units`);
    reportLines.push(`- **Risk Management:** ${bestScheme.totalRisked.toFixed(1)}u risked vs ${baselineResult.totalRisked.toFixed(1)}u baseline`);
    
    await fs.writeFile(join(__dirname, '../UNIT_SIZING_BACKTEST_RESULTS.md'), reportLines.join('\n'));
    console.log('✅ Saved: UNIT_SIZING_BACKTEST_RESULTS.md');
    
    // Save best scheme graded bets to CSV
    const csvLines = ['Date,Game,Grade,Units,Predicted_EV,Adjusted_EV,Odds_Range,Outcome,Profit'];
    for (const bet of bestScheme.allGradedBets) {
      const date = bet.date || bet.id.split('_')[0];
      const game = `${bet.game.awayTeam} @ ${bet.game.homeTeam}`;
      csvLines.push(
        `${date},"${game}",${bet.newGrade},${bet.newUnits},${bet.prediction?.evPercent?.toFixed(2) || 0},${bet.adjustedEV.toFixed(2)},${getOddsRange(bet.bet.odds)},${bet.result.outcome},${bet.profit.toFixed(2)}`
      );
    }
    
    await fs.writeFile(join(__dirname, '../BEST_SCHEME_BETS.csv'), csvLines.join('\n'));
    console.log('✅ Saved: BEST_SCHEME_BETS.csv');
    
    console.log('\n╔════════════════════════════════════════════════════════════════════╗');
    console.log('║                    ✅ BACKTEST COMPLETE                            ║');
    console.log('╚════════════════════════════════════════════════════════════════════╝\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

// Run backtest
runBacktest()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

