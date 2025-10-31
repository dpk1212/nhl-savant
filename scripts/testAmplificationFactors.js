import { readFileSync, writeFileSync } from 'fs';
import Papa from 'papaparse';
import { NHLDataProcessor } from '../src/utils/dataProcessing.js';
import { TotalsAdjuster } from '../src/utils/totalsAdjuster.js';
import { GoalieProcessor } from '../src/utils/goalieProcessor.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('\n╔══════════════════════════════════════════════════════════════╗');
console.log('║       AGGRESSIVE AMPLIFICATION TEST - FIND OPTIMAL          ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

// Load data
const teamsPath = join(__dirname, '../public/nhl_data.csv');
const gamesPath = join(__dirname, '../public/nhl-202526-asplayed.csv');
const goaliesPath = join(__dirname, '../public/goalies.csv');

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

// Load games
const gamesRaw = Papa.parse(readFileSync(gamesPath, 'utf-8'), { 
  header: true, 
  skipEmptyLines: true 
});

const TEAM_MAP = {
  'Anaheim Ducks': 'ANA', 'Boston Bruins': 'BOS', 'Buffalo Sabres': 'BUF',
  'Calgary Flames': 'CGY', 'Carolina Hurricanes': 'CAR', 'Chicago Blackhawks': 'CHI',
  'Colorado Avalanche': 'COL', 'Columbus Blue Jackets': 'CBJ', 'Dallas Stars': 'DAL',
  'Detroit Red Wings': 'DET', 'Edmonton Oilers': 'EDM', 'Florida Panthers': 'FLA',
  'Los Angeles Kings': 'LAK', 'Minnesota Wild': 'MIN', 'Montreal Canadiens': 'MTL',
  'Nashville Predators': 'NSH', 'New Jersey Devils': 'NJD', 'New York Islanders': 'NYI',
  'New York Rangers': 'NYR', 'Ottawa Senators': 'OTT', 'Philadelphia Flyers': 'PHI',
  'Pittsburgh Penguins': 'PIT', 'San Jose Sharks': 'SJS', 'Seattle Kraken': 'SEA',
  'St. Louis Blues': 'STL', 'Tampa Bay Lightning': 'TBL', 'Toronto Maple Leafs': 'TOR',
  'Vancouver Canucks': 'VAN', 'Vegas Golden Knights': 'VGK', 'Washington Capitals': 'WSH',
  'Winnipeg Jets': 'WPG', 'Utah Hockey Club': 'UTA', 'Utah Mammoth': 'UTA'
};

// Filter completed regulation games
const allGames = gamesRaw.data;
const regulationGames = allGames.filter(row => {
  const status = row['Status'];
  const isRegulation = status === 'Regulation' || status === 'Final' || (status && !status.includes('OT') && !status.includes('SO'));
  
  const scores = Object.keys(row).filter(k => k === 'Score' || k.startsWith('Score'));
  const score1 = parseInt(row[scores[0]]) || 0;
  const score2 = parseInt(row[scores[1]]) || 0;
  const hasBeenPlayed = score1 + score2 > 0;
  
  return isRegulation && hasBeenPlayed;
});

console.log(`📊 Testing on ${regulationGames.length} completed games\n`);

// Test different amplification factors
const amplificationFactors = [
  { factor: 1.0, name: 'BASELINE (No Amplification)' },
  { factor: 1.2, name: '20% Amplification' },
  { factor: 1.4, name: '40% Amplification' },
  { factor: 1.6, name: '60% Amplification (Target)' },
  { factor: 1.8, name: '80% Amplification' },
  { factor: 2.0, name: '100% Amplification (Maximum)' },
  { factor: 2.5, name: '150% Amplification (Extreme)' }
];

const results = {};

for (const test of amplificationFactors) {
  console.log(`\n${'='.repeat(65)}`);
  console.log(`Testing: ${test.name} (Factor: ${test.factor})`);
  console.log('='.repeat(65));
  
  // Create adjuster with only amplification enabled
  const totalsAdjuster = new TotalsAdjuster(dataProcessor, null);
  totalsAdjuster.setPhases({
    useAmplification: test.factor !== 1.0, // Disable for baseline
    usePaceFactor: false,
    useGoalieEnhancement: false,
    useMatchupHistory: false,
    useContextAdjustment: false
  });
  totalsAdjuster.setAmplificationFactor(test.factor);
  
  let totalSquaredError = 0;
  let totalError = 0;
  let mlCorrect = 0;
  let highScoringError = 0;
  let lowScoringError = 0;
  let highScoringCount = 0;
  let lowScoringCount = 0;
  
  for (const row of regulationGames) {
    const awayTeamFull = row['Visitor'];
    const homeTeamFull = row['Home'];
    const awayTeam = TEAM_MAP[awayTeamFull];
    const homeTeam = TEAM_MAP[homeTeamFull];
    
    if (!awayTeam || !homeTeam) continue;
    
    const scores = Object.keys(row).filter(k => k === 'Score' || k.startsWith('Score'));
    const awayScore = parseInt(row[scores[0]]) || 0;
    const homeScore = parseInt(row[scores[1]]) || 0;
    const actualTotal = awayScore + homeScore;
    
    const awayGoalie = row['Visitor Goalie'] || null;
    const homeGoalie = row['Home Goalie'] || null;
    const gameDate = row['Date'];
    
    // Get base predictions (UNCHANGED - this is the ML model)
    const awayPred = dataProcessor.predictTeamScore(awayTeam, homeTeam, false, awayGoalie);
    const homePred = dataProcessor.predictTeamScore(homeTeam, awayTeam, true, homeGoalie);
    const baseTotal = awayPred + homePred;
    
    // Apply totals adjustment
    const adjustedTotal = totalsAdjuster.adjustTotal(
      baseTotal,
      awayTeam,
      homeTeam,
      awayGoalie,
      homeGoalie,
      gameDate
    );
    
    // Calculate totals error
    const error = adjustedTotal - actualTotal;
    totalSquaredError += error * error;
    totalError += error;
    
    // Track high vs low scoring games
    if (actualTotal > 7) {
      highScoringError += Math.abs(error);
      highScoringCount++;
    } else if (actualTotal < 5) {
      lowScoringError += Math.abs(error);
      lowScoringCount++;
    }
    
    // Check ML accuracy (MUST STAY THE SAME)
    const mlCorrectPrediction = (awayPred > homePred && awayScore > homeScore) ||
                                (homePred > awayPred && homeScore > awayScore);
    if (mlCorrectPrediction) mlCorrect++;
  }
  
  const count = regulationGames.length;
  const rmse = Math.sqrt(totalSquaredError / count);
  const bias = totalError / count;
  const mlAccuracy = (mlCorrect / count) * 100;
  const avgHighScoringError = highScoringCount > 0 ? highScoringError / highScoringCount : 0;
  const avgLowScoringError = lowScoringCount > 0 ? lowScoringError / lowScoringCount : 0;
  
  results[test.name] = {
    factor: test.factor,
    rmse,
    bias,
    mlAccuracy,
    avgHighScoringError,
    avgLowScoringError,
    count
  };
  
  console.log(`\n📊 Results:`);
  console.log(`   Games: ${count}`);
  console.log(`   RMSE: ${rmse.toFixed(3)} goals`);
  console.log(`   Bias: ${bias.toFixed(3)} goals`);
  console.log(`   ML Win Accuracy: ${mlAccuracy.toFixed(1)}% ${mlAccuracy >= 62.0 ? '✅' : '❌'}`);
  console.log(`   High-Scoring Error: ${avgHighScoringError.toFixed(3)} goals (${highScoringCount} games)`);
  console.log(`   Low-Scoring Error: ${avgLowScoringError.toFixed(3)} goals (${lowScoringCount} games)`);
}

// Find best factor
console.log('\n\n╔══════════════════════════════════════════════════════════════╗');
console.log('║                  AMPLIFICATION COMPARISON                    ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

const baselineRMSE = results['BASELINE (No Amplification)'].rmse;
let bestFactor = null;
let bestRMSE = Infinity;

for (const [name, stats] of Object.entries(results)) {
  const rmseChange = stats.rmse - baselineRMSE;
  const changeStr = rmseChange === 0 ? '—' : `${rmseChange > 0 ? '+' : ''}${rmseChange.toFixed(3)}`;
  const status = stats.rmse < baselineRMSE ? '✅ Better' : stats.rmse === baselineRMSE ? '—' : '❌ Worse';
  
  console.log(`\n${name}:`);
  console.log(`  Factor: ${stats.factor.toFixed(2)}x`);
  console.log(`  RMSE: ${stats.rmse.toFixed(3)} (${changeStr}) ${status}`);
  console.log(`  Bias: ${stats.bias.toFixed(3)}`);
  console.log(`  ML Accuracy: ${stats.mlAccuracy.toFixed(1)}%`);
  console.log(`  High-Scoring Avg Error: ${stats.avgHighScoringError.toFixed(3)}`);
  console.log(`  Low-Scoring Avg Error: ${stats.avgLowScoringError.toFixed(3)}`);
  
  if (stats.rmse < bestRMSE && stats.mlAccuracy >= 62.0) {
    bestRMSE = stats.rmse;
    bestFactor = { name, ...stats };
  }
}

// Generate report
let report = '# AGGRESSIVE AMPLIFICATION TEST RESULTS\n\n';
report += `**Date:** ${new Date().toISOString().split('T')[0]}\n`;
report += `**Games Tested:** ${regulationGames.length}\n\n`;

report += '## Comparison by Amplification Factor\n\n';
report += '| Factor | RMSE | Change | Bias | ML Acc | High-Score Err | Low-Score Err | Status |\n';
report += '|--------|------|--------|------|--------|----------------|---------------|--------|\n';

for (const [name, stats] of Object.entries(results)) {
  const rmseChange = stats.rmse - baselineRMSE;
  const changeStr = rmseChange === 0 ? '—' : `${rmseChange > 0 ? '+' : ''}${rmseChange.toFixed(3)}`;
  const status = stats.rmse < baselineRMSE ? '✅' : stats.rmse === baselineRMSE ? '—' : '❌';
  
  report += `| ${stats.factor.toFixed(2)}x | ${stats.rmse.toFixed(3)} | ${changeStr} | ${stats.bias.toFixed(3)} | ${stats.mlAccuracy.toFixed(1)}% | ${stats.avgHighScoringError.toFixed(3)} | ${stats.avgLowScoringError.toFixed(3)} | ${status} |\n`;
}

report += '\n## Key Findings\n\n';

if (bestFactor) {
  const improvement = baselineRMSE - bestFactor.rmse;
  const improvementPct = (improvement / baselineRMSE) * 100;
  
  report += `✅ **OPTIMAL FACTOR FOUND: ${bestFactor.factor.toFixed(2)}x**\n\n`;
  report += `- RMSE improved by ${improvement.toFixed(3)} goals (${improvementPct.toFixed(1)}%)\n`;
  report += `- Final RMSE: ${bestFactor.rmse.toFixed(3)} goals\n`;
  report += `- ML accuracy protected: ${bestFactor.mlAccuracy.toFixed(1)}%\n\n`;
  
  if (bestFactor.rmse < 2.0) {
    report += `## ✅ RECOMMENDATION: DEPLOY\n\n`;
    report += `The ${bestFactor.factor.toFixed(2)}x amplification factor meets success criteria:\n`;
    report += `- RMSE < 2.0 goals ✅\n`;
    report += `- ML accuracy protected ✅\n`;
    report += `- Ready for production use\n\n`;
    report += `### Implementation:\n`;
    report += `\`\`\`javascript\n`;
    report += `totalsAdjuster.setAmplificationFactor(${bestFactor.factor.toFixed(2)});\n`;
    report += `\`\`\`\n`;
  } else {
    report += `## ⚠️  RECOMMENDATION: CONTINUE IMPROVING\n\n`;
    report += `Best factor (${bestFactor.factor.toFixed(2)}x) improves RMSE but doesn't meet target (< 2.0).\n`;
    report += `Current: ${bestFactor.rmse.toFixed(3)}, Target: < 2.0\n\n`;
    report += `May need additional adjustments beyond amplification.\n`;
  }
} else {
  report += `❌ **NO IMPROVEMENT FOUND**\n\n`;
  report += `None of the amplification factors improved RMSE while protecting ML accuracy.\n`;
  report += `This suggests the problem is NOT just over-regression to mean.\n\n`;
  report += `Need to investigate:\n`;
  report += `- Data quality issues\n`;
  report += `- Missing critical variables\n`;
  report += `- Different modeling approach\n`;
}

// Save report
const reportPath = join(__dirname, '..', 'AMPLIFICATION_TEST_RESULTS.md');
writeFileSync(reportPath, report);

console.log(`\n\n✅ Report saved to: AMPLIFICATION_TEST_RESULTS.md\n`);

if (bestFactor) {
  console.log(`🎯 OPTIMAL FACTOR: ${bestFactor.factor.toFixed(2)}x`);
  console.log(`📊 RMSE: ${bestFactor.rmse.toFixed(3)} goals`);
  console.log(`${bestFactor.rmse < 2.0 ? '✅' : '⚠️ '} ${bestFactor.rmse < 2.0 ? 'SUCCESS - Ready to deploy!' : 'IMPROVED but not at target yet'}\n`);
}

