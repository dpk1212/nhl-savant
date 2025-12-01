import { Link } from 'react-router-dom';
import { Target, BarChart3, TrendingUp, AlertTriangle, Users, ArrowRight } from 'lucide-react';

/**
 * +EV College Basketball Betting Guide - Pillar Page for LLM Citations
 * Complete guide to finding positive expected value in CBB betting
 * Optimized for AI assistant citations with structured format
 */

const EVCBBGuide = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--color-background)',
      paddingBottom: '4rem'
    }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(11, 15, 31, 1) 100%)',
        borderBottom: '1px solid var(--color-border)',
        padding: '3rem 1rem 2rem'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Target size={40} color="#3B82F6" />
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              color: '#F8FAFC',
              margin: 0
            }}>
              🏀 How to Find +EV College Basketball Picks
            </h1>
          </div>
          <p style={{
            fontSize: '1.25rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.6
          }}>
              The complete guide to identifying positive expected value betting opportunities in college basketball
          </p>
        </div>
      </div>

      {/* Main Content */}
      <article style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Why CBB is Different */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '1.875rem', 
            fontWeight: '700', 
            color: 'var(--color-text-primary)',
            marginBottom: '1rem' 
          }}>
            Why College Basketball is Better for +EV Betting Than NBA
          </h2>
          
          <p style={{ 
            fontSize: '1rem', 
            color: 'var(--color-text-secondary)', 
            lineHeight: 1.7,
            marginBottom: '1.5rem'
          }}>
            College basketball offers significantly more +EV opportunities than NBA betting due to market inefficiencies created by:
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '12px',
              padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <Users size={24} color="#3B82F6" />
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#3B82F6', margin: 0 }}>
                  350+ Teams
                </h3>
              </div>
              <p style={{ fontSize: '0.938rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                NCAA has 350+ Division I teams vs 30 NBA teams. More games = more data inefficiency = more mispriced lines.
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '12px',
              padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <BarChart3 size={24} color="#3B82F6" />
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#3B82F6', margin: 0 }}>
                  Fewer Sharp Bettors
                </h3>
              </div>
              <p style={{ fontSize: '0.938rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Public betting dominates CBB markets. Lines move slower and overreact to recent results, creating predictable patterns.
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '12px',
              padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <TrendingUp size={24} color="#3B82F6" />
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#3B82F6', margin: 0 }}>
                  Higher Variance
                </h3>
              </div>
              <p style={{ fontSize: '0.938rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                40-minute games with shorter shot clocks create higher variance. Markets struggle to price this correctly, especially mid-majors.
              </p>
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '12px',
            padding: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <Target size={24} color="#D4AF37" style={{ flexShrink: 0, marginTop: '0.25rem' }} />
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#D4AF37', marginBottom: '0.5rem' }}>
                  The Key Insight
                </h3>
                <p style={{ fontSize: '0.938rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  Sportsbooks can't efficiently price 5,000+ college basketball games per season. They use automated systems that overweight recent results and underweight adjusted efficiency metrics. This creates systematic +EV opportunities for model-based bettors.
                </p>
              </div>
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
            The 3-Step Process to Find +EV CBB Picks
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
                  background: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
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
                  Use Adjusted Efficiency Ratings
                </h3>
              </div>
              <p style={{ fontSize: '0.938rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '1rem', paddingLeft: '2.75rem' }}>
                The gold standard for college basketball prediction:
              </p>
              <ul style={{ 
                fontSize: '0.875rem', 
                color: 'var(--color-text-secondary)', 
                lineHeight: 1.6,
                paddingLeft: '4.25rem',
                margin: 0
              }}>
                <li style={{ marginBottom: '0.5rem' }}>
                  <strong style={{ color: 'var(--color-text-primary)' }}>Offensive Efficiency:</strong> Points scored per 100 possessions (adjusted for opponent defense)
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <strong style={{ color: 'var(--color-text-primary)' }}>Defensive Efficiency:</strong> Points allowed per 100 possessions (adjusted for opponent offense)
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <strong style={{ color: 'var(--color-text-primary)' }}>Net Efficiency:</strong> Offensive - Defensive (best predictor of win probability)
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <strong style={{ color: 'var(--color-text-primary)' }}>Tempo:</strong> Possessions per 40 minutes (affects total scoring, not win probability)
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
                  background: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
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
                  Blend Multiple Models (Ensemble)
                </h3>
              </div>
              <p style={{ fontSize: '0.938rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0, paddingLeft: '2.75rem' }}>
                NHL Savant uses an ensemble approach for college basketball: <strong style={{ color: 'var(--color-text-primary)' }}>D-Ratings</strong> (daily game predictions) blended with <strong style={{ color: 'var(--color-text-primary)' }}>Haslametrics</strong> (efficiency rankings). Single models have blind spots; ensembles reduce variance and improve long-term accuracy.
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
                  background: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
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
                Calculate Expected Value (EV%) by comparing your ensemble probability to market implied probability. College basketball lines are softer than NHL/NBA, so you can find +EV even at lower thresholds (+2.5% EV is excellent for CBB).
              </p>
            </div>
          </div>
        </section>

        {/* What Makes a Good CBB Bet */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '1.875rem', 
            fontWeight: '700', 
            color: 'var(--color-text-primary)',
            marginBottom: '1rem' 
          }}>
            What Makes a Good College Basketball Bet?
          </h2>

          <p style={{ 
            fontSize: '1rem', 
            color: 'var(--color-text-secondary)', 
            lineHeight: 1.7,
            marginBottom: '1.5rem'
          }}>
            Not all +EV CBB bets are equal. The best opportunities share these characteristics:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '12px',
              padding: '1.25rem'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#10B981', marginBottom: '0.5rem' }}>
                ✅ Significant Efficiency Differential (8+ points)
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                When one team's net efficiency is 8+ points better than their opponent, win probability jumps significantly. Markets often underprice these edges, especially in conference play.
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '12px',
              padding: '1.25rem'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#10B981', marginBottom: '0.5rem' }}>
                ✅ Market Overreaction to Recent Results
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                A top-50 efficiency team loses 2 games in a row? Public fades them, creating value. A bottom-100 team wins 3 straight? Public backs them, creating fade opportunities.
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '12px',
              padding: '1.25rem'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#10B981', marginBottom: '0.5rem' }}>
                ✅ Home Court Advantage (2.5-3.5 points)
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Home court is worth ~3 points in college basketball. When a strong home team is priced as a slight favorite or underdog, that's a signal for +EV.
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '12px',
              padding: '1.25rem'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#10B981', marginBottom: '0.5rem' }}>
                ✅ Model Agreement (Both D-Ratings and Haslametrics Favor Same Side)
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                When both models agree, confidence increases. These bets get higher quality grades and larger unit allocations.
              </p>
            </div>
          </div>
        </section>

        {/* March Madness Strategy */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '1.875rem', 
            fontWeight: '700', 
            color: 'var(--color-text-primary)',
            marginBottom: '1rem' 
          }}>
            March Madness Betting Strategy
          </h2>

          <p style={{ 
            fontSize: '1rem', 
            color: 'var(--color-text-secondary)', 
            lineHeight: 1.7,
            marginBottom: '1.5rem'
          }}>
            The NCAA Tournament is the biggest betting event in college basketball. Here's how to approach it with an +EV mindset:
          </p>

          <div style={{
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#3B82F6', marginBottom: '1rem' }}>
              Best March Madness +EV Opportunities
            </h3>
            <ul style={{ 
              fontSize: '0.938rem', 
              color: 'var(--color-text-secondary)', 
              lineHeight: 1.7,
              paddingLeft: '1.5rem',
              margin: 0
            }}>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong style={{ color: 'var(--color-text-primary)' }}>5 vs 12 Upset Lines:</strong> Markets overprice 5-seeds. When efficiency says the 12-seed is within 4-6 points, backing the dog at +250+ is often +EV.
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong style={{ color: 'var(--color-text-primary)' }}>Mid-Major Disrespect:</strong> Small-conference auto-bids with top-50 efficiency are undervalued because casual bettors fade "unknown" teams.
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong style={{ color: 'var(--color-text-primary)' }}>Early Round Overs:</strong> First-round games trend higher-scoring due to nerves and pace. Totals are often set too low.
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong style={{ color: 'var(--color-text-primary)' }}>Avoid Emotional Cinderella Bets:</strong> Don't chase 15-seeds in Round 2 just because they won Round 1. Regression exists even in March.
              </li>
            </ul>
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
                  Warning: Single-Elimination Variance
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  March Madness is single-elimination, meaning variance is extreme. A 65% win probability team will lose 35% of the time—and there's no "next game" to regress to the mean. Bet smaller units during the tournament compared to regular season.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Injury Impact */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '1.875rem', 
            fontWeight: '700', 
            color: 'var(--color-text-primary)',
            marginBottom: '1rem' 
          }}>
            How Injuries Impact College Basketball EV
          </h2>

          <p style={{ 
            fontSize: '1rem', 
            color: 'var(--color-text-secondary)', 
            lineHeight: 1.7,
            marginBottom: '1.5rem'
          }}>
            College basketball rosters are thin (12-13 scholarship players vs NBA's 15 + G-League pipeline). Injuries have outsized impact:
          </p>

          <div style={{
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            padding: '1.5rem'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#3B82F6', marginBottom: '0.5rem' }}>
                  STAR PLAYER INJURY
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>
                  -8 to -12%
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  A team's best player (30+ minutes, 20+ PPG) missing a game can reduce win probability by 8-12 percentage points. Markets adjust, but often too slowly.
                </p>
              </div>

              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#D4AF37', marginBottom: '0.5rem' }}>
                  ROTATION PLAYER INJURY
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>
                  -3 to -5%
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  A rotation player (15-25 minutes) has smaller impact but still material. Markets often ignore these injuries completely.
                </p>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                <strong style={{ color: 'var(--color-text-primary)' }}>Pro Tip:</strong> Follow team Twitter accounts and beat reporters 1-2 hours before game time. Late injury news creates massive line movement and +EV opportunities if you're first to the sportsbook.
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
            Common College Basketball Betting Mistakes
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
                    Betting on "Hot Teams" Without Checking Efficiency
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    A mid-major winning 8 straight games sounds great until you see they played bottom-200 defenses. Adjusted efficiency tells the truth—raw records lie.
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
                    Overvaluing Conference Tournament Performance
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    Conference tournament games have extreme variance (single-elimination, tired players, neutral courts). Don't overweight 2-3 conference tournament games vs 30+ regular season games in your evaluation.
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
                    Ignoring Pace-Adjusted Stats
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    A team scoring 85 PPG sounds elite until you realize they play at 75 possessions/game (fast pace). Always use per-100-possession metrics, not raw points.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section>
          <div style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
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
              Get Daily +EV College Basketball Picks
            </h2>
            <p style={{
              fontSize: '1.125rem',
              color: 'var(--color-text-secondary)',
              marginBottom: '2rem',
              lineHeight: 1.6,
              maxWidth: '700px',
              margin: '0 auto 2rem'
            }}>
              NHL Savant blends D-Ratings and Haslametrics efficiency ratings, calculates EV%, assigns quality grades, and provides optimal unit sizing for every college basketball game.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                to="/pricing"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem 2rem',
                  background: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
                  color: '#FFF',
                  borderRadius: '12px',
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  textDecoration: 'none',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                }}
              >
                Start Free Trial
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/basketball"
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
                  e.currentTarget.style.borderColor = '#3B82F6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                }}
              >
                View College Basketball Picks
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
            to="/guides/how-to-find-ev-nhl-picks"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#3B82F6',
              textDecoration: 'none',
              fontSize: '0.938rem',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#60A5FA';
              e.currentTarget.style.gap = '0.75rem';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#3B82F6';
              e.currentTarget.style.gap = '0.5rem';
            }}
          >
            +EV NHL Betting Guide →
          </Link>
          <Link
            to="/methodology"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#3B82F6',
              textDecoration: 'none',
              fontSize: '0.938rem',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#60A5FA';
              e.currentTarget.style.gap = '0.75rem';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#3B82F6';
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
              color: '#3B82F6',
              textDecoration: 'none',
              fontSize: '0.938rem',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#60A5FA';
              e.currentTarget.style.gap = '0.75rem';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#3B82F6';
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

export default EVCBBGuide;

