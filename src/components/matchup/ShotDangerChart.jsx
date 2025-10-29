/**
 * Shot Danger Chart - PURE VISUAL shot quality breakdown
 * Large, prominent display with emphasis on high danger opportunities
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

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

  // Calculate totals for summary
  const awayTotal = awayShots.low + awayShots.medium + awayShots.high;
  const homeTotal = homeShots.low + homeShots.medium + homeShots.high;
  const awayHighPct = awayTotal > 0 ? (awayShots.high / awayTotal) * 100 : 0;
  const homeHighPct = homeTotal > 0 ? (homeShots.high / homeTotal) * 100 : 0;

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
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{
          fontSize: '1.75rem',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #F1F5F9 0%, #94A3B8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '1rem'
        }}>
          Shot Quality Analysis
        </h2>

        {/* High Danger Shot % Summary */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '3rem',
          marginTop: '1.5rem'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              color: '#64748B',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.5rem'
            }}>
              {awayTeam.code} High Danger %
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: '900',
              background: awayHighPct > homeHighPct ? 
                'linear-gradient(135deg, #10B981 0%, #059669 100%)' :
                'linear-gradient(135deg, #64748B 0%, #475569 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {awayHighPct.toFixed(1)}%
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              color: '#64748B',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.5rem'
            }}>
              {homeTeam.code} High Danger %
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: '900',
              background: homeHighPct > awayHighPct ?
                'linear-gradient(135deg, #10B981 0%, #059669 100%)' :
                'linear-gradient(135deg, #64748B 0%, #475569 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {homeHighPct.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Chart - LARGER AND MORE PROMINENT */}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart 
          data={data}
          barSize={60}
          barGap={10}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
          <XAxis 
            dataKey="name" 
            stroke="#94A3B8"
            style={{ fontSize: '0.9375rem', fontWeight: '600' }}
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
            formatter={(value) => value.toFixed(2)}
          />
          <Legend 
            wrapperStyle={{
              paddingTop: '20px',
              fontSize: '0.9375rem',
              fontWeight: '600'
            }}
          />
          <Bar dataKey={awayTeam.code} fill="#3B82F6" radius={[8, 8, 0, 0]} />
          <Bar dataKey={homeTeam.code} fill="#10B981" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
