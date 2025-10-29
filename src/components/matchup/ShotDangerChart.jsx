/**
 * Shot Danger Chart - ENHANCED visual shot quality breakdown
 * Stacked bars with percentage view, more colorful and informative
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { useState } from 'react';

export default function ShotDangerChart({ awayTeam, homeTeam, awayStats, homeStats }) {
  const [viewMode, setViewMode] = useState('stacked'); // 'stacked' or 'grouped'
  
  if (!awayStats || !homeStats) {
    return null;
  }

  // Calculate per-60 rates from totals
  const awayIceTime60 = (awayStats?.iceTime || 1) / 60;
  const homeIceTime60 = (homeStats?.iceTime || 1) / 60;

  // Get shot danger breakdown, with fallbacks if fields missing
  const getShots = (stats, iceTime60) => {
    const low = (stats?.lowDangerShotsFor || 0) / iceTime60;
    const medium = (stats?.mediumDangerShotsFor || 0) / iceTime60;
    const high = (stats?.highDangerShotsFor || 0) / iceTime60;
    
    // Fallback: If all are 0, estimate from total shots (if available)
    if (low === 0 && medium === 0 && high === 0 && stats?.shotsOnGoalFor) {
      const total = (stats.shotsOnGoalFor || 0) / iceTime60;
      return {
        low: total * 0.50, // Estimate 50% low danger
        medium: total * 0.30, // 30% medium
        high: total * 0.20 // 20% high danger
      };
    }
    
    return { low, medium, high };
  };

  const awayShots = getShots(awayStats, awayIceTime60);
  const homeShots = getShots(homeStats, homeIceTime60);

  // Calculate totals and percentages
  const awayTotal = awayShots.low + awayShots.medium + awayShots.high;
  const homeTotal = homeShots.low + homeShots.medium + homeShots.high;
  const awayHighPct = awayTotal > 0 ? (awayShots.high / awayTotal) * 100 : 0;
  const homeHighPct = homeTotal > 0 ? (homeShots.high / homeTotal) * 100 : 0;

  // Data for stacked view (by team)
  const stackedData = [
    {
      name: awayTeam.code,
      'Low Danger': awayShots.low,
      'Medium Danger': awayShots.medium,
      'High Danger': awayShots.high,
      total: awayTotal
    },
    {
      name: homeTeam.code,
      'Low Danger': homeShots.low,
      'Medium Danger': homeShots.medium,
      'High Danger': homeShots.high,
      total: homeTotal
    }
  ];

  return (
    <div className="elevated-card" style={{
      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
      backdropFilter: 'blur(20px) saturate(180%)',
      border: '1px solid rgba(148, 163, 184, 0.1)',
      borderRadius: '20px',
      padding: '2.5rem',
      marginBottom: '2rem',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{
          fontSize: '1.875rem',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #F1F5F9 0%, #94A3B8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '1.5rem'
        }}>
          Shot Quality Breakdown
        </h2>

        {/* Quality Score and High Danger % */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          {/* Away Team */}
          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '12px',
            padding: '1.25rem',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '0.8125rem',
              fontWeight: '700',
              color: '#64748B',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.75rem'
            }}>
              {awayTeam.code}
            </div>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '0.25rem'
            }}>
              {awayHighPct.toFixed(1)}%
            </div>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              color: '#94A3B8'
            }}>
              High Danger Shots
            </div>
            <div style={{
              marginTop: '0.75rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#3B82F6'
            }}>
              Quality Score: {(awayHighPct / 10 + awayTotal / 10).toFixed(1)}/10
            </div>
          </div>

          {/* Home Team */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '12px',
            padding: '1.25rem',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '0.8125rem',
              fontWeight: '700',
              color: '#64748B',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.75rem'
            }}>
              {homeTeam.code}
            </div>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '0.25rem'
            }}>
              {homeHighPct.toFixed(1)}%
            </div>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              color: '#94A3B8'
            }}>
              High Danger Shots
            </div>
            <div style={{
              marginTop: '0.75rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#10B981'
            }}>
              Quality Score: {(homeHighPct / 10 + homeTotal / 10).toFixed(1)}/10
            </div>
          </div>
        </div>
      </div>

      {/* Chart - Stacked Bars with Better Colors */}
      <ResponsiveContainer width="100%" height={350}>
        <BarChart 
          data={stackedData}
          barSize={80}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
          <XAxis 
            dataKey="name" 
            stroke="#94A3B8"
            style={{ fontSize: '1rem', fontWeight: '700' }}
          />
          <YAxis 
            stroke="#94A3B8"
            style={{ fontSize: '0.875rem' }}
            label={{ 
              value: 'Shots/60', 
              angle: -90, 
              position: 'insideLeft', 
              fill: '#94A3B8',
              style: { fontSize: '0.875rem', fontWeight: '600' }
            }}
          />
          <Tooltip 
            contentStyle={{
              background: 'rgba(15, 23, 42, 0.98)',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              borderRadius: '12px',
              color: '#F1F5F9',
              padding: '1rem',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
            }}
            formatter={(value) => `${value.toFixed(2)} shots/60`}
          />
          <Legend 
            wrapperStyle={{
              paddingTop: '20px',
              fontSize: '0.9375rem',
              fontWeight: '600'
            }}
            iconType="square"
          />
          {/* Stacked bars with color-coded danger levels */}
          <Bar dataKey="Low Danger" stackId="a" fill="#64748B" radius={[0, 0, 0, 0]} />
          <Bar dataKey="Medium Danger" stackId="a" fill="#F59E0B" radius={[0, 0, 0, 0]} />
          <Bar dataKey="High Danger" stackId="a" fill="#EF4444" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
