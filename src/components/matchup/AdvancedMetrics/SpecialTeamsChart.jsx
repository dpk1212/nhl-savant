/**
 * Special Teams Breakdown Chart
 * Shows PP and PK efficiency with league context
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function SpecialTeamsChart({ awayTeam, homeTeam, awayPP, awayPK, homePP, homePK }) {
  if (!awayPP || !awayPK || !homePP || !homePK) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        color: '#64748B',
        fontSize: '0.875rem'
      }}>
        Special teams data not available
      </div>
    );
  }

  const awayPPPct = (awayPP.percentage || 0) * 100;
  const awayPKPct = (awayPK.percentage || 0) * 100;
  const homePPPct = (homePP.percentage || 0) * 100;
  const homePKPct = (homePK.percentage || 0) * 100;

  // League averages
  const leagueAvgPP = 20.0;
  const leagueAvgPK = 80.0;

  const data = [
    {
      name: awayTeam.code,
      'Power Play %': awayPPPct,
      'Penalty Kill %': awayPKPct,
    },
    {
      name: homeTeam.code,
      'Power Play %': homePPPct,
      'Penalty Kill %': homePKPct,
    },
    {
      name: 'League Avg',
      'Power Play %': leagueAvgPP,
      'Penalty Kill %': leagueAvgPK,
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
        Special Teams Efficiency
      </h4>
      <p style={{
        fontSize: '0.875rem',
        color: '#94A3B8',
        marginBottom: '1rem',
        lineHeight: 1.5
      }}>
        Power play conversion rate and penalty kill success rate. Elite PP (25%+), Elite PK (85%+).
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
            domain={[0, 100]}
            label={{ value: 'Success %', angle: -90, position: 'insideLeft', style: { fill: '#94A3B8', fontSize: '0.875rem' } }}
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
          <Legend 
            wrapperStyle={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#94A3B8'
            }}
          />
          <Bar dataKey="Power Play %" fill="#F59E0B" radius={[8, 8, 0, 0]} />
          <Bar dataKey="Penalty Kill %" fill="#3B82F6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div style={{
        marginTop: '1rem',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0.75rem',
        fontSize: '0.8125rem',
        color: '#94A3B8'
      }}>
        <div>
          <span style={{ fontWeight: '700', color: '#F59E0B' }}>PP:</span> Goals scored per power play opportunity
        </div>
        <div>
          <span style={{ fontWeight: '700', color: '#3B82F6' }}>PK:</span> Successful penalty kills (no goals allowed)
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

