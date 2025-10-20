import { useState, useEffect } from 'react';
import { BookOpen, Code } from 'lucide-react';

const Methodology = () => {
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
            📚 Methodology
          </h1>
          <p style={{ 
            color: 'var(--color-text-secondary)', 
            fontSize: isMobile ? '0.875rem' : '0.938rem',
            lineHeight: '1.6'
          }}>
            Mathematical foundations and betting strategies behind NHL Savant analytics. All formulas are transparent, verifiable, and backed by real data.
          </p>
        </div>
      </div>

      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: isMobile ? '1rem' : '2rem'
      }}>
        {/* Expected Goals (xG) */}
        <div className="elevated-card methodology-section" style={{ marginBottom: isMobile ? '1.5rem' : '2rem' }}>
          <h2 style={{ 
            marginBottom: isMobile ? '1rem' : '1.5rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            fontSize: isMobile ? '1.125rem' : '1.25rem'
          }}>
            <BookOpen size={isMobile ? 18 : 20} />
            Expected Goals (xG) Analysis
          </h2>
          
          <div style={{ marginBottom: isMobile ? '1rem' : '1.5rem' }}>
            <h3 style={{ 
              fontSize: isMobile ? '0.938rem' : '1rem', 
              marginBottom: '0.75rem',
              fontWeight: '600' 
            }}>
              What is xG?
            </h3>
            <p style={{ 
              fontSize: isMobile ? '0.875rem' : '0.938rem', 
              color: 'var(--color-text-secondary)', 
              lineHeight: '1.6' 
            }}>
              Expected Goals (xG) is a statistical metric that measures the quality of scoring chances. Each shot is assigned a probability
              of becoming a goal based on historical data, considering factors like shot location, type, and game situation.
            </p>
          </div>

          <div style={{ marginBottom: isMobile ? '1rem' : '1.5rem' }}>
            <h3 style={{ 
              fontSize: isMobile ? '0.938rem' : '1rem', 
              marginBottom: '0.75rem',
              fontWeight: '600'
            }}>
              Per-60 Normalization
            </h3>
            <p style={{ 
              fontSize: isMobile ? '0.875rem' : '0.938rem', 
              color: 'var(--color-text-secondary)', 
              lineHeight: '1.6', 
              marginBottom: '0.75rem' 
            }}>
              To compare teams fairly, we normalize all metrics to a 60-minute rate:
            </p>
            <div className="methodology-example" style={{
              fontFamily: 'Monaco, Consolas, monospace',
              fontSize: isMobile ? '0.75rem' : '0.813rem',
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '4px',
              padding: isMobile ? '0.75rem' : '1rem',
              color: 'var(--color-accent)',
              overflowX: 'auto'
            }}>
              xG per 60 = (xGoals / Ice Time in seconds) × 3600
            </div>
          </div>

          <div>
            <h3 style={{ 
              fontSize: isMobile ? '0.938rem' : '1rem', 
              marginBottom: '0.75rem',
              fontWeight: '600'
            }}>
              Why xG Matters for Betting
            </h3>
            <ul style={{ 
              fontSize: isMobile ? '0.875rem' : '0.938rem', 
              color: 'var(--color-text-secondary)', 
              lineHeight: '1.8', 
              paddingLeft: isMobile ? '1.25rem' : '1.5rem' 
            }}>
              <li>Reveals true team quality beyond results influenced by luck</li>
              <li>Identifies teams with strong underlying metrics but poor record (value bets)</li>
              <li>Predicts future performance more accurately than goals scored</li>
              <li>Situational xG (5v5, PP, PK) exposes specific strengths and weaknesses</li>
            </ul>
          </div>
        </div>

        {/* PDO & Regression */}
        <div className="elevated-card methodology-section" style={{ marginBottom: isMobile ? '1.5rem' : '2rem' }}>
          <h2 style={{ 
            marginBottom: isMobile ? '1rem' : '1.5rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            fontSize: isMobile ? '1.125rem' : '1.25rem'
          }}>
            <Code size={isMobile ? 18 : 20} />
            PDO & Regression Theory
          </h2>
          
          <div style={{ marginBottom: isMobile ? '1rem' : '1.5rem' }}>
            <h3 style={{ 
              fontSize: isMobile ? '0.938rem' : '1rem', 
              marginBottom: '0.75rem',
              fontWeight: '600'
            }}>
              PDO Calculation
            </h3>
            <p style={{ 
              fontSize: isMobile ? '0.875rem' : '0.938rem', 
              color: 'var(--color-text-secondary)', 
              lineHeight: '1.6', 
              marginBottom: '0.75rem' 
            }}>
              PDO measures "puck luck" by combining shooting percentage and save percentage:
            </p>
            <div className="methodology-example" style={{
              fontFamily: 'Monaco, Consolas, monospace',
              fontSize: isMobile ? '0.75rem' : '0.813rem',
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '4px',
              padding: isMobile ? '0.75rem' : '1rem',
              color: 'var(--color-accent)',
              overflowX: 'auto'
            }}>
              PDO = (Goals For / Shots For) × 100 + (1 - Goals Against / Shots Against) × 100
            </div>
          </div>

          <div style={{ marginBottom: isMobile ? '1rem' : '1.5rem' }}>
            <h3 style={{ 
              fontSize: isMobile ? '0.938rem' : '1rem', 
              marginBottom: '0.75rem',
              fontWeight: '600'
            }}>
              Regression to the Mean
            </h3>
            <p style={{ 
              fontSize: isMobile ? '0.875rem' : '0.938rem', 
              color: 'var(--color-text-secondary)', 
              lineHeight: '1.6' 
            }}>
              Over time, PDO regresses toward 100.0 (league average). Teams with PDO significantly above or below 100 are experiencing
              unsustainable luck and will likely regress.
            </p>
          </div>

          <div>
            <h3 style={{ 
              fontSize: isMobile ? '0.938rem' : '1rem', 
              marginBottom: '0.75rem',
              fontWeight: '600'
            }}>
              Betting Applications
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: isMobile ? '0.75rem' : '1rem',
            }}>
              <div style={{
                padding: isMobile ? '0.875rem' : '1rem',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid var(--color-danger)',
                borderRadius: '4px',
              }}>
                <div style={{ 
                  fontWeight: 600, 
                  marginBottom: '0.5rem', 
                  color: 'var(--color-danger)',
                  fontSize: isMobile ? '0.938rem' : '1rem'
                }}>
                  PDO &gt; 102
                </div>
                <div style={{ 
                  fontSize: isMobile ? '0.875rem' : '0.938rem', 
                  color: 'var(--color-text-secondary)' 
                }}>
                  Overperforming due to luck. Bet UNDER or AGAINST.
                </div>
              </div>
              <div style={{
                padding: isMobile ? '0.875rem' : '1rem',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid var(--color-success)',
                borderRadius: '4px',
              }}>
                <div style={{ 
                  fontWeight: 600, 
                  marginBottom: '0.5rem', 
                  color: 'var(--color-success)',
                  fontSize: isMobile ? '0.938rem' : '1rem'
                }}>
                  PDO &lt; 98
                </div>
                <div style={{ 
                  fontSize: isMobile ? '0.875rem' : '0.938rem', 
                  color: 'var(--color-text-secondary)' 
                }}>
                  Underperforming due to bad luck. Bet OVER or WITH.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expected Value Calculation */}
        <div className="elevated-card methodology-section" style={{ marginBottom: isMobile ? '1.5rem' : '2rem' }}>
          <h2 style={{ 
            marginBottom: isMobile ? '1rem' : '1.5rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            fontSize: isMobile ? '1.125rem' : '1.25rem'
          }}>
            <BookOpen size={isMobile ? 18 : 20} />
            Expected Value (EV) Calculation
          </h2>
          
          <div style={{ marginBottom: isMobile ? '1rem' : '1.5rem' }}>
            <h3 style={{ 
              fontSize: isMobile ? '0.938rem' : '1rem', 
              marginBottom: '0.75rem',
              fontWeight: '600'
            }}>
              What is EV?
            </h3>
            <p style={{ 
              fontSize: isMobile ? '0.875rem' : '0.938rem', 
              color: 'var(--color-text-secondary)', 
              lineHeight: '1.6' 
            }}>
              Expected Value (EV) measures the average amount you can expect to win or lose per bet over the long term.
              A positive EV indicates a profitable bet over time, while negative EV indicates a losing bet.
            </p>
          </div>

          <div style={{ marginBottom: isMobile ? '1rem' : '1.5rem' }}>
            <h3 style={{ 
              fontSize: isMobile ? '0.938rem' : '1rem', 
              marginBottom: '0.75rem',
              fontWeight: '600'
            }}>
              Formula
            </h3>
            <div className="methodology-example" style={{
              fontFamily: 'Monaco, Consolas, monospace',
              fontSize: isMobile ? '0.75rem' : '0.813rem',
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '4px',
              padding: isMobile ? '0.75rem' : '1rem',
              color: 'var(--color-accent)',
              marginBottom: '1rem',
              overflowX: 'auto'
            }}>
              EV = (P_model × Total Return) - Stake
            </div>
            <p style={{ 
              fontSize: isMobile ? '0.875rem' : '0.938rem', 
              color: 'var(--color-text-secondary)', 
              lineHeight: '1.6' 
            }}>
              Where P_model is your model's win probability, Total Return is your stake plus winnings, and Stake is your bet amount.
            </p>
          </div>

          <div style={{ marginBottom: isMobile ? '1rem' : '1.5rem' }}>
            <h3 style={{ 
              fontSize: isMobile ? '0.938rem' : '1rem', 
              marginBottom: '0.75rem',
              fontWeight: '600'
            }}>
              Example
            </h3>
            <div className="methodology-example" style={{
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '4px',
              padding: isMobile ? '0.875rem' : '1rem',
            }}>
              <p style={{ 
                fontSize: isMobile ? '0.875rem' : '0.938rem', 
                color: 'var(--color-text-secondary)', 
                lineHeight: '1.6', 
                marginBottom: '0.5rem' 
              }}>
                <strong>Scenario:</strong> Our model gives Team A a 55% win probability, but the market odds are +150 (implied 40% probability).
              </p>
              <p style={{ 
                fontSize: isMobile ? '0.875rem' : '0.938rem', 
                color: 'var(--color-text-secondary)', 
                lineHeight: '1.6', 
                marginBottom: '0.5rem' 
              }}>
                <strong>Calculation:</strong> On a $100 bet at +150 odds, total return is $250 ($100 stake + $150 winnings).
              </p>
              <p style={{ 
                fontSize: isMobile ? '0.875rem' : '0.938rem', 
                color: 'var(--color-text-secondary)', 
                lineHeight: '1.6', 
                marginBottom: '0.5rem' 
              }}>
                EV = (0.55 × $250) - $100 = $137.50 - $100 = <strong style={{ color: 'var(--color-success)' }}>+$37.50</strong>
              </p>
              <p style={{ 
                fontSize: isMobile ? '0.875rem' : '0.938rem', 
                color: 'var(--color-success)', 
                lineHeight: '1.6' 
              }}>
                <strong>Result:</strong> This is a +37.5% EV bet — excellent value!
              </p>
            </div>
          </div>

          <div style={{
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid var(--color-success)',
            borderRadius: '4px',
            padding: isMobile ? '0.875rem' : '1rem',
          }}>
            <p style={{ 
              fontSize: isMobile ? '0.875rem' : '0.938rem', 
              color: 'var(--color-text-secondary)' 
            }}>
              <strong style={{ color: 'var(--color-success)' }}>Betting Rule:</strong> Only bet when EV &gt; 0. The higher the EV percentage,
              the better the opportunity.
            </p>
          </div>
        </div>

        {/* Kelly Criterion */}
        <div className="elevated-card methodology-section" style={{ marginBottom: isMobile ? '1.5rem' : '2rem' }}>
          <h2 style={{ 
            marginBottom: isMobile ? '1rem' : '1.5rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            fontSize: isMobile ? '1.125rem' : '1.25rem'
          }}>
            <BookOpen size={isMobile ? 18 : 20} />
            Kelly Criterion (Stake Sizing)
          </h2>
          
          <div style={{ marginBottom: isMobile ? '1rem' : '1.5rem' }}>
            <h3 style={{ 
              fontSize: isMobile ? '0.938rem' : '1rem', 
              marginBottom: '0.75rem',
              fontWeight: '600'
            }}>
              What is Kelly?
            </h3>
            <p style={{ 
              fontSize: isMobile ? '0.875rem' : '0.938rem', 
              color: 'var(--color-text-secondary)', 
              lineHeight: '1.6' 
            }}>
              The Kelly Criterion is a formula for determining the optimal bet size to maximize long-term growth while minimizing
              risk of ruin. It calculates what percentage of your bankroll to wager on a positive EV bet.
            </p>
          </div>

          <div style={{ marginBottom: isMobile ? '1rem' : '1.5rem' }}>
            <h3 style={{ 
              fontSize: isMobile ? '0.938rem' : '1rem', 
              marginBottom: '0.75rem',
              fontWeight: '600'
            }}>
              Formula
            </h3>
            <div className="methodology-example" style={{
              fontFamily: 'Monaco, Consolas, monospace',
              fontSize: isMobile ? '0.75rem' : '0.813rem',
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '4px',
              padding: isMobile ? '0.75rem' : '1rem',
              color: 'var(--color-accent)',
              marginBottom: '0.5rem',
              overflowX: 'auto'
            }}>
              f* = (bp - q) / b
            </div>
            <p style={{ 
              fontSize: isMobile ? '0.875rem' : '0.938rem', 
              color: 'var(--color-text-secondary)', 
              lineHeight: '1.6', 
              marginBottom: '0.5rem' 
            }}>
              Where:
            </p>
            <ul style={{ 
              fontSize: isMobile ? '0.875rem' : '0.938rem', 
              color: 'var(--color-text-secondary)', 
              lineHeight: '1.6', 
              paddingLeft: isMobile ? '1.25rem' : '1.5rem' 
            }}>
              <li><code>b</code> = decimal odds - 1 (e.g., +150 → 1.5)</li>
              <li><code>p</code> = your model's win probability</li>
              <li><code>q</code> = 1 - p (loss probability)</li>
            </ul>
          </div>

          <div style={{ marginBottom: isMobile ? '1rem' : '1.5rem' }}>
            <h3 style={{ 
              fontSize: isMobile ? '0.938rem' : '1rem', 
              marginBottom: '0.75rem',
              fontWeight: '600'
            }}>
              Fractional Kelly (Recommended)
            </h3>
            <p style={{ 
              fontSize: isMobile ? '0.875rem' : '0.938rem', 
              color: 'var(--color-text-secondary)', 
              lineHeight: '1.6', 
              marginBottom: '0.75rem' 
            }}>
              Full Kelly can be aggressive and lead to large swings. We recommend <strong>25% Kelly</strong> (Quarter Kelly) for more conservative,
              sustainable bankroll growth.
            </p>
            <div className="methodology-example" style={{
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '4px',
              padding: isMobile ? '0.875rem' : '1rem',
            }}>
              <p style={{ 
                fontSize: isMobile ? '0.875rem' : '0.938rem', 
                color: 'var(--color-text-secondary)', 
                lineHeight: '1.6' 
              }}>
                <strong>Example:</strong> If Kelly suggests 8% of bankroll, we recommend betting 2% (8% × 0.25).
                On a $1,000 bankroll, that's $20 instead of $80.
              </p>
            </div>
          </div>

          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid var(--color-danger)',
            borderRadius: '4px',
            padding: isMobile ? '0.875rem' : '1rem',
          }}>
            <p style={{ 
              fontSize: isMobile ? '0.875rem' : '0.938rem', 
              color: 'var(--color-text-secondary)' 
            }}>
              <strong style={{ color: 'var(--color-danger)' }}>Risk Management:</strong> Never bet more than 5% of your bankroll on a single game,
              even if Kelly suggests higher. This protects against model errors and variance.
            </p>
          </div>
        </div>

        {/* Game Total Prediction */}
        <div className="elevated-card methodology-section" style={{ marginBottom: isMobile ? '1.5rem' : '2rem' }}>
          <h2 style={{ 
            marginBottom: isMobile ? '1rem' : '1.5rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            fontSize: isMobile ? '1.125rem' : '1.25rem'
          }}>
            <BookOpen size={isMobile ? 18 : 20} />
            Game Total Prediction Model
          </h2>
          
          <div style={{ marginBottom: isMobile ? '1rem' : '1.5rem' }}>
            <h3 style={{ 
              fontSize: isMobile ? '0.938rem' : '1rem', 
              marginBottom: '0.75rem',
              fontWeight: '600'
            }}>
              How We Predict Game Totals
            </h3>
            <p style={{ 
              fontSize: isMobile ? '0.875rem' : '0.938rem', 
              color: 'var(--color-text-secondary)', 
              lineHeight: '1.6' 
            }}>
              Our model uses score-adjusted expected goals (xG), applies PDO regression, and weights both teams' offense and defense 
              (55% offense / 45% defense) to predict individual team scores and total goals.
            </p>
          </div>

          <div style={{ marginBottom: isMobile ? '1rem' : '1.5rem' }}>
            <h3 style={{ 
              fontSize: isMobile ? '0.938rem' : '1rem', 
              marginBottom: '0.75rem',
              fontWeight: '600'
            }}>
              Key Components
            </h3>
            <ul style={{ 
              fontSize: isMobile ? '0.875rem' : '0.938rem', 
              color: 'var(--color-text-secondary)', 
              lineHeight: '1.6', 
              paddingLeft: isMobile ? '1.25rem' : '1.5rem' 
            }}>
              <li><strong>Score-Adjusted xG:</strong> Removes bias from teams protecting leads or chasing deficits</li>
              <li><strong>PDO Regression:</strong> Adjusts for unsustainable luck (high/low shooting % or save %)</li>
              <li><strong>5v5 Weight:</strong> 77% of game time (46.2 minutes)</li>
              <li><strong>PP/PK Weight:</strong> 23% of game time (13.8 minutes)</li>
              <li><strong>Home Ice:</strong> +5% win probability boost</li>
            </ul>
          </div>

          <div>
            <h3 style={{ 
              fontSize: isMobile ? '0.938rem' : '1rem', 
              marginBottom: '0.75rem',
              fontWeight: '600'
            }}>
              Win Probability
            </h3>
            <p style={{ 
              fontSize: isMobile ? '0.875rem' : '0.938rem', 
              color: 'var(--color-text-secondary)', 
              lineHeight: '1.6' 
            }}>
              We use a logistic regression model that accounts for xG differential, PDO regression, and home-ice advantage 
              to estimate moneyline win probabilities. This S-curve approach reflects real-world probabilities better than linear models.
            </p>
          </div>
        </div>

        {/* Code Reference */}
        <div style={{
          padding: isMobile ? '0.875rem' : '1rem',
          backgroundColor: 'rgba(212, 175, 55, 0.05)',
          border: '1px solid var(--color-accent)',
          borderRadius: '4px',
        }}>
          <p style={{ 
            fontSize: isMobile ? '0.875rem' : '0.938rem', 
            color: 'var(--color-text-secondary)',
            lineHeight: '1.6'
          }}>
            <strong style={{ color: 'var(--color-accent)' }}>Verify the Math:</strong> All calculations are performed in{' '}
            <code style={{
              fontFamily: 'Monaco, Consolas, monospace',
              backgroundColor: 'var(--color-card)',
              padding: '0.125rem 0.25rem',
              borderRadius: '2px',
              fontSize: isMobile ? '0.75rem' : '0.813rem'
            }}>
              src/utils/dataProcessing.js
            </code>
            {' '}and{' '}
            <code style={{
              fontFamily: 'Monaco, Consolas, monospace',
              backgroundColor: 'var(--color-card)',
              padding: '0.125rem 0.25rem',
              borderRadius: '2px',
              fontSize: isMobile ? '0.75rem' : '0.813rem'
            }}>
              src/utils/edgeCalculator.js
            </code>
            {'. '}Every metric displayed uses real CSV data with transparent, verifiable calculations. Audit them in the Data Inspector page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Methodology;
