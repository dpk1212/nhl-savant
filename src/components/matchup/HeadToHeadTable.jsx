/**
 * Head-to-Head Comparison Table - Premium side-by-side stat comparison
 * Shows rank, value, and visual advantage indicators
 */

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { calculatePercentileRank } from '../../utils/matchupCalculations';

export default function HeadToHeadTable({ awayTeam, homeTeam, matchupData, dataProcessor }) {
  if (!matchupData || !dataProcessor) return null;

  const awayStats5v5 = matchupData.away.stats5v5;
  const homeStats5v5 = matchupData.home.stats5v5;

  if (!awayStats5v5 || !homeStats5v5) return null;

  // Calculate per-60 rates
  const awayIceTime60 = (awayStats5v5.iceTime || 1) / 60;
  const homeIceTime60 = (homeStats5v5.iceTime || 1) / 60;

  // Define stats to compare
  const statsToCompare = [
    {
      label: 'xGoals For/60',
      field: 'xGoalsFor',
      awayValue: (awayStats5v5.xGoalsFor || 0) / awayIceTime60,
      homeValue: (homeStats5v5.xGoalsFor || 0) / homeIceTime60,
      format: (v) => v.toFixed(2),
      higherIsBetter: true,
      description: 'Predicted goals based on shot quality'
    },
    {
      label: 'xGoals Against/60',
      field: 'xGoalsAgainst',
      awayValue: (awayStats5v5.xGoalsAgainst || 0) / awayIceTime60,
      homeValue: (homeStats5v5.xGoalsAgainst || 0) / homeIceTime60,
      format: (v) => v.toFixed(2),
      higherIsBetter: false,
      description: 'Predicted goals allowed'
    },
    {
      label: 'High Danger Shots/60',
      field: 'highDangerShotsFor',
      awayValue: (awayStats5v5.highDangerShotsFor || 0) / awayIceTime60,
      homeValue: (homeStats5v5.highDangerShotsFor || 0) / homeIceTime60,
      format: (v) => v.toFixed(2),
      higherIsBetter: true,
      description: 'Shots from high-danger areas'
    },
    {
      label: 'Corsi For %',
      field: 'corsiPercentage',
      awayValue: (awayStats5v5.corsiPercentage || 0.5) * 100,
      homeValue: (homeStats5v5.corsiPercentage || 0.5) * 100,
      format: (v) => `${v.toFixed(1)}%`,
      higherIsBetter: true,
      description: 'Shot attempt share'
    }
  ];

  const getAdvantageIndicator = (stat) => {
    const diff = stat.higherIsBetter 
      ? stat.awayValue - stat.homeValue
      : stat.homeValue - stat.awayValue;
    
    if (Math.abs(diff) < 0.5) {
      return { icon: Minus, color: '#64748B', text: 'Even', team: null };
    }
    
    const advantageTeam = stat.higherIsBetter
      ? (stat.awayValue > stat.homeValue ? awayTeam.name : homeTeam.name)
      : (stat.awayValue < stat.homeValue ? awayTeam.name : homeTeam.name);
    
    const pctDiff = Math.abs((diff / Math.max(stat.awayValue, stat.homeValue)) * 100);
    
    return {
      icon: diff > 0 ? TrendingUp : (diff < 0 ? TrendingDown : Minus),
      color: pctDiff > 10 ? '#10B981' : pctDiff > 5 ? '#3B82F6' : '#64748B',
      text: `+${pctDiff.toFixed(0)}%`,
      team: advantageTeam
    };
  };

  return (
    <div className="elevated-card" style={{
      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
      backdropFilter: 'blur(20px) saturate(180%)',
      border: '1px solid rgba(148, 163, 184, 0.1)',
      borderRadius: '20px',
      padding: '2rem',
      marginBottom: '2rem',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      overflow: 'hidden'
    }}>
      <h2 style={{
        fontSize: '1.75rem',
        fontWeight: '700',
        color: '#F1F5F9',
        marginBottom: '0.5rem',
        background: 'linear-gradient(135deg, #F1F5F9 0%, #94A3B8 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        Head-to-Head Breakdown
      </h2>
      <p style={{
        fontSize: '0.875rem',
        color: '#94A3B8',
        marginBottom: '2rem'
      }}>
        5v5 statistical comparison with league percentile ranks
      </p>

      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: '0 0.5rem'
        }}>
          <thead>
            <tr>
              <th style={headerStyle}>{awayTeam.code}</th>
              <th style={{...headerStyle, textAlign: 'center'}}>Metric</th>
              <th style={{...headerStyle, textAlign: 'center'}}>Advantage</th>
              <th style={headerStyle}>{homeTeam.code}</th>
            </tr>
          </thead>
          <tbody>
            {statsToCompare.map((stat, index) => {
              const advantage = getAdvantageIndicator(stat);
              const AdvantageIcon = advantage.icon;
              
              const awayRank = calculatePercentileRank(dataProcessor, awayTeam.code, stat.field, '5on5', stat.higherIsBetter);
              const homeRank = calculatePercentileRank(dataProcessor, homeTeam.code, stat.field, '5on5', stat.higherIsBetter);
              
              const awayIsAdvantage = stat.higherIsBetter 
                ? stat.awayValue > stat.homeValue
                : stat.awayValue < stat.homeValue;
              const homeIsAdvantage = stat.higherIsBetter
                ? stat.homeValue > stat.awayValue
                : stat.homeValue < stat.awayValue;

              return (
                <tr key={index} style={{
                  animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`
                }}>
                  {/* Away Value */}
                  <td style={{
                    ...cellStyle,
                    background: awayIsAdvantage ? 'rgba(16, 185, 129, 0.1)' : 'rgba(15, 23, 42, 0.3)',
                    borderLeft: awayIsAdvantage ? '3px solid #10B981' : '3px solid transparent'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div>
                        <div style={{
                          fontSize: '1.125rem',
                          fontWeight: '700',
                          color: awayIsAdvantage ? '#10B981' : '#F1F5F9'
                        }}>
                          {stat.format(stat.awayValue)}
                        </div>
                        {awayRank && (
                          <div style={{
                            fontSize: '0.75rem',
                            color: '#64748B'
                          }}>
                            Rank #{awayRank.rank} ({awayRank.tier})
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Metric Label */}
                  <td style={{
                    ...cellStyle,
                    textAlign: 'center',
                    fontWeight: '600',
                    color: '#94A3B8'
                  }}>
                    <div>{stat.label}</div>
                    <div style={{
                      fontSize: '0.7rem',
                      color: '#64748B',
                      fontWeight: '400',
                      marginTop: '0.25rem'
                    }}>
                      {stat.description}
                    </div>
                  </td>

                  {/* Advantage Indicator */}
                  <td style={{
                    ...cellStyle,
                    textAlign: 'center'
                  }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      background: `${advantage.color}20`,
                      borderRadius: '8px',
                      border: `1px solid ${advantage.color}40`
                    }}>
                      <AdvantageIcon size={16} color={advantage.color} />
                      <span style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: advantage.color
                      }}>
                        {advantage.text}
                      </span>
                    </div>
                    {advantage.team && (
                      <div style={{
                        fontSize: '0.7rem',
                        color: '#64748B',
                        marginTop: '0.25rem'
                      }}>
                        {advantage.team}
                      </div>
                    )}
                  </td>

                  {/* Home Value */}
                  <td style={{
                    ...cellStyle,
                    background: homeIsAdvantage ? 'rgba(16, 185, 129, 0.1)' : 'rgba(15, 23, 42, 0.3)',
                    borderRight: homeIsAdvantage ? '3px solid #10B981' : '3px solid transparent'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'flex-end' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{
                          fontSize: '1.125rem',
                          fontWeight: '700',
                          color: homeIsAdvantage ? '#10B981' : '#F1F5F9'
                        }}>
                          {stat.format(stat.homeValue)}
                        </div>
                        {homeRank && (
                          <div style={{
                            fontSize: '0.75rem',
                            color: '#64748B'
                          }}>
                            Rank #{homeRank.rank} ({homeRank.tier})
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

const headerStyle = {
  padding: '0.75rem 1rem',
  fontSize: '0.875rem',
  fontWeight: '700',
  color: '#94A3B8',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  textAlign: 'left'
};

const cellStyle = {
  padding: '1rem',
  borderRadius: '8px',
  transition: 'all 0.2s ease'
};

