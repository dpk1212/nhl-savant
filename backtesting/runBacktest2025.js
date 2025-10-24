/**
 * Run Backtest Script - 2025-26 Season
 * Execute model validation on 2025-26 season data (through Oct 23)
 * 
 * Usage: node backtesting/runBacktest2025.js
 */

import fs from 'fs';
import Papa from 'papaparse';
import { ModelBacktester } from '../src/utils/backtester.js';
import { getTeamCode } from '../src/utils/teamNameMapper.js';
import { ScheduleHelper } from '../src/utils/scheduleHelper.js';

/**
 * Load CSV file
 */
async function loadCSV(filePath) {
  return new Promise((resolve, reject) => {
    const csvData = fs.readFileSync(filePath, 'utf8');
    
    Papa.parse(csvData, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        console.log(`✅ Loaded ${filePath}: ${results.data.length} rows`);
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}

/**
 * Process games CSV - convert full names to codes
 */
function processGames(rawGames) {
  const processed = [];
  
  for (const game of rawGames) {
    // Skip scheduled games (no scores yet)
    if (game.Status === 'Scheduled' || !game.Score) {
      continue;
    }
    
    // Map team names to codes
    const homeCode = getTeamCode(game.Home);
    const awayCode = getTeamCode(game.Visitor);
    
    if (!homeCode || !awayCode) {
      console.warn(`⚠️ Skipping game - unknown team: ${game.Visitor} @ ${game.Home}`);
      continue;
    }
    
    // Parse scores (handle the dual "Score" columns)
    const scores = Object.keys(game).filter(key => key === 'Score' || key.startsWith('Score'));
    const awayScore = parseInt(scores[0] ? game[scores[0]] : game.Score);
    const homeScore = parseInt(scores[1] ? game[scores[1]] : game['Score.1']);
    
    if (isNaN(awayScore) || isNaN(homeScore)) {
      console.warn(`⚠️ Skipping game - invalid scores: ${game.Visitor} @ ${game.Home} (${awayScore}-${homeScore})`);
      continue;
    }
    
    // Extract goalie names (NEW: for goalie integration testing)
    const awayGoalie = game['Visitor Goalie'] || null;
    const homeGoalie = game['Home Goalie'] || null;
    
    processed.push({
      date: game.Date,
      home_team: homeCode,
      away_team: awayCode,
      home_score: homeScore,
      away_score: awayScore,
      home_goalie: homeGoalie,  // NEW: actual starting goalie
      away_goalie: awayGoalie,  // NEW: actual starting goalie
      status: game.Status || 'Regulation'
    });
  }
  
  console.log(`📊 Processed ${processed.length} completed games from CSV`);
  return processed;
}

/**
 * Generate markdown report
 */
function generateReport(metrics, withGoalie) {
  const title = `# NHL Prediction Model - 2025-26 Season Backtest Report\n${withGoalie ? '(WITH Goalie Integration)' : '(WITHOUT Goalie Integration)'}`;
  
  let report = `${title}\n\n`;
  report += `**Generated:** ${new Date().toLocaleString()}\n\n`;
  report += `---\n\n`;
  
  // Executive Summary
  report += `## Executive Summary\n\n`;
  report += `- **Total Games:** ${metrics.totalGames}\n`;
  report += `- **Date Range:** ${metrics.dateRange.start} to ${metrics.dateRange.end}\n`;
  report += `- **Model Version:** v2.1-consultant-fix ${withGoalie ? '(with goalie integration)' : '(without goalie integration)'}\n`;
  report += `- **Errors:** ${metrics.summary.errors} (${metrics.summary.errorRate})\n\n`;
  
  // Overall Performance
  report += `## Overall Performance\n\n`;
  
  // Win Probability
  report += `### Win Probability Accuracy\n\n`;
  report += `- **Brier Score:** ${metrics.winProbability.brierScore.toFixed(4)} (Target: < 0.25)\n`;
  report += `  - 0.25 = baseline (random guessing)\n`;
  report += `  - 0.20 = good\n`;
  report += `  - 0.15 = excellent\n`;
  report += `- **Prediction Accuracy:** ${metrics.winProbability.accuracy.percentage} (${metrics.winProbability.accuracy.correct}/${metrics.winProbability.accuracy.total})\n`;
  
  const brierStatus = metrics.winProbability.brierScore < 0.23 ? '✅ PASS' : 
                     metrics.winProbability.brierScore < 0.25 ? '⚠️ MARGINAL' : '❌ FAIL';
  report += `- **Verdict:** ${brierStatus}\n\n`;
  
  // Total Goals Prediction
  report += `### Total Goals Prediction\n\n`;
  report += `- **RMSE:** ${metrics.totalGoals.rmse.toFixed(3)} goals (Target: < 1.8)\n`;
  report += `- **MAE:** ${metrics.totalGoals.mae.toFixed(3)} goals\n`;
  report += `- **Avg Error:** ${metrics.totalGoals.avgError.toFixed(3)} goals (${metrics.totalGoals.avgError > 0 ? 'over' : 'under'}-predicting)\n`;
  
  const rmseStatus = metrics.totalGoals.rmse < 1.8 ? '✅ PASS' : 
                    metrics.totalGoals.rmse < 2.0 ? '⚠️ MARGINAL' : '❌ FAIL';
  report += `- **Verdict:** ${rmseStatus}\n\n`;
  
  // Calibration Curve
  report += `## Calibration Curve\n\n`;
  report += `*Are X% predictions actually winning X% of the time?*\n\n`;
  report += `| Predicted Win % | Games | Actual Win % | Error | Status |\n`;
  report += `|----------------|-------|--------------|-------|--------|\n`;
  
  for (const bin of metrics.winProbability.calibrationCurve) {
    const status = (bin.errorValue * 100) < 5 ? '✅' : (bin.errorValue * 100) < 10 ? '⚠️' : '❌';
    report += `| ${bin.range} | ${bin.count} | ${bin.avgActual} | ${bin.error} | ${status} |\n`;
  }
  report += `\n`;
  
  // Prediction Accuracy by Total Goals Range
  report += `## Prediction Accuracy by Total Goals Range\n\n`;
  report += `| Goals Range | Games | Avg Actual | Avg Predicted | RMSE |\n`;
  report += `|-------------|-------|------------|---------------|------|\n`;
  
  for (const range of metrics.totalGoals.byRange) {
    report += `| ${range.range} | ${range.games} | ${range.avgActual} | ${range.avgPredicted} | ${range.rmse} |\n`;
  }
  report += `\n`;
  
  // Accuracy by Team (Top 10 Best)
  report += `## Accuracy by Team\n\n`;
  report += `### Best Predictions (Lowest RMSE)\n\n`;
  report += `| Team | Games | Avg Error | RMSE | Brier Score |\n`;
  report += `|------|-------|-----------|------|-------------|\n`;
  
  const sortedTeams = [...metrics.byTeam]; // Already sorted by RMSE ascending
  for (const team of sortedTeams.slice(0, 10)) {
    report += `| ${team.team} | ${team.games} | ${team.avgError} | ${team.rmse} | ${team.brierScore} |\n`;
  }
  report += `\n`;
  
  // Worst predictions
  report += `### Worst Predictions (Highest RMSE)\n\n`;
  report += `| Team | Games | Avg Error | RMSE | Brier Score |\n`;
  report += `|------|-------|-----------|------|-------------|\n`;
  
  for (const team of sortedTeams.slice(-10).reverse()) {
    report += `| ${team.team} | ${team.games} | ${team.avgError} | ${team.rmse} | ${team.brierScore} |\n`;
  }
  report += `\n`;
  
  // Monthly Performance
  if (metrics.byMonth && metrics.byMonth.length > 0) {
    report += `## Performance by Month\n\n`;
    report += `| Month | Games | RMSE | Brier Score |\n`;
    report += `|-------|-------|------|-------------|\n`;
    
    for (const month of metrics.byMonth) {
      report += `| ${month.month} | ${month.games} | ${month.rmse} | ${month.brierScore} |\n`;
    }
    report += `\n`;
  }
  
  // Baseline Comparison
  report += `## Baseline Comparisons\n\n`;
  report += `### Total Goals Prediction\n\n`;
  report += `| Method | RMSE | Improvement |\n`;
  report += `|--------|------|-------------|\n`;
  report += `| Our Model | ${metrics.totalGoals.rmse.toFixed(3)} | - |\n`;
  report += `| Always predict 6.0 | ${metrics.baseline.constant6Goals.rmse} | ${metrics.baseline.constant6Goals.improvement} |\n`;
  report += `\n`;
  
  report += `### Win Probability Prediction\n\n`;
  report += `| Method | Brier Score | Improvement |\n`;
  report += `|--------|-------------|-------------|\n`;
  report += `| Our Model | ${metrics.winProbability.brierScore.toFixed(4)} | - |\n`;
  report += `| Always 50% | ${metrics.baseline.alwaysFiftyPercent.brierScore} | ${metrics.baseline.alwaysFiftyPercent.improvement} |\n`;
  report += `\n`;
  
  // Summary
  report += `## Summary\n\n`;
  
  const overallStatus = metrics.winProbability.brierScore < 0.23 && metrics.totalGoals.rmse < 1.8 ? '✅ PASSING' :
                       metrics.winProbability.brierScore < 0.25 && metrics.totalGoals.rmse < 2.0 ? '⚠️ MARGINAL' :
                       '❌ NEEDS IMPROVEMENT';
  
  report += `**Overall Model Performance:** ${overallStatus}\n\n`;
  
  if (metrics.totalGoals.rmse < 1.8 && metrics.winProbability.brierScore < 0.23) {
    report += `🎉 **Excellent performance!** Model is beating professional benchmarks.\n\n`;
  } else if (metrics.totalGoals.rmse < 2.0) {
    report += `⚠️ **Marginal performance.** Model shows promise but needs refinement.\n\n`;
  } else {
    report += `❌ **Underperforming.** Model requires significant improvements before use.\n\n`;
  }
  
  report += `### Key Insights:\n\n`;
  report += `- Win prediction accuracy: ${metrics.winProbability.accuracy.percentage}\n`;
  report += `- Total goals RMSE: ${metrics.totalGoals.rmse.toFixed(3)}\n`;
  report += `- Average prediction error: ${Math.abs(metrics.totalGoals.avgError).toFixed(3)} goals\n`;
  report += `- Brier score: ${metrics.winProbability.brierScore.toFixed(4)}\n`;
  
  return report;
}

/**
 * Main execution
 */
async function main() {
  console.log('🏒 NHL Model Backtesting Framework - 2025-26 Season\n');
  console.log('=====================================================\n');
  
  try {
    // Load data files
    console.log('📁 Loading 2025-26 season data...\n');
    
    const teamsData = await loadCSV('backtesting/data/teams_2025.csv');
    const goaliesData = await loadCSV('backtesting/data/goalies_2025.csv');
    const rawGames = await loadCSV('backtesting/data/games_2025.csv');
    
    // Process games
    const games = processGames(rawGames);
    
    if (games.length === 0) {
      console.error('❌ No completed games found. Check your CSV file.');
      process.exit(1);
    }
    
    console.log(`\n✅ Found ${games.length} completed games to analyze\n`);
    
    // Initialize ScheduleHelper for B2B/rest detection
    const scheduleHelper = new ScheduleHelper(rawGames);
    
    // Initialize backtester
    const backtester = new ModelBacktester(teamsData, goaliesData, games, scheduleHelper);
    
    // Run backtest WITH goalie adjustment
    console.log('\n🔬 Running backtest WITH goalie adjustment...\n');
    const resultsWithGoalie = await backtester.runBacktest(true);
    
    // Generate report
    const reportWithGoalie = generateReport(resultsWithGoalie, true);
    fs.writeFileSync('backtesting/results/backtest_report_2025_with_goalie.md', reportWithGoalie);
    console.log('\n✅ Report saved: backtesting/results/backtest_report_2025_with_goalie.md');
    
    // Run backtest WITHOUT goalie adjustment
    console.log('\n🔬 Running backtest WITHOUT goalie adjustment...\n');
    const resultsWithoutGoalie = await backtester.runBacktest(false);
    
    // Generate report
    const reportWithoutGoalie = generateReport(resultsWithoutGoalie, false);
    fs.writeFileSync('backtesting/results/backtest_report_2025_without_goalie.md', reportWithoutGoalie);
    console.log('\n✅ Report saved: backtesting/results/backtest_report_2025_without_goalie.md');
    
    // Goalie impact comparison
    console.log('\n📊 Goalie Impact Analysis:');
    console.log(`   With Goalie    - Brier: ${resultsWithGoalie.winProbability.brierScore.toFixed(4)}, RMSE: ${resultsWithGoalie.totalGoals.rmse.toFixed(3)}`);
    console.log(`   Without Goalie - Brier: ${resultsWithoutGoalie.winProbability.brierScore.toFixed(4)}, RMSE: ${resultsWithoutGoalie.totalGoals.rmse.toFixed(3)}`);
    
    const brierImprovement = ((resultsWithoutGoalie.winProbability.brierScore - resultsWithGoalie.winProbability.brierScore) / resultsWithoutGoalie.winProbability.brierScore * 100).toFixed(1);
    const rmseImprovement = ((resultsWithoutGoalie.totalGoals.rmse - resultsWithGoalie.totalGoals.rmse) / resultsWithoutGoalie.totalGoals.rmse * 100).toFixed(1);
    
    console.log(`\n   Goalie Impact: Brier ${brierImprovement > 0 ? '+' : ''}${brierImprovement}%, RMSE ${rmseImprovement > 0 ? '+' : ''}${rmseImprovement}%`);
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 2025-26 SEASON BACKTEST RESULTS:');
    console.log('='.repeat(60));
    console.log(`\nGames Analyzed: ${games.length}`);
    console.log(`Date Range: ${resultsWithGoalie.dateRange.start} to ${resultsWithGoalie.dateRange.end}`);
    console.log(`\nWith Goalie:`);
    console.log(`  Brier Score: ${resultsWithGoalie.winProbability.brierScore.toFixed(4)}`);
    console.log(`  RMSE: ${resultsWithGoalie.totalGoals.rmse.toFixed(3)} goals`);
    console.log(`  Win Accuracy: ${resultsWithGoalie.winProbability.accuracy.percentage}`);
    console.log(`  Avg Error: ${resultsWithGoalie.totalGoals.avgError.toFixed(3)} goals`);
    console.log(`\nWithout Goalie:`);
    console.log(`  Brier Score: ${resultsWithoutGoalie.winProbability.brierScore.toFixed(4)}`);
    console.log(`  RMSE: ${resultsWithoutGoalie.totalGoals.rmse.toFixed(3)} goals`);
    console.log(`  Win Accuracy: ${resultsWithoutGoalie.winProbability.accuracy.percentage}`);
    console.log(`  Avg Error: ${resultsWithoutGoalie.totalGoals.avgError.toFixed(3)} goals`);
    console.log('\n' + '='.repeat(60) + '\n');
    
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Backtest failed:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

main();

