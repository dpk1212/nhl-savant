/**
 * Update Bookmark Results - GitHub Action Script
 * 
 * PURPOSE:
 * - Runs daily at 8 AM ET (after overnight games finish)
 * - Fetches all bookmarks from yesterday and today
 * - Matches bookmarks with bet results from Firebase
 * - Updates bookmark documents with outcomes and profit
 * - Ensures all users see updated "My Picks" results
 * 
 * USAGE:
 * - Scheduled: GitHub Actions runs automatically daily
 * - Manual: npm run update-bookmarks
 * - Local: node scripts/updateBookmarkResults.js
 * 
 * REQUIREMENTS:
 * - Firebase credentials (VITE_FIREBASE_*)
 */

import admin from 'firebase-admin';
import { getETDate } from '../src/utils/dateUtils.js';

// Initialize Firebase Admin SDK
const serviceAccount = {
  project_id: process.env.VITE_FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
};

// Validate credentials
if (!serviceAccount.project_id || !serviceAccount.client_email || !serviceAccount.private_key) {
  console.error('❌ Missing Firebase credentials');
  process.exit(1);
}

console.log(`✅ Service account loaded: ${serviceAccount.client_email}`);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

/**
 * Get date range for bookmarks to update (yesterday and today)
 */
function getDateRange() {
  const today = getETDate(); // e.g., "2024-11-06"
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  return { yesterday: yesterdayStr, today };
}

/**
 * Fetch all bookmarks from the last 2 days that don't have results yet
 */
async function getPendingBookmarks(yesterday, today) {
  try {
    console.log('📚 Fetching pending bookmarks...');
    
    // Get all bookmarks from yesterday and today
    const bookmarksSnapshot = await db.collection('user_bookmarks').get();
    
    const pendingBookmarks = [];
    
    for (const doc of bookmarksSnapshot.docs) {
      const bookmark = doc.data();
      const gameDate = bookmark.game?.gameDate;
      
      // Only process bookmarks from yesterday or today
      if (gameDate === yesterday || gameDate === today) {
        // Skip if already has result
        if (!bookmark.result) {
          pendingBookmarks.push({
            docId: doc.id,
            ...bookmark
          });
        }
      }
    }
    
    console.log(`   Found ${pendingBookmarks.length} pending bookmarks`);
    return pendingBookmarks;
  } catch (error) {
    console.error('❌ Error fetching bookmarks:', error);
    return [];
  }
}

/**
 * Fetch all bet results from Firebase for matching
 */
async function getBetResults() {
  try {
    console.log('🎲 Fetching bet results from Firebase...');
    
    const betsSnapshot = await db.collection('bets')
      .orderBy('timestamp', 'desc')
      .limit(200) // Get recent bets (should cover last 2 days)
      .get();
    
    const betResults = [];
    
    for (const doc of betsSnapshot.docs) {
      const bet = doc.data();
      
      // Only include bets with results
      if (bet.result && bet.result.outcome) {
        betResults.push({
          docId: doc.id,
          ...bet
        });
      }
    }
    
    console.log(`   Found ${betResults.length} bet results`);
    
    // DEBUG: Log sample of available games
    if (betResults.length > 0) {
      console.log('\n📋 Available bet results (sample):');
      const uniqueGames = [...new Set(betResults.map(b => `${b.awayTeam} @ ${b.homeTeam}`))];
      uniqueGames.slice(0, 10).forEach(game => console.log(`   - ${game}`));
      if (uniqueGames.length > 10) console.log(`   ... and ${uniqueGames.length - 10} more games`);
    }
    
    return betResults;
  } catch (error) {
    console.error('❌ Error fetching bet results:', error);
    return [];
  }
}

/**
 * Match a bookmark with its corresponding bet result
 * Uses multiple matching strategies for robustness
 */
function matchBookmarkToBet(bookmark, betResults) {
  // Strategy 1: Match by betId (most reliable if available)
  if (bookmark.betId) {
    const matchById = betResults.find(bet => 
      bet.betId === bookmark.betId
    );
    if (matchById) return matchById;
  }
  
  // Strategy 2: Match by game + pick + market
  const match = betResults.find(bet => {
    // Match game (home and away teams)
    const sameGame = 
      bet.homeTeam === bookmark.game.homeTeam &&
      bet.awayTeam === bookmark.game.awayTeam;
    
    if (!sameGame) return false;
    
    // Match market (MONEYLINE, TOTAL, etc.)
    const sameMarket = bet.market === bookmark.bet.market;
    if (!sameMarket) return false;
    
    // Match pick/team
    const samePick = bet.pick === bookmark.bet.pick || bet.team === bookmark.bet.team;
    
    return samePick;
  });
  
  return match;
}

/**
 * Update a bookmark with result data
 */
async function updateBookmarkResult(docId, result) {
  try {
    await db.collection('user_bookmarks').doc(docId).update({
      result: {
        outcome: result.outcome, // 'WIN', 'LOSS', 'PUSH'
        profit: result.profit,   // profit in units
        updatedAt: Date.now()
      },
      lastUpdated: Date.now()
    });
    return true;
  } catch (error) {
    console.error(`❌ Error updating bookmark ${docId}:`, error.message);
    return false;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting Bookmark Results Update');
  console.log(`📅 Date: ${new Date().toISOString()}`);
  console.log('');
  
  // Get date range
  const { yesterday, today } = getDateRange();
  console.log(`📆 Processing bookmarks from: ${yesterday} and ${today}`);
  console.log('');
  
  // Fetch pending bookmarks
  const pendingBookmarks = await getPendingBookmarks(yesterday, today);
  
  if (pendingBookmarks.length === 0) {
    console.log('✅ No pending bookmarks to update');
    return;
  }
  
  // Fetch bet results
  const betResults = await getBetResults();
  
  if (betResults.length === 0) {
    console.log('⚠️ No bet results available yet');
    return;
  }
  
  console.log('');
  console.log('🔄 Matching and updating bookmarks...');
  console.log('='.repeat(50));
  
  let successCount = 0;
  let notFoundCount = 0;
  let errorCount = 0;
  
  for (const bookmark of pendingBookmarks) {
    const matchLabel = `${bookmark.game.awayTeam} @ ${bookmark.game.homeTeam} - ${bookmark.bet.pick}`;
    
    // DEBUG: Log bookmark details
    console.log(`\n🔍 Checking: ${matchLabel}`);
    console.log(`   betId: ${bookmark.betId}`);
    console.log(`   market: ${bookmark.bet.market}`);
    console.log(`   team: ${bookmark.bet.team}`);
    console.log(`   gameDate: ${bookmark.game.gameDate}`);
    
    // Try to find matching bet result
    const betResult = matchBookmarkToBet(bookmark, betResults);
    
    if (!betResult) {
      console.log(`   ❌ No matching result found`);
      notFoundCount++;
      continue;
    }
    
    console.log(`   ✅ Match found!`);
    
    // Update the bookmark with result
    console.log(`📝 Updating: ${matchLabel} → ${betResult.result.outcome} (${betResult.result.profit >= 0 ? '+' : ''}${betResult.result.profit.toFixed(2)}u)`);
    
    const success = await updateBookmarkResult(bookmark.docId, betResult.result);
    
    if (success) {
      successCount++;
    } else {
      errorCount++;
    }
  }
  
  console.log('');
  console.log('='.repeat(50));
  console.log('📊 Update Summary:');
  console.log(`   ✅ Updated: ${successCount}`);
  console.log(`   ⏳ Pending: ${notFoundCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log('');
  console.log('✨ Bookmark Results Update Complete');
  console.log('='.repeat(50));
}

// Run
main()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });

