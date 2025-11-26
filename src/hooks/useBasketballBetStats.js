/**
 * Hook to fetch and calculate basketball bet statistics
 * Queries Firebase for graded basketball bets and computes performance metrics
 */

import { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getUnitSize } from '../utils/staggeredUnits';

export function useBasketballBetStats() {
  const [stats, setStats] = useState({
    totalBets: 0,
    wins: 0,
    losses: 0,
    pending: 0,
    winRate: 0,
    unitsWon: 0,
    roi: 0,
    loading: true,
  });
  const [dailyStats, setDailyStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🏀 Setting up basketball bet stats listener...');

    // Listen to basketball_bets collection in real-time
    const betsQuery = query(collection(db, 'basketball_bets'));
    
    const unsubscribe = onSnapshot(
      betsQuery,
      (snapshot) => {
        const bets = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log(`📊 Loaded ${bets.length} basketball bets from Firebase`);

        // Calculate stats
        const gradedBets = bets.filter(bet => bet.result?.outcome);
        
        // Separate actual bets (C+ and higher) from tracked picks (D/F)
        const actualBets = gradedBets.filter(bet => {
          const grade = bet.prediction?.grade || 'B';
          return getUnitSize(grade) > 0; // Only count bets with actual units
        });
        
        const wins = actualBets.filter(bet => bet.result.outcome === 'WIN').length;
        const losses = actualBets.filter(bet => bet.result.outcome === 'LOSS').length;
        const pending = bets.filter(bet => !bet.result?.outcome || bet.status === 'PENDING').length;
        
        // Calculate units won/lost (only from actual bets, not tracked picks)
        const unitsWon = actualBets.reduce((sum, bet) => {
          return sum + (bet.result.profit || 0);
        }, 0);

        // Calculate ROI (return on investment)
        // ROI = (total profit / total risked) * 100
        // Use ACTUAL units risked based on grade (staggered betting)
        const totalRisked = actualBets.reduce((sum, bet) => {
          const grade = bet.prediction?.grade || 'B';
          const units = getUnitSize(grade);
          return sum + units;
        }, 0);
        const roi = totalRisked > 0 ? (unitsWon / totalRisked) * 100 : 0;

        const winRate = actualBets.length > 0 ? (wins / actualBets.length) * 100 : 0;

        // Calculate daily stats for calendar
        const dailyStatsMap = {};
        gradedBets.forEach(bet => {
          const date = bet.date || bet.id.split('_')[0]; // Extract date from bet
          if (!dailyStatsMap[date]) {
            dailyStatsMap[date] = {
              wins: 0,
              losses: 0,
              unitsWon: 0,
              bets: []
            };
          }
          
          if (bet.result.outcome === 'WIN') {
            dailyStatsMap[date].wins++;
          } else if (bet.result.outcome === 'LOSS') {
            dailyStatsMap[date].losses++;
          }
          
          dailyStatsMap[date].unitsWon += (bet.result.profit || 0);
          dailyStatsMap[date].bets.push(bet);
        });

        setStats({
          totalBets: bets.length,
          gradedBets: actualBets.length, // Only show actual bets (with units) in stats
          trackedPicks: gradedBets.length - actualBets.length, // D/F grades tracked for accuracy
          wins,
          losses,
          pending,
          winRate,
          unitsWon,
          totalRisked,
          roi,
          loading: false,
        });
        
        setDailyStats(dailyStatsMap);
        setLoading(false);

        console.log(`✅ Basketball stats: ${wins}-${losses} (${winRate.toFixed(1)}%), ${unitsWon > 0 ? '+' : ''}${unitsWon.toFixed(2)}u, ROI: ${roi.toFixed(1)}%`);
      },
      (error) => {
        console.error('❌ Error fetching basketball bet stats:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { stats, loading, dailyStats };
}


