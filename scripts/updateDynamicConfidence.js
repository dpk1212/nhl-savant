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
 * Calculate stats for a group of bets
 */
function calculateStats(bets) {
  let wins = 0;
  let losses = 0;
  let profit = 0;
  let risked = 0;

  bets.forEach(bet => {
    const units = bet.result?.units || 1;
    risked += units;
    
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

  return { wins, losses, total, winRate, profit, risked, roi };
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
 * Convert ROI to a confidence weight (0-2 scale)
 * Uses sigmoid-like function to normalize
 */
function roiToWeight(roi, sampleSize, minSample = 10) {
  // Not enough data? Use neutral weight
  if (sampleSize < minSample) return 1.0;
  
  // Sigmoid transformation: maps ROI to 0-2 range
  // ROI of 0% → weight of 1.0
  // ROI of +30% → weight of ~1.8
  // ROI of -30% → weight of ~0.2
  const normalized = roi / 50; // Scale so ±50% ROI maps to ±1
  const weight = 2 / (1 + Math.exp(-2 * normalized));
  
  // Apply sample size confidence factor
  const confidenceFactor = Math.min(1, sampleSize / 30);
  
  // Blend towards 1.0 when sample is small
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

  console.log('┌─────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ GRADE FACTOR PERFORMANCE                                                    │');
  console.log('└─────────────────────────────────────────────────────────────────────────────┘\n');

  for (const [grade, gradeBets] of Object.entries(byGrade)) {
    const stats = calculateStats(gradeBets);
    const weight = roiToWeight(stats.roi, stats.total);
    
    factorWeights.grade[grade] = weight;
    factorPerformance.grade[grade] = stats;
    
    const emoji = stats.roi > 0 ? '🟢' : stats.roi < -10 ? '🔴' : '🟡';
    console.log(`   ${emoji} ${grade.padEnd(4)}: ${stats.total.toString().padStart(3)} bets | ${stats.roi >= 0 ? '+' : ''}${stats.roi.toFixed(1)}% ROI | Weight: ${weight.toFixed(2)}`);
  }

  console.log('\n┌─────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ ODDS FACTOR PERFORMANCE                                                     │');
  console.log('└─────────────────────────────────────────────────────────────────────────────┘\n');

  for (const [odds, oddsBets] of Object.entries(byOdds)) {
    const stats = calculateStats(oddsBets);
    const weight = roiToWeight(stats.roi, stats.total);
    
    factorWeights.odds[odds] = weight;
    factorPerformance.odds[odds] = stats;
    
    const emoji = stats.roi > 0 ? '🟢' : stats.roi < -10 ? '🔴' : '🟡';
    console.log(`   ${emoji} ${odds.padEnd(12)}: ${stats.total.toString().padStart(3)} bets | ${stats.roi >= 0 ? '+' : ''}${stats.roi.toFixed(1)}% ROI | Weight: ${weight.toFixed(2)}`);
  }

  console.log('\n┌─────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ MODEL PROBABILITY FACTOR PERFORMANCE                                        │');
  console.log('└─────────────────────────────────────────────────────────────────────────────┘\n');

  for (const [prob, probBets] of Object.entries(byProb)) {
    const stats = calculateStats(probBets);
    const weight = roiToWeight(stats.roi, stats.total);
    
    factorWeights.probability[prob] = weight;
    factorPerformance.probability[prob] = stats;
    
    const emoji = stats.roi > 0 ? '🟢' : stats.roi < -10 ? '🔴' : '🟡';
    console.log(`   ${emoji} ${prob.padEnd(12)}: ${stats.total.toString().padStart(3)} bets | ${stats.roi >= 0 ? '+' : ''}${stats.roi.toFixed(1)}% ROI | Weight: ${weight.toFixed(2)}`);
  }

  console.log('\n┌─────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ EV FACTOR PERFORMANCE                                                       │');
  console.log('└─────────────────────────────────────────────────────────────────────────────┘\n');

  for (const [ev, evBets] of Object.entries(byEV)) {
    const stats = calculateStats(evBets);
    const weight = roiToWeight(stats.roi, stats.total);
    
    factorWeights.ev[ev] = weight;
    factorPerformance.ev[ev] = stats;
    
    const emoji = stats.roi > 0 ? '🟢' : stats.roi < -10 ? '🔴' : '🟡';
    console.log(`   ${emoji} ${ev.padEnd(14)}: ${stats.total.toString().padStart(3)} bets | ${stats.roi >= 0 ? '+' : ''}${stats.roi.toFixed(1)}% ROI | Weight: ${weight.toFixed(2)}`);
  }

  console.log('\n┌─────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ SIDE FACTOR PERFORMANCE                                                     │');
  console.log('└─────────────────────────────────────────────────────────────────────────────┘\n');

  for (const [side, sideBets] of Object.entries(bySide)) {
    const stats = calculateStats(sideBets);
    const weight = roiToWeight(stats.roi, stats.total);
    
    factorWeights.side[side] = weight;
    factorPerformance.side[side] = stats;
    
    const emoji = stats.roi > 0 ? '🟢' : stats.roi < -10 ? '🔴' : '🟡';
    console.log(`   ${emoji} ${side.padEnd(6)}: ${stats.total.toString().padStart(3)} bets | ${stats.roi >= 0 ? '+' : ''}${stats.roi.toFixed(1)}% ROI | Weight: ${weight.toFixed(2)}`);
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

