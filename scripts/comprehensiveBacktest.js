/**
 * Comprehensive Backtest Script - November 2025
 * 
 * PURPOSE: Identify why model win rate% and ROI are declining
 * 
 * TESTS:
 * 1. Overall prediction accuracy (win rate, Brier score, RMSE)
 * 2. Accuracy by market type (moneyline, puck line, totals)
 * 3. Calibration curve analysis
 * 4. Betting performance by EV tier (A+, A, B+, B)
 * 5. Systematic biases (home/away, favorites/underdogs)
 * 6. Time-based performance trends
 * 7. Comparison to different calibration parameters
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';
import { NHLDataProcessor } from '../src/utils/dataProcessing.js';
import { GoalieProcessor } from '../src/utils/goalieProcessor.js';
import { EdgeCalculator } from '../src/utils/edgeCalculator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============================================================================
// LOAD DATA
// ============================================================================

console.log('📊 COMPREHENSIVE MODEL BACKTEST - November 2025');
console.log('='.repeat(80));

// Load teams data
const teamsCSV = readFileSync(join(__dirname, '../public/teams.csv'), 'utf-8');
const teamsData = Papa.parse(teamsCSV, { header: true }).data;

// Load goalies data
const goaliesCSV = readFileSync(join(__dirname, '../public/goalies.csv'), 'utf-8');
const goaliesData = Papa.parse(goaliesCSV, { header: true }).data;

// Load games data
const gamesCSV = readFileSync(join(__dirname, '../public/nhl-202526-asplayed.csv'), 'utf-8');
const gamesData = Papa.parse(gamesCSV, { header: true }).data.filter(g => g.Status === 'Regulation' || g.Status === 'OT' || g.Status === 'SO');

console.log(`\n✅ Loaded ${gamesData.length} completed games from 2025-26 season`);
console.log(`✅ Loaded ${teamsData.length} teams`);
console.log(`✅ Loaded ${goaliesData.length} goalies`);

// ============================================================================
// INITIALIZE PROCESSORS
// ============================================================================

const goalieProcessor = new GoalieProcessor(goaliesData);
const dataProcessor = new NHLDataProcessor(teamsData, goalieProcessor);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Map team name to code
 */
function getTeamCode(teamName) {
  const mapping = {
    'Anaheim Ducks': 'ANA',
    'Boston Bruins': 'BOS',
    'Buffalo Sabres': 'BUF',
    'Calgary Flames': 'CGY',
    'Carolina Hurricanes': 'CAR',
    'Chicago Blackhawks': 'CHI',
    'Colorado Avalanche': 'COL',
    'Columbus Blue Jackets': 'CBJ',
    'Dallas Stars': 'DAL',
    'Detroit Red Wings': 'DET',
    'Edmonton Oilers': 'EDM',
    'Florida Panthers': 'FLA',
    'Los Angeles Kings': 'LAK',
    'Minnesota Wild': 'MIN',
    'Montreal Canadiens': 'MTL',
    'Nashville Predators': 'NSH',
    'New Jersey Devils': 'NJD',
    'New York Islanders': 'NYI',
    'New York Rangers': 'NYR',
    'Ottawa Senators': 'OTT',
    'Philadelphia Flyers': 'PHI',
    'Pittsburgh Penguins': 'PIT',
    'San Jose Sharks': 'SJS',
    'Seattle Kraken': 'SEA',
    'St. Louis Blues': 'STL',
    'Tampa Bay Lightning': 'TBL',
    'Toronto Maple Leafs': 'TOR',
    'Utah Mammoth': 'UTA',
    'Vancouver Canucks': 'VAN',
    'Vegas Golden Knights': 'VGK',
    'Washington Capitals': 'WSH',
    'Winnipeg Jets': 'WPG'
  };
  return mapping[teamName] || teamName;
}

/**
 * Calculate Brier score for probability calibration
 */
