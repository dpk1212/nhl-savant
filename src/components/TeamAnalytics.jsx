import { useState, useEffect } from 'react';
import { BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TeamAnalytics = ({ dataProcessor }) => {
  const [selectedTeam, setSelectedTeam] = useState('');
  const [allSituations, setAllSituations] = useState(null);
  const [teams, setTeams] = useState([]);
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
      const uniqueTeams = [...new Set(dataProcessor.processedData.map(d => d.name))].sort();
      setTeams(uniqueTeams);
      if (uniqueTeams.length > 0) {
        setSelectedTeam(uniqueTeams[0]);
      }
    }
  }, [dataProcessor]);

  useEffect(() => {
    if (dataProcessor && selectedTeam) {
      const situations = {
        all: dataProcessor.processedData.find(d => d.name === selectedTeam && d.situation === 'all'),
        fiveOnFive: dataProcessor.processedData.find(d => d.name === selectedTeam && d.situation === '5on5'),
        powerPlay: dataProcessor.processedData.find(d => d.name === selectedTeam && d.situation === '5on4'),
        penaltyKill: dataProcessor.processedData.find(d => d.name === selectedTeam && d.situation === '4on5'),
      };
      setAllSituations(situations);
    }
  }, [dataProcessor, selectedTeam]);

  if (!dataProcessor || !allSituations) {
    return (
      <div style={{ 
        padding: isMobile ? '1rem' : '2rem',
        textAlign: 'center',
        color: 'var(--color-text-muted)'
      }}>
        Loading team data...
      </div>
    );
  }

  const chartData = [
    { name: '5v5', xGF: allSituations.fiveOnFive?.xGF_per60 || 0, xGA: allSituations.fiveOnFive?.xGA_per60 || 0 },
    { name: 'PP', xGF: allSituations.powerPlay?.xGF_per60 || 0, xGA: allSituations.powerPlay?.xGA_per60 || 0 },
    { name: 'PK', xGF: allSituations.penaltyKill?.xGF_per60 || 0, xGA: allSituations.penaltyKill?.xGA_per60 || 0 },
  ];

  return (
    <div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ 
        padding: isMobile ? '2rem 1rem 1rem' : '3rem 2rem 2rem', 
        borderBottom: '1px solid var(--color-border)' 
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1 style={{ 
            marginBottom: '0.5rem',
            fontSize: isMobile ? '1.5rem' : '2rem'
          }}>
            🏒 Team Analytics
          </h1>
          <p style={{ 
            color: 'var(--color-text-secondary)', 
            fontSize: isMobile ? '0.875rem' : '0.938rem',
            lineHeight: '1.6'
          }}>
            Detailed performance metrics and situational breakdowns for every team in the league.
          </p>
        </div>
      </div>

      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: isMobile ? '1rem' : '2rem'
      }}>
        {/* Team Selector */}
        <div style={{ marginBottom: isMobile ? '1.5rem' : '2rem' }}>
          <label style={{
            display: 'block',
            fontSize: isMobile ? '0.688rem' : '0.75rem',
            fontWeight: 600,
            color: 'var(--color-text-secondary)',
            marginBottom: '0.5rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            Select Team
          </label>
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="mobile-touch-target"
            style={{
              padding: isMobile ? '0.75rem' : '0.5rem',
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '4px',
              color: 'var(--color-text-primary)',
              fontSize: isMobile ? '1rem' : '0.875rem',
              minWidth: isMobile ? '100%' : '200px',
              cursor: 'pointer'
            }}
          >
            {teams.map(team => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
        </div>

        {/* Key Metrics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: isMobile ? '0.75rem' : '1rem',
          marginBottom: isMobile ? '1.5rem' : '2rem',
        }}>
          <div className="stat-card elevated-card" style={{ padding: isMobile ? '1rem' : '1.25rem' }}>
            <div className="stat-card-value metric-number" style={{ fontSize: isMobile ? '1.75rem' : '2.25rem' }}>
              {allSituations.all?.xGD_per60.toFixed(2)}
            </div>
            <div className="stat-card-label" style={{ fontSize: isMobile ? '0.688rem' : '0.75rem' }}>
              XG DIFFERENTIAL
            </div>
            <div className="stat-card-description" style={{ fontSize: isMobile ? '0.75rem' : '0.813rem' }}>
              Per 60 minutes
            </div>
          </div>

          <div className="stat-card elevated-card" style={{ padding: isMobile ? '1rem' : '1.25rem' }}>
            <div className="stat-card-value metric-number" style={{ fontSize: isMobile ? '1.75rem' : '2.25rem' }}>
              {allSituations.all?.pdo.toFixed(1)}
            </div>
            <div className="stat-card-label" style={{ fontSize: isMobile ? '0.688rem' : '0.75rem' }}>
              PDO
            </div>
            <div className="stat-card-description" style={{ fontSize: isMobile ? '0.75rem' : '0.813rem' }}>
              {allSituations.all?.pdo > 102 ? 'Overperforming' : allSituations.all?.pdo < 98 ? 'Underperforming' : 'Neutral'}
            </div>
          </div>

          <div className="stat-card elevated-card" style={{ padding: isMobile ? '1rem' : '1.25rem' }}>
            <div className="stat-card-value metric-number" style={{ fontSize: isMobile ? '1.75rem' : '2.25rem' }}>
              {allSituations.all?.regressionScore.toFixed(1)}
            </div>
            <div className="stat-card-label" style={{ fontSize: isMobile ? '0.688rem' : '0.75rem' }}>
              REGRESSION SCORE
            </div>
            <div className="stat-card-description" style={{ fontSize: isMobile ? '0.75rem' : '0.813rem' }}>
              Likelihood of mean reversion
            </div>
          </div>
        </div>

        {/* Visual Chart */}
        <div className="elevated-card" style={{ marginBottom: isMobile ? '1.5rem' : '2rem' }}>
          <h2 style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            marginBottom: isMobile ? '1rem' : '1.5rem',
            fontSize: isMobile ? '1.125rem' : '1.25rem'
          }}>
            <BarChart3 size={isMobile ? 18 : 20} />
            Expected Goals by Situation
          </h2>
          <div 
            className="team-analytics-chart"
            style={{ 
              width: '100%', 
              height: isMobile ? '250px' : '300px'
            }}
          >
            <ResponsiveContainer>
              <BarChart 
                data={chartData}
                margin={isMobile ? 
                  { top: 10, right: 10, left: -20, bottom: 5 } : 
                  { top: 20, right: 30, left: 20, bottom: 5 }
                }
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="name" 
                  stroke="var(--color-text-muted)" 
                  style={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
                />
                <YAxis 
                  stroke="var(--color-text-muted)" 
                  style={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '4px',
                    fontSize: isMobile ? '0.75rem' : '0.813rem'
                  }}
                />
                <Bar dataKey="xGF" fill="var(--color-success)" name="xG For" />
                <Bar dataKey="xGA" fill="var(--color-danger)" name="xG Against" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Metrics by Situation */}
        <div className="elevated-card">
          <h2 style={{ 
            marginBottom: isMobile ? '1rem' : '1.5rem',
            fontSize: isMobile ? '1.125rem' : '1.25rem'
          }}>
            Detailed Metrics
          </h2>

          {/* Desktop: Table */}
          <div className="desktop-only mobile-scroll-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>SITUATION</th>
                  <th style={{ textAlign: 'right' }}>XGF/60</th>
                  <th style={{ textAlign: 'right' }}>XGA/60</th>
                  <th style={{ textAlign: 'right' }}>XG DIFF</th>
                  <th style={{ textAlign: 'right' }}>PDO</th>
                  <th style={{ textAlign: 'right' }}>SHOOTING %</th>
                  <th style={{ textAlign: 'right' }}>SAVE %</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600 }}>All Situations</td>
                  <td className="metric-number" style={{ textAlign: 'right' }}>{allSituations.all?.xGF_per60.toFixed(2)}</td>
                  <td className="metric-number" style={{ textAlign: 'right' }}>{allSituations.all?.xGA_per60.toFixed(2)}</td>
                  <td className="metric-number" style={{ textAlign: 'right', color: allSituations.all?.xGD_per60 > 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                    {allSituations.all?.xGD_per60.toFixed(2)}
                  </td>
                  <td className="metric-number" style={{ textAlign: 'right' }}>{allSituations.all?.pdo.toFixed(1)}</td>
                  <td className="metric-number" style={{ textAlign: 'right' }}>{allSituations.all?.shootingEfficiency.toFixed(1)}%</td>
                  <td className="metric-number" style={{ textAlign: 'right' }}>{allSituations.all?.savePerformance.toFixed(1)}%</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>5-on-5</td>
                  <td className="metric-number" style={{ textAlign: 'right' }}>{allSituations.fiveOnFive?.xGF_per60.toFixed(2)}</td>
                  <td className="metric-number" style={{ textAlign: 'right' }}>{allSituations.fiveOnFive?.xGA_per60.toFixed(2)}</td>
                  <td className="metric-number" style={{ textAlign: 'right', color: allSituations.fiveOnFive?.xGD_per60 > 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                    {allSituations.fiveOnFive?.xGD_per60.toFixed(2)}
                  </td>
                  <td className="metric-number" style={{ textAlign: 'right' }}>{allSituations.fiveOnFive?.pdo.toFixed(1)}</td>
                  <td className="metric-number" style={{ textAlign: 'right' }}>{allSituations.fiveOnFive?.shootingEfficiency.toFixed(1)}%</td>
                  <td className="metric-number" style={{ textAlign: 'right' }}>{allSituations.fiveOnFive?.savePerformance.toFixed(1)}%</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Power Play</td>
                  <td className="metric-number" style={{ textAlign: 'right' }}>{allSituations.powerPlay?.xGF_per60.toFixed(2)}</td>
                  <td className="metric-number" style={{ textAlign: 'right' }}>{allSituations.powerPlay?.xGA_per60.toFixed(2)}</td>
                  <td className="metric-number" style={{ textAlign: 'right', color: allSituations.powerPlay?.xGD_per60 > 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                    {allSituations.powerPlay?.xGD_per60.toFixed(2)}
                  </td>
                  <td className="metric-number" style={{ textAlign: 'right' }}>{allSituations.powerPlay?.pdo.toFixed(1)}</td>
                  <td className="metric-number" style={{ textAlign: 'right' }}>{allSituations.powerPlay?.shootingEfficiency.toFixed(1)}%</td>
                  <td className="metric-number" style={{ textAlign: 'right' }}>{allSituations.powerPlay?.savePerformance.toFixed(1)}%</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Penalty Kill</td>
                  <td className="metric-number" style={{ textAlign: 'right' }}>{allSituations.penaltyKill?.xGF_per60.toFixed(2)}</td>
                  <td className="metric-number" style={{ textAlign: 'right' }}>{allSituations.penaltyKill?.xGA_per60.toFixed(2)}</td>
                  <td className="metric-number" style={{ textAlign: 'right', color: allSituations.penaltyKill?.xGD_per60 > 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                    {allSituations.penaltyKill?.xGD_per60.toFixed(2)}
                  </td>
                  <td className="metric-number" style={{ textAlign: 'right' }}>{allSituations.penaltyKill?.pdo.toFixed(1)}</td>
                  <td className="metric-number" style={{ textAlign: 'right' }}>{allSituations.penaltyKill?.shootingEfficiency.toFixed(1)}%</td>
                  <td className="metric-number" style={{ textAlign: 'right' }}>{allSituations.penaltyKill?.savePerformance.toFixed(1)}%</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile: Cards */}
          <div className="mobile-only">
            {[
              { label: 'All Situations', data: allSituations.all },
              { label: '5-on-5', data: allSituations.fiveOnFive },
              { label: 'Power Play', data: allSituations.powerPlay },
              { label: 'Penalty Kill', data: allSituations.penaltyKill }
            ].map(({ label, data }, index) => (
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
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: '700',
                  marginBottom: '0.75rem',
                  color: 'var(--color-text-primary)'
                }}>
                  {label}
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                  fontSize: '0.875rem'
                }}>
                  <div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>xGF/60</div>
                    <div className="metric-number" style={{ fontWeight: '600' }}>{data?.xGF_per60.toFixed(2)}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>xGA/60</div>
                    <div className="metric-number" style={{ fontWeight: '600' }}>{data?.xGA_per60.toFixed(2)}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>xG DIFF</div>
                    <div 
                      className="metric-number" 
                      style={{ 
                        fontWeight: '600',
                        color: data?.xGD_per60 > 0 ? 'var(--color-success)' : 'var(--color-danger)'
                      }}
                    >
                      {data?.xGD_per60.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>PDO</div>
                    <div className="metric-number" style={{ fontWeight: '600' }}>{data?.pdo.toFixed(1)}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Shooting %</div>
                    <div className="metric-number" style={{ fontWeight: '600' }}>{data?.shootingEfficiency.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Save %</div>
                    <div className="metric-number" style={{ fontWeight: '600' }}>{data?.savePerformance.toFixed(1)}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamAnalytics;
