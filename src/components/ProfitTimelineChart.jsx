import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp } from 'lucide-react';

/**
 * ProfitTimelineChart - Interactive cumulative profit chart with filters
 * Shows profit trends over time with ability to filter by market and rating
 */
const ProfitTimelineChart = ({ bets }) => {
  const [selectedMarkets, setSelectedMarkets] = useState(['ALL']);
  const [selectedRatings, setSelectedRatings] = useState(['ALL']);
  
  // Process bets into timeline data
  const timelineData = useMemo(() => {
    if (!bets || bets.length === 0) return [];
    
    // Sort bets chronologically
    const sortedBets = [...bets].sort((a, b) => {
      const timeA = a.timestamp?.toDate?.() || new Date(a.timestamp);
      const timeB = b.timestamp?.toDate?.() || new Date(b.timestamp);
      return timeA - timeB;
    });
    
    let cumulativeAll = 0;
    let cumulativeML = 0;
    let cumulativeTotal = 0;
    let cumulativeAPlus = 0;
    let cumulativeA = 0;
    let cumulativeBPlus = 0;
    
    return sortedBets.map((bet, index) => {
      const profit = bet.result?.profit || 0;
      const market = bet.bet?.market;
      const rating = bet.prediction?.rating;
      
      // Update cumulative profits
      cumulativeAll += profit;
      if (market === 'MONEYLINE') cumulativeML += profit;
      if (market === 'TOTAL') cumulativeTotal += profit;
      if (rating === 'A+') cumulativeAPlus += profit;
      if (rating === 'A') cumulativeA += profit;
      if (rating === 'B+') cumulativeBPlus += profit;
      
      const date = bet.timestamp?.toDate?.() || new Date(bet.timestamp);
      
      return {
        index: index + 1,
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: date,
        all: parseFloat(cumulativeAll.toFixed(2)),
        moneyline: parseFloat(cumulativeML.toFixed(2)),
        total: parseFloat(cumulativeTotal.toFixed(2)),
        aPlus: parseFloat(cumulativeAPlus.toFixed(2)),
        a: parseFloat(cumulativeA.toFixed(2)),
        bPlus: parseFloat(cumulativeBPlus.toFixed(2)),
        betDetails: {
          market,
          rating,
          profit,
          pick: bet.bet?.pick
        }
      };
    });
  }, [bets]);
  
  // Get filtered data based on selections
  const filteredData = useMemo(() => {
    if (!timelineData.length) return [];
    
    // If "ALL" is selected for both, show all data
    if (selectedMarkets.includes('ALL') && selectedRatings.includes('ALL')) {
      return timelineData;
    }
    
    // Recalculate cumulative based on filters
    let cumulative = 0;
    return timelineData.map((point, index) => {
      // Check if this bet matches filters
      const matchesMarket = selectedMarkets.includes('ALL') || 
                           selectedMarkets.includes(point.betDetails.market);
      const matchesRating = selectedRatings.includes('ALL') || 
                           selectedRatings.includes(point.betDetails.rating);
      
      if (matchesMarket && matchesRating) {
        cumulative += point.betDetails.profit;
      }
      
      return {
        ...point,
        filtered: parseFloat(cumulative.toFixed(2))
      };
    });
  }, [timelineData, selectedMarkets, selectedRatings]);
  
  // Determine which line to show
  const getLineKey = () => {
    // Market filter active (not ALL)
    if (!selectedMarkets.includes('ALL')) {
      if (selectedMarkets.includes('MONEYLINE') && selectedMarkets.length === 1) return 'moneyline';
      if (selectedMarkets.includes('TOTAL') && selectedMarkets.length === 1) return 'total';
    }
    
    // Rating filter active (not ALL)
    if (!selectedRatings.includes('ALL')) {
      if (selectedRatings.includes('A+') && selectedRatings.length === 1) return 'aPlus';
      if (selectedRatings.includes('A') && selectedRatings.length === 1) return 'a';
      if (selectedRatings.includes('B+') && selectedRatings.length === 1) return 'bPlus';
    }
    
    // Combined filters or multiple selections
    if (!selectedMarkets.includes('ALL') || !selectedRatings.includes('ALL')) {
      return 'filtered';
    }
    
    // Default to all
    return 'all';
  };
  
  const lineKey = getLineKey();
  const finalProfit = filteredData.length > 0 ? filteredData[filteredData.length - 1][lineKey] : 0;
  const isProfit = finalProfit > 0;
  
  // Toggle filter
  const toggleMarket = (market) => {
    if (market === 'ALL') {
      setSelectedMarkets(['ALL']);
    } else {
      setSelectedMarkets(prev => {
        const withoutAll = prev.filter(m => m !== 'ALL');
        if (withoutAll.includes(market)) {
          const filtered = withoutAll.filter(m => m !== market);
          return filtered.length === 0 ? ['ALL'] : filtered;
        } else {
          return [...withoutAll, market];
        }
      });
    }
  };
  
  const toggleRating = (rating) => {
    if (rating === 'ALL') {
      setSelectedRatings(['ALL']);
    } else {
      setSelectedRatings(prev => {
        const withoutAll = prev.filter(r => r !== 'ALL');
        if (withoutAll.includes(rating)) {
          const filtered = withoutAll.filter(r => r !== rating);
          return filtered.length === 0 ? ['ALL'] : filtered;
        } else {
          return [...withoutAll, rating];
        }
      });
    }
  };
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload[0]) return null;
    
    const data = payload[0].payload;
    const value = payload[0].value;
    
    return (
      <div style={{
        background: 'rgba(17, 24, 39, 0.95)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        padding: '0.75rem',
        backdropFilter: 'blur(8px)'
      }}>
        <div style={{ fontSize: '0.813rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '0.5rem' }}>
          {data.date} • Bet #{data.index}
        </div>
        <div style={{ 
          fontSize: '1.125rem', 
          fontWeight: '800', 
          color: value >= 0 ? '#10B981' : '#EF4444',
          marginBottom: '0.5rem'
        }}>
          {value >= 0 ? '+' : ''}{value.toFixed(2)}u
        </div>
        <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>
          {data.betDetails.pick}
        </div>
      </div>
    );
  };
  
  if (!bets || bets.length === 0) {
    return (
      <div style={{
        background: 'rgba(17, 24, 39, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        padding: '3rem',
        textAlign: 'center'
      }}>
        <TrendingUp size={48} color="rgba(255, 255, 255, 0.2)" style={{ margin: '0 auto 1rem' }} />
        <div style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.938rem' }}>
          No bet history yet. Start tracking bets to see your profit timeline.
        </div>
      </div>
    );
  }
  
  return (
    <div style={{
      background: 'rgba(17, 24, 39, 0.4)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '2rem'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <TrendingUp size={24} color="#10B981" />
          <div>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '800', 
              margin: 0,
              color: 'rgba(255, 255, 255, 0.95)'
            }}>
              Profit Over Time
            </h3>
            <div style={{ 
              fontSize: '0.813rem', 
              color: 'rgba(255, 255, 255, 0.5)',
              marginTop: '0.25rem'
            }}>
              Cumulative performance • {bets.length} bets tracked
            </div>
          </div>
        </div>
        
        {/* Current Profit Badge */}
        <div style={{
          padding: '0.5rem 1rem',
          background: isProfit 
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)'
            : 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%)',
          border: `1px solid ${isProfit ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
          borderRadius: '8px'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '0.125rem' }}>
            Current
          </div>
          <div style={{ 
            fontSize: '1.375rem', 
            fontWeight: '900', 
            color: isProfit ? '#10B981' : '#EF4444'
          }}>
            {isProfit ? '+' : ''}{finalProfit.toFixed(2)}u
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div style={{ marginBottom: '1.5rem' }}>
        {/* Market Filters */}
        <div style={{ marginBottom: '0.75rem' }}>
          <div style={{ 
            fontSize: '0.688rem', 
            color: 'rgba(255, 255, 255, 0.5)', 
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: '600',
            marginBottom: '0.5rem'
          }}>
            Market
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['ALL', 'MONEYLINE', 'TOTAL'].map(market => {
              const isActive = selectedMarkets.includes(market);
              return (
                <button
                  key={market}
                  onClick={() => toggleMarket(market)}
                  style={{
                    padding: '0.375rem 0.875rem',
                    fontSize: '0.813rem',
                    fontWeight: '600',
                    borderRadius: '6px',
                    border: isActive 
                      ? '1.5px solid #3B82F6'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    background: isActive
                      ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%)'
                      : 'rgba(255, 255, 255, 0.03)',
                    color: isActive ? '#3B82F6' : 'rgba(255, 255, 255, 0.6)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.target.style.background = 'rgba(255, 255, 255, 0.06)';
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.target.style.background = 'rgba(255, 255, 255, 0.03)';
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    }
                  }}
                >
                  {market === 'ALL' ? 'All Markets' : market === 'MONEYLINE' ? 'Moneyline' : 'Total'}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Rating Filters */}
        <div>
          <div style={{ 
            fontSize: '0.688rem', 
            color: 'rgba(255, 255, 255, 0.5)', 
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: '600',
            marginBottom: '0.5rem'
          }}>
            Rating
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { key: 'ALL', label: 'All Ratings', color: '#64748B' },
              { key: 'A+', label: 'A+', color: '#10B981' },
              { key: 'A', label: 'A', color: '#059669' },
              { key: 'B+', label: 'B+', color: '#0EA5E9' }
            ].map(rating => {
              const isActive = selectedRatings.includes(rating.key);
              return (
                <button
                  key={rating.key}
                  onClick={() => toggleRating(rating.key)}
                  style={{
                    padding: '0.375rem 0.875rem',
                    fontSize: '0.813rem',
                    fontWeight: '700',
                    borderRadius: '6px',
                    border: isActive 
                      ? `1.5px solid ${rating.color}`
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    background: isActive
                      ? `linear-gradient(135deg, ${rating.color}33 0%, ${rating.color}1A 100%)`
                      : 'rgba(255, 255, 255, 0.03)',
                    color: isActive ? rating.color : 'rgba(255, 255, 255, 0.6)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    minWidth: rating.key === 'ALL' ? 'auto' : '42px',
                    textAlign: 'center'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.target.style.background = 'rgba(255, 255, 255, 0.06)';
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.target.style.background = 'rgba(255, 255, 255, 0.03)';
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    }
                  }}
                >
                  {rating.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Chart */}
      <div style={{ height: '300px', marginTop: '1.5rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(255, 255, 255, 0.05)" 
              vertical={false}
            />
            <XAxis 
              dataKey="date" 
              stroke="rgba(255, 255, 255, 0.3)"
              style={{ fontSize: '0.75rem' }}
              tickLine={false}
            />
            <YAxis 
              stroke="rgba(255, 255, 255, 0.3)"
              style={{ fontSize: '0.75rem' }}
              tickLine={false}
              tickFormatter={(value) => `${value >= 0 ? '+' : ''}${value}u`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey={lineKey}
              stroke={finalProfit >= 0 ? '#10B981' : '#EF4444'}
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: finalProfit >= 0 ? '#10B981' : '#EF4444' }}
              animationDuration={500}
            />
            {/* Zero line */}
            <Line 
              type="monotone" 
              dataKey={() => 0}
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth={1}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProfitTimelineChart;

