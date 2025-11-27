/**
 * Automated College Basketball Data Fetcher using Firecrawl
 * Scrapes odds and analytics from multiple CBB sources
 * 
 * Usage: npm run fetch-basketball
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

const firecrawl = new Firecrawl({ 
  apiKey: process.env.FIRECRAWL_API_KEY
});

console.log('🏀 FIRECRAWL - College Basketball Data Fetch');
console.log('============================================\n');

/**
 * Retry helper function with exponential backoff
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

async function fetchBasketballData() {
  const results = {
    odds: false,
    haslametrics: false,
    dratings: false
  };
  
  const fetchTimestamp = new Date().toISOString();
  
  try {
    const cacheBuster = Date.now();
    
    // 1. Fetch CBB Odds from OddsTrader
    console.log('📊 Fetching NCAAB odds from OddsTrader...');
    console.log('   ⏳ Timeout set to 5 minutes');
    const oddsResult = await retryWithBackoff(async () => {
      return await firecrawl.scrape(
        `https://www.oddstrader.com/ncaa-college-basketball/?eid=0&g=game&m=money&_=${cacheBuster}`,
        {
          formats: ['markdown'],
          onlyMainContent: true,
          waitFor: 3000,
          timeout: 300000, // 5 minute timeout
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        }
      );
    });
    
    await fs.writeFile(
      join(__dirname, '../public/basketball_odds.md'),
      oddsResult.markdown,
      'utf8'
    );
    
    console.log(`✅ Basketball odds saved`);
    console.log(`   - Size: ${oddsResult.markdown.length} characters`);
    console.log(`   - File: public/basketball_odds.md\n`);
    results.odds = true;
    
    // 2. Fetch Haslametrics Ratings
    console.log('📈 Fetching Haslametrics team ratings...');
    console.log('   ⏳ Timeout set to 5 minutes');
    const haslametricsResult = await retryWithBackoff(async () => {
      return await firecrawl.scrape(
        `https://haslametrics.com/?_=${cacheBuster}`,
        {
          formats: ['markdown'],
          onlyMainContent: true,
          waitFor: 2000,
          timeout: 300000,
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        }
      );
    });
    
    await fs.writeFile(
      join(__dirname, '../public/haslametrics.md'),
      haslametricsResult.markdown,
      'utf8'
    );
    
    console.log(`✅ Haslametrics ratings saved`);
    console.log(`   - Size: ${haslametricsResult.markdown.length} characters`);
    console.log(`   - File: public/haslametrics.md\n`);
    results.haslametrics = true;
    
    // 3. Fetch D-Ratings Predictions
    console.log('🎯 Fetching D-Ratings predictions...');
    console.log('   ⏳ Timeout set to 5 minutes');
    const dratingsResult = await retryWithBackoff(async () => {
      return await firecrawl.scrape(
        `https://www.dratings.com/predictor/ncaa-basketball-predictions/?_=${cacheBuster}`,
        {
          formats: ['markdown'],
          onlyMainContent: true,
          waitFor: 2000,
          timeout: 300000,
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        }
      );
    });
    
    await fs.writeFile(
      join(__dirname, '../public/dratings.md'),
      dratingsResult.markdown,
      'utf8'
    );
    
    console.log(`✅ D-Ratings predictions saved`);
    console.log(`   - Size: ${dratingsResult.markdown.length} characters`);
    console.log(`   - File: public/dratings.md\n`);
    results.dratings = true;
    
    // Summary
    console.log('============================================');
    console.log('✅ ALL CBB DATA FETCHED SUCCESSFULLY!');
    console.log('============================================');
    console.log('\nUpdated files:');
    console.log('  ✓ public/basketball_odds.md (OddsTrader)');
    console.log('  ✓ public/haslametrics.md (Team Ratings)');
    console.log('  ✓ public/dratings.md (Predictions)');
    console.log(`\nFetch completed: ${new Date(fetchTimestamp).toLocaleString()}`);
    console.log('\nNext steps:');
    console.log('  1. Review files to ensure data looks good');
    console.log('  2. git add public/basketball_*.md public/haslametrics.md public/dratings.md');
    console.log('  3. git commit -m "Update CBB data $(date +%Y-%m-%d)"');
    console.log('  4. git push && npm run deploy\n');
    
    return results;
    
  } catch (error) {
    console.error('\n❌ ERROR FETCHING CBB DATA:');
    console.error('==============================');
    console.error(error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    console.error('\nPartial results:', results);
    throw error;
  }
}

// Run the scraper
fetchBasketballData()
  .then(() => {
    console.log('🎉 CBB data fetch completed successfully!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 CBB data fetch failed!');
    console.error('Please check the error above and try again.\n');
    process.exit(1);
  });


