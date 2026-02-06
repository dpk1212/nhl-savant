import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Combined NHL + CBB Performance Stats Hook
 * 
 * Pulls real-time data from Firebase:
 * - NHL: `bets` collection
 * - CBB: `basketball_bets` collection
 * 
 * Combines them for unified performance metrics
 */
export function useCombinedStats() {
  const [stats, setStats] = useState({
    totalBets: 0,
    wins: 0,
    losses: 0,
    pushes: 0,
    profit: 0,
    roi: 0,
    winRate: 0,
    nhl: { bets: 0, profit: 0, roi: 0, winRate: 0 },
    cbb: { bets: 0, profit: 0, roi: 0, winRate: 0 },
    last7Days: { profit: 0, roi: 0, bets: 0 },
    streak: 'N/A'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let nhlBets = [];
    let cbbBets = [];
    let unsubscribeNHL = null;
    let unsubscribeCBB = null;

    const calculateCombinedStats = () => {
      // Combine all bets
      const allBets = [...nhlBets, ...cbbBets];
      
      // Filter for graded bets only
      const gradedBets = allBets.filter(bet => bet.result?.outcome);
      
      if (gradedBets.length === 0) {
        setLoading(false);
        return;
      }

      // Calculate overall stats
      const wins = gradedBets.filter(bet => bet.result.outcome === 'WIN').length;
      const losses = gradedBets.filter(bet => bet.result.outcome === 'LOSS').length;
      const pushes = gradedBets.filter(bet => bet.result.outcome === 'PUSH').length;
      
      // Calculate total risked and profit
      const totalRisked = gradedBets.reduce((sum, bet) => {
        const units = bet.result?.unitsRisked || 
                     bet.prediction?.dynamicUnits || 
                     bet.prediction?.unitSize || 
                     1.0;
        return sum + units;
      }, 0);
      
      const totalProfit = gradedBets.reduce((sum, bet) => 
        sum + (bet.result?.profit || 0), 0
      );
      
      const roi = totalRisked > 0 ? (totalProfit / totalRisked) * 100 : 0;
      const winRate = gradedBets.length > 0 ? (wins / gradedBets.length) * 100 : 0;

      // Calculate NHL stats (MATCH PerformanceDashboard.jsx calculation)
      // NHL Performance Dashboard shows **ML ROI** for B+ or higher quality bets
      // NHL uses BANKROLL-BASED ROI: (profit * 10 / 500) * 100
      const STARTING_BANKROLL = 500;
      
      // FILTER FOR MONEYLINE BETS + B+ OR HIGHER QUALITY (like the dashboard!)
      const qualityGrades = ['A+', 'A', 'B+'];
      const nhlGradedBets = nhlBets.filter(bet => 
        bet.result?.outcome && 
        (bet.bet?.market === 'MONEYLINE' || bet.bet?.market === 'ML') &&
        (qualityGrades.includes(bet.prediction?.rating) || qualityGrades.includes(bet.prediction?.grade) || qualityGrades.includes(bet.prediction?.qualityGrade))
      );
      
      const nhlWins = nhlGradedBets.filter(bet => bet.result.outcome === 'WIN').length;
      const nhlProfit = nhlGradedBets.reduce((sum, bet) => 
        sum + (bet.result?.profit || 0), 0
      );
      // NHL ROI = (profit in units * $10 / $500 starting bankroll) * 100
      const nhlFlatProfit = nhlProfit * 10;
      const nhlROI = nhlGradedBets.length > 0 ? (nhlFlatProfit / STARTING_BANKROLL) * 100 : 0;
      const nhlWinRate = nhlGradedBets.length > 0 ? (nhlWins / nhlGradedBets.length) * 100 : 0;

      // Calculate CBB stats - PRIME PICKS ONLY (V2 model)
      // Prime = EV bets with spread confirmation (spreadBoost > 0)
      // CBB uses UNITS-BASED ROI: (profit / totalRisked) * 100
      const cbbGradedBets = cbbBets.filter(bet => 
        bet.result?.outcome && 
        bet.prediction?.spreadBoost > 0  // Prime picks only
      );
      const cbbWins = cbbGradedBets.filter(bet => bet.result.outcome === 'WIN').length;
      const cbbRisked = cbbGradedBets.reduce((sum, bet) => {
        const units = bet.result?.unitsRisked || 
                     bet.result?.units ||
                     bet.prediction?.dynamicUnits || 
                     bet.prediction?.unitSize || 
                     1.0;
        return sum + units;
      }, 0);
      const cbbProfit = cbbGradedBets.reduce((sum, bet) => 
        sum + (bet.result?.profit || 0), 0
      );
      // CBB ROI = (profit / units risked) * 100
      const cbbROI = cbbRisked > 0 ? (cbbProfit / cbbRisked) * 100 : 0;
      const cbbWinRate = cbbGradedBets.length > 0 ? (cbbWins / cbbGradedBets.length) * 100 : 0;

      // Calculate streak
      const sortedBets = [...gradedBets].sort((a, b) => {
        const dateA = new Date(a.date || a.game?.date);
        const dateB = new Date(b.date || b.game?.date);
        return dateB - dateA;
      });
      
      let currentStreak = 0;
      let streakType = null;
      for (const bet of sortedBets) {
        if (!bet.result?.outcome) continue;
        if (streakType === null) {
          streakType = bet.result.outcome;
          currentStreak = 1;
        } else if (bet.result.outcome === streakType) {
          currentStreak++;
        } else {
          break;
        }
      }
      const streak = streakType ? `${streakType.charAt(0)}${currentStreak}` : 'N/A';

      // Last 7 days stats
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const last7DaysBets = gradedBets.filter(bet => {
        const betDate = new Date(bet.date || bet.game?.date);
        return betDate >= sevenDaysAgo;
      });
      
      const last7DaysProfit = last7DaysBets.reduce((sum, bet) => 
        sum + (bet.result?.profit || 0), 0
      );
      const last7DaysRisked = last7DaysBets.reduce((sum, bet) => {
        const units = bet.result?.unitsRisked || 
                     bet.prediction?.dynamicUnits || 
                     bet.prediction?.unitSize || 
                     1.0;
        return sum + units;
      }, 0);
      const last7DaysROI = last7DaysRisked > 0 ? (last7DaysProfit / last7DaysRisked) * 100 : 0;

      setStats({
        totalBets: gradedBets.length,
        wins,
        losses,
        pushes,
        profit: totalProfit,
        roi,
        winRate,
        nhl: {
          bets: nhlGradedBets.length,
          profit: nhlProfit,
          roi: nhlROI,
          winRate: nhlWinRate
        },
        cbb: {
          bets: cbbGradedBets.length,
          profit: cbbProfit,
          roi: cbbROI,
          winRate: cbbWinRate
        },
        last7Days: {
          profit: last7DaysProfit,
          roi: last7DaysROI,
          bets: last7DaysBets.length
        },
        streak
      });
      
      setLoading(false);
      
      console.log(`📊 Combined Stats Updated:`, {
        total: `${gradedBets.length} bets, +${totalProfit.toFixed(1)}u, ${roi.toFixed(1)}% ROI`,
        nhl: `${nhlGradedBets.length} bets, +${nhlProfit.toFixed(1)}u, ${nhlROI.toFixed(1)}% ROI`,
        cbb_prime: `${cbbGradedBets.length} Prime picks, +${cbbProfit.toFixed(1)}u, ${cbbROI.toFixed(1)}% ROI`
      });
    };

    // Subscribe to NHL bets
    const nhlQuery = query(collection(db, 'bets'));
    unsubscribeNHL = onSnapshot(
      nhlQuery,
      (snapshot) => {
        nhlBets = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        calculateCombinedStats();
      },
      (error) => {
        console.error("Error fetching NHL bets:", error);
        setLoading(false);
      }
    );

    // Subscribe to CBB bets
    const cbbQuery = query(collection(db, 'basketball_bets'));
    unsubscribeCBB = onSnapshot(
      cbbQuery,
      (snapshot) => {
        cbbBets = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        calculateCombinedStats();
      },
      (error) => {
        console.error("Error fetching CBB bets:", error);
        setLoading(false);
      }
    );

    return () => {
      if (unsubscribeNHL) unsubscribeNHL();
      if (unsubscribeCBB) unsubscribeCBB();
    };
  }, []);

  return { stats, loading };
}

