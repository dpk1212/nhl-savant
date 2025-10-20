import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { EdgeCalculator } from '../utils/edgeCalculator';
import { getTeamName } from '../utils/oddsTraderParser';
import MathBreakdown from './MathBreakdown';
import BetNarrative from './BetNarrative';

const TodaysGames = ({ dataProcessor, oddsData }) => {
  const [edgeCalculator, setEdgeCalculator] = useState(null);
  const [allEdges, setAllEdges] = useState([]);
  const [topEdges, setTopEdges] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

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
    <div style={{ maxWidth: '80rem', margin: '0 auto', padding: isMobile ? '1rem' : '2rem 1rem' }}>
      {/* Header */}
      <div style={{ 
        paddingBottom: isMobile ? '1rem' : '2rem', 
        borderBottom: '1px solid var(--color-border)', 
        marginBottom: isMobile ? '1.5rem' : '2rem' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <Calendar size={isMobile ? 24 : 32} color="var(--color-accent)" />
          <h1>🎯 Today's Games</h1>
        </div>
        <p style={{ 
          color: 'var(--color-text-secondary)', 
          fontSize: isMobile ? '0.875rem' : '0.938rem',
          lineHeight: '1.6',
          maxWidth: '60rem'
        }}>
          In-depth analysis of today's NHL matchups using advanced metrics (xG, PDO, regression analysis) 
          to identify betting edges. Each game includes full mathematical transparency and detailed breakdowns.
        </p>
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
            >
              {/* Game Header */}
              <div style={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between', 
                alignItems: isMobile ? 'flex-start' : 'start', 
                gap: isMobile ? '0.75rem' : '1rem',
                marginBottom: isMobile ? '1.5rem' : '1.5rem',
                paddingBottom: isMobile ? '1rem' : '1rem',
                borderBottom: '1px solid var(--color-border)'
              }}>
                <div>
                  <h2 style={{ 
                    fontSize: isMobile ? '1.375rem' : '1.5rem',
                    fontWeight: '700',
                    marginBottom: '0.375rem',
                    color: 'var(--color-text-primary)'
                  }}>
                    {game.game}
                  </h2>
                  <p style={{ 
                    fontSize: isMobile ? '0.875rem' : '0.938rem',
                    color: 'var(--color-text-muted)',
                    margin: 0
                  }}>
                    {game.gameTime}
                  </p>
                </div>
                {game.edges.total && game.edges.total.predictedTotal != null && (
                  <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
                    <p style={{ 
                      fontSize: '0.75rem', 
                      color: 'var(--color-text-muted)', 
                      marginBottom: '0.25rem', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.05em' 
                    }}>
                      Predicted Total
                    </p>
                    <p style={{ 
                      fontSize: isMobile ? '1.75rem' : '1.5rem', 
                      fontWeight: '700', 
                      color: 'var(--color-accent)',
                      margin: '0 0 0.25rem 0',
                      fontVariantNumeric: 'tabular-nums'
                    }}>
                      {game.edges.total.predictedTotal.toFixed(1)}
                    </p>
                    <p style={{ 
                      fontSize: isMobile ? '0.938rem' : '0.875rem', 
                      color: 'var(--color-text-secondary)',
                      margin: 0
                    }}>
                      Market: {game.edges.total.marketTotal} 
                      <span style={{ 
                        marginLeft: '0.5rem',
                        color: game.edges.total.edge > 0 ? 'var(--color-success)' : 'var(--color-danger)',
                        fontWeight: '600'
                      }}>
                        ({game.edges.total.edge > 0 ? '+' : ''}{game.edges.total.edge.toFixed(1)})
                      </span>
                    </p>
                  </div>
                )}
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

              {/* All Markets Display */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: isMobile ? '1rem' : '1.5rem',
                marginTop: isMobile ? '1.5rem' : '1.5rem'
              }}>
                {/* Moneyline */}
                {game.edges.moneyline?.away && game.edges.moneyline?.home && (
                  <div style={{ 
                    backgroundColor: 'var(--color-background)', 
                    padding: isMobile ? '0.875rem' : '1rem', 
                    borderRadius: '6px', 
                    border: '1px solid var(--color-border)' 
                  }}>
                    <p style={{ 
                      fontSize: '0.75rem', 
                      color: 'var(--color-text-muted)', 
                      marginBottom: '0.75rem', 
                      fontWeight: '600', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.05em' 
                    }}>
                      Moneyline
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: isMobile ? '0.938rem' : '0.875rem' }}>{game.awayTeam}</span>
                      <span 
                        className={game.edges.moneyline.away.evPercent > 0 ? 'metric-number' : ''} 
                        style={{ 
                          color: game.edges.moneyline.away.evPercent > 0 ? 'var(--color-success)' : 'var(--color-text-secondary)',
                          fontWeight: game.edges.moneyline.away.evPercent > 0 ? '700' : '500',
                          fontSize: isMobile ? '0.938rem' : '0.875rem'
                        }}
                      >
                        {game.edges.moneyline.away.odds > 0 ? '+' : ''}{game.edges.moneyline.away.odds} ({(game.edges.moneyline.away.modelProb * 100).toFixed(1)}%)
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: isMobile ? '0.938rem' : '0.875rem' }}>{game.homeTeam}</span>
                      <span 
                        className={game.edges.moneyline.home.evPercent > 0 ? 'metric-number' : ''} 
                        style={{ 
                          color: game.edges.moneyline.home.evPercent > 0 ? 'var(--color-success)' : 'var(--color-text-secondary)',
                          fontWeight: game.edges.moneyline.home.evPercent > 0 ? '700' : '500',
                          fontSize: isMobile ? '0.938rem' : '0.875rem'
                        }}
                      >
                        {game.edges.moneyline.home.odds > 0 ? '+' : ''}{game.edges.moneyline.home.odds} ({(game.edges.moneyline.home.modelProb * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                )}

                {/* Total */}
                {game.edges.total && game.edges.total.over && game.edges.total.under && game.rawOdds.total.line && (
                  <div style={{ 
                    backgroundColor: 'var(--color-background)', 
                    padding: isMobile ? '0.875rem' : '1rem', 
                    borderRadius: '6px', 
                    border: '1px solid var(--color-border)' 
                  }}>
                    <p style={{ 
                      fontSize: '0.75rem', 
                      color: 'var(--color-text-muted)', 
                      marginBottom: '0.75rem', 
                      fontWeight: '600', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.05em' 
                    }}>
                      Total
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: isMobile ? '0.938rem' : '0.875rem' }}>Over {game.rawOdds.total.line}</span>
                      <span 
                        className={game.edges.total.over.evPercent > 0 ? 'metric-number' : ''} 
                        style={{ 
                          color: game.edges.total.over.evPercent > 0 ? 'var(--color-success)' : 'var(--color-text-secondary)',
                          fontWeight: game.edges.total.over.evPercent > 0 ? '700' : '500',
                          fontSize: isMobile ? '0.938rem' : '0.875rem'
                        }}
                      >
                        {game.edges.total.over.odds > 0 ? '+' : ''}{game.edges.total.over.odds} ({game.edges.total.over.modelProb ? (game.edges.total.over.modelProb * 100).toFixed(1) : '0.0'}%)
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: isMobile ? '0.938rem' : '0.875rem' }}>Under {game.rawOdds.total.line}</span>
                      <span 
                        className={game.edges.total.under.evPercent > 0 ? 'metric-number' : ''} 
                        style={{ 
                          color: game.edges.total.under.evPercent > 0 ? 'var(--color-success)' : 'var(--color-text-secondary)',
                          fontWeight: game.edges.total.under.evPercent > 0 ? '700' : '500',
                          fontSize: isMobile ? '0.938rem' : '0.875rem'
                        }}
                      >
                        {game.edges.total.under.odds > 0 ? '+' : ''}{game.edges.total.under.odds} ({game.edges.total.under.modelProb ? (game.edges.total.under.modelProb * 100).toFixed(1) : '0.0'}%)
                      </span>
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
