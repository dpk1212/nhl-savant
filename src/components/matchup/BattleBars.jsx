/**
 * Battle Bars - Offense vs Defense Matchup Visualization
 * Shows horizontal bars comparing offensive and defensive stats
 */

import { useState } from 'react';
import Tooltip from './Tooltip';

export default function BattleBars({ awayTeam, homeTeam, awayStats, homeStats, awayStats5v5, homeStats5v5, awayPP, homePP, awayPK, homePK }) {
  const [activeView, setActiveView] = useState('5v5'); // '5v5', 'pp', 'overall'

  if (!awayStats || !homeStats) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>Stats not available</div>;
  }

  const getBattleData = () => {
    if (activeView === 'pp') {
      return [
        {
          label: 'Power Play Goals/60',
          awayValue: awayPP?.goalsFor || 0,
          homeValue: homePP?.goalsFor || 0,
          format: 'decimal'
        },
        {
          label: 'PK Goals Against/60',
          awayValue: awayPK?.goalsAgainst || 0,
          homeValue: homePK?.goalsAgainst || 0,
          format: 'decimal',
          inverse: true
        }
      ];
    } else if (activeView === '5v5') {
      // Calculate per-60 rates from totals
      const awayIceTime60 = (awayStats5v5?.iceTime || 1) / 60;
      const homeIceTime60 = (homeStats5v5?.iceTime || 1) / 60;
      
      return [
        {
          label: 'xGoals For/60',
          awayValue: (awayStats5v5?.xGoalsFor || 0) / awayIceTime60,
          homeValue: (homeStats5v5?.xGoalsFor || 0) / homeIceTime60,
          format: 'decimal',
          tooltip: 'Expected Goals For per 60 minutes: Predicted goals based on shot quality and location (5v5)'
        },
        {
          label: 'xGoals Against/60',
          awayValue: (awayStats5v5?.xGoalsAgainst || 0) / awayIceTime60,
          homeValue: (homeStats5v5?.xGoalsAgainst || 0) / homeIceTime60,
          format: 'decimal',
          inverse: true,
          tooltip: 'Expected Goals Against per 60 minutes: Predicted goals allowed based on opponent shot quality (5v5, lower is better)'
        },
        {
          label: 'High Danger Shots For/60',
          awayValue: (awayStats5v5?.highDangerShotsFor || 0) / awayIceTime60,
          homeValue: (homeStats5v5?.highDangerShotsFor || 0) / homeIceTime60,
          format: 'decimal',
          tooltip: 'High Danger Shots For per 60 minutes: Shots from the slot and crease area with high scoring probability (5v5)'
        }
      ];
    } else {
      return [
        {
          label: 'Goals For/60',
          awayValue: awayStats?.goalsFor || 0,
          homeValue: homeStats?.goalsFor || 0,
          format: 'decimal'
        },
        {
          label: 'Goals Against/60',
          awayValue: awayStats?.goalsAgainst || 0,
          homeValue: homeStats?.goalsAgainst || 0,
          format: 'decimal',
          inverse: true
        },
        {
          label: 'Corsi For %',
          awayValue: awayStats?.corsiPct || 50,
          homeValue: homeStats?.corsiPct || 50,
          format: 'percent'
        }
      ];
    }
  };

  const battleData = getBattleData();

  const renderBar = (stat) => {
    const total = stat.awayValue + stat.homeValue;
    const awayPct = total > 0 ? (stat.awayValue / total) * 100 : 50;
    const homePct = 100 - awayPct;

    const awayAdvantage = stat.inverse ? stat.awayValue < stat.homeValue : stat.awayValue > stat.homeValue;
    const homeAdvantage = stat.inverse ? stat.homeValue < stat.awayValue : stat.homeValue > stat.awayValue;

    return (
      <div key={stat.label} style={{ marginBottom: '1.5rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.5rem'
        }}>
          <div style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            color: awayAdvantage ? '#10B981' : '#94A3B8'
          }}>
            {stat.format === 'percent' ? `${stat.awayValue.toFixed(1)}%` : stat.awayValue.toFixed(2)}
          </div>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: '700',
            color: '#64748B',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {stat.tooltip ? (
              <Tooltip text={stat.tooltip}>
                {stat.label}
              </Tooltip>
            ) : stat.label}
          </div>
          <div style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            color: homeAdvantage ? '#10B981' : '#94A3B8'
          }}>
            {stat.format === 'percent' ? `${stat.homeValue.toFixed(1)}%` : stat.homeValue.toFixed(2)}
          </div>
        </div>

        <div style={{
          position: 'relative',
          height: '8px',
          background: 'rgba(15, 23, 42, 0.5)',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: `${awayPct}%`,
            background: awayAdvantage
              ? 'linear-gradient(90deg, #10B981 0%, #059669 100%)'
              : 'linear-gradient(90deg, #64748B 0%, #475569 100%)',
            transition: 'width 0.3s ease'
          }} />
          <div style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: `${homePct}%`,
            background: homeAdvantage
              ? 'linear-gradient(270deg, #10B981 0%, #059669 100%)'
              : 'linear-gradient(270deg, #64748B 0%, #475569 100%)',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>
    );
  };

  return (
    <div className="elevated-card" style={{
      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
      backdropFilter: 'blur(20px) saturate(180%)',
      border: '1px solid rgba(148, 163, 184, 0.1)',
      borderRadius: '16px',
      padding: '2rem',
      marginBottom: '2rem',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#F1F5F9',
            marginBottom: '0.25rem'
          }}>
            Battle Bars
          </h2>
          <p style={{
            fontSize: '0.875rem',
            color: '#94A3B8'
          }}>
            {awayTeam.name} vs {homeTeam.name}
          </p>
        </div>

        <div style={{
          display: 'flex',
          gap: '0.5rem',
          background: 'rgba(15, 23, 42, 0.5)',
          padding: '0.25rem',
          borderRadius: '8px'
        }}>
          {['5v5', 'pp', 'overall'].map(view => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.75rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                border: 'none',
                borderRadius: '6px',
                background: activeView === view
                  ? 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
                  : 'transparent',
                color: activeView === view ? '#F1F5F9' : '#94A3B8',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {view === '5v5' ? '5v5' : view === 'pp' ? 'Special Teams' : 'Overall'}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        padding: '1rem',
        background: 'rgba(15, 23, 42, 0.3)',
        borderRadius: '8px'
      }}>
        <div style={{
          fontSize: '1rem',
          fontWeight: '700',
          color: '#F1F5F9'
        }}>
          {awayTeam.code}
        </div>
        <div style={{
          fontSize: '1rem',
          fontWeight: '700',
          color: '#F1F5F9'
        }}>
          {homeTeam.code}
        </div>
      </div>

      {battleData.map(stat => renderBar(stat))}
    </div>
  );
}
