/**
 * COMPARE: D-Ratings vs "Both Models Cover" Filter
 * 
 * Compare accuracy between:
 * 1. ALL games (using D-Ratings predictions)
 * 2. Only games where BOTH models predict the same team covers the spread
 * 
 * This tells us: Does the "both cover" filter actually improve accuracy?
 */

import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as dotenv from 'dotenv';

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

async function compareBothCover() {
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════════════════════════════════╗');
  console.log('║         D-RATINGS ALONE vs "BOTH MODELS COVER" FILTER                                    ║');
  console.log('║                    Does requiring both models to agree help?                              ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════════════════════╝');
  console.log('\n');

  const betsRef = collection(db, 'basketball_bets');
  const gradedQuery = query(betsRef, where('status', '==', 'COMPLETED'));
  const snapshot = await getDocs(gradedQuery);
  
  const bets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  console.log(`📊 Analyzing ${bets.length} completed bets...\n`);

  // Tracking for ALL games (D-Ratings only)
  const allGames = {
    winnerCorrect: 0,
    winnerTotal: 0,
    marginErrors: [],
    spreadCovers: 0,
    spreadTotal: 0
  };
  
  // Tracking for games where BOTH models agree on winner
  const bothAgreeWinner = {
    winnerCorrect: 0,
    winnerTotal: 0,
    marginErrors: [],
    spreadCovers: 0,
    spreadTotal: 0
  };
  
  // Tracking for games where BOTH models predict covering spread
  const bothCoverSpread = {
    winnerCorrect: 0,
    winnerTotal: 0,
    marginErrors: [],
    spreadCovers: 0,
    spreadTotal: 0
  };

  bets.forEach(bet => {
    const prediction = bet.prediction || {};
    const result = bet.result || {};
    const betData = bet.bet || {};
    const spreadData = bet.spreadAnalysis || {};
    
    const actualAway = result.awayScore;
    const actualHome = result.homeScore;
    if (actualAway === undefined || actualHome === undefined) return;
    
    const actualMargin = actualAway - actualHome;
    const actualWinner = actualAway > actualHome ? 'AWAY' : 'HOME';
    
    // D-Ratings predictions
    const drAway = prediction.dratingsAwayScore;
    const drHome = prediction.dratingsHomeScore;
    
    // Haslametrics predictions
    const hsAway = prediction.haslametricsAwayScore;
    const hsHome = prediction.haslametricsHomeScore;
    
    if (drAway == null || drHome == null) return;
    
    const drMargin = drAway - drHome;
    const drWinner = drAway > drHome ? 'AWAY' : 'HOME';
    const drMarginError = Math.abs(drMargin - actualMargin);
    const drWinnerCorrect = drWinner === actualWinner;
    
    // Get spread data
    const spread = spreadData.spread || betData.spread;
    const pickedSide = betData.side || (betData.team === bet.awayTeam ? 'AWAY' : 'HOME');
    const isAway = pickedSide === 'AWAY' || pickedSide === 'away';
    
    // ═══════════════════════════════════════════════════════════════════════════════════════════
    // ALL GAMES (D-Ratings alone)
    // ═══════════════════════════════════════════════════════════════════════════════════════════
    allGames.winnerTotal++;
    if (drWinnerCorrect) allGames.winnerCorrect++;
    allGames.marginErrors.push(drMarginError);
    
    if (spread) {
      const actualPickedMargin = isAway ? actualMargin : -actualMargin;
      const spreadNum = Math.abs(spread);
      const actualCovered = actualPickedMargin > spreadNum;
      
      allGames.spreadTotal++;
      if (actualCovered) allGames.spreadCovers++;
    }
    
    // Skip Hasla comparison if no Hasla data
    if (hsAway == null || hsHome == null) return;
    
    const hsMargin = hsAway - hsHome;
    const hsWinner = hsAway > hsHome ? 'AWAY' : 'HOME';
    
    // ═══════════════════════════════════════════════════════════════════════════════════════════
    // BOTH MODELS AGREE ON WINNER
    // ═══════════════════════════════════════════════════════════════════════════════════════════
    if (drWinner === hsWinner) {
      bothAgreeWinner.winnerTotal++;
      if (drWinnerCorrect) bothAgreeWinner.winnerCorrect++;
      bothAgreeWinner.marginErrors.push(drMarginError);
      
      if (spread) {
        const actualPickedMargin = isAway ? actualMargin : -actualMargin;
        const spreadNum = Math.abs(spread);
        const actualCovered = actualPickedMargin > spreadNum;
        
        bothAgreeWinner.spreadTotal++;
        if (actualCovered) bothAgreeWinner.spreadCovers++;
      }
    }
    
    // ═══════════════════════════════════════════════════════════════════════════════════════════
    // BOTH MODELS PREDICT COVERING SPREAD
    // ═══════════════════════════════════════════════════════════════════════════════════════════
    if (spread) {
      const drPickedMargin = isAway ? drMargin : -drMargin;
      const hsPickedMargin = isAway ? hsMargin : -hsMargin;
      const spreadNum = Math.abs(spread);
      
      const drCovers = drPickedMargin > spreadNum;
      const hsCovers = hsPickedMargin > spreadNum;
      
      if (drCovers && hsCovers) {
        const actualPickedMargin = isAway ? actualMargin : -actualMargin;
        const actualCovered = actualPickedMargin > spreadNum;
        
        bothCoverSpread.winnerTotal++;
        if (drWinnerCorrect) bothCoverSpread.winnerCorrect++;
        bothCoverSpread.marginErrors.push(drMarginError);
        bothCoverSpread.spreadTotal++;
        if (actualCovered) bothCoverSpread.spreadCovers++;
      }
    }
  });

  const avg = arr => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  // ═══════════════════════════════════════════════════════════════════════════════════════════
  // RESULTS COMPARISON
  // ═══════════════════════════════════════════════════════════════════════════════════════════
  
  console.log('┌───────────────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 🎯 WINNER PREDICTION ACCURACY                                                            │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');
  
  const allWinAcc = (allGames.winnerCorrect / allGames.winnerTotal * 100).toFixed(1);
  const agreeWinAcc = bothAgreeWinner.winnerTotal > 0 ? (bothAgreeWinner.winnerCorrect / bothAgreeWinner.winnerTotal * 100).toFixed(1) : 'N/A';
  const coverWinAcc = bothCoverSpread.winnerTotal > 0 ? (bothCoverSpread.winnerCorrect / bothCoverSpread.winnerTotal * 100).toFixed(1) : 'N/A';
  
  console.log('   Filter                         │ Win %      │ Games     │ Improvement');
  console.log('   ───────────────────────────────┼────────────┼───────────┼─────────────');
  console.log(`   ALL games (D-Ratings)          │ ${allWinAcc}%      │ ${allGames.winnerTotal.toString().padEnd(9)} │ baseline`);
  console.log(`   Both models agree on WINNER    │ ${agreeWinAcc}%      │ ${bothAgreeWinner.winnerTotal.toString().padEnd(9)} │ ${bothAgreeWinner.winnerTotal > 0 ? (parseFloat(agreeWinAcc) - parseFloat(allWinAcc) >= 0 ? '+' : '') + (parseFloat(agreeWinAcc) - parseFloat(allWinAcc)).toFixed(1) + '%' : 'N/A'}`);
  console.log(`   Both models predict COVER      │ ${coverWinAcc}%      │ ${bothCoverSpread.winnerTotal.toString().padEnd(9)} │ ${bothCoverSpread.winnerTotal > 0 ? (parseFloat(coverWinAcc) - parseFloat(allWinAcc) >= 0 ? '+' : '') + (parseFloat(coverWinAcc) - parseFloat(allWinAcc)).toFixed(1) + '%' : 'N/A'}`);

  console.log('\n┌───────────────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 📏 MARGIN PREDICTION ACCURACY (MAE - Lower is Better)                                    │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');
  
  const allMarginMAE = avg(allGames.marginErrors).toFixed(1);
  const agreeMarginMAE = bothAgreeWinner.marginErrors.length > 0 ? avg(bothAgreeWinner.marginErrors).toFixed(1) : 'N/A';
  const coverMarginMAE = bothCoverSpread.marginErrors.length > 0 ? avg(bothCoverSpread.marginErrors).toFixed(1) : 'N/A';
  
  console.log('   Filter                         │ MAE        │ Games     │ Improvement');
  console.log('   ───────────────────────────────┼────────────┼───────────┼─────────────');
  console.log(`   ALL games (D-Ratings)          │ ${allMarginMAE} pts    │ ${allGames.marginErrors.length.toString().padEnd(9)} │ baseline`);
  console.log(`   Both models agree on WINNER    │ ${agreeMarginMAE} pts    │ ${bothAgreeWinner.marginErrors.length.toString().padEnd(9)} │ ${bothAgreeWinner.marginErrors.length > 0 ? (parseFloat(allMarginMAE) - parseFloat(agreeMarginMAE) >= 0 ? '+' : '') + (parseFloat(allMarginMAE) - parseFloat(agreeMarginMAE)).toFixed(1) + ' pts' : 'N/A'}`);
  console.log(`   Both models predict COVER      │ ${coverMarginMAE} pts    │ ${bothCoverSpread.marginErrors.length.toString().padEnd(9)} │ ${bothCoverSpread.marginErrors.length > 0 ? (parseFloat(allMarginMAE) - parseFloat(coverMarginMAE) >= 0 ? '+' : '') + (parseFloat(allMarginMAE) - parseFloat(coverMarginMAE)).toFixed(1) + ' pts' : 'N/A'}`);

  console.log('\n┌───────────────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 🎰 ACTUAL SPREAD COVER RATE                                                               │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');
  
  const allCoverRate = allGames.spreadTotal > 0 ? (allGames.spreadCovers / allGames.spreadTotal * 100).toFixed(1) : 'N/A';
  const agreeCoverRate = bothAgreeWinner.spreadTotal > 0 ? (bothAgreeWinner.spreadCovers / bothAgreeWinner.spreadTotal * 100).toFixed(1) : 'N/A';
  const bothCoverRate = bothCoverSpread.spreadTotal > 0 ? (bothCoverSpread.spreadCovers / bothCoverSpread.spreadTotal * 100).toFixed(1) : 'N/A';
  
  console.log('   Filter                         │ Cover %    │ Games     │ Improvement');
  console.log('   ───────────────────────────────┼────────────┼───────────┼─────────────');
  console.log(`   ALL games (D-Ratings)          │ ${allCoverRate}%      │ ${allGames.spreadTotal.toString().padEnd(9)} │ baseline`);
  console.log(`   Both models agree on WINNER    │ ${agreeCoverRate}%      │ ${bothAgreeWinner.spreadTotal.toString().padEnd(9)} │ ${bothAgreeWinner.spreadTotal > 0 ? (parseFloat(agreeCoverRate) - parseFloat(allCoverRate) >= 0 ? '+' : '') + (parseFloat(agreeCoverRate) - parseFloat(allCoverRate)).toFixed(1) + '%' : 'N/A'}`);
  console.log(`   Both models predict COVER      │ ${bothCoverRate}%      │ ${bothCoverSpread.spreadTotal.toString().padEnd(9)} │ ${bothCoverSpread.spreadTotal > 0 ? (parseFloat(bothCoverRate) - parseFloat(allCoverRate) >= 0 ? '+' : '') + (parseFloat(bothCoverRate) - parseFloat(allCoverRate)).toFixed(1) + '%' : 'N/A'}`);

  // ═══════════════════════════════════════════════════════════════════════════════════════════
  // VERDICT
  // ═══════════════════════════════════════════════════════════════════════════════════════════
  
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                              VERDICT                                                      ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════════════════════╝\n');
  
  // Compare both cover filter to baseline
  if (bothCoverSpread.winnerTotal > 0 && allGames.winnerTotal > 0) {
    const winnerImprovement = parseFloat(coverWinAcc) - parseFloat(allWinAcc);
    const marginImprovement = parseFloat(allMarginMAE) - parseFloat(coverMarginMAE);
    const coverImprovement = bothCoverSpread.spreadTotal > 0 ? parseFloat(bothCoverRate) - parseFloat(allCoverRate) : 0;
    
    console.log('   📊 "BOTH MODELS COVER" FILTER ANALYSIS:');
    console.log('   ─────────────────────────────────────────────────────────────────');
    console.log(`   • Volume: ${bothCoverSpread.winnerTotal} games (${(bothCoverSpread.winnerTotal / allGames.winnerTotal * 100).toFixed(1)}% of all games)`);
    console.log(`   • Winner accuracy: ${winnerImprovement >= 0 ? '+' : ''}${winnerImprovement.toFixed(1)}% vs baseline`);
    console.log(`   • Margin accuracy: ${marginImprovement >= 0 ? '+' : ''}${marginImprovement.toFixed(1)} pts improvement`);
    console.log(`   • Actual cover rate: ${coverImprovement >= 0 ? '+' : ''}${coverImprovement.toFixed(1)}% vs baseline`);
    console.log('');
    
    const isWorth = winnerImprovement > 0 || marginImprovement > 0 || coverImprovement > 3;
    
    if (isWorth) {
      console.log('   ✅ VERDICT: "BOTH COVER" filter DOES improve accuracy');
      console.log('   Keep requiring both models to agree for spread opportunities.');
    } else {
      console.log('   ❌ VERDICT: "BOTH COVER" filter does NOT meaningfully improve accuracy');
      console.log('   Consider using D-Ratings alone (more volume, similar accuracy).');
    }
  }
  
  // Compare "both agree on winner" to baseline
  if (bothAgreeWinner.winnerTotal > 0 && allGames.winnerTotal > 0) {
    const winnerImprovement = parseFloat(agreeWinAcc) - parseFloat(allWinAcc);
    
    console.log('\n');
    console.log('   📊 "BOTH AGREE ON WINNER" FILTER ANALYSIS:');
    console.log('   ─────────────────────────────────────────────────────────────────');
    console.log(`   • Volume: ${bothAgreeWinner.winnerTotal} games (${(bothAgreeWinner.winnerTotal / allGames.winnerTotal * 100).toFixed(1)}% of all games)`);
    console.log(`   • Winner accuracy: ${winnerImprovement >= 0 ? '+' : ''}${winnerImprovement.toFixed(1)}% vs D-Ratings alone`);
    console.log('');
    
    if (winnerImprovement > 1) {
      console.log('   ✅ When both models agree on winner, accuracy improves significantly.');
      console.log('   This is a strong conviction signal.');
    } else if (winnerImprovement > 0) {
      console.log('   🤷 Marginal improvement when both models agree.');
    } else {
      console.log('   ❌ No improvement when both models agree - D-Ratings alone is sufficient.');
    }
  }

  console.log('\n');
  process.exit(0);
}

compareBothCover().catch(console.error);
