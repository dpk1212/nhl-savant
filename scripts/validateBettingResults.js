/**
 * Betting Results Validator
 * 
 * Queries Firebase for all completed bets and calculates actual ROI
 * Validates model predictions against real betting outcomes
 * 
 * Run with: node scripts/validateBettingResults.js
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { writeFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

console.log('\n🎰 BETTING RESULTS VALIDATOR');
console.log('='.repeat(70));

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function validateBettingResults() {
  try {
    console.log('\n📡 Fetching bets from Firebase...\n');
    
    // Get all completed bets
    const betsRef = collection(db, 'bets');
    const completedQuery = query(betsRef, where('status', '==', 'COMPLETED'));
    const snapshot = await getDocs(completedQuery);
    
    console.log(`✅ Found ${snapshot.size} completed bets\n`);
    
    if (snapshot.size === 0) {
      console.log('⚠️  No completed bets found in Firebase');
      console.log('   Make sure bets have been tracked and results updated');
      return;
    }
    
    // Collect all bets
    const bets = [];
    snapshot.forEach(doc => {
      bets.push({ id: doc.id, ...doc.data() });
    });
    
    // Calculate metrics
    const metrics = {
      total: bets.length,
      wins: 0,
      losses: 0,
      pushes: 0,
      totalProfit: 0,
      byMarket: {},
      byRating: {},
      byTier: {},
      predictions: []
    };
    
    bets.forEach(bet => {
      const outcome = bet.result?.outcome;
      const profit = bet.result?.profit || 0;
      const market = bet.bet?.market || 'UNKNOWN';
      const rating = bet.prediction?.rating || 'UNKNOWN';
      const tier = bet.prediction?.confidence || 'UNKNOWN';
      
      // Overall stats
      if (outcome === 'WIN') metrics.wins++;
      if (outcome === 'LOSS') metrics.losses++;
      if (outcome === 'PUSH') metrics.pushes++;
      metrics.totalProfit += profit;
      
      // By market
      if (!metrics.byMarket[market]) {
        metrics.byMarket[market] = { bets: 0, wins: 0, losses: 0, pushes: 0, profit: 0 };
      }
      metrics.byMarket[market].bets++;
      if (outcome === 'WIN') metrics.byMarket[market].wins++;
      if (outcome === 'LOSS') metrics.byMarket[market].losses++;
      if (outcome === 'PUSH') metrics.byMarket[market].pushes++;
      metrics.byMarket[market].profit += profit;
      
      // By rating
      if (!metrics.byRating[rating]) {
        metrics.byRating[rating] = { bets: 0, wins: 0, losses: 0, pushes: 0, profit: 0 };
      }
      metrics.byRating[rating].bets++;
      if (outcome === 'WIN') metrics.byRating[rating].wins++;
      if (outcome === 'LOSS') metrics.byRating[rating].losses++;
      if (outcome === 'PUSH') metrics.byRating[rating].pushes++;
      metrics.byRating[rating].profit += profit;
      
      // By tier
      if (!metrics.byTier[tier]) {
        metrics.byTier[tier] = { bets: 0, wins: 0, losses: 0, pushes: 0, profit: 0 };
      }
      metrics.byTier[tier].bets++;
      if (outcome === 'WIN') metrics.byTier[tier].wins++;
      if (outcome === 'LOSS') metrics.byTier[tier].losses++;
      if (outcome === 'PUSH') metrics.byTier[tier].pushes++;
      metrics.byTier[tier].profit += profit;
      
      // Store prediction details
      metrics.predictions.push({
        date: bet.date,
        game: `${bet.game?.awayTeam} @ ${bet.game?.homeTeam}`,
        market: market,
        pick: bet.bet?.pick,
        odds: bet.bet?.odds,
        predictedScore: `${bet.prediction?.awayScore?.toFixed(2)}-${bet.prediction?.homeScore?.toFixed(2)}`,
        actualScore: `${bet.result?.awayScore}-${bet.result?.homeScore}`,
        outcome: outcome,
        profit: profit.toFixed(2),
        modelProb: bet.prediction?.modelProb ? (bet.prediction.modelProb * 100).toFixed(1) + '%' : 'N/A',
        evPercent: bet.prediction?.evPercent ? bet.prediction.evPercent.toFixed(1) + '%' : 'N/A'
      });
    });
    
    // Calculate win rates and ROI
    const decoratedByMarket = {};
    Object.keys(metrics.byMarket).forEach(market => {
      const m = metrics.byMarket[market];
      const decided = m.wins + m.losses;
      decoratedByMarket[market] = {
        ...m,
        winRate: decided > 0 ? ((m.wins / decided) * 100).toFixed(1) : '0.0',
        roi: m.bets > 0 ? ((m.profit / m.bets) * 100).toFixed(1) : '0.0'
      };
    });
    
    const decoratedByRating = {};
    Object.keys(metrics.byRating).forEach(rating => {
      const r = metrics.byRating[rating];
      const decided = r.wins + r.losses;
      decoratedByRating[rating] = {
        ...r,
        winRate: decided > 0 ? ((r.wins / decided) * 100).toFixed(1) : '0.0',
        roi: r.bets > 0 ? ((r.profit / r.bets) * 100).toFixed(1) : '0.0'
      };
    });
    
    const decoratedByTier = {};
    Object.keys(metrics.byTier).forEach(tier => {
      const t = metrics.byTier[tier];
      const decided = t.wins + t.losses;
      decoratedByTier[tier] = {
        ...t,
        winRate: decided > 0 ? ((t.wins / decided) * 100).toFixed(1) : '0.0',
        roi: t.bets > 0 ? ((t.profit / t.bets) * 100).toFixed(1) : '0.0'
      };
    });
    
    // Print results
    console.log('='.repeat(70));
    console.log('\n📊 OVERALL BETTING PERFORMANCE:\n');
    const decidedBets = metrics.wins + metrics.losses;
    const overallWinRate = decidedBets > 0 ? ((metrics.wins / decidedBets) * 100).toFixed(1) : '0.0';
    const overallROI = metrics.total > 0 ? ((metrics.totalProfit / metrics.total) * 100).toFixed(1) : '0.0';
    
    console.log(`  Total Bets:    ${metrics.total}`);
    console.log(`  Wins:          ${metrics.wins} (${overallWinRate}%)`);
    console.log(`  Losses:        ${metrics.losses}`);
    console.log(`  Pushes:        ${metrics.pushes}`);
    console.log(`  Total Profit:  ${metrics.totalProfit >= 0 ? '+' : ''}${metrics.totalProfit.toFixed(2)} units`);
    console.log(`  ROI:           ${overallROI}%`);
    
    console.log('\n' + '='.repeat(70));
    console.log('\n📈 PERFORMANCE BY MARKET:\n');
    
    Object.keys(decoratedByMarket).forEach(market => {
      const m = decoratedByMarket[market];
      console.log(`  ${market}:`);
      console.log(`    Bets: ${m.bets} | Win Rate: ${m.winRate}% | Profit: ${m.profit >= 0 ? '+' : ''}${m.profit.toFixed(2)}u | ROI: ${m.roi}%`);
    });
    
    console.log('\n' + '='.repeat(70));
    console.log('\n⭐ PERFORMANCE BY RATING:\n');
    
    Object.keys(decoratedByRating).forEach(rating => {
      const r = decoratedByRating[rating];
      console.log(`  ${rating}:`);
      console.log(`    Bets: ${r.bets} | Win Rate: ${r.winRate}% | Profit: ${r.profit >= 0 ? '+' : ''}${r.profit.toFixed(2)}u | ROI: ${r.roi}%`);
    });
    
    console.log('\n' + '='.repeat(70));
    console.log('\n🎯 PERFORMANCE BY CONFIDENCE TIER:\n');
    
    Object.keys(decoratedByTier).forEach(tier => {
      const t = decoratedByTier[tier];
      console.log(`  ${tier}:`);
      console.log(`    Bets: ${t.bets} | Win Rate: ${t.winRate}% | Profit: ${t.profit >= 0 ? '+' : ''}${t.profit.toFixed(2)}u | ROI: ${t.roi}%`);
    });
    
    // Generate markdown report
    const reportLines = [
      '# Betting Results Validation Report',
      '',
      `**Generated:** ${new Date().toLocaleString()}`,
      `**Total Completed Bets:** ${metrics.total}`,
      '',
      '---',
      '',
      '## Overall Performance',
      '',
      `- **Total Bets:** ${metrics.total}`,
      `- **Win Rate:** ${overallWinRate}% (${metrics.wins}W-${metrics.losses}L-${metrics.pushes}P)`,
      `- **Total Profit:** ${metrics.totalProfit >= 0 ? '+' : ''}${metrics.totalProfit.toFixed(2)} units`,
      `- **ROI:** ${overallROI}%`,
      '',
      '---',
      '',
      '## Performance by Market',
      '',
      '| Market | Bets | Win Rate | Profit | ROI |',
      '|--------|------|----------|--------|-----|'
    ];
    
    Object.keys(decoratedByMarket).forEach(market => {
      const m = decoratedByMarket[market];
      reportLines.push(
        `| ${market} | ${m.bets} | ${m.winRate}% (${m.wins}-${m.losses}-${m.pushes}) | ${m.profit >= 0 ? '+' : ''}${m.profit.toFixed(2)}u | ${m.roi}% |`
      );
    });
    
    reportLines.push(
      '',
      '---',
      '',
      '## Performance by Rating',
      '',
      '| Rating | Bets | Win Rate | Profit | ROI |',
      '|--------|------|----------|--------|-----|'
    );
    
    Object.keys(decoratedByRating).forEach(rating => {
      const r = decoratedByRating[rating];
      reportLines.push(
        `| ${rating} | ${r.bets} | ${r.winRate}% (${r.wins}-${r.losses}-${r.pushes}) | ${r.profit >= 0 ? '+' : ''}${r.profit.toFixed(2)}u | ${r.roi}% |`
      );
    });
    
    reportLines.push(
      '',
      '---',
      '',
      '## Performance by Confidence Tier',
      '',
      '| Tier | Bets | Win Rate | Profit | ROI |',
      '|------|------|----------|--------|-----|'
    );
    
    Object.keys(decoratedByTier).forEach(tier => {
      const t = decoratedByTier[tier];
      reportLines.push(
        `| ${tier} | ${t.bets} | ${t.winRate}% (${t.wins}-${t.losses}-${t.pushes}) | ${t.profit >= 0 ? '+' : ''}${t.profit.toFixed(2)}u | ${t.roi}% |`
      );
    });
    
    reportLines.push(
      '',
      '---',
      '',
      '## All Bet Results',
      '',
      '| Date | Game | Market | Pick | Odds | Predicted | Actual | Outcome | Profit |',
      '|------|------|--------|------|------|-----------|--------|---------|--------|'
    );
    
    metrics.predictions.forEach(p => {
      reportLines.push(
        `| ${p.date} | ${p.game} | ${p.market} | ${p.pick} | ${p.odds} | ${p.predictedScore} | ${p.actualScore} | ${p.outcome} | ${p.profit}u |`
      );
    });
    
    // Write report
    const reportPath = join(__dirname, '..', 'BETTING_RESULTS_VALIDATION.md');
    writeFileSync(reportPath, reportLines.join('\n'));
    
    console.log('\n' + '='.repeat(70));
    console.log('\n✅ Validation complete!');
    console.log('📄 Report saved to: BETTING_RESULTS_VALIDATION.md\n');
    
    return {
      total: metrics.total,
      wins: metrics.wins,
      losses: metrics.losses,
      pushes: metrics.pushes,
      winRate: overallWinRate,
      profit: metrics.totalProfit,
      roi: overallROI,
      byMarket: decoratedByMarket,
      byRating: decoratedByRating,
      byTier: decoratedByTier
    };
    
  } catch (error) {
    console.error('\n❌ Error validating betting results:', error);
    console.error(error.stack);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  validateBettingResults()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { validateBettingResults };

