/**
 * Fetch Starting Goalies using Perplexity AI
 * 
 * Replaces unreliable web scraping with AI-powered multi-source aggregation
 * Sources: DailyFaceoff, beat reporters, team announcements
 * 
 * Usage: npm run fetch-goalies
 */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { fetchStartingGoalies } from '../src/services/perplexityService.js';
import { writeFileSync } from 'fs';
import * as dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

console.log('🥅 PERPLEXITY - NHL Starting Goalies Fetch');
console.log('==========================================\n');

// Initialize Firebase (required for Perplexity service)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fetchAndSaveGoalies() {
  try {
    // Get today's date or custom date from args
    const targetDate = process.argv[2] || new Date().toISOString().split('T')[0];
    
    console.log(`📅 Fetching starting goalies for ${targetDate}\n`);
    
    // Fetch goalies using Perplexity AI
    const goaliesData = await fetchStartingGoalies(targetDate);
    
    if (!goaliesData) {
      console.error('\n❌ Failed to fetch goalie data');
      console.error('   - Check that Perplexity API key is in Firebase Secrets collection');
      console.error('   - Verify internet connection');
      console.error('   - Check API rate limits\n');
      process.exit(1);
    }
    
    // Display results
    console.log('\n📊 GOALIE DATA RETRIEVED');
    console.log('='.repeat(60));
    console.log(`Date:         ${goaliesData.date}`);
    console.log(`Source:       ${goaliesData.source}`);
    console.log(`Games Found:  ${goaliesData.games.length}`);
    console.log(`Last Updated: ${goaliesData.lastUpdated}\n`);
    
    // List all games and goalies
    goaliesData.games.forEach((game, idx) => {
      console.log(`Game ${idx + 1}: ${game.matchup}`);
      console.log(`  Away: ${game.away.goalie || 'TBD'}`);
      console.log(`  Home: ${game.home.goalie || 'TBD'}\n`);
    });
    
    // Count confirmed goalies
    let confirmedCount = 0;
    let totalCount = goaliesData.games.length * 2;
    goaliesData.games.forEach(game => {
      if (game.away.goalie) confirmedCount++;
      if (game.home.goalie) confirmedCount++;
    });
    
    console.log('='.repeat(60));
    console.log(`✅ ${confirmedCount}/${totalCount} goalies confirmed`);
    
    // Save to file
    const outputPath = join(__dirname, '../public/starting_goalies.json');
    writeFileSync(
      outputPath,
      JSON.stringify(goaliesData, null, 2),
      'utf-8'
    );
    
    console.log(`\n💾 Saved to: public/starting_goalies.json`);
    console.log('\n✅ SUCCESS - Goalie data updated!\n');
    
    // Show next steps
    console.log('📝 Next Steps:');
    console.log('   1. Run predictions to see goalie adjustments in action');
    console.log('   2. Check console for goalie GSAE adjustments');
    console.log('   3. Elite goalies will reduce opponent scoring');
    console.log('   4. Weak goalies will increase opponent scoring\n');
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('\nStack trace:');
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the fetch
fetchAndSaveGoalies().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});

