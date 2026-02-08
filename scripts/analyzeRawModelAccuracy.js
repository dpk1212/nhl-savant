/**
 * RAW MODEL ACCURACY ANALYSIS
 * 
 * For each completed bet, compare:
 * 1. Predicted scores vs actual scores (MAE)
 * 2. Winner prediction accuracy
 * 3. Predicted margin vs actual margin
 * 
 * This tells us which model is FUNDAMENTALLY better at predicting games.
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

async function analyzeRawAccuracy() {
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                    RAW MODEL ACCURACY ANALYSIS                                            ║');
  console.log('║            Haslametrics vs D-Ratings: Who Predicts Games Better?                          ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════════════════════╝');
  console.log('\n');

  const betsRef = collection(db, 'basketball_bets');
  const gradedQuery = query(betsRef, where('status', '==', 'COMPLETED'));
  const snapshot = await getDocs(gradedQuery);
  
  const bets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  console.log(`📊 Analyzing ${bets.length} completed bets...\n`);

  // Tracking
  const hasla = {
    awayScoreErrors: [],
    homeScoreErrors: [],
    totalScoreErrors: [],
    marginErrors: [],
    winnerCorrect: 0,
    winnerTotal: 0,
    closerToActualMargin: 0
  };
  
  const drate = {
    awayScoreErrors: [],
    homeScoreErrors: [],
    totalScoreErrors: [],
    marginErrors: [],
    winnerCorrect: 0,
    winnerTotal: 0,
    closerToActualMargin: 0
  };
  
  let headToHeadTotal = 0;
  let ties = 0;

  // Detailed game-by-game for transparency
  const gameDetails = [];

  bets.forEach(bet => {
    const prediction = bet.prediction || {};
    const result = bet.result || {};
    
    const actualAway = result.awayScore;
    const actualHome = result.homeScore;
    if (actualAway === undefined || actualHome === undefined) return;
    
    const actualTotal = actualAway + actualHome;
    const actualMargin = actualAway - actualHome; // positive = away won
    const actualWinner = actualAway > actualHome ? 'AWAY' : 'HOME';
    
    // D-Ratings predictions
    const drAway = prediction.dratingsAwayScore;
    const drHome = prediction.dratingsHomeScore;
    
    // Haslametrics predictions
    const hsAway = prediction.haslametricsAwayScore;
    const hsHome = prediction.haslametricsHomeScore;
    
    // Skip if missing model data
    if (drAway == null || drHome == null || hsAway == null || hsHome == null) return;
    
    const drTotal = drAway + drHome;
    const drMargin = drAway - drHome;
    const drWinner = drAway > drHome ? 'AWAY' : 'HOME';
    
    const hsTotal = hsAway + hsHome;
    const hsMargin = hsAway - hsHome;
    const hsWinner = hsAway > hsHome ? 'AWAY' : 'HOME';
    
    // Score Errors (absolute)
    const drAwayError = Math.abs(drAway - actualAway);
    const drHomeError = Math.abs(drHome - actualHome);
    const drTotalError = Math.abs(drTotal - actualTotal);
    const drMarginError = Math.abs(drMargin - actualMargin);
    
    const hsAwayError = Math.abs(hsAway - actualAway);
    const hsHomeError = Math.abs(hsHome - actualHome);
    const hsTotalError = Math.abs(hsTotal - actualTotal);
    const hsMarginError = Math.abs(hsMargin - actualMargin);
    
    // Track D-Ratings
    drate.awayScoreErrors.push(drAwayError);
    drate.homeScoreErrors.push(drHomeError);
    drate.totalScoreErrors.push(drTotalError);
    drate.marginErrors.push(drMarginError);
    drate.winnerTotal++;
    if (drWinner === actualWinner) drate.winnerCorrect++;
    
    // Track Haslametrics
    hasla.awayScoreErrors.push(hsAwayError);
    hasla.homeScoreErrors.push(hsHomeError);
    hasla.totalScoreErrors.push(hsTotalError);
    hasla.marginErrors.push(hsMarginError);
    hasla.winnerTotal++;
    if (hsWinner === actualWinner) hasla.winnerCorrect++;
    
    // Head-to-head: Who was closer to actual margin?
    headToHeadTotal++;
    if (drMarginError < hsMarginError) {
      drate.closerToActualMargin++;
    } else if (hsMarginError < drMarginError) {
      hasla.closerToActualMargin++;
    } else {
      ties++;
    }
    
    // Store game detail
    gameDetails.push({
      game: `${bet.awayTeam} @ ${bet.homeTeam}`,
      actual: { away: actualAway, home: actualHome, margin: actualMargin },
      drate: { away: drAway, home: drHome, margin: drMargin, marginError: drMarginError, correct: drWinner === actualWinner },
      hasla: { away: hsAway, home: hsHome, margin: hsMargin, marginError: hsMarginError, correct: hsWinner === actualWinner }
    });
  });

  // Calculate averages
  const avg = arr => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  
  // ═══════════════════════════════════════════════════════════════════════════════════════════
  // RESULTS
  // ═══════════════════════════════════════════════════════════════════════════════════════════
  
  console.log('┌───────────────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 🎯 WINNER PREDICTION ACCURACY                                                            │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');
  
  const drWinAcc = (drate.winnerCorrect / drate.winnerTotal * 100).toFixed(1);
  const hsWinAcc = (hasla.winnerCorrect / hasla.winnerTotal * 100).toFixed(1);
  
  const winnerBetter = parseFloat(drWinAcc) > parseFloat(hsWinAcc) ? 'D-RATINGS' : 
                       parseFloat(hsWinAcc) > parseFloat(drWinAcc) ? 'HASLAMETRICS' : 'TIE';
  const winnerDiff = Math.abs(parseFloat(drWinAcc) - parseFloat(hsWinAcc)).toFixed(1);
  
  console.log(`   D-RATINGS:    ${drWinAcc}% (${drate.winnerCorrect}/${drate.winnerTotal} correct)`);
  console.log(`   HASLAMETRICS: ${hsWinAcc}% (${hasla.winnerCorrect}/${hasla.winnerTotal} correct)`);
  console.log('');
  console.log(`   🏆 BETTER AT PICKING WINNERS: ${winnerBetter} (+${winnerDiff}%)`);

  console.log('\n┌───────────────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 📏 PREDICTED SCORE ACCURACY (Mean Absolute Error - Lower is Better)                      │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');
  
  const drAwayMAE = avg(drate.awayScoreErrors).toFixed(1);
  const drHomeMAE = avg(drate.homeScoreErrors).toFixed(1);
  const drTotalMAE = avg(drate.totalScoreErrors).toFixed(1);
  
  const hsAwayMAE = avg(hasla.awayScoreErrors).toFixed(1);
  const hsHomeMAE = avg(hasla.homeScoreErrors).toFixed(1);
  const hsTotalMAE = avg(hasla.totalScoreErrors).toFixed(1);
  
  console.log('   Metric              │ D-Ratings     │ Haslametrics  │ Winner');
  console.log('   ────────────────────┼───────────────┼───────────────┼────────────────');
  
  const awayWinner = parseFloat(drAwayMAE) < parseFloat(hsAwayMAE) ? 'D-Ratings' : 
                     parseFloat(hsAwayMAE) < parseFloat(drAwayMAE) ? 'Haslametrics' : 'Tie';
  const homeWinner = parseFloat(drHomeMAE) < parseFloat(hsHomeMAE) ? 'D-Ratings' : 
                     parseFloat(hsHomeMAE) < parseFloat(drHomeMAE) ? 'Haslametrics' : 'Tie';
  const totalWinner = parseFloat(drTotalMAE) < parseFloat(hsTotalMAE) ? 'D-Ratings' : 
                      parseFloat(hsTotalMAE) < parseFloat(drTotalMAE) ? 'Haslametrics' : 'Tie';
  
  console.log(`   Away Score Error    │ ${drAwayMAE.padStart(8)} pts │ ${hsAwayMAE.padStart(8)} pts │ ${awayWinner}`);
  console.log(`   Home Score Error    │ ${drHomeMAE.padStart(8)} pts │ ${hsHomeMAE.padStart(8)} pts │ ${homeWinner}`);
  console.log(`   Total Score Error   │ ${drTotalMAE.padStart(8)} pts │ ${hsTotalMAE.padStart(8)} pts │ ${totalWinner}`);

  console.log('\n┌───────────────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 📊 MARGIN PREDICTION ACCURACY                                                            │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');
  
  const drMarginMAE = avg(drate.marginErrors).toFixed(1);
  const hsMarginMAE = avg(hasla.marginErrors).toFixed(1);
  
  const marginWinner = parseFloat(drMarginMAE) < parseFloat(hsMarginMAE) ? 'D-RATINGS' : 
                       parseFloat(hsMarginMAE) < parseFloat(drMarginMAE) ? 'HASLAMETRICS' : 'TIE';
  
  console.log(`   D-RATINGS:    ${drMarginMAE} points off average (predicted margin vs actual)`);
  console.log(`   HASLAMETRICS: ${hsMarginMAE} points off average (predicted margin vs actual)`);
  console.log('');
  console.log(`   🏆 MORE ACCURATE MARGINS: ${marginWinner}`);

  console.log('\n┌───────────────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 🥊 HEAD-TO-HEAD: WHO WAS CLOSER TO ACTUAL MARGIN EACH GAME?                               │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');
  
  const drCloserPct = (drate.closerToActualMargin / headToHeadTotal * 100).toFixed(1);
  const hsCloserPct = (hasla.closerToActualMargin / headToHeadTotal * 100).toFixed(1);
  const tiesPct = (ties / headToHeadTotal * 100).toFixed(1);
  
  console.log(`   Total games compared: ${headToHeadTotal}`);
  console.log('');
  console.log(`   D-RATINGS closer:    ${drate.closerToActualMargin} games (${drCloserPct}%)`);
  console.log(`   HASLAMETRICS closer: ${hasla.closerToActualMargin} games (${hsCloserPct}%)`);
  console.log(`   Ties (exact same):   ${ties} games (${tiesPct}%)`);
  console.log('');
  
  const h2hWinner = drate.closerToActualMargin > hasla.closerToActualMargin ? 'D-RATINGS' : 
                    hasla.closerToActualMargin > drate.closerToActualMargin ? 'HASLAMETRICS' : 'TIE';
  console.log(`   🏆 WINS HEAD-TO-HEAD: ${h2hWinner}`);

  // ═══════════════════════════════════════════════════════════════════════════════════════════
  // FINAL VERDICT
  // ═══════════════════════════════════════════════════════════════════════════════════════════
  
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                              FINAL SCORECARD                                              ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════════════════════╝\n');
  
  let drateScore = 0;
  let haslaScore = 0;
  
  // Winner prediction
  if (parseFloat(drWinAcc) > parseFloat(hsWinAcc)) drateScore++;
  else if (parseFloat(hsWinAcc) > parseFloat(drWinAcc)) haslaScore++;
  
  // Away score accuracy
  if (parseFloat(drAwayMAE) < parseFloat(hsAwayMAE)) drateScore++;
  else if (parseFloat(hsAwayMAE) < parseFloat(drAwayMAE)) haslaScore++;
  
  // Home score accuracy
  if (parseFloat(drHomeMAE) < parseFloat(hsHomeMAE)) drateScore++;
  else if (parseFloat(hsHomeMAE) < parseFloat(drHomeMAE)) haslaScore++;
  
  // Total score accuracy
  if (parseFloat(drTotalMAE) < parseFloat(hsTotalMAE)) drateScore++;
  else if (parseFloat(hsTotalMAE) < parseFloat(drTotalMAE)) haslaScore++;
  
  // Margin accuracy
  if (parseFloat(drMarginMAE) < parseFloat(hsMarginMAE)) drateScore++;
  else if (parseFloat(hsMarginMAE) < parseFloat(drMarginMAE)) haslaScore++;
  
  // Head-to-head closer
  if (drate.closerToActualMargin > hasla.closerToActualMargin) drateScore++;
  else if (hasla.closerToActualMargin > drate.closerToActualMargin) haslaScore++;
  
  console.log('   Category               │ D-Ratings  │ Haslametrics │ Winner');
  console.log('   ───────────────────────┼────────────┼──────────────┼────────────');
  console.log(`   Winner Prediction      │ ${drWinAcc}%     │ ${hsWinAcc}%       │ ${winnerBetter}`);
  console.log(`   Away Score MAE         │ ${drAwayMAE} pts   │ ${hsAwayMAE} pts     │ ${awayWinner}`);
  console.log(`   Home Score MAE         │ ${drHomeMAE} pts   │ ${hsHomeMAE} pts     │ ${homeWinner}`);
  console.log(`   Total Score MAE        │ ${drTotalMAE} pts  │ ${hsTotalMAE} pts    │ ${totalWinner}`);
  console.log(`   Margin MAE             │ ${drMarginMAE} pts   │ ${hsMarginMAE} pts     │ ${marginWinner}`);
  console.log(`   Head-to-Head Closer    │ ${drCloserPct}%     │ ${hsCloserPct}%       │ ${h2hWinner}`);
  console.log('   ───────────────────────┼────────────┼──────────────┼────────────');
  console.log(`   TOTAL SCORE            │ ${drateScore}          │ ${haslaScore}            │`);
  console.log('');
  
  const overallWinner = drateScore > haslaScore ? 'D-RATINGS' : 
                        haslaScore > drateScore ? 'HASLAMETRICS' : 'TIE';
  console.log(`   🏆 OVERALL MORE ACCURATE MODEL: ${overallWinner} (${Math.max(drateScore, haslaScore)}-${Math.min(drateScore, haslaScore)})`);
  
  // Specific recommendations
  console.log('\n');
  console.log('   📌 RECOMMENDATIONS BASED ON DATA:');
  console.log('   ─────────────────────────────────────────────────────────────────');
  
  if (overallWinner === 'D-RATINGS') {
    console.log(`   • D-Ratings is more accurate across ${drateScore}/6 metrics`);
    console.log(`   • Consider heavier D-Ratings weight (90/10 or 100/0)`);
  } else if (overallWinner === 'HASLAMETRICS') {
    console.log(`   • Haslametrics is more accurate across ${haslaScore}/6 metrics`);
    console.log(`   • Consider heavier Haslametrics weight`);
  } else {
    console.log(`   • Models are essentially equal`);
    console.log(`   • 50/50 blend is appropriate`);
  }
  
  // Sample of games where models disagreed and one was right
  console.log('\n');
  console.log('┌───────────────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 📋 SAMPLE: Games Where Models Disagreed on Winner                                        │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');
  
  const disagreements = gameDetails.filter(g => g.drate.correct !== g.hasla.correct);
  const drateWonDisagreements = disagreements.filter(g => g.drate.correct);
  const haslaWonDisagreements = disagreements.filter(g => g.hasla.correct);
  
  console.log(`   Total disagreements: ${disagreements.length} games`);
  console.log(`   D-Ratings correct:   ${drateWonDisagreements.length} (${(drateWonDisagreements.length/disagreements.length*100).toFixed(1)}%)`);
  console.log(`   Haslametrics correct: ${haslaWonDisagreements.length} (${(haslaWonDisagreements.length/disagreements.length*100).toFixed(1)}%)`);
  
  if (disagreements.length > 0) {
    console.log('\n   Sample games where D-Ratings was right, Hasla was wrong:');
    drateWonDisagreements.slice(0, 3).forEach(g => {
      console.log(`   • ${g.game}: Actual ${g.actual.margin > 0 ? 'Away' : 'Home'} by ${Math.abs(g.actual.margin)}`);
      console.log(`     DR: ${g.drate.margin > 0 ? 'Away' : 'Home'} by ${Math.abs(g.drate.margin).toFixed(1)} ✅ | HS: ${g.hasla.margin > 0 ? 'Away' : 'Home'} by ${Math.abs(g.hasla.margin).toFixed(1)} ❌`);
    });
    
    console.log('\n   Sample games where Haslametrics was right, D-Ratings was wrong:');
    haslaWonDisagreements.slice(0, 3).forEach(g => {
      console.log(`   • ${g.game}: Actual ${g.actual.margin > 0 ? 'Away' : 'Home'} by ${Math.abs(g.actual.margin)}`);
      console.log(`     DR: ${g.drate.margin > 0 ? 'Away' : 'Home'} by ${Math.abs(g.drate.margin).toFixed(1)} ❌ | HS: ${g.hasla.margin > 0 ? 'Away' : 'Home'} by ${Math.abs(g.hasla.margin).toFixed(1)} ✅`);
    });
  }

  console.log('\n');
  process.exit(0);
}

analyzeRawAccuracy().catch(console.error);
