/**
 * BLEND OPTIMIZATION ANALYSIS
 * 
 * Questions to answer:
 * 1. Should EV model move from 80/20 to 90/10?
 * 2. For spread opportunities: 90/10 blend vs "both cover"?
 * 
 * Analyzes:
 * - Different blend weights (50/50, 60/40, 70/30, 80/20, 90/10, 100/0)
 * - Spread coverage comparison: both cover vs weighted blend
 * - ROI simulation for each approach
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

// Firebase config
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

async function analyzeBlendOptimization() {
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                    BLEND OPTIMIZATION ANALYSIS                                            ║');
  console.log('║              Should we use 80/20, 90/10, or 100% D-Ratings?                               ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════════════════════╝');
  console.log('\n');

  // Fetch all COMPLETED basketball bets
  const betsRef = collection(db, 'basketball_bets');
  const gradedQuery = query(betsRef, where('status', '==', 'COMPLETED'));
  const snapshot = await getDocs(gradedQuery);
  
  const bets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  console.log(`📊 Analyzing ${bets.length} completed bets...\n`);

  // ═══════════════════════════════════════════════════════════════════════════════════════════
  // PART 1: MONEYLINE WINNER PREDICTION - OPTIMAL BLEND WEIGHT
  // ═══════════════════════════════════════════════════════════════════════════════════════════
  
  const blendWeights = [
    { dr: 0.50, hs: 0.50, label: '50/50' },
    { dr: 0.60, hs: 0.40, label: '60/40' },
    { dr: 0.70, hs: 0.30, label: '70/30' },
    { dr: 0.80, hs: 0.20, label: '80/20 (current)' },
    { dr: 0.90, hs: 0.10, label: '90/10' },
    { dr: 1.00, hs: 0.00, label: '100/0 (D-Rate only)' }
  ];
  
  const blendResults = {};
  
  // For each bet, calculate winner prediction for each blend
  bets.forEach(bet => {
    const prediction = bet.prediction || {};
    const result = bet.result || {};
    const betData = bet.bet || {};
    
    const actualAwayScore = result.awayScore;
    const actualHomeScore = result.homeScore;
    if (actualAwayScore === undefined || actualHomeScore === undefined) return;
    
    const actualWinner = actualAwayScore > actualHomeScore ? 'AWAY' : 'HOME';
    const odds = betData.odds || -110;
    
    // Get model predicted scores
    const drAway = prediction.dratingsAwayScore;
    const drHome = prediction.dratingsHomeScore;
    const hsAway = prediction.haslametricsAwayScore;
    const hsHome = prediction.haslametricsHomeScore;
    
    // Need both models for blend comparison
    if (drAway == null || drHome == null || hsAway == null || hsHome == null) return;
    
    // For each blend weight, calculate blended prediction
    blendWeights.forEach(weight => {
      const blendedAwayScore = (drAway * weight.dr) + (hsAway * weight.hs);
      const blendedHomeScore = (drHome * weight.dr) + (hsHome * weight.hs);
      const blendedWinner = blendedAwayScore > blendedHomeScore ? 'AWAY' : 'HOME';
      const correct = blendedWinner === actualWinner;
      
      if (!blendResults[weight.label]) {
        blendResults[weight.label] = { correct: 0, total: 0, profit: 0, bets: [] };
      }
      
      blendResults[weight.label].total++;
      if (correct) {
        blendResults[weight.label].correct++;
        // Calculate profit
        if (odds > 0) {
          blendResults[weight.label].profit += 100 * odds / 100;
        } else {
          blendResults[weight.label].profit += 100 * 100 / Math.abs(odds);
        }
      } else {
        blendResults[weight.label].profit -= 100;
      }
    });
  });

  console.log('┌───────────────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 📊 PART 1: MONEYLINE WINNER PREDICTION - OPTIMAL BLEND                                   │');
  console.log('│ (Which D-Ratings/Haslametrics blend picks the most winners?)                             │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');
  
  console.log('   Blend Weight      │ Win Rate             │ ROI             │ Profit');
  console.log('   ──────────────────┼──────────────────────┼─────────────────┼──────────');
  
  let bestBlend = null;
  let bestWinRate = 0;
  
  blendWeights.forEach(weight => {
    const data = blendResults[weight.label];
    if (!data) return;
    
    const winRate = (data.correct / data.total * 100).toFixed(1);
    const roi = (data.profit / (data.total * 100) * 100).toFixed(2);
    const profitStr = data.profit >= 0 ? `+$${data.profit.toFixed(0)}` : `-$${Math.abs(data.profit).toFixed(0)}`;
    
    const isBest = parseFloat(winRate) > bestWinRate;
    if (isBest) {
      bestWinRate = parseFloat(winRate);
      bestBlend = weight.label;
    }
    
    const marker = isBest ? '👑' : '  ';
    console.log(`   ${marker} ${weight.label.padEnd(17)} │ ${winRate}% (${data.correct}/${data.total})`.padEnd(44) + `│ ${roi}%`.padEnd(18) + `│ ${profitStr}`);
  });
  
  console.log('');
  console.log(`   🏆 OPTIMAL BLEND FOR WINNER PREDICTION: ${bestBlend}`);

  // ═══════════════════════════════════════════════════════════════════════════════════════════
  // PART 2: SPREAD COVERAGE ANALYSIS
  // ═══════════════════════════════════════════════════════════════════════════════════════════
  
  console.log('\n');
  console.log('┌───────────────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 📊 PART 2: SPREAD COVERAGE - "BOTH COVER" vs WEIGHTED BLEND                              │');
  console.log('│ (Which approach better identifies actual spread covers?)                                  │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');
  
  // Analyze spread coverage accuracy
  const spreadAnalysis = {
    bothCover: { predicted: 0, actualCover: 0 },
    drOnly: { predicted: 0, actualCover: 0 },
    hsOnly: { predicted: 0, actualCover: 0 },
    blend90_10: { predicted: 0, actualCover: 0 },
    blend80_20: { predicted: 0, actualCover: 0 }
  };
  
  bets.forEach(bet => {
    const prediction = bet.prediction || {};
    const result = bet.result || {};
    const betData = bet.bet || {};
    const spreadData = bet.spreadAnalysis || {};
    
    const actualAwayScore = result.awayScore;
    const actualHomeScore = result.homeScore;
    if (actualAwayScore === undefined || actualHomeScore === undefined) return;
    
    // Need spread data
    const spread = spreadData.spread || betData.spread;
    if (!spread) return;
    
    // Get model predicted scores
    const drAway = prediction.dratingsAwayScore;
    const drHome = prediction.dratingsHomeScore;
    const hsAway = prediction.haslametricsAwayScore;
    const hsHome = prediction.haslametricsHomeScore;
    
    if (drAway == null || drHome == null || hsAway == null || hsHome == null) return;
    
    // Determine which team was bet on
    const pickedSide = betData.side || (betData.team === bet.awayTeam ? 'AWAY' : 'HOME');
    const isAway = pickedSide === 'AWAY' || pickedSide === 'away';
    
    // Calculate margins for picked team
    const drMargin = isAway ? (drAway - drHome) : (drHome - drAway);
    const hsMargin = isAway ? (hsAway - hsHome) : (hsHome - hsAway);
    
    // Did each model predict cover? (margin > spread for favorite, margin > -spread for dog)
    const spreadNum = Math.abs(spread);
    const drCovers = drMargin > spreadNum;
    const hsCovers = hsMargin > spreadNum;
    
    // Blended margins
    const margin90_10 = (drMargin * 0.9) + (hsMargin * 0.1);
    const margin80_20 = (drMargin * 0.8) + (hsMargin * 0.2);
    const blend90_10Covers = margin90_10 > spreadNum;
    const blend80_20Covers = margin80_20 > spreadNum;
    
    // Did bet ACTUALLY cover?
    const actualMargin = isAway ? (actualAwayScore - actualHomeScore) : (actualHomeScore - actualAwayScore);
    const actualCovered = actualMargin > spreadNum;
    
    // Track each prediction method
    if (drCovers && hsCovers) {
      spreadAnalysis.bothCover.predicted++;
      if (actualCovered) spreadAnalysis.bothCover.actualCover++;
    }
    
    if (drCovers) {
      spreadAnalysis.drOnly.predicted++;
      if (actualCovered) spreadAnalysis.drOnly.actualCover++;
    }
    
    if (hsCovers) {
      spreadAnalysis.hsOnly.predicted++;
      if (actualCovered) spreadAnalysis.hsOnly.actualCover++;
    }
    
    if (blend90_10Covers) {
      spreadAnalysis.blend90_10.predicted++;
      if (actualCovered) spreadAnalysis.blend90_10.actualCover++;
    }
    
    if (blend80_20Covers) {
      spreadAnalysis.blend80_20.predicted++;
      if (actualCovered) spreadAnalysis.blend80_20.actualCover++;
    }
  });
  
  console.log('   Method                │ Predicted Covers     │ Actual Covers        │ Accuracy');
  console.log('   ──────────────────────┼──────────────────────┼──────────────────────┼──────────');
  
  const spreadMethods = [
    { key: 'bothCover', label: 'Both Cover (current)' },
    { key: 'drOnly', label: 'D-Rate Only' },
    { key: 'hsOnly', label: 'Hasla Only' },
    { key: 'blend90_10', label: '90/10 Blend Cover' },
    { key: 'blend80_20', label: '80/20 Blend Cover' }
  ];
  
  let bestSpreadMethod = null;
  let bestSpreadAcc = 0;
  
  spreadMethods.forEach(method => {
    const data = spreadAnalysis[method.key];
    if (data.predicted === 0) return;
    
    const accuracy = (data.actualCover / data.predicted * 100).toFixed(1);
    
    const isBest = parseFloat(accuracy) > bestSpreadAcc;
    if (isBest) {
      bestSpreadAcc = parseFloat(accuracy);
      bestSpreadMethod = method.label;
    }
    
    const marker = isBest ? '👑' : '  ';
    console.log(`   ${marker} ${method.label.padEnd(20)} │ ${data.predicted.toString().padEnd(20)} │ ${data.actualCover.toString().padEnd(20)} │ ${accuracy}%`);
  });
  
  console.log('');
  console.log(`   🏆 BEST SPREAD COVERAGE METHOD: ${bestSpreadMethod}`);

  // ═══════════════════════════════════════════════════════════════════════════════════════════
  // PART 3: ROI BY BLEND FOR SPREAD BETS
  // ═══════════════════════════════════════════════════════════════════════════════════════════
  
  console.log('\n');
  console.log('┌───────────────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 📊 PART 3: SPREAD BET ROI BY METHOD                                                       │');
  console.log('│ (If we bet spreads using each method, what would ROI be?)                                 │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');
  
  const spreadROI = {
    bothCover: { wagered: 0, returned: 0 },
    drOnly: { wagered: 0, returned: 0 },
    blend90_10: { wagered: 0, returned: 0 },
    blend80_20: { wagered: 0, returned: 0 }
  };
  
  bets.forEach(bet => {
    const prediction = bet.prediction || {};
    const result = bet.result || {};
    const betData = bet.bet || {};
    const spreadData = bet.spreadAnalysis || {};
    
    const actualAwayScore = result.awayScore;
    const actualHomeScore = result.homeScore;
    if (actualAwayScore === undefined || actualHomeScore === undefined) return;
    
    const spread = spreadData.spread || betData.spread;
    if (!spread) return;
    
    const drAway = prediction.dratingsAwayScore;
    const drHome = prediction.dratingsHomeScore;
    const hsAway = prediction.haslametricsAwayScore;
    const hsHome = prediction.haslametricsHomeScore;
    
    if (drAway == null || drHome == null || hsAway == null || hsHome == null) return;
    
    const pickedSide = betData.side || (betData.team === bet.awayTeam ? 'AWAY' : 'HOME');
    const isAway = pickedSide === 'AWAY' || pickedSide === 'away';
    
    const drMargin = isAway ? (drAway - drHome) : (drHome - drAway);
    const hsMargin = isAway ? (hsAway - hsHome) : (hsHome - hsAway);
    const spreadNum = Math.abs(spread);
    
    const drCovers = drMargin > spreadNum;
    const hsCovers = hsMargin > spreadNum;
    const margin90_10 = (drMargin * 0.9) + (hsMargin * 0.1);
    const margin80_20 = (drMargin * 0.8) + (hsMargin * 0.2);
    const blend90_10Covers = margin90_10 > spreadNum;
    const blend80_20Covers = margin80_20 > spreadNum;
    
    const actualMargin = isAway ? (actualAwayScore - actualHomeScore) : (actualHomeScore - actualAwayScore);
    const actualCovered = actualMargin > spreadNum;
    
    // Simulate betting at -110 odds
    const stake = 100;
    const winPayout = stake * (100 / 110); // Standard -110 payout
    
    if (drCovers && hsCovers) {
      spreadROI.bothCover.wagered += stake;
      if (actualCovered) spreadROI.bothCover.returned += stake + winPayout;
    }
    
    if (drCovers) {
      spreadROI.drOnly.wagered += stake;
      if (actualCovered) spreadROI.drOnly.returned += stake + winPayout;
    }
    
    if (blend90_10Covers) {
      spreadROI.blend90_10.wagered += stake;
      if (actualCovered) spreadROI.blend90_10.returned += stake + winPayout;
    }
    
    if (blend80_20Covers) {
      spreadROI.blend80_20.wagered += stake;
      if (actualCovered) spreadROI.blend80_20.returned += stake + winPayout;
    }
  });
  
  console.log('   Method                │ Bets    │ ROI         │ Profit');
  console.log('   ──────────────────────┼─────────┼─────────────┼──────────');
  
  const roiMethods = [
    { key: 'bothCover', label: 'Both Cover (current)' },
    { key: 'drOnly', label: 'D-Rate Only' },
    { key: 'blend90_10', label: '90/10 Blend' },
    { key: 'blend80_20', label: '80/20 Blend' }
  ];
  
  let bestROIMethod = null;
  let bestROI = -999;
  
  roiMethods.forEach(method => {
    const data = spreadROI[method.key];
    if (data.wagered === 0) return;
    
    const roi = ((data.returned - data.wagered) / data.wagered * 100).toFixed(2);
    const profit = data.returned - data.wagered;
    const profitStr = profit >= 0 ? `+$${profit.toFixed(0)}` : `-$${Math.abs(profit).toFixed(0)}`;
    const numBets = Math.round(data.wagered / 100);
    
    const isBest = parseFloat(roi) > bestROI;
    if (isBest) {
      bestROI = parseFloat(roi);
      bestROIMethod = method.label;
    }
    
    const marker = isBest ? '👑' : '  ';
    console.log(`   ${marker} ${method.label.padEnd(20)} │ ${numBets.toString().padEnd(7)} │ ${roi}%`.padEnd(50) + ` │ ${profitStr}`);
  });
  
  console.log('');
  console.log(`   🏆 BEST ROI FOR SPREAD BETS: ${bestROIMethod}`);

  // ═══════════════════════════════════════════════════════════════════════════════════════════
  // FINAL RECOMMENDATIONS
  // ═══════════════════════════════════════════════════════════════════════════════════════════
  
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                              RECOMMENDATIONS                                              ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════════════════════╝\n');
  
  console.log('   📌 QUESTION 1: Should EV model move from 80/20 to 90/10?');
  console.log('   ─────────────────────────────────────────────────────────');
  
  const current80 = blendResults['80/20 (current)'];
  const proposed90 = blendResults['90/10'];
  const pure100 = blendResults['100/0 (D-Rate only)'];
  
  if (current80 && proposed90) {
    const diff = ((proposed90.correct / proposed90.total) - (current80.correct / current80.total)) * 100;
    if (diff > 0.5) {
      console.log(`   ✅ YES - Move to 90/10. Improvement of +${diff.toFixed(1)}% win rate.`);
    } else if (diff > -0.5) {
      console.log(`   🤷 MARGINAL - 90/10 is +${diff.toFixed(1)}% vs 80/20. Consider it, but difference is small.`);
    } else {
      console.log(`   ❌ NO - Keep 80/20. It's ${Math.abs(diff).toFixed(1)}% better than 90/10.`);
    }
  }
  
  if (pure100 && proposed90) {
    const pureVs90 = ((pure100.correct / pure100.total) - (proposed90.correct / proposed90.total)) * 100;
    if (pureVs90 > 0.5) {
      console.log(`   💡 CONSIDER: Pure D-Ratings (100/0) is ${pureVs90.toFixed(1)}% better than 90/10`);
    }
  }
  
  console.log('');
  console.log('   📌 QUESTION 2: Should spread opportunities use 90/10 blend instead of "both cover"?');
  console.log('   ────────────────────────────────────────────────────────────────────────────────────');
  
  const bothData = spreadAnalysis.bothCover;
  const blend90Data = spreadAnalysis.blend90_10;
  
  if (bothData.predicted > 0 && blend90Data.predicted > 0) {
    const bothAcc = (bothData.actualCover / bothData.predicted * 100);
    const blend90Acc = (blend90Data.actualCover / blend90Data.predicted * 100);
    
    if (blend90Acc > bothAcc + 1) {
      console.log(`   ✅ YES - 90/10 blend is ${(blend90Acc - bothAcc).toFixed(1)}% more accurate.`);
    } else if (bothAcc > blend90Acc + 1) {
      console.log(`   ❌ NO - Keep "both cover". It's ${(bothAcc - blend90Acc).toFixed(1)}% more accurate.`);
    } else {
      console.log(`   🤷 SIMILAR - Both methods within 1% accuracy.`);
      console.log(`      "Both cover": ${bothAcc.toFixed(1)}% (${bothData.predicted} opportunities)`);
      console.log(`      "90/10 blend": ${blend90Acc.toFixed(1)}% (${blend90Data.predicted} opportunities)`);
      console.log('');
      console.log(`   💡 Consider VOLUME: 90/10 gives ${blend90Data.predicted} picks vs ${bothData.predicted} for "both cover"`);
    }
  }
  
  console.log('\n');
  process.exit(0);
}

analyzeBlendOptimization().catch(console.error);
