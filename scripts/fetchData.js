/**
 * Automated Data Fetcher using Firecrawl
 * Scrapes odds from OddsTrader and advanced goalie stats from MoneyPuck
 * 
 * Usage: npm run fetch-data
 */

import Firecrawl from '@mendable/firecrawl-js';
import fs from 'fs/promises';
import { readFileSync } from 'fs';
import * as dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

const firecrawl = new Firecrawl({ 
  apiKey: process.env.FIRECRAWL_API_KEY
});

console.log('🔥 FIRECRAWL - Automated NHL Data Fetch');
console.log('========================================\n');

/**
 * Retry helper function for flaky API calls
 */
async function retryWithBackoff(fn, retries = 3, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      const isLastAttempt = i === retries - 1;
      if (isLastAttempt) throw error;
      
      console.log(`   ⚠️  Attempt ${i + 1} failed: ${error.message}`);
      console.log(`   ⏳ Retrying in ${delay / 1000}s...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
}

async function fetchAllData() {
  const results = {
    moneyline: false,
    goalies: false,
    moneyPuckGoalies: false
  };
  
  const fetchTimestamp = new Date().toISOString();
  
  try {
    // Add cache-busting to get fresh data
    const cacheBuster = Date.now();
    
    // 1. Fetch Moneyline Odds (with retry logic)
    console.log('📊 Fetching moneyline odds from OddsTrader...');
    console.log('   ⏳ Timeout set to 5 minutes (Firecrawl may be slow)');
    const moneylineResult = await retryWithBackoff(async () => {
      return await firecrawl.scrape(`https://www.oddstrader.com/nhl/?eid&g=game&m=money&_=${cacheBuster}`, {
        formats: ['markdown'],
        onlyMainContent: false, // Get full page content
        waitFor: 2000,
        timeout: 300000, // 5 minute timeout - Firecrawl experiencing delays
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
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
    
    // 2. Fetch Starting Goalies from MoneyPuck Homepage (with retry logic)
    console.log('🥅 Fetching starting goalies from MoneyPuck...');
    console.log('   ⏳ Timeout set to 5 minutes (Firecrawl may be slow)');
    
    // Reuse cache-busting timestamp from above
    const moneyPuckResult = await retryWithBackoff(async () => {
      return await firecrawl.scrape(`https://moneypuck.com/index.html?_=${cacheBuster}`, {
        formats: ['markdown', 'html'],
        onlyMainContent: true,
        waitFor: 2000,
        timeout: 300000, // 5 minute timeout - Firecrawl experiencing delays
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
    });
    
    console.log('   - Scraped MoneyPuck homepage');
    console.log(`   - Size: ${moneyPuckResult.markdown?.length || 0} characters`);
    
    // Parse starting goalies AND predictions from MoneyPuck homepage
    const scrapedGoalies = parseMoneyPuckStartingGoalies(moneyPuckResult.markdown);
    console.log(`   - Parsed ${scrapedGoalies.length} games from MoneyPuck scrape`);
    
    // Parse MoneyPuck win probability predictions for model calibration
    const moneyPuckPredictions = parseMoneyPuckPredictions(moneyPuckResult.markdown);
    console.log(`   - Parsed ${moneyPuckPredictions.length} MoneyPuck predictions`);
    
    // VALIDATE: Filter to only today's scheduled games
    const scheduledGames = getTodaysScheduledGames();
    console.log(`   - Schedule shows ${scheduledGames.length} games today`);
    
    const startingGoalies = scrapedGoalies.filter(game => {
      const awayTeam = game.matchup.split(' @ ')[0];
      const homeTeam = game.matchup.split(' @ ')[1];
      
      return scheduledGames.some(sg => 
        sg.awayTeam === awayTeam && sg.homeTeam === homeTeam
      );
    });
    
    if (startingGoalies.length < scrapedGoalies.length) {
      console.log(`   ⚠️  Filtered out ${scrapedGoalies.length - startingGoalies.length} games (not scheduled today)`);
    }
    
    console.log(`   ✅ ${startingGoalies.length} games match today's schedule`);
    
    // CRITICAL: Don't overwrite with empty data!
    if (startingGoalies.length === 0) {
      console.log('   ⚠️  WARNING: No games found in MoneyPuck scrape');
      console.log('   ⚠️  Keeping existing starting_goalies.json file');
      console.log('   ⚠️  Manual update may be required\n');
      results.goalies = false;
    } else {
      // CRITICAL FIX: Use ET date (import at top would fail in Node.js, so inline)
      const etDateStr = new Date().toLocaleString('en-US', {
        timeZone: 'America/New_York',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      const [month, day, year] = etDateStr.split('/');
      const etDate = `${year}-${month}-${day}`;
      
      const goaliesData = {
        date: etDate,
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
    }
    
    // 3. Save MoneyPuck predictions for model calibration
    console.log('🎯 Saving MoneyPuck predictions for model calibration...');
    if (moneyPuckPredictions.length === 0) {
      console.log('   ⚠️  WARNING: No predictions found in MoneyPuck scrape');
      console.log('   ⚠️  Keeping existing moneypuck_predictions.json file');
      results.moneyPuckPredictions = false;
    } else {
      await fs.writeFile(
        join(__dirname, '../public/moneypuck_predictions.json'),
        JSON.stringify(moneyPuckPredictions, null, 2),
        'utf8'
      );
      
      console.log(`✅ MoneyPuck predictions saved`);
      console.log(`   - Predictions: ${moneyPuckPredictions.length} games`);
      console.log(`   - File: public/moneypuck_predictions.json\n`);
      results.moneyPuckPredictions = true;
    }
    
    // Summary
    console.log('========================================');
    console.log('✅ ALL DATA FETCHED SUCCESSFULLY!');
    console.log('========================================');
    console.log('\nUpdated files:');
    console.log('  ✓ public/odds_money.md');
    console.log('  ✓ public/starting_goalies.json (from MoneyPuck)');
    console.log('  ✓ public/moneypuck_predictions.json (for calibration)');
    console.log(`\nGoalie Status: ${countConfirmedGoalies(startingGoalies)}`);
    console.log(`MoneyPuck Predictions: ${moneyPuckPredictions.length} games`);
    console.log(`Odds Updated: ${new Date(fetchTimestamp).toLocaleString()}`);
    console.log('\nNext steps:');
    console.log('  1. Review the files to ensure data looks good');
    console.log('  2. git add public/*.md public/*.json');
    console.log('  3. git commit -m "Auto-update: Odds, goalies, and MoneyPuck predictions"');
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
 * Get today's scheduled games from CSV to validate scrape results
 */
function getTodaysScheduledGames() {
  try {
    const schedulePath = join(__dirname, '../public/nhl-202526-asplayed.csv');
    const scheduleData = readFileSync(schedulePath, 'utf-8');
    const lines = scheduleData.trim().split('\n');
    
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const year = today.getFullYear();
    const todayStr = `${month}/${day}/${year}`;
    
    const teamMap = {
      'Anaheim Ducks': 'ANA', 'Boston Bruins': 'BOS', 'Buffalo Sabres': 'BUF',
      'Calgary Flames': 'CGY', 'Carolina Hurricanes': 'CAR', 'Chicago Blackhawks': 'CHI',
      'Colorado Avalanche': 'COL', 'Columbus Blue Jackets': 'CBJ', 'Dallas Stars': 'DAL',
      'Detroit Red Wings': 'DET', 'Edmonton Oilers': 'EDM', 'Florida Panthers': 'FLA',
      'Los Angeles Kings': 'LAK', 'Minnesota Wild': 'MIN', 'Montreal Canadiens': 'MTL',
      'Nashville Predators': 'NSH', 'New Jersey Devils': 'NJD', 'New York Islanders': 'NYI',
      'New York Rangers': 'NYR', 'Ottawa Senators': 'OTT', 'Philadelphia Flyers': 'PHI',
      'Pittsburgh Penguins': 'PIT', 'San Jose Sharks': 'SJS', 'Seattle Kraken': 'SEA',
      'St. Louis Blues': 'STL', 'Tampa Bay Lightning': 'TBL', 'Toronto Maple Leafs': 'TOR',
      'Utah Mammoth': 'UTA', 'Vancouver Canucks': 'VAN', 'Vegas Golden Knights': 'VGK',
      'Washington Capitals': 'WSH', 'Winnipeg Jets': 'WPG'
    };
    
    const games = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;
      
      const values = line.split(',');
      const gameDate = values[0]?.trim();
      
      if (gameDate === todayStr) {
        const awayTeam = teamMap[values[3]?.trim()];
        const homeTeam = teamMap[values[5]?.trim()];
        
        if (awayTeam && homeTeam) {
          games.push({ awayTeam, homeTeam });
        }
      }
    }
    
    return games;
  } catch (error) {
    console.log('   ⚠️  Could not load schedule:', error.message);
    return [];
  }
}

/**
 * Parse MoneyPuck homepage to extract starting goalies
 * 
 * Format from MoneyPuck:
 * | ## 42.6%<br>### **[Starter: Gustavsson** | ![MINNESOTA WILD](logo) | ### 7:00 PM ET | ![NEW JERSEY DEVILS](logo) | ## 57.4%<br>### **[Starter: Daws** |
 */
/**
 * Parse MoneyPuck win probability predictions for model calibration
 * Extracts "Chance of Winning: XX.X%" from MoneyPuck homepage
 */
function parseMoneyPuckPredictions(markdown) {
  const games = [];
  
  if (!markdown) {
    console.log('   ⚠️  Warning: No markdown content from MoneyPuck for predictions');
    return games;
  }
  
  const lines = markdown.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Look for game rows with win probabilities
    // Pattern: "### Chance of Winning:<br>## 50.2%"
    if (line.includes('Chance of Winning') && line.includes('##')) {
      try {
        // Extract ALL team logos using matchAll (same approach as goalie parser)
        // MoneyPuck format: | AWAY% | AWAY_LOGO | TIME | HOME_LOGO | HOME% |
        const teamMatches = [...line.matchAll(/logos\/([A-Z]{2,3})\.png/g)];
        
        // Validate we have exactly 2 teams (away and home)
        if (teamMatches.length < 2) {
          console.log(`   ⚠️  Found ${teamMatches.length} teams on line ${i}, expected 2 - skipping`);
          continue;
        }
        
        const awayTeam = teamMatches[0][1];  // First logo = away team
        const homeTeam = teamMatches[1][1];  // Second logo = home team
        
        // Extract ALL probability percentages
        const probMatches = [...line.matchAll(/##\s*(\d+(?:\.\d+)?)%/g)];
        
        if (probMatches.length < 2) {
          console.log(`   ⚠️  Found ${probMatches.length} probabilities on line ${i}, expected 2 - skipping`);
          continue;
        }
        
        const awayProb = parseFloat(probMatches[0][1]) / 100;  // First % = away
        const homeProb = parseFloat(probMatches[1][1]) / 100;  // Second % = home
        
        // Validate probabilities sum to ~100% (accounting for rounding)
        const totalProb = awayProb + homeProb;
        if (totalProb < 0.95 || totalProb > 1.05) {
          console.log(`   ⚠️ Invalid probabilities for ${awayTeam} @ ${homeTeam}: ${(totalProb * 100).toFixed(1)}%`);
          continue;
        }
        
        // Skip if we already have this game (prevents duplicates)
        const isDuplicate = games.some(g => 
          g.awayTeam === awayTeam && g.homeTeam === homeTeam
        );
        if (isDuplicate) {
          continue;
        }
        
        games.push({
          awayTeam: awayTeam,
          homeTeam: homeTeam,
          awayProb: awayProb,
          homeProb: homeProb,
          source: 'MoneyPuck',
          scrapedAt: Date.now()
        });
        
        // Validation logging for debugging
        console.log(`   🎯 Parsed: ${awayTeam} (${(awayProb * 100).toFixed(1)}%) @ ${homeTeam} (${(homeProb * 100).toFixed(1)}%)`);
        
      } catch (error) {
        console.error(`   ❌ Error parsing prediction at line ${i}:`, error.message);
      }
    }
  }
  
  return games;
}

function parseMoneyPuckStartingGoalies(markdown) {
  const games = [];
  
  if (!markdown) {
    console.log('   ⚠️  Warning: No markdown content from MoneyPuck');
    return games;
  }
  
  const lines = markdown.split('\n');
  
  // Look for lines with game data (contain PM ET and team logos)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if line contains game time and team logos
    if (line.includes('PM ET') && line.includes('](http://peter-tanner.com/moneypuck/logos/')) {
      // Extract team codes from logo URLs
      const teamMatches = [...line.matchAll(/logos\/([A-Z]{2,3})\.png/g)];
      
      if (teamMatches.length >= 2) {
        const awayTeam = teamMatches[0][1];
        const homeTeam = teamMatches[1][1];
        
        // CRITICAL FIX: Determine which team each goalie belongs to based on position
        // MoneyPuck format: | AWAY% | AWAY_LOGO | TIME | HOME_LOGO | HOME% |
        // Goalies appear in the percentage column (1 or 5), not in order
        
        let awayGoalie = null;
        let homeGoalie = null;
        
        // Find all "Starter:" mentions with their positions
        const starterRegex = /Starter:\s*([A-Za-z\-\'\s]+?)\\?\*\*/g;
        let match;
        
        while ((match = starterRegex.exec(line)) !== null) {
          const goalieName = match[1].trim();
          const position = match.index;
          
          // Find position of away team logo
          const awayLogoPos = line.indexOf(`logos/${awayTeam}.png`);
          // Find position of home team logo  
          const homeLogoPos = line.indexOf(`logos/${homeTeam}.png`);
          
          // If goalie mention comes BEFORE away logo, it's the away goalie
          // If goalie mention comes AFTER home logo, it's the home goalie
          if (position < awayLogoPos) {
            awayGoalie = goalieName;
          } else if (position > homeLogoPos) {
            homeGoalie = goalieName;
          }
        }
        
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
        
        console.log(`   - Found game: ${awayTeam} @ ${homeTeam} (${awayGoalie || 'TBD'} vs ${homeGoalie || 'TBD'})`);
      }
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

