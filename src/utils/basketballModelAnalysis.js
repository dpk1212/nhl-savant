/**
 * Basketball Model Analysis
 * Analyzes D-Ratings vs Haslametrics accuracy, alignment, and conviction score performance
 */

import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Calculate conviction score from bet data (works for old bets without stored conviction)
 */
function calculateConviction(bet) {
  const pred = bet.prediction;
  if (!pred) return null;
  
  const drAway = pred.dratingsAwayScore;
  const drHome = pred.dratingsHomeScore;
  const hsAway = pred.haslametricsAwayScore;
  const hsHome = pred.haslametricsHomeScore;
  
  if (!drAway || !drHome || !hsAway || !hsHome) return null;
  
  // Determine if pick is home or away
  const pickTeam = bet.bet?.pick;
  const awayTeam = bet.game?.awayTeam;
  const homeTeam = bet.game?.homeTeam;
  
  const pickIsAway = pickTeam === awayTeam;
  
  // D-Ratings prediction
  const drPicksAway = drAway > drHome;
  const drMargin = pickIsAway ? (drAway - drHome) : (drHome - drAway);
  
  // Haslametrics prediction
  const hsPicksAway = hsAway > hsHome;
  const hsMargin = pickIsAway ? (hsAway - hsHome) : (hsHome - hsAway);
  
  // Models agree if both favor the same team
  const modelsAgree = (drMargin > 0 && hsMargin > 0);
  const modelsSplit = (drMargin > 0) !== (hsMargin > 0);
  
  // Conviction = sum of margins for picked team
  const convictionScore = drMargin + hsMargin;
  
  return {
    drMargin: Math.round(drMargin * 10) / 10,
    hsMargin: Math.round(hsMargin * 10) / 10,
    convictionScore: Math.round(convictionScore * 10) / 10,
    modelsAgree,
    modelsSplit,
    drPicksOurPick: drMargin > 0,
    hsPicksOurPick: hsMargin > 0
  };
}

/**
 * Analyze all basketball bets for model accuracy
 */
