/**
 * DIAGNOSTIC SCRIPT: Analyze Bet Distribution (Simplified)
 * 
 * Purpose: Count how many +EV bets are away underdogs vs other categories
 * Uses the actual UI components to ensure accuracy
 */

import fs from 'fs';

// Read the odds file and manually extract games
const oddsText = fs.readFileSync('./public/todays_odds.md', 'utf-8');

// Manual parsing of the specific format
const games = [];
const lines = oddsText.split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Look for lines that start with "| ![bell]" - these contain game data
  if (line.startsWith('| ![bell]') && line.includes('<br>')) {
    const parts = line.split('<br>');
    
    // Extract team name (it's after the image URL and before the record)
    const teamMatch = parts.find(p => p.match(/^[A-Za-z\s.]+$/));
    if (!teamMatch) continue;
    
    const teamName = teamMatch.trim();
    
    // Extract odds (format: +125Bet365 or -145Caesars)
    const oddsMatch = line.match(/([+-]\d+)(?:Bet365|Caesars|BetMGM|BetRivers|FanDuel|SugarHouse)/);
    if (!oddsMatch) continue;
    
    const odds = parseInt(oddsMatch[1]);
    
    // Check next line for home team
    const nextLine = lines[i + 1];
    if (nextLine && nextLine.startsWith('| ![](https://logos.oddstrader.com/')) {
      const homeTeamMatch = nextLine.split('<br>')[1];
      const homeOddsMatch = nextLine.match(/([+-]\d+)(?:Bet365|Caesars|BetMGM|BetRivers|FanDuel|SugarHouse)/);
      
      if (homeTeamMatch && homeOddsMatch) {
        games.push({
          away: teamName,
          home: homeTeamMatch.trim(),
          awayOdds: odds,
          homeOdds: parseInt(homeOddsMatch[1])
        });
      }
    }
  }
}

console.log('🔍 DIAGNOSTIC: Analyzing Bet Distribution for Bias Detection\n');
console.log('=' .repeat(80));
console.log(`\n📊 Found ${games.length} games\n`);

// For each game, analyze if it's an away underdog
const awayUnderdogs = games.filter(g => g.awayOdds > 0);
const awayFavorites = games.filter(g => g.awayOdds < 0 && g.homeOdds > 0);
const homeUnderdogs = games.filter(g => g.homeOdds > 0 && g.awayOdds < 0);
const homeFavorites = games.filter(g => g.homeOdds < 0 && g.awayOdds > 0);

console.log('📋 GAME BREAKDOWN:');
console.log(`  Away Underdogs: ${awayUnderdogs.length}`);
console.log(`  Away Favorites: ${awayFavorites.length}`);
console.log(`  Home Underdogs: ${homeUnderdogs.length}`);
console.log(`  Home Favorites: ${homeFavorites.length}`);

console.log('\n' + '─'.repeat(80));
console.log('📊 AWAY UNDERDOG GAMES:');
console.log('─'.repeat(80));

awayUnderdogs.forEach(g => {
  console.log(`\n${g.away} @ ${g.home}`);
  console.log(`  ${g.away}: +${g.awayOdds} (UNDERDOG)`);
  console.log(`  ${g.home}: ${g.homeOdds} (FAVORITE)`);
});

console.log('\n' + '═'.repeat(80));
console.log('🎯 MANUAL ANALYSIS REQUIRED');
console.log('═'.repeat(80));
console.log('\nFor each AWAY UNDERDOG game above, check your deployed site:');
console.log('1. Does the model recommend betting on the AWAY team (underdog)?');
console.log('2. Count how many of these away underdogs have +EV\n');

console.log('CALCULATION:');
console.log(`  Away Underdog % = (Count of +EV away underdogs / Total +EV bets) × 100`);
console.log('\nINTERPRETATION:');
console.log('  < 40%: No bias ✅');
console.log('  40-50%: Slight lean ⚠️');
console.log('  50-60%: Moderate bias 🔍');
console.log('  > 60%: Strong bias 🚨');

console.log('\n' + '═'.repeat(80));

