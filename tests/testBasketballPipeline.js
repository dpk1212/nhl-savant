/**
 * Basketball Data Pipeline End-to-End Test
 * Tests complete flow from data files to recommendations
 * 
 * Usage: node tests/testBasketballPipeline.js
 */

import fs from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { parseBasketballOdds } from '../src/utils/basketballOddsParser.js';
import { parseHaslametrics } from '../src/utils/haslametricsParser.js';
import { parseDRatings } from '../src/utils/dratingsParser.js';
import { matchGames } from '../src/utils/gameMatching.js';
import { BasketballEdgeCalculator } from '../src/utils/basketballEdgeCalculator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function testBasketballPipeline() {
  console.log('\n🏀 BASKETBALL DATA PIPELINE TEST');
  console.log('=====================================\n');
  
  try {
    // Step 1: Load data files
    console.log('📂 Step 1: Loading data files...');
    const oddsMarkdown = await fs.readFile(
      join(__dirname, '../public/basketball_odds.md'),
      'utf8'
    );
    const haslaMarkdown = await fs.readFile(
      join(__dirname, '../public/haslametrics.md'),
      'utf8'
    );
    const drateMarkdown = await fs.readFile(
      join(__dirname, '../public/dratings.md'),
      'utf8'
    );
    console.log('✅ Data files loaded successfully\n');
    
    // Step 2: Parse each source
    console.log('📊 Step 2: Parsing data sources...');
    const oddsGames = parseBasketballOdds(oddsMarkdown);
    const haslaData = parseHaslametrics(haslaMarkdown); // Returns { games, teams }
    const dratePreds = parseDRatings(drateMarkdown);
    console.log('');
    
    // Step 3: Match games (Haslametrics as base)
    console.log('🔗 Step 3: Matching games across sources (Haslametrics as base)...');
    const matchedGames = matchGames(oddsGames, haslaData, dratePreds);
    console.log('');
    
    // Step 4: Calculate edges and predictions
    console.log('📈 Step 4: Calculating ensemble predictions...');
    const calculator = new BasketballEdgeCalculator();
    const gamesWithPredictions = calculator.processGames(matchedGames);
    console.log(`✅ Processed ${gamesWithPredictions.length} games\n`);
    
    // Step 5: Filter recommendations
    console.log('⭐ Step 5: Filtering quality recommendations...');
    const recommendations = calculator.filterRecommendations(gamesWithPredictions, 'B+');
    console.log(`✅ Found ${recommendations.length} quality bets (B+ or higher)\n`);
    
    // Step 6: Display results
    console.log('=====================================');
    console.log('🎯 TOP RECOMMENDATIONS');
    console.log('=====================================\n');
    
    recommendations.slice(0, 10).forEach((game, index) => {
      const pred = game.prediction;
      console.log(`${index + 1}. ${pred.grade} | ${game.matchup}`);
      console.log(`   Bet: ${pred.bestTeam} (${pred.bestOdds > 0 ? '+' : ''}${pred.bestOdds})`);
      console.log(`   Edge: ${pred.bestEdge >= 0 ? '+' : ''}${(pred.bestEdge * 100).toFixed(1)}% | EV: ${pred.bestEV >= 0 ? '+' : ''}${pred.bestEV.toFixed(1)}%`);
      console.log(`   Model: ${(pred.bestBet === 'away' ? pred.ensembleAwayProb : pred.ensembleHomeProb) * 100}% | Market: ${(pred.bestBet === 'away' ? pred.marketAwayProb : pred.marketHomeProb) * 100}%`);
      console.log(`   Confidence: ${pred.confidence} | Data: ${game.dataQuality}`);
      console.log('');
    });
    
    // Step 7: Statistics
    console.log('=====================================');
    console.log('📊 PIPELINE STATISTICS');
    console.log('=====================================\n');
    
    console.log(`Total games found: ${oddsGames.length}`);
    console.log(`Games with predictions: ${gamesWithPredictions.length}`);
    console.log(`Match rate: ${((matchedGames.length / oddsGames.length) * 100).toFixed(1)}%\n`);
    
    console.log('Grade Distribution:');
    const gradeCount = {};
    gamesWithPredictions.forEach(g => {
      const grade = g.prediction?.grade || 'N/A';
      gradeCount[grade] = (gradeCount[grade] || 0) + 1;
    });
    Object.entries(gradeCount).sort().forEach(([grade, count]) => {
      console.log(`  ${grade}: ${count}`);
    });
    console.log('');
    
    console.log('Data Quality Distribution:');
    const qualityCount = {};
    matchedGames.forEach(g => {
      qualityCount[g.dataQuality] = (qualityCount[g.dataQuality] || 0) + 1;
    });
    Object.entries(qualityCount).sort().forEach(([quality, count]) => {
      console.log(`  ${quality}: ${count}`);
    });
    console.log('');
    
    console.log('Confidence Distribution:');
    const confCount = {};
    gamesWithPredictions.forEach(g => {
      const conf = g.prediction?.confidence || 'UNKNOWN';
      confCount[conf] = (confCount[conf] || 0) + 1;
    });
    Object.entries(confCount).sort().forEach(([conf, count]) => {
      console.log(`  ${conf}: ${count}`);
    });
    console.log('');
    
    // Step 8: Validation
    console.log('=====================================');
    console.log('✅ VALIDATION RESULTS');
    console.log('=====================================\n');
    
    const validationResults = {
      parsersWork: oddsGames.length > 0 && Object.keys(haslaData.teams).length > 0 && dratePreds.length > 0,
      matchingWorks: matchedGames.length > 0,
      ensembleWorks: gamesWithPredictions.filter(g => g.prediction && !g.prediction.error).length > 0,
      gradesAssigned: gamesWithPredictions.filter(g => g.prediction?.grade && g.prediction.grade !== 'N/A').length > 0,
      recommendationsExist: recommendations.length > 0,
      noErrors: !gamesWithPredictions.some(g => g.prediction?.error)
    };
    
    Object.entries(validationResults).forEach(([test, passed]) => {
      console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASS' : 'FAIL'}`);
    });
    
    const allPassed = Object.values(validationResults).every(v => v);
    
    console.log('\n=====================================');
    if (allPassed) {
      console.log('✅ ALL TESTS PASSED!');
      console.log('Pipeline is ready for production use.');
    } else {
      console.log('❌ SOME TESTS FAILED');
      console.log('Review errors above before deploying.');
    }
    console.log('=====================================\n');
    
    return allPassed;
    
  } catch (error) {
    console.error('\n❌ PIPELINE TEST FAILED');
    console.error('=======================');
    console.error(error);
    console.error('\nStack trace:');
    console.error(error.stack);
    return false;
  }
}

// Run the test
testBasketballPipeline()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

