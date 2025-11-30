/**
 * Update Pending Bets Script
 * 
 * Updates unit sizes for pending bets based on latest pattern ROI
 * Only updates bets for games that haven't started yet
 * 
 * Called automatically after bet grading or manually via:
 * npm run update-pending-bets
 */

import admin from 'firebase-admin';
import { simplifyGrade, getOddsRange, ABC_UNIT_MATRIX } from '../src/utils/abcUnits.js';
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
 * Check if a game has started based on gameTime
 */
function hasGameStarted(gameTime) {
  if (!gameTime || gameTime === 'TBD') {
    return false; // Assume not started if time unknown
  }

  try {
    // Parse game time (format: "12:00pm ET", "7:30pm ET", etc.)
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    // Convert game time to 24-hour format
    const timePart = gameTime.toLowerCase().replace(/\s+et$/, '').trim();
    let [time, period] = timePart.split(/([ap]m)/);
    let [hours, minutes] = time.split(':').map(Number);
    
    if (period === 'pm' && hours !== 12) hours += 12;
    if (period === 'am' && hours === 12) hours = 0;
    
    // Create Date object for game time (in ET)
    const gameDate = new Date(`${today}T${String(hours).padStart(2, '0')}:${String(minutes || 0).padStart(2, '0')}:00-05:00`);
    
    return now >= gameDate;
  } catch (error) {
    console.error(`Error parsing game time "${gameTime}":`, error.message);
    return false; // If we can't parse, assume not started
  }
}

/**
 * Calculate dynamic unit size based on live ROI
 * Uses Kelly Criterion-inspired approach with conservative sizing
 */
function calculateDynamicUnits(grade, odds, patternStats) {
  const simplifiedGrade = simplifyGrade(grade);
  const oddsRange = getOddsRange(odds);
  
  // Get static baseline from matrix
  const staticUnits = ABC_UNIT_MATRIX[simplifiedGrade]?.[oddsRange] || 0;
  
  // If no pattern stats or insufficient data, use static
  if (!patternStats || !patternStats.sampleSizeReliable) {
    return staticUnits;
  }
  
  const liveROI = patternStats.roi;
  const staticROI = {
    'A': { 'EXTREME_FAV': -22.8, 'BIG_FAV': 15.7, 'MOD_FAV': 12.1, 'SLIGHT_FAV': 25.0, 'PICKEM': 1.2, 'DOG': 12.6 },
    'B': { 'EXTREME_FAV': 1.0, 'BIG_FAV': 14.9, 'MOD_FAV': 4.0, 'SLIGHT_FAV': 54.9, 'PICKEM': 68.7, 'DOG': 0 },
    'C': { 'EXTREME_FAV': 2.5, 'BIG_FAV': -21.8, 'MOD_FAV': 21.7, 'SLIGHT_FAV': -28.1, 'PICKEM': -38.0, 'DOG': 0 }
  };
  
  const expectedROI = staticROI[simplifiedGrade]?.[oddsRange] || 0;
  const roiDelta = liveROI - expectedROI;
  
  // Adjust units based on ROI performance
  // If live ROI is better than expected, increase units (up to +1.5u)
  // If live ROI is worse than expected, decrease units (down to -1.5u)
  let adjustment = 0;
  
  if (Math.abs(roiDelta) > 10) { // Significant difference (>10% ROI)
    adjustment = (roiDelta / 50) * 1.5; // Scale: 50% ROI difference = 1.5u adjustment
    adjustment = Math.max(-1.5, Math.min(1.5, adjustment)); // Cap at ±1.5u
  }
  
  let dynamicUnits = staticUnits + adjustment;
  
  // Apply bounds: 0.5u minimum, 5.0u maximum
  dynamicUnits = Math.max(0.5, Math.min(5.0, dynamicUnits));
  
  // Round to nearest 0.5u for cleaner display
  dynamicUnits = Math.round(dynamicUnits * 2) / 2;
  
  return dynamicUnits;
}

/**
 * Main function to update pending bets
 */
