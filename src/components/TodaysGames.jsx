import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, BarChart3, Activity } from 'lucide-react';
import { EdgeCalculator } from '../utils/edgeCalculator';
import { getTeamName } from '../utils/oddsTraderParser';
import MathBreakdown from './MathBreakdown';
import BetNarrative from './BetNarrative';

const TodaysGames = ({ dataProcessor, oddsData }) => {
  const [edgeCalculator, setEdgeCalculator] = useState(null);
  const [allEdges, setAllEdges] = useState([]);
  const [topEdges, setTopEdges] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedGame, setExpandedGame] = useState(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize edge calculator
  useEffect(() => {
    if (dataProcessor && oddsData) {
      const calculator = new EdgeCalculator(dataProcessor, oddsData);
      setEdgeCalculator(calculator);
      
      const edges = calculator.calculateAllEdges();
      setAllEdges(edges);
      
      const topOpportunities = calculator.getTopEdges(0);
      setTopEdges(topOpportunities);
    }
  }, [dataProcessor, oddsData]);

  if (!oddsData) {
    return (
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: isMobile ? '1rem' : '2rem 1rem' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem', 
          paddingBottom: isMobile ? '1rem' : '2rem', 
          borderBottom: '1px solid var(--color-border)', 
          marginBottom: isMobile ? '1rem' : '2rem' 
        }}>
          <Calendar size={isMobile ? 24 : 32} color="var(--color-accent)" />
          <div>
            <h1 style={{ marginBottom: '0.25rem' }}>🎯 Today's Games</h1>
            <p style={{ 
              color: 'var(--color-text-secondary)', 
              fontSize: isMobile ? '0.875rem' : '0.938rem',
              margin: 0
            }}>
              In-depth analysis of today's matchups with advanced metrics
            </p>
          </div>
        </div>

        <div className="elevated-card" style={{ textAlign: 'center', padding: isMobile ? '2rem 1rem' : '3rem' }}>
          <Calendar size={48} color="var(--color-text-muted)" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>No Games Available</h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Add today's odds files to see game analysis and betting opportunities.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '80rem', margin: '0 auto', padding: isMobile ? '1rem' : '2rem 1rem' }} className="animate-fade-in">
      {/* Premium Header with Stats */}
      <div style={{ 
        paddingBottom: isMobile ? '1.5rem' : '2rem', 
        marginBottom: isMobile ? '1.5rem' : '2rem' 
      }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: isMobile ? '1rem' : '2rem',
          marginBottom: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-hover) 100%)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px var(--color-accent-glow)'
              }}>
                <TrendingUp size={22} color="var(--color-background)" strokeWidth={2.5} />
              </div>
              <h1 className="text-gradient" style={{ fontSize: isMobile ? '1.75rem' : '2rem' }}>Today's Games</h1>
            </div>
            <p style={{ 
              color: 'var(--color-text-secondary)', 
              fontSize: isMobile ? '0.875rem' : '0.938rem',
              lineHeight: '1.7',
              maxWidth: '60rem',
              marginLeft: isMobile ? '0' : '56px'
            }}>
              Institutional-grade analysis using advanced metrics to identify betting edges. 
              Full mathematical transparency with score-adjusted xG, PDO regression, and probabilistic modeling.
            </p>
          </div>
          
          {/* Quick Stats Pills */}
          <div style={{ 
            display: 'flex', 
            gap: '0.75rem',
            flexWrap: 'wrap'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
              padding: '0.5rem 0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <BarChart3 size={16} color="#60A5FA" />
              <span style={{ 
                fontSize: '0.813rem', 
                fontWeight: '600',
                color: '#60A5FA'
              }}>
                {allEdges.length} Games
              </span>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, var(--color-success-bg) 0%, rgba(16, 185, 129, 0.05) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '8px',
              padding: '0.5rem 0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Activity size={16} color="var(--color-success)" />
              <span style={{ 
                fontSize: '0.813rem', 
                fontWeight: '600',
                color: 'var(--color-success)'
              }}>
                {topEdges.filter(e => e.evPercent > 3).length} High Value
              </span>
            </div>
          </div>
        </div>
        
        <div className="divider" style={{ margin: '1.5rem 0 0 0' }} />
      </div>

      {/* Deep Analytics Cards for Each Game */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: isMobile ? '1.5rem' : '2rem' }}>
        {allEdges.map((game, index) => {
          // Find the best edge for this game to show in narrative
          const bestEdge = topEdges
            .filter(e => e.game === game.game && e.evPercent > 0)
            .sort((a, b) => b.evPercent - a.evPercent)[0];

          return (
            <div 
              key={index}
              id={`game-${game.game.replace(/\s/g, '-')}`}
              className="elevated-card game-card"
              style={{
                animationDelay: `${index * 0.1}s`,
                position: 'relative'
              }}
            >
              {/* Premium Game Header */}
              <div style={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between', 
                alignItems: isMobile ? 'flex-start' : 'center', 
                gap: isMobile ? '1rem' : '1.5rem',
                marginBottom: isMobile ? '1.5rem' : '1.75rem',
                paddingBottom: isMobile ? '1rem' : '1.25rem',
                borderBottom: '1px solid var(--color-border)',
                position: 'relative'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <div style={{
                      width: '4px',
                      height: '28px',
                      background: 'linear-gradient(180deg, var(--color-accent) 0%, var(--color-accent-hover) 100%)',
                      borderRadius: '2px',
                      boxShadow: '0 0 8px var(--color-accent-glow)'
                    }} />
                    <h2 style={{ 
                      fontSize: isMobile ? '1.375rem' : '1.5rem',
                      fontWeight: '700',
                      color: 'var(--color-text-primary)',
                      letterSpacing: '-0.02em'
                    }}>
                      {game.game}
                    </h2>
                  </div>
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    marginLeft: '1rem'
                  }}>
                    <Calendar size={14} color="var(--color-text-muted)" />
                    <p style={{ 
                      fontSize: '0.875rem',
                      color: 'var(--color-text-muted)',
                      margin: 0,
                      fontWeight: '500'
                    }}>
                      {game.gameTime}
                    </p>
                  </div>
                </div>
                {game.edges.total && game.edges.total.predictedTotal != null && (() => {
                  // Calculate individual team scores
                  const awayScore = dataProcessor.predictTeamScore(game.awayTeam, game.homeTeam);
                  const homeScore = dataProcessor.predictTeamScore(game.homeTeam, game.awayTeam);
                  
                  return (
                    <div style={{ 
                      textAlign: isMobile ? 'left' : 'right',
                      background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(212, 175, 55, 0.03) 100%)',
                      border: '1px solid rgba(212, 175, 55, 0.2)',
                      borderRadius: '8px',
                      padding: isMobile ? '0.875rem 1rem' : '1rem 1.25rem',
                      minWidth: isMobile ? '100%' : '220px'
                    }}>
                      {/* Header - More Prominent */}
                      <div style={{ 
                        fontSize: '0.625rem', 
                        color: 'rgba(212, 175, 55, 0.8)', 
                        marginBottom: '1rem', 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.15em',
                        fontWeight: '800',
                        textAlign: 'center',
                        borderBottom: '2px solid rgba(212, 175, 55, 0.2)',
                        paddingBottom: '0.5rem'
                      }}>
                        Model Prediction
                      </div>
                      
                      {/* Individual Team Scores - DRAMATICALLY ENHANCED */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.625rem',
                        marginBottom: '1rem'
                      }}>
                        {/* Away Team */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.5rem 0.75rem',
                          background: 'rgba(59, 130, 246, 0.08)',
                          borderLeft: '3px solid rgba(59, 130, 246, 0.5)',
                          borderRadius: '4px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ 
                              fontSize: '0.625rem',
                              fontWeight: '700',
                              color: 'rgba(59, 130, 246, 0.7)',
                              textTransform: 'uppercase',
                              letterSpacing: '0.08em',
                              minWidth: '35px'
                            }}>
                              Away
                            </span>
                            <span style={{ 
                              fontSize: '1rem',
                              fontWeight: '700',
                              color: 'var(--color-text-primary)',
                              letterSpacing: '-0.02em'
                            }}>
                              {game.awayTeam}
                            </span>
                          </div>
                          <span style={{ 
                            fontSize: '1.625rem',
                            fontFeatureSettings: "'tnum'",
                            fontWeight: '900',
                            color: 'var(--color-accent)',
                            textShadow: '0 2px 8px rgba(212, 175, 55, 0.3)',
                            letterSpacing: '-0.03em'
                          }}>
                            {awayScore.toFixed(1)}
                          </span>
                        </div>

                        {/* Home Team */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.5rem 0.75rem',
                          background: 'rgba(251, 146, 60, 0.08)',
                          borderLeft: '3px solid rgba(251, 146, 60, 0.5)',
                          borderRadius: '4px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ 
                              fontSize: '0.625rem',
                              fontWeight: '700',
                              color: 'rgba(251, 146, 60, 0.7)',
                              textTransform: 'uppercase',
                              letterSpacing: '0.08em',
                              minWidth: '35px'
                            }}>
                              Home
                            </span>
                            <span style={{ 
                              fontSize: '1rem',
                              fontWeight: '700',
                              color: 'var(--color-text-primary)',
                              letterSpacing: '-0.02em'
                            }}>
                              {game.homeTeam}
                            </span>
                          </div>
                          <span style={{ 
                            fontSize: '1.625rem',
                            fontFeatureSettings: "'tnum'",
                            fontWeight: '900',
                            color: 'var(--color-accent)',
                            textShadow: '0 2px 8px rgba(212, 175, 55, 0.3)',
                            letterSpacing: '-0.03em'
                          }}>
                            {homeScore.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Total & Market - Compact & Clear */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.375rem',
                        marginBottom: '0.75rem',
                        padding: '0.75rem',
                        background: 'rgba(0, 0, 0, 0.25)',
                        borderRadius: '6px'
                      }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'baseline'
                        }}>
                          <span style={{ 
                            fontSize: '0.75rem',
                            color: 'rgba(212, 175, 55, 0.7)',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}>
                            Total
                          </span>
                          <span style={{ 
                            fontSize: '2rem',
                            fontWeight: '900', 
                            color: 'var(--color-accent)',
                            fontFeatureSettings: "'tnum'",
                            textShadow: '0 2px 12px rgba(212, 175, 55, 0.4)',
                            lineHeight: '1',
                            letterSpacing: '-0.04em'
                          }}>
                            {game.edges.total.predictedTotal.toFixed(1)}
                          </span>
                        </div>
                        
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingTop: '0.375rem',
                          borderTop: '1px solid rgba(212, 175, 55, 0.15)'
                        }}>
                          <span style={{ 
                            fontSize: '0.688rem',
                            color: 'var(--color-text-muted)',
                            fontWeight: '500'
                          }}>
                            vs Market {game.edges.total.marketTotal}
                          </span>
                          <span style={{ 
                            fontSize: '0.813rem',
                            fontWeight: '700',
                            fontFeatureSettings: "'tnum'",
                            color: game.edges.total.edge > 0 ? 'var(--color-success)' : 'var(--color-danger)'
                          }}>
                            ({game.edges.total.edge > 0 ? '+' : ''}{game.edges.total.edge.toFixed(1)})
                          </span>
                        </div>
                      </div>
                      
                      {/* Edge - MAXIMUM PROMINENCE */}
                      <div style={{
                        textAlign: 'center',
                        padding: '0.75rem',
                        background: game.edges.total.edge > 0 
                          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.08) 100%)' 
                          : 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.08) 100%)',
                        border: game.edges.total.edge > 0 
                          ? '2px solid rgba(16, 185, 129, 0.4)' 
                          : '2px solid rgba(239, 68, 68, 0.4)',
                        borderRadius: '8px',
                        boxShadow: game.edges.total.edge > 0.3 
                          ? '0 4px 16px rgba(16, 185, 129, 0.25)' 
                          : 'none'
                      }}>
                        <div style={{ 
                          fontSize: '0.625rem',
                          color: game.edges.total.edge > 0 ? 'rgba(16, 185, 129, 0.8)' : 'rgba(239, 68, 68, 0.8)',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '0.12em',
                          marginBottom: '0.25rem'
                        }}>
                          Edge
                        </div>
                        <div style={{ 
                          fontSize: '1.875rem',
                          fontWeight: '900',
                          color: game.edges.total.edge > 0 ? 'var(--color-success)' : 'var(--color-danger)',
                          fontFeatureSettings: "'tnum'",
                          letterSpacing: '-0.04em',
                          lineHeight: '1',
                          textShadow: game.edges.total.edge > 0 
                            ? '0 2px 12px rgba(16, 185, 129, 0.4)' 
                            : '0 2px 12px rgba(239, 68, 68, 0.4)'
                        }}>
                          {game.edges.total.edge > 0 ? '+' : ''}{game.edges.total.edge.toFixed(1)}
                          {game.edges.total.edge > 0.5 && ' 🟢'}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Best Bet Narrative with Badge */}
              {bestEdge && (
                <BetNarrative 
                  game={game} 
                  edge={bestEdge} 
                  dataProcessor={dataProcessor} 
                  variant="full"
                  expandable={false}
                />
              )}

              {/* Premium Markets Display */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: isMobile ? '1rem' : '1.5rem',
                marginTop: isMobile ? '1.5rem' : '1.75rem'
              }}>
                {/* Moneyline - Enhanced */}
                {game.edges.moneyline?.away && game.edges.moneyline?.home && (
                  <div style={{ 
                    background: 'linear-gradient(135deg, rgba(21, 25, 35, 0.6) 0%, rgba(26, 31, 46, 0.4) 100%)',
                    padding: isMobile ? '1rem' : '1.25rem', 
                    borderRadius: '8px', 
                    border: '1px solid var(--color-border)',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '3px',
                      height: '100%',
                      background: 'linear-gradient(180deg, rgba(59, 130, 246, 0.6) 0%, transparent 100%)'
                    }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                      <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#60A5FA',
                        boxShadow: '0 0 8px rgba(96, 165, 250, 0.5)'
                      }} />
                      <p style={{ 
                        fontSize: '0.688rem', 
                        color: '#60A5FA', 
                        margin: 0,
                        fontWeight: '700', 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.1em' 
                      }}>
                        Moneyline
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.5rem 0',
                        borderBottom: '1px solid rgba(100, 116, 139, 0.1)'
                      }}>
                        <span style={{ 
                          fontSize: isMobile ? '0.938rem' : '0.875rem',
                          fontWeight: '500',
                          color: 'var(--color-text-primary)'
                        }}>
                          {game.awayTeam}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span 
                            className="metric-number"
                            style={{ 
                              color: game.edges.moneyline.away.evPercent > 0 ? 'var(--color-success)' : 'var(--color-text-secondary)',
                              fontWeight: '700',
                              fontSize: isMobile ? '0.938rem' : '0.875rem'
                            }}
                          >
                            {game.edges.moneyline.away.odds > 0 ? '+' : ''}{game.edges.moneyline.away.odds}
                          </span>
                          <span style={{
                            fontSize: '0.75rem',
                            color: 'var(--color-text-muted)',
                            fontWeight: '500'
                          }}>
                            ({(game.edges.moneyline.away.modelProb * 100).toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.5rem 0'
                      }}>
                        <span style={{ 
                          fontSize: isMobile ? '0.938rem' : '0.875rem',
                          fontWeight: '500',
                          color: 'var(--color-text-primary)'
                        }}>
                          {game.homeTeam}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span 
                            className="metric-number"
                            style={{ 
                              color: game.edges.moneyline.home.evPercent > 0 ? 'var(--color-success)' : 'var(--color-text-secondary)',
                              fontWeight: '700',
                              fontSize: isMobile ? '0.938rem' : '0.875rem'
                            }}
                          >
                            {game.edges.moneyline.home.odds > 0 ? '+' : ''}{game.edges.moneyline.home.odds}
                          </span>
                          <span style={{
                            fontSize: '0.75rem',
                            color: 'var(--color-text-muted)',
                            fontWeight: '500'
                          }}>
                            ({(game.edges.moneyline.home.modelProb * 100).toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Total - Enhanced */}
                {game.edges.total && game.edges.total.over && game.edges.total.under && game.rawOdds.total.line && (
                  <div style={{ 
                    background: 'linear-gradient(135deg, rgba(21, 25, 35, 0.6) 0%, rgba(26, 31, 46, 0.4) 100%)',
                    padding: isMobile ? '1rem' : '1.25rem', 
                    borderRadius: '8px', 
                    border: '1px solid var(--color-border)',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '3px',
                      height: '100%',
                      background: 'linear-gradient(180deg, rgba(168, 85, 247, 0.6) 0%, transparent 100%)'
                    }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                      <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#A78BFA',
                        boxShadow: '0 0 8px rgba(167, 139, 250, 0.5)'
                      }} />
                      <p style={{ 
                        fontSize: '0.688rem', 
                        color: '#A78BFA', 
                        margin: 0,
                        fontWeight: '700', 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.1em' 
                      }}>
                        Total
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.5rem 0',
                        borderBottom: '1px solid rgba(100, 116, 139, 0.1)'
                      }}>
                        <span style={{ 
                          fontSize: isMobile ? '0.938rem' : '0.875rem',
                          fontWeight: '500',
                          color: 'var(--color-text-primary)'
                        }}>
                          Over {game.rawOdds.total.line}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span 
                            className="metric-number"
                            style={{ 
                              color: game.edges.total.over.evPercent > 0 ? 'var(--color-success)' : 'var(--color-text-secondary)',
                              fontWeight: '700',
                              fontSize: isMobile ? '0.938rem' : '0.875rem'
                            }}
                          >
                            {game.edges.total.over.odds > 0 ? '+' : ''}{game.edges.total.over.odds}
                          </span>
                          <span style={{
                            fontSize: '0.75rem',
                            color: 'var(--color-text-muted)',
                            fontWeight: '500'
                          }}>
                            ({game.edges.total.over.modelProb ? (game.edges.total.over.modelProb * 100).toFixed(1) : '0.0'}%)
                          </span>
                        </div>
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.5rem 0'
                      }}>
                        <span style={{ 
                          fontSize: isMobile ? '0.938rem' : '0.875rem',
                          fontWeight: '500',
                          color: 'var(--color-text-primary)'
                        }}>
                          Under {game.rawOdds.total.line}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span 
                            className="metric-number"
                            style={{ 
                              color: game.edges.total.under.evPercent > 0 ? 'var(--color-success)' : 'var(--color-text-secondary)',
                              fontWeight: '700',
                              fontSize: isMobile ? '0.938rem' : '0.875rem'
                            }}
                          >
                            {game.edges.total.under.odds > 0 ? '+' : ''}{game.edges.total.under.odds}
                          </span>
                          <span style={{
                            fontSize: '0.75rem',
                            color: 'var(--color-text-muted)',
                            fontWeight: '500'
                          }}>
                            ({game.edges.total.under.modelProb ? (game.edges.total.under.modelProb * 100).toFixed(1) : '0.0'}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Mathematical Breakdown */}
              {game.edges.total && game.rawOdds.total && game.rawOdds.total.line && (
                <div style={{ marginTop: isMobile ? '1.5rem' : '1.5rem' }}>
                  <MathBreakdown 
                    awayTeam={game.awayTeam}
                    homeTeam={game.homeTeam}
                    total={game.rawOdds.total}
                    dataProcessor={dataProcessor} 
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* No games message */}
      {allEdges.length === 0 && (
        <div className="elevated-card" style={{ textAlign: 'center', padding: isMobile ? '2rem 1rem' : '3rem' }}>
          <Calendar size={48} color="var(--color-text-muted)" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>No Games Today</h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Check back later for today's matchups and analysis.
          </p>
        </div>
      )}
    </div>
  );
};

export default TodaysGames;
