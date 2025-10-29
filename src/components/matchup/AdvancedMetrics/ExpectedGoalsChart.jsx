/**
 * Expected Goals Analysis - Scatter Plot
 * Shows team offensive power vs opponent defensive weakness
 * Quadrants indicate matchup favorability
 * NO FAKE DATA - Uses real league averages calculated from teams.csv
 */

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Label, Cell } from 'recharts';
import { useMemo } from 'react';

export default function ExpectedGoalsChart({ awayTeam, homeTeam, awayStats, homeStats, dataProcessor }) {
  if (!awayStats || !homeStats) return null;

  const awayXGF = awayStats.xGF_per60 || 0;
  const awayXGA = awayStats.xGA_per60 || 0;
  const homeXGF = homeStats.xGF_per60 || 0;
  const homeXGA = homeStats.xGA_per60 || 0;

  // Calculate REAL league averages from all teams
  const { leagueAvgXGF, leagueAvgXGA } = useMemo(() => {
    if (!dataProcessor) return { leagueAvgXGF: 2.5, leagueAvgXGA: 2.5 };
    
    try {
      const allTeams = dataProcessor.getTeamsBySituation('5on5');
      if (!allTeams || allTeams.length === 0) return { leagueAvgXGF: 2.5, leagueAvgXGA: 2.5 };
      
      const avgXGF = allTeams.reduce((sum, t) => sum + (t.xGF_per60 || 0), 0) / allTeams.length;
      const avgXGA = allTeams.reduce((sum, t) => sum + (t.xGA_per60 || 0), 0) / allTeams.length;
      
      return { 
        leagueAvgXGF: parseFloat(avgXGF.toFixed(2)), 
        leagueAvgXGA: parseFloat(avgXGA.toFixed(2))
      };
    } catch (error) {
      console.warn('Could not calculate league averages:', error);
      return { leagueAvgXGF: 2.5, leagueAvgXGA: 2.5 };
    }
  }, [dataProcessor]);

  // Prepare data for scatter plot
  // X-axis: Team's offensive power (xGF/60)
  // Y-axis: Opponent's defensive weakness (xGA/60)
  const scatterData = [
    {
      name: `${awayTeam.code} Matchup`,
      x: awayXGF, // Away team's offense
      y: homeXGA, // Home team's defense (what away faces)
      team: awayTeam.code,
      color: '#3B82F6'
    },
    {
      name: `${homeTeam.code} Matchup`,
      x: homeXGF, // Home team's offense
      y: awayXGA, // Away team's defense (what home faces)
      team: homeTeam.code,
      color: '#10B981'
    }
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          borderRadius: '8px',
          padding: '1rem',
          color: '#F1F5F9',
          fontSize: '0.875rem'
        }}>
          <div style={{ fontWeight: '700', marginBottom: '0.5rem', color: data.color }}>
            {data.team}
          </div>
          <div>Offense: {data.x.toFixed(2)} xGF/60</div>
          <div>Opp Defense: {data.y.toFixed(2)} xGA/60</div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#94A3B8' }}>
            {data.x > leagueAvgXGF && data.y > leagueAvgXGA && '✅ Elite Matchup'}
            {data.x > leagueAvgXGF && data.y <= leagueAvgXGA && '⚠️ Tough Defense'}
            {data.x <= leagueAvgXGF && data.y > leagueAvgXGA && '🎯 Soft Defense'}
            {data.x <= leagueAvgXGF && data.y <= leagueAvgXGA && '⚔️ Defensive Battle'}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <h4 style={{
        fontSize: window.innerWidth < 768 ? '0.875rem' : '1rem',
        fontWeight: '700',
        color: '#F1F5F9',
        marginBottom: '0.75rem'
      }}>
        Offensive Power vs Defensive Weakness
      </h4>
      <p style={{
        fontSize: window.innerWidth < 768 ? '0.8125rem' : '0.875rem',
        color: '#94A3B8',
        marginBottom: '1rem',
        lineHeight: 1.5
      }}>
        Scatter plot showing each team's offense against opponent's defense. Top-right = elite matchup, bottom-left = tough battle.
      </p>
      
      {/* Data Source Label */}
      <div style={{
        fontSize: '0.75rem',
        color: '#64748B',
        marginBottom: '0.75rem',
        fontStyle: 'italic'
      }}>
        📊 Source: teams.csv 5v5 data (League avg: xGF={leagueAvgXGF}, xGA={leagueAvgXGA})
      </div>
      
      <ResponsiveContainer width="100%" height={window.innerWidth < 768 ? 200 : 350}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
          {/* Quadrant backgrounds */}
          <defs>
            <pattern id="eliteMatchup" patternUnits="userSpaceOnUse" width="10" height="10">
              <rect width="10" height="10" fill="rgba(16, 185, 129, 0.05)" />
            </pattern>
            <pattern id="toughDefense" patternUnits="userSpaceOnUse" width="10" height="10">
              <rect width="10" height="10" fill="rgba(239, 68, 68, 0.05)" />
            </pattern>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
          
          {/* League Average Reference Lines */}
          <ReferenceLine 
            x={leagueAvgXGF} 
            stroke="#64748B" 
            strokeDasharray="5 5"
            strokeWidth={2}
          >
            <Label 
              value="League Avg Offense" 
              position="top" 
              fill="#64748B"
              style={{ fontSize: '0.75rem', fontWeight: '600' }}
            />
          </ReferenceLine>
          
          <ReferenceLine 
            y={leagueAvgXGA} 
            stroke="#64748B" 
            strokeDasharray="5 5"
            strokeWidth={2}
          >
            <Label 
              value="League Avg Defense" 
              position="right" 
              fill="#64748B"
              style={{ fontSize: '0.75rem', fontWeight: '600' }}
              angle={-90}
            />
          </ReferenceLine>

          <XAxis 
            type="number"
            dataKey="x"
            domain={[1.8, 3.2]}
            stroke="#94A3B8"
            style={{ fontSize: '0.875rem', fontWeight: '600' }}
            label={{ 
              value: 'Offensive Power (xGF/60) →', 
              position: 'bottom', 
              fill: '#94A3B8',
              style: { fontSize: '0.875rem', fontWeight: '700' }
            }}
          />
          
          <YAxis 
            type="number"
            dataKey="y"
            domain={[1.8, 3.2]}
            stroke="#94A3B8"
            style={{ fontSize: '0.875rem', fontWeight: '600' }}
            label={{ 
              value: 'Opponent Defensive Weakness (xGA/60) ↑', 
              position: 'left', 
              angle: -90, 
              fill: '#94A3B8',
              style: { fontSize: '0.875rem', fontWeight: '700', textAnchor: 'middle' }
            }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Scatter 
            data={scatterData} 
            fill="#8884d8"
          >
            {scatterData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
                stroke={entry.color}
                strokeWidth={2}
                r={10}
              />
            ))}
          </Scatter>

          {/* Quadrant Labels */}
          <text x="85%" y="15%" fill="#10B981" fontSize="0.75rem" fontWeight="700" textAnchor="middle">
            Elite Matchup
          </text>
          <text x="15%" y="15%" fill="#EF4444" fontSize="0.75rem" fontWeight="700" textAnchor="middle">
            Tough Defense
          </text>
          <text x="85%" y="95%" fill="#F59E0B" fontSize="0.75rem" fontWeight="700" textAnchor="middle">
            Soft Defense
          </text>
          <text x="15%" y="95%" fill="#64748B" fontSize="0.75rem" fontWeight="700" textAnchor="middle">
            Defensive Battle
          </text>
        </ScatterChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '2rem',
        marginTop: '1rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3B82F6' }} />
          <span style={{ fontSize: '0.875rem', color: '#94A3B8', fontWeight: '600' }}>{awayTeam.code}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981' }} />
          <span style={{ fontSize: '0.875rem', color: '#94A3B8', fontWeight: '600' }}>{homeTeam.code}</span>
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
