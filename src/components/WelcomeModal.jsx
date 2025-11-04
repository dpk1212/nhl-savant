import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Target, BarChart3, CheckCircle } from 'lucide-react';

/**
 * Premium Welcome Modal for New Users
 * Full-screen, first-class introduction to NHL Savant
 */
const WelcomeModal = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has seen the welcome modal
    const hasSeenWelcome = localStorage.getItem('nhl-savant-welcome');
    
    if (!hasSeenWelcome) {
      // Show modal after a brief delay for page load
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('nhl-savant-welcome', 'true');
  };

  const handleViewPicks = () => {
    handleClose();
    // Scroll to picks section
    const picksSection = document.querySelector('[class*="elevated-card"]');
    if (picksSection) {
      picksSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(0, 0, 0, 0.85)'
        }}
        onClick={handleClose}
      >
        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ 
            type: 'spring',
            stiffness: 300,
            damping: 30
          }}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'relative',
            maxWidth: '900px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: 'linear-gradient(135deg, rgba(21, 25, 35, 0.98) 0%, rgba(15, 20, 30, 0.98) 100%)',
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '24px',
            boxShadow: `
              0 0 80px rgba(212, 175, 55, 0.3),
              0 40px 80px rgba(0, 0, 0, 0.8),
              inset 0 0 0 1px rgba(255, 255, 255, 0.05)
            `,
            overflow: 'hidden'
          }}
        >
          {/* Animated background elements */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
            animation: 'pulse 8s ease-in-out infinite'
          }} />

          {/* Close button */}
          <button
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(148, 163, 184, 0.1)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '12px',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              zIndex: 10
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
              e.currentTarget.style.color = 'var(--color-danger)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(148, 163, 184, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.2)';
              e.currentTarget.style.color = 'var(--color-text-secondary)';
            }}
            aria-label="Close"
          >
            <X size={20} strokeWidth={2.5} />
          </button>

          {/* Content */}
          <div style={{ padding: '3rem 2.5rem' }}>
            {/* Logo/Brand Mark */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                background: 'linear-gradient(135deg, var(--color-accent) 0%, #C4A02C 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(212, 175, 55, 0.4)',
                fontSize: '2rem'
              }}>
                🏒
              </div>
              <div>
                <h1 style={{
                  fontSize: '1.75rem',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, var(--color-accent) 0%, #E5C158 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  margin: 0,
                  lineHeight: 1
                }}>
                  NHL Savant
                </h1>
                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-text-muted)',
                  margin: '0.25rem 0 0 0',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Institutional-Grade Analytics
                </p>
              </div>
            </div>

            {/* Headline */}
            <h2 style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: '800',
              color: 'var(--color-text-primary)',
              lineHeight: 1.2,
              marginBottom: '1rem',
              letterSpacing: '-0.02em'
            }}>
              Find Tonight's NHL Edges.<br />
              Beat the Market.
            </h2>

            {/* Subheadline */}
            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.125rem)',
              lineHeight: 1.7,
              color: 'var(--color-text-secondary)',
              marginBottom: '2.5rem',
              maxWidth: '680px'
            }}>
              Our algorithm scans <strong style={{ color: 'var(--color-accent)' }}>10,000+ data points</strong> per game to find moneyline inefficiencies the market misses. Every pick rated. Every edge quantified. Every game analyzed.
              <br /><br />
              <strong style={{ color: 'var(--color-text-primary)' }}>No parlays. No prayers. Just math.</strong>
            </p>

            {/* Value Props - 3 Columns */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2.5rem'
            }}>
              {/* Transparency */}
              <div style={{
                padding: '1.5rem',
                background: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '16px',
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  background: 'rgba(59, 130, 246, 0.15)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  <BarChart3 size={24} color="#60A5FA" strokeWidth={2.5} />
                </div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  color: 'var(--color-text-primary)',
                  marginBottom: '0.5rem'
                }}>
                  Every Edge, Explained
                </h3>
                <p style={{
                  fontSize: '0.938rem',
                  lineHeight: 1.6,
                  color: 'var(--color-text-secondary)',
                  margin: 0
                }}>
                  See the exact Expected Value (EV%), win probability, and model rating. No hiding behind vague scores.
                </p>
              </div>

              {/* Selectivity */}
              <div style={{
                padding: '1.5rem',
                background: 'rgba(212, 175, 55, 0.08)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                borderRadius: '16px',
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  background: 'rgba(212, 175, 55, 0.15)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  <Target size={24} color="#D4AF37" strokeWidth={2.5} />
                </div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  color: 'var(--color-text-primary)',
                  marginBottom: '0.5rem'
                }}>
                  Quality Over Volume
                </h3>
                <p style={{
                  fontSize: '0.938rem',
                  lineHeight: 1.6,
                  color: 'var(--color-text-secondary)',
                  margin: 0
                }}>
                  We don't post every game. We post games with +EV edges. If the market is efficient, we pass.
                </p>
              </div>

              {/* Accountability */}
              <div style={{
                padding: '1.5rem',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '16px',
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  <TrendingUp size={24} color="#10B981" strokeWidth={2.5} />
                </div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  color: 'var(--color-text-primary)',
                  marginBottom: '0.5rem'
                }}>
                  Track Record, Verified
                </h3>
                <p style={{
                  fontSize: '0.938rem',
                  lineHeight: 1.6,
                  color: 'var(--color-text-secondary)',
                  margin: 0
                }}>
                  Every pick tracked. Every result posted. Full transparency on performance.
                </p>
              </div>
            </div>

            {/* USP Callout */}
            <div style={{
              padding: '1.5rem',
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(212, 175, 55, 0.06) 100%)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '16px',
              marginBottom: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <CheckCircle size={32} color="#D4AF37" strokeWidth={2.5} style={{ flexShrink: 0 }} />
              <div>
                <p style={{
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  color: 'var(--color-accent)',
                  margin: '0 0 0.25rem 0'
                }}>
                  The only NHL model that shows you the edge BEFORE you bet.
                </p>
                <p style={{
                  fontSize: '0.938rem',
                  color: 'var(--color-text-secondary)',
                  margin: 0
                }}>
                  NHL betting, powered by data. Not hope.
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={handleViewPicks}
                style={{
                  flex: '1 1 auto',
                  minWidth: '200px',
                  padding: '1rem 2rem',
                  background: 'linear-gradient(135deg, var(--color-accent) 0%, #C4A02C 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'var(--color-background)',
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 24px rgba(212, 175, 55, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(212, 175, 55, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(212, 175, 55, 0.4)';
                }}
              >
                See Tonight's Picks
                <TrendingUp size={20} strokeWidth={2.5} />
              </button>

              <button
                onClick={handleClose}
                style={{
                  flex: '0 0 auto',
                  padding: '1rem 2rem',
                  background: 'transparent',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  borderRadius: '12px',
                  color: 'var(--color-text-secondary)',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.5)';
                  e.currentTarget.style.color = 'var(--color-accent)';
                  e.currentTarget.style.background = 'rgba(212, 175, 55, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.3)';
                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                Explore Later
              </button>
            </div>

            {/* Footer note */}
            <p style={{
              fontSize: '0.813rem',
              color: 'var(--color-text-muted)',
              textAlign: 'center',
              marginTop: '2rem',
              marginBottom: 0
            }}>
              Free access. No sign-up required. No BS.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WelcomeModal;

