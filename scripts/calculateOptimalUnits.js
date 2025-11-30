/**
 * MATHEMATICAL UNIT SIZING OPTIMIZATION
 * 
 * Analyzes 157 historical bets to calculate mathematically optimal unit sizes
 * for each grade/odds combination using Kelly Criterion and other strategies.
 * 
 * Goal: Find why A+ pick'ems get 5u when they should get <1u
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
// KELLY CRITERION CALCULATIONS
// ============================================================================

function calculateKellyUnits(winRate, avgOdds, fractionalKelly = 0.25, scaleFactor = 20) {
  // Convert American odds to decimal
  const decimalOdds = avgOdds < 0 
    ? (100 / Math.abs(avgOdds)) + 1 
    : (avgOdds / 100) + 1;
  
  const b = decimalOdds - 1; // Net odds multiplier
  const p = winRate / 100; // Win probability
  const q = 1 - p; // Loss probability
  
  // Kelly Criterion: f = (bp - q) / b
  const kellyFraction = (b * p - q) / b;
  
  // Apply fractional Kelly for safety and scale to units
  const units = Math.max(0, kellyFraction * fractionalKelly * scaleFactor);
  
  return {
    kellyFraction,
    kellyUnits: units,
    isPositive: kellyFraction > 0
  };
}

// ============================================================================
// BUILD PERFORMANCE MATRIX
// ============================================================================

function buildPerformanceMatrix(bets) {
  const matrix = {};
  
  for (const bet of bets) {
    if (!bet.result?.outcome) continue; // Skip pending
    
    const grade = bet.prediction?.grade || 'UNKNOWN';
    const odds = bet.bet.odds;
    const oddsRange = getOddsRange(odds);
    const isWin = bet.result.outcome === 'WIN';
    
    const key = `${grade}|${oddsRange}`;
    
    if (!matrix[key]) {
      matrix[key] = {
        grade,
        oddsRange,
        bets: [],
        wins: 0,
        losses: 0,
        totalOdds: 0,
        totalProfit: 0
      };
    }
    
    matrix[key].bets.push(bet);
    matrix[key].totalOdds += odds;
    matrix[key].totalProfit += bet.result.profit || 0;
    
    if (isWin) matrix[key].wins++;
    else matrix[key].losses++;
  }
  
  // Calculate derived metrics
  const processed = {};
  for (const [key, data] of Object.entries(matrix)) {
    const total = data.wins + data.losses;
    const winRate = (data.wins / total) * 100;
    const avgOdds = data.totalOdds / data.bets.length;
    const currentUnits = getUnitSize(data.grade);
    const totalRisked = total * currentUnits;
    const roi = totalRisked > 0 ? (data.totalProfit / totalRisked) * 100 : 0;
    
    // Calculate Kelly units
    const kelly = calculateKellyUnits(winRate, avgOdds);
    
    processed[key] = {
      ...data,
      betCount: total,
      winRate,
      avgOdds,
      currentUnits,
      totalRisked,
      totalProfit: data.totalProfit,
      roi,
      kelly: kelly.kellyUnits,
      kellyFraction: kelly.kellyFraction,
      isKellyPositive: kelly.isPositive
    };
  }
  
  return processed;
}

// ============================================================================
// STRATEGY IMPLEMENTATIONS
// ============================================================================

function simulateStrategy(bets, strategyName, getUnitsFunc) {
  let totalRisked = 0;
  let totalProfit = 0;
  let wins = 0;
  let losses = 0;
  let bankroll = 100; // Starting bankroll in units
  let maxDrawdown = 0;
  let peak = 100;
  const returns = [];
  
  for (const bet of bets) {
    if (!bet.result?.outcome) continue;
    
    const grade = bet.prediction?.grade || 'B';
    const odds = bet.bet.odds;
    const oddsRange = getOddsRange(odds);
    const isWin = bet.result.outcome === 'WIN';
    
    const units = getUnitsFunc(grade, oddsRange, odds);
    
    if (units === 0) continue;
    
    // Calculate profit for this bet
    let profit;
    if (isWin) {
      profit = units * (odds > 0 ? odds / 100 : 100 / Math.abs(odds));
    } else {
      profit = -units;
    }
    
    totalRisked += units;
    totalProfit += profit;
    bankroll += profit;
    
    // Track drawdown
    if (bankroll > peak) peak = bankroll;
    const drawdown = ((peak - bankroll) / peak) * 100;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
    
    returns.push(profit / units); // Return per unit
    
    if (isWin) wins++;
    else losses++;
  }
  
  const roi = totalRisked > 0 ? (totalProfit / totalRisked) * 100 : 0;
  const winRate = wins + losses > 0 ? (wins / (wins + losses)) * 100 : 0;
  
  // Calculate Sharpe ratio (simplified)
  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance);
  const sharpe = stdDev > 0 ? avgReturn / stdDev : 0;
  
  return {
    strategyName,
    totalBets: wins + losses,
    wins,
    losses,
    winRate,
    totalRisked,
    totalProfit,
    roi,
    finalBankroll: bankroll,
    bankrollGrowth: ((bankroll - 100) / 100) * 100,
    maxDrawdown,
    sharpe
  };
}

// ============================================================================
// MAIN ANALYSIS
// ============================================================================

async function calculateOptimalUnits() {
  console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║  🧮 MATHEMATICAL UNIT SIZING OPTIMIZATION                        ║');
  console.log('║  Finding optimal units for each grade/odds combination           ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝\n');
  
  try {
    // Load all basketball bets
    const betsSnapshot = await db.collection('basketball_bets').get();
    const allBets = betsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const gradedBets = allBets.filter(bet => bet.result?.outcome);
    
    console.log(`📊 Loaded ${gradedBets.length} graded bets\n`);
    
    // ========================================================================
    // STEP 1: BUILD PERFORMANCE MATRIX
    // ========================================================================
    console.log('🔨 STEP 1: Building performance matrix (Grade × Odds Range)...\n');
    
    const matrix = buildPerformanceMatrix(gradedBets);
    
    // Sort by grade, then odds range
    const sortedMatrix = Object.entries(matrix).sort((a, b) => {
      const gradeOrder = ['B+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'];
      const oddsOrder = ['EXTREME_FAV', 'BIG_FAV', 'MOD_FAV', 'SLIGHT_FAV', 'PICKEM', 'DOG'];
      
      const gradeCompare = gradeOrder.indexOf(a[1].grade) - gradeOrder.indexOf(b[1].grade);
      if (gradeCompare !== 0) return gradeCompare;
      
      return oddsOrder.indexOf(a[1].oddsRange) - oddsOrder.indexOf(b[1].oddsRange);
    });
    
    console.log('╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗');
    console.log('║                                    PERFORMANCE MATRIX (Grade × Odds Range)                                        ║');
    console.log('╠═══════╦════════════════╦══════╦══════╦═══════╦══════════╦═══════════╦═══════╦═══════════╦═══════════╦═══════════╣');
    console.log('║ Grade ║   Odds Range   ║ Bets ║ Wins ║  Win% ║ Avg Odds ║   Profit  ║  ROI% ║ Curr Unit ║ Kelly Unit║  Status   ║');
    console.log('╠═══════╬════════════════╬══════╬══════╬═══════╬══════════╬═══════════╬═══════╬═══════════╬═══════════╬═══════════╣');
    
    for (const [key, data] of sortedMatrix) {
      const gradeStr = data.grade.padEnd(5);
      const rangeStr = data.oddsRange.padEnd(14);
      const betsStr = String(data.betCount).padStart(4);
      const winsStr = String(data.wins).padStart(4);
      const winRateStr = data.winRate.toFixed(1).padStart(4) + '%';
      const oddsStr = data.avgOdds.toFixed(0).padStart(8);
      const profitStr = (data.totalProfit >= 0 ? '+' : '') + data.totalProfit.toFixed(2).padStart(9) + 'u';
      const roiStr = (data.roi >= 0 ? '+' : '') + data.roi.toFixed(1).padStart(5) + '%';
      const currentStr = data.currentUnits.toFixed(1).padStart(8) + 'u';
      const kellyStr = data.kelly.toFixed(2).padStart(8) + 'u';
      const statusStr = data.roi > 0 ? '✅ PROFIT' : '❌ LOSS';
      
      console.log(`║ ${gradeStr} ║ ${rangeStr} ║ ${betsStr} ║ ${winsStr} ║ ${winRateStr} ║ ${oddsStr} ║ ${profitStr} ║ ${roiStr} ║ ${currentStr} ║ ${kellyStr} ║ ${statusStr}  ║`);
    }
    
    console.log('╚═══════╩════════════════╩══════╩══════╩═══════╩══════════╩═══════════╩═══════╩═══════════╩═══════════╩═══════════╝\n');
    
    // ========================================================================
    // STEP 2: IDENTIFY PROBLEM AREAS
    // ========================================================================
    console.log('🚨 STEP 2: Identifying problem areas...\n');
    
    const problemAreas = sortedMatrix.filter(([_, data]) => 
      data.roi < 0 && data.currentUnits >= 2.0
    );
    
    if (problemAreas.length > 0) {
      console.log('❌ HIGH-RISK LOSING COMBINATIONS (High units + Negative ROI):\n');
      for (const [_, data] of problemAreas) {
        console.log(`   ${data.grade} ${data.oddsRange}:`);
        console.log(`     - Current allocation: ${data.currentUnits}u × ${data.betCount} bets = ${data.totalRisked.toFixed(2)}u risked`);
        console.log(`     - Win rate: ${data.winRate.toFixed(1)}% (${data.wins}-${data.losses})`);
        console.log(`     - Total loss: ${data.totalProfit.toFixed(2)}u (${data.roi.toFixed(1)}% ROI)`);
        console.log(`     - Kelly recommendation: ${data.kelly.toFixed(2)}u (${((data.kelly / data.currentUnits - 1) * 100).toFixed(0)}% change)`);
        console.log('');
      }
    }
    
    // ========================================================================
    // STEP 3: TEST STRATEGIES
    // ========================================================================
    console.log('💡 STEP 3: Testing 8 unit allocation strategies...\n');
    
    const strategies = [];
    
    // Strategy 1: CURRENT (Baseline)
    strategies.push(simulateStrategy(gradedBets, 'CURRENT', (grade, oddsRange, odds) => {
      return getUnitSize(grade);
    }));
    
    // Strategy 2: PURE KELLY
    strategies.push(simulateStrategy(gradedBets, 'PURE KELLY', (grade, oddsRange, odds) => {
      const key = `${grade}|${oddsRange}`;
      return matrix[key]?.kelly || 0;
    }));
    
    // Strategy 3: CAPPED KELLY (max 5u)
    strategies.push(simulateStrategy(gradedBets, 'CAPPED KELLY', (grade, oddsRange, odds) => {
      const key = `${grade}|${oddsRange}`;
      const kelly = matrix[key]?.kelly || 0;
      return Math.min(5, kelly);
    }));
    
    // Strategy 4: FLOORED KELLY (min 0.5u)
    strategies.push(simulateStrategy(gradedBets, 'FLOORED KELLY', (grade, oddsRange, odds) => {
      const key = `${grade}|${oddsRange}`;
      const kelly = matrix[key]?.kelly || 0;
      return kelly > 0 ? Math.max(0.5, kelly) : 0.5;
    }));
    
    // Strategy 5: SIMPLIFIED KELLY (Grade-Only)
    const gradeKelly = {};
    for (const [key, data] of Object.entries(matrix)) {
      if (!gradeKelly[data.grade]) {
        gradeKelly[data.grade] = { totalKelly: 0, count: 0 };
      }
      gradeKelly[data.grade].totalKelly += data.kelly;
      gradeKelly[data.grade].count++;
    }
    for (const grade in gradeKelly) {
      gradeKelly[grade] = gradeKelly[grade].totalKelly / gradeKelly[grade].count;
    }
    
    strategies.push(simulateStrategy(gradedBets, 'SIMPLIFIED KELLY (Grade)', (grade, oddsRange, odds) => {
      return gradeKelly[grade] || 1.0;
    }));
    
    // Strategy 6: SIMPLIFIED KELLY (Odds-Only)
    const oddsKelly = {};
    for (const [key, data] of Object.entries(matrix)) {
      if (!oddsKelly[data.oddsRange]) {
        oddsKelly[data.oddsRange] = { totalKelly: 0, count: 0 };
      }
      oddsKelly[data.oddsRange].totalKelly += data.kelly;
      oddsKelly[data.oddsRange].count++;
    }
    for (const range in oddsKelly) {
      oddsKelly[range] = oddsKelly[range].totalKelly / oddsKelly[range].count;
    }
    
    strategies.push(simulateStrategy(gradedBets, 'SIMPLIFIED KELLY (Odds)', (grade, oddsRange, odds) => {
      return oddsKelly[oddsRange] || 1.0;
    }));
    
    // Strategy 7: INVERTED CURRENT
    strategies.push(simulateStrategy(gradedBets, 'INVERTED CURRENT', (grade, oddsRange, odds) => {
      const key = `${grade}|${oddsRange}`;
      const data = matrix[key];
      if (!data) return 1.0;
      
      // If profitable, use high units; if losing, use low units
      return data.roi > 0 ? 5.0 : 0.5;
    }));
    
    // Strategy 8: HYBRID KELLY-GRADE
    strategies.push(simulateStrategy(gradedBets, 'HYBRID KELLY-GRADE', (grade, oddsRange, odds) => {
      // Use Kelly for proven winners (B+, A), minimal for others
      if (grade === 'B+' || grade === 'A') {
        const key = `${grade}|${oddsRange}`;
        const kelly = matrix[key]?.kelly || 2.0;
        return Math.min(5, Math.max(1, kelly));
      }
      return 0.5; // Minimal for everything else
    }));
    
    // Sort strategies by ROI
    strategies.sort((a, b) => b.roi - a.roi);
    
    console.log('╔═══════════════════════════════════════════════════════════════════════════════════════════════════════════════╗');
    console.log('║                                         STRATEGY COMPARISON                                                  ║');
    console.log('╠═══════════════════════════╦══════╦══════╦═══════╦════════════╦═════════════╦═══════╦══════════╦═══════════╣');
    console.log('║ Strategy                  ║ Bets ║ Wins ║  Win% ║   Risked   ║   Profit    ║  ROI% ║ Bankroll ║  Sharpe   ║');
    console.log('╠═══════════════════════════╬══════╬══════╬═══════╬════════════╬═════════════╬═══════╬══════════╬═══════════╣');
    
    for (const strategy of strategies) {
      const nameStr = strategy.strategyName.padEnd(25);
      const betsStr = String(strategy.totalBets).padStart(4);
      const winsStr = String(strategy.wins).padStart(4);
      const winRateStr = strategy.winRate.toFixed(1).padStart(4) + '%';
      const riskedStr = strategy.totalRisked.toFixed(2).padStart(10) + 'u';
      const profitStr = (strategy.totalProfit >= 0 ? '+' : '') + strategy.totalProfit.toFixed(2).padStart(11) + 'u';
      const roiStr = (strategy.roi >= 0 ? '+' : '') + strategy.roi.toFixed(1).padStart(5) + '%';
      const bankrollStr = strategy.finalBankroll.toFixed(1).padStart(6) + 'u';
      const sharpeStr = strategy.sharpe.toFixed(2).padStart(7);
      
      console.log(`║ ${nameStr} ║ ${betsStr} ║ ${winsStr} ║ ${winRateStr} ║ ${riskedStr} ║ ${profitStr} ║ ${roiStr} ║ ${bankrollStr} ║ ${sharpeStr}   ║`);
    }
    
    console.log('╚═══════════════════════════╩══════╩══════╩═══════╩════════════╩═════════════╩═══════╩══════════╩═══════════╝\n');
    
    const bestStrategy = strategies[0];
    console.log(`🏆 BEST STRATEGY: ${bestStrategy.strategyName}`);
    console.log(`   ROI: ${bestStrategy.roi >= 0 ? '+' : ''}${bestStrategy.roi.toFixed(2)}%`);
    console.log(`   Profit: ${bestStrategy.totalProfit >= 0 ? '+' : ''}${bestStrategy.totalProfit.toFixed(2)}u`);
    console.log(`   Sharpe: ${bestStrategy.sharpe.toFixed(2)}`);
    console.log('');
    
    // ========================================================================
    // STEP 4: GENERATE OPTIMAL UNIT ALLOCATION
    // ========================================================================
    console.log('📋 STEP 4: Generating optimal unit allocation config...\n');
    
    const optimalUnits = {};
    const grades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'];
    const ranges = ['EXTREME_FAV', 'BIG_FAV', 'MOD_FAV', 'SLIGHT_FAV', 'PICKEM', 'DOG'];
    
    for (const grade of grades) {
      optimalUnits[grade] = {};
      for (const range of ranges) {
        const key = `${grade}|${range}`;
        const data = matrix[key];
        
        if (data && data.betCount >= 3) {
          // Use capped Kelly for combinations with enough data
          optimalUnits[grade][range] = Math.min(5, Math.max(0.1, data.kelly));
        } else {
          // Default to 1u for insufficient data
          optimalUnits[grade][range] = 1.0;
        }
      }
    }
    
    // ========================================================================
    // STEP 5: SAVE REPORTS
    // ========================================================================
    console.log('💾 STEP 5: Saving analysis reports...\n');
    
    // Save full analysis
    const analysisLines = [
      '# 🧮 OPTIMAL UNIT SIZING ANALYSIS',
      '',
      `**Date:** ${new Date().toLocaleDateString()}`,
      `**Total Bets Analyzed:** ${gradedBets.length}`,
      '',
      '---',
      '',
      '## Performance Matrix',
      '',
      '| Grade | Odds Range | Bets | Win% | Avg Odds | Profit | ROI% | Current Units | Kelly Units | Status |',
      '|-------|------------|------|------|----------|--------|------|---------------|-------------|--------|'
    ];
    
    for (const [_, data] of sortedMatrix) {
      analysisLines.push(
        `| ${data.grade} | ${data.oddsRange} | ${data.betCount} | ${data.winRate.toFixed(1)}% | ${data.avgOdds.toFixed(0)} | ${data.totalProfit >= 0 ? '+' : ''}${data.totalProfit.toFixed(2)}u | ${data.roi >= 0 ? '+' : ''}${data.roi.toFixed(1)}% | ${data.currentUnits.toFixed(1)}u | ${data.kelly.toFixed(2)}u | ${data.roi > 0 ? '✅' : '❌'} |`
      );
    }
    
    analysisLines.push('', '## Strategy Comparison', '');
    analysisLines.push('| Strategy | Bets | Win% | Risked | Profit | ROI% | Bankroll | Sharpe |');
    analysisLines.push('|----------|------|------|--------|--------|------|----------|--------|');
    
    for (const strategy of strategies) {
      analysisLines.push(
        `| ${strategy.strategyName} | ${strategy.totalBets} | ${strategy.winRate.toFixed(1)}% | ${strategy.totalRisked.toFixed(2)}u | ${strategy.totalProfit >= 0 ? '+' : ''}${strategy.totalProfit.toFixed(2)}u | ${strategy.roi >= 0 ? '+' : ''}${strategy.roi.toFixed(1)}% | ${strategy.finalBankroll.toFixed(1)}u | ${strategy.sharpe.toFixed(2)} |`
      );
    }
    
    analysisLines.push('', `## Recommendation: ${bestStrategy.strategyName}`, '');
    analysisLines.push(`Best performing strategy with ${bestStrategy.roi >= 0 ? '+' : ''}${bestStrategy.roi.toFixed(2)}% ROI.`);
    
    await fs.writeFile(join(__dirname, '../OPTIMAL_UNIT_ANALYSIS.md'), analysisLines.join('\n'));
    console.log('✅ Saved: OPTIMAL_UNIT_ANALYSIS.md');
    
    // Save optimal units config
    const configLines = [
      '/**',
      ' * OPTIMAL UNIT ALLOCATION',
      ' * Generated from historical performance analysis',
      ` * Best Strategy: ${bestStrategy.strategyName}`,
      ` * Expected ROI: ${bestStrategy.roi >= 0 ? '+' : ''}${bestStrategy.roi.toFixed(2)}%`,
      ' */',
      '',
      'export const OPTIMAL_UNITS = ' + JSON.stringify(optimalUnits, null, 2) + ';',
      ''
    ];
    
    await fs.writeFile(join(__dirname, '../RECOMMENDED_UNITS.js'), configLines.join('\n'));
    console.log('✅ Saved: RECOMMENDED_UNITS.js');
    
    // Save strategy comparison
    const comparisonLines = [
      '# 📊 STRATEGY COMPARISON REPORT',
      '',
      `**Analysis Date:** ${new Date().toLocaleDateString()}`,
      `**Historical Bets:** ${gradedBets.length}`,
      '',
      '## Executive Summary',
      '',
      `**Best Strategy:** ${bestStrategy.strategyName}`,
      `**ROI Improvement:** ${(bestStrategy.roi - strategies.find(s => s.strategyName === 'CURRENT').roi).toFixed(2)}% (from ${strategies.find(s => s.strategyName === 'CURRENT').roi.toFixed(2)}% to ${bestStrategy.roi.toFixed(2)}%)`,
      `**Profit Improvement:** +${(bestStrategy.totalProfit - strategies.find(s => s.strategyName === 'CURRENT').totalProfit).toFixed(2)} units`,
      '',
      '## All Strategies Tested',
      ''
    ];
    
    for (const strategy of strategies) {
      comparisonLines.push(`### ${strategy.strategyName}`, '');
      comparisonLines.push(`- **ROI:** ${strategy.roi >= 0 ? '+' : ''}${strategy.roi.toFixed(2)}%`);
      comparisonLines.push(`- **Profit:** ${strategy.totalProfit >= 0 ? '+' : ''}${strategy.totalProfit.toFixed(2)} units`);
      comparisonLines.push(`- **Win Rate:** ${strategy.winRate.toFixed(1)}%`);
      comparisonLines.push(`- **Sharpe Ratio:** ${strategy.sharpe.toFixed(2)}`);
      comparisonLines.push(`- **Final Bankroll:** ${strategy.finalBankroll.toFixed(1)} units`);
      comparisonLines.push('');
    }
    
    await fs.writeFile(join(__dirname, '../STRATEGY_COMPARISON_REPORT.md'), comparisonLines.join('\n'));
    console.log('✅ Saved: STRATEGY_COMPARISON_REPORT.md');
    
    console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
    console.log('║                    ✅ ANALYSIS COMPLETE                           ║');
    console.log('╚═══════════════════════════════════════════════════════════════════╝\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

// Run analysis
calculateOptimalUnits()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