function calculateBrierScore(predictions, outcomes) {
  let sum = 0;
  for (let i = 0; i < predictions.length; i++) {
    const diff = predictions[i] - outcomes[i];
    sum += diff * diff;
  }
  return sum / predictions.length;
}

/**
 * Calculate RMSE for score predictions
 */
function calculateRMSE(predictions, actuals) {
  let sumSquaredError = 0;
  for (let i = 0; i < predictions.length; i++) {
    const error = predictions[i] - actuals[i];
    sumSquaredError += error * error;
  }
  return Math.sqrt(sumSquaredError / predictions.length);
}

/**
 * Group predictions into calibration buckets
 */
function calibrationCurve(predictions, outcomes) {
  const buckets = {
    '0-40': { predicted: [], actual: [] },
    '40-45': { predicted: [], actual: [] },
    '45-50': { predicted: [], actual: [] },
    '50-55': { predicted: [], actual: [] },
    '55-60': { predicted: [], actual: [] },
    '60-65': { predicted: [], actual: [] },
    '65-70': { predicted: [], actual: [] },
    '70-100': { predicted: [], actual: [] }
  };

  for (let i = 0; i < predictions.length; i++) {
    const prob = predictions[i] * 100;
    const outcome = outcomes[i];

    if (prob < 40) buckets['0-40'].predicted.push(prob);
    else if (prob < 45) buckets['40-45'].predicted.push(prob);
    else if (prob < 50) buckets['45-50'].predicted.push(prob);
    else if (prob < 55) buckets['50-55'].predicted.push(prob);
    else if (prob < 60) buckets['55-60'].predicted.push(prob);
    else if (prob < 65) buckets['60-65'].predicted.push(prob);
    else if (prob < 70) buckets['65-70'].predicted.push(prob);
    else buckets['70-100'].predicted.push(prob);

    if (prob < 40) buckets['0-40'].actual.push(outcome);
    else if (prob < 45) buckets['40-45'].actual.push(outcome);
    else if (prob < 50) buckets['45-50'].actual.push(outcome);
    else if (prob < 55) buckets['50-55'].actual.push(outcome);
    else if (prob < 60) buckets['55-60'].actual.push(outcome);
    else if (prob < 65) buckets['60-65'].actual.push(outcome);
    else if (prob < 70) buckets['65-70'].actual.push(outcome);
    else buckets['70-100'].actual.push(outcome);
  }

  return buckets;
}

/**
 * Simulate American odds from probability
 */
function probabilityToOdds(prob) {
  if (prob >= 0.5) {
    return -Math.round((prob / (1 - prob)) * 100);
  } else {
    return Math.round(((1 - prob) / prob) * 100);
  }
}

/**
 * Calculate EV from probability and odds
 */
function calculateEV(winProb, americanOdds) {
  const decimalOdds = americanOdds < 0 
    ? (100 / Math.abs(americanOdds)) + 1
    : (americanOdds / 100) + 1;
  
  const ev = (winProb * decimalOdds) - 1;
  return ev * 100; // Return as percentage
}

/**
 * Calculate profit from bet outcome
 */
function calculateProfit(outcome, americanOdds, stake = 1) {
  if (outcome === 'WIN') {
    if (americanOdds < 0) {
      return stake * (100 / Math.abs(americanOdds));
    } else {
      return stake * (americanOdds / 100);
    }
  } else if (outcome === 'LOSS') {
    return -stake;
  }
  return 0; // PUSH
}

// ============================================================================
// RUN BACKTEST
// ============================================================================

console.log('\n🏒 Running backtest...\n');

