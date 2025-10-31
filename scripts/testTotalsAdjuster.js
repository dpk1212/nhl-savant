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
console.log('║         TOTALS ADJUSTER TEST - PHASE BY PHASE               ║');
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
const totalsAdjuster = new TotalsAdjuster(dataProcessor, gamesPath);

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

// Test configurations for each phase
const phases = [
  {
    name: 'BASELINE (No Adjustments)',
    config: { useAmplification: false, usePaceFactor: false, useGoalieEnhancement: false, useMatchupHistory: false, useContextAdjustment: false }
  },
  {
    name: 'PHASE 0: Amplification Only',
    config: { useAmplification: true, usePaceFactor: false, useGoalieEnhancement: false, useMatchupHistory: false, useContextAdjustment: false }
  },
  {
    name: 'PHASE 1: Amplification + Pace',
    config: { useAmplification: true, usePaceFactor: true, useGoalieEnhancement: false, useMatchupHistory: false, useContextAdjustment: false }
  },
  {
    name: 'PHASE 2: Amp + Pace + Goalie',
    config: { useAmplification: true, usePaceFactor: true, useGoalieEnhancement: true, useMatchupHistory: false, useContextAdjustment: false }
  },
  {
    name: 'PHASE 3: All Except Matchup',
    config: { useAmplification: true, usePaceFactor: true, useGoalieEnhancement: true, useMatchupHistory: false, useContextAdjustment: true }
  },
  {
    name: 'PHASE 4: All Adjustments',
    config: { useAmplification: true, usePaceFactor: true, useGoalieEnhancement: true, useMatchupHistory: true, useContextAdjustment: true }
  }
];

const results = {};

for (const phase of phases) {
  console.log(`\n${'='.repeat(65)}`);
  console.log(`Testing: ${phase.name}`);
  console.log('='.repeat(65));
  
  // Configure adjuster for this phase
  totalsAdjuster.setPhases(phase.config);
  
  const predictions = [];
  let totalSquaredError = 0;
  let totalError = 0;
  let mlCorrect = 0;
  
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
    
    // Check ML accuracy (MUST STAY THE SAME)
    const mlCorrectPrediction = (awayPred > homePred && awayScore > homeScore) ||
                                (homePred > awayPred && homeScore > awayScore);
    if (mlCorrectPrediction) mlCorrect++;
    
    predictions.push({
      game: `${awayTeam} @ ${homeTeam}`,
      actual: actualTotal,
      base: baseTotal.toFixed(2),
      adjusted: adjustedTotal.toFixed(2),
      error: error.toFixed(2)
    });
  }
  
  const count = predictions.length;
  const rmse = Math.sqrt(totalSquaredError / count);
  const bias = totalError / count;
  const mlAccuracy = (mlCorrect / count) * 100;
  
  results[phase.name] = {
    rmse,
    bias,
    mlAccuracy,
    count
  };
  
  console.log(`\n📊 Results:`);
  console.log(`   Games: ${count}`);
  console.log(`   RMSE: ${rmse.toFixed(3)} goals`);
  console.log(`   Bias: ${bias.toFixed(3)} goals`);
  console.log(`   ML Win Accuracy: ${mlAccuracy.toFixed(1)}% ${mlAccuracy >= 62.5 ? '✅' : '❌ REGRESSION!'}`);
}

// Generate comparison report
console.log('\n\n╔══════════════════════════════════════════════════════════════╗');
console.log('║                    PHASE COMPARISON                          ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

let report = '# TOTALS ADJUSTER TEST RESULTS\n\n';
report += `**Date:** ${new Date().toISOString().split('T')[0]}\n`;
report += `**Games Tested:** ${regulationGames.length}\n\n`;

report += '## Phase-by-Phase Results\n\n';
report += '| Phase | RMSE | Change | Bias | ML Accuracy | Status |\n';
report += '|-------|------|--------|------|-------------|--------|\n';

const baselineRMSE = results['BASELINE (No Adjustments)'].rmse;

for (const [phaseName, stats] of Object.entries(results)) {
  const rmseChange = stats.rmse - baselineRMSE;
  const changeStr = rmseChange === 0 ? '—' : `${rmseChange > 0 ? '+' : ''}${rmseChange.toFixed(3)}`;
  const mlStatus = stats.mlAccuracy >= 62.5 ? '✅ Protected' : '❌ REGRESSED';
  const rmseStatus = stats.rmse < baselineRMSE ? '✅ Improved' : stats.rmse === baselineRMSE ? '—' : '❌ Worse';
  
  report += `| ${phaseName} | ${stats.rmse.toFixed(3)} | ${changeStr} | ${stats.bias.toFixed(3)} | ${stats.mlAccuracy.toFixed(1)}% | ${mlStatus} ${rmseStatus} |\n`;
  
  console.log(`${phaseName}:`);
  console.log(`  RMSE: ${stats.rmse.toFixed(3)} (${changeStr})`);
  console.log(`  Bias: ${stats.bias.toFixed(3)}`);
  console.log(`  ML Accuracy: ${stats.mlAccuracy.toFixed(1)}% ${mlStatus}`);
  console.log();
}

report += '\n## Key Findings\n\n';

const finalPhase = results['PHASE 4: All Adjustments'];
const improvement = baselineRMSE - finalPhase.rmse;
const improvementPct = (improvement / baselineRMSE) * 100;

if (improvement > 0) {
  report += `✅ **RMSE Improved by ${improvement.toFixed(3)} goals (${improvementPct.toFixed(1)}%)**\n\n`;
} else {
  report += `❌ **RMSE did not improve** - Adjustments may need tuning\n\n`;
}

if (finalPhase.mlAccuracy >= 62.5) {
  report += `✅ **ML Win Accuracy Protected:** ${finalPhase.mlAccuracy.toFixed(1)}%\n\n`;
} else {
  report += `❌ **ML Win Accuracy REGRESSED:** ${finalPhase.mlAccuracy.toFixed(1)}% (was ~64.7%)\n\n`;
  report += `⚠️  **CRITICAL: Do NOT deploy - ML model has been damaged!**\n\n`;
}

if (finalPhase.rmse < 1.8 && finalPhase.mlAccuracy >= 62.5) {
  report += `## ✅ RECOMMENDATION: DEPLOY\n\n`;
  report += `The totals adjuster meets success criteria:\n`;
  report += `- RMSE < 1.8 goals ✅\n`;
  report += `- ML accuracy protected ✅\n`;
  report += `- Ready for production use\n`;
} else if (finalPhase.mlAccuracy >= 62.5) {
  report += `## ⚠️  RECOMMENDATION: CONTINUE TUNING\n\n`;
  report += `ML accuracy is protected but RMSE needs further improvement.\n`;
  report += `Current: ${finalPhase.rmse.toFixed(3)}, Target: < 1.8\n`;
} else {
  report += `## ❌ RECOMMENDATION: DO NOT DEPLOY\n\n`;
  report += `ML accuracy has regressed. Adjustments are affecting core predictions.\n`;
  report += `Need to debug why ML win rate changed.\n`;
}

// Save report
const reportPath = join(__dirname, '..', 'TOTALS_ADJUSTER_TEST_RESULTS.md');
writeFileSync(reportPath, report);

console.log(`\n✅ Report saved to: TOTALS_ADJUSTER_TEST_RESULTS.md\n`);

