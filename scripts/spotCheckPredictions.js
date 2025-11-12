/**
 * Spot Check Predictions - Manually verify model predictions vs actual results
 * 
 * This will show you exactly what the model predicted for specific games
 * and compare to actual outcomes so you can verify accuracy
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';
import { NHLDataProcessor } from '../src/utils/dataProcessing.js';
import { GoalieProcessor } from '../src/utils/goalieProcessor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Team mapping
function getTeamCode(teamName) {
  const mapping = {
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
  return mapping[teamName] || teamName;
}

// Load data
const teamsCSV = readFileSync(join(__dirname, '../public/teams.csv'), 'utf-8');
const teamsData = Papa.parse(teamsCSV, { header: true }).data;

const goaliesCSV = readFileSync(join(__dirname, '../public/goalies.csv'), 'utf-8');
const goaliesData = Papa.parse(goaliesCSV, { header: true }).data;

const gamesCSV = readFileSync(join(__dirname, '../public/nhl-202526-asplayed.csv'), 'utf-8');
const gamesData = Papa.parse(gamesCSV, { header: true }).data
  .filter(g => g.Status === 'Regulation' || g.Status === 'OT' || g.Status === 'SO');

// Initialize model
const goalieProcessor = new GoalieProcessor(goaliesData);
const dataProcessor = new NHLDataProcessor(teamsData, goalieProcessor);

console.log('🔍 SPOT CHECK: Model Predictions vs Actual Results');
console.log('='.repeat(80));
console.log('');

// Test first 30 games
let correct = 0;
let total = 0;

for (let i = 0; i < Math.min(30, gamesData.length); i++) {
  const game = gamesData[i];
  
  try {
    const homeTeam = getTeamCode(game.Home);
    const awayTeam = getTeamCode(game.Visitor);
    const awayScore = parseInt(game.Score);
    const homeScore = parseInt(game.Score_1);
    
    if (isNaN(homeScore) || isNaN(awayScore)) continue;
    
    // Get model prediction
    const predHomeScore = dataProcessor.predictTeamScore(homeTeam, awayTeam, true, game['Home Goalie']);
    const predAwayScore = dataProcessor.predictTeamScore(awayTeam, homeTeam, false, game['Visitor Goalie']);
    const homeWinProb = dataProcessor.calculatePoissonWinProb(predHomeScore, predAwayScore);
    
    const predictedWinner = homeWinProb > 0.5 ? 'HOME' : 'AWAY';
    const actualWinner = homeScore > awayScore ? 'HOME' : 'AWAY';
    const isCorrect = predictedWinner === actualWinner;
    
    if (isCorrect) correct++;
    total++;
    
    const status = isCorrect ? '✅' : '❌';
    
    console.log(`${i+1}. ${game.Date}: ${awayTeam} @ ${homeTeam}`);
    console.log(`   Predicted: ${predictedWinner} (${(homeWinProb * 100).toFixed(1)}% home) | Scores: ${predAwayScore.toFixed(1)}-${predHomeScore.toFixed(1)}`);
    console.log(`   Actual: ${actualWinner} | Scores: ${awayScore}-${homeScore}`);
    console.log(`   Result: ${status} ${isCorrect ? 'CORRECT' : 'INCORRECT'}`);
    console.log('');
    
  } catch (error) {
    console.error(`Error on game ${i+1}:`, error.message);
  }
}

console.log('='.repeat(80));
console.log(`ACCURACY: ${correct}/${total} = ${(correct/total * 100).toFixed(1)}%`);
console.log('='.repeat(80));

