/**
 * 🎯 DYNAMIC CONFIDENCE SYSTEM - ROI PATTERN WORKFLOW
 * 
 * Updates factor-level performance in Firebase daily
 * The confidence weights are CALCULATED from actual ROI data
 * 
 * Runs after gradeBasketballBets.js or manually:
 * node scripts/updateDynamicConfidence.js
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';
import * as dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

// Initialize Firebase CLIENT SDK
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('❌ Missing Firebase credentials');
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Calculate stats for a group of bets (including calibration)
 */
function calculateStats(bets) {
  let wins = 0;
  let losses = 0;
  let profit = 0;
  let risked = 0;
  let modelProbSum = 0;
  let betsWithProb = 0;

  bets.forEach(bet => {
    const units = bet.result?.units || 1;
    risked += units;
    
    // Get model probability for calibration
    const pickTeam = bet.bet?.team || bet.bet?.pick;
    const isAway = pickTeam === bet.game?.awayTeam || pickTeam === bet.awayTeam;
    const modelProb = isAway 
      ? (bet.prediction?.ensembleAwayProb || 0)
      : (bet.prediction?.ensembleHomeProb || 0);
    
    if (modelProb > 0) {
      modelProbSum += modelProb;
      betsWithProb++;
    }
    
    if (bet.result?.outcome === 'WIN') {
      wins++;
      const odds = bet.bet?.odds || -110;
      profit += odds > 0 ? units * (odds / 100) : units * (100 / Math.abs(odds));
    } else if (bet.result?.outcome === 'LOSS') {
      losses++;
      profit -= units;
    }
  });

  const total = wins + losses;
  const winRate = total > 0 ? (wins / total * 100) : 0;
  const roi = risked > 0 ? (profit / risked * 100) : 0;
  
  // CALIBRATION: Compare actual win rate to model's average prediction
  const avgModelProb = betsWithProb > 0 ? modelProbSum / betsWithProb : 0.5;
  const actualWinRate = total > 0 ? wins / total : 0.5;
  const calibError = actualWinRate - avgModelProb; // Positive = underconfident, Negative = overconfident

  return { 
    wins, 
    losses, 
    total, 
    winRate, 
    profit, 
    risked, 
    roi,
    // NEW: Calibration metrics
    avgModelProb: parseFloat(avgModelProb.toFixed(4)),
    actualWinRate: parseFloat(actualWinRate.toFixed(4)),
    calibError: parseFloat(calibError.toFixed(4))
  };
}

/**
 * Classify a bet into factors
 */
function classifyBet(bet) {
  const grade = bet.prediction?.grade || 'C';
  const odds = bet.bet?.odds || -110;
  const pickTeam = bet.bet?.team || bet.bet?.pick;
  const isAway = pickTeam === bet.game?.awayTeam;
  
  const ensembleProb = isAway 
    ? (bet.prediction?.ensembleAwayProb || 0.5)
    : (bet.prediction?.ensembleHomeProb || 0.5);
  
  const ev = bet.prediction?.evPercent || bet.prediction?.bestEV || 0;

  // Classify odds range (more granular for confidence)
  let oddsRange;
  if (odds <= -300) oddsRange = 'HEAVY_FAV';
  else if (odds > -300 && odds <= -200) oddsRange = 'BIG_FAV';
  else if (odds > -200 && odds <= -150) oddsRange = 'MOD_FAV';
  else if (odds > -150 && odds < -110) oddsRange = 'SLIGHT_FAV';
  else if (odds >= -110 && odds <= 110) oddsRange = 'PICKEM';
  else if (odds > 110 && odds < 200) oddsRange = 'SLIGHT_DOG';
  else oddsRange = 'BIG_DOG';

  // Classify model probability
  let probRange;
  if (ensembleProb >= 0.70) probRange = 'HIGH_PROB';
  else if (ensembleProb >= 0.60) probRange = 'GOOD_PROB';
  else if (ensembleProb >= 0.55) probRange = 'MOD_PROB';
  else probRange = 'LOW_PROB';

  // Classify EV
  let evRange;
  if (ev >= 20) evRange = 'VERY_HIGH_EV';
  else if (ev >= 15) evRange = 'HIGH_EV';
  else if (ev >= 10) evRange = 'GOOD_EV';
  else if (ev >= 5) evRange = 'MOD_EV';
  else if (ev >= 0) evRange = 'LOW_EV';
  else evRange = 'NEG_EV';

  return {
    grade,
    oddsRange,
    probRange,
    evRange,
    side: isAway ? 'AWAY' : 'HOME'
  };
}

