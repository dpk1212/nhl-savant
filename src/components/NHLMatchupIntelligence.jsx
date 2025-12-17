/**
 * NHL Matchup Intelligence Component - ENHANCED CENTER-DIVERGING LAYOUT
 * Shows offense vs defense collision with visual dominance indicators
 * Uses center-line bars that pull toward the winning side
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

  // League averages for context
  const leagueXGF = 2.18; // League average xGF per game
  const leagueXGA = 2.18; // League average xGA per game

  // Get high-danger metrics for shot quality
  const awayHighDanger = statsAnalyzer.getHighDangerMetrics(awayTeam, '5on5');
  const homeHighDanger = statsAnalyzer.getHighDangerMetrics(homeTeam, '5on5');
  
  // Calculate high-danger shot percentage (HD shots / total shots)
  const awayTotalShots = away5v5.shotAttemptsFor || 1;
  const homeTotalShots = home5v5.shotAttemptsFor || 1;
  const awayHDPercent = ((awayHighDanger?.hdShotsFor || 0) / awayTotalShots) * 100;
  const homeHDPercent = ((homeHighDanger?.hdShotsFor || 0) / homeTotalShots) * 100;
  const shotQualityDiff = awayHDPercent - homeHDPercent;
  const leagueHDPercent = 4.1; // League average HD%

  // Get possession metrics for shot volume
  const awayCorsi = (away5v5.corsiPercentage || 0.5) * 100;
  const homeCorsi = (home5v5.corsiPercentage || 0.5) * 100;
  const shotVolumeDiff = awayCorsi - homeCorsi;
  const leagueCorsi = 50.0; // By definition, league average CF% is 50%

  // Get special teams - use high-danger xG per 60
  const awayPP = statsAnalyzer.getHighDangerMetrics(awayTeam, '5on4');
  const homePP = statsAnalyzer.getHighDangerMetrics(homeTeam, '5on4');
  
  const awayPPScore = awayPP?.hdXgfPer60 || 0;
  const homePPScore = homePP?.hdXgfPer60 || 0;
  const specialTeamsDiff = awayPPScore - homePPScore;
  const leaguePPScore = 2.95; // League average HD xG/60 on PP

  // Get goalie data
  const awayGoalie = game.goalies?.away;
  const homeGoalie = game.goalies?.home;
  const awayGSAE = awayGoalie?.gsae || 0;
  const homeGSAE = homeGoalie?.gsae || 0;
  const goalieEdge = awayGSAE - homeGSAE;
  const leagueGSAE = 1.00; // League average GSAE

  // Calculate projected goals (offense vs defense collisions)
  const awayProjected = ((awayXGF + homeXGA) / 2) + (specialTeamsDiff * 0.15) + (goalieEdge * 0.1);
  const homeProjected = ((homeXGF + awayXGA) / 2) - (specialTeamsDiff * 0.15) - (goalieEdge * 0.1);
  const netEdge = Math.abs(awayProjected - homeProjected);
  const edgeFavoredTeam = awayProjected > homeProjected ? awayTeam : homeTeam;

  // Calculate confidence (0-100%)
  const calculateConfidence = () => {
    let confidence = 50;
    
    // Factor 1: Net edge magnitude (bigger edge = higher confidence)
    confidence += Math.min(20, netEdge * 10);
    
    // Factor 2: Consistency (if multiple factors agree)
    const agreements = [
      shotQualityDiff > 0 === (awayProjected > homeProjected),
      shotVolumeDiff > 0 === (awayProjected > homeProjected),
      specialTeamsDiff > 0 === (awayProjected > homeProjected),
      goalieEdge > 0 === (awayProjected > homeProjected)
    ].filter(Boolean).length;
    
    confidence += agreements * 5;
    
    return Math.min(90, Math.max(50, Math.round(confidence)));
  };

  const confidenceLevel = calculateConfidence();

  // The Four Factors with enhanced significance calculation
  const factors = [
    {
      icon: '🎯',
      name: 'Offense',
      subtitle: 'xGF per game',
      awayValue: awayXGF,
      homeValue: homeXGF,
      leagueAvg: leagueXGF,
      diff: Math.abs(awayXGF - homeXGF),
      percentDiff: ((Math.abs(awayXGF - homeXGF) / leagueXGF) * 100).toFixed(1),
      advantage: Math.abs(awayXGF - homeXGF) > 0.15 ? (awayXGF > homeXGF ? awayTeam : homeTeam) : null,
      significance: Math.abs(awayXGF - homeXGF) > 0.25 ? 'high' : Math.abs(awayXGF - homeXGF) > 0.15 ? 'moderate' : 'low',
      format: (val) => val.toFixed(2)
    },
    {
      icon: '🛡️',
      name: 'Defense',
      subtitle: 'xGA per game',
      awayValue: awayXGA,
      homeValue: homeXGA,
      leagueAvg: leagueXGA,
      diff: Math.abs(awayXGA - homeXGA),
      percentDiff: ((Math.abs(awayXGA - homeXGA) / leagueXGA) * 100).toFixed(1),
      advantage: Math.abs(awayXGA - homeXGA) > 0.15 ? (awayXGA < homeXGA ? awayTeam : homeTeam) : null, // Lower is better
      significance: Math.abs(awayXGA - homeXGA) > 0.25 ? 'high' : Math.abs(awayXGA - homeXGA) > 0.15 ? 'moderate' : 'low',
      format: (val) => val.toFixed(2)
    },
    {
      icon: '🔥',
      name: 'Special Teams',
      subtitle: 'HD xG/60',
      awayValue: awayPPScore,
      homeValue: homePPScore,
      leagueAvg: leaguePPScore,
      diff: Math.abs(specialTeamsDiff),
      percentDiff: ((Math.abs(specialTeamsDiff) / leaguePPScore) * 100).toFixed(1),
      advantage: Math.abs(specialTeamsDiff) > 0.5 ? (specialTeamsDiff > 0 ? awayTeam : homeTeam) : null,
      significance: Math.abs(specialTeamsDiff) > 1.0 ? 'high' : Math.abs(specialTeamsDiff) > 0.5 ? 'moderate' : 'low',
      format: (val) => val.toFixed(2)
    },
    {
      icon: '🥅',
      name: 'Goalie',
      subtitle: 'GSAx per 60',
      awayValue: awayGSAE,
      homeValue: homeGSAE,
      leagueAvg: leagueGSAE,
      diff: Math.abs(goalieEdge),
      percentDiff: ((Math.abs(goalieEdge) / leagueGSAE) * 100).toFixed(1),
      advantage: Math.abs(goalieEdge) > 0.3 ? (goalieEdge > 0 ? awayTeam : homeTeam) : null,
      significance: Math.abs(goalieEdge) > 0.5 ? 'high' : Math.abs(goalieEdge) > 0.3 ? 'moderate' : 'low',
      format: (val) => val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2)
    }
  ];

  // Get significance label
  const getSignificanceLabel = (sig) => {
    if (sig === 'high') return 'HUGE EDGE';
    if (sig === 'moderate') return 'moderate edge';
    return 'even';
  };

  // Get significance emoji
  const getSignificanceEmoji = (sig) => {
    if (sig === 'high') return '⚡';
    return '';
  };

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

      {/* Team Headers (NO RECORDS) */}
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
            marginBottom: '0.25rem'
          }}>
            {awayTeam}
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)'
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
            marginBottom: '0.25rem'
          }}>
            {homeTeam}
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)'
          }}>
            {homeXGF.toFixed(2)} xGF/gm
          </div>
        </div>
      </div>

      {/* CENTER-DIVERGING COMPARISON BARS */}
      <div style={{
        padding: isMobile ? '1.5rem 1rem' : '2rem 1.5rem',
        background: 'rgba(0, 0, 0, 0.15)'
      }}>
        {factors.map((factor, idx) => (
          <div key={idx} style={{ marginBottom: idx < factors.length - 1 ? '2rem' : 0 }}>
            {/* Factor Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.75rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: isMobile ? '0.813rem' : '0.875rem',
                fontWeight: '700',
                color: 'var(--color-text-primary)'
              }}>
                <span style={{ fontSize: '1rem' }}>{factor.icon}</span>
                <span>{factor.name}</span>
                <span style={{
                  fontSize: '0.688rem',
                  color: 'var(--color-text-muted)',
                  fontWeight: '600'
                }}>
                  {factor.subtitle}
                </span>
              </div>
              <div style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                color: factor.significance === 'high' ? '#10B981' : factor.significance === 'moderate' ? '#F59E0B' : 'var(--color-text-muted)'
              }}>
                {factor.advantage && `+${factor.percentDiff}%`}
                {factor.significance === 'high' && ' ⚡'}
              </div>
            </div>

            {/* Center-Diverging Bar */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              gap: '0.5rem',
              alignItems: 'center',
              marginBottom: '0.5rem'
            }}>
              {/* Away Bar (pulls left from center) */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{
                  fontSize: '0.813rem',
                  fontWeight: '700',
                  color: factor.advantage === awayTeam ? '#0EA5E9' : 'var(--color-text-secondary)',
                  minWidth: '50px',
                  textAlign: 'right'
                }}>
                  {factor.format(factor.awayValue)}
                </span>
                <div style={{
                  height: '24px',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min(100, (factor.awayValue / (factor.leagueAvg * 2)) * 100)}%`,
                    background: factor.advantage === awayTeam
                      ? 'linear-gradient(90deg, #0EA5E9 0%, #3B82F6 100%)'
                      : 'rgba(14, 165, 233, 0.4)',
                    borderRadius: '4px 0 0 4px',
                    boxShadow: factor.advantage === awayTeam ? '0 0 12px rgba(14, 165, 233, 0.5)' : 'none',
                    border: factor.advantage === awayTeam ? '2px solid #60A5FA' : 'none',
                    transition: 'all 0.4s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    padding: '0 0.5rem'
                  }}>
                    {factor.advantage === awayTeam && (
                      <span style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: '700',
                        color: '#fff'
                      }}>
                        {awayTeam}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Center Line with League Average */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '40px'
              }}>
                <div style={{
                  width: '2px',
                  height: '32px',
                  background: 'linear-gradient(to bottom, transparent 0%, rgba(212, 175, 55, 0.6) 20%, rgba(212, 175, 55, 0.6) 80%, transparent 100%)',
                  marginBottom: '0.25rem'
                }} />
                <span style={{
                  fontSize: '0.688rem',
                  color: 'rgba(212, 175, 55, 0.8)',
                  fontWeight: '600'
                }}>
                  ⚖️
                </span>
              </div>

              {/* Home Bar (pulls right from center) */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <div style={{
                  height: '24px',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min(100, (factor.homeValue / (factor.leagueAvg * 2)) * 100)}%`,
                    background: factor.advantage === homeTeam
                      ? 'linear-gradient(90deg, #10B981 0%, #059669 100%)'
                      : 'rgba(16, 185, 129, 0.4)',
                    borderRadius: '0 4px 4px 0',
                    boxShadow: factor.advantage === homeTeam ? '0 0 12px rgba(16, 185, 129, 0.5)' : 'none',
                    border: factor.advantage === homeTeam ? '2px solid #34D399' : 'none',
                    transition: 'all 0.4s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    padding: '0 0.5rem'
                  }}>
                    {factor.advantage === homeTeam && (
                      <span style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: '700',
                        color: '#fff'
                      }}>
                        {homeTeam}
                      </span>
                    )}
                  </div>
                </div>
                <span style={{
                  fontSize: '0.813rem',
                  fontWeight: '700',
                  color: factor.advantage === homeTeam ? '#10B981' : 'var(--color-text-secondary)',
                  minWidth: '50px'
                }}>
                  {factor.format(factor.homeValue)}
                </span>
              </div>
            </div>

            {/* League Average Context */}
            <div style={{
              fontSize: '0.688rem',
              color: 'rgba(212, 175, 55, 0.7)',
              textAlign: 'center',
              marginBottom: '0.375rem'
            }}>
              League: {factor.format(factor.leagueAvg)}
            </div>

            {/* Significance Label */}
            <div style={{
              fontSize: '0.75rem',
              color: factor.significance === 'high' ? '#10B981' : factor.significance === 'moderate' ? '#F59E0B' : 'var(--color-text-muted)',
              textAlign: 'center',
              fontWeight: '600',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              paddingTop: '0.5rem',
              fontStyle: 'italic'
            }}>
              {getSignificanceLabel(factor.significance)}
            </div>
          </div>
        ))}
      </div>

      {/* PROJECTED OUTCOME (ENHANCED) */}
      <div style={{
        padding: isMobile ? '1.5rem 1rem' : '2rem 1.5rem',
        background: 'rgba(0, 0, 0, 0.25)',
        borderTop: '2px solid rgba(16, 185, 129, 0.3)'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)',
          border: '2px solid rgba(16, 185, 129, 0.4)',
          borderRadius: '12px',
          padding: isMobile ? '1.25rem' : '1.5rem'
        }}>
          <div style={{
            fontSize: isMobile ? '0.875rem' : '1rem',
            fontWeight: '800',
            color: '#10B981',
            marginBottom: '1rem',
            textAlign: 'center',
            letterSpacing: '0.05em'
          }}>
            🎯 PROJECTED OUTCOME
          </div>

          {/* Projected Scores */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <div>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-muted)',
                marginBottom: '0.25rem'
              }}>
                {awayTeam}
              </div>
              <div style={{
                fontSize: isMobile ? '1.5rem' : '2rem',
                fontWeight: '900',
                color: awayProjected > homeProjected ? '#10B981' : 'var(--color-text-secondary)'
              }}>
                {awayProjected.toFixed(1)}
              </div>
              <div style={{
                height: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                overflow: 'hidden',
                marginTop: '0.5rem'
              }}>
                <div style={{
                  height: '100%',
                  width: `${(awayProjected / (awayProjected + homeProjected)) * 100}%`,
                  background: 'linear-gradient(90deg, #0EA5E9 0%, #3B82F6 100%)',
                  transition: 'width 0.5s ease'
                }} />
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '1.5rem'
            }}>
              ⚔️
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-muted)',
                marginBottom: '0.25rem'
              }}>
                {homeTeam}
              </div>
              <div style={{
                fontSize: isMobile ? '1.5rem' : '2rem',
                fontWeight: '900',
                color: homeProjected > awayProjected ? '#10B981' : 'var(--color-text-secondary)'
              }}>
                {homeProjected.toFixed(1)}
              </div>
              <div style={{
                height: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                overflow: 'hidden',
                marginTop: '0.5rem'
              }}>
                <div style={{
                  height: '100%',
                  width: `${(homeProjected / (awayProjected + homeProjected)) * 100}%`,
                  background: 'linear-gradient(90deg, #10B981 0%, #059669 100%)',
                  transition: 'width 0.5s ease'
                }} />
              </div>
            </div>
          </div>

          {/* Net Edge */}
          <div style={{
            textAlign: 'center',
            padding: '0.75rem',
            background: 'rgba(16, 185, 129, 0.15)',
            borderRadius: '8px',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            marginBottom: '0.75rem'
          }}>
            <div style={{
              fontSize: isMobile ? '1rem' : '1.125rem',
              fontWeight: '900',
              color: '#10B981',
              marginBottom: '0.25rem'
            }}>
              ⚡ EDGE: {edgeFavoredTeam} +{netEdge.toFixed(1)} goals
            </div>
          </div>

          {/* Confidence Bar */}
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.5rem'
            }}>
              <span style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-secondary)',
                fontWeight: '600'
              }}>
                Confidence
              </span>
              <span style={{
                fontSize: '0.813rem',
                fontWeight: '800',
                color: confidenceLevel >= 70 ? '#10B981' : '#F59E0B'
              }}>
                {confidenceLevel}%
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
                width: `${confidenceLevel}%`,
                background: confidenceLevel >= 70
                  ? 'linear-gradient(90deg, #10B981 0%, #059669 100%)'
                  : 'linear-gradient(90deg, #F59E0B 0%, #D97706 100%)',
                transition: 'width 0.5s ease'
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Key Driver Insight */}
      <div style={{
        padding: isMobile ? '1rem' : '1.25rem',
        background: 'rgba(16, 185, 129, 0.08)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        fontSize: '0.813rem',
        color: 'var(--color-text-secondary)',
        fontWeight: '600',
        textAlign: 'center',
        lineHeight: '1.6'
      }}>
        💡 {edgeFavoredTeam} wins in {factors.filter(f => f.advantage === edgeFavoredTeam).length} of 4 categories
        {factors.find(f => f.significance === 'high') && 
          ` — ${factors.find(f => f.significance === 'high').name.toLowerCase()} is the dominant factor`
        }
      </div>
    </div>
  );
};

export default NHLMatchupIntelligence;
