/**
 * Basketball Performance Dashboard
 * Premium section matching NHL brand standards
 */

import { useState, useMemo, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useBasketballBetStats } from '../hooks/useBasketballBetStats';
import BasketballProfitChart from './BasketballProfitChart';
import { Calendar, TrendingUp, Target, DollarSign, Award, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';

export function BasketballPerformanceDashboard() {
  const { stats, loading, dailyStats } = useBasketballBetStats();
  const [isExpanded, setIsExpanded] = useState(true);
  const [showTimeBreakdown, setShowTimeBreakdown] = useState(false);
  const [allBets, setAllBets] = useState([]);

  // Fetch ALL bets from Firebase for chart and time calculations
  useEffect(() => {
    const betsQuery = query(collection(db, 'basketball_bets'));
    
    const unsubscribe = onSnapshot(betsQuery, (snapshot) => {
      const bets = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      console.log(`📊 Dashboard: Loaded ${bets.length} total bets for chart`);
      setAllBets(bets);
    });

    return () => unsubscribe();
  }, []);

  // Calculate time-based stats
  const timeStats = useMemo(() => {
    if (!allBets || allBets.length === 0) return { thisWeek: null, thisMonth: null, showTimeBreakdown: false };

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const gradedBets = allBets.filter(b => b.result && b.result.outcome);

    const weekBets = gradedBets.filter(b => {
      const betDate = b.timestamp?.toDate?.() || new Date(b.timestamp);
      return betDate >= weekAgo;
    });

    const monthBets = gradedBets.filter(b => {
      const betDate = b.timestamp?.toDate?.() || new Date(b.timestamp);
      return betDate >= monthStart;
    });

    const calcStats = (bets) => {
      const wins = bets.filter(b => b.result?.outcome === 'WIN').length;
      const losses = bets.filter(b => b.result?.outcome === 'LOSS').length;
      const profit = bets.reduce((sum, b) => sum + (b.result?.profit || 0), 0);
      const winRate = bets.length > 0 ? (wins / bets.length) * 100 : 0;
      return { record: `${wins}-${losses}`, profit, winRate, total: bets.length };
    };

    const weekStats = calcStats(weekBets);
    const monthStats = calcStats(monthBets);
    
    // Only show time breakdown if there's meaningful difference from overall stats
    // (i.e., not all bets are from this week/month)
    const showTimeBreakdown = weekBets.length < gradedBets.length || monthBets.length < gradedBets.length;

    return {
      thisWeek: weekStats,
      thisMonth: monthStats,
      showTimeBreakdown
    };
  }, [allBets]);

  if (loading) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px',
        padding: '2rem',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-400"></div>
          <span style={{ color: 'rgba(255,255,255,0.6)' }}>Loading performance data...</span>
        </div>
      </div>
    );
  }

  if (stats.totalBets === 0) {
    return null;
  }

  const { wins, losses, winRate, unitsWon, totalRisked, roi, gradedBets } = stats;
  const isMobile = window.innerWidth < 768;

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.06) 0%, rgba(5, 150, 105, 0.03) 100%)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(16, 185, 129, 0.2)',
      borderRadius: '24px',
      padding: isMobile ? '1.5rem' : '2rem',
      marginBottom: '2rem',
      boxShadow: '0 12px 48px rgba(0, 0, 0, 0.4), 0 0 80px rgba(16, 185, 129, 0.1)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background gradient accent */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-20%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
        filter: 'blur(60px)'
      }} />

      {/* Header with Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          marginBottom: isExpanded ? '2rem' : 0,
          position: 'relative',
          zIndex: 1
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: isMobile ? '48px' : '56px',
            height: isMobile ? '48px' : '56px',
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: isMobile ? '1.5rem' : '1.75rem',
            boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            flexShrink: 0
          }}>
            🏀
          </div>
          <div style={{ textAlign: 'left' }}>
            <h2 style={{
              fontSize: isMobile ? '1.25rem' : '1.5rem',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.03em',
              margin: 0,
              lineHeight: 1.2
            }}>
              Basketball Performance
            </h2>
            <div style={{
              fontSize: isMobile ? '0.75rem' : '0.813rem',
              color: 'rgba(16, 185, 129, 0.8)',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginTop: '0.25rem'
            }}>
              Live Tracking
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Quick Preview when collapsed */}
          {!isExpanded && (
            <div style={{
              fontSize: isMobile ? '0.875rem' : '1rem',
              fontWeight: '800',
              color: unitsWon >= 0 ? '#10B981' : '#EF4444',
              background: unitsWon >= 0
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)'
                : 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.1) 100%)',
              border: `1px solid ${unitsWon >= 0 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
              padding: '0.625rem 1rem',
              borderRadius: '12px',
              fontFeatureSettings: "'tnum'",
              whiteSpace: 'nowrap'
            }}>
              {wins}-{losses} • {unitsWon >= 0 ? '+' : ''}{unitsWon.toFixed(1)}u
            </div>
          )}
          {isExpanded ? 
            <ChevronUp size={isMobile ? 20 : 24} color="rgba(255,255,255,0.5)" /> : 
            <ChevronDown size={isMobile ? 20 : 24} color="rgba(255,255,255,0.5)" />
          }
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Main Stats Grid - Premium Layout */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
            gap: isMobile ? '0.75rem' : '1.5rem',
            marginBottom: isMobile ? '1.5rem' : '2rem'
          }}>
            {/* Graded Bets */}
            <StatCard
              icon={<Target size={20} />}
              value={gradedBets}
              label="Graded Bets"
              color="rgba(255,255,255,0.9)"
              isMobile={isMobile}
            />

            {/* Record */}
            <StatCard
              icon={<BarChart3 size={20} />}
              value={`${wins}-${losses}`}
              label="Record"
              color="#10B981"
              isMobile={isMobile}
            />

            {/* Win Rate */}
            <StatCard
              icon={<Award size={20} />}
              value={`${winRate.toFixed(1)}%`}
              label="Win Rate"
              color="#10B981"
              highlight={winRate >= 60}
              isMobile={isMobile}
            />

            {/* Units Risked */}
            <StatCard
              icon={<DollarSign size={20} />}
              value={`${totalRisked.toFixed(1)}u`}
              label="Units Risked"
              color="rgba(255,255,255,0.7)"
              isMobile={isMobile}
            />

            {/* Units Won */}
            <StatCard
              icon={<DollarSign size={20} />}
              value={`${unitsWon >= 0 ? '+' : ''}${unitsWon.toFixed(2)}u`}
              label="Units Won"
              color={unitsWon >= 0 ? '#10B981' : '#EF4444'}
              highlight={true}
              isMobile={isMobile}
            />

            {/* ROI */}
            <StatCard
              icon={<TrendingUp size={20} />}
              value={`${roi >= 0 ? '+' : ''}${roi.toFixed(1)}%`}
              label="ROI"
              color={roi >= 0 ? '#10B981' : '#EF4444'}
              highlight={roi >= 5}
              isMobile={isMobile}
            />
          </div>

          {/* Profit Timeline Toggle - Only show if there's meaningful time-based data */}
          {timeStats.showTimeBreakdown && (
            <button
              onClick={() => setShowTimeBreakdown(!showTimeBreakdown)}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: isMobile ? '0.875rem' : '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                marginBottom: '1.5rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Calendar size={isMobile ? 18 : 20} color="rgba(16, 185, 129, 0.8)" />
                <span style={{ color: 'rgba(255,255,255,0.9)', fontWeight: '600', fontSize: isMobile ? '0.875rem' : '0.938rem' }}>
                  {showTimeBreakdown ? 'Hide' : 'Show'} Time Breakdown
                </span>
              </div>
              {showTimeBreakdown ? <ChevronUp size={isMobile ? 18 : 20} /> : <ChevronDown size={isMobile ? 18 : 20} />}
            </button>
          )}

          {/* Time Period Breakdown */}
          {timeStats.showTimeBreakdown && showTimeBreakdown && timeStats.thisMonth && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              {/* This Month */}
              <TimePeriodCard
                title="📆 THIS MONTH"
                record={timeStats.thisMonth.record}
                profit={timeStats.thisMonth.profit}
                winRate={timeStats.thisMonth.winRate}
                totalBets={timeStats.thisMonth.total}
                color="#D4AF37"
                isMobile={isMobile}
              />

              {/* This Week */}
              <TimePeriodCard
                title="📊 THIS WEEK"
                record={timeStats.thisWeek.record}
                profit={timeStats.thisWeek.profit}
                winRate={timeStats.thisWeek.winRate}
                totalBets={timeStats.thisWeek.total}
                color="#EF4444"
                isMobile={isMobile}
              />
            </div>
          )}

          {/* Elite Performance Badge */}
          {roi >= 10 && (
            <div style={{
              textAlign: 'center',
              padding: '0.75rem',
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(255, 215, 0, 0.1) 100%)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '12px',
              marginBottom: '1.5rem'
            }}>
              <span style={{ fontSize: '1.125rem', fontWeight: '700' }}>
                🔥 Elite Performance!
              </span>
            </div>
          )}

          {/* Profit Timeline Chart */}
          {allBets && allBets.length > 0 && (
            <BasketballProfitChart bets={allBets} />
          )}
        </div>
      )}
    </div>
  );
}

// Premium Stat Card Component
function StatCard({ icon, value, label, color, highlight = false, isMobile }) {
  return (
    <div style={{
      background: highlight
        ? `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`
        : 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.6) 100%)',
      backdropFilter: 'blur(10px)',
      border: highlight 
        ? `1px solid ${color}40`
        : '1px solid rgba(255,255,255,0.08)',
      borderRadius: isMobile ? '12px' : '16px',
      padding: isMobile ? '1rem' : '1.5rem',
      textAlign: 'center',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'default',
      position: 'relative',
      overflow: 'hidden'
    }}
    onMouseEnter={(e) => {
      if (!isMobile) {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.3), 0 0 40px ${color}30`;
      }
    }}
    onMouseLeave={(e) => {
      if (!isMobile) {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }
    }}
    >
      {/* Icon */}
      <div style={{
        color,
        marginBottom: isMobile ? '0.5rem' : '0.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.8
      }}>
        {icon}
      </div>
      
      {/* Value */}
      <div style={{
        fontSize: isMobile ? '1.5rem' : '2rem',
        fontWeight: '900',
        color,
        marginBottom: isMobile ? '0.375rem' : '0.5rem',
        fontFeatureSettings: "'tnum'",
        letterSpacing: '-0.03em',
        textShadow: `0 2px 16px ${color}40`,
        lineHeight: 1
      }}>
        {value}
      </div>
      
      {/* Label */}
      <div style={{
        fontSize: isMobile ? '0.625rem' : '0.75rem',
        color: 'rgba(255,255,255,0.6)',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        lineHeight: 1.2
      }}>
        {label}
      </div>
    </div>
  );
}

