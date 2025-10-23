/**
 * DIAGNOSTIC SCRIPT: Analyze Bet Distribution
 * 
 * Purpose: Count how many +EV bets are away underdogs vs other categories
 * This helps identify if there's a systematic bias in the model
 */

import Papa from 'papaparse';
import fs from 'fs';
import { NHLDataProcessor } from './src/utils/dataProcessing.js';
import { GoalieProcessor } from './src/utils/goalieProcessor.js';
import { ScheduleHelper } from './src/utils/scheduleHelper.js';

console.log('🔍 DIAGNOSTIC: Analyzing Bet Distribution for Bias Detection\n');
console.log('=' .repeat(80));

// Calculate implied probability from American odds
function calculateImpliedProb(odds) {
  if (odds > 0) {
    return 100 / (odds + 100);
  } else {
    return Math.abs(odds) / (Math.abs(odds) + 100);
  }
}

// Simple odds parser (inline to avoid import issues)
function parseOddsFromMarkdown(text) {
  const games = [];
  const lines = text.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Look for game lines with team names and odds
    if (line.includes('![](https://logos.oddstrader.com/') && line.includes('<br>')) {
      try {
        const parts = line.split('<br>');
        const teamName = parts[1]?.trim();
        const oddsMatch = line.match(/([+-]\d+)(?:Caesars|Bet365|BetMGM|BetRivers|SugarHouse|FanDuel)/);
        
        if (teamName && oddsMatch) {
          const odds = parseInt(oddsMatch[1]);
          
          // Check if this is away or home team (away comes first)
          const nextLine = lines[i + 1];
          if (nextLine && nextLine.includes('![](https://logos.oddstrader.com/')) {
            // This is away team, next is home
            const homeTeamName = nextLine.split('<br>')[1]?.trim();
            const homeOddsMatch = nextLine.match(/([+-]\d+)(?:Caesars|Bet365|BetMGM|BetRivers|SugarHouse|FanDuel)/);
            
            if (homeTeamName && homeOddsMatch) {
              games.push({
                awayTeam: teamName,
                homeTeam: homeTeamName,
                moneyline: {
                  away: odds,
                  home: parseInt(homeOddsMatch[1])
                }
              });
              i++; // Skip next line since we processed it
            }
          }
        }
      } catch (err) {
        // Skip malformed lines
      }
    }
  }
  
  return games;
}

// Map full names to codes
const teamNameToCode = {
  'Minnesota': 'MIN',
  'N.Y. Rangers': 'NYR',
  'Seattle': 'SEA',
  'Philadelphia': 'PHI',
  'Buffalo': 'BUF',
  'Montreal': 'MTL',
  'Winnipeg': 'WPG',
  'Calgary': 'CGY',
  'Carolina': 'CAR',
  'Vegas': 'VGK',
  'San Jose': 'SJS',
  'N.Y. Islanders': 'NYI',
  'New Jersey': 'NJD',
  'Toronto': 'TOR',
  'Vancouver': 'VAN',
  'Pittsburgh': 'PIT',
  'Washington': 'WSH',
  'Edmonton': 'EDM',
  'Ottawa': 'OTT',
  'Florida': 'FLA',
  'Boston': 'BOS',
  'Los Angeles': 'LAK',
  'St. Louis': 'STL',
  'Columbus': 'CBJ',
  'Dallas': 'DAL',
  'Anaheim': 'ANA',
  'Nashville': 'NSH',
  'Colorado': 'COL',
  'Utah': 'UTA'
};

// Load all data
async function loadData() {
  // Load team stats
  const teamsText = fs.readFileSync('./public/teams.csv', 'utf-8');
  const teamsParsed = Papa.parse(teamsText, { header: true, skipEmptyLines: true });
  
  // Load goalie stats
  const goaliesText = fs.readFileSync('./public/goalies.csv', 'utf-8');
  const goaliesParsed = Papa.parse(goaliesText, { header: true, skipEmptyLines: true });
  
  // Load starting goalies
  const startingGoaliesText = fs.readFileSync('./public/starting_goalies.json', 'utf-8');
  const startingGoalies = JSON.parse(startingGoaliesText);
  
  // Load schedule
  let scheduleHelper = null;
  try {
    const scheduleText = fs.readFileSync('./public/nhl-202526-asplayed.csv', 'utf-8');
    const scheduleParsed = Papa.parse(scheduleText, { header: true, skipEmptyLines: true });
    scheduleHelper = new ScheduleHelper(scheduleParsed.data);
  } catch (err) {
    console.warn('⚠️ Could not load schedule data');
  }
  
  // Load odds
  const oddsText = fs.readFileSync('./public/todays_odds.md', 'utf-8');
  const games = parseOddsFromMarkdown(oddsText);
  
  // Process data
  const goalieProcessor = new GoalieProcessor(goaliesParsed.data);
  const dataProcessor = new NHLDataProcessor(teamsParsed.data, goalieProcessor, scheduleHelper);
  
  return { dataProcessor, goalieProcessor, startingGoalies, games };
}

