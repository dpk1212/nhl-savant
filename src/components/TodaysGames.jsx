import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, TrendingDown, DollarSign, AlertTriangle, Info } from 'lucide-react';
import { EdgeCalculator } from '../utils/edgeCalculator';
import { getTeamName } from '../utils/oddsTraderParser';
import MathBreakdown from './MathBreakdown';

const TodaysGames = ({ dataProcessor, oddsData }) => {
  const [edgeCalculator, setEdgeCalculator] = useState(null);
  const [allEdges, setAllEdges] = useState([]);
  const [topEdges, setTopEdges] = useState([]);
  const [showOnlyPositiveEV, setShowOnlyPositiveEV] = useState(false);
  const [minEVThreshold, setMinEVThreshold] = useState(0);
  const [selectedTeamA, setSelectedTeamA] = useState('');
  const [selectedTeamB, setSelectedTeamB] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [showEVExplanation, setShowEVExplanation] = useState(false);

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

  // Get all team codes for predictor dropdowns
  const allTeams = dataProcessor ? [...new Set(dataProcessor.processedData.map(d => d.team))].sort() : [];

  // Handle game prediction
  const handlePredict = () => {
    if (!dataProcessor || !selectedTeamA || !selectedTeamB) return;
    
    const teamA = dataProcessor.getTeamData(selectedTeamA, 'all');
    const teamB = dataProcessor.getTeamData(selectedTeamB, 'all');
    
    if (!teamA || !teamB) return;
    
    const totalGoals = dataProcessor.predictGameTotal(selectedTeamA, selectedTeamB);
    const teamAScore = dataProcessor.predictTeamScore(selectedTeamA, selectedTeamB);
    const teamBScore = dataProcessor.predictTeamScore(selectedTeamB, selectedTeamA);
    const winProb = dataProcessor.estimateWinProbability(teamA, teamB);
    
    setPrediction({
      totalGoals,
      teamAScore,
      teamBScore,
      teamAWinProb: winProb,
      teamBWinProb: 1 - winProb
    });
  };

  // Filter edges based on threshold
  const filteredEdges = showOnlyPositiveEV 
    ? topEdges.filter(e => e.evPercent > minEVThreshold)
    : topEdges;

  if (!oddsData) {
    return (
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '2rem', borderBottom: '1px solid var(--color-border)', marginBottom: '2rem' }}>
          <Calendar size={32} color="var(--color-accent)" />
          <h1>Today's Games</h1>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <AlertTriangle size={48} color="var(--color-text-muted)" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>No Odds Data Available</h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            To see today's games and betting edges, add <code style={{ backgroundColor: 'var(--color-background)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>todays_odds.md</code> to the public folder.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '2rem', borderBottom: '1px solid var(--color-border)', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Calendar size={32} color="var(--color-accent)" />
          <div>
            <h1>Today's Games</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {allEdges.length} games loaded • {topEdges.filter(e => e.evPercent > 0).length} positive EV opportunities
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showOnlyPositiveEV}
              onChange={(e) => setShowOnlyPositiveEV(e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            <span style={{ color: 'var(--color-text-primary)', fontWeight: '500' }}>Show only positive EV</span>
          </label>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <label style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Min EV:</label>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={minEVThreshold}
              onChange={(e) => setMinEVThreshold(parseFloat(e.target.value))}
              style={{ width: '120px' }}
            />
            <span style={{ color: 'var(--color-accent)', fontWeight: '600', minWidth: '3rem' }}>{minEVThreshold.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Top Edges Table */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <DollarSign size={24} color="var(--color-accent)" />
          <h2>Value Bets ({filteredEdges.length})</h2>
        </div>

        {filteredEdges.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <AlertTriangle size={48} color="var(--color-text-muted)" style={{ margin: '0 auto 1rem auto' }} />
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem' }}>
              No opportunities found with current filters
            </p>
          </div>
        ) : (
          <div className="card" style={{ padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Game</th>
                  <th>Time</th>
                  <th>Market</th>
                  <th>Pick</th>
                  <th>Odds</th>
                  <th>Model Prob</th>
                  <th>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      EV
                      <button
                        onClick={() => setShowEVExplanation(true)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                        title="What is EV?"
                      >
                        <Info size={14} color="var(--color-accent)" />
                      </button>
                    </div>
                  </th>
                  <th>Kelly Stake</th>
                </tr>
              </thead>
              <tbody>
                {filteredEdges.map((edge, index) => (
                  <tr key={index}>
                    <td style={{ fontWeight: '500' }}>{edge.game}</td>
                    <td>{edge.gameTime}</td>
                    <td>
                      <span className={`badge ${
                        edge.market === 'MONEYLINE' ? 'badge-accent' :
                        edge.market === 'TOTAL' ? 'badge-success' :
                        'badge-secondary'
                      }`}>
                        {edge.market}
                      </span>
                    </td>
                    <td style={{ fontWeight: '600', color: 'var(--color-text-primary)' }}>{edge.pick}</td>
                    <td className="metric-number">
                      {edge.odds > 0 ? '+' : ''}{edge.odds}
                    </td>
                    <td className="metric-number">
                      {(edge.modelProb * 100).toFixed(1)}%
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {edge.evPercent > 0 ? (
                          <TrendingUp size={16} color="var(--color-success)" />
                        ) : (
                          <TrendingDown size={16} color="var(--color-danger)" />
                        )}
                        <span 
                          className="metric-number" 
                          style={{ 
                            color: edge.evPercent > 0 ? 'var(--color-success)' : 'var(--color-danger)',
                            fontWeight: '600'
                          }}
                        >
                          {edge.evPercent > 0 ? '+' : ''}{edge.evPercent.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td>
                      {edge.kelly ? (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span className="metric-number" style={{ color: 'var(--color-text-primary)' }}>
                            ${edge.kelly.recommendedStake.toFixed(0)}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                            ({(edge.kelly.fractionalKelly * 100).toFixed(1)}%)
                          </span>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--color-text-muted)' }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* All Games Overview */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <Calendar size={24} color="var(--color-accent)" />
          <h2>All Games</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
          {allEdges.map((game, index) => (
            <div key={index} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ marginBottom: '0.25rem' }}>{game.game}</h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{game.gameTime}</p>
                </div>
                {game.edges.total && (
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                      PREDICTED TOTAL
                    </p>
                    <p className="metric-number" style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-accent)' }}>
                      {game.edges.total.predictedTotal.toFixed(1)}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                      Market: {game.edges.total.marketTotal} 
                      <span style={{ 
                        marginLeft: '0.5rem',
                        color: game.edges.total.edge > 0 ? 'var(--color-success)' : 'var(--color-danger)' 
                      }}>
                        ({game.edges.total.edge > 0 ? '+' : ''}{game.edges.total.edge.toFixed(1)})
                      </span>
                    </p>
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {/* Moneyline */}
                {game.edges.moneyline.away && game.edges.moneyline.home && (
                  <div style={{ backgroundColor: 'var(--color-background)', padding: '1rem', borderRadius: '4px' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>MONEYLINE</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span>{game.awayTeam}</span>
                      <span className={game.edges.moneyline.away.evPercent > 0 ? 'metric-number' : ''} 
                            style={{ color: game.edges.moneyline.away.evPercent > 0 ? 'var(--color-success)' : 'var(--color-text-secondary)' }}>
                        {game.rawOdds.moneyline.away > 0 ? '+' : ''}{game.rawOdds.moneyline.away}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{game.homeTeam}</span>
                      <span className={game.edges.moneyline.home.evPercent > 0 ? 'metric-number' : ''} 
                            style={{ color: game.edges.moneyline.home.evPercent > 0 ? 'var(--color-success)' : 'var(--color-text-secondary)' }}>
                        {game.rawOdds.moneyline.home > 0 ? '+' : ''}{game.rawOdds.moneyline.home}
                      </span>
                    </div>
                  </div>
                )}

                {/* Total */}
                {game.edges.total && (
                  <div style={{ backgroundColor: 'var(--color-background)', padding: '1rem', borderRadius: '4px' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>TOTAL</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span>Over {game.rawOdds.total.line}</span>
                      <span className={game.edges.total.over.evPercent > 0 ? 'metric-number' : ''} 
                            style={{ color: game.edges.total.over.evPercent > 0 ? 'var(--color-success)' : 'var(--color-text-secondary)' }}>
                        {game.rawOdds.total.over > 0 ? '+' : ''}{game.rawOdds.total.over}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Under {game.rawOdds.total.line}</span>
                      <span className={game.edges.total.under.evPercent > 0 ? 'metric-number' : ''} 
                            style={{ color: game.edges.total.under.evPercent > 0 ? 'var(--color-success)' : 'var(--color-text-secondary)' }}>
                        {game.rawOdds.total.under > 0 ? '+' : ''}{game.rawOdds.total.under}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Mathematical Breakdown Component */}
              <MathBreakdown game={game.rawOdds} dataProcessor={dataProcessor} />
            </div>
          ))}
        </div>
      </div>

      {/* Game Predictor Tool */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h2>Game Predictor</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Select two teams to see predicted score and win probability
          </p>
        </div>

        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                Team A
              </label>
              <select
                value={selectedTeamA}
                onChange={(e) => setSelectedTeamA(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.5rem', 
                  border: '1px solid var(--color-border)', 
                  borderRadius: '4px', 
                  backgroundColor: 'var(--color-background)', 
                  color: 'var(--color-text-primary)' 
                }}
              >
                <option value="">Select Team A</option>
                {allTeams.map(team => (
                  <option key={team} value={team}>{team} - {getTeamName(team)}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                Team B
              </label>
              <select
                value={selectedTeamB}
                onChange={(e) => setSelectedTeamB(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.5rem', 
                  border: '1px solid var(--color-border)', 
                  borderRadius: '4px', 
                  backgroundColor: 'var(--color-background)', 
                  color: 'var(--color-text-primary)' 
                }}
              >
                <option value="">Select Team B</option>
                {allTeams.map(team => (
                  <option key={team} value={team}>{team} - {getTeamName(team)}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handlePredict}
            disabled={!selectedTeamA || !selectedTeamB}
            className="btn btn-primary"
            style={{ marginBottom: '1.5rem' }}
          >
            Calculate Prediction
          </button>

          {prediction && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div className="stat-card">
                <p className="stat-card-label">Predicted Total</p>
                <p className="stat-card-value metric-number">{prediction.totalGoals.toFixed(1)}</p>
              </div>
              <div className="stat-card">
                <p className="stat-card-label">{selectedTeamA} Score</p>
                <p className="stat-card-value metric-number">{prediction.teamAScore.toFixed(1)}</p>
                <p className="stat-card-description">{(prediction.teamAWinProb * 100).toFixed(1)}% win probability</p>
              </div>
              <div className="stat-card">
                <p className="stat-card-label">{selectedTeamB} Score</p>
                <p className="stat-card-value metric-number">{prediction.teamBScore.toFixed(1)}</p>
                <p className="stat-card-description">{(prediction.teamBWinProb * 100).toFixed(1)}% win probability</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* EV Explanation Modal */}
      {showEVExplanation && (
        <div 
          onClick={() => setShowEVExplanation(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="card" 
            style={{ 
              maxWidth: '600px', 
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}
          >
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Info size={24} color="var(--color-accent)" />
                Understanding Expected Value (EV)
              </h2>
              <button
                onClick={() => setShowEVExplanation(false)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--color-text-secondary)', 
                  fontSize: '1.5rem', 
                  cursor: 'pointer',
                  padding: '0.25rem'
                }}
              >
                ×
              </button>
            </div>

            <div className="card-body">
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-accent)' }}>What is EV?</h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  Expected Value (EV) represents your average profit or loss per $100 wagered over the long run. 
                  A positive EV (+12%) means you can expect to profit $12 for every $100 bet if your model is accurate.
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-accent)' }}>Why Are These Numbers So High?</h3>
                <ul style={{ color: 'var(--color-text-secondary)', paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                  <li><strong>Advanced Stats Edge:</strong> Our model uses xG (expected goals) and situational data that bookmakers may underweight</li>
                  <li><strong>Early Season Inefficiencies:</strong> Markets are less efficient early in the season when there's limited data</li>
                  <li><strong>Model Estimates:</strong> These are theoretical edges based on our predictions - not guaranteed profits</li>
                </ul>
              </div>

              <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-danger)', borderRadius: '4px' }}>
                <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertTriangle size={18} />
                  Reality Check
                </h3>
                <ul style={{ color: 'var(--color-text-secondary)', paddingLeft: '1.5rem', lineHeight: '1.8', marginBottom: 0 }}>
                  <li>Professional bettors typically target <strong>3-5% long-term ROI</strong></li>
                  <li>Edges of <strong>10%+ are extremely rare</strong> in efficient markets</li>
                  <li>High EV can indicate model miscalibration or missing information</li>
                  <li>Always use <strong>fractional Kelly (25%)</strong> to manage risk</li>
                </ul>
              </div>

              <div>
                <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-accent)' }}>Recommendations</h3>
                <ul style={{ color: 'var(--color-text-secondary)', paddingLeft: '1.5rem', lineHeight: '1.8', marginBottom: 0 }}>
                  <li><strong>Start Small:</strong> Test the model with minimal stakes to validate accuracy</li>
                  <li><strong>Track Performance:</strong> Monitor closing line value (CLV) to measure if you're beating the market</li>
                  <li><strong>Stay Disciplined:</strong> Follow your bankroll management strategy regardless of short-term results</li>
                  <li><strong>Verify Data:</strong> Use the Data Inspector to spot-check calculations before betting</li>
                </ul>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', padding: '1rem', borderTop: '1px solid var(--color-border)', textAlign: 'right' }}>
              <button
                onClick={() => setShowEVExplanation(false)}
                className="btn btn-primary"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodaysGames;

