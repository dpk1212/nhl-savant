/**
 * Check Today's Basketball Bets (Client SDK)
 * Shows what's in Firebase using client SDK
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import * as dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

// Initialize Firebase CLIENT SDK
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('❌ Missing Firebase credentials in .env file');
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get today's date in ET timezone
function getETGameDate() {
  const now = new Date();
  const etTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  return etTime.toISOString().split('T')[0];
}

async function checkTodaysBets() {
  console.log('\n🔍 CHECKING TODAY\'S BASKETBALL BETS IN FIREBASE');
  console.log('==========================================\n');
  
  const today = getETGameDate();
  console.log(`📅 Today's Date (ET): ${today}\n`);
  
  try {
    // Get ALL basketball bets
    console.log('📡 Fetching all basketball_bets from Firebase...');
    const betsSnapshot = await getDocs(collection(db, 'basketball_bets'));
    console.log(`   Total bets in collection: ${betsSnapshot.size}\n`);
    
    // Filter for today
    const todayBets = [];
    const allDates = new Set();
    
    betsSnapshot.forEach((doc) => {
      const bet = { id: doc.id, ...doc.data() };
      allDates.add(bet.date);
      
      if (bet.date === today) {
        todayBets.push(bet);
      }
    });
    
    console.log(`✅ Found ${todayBets.length} bets for today (${today})\n`);
    
    if (todayBets.length === 0) {
      console.log('❌ NO BETS FOR TODAY IN FIREBASE!\n');
      console.log('Recent dates found in database:');
      const sortedDates = Array.from(allDates).sort().reverse().slice(0, 10);
      sortedDates.forEach(date => {
        const count = Array.from(betsSnapshot.docs).filter(doc => doc.data().date === date).length;
        console.log(`   ${date}: ${count} bets`);
      });
      return;
    }
    
    // Display today's bets
    console.log('══════════════════════════════════════════════════════');
    console.log(`🏀 TODAY'S BETS (${today})`);
    console.log('══════════════════════════════════════════════════════\n');
    
    todayBets.sort((a, b) => {
      const evA = a.prediction?.evPercent || 0;
      const evB = b.prediction?.evPercent || 0;
      return evB - evA; // Sort by EV descending
    });
    
    todayBets.forEach((bet, i) => {
      const ev = bet.prediction?.evPercent || 0;
      const grade = bet.prediction?.grade || 'N/A';
      const units = bet.prediction?.unitSize || 0;
      const odds = bet.bet?.odds || 0;
      
      console.log(`${i + 1}. ${bet.game?.awayTeam} @ ${bet.game?.homeTeam}`);
      console.log(`   Pick: ${bet.bet?.pick} ${odds > 0 ? '+' : ''}${odds}`);
      console.log(`   EV: ${ev.toFixed(1)}% | Grade: ${grade} | Units: ${units.toFixed(1)}u`);
      console.log(`   Status: ${bet.status} | Time: ${bet.game?.gameTime || 'TBD'}`);
      console.log(`   Firebase ID: ${bet.id}`);
      console.log();
    });
    
    // Stats
    console.log('══════════════════════════════════════════════════════');
    console.log('📊 SUMMARY');
    console.log('══════════════════════════════════════════════════════');
    
    const avgEV = todayBets.reduce((sum, b) => sum + (b.prediction?.evPercent || 0), 0) / todayBets.length;
    const totalUnits = todayBets.reduce((sum, b) => sum + (b.prediction?.unitSize || 0), 0);
    
    const grades = {};
    todayBets.forEach(b => {
      const grade = b.prediction?.grade || 'N/A';
      grades[grade] = (grades[grade] || 0) + 1;
    });
    
    console.log(`Total bets: ${todayBets.length}`);
    console.log(`Average EV: ${avgEV.toFixed(1)}%`);
    console.log(`Total units allocated: ${totalUnits.toFixed(1)}u`);
    console.log(`\nGrade distribution:`);
    Object.entries(grades).sort().forEach(([grade, count]) => {
      console.log(`   ${grade}: ${count} bet${count > 1 ? 's' : ''}`);
    });
    
    console.log('\n══════════════════════════════════════════════════════');
    console.log('✅ These bets SHOULD ALL be displayed in the UI');
    console.log('══════════════════════════════════════════════════════');
    console.log('\nIf you see fewer in the UI, possible causes:');
    console.log('1. Browser cache - hard refresh (Cmd+Shift+R)');
    console.log('2. JavaScript error - check browser console');
    console.log('3. UI filter applied - check filter buttons');
    console.log('4. Data loading issue - check network tab\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
  
  process.exit(0);
}

// Run
checkTodaysBets().catch(err => {
  console.error(err);
  process.exit(1);
});


