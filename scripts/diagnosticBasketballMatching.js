/**
 * Diagnostic: Show which games are NOT matching across data sources
 */

import { parseBasketballOdds } from '../src/utils/basketballOddsParser.js';
import { parseHaslametrics } from '../src/utils/haslametricsParser.js';
import { parseDRatings } from '../src/utils/dratingsParser.js';
import { matchGamesWithCSV } from '../src/utils/gameMatchingCSV.js';
import fs from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function diagnose() {
  console.log('\n🔍 BASKETBALL GAME MATCHING DIAGNOSTIC\n');
  
  // Load data
  const oddsMarkdown = await fs.readFile(join(__dirname, '../public/basketball_odds.md'), 'utf8');
  const haslaMarkdown = await fs.readFile(join(__dirname, '../public/haslametrics.md'), 'utf8');
  const drateMarkdown = await fs.readFile(join(__dirname, '../public/dratings.md'), 'utf8');
  const csvContent = await fs.readFile(join(__dirname, '../public/basketball_teams.csv'), 'utf8');
  
  // Parse
  const oddsGames = parseBasketballOdds(oddsMarkdown);
  const haslaData = parseHaslametrics(haslaMarkdown);
  const dratePreds = parseDRatings(drateMarkdown);
  
  console.log(`📊 OddsTrader: ${oddsGames.length} games`);
  console.log(`📊 Haslametrics: ${haslaData.games?.length || 0} games`);
  console.log(`📊 D-Ratings: ${dratePreds.length} predictions\n`);
  
  // Match
  const matchedGames = matchGamesWithCSV(oddsGames, haslaData, dratePreds, csvContent);
  
  console.log(`✅ Matched: ${matchedGames.length} games\n`);
  console.log(`❌ UNMATCHED: ${oddsGames.length - matchedGames.length} games\n`);
  
  // Find unmatched games
  const matchedGameIds = matchedGames.map(g => `${g.awayTeam}@${g.homeTeam}`);
  const unmatchedGames = oddsGames.filter(g => !matchedGameIds.includes(`${g.awayTeam}@${g.homeTeam}`));
  
  if (unmatchedGames.length > 0) {
    console.log('╔═══════════════════════════════════════════════════════════════════╗');
    console.log('║                    UNMATCHED GAMES                               ║');
    console.log('╚═══════════════════════════════════════════════════════════════════╝\n');
    
    for (const game of unmatchedGames) {
      console.log(`🔴 ${game.awayTeam} @ ${game.homeTeam}`);
      
      // Check if teams exist in CSV
      const csvLines = csvContent.split('\n');
      const awayInCSV = csvLines.some(line => line.toLowerCase().includes(game.awayTeam.toLowerCase()));
      const homeInCSV = csvLines.some(line => line.toLowerCase().includes(game.homeTeam.toLowerCase()));
      
      if (!awayInCSV) console.log(`   ❌ AWAY TEAM "${game.awayTeam}" NOT IN CSV`);
      if (!homeInCSV) console.log(`   ❌ HOME TEAM "${game.homeTeam}" NOT IN CSV`);
      
      // Check if in D-Ratings
      const awayInDratings = dratePreds.some(p => p.awayTeam?.toLowerCase().includes(game.awayTeam.toLowerCase().split(' ')[0]));
      const homeInDratings = dratePreds.some(p => p.homeTeam?.toLowerCase().includes(game.homeTeam.toLowerCase().split(' ')[0]));
      
      if (!awayInDratings) console.log(`   ⚠️  AWAY TEAM "${game.awayTeam}" NOT IN D-RATINGS`);
      if (!homeInDratings) console.log(`   ⚠️  HOME TEAM "${game.homeTeam}" NOT IN D-RATINGS`);
      
      console.log('');
    }
  }
  
  console.log('\n✅ Diagnostic complete!\n');
}

diagnose().catch(console.error);

