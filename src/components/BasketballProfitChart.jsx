/**
 * Basketball Profit Timeline Chart
 * Premium chart matching NHL brand standards
 */

import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp } from 'lucide-react';

const BasketballProfitChart = ({ bets }) => {
  const [selectedGrade, setSelectedGrade] = useState('ALL');
  
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
    let cumulativeAPlus = 0;
    let cumulativeA = 0;
    let cumulativeAMinus = 0;
    let cumulativeBPlus = 0;
    let cumulativeB = 0;
    let cumulativeBMinus = 0;
    let cumulativeCToF = 0; // C+ to F combined
    
    return sortedBets.map((bet, index) => {
      const profit = bet.result?.profit || 0;
      const grade = bet.prediction?.grade || 'B';
      
      // Update cumulative profits
      cumulativeAll += profit;
      if (grade === 'A+') cumulativeAPlus += profit;
      if (grade === 'A') cumulativeA += profit;
      if (grade === 'A-') cumulativeAMinus += profit;
      if (grade === 'B+') cumulativeBPlus += profit;
      if (grade === 'B') cumulativeB += profit;
      if (grade === 'B-') cumulativeBMinus += profit;
      // Track C-F grades together (C+, C, C-, D, F)
      if (['C+', 'C', 'C-', 'D', 'F'].includes(grade)) cumulativeCToF += profit;
      
      const date = bet.timestamp?.toDate?.() || new Date(bet.timestamp);
      
      return {
        index: index + 1,
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: date,
        all: parseFloat(cumulativeAll.toFixed(2)),
        aPlus: parseFloat(cumulativeAPlus.toFixed(2)),
        a: parseFloat(cumulativeA.toFixed(2)),
        aMinus: parseFloat(cumulativeAMinus.toFixed(2)),
        bPlus: parseFloat(cumulativeBPlus.toFixed(2)),
        b: parseFloat(cumulativeB.toFixed(2)),
        bMinus: parseFloat(cumulativeBMinus.toFixed(2)),
        cToF: parseFloat(cumulativeCToF.toFixed(2)), // C+ to F combined
        betDetails: {
          grade,
          profit,
          outcome: bet.result?.outcome,
          teams: `${bet.teams?.away || '?'} @ ${bet.teams?.home || '?'}`
        }
      };
    });
  }, [bets]);
  
  // Get the data key based on selected grade
  const lineKey = selectedGrade === 'ALL' ? 'all' :
                  selectedGrade === 'A+' ? 'aPlus' :
                  selectedGrade === 'A' ? 'a' :
                  selectedGrade === 'A-' ? 'aMinus' :
                  selectedGrade === 'B+' ? 'bPlus' :
                  selectedGrade === 'B' ? 'b' :
                  selectedGrade === 'B-' ? 'bMinus' :
                  selectedGrade === 'C-F' ? 'cToF' : 'all';
  
  // Get final profit for selected filter
  const finalProfit = timelineData.length > 0 ? timelineData[timelineData.length - 1][lineKey] : 0;
  
  // Grade filter options
  const gradeFilters = [
    { value: 'ALL', label: 'All Grades', color: '#10B981' },
    { value: 'A+', label: 'A+', color: '#10B981' },
    { value: 'A', label: 'A', color: '#14B8A6' },
    { value: 'A-', label: 'A-', color: '#3B82F6' },
    { value: 'B+', label: 'B+', color: '#8B5CF6' },
    { value: 'B', label: 'B', color: '#F59E0B' },
    { value: 'B-', label: 'B-', color: '#FB923C' },
    { value: 'C-F', label: 'C-F', color: '#94A3B8' }
  ];
  
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
      background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '20px',
      padding: '2rem',
      marginBottom: '2rem'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            padding: '0.75rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
          }}>
            <TrendingUp size={24} color="#ffffff" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>
              Profit Over Time
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', margin: '0.25rem 0 0 0' }}>
              Cumulative performance • {timelineData.length} bets tracked
            </p>
          </div>
        </div>
        
        {/* Current Profit Badge */}
        <div style={{
          background: finalProfit >= 0 
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.1) 100%)'
            : 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.1) 100%)',
          border: `1px solid ${finalProfit >= 0 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
          borderRadius: '12px',
          padding: '0.75rem 1.5rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.25rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Current
          </div>
          <div style={{ 
            fontSize: '1.75rem', 
            fontWeight: '900', 
            color: finalProfit >= 0 ? '#10B981' : '#EF4444',
            fontFeatureSettings: "'tnum'",
            letterSpacing: '-0.03em'
          }}>
            {finalProfit >= 0 ? '+' : ''}{finalProfit}u
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          GRADE
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {gradeFilters.map(grade => {
            const isSelected = selectedGrade === grade.value;
            return (
              <button
                key={grade.value}
                onClick={() => setSelectedGrade(grade.value)}
                style={{
                  background: isSelected 
                    ? `linear-gradient(135deg, ${grade.color}25 0%, ${grade.color}15 100%)`
                    : 'rgba(255,255,255,0.05)',
                  border: isSelected 
                    ? `1px solid ${grade.color}60`
                    : '1px solid rgba(255,255,255,0.1)',
                  color: isSelected ? grade.color : 'rgba(255,255,255,0.7)',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  outline: 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  }
                }}
              >
                {grade.label}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Chart */}
      <div style={{ height: '300px', marginTop: '1.5rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timelineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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

export default BasketballProfitChart;