// Analyze bet distribution
async function analyzeBetDistribution() {
  const { dataProcessor, startingGoalies, games } = await loadData();
  
  console.log(`\n📊 Loaded ${games.length} games with odds\n`);
  
  // Track all bets by category
  const betCategories = {
    awayUnderdog: [],
    awayFavorite: [],
    homeUnderdog: [],
    homeFavorite: []
  };
  
  let totalPositiveEV = 0;
  
  // Analyze each game
  games.forEach((game, idx) => {
    const awayCode = teamNameToCode[game.awayTeam];
    const homeCode = teamNameToCode[game.homeTeam];
    
    if (!awayCode || !homeCode) {
      console.log(`⚠️ Skipping ${game.awayTeam} @ ${game.homeTeam} - unknown teams`);
      return;
    }
    
    console.log(`\n${'─'.repeat(80)}`);
    console.log(`Game ${idx + 1}: ${awayCode} @ ${homeCode}`);
    console.log(`${'─'.repeat(80)}`);
    
    // Get starting goalies
    const gameGoalies = startingGoalies.find(g => 
      g.awayTeam === awayCode && g.homeTeam === homeCode
    );
    
    // Predict scores
    const awayGoalie = gameGoalies?.awayGoalie || null;
    const homeGoalie = gameGoalies?.homeGoalie || null;
    
    const awayScore = dataProcessor.predictTeamScore(awayCode, homeCode, false, awayGoalie);
    const homeScore = dataProcessor.predictTeamScore(homeCode, awayCode, true, homeGoalie);
    
    // Calculate win probabilities
    const awayWinProb = dataProcessor.calculatePoissonWinProb(awayScore, homeScore);
    const homeWinProb = 1 - awayWinProb;
    
    // Calculate market probabilities
    const awayMarketProb = calculateImpliedProb(game.moneyline.away);
    const homeMarketProb = calculateImpliedProb(game.moneyline.home);
    
    // Calculate EV
    const awayEV = ((awayWinProb / awayMarketProb) - 1) * 100;
    const homeEV = ((homeWinProb / homeMarketProb) - 1) * 100;
    
    // Determine favorites/underdogs
    const awayIsUnderdog = game.moneyline.away > 0;
    const homeIsUnderdog = game.moneyline.home > 0;
    
    console.log(`\n💰 MONEYLINE:`);
    console.log(`  Away (${awayCode}): ${game.moneyline.away > 0 ? '+' : ''}${game.moneyline.away} ${awayIsUnderdog ? '(UNDERDOG)' : '(FAVORITE)'}`);
    console.log(`    Predicted Score: ${awayScore.toFixed(2)} goals`);
    console.log(`    Model Prob: ${(awayWinProb * 100).toFixed(1)}%`);
    console.log(`    Market Prob: ${(awayMarketProb * 100).toFixed(1)}%`);
    console.log(`    EV: ${awayEV > 0 ? '+' : ''}${awayEV.toFixed(1)}%`);
    
    console.log(`  Home (${homeCode}): ${game.moneyline.home > 0 ? '+' : ''}${game.moneyline.home} ${homeIsUnderdog ? '(UNDERDOG)' : '(FAVORITE)'}`);
    console.log(`    Predicted Score: ${homeScore.toFixed(2)} goals`);
    console.log(`    Model Prob: ${(homeWinProb * 100).toFixed(1)}%`);
    console.log(`    Market Prob: ${(homeMarketProb * 100).toFixed(1)}%`);
    console.log(`    EV: ${homeEV > 0 ? '+' : ''}${homeEV.toFixed(1)}%`);
    
    // Track positive EV bets
    if (awayEV > 0) {
      totalPositiveEV++;
      const category = awayIsUnderdog ? 'awayUnderdog' : 'awayFavorite';
      betCategories[category].push({
        game: `${awayCode} @ ${homeCode}`,
        team: awayCode,
        odds: game.moneyline.away,
        ev: awayEV,
        modelProb: awayWinProb,
        predictedScore: awayScore
      });
      console.log(`  ✅ +EV BET: ${awayCode} ML (${category.toUpperCase().replace('AWAY', 'AWAY ')})`);
    }
    
    if (homeEV > 0) {
      totalPositiveEV++;
      const category = homeIsUnderdog ? 'homeUnderdog' : 'homeFavorite';
      betCategories[category].push({
        game: `${awayCode} @ ${homeCode}`,
        team: homeCode,
        odds: game.moneyline.home,
        ev: homeEV,
        modelProb: homeWinProb,
        predictedScore: homeScore
      });
      console.log(`  ✅ +EV BET: ${homeCode} ML (${category.toUpperCase().replace('HOME', 'HOME ')})`);
    }
  });
  
  // Generate report
  console.log('\n\n');
  console.log('═'.repeat(80));
  console.log('📊 BET DISTRIBUTION ANALYSIS REPORT');
  console.log('═'.repeat(80));
  
  console.log(`\n🎯 TOTAL POSITIVE EV MONEYLINE BETS: ${totalPositiveEV}\n`);
  
  if (totalPositiveEV === 0) {
    console.log('⚠️  NO POSITIVE EV BETS FOUND');
    console.log('   This could mean:');
    console.log('   1. Market is very efficient today');
    console.log('   2. Model needs calibration');
    console.log('   3. Odds data is incomplete');
    return;
  }
  
  console.log('📈 MONEYLINE BETS BREAKDOWN:');
  console.log(`  ├─ Away Underdogs: ${betCategories.awayUnderdog.length} (${((betCategories.awayUnderdog.length / totalPositiveEV) * 100).toFixed(1)}%)`);
  console.log(`  ├─ Away Favorites: ${betCategories.awayFavorite.length} (${((betCategories.awayFavorite.length / totalPositiveEV) * 100).toFixed(1)}%)`);
  console.log(`  ├─ Home Underdogs: ${betCategories.homeUnderdog.length} (${((betCategories.homeUnderdog.length / totalPositiveEV) * 100).toFixed(1)}%)`);
  console.log(`  └─ Home Favorites: ${betCategories.homeFavorite.length} (${((betCategories.homeFavorite.length / totalPositiveEV) * 100).toFixed(1)}%)`);
  
  // Critical metric
  const awayUnderdogPct = (betCategories.awayUnderdog.length / totalPositiveEV) * 100;
  
  console.log('\n' + '═'.repeat(80));
  console.log('🚨 BIAS DETECTION:');
  console.log('═'.repeat(80));
  console.log(`\n📊 Away Underdog Percentage: ${awayUnderdogPct.toFixed(1)}%\n`);
  
  if (awayUnderdogPct < 40) {
    console.log('✅ VERDICT: NO BIAS DETECTED');
    console.log('   Model shows balanced distribution across bet types.');
    console.log('   This is healthy and expected behavior.');
  } else if (awayUnderdogPct >= 40 && awayUnderdogPct < 50) {
    console.log('⚠️  VERDICT: SLIGHT LEAN TOWARD AWAY UNDERDOGS');
    console.log('   Percentage is elevated but within normal variance.');
    console.log('   Monitor over larger sample size.');
  } else if (awayUnderdogPct >= 50 && awayUnderdogPct < 60) {
    console.log('🔍 VERDICT: MODERATE BIAS DETECTED');
    console.log('   Model shows preference for away underdogs.');
    console.log('   Investigate: Early season regression, home ice adjustment.');
  } else {
    console.log('🚨 VERDICT: STRONG BIAS DETECTED');
    console.log('   Model heavily favors away underdogs.');
    console.log('   CRITICAL: Review regression logic, home ice advantage, and calibration.');
  }
  
  // Show all categories for comparison
  console.log('\n' + '─'.repeat(80));
  console.log('📋 COMPLETE BET LIST BY CATEGORY:');
  console.log('─'.repeat(80));
  
  Object.entries(betCategories).forEach(([category, bets]) => {
    if (bets.length > 0) {
      console.log(`\n${category.toUpperCase().replace(/([A-Z])/g, ' $1').trim()} (${bets.length} bets):`);
      bets.sort((a, b) => b.ev - a.ev).forEach(bet => {
        console.log(`  • ${bet.team} in ${bet.game}`);
        console.log(`    Odds: ${bet.odds > 0 ? '+' : ''}${bet.odds} | EV: +${bet.ev.toFixed(1)}% | Model Prob: ${(bet.modelProb * 100).toFixed(1)}% | Predicted: ${bet.predictedScore.toFixed(2)} goals`);
      });
    }
  });
  
  console.log('\n' + '═'.repeat(80));
  console.log('✅ Analysis Complete');
  console.log('═'.repeat(80));
}

// Run analysis
analyzeBetDistribution().catch(err => {
  console.error('❌ Error:', err);
  console.error(err.stack);
  process.exit(1);
});
