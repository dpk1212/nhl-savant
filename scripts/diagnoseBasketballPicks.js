/**
 * Diagnose why only 7/12 games are generating picks
 * Shows which games are missing Haslametrics or D-Ratings data
 */

import fs from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { parseBasketballOdds } from '../src/utils/basketballOddsParser.js';
import { parseHaslametrics } from '../src/utils/haslametricsParser.js';
import { parseDRatings } from '../src/utils/dratingsParser.js';
import { matchGamesWithCSV } from '../src/utils/gameMatchingCSV.js';
import { BasketballEdgeCalculator } from '../src/utils/basketballEdgeCalculator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function diagnose() {
  console.log('\n🔍 DIAGNOSING BASKETBALL PICK GENERATION\n');
  console.log('═'.repeat(80));
  
  // Load data
  const oddsMarkdown = await fs.readFile(join(__dirname, '../public/basketball_odds.md'), 'utf8');
  const haslaMarkdown = await fs.readFile(join(__dirname, '../public/haslametrics.md'), 'utf8');
  const drateMarkdown = await fs.readFile(join(__dirname, '../public/dratings.md'), 'utf8');
  const csvContent = await fs.readFile(join(__dirname, '../public/basketball_teams.csv'), 'utf8');
  
  // Parse
  const oddsGames = parseBasketballOdds(oddsMarkdown);
  const haslaData = parseHaslametrics(haslaMarkdown);
  const dratePreds = parseDRatings(drateMarkdown);
  
  console.log(`📊 Data Loaded:`);
  console.log(`   OddsTrader:   ${oddsGames.length} games`);
  console.log(`   Haslametrics: ${haslaData.games?.length || 0} games`);
  console.log(`   D-Ratings:    ${dratePreds.length} predictions\n`);
  
  // Match games (pass empty object for Barttorvik data for diagnostic purposes)
  const matchedGames = matchGamesWithCSV(oddsGames, haslaData, dratePreds, {}, csvContent);
  console.log(`🔗 Matched:      ${matchedGames.length} games\n`);
  console.log('═'.repeat(80));
  
  // Try to calculate predictions for each game
  const calculator = new BasketballEdgeCalculator();
  let successCount = 0;
  let failCount = 0;
  
  matchedGames.forEach((game, i) => {
    console.log(`\n${i + 1}. ${game.awayTeam} @ ${game.homeTeam}`);
    
    // Check data availability
    const hasOdds = !!(game.odds?.awayOdds && game.odds?.homeOdds);
    const hasHasla = !!(game.haslametrics);
    const hasDRate = !!(game.dratings?.awayWinProb);
    
    console.log(`   ├─ Odds:        ${hasOdds ? '✅' : '❌'}`);
    console.log(`   ├─ Haslametrics: ${hasHasla ? '✅' : '❌'}`);
    console.log(`   └─ D-Ratings:   ${hasDRate ? '✅' : '❌'}`);
    
    // Try to calculate prediction
    const prediction = calculator.calculateEnsemblePrediction(game);
    
    if (prediction.error) {
      failCount++;
      console.log(`   ❌ FILTERED OUT: ${prediction.error}`);
    } else {
      successCount++;
      const winProb = (prediction.bestBet === 'away' ? prediction.ensembleAwayProb : prediction.ensembleHomeProb) * 100;
      console.log(`   ✅ VALID PICK: ${prediction.bestTeam} ${prediction.bestOdds > 0 ? '+' : ''}${prediction.bestOdds}`);
      console.log(`      ${winProb.toFixed(1)}% to win | ${prediction.bestEV > 0 ? '+' : ''}${prediction.bestEV.toFixed(1)}% EV | Grade: ${prediction.grade}`);
    }
  });
  
  console.log('\n' + '═'.repeat(80));
  console.log('SUMMARY');
  console.log('═'.repeat(80));
  console.log(`✅ Valid picks:  ${successCount}/${matchedGames.length}`);
  console.log(`❌ Filtered out: ${failCount}/${matchedGames.length}\n`);
  
  if (failCount > 0) {
    console.log('💡 SOLUTION:');
    console.log('   Games are filtered out when missing D-Ratings OR Haslametrics data.');
    console.log('   This is by design - the calculator requires BOTH sources for quality picks.');
    console.log('   Check the CSV mapping for the filtered games.\n');
  }
}

diagnose().catch(console.error);

