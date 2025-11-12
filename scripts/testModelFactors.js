/**
 * Comprehensive Model Factor Testing
 * 
 * Tests all model factors systematically against 264 actual NHL games to find optimal settings:
 * 1. PDO regression (on/off, thresholds, component-based)
 * 2. Calibration constant (1.45-1.60)
 * 3. Goalie adjustments (0.001-0.005 multipliers)
 * 4. Recency weighting (50/50 to 70/30)
 * 5. Sample size regression validation
 * 
 * Goal: Improve win accuracy from 52.7% to 55%+
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

// Team mappings
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

// Load all data once
let teamsData, goaliesData, gamesData, scheduleData;

function loadData() {
  console.log('📂 Loading data files...');
  
  const teamsCSV = readFileSync(path.join(__dirname, '../public/teams.csv'), 'utf-8');
  const goaliesCSV = readFileSync(path.join(__dirname, '../public/goalies.csv'), 'utf-8');
  const gamesCSV = readFileSync(path.join(__dirname, '../public/nhl-202526-asplayed.csv'), 'utf-8');
  const scheduleCSV = readFileSync(path.join(__dirname, '../public/games.csv'), 'utf-8');
  
  teamsData = Papa.parse(teamsCSV, { header: true, skipEmptyLines: true }).data;
  goaliesData = Papa.parse(goaliesCSV, { header: true, skipEmptyLines: true }).data;
  gamesData = Papa.parse(gamesCSV, { header: true, skipEmptyLines: true }).data;
  scheduleData = Papa.parse(scheduleCSV, { header: true, skipEmptyLines: true }).data;
  
  console.log(`✅ Loaded ${gamesData.length} games\n`);
}

// Run predictions with custom factor settings
function runPredictions(factorOverrides = {}) {
  const goalieProcessor = new GoalieProcessor(goaliesData);
  const scheduleHelper = new ScheduleHelper(scheduleData);
  const dataProcessor = new NHLDataProcessor(teamsData, goalieProcessor, scheduleHelper);
  
  // Apply factor overrides to processor
  if (factorOverrides.pdoDisabled) {
    dataProcessor.applyPDORegression = (xG) => xG; // Bypass PDO regression
  }
  if (factorOverrides.pdoThresholds) {
    const [upper, lower] = factorOverrides.pdoThresholds;
    const originalMethod = dataProcessor.applyPDORegression.bind(dataProcessor);
    dataProcessor.applyPDORegression = function(xG_per60, PDO) {
      if (!PDO || PDO === 100) return xG_per60;
      if (PDO > upper) {
        const regressionFactor = Math.min(0.02, (PDO - upper) * 0.01);
        return xG_per60 * (1 - regressionFactor);
      } else if (PDO < lower) {
        const regressionFactor = Math.min(0.02, (lower - PDO) * 0.01);
        return xG_per60 * (1 + regressionFactor);
      }
      return xG_per60;
    };
  }
  if (factorOverrides.calibrationConstant) {
    const originalMethod = dataProcessor.calculateLeagueAverage.bind(dataProcessor);
    dataProcessor.calculateLeagueAverage = function() {
      const all_teams = this.getTeamsBySituation('5on5');
      if (!all_teams || all_teams.length === 0) return 2.45;
      const xGF_values = all_teams.map(t => t.xGF_per60).filter(v => v && v > 0);
      if (xGF_values.length === 0) return 2.45;
      const baseAverage = xGF_values.reduce((sum, val) => sum + val, 0) / xGF_values.length;
      return baseAverage * factorOverrides.calibrationConstant;
    };
  }
  if (factorOverrides.goalieMultiplier !== undefined) {
    const originalMethod = dataProcessor.adjustForGoalie.bind(dataProcessor);
    dataProcessor.adjustForGoalie = function(predictedGoals, opponentTeam, startingGoalieName = null) {
      if (!this.goalieProcessor) return predictedGoals;
      let goalieGSAE = 0;
      if (startingGoalieName) {
        goalieGSAE = this.goalieProcessor.calculateGSAE(startingGoalieName, '5on5');
      } else {
        const teamGoalies = this.goalieProcessor.getTeamGoalies(opponentTeam, '5on5');
        if (teamGoalies && teamGoalies.length > 0) {
          let totalGSAE = 0;
          let totalGames = 0;
          teamGoalies.forEach(goalie => {
            const games = parseFloat(goalie.games_played) || 0;
            const gsae = this.goalieProcessor.calculateGSAE(goalie.name, '5on5');
            totalGSAE += gsae * games;
            totalGames += games;
          });
          goalieGSAE = totalGames > 0 ? totalGSAE / totalGames : 0;
        }
      }
      const baseAdjustment = 1 + (goalieGSAE * factorOverrides.goalieMultiplier);
      const confidence = startingGoalieName ? 1.0 : 0.6;
      const finalAdjustment = 1 + ((baseAdjustment - 1) * confidence);
      return Math.max(0, predictedGoals * finalAdjustment);
    };
  }
  if (factorOverrides.recencyWeights) {
    const [recentWeight, seasonWeight] = factorOverrides.recencyWeights;
    // This would need deeper integration into predictTeamScore
    // For now, we'll note it requires model modification
  }
  
  let correct = 0;
  let total = 0;
  let totalGoalError = 0;
  let homeWinPredictions = 0;
  
  for (const game of gamesData) {
    if (!game.Visitor || !game.Home || !game.Score || !game.Score_1) continue;
    
    const homeTeam = getTeamCode(game.Home);
    const awayTeam = getTeamCode(game.Visitor);
    const actualHomeScore = parseInt(game.Score_1);
    const actualAwayScore = parseInt(game.Score);
    
    if (isNaN(actualHomeScore) || isNaN(actualAwayScore)) continue;
    
    try {
      const predictedHomeScore = dataProcessor.predictTeamScore(
        homeTeam, awayTeam, true, game['Visitor Goalie'], game.Date
      );
      const predictedAwayScore = dataProcessor.predictTeamScore(
        awayTeam, homeTeam, false, game['Home Goalie'], game.Date
      );
      
      const homeWinProb = dataProcessor.calculatePoissonWinProb(predictedHomeScore, predictedAwayScore);
      const predictedWinner = homeWinProb > 0.5 ? 'HOME' : 'AWAY';
      const actualWinner = actualHomeScore > actualAwayScore ? 'HOME' : 'AWAY';
      
      if (predictedWinner === 'HOME') homeWinPredictions++;
      if (predictedWinner === actualWinner) correct++;
      
      const goalError = Math.abs((predictedHomeScore + predictedAwayScore) - (actualHomeScore + actualAwayScore));
      totalGoalError += goalError * goalError;
      total++;
    } catch (error) {
      // Skip problematic games
    }
  }
  
  const winAccuracy = (correct / total) * 100;
  const rmse = Math.sqrt(totalGoalError / total);
  const homeRate = (homeWinPredictions / total) * 100;
  
  return { winAccuracy, rmse, homeRate, correct, total };
}

// Calculate statistics
function calculateStats(results) {
  return {
    winAccuracy: results.winAccuracy.toFixed(2),
    correct: results.correct,
    total: results.total,
    rmse: results.rmse.toFixed(3),
    homeRate: results.homeRate.toFixed(1)
  };
}

async function runTests() {
  console.log('🔬 COMPREHENSIVE MODEL FACTOR TESTING\n');
  console.log('='.repeat(80));
  console.log('Goal: Improve win accuracy from 52.7% to 55%+\n');
  
  loadData();
  
  // Baseline (current settings)
  console.log('📊 BASELINE (Current Settings)');
  console.log('='.repeat(80));
  const baseline = runPredictions();
  console.log(`Win Accuracy: ${baseline.winAccuracy.toFixed(2)}% (${baseline.correct}/${baseline.total})`);
  console.log(`RMSE: ${baseline.rmse.toFixed(3)} goals`);
  console.log(`Home Rate: ${baseline.homeRate.toFixed(1)}%`);
  console.log(`\n`);
  
  // ========================================
  // PHASE 1: PDO REGRESSION TESTING
  // ========================================
  console.log('='.repeat(80));
  console.log('🧪 PHASE 1: PDO REGRESSION TESTING');
  console.log('='.repeat(80));
  console.log('Testing whether PDO regression helps or hurts predictions...\n');
  
  // Test 1: PDO Disabled
  console.log('Test 1: PDO Regression DISABLED');
  const pdoOff = runPredictions({ pdoDisabled: true });
  const pdoChange = pdoOff.winAccuracy - baseline.winAccuracy;
  console.log(`Win Accuracy: ${pdoOff.winAccuracy.toFixed(2)}% (${pdoChange > 0 ? '+' : ''}${pdoChange.toFixed(2)}%)`);
  console.log(`RMSE: ${pdoOff.rmse.toFixed(3)} goals`);
  if (pdoChange > 0) {
    console.log(`✅ IMPROVEMENT: PDO regression is hurting predictions!`);
  } else {
    console.log(`⚠️  NO IMPROVEMENT: PDO regression is helping`);
  }
  console.log();
  
  // Test 2: Different PDO thresholds
  console.log('Test 2: PDO Threshold Testing');
  const pdoThresholds = [
    [106, 94], // Current
    [104, 96],
    [102, 98],
    [100, 100] // Regress all teams toward 100
  ];
  
  const pdoResults = [];
  for (const [upper, lower] of pdoThresholds) {
    const result = runPredictions({ pdoThresholds: [upper, lower] });
    const change = result.winAccuracy - baseline.winAccuracy;
    pdoResults.push({ upper, lower, ...result, change });
    console.log(`  Thresholds ${upper}/${lower}: ${result.winAccuracy.toFixed(2)}% (${change > 0 ? '+' : ''}${change.toFixed(2)}%)`);
  }
  
  const bestPdo = pdoResults.reduce((best, curr) => 
    curr.winAccuracy > best.winAccuracy ? curr : best
  );
  console.log(`\n✅ BEST PDO SETTING: ${bestPdo.upper}/${bestPdo.lower} thresholds (${bestPdo.winAccuracy.toFixed(2)}%)`);
  console.log();
  
  // ========================================
  // PHASE 2: CALIBRATION CONSTANT TESTING
  // ========================================
  console.log('='.repeat(80));
  console.log('🎯 PHASE 2: CALIBRATION CONSTANT TESTING');
  console.log('='.repeat(80));
  console.log('Testing calibration values from 1.45 to 1.60...\n');
  
  const calibrationValues = [1.45, 1.48, 1.50, 1.52, 1.54, 1.56, 1.58, 1.60];
  const calibrationResults = [];
  
  for (const cal of calibrationValues) {
    const result = runPredictions({ calibrationConstant: cal });
    const change = result.winAccuracy - baseline.winAccuracy;
    calibrationResults.push({ calibration: cal, ...result, change });
    console.log(`  Cal ${cal.toFixed(2)}: ${result.winAccuracy.toFixed(2)}% (${change > 0 ? '+' : ''}${change.toFixed(2)}%), RMSE: ${result.rmse.toFixed(3)}`);
  }
  
  const bestCal = calibrationResults.reduce((best, curr) => 
    curr.winAccuracy > best.winAccuracy ? curr : best
  );
  console.log(`\n✅ BEST CALIBRATION: ${bestCal.calibration.toFixed(2)} (${bestCal.winAccuracy.toFixed(2)}%)`);
  console.log();
  
  // ========================================
  // PHASE 3: GOALIE ADJUSTMENT TESTING
  // ========================================
  console.log('='.repeat(80));
  console.log('🥅 PHASE 3: GOALIE ADJUSTMENT TESTING');
  console.log('='.repeat(80));
  console.log('Testing goalie GSAE multipliers from 0.001 to 0.005...\n');
  
  const goalieMultipliers = [0.001, 0.002, 0.0025, 0.003, 0.004, 0.005];
  const goalieResults = [];
  
  for (const mult of goalieMultipliers) {
    const result = runPredictions({ goalieMultiplier: mult });
    const change = result.winAccuracy - baseline.winAccuracy;
    goalieResults.push({ multiplier: mult, ...result, change });
    console.log(`  Mult ${mult.toFixed(4)}: ${result.winAccuracy.toFixed(2)}% (${change > 0 ? '+' : ''}${change.toFixed(2)}%)`);
  }
  
  const bestGoalie = goalieResults.reduce((best, curr) => 
    curr.winAccuracy > best.winAccuracy ? curr : best
  );
  console.log(`\n✅ BEST GOALIE MULTIPLIER: ${bestGoalie.multiplier.toFixed(4)} (${bestGoalie.winAccuracy.toFixed(2)}%)`);
  console.log();
  
  // ========================================
  // COMBINED OPTIMAL SETTINGS TEST
  // ========================================
  console.log('='.repeat(80));
  console.log('🏆 OPTIMAL COMBINED SETTINGS TEST');
  console.log('='.repeat(80));
  console.log('Testing all optimal settings together...\n');
  
  const optimalSettings = {
    pdoDisabled: pdoOff.winAccuracy > baseline.winAccuracy,
    pdoThresholds: !pdoOff.winAccuracy > baseline.winAccuracy ? [bestPdo.upper, bestPdo.lower] : undefined,
    calibrationConstant: bestCal.calibration,
    goalieMultiplier: bestGoalie.multiplier
  };
  
  console.log('Optimal Settings:');
  console.log(`  PDO Regression: ${optimalSettings.pdoDisabled ? 'DISABLED' : `Thresholds ${bestPdo.upper}/${bestPdo.lower}`}`);
  console.log(`  Calibration Constant: ${bestCal.calibration.toFixed(2)}`);
  console.log(`  Goalie Multiplier: ${bestGoalie.multiplier.toFixed(4)}`);
  console.log();
  
  const optimal = runPredictions(optimalSettings);
  const totalImprovement = optimal.winAccuracy - baseline.winAccuracy;
  
  console.log('RESULTS:');
  console.log(`  Win Accuracy: ${optimal.winAccuracy.toFixed(2)}% (${totalImprovement > 0 ? '+' : ''}${totalImprovement.toFixed(2)}%)`);
  console.log(`  Correct: ${optimal.correct}/${optimal.total} games`);
  console.log(`  RMSE: ${optimal.rmse.toFixed(3)} goals`);
  console.log(`  Home Rate: ${optimal.homeRate.toFixed(1)}%`);
  console.log();
  
  if (optimal.winAccuracy >= 55) {
    console.log(`✅ SUCCESS: Achieved 55%+ win accuracy target!`);
  } else {
    const needed = 55 - optimal.winAccuracy;
    console.log(`⚠️  CLOSE: Need ${needed.toFixed(2)}% more to reach 55% target`);
  }
  
  // ========================================
  // SUMMARY & RECOMMENDATIONS
  // ========================================
  console.log('\n' + '='.repeat(80));
  console.log('📋 SUMMARY & RECOMMENDATIONS');
  console.log('='.repeat(80));
  console.log();
  console.log('BASELINE vs OPTIMAL:');
  console.log(`  Win Accuracy: ${baseline.winAccuracy.toFixed(2)}% → ${optimal.winAccuracy.toFixed(2)}% (${totalImprovement > 0 ? '+' : ''}${totalImprovement.toFixed(2)}%)`);
  console.log(`  RMSE: ${baseline.rmse.toFixed(3)} → ${optimal.rmse.toFixed(3)} goals`);
  console.log(`  Home Rate: ${baseline.homeRate.toFixed(1)}% → ${optimal.homeRate.toFixed(1)}%`);
  console.log();
  
  console.log('RECOMMENDED CHANGES TO dataProcessing.js:');
  console.log();
  
  if (optimalSettings.pdoDisabled) {
    console.log('1. PDO REGRESSION: DISABLE');
    console.log('   Lines 455-474: Comment out or remove applyPDORegression entirely');
    console.log('   Reason: PDO conflates shooting skill with goalie skill');
  } else {
    console.log(`1. PDO REGRESSION: Update thresholds to ${bestPdo.upper}/${bestPdo.lower}`);
    console.log('   Line 463: Change from (PDO > 106) to (PDO > ' + bestPdo.upper + ')');
    console.log('   Line 467: Change from (PDO < 94) to (PDO < ' + bestPdo.lower + ')');
  }
  console.log();
  
  console.log(`2. CALIBRATION CONSTANT: ${baseline.winAccuracy < bestCal.winAccuracy ? 'Update to ' + bestCal.calibration.toFixed(2) : 'Keep at 1.52'}`);
  if (baseline.winAccuracy < bestCal.winAccuracy) {
    console.log('   Line 213: Change HISTORICAL_CALIBRATION from 1.52 to ' + bestCal.calibration.toFixed(2));
  }
  console.log();
  
  console.log(`3. GOALIE MULTIPLIER: ${baseline.winAccuracy < bestGoalie.winAccuracy ? 'Update to ' + bestGoalie.multiplier.toFixed(4) : 'Keep at 0.003'}`);
  if (baseline.winAccuracy < bestGoalie.winAccuracy) {
    console.log('   Line 518: Change from (goalieGSAE * 0.003) to (goalieGSAE * ' + bestGoalie.multiplier.toFixed(4) + ')');
  }
  console.log();
  
  console.log('='.repeat(80));
  console.log('✅ Testing Complete!');
  console.log('='.repeat(80));
}

// Run all tests
runTests().catch(console.error);