const results = {
  predictions: [],
  moneylinePredictions: [],
  totalsPredictions: [],
  calibrationData: { homeProbs: [], homeWins: [] },
  bettingResults: {
    'A+': { bets: [], profit: 0 },
    'A': { bets: [], profit: 0 },
    'B+': { bets: [], profit: 0 },
    'B': { bets: [], profit: 0 },
    'C': { bets: [], profit: 0 }
  },
  biases: {
    homeTeam: { predictions: [], actuals: [] },
    awayTeam: { predictions: [], actuals: [] },
    favorites: { predictions: [], actuals: [] },
    underdogs: { predictions: [], actuals: [] }
  }
};

let processedCount = 0;

for (const game of gamesData) {
  try {
    if (!game.Visitor || !game.Home) continue;

    const homeTeam = getTeamCode(game.Home);
    const awayTeam = getTeamCode(game.Visitor);
    const awayScore = parseInt(game.Score);  // First Score column = Visitor/Away
    const homeScore = parseInt(game.Score_1); // Second Score column = Home

    if (isNaN(homeScore) || isNaN(awayScore)) continue;

    // Get predictions
    const homeTeamScore = dataProcessor.predictTeamScore(homeTeam, awayTeam, true, game['Home Goalie']);
    const awayTeamScore = dataProcessor.predictTeamScore(awayTeam, homeTeam, false, game['Visitor Goalie']);
    const predictedTotal = homeTeamScore + awayTeamScore;
    const actualTotal = homeScore + awayScore;

    // Win probabilities
    const homeWinProb = dataProcessor.calculatePoissonWinProb(homeTeamScore, awayTeamScore);
    const awayWinProb = dataProcessor.calculatePoissonWinProb(awayTeamScore, homeTeamScore);
    const homeWon = homeScore > awayScore ? 1 : 0;

    // Store prediction data
    results.predictions.push({
      date: game.Date,
      home: homeTeam,
      away: awayTeam,
      predictedHomeScore: homeTeamScore,
      predictedAwayScore: awayTeamScore,
      actualHomeScore: homeScore,
      actualAwayScore: awayScore,
      predictedTotal,
      actualTotal,
      homeWinProb,
      homeWon
    });

    results.calibrationData.homeProbs.push(homeWinProb);
    results.calibrationData.homeWins.push(homeWon);

    // Moneyline analysis with simulated market odds
    const marketHomeProb = 0.54; // Assume typical home ice probability
    const marketAwayProb = 0.46;
    
    const homeOdds = probabilityToOdds(marketHomeProb);
    const awayOdds = probabilityToOdds(marketAwayProb);
    
    const homeEV = calculateEV(homeWinProb, homeOdds);
    const awayEV = calculateEV(awayWinProb, awayOdds);

    // Determine bet rating based on EV
    function getRating(ev) {
      if (ev >= 10) return 'A+';
      if (ev >= 7) return 'A';
      if (ev >= 5) return 'B+';
      if (ev >= 3) return 'B';
      return 'C';
    }

    // Track moneyline bets (only >=3% EV, matching production)
    if (homeEV >= 3) {
      const rating = getRating(homeEV);
      const outcome = homeWon === 1 ? 'WIN' : 'LOSS';
      const profit = calculateProfit(outcome, homeOdds);
      
      results.bettingResults[rating].bets.push({
        team: homeTeam,
        predicted: homeWinProb,
        ev: homeEV,
        outcome,
        profit
      });
      results.bettingResults[rating].profit += profit;
    }

    if (awayEV >= 3) {
      const rating = getRating(awayEV);
      const outcome = homeWon === 0 ? 'WIN' : 'LOSS';
      const profit = calculateProfit(outcome, awayOdds);
      
      results.bettingResults[rating].bets.push({
        team: awayTeam,
        predicted: awayWinProb,
        ev: awayEV,
        outcome,
        profit
      });
      results.bettingResults[rating].profit += profit;
    }

    // Track biases
    results.biases.homeTeam.predictions.push(homeTeamScore);
    results.biases.homeTeam.actuals.push(homeScore);
    results.biases.awayTeam.predictions.push(awayTeamScore);
    results.biases.awayTeam.actuals.push(awayScore);

    const favorite = homeWinProb > awayWinProb ? 'home' : 'away';
    if (favorite === 'home') {
      results.biases.favorites.predictions.push(homeTeamScore);
      results.biases.favorites.actuals.push(homeScore);
      results.biases.underdogs.predictions.push(awayTeamScore);
      results.biases.underdogs.actuals.push(awayScore);
    } else {
      results.biases.favorites.predictions.push(awayTeamScore);
      results.biases.favorites.actuals.push(awayScore);
      results.biases.underdogs.predictions.push(homeTeamScore);
      results.biases.underdogs.actuals.push(homeScore);
    }

    processedCount++;
    if (processedCount % 50 === 0) {
      console.log(`   Processed ${processedCount}/${gamesData.length} games...`);
    }

  } catch (error) {
    console.error(`Error processing game: ${game.Home} vs ${game.Visitor}:`, error.message);
  }
}

