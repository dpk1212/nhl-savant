/**
 * Client-Side Pending Bet Updater
 * 
 * Updates unit sizing for pending bets based on live ROI data
 * Only updates bets for games that haven't started yet
 * Uses Firebase Client SDK
 */

import { collection, getDocs, doc, updateDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getOddsRange, simplifyGrade, getOptimizedUnitSize } from './abcUnits';

/**
 * Fetch live ROI data for a specific pattern from Firebase
 */
async function getLivePatternROI(grade, oddsRange) {
  try {
    const patternKey = `${grade}_${oddsRange}`;
    const patternDoc = await getDocs(
      query(
        collection(db, 'basketball_pattern_performance'),
        where('patternKey', '==', patternKey)
      )
    );
    
    if (!patternDoc.empty) {
      return patternDoc.docs[0].data();
    }
    return null;
  } catch (error) {
    console.error(`Error fetching pattern ROI for ${grade}_${oddsRange}:`, error);
    return null;
  }
}

/**
 * Check if a game has started based on game time
 */
function hasGameStarted(gameTimeStr, gameDate) {
  if (!gameTimeStr) return false;
  
  try {
    // Parse game time (e.g., "7:00 PM ET")
    const timeMatch = gameTimeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!timeMatch) return false;
    
    let hours = parseInt(timeMatch[1]);
    const minutes = parseInt(timeMatch[2]);
    const ampm = timeMatch[3].toUpperCase();
    
    // Convert to 24-hour format
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    
    // Create game datetime
    const gameDateObj = new Date(gameDate);
    gameDateObj.setHours(hours, minutes, 0, 0);
    
    // Compare with current time
    const now = new Date();
    return now > gameDateObj;
  } catch (error) {
    console.error('Error parsing game time:', error);
    return false; // If we can't parse, assume game hasn't started (safe default)
  }
}

/**
 * Update pending bets with new unit sizes based on live ROI
 * Only updates bets for games that haven't started
 */
export async function updatePendingBets() {
  try {
    console.log('🔄 Updating pending bets with live ROI data...');
    
    // Fetch all pending bets
    const pendingBetsSnapshot = await getDocs(
      query(
        collection(db, 'basketball_bets'),
        where('status', '==', 'PENDING')
      )
    );
    
    console.log(`   Found ${pendingBetsSnapshot.size} pending bets`);
    
    if (pendingBetsSnapshot.empty) {
      console.log('   No pending bets to update');
      return;
    }
    
    let updatedCount = 0;
    let skippedStarted = 0;
    let skippedNoData = 0;
    let skippedNoChange = 0;
    
    for (const betDoc of pendingBetsSnapshot.docs) {
      const bet = betDoc.data();
      const betId = betDoc.id;
      
      // Check if game has started
      const gameStarted = hasGameStarted(bet.game?.gameTime, bet.date);
      if (gameStarted) {
        skippedStarted++;
        continue;
      }
      
      // Get bet details
      const grade = simplifyGrade(bet.prediction?.grade);
      const odds = bet.bet?.odds;
      const oddsRange = getOddsRange(odds);
      
      if (!grade || !odds || !oddsRange) {
        console.log(`   ⚠️  Skipping ${betId}: Missing grade or odds data`);
        skippedNoData++;
        continue;
      }
      
      // Fetch live ROI for this pattern
      const livePatternData = await getLivePatternROI(grade, oddsRange);
      
      if (livePatternData && livePatternData.sampleSizeReliable) {
        const currentUnits = bet.prediction?.unitSize || 0;
        const newHistoricalROI = livePatternData.roi;
        
        // Calculate new optimized units (using current static matrix)
        // In future, we could pass live ROI to adjust units dynamically
        const newOptimizedUnits = getOptimizedUnitSize(grade, odds);
        
        // Only update if units change significantly (> 0.5 units)
        if (Math.abs(newOptimizedUnits - currentUnits) >= 0.5) {
          await updateDoc(doc(db, 'basketball_bets', betId), {
            'prediction.unitSize': newOptimizedUnits,
            'prediction.historicalROI': newHistoricalROI,
            'prediction.sampleSize': livePatternData.totalBets,
            'prediction.isLiveData': true,
            'lastUpdated': serverTimestamp()
          });
          
          console.log(`   ✅ Updated ${betId}: ${currentUnits}u → ${newOptimizedUnits}u (ROI: ${newHistoricalROI.toFixed(1)}%)`);
          updatedCount++;
        } else {
          skippedNoChange++;
        }
      } else {
        skippedNoData++;
      }
    }
    
    console.log(`✅ Update summary:`);
    console.log(`   - Updated: ${updatedCount} bets`);
    console.log(`   - Skipped (game started): ${skippedStarted}`);
    console.log(`   - Skipped (no data/change): ${skippedNoData + skippedNoChange}`);
    
  } catch (error) {
    console.error('❌ Error updating pending bets:', error);
    // Don't throw - this is a background operation
  }
}

