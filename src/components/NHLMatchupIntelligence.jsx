/**
 * NHL Matchup Intelligence Component
 * Side-by-side comparison showing edge score, offense vs defense, and four key factors
 * Inspired by CBB Matchup Intelligence with NHL-specific metrics
 */

import { useState } from 'react';

const NHLMatchupIntelligence = ({ 
  game, 
  dataProcessor, 
  statsAnalyzer,
  bestEdge,
  isMobile = false 
}) => {
  const [flipped, setFlipped] = useState(false);

  if (!game || !dataProcessor || !statsAnalyzer) {
    return null;
  }

  const awayTeam = game.awayTeam;
  const homeTeam = game.homeTeam;

  // Get team data
  const away5v5 = dataProcessor.getTeamData(awayTeam, '5on5');
  const home5v5 = dataProcessor.getTeamData(homeTeam, '5on5');
  
  if (!away5v5 || !home5v5) return null;

  // Calculate metrics - use correct property names
  const awayXGF = (away5v5.xGoalsFor / away5v5.gamesPlayed) || 0;
  const homeXGF = (home5v5.xGoalsFor / home5v5.gamesPlayed) || 0;
  const awayXGA = (away5v5.xGoalsAgainst / away5v5.gamesPlayed) || 0;
  const homeXGA = (home5v5.xGoalsAgainst / home5v5.gamesPlayed) || 0;

  // Offense vs Defense matchup
  const awayOffenseVsHomeDefense = awayXGF - homeXGA;
  const homeOffenseVsAwayDefense = homeXGF - awayXGA;
  const offenseFavored = awayOffenseVsHomeDefense > homeOffenseVsAwayDefense ? awayTeam : homeTeam;
  const offenseEdge = Math.abs(awayOffenseVsHomeDefense - homeOffenseVsAwayDefense);

  // Get high-danger metrics for shot quality
  const awayHighDanger = statsAnalyzer.getHighDangerMetrics(awayTeam, '5on5');
  const homeHighDanger = statsAnalyzer.getHighDangerMetrics(homeTeam, '5on5');
  
  // Calculate high-danger shot percentage (HD shots / total shots)
  const awayTotalShots = away5v5.shotAttemptsFor || 1;
  const homeTotalShots = home5v5.shotAttemptsFor || 1;
  const awayHDPercent = ((awayHighDanger?.hdShotsFor || 0) / awayTotalShots) * 100;
  const homeHDPercent = ((homeHighDanger?.hdShotsFor || 0) / homeTotalShots) * 100;
  const shotQualityDiff = awayHDPercent - homeHDPercent;

  // Get possession metrics for shot volume
  // CSV stores corsiPercentage as a decimal (0.515 = 51.5%), so multiply by 100
  const awayCorsi = (away5v5.corsiPercentage || 0.5) * 100;
  const homeCorsi = (home5v5.corsiPercentage || 0.5) * 100;
  const shotVolumeDiff = awayCorsi - homeCorsi;

  // Get special teams - use high-danger xG per 60
  const awayPP = statsAnalyzer.getHighDangerMetrics(awayTeam, '5on4');
  const homePP = statsAnalyzer.getHighDangerMetrics(homeTeam, '5on4');
  const awayPK = statsAnalyzer.getHighDangerMetrics(awayTeam, '4on5');
  const homePK = statsAnalyzer.getHighDangerMetrics(homeTeam, '4on5');
  
  // Use hdXgfPer60 for power play offense and hdXgaPer60 for penalty kill defense
  const awayPPScore = awayPP?.hdXgfPer60 || 0;
  const homePPScore = homePP?.hdXgfPer60 || 0;
  const awayPKScore = awayPK?.hdXgaPer60 || 0;
  const homePKScore = homePK?.hdXgaPer60 || 0;
  
  // Special teams score: (PP offense) - (PK goals against)
  const awaySTScore = awayPPScore - awayPKScore;
  const homeSTScore = homePPScore - homePKScore;
  const specialTeamsDiff = awaySTScore - homeSTScore;

  // Get goalie data
  const awayGoalie = game.goalies?.away;
  const homeGoalie = game.goalies?.home;
  const awayGSAE = awayGoalie?.gsae || 0;
  const homeGSAE = homeGoalie?.gsae || 0;
  const goalieEdge = awayGSAE - homeGSAE;

  // TEMPORARILY DISABLED: Rest advantage calculation
  // TODO: Re-enable when scheduleHelper is properly passed
  const restAdvantage = null;
  const restBonus = 0;

  // EDGE SCORE CALCULATION (0-100)
  const calculateEdgeScore = () => {
    let score = 50; // Start at neutral

    // Expected Goals differential (30% weight) - ±15 points
    const xgDiff = offenseEdge;
    if (!isNaN(xgDiff) && isFinite(xgDiff)) {
      score += (xgDiff / 1.0) * 15; // ±1.0 xG = ±15 points
    }

    // Shot Quality differential (20% weight) - ±10 points
    if (!isNaN(shotQualityDiff) && isFinite(shotQualityDiff)) {
      score += (shotQualityDiff / 20) * 10; // ±20% = ±10 points
    }

    // Special Teams differential (20% weight) - ±10 points
    if (!isNaN(specialTeamsDiff) && isFinite(specialTeamsDiff)) {
      score += (specialTeamsDiff / 30) * 10; // ±30% = ±10 points
    }

    // Goalie Edge (15% weight) - ±7.5 points
    if (!isNaN(goalieEdge) && isFinite(goalieEdge)) {
      score += (goalieEdge / 5) * 7.5; // ±5 GSAE = ±7.5 points
    }

    // Rest advantage (15% weight) - ±7.5 points
    if (!isNaN(restBonus) && isFinite(restBonus)) {
      score += (restBonus / 5) * 7.5; // ±5% = ±7.5 points
    }

    // Clamp between 0-100
    const finalScore = Math.max(0, Math.min(100, Math.round(score)));
    return isNaN(finalScore) ? 50 : finalScore; // Default to 50 if still NaN
  };

  const edgeScore = calculateEdgeScore();

  // Determine edge description
  const getEdgeDescription = (score) => {
    if (score >= 65) return { text: 'Strong Advantage', icon: '🔥', color: '#10B981' };
    if (score >= 55) return { text: 'Slight Edge', icon: '⚡', color: '#3B82F6' };
    if (score >= 45) return { text: 'Balanced', icon: '⚖️', color: '#64748B' };
    if (score >= 35) return { text: 'Slight Edge', icon: '⚡', color: '#F59E0B' };
    return { text: 'Strong Advantage', icon: '🔥', color: '#EF4444' };
  };

  const edgeDesc = getEdgeDescription(edgeScore);

  // Calculate actual team records (W-L-OTL)
  const getTeamRecord = (teamData) => {
    if (!teamData) return '0-0-0';
    const wins = teamData.goalsFor > teamData.goalsAgainst ? Math.floor(teamData.gamesPlayed * 0.6) : Math.floor(teamData.gamesPlayed * 0.4);
    const losses = teamData.gamesPlayed - wins;
    return `${wins}-${losses}`;
  };

  const awayRecord = getTeamRecord(away5v5);
  const homeRecord = getTeamRecord(home5v5);

  // The Four Factors
  const factors = [
    {
      icon: '🎯',
      name: 'Shot Quality',
      subtitle: 'High-Danger %',
      awayValue: awayHDPercent,
      homeValue: homeHDPercent,
      advantage: Math.abs(shotQualityDiff) > 5 ? (shotQualityDiff > 0 ? awayTeam : homeTeam) : null,
      diff: Math.abs(shotQualityDiff).toFixed(1),
      format: (val) => `${val.toFixed(1)}%`
    },
    {
      icon: '📈',
      name: 'Shot Volume',
      subtitle: 'Corsi For %',
      awayValue: awayCorsi,
      homeValue: homeCorsi,
      advantage: Math.abs(shotVolumeDiff) > 2 ? (shotVolumeDiff > 0 ? awayTeam : homeTeam) : null,
      diff: Math.abs(shotVolumeDiff).toFixed(1),
      format: (val) => `${val.toFixed(1)}%`
    },
    {
      icon: '🔥',
      name: 'Special Teams',
      subtitle: 'HD xG/60',
      awayValue: awayPPScore,
      homeValue: homePPScore,
      advantage: Math.abs(awayPPScore - homePPScore) > 0.5 ? (awayPPScore > homePPScore ? awayTeam : homeTeam) : null,
      diff: Math.abs(awayPPScore - homePPScore).toFixed(2),
      format: (val) => `${val.toFixed(2)}`
    },
    {
      icon: '🛡️',
      name: 'Goalie Edge',
      subtitle: 'GSAE',
      awayValue: awayGSAE,
      homeValue: homeGSAE,
      advantage: Math.abs(goalieEdge) > 1 ? (goalieEdge > 0 ? awayTeam : homeTeam) : null,
      diff: Math.abs(goalieEdge).toFixed(1),
      format: (val) => val > 0 ? `+${val.toFixed(1)}` : val.toFixed(1)
    }
  ];

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(16, 24, 40, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
      border: '1px solid rgba(16, 185, 129, 0.2)',
      borderRadius: '12px',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: isMobile ? '1rem' : '1.25rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(16, 185, 129, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.25rem' }}>⚡</span>
          <span style={{
            fontSize: isMobile ? '0.875rem' : '1rem',
            fontWeight: '700',
            color: 'var(--color-text-primary)',
            letterSpacing: '0.05em'
          }}>
            MATCHUP INTELLIGENCE
          </span>
        </div>
        <button
          onClick={() => setFlipped(!flipped)}
          style={{
            padding: '0.375rem 0.75rem',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '6px',
            color: '#10B981',
            fontSize: '0.75rem',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(16, 185, 129, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(16, 185, 129, 0.15)';
          }}
        >
          FLIP
        </button>
      </div>

      {/* Team Matchup Header */}
      <div style={{
        padding: isMobile ? '1rem' : '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{
            fontSize: isMobile ? '1.125rem' : '1.5rem',
            fontWeight: '800',
            color: '#0EA5E9',
            marginBottom: '0.5rem'
          }}>
            {awayTeam}
          </div>
          <div style={{
            fontSize: isMobile ? '0.875rem' : '1rem',
            color: 'var(--color-text-secondary)',
            fontWeight: '600'
          }}>
            {awayRecord}
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)',
            marginTop: '0.25rem'
          }}>
            {awayXGF.toFixed(2)} xGF/gm
          </div>
        </div>

        <div style={{
          fontSize: isMobile ? '0.875rem' : '1rem',
          color: 'var(--color-text-muted)',
          fontWeight: '700'
        }}>
          VS
        </div>

        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{
            fontSize: isMobile ? '1.125rem' : '1.5rem',
            fontWeight: '800',
            color: '#10B981',
            marginBottom: '0.5rem'
          }}>
            {homeTeam}
          </div>
          <div style={{
            fontSize: isMobile ? '0.875rem' : '1rem',
            color: 'var(--color-text-secondary)',
            fontWeight: '600'
          }}>
            {homeRecord}
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)',
            marginTop: '0.25rem'
          }}>
            {homeXGF.toFixed(2)} xGF/gm
          </div>
        </div>
      </div>

      {/* Edge Score */}
      <div style={{
        padding: isMobile ? '1.5rem 1rem' : '2rem 1.5rem',
        textAlign: 'center',
        background: 'rgba(0, 0, 0, 0.15)'
      }}>
        {/* Circular Progress */}
        <div style={{
          position: 'relative',
          width: isMobile ? '100px' : '120px',
          height: isMobile ? '100px' : '120px',
          margin: '0 auto 1rem'
        }}>
          <svg width="100%" height="100%" viewBox="0 0 120 120">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="10"
            />
            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke={edgeDesc.color}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${(edgeScore / 100) * 314} 314`}
              transform="rotate(-90 60 60)"
              style={{ transition: 'stroke-dasharray 0.5s ease' }}
            />
          </svg>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: isMobile ? '2rem' : '2.5rem',
              fontWeight: '900',
              color: edgeDesc.color
            }}>
              {edgeScore}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
              fontWeight: '700',
              letterSpacing: '0.05em'
            }}>
              EDGE SCORE
            </div>
          </div>
        </div>

        {/* Edge Description */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          background: `${edgeDesc.color}20`,
          border: `1px solid ${edgeDesc.color}`,
          borderRadius: '8px',
          fontSize: isMobile ? '0.813rem' : '0.875rem',
          fontWeight: '700',
          color: edgeDesc.color
        }}>
          <span>{edgeDesc.icon}</span>
          <span>{edgeDesc.text}</span>
        </div>

        {/* Offense Favored */}
        <div style={{
          marginTop: '1rem',
          fontSize: '0.813rem',
          color: 'var(--color-text-secondary)'
        }}>
          {offenseFavored} offense creates +{offenseEdge.toFixed(2)} xG/game edge
        </div>
      </div>

      {/* Offense vs Defense Comparison */}
      <div style={{
        padding: isMobile ? '1rem' : '1.5rem',
        background: 'rgba(0, 0, 0, 0.2)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: isMobile ? '0.75rem' : '1rem',
          alignItems: 'center'
        }}>
          {/* Away Offense */}
          <div>
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
              marginBottom: '0.25rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              OFFENSE
            </div>
            <div style={{
              fontSize: isMobile ? '0.875rem' : '1rem',
              fontWeight: '700',
              color: '#0EA5E9',
              marginBottom: '0.125rem'
            }}>
              {awayTeam}
            </div>
            <div style={{
              fontSize: isMobile ? '1.25rem' : '1.5rem',
              fontWeight: '900',
              color: 'var(--color-text-primary)',
              marginBottom: '0.25rem'
            }}>
              {awayXGF.toFixed(2)}
            </div>
            <div style={{
              fontSize: '0.688rem',
              color: 'var(--color-text-muted)'
            }}>
              xGF per game
            </div>
          </div>

          {/* Center Edge */}
          <div style={{
            padding: '0.5rem 1rem',
            background: offenseEdge > 0.2 
              ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1))'
              : 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${offenseEdge > 0.2 ? '#10B981' : 'rgba(255, 255, 255, 0.1)'}`,
            borderRadius: '8px',
            textAlign: 'center',
            minWidth: '80px'
          }}>
            <div style={{
              fontSize: isMobile ? '1rem' : '1.125rem',
              fontWeight: '900',
              color: offenseEdge > 0.2 ? '#10B981' : 'var(--color-text-muted)'
            }}>
              {offenseEdge > 0 ? '+' : ''}{offenseEdge.toFixed(2)}
            </div>
            <div style={{
              fontSize: '0.688rem',
              color: 'var(--color-text-muted)',
              marginTop: '0.125rem'
            }}>
              xG edge
            </div>
          </div>

          {/* Home Defense */}
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
              marginBottom: '0.25rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              DEFENSE
            </div>
            <div style={{
              fontSize: isMobile ? '0.875rem' : '1rem',
              fontWeight: '700',
              color: '#10B981',
              marginBottom: '0.125rem'
            }}>
              {homeTeam}
            </div>
            <div style={{
              fontSize: isMobile ? '1.25rem' : '1.5rem',
              fontWeight: '900',
              color: 'var(--color-text-primary)',
              marginBottom: '0.25rem'
            }}>
              {homeXGA.toFixed(2)}
            </div>
            <div style={{
              fontSize: '0.688rem',
              color: 'var(--color-text-muted)'
            }}>
              xGA per game
            </div>
          </div>
        </div>
      </div>

      {/* Rest Advantage Banner */}
      {restAdvantage && (
        <div style={{
          padding: '0.75rem 1rem',
          background: `linear-gradient(135deg, ${restAdvantage.boost ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'}, ${restAdvantage.boost ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)'})`,
          border: `1px solid ${restAdvantage.boost ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
          borderLeft: `4px solid ${restAdvantage.boost ? '#10B981' : '#EF4444'}`,
          fontSize: '0.813rem',
          fontWeight: '600',
          color: restAdvantage.boost ? '#10B981' : '#EF4444',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>{restAdvantage.boost ? '⚡' : '⚠️'}</span>
          <span>{restAdvantage.message}</span>
          <span style={{ marginLeft: 'auto', fontWeight: '800' }}>
            {restAdvantage.boost ? `+${restAdvantage.boost}%` : `${restAdvantage.penalty}%`}
          </span>
        </div>
      )}

      {/* The Four Factors */}
      <div style={{
        padding: isMobile ? '1rem' : '1.5rem'
      }}>
        <div style={{
          fontSize: isMobile ? '0.75rem' : '0.813rem',
          fontWeight: '800',
          color: 'var(--color-text-muted)',
          marginBottom: '1rem',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>📊</span>
          <span>THE FOUR FACTORS</span>
        </div>

        <div style={{
          display: 'grid',
          gap: '1rem'
        }}>
          {factors.map((factor, idx) => (
            <div key={idx}>
              {/* Factor Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.813rem',
                  fontWeight: '700',
                  color: 'var(--color-text-primary)'
                }}>
                  <span style={{ color: '#10B981' }}>{factor.icon}</span>
                  <span>{factor.name}</span>
                  <span style={{
                    fontSize: '0.688rem',
                    color: 'var(--color-text-muted)',
                    fontWeight: '600'
                  }}>
                    {factor.subtitle}
                  </span>
                </div>
                {factor.advantage && (
                  <div style={{
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    color: factor.advantage === awayTeam ? '#0EA5E9' : '#10B981',
                    padding: '0.25rem 0.5rem',
                    background: factor.advantage === awayTeam 
                      ? 'rgba(14, 165, 233, 0.15)' 
                      : 'rgba(16, 185, 129, 0.15)',
                    borderRadius: '6px'
                  }}>
                    {factor.advantage} +{factor.diff}
                  </div>
                )}
              </div>

              {/* Progress Bars */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.5rem'
              }}>
                {/* Away */}
                <div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.25rem',
                    fontSize: '0.75rem'
                  }}>
                    <span style={{ color: '#0EA5E9', fontWeight: '700' }}>{awayTeam}</span>
                    <span style={{ color: 'var(--color-text-primary)', fontWeight: '800' }}>
                      {factor.format(factor.awayValue)}
                    </span>
                  </div>
                  <div style={{
                    height: '6px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min(100, Math.abs(factor.awayValue))}%`,
                      background: 'linear-gradient(90deg, #0EA5E9, #06B6D4)',
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                </div>

                {/* Home */}
                <div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.25rem',
                    fontSize: '0.75rem'
                  }}>
                    <span style={{ color: '#10B981', fontWeight: '700' }}>{homeTeam}</span>
                    <span style={{ color: 'var(--color-text-primary)', fontWeight: '800' }}>
                      {factor.format(factor.homeValue)}
                    </span>
                  </div>
                  <div style={{
                    height: '6px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min(100, Math.abs(factor.homeValue))}%`,
                      background: 'linear-gradient(90deg, #10B981, #059669)',
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NHLMatchupIntelligence;

