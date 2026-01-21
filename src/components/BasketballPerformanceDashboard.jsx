/**
 * Basketball Performance Dashboard
 * Premium section matching NHL brand standards
 */

import { useState, useMemo, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useBasketballBetStats } from '../hooks/useBasketballBetStats';
import BasketballProfitChart from './BasketballProfitChart';
import { BetHistoryPanel } from './BetHistoryPanel';
import { Calendar, TrendingUp, Target, DollarSign, Award, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';

export function BasketballPerformanceDashboard() {
  const { stats, loading, dailyStats } = useBasketballBetStats();
  const [isExpanded, setIsExpanded] = useState(false); // Collapsed by default
  const [showTimeBreakdown, setShowTimeBreakdown] = useState(false);
  const [allBets, setAllBets] = useState([]);
  const [timeFilter, setTimeFilter] = useState('all'); // 'all', 'today', 'yesterday', 'week'
  const [showSavantOnly, setShowSavantOnly] = useState(false); // Filter to show only Savant Picks

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

  // Calculate filtered stats and best recent performance
  const timeStats = useMemo(() => {
    if (!allBets || allBets.length === 0) return { 
      thisWeek: null, 
      thisMonth: null, 
      showTimeBreakdown: false, 
      bestRecent: { profit: 0, period: 'L10', count: 0 }
    };

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const gradedBets = allBets.filter(b => b.result && b.result.outcome);

    // Sort chronologically (newest first)
    const sortedBets = [...gradedBets].sort((a, b) => {
      const timeA = a.timestamp?.toDate?.() || new Date(a.timestamp);
      const timeB = b.timestamp?.toDate?.() || new Date(b.timestamp);
      return timeB - timeA;
    });
    
    // Calculate L5, L10, L20 profits
    const last5Bets = sortedBets.slice(0, 5);
    const last10Bets = sortedBets.slice(0, 10);
    const last20Bets = sortedBets.slice(0, 20);
    
    const l5Profit = last5Bets.reduce((sum, b) => sum + (b.result?.profit || 0), 0);
    const l10Profit = last10Bets.reduce((sum, b) => sum + (b.result?.profit || 0), 0);
    const l20Profit = last20Bets.reduce((sum, b) => sum + (b.result?.profit || 0), 0);
    
    // Find the best performing period
    const periods = [
      { profit: l5Profit, period: 'L5', count: last5Bets.length },
      { profit: l10Profit, period: 'L10', count: last10Bets.length },
      { profit: l20Profit, period: 'L20', count: last20Bets.length }
    ];
    const bestRecent = periods.reduce((best, current) => 
      current.profit > best.profit ? current : best
    );

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
    
    const showTimeBreakdown = weekBets.length < gradedBets.length || monthBets.length < gradedBets.length;

    return {
      thisWeek: weekStats,
      thisMonth: monthStats,
      showTimeBreakdown,
      bestRecent
    };
  }, [allBets]);

  // Filter stats based on selected time period and savant filter
  const filteredStats = useMemo(() => {
    if (!stats && !allBets.length) return stats;
    
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    let gradedBets = allBets.filter(b => {
      if (!b.result || !b.result.outcome) return false;
      
      // Apply Savant filter
      if (showSavantOnly && !b.savantPick) return false;
      
      const betDate = b.timestamp?.toDate?.() || new Date(b.timestamp);
      
      if (timeFilter === 'today') {
        return betDate >= startOfToday;
      } else if (timeFilter === 'yesterday') {
        return betDate >= startOfYesterday && betDate < startOfToday;
      } else if (timeFilter === 'week') {
        return betDate >= weekAgo;
      }
      return true;
    });
    
    const wins = gradedBets.filter(b => b.result?.outcome === 'WIN').length;
    const losses = gradedBets.filter(b => b.result?.outcome === 'LOSS').length;
    const unitsWon = gradedBets.reduce((sum, b) => sum + (b.result?.profit || 0), 0);
    
    // Calculate total risked - use stored units or calculate from prediction
    const totalRisked = gradedBets.reduce((sum, b) => {
      const units = b.result?.units || b.prediction?.unitSize || 0;
      return sum + units;
    }, 0);
    
    const roi = totalRisked > 0 ? (unitsWon / totalRisked) * 100 : 0;
    const winRate = gradedBets.length > 0 ? (wins / gradedBets.length) * 100 : 0;
    
    return {
      wins,
      losses,
      winRate,
      unitsWon,
      totalRisked,
      roi,
      gradedBets: gradedBets.length,
      totalBets: gradedBets.length
    };
  }, [stats, allBets, timeFilter, showSavantOnly]);
  
  // Count Savant Picks for display
  const savantCount = useMemo(() => {
    return allBets.filter(b => b.savantPick && b.result?.outcome).length;
  }, [allBets]);
  
  // Count Models Aligned picks for display
  const modelsAlignedCount = useMemo(() => {
    return allBets.filter(b => b.prediction?.modelsAgree === true && b.result?.outcome).length;
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

  if (!stats || stats.totalBets === 0) {
    return null;
  }

  const { wins, losses, winRate, unitsWon, totalRisked, roi, gradedBets } = filteredStats || stats;
  const isMobile = window.innerWidth < 768;

  return (
    <div style={{
      background: `
        linear-gradient(135deg, #0A0E1A 0%, #111827 30%, #1F2937 60%, #0F172A 100%)
      `,
      border: '1px solid rgba(16, 185, 129, 0.15)',
      borderRadius: '20px',
      padding: isMobile ? '1.5rem' : '2rem',
      marginBottom: '2rem',
      boxShadow: `
        0 20px 60px rgba(0, 0, 0, 0.5),
        0 0 40px rgba(16, 185, 129, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.05)
      `,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated nebula background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 30%, rgba(16, 185, 129, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.06) 0%, transparent 50%)
        `,
        pointerEvents: 'none',
        animation: 'nebulaPulse 8s ease-in-out infinite'
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
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.875rem' : '1rem' }}>
          <div style={{
            width: isMobile ? '44px' : '52px',
            height: isMobile ? '44px' : '52px',
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: isMobile ? '1.375rem' : '1.625rem',
            boxShadow: `
              0 8px 24px rgba(16, 185, 129, 0.35),
              0 0 0 1px rgba(255, 255, 255, 0.1) inset,
              0 2px 0 rgba(255, 255, 255, 0.15) inset
            `,
            flexShrink: 0,
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Icon shine effect */}
            <div style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
              animation: 'iconShine 6s infinite',
              pointerEvents: 'none'
            }} />
            <span style={{ position: 'relative', zIndex: 1 }}>🏀</span>
          </div>
          <div style={{ textAlign: 'left' }}>
            <h2 style={{
              fontSize: isMobile ? '1.125rem' : '1.375rem',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #10B981 0%, #14B8A6 50%, #06B6D4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.04em',
              margin: 0,
              lineHeight: 1.15,
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              textShadow: '0 0 40px rgba(16, 185, 129, 0.3)'
            }}>
              Basketball Performance
            </h2>
            <div style={{
              fontSize: isMobile ? '0.688rem' : '0.75rem',
              color: 'rgba(16, 185, 129, 0.85)',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginTop: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem'
            }}>
              <div style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: '#10B981',
                boxShadow: '0 0 8px #10B981',
                animation: 'pulse 2s infinite'
              }} />
              Live Tracking
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Quick Preview when collapsed - Premium */}
          {!isExpanded && (
            <div style={{
              fontSize: isMobile ? '0.813rem' : '0.938rem',
              fontWeight: '800',
              color: unitsWon >= 0 ? '#10B981' : '#EF4444',
              background: unitsWon >= 0
                ? `linear-gradient(135deg, rgba(16, 185, 129, 0.18) 0%, rgba(5, 150, 105, 0.12) 100%)`
                : `linear-gradient(135deg, rgba(239, 68, 68, 0.18) 0%, rgba(220, 38, 38, 0.12) 100%)`,
              border: `1px solid ${unitsWon >= 0 ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)'}`,
              padding: isMobile ? '0.5rem 0.875rem' : '0.625rem 1.125rem',
              borderRadius: '10px',
              fontFeatureSettings: "'tnum'",
              whiteSpace: 'nowrap',
              boxShadow: unitsWon >= 0
                ? '0 4px 12px rgba(16, 185, 129, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                : '0 4px 12px rgba(239, 68, 68, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              letterSpacing: '-0.02em'
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
          {/* Premium Time Filters */}
          <div style={{ marginBottom: isMobile ? '1.5rem' : '2rem' }}>
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              {/* Time Period Filters */}
              <div>
                <div style={{ 
                  fontSize: isMobile ? '0.625rem' : '0.688rem', 
                  color: 'rgba(255,255,255,0.55)', 
                  marginBottom: '0.875rem', 
                  fontWeight: '700', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.12em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <div style={{
                    width: '2px',
                    height: '12px',
                    background: 'linear-gradient(180deg, #10B981 0%, transparent 100%)',
                    borderRadius: '1px'
                  }} />
                  TIME PERIOD
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {[
                    { value: 'all', label: 'All Time', color: '#10B981' },
                    { value: 'today', label: 'Today', color: '#14B8A6' },
                    { value: 'yesterday', label: 'Yesterday', color: '#3B82F6' },
                    { value: 'week', label: 'This Week', color: '#8B5CF6' }
                  ].map(filter => {
                    const isSelected = timeFilter === filter.value;
                    return (
                      <button
                        key={filter.value}
                        onClick={() => setTimeFilter(filter.value)}
                        style={{
                          background: isSelected 
                            ? `linear-gradient(135deg, ${filter.color}22 0%, ${filter.color}12 100%)`
                            : 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.6) 100%)',
                          border: isSelected 
                            ? `1px solid ${filter.color}50`
                            : '1px solid rgba(255,255,255,0.08)',
                          color: isSelected ? filter.color : 'rgba(255,255,255,0.7)',
                          padding: isMobile ? '0.5rem 0.875rem' : '0.5rem 1rem',
                          borderRadius: '8px',
                          fontSize: isMobile ? '0.75rem' : '0.813rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          outline: 'none',
                          backdropFilter: 'blur(8px)',
                          WebkitBackdropFilter: 'blur(8px)',
                          boxShadow: isSelected
                            ? `0 4px 12px ${filter.color}20, inset 0 1px 0 rgba(255, 255, 255, 0.08)`
                            : '0 2px 6px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255, 255, 255, 0.03)',
                          letterSpacing: '-0.01em',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected && !isMobile) {
                            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.6) 100%)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }
                        }}
                      >
                        {filter.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Savant Picks Filter */}
              {savantCount > 0 && (
                <div>
                  <div style={{ 
                    fontSize: isMobile ? '0.625rem' : '0.688rem', 
                    color: 'rgba(255,255,255,0.55)', 
                    marginBottom: '0.875rem', 
                    fontWeight: '700', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.12em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <div style={{
                      width: '2px',
                      height: '12px',
                      background: 'linear-gradient(180deg, #FBBF24 0%, transparent 100%)',
                      borderRadius: '1px'
                    }} />
                    FILTER
                  </div>
                  <button
                    onClick={() => setShowSavantOnly(!showSavantOnly)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: showSavantOnly 
                        ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.22) 0%, rgba(245, 158, 11, 0.12) 100%)'
                        : 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.6) 100%)',
                      border: showSavantOnly 
                        ? '1px solid rgba(251, 191, 36, 0.5)'
                        : '1px solid rgba(255,255,255,0.08)',
                      color: showSavantOnly ? 'rgba(251, 191, 36, 0.95)' : 'rgba(255,255,255,0.7)',
                      padding: isMobile ? '0.5rem 0.875rem' : '0.5rem 1rem',
                      borderRadius: '8px',
                      fontSize: isMobile ? '0.75rem' : '0.813rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      outline: 'none',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      boxShadow: showSavantOnly
                        ? '0 4px 12px rgba(251, 191, 36, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
                        : '0 2px 6px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255, 255, 255, 0.03)',
                    }}
                  >
                    <span>⭐</span>
                    <span>Savant Only</span>
                    <span style={{
                      fontSize: '0.688rem',
                      fontWeight: '800',
                      color: showSavantOnly ? 'rgba(251, 191, 36, 0.8)' : 'rgba(255,255,255,0.5)',
                      background: showSavantOnly ? 'rgba(251, 191, 36, 0.15)' : 'rgba(255,255,255,0.1)',
                      padding: '0.125rem 0.375rem',
                      borderRadius: '4px',
                    }}>
                      {savantCount}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>

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

            {/* Best Recent Performance */}
            <StatCard
              icon={<Calendar size={20} />}
              value={`${timeStats?.bestRecent?.profit >= 0 ? '+' : ''}${(timeStats?.bestRecent?.profit || 0).toFixed(2)}u`}
              label={`${timeStats?.bestRecent?.period || 'L10'} Best`}
              color={(timeStats?.bestRecent?.profit || 0) >= 0 ? '#10B981' : '#EF4444'}
              highlight={(timeStats?.bestRecent?.profit || 0) >= 2}
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

          {/* Bet History Panel with Premium Summary */}
          {allBets && allBets.filter(b => b.result?.outcome).length > 0 && (
            <BetHistoryPanel bets={allBets} isMobile={isMobile} />
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
            <BasketballProfitChart 
              bets={allBets} 
              timeFilter={timeFilter} 
              showSavantLine={savantCount > 0}
              showModelsAlignedLine={modelsAlignedCount > 0}
            />
          )}
        </div>
      )}
    </div>
  );
}

// Premium Stat Card Component - NHL Style
function StatCard({ icon, value, label, color, highlight = false, isMobile }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div style={{
      background: highlight
        ? `linear-gradient(135deg, ${color}12 0%, ${color}06 100%)`
        : `
          linear-gradient(135deg, 
            rgba(15, 23, 42, 0.8) 0%, 
            rgba(30, 41, 59, 0.6) 50%,
            rgba(15, 23, 42, 0.8) 100%)
        `,
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: highlight 
        ? `1px solid ${color}30`
        : '1px solid rgba(255,255,255,0.06)',
      borderRadius: isMobile ? '12px' : '14px',
      padding: isMobile ? '1rem' : '1.25rem',
      textAlign: 'center',
      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      cursor: 'default',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: highlight
        ? `0 4px 16px rgba(0,0,0,0.4), 0 0 20px ${color}15, inset 0 1px 0 rgba(255, 255, 255, 0.04)`
        : '0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255, 255, 255, 0.03)',
      transform: isHovered && !isMobile ? 'translateY(-3px) scale(1.02)' : 'translateY(0) scale(1)'
    }}
    onMouseEnter={() => !isMobile && setIsHovered(true)}
    onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
      {/* Subtle shine effect */}
      {highlight && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '200%',
          height: '100%',
          background: `linear-gradient(90deg, transparent, ${color}10, transparent)`,
          animation: 'shimmer 3s infinite',
          pointerEvents: 'none'
        }} />
      )}
      
      {/* Icon with gradient background */}
      <div style={{
        width: isMobile ? '36px' : '42px',
        height: isMobile ? '36px' : '42px',
        background: highlight
          ? `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`
          : 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%)',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto',
        marginBottom: isMobile ? '0.625rem' : '0.875rem',
        boxShadow: highlight
          ? `0 4px 12px ${color}20, inset 0 1px 0 rgba(255, 255, 255, 0.1)`
          : '0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ color: highlight ? color : '#10B981', opacity: highlight ? 1 : 0.9 }}>
          {icon}
        </div>
      </div>
      
      {/* Value */}
      <div style={{
        fontSize: isMobile ? '1.375rem' : '1.75rem',
        fontWeight: '900',
        color: highlight ? color : '#F1F5F9',
        marginBottom: isMobile ? '0.375rem' : '0.5rem',
        fontFeatureSettings: "'tnum'",
        letterSpacing: '-0.04em',
        textShadow: highlight 
          ? `0 2px 20px ${color}35, 0 4px 32px ${color}25`
          : '0 2px 8px rgba(0,0,0,0.4)',
        lineHeight: 1,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        {value}
      </div>
      
      {/* Label */}
      <div style={{
        fontSize: isMobile ? '0.625rem' : '0.688rem',
        color: highlight ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.55)',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        lineHeight: 1.3
      }}>
        {label}
      </div>
    </div>
  );
}

// Time Period Card Component - NHL Premium Style
function TimePeriodCard({ title, record, profit, winRate, totalBets, color, isMobile }) {
  const isPositive = profit >= 0;
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      style={{
        background: isPositive
          ? `linear-gradient(135deg, 
              rgba(16, 185, 129, 0.12) 0%, 
              rgba(5, 150, 105, 0.08) 50%,
              rgba(16, 185, 129, 0.06) 100%)`
          : `linear-gradient(135deg, 
              rgba(239, 68, 68, 0.12) 0%, 
              rgba(220, 38, 38, 0.08) 50%,
              rgba(239, 68, 68, 0.06) 100%)`,
        border: `1px solid ${isPositive ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
        borderRadius: isMobile ? '12px' : '14px',
        padding: isMobile ? '1.125rem' : '1.375rem',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: isPositive
          ? '0 4px 16px rgba(16, 185, 129, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.04)'
          : '0 4px 16px rgba(239, 68, 68, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        transform: isHovered && !isMobile ? 'translateY(-2px) scale(1.01)' : 'translateY(0) scale(1)',
        cursor: isMobile ? 'default' : 'pointer',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
      {/* Subtle gradient overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '120px',
        height: '120px',
        background: isPositive
          ? 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(239, 68, 68, 0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
        filter: 'blur(30px)'
      }} />
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          fontSize: isMobile ? '0.75rem' : '0.813rem',
          fontWeight: '800',
          color: isPositive ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)',
          marginBottom: isMobile ? '0.875rem' : '1rem',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <div style={{
            width: '3px',
            height: '14px',
            borderRadius: '2px',
            background: isPositive ? '#10B981' : '#EF4444',
            boxShadow: isPositive 
              ? '0 0 8px rgba(16, 185, 129, 0.5)'
              : '0 0 8px rgba(239, 68, 68, 0.5)'
          }} />
          {title}
        </div>
        
        <div style={{ marginBottom: isMobile ? '0.875rem' : '1rem' }}>
          <div style={{ 
            fontSize: isMobile ? '0.688rem' : '0.75rem', 
            color: 'rgba(255,255,255,0.5)', 
            marginBottom: '0.375rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Total Profit
          </div>
          <div style={{
            fontSize: isMobile ? '1.625rem' : '1.875rem',
            fontWeight: '900',
            color: isPositive ? '#10B981' : '#EF4444',
            fontFeatureSettings: "'tnum'",
            letterSpacing: '-0.04em',
            textShadow: isPositive
              ? '0 2px 16px rgba(16, 185, 129, 0.3)'
              : '0 2px 16px rgba(239, 68, 68, 0.3)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}>
            {isPositive ? '+' : ''}{profit.toFixed(2)}u
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: isMobile ? '0.75rem' : '1rem',
          paddingTop: isMobile ? '0.875rem' : '1rem',
          borderTop: '1px solid rgba(255,255,255,0.08)'
        }}>
          <div>
            <div style={{ 
              fontSize: isMobile ? '0.625rem' : '0.688rem', 
              color: 'rgba(255,255,255,0.5)',
              marginBottom: '0.25rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Record
            </div>
            <div style={{ 
              fontSize: isMobile ? '0.875rem' : '0.938rem', 
              fontWeight: '800', 
              color: '#E5E7EB',
              fontFeatureSettings: "'tnum'"
            }}>
              {record}
            </div>
          </div>
          <div>
            <div style={{ 
              fontSize: isMobile ? '0.625rem' : '0.688rem', 
              color: 'rgba(255,255,255,0.5)',
              marginBottom: '0.25rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Win Rate
            </div>
            <div style={{ 
              fontSize: isMobile ? '0.875rem' : '0.938rem', 
              fontWeight: '800', 
              color: '#E5E7EB',
              fontFeatureSettings: "'tnum'"
            }}>
              {winRate.toFixed(1)}%
            </div>
          </div>
          <div>
            <div style={{ 
              fontSize: isMobile ? '0.625rem' : '0.688rem', 
              color: 'rgba(255,255,255,0.5)',
              marginBottom: '0.25rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Bets
            </div>
            <div style={{ 
              fontSize: isMobile ? '0.875rem' : '0.938rem', 
              fontWeight: '800', 
              color: '#E5E7EB',
              fontFeatureSettings: "'tnum'"
            }}>
              {totalBets}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Bet History List Component - Shows individual picks with clear outcomes
function BetHistoryList({ bets, isMobile }) {
  const [visibleCount, setVisibleCount] = useState(20);
  
  // Sort by date (newest first) and filter for graded bets only
  const sortedBets = useMemo(() => {
    return bets
      .filter(b => b.result?.outcome)
      .sort((a, b) => {
        const timeA = a.timestamp?.toDate?.() || new Date(a.timestamp || 0);
        const timeB = b.timestamp?.toDate?.() || new Date(b.timestamp || 0);
        return timeB - timeA;
      });
  }, [bets]);

  const visibleBets = sortedBets.slice(0, visibleCount);
  const hasMore = visibleCount < sortedBets.length;

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate?.() || new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatOdds = (odds) => {
    if (!odds) return '-';
    return odds > 0 ? `+${odds}` : odds.toString();
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(30, 41, 59, 0.4) 100%)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '16px',
      padding: isMobile ? '1rem' : '1.5rem',
      marginBottom: '1.5rem'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
        paddingBottom: '0.75rem',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{
          fontSize: isMobile ? '0.938rem' : '1rem',
          fontWeight: '700',
          color: 'rgba(255,255,255,0.95)'
        }}>
          📋 Recent Picks
        </div>
        <div style={{
          fontSize: '0.75rem',
          color: 'rgba(255,255,255,0.5)'
        }}>
          Showing {visibleBets.length} of {sortedBets.length}
        </div>
      </div>

      {/* Column Headers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr auto auto auto' : '2fr 1fr 1fr 1fr 1fr',
        gap: isMobile ? '0.5rem' : '1rem',
        padding: '0.5rem 0',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        marginBottom: '0.5rem'
      }}>
        <div style={{ fontSize: '0.688rem', color: 'rgba(255,255,255,0.4)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Pick
        </div>
        {!isMobile && (
          <div style={{ fontSize: '0.688rem', color: 'rgba(255,255,255,0.4)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>
            Odds
          </div>
        )}
        <div style={{ fontSize: '0.688rem', color: 'rgba(255,255,255,0.4)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>
          Units
        </div>
        <div style={{ fontSize: '0.688rem', color: 'rgba(255,255,255,0.4)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>
          Result
        </div>
        <div style={{ fontSize: '0.688rem', color: 'rgba(255,255,255,0.4)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>
          P/L
        </div>
      </div>

      {/* Bet Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {visibleBets.map((bet, idx) => {
          const isWin = bet.result?.outcome === 'WIN';
          const profit = bet.result?.profit || 0;
          const units = bet.result?.units || bet.prediction?.unitSize || 1;
          const team = bet.bet?.team || bet.prediction?.pick || 'Unknown';
          const odds = bet.bet?.odds;
          
          return (
            <div
              key={bet.id || idx}
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr auto auto auto' : '2fr 1fr 1fr 1fr 1fr',
                gap: isMobile ? '0.5rem' : '1rem',
                padding: isMobile ? '0.625rem 0.5rem' : '0.75rem 0.5rem',
                background: isWin 
                  ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.08) 0%, transparent 100%)'
                  : 'linear-gradient(90deg, rgba(239, 68, 68, 0.08) 0%, transparent 100%)',
                borderRadius: '8px',
                borderLeft: `3px solid ${isWin ? '#10B981' : '#EF4444'}`,
                transition: 'all 0.15s ease'
              }}
            >
              {/* Pick/Team */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                minWidth: 0
              }}>
                {isWin ? (
                  <CheckCircle size={isMobile ? 14 : 16} color="#10B981" style={{ flexShrink: 0 }} />
                ) : (
                  <XCircle size={isMobile ? 14 : 16} color="#EF4444" style={{ flexShrink: 0 }} />
                )}
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontSize: isMobile ? '0.813rem' : '0.875rem',
                    fontWeight: '600',
                    color: 'rgba(255,255,255,0.95)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {team}
                  </div>
                  <div style={{
                    fontSize: '0.688rem',
                    color: 'rgba(255,255,255,0.4)'
                  }}>
                    {formatDate(bet.timestamp)}
                    {isMobile && odds && ` • ${formatOdds(odds)}`}
                  </div>
                </div>
              </div>

              {/* Odds (desktop only) */}
              {!isMobile && (
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: 'rgba(255,255,255,0.7)',
                  textAlign: 'center',
                  fontFeatureSettings: "'tnum'"
                }}>
                  {formatOdds(odds)}
                </div>
              )}

              {/* Units */}
              <div style={{
                fontSize: isMobile ? '0.813rem' : '0.875rem',
                fontWeight: '700',
                color: 'rgba(255,255,255,0.8)',
                textAlign: 'center',
                fontFeatureSettings: "'tnum'"
              }}>
                {units.toFixed(1)}u
              </div>

              {/* Result Badge */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: isMobile ? '0.25rem 0.5rem' : '0.25rem 0.625rem',
                  borderRadius: '6px',
                  fontSize: isMobile ? '0.688rem' : '0.75rem',
                  fontWeight: '800',
                  background: isWin ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  color: isWin ? '#10B981' : '#EF4444',
                  border: `1px solid ${isWin ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                }}>
                  {isWin ? 'WIN' : 'LOSS'}
                </span>
              </div>

              {/* Profit/Loss */}
              <div style={{
                fontSize: isMobile ? '0.813rem' : '0.875rem',
                fontWeight: '800',
                color: profit >= 0 ? '#10B981' : '#EF4444',
                textAlign: 'right',
                fontFeatureSettings: "'tnum'"
              }}>
                {profit >= 0 ? '+' : ''}{profit.toFixed(2)}u
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <button
          onClick={() => setVisibleCount(prev => prev + 20)}
          style={{
            width: '100%',
            marginTop: '1rem',
            padding: '0.75rem',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.08) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '10px',
            color: '#3B82F6',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(59, 130, 246, 0.15) 100%)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.08) 100%)';
          }}
        >
          Load More ({sortedBets.length - visibleCount} remaining)
        </button>
      )}

      {/* Summary Footer */}
      <div style={{
        marginTop: '1rem',
        padding: '0.75rem',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '10px',
        display: 'flex',
        justifyContent: 'space-around',
        gap: '1rem'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.688rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.25rem' }}>Total Wins</div>
          <div style={{ fontSize: '1rem', fontWeight: '800', color: '#10B981' }}>
            {sortedBets.filter(b => b.result?.outcome === 'WIN').length}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.688rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.25rem' }}>Total Losses</div>
          <div style={{ fontSize: '1rem', fontWeight: '800', color: '#EF4444' }}>
            {sortedBets.filter(b => b.result?.outcome === 'LOSS').length}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.688rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.25rem' }}>Net Profit</div>
          <div style={{ 
            fontSize: '1rem', 
            fontWeight: '800', 
            color: sortedBets.reduce((sum, b) => sum + (b.result?.profit || 0), 0) >= 0 ? '#10B981' : '#EF4444'
          }}>
            {sortedBets.reduce((sum, b) => sum + (b.result?.profit || 0), 0) >= 0 ? '+' : ''}
            {sortedBets.reduce((sum, b) => sum + (b.result?.profit || 0), 0).toFixed(2)}u
          </div>
        </div>
      </div>
    </div>
  );
}

// Add CSS animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes nebulaPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  @keyframes iconShine {
    0%, 100% { transform: translate(-50%, -50%) rotate(0deg); opacity: 0; }
    50% { transform: translate(50%, 50%) rotate(180deg); opacity: 1; }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(0.9); }
  }
`;

if (!document.head.querySelector('[data-basketball-dashboard-styles]')) {
  styleSheet.setAttribute('data-basketball-dashboard-styles', '');
  document.head.appendChild(styleSheet);
}

export default BasketballPerformanceDashboard;

