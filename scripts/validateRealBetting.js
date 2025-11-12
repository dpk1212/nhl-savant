/**
 * REAL Betting Validation Script
 * 
 * This tests your model's ACTUAL betting performance by:
 * 1. Loading REAL bets from Firebase (with real market odds)
 * 2. Comparing predictions vs actual outcomes
 * 3. Analyzing why betting win rate differs from prediction accuracy
 * 
 * This is NOT a simulation - it uses your actual bets!
 */

import admin from 'firebase-admin';

console.log('🔍 VALIDATING REAL BETTING PERFORMANCE');
console.log('='.repeat(80));

// Initialize Firebase
const serviceAccount = {
  project_id: process.env.VITE_FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
};

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

const db = admin.firestore();

async function validateRealBetting() {
  try {
    console.log('\n📥 Loading REAL bets from Firebase...\n');
    
    const snapshot = await db.collection('bets')
      .where('status', '==', 'COMPLETED')
      .get();
    
    const allBets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Filter to quality bets (B-rated or higher, no totals)
    const qualityBets = allBets.filter(b => 
      b.prediction?.rating !== 'C' && 
      b.bet?.market !== 'TOTAL' && 
      !b.bet?.market?.includes('TOTAL')
    );
    
    console.log(`✅ Loaded ${allBets.length} total bets`);
    console.log(`✅ ${qualityBets.length} quality bets (B-rated or higher, no totals)\n`);
    
    if (qualityBets.length === 0) {
      console.log('❌ No completed bets found in Firebase!');
      console.log('   This means either:');
      console.log('   1. No bets have been tracked yet');
      console.log('   2. No bets have completed (status !== COMPLETED)');
      console.log('   3. All bets were C-rated or totals (filtered out)');
      return;
    }
    
    // Analyze betting performance
    const wins = qualityBets.filter(b => b.result?.outcome === 'WIN').length;
    const losses = qualityBets.filter(b => b.result?.outcome === 'LOSS').length;
    const pushes = qualityBets.filter(b => b.result?.outcome === 'PUSH').length;
    
    const winRate = wins + losses > 0 ? (wins / (wins + losses)) * 100 : 0;
    const totalProfit = qualityBets.reduce((sum, b) => sum + (b.result?.profit || 0), 0);
    const avgProfitPerBet = qualityBets.length > 0 ? totalProfit / qualityBets.length : 0;
    
    console.log('='.repeat(80));
    console.log('💰 REAL BETTING PERFORMANCE (From Firebase)');
    console.log('='.repeat(80));
    console.log(`Total Bets: ${qualityBets.length}`);
    console.log(`Wins: ${wins}`);
    console.log(`Losses: ${losses}`);
    console.log(`Pushes: ${pushes}`);
    console.log(`Win Rate: ${winRate.toFixed(1)}%`);
    console.log(`Total Profit: ${totalProfit.toFixed(2)} units`);
    console.log(`Avg Profit/Bet: ${avgProfitPerBet.toFixed(2)} units`);
    console.log(`ROI: ${(avgProfitPerBet * 100).toFixed(1)}%`);
    
    // Break down by rating
    console.log('\n' + '='.repeat(80));
    console.log('📊 PERFORMANCE BY RATING');
    console.log('='.repeat(80));
    
    const byRating = {};
    qualityBets.forEach(b => {
      const rating = b.prediction?.rating || 'UNKNOWN';
      if (!byRating[rating]) {
        byRating[rating] = { bets: [], wins: 0, losses: 0, profit: 0 };
      }
      byRating[rating].bets.push(b);
      if (b.result?.outcome === 'WIN') byRating[rating].wins++;
      if (b.result?.outcome === 'LOSS') byRating[rating].losses++;
      byRating[rating].profit += (b.result?.profit || 0);
    });
    
    console.log('Rating | Bets | Win Rate | Profit | ROI');
    console.log('-'.repeat(80));
    
    for (const rating of ['A+', 'A', 'B+', 'B']) {
      if (byRating[rating]) {
        const data = byRating[rating];
        const ratingWinRate = data.wins + data.losses > 0 
          ? (data.wins / (data.wins + data.losses)) * 100 
          : 0;
        const roi = data.bets.length > 0 ? (data.profit / data.bets.length) * 100 : 0;
        console.log(
          `${rating.padEnd(6)} | ${data.bets.length.toString().padStart(4)} | ` +
          `${ratingWinRate.toFixed(1).padStart(8)}% | ` +
          `${data.profit.toFixed(2).padStart(6)}u | ` +
          `${roi.toFixed(1).padStart(6)}%`
        );
      }
    }
    
    // Analyze prediction accuracy vs betting accuracy
    console.log('\n' + '='.repeat(80));
    console.log('🎯 PREDICTION ACCURACY ANALYSIS');
    console.log('='.repeat(80));
    
    // Check how many bets had prediction data
    const betsWithPredictions = qualityBets.filter(b => 
      b.prediction?.homeWinProb !== undefined && 
      b.prediction?.awayWinProb !== undefined &&
      b.result?.winner !== undefined
    );
    
    console.log(`\nBets with prediction data: ${betsWithPredictions.length} of ${qualityBets.length}`);
    
    if (betsWithPredictions.length > 0) {
      // Calculate how often model correctly predicted the winner
      const correctWinnerPredictions = betsWithPredictions.filter(b => {
        const predictedWinner = b.prediction.homeWinProb > b.prediction.awayWinProb ? 'HOME' : 'AWAY';
        return predictedWinner === b.result.winner;
      }).length;
      
      const predictionAccuracy = (correctWinnerPredictions / betsWithPredictions.length) * 100;
      
      console.log(`Model Prediction Accuracy: ${predictionAccuracy.toFixed(1)}% (${correctWinnerPredictions}/${betsWithPredictions.length})`);
      console.log(`Betting Win Rate: ${winRate.toFixed(1)}% (${wins}/${wins + losses})`);
      console.log(`Difference: ${(predictionAccuracy - winRate).toFixed(1)} percentage points`);
      
      if (predictionAccuracy > winRate) {
        console.log('\n⚠️ ISSUE IDENTIFIED:');
        console.log('   Your model predicts winners correctly MORE often than your bets win!');
        console.log('   This suggests:');
        console.log('   1. You might be betting on the WRONG side (against your prediction)');
        console.log('   2. OR market odds are less favorable than your edge calculations suggest');
        console.log('   3. OR there\'s a bug in how bets are being created');
      } else if (winRate > predictionAccuracy) {
        console.log('\n✅ GOOD NEWS:');
        console.log('   Your bets are winning MORE than your prediction accuracy suggests!');
        console.log('   This means you\'re finding good market inefficiencies.');
      } else {
        console.log('\n📊 ANALYSIS:');
        console.log('   Your betting win rate matches your prediction accuracy.');
        console.log('   This is expected - you win when your prediction is correct.');
      }
    }
    
    // Show sample bets
    console.log('\n' + '='.repeat(80));
    console.log('📋 SAMPLE OF RECENT BETS');
    console.log('='.repeat(80));
    
    const recentBets = qualityBets
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
      .slice(0, 10);
    
    console.log('\nMost Recent 10 Bets:');
    console.log('-'.repeat(80));
    
    recentBets.forEach((bet, i) => {
      const outcome = bet.result?.outcome || 'PENDING';
      const profit = bet.result?.profit || 0;
      const rating = bet.prediction?.rating || '?';
      const ev = bet.prediction?.ev || 0;
      
      console.log(`${i + 1}. ${bet.bet?.market} - ${bet.bet?.team || bet.game?.split(' @ ').join(' vs ')}`);
      console.log(`   Rating: ${rating} | EV: ${ev.toFixed(1)}% | Outcome: ${outcome} | Profit: ${profit.toFixed(2)}u`);
    });
    
    console.log('\n' + '='.repeat(80));
    console.log('VALIDATION COMPLETE');
    console.log('='.repeat(80));
    
    // Exit
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Error validating betting performance:', error);
    process.exit(1);
  }
}

validateRealBetting();