// Time Period Card Component
function TimePeriodCard({ title, record, profit, winRate, totalBets, color, isMobile }) {
  const isPositive = profit >= 0;
  
  return (
    <div style={{
      background: isPositive
        ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%)'
        : 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)',
      border: `1px solid ${isPositive ? 'rgba(212, 175, 55, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
      borderRadius: '16px',
      padding: isMobile ? '1.25rem' : '1.5rem',
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        fontSize: '0.875rem',
        fontWeight: '700',
        color: isPositive ? '#D4AF37' : '#EF4444',
        marginBottom: '1rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        {title}
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.25rem' }}>
          Total Profit
        </div>
        <div style={{
          fontSize: isMobile ? '1.75rem' : '2rem',
          fontWeight: '900',
          color: isPositive ? '#10B981' : '#EF4444',
          fontFeatureSettings: "'tnum'",
          letterSpacing: '-0.03em'
        }}>
          {isPositive ? '+' : ''}{profit.toFixed(2)}u
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
        paddingTop: '1rem',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Record</div>
          <div style={{ fontSize: '0.938rem', fontWeight: '700', color: '#ffffff' }}>{record}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Win Rate</div>
          <div style={{ fontSize: '0.938rem', fontWeight: '700', color: '#ffffff' }}>{winRate.toFixed(1)}%</div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Bets</div>
          <div style={{ fontSize: '0.938rem', fontWeight: '700', color: '#ffffff' }}>{totalBets}</div>
        </div>
      </div>
    </div>
  );
}

export default BasketballPerformanceDashboard;

