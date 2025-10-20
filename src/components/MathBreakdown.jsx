import { useState } from 'react';
import { ChevronDown, ChevronUp, Calculator } from 'lucide-react';
import { explainGamePrediction } from '../utils/mathExplainer';

const MathBreakdown = ({ game, dataProcessor }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!game.total || !game.total.line || !dataProcessor) {
    return null;
  }
  
  const breakdown = explainGamePrediction(
    game.awayTeam,
    game.homeTeam,
    game.total.line,
    game.total.over,
    game.total.under,
    dataProcessor
  );
  
  if (!breakdown) {
    return null;
  }
  
  return (
    <div style={{ marginTop: '1rem', border: '1px solid var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--color-background)',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--color-text-secondary)',
          transition: 'background-color 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-card)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-background)'}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calculator size={16} color="var(--color-accent)" />
          <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>Show Mathematical Breakdown</span>
        </div>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      
      {isExpanded && (
        <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-card)', fontSize: '0.875rem', lineHeight: '1.6' }}>
          
          {/* Away Team Score Breakdown */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ color: 'var(--color-accent)', fontSize: '0.875rem', fontWeight: '700', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🏒 {breakdown.awayTeam.teamCode} PREDICTED SCORE: {breakdown.awayTeam.totalScore} goals
            </h4>
            
            <div style={{ backgroundColor: 'var(--color-background)', padding: '1rem', borderRadius: '4px', marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                5v5 Component (46.2 minutes = 77% of game):
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
                <div>{breakdown.awayTeam.teamCode} xGF/60: <span style={{ color: 'var(--color-success)' }}>{breakdown.awayTeam.fiveOnFive.team_xGF_per60}</span></div>
                <div>{breakdown.homeTeam.teamCode} xGA/60: <span style={{ color: 'var(--color-danger)' }}>{breakdown.awayTeam.fiveOnFive.opp_xGA_per60}</span></div>
                <div>Average: <span style={{ color: 'var(--color-accent)' }}>{breakdown.awayTeam.fiveOnFive.expected_5v5_rate}</span> goals/60</div>
                <div>× (46.2/60) = <span style={{ color: 'var(--color-accent)', fontWeight: '700' }}>{breakdown.awayTeam.fiveOnFive.goals_5v5} goals</span></div>
              </div>
            </div>
            
            {breakdown.awayTeam.powerPlay && (
              <div style={{ backgroundColor: 'var(--color-background)', padding: '1rem', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                  PP Component (7.2 minutes = 12% of game):
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
                  <div>{breakdown.awayTeam.teamCode} PP xGF/60: <span style={{ color: 'var(--color-success)' }}>{breakdown.awayTeam.powerPlay.team_PP_xGF_per60}</span></div>
                  <div>{breakdown.homeTeam.teamCode} PK xGA/60: <span style={{ color: 'var(--color-danger)' }}>{breakdown.awayTeam.powerPlay.opp_PK_xGA_per60}</span></div>
                  <div>Average: <span style={{ color: 'var(--color-accent)' }}>{breakdown.awayTeam.powerPlay.expected_PP_rate}</span> goals/60</div>
                  <div>× (7.2/60) = <span style={{ color: 'var(--color-accent)', fontWeight: '700' }}>{breakdown.awayTeam.powerPlay.goals_PP} goals</span></div>
                </div>
              </div>
            )}
          </div>
          
          {/* Home Team Score Breakdown */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ color: 'var(--color-accent)', fontSize: '0.875rem', fontWeight: '700', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🏒 {breakdown.homeTeam.teamCode} PREDICTED SCORE: {breakdown.homeTeam.totalScore} goals
            </h4>
            
            <div style={{ backgroundColor: 'var(--color-background)', padding: '1rem', borderRadius: '4px', marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                5v5 Component (46.2 minutes):
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
                <div>{breakdown.homeTeam.teamCode} xGF/60: <span style={{ color: 'var(--color-success)' }}>{breakdown.homeTeam.fiveOnFive.team_xGF_per60}</span></div>
                <div>{breakdown.awayTeam.teamCode} xGA/60: <span style={{ color: 'var(--color-danger)' }}>{breakdown.homeTeam.fiveOnFive.opp_xGA_per60}</span></div>
                <div>Average: <span style={{ color: 'var(--color-accent)' }}>{breakdown.homeTeam.fiveOnFive.expected_5v5_rate}</span> goals/60</div>
                <div>× (46.2/60) = <span style={{ color: 'var(--color-accent)', fontWeight: '700' }}>{breakdown.homeTeam.fiveOnFive.goals_5v5} goals</span></div>
              </div>
            </div>
            
            {breakdown.homeTeam.powerPlay && (
              <div style={{ backgroundColor: 'var(--color-background)', padding: '1rem', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                  PP Component (7.2 minutes):
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
                  <div>{breakdown.homeTeam.teamCode} PP xGF/60: <span style={{ color: 'var(--color-success)' }}>{breakdown.homeTeam.powerPlay.team_PP_xGF_per60}</span></div>
                  <div>{breakdown.awayTeam.teamCode} PK xGA/60: <span style={{ color: 'var(--color-danger)' }}>{breakdown.homeTeam.powerPlay.opp_PK_xGA_per60}</span></div>
                  <div>Average: <span style={{ color: 'var(--color-accent)' }}>{breakdown.homeTeam.powerPlay.expected_PP_rate}</span> goals/60</div>
                  <div>× (7.2/60) = <span style={{ color: 'var(--color-accent)', fontWeight: '700' }}>{breakdown.homeTeam.powerPlay.goals_PP} goals</span></div>
                </div>
              </div>
            )}
          </div>
          
          {/* Game Total */}
          <div style={{ backgroundColor: 'var(--color-background)', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem', border: '1px solid var(--color-accent)' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '0.875rem', color: 'var(--color-text-primary)', lineHeight: '1.8' }}>
              <div><strong>Predicted Total:</strong> {breakdown.awayTeam.totalScore} + {breakdown.homeTeam.totalScore} = <span style={{ color: 'var(--color-accent)', fontWeight: '700' }}>{breakdown.predictedTotal} goals</span></div>
              <div><strong>Market Line:</strong> O/U {breakdown.marketTotal}</div>
              <div><strong>Edge:</strong> <span style={{ color: parseFloat(breakdown.edge) > 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>{breakdown.edge} goals</span></div>
            </div>
          </div>
          
          {/* Market Analysis */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ color: 'var(--color-accent)', fontSize: '0.875rem', fontWeight: '700', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              📈 MARKET ANALYSIS
            </h4>
            <div style={{ backgroundColor: 'var(--color-background)', padding: '1rem', borderRadius: '4px' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
                <div>Over {breakdown.marketTotal} at {breakdown.marketAnalysis.overOdds} → Implied {breakdown.marketAnalysis.overImplied} (true {breakdown.marketAnalysis.overTrue})</div>
                <div>Under {breakdown.marketTotal} at {breakdown.marketAnalysis.underOdds} → Implied {breakdown.marketAnalysis.underImplied} (true {breakdown.marketAnalysis.underTrue})</div>
                <div style={{ marginTop: '0.5rem', color: 'var(--color-text-secondary)' }}>Bookmaker vig: {breakdown.marketAnalysis.vig}</div>
              </div>
            </div>
          </div>
          
          {/* Model Probabilities */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ color: 'var(--color-accent)', fontSize: '0.875rem', fontWeight: '700', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🎯 MODEL PROBABILITIES (Normal Distribution)
            </h4>
            <div style={{ backgroundColor: 'var(--color-background)', padding: '1rem', borderRadius: '4px' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
                <div>Z-score = ({breakdown.marketTotal} - {breakdown.predictedTotal}) / {breakdown.modelProbabilities.stdDev} = <span style={{ color: 'var(--color-accent)' }}>{breakdown.modelProbabilities.zScore}</span></div>
                <div style={{ marginTop: '0.5rem' }}>P(Over): <span style={{ color: 'var(--color-success)', fontWeight: '700' }}>{breakdown.modelProbabilities.overProb}</span></div>
                <div>P(Under): <span style={{ color: 'var(--color-success)', fontWeight: '700' }}>{breakdown.modelProbabilities.underProb}</span></div>
              </div>
            </div>
          </div>
          
          {/* Expected Value */}
          <div>
            <h4 style={{ color: 'var(--color-accent)', fontSize: '0.875rem', fontWeight: '700', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              💰 EXPECTED VALUE
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ backgroundColor: 'var(--color-background)', padding: '1rem', borderRadius: '4px', border: parseFloat(breakdown.expectedValue.over.ev) > 0 ? '2px solid var(--color-success)' : '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                  Over {breakdown.marketTotal} at {breakdown.marketAnalysis.overOdds}:
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
                  <div>Decimal odds: {breakdown.expectedValue.over.decimalOdds}</div>
                  <div>EV = ({breakdown.modelProbabilities.overProb} × ${(parseFloat(breakdown.expectedValue.over.decimalOdds) * 100).toFixed(0)}) - $100</div>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                    <strong style={{ color: parseFloat(breakdown.expectedValue.over.ev) > 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                      EV: ${breakdown.expectedValue.over.ev} ({breakdown.expectedValue.over.evPercent})
                    </strong>
                  </div>
                </div>
              </div>
              
              <div style={{ backgroundColor: 'var(--color-background)', padding: '1rem', borderRadius: '4px', border: parseFloat(breakdown.expectedValue.under.ev) > 0 ? '2px solid var(--color-success)' : '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                  Under {breakdown.marketTotal} at {breakdown.marketAnalysis.underOdds}:
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
                  <div>Decimal odds: {breakdown.expectedValue.under.decimalOdds}</div>
                  <div>EV = ({breakdown.modelProbabilities.underProb} × ${(parseFloat(breakdown.expectedValue.under.decimalOdds) * 100).toFixed(0)}) - $100</div>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                    <strong style={{ color: parseFloat(breakdown.expectedValue.under.ev) > 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                      EV: ${breakdown.expectedValue.under.ev} ({breakdown.expectedValue.under.evPercent})
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
};

export default MathBreakdown;

