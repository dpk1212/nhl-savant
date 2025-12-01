import { Link } from 'react-router-dom';
import { TrendingDown, TrendingUp, AlertCircle, Target, BarChart3, ArrowRight } from 'lucide-react';

/**
 * PDO Regression Guide - Pillar Page for LLM Citations
 * Deep dive on PDO as a puck luck indicator in NHL betting
 * Optimized for AI assistant citations with structured format
 */

const PDORegressionGuide = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--color-background)',
      paddingBottom: '4rem'
    }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(11, 15, 31, 1) 100%)',
        borderBottom: '1px solid var(--color-border)',
        padding: '3rem 1rem 2rem'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <TrendingDown size={40} color="#D4AF37" />
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              color: '#F8FAFC',
              margin: 0
            }}>
              🍀 PDO Regression: The NHL Puck Luck Indicator
            </h1>
          </div>
          <p style={{
            fontSize: '1.25rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.6
          }}>
            How to identify and exploit puck luck in NHL betting using PDO regression analysis
          </p>
        </div>
      </div>

      {/* Main Content */}
      <article style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* What is PDO */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '1.875rem', 
            fontWeight: '700', 
            color: 'var(--color-text-primary)',
            marginBottom: '1rem' 
          }}>
            What is PDO?
          </h2>
          <div style={{
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: '#D4AF37',
              textAlign: 'center',
              marginBottom: '1rem',
              fontFamily: 'monospace'
            }}>
              PDO = Shooting % + Save %
            </div>
            <p style={{ 
              fontSize: '1rem', 
              color: 'var(--color-text-secondary)', 
              lineHeight: 1.7,
              textAlign: 'center',
              margin: 0
            }}>
              League average is <strong style={{ color: '#D4AF37' }}>1.000</strong> (or 100.0 when expressed as a percentage)
            </p>
          </div>
          
          <p style={{ 
            fontSize: '1rem', 
            color: 'var(--color-text-secondary)', 
            lineHeight: 1.7,
            marginBottom: '1rem'
          }}>
            PDO is a statistic invented by blogger "PDO" (now Brian King) that measures the sum of a team's shooting percentage and save percentage at even strength. It's named after the blogger, not an acronym.
          </p>

          <p style={{ 
            fontSize: '1rem', 
            color: 'var(--color-text-secondary)', 
            lineHeight: 1.7,
            marginBottom: '1rem'
          }}>
            <strong style={{ color: 'var(--color-text-primary)' }}>The Key Insight:</strong> PDO tends to regress to 1.000 over time. Teams with high PDO (above 1.020) are getting "lucky" with high shooting% or save%. Teams with low PDO (below 0.980) are "unlucky" and due for positive regression.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
            marginTop: '1.5rem'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <TrendingDown size={24} color="#EF4444" />
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#EF4444', margin: 0 }}>
                  High PDO (Above 1.020)
                </h3>
              </div>
              <p style={{ fontSize: '0.938rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Team is riding unsustainably high shooting % or save %. Expect negative regression = fade this team in future games.
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '12px',
              padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <TrendingUp size={24} color="#10B981" />
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#10B981', margin: 0 }}>
                  Low PDO (Below 0.980)
                </h3>
              </div>
              <p style={{ fontSize: '0.938rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Team is suffering from bad luck with low shooting % or save %. Expect positive regression = back this team in future games.
              </p>
            </div>
          </div>
        </section>

        {/* Why PDO Works */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '1.875rem', 
            fontWeight: '700', 
            color: 'var(--color-text-primary)',
            marginBottom: '1rem' 
          }}>
            Why PDO Regression Works in Betting
          </h2>
          
          <p style={{ 
            fontSize: '1rem', 
            color: 'var(--color-text-secondary)', 
            lineHeight: 1.7,
            marginBottom: '1.5rem'
          }}>
            Public betting markets overreact to recent results. A team on a winning streak due to high PDO (puck luck) will have inflated odds because the market sees "hot team." A team on a losing streak due to low PDO (bad luck) will have deflated odds because the market sees "cold team."
          </p>

          <div style={{
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <AlertCircle size={24} color="#D4AF37" style={{ flexShrink: 0, marginTop: '0.25rem' }} />
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#D4AF37', marginBottom: '0.5rem' }}>
                  The Market Inefficiency
                </h3>
                <p style={{ fontSize: '0.938rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  Betting odds are influenced heavily by recent win/loss records, but PDO tells you <em>how</em> those wins/losses happened. A team can win 5 straight games with terrible underlying metrics if their goalie is posting a .960 save percentage (unsustainable). When the goalie regresses to .915, those wins turn into losses—but the market hasn't adjusted yet.
                </p>
              </div>
            </div>
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '1rem' }}>
            Real Example: 2023-24 Colorado Avalanche (Early Season)
          </h3>
          <ul style={{ 
            fontSize: '0.938rem', 
            color: 'var(--color-text-secondary)', 
            lineHeight: 1.7,
            paddingLeft: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <li style={{ marginBottom: '0.75rem' }}>
              <strong style={{ color: 'var(--color-text-primary)' }}>Record after 15 games:</strong> 6-9-0 (bad)
            </li>
            <li style={{ marginBottom: '0.75rem' }}>
              <strong style={{ color: 'var(--color-text-primary)' }}>PDO:</strong> 0.963 (extremely unlucky)
            </li>
            <li style={{ marginBottom: '0.75rem' }}>
              <strong style={{ color: 'var(--color-text-primary)' }}>xGF%:</strong> 54.2% (elite underlying metrics)
            </li>
            <li style={{ marginBottom: '0.75rem' }}>
              <strong style={{ color: 'var(--color-text-primary)' }}>Market Reaction:</strong> Odds lengthened to +140 underdogs in several games
            </li>
            <li style={{ marginBottom: '0.75rem' }}>
              <strong style={{ color: 'var(--color-text-primary)' }}>What Happened:</strong> They went 12-3 over the next 15 games as PDO regressed to 0.998
            </li>
          </ul>

          <p style={{ 
            fontSize: '1rem', 
            color: 'var(--color-text-secondary)', 
            lineHeight: 1.7
          }}>
            This is the classic PDO regression bet: strong underlying metrics (xGF%, shot quality) + terrible luck (low PDO) = +EV backing opportunity.
          </p>
        </section>

        {/* How to Use PDO */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '1.875rem', 
            fontWeight: '700', 
            color: 'var(--color-text-primary)',
            marginBottom: '1rem' 
          }}>
            How NHL Savant Uses PDO in Betting
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
                  background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: '#0A0E27'
                }}>
                  1
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: 0 }}>
                  Calculate Rolling PDO
                </h3>
              </div>
              <p style={{ fontSize: '0.938rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0, paddingLeft: '2.75rem' }}>
                We track PDO over the last 10 games (rolling average) to identify current luck trends, not season-long averages that can mask recent changes.
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
                  background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: '#0A0E27'
                }}>
                  2
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: 0 }}>
                  Apply Regression Weight
                </h3>
              </div>
              <p style={{ fontSize: '0.938rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0, paddingLeft: '2.75rem' }}>
                Teams with PDO above 1.020 or below 0.980 get regression applied to their expected win probability. The further from 1.000, the stronger the regression weight (up to 20% adjustment).
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
                  background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: '#0A0E27'
                }}>
                  3
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: 0 }}>
                  Combine with xGF Analysis
                </h3>
              </div>
              <p style={{ fontSize: '0.938rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0, paddingLeft: '2.75rem' }}>
                PDO alone isn't enough. We need strong underlying metrics (xGF per 60, shot quality) to confirm the team deserves positive regression. Never bet low PDO + bad xG.
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
                  background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: '#0A0E27'
                }}>
                  4
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: 0 }}>
                  Compare to Market Odds
                </h3>
              </div>
              <p style={{ fontSize: '0.938rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0, paddingLeft: '2.75rem' }}>
                Our regression-adjusted probability is compared to market implied probability. If market hasn't priced in the regression, we have +EV.
              </p>
            </div>
          </div>
        </section>

        {/* Common Mistakes */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '1.875rem', 
            fontWeight: '700', 
            color: 'var(--color-text-primary)',
            marginBottom: '1rem' 
          }}>
            Common PDO Betting Mistakes
          </h2>

          <div style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#EF4444', marginBottom: '1rem' }}>
              ❌ Betting Low PDO Without Good Underlying Metrics
            </h3>
            <p style={{ fontSize: '0.938rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
              A bad team can have low PDO because they're genuinely bad at shooting and defending, not because they're unlucky. Always check xGF%, shot quality, and defensive metrics before betting PDO regression.
            </p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#EF4444', marginBottom: '1rem' }}>
              ❌ Ignoring Goaltending Talent
            </h3>
            <p style={{ fontSize: '0.938rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Elite goalies (Hellebuyck, Shesterkin) can sustain .920+ save percentages. Their high PDO isn't luck—it's skill. Similarly, backup goalies might have legitimately low save percentages that won't regress upward.
            </p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#EF4444', marginBottom: '1rem' }}>
              ❌ Using Season-Long PDO in January
            </h3>
            <p style={{ fontSize: '0.938rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
              A team's PDO in October doesn't matter in January. Use rolling 10-game or 15-game PDO to capture current luck trends, not averages diluted by months-old data.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section>
          <div style={{
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
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
              Get PDO-Adjusted Picks Daily
            </h2>
            <p style={{
              fontSize: '1.125rem',
              color: 'var(--color-text-secondary)',
              marginBottom: '2rem',
              lineHeight: 1.6
            }}>
              NHL Savant calculates rolling PDO, applies regression weights, and combines with xGF analysis to find +EV picks every day. No manual calculations required.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                to="/pricing"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem 2rem',
                  background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)',
                  color: '#0A0E27',
                  borderRadius: '12px',
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  textDecoration: 'none',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.3)';
                }}
              >
                Start Free Trial
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/"
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
                  e.currentTarget.style.borderColor = '#D4AF37';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                }}
              >
                See Today's Picks
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
            to="/methodology"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#D4AF37',
              textDecoration: 'none',
              fontSize: '0.938rem',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#FFD700';
              e.currentTarget.style.gap = '0.75rem';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#D4AF37';
              e.currentTarget.style.gap = '0.5rem';
            }}
          >
            Full NHL Savant Methodology →
          </Link>
          <Link
            to="/faq"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#D4AF37',
              textDecoration: 'none',
              fontSize: '0.938rem',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#FFD700';
              e.currentTarget.style.gap = '0.75rem';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#D4AF37';
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

export default PDORegressionGuide;

