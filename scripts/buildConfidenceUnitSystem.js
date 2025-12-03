/**
 * 🎯 CONFIDENCE-BASED UNIT SIZING SYSTEM
 * 
 * Units range 1-5 based on MULTIPLE confirming factors
 * 5u = MULTIPLE GREEN FLAGS = HIGH CONFIDENCE
 * 
 * The goal: Spread units intelligently so we bet MORE when confident
 * and LESS when uncertain
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

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

/**
 * NEW CONFIDENCE-BASED UNIT CALCULATOR
 * 
 * Score factors from 0-1, sum them up, map to units
 * Each factor can ADD or SUBTRACT confidence
 */
function calculateConfidenceUnits(bet) {
  let confidenceScore = 0;
  const factors = [];
  
  const grade = bet.prediction?.grade || 'C';
  const odds = bet.bet?.odds || -110;
  const ev = bet.prediction?.evPercent || bet.prediction?.bestEV || 0;
  const pickTeam = bet.bet?.team || bet.bet?.pick;
  const isAway = pickTeam === bet.game?.awayTeam;
  const ensembleProb = isAway 
    ? (bet.prediction?.ensembleAwayProb || 0.5)
    : (bet.prediction?.ensembleHomeProb || 0.5);
  
  // ═══════════════════════════════════════════════════════════════
  // FACTOR 1: GRADE (Max +2 points)
  // ═══════════════════════════════════════════════════════════════
  if (grade === 'A') {
    confidenceScore += 2;
    factors.push('✅ Grade A (+2)');
  } else if (grade === 'B+') {
    confidenceScore += 2;
    factors.push('✅ Grade B+ (+2)');
  } else if (grade === 'A+') {
    confidenceScore += 0.5; // Historically bad, reduce
    factors.push('⚠️ Grade A+ (+0.5)');
  } else if (grade === 'B') {
    confidenceScore += 0.5;
    factors.push('⚠️ Grade B (+0.5)');
  } else if (grade === 'C') {
    confidenceScore += 1;
    factors.push('🟡 Grade C (+1)');
  } else if (grade === 'D') {
    confidenceScore += 0.5;
    factors.push('⚠️ Grade D (+0.5)');
  } else if (grade === 'F') {
    confidenceScore += 0; // F grade gets CAPPED, not boosted
    factors.push('🔴 Grade F (+0, CAPPED at 0.5u)');
  }
  
  // ═══════════════════════════════════════════════════════════════
  // FACTOR 2: ODDS SWEET SPOT (Max +2 points)
  // ═══════════════════════════════════════════════════════════════
  if (odds > -200 && odds <= -110) {
    // SWEET SPOT: Slight/Mod Favorites
    confidenceScore += 2;
    factors.push('✅ Sweet Spot Odds (-110 to -200) (+2)');
  } else if (odds > -300 && odds <= -200) {
    // Big favorites - okay but not ideal
    confidenceScore += 1;
    factors.push('🟡 Big Favorite Odds (-200 to -300) (+1)');
  } else if (odds <= -300) {
    // Heavy chalk - juice kills us
    confidenceScore += 0;
    factors.push('🔴 Heavy Chalk (-300+) (+0)');
  } else if (odds > -110 && odds < 130) {
    // Pick'em range - risky
    confidenceScore += 0.5;
    factors.push('⚠️ Pick\'em Range (+0.5)');
  } else if (odds >= 130 && odds < 200) {
    // Slight dog - some value possible
    confidenceScore += 0.5;
    factors.push('⚠️ Slight Dog (+130 to +200) (+0.5)');
  } else if (odds >= 200) {
    // Big dog - high risk
    confidenceScore += 0;
    factors.push('🔴 Big Dog (+200+) (+0)');
  }
  
  // ═══════════════════════════════════════════════════════════════
  // FACTOR 3: MODEL PROBABILITY (Max +1.5 points)
  // ═══════════════════════════════════════════════════════════════
  if (ensembleProb >= 0.70) {
    confidenceScore += 1.5;
    factors.push('✅ High Model Prob (70%+) (+1.5)');
  } else if (ensembleProb >= 0.60) {
    confidenceScore += 1;
    factors.push('🟡 Good Model Prob (60-70%) (+1)');
  } else if (ensembleProb >= 0.55) {
    confidenceScore += 0.5;
    factors.push('⚠️ Moderate Model Prob (55-60%) (+0.5)');
  } else {
    confidenceScore += 0;
    factors.push('🔴 Low Model Prob (<55%) (+0)');
  }
  
  // ═══════════════════════════════════════════════════════════════
  // FACTOR 4: EV% (Max +1 point)
  // The "Goldilocks" zone: 5-15% is best, too high is overconfident
  // ═══════════════════════════════════════════════════════════════
  if (ev >= 5 && ev < 15) {
    confidenceScore += 1;
    factors.push('✅ Goldilocks EV (5-15%) (+1)');
  } else if (ev >= 0 && ev < 5) {
    confidenceScore += 0.5;
    factors.push('🟡 Low Positive EV (0-5%) (+0.5)');
  } else if (ev >= 15 && ev < 20) {
    confidenceScore += 0.5;
    factors.push('⚠️ High EV (15-20%) - model may be overconfident (+0.5)');
  } else if (ev >= 20) {
    confidenceScore += 0; // Too high = overconfident
    factors.push('🔴 Very High EV (20%+) - historically bad (+0)');
  } else {
    confidenceScore += 0.5; // Negative EV but model still likes it
    factors.push('⚠️ Negative EV (+0.5)');
  }
  
  // ═══════════════════════════════════════════════════════════════
  // FACTOR 5: HOME/AWAY (Max +0.5 points)
  // Away has performed better historically
  // ═══════════════════════════════════════════════════════════════
  if (isAway) {
    confidenceScore += 0.5;
    factors.push('✅ Away Team (+0.5)');
  } else {
    confidenceScore += 0;
    factors.push('🟡 Home Team (+0)');
  }
  
  // ═══════════════════════════════════════════════════════════════
  // CALCULATE FINAL UNITS
  // Score range: 0-7 points
  // Map to units: 1-5
  // ═══════════════════════════════════════════════════════════════
  
  // F grade HARD CAP at 0.5u
  if (grade === 'F') {
    return {
      units: 0.5,
      confidenceScore,
      factors,
      tier: 'F-CAP'
    };
  }
  
  // Map score to units
  // 0-1.5 = 1u (low confidence)
  // 1.5-3 = 2u (moderate)
  // 3-4.5 = 3u (good)
  // 4.5-5.5 = 4u (high)
  // 5.5+ = 5u (SURE - multiple green flags)
  
  let units;
  let tier;
  
  if (confidenceScore >= 5.5) {
    units = 5;
    tier = '🔥 ELITE (5u)';
  } else if (confidenceScore >= 4.5) {
    units = 4;
    tier = '💪 HIGH (4u)';
  } else if (confidenceScore >= 3.5) {
    units = 3;
    tier = '✅ GOOD (3u)';
  } else if (confidenceScore >= 2.5) {
    units = 2;
    tier = '🟡 MODERATE (2u)';
  } else {
    units = 1;
    tier = '⚠️ LOW (1u)';
  }
  
  return {
    units,
    confidenceScore,
    factors,
    tier
  };
}

