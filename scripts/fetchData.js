/**
 * Automated Data Fetcher using Firecrawl
 * Scrapes odds from OddsTrader and advanced goalie stats from MoneyPuck
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
    goalies: false,
    moneyPuckGoalies: false
  };
  
  const fetchTimestamp = new Date().toISOString();
  
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
    
    // 3. Fetch Starting Goalies from MoneyPuck Homepage
    console.log('🥅 Fetching starting goalies from MoneyPuck...');
    
    const moneyPuckResult = await firecrawl.scrape('https://moneypuck.com/index.html', {
      formats: ['markdown', 'html'],
      onlyMainContent: true,
      waitFor: 3000
    });
    
    console.log('   - Scraped MoneyPuck homepage');
    console.log(`   - Size: ${moneyPuckResult.markdown?.length || 0} characters`);
    
    // Parse starting goalies from MoneyPuck homepage
    const startingGoalies = parseMoneyPuckStartingGoalies(moneyPuckResult.markdown);
    console.log(`   - Parsed ${startingGoalies.length} games from MoneyPuck`);
    
    const goaliesData = {
      date: new Date().toISOString().split('T')[0],
      lastUpdated: fetchTimestamp,
      oddsLastUpdated: fetchTimestamp,
      games: startingGoalies
    };
    
    await fs.writeFile(
      join(__dirname, '../public/starting_goalies.json'),
      JSON.stringify(goaliesData, null, 2),
      'utf8'
    );
    
    console.log(`✅ Starting goalies saved`);
    console.log(`   - Goalies confirmed: ${countConfirmedGoalies(startingGoalies)}`);
    console.log(`   - File: public/starting_goalies.json\n`);
    results.goalies = true;
    
    // Summary
    console.log('========================================');
    console.log('✅ ALL DATA FETCHED SUCCESSFULLY!');
    console.log('========================================');
    console.log('\nUpdated files:');
    console.log('  ✓ public/odds_money.md');
    console.log('  ✓ public/odds_total.md');
    console.log('  ✓ public/starting_goalies.json (from MoneyPuck)');
    console.log(`\nGoalie Status: ${countConfirmedGoalies(startingGoalies)}`);
    console.log(`Odds Updated: ${new Date(fetchTimestamp).toLocaleString()}`);
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
 * Parse MoneyPuck homepage to extract starting goalies
 */
function parseMoneyPuckStartingGoalies(markdown) {
  const games = [];
  
  if (!markdown) {
    console.log('   ⚠️  Warning: No markdown content from MoneyPuck');
    return games;
  }
  
  const lines = markdown.split('\n');
  
  // Look for today's games section
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Match game format: "MTL @ CGY" or "MTL vs CGY"
    const gameMatch = line.match(/([A-Z]{3})\s*[@vs]\s*([A-Z]{3})/i);
    
    if (gameMatch) {
      const awayTeam = gameMatch[1].toUpperCase();
      const homeTeam = gameMatch[2].toUpperCase();
      
      // Look for goalie names in the next few lines
      let awayGoalie = null;
      let homeGoalie = null;
      
      // Check next 10 lines for goalie names (format varies)
      for (let j = i + 1; j < Math.min(i + 11, lines.length); j++) {
        const nextLine = lines[j];
        
        // Pattern: Full name (First Last)
        const nameMatch = nextLine.match(/([A-Z][a-z]+\s+[A-Z][a-z]+)/);
        if (nameMatch && !nextLine.match(/\d{1,2}:\d{2}\s*(AM|PM)/i)) { // Avoid time patterns
          if (!awayGoalie) {
            awayGoalie = nameMatch[1].trim();
          } else if (!homeGoalie) {
            homeGoalie = nameMatch[1].trim();
            break; // Found both
          }
        }
      }
      
      // Always add the game, even if goalies not confirmed yet
      games.push({
        matchup: `${awayTeam} @ ${homeTeam}`,
        away: {
          team: awayTeam,
          goalie: awayGoalie,
          confirmed: !!awayGoalie
        },
        home: {
          team: homeTeam,
          goalie: homeGoalie,
          confirmed: !!homeGoalie
        }
      });
    }
  }
  
  return games;
}

/**
 * Count confirmed goalies for display
 */
function countConfirmedGoalies(games) {
  if (!Array.isArray(games)) return '0/0 goalies confirmed';
  
  let confirmed = 0;
  let total = 0;
  
  games.forEach(game => {
    if (game.away?.confirmed) confirmed++;
    if (game.home?.confirmed) confirmed++;
    total += 2;
  });
  
  return `${confirmed}/${total} goalies confirmed`;
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

