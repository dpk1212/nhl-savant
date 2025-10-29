/**
 * Special Teams Analysis Chart
 * HORIZONTAL BARS with percentile markers (25th, 50th, 75th, 90th)
 * Shows PP% and PK% with league context
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function SpecialTeamsChart({ awayTeam, homeTeam, awayPP, awayPK, homePP, homePK }) {
  if (!awayPP || !homePP || !awayPK || !homePK) return null;

  // Convert to percentages
  const awayPPPct = (awayPP.percentage || 0) * 100;
  const homePPPct = (homePP.percentage || 0) * 100;
  const awayPKPct = (awayPK.percentage || 0) * 100;
  const homePKPct = (homePK.percentage || 0) * 100;

  // HORIZONTAL BAR DATA
  const ppData = [
    { team: awayTeam.code, value: awayPPPct },
    { team: homeTeam.code, value: homePPPct },
  ];

  const pkData = [
    { team: awayTeam.code, value: awayPKPct },
    { team: homeTeam.code, value: homePKPct },
  ];

  return (
    <div>
      <h4 style={{
        fontSize: '1rem',
        fontWeight: '700',
        color: '#F1F5F9',
        marginBottom: '0.75rem'
      }}>
        Special Teams Efficiency
      </h4>
      <p style={{
        fontSize: '0.875rem',
        color: '#94A3B8',
        marginBottom: '1rem',
        lineHeight: 1.5
      }}>
        Power play and penalty kill success rates. Lines show league percentiles (25th, 50th, 75th, 90th).
      </p>
      
      {/* Power Play */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#F1F5F9', marginBottom: '0.5rem' }}>
          Power Play %
        </div>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart 
            data={ppData} 
            layout="vertical"
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
            <XAxis 
              type="number"
              domain={[0, 35]}
              stroke="#94A3B8" 
              style={{ fontSize: '0.875rem', fontWeight: '600' }}
            />
            <YAxis 
              type="category"
              dataKey="team"
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
              formatter={(value) => `${value.toFixed(1)}%`}
            />
            {/* Percentile markers */}
            <ReferenceLine x={15} stroke="#64748B" strokeDasharray="3 3" label={{ value: '25th', fill: '#64748B', fontSize: 10 }} />
            <ReferenceLine x={20} stroke="#94A3B8" strokeDasharray="3 3" label={{ value: '50th', fill: '#94A3B8', fontSize: 10 }} />
            <ReferenceLine x={23} stroke="#10B981" strokeDasharray="3 3" label={{ value: '75th', fill: '#10B981', fontSize: 10 }} />
            <ReferenceLine x={26} stroke="#D4AF37" strokeDasharray="3 3" label={{ value: '90th', fill: '#D4AF37', fontSize: 10 }} />
            <Bar
              dataKey="value"
              fill="#3B82F6"
              radius={[0, 8, 8, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Penalty Kill */}
      <div>
        <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#F1F5F9', marginBottom: '0.5rem' }}>
          Penalty Kill %
        </div>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart 
            data={pkData} 
            layout="vertical"
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
            <XAxis 
              type="number"
              domain={[70, 90]}
              stroke="#94A3B8" 
              style={{ fontSize: '0.875rem', fontWeight: '600' }}
            />
            <YAxis 
              type="category"
              dataKey="team"
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
              formatter={(value) => `${value.toFixed(1)}%`}
            />
            {/* Percentile markers */}
            <ReferenceLine x={76} stroke="#64748B" strokeDasharray="3 3" label={{ value: '25th', fill: '#64748B', fontSize: 10 }} />
            <ReferenceLine x={80} stroke="#94A3B8" strokeDasharray="3 3" label={{ value: '50th', fill: '#94A3B8', fontSize: 10 }} />
            <ReferenceLine x={82} stroke="#10B981" strokeDasharray="3 3" label={{ value: '75th', fill: '#10B981', fontSize: 10 }} />
            <ReferenceLine x={85} stroke="#D4AF37" strokeDasharray="3 3" label={{ value: '90th', fill: '#D4AF37', fontSize: 10 }} />
            <Bar
              dataKey="value"
              fill="#10B981"
              radius={[0, 8, 8, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Summary */}
      <div style={{
        marginTop: '1.5rem',
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
          <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#3B82F6' }}>
            PP: {awayPPPct.toFixed(1)}%
          </div>
          <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#10B981' }}>
            PK: {awayPKPct.toFixed(1)}%
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
          <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#3B82F6' }}>
            PP: {homePPPct.toFixed(1)}%
          </div>
          <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#10B981' }}>
            PK: {homePKPct.toFixed(1)}%
          </div>
        </div>
      </div>

      <div style={{
        marginTop: '0.75rem',
        fontSize: '0.8125rem',
        color: '#64748B',
        lineHeight: 1.5
      }}>
        <strong style={{ color: '#94A3B8' }}>Elite:</strong> PP &gt; 25%, PK &gt; 85%
        <br />
        <strong style={{ color: '#94A3B8' }}>League Average:</strong> PP ~20%, PK ~80%
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
