/**
 * Radar Comparison Chart - Enhanced spider chart for 6-metric comparison
 * Larger, more colorful, animated visual showing team strengths at-a-glance
 */

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { calculatePercentileRank } from '../../utils/matchupCalculations';
import { useState, useEffect } from 'react';

export default function RadarComparison({ awayTeam, homeTeam, matchupData, dataProcessor }) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Trigger animation on mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!matchupData || !dataProcessor) return null;

  const awayStats5v5 = matchupData.away.stats5v5;
  const homeStats5v5 = matchupData.home.stats5v5;

  if (!awayStats5v5 || !homeStats5v5) return null;

  // Get percentile ranks for 6 key metrics
  const metrics = [
    { field: 'xGoalsFor', label: 'Offense', higherIsBetter: true },
    { field: 'xGoalsAgainst', label: 'Defense', higherIsBetter: false },
    { field: 'highDangerShotsFor', label: 'Shot Quality', higherIsBetter: true },
    { field: 'corsiPercentage', label: 'Possession', higherIsBetter: true },
    { field: 'fenwickPercentage', label: 'Pressure', higherIsBetter: true },
    { field: 'xGoalsPercentage', label: 'xG Share', higherIsBetter: true }
  ];

  const radarData = metrics.map(metric => {
    const awayRank = calculatePercentileRank(dataProcessor, awayTeam.code, metric.field, '5on5', metric.higherIsBetter);
    const homeRank = calculatePercentileRank(dataProcessor, homeTeam.code, metric.field, '5on5', metric.higherIsBetter);

    return {
      metric: metric.label,
      [awayTeam.code]: awayRank?.percentile || 50,
      [homeTeam.code]: homeRank?.percentile || 50,
      fullMark: 100
    };
  });

  return (
    <div className="elevated-card" style={{
      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
      backdropFilter: 'blur(20px) saturate(180%)',
      border: '1px solid rgba(148, 163, 184, 0.1)',
      borderRadius: '20px',
      padding: '2.5rem',
      marginBottom: '2.5rem',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      position: 'relative',
      overflow: 'hidden',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      {/* Enhanced Gradient Orb Background */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, rgba(16, 185, 129, 0.1) 50%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <h2 style={{
          fontSize: '1.875rem',
          fontWeight: '700',
          color: '#F1F5F9',
          marginBottom: '0.5rem',
          background: 'linear-gradient(135deg, #F1F5F9 0%, #94A3B8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Team Performance Radar
        </h2>
        <p style={{
          fontSize: '0.9375rem',
          color: '#94A3B8',
          marginBottom: '2.5rem'
        }}>
          League percentile rankings • Larger area = better team
        </p>

        <ResponsiveContainer width="100%" height={500}>
          <RadarChart data={radarData}>
            <PolarGrid 
              stroke="rgba(148, 163, 184, 0.2)" 
              strokeWidth={1}
            />
            <PolarAngleAxis 
              dataKey="metric" 
              tick={{ 
                fill: '#94A3B8', 
                fontSize: 14,
                fontWeight: 600
              }}
              stroke="rgba(148, 163, 184, 0.3)"
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              tick={{ 
                fill: '#64748B', 
                fontSize: 12 
              }}
              stroke="rgba(148, 163, 184, 0.3)"
            />
            <Radar 
              name={awayTeam.code}
              dataKey={awayTeam.code}
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.35}
              strokeWidth={3.5}
              dot={{
                r: 6,
                fill: '#3B82F6',
                stroke: '#1E40AF',
                strokeWidth: 2.5
              }}
              animationBegin={200}
              animationDuration={800}
              animationEasing="ease-out"
            />
            <Radar 
              name={homeTeam.code}
              dataKey={homeTeam.code}
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.35}
              strokeWidth={3.5}
              dot={{
                r: 6,
                fill: '#10B981',
                stroke: '#059669',
                strokeWidth: 2.5
              }}
              animationBegin={200}
              animationDuration={800}
              animationEasing="ease-out"
            />
            <Tooltip
              contentStyle={{
                background: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '12px',
                color: '#F1F5F9',
                padding: '12px',
                backdropFilter: 'blur(10px)'
              }}
              formatter={(value) => `${Math.round(value)}th percentile`}
            />
            <Legend 
              wrapperStyle={{
                paddingTop: '30px',
                fontSize: '14px',
                fontWeight: 600
              }}
              iconType="circle"
              iconSize={12}
            />
          </RadarChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: 'rgba(15, 23, 42, 0.3)',
          borderRadius: '12px',
          border: '1px solid rgba(148, 163, 184, 0.1)'
        }}>
          <div style={{
            fontSize: '0.75rem',
            color: '#94A3B8',
            textAlign: 'center'
          }}>
            <strong style={{ color: '#F1F5F9' }}>How to Read:</strong> Larger area = better team.
            Values show league percentile rank (100 = best in NHL, 0 = worst).
            Outer edges represent elite performance.
          </div>
        </div>
      </div>
    </div>
  );
}

