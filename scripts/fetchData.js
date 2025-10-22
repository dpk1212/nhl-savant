/**
 * Automated Data Fetcher using Firecrawl
 * Scrapes odds from OddsTrader and goalies from RotoWire
 * 
 * Usage: npm run fetch-data
 */

import Firecrawl from '@mendable/firecrawl-js';
import fs from 'fs/promises';
import * as dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

const firecrawl = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY });

console.log('🔥 FIRECRAWL - Automated NHL Data Fetch');
console.log('========================================\n');

async function fetchAllData() {
  const results = {
    moneyline: false,
    totals: false,
    goalies: false
  };
  
  try {
    // 1. Fetch Moneyline Odds
    console.log('📊 Fetching moneyline odds from OddsTrader...');
    const moneylineResult = await firecrawl.scrape('https://www.oddstrader.com/nhl/?eid&g=game&m=money', {
      formats: ['markdown'],
      onlyMainContent: false, // Get full page content
      waitFor: 3000 // Wait for JavaScript to load odds
    });
    
    await fs.writeFile(
      join(__dirname, '../public/odds_money.md'),
      moneylineResult.markdown,
      'utf8'
    );
    
    console.log(`✅ Moneyline odds saved`);
    console.log(`   - Size: ${moneylineResult.markdown.length} characters`);
    console.log(`   - File: public/odds_money.md\n`);
    results.moneyline = true;
    
    // 2. Fetch Total Odds
    console.log('📊 Fetching total odds from OddsTrader...');
    const totalsResult = await firecrawl.scrape('https://www.oddstrader.com/nhl/?eid=0&g=game&m=total', {
      formats: ['markdown'],
      onlyMainContent: false,
      waitFor: 3000
    });
    
    await fs.writeFile(
      join(__dirname, '../public/odds_total.md'),
      totalsResult.markdown,
      'utf8'
    );
    
    console.log(`✅ Total odds saved`);
    console.log(`   - Size: ${totalsResult.markdown.length} characters`);
    console.log(`   - File: public/odds_total.md\n`);
    results.totals = true;
    
    // 3. Fetch Goalie Lineups using extract (AI-powered)
    console.log('🥅 Fetching starting goalies from RotoWire (using AI extraction)...');
    
    const goaliesResult = await firecrawl.extract({
      urls: ['https://www.rotowire.com/hockey/nhl-lineups.php'],
      prompt: `Extract today's NHL starting goalies. For each game, get:
      - Away team abbreviation (3 letters)
      - Home team abbreviation (3 letters)  
      - Starting goalie names for both teams
      - Game time
      Only include games with confirmed starting goalies.`,
      schema: {
        type: 'object',
        properties: {
          games: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                awayTeam: { type: 'string', description: 'Away team abbreviation' },
                homeTeam: { type: 'string', description: 'Home team abbreviation' },
                awayGoalie: { type: 'string', description: 'Away starting goalie full name' },
                homeGoalie: { type: 'string', description: 'Home starting goalie full name' },
                gameTime: { type: 'string', description: 'Game time' }
              },
              required: ['awayTeam', 'homeTeam', 'awayGoalie', 'homeGoalie']
            }
          }
        }
      }
    });
    
    console.log('   - Extracted data using AI...');
    
    // Convert extracted data to our format
    const goalieData = convertExtractedGoalies(goaliesResult.data);
    
    await fs.writeFile(
      join(__dirname, '../public/starting_goalies.json'),
      JSON.stringify(goalieData, null, 2),
      'utf8'
    );
    
    console.log(`✅ Starting goalies saved`);
    console.log(`   - Games found: ${goalieData.games.length}`);
    console.log(`   - File: public/starting_goalies.json\n`);
    results.goalies = true;
    
    // Summary
    console.log('========================================');
    console.log('✅ ALL DATA FETCHED SUCCESSFULLY!');
    console.log('========================================');
    console.log('\nUpdated files:');
    console.log('  ✓ public/odds_money.md');
    console.log('  ✓ public/odds_total.md');
    console.log('  ✓ public/starting_goalies.json');
    console.log('\nNext steps:');
    console.log('  1. Review the files to ensure data looks good');
    console.log('  2. git add public/*.md public/*.json');
    console.log('  3. git commit -m "Auto-update: Odds and goalies"');
    console.log('  4. git push && npm run deploy\n');
    
    return results;
  } catch (error) {
    console.error('\n❌ ERROR FETCHING DATA:');
    console.error('========================');
    console.error(error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    console.error('\nPartial results:', results);
    throw error;
  }
}

/**
 * Convert extracted goalie data from Firecrawl to our format
 */
function convertExtractedGoalies(extractedData) {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  
  const goalieData = {
    date: dateStr,
    lastUpdated: new Date().toISOString(),
    games: []
  };
  
  if (!extractedData || !extractedData.games || !Array.isArray(extractedData.games)) {
    console.log('   ⚠️  Warning: No games found in extracted data');
    return goalieData;
  }
  
  extractedData.games.forEach((game, index) => {
    if (game.awayTeam && game.homeTeam && game.awayGoalie && game.homeGoalie) {
      goalieData.games.push({
        gameId: `game_${index}`,
        matchup: `${game.awayTeam.toUpperCase()} @ ${game.homeTeam.toUpperCase()}`,
        time: game.gameTime || "TBD",
        away: {
          team: game.awayTeam.toUpperCase(),
          goalie: game.awayGoalie
        },
        home: {
          team: game.homeTeam.toUpperCase(),
          goalie: game.homeGoalie
        }
      });
    }
  });
  
  console.log(`   - Converted ${goalieData.games.length} complete games`);
  
  return goalieData;
}

// Validate that we got actual data
function validateData(markdown, type) {
  if (!markdown || markdown.length < 500) {
    throw new Error(`${type} data seems too short - may have failed to load`);
  }
  
  if (type === 'odds' && !markdown.includes('NHL')) {
    throw new Error('Odds data doesn\'t contain "NHL" - format may have changed');
  }
  
  return true;
}

// Run the scraper
fetchAllData()
  .then(() => {
    console.log('🎉 Data fetch completed successfully!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Data fetch failed!');
    console.error('Please check the error above and try again.\n');
    process.exit(1);
  });