async function buildConfidenceSystem() {
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════════════════════╗');
  console.log('║          🎯 CONFIDENCE-BASED UNIT SIZING SYSTEM 🎯                            ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════════╝');
  console.log('\n');
  
  // Fetch ALL completed basketball bets
  const betsQuery = query(
    collection(db, 'basketball_bets'),
    where('status', '==', 'COMPLETED')
  );
  const betsSnapshot = await getDocs(betsQuery);
  const allBets = betsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  console.log(`📊 Backtesting on ${allBets.length} completed bets\n`);
  
  // ═══════════════════════════════════════════════════════════════
  // SECTION 1: THE ALGORITHM
  // ═══════════════════════════════════════════════════════════════
  console.log('┌─────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ THE CONFIDENCE SCORING ALGORITHM                                            │');
  console.log('└─────────────────────────────────────────────────────────────────────────────┘\n');
  
  console.log('   📊 FACTOR BREAKDOWN:\n');
  console.log('   ┌────────────────────────────────────────────────────────────────┐');
  console.log('   │ FACTOR 1: GRADE (0-2 points)                                   │');
  console.log('   │   A, B+     = +2    (historically +33-66% ROI)                 │');
  console.log('   │   C         = +1    (baseline)                                 │');
  console.log('   │   A+, B, D  = +0.5  (historically poor or neutral)             │');
  console.log('   │   F         = +0    (HARD CAP at 0.5u)                         │');
  console.log('   ├────────────────────────────────────────────────────────────────┤');
  console.log('   │ FACTOR 2: ODDS SWEET SPOT (0-2 points)                         │');
  console.log('   │   -110 to -200  = +2    (sweet spot, +19-26% ROI)              │');
  console.log('   │   -200 to -300  = +1    (okay, +1.6% ROI)                      │');
  console.log('   │   Pick\'em/Slight Dog = +0.5                                    │');
  console.log('   │   Heavy chalk/Big dog = +0                                     │');
  console.log('   ├────────────────────────────────────────────────────────────────┤');
  console.log('   │ FACTOR 3: MODEL PROBABILITY (0-1.5 points)                     │');
  console.log('   │   70%+   = +1.5                                                │');
  console.log('   │   60-70% = +1                                                  │');
  console.log('   │   55-60% = +0.5                                                │');
  console.log('   │   <55%   = +0                                                  │');
  console.log('   ├────────────────────────────────────────────────────────────────┤');
  console.log('   │ FACTOR 4: EV GOLDILOCKS (0-1 points)                           │');
  console.log('   │   5-15%  = +1    (historically best, +60-125% ROI)             │');
  console.log('   │   0-5%   = +0.5                                                │');
  console.log('   │   15-20% = +0.5  (model may be overconfident)                  │');
  console.log('   │   20%+   = +0    (historically -100% ROI!)                     │');
  console.log('   ├────────────────────────────────────────────────────────────────┤');
  console.log('   │ FACTOR 5: HOME/AWAY (0-0.5 points)                             │');
  console.log('   │   Away = +0.5   (historically +8.5% ROI)                       │');
  console.log('   │   Home = +0     (historically -11% ROI)                        │');
  console.log('   └────────────────────────────────────────────────────────────────┘\n');
  
  console.log('   📈 SCORE TO UNITS MAPPING:\n');
  console.log('   Score Range │ Units │ Tier');
  console.log('   ────────────┼───────┼──────────────────');
  console.log('   5.5+        │  5u   │ 🔥 ELITE (SURE!)');
  console.log('   4.5-5.5     │  4u   │ 💪 HIGH');
  console.log('   3.5-4.5     │  3u   │ ✅ GOOD');
  console.log('   2.5-3.5     │  2u   │ 🟡 MODERATE');
  console.log('   0-2.5       │  1u   │ ⚠️ LOW');
  console.log('   F grade     │ 0.5u  │ 🔴 CAPPED');
  console.log();
  
  // ═══════════════════════════════════════════════════════════════
  // SECTION 2: BACKTEST RESULTS
  // ═══════════════════════════════════════════════════════════════
  console.log('┌─────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ BACKTEST: NEW SYSTEM VS CURRENT                                             │');
  console.log('└─────────────────────────────────────────────────────────────────────────────┘\n');
  
  // Calculate new units for all bets and compare
  let newTotalProfit = 0;
  let newTotalRisked = 0;
  let currentTotalProfit = 0;
  let currentTotalRisked = 0;
  
  const tierStats = {
    'F-CAP': { wins: 0, losses: 0, profit: 0, risked: 0 },
    '⚠️ LOW (1u)': { wins: 0, losses: 0, profit: 0, risked: 0 },
    '🟡 MODERATE (2u)': { wins: 0, losses: 0, profit: 0, risked: 0 },
    '✅ GOOD (3u)': { wins: 0, losses: 0, profit: 0, risked: 0 },
    '💪 HIGH (4u)': { wins: 0, losses: 0, profit: 0, risked: 0 },
    '🔥 ELITE (5u)': { wins: 0, losses: 0, profit: 0, risked: 0 }
  };
  
  allBets.forEach(bet => {
    const currentUnits = bet.result?.units || bet.prediction?.unitSize || 1;
    const { units: newUnits, tier } = calculateConfidenceUnits(bet);
    const odds = bet.bet?.odds || -110;
    const won = bet.result?.outcome === 'WIN';
    
    // Current profit
    currentTotalProfit += bet.result?.profit || 0;
    currentTotalRisked += currentUnits;
    
    // New profit calculation
    let newProfit;
    if (won) {
      newProfit = odds > 0 ? newUnits * (odds / 100) : newUnits * (100 / Math.abs(odds));
    } else {
      newProfit = -newUnits;
    }
    
    newTotalProfit += newProfit;
    newTotalRisked += newUnits;
    
    // Track by tier
    if (!tierStats[tier]) tierStats[tier] = { wins: 0, losses: 0, profit: 0, risked: 0 };
    tierStats[tier].risked += newUnits;
    tierStats[tier].profit += newProfit;
    if (won) tierStats[tier].wins++;
    else tierStats[tier].losses++;
  });
  
  const currentROI = (currentTotalProfit / currentTotalRisked * 100);
  const newROI = (newTotalProfit / newTotalRisked * 100);
  
  console.log('   📊 OVERALL COMPARISON:\n');
  console.log(`   Current System: ${currentTotalProfit > 0 ? '+' : ''}${currentTotalProfit.toFixed(2)}u | ROI: ${currentROI > 0 ? '+' : ''}${currentROI.toFixed(1)}%`);
  console.log(`   New System:     ${newTotalProfit > 0 ? '+' : ''}${newTotalProfit.toFixed(2)}u | ROI: ${newROI > 0 ? '+' : ''}${newROI.toFixed(1)}%`);
  console.log(`   ─────────────────────────────────────────────`);
  console.log(`   IMPROVEMENT:    ${(newTotalProfit - currentTotalProfit) > 0 ? '+' : ''}${(newTotalProfit - currentTotalProfit).toFixed(2)}u`);
  console.log();
  
  // ═══════════════════════════════════════════════════════════════
  // SECTION 3: PERFORMANCE BY TIER
  // ═══════════════════════════════════════════════════════════════
  console.log('┌─────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ PERFORMANCE BY CONFIDENCE TIER                                              │');
  console.log('└─────────────────────────────────────────────────────────────────────────────┘\n');
  
  console.log('   Tier               │ Record  │ Units   │ Profit   │ ROI');
  console.log('   ───────────────────┼─────────┼─────────┼──────────┼────────');
  
  Object.entries(tierStats)
    .sort((a, b) => {
      const order = ['🔥 ELITE (5u)', '💪 HIGH (4u)', '✅ GOOD (3u)', '🟡 MODERATE (2u)', '⚠️ LOW (1u)', 'F-CAP'];
      return order.indexOf(a[0]) - order.indexOf(b[0]);
    })
    .forEach(([tier, stats]) => {
      if (stats.risked === 0) return;
      const roi = (stats.profit / stats.risked * 100);
      const record = `${stats.wins}-${stats.losses}`;
      console.log(`   ${tier.padEnd(18)} │ ${record.padStart(7)} │ ${stats.risked.toFixed(1).padStart(6)}u │ ${(stats.profit > 0 ? '+' : '') + stats.profit.toFixed(2).padStart(7)}u │ ${(roi > 0 ? '+' : '') + roi.toFixed(1)}%`);
    });
  console.log();
  
  // ═══════════════════════════════════════════════════════════════
  // SECTION 4: EXAMPLE CALCULATIONS
  // ═══════════════════════════════════════════════════════════════
  console.log('┌─────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ EXAMPLE: HOW A 5u "ELITE" BET IS CALCULATED                                 │');
  console.log('└─────────────────────────────────────────────────────────────────────────────┘\n');
  
  // Find a bet that would get 5u
  const eliteBet = allBets.find(bet => {
    const { units } = calculateConfidenceUnits(bet);
    return units === 5;
  });
  
  if (eliteBet) {
    const analysis = calculateConfidenceUnits(eliteBet);
    console.log(`   Game: ${eliteBet.game?.awayTeam} @ ${eliteBet.game?.homeTeam}`);
    console.log(`   Pick: ${eliteBet.bet?.team || eliteBet.bet?.pick} (${eliteBet.bet?.odds})`);
    console.log(`   Grade: ${eliteBet.prediction?.grade}`);
    console.log();
    console.log('   Factor Breakdown:');
    analysis.factors.forEach(f => console.log(`   • ${f}`));
    console.log();
    console.log(`   TOTAL SCORE: ${analysis.confidenceScore.toFixed(1)} → ${analysis.tier}`);
    console.log(`   Result: ${eliteBet.result?.outcome}`);
  } else {
    console.log('   No 5u bets in sample (high bar!)');
  }
  console.log();
  
  // ═══════════════════════════════════════════════════════════════
  // SECTION 5: DISTRIBUTION OF BETS BY TIER
  // ═══════════════════════════════════════════════════════════════
  console.log('┌─────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ BET DISTRIBUTION BY TIER                                                    │');
  console.log('└─────────────────────────────────────────────────────────────────────────────┘\n');
  
  const tierCounts = {};
  allBets.forEach(bet => {
    const { tier } = calculateConfidenceUnits(bet);
    tierCounts[tier] = (tierCounts[tier] || 0) + 1;
  });
  
  console.log('   Tier               │ Count │ % of Bets');
  console.log('   ───────────────────┼───────┼──────────');
  
  Object.entries(tierCounts)
    .sort((a, b) => {
      const order = ['🔥 ELITE (5u)', '💪 HIGH (4u)', '✅ GOOD (3u)', '🟡 MODERATE (2u)', '⚠️ LOW (1u)', 'F-CAP'];
      return order.indexOf(a[0]) - order.indexOf(b[0]);
    })
    .forEach(([tier, count]) => {
      const pct = (count / allBets.length * 100);
      console.log(`   ${tier.padEnd(18)} │ ${String(count).padStart(5)} │ ${pct.toFixed(1)}%`);
    });
  console.log();
  
  // ═══════════════════════════════════════════════════════════════
  // SECTION 6: CODE FOR IMPLEMENTATION
  // ═══════════════════════════════════════════════════════════════
  console.log('┌─────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ IMPLEMENTATION CODE                                                         │');
  console.log('└─────────────────────────────────────────────────────────────────────────────┘\n');
  
  console.log('   Ready to implement! The calculateConfidenceUnits() function can be');
  console.log('   directly integrated into your bet writing pipeline.\n');
  console.log('   Key features:');
  console.log('   • F grade HARD CAP at 0.5u');
  console.log('   • 5u requires MULTIPLE green flags (score 5.5+)');
  console.log('   • Dogs still bet, sized by confidence');
  console.log('   • Sweet spot odds get bonus points');
  console.log('   • High EV (20%+) penalized (model overconfidence)');
  console.log();
  
  console.log('═══════════════════════════════════════════════════════════════════════════════\n');
}

// Export the function for use in other files
export { calculateConfidenceUnits };

// Run
buildConfidenceSystem()
  .then(() => {
    console.log('✅ Confidence unit system analysis complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

