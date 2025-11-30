/**
 * Basketball Profit Timeline Chart
 * Premium chart matching NHL brand standards
 */

import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp } from 'lucide-react';

const BasketballProfitChart = ({ bets }) => {
  const isMobile = window.innerWidth < 768;
  
  // Process bets into timeline data
  const timelineData = useMemo(() => {
    if (!bets || bets.length === 0) return [];
    
    // Filter to only graded bets with results
    const gradedBets = bets.filter(b => b.result && b.result.outcome);
    
    // Sort chronologically
    const sortedBets = [...gradedBets].sort((a, b) => {
      const timeA = a.timestamp?.toDate?.() || new Date(a.timestamp);
      const timeB = b.timestamp?.toDate?.() || new Date(b.timestamp);
      return timeA - timeB;
    });
    
    let cumulativeAll = 0;
    
    return sortedBets.map((bet, index) => {
      const profit = bet.result?.profit || 0;
      const grade = bet.prediction?.grade || 'B';
      
      // Update cumulative profit
      cumulativeAll += profit;
      
      const date = bet.timestamp?.toDate?.() || new Date(bet.timestamp);
      
      return {
        index: index + 1,
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: date,
        all: parseFloat(cumulativeAll.toFixed(2)),
        betDetails: {
          grade,
          profit,
          outcome: bet.result?.outcome,
          teams: `${bet.teams?.away || '?'} @ ${bet.teams?.home || '?'}`
        }
      };
    });
  }, [bets]);
  
  // Get final profit
  const finalProfit = timelineData.length > 0 ? timelineData[timelineData.length - 1].all : 0;
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '1rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
        }}>
          <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.5rem' }}>
            {data.date} • Bet #{data.index}
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: '800', color: payload[0].value >= 0 ? '#10B981' : '#EF4444', marginBottom: '0.5rem' }}>
            {payload[0].value >= 0 ? '+' : ''}{payload[0].value}u
          </div>
          {data.betDetails && (
            <>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem' }}>
                {data.betDetails.teams}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                Grade: {data.betDetails.grade} • {data.betDetails.outcome} • {data.betDetails.profit >= 0 ? '+' : ''}{data.betDetails.profit.toFixed(2)}u
              </div>
            </>
          )}
        </div>
      );
    }
    return null;
  };
  
  if (timelineData.length === 0) {
    return null;
  }
  
  return (
    <div style={{
      background: `
        linear-gradient(135deg, 
          rgba(15, 23, 42, 0.7) 0%, 
          rgba(30, 41, 59, 0.5) 50%,
          rgba(15, 23, 42, 0.7) 100%)
      `,
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(16, 185, 129, 0.12)',
      borderRadius: isMobile ? '14px' : '16px',
      padding: isMobile ? '1.25rem' : '2rem',
      marginBottom: isMobile ? '1.5rem' : '2rem',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255, 255, 255, 0.03)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Subtle background glow */}
      <div style={{
        position: 'absolute',
        top: '-30%',
        left: '20%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
        filter: 'blur(50px)'
      }} />
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: isMobile ? '1.5rem' : '2rem', flexWrap: 'wrap', gap: isMobile ? '0.75rem' : '1rem', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.75rem' : '1rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            padding: isMobile ? '0.625rem' : '0.75rem',
            borderRadius: isMobile ? '10px' : '11px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(16, 185, 129, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
            position: 'relative',
            overflow: 'hidden',
            flexShrink: 0
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '200%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
              animation: 'shimmerChart 3s infinite',
              pointerEvents: 'none'
            }} />
            <TrendingUp size={isMobile ? 18 : 22} color="#ffffff" strokeWidth={2.5} />
          </div>
          <div>
            <h3 style={{ 
              fontSize: isMobile ? '1.063rem' : '1.375rem', 
              fontWeight: '900', 
              background: 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: 0, 
              letterSpacing: '-0.03em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}>
              Profit Over Time
            </h3>
            <p style={{ 
              fontSize: isMobile ? '0.688rem' : '0.813rem', 
              color: 'rgba(255,255,255,0.6)', 
              margin: '0.25rem 0 0 0',
              fontWeight: '600'
            }}>
              Cumulative performance • {timelineData.length} bets tracked
            </p>
          </div>
        </div>
        
        {/* Current Profit Badge - Premium */}
        <div style={{
          background: finalProfit >= 0 
            ? `linear-gradient(135deg, rgba(16, 185, 129, 0.18) 0%, rgba(5, 150, 105, 0.12) 100%)`
            : `linear-gradient(135deg, rgba(239, 68, 68, 0.18) 0%, rgba(220, 38, 38, 0.12) 100%)`,
          border: `1px solid ${finalProfit >= 0 ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)'}`,
          borderRadius: isMobile ? '10px' : '11px',
          padding: isMobile ? '0.625rem 1rem' : '0.75rem 1.5rem',
          textAlign: 'center',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          boxShadow: finalProfit >= 0
            ? '0 4px 16px rgba(16, 185, 129, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
            : '0 4px 16px rgba(239, 68, 68, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ 
            fontSize: isMobile ? '0.625rem' : '0.688rem', 
            color: 'rgba(255,255,255,0.6)', 
            marginBottom: '0.375rem', 
            fontWeight: '700', 
            textTransform: 'uppercase', 
            letterSpacing: '0.08em' 
          }}>
            Current
          </div>
          <div style={{ 
            fontSize: isMobile ? '1.25rem' : '1.625rem', 
            fontWeight: '900', 
            color: finalProfit >= 0 ? '#10B981' : '#EF4444',
            fontFeatureSettings: "'tnum'",
            letterSpacing: '-0.04em',
            textShadow: finalProfit >= 0
              ? '0 2px 16px rgba(16, 185, 129, 0.3)'
              : '0 2px 16px rgba(239, 68, 68, 0.3)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}>
            {finalProfit >= 0 ? '+' : ''}{finalProfit}u
          </div>
        </div>
      </div>
      
      {/* Chart */}
      <div style={{ height: isMobile ? '250px' : '300px', marginTop: isMobile ? '1rem' : '1.5rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timelineData} margin={{ top: 5, right: isMobile ? 10 : 30, left: isMobile ? 0 : 20, bottom: 5 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(255, 255, 255, 0.05)" 
              vertical={false}
            />
            <XAxis 
              dataKey="date" 
              stroke="rgba(255, 255, 255, 0.3)"
              style={{ fontSize: isMobile ? '0.625rem' : '0.75rem' }}
              tickLine={false}
            />
            <YAxis 
              stroke="rgba(255, 255, 255, 0.3)"
              style={{ fontSize: isMobile ? '0.625rem' : '0.75rem' }}
              tickLine={false}
              tickFormatter={(value) => `${value >= 0 ? '+' : ''}${value}u`}
              width={isMobile ? 45 : 60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="all"
              stroke={finalProfit >= 0 ? '#10B981' : '#EF4444'}
              strokeWidth={isMobile ? 2.5 : 3}
              dot={false}
              activeDot={{ r: isMobile ? 5 : 6, fill: finalProfit >= 0 ? '#10B981' : '#EF4444' }}
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

// Add CSS animations
const chartStyleSheet = document.createElement("style");
chartStyleSheet.textContent = `
  @keyframes shimmerChart {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

if (!document.head.querySelector('[data-basketball-chart-styles]')) {
  chartStyleSheet.setAttribute('data-basketball-chart-styles', '');
  document.head.appendChild(chartStyleSheet);
}

export default BasketballProfitChart;

