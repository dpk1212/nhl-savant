/**
 * Basketball Bet Writing Script
 * 
 * Runs via GitHub Actions after fetching basketball data
 * Processes all quality bets (2%+ EV) and writes to Firebase
 * 
 * Usage: npm run write-basketball-bets
 */

import { BasketballBetTracker } from '../src/firebase/basketballBetTracker.js';
import { parseBasketballOdds } from '../src/utils/basketballOddsParser.js';
import { parseHaslametrics } from '../src/utils/haslametricsParser.js';
import { parseDRatings } from '../src/utils/dratingsParser.js';
import { matchGamesWithCSV } from '../src/utils/gameMatchingCSV.js';
import { BasketballEdgeCalculator } from '../src/utils/basketballEdgeCalculator.js';
import fs from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function writeBasketballBets() {
  console.log('\n🏀 BASKETBALL BET WRITING SCRIPT');
  console.log('================================\n');
  
  try {
    // 1. Load scraped data files
    console.log('📂 Loading data files...');
    const oddsMarkdown = await fs.readFile(join(__dirname, '../public/basketball_odds.md'), 'utf8');
    const haslaMarkdown = await fs.readFile(join(__dirname, '../public/haslametrics.md'), 'utf8');
    const drateMarkdown = await fs.readFile(join(__dirname, '../public/dratings.md'), 'utf8');
    const csvContent = await fs.readFile(join(__dirname, '../public/basketball_teams.csv'), 'utf8');
    
    console.log('✅ Loaded scraped data files');
    
    // 2. Parse data from each source
    console.log('\n🔍 Parsing data from sources...');
    const oddsGames = parseBasketballOdds(oddsMarkdown);
    const haslaData = parseHaslametrics(haslaMarkdown);
    const dratePreds = parseDRatings(drateMarkdown);
    
    console.log(`   📊 OddsTrader: ${oddsGames.length} games`);
    console.log(`   📊 Haslametrics: ${haslaData.games?.length || 0} games`);
    console.log(`   📊 D-Ratings: ${dratePreds.length} predictions`);
    
    // 3. Match games across sources using CSV mappings
    console.log('\n🔗 Matching games across sources...');
    const matchedGames = matchGamesWithCSV(oddsGames, haslaData, dratePreds, csvContent);
    console.log(`   ✅ Matched ${matchedGames.length} games`);
    
    // 4. Calculate ensemble predictions (80% D-Ratings, 20% Haslametrics)
    console.log('\n🧮 Calculating ensemble predictions...');
    const calculator = new BasketballEdgeCalculator();
    const gamesWithPredictions = matchedGames.map(game => {
      const prediction = calculator.calculateEnsemblePrediction(game);
      return { ...game, prediction };
    });
    
    // 5. Filter for quality bets (2%+ EV, no errors)
    const qualityBets = gamesWithPredictions.filter(game => 
      game.prediction && !game.prediction.error && game.prediction.bestEV >= 2.0
    );
    
    console.log(`\n🎯 Found ${qualityBets.length} quality bets (2%+ EV):`);
    qualityBets.forEach((game, i) => {
      const pred = game.prediction;
      console.log(`   ${i + 1}. ${game.awayTeam} @ ${game.homeTeam}`);
      console.log(`      Pick: ${pred.bestTeam} ${pred.bestOdds > 0 ? '+' : ''}${pred.bestOdds}`);
      console.log(`      Edge: +${pred.bestEV.toFixed(1)}% | Grade: ${pred.grade} | ${pred.confidence}`);
    });
    
    if (qualityBets.length === 0) {
      console.log('\n⚠️  No quality bets found today. Nothing to write to Firebase.');
      console.log('================================\n');
      return 0;
    }
    
    // 6. Write bets to Firebase
    console.log('\n💾 Writing bets to Firebase (basketball_bets collection)...');
    const tracker = new BasketballBetTracker();
    let savedCount = 0;
    let errorCount = 0;
    
    for (const game of qualityBets) {
      try {
        await tracker.saveBet(game, game.prediction);
        savedCount++;
      } catch (error) {
        console.error(`   ❌ Failed to save: ${game.awayTeam} @ ${game.homeTeam}`);
        console.error(`      Error: ${error.message}`);
        errorCount++;
      }
    }
    
    console.log(`\n✅ Successfully saved ${savedCount}/${qualityBets.length} bets to Firebase`);
    if (errorCount > 0) {
      console.log(`⚠️  Failed to save ${errorCount} bets (see errors above)`);
    }
    console.log('================================\n');
    
    return savedCount;
    
  } catch (error) {
    console.error('\n❌ FATAL ERROR:', error);
    console.error('\nStack trace:', error.stack);
    console.error('\n================================\n');
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  writeBasketballBets()
    .then((count) => {
      console.log(`🎉 Script completed successfully! Saved ${count} bets.\n`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed!');
      process.exit(1);
    });
}

export { writeBasketballBets };

