/**
 * Analyze REAL Firebase bets to diagnose model performance
 * No simulation - uses actual bets placed and their outcomes
 */

import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
const serviceAccount = {
  project_id: process.env.VITE_FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
};

if (!serviceAccount.project_id || !serviceAccount.client_email || !serviceAccount.private_key) {
  console.error('❌ Missing Firebase credentials in environment variables');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function analyzeRealBets() {
  console.log('🔍 Analyzing REAL Firebase Bets...\n');
  console.log('='.repeat(80));
  
  try {
    // Load all completed bets
    const snapshot = await db.collection('bets')
      .where('status', '==', 'COMPLETED')
      .orderBy('timestamp', 'asc')
      .get();
    
    const allBets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    console.log(`\n📊 Total Completed Bets: ${allBets.length}`);
    
    // Filter to quality bets (B-rated or higher, moneyline only)
    const qualityBets = allBets.filter(b => 
      b.prediction?.rating !== 'C' && 
      b.bet?.market === 'MONEYLINE'
    );
    
    console.log(`📊 Quality Moneyline Bets: ${qualityBets.length}\n`);
    
    if (qualityBets.length === 0) {
      console.log('❌ No quality bets found!');
      return;
    }
    
    // Split into early vs recent
    const SPLIT_POINT = 100;
    const earlyBets = qualityBets.slice(0, SPLIT_POINT);
    const recentBets = qualityBets.slice(SPLIT_POINT);
    
    console.log('='.repeat(80));
    console.log('📈 SEGMENT ANALYSIS');
    console.log('='.repeat(80));
    
    // Analyze early segment
    console.log(`\n🎯 EARLY BETS (1-${SPLIT_POINT}):`);
    const earlyStats = analyzeSegment(earlyBets);
    printStats(earlyStats);
    
    // Analyze recent segment
    console.log(`\n🎯 RECENT BETS (${SPLIT_POINT + 1}-${qualityBets.length}):`);
    const recentStats = analyzeSegment(recentBets);
    printStats(recentStats);
    
    // Calculate delta
    console.log('\n' + '='.repeat(80));
    console.log('📊 PERFORMANCE CHANGE');
    console.log('='.repeat(80));
    
    const wrDelta = recentStats.winRate - earlyStats.winRate;
    const roiDelta = recentStats.roi - earlyStats.roi;
    const profitDelta = recentStats.profit - earlyStats.profit;
    
    console.log(`\nWin Rate: ${earlyStats.winRate.toFixed(1)}% → ${recentStats.winRate.toFixed(1)}% (${wrDelta > 0 ? '+' : ''}${wrDelta.toFixed(1)}%)`);
    console.log(`ROI: ${earlyStats.roi.toFixed(1)}% → ${recentStats.roi.toFixed(1)}% (${roiDelta > 0 ? '+' : ''}${roiDelta.toFixed(1)}%)`);
    console.log(`Profit: ${earlyStats.profit.toFixed(2)}u → ${recentStats.profit.toFixed(2)}u (${profitDelta > 0 ? '+' : ''}${profitDelta.toFixed(2)}u)`);
    
    // Analyze by rating
    console.log('\n' + '='.repeat(80));
    console.log('🏆 PERFORMANCE BY RATING');
    console.log('='.repeat(80));
    
    analyzeByRating(earlyBets, 'EARLY (1-100)');
    analyzeByRating(recentBets, 'RECENT (100+)');
    
    // Check for model prediction accuracy
    console.log('\n' + '='.repeat(80));
    console.log('🎯 MODEL PREDICTION ACCURACY');
    console.log('='.repeat(80));
    
    analyzePredictionAccuracy(earlyBets, 'EARLY (1-100)');
    analyzePredictionAccuracy(recentBets, 'RECENT (100+)');
    
    // Root cause analysis
    console.log('\n' + '='.repeat(80));
    console.log('🔬 ROOT CAUSE DIAGNOSTICS');
    console.log('='.repeat(80));
    
    diagnoseRootCause(recentBets);
    
    console.log('\n✅ Analysis Complete!\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    admin.app().delete();
  }
}

function analyzeSegment(bets) {
  const wins = bets.filter(b => b.result?.outcome === 'WIN').length;
  const losses = bets.filter(b => b.result?.outcome === 'LOSS').length;
  const pushes = bets.filter(b => b.result?.outcome === 'PUSH').length;
  const totalProfit = bets.reduce((sum, b) => sum + (b.result?.profit || 0), 0);
  
  const decidedBets = wins + losses;
  const winRate = decidedBets > 0 ? (wins / decidedBets) * 100 : 0;
  const roi = bets.length > 0 ? (totalProfit / bets.length) * 100 : 0;
  
  return {
    total: bets.length,
    wins,
    losses,
    pushes,
    winRate,
    roi,
    profit: totalProfit
  };
}

function printStats(stats) {
  console.log(`   Total Bets: ${stats.total}`);
  console.log(`   Record: ${stats.wins}-${stats.losses}-${stats.pushes}`);
  console.log(`   Win Rate: ${stats.winRate.toFixed(1)}%`);
  console.log(`   Profit: ${stats.profit.toFixed(2)}u`);
  console.log(`   ROI: ${stats.roi.toFixed(1)}%`);
}

function analyzeByRating(bets, label) {
  console.log(`\n${label}:`);
  
  const ratings = ['A+', 'A', 'B+', 'B'];
  
  ratings.forEach(rating => {
    const ratingBets = bets.filter(b => b.prediction?.rating === rating);
    if (ratingBets.length === 0) return;
    
    const stats = analyzeSegment(ratingBets);
    console.log(`   ${rating}: ${stats.total} bets, ${stats.winRate.toFixed(1)}% WR, ${stats.profit.toFixed(2)}u (${stats.roi.toFixed(1)}% ROI)`);
  });
}

function analyzePredictionAccuracy(bets, label) {
  console.log(`\n${label}:`);
  
  // Filter bets with prediction data
  const betsWithPredictions = bets.filter(b => 
    b.prediction?.homeWinProb !== undefined && 
    b.prediction?.awayWinProb !== undefined &&
    b.result?.winner !== undefined
  );
  
  if (betsWithPredictions.length === 0) {
    console.log('   No prediction data available');
    return;
  }
  
  // Check how often model correctly predicted the winner
  const correctPredictions = betsWithPredictions.filter(b => {
    const predictedWinner = b.prediction.homeWinProb > b.prediction.awayWinProb ? 'HOME' : 'AWAY';
    return predictedWinner === b.result.winner;
  }).length;
  
  const accuracy = (correctPredictions / betsWithPredictions.length) * 100;
  
  console.log(`   Bets with prediction data: ${betsWithPredictions.length}`);
  console.log(`   Model predicted winner correctly: ${correctPredictions}/${betsWithPredictions.length} (${accuracy.toFixed(1)}%)`);
  
  // Check if model is predicting home vs away correctly
  const homePredictions = betsWithPredictions.filter(b => b.prediction.homeWinProb > b.prediction.awayWinProb);
  const homeCorrect = homePredictions.filter(b => b.result.winner === 'HOME').length;
  const homeAccuracy = homePredictions.length > 0 ? (homeCorrect / homePredictions.length) * 100 : 0;
  
  const awayPredictions = betsWithPredictions.filter(b => b.prediction.awayWinProb > b.prediction.homeWinProb);
  const awayCorrect = awayPredictions.filter(b => b.result.winner === 'AWAY').length;
  const awayAccuracy = awayPredictions.length > 0 ? (awayCorrect / awayPredictions.length) * 100 : 0;
  
  console.log(`   When predicting HOME win: ${homeCorrect}/${homePredictions.length} correct (${homeAccuracy.toFixed(1)}%)`);
  console.log(`   When predicting AWAY win: ${awayCorrect}/${awayPredictions.length} correct (${awayAccuracy.toFixed(1)}%)`);
  
  return accuracy;
}

function diagnoseRootCause(bets) {
  console.log('\n🔍 Hypothesis Testing:\n');
  
  // Hypothesis 1: Home team bias
  const homeBets = bets.filter(b => {
    const pick = b.bet?.pick || '';
    const homeTeam = b.game?.homeTeam || '';
    return pick.includes(homeTeam);
  });
  const homeStats = analyzeSegment(homeBets);
  
  const awayBets = bets.filter(b => {
    const pick = b.bet?.pick || '';
    const awayTeam = b.game?.awayTeam || '';
    return pick.includes(awayTeam);
  });
  const awayStats = analyzeSegment(awayBets);
  
  console.log(`❓ Hypothesis 1: Home vs Away Performance`);
  console.log(`   Home team bets: ${homeStats.total} bets, ${homeStats.winRate.toFixed(1)}% WR, ${homeStats.profit.toFixed(2)}u`);
  console.log(`   Away team bets: ${awayStats.total} bets, ${awayStats.winRate.toFixed(1)}% WR, ${awayStats.profit.toFixed(2)}u`);
  
  if (homeStats.profit < -5) {
    console.log(`   ✅ LIKELY CAUSE: Home team bets significantly negative`);
  } else {
    console.log(`   ❌ NOT CAUSE: Home/away split looks reasonable`);
  }
  
  // Hypothesis 2: Favorites vs underdogs
  const favBets = bets.filter(b => (b.bet?.odds || 0) < 0);
  const dogBets = bets.filter(b => (b.bet?.odds || 0) > 0);
  
  const favStats = analyzeSegment(favBets);
  const dogStats = analyzeSegment(dogBets);
  
  console.log(`\n❓ Hypothesis 2: Favorites vs Underdogs`);
  console.log(`   Favorites: ${favStats.total} bets, ${favStats.winRate.toFixed(1)}% WR, ${favStats.profit.toFixed(2)}u`);
  console.log(`   Underdogs: ${dogStats.total} bets, ${dogStats.winRate.toFixed(1)}% WR, ${dogStats.profit.toFixed(2)}u`);
  
  if (favStats.profit < dogStats.profit / 2) {
    console.log(`   ✅ LIKELY CAUSE: Favorites underperforming significantly`);
  } else {
    console.log(`   ❌ NOT CAUSE: Fav/dog split looks reasonable`);
  }
  
  // Hypothesis 3: Lower ratings dragging down
  const bRated = bets.filter(b => b.prediction?.rating === 'B');
  const bPlusRated = bets.filter(b => b.prediction?.rating === 'B+');
  
  const bStats = analyzeSegment(bRated);
  const bPlusStats = analyzeSegment(bPlusRated);
  
  console.log(`\n❓ Hypothesis 3: Lower Ratings Unprofitable`);
  console.log(`   B-rated: ${bStats.total} bets, ${bStats.winRate.toFixed(1)}% WR, ${bStats.profit.toFixed(2)}u`);
  console.log(`   B+ rated: ${bPlusStats.total} bets, ${bPlusStats.winRate.toFixed(1)}% WR, ${bPlusStats.profit.toFixed(2)}u`);
  
  if (bStats.profit < 0 || bPlusStats.profit < 0) {
    console.log(`   ✅ LIKELY CAUSE: Lower-rated bets are unprofitable`);
  } else {
    console.log(`   ❌ NOT CAUSE: All ratings still profitable`);
  }
}

// Run analysis
analyzeRealBets().catch(console.error);

