/**
 * CBB Paywall Stats Hook
 * Fetches real-time performance data for paywall messaging
 * Only shows verified, graded picks
 */

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

export function useCBBPaywallStats() {
  const [stats, setStats] = useState({
    totalPicks: 0,
    winRate: 0,
    profit: 0,
    roi: 0,
    last7Days: {
      picks: 0,
      profit: 0,
      winRate: 0
    },
    topGrades: {
      aPlus: { wins: 0, total: 0, profit: 0 },
      a: { wins: 0, total: 0, profit: 0 }
    },
    loading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all completed CBB bets
        const q = query(
          collection(db, 'basketball_bets'),
          where('status', '==', 'COMPLETED')
        );
        
        const snapshot = await getDocs(q);
        const bets = snapshot.docs.map(doc => doc.data());
        
        // Filter to graded bets only
        const gradedBets = bets.filter(b => b.result?.outcome);
        
        // Overall stats
        const wins = gradedBets.filter(b => b.result.outcome === 'WIN').length;
        const losses = gradedBets.filter(b => b.result.outcome === 'LOSS').length;
        const totalProfit = gradedBets.reduce((sum, b) => sum + (b.result.profit || 0), 0);
        
        // Calculate units risked for accurate ROI
        const totalRisked = gradedBets.reduce((sum, b) => {
          const units = b.result?.units || b.prediction?.unitSize || 1.0;
          return sum + units;
        }, 0);
        
        const roi = totalRisked > 0 ? (totalProfit / totalRisked) * 100 : 0;
        const winRate = (wins + losses) > 0 ? (wins / (wins + losses)) * 100 : 0;
        
        // Last 7 days stats
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentBets = gradedBets.filter(b => {
          const betDate = new Date(b.date || b.timestamp);
          return betDate >= sevenDaysAgo;
        });
        
        const recentWins = recentBets.filter(b => b.result.outcome === 'WIN').length;
        const recentLosses = recentBets.filter(b => b.result.outcome === 'LOSS').length;
        const recentProfit = recentBets.reduce((sum, b) => sum + (b.result.profit || 0), 0);
        const recentWinRate = (recentWins + recentLosses) > 0 
          ? (recentWins / (recentWins + recentLosses)) * 100 
          : 0;
        
        // Top grades performance (A+ and A only)
        const aPlusBets = gradedBets.filter(b => b.prediction?.grade === 'A+');
        const aBets = gradedBets.filter(b => b.prediction?.grade === 'A');
        
        const aPlusWins = aPlusBets.filter(b => b.result.outcome === 'WIN').length;
        const aPlusProfit = aPlusBets.reduce((sum, b) => sum + (b.result.profit || 0), 0);
        
        const aWins = aBets.filter(b => b.result.outcome === 'WIN').length;
        const aProfit = aBets.reduce((sum, b) => sum + (b.result.profit || 0), 0);
        
        setStats({
          totalPicks: gradedBets.length,
          winRate: winRate,
          profit: totalProfit,
          roi: roi,
          last7Days: {
            picks: recentBets.length,
            profit: recentProfit,
            winRate: recentWinRate
          },
          topGrades: {
            aPlus: { 
              wins: aPlusWins, 
              total: aPlusBets.length, 
              profit: aPlusProfit 
            },
            a: { 
              wins: aWins, 
              total: aBets.length, 
              profit: aProfit 
            }
          },
          loading: false
        });
        
        console.log('📊 CBB Paywall Stats Loaded:', {
          totalPicks: gradedBets.length,
          winRate: winRate.toFixed(1) + '%',
          profit: totalProfit.toFixed(2) + 'u',
          roi: roi.toFixed(1) + '%'
        });
        
      } catch (error) {
        console.error('❌ Error loading CBB paywall stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };
    
    fetchStats();
  }, []);
  
  return stats;
}

