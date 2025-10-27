import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { TrendingUp, Activity, Target, DollarSign, Calendar, Award, BarChart3 } from 'lucide-react';

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
          Target: {target}
          {status && <span style={{ marginLeft: '0.5rem', color: status === 'good' ? '#10B981' : '#F59E0B' }}>
            {status === 'good' ? '✓' : '○'}
          </span>}
        </div>
      )}
    </div>
  );
}

export default function PerformanceDashboard() {
  const [stats, setStats] = useState(null);
  const [recentBets, setRecentBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [byMarket, setByMarket] = useState({});
  const [byRating, setByRating] = useState({});
  
  useEffect(() => {
    loadPerformanceData();
  }, []);
  
  async function loadPerformanceData() {
    try {
      // Get all completed bets
      const q = query(
        collection(db, 'bets'),
        where('status', '==', 'COMPLETED'),
        orderBy('timestamp', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const bets = snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
      
      if (bets.length === 0) {
        setStats({
          totalBets: 0,
          wins: 0,
          losses: 0,
          pushes: 0,
          winRate: 0,
          roi: 0,
          profit: 0
        });
        setLoading(false);
        return;
      }
      
      // Calculate stats
      const wins = bets.filter(b => b.result?.outcome === 'WIN').length;
      const losses = bets.filter(b => b.result?.outcome === 'LOSS').length;
      const pushes = bets.filter(b => b.result?.outcome === 'PUSH').length;
      const totalProfit = bets.reduce((sum, b) => sum + (b.result?.profit || 0), 0);
      
      setStats({
        totalBets: bets.length,
        wins,
        losses,
        pushes,
        winRate: wins + losses > 0 ? (wins / (wins + losses)) * 100 : 0,
        roi: bets.length > 0 ? (totalProfit / bets.length) * 100 : 0,
        profit: totalProfit
      });
      
      // Calculate by market
      const marketStats = {};
      bets.forEach(b => {
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
        stats.roi = stats.bets > 0 ? (stats.profit / stats.bets) * 100 : 0;
        stats.winRate = stats.wins + stats.losses > 0 ? (stats.wins / (stats.wins + stats.losses)) * 100 : 0;
      });
      setByMarket(marketStats);
      
      // Calculate by rating (EXCLUDE C-rated bets - not recommended anymore)
      const ratingStats = {};
      bets
        .filter(b => b.prediction?.rating !== 'C') // Only show B-rated or higher
        .forEach(b => {
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
      
      // Only show B-rated or higher in recent bets
      setRecentBets(bets.filter(b => b.prediction?.rating !== 'C').slice(0, 20));
      setLoading(false);
    } catch (error) {
      console.error('Error loading performance data:', error);
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
          Track betting results and validate model accuracy
        </p>
      </div>
      
      {/* Summary Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <StatCard
          icon={<Target size={24} color="#10B981" />}
          label="Win Rate"
          value={`${stats.winRate.toFixed(1)}%`}
          target="52-58%"
          status={stats.winRate >= 52 && stats.winRate <= 58 ? 'good' : 'warning'}
        />
        <StatCard
          icon={<TrendingUp size={24} color="#3B82F6" />}
          label="ROI"
          value={`${stats.roi > 0 ? '+' : ''}${stats.roi.toFixed(1)}%`}
          target="3-8%"
          status={stats.roi >= 3 && stats.roi <= 8 ? 'good' : 'warning'}
        />
        <StatCard
          icon={<DollarSign size={24} color="#D4AF37" />}
          label="Total Profit"
          value={`${stats.profit > 0 ? '+' : ''}${stats.profit.toFixed(2)}u`}
        />
        <StatCard
          icon={<Activity size={24} color="#8B5CF6" />}
          label="Bets Tracked"
          value={stats.totalBets}
        />
      </div>
      
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