console.log(`\n✅ Processed ${processedCount} games\n`);

// ============================================================================
// CALCULATE METRICS
// ============================================================================

console.log('📊 CALCULATING METRICS...\n');
console.log('='.repeat(80));

// 1. OVERALL ACCURACY
const winPredictions = results.predictions.map(p => p.homeWinProb > 0.5 ? 1 : 0);
const winActuals = results.predictions.map(p => p.homeWon);
const winAccuracy = winPredictions.filter((p, i) => p === winActuals[i]).length / winPredictions.length;

console.log('\n🎯 WIN PREDICTION ACCURACY');
console.log('-'.repeat(80));
console.log(`Win Accuracy: ${(winAccuracy * 100).toFixed(1)}% (${winPredictions.filter((p, i) => p === winActuals[i]).length}/${winPredictions.length})`);

const brierScore = calculateBrierScore(results.calibrationData.homeProbs, results.calibrationData.homeWins);
console.log(`Brier Score: ${brierScore.toFixed(4)} (Target: <0.23)`);

// 2. SCORE PREDICTION ACCURACY
const predictedTotals = results.predictions.map(p => p.predictedTotal);
const actualTotals = results.predictions.map(p => p.actualTotal);
const totalRMSE = calculateRMSE(predictedTotals, actualTotals);
const avgPredicted = predictedTotals.reduce((a, b) => a + b, 0) / predictedTotals.length;
const avgActual = actualTotals.reduce((a, b) => a + b, 0) / actualTotals.length;
const bias = avgPredicted - avgActual;

console.log('\n📊 TOTAL GOALS PREDICTION');
console.log('-'.repeat(80));
console.log(`RMSE: ${totalRMSE.toFixed(3)} goals (Target: <2.0)`);
console.log(`Average Predicted: ${avgPredicted.toFixed(2)} goals/game`);
console.log(`Average Actual: ${avgActual.toFixed(2)} goals/game`);
console.log(`Bias: ${bias.toFixed(3)} goals (${bias > 0 ? 'OVER' : 'UNDER'}-predicting)`);

// 3. CALIBRATION CURVE
console.log('\n📈 CALIBRATION CURVE ANALYSIS');
console.log('-'.repeat(80));
console.log('Probability Range | Avg Predicted | Avg Actual | Sample Size | Error');
console.log('-'.repeat(80));

const buckets = calibrationCurve(results.calibrationData.homeProbs, results.calibrationData.homeWins);
for (const [range, data] of Object.entries(buckets)) {
  if (data.predicted.length > 0) {
    const avgPred = data.predicted.reduce((a, b) => a + b, 0) / data.predicted.length;
    const avgActual = (data.actual.reduce((a, b) => a + b, 0) / data.actual.length) * 100;
    const error = avgActual - avgPred;
    const status = Math.abs(error) < 5 ? '✅' : Math.abs(error) < 10 ? '⚠️' : '❌';
    console.log(`${range.padEnd(18)} | ${avgPred.toFixed(1).padStart(13)}% | ${avgActual.toFixed(1).padStart(10)}% | ${data.predicted.length.toString().padStart(11)} | ${error.toFixed(1).padStart(5)}% ${status}`);
  }
}

