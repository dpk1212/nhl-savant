/**
 * Ensemble Model Comparison Against Actual Bets
 * 
 * Compares what betting results would have been if ensemble was used
 * all year vs. the current model that was actually used.
 * 
 * Run with: node scripts/compareEnsembleResults.js
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
console.log('║    ENSEMBLE MODEL - ACTUAL BETTING RESULTS COMPARISON        ║');
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

// Load data for re-predictions
console.log('📂 Loading model data...');
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

console.log('✅ Model data loaded\n');

async function compareResults() {
  try {
    console.log('📡 Fetching bets from Firebase...\n');
    
    // Get all completed bets
    const betsRef = collection(db, 'bets');
    const completedQuery = query(betsRef, where('status', '==', 'COMPLETED'));
    const snapshot = await getDocs(completedQuery);
    
    console.log(`   Found ${snapshot.size} completed bets\n`);
    
    if (snapshot.size === 0) {
      console.log('⚠️  No completed bets found in Firebase');
      console.log('   Make sure bets have been tracked and results updated\n');
      return;
    }
    
    // Collect and analyze bets
    const bets = [];
    snapshot.forEach(doc => {
      bets.push({ id: doc.id, ...doc.data() });
    });
    
    // Results tracking
    const results = {
      all: { current: { wins: 0, losses: 0, pushes: 0, profit: 0, bets: 0 },
             ensemble: { wins: 0, losses: 0, pushes: 0, profit: 0, bets: 0 } },
      totals: { current: { wins: 0, losses: 0, pushes: 0, profit: 0, bets: 0 },
                ensemble: { wins: 0, losses: 0, pushes: 0, profit: 0, bets: 0 } },
      moneyline: { current: { wins: 0, losses: 0, pushes: 0, profit: 0, bets: 0 },
                   ensemble: { wins: 0, losses: 0, pushes: 0, profit: 0, bets: 0 } }
    };
    
    const detailedComparison = [];
    
    console.log('🔍 Analyzing each bet...\n');
    
    for (const bet of bets) {
      try {
        const market = bet.bet?.market || 'UNKNOWN';
        const outcome = bet.result?.outcome;
        const profit = bet.result?.profit || 0;
        const stake = bet.bet?.stake || 100;
        
        // Extract game info
        const gameInfo = bet.game || {};
        const awayTeam = gameInfo.awayTeam;
        const homeTeam = gameInfo.homeTeam;
        const gameDate = bet.date || bet.timestamp?.toDate()?.toISOString()?.split('T')[0];
        
        // Get actual result
        const actualAwayScore = bet.result?.awayScore;
        const actualHomeScore = bet.result?.homeScore;
        const actualTotal = actualAwayScore + actualHomeScore;
        
        // Current model prediction (what was actually used)
        const currentPrediction = bet.prediction?.predictedTotal;
        
        // Skip if we don't have enough info to re-predict
        if (!awayTeam || !homeTeam || !gameDate) {
          continue;
        }
        
        // Track current model result
        results.all.current.bets++;
        if (outcome === 'WIN') {
          results.all.current.wins++;
          results.all.current.profit += profit;
        } else if (outcome === 'LOSS') {
          results.all.current.losses++;
          results.all.current.profit += profit; // profit is negative for losses
        } else if (outcome === 'PUSH') {
          results.all.current.pushes++;
        }
        
        // Break down by market
        if (market.includes('TOTAL') || market.includes('OVER') || market.includes('UNDER')) {
          results.totals.current.bets++;
          if (outcome === 'WIN') results.totals.current.wins++;
          if (outcome === 'LOSS') results.totals.current.losses++;
          if (outcome === 'PUSH') results.totals.current.pushes++;
          results.totals.current.profit += profit;
          
          // Re-predict with ensemble for totals bets
          try {
            const awayGoalie = gameInfo.goalies?.away || null;
            const homeGoalie = gameInfo.goalies?.home || null;
            
            const ensemblePrediction = totalsEnsemble.predictGameTotal(
              awayTeam, homeTeam, awayGoalie, homeGoalie, gameDate
            );
            
            // Determine what the bet would have been with ensemble
            const betLine = bet.bet?.line;
            const betType = market.includes('OVER') ? 'OVER' : 'UNDER';
            
            let ensembleWouldHaveBet = false;
            let ensembleOutcome = null;
            let ensembleProfit = 0;
            
            // Determine if ensemble would have made this bet
            const ensembleEdge = ensemblePrediction - betLine;
            
            if (betType === 'OVER' && ensembleEdge > 0.3) {
              ensembleWouldHaveBet = true;
            } else if (betType === 'UNDER' && ensembleEdge < -0.3) {
              ensembleWouldHaveBet = true;
            }
            
            if (ensembleWouldHaveBet) {
              // Calculate what outcome would have been
              if (betType === 'OVER') {
                if (actualTotal > betLine) {
                  ensembleOutcome = 'WIN';
                  ensembleProfit = stake * 0.91; // Assuming -110 odds
                } else if (actualTotal < betLine) {
                  ensembleOutcome = 'LOSS';
                  ensembleProfit = -stake;
                } else {
                  ensembleOutcome = 'PUSH';
                  ensembleProfit = 0;
                }
              } else { // UNDER
                if (actualTotal < betLine) {
                  ensembleOutcome = 'WIN';
                  ensembleProfit = stake * 0.91;
                } else if (actualTotal > betLine) {
                  ensembleOutcome = 'LOSS';
                  ensembleProfit = -stake;
                } else {
                  ensembleOutcome = 'PUSH';
                  ensembleProfit = 0;
                }
              }
              
              results.totals.ensemble.bets++;
              if (ensembleOutcome === 'WIN') results.totals.ensemble.wins++;
              if (ensembleOutcome === 'LOSS') results.totals.ensemble.losses++;
              if (ensembleOutcome === 'PUSH') results.totals.ensemble.pushes++;
              results.totals.ensemble.profit += ensembleProfit;
              results.all.ensemble.bets++;
              if (ensembleOutcome === 'WIN') results.all.ensemble.wins++;
              if (ensembleOutcome === 'LOSS') results.all.ensemble.losses++;
              if (ensembleOutcome === 'PUSH') results.all.ensemble.pushes++;
              results.all.ensemble.profit += ensembleProfit;
            }
            
            detailedComparison.push({
              date: gameDate,
              game: `${awayTeam} @ ${homeTeam}`,
              market: betType,
              line: betLine,
              actualTotal,
              currentPrediction: currentPrediction?.toFixed(2) || 'N/A',
              ensemblePrediction: ensemblePrediction.toFixed(2),
              currentBet: 'YES',
              currentOutcome: outcome,
              currentProfit: profit.toFixed(2),
              ensembleBet: ensembleWouldHaveBet ? 'YES' : 'NO',
              ensembleOutcome: ensembleOutcome || 'N/A',
              ensembleProfit: ensembleWouldHaveBet ? ensembleProfit.toFixed(2) : '0.00'
            });
            
          } catch (error) {
            console.warn(`   ⚠️  Could not re-predict: ${awayTeam} @ ${homeTeam}`);
          }
          
        } else if (market.includes('MONEYLINE') || market.includes('ML')) {
          results.moneyline.current.bets++;
          if (outcome === 'WIN') results.moneyline.current.wins++;
          if (outcome === 'LOSS') results.moneyline.current.losses++;
          if (outcome === 'PUSH') results.moneyline.current.pushes++;
          results.moneyline.current.profit += profit;
          
          // For moneyline, ensemble doesn't change anything (same model used)
          results.moneyline.ensemble.bets++;
          if (outcome === 'WIN') {
            results.moneyline.ensemble.wins++;
            results.all.ensemble.wins++;
          }
          if (outcome === 'LOSS') {
            results.moneyline.ensemble.losses++;
            results.all.ensemble.losses++;
          }
          if (outcome === 'PUSH') {
            results.moneyline.ensemble.pushes++;
            results.all.ensemble.pushes++;
          }
          results.moneyline.ensemble.profit += profit;
          results.all.ensemble.bets++;
          results.all.ensemble.profit += profit;
        }
        
      } catch (error) {
        console.error(`   Error processing bet ${bet.id}:`, error.message);
      }
    }
    
    // Calculate percentages
    const calcStats = (data) => {
      const total = data.wins + data.losses + data.pushes;
      const winRate = total > 0 ? (data.wins / total * 100) : 0;
      const roi = data.bets > 0 ? (data.profit / (data.bets * 100) * 100) : 0;
      return { total, winRate, roi };
    };
    
    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║                    COMPARISON RESULTS                        ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');
    
    console.log('─────────────────────────────────────────────────────────────');
    console.log('                    ALL BETS');
    console.log('─────────────────────────────────────────────────────────────\n');
    
    const allCurrent = calcStats(results.all.current);
    const allEnsemble = calcStats(results.all.ensemble);
    
    console.log('CURRENT MODEL (Actually Used):');
    console.log(`   Bets:        ${results.all.current.bets}`);
    console.log(`   Wins:        ${results.all.current.wins}`);
    console.log(`   Losses:      ${results.all.current.losses}`);
    console.log(`   Win Rate:    ${allCurrent.winRate.toFixed(1)}%`);
    console.log(`   Profit:      $${results.all.current.profit.toFixed(2)}`);
    console.log(`   ROI:         ${allCurrent.roi.toFixed(1)}%\n`);
    
    console.log('ENSEMBLE MODEL (Hypothetical):');
    console.log(`   Bets:        ${results.all.ensemble.bets}`);
    console.log(`   Wins:        ${results.all.ensemble.wins}`);
    console.log(`   Losses:      ${results.all.ensemble.losses}`);
    console.log(`   Win Rate:    ${allEnsemble.winRate.toFixed(1)}%`);
    console.log(`   Profit:      $${results.all.ensemble.profit.toFixed(2)}`);
    console.log(`   ROI:         ${allEnsemble.roi.toFixed(1)}%\n`);
    
    console.log('DIFFERENCE:');
    console.log(`   Win Rate:    ${(allEnsemble.winRate - allCurrent.winRate >= 0 ? '+' : '')}${(allEnsemble.winRate - allCurrent.winRate).toFixed(1)}% ${allEnsemble.winRate > allCurrent.winRate ? '✅' : '❌'}`);
    console.log(`   Profit:      ${(allEnsemble.profit - results.all.current.profit >= 0 ? '+' : '')}$${(results.all.ensemble.profit - results.all.current.profit).toFixed(2)} ${allEnsemble.profit > results.all.current.profit ? '✅' : '❌'}`);
    console.log(`   ROI:         ${(allEnsemble.roi - allCurrent.roi >= 0 ? '+' : '')}${(allEnsemble.roi - allCurrent.roi).toFixed(1)}% ${allEnsemble.roi > allCurrent.roi ? '✅' : '❌'}\n`);
    
    console.log('─────────────────────────────────────────────────────────────');
    console.log('                 TOTALS BETS ONLY');
    console.log('─────────────────────────────────────────────────────────────\n');
    
    const totalsCurrent = calcStats(results.totals.current);
    const totalsEnsemble = calcStats(results.totals.ensemble);
    
    console.log('CURRENT MODEL:');
    console.log(`   Bets:        ${results.totals.current.bets}`);
    console.log(`   Wins:        ${results.totals.current.wins}`);
    console.log(`   Losses:      ${results.totals.current.losses}`);
    console.log(`   Win Rate:    ${totalsCurrent.winRate.toFixed(1)}%`);
    console.log(`   Profit:      $${results.totals.current.profit.toFixed(2)}`);
    console.log(`   ROI:         ${totalsCurrent.roi.toFixed(1)}%\n`);
    
    console.log('ENSEMBLE MODEL:');
    console.log(`   Bets:        ${results.totals.ensemble.bets}`);
    console.log(`   Wins:        ${results.totals.ensemble.wins}`);
    console.log(`   Losses:      ${results.totals.ensemble.losses}`);
    console.log(`   Win Rate:    ${totalsEnsemble.winRate.toFixed(1)}%`);
    console.log(`   Profit:      $${results.totals.ensemble.profit.toFixed(2)}`);
    console.log(`   ROI:         ${totalsEnsemble.roi.toFixed(1)}%\n`);
    
    console.log('DIFFERENCE (Ensemble vs Current):');
    console.log(`   Win Rate:    ${(totalsEnsemble.winRate - totalsCurrent.winRate >= 0 ? '+' : '')}${(totalsEnsemble.winRate - totalsCurrent.winRate).toFixed(1)}% ${totalsEnsemble.winRate > totalsCurrent.winRate ? '✅' : '❌'}`);
    console.log(`   Profit:      ${(totalsEnsemble.profit - results.totals.current.profit >= 0 ? '+' : '')}$${(results.totals.ensemble.profit - results.totals.current.profit).toFixed(2)} ${totalsEnsemble.profit > results.totals.current.profit ? '✅' : '❌'}`);
    console.log(`   ROI:         ${(totalsEnsemble.roi - totalsCurrent.roi >= 0 ? '+' : '')}${(totalsEnsemble.roi - totalsCurrent.roi).toFixed(1)}% ${totalsEnsemble.roi > totalsCurrent.roi ? '✅' : '❌'}\n`);
    
    // Generate report
    let report = `# ENSEMBLE MODEL - ACTUAL BETTING COMPARISON\n\n`;
    report += `**Date:** ${new Date().toISOString().split('T')[0]}\n`;
    report += `**Total Bets Analyzed:** ${snapshot.size}\n\n`;
    
    report += `## Summary\n\n`;
    report += `### All Bets\n\n`;
    report += `| Metric | Current Model | Ensemble Model | Difference |\n`;
    report += `|--------|---------------|----------------|------------|\n`;
    report += `| Bets | ${results.all.current.bets} | ${results.all.ensemble.bets} | ${results.all.ensemble.bets - results.all.current.bets} |\n`;
    report += `| Win Rate | ${allCurrent.winRate.toFixed(1)}% | ${allEnsemble.winRate.toFixed(1)}% | ${(allEnsemble.winRate - allCurrent.winRate >= 0 ? '+' : '')}${(allEnsemble.winRate - allCurrent.winRate).toFixed(1)}% |\n`;
    report += `| Profit | $${results.all.current.profit.toFixed(2)} | $${results.all.ensemble.profit.toFixed(2)} | $${(results.all.ensemble.profit - results.all.current.profit).toFixed(2)} |\n`;
    report += `| ROI | ${allCurrent.roi.toFixed(1)}% | ${allEnsemble.roi.toFixed(1)}% | ${(allEnsemble.roi - allCurrent.roi >= 0 ? '+' : '')}${(allEnsemble.roi - allCurrent.roi).toFixed(1)}% |\n\n`;
    
    report += `### Totals Bets Only\n\n`;
    report += `| Metric | Current Model | Ensemble Model | Difference |\n`;
    report += `|--------|---------------|----------------|------------|\n`;
    report += `| Bets | ${results.totals.current.bets} | ${results.totals.ensemble.bets} | ${results.totals.ensemble.bets - results.totals.current.bets} |\n`;
    report += `| Win Rate | ${totalsCurrent.winRate.toFixed(1)}% | ${totalsEnsemble.winRate.toFixed(1)}% | ${(totalsEnsemble.winRate - totalsCurrent.winRate >= 0 ? '+' : '')}${(totalsEnsemble.winRate - totalsCurrent.winRate).toFixed(1)}% |\n`;
    report += `| Profit | $${results.totals.current.profit.toFixed(2)} | $${results.totals.ensemble.profit.toFixed(2)} | $${(results.totals.ensemble.profit - results.totals.current.profit).toFixed(2)} |\n`;
    report += `| ROI | ${totalsCurrent.roi.toFixed(1)}% | ${totalsEnsemble.roi.toFixed(1)}% | ${(totalsEnsemble.roi - totalsCurrent.roi >= 0 ? '+' : '')}${(totalsEnsemble.roi - totalsCurrent.roi).toFixed(1)}% |\n\n`;
    
    if (detailedComparison.length > 0) {
      report += `## Detailed Bet Comparison\n\n`;
      report += `| Date | Game | Market | Line | Actual | Current Pred | Ensemble Pred | Current Result | Ensemble Result |\n`;
      report += `|------|------|--------|------|--------|--------------|---------------|----------------|----------------|\n`;
      
      detailedComparison.forEach(bet => {
        report += `| ${bet.date} | ${bet.game} | ${bet.market} | ${bet.line} | ${bet.actualTotal} | `;
        report += `${bet.currentPrediction} | ${bet.ensemblePrediction} | `;
        report += `${bet.currentOutcome} ($${bet.currentProfit}) | `;
        report += `${bet.ensembleBet === 'YES' ? bet.ensembleOutcome + ' ($' + bet.ensembleProfit + ')' : 'No Bet'} |\n`;
      });
    }
    
    // Save report
    const reportPath = join(__dirname, '..', 'ENSEMBLE_BETTING_COMPARISON.md');
    writeFileSync(reportPath, report);
    console.log('📝 Detailed report saved to: ENSEMBLE_BETTING_COMPARISON.md\n');
    
    console.log('═══════════════════════════════════════════════════════════════\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
    console.error(error.stack);
  }
}

compareResults();

