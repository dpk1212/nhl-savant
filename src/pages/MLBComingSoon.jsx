import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ELEVATION, TYPOGRAPHY, MOBILE_SPACING } from '../utils/designSystem';
import { BarChart3, Target, TrendingUp } from 'lucide-react';

const MLB_GREEN = '#22C55E';
const MLB_GREEN_HOVER = '#16A34A';

const features = [
  {
    icon: Target,
    title: 'Game Predictions',
    description: 'Model-backed moneyline, run line, and total picks for every MLB game.'
  },
  {
    icon: BarChart3,
    title: 'Pitcher Matchup Analysis',
    description: 'Deep pitcher vs. lineup analysis with historical edge data.'
  },
  {
    icon: TrendingUp,
    title: 'Live Odds Integration',
    description: 'Real-time odds comparison to find the best value across sportsbooks.'
  }
];

const MLBComingSoon = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-background)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Ambient green glow */}
      <div style={{
        position: 'absolute',
        top: isMobile ? '-80px' : '-120px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: isMobile ? '500px' : '800px',
        height: isMobile ? '500px' : '800px',
        background: 'radial-gradient(ellipse at center, rgba(34, 197, 94, 0.07) 0%, rgba(34, 197, 94, 0.02) 40%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{ padding: isMobile ? '1rem' : '20px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '0' : '0' }}>

          {/* Back to NHL */}
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.625rem 1rem',
              marginBottom: '2rem',
              borderRadius: '10px',
              fontSize: '0.875rem',
              fontWeight: '600',
              textDecoration: 'none',
              color: 'rgba(212, 175, 55, 0.9)',
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateX(-4px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span style={{ fontSize: '1.125rem' }}>←</span>
            <span>🏒 NHL Today's Games</span>
          </Link>

          {/* Hero Section */}
          <div style={{
            textAlign: 'center',
            marginBottom: isMobile ? '2rem' : '3rem',
            paddingTop: isMobile ? '1rem' : '2rem'
          }}>
            <div style={{
              fontSize: isMobile ? '4rem' : '5.5rem',
              lineHeight: 1,
              marginBottom: '1.25rem',
              filter: 'drop-shadow(0 0 30px rgba(34, 197, 94, 0.3))'
            }}>
              ⚾
            </div>

            <h1 style={{
              fontSize: isMobile ? '2rem' : '3rem',
              fontWeight: '900',
              color: MLB_GREEN,
              margin: '0 0 0.75rem 0',
              letterSpacing: '-0.03em',
              lineHeight: 1.1
            }}>
              MLB Savant
            </h1>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1.25rem',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.05) 100%)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: MLB_GREEN,
                boxShadow: `0 0 8px ${MLB_GREEN}`,
                animation: 'pulse 2s ease-in-out infinite'
              }} />
              <span style={{
                fontSize: TYPOGRAPHY.label.size,
                fontWeight: TYPOGRAPHY.label.weight,
                letterSpacing: TYPOGRAPHY.label.letterSpacing,
                textTransform: 'uppercase',
                color: MLB_GREEN
              }}>
                Coming Soon
              </span>
            </div>

            <p style={{
              fontSize: isMobile ? '1rem' : '1.125rem',
              fontWeight: '500',
              color: 'var(--color-text-secondary)',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.6
            }}>
              Data-driven MLB picks powered by the same edge models you trust for NHL.
            </p>
          </div>

          {/* Feature Preview Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: isMobile ? '1rem' : '1.5rem',
            marginBottom: isMobile ? '2rem' : '3rem'
          }}>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isHovered = hoveredCard === index;
              return (
                <div
                  key={index}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    background: isHovered
                      ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, var(--color-card) 100%)'
                      : 'var(--color-card)',
                    border: isHovered
                      ? '1px solid rgba(34, 197, 94, 0.35)'
                      : '1px solid var(--color-border)',
                    borderRadius: MOBILE_SPACING.borderRadius,
                    padding: isMobile ? MOBILE_SPACING.cardPadding : '2rem',
                    transition: 'all 0.3s ease',
                    transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                    boxShadow: isHovered
                      ? '0 8px 24px rgba(34, 197, 94, 0.12)'
                      : 'none'
                  }}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.05) 100%)',
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem'
                  }}>
                    <Icon size={22} color={MLB_GREEN} strokeWidth={2.5} />
                  </div>
                  <h3 style={{
                    fontSize: TYPOGRAPHY.subheading.size,
                    fontWeight: TYPOGRAPHY.subheading.weight,
                    color: 'var(--color-text-primary)',
                    margin: '0 0 0.625rem 0',
                    lineHeight: TYPOGRAPHY.subheading.lineHeight
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{
                    fontSize: TYPOGRAPHY.body.size,
                    fontWeight: '500',
                    color: 'var(--color-text-secondary)',
                    margin: 0,
                    lineHeight: '1.6'
                  }}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Status / Timeline */}
          <div style={{
            textAlign: 'center',
            padding: isMobile ? '2rem 1.5rem' : '2.5rem 3rem',
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.06) 0%, rgba(34, 197, 94, 0.02) 100%)',
            border: '1px solid rgba(34, 197, 94, 0.15)',
            borderRadius: MOBILE_SPACING.borderRadius,
            maxWidth: '640px',
            margin: '0 auto'
          }}>
            <p style={{
              fontSize: isMobile ? '1rem' : '1.125rem',
              fontWeight: '600',
              color: 'var(--color-text-primary)',
              margin: '0 0 0.5rem 0'
            }}>
              Launching for the 2026 MLB Season
            </p>
            <p style={{
              fontSize: TYPOGRAPHY.body.size,
              color: 'var(--color-text-muted)',
              margin: 0,
              lineHeight: '1.6'
            }}>
              We're building the same analytical edge that powers NHL Savant — tuned for baseball.
            </p>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
      `}</style>
    </div>
  );
};

export default MLBComingSoon;
