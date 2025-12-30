/**
 * Diagnose Today's Basketball Bets
 * Shows what's in Firebase vs what should be displayed
 */

import admin from 'firebase-admin';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

// Only initialize if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// Get today's date in ET timezone
function getETGameDate() {
  const now = new Date();
  const etTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  return etTime.toISOString().split('T')[0];
}

async function diagnoseTodaysBets() {
  console.log('\n🔍 DIAGNOSING TODAY\'S BASKETBALL BETS');
  console.log('==========================================\n');
  
  const today = getETGameDate();
  console.log(`📅 Today's Date (ET): ${today}\n`);
  
  try {
    // 1. Get ALL bets from Firebase
    console.log('1️⃣ Querying ALL basketball_bets from Firebase...');
    const allBetsSnapshot = await db.collection('basketball_bets').get();
    console.log(`   Total bets in Firebase: ${allBetsSnapshot.size}\n`);
    
    // 2. Get today's bets
    console.log('2️⃣ Filtering for today\'s bets...');
    const todayBets = [];
    allBetsSnapshot.docs.forEach(doc => {
      const bet = { id: doc.id, ...doc.data() };
      if (bet.date === today) {
        todayBets.push(bet);
      }
    });
    console.log(`   Today's bets in Firebase: ${todayBets.length}\n`);
    
    if (todayBets.length === 0) {
      console.log('❌ NO BETS FOUND FOR TODAY IN FIREBASE!');
      console.log('\nPossible reasons:');
      console.log('1. The workflow hasn\'t run yet today');
      console.log('2. The deprecated script filtered them out (EV < 3%)');
      console.log('3. No games match the quality criteria');
      console.log('\nRecent dates in Firebase:');
      
      const dates = new Set();
      allBetsSnapshot.docs.forEach(doc => {
        const bet = doc.data();
        if (bet.date) dates.add(bet.date);
      });
      
      const sortedDates = Array.from(dates).sort().reverse().slice(0, 10);
      sortedDates.forEach(date => {
        const count = allBetsSnapshot.docs.filter(doc => doc.data().date === date).length;
        console.log(`   ${date}: ${count} bets`);
      });
      
      return;
    }
    
    // 3. Display today's bets
    console.log('3️⃣ TODAY\'S BETS IN FIREBASE:');
    console.log('═════════════════════════════════════════\n');
    
    todayBets.forEach((bet, i) => {
      console.log(`${i + 1}. ${bet.game?.awayTeam} @ ${bet.game?.homeTeam}`);
      console.log(`   ID: ${bet.id}`);
      console.log(`   Pick: ${bet.bet?.pick} (${bet.bet?.odds > 0 ? '+' : ''}${bet.bet?.odds})`);
      console.log(`   EV: ${bet.prediction?.evPercent?.toFixed(1) || 'N/A'}%`);
      console.log(`   Grade: ${bet.prediction?.grade || 'N/A'}`);
      console.log(`   Units: ${bet.prediction?.unitSize?.toFixed(1) || 'N/A'}u`);
      console.log(`   Status: ${bet.status || 'N/A'}`);
      console.log(`   Time: ${bet.game?.gameTime || 'TBD'}`);
      console.log();
    });
    
    // 4. Check what's in the data files (what SHOULD be displayed)
    console.log('4️⃣ CHECKING DATA FILES FOR TODAY...');
    console.log('═════════════════════════════════════════\n');
    
    try {
      const oddsMarkdown = await fs.readFile(join(__dirname, '../public/basketball_odds.md'), 'utf8');
      
      // Count games in OddsTrader data (very rough)
      const gameMatches = oddsMarkdown.match(/\d{1,2}:\d{2}(am|pm)/gi);
      const estimatedGames = gameMatches ? gameMatches.length : 0;
      
      console.log(`   Estimated games in basketball_odds.md: ~${estimatedGames}`);
      console.log(`   Bets saved to Firebase: ${todayBets.length}`);
      
      if (todayBets.length < estimatedGames) {
        console.log(`\n⚠️  MISMATCH DETECTED!`);
        console.log(`   ${estimatedGames - todayBets.length} games may have been filtered out`);
        console.log(`   Likely reason: EV < 3% threshold in shouldBet() filter`);
      } else {
        console.log(`\n✅ All quality games appear to be saved`);
      }
    } catch (err) {
      console.log('   ⚠️  Could not read data files:', err.message);
    }
    
    console.log('\n==========================================');
    console.log('✅ DIAGNOSIS COMPLETE');
    console.log('==========================================\n');
    
    // Summary
    console.log('SUMMARY:');
    console.log(`• Firebase has ${todayBets.length} bets for ${today}`);
    console.log(`• All ${todayBets.length} should be displayed in UI`);
    console.log(`• If UI shows fewer, check browser console for errors`);
    console.log();
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

// Run
diagnoseTodaysBets()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

