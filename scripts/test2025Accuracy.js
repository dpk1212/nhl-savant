/**
 * 2025-26 Early Season Accuracy Test
 * 
 * Tests model predictions against actual game results
 * Calculates RMSE, bias, Brier score, and win accuracy
 * 
 * Run with: node scripts/test2025Accuracy.js
 */

import Papa from 'papaparse';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { NHLDataProcessor } from '../src/utils/dataProcessing.js';
import { GoalieProcessor } from '../src/utils/goalieProcessor.js';
import { ScheduleHelper } from '../src/utils/scheduleHelper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('\n🏒 2025-26 EARLY SEASON ACCURACY TEST');
console.log('=' .repeat(70));

// Load data
console.log('\n📂 Loading data files...\n');

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

const gamesRaw = Papa.parse(readFileSync(gamesPath, 'utf-8'), {
  header: false,
  skipEmptyLines: true
}).data;

// Remove header
gamesRaw.shift();

console.log(`✅ Teams: ${teamsData.filter(t => t.situation === '5on5').length} teams (5on5 data)`);
console.log(`✅ Goalies: ${goaliesData.filter(g => g.situation === '5on5').length} goalies (5on5 data)`);
console.log(`✅ Games: ${gamesRaw.length} total games\n`);

// Filter to regulation games only (most relevant for betting)
const regulationGames = gamesRaw.filter(g => g[7] === 'Regulation');
console.log(`🎯 Testing against ${regulationGames.length} regulation games\n`);

// Initialize processors
const goalieProcessor = new GoalieProcessor(goaliesData);
const scheduleHelper = new ScheduleHelper();
const dataProcessor = new NHLDataProcessor(teamsData, goalieProcessor, scheduleHelper);

// Results storage
const predictions = [];
const errors = [];
let totalSquaredError = 0;
let totalError = 0;
let correctWinPredictions = 0;
let totalBrierScore = 0;

// Team name to code mapping
const teamNameToCode = {
  'Anaheim Ducks': 'ANA',
  'Arizona Coyotes': 'ARI',
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
  'Utah Hockey Club': 'UTA',
  'Vancouver Canucks': 'VAN',
  'Vegas Golden Knights': 'VGK',
  'Washington Capitals': 'WSH',
  'Winnipeg Jets': 'WPG'
};

console.log('🔄 Running predictions...\n');

