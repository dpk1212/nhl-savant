/**
 * Client-Side Pattern ROI Updater
 * 
 * Calculates and updates historical ROI for each grade×odds pattern
 * Runs in the browser after bets are graded
 * Uses Firebase Client SDK
 */

import { collection, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getOddsRange, simplifyGrade } from './abcUnits';

/**
 * Update all pattern ROI data in Firebase
 * Called after client-side bet grading completes
 */
export async function updateAllPatternROI() {
  try {
    console.log('🔄 Updating pattern ROI data...');
    
    // 1. Fetch all completed bets from Firebase
    const betsSnapshot = await getDocs(collection(db, 'basketball_bets'));
    const completedBets = betsSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(bet => bet.result?.outcome === 'WIN' || bet.result?.outcome === 'LOSS');
    
    console.log(`   Found ${completedBets.length} completed bets`);
    
    if (completedBets.length === 0) {
      console.log('   No completed bets to analyze');
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
    
    console.log(`   Analyzing ${Object.keys(patterns).length} patterns`);
    
    // 3. Calculate and save stats for each pattern
    const patternPerformanceRef = collection(db, 'basketball_pattern_performance');
    let updatedCount = 0;
    
    for (const patternKey in patterns) {
      const pattern = patterns[patternKey];
      const stats = calculatePatternStats(pattern.bets);
      
      // Save to Firebase
      const docRef = doc(patternPerformanceRef, patternKey);
      await setDoc(docRef, {
        grade: pattern.grade,
        oddsRange: pattern.oddsRange,
        patternKey,
        ...stats,
        lastUpdated: serverTimestamp(),
        lastBetDate: pattern.bets.reduce((latest, bet) => {
          const betDate = bet.date || bet.id.split('_')[0];
          return betDate > latest ? betDate : latest;
        }, '1970-01-01')
      }, { merge: true });
      
      updatedCount++;
      
      // Log significant patterns
      if (stats.totalBets >= 5) {
        console.log(`   ${patternKey}: ${stats.totalBets} bets, ${stats.winRate.toFixed(1)}% win, ${stats.roi.toFixed(1)}% ROI`);
      }
    }
    
    console.log(`✅ Updated ${updatedCount} patterns in Firebase`);
    
  } catch (error) {
    console.error('❌ Error updating pattern ROI:', error);
    // Don't throw - this is a background operation
  }
}

/**
 * Calculate statistics for a pattern's bets
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
    
    // Use actual units risked from result if available, otherwise prediction
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
    sampleSizeReliable: totalBets >= 15 // Flag for reliability
  };
}

