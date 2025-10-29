/**
 * Shot Danger Chart - Breakdown of shot quality
 * Shows low, medium, and high danger shots for both teams
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ShotDangerChart({ awayTeam, homeTeam, awayStats, homeStats }) {
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

  const data = [
    {
      name: 'Low Danger',
      [awayTeam.code]: awayShots.low,
      [homeTeam.code]: homeShots.low
    },
    {
      name: 'Medium Danger',
      [awayTeam.code]: awayShots.medium,
      [homeTeam.code]: homeShots.medium
    },
    {
      name: 'High Danger',
      [awayTeam.code]: awayShots.high,
      [homeTeam.code]: homeShots.high
    }
  ];

  return (
    <div className="elevated-card" style={{
      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
      backdropFilter: 'blur(20px) saturate(180%)',
      border: '1px solid rgba(148, 163, 184, 0.1)',
      borderRadius: '16px',
      padding: '2rem',
      marginBottom: '2rem',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
    }}>
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#F1F5F9',
        marginBottom: '0.5rem'
      }}>
        Shot Danger Breakdown
      </h2>
      <p style={{
        fontSize: '0.875rem',
        color: '#94A3B8',
        marginBottom: '2rem'
      }}>
        Quality vs Quantity - Shots per 60 minutes by danger level
      </p>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
          <XAxis 
            dataKey="name" 
            stroke="#94A3B8"
            style={{ fontSize: '0.875rem' }}
          />
          <YAxis 
            stroke="#94A3B8"
            style={{ fontSize: '0.875rem' }}
          />
          <Tooltip 
            contentStyle={{
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '8px',
              color: '#F1F5F9'
            }}
          />
          <Legend 
            wrapperStyle={{
              paddingTop: '20px'
            }}
          />
          <Bar dataKey={awayTeam.code} fill="#3B82F6" radius={[8, 8, 0, 0]} />
          <Bar dataKey={homeTeam.code} fill="#10B981" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