export async function updatePendingBets() {
  console.log('\n🔄 PENDING BETS UPDATE');
  console.log('==================================\n');

  try {
    // 1. Fetch all pending bets
    console.log('📂 Fetching pending bets from Firebase...');
    const pendingSnapshot = await db.collection('basketball_bets')
      .where('status', '==', 'PENDING')
      .get();
    
    const pendingBets = pendingSnapshot.docs.map(doc => ({ 
      docId: doc.id, 
      ...doc.data() 
    }));
    
    console.log(`✅ Found ${pendingBets.length} pending bets\n`);

    if (pendingBets.length === 0) {
      console.log('⏭️  No pending bets to update. Exiting.');
      return 0;
    }

    // 2. Load pattern performance data
    console.log('📊 Loading pattern performance data...');
    const patternSnapshot = await db.collection('basketball_pattern_performance').get();
    const patternData = {};
    
    patternSnapshot.docs.forEach(doc => {
      patternData[doc.id] = doc.data();
    });
    
    console.log(`✅ Loaded ${Object.keys(patternData).length} pattern stats\n`);

    // 3. Update bets that haven't started yet
    console.log('🎯 Checking bets for updates...\n');
    
    const batch = db.batch();
    let updatedCount = 0;
    let skippedStarted = 0;
    let skippedNoChange = 0;

    for (const bet of pendingBets) {
      const gameTime = bet.game?.gameTime;
      const betRef = db.collection('basketball_bets').doc(bet.docId);
      
      // Skip if game has started
      if (hasGameStarted(gameTime)) {
        skippedStarted++;
        continue;
      }

      // Get pattern stats
      const grade = bet.prediction?.grade || 'C';
      const odds = bet.bet?.odds || 0;
      const simplifiedGrade = simplifyGrade(grade);
      const oddsRange = getOddsRange(odds);
      const patternKey = `${simplifiedGrade}_${oddsRange}`;
      const patternStats = patternData[patternKey];

      // Calculate new unit size
      const currentUnits = bet.prediction?.unitSize || 0;
      const newUnits = calculateDynamicUnits(grade, odds, patternStats);
      const unitDelta = Math.abs(newUnits - currentUnits);

      // Only update if change is significant (>0.5u)
      if (unitDelta <= 0.5) {
        skippedNoChange++;
        continue;
      }

      // Log the update
      const roiInfo = patternStats 
        ? `${patternStats.roi >= 0 ? '+' : ''}${patternStats.roi.toFixed(1)}% ROI (${patternStats.totalBets} bets)`
        : 'No pattern data';
      
      console.log(`📝 ${bet.game.awayTeam} @ ${bet.game.homeTeam}`);
      console.log(`   ${grade} @ ${odds} (${oddsRange})`);
      console.log(`   Units: ${currentUnits}u → ${newUnits}u (${newUnits > currentUnits ? '+' : ''}${(newUnits - currentUnits).toFixed(1)}u)`);
      console.log(`   Pattern: ${roiInfo}\n`);

      // Update the bet document
      batch.update(betRef, {
        'prediction.unitSize': newUnits,
        'prediction.historicalROI': patternStats?.roi || bet.prediction?.historicalROI || 0,
        'prediction.liveROIUpdated': true,
        'prediction.lastUpdatedAt': admin.firestore.FieldValue.serverTimestamp()
      });

      updatedCount++;
    }

    // Commit all updates
    if (updatedCount > 0) {
      await batch.commit();
    }

    console.log('==================================');
    console.log('📊 Update Summary:');
    console.log(`   ✅ Updated: ${updatedCount}`);
    console.log(`   🏁 Skipped (started): ${skippedStarted}`);
    console.log(`   ⏭️  Skipped (no change): ${skippedNoChange}`);
    console.log('==================================\n');

    return updatedCount;

  } catch (error) {
    console.error('❌ Error updating pending bets:', error);
    throw error;
  }
}

// Allow direct execution for testing/manual updates
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  updatePendingBets()
    .then(count => {
      console.log(`✅ Pending bets update complete: ${count} bets updated`);
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Pending bets update failed:', error);
      process.exit(1);
    });
}

