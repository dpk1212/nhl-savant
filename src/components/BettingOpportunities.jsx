import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Target, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { EdgeCalculator } from '../utils/edgeCalculator';

const BettingOpportunities = ({ dataProcessor, oddsData }) => {
  const [regressionCandidates, setRegressionCandidates] = useState({ overperforming: [], underperforming: [] });
  const [specialTeamsMismatches, setSpecialTeamsMismatches] = useState([]);
  const [todaysEdges, setTodaysEdges] = useState([]);
  const [allEdges, setAllEdges] = useState([]);

  useEffect(() => {
    if (dataProcessor) {
      const regression = dataProcessor.findRegressionCandidates();
      setRegressionCandidates(regression);
      
      const mismatches = dataProcessor.findSpecialTeamsMismatches();
      setSpecialTeamsMismatches(mismatches);
      
      // Calculate today's edges if odds data available
      if (oddsData) {
        const calculator = new EdgeCalculator(dataProcessor, oddsData);
        const edges = calculator.getTopEdges(0);
        const allGameEdges = calculator.calculateAllEdges();
        setTodaysEdges(edges.filter(e => e.evPercent > 0));
        setAllEdges(allGameEdges);
      }
    }
  }, [dataProcessor, oddsData]);

  if (!dataProcessor) {
    return <div style={{ padding: '2rem' }}>Loading...</div>;
  }

  return (
    <div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ padding: '3rem 2rem 2rem', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            💎 Betting Opportunities
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
            Today's best value bets based on advanced analytics, plus regression candidates and special teams analysis
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {/* NEW: Today's Value Bets - PRIMARY CONTENT */}
        {todaysEdges.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ 
              fontSize: '1.5rem',
              fontWeight: '700',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              🎯 Today's Value Bets
              <span style={{ 
                fontSize: '0.875rem',
                color: 'var(--color-text-muted)',
                fontWeight: '400'
              }}>
                {todaysEdges.length} opportunities found
              </span>
            </h2>
            
            {/* DESKTOP: Table view */}
            <div className="desktop-only">
              <div style={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Game</th>
                      <th>Market</th>
                      <th>Pick</th>
                      <th>Odds</th>
                      <th>Model Prob</th>
                      <th>EV</th>
                      <th>EV %</th>
                      <th>Kelly Stake</th>
                      <th>Analysis</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todaysEdges.map((edge, index) => (
                      <tr key={index}>
                        <td style={{ fontWeight: '500' }}>{edge.game}</td>
                        <td>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '0.25rem 0.5rem',
                            backgroundColor: edge.market === 'MONEYLINE' ? 'rgba(59, 130, 246, 0.15)' :
                                           edge.market === 'TOTAL' ? 'rgba(168, 85, 247, 0.15)' :
                                           'rgba(234, 179, 8, 0.15)',
                            border: edge.market === 'MONEYLINE' ? '1px solid rgba(59, 130, 246, 0.4)' :
                                    edge.market === 'TOTAL' ? '1px solid rgba(168, 85, 247, 0.4)' :
                                    '1px solid rgba(234, 179, 8, 0.4)',
                            borderRadius: '4px',
                            fontSize: '0.688rem',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            color: edge.market === 'MONEYLINE' ? '#60A5FA' :
                                   edge.market === 'TOTAL' ? '#A78BFA' :
                                   '#FCD34D'
                          }}>
                            {edge.market}
                          </span>
                        </td>
                        <td style={{ fontWeight: '600' }}>{edge.pick}</td>
                        <td className="metric-number">
                          {edge.odds > 0 ? '+' : ''}{edge.odds}
                        </td>
                        <td className="metric-number">
                          {(edge.modelProb * 100).toFixed(1)}%
                        </td>
                        <td className="metric-number" style={{ 
                          color: edge.ev > 0 ? 'var(--color-success)' : 'var(--color-text-secondary)'
                        }}>
                          ${edge.ev.toFixed(2)}
                        </td>
                        <td className="metric-number" style={{ 
                          color: 'var(--color-success)',
                          fontWeight: '700'
                        }}>
                          +{edge.evPercent.toFixed(1)}%
                        </td>
                        <td className="metric-number">
                          {edge.kelly ? `$${(edge.kelly.fractionalKelly * 1000).toFixed(0)}` : 'N/A'}
                        </td>
                        <td>
                          <Link 
                            to="/"
                            style={{
                              color: 'var(--color-accent)',
                              textDecoration: 'none',
                              fontSize: '0.813rem',
                              fontWeight: '600',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            View Details →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* MOBILE: Card view */}
            <div className="mobile-only">
              {todaysEdges.map((edge, index) => {
                const gameData = allEdges.find(g => g.game === edge.game);
                
                return (
                  <div key={index} className="value-bets-mobile-card">
                    {/* Header with bet type badge */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '0.75rem',
                      paddingBottom: '0.75rem',
                      borderBottom: '1px solid var(--color-border)'
                    }}>
                      <div>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '0.25rem 0.5rem',
                          backgroundColor: edge.market === 'MONEYLINE' ? 'rgba(59, 130, 246, 0.15)' :
                                         edge.market === 'TOTAL' ? 'rgba(168, 85, 247, 0.15)' :
                                         'rgba(234, 179, 8, 0.15)',
                          border: edge.market === 'MONEYLINE' ? '1px solid rgba(59, 130, 246, 0.4)' :
                                  edge.market === 'TOTAL' ? '1px solid rgba(168, 85, 247, 0.4)' :
                                  '1px solid rgba(234, 179, 8, 0.4)',
                          borderRadius: '4px',
                          fontSize: '0.688rem',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          color: edge.market === 'MONEYLINE' ? '#60A5FA' :
                                 edge.market === 'TOTAL' ? '#A78BFA' :
                                 '#FCD34D',
                          marginBottom: '0.5rem'
                        }}>
                          {edge.market}
                        </div>
                        <div style={{ 
                          fontSize: '1.125rem', 
                          fontWeight: '700',
                          color: 'var(--color-text-primary)',
                          marginBottom: '0.25rem'
                        }}>
                          {edge.game}
                        </div>
                        <div style={{ 
                          fontSize: '0.938rem',
                          color: 'var(--color-accent)',
                          fontWeight: '600'
                        }}>
                          {edge.pick} {edge.odds > 0 ? '+' : ''}{edge.odds}
                        </div>
                      </div>
                      <div style={{ 
                        fontSize: '1.75rem',
                        fontWeight: '700',
                        color: 'var(--color-success)',
                        textAlign: 'right',
                        lineHeight: 1
                      }}>
                        +{edge.evPercent.toFixed(1)}%
                        <div style={{
                          fontSize: '0.688rem',
                          color: 'var(--color-text-muted)',
                          fontWeight: '500',
                          marginTop: '0.25rem'
                        }}>
                          EV
                        </div>
                      </div>
                    </div>
                    
                    {/* Stats grid */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0.75rem',
                      marginBottom: '0.75rem'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          Model Prob
                        </div>
                        <div style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                          {(edge.modelProb * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          Expected Value
                        </div>
                        <div style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--color-success)' }}>
                          +${edge.ev.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          Kelly Stake ($1K)
                        </div>
                        <div style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                          ${edge.kelly ? (edge.kelly.fractionalKelly * 1000).toFixed(0) : 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          Analysis
                        </div>
                        <Link 
                          to="/"
                          style={{
                            color: 'var(--color-accent)',
                            textDecoration: 'none',
                            fontSize: '1.125rem',
                            fontWeight: '600'
                          }}
                        >
                          View →
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Regression Candidates */}
        <section className="elevated-card" style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            📉 Regression Candidates
          </h2>
          <p style={{
            fontSize: '0.938rem',
            color: 'var(--color-text-secondary)',
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}>
            Teams whose performance is unsustainable based on PDO analysis and expected goals. 
            These teams are likely to regress toward their underlying metrics.
          </p>

          {/* Overperforming Teams */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <TrendingDown size={18} color="var(--color-danger)" />
              Overperforming Teams - Bet UNDER/AGAINST
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--color-text-secondary)',
              marginBottom: '1rem',
            }}>
              Teams exceeding their underlying metrics due to luck. Expected to regress negatively.
            </p>

            {regressionCandidates.overperforming.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Team</th>
                      <th>PDO</th>
                      <th>Regression Score</th>
                      <th>xG Diff</th>
                      <th>Betting Strategy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regressionCandidates.overperforming.map((team, index) => (
                      <tr key={index}>
                        <td style={{ fontWeight: '600' }}>{team.team}</td>
                        <td>
                          <span style={{ 
                            color: team.pdo > 102 ? 'var(--color-danger)' : 'var(--color-text-primary)',
                            fontWeight: team.pdo > 102 ? '600' : '400'
                          }}>
                            {team.pdo.toFixed(1)}
                          </span>
                        </td>
                        <td>
                          <span style={{ 
                            color: team.regressionScore > 5 ? 'var(--color-danger)' : 'var(--color-text-primary)',
                            fontWeight: '600'
                          }}>
                            {team.regressionScore > 0 ? '+' : ''}{team.regressionScore.toFixed(1)}
                          </span>
                        </td>
                        <td className="metric-number">
                          {team.xGDiff > 0 ? '+' : ''}{team.xGDiff.toFixed(2)}
                        </td>
                        <td>
                          <span style={{
                            padding: '0.25rem 0.625rem',
                            backgroundColor: 'rgba(239, 68, 68, 0.15)',
                            border: '1px solid rgba(239, 68, 68, 0.4)',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: 'var(--color-danger)'
                          }}>
                            Fade
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                No significant overperformers identified
              </p>
            )}
          </div>

          {/* Underperforming Teams */}
          <div>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <TrendingUp size={18} color="var(--color-success)" />
              Underperforming Teams - Bet OVER/FOR
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--color-text-secondary)',
              marginBottom: '1rem',
            }}>
              Teams performing below their underlying metrics. Expected to improve.
            </p>

            {regressionCandidates.underperforming.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Team</th>
                      <th>PDO</th>
                      <th>Regression Score</th>
                      <th>xG Diff</th>
                      <th>Betting Strategy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regressionCandidates.underperforming.map((team, index) => (
                      <tr key={index}>
                        <td style={{ fontWeight: '600' }}>{team.team}</td>
                        <td>
                          <span style={{ 
                            color: team.pdo < 98 ? 'var(--color-success)' : 'var(--color-text-primary)',
                            fontWeight: team.pdo < 98 ? '600' : '400'
                          }}>
                            {team.pdo.toFixed(1)}
                          </span>
                        </td>
                        <td>
                          <span style={{ 
                            color: team.regressionScore < -5 ? 'var(--color-success)' : 'var(--color-text-primary)',
                            fontWeight: '600'
                          }}>
                            {team.regressionScore > 0 ? '+' : ''}{team.regressionScore.toFixed(1)}
                          </span>
                        </td>
                        <td className="metric-number">
                          {team.xGDiff > 0 ? '+' : ''}{team.xGDiff.toFixed(2)}
                        </td>
                        <td>
                          <span style={{
                            padding: '0.25rem 0.625rem',
                            backgroundColor: 'rgba(16, 185, 129, 0.15)',
                            border: '1px solid rgba(16, 185, 129, 0.4)',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: 'var(--color-success)'
                          }}>
                            Back
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                No significant underperformers identified
              </p>
            )}
          </div>
        </section>

        {/* Special Teams Mismatches */}
        <section className="elevated-card">
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            ⚡ Special Teams Mismatches
          </h2>
          <p style={{
            fontSize: '0.938rem',
            color: 'var(--color-text-secondary)',
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}>
            Significant advantages in power play offense vs. penalty kill defense matchups.
          </p>

          {specialTeamsMismatches.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Team</th>
                    <th>Opponent</th>
                    <th>PP xGF/60</th>
                    <th>Opp PK xGA/60</th>
                    <th>Advantage</th>
                    <th>Opportunity</th>
                  </tr>
                </thead>
                <tbody>
                  {specialTeamsMismatches.map((mismatch, index) => (
                    <tr key={index}>
                      <td style={{ fontWeight: '600' }}>{mismatch.team}</td>
                      <td>{mismatch.opponent}</td>
                      <td className="metric-number" style={{ color: 'var(--color-success)' }}>
                        {mismatch.ppXGF.toFixed(2)}
                      </td>
                      <td className="metric-number" style={{ color: 'var(--color-danger)' }}>
                        {mismatch.pkXGA.toFixed(2)}
                      </td>
                      <td>
                        <span style={{
                          color: 'var(--color-accent)',
                          fontWeight: '700',
                          fontSize: '0.938rem'
                        }}>
                          {mismatch.advantage.toFixed(2)}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                        {mismatch.opportunity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
              No significant special teams mismatches today
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

export default BettingOpportunities;
