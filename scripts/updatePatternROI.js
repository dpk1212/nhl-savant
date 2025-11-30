/**
 * Update Pattern ROI Script
 * 
 * Calculates live performance metrics for each grade×odds pattern
 * Stores results in Firebase collection 'basketball_pattern_performance'
 * 
 * Called automatically after bet grading or manually via:
 * npm run update-pattern-roi
 */

import admin from 'firebase-admin';
import { simplifyGrade, getOddsRange } from '../src/utils/abcUnits.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file for local testing
dotenv.config({ path: join(__dirname, '../.env') });

// Initialize Firebase Admin SDK
const serviceAccount = {
  project_id: process.env.VITE_FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
};

// Validate credentials
if (!serviceAccount.project_id || !serviceAccount.client_email || !serviceAccount.private_key) {
  console.error('❌ Missing Firebase credentials');
  console.error('Required environment variables:');
  console.error('  - VITE_FIREBASE_PROJECT_ID');
  console.error('  - FIREBASE_CLIENT_EMAIL');
  console.error('  - FIREBASE_PRIVATE_KEY');
  process.exit(1);
}

// Only initialize if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

/**
 * Calculate statistics for a pattern (group of bets)
 */
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
    
    // Use actual units risked from result
    const units = bet.result?.units || bet.prediction?.unitSize || 0;
    totalRisked += units;
    totalProfit += (bet.result?.profit || 0);
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

/**
 * Main function to update all pattern ROIs
 */
export async function updateAllPatternROI() {
  console.log('\n📊 PATTERN ROI UPDATE');
  console.log('==================================\n');

  try {
    // 1. Fetch all COMPLETED bets
    console.log('📂 Fetching completed bets from Firebase...');
    const betsSnapshot = await db.collection('basketball_bets')
      .where('status', '==', 'COMPLETED')
      .get();
    
    const completedBets = betsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(`✅ Found ${completedBets.length} completed bets\n`);

    if (completedBets.length === 0) {
      console.log('⏭️  No completed bets to analyze. Exiting.');
      return 0;
    }

    // 2. Group bets by pattern (grade + odds range)
    console.log('🔄 Grouping bets by pattern...');
    const patterns = {};

    completedBets.forEach(bet => {
      const grade = simplifyGrade(bet.prediction?.grade || 'C');
      const oddsRange = getOddsRange(bet.bet?.odds || 0);
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

    const patternCount = Object.keys(patterns).length;
    console.log(`✅ Found ${patternCount} unique patterns\n`);

    // 3. Calculate and save stats for each pattern
    console.log('💾 Updating pattern performance in Firebase...\n');
    
    const batch = db.batch();
    const patternPerformanceRef = db.collection('basketball_pattern_performance');
    let updatedCount = 0;

    for (const patternKey in patterns) {
      const pattern = patterns[patternKey];
      const stats = calculatePatternStats(pattern.bets);

      // Log pattern summary
      const reliable = stats.sampleSizeReliable ? '✅' : '⚠️';
      console.log(`${reliable} ${patternKey}: ${stats.totalBets} bets, ${stats.winRate.toFixed(1)}% win, ${stats.roi >= 0 ? '+' : ''}${stats.roi.toFixed(1)}% ROI`);

      // Prepare document for Firebase
      const docRef = patternPerformanceRef.doc(patternKey);
      const docData = {
        grade: pattern.grade,
        oddsRange: pattern.oddsRange,
        patternKey,
        ...stats,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        lastBetDate: pattern.bets.reduce((latest, bet) => {
          const betDate = bet.date || bet.id.split('_')[0];
          return betDate > latest ? betDate : latest;
        }, '1970-01-01')
      };

      batch.set(docRef, docData, { merge: true });
      updatedCount++;
    }

    // Commit all updates
    await batch.commit();
    
    console.log(`\n✅ Successfully updated ${updatedCount} patterns in Firebase`);
    console.log('==================================\n');
    
    return updatedCount;

  } catch (error) {
    console.error('❌ Error updating pattern ROI:', error);
    throw error;
  }
}

// Allow direct execution for testing/manual updates
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  updateAllPatternROI()
    .then(count => {
      console.log(`✅ Pattern ROI update complete: ${count} patterns updated`);
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Pattern ROI update failed:', error);
      process.exit(1);
    });
}
