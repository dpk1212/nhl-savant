/**
 * Shot Danger Chart - Breakdown of shot quality
 * Shows low, medium, and high danger shots for both teams
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ShotDangerChart({ awayTeam, homeTeam, awayStats, homeStats }) {
  if (!awayStats || !homeStats) {
    return null;
  }

  const data = [
    {
      name: 'Low Danger',
      [awayTeam.code]: awayStats.lowDangerShots || 0,
      [homeTeam.code]: homeStats.lowDangerShots || 0
    },
    {
      name: 'Medium Danger',
      [awayTeam.code]: awayStats.mediumDangerShots || 0,
      [homeTeam.code]: homeStats.mediumDangerShots || 0
    },
    {
      name: 'High Danger',
      [awayTeam.code]: awayStats.highDangerShots || 0,
      [homeTeam.code]: homeStats.highDangerShots || 0
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