// Process each game
regulationGames.forEach((game, index) => {
  const date = game[0];
  const awayTeam = game[3];
  const homeTeam = game[5];
  const awayScore = parseInt(game[4]);
  const homeScore = parseInt(game[6]);
  const awayGoalie = game[8];
  const homeGoalie = game[9];
  
  if (!awayScore || !homeScore || awayScore < 0 || homeScore < 0) {
    return; // Skip invalid games
  }
  
  const actualTotal = awayScore + homeScore;
  const homeWon = homeScore > awayScore;
  
  try {
    // Get team codes using mapping
    const awayCode = teamNameToCode[awayTeam] || awayTeam.substring(0, 3).toUpperCase();
    const homeCode = teamNameToCode[homeTeam] || homeTeam.substring(0, 3).toUpperCase();
    
    // Predict scores (same as production)
    const awayPredicted = dataProcessor.predictTeamScore(awayCode, homeCode, false, awayGoalie);
    const homePredicted = dataProcessor.predictTeamScore(homeCode, awayCode, true, homeGoalie);
    const predictedTotal = awayPredicted + homePredicted;
    
    // CRITICAL FIX: Use the ACTUAL production win probability calculation
    // This uses Poisson distribution with pre-calculated scores (same as EdgeCalculator)
    const homeWinProb = dataProcessor.calculatePoissonWinProb(homePredicted, awayPredicted);
    
    // Calculate errors
    const error = predictedTotal - actualTotal;
    const squaredError = error * error;
    
    // Brier score (for home team win)
    const brierScore = Math.pow(homeWinProb - (homeWon ? 1 : 0), 2);
    
    // Track results
    predictions.push({
      date,
      away: awayCode,
      home: homeCode,
      predictedTotal: predictedTotal.toFixed(2),
      actualTotal,
      error: error.toFixed(2),
      homeWinProb: (homeWinProb * 100).toFixed(1),
      homeWon,
      predictedHomeWin: homeWinProb > 0.5,
      awayPredicted: awayPredicted.toFixed(2),
      homePredicted: homePredicted.toFixed(2),
      awayActual: awayScore,
      homeActual: homeScore
    });
    
    errors.push(error);
    totalSquaredError += squaredError;
    totalError += error;
    totalBrierScore += brierScore;
    
    if ((homeWinProb > 0.5 && homeWon) || (homeWinProb <= 0.5 && !homeWon)) {
      correctWinPredictions++;
    }
    
    // Progress indicator
    if ((index + 1) % 20 === 0) {
      console.log(`   Processed ${index + 1}/${regulationGames.length} games...`);
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${awayTeam} @ ${homeTeam}: ${error.message}`);
  }
});

console.log(`   Processed ${predictions.length}/${regulationGames.length} games\n`);

// Calculate metrics
const n = predictions.length;
const rmse = Math.sqrt(totalSquaredError / n);
const avgError = totalError / n;
const brierScore = totalBrierScore / n;
const winAccuracy = (correctWinPredictions / n) * 100;

// Calculate calibration curve
const calibrationBins = [];
for (let i = 40; i <= 95; i += 5) {
  calibrationBins.push({
    min: i / 100,
    max: (i + 5) / 100,
    predictions: [],
    actuals: []
  });
}

predictions.forEach(p => {
  const prob = parseFloat(p.homeWinProb) / 100;
  const actual = p.homeWon ? 1 : 0;
  
  const bin = calibrationBins.find(b => prob >= b.min && prob < b.max);
  if (bin) {
    bin.predictions.push(prob);
    bin.actuals.push(actual);
  }
});

// Print results
console.log('=' .repeat(70));
console.log('\n📊 TOTAL GOALS ACCURACY:\n');
console.log(`  Sample Size:   ${n} games`);
console.log(`  RMSE:          ${rmse.toFixed(3)} goals`);
console.log(`  Average Error: ${avgError >= 0 ? '+' : ''}${avgError.toFixed(3)} goals`);
console.log(`  Target:        < 2.0 RMSE, ±0.1 bias\n`);

if (rmse < 2.0 && Math.abs(avgError) < 0.1) {
  console.log(`  ✅ EXCELLENT - Within target range!`);
} else if (rmse < 2.5 && Math.abs(avgError) < 0.15) {
  console.log(`  ⚠️  GOOD - Close to target`);
} else {
  console.log(`  ❌ NEEDS IMPROVEMENT`);
}

console.log('\n' + '=' .repeat(70));
console.log('\n🎯 WIN PROBABILITY ACCURACY:\n');
console.log(`  Brier Score:   ${brierScore.toFixed(4)}`);
console.log(`  Win Accuracy:  ${winAccuracy.toFixed(1)}%`);
console.log(`  Target:        < 0.23, > 55%\n`);

if (brierScore < 0.23 && winAccuracy > 55) {
  console.log(`  ✅ EXCELLENT - Within target range!`);
} else if (brierScore < 0.25 && winAccuracy > 50) {
  console.log(`  ⚠️  GOOD - Close to target`);
} else {
  console.log(`  ❌ NEEDS IMPROVEMENT`);
}

console.log('\n' + '=' .repeat(70));
console.log('\n📈 CALIBRATION CURVE:\n');

calibrationBins.forEach(bin => {
  if (bin.predictions.length > 0) {
    const avgPredicted = bin.predictions.reduce((a, b) => a + b, 0) / bin.predictions.length;
    const avgActual = bin.actuals.reduce((a, b) => a + b, 0) / bin.actuals.length;
    const count = bin.predictions.length;
    
    console.log(`  ${(bin.min * 100).toFixed(0)}-${(bin.max * 100).toFixed(0)}%: Predicted ${(avgPredicted * 100).toFixed(1)}%, Actual ${(avgActual * 100).toFixed(1)}% (n=${count})`);
  }
});

// Error distribution
console.log('\n' + '=' .repeat(70));
console.log('\n📉 ERROR DISTRIBUTION:\n');

const sortedErrors = [...errors].sort((a, b) => a - b);
const percentiles = [10, 25, 50, 75, 90];
percentiles.forEach(p => {
  const index = Math.floor((p / 100) * sortedErrors.length);
  console.log(`  ${p}th percentile: ${sortedErrors[index] >= 0 ? '+' : ''}${sortedErrors[index].toFixed(2)} goals`);
});

// Find problem areas
console.log('\n' + '=' .repeat(70));
console.log('\n🔍 WORST PREDICTIONS:\n');

const worstPredictions = [...predictions]
  .sort((a, b) => Math.abs(b.error) - Math.abs(a.error))
  .slice(0, 5);

worstPredictions.forEach((p, i) => {
  console.log(`${i + 1}. ${p.date}: ${p.away} @ ${p.home}`);
  console.log(`   Predicted: ${p.predictedTotal} (${p.awayPredicted}-${p.homePredicted})`);
  console.log(`   Actual:    ${p.actualTotal} (${p.awayActual}-${p.homeActual})`);
  console.log(`   Error:     ${p.error} goals\n`);
});

console.log('=' .repeat(70));
console.log('\n✅ Accuracy test complete!\n');
console.log('📄 Detailed report will be generated in EARLY_SEASON_2025_ACCURACY.md\n');

// Generate markdown report
const reportLines = [
  '# 2025-26 Early Season Accuracy Test Results',
  '',
  `**Test Date**: ${new Date().toLocaleDateString()}`,
  `**Sample Size**: ${n} regulation games`,
  `**Date Range**: ${predictions[0].date} to ${predictions[predictions.length - 1].date}`,
  '',
  '---',
  '',
  '## Executive Summary',
  '',
  '### Total Goals Accuracy',
  '',
  `- **RMSE**: ${rmse.toFixed(3)} goals ${rmse < 2.0 ? '✅' : '❌'}`,
  `- **Average Error**: ${avgError >= 0 ? '+' : ''}${avgError.toFixed(3)} goals ${Math.abs(avgError) < 0.1 ? '✅' : '⚠️'}`,
  `- **Target**: < 2.0 RMSE, ±0.1 bias`,
  '',
  '### Win Probability Accuracy',
  '',
  `- **Brier Score**: ${brierScore.toFixed(4)} ${brierScore < 0.23 ? '✅' : '❌'}`,
  `- **Win Accuracy**: ${winAccuracy.toFixed(1)}% ${winAccuracy > 55 ? '✅' : '⚠️'}`,
  `- **Target**: < 0.23, > 55%`,
  '',
  '---',
  '',
  '## Calibration Curve',
  '',
  '| Probability Range | Avg Predicted | Avg Actual | Sample Size | Error |',
  '|-------------------|---------------|------------|-------------|-------|'
];

calibrationBins.forEach(bin => {
  if (bin.predictions.length > 0) {
    const avgPredicted = bin.predictions.reduce((a, b) => a + b, 0) / bin.predictions.length;
    const avgActual = bin.actuals.reduce((a, b) => a + b, 0) / bin.actuals.length;
    const error = Math.abs(avgPredicted - avgActual);
    reportLines.push(
      `| ${(bin.min * 100).toFixed(0)}-${(bin.max * 100).toFixed(0)}% | ${(avgPredicted * 100).toFixed(1)}% | ${(avgActual * 100).toFixed(1)}% | ${bin.predictions.length} | ${(error * 100).toFixed(1)}% |`
    );
  }
});

reportLines.push(
  '',
  '---',
  '',
  '## All Game Predictions',
  '',
  '| Date | Matchup | Predicted | Actual | Error | Home Win Prob | Result |',
  '|------|---------|-----------|--------|-------|---------------|--------|'
);

predictions.forEach(p => {
  const result = (p.homeWinProb > 50 && p.homeWon) || (p.homeWinProb <= 50 && !p.homeWon) ? '✅' : '❌';
  reportLines.push(
    `| ${p.date} | ${p.away} @ ${p.home} | ${p.predictedTotal} (${p.awayPredicted}-${p.homePredicted}) | ${p.actualTotal} (${p.awayActual}-${p.homeActual}) | ${p.error} | ${p.homeWinProb}% | ${result} |`
  );
});

reportLines.push(
  '',
  '---',
  '',
  '## Recommendations',
  ''
);

if (rmse > 2.0) {
  reportLines.push('### High RMSE');
  reportLines.push('- Consider reviewing calibration constant');
  reportLines.push('- Check for systematic biases in specific situations');
  reportLines.push('');
}

if (Math.abs(avgError) > 0.1) {
  if (avgError > 0) {
    reportLines.push('### Over-Prediction Bias');
    reportLines.push('- Model consistently predicts too many goals');
    reportLines.push('- Reduce calibration constant slightly');
  } else {
    reportLines.push('### Under-Prediction Bias');
    reportLines.push('- Model consistently predicts too few goals');
    reportLines.push('- Increase calibration constant slightly');
  }
  reportLines.push('');
}

if (brierScore > 0.23) {
  reportLines.push('### Poor Win Probability Calibration');
  reportLines.push('- Review k parameter in win probability function');
  reportLines.push('- Check home ice advantage application');
  reportLines.push('');
}

// Write report
import { writeFileSync } from 'fs';
const reportPath = join(__dirname, '..', 'EARLY_SEASON_2025_ACCURACY.md');
writeFileSync(reportPath, reportLines.join('\n'));

console.log(`📄 Report saved to: EARLY_SEASON_2025_ACCURACY.md\n`);

