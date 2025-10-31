/**
 * Bayesian Totals Model Backtest
 * 
 * Tests the Bayesian Over/Under model against historical betting data:
 * 1. Extracts totals lines from Firebase saved bets
 * 2. Generates Bayesian probabilities for each game
 * 3. Makes betting recommendations (OVER/UNDER/NO BET)
 * 4. Calculates win rate and ROI vs actual results
 * 
 * Run with: npm run test:bayesian
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import Papa from 'papaparse';
import { NHLDataProcessor } from '../src/utils/dataProcessing.js';
import { GoalieProcessor } from '../src/utils/goalieProcessor.js';
import { TotalsSignals } from '../src/utils/totalsSignals.js';
import { BayesianCombiner } from '../src/utils/bayesianCombiner.js';
import { TotalsDecisionEngine } from '../src/utils/totalsDecisionEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

console.log('\n╔══════════════════════════════════════════════════════════════╗');
console.log('║          BAYESIAN TOTALS MODEL - HISTORICAL BACKTEST         ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

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

// Team name mapping
const TEAM_MAP = {
  'Chicago Blackhawks': 'CHI', 'Florida Panthers': 'FLA', 'Pittsburgh Penguins': 'PIT',
  'New York Rangers': 'NYR', 'Colorado Avalanche': 'COL', 'Los Angeles Kings': 'LAK',
  'Montreal Canadiens': 'MTL', 'Toronto Maple Leafs': 'TOR', 'Boston Bruins': 'BOS',
  'Washington Capitals': 'WSH', 'Detroit Red Wings': 'DET', 'Ottawa Senators': 'OTT',
  'Tampa Bay Lightning': 'TBL', 'Philadelphia Flyers': 'PHI', 'New York Islanders': 'NYI',
  'New Jersey Devils': 'NJD', 'Carolina Hurricanes': 'CAR', 'Columbus Blue Jackets': 'CBJ',
  'Nashville Predators': 'NSH', 'Dallas Stars': 'DAL', 'Winnipeg Jets': 'WPG',
  'Utah Hockey Club': 'UTA', 'Utah Mammoth': 'UTA', 'Calgary Flames': 'CGY', 'Vancouver Canucks': 'VAN',
  'Anaheim Ducks': 'ANA', 'Seattle Kraken': 'SEA', 'St. Louis Blues': 'STL',
  'Buffalo Sabres': 'BUF', 'Minnesota Wild': 'MIN', 'Edmonton Oilers': 'EDM',
  'Vegas Golden Knights': 'VGK', 'San Jose Sharks': 'SJS', 'Arizona Coyotes': 'ARI',
  // Short codes map to themselves
  'CHI': 'CHI', 'FLA': 'FLA', 'PIT': 'PIT', 'NYR': 'NYR', 'COL': 'COL', 'LAK': 'LAK',
  'MTL': 'MTL', 'TOR': 'TOR', 'BOS': 'BOS', 'WSH': 'WSH', 'DET': 'DET', 'OTT': 'OTT',
  'TBL': 'TBL', 'PHI': 'PHI', 'NYI': 'NYI', 'NJD': 'NJD', 'CAR': 'CAR', 'CBJ': 'CBJ',
  'NSH': 'NSH', 'DAL': 'DAL', 'WPG': 'WPG', 'UTA': 'UTA', 'CGY': 'CGY', 'VAN': 'VAN',
  'ANA': 'ANA', 'SEA': 'SEA', 'STL': 'STL', 'BUF': 'BUF', 'MIN': 'MIN', 'EDM': 'EDM',
  'VGK': 'VGK', 'SJS': 'SJS', 'ARI': 'ARI'
};

/**
 * Extract team name from various Firebase bet fields
 */
function extractTeamName(bet, position) {
  // Try different possible fields
  const candidates = [
    bet.game?.[position === 'away' ? 'awayTeam' : 'homeTeam'],
    bet.game?.game?.split('@')?.[position === 'away' ? 0 : 1]?.trim(),
    bet.game?.matchup?.split(' @ ')?.[position === 'away' ? 0 : 1]?.trim(),
    bet.game?.matchup?.split(' vs ')?.[position === 'away' ? 1 : 0]?.trim()
  ];
  
  for (const candidate of candidates) {
    if (candidate && TEAM_MAP[candidate]) {
      return TEAM_MAP[candidate];
    }
  }
  
  return null;
}

