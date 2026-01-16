/**
 * 📊 DYNAMIC UNITS BACKTEST ANALYSIS
 * 
 * Pulls last week's completed CBB bets from Firebase and calculates
 * what P/L would have been with the current dynamic unit system
 * vs what was actually bet.
 */

import admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

// Initialize Firebase Admin
const serviceAccount = {
  project_id: process.env.VITE_FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// Load current confidence weights
let confidenceData = {};
try {
  const weightsPath = join(__dirname, '../public/basketball_confidence_weights.json');
  confidenceData = JSON.parse(fs.readFileSync(weightsPath, 'utf8'));
} catch (e) {
  console.log('⚠️ Could not load confidence weights, using defaults');
}

// ============================================
// DYNAMIC UNIT CALCULATION (from dynamicConfidenceUnits.js)
// ============================================

function classifyOdds(odds) {
  if (odds <= -300) return 'HEAVY_FAV';
  if (odds <= -200) return 'BIG_FAV';
  if (odds <= -150) return 'MOD_FAV';
  if (odds < -110) return 'SLIGHT_FAV';
  if (odds <= 110) return 'PICKEM';
  if (odds < 200) return 'SLIGHT_DOG';
  return 'BIG_DOG';
}

function classifyProb(prob) {
  if (prob >= 0.70) return 'HIGH_PROB';
  if (prob >= 0.60) return 'GOOD_PROB';
  if (prob >= 0.55) return 'MOD_PROB';
  return 'LOW_PROB';
}

function classifyEV(ev) {
  if (ev >= 20) return 'VERY_HIGH_EV';
  if (ev >= 15) return 'HIGH_EV';
  if (ev >= 10) return 'GOOD_EV';
  if (ev >= 5) return 'MOD_EV';
  if (ev >= 0) return 'LOW_EV';
  return 'NEG_EV';
}

function getROIMultiplier(roi) {
  if (roi === undefined || roi === null) return 1.0;
  if (roi <= -15) return 0.4;
  if (roi <= -10) return 0.6;
  if (roi <= -5) return 0.8;
  if (roi >= 10) return 1.2;
  if (roi >= 5) return 1.1;
  return 1.0;
}

function getCalibrationMultiplier(calibError) {
  if (calibError === undefined || calibError === null) return 1.0;
  if (calibError <= -0.15) return 0.5;
  if (calibError <= -0.10) return 0.7;
  if (calibError <= -0.05) return 0.85;
  if (calibError >= 0.05) return 1.1;
  return 1.0;
}

function calculateDynamicUnits(bet, confidenceData) {
  const MIN_SAMPLE_SIZE = 5;
  
  const grade = bet.prediction?.grade || 'C';
  const odds = bet.bet?.odds || bet.odds || 0;
  const ev = bet.prediction?.evPercent || bet.evPercent || 0;
  const pickTeam = bet.bet?.team || bet.bet?.pick;
  const isAwayBet = pickTeam === bet.game?.awayTeam;
  const modelProb = isAwayBet ? bet.prediction?.ensembleAwayProb : bet.prediction?.ensembleHomeProb;
  
  const classification = {
    grade,
    odds: classifyOdds(odds),
    probability: classifyProb(modelProb || 0.5),
    ev: classifyEV(ev)
  };
  
  const weights = confidenceData?.weights || {};
  const performance = confidenceData?.performance || {};
  
  let score = 0;
  
  // Grade contribution
  const gradePerf = performance?.grade?.[grade];
  let gradeWeight = weights.grade?.[grade] || 1.0;
  if (gradePerf?.total >= MIN_SAMPLE_SIZE) {
    gradeWeight *= getROIMultiplier(gradePerf.roi);
    gradeWeight *= getCalibrationMultiplier(gradePerf.calibError);
  }
  score += Math.min(gradeWeight, 2.0);
  
  // Odds contribution
  const oddsPerf = performance?.odds?.[classification.odds];
  let oddsWeight = weights.odds?.[classification.odds] || 1.0;
  if (oddsPerf?.total >= MIN_SAMPLE_SIZE) {
    oddsWeight *= getROIMultiplier(oddsPerf.roi);
    oddsWeight *= getCalibrationMultiplier(oddsPerf.calibError);
  }
  score += Math.min(oddsWeight, 1.5);
  
  // Probability contribution
  const probPerf = performance?.probability?.[classification.probability];
  let probWeight = weights.probability?.[classification.probability] || 1.0;
  if (probPerf?.total >= MIN_SAMPLE_SIZE) {
    probWeight *= getROIMultiplier(probPerf.roi);
    probWeight *= getCalibrationMultiplier(probPerf.calibError);
  }
  score += Math.min(probWeight, 1.5);
  
  // EV contribution
  const evPerf = performance?.ev?.[classification.ev];
  let evWeight = weights.ev?.[classification.ev] || 1.0;
  if (evPerf?.total >= MIN_SAMPLE_SIZE) {
    evWeight *= getROIMultiplier(evPerf.roi);
    evWeight *= getCalibrationMultiplier(evPerf.calibError);
  }
  score += Math.min(evWeight, 1.5);
  
  // Convert score to units
  let units;
  let tier;
  
  if (score >= 6) {
    units = 3.0;
    tier = 'MAX';
  } else if (score >= 5) {
    units = 2.5;
    tier = 'HIGH';
  } else if (score >= 4) {
    units = 2.0;
    tier = 'STRONG';
  } else if (score >= 3) {
    units = 1.5;
    tier = 'STANDARD';
  } else if (score >= 2) {
    units = 1.0;
    tier = 'REDUCED';
  } else if (score >= 1) {
    units = 0.5;
    tier = 'CAUTION';
  } else {
    units = 0.25;
    tier = 'MINIMAL';
  }
  
  return { units, tier, score, classification };
}

// ============================================
// MAIN ANALYSIS
// ============================================

async function analyzeBacktest() {
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════════════════════╗');
  console.log('║        📊 DYNAMIC UNITS BACKTEST ANALYSIS - LAST 7 DAYS 📊                   ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════════╝');
  console.log('\n');

  // Get completed bets from the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const betsSnapshot = await db.collection('basketball_bets')
    .where('status', '==', 'COMPLETED')
    .get();
  
  const allBets = betsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  
  // Filter to last 7 days
  const recentBets = allBets.filter(bet => {
    const betDate = bet.createdAt?.toDate?.() || bet.createdAt;
    if (!betDate) return true; // Include if no date (likely recent)
    return new Date(betDate) >= sevenDaysAgo;
  });
  
  console.log(`📋 Found ${recentBets.length} completed bets in last 7 days\n`);
  
  if (recentBets.length === 0) {
    console.log('⚠️ No completed bets found in the last 7 days');
    return;
  }
  
  // Calculate P/L with actual units vs dynamic units
  let actualPL = 0;
  let actualRisked = 0;
  let dynamicPL = 0;
  let dynamicRisked = 0;
  
  console.log('┌──────────────────────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ DATE       │ GAME                          │ RESULT │ ACTUAL U │ DYNAMIC U │ ACTUAL P/L │ DYN P/L │');
  console.log('├──────────────────────────────────────────────────────────────────────────────────────────────────┤');
  
  for (const bet of recentBets) {
    const outcome = bet.result?.outcome;
    const odds = bet.bet?.odds || 0;
    const actualUnits = bet.result?.units || bet.prediction?.unitSize || 1;
    
    // Calculate what dynamic units would have been
    const dynamicResult = calculateDynamicUnits(bet, confidenceData);
    const dynUnits = dynamicResult.units;
    
    // Calculate profit/loss
    let actualProfit = 0;
    let dynamicProfit = 0;
    
    if (outcome === 'WIN') {
      if (odds > 0) {
        actualProfit = actualUnits * (odds / 100);
        dynamicProfit = dynUnits * (odds / 100);
      } else {
        actualProfit = actualUnits * (100 / Math.abs(odds));
        dynamicProfit = dynUnits * (100 / Math.abs(odds));
      }
    } else if (outcome === 'LOSS') {
      actualProfit = -actualUnits;
      dynamicProfit = -dynUnits;
    }
    
    actualPL += actualProfit;
    actualRisked += actualUnits;
    dynamicPL += dynamicProfit;
    dynamicRisked += dynUnits;
    
    // Display
    const gameDate = bet.game?.gameDate || bet.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A';
    const dateStr = typeof gameDate === 'string' ? gameDate.substring(0, 10) : gameDate;
    const awayTeam = (bet.game?.awayTeam || '').substring(0, 12);
    const homeTeam = (bet.game?.homeTeam || '').substring(0, 12);
    const gameDisplay = `${awayTeam} @ ${homeTeam}`.padEnd(30);
    const resultEmoji = outcome === 'WIN' ? '✅' : outcome === 'LOSS' ? '❌' : '⏳';
    
    console.log(
      `│ ${String(dateStr).padEnd(10)} │ ${gameDisplay} │   ${resultEmoji}   │ ${actualUnits.toFixed(1).padStart(8)} │ ${dynUnits.toFixed(1).padStart(9)} │ ${(actualProfit >= 0 ? '+' : '') + actualProfit.toFixed(2).padStart(9)} │ ${(dynamicProfit >= 0 ? '+' : '') + dynamicProfit.toFixed(2).padStart(6)} │`
    );
  }
  
  console.log('└──────────────────────────────────────────────────────────────────────────────────────────────────┘');
  
  // Summary
  const actualROI = actualRisked > 0 ? (actualPL / actualRisked) * 100 : 0;
  const dynamicROI = dynamicRisked > 0 ? (dynamicPL / dynamicRisked) * 100 : 0;
  
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                              📊 SUMMARY 📊                                    ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════════╝');
  console.log('\n');
  
  console.log('                    │ ACTUAL SYSTEM      │ DYNAMIC SYSTEM     │ DIFFERENCE');
  console.log('────────────────────┼────────────────────┼────────────────────┼────────────────');
  console.log(`   Units Risked     │ ${actualRisked.toFixed(2).padStart(18)} │ ${dynamicRisked.toFixed(2).padStart(18)} │ ${(dynamicRisked - actualRisked).toFixed(2).padStart(14)}`);
  console.log(`   Profit/Loss      │ ${(actualPL >= 0 ? '+' : '') + actualPL.toFixed(2).padStart(17)} │ ${(dynamicPL >= 0 ? '+' : '') + dynamicPL.toFixed(2).padStart(17)} │ ${((dynamicPL - actualPL) >= 0 ? '+' : '') + (dynamicPL - actualPL).toFixed(2).padStart(13)}`);
  console.log(`   ROI              │ ${(actualROI >= 0 ? '+' : '') + actualROI.toFixed(1).padStart(16)}% │ ${(dynamicROI >= 0 ? '+' : '') + dynamicROI.toFixed(1).padStart(16)}% │ ${((dynamicROI - actualROI) >= 0 ? '+' : '') + (dynamicROI - actualROI).toFixed(1).padStart(12)}%`);
  console.log('────────────────────┴────────────────────┴────────────────────┴────────────────\n');
  
  // Verdict
  if (dynamicPL > actualPL) {
    console.log(`🎯 DYNAMIC SYSTEM WOULD HAVE SAVED: ${(dynamicPL - actualPL).toFixed(2)} units`);
  } else if (dynamicPL < actualPL) {
    console.log(`⚠️ DYNAMIC SYSTEM WOULD HAVE COST: ${(actualPL - dynamicPL).toFixed(2)} extra units`);
  } else {
    console.log('➖ Both systems would have performed equally');
  }
  
  console.log('\n✅ Backtest analysis complete!\n');
}

analyzeBacktest()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Backtest failed:', error);
    process.exit(1);
  });
