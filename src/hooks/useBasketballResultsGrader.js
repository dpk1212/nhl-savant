/**
 * Basketball Results Grader Hook
 * 
 * Loads basketball_results.json and grades pending bets CLIENT-SIDE
 * Uses existing Firebase Client SDK (already working!)
 * Uses CSV mapping for robust team name matching
 * Uses optimized unit allocation system for accurate profit calculation
 * 
 * Usage: Call from Basketball page to auto-grade bets
 */

import { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getETGameDate } from '../utils/dateUtils';
import { getOptimizedUnitSize, calculateUnitProfit } from '../utils/abcUnits';
import { updateAllPatternROI } from '../utils/clientPatternROI';
import { updatePendingBets } from '../utils/clientPendingUpdater';

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
      
      // 1. Load CSV mapping for team names
      const csvResponse = await fetch('/basketball_teams.csv');
      const csvText = await csvResponse.text();
      const csvLines = csvText.trim().split('\n');
      const teamMap = {};
      
      for (let i = 1; i < csvLines.length; i++) {
        const line = csvLines[i];
        if (!line) continue;
        const [oddsTrader, haslametrics, dratings] = line.split(',').map(t => t.trim());
        if (oddsTrader) {
          // Map OddsTrader name to itself (normalized)
          const normalized = oddsTrader.toLowerCase().replace(/[^a-z0-9]/g, '');
          teamMap[normalized] = oddsTrader;
        }
      }
      
      console.log(`📋 Loaded ${Object.keys(teamMap).length} team mappings`);
      
      // 2. Load results from JSON file
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
      
      // 3. Fetch ALL pending bets (don't filter by date - grade any completed game)
      const betsQuery = query(
        collection(db, 'basketball_bets'),
        where('status', '==', 'PENDING')
      );
      
      const betsSnapshot = await getDocs(betsQuery);
      console.log(`📊 Found ${betsSnapshot.size} pending bets (all dates)`);
      
      if (betsSnapshot.empty) {
        return;
      }
      
      //  Log all bet dates to understand what we're working with
      const betDates = {};
      betsSnapshot.docs.forEach(doc => {
        const betDate = doc.data().date;
        betDates[betDate] = (betDates[betDate] || 0) + 1;
      });
      console.log(`📅 Bet dates: ${JSON.stringify(betDates)}`);
      console.log(`🏀 Results available: ${results.length} games`);
      results.forEach(r => console.log(`   - ${r.awayTeam} @ ${r.homeTeam}`));
      
      // 4. Grade bets using CSV-normalized matching
      let graded = 0;
      const normalizeTeam = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      for (const betDoc of betsSnapshot.docs) {
        const bet = betDoc.data();
        const betId = betDoc.id;
        
        console.log(`🔍 [${bet.date}] Grading bet: ${bet.game.awayTeam} @ ${bet.game.homeTeam}`);
        
        // Find matching result using normalized team names
        const matchingResult = results.find(result => {
          const normalizedResultAway = normalizeTeam(result.awayTeam);
          const normalizedResultHome = normalizeTeam(result.homeTeam);
          const normalizedBetAway = normalizeTeam(bet.game.awayTeam);
          const normalizedBetHome = normalizeTeam(bet.game.homeTeam);
          
          return normalizedResultAway === normalizedBetAway && normalizedResultHome === normalizedBetHome;
        });
        
        if (!matchingResult) {
          console.log(`   ⏭️  No result found yet`);
          continue;
        }
        
        // Determine outcome
        const betTeam = bet.bet.team;
        const normalizedBetTeam = normalizeTeam(betTeam);
        const normalizedWinner = normalizeTeam(matchingResult.winnerTeam);
        const outcome = normalizedBetTeam === normalizedWinner ? 'WIN' : 'LOSS';
        
        // ✅ USE STORED KELLY UNITS from prediction
        const grade = bet.prediction?.grade;
        const odds = bet.bet?.odds;
        const units = bet.prediction?.unitSize || 1.0;
        
        // Calculate profit based on actual units risked
        const profit = calculateUnitProfit(grade, odds, outcome === 'WIN', units);
        
        // Update bet in Firebase (CLIENT SDK - already works!)
        await updateDoc(doc(db, 'basketball_bets', betId), {
          'result.winner': matchingResult.winner,
          'result.winnerTeam': matchingResult.winnerTeam,
          'result.loserTeam': matchingResult.loserTeam,
          'result.outcome': outcome,
          'result.profit': profit,
          'result.units': units,  // ✅ Store actual units risked
          'result.fetched': true,
          'result.fetchedAt': Date.now(),
          'result.source': 'OddsTrader',
          'status': 'COMPLETED'
        });
        
        graded++;
        const emoji = outcome === 'WIN' ? '✅' : '❌';
        const profitStr = profit > 0 ? `+${profit.toFixed(2)}u` : `${profit.toFixed(2)}u`;
        console.log(`   ${emoji} ${outcome}: Pick ${betTeam} (${bet.bet.odds}) → Winner: ${matchingResult.winnerTeam} → ${profitStr}`);
      }
      
      setGradedCount(graded);
      console.log(`\n🎉 Graded ${graded}/${betsSnapshot.size} bets`);
      
      // ✅ DYNAMIC ROI SYSTEM: Update pattern performance & pending bets
      if (graded > 0) {
        console.log('\n🔄 Activating dynamic ROI system...');
        
        // Update historical ROI for all patterns
        await updateAllPatternROI();
        
        // Update pending bets with new unit sizes based on live ROI
        await updatePendingBets();
        
        console.log('✅ Dynamic ROI system updated!');
        console.log('   Refresh page to see updated results!');
      }
      
    } catch (err) {
      console.error('Error grading bets:', err);
      setError(err.message);
    } finally {
      setGrading(false);
    }
  }
  
  return { grading, gradedCount, error };
}