/**
 * Parse date from Firebase or CSV format
 */
function parseDate(dateStr) {
  if (!dateStr) return null;
  
  // Handle MM/DD/YYYY format from CSV
  if (dateStr.includes('/')) {
    const [month, day, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  
  // Already in YYYY-MM-DD format
  return dateStr;
}

// ============================================================================
// STEP 1: Extract Historical Totals Lines from Firebase
// ============================================================================
console.log('📥 STEP 1: Extracting historical totals lines from Firebase...\n');

async function getHistoricalTotalsLines() {
  const betsSnapshot = await getDocs(collection(db, 'bets'));
  const linesMap = new Map();
  const betsList = [];
  
  for (const doc of betsSnapshot.docs) {
    const bet = doc.data();
    
    // Only totals bets
    const market = bet.bet?.market || bet.market || '';
    if (!market.includes('TOTAL') && !market.includes('OVER') && !market.includes('UNDER')) {
      continue;
    }
    
    // Extract teams
    const awayTeam = extractTeamName(bet, 'away');
    const homeTeam = extractTeamName(bet, 'home');
    
    if (!awayTeam || !homeTeam) {
      console.warn(`⚠️ Could not extract teams from bet: ${doc.id}`);
      continue;
    }
    
    // Extract line
    const line = bet.bet?.line || bet.line;
    if (!line || line <= 0) {
      console.warn(`⚠️ No valid line for bet: ${doc.id}`);
      continue;
    }
    
    // Extract date
    const date = parseDate(bet.date || bet.game?.date);
    if (!date) {
      console.warn(`⚠️ No valid date for bet: ${doc.id}`);
      continue;
    }
    
    // Extract actual result if available
    const awayScore = bet.result?.awayScore;
    const homeScore = bet.result?.homeScore;
    const actualTotal = (awayScore !== null && homeScore !== null) ? awayScore + homeScore : null;
    
    // Extract goalies
    const awayGoalie = bet.goalies?.away || 'Unknown';
    const homeGoalie = bet.goalies?.home || 'Unknown';
    
    // Extract which side was bet
    const betSide = market.includes('OVER') ? 'OVER' : market.includes('UNDER') ? 'UNDER' : null;
    
    // Store in map
    const key = `${date}_${awayTeam}_${homeTeam}`;
    linesMap.set(key, {
      date,
      awayTeam,
      homeTeam,
      line,
      awayGoalie,
      homeGoalie,
      actualTotal,
      betSide,
      betId: doc.id
    });
    
    betsList.push({
      date,
      awayTeam,
      homeTeam,
      line,
      awayGoalie,
      homeGoalie,
      actualTotal,
      betSide
    });
  }
  
  console.log(`✅ Found ${linesMap.size} totals bets with lines\n`);
  
  return { linesMap, betsList };
}

const { linesMap, betsList } = await getHistoricalTotalsLines();

if (betsList.length === 0) {
  console.log('❌ No historical totals bets found. Cannot proceed with backtest.\n');
  process.exit(1);
}

// ============================================================================
// STEP 2: Initialize Bayesian Model Components
// ============================================================================
console.log('🧠 STEP 2: Initializing Bayesian model components...\n');

const teamsPath = join(__dirname, '..', 'public', 'nhl_data.csv');
const goaliesPath = join(__dirname, '..', 'public', 'goalies.csv');
const gamesPath = join(__dirname, '..', 'public', 'nhl-202526-asplayed.csv');

const teamsData = Papa.parse(readFileSync(teamsPath, 'utf-8'), {
  header: true,
  skipEmptyLines: true,
  dynamicTyping: true
}).data;

const goaliesData = Papa.parse(readFileSync(goaliesPath, 'utf-8'), {
  header: true,
  skipEmptyLines: true,
  dynamicTyping: true
}).data;

const goalieProcessor = new GoalieProcessor(goaliesData);
const dataProcessor = new NHLDataProcessor(teamsData, goalieProcessor, null);
const totalsSignals = new TotalsSignals(dataProcessor, gamesPath);
const bayesianCombiner = new BayesianCombiner();
const decisionEngine = new TotalsDecisionEngine({
  overThreshold: 0.55,  // Need 55%+ confidence for OVER (more aggressive for testing)
  underThreshold: 0.45  // Need 45%- for UNDER (more aggressive for testing)
});

console.log('✅ Model components initialized\n');

// ============================================================================
// STEP 3: Run Bayesian Analysis on Each Bet
// ============================================================================
console.log('🎯 STEP 3: Running Bayesian analysis on historical bets...\n');

const results = [];
let totalBets = 0;
let recommendedBets = 0;
let skippedBets = 0;

for (const bet of betsList) {
  totalBets++;
  
  const { date, awayTeam, homeTeam, line, awayGoalie, homeGoalie, actualTotal, betSide } = bet;
  
  // Skip if no actual result
  if (actualTotal === null) {
    skippedBets++;
    continue;
  }
  
  try {
    // Get all signals
    const signals = totalsSignals.getAllSignals(
      awayTeam,
      homeTeam,
      line,
      awayGoalie,
      homeGoalie,
      date
    );
    
    // Combine signals
    const analysis = bayesianCombiner.combineSignals(line, signals);
    
    // Make decision
    const decision = decisionEngine.decideBet(analysis);
    
    // Debug: Print first 5 analyses to see what probabilities we're getting
    if (results.length < 5) {
      console.log(`\n📊 Sample Analysis #${results.length + 1}: ${awayTeam} @ ${homeTeam}`);
      console.log(`   Vegas Line: ${line} | Actual: ${actualTotal}`);
      console.log(`   OVER Probability: ${(analysis.overProbability * 100).toFixed(1)}%`);
      console.log(`   Recommendation: ${decision.recommendation}`);
      console.log(`   Signals:`);
      for (const sig of analysis.signals) {
        console.log(`     - ${sig.signal}: ${(sig.signalProb * 100).toFixed(1)}% → ${(sig.posterior * 100).toFixed(1)}% (${sig.detail})`);
      }
    }
    
    // Determine if recommendation would have been correct
    let correct = null;
    let profit = 0;
    
    if (decision.recommendation === 'OVER') {
      recommendedBets++;
      correct = actualTotal > line;
      profit = correct ? 0.91 : -1.0; // -110 odds
    } else if (decision.recommendation === 'UNDER') {
      recommendedBets++;
      correct = actualTotal < line;
      profit = correct ? 0.91 : -1.0; // -110 odds
    } else {
      // NO BET
      correct = null;
      profit = 0;
    }
    
    results.push({
      date,
      matchup: `${awayTeam} @ ${homeTeam}`,
      line,
      actualTotal,
      recommendation: decision.recommendation,
      probability: decision.probability,
      edge: decision.edge,
      correct,
      profit,
      analysis
    });
    
  } catch (error) {
    console.warn(`⚠️ Error analyzing ${awayTeam} @ ${homeTeam} on ${date}: ${error.message}`);
    skippedBets++;
  }
}

console.log(`✅ Analyzed ${totalBets} bets\n`);
console.log(`   • Recommended: ${recommendedBets} bets`);
console.log(`   • No Bet: ${totalBets - recommendedBets - skippedBets} bets`);
console.log(`   • Skipped: ${skippedBets} bets\n`);

// ============================================================================
// STEP 4: Calculate Performance Metrics
// ============================================================================
console.log('📊 STEP 4: Calculating performance metrics...\n');

const recommendedResults = results.filter(r => r.recommendation !== 'NO BET' && r.correct !== null);

if (recommendedResults.length === 0) {
  console.log('❌ No recommended bets to analyze. Model may be too conservative.\n');
  process.exit(1);
}

const wins = recommendedResults.filter(r => r.correct).length;
const losses = recommendedResults.filter(r => !r.correct).length;
const totalProfit = recommendedResults.reduce((sum, r) => sum + r.profit, 0);
const totalStaked = recommendedResults.length; // Assuming $1 per bet
const roi = (totalProfit / totalStaked) * 100;
const winRate = (wins / recommendedResults.length) * 100;

// Calculate by recommendation type
const overBets = recommendedResults.filter(r => r.recommendation === 'OVER');
const underBets = recommendedResults.filter(r => r.recommendation === 'UNDER');

const overWins = overBets.filter(r => r.correct).length;
const overWinRate = overBets.length > 0 ? (overWins / overBets.length) * 100 : 0;

const underWins = underBets.filter(r => r.correct).length;
const underWinRate = underBets.length > 0 ? (underWins / underBets.length) * 100 : 0;

// ============================================================================
// STEP 5: Generate Report
// ============================================================================
console.log('═'.repeat(70));
console.log('                 BAYESIAN TOTALS MODEL PERFORMANCE');
console.log('═'.repeat(70));
console.log('');
console.log(`Total Historical Bets: ${totalBets}`);
console.log(`Model Recommendations: ${recommendedBets} (${((recommendedBets / totalBets) * 100).toFixed(1)}% selectivity)`);
console.log('');
console.log('OVERALL PERFORMANCE:');
console.log(`  Win Rate:  ${winRate.toFixed(1)}% (${wins}W - ${losses}L)`);
console.log(`  ROI:       ${roi > 0 ? '+' : ''}${roi.toFixed(2)}%`);
console.log(`  Profit:    ${totalProfit > 0 ? '+' : ''}${totalProfit.toFixed(2)} units`);
console.log('');
console.log('BREAKDOWN BY RECOMMENDATION:');
console.log(`  OVER:  ${overWinRate.toFixed(1)}% (${overWins}W - ${overBets.length - overWins}L) from ${overBets.length} bets`);
console.log(`  UNDER: ${underWinRate.toFixed(1)}% (${underWins}W - ${underBets.length - underWins}L) from ${underBets.length} bets`);
console.log('');
console.log('BENCHMARK:');
console.log(`  Break-even win rate: 52.4% (at -110 odds)`);
console.log(`  Status: ${winRate >= 52.4 ? '✅ PROFITABLE' : '❌ UNPROFITABLE'}`);
console.log('');

// Show top 5 best predictions
const sortedByEdge = recommendedResults.sort((a, b) => b.edge - a.edge);
console.log('TOP 5 HIGHEST-EDGE BETS:');
for (let i = 0; i < Math.min(5, sortedByEdge.length); i++) {
  const bet = sortedByEdge[i];
  const result = bet.correct ? '✅' : '❌';
  console.log(`  ${result} ${bet.matchup} (${bet.date}): ${bet.recommendation} ${bet.line}`);
  console.log(`     Actual: ${bet.actualTotal} | Edge: ${(bet.edge * 100).toFixed(1)}% | Prob: ${(bet.probability * 100).toFixed(1)}%`);
}
console.log('');

// Show worst predictions
const incorrectBets = recommendedResults.filter(r => !r.correct).sort((a, b) => b.edge - a.edge);
if (incorrectBets.length > 0) {
  console.log('TOP 5 HIGHEST-CONFIDENCE LOSSES (to learn from):');
  for (let i = 0; i < Math.min(5, incorrectBets.length); i++) {
    const bet = incorrectBets[i];
    console.log(`  ❌ ${bet.matchup} (${bet.date}): ${bet.recommendation} ${bet.line}`);
    console.log(`     Actual: ${bet.actualTotal} | Edge: ${(bet.edge * 100).toFixed(1)}% | Prob: ${(bet.probability * 100).toFixed(1)}%`);
  }
  console.log('');
}

console.log('═'.repeat(70));

// ============================================================================
// STEP 6: Save Detailed Results
// ============================================================================
const reportPath = join(__dirname, '..', 'BAYESIAN_TOTALS_BACKTEST.md');

const reportLines = [];
reportLines.push('# Bayesian Totals Model - Historical Backtest Results');
reportLines.push('');
reportLines.push(`**Generated:** ${new Date().toISOString()}`);
reportLines.push('');
reportLines.push('## Strategy');
reportLines.push('');
reportLines.push('Start with Vegas totals line (50/50 baseline) and use ensemble of signals to');
reportLines.push('calculate probability of OVER vs UNDER. Only bet when confidence > 60% or < 40%.');
reportLines.push('');
reportLines.push('## Performance Summary');
reportLines.push('');
reportLines.push(`| Metric | Value |`);
reportLines.push(`|--------|-------|`);
reportLines.push(`| Total Historical Bets | ${totalBets} |`);
reportLines.push(`| Model Recommendations | ${recommendedBets} (${((recommendedBets / totalBets) * 100).toFixed(1)}%) |`);
reportLines.push(`| Win Rate | ${winRate.toFixed(1)}% (${wins}W - ${losses}L) |`);
reportLines.push(`| ROI | ${roi > 0 ? '+' : ''}${roi.toFixed(2)}% |`);
reportLines.push(`| Profit | ${totalProfit > 0 ? '+' : ''}${totalProfit.toFixed(2)} units |`);
reportLines.push(`| Break-even Rate | 52.4% |`);
reportLines.push(`| Status | ${winRate >= 52.4 ? '✅ PROFITABLE' : '❌ UNPROFITABLE'} |`);
reportLines.push('');
reportLines.push('## Breakdown by Bet Type');
reportLines.push('');
reportLines.push(`| Type | Win Rate | Record | Bets |`);
reportLines.push(`|------|----------|--------|------|`);
reportLines.push(`| OVER | ${overWinRate.toFixed(1)}% | ${overWins}W - ${overBets.length - overWins}L | ${overBets.length} |`);
reportLines.push(`| UNDER | ${underWinRate.toFixed(1)}% | ${underWins}W - ${underBets.length - underWins}L | ${underBets.length} |`);
reportLines.push('');
reportLines.push('## All Recommendations');
reportLines.push('');
reportLines.push('| Date | Matchup | Line | Actual | Rec | Edge | Result |');
reportLines.push('|------|---------|------|--------|-----|------|--------|');

for (const bet of results.filter(r => r.recommendation !== 'NO BET')) {
  const result = bet.correct === null ? 'PUSH' : bet.correct ? 'WIN' : 'LOSS';
  const icon = bet.correct === null ? '⚖️' : bet.correct ? '✅' : '❌';
  reportLines.push(`| ${bet.date} | ${bet.matchup} | ${bet.line} | ${bet.actualTotal} | ${bet.recommendation} | ${(bet.edge * 100).toFixed(1)}% | ${icon} ${result} |`);
}

reportLines.push('');
reportLines.push('## Conclusion');
reportLines.push('');
if (winRate >= 55) {
  reportLines.push('✅ **EXCELLENT** - Model shows strong predictive power. Ready for deployment.');
} else if (winRate >= 52.4) {
  reportLines.push('✅ **PROFITABLE** - Model beats break-even. Consider deployment with caution.');
} else {
  reportLines.push('❌ **UNPROFITABLE** - Model needs improvement before deployment.');
}
reportLines.push('');
reportLines.push('## Next Steps');
reportLines.push('');
if (winRate >= 55) {
  reportLines.push('1. Integrate with live odds scraper (fetchNHL)');
  reportLines.push('2. Deploy to production EdgeCalculator');
  reportLines.push('3. Monitor performance over 50+ live bets');
  reportLines.push('4. Consider adjusting thresholds if needed');
} else {
  reportLines.push('1. Analyze signal weights and reliability');
  reportLines.push('2. Review highest-confidence losses for patterns');
  reportLines.push('3. Consider adjusting confidence thresholds');
  reportLines.push('4. Retest before deployment');
}

writeFileSync(reportPath, reportLines.join('\n'));
console.log(`\n📄 Detailed report saved to: ${reportPath}\n`);

console.log('✅ Backtest complete!\n');

