/**
 * Goalie Deep Dive Chart
 * Shows GSAX and save % comparison
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

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
        GSAX (Goals Saved Above Expected) measures how many goals a goalie prevents vs average. Elite: +10 GSAX, Strong: +5 GSAX.
      </p>
      
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
          <ReferenceLine yAxisId="left" y={0} stroke="rgba(148, 163, 184, 0.3)" strokeDasharray="3 3" />
          <Bar yAxisId="left" dataKey="GSAX" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
          <Bar yAxisId="right" dataKey="Save %" fill="#10B981" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div style={{
        marginTop: '1rem',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem'
      }}>
        <div style={{
          background: 'rgba(139, 92, 246, 0.1)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '8px',
          padding: '0.75rem'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94A3B8', marginBottom: '0.25rem' }}>
            {awayGoalie.name || awayTeam.code}
          </div>
          <div style={{ fontSize: '1rem', fontWeight: '800', color: '#8B5CF6' }}>
            {awayGSAX > 0 ? '+' : ''}{awayGSAX.toFixed(1)} GSAX
          </div>
          <div style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#10B981' }}>
            {awaySV.toFixed(2)}% SV
          </div>
        </div>
        <div style={{
          background: 'rgba(139, 92, 246, 0.1)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '8px',
          padding: '0.75rem'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94A3B8', marginBottom: '0.25rem' }}>
            {homeGoalie.name || homeTeam.code}
          </div>
          <div style={{ fontSize: '1rem', fontWeight: '800', color: '#8B5CF6' }}>
            {homeGSAX > 0 ? '+' : ''}{homeGSAX.toFixed(1)} GSAX
          </div>
          <div style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#10B981' }}>
            {homeSV.toFixed(2)}% SV
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

