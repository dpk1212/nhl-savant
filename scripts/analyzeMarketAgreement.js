/**
 * Market Agreement Analysis
 * 
 * Analyzes historical bets to find optimal market agreement threshold
 * that maximizes ROI and profit.
 * 
 * Goal: Determine whether betting when model and market agree produces better results
 * than betting on all edges regardless of market opinion.
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

// Convert American odds to implied probability
function oddsToProb(americanOdds) {
  if (americanOdds < 0) {
    return Math.abs(americanOdds) / (Math.abs(americanOdds) + 100);
  } else {
    return 100 / (americanOdds + 100);
  }
}

// Calculate profit from a bet
function calculateProfit(outcome, odds) {
  if (outcome === 'WIN') {
    if (odds < 0) {
      return 100 / Math.abs(odds); // Favorite: risk odds to win 100
    } else {
      return odds / 100; // Underdog: risk 100 to win odds
    }
  } else if (outcome === 'LOSS') {
    return -1; // Lost 1 unit
  } else {
    return 0; // Push
  }
}

async function analyzeMarketAgreement() {
  console.log('📊 MARKET AGREEMENT ANALYSIS\n');
  console.log('='.repeat(80));
  console.log('Analyzing 264 games to find optimal market agreement threshold...\n');
  
  // Load data
  console.log('📂 Loading data...');
  const teamsCSV = readFileSync(path.join(__dirname, '../public/teams.csv'), 'utf-8');
  const goaliesCSV = readFileSync(path.join(__dirname, '../public/goalies.csv'), 'utf-8');
  const gamesCSV = readFileSync(path.join(__dirname, '../public/nhl-202526-asplayed.csv'), 'utf-8');
  const scheduleCSV = readFileSync(path.join(__dirname, '../public/games.csv'), 'utf-8');
  const oddsCSV = readFileSync(path.join(__dirname, '../public/odds_money.md'), 'utf-8');
  
  const teamsData = Papa.parse(teamsCSV, { header: true, skipEmptyLines: true }).data;
  const goaliesData = Papa.parse(goaliesCSV, { header: true, skipEmptyLines: true }).data;
  const gamesData = Papa.parse(gamesCSV, { header: true, skipEmptyLines: true }).data;
  const scheduleData = Papa.parse(scheduleCSV, { header: true, skipEmptyLines: true }).data;
  
  console.log(`✅ Loaded ${gamesData.length} games\n`);
  
  // Initialize model
  const goalieProcessor = new GoalieProcessor(goaliesData);
  const scheduleHelper = new ScheduleHelper(scheduleData);
  const dataProcessor = new NHLDataProcessor(teamsData, goalieProcessor, scheduleHelper);
  
  // Parse odds from markdown
  const oddsData = parseOddsFromMarkdown(oddsCSV);
  console.log(`✅ Parsed ${oddsData.length} games with odds\n`);
  
  // Analyze each game
  const bets = [];
  
  for (const game of gamesData) {
    if (!game.Visitor || !game.Home || !game.Score || !game.Score_1) continue;
    
    const homeTeam = getTeamCode(game.Home);
    const awayTeam = getTeamCode(game.Visitor);
    const actualHomeScore = parseInt(game.Score_1);
    const actualAwayScore = parseInt(game.Score);
    
    if (isNaN(actualHomeScore) || isNaN(actualAwayScore)) continue;
    
    // Find odds for this game
    const gameOdds = oddsData.find(o => 
      (o.away === awayTeam && o.home === homeTeam) ||
      (o.matchup && o.matchup.includes(awayTeam) && o.matchup.includes(homeTeam))
    );
    
    if (!gameOdds || !gameOdds.awayOdds || !gameOdds.homeOdds) continue;
    
    try {
      // Get model predictions
      const predictedHomeScore = dataProcessor.predictTeamScore(
        homeTeam, awayTeam, true, game['Visitor Goalie'], game.Date
      );
      const predictedAwayScore = dataProcessor.predictTeamScore(
        awayTeam, homeTeam, false, game['Home Goalie'], game.Date
      );
      
      const homeWinProb = dataProcessor.calculatePoissonWinProb(predictedHomeScore, predictedAwayScore);
      const awayWinProb = dataProcessor.calculatePoissonWinProb(predictedAwayScore, predictedHomeScore);
      
      // Get market probabilities
      const marketHomeProb = oddsToProb(gameOdds.homeOdds);
      const marketAwayProb = oddsToProb(gameOdds.awayOdds);
      
      // Calculate agreement
      const homeAgreement = Math.abs(homeWinProb - marketHomeProb);
      const awayAgreement = Math.abs(awayWinProb - marketAwayProb);
      
      // Calculate EV
      const homeEV = (homeWinProb * (gameOdds.homeOdds > 0 ? gameOdds.homeOdds / 100 : 100 / Math.abs(gameOdds.homeOdds))) - (1 - homeWinProb);
      const awayEV = (awayWinProb * (gameOdds.awayOdds > 0 ? gameOdds.awayOdds / 100 : 100 / Math.abs(gameOdds.awayOdds))) - (1 - awayWinProb);
      
      const actualWinner = actualHomeScore > actualAwayScore ? 'HOME' : 'AWAY';
      
      // Record potential bets (EV > 3%)
      if (homeEV > 0.03) {
        bets.push({
          team: homeTeam,
          side: 'HOME',
          odds: gameOdds.homeOdds,
          modelProb: homeWinProb,
          marketProb: marketHomeProb,
          agreement: homeAgreement,
          ev: homeEV,
          outcome: actualWinner === 'HOME' ? 'WIN' : 'LOSS',
          profit: calculateProfit(actualWinner === 'HOME' ? 'WIN' : 'LOSS', gameOdds.homeOdds)
        });
      }
      
      if (awayEV > 0.03) {
        bets.push({
          team: awayTeam,
          side: 'AWAY',
          odds: gameOdds.awayOdds,
          modelProb: awayWinProb,
          marketProb: marketAwayProb,
          agreement: awayAgreement,
          ev: awayEV,
          outcome: actualWinner === 'AWAY' ? 'WIN' : 'LOSS',
          profit: calculateProfit(actualWinner === 'AWAY' ? 'WIN' : 'LOSS', gameOdds.awayOdds)
        });
      }
    } catch (error) {
      // Skip problematic games
    }
  }
  
  console.log(`✅ Identified ${bets.length} potential bets with >3% EV\n`);
  
  // Analyze by agreement threshold
  console.log('='.repeat(80));
  console.log('📈 ANALYSIS BY MARKET AGREEMENT THRESHOLD');
  console.log('='.repeat(80));
  console.log();
  
  const thresholds = [
    { name: 'Tight Agreement', min: 0, max: 0.03 },
    { name: 'Moderate Agreement', min: 0.03, max: 0.05 },
    { name: 'Loose Agreement', min: 0.05, max: 0.08 },
    { name: 'Wide Disagreement', min: 0.08, max: 1.0 }
  ];
  
  const results = [];
  
  for (const threshold of thresholds) {
    const filteredBets = bets.filter(b => 
      b.agreement >= threshold.min && b.agreement < threshold.max
    );
    
    if (filteredBets.length === 0) continue;
    
    const wins = filteredBets.filter(b => b.outcome === 'WIN').length;
    const losses = filteredBets.filter(b => b.outcome === 'LOSS').length;
    const totalProfit = filteredBets.reduce((sum, b) => sum + b.profit, 0);
    const winRate = (wins / filteredBets.length) * 100;
    const roi = (totalProfit / filteredBets.length) * 100;
    
    results.push({
      name: threshold.name,
      bets: filteredBets.length,
      wins,
      losses,
      winRate,
      roi,
      profit: totalProfit
    });
    
    console.log(`${threshold.name} (${(threshold.min * 100).toFixed(0)}-${(threshold.max * 100).toFixed(0)}% difference):`);
    console.log(`  Bets: ${filteredBets.length}`);
    console.log(`  Win Rate: ${winRate.toFixed(1)}%`);
    console.log(`  ROI: ${roi.toFixed(1)}%`);
    console.log(`  Profit: ${totalProfit > 0 ? '+' : ''}${totalProfit.toFixed(2)} units`);
    console.log();
  }
  
  // Find optimal threshold
  const bestResult = results.reduce((best, curr) => 
    curr.roi > best.roi ? curr : best
  );
  
  console.log('='.repeat(80));
  console.log('🏆 OPTIMAL STRATEGY');
  console.log('='.repeat(80));
  console.log();
  console.log(`✅ BEST THRESHOLD: ${bestResult.name}`);
  console.log(`   ROI: ${bestResult.roi.toFixed(1)}%`);
  console.log(`   Win Rate: ${bestResult.winRate.toFixed(1)}%`);
  console.log(`   Profit: +${bestResult.profit.toFixed(2)} units`);
  console.log();
  
  // Calculate improvement
  const baselineBets = bets.length;
  const baselineWins = bets.filter(b => b.outcome === 'WIN').length;
  const baselineProfit = bets.reduce((sum, b) => sum + b.profit, 0);
  const baselineROI = (baselineProfit / baselineBets) * 100;
  
  console.log('📊 COMPARISON TO BASELINE (No Filter):');
  console.log(`   Baseline: ${baselineBets} bets, ${((baselineWins/baselineBets)*100).toFixed(1)}% WR, ${baselineROI.toFixed(1)}% ROI, +${baselineProfit.toFixed(2)}u`);
  console.log(`   Optimal:  ${bestResult.bets} bets, ${bestResult.winRate.toFixed(1)}% WR, ${bestResult.roi.toFixed(1)}% ROI, +${bestResult.profit.toFixed(2)}u`);
  console.log();
  console.log(`✨ IMPROVEMENT:`);
  console.log(`   ROI: ${baselineROI.toFixed(1)}% → ${bestResult.roi.toFixed(1)}% (${(bestResult.roi - baselineROI > 0 ? '+' : '')}${(bestResult.roi - baselineROI).toFixed(1)}%)`);
  console.log(`   Profit: ${baselineProfit.toFixed(2)}u → ${bestResult.profit.toFixed(2)}u (${((bestResult.profit - baselineProfit) / baselineProfit * 100).toFixed(0)}% improvement)`);
  console.log(`   Win Rate: ${((baselineWins/baselineBets)*100).toFixed(1)}% → ${bestResult.winRate.toFixed(1)}% (${(bestResult.winRate - (baselineWins/baselineBets)*100 > 0 ? '+' : '')}${(bestResult.winRate - (baselineWins/baselineBets)*100).toFixed(1)}%)`);
  console.log();
  
  // Recommendation
  console.log('='.repeat(80));
  console.log('💡 RECOMMENDATION');
  console.log('='.repeat(80));
  console.log();
  
  if (bestResult.name.includes('Tight')) {
    console.log('✅ Use TIGHT filter (≤3% disagreement)');
    console.log('   - Highest quality bets only');
    console.log('   - Lower volume, highest confidence');
    console.log('   - Best for risk-averse bettors');
  } else if (bestResult.name.includes('Moderate')) {
    console.log('✅ Use MODERATE filter (3-5% disagreement)');
    console.log('   - Balance of quality and volume');
    console.log('   - Good risk-adjusted returns');
    console.log('   - RECOMMENDED for most bettors');
  } else {
    console.log('⚠️  Results suggest loose filtering');
    console.log('   - Consider moderate (5%) for safety');
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('✅ Analysis Complete!');
  console.log('='.repeat(80));
}

// Parse odds from markdown file
function parseOddsFromMarkdown(markdown) {
  const odds = [];
  const lines = markdown.split('\n');
  
  for (const line of lines) {
    // Look for pattern: |AWAY|+150|HOME|-180|
    const match = line.match(/\|([A-Z]{2,3})\|([+-]\d+)\|([A-Z]{2,3})\|([+-]\d+)\|/);
    if (match) {
      odds.push({
        away: match[1],
        awayOdds: parseInt(match[2]),
        home: match[3],
        homeOdds: parseInt(match[4]),
        matchup: `${match[1]} @ ${match[3]}`
      });
    }
  }
  
  return odds;
}

// Run analysis
analyzeMarketAgreement().catch(console.error);

