/**
 * Extract Basketball Results
 * 
 * Parses OddsTrader markdown for completed games (100%/0% markers)
 * Writes results to public/basketball_results.json
 * Website will read this file and grade bets client-side
 */

import { parseBasketballResults } from '../src/utils/basketballResultsParser.js';
import fs from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function extractBasketballResults() {
  console.log('\n🏀 EXTRACTING BASKETBALL RESULTS');
  console.log('==================================\n');
  
  try {
    // Load OddsTrader data
    console.log('📂 Loading OddsTrader data...');
    const oddsPath = join(__dirname, '../public/basketball_odds.md');
    const oddsMarkdown = await fs.readFile(oddsPath, 'utf8');
    console.log('✅ Loaded basketball_odds.md\n');
    
    // Parse results (ONLY completed games with 100%/0% markers)
    console.log('🔍 Parsing final scores...');
    const results = parseBasketballResults(oddsMarkdown);
    console.log(`✅ Found ${results.length} completed games\n`);
    
    // Write results to JSON file
    const resultsPath = join(__dirname, '../public/basketball_results.json');
    const output = {
      lastUpdated: new Date().toISOString(),
      count: results.length,
      results: results
    };
    
    await fs.writeFile(resultsPath, JSON.stringify(output, null, 2), 'utf8');
    console.log('✅ Wrote results to public/basketball_results.json\n');
    
    console.log('==================================');
    console.log(`✅ Extracted ${results.length} game results`);
    console.log('==================================\n');
    
    return results.length;
    
  } catch (error) {
    console.error('❌ Error extracting results:', error);
    throw error;
  }
}

// Run the function
extractBasketballResults()
  .then(() => {
    console.log('✅ Script completed successfully\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed!');
    process.exit(1);
  });

