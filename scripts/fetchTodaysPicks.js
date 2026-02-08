/**
 * Fetch today's college basketball picks from Firebase
 * Usage: node scripts/fetchTodaysPicks.js
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import * as dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file
dotenv.config({ path: join(__dirname, '../.env') });

// Initialize Firebase
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

async function fetchTodaysPicks() {
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  console.log(`\n🏀 COLLEGE BASKETBALL PICKS FOR ${today}`);
  console.log('='.repeat(50));
  
  try {
    // Query basketball_bets for today
    const betsRef = collection(db, 'basketball_bets');
    const q = query(
      betsRef,
      where('date', '==', today)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log('\n❌ No picks found for today.');
      console.log('\nChecking recent dates...');
      
      // Try yesterday and day before
      const dates = [];
      for (let i = 1; i <= 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dates.push(d.toISOString().split('T')[0]);
      }
      
      for (const date of dates) {
        const q2 = query(betsRef, where('date', '==', date));
        const snap2 = await getDocs(q2);
        if (!snap2.empty) {
          console.log(`\n📅 Found ${snap2.size} picks for ${date}:`);
          snap2.forEach(doc => {
            const bet = doc.data();
            console.log(`   - ${bet.game?.awayTeam} @ ${bet.game?.homeTeam}: ${bet.bet?.pick} ${bet.bet?.odds > 0 ? '+' : ''}${bet.bet?.odds}`);
          });
        }
      }
      return [];
    }
    
    const picks = [];
    snapshot.forEach(doc => {
      picks.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort by EV (highest first)
    picks.sort((a, b) => (b.prediction?.evPercent || 0) - (a.prediction?.evPercent || 0));
    
    console.log(`\n✅ Found ${picks.length} picks for today!\n`);
    
    picks.forEach((pick, i) => {
      const pred = pick.prediction || {};
      const game = pick.game || {};
      const bet = pick.bet || {};
      
      console.log(`${i + 1}. ${game.awayTeam} @ ${game.homeTeam}`);
      console.log(`   🎯 PICK: ${bet.pick} ${bet.odds > 0 ? '+' : ''}${bet.odds}`);
      console.log(`   📊 EV: +${pred.evPercent?.toFixed(1)}% | Grade: ${pred.grade || pred.simplifiedGrade}`);
      console.log(`   🎲 Win Prob: ${((pred.ensembleAwayProb || pred.ensembleHomeProb || 0) * 100).toFixed(1)}%`);
      console.log(`   💰 Units: ${pred.unitSize?.toFixed(1) || 1}u | Confidence: ${pred.confidenceTier || 'N/A'}`);
      if (pred.modelsAgree !== undefined) {
        console.log(`   ✅ Models Agree: ${pred.modelsAgree ? 'YES' : 'NO'}`);
      }
      console.log();
    });
    
    // Generate tweet for top pick
    if (picks.length > 0) {
      const topPick = picks[0];
      const game = topPick.game || {};
      const bet = topPick.bet || {};
      const pred = topPick.prediction || {};
      
      console.log('\n' + '='.repeat(50));
      console.log('🐦 SUGGESTED TWEET (Top Pick):');
      console.log('='.repeat(50));
      
      const oddsStr = bet.odds > 0 ? `+${bet.odds}` : bet.odds;
      const evStr = pred.evPercent?.toFixed(1) || '?';
      const winProb = bet.pick === game.awayTeam 
        ? (pred.ensembleAwayProb * 100).toFixed(0)
        : (pred.ensembleHomeProb * 100).toFixed(0);
      
      const tweet = `🏀 CBB LOCK OF THE DAY

${game.awayTeam} @ ${game.homeTeam}
🎯 ${bet.pick} ML (${oddsStr})

📊 Model says ${winProb}% win probability
📈 +${evStr}% Expected Value
✅ Both models aligned

Our ensemble of predictive models found edge here.

#CBBPicks #CollegeBasketball #SportsBetting`;

      console.log('\n' + tweet);
      console.log('\n' + '='.repeat(50));
      console.log(`Character count: ${tweet.length}/280`);
    }
    
    return picks;
    
  } catch (error) {
    console.error('Error fetching picks:', error);
    throw error;
  }
}

fetchTodaysPicks()
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Failed:', error.message);
    process.exit(1);
  });
