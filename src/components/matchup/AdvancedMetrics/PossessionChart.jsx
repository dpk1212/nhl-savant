/**
 * Possession & Pace Chart
 * Side-by-side bar comparison instead of radar (better for close values)
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
  const awayFenwickPer60 = awayStats.fenwick_per60 || 0;
  const homeFenwickPer60 = homeStats.fenwick_per60 || 0;

  // Create data for grouped bar chart
  const data = [
    {
      name: 'Corsi %',
      [awayTeam.code]: awayCorsi,
      [homeTeam.code]: homeCorsi,
    },
    {
      name: 'Fenwick %',
      [awayTeam.code]: awayFenwick,
      [homeTeam.code]: homeFenwick,
    },
    {
      name: 'Corsi/60',
      [awayTeam.code]: awayCorsiPer60,
      [homeTeam.code]: homeCorsiPer60,
    },
    {
      name: 'Fenwick/60',
      [awayTeam.code]: awayFenwickPer60,
      [homeTeam.code]: homeFenwickPer60,
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
        Possession & Shot Attempts
      </h4>
      <p style={{
        fontSize: '0.875rem',
        color: '#94A3B8',
        marginBottom: '1rem',
        lineHeight: 1.5
      }}>
        Corsi (all shot attempts) and Fenwick (unblocked shot attempts) measure puck possession and offensive pressure. 50%+ = controlling play.
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
              // Format percentages vs rates
              if (name.includes('%')) {
                return `${value.toFixed(1)}%`;
              }
              return value.toFixed(1);
            }}
          />
          <Legend 
            wrapperStyle={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#94A3B8'
            }}
          />
          <Bar
            dataKey={awayTeam.code}
            fill="#3B82F6"
            radius={[8, 8, 0, 0]}
          />
          <Bar
            dataKey={homeTeam.code}
            fill="#10B981"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
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
