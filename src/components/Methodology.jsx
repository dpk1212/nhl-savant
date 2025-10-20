import { BookOpen, Code } from 'lucide-react';

const Methodology = () => {
  return (
    <div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ padding: '3rem 2rem 2rem', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1 style={{ marginBottom: '0.5rem' }}>Methodology</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
            Mathematical foundations and betting strategies behind NHL Savant analytics
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {/* Expected Goals (xG) */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={20} />
            Expected Goals (xG) Analysis
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>What is xG?</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
              Expected Goals (xG) is a statistical metric that measures the quality of scoring chances. Each shot is assigned a probability
              of becoming a goal based on historical data, considering factors like shot location, type, and game situation.
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Per-60 Normalization</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: '1.6', marginBottom: '0.75rem' }}>
              To compare teams fairly, we normalize all metrics to a 60-minute rate:
            </p>
            <div style={{
              fontFamily: 'Monaco, Consolas, monospace',
              fontSize: '0.8125rem',
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '4px',
              padding: '1rem',
              color: 'var(--color-accent)',
            }}>
              xG per 60 = (xGoals / Ice Time in seconds) × 3600
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Why xG Matters for Betting</h3>
            <ul style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: '1.8', paddingLeft: '1.5rem' }}>
              <li>Reveals true team quality beyond results influenced by luck</li>
              <li>Identifies teams with strong underlying metrics but poor record (value bets)</li>
              <li>Predicts future performance more accurately than goals scored</li>
              <li>Situational xG (5v5, PP, PK) exposes specific strengths and weaknesses</li>
            </ul>
          </div>
        </div>

        {/* PDO & Regression */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Code size={20} />
            PDO & Regression Theory
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>PDO Calculation</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: '1.6', marginBottom: '0.75rem' }}>
              PDO measures "puck luck" by combining shooting percentage and save percentage:
            </p>
            <div style={{
              fontFamily: 'Monaco, Consolas, monospace',
              fontSize: '0.8125rem',
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '4px',
              padding: '1rem',
              color: 'var(--color-accent)',
            }}>
              PDO = (Goals For / Shots For) × 100 + (1 - Goals Against / Shots Against) × 100
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Regression to the Mean</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
              Over time, PDO regresses toward 100.0 (league average). Teams with PDO significantly above or below 100 are experiencing
              unsustainable luck and will likely regress.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Betting Applications</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem',
            }}>
              <div style={{
                padding: '1rem',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid var(--color-danger)',
                borderRadius: '4px',
              }}>
                <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-danger)' }}>
                  PDO &gt; 102
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                  Overperforming due to luck. Bet UNDER or AGAINST.
                </div>
              </div>
              <div style={{
                padding: '1rem',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid var(--color-success)',
                borderRadius: '4px',
              }}>
                <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-success)' }}>
                  PDO &lt; 98
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                  Underperforming due to bad luck. Bet OVER or WITH.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shooting Efficiency */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Shooting Efficiency</h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{
              fontFamily: 'Monaco, Consolas, monospace',
              fontSize: '0.8125rem',
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '4px',
              padding: '1rem',
              color: 'var(--color-accent)',
              marginBottom: '0.75rem',
            }}>
              Shooting Efficiency = Actual Goals / Expected Goals
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
              Values above 1.0 indicate a team is scoring more than expected (likely unsustainable). Values below 1.0 suggest
              a team is underperforming their chances (positive regression expected).
            </p>
          </div>
        </div>

        {/* Special Teams Mismatches */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Special Teams Mismatch Strategy</h2>
          
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: '1.6', marginBottom: '1rem' }}>
            Elite power plays facing weak penalty kills create exploitable betting opportunities. We identify mismatches by comparing:
          </p>

          <ul style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: '1.8', paddingLeft: '1.5rem', marginBottom: '1rem' }}>
            <li>Power Play xG per 60 (offensive efficiency)</li>
            <li>Penalty Kill xG Against per 60 (defensive vulnerability)</li>
            <li>Differential threshold: +2.0 or greater per 60 minutes</li>
          </ul>

          <div style={{
            padding: '1rem',
            backgroundColor: 'rgba(212, 175, 55, 0.05)',
            border: '1px solid var(--color-accent)',
            borderRadius: '4px',
          }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              <strong style={{ color: 'var(--color-accent)' }}>Example:</strong> If Team A's PP generates 8.5 xG/60 and Team B's PK allows 
              6.0 xGA/60, the mismatch of +2.5 suggests betting on Team A's team total or game OVER.
            </p>
          </div>
        </div>

        {/* Risk Management */}
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem' }}>Risk Management</h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Confidence Scoring</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
              Each opportunity includes a confidence score (0-100%) based on the strength of underlying indicators. Higher confidence
              scores warrant larger bet sizing using the Kelly Criterion.
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Edge Calculation</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
              The edge represents the expected value advantage over the betting market, expressed as a percentage. Positive edges indicate
              profitable long-term opportunities.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Bankroll Guidelines</h3>
            <ul style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: '1.8', paddingLeft: '1.5rem' }}>
              <li>Never bet more than 2-3% of bankroll on a single play</li>
              <li>Scale bet size with confidence (higher confidence = larger bet within limits)</li>
              <li>Track all bets to measure actual performance vs. projections</li>
              <li>Require minimum 5% edge to justify placing a bet</li>
            </ul>
          </div>
        </div>

        {/* Code Reference */}
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: 'rgba(212, 175, 55, 0.05)',
          border: '1px solid var(--color-accent)',
          borderRadius: '4px',
        }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            <strong style={{ color: 'var(--color-accent)' }}>Verify the Math:</strong> All calculations are performed in{' '}
            <code style={{
              fontFamily: 'Monaco, Consolas, monospace',
              backgroundColor: 'var(--color-card)',
              padding: '0.125rem 0.25rem',
              borderRadius: '2px',
            }}>
              src/utils/dataProcessing.js
            </code>
            {' '}and can be audited in the Data Inspector page. Every metric displayed uses real CSV data with transparent,
            verifiable calculations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Methodology;
