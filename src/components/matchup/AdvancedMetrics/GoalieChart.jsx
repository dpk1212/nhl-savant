/**
 * Goalie Deep Dive Chart
 * DUAL-AXIS: GSAX as bars (left) + Save% as line (right)
 * Better visualization for two different scales
 */

import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function GoalieChart({ awayTeam, homeTeam, awayGoalie, homeGoalie }) {
  if (!awayGoalie || !homeGoalie || awayGoalie.isDefault || homeGoalie.isDefault) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        color: '#64748B',
        fontSize: '0.875rem'
      }}>
        Starting goalies not confirmed
      </div>
    );
  }

  const awayGSAX = awayGoalie.gsax || 0;
  const homeGSAX = homeGoalie.gsax || 0;
  const awaySV = (awayGoalie.savePct || 0.905) * 100;
  const homeSV = (homeGoalie.savePct || 0.905) * 100;

  const data = [
    {
      name: awayGoalie.name || awayTeam.code,
      'GSAX': awayGSAX,
      'Save %': awaySV,
    },
    {
      name: homeGoalie.name || homeTeam.code,
      'GSAX': homeGSAX,
      'Save %': homeSV,
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
        Goaltending Matchup
      </h4>
      <p style={{
        fontSize: '0.875rem',
        color: '#94A3B8',
        marginBottom: '1rem',
        lineHeight: 1.5
      }}>
        GSAX (bars) shows goals prevented vs average. Save% (line) shows overall performance. Elite: GSAX +10, Save% 92+.
      </p>
      
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
          <XAxis 
            dataKey="name" 
            stroke="#94A3B8" 
            style={{ fontSize: '0.75rem', fontWeight: '600' }}
          />
          <YAxis 
            yAxisId="left"
            stroke="#94A3B8" 
            style={{ fontSize: '0.875rem', fontWeight: '600' }}
            label={{ value: 'GSAX', angle: -90, position: 'insideLeft', style: { fill: '#94A3B8', fontSize: '0.875rem' } }}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            stroke="#94A3B8" 
            style={{ fontSize: '0.875rem', fontWeight: '600' }}
            domain={[88, 96]}
            label={{ value: 'Save %', angle: 90, position: 'insideRight', style: { fill: '#94A3B8', fontSize: '0.875rem' } }}
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
              if (name === 'Save %') return `${value.toFixed(2)}%`;
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
          {/* Reference lines for context */}
          <ReferenceLine yAxisId="left" y={0} stroke="#94A3B8" strokeDasharray="3 3" />
          <ReferenceLine yAxisId="right" y={91} stroke="#64748B" strokeDasharray="3 3" label={{ value: 'Avg', fill: '#64748B', fontSize: 10 }} />
          {/* GSAX as bars */}
          <Bar
            yAxisId="left"
            dataKey="GSAX"
            fill="#3B82F6"
            radius={[8, 8, 0, 0]}
          />
          {/* Save% as line */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="Save %"
            stroke="#10B981"
            strokeWidth={3}
            dot={{ fill: '#10B981', r: 6 }}
            activeDot={{ r: 8 }}
          />
        </ComposedChart>
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
            {awayGoalie.name || awayTeam.code}
          </div>
          <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#3B82F6' }}>
            GSAX: {awayGSAX > 0 ? '+' : ''}{awayGSAX.toFixed(1)}
          </div>
          <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#10B981' }}>
            Save%: {awaySV.toFixed(2)}%
          </div>
        </div>
        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '8px',
          padding: '0.75rem'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94A3B8', marginBottom: '0.25rem' }}>
            {homeGoalie.name || homeTeam.code}
          </div>
          <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#3B82F6' }}>
            GSAX: {homeGSAX > 0 ? '+' : ''}{homeGSAX.toFixed(1)}
          </div>
          <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#10B981' }}>
            Save%: {homeSV.toFixed(2)}%
          </div>
        </div>
      </div>

      <div style={{
        marginTop: '0.75rem',
        fontSize: '0.8125rem',
        color: '#64748B',
        lineHeight: 1.5
      }}>
        <strong style={{ color: '#94A3B8' }}>GSAX:</strong> Goals Saved Above Expected (positive is better)
        <br />
        <strong style={{ color: '#94A3B8' }}>Save%:</strong> League average ~91%, Elite 92%+
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
