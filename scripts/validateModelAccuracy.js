/**
 * CRITICAL VALIDATION: Check LIVE model predictions vs ACTUAL results
 * Uses the EXACT same model code that's running in production
 * Compares against real NHL 2525-26 game results from CSV
 */

import Papa from 'papaparse';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { NHLDataProcessor } from '../src/utils/dataProcessing.js';
import { GoalieProcessor } from '../src/utils/goalieProcessor.js';
import { ScheduleHelper } from '../src/utils/scheduleHelper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Team name mappings
const TEAM_MAPPINGS = {
  'Anaheim Ducks': 'ANA', 'Boston Bruins': 'BOS', 'Buffalo Sabres': 'BUF',
  'Calgary Flames': 'CGY', 'Carolina Hurricanes': 'CAR', 'Chicago Blackhawks': 'CHI',
  'Colorado Avalanche': 'COL', 'Columbus Blue Jackets': 'CBJ', 'Dallas Stars': 'DAL',
  'Detroit Red Wings': 'DET', 'Edmonton Oilers': 'EDM', 'Florida Panthers': 'FLA',
  'Los Angeles Kings': 'LAK', 'Minnesota Wild': 'MIN', 'Montreal Canadiens': 'MTL',
  'Nashville Predators': 'NSH', 'New Jersey Devils': 'NJD', 'New York Islanders': 'NYI',
  'New York Rangers': 'NYR', 'Ottawa Senators': 'OTT', 'Philadelphia Flyers': 'PHI',
  'Pittsburgh Penguins': 'PIT', 'San Jose Sharks': 'SJS', 'Seattle Kraken': 'SEA',
  'St. Louis Blues': 'STL', 'Tampa Bay Lightning': 'TBL', 'Toronto Maple Leafs': 'TOR',
  'Utah Mammoth': 'UTA', 'Vancouver Canucks': 'VAN', 'Vegas Golden Knights': 'VGK',
  'Washington Capitals': 'WSH', 'Winnipeg Jets': 'WPG'
};

function getTeamCode(teamName) {
  return TEAM_MAPPINGS[teamName] || teamName;
}