/**
 * Convert ROI to a confidence weight
 * 
 * UPDATED: More aggressive exponential penalty for negative ROI
 * Based on Dec 14+ data analysis:
 *   SLIGHT_FAV: +11.1% ROI → boost
 *   PICKEM: -11.8% ROI → heavy penalty
 *   HEAVY_FAV: -4.2% ROI → moderate penalty
 */
function roiToWeight(roi, sampleSize, minSample = 10) {
  // Not enough data? Use neutral weight
  if (sampleSize < minSample) return 1.0;
  
  let weight;
  if (roi >= 0) {
    // Profitable patterns: proportional boost (1.0 to 2.0)
    // +5% ROI → 1.25
    // +10% ROI → 1.5
    // +15% ROI → 1.75
    weight = 1 + (roi / 20);
    weight = Math.min(2.0, weight);
  } else {
    // LOSING patterns: EXPONENTIAL penalty
    // -3% ROI → 0.7
    // -6% ROI → 0.5
    // -10% ROI → 0.3
    // -15% ROI → 0.15
    weight = Math.pow(0.5, Math.abs(roi) / 6);
    weight = Math.max(0.1, weight);
  }
  
  // Apply sample size confidence factor (blend toward 1.0 when sample small)
  const confidenceFactor = Math.min(1, sampleSize / 30);
  
  return 1.0 + (weight - 1.0) * confidenceFactor;
}

/**
 * Main update function
 */
