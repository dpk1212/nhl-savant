/**
 * Haslametrics Matching Verification Script
 * Audits all 55 OddsTrader games to verify Haslametrics matching accuracy
 */

import { parseBasketballOdds } from '../src/utils/basketballOddsParser.js';
import { parseHaslametrics } from '../src/utils/haslametricsParser.js';
import { loadTeamMappings, findTeamMapping } from '../src/utils/teamCSVLoader.js';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function verifyHaslametricsMatching() {
  console.log('========================================');
  console.log('🔍 HASLAMETRICS MATCHING VERIFICATION');
  console.log('========================================\n');
  
  try {
    // Load data files
    console.log('📂 Loading data files...\n');
    const oddsMarkdown = await readFile(
      join(__dirname, '../public/basketball_odds.md'),
      'utf8'
    );
    const haslaMarkdown = await readFile(
      join(__dirname, '../public/haslametrics.md'),
      'utf8'
    );
    const csvContent = await readFile(
      join(__dirname, '../public/basketball_teams.csv'),
      'utf8'
    );
    
    // Parse data
    const oddsGames = parseBasketballOdds(oddsMarkdown);
    const haslaData = parseHaslametrics(haslaMarkdown);
    const teamMappings = loadTeamMappings(csvContent);
    
    console.log(`✅ Loaded ${oddsGames.length} OddsTrader games`);
    console.log(`✅ Loaded ${haslaData.games.length} Haslametrics games`);
    console.log(`✅ Loaded ${teamMappings.size} team mappings from CSV\n`);
    
    console.log('========================================');
    console.log('VERIFYING EACH GAME:');
    console.log('========================================\n');
    
    let matched = 0;
    let missing = 0;
    const missingGames = [];
    
    // Check each OddsTrader game
    for (let i = 0; i < oddsGames.length; i++) {
      const oddsGame = oddsGames[i];
      const gameNum = i + 1;
      
      console.log(`\n${gameNum}. ${oddsGame.awayTeam} @ ${oddsGame.homeTeam}`);
      console.log('   ' + '─'.repeat(60));
      
      // Look up teams in CSV
      const awayMapping = findTeamMapping(teamMappings, oddsGame.awayTeam, 'oddstrader');
      const homeMapping = findTeamMapping(teamMappings, oddsGame.homeTeam, 'oddstrader');
      
      if (!awayMapping || !homeMapping) {
        console.log('   ❌ CSV MAPPING MISSING');
        if (!awayMapping) console.log(`      - Away team "${oddsGame.awayTeam}" not in CSV`);
        if (!homeMapping) console.log(`      - Home team "${oddsGame.homeTeam}" not in CSV`);
        missing++;
        missingGames.push({
          game: `${oddsGame.awayTeam} @ ${oddsGame.homeTeam}`,
          reason: 'CSV mapping missing',
          awayTeam: oddsGame.awayTeam,
          homeTeam: oddsGame.homeTeam,
          awayInCSV: !!awayMapping,
          homeInCSV: !!homeMapping
        });
        continue;
      }
      
      console.log(`   📋 CSV Mapping:`);
      console.log(`      Away: "${oddsGame.awayTeam}" → Haslametrics: "${awayMapping.haslametrics}"`);
      console.log(`      Home: "${oddsGame.homeTeam}" → Haslametrics: "${homeMapping.haslametrics}"`);
      
      // Find in Haslametrics using CSV mapping
      if (!awayMapping.haslametrics || !homeMapping.haslametrics) {
        console.log(`   ❌ HASLAMETRICS NAME MISSING IN CSV`);
        if (!awayMapping.haslametrics) {
          console.log(`      - Away team needs Haslametrics name in CSV`);
        }
        if (!homeMapping.haslametrics) {
          console.log(`      - Home team needs Haslametrics name in CSV`);
        }
        missing++;
        missingGames.push({
          game: `${oddsGame.awayTeam} @ ${oddsGame.homeTeam}`,
          reason: 'Haslametrics name missing in CSV',
          needsAwayHasla: !awayMapping.haslametrics,
          needsHomeHasla: !homeMapping.haslametrics
        });
        continue;
      }
      
      const haslaGame = haslaData.games.find(game =>
        game.awayTeam === awayMapping.haslametrics && 
        game.homeTeam === homeMapping.haslametrics
      );
      
      if (haslaGame) {
        console.log(`   ✅ HASLAMETRICS FOUND!`);
        console.log(`      Away Rating: ${haslaGame.awayRating || 'N/A'}`);
        console.log(`      Home Rating: ${haslaGame.homeRating || 'N/A'}`);
        matched++;
      } else {
        // Try reversed
        const haslaReversed = haslaData.games.find(game =>
          game.awayTeam === homeMapping.haslametrics && 
          game.homeTeam === awayMapping.haslametrics
        );
        
        if (haslaReversed) {
          console.log(`   ⚠️  HASLAMETRICS FOUND (REVERSED HOME/AWAY)`);
          console.log(`      Haslametrics has: ${homeMapping.haslametrics} @ ${awayMapping.haslametrics}`);
          matched++;
        } else {
          console.log(`   ❌ HASLAMETRICS NOT FOUND`);
          console.log(`      Searched for: ${awayMapping.haslametrics} @ ${homeMapping.haslametrics}`);
          console.log(`      This game is not in Haslametrics data`);
          missing++;
          missingGames.push({
            game: `${oddsGame.awayTeam} @ ${oddsGame.homeTeam}`,
            reason: 'Not in Haslametrics data',
            expectedAway: awayMapping.haslametrics,
            expectedHome: homeMapping.haslametrics
          });
        }
      }
    }
    
    // Summary
    console.log('\n\n========================================');
    console.log('📊 VERIFICATION SUMMARY');
    console.log('========================================\n');
    
    console.log(`Total OddsTrader Games: ${oddsGames.length}`);
    console.log(`✅ Matched to Haslametrics: ${matched} (${(matched/oddsGames.length*100).toFixed(1)}%)`);
    console.log(`❌ Missing from Haslametrics: ${missing} (${(missing/oddsGames.length*100).toFixed(1)}%)`);
    
    if (missing > 0) {
      console.log('\n\n========================================');
      console.log('❌ MISSING GAMES DETAILS:');
      console.log('========================================\n');
      
      missingGames.forEach((mg, idx) => {
        console.log(`${idx + 1}. ${mg.game}`);
        console.log(`   Reason: ${mg.reason}`);
        if (mg.expectedAway) {
          console.log(`   Expected in Haslametrics: ${mg.expectedAway} @ ${mg.expectedHome}`);
        }
        if (mg.needsAwayHasla || mg.needsHomeHasla) {
          console.log(`   Needs CSV update for: ${mg.needsAwayHasla ? 'Away' : ''} ${mg.needsHomeHasla ? 'Home' : ''}`);
        }
        console.log('');
      });
      
      console.log('ACTION REQUIRED:');
      console.log('1. Run: npm run extract-hasla-teams');
      console.log('2. Match missing teams to Haslametrics names');
      console.log('3. Update basketball_teams.csv');
      console.log('4. Re-run this verification\n');
    } else {
      console.log('\n🎉 PERFECT! All games matched!\n');
    }
    
    return {
      total: oddsGames.length,
      matched: matched,
      missing: missing,
      missingGames: missingGames
    };
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error.stack);
    throw error;
  }
}

// Run verification
verifyHaslametricsMatching()
  .then(results => {
    console.log('✅ Verification completed successfully!\n');
    process.exit(results.missing > 0 ? 1 : 0);
  })
  .catch(error => {
    console.error('\n💥 Verification failed!');
    process.exit(1);
  });


