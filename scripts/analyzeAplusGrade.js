/**
 * DEEP DIVE ANALYSIS: Why is A+ Grade Losing Money?
 * 
 * A+ grade should be the best picks (≥5% EV), but it's actually losing -6.3% ROI
 * This script analyzes A+ bets in detail to understand the problem
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin
const serviceAccountPath = join(__dirname, '..', 'serviceAccountKey.json');
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

const app = initializeApp({
  credential: cert(serviceAccount)
});
const db = getFirestore(app);

async function analyzeAplusGrade() {
  console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║  🔬 DEEP DIVE: Why is A+ Grade Losing Money?                    ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝\n');
  
  try {
    // Fetch all A+ graded bets
    const betsSnapshot = await db.collection('basketball_bets')
      .where('prediction.grade', '==', 'A+')
      .get();
    
    const aplusBets = betsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(bet => bet.result?.outcome); // Only graded bets
    
    console.log(`📊 Found ${aplusBets.length} graded A+ bets\n`);
    
    if (aplusBets.length === 0) {
      console.log('No A+ bets found.');
      return;
    }
    
    // Categorize by odds ranges
    const oddsRanges = {
      'HEAVY_FAV (-1000+)': { min: -Infinity, max: -1000, bets: [] },
      'BIG_FAV (-500 to -1000)': { min: -1000, max: -500, bets: [] },
      'MOD_FAV (-200 to -500)': { min: -500, max: -200, bets: [] },
      'SLIGHT_FAV (-150 to -200)': { min: -200, max: -150, bets: [] },
      'PICK_EM (-150 to +150)': { min: -150, max: 150, bets: [] },
      'UNDERDOG (+150+)': { min: 150, max: Infinity, bets: [] }
    };
    
    for (const bet of aplusBets) {
      const odds = bet.bet.odds;
      
      for (const [rangeName, range] of Object.entries(oddsRanges)) {
        if (odds >= range.min && odds < range.max) {
          range.bets.push(bet);
          break;
        }
      }
    }
    
    // Analyze each odds range
    console.log('╔═══════════════════════════════════════════════════════════════════════════════════════════╗');
    console.log('║                        A+ PERFORMANCE BY ODDS RANGE                                      ║');
    console.log('╠═══════════════════════╦═══════╦═══════╦═══════╦════════════╦═════════════╦══════════════╣');
    console.log('║ Odds Range            ║  Bets ║  Wins ║  Win% ║ Avg Odds   ║   Profit    ║     ROI%     ║');
    console.log('╠═══════════════════════╬═══════╬═══════╬═══════╬════════════╬═════════════╬══════════════╣');
    
    const rangeStats = [];
    
    for (const [rangeName, range] of Object.entries(oddsRanges)) {
      if (range.bets.length === 0) continue;
      
      const wins = range.bets.filter(b => b.result.outcome === 'WIN').length;
      const losses = range.bets.filter(b => b.result.outcome === 'LOSS').length;
      const winRate = wins / (wins + losses) * 100;
      const avgOdds = range.bets.reduce((sum, b) => sum + b.bet.odds, 0) / range.bets.length;
      const totalProfit = range.bets.reduce((sum, b) => sum + (b.result.profit || 0), 0);
      const totalRisked = range.bets.length * 5; // A+ bets are 5u each
      const roi = (totalProfit / totalRisked) * 100;
      
      // Calculate break-even rate
      const breakEvenRate = avgOdds < 0 
        ? (Math.abs(avgOdds) / (Math.abs(avgOdds) + 100)) * 100
        : (100 / (avgOdds + 100)) * 100;
      
      rangeStats.push({
        rangeName,
        bets: range.bets.length,
        wins,
        losses,
        winRate,
        avgOdds,
        totalProfit,
        roi,
        breakEvenRate
      });
      
      const rangeStr = rangeName.padEnd(21);
      const betsStr = String(range.bets.length).padStart(5);
      const winsStr = String(wins).padStart(5);
      const winRateStr = winRate.toFixed(1).padStart(4) + '%';
      const oddsStr = avgOdds.toFixed(0).padStart(10);
      const profitStr = (totalProfit >= 0 ? '+' : '') + totalProfit.toFixed(2).padStart(11) + 'u';
      const roiStr = (roi >= 0 ? '+' : '') + roi.toFixed(1).padStart(5) + '%';
      
      console.log(`║ ${rangeStr} ║ ${betsStr} ║ ${winsStr} ║ ${winRateStr} ║ ${oddsStr} ║ ${profitStr} ║ ${roiStr}     ║`);
    }
    
    console.log('╚═══════════════════════╩═══════╩═══════╩═══════╩════════════╩═════════════╩══════════════╝\n');
    
    // Detailed findings
    console.log('🔍 DETAILED FINDINGS:\n');
    
    for (const stats of rangeStats) {
      console.log(`📌 ${stats.rangeName}:`);
      console.log(`   - Bets: ${stats.bets}`);
      console.log(`   - Win Rate: ${stats.winRate.toFixed(1)}%`);
      console.log(`   - Break-Even Rate: ${stats.breakEvenRate.toFixed(1)}%`);
      console.log(`   - Delta: ${(stats.winRate - stats.breakEvenRate).toFixed(1)}% ${stats.winRate > stats.breakEvenRate ? '✅' : '❌'}`);
      console.log(`   - ROI: ${stats.roi >= 0 ? '+' : ''}${stats.roi.toFixed(1)}%`);
      console.log(`   - Status: ${stats.roi > 0 ? '✅ PROFITABLE' : '❌ LOSING'}\n`);
    }
    
    // Analyze EV prediction accuracy
    console.log('📊 EV PREDICTION ACCURACY:\n');
    
    const evBuckets = {
      '5-6%': { min: 5, max: 6, bets: [] },
      '6-7%': { min: 6, max: 7, bets: [] },
      '7-8%': { min: 7, max: 8, bets: [] },
      '8-10%': { min: 8, max: 10, bets: [] },
      '10%+': { min: 10, max: Infinity, bets: [] }
    };
    
    for (const bet of aplusBets) {
      const ev = bet.prediction?.evPercent || 0;
      
      for (const [bucketName, bucket] of Object.entries(evBuckets)) {
        if (ev >= bucket.min && ev < bucket.max) {
          bucket.bets.push(bet);
          break;
        }
      }
    }
    
    console.log('╔═══════════════════════════════════════════════════════════════════════════════════╗');
    console.log('║                    A+ PERFORMANCE BY PREDICTED EV%                               ║');
    console.log('╠═══════════════╦═══════╦═══════╦═══════╦══════════╦═════════════╦═════════════════╣');
    console.log('║ EV% Bucket    ║  Bets ║  Wins ║  Win% ║ Avg EV%  ║   Profit    ║     ROI%        ║');
    console.log('╠═══════════════╬═══════╬═══════╬═══════╬══════════╬═════════════╬═════════════════╣');
    
    for (const [bucketName, bucket] of Object.entries(evBuckets)) {
      if (bucket.bets.length === 0) continue;
      
      const wins = bucket.bets.filter(b => b.result.outcome === 'WIN').length;
      const winRate = bucket.bets.length > 0 ? (wins / bucket.bets.length) * 100 : 0;
      const avgEV = bucket.bets.reduce((sum, b) => sum + (b.prediction?.evPercent || 0), 0) / bucket.bets.length;
      const totalProfit = bucket.bets.reduce((sum, b) => sum + (b.result.profit || 0), 0);
      const totalRisked = bucket.bets.length * 5;
      const roi = (totalProfit / totalRisked) * 100;
      
      const bucketStr = bucketName.padEnd(13);
      const betsStr = String(bucket.bets.length).padStart(5);
      const winsStr = String(wins).padStart(5);
      const winRateStr = winRate.toFixed(1).padStart(4) + '%';
      const evStr = avgEV.toFixed(1).padStart(5) + '%';
      const profitStr = (totalProfit >= 0 ? '+' : '') + totalProfit.toFixed(2).padStart(11) + 'u';
      const roiStr = (roi >= 0 ? '+' : '') + roi.toFixed(1).padStart(5) + '%';
      
      console.log(`║ ${bucketStr} ║ ${betsStr} ║ ${winsStr} ║ ${winRateStr} ║ ${evStr} ║ ${profitStr} ║ ${roiStr}        ║`);
    }
    
    console.log('╚═══════════════╩═══════╩═══════╩═══════╩══════════╩═════════════╩═════════════════╝\n');
    
    // Look for patterns in losing bets
    const losingBets = aplusBets.filter(b => b.result.outcome === 'LOSS');
    const winningBets = aplusBets.filter(b => b.result.outcome === 'WIN');
    
    console.log('🔴 LOSING BETS ANALYSIS:\n');
    console.log(`Total Losing Bets: ${losingBets.length} (${((losingBets.length / aplusBets.length) * 100).toFixed(1)}%)\n`);
    
    const losingAvgOdds = losingBets.reduce((sum, b) => sum + b.bet.odds, 0) / losingBets.length;
    const losingAvgEV = losingBets.reduce((sum, b) => sum + (b.prediction?.evPercent || 0), 0) / losingBets.length;
    
    console.log(`Average Losing Bet:`);
    console.log(`   - Odds: ${losingAvgOdds.toFixed(0)}`);
    console.log(`   - Predicted EV: ${losingAvgEV.toFixed(2)}%`);
    console.log(`   - Loss per bet: -5.00u (always lose 5u on A+ bets)\n`);
    
    console.log('🟢 WINNING BETS ANALYSIS:\n');
    console.log(`Total Winning Bets: ${winningBets.length} (${((winningBets.length / aplusBets.length) * 100).toFixed(1)}%)\n`);
    
    const winningAvgOdds = winningBets.reduce((sum, b) => sum + b.bet.odds, 0) / winningBets.length;
    const winningAvgEV = winningBets.reduce((sum, b) => sum + (b.prediction?.evPercent || 0), 0) / winningBets.length;
    const winningAvgProfit = winningBets.reduce((sum, b) => sum + (b.result.profit || 0), 0) / winningBets.length;
    
    console.log(`Average Winning Bet:`);
    console.log(`   - Odds: ${winningAvgOdds.toFixed(0)}`);
    console.log(`   - Predicted EV: ${winningAvgEV.toFixed(2)}%`);
    console.log(`   - Profit per bet: +${winningAvgProfit.toFixed(2)}u\n`);
    
    // Calculate the math
    const totalLost = losingBets.length * 5;
    const totalWon = winningBets.reduce((sum, b) => sum + (b.result.profit || 0), 0);
    const netProfit = totalWon - totalLost;
    
    console.log('💰 THE MATH:\n');
    console.log(`Wins: ${winningBets.length} bets × avg +${winningAvgProfit.toFixed(2)}u = +${totalWon.toFixed(2)}u`);
    console.log(`Losses: ${losingBets.length} bets × -5.00u = -${totalLost.toFixed(2)}u`);
    console.log(`Net: ${netProfit >= 0 ? '+' : ''}${netProfit.toFixed(2)}u\n`);
    
    // Recommendations
    console.log('╔═══════════════════════════════════════════════════════════════════╗');
    console.log('║                        RECOMMENDATIONS                            ║');
    console.log('╚═══════════════════════════════════════════════════════════════════╝\n');
    
    const profitableRanges = rangeStats.filter(s => s.roi > 0);
    const losingRanges = rangeStats.filter(s => s.roi <= 0);
    
    if (profitableRanges.length > 0) {
      console.log('✅ KEEP BETTING A+ IN THESE ODDS RANGES:\n');
      profitableRanges.forEach(range => {
        console.log(`   ${range.rangeName}: ${range.bets} bets, ${range.winRate.toFixed(1)}% win rate, ${range.roi >= 0 ? '+' : ''}${range.roi.toFixed(1)}% ROI`);
      });
      console.log('');
    }
    
    if (losingRanges.length > 0) {
      console.log('❌ STOP BETTING A+ IN THESE ODDS RANGES:\n');
      losingRanges.forEach(range => {
        console.log(`   ${range.rangeName}: ${range.bets} bets, ${range.winRate.toFixed(1)}% win rate, ${range.roi >= 0 ? '+' : ''}${range.roi.toFixed(1)}% ROI`);
      });
      console.log('');
    }
    
    console.log('📋 SPECIFIC ACTIONS:\n');
    console.log('1. Filter A+ bets by odds range in writeBasketballBets.js');
    console.log('2. Only bet A+ when odds are in profitable ranges');
    console.log('3. Consider reducing A+ unit size from 5u to 3u');
    console.log('4. Investigate why model is overconfident on heavy favorites\n');
    
    // Save detailed report
    const reportLines = [
      '# 🔬 A+ GRADE DEEP DIVE ANALYSIS',
      '',
      `**Date:** ${new Date().toLocaleDateString()}`,
      `**Total A+ Bets:** ${aplusBets.length}`,
      `**Win Rate:** ${((winningBets.length / aplusBets.length) * 100).toFixed(1)}%`,
      `**ROI:** ${((netProfit / (aplusBets.length * 5)) * 100).toFixed(1)}%`,
      '',
      '---',
      '',
      '## Performance by Odds Range',
      '',
      '| Odds Range | Bets | Wins | Win% | Avg Odds | Profit | ROI% | Break-Even% | Delta | Status |',
      '|------------|------|------|------|----------|--------|------|-------------|-------|--------|'
    ];
    
    for (const stats of rangeStats) {
      reportLines.push(
        `| ${stats.rangeName} | ${stats.bets} | ${stats.wins} | ${stats.winRate.toFixed(1)}% | ${stats.avgOdds.toFixed(0)} | ${stats.totalProfit >= 0 ? '+' : ''}${stats.totalProfit.toFixed(2)}u | ${stats.roi >= 0 ? '+' : ''}${stats.roi.toFixed(1)}% | ${stats.breakEvenRate.toFixed(1)}% | ${(stats.winRate - stats.breakEvenRate).toFixed(1)}% | ${stats.roi > 0 ? '✅' : '❌'} |`
      );
    }
    
    reportLines.push('', '## Key Findings', '');
    reportLines.push(`- **Losing Ranges:** ${losingRanges.map(r => r.rangeName).join(', ')}`);
    reportLines.push(`- **Profitable Ranges:** ${profitableRanges.map(r => r.rangeName).join(', ')}`);
    reportLines.push('', '## Recommendations', '');
    reportLines.push('1. Filter A+ bets to only profitable odds ranges');
    reportLines.push('2. Reduce A+ unit allocation from 5u to 3u');
    reportLines.push('3. Investigate model calibration on heavy favorites');
    
    const reportPath = join(__dirname, '../A_PLUS_GRADE_ANALYSIS.md');
    await fs.writeFile(reportPath, reportLines.join('\n'));
    console.log(`📄 Detailed report saved to: ${reportPath}\n`);
    
    console.log('╔═══════════════════════════════════════════════════════════════════╗');
    console.log('║                    ✅ ANALYSIS COMPLETE                           ║');
    console.log('╚═══════════════════════════════════════════════════════════════════╝\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

// Run analysis
analyzeAplusGrade()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