export async function updateDynamicConfidence() {
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════════════════════╗');
  console.log('║          🎯 UPDATING DYNAMIC CONFIDENCE WEIGHTS 🎯                            ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════════╝');
  console.log('\n');

  // Fetch all completed bets
  const betsQuery = query(
    collection(db, 'basketball_bets'),
    where('status', '==', 'COMPLETED')
  );
  const betsSnapshot = await getDocs(betsQuery);
  
  const bets = betsSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  console.log(`📊 Analyzing ${bets.length} completed bets\n`);

  if (bets.length === 0) {
    console.log('⏭️ No completed bets to analyze');
    return;
  }

  // Group bets by each factor
  const byGrade = {};
  const byOdds = {};
  const byProb = {};
  const byEV = {};
  const bySide = {};
  const byModelsAgree = {};
  const byConvictionScore = {};

  bets.forEach(bet => {
    const factors = classifyBet(bet);
    
    // Grade
    if (!byGrade[factors.grade]) byGrade[factors.grade] = [];
    byGrade[factors.grade].push(bet);
    
    // Odds
    if (!byOdds[factors.oddsRange]) byOdds[factors.oddsRange] = [];
    byOdds[factors.oddsRange].push(bet);
    
    // Probability
    if (!byProb[factors.probRange]) byProb[factors.probRange] = [];
    byProb[factors.probRange].push(bet);
    
    // EV
    if (!byEV[factors.evRange]) byEV[factors.evRange] = [];
    byEV[factors.evRange].push(bet);
    
    // Side
    if (!bySide[factors.side]) bySide[factors.side] = [];
    bySide[factors.side].push(bet);
    
    // Models Agree (NEW TRACKING)
    const modelsAgree = bet.prediction?.modelsAgree;
    if (modelsAgree !== undefined) {
      const agreeKey = modelsAgree ? 'AGREE' : 'DISAGREE';
      if (!byModelsAgree[agreeKey]) byModelsAgree[agreeKey] = [];
      byModelsAgree[agreeKey].push(bet);
    }
    
    // Conviction Score (NEW TRACKING)
    const convictionScore = bet.prediction?.convictionScore;
    if (convictionScore !== undefined && convictionScore !== null) {
      // Group into ranges: 1-3 (LOW), 4-5 (MEDIUM), 6-7 (HIGH), 8-10 (ELITE)
      let convictionRange;
      if (convictionScore <= 3) convictionRange = 'LOW_1-3';
      else if (convictionScore <= 5) convictionRange = 'MED_4-5';
      else if (convictionScore <= 7) convictionRange = 'HIGH_6-7';
      else convictionRange = 'ELITE_8-10';
      
      if (!byConvictionScore[convictionRange]) byConvictionScore[convictionRange] = [];
      byConvictionScore[convictionRange].push(bet);
    }
  });

  // Calculate performance and weights for each factor
  const factorWeights = {
    grade: {},
    odds: {},
    probability: {},
    ev: {},
    side: {}
  };

  const factorPerformance = {
    grade: {},
    odds: {},
    probability: {},
    ev: {},
    side: {}
  };

  console.log('┌───────────────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ GRADE FACTOR PERFORMANCE + CALIBRATION                                                     │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');

  for (const [grade, gradeBets] of Object.entries(byGrade)) {
    const stats = calculateStats(gradeBets);
    const weight = roiToWeight(stats.roi, stats.total);
    
    factorWeights.grade[grade] = weight;
    factorPerformance.grade[grade] = stats;
    
    const roiEmoji = stats.roi > 0 ? '🟢' : stats.roi < -10 ? '🔴' : '🟡';
    const calibEmoji = stats.calibError > 0.05 ? '📈' : stats.calibError < -0.05 ? '📉' : '✅';
    console.log(`   ${roiEmoji} ${grade.padEnd(4)}: ${stats.total.toString().padStart(3)} bets | ${stats.roi >= 0 ? '+' : ''}${stats.roi.toFixed(1)}% ROI | ${calibEmoji} Calib: ${stats.calibError >= 0 ? '+' : ''}${(stats.calibError * 100).toFixed(1)}% | Wt: ${weight.toFixed(2)}`);
  }

  console.log('\n┌───────────────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ ODDS FACTOR PERFORMANCE + CALIBRATION                                                      │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');

  for (const [odds, oddsBets] of Object.entries(byOdds)) {
    const stats = calculateStats(oddsBets);
    const weight = roiToWeight(stats.roi, stats.total);
    
    factorWeights.odds[odds] = weight;
    factorPerformance.odds[odds] = stats;
    
    const roiEmoji = stats.roi > 0 ? '🟢' : stats.roi < -10 ? '🔴' : '🟡';
    const calibEmoji = stats.calibError > 0.05 ? '📈' : stats.calibError < -0.05 ? '📉' : '✅';
    console.log(`   ${roiEmoji} ${odds.padEnd(12)}: ${stats.total.toString().padStart(3)} bets | ${stats.roi >= 0 ? '+' : ''}${stats.roi.toFixed(1)}% ROI | ${calibEmoji} Calib: ${stats.calibError >= 0 ? '+' : ''}${(stats.calibError * 100).toFixed(1)}% | Wt: ${weight.toFixed(2)}`);
  }

  console.log('\n┌───────────────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ PROBABILITY FACTOR PERFORMANCE + CALIBRATION                                               │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');

  for (const [prob, probBets] of Object.entries(byProb)) {
    const stats = calculateStats(probBets);
    const weight = roiToWeight(stats.roi, stats.total);
    
    factorWeights.probability[prob] = weight;
    factorPerformance.probability[prob] = stats;
    
    const roiEmoji = stats.roi > 0 ? '🟢' : stats.roi < -10 ? '🔴' : '🟡';
    const calibEmoji = stats.calibError > 0.05 ? '📈' : stats.calibError < -0.05 ? '📉' : '✅';
    console.log(`   ${roiEmoji} ${prob.padEnd(12)}: ${stats.total.toString().padStart(3)} bets | ${stats.roi >= 0 ? '+' : ''}${stats.roi.toFixed(1)}% ROI | ${calibEmoji} Calib: ${stats.calibError >= 0 ? '+' : ''}${(stats.calibError * 100).toFixed(1)}% | Wt: ${weight.toFixed(2)}`);
  }

  console.log('\n┌───────────────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ EV FACTOR PERFORMANCE + CALIBRATION                                                        │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');

  for (const [ev, evBets] of Object.entries(byEV)) {
    const stats = calculateStats(evBets);
    const weight = roiToWeight(stats.roi, stats.total);
    
    factorWeights.ev[ev] = weight;
    factorPerformance.ev[ev] = stats;
    
    const roiEmoji = stats.roi > 0 ? '🟢' : stats.roi < -10 ? '🔴' : '🟡';
    const calibEmoji = stats.calibError > 0.05 ? '📈' : stats.calibError < -0.05 ? '📉' : '✅';
    console.log(`   ${roiEmoji} ${ev.padEnd(14)}: ${stats.total.toString().padStart(3)} bets | ${stats.roi >= 0 ? '+' : ''}${stats.roi.toFixed(1)}% ROI | ${calibEmoji} Calib: ${stats.calibError >= 0 ? '+' : ''}${(stats.calibError * 100).toFixed(1)}% | Wt: ${weight.toFixed(2)}`);
  }

  console.log('\n┌───────────────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ SIDE FACTOR PERFORMANCE + CALIBRATION                                                      │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');

  for (const [side, sideBets] of Object.entries(bySide)) {
    const stats = calculateStats(sideBets);
    const weight = roiToWeight(stats.roi, stats.total);
    
    factorWeights.side[side] = weight;
    factorPerformance.side[side] = stats;
    
    const roiEmoji = stats.roi > 0 ? '🟢' : stats.roi < -10 ? '🔴' : '🟡';
    const calibEmoji = stats.calibError > 0.05 ? '📈' : stats.calibError < -0.05 ? '📉' : '✅';
    console.log(`   ${roiEmoji} ${side.padEnd(6)}: ${stats.total.toString().padStart(3)} bets | ${stats.roi >= 0 ? '+' : ''}${stats.roi.toFixed(1)}% ROI | ${calibEmoji} Calib: ${stats.calibError >= 0 ? '+' : ''}${(stats.calibError * 100).toFixed(1)}% | Wt: ${weight.toFixed(2)}`);
  }

  // ═══════════════════════════════════════════════════════════════════════════════════════════
  // NEW: MODELS AGREE TRACKING (collecting data - not yet used for unit sizing)
  // ═══════════════════════════════════════════════════════════════════════════════════════════
  
  factorPerformance.modelsAgree = {};
  
  if (Object.keys(byModelsAgree).length > 0) {
    console.log('\n┌───────────────────────────────────────────────────────────────────────────────────────────┐');
    console.log('│ 🆕 MODELS AGREE TRACKING (data collection only)                                           │');
    console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');

    for (const [agree, agreeBets] of Object.entries(byModelsAgree)) {
      const stats = calculateStats(agreeBets);
      factorPerformance.modelsAgree[agree] = stats;
      
      const roiEmoji = stats.roi > 0 ? '🟢' : stats.roi < -10 ? '🔴' : '🟡';
      console.log(`   ${roiEmoji} ${agree.padEnd(10)}: ${stats.total.toString().padStart(3)} bets | Win: ${stats.winRate.toFixed(1)}% | ${stats.roi >= 0 ? '+' : ''}${stats.roi.toFixed(1)}% ROI | Profit: ${stats.profit >= 0 ? '+' : ''}${stats.profit.toFixed(2)}u`);
    }
    console.log(`\n   📊 Total bets with modelsAgree field: ${Object.values(byModelsAgree).reduce((a, b) => a + b.length, 0)}`);
  } else {
    console.log('\n   ⏳ MODELS AGREE: No data yet (field not present in completed bets)');
  }

  // ═══════════════════════════════════════════════════════════════════════════════════════════
  // NEW: CONVICTION SCORE TRACKING (collecting data - not yet used for unit sizing)
  // ═══════════════════════════════════════════════════════════════════════════════════════════
  
  factorPerformance.convictionScore = {};
  
  if (Object.keys(byConvictionScore).length > 0) {
    console.log('\n┌───────────────────────────────────────────────────────────────────────────────────────────┐');
    console.log('│ 🆕 CONVICTION SCORE TRACKING (data collection only)                                       │');
    console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');

    // Sort by conviction range
    const sortOrder = ['LOW_1-3', 'MED_4-5', 'HIGH_6-7', 'ELITE_8-10'];
    const sortedConviction = Object.entries(byConvictionScore)
      .sort((a, b) => sortOrder.indexOf(a[0]) - sortOrder.indexOf(b[0]));

    for (const [range, rangeBets] of sortedConviction) {
      const stats = calculateStats(rangeBets);
      factorPerformance.convictionScore[range] = stats;
      
      const roiEmoji = stats.roi > 0 ? '🟢' : stats.roi < -10 ? '🔴' : '🟡';
      console.log(`   ${roiEmoji} ${range.padEnd(12)}: ${stats.total.toString().padStart(3)} bets | Win: ${stats.winRate.toFixed(1)}% | ${stats.roi >= 0 ? '+' : ''}${stats.roi.toFixed(1)}% ROI | Profit: ${stats.profit >= 0 ? '+' : ''}${stats.profit.toFixed(2)}u`);
    }
    console.log(`\n   📊 Total bets with convictionScore field: ${Object.values(byConvictionScore).reduce((a, b) => a + b.length, 0)}`);
  } else {
    console.log('\n   ⏳ CONVICTION SCORE: No data yet (field not present in completed bets)');
  }

  // Save to local JSON file (public folder for frontend access)
  console.log('\n💾 Saving dynamic confidence weights...\n');

  const confidenceData = {
    weights: factorWeights,
    performance: factorPerformance,
    totalBets: bets.length,
    lastUpdated: new Date().toISOString(),
    
    // Also store the unit calculation formula parameters
    config: {
      // F grade hard cap
      fGradeCap: 0.5,
      
      // Min sample size for full weight confidence
      minSampleSize: 30,
      
      // Score to unit mapping thresholds
      unitThresholds: {
        elite: 5.5,    // 5u
        high: 4.5,     // 4u  
        good: 3.5,     // 3u
        moderate: 2.5, // 2u
        low: 0         // 1u
      },
      
      // Maximum weight contribution per factor (prevents runaway)
      maxWeightContribution: {
        grade: 2.0,
        odds: 2.0,
        probability: 1.5,
        ev: 1.0,
        side: 0.5
      }
    }
  };
  
  // Save to public folder for both backend scripts and frontend to access
  const outputPath = join(__dirname, '../public/basketball_confidence_weights.json');
  await fs.writeFile(outputPath, JSON.stringify(confidenceData, null, 2));
  console.log(`✅ Saved to ${outputPath}`);

  console.log('✅ Dynamic confidence weights saved!\n');

  // Show the current unit distribution with live weights
  console.log('┌─────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ CURRENT DYNAMIC UNIT FORMULA                                                │');
  console.log('└─────────────────────────────────────────────────────────────────────────────┘\n');

  console.log('   Confidence Score = Sum of weighted factors:\n');
  console.log('   Factor          │ Max Contribution │ Live Weights');
  console.log('   ────────────────┼──────────────────┼─────────────────────────────────');
  console.log(`   Grade           │      2.0         │ A: ${factorWeights.grade['A']?.toFixed(2) || 'N/A'}, B+: ${factorWeights.grade['B+']?.toFixed(2) || 'N/A'}, F: ${factorWeights.grade['F']?.toFixed(2) || 'N/A'}`);
  console.log(`   Odds            │      2.0         │ Sweet Spot: ${factorWeights.odds['MOD_FAV']?.toFixed(2) || 'N/A'}, Dogs: ${factorWeights.odds['SLIGHT_DOG']?.toFixed(2) || 'N/A'}`);
  console.log(`   Model Prob      │      1.5         │ High: ${factorWeights.probability['HIGH_PROB']?.toFixed(2) || 'N/A'}, Low: ${factorWeights.probability['LOW_PROB']?.toFixed(2) || 'N/A'}`);
  console.log(`   EV              │      1.0         │ Good: ${factorWeights.ev['GOOD_EV']?.toFixed(2) || 'N/A'}, Very High: ${factorWeights.ev['VERY_HIGH_EV']?.toFixed(2) || 'N/A'}`);
  console.log(`   Side            │      0.5         │ Away: ${factorWeights.side['AWAY']?.toFixed(2) || 'N/A'}, Home: ${factorWeights.side['HOME']?.toFixed(2) || 'N/A'}`);
  console.log();
  console.log('   Score to Units: 5.5+ → 5u | 4.5+ → 4u | 3.5+ → 3u | 2.5+ → 2u | else → 1u');
  console.log('   F Grade: ALWAYS CAPPED AT 0.5u');
  console.log();

  return { factorWeights, factorPerformance };
}

// Run if executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  updateDynamicConfidence()
    .then(() => {
      console.log('═══════════════════════════════════════════════════════════════════════════════\n');
      console.log('✅ Dynamic confidence update complete!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

