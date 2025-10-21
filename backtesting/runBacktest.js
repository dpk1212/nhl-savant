/**
 * Run Backtest Script
 * Execute model validation on 2024 season data
 * 
 * Usage: node backtesting/runBacktest.js
 */

import fs from 'fs';
import Papa from 'papaparse';
import { ModelBacktester } from '../src/utils/backtester.js';
import { getTeamCode } from '../src/utils/teamNameMapper.js';

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
      console.warn(`⚠️ Skipping game - invalid scores: ${game.Visitor} @ ${game.Home}`);
      continue;
    }
    
    processed.push({
      date: game.Date,
      home_team: homeCode,
      away_team: awayCode,
      home_score: homeScore,
      away_score: awayScore,
      status: game.Status || 'Regulation'
    });
  }
  
  console.log(`📊 Processed ${processed.length} games from CSV`);
  return processed;
}

/**
 * Generate markdown report
 */
function generateReport(metrics, withGoalie) {
  const title = `# NHL Prediction Model - 2024 Season Backtest Report\n${withGoalie ? '(WITH Goalie Integration)' : '(WITHOUT Goalie Integration)'}`;
  
  let report = `${title}\n\n`;
  report += `**Generated:** ${new Date().toLocaleString()}\n\n`;
  report += `---\n\n`;
  
  // Executive Summary
  report += `## Executive Summary\n\n`;
  report += `- **Total Games:** ${metrics.totalGames}\n`;
  report += `- **Date Range:** ${metrics.dateRange.start} to ${metrics.dateRange.end}\n`;
  report += `- **Model Version:** Phase 1-3 ${withGoalie ? '(with goalie integration)' : '(without goalie integration)'}\n`;
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
  
  const brierVerdict = metrics.winProbability.brierScore < 0.23 ? '✅ PASS' : metrics.winProbability.brierScore < 0.25 ? '⚠️ MARGINAL' : '❌ FAIL';
  report += `- **Verdict:** ${brierVerdict}\n\n`;
  
  // Total Goals
  report += `### Total Goals Prediction\n\n`;
  report += `- **RMSE:** ${metrics.totalGoals.rmse.toFixed(3)} goals (Target: < 1.8)\n`;
  report += `- **MAE:** ${metrics.totalGoals.mae.toFixed(3)} goals\n`;
  report += `- **Avg Error:** ${metrics.totalGoals.avgError >= 0 ? '+' : ''}${metrics.totalGoals.avgError.toFixed(3)} goals (${metrics.totalGoals.avgError > 0 ? 'over-predicting' : 'under-predicting'})\n`;
  
  const rmseVerdict = metrics.totalGoals.rmse < 1.8 ? '✅ PASS' : metrics.totalGoals.rmse < 2.0 ? '⚠️ MARGINAL' : '❌ FAIL';
  report += `- **Verdict:** ${rmseVerdict}\n\n`;
  
  // Calibration Curve
  report += `## Calibration Curve\n\n`;
  report += `*Are X% predictions actually winning X% of the time?*\n\n`;
  report += `| Predicted Win % | Games | Actual Win % | Error | Status |\n`;
  report += `|----------------|-------|--------------|-------|--------|\n`;
  
  for (const bin of metrics.winProbability.calibrationCurve) {
    const status = bin.errorValue < 0.02 ? '✅' : bin.errorValue < 0.05 ? '⚠️' : '❌';
    report += `| ${bin.range} | ${bin.count} | ${bin.avgActual} | ${bin.error} | ${status} |\n`;
  }
  report += `\n`;
  
  // Error by Goals Range
  report += `## Prediction Accuracy by Total Goals Range\n\n`;
  report += `| Goals Range | Games | Avg Actual | Avg Predicted | RMSE |\n`;
  report += `|-------------|-------|------------|---------------|------|\n`;
  
  for (const range of metrics.totalGoals.byRange) {
    report += `| ${range.range} | ${range.games} | ${range.avgActual} | ${range.avgPredicted} | ${range.rmse} |\n`;
  }
  report += `\n`;
  
  // By Team (Top 10 best and worst)
  report += `## Accuracy by Team\n\n`;
  report += `### Best Predictions (Lowest RMSE)\n\n`;
  report += `| Team | Games | Avg Error | RMSE | Brier Score |\n`;
  report += `|------|-------|-----------|------|-------------|\n`;
  
  const topTeams = metrics.byTeam.slice(0, 10);
  for (const team of topTeams) {
    report += `| ${team.team} | ${team.games} | ${team.avgError} | ${team.rmse} | ${team.brierScore} |\n`;
  }
  report += `\n`;
  
  report += `### Worst Predictions (Highest RMSE)\n\n`;
  report += `| Team | Games | Avg Error | RMSE | Brier Score |\n`;
  report += `|------|-------|-----------|------|-------------|\n`;
  
  const worstTeams = metrics.byTeam.slice(-10).reverse();
  for (const team of worstTeams) {
    report += `| ${team.team} | ${team.games} | ${team.avgError} | ${team.rmse} | ${team.brierScore} |\n`;
  }
  report += `\n`;
  
  // By Month
  report += `## Accuracy by Month\n\n`;
  report += `| Month | Games | RMSE | Brier Score |\n`;
  report += `|-------|-------|------|-------------|\n`;
  
  for (const month of metrics.byMonth) {
    report += `| ${month.month} | ${month.games} | ${month.rmse} | ${month.brierScore} |\n`;
  }
  report += `\n`;
  
  // Baseline Comparison
  report += `## Comparison to Baseline Models\n\n`;
  report += `### vs. "Always Predict 6.0 Total Goals"\n\n`;
  report += `| Metric | Baseline | Our Model | Improvement |\n`;
  report += `|--------|----------|-----------|-------------|\n`;
  report += `| RMSE | ${metrics.baseline.constant6Goals.rmse} | ${metrics.totalGoals.rmse.toFixed(3)} | ${metrics.baseline.constant6Goals.improvement} |\n\n`;
  
  report += `### vs. "Always Predict 50% Win Probability"\n\n`;
  report += `| Metric | Baseline | Our Model | Improvement |\n`;
  report += `|--------|----------|-----------|-------------|\n`;
  report += `| Brier Score | ${metrics.baseline.alwaysFiftyPercent.brierScore} | ${metrics.winProbability.brierScore.toFixed(4)} | ${metrics.baseline.alwaysFiftyPercent.improvement} |\n\n`;
  
  // Final Verdict
  report += `## Final Verdict\n\n`;
  
  const isReady = metrics.winProbability.brierScore < 0.23 && 
                  metrics.totalGoals.rmse < 1.8;
  
  report += `### Is the model ready for real money? **${isReady ? 'YES ✅' : 'NO ❌'}**\n\n`;
  
  report += `**Reasons:**\n`;
  if (metrics.winProbability.brierScore < 0.23) {
    report += `1. ✅ Brier score ${metrics.winProbability.brierScore.toFixed(4)} is below 0.23 threshold\n`;
  } else {
    report += `1. ❌ Brier score ${metrics.winProbability.brierScore.toFixed(4)} exceeds 0.23 threshold\n`;
  }
  
  if (metrics.totalGoals.rmse < 1.8) {
    report += `2. ✅ RMSE ${metrics.totalGoals.rmse.toFixed(3)} is below 1.8 threshold\n`;
  } else {
    report += `2. ❌ RMSE ${metrics.totalGoals.rmse.toFixed(3)} exceeds 1.8 threshold\n`;
  }
  
  const improvementRMSE = parseFloat(metrics.baseline.constant6Goals.improvement);
  const improvementBrier = parseFloat(metrics.baseline.alwaysFiftyPercent.improvement);
  
  if (improvementRMSE > 10 && improvementBrier > 10) {
    report += `3. ✅ Beats baseline by >10% on both RMSE and Brier\n`;
  } else {
    report += `3. ❌ Does not consistently beat baseline by >10%\n`;
  }
  
  report += `\n### Next Steps\n\n`;
  
  if (!isReady) {
    report += `**Model needs improvement:**\n\n`;
    
    if (metrics.totalGoals.avgError > 0.2) {
      report += `1. Model is over-predicting by ${metrics.totalGoals.avgError.toFixed(2)} goals - reduce scoring rates\n`;
    } else if (metrics.totalGoals.avgError < -0.2) {
      report += `1. Model is under-predicting by ${Math.abs(metrics.totalGoals.avgError).toFixed(2)} goals - increase scoring rates\n`;
    }
    
    if (metrics.winProbability.brierScore > 0.23) {
      report += `2. Recalibrate win probability model - adjust k parameter\n`;
    }
    
    report += `3. Analyze worst-performing teams for systematic biases\n`;
    report += `4. Consider additional factors (recent form, injuries, schedule)\n`;
  } else {
    report += `**Model is performing well:**\n\n`;
    report += `1. Monitor performance on current season data\n`;
    report += `2. Collect market odds for profitability testing\n`;
    report += `3. Consider paper trading to validate real-world performance\n`;
    report += `4. Implement confidence filters (only bet high-probability edges)\n`;
  }
  
  report += `\n---\n\n`;
  report += `*Report generated by NHL Savant Backtesting Framework*\n`;
  
  return report;
}

