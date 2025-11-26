/**
 * Basketball Bet Grader - Real-time client-side grading
 * 
 * Grades bets instantly when NCAA API shows game as FINAL
 * No need to wait for scheduled GitHub Action!
 */

import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Grade a basketball bet instantly when game goes final
 * 
 * @param {string} awayTeam - Away team name from our prediction
 * @param {string} homeTeam - Home team name from our prediction
 * @param {object} liveScore - NCAA API live score object
 * @returns {Promise<boolean>} - True if bet was graded, false if not found/already graded
 */
export async function gradeBasketballBet(awayTeam, homeTeam, liveScore) {
  // Only grade if game is final
  if (liveScore.status !== 'final') {
    return false;
  }
  
  try {
    // Generate bet ID using same format as writeBasketballBets.js
    const date = new Date().toISOString().split('T')[0];
    const normalizeForId = (name) => name.replace(/\s+/g, '_').toUpperCase();
    
    // We need to check both possible bet IDs (away pick or home pick)
    const awayNorm = normalizeForId(awayTeam);
    const homeNorm = normalizeForId(homeTeam);
    
    // Try both possible bet IDs (we bet on either away or home)
    const possibleBetIds = [
      `${date}_${awayNorm}_${homeNorm}_MONEYLINE_${awayNorm}_(AWAY)`,
      `${date}_${awayNorm}_${homeNorm}_MONEYLINE_${homeNorm}_(HOME)`
    ];
    
    let gradedBet = null;
    let betId = null;
    
    // Find which bet exists (if any)
    for (const id of possibleBetIds) {
      const betRef = doc(db, 'basketball_bets', id);
      const betDoc = await getDoc(betRef);
      
      if (betDoc.exists()) {
        const betData = betDoc.data();
        
        // Skip if already graded
        if (betData.status === 'COMPLETED') {
          console.log(`⏭️  Bet already graded: ${id}`);
          return false;
        }
        
        gradedBet = betData;
        betId = id;
        break;
      }
    }
    
    if (!gradedBet) {
      // No bet found for this game (we didn't bet on it)
      return false;
    }
    
    // Determine winner from NCAA API scores
    const awayScore = liveScore.awayScore;
    const homeScore = liveScore.homeScore;
    const winnerTeam = awayScore > homeScore ? awayTeam : homeTeam;
    
    // Determine outcome (did our bet win?)
    const normalizeTeam = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const betTeamNorm = normalizeTeam(gradedBet.bet.team);
    const winnerNorm = normalizeTeam(winnerTeam);
    const outcome = betTeamNorm === winnerNorm ? 'WIN' : 'LOSS';
    
    // Calculate profit (1 unit flat bet)
    const odds = gradedBet.bet.odds;
    const profit = outcome === 'WIN' 
      ? (odds < 0 ? 100 / Math.abs(odds) : odds / 100)
      : -1;
    
    // Update bet in Firebase
    const betRef = doc(db, 'basketball_bets', betId);
    await updateDoc(betRef, {
      'result.awayScore': awayScore,
      'result.homeScore': homeScore,
      'result.winner': awayScore > homeScore ? 'AWAY' : 'HOME',
      'result.winnerTeam': winnerTeam,
      'result.outcome': outcome,
      'result.profit': profit,
      'result.fetched': true,
      'result.fetchedAt': Date.now(),
      'result.source': 'NCAA_API_LIVE',
      'status': 'COMPLETED'
    });
    
    console.log(`✅ ${outcome}: ${awayTeam} @ ${homeTeam}`);
    console.log(`   Pick: ${gradedBet.bet.team} (${odds > 0 ? '+' : ''}${odds})`);
    console.log(`   Score: ${awayScore}-${homeScore}`);
    console.log(`   Profit: ${profit > 0 ? '+' : ''}${profit.toFixed(2)}u`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error grading bet for ${awayTeam} @ ${homeTeam}:`, error);
    return false;
  }
}