// 4. BETTING PERFORMANCE BY RATING
console.log('\n💰 BETTING PERFORMANCE BY RATING (≥3% EV ONLY)');
console.log('-'.repeat(80));
console.log('Rating | Bets | Wins | Losses | Win Rate | Total Profit | ROI');
console.log('-'.repeat(80));

let totalBets = 0;
let totalWins = 0;
let totalProfit = 0;

for (const rating of ['A+', 'A', 'B+', 'B']) {
  const data = results.bettingResults[rating];
  const wins = data.bets.filter(b => b.outcome === 'WIN').length;
  const losses = data.bets.filter(b => b.outcome === 'LOSS').length;
  const winRate = data.bets.length > 0 ? (wins / data.bets.length * 100) : 0;
  const roi = data.bets.length > 0 ? (data.profit / data.bets.length * 100) : 0;
  
  if (data.bets.length > 0) {
    console.log(`${rating.padEnd(6)} | ${data.bets.length.toString().padStart(4)} | ${wins.toString().padStart(4)} | ${losses.toString().padStart(6)} | ${winRate.toFixed(1).padStart(8)}% | ${data.profit.toFixed(2).padStart(12)}u | ${roi.toFixed(1).padStart(6)}%`);
    totalBets += data.bets.length;
    totalWins += wins;
    totalProfit += data.profit;
  }
}

console.log('-'.repeat(80));
console.log(`TOTAL  | ${totalBets.toString().padStart(4)} | ${totalWins.toString().padStart(4)} | ${(totalBets - totalWins).toString().padStart(6)} | ${(totalWins / totalBets * 100).toFixed(1).padStart(8)}% | ${totalProfit.toFixed(2).padStart(12)}u | ${(totalProfit / totalBets * 100).toFixed(1).padStart(6)}%`);

// 5. SYSTEMATIC BIASES
console.log('\n🔍 SYSTEMATIC BIAS ANALYSIS');
console.log('-'.repeat(80));

const homeRMSE = calculateRMSE(results.biases.homeTeam.predictions, results.biases.homeTeam.actuals);
const awayRMSE = calculateRMSE(results.biases.awayTeam.predictions, results.biases.awayTeam.actuals);
const homeBias = results.biases.homeTeam.predictions.reduce((a, b) => a + b, 0) / results.biases.homeTeam.predictions.length - 
                 results.biases.homeTeam.actuals.reduce((a, b) => a + b, 0) / results.biases.homeTeam.actuals.length;
const awayBias = results.biases.awayTeam.predictions.reduce((a, b) => a + b, 0) / results.biases.awayTeam.predictions.length - 
                 results.biases.awayTeam.actuals.reduce((a, b) => a + b, 0) / results.biases.awayTeam.actuals.length;

console.log(`Home Team - RMSE: ${homeRMSE.toFixed(3)}, Bias: ${homeBias.toFixed(3)} (${homeBias > 0 ? 'OVER' : 'UNDER'}-predicting)`);
console.log(`Away Team - RMSE: ${awayRMSE.toFixed(3)}, Bias: ${awayBias.toFixed(3)} (${awayBias > 0 ? 'OVER' : 'UNDER'}-predicting)`);

const favRMSE = calculateRMSE(results.biases.favorites.predictions, results.biases.favorites.actuals);
const dogRMSE = calculateRMSE(results.biases.underdogs.predictions, results.biases.underdogs.actuals);
const favBias = results.biases.favorites.predictions.reduce((a, b) => a + b, 0) / results.biases.favorites.predictions.length - 
                results.biases.favorites.actuals.reduce((a, b) => a + b, 0) / results.biases.favorites.actuals.length;
