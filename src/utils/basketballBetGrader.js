/**
 * Basketball Bet Grader - Real-time client-side grading
 * Grades bets instantly when game shows as FINAL (ESPN or NCAA API)
 */

import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
// Note: We use actual bet units from Firebase, not recalculated from matrix

/**
 * Grade a basketball bet instantly when game goes final
 */
export async function gradeBasketballBet(awayTeam, homeTeam, liveScore, currentPrediction) {
  // Only grade if game is final and has valid scores
  if (liveScore?.status !== 'final' || liveScore.awayScore === null || liveScore.homeScore === null) {
    return false;
  }
  
  try {
    // 🔧 FIX: Use ET date instead of UTC to match bet creation date
    const now = new Date();
    const etString = now.toLocaleString('en-US', { timeZone: 'America/New_York' });
    const etDate = new Date(etString);
    const year = etDate.getFullYear();
    const month = String(etDate.getMonth() + 1).padStart(2, '0');
    const day = String(etDate.getDate()).padStart(2, '0');
    const date = `${year}-${month}-${day}`;
    
    const normalizeForId = (name) => name.replace(/\s+/g, '_').toUpperCase();
    
    const awayNorm = normalizeForId(awayTeam);
    const homeNorm = normalizeForId(homeTeam);
    
    // Try both possible bet IDs
    const possibleBetIds = [
      `${date}_${awayNorm}_${homeNorm}_MONEYLINE_${awayNorm}_(AWAY)`,
      `${date}_${awayNorm}_${homeNorm}_MONEYLINE_${homeNorm}_(HOME)`
    ];
    
    let gradedBet = null;
    let betId = null;
    
    // Find which bet exists
    for (const id of possibleBetIds) {
      const betRef = doc(db, 'basketball_bets', id);
      const betDoc = await getDoc(betRef);
      
      if (betDoc.exists()) {
        const betData = betDoc.data();
        
        // Skip if already graded
        if (betData.status === 'COMPLETED') {
          console.log(`⏭️  Already graded: ${awayTeam} @ ${homeTeam}`);
          return false;
        }
        
        gradedBet = betData;
        betId = id;
        break;
      }
    }
    
    // No bet found - we didn't bet on this game (this is normal)
    if (!gradedBet) {
      return false;
    }
    
    console.log(`🎯 Grading bet for: ${awayTeam} @ ${homeTeam}`);
    
    // Determine winner
    const winnerTeam = liveScore.awayScore > liveScore.homeScore ? awayTeam : homeTeam;
    
    // Determine outcome
    const normalizeTeam = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const betTeamNorm = normalizeTeam(gradedBet.bet.team);
    const winnerNorm = normalizeTeam(winnerTeam);
    const outcome = betTeamNorm === winnerNorm ? 'WIN' : 'LOSS';
    
    // Calculate profit using ACTUAL BET UNITS (not recalculated from matrix!)
    // The unit size stored in Firebase is the source of truth
    const actualUnits = gradedBet.bet?.units || gradedBet.prediction?.unitSize || 1;
    const odds = gradedBet.bet.odds;
    
    let profit;
    if (outcome === 'WIN') {
      // American odds to decimal payout
      const decimal = odds > 0 ? (odds / 100) : (100 / Math.abs(odds));
      profit = actualUnits * decimal;
    } else {
      // Loss = lose the staked amount
      profit = -actualUnits;
    }
    
    const currentGrade = currentPrediction?.grade || gradedBet.prediction?.grade || 'B';
    
    // Update bet in Firebase
    const betRef = doc(db, 'basketball_bets', betId);
    await updateDoc(betRef, {
      'result.awayScore': liveScore.awayScore,
      'result.homeScore': liveScore.homeScore,
      'result.winner': liveScore.awayScore > liveScore.homeScore ? 'AWAY' : 'HOME',
      'result.winnerTeam': winnerTeam,
      'result.outcome': outcome,
      'result.profit': profit,
      'result.fetched': true,
      'result.fetchedAt': Date.now(),
      'result.source': `${liveScore.source || 'NCAA'}_API_LIVE`,
      'prediction.grade': currentGrade,
      'status': 'COMPLETED',
      'gradedAt': Date.now()
    });
    
    console.log(`✅ BET GRADED: ${awayTeam} @ ${homeTeam} → ${outcome} ${profit > 0 ? '+' : ''}${profit.toFixed(2)}u`);
    return true;
    
  } catch (error) {
    // 🚨 DETAILED ERROR LOGGING
    console.error(`❌ BET GRADING FAILED: ${awayTeam} @ ${homeTeam}`);
    console.error('   Error:', error.message);
    console.error('   Code:', error.code);
    console.error('   Firebase Auth:', error.code === 'permission-denied' ? 'DENIED' : 'OK');
    
    if (error.code === 'permission-denied') {
      console.error('   🔒 Check Firebase rules for basketball_bets collection');
    } else if (error.code === 'unavailable') {
      console.error('   🌐 Firebase temporarily unavailable - will retry');
    } else if (error.code === 'not-found') {
      console.error('   📝 Bet document not found (likely no bet placed)');
    }
    
    return false;
  }
}
