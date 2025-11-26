/**
 * Diagnose Missing CSV Mappings
 * Shows exact team names from each source to fix CSV
 */

import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parseBasketballOdds } from '../src/utils/basketballOddsParser.js';
import { parseHaslametrics } from '../src/utils/haslametricsParser.js';
import { parseDRatings } from '../src/utils/dratingsParser.js';
import { matchGamesWithCSV } from '../src/utils/gameMatchingCSV.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function diagnoseMissingMappings() {
  console.log('\n🔍 DIAGNOSING MISSING CSV MAPPINGS');
  console.log('==========================================\n');
  
  // Load data
  const oddsMarkdown = await readFile(join(__dirname, '../public/basketball_odds.md'), 'utf8');
  const haslaMarkdown = await readFile(join(__dirname, '../public/haslametrics.md'), 'utf8');
  const drateMarkdown = await readFile(join(__dirname, '../public/dratings.md'), 'utf8');
  const csvContent = await readFile(join(__dirname, '../public/basketball_teams.csv'), 'utf8');
  
  // Parse
  const oddsGames = parseBasketballOdds(oddsMarkdown);
  const haslaData = parseHaslametrics(haslaMarkdown);
  const dratePreds = parseDRatings(drateMarkdown);
  
  console.log(`📊 Data loaded:`);
  console.log(`   OddsTrader: ${oddsGames.length} games`);
  console.log(`   Haslametrics: ${haslaData.games.length} games`);
  console.log(`   D-Ratings: ${dratePreds.length} predictions\n`);
  
  // Match games
  const matchedGames = matchGamesWithCSV(oddsGames, haslaData, dratePreds, csvContent);
  
  // Find games missing data
  const missingHasla = matchedGames.filter(g => !g.haslametrics && g.dratings);
  const missingBoth = matchedGames.filter(g => !g.haslametrics && !g.dratings);
  
  console.log('\n\n🚨 GAMES MISSING HASLAMETRICS:');
  console.log('=====================================\n');
  
  if (missingHasla.length > 0) {
    missingHasla.forEach((game, i) => {
      console.log(`${i + 1}. ${game.awayTeam} @ ${game.homeTeam}`);
      console.log(`   OddsTrader Away: "${game.awayTeam}"`);
      console.log(`   OddsTrader Home: "${game.homeTeam}"`);
      
      // Try to find similar games in Haslametrics
      const haslaGames = haslaData.games;
      console.log(`\n   Looking for similar Haslametrics games...`);
      
      // Check if either team appears in Haslametrics
      const awayMatches = haslaGames.filter(g => 
        g.awayTeamRaw.toLowerCase().includes(game.awayTeam.toLowerCase().split(' ')[0]) ||
        g.homeTeamRaw.toLowerCase().includes(game.awayTeam.toLowerCase().split(' ')[0])
      );
      
      const homeMatches = haslaGames.filter(g => 
        g.awayTeamRaw.toLowerCase().includes(game.homeTeam.toLowerCase().split(' ')[0]) ||
        g.homeTeamRaw.toLowerCase().includes(game.homeTeam.toLowerCase().split(' ')[0])
      );
      
      if (awayMatches.length > 0) {
        console.log(`   Possible Haslametrics for "${game.awayTeam}":`);
        awayMatches.slice(0, 3).forEach(m => {
          console.log(`      - "${m.awayTeamRaw}" @ "${m.homeTeamRaw}"`);
        });
      } else {
        console.log(`   ❌ No Haslametrics games found for "${game.awayTeam}"`);
      }
      
      if (homeMatches.length > 0) {
        console.log(`   Possible Haslametrics for "${game.homeTeam}":`);
        homeMatches.slice(0, 3).forEach(m => {
          console.log(`      - "${m.awayTeamRaw}" @ "${m.homeTeamRaw}"`);
        });
      } else {
        console.log(`   ❌ No Haslametrics games found for "${game.homeTeam}"`);
      }
      
      console.log('');
    });
  }
  
  console.log('\n🚨 GAMES MISSING BOTH SOURCES:');
  console.log('=====================================\n');
  
  if (missingBoth.length > 0) {
    missingBoth.forEach((game, i) => {
      console.log(`${i + 1}. ${game.awayTeam} @ ${game.homeTeam}`);
      console.log(`   OddsTrader Away: "${game.awayTeam}"`);
      console.log(`   OddsTrader Home: "${game.homeTeam}"`);
      console.log(`   ❌ Missing in both Haslametrics AND D-Ratings`);
      console.log(`   → These teams may not be in the data sources today\n`);
    });
  }
  
  // Show ALL available Haslametrics team names
  console.log('\n\n📋 ALL AVAILABLE HASLAMETRICS TEAMS:');
  console.log('=====================================');
  const haslaTeamNames = new Set();
  haslaData.games.forEach(g => {
    haslaTeamNames.add(g.awayTeamRaw);
    haslaTeamNames.add(g.homeTeamRaw);
  });
  Array.from(haslaTeamNames).sort().forEach(team => {
    console.log(`   "${team}"`);
  });
  
  console.log('\n\n💡 RECOMMENDED ACTIONS:');
  console.log('=====================================\n');
  console.log('1. Compare OddsTrader names with Haslametrics names above');
  console.log('2. Update basketball_teams.csv with correct haslametrics_name column');
  console.log('3. Re-run the bet writing script');
  console.log('4. Some games may genuinely not be in Haslametrics (smaller games)\n');
}

diagnoseMissingMappings().catch(console.error);

