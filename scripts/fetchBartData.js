/**
 * Barttorvik Data Fetcher
 * Scrapes T-Rank ratings and Shooting Splits (PBP) from barttorvik.com
 * Saves to public/Bart.md and public/bart_pbp.md
 * 
 * Usage: node scripts/fetchBartData.js
 */

import Firecrawl from '@mendable/firecrawl-js';
import fs from 'fs/promises';
import * as dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const firecrawl = new Firecrawl({ 
  apiKey: process.env.FIRECRAWL_API_KEY
});

const YEAR = new Date().getFullYear();

console.log('🏀 BARTTORVIK DATA FETCH');
console.log('========================\n');

async function retryWithBackoff(fn, retries = 3, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      const isLastAttempt = i === retries - 1;
      if (isLastAttempt) throw error;
      console.log(`   ⚠️  Attempt ${i + 1} failed: ${error.message}`);
      console.log(`   ⏳ Retrying in ${delay / 1000}s...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
}

async function fetchBartData() {
  const results = { trank: false, pbp: false };
  const cacheBuster = Date.now();

  try {
    // 1. Fetch T-Rank ratings
    console.log(`📊 Fetching Barttorvik T-Rank ratings (${YEAR})...`);
    console.log('   ⏳ Timeout set to 5 minutes');
    const trankResult = await retryWithBackoff(async () => {
      return await firecrawl.scrape(
        `https://barttorvik.com/trank.php?year=${YEAR}&_=${cacheBuster}`,
        {
          formats: ['markdown'],
          onlyMainContent: true,
          waitFor: 3000,
          timeout: 300000,
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        }
      );
    });

    await fs.writeFile(
      join(__dirname, '../public/Bart.md'),
      trankResult.markdown,
      'utf8'
    );

    console.log(`✅ T-Rank data saved`);
    console.log(`   - Size: ${trankResult.markdown.length} characters`);
    console.log(`   - File: public/Bart.md\n`);
    results.trank = true;

    // Brief pause between scrapes
    console.log('   ⏳ Waiting 5s before next scrape...\n');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 2. Fetch Shooting Splits (PBP)
    console.log(`🎯 Fetching Barttorvik Shooting Splits / PBP (${YEAR})...`);
    console.log('   ⏳ Timeout set to 5 minutes');
    const pbpResult = await retryWithBackoff(async () => {
      return await firecrawl.scrape(
        `https://barttorvik.com/teampbp.php?year=${YEAR}&sort=1&_=${cacheBuster}`,
        {
          formats: ['markdown'],
          onlyMainContent: true,
          waitFor: 3000,
          timeout: 300000,
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        }
      );
    });

    await fs.writeFile(
      join(__dirname, '../public/bart_pbp.md'),
      pbpResult.markdown,
      'utf8'
    );

    console.log(`✅ Shooting Splits data saved`);
    console.log(`   - Size: ${pbpResult.markdown.length} characters`);
    console.log(`   - File: public/bart_pbp.md\n`);
    results.pbp = true;

    // Summary
    console.log('========================');
    console.log('✅ BARTTORVIK DATA FETCH COMPLETE');
    console.log('========================');
    console.log('\nUpdated files:');
    console.log('  ✓ public/Bart.md (T-Rank ratings)');
    console.log('  ✓ public/bart_pbp.md (Shooting Splits / PBP)');
    console.log(`\nFetch completed: ${new Date().toLocaleString()}\n`);

    return results;

  } catch (error) {
    console.error('\n❌ ERROR FETCHING BARTTORVIK DATA:');
    console.error('==============================');
    console.error(error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
    }
    console.error('\nPartial results:', results);
    throw error;
  }
}

fetchBartData()
  .then(() => {
    console.log('🎉 Barttorvik data fetch completed!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Barttorvik data fetch failed!');
    console.error(error.message);
    process.exit(1);
  });
