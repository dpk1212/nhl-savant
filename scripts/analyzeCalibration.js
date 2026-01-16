/**
 * 📊 CALIBRATION ANALYSIS SCRIPT
 * 
 * Analyzes model calibration by comparing:
 * - What the model PREDICTED (ensembleProb)
 * - What ACTUALLY happened (WIN/LOSS)
 * 
 * This reveals where the model is overconfident vs accurate
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin
const serviceAccount = {
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

// Classification functions (same as dynamicConfidenceUnits.js)
function classifyOdds(odds) {
  if (odds <= -300) return 'HEAVY_FAV';
  if (odds > -300 && odds <= -200) return 'BIG_FAV';
  if (odds > -200 && odds <= -150) return 'MOD_FAV';
  if (odds > -150 && odds < -110) return 'SLIGHT_FAV';
  if (odds >= -110 && odds <= 110) return 'PICKEM';
  if (odds > 110 && odds < 200) return 'SLIGHT_DOG';
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

async function analyzeCalibration() {
  console.log('📊 CALIBRATION ANALYSIS - Comparing Model Predictions to Reality\n');
  console.log('='.repeat(80));
  
  // Fetch all graded basketball bets
  const betsSnapshot = await db.collection('basketball_bets').get();
  
  const gradedBets = [];
  
  betsSnapshot.forEach(doc => {
    const bet = doc.data();
    
    // Only include bets with outcomes AND model probabilities
    if (bet.result?.outcome && bet.prediction?.ensembleAwayProb) {
      const prediction = bet.prediction;
      const betInfo = bet.bet;
      const result = bet.result;
      
      // Determine which probability applies (away or home pick)
      const pickTeam = betInfo?.team || prediction?.bestTeam;
      const isAwayPick = pickTeam === bet.awayTeam;
      
      const modelProb = isAwayPick 
        ? prediction.ensembleAwayProb 
        : prediction.ensembleHomeProb;
      
      const isWin = result.outcome === 'WIN';
      
      gradedBets.push({
        id: doc.id,
        date: bet.date,
        game: `${bet.awayTeam} @ ${bet.homeTeam}`,
        pick: pickTeam,
        isAwayPick,
        modelProb,
        odds: betInfo?.odds || prediction?.bestOdds,
        ev: prediction?.evPercent || prediction?.bestEV || 0,
        grade: prediction?.grade,
        isWin,
        units: prediction?.unitSize || result?.units || 1,
        profit: result?.profit || 0
      });
    }
  });
  
  console.log(`\n📈 Loaded ${gradedBets.length} graded bets with model probabilities\n`);
  
  // Initialize pattern trackers
  const patterns = {
    grade: {},
    odds: {},
    ev: {},
    probability: {},
    overall: { bets: 0, wins: 0, modelProbSum: 0, profit: 0, risked: 0 }
  };
  
  // Process each bet
  gradedBets.forEach(bet => {
    const grade = bet.grade || 'Unknown';
    const oddsRange = classifyOdds(bet.odds);
    const probRange = classifyProb(bet.modelProb);
    const evRange = classifyEV(bet.ev);
    
    // Initialize patterns if needed
    const initPattern = (obj, key) => {
      if (!obj[key]) {
        obj[key] = { bets: 0, wins: 0, modelProbSum: 0, profit: 0, risked: 0 };
      }
    };
    initPattern(patterns.grade, grade);
    initPattern(patterns.odds, oddsRange);
    initPattern(patterns.ev, evRange);
    initPattern(patterns.probability, probRange);
    
    // Update all pattern trackers
    const updatePattern = (obj, key) => {
      obj[key].bets++;
      obj[key].wins += bet.isWin ? 1 : 0;
      obj[key].modelProbSum += bet.modelProb;
      obj[key].profit += bet.profit;
      obj[key].risked += bet.units;
    };
    
    updatePattern(patterns.grade, grade);
    updatePattern(patterns.odds, oddsRange);
    updatePattern(patterns.ev, evRange);
    updatePattern(patterns.probability, probRange);
    
    // Overall
    patterns.overall.bets++;
    patterns.overall.wins += bet.isWin ? 1 : 0;
    patterns.overall.modelProbSum += bet.modelProb;
    patterns.overall.profit += bet.profit;
    patterns.overall.risked += bet.units;
  });
  
  // Calculate and display calibration for each pattern type
  const printPatternAnalysis = (title, patternData) => {
    console.log(`\n${'═'.repeat(80)}`);
    console.log(`📊 ${title} CALIBRATION ANALYSIS`);
    console.log('═'.repeat(80));
    console.log(`${'Pattern'.padEnd(15)} | ${'Bets'.padStart(5)} | ${'Wins'.padStart(5)} | ${'Win%'.padStart(7)} | ${'Model%'.padStart(7)} | ${'Calib'.padStart(8)} | ${'ROI'.padStart(8)} | Status`);
    console.log('-'.repeat(80));
    
    const sortedPatterns = Object.entries(patternData)
      .filter(([_, data]) => data.bets >= 10) // Minimum sample size
      .sort((a, b) => b[1].bets - a[1].bets);
    
    sortedPatterns.forEach(([pattern, data]) => {
      const actualWinRate = data.wins / data.bets;
      const avgModelProb = data.modelProbSum / data.bets;
      const calibrationError = actualWinRate - avgModelProb;
      const roi = (data.profit / data.risked) * 100;
      
      let status = '';
      if (calibrationError < -0.10) status = '🔴 OVERCONFIDENT';
      else if (calibrationError < -0.05) status = '🟡 Slight Over';
      else if (calibrationError > 0.10) status = '🟢 UNDERCONFIDENT';
      else if (calibrationError > 0.05) status = '🟢 Slight Under';
      else status = '✅ Calibrated';
      
      console.log(
        `${pattern.padEnd(15)} | ${String(data.bets).padStart(5)} | ${String(data.wins).padStart(5)} | ` +
        `${(actualWinRate * 100).toFixed(1).padStart(6)}% | ${(avgModelProb * 100).toFixed(1).padStart(6)}% | ` +
        `${(calibrationError >= 0 ? '+' : '') + (calibrationError * 100).toFixed(1).padStart(6)}% | ` +
        `${(roi >= 0 ? '+' : '') + roi.toFixed(1).padStart(6)}% | ${status}`
      );
    });
  };
  
  // Print overall stats first
  const overall = patterns.overall;
  const overallWinRate = overall.wins / overall.bets;
  const overallAvgModel = overall.modelProbSum / overall.bets;
  const overallCalib = overallWinRate - overallAvgModel;
  const overallROI = (overall.profit / overall.risked) * 100;
  
  console.log('\n' + '█'.repeat(80));
  console.log('📊 OVERALL MODEL CALIBRATION');
  console.log('█'.repeat(80));
  console.log(`Total Bets:        ${overall.bets}`);
  console.log(`Wins:              ${overall.wins} (${(overallWinRate * 100).toFixed(1)}%)`);
  console.log(`Avg Model Prob:    ${(overallAvgModel * 100).toFixed(1)}%`);
  console.log(`Calibration Error: ${(overallCalib >= 0 ? '+' : '')}${(overallCalib * 100).toFixed(1)}%`);
  console.log(`ROI:               ${(overallROI >= 0 ? '+' : '')}${overallROI.toFixed(2)}%`);
  console.log(`Total Profit:      ${overall.profit >= 0 ? '+' : ''}${overall.profit.toFixed(2)}u`);
  
  if (overallCalib < -0.05) {
    console.log(`\n⚠️  MODEL IS OVERCONFIDENT by ${Math.abs(overallCalib * 100).toFixed(1)}%`);
    console.log(`   Model predicts ${(overallAvgModel * 100).toFixed(1)}% win rate, reality is ${(overallWinRate * 100).toFixed(1)}%`);
  } else if (overallCalib > 0.05) {
    console.log(`\n✅ MODEL IS UNDERCONFIDENT by ${(overallCalib * 100).toFixed(1)}%`);
    console.log(`   Model predicts ${(overallAvgModel * 100).toFixed(1)}% win rate, reality is ${(overallWinRate * 100).toFixed(1)}%`);
  } else {
    console.log(`\n✅ MODEL IS WELL CALIBRATED (within 5%)`);
  }
  
  // Print pattern breakdowns
  printPatternAnalysis('GRADE', patterns.grade);
  printPatternAnalysis('ODDS RANGE', patterns.odds);
  printPatternAnalysis('EV RANGE', patterns.ev);
  printPatternAnalysis('PROBABILITY RANGE', patterns.probability);
  
  // KEY INSIGHTS
  console.log('\n' + '█'.repeat(80));
  console.log('🎯 KEY INSIGHTS FOR UNIT SIZING');
  console.log('█'.repeat(80));
  
  // Find most overconfident patterns
  const allPatterns = [
    ...Object.entries(patterns.grade).map(([k, v]) => ({ type: 'Grade', pattern: k, ...v })),
    ...Object.entries(patterns.odds).map(([k, v]) => ({ type: 'Odds', pattern: k, ...v })),
    ...Object.entries(patterns.ev).map(([k, v]) => ({ type: 'EV', pattern: k, ...v })),
    ...Object.entries(patterns.probability).map(([k, v]) => ({ type: 'Prob', pattern: k, ...v }))
  ].filter(p => p.bets >= 15);
  
  const withCalib = allPatterns.map(p => ({
    ...p,
    actualWinRate: p.wins / p.bets,
    avgModelProb: p.modelProbSum / p.bets,
    calibError: (p.wins / p.bets) - (p.modelProbSum / p.bets),
    roi: (p.profit / p.risked) * 100
  }));
  
  const overconfident = withCalib.filter(p => p.calibError < -0.08).sort((a, b) => a.calibError - b.calibError);
  const underconfident = withCalib.filter(p => p.calibError > 0.08).sort((a, b) => b.calibError - a.calibError);
  
  if (overconfident.length > 0) {
    console.log('\n🔴 OVERCONFIDENT PATTERNS (Reduce allocation):');
    overconfident.slice(0, 5).forEach(p => {
      console.log(`   ${p.type} ${p.pattern}: Model says ${(p.avgModelProb * 100).toFixed(0)}%, Reality ${(p.actualWinRate * 100).toFixed(0)}% (${(p.calibError * 100).toFixed(1)}% error, ${p.bets} bets)`);
    });
  }
  
  if (underconfident.length > 0) {
    console.log('\n🟢 UNDERCONFIDENT PATTERNS (Could increase allocation):');
    underconfident.slice(0, 5).forEach(p => {
      console.log(`   ${p.type} ${p.pattern}: Model says ${(p.avgModelProb * 100).toFixed(0)}%, Reality ${(p.actualWinRate * 100).toFixed(0)}% (+${(p.calibError * 100).toFixed(1)}% better, ${p.bets} bets)`);
    });
  }
  
  // Probability bucket analysis (most important for underdog question)
  console.log('\n' + '═'.repeat(80));
  console.log('📊 PROBABILITY BUCKET DEEP DIVE (Key for Underdog Sizing)');
  console.log('═'.repeat(80));
  
  const probBuckets = {};
  gradedBets.forEach(bet => {
    let bucket;
    if (bet.modelProb >= 0.70) bucket = '70%+';
    else if (bet.modelProb >= 0.60) bucket = '60-70%';
    else if (bet.modelProb >= 0.50) bucket = '50-60%';
    else if (bet.modelProb >= 0.40) bucket = '40-50%';
    else if (bet.modelProb >= 0.30) bucket = '30-40%';
    else bucket = '<30%';
    
    if (!probBuckets[bucket]) {
      probBuckets[bucket] = { bets: 0, wins: 0, modelProbSum: 0, profit: 0, risked: 0 };
    }
    probBuckets[bucket].bets++;
    probBuckets[bucket].wins += bet.isWin ? 1 : 0;
    probBuckets[bucket].modelProbSum += bet.modelProb;
    probBuckets[bucket].profit += bet.profit;
    probBuckets[bucket].risked += bet.units;
  });
  
  console.log(`${'Bucket'.padEnd(12)} | ${'Bets'.padStart(5)} | ${'Win%'.padStart(7)} | ${'Model%'.padStart(7)} | ${'Calib'.padStart(8)} | ${'ROI'.padStart(8)} | Recommendation`);
  console.log('-'.repeat(85));
  
  ['70%+', '60-70%', '50-60%', '40-50%', '30-40%', '<30%'].forEach(bucket => {
    const data = probBuckets[bucket];
    if (!data || data.bets < 5) {
      console.log(`${bucket.padEnd(12)} | ${'N/A'.padStart(5)} | Insufficient data`);
      return;
    }
    
    const actualWinRate = data.wins / data.bets;
    const avgModelProb = data.modelProbSum / data.bets;
    const calibError = actualWinRate - avgModelProb;
    const roi = (data.profit / data.risked) * 100;
    
    let rec = '';
    if (calibError < -0.10) rec = '⬇️ CAP at 1u max';
    else if (calibError < -0.05) rec = '⬇️ Cap at 2u max';
    else if (roi < -5) rec = '⚠️ Cap at 2u (bleeding)';
    else if (roi > 10 && calibError > 0) rec = '✅ Full allocation OK';
    else rec = '✅ Standard sizing';
    
    console.log(
      `${bucket.padEnd(12)} | ${String(data.bets).padStart(5)} | ` +
      `${(actualWinRate * 100).toFixed(1).padStart(6)}% | ${(avgModelProb * 100).toFixed(1).padStart(6)}% | ` +
      `${(calibError >= 0 ? '+' : '') + (calibError * 100).toFixed(1).padStart(6)}% | ` +
      `${(roi >= 0 ? '+' : '') + roi.toFixed(1).padStart(6)}% | ${rec}`
    );
  });
  
  console.log('\n' + '═'.repeat(80));
  console.log('✅ Analysis complete!');
  console.log('═'.repeat(80));
}

analyzeCalibration().catch(console.error);
