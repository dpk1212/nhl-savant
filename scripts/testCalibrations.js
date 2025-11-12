/**
 * Calibration Parameter Testing Script
 * 
 * Tests different calibration constants to find optimal values:
 * - CALIBRATION_CONSTANT (1.3 to 1.7 range)
 * - Win probability k parameter (0.4 to 0.7 range)
 * - Home ice advantage (0.03 to 0.06 range)
 * 
 * Identifies which settings minimize RMSE and maximize win accuracy
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔬 CALIBRATION PARAMETER TESTING');
console.log('='.repeat(80));

// Load data
const gamesCSV = readFileSync(join(__dirname, '../public/nhl-202526-asplayed.csv'), 'utf-8');
const gamesData = Papa.parse(gamesCSV, { header: true }).data
  .filter(g => g.Status === 'Regulation' || g.Status === 'OT' || g.Status === 'SO')
  .slice(0, 100); // Test on first 100 games for speed

const teamsCSV = readFileSync(join(__dirname, '../public/teams.csv'), 'utf-8');
const teamsData = Papa.parse(teamsCSV, { header: true }).data;

console.log(`\n✅ Loaded ${gamesData.length} games for calibration testing\n`);

// Team mapping
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

// Simplified prediction function for testing
function predictScore(teamCode, oppCode, isHome, teams, calibrationConstant, homeIceBonus) {
  const team = teams.find(t => t.team === teamCode);
  const opp = teams.find(t => t.team === oppCode);
  
  if (!team || !opp) return 3.0; // Default
  
  const teamXGF = parseFloat(team['5v5 sa_xGF/60']) || 2.5;
  const oppXGA = parseFloat(opp['5v5 sa_xGA/60']) || 2.5;
  
  let baseScore = (teamXGF + oppXGA) / 2;
  baseScore *= calibrationConstant;
  
  if (isHome) {
    baseScore *= (1 + homeIceBonus);
  }
  
  return baseScore;
}

// Calculate win probability with variable k
function calculateWinProb(teamScore, oppScore, k) {
  const diff = teamScore - oppScore;
  return 1 / (1 + Math.exp(-k * diff));
}

// RMSE calculation
function calculateRMSE(predictions, actuals) {
  let sum = 0;
  for (let i = 0; i < predictions.length; i++) {
    const error = predictions[i] - actuals[i];
    sum += error * error;
  }
  return Math.sqrt(sum / predictions.length);
}

// Test grid
const calibrationConstants = [1.30, 1.35, 1.40, 1.45, 1.50, 1.55, 1.60, 1.65, 1.70];
const kValues = [0.40, 0.45, 0.50, 0.55, 0.60, 0.65, 0.70];
const homeIceBonuses = [0.030, 0.035, 0.040, 0.045, 0.050];

console.log('🔬 Testing calibration combinations...\n');
console.log('Testing:');
console.log(`  - ${calibrationConstants.length} calibration constants`);
console.log(`  - ${kValues.length} k values (win probability sensitivity)`);
console.log(`  - ${homeIceBonuses.length} home ice bonuses`);
console.log(`  - Total: ${calibrationConstants.length * kValues.length * homeIceBonuses.length} combinations\n`);

const results = [];
let tested = 0;
const total = calibrationConstants.length * kValues.length * homeIceBonuses.length;

for (const calibConst of calibrationConstants) {
  for (const k of kValues) {
    for (const homeBonus of homeIceBonuses) {
      
      const predictions = [];
      const totals = [];
      const actualTotals = [];
      const winPreds = [];
      const winActuals = [];
      
      for (const game of gamesData) {
        try {
          const homeTeam = getTeamCode(game.Home);
          const awayTeam = getTeamCode(game.Visitor);
          const awayScore = parseInt(game.Score);  // First Score column = Visitor/Away
          const homeScore = parseInt(game.Score_1); // Second Score column = Home (Papa Parse renames duplicate headers)
          
          if (isNaN(homeScore) || isNaN(awayScore)) continue;
          
          const predHome = predictScore(homeTeam, awayTeam, true, teamsData, calibConst, homeBonus);
          const predAway = predictScore(awayTeam, homeTeam, false, teamsData, calibConst, 0);
          const predTotal = predHome + predAway;
          const actualTotal = homeScore + awayScore;
          
          const homeWinProb = calculateWinProb(predHome, predAway, k);
          const homeWon = homeScore > awayScore ? 1 : 0;
          
          totals.push(predTotal);
          actualTotals.push(actualTotal);
          winPreds.push(homeWinProb > 0.5 ? 1 : 0);
          winActuals.push(homeWon);
        } catch (error) {
          // Skip
        }
      }
      
      if (totals.length > 0) {
        const rmse = calculateRMSE(totals, actualTotals);
        const winAcc = winPreds.filter((p, i) => p === winActuals[i]).length / winPreds.length;
        const avgPred = totals.reduce((a, b) => a + b, 0) / totals.length;
        const avgActual = actualTotals.reduce((a, b) => a + b, 0) / actualTotals.length;
        const bias = avgPred - avgActual;
        
        results.push({
          calibConst,
          k,
          homeBonus,
          rmse,
          winAcc,
          bias,
          avgPred,
          avgActual,
          score: winAcc * 100 + (2.5 - Math.min(rmse, 2.5)) * 20 - Math.abs(bias) * 10
        });
      }
      
      tested++;
      if (tested % 50 === 0) {
        console.log(`   Tested ${tested}/${total} combinations...`);
      }
    }
  }
}

console.log(`\n✅ Tested ${tested} combinations\n`);

// Sort by score
results.sort((a, b) => b.score - a.score);

console.log('='.repeat(80));
console.log('🏆 TOP 10 CALIBRATION SETTINGS');
console.log('='.repeat(80));
console.log('Rank | Calib | k    | Home | Win Acc | RMSE  | Bias  | Score');
console.log('-'.repeat(80));

for (let i = 0; i < Math.min(10, results.length); i++) {
  const r = results[i];
  console.log(
    `${(i + 1).toString().padStart(4)} | ` +
    `${r.calibConst.toFixed(2)} | ` +
    `${r.k.toFixed(2)} | ` +
    `${(r.homeBonus * 100).toFixed(1)}% | ` +
    `${(r.winAcc * 100).toFixed(1).padStart(7)}% | ` +
    `${r.rmse.toFixed(3)} | ` +
    `${r.bias.toFixed(3).padStart(5)} | ` +
    `${r.score.toFixed(1)}`
  );
}

console.log('\n='.repeat(80));
console.log('📊 CURRENT SETTINGS PERFORMANCE');
console.log('='.repeat(80));

const currentSettings = results.find(r => 
  Math.abs(r.calibConst - 1.52) < 0.01 && 
  Math.abs(r.k - 0.55) < 0.01 &&
  Math.abs(r.homeBonus - 0.035) < 0.005
);

if (currentSettings) {
  console.log(`Current Settings: Calib=1.52, k=0.55, Home=3.5%`);
  console.log(`Rank: ${results.indexOf(currentSettings) + 1} of ${results.length}`);
  console.log(`Win Accuracy: ${(currentSettings.winAcc * 100).toFixed(1)}%`);
  console.log(`RMSE: ${currentSettings.rmse.toFixed(3)}`);
  console.log(`Bias: ${currentSettings.bias.toFixed(3)}`);
} else {
  console.log('Current settings not in test grid');
}

console.log('\n='.repeat(80));
console.log('💡 RECOMMENDED CHANGES');
console.log('='.repeat(80));

const best = results[0];
console.log(`\nBest Calibration Constant: ${best.calibConst} (currently: 1.52)`);
console.log(`Best k Parameter: ${best.k} (currently: 0.55)`);
console.log(`Best Home Ice Bonus: ${(best.homeBonus * 100).toFixed(1)}% (currently: 3.5%)`);
console.log(`\nExpected Performance:`);
console.log(`  Win Accuracy: ${(best.winAcc * 100).toFixed(1)}%`);
console.log(`  RMSE: ${best.rmse.toFixed(3)}`);
console.log(`  Bias: ${best.bias.toFixed(3)} goals`);

console.log('\n' + '='.repeat(80));
console.log('CALIBRATION TESTING COMPLETE');
console.log('='.repeat(80) + '\n');

