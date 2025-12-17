/**
 * NHL Matchup Intelligence Component - COMPACT + VISUAL + ACCESSIBLE
 * Dense, scrollable layout with smart context that explains the "why"
 * Beginner-friendly with advanced depth
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

  const leagueXGF = 2.18;
  const leagueXGA = 2.18;

  // Get high-danger metrics
  const awayHighDanger = statsAnalyzer.getHighDangerMetrics(awayTeam, '5on5');
  const homeHighDanger = statsAnalyzer.getHighDangerMetrics(homeTeam, '5on5');
  
  const awayHDxGPerGame = (awayHighDanger?.hdXgFor || 0) / (away5v5.gamesPlayed || 1);
  const homeHDxGPerGame = (homeHighDanger?.hdXgFor || 0) / (home5v5.gamesPlayed || 1);
  
  const awayReboundxG = (away5v5.xGoalsFromActualReboundsOfShotsFor || 0) / (away5v5.gamesPlayed || 1);
  const homeReboundxG = (home5v5.xGoalsFromActualReboundsOfShotsFor || 0) / (home5v5.gamesPlayed || 1);

  const awayDZGiveaways = (away5v5.dZoneGiveawaysFor || 0) / (away5v5.gamesPlayed || 1);
  const homeDZGiveaways = (home5v5.dZoneGiveawaysFor || 0) / (home5v5.gamesPlayed || 1);

  // Special teams
  const awayPP = statsAnalyzer.getHighDangerMetrics(awayTeam, '5on4');
  const homePP = statsAnalyzer.getHighDangerMetrics(homeTeam, '5on4');
  
  const awayPPScore = awayPP?.hdXgfPer60 || 0;
  const homePPScore = homePP?.hdXgfPer60 || 0;
  const specialTeamsDiff = awayPPScore - homePPScore;
  const leaguePPScore = 2.95;

  // PP shot quality
  const awayPPData = dataProcessor.getTeamData(awayTeam, '5on4');
  const homePPData = dataProcessor.getTeamData(homeTeam, '5on4');
  const awayPPHDPercent = awayPPData && awayPPData.shotAttemptsFor > 0 
    ? ((awayPPData.highDangerShotsFor || 0) / awayPPData.shotAttemptsFor) * 100 
    : 0;
  const homePPHDPercent = homePPData && homePPData.shotAttemptsFor > 0
    ? ((homePPData.highDangerShotsFor || 0) / homePPData.shotAttemptsFor) * 100
    : 0;

  // Get rank for context
  const awayPPRank = statsAnalyzer.getLeagueRank(awayTeam, 'highDangerxGoalsFor', '5on4', true);
  const homePPRank = statsAnalyzer.getLeagueRank(homeTeam, 'highDangerxGoalsFor', '5on4', true);
  const awayPKRank = statsAnalyzer.getLeagueRank(awayTeam, 'highDangerxGoalsAgainst', '4on5', false);
  const homePKRank = statsAnalyzer.getLeagueRank(homeTeam, 'highDangerxGoalsAgainst', '4on5', false);

  // Goalie data
  const awayGoalie = game.goalies?.away;
  const homeGoalie = game.goalies?.home;
  const awayGSAE = awayGoalie?.gsae || 0;
  const homeGSAE = homeGoalie?.gsae || 0;
  const goalieEdge = awayGSAE - homeGSAE;
  const leagueGSAE = 1.00;

  // PDO Regression
  const awayRegression = statsAnalyzer.getRegressionIndicators(awayTeam, '5on5');
  const homeRegression = statsAnalyzer.getRegressionIndicators(homeTeam, '5on5');
  
  const awayPDO = awayRegression?.pdo || 100;
  const homePDO = homeRegression?.pdo || 100;
  
  const awayRegressionImpact = awayPDO > 102 ? -((awayPDO - 100) * 0.06) : awayPDO < 98 ? ((100 - awayPDO) * 0.05) : 0;
  const homeRegressionImpact = homePDO > 102 ? -((homePDO - 100) * 0.06) : homePDO < 98 ? ((100 - homePDO) * 0.05) : 0;

  // Calculate edges
  const offenseEdge = Math.abs(awayXGF - homeXGF) > 0.15 ? Math.abs(awayXGF - homeXGF) * 0.4 : 0;
  const defenseEdge = Math.abs(awayXGA - homeXGA) > 0.15 ? Math.abs(awayXGA - homeXGA) * 0.4 : 0;
  const specialTeamsEdge = Math.abs(specialTeamsDiff) > 0.5 ? Math.abs(specialTeamsDiff) * 0.15 : 0;
  const goalieEdgeImpact = Math.abs(goalieEdge) > 0.3 ? Math.abs(goalieEdge) * 0.15 : 0;
  const regressionEdge = Math.abs(awayRegressionImpact - homeRegressionImpact);
  
  const totalEdge = offenseEdge + defenseEdge + specialTeamsEdge + goalieEdgeImpact + regressionEdge;
  const edgeFavoredTeam = (awayXGF - awayXGA + awayRegressionImpact) > (homeXGF - homeXGA + homeRegressionImpact) ? awayTeam : homeTeam;

  // The Four Factors
  const factors = [
    {
      icon: '🎯',
      name: 'OFFENSE',
      subtitle: 'Scoring Ability',
      awayValue: awayXGF,
      homeValue: homeXGF,
      leagueAvg: leagueXGF,
      percentDiff: ((Math.abs(awayXGF - homeXGF) / leagueXGF) * 100).toFixed(1),
      advantage: Math.abs(awayXGF - homeXGF) > 0.15 ? (awayXGF > homeXGF ? awayTeam : homeTeam) : null,
      significance: Math.abs(awayXGF - homeXGF) > 0.25 ? 'high' : Math.abs(awayXGF - homeXGF) > 0.15 ? 'moderate' : 'low',
      format: (val) => val.toFixed(2),
      context: awayHDxGPerGame > homeHDxGPerGame 
        ? `${awayTeam} attacks from high-danger areas`
        : homeHDxGPerGame > awayHDxGPerGame
        ? `${homeTeam} attacks from high-danger areas`
        : 'Both teams generate similar quality chances',
      stats: [
        { label: '📍 Slot', away: awayHDxGPerGame.toFixed(2), home: homeHDxGPerGame.toFixed(2), winner: awayHDxGPerGame > homeHDxGPerGame ? 'away' : 'home' },
        { label: '🔄 Rebound', away: awayReboundxG.toFixed(2), home: homeReboundxG.toFixed(2) }
      ]
    },
    {
      icon: '🛡️',
      name: 'DEFENSE',
      subtitle: 'Goals Prevention',
      awayValue: awayXGA,
      homeValue: homeXGA,
      leagueAvg: leagueXGA,
      percentDiff: ((Math.abs(awayXGA - homeXGA) / leagueXGA) * 100).toFixed(1),
      advantage: Math.abs(awayXGA - homeXGA) > 0.15 ? (awayXGA < homeXGA ? awayTeam : homeTeam) : null,
      significance: Math.abs(awayXGA - homeXGA) > 0.25 ? 'high' : Math.abs(awayXGA - homeXGA) > 0.15 ? 'moderate' : 'low',
      format: (val) => val.toFixed(2),
      context: awayDZGiveaways > 7 
        ? `${awayTeam}'s turnovers lead to odd-man rushes`
        : homeDZGiveaways > 7
        ? `${homeTeam}'s turnovers lead to odd-man rushes`
        : 'Both teams protect the puck well',
      stats: [
        { label: '💀 Turnovers', away: awayDZGiveaways.toFixed(1), home: homeDZGiveaways.toFixed(1), warning: awayDZGiveaways > 7 || homeDZGiveaways > 7 }
      ]
    },
    {
      icon: '🔥',
      name: 'POWER PLAY',
      subtitle: '',
      awayValue: awayPPScore,
      homeValue: homePPScore,
      leagueAvg: leaguePPScore,
      percentDiff: ((Math.abs(specialTeamsDiff) / leaguePPScore) * 100).toFixed(1),
      advantage: Math.abs(specialTeamsDiff) > 0.5 ? (specialTeamsDiff > 0 ? awayTeam : homeTeam) : null,
      significance: Math.abs(specialTeamsDiff) > 1.0 ? 'high' : Math.abs(specialTeamsDiff) > 0.5 ? 'moderate' : 'low',
      format: (val) => val.toFixed(2),
      context: specialTeamsDiff > 0.8 && awayPPRank <= 10 && homePKRank >= 20
        ? `${awayTeam}'s elite PP vs weak penalty kill`
        : specialTeamsDiff < -0.8 && homePPRank <= 10 && awayPKRank >= 20
        ? `${homeTeam}'s elite PP vs weak penalty kill`
        : Math.abs(specialTeamsDiff) > 0.5
        ? `${Math.abs(specialTeamsDiff) > 0.8 ? 'Huge' : 'Clear'} special teams mismatch`
        : 'Special teams evenly matched',
      stats: [
        { label: '📊 Quality', away: `${awayPPHDPercent.toFixed(0)}%`, home: `${homePPHDPercent.toFixed(0)}%`, suffix: 'high-danger' },
        { label: '🎯 Impact', value: `~${Math.abs(specialTeamsDiff * 0.15).toFixed(1)} extra goals` }
      ]
    },
    {
      icon: '🥅',
      name: 'GOALTENDING',
      subtitle: '',
      awayValue: awayGSAE,
      homeValue: homeGSAE,
      leagueAvg: leagueGSAE,
      percentDiff: ((Math.abs(goalieEdge) / leagueGSAE) * 100).toFixed(1),
      advantage: Math.abs(goalieEdge) > 0.3 ? (goalieEdge > 0 ? awayTeam : homeTeam) : null,
      significance: Math.abs(goalieEdge) > 0.5 ? 'high' : Math.abs(goalieEdge) > 0.3 ? 'moderate' : 'low',
      format: (val) => val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2),
      context: Math.abs(goalieEdge) > 0.3
        ? `${goalieEdge > 0 ? awayGoalie?.name || awayTeam : homeGoalie?.name || homeTeam} saves ${Math.abs(goalieEdge * 0.15).toFixed(1)}+ more goals`
        : 'Goaltending evenly matched',
      stats: []
    }
  ];

  // Get best bet recommendation
  const recommendedPlay = bestEdge && bestEdge.evPercent > 5 ? bestEdge : null;

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(16, 24, 40, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
      border: '1px solid rgba(16, 185, 129, 0.2)',
      borderRadius: '12px',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: isMobile ? '0.75rem 1rem' : '1rem 1.25rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(16, 185, 129, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.125rem' }}>⚡</span>
          <span style={{
            fontSize: isMobile ? '0.813rem' : '0.875rem',
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
            padding: '0.25rem 0.625rem',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '6px',
            color: '#10B981',
            fontSize: '0.688rem',
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

      {/* Team Headers - COMPACT */}
      <div style={{
        padding: isMobile ? '0.75rem 1rem' : '1rem 1.25rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{
          fontSize: isMobile ? '0.938rem' : '1.063rem',
          fontWeight: '800',
          color: '#0EA5E9'
        }}>
          {awayTeam} {awayXGF.toFixed(2)}
        </div>
        <div style={{
          fontSize: '0.813rem',
          color: 'var(--color-text-muted)',
          fontWeight: '700'
        }}>
          🆚
        </div>
        <div style={{
          fontSize: isMobile ? '0.938rem' : '1.063rem',
          fontWeight: '800',
          color: '#10B981'
        }}>
          {homeTeam} {homeXGF.toFixed(2)}
        </div>
      </div>

      {/* COMPACT BARS */}
      <div style={{
        padding: isMobile ? '0.75rem 1rem' : '1rem 1.25rem',
        background: 'rgba(0, 0, 0, 0.15)'
      }}>
        {factors.map((factor, idx) => (
          <div key={idx} style={{ 
            marginBottom: idx < factors.length - 1 ? '1.25rem' : 0,
            paddingBottom: idx < factors.length - 1 ? '1.25rem' : 0,
            borderBottom: idx < factors.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none'
          }}>
            {/* Header Row */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.5rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                fontSize: isMobile ? '0.75rem' : '0.813rem',
                fontWeight: '700',
                color: 'var(--color-text-primary)'
              }}>
                <span style={{ fontSize: '0.938rem' }}>{factor.icon}</span>
                <span>{factor.name}</span>
                {factor.subtitle && (
                  <span style={{
                    fontSize: '0.625rem',
                    color: 'var(--color-text-muted)',
                    fontWeight: '600'
                  }}>
                    ({factor.subtitle})
                  </span>
                )}
              </div>
              <div style={{
                fontSize: '0.688rem',
                fontWeight: '700',
                color: factor.significance === 'high' ? '#10B981' : factor.significance === 'moderate' ? '#F59E0B' : 'var(--color-text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                {factor.advantage && `+${factor.percentDiff}%`}
                {factor.significance === 'high' && <span style={{ fontSize: '0.875rem' }}>⚡</span>}
              </div>
            </div>

            {/* Center-Diverging Bar - COMPACT */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              gap: '0.375rem',
              alignItems: 'center',
              marginBottom: '0.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.375rem' }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: factor.advantage === awayTeam ? '#0EA5E9' : 'var(--color-text-secondary)',
                  minWidth: '45px',
                  textAlign: 'right'
                }}>
                  {factor.format(factor.awayValue)}
                </span>
                <div style={{ height: '20px', width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min(100, (factor.awayValue / (factor.leagueAvg * 2)) * 100)}%`,
                    background: factor.advantage === awayTeam
                      ? 'linear-gradient(90deg, #0EA5E9 0%, #3B82F6 100%)'
                      : 'rgba(14, 165, 233, 0.3)',
                    borderRadius: '4px 0 0 4px',
                    boxShadow: factor.advantage === awayTeam ? '0 0 8px rgba(14, 165, 233, 0.4)' : 'none',
                    border: factor.advantage === awayTeam ? '1px solid #60A5FA' : 'none',
                    transition: 'all 0.3s ease'
                  }} />
                </div>
              </div>
              <div style={{ minWidth: '30px', textAlign: 'center', fontSize: '0.75rem' }}>⚖️</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <div style={{ height: '20px', width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min(100, (factor.homeValue / (factor.leagueAvg * 2)) * 100)}%`,
                    background: factor.advantage === homeTeam
                      ? 'linear-gradient(90deg, #10B981 0%, #059669 100%)'
                      : 'rgba(16, 185, 129, 0.3)',
                    borderRadius: '0 4px 4px 0',
                    boxShadow: factor.advantage === homeTeam ? '0 0 8px rgba(16, 185, 129, 0.4)' : 'none',
                    border: factor.advantage === homeTeam ? '1px solid #34D399' : 'none',
                    transition: 'all 0.3s ease'
                  }} />
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: factor.advantage === homeTeam ? '#10B981' : 'var(--color-text-secondary)',
                  minWidth: '45px'
                }}>
                  {factor.format(factor.homeValue)}
                </span>
              </div>
            </div>

            {/* Stats Row */}
            {factor.stats && factor.stats.length > 0 && (
              <div style={{
                fontSize: '0.688rem',
                color: 'var(--color-text-secondary)',
                marginBottom: '0.375rem',
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap'
              }}>
                {factor.stats.map((stat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span>{stat.label}:</span>
                    {stat.away && stat.home ? (
                      <>
                        <span style={{ color: stat.winner === 'away' ? '#0EA5E9' : 'var(--color-text-secondary)' }}>
                          {stat.away}
                        </span>
                        <span style={{ color: 'var(--color-text-muted)' }}>vs</span>
                        <span style={{ color: stat.winner === 'home' ? '#10B981' : 'var(--color-text-secondary)' }}>
                          {stat.home}
                        </span>
                        {stat.suffix && <span style={{ color: 'var(--color-text-muted)' }}>{stat.suffix}</span>}
                        {stat.warning && <span>⚠️</span>}
                        {stat.winner && <span>{stat.winner === 'away' ? '🔥' : '✅'}</span>}
                      </>
                    ) : (
                      <span style={{ color: '#10B981', fontWeight: '600' }}>{stat.value}</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Context - SMART STORYTELLING */}
            {factor.context && (
              <div style={{
                fontSize: '0.688rem',
                color: 'rgba(16, 185, 129, 0.9)',
                fontStyle: 'italic',
                paddingLeft: '1.25rem',
                position: 'relative'
              }}>
                <span style={{
                  position: 'absolute',
                  left: 0,
                  top: 0
                }}>→</span>
                {factor.context}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* PDO REGRESSION - COMPACT */}
      {(Math.abs(awayPDO - 100) > 2 || Math.abs(homePDO - 100) > 2) && (
        <div style={{
          padding: isMobile ? '0.75rem 1rem' : '1rem 1.25rem',
          background: 'rgba(245, 158, 11, 0.08)',
          borderTop: '1px solid rgba(245, 158, 11, 0.2)'
        }}>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: '700',
            color: '#F59E0B',
            marginBottom: '0.625rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem'
          }}>
            <span>🎲</span>
            <span>LUCK FACTOR</span>
            <span style={{ fontSize: '0.625rem', fontWeight: '600', color: 'var(--color-text-muted)' }}>(Regression)</span>
          </div>

          {/* Compact PDO bars */}
          <div style={{ marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.688rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                {awayTeam} {awayPDO.toFixed(1)}
              </span>
              <span style={{ fontSize: '0.625rem', color: awayPDO > 102 ? '#EF4444' : awayPDO < 98 ? '#10B981' : 'var(--color-text-muted)' }}>
                {awayPDO > 102 ? '🔥' : awayPDO < 98 ? '❄️' : '⚖️'} {awayRegressionImpact.toFixed(1)}g
              </span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'rgba(212, 175, 55, 0.5)', zIndex: 2 }} />
              <div style={{
                height: '100%',
                width: `${Math.min(100, ((awayPDO - 94) / 12) * 100)}%`,
                background: awayPDO > 102 ? '#EF4444' : awayPDO < 98 ? '#10B981' : '#6B7280',
                transition: 'width 0.4s ease'
              }} />
            </div>
          </div>

          <div style={{ marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.688rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                {homeTeam} {homePDO.toFixed(1)}
              </span>
              <span style={{ fontSize: '0.625rem', color: homePDO > 102 ? '#EF4444' : homePDO < 98 ? '#10B981' : 'var(--color-text-muted)' }}>
                {homePDO > 102 ? '🔥' : homePDO < 98 ? '❄️' : '⚖️'} {homeRegressionImpact.toFixed(1)}g
              </span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'rgba(212, 175, 55, 0.5)', zIndex: 2 }} />
              <div style={{
                height: '100%',
                width: `${Math.min(100, ((homePDO - 94) / 12) * 100)}%`,
                background: homePDO > 102 ? '#EF4444' : homePDO < 98 ? '#10B981' : '#6B7280',
                transition: 'width 0.4s ease'
              }} />
            </div>
          </div>

          {/* Context */}
          <div style={{
            fontSize: '0.688rem',
            color: 'rgba(245, 158, 11, 0.9)',
            fontStyle: 'italic',
            paddingLeft: '1.25rem',
            position: 'relative'
          }}>
            <span style={{ position: 'absolute', left: 0 }}>→</span>
            {awayPDO > 102 && homePDO < 98 
              ? `${awayTeam} hot streak meets ${homeTeam} bounce-back`
              : homePDO > 102 && awayPDO < 98
              ? `${homeTeam} hot streak meets ${awayTeam} bounce-back`
              : awayPDO > 102
              ? `${awayTeam} is shooting above their skill level`
              : homePDO > 102
              ? `${homeTeam} is shooting above their skill level`
              : awayPDO < 98
              ? `${awayTeam} is due for positive regression`
              : `${homeTeam} is due for positive regression`}
          </div>
        </div>
      )}

      {/* THE EDGE - COMPACT */}
      {totalEdge > 0.2 && (
        <div style={{
          padding: isMobile ? '0.75rem 1rem' : '1rem 1.25rem',
          background: 'rgba(16, 185, 129, 0.08)',
          borderTop: '1px solid rgba(16, 185, 129, 0.2)'
        }}>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: '700',
            color: '#10B981',
            marginBottom: '0.625rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem'
          }}>
            <span>💡</span>
            <span>THE EDGE</span>
          </div>

          {/* Edge bars - inline */}
          <div style={{ marginBottom: '0.75rem' }}>
            {offenseEdge > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.688rem', color: 'var(--color-text-secondary)', minWidth: '80px' }}>✅ Offense</span>
                <div style={{ flex: 1, height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${(offenseEdge / totalEdge) * 100}%`, height: '100%', background: '#10B981' }} />
                </div>
                <span style={{ fontSize: '0.688rem', fontWeight: '700', color: '#10B981', minWidth: '35px', textAlign: 'right' }}>
                  +{offenseEdge.toFixed(2)}
                </span>
              </div>
            )}
            {specialTeamsEdge > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.688rem', color: 'var(--color-text-secondary)', minWidth: '80px' }}>✅ Power Play</span>
                <div style={{ flex: 1, height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${(specialTeamsEdge / totalEdge) * 100}%`, height: '100%', background: '#10B981' }} />
                </div>
                <span style={{ fontSize: '0.688rem', fontWeight: '700', color: '#10B981', minWidth: '35px', textAlign: 'right' }}>
                  +{specialTeamsEdge.toFixed(2)}
                </span>
              </div>
            )}
            {goalieEdgeImpact > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.688rem', color: 'var(--color-text-secondary)', minWidth: '80px' }}>✅ Goalie</span>
                <div style={{ flex: 1, height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${(goalieEdgeImpact / totalEdge) * 100}%`, height: '100%', background: '#10B981' }} />
                </div>
                <span style={{ fontSize: '0.688rem', fontWeight: '700', color: '#10B981', minWidth: '35px', textAlign: 'right' }}>
                  +{goalieEdgeImpact.toFixed(2)}
                </span>
              </div>
            )}
            {regressionEdge > 0.1 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.688rem', color: 'var(--color-text-secondary)', minWidth: '80px' }}>✅ Regression</span>
                <div style={{ flex: 1, height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${(regressionEdge / totalEdge) * 100}%`, height: '100%', background: '#10B981' }} />
                </div>
                <span style={{ fontSize: '0.688rem', fontWeight: '700', color: '#10B981', minWidth: '35px', textAlign: 'right' }}>
                  +{regressionEdge.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* Net edge */}
          <div style={{
            padding: '0.625rem',
            background: 'rgba(16, 185, 129, 0.15)',
            borderRadius: '6px',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            marginBottom: '0.5rem'
          }}>
            {recommendedPlay ? (
              <div>
                <div style={{
                  fontSize: '0.813rem',
                  fontWeight: '900',
                  color: '#10B981',
                  marginBottom: '0.375rem'
                }}>
                  🎯 {recommendedPlay.team} {recommendedPlay.type === 'moneyline' ? 'ML' : recommendedPlay.type === 'spread' ? recommendedPlay.line : `${recommendedPlay.type.toUpperCase()} ${recommendedPlay.line}`} ({recommendedPlay.odds > 0 ? '+' : ''}{recommendedPlay.odds})
                </div>
                <div style={{
                  fontSize: '0.688rem',
                  color: 'var(--color-text-secondary)'
                }}>
                  Net advantage: +{totalEdge.toFixed(2)} goals
                </div>
              </div>
            ) : (
              <div style={{
                fontSize: '0.813rem',
                fontWeight: '900',
                color: '#10B981'
              }}>
                {edgeFavoredTeam} +{totalEdge.toFixed(2)} goals
              </div>
            )}
          </div>

          {/* Final context - WHY */}
          <div style={{
            fontSize: '0.688rem',
            color: 'rgba(16, 185, 129, 0.9)',
            fontStyle: 'italic',
            paddingLeft: '1.25rem',
            position: 'relative',
            lineHeight: '1.4'
          }}>
            <span style={{ position: 'absolute', left: 0 }}>→</span>
            {(() => {
              const advantages = [];
              if (specialTeamsEdge > 0) advantages.push('PP');
              if (goalieEdgeImpact > 0) advantages.push('goalie');
              if (regressionEdge > 0.1) advantages.push('regression');
              if (offenseEdge > 0) advantages.push('offense');
              
              if (advantages.length >= 3) {
                return `${edgeFavoredTeam} wins ${advantages.length} key battles (${advantages.slice(0, 3).join(', ')}). ${awayPDO > 102 || homePDO > 102 ? 'Luck regression tilts the outcome.' : 'Clear multi-factor edge.'}`;
              } else if (specialTeamsEdge > 0.15) {
                return `Power play dominance is the decisive factor. ${edgeFavoredTeam} should capitalize.`;
              } else if (advantages.length > 0) {
                return `${edgeFavoredTeam} has the edge in ${advantages.join(' and ')}.`;
              } else {
                return `${edgeFavoredTeam} is favored but it's a close matchup.`;
              }
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default NHLMatchupIntelligence;
