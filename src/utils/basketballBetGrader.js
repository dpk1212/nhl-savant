/**
 * Basketball Bet Grader - Real-time client-side grading
 * Grades bets instantly when game shows as FINAL (ESPN or NCAA API)
 */

import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
// Note: We use actual bet units from Firebase, not recalculated from matrix

/**
 * Grade ALL basketball bets for a game when it goes final.
 * A single game can have SPREAD, TOTAL, and MONEYLINE bets — grade each independently.
 */
export async function gradeBasketballBet(awayTeam, homeTeam, liveScore, currentPrediction) {
  if (liveScore?.status !== 'final' || liveScore.awayScore === null || liveScore.homeScore === null) {
    return false;
  }
  
  try {
    const now = new Date();
    const etString = now.toLocaleString('en-US', { timeZone: 'America/New_York' });
    const etDate = new Date(etString);
    const year = etDate.getFullYear();
    const month = String(etDate.getMonth() + 1).padStart(2, '0');
    const day = String(etDate.getDate()).padStart(2, '0');
    const date = `${year}-${month}-${day}`;
    
    const yesterday = new Date(etDate);
    yesterday.setDate(yesterday.getDate() - 1);
    const yYear = yesterday.getFullYear();
    const yMonth = String(yesterday.getMonth() + 1).padStart(2, '0');
    const yDay = String(yesterday.getDate()).padStart(2, '0');
    const prevDate = `${yYear}-${yMonth}-${yDay}`;
    
    const normalizeForId = (name) => name.replace(/\s+/g, '_').toUpperCase();
    
    const awayNorm = normalizeForId(awayTeam);
    const homeNorm = normalizeForId(homeTeam);
    
    const possibleBetIds = [
      `${date}_${awayNorm}_${homeNorm}_MONEYLINE_${awayNorm}_(AWAY)`,
      `${date}_${awayNorm}_${homeNorm}_MONEYLINE_${homeNorm}_(HOME)`,
      `${date}_${awayNorm}_${homeNorm}_SPREAD_${awayNorm}_(AWAY)`,
      `${date}_${awayNorm}_${homeNorm}_SPREAD_${homeNorm}_(HOME)`,
      `${date}_${awayNorm}_${homeNorm}_TOTAL_OVER`,
      `${date}_${awayNorm}_${homeNorm}_TOTAL_UNDER`,
      `${prevDate}_${awayNorm}_${homeNorm}_MONEYLINE_${awayNorm}_(AWAY)`,
      `${prevDate}_${awayNorm}_${homeNorm}_MONEYLINE_${homeNorm}_(HOME)`,
      `${prevDate}_${awayNorm}_${homeNorm}_SPREAD_${awayNorm}_(AWAY)`,
      `${prevDate}_${awayNorm}_${homeNorm}_SPREAD_${homeNorm}_(HOME)`,
      `${prevDate}_${awayNorm}_${homeNorm}_TOTAL_OVER`,
      `${prevDate}_${awayNorm}_${homeNorm}_TOTAL_UNDER`
    ];
    
    const winnerTeam = liveScore.awayScore > liveScore.homeScore ? awayTeam : homeTeam;
    const totalScore = liveScore.awayScore + liveScore.homeScore;
    const normalizeTeam = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const currentGrade = currentPrediction?.grade || 'B';
    
    let anyGraded = false;
    
    for (const id of possibleBetIds) {
      const betRef = doc(db, 'basketball_bets', id);
      const betDoc = await getDoc(betRef);
      
      if (!betDoc.exists()) continue;
      
      const betData = betDoc.data();
      if (betData.status === 'COMPLETED') continue;
      
      console.log(`🎯 Grading bet ${id}`);
      
      const isATSBet = betData.betRecommendation?.type === 'ATS' || betData.isATSPick;
      const isTotalsBet = betData.betRecommendation?.type === 'TOTAL' || betData.isTotalsPick || betData.bet?.market === 'TOTAL';
      
      let outcome;
      
      if (isTotalsBet) {
        const direction = betData.bet?.pick || betData.totalsAnalysis?.direction || betData.betRecommendation?.totalDirection;
        const line = betData.bet?.total || betData.totalsAnalysis?.marketTotal || betData.betRecommendation?.totalLine;
        if (direction === 'OVER') {
          outcome = totalScore > line ? 'WIN' : totalScore === line ? 'PUSH' : 'LOSS';
        } else {
          outcome = totalScore < line ? 'WIN' : totalScore === line ? 'PUSH' : 'LOSS';
        }
        console.log(`   📐 TOTAL: ${direction} ${line}, actual ${totalScore} → ${outcome}`);
      } else if (isATSBet) {
        const spread = betData.betRecommendation?.atsSpread || betData.spreadAnalysis?.spread || betData.bet?.spread;
        const betTeamNorm = normalizeTeam(betData.bet.team);
        const awayNorm2 = normalizeTeam(awayTeam);
        const isAway = betTeamNorm === awayNorm2;
        const pickedScore = isAway ? liveScore.awayScore : liveScore.homeScore;
        const oppScore = isAway ? liveScore.homeScore : liveScore.awayScore;
        const margin = pickedScore - oppScore;
        const adjusted = margin + spread;
        outcome = adjusted > 0 ? 'WIN' : adjusted === 0 ? 'PUSH' : 'LOSS';
        console.log(`   📐 ATS: margin ${margin}, spread ${spread}, adjusted ${adjusted} → ${outcome}`);
      } else {
        const betTeamNorm = normalizeTeam(betData.bet.team);
        const winnerNorm = normalizeTeam(winnerTeam);
        outcome = betTeamNorm === winnerNorm ? 'WIN' : 'LOSS';
      }
      
      const actualUnits = betData.bet?.units || betData.prediction?.unitSize || 1;
      const odds = (isATSBet || isTotalsBet) ? -110 : betData.bet.odds;
      
      let profit;
      if (outcome === 'WIN') {
        const decimal = odds > 0 ? (odds / 100) : (100 / Math.abs(odds));
        profit = actualUnits * decimal;
      } else if (outcome === 'PUSH') {
        profit = 0;
      } else {
        profit = -actualUnits;
      }
      
      const grade = currentPrediction?.grade || betData.prediction?.grade || currentGrade;
      
      await updateDoc(betRef, {
        'result.awayScore': liveScore.awayScore,
        'result.homeScore': liveScore.homeScore,
        'result.totalScore': totalScore,
        'result.winner': liveScore.awayScore > liveScore.homeScore ? 'AWAY' : 'HOME',
        'result.winnerTeam': winnerTeam,
        'result.outcome': outcome,
        'result.profit': profit,
        'result.units': actualUnits,
        'result.fetched': true,
        'result.fetchedAt': Date.now(),
        'result.source': `${liveScore.source || 'NCAA'}_API_LIVE`,
        'prediction.grade': grade,
        'status': 'COMPLETED',
        'gradedAt': Date.now()
      });
      
      console.log(`✅ BET GRADED: ${id} → ${outcome} ${profit > 0 ? '+' : ''}${profit.toFixed(2)}u`);
      anyGraded = true;
    }
    
    return anyGraded;
    
  } catch (error) {
    console.error(`❌ BET GRADING FAILED: ${awayTeam} @ ${homeTeam}`);
    console.error('   Error:', error.message);
    console.error('   Code:', error.code);
    
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
