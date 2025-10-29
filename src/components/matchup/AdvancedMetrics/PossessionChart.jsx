/**
 * Possession & Pace Chart
 * RADAR CHART: Multi-dimensional team profile visualization
 * Shows Corsi%, Fenwick%, Shot attempts/60, Scoring chance control
 */

import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function PossessionChart({ awayTeam, homeTeam, awayStats, homeStats }) {
  if (!awayStats || !homeStats) return null;

  // FIX: Multiply by 100 - CSV stores as decimal (0.5) not percentage (50)
  const awayCorsi = (awayStats.corsiPercentage || 0.50) * 100;
  const homeCorsi = (homeStats.corsiPercentage || 0.50) * 100;
  const awayFenwick = (awayStats.fenwickPercentage || 0.50) * 100;
  const homeFenwick = (homeStats.fenwickPercentage || 0.50) * 100;
  
  // Shot attempts per 60
  const awayCorsiPer60 = awayStats.corsi_per60 || 0;
  const homeCorsiPer60 = homeStats.corsi_per60 || 0;
  
  // Normalize shot attempts to 0-100 scale for radar (league range ~50-70)
  const normalizeShots = (value) => Math.min(100, Math.max(0, (value - 40) * 3.33));

  // RADAR DATA - 4 dimensions
  const data = [
    {
      metric: 'Corsi %',
      [awayTeam.code]: awayCorsi,
      [homeTeam.code]: homeCorsi,
      fullMark: 100
    },
    {
      metric: 'Fenwick %',
      [awayTeam.code]: awayFenwick,
      [homeTeam.code]: homeFenwick,
      fullMark: 100
    },
    {
      metric: 'Shot Attempts/60',
      [awayTeam.code]: normalizeShots(awayCorsiPer60),
      [homeTeam.code]: normalizeShots(homeCorsiPer60),
      fullMark: 100
    },
    {
      metric: 'Puck Control',
      [awayTeam.code]: (awayCorsi + awayFenwick) / 2, // Average of both
      [homeTeam.code]: (homeCorsi + homeFenwick) / 2,
      fullMark: 100
    },
  ];

  return (
    <div>
      <h4 style={{
        fontSize: '1rem',
        fontWeight: '700',
        color: '#F1F5F9',
        marginBottom: '0.75rem'
      }}>
        Possession & Control Profile
      </h4>
      <p style={{
        fontSize: '0.875rem',
        color: '#94A3B8',
        marginBottom: '1rem',
        lineHeight: 1.5
      }}>
        Multi-dimensional view of puck possession. Larger coverage = better territorial control. 50%+ in Corsi/Fenwick = controlling play.
      </p>
      
      <ResponsiveContainer width="100%" height={320}>
        <RadarChart data={data} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
          <PolarGrid stroke="rgba(148, 163, 184, 0.2)" />
          <PolarAngleAxis 
            dataKey="metric" 
            stroke="#94A3B8"
            style={{ fontSize: '0.75rem', fontWeight: '600' }}
          />
          <PolarRadiusAxis 
            angle={90}
            domain={[0, 100]}
            stroke="#94A3B8"
            style={{ fontSize: '0.75rem' }}
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
              // Show actual values, not normalized
              const metric = props.payload.metric;
              if (metric === 'Shot Attempts/60') {
                const actual = name === awayTeam.code ? awayCorsiPer60 : homeCorsiPer60;
                return actual.toFixed(1);
              }
              return value.toFixed(1) + (metric.includes('%') ? '%' : '');
            }}
          />
          <Legend 
            wrapperStyle={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#94A3B8'
            }}
          />
          <Radar
            name={awayTeam.code}
            dataKey={awayTeam.code}
            stroke="#3B82F6"
            fill="#3B82F6"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Radar
            name={homeTeam.code}
            dataKey={homeTeam.code}
            stroke="#10B981"
            fill="#10B981"
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>

      <div style={{
        marginTop: '1rem',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem'
      }}>
        <div>
          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '8px',
            padding: '0.75rem',
            marginBottom: '0.5rem'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94A3B8', marginBottom: '0.25rem' }}>
              {awayTeam.code}
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#3B82F6' }}>
              Corsi: {awayCorsi.toFixed(1)}%
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#3B82F6' }}>
              Fenwick: {awayFenwick.toFixed(1)}%
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#3B82F6' }}>
              Shots/60: {awayCorsiPer60.toFixed(1)}
            </div>
          </div>
        </div>
        <div>
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '8px',
            padding: '0.75rem',
            marginBottom: '0.5rem'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94A3B8', marginBottom: '0.25rem' }}>
              {homeTeam.code}
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#10B981' }}>
              Corsi: {homeCorsi.toFixed(1)}%
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#10B981' }}>
              Fenwick: {homeFenwick.toFixed(1)}%
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#10B981' }}>
              Shots/60: {homeCorsiPer60.toFixed(1)}
            </div>
          </div>
        </div>
      </div>

      <div style={{
        marginTop: '0.75rem',
        fontSize: '0.8125rem',
        color: '#64748B',
        lineHeight: 1.5
      }}>
        <strong style={{ color: '#94A3B8' }}>Corsi:</strong> All shot attempts (shots + blocks + misses)
        <br />
        <strong style={{ color: '#94A3B8' }}>Fenwick:</strong> Unblocked shot attempts (shots + misses)
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
