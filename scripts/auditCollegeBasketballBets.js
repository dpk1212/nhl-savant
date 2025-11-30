/**
 * COMPREHENSIVE COLLEGE BASKETBALL BETTING AUDIT
 * 
 * Analyzes all historical basketball bets from Firebase to:
 * 1. Identify which grades are profitable vs unprofitable
 * 2. Optimize unit allocation strategy
 * 3. Recalibrate grade thresholds
 * 4. Provide actionable recommendations
 * 
 * URGENCY: Current ROI is negative - need to stop bleeding money
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { readFileSync } from 'fs';
import { getUnitSize, calculateUnitProfit } from '../src/utils/staggeredUnits.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

// Initialize Firebase Admin (using serviceAccountKey.json)
const serviceAccountPath = join(__dirname, '..', 'serviceAccountKey.json');
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

const app = initializeApp({
  credential: cert(serviceAccount)
});
const db = getFirestore(app);

// ============================================================================
// UNIT ALLOCATION STRATEGIES TO TEST
// ============================================================================

const STRATEGIES = {
  CURRENT: {
    'A+': 5.0, 'A': 4.0, 'A-': 3.0, 'B+': 2.0, 'B': 1.5, 'B-': 1.0,
    'C+': 0.5, 'C': 0.5, 'C-': 0.5, 'D': 0.5, 'F': 0.5
  },
  CONSERVATIVE: {
    'A+': 3.0, 'A': 2.5, 'A-': 2.0, 'B+': 2.0, 'B': 1.0, 'B-': 1.0,
    'C+': 0, 'C': 0, 'C-': 0, 'D': 0, 'F': 0
  },
  AGGRESSIVE: {
    'A+': 7.0, 'A': 5.0, 'A-': 4.0, 'B+': 3.0, 'B': 2.0, 'B-': 1.0,
    'C+': 0.5, 'C': 0.5, 'C-': 0.5, 'D': 0.5, 'F': 0.5
  },
  FLAT: {
    'A+': 1.0, 'A': 1.0, 'A-': 1.0, 'B+': 1.0, 'B': 1.0, 'B-': 1.0,
    'C+': 1.0, 'C': 1.0, 'C-': 1.0, 'D': 1.0, 'F': 1.0
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function calculateKellyUnit(winRate, avgOdds) {
  // Kelly Criterion: f = (bp - q) / b
  // where b = decimal odds - 1, p = win probability, q = 1 - p
  const decimalOdds = avgOdds > 0 ? (avgOdds / 100) + 1 : (100 / Math.abs(avgOdds)) + 1;
  const b = decimalOdds - 1;
  const p = winRate / 100;
  const q = 1 - p;
  
  const kellyFraction = (b * p - q) / b;
  
  // Use quarter Kelly and cap at 5 units
  const kellyUnit = Math.max(0, Math.min(5, kellyFraction * 0.25 * 20));
  return kellyUnit;
}

function simulateStrategy(bets, strategy, strategyName) {
  let totalRisked = 0;
  let totalProfit = 0;
  let wins = 0;
  let losses = 0;
  let skipped = 0;
  
  const betsByGrade = {};
  
  for (const bet of bets) {
    const grade = bet.prediction?.grade || 'B';
    const units = strategy[grade] || 0;
    
    if (units === 0) {
      skipped++;
      continue;
    }
    
    const outcome = bet.result?.outcome;
    if (!outcome) continue;
    
    const isWin = outcome === 'WIN';
    const profit = calculateUnitProfit(grade, bet.bet.odds, isWin);
    
    // Recalculate with strategy units
    const strategyProfit = isWin 
      ? units * (bet.bet.odds > 0 ? bet.bet.odds / 100 : 100 / Math.abs(bet.bet.odds))
      : -units;
    
    totalRisked += units;
    totalProfit += strategyProfit;
    
    if (isWin) wins++;
    else losses++;
    
    if (!betsByGrade[grade]) {
      betsByGrade[grade] = { bets: 0, wins: 0, losses: 0, profit: 0, risked: 0 };
    }
    betsByGrade[grade].bets++;
    betsByGrade[grade].risked += units;
    betsByGrade[grade].profit += strategyProfit;
    if (isWin) betsByGrade[grade].wins++;
    else betsByGrade[grade].losses++;
  }
  
  const roi = totalRisked > 0 ? (totalProfit / totalRisked) * 100 : 0;
  const winRate = wins + losses > 0 ? (wins / (wins + losses)) * 100 : 0;
  
  return {
    strategyName,
    totalBets: wins + losses,
    skipped,
    wins,
    losses,
    winRate,
    totalRisked: totalRisked.toFixed(2),
    totalProfit: totalProfit.toFixed(2),
    roi: roi.toFixed(2),
    betsByGrade
  };
}

function analyzeGradePerformance(bets) {
  const gradeStats = {};
  
  for (const bet of bets) {
    const grade = bet.prediction?.grade || 'UNKNOWN';
    const outcome = bet.result?.outcome;
    
    if (!outcome) continue; // Skip pending bets
    
    if (!gradeStats[grade]) {
      gradeStats[grade] = {
        bets: 0,
        wins: 0,
        losses: 0,
        totalOdds: 0,
        totalEV: 0,
        totalRisked: 0,
        totalProfit: 0,
        evList: []
      };
    }
    
    const stats = gradeStats[grade];
    const units = getUnitSize(grade);
    const isWin = outcome === 'WIN';
    const profit = bet.result?.profit || 0;
    
    stats.bets++;
    stats.totalOdds += bet.bet.odds;
    stats.totalRisked += units;
    stats.totalProfit += profit;
    
    if (isWin) stats.wins++;
    else stats.losses++;
    
    if (bet.prediction?.evPercent !== undefined) {
      stats.totalEV += bet.prediction.evPercent;
      stats.evList.push(bet.prediction.evPercent);
    }
  }
  
  // Calculate derived metrics
  for (const grade in gradeStats) {
    const stats = gradeStats[grade];
    stats.winRate = stats.bets > 0 ? (stats.wins / stats.bets) * 100 : 0;
    stats.roi = stats.totalRisked > 0 ? (stats.totalProfit / stats.totalRisked) * 100 : 0;
    stats.avgOdds = stats.bets > 0 ? stats.totalOdds / stats.bets : 0;
    stats.avgEV = stats.evList.length > 0 ? stats.totalEV / stats.evList.length : 0;
    stats.status = stats.roi > 0 ? '✅ PROFITABLE' : '❌ LOSING';
  }
  
  return gradeStats;
}

function validateDataIntegrity(bets) {
  const issues = [];
  let validBets = 0;
  let missingGrades = 0;
  let missingOutcomes = 0;
  let profitMismatches = 0;
  
  for (const bet of bets) {
    if (!bet.prediction?.grade) {
      missingGrades++;
      issues.push(`Bet ${bet.id}: Missing grade`);
      continue;
    }
    
    if (!bet.result?.outcome) {
      missingOutcomes++;
      continue; // Pending bet, not an issue
    }
    
    // Validate profit calculation
    const grade = bet.prediction.grade;
    const outcome = bet.result.outcome;
    const storedProfit = bet.result.profit;
    const isWin = outcome === 'WIN';
    const expectedProfit = calculateUnitProfit(grade, bet.bet.odds, isWin);
    
    const diff = Math.abs(storedProfit - expectedProfit);
    if (diff > 0.01) {
      profitMismatches++;
      issues.push(`Bet ${bet.id}: Profit mismatch (stored: ${storedProfit.toFixed(2)}, expected: ${expectedProfit.toFixed(2)})`);
    } else {
      validBets++;
    }
  }
  
  return {
    totalBets: bets.length,
    validBets,
    pendingBets: missingOutcomes,
    missingGrades,
    profitMismatches,
    issues: issues.slice(0, 10) // Only show first 10 issues
  };
}

// ============================================================================
// MAIN AUDIT FUNCTION
// ============================================================================

async function auditCollegeBasketballBets() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║  🏀 COMPREHENSIVE COLLEGE BASKETBALL BETTING AUDIT            ║');
  console.log('║  URGENT: Identify losing grades and optimize strategy         ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');
  
  try {
    // ========================================================================
    // STEP 1: EXPORT ALL BASKETBALL BETS
    // ========================================================================
    console.log('📊 STEP 1: Exporting all basketball bets from Firebase...\n');
    
    const betsSnapshot = await db.collection('basketball_bets').get();
    const allBets = betsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    console.log(`✅ Exported ${allBets.length} total bets`);
    
    const gradedBets = allBets.filter(bet => bet.result?.outcome);
    const pendingBets = allBets.filter(bet => !bet.result?.outcome);
    
    console.log(`   - Graded: ${gradedBets.length}`);
    console.log(`   - Pending: ${pendingBets.length}\n`);
    
    if (gradedBets.length === 0) {
      console.log('❌ No graded bets found! Cannot perform analysis.\n');
      return;
    }
    
    // ========================================================================
    // STEP 2: VALIDATE DATA INTEGRITY
    // ========================================================================
    console.log('🔍 STEP 2: Validating data integrity...\n');
    
    const validation = validateDataIntegrity(allBets);
    
    console.log(`✅ Data Validation Results:`);
    console.log(`   - Total Bets: ${validation.totalBets}`);
    console.log(`   - Valid Bets: ${validation.validBets}`);
    console.log(`   - Pending Bets: ${validation.pendingBets}`);
    console.log(`   - Missing Grades: ${validation.missingGrades}`);
    console.log(`   - Profit Mismatches: ${validation.profitMismatches}`);
    
    if (validation.issues.length > 0) {
      console.log(`\n⚠️  Issues Found (showing first 10):`);
      validation.issues.forEach(issue => console.log(`   - ${issue}`));
    }
    console.log('');
    
    // ========================================================================
    // STEP 3: ANALYZE PERFORMANCE BY GRADE (CRITICAL)
    // ========================================================================
    console.log('🎯 STEP 3: Analyzing performance by grade (CRITICAL)...\n');
    
    const gradeStats = analyzeGradePerformance(allBets);
    
    // Sort grades by profitability
    const sortedGrades = Object.entries(gradeStats).sort((a, b) => b[1].roi - a[1].roi);
    
    console.log('╔════════════════════════════════════════════════════════════════════════════════════════════════╗');
    console.log('║                              PERFORMANCE BY GRADE                                              ║');
    console.log('╠═══════╦══════╦══════╦════════╦═══════╦════════════╦═════════════╦═══════╦══════════╦══════════╣');
    console.log('║ Grade ║ Bets ║ Wins ║ Losses ║  Win% ║ Units Risk ║ Units Profit║  ROI% ║ Avg Odds ║  Avg EV% ║');
    console.log('╠═══════╬══════╬══════╬════════╬═══════╬════════════╬═════════════╬═══════╬══════════╬══════════╣');
    
    for (const [grade, stats] of sortedGrades) {
      const gradeStr = grade.padEnd(5);
      const betsStr = String(stats.bets).padStart(4);
      const winsStr = String(stats.wins).padStart(4);
      const lossStr = String(stats.losses).padStart(6);
      const winRateStr = stats.winRate.toFixed(1).padStart(5) + '%';
      const riskedStr = stats.totalRisked.toFixed(2).padStart(10);
      const profitStr = (stats.totalProfit >= 0 ? '+' : '') + stats.totalProfit.toFixed(2).padStart(11);
      const roiStr = (stats.roi >= 0 ? '+' : '') + stats.roi.toFixed(1).padStart(5) + '%';
      const oddsStr = (stats.avgOdds >= 0 ? '+' : '') + stats.avgOdds.toFixed(0).padStart(8);
      const evStr = (stats.avgEV >= 0 ? '+' : '') + stats.avgEV.toFixed(1).padStart(5) + '%';
      
      console.log(`║ ${gradeStr} ║ ${betsStr} ║ ${winsStr} ║ ${lossStr} ║ ${winRateStr} ║ ${riskedStr} ║ ${profitStr} ║ ${roiStr} ║ ${oddsStr} ║ ${evStr} ║`);
    }
    
    console.log('╚═══════╩══════╩══════╩════════╩═══════╩════════════╩═════════════╩═══════╩══════════╩══════════╝\n');
    
    // Identify losing grades
    const losingGrades = sortedGrades.filter(([_, stats]) => stats.roi < 0);
    const profitableGrades = sortedGrades.filter(([_, stats]) => stats.roi > 0);
    
    console.log('🚨 CRITICAL FINDINGS:\n');
    console.log(`❌ LOSING GRADES (${losingGrades.length}): ${losingGrades.map(([g]) => g).join(', ')}`);
    console.log(`✅ PROFITABLE GRADES (${profitableGrades.length}): ${profitableGrades.map(([g]) => g).join(', ')}\n`);
    
    // Calculate overall stats
    const totalBets = gradedBets.length;
    const totalWins = gradedBets.filter(b => b.result.outcome === 'WIN').length;
    const totalRisked = gradedBets.reduce((sum, b) => sum + getUnitSize(b.prediction?.grade || 'B'), 0);
    const totalProfit = gradedBets.reduce((sum, b) => sum + (b.result.profit || 0), 0);
    const overallROI = totalRisked > 0 ? (totalProfit / totalRisked) * 100 : 0;
    const overallWinRate = totalBets > 0 ? (totalWins / totalBets) * 100 : 0;
    
    console.log('📊 OVERALL PERFORMANCE (Current Strategy):');
    console.log(`   - Total Bets: ${totalBets}`);
    console.log(`   - Win Rate: ${overallWinRate.toFixed(1)}%`);
    console.log(`   - Total Risked: ${totalRisked.toFixed(2)}u`);
    console.log(`   - Total Profit: ${(totalProfit >= 0 ? '+' : '')}${totalProfit.toFixed(2)}u`);
    console.log(`   - ROI: ${(overallROI >= 0 ? '+' : '')}${overallROI.toFixed(1)}%`);
    console.log('');
    
    // ========================================================================
    // STEP 4: SIMULATE ALTERNATIVE STRATEGIES
    // ========================================================================
    console.log('💡 STEP 4: Simulating alternative unit allocation strategies...\n');
    
    const simulations = [
      simulateStrategy(gradedBets, STRATEGIES.CURRENT, 'CURRENT'),
      simulateStrategy(gradedBets, STRATEGIES.CONSERVATIVE, 'CONSERVATIVE'),
      simulateStrategy(gradedBets, STRATEGIES.AGGRESSIVE, 'AGGRESSIVE'),
      simulateStrategy(gradedBets, STRATEGIES.FLAT, 'FLAT BETTING')
    ];
    
    // Add profit-weighted strategy (only bet profitable grades)
    const profitWeightedStrategy = {};
    for (const [grade, stats] of sortedGrades) {
      if (stats.roi > 0) {
        const kellyUnit = calculateKellyUnit(stats.winRate, stats.avgOdds);
        profitWeightedStrategy[grade] = kellyUnit;
      } else {
        profitWeightedStrategy[grade] = 0;
      }
    }
    simulations.push(simulateStrategy(gradedBets, profitWeightedStrategy, 'KELLY (Profitable Only)'));
    
    // Sort by ROI
    simulations.sort((a, b) => parseFloat(b.roi) - parseFloat(a.roi));
    
    console.log('╔════════════════════════════════════════════════════════════════════════════════════════╗');
    console.log('║                        STRATEGY COMPARISON                                             ║');
    console.log('╠═══════════════════════════╦═══════╦═══════╦═══════╦═══════╦════════════╦══════════════╣');
    console.log('║ Strategy                  ║  Bets ║  Wins ║ Win%  ║ Risked║   Profit   ║     ROI%     ║');
    console.log('╠═══════════════════════════╬═══════╬═══════╬═══════╬═══════╬════════════╬══════════════╣');
    
    for (const sim of simulations) {
      const stratName = sim.strategyName.padEnd(25);
      const betsStr = String(sim.totalBets).padStart(5);
      const winsStr = String(sim.wins).padStart(5);
      const winRateStr = sim.winRate.toFixed(1).padStart(4) + '%';
      const riskedStr = sim.totalRisked.padStart(5) + 'u';
      const profitStr = (parseFloat(sim.totalProfit) >= 0 ? '+' : '') + sim.totalProfit.padStart(9) + 'u';
      const roiStr = (parseFloat(sim.roi) >= 0 ? '+' : '') + sim.roi.padStart(6) + '%';
      
      console.log(`║ ${stratName} ║ ${betsStr} ║ ${winsStr} ║ ${winRateStr} ║ ${riskedStr} ║ ${profitStr} ║ ${roiStr}     ║`);
    }
    
    console.log('╚═══════════════════════════╩═══════╩═══════╩═══════╩═══════╩════════════╩══════════════╝\n');
    
    const bestStrategy = simulations[0];
    console.log(`🏆 BEST STRATEGY: ${bestStrategy.strategyName} (ROI: ${bestStrategy.roi}%)\n`);
    
    // ========================================================================
    // STEP 5: EXPORT DATA TO CSV
    // ========================================================================
    console.log('💾 STEP 5: Exporting data to CSV...\n');
    
    const csvRows = [
      'Date,Game,Pick,Odds,Grade,EV%,Outcome,Units Risked,Profit,Status'
    ];
    
    for (const bet of gradedBets) {
      const date = bet.date || bet.id.split('_')[0];
      const game = `${bet.game.awayTeam} @ ${bet.game.homeTeam}`;
      const pick = bet.bet.team;
      const odds = bet.bet.odds;
      const grade = bet.prediction?.grade || 'N/A';
      const ev = bet.prediction?.evPercent?.toFixed(2) || '0';
      const outcome = bet.result.outcome;
      const units = getUnitSize(grade);
      const profit = bet.result.profit?.toFixed(2) || '0';
      const status = gradeStats[grade]?.roi > 0 ? 'PROFITABLE_GRADE' : 'LOSING_GRADE';
      
      csvRows.push(`${date},"${game}",${pick},${odds},${grade},${ev},${outcome},${units},${profit},${status}`);
    }
    
    const csvPath = join(__dirname, '../COLLEGE_BASKETBALL_AUDIT_EXPORT.csv');
    await fs.writeFile(csvPath, csvRows.join('\n'));
    console.log(`✅ Exported to: ${csvPath}\n`);
    
    // ========================================================================
    // STEP 6: GENERATE RECOMMENDATIONS
    // ========================================================================
    console.log('🎯 STEP 6: Generating actionable recommendations...\n');
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║                    ACTIONABLE RECOMMENDATIONS                  ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');
    
    console.log('1️⃣  GRADES TO ELIMINATE (Negative ROI):');
    if (losingGrades.length > 0) {
      losingGrades.forEach(([grade, stats]) => {
        console.log(`   ❌ ${grade}: ${stats.bets} bets, ${stats.winRate.toFixed(1)}% win rate, ${stats.roi.toFixed(1)}% ROI`);
      });
    } else {
      console.log('   ✅ All grades are profitable!');
    }
    console.log('');
    
    console.log('2️⃣  PROFITABLE GRADES TO FOCUS ON:');
    profitableGrades.forEach(([grade, stats]) => {
      const kellyUnit = calculateKellyUnit(stats.winRate, stats.avgOdds);
      console.log(`   ✅ ${grade}: ${stats.bets} bets, ${stats.winRate.toFixed(1)}% win rate, ${stats.roi.toFixed(1)}% ROI`);
      console.log(`      Recommended Kelly sizing: ${kellyUnit.toFixed(2)}u`);
    });
    console.log('');
    
    console.log('3️⃣  RECOMMENDED STRATEGY:');
    console.log(`   Use: ${bestStrategy.strategyName}`);
    console.log(`   Expected ROI: ${bestStrategy.roi}%`);
    console.log(`   Expected Win Rate: ${bestStrategy.winRate.toFixed(1)}%`);
    console.log('');
    
    console.log('4️⃣  IMPLEMENTATION CHANGES NEEDED:');
    console.log('   File: nhl-savant/src/utils/staggeredUnits.js');
    console.log('   Action: Update UNIT_ALLOCATION with new values');
    console.log('');
    console.log('   File: nhl-savant/scripts/writeBasketballBets.js');
    console.log('   Action: Add filter to skip unprofitable grades');
    console.log('');
    
    // ========================================================================
    // SAVE FULL REPORT
    // ========================================================================
    const reportPath = join(__dirname, '../COLLEGE_BASKETBALL_AUDIT_REPORT.md');
    const reportLines = [
      '# 🏀 COLLEGE BASKETBALL BETTING AUDIT REPORT',
      '',
      `**Date:** ${new Date().toLocaleDateString()}`,
      `**Total Bets Analyzed:** ${gradedBets.length}`,
      `**Current ROI:** ${overallROI.toFixed(2)}%`,
      '',
      '---',
      '',
      '## 📊 Overall Performance',
      '',
      `- **Total Bets:** ${totalBets}`,
      `- **Win Rate:** ${overallWinRate.toFixed(1)}%`,
      `- **Total Risked:** ${totalRisked.toFixed(2)} units`,
      `- **Total Profit:** ${totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(2)} units`,
      `- **ROI:** ${overallROI >= 0 ? '+' : ''}${overallROI.toFixed(2)}%`,
      '',
      '---',
      '',
      '## 🎯 Performance by Grade',
      '',
      '| Grade | Bets | Wins | Losses | Win% | Units Risked | Profit | ROI% | Avg Odds | Avg EV% | Status |',
      '|-------|------|------|--------|------|--------------|--------|------|----------|---------|--------|'
    ];
    
    for (const [grade, stats] of sortedGrades) {
      reportLines.push(
        `| ${grade} | ${stats.bets} | ${stats.wins} | ${stats.losses} | ${stats.winRate.toFixed(1)}% | ${stats.totalRisked.toFixed(2)} | ${stats.totalProfit >= 0 ? '+' : ''}${stats.totalProfit.toFixed(2)} | ${stats.roi >= 0 ? '+' : ''}${stats.roi.toFixed(1)}% | ${stats.avgOdds >= 0 ? '+' : ''}${stats.avgOdds.toFixed(0)} | ${stats.avgEV >= 0 ? '+' : ''}${stats.avgEV.toFixed(1)}% | ${stats.status} |`
      );
    }
    
    reportLines.push('', '---', '', '## 💡 Strategy Comparison', '');
    reportLines.push('| Strategy | Bets | Wins | Win% | Risked | Profit | ROI% |');
    reportLines.push('|----------|------|------|------|--------|--------|------|');
    
    for (const sim of simulations) {
      reportLines.push(
        `| ${sim.strategyName} | ${sim.totalBets} | ${sim.wins} | ${sim.winRate.toFixed(1)}% | ${sim.totalRisked}u | ${parseFloat(sim.totalProfit) >= 0 ? '+' : ''}${sim.totalProfit}u | ${parseFloat(sim.roi) >= 0 ? '+' : ''}${sim.roi}% |`
      );
    }
    
    reportLines.push('', '---', '', '## 🎯 Recommendations', '');
    reportLines.push('', '### 1. Grades to Eliminate');
    losingGrades.forEach(([grade, stats]) => {
      reportLines.push(`- **${grade}**: ${stats.bets} bets, ${stats.winRate.toFixed(1)}% win rate, ${stats.roi.toFixed(1)}% ROI → **ELIMINATE**`);
    });
    
    reportLines.push('', '### 2. Profitable Grades');
    profitableGrades.forEach(([grade, stats]) => {
      const kellyUnit = calculateKellyUnit(stats.winRate, stats.avgOdds);
      reportLines.push(`- **${grade}**: ${stats.bets} bets, ${stats.winRate.toFixed(1)}% win rate, ${stats.roi.toFixed(1)}% ROI → **Kelly: ${kellyUnit.toFixed(2)}u**`);
    });
    
    reportLines.push('', `### 3. Best Strategy: ${bestStrategy.strategyName}`, '');
    reportLines.push(`- Expected ROI: **${bestStrategy.roi}%**`);
    reportLines.push(`- Expected Win Rate: **${bestStrategy.winRate.toFixed(1)}%**`);
    reportLines.push(`- Total Profit: **${bestStrategy.totalProfit}u**`);
    
    await fs.writeFile(reportPath, reportLines.join('\n'));
    console.log(`📄 Full report saved to: ${reportPath}\n`);
    
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║                    ✅ AUDIT COMPLETE                           ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');
    
  } catch (error) {
    console.error('❌ Error during audit:', error);
    throw error;
  }
}

// Run audit
auditCollegeBasketballBets()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

