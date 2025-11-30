/**
 * Manual Dynamic ROI Update Script
 * 
 * Updates pattern ROI and pending bets on-demand
 * Can be triggered via GitHub Action or npm script
 * Uses Firebase Admin SDK
 */

import admin from 'firebase-admin';
import { getOddsRange, simplifyGrade, getOptimizedUnitSize } from '../src/utils/abcUnits.js';
import * as dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

// ============================================================================
// FIREBASE ADMIN INITIALIZATION
// ============================================================================

const serviceAccount = {
  project_id: process.env.VITE_FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
};

if (!serviceAccount.project_id || !serviceAccount.client_email || !serviceAccount.private_key) {
  console.error('❌ Missing Firebase credentials');
  console.error('Required environment variables:');
  console.error('  - VITE_FIREBASE_PROJECT_ID');
  console.error('  - FIREBASE_CLIENT_EMAIL');
  console.error('  - FIREBASE_PRIVATE_KEY');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// ============================================================================
// PATTERN ROI UPDATE
// ============================================================================

async function updateAllPatternROI() {
  console.log('🔄 Starting pattern ROI update...\n');

  // 1. Fetch all completed bets from Firebase
  const betsSnapshot = await db.collection('basketball_bets').get();
  const completedBets = betsSnapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(bet => bet.result?.outcome === 'WIN' || bet.result?.outcome === 'LOSS');

  console.log(`📊 Found ${completedBets.length} completed bets`);

  if (completedBets.length === 0) {
    console.log('⚠️  No completed bets to analyze\n');
    return;
  }

  // 2. Group bets by pattern (grade × odds range)
  const patterns = {};

  completedBets.forEach(bet => {
    const grade = simplifyGrade(bet.prediction?.grade);
    const odds = bet.prediction?.bestOdds || bet.bet?.odds;
    const oddsRange = getOddsRange(odds);
    const patternKey = `${grade}_${oddsRange}`;

    if (!patterns[patternKey]) {
      patterns[patternKey] = {
        grade,
        oddsRange,
        patternKey,
        bets: []
      };
    }

    patterns[patternKey].bets.push(bet);
  });

  console.log(`📈 Analyzing ${Object.keys(patterns).length} patterns\n`);

  // 3. Calculate and save stats for each pattern
  const batch = db.batch();
  const patternPerformanceRef = db.collection('basketball_pattern_performance');
  let updatedCount = 0;

  for (const patternKey in patterns) {
    const pattern = patterns[patternKey];
    const stats = calculatePatternStats(pattern.bets);

    const docRef = patternPerformanceRef.doc(patternKey);
    batch.set(docRef, {
      grade: pattern.grade,
      oddsRange: pattern.oddsRange,
      patternKey,
      ...stats,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      lastBetDate: pattern.bets.reduce((latest, bet) => {
        const betDate = bet.date || bet.id.split('_')[0];
        return betDate > latest ? betDate : latest;
      }, '1970-01-01')
    }, { merge: true });

    updatedCount++;

    // Log significant patterns
    if (stats.totalBets >= 5) {
      console.log(`   ${patternKey.padEnd(20)} | ${stats.totalBets.toString().padStart(3)} bets | ${stats.winRate.toFixed(1).padStart(5)}% win | ${stats.roi > 0 ? '+' : ''}${stats.roi.toFixed(1).padStart(6)}% ROI | ${stats.totalProfit > 0 ? '+' : ''}${stats.totalProfit.toFixed(2)}u profit`);
    }
  }

  await batch.commit();
  console.log(`\n✅ Updated ${updatedCount} patterns in Firebase\n`);
}

function calculatePatternStats(bets) {
  let totalBets = bets.length;
  let wins = 0;
  let losses = 0;
  let totalRisked = 0;
  let totalProfit = 0;

  bets.forEach(bet => {
    if (bet.result?.outcome === 'WIN') {
      wins++;
    } else if (bet.result?.outcome === 'LOSS') {
      losses++;
    }

    // Use actual units risked from result if available, otherwise prediction, 
    // otherwise calculate retroactively based on grade + odds
    let units = bet.result?.units || bet.prediction?.unitSize;
    
    if (!units || units === 0) {
      // Retroactively calculate units for historical bets
      const grade = bet.prediction?.grade;
      const odds = bet.bet?.odds || bet.prediction?.bestOdds;
      units = getOptimizedUnitSize(grade, odds);
    }
    
    totalRisked += units;
    
    // Calculate profit - use stored profit if available, otherwise calculate it
    let profit = bet.result?.profit;
    
    if (profit === undefined || profit === null) {
      // Retroactively calculate profit for historical bets
      const odds = bet.bet?.odds || bet.prediction?.bestOdds;
      const isWin = bet.result?.outcome === 'WIN';
      
      if (isWin) {
        // American odds to decimal
        const decimal = odds > 0 ? (odds / 100) : (100 / Math.abs(odds));
        profit = units * decimal;
      } else {
        profit = -units;
      }
    }
    
    totalProfit += profit;
  });

  const winRate = totalBets > 0 ? (wins / totalBets) * 100 : 0;
  const roi = totalRisked > 0 ? (totalProfit / totalRisked) * 100 : 0;

  return {
    totalBets,
    wins,
    losses,
    winRate: parseFloat(winRate.toFixed(1)),
    totalRisked: parseFloat(totalRisked.toFixed(2)),
    totalProfit: parseFloat(totalProfit.toFixed(2)),
    roi: parseFloat(roi.toFixed(1)),
    sampleSizeReliable: totalBets >= 15
  };
}

// ============================================================================
// PENDING BETS UPDATE
// ============================================================================

async function updatePendingBets() {
  console.log('🔄 Starting pending bets update...\n');

  const now = new Date();
  let updatedCount = 0;
  let skippedStarted = 0;
  let skippedNoData = 0;

  // Fetch all pending bets
  const pendingBetsSnapshot = await db.collection('basketball_bets')
    .where('status', '==', 'PENDING')
    .get();

  console.log(`📊 Found ${pendingBetsSnapshot.size} pending bets`);

  if (pendingBetsSnapshot.empty) {
    console.log('⚠️  No pending bets to update\n');
    return;
  }

  const batch = db.batch();

  for (const betDoc of pendingBetsSnapshot.docs) {
    const bet = betDoc.data();
    const betId = betDoc.id;

    // Check if game has started (simple check based on gameTime)
    const gameTimeStr = bet.game?.gameTime;
    if (gameTimeStr) {
      const timeMatch = gameTimeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (timeMatch) {
        let hours = parseInt(timeMatch[1]);
        const minutes = parseInt(timeMatch[2]);
        const ampm = timeMatch[3].toUpperCase();

        if (ampm === 'PM' && hours < 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;

        const gameDate = new Date(bet.date);
        gameDate.setHours(hours, minutes, 0, 0);

        if (now > gameDate) {
          skippedStarted++;
          continue;
        }
      }
    }

    const grade = simplifyGrade(bet.prediction?.grade);
    const odds = bet.bet?.odds;
    const oddsRange = getOddsRange(odds);

    if (!grade || !odds || !oddsRange) {
      skippedNoData++;
      continue;
    }

    // Fetch live ROI for this pattern
    const patternKey = `${grade}_${oddsRange}`;
    const patternDoc = await db.collection('basketball_pattern_performance').doc(patternKey).get();

    if (patternDoc.exists) {
      const livePatternData = patternDoc.data();
      
      if (livePatternData.sampleSizeReliable) {
        const currentUnits = bet.prediction?.unitSize || 0;
        const newHistoricalROI = livePatternData.roi;
        const newOptimizedUnits = getOptimizedUnitSize(grade, odds);

        // Only update if units change significantly (> 0.5 units)
        if (Math.abs(newOptimizedUnits - currentUnits) >= 0.5) {
          batch.update(betDoc.ref, {
            'prediction.unitSize': newOptimizedUnits,
            'prediction.historicalROI': newHistoricalROI,
            'prediction.sampleSize': livePatternData.totalBets,
            'prediction.isLiveData': true,
            'lastUpdated': admin.firestore.FieldValue.serverTimestamp()
          });

          console.log(`   ✅ ${betId.substring(0, 20)}... | ${currentUnits}u → ${newOptimizedUnits}u (ROI: ${newHistoricalROI.toFixed(1)}%)`);
          updatedCount++;
        }
      }
    } else {
      skippedNoData++;
    }
  }

  await batch.commit();

  console.log(`\n✅ Update summary:`);
  console.log(`   - Updated: ${updatedCount} bets`);
  console.log(`   - Skipped (game started): ${skippedStarted}`);
  console.log(`   - Skipped (no data): ${skippedNoData}\n`);
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  try {
    console.log('========================================');
    console.log('🏀 DYNAMIC ROI SYSTEM UPDATE');
    console.log('========================================\n');

    await updateAllPatternROI();
    await updatePendingBets();

    console.log('========================================');
    console.log('✅ DYNAMIC ROI UPDATE COMPLETE');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();

