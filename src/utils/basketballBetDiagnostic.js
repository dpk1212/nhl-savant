/**
 * Basketball Bet Diagnostic Tool
 * 
 * Checks if bets exist in Firebase and diagnoses grading issues
 */

import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export async function diagnoseBetGrading(awayTeam, homeTeam) {
  const date = new Date().toISOString().split('T')[0];
  const normalizeForId = (name) => name.replace(/\s+/g, '_').toUpperCase();
  
  const awayNorm = normalizeForId(awayTeam);
  const homeNorm = normalizeForId(homeTeam);
  
  const possibleBetIds = [
    `${date}_${awayNorm}_${homeNorm}_MONEYLINE_${awayNorm}_(AWAY)`,
    `${date}_${awayNorm}_${homeNorm}_MONEYLINE_${homeNorm}_(HOME)`
  ];
  
  console.log('\n🔍 BET GRADING DIAGNOSTIC');
  console.log('='.repeat(70));
  console.log(`Game: ${awayTeam} @ ${homeTeam}`);
  console.log(`Date: ${date}`);
  console.log(`\nLooking for bet IDs:`);
  possibleBetIds.forEach((id, i) => console.log(`  ${i + 1}. ${id}`));
  
  for (const betId of possibleBetIds) {
    const betRef = doc(db, 'basketball_bets', betId);
    const betDoc = await getDoc(betRef);
    
    if (betDoc.exists()) {
      const betData = betDoc.data();
      console.log(`\n✅ FOUND BET: ${betId}`);
      console.log(`   Status: ${betData.status}`);
      console.log(`   Pick: ${betData.bet?.team}`);
      console.log(`   Odds: ${betData.bet?.odds}`);
      console.log(`   Grade: ${betData.prediction?.grade}`);
      console.log(`   Result: ${betData.result?.outcome || 'PENDING'}`);
      console.log(`   Profit: ${betData.result?.profit || 'N/A'}`);
      
      if (betData.result?.awayScore !== null && betData.result?.awayScore !== undefined) {
        console.log(`   Score: ${betData.result.awayScore}-${betData.result.homeScore}`);
      }
      
      return {
        found: true,
        betId,
        data: betData
      };
    }
  }
  
  console.log(`\n❌ NO BET FOUND`);
  console.log(`\nPossible reasons:`);
  console.log(`  1. Bet was never written to Firebase (check if workflow ran today)`);
  console.log(`  2. Team names don't match exactly`);
  console.log(`  3. Bet was written on a different date`);
  
  // Check all basketball_bets to see if there's a similar bet
  console.log(`\nChecking all bets for today...`);
  const allBetsSnapshot = await getDocs(collection(db, 'basketball_bets'));
  const todayBets = [];
  
  allBetsSnapshot.forEach((doc) => {
    const bet = doc.data();
    if (doc.id.startsWith(date)) {
      todayBets.push({
        id: doc.id,
        away: bet.game?.awayTeam,
        home: bet.game?.homeTeam,
        pick: bet.bet?.team,
        status: bet.status
      });
    }
  });
  
  console.log(`\nFound ${todayBets.length} bets for today (${date}):`);
  todayBets.forEach((bet, i) => {
    console.log(`  ${i + 1}. ${bet.away} @ ${bet.home} (Pick: ${bet.pick}, Status: ${bet.status})`);
  });
  
  console.log('='.repeat(70) + '\n');
  
  return {
    found: false,
    todayBetsCount: todayBets.length,
    todayBets
  };
}

export async function getAllPendingBets() {
  const betsSnapshot = await getDocs(collection(db, 'basketball_bets'));
  const pendingBets = [];
  
  betsSnapshot.forEach((doc) => {
    const bet = doc.data();
    if (bet.status === 'PENDING') {
      pendingBets.push({
        id: doc.id,
        game: `${bet.game?.awayTeam} @ ${bet.game?.homeTeam}`,
        pick: bet.bet?.team,
        date: bet.date,
        grade: bet.prediction?.grade
      });
    }
  });
  
  return pendingBets;
}