const dogBias = results.biases.underdogs.predictions.reduce((a, b) => a + b, 0) / results.biases.underdogs.predictions.length - 
                results.biases.underdogs.actuals.reduce((a, b) => a + b, 0) / results.biases.underdogs.actuals.length;

console.log(`Favorites - RMSE: ${favRMSE.toFixed(3)}, Bias: ${favBias.toFixed(3)} (${favBias > 0 ? 'OVER' : 'UNDER'}-predicting)`);
console.log(`Underdogs - RMSE: ${dogRMSE.toFixed(3)}, Bias: ${dogBias.toFixed(3)} (${dogBias > 0 ? 'OVER' : 'UNDER'}-predicting)`);

// ============================================================================
// GENERATE RECOMMENDATIONS
// ============================================================================

console.log('\n' + '='.repeat(80));
console.log('🎯 RECOMMENDATIONS');
console.log('='.repeat(80));

const recommendations = [];

// Check win accuracy
if (winAccuracy < 0.55) {
  recommendations.push({
    priority: 'HIGH',
    issue: `Win accuracy (${(winAccuracy * 100).toFixed(1)}%) is below target (55%)`,
    action: 'Review win probability calculation - may need to adjust logistic function k parameter'
  });
} else if (winAccuracy >= 0.60) {
  recommendations.push({
    priority: 'INFO',
    issue: `Win accuracy (${(winAccuracy * 100).toFixed(1)}%) is EXCELLENT`,
    action: 'Current win prediction model is performing well'
  });
}

// Check Brier score
if (brierScore > 0.23) {
  recommendations.push({
    priority: 'MEDIUM',
    issue: `Brier score (${brierScore.toFixed(4)}) is above target (0.23)`,
    action: 'Calibration curve shows over/under-confidence in certain ranges - review calibration adjustments'
  });
}

// Check RMSE
if (totalRMSE > 2.0) {
  recommendations.push({
    priority: 'HIGH',
    issue: `Total goals RMSE (${totalRMSE.toFixed(3)}) is above target (2.0)`,
    action: 'Goals prediction needs improvement - review calibration constant'
  });
}

// Check bias
if (Math.abs(bias) > 0.2) {
  recommendations.push({
    priority: 'HIGH',
    issue: `Systematic ${bias > 0 ? 'OVER' : 'UNDER'}-prediction bias (${Math.abs(bias).toFixed(3)} goals)`,
    action: `${bias > 0 ? 'DECREASE' : 'INCREASE'} calibration constant by ~${(Math.abs(bias) / avgActual * 100).toFixed(1)}%`
  });
}

// Check betting ROI
const roi = totalProfit / totalBets * 100;
if (roi < 0) {
  recommendations.push({
    priority: 'CRITICAL',
    issue: `Betting ROI is NEGATIVE (${roi.toFixed(1)}%)`,
    action: 'Model is losing money - immediate recalibration required'
  });
} else if (roi < 5) {
  recommendations.push({
    priority: 'HIGH',
    issue: `Betting ROI is low (${roi.toFixed(1)}%)`,
    action: 'Model needs improvement to achieve profitable betting performance'
  });
}

// Print recommendations
recommendations.sort((a, b) => {
  const priority = { 'CRITICAL': 0, 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3, 'INFO': 4 };
  return priority[a.priority] - priority[b.priority];
});

for (const rec of recommendations) {
  const icon = rec.priority === 'CRITICAL' ? '🚨' : rec.priority === 'HIGH' ? '⚠️' : rec.priority === 'MEDIUM' ? '⚠️' : 'ℹ️';
  console.log(`\n${icon} ${rec.priority}: ${rec.issue}`);
  console.log(`   Action: ${rec.action}`);
}

// ============================================================================
// SAVE RESULTS
// ============================================================================

