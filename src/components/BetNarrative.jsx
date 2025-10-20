import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { generateBetNarrative, generateDeepAnalytics, calculateLeagueRank } from '../utils/narrativeGenerator';
import { getTeamName } from '../utils/oddsTraderParser';

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

                  {/* Probability Breakdown */}
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
                      <span>🎯</span> Probability Breakdown
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                          Our Model
                        </div>
                        <div style={{ 
                          fontSize: '1.5rem', 
                          fontWeight: '700',
                          color: 'var(--color-success)'
                        }}>
                          {deepAnalytics.probabilities.model}%
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                          Market Implied
                        </div>
                        <div style={{ 
                          fontSize: '1.5rem', 
                          fontWeight: '700',
                          color: 'var(--color-text-secondary)'
                        }}>
                          {deepAnalytics.probabilities.market}%
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ 
                      marginTop: '0.75rem', 
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
                        color: 'var(--color-success)'
                      }}>
                        +{deepAnalytics.probabilities.edge}%
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                        This is where value comes from!
                      </div>
                    </div>
                  </div>

                  {/* Dollar Value */}
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
                      <span>💰</span> Dollar Value (per $100 bet)
                    </div>
                    
                    <div style={{ marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span style={{ color: 'var(--color-text-secondary)' }}>Expected Return:</span>
                        <span style={{ color: 'var(--color-text-primary)', fontWeight: '600' }}>
                          ${deepAnalytics.dollarValue.expectedReturn}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span style={{ color: 'var(--color-text-secondary)' }}>Market Return:</span>
                        <span style={{ color: 'var(--color-text-secondary)', fontWeight: '600' }}>
                          ${deepAnalytics.dollarValue.marketReturn}
                        </span>
                      </div>
                    </div>
                    
                    <div style={{ 
                      paddingTop: '0.75rem', 
                      borderTop: '1px solid rgba(16, 185, 129, 0.2)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ fontWeight: '700', color: 'var(--color-success)' }}>Expected Profit:</span>
                      <span style={{ 
                        fontSize: '1.25rem', 
                        fontWeight: '700',
                        color: 'var(--color-success)'
                      }}>
                        +${deepAnalytics.dollarValue.ev}
                      </span>
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
