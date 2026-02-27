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
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
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
        
        console.log(`🔍 [${bet.date}] Grading bet: ${bet.game?.awayTeam} @ ${bet.game?.homeTeam}`);
        
        const matchingResult = results.find(result => {
          const normalizedResultAway = normalizeTeam(result.awayTeam);
          const normalizedResultHome = normalizeTeam(result.homeTeam);
          const normalizedBetAway = normalizeTeam(bet.game?.awayTeam || '');
          const normalizedBetHome = normalizeTeam(bet.game?.homeTeam || '');
          
          return normalizedResultAway === normalizedBetAway && normalizedResultHome === normalizedBetHome;
        });
        
        if (!matchingResult) {
          console.log(`   ⏭️  No result found yet`);
          continue;
        }
        
        // Need actual scores for ATS/Totals grading
        const awayScore = matchingResult.awayScore ?? null;
        const homeScore = matchingResult.homeScore ?? null;
        const hasScores = awayScore !== null && homeScore !== null;
        
        const isATSBet = bet.betRecommendation?.type === 'ATS' || bet.isATSPick;
        const isTotalsBet = bet.betRecommendation?.type === 'TOTAL' || bet.isTotalsPick || bet.bet?.market === 'TOTAL';
        
        let outcome;
        
        if (isTotalsBet) {
          if (!hasScores) {
            console.log(`   ⏭️  Totals bet but no scores available — skipping for live grader`);
            continue;
          }
          const totalScore = awayScore + homeScore;
          const direction = bet.bet?.pick || bet.totalsAnalysis?.direction || bet.betRecommendation?.totalDirection;
          const line = bet.bet?.total || bet.totalsAnalysis?.marketTotal || bet.betRecommendation?.totalLine;
          if (direction === 'OVER') {
            outcome = totalScore > line ? 'WIN' : totalScore === line ? 'PUSH' : 'LOSS';
          } else {
            outcome = totalScore < line ? 'WIN' : totalScore === line ? 'PUSH' : 'LOSS';
          }
          console.log(`   📐 TOTAL: ${direction} ${line}, actual ${totalScore} → ${outcome}`);
        } else if (isATSBet) {
          if (!hasScores) {
            console.log(`   ⏭️  ATS bet but no scores available — skipping for live grader`);
            continue;
          }
          const spread = bet.betRecommendation?.atsSpread || bet.spreadAnalysis?.spread || bet.bet?.spread;
          const betTeamNorm = normalizeTeam(bet.bet?.team || '');
          const awayNorm = normalizeTeam(bet.game?.awayTeam || '');
          const isAway = betTeamNorm === awayNorm;
          const pickedScore = isAway ? awayScore : homeScore;
          const oppScore = isAway ? homeScore : awayScore;
          const margin = pickedScore - oppScore;
          const adjusted = margin + spread;
          outcome = adjusted > 0 ? 'WIN' : adjusted === 0 ? 'PUSH' : 'LOSS';
          console.log(`   📐 ATS: margin ${margin}, spread ${spread}, adjusted ${adjusted} → ${outcome}`);
        } else {
          const betTeam = bet.bet?.team || '';
          const normalizedBetTeam = normalizeTeam(betTeam);
          const normalizedWinner = normalizeTeam(matchingResult.winnerTeam);
          outcome = normalizedBetTeam === normalizedWinner ? 'WIN' : 'LOSS';
        }
        
        const units = bet.bet?.units || bet.prediction?.unitSize || 1.0;
        const odds = (isATSBet || isTotalsBet) ? -110 : (bet.bet?.odds || -110);
        
        let profit;
        if (outcome === 'WIN') {
          const decimal = odds > 0 ? (odds / 100) : (100 / Math.abs(odds));
          profit = units * decimal;
        } else if (outcome === 'PUSH') {
          profit = 0;
        } else {
          profit = -units;
        }
        
        await updateDoc(doc(db, 'basketball_bets', betId), {
          'result.winner': matchingResult.winner,
          'result.winnerTeam': matchingResult.winnerTeam,
          'result.loserTeam': matchingResult.loserTeam,
          'result.awayScore': awayScore,
          'result.homeScore': homeScore,
          'result.totalScore': hasScores ? awayScore + homeScore : null,
          'result.outcome': outcome,
          'result.profit': profit,
          'result.units': units,
          'result.fetched': true,
          'result.fetchedAt': Date.now(),
          'result.source': 'OddsTrader',
          'status': 'COMPLETED'
        });
        
        graded++;
        const emoji = outcome === 'WIN' ? '✅' : '❌';
        const profitStr = profit > 0 ? `+${profit.toFixed(2)}u` : `${profit.toFixed(2)}u`;
        console.log(`   ${emoji} ${outcome}: ${betId} → ${profitStr}`);
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

