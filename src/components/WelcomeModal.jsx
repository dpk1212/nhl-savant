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
            <div style={{ padding: isMobile ? '1.25rem 1.25rem 1.5rem' : '2.5rem 2.5rem 3rem' }}>
            {/* Logo/Brand Mark */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? '0.625rem' : '0.875rem',
              marginBottom: isMobile ? '1.25rem' : '2rem'
            }}>
              <div style={{
                width: isMobile ? '48px' : '60px',
                height: isMobile ? '48px' : '60px',
                background: 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 50%, #C4A02C 100%)',
                borderRadius: isMobile ? '14px' : '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `
                  0 12px 32px rgba(212, 175, 55, 0.5),
                  0 4px 12px rgba(212, 175, 55, 0.3),
                  inset 0 2px 4px rgba(255, 255, 255, 0.3),
                  inset 0 -2px 4px rgba(0, 0, 0, 0.2)
                `,
                fontSize: isMobile ? '1.625rem' : '2.125rem',
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
                  fontSize: isMobile ? '1.375rem' : '1.875rem',
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
                  fontSize: isMobile ? '0.625rem' : '0.75rem',
                  color: 'rgba(212, 175, 55, 0.85)',
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
              fontSize: isMobile ? '1.5rem' : 'clamp(2rem, 4vw, 2.5rem)',
              fontWeight: '800',
              color: 'var(--color-text-primary)',
              lineHeight: 1.2,
              marginBottom: isMobile ? '0.75rem' : '1rem',
              letterSpacing: '-0.03em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
              textShadow: '0 2px 12px rgba(0, 0, 0, 0.3)'
            }}>
              <span style={{
                background: 'linear-gradient(135deg, #F4D03F 0%, #D4AF37 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>NHL Edges, Quantified.</span><br />
              No Prayers. Just Proven Edge.
            </h2>

            {/* Subheadline */}
            <p style={{
              fontSize: isMobile ? '0.9375rem' : 'clamp(1rem, 1.8vw, 1.125rem)',
              lineHeight: 1.55,
              color: 'rgba(248, 250, 252, 0.9)',
              marginBottom: isMobile ? '1rem' : '1.5rem',
              maxWidth: '720px',
              fontWeight: '400',
              letterSpacing: '-0.01em'
            }}>
              Our algorithm crunches <strong style={{ 
                color: 'var(--color-accent)',
                fontWeight: '700',
                textShadow: '0 0 20px rgba(212, 175, 55, 0.3)'
              }}>10,000+ data points</strong> per game to reveal betting market inefficiencies—before the market moves. Every rating, every percentage, every edge shown clearly with zero hype.
            </p>
            
            {/* Positioning Statement */}
            <p style={{
              fontSize: isMobile ? '0.9375rem' : '1.0625rem',
              fontWeight: '700',
              color: 'var(--color-text-primary)',
              marginBottom: isMobile ? '1.25rem' : '1.75rem',
              letterSpacing: '0.01em',
              textAlign: 'center',
              padding: isMobile ? '0.875rem 1.125rem' : '1.25rem 1.75rem',
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(212, 175, 55, 0.03) 100%)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              borderRadius: isMobile ? '10px' : '14px',
              boxShadow: '0 4px 16px rgba(212, 175, 55, 0.1)'
            }}>
              No parlays. No prayers. Just math.
            </p>

            {/* Value Props - 3 Columns */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: isMobile ? '0.875rem' : '1.25rem',
              marginBottom: isMobile ? '1.25rem' : '1.75rem'
            }}>
              {/* Transparency */}
              <div style={{
                padding: isMobile ? '1.125rem 1rem' : '1.5rem 1.25rem',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.06) 100%)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                borderRadius: isMobile ? '12px' : '16px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 16px rgba(59, 130, 246, 0.08)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: isMobile ? '40px' : '48px',
                  height: isMobile ? '40px' : '48px',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(59, 130, 246, 0.15) 100%)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: isMobile ? '0.75rem' : '1rem',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)'
                }}>
                  <BarChart3 size={isMobile ? 20 : 24} color="#60A5FA" strokeWidth={2.5} />
                </div>
                <h3 style={{
                  fontSize: isMobile ? '0.9375rem' : '1.0625rem',
                  fontWeight: '700',
                  color: 'var(--color-text-primary)',
                  marginBottom: '0.5rem',
                  letterSpacing: '-0.01em'
                }}>
                  Every Edge, Explained
                </h3>
                <p style={{
                  fontSize: isMobile ? '0.8125rem' : '0.9375rem',
                  lineHeight: 1.5,
                  color: 'rgba(248, 250, 252, 0.8)',
                  margin: 0,
                  letterSpacing: '-0.005em'
                }}>
                  Every pick comes with Expected Value (EV%) and win probability—no more hiding behind scores, tout talk, or paywalls.
                </p>
              </div>

              {/* Selectivity */}
              <div style={{
                padding: isMobile ? '1.125rem 1rem' : '1.5rem 1.25rem',
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(212, 175, 55, 0.06) 100%)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: isMobile ? '12px' : '16px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 16px rgba(212, 175, 55, 0.12)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: isMobile ? '40px' : '48px',
                  height: isMobile ? '40px' : '48px',
                  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.3) 0%, rgba(212, 175, 55, 0.2) 100%)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: isMobile ? '0.75rem' : '1rem',
                  boxShadow: '0 4px 12px rgba(212, 175, 55, 0.25)'
                }}>
                  <Target size={isMobile ? 20 : 24} color="#D4AF37" strokeWidth={2.5} />
                </div>
                <h3 style={{
                  fontSize: isMobile ? '0.9375rem' : '1.0625rem',
                  fontWeight: '700',
                  color: 'var(--color-text-primary)',
                  marginBottom: '0.5rem',
                  letterSpacing: '-0.01em'
                }}>
                  Quality Over Volume
                </h3>
                <p style={{
                  fontSize: isMobile ? '0.8125rem' : '0.9375rem',
                  lineHeight: 1.5,
                  color: 'rgba(248, 250, 252, 0.8)',
                  margin: 0,
                  letterSpacing: '-0.005em'
                }}>
                  Only +EV, actionable picks—never volume for volume's sake. If the market is efficient, we pass.
                </p>
              </div>

              {/* Accountability */}
              <div style={{
                padding: isMobile ? '1.125rem 1rem' : '1.5rem 1.25rem',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.06) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: isMobile ? '12px' : '16px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.08)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: isMobile ? '40px' : '48px',
                  height: isMobile ? '40px' : '48px',
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(16, 185, 129, 0.15) 100%)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: isMobile ? '0.75rem' : '1rem',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                }}>
                  <TrendingUp size={isMobile ? 20 : 24} color="#10B981" strokeWidth={2.5} />
                </div>
                <h3 style={{
                  fontSize: isMobile ? '0.9375rem' : '1.0625rem',
                  fontWeight: '700',
                  color: 'var(--color-text-primary)',
                  marginBottom: '0.5rem',
                  letterSpacing: '-0.01em'
                }}>
                  Track Record, Verified
                </h3>
                <p style={{
                  fontSize: isMobile ? '0.8125rem' : '0.9375rem',
                  lineHeight: 1.5,
                  color: 'rgba(248, 250, 252, 0.8)',
                  margin: 0,
                  letterSpacing: '-0.005em'
                }}>
                  Every result posted in real time. Nothing hidden. Full-season tracking, every unit accounted for.
                </p>
              </div>
            </div>

            {/* USP Callout */}
            <div style={{
              padding: isMobile ? '1.125rem 1rem' : '1.75rem 1.5rem',
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.18) 0%, rgba(212, 175, 55, 0.1) 100%)',
              border: '1.5px solid rgba(212, 175, 55, 0.5)',
              borderRadius: isMobile ? '12px' : '16px',
              marginBottom: isMobile ? '1.25rem' : '2rem',
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'flex-start' : 'center',
              gap: isMobile ? '0.875rem' : '1.25rem',
              boxShadow: `
                0 8px 24px rgba(212, 175, 55, 0.25),
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
                background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.6), transparent)'
              }} />
              <div style={{
                width: isMobile ? '44px' : '52px',
                height: isMobile ? '44px' : '52px',
                background: 'linear-gradient(135deg, #D4AF37 0%, #C4A02C 100%)',
                borderRadius: '11px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 16px rgba(212, 175, 55, 0.4)'
              }}>
                <CheckCircle size={isMobile ? 24 : 28} color="#0B0F1F" strokeWidth={2.5} />
              </div>
              <div>
                <p style={{
                  fontSize: isMobile ? '0.9375rem' : '1.125rem',
                  fontWeight: '800',
                  color: '#F4D03F',
                  margin: '0 0 0.375rem 0',
                  lineHeight: 1.3,
                  letterSpacing: '-0.015em',
                  textShadow: '0 2px 8px rgba(212, 175, 55, 0.4)'
                }}>
                  The only NHL model that shows you exactly where the math beats the market—before you ever place a bet.
                </p>
                <p style={{
                  fontSize: isMobile ? '0.8125rem' : '0.9375rem',
                  color: 'rgba(248, 250, 252, 0.85)',
                  margin: 0,
                  fontWeight: '500',
                  letterSpacing: '-0.005em'
                }}>
                  NHL Savant is not prediction. It's quantified edge you can actually use—no guesswork, no guru, just the data.
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: isMobile ? '0.625rem' : '0.875rem'
            }}>
              <button
                onClick={handleViewPicks}
                style={{
                  width: '100%',
                  padding: isMobile ? '1.0625rem 1.75rem' : '1.125rem 2rem',
                  background: 'linear-gradient(135deg, #F4D03F 0%, #D4AF37 50%, #C4A02C 100%)',
                  border: 'none',
                  borderRadius: isMobile ? '12px' : '14px',
                  color: '#0B0F1F',
                  fontSize: isMobile ? '0.9375rem' : '1.0625rem',
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
                  gap: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  touchAction: 'manipulation',
                  minHeight: isMobile ? '52px' : '56px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.01)';
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
                <TrendingUp size={isMobile ? 18 : 20} strokeWidth={3} />
              </button>
              
              {/* CTA Subcopy */}
              <p style={{
                fontSize: isMobile ? '0.8125rem' : '0.875rem',
                color: 'rgba(248, 250, 252, 0.7)',
                textAlign: 'center',
                margin: 0,
                fontWeight: '500',
                letterSpacing: '0.005em',
                lineHeight: 1.4
              }}>
                Actionable edge. Transparent numbers. Every NHL night.
              </p>

              <button
                onClick={handleClose}
                style={{
                  width: '100%',
                  padding: isMobile ? '0.8125rem 1.5rem' : '0.875rem 1.75rem',
                  background: 'rgba(148, 163, 184, 0.08)',
                  border: '1.5px solid rgba(148, 163, 184, 0.25)',
                  borderRadius: isMobile ? '10px' : '12px',
                  color: 'rgba(248, 250, 252, 0.7)',
                  fontSize: isMobile ? '0.8125rem' : '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  touchAction: 'manipulation',
                  minHeight: isMobile ? '44px' : '48px',
                  letterSpacing: '0.02em',
                  marginTop: isMobile ? '0.25rem' : '0.5rem'
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
                  e.currentTarget.style.color = 'rgba(248, 250, 252, 0.7)';
                  e.currentTarget.style.background = 'rgba(148, 163, 184, 0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                I'll Explore Later
              </button>
            </div>

            {/* Footer tagline - NO MORE "FREE" */}
            <p style={{
              fontSize: isMobile ? '0.75rem' : '0.8125rem',
              color: 'rgba(212, 175, 55, 0.65)',
              textAlign: 'center',
              marginTop: isMobile ? '1.125rem' : '1.5rem',
              marginBottom: 0,
              paddingBottom: isMobile ? '0.5rem' : '0.5rem',
              fontWeight: '600',
              letterSpacing: '0.01em',
              lineHeight: 1.4,
              fontStyle: 'italic'
            }}>
              Let others hope. You'll know the edge—before the line moves.
            </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WelcomeModal;

