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
    
    // 3. Fetch Advanced Goalie Stats from MoneyPuck
    console.log('🥅 Fetching advanced goalie stats from MoneyPuck...');
    
    const moneyPuckResult = await firecrawl.scrape('https://moneypuck.com/goalies.htm', {
      formats: ['markdown', 'html'],
      onlyMainContent: true,
      waitFor: 3000
    });
    
    console.log('   - Scraped MoneyPuck goalie data');
    console.log(`   - Size: ${moneyPuckResult.markdown?.length || 0} characters\n`);
    
    // Load existing starting_goalies.json (from admin selections)
    let startingGoalies;
    try {
      const goalieFileContent = await fs.readFile(
        join(__dirname, '../public/starting_goalies.json'),
        'utf8'
      );
      startingGoalies = JSON.parse(goalieFileContent);
      console.log(`   - Loaded existing goalie selections: ${startingGoalies.games?.length || 0} games`);
    } catch (error) {
      // If file doesn't exist, create empty structure
      console.log('   - No existing goalie file found, creating new one');
      startingGoalies = {
        date: new Date().toISOString().split('T')[0],
        lastUpdated: fetchTimestamp,
        games: []
      };
    }
    
    // Enrich with MoneyPuck stats
    const enrichedGoalies = enrichGoaliesWithMoneyPuck(startingGoalies, moneyPuckResult.markdown);
    enrichedGoalies.lastUpdated = fetchTimestamp;
    enrichedGoalies.oddsLastUpdated = fetchTimestamp;
    
    await fs.writeFile(
      join(__dirname, '../public/starting_goalies.json'),
      JSON.stringify(enrichedGoalies, null, 2),
      'utf8'
    );
    
    console.log(`✅ Advanced goalie stats merged with starting goalies`);
    console.log(`   - Goalies confirmed: ${countConfirmedGoalies(enrichedGoalies)}`);
    console.log(`   - File: public/starting_goalies.json\n`);
    results.goalies = true;
    results.moneyPuckGoalies = true;
    
    // Summary
    console.log('========================================');
    console.log('✅ ALL DATA FETCHED SUCCESSFULLY!');
    console.log('========================================');
    console.log('\nUpdated files:');
    console.log('  ✓ public/odds_money.md');
    console.log('  ✓ public/odds_total.md');
    console.log('  ✓ public/starting_goalies.json (with MoneyPuck stats)');
    console.log(`\nGoalie Status: ${countConfirmedGoalies(enrichedGoalies)}`);
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
 * Enrich starting goalies with MoneyPuck advanced stats
 */
function enrichGoaliesWithMoneyPuck(startingGoalies, moneyPuckMarkdown) {
  if (!startingGoalies || !startingGoalies.games) {
    console.log('   ⚠️  Warning: No games in starting_goalies.json');
    return startingGoalies;
  }
  
  console.log('   - Parsing MoneyPuck data...');
  
  // Parse MoneyPuck markdown to extract goalie stats
  // MoneyPuck format: Name | Team | GP | GSAE | Sv% | HD Sv% | etc.
  const goalieStats = parseMoneyPuckGoalies(moneyPuckMarkdown);
  
  console.log(`   - Found ${goalieStats.size} goalies in MoneyPuck data`);
  
  // Enrich each game's goalies
  startingGoalies.games = startingGoalies.games.map(game => {
    const awayGoalieName = game.away?.goalie;
    const homeGoalieName = game.home?.goalie;
    
    const awayStats = awayGoalieName ? goalieStats.get(awayGoalieName.toLowerCase()) : null;
    const homeStats = homeGoalieName ? goalieStats.get(homeGoalieName.toLowerCase()) : null;
    
    return {
      ...game,
      away: {
        ...game.away,
        confirmed: !!game.away?.goalie,
        stats: awayStats || null
      },
      home: {
        ...game.home,
        confirmed: !!game.home?.goalie,
        stats: homeStats || null
      }
    };
  });
  
  return startingGoalies;
}

/**
 * Parse MoneyPuck markdown to extract goalie stats
 */
function parseMoneyPuckGoalies(markdown) {
  const goalieMap = new Map();
  
  if (!markdown) return goalieMap;
  
  // Split by lines and look for goalie data
  const lines = markdown.split('\n');
  
  for (const line of lines) {
    // Look for patterns like: "Igor Shesterkin NYR 15 +12.5 .925 .850"
    // This is a simplified parser - adjust based on actual MoneyPuck format
    const match = line.match(/([A-Z][a-z]+ [A-Z][a-z]+)\s+([A-Z]{2,3})\s+(\d+)\s+([\+\-]?\d+\.?\d*)\s+(\.\d+)\s+(\.\d+)/);
    
    if (match) {
      const [, name, team, gp, gsae, svPct, hdSvPct] = match;
      
      goalieMap.set(name.toLowerCase(), {
        name,
        team,
        gamesPlayed: parseInt(gp),
        gsae: parseFloat(gsae),
        savePct: (parseFloat(svPct) * 100).toFixed(1),
        hdSavePct: (parseFloat(hdSvPct) * 100).toFixed(1),
        recentForm: parseFloat(gsae) > 5 ? 'Hot' : parseFloat(gsae) < -3 ? 'Cold' : 'Average'
      });
    }
  }
  
  return goalieMap;
}

/**
 * Count confirmed goalies for display
 */
function countConfirmedGoalies(goalieData) {
  if (!goalieData || !goalieData.games) return '0/0 goalies confirmed';
  
  let totalGames = goalieData.games.length;
  let confirmedCount = 0;
  
  goalieData.games.forEach(game => {
    if (game.away?.confirmed) confirmedCount++;
    if (game.home?.confirmed) confirmedCount++;
  });
  
  return `${confirmedCount}/${totalGames * 2} goalies confirmed`;
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

