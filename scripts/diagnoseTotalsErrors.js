import { readFileSync, writeFileSync } from 'fs';
import Papa from 'papaparse';
import { NHLDataProcessor } from '../src/utils/dataProcessing.js';
import { GoalieProcessor } from '../src/utils/goalieProcessor.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('\n╔══════════════════════════════════════════════════════════════╗');
console.log('║          TOTALS PREDICTION ERROR DIAGNOSTIC                  ║');
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

// Filter regulation games that have been played
const allGames = gamesRaw.data;
const regulationGames = allGames.filter(row => {
  const status = row['Status'];
  const isRegulation = status === 'Regulation' || status === 'Final' || (status && !status.includes('OT') && !status.includes('SO'));
  
  // Also check that the game has been played (scores exist and aren't 0-0)
  const scores = Object.keys(row).filter(k => k === 'Score' || k.startsWith('Score'));
  const score1 = parseInt(row[scores[0]]) || 0;
  const score2 = parseInt(row[scores[1]]) || 0;
  const hasBeenPlayed = score1 + score2 > 0;
  
  return isRegulation && hasBeenPlayed;
});

console.log(`📊 Found ${regulationGames.length} completed regulation games\n`);

// Analyze predictions
const results = {
  all: [],
  byTeam: {},
  byGoalie: {},
  homeAway: { home: [], away: [] },
  highScoring: [], // > 7 goals
  lowScoring: [],  // < 5 goals
  overPredicted: [],
  underPredicted: []
};

console.log('🔍 Analyzing predictions...\n');

for (const row of regulationGames) {
  const awayTeamFull = row['Visitor'];
  const homeTeamFull = row['Home'];
  const awayTeam = TEAM_MAP[awayTeamFull];
  const homeTeam = TEAM_MAP[homeTeamFull];
  
  if (!awayTeam || !homeTeam) {
    console.log(`⚠️  Unknown team: ${awayTeamFull} or ${homeTeamFull}`);
    continue;
  }
  
  // Get scores - they should be in 'Score' columns but CSV has two Score columns
  // Let's parse from the row object
  const scores = Object.keys(row).filter(k => k === 'Score' || k.startsWith('Score'));
  const awayScore = parseInt(row[scores[0]]) || 0;
  const homeScore = parseInt(row[scores[1]]) || 0;
  const actualTotal = awayScore + homeScore;
  
  const awayGoalie = row['Visitor Goalie'] || null;
  const homeGoalie = row['Home Goalie'] || null;
  
  // Get predictions
  const awayPred = dataProcessor.predictTeamScore(awayTeam, homeTeam, false, awayGoalie);
  const homePred = dataProcessor.predictTeamScore(homeTeam, awayTeam, true, homeGoalie);
  const predictedTotal = awayPred + homePred;
  
  const error = predictedTotal - actualTotal;
  const absError = Math.abs(error);
  
  const game = {
    date: row['Date'],
    awayTeam,
    homeTeam,
    awayGoalie,
    homeGoalie,
    awayScore,
    homeScore,
    actualTotal,
    awayPred: awayPred.toFixed(2),
    homePred: homePred.toFixed(2),
    predictedTotal: predictedTotal.toFixed(2),
    error: error.toFixed(2),
    absError: absError.toFixed(2)
  };
  
  results.all.push(game);
  
  // Categorize
  if (!results.byTeam[awayTeam]) results.byTeam[awayTeam] = [];
  if (!results.byTeam[homeTeam]) results.byTeam[homeTeam] = [];
  results.byTeam[awayTeam].push({ ...game, teamRole: 'away' });
  results.byTeam[homeTeam].push({ ...game, teamRole: 'home' });
  
  if (awayGoalie) {
    if (!results.byGoalie[awayGoalie]) results.byGoalie[awayGoalie] = [];
    results.byGoalie[awayGoalie].push({ ...game, goalieTeam: awayTeam });
  }
  if (homeGoalie) {
    if (!results.byGoalie[homeGoalie]) results.byGoalie[homeGoalie] = [];
    results.byGoalie[homeGoalie].push({ ...game, goalieTeam: homeTeam });
  }
  
  results.homeAway.away.push(absError);
  results.homeAway.home.push(absError);
  
  if (actualTotal > 7) results.highScoring.push(game);
  if (actualTotal < 5) results.lowScoring.push(game);
  
  if (error > 0) results.overPredicted.push(game);
  if (error < 0) results.underPredicted.push(game);
}

// Calculate statistics
const calcStats = (games) => {
  const errors = games.map(g => parseFloat(g.error));
  const absErrors = games.map(g => parseFloat(g.absError));
  const avg = errors.reduce((a, b) => a + b, 0) / errors.length;
  const avgAbs = absErrors.reduce((a, b) => a + b, 0) / absErrors.length;
  const rmse = Math.sqrt(errors.reduce((a, b) => a + b*b, 0) / errors.length);
  return { avg, avgAbs, rmse, count: games.length };
};

const overallStats = calcStats(results.all);

// Generate report
let report = '# TOTALS PREDICTION ERROR DIAGNOSTIC REPORT\n\n';
report += `**Date:** ${new Date().toISOString().split('T')[0]}\n`;
report += `**Games Analyzed:** ${results.all.length}\n\n`;

