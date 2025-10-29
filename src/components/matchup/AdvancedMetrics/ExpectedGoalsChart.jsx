/**
 * Expected Goals Analysis Chart
 * Shows xGF/60 and xGA/60 with league context
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function ExpectedGoalsChart({ awayTeam, homeTeam, awayStats, homeStats }) {
  if (!awayStats || !homeStats) return null;

  const awayXGF = awayStats.xGF_per60 || 0;
  const awayXGA = awayStats.xGA_per60 || 0;
  const homeXGF = homeStats.xGF_per60 || 0;
  const homeXGA = homeStats.xGA_per60 || 0;

  // League average (approximate)
  const leagueAvgXGF = 2.5;
  const leagueAvgXGA = 2.5;

  const data = [
    {
      name: awayTeam.code,
      'xGF/60': awayXGF,
      'xGA/60': awayXGA,
    },
    {
      name: homeTeam.code,
      'xGF/60': homeXGF,
      'xGA/60': homeXGA,
    },
    {
      name: 'League Avg',
      'xGF/60': leagueAvgXGF,
      'xGA/60': leagueAvgXGA,
    }
  ];

  return (
    <div>
      <h4 style={{
        fontSize: '1rem',
        fontWeight: '700',
        color: '#F1F5F9',
        marginBottom: '0.75rem'
      }}>
        Expected Goals (5v5)
      </h4>
      <p style={{
        fontSize: '0.875rem',
        color: '#94A3B8',
        marginBottom: '1rem',
        lineHeight: 1.5
      }}>
        Expected goals per 60 minutes at 5-on-5. Higher xGF/60 = better offense, lower xGA/60 = better defense.
      </p>
      
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
          <XAxis 
            dataKey="name" 
            stroke="#94A3B8" 
            style={{ fontSize: '0.875rem', fontWeight: '600' }}
          />
          <YAxis 
            stroke="#94A3B8" 
            style={{ fontSize: '0.875rem', fontWeight: '600' }}
            domain={[0, 'auto']}
          />
          <Tooltip 
            contentStyle={{
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '8px',
              color: '#F1F5F9',
              fontSize: '0.875rem'
            }}
            formatter={(value) => value.toFixed(2)}
          />
          <Legend 
            wrapperStyle={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#94A3B8'
            }}
          />
          <Bar dataKey="xGF/60" fill="#10B981" radius={[8, 8, 0, 0]} />
          <Bar dataKey="xGA/60" fill="#EF4444" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      
      <style>{`
        @media (max-width: 768px) {
          .recharts-wrapper {
            font-size: 0.75rem !important;
          }
        }
      `}</style>
    </div>
  );
}

