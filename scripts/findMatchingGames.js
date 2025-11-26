/**
 * Find which games exist in BOTH OddsTrader AND Haslametrics today
 */

import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parseBasketballOdds } from '../src/utils/basketballOddsParser.js';
import { parseHaslametrics } from '../src/utils/haslametricsParser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function findMatchingGames() {
  // Load data
  const oddsMarkdown = await readFile(join(__dirname, '../public/basketball_odds.md'), 'utf8');
  const haslaMarkdown = await readFile(join(__dirname, '../public/haslametrics.md'), 'utf8');
  
  // Parse
  const oddsGames = parseBasketballOdds(oddsMarkdown);
  const haslaData = parseHaslametrics(haslaMarkdown);
  
  console.log(`\nODDSTRADER GAMES: ${oddsGames.length}`);
  console.log(`HASLAMETRICS GAMES: ${haslaData.games.length}\n`);
  
  console.log('FINDING MATCHING GAMES:\n');
  console.log('==========================================\n');
  
  let matchCount = 0;
  
  oddsGames.forEach((oddsGame, i) => {
    // Look for this matchup in Haslametrics
    const oddsAway = oddsGame.awayTeam;
    const oddsHome = oddsGame.homeTeam;
    
    // Check if both teams appear in ANY Haslametrics game
    const haslaMatch = haslaData.games.find(haslaGame => {
      const haslaAway = haslaGame.awayTeamRaw;
      const haslaHome = haslaGame.homeTeamRaw;
      
      // Check normal order
      const normMatch = 
        normalize(oddsAway).includes(normalize(haslaAway).substring(0,5)) &&
        normalize(oddsHome).includes(normalize(haslaHome).substring(0,5));
      
      const revMatch =
        normalize(oddsAway).includes(normalize(haslaHome).substring(0,5)) &&
        normalize(oddsHome).includes(normalize(haslaAway).substring(0,5));
      
      return normMatch || revMatch;
    });
    
    if (haslaMatch) {
      matchCount++;
      console.log(`✅ GAME ${i+1}: ${oddsAway} @ ${oddsHome}`);
      console.log(`   Hasla: ${haslaMatch.awayTeamRaw} @ ${haslaMatch.homeTeamRaw}`);
      console.log(`   → NEEDS CSV MAPPING\n`);
    }
  });
  
  console.log(`\n📊 GAMES IN BOTH SOURCES: ${matchCount}/${oddsGames.length}`);
  console.log(`\nTHESE ${matchCount} GAMES NEED CSV MAPPINGS TO WORK!\n`);
}

findMatchingGames()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