/**
 * Main execution
 */
async function main() {
  console.log('🏒 NHL Model Backtesting Framework\n');
  console.log('===================================\n');
  
  try {
    // Load data files
    console.log('📁 Loading data files...\n');
    
    const teamsData = await loadCSV('backtesting/data/teams_2024.csv');
    const goaliesData = await loadCSV('backtesting/data/goalies_2024.csv');
    const rawGames = await loadCSV('backtesting/data/games_2024.csv');
    
    // Process games
    const games = processGames(rawGames);
    
    console.log('\n');
    
    // Initialize backtester
    const backtester = new ModelBacktester(teamsData, goaliesData, games);
    
    // Run backtest WITH goalie adjustment
    console.log('\n🔬 Running backtest WITH goalie adjustment...\n');
    const resultsWithGoalie = await backtester.runBacktest(true);
    
    // Generate report
    const reportWithGoalie = generateReport(resultsWithGoalie, true);
    fs.writeFileSync('backtesting/results/backtest_report_with_goalie.md', reportWithGoalie);
    console.log('\n✅ Report saved: backtesting/results/backtest_report_with_goalie.md');
    
    // Run backtest WITHOUT goalie adjustment
    console.log('\n🔬 Running backtest WITHOUT goalie adjustment...\n');
    const resultsWithoutGoalie = await backtester.runBacktest(false);
    
    // Generate report
    const reportWithoutGoalie = generateReport(resultsWithoutGoalie, false);
    fs.writeFileSync('backtesting/results/backtest_report_without_goalie.md', reportWithoutGoalie);
    console.log('\n✅ Report saved: backtesting/results/backtest_report_without_goalie.md');
    
    // Goalie impact comparison
    console.log('\n📊 Goalie Impact Analysis:');
    console.log(`   With Goalie    - Brier: ${resultsWithGoalie.winProbability.brierScore.toFixed(4)}, RMSE: ${resultsWithGoalie.totalGoals.rmse.toFixed(3)}`);
    console.log(`   Without Goalie - Brier: ${resultsWithoutGoalie.winProbability.brierScore.toFixed(4)}, RMSE: ${resultsWithoutGoalie.totalGoals.rmse.toFixed(3)}`);
    
    const brierImprovement = ((resultsWithoutGoalie.winProbability.brierScore - resultsWithGoalie.winProbability.brierScore) / resultsWithoutGoalie.winProbability.brierScore * 100).toFixed(2);
    const rmseImprovement = ((resultsWithoutGoalie.totalGoals.rmse - resultsWithGoalie.totalGoals.rmse) / resultsWithoutGoalie.totalGoals.rmse * 100).toFixed(2);
    
    console.log(`   Improvement    - Brier: ${brierImprovement}%, RMSE: ${rmseImprovement}%`);
    
    console.log('\n✅ Backtesting complete!\n');
    
  } catch (error) {
    console.error('\n❌ Error during backtesting:', error);
    process.exit(1);
  }
}

// Run the backtest
main();

