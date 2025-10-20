import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Download } from 'lucide-react';

const DataInspector = ({ dataProcessor }) => {
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedSituation, setSelectedSituation] = useState('all');
  const [rawData, setRawData] = useState(null);
  const [calculated, setCalculated] = useState(null);
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
      const teamData = dataProcessor.processedData.find(
        d => d.name === selectedTeam && d.situation === selectedSituation
      );
      setRawData(teamData);
      
      if (teamData) {
        // Calculate metrics manually to verify
        // Pre-calculate PDO components to avoid circular reference
        const shootingPct = (teamData.goalsFor / teamData.shotsOnGoalFor) * 100;
        const savePct = (1 - (teamData.goalsAgainst / teamData.shotsOnGoalAgainst)) * 100;
        const expectedPDO = shootingPct + savePct;
        
        const calc = {
          // PDO Calculation
          pdo: {
            formula: '(Goals For / Shots On Goal For) × 100 + (1 - Goals Against / Shots On Goal Against) × 100',
            shootingPct: shootingPct.toFixed(2),
            savePct: savePct.toFixed(2),
            calculation: `(${teamData.goalsFor} / ${teamData.shotsOnGoalFor}) × 100 + (1 - ${teamData.goalsAgainst} / ${teamData.shotsOnGoalAgainst}) × 100`,
            step1: `${shootingPct.toFixed(2)} + ${savePct.toFixed(2)}`,
            result: teamData.pdo.toFixed(2),
            match: Math.abs(teamData.pdo - expectedPDO) < 0.1
          },
          
          // xG per 60
          xGF_per60: {
            formula: '(xGoals For / Ice Time in seconds) × 3600',
            calculation: `(${teamData.xGoalsFor} / ${teamData.iceTime}) × 3600`,
            result: teamData.xGF_per60?.toFixed(2) || 'N/A',
            expected: ((teamData.xGoalsFor / teamData.iceTime) * 3600).toFixed(2),
            match: teamData.xGF_per60 ? Math.abs(teamData.xGF_per60 - ((teamData.xGoalsFor / teamData.iceTime) * 3600)) < 0.01 : false
          },
          
          // xGA per 60
          xGA_per60: {
            formula: '(xGoals Against / Ice Time in seconds) × 3600',
            calculation: `(${teamData.xGoalsAgainst} / ${teamData.iceTime}) × 3600`,
            result: teamData.xGA_per60?.toFixed(2) || 'N/A',
            expected: ((teamData.xGoalsAgainst / teamData.iceTime) * 3600).toFixed(2),
            match: teamData.xGA_per60 ? Math.abs(teamData.xGA_per60 - ((teamData.xGoalsAgainst / teamData.iceTime) * 3600)) < 0.01 : false
          },
          
          // Shooting Efficiency
          shootingEff: {
            formula: 'Actual Goals For / Expected Goals For',
            calculation: `${teamData.goalsFor} / ${teamData.xGoalsFor}`,
            result: teamData.shooting_efficiency?.toFixed(3) || 'N/A',
            expected: (teamData.goalsFor / teamData.xGoalsFor).toFixed(3),
            match: teamData.shooting_efficiency ? Math.abs(teamData.shooting_efficiency - (teamData.goalsFor / teamData.xGoalsFor)) < 0.01 : false
          },
          
          // xG Differential per 60
          xGD_per60: {
            formula: 'xGF/60 - xGA/60',
            calculation: `${teamData.xGF_per60?.toFixed(2)} - ${teamData.xGA_per60?.toFixed(2)}`,
            result: teamData.xGD_per60?.toFixed(2) || 'N/A',
            expected: (teamData.xGF_per60 - teamData.xGA_per60).toFixed(2),
            match: teamData.xGD_per60 ? Math.abs(teamData.xGD_per60 - (teamData.xGF_per60 - teamData.xGA_per60)) < 0.01 : false
          }
        };
        setCalculated(calc);
      }
    }
  }, [dataProcessor, selectedTeam, selectedSituation]);

  const exportVerification = () => {
    if (!rawData || !calculated) return;
    
    const report = `NHL SAVANT - DATA VERIFICATION REPORT
Team: ${selectedTeam}
Situation: ${selectedSituation}
Generated: ${new Date().toLocaleString()}

RAW CSV DATA:
-------------
Goals For: ${rawData.goalsFor}
Shots On Goal For: ${rawData.shotsOnGoalFor}
Goals Against: ${rawData.goalsAgainst}
Shots On Goal Against: ${rawData.shotsOnGoalAgainst}
xGoals For: ${rawData.xGoalsFor}
xGoals Against: ${rawData.xGoalsAgainst}
Ice Time: ${rawData.iceTime}

CALCULATED METRICS:
------------------
PDO:
  Formula: ${calculated.pdo.formula}
  Calculation: ${calculated.pdo.calculation}
  Shooting %: ${calculated.pdo.shootingPct}
  Save %: ${calculated.pdo.savePct}
  Result: ${calculated.pdo.result}
  ✓ Verified: ${calculated.pdo.match ? 'PASS' : 'FAIL'}

xGF/60:
  Formula: ${calculated.xGF_per60.formula}
  Calculation: ${calculated.xGF_per60.calculation}
  Result: ${calculated.xGF_per60.result}
  Expected: ${calculated.xGF_per60.expected}
  ✓ Verified: ${calculated.xGF_per60.match ? 'PASS' : 'FAIL'}

Shooting Efficiency:
  Formula: ${calculated.shootingEff.formula}
  Calculation: ${calculated.shootingEff.calculation}
  Result: ${calculated.shootingEff.result}
  Expected: ${calculated.shootingEff.expected}
  ✓ Verified: ${calculated.shootingEff.match ? 'PASS' : 'FAIL'}
`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data-verification-${selectedTeam}-${selectedSituation}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!dataProcessor) {
    return <div style={{ padding: '2rem' }}>Loading...</div>;
  }

  return (
    <div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ padding: '3rem 2rem 2rem', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1 style={{ marginBottom: '0.5rem' }}>Data Inspector</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
            Verify raw CSV data against calculated metrics with step-by-step breakdowns
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {/* Controls */}
        <div style={{ 
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          alignItems: 'center',
        }}>
          <div style={{ flex: 1 }}>
            <label style={{
              display: 'block',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Team
            </label>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '4px',
                color: 'var(--color-text-primary)',
                fontSize: '0.875rem',
              }}
            >
              {teams.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1 }}>
            <label style={{
              display: 'block',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Situation
            </label>
            <select
              value={selectedSituation}
              onChange={(e) => setSelectedSituation(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '4px',
                color: 'var(--color-text-primary)',
                fontSize: '0.875rem',
              }}
            >
              <option value="all">All Situations</option>
              <option value="5on5">5-on-5</option>
              <option value="5on4">Power Play (5-on-4)</option>
              <option value="4on5">Penalty Kill (4-on-5)</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <button
              onClick={exportVerification}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Download size={16} />
              Export Report
            </button>
          </div>
        </div>

        {rawData && calculated && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))',
            gap: '1rem',
          }}>
            {/* Raw CSV Data Panel */}
            <div className="card">
              <h2 style={{ marginBottom: '1.5rem', fontSize: '1.125rem' }}>Raw CSV Data</h2>
              <div style={{
                fontFamily: 'Monaco, Consolas, monospace',
                fontSize: '0.8125rem',
                lineHeight: '1.8',
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.5rem 2rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>team:</span>
                  <span style={{ color: 'var(--color-text-primary)', textAlign: 'right' }}>{rawData.team}</span>
                  
                  <span style={{ color: 'var(--color-text-muted)' }}>situation:</span>
                  <span style={{ color: 'var(--color-text-primary)', textAlign: 'right' }}>{rawData.situation}</span>
                  
                  <div style={{ height: '1px', backgroundColor: 'var(--color-border)', gridColumn: '1 / -1', margin: '0.5rem 0' }}></div>
                  
                  <span style={{ color: 'var(--color-text-muted)' }}>goalsFor:</span>
                  <span style={{ color: 'var(--color-accent)', fontWeight: 600, textAlign: 'right' }}>{rawData.goalsFor}</span>
                  
                  <span style={{ color: 'var(--color-text-muted)' }}>shotsOnGoalFor:</span>
                  <span style={{ color: 'var(--color-accent)', fontWeight: 600, textAlign: 'right' }}>{rawData.shotsOnGoalFor}</span>
                  
                  <span style={{ color: 'var(--color-text-muted)' }}>goalsAgainst:</span>
                  <span style={{ color: 'var(--color-accent)', fontWeight: 600, textAlign: 'right' }}>{rawData.goalsAgainst}</span>
                  
                  <span style={{ color: 'var(--color-text-muted)' }}>shotsOnGoalAgainst:</span>
                  <span style={{ color: 'var(--color-accent)', fontWeight: 600, textAlign: 'right' }}>{rawData.shotsOnGoalAgainst}</span>
                  
                  <div style={{ height: '1px', backgroundColor: 'var(--color-border)', gridColumn: '1 / -1', margin: '0.5rem 0' }}></div>
                  
                  <span style={{ color: 'var(--color-text-muted)' }}>xGoalsFor:</span>
                  <span style={{ color: 'var(--color-accent)', fontWeight: 600, textAlign: 'right' }}>{rawData.xGoalsFor}</span>
                  
                  <span style={{ color: 'var(--color-text-muted)' }}>xGoalsAgainst:</span>
                  <span style={{ color: 'var(--color-accent)', fontWeight: 600, textAlign: 'right' }}>{rawData.xGoalsAgainst}</span>
                  
                  <span style={{ color: 'var(--color-text-muted)' }}>iceTime:</span>
                  <span style={{ color: 'var(--color-accent)', fontWeight: 600, textAlign: 'right' }}>{rawData.iceTime}</span>
                </div>
              </div>
            </div>

            {/* Calculated Metrics Panel */}
            <div className="card">
              <h2 style={{ marginBottom: '1.5rem', fontSize: '1.125rem' }}>Calculated Metrics</h2>
              
              {Object.entries(calculated).map(([key, calc]) => (
                <div key={key} style={{
                  marginBottom: '1.5rem',
                  paddingBottom: '1.5rem',
                  borderBottom: '1px solid var(--color-border)',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.75rem',
                  }}>
                    <h3 style={{ fontSize: '0.875rem', textTransform: 'uppercase', fontWeight: 600 }}>
                      {key.replace('_', ' ')}
                    </h3>
                    {calc.match ? (
                      <CheckCircle size={16} color="var(--color-success)" />
                    ) : (
                      <AlertCircle size={16} color="var(--color-danger)" />
                    )}
                  </div>
                  
                  <div style={{
                    fontFamily: 'Monaco, Consolas, monospace',
                    fontSize: '0.75rem',
                    lineHeight: '1.6',
                    color: 'var(--color-text-secondary)',
                  }}>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>Formula: </span>
                      <span style={{ color: 'var(--color-text-primary)' }}>{calc.formula}</span>
                    </div>
                    
                    <div style={{ marginBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>Calculation: </span>
                      <span style={{ color: 'var(--color-warning)' }}>{calc.calculation}</span>
                    </div>
                    
                    {calc.step1 && (
                      <div style={{ marginBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--color-text-muted)' }}>Step: </span>
                        <span style={{ color: 'var(--color-warning)' }}>{calc.step1}</span>
                      </div>
                    )}
                    
                    <div style={{ marginTop: '0.75rem', display: 'flex', gap: '2rem' }}>
                      <div>
                        <span style={{ color: 'var(--color-text-muted)' }}>Result: </span>
                        <span style={{
                          color: calc.match ? 'var(--color-success)' : 'var(--color-danger)',
                          fontWeight: 700,
                        }}>
                          {calc.result}
                        </span>
                      </div>
                      
                      {calc.expected && (
                        <div>
                          <span style={{ color: 'var(--color-text-muted)' }}>Expected: </span>
                          <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                            {calc.expected}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataInspector;

