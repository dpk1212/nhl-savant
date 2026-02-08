/**
 * DEEP MODEL ACCURACY ANALYSIS
 * Statistical rigor to truly determine which model is better
 * 
 * Includes:
 * - Statistical significance testing (chi-square)
 * - Calibration analysis (when model says 70%, does team win 70%?)
 * - ROI simulation (which model makes more money?)
 * - When models DISAGREE - who is right?
 * - Upset prediction accuracy
 * - Brier Score (proper probability scoring)
 * - Time-based trends (is one getting better/worse?)
 * - By spread size
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

// Statistical functions
function chiSquareTest(correct1, total1, correct2, total2) {
  // 2x2 contingency table chi-square test
  const wrong1 = total1 - correct1;
  const wrong2 = total2 - correct2;
  const total = total1 + total2;
  
  // Expected values
  const totalCorrect = correct1 + correct2;
  const totalWrong = wrong1 + wrong2;
  
  const e11 = (total1 * totalCorrect) / total;
  const e12 = (total1 * totalWrong) / total;
  const e21 = (total2 * totalCorrect) / total;
  const e22 = (total2 * totalWrong) / total;
  
  // Chi-square statistic
  const chi2 = Math.pow(correct1 - e11, 2) / e11 +
               Math.pow(wrong1 - e12, 2) / e12 +
               Math.pow(correct2 - e21, 2) / e21 +
               Math.pow(wrong2 - e22, 2) / e22;
  
  // p-value approximation (1 df)
  // Using simple approximation
  let pValue;
  if (chi2 < 0.001) pValue = 1.0;
  else if (chi2 < 0.455) pValue = 0.5;
  else if (chi2 < 1.323) pValue = 0.25;
  else if (chi2 < 2.706) pValue = 0.1;
  else if (chi2 < 3.841) pValue = 0.05;
  else if (chi2 < 5.024) pValue = 0.025;
  else if (chi2 < 6.635) pValue = 0.01;
  else if (chi2 < 10.828) pValue = 0.001;
  else pValue = 0.0001;
  
  return { chi2, pValue };
}

function calculateBrierScore(predictions) {
  // Brier Score: mean squared error of probability predictions
  // Lower is better, 0 is perfect
  if (predictions.length === 0) return null;
  
  const sum = predictions.reduce((acc, p) => {
    const outcome = p.correct ? 1 : 0;
    return acc + Math.pow(p.probability - outcome, 2);
  }, 0);
  
  return sum / predictions.length;
}

function calculateROI(bets) {
  // Calculate ROI from betting each pick at given odds
  let totalWagered = 0;
  let totalReturned = 0;
  
  bets.forEach(bet => {
    const stake = 100; // $100 per bet
    totalWagered += stake;
    
    if (bet.correct) {
      const odds = bet.odds || -110;
      if (odds > 0) {
        totalReturned += stake + (stake * odds / 100);
      } else {
        totalReturned += stake + (stake * 100 / Math.abs(odds));
      }
    }
  });
  
  return ((totalReturned - totalWagered) / totalWagered) * 100;
}

function calculateCalibration(predictions, numBins = 10) {
  // Group predictions by probability bucket and compare to actual outcomes
  const bins = Array(numBins).fill(null).map(() => ({ predictions: 0, outcomes: 0 }));
  
  predictions.forEach(p => {
    const binIndex = Math.min(Math.floor(p.probability * numBins), numBins - 1);
    bins[binIndex].predictions++;
    if (p.correct) bins[binIndex].outcomes++;
  });
  
  return bins.map((bin, i) => ({
    range: `${(i * 10)}%-${((i + 1) * 10)}%`,
    predicted: ((i + 0.5) * 10),
    actual: bin.predictions > 0 ? (bin.outcomes / bin.predictions * 100) : null,
    count: bin.predictions
  })).filter(b => b.count > 0);
}

async function deepAnalysis() {
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════════════════════════════════╗');
  console.log('║              DEEP STATISTICAL ANALYSIS: HASLAMETRICS vs D-RATINGS                        ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════════════════════╝');
  console.log('\n');

  // Fetch all COMPLETED basketball bets
  const betsRef = collection(db, 'basketball_bets');
  const gradedQuery = query(betsRef, where('status', '==', 'COMPLETED'));
  const snapshot = await getDocs(gradedQuery);
  
  const bets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  console.log(`📊 Analyzing ${bets.length} completed bets...\n`);

  // ═══════════════════════════════════════════════════════════════════════════════════════════
  // DATA COLLECTION
  // ═══════════════════════════════════════════════════════════════════════════════════════════
  
  const hasla = { correct: 0, total: 0, predictions: [], byMonth: {}, bySpread: {} };
  const drate = { correct: 0, total: 0, predictions: [], byMonth: {}, bySpread: {} };
  const disagreements = { haslaCorrect: 0, drateCorrect: 0, total: 0, details: [] };
  const upsets = { haslaCorrect: 0, haslaTried: 0, drateCorrect: 0, drateTried: 0 };
  const favorites = { haslaCorrect: 0, haslaTried: 0, drateCorrect: 0, drateTried: 0 };

  bets.forEach(bet => {
    const prediction = bet.prediction || {};
    const result = bet.result || {};
    const betData = bet.bet || {};
    
    const actualAwayScore = result.awayScore;
    const actualHomeScore = result.homeScore;
    if (actualAwayScore === undefined || actualHomeScore === undefined) return;
    
    const actualWinner = actualAwayScore > actualHomeScore ? 'AWAY' : 'HOME';
    const odds = betData.odds || -110;
    const spread = betData.spread || 0;
    
    // Date for time analysis
    const gameDate = bet.gameDate || bet.date || '';
    const month = gameDate.slice(0, 7); // YYYY-MM
    
    // Get model predictions
    const haslaAway = prediction.haslametricsAwayScore;
    const haslaHome = prediction.haslametricsHomeScore;
    const drateAway = prediction.dratingsAwayScore;
    const drateHome = prediction.dratingsHomeScore;
    
    // Model probabilities (if available)
    let haslaProb = prediction.haslametricsAwayProb || prediction.haslametricsHomeProb;
    let drateProb = prediction.dratingsAwayProb || prediction.dratingsHomeProb;
    
    // Determine if betting side was underdog
    const bettingUnderdog = odds > 0;
    
    // Hasla analysis
    if (haslaAway != null && haslaHome != null) {
      const haslaWinner = haslaAway > haslaHome ? 'AWAY' : 'HOME';
      const haslaCorrect = haslaWinner === actualWinner;
      const haslaMargin = Math.abs(haslaAway - haslaHome);
      
      // Estimate probability if not available
      if (!haslaProb) {
        haslaProb = 0.5 + (haslaMargin / 40); // Simple estimation
        haslaProb = Math.min(0.95, Math.max(0.05, haslaProb));
      }
      
      hasla.total++;
      if (haslaCorrect) hasla.correct++;
      
      hasla.predictions.push({
        correct: haslaCorrect,
        probability: haslaProb,
        odds: odds,
        margin: haslaMargin,
        month: month
      });
      
      // By month
      if (!hasla.byMonth[month]) hasla.byMonth[month] = { correct: 0, total: 0 };
      hasla.byMonth[month].total++;
      if (haslaCorrect) hasla.byMonth[month].correct++;
      
      // By spread size
      const spreadBucket = Math.abs(spread) <= 3 ? 'small' : Math.abs(spread) <= 7 ? 'medium' : 'large';
      if (!hasla.bySpread[spreadBucket]) hasla.bySpread[spreadBucket] = { correct: 0, total: 0 };
      hasla.bySpread[spreadBucket].total++;
      if (haslaCorrect) hasla.bySpread[spreadBucket].correct++;
      
      // Upset tracking
      if (bettingUnderdog) {
        upsets.haslaTried++;
        if (haslaCorrect) upsets.haslaCorrect++;
      } else {
        favorites.haslaTried++;
        if (haslaCorrect) favorites.haslaCorrect++;
      }
    }
    
    // D-Ratings analysis  
    if (drateAway != null && drateHome != null) {
      const drateWinner = drateAway > drateHome ? 'AWAY' : 'HOME';
      const drateCorrect = drateWinner === actualWinner;
      const drateMargin = Math.abs(drateAway - drateHome);
      
      // Estimate probability if not available
      if (!drateProb) {
        drateProb = 0.5 + (drateMargin / 40);
        drateProb = Math.min(0.95, Math.max(0.05, drateProb));
      }
      
      drate.total++;
      if (drateCorrect) drate.correct++;
      
      drate.predictions.push({
        correct: drateCorrect,
        probability: drateProb,
        odds: odds,
        margin: drateMargin,
        month: month
      });
      
      // By month
      if (!drate.byMonth[month]) drate.byMonth[month] = { correct: 0, total: 0 };
      drate.byMonth[month].total++;
      if (drateCorrect) drate.byMonth[month].correct++;
      
      // By spread size
      const spreadBucket = Math.abs(spread) <= 3 ? 'small' : Math.abs(spread) <= 7 ? 'medium' : 'large';
      if (!drate.bySpread[spreadBucket]) drate.bySpread[spreadBucket] = { correct: 0, total: 0 };
      drate.bySpread[spreadBucket].total++;
      if (drateCorrect) drate.bySpread[spreadBucket].correct++;
      
      // Upset tracking
      if (bettingUnderdog) {
        upsets.drateTried++;
        if (drateCorrect) upsets.drateCorrect++;
      } else {
        favorites.drateTried++;
        if (drateCorrect) favorites.drateCorrect++;
      }
    }
    
    // Disagreement analysis
    if (haslaAway != null && haslaHome != null && drateAway != null && drateHome != null) {
      const haslaWinner = haslaAway > haslaHome ? 'AWAY' : 'HOME';
      const drateWinner = drateAway > drateHome ? 'AWAY' : 'HOME';
      
      if (haslaWinner !== drateWinner) {
        disagreements.total++;
        const haslaCorrect = haslaWinner === actualWinner;
        const drateCorrect = drateWinner === actualWinner;
        
        if (haslaCorrect) disagreements.haslaCorrect++;
        if (drateCorrect) disagreements.drateCorrect++;
        
        disagreements.details.push({
          awayTeam: bet.awayTeam,
          homeTeam: bet.homeTeam,
          haslaPick: haslaWinner,
          dratePick: drateWinner,
          actual: actualWinner,
          haslaCorrect,
          drateCorrect,
          odds
        });
      }
    }
  });

  // ═══════════════════════════════════════════════════════════════════════════════════════════
  // 1. STATISTICAL SIGNIFICANCE TEST
  // ═══════════════════════════════════════════════════════════════════════════════════════════
  
  console.log('┌───────────────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 📊 STATISTICAL SIGNIFICANCE TEST (Chi-Square)                                            │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');
  
  const haslaAcc = (hasla.correct / hasla.total * 100).toFixed(1);
  const drateAcc = (drate.correct / drate.total * 100).toFixed(1);
  
  console.log(`   HASLAMETRICS: ${haslaAcc}% (${hasla.correct}/${hasla.total})`);
  console.log(`   D-RATINGS:    ${drateAcc}% (${drate.correct}/${drate.total})`);
  console.log('');
  
  const { chi2, pValue } = chiSquareTest(hasla.correct, hasla.total, drate.correct, drate.total);
  
  console.log(`   Chi-square statistic: ${chi2.toFixed(4)}`);
  console.log(`   p-value: ${pValue < 0.05 ? '< 0.05 ✅ SIGNIFICANT' : `~${pValue} ❌ NOT SIGNIFICANT`}`);
  console.log('');
  
  if (pValue >= 0.05) {
    console.log(`   ⚠️  The ${Math.abs(parseFloat(haslaAcc) - parseFloat(drateAcc)).toFixed(1)}% difference is NOT statistically significant.`);
    console.log('   The models may actually be equivalent - the difference could be due to random chance.');
  } else {
    const better = parseFloat(haslaAcc) > parseFloat(drateAcc) ? 'HASLAMETRICS' : 'D-RATINGS';
    console.log(`   ✅ ${better} is statistically significantly better.`);
  }

  // ═══════════════════════════════════════════════════════════════════════════════════════════
  // 2. WHEN MODELS DISAGREE - THE TRUE TEST
  // ═══════════════════════════════════════════════════════════════════════════════════════════
  
  console.log('\n┌───────────────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 🎯 CRITICAL: WHEN MODELS DISAGREE (True Differentiator)                                   │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');
  
  if (disagreements.total > 0) {
    const haslaDisagreeAcc = (disagreements.haslaCorrect / disagreements.total * 100).toFixed(1);
    const drateDisagreeAcc = (disagreements.drateCorrect / disagreements.total * 100).toFixed(1);
    
    console.log(`   Total disagreements: ${disagreements.total} games`);
    console.log('');
    console.log(`   HASLAMETRICS correct: ${haslaDisagreeAcc}% (${disagreements.haslaCorrect}/${disagreements.total})`);
    console.log(`   D-RATINGS correct:    ${drateDisagreeAcc}% (${disagreements.drateCorrect}/${disagreements.total})`);
    console.log('');
    
    const disagreeWinner = parseFloat(haslaDisagreeAcc) > parseFloat(drateDisagreeAcc) ? 'HASLAMETRICS' : 'D-RATINGS';
    const disagreeDiff = Math.abs(parseFloat(haslaDisagreeAcc) - parseFloat(drateDisagreeAcc)).toFixed(1);
    
    console.log(`   🏆 WINNER IN DISAGREEMENTS: ${disagreeWinner} (+${disagreeDiff}%)`);
    console.log('');
    console.log('   💡 This is the most important metric - when models disagree,');
    console.log('      who should you trust?');
    
    // Chi-square for disagreements
    const disagreeStats = chiSquareTest(
      disagreements.haslaCorrect, disagreements.total,
      disagreements.drateCorrect, disagreements.total
    );
    console.log('');
    console.log(`   Statistical significance of disagreement difference:`);
    console.log(`   p-value: ${disagreeStats.pValue < 0.05 ? '< 0.05 ✅ SIGNIFICANT' : `~${disagreeStats.pValue} (not significant)`}`);
  } else {
    console.log('   No disagreements found in data.');
  }

  // ═══════════════════════════════════════════════════════════════════════════════════════════
  // 3. BRIER SCORE (Proper Probability Scoring)
  // ═══════════════════════════════════════════════════════════════════════════════════════════
  
  console.log('\n┌───────────────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 📈 BRIER SCORE (Probability Accuracy - Lower is Better)                                   │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');
  
  const haslaBrier = calculateBrierScore(hasla.predictions);
  const drateBrier = calculateBrierScore(drate.predictions);
  
  if (haslaBrier && drateBrier) {
    console.log(`   HASLAMETRICS Brier Score: ${haslaBrier.toFixed(4)}`);
    console.log(`   D-RATINGS Brier Score:    ${drateBrier.toFixed(4)}`);
    console.log('');
    
    const brierWinner = haslaBrier < drateBrier ? 'HASLAMETRICS' : 'D-RATINGS';
    const brierDiff = Math.abs(haslaBrier - drateBrier).toFixed(4);
    console.log(`   🏆 BETTER CALIBRATED: ${brierWinner} (by ${brierDiff})`);
    console.log('');
    console.log('   📖 Brier Score interpretation:');
    console.log('      0.00 = Perfect predictions');
    console.log('      0.25 = Random guessing');
    console.log('      0.15-0.20 = Good model');
    console.log('      < 0.15 = Excellent model');
  }

  // ═══════════════════════════════════════════════════════════════════════════════════════════
  // 4. ROI SIMULATION
  // ═══════════════════════════════════════════════════════════════════════════════════════════
  
  console.log('\n┌───────────────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 💰 ROI SIMULATION (If You Bet Every Pick)                                                 │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');
  
  const haslaROI = calculateROI(hasla.predictions);
  const drateROI = calculateROI(drate.predictions);
  
  console.log(`   HASLAMETRICS ROI: ${haslaROI >= 0 ? '+' : ''}${haslaROI.toFixed(2)}%`);
  console.log(`   D-RATINGS ROI:    ${drateROI >= 0 ? '+' : ''}${drateROI.toFixed(2)}%`);
  console.log('');
  
  const roiWinner = haslaROI > drateROI ? 'HASLAMETRICS' : 'D-RATINGS';
  console.log(`   🏆 MORE PROFITABLE: ${roiWinner}`);
  console.log('');
  console.log('   💡 This assumes flat betting $100 on every pick the model makes.');
  console.log('      Negative ROI is expected due to juice (-110 lines).');

  // ═══════════════════════════════════════════════════════════════════════════════════════════
  // 5. UPSET PREDICTION
  // ═══════════════════════════════════════════════════════════════════════════════════════════
  
  console.log('\n┌───────────────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 🎲 UPSET PREDICTION (Underdog Picks)                                                      │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');
  
  if (upsets.haslaTried > 0 && upsets.drateTried > 0) {
    const haslaUpsetAcc = (upsets.haslaCorrect / upsets.haslaTried * 100).toFixed(1);
    const drateUpsetAcc = (upsets.drateCorrect / upsets.drateTried * 100).toFixed(1);
    
    console.log(`   HASLAMETRICS on underdogs: ${haslaUpsetAcc}% (${upsets.haslaCorrect}/${upsets.haslaTried})`);
    console.log(`   D-RATINGS on underdogs:    ${drateUpsetAcc}% (${upsets.drateCorrect}/${upsets.drateTried})`);
    console.log('');
    
    const upsetWinner = parseFloat(haslaUpsetAcc) > parseFloat(drateUpsetAcc) ? 'HASLAMETRICS' : 'D-RATINGS';
    console.log(`   🏆 BETTER AT UPSETS: ${upsetWinner}`);
  }
  
  // Favorites
  console.log('');
  if (favorites.haslaTried > 0 && favorites.drateTried > 0) {
    const haslaFavAcc = (favorites.haslaCorrect / favorites.haslaTried * 100).toFixed(1);
    const drateFavAcc = (favorites.drateCorrect / favorites.drateTried * 100).toFixed(1);
    
    console.log(`   HASLAMETRICS on favorites: ${haslaFavAcc}% (${favorites.haslaCorrect}/${favorites.haslaTried})`);
    console.log(`   D-RATINGS on favorites:    ${drateFavAcc}% (${favorites.drateCorrect}/${favorites.drateTried})`);
  }

  // ═══════════════════════════════════════════════════════════════════════════════════════════
  // 6. BY SPREAD SIZE
  // ═══════════════════════════════════════════════════════════════════════════════════════════
  
  console.log('\n┌───────────────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 📊 ACCURACY BY SPREAD SIZE                                                                │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');
  
  console.log('   Spread Size    │ Haslametrics         │ D-Ratings            │ Winner');
  console.log('   ───────────────┼──────────────────────┼──────────────────────┼──────────');
  
  ['small', 'medium', 'large'].forEach(size => {
    const label = size === 'small' ? '≤3 pts   ' : size === 'medium' ? '4-7 pts  ' : '8+ pts   ';
    
    const hData = hasla.bySpread[size] || { correct: 0, total: 0 };
    const dData = drate.bySpread[size] || { correct: 0, total: 0 };
    
    const hAcc = hData.total > 0 ? (hData.correct / hData.total * 100).toFixed(1) : 'N/A';
    const dAcc = dData.total > 0 ? (dData.correct / dData.total * 100).toFixed(1) : 'N/A';
    
    const hStr = hData.total > 0 ? `${hAcc}% (${hData.correct}/${hData.total})`.padEnd(20) : 'N/A'.padEnd(20);
    const dStr = dData.total > 0 ? `${dAcc}% (${dData.correct}/${dData.total})`.padEnd(20) : 'N/A'.padEnd(20);
    
    let winner = 'Tie';
    if (hData.total > 0 && dData.total > 0) {
      winner = parseFloat(hAcc) > parseFloat(dAcc) ? 'Hasla' : parseFloat(dAcc) > parseFloat(hAcc) ? 'D-Rate' : 'Tie';
    }
    
    console.log(`   ${label}     │ ${hStr} │ ${dStr} │ ${winner}`);
  });

  // ═══════════════════════════════════════════════════════════════════════════════════════════
  // 7. TIME-BASED ANALYSIS
  // ═══════════════════════════════════════════════════════════════════════════════════════════
  
  console.log('\n┌───────────────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 📅 PERFORMANCE OVER TIME (Monthly Trends)                                                 │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');
  
  const allMonths = [...new Set([...Object.keys(hasla.byMonth), ...Object.keys(drate.byMonth)])].sort();
  
  if (allMonths.length > 0) {
    console.log('   Month    │ Haslametrics         │ D-Ratings            │ Winner');
    console.log('   ─────────┼──────────────────────┼──────────────────────┼──────────');
    
    allMonths.forEach(month => {
      const hData = hasla.byMonth[month] || { correct: 0, total: 0 };
      const dData = drate.byMonth[month] || { correct: 0, total: 0 };
      
      const hAcc = hData.total > 0 ? (hData.correct / hData.total * 100).toFixed(1) : 'N/A';
      const dAcc = dData.total > 0 ? (dData.correct / dData.total * 100).toFixed(1) : 'N/A';
      
      const hStr = hData.total > 0 ? `${hAcc}% (${hData.correct}/${hData.total})`.padEnd(20) : 'N/A'.padEnd(20);
      const dStr = dData.total > 0 ? `${dAcc}% (${dData.correct}/${dData.total})`.padEnd(20) : 'N/A'.padEnd(20);
      
      let winner = '';
      if (hData.total > 0 && dData.total > 0) {
        winner = parseFloat(hAcc) > parseFloat(dAcc) ? 'Hasla' : parseFloat(dAcc) > parseFloat(hAcc) ? 'D-Rate' : 'Tie';
      }
      
      console.log(`   ${month}  │ ${hStr} │ ${dStr} │ ${winner}`);
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════════════════════
  // FINAL VERDICT
  // ═══════════════════════════════════════════════════════════════════════════════════════════
  
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                              FINAL VERDICT                                                ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════════════════════╝\n');
  
  // Score each model
  let haslaPoints = 0;
  let dratePoints = 0;
  
  // Overall accuracy
  if (parseFloat(haslaAcc) > parseFloat(drateAcc)) haslaPoints += 1;
  else if (parseFloat(drateAcc) > parseFloat(haslaAcc)) dratePoints += 1;
  
  // Disagreement accuracy (weighted 2x - most important)
  if (disagreements.total > 0) {
    if (disagreements.haslaCorrect > disagreements.drateCorrect) haslaPoints += 2;
    else if (disagreements.drateCorrect > disagreements.haslaCorrect) dratePoints += 2;
  }
  
  // Brier score
  if (haslaBrier && drateBrier) {
    if (haslaBrier < drateBrier) haslaPoints += 1;
    else if (drateBrier < haslaBrier) dratePoints += 1;
  }
  
  // ROI
  if (haslaROI > drateROI) haslaPoints += 1;
  else if (drateROI > haslaROI) dratePoints += 1;
  
  // Upset accuracy
  if (upsets.haslaTried > 0 && upsets.drateTried > 0) {
    const haslaUpsetRate = upsets.haslaCorrect / upsets.haslaTried;
    const drateUpsetRate = upsets.drateCorrect / upsets.drateTried;
    if (haslaUpsetRate > drateUpsetRate) haslaPoints += 1;
    else if (drateUpsetRate > haslaUpsetRate) dratePoints += 1;
  }
  
  console.log('   SCORECARD:');
  console.log(`   ─────────────────────────────────────`);
  console.log(`   HASLAMETRICS: ${haslaPoints} points`);
  console.log(`   D-RATINGS:    ${dratePoints} points`);
  console.log('');
  
  if (haslaPoints > dratePoints) {
    console.log('   🏆 OVERALL WINNER: HASLAMETRICS');
  } else if (dratePoints > haslaPoints) {
    console.log('   🏆 OVERALL WINNER: D-RATINGS');
  } else {
    console.log('   🤝 RESULT: TIE - Models are essentially equivalent');
  }
  
  console.log('\n');
  console.log('   📌 STRATEGIC RECOMMENDATIONS:');
  console.log('');
  
  if (disagreements.total > 0) {
    const disagreeWinner = disagreements.haslaCorrect > disagreements.drateCorrect ? 'HASLAMETRICS' : 'D-RATINGS';
    console.log(`   1. When models DISAGREE → Trust ${disagreeWinner}`);
  }
  console.log('   2. When models AGREE → Bet with high confidence (63%+ accuracy)');
  console.log('   3. Consider using an ensemble approach (average both predictions)');
  
  if (upsets.haslaTried > 0 && upsets.drateTried > 0) {
    const haslaUpsetRate = upsets.haslaCorrect / upsets.haslaTried;
    const drateUpsetRate = upsets.drateCorrect / upsets.drateTried;
    const upsetModel = haslaUpsetRate > drateUpsetRate ? 'HASLAMETRICS' : 'D-RATINGS';
    console.log(`   4. For UNDERDOG plays → Slight edge to ${upsetModel}`);
  }
  
  console.log('\n');
  process.exit(0);
}

deepAnalysis().catch(console.error);
