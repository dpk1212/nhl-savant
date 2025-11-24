/**
 * Extract All Haslametrics Team Names
 * Lists all unique team names found in Haslametrics data
 */

import { parseHaslametrics } from '../src/utils/haslametricsParser.js';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function extractHaslaTeams() {
  console.log('========================================');
  console.log('📋 EXTRACTING HASLAMETRICS TEAM NAMES');
  console.log('========================================\n');
  
  try {
    // Load Haslametrics data
    const haslaMarkdown = await readFile(
      join(__dirname, '../public/haslametrics.md'),
      'utf8'
    );
    
    // Parse data
    const haslaData = parseHaslametrics(haslaMarkdown);
    
    console.log(`✅ Parsed ${haslaData.games.length} Haslametrics games`);
    console.log(`✅ Found ${Object.keys(haslaData.teams).length} teams with ratings\n`);
    
    // Extract unique team names from games
    const teamsFromGames = new Set();
    haslaData.games.forEach(game => {
      if (game.awayTeam) teamsFromGames.add(game.awayTeam);
      if (game.homeTeam) teamsFromGames.add(game.homeTeam);
    });
    
    // Extract team names from ratings
    const teamsFromRatings = new Set(Object.keys(haslaData.teams));
    
    // Combine both sources
    const allTeams = new Set([...teamsFromGames, ...teamsFromRatings]);
    
    console.log('========================================');
    console.log(`ALL HASLAMETRICS TEAMS (${allTeams.size} total):`);
    console.log('========================================\n');
    
    // Sort alphabetically for easy reading
    const sortedTeams = Array.from(allTeams).sort();
    
    sortedTeams.forEach((team, idx) => {
      const hasRating = haslaData.teams[team];
      const rating = hasRating ? hasRating.rating || 'N/A' : 'N/A';
      console.log(`${(idx + 1).toString().padStart(3)}. ${team.padEnd(30)} ${hasRating ? `Rating: ${rating}` : '(No rating data)'}`);
    });
    
    console.log('\n========================================');
    console.log('TEAMS IN GAMES ONLY (not in ratings):');
    console.log('========================================\n');
    
    const gamesOnlyTeams = Array.from(teamsFromGames).filter(t => !teamsFromRatings.has(t)).sort();
    if (gamesOnlyTeams.length === 0) {
      console.log('(None - all game teams have ratings)');
    } else {
      gamesOnlyTeams.forEach((team, idx) => {
        console.log(`${idx + 1}. ${team}`);
      });
    }
    
    console.log('\n========================================');
    console.log('USAGE:');
    console.log('========================================\n');
    console.log('Use these exact names in basketball_teams.csv');
    console.log('Example:');
    console.log('  OddsTrader: "Kansas City" → Haslametrics: "Kansas City"');
    console.log('  OddsTrader: "N.j.i.t." → Haslametrics: "NJIT"');
    console.log('\nCopy the exact spelling from this list!\n');
    
    return {
      totalTeams: allTeams.size,
      gamesCount: haslaData.games.length,
      teams: sortedTeams
    };
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error.stack);
    throw error;
  }
}

// Run extraction
extractHaslaTeams()
  .then(results => {
    console.log(`✅ Extracted ${results.totalTeams} team names successfully!\n`);
    process.exit(0);
  })
  .catch(error => {
    console.error('\n💥 Extraction failed!');
    process.exit(1);
  });

