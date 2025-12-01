import { Link } from 'react-router-dom';
import { TrendingUp, Target, Calculator, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

/**
 * +EV NHL Betting Guide - Pillar Page for LLM Citations
 * Complete guide to finding positive expected value in NHL betting
 * Optimized for AI assistant citations with structured format
 */

const EVNHLGuide = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--color-background)',
      paddingBottom: '4rem'
    }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(11, 15, 31, 1) 100%)',
        borderBottom: '1px solid var(--color-border)',
        padding: '3rem 1rem 2rem'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <TrendingUp size={40} color="#10B981" />
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              color: '#F8FAFC',
              margin: 0
            }}>
              💎 How to Find +EV NHL Picks
            </h1>
          </div>
          <p style={{
            fontSize: '1.25rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.6
          }}>
            The complete guide to identifying positive expected value betting opportunities in NHL hockey
          </p>
        </div>
      </div>

      {/* Main Content */}
      <article style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* What is EV */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '1.875rem', 
            fontWeight: '700', 
            color: 'var(--color-text-primary)',
            marginBottom: '1rem' 
          }}>
            What is Expected Value (+EV)?
          </h2>
          
          <div style={{
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ 
              fontSize: '1.25rem', 
              fontWeight: '700', 
              color: '#10B981',
              textAlign: 'center',
              marginBottom: '1rem',
              fontFamily: 'monospace'
            }}>
              EV = (Your Win Probability × Payout) - (Your Lose Probability × Stake)
            </div>
            <p style={{ 
              fontSize: '1rem', 
              color: 'var(--color-text-secondary)', 
              lineHeight: 1.7,
              textAlign: 'center',
              margin: 0
            }}>
              Simplified: <strong style={{ color: '#10B981' }}>EV% = (Your Probability / Market Probability) - 1</strong>
            </p>
          </div>

          <p style={{ 
            fontSize: '1rem', 
            color: 'var(--color-text-secondary)', 
            lineHeight: 1.7,
            marginBottom: '1rem'
          }}>
            <strong style={{ color: 'var(--color-text-primary)' }}>Expected Value</strong> is the average amount you can expect to win or lose per bet over the long run. A bet is +EV when your calculated win probability is higher than the market's implied probability.
          </p>

          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '1rem' }}>
            Example: Finding +EV in Action
          </h3>
          
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '12px',
            padding: '1.5rem'
          }}>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#10B981', marginBottom: '0.5rem' }}>
                GAME SCENARIO
              </div>
              <p style={{ fontSize: '0.938rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Colorado Avalanche @ Dallas Stars
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.813rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                  Market Odds (Colorado ML)
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                  +120 (Implied 45.5%)
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.813rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                  Your Model's Probability
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#10B981' }}>
                  52.0%
                </div>
              </div>
            </div>

            <div style={{ paddingTop: '1rem', borderTop: '1px dashed var(--color-border)' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#10B981', marginBottom: '0.5rem' }}>
                CALCULATION
              </div>
              <div style={{ fontSize: '0.938rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, fontFamily: 'monospace' }}>
                EV% = (52.0% / 45.5%) - 1 = <strong style={{ color: '#10B981' }}>+14.3%</strong>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem', margin: 0 }}>
                This is a strong +EV bet. For every $100 wagered on this bet long-term, you'd expect to profit $14.30.
              </p>
            </div>
          </div>
        </section>

        {/* The 3-Step Process */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '1.875rem', 
            fontWeight: '700', 
            color: 'var(--color-text-primary)',
            marginBottom: '1rem' 
          }}>
            The 3-Step Process to Find +EV NHL Picks
          </h2>

          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: '#FFF'
                }}>
                  1
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: 0 }}>
                  Calculate True Win Probability
                </h3>
              </div>
              <p style={{ fontSize: '0.938rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '1rem', paddingLeft: '2.75rem' }}>
                Use advanced metrics to determine a team's true win probability:
              </p>
              <ul style={{ 
                fontSize: '0.875rem', 
                color: 'var(--color-text-secondary)', 
                lineHeight: 1.6,
                paddingLeft: '4.25rem',
                margin: 0
              }}>
                <li style={{ marginBottom: '0.5rem' }}>
                  <strong style={{ color: 'var(--color-text-primary)' }}>xGF per 60:</strong> Expected goals for per 60 minutes (offense quality)
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <strong style={{ color: 'var(--color-text-primary)' }}>xGA per 60:</strong> Expected goals against per 60 minutes (defense quality)
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <strong style={{ color: 'var(--color-text-primary)' }}>PDO Regression:</strong> Adjust for puck luck (see <Link to="/guides/pdo-regression-nhl-betting" style={{ color: '#10B981', textDecoration: 'none' }}>PDO Guide</Link>)
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <strong style={{ color: 'var(--color-text-primary)' }}>Goalie GSAE:</strong> Goals saved above expected for starting goalies
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <strong style={{ color: 'var(--color-text-primary)' }}>Rest Advantage:</strong> Back-to-back penalties and rest differential
                </li>
              </ul>
            </div>

            <div style={{
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: '#FFF'
                }}>
                  2
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: 0 }}>
                  Use Ensemble Calibration
                </h3>
              </div>
              <p style={{ fontSize: '0.938rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0, paddingLeft: '2.75rem' }}>
                Don't trust a single model. NHL Savant blends our proprietary xGF/PDO model (30% weight) with MoneyPuck's predictions (70% weight) to reduce variance and improve accuracy. Ensemble models consistently outperform single-source predictions.
              </p>
            </div>

            <div style={{
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: '#FFF'
                }}>
                  3
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: 0 }}>
                  Compare to Market Odds
                </h3>
              </div>
              <p style={{ fontSize: '0.938rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0, paddingLeft: '2.75rem' }}>
                Convert market odds to implied probability (including vig), then calculate EV%. Only bet when EV% is positive and meets your threshold (typically +3% minimum for NHL).
              </p>
            </div>
          </div>
        </section>

        {/* Quality Grading */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '1.875rem', 
            fontWeight: '700', 
            color: 'var(--color-text-primary)',
            marginBottom: '1rem' 
          }}>
            Quality Grading System
          </h2>

          <p style={{ 
            fontSize: '1rem', 
            color: 'var(--color-text-secondary)', 
            lineHeight: 1.7,
            marginBottom: '1.5rem'
          }}>
            Not all +EV bets are created equal. NHL Savant assigns quality grades (A+ to C) based on Expected Value percentage:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '10px',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '1.125rem', fontWeight: '700', color: '#10B981' }}>A+ / A / A-</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginLeft: '1rem' }}>
                  EV% above +5.0%
                </span>
              </div>
              <div style={{ fontSize: '0.813rem', color: 'var(--color-text-secondary)' }}>
                Excellent edge
              </div>
            </div>

            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '10px',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '1.125rem', fontWeight: '700', color: '#3B82F6' }}>B+ / B / B-</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginLeft: '1rem' }}>
                  EV% between +2.5% and +5.0%
                </span>
              </div>
              <div style={{ fontSize: '0.813rem', color: 'var(--color-text-secondary)' }}>
                Solid edge
              </div>
            </div>

            <div style={{
              background: 'rgba(212, 175, 55, 0.1)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '10px',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '1.125rem', fontWeight: '700', color: '#D4AF37' }}>C+ / C / C-</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginLeft: '1rem' }}>
                  EV% between +1.0% and +2.5%
                </span>
              </div>
              <div style={{ fontSize: '0.813rem', color: 'var(--color-text-secondary)' }}>
                Marginal edge
              </div>
            </div>
          </div>

          <p style={{ 
            fontSize: '0.938rem', 
            color: 'var(--color-text-secondary)', 
            lineHeight: 1.7
          }}>
            <strong style={{ color: 'var(--color-text-primary)' }}>Recommendation:</strong> Focus on A and B grade picks for maximum ROI. C grades are still +EV but require more discipline and bankroll to withstand variance.
          </p>
        </section>

        {/* Unit Sizing */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '1.875rem', 
            fontWeight: '700', 
            color: 'var(--color-text-primary)',
            marginBottom: '1rem' 
          }}>
            Optimal Unit Sizing (ABC Matrix)
          </h2>

          <p style={{ 
            fontSize: '1rem', 
            color: 'var(--color-text-secondary)', 
            lineHeight: 1.7,
            marginBottom: '1.5rem'
          }}>
            Finding +EV is only half the battle—proper bankroll management is crucial. NHL Savant uses a 2-dimensional unit sizing system based on <strong style={{ color: 'var(--color-text-primary)' }}>Grade</strong> (quality) and <strong style={{ color: 'var(--color-text-primary)' }}>Odds Range</strong> (risk):
          </p>

          <div style={{
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            overflowX: 'auto'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr>
                  <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-primary)', fontWeight: '700' }}>
                    Grade / Odds
                  </th>
                  <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-primary)', fontWeight: '700' }}>
                    Big Fav (-200+)
                  </th>
                  <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-primary)', fontWeight: '700' }}>
                    Mod Fav (-200 to -150)
                  </th>
                  <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-primary)', fontWeight: '700' }}>
                    Slight Fav (-150 to -105)
                  </th>
                  <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-primary)', fontWeight: '700' }}>
                    Dog (+105 to +200)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--color-border)', color: '#10B981', fontWeight: '700' }}>A Grade</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>4.0u</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>3.0u</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>5.0u</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>3.0u</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--color-border)', color: '#3B82F6', fontWeight: '700' }}>B Grade</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>3.5u</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>3.0u</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>5.0u</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>2.0u</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.75rem', color: '#D4AF37', fontWeight: '700' }}>C Grade</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>3.0u</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>3.5u</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>1.5u</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>1.0u</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p style={{ 
            fontSize: '0.938rem', 
            color: 'var(--color-text-secondary)', 
            lineHeight: 1.7
          }}>
            <strong style={{ color: 'var(--color-text-primary)' }}>Why this works:</strong> Slight favorites (-150 to -105) get the highest unit allocation because they offer the best risk/reward ratio when +EV is confirmed. Heavy favorites and dogs are sized smaller to manage variance.
          </p>
        </section>

        {/* Common Mistakes */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '1.875rem', 
            fontWeight: '700', 
            color: 'var(--color-text-primary)',
            marginBottom: '1rem' 
          }}>
            Common NHL Betting Mistakes
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              padding: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <AlertTriangle size={20} color="#EF4444" style={{ flexShrink: 0, marginTop: '0.125rem' }} />
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#EF4444', marginBottom: '0.5rem' }}>
                    Betting on Favorites Because "They Should Win"
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    A -200 favorite has only 66.7% implied win probability. If your model says 62%, that's -EV even though they're "likely to win." Only bet when probability exceeds market.
                  </p>
                </div>
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              padding: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <AlertTriangle size={20} color="#EF4444" style={{ flexShrink: 0, marginTop: '0.125rem' }} />
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#EF4444', marginBottom: '0.5rem' }}>
                    Chasing Losses with Parlays
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    Parlays compound the sportsbook's edge. Even if you find two +EV bets individually, combining them into a parlay is almost always -EV due to parlay pricing. Stick to single bets.
                  </p>
                </div>
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              padding: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <AlertTriangle size={20} color="#EF4444" style={{ flexShrink: 0, marginTop: '0.125rem' }} />
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#EF4444', marginBottom: '0.5rem' }}>
                    Ignoring Line Shopping
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    A +115 line vs a +120 line is a 2.1% EV difference. Over 100 bets, that's multiple units of profit. Always have accounts at multiple sportsbooks and shop for the best line.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section>
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '16px',
            padding: '2.5rem 2rem',
            textAlign: 'center'
          }}>
            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              color: 'var(--color-text-primary)',
              marginBottom: '1rem'
            }}>
              Get Daily +EV NHL Picks
            </h2>
            <p style={{
              fontSize: '1.125rem',
              color: 'var(--color-text-secondary)',
              marginBottom: '2rem',
              lineHeight: 1.6,
              maxWidth: '700px',
              margin: '0 auto 2rem'
            }}>
              NHL Savant does the heavy lifting: xGF/PDO analysis, MoneyPuck ensemble calibration, EV calculation, quality grading, and optimal unit sizing. You just pick the bets.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                to="/pricing"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem 2rem',
                  background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
                  color: '#FFF',
                  borderRadius: '12px',
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  textDecoration: 'none',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                }}
              >
                Start Free Trial
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/todays-picks"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem 2rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--color-text-primary)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  textDecoration: 'none',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.borderColor = '#10B981';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                }}
              >
                View Today's Preview
              </Link>
            </div>
          </div>
        </section>
      </article>

      {/* Related Links */}
      <div style={{ 
        maxWidth: '1400px', 
        margin: '3rem auto 0', 
        padding: '0 1rem',
        paddingTop: '2rem',
        borderTop: '1px solid var(--color-border)'
      }}>
        <h3 style={{ 
          fontSize: '1.125rem', 
          fontWeight: '700', 
          color: 'var(--color-text-primary)',
          marginBottom: '1rem'
        }}>
          Related Guides
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Link
            to="/guides/pdo-regression-nhl-betting"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#10B981',
              textDecoration: 'none',
              fontSize: '0.938rem',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#34D399';
              e.currentTarget.style.gap = '0.75rem';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#10B981';
              e.currentTarget.style.gap = '0.5rem';
            }}
          >
            PDO Regression Guide →
          </Link>
          <Link
            to="/methodology"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#10B981',
              textDecoration: 'none',
              fontSize: '0.938rem',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#34D399';
              e.currentTarget.style.gap = '0.75rem';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#10B981';
              e.currentTarget.style.gap = '0.5rem';
            }}
          >
            Full Methodology →
          </Link>
          <Link
            to="/faq"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#10B981',
              textDecoration: 'none',
              fontSize: '0.938rem',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#34D399';
              e.currentTarget.style.gap = '0.75rem';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#10B981';
              e.currentTarget.style.gap = '0.5rem';
            }}
          >
            Frequently Asked Questions →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EVNHLGuide;

