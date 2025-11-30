/**
 * BUILD OPTIMAL GRADE×ODDS UNIT MATRIX
 * 
 * 1. Extract complete performance matrix from 157 historical bets
 * 2. Test 5 unit allocation strategies
 * 3. Find optimal sizing for each grade/odds combination
 * 4. Simplify to A-B-C grading system
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
// STEP 1: BUILD COMPLETE PERFORMANCE MATRIX
// ============================================================================

function buildPerformanceMatrix(bets) {
  const matrix = {};
  
  for (const bet of bets) {
    if (!bet.result?.outcome) continue; // Skip pending
    
    const grade = bet.prediction?.grade || 'UNKNOWN';
    const odds = bet.bet.odds;
    const oddsRange = getOddsRange(odds);
    const isWin = bet.result.outcome === 'WIN';
    const currentUnits = getUnitSize(grade);
    const profit = bet.result.profit || 0;
    
    const key = `${grade}|${oddsRange}`;
    
    if (!matrix[key]) {
      matrix[key] = {
        grade,
        oddsRange,
        bets: [],
        wins: 0,
        losses: 0,
        totalOdds: 0,
        totalRisked: 0,
        totalProfit: 0
      };
    }
    
    matrix[key].bets.push(bet);
    matrix[key].totalOdds += odds;
    matrix[key].totalRisked += currentUnits;
    matrix[key].totalProfit += profit;
    
    if (isWin) matrix[key].wins++;
    else matrix[key].losses++;
  }
  
  // Calculate derived metrics
  const processed = {};
  for (const [key, data] of Object.entries(matrix)) {
    const total = data.wins + data.losses;
    const winRate = (data.wins / total) * 100;
    const avgOdds = data.totalOdds / data.bets.length;
    const roi = data.totalRisked > 0 ? (data.totalProfit / data.totalRisked) * 100 : 0;
    
    // Calculate break-even rate
    const decimalOdds = avgOdds < 0 ? (100 / Math.abs(avgOdds)) + 1 : (avgOdds / 100) + 1;
    const breakEvenRate = (1 / decimalOdds) * 100;
    
    processed[key] = {
      grade: data.grade,
      oddsRange: data.oddsRange,
      betCount: total,
      wins: data.wins,
      losses: data.losses,
      winRate,
      avgOdds,
      roi,
      totalProfit: data.totalProfit,
      totalRisked: data.totalRisked,
      breakEvenRate,
      sampleSize: total
    };
  }
  
  return processed;
}

// ============================================================================
// STEP 2: UNIT ALLOCATION STRATEGIES
// ============================================================================

// Strategy 1: Kelly-Based
function kellyStrategy(combo) {
  const decimalOdds = combo.avgOdds < 0 
    ? (100 / Math.abs(combo.avgOdds)) + 1 
    : (combo.avgOdds / 100) + 1;
  
  const b = decimalOdds - 1;
  const p = combo.winRate / 100;
  const q = 1 - p;
  
  const kelly = (b * p - q) / b;
  
  // Quarter-Kelly with scale factor of 20
  const units = Math.max(0.5, Math.min(5, kelly * 0.25 * 20));
  
  return units;
}

// Strategy 2: ROI Tiers
function roiTiersStrategy(combo) {
  const roi = combo.roi;
  
  if (roi >= 20) return 5.0;
  if (roi >= 10) return 3.5;
  if (roi >= 5) return 2.5;
  if (roi >= 0) return 1.5;
  return 0.5;
}

// Strategy 3: ROI-Proportional
function roiProportionalStrategy(combo) {
  const units = (combo.roi / 10) * 2.5; // Scale factor
  return Math.max(0.5, Math.min(5, units));
}

// Strategy 4: Confidence-Weighted
function confidenceWeightedStrategy(combo) {
  const sampleConfidence = Math.sqrt(combo.sampleSize) / 5; // Normalize
  const performanceConfidence = combo.winRate / combo.breakEvenRate;
  
  const confidence = sampleConfidence * performanceConfidence;
  const units = confidence * 2; // Base multiplier
  
  return Math.max(0.5, Math.min(5, units));
}

// Strategy 5: Hybrid (Kelly for large samples, ROI tiers for small)
function hybridStrategy(combo) {
  if (combo.sampleSize >= 5) {
    return kellyStrategy(combo);
  } else {
    return roiTiersStrategy(combo);
  }
}

// ============================================================================
// STEP 3: BACKTEST STRATEGY
// ============================================================================

function backtestStrategy(matrix, strategyName, strategyFunc) {
  let totalRisked = 0;
  let totalProfit = 0;
  let wins = 0;
  let losses = 0;
  
  const unitAllocations = {};
  
  for (const [key, combo] of Object.entries(matrix)) {
    const units = strategyFunc(combo);
    unitAllocations[key] = units;
    
    // Recalculate profit with new units
    const oldUnits = combo.totalRisked / combo.betCount; // Average old units
    const profitPerBet = combo.totalProfit / combo.betCount;
    const profitPerUnit = profitPerBet / oldUnits;
    
    const newProfit = profitPerUnit * units * combo.betCount;
    const newRisked = units * combo.betCount;
    
    totalRisked += newRisked;
    totalProfit += newProfit;
    wins += combo.wins;
    losses += combo.losses;
  }
  
  const roi = totalRisked > 0 ? (totalProfit / totalRisked) * 100 : 0;
  const winRate = wins + losses > 0 ? (wins / (wins + losses)) * 100 : 0;
  
  return {
    strategyName,
    totalBets: wins + losses,
    wins,
    losses,
    winRate,
    totalRisked,
    totalProfit,
    roi,
    unitAllocations
  };
}

// ============================================================================
// STEP 4: SIMPLIFY TO A-B-C
// ============================================================================

function simplifyToABC(matrix, optimalUnits) {
  // Map current grades to A/B/C based on performance
  const gradeMapping = {
    'A+': 'A',
    'A': 'A',
    'A-': 'A',
    'B+': 'B',
    'B': 'B',
    'B-': 'B',
    'C+': 'C',
    'C': 'C',
    'C-': 'C',
    'D': 'C',
    'F': 'C'
  };
  
  const abcMatrix = {};
  const oddsRanges = ['EXTREME_FAV', 'BIG_FAV', 'MOD_FAV', 'SLIGHT_FAV', 'PICKEM', 'DOG'];
  
  // Initialize
  for (const newGrade of ['A', 'B', 'C']) {
    abcMatrix[newGrade] = {};
    for (const range of oddsRanges) {
      abcMatrix[newGrade][range] = {
        units: [],
        combos: [],
        totalROI: 0,
        count: 0
      };
    }
  }
  
  // Aggregate data
  for (const [key, combo] of Object.entries(matrix)) {
    const newGrade = gradeMapping[combo.grade] || 'C';
    const range = combo.oddsRange;
    const units = optimalUnits[key];
    
    abcMatrix[newGrade][range].units.push(units);
    abcMatrix[newGrade][range].combos.push(combo);
    abcMatrix[newGrade][range].totalROI += combo.roi;
    abcMatrix[newGrade][range].count++;
  }
  
  // Calculate averages
  const simplified = {};
  for (const grade of ['A', 'B', 'C']) {
    simplified[grade] = {};
    for (const range of oddsRanges) {
      const data = abcMatrix[grade][range];
      
      if (data.count > 0) {
        // Average units weighted by ROI
        const avgUnits = data.units.reduce((sum, u) => sum + u, 0) / data.units.length;
        const avgROI = data.totalROI / data.count;
        
        simplified[grade][range] = {
          units: Math.round(avgUnits * 2) / 2, // Round to nearest 0.5
          avgROI,
          sampleSize: data.count,
          source: data.combos.map(c => c.grade).join('+')
        };
      } else {
        // No data - use conservative default
        simplified[grade][range] = {
          units: grade === 'A' ? 3.0 : (grade === 'B' ? 2.0 : 1.0),
          avgROI: 0,
          sampleSize: 0,
          source: 'default'
        };
      }
    }
  }
  
  return simplified;
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

async function buildOptimalMatrix() {
  console.log('\n╔════════════════════════════════════════════════════════════════════╗');
  console.log('║  🎯 BUILD OPTIMAL GRADE×ODDS UNIT MATRIX                          ║');
  console.log('╚════════════════════════════════════════════════════════════════════╝\n');
  
  try {
    // Load all basketball bets
    const betsSnapshot = await db.collection('basketball_bets').get();
    const allBets = betsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const gradedBets = allBets.filter(bet => bet.result?.outcome);
    
    console.log(`📊 Loaded ${gradedBets.length} graded bets\n`);
    
    // ========================================================================
    // STEP 1: BUILD PERFORMANCE MATRIX
    // ========================================================================
    console.log('🔨 STEP 1: Building complete performance matrix...\n');
    
    const matrix = buildPerformanceMatrix(gradedBets);
    
    console.log(`✅ Built matrix with ${Object.keys(matrix).length} grade×odds combinations\n`);
    
    // Display matrix
    console.log('╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗');
    console.log('║                          COMPLETE PERFORMANCE MATRIX                                             ║');
    console.log('╠═══════╦════════════════╦══════╦══════╦═══════╦══════════╦═══════════╦═══════════════════════════╣');
    console.log('║ Grade ║   Odds Range   ║ Bets ║ Wins ║  Win% ║ Avg Odds ║   Profit  ║          ROI%             ║');
    console.log('╠═══════╬════════════════╬══════╬══════╬═══════╬══════════╬═══════════╬═══════════════════════════╣');
    
    // Sort by grade then odds range
    const sortedMatrix = Object.entries(matrix).sort((a, b) => {
      const gradeOrder = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'];
      const gradeCompare = gradeOrder.indexOf(a[1].grade) - gradeOrder.indexOf(b[1].grade);
      if (gradeCompare !== 0) return gradeCompare;
      
      const oddsOrder = ['EXTREME_FAV', 'BIG_FAV', 'MOD_FAV', 'SLIGHT_FAV', 'PICKEM', 'DOG'];
      return oddsOrder.indexOf(a[1].oddsRange) - oddsOrder.indexOf(b[1].oddsRange);
    });
    
    for (const [key, combo] of sortedMatrix) {
      const gradeStr = combo.grade.padEnd(5);
      const rangeStr = combo.oddsRange.padEnd(14);
      const betsStr = String(combo.betCount).padStart(4);
      const winsStr = String(combo.wins).padStart(4);
      const winRateStr = combo.winRate.toFixed(1).padStart(4) + '%';
      const oddsStr = combo.avgOdds.toFixed(0).padStart(8);
      const profitStr = (combo.totalProfit >= 0 ? '+' : '') + combo.totalProfit.toFixed(2).padStart(9) + 'u';
      const roiStr = (combo.roi >= 0 ? '+' : '') + combo.roi.toFixed(1).padStart(5) + '%';
      const status = combo.roi > 0 ? '✅' : '❌';
      
      console.log(`║ ${gradeStr} ║ ${rangeStr} ║ ${betsStr} ║ ${winsStr} ║ ${winRateStr} ║ ${oddsStr} ║ ${profitStr} ║ ${roiStr} ${status}                ║`);
    }
    
    console.log('╚═══════╩════════════════╩══════╩══════╩═══════╩══════════╩═══════════╩═══════════════════════════╝\n');
    
    // ========================================================================
    // STEP 2-3: TEST STRATEGIES
    // ========================================================================
    console.log('💡 STEP 2-3: Testing unit allocation strategies...\n');
    
    const strategies = [
      { name: 'Kelly-Based', func: kellyStrategy },
      { name: 'ROI Tiers', func: roiTiersStrategy },
      { name: 'ROI-Proportional', func: roiProportionalStrategy },
      { name: 'Confidence-Weighted', func: confidenceWeightedStrategy },
      { name: 'Hybrid', func: hybridStrategy }
    ];
    
    const results = [];
    
    for (const strategy of strategies) {
      const result = backtestStrategy(matrix, strategy.name, strategy.func);
      results.push(result);
    }
    
    // Sort by ROI
    results.sort((a, b) => b.roi - a.roi);
    
    console.log('╔════════════════════════════════════════════════════════════════════════════════════════════╗');
    console.log('║                           STRATEGY COMPARISON                                             ║');
    console.log('╠═══════════════════════════╦══════╦══════╦═══════╦════════════╦═════════════╦══════════════╣');
    console.log('║ Strategy                  ║ Bets ║ Wins ║  Win% ║   Risked   ║   Profit    ║     ROI%     ║');
    console.log('╠═══════════════════════════╬══════╬══════╬═══════╬════════════╬═════════════╬══════════════╣');
    
    for (const result of results) {
      const nameStr = result.strategyName.padEnd(25);
      const betsStr = String(result.totalBets).padStart(4);
      const winsStr = String(result.wins).padStart(4);
      const winRateStr = result.winRate.toFixed(1).padStart(4) + '%';
      const riskedStr = result.totalRisked.toFixed(1).padStart(10) + 'u';
      const profitStr = (result.totalProfit >= 0 ? '+' : '') + result.totalProfit.toFixed(2).padStart(11) + 'u';
      const roiStr = (result.roi >= 0 ? '+' : '') + result.roi.toFixed(1).padStart(5) + '%';
      
      console.log(`║ ${nameStr} ║ ${betsStr} ║ ${winsStr} ║ ${winRateStr} ║ ${riskedStr} ║ ${profitStr} ║ ${roiStr}     ║`);
    }
    
    console.log('╚═══════════════════════════╩══════╩══════╩═══════╩════════════╩═════════════╩══════════════╝\n');
    
    const bestStrategy = results[0];
    console.log(`🏆 BEST STRATEGY: ${bestStrategy.strategyName} (ROI: ${bestStrategy.roi.toFixed(2)}%)\n`);
    
    // ========================================================================
    // STEP 4: SIMPLIFY TO A-B-C
    // ========================================================================
    console.log('📋 STEP 4: Simplifying to A-B-C grading system...\n');
    
    const abcMatrix = simplifyToABC(matrix, bestStrategy.unitAllocations);
    
    console.log('╔═══════════════════════════════════════════════════════════════════════════════════════════╗');
    console.log('║                          A-B-C SIMPLIFIED MATRIX                                         ║');
    console.log('╠═══════╦════════════════╦═══════╦═══════════╦════════════╦═══════════════════════════════╣');
    console.log('║ Grade ║   Odds Range   ║ Units ║ Avg ROI%  ║ Sample     ║         Source                ║');
    console.log('╠═══════╬════════════════╬═══════╬═══════════╬════════════╬═══════════════════════════════╣');
    
    for (const grade of ['A', 'B', 'C']) {
      for (const range of ['EXTREME_FAV', 'BIG_FAV', 'MOD_FAV', 'SLIGHT_FAV', 'PICKEM', 'DOG']) {
        const data = abcMatrix[grade][range];
        
        const gradeStr = grade.padEnd(5);
        const rangeStr = range.padEnd(14);
        const unitsStr = data.units.toFixed(1).padStart(5) + 'u';
        const roiStr = (data.avgROI >= 0 ? '+' : '') + data.avgROI.toFixed(1).padStart(5) + '%';
        const sampleStr = String(data.sampleSize).padStart(6) + ' bets';
        const sourceStr = data.source.padEnd(27);
        
        console.log(`║ ${gradeStr} ║ ${rangeStr} ║ ${unitsStr} ║ ${roiStr}   ║ ${sampleStr} ║ ${sourceStr}   ║`);
      }
    }
    
    console.log('╚═══════╩════════════════╩═══════╩═══════════╩════════════╩═══════════════════════════════╝\n');
    
    // ========================================================================
    // STEP 5: SAVE RESULTS
    // ========================================================================
    console.log('💾 Saving results...\n');
    
    // Save optimal units (full matrix)
    await fs.writeFile(
      join(__dirname, '../OPTIMAL_UNIT_MATRIX.json'),
      JSON.stringify(bestStrategy.unitAllocations, null, 2)
    );
    console.log('✅ Saved: OPTIMAL_UNIT_MATRIX.json');
    
    // Save A-B-C simplified matrix
    await fs.writeFile(
      join(__dirname, '../ABC_UNIT_MATRIX.json'),
      JSON.stringify(abcMatrix, null, 2)
    );
    console.log('✅ Saved: ABC_UNIT_MATRIX.json');
    
    // Save full report
    const reportLines = [
      '# 🎯 OPTIMAL UNIT MATRIX RESULTS',
      '',
      `**Date:** ${new Date().toLocaleDateString()}`,
      `**Bets Analyzed:** ${gradedBets.length}`,
      `**Best Strategy:** ${bestStrategy.strategyName}`,
      `**Projected ROI:** ${bestStrategy.roi.toFixed(2)}%`,
      '',
      '---',
      '',
      '## A-B-C Simplified Matrix',
      '',
      '| Grade | Odds Range | Units | Avg ROI | Sample Size | Source |',
      '|-------|------------|-------|---------|-------------|--------|'
    ];
    
    for (const grade of ['A', 'B', 'C']) {
      for (const range of ['EXTREME_FAV', 'BIG_FAV', 'MOD_FAV', 'SLIGHT_FAV', 'PICKEM', 'DOG']) {
        const data = abcMatrix[grade][range];
        reportLines.push(
          `| ${grade} | ${range} | ${data.units.toFixed(1)}u | ${data.avgROI >= 0 ? '+' : ''}${data.avgROI.toFixed(1)}% | ${data.sampleSize} bets | ${data.source} |`
        );
      }
    }
    
    reportLines.push('', '## Implementation Example', '');
    reportLines.push('```javascript');
    reportLines.push('// Usage:');
    reportLines.push('const grade = getCurrentGrade(predictedEV);  // A, B, or C');
    reportLines.push('const oddsRange = getOddsRange(odds);        // EXTREME_FAV, BIG_FAV, etc.');
    reportLines.push('const units = ABC_MATRIX[grade][oddsRange];');
    reportLines.push('```');
    
    await fs.writeFile(join(__dirname, '../OPTIMIZATION_RESULTS.md'), reportLines.join('\n'));
    console.log('✅ Saved: OPTIMIZATION_RESULTS.md');
    
    console.log('\n╔════════════════════════════════════════════════════════════════════╗');
    console.log('║                    ✅ OPTIMIZATION COMPLETE                        ║');
    console.log('╚════════════════════════════════════════════════════════════════════╝\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

// Run optimization
buildOptimalMatrix()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

