/**
 * Basketball Results Grader Hook
 * 
 * Loads basketball_results.json and grades pending bets CLIENT-SIDE
 * Uses existing Firebase Client SDK (already working!)
 * 
 * Usage: Call from Basketball page to auto-grade bets
 */

import { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getETGameDate } from '../utils/dateUtils';

export function useBasketballResultsGrader() {
  const [grading, setGrading] = useState(false);
  const [gradedCount, setGradedCount] = useState(0);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    gradeBasketballBets();
  }, []);
  
  async function gradeBasketballBets() {
    try {
      setGrading(true);
      
      // 1. Load results from JSON file
      const resultsResponse = await fetch('/basketball_results.json');
      if (!resultsResponse.ok) {
        console.log('No results file found yet');
        return;
      }
      
      const resultsData = await resultsResponse.json();
      const results = resultsData.results || [];
      
      if (results.length === 0) {
        console.log('No completed games found');
        return;
      }
      
      console.log(`📊 Found ${results.length} completed games`);
      
      // 2. Fetch pending bets from Firebase (CLIENT SDK - already works!)
      const gameDate = getETGameDate();
      const betsQuery = query(
        collection(db, 'basketball_bets'),
        where('status', '==', 'PENDING'),
        where('date', '==', gameDate)
      );
      
      const betsSnapshot = await getDocs(betsQuery);
      console.log(`📊 Found ${betsSnapshot.size} pending bets`);
      
      if (betsSnapshot.empty) {
        return;
      }
      
      // 3. Grade bets
      let graded = 0;
      
      for (const betDoc of betsSnapshot.docs) {
        const bet = betDoc.data();
        const betId = betDoc.id;
        
        // Normalize team names for fuzzy matching
        const normalizeTeam = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, '');
        
        // Find matching result
        const matchingResult = results.find(result => {
          const awayMatch = normalizeTeam(result.awayTeam) === normalizeTeam(bet.game.awayTeam);
          const homeMatch = normalizeTeam(result.homeTeam) === normalizeTeam(bet.game.homeTeam);
          return awayMatch && homeMatch;
        });
        
        if (!matchingResult) {
          continue;
        }
        
        // Determine outcome
        const betTeam = bet.bet.team;
        const normalizedBetTeam = normalizeTeam(betTeam);
        const normalizedWinner = normalizeTeam(matchingResult.winnerTeam);
        const outcome = normalizedBetTeam === normalizedWinner ? 'WIN' : 'LOSS';
        
        // Calculate profit (1 unit flat bet)
        const profit = outcome === 'WIN' 
          ? (bet.bet.odds < 0 ? 100 / Math.abs(bet.bet.odds) : bet.bet.odds / 100)
          : -1;
        
        // Update bet in Firebase (CLIENT SDK - already works!)
        await updateDoc(doc(db, 'basketball_bets', betId), {
          'result.winner': matchingResult.winner,
          'result.winnerTeam': matchingResult.winnerTeam,
          'result.outcome': outcome,
          'result.profit': profit,
          'result.fetched': true,
          'result.fetchedAt': Date.now(),
          'result.source': 'OddsTrader',
          'status': 'COMPLETED'
        });
        
        graded++;
        console.log(`✅ ${outcome}: ${bet.game.awayTeam} @ ${bet.game.homeTeam}`);
      }
      
      setGradedCount(graded);
      console.log(`✅ Graded ${graded} bets`);
      
    } catch (err) {
      console.error('Error grading bets:', err);
      setError(err.message);
    } finally {
      setGrading(false);
    }
  }
  
  return { grading, gradedCount, error };
}

