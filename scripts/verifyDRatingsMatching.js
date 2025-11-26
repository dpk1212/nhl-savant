/**
 * D-Ratings Matching Verification Script
 * Audits all 55 OddsTrader games to verify D-Ratings matching accuracy
 */

import { parseBasketballOdds } from '../src/utils/basketballOddsParser.js';
import { parseDRatings } from '../src/utils/dratingsParser.js';
import { loadTeamMappings, findTeamMapping } from '../src/utils/teamCSVLoader.js';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function verifyDRatingsMatching() {
  console.log('========================================');
  console.log('🔍 D-RATINGS MATCHING VERIFICATION');
  console.log('========================================\n');
  
  try {
    // Load data files
    console.log('📂 Loading data files...\n');
    const oddsMarkdown = await readFile(
      join(__dirname, '../public/basketball_odds.md'),
      'utf8'
    );
    const drateMarkdown = await readFile(
      join(__dirname, '../public/dratings.md'),
      'utf8'
    );
    const csvContent = await readFile(
      join(__dirname, '../public/basketball_teams.csv'),
      'utf8'
    );
    
    // Parse data
    const oddsGames = parseBasketballOdds(oddsMarkdown);
    const dratePreds = parseDRatings(drateMarkdown);
    const teamMappings = loadTeamMappings(csvContent);
    
    console.log(`✅ Loaded ${oddsGames.length} OddsTrader games`);
    console.log(`✅ Loaded ${dratePreds.length} D-Ratings predictions`);
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
      console.log(`      Away: "${oddsGame.awayTeam}" → D-Ratings: "${awayMapping.dratings}"`);
      console.log(`      Home: "${oddsGame.homeTeam}" → D-Ratings: "${homeMapping.dratings}"`);
      
      // Find in D-Ratings using CSV mapping
      const dratePred = dratePreds.find(pred =>
        pred.awayTeam === awayMapping.dratings && 
        pred.homeTeam === homeMapping.dratings
      );
      
      if (dratePred) {
        console.log(`   ✅ D-RATINGS FOUND!`);
        console.log(`      Away Win: ${(dratePred.awayWinProb * 100).toFixed(1)}%`);
        console.log(`      Home Win: ${(dratePred.homeWinProb * 100).toFixed(1)}%`);
        console.log(`      Predicted Score: ${dratePred.awayScore} - ${dratePred.homeScore}`);
        matched++;
      } else {
        // Try reversed
        const drateReversed = dratePreds.find(pred =>
          pred.awayTeam === homeMapping.dratings && 
          pred.homeTeam === awayMapping.dratings
        );
        
        if (drateReversed) {
          console.log(`   ⚠️  D-RATINGS FOUND (REVERSED HOME/AWAY)`);
          console.log(`      D-Ratings has: ${homeMapping.dratings} @ ${awayMapping.dratings}`);
          console.log(`      Away Win: ${(drateReversed.homeWinProb * 100).toFixed(1)}%`);
          console.log(`      Home Win: ${(drateReversed.awayWinProb * 100).toFixed(1)}%`);
          matched++;
        } else {
          console.log(`   ❌ D-RATINGS NOT FOUND`);
          console.log(`      Searched for: ${awayMapping.dratings} @ ${homeMapping.dratings}`);
          console.log(`      This game is not in D-Ratings predictions`);
          missing++;
          missingGames.push({
            game: `${oddsGame.awayTeam} @ ${oddsGame.homeTeam}`,
            reason: 'Not in D-Ratings predictions',
            expectedAway: awayMapping.dratings,
            expectedHome: homeMapping.dratings
          });
        }
      }
    }
    
    // Summary
    console.log('\n\n========================================');
    console.log('📊 VERIFICATION SUMMARY');
    console.log('========================================\n');
    
    console.log(`Total OddsTrader Games: ${oddsGames.length}`);
    console.log(`✅ Matched to D-Ratings: ${matched} (${(matched/oddsGames.length*100).toFixed(1)}%)`);
    console.log(`❌ Missing from D-Ratings: ${missing} (${(missing/oddsGames.length*100).toFixed(1)}%)`);
    
    if (missing > 0) {
      console.log('\n\n========================================');
      console.log('❌ MISSING GAMES DETAILS:');
      console.log('========================================\n');
      
      missingGames.forEach((mg, idx) => {
        console.log(`${idx + 1}. ${mg.game}`);
        console.log(`   Reason: ${mg.reason}`);
        if (mg.expectedAway) {
          console.log(`   Expected in D-Ratings: ${mg.expectedAway} @ ${mg.expectedHome}`);
        }
        console.log('');
      });
      
      console.log('ACTION REQUIRED:');
      console.log('1. Check if these games exist in D-Ratings data');
      console.log('2. Update basketball_teams.csv with correct D-Ratings names');
      console.log('3. Re-run: npm run build-csv');
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
verifyDRatingsMatching()
  .then(results => {
    console.log('✅ Verification completed successfully!\n');
    process.exit(results.missing > 0 ? 1 : 0);
  })
  .catch(error => {
    console.error('\n💥 Verification failed!');
    process.exit(1);
  });


