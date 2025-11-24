/**
 * Test CSV-Based Game Matching
 * Validates new matching approach using OddsTrader as base
 */

import { parseBasketballOdds } from '../src/utils/basketballOddsParser.js';
import { parseHaslametrics } from '../src/utils/haslametricsParser.js';
import { parseDRatings } from '../src/utils/dratingsParser.js';
import { matchGamesWithCSV, filterByQuality } from '../src/utils/gameMatchingCSV.js';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function testCSVMatching() {
  console.log('========================================');
  console.log('🧪 Testing CSV-Based Game Matching');
  console.log('========================================\n');
  
  try {
    // Load data files
    console.log('📂 Loading data files...');
    const oddsMarkdown = await readFile(
      join(__dirname, '../public/basketball_odds.md'),
      'utf8'
    );
    const haslaMarkdown = await readFile(
      join(__dirname, '../public/haslametrics.md'),
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
    
    // Parse each source
    console.log('🔍 Parsing data sources...');
    const oddsGames = parseBasketballOdds(oddsMarkdown);
    const haslaData = parseHaslametrics(haslaMarkdown);
    const dratePreds = parseDRatings(drateMarkdown);
    
    console.log(`✅ Parsed ${oddsGames.length} OddsTrader games`);
    console.log(`✅ Parsed ${haslaData.games.length} Haslametrics games`);
    console.log(`✅ Parsed ${dratePreds.length} D-Ratings predictions`);
    
    // Match using CSV
    const matchedGames = matchGamesWithCSV(
      oddsGames,
      haslaData,
      dratePreds,
      csvContent
    );
    
    // Filter by quality
    const highQuality = filterByQuality(matchedGames, 'HIGH');
    const mediumQuality = filterByQuality(matchedGames, 'MEDIUM');
    
    console.log('\n📊 QUALITY BREAKDOWN:');
    console.log(`   - HIGH (all 3 sources): ${highQuality.length}/${oddsGames.length} (${(highQuality.length/oddsGames.length*100).toFixed(1)}%)`);
    console.log(`   - MEDIUM+ (2+ sources): ${mediumQuality.length}/${oddsGames.length} (${(mediumQuality.length/oddsGames.length*100).toFixed(1)}%)`);
    
    // Show sample high-quality games
    console.log('\n✅ Sample HIGH QUALITY games (all 3 sources):');
    highQuality.slice(0, 5).forEach((game, i) => {
      console.log(`\n${i + 1}. ${game.awayTeam} @ ${game.homeTeam}`);
      console.log(`   Odds: Away ${game.odds.awayOdds} (${(game.odds.awayProb*100).toFixed(1)}%)`);
      if (game.dratings) {
        console.log(`   D-Ratings: Away ${(game.dratings.awayWinProb*100).toFixed(1)}% | Score: ${game.dratings.awayScore}-${game.dratings.homeScore}`);
      }
      if (game.haslametrics) {
        console.log(`   Haslametrics: Ratings ${game.haslametrics.awayRating} vs ${game.haslametrics.homeRating}`);
      }
    });
    
    // Show games missing data
    const lowQuality = matchedGames.filter(g => g.dataQuality === 'LOW');
    if (lowQuality.length > 0) {
      console.log(`\n\n⚠️  Games with MISSING data (${lowQuality.length}):`);
      lowQuality.forEach((game, i) => {
        const missing = [];
        if (!game.haslametrics) missing.push('Haslametrics');
        if (!game.dratings) missing.push('D-Ratings');
        console.log(`${i + 1}. ${game.awayTeam} @ ${game.homeTeam} - Missing: ${missing.join(', ')}`);
      });
    }
    
    // Show specific requested game: Michigan @ San Diego State
    console.log('\n\n🎯 MICHIGAN @ SAN DIEGO STATE (requested example):');
    const michiganGame = matchedGames.find(g => 
      g.awayTeam.includes('Michigan') && g.homeTeam.includes('San Diego')
    );
    
    if (michiganGame) {
      console.log(`✅ FOUND - Quality: ${michiganGame.dataQuality}`);
      console.log(`   Sources: ${michiganGame.sources.join(', ')}`);
      console.log(`   Odds: Away ${michiganGame.odds.awayOdds} → ${(michiganGame.odds.awayProb*100).toFixed(1)}%`);
      if (michiganGame.dratings) {
        console.log(`   D-Ratings: ${(michiganGame.dratings.awayWinProb*100).toFixed(1)}% away win | Score: ${michiganGame.dratings.awayScore}-${michiganGame.dratings.homeScore}`);
      } else {
        console.log(`   D-Ratings: ❌ MISSING`);
      }
      if (michiganGame.haslametrics) {
        console.log(`   Haslametrics: Ratings ${michiganGame.haslametrics.awayRating} vs ${michiganGame.haslametrics.homeRating}`);
      } else {
        console.log(`   Haslametrics: ❌ MISSING`);
      }
    } else {
      console.log(`❌ NOT FOUND in matched games`);
    }
    
    console.log('\n========================================');
    console.log(`✅ CSV-based matching: ${highQuality.length}/${oddsGames.length} full matches`);
    console.log('========================================\n');
    
    return {
      total: oddsGames.length,
      matched: matchedGames.length,
      highQuality: highQuality.length,
      mediumQuality: mediumQuality.length
    };
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error.stack);
    throw error;
  }
}

// Run test
testCSVMatching()
  .then(results => {
    console.log('\n🎉 Test completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n💥 Test failed!');
    process.exit(1);
  });

