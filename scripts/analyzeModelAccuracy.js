/**
 * MODEL ACCURACY ANALYSIS
 * Haslametrics vs D-Ratings Deep Dive
 * 
 * Analyzes all graded basketball bets to compare:
 * - Winner prediction accuracy
 * - Predicted margin vs actual margin
 * - Performance by odds range
 * - Performance by predicted margin
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

async function analyzeModelAccuracy() {
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                    HASLAMETRICS vs D-RATINGS ACCURACY ANALYSIS                            ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════════════════════╝');
  console.log('\n');

  // Fetch all COMPLETED basketball bets
  const betsRef = collection(db, 'basketball_bets');
  const gradedQuery = query(betsRef, where('status', '==', 'COMPLETED'));
  const snapshot = await getDocs(gradedQuery);
  
  const bets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  console.log(`📊 Analyzing ${bets.length} completed bets...\n`);

  // Tracking variables
  const hasla = { correct: 0, total: 0, marginErrors: [] };
  const dratings = { correct: 0, total: 0, marginErrors: [] };
  const combined = { bothCorrect: 0, bothWrong: 0, haslaOnly: 0, drateOnly: 0, total: 0 };
  
  // By predicted margin
  const byMargin = {
    hasla: { close: { correct: 0, total: 0 }, medium: { correct: 0, total: 0 }, blowout: { correct: 0, total: 0 } },
    drate: { close: { correct: 0, total: 0 }, medium: { correct: 0, total: 0 }, blowout: { correct: 0, total: 0 } }
  };
  
  // By odds range
  const byOdds = {
    hasla: { heavy_fav: { correct: 0, total: 0 }, favorite: { correct: 0, total: 0 }, pickem: { correct: 0, total: 0 }, underdog: { correct: 0, total: 0 } },
    drate: { heavy_fav: { correct: 0, total: 0 }, favorite: { correct: 0, total: 0 }, pickem: { correct: 0, total: 0 }, underdog: { correct: 0, total: 0 } }
  };

  // Process each bet
  bets.forEach(bet => {
    const prediction = bet.prediction || {};
    const result = bet.result || {};
    
    // Get actual scores
    const actualAwayScore = result.awayScore;
    const actualHomeScore = result.homeScore;
    
    if (actualAwayScore === undefined || actualHomeScore === undefined) return;
    
    // Determine actual winner
    const actualWinner = actualAwayScore > actualHomeScore ? 'AWAY' : 'HOME';
    const actualMargin = Math.abs(actualAwayScore - actualHomeScore);
    
    // Get model predictions
    const haslaAway = prediction.haslametricsAwayScore;
    const haslaHome = prediction.haslametricsHomeScore;
    const drateAway = prediction.dratingsAwayScore;
    const drateHome = prediction.dratingsHomeScore;
    
    // Odds classification
    const odds = bet.bet?.odds || 0;
    let oddsRange = 'pickem';
    if (odds <= -300) oddsRange = 'heavy_fav';
    else if (odds < -110) oddsRange = 'favorite';
    else if (odds > 150) oddsRange = 'underdog';
    
    // Haslametrics analysis
    if (haslaAway !== undefined && haslaHome !== undefined && haslaAway !== null && haslaHome !== null) {
      const haslaWinner = haslaAway > haslaHome ? 'AWAY' : 'HOME';
      const haslaMargin = Math.abs(haslaAway - haslaHome);
      const haslaCorrect = haslaWinner === actualWinner;
      
      hasla.total++;
      if (haslaCorrect) hasla.correct++;
      
      // Margin error
      hasla.marginErrors.push(Math.abs(haslaMargin - actualMargin));
      
      // By predicted margin
      const marginBucket = haslaMargin <= 3 ? 'close' : haslaMargin <= 10 ? 'medium' : 'blowout';
      byMargin.hasla[marginBucket].total++;
      if (haslaCorrect) byMargin.hasla[marginBucket].correct++;
      
      // By odds range
      byOdds.hasla[oddsRange].total++;
      if (haslaCorrect) byOdds.hasla[oddsRange].correct++;
    }
    
    // D-Ratings analysis
    if (drateAway !== undefined && drateHome !== undefined && drateAway !== null && drateHome !== null) {
      const drateWinner = drateAway > drateHome ? 'AWAY' : 'HOME';
      const drateMargin = Math.abs(drateAway - drateHome);
      const drateCorrect = drateWinner === actualWinner;
      
      dratings.total++;
      if (drateCorrect) dratings.correct++;
      
      // Margin error
      dratings.marginErrors.push(Math.abs(drateMargin - actualMargin));
      
      // By predicted margin
      const marginBucket = drateMargin <= 3 ? 'close' : drateMargin <= 10 ? 'medium' : 'blowout';
      byMargin.drate[marginBucket].total++;
      if (drateCorrect) byMargin.drate[marginBucket].correct++;
      
      // By odds range
      byOdds.drate[oddsRange].total++;
      if (drateCorrect) byOdds.drate[oddsRange].correct++;
    }
    
    // Head-to-head comparison
    if (haslaAway !== undefined && haslaHome !== undefined && drateAway !== undefined && drateHome !== undefined &&
        haslaAway !== null && haslaHome !== null && drateAway !== null && drateHome !== null) {
      const haslaWinner = haslaAway > haslaHome ? 'AWAY' : 'HOME';
      const drateWinner = drateAway > drateHome ? 'AWAY' : 'HOME';
      const haslaCorrect = haslaWinner === actualWinner;
      const drateCorrect = drateWinner === actualWinner;
      
      combined.total++;
      if (haslaCorrect && drateCorrect) combined.bothCorrect++;
      else if (!haslaCorrect && !drateCorrect) combined.bothWrong++;
      else if (haslaCorrect) combined.haslaOnly++;
      else combined.drateOnly++;
    }
  });

  // ═══════════════════════════════════════════════════════════════════════════════════════════
  // RESULTS OUTPUT
  // ═══════════════════════════════════════════════════════════════════════════════════════════

  console.log('┌───────────────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 🎯 OVERALL WINNER PREDICTION ACCURACY                                                     │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');

  const haslaAcc = hasla.total > 0 ? (hasla.correct / hasla.total * 100).toFixed(1) : 'N/A';
  const drateAcc = dratings.total > 0 ? (dratings.correct / dratings.total * 100).toFixed(1) : 'N/A';
  
  const winner = parseFloat(haslaAcc) > parseFloat(drateAcc) ? 'HASLAMETRICS' : 'D-RATINGS';
  const diff = Math.abs(parseFloat(haslaAcc) - parseFloat(drateAcc)).toFixed(1);
  
  const haslaEmoji = parseFloat(haslaAcc) >= parseFloat(drateAcc) ? '👑' : '  ';
  const drateEmoji = parseFloat(drateAcc) >= parseFloat(haslaAcc) ? '👑' : '  ';
  
  console.log(`   ${haslaEmoji} HASLAMETRICS: ${haslaAcc}% (${hasla.correct}/${hasla.total} correct)`);
  console.log(`   ${drateEmoji} D-RATINGS:    ${drateAcc}% (${dratings.correct}/${dratings.total} correct)`);
  console.log('');
  if (hasla.total > 0 && dratings.total > 0) {
    console.log(`   ✅ WINNER: ${winner} by ${diff} percentage points`);
  }
  
  // Head-to-head
  if (combined.total > 0) {
    console.log('\n┌───────────────────────────────────────────────────────────────────────────────────────────┐');
    console.log('│ 🤝 HEAD-TO-HEAD COMPARISON                                                                │');
    console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');
    
    console.log(`   Total bets with both models: ${combined.total}`);
    console.log('');
    console.log(`   ✅ Both correct:       ${combined.bothCorrect} (${(combined.bothCorrect/combined.total*100).toFixed(1)}%)`);
    console.log(`   ❌ Both wrong:         ${combined.bothWrong} (${(combined.bothWrong/combined.total*100).toFixed(1)}%)`);
    console.log(`   🔷 Hasla only correct: ${combined.haslaOnly} (${(combined.haslaOnly/combined.total*100).toFixed(1)}%)`);
    console.log(`   🔶 D-Rate only correct: ${combined.drateOnly} (${(combined.drateOnly/combined.total*100).toFixed(1)}%)`);
    
    // Calculate when models agree
    const agreeTotal = combined.bothCorrect + combined.bothWrong;
    const agreeAccuracy = agreeTotal > 0 ? (combined.bothCorrect / agreeTotal * 100).toFixed(1) : 'N/A';
    console.log('');
    console.log(`   🔗 When models AGREE: ${agreeAccuracy}% accuracy (${combined.bothCorrect}/${agreeTotal})`);
  }

  // Margin error analysis
  console.log('\n┌───────────────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 📏 PREDICTED MARGIN ACCURACY (Average Points Off)                                         │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');
  
  const haslaAvgError = hasla.marginErrors.length > 0 
    ? (hasla.marginErrors.reduce((a, b) => a + b, 0) / hasla.marginErrors.length).toFixed(1)
    : 'N/A';
  const drateAvgError = dratings.marginErrors.length > 0 
    ? (dratings.marginErrors.reduce((a, b) => a + b, 0) / dratings.marginErrors.length).toFixed(1)
    : 'N/A';
    
  const marginWinner = parseFloat(haslaAvgError) < parseFloat(drateAvgError) ? 'HASLAMETRICS' : 'D-RATINGS';
  const haslaMarginEmoji = parseFloat(haslaAvgError) <= parseFloat(drateAvgError) ? '👑' : '  ';
  const drateMarginEmoji = parseFloat(drateAvgError) <= parseFloat(haslaAvgError) ? '👑' : '  ';
  
  console.log(`   (Lower is better - how many points off was the predicted margin)`);
  console.log('');
  console.log(`   ${haslaMarginEmoji} HASLAMETRICS: ${haslaAvgError} points off average`);
  console.log(`   ${drateMarginEmoji} D-RATINGS:    ${drateAvgError} points off average`);
  console.log('');
  if (hasla.marginErrors.length > 0 && dratings.marginErrors.length > 0) {
    console.log(`   ✅ MORE ACCURATE MARGINS: ${marginWinner}`);
  }

  // By predicted margin
  console.log('\n┌───────────────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 📊 ACCURACY BY PREDICTED MARGIN                                                           │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');
  
  console.log('   Margin Category    │ Haslametrics         │ D-Ratings');
  console.log('   ───────────────────┼──────────────────────┼──────────────────────');
  
  ['close', 'medium', 'blowout'].forEach(margin => {
    const label = margin === 'close' ? 'Close (≤3 pts)   ' : margin === 'medium' ? 'Medium (4-10 pts)' : 'Blowout (11+ pts)';
    const hAcc = byMargin.hasla[margin].total > 0 
      ? `${(byMargin.hasla[margin].correct / byMargin.hasla[margin].total * 100).toFixed(1)}% (${byMargin.hasla[margin].correct}/${byMargin.hasla[margin].total})`.padEnd(20)
      : 'N/A'.padEnd(20);
    const dAcc = byMargin.drate[margin].total > 0 
      ? `${(byMargin.drate[margin].correct / byMargin.drate[margin].total * 100).toFixed(1)}% (${byMargin.drate[margin].correct}/${byMargin.drate[margin].total})`.padEnd(20)
      : 'N/A'.padEnd(20);
    console.log(`   ${label} │ ${hAcc} │ ${dAcc}`);
  });

  // By odds range
  console.log('\n┌───────────────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 💰 ACCURACY BY ODDS RANGE                                                                 │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');
  
  console.log('   Odds Range              │ Haslametrics         │ D-Ratings');
  console.log('   ────────────────────────┼──────────────────────┼──────────────────────');
  
  const oddsLabels = { 
    heavy_fav: 'Heavy Fav (≤-300)     ', 
    favorite: 'Favorite (-299 to -111)', 
    pickem: 'Pick\'em (-110 to +150) ', 
    underdog: 'Underdog (+151+)       ' 
  };
  Object.entries(oddsLabels).forEach(([key, label]) => {
    const hAcc = byOdds.hasla[key].total > 0 
      ? `${(byOdds.hasla[key].correct / byOdds.hasla[key].total * 100).toFixed(1)}% (${byOdds.hasla[key].correct}/${byOdds.hasla[key].total})`.padEnd(20)
      : 'N/A'.padEnd(20);
    const dAcc = byOdds.drate[key].total > 0 
      ? `${(byOdds.drate[key].correct / byOdds.drate[key].total * 100).toFixed(1)}% (${byOdds.drate[key].correct}/${byOdds.drate[key].total})`.padEnd(20)
      : 'N/A'.padEnd(20);
    console.log(`   ${label} │ ${hAcc} │ ${dAcc}`);
  });

  // Conclusion
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                                     CONCLUSION                                            ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════════════════════╝\n');
  
  const haslaAdvantages = [];
  const drateAdvantages = [];
  
  if (parseFloat(haslaAcc) > parseFloat(drateAcc)) haslaAdvantages.push('Overall winner accuracy');
  else if (parseFloat(drateAcc) > parseFloat(haslaAcc)) drateAdvantages.push('Overall winner accuracy');
  
  if (parseFloat(haslaAvgError) < parseFloat(drateAvgError)) haslaAdvantages.push('Margin prediction');
  else if (parseFloat(drateAvgError) < parseFloat(haslaAvgError)) drateAdvantages.push('Margin prediction');
  
  if (combined.haslaOnly > combined.drateOnly) haslaAdvantages.push('Unique correct picks');
  else if (combined.drateOnly > combined.haslaOnly) drateAdvantages.push('Unique correct picks');
  
  console.log(`   📊 HASLAMETRICS strengths: ${haslaAdvantages.join(', ') || 'None identified'}`);
  console.log(`   📊 D-RATINGS strengths: ${drateAdvantages.join(', ') || 'None identified'}`);
  console.log('');
  
  const recommendedModel = haslaAdvantages.length > drateAdvantages.length ? 'HASLAMETRICS' : 
                           drateAdvantages.length > haslaAdvantages.length ? 'D-RATINGS' : 
                           'ENSEMBLE (both equal)';
  console.log(`   🏆 RECOMMENDED PRIMARY MODEL: ${recommendedModel}`);
  console.log('');
  
  if (combined.total > 0) {
    const agreeTotal = combined.bothCorrect + combined.bothWrong;
    const agreeAccuracy = agreeTotal > 0 ? (combined.bothCorrect / agreeTotal * 100).toFixed(1) : 'N/A';
    const disagreTotal = combined.haslaOnly + combined.drateOnly;
    
    console.log(`   💡 KEY INSIGHT: When models AGREE they are ${agreeAccuracy}% accurate`);
    console.log(`      Models agree on ${((agreeTotal / combined.total) * 100).toFixed(1)}% of games`);
    console.log(`      Models disagree on ${((disagreTotal / combined.total) * 100).toFixed(1)}% of games`);
  }
  
  console.log('\n');
  process.exit(0);
}

analyzeModelAccuracy().catch(console.error);
