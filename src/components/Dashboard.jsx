import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import DataStatus from './DataStatus';

const Dashboard = ({ dataProcessor, loading, error }) => {
  const [opportunities, setOpportunities] = useState([]);
  const [leagueStats, setLeagueStats] = useState(null);

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
    <div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh' }}>
      {/* Clean Header */}
      <div style={{
        padding: '3rem 2rem 2rem',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1 style={{ marginBottom: '0.5rem' }}>NHL Analytics Dashboard</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
            Advanced metrics and betting opportunities based on xG analysis and regression modeling
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {/* Data Status */}
        <div style={{ marginBottom: '2rem' }}>
          <DataStatus dataProcessor={dataProcessor} loading={loading} error={error} />
        </div>

        {/* League Stats Grid */}
        {leagueStats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}>
            <div className="stat-card">
              <div className="stat-card-value metric-number">{leagueStats.totalTeams}</div>
              <div className="stat-card-label">TEAMS ANALYZED</div>
              <div className="stat-card-description">Across all situations</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-value metric-number">{leagueStats.avgPDO}</div>
              <div className="stat-card-label">AVG PDO</div>
              <div className="stat-card-description">100 = neutral luck</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-value metric-number">{leagueStats.avgXGD}</div>
              <div className="stat-card-label">AVG XG DIFFERENTIAL</div>
              <div className="stat-card-description">Per 60 minutes</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-value metric-number">
                {leagueStats.overperformingTeams + leagueStats.underperformingTeams}
              </div>
              <div className="stat-card-label">BETTING EDGES</div>
              <div className="stat-card-description">Identified opportunities</div>
            </div>
          </div>
        )}

        {/* Betting Opportunities Table */}
        <div className="card">
          <div className="card-header">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart3 size={20} />
              Top Betting Opportunities
            </h2>
          </div>

          {opportunities.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--color-text-muted)' }}>
                No significant opportunities found in current data
              </p>
            </div>
          ) : (
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
          )}
        </div>

        {/* Analysis Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1rem',
          marginTop: '2rem',
        }}>
          <div className="card">
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Regression Analysis</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem' }}>Overperforming Teams</span>
                  <span style={{ 
                    fontWeight: 700,
                    color: 'var(--color-danger)',
                    fontSize: '1.125rem',
                  }}>
                    {leagueStats?.overperformingTeams || 0}
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Due for negative regression
                </p>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem' }}>Underperforming Teams</span>
                  <span style={{ 
                    fontWeight: 700,
                    color: 'var(--color-success)',
                    fontSize: '1.125rem',
                  }}>
                    {leagueStats?.underperformingTeams || 0}
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Due for positive regression
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Model Performance</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem' }}>Data Points</span>
                  <span style={{ 
                    fontWeight: 700,
                    color: 'var(--color-accent)',
                    fontSize: '1.125rem',
                  }}>
                    {dataProcessor?.processedData?.length || 0}
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Total rows processed
                </p>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem' }}>Game Situations</span>
                  <span style={{ 
                    fontWeight: 700,
                    color: 'var(--color-accent)',
                    fontSize: '1.125rem',
                  }}>
                    5
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  5v5, PP, PK, All, Other
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
