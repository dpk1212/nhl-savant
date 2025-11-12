import Firecrawl from '@mendable/firecrawl-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
const PLAYER_PROPS_URL = 'https://www.oddstrader.com/nhl/player-props/?m=1694'; // m=1694 is "Player Total Goals"

/**
 * Scrape NHL player props from OddsTrader using Firecrawl
 */
async function fetchPlayerProps() {
  if (!FIRECRAWL_API_KEY) {
    console.error('❌ FIRECRAWL_API_KEY not found in .env file');
    process.exit(1);
  }

  console.log('🏒 Fetching NHL Player Props from OddsTrader...');
  console.log(`📍 URL: ${PLAYER_PROPS_URL}\n`);

  try {
    const firecrawl = new Firecrawl({ apiKey: FIRECRAWL_API_KEY });

    console.log('⏳ Scraping page with extended wait (this may take 60-90 seconds)...');
    console.log('   Note: Firecrawl actions to click "Load More" are not working in this API version');
    console.log('   Attempting to scrape with longer wait time...');
    
    // Scrape the player props page - Note: actions don't work reliably with Firecrawl
    // We'll get the first batch of players (~20) and work with that for now
    const scrapeResult = await firecrawl.scrape(PLAYER_PROPS_URL, {
      formats: ['markdown'],
      onlyMainContent: true,
      timeout: 300000, // 5 minute timeout
      waitFor: 5000 // Wait 5 seconds for page to fully load
    });

    console.log('📦 Scrape response received');
    console.log('   Has markdown:', !!scrapeResult?.markdown);
    console.log('   Markdown length:', scrapeResult?.markdown?.length || 0);

    if (!scrapeResult || !scrapeResult.markdown) {
      console.error('❌ Scrape failed. No markdown content received');
      throw new Error('Firecrawl scrape failed - no markdown content');
    }

    console.log('✅ Page scraped successfully');
    console.log('📄 Processing player props data...\n');

    // Parse the markdown content to extract player props
    const players = parsePlayerProps(scrapeResult.markdown);

    console.log(`\n✅ Found ${players.length} player props`);

    // Save to public/player_props.json
    const outputPath = path.join(__dirname, '../public/player_props.json');
    const output = {
      lastUpdated: new Date().toISOString(),
      source: 'OddsTrader',
      url: PLAYER_PROPS_URL,
      market: 'Player Total Goals',
      count: players.length,
      players: players
    };

    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    console.log(`\n💾 Saved to: ${outputPath}`);

    // Also save raw markdown for debugging
    const debugPath = path.join(__dirname, '../public/player_props_raw.md');
    fs.writeFileSync(debugPath, scrapeResult.markdown);
    console.log(`📝 Raw markdown saved to: ${debugPath}`);

    // Display sample
    console.log('\n📊 Sample Players:');
    players.slice(0, 5).forEach((player, i) => {
      console.log(`${i + 1}. ${player.name} (${player.team}) vs ${player.opponent}`);
      console.log(`   EV: ${player.otEV}% | Cover: ${player.otCoverProb}% | Odds: ${player.odds || 'N/A'}`);
    });

    console.log('\n✅ Player props fetch complete!');

  } catch (error) {
    console.error('❌ Error fetching player props:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    process.exit(1);
  }
}

/**
 * Parse player props from OddsTrader markdown content
 */
function parsePlayerProps(markdown) {
  const players = [];
  const lines = markdown.split('\n');
  let currentGame = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Track current game matchup
    if (line.includes('@ ') && (line.includes('PM') || line.includes('AM'))) {
      const gameMatch = line.match(/(\w+\s+\d+\/\d+\s+[\d:]+\s+[AP]M)([A-Z]{2,3})\s+@\s+([A-Z]{2,3})/);
      if (gameMatch) {
        currentGame = {
          time: gameMatch[1],
          away: gameMatch[2],
          home: gameMatch[3]
        };
      }
    }
    
    // Look for "Player Total Goals\\" - player name is attached
    if (line.includes('Player Total Goals') && line.includes('\\') && !line.startsWith('-')) {
      const playerName = line.replace('Player Total Goals', '').replace(/\\/g, '').trim();
      
      if (!playerName || !currentGame || playerName === 'Player Total Goals') {
        continue;
      }
      
      let ev = null;
      let coverProb = null;
      let odds = null;
      
      // Scan next 20 lines for EV, cover probability, and odds
      for (let j = i + 1; j < Math.min(i + 20, lines.length); j++) {
        let nextLine = lines[j].trim();
        
        // Skip empty lines and backslashes
        if (!nextLine || nextLine === '\\\\' || nextLine === '\\') continue;
        
        // Remove trailing backslashes
        nextLine = nextLine.replace(/\\+$/g, '').trim();
        if (!nextLine) continue;
        
        // EV percentage (e.g., "+14.9%" or "-3.2%")
        if (!ev && nextLine.match(/^[+-]\d+\.\d+%$/)) {
          ev = nextLine;
        }
        
        // Cover probability (e.g., "93%")
        else if (!coverProb && nextLine.match(/^\d{2,3}%$/)) {
          coverProb = nextLine;
        }
        
        // Odds (e.g., "u½(-360)")
        else if (!odds && nextLine.match(/^u[½\d]+\([^)]+\)$/)) {
          odds = nextLine;
          break; // We have everything we need
        }
      }
      
      if (ev && coverProb) {
        players.push({
          name: playerName,
          team: currentGame.away,
          opponent: currentGame.home,
          matchup: `${currentGame.away} @ ${currentGame.home}`,
          gameTime: currentGame.time,
          market: 'Player Total Goals',
          evPercent: parseFloat(ev.replace('%', '')),
          coverProbability: parseInt(coverProb.replace('%', '')),
          otEV: ev,
          otCoverProb: parseInt(coverProb.replace('%', '')),
          odds: odds || 'N/A'
        });
      }
    }
  }
  
  console.log(`   Parsed ${players.length} players from markdown`);
  
  return players;
}

// Run the scraper
fetchPlayerProps();

