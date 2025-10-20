import { useState, useEffect } from 'react';
import { Target, TrendingUp, TrendingDown } from 'lucide-react';

const BettingOpportunities = ({ dataProcessor }) => {
  const [regressionCandidates, setRegressionCandidates] = useState({ overperforming: [], underperforming: [] });
  const [specialTeamsMismatches, setSpecialTeamsMismatches] = useState([]);

  useEffect(() => {
    if (dataProcessor) {
      const regression = dataProcessor.findRegressionCandidates();
      setRegressionCandidates(regression);
      
      const mismatches = dataProcessor.findSpecialTeamsMismatches();
      setSpecialTeamsMismatches(mismatches);
    }
  }, [dataProcessor]);

  if (!dataProcessor) {
    return <div style={{ padding: '2rem' }}>Loading...</div>;
  }

  return (
    <div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ padding: '3rem 2rem 2rem', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1 style={{ marginBottom: '0.5rem' }}>Betting Opportunities</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
            Identified edges based on regression analysis and special teams mismatches
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {/* Regression Candidates */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-header">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={20} />
              Regression Candidates
            </h2>
          </div>

          {/* Overperforming Teams */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              fontSize: '1rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <TrendingDown size={16} color="var(--color-danger)" />
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
              <table className="data-table">
                <thead>
                  <tr>
                    <th>TEAM</th>
                    <th style={{ textAlign: 'right' }}>PDO</th>
                    <th style={{ textAlign: 'right' }}>SHOOTING EFF</th>
                    <th style={{ textAlign: 'right' }}>REGRESSION SCORE</th>
                    <th>RECOMMENDATION</th>
                  </tr>
                </thead>
                <tbody>
                  {regressionCandidates.overperforming.map((team, index) => (
                    <tr key={index}>
                      <td><span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{team.name}</span></td>
                      <td style={{ textAlign: 'right', fontFeatureSettings: "'tnum'" }}>
                        {team.pdo?.toFixed(1) || 'N/A'}
                      </td>
                      <td style={{ textAlign: 'right', fontFeatureSettings: "'tnum'" }}>
                        {team.shooting_efficiency?.toFixed(3) || 'N/A'}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span style={{
                          fontWeight: 700,
                          color: 'var(--color-danger)',
                          fontFeatureSettings: "'tnum'",
                        }}>
                          +{team.regression_score?.toFixed(1) || '0.0'}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8125rem' }}>
                        Bet UNDER team totals or AGAINST on moneyline
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', padding: '2rem', textAlign: 'center' }}>
                No overperforming teams identified
              </p>
            )}
          </div>

          {/* Underperforming Teams */}
          <div>
            <h3 style={{
              fontSize: '1rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <TrendingUp size={16} color="var(--color-success)" />
              Underperforming Teams - Bet OVER/WITH
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--color-text-secondary)',
              marginBottom: '1rem',
            }}>
              Teams below their underlying metrics due to bad luck. Expected to regress positively.
            </p>

            {regressionCandidates.underperforming.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>TEAM</th>
                    <th style={{ textAlign: 'right' }}>PDO</th>
                    <th style={{ textAlign: 'right' }}>SHOOTING EFF</th>
                    <th style={{ textAlign: 'right' }}>REGRESSION SCORE</th>
                    <th>RECOMMENDATION</th>
                  </tr>
                </thead>
                <tbody>
                  {regressionCandidates.underperforming.map((team, index) => (
                    <tr key={index}>
                      <td><span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{team.name}</span></td>
                      <td style={{ textAlign: 'right', fontFeatureSettings: "'tnum'" }}>
                        {team.pdo?.toFixed(1) || 'N/A'}
                      </td>
                      <td style={{ textAlign: 'right', fontFeatureSettings: "'tnum'" }}>
                        {team.shooting_efficiency?.toFixed(3) || 'N/A'}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span style={{
                          fontWeight: 700,
                          color: 'var(--color-success)',
                          fontFeatureSettings: "'tnum'",
                        }}>
                          {team.regression_score?.toFixed(1) || '0.0'}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8125rem' }}>
                        Bet OVER team totals or WITH them on moneyline
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', padding: '2rem', textAlign: 'center' }}>
                No underperforming teams identified
              </p>
            )}
          </div>
        </div>

        {/* Special Teams Mismatches */}
        <div className="card">
          <div className="card-header">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={20} />
              Special Teams Mismatches
            </h2>
          </div>

          <p style={{
            fontSize: '0.875rem',
            color: 'var(--color-text-secondary)',
            marginBottom: '1rem',
          }}>
            Elite power plays vs. weak penalty kills create high-value betting opportunities
          </p>

          {specialTeamsMismatches.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>PP TEAM</th>
                  <th>PK TEAM</th>
                  <th style={{ textAlign: 'right' }}>PP xG/60</th>
                  <th style={{ textAlign: 'right' }}>PK xGA/60</th>
                  <th style={{ textAlign: 'right' }}>MISMATCH</th>
                  <th>RECOMMENDATION</th>
                </tr>
              </thead>
              <tbody>
                {specialTeamsMismatches.slice(0, 10).map((mismatch, index) => (
                  <tr key={index}>
                    <td><span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{mismatch.ppTeam}</span></td>
                    <td><span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{mismatch.pkTeam}</span></td>
                    <td style={{ textAlign: 'right', color: 'var(--color-success)', fontFeatureSettings: "'tnum'" }}>
                      {mismatch.ppEfficiency?.toFixed(2) || 'N/A'}
                    </td>
                    <td style={{ textAlign: 'right', color: 'var(--color-danger)', fontFeatureSettings: "'tnum'" }}>
                      {mismatch.pkEfficiency?.toFixed(2) || 'N/A'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span style={{
                        fontWeight: 700,
                        color: 'var(--color-warning)',
                        fontFeatureSettings: "'tnum'",
                      }}>
                        +{mismatch.mismatch?.toFixed(2) || '0.00'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8125rem' }}>
                      {mismatch.recommendation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', padding: '2rem', textAlign: 'center' }}>
              No significant special teams mismatches identified
            </p>
          )}
        </div>

        {/* Methodology Note */}
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: 'rgba(212, 175, 55, 0.05)',
          border: '1px solid var(--color-accent)',
          borderRadius: '4px',
        }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            <strong style={{ color: 'var(--color-accent)' }}>Note:</strong> Regression scores calculated using PDO deviation and shooting efficiency.
            Positive scores indicate overperformance (bet against), negative scores indicate underperformance (bet with).
            Special teams mismatches identify power play vs. penalty kill xG differentials exceeding 2.0 per 60 minutes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BettingOpportunities;
