import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Target, BarChart3, CheckCircle } from 'lucide-react';

/**
 * Premium Welcome Modal for New Users
 * Full-screen, first-class introduction to NHL Savant
 * MOBILE OPTIMIZED
 */
const WelcomeModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
          alignItems: isMobile ? 'stretch' : 'center',
          justifyContent: 'center',
          padding: isMobile ? '0' : '1rem',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          overflow: 'hidden'
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
            maxWidth: isMobile ? '100%' : '900px',
            width: '100%',
            maxHeight: isMobile ? '100vh' : '90vh',
            height: isMobile ? '100vh' : 'auto',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(135deg, rgba(21, 25, 35, 0.98) 0%, rgba(15, 20, 30, 0.98) 100%)',
            backdropFilter: isMobile ? 'blur(20px) saturate(180%)' : 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: isMobile ? 'blur(20px) saturate(180%)' : 'blur(40px) saturate(180%)',
            border: isMobile ? 'none' : '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: isMobile ? '0' : '24px',
            boxShadow: isMobile ? 'none' : `
              0 0 80px rgba(212, 175, 55, 0.3),
              0 40px 80px rgba(0, 0, 0, 0.8),
              inset 0 0 0 1px rgba(255, 255, 255, 0.05)
            `,
            overflow: 'hidden'
          }}
        >
          {/* Premium animated background orbs */}
          <div style={{
            position: 'absolute',
            top: '-30%',
            right: '-15%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.05) 40%, transparent 70%)',
            pointerEvents: 'none',
            animation: 'pulse 8s ease-in-out infinite',
            filter: 'blur(60px)'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-40%',
            left: '-10%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.03) 40%, transparent 70%)',
            pointerEvents: 'none',
            animation: 'pulse 10s ease-in-out infinite',
            filter: 'blur(60px)'
          }} />

          {/* Close button */}
          <button
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: isMobile ? '1rem' : '1.5rem',
              right: isMobile ? '1rem' : '1.5rem',
              width: isMobile ? '44px' : '40px',
              height: isMobile ? '44px' : '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(148, 163, 184, 0.1)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '12px',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              zIndex: 10,
              touchAction: 'manipulation'
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

          {/* Scrollable Content Wrapper */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(212, 175, 55, 0.3) transparent'
          }}>
            {/* Content */}
            <div style={{ padding: isMobile ? '1.5rem 1.25rem' : '3rem 2.5rem' }}>
            {/* Logo/Brand Mark */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? '0.625rem' : '0.75rem',
              marginBottom: isMobile ? '1.5rem' : '2.5rem'
            }}>
              <div style={{
                width: isMobile ? '52px' : '64px',
                height: isMobile ? '52px' : '64px',
                background: 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 50%, #C4A02C 100%)',
                borderRadius: isMobile ? '16px' : '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `
                  0 12px 32px rgba(212, 175, 55, 0.5),
                  0 4px 12px rgba(212, 175, 55, 0.3),
                  inset 0 2px 4px rgba(255, 255, 255, 0.3),
                  inset 0 -2px 4px rgba(0, 0, 0, 0.2)
                `,
                fontSize: isMobile ? '1.875rem' : '2.25rem',
                flexShrink: 0,
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                  animation: 'shimmer 3s infinite'
                }} />
                🏒
              </div>
              <div>
                <h1 style={{
                  fontSize: isMobile ? '1.625rem' : '2rem',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #F4D03F 0%, #D4AF37 50%, #C4A02C 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  margin: 0,
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                  textShadow: '0 2px 8px rgba(212, 175, 55, 0.3)'
                }}>
                  NHL Savant
                </h1>
                <p style={{
                  fontSize: isMobile ? '0.688rem' : '0.75rem',
                  color: 'rgba(212, 175, 55, 0.8)',
                  margin: '0.375rem 0 0 0',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}>
                  Institutional-Grade Analytics
                </p>
              </div>
            </div>

            {/* Headline */}
            <h2 style={{
              fontSize: isMobile ? '1.75rem' : 'clamp(2rem, 4.5vw, 2.75rem)',
              fontWeight: '800',
              color: 'var(--color-text-primary)',
              lineHeight: 1.15,
              marginBottom: isMobile ? '1rem' : '1.25rem',
              letterSpacing: '-0.03em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
              textShadow: '0 2px 12px rgba(0, 0, 0, 0.3)'
            }}>
              Find Tonight's NHL Edges.<br />
              <span style={{
                background: 'linear-gradient(135deg, #F4D03F 0%, #D4AF37 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Beat the Market.</span>
            </h2>

            {/* Subheadline */}
            <p style={{
              fontSize: isMobile ? '1rem' : 'clamp(1.0625rem, 2vw, 1.1875rem)',
              lineHeight: 1.75,
              color: 'rgba(248, 250, 252, 0.85)',
              marginBottom: isMobile ? '2rem' : '2.75rem',
              maxWidth: '680px',
              fontWeight: '400',
              letterSpacing: '-0.01em'
            }}>
              Our algorithm scans <strong style={{ 
                color: 'var(--color-accent)',
                fontWeight: '700',
                textShadow: '0 0 20px rgba(212, 175, 55, 0.3)'
              }}>10,000+ data points</strong> per game to find moneyline inefficiencies the market misses. Every pick rated. Every edge quantified. Every game analyzed.
              <br /><br />
              <strong style={{ 
                color: 'var(--color-text-primary)',
                fontWeight: '700',
                fontSize: '1.0625rem',
                letterSpacing: '0.01em'
              }}>No parlays. No prayers. Just math.</strong>
            </p>

            {/* Value Props - 3 Columns */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: isMobile ? '1rem' : '1.5rem',
              marginBottom: isMobile ? '1.5rem' : '2.5rem'
            }}>
              {/* Transparency */}
              <div style={{
                padding: isMobile ? '1.5rem' : '1.75rem',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.06) 100%)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                borderRadius: isMobile ? '14px' : '18px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 16px rgba(59, 130, 246, 0.08)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: isMobile ? '44px' : '52px',
                  height: isMobile ? '44px' : '52px',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(59, 130, 246, 0.15) 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: isMobile ? '1rem' : '1.25rem',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)'
                }}>
                  <BarChart3 size={isMobile ? 22 : 26} color="#60A5FA" strokeWidth={2.5} />
                </div>
                <h3 style={{
                  fontSize: isMobile ? '1.0625rem' : '1.1875rem',
                  fontWeight: '700',
                  color: 'var(--color-text-primary)',
                  marginBottom: '0.625rem',
                  letterSpacing: '-0.01em'
                }}>
                  Every Edge, Explained
                </h3>
                <p style={{
                  fontSize: isMobile ? '0.9375rem' : '1rem',
                  lineHeight: 1.65,
                  color: 'rgba(248, 250, 252, 0.75)',
                  margin: 0,
                  letterSpacing: '-0.005em'
                }}>
                  See the exact Expected Value (EV%), win probability, and model rating. No hiding behind vague scores.
                </p>
              </div>

              {/* Selectivity */}
              <div style={{
                padding: isMobile ? '1.5rem' : '1.75rem',
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(212, 175, 55, 0.06) 100%)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: isMobile ? '14px' : '18px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 16px rgba(212, 175, 55, 0.12)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: isMobile ? '44px' : '52px',
                  height: isMobile ? '44px' : '52px',
                  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.3) 0%, rgba(212, 175, 55, 0.2) 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: isMobile ? '1rem' : '1.25rem',
                  boxShadow: '0 4px 12px rgba(212, 175, 55, 0.25)'
                }}>
                  <Target size={isMobile ? 22 : 26} color="#D4AF37" strokeWidth={2.5} />
                </div>
                <h3 style={{
                  fontSize: isMobile ? '1.0625rem' : '1.1875rem',
                  fontWeight: '700',
                  color: 'var(--color-text-primary)',
                  marginBottom: '0.625rem',
                  letterSpacing: '-0.01em'
                }}>
                  Quality Over Volume
                </h3>
                <p style={{
                  fontSize: isMobile ? '0.9375rem' : '1rem',
                  lineHeight: 1.65,
                  color: 'rgba(248, 250, 252, 0.75)',
                  margin: 0,
                  letterSpacing: '-0.005em'
                }}>
                  We don't post every game. We post games with +EV edges. If the market is efficient, we pass.
                </p>
              </div>

              {/* Accountability */}
              <div style={{
                padding: isMobile ? '1.5rem' : '1.75rem',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.06) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: isMobile ? '14px' : '18px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.08)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: isMobile ? '44px' : '52px',
                  height: isMobile ? '44px' : '52px',
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(16, 185, 129, 0.15) 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: isMobile ? '1rem' : '1.25rem',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                }}>
                  <TrendingUp size={isMobile ? 22 : 26} color="#10B981" strokeWidth={2.5} />
                </div>
                <h3 style={{
                  fontSize: isMobile ? '1.0625rem' : '1.1875rem',
                  fontWeight: '700',
                  color: 'var(--color-text-primary)',
                  marginBottom: '0.625rem',
                  letterSpacing: '-0.01em'
                }}>
                  Track Record, Verified
                </h3>
                <p style={{
                  fontSize: isMobile ? '0.9375rem' : '1rem',
                  lineHeight: 1.65,
                  color: 'rgba(248, 250, 252, 0.75)',
                  margin: 0,
                  letterSpacing: '-0.005em'
                }}>
                  Every pick tracked. Every result posted. Full transparency on performance.
                </p>
              </div>
            </div>

            {/* USP Callout */}
            <div style={{
              padding: isMobile ? '1.5rem' : '2rem',
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.08) 100%)',
              border: '1.5px solid rgba(212, 175, 55, 0.4)',
              borderRadius: isMobile ? '14px' : '20px',
              marginBottom: isMobile ? '2rem' : '3rem',
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? '1rem' : '1.25rem',
              boxShadow: `
                0 8px 24px rgba(212, 175, 55, 0.2),
                inset 0 1px 2px rgba(255, 255, 255, 0.1)
              `,
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.5), transparent)'
              }} />
              <div style={{
                width: isMobile ? '48px' : '56px',
                height: isMobile ? '48px' : '56px',
                background: 'linear-gradient(135deg, #D4AF37 0%, #C4A02C 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 16px rgba(212, 175, 55, 0.4)'
              }}>
                <CheckCircle size={isMobile ? 26 : 32} color="#0B0F1F" strokeWidth={2.5} />
              </div>
              <div>
                <p style={{
                  fontSize: isMobile ? '1.0625rem' : '1.1875rem',
                  fontWeight: '700',
                  color: '#F4D03F',
                  margin: '0 0 0.375rem 0',
                  lineHeight: 1.35,
                  letterSpacing: '-0.01em',
                  textShadow: '0 2px 8px rgba(212, 175, 55, 0.3)'
                }}>
                  The only NHL model that shows you the edge BEFORE you bet.
                </p>
                <p style={{
                  fontSize: isMobile ? '0.9375rem' : '1rem',
                  color: 'rgba(248, 250, 252, 0.85)',
                  margin: 0,
                  fontWeight: '500',
                  letterSpacing: '-0.005em'
                }}>
                  NHL betting, powered by data. Not hope.
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? '0.75rem' : '1rem',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={handleViewPicks}
                style={{
                  flex: '1 1 auto',
                  minWidth: isMobile ? '100%' : '200px',
                  padding: isMobile ? '1.25rem 2rem' : '1.125rem 2.5rem',
                  background: 'linear-gradient(135deg, #F4D03F 0%, #D4AF37 50%, #C4A02C 100%)',
                  border: 'none',
                  borderRadius: '14px',
                  color: '#0B0F1F',
                  fontSize: isMobile ? '1.0625rem' : '1.1875rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: `
                    0 12px 32px rgba(212, 175, 55, 0.5),
                    0 4px 12px rgba(212, 175, 55, 0.3),
                    inset 0 2px 4px rgba(255, 255, 255, 0.3)
                  `,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.625rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  touchAction: 'manipulation',
                  minHeight: '56px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(212, 175, 55, 0.6), 0 8px 16px rgba(212, 175, 55, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(212, 175, 55, 0.5), 0 4px 12px rgba(212, 175, 55, 0.3)';
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                  animation: 'shimmer 3s infinite'
                }} />
                See Tonight's Picks
                <TrendingUp size={isMobile ? 20 : 22} strokeWidth={3} />
              </button>

              <button
                onClick={handleClose}
                style={{
                  flex: isMobile ? '1 1 auto' : '0 0 auto',
                  minWidth: isMobile ? '100%' : 'auto',
                  padding: isMobile ? '1.25rem 2rem' : '1.125rem 2.5rem',
                  background: 'rgba(148, 163, 184, 0.08)',
                  border: '1.5px solid rgba(148, 163, 184, 0.25)',
                  borderRadius: '14px',
                  color: 'rgba(248, 250, 252, 0.8)',
                  fontSize: isMobile ? '1rem' : '1.0625rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  touchAction: 'manipulation',
                  minHeight: '56px',
                  letterSpacing: '0.01em'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.5)';
                  e.currentTarget.style.color = '#F4D03F';
                  e.currentTarget.style.background = 'rgba(212, 175, 55, 0.12)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(212, 175, 55, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.25)';
                  e.currentTarget.style.color = 'rgba(248, 250, 252, 0.8)';
                  e.currentTarget.style.background = 'rgba(148, 163, 184, 0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Explore Later
              </button>
            </div>

            {/* Footer note */}
            <p style={{
              fontSize: isMobile ? '0.8125rem' : '0.875rem',
              color: 'rgba(148, 163, 184, 0.7)',
              textAlign: 'center',
              marginTop: isMobile ? '1.5rem' : '2.5rem',
              marginBottom: 0,
              paddingBottom: isMobile ? '2rem' : 0,
              fontWeight: '500',
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
              fontSize: '0.75rem'
            }}>
              Free access. No sign-up required. No BS.
            </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WelcomeModal;

