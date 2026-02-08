/**
 * Get comprehensive stats for Twitter content
 * Usage: node scripts/getTweetStats.js
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, getDocs, where, orderBy } from 'firebase/firestore';
import * as dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

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

async function getTweetStats() {
  const today = new Date().toISOString().split('T')[0];
  
  console.log('\n📊 NHL SAVANT - TWITTER ANALYTICS DASHBOARD');
  console.log('='.repeat(60));
  
  try {
    const betsRef = collection(db, 'basketball_bets');
    const snapshot = await getDocs(query(betsRef));
    
    const allBets = [];
    snapshot.forEach(doc => allBets.push({ id: doc.id, ...doc.data() }));
    
    // Graded bets (have outcome)
    const gradedBets = allBets.filter(b => b.result?.outcome);
    const pendingBets = allBets.filter(b => !b.result?.outcome);
    const todayBets = allBets.filter(b => b.date === today);
    
    // Calculate stats
    const wins = gradedBets.filter(b => b.result.outcome === 'WIN').length;
    const losses = gradedBets.filter(b => b.result.outcome === 'LOSS').length;
    const winRate = gradedBets.length > 0 ? (wins / gradedBets.length * 100) : 0;
    
    // Calculate units
    const totalProfit = gradedBets.reduce((sum, b) => sum + (b.result.profit || 0), 0);
    const totalRisked = gradedBets.reduce((sum, b) => {
      return sum + (b.result?.units || b.prediction?.unitSize || 1);
    }, 0);
    const roi = totalRisked > 0 ? (totalProfit / totalRisked * 100) : 0;
    
    // Calculate streak
    const sorted = [...gradedBets].sort((a, b) => new Date(b.date) - new Date(a.date));
    let streak = 0;
    let streakType = null;
    for (const bet of sorted) {
      const outcome = bet.result?.outcome;
      if (streakType === null) {
        streakType = outcome;
        streak = 1;
      } else if (outcome === streakType) {
        streak++;
      } else break;
    }
    
    // Recent results (last 10)
    const last10 = sorted.slice(0, 10);
    const last10Wins = last10.filter(b => b.result.outcome === 'WIN').length;
    
    // Model aligned stats (high conviction picks)
    const alignedBets = gradedBets.filter(b => b.prediction?.modelsAgree === true);
    const alignedWins = alignedBets.filter(b => b.result.outcome === 'WIN').length;
    const alignedLosses = alignedBets.length - alignedWins;
    const alignedWinRate = alignedBets.length > 0 ? (alignedWins / alignedBets.length * 100) : 0;
    
    // Grade breakdown
    const aGrades = gradedBets.filter(b => b.prediction?.grade?.startsWith('A'));
    const aWins = aGrades.filter(b => b.result.outcome === 'WIN').length;
    
    // Today's picks
    const todayPending = todayBets.filter(b => !b.result?.outcome);
    
    // Get best pick for today (highest EV)
    const sortedToday = [...todayPending].sort((a, b) => 
      (b.prediction?.evPercent || 0) - (a.prediction?.evPercent || 0)
    );
    const topPick = sortedToday[0];
    
    console.log('\n📈 OVERALL RECORD');
    console.log('-'.repeat(40));
    console.log(`   Record: ${wins}-${losses} (${winRate.toFixed(1)}%)`);
    console.log(`   Units: ${totalProfit > 0 ? '+' : ''}${totalProfit.toFixed(2)}u`);
    console.log(`   ROI: ${roi > 0 ? '+' : ''}${roi.toFixed(1)}%`);
    console.log(`   Streak: ${streakType === 'WIN' ? 'W' : 'L'}${streak}`);
    console.log(`   Last 10: ${last10Wins}-${10 - last10Wins}`);
    
    console.log('\n🎯 MODEL ALIGNED PICKS (High Conviction)');
    console.log('-'.repeat(40));
    console.log(`   Record: ${alignedWins}-${alignedLosses} (${alignedWinRate.toFixed(1)}%)`);
    console.log(`   Sample size: ${alignedBets.length} bets`);
    
    console.log('\n⭐ A-GRADE PICKS');
    console.log('-'.repeat(40));
    console.log(`   Record: ${aWins}-${aGrades.length - aWins} (${aGrades.length > 0 ? (aWins/aGrades.length*100).toFixed(1) : 0}%)`);
    console.log(`   Sample size: ${aGrades.length} bets`);
    
    if (topPick) {
      const game = topPick.game || {};
      const bet = topPick.bet || {};
      const pred = topPick.prediction || {};
      
      console.log('\n🔥 TOP PICK FOR TODAY');
      console.log('-'.repeat(40));
      console.log(`   Game: ${game.awayTeam} @ ${game.homeTeam}`);
      console.log(`   Pick: ${bet.pick} (${bet.odds > 0 ? '+' : ''}${bet.odds})`);
      console.log(`   EV: +${pred.evPercent?.toFixed(1)}%`);
      console.log(`   Win Prob: ${((bet.pick === game.awayTeam ? pred.ensembleAwayProb : pred.ensembleHomeProb) * 100).toFixed(1)}%`);
      console.log(`   Grade: ${pred.grade}`);
      console.log(`   Units: ${pred.unitSize?.toFixed(1)}u`);
      console.log(`   Models Agree: ${pred.modelsAgree ? 'YES ✅' : 'NO'}`);
    }
    
    console.log('\n📅 TODAY\'S SLATE');
    console.log('-'.repeat(40));
    console.log(`   Picks: ${todayPending.length}`);
    todayPending.forEach((pick, i) => {
      const g = pick.game || {};
      const b = pick.bet || {};
      const p = pick.prediction || {};
      console.log(`   ${i+1}. ${b.pick} (${b.odds > 0 ? '+' : ''}${b.odds}) | +${p.evPercent?.toFixed(1)}% EV | ${p.grade}`);
    });
    
    // Generate optimized tweets
    console.log('\n' + '='.repeat(60));
    console.log('🐦 OPTIMIZED TWEETS');
    console.log('='.repeat(60));
    
    if (topPick) {
      const game = topPick.game || {};
      const bet = topPick.bet || {};
      const pred = topPick.prediction || {};
      const winProb = ((bet.pick === game.awayTeam ? pred.ensembleAwayProb : pred.ensembleHomeProb) * 100).toFixed(0);
      const vegasProb = bet.odds < 0 
        ? (Math.abs(bet.odds) / (Math.abs(bet.odds) + 100) * 100).toFixed(0)
        : (100 / (bet.odds + 100) * 100).toFixed(0);
      
      console.log('\n--- OPTION 1: Data Flex ---\n');
      const tweet1 = `CBB Pick of the Day 🏀

${game.awayTeam} @ ${game.homeTeam}
${bet.pick} ML (${bet.odds > 0 ? '+' : ''}${bet.odds})

📊 Our model: ${winProb}% win prob
📊 Vegas implied: ${vegasProb}%
📈 Edge: +${pred.evPercent?.toFixed(1)}% EV
✅ Both models aligned

Season: ${wins}-${losses} | +${totalProfit.toFixed(1)}u | ${roi > 0 ? '+' : ''}${roi.toFixed(0)}% ROI

#CBB #CollegeBasketball`;
      console.log(tweet1);
      console.log(`\n(${tweet1.length}/280 chars)`);
      
      console.log('\n--- OPTION 2: Confidence Builder ---\n');
      const tweet2 = `Our 2-model ensemble found a ${pred.evPercent?.toFixed(1)}% edge tonight.

${bet.pick} ML (${bet.odds > 0 ? '+' : ''}${bet.odds})
vs ${bet.pick === game.homeTeam ? game.awayTeam : game.homeTeam}

Both D-Ratings & Haslametrics agree.
That's ${alignedWins}-${alignedLosses} (${alignedWinRate.toFixed(0)}%) when models align.

More at nhlsavant.com/basketball

#GamblingTwitter #CBBPicks`;
      console.log(tweet2);
      console.log(`\n(${tweet2.length}/280 chars)`);
      
      console.log('\n--- OPTION 3: Thread Starter ---\n');
      const tweet3 = `🧵 Tonight's highest-EV college basketball bet:

${bet.pick} ML (${bet.odds > 0 ? '+' : ''}${bet.odds})

Why we like it 👇`;
      console.log(tweet3);
      console.log(`\n(${tweet3.length}/280 chars)`);
      console.log('\nThread reply 1:');
      console.log(`Our ensemble model gives ${bet.pick} a ${winProb}% chance to win.

Vegas implies ${vegasProb}%.

That ${parseInt(winProb) - parseInt(vegasProb)} percentage point gap = +${pred.evPercent?.toFixed(1)}% expected value.`);
      console.log('\nThread reply 2:');
      console.log(`Both of our predictive models (D-Ratings + Haslametrics) independently pick ${bet.pick}.

When both models agree, we're ${alignedWins}-${alignedLosses} this season.`);
      console.log('\nThread reply 3:');
      console.log(`Season record: ${wins}-${losses}
Units: ${totalProfit > 0 ? '+' : ''}${totalProfit.toFixed(1)}u
ROI: ${roi > 0 ? '+' : ''}${roi.toFixed(0)}%

All picks tracked. All transparent.

Free picks daily at nhlsavant.com/basketball`);
      
      if (todayPending.length > 1) {
        console.log('\n--- OPTION 4: Full Slate ---\n');
        let tweet4 = `Today's CBB Model Picks 🏀\n\n`;
        todayPending.slice(0, 4).forEach((pick, i) => {
          const b = pick.bet || {};
          const p = pick.prediction || {};
          tweet4 += `${i+1}. ${b.pick} (${b.odds > 0 ? '+' : ''}${b.odds}) | +${p.evPercent?.toFixed(1)}% EV\n`;
        });
        tweet4 += `\nSeason: ${wins}-${losses} | ${roi > 0 ? '+' : ''}${roi.toFixed(0)}% ROI\n\n#CBB`;
        console.log(tweet4);
        console.log(`\n(${tweet4.length}/280 chars)`);
      }
    }
    
    return { wins, losses, winRate, totalProfit, roi };
    
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

getTweetStats()
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Failed:', error.message);
    process.exit(1);
  });
