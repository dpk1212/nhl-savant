import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { generateBetNarrative, generateDeepAnalytics, calculateLeagueRank } from '../utils/narrativeGenerator';
import { getTeamName } from '../utils/oddsTraderParser';
import StatComparisonBar from './StatComparisonBar';

/**
 * BetNarrative Component - Displays narrative explanations for betting picks
 * WITH DEEP ANALYTICS EXPANSION
 */
const BetNarrative = ({ game, edge, dataProcessor, variant = 'full', expandable = false }) => {
  const [isExpanded, setIsExpanded] = useState(!expandable);
  const [showDeepDive, setShowDeepDive] = useState(false);

  const narrative = generateBetNarrative(game, edge, dataProcessor);
  const deepAnalytics = generateDeepAnalytics(game, edge, dataProcessor);

  // CRITICAL FIX: Smart percentile display - shows "Top X%" or "Bottom X%" based on actual ranking
  const getPercentileDisplay = (percentile) => {
    const pct = parseFloat(percentile);
    
    // High percentile (>50%) = Top half = show as "Top X%"
    // Low percentile (≤50%) = Bottom half = show as "Bottom X%"
    if (pct >= 50) {
      return `Top ${pct}%`;
    } else {
      // For bottom half, show from bottom (e.g., 3% → "Bottom 97%")
      return `Bottom ${(100 - pct).toFixed(0)}%`;
    }
  };

  if (!narrative) return null;

  // Compact variant for table rows
  if (variant === 'compact') {
    return (
      <div style={{ 
        fontSize: '0.813rem', 
        color: 'var(--color-text-secondary)',
        lineHeight: '1.5',
        padding: '0.5rem 0'
      }}>
        <span style={{ marginRight: '0.5rem' }}>{narrative.icon}</span>
        <span>{narrative.headline}</span>
      </div>
    );
  }

  // Get team data for visual stats
  const away_5v5 = dataProcessor.getTeamData(game.awayTeam, '5on5');
  const home_5v5 = dataProcessor.getTeamData(game.homeTeam, '5on5');

  // Full variant for game cards WITH DEEP ANALYTICS
  return (
    <div style={{
      backgroundColor: 'rgba(212, 175, 55, 0.08)',
      border: '1px solid rgba(212, 175, 55, 0.2)',
      borderRadius: '6px',
      padding: '1rem',
      marginBottom: '1rem'
    }}>
      {/* BET TYPE BADGE - Makes it crystal clear which bet this is */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.75rem',
        marginBottom: '0.75rem',
        flexWrap: 'wrap' 
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '0.375rem 0.75rem',
          backgroundColor: edge.market === 'MONEYLINE' ? 'rgba(59, 130, 246, 0.15)' :
                           edge.market === 'TOTAL' ? 'rgba(168, 85, 247, 0.15)' :
                           'rgba(234, 179, 8, 0.15)',
          border: edge.market === 'MONEYLINE' ? '1px solid rgba(59, 130, 246, 0.4)' :
                  edge.market === 'TOTAL' ? '1px solid rgba(168, 85, 247, 0.4)' :
                  '1px solid rgba(234, 179, 8, 0.4)',
          borderRadius: '6px',
          fontSize: '0.75rem',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: edge.market === 'MONEYLINE' ? '#60A5FA' :
                 edge.market === 'TOTAL' ? '#A78BFA' :
                 '#FCD34D'
        }}>
          <span style={{ marginRight: '0.375rem' }}>
            {edge.market === 'MONEYLINE' ? '🏒' : 
             edge.market === 'TOTAL' ? '📊' : 
             '↕️'}
          </span>
          {edge.market} BET
        </div>
        
        <div style={{
          fontSize: '0.938rem',
          fontWeight: '700',
          color: 'var(--color-accent)'
        }}>
          {edge.pick} {edge.odds > 0 ? '+' : ''}{edge.odds}
        </div>
      </div>

      {expandable ? (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            textAlign: 'left'
          }}
        >
          <div style={{ 
            fontSize: '1rem',
            fontWeight: '600',
            color: 'var(--color-text-primary)',
            lineHeight: '1.5',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem'
          }}>
            <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{narrative.icon}</span>
            <span>{narrative.headline}</span>
          </div>
          {isExpanded ? 
            <ChevronUp size={20} color="var(--color-accent)" style={{ flexShrink: 0, marginLeft: '0.5rem' }} /> : 
            <ChevronDown size={20} color="var(--color-accent)" style={{ flexShrink: 0, marginLeft: '0.5rem' }} />
          }
        </button>
      ) : (
        <div style={{ 
          fontSize: '1rem',
          fontWeight: '600',
          color: 'var(--color-text-primary)',
          lineHeight: '1.5',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.5rem',
          marginBottom: '0.75rem'
        }}>
          <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{narrative.icon}</span>
          <span>{narrative.headline}</span>
        </div>
      )}

      {isExpanded && (
        <>
          {/* Enhanced bullets with visual indicators */}
          {narrative.bullets.length > 0 && (
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: expandable ? '0.75rem 0 0 0' : '0.5rem 0 0 0',
              fontSize: '0.875rem',
              lineHeight: '1.8',
              color: 'var(--color-text-secondary)'
            }}>
              {narrative.bullets.map((bullet, index) => {
                // Extract xG values for visual bars
                const xgMatch = bullet.match(/(\d+\.\d+) xG[FA]\/60/);
                const rankMatch = bullet.match(/#(\d+)/);
                
                return (
                  <li key={index} style={{ 
                    paddingLeft: '1.5rem',
                    position: 'relative',
                    marginBottom: '0.25rem'
                  }}>
                    <span style={{
                      position: 'absolute',
                      left: '0',
                      color: 'var(--color-accent)',
                      fontWeight: '700'
                    }}>•</span>
                    {bullet}
                    
                    {/* Add visual bar for xG stats */}
                    {xgMatch && away_5v5 && home_5v5 && (
                      <div style={{ 
                        marginTop: '0.25rem', 
                        marginLeft: '0',
                        height: '4px',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        borderRadius: '2px',
                        overflow: 'hidden',
                        width: '120px'
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${Math.min(100, (parseFloat(xgMatch[1]) / 4) * 100)}%`,
                          backgroundColor: parseFloat(xgMatch[1]) > 2.7 ? 'var(--color-success)' : 
                                         parseFloat(xgMatch[1]) > 2.3 ? 'var(--color-warning)' : 
                                         'var(--color-danger)',
                          transition: 'width 0.3s ease'
                        }}></div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          {/* Deep Analytics Expandable Section */}
          {deepAnalytics && (
            <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(212, 175, 55, 0.2)', paddingTop: '1rem' }}>
              <button
                onClick={() => setShowDeepDive(!showDeepDive)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  background: 'rgba(212, 175, 55, 0.15)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '4px',
                  padding: '0.75rem',
                  cursor: 'pointer',
                  color: 'var(--color-accent)',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.15)';
                }}
              >
                {showDeepDive ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                <span>{showDeepDive ? 'Hide' : 'Show'} Deep Analytics</span>
              </button>

              {showDeepDive && (
                <div style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
                  {/* Statistical Rankings */}
                  <div style={{ 
                    backgroundColor: 'var(--color-background)', 
                    padding: '0.875rem', 
                    borderRadius: '6px',
                    marginBottom: '0.75rem',
                    border: '1px solid var(--color-border)'
                  }}>
                    <div style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: '700',
                      color: 'var(--color-accent)',
                      marginBottom: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span>📊</span> Statistical Rankings
                    </div>
                    
                    <div style={{ marginBottom: '0.75rem' }}>
                      <div style={{ fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>
                        {getTeamName(game.awayTeam)} Offense:
                      </div>
                      <div style={{ color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
                        #{deepAnalytics.rankings.away.offense.rank} of {deepAnalytics.rankings.away.offense.total} 
                        <span style={{ color: 'var(--color-accent)', marginLeft: '0.5rem' }}>
                          ({getPercentileDisplay(deepAnalytics.rankings.away.offense.percentile)})
                        </span>
                      </div>
                      <div style={{ 
                        fontFamily: 'monospace', 
                        fontSize: '0.813rem',
                        letterSpacing: '0.05em',
                        color: 'var(--color-success)'
                      }}>
                        {deepAnalytics.rankings.away.offense.bar}
                      </div>
                    </div>

                    <div style={{ marginBottom: '0.75rem' }}>
                      <div style={{ fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>
                        {getTeamName(game.homeTeam)} Defense:
                      </div>
                      <div style={{ color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
                        #{deepAnalytics.rankings.home.defense.rank} of {deepAnalytics.rankings.home.defense.total}
                        <span style={{ color: 'var(--color-accent)', marginLeft: '0.5rem' }}>
                          ({getPercentileDisplay(deepAnalytics.rankings.home.defense.percentile)})
                        </span>
                      </div>
                      <div style={{ 
                        fontFamily: 'monospace', 
                        fontSize: '0.813rem',
                        letterSpacing: '0.05em',
                        color: deepAnalytics.rankings.home.defense.percentile > 70 ? 'var(--color-success)' : 
                               deepAnalytics.rankings.home.defense.percentile > 40 ? 'var(--color-warning)' : 
                               'var(--color-danger)'
                      }}>
                        {deepAnalytics.rankings.home.defense.bar}
                      </div>
                    </div>
                  </div>

                  {/* Advanced Matchup Analysis - Stat Comparison Bars */}
                  <div style={{ 
                    backgroundColor: 'var(--color-background)', 
                    padding: '0.875rem', 
                    borderRadius: '6px',
                    marginBottom: '0.75rem',
                    border: '1px solid var(--color-border)'
                  }}>
                    <div style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: '700',
                      color: 'var(--color-accent)',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span>🔬</span> Advanced Matchup Analysis
                    </div>

                    {(() => {
                      // Get team data for comparison
                      const away_5v5 = dataProcessor.getTeamData(game.awayTeam, '5on5');
                      const home_5v5 = dataProcessor.getTeamData(game.homeTeam, '5on5');
                      const away_PP = dataProcessor.getTeamData(game.awayTeam, '5on4');
                      const home_PP = dataProcessor.getTeamData(game.homeTeam, '5on4');
                      const away_PK = dataProcessor.getTeamData(game.awayTeam, '4on5');
                      const home_PK = dataProcessor.getTeamData(game.homeTeam, '4on5');
                      const away_all = dataProcessor.getTeamData(game.awayTeam, 'all');
                      const home_all = dataProcessor.getTeamData(game.homeTeam, 'all');

                      if (!away_5v5 || !home_5v5) return null;

                      // Calculate league averages for context
                      const calculateLeagueAvg = (situation, field) => {
                        const teams = dataProcessor.getTeamsBySituation(situation);
                        if (!teams || teams.length === 0) return null;
                        const validValues = teams.map(t => t[field]).filter(v => v != null && !isNaN(v));
                        if (validValues.length === 0) return null;
                        return validValues.reduce((sum, val) => sum + val, 0) / validValues.length;
                      };

                      const leagueAvg_xGF = calculateLeagueAvg('5on5', 'scoreAdj_xGF_per60') || calculateLeagueAvg('5on5', 'xGF_per60');
                      const leagueAvg_xGA = calculateLeagueAvg('5on5', 'scoreAdj_xGA_per60') || calculateLeagueAvg('5on5', 'xGA_per60');
                      const leagueAvg_PP = calculateLeagueAvg('5on4', 'scoreAdj_xGF_per60') || calculateLeagueAvg('5on4', 'xGF_per60');
                      const leagueAvg_PK = calculateLeagueAvg('4on5', 'scoreAdj_xGA_per60') || calculateLeagueAvg('4on5', 'xGA_per60');
                      const leagueAvg_PDO = 100.0;  // PDO league average is always 100

                      return (
                        <>
                          <StatComparisonBar
                            label="Offensive Firepower"
                            team1Name={game.awayTeam}
                            team1Value={away_5v5.scoreAdj_xGF_per60 || away_5v5.xGF_per60 || 0}
                            team2Name={game.homeTeam}
                            team2Value={home_5v5.scoreAdj_xGF_per60 || home_5v5.xGF_per60 || 0}
                            metric="xGF/60"
                            higherIsBetter={true}
                            leagueAverage={leagueAvg_xGF}
                          />

                          <StatComparisonBar
                            label="Defensive Strength"
                            team1Name={game.awayTeam}
                            team1Value={away_5v5.scoreAdj_xGA_per60 || away_5v5.xGA_per60 || 0}
                            team2Name={game.homeTeam}
                            team2Value={home_5v5.scoreAdj_xGA_per60 || home_5v5.xGA_per60 || 0}
                            metric="xGA/60"
                            higherIsBetter={false}
                            note1="Lower is better"
                            note2="Lower is better"
                            leagueAverage={leagueAvg_xGA}
                          />

                          {away_PP && home_PP && (
                            <StatComparisonBar
                              label="Power Play Efficiency"
                              team1Name={game.awayTeam}
                              team1Value={away_PP.scoreAdj_xGF_per60 || away_PP.xGF_per60 || 0}
                              team2Name={game.homeTeam}
                              team2Value={home_PP.scoreAdj_xGF_per60 || home_PP.xGF_per60 || 0}
                              metric="PP xGF/60"
                              higherIsBetter={true}
                              leagueAverage={leagueAvg_PP}
                            />
                          )}

                          {away_PK && home_PK && (
                            <StatComparisonBar
                              label="Penalty Kill Defense"
                              team1Name={game.awayTeam}
                              team1Value={away_PK.scoreAdj_xGA_per60 || away_PK.xGA_per60 || 0}
                              team2Name={game.homeTeam}
                              team2Value={home_PK.scoreAdj_xGA_per60 || home_PK.xGA_per60 || 0}
                              metric="PK xGA/60"
                              higherIsBetter={false}
                              note1="Lower is better"
                              note2="Lower is better"
                              leagueAverage={leagueAvg_PK}
                            />
                          )}

                          {away_all && home_all && (
                            <StatComparisonBar
                              label="Luck/Regression Indicator"
                              team1Name={game.awayTeam}
                              team1Value={away_all.pdo || 100}
                              team2Name={game.homeTeam}
                              team2Value={home_all.pdo || 100}
                              metric="PDO"
                              higherIsBetter={false}
                              note1={away_all.pdo > 102 ? "Due to regress" : away_all.pdo < 98 ? "Due to improve" : ""}
                              note2={home_all.pdo > 102 ? "Due to regress" : home_all.pdo < 98 ? "Due to improve" : ""}
                              leagueAverage={leagueAvg_PDO}
                            />
                          )}
                        </>
                      );
                    })()}
                  </div>

                  {/* RECOMMENDED BET - New Prominent Section */}
                  <div style={{ 
                    backgroundColor: 'rgba(212, 175, 55, 0.12)', 
                    padding: '1rem', 
                    borderRadius: '8px',
                    marginBottom: '0.75rem',
                    border: '2px solid rgba(212, 175, 55, 0.4)',
                    boxShadow: '0 4px 12px rgba(212, 175, 55, 0.2)'
                  }}>
                    <div style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: '700',
                      color: 'var(--color-accent)',
                      marginBottom: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span>💰</span> RECOMMENDED BET
                    </div>
                    
                    {/* Large, centered bet display */}
                    <div style={{
                      fontSize: '1.125rem',
                      fontWeight: '700',
                      color: 'var(--color-text-primary)',
                      textAlign: 'center',
                      marginBottom: '0.75rem',
                      padding: '0.75rem',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      borderRadius: '6px',
                      border: '1px solid rgba(212, 175, 55, 0.3)'
                    }}>
                      {edge.pick} at {edge.odds > 0 ? '+' : ''}{edge.odds} odds
                    </div>
                    
                    {/* EV and Model Prob - side by side */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '1rem',
                      marginBottom: '0.75rem'
                    }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                          Expected Value
                        </div>
                        <div style={{ 
                          fontSize: '1.5rem', 
                          fontWeight: '700',
                          color: 'var(--color-success)',
                          fontFeatureSettings: "'tnum'"
                        }}>
                          +{edge.evPercent ? edge.evPercent.toFixed(1) : '0.0'}%
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                          Model Probability
                        </div>
                        <div style={{ 
                          fontSize: '1.5rem', 
                          fontWeight: '700',
                          color: 'var(--color-accent)',
                          fontFeatureSettings: "'tnum'"
                        }}>
                          {edge.modelProb ? (edge.modelProb * 100).toFixed(1) : '0.0'}%
                        </div>
                      </div>
                    </div>
                    
                    {/* Expected Profit */}
                    <div style={{
                      paddingTop: '0.75rem',
                      borderTop: '1px solid rgba(212, 175, 55, 0.2)',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                        Expected Profit (per $100 bet)
                      </div>
                      <div style={{ 
                        fontSize: '1.375rem', 
                        fontWeight: '800',
                        color: 'var(--color-success)',
                        fontFeatureSettings: "'tnum'"
                      }}>
                        +${deepAnalytics.dollarValue.ev}
                      </div>
                    </div>
                  </div>

                  {/* Probability Analysis - Enhanced */}
                  <div style={{ 
                    backgroundColor: 'var(--color-background)', 
                    padding: '0.875rem', 
                    borderRadius: '6px',
                    marginBottom: '0.75rem',
                    border: '1px solid var(--color-border)'
                  }}>
                    <div style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: '700',
                      color: 'var(--color-accent)',
                      marginBottom: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span>🎯</span> Probability Analysis
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                          Our Model
                        </div>
                        <div style={{ 
                          fontSize: '1.375rem', 
                          fontWeight: '700',
                          color: 'var(--color-success)',
                          fontFeatureSettings: "'tnum'"
                        }}>
                          {deepAnalytics.probabilities.model}%
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                          Market Implied
                        </div>
                        <div style={{ 
                          fontSize: '1.375rem', 
                          fontWeight: '700',
                          color: 'var(--color-text-secondary)',
                          fontFeatureSettings: "'tnum'"
                        }}>
                          {deepAnalytics.probabilities.market}%
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ 
                      paddingTop: '0.75rem', 
                      borderTop: '1px solid var(--color-border)',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                        Probability Edge
                      </div>
                      <div style={{ 
                        fontSize: '1.25rem', 
                        fontWeight: '700',
                        color: 'var(--color-success)',
                        fontFeatureSettings: "'tnum'"
                      }}>
                        +{deepAnalytics.probabilities.edge}%
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem', fontStyle: 'italic' }}>
                        This is where value comes from!
                      </div>
                    </div>
                  </div>

                  {/* Expected Return Details */}
                  <div style={{ 
                    backgroundColor: 'rgba(16, 185, 129, 0.08)', 
                    padding: '0.875rem', 
                    borderRadius: '6px',
                    marginBottom: '0.75rem',
                    border: '1px solid rgba(16, 185, 129, 0.2)'
                  }}>
                    <div style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: '700',
                      color: 'var(--color-success)',
                      marginBottom: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span>📊</span> Expected Return Details
                    </div>
                    
                    <div style={{ marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                        <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Expected Return:</span>
                        <span style={{ color: 'var(--color-text-primary)', fontWeight: '600', fontFeatureSettings: "'tnum'" }}>
                          ${deepAnalytics.dollarValue.expectedReturn}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                        <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Market Return:</span>
                        <span style={{ color: 'var(--color-text-secondary)', fontWeight: '600', fontFeatureSettings: "'tnum'" }}>
                          ${deepAnalytics.dollarValue.marketReturn}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Risk Assessment */}
                  <div style={{ 
                    backgroundColor: 'var(--color-background)', 
                    padding: '0.875rem', 
                    borderRadius: '6px',
                    marginBottom: '0.75rem',
                    border: '1px solid var(--color-border)'
                  }}>
                    <div style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: '700',
                      color: 'var(--color-accent)',
                      marginBottom: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span>🎲</span> Risk Assessment
                    </div>
                    
                    <div style={{ marginBottom: '0.5rem' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                        Confidence Level
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: 'var(--color-accent)', fontSize: '1.125rem' }}>
                          {'●'.repeat(deepAnalytics.confidence.stars)}{'○'.repeat(5 - deepAnalytics.confidence.stars)}
                        </span>
                        <span style={{ fontWeight: '700', color: 'var(--color-text-primary)' }}>
                          {deepAnalytics.confidence.level}
                        </span>
                      </div>
                    </div>
                    
                    <div style={{ fontSize: '0.813rem', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                      <div>Sample Size: <strong>{deepAnalytics.confidence.sampleSize} games</strong> (
                        {deepAnalytics.confidence.sampleSize > 35 ? 'Strong' : 
                         deepAnalytics.confidence.sampleSize > 20 ? 'Moderate' : 'Limited'}
                      )</div>
                      <div>PDO Volatility: <strong>{deepAnalytics.confidence.pdoStability}</strong> (
                        {deepAnalytics.confidence.pdoStability < 3 ? 'Stable' : 
                         deepAnalytics.confidence.pdoStability < 5 ? 'Moderate' : 'Volatile'}
                      )</div>
                    </div>
                  </div>

                  {/* Recommended Bet Sizing */}
                  <div style={{ 
                    backgroundColor: 'var(--color-background)', 
                    padding: '0.875rem', 
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)'
                  }}>
                    <div style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: '700',
                      color: 'var(--color-accent)',
                      marginBottom: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span>💵</span> Recommended Bet Sizing (Kelly)
                    </div>
                    
                    <div style={{ fontSize: '0.813rem', color: 'var(--color-text-secondary)', lineHeight: '1.8' }}>
                      <div style={{ marginBottom: '0.5rem' }}>
                        <strong>Kelly Criterion:</strong> {deepAnalytics.kelly.full.toFixed(2)}% of bankroll
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
                        <div style={{ 
                          padding: '0.5rem', 
                          backgroundColor: 'rgba(212, 175, 55, 0.08)',
                          borderRadius: '4px',
                          border: '1px solid rgba(212, 175, 55, 0.2)'
                        }}>
                          <div style={{ fontSize: '0.688rem', color: 'var(--color-text-muted)' }}>
                            On $1,000 bankroll
                          </div>
                          <div style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--color-accent)' }}>
                            ${deepAnalytics.kelly.stake1k}
                          </div>
                        </div>
                        <div style={{ 
                          padding: '0.5rem', 
                          backgroundColor: 'rgba(212, 175, 55, 0.08)',
                          borderRadius: '4px',
                          border: '1px solid rgba(212, 175, 55, 0.2)'
                        }}>
                          <div style={{ fontSize: '0.688rem', color: 'var(--color-text-muted)' }}>
                            On $5,000 bankroll
                          </div>
                          <div style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--color-accent)' }}>
                            ${deepAnalytics.kelly.stake5k}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BetNarrative;
