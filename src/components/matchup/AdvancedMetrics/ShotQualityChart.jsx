/**
 * Shot Quality Analysis Chart
 * STACKED BAR: Shows HD shots + Other shots = Total xG
 * Industry standard for component breakdown visualization
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ShotQualityChart({ awayTeam, homeTeam, awayStats, homeStats }) {
  if (!awayStats || !homeStats) return null;

  const awayHD = awayStats.highDanger_xGF_per60 || 0;
  const homeHD = homeStats.highDanger_xGF_per60 || 0;
  const awayTotal = awayStats.xGF_per60 || 0;
  const homeTotal = homeStats.xGF_per60 || 0;

  // Calculate other (non-HD) shots
  const awayOther = awayTotal - awayHD;
  const homeOther = homeTotal - homeHD;

  // Calculate HD percentage
  const awayHDPct = awayTotal > 0 ? (awayHD / awayTotal) * 100 : 0;
  const homeHDPct = homeTotal > 0 ? (homeHD / homeTotal) * 100 : 0;

  // STACKED BAR DATA
  const data = [
    {
      name: awayTeam.code,
      'High Danger': awayHD,
      'Other': awayOther,
      total: awayTotal,
      hdPct: awayHDPct
    },
    {
      name: homeTeam.code,
      'High Danger': homeHD,
      'Other': homeOther,
      total: homeTotal,
      hdPct: homeHDPct
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
        High danger chances (slot area) vs other shots. Stacked bars show total xG composition. Teams with higher HD% create better scoring opportunities.
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
            formatter={(value, name, props) => {
              if (name === 'High Danger' || name === 'Other') {
                const pct = props.payload.hdPct;
                return [
                  `${value.toFixed(2)} (${pct.toFixed(1)}% HD)`,
                  name
                ];
              }
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
          {/* STACKED BARS */}
          <Bar
            dataKey="High Danger"
            stackId="a"
            fill="#EF4444"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="Other"
            stackId="a"
            fill="#3B82F6"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Stats Summary */}
      <div style={{
        marginTop: '1rem',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem'
      }}>
        <div style={{
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '8px',
          padding: '0.75rem'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94A3B8', marginBottom: '0.25rem' }}>
            {awayTeam.code}
          </div>
          <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#EF4444' }}>
            HD: {awayHD.toFixed(2)} ({awayHDPct.toFixed(1)}%)
          </div>
          <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#3B82F6' }}>
            Total: {awayTotal.toFixed(2)}
          </div>
        </div>
        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '8px',
          padding: '0.75rem'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94A3B8', marginBottom: '0.25rem' }}>
            {homeTeam.code}
          </div>
          <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#EF4444' }}>
            HD: {homeHD.toFixed(2)} ({homeHDPct.toFixed(1)}%)
          </div>
          <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#10B981' }}>
            Total: {homeTotal.toFixed(2)}
          </div>
        </div>
      </div>

      <div style={{
        marginTop: '0.75rem',
        fontSize: '0.8125rem',
        color: '#64748B',
        lineHeight: 1.5
      }}>
        <strong style={{ color: '#94A3B8' }}>High Danger:</strong> Shots from the slot area (most likely to score)
        <br />
        <strong style={{ color: '#94A3B8' }}>Other:</strong> Low and medium danger shots from outside
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
