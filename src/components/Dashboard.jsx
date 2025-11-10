import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, BarChart3, Activity, Target, Award } from 'lucide-react';
import DataStatus from './DataStatus';
import NHLGalaxy from './dashboard/NHLGalaxy';
import LeagueHeatmap from './dashboard/LeagueHeatmap';
import ElitePlayerHexGrid from './dashboard/ElitePlayerHexGrid';

const Dashboard = ({ dataProcessor, loading, error }) => {
  const [opportunities, setOpportunities] = useState([]);
  const [leagueStats, setLeagueStats] = useState(null);
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

  useEffect(() => {
    if (dataProcessor) {
      const topOpportunities = dataProcessor.getTopBettingOpportunities();
      setOpportunities(topOpportunities);

      const allTeams = dataProcessor.getTeamsBySituation('all');
      const avgPDO = allTeams.reduce((sum, team) => sum + team.pdo, 0) / allTeams.length;
      const avgXGD = allTeams.reduce((sum, team) => sum + team.xGD_per60, 0) / allTeams.length;
      const regressionCandidates = dataProcessor.findRegressionCandidates();
      
      setLeagueStats({
        totalTeams: allTeams.length,
        avgPDO: avgPDO.toFixed(1),
        avgXGD: avgXGD.toFixed(2),
        overperformingTeams: regressionCandidates.overperforming.length,
        underperformingTeams: regressionCandidates.underperforming.length
      });
    }
  }, [dataProcessor]);

  const getConfidenceColor = (confidence) => {
    if (confidence >= 70) return 'high';
    if (confidence >= 50) return 'medium';
    return 'low';
  };

  return (
    <div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh' }} className="animate-fade-in">
      {/* Premium Header */}
      <div style={{
        padding: isMobile ? '2rem 1rem 1.5rem' : '3rem 2rem 2rem',
        borderBottom: '1px solid var(--color-border)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, var(--color-accent-glow) 0%, transparent 70%)',
          opacity: 0.3,
          pointerEvents: 'none'
        }} />
        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-hover) 100%)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px var(--color-accent-glow)'
            }}>
              <BarChart3 size={24} color="var(--color-background)" strokeWidth={2.5} />
            </div>
            <h1 className="text-gradient" style={{ 
              fontSize: isMobile ? '1.75rem' : '2.25rem',
              fontWeight: '800'
            }}>
              Analytics Dashboard
            </h1>
          </div>
          <p style={{ 
            color: 'var(--color-text-secondary)', 
            fontSize: isMobile ? '0.875rem' : '0.938rem',
            lineHeight: '1.7',
            maxWidth: '800px',
            marginLeft: isMobile ? '0' : '60px'
          }}>
            Real-time statistical overview of betting opportunities based on institutional-grade analytics. 
            Featuring xG differentials, PDO regression, and predictive modeling.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: isMobile ? '1rem' : '2rem'
      }}>
        {/* Data Status */}
        <div style={{ marginBottom: isMobile ? '1.5rem' : '2rem' }}>
          <DataStatus dataProcessor={dataProcessor} loading={loading} error={error} />
        </div>

        {/* ELITE PLAYER HEX GRID - Player Discovery Tool */}
        <ElitePlayerHexGrid isMobile={isMobile} />

        {/* THE CENTERPIECE: NHL Galaxy - Van Gogh Masterpiece */}
        <NHLGalaxy dataProcessor={dataProcessor} isMobile={isMobile} />

        {/* League Heatmap */}
        <LeagueHeatmap dataProcessor={dataProcessor} isMobile={isMobile} />

        {/* REMOVED: Top Betting Opportunities table - redundant with Today's Games page */}

        {/* OLD League Stats Grid - Keep for now but will be removed */}
        {false && leagueStats && (
          <div 
            className="dashboard-stats-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: isMobile ? '0.75rem' : '1rem',
              marginBottom: isMobile ? '1.5rem' : '2rem',
            }}
          >
            <div className="stat-card elevated-card" style={{ 
              padding: isMobile ? '1.25rem' : '1.5rem',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '60px',
                height: '60px',
                opacity: 0.1
              }}>
                <Target size={60} color="var(--color-accent)" />
              </div>
              <div className="stat-card-value metric-number" style={{ 
                fontSize: isMobile ? '2.25rem' : '2.75rem',
                marginBottom: '0.5rem'
              }}>
                {leagueStats.totalTeams}
              </div>
              <div className="stat-card-label" style={{ fontSize: isMobile ? '0.688rem' : '0.75rem' }}>
                TEAMS ANALYZED
              </div>
              <div className="stat-card-description" style={{ fontSize: isMobile ? '0.75rem' : '0.813rem' }}>
                Complete league coverage
              </div>
            </div>

            <div className="stat-card elevated-card" style={{ 
              padding: isMobile ? '1.25rem' : '1.5rem',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '60px',
                height: '60px',
                opacity: 0.1
              }}>
                <Activity size={60} color="var(--color-accent)" />
              </div>
              <div className="stat-card-value metric-number" style={{ 
                fontSize: isMobile ? '2.25rem' : '2.75rem',
                marginBottom: '0.5rem'
              }}>
                {leagueStats.avgPDO}
              </div>
              <div className="stat-card-label" style={{ fontSize: isMobile ? '0.688rem' : '0.75rem' }}>
                AVG PDO
              </div>
              <div className="stat-card-description" style={{ fontSize: isMobile ? '0.75rem' : '0.813rem' }}>
                Luck regression metric
              </div>
            </div>

            <div className="stat-card elevated-card" style={{ 
              padding: isMobile ? '1.25rem' : '1.5rem',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '60px',
                height: '60px',
                opacity: 0.1
              }}>
                <TrendingUp size={60} color="var(--color-accent)" />
              </div>
              <div className="stat-card-value metric-number" style={{ 
                fontSize: isMobile ? '2.25rem' : '2.75rem',
                marginBottom: '0.5rem'
              }}>
                {leagueStats.avgXGD}
              </div>
              <div className="stat-card-label" style={{ fontSize: isMobile ? '0.688rem' : '0.75rem' }}>
                AVG XG DIFFERENTIAL
              </div>
              <div className="stat-card-description" style={{ fontSize: isMobile ? '0.75rem' : '0.813rem' }}>
                Score-adjusted per 60
              </div>
            </div>

            <div className="stat-card elevated-card" style={{ 
              padding: isMobile ? '1.25rem' : '1.5rem',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '60px',
                height: '60px',
                opacity: 0.1
              }}>
                <Award size={60} color="var(--color-accent)" />
              </div>
              <div className="stat-card-value metric-number" style={{ 
                fontSize: isMobile ? '2.25rem' : '2.75rem',
                marginBottom: '0.5rem'
              }}>
                {leagueStats.overperformingTeams + leagueStats.underperformingTeams}
              </div>
              <div className="stat-card-label" style={{ fontSize: isMobile ? '0.688rem' : '0.75rem' }}>
                BETTING EDGES
              </div>
              <div className="stat-card-description" style={{ fontSize: isMobile ? '0.75rem' : '0.813rem' }}>
                PDO anomaly detection
              </div>
            </div>
          </div>
        )}

        {/* REMOVED: Betting Opportunities table - now handled by Today's Games page */}
        {false && (
        <div className="elevated-card">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: isMobile ? '1rem' : '1.5rem'
          }}>
            <h2 style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              fontSize: isMobile ? '1.25rem' : '1.5rem'
            }}>
              <BarChart3 size={isMobile ? 18 : 20} />
              Top Betting Opportunities
            </h2>
            <Link 
              to="/opportunities"
              style={{
                color: 'var(--color-accent)',
                textDecoration: 'none',
                fontSize: isMobile ? '0.813rem' : '0.875rem',
                fontWeight: '600'
              }}
            >
              View All →
            </Link>
          </div>

          {opportunities.length === 0 ? (
            <div style={{ padding: isMobile ? '2rem 1rem' : '3rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--color-text-muted)', fontSize: isMobile ? '0.875rem' : '1rem' }}>
                No significant opportunities found in current data
              </p>
            </div>
          ) : (
            <>
              {/* Desktop: Table */}
              <div className="desktop-only" style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>TEAM</th>
                      <th>TYPE</th>
                      <th>RECOMMENDATION</th>
                      <th>REASON</th>
                      <th style={{ textAlign: 'right' }}>CONFIDENCE</th>
                      <th style={{ textAlign: 'right' }}>EDGE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {opportunities.slice(0, 10).map((opportunity, index) => (
                      <tr key={index}>
                        <td>
                          <span style={{ 
                            fontWeight: 600,
                            color: 'var(--color-text-primary)',
                          }}>
                            {opportunity.team}
                          </span>
                        </td>
                        <td>
                          <span className={
                            opportunity.type === 'REGRESSION' ? 'badge-danger' : 'badge-accent'
                          } style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '2px',
                            fontSize: '0.625rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            border: '1px solid',
                          }}>
                            {opportunity.type.replace('_', ' ')}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {opportunity.recommendation.includes('UNDER') || opportunity.recommendation.includes('AGAINST') ? (
                              <TrendingDown size={14} color="var(--color-danger)" />
                            ) : (
                              <TrendingUp size={14} color="var(--color-success)" />
                            )}
                            <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                              {opportunity.recommendation}
                            </span>
                          </div>
                        </td>
                        <td style={{ fontSize: '0.8125rem', maxWidth: '300px' }}>
                          {opportunity.reason}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{
                              fontWeight: 600,
                              color: 'var(--color-text-primary)',
                              marginBottom: '0.25rem',
                              fontSize: '0.875rem',
                            }}>
                              {opportunity.confidence.toFixed(0)}%
                            </div>
                            <div className="confidence-bar" style={{ width: '60px', marginLeft: 'auto' }}>
                              <div
                                className={`confidence-bar-fill ${getConfidenceColor(opportunity.confidence)}`}
                                style={{ width: `${opportunity.confidence}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span style={{
                            fontWeight: 600,
                            color: 'var(--color-success)',
                            fontSize: '0.875rem',
                          }}>
                            {(opportunity.edge * 100).toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile: Cards */}
              <div className="mobile-only">
                {opportunities.slice(0, 10).map((opportunity, index) => (
                  <div 
                    key={index}
                    style={{
                      backgroundColor: 'var(--color-background)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '6px',
                      padding: '1rem',
                      marginBottom: '0.75rem'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '0.75rem'
                    }}>
                      <div>
                        <div style={{
                          fontSize: '1.125rem',
                          fontWeight: '700',
                          color: 'var(--color-text-primary)',
                          marginBottom: '0.25rem'
                        }}>
                          {opportunity.team}
                        </div>
                        <span className={
                          opportunity.type === 'REGRESSION' ? 'badge-danger' : 'badge-accent'
                        } style={{
                          display: 'inline-block',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '2px',
                          fontSize: '0.625rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          border: '1px solid',
                        }}>
                          {opportunity.type.replace('_', ' ')}
                        </span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{
                          fontSize: '1.5rem',
                          fontWeight: '700',
                          color: 'var(--color-success)',
                          lineHeight: 1
                        }}>
                          {(opportunity.edge * 100).toFixed(1)}%
                        </div>
                        <div style={{
                          fontSize: '0.688rem',
                          color: 'var(--color-text-muted)',
                          marginTop: '0.25rem'
                        }}>
                          Edge
                        </div>
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.5rem'
                    }}>
                      {opportunity.recommendation.includes('UNDER') || opportunity.recommendation.includes('AGAINST') ? (
                        <TrendingDown size={16} color="var(--color-danger)" />
                      ) : (
                        <TrendingUp size={16} color="var(--color-success)" />
                      )}
                      <span style={{
                        fontSize: '0.938rem',
                        fontWeight: '600',
                        color: 'var(--color-text-primary)'
                      }}>
                        {opportunity.recommendation}
                      </span>
                    </div>

                    <p style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-text-secondary)',
                      lineHeight: '1.5',
                      marginBottom: '0.75rem'
                    }}>
                      {opportunity.reason}
                    </p>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid var(--color-border)'
                    }}>
                      <div style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-text-muted)'
                      }}>
                        Confidence
                      </div>
                      <div style={{
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: 'var(--color-text-primary)'
                      }}>
                        {opportunity.confidence.toFixed(0)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
