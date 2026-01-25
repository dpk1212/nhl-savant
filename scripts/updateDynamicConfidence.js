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
  const bySpreadSource = {};  // SPREAD_OPPORTUNITY vs regular EV bets
  const bySpreadConfirmed = {}; // EV bets reinforced by spread analysis

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
    
    // Spread Opportunity Tracking (source field)
    const source = bet.source || 'EV_PICK';  // Default to EV_PICK if no source
    if (!bySpreadSource[source]) bySpreadSource[source] = [];
    bySpreadSource[source].push(bet);
    
    // EV bets with Spread Confirmation (reinforced by spread analysis)
    const spreadConfirmed = bet.prediction?.spreadConfirmed || bet.spreadAnalysis?.marginOverSpread;
    if (spreadConfirmed) {
      const key = bet.source === 'SPREAD_OPPORTUNITY' ? 'SPREAD_ONLY' : 'EV_WITH_SPREAD';
      if (!bySpreadConfirmed[key]) bySpreadConfirmed[key] = [];
      bySpreadConfirmed[key].push(bet);
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

  // ═══════════════════════════════════════════════════════════════════════════════════════════
  // SPREAD OPPORTUNITY ANALYSIS
  // Tracks: 1) Spread-only picks (source: SPREAD_OPPORTUNITY)
  //         2) EV picks reinforced by spread analysis (spreadConfirmed: true)
  // ═══════════════════════════════════════════════════════════════════════════════════════════
  
  factorPerformance.spreadSource = {};
  factorPerformance.spreadConfirmed = {};
  
  console.log('\n┌───────────────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 📊 SPREAD OPPORTUNITY ANALYSIS                                                             │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');

  // Part 1: By Source (SPREAD_OPPORTUNITY vs EV_PICK)
  console.log('   📈 BY SOURCE (how bet was created):');
  if (Object.keys(bySpreadSource).length > 0) {
    // Sort to show SPREAD_OPPORTUNITY first
    const sortedSources = Object.entries(bySpreadSource)
      .sort((a, b) => {
        if (a[0] === 'SPREAD_OPPORTUNITY') return -1;
        if (b[0] === 'SPREAD_OPPORTUNITY') return 1;
        return 0;
      });

    for (const [source, sourceBets] of sortedSources) {
      const stats = calculateStats(sourceBets);
      factorPerformance.spreadSource[source] = stats;
      
      const roiEmoji = stats.roi > 0 ? '🟢' : stats.roi < -10 ? '🔴' : '🟡';
      const label = source === 'SPREAD_OPPORTUNITY' ? 'SPREAD_ONLY' : source;
      console.log(`      ${roiEmoji} ${label.padEnd(18)}: ${stats.total.toString().padStart(3)} bets | Win: ${stats.winRate.toFixed(1)}% | ${stats.roi >= 0 ? '+' : ''}${stats.roi.toFixed(1)}% ROI | Profit: ${stats.profit >= 0 ? '+' : ''}${stats.profit.toFixed(2)}u`);
    }
  } else {
    console.log('      ⏳ No source data yet');
  }

  // Part 2: Spread-Confirmed Analysis
  console.log('\n   🎯 SPREAD CONFIRMATION ANALYSIS:');
  if (Object.keys(bySpreadConfirmed).length > 0) {
    for (const [type, typeBets] of Object.entries(bySpreadConfirmed)) {
      const stats = calculateStats(typeBets);
      factorPerformance.spreadConfirmed[type] = stats;
      
      const roiEmoji = stats.roi > 0 ? '🟢' : stats.roi < -10 ? '🔴' : '🟡';
      console.log(`      ${roiEmoji} ${type.padEnd(18)}: ${stats.total.toString().padStart(3)} bets | Win: ${stats.winRate.toFixed(1)}% | ${stats.roi >= 0 ? '+' : ''}${stats.roi.toFixed(1)}% ROI | Profit: ${stats.profit >= 0 ? '+' : ''}${stats.profit.toFixed(2)}u`);
    }
    
    // Compare spread-confirmed vs non-spread
    const spreadConfirmedBets = [...(bySpreadConfirmed.SPREAD_ONLY || []), ...(bySpreadConfirmed.EV_WITH_SPREAD || [])];
    const nonSpreadBets = bets.filter(b => !b.prediction?.spreadConfirmed && !b.spreadAnalysis?.marginOverSpread && b.source !== 'SPREAD_OPPORTUNITY');
    
    if (spreadConfirmedBets.length > 0 && nonSpreadBets.length > 0) {
      const spreadStats = calculateStats(spreadConfirmedBets);
      const nonSpreadStats = calculateStats(nonSpreadBets);
      
      console.log('\n   📊 SPREAD CONFIRMATION EDGE:');
      console.log(`      With Spread:    ${spreadStats.winRate.toFixed(1)}% win | ${spreadStats.roi >= 0 ? '+' : ''}${spreadStats.roi.toFixed(1)}% ROI (${spreadConfirmedBets.length} bets)`);
      console.log(`      Without Spread: ${nonSpreadStats.winRate.toFixed(1)}% win | ${nonSpreadStats.roi >= 0 ? '+' : ''}${nonSpreadStats.roi.toFixed(1)}% ROI (${nonSpreadBets.length} bets)`);
      
      const edgeDiff = spreadStats.roi - nonSpreadStats.roi;
      const edgeEmoji = edgeDiff > 3 ? '🚀' : edgeDiff > 0 ? '✅' : '⚠️';
      console.log(`      ${edgeEmoji} Edge: ${edgeDiff >= 0 ? '+' : ''}${edgeDiff.toFixed(1)}% ROI advantage`);
    }
  } else {
    console.log('      ⏳ No spread-confirmed bets completed yet');
  }
  
  console.log(`\n   📊 Total spread opportunity bets: ${(bySpreadSource.SPREAD_OPPORTUNITY || []).length}`);
  console.log(`   📊 Total EV bets with spread confirmation: ${(bySpreadConfirmed.EV_WITH_SPREAD || []).length}`);

  // Deep dive: Spread bets by odds range
  const allSpreadBets = [...(bySpreadSource.SPREAD_OPPORTUNITY || []), ...(bySpreadConfirmed.EV_WITH_SPREAD || [])];
  
  if (allSpreadBets.length > 0) {
    console.log('\n   💰 SPREAD PICKS BY ODDS RANGE:');
    
    // Group by odds range
    const spreadByOdds = {};
    allSpreadBets.forEach(bet => {
      const odds = bet.bet?.odds || 0;
      let range;
      if (odds <= -300) range = 'HEAVY_FAV';
      else if (odds <= -200) range = 'BIG_FAV';
      else if (odds <= -150) range = 'MOD_FAV';
      else if (odds <= -110) range = 'SLIGHT_FAV';
      else if (odds <= 110) range = 'PICKEM';
      else if (odds <= 150) range = 'SLIGHT_DOG';
      else if (odds <= 200) range = 'MOD_DOG';
      else range = 'BIG_DOG';
      
      if (!spreadByOdds[range]) spreadByOdds[range] = [];
      spreadByOdds[range].push(bet);
    });
    
    // Sort and display
    const oddsOrder = ['HEAVY_FAV', 'BIG_FAV', 'MOD_FAV', 'SLIGHT_FAV', 'PICKEM', 'SLIGHT_DOG', 'MOD_DOG', 'BIG_DOG'];
    for (const range of oddsOrder) {
      if (spreadByOdds[range] && spreadByOdds[range].length > 0) {
        const stats = calculateStats(spreadByOdds[range]);
        const roiEmoji = stats.roi > 5 ? '🟢' : stats.roi < -5 ? '🔴' : '🟡';
        console.log(`      ${roiEmoji} ${range.padEnd(12)}: ${stats.total.toString().padStart(3)} bets | Win: ${stats.winRate.toFixed(1)}% | ${stats.roi >= 0 ? '+' : ''}${stats.roi.toFixed(1)}% ROI | Profit: ${stats.profit >= 0 ? '+' : ''}${stats.profit.toFixed(2)}u`);
        
        // Store for dynamic units
        if (!factorPerformance.spreadByOdds) factorPerformance.spreadByOdds = {};
        factorPerformance.spreadByOdds[range] = stats;
      }
    }
    
    console.log('\n   🎯 SPREAD PICKS BY WIN PROBABILITY:');
    
    // Group by win probability
    const spreadByProb = {};
    allSpreadBets.forEach(bet => {
      const prob = Math.max(
        bet.prediction?.ensembleAwayProb || 0,
        bet.prediction?.ensembleHomeProb || 0
      ) * 100;
      
      let range;
      if (prob >= 75) range = 'HIGH_75+';
      else if (prob >= 65) range = 'GOOD_65-74';
      else if (prob >= 55) range = 'MOD_55-64';
      else if (prob >= 45) range = 'PICKEM_45-54';
      else range = 'LOW_<45';
      
      if (!spreadByProb[range]) spreadByProb[range] = [];
      spreadByProb[range].push(bet);
    });
    
    // Sort and display
    const probOrder = ['HIGH_75+', 'GOOD_65-74', 'MOD_55-64', 'PICKEM_45-54', 'LOW_<45'];
    for (const range of probOrder) {
      if (spreadByProb[range] && spreadByProb[range].length > 0) {
        const stats = calculateStats(spreadByProb[range]);
        const roiEmoji = stats.roi > 5 ? '🟢' : stats.roi < -5 ? '🔴' : '🟡';
        console.log(`      ${roiEmoji} ${range.padEnd(12)}: ${stats.total.toString().padStart(3)} bets | Win: ${stats.winRate.toFixed(1)}% | ${stats.roi >= 0 ? '+' : ''}${stats.roi.toFixed(1)}% ROI | Profit: ${stats.profit >= 0 ? '+' : ''}${stats.profit.toFixed(2)}u`);
        
        // Store for dynamic units
        if (!factorPerformance.spreadByProb) factorPerformance.spreadByProb = {};
        factorPerformance.spreadByProb[range] = stats;
      }
    }
    
    console.log('\n   📏 SPREAD PICKS BY MARGIN OVER SPREAD:');
    
    // Group by spread margin (how much they beat the spread by)
    const spreadByMargin = {};
    allSpreadBets.forEach(bet => {
      const margin = bet.spreadAnalysis?.marginOverSpread || bet.prediction?.bestEV || 0;
      
      let range;
      if (margin >= 5) range = 'HUGE_5+';
      else if (margin >= 3) range = 'STRONG_3-5';
      else if (margin >= 1.5) range = 'SOLID_1.5-3';
      else range = 'SLIM_<1.5';
      
      if (!spreadByMargin[range]) spreadByMargin[range] = [];
      spreadByMargin[range].push(bet);
    });
    
    // Sort and display
    const marginOrder = ['HUGE_5+', 'STRONG_3-5', 'SOLID_1.5-3', 'SLIM_<1.5'];
    for (const range of marginOrder) {
      if (spreadByMargin[range] && spreadByMargin[range].length > 0) {
        const stats = calculateStats(spreadByMargin[range]);
        const roiEmoji = stats.roi > 5 ? '🟢' : stats.roi < -5 ? '🔴' : '🟡';
        console.log(`      ${roiEmoji} ${range.padEnd(12)}: ${stats.total.toString().padStart(3)} bets | Win: ${stats.winRate.toFixed(1)}% | ${stats.roi >= 0 ? '+' : ''}${stats.roi.toFixed(1)}% ROI | Profit: ${stats.profit >= 0 ? '+' : ''}${stats.profit.toFixed(2)}u`);
        
        // Store for dynamic units
        if (!factorPerformance.spreadByMargin) factorPerformance.spreadByMargin = {};
        factorPerformance.spreadByMargin[range] = stats;
      }
    }
    
    // Summary recommendation
    console.log('\n   💡 SPREAD UNIT RECOMMENDATIONS (based on data):');
    
    // Find best performing categories
    const allSpreadStats = calculateStats(allSpreadBets);
    console.log(`      Overall Spread Performance: ${allSpreadStats.winRate.toFixed(1)}% win | ${allSpreadStats.roi >= 0 ? '+' : ''}${allSpreadStats.roi.toFixed(1)}% ROI`);
    
    if (allSpreadStats.roi > 10) {
      console.log('      🚀 STRONG EDGE - Consider 2-3u base for spread picks');
    } else if (allSpreadStats.roi > 5) {
      console.log('      ✅ GOOD EDGE - Consider 1.5-2u base for spread picks');
    } else if (allSpreadStats.roi > 0) {
      console.log('      🟡 SLIGHT EDGE - Keep at 1u base, monitor for improvements');
    } else {
      console.log('      ⚠️ NEGATIVE EDGE - Consider 0.5u or pause spread picks');
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════════════════════
  // CLV (CLOSING LINE VALUE) ANALYSIS
  // Uses the clv.value field stored in Firebase bets
  // CLV+ = Consistently getting better odds than close = REAL SKILL
  // ═══════════════════════════════════════════════════════════════════════════════════════════
  
  console.log('\n┌───────────────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 💰 CLV (CLOSING LINE VALUE) ANALYSIS                                                       │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');
  
  let betsWithCLV = 0;
  let totalCLV = 0;
  let positiveCLVCount = 0;
  let negativeCLVCount = 0;
  
  // CLV by outcome
  const clvByOutcome = { WIN: { count: 0, totalCLV: 0 }, LOSS: { count: 0, totalCLV: 0 } };
  
  // CLV by grade
  const clvByGrade = {};
  
  // CLV by odds range
  const clvByOddsRange = {};
  
  // CLV by Savant status
  const clvBySavant = { savant: { count: 0, totalCLV: 0 }, nonSavant: { count: 0, totalCLV: 0 } };
  
  // CLV by movement type
  const clvByMovement = { STEAM: { count: 0, totalCLV: 0, wins: 0 }, FADE: { count: 0, totalCLV: 0, wins: 0 }, UNCHANGED: { count: 0, totalCLV: 0, wins: 0 } };
  
  // CLV by Models Aligned
  const clvByModelsAligned = { AGREE: { count: 0, totalCLV: 0 }, DISAGREE: { count: 0, totalCLV: 0 } };
  
  // Track CLV tiers
  const clvByTier = { elite: 0, great: 0, good: 0, neutral: 0, slight_negative: 0, negative: 0 };
  
  bets.forEach(bet => {
    // Use the clv.value field from Firebase
    const clvData = bet.clv;
    if (!clvData || clvData.value === undefined || clvData.value === null) return;
    
    const clv = clvData.value;
    betsWithCLV++;
    totalCLV += clv;
    
    if (clv > 0) positiveCLVCount++;
    else negativeCLVCount++;
    
    // Track CLV tiers
    if (clv >= 5) clvByTier.elite++;
    else if (clv >= 3) clvByTier.great++;
    else if (clv >= 1) clvByTier.good++;
    else if (clv >= 0) clvByTier.neutral++;
    else if (clv >= -2) clvByTier.slight_negative++;
    else clvByTier.negative++;
    
    // By outcome
    const outcome = bet.result?.outcome;
    if (outcome && clvByOutcome[outcome]) {
      clvByOutcome[outcome].count++;
      clvByOutcome[outcome].totalCLV += clv;
    }
    
    // By grade
    const grade = bet.prediction?.grade || 'C';
    if (!clvByGrade[grade]) clvByGrade[grade] = { count: 0, totalCLV: 0, wins: 0 };
    clvByGrade[grade].count++;
    clvByGrade[grade].totalCLV += clv;
    if (outcome === 'WIN') clvByGrade[grade].wins++;
    
    // By odds range
    const factors = classifyBet(bet);
    if (!clvByOddsRange[factors.oddsRange]) clvByOddsRange[factors.oddsRange] = { count: 0, totalCLV: 0, wins: 0 };
    clvByOddsRange[factors.oddsRange].count++;
    clvByOddsRange[factors.oddsRange].totalCLV += clv;
    if (outcome === 'WIN') clvByOddsRange[factors.oddsRange].wins++;
    
    // By Savant status
    const isSavant = bet.savantPick === true;
    const savantKey = isSavant ? 'savant' : 'nonSavant';
    clvBySavant[savantKey].count++;
    clvBySavant[savantKey].totalCLV += clv;
    
    // By movement type (STEAM, FADE, UNCHANGED)
    const movement = clvData.movement;
    if (movement && clvByMovement[movement]) {
      clvByMovement[movement].count++;
      clvByMovement[movement].totalCLV += clv;
      if (outcome === 'WIN') clvByMovement[movement].wins++;
    }
    
    // By Models Aligned
    const modelsAgree = bet.prediction?.modelsAgree;
    if (modelsAgree !== undefined) {
      const agreeKey = modelsAgree ? 'AGREE' : 'DISAGREE';
      clvByModelsAligned[agreeKey].count++;
      clvByModelsAligned[agreeKey].totalCLV += clv;
    }
  });
  
  // Store CLV analysis
  factorPerformance.clv = {
    summary: {
      betsWithCLV,
      avgCLV: betsWithCLV > 0 ? parseFloat((totalCLV / betsWithCLV).toFixed(2)) : 0,
      positiveCLVCount,
      negativeCLVCount,
      positiveCLVRate: betsWithCLV > 0 ? parseFloat((positiveCLVCount / betsWithCLV * 100).toFixed(1)) : 0,
      tiers: clvByTier
    },
    byOutcome: {
      WIN: {
        count: clvByOutcome.WIN.count,
        avgCLV: clvByOutcome.WIN.count > 0 ? parseFloat((clvByOutcome.WIN.totalCLV / clvByOutcome.WIN.count).toFixed(2)) : 0
      },
      LOSS: {
        count: clvByOutcome.LOSS.count,
        avgCLV: clvByOutcome.LOSS.count > 0 ? parseFloat((clvByOutcome.LOSS.totalCLV / clvByOutcome.LOSS.count).toFixed(2)) : 0
      }
    },
    byGrade: {},
    byOddsRange: {},
    bySavant: {
      savant: {
        count: clvBySavant.savant.count,
        avgCLV: clvBySavant.savant.count > 0 ? parseFloat((clvBySavant.savant.totalCLV / clvBySavant.savant.count).toFixed(2)) : 0
      },
      nonSavant: {
        count: clvBySavant.nonSavant.count,
        avgCLV: clvBySavant.nonSavant.count > 0 ? parseFloat((clvBySavant.nonSavant.totalCLV / clvBySavant.nonSavant.count).toFixed(2)) : 0
      }
    },
    byMovement: {},
    byModelsAligned: {}
  };
  
  // Fill in grade breakdown
  for (const [grade, data] of Object.entries(clvByGrade)) {
    factorPerformance.clv.byGrade[grade] = {
      count: data.count,
      avgCLV: data.count > 0 ? parseFloat((data.totalCLV / data.count).toFixed(2)) : 0,
      winRate: data.count > 0 ? parseFloat((data.wins / data.count * 100).toFixed(1)) : 0
    };
  }
  
  // Fill in odds range breakdown
  for (const [range, data] of Object.entries(clvByOddsRange)) {
    factorPerformance.clv.byOddsRange[range] = {
      count: data.count,
      avgCLV: data.count > 0 ? parseFloat((data.totalCLV / data.count).toFixed(2)) : 0,
      winRate: data.count > 0 ? parseFloat((data.wins / data.count * 100).toFixed(1)) : 0
    };
  }
  
  // Fill in movement breakdown
  for (const [movement, data] of Object.entries(clvByMovement)) {
    if (data.count > 0) {
      factorPerformance.clv.byMovement[movement] = {
        count: data.count,
        avgCLV: parseFloat((data.totalCLV / data.count).toFixed(2)),
        winRate: parseFloat((data.wins / data.count * 100).toFixed(1))
      };
    }
  }
  
  // Fill in models aligned breakdown
  for (const [align, data] of Object.entries(clvByModelsAligned)) {
    if (data.count > 0) {
      factorPerformance.clv.byModelsAligned[align] = {
        count: data.count,
        avgCLV: parseFloat((data.totalCLV / data.count).toFixed(2))
      };
    }
  }
  
  // Display CLV results
  if (betsWithCLV > 0) {
    const avgCLV = totalCLV / betsWithCLV;
    const clvEmoji = avgCLV > 0 ? '🟢' : avgCLV < -1 ? '🔴' : '🟡';
    
    console.log(`   ${clvEmoji} Average CLV: ${avgCLV >= 0 ? '+' : ''}${avgCLV.toFixed(2)}% (${betsWithCLV} bets with CLV data)`);
    console.log(`   📊 Positive CLV: ${positiveCLVCount}/${betsWithCLV} (${(positiveCLVCount/betsWithCLV*100).toFixed(1)}%)`);
    console.log('');
    
    // CLV Tiers distribution
    console.log('   🏆 CLV TIER DISTRIBUTION:');
    console.log(`      Elite (5%+):     ${clvByTier.elite} bets`);
    console.log(`      Great (3-5%):    ${clvByTier.great} bets`);
    console.log(`      Good (1-3%):     ${clvByTier.good} bets`);
    console.log(`      Neutral (0-1%):  ${clvByTier.neutral} bets`);
    console.log(`      Slight (-2-0%):  ${clvByTier.slight_negative} bets`);
    console.log(`      Negative (<-2%): ${clvByTier.negative} bets`);
    console.log('');
    
    // CLV by outcome
    console.log('   📈 CLV BY OUTCOME:');
    if (clvByOutcome.WIN.count > 0) {
      const winCLV = clvByOutcome.WIN.totalCLV / clvByOutcome.WIN.count;
      console.log(`      WIN:  ${winCLV >= 0 ? '+' : ''}${winCLV.toFixed(2)}% avg CLV (${clvByOutcome.WIN.count} bets)`);
    }
    if (clvByOutcome.LOSS.count > 0) {
      const lossCLV = clvByOutcome.LOSS.totalCLV / clvByOutcome.LOSS.count;
      console.log(`      LOSS: ${lossCLV >= 0 ? '+' : ''}${lossCLV.toFixed(2)}% avg CLV (${clvByOutcome.LOSS.count} bets)`);
    }
    console.log('');
    
    // CLV by movement (STEAM/FADE/UNCHANGED)
    if (Object.keys(clvByMovement).some(k => clvByMovement[k].count > 0)) {
      console.log('   🔄 CLV BY LINE MOVEMENT:');
      for (const [movement, data] of Object.entries(clvByMovement)) {
        if (data.count > 0) {
          const movCLV = data.totalCLV / data.count;
          const movWinRate = (data.wins / data.count * 100).toFixed(1);
          const emoji = movement === 'STEAM' ? '✅' : movement === 'FADE' ? '🔴' : '➖';
          console.log(`      ${emoji} ${movement.padEnd(9)}: ${movCLV >= 0 ? '+' : ''}${movCLV.toFixed(2)}% CLV | ${movWinRate}% win rate (${data.count} bets)`);
        }
      }
      console.log('');
    }
    
    // CLV by grade
    if (Object.keys(clvByGrade).length > 0) {
      console.log('   📊 CLV BY GRADE:');
      const gradeOrder = ['A', 'B+', 'B', 'C+', 'C', 'D', 'F'];
      gradeOrder.forEach(grade => {
        if (clvByGrade[grade] && clvByGrade[grade].count > 0) {
          const gradeCLV = clvByGrade[grade].totalCLV / clvByGrade[grade].count;
          const gradeWinRate = (clvByGrade[grade].wins / clvByGrade[grade].count * 100).toFixed(1);
          const clvIcon = gradeCLV > 0 ? '🟢' : gradeCLV < -1 ? '🔴' : '🟡';
          console.log(`      ${clvIcon} ${grade.padEnd(3)}: ${gradeCLV >= 0 ? '+' : ''}${gradeCLV.toFixed(2)}% CLV | ${gradeWinRate}% win (${clvByGrade[grade].count} bets)`);
        }
      });
      console.log('');
    }
    
    // CLV by odds range
    if (Object.keys(clvByOddsRange).length > 0) {
      console.log('   💰 CLV BY ODDS RANGE:');
      const oddsOrder = ['HEAVY_FAV', 'BIG_FAV', 'MOD_FAV', 'SLIGHT_FAV', 'PICKEM', 'SLIGHT_DOG', 'BIG_DOG'];
      oddsOrder.forEach(range => {
        if (clvByOddsRange[range] && clvByOddsRange[range].count > 0) {
          const rangeCLV = clvByOddsRange[range].totalCLV / clvByOddsRange[range].count;
          const rangeWinRate = (clvByOddsRange[range].wins / clvByOddsRange[range].count * 100).toFixed(1);
          const clvIcon = rangeCLV > 0 ? '🟢' : rangeCLV < -1 ? '🔴' : '🟡';
          console.log(`      ${clvIcon} ${range.padEnd(12)}: ${rangeCLV >= 0 ? '+' : ''}${rangeCLV.toFixed(2)}% CLV | ${rangeWinRate}% win (${clvByOddsRange[range].count} bets)`);
        }
      });
      console.log('');
    }
    
    // CLV by Savant
    if (clvBySavant.savant.count > 0 || clvBySavant.nonSavant.count > 0) {
      console.log('   ⭐ CLV BY SAVANT STATUS:');
      if (clvBySavant.savant.count > 0) {
        const savantCLV = clvBySavant.savant.totalCLV / clvBySavant.savant.count;
        console.log(`      Savant Picks:     ${savantCLV >= 0 ? '+' : ''}${savantCLV.toFixed(2)}% avg CLV (${clvBySavant.savant.count} bets)`);
      }
      if (clvBySavant.nonSavant.count > 0) {
        const nonSavantCLV = clvBySavant.nonSavant.totalCLV / clvBySavant.nonSavant.count;
        console.log(`      Non-Savant Picks: ${nonSavantCLV >= 0 ? '+' : ''}${nonSavantCLV.toFixed(2)}% avg CLV (${clvBySavant.nonSavant.count} bets)`);
      }
      console.log('');
    }
    
    // CLV by Models Aligned
    if (clvByModelsAligned.AGREE.count > 0 || clvByModelsAligned.DISAGREE.count > 0) {
      console.log('   🔗 CLV BY MODELS ALIGNED:');
      if (clvByModelsAligned.AGREE.count > 0) {
        const agreeCLV = clvByModelsAligned.AGREE.totalCLV / clvByModelsAligned.AGREE.count;
        console.log(`      Models Agree:     ${agreeCLV >= 0 ? '+' : ''}${agreeCLV.toFixed(2)}% avg CLV (${clvByModelsAligned.AGREE.count} bets)`);
      }
      if (clvByModelsAligned.DISAGREE.count > 0) {
        const disagreeCLV = clvByModelsAligned.DISAGREE.totalCLV / clvByModelsAligned.DISAGREE.count;
        console.log(`      Models Disagree:  ${disagreeCLV >= 0 ? '+' : ''}${disagreeCLV.toFixed(2)}% avg CLV (${clvByModelsAligned.DISAGREE.count} bets)`);
      }
    }
  } else {
    console.log('   ⏳ No CLV data available yet');
    console.log('      CLV is tracked in the clv.value field on bet documents');
  }

  // ═══════════════════════════════════════════════════════════════════════════════════════════
  // NEW: HASLAMETRICS vs D-RATINGS ACCURACY TRACKING
  // Compare which model is better at predicting winners
  // ═══════════════════════════════════════════════════════════════════════════════════════════
  
  console.log('\n┌───────────────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 🏀 HASLAMETRICS vs D-RATINGS ACCURACY                                                      │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');

  let haslaCorrect = 0;
  let haslaTotal = 0;
  let dratingsCorrect = 0;
  let dratingsTotal = 0;
  let bothCorrect = 0;
  let bothWrong = 0;
  let haslaOnlyCorrect = 0;
  let dratingsOnlyCorrect = 0;
  let betsWithBothModels = 0;

  // Track by margin of victory prediction
  const haslaByMargin = { close: { correct: 0, total: 0 }, medium: { correct: 0, total: 0 }, blowout: { correct: 0, total: 0 } };
  const dratingsByMargin = { close: { correct: 0, total: 0 }, medium: { correct: 0, total: 0 }, blowout: { correct: 0, total: 0 } };

  bets.forEach(bet => {
    const prediction = bet.prediction || {};
    const result = bet.result || {};
    
    // Get actual winner
    const actualAwayScore = result.awayScore;
    const actualHomeScore = result.homeScore;
    if (actualAwayScore === undefined || actualHomeScore === undefined) return;
    
    const actualWinner = actualAwayScore > actualHomeScore ? 'AWAY' : 'HOME';
    const actualMargin = Math.abs(actualAwayScore - actualHomeScore);
    
    // Haslametrics prediction
    const haslaAwayScore = prediction.haslametricsAwayScore;
    const haslaHomeScore = prediction.haslametricsHomeScore;
    if (haslaAwayScore !== undefined && haslaHomeScore !== undefined && haslaAwayScore !== null && haslaHomeScore !== null) {
      haslaTotal++;
      const haslaPredictedWinner = haslaAwayScore > haslaHomeScore ? 'AWAY' : 'HOME';
      const haslaMargin = Math.abs(haslaAwayScore - haslaHomeScore);
      const marginCategory = haslaMargin <= 3 ? 'close' : haslaMargin <= 10 ? 'medium' : 'blowout';
      
      haslaByMargin[marginCategory].total++;
      if (haslaPredictedWinner === actualWinner) {
        haslaCorrect++;
        haslaByMargin[marginCategory].correct++;
      }
    }
    
    // D-Ratings prediction
    const dratingsAwayScore = prediction.dratingsAwayScore;
    const dratingsHomeScore = prediction.dratingsHomeScore;
    if (dratingsAwayScore !== undefined && dratingsHomeScore !== undefined && dratingsAwayScore !== null && dratingsHomeScore !== null) {
      dratingsTotal++;
      const dratingsPredictedWinner = dratingsAwayScore > dratingsHomeScore ? 'AWAY' : 'HOME';
      const dratingsMargin = Math.abs(dratingsAwayScore - dratingsHomeScore);
      const marginCategory = dratingsMargin <= 3 ? 'close' : dratingsMargin <= 10 ? 'medium' : 'blowout';
      
      dratingsByMargin[marginCategory].total++;
      if (dratingsPredictedWinner === actualWinner) {
        dratingsCorrect++;
        dratingsByMargin[marginCategory].correct++;
      }
    }
    
    // Both models comparison
    if (haslaAwayScore !== undefined && haslaHomeScore !== undefined && 
        dratingsAwayScore !== undefined && dratingsHomeScore !== undefined &&
        haslaAwayScore !== null && haslaHomeScore !== null &&
        dratingsAwayScore !== null && dratingsHomeScore !== null) {
      betsWithBothModels++;
      const haslaPredictedWinner = haslaAwayScore > haslaHomeScore ? 'AWAY' : 'HOME';
      const dratingsPredictedWinner = dratingsAwayScore > dratingsHomeScore ? 'AWAY' : 'HOME';
      
      const haslaRight = haslaPredictedWinner === actualWinner;
      const dratingsRight = dratingsPredictedWinner === actualWinner;
      
      if (haslaRight && dratingsRight) bothCorrect++;
      else if (!haslaRight && !dratingsRight) bothWrong++;
      else if (haslaRight && !dratingsRight) haslaOnlyCorrect++;
      else if (!haslaRight && dratingsRight) dratingsOnlyCorrect++;
    }
  });

  // Store model accuracy stats
  factorPerformance.modelAccuracy = {
    haslametrics: {
      correct: haslaCorrect,
      total: haslaTotal,
      accuracy: haslaTotal > 0 ? (haslaCorrect / haslaTotal * 100) : 0,
      byMargin: {
        close: haslaByMargin.close,
        medium: haslaByMargin.medium,
        blowout: haslaByMargin.blowout
      }
    },
    dratings: {
      correct: dratingsCorrect,
      total: dratingsTotal,
      accuracy: dratingsTotal > 0 ? (dratingsCorrect / dratingsTotal * 100) : 0,
      byMargin: {
        close: dratingsByMargin.close,
        medium: dratingsByMargin.medium,
        blowout: dratingsByMargin.blowout
      }
    },
    headToHead: {
      betsWithBothModels,
      bothCorrect,
      bothWrong,
      haslaOnlyCorrect,
      dratingsOnlyCorrect
    }
  };

  // Display results
  const haslaAcc = haslaTotal > 0 ? (haslaCorrect / haslaTotal * 100).toFixed(1) : 'N/A';
  const dratingsAcc = dratingsTotal > 0 ? (dratingsCorrect / dratingsTotal * 100).toFixed(1) : 'N/A';
  
  const haslaEmoji = parseFloat(haslaAcc) > parseFloat(dratingsAcc) ? '👑' : '  ';
  const dratingsEmoji = parseFloat(dratingsAcc) > parseFloat(haslaAcc) ? '👑' : '  ';
  
  console.log(`   ${haslaEmoji} HASLAMETRICS: ${haslaAcc}% accuracy (${haslaCorrect}/${haslaTotal} winners correct)`);
  console.log(`   ${dratingsEmoji} D-RATINGS:    ${dratingsAcc}% accuracy (${dratingsCorrect}/${dratingsTotal} winners correct)`);
  
  if (betsWithBothModels > 0) {
    console.log('');
    console.log(`   📊 HEAD-TO-HEAD (${betsWithBothModels} bets with both models):`);
    console.log(`      Both correct:     ${bothCorrect} (${(bothCorrect/betsWithBothModels*100).toFixed(1)}%)`);
    console.log(`      Both wrong:       ${bothWrong} (${(bothWrong/betsWithBothModels*100).toFixed(1)}%)`);
    console.log(`      Hasla only right: ${haslaOnlyCorrect} (${(haslaOnlyCorrect/betsWithBothModels*100).toFixed(1)}%)`);
    console.log(`      D-Rat only right: ${dratingsOnlyCorrect} (${(dratingsOnlyCorrect/betsWithBothModels*100).toFixed(1)}%)`);
  }
  
  // Accuracy by predicted margin
  console.log('');
  console.log('   📏 ACCURACY BY PREDICTED MARGIN:');
  console.log('');
  console.log('      Margin        │ Haslametrics      │ D-Ratings');
  console.log('      ──────────────┼───────────────────┼───────────────────');
  
  ['close', 'medium', 'blowout'].forEach(margin => {
    const marginLabel = margin === 'close' ? 'Close (≤3)' : margin === 'medium' ? 'Medium (4-10)' : 'Blowout (11+)';
    const haslaMarginAcc = haslaByMargin[margin].total > 0 
      ? `${(haslaByMargin[margin].correct/haslaByMargin[margin].total*100).toFixed(1)}% (${haslaByMargin[margin].correct}/${haslaByMargin[margin].total})`
      : 'N/A';
    const dratingsMarginAcc = dratingsByMargin[margin].total > 0 
      ? `${(dratingsByMargin[margin].correct/dratingsByMargin[margin].total*100).toFixed(1)}% (${dratingsByMargin[margin].correct}/${dratingsByMargin[margin].total})`
      : 'N/A';
    console.log(`      ${marginLabel.padEnd(13)} │ ${haslaMarginAcc.padEnd(17)} │ ${dratingsMarginAcc}`);
  });

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

