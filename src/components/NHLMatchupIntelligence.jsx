/**
 * NHL Matchup Intelligence Component - ENHANCED WITH MEANINGFUL DATA
 * Center-diverging bars + breakdown boxes + PDO regression + bottom line synthesis
 * Uses only data that's reliably available in current infrastructure
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

  // Calculate metrics
  const awayXGF = (away5v5.xGoalsFor / away5v5.gamesPlayed) || 0;
  const homeXGF = (home5v5.xGoalsFor / home5v5.gamesPlayed) || 0;
  const awayXGA = (away5v5.xGoalsAgainst / away5v5.gamesPlayed) || 0;
  const homeXGA = (home5v5.xGoalsAgainst / home5v5.gamesPlayed) || 0;

  // League averages
  const leagueXGF = 2.18;
  const leagueXGA = 2.18;

  // Get high-danger metrics
  const awayHighDanger = statsAnalyzer.getHighDangerMetrics(awayTeam, '5on5');
  const homeHighDanger = statsAnalyzer.getHighDangerMetrics(homeTeam, '5on5');
  
  // HD shots per game
  const awayHDShotsPerGame = (awayHighDanger?.hdShotsFor || 0) / (away5v5.gamesPlayed || 1);
  const homeHDShotsPerGame = (homeHighDanger?.hdShotsFor || 0) / (home5v5.gamesPlayed || 1);
  
  // HD xG per game
  const awayHDxGPerGame = (awayHighDanger?.hdXgFor || 0) / (away5v5.gamesPlayed || 1);
  const homeHDxGPerGame = (homeHighDanger?.hdXgFor || 0) / (home5v5.gamesPlayed || 1);
  
  // Rebound xG per game
  const awayReboundxG = (away5v5.xGoalsFromActualReboundsOfShotsFor || 0) / (away5v5.gamesPlayed || 1);
  const homeReboundxG = (home5v5.xGoalsFromActualReboundsOfShotsFor || 0) / (home5v5.gamesPlayed || 1);

  // D-Zone Giveaways per game
  const awayDZGiveaways = (away5v5.dZoneGiveawaysFor || 0) / (away5v5.gamesPlayed || 1);
  const homeDZGiveaways = (home5v5.dZoneGiveawaysFor || 0) / (home5v5.gamesPlayed || 1);

  // Get special teams
  const awayPP = statsAnalyzer.getHighDangerMetrics(awayTeam, '5on4');
  const homePP = statsAnalyzer.getHighDangerMetrics(homeTeam, '5on4');
  const awayPK = statsAnalyzer.getHighDangerMetrics(awayTeam, '4on5');
  const homePK = statsAnalyzer.getHighDangerMetrics(homeTeam, '4on5');
  
  const awayPPScore = awayPP?.hdXgfPer60 || 0;
  const homePPScore = homePP?.hdXgfPer60 || 0;
  const specialTeamsDiff = awayPPScore - homePPScore;
  const leaguePPScore = 2.95;

  // PP shot quality (% of shots that are high-danger)
  const awayPPData = dataProcessor.getTeamData(awayTeam, '5on4');
  const homePPData = dataProcessor.getTeamData(homeTeam, '5on4');
  const awayPPHDPercent = awayPPData && awayPPData.shotAttemptsFor > 0 
    ? ((awayPPData.highDangerShotsFor || 0) / awayPPData.shotAttemptsFor) * 100 
    : 0;
  const homePPHDPercent = homePPData && homePPData.shotAttemptsFor > 0
    ? ((homePPData.highDangerShotsFor || 0) / homePPData.shotAttemptsFor) * 100
    : 0;

  // Get goalie data
  const awayGoalie = game.goalies?.away;
  const homeGoalie = game.goalies?.home;
  const awayGSAE = awayGoalie?.gsae || 0;
  const homeGSAE = homeGoalie?.gsae || 0;
  const goalieEdge = awayGSAE - homeGSAE;
  const leagueGSAE = 1.00;

  // Goalie workload (shots against per game)
  const awaySAPerGame = (away5v5.shotsOnGoalAgainst || 0) / (away5v5.gamesPlayed || 1);
  const homeSAPerGame = (home5v5.shotsOnGoalAgainst || 0) / (home5v5.gamesPlayed || 1);

  // Goalie HD save %
  const awayGoalieHDSv = awayGoalie?.hdSavePercent || 0;
  const homeGoalieHDSv = homeGoalie?.hdSavePercent || 0;

  // PDO Regression
  const awayRegression = statsAnalyzer.getRegressionIndicators(awayTeam, '5on5');
  const homeRegression = statsAnalyzer.getRegressionIndicators(homeTeam, '5on5');
  
  const awayPDO = awayRegression?.pdo || 100;
  const homePDO = homeRegression?.pdo || 100;
  
  // Calculate expected regression impact
  const awayRegressionImpact = awayPDO > 102 ? -((awayPDO - 100) * 0.06) : awayPDO < 98 ? ((100 - awayPDO) * 0.05) : 0;
  const homeRegressionImpact = homePDO > 102 ? -((homePDO - 100) * 0.06) : homePDO < 98 ? ((100 - homePDO) * 0.05) : 0;

  // The Four Factors with enhanced data
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
      format: (val) => val.toFixed(2),
      breakdown: {
        title: '💡 BREAKDOWN',
        points: [
          `Slot Scoring: ${awayTeam} ${awayHDxGPerGame.toFixed(2)} HD xG vs ${homeTeam} ${homeHDxGPerGame.toFixed(2)} ${awayHDxGPerGame > homeHDxGPerGame ? '✅' : ''}`,
          `Rebounds: ${awayTeam} ${awayReboundxG.toFixed(2)} xG vs ${homeTeam} ${homeReboundxG.toFixed(2)}`,
          `HD Shots: ${awayTeam} ${awayHDShotsPerGame.toFixed(1)}/gm vs ${homeTeam} ${homeHDShotsPerGame.toFixed(1)}/gm`
        ]
      }
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
      advantage: Math.abs(awayXGA - homeXGA) > 0.15 ? (awayXGA < homeXGA ? awayTeam : homeTeam) : null,
      significance: Math.abs(awayXGA - homeXGA) > 0.25 ? 'high' : Math.abs(awayXGA - homeXGA) > 0.15 ? 'moderate' : 'low',
      format: (val) => val.toFixed(2),
      breakdown: {
        title: awayDZGiveaways > 7 || homeDZGiveaways > 7 ? '⚠️ VULNERABILITY' : '💡 BREAKDOWN',
        points: [
          awayDZGiveaways > 7 ? `${awayTeam} D-Zone Giveaways: ${awayDZGiveaways.toFixed(1)}/gm ⚠️` : null,
          homeDZGiveaways > 7 ? `${homeTeam} D-Zone Giveaways: ${homeDZGiveaways.toFixed(1)}/gm ⚠️` : null,
          `HD Shots Allowed: ${awayTeam} ${(awayHighDanger?.hdShotsAgainst || 0) / (away5v5.gamesPlayed || 1).toFixed(1)}/gm vs ${homeTeam} ${((homeHighDanger?.hdShotsAgainst || 0) / (home5v5.gamesPlayed || 1)).toFixed(1)}/gm`
        ].filter(Boolean)
      }
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
      format: (val) => val.toFixed(2),
      breakdown: {
        title: '💡 BREAKDOWN',
        points: [
          `PP Shot Quality: ${awayTeam} ${awayPPHDPercent.toFixed(0)}% HD vs ${homeTeam} ${homePPHDPercent.toFixed(0)}% HD`,
          `Expected Impact: ${Math.abs(specialTeamsDiff * 0.15).toFixed(2)} goals ${specialTeamsDiff > 0 ? `for ${awayTeam}` : `for ${homeTeam}`}`,
          specialTeamsDiff > 0.8 ? `${awayTeam} PP dominance ✅` : specialTeamsDiff < -0.8 ? `${homeTeam} PP dominance ✅` : 'Evenly matched special teams'
        ]
      }
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
      format: (val) => val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2),
      breakdown: {
        title: '📊 CONTEXT',
        points: [
          `Workload: ${awayGoalie?.name || awayTeam} ${awaySAPerGame.toFixed(1)} SA/gm vs ${homeGoalie?.name || homeTeam} ${homeSAPerGame.toFixed(1)} SA/gm`,
          awayGoalieHDSv > 0 && homeGoalieHDSv > 0 ? `HD Save %: ${awayGoalie?.name || awayTeam} ${awayGoalieHDSv.toFixed(1)}% vs ${homeGoalie?.name || homeTeam} ${homeGoalieHDSv.toFixed(1)}%` : null,
          `Expected: ${Math.abs(goalieEdge * 0.15).toFixed(2)} goals ${goalieEdge > 0 ? `saved by ${awayGoalie?.name || awayTeam}` : `saved by ${homeGoalie?.name || homeTeam}`}`
        ].filter(Boolean)
      }
    }
  ];

  // Calculate bottom line edges
  const offenseEdge = Math.abs(awayXGF - homeXGF) > 0.15 ? Math.abs(awayXGF - homeXGF) * 0.4 : 0;
  const defenseEdge = Math.abs(awayXGA - homeXGA) > 0.15 ? Math.abs(awayXGA - homeXGA) * 0.4 : 0;
  const specialTeamsEdge = Math.abs(specialTeamsDiff) > 0.5 ? Math.abs(specialTeamsDiff) * 0.15 : 0;
  const goalieEdgeImpact = Math.abs(goalieEdge) > 0.3 ? Math.abs(goalieEdge) * 0.15 : 0;
  const regressionEdge = Math.abs(awayRegressionImpact - homeRegressionImpact);
  
  const totalEdge = offenseEdge + defenseEdge + specialTeamsEdge + goalieEdgeImpact + regressionEdge;
  const edgeFavoredTeam = (awayXGF - awayXGA + awayRegressionImpact) > (homeXGF - homeXGA + homeRegressionImpact) ? awayTeam : homeTeam;

  // Count advantages
  const advantagesCount = factors.filter(f => f.advantage === edgeFavoredTeam).length;

  // Get significance label
  const getSignificanceLabel = (sig) => {
    if (sig === 'high') return 'HUGE EDGE';
    if (sig === 'moderate') return 'moderate edge';
    return 'even';
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

      {/* Team Headers */}
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

      {/* CENTER-DIVERGING BARS WITH BREAKDOWNS */}
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
              marginBottom: '0.75rem'
            }}>
              {/* Away Bar */}
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

              {/* Center Line */}
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

              {/* Home Bar */}
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

            {/* League Average */}
            <div style={{
              fontSize: '0.688rem',
              color: 'rgba(212, 175, 55, 0.7)',
              textAlign: 'center',
              marginBottom: '0.5rem'
            }}>
              League: {factor.format(factor.leagueAvg)}
            </div>

            {/* Breakdown Box */}
            {factor.breakdown && factor.breakdown.points.length > 0 && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.05)',
                border: '1px solid rgba(16, 185, 129, 0.15)',
                borderRadius: '6px',
                padding: '0.75rem',
                marginBottom: '0.5rem'
              }}>
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: '#10B981',
                  marginBottom: '0.5rem'
                }}>
                  {factor.breakdown.title}
                </div>
                {factor.breakdown.points.map((point, i) => (
                  <div key={i} style={{
                    fontSize: '0.688rem',
                    color: 'var(--color-text-secondary)',
                    marginBottom: i < factor.breakdown.points.length - 1 ? '0.25rem' : 0,
                    lineHeight: '1.4'
                  }}>
                    • {point}
                  </div>
                ))}
              </div>
            )}

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

      {/* PDO REGRESSION BOX */}
      {(Math.abs(awayPDO - 100) > 2 || Math.abs(homePDO - 100) > 2) && (
        <div style={{
          padding: isMobile ? '1.25rem 1rem' : '1.5rem',
          background: 'rgba(0, 0, 0, 0.25)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '8px',
            padding: isMobile ? '1rem' : '1.25rem'
          }}>
            <div style={{
              fontSize: isMobile ? '0.813rem' : '0.875rem',
              fontWeight: '800',
              color: '#F59E0B',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>🎲</span>
              <span>LUCK REGRESSION SIGNALS</span>
            </div>

            {/* Away Team PDO */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem'
              }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: 'var(--color-text-primary)'
                }}>
                  {awayTeam} PDO: {awayPDO.toFixed(1)}
                </span>
                <span style={{
                  fontSize: '0.688rem',
                  color: awayPDO > 102 ? '#EF4444' : awayPDO < 98 ? '#10B981' : 'var(--color-text-muted)',
                  fontWeight: '700'
                }}>
                  {awayPDO > 102 ? '⚠️ Hot' : awayPDO < 98 ? '✅ Due' : 'Neutral'}
                </span>
              </div>
              <div style={{
                height: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                {/* League average marker */}
                <div style={{
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  bottom: 0,
                  width: '2px',
                  background: 'rgba(212, 175, 55, 0.6)',
                  zIndex: 2
                }} />
                {/* PDO bar */}
                <div style={{
                  height: '100%',
                  width: `${Math.min(100, ((awayPDO - 94) / 12) * 100)}%`,
                  background: awayPDO > 102 
                    ? 'linear-gradient(90deg, #EF4444 0%, #DC2626 100%)'
                    : awayPDO < 98
                    ? 'linear-gradient(90deg, #10B981 0%, #059669 100%)'
                    : 'linear-gradient(90deg, #6B7280 0%, #4B5563 100%)',
                  transition: 'width 0.5s ease'
                }} />
              </div>
              <div style={{
                fontSize: '0.688rem',
                color: 'var(--color-text-muted)',
                marginTop: '0.25rem'
              }}>
                {awayPDO > 102 
                  ? `Shooting ${((awayPDO - 100) / 2).toFixed(1)}% above expected ⚠️`
                  : awayPDO < 98
                  ? `Shooting ${((100 - awayPDO) / 2).toFixed(1)}% below expected ✅`
                  : 'Neutral luck factor'}
              </div>
              {awayRegressionImpact !== 0 && (
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: awayRegressionImpact < 0 ? '#EF4444' : '#10B981',
                  marginTop: '0.375rem'
                }}>
                  Expected regression: {awayRegressionImpact > 0 ? '+' : ''}{awayRegressionImpact.toFixed(2)} goals
                </div>
              )}
            </div>

            {/* Home Team PDO */}
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem'
              }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: 'var(--color-text-primary)'
                }}>
                  {homeTeam} PDO: {homePDO.toFixed(1)}
                </span>
                <span style={{
                  fontSize: '0.688rem',
                  color: homePDO > 102 ? '#EF4444' : homePDO < 98 ? '#10B981' : 'var(--color-text-muted)',
                  fontWeight: '700'
                }}>
                  {homePDO > 102 ? '⚠️ Hot' : homePDO < 98 ? '✅ Due' : 'Neutral'}
                </span>
              </div>
              <div style={{
                height: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  bottom: 0,
                  width: '2px',
                  background: 'rgba(212, 175, 55, 0.6)',
                  zIndex: 2
                }} />
                <div style={{
                  height: '100%',
                  width: `${Math.min(100, ((homePDO - 94) / 12) * 100)}%`,
                  background: homePDO > 102 
                    ? 'linear-gradient(90deg, #EF4444 0%, #DC2626 100%)'
                    : homePDO < 98
                    ? 'linear-gradient(90deg, #10B981 0%, #059669 100%)'
                    : 'linear-gradient(90deg, #6B7280 0%, #4B5563 100%)',
                  transition: 'width 0.5s ease'
                }} />
              </div>
              <div style={{
                fontSize: '0.688rem',
                color: 'var(--color-text-muted)',
                marginTop: '0.25rem'
              }}>
                {homePDO > 102 
                  ? `Shooting ${((homePDO - 100) / 2).toFixed(1)}% above expected ⚠️`
                  : homePDO < 98
                  ? `Shooting ${((100 - homePDO) / 2).toFixed(1)}% below expected ✅`
                  : 'Neutral luck factor'}
              </div>
              {homeRegressionImpact !== 0 && (
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: homeRegressionImpact < 0 ? '#EF4444' : '#10B981',
                  marginTop: '0.375rem'
                }}>
                  Expected regression: {homeRegressionImpact > 0 ? '+' : ''}{homeRegressionImpact.toFixed(2)} goals
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM LINE SYNTHESIS */}
      <div style={{
        padding: isMobile ? '1.25rem 1rem' : '1.5rem',
        background: 'rgba(16, 185, 129, 0.08)',
        borderTop: '2px solid rgba(16, 185, 129, 0.3)'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)',
          border: '2px solid rgba(16, 185, 129, 0.4)',
          borderRadius: '10px',
          padding: isMobile ? '1.25rem' : '1.5rem'
        }}>
          <div style={{
            fontSize: isMobile ? '0.875rem' : '1rem',
            fontWeight: '800',
            color: '#10B981',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>💡</span>
            <span>BOTTOM LINE</span>
          </div>

          <div style={{
            fontSize: '0.813rem',
            color: 'var(--color-text-secondary)',
            lineHeight: '1.6',
            marginBottom: '1rem'
          }}>
            {edgeFavoredTeam} has {advantagesCount > 0 ? `${advantagesCount} of 4` : 'no clear'} matchup advantage{advantagesCount !== 1 ? 's' : ''}:
          </div>

          {/* List edges */}
          <div style={{ marginBottom: '1rem' }}>
            {offenseEdge > 0 && (
              <div style={{
                fontSize: '0.75rem',
                color: '#10B981',
                marginBottom: '0.375rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>✅</span>
                <span>Offense: +{offenseEdge.toFixed(2)} goals</span>
              </div>
            )}
            {defenseEdge > 0 && (
              <div style={{
                fontSize: '0.75rem',
                color: '#10B981',
                marginBottom: '0.375rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>✅</span>
                <span>Defense: +{defenseEdge.toFixed(2)} goals</span>
              </div>
            )}
            {specialTeamsEdge > 0 && (
              <div style={{
                fontSize: '0.75rem',
                color: '#10B981',
                marginBottom: '0.375rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>✅</span>
                <span>Special Teams: +{specialTeamsEdge.toFixed(2)} goals</span>
              </div>
            )}
            {goalieEdgeImpact > 0 && (
              <div style={{
                fontSize: '0.75rem',
                color: '#10B981',
                marginBottom: '0.375rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>✅</span>
                <span>Goaltending: +{goalieEdgeImpact.toFixed(2)} goals</span>
              </div>
            )}
            {regressionEdge > 0.1 && (
              <div style={{
                fontSize: '0.75rem',
                color: '#10B981',
                marginBottom: '0.375rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>✅</span>
                <span>Luck Regression: +{regressionEdge.toFixed(2)} goals</span>
              </div>
            )}
          </div>

          {/* Net edge */}
          {totalEdge > 0.2 && (
            <div style={{
              textAlign: 'center',
              padding: '0.75rem',
              background: 'rgba(16, 185, 129, 0.15)',
              borderRadius: '8px',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              <div style={{
                fontSize: isMobile ? '0.938rem' : '1.063rem',
                fontWeight: '900',
                color: '#10B981'
              }}>
                🎯 NET EDGE: {edgeFavoredTeam} +{totalEdge.toFixed(2)} goals
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NHLMatchupIntelligence;
