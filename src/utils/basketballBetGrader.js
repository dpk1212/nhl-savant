/**
 * Basketball Bet Grader - Real-time client-side grading
 * Grades bets instantly when NCAA API shows game as FINAL
 */

import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getUnitSize, calculateUnitProfit } from './staggeredUnits';

/**
 * Grade a basketball bet instantly when game goes final
 */
export async function gradeBasketballBet(awayTeam, homeTeam, liveScore, currentPrediction) {
  // Only grade if game is final and has valid scores
  if (liveScore?.status !== 'final' || liveScore.awayScore === null || liveScore.homeScore === null) {
    return false;
  }
  
  try {
    // Generate bet ID using same format as writeBasketballBets.js
    const date = new Date().toISOString().split('T')[0];
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
          return false;
        }
        
        gradedBet = betData;
        betId = id;
        break;
      }
    }
    
    // No bet found - we didn't bet on this game
    if (!gradedBet) {
      return false;
    }
    
    // Determine winner
    const winnerTeam = liveScore.awayScore > liveScore.homeScore ? awayTeam : homeTeam;
    
    // Determine outcome
    const normalizeTeam = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const betTeamNorm = normalizeTeam(gradedBet.bet.team);
    const winnerNorm = normalizeTeam(winnerTeam);
    const outcome = betTeamNorm === winnerNorm ? 'WIN' : 'LOSS';
    
    // Calculate profit using CURRENT grade
    const currentGrade = currentPrediction?.grade || gradedBet.prediction?.grade || 'B';
    const profit = calculateUnitProfit(currentGrade, gradedBet.bet.odds, outcome === 'WIN');
    
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
      'result.source': 'NCAA_API_LIVE',
      'prediction.grade': currentGrade,
      'status': 'COMPLETED',
      'gradedAt': Date.now()
    });
    
    console.log(`✅ BET GRADED: ${outcome} ${profit > 0 ? '+' : ''}${profit.toFixed(2)}u`);
    
    return true;
    
  } catch (error) {
    return false;
  }
}
