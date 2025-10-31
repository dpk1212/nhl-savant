import { readFileSync, writeFileSync } from 'fs';
import Papa from 'papaparse';
import { NHLDataProcessor } from '../src/utils/dataProcessing.js';
import { TotalsEnsemble } from '../src/utils/totalsEnsemble.js';
import { GoalieProcessor } from '../src/utils/goalieProcessor.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths
const teamsPath = join(__dirname, '../public/nhl_data.csv');
const gamesPath = join(__dirname, '../public/nhl-202526-asplayed.csv');
const goaliesPath = join(__dirname, '../public/goalies.csv');

console.log('\n╔══════════════════════════════════════════════════════════════╗');
console.log('║        ENSEMBLE TOTALS MODEL TEST - 2025-26 SEASON          ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

// Load data
console.log('📂 Loading data...');
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

console.log('✅ Data loaded\n');

// Load games
console.log('📊 Loading completed games...');
const gamesRaw = Papa.parse(readFileSync(gamesPath, 'utf-8'), { 
  header: false, 
  skipEmptyLines: true 
});

// Filter to regulation games only
const allGames = gamesRaw.data.slice(1); // Skip header
const regulationGames = allGames.filter(row => {
  if (row.length < 8) return false;
  const overtimeStatus = row[7];
  return overtimeStatus === 'Regulation';
});

console.log(`   Found ${regulationGames.length} regulation games\n`);

// Test metrics
let currentModel_totalSquaredError = 0;
let ensembleModel_totalSquaredError = 0;
let currentModel_totalError = 0;
let ensembleModel_totalError = 0;
let currentModel_correctWins = 0;
let ensembleModel_correctWins = 0;
let gamesProcessed = 0;

// Detailed results for report
const detailedResults = [];

console.log('🧪 Testing models on each game...\n');

regulationGames.forEach((row, index) => {
  try {
    const date = row[0];
    const awayTeam = row[3];  // Visitor column
    const homeTeam = row[5];  // Home column
    const awayScore = parseInt(row[4]);  // Visitor score
    const homeScore = parseInt(row[6]);  // Home score
    const awayGoalie = row[8];  // Visitor goalie
    const homeGoalie = row[9];  // Home goalie
    
    // Map team names to codes
    const teamMap = {
      'Chicago Blackhawks': 'CHI',
      'Florida Panthers': 'FLA',
      'Pittsburgh Penguins': 'PIT',
      'New York Rangers': 'NYR',
      'Colorado Avalanche': 'COL',
      'Los Angeles Kings': 'LAK',
      'Montreal Canadiens': 'MTL',
      'Toronto Maple Leafs': 'TOR',
      'Boston Bruins': 'BOS',
      'Washington Capitals': 'WSH',
      'Detroit Red Wings': 'DET',
      'Ottawa Senators': 'OTT',
      'Tampa Bay Lightning': 'TBL',
      'Philadelphia Flyers': 'PHI',
      'New York Islanders': 'NYI',
      'New Jersey Devils': 'NJD',
      'Carolina Hurricanes': 'CAR',
      'Columbus Blue Jackets': 'CBJ',
      'Nashville Predators': 'NSH',
      'Dallas Stars': 'DAL',
      'Winnipeg Jets': 'WPG',
      'Utah Hockey Club': 'UTA',
      'Calgary Flames': 'CGY',
      'Vancouver Canucks': 'VAN',
      'Anaheim Ducks': 'ANA',
      'Seattle Kraken': 'SEA',
      'St. Louis Blues': 'STL',
      'Buffalo Sabres': 'BUF',
      'Minnesota Wild': 'MIN',
      'Edmonton Oilers': 'EDM',
      'Vegas Golden Knights': 'VGK',
      'San Jose Sharks': 'SJS',
      'Arizona Coyotes': 'ARI'
    };
    
    const awayCode = teamMap[awayTeam];
    const homeCode = teamMap[homeTeam];
    
    if (!awayCode || !homeCode) {
      console.warn(`⚠️  Unknown team: ${awayTeam} or ${homeTeam}`);
      return;
    }
    
    // CURRENT MODEL: Use existing predictTeamScore (xG-based only)
    const currentModel_awayScore = dataProcessor.predictTeamScore(
      awayCode, homeCode, false, awayGoalie, date
    );
    const currentModel_homeScore = dataProcessor.predictTeamScore(
      homeCode, awayCode, true, homeGoalie, date
    );
    const currentModel_total = currentModel_awayScore + currentModel_homeScore;
    const currentModel_homeWinProb = dataProcessor.calculatePoissonWinProb(
      currentModel_homeScore, currentModel_awayScore
    );
    
    // ENSEMBLE MODEL: Use new ensemble for totals
    const ensembleModel_total = totalsEnsemble.predictGameTotal(
      awayCode, homeCode, awayGoalie, homeGoalie, date
    );
    // But still use original scores for win probability (CRITICAL!)
    const ensembleModel_homeWinProb = currentModel_homeWinProb;
    
    // Actual results
    const actualTotal = awayScore + homeScore;
    const homeWon = homeScore > awayScore;
    
    // Calculate errors for totals
    const currentModel_error = currentModel_total - actualTotal;
    const ensembleModel_error = ensembleModel_total - actualTotal;
    
    currentModel_totalError += currentModel_error;
    ensembleModel_totalError += ensembleModel_error;
    currentModel_totalSquaredError += currentModel_error * currentModel_error;
    ensembleModel_totalSquaredError += ensembleModel_error * ensembleModel_error;
    
    // Check win prediction accuracy (both should be same since using same win prob)
    if ((currentModel_homeWinProb > 0.5 && homeWon) || (currentModel_homeWinProb <= 0.5 && !homeWon)) {
      currentModel_correctWins++;
      ensembleModel_correctWins++; // Same since we use same win prob
    }
    
    gamesProcessed++;
    
    // Store detailed result
    detailedResults.push({
      date,
      matchup: `${awayTeam} @ ${homeTeam}`,
      actual: `${awayScore}-${homeScore}`,
      actualTotal,
      currentModelTotal: currentModel_total.toFixed(2),
      ensembleModelTotal: ensembleModel_total.toFixed(2),
      currentModelError: currentModel_error.toFixed(2),
      ensembleModelError: ensembleModel_error.toFixed(2),
      homeWinProb: (currentModel_homeWinProb * 100).toFixed(1),
      winCorrect: (currentModel_homeWinProb > 0.5 && homeWon) || (currentModel_homeWinProb <= 0.5 && !homeWon) ? '✅' : '❌'
    });
    
  } catch (error) {
    console.error(`Error processing game ${index}:`, error.message);
  }
});

// Calculate final metrics
const currentModel_RMSE = Math.sqrt(currentModel_totalSquaredError / gamesProcessed);
const ensembleModel_RMSE = Math.sqrt(ensembleModel_totalSquaredError / gamesProcessed);
const currentModel_avgBias = currentModel_totalError / gamesProcessed;
const ensembleModel_avgBias = ensembleModel_totalError / gamesProcessed;
const currentModel_winAccuracy = (currentModel_correctWins / gamesProcessed) * 100;
const ensembleModel_winAccuracy = (ensembleModel_correctWins / gamesProcessed) * 100;

// Calculate improvement
const rmseImprovement = ((currentModel_RMSE - ensembleModel_RMSE) / currentModel_RMSE) * 100;
const biasImprovement = Math.abs(currentModel_avgBias) - Math.abs(ensembleModel_avgBias);

console.log('\n╔══════════════════════════════════════════════════════════════╗');
console.log('║                    TEST RESULTS SUMMARY                      ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

console.log(`📊 Sample Size: ${gamesProcessed} regulation games\n`);

console.log('─────────────────────────────────────────────────────────────');
console.log('                    TOTALS PREDICTION METRICS');
console.log('─────────────────────────────────────────────────────────────\n');

console.log('CURRENT MODEL (xG-based only):');
console.log(`   RMSE:           ${currentModel_RMSE.toFixed(3)} goals`);
console.log(`   Average Bias:   ${currentModel_avgBias.toFixed(3)} goals`);
console.log('');

console.log('ENSEMBLE MODEL (xG 40% + Goals 30% + Recency 30%):');
console.log(`   RMSE:           ${ensembleModel_RMSE.toFixed(3)} goals ${rmseImprovement > 0 ? '✅' : '❌'}`);
console.log(`   Average Bias:   ${ensembleModel_avgBias.toFixed(3)} goals ${Math.abs(ensembleModel_avgBias) < Math.abs(currentModel_avgBias) ? '✅' : '❌'}`);
console.log('');

console.log('IMPROVEMENT:');
console.log(`   RMSE:           ${rmseImprovement >= 0 ? '+' : ''}${rmseImprovement.toFixed(1)}% ${rmseImprovement > 0 ? '(better)' : '(worse)'}`);
console.log(`   Bias:           ${biasImprovement >= 0 ? '+' : ''}${biasImprovement.toFixed(3)} goals ${biasImprovement > 0 ? '(better)' : '(worse)'}`);
console.log('');

console.log('─────────────────────────────────────────────────────────────');
console.log('              WIN PREDICTION ACCURACY (PROTECTED)');
console.log('─────────────────────────────────────────────────────────────\n');

console.log('CURRENT MODEL:');
console.log(`   Win Accuracy:   ${currentModel_winAccuracy.toFixed(1)}% (${currentModel_correctWins}/${gamesProcessed})`);
console.log('');

console.log('ENSEMBLE MODEL (using same win prob):');
console.log(`   Win Accuracy:   ${ensembleModel_winAccuracy.toFixed(1)}% (${ensembleModel_correctWins}/${gamesProcessed})`);
console.log('');

if (ensembleModel_winAccuracy === currentModel_winAccuracy) {
  console.log('✅ WIN ACCURACY PROTECTED (identical as expected)');
} else {
  console.log('⚠️  WARNING: Win accuracy changed (unexpected)');
}

console.log('\n─────────────────────────────────────────────────────────────');
console.log('                       RECOMMENDATION');
console.log('─────────────────────────────────────────────────────────────\n');

if (ensembleModel_RMSE < currentModel_RMSE && Math.abs(ensembleModel_avgBias) < Math.abs(currentModel_avgBias)) {
  console.log('✅ DEPLOY ENSEMBLE MODEL');
  console.log('   - RMSE improved');
  console.log('   - Bias reduced');
  console.log('   - Win accuracy protected');
  console.log('   - Use ensemble for over/under betting');
} else if (ensembleModel_RMSE < currentModel_RMSE) {
  console.log('⚠️  CONSIDER ENSEMBLE WITH CALIBRATION');
  console.log('   - RMSE improved but bias increased');
  console.log('   - May need calibration constant adjustment');
} else {
  console.log('❌ KEEP CURRENT MODEL');
  console.log('   - Ensemble did not improve metrics');
  console.log('   - Stick with xG-based for all predictions');
}

// Generate detailed report
console.log('\n📝 Generating detailed report...');

let reportContent = `# ENSEMBLE TOTALS MODEL - TEST RESULTS\n\n`;
reportContent += `**Test Date:** ${new Date().toISOString().split('T')[0]}\n`;
reportContent += `**Sample Size:** ${gamesProcessed} regulation games\n\n`;

reportContent += `## Executive Summary\n\n`;
reportContent += `**Goal:** Improve totals prediction (RMSE) without affecting win prediction accuracy (64.7%)\n\n`;

reportContent += `### Results\n\n`;
reportContent += `| Metric | Current Model | Ensemble Model | Change |\n`;
reportContent += `|--------|---------------|----------------|--------|\n`;
reportContent += `| RMSE | ${currentModel_RMSE.toFixed(3)} | ${ensembleModel_RMSE.toFixed(3)} | ${rmseImprovement >= 0 ? '+' : ''}${rmseImprovement.toFixed(1)}% |\n`;
reportContent += `| Bias | ${currentModel_avgBias.toFixed(3)} | ${ensembleModel_avgBias.toFixed(3)} | ${biasImprovement >= 0 ? '+' : ''}${biasImprovement.toFixed(3)} |\n`;
reportContent += `| Win Accuracy | ${currentModel_winAccuracy.toFixed(1)}% | ${ensembleModel_winAccuracy.toFixed(1)}% | ${(ensembleModel_winAccuracy - currentModel_winAccuracy).toFixed(1)}% |\n\n`;

reportContent += `## Ensemble Model Composition\n\n`;
reportContent += `The ensemble combines three independent models:\n\n`;
reportContent += `1. **xG-Based (40% weight):** Uses expected goals from current model\n`;
reportContent += `2. **Goals-Based (30% weight):** Uses actual goals/game with same regression\n`;
reportContent += `3. **Recency-Based (30% weight):** Uses last 5 games with weighted averaging\n\n`;

reportContent += `## Game-by-Game Results\n\n`;
reportContent += `| Date | Matchup | Actual | Current Total | Ensemble Total | Current Error | Ensemble Error | Win | |\n`;
reportContent += `|------|---------|--------|---------------|----------------|---------------|----------------|-----|--|\n`;

detailedResults.forEach(result => {
  reportContent += `| ${result.date} | ${result.matchup} | ${result.actual} (${result.actualTotal}) | `;
  reportContent += `${result.currentModelTotal} | ${result.ensembleModelTotal} | `;
  reportContent += `${result.currentModelError} | ${result.ensembleModelError} | `;
  reportContent += `${result.homeWinProb}% | ${result.winCorrect} |\n`;
});

reportContent += `\n## Recommendation\n\n`;

if (ensembleModel_RMSE < currentModel_RMSE && Math.abs(ensembleModel_avgBias) < Math.abs(currentModel_avgBias)) {
  reportContent += `**DEPLOY ENSEMBLE MODEL** ✅\n\n`;
  reportContent += `- RMSE improved by ${rmseImprovement.toFixed(1)}%\n`;
  reportContent += `- Bias reduced by ${biasImprovement.toFixed(3)} goals\n`;
  reportContent += `- Win accuracy protected at ${ensembleModel_winAccuracy.toFixed(1)}%\n`;
  reportContent += `- Use ensemble for over/under betting\n`;
  reportContent += `- Keep current model for moneyline betting\n`;
} else if (ensembleModel_RMSE < currentModel_RMSE) {
  reportContent += `**CONSIDER WITH CALIBRATION** ⚠️\n\n`;
  reportContent += `- RMSE improved by ${rmseImprovement.toFixed(1)}%\n`;
  reportContent += `- Bias adjustment needed\n`;
  reportContent += `- Recommend calibration constant tuning\n`;
} else {
  reportContent += `**KEEP CURRENT MODEL** ❌\n\n`;
  reportContent += `- Ensemble did not improve RMSE\n`;
  reportContent += `- Current model performs better\n`;
  reportContent += `- Consider different ensemble weights or models\n`;
}

// Write report
const reportPath = join(__dirname, '../TOTALS_ENSEMBLE_RESULTS.md');
writeFileSync(reportPath, reportContent);
console.log(`✅ Report saved to: TOTALS_ENSEMBLE_RESULTS.md\n`);

console.log('═══════════════════════════════════════════════════════════════\n');