const timestamp = new Date().toISOString().split('T')[0];
const reportPath = join(__dirname, `../testing/results/backtest_${timestamp}.json`);
const mdReportPath = join(__dirname, `../BACKTEST_RESULTS_${timestamp}.md`);

// Save JSON
writeFileSync(reportPath, JSON.stringify({
  timestamp,
  sampleSize: processedCount,
  metrics: {
    winAccuracy,
    brierScore,
    totalRMSE,
    bias,
    avgPredicted,
    avgActual
  },
  bettingPerformance: {
    totalBets,
    totalWins,
    totalProfit,
    roi,
    byRating: results.bettingResults
  },
  biases: {
    home: { rmse: homeRMSE, bias: homeBias },
    away: { rmse: awayRMSE, bias: awayBias },
    favorites: { rmse: favRMSE, bias: favBias },
    underdogs: { rmse: dogRMSE, bias: dogBias }
  },
  recommendations
}, null, 2));

// Generate markdown report
let mdReport = `# COMPREHENSIVE BACKTEST RESULTS - ${timestamp}\n\n`;
mdReport += `**Sample Size:** ${processedCount} games\n`;
mdReport += `**Season:** 2025-26\n\n`;
mdReport += `---\n\n`;

mdReport += `## EXECUTIVE SUMMARY\n\n`;
mdReport += `| Metric | Result | Target | Status |\n`;
mdReport += `|--------|--------|--------|--------|\n`;
mdReport += `| Win Accuracy | ${(winAccuracy * 100).toFixed(1)}% | >55% | ${winAccuracy >= 0.55 ? '✅' : '❌'} |\n`;
mdReport += `| Brier Score | ${brierScore.toFixed(4)} | <0.23 | ${brierScore < 0.23 ? '✅' : '❌'} |\n`;
mdReport += `| Total Goals RMSE | ${totalRMSE.toFixed(3)} | <2.0 | ${totalRMSE < 2.0 ? '✅' : '❌'} |\n`;
mdReport += `| Prediction Bias | ${bias.toFixed(3)} goals | <±0.2 | ${Math.abs(bias) < 0.2 ? '✅' : '❌'} |\n`;
mdReport += `| Betting ROI | ${roi.toFixed(1)}% | >5% | ${roi >= 5 ? '✅' : '❌'} |\n\n`;

mdReport += `---\n\n`;
mdReport += `## BETTING PERFORMANCE (≥3% EV)\n\n`;
mdReport += `| Rating | Bets | Win Rate | Profit (units) | ROI |\n`;
mdReport += `|--------|------|----------|----------------|-----|\n`;
for (const rating of ['A+', 'A', 'B+', 'B']) {
  const data = results.bettingResults[rating];
  if (data.bets.length > 0) {
    const wins = data.bets.filter(b => b.outcome === 'WIN').length;
    const winRate = wins / data.bets.length * 100;
    const ratingROI = data.profit / data.bets.length * 100;
    mdReport += `| ${rating} | ${data.bets.length} | ${winRate.toFixed(1)}% | ${data.profit.toFixed(2)} | ${ratingROI.toFixed(1)}% |\n`;
  }
}
mdReport += `| **TOTAL** | **${totalBets}** | **${(totalWins / totalBets * 100).toFixed(1)}%** | **${totalProfit.toFixed(2)}** | **${roi.toFixed(1)}%** |\n\n`;

mdReport += `---\n\n`;
mdReport += `## RECOMMENDATIONS\n\n`;
for (const rec of recommendations) {
  mdReport += `### ${rec.priority}: ${rec.issue}\n\n`;
  mdReport += `**Action:** ${rec.action}\n\n`;
}

writeFileSync(mdReportPath, mdReport);

console.log(`\n\n✅ Results saved to:`);
console.log(`   JSON: ${reportPath}`);
console.log(`   Report: ${mdReportPath}`);
console.log('\n' + '='.repeat(80));
console.log('BACKTEST COMPLETE');
console.log('='.repeat(80) + '\n');

