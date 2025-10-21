// Quick script to analyze prediction variance
import Papa from 'papaparse';
import fs from 'fs';
import { NHLDataProcessor } from '../src/utils/dataProcessing.js';
import { GoalieProcessor } from '../src/utils/goalieProcessor.js';

console.log('🔍 Analyzing Prediction Variance\n');

// Load team data
const teamsCSV = fs.readFileSync('backtesting/data/teams_2024.csv', 'utf-8');
const teamsParsed = Papa.parse(teamsCSV, { header: true, dynamicTyping: true });
const teamsData = teamsParsed.data;

// Load goalie data
const goaliesCSV = fs.readFileSync('backtesting/data/goalies_2024.csv', 'utf-8');
const goaliesParsed = Papa.parse(goaliesCSV, { header: true, dynamicTyping: true });
const goaliesData = goaliesParsed.data;

// Initialize processors
const goalieProcessor = new GoalieProcessor(goaliesData);
const processor = new NHLDataProcessor(teamsData, goalieProcessor);

console.log('✅ Data loaded\n');

// Get all teams
const teams = [...new Set(teamsData.filter(t => t.situation === '5on5').map(t => t.team))];
console.log(`📊 Found ${teams.length} teams\n`);

// Test a sample of matchups
const predictions = [];

// Sample matchups: Elite vs Elite, Elite vs Weak, Weak vs Weak, Average vs Average
const sampleMatchups = [
  { home: 'COL', away: 'DAL', desc: 'Elite vs Elite' },
  { home: 'COL', away: 'SJS', desc: 'Elite vs Weak' },
  { home: 'SJS', away: 'CHI', desc: 'Weak vs Weak' },
  { home: 'TOR', away: 'BOS', desc: 'Average vs Average' },
  { home: 'EDM', away: 'ARI', desc: 'Strong vs Weak' },
  { home: 'ARI', away: 'EDM', desc: 'Weak vs Strong' }
];

console.log('🏒 Sample Matchup Predictions:\n');
console.log('='.repeat(80));

for (const matchup of sampleMatchups) {
  const homeScore = processor.predictTeamScore(matchup.home, matchup.away, true);
  const awayScore = processor.predictTeamScore(matchup.away, matchup.home, false);
  const total = homeScore + awayScore;
  const homeWinProb = processor.estimateWinProbability(
    { team: matchup.home },
    { team: matchup.away },
    true
  ) * 100;
  
  console.log(`${matchup.desc}: ${matchup.home} (H) vs ${matchup.away} (A)`);
  console.log(`  Prediction: ${matchup.home} ${homeScore.toFixed(2)} - ${matchup.away} ${awayScore.toFixed(2)} (Total: ${total.toFixed(2)})`);
  console.log(`  Win Prob: ${matchup.home} ${homeWinProb.toFixed(1)}%`);
  console.log('');
  
  predictions.push({ ...matchup, homeScore, awayScore, total, homeWinProb });
}

console.log('='.repeat(80));
console.log('\n📈 Variance Analysis:\n');

const totals = predictions.map(p => p.total);
const winProbs = predictions.map(p => p.homeWinProb);

const min_total = Math.min(...totals);
const max_total = Math.max(...totals);
const avg_total = totals.reduce((a, b) => a + b) / totals.length;
const spread_total = max_total - min_total;

const min_winProb = Math.min(...winProbs);
const max_winProb = Math.max(...winProbs);
const spread_winProb = max_winProb - min_winProb;

console.log('Total Goals:');
console.log(`  Min: ${min_total.toFixed(2)}`);
console.log(`  Max: ${max_total.toFixed(2)}`);
console.log(`  Avg: ${avg_total.toFixed(2)}`);
console.log(`  Spread: ${spread_total.toFixed(2)} goals`);
console.log('');
console.log('Win Probability:');
console.log(`  Min: ${min_winProb.toFixed(1)}%`);
console.log(`  Max: ${max_winProb.toFixed(1)}%`);
console.log(`  Spread: ${spread_winProb.toFixed(1)}%`);
console.log('');

// Status
console.log('Status:');
if (spread_total > 1.5) {
  console.log(`  ✅ Total spread ${spread_total.toFixed(2)} > 1.5 goals (GOOD variance)`);
} else {
  console.log(`  ❌ Total spread ${spread_total.toFixed(2)} < 1.5 goals (FLAT predictions)`);
}

if (spread_winProb > 20) {
  console.log(`  ✅ Win prob spread ${spread_winProb.toFixed(1)}% > 20% (GOOD differentiation)`);
} else {
  console.log(`  ❌ Win prob spread ${spread_winProb.toFixed(1)}% < 20% (FLAT predictions)`);
}

console.log('\n✅ Analysis complete!\n');

