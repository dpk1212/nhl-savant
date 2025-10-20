import { useState, useEffect } from 'react';
import { BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TeamAnalytics = ({ dataProcessor }) => {
  const [selectedTeam, setSelectedTeam] = useState('');
  const [allSituations, setAllSituations] = useState(null);
  const [teams, setTeams] = useState([]);

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
    return <div style={{ padding: '2rem' }}>Loading...</div>;
  }

  const chartData = [
    { name: '5v5', xGF: allSituations.fiveOnFive?.xGF_per60 || 0, xGA: allSituations.fiveOnFive?.xGA_per60 || 0 },
    { name: 'PP', xGF: allSituations.powerPlay?.xGF_per60 || 0, xGA: allSituations.powerPlay?.xGA_per60 || 0 },
    { name: 'PK', xGF: allSituations.penaltyKill?.xGF_per60 || 0, xGA: allSituations.penaltyKill?.xGA_per60 || 0 },
  ];

  return (
    <div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ padding: '3rem 2rem 2rem', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1 style={{ marginBottom: '0.5rem' }}>Team Analytics</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
            Detailed performance metrics and situational breakdowns
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {/* Team Selector */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.75rem',
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
            style={{
              padding: '0.5rem',
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '4px',
              color: 'var(--color-text-primary)',
              fontSize: '0.875rem',
              minWidth: '200px',
            }}
          >
            {teams.map(team => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
        </div>

        {/* Overall Metrics */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 size={20} />
            Overall Performance - All Situations
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}>
            <div>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-muted)',
                marginBottom: '0.25rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>xG FOR/60</div>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'var(--color-accent)',
                fontFeatureSettings: "'tnum'",
              }}>
                {allSituations.all?.xGF_per60?.toFixed(2) || 'N/A'}
              </div>
            </div>

            <div>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-muted)',
                marginBottom: '0.25rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>xG AGAINST/60</div>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'var(--color-danger)',
                fontFeatureSettings: "'tnum'",
              }}>
                {allSituations.all?.xGA_per60?.toFixed(2) || 'N/A'}
              </div>
            </div>

            <div>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-muted)',
                marginBottom: '0.25rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>PDO</div>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'var(--color-accent)',
                fontFeatureSettings: "'tnum'",
              }}>
                {allSituations.all?.pdo?.toFixed(1) || 'N/A'}
              </div>
            </div>

            <div>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-muted)',
                marginBottom: '0.25rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>SHOOTING EFF</div>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'var(--color-accent)',
                fontFeatureSettings: "'tnum'",
              }}>
                {allSituations.all?.shooting_efficiency?.toFixed(3) || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* xG Chart */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.125rem' }}>
            Expected Goals by Situation
          </h2>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="name" 
                  stroke="var(--color-text-secondary)"
                  style={{ fontSize: '0.75rem' }}
                />
                <YAxis 
                  stroke="var(--color-text-secondary)"
                  style={{ fontSize: '0.75rem' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                  }}
                />
                <Bar dataKey="xGF" fill="var(--color-accent)" name="xG For/60" />
                <Bar dataKey="xGA" fill="var(--color-danger)" name="xG Against/60" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Situational Breakdown Table */}
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.125rem' }}>
            Situational Breakdown
          </h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>SITUATION</th>
                <th style={{ textAlign: 'right' }}>xGF/60</th>
                <th style={{ textAlign: 'right' }}>xGA/60</th>
                <th style={{ textAlign: 'right' }}>GOALS FOR</th>
                <th style={{ textAlign: 'right' }}>GOALS AGAINST</th>
                <th style={{ textAlign: 'right' }}>PDO</th>
                <th style={{ textAlign: 'right' }}>SH EFF</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>5-on-5</span></td>
                <td style={{ textAlign: 'right', fontFeatureSettings: "'tnum'" }}>
                  {allSituations.fiveOnFive?.xGF_per60?.toFixed(2) || 'N/A'}
                </td>
                <td style={{ textAlign: 'right', fontFeatureSettings: "'tnum'" }}>
                  {allSituations.fiveOnFive?.xGA_per60?.toFixed(2) || 'N/A'}
                </td>
                <td style={{ textAlign: 'right', fontFeatureSettings: "'tnum'" }}>
                  {allSituations.fiveOnFive?.goalsFor || 0}
                </td>
                <td style={{ textAlign: 'right', fontFeatureSettings: "'tnum'" }}>
                  {allSituations.fiveOnFive?.goalsAgainst || 0}
                </td>
                <td style={{ textAlign: 'right', fontFeatureSettings: "'tnum'" }}>
                  {allSituations.fiveOnFive?.pdo?.toFixed(1) || 'N/A'}
                </td>
                <td style={{ textAlign: 'right', fontFeatureSettings: "'tnum'" }}>
                  {allSituations.fiveOnFive?.shooting_efficiency?.toFixed(3) || 'N/A'}
                </td>
              </tr>

              <tr>
                <td><span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Power Play (5v4)</span></td>
                <td style={{ textAlign: 'right', fontFeatureSettings: "'tnum'" }}>
                  {allSituations.powerPlay?.xGF_per60?.toFixed(2) || 'N/A'}
                </td>
                <td style={{ textAlign: 'right', fontFeatureSettings: "'tnum'" }}>
                  {allSituations.powerPlay?.xGA_per60?.toFixed(2) || 'N/A'}
                </td>
                <td style={{ textAlign: 'right', fontFeatureSettings: "'tnum'" }}>
                  {allSituations.powerPlay?.goalsFor || 0}
                </td>
                <td style={{ textAlign: 'right', fontFeatureSettings: "'tnum'" }}>
                  {allSituations.powerPlay?.goalsAgainst || 0}
                </td>
                <td style={{ textAlign: 'right', fontFeatureSettings: "'tnum'" }}>
                  {allSituations.powerPlay?.pdo?.toFixed(1) || 'N/A'}
                </td>
                <td style={{ textAlign: 'right', fontFeatureSettings: "'tnum'" }}>
                  {allSituations.powerPlay?.shooting_efficiency?.toFixed(3) || 'N/A'}
                </td>
              </tr>

              <tr>
                <td><span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Penalty Kill (4v5)</span></td>
                <td style={{ textAlign: 'right', fontFeatureSettings: "'tnum'" }}>
                  {allSituations.penaltyKill?.xGF_per60?.toFixed(2) || 'N/A'}
                </td>
                <td style={{ textAlign: 'right', fontFeatureSettings: "'tnum'" }}>
                  {allSituations.penaltyKill?.xGA_per60?.toFixed(2) || 'N/A'}
                </td>
                <td style={{ textAlign: 'right', fontFeatureSettings: "'tnum'" }}>
                  {allSituations.penaltyKill?.goalsFor || 0}
                </td>
                <td style={{ textAlign: 'right', fontFeatureSettings: "'tnum'" }}>
                  {allSituations.penaltyKill?.goalsAgainst || 0}
                </td>
                <td style={{ textAlign: 'right', fontFeatureSettings: "'tnum'" }}>
                  {allSituations.penaltyKill?.pdo?.toFixed(1) || 'N/A'}
                </td>
                <td style={{ textAlign: 'right', fontFeatureSettings: "'tnum'" }}>
                  {allSituations.penaltyKill?.shooting_efficiency?.toFixed(3) || 'N/A'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeamAnalytics;
