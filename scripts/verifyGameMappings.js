/**
 * Verify Game Mappings - Show exact CSV mappings for each game
 */

import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parseBasketballOdds } from '../src/utils/basketballOddsParser.js';
import { parseHaslametrics } from '../src/utils/haslametricsParser.js';
import { parseDRatings } from '../src/utils/dratingsParser.js';
import { loadTeamMappings, findTeamMapping } from '../src/utils/teamCSVLoader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function verifyGameMappings() {
  // Load data
  const oddsMarkdown = await readFile(join(__dirname, '../public/basketball_odds.md'), 'utf8');
  const haslaMarkdown = await readFile(join(__dirname, '../public/haslametrics.md'), 'utf8');
  const drateMarkdown = await readFile(join(__dirname, '../public/dratings.md'), 'utf8');
  const csvContent = await readFile(join(__dirname, '../public/basketball_teams.csv'), 'utf8');
  
  const oddsGames = parseBasketballOdds(oddsMarkdown);
  const haslaData = parseHaslametrics(haslaMarkdown);
  const dratePreds = parseDRatings(drateMarkdown);
  const teamMappings = loadTeamMappings(csvContent);
  
  // Build lookup maps  
  const haslaGameMap = new Map();
  haslaData.games.forEach(g => {
    const key = `${g.awayTeamRaw}@${g.homeTeamRaw}`;
    haslaGameMap.set(key, g);
  });
  
  const dratePredMap = new Map();
  dratePreds.forEach(p => {
    const key = `${p.awayTeam}@${p.homeTeam}`;
    dratePredMap.set(key, p);
  });
  
  console.log('\n🔍 GAME-BY-GAME MAPPING VERIFICATION\n');
  console.log(`Total Games: ${oddsGames.length}\n`);
  console.log('='.repeat(100) + '\n');
  
  for (let i = 0; i < oddsGames.length; i++) {
    const game = oddsGames[i];
    const gameNum = i + 1;
    
    console.log(`GAME ${gameNum}: ${game.awayTeam} @ ${game.homeTeam}`);
    console.log('-'.repeat(100));
    
    // Away team
    const awayMapping = findTeamMapping(teamMappings, game.awayTeam, 'oddstrader');
    console.log(`\n  AWAY: ${game.awayTeam}`);
    if (!awayMapping) {
      console.log(`    ❌ NOT IN CSV`);
    } else {
      console.log(`    CSV Haslametrics: "${awayMapping.haslametrics || '(empty)'}"`);
      console.log(`    CSV D-Ratings:    "${awayMapping.dratings || '(empty)'}"`);
    }
    
    // Home team
    const homeMapping = findTeamMapping(teamMappings, game.homeTeam, 'oddstrader');
    console.log(`\n  HOME: ${game.homeTeam}`);
    if (!homeMapping) {
      console.log(`    ❌ NOT IN CSV`);
    } else {
      console.log(`    CSV Haslametrics: "${homeMapping.haslametrics || '(empty)'}"`);
      console.log(`    CSV D-Ratings:    "${homeMapping.dratings || '(empty)'}"`);
    }
    
    // Check if this exact game exists in Haslametrics
    if (awayMapping && homeMapping && awayMapping.haslametrics && homeMapping.haslametrics) {
      const haslaKey = `${awayMapping.haslametrics}@${homeMapping.haslametrics}`;
      const haslaKeyReversed = `${homeMapping.haslametrics}@${awayMapping.haslametrics}`;
      const haslaGame = haslaGameMap.get(haslaKey) || haslaGameMap.get(haslaKeyReversed);
      if (haslaGame) {
        const isReversed = haslaGameMap.has(haslaKeyReversed);
        console.log(`\n  ✅ HASLAMETRICS MATCH: ${haslaGame.awayTeamRaw} @ ${haslaGame.homeTeamRaw}${isReversed ? ' (REVERSED)' : ''}`);
      } else {
        console.log(`\n  ❌ HASLAMETRICS: Game not found with these names`);
      }
    } else {
      console.log(`\n  ⚠️  HASLAMETRICS: Cannot check (missing CSV mappings)`);
    }
    
    // Check if this exact game exists in D-Ratings
    if (awayMapping && homeMapping && awayMapping.dratings && homeMapping.dratings) {
      const drateKey = `${awayMapping.dratings}@${homeMapping.dratings}`;
      const drateKeyReversed = `${homeMapping.dratings}@${awayMapping.dratings}`;
      const dratePred = dratePredMap.get(drateKey) || dratePredMap.get(drateKeyReversed);
      if (dratePred) {
        const isReversed = dratePredMap.has(drateKeyReversed);
        console.log(`  ✅ D-RATINGS MATCH: ${dratePred.awayTeam} @ ${dratePred.homeTeam}${isReversed ? ' (REVERSED)' : ''}`);
      } else {
        console.log(`  ❌ D-RATINGS: Game not found with these names`);
      }
    } else {
      console.log(`  ⚠️  D-RATINGS: Cannot check (missing CSV mappings)`);
    }
    
    console.log('\n' + '='.repeat(100) + '\n');
  }
}

verifyGameMappings().catch(console.error);