export async function analyzeBasketballModels() {
  console.log('\n🏀 ═══════════════════════════════════════════════════════════');
  console.log('   BASKETBALL MODEL ANALYSIS - D-Ratings vs Haslametrics');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const betsQuery = query(collection(db, 'basketball_bets'));
  const snapshot = await getDocs(betsQuery);
  const bets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  const gradedBets = bets.filter(b => b.result?.outcome && (b.result.outcome === 'WIN' || b.result.outcome === 'LOSS'));
  
  console.log(`📊 Total bets: ${bets.length}`);
  console.log(`✅ Graded (W/L): ${gradedBets.length}\n`);
  
  // Analyze each bet
  const analysis = {
    // Model Agreement Stats
    aligned: { bets: [], wins: 0, losses: 0, profit: 0, risked: 0 },
    split: { bets: [], wins: 0, losses: 0, profit: 0, risked: 0 },
    noData: { bets: [], wins: 0, losses: 0, profit: 0, risked: 0 },
    
    // Individual Model Accuracy
    dratings: { correctPicks: 0, wrongPicks: 0, bets: [] },
    haslametrics: { correctPicks: 0, wrongPicks: 0, bets: [] },
    
    // Conviction Score Buckets
    highConviction: { bets: [], wins: 0, losses: 0, profit: 0 }, // >= 10
    medConviction: { bets: [], wins: 0, losses: 0, profit: 0 },  // 5-9.9
    lowConviction: { bets: [], wins: 0, losses: 0, profit: 0 },  // 0-4.9
    negConviction: { bets: [], wins: 0, losses: 0, profit: 0 }   // < 0
  };
  
  for (const bet of gradedBets) {
    const conviction = calculateConviction(bet);
    const isWin = bet.result.outcome === 'WIN';
    const profit = bet.result.profit || 0;
    const units = bet.result?.units || bet.prediction?.unitSize || 1.0;
    
    if (!conviction) {
      analysis.noData.bets.push(bet);
      if (isWin) analysis.noData.wins++;
      else analysis.noData.losses++;
      analysis.noData.profit += profit;
      analysis.noData.risked += units;
      continue;
    }
    
    // Model Agreement Analysis
    if (conviction.modelsAgree) {
      analysis.aligned.bets.push(bet);
      if (isWin) analysis.aligned.wins++;
      else analysis.aligned.losses++;
      analysis.aligned.profit += profit;
      analysis.aligned.risked += units;
    } else {
      analysis.split.bets.push(bet);
      if (isWin) analysis.split.wins++;
      else analysis.split.losses++;
      analysis.split.profit += profit;
      analysis.split.risked += units;
    }
    
    // Individual Model Accuracy
    // D-Ratings: Did it pick the winner?
    if (conviction.drPicksOurPick && isWin) analysis.dratings.correctPicks++;
    else if (!conviction.drPicksOurPick && !isWin) analysis.dratings.correctPicks++;
    else analysis.dratings.wrongPicks++;
    
    // Haslametrics: Did it pick the winner?
    if (conviction.hsPicksOurPick && isWin) analysis.haslametrics.correctPicks++;
    else if (!conviction.hsPicksOurPick && !isWin) analysis.haslametrics.correctPicks++;
    else analysis.haslametrics.wrongPicks++;
    
    // Conviction Score Buckets
    if (conviction.convictionScore >= 10) {
      analysis.highConviction.bets.push(bet);
      if (isWin) analysis.highConviction.wins++;
      else analysis.highConviction.losses++;
      analysis.highConviction.profit += profit;
    } else if (conviction.convictionScore >= 5) {
      analysis.medConviction.bets.push(bet);
      if (isWin) analysis.medConviction.wins++;
      else analysis.medConviction.losses++;
      analysis.medConviction.profit += profit;
    } else if (conviction.convictionScore >= 0) {
      analysis.lowConviction.bets.push(bet);
      if (isWin) analysis.lowConviction.wins++;
      else analysis.lowConviction.losses++;
      analysis.lowConviction.profit += profit;
    } else {
      analysis.negConviction.bets.push(bet);
      if (isWin) analysis.negConviction.wins++;
      else analysis.negConviction.losses++;
      analysis.negConviction.profit += profit;
    }
  }
  
  // Print Results
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('   📊 MODEL AGREEMENT ANALYSIS');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  const alignedTotal = analysis.aligned.wins + analysis.aligned.losses;
  const alignedWR = alignedTotal > 0 ? (analysis.aligned.wins / alignedTotal * 100) : 0;
  const alignedROI = analysis.aligned.risked > 0 ? (analysis.aligned.profit / analysis.aligned.risked * 100) : 0;
  
  const splitTotal = analysis.split.wins + analysis.split.losses;
  const splitWR = splitTotal > 0 ? (analysis.split.wins / splitTotal * 100) : 0;
  const splitROI = analysis.split.risked > 0 ? (analysis.split.profit / analysis.split.risked * 100) : 0;
  
  console.log(`🎯 BOTH MODELS ALIGNED (${alignedTotal} bets):`);
  console.log(`   W-L: ${analysis.aligned.wins}-${analysis.aligned.losses}`);
  console.log(`   Win Rate: ${alignedWR.toFixed(1)}%`);
  console.log(`   Profit: ${analysis.aligned.profit > 0 ? '+' : ''}${analysis.aligned.profit.toFixed(2)}u`);
  console.log(`   ROI: ${alignedROI > 0 ? '+' : ''}${alignedROI.toFixed(1)}%\n`);
  
  console.log(`⚖️ MODELS SPLIT (${splitTotal} bets):`);
  console.log(`   W-L: ${analysis.split.wins}-${analysis.split.losses}`);
  console.log(`   Win Rate: ${splitWR.toFixed(1)}%`);
  console.log(`   Profit: ${analysis.split.profit > 0 ? '+' : ''}${analysis.split.profit.toFixed(2)}u`);
  console.log(`   ROI: ${splitROI > 0 ? '+' : ''}${splitROI.toFixed(1)}%\n`);
  
  if (analysis.noData.bets.length > 0) {
    console.log(`❓ NO MODEL DATA (${analysis.noData.bets.length} bets):`);
    console.log(`   W-L: ${analysis.noData.wins}-${analysis.noData.losses}\n`);
  }
  
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('   🎯 INDIVIDUAL MODEL ACCURACY');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  const drTotal = analysis.dratings.correctPicks + analysis.dratings.wrongPicks;
  const drAccuracy = drTotal > 0 ? (analysis.dratings.correctPicks / drTotal * 100) : 0;
  
  const hsTotal = analysis.haslametrics.correctPicks + analysis.haslametrics.wrongPicks;
  const hsAccuracy = hsTotal > 0 ? (analysis.haslametrics.correctPicks / hsTotal * 100) : 0;
  
  console.log(`📈 D-RATINGS (80% weight):`);
  console.log(`   Correct: ${analysis.dratings.correctPicks}/${drTotal}`);
  console.log(`   Accuracy: ${drAccuracy.toFixed(1)}%\n`);
  
  console.log(`📊 HASLAMETRICS (20% weight):`);
  console.log(`   Correct: ${analysis.haslametrics.correctPicks}/${hsTotal}`);
  console.log(`   Accuracy: ${hsAccuracy.toFixed(1)}%\n`);
  
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('   💪 CONVICTION SCORE BREAKDOWN');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  const printConviction = (label, data) => {
    const total = data.wins + data.losses;
    const wr = total > 0 ? (data.wins / total * 100) : 0;
    console.log(`${label} (${total} bets):`);
    console.log(`   W-L: ${data.wins}-${data.losses}`);
    console.log(`   Win Rate: ${wr.toFixed(1)}%`);
    console.log(`   Profit: ${data.profit > 0 ? '+' : ''}${data.profit.toFixed(2)}u\n`);
  };
  
  printConviction('🔥 HIGH CONVICTION (≥10 pts)', analysis.highConviction);
  printConviction('📊 MEDIUM CONVICTION (5-9.9 pts)', analysis.medConviction);
  printConviction('📉 LOW CONVICTION (0-4.9 pts)', analysis.lowConviction);
  printConviction('⚠️ NEGATIVE CONVICTION (<0 pts)', analysis.negConviction);
  
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('   📋 RECOMMENDATIONS');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  if (alignedWR > splitWR + 5) {
    console.log('✅ ALIGNED picks significantly outperform SPLIT picks');
    console.log('   Consider: Higher unit sizing when models agree\n');
  }
  
  if (drAccuracy > hsAccuracy + 3) {
    console.log('✅ D-RATINGS is more accurate than Haslametrics');
    console.log(`   Edge: +${(drAccuracy - hsAccuracy).toFixed(1)}%\n`);
  } else if (hsAccuracy > drAccuracy + 3) {
    console.log('✅ HASLAMETRICS is more accurate than D-Ratings');
    console.log(`   Edge: +${(hsAccuracy - drAccuracy).toFixed(1)}%\n`);
  } else {
    console.log('⚖️ Both models have similar accuracy');
    console.log('   80/20 blend appears appropriate\n');
  }
  
  // Return structured data for programmatic use
  return {
    summary: {
      totalGraded: gradedBets.length,
      aligned: { count: alignedTotal, winRate: alignedWR, roi: alignedROI },
      split: { count: splitTotal, winRate: splitWR, roi: splitROI }
    },
    models: {
      dratings: { accuracy: drAccuracy, correct: analysis.dratings.correctPicks, total: drTotal },
      haslametrics: { accuracy: hsAccuracy, correct: analysis.haslametrics.correctPicks, total: hsTotal }
    },
    conviction: {
      high: { count: analysis.highConviction.bets.length, winRate: analysis.highConviction.wins / (analysis.highConviction.wins + analysis.highConviction.losses) * 100 || 0 },
      medium: { count: analysis.medConviction.bets.length, winRate: analysis.medConviction.wins / (analysis.medConviction.wins + analysis.medConviction.losses) * 100 || 0 },
      low: { count: analysis.lowConviction.bets.length, winRate: analysis.lowConviction.wins / (analysis.lowConviction.wins + analysis.lowConviction.losses) * 100 || 0 },
      negative: { count: analysis.negConviction.bets.length, winRate: analysis.negConviction.wins / (analysis.negConviction.wins + analysis.negConviction.losses) * 100 || 0 }
    }
  };
}

// Export for use in console or components
export default analyzeBasketballModels;
