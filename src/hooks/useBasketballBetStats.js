/**
 * Hook to fetch and calculate basketball bet statistics
 * Queries Firebase for graded basketball bets and computes performance metrics
 */

import { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

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
        const wins = gradedBets.filter(bet => bet.result.outcome === 'WIN').length;
        const losses = gradedBets.filter(bet => bet.result.outcome === 'LOSS').length;
        const pending = bets.filter(bet => !bet.result?.outcome || bet.status === 'PENDING').length;
        
        // Calculate units won/lost
        const unitsWon = gradedBets.reduce((sum, bet) => {
          return sum + (bet.result.profit || 0);
        }, 0);

        // Calculate ROI (return on investment)
        // ROI = (total profit / total risked) * 100
        // Assuming 1 unit risked per bet
        const totalRisked = gradedBets.length;
        const roi = totalRisked > 0 ? (unitsWon / totalRisked) * 100 : 0;

        const winRate = gradedBets.length > 0 ? (wins / gradedBets.length) * 100 : 0;

        setStats({
          totalBets: bets.length,
          gradedBets: gradedBets.length,
          wins,
          losses,
          pending,
          winRate,
          unitsWon,
          roi,
          loading: false,
        });

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

  return { stats, loading };
}

