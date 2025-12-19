/**
 * DRatings NHL Predictions Fetcher
 * 
 * Fetches predictions from https://www.dratings.com/predictor/nhl-hockey-predictions/
 * Saves as markdown file with timestamp
 * 
 * Usage: node scripts/fetchDRatings.js
 */

import fetch from 'node-fetch';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DRATINGS_URL = 'https://www.dratings.com/predictor/nhl-hockey-predictions/';

async function fetchDRatings() {
  console.log('🏒 Fetching DRatings NHL predictions...');
  console.log(`📡 URL: ${DRATINGS_URL}`);
  
  try {
    // Fetch the page
    const response = await fetch(DRATINGS_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const html = await response.text();
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/:/g, '_');
    const filename = `www.dratings.com_predictor_nhl-hockey-predictions_.${timestamp}.md`;
    const filepath = join(__dirname, '../public', filename);
    
    // Save to file
    await fs.writeFile(filepath, html, 'utf8');
    
    console.log(`✅ Saved DRatings predictions to: ${filename}`);
    console.log(`📊 File size: ${(html.length / 1024).toFixed(2)} KB`);
    
    // Parse to count games
    const upcomingMatches = html.match(/Upcoming Games for/);
    if (upcomingMatches) {
      console.log(`🎯 Found upcoming games section`);
    }
    
    return {
      success: true,
      filename,
      filepath,
      size: html.length
    };
    
  } catch (error) {
    console.error('❌ Error fetching DRatings:', error.message);
    console.error(error.stack);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  fetchDRatings()
    .then(() => {
      console.log('\n✅ DRatings fetch complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ DRatings fetch failed!');
      process.exit(1);
    });
}

export { fetchDRatings };


