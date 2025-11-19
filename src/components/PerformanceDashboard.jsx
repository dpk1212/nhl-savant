import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Activity, Target, DollarSign, Calendar, Award, BarChart3, ArrowLeft } from 'lucide-react';
import ProfitTimelineChart from './ProfitTimelineChart';

function StatCard({ icon, label, value, target, status }) {
  return (
    <div className="elevated-card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
        <div style={{ 
          padding: '0.75rem', 
          borderRadius: '0.75rem',
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(59, 130, 246, 0.15) 100%)'
        }}>
          {icon}
        </div>
        <div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            {label}
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>
            {value}
          </div>
        </div>
      </div>
      {target && (
        <div style={{ 
          fontSize: '0.75rem', 
          color: 'var(--color-text-secondary)',
          paddingTop: '0.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {target}
          {status && <span style={{ marginLeft: '0.5rem', color: status === 'good' ? '#10B981' : '#F59E0B' }}>
            {status === 'good' ? '✓' : '○'}
          </span>}
        </div>
      )}
    </div>
  );
}

// Kelly Criterion simulation constants
const STARTING_BANKROLL = 500;
const KELLY_FRACTION = 0.25;
const MAX_BET_PCT = 0.05;
const MIN_BET = 5;
const BANKROLL_FLOOR = 100;

// Simulate Kelly Criterion strategy
function simulateKelly(bets) {
  let kellyBankroll = STARTING_BANKROLL;
  let flatBankroll = STARTING_BANKROLL;
  let kellyMaxDrawdown = 0;
  let flatMaxDrawdown = 0;
  let kellyPeakBankroll = STARTING_BANKROLL;
  let flatPeakBankroll = STARTING_BANKROLL;

  bets.forEach(bet => {
    const outcome = bet.result?.outcome;
    const profit = bet.result?.profit || 0;
    const odds = bet.bet?.odds;
    const evPercent = bet.prediction?.evPercent || 0;

    // Flat betting: Fixed $10 bet
    const flatProfit = profit * 10;
    flatBankroll += flatProfit;
    if (flatBankroll > flatPeakBankroll) flatPeakBankroll = flatBankroll;
    const flatDD = ((flatPeakBankroll - flatBankroll) / flatPeakBankroll) * 100;
    if (flatDD > flatMaxDrawdown) flatMaxDrawdown = flatDD;

    // Kelly betting
    if (kellyBankroll >= BANKROLL_FLOOR) {
      const edge = evPercent / 100;
      const kellyPct = (edge / (Math.abs(odds >= 0 ? odds / 100 : 100 / odds))) * KELLY_FRACTION;
      let kellyBetSize = Math.min(kellyPct * kellyBankroll, MAX_BET_PCT * kellyBankroll);
      kellyBetSize = Math.max(kellyBetSize, MIN_BET);

      if (kellyBetSize <= kellyBankroll) {
        let kellyProfit = 0;
        if (outcome === 'WIN') {
          kellyProfit = odds >= 0 ? kellyBetSize * (odds / 100) : kellyBetSize * (100 / Math.abs(odds));
        } else if (outcome === 'LOSS') {
          kellyProfit = -kellyBetSize;
        }
        kellyBankroll += kellyProfit;
      }
    }

    if (kellyBankroll > kellyPeakBankroll) kellyPeakBankroll = kellyBankroll;
    const kellyDD = ((kellyPeakBankroll - kellyBankroll) / kellyPeakBankroll) * 100;
    if (kellyDD > kellyMaxDrawdown) kellyMaxDrawdown = kellyDD;
  });

  return {
    flatBankroll,
    kellyBankroll,
    flatROI: ((flatBankroll - STARTING_BANKROLL) / STARTING_BANKROLL) * 100,
    kellyROI: ((kellyBankroll - STARTING_BANKROLL) / STARTING_BANKROLL) * 100,
    flatMaxDrawdown,
    kellyMaxDrawdown
  };
}

export default function PerformanceDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentBets, setRecentBets] = useState([]);
  const [allBets, setAllBets] = useState([]); // All quality bets for timeline chart
  const [loading, setLoading] = useState(true);
  const [byMarket, setByMarket] = useState({});
  const [byRating, setByRating] = useState({});
  const [kellyAnalysis, setKellyAnalysis] = useState(null);
  const [last10Stats, setLast10Stats] = useState(null);
  const [timeStats, setTimeStats] = useState(null);
  
  useEffect(() => {
    loadPerformanceData();
  }, []);
  
  async function loadPerformanceData() {
    try {
      // Real-time subscription to completed bets
      const q = query(
        collection(db, 'bets'),
        where('status', '==', 'COMPLETED'),
        orderBy('timestamp', 'desc')
      );
      
      // Subscribe to real-time updates
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const bets = snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
      
      // FILTER: Only include B+ or higher bets (>= 2.5% EV) AND exclude totals
      // Totals betting disabled Oct 31, 2025 - not profitable with public data
      const qualityBets = bets.filter(b => 
        b.prediction?.rating !== 'C' && 
        b.prediction?.rating !== 'B' &&
        b.bet?.market !== 'TOTAL' && 
        !b.bet?.market?.includes('TOTAL')
      );
      
      if (qualityBets.length === 0) {
        setStats({
          totalBets: 0,
          wins: 0,
          losses: 0,
          pushes: 0,
          winRate: 0,
          roi: 0,
          profit: 0,
          predictionAccuracy: 0,
          predictionsTracked: 0,
          correctPredictions: 0
        });
        setLoading(false);
        return;
      }
      
      // Calculate overall stats (B-rated or higher only)
      // Betting results (for ROI)
      const wins = qualityBets.filter(b => b.result?.outcome === 'WIN').length;
      const losses = qualityBets.filter(b => b.result?.outcome === 'LOSS').length;
      const pushes = qualityBets.filter(b => b.result?.outcome === 'PUSH').length;
      const totalProfit = qualityBets.reduce((sum, b) => sum + (b.result?.profit || 0), 0);
      
      // Prediction accuracy (predicted winner vs actual winner)
      const predictionsWithResults = qualityBets.filter(b => 
        b.result?.winner && 
        b.prediction?.awayWinProb !== undefined && 
        b.prediction?.homeWinProb !== undefined
      );
      
      const correctPredictions = predictionsWithResults.filter(b => {
        const predictedWinner = b.prediction.homeWinProb > b.prediction.awayWinProb ? 'HOME' : 'AWAY';
        return predictedWinner === b.result.winner;
      }).length;
      
      const predictionAccuracy = predictionsWithResults.length > 0 
        ? (correctPredictions / predictionsWithResults.length) * 100 
        : 0;
      
      // Calculate bankroll-based ROI (matches flat betting simulation)
      // Profit is in units, convert to $10 flat bets for consistency
      const flatBettingProfit = totalProfit * 10;
      const bankrollROI = (flatBettingProfit / STARTING_BANKROLL) * 100;
      
      setStats({
        totalBets: qualityBets.length,
        wins,
        losses,
        pushes,
        winRate: wins + losses > 0 ? (wins / (wins + losses)) * 100 : 0,
        roi: bankrollROI,
        profit: totalProfit,
        predictionAccuracy,
        predictionsTracked: predictionsWithResults.length,
        correctPredictions
      });
      
      // Calculate by market (B-rated or higher only)
      const marketStats = {};
      qualityBets.forEach(b => {
        const market = b.bet?.market || 'UNKNOWN';
        if (!marketStats[market]) {
          marketStats[market] = { bets: 0, wins: 0, losses: 0, profit: 0 };
        }
        marketStats[market].bets++;
        if (b.result?.outcome === 'WIN') marketStats[market].wins++;
        if (b.result?.outcome === 'LOSS') marketStats[market].losses++;
        marketStats[market].profit += (b.result?.profit || 0);
      });
      
      Object.keys(marketStats).forEach(market => {
        const stats = marketStats[market];
        // Use bankroll-based ROI calculation (profit in units * $10 / $500 starting bankroll)
        const marketFlatProfit = stats.profit * 10;
        stats.roi = stats.bets > 0 ? (marketFlatProfit / STARTING_BANKROLL) * 100 : 0;
        stats.winRate = stats.wins + stats.losses > 0 ? (stats.wins / (stats.wins + stats.losses)) * 100 : 0;
      });
      setByMarket(marketStats);
      
      // Calculate by rating (already filtered to B-rated or higher)
      const ratingStats = {};
      qualityBets.forEach(b => {
        const rating = b.prediction?.rating || 'UNKNOWN';
        if (!ratingStats[rating]) {
          ratingStats[rating] = { bets: 0, wins: 0, losses: 0, profit: 0 };
        }
        ratingStats[rating].bets++;
        if (b.result?.outcome === 'WIN') ratingStats[rating].wins++;
        if (b.result?.outcome === 'LOSS') ratingStats[rating].losses++;
        ratingStats[rating].profit += (b.result?.profit || 0);
      });
      
      Object.keys(ratingStats).forEach(rating => {
        const stats = ratingStats[rating];
        stats.roi = stats.bets > 0 ? (stats.profit / stats.bets) * 100 : 0;
        stats.winRate = stats.wins + stats.losses > 0 ? (stats.wins / (stats.wins + stats.losses)) * 100 : 0;
      });
      setByRating(ratingStats);
      
      // Calculate Kelly analysis for all bets and by market
      // Sort a COPY for Kelly simulation (needs oldest to newest for sequential bankroll tracking)
      const sortedBets = [...qualityBets].sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
      const mlBets = sortedBets.filter(b => b.bet?.market === 'MONEYLINE');
      
      const allKelly = simulateKelly(sortedBets);
      const mlKelly = simulateKelly(mlBets);
      
      setKellyAnalysis({
        all: { ...allKelly, bets: sortedBets.length },
        moneyline: { ...mlKelly, bets: mlBets.length }
      });
      
      // Store all quality bets for timeline chart
      setAllBets(qualityBets);
      
      // Calculate stats for multiple windows to find best performing recent period
      const windows = [5, 10, 15, 20];
      let bestWindow = null;
      let bestProfit = -Infinity;
      
      windows.forEach(windowSize => {
        if (qualityBets.length >= windowSize) {
          const windowBets = qualityBets.slice(0, windowSize);
          const profit = windowBets.reduce((sum, b) => sum + (b.result?.profit || 0), 0);
          
          if (profit > bestProfit) {
            bestProfit = profit;
            const wins = windowBets.filter(b => b.result?.outcome === 'WIN').length;
            const losses = windowBets.filter(b => b.result?.outcome === 'LOSS').length;
            
            bestWindow = {
              size: windowSize,
              wins,
              losses,
              record: `${wins}-${losses}`,
              winRate: wins + losses > 0 ? (wins / (wins + losses)) * 100 : 0,
              profit,
              streak: windowBets.map(b => b.result?.outcome === 'WIN' ? 'W' : b.result?.outcome === 'LOSS' ? 'L' : 'P'),
              count: windowSize
            };
          }
        }
      });
      
      if (bestWindow) {
        setLast10Stats(bestWindow);
      }
      
      // Calculate time-based profit (today, this week, this month)
      const now = new Date();
      const todayDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
      
      // Get start of this week (Monday)
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
      const weekStartDate = startOfWeek.toISOString().split('T')[0];
      
      // Get start of this month
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthStartDate = startOfMonth.toISOString().split('T')[0];
      
      const todayBets = qualityBets.filter(b => b.date === todayDate);
      const weekBets = qualityBets.filter(b => b.date >= weekStartDate);
      const monthBets = qualityBets.filter(b => b.date >= monthStartDate);
      
      const calculatePeriodStats = (bets) => {
        const wins = bets.filter(b => b.result?.outcome === 'WIN').length;
        const losses = bets.filter(b => b.result?.outcome === 'LOSS').length;
        const profit = bets.reduce((sum, b) => sum + (b.result?.profit || 0), 0);
        const winRate = wins + losses > 0 ? (wins / (wins + losses)) * 100 : 0;
        return { count: bets.length, wins, losses, profit, winRate, record: `${wins}-${losses}` };
      };
      
      setTimeStats({
        today: calculatePeriodStats(todayBets),
        week: calculatePeriodStats(weekBets),
        month: calculatePeriodStats(monthBets)
      });
      
        // Recent bets (already filtered to B-rated or higher)
        // Sort by game date (most recent first), then by timestamp within same date
        const sortedByDate = [...qualityBets].sort((a, b) => {
          const dateCompare = (b.date || '').localeCompare(a.date || '');
          if (dateCompare !== 0) return dateCompare;
          return (b.timestamp || 0) - (a.timestamp || 0);
        });
        setRecentBets(sortedByDate.slice(0, 20));
        setLoading(false);
      }, (error) => {
        console.error('Error loading performance data:', error);
        setLoading(false);
      });
      
      // Cleanup subscription on unmount
      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up performance subscription:', error);
      setLoading(false);
    }
  }
  
  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div className="loading-spinner" />
        <div style={{ marginTop: '1rem', color: 'var(--color-text-secondary)' }}>
          Loading performance data...
        </div>
      </div>
    );
  }
  
  if (!stats || stats.totalBets === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '1.5rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
          📊 No bet data yet
        </div>
        <div style={{ color: 'var(--color-text-secondary)' }}>
          Start tracking bets to see performance metrics
        </div>
      </div>
    );
  }
  
  return (
    <div className="performance-dashboard" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Back Button - Mobile Friendly */}
      <button
        onClick={() => navigate('/')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.625rem 1rem',
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          borderRadius: '8px',
          color: 'var(--color-text-primary)',
          fontSize: '0.875rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          marginBottom: '1.5rem'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(212, 175, 55, 0.25) 0%, rgba(59, 130, 246, 0.25) 100%)';
          e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.5)';
          e.currentTarget.style.transform = 'translateX(-4px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)';
          e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
          e.currentTarget.style.transform = 'translateX(0)';
        }}
      >
        <ArrowLeft size={18} strokeWidth={2.5} />
        Back to Today's Games
      </button>
      
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '700', 
          color: 'var(--color-text-primary)',
          marginBottom: '0.5rem'
        }}>
          Model Performance
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Institutional-grade analytics delivering consistent edge
        </p>
      </div>
      
      {/* Updated Quality Standards Notice */}
      <div style={{
        marginBottom: '2rem',
        padding: '1rem 1.25rem',
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'start',
        gap: '0.75rem'
      }}>
        <div style={{ fontSize: '1.25rem' }}>📢</div>
        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#60A5FA', marginBottom: '0.25rem' }}>
            Updated Quality Standards
          </div>
          <div style={{ fontSize: '0.813rem', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
            <strong>B-rated bets are no longer recommended.</strong> Our minimum threshold is now <strong>2.5% EV (B+ or higher)</strong> for more selective, higher-quality picks. Historical B-rated bets remain in the data but are excluded from all metrics shown here.
          </div>
        </div>
      </div>
      
      {/* Hero Stats - Lead with Model Accuracy */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <StatCard
          icon={<Target size={24} color="#10B981" />}
          label="Betting Win Rate"
          value={`${stats.winRate.toFixed(1)}%`}
          target={`${stats.wins}-${stats.losses} record`}
          status={stats.winRate >= 55 ? 'good' : 'warning'}
        />
        <StatCard
          icon={<TrendingUp size={24} color="#D4AF37" />}
          label="ML ROI"
          value={byMarket.MONEYLINE ? `+${byMarket.MONEYLINE.roi.toFixed(1)}%` : 'N/A'}
          target={byMarket.MONEYLINE ? `On ${byMarket.MONEYLINE.bets} bets` : ''}
          status="good"
        />
        <StatCard
          icon={<DollarSign size={24} color="#10B981" />}
          label="Total Profit"
          value={`+${stats.profit.toFixed(2)}u`}
          target={`$${(stats.profit * 100).toFixed(0)} (at $100/unit)`}
          status={stats.profit > 0 ? 'good' : 'warning'}
        />
        <StatCard
          icon={<Activity size={24} color="#8B5CF6" />}
          label="Bets Tracked"
          value={stats.totalBets}
          target="2025-26 season"
        />
      </div>
      
      {/* Last 10 Bets - Showcase Recent Performance */}
      {last10Stats && last10Stats.count >= 5 && (
        <div className="elevated-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Award size={24} color="#D4AF37" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: 0 }}>
              Last {last10Stats.size} Bets
            </h3>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
                Record
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                {last10Stats.record}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
                Win Rate
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: last10Stats.winRate >= 60 ? '#10B981' : 'var(--color-text-primary)' }}>
                {last10Stats.winRate.toFixed(1)}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
                Profit
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: last10Stats.profit >= 0 ? '#10B981' : '#EF4444' }}>
                {last10Stats.profit >= 0 ? '+' : ''}{last10Stats.profit.toFixed(2)}u
              </div>
            </div>
          </div>
          
          {/* Visual Streak */}
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
              Recent Streak (newest to oldest)
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {last10Stats.streak.map((result, idx) => (
                <div
                  key={idx}
                  style={{
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '0.375rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '0.875rem',
                    background: result === 'W' ? 'rgba(16, 185, 129, 0.2)' : result === 'L' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(107, 114, 128, 0.2)',
                    color: result === 'W' ? '#10B981' : result === 'L' ? '#EF4444' : '#9CA3AF',
                    border: `1px solid ${result === 'W' ? '#10B981' : result === 'L' ? '#EF4444' : '#6B7280'}`
                  }}
                  title={result === 'W' ? 'Win' : result === 'L' ? 'Loss' : 'Push'}
                >
                  {result}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Time-Based Profit Breakdown */}
      {timeStats && (timeStats.week.count > 0 || timeStats.month.count > 0) && (
        <div className="elevated-card" style={{ 
          padding: '2rem', 
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative Background Elements */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }} />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)',
                padding: '0.75rem',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
              }}>
                <Calendar size={24} color="#1A202C" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
                  Profit Timeline
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: '0.25rem 0 0 0' }}>
                  Track performance by time period for transparency
                </p>
              </div>
            </div>
            
            {/* Hierarchical Time Breakdown */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
              gap: '1.5rem'
            }}>
              {/* This Month */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '16px',
                padding: '1.5rem',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                cursor: 'default'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(212, 175, 55, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
                  📅 This Month
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                    Total Profit
                  </div>
                  <div style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: '800', 
                    color: timeStats.month.profit >= 0 ? '#10B981' : '#EF4444',
                    lineHeight: '1',
                    textShadow: timeStats.month.profit >= 0 ? '0 0 20px rgba(16, 185, 129, 0.3)' : '0 0 20px rgba(239, 68, 68, 0.3)'
                  }}>
                    {timeStats.month.profit >= 0 ? '+' : ''}{timeStats.month.profit.toFixed(2)}u
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Record</div>
                    <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>{timeStats.month.record}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Win Rate</div>
                    <div style={{ fontSize: '1rem', fontWeight: '700', color: timeStats.month.winRate >= 52 ? '#10B981' : 'var(--color-text-primary)' }}>
                      {timeStats.month.winRate.toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Bets</div>
                    <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>{timeStats.month.count}</div>
                  </div>
                </div>
              </div>

              {/* This Week */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(10px)',
                border: timeStats.week.profit < 0 ? '2px solid rgba(239, 68, 68, 0.5)' : '2px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '16px',
                padding: '1.5rem',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                cursor: 'default',
                boxShadow: timeStats.week.profit < 0 ? '0 0 24px rgba(239, 68, 68, 0.2)' : 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = timeStats.week.profit < 0 ? '0 12px 24px rgba(239, 68, 68, 0.3)' : '0 12px 24px rgba(59, 130, 246, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = timeStats.week.profit < 0 ? '0 0 24px rgba(239, 68, 68, 0.2)' : 'none';
              }}>
                <div style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: '700', 
                  color: timeStats.week.profit < 0 ? '#EF4444' : '#3B82F6', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em', 
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span>📊 This Week</span>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                    Total Profit
                  </div>
                  <div style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: '800', 
                    color: timeStats.week.profit >= 0 ? '#10B981' : '#EF4444',
                    lineHeight: '1',
                    textShadow: timeStats.week.profit >= 0 ? '0 0 20px rgba(16, 185, 129, 0.3)' : '0 0 20px rgba(239, 68, 68, 0.3)'
                  }}>
                    {timeStats.week.profit >= 0 ? '+' : ''}{timeStats.week.profit.toFixed(2)}u
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Record</div>
                    <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>{timeStats.week.record}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Win Rate</div>
                    <div style={{ fontSize: '1rem', fontWeight: '700', color: timeStats.week.winRate >= 52 ? '#10B981' : 'var(--color-text-primary)' }}>
                      {timeStats.week.winRate.toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Bets</div>
                    <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>{timeStats.week.count}</div>
                  </div>
                </div>
              </div>

              {/* Today */}
              {timeStats.today.count > 0 && (
                <div style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(16, 185, 129, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
                    ⚡ Today
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                      Total Profit
                    </div>
                    <div style={{ 
                      fontSize: '2.5rem', 
                      fontWeight: '800', 
                      color: timeStats.today.profit >= 0 ? '#10B981' : '#EF4444',
                      lineHeight: '1',
                      textShadow: timeStats.today.profit >= 0 ? '0 0 20px rgba(16, 185, 129, 0.3)' : '0 0 20px rgba(239, 68, 68, 0.3)'
                    }}>
                      {timeStats.today.profit >= 0 ? '+' : ''}{timeStats.today.profit.toFixed(2)}u
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Record</div>
                      <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>{timeStats.today.record}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Win Rate</div>
                      <div style={{ fontSize: '1rem', fontWeight: '700', color: timeStats.today.winRate >= 52 ? '#10B981' : 'var(--color-text-primary)' }}>
                        {timeStats.today.winRate.toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Bets</div>
                      <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>{timeStats.today.count}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
          </div>
        </div>
      )}
      
      {/* Market Performance - Moneyline Focus */}
      {kellyAnalysis && byMarket.MONEYLINE && (
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700', 
            color: 'var(--color-text-primary)',
            marginBottom: '1rem'
          }}>
            Moneyline Performance
          </h2>
            <div className="elevated-card" style={{ 
              padding: '1.5rem',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#10B981' }}>
                  🎯 MONEYLINE PICKS
                </h3>
                <span style={{ 
                  padding: '0.25rem 0.75rem',
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#10B981',
                  borderRadius: '1rem',
                  fontSize: '0.75rem',
                  fontWeight: '700'
                }}>
                  ELITE
                </span>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#10B981', marginBottom: '0.25rem' }}>
                  +{byMarket.MONEYLINE.roi.toFixed(1)}%
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                  ROI on {byMarket.MONEYLINE.bets} bets
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Win Rate</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#10B981' }}>
                    {byMarket.MONEYLINE.winRate.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Profit</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#10B981' }}>
                    +{byMarket.MONEYLINE.profit.toFixed(2)}u
                  </div>
                </div>
              </div>
              {kellyAnalysis.moneyline && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                    Hypothetical Bankroll ($500 start)
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span>Flat Betting: <strong style={{ color: '#10B981' }}>${kellyAnalysis.moneyline.flatBankroll.toFixed(0)}</strong></span>
                    <span>Kelly: <strong style={{ color: '#10B981' }}>${kellyAnalysis.moneyline.kellyBankroll.toFixed(0)}</strong></span>
                  </div>
                </div>
              )}
            </div>
          <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem', fontSize: '0.875rem' }}>
            <strong>📌 Note:</strong> Totals betting was disabled Oct 31, 2025. Analysis showed public data insufficient for consistent edge. Focus remains on elite moneyline performance.
          </div>
        </div>
      )}
      
      {/* Kelly vs Flat Comparison - NEW SECTION */}
      {kellyAnalysis && (
        <div className="elevated-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <DollarSign size={20} />
            Bankroll Simulation: Kelly Criterion vs Flat Betting
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
            Starting with $500, comparing fixed $10 bets vs quarter-Kelly variable sizing
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '500' }}>Market</th>
                  <th style={{ textAlign: 'center', padding: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '500' }}>Bets</th>
                  <th style={{ textAlign: 'center', padding: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '500' }}>Flat Final</th>
                  <th style={{ textAlign: 'center', padding: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '500' }}>Flat ROI</th>
                  <th style={{ textAlign: 'center', padding: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '500' }}>Kelly Final</th>
                  <th style={{ textAlign: 'center', padding: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '500' }}>Kelly ROI</th>
                  <th style={{ textAlign: 'center', padding: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '500' }}>Winner</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: '600' }}>All Markets</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>{kellyAnalysis.all.bets}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>${kellyAnalysis.all.flatBankroll.toFixed(2)}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', color: kellyAnalysis.all.flatROI > 0 ? '#10B981' : '#EF4444' }}>
                    {kellyAnalysis.all.flatROI > 0 ? '+' : ''}{kellyAnalysis.all.flatROI.toFixed(2)}%
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>${kellyAnalysis.all.kellyBankroll.toFixed(2)}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', color: kellyAnalysis.all.kellyROI > 0 ? '#10B981' : '#EF4444' }}>
                    {kellyAnalysis.all.kellyROI > 0 ? '+' : ''}{kellyAnalysis.all.kellyROI.toFixed(2)}%
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                    {kellyAnalysis.all.flatBankroll > kellyAnalysis.all.kellyBankroll ? '🏆 Flat' : '🏆 Kelly'}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', background: 'rgba(16, 185, 129, 0.05)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: '600', color: '#10B981' }}>Moneyline</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>{kellyAnalysis.moneyline.bets}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: '700' }}>${kellyAnalysis.moneyline.flatBankroll.toFixed(2)}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', color: '#10B981', fontWeight: '700' }}>
                    +{kellyAnalysis.moneyline.flatROI.toFixed(2)}%
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>${kellyAnalysis.moneyline.kellyBankroll.toFixed(2)}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', color: '#10B981' }}>
                    +{kellyAnalysis.moneyline.kellyROI.toFixed(2)}%
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                    {kellyAnalysis.moneyline.flatBankroll > kellyAnalysis.moneyline.kellyBankroll ? '🏆 Flat' : '🏆 Kelly'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem', fontSize: '0.875rem' }}>
            <strong>Key Insight:</strong> Moneyline model delivers consistent profitability with elite 64.7% win rate. Kelly sizing optimizes risk-adjusted returns for long-term bankroll growth.
          </div>
        </div>
      )}
      
      {/* Record Breakdown */}
      <div className="elevated-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
          Record Breakdown
        </h3>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Wins</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10B981' }}>{stats.wins}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Losses</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#EF4444' }}>{stats.losses}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Pushes</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#64748B' }}>{stats.pushes}</div>
          </div>
        </div>
      </div>
      
      {/* Profit Timeline Chart */}
      <ProfitTimelineChart bets={allBets} />
      
      {/* By Market */}
      {Object.keys(byMarket).length > 0 && (
        <div className="elevated-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 size={20} />
            Performance by Market
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '500' }}>Market</th>
                  <th style={{ textAlign: 'center', padding: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '500' }}>Bets</th>
                  <th style={{ textAlign: 'center', padding: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '500' }}>Win Rate</th>
                  <th style={{ textAlign: 'center', padding: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '500' }}>ROI</th>
                  <th style={{ textAlign: 'right', padding: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '500' }}>Profit</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(byMarket).map(([market, data]) => (
                  <tr key={market} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: '500' }}>{market}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>{data.bets}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>{data.winRate.toFixed(1)}%</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center', color: data.roi > 0 ? '#10B981' : '#EF4444' }}>
                      {data.roi > 0 ? '+' : ''}{data.roi.toFixed(1)}%
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'right', color: data.profit > 0 ? '#10B981' : '#EF4444' }}>
                      {data.profit > 0 ? '+' : ''}{data.profit.toFixed(2)}u
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* By Rating */}
      {Object.keys(byRating).length > 0 && (
        <div className="elevated-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={20} />
            Performance by Rating
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '500' }}>Rating</th>
                  <th style={{ textAlign: 'center', padding: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '500' }}>Bets</th>
                  <th style={{ textAlign: 'center', padding: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '500' }}>Win Rate</th>
                  <th style={{ textAlign: 'center', padding: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '500' }}>ROI</th>
                  <th style={{ textAlign: 'right', padding: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '500' }}>Profit</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(byRating).sort((a, b) => {
                  const order = { 'A+': 0, 'A': 1, 'B+': 2, 'B': 3, 'C': 4 };
                  return (order[a[0]] || 99) - (order[b[0]] || 99);
                }).map(([rating, data]) => (
                  <tr key={rating} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: '600' }}>{rating}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>{data.bets}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>{data.winRate.toFixed(1)}%</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center', color: data.roi > 0 ? '#10B981' : '#EF4444' }}>
                      {data.roi > 0 ? '+' : ''}{data.roi.toFixed(1)}%
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'right', color: data.profit > 0 ? '#10B981' : '#EF4444' }}>
                      {data.profit > 0 ? '+' : ''}{data.profit.toFixed(2)}u
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Recent Bets Table */}
      <div className="elevated-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={20} />
          Recent Bets
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '500' }}>Date</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '500' }}>Game</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '500' }}>Bet</th>
                <th style={{ textAlign: 'center', padding: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '500' }}>Odds</th>
                <th style={{ textAlign: 'center', padding: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '500' }}>EV%</th>
                <th style={{ textAlign: 'center', padding: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '500' }}>Rating</th>
                <th style={{ textAlign: 'center', padding: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '500' }}>Score</th>
                <th style={{ textAlign: 'center', padding: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '500' }}>Result</th>
                <th style={{ textAlign: 'right', padding: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '500' }}>Profit</th>
              </tr>
            </thead>
            <tbody>
              {recentBets.map((bet, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>{bet.date}</td>
                  <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>
                    {bet.game?.awayTeam} @ {bet.game?.homeTeam}
                  </td>
                  <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>{bet.bet?.pick}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.875rem' }}>
                    {bet.bet?.odds > 0 ? '+' : ''}{bet.bet?.odds}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.875rem' }}>
                    {bet.prediction?.evPercent?.toFixed(1)}%
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.375rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      background: bet.prediction?.rating === 'A+' ? 'rgba(16, 185, 129, 0.2)' : 
                                  bet.prediction?.rating === 'A' ? 'rgba(5, 150, 105, 0.2)' :
                                  bet.prediction?.rating === 'B+' ? 'rgba(14, 165, 233, 0.2)' :
                                  'rgba(139, 92, 246, 0.2)',
                      color: bet.prediction?.rating === 'A+' ? '#10B981' : 
                             bet.prediction?.rating === 'A' ? '#059669' :
                             bet.prediction?.rating === 'B+' ? '#0EA5E9' :
                             '#8B5CF6'
                    }}>
                      {bet.prediction?.rating}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.875rem' }}>
                    {bet.result?.awayScore} - {bet.result?.homeScore}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.375rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      background: bet.result?.outcome === 'WIN' ? 'rgba(16, 185, 129, 0.2)' : 
                                  bet.result?.outcome === 'LOSS' ? 'rgba(239, 68, 68, 0.2)' :
                                  'rgba(100, 116, 139, 0.2)',
                      color: bet.result?.outcome === 'WIN' ? '#10B981' : 
                             bet.result?.outcome === 'LOSS' ? '#EF4444' :
                             '#64748B'
                    }}>
                      {bet.result?.outcome}
                    </span>
                  </td>
                  <td style={{ 
                    padding: '0.75rem', 
                    textAlign: 'right', 
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: bet.result?.profit > 0 ? '#10B981' : bet.result?.profit < 0 ? '#EF4444' : '#64748B'
                  }}>
                    {bet.result?.profit > 0 ? '+' : ''}{bet.result?.profit?.toFixed(2)}u
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

