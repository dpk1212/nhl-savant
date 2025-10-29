/**
 * Shot Quality Analysis Chart
 * Shows shot attempts breakdown by danger level
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ShotQualityChart({ awayTeam, homeTeam, awayStats, homeStats }) {
  if (!awayStats || !homeStats) return null;

  const awayHD = awayStats.highDanger_xGF_per60 || 0;
  const homeHD = homeStats.highDanger_xGF_per60 || 0;
  const awayTotal = awayStats.xGF_per60 || 0;
  const homeTotal = homeStats.xGF_per60 || 0;

  // Calculate HD percentage
  const awayHDPct = awayTotal > 0 ? (awayHD / awayTotal) * 100 : 0;
  const homeHDPct = homeTotal > 0 ? (homeHD / homeTotal) * 100 : 0;

  const data = [
    {
      name: awayTeam.code,
      'High Danger': awayHD,
      'Other': awayTotal - awayHD,
      'HD %': awayHDPct
    },
    {
      name: homeTeam.code,
      'High Danger': homeHD,
      'Other': homeTotal - homeHD,
      'HD %': homeHDPct
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
        Shot Quality Breakdown
      </h4>
      <p style={{
        fontSize: '0.875rem',
        color: '#94A3B8',
        marginBottom: '1rem',
        lineHeight: 1.5
      }}>
        High danger chances (slot area) vs other shots. Teams that generate more high danger shots create better scoring opportunities.
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
            label={{ value: 'xG/60', angle: -90, position: 'insideLeft', style: { fill: '#94A3B8', fontSize: '0.875rem' } }}
          />
          <Tooltip 
            contentStyle={{
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '8px',
              color: '#F1F5F9',
              fontSize: '0.875rem'
            }}
            formatter={(value, name) => {
              if (name === 'HD %') return `${value.toFixed(1)}%`;
              return value.toFixed(2);
            }}
          />
          <Legend 
            wrapperStyle={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#94A3B8'
            }}
          />
          <Bar dataKey="High Danger" stackId="a" fill="#EF4444" radius={[0, 0, 0, 0]} />
          <Bar dataKey="Other" stackId="a" fill="#64748B" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div style={{
        marginTop: '1rem',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem'
      }}>
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          padding: '0.75rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94A3B8', marginBottom: '0.25rem' }}>
            {awayTeam.code} HD%
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#EF4444' }}>
            {awayHDPct.toFixed(1)}%
          </div>
        </div>
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          padding: '0.75rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94A3B8', marginBottom: '0.25rem' }}>
            {homeTeam.code} HD%
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#EF4444' }}>
            {homeHDPct.toFixed(1)}%
          </div>
        </div>
      </div>
      
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

