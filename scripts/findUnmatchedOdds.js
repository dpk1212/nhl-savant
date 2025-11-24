/**
 * Find Unmatched OddsTrader Games
 * Shows which OddsTrader games are missing Haslametrics or D-Ratings matches
 */

import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parseBasketballOdds } from '../src/utils/basketballOddsParser.js';
import { parseHaslametrics } from '../src/utils/haslametricsParser.js';
import { parseDRatings } from '../src/utils/dratingsParser.js';
import { matchGames } from '../src/utils/gameMatching.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function findUnmatchedOdds() {
  console.log('\n🔍 FINDING UNMATCHED ODDSTRADER GAMES');
  console.log('==========================================\n');
  
  // Load data
  const oddsMarkdown = await readFile(join(__dirname, '../public/basketball_odds.md'), 'utf8');
  const haslaMarkdown = await readFile(join(__dirname, '../public/haslametrics.md'), 'utf8');
  const drateMarkdown = await readFile(join(__dirname, '../public/dratings.md'), 'utf8');
  
  // Parse
  const oddsGames = parseBasketballOdds(oddsMarkdown);
  const haslaData = parseHaslametrics(haslaMarkdown);
  const dratePreds = parseDRatings(drateMarkdown);
  
  console.log(`📊 Data loaded:`);
  console.log(`   - OddsTrader: ${oddsGames.length} games`);
  console.log(`   - Haslametrics: ${haslaData.games.length} games`);
  console.log(`   - D-Ratings: ${dratePreds.length} predictions\n`);
  
  // Check each OddsTrader game
  let fullMatches = 0;
  let haslaOnly = 0;
  let drateOnly = 0;
  let noMatches = 0;
  
  const unmatchedGames = [];
  
  oddsGames.forEach((oddsGame, index) => {
    // Try to find in Haslametrics
    const haslaMatch = haslaData.games.find(h =>
      h.awayTeam === oddsGame.awayTeam && h.homeTeam === oddsGame.homeTeam
    );
    
    // Try to find in D-Ratings
    const drateMatch = dratePreds.find(d =>
      d.awayTeam === oddsGame.awayTeam && d.homeTeam === oddsGame.homeTeam
    );
    
    const matchStatus = {
      gameNum: index + 1,
      awayTeam: oddsGame.awayTeam,
      homeTeam: oddsGame.homeTeam,
      gameTime: oddsGame.gameTime,
      hasHasla: !!haslaMatch,
      hasDRate: !!drateMatch,
      haslaRaw: haslaMatch ? `${haslaMatch.awayTeamRaw} @ ${haslaMatch.homeTeamRaw}` : null,
      drateRaw: drateMatch ? `${drateMatch.awayTeamRaw} @ ${drateMatch.homeTeamRaw}` : null
    };
    
    if (haslaMatch && drateMatch) {
      fullMatches++;
    } else if (haslaMatch) {
      haslaOnly++;
      unmatchedGames.push(matchStatus);
    } else if (drateMatch) {
      drateOnly++;
      unmatchedGames.push(matchStatus);
    } else {
      noMatches++;
      unmatchedGames.push(matchStatus);
    }
  });
  
  console.log('📈 MATCHING SUMMARY:');
  console.log('===================');
  console.log(`✅ Full matches (Hasla + DRate): ${fullMatches}/${oddsGames.length} (${(fullMatches/oddsGames.length*100).toFixed(1)}%)`);
  console.log(`🟡 Hasla only: ${haslaOnly}`);
  console.log(`🟠 DRate only: ${drateOnly}`);
  console.log(`❌ No matches: ${noMatches}`);
  console.log(`\n🎯 GOAL: ${oddsGames.length}/${oddsGames.length} full matches (100%)\n`);
  
  if (unmatchedGames.length > 0) {
    console.log('\n⚠️  GAMES NEEDING ATTENTION:');
    console.log('============================\n');
    
    unmatchedGames.forEach(game => {
      console.log(`Game ${game.gameNum}: ${game.awayTeam} @ ${game.homeTeam} (${game.gameTime})`);
      console.log(`  Haslametrics: ${game.hasHasla ? '✓ ' + game.haslaRaw : '❌ NOT FOUND'}`);
      console.log(`  D-Ratings: ${game.hasDRate ? '✓ ' + game.drateRaw : '❌ NOT FOUND'}`);
      
      if (!game.hasHasla) {
        console.log(`  → Need to map: "${game.awayTeam}" and "${game.homeTeam}" to Haslametrics names`);
      }
      if (!game.hasDRate) {
        console.log(`  → Need to map: "${game.awayTeam}" and "${game.homeTeam}" to D-Ratings names`);
      }
      console.log('');
    });
    
    console.log(`\n💡 ACTION: Update basketball_teams.csv with the correct mappings for these teams\n`);
  } else {
    console.log('\n🎉 ALL ODDSTRADER GAMES ARE FULLY MATCHED!\n');
  }
}

findUnmatchedOdds().catch(console.error);