async function validateModel() {
  console.log('🔍 VALIDATING LIVE MODEL AGAINST ACTUAL NHL RESULTS\n');
  console.log('='.repeat(80));
  
  // Load all data files
  console.log('\n📂 Loading data files...');
  
  const teamsDataPath = path.join(__dirname, '../public/teams.csv');
  const goaliesDataPath = path.join(__dirname, '../public/goalies.csv');
  const gamesDataPath = path.join(__dirname, '../public/nhl-202526-asplayed.csv');
  const scheduleDataPath = path.join(__dirname, '../public/games.csv');
  
  const teamsCSV = readFileSync(teamsDataPath, 'utf-8');
  const goaliesCSV = readFileSync(goaliesDataPath, 'utf-8');
  const gamesCSV = readFileSync(gamesDataPath, 'utf-8');
  const scheduleCSV = readFileSync(scheduleDataPath, 'utf-8');
  
  const teamsData = Papa.parse(teamsCSV, { header: true, skipEmptyLines: true }).data;
  const goaliesData = Papa.parse(goaliesCSV, { header: true, skipEmptyLines: true }).data;
  const gamesData = Papa.parse(gamesCSV, { header: true, skipEmptyLines: true }).data;
  const scheduleData = Papa.parse(scheduleCSV, { header: true, skipEmptyLines: true }).data;
  
  console.log(`✅ Loaded ${teamsData.length} team records`);
  console.log(`✅ Loaded ${goaliesData.length} goalie records`);
  console.log(`✅ Loaded ${gamesData.length} completed games`);
  console.log(`✅ Loaded ${scheduleData.length} schedule entries`);
  
  // Initialize processors (SAME as production)
  const goalieProcessor = new GoalieProcessor(goaliesData);
  const scheduleHelper = new ScheduleHelper(scheduleData);
  const dataProcessor = new NHLDataProcessor(teamsData, goalieProcessor, scheduleHelper);
  
  console.log('\n✅ Model processors initialized (using LIVE production code)\n');
  
  // Results tracking
  const results = {
    total: 0,
    homeWinPredictions: 0,
    awayWinPredictions: 0,
    homeWinActual: 0,
    awayWinActual: 0,
    correctPredictions: 0,
    incorrectPredictions: 0,
    predictions: [],
    goalErrors: []
  };
  
  console.log('='.repeat(80));
  console.log('🎯 RUNNING PREDICTIONS FOR ALL COMPLETED GAMES');
  console.log('='.repeat(80));
  
  let processed = 0;
  let skipped = 0;
  
  for (const game of gamesData) {
    try {
      if (!game.Visitor || !game.Home || !game.Score || !game.Score_1) {
        skipped++;
        continue;
      }
      
      const homeTeam = getTeamCode(game.Home);
      const awayTeam = getTeamCode(game.Visitor);
      const actualHomeScore = parseInt(game.Score_1); // Second Score column = Home
      const actualAwayScore = parseInt(game.Score);   // First Score column = Away
      
      if (isNaN(actualHomeScore) || isNaN(actualAwayScore)) {
        skipped++;
        continue;
      }
      
      // Run LIVE model prediction (EXACT same code as production)
      const predictedHomeScore = dataProcessor.predictTeamScore(
        homeTeam, 
        awayTeam, 
        true,  // isHome = true
        game['Visitor Goalie'],  // home team shoots at away goalie
        game.Date
      );
      
      const predictedAwayScore = dataProcessor.predictTeamScore(
        awayTeam, 
        homeTeam, 
        false, // isHome = false
        game['Home Goalie'],     // away team shoots at home goalie
        game.Date
      );
      
      // Calculate win probabilities using Poisson (EXACT same as production)
      const homeWinProb = dataProcessor.calculatePoissonWinProb(predictedHomeScore, predictedAwayScore);
      const awayWinProb = dataProcessor.calculatePoissonWinProb(predictedAwayScore, predictedHomeScore);
      
      // Determine predicted winner
      const predictedWinner = homeWinProb > awayWinProb ? 'HOME' : 'AWAY';
      const actualWinner = actualHomeScore > actualAwayScore ? 'HOME' : 'AWAY';
      const correct = predictedWinner === actualWinner;
      
      // Track results
      results.total++;
      
      if (predictedWinner === 'HOME') results.homeWinPredictions++;
      else results.awayWinPredictions++;
      
      if (actualWinner === 'HOME') results.homeWinActual++;
      else results.awayWinActual++;
      
      if (correct) {
        results.correctPredictions++;
      } else {
        results.incorrectPredictions++;
      }
      
      // Track goal prediction errors
      const homeGoalError = Math.abs(predictedHomeScore - actualHomeScore);
      const awayGoalError = Math.abs(predictedAwayScore - actualAwayScore);
      const totalGoalError = Math.abs((predictedHomeScore + predictedAwayScore) - (actualHomeScore + actualAwayScore));
      
      results.goalErrors.push({
        homeError: homeGoalError,
        awayError: awayGoalError,
        totalError: totalGoalError
      });
      
      // Store detailed prediction
      results.predictions.push({
        date: game.Date,
        away: awayTeam,
        home: homeTeam,
        predictedAway: predictedAwayScore.toFixed(2),
        predictedHome: predictedHomeScore.toFixed(2),
        actualAway: actualAwayScore,
        actualHome: actualHomeScore,
        predictedWinner,
        actualWinner,
        correct,
        homeWinProb: (homeWinProb * 100).toFixed(1),
        awayWinProb: (awayWinProb * 100).toFixed(1),
        homeGoalError: homeGoalError.toFixed(2),
        awayGoalError: awayGoalError.toFixed(2),
        totalGoalError: totalGoalError.toFixed(2)
      });
      
      processed++;
      
      // Show progress every 50 games
      if (processed % 50 === 0) {
        console.log(`   Processed ${processed} games...`);
      }
      
    } catch (error) {
      console.error(`❌ Error processing game: ${game.Visitor} @ ${game.Home}:`, error.message);
      skipped++;
    }
  }
  
  console.log(`\n✅ Validation complete: ${processed} games processed, ${skipped} skipped\n`);
  
  // Calculate statistics
  console.log('='.repeat(80));
  console.log('📊 MODEL ACCURACY RESULTS');
  console.log('='.repeat(80));
  
  const winAccuracy = (results.correctPredictions / results.total) * 100;
  const homeWinRate = (results.homeWinActual / results.total) * 100;
  const awayWinRate = (results.awayWinActual / results.total) * 100;
  
  console.log(`\n🎯 WIN PREDICTION ACCURACY:`);
  console.log(`   Total Games: ${results.total}`);
  console.log(`   Correct Predictions: ${results.correctPredictions}`);
  console.log(`   Incorrect Predictions: ${results.incorrectPredictions}`);
  console.log(`   WIN ACCURACY: ${winAccuracy.toFixed(1)}%`);
  
  if (winAccuracy < 50) {
    console.log(`   🚨 CRITICAL: Below 50% accuracy - worse than random!`);
  } else if (winAccuracy < 55) {
    console.log(`   ⚠️  WARNING: Below break-even threshold`);
  } else {
    console.log(`   ✅ GOOD: Above break-even threshold`);
  }
  
  console.log(`\n📈 PREDICTION DISTRIBUTION:`);
  console.log(`   Model predicted HOME wins: ${results.homeWinPredictions} (${(results.homeWinPredictions/results.total*100).toFixed(1)}%)`);
  console.log(`   Model predicted AWAY wins: ${results.awayWinPredictions} (${(results.awayWinPredictions/results.total*100).toFixed(1)}%)`);
  console.log(`   Actual HOME wins: ${results.homeWinActual} (${homeWinRate.toFixed(1)}%)`);
  console.log(`   Actual AWAY wins: ${results.awayWinActual} (${awayWinRate.toFixed(1)}%)`);
  
  // Check for home/away bias
  const homePredictionBias = results.homeWinPredictions - results.homeWinActual;
  console.log(`\n🔍 HOME/AWAY BIAS CHECK:`);
  console.log(`   Home prediction bias: ${homePredictionBias > 0 ? '+' : ''}${homePredictionBias} games`);
  
  if (Math.abs(homePredictionBias) > 20) {
    console.log(`   🚨 CRITICAL: Severe ${homePredictionBias > 0 ? 'home' : 'away'} team bias detected!`);
  } else if (Math.abs(homePredictionBias) > 10) {
    console.log(`   ⚠️  WARNING: Notable ${homePredictionBias > 0 ? 'home' : 'away'} team bias`);
  } else {
    console.log(`   ✅ GOOD: No significant bias`);
  }
  
  // Calculate RMSE for goal predictions
  const totalHomeError = results.goalErrors.reduce((sum, e) => sum + (e.homeError ** 2), 0);
  const totalAwayError = results.goalErrors.reduce((sum, e) => sum + (e.awayError ** 2), 0);
  const totalError = results.goalErrors.reduce((sum, e) => sum + (e.totalError ** 2), 0);
  
  const homeRMSE = Math.sqrt(totalHomeError / results.goalErrors.length);
  const awayRMSE = Math.sqrt(totalAwayError / results.goalErrors.length);
  const totalRMSE = Math.sqrt(totalError / results.goalErrors.length);
  
  console.log(`\n📏 GOAL PREDICTION ACCURACY (RMSE):`);
  console.log(`   Home team RMSE: ${homeRMSE.toFixed(3)} goals`);
  console.log(`   Away team RMSE: ${awayRMSE.toFixed(3)} goals`);
  console.log(`   Total goals RMSE: ${totalRMSE.toFixed(3)} goals`);
  
  if (totalRMSE > 3.0) {
    console.log(`   🚨 CRITICAL: RMSE > 3.0 - predictions highly inaccurate`);
  } else if (totalRMSE > 2.0) {
    console.log(`   ⚠️  WARNING: RMSE > 2.0 - needs calibration`);
  } else {
    console.log(`   ✅ GOOD: RMSE < 2.0 - well calibrated`);
  }
  
  // Calculate average predicted vs actual scores
  const avgPredictedHome = results.predictions.reduce((sum, p) => sum + parseFloat(p.predictedHome), 0) / results.predictions.length;
  const avgActualHome = results.predictions.reduce((sum, p) => sum + p.actualHome, 0) / results.predictions.length;
  const avgPredictedAway = results.predictions.reduce((sum, p) => sum + parseFloat(p.predictedAway), 0) / results.predictions.length;
  const avgActualAway = results.predictions.reduce((sum, p) => sum + p.actualAway, 0) / results.predictions.length;
  const avgPredictedTotal = avgPredictedHome + avgPredictedAway;
  const avgActualTotal = avgActualHome + avgActualAway;
  
  console.log(`\n⚖️  CALIBRATION CHECK (Average Scores):`);
  console.log(`   Predicted HOME: ${avgPredictedHome.toFixed(2)} goals`);
  console.log(`   Actual HOME: ${avgActualHome.toFixed(2)} goals`);
  console.log(`   Bias: ${(avgPredictedHome - avgActualHome) > 0 ? '+' : ''}${(avgPredictedHome - avgActualHome).toFixed(2)} goals`);
  console.log(`   `);
  console.log(`   Predicted AWAY: ${avgPredictedAway.toFixed(2)} goals`);
  console.log(`   Actual AWAY: ${avgActualAway.toFixed(2)} goals`);
  console.log(`   Bias: ${(avgPredictedAway - avgActualAway) > 0 ? '+' : ''}${(avgPredictedAway - avgActualAway).toFixed(2)} goals`);
  console.log(`   `);
  console.log(`   Predicted TOTAL: ${avgPredictedTotal.toFixed(2)} goals/game`);
  console.log(`   Actual TOTAL: ${avgActualTotal.toFixed(2)} goals/game`);
  console.log(`   Bias: ${(avgPredictedTotal - avgActualTotal) > 0 ? '+' : ''}${(avgPredictedTotal - avgActualTotal).toFixed(2)} goals`);
  
  // Show worst predictions
  console.log(`\n=`.repeat(80));
  console.log(`🔥 WORST PREDICTIONS (Top 10 Errors):`);
  console.log(`=`.repeat(80));
  
  const sortedByError = [...results.predictions].sort((a, b) => 
    parseFloat(b.totalGoalError) - parseFloat(a.totalGoalError)
  );
  
  sortedByError.slice(0, 10).forEach((p, i) => {
    console.log(`\n${i + 1}. ${p.date}: ${p.away} @ ${p.home}`);
    console.log(`   Predicted: ${p.predictedAway}-${p.predictedHome} (${p.predictedWinner} ${p.homeWinProb}%)`);
    console.log(`   Actual: ${p.actualAway}-${p.actualHome} (${p.actualWinner} won)`);
    console.log(`   Total Error: ${p.totalGoalError} goals | Winner: ${p.correct ? '✅' : '❌'}`);
  });
  
  // Show best predictions
  console.log(`\n=`.repeat(80));
  console.log(`✅ BEST PREDICTIONS (Top 10 Most Accurate):`);
  console.log(`=`.repeat(80));
  
  const sortedByAccuracy = [...results.predictions].sort((a, b) => 
    parseFloat(a.totalGoalError) - parseFloat(b.totalGoalError)
  );
  
  sortedByAccuracy.slice(0, 10).forEach((p, i) => {
    console.log(`\n${i + 1}. ${p.date}: ${p.away} @ ${p.home}`);
    console.log(`   Predicted: ${p.predictedAway}-${p.predictedHome} (${p.predictedWinner} ${p.homeWinProb}%)`);
    console.log(`   Actual: ${p.actualAway}-${p.actualHome} (${p.actualWinner} won)`);
    console.log(`   Total Error: ${p.totalGoalError} goals | Winner: ${p.correct ? '✅' : '❌'}`);
  });
  
  // Split analysis: Early vs Recent
  console.log(`\n=`.repeat(80));
  console.log(`📊 EARLY vs RECENT PERFORMANCE`);
  console.log(`=`.repeat(80));
  
  const splitPoint = Math.floor(results.predictions.length * 0.75); // First 75% vs last 25%
  const earlyGames = results.predictions.slice(0, splitPoint);
  const recentGames = results.predictions.slice(splitPoint);
  
  const earlyCorrect = earlyGames.filter(p => p.correct).length;
  const recentCorrect = recentGames.filter(p => p.correct).length;
  
  const earlyAccuracy = (earlyCorrect / earlyGames.length) * 100;
  const recentAccuracy = (recentCorrect / recentGames.length) * 100;
  
  console.log(`\n📈 EARLY GAMES (1-${splitPoint}):`);
  console.log(`   Win Accuracy: ${earlyAccuracy.toFixed(1)}% (${earlyCorrect}/${earlyGames.length})`);
  
  console.log(`\n📉 RECENT GAMES (${splitPoint + 1}-${results.predictions.length}):`);
  console.log(`   Win Accuracy: ${recentAccuracy.toFixed(1)}% (${recentCorrect}/${recentGames.length})`);
  
  const accuracyChange = recentAccuracy - earlyAccuracy;
  console.log(`\n📊 CHANGE: ${accuracyChange > 0 ? '+' : ''}${accuracyChange.toFixed(1)} percentage points`);
  
  if (accuracyChange < -10) {
    console.log(`   🚨 CRITICAL: Significant performance degradation!`);
  } else if (accuracyChange < -5) {
    console.log(`   ⚠️  WARNING: Noticeable performance decline`);
  } else {
    console.log(`   ✅ STABLE: No significant degradation`);
  }
  
  // Final summary
  console.log(`\n=`.repeat(80));
  console.log(`📋 VALIDATION SUMMARY`);
  console.log(`=`.repeat(80));
  
  console.log(`\n✅ Validation Complete!`);
  console.log(`   Games Analyzed: ${results.total}`);
  console.log(`   Overall Win Accuracy: ${winAccuracy.toFixed(1)}%`);
  console.log(`   Goals RMSE: ${totalRMSE.toFixed(3)}`);
  console.log(`   Calibration Bias: ${(avgPredictedTotal - avgActualTotal).toFixed(2)} goals/game`);
  
  if (winAccuracy >= 55 && totalRMSE <= 2.0) {
    console.log(`\n🎉 MODEL STATUS: EXCELLENT - Performing well`);
  } else if (winAccuracy >= 50 && totalRMSE <= 2.5) {
    console.log(`\n✅ MODEL STATUS: GOOD - Minor calibration needed`);
  } else if (winAccuracy >= 45) {
    console.log(`\n⚠️  MODEL STATUS: NEEDS CALIBRATION - Underperforming`);
  } else {
    console.log(`\n🚨 MODEL STATUS: CRITICAL - Requires immediate fixes`);
  }
  
  console.log('\n' + '='.repeat(80) + '\n');
}

// Run validation
validateModel().catch(error => {
  console.error('💥 Validation failed:', error);
  process.exit(1);
});