report += '## Overall Statistics\n\n';
report += `| Metric | Value |\n`;
report += `|--------|-------|\n`;
report += `| **RMSE** | ${overallStats.rmse.toFixed(3)} goals |\n`;
report += `| **Average Error (Bias)** | ${overallStats.avg.toFixed(3)} goals |\n`;
report += `| **Average Absolute Error** | ${overallStats.avgAbs.toFixed(3)} goals |\n`;
report += `| **Over-Predictions** | ${results.overPredicted.length} games (${(results.overPredicted.length/results.all.length*100).toFixed(1)}%) |\n`;
report += `| **Under-Predictions** | ${results.underPredicted.length} games (${(results.underPredicted.length/results.all.length*100).toFixed(1)}%) |\n\n`;

// High vs low scoring games
const highScoringStats = calcStats(results.highScoring);
const lowScoringStats = calcStats(results.lowScoring);

report += '## Error by Game Type\n\n';
report += `### High-Scoring Games (>7 goals)\n\n`;
report += `- **Count:** ${highScoringStats.count}\n`;
report += `- **RMSE:** ${highScoringStats.rmse.toFixed(3)} goals\n`;
report += `- **Bias:** ${highScoringStats.avg.toFixed(3)} goals\n\n`;

report += `### Low-Scoring Games (<5 goals)\n\n`;
report += `- **Count:** ${lowScoringStats.count}\n`;
report += `- **RMSE:** ${lowScoringStats.rmse.toFixed(3)} goals\n`;
report += `- **Bias:** ${lowScoringStats.avg.toFixed(3)} goals\n\n`;

// Team analysis
report += '## Error by Team\n\n';
report += `| Team | Games | Avg Error | RMSE | Pattern |\n`;
report += `|------|-------|-----------|------|----------|\n`;

const teamStats = Object.keys(results.byTeam)
  .map(team => ({
    team,
    ...calcStats(results.byTeam[team])
  }))
  .sort((a, b) => b.rmse - a.rmse)
  .slice(0, 10);

teamStats.forEach(stat => {
  const pattern = stat.avg > 0.5 ? 'Over-predicts' : stat.avg < -0.5 ? 'Under-predicts' : 'Balanced';
  report += `| ${stat.team} | ${stat.count} | ${stat.avg.toFixed(2)} | ${stat.rmse.toFixed(2)} | ${pattern} |\n`;
});

// Goalie analysis
report += '\n## Error by Goalie (Top 10 Worst)\n\n';
report += `| Goalie | Games | Avg Error | RMSE |\n`;
report += `|--------|-------|-----------|------|\n`;

const goalieStats = Object.keys(results.byGoalie)
  .filter(g => results.byGoalie[g].length >= 3)
  .map(goalie => ({
    goalie,
    ...calcStats(results.byGoalie[goalie])
  }))
  .sort((a, b) => b.rmse - a.rmse)
  .slice(0, 10);

goalieStats.forEach(stat => {
  report += `| ${stat.goalie} | ${stat.count} | ${stat.avg.toFixed(2)} | ${stat.rmse.toFixed(2)} |\n`;
});

// Worst predictions
report += '\n## Top 20 Worst Predictions\n\n';
report += `| Date | Game | Actual | Predicted | Error |\n`;
report += `|------|------|--------|-----------|-------|\n`;

const worstPredictions = [...results.all]
  .sort((a, b) => parseFloat(b.absError) - parseFloat(a.absError))
  .slice(0, 20);

worstPredictions.forEach(g => {
  report += `| ${g.date} | ${g.awayTeam} @ ${g.homeTeam} | ${g.actualTotal} | ${g.predictedTotal} | ${g.error} |\n`;
});

// Key findings
report += '\n## Key Findings\n\n';

if (overallStats.avg > 0.2) {
  report += `⚠️ **Systematic Over-Prediction:** Model over-predicts by ${overallStats.avg.toFixed(2)} goals on average\n\n`;
} else if (overallStats.avg < -0.2) {
  report += `⚠️ **Systematic Under-Prediction:** Model under-predicts by ${Math.abs(overallStats.avg).toFixed(2)} goals on average\n\n`;
}

if (highScoringStats.rmse > lowScoringStats.rmse * 1.5) {
  report += `⚠️ **High-scoring games much worse:** RMSE ${highScoringStats.rmse.toFixed(2)} vs ${lowScoringStats.rmse.toFixed(2)}\n\n`;
}

report += '## Recommended Actions\n\n';
report += '1. **Calibration Issue:** Overall bias indicates need for recalibration\n';
report += '2. **Team-Specific Patterns:** Some teams consistently mis-predicted\n';
report += '3. **Goalie Impact:** High RMSE for certain goalies suggests adjustment issues\n';
report += '4. **Score Range:** Different accuracy for high vs low-scoring games\n';

// Save report
const reportPath = join(__dirname, '..', 'TOTALS_ERROR_DIAGNOSTIC.md');
writeFileSync(reportPath, report);

console.log('✅ Diagnostic complete!\n');
console.log(`📊 Overall RMSE: ${overallStats.rmse.toFixed(3)} goals`);
console.log(`📊 Average Bias: ${overallStats.avg.toFixed(3)} goals`);
console.log(`📝 Report saved to: TOTALS_ERROR_DIAGNOSTIC.md\n`);

