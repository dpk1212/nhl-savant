/**
 * Ensemble Model Backtest Against Actual Betting History
 * 
 * 1. Predicts ALL completed 2025-26 games with both models
 * 2. Matches predictions to actual bets from Firebase
 * 3. Calculates what results would have been with ensemble
 * 4. Compares performance side-by-side
 * 
 * Run with: node scripts/backtestEnsembleVsActual.js
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import Papa from 'papaparse';
import { NHLDataProcessor } from '../src/utils/dataProcessing.js';
import { TotalsEnsemble } from '../src/utils/totalsEnsemble.js';
import { GoalieProcessor } from '../src/utils/goalieProcessor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

console.log('\n╔══════════════════════════════════════════════════════════════╗');
console.log('║     ENSEMBLE BACKTEST - ACTUAL BETTING HISTORY COMPARISON    ║');
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
  'Utah Hockey Club': 'UTA', 'Calgary Flames': 'CGY', 'Vancouver Canucks': 'VAN',
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

// STEP 1: Generate predictions for all completed games
console.log('📊 STEP 1: Generating predictions for all completed games...\n');

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
const totalsEnsemble = new TotalsEnsemble(dataProcessor, gamesPath);

// Load all completed games
const gamesRaw = Papa.parse(readFileSync(gamesPath, 'utf-8'), {
  header: false,
  skipEmptyLines: true
});

const allGames = gamesRaw.data.slice(1); // Skip header
const regulationGames = allGames.filter(row => {
  if (row.length < 8) return false;
  return row[7] === 'Regulation';
});

console.log(`   Found ${regulationGames.length} regulation games to predict\n`);

// Generate predictions for all games
const gamePredictions = {};
let predictionsGenerated = 0;

console.log('   Generating predictions...\n');

for (const row of regulationGames) {
  try {
    const csvDate = row[0]; // Format: "10/22/2025"
    const awayTeam = row[3];
    const homeTeam = row[5];
    const awayScore = parseInt(row[4]);
    const homeScore = parseInt(row[6]);
    const awayGoalie = row[8];
    const homeGoalie = row[9];
    
    // Convert date from "10/22/2025" to "2025-10-22" format
    const dateParts = csvDate.split('/');
    const date = dateParts.length === 3 
      ? `${dateParts[2]}-${dateParts[0].padStart(2, '0')}-${dateParts[1].padStart(2, '0')}`
      : csvDate;
    
    const awayCode = TEAM_MAP[awayTeam];
    const homeCode = TEAM_MAP[homeTeam];
    
    if (!awayCode || !homeCode) continue;
    
    // Current model predictions
    const currentAwayScore = dataProcessor.predictTeamScore(
      awayCode, homeCode, false, awayGoalie, date
    );
    const currentHomeScore = dataProcessor.predictTeamScore(
      homeCode, awayCode, true, homeGoalie, date
    );
    const currentTotal = currentAwayScore + currentHomeScore;
    const currentHomeWinProb = dataProcessor.calculatePoissonWinProb(
      currentHomeScore, currentAwayScore
    );
    
    // Ensemble prediction
    const ensembleTotal = totalsEnsemble.predictGameTotal(
      awayCode, homeCode, awayGoalie, homeGoalie, date
    );
    
    // Store predictions with multiple key formats for matching
    const gameKey1 = `${awayCode}@${homeCode}_${date}`;
    const gameKey2 = `${awayTeam}@${homeTeam}_${date}`;
    const gameKey3 = `${awayCode} @ ${homeCode}_${date}`;
    const gameKey4 = `${awayTeam} @ ${homeTeam}_${date}`;
    
    const prediction = {
      date,
      awayTeam,
      homeTeam,
      awayCode,
      homeCode,
      actualAwayScore: awayScore,
      actualHomeScore: homeScore,
      actualTotal: awayScore + homeScore,
      currentModel: {
        awayScore: currentAwayScore,
        homeScore: currentHomeScore,
        total: currentTotal,
        homeWinProb: currentHomeWinProb
      },
      ensembleModel: {
        total: ensembleTotal
      }
    };
    
    gamePredictions[gameKey1] = prediction;
    gamePredictions[gameKey2] = prediction;
    gamePredictions[gameKey3] = prediction;
    gamePredictions[gameKey4] = prediction;
    predictionsGenerated++;
    
  } catch (error) {
    console.error(`   ⚠️  Error predicting game: ${row[3]} @ ${row[5]}`);
  }
}

console.log(`   ✅ Generated predictions for ${predictionsGenerated} games\n`);

// STEP 2: Load actual bets from Firebase
console.log('📡 STEP 2: Loading actual bets from Firebase...\n');

async function compareModels() {
  try {
    const betsRef = collection(db, 'bets');
    const completedQuery = query(betsRef, where('status', '==', 'COMPLETED'));
    const snapshot = await getDocs(completedQuery);
    
    console.log(`   Found ${snapshot.size} completed bets\n`);
    
    if (snapshot.size === 0) {
      console.log('⚠️  No completed bets found\n');
      return;
    }
    
    const bets = [];
    snapshot.forEach(doc => {
      bets.push({ id: doc.id, ...doc.data() });
    });
    
    // STEP 3: Match predictions to bets
    console.log('🔍 STEP 3: Matching predictions to bets...\n');
    
    const results = {
      current: { totalBets: 0, wins: 0, losses: 0, pushes: 0, profit: 0, 
                 totals: { bets: 0, wins: 0, losses: 0, profit: 0 },
                 moneyline: { bets: 0, wins: 0, losses: 0, profit: 0 } },
      ensemble: { totalBets: 0, wins: 0, losses: 0, pushes: 0, profit: 0,
                  totals: { bets: 0, wins: 0, losses: 0, profit: 0 },
                  moneyline: { bets: 0, wins: 0, losses: 0, profit: 0 } }
    };
    
    const detailedComparison = [];
    let matched = 0;
    let unmatched = 0;
    
    // Debug first bet to see structure
    if (bets.length > 0) {
      console.log('   Sample bet structure:');
      console.log('   ', JSON.stringify({
        game: bets[0].game,
        date: bets[0].date,
        timestamp: bets[0].timestamp?.toDate?.()?.toISOString?.(),
        bet: bets[0].bet?.market
      }, null, 2));
      console.log('');
    }
    
    for (const bet of bets) {
      try {
        const market = bet.bet?.market || '';
        
        // Try multiple ways to extract team names
        let awayTeam = bet.game?.awayTeam || bet.game?.away || bet.awayTeam;
        let homeTeam = bet.game?.homeTeam || bet.game?.home || bet.homeTeam;
        
        // Try extracting from game string like "CHI @ FLA"
        if (!awayTeam && bet.game?.game) {
          const parts = bet.game.game.split('@').map(s => s.trim());
          if (parts.length === 2) {
            awayTeam = parts[0];
            homeTeam = parts[1];
          }
        }
        
        // Try extracting from matchup field
        if (!awayTeam && bet.game?.matchup) {
          const parts = bet.game.matchup.split('@').map(s => s.trim());
          if (parts.length === 2) {
            awayTeam = parts[0];
            homeTeam = parts[1];
          }
        }
        
        // Try date from multiple sources
        let betDate = bet.date || bet.gameDate;
        if (!betDate && bet.timestamp?.toDate) {
          betDate = bet.timestamp.toDate().toISOString().split('T')[0];
        }
        
        if (!awayTeam || !homeTeam || !betDate) {
          if (unmatched < 3) {
            console.log(`   ⚠️  Missing data for bet: away=${awayTeam}, home=${homeTeam}, date=${betDate}`);
          }
          unmatched++;
          continue;
        }
        
        // Normalize team names through mapping
        const awayCode = TEAM_MAP[awayTeam] || awayTeam;
        const homeCode = TEAM_MAP[homeTeam] || homeTeam;
        
        // Try many possible key formats
        const possibleKeys = [
          `${awayCode}@${homeCode}_${betDate}`,
          `${awayTeam}@${homeTeam}_${betDate}`,
          `${awayCode} @ ${homeCode}_${betDate}`,
          `${awayTeam} @ ${homeTeam}_${betDate}`,
          `${TEAM_MAP[awayCode]}@${TEAM_MAP[homeCode]}_${betDate}`,
          `${awayCode}@${homeCode}_${betDate.split('T')[0]}`
        ];
        
        let prediction = null;
        for (const key of possibleKeys) {
          if (key && gamePredictions[key]) {
            prediction = gamePredictions[key];
            break;
          }
        }
        
        if (!prediction) {
          if (unmatched < 3) {
            console.log(`   ⚠️  No prediction for: ${awayCode} @ ${homeCode} on ${betDate}`);
            console.log(`       Tried keys: ${possibleKeys.slice(0, 2).join(', ')}`);
          }
          unmatched++;
          continue;
        }
        
        matched++;
        
        // Get actual bet result
        const outcome = bet.result?.outcome;
        const profit = bet.result?.profit || 0;
        const stake = bet.bet?.stake || bet.bet?.amount || 1; // Use actual stake from bet
        const line = bet.bet?.line;
        
        // Track current model (what actually happened)
        results.current.totalBets++;
        if (outcome === 'WIN') {
          results.current.wins++;
          results.current.profit += profit;
        } else if (outcome === 'LOSS') {
          results.current.losses++;
          results.current.profit += profit; // profit is negative for losses
        } else if (outcome === 'PUSH') {
          results.current.pushes++;
        }
        
        // Determine ensemble outcome for same bet
        let ensembleOutcome = null;
        let ensembleProfit = 0;
        
        if (market.includes('TOTAL') || market.includes('OVER') || market.includes('UNDER')) {
          // Totals bet - NOW COMPARE RECOMMENDATIONS
          results.current.totals.bets++;
          if (outcome === 'WIN') results.current.totals.wins++;
          if (outcome === 'LOSS') results.current.totals.losses++;
          results.current.totals.profit += profit;
          
          const actualTotal = prediction.actualTotal;
          const currentPrediction = prediction.currentModel.total;
          const ensemblePrediction = prediction.ensembleModel.total;
          
          // Determine which side of the bet was placed
          const betSide = market.includes('OVER') ? 'OVER' : 'UNDER';
          
          // What would each model RECOMMEND based on predictions vs line?
          const EDGE_THRESHOLD = 0.3; // Need at least 0.3 goal edge to recommend bet
          
          function getRecommendation(prediction, line, threshold) {
            if (prediction > line + threshold) return 'OVER';
            if (prediction < line - threshold) return 'UNDER';
            return 'NO BET';
          }
          
          const currentRecommendation = getRecommendation(currentPrediction, line, EDGE_THRESHOLD);
          const ensembleRecommendation = getRecommendation(ensemblePrediction, line, EDGE_THRESHOLD);
          
          // Check if each recommendation would have been correct
          function isRecommendationCorrect(recommendation, line, actualTotal) {
            if (recommendation === 'OVER') return actualTotal > line;
            if (recommendation === 'UNDER') return actualTotal < line;
            return null; // NO BET
          }
          
          const currentWasCorrect = isRecommendationCorrect(currentRecommendation, line, actualTotal);
          const ensembleWasCorrect = isRecommendationCorrect(ensembleRecommendation, line, actualTotal);
          
          // Calculate what ensemble outcome would have been
          if (ensembleRecommendation === 'NO BET') {
            ensembleOutcome = 'NO BET';
            ensembleProfit = 0;
          } else if (ensembleWasCorrect) {
            ensembleOutcome = 'WIN';
            ensembleProfit = profit > 0 ? profit : Math.abs(profit); // Same magnitude as actual bet
          } else if (ensembleWasCorrect === false) {
            ensembleOutcome = 'LOSS';
            ensembleProfit = profit < 0 ? profit : -Math.abs(profit);
          } else {
            ensembleOutcome = 'PUSH';
            ensembleProfit = 0;
          }
          
          results.ensemble.totalBets++;
          results.ensemble.totals.bets++;
          if (ensembleOutcome === 'WIN') {
            results.ensemble.wins++;
            results.ensemble.totals.wins++;
          } else if (ensembleOutcome === 'LOSS') {
            results.ensemble.losses++;
            results.ensemble.totals.losses++;
          } else if (ensembleOutcome === 'PUSH') {
            results.ensemble.pushes++;
          }
          results.ensemble.profit += ensembleProfit;
          results.ensemble.totals.profit += ensembleProfit;
          
          detailedComparison.push({
            date: betDate,
            game: `${awayTeam} @ ${homeTeam}`,
            betSide: betSide,
            line: line,
            actualTotal: actualTotal,
            currentPred: currentPrediction.toFixed(2),
            currentRec: currentRecommendation,
            currentCorrect: currentWasCorrect,
            ensemblePred: ensemblePrediction.toFixed(2),
            ensembleRec: ensembleRecommendation,
            ensembleCorrect: ensembleWasCorrect,
            currentOutcome: outcome,
            currentProfit: profit.toFixed(2),
            ensembleOutcome: ensembleOutcome,
            ensembleProfit: ensembleProfit.toFixed(2),
            different: currentRecommendation !== ensembleRecommendation ? '⚠️' : '',
            ensembleBetter: ensembleWasCorrect && !currentWasCorrect ? '✅' : ''
          });
          
        } else if (market.includes('MONEYLINE') || market.includes('ML')) {
          // Moneyline bet - same for both models
          results.current.moneyline.bets++;
          if (outcome === 'WIN') results.current.moneyline.wins++;
          if (outcome === 'LOSS') results.current.moneyline.losses++;
          results.current.moneyline.profit += profit;
          
          results.ensemble.totalBets++;
          results.ensemble.moneyline.bets++;
          if (outcome === 'WIN') {
            results.ensemble.wins++;
            results.ensemble.moneyline.wins++;
          } else if (outcome === 'LOSS') {
            results.ensemble.losses++;
            results.ensemble.moneyline.losses++;
          } else if (outcome === 'PUSH') {
            results.ensemble.pushes++;
          }
          results.ensemble.profit += profit;
          results.ensemble.moneyline.profit += profit;
        }
        
      } catch (error) {
        console.error(`   Error processing bet:`, error.message);
        unmatched++;
      }
    }
    
    console.log(`   ✅ Matched ${matched} bets to predictions`);
    console.log(`   ⚠️  Could not match ${unmatched} bets\n`);
    
    // STEP 4: Calculate and display results
    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║                    BACKTEST RESULTS                          ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');
    
    const calcStats = (data) => {
      const total = data.wins + data.losses + data.pushes;
      const winRate = total > 0 ? (data.wins / total * 100) : 0;
      const roi = data.totalBets > 0 ? (data.profit / (data.totalBets * 100) * 100) : 0;
      return { winRate, roi };
    };
    
    console.log('─────────────────────────────────────────────────────────────');
    console.log('                    ALL BETS');
    console.log('─────────────────────────────────────────────────────────────\n');
    
    const currentStats = calcStats(results.current);
    const ensembleStats = calcStats(results.ensemble);
    
    console.log('CURRENT MODEL (Actual Results):');
    console.log(`   Total Bets:  ${results.current.totalBets}`);
    console.log(`   Wins:        ${results.current.wins}`);
    console.log(`   Losses:      ${results.current.losses}`);
    console.log(`   Win Rate:    ${currentStats.winRate.toFixed(1)}%`);
    console.log(`   Total Profit: $${results.current.profit.toFixed(2)}`);
    console.log(`   ROI:         ${currentStats.roi.toFixed(1)}%\n`);
    
    console.log('ENSEMBLE MODEL (If Used on Same Bets):');
    console.log(`   Total Bets:  ${results.ensemble.totalBets}`);
    console.log(`   Wins:        ${results.ensemble.wins}`);
    console.log(`   Losses:      ${results.ensemble.losses}`);
    console.log(`   Win Rate:    ${ensembleStats.winRate.toFixed(1)}%`);
    console.log(`   Total Profit: $${results.ensemble.profit.toFixed(2)}`);
    console.log(`   ROI:         ${ensembleStats.roi.toFixed(1)}%\n`);
    
    const winRateDiff = ensembleStats.winRate - currentStats.winRate;
    const profitDiff = results.ensemble.profit - results.current.profit;
    const roiDiff = ensembleStats.roi - currentStats.roi;
    
    console.log('DIFFERENCE (Ensemble - Current):');
    console.log(`   Win Rate:    ${winRateDiff >= 0 ? '+' : ''}${winRateDiff.toFixed(1)}% ${winRateDiff > 0 ? '✅' : winRateDiff < 0 ? '❌' : '='}`);
    console.log(`   Profit:      ${profitDiff >= 0 ? '+' : ''}$${profitDiff.toFixed(2)} ${profitDiff > 0 ? '✅' : profitDiff < 0 ? '❌' : '='}`);
    console.log(`   ROI:         ${roiDiff >= 0 ? '+' : ''}${roiDiff.toFixed(1)}% ${roiDiff > 0 ? '✅' : roiDiff < 0 ? '❌' : '='}\n`);
    
    // Totals breakdown
    console.log('─────────────────────────────────────────────────────────────');
    console.log('                 TOTALS BETS ONLY');
    console.log('─────────────────────────────────────────────────────────────\n');
    
    const currentTotals = results.current.totals;
    const ensembleTotals = results.ensemble.totals;
    
    const currentTotalsWR = currentTotals.bets > 0 ? (currentTotals.wins / currentTotals.bets * 100) : 0;
    const ensembleTotalsWR = ensembleTotals.bets > 0 ? (ensembleTotals.wins / ensembleTotals.bets * 100) : 0;
    
    console.log('CURRENT MODEL:');
    console.log(`   Bets:        ${currentTotals.bets}`);
    console.log(`   Wins:        ${currentTotals.wins}`);
    console.log(`   Losses:      ${currentTotals.losses}`);
    console.log(`   Win Rate:    ${currentTotalsWR.toFixed(1)}%`);
    console.log(`   Profit:      $${currentTotals.profit.toFixed(2)}\n`);
    
    console.log('ENSEMBLE MODEL:');
    console.log(`   Bets:        ${ensembleTotals.bets}`);
    console.log(`   Wins:        ${ensembleTotals.wins}`);
    console.log(`   Losses:      ${ensembleTotals.losses}`);
    console.log(`   Win Rate:    ${ensembleTotalsWR.toFixed(1)}%`);
    console.log(`   Profit:      $${ensembleTotals.profit.toFixed(2)}\n`);
    
    const totalsWRDiff = ensembleTotalsWR - currentTotalsWR;
    const totalsProfitDiff = ensembleTotals.profit - currentTotals.profit;
    
    console.log('DIFFERENCE (Ensemble - Current):');
    console.log(`   Win Rate:    ${totalsWRDiff >= 0 ? '+' : ''}${totalsWRDiff.toFixed(1)}% ${totalsWRDiff > 0 ? '✅' : totalsWRDiff < 0 ? '❌' : '='}`);
    console.log(`   Profit:      ${totalsProfitDiff >= 0 ? '+' : ''}$${totalsProfitDiff.toFixed(2)} ${totalsProfitDiff > 0 ? '✅' : totalsProfitDiff < 0 ? '❌' : '='}\n`);
    
    // STEP 5: Generate report
    console.log('📝 Generating detailed report...');
    
    let report = `# ENSEMBLE MODEL BACKTEST - ACTUAL BETTING COMPARISON\n\n`;
    report += `**Date:** ${new Date().toISOString().split('T')[0]}\n`;
    report += `**Bets Matched:** ${matched} of ${snapshot.size}\n\n`;
    
    report += `## Executive Summary\n\n`;
    report += `This backtest shows what would have happened if the ensemble model had been used for the SAME bets that were actually placed.\n\n`;
    
    report += `### Overall Performance\n\n`;
    report += `| Metric | Current Model | Ensemble Model | Difference |\n`;
    report += `|--------|---------------|----------------|------------|\n`;
    report += `| Win Rate | ${currentStats.winRate.toFixed(1)}% | ${ensembleStats.winRate.toFixed(1)}% | ${winRateDiff >= 0 ? '+' : ''}${winRateDiff.toFixed(1)}% |\n`;
    report += `| Profit | $${results.current.profit.toFixed(2)} | $${results.ensemble.profit.toFixed(2)} | ${profitDiff >= 0 ? '+' : ''}$${profitDiff.toFixed(2)} |\n`;
    report += `| ROI | ${currentStats.roi.toFixed(1)}% | ${ensembleStats.roi.toFixed(1)}% | ${roiDiff >= 0 ? '+' : ''}${roiDiff.toFixed(1)}% |\n\n`;
    
    report += `### Totals Bets Performance\n\n`;
    report += `| Metric | Current Model | Ensemble Model | Difference |\n`;
    report += `|--------|---------------|----------------|------------|\n`;
    report += `| Win Rate | ${currentTotalsWR.toFixed(1)}% | ${ensembleTotalsWR.toFixed(1)}% | ${totalsWRDiff >= 0 ? '+' : ''}${totalsWRDiff.toFixed(1)}% |\n`;
    report += `| Profit | $${currentTotals.profit.toFixed(2)} | $${ensembleTotals.profit.toFixed(2)} | ${totalsProfitDiff >= 0 ? '+' : ''}$${totalsProfitDiff.toFixed(2)} |\n\n`;
    
    if (detailedComparison.length > 0) {
      report += `## Game-by-Game Recommendation Comparison\n\n`;
      report += `This shows what each model RECOMMENDED and if the recommendation was correct.\n\n`;
      report += `| Date | Game | You Bet | Line | Actual | Current | Ensemble | Winner |\n`;
      report += `|------|------|---------|------|--------|---------|----------|--------|\n`;
      
      detailedComparison.forEach(game => {
        const currentRec = `${game.currentRec} (${game.currentPred})`;
        const ensembleRec = `${game.ensembleRec} (${game.ensemblePred})`;
        const currentResult = game.currentCorrect ? '✅' : game.currentCorrect === false ? '❌' : 'PUSH';
        const ensembleResult = game.ensembleCorrect ? '✅' : game.ensembleCorrect === false ? '❌' : 'PUSH';
        const winner = game.ensembleBetter ? 'ENSEMBLE ✅' : game.different ? 'Check' : 'Both same';
        
        report += `| ${game.date} | ${game.game} | ${game.betSide} ${game.line} | ${game.actualTotal} | `;
        report += `${currentRec} ${currentResult} | ${ensembleRec} ${ensembleResult} | ${winner} |\n`;
      });
      
      report += `\n### Legend\n`;
      report += `- ✅ = Recommendation was correct\n`;
      report += `- ❌ = Recommendation was wrong\n`;
      report += `- ENSEMBLE ✅ = Ensemble was right when current was wrong\n\n`;
    }
    
    // Calculate recommendation accuracy
    let currentCorrectRecs = 0;
    let ensembleCorrectRecs = 0;
    let modelsDisagreed = 0;
    let ensembleBetter = 0;
    
    detailedComparison.forEach(game => {
      if (game.currentCorrect === true) currentCorrectRecs++;
      if (game.ensembleCorrect === true) ensembleCorrectRecs++;
      if (game.currentRec !== game.ensembleRec) modelsDisagreed++;
      if (game.ensembleBetter) ensembleBetter++;
    });
    
    report += `\n## Key Findings\n\n`;
    report += `### Recommendation Accuracy\n\n`;
    report += `- **Current Model:** ${currentCorrectRecs}/${detailedComparison.length} correct recommendations (${(currentCorrectRecs/detailedComparison.length*100).toFixed(1)}%)\n`;
    report += `- **Ensemble Model:** ${ensembleCorrectRecs}/${detailedComparison.length} correct recommendations (${(ensembleCorrectRecs/detailedComparison.length*100).toFixed(1)}%)\n\n`;
    report += `### Disagreements\n\n`;
    report += `- Models disagreed on **${modelsDisagreed}** bets\n`;
    report += `- Ensemble was right (and current was wrong) on **${ensembleBetter}** bets\n\n`;
    
    if (totalsProfitDiff > 0) {
      report += `### Bottom Line\n\n`;
      report += `✅ **Ensemble would have increased profit by $${totalsProfitDiff.toFixed(2)}**\n`;
      report += `✅ **Turned a losing season ($${results.current.profit.toFixed(2)}) into a winning one ($${results.ensemble.profit.toFixed(2)})**\n\n`;
    } else if (totalsProfitDiff < 0) {
      report += `### Bottom Line\n\n`;
      report += `❌ **Ensemble would have decreased profit by $${Math.abs(totalsProfitDiff).toFixed(2)}**\n\n`;
    }
    
    const reportPath = join(__dirname, '..', 'ENSEMBLE_BACKTEST_RESULTS.md');
    writeFileSync(reportPath, report);
    
    console.log(`✅ Report saved to: ENSEMBLE_BACKTEST_RESULTS.md\n`);
    console.log('═══════════════════════════════════════════════════════════════\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
    console.error(error.stack);
  }
}

compareModels();

