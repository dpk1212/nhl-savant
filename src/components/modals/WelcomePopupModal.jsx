import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, TrendingUp, Lock } from 'lucide-react';
import { 
  calculateROI, 
  getStartDate, 
  calculateDollarGrowth,
  getWeeksSinceStart 
} from '../../utils/performanceStats';

const WelcomePopupModal = ({ isOpen, onClose, todaysGames, isMobile }) => {
  const navigate = useNavigate();
  const [roi, setRoi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roiCounter, setRoiCounter] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Fetch dynamic ROI stats
      calculateROI().then(roiValue => {
        setRoi(roiValue);
        setLoading(false);
        
        // Animate ROI counter
        if (roiValue) {
          let start = 0;
          const end = Math.round(roiValue);
          const duration = 800; // 0.8 seconds
          const increment = end / (duration / 16); // 60fps
          
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setRoiCounter(end);
              clearInterval(timer);
            } else {
              setRoiCounter(Math.floor(start));
            }
          }, 16);
          
          return () => clearInterval(timer);
        }
      });
    } else {
      setIsAnimating(false);
      setRoiCounter(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUnlock = () => {
    onClose();
    navigate('/pricing');
  };

  // Calculate dynamic stats
  const startDate = getStartDate();
  const weeks = getWeeksSinceStart();
  const dollarGrowth = roi ? calculateDollarGrowth(1000, roi) : '$1,000 → $1,260';
  const roiDisplay = roi ? `${Math.round(roi)}%` : '26%';

  // Filter today's games for picks with positive EV
  const picksToday = todaysGames?.filter(game => 
    game.bestEdge && game.bestEdge.ev > 0
  ) || [];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.90)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '1rem',
        animation: 'backdropFadeIn 0.4s ease-out',
        overflow: 'auto'
      }}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #0a0e1a 0%, #0f1419 100%)',
          border: '2px solid',
          borderImage: 'linear-gradient(135deg, #00d9ff 0%, rgba(0, 217, 255, 0.3) 50%, #00d9ff 100%) 1',
          borderRadius: '16px',
          maxWidth: '700px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: isMobile ? '2rem 1.5rem' : '2.5rem 2rem',
          position: 'relative',
          boxShadow: '0 0 60px rgba(0, 217, 255, 0.4), inset 0 0 40px rgba(0, 217, 255, 0.05)',
          color: '#ffffff',
          animation: 'modalSlideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          animationDelay: '0.2s',
          animationFillMode: 'both'
        }}
      >
        {/* Animated grid overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(0, 217, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 217, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          opacity: 0.6,
          pointerEvents: 'none',
          animation: 'gridPulse 4s ease-in-out infinite'
        }} />

        {/* Scanline effect */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #00d9ff, transparent)',
          animation: 'scanline 3s linear infinite',
          opacity: 0.8,
          zIndex: 2
        }} />

        {/* Corner brackets */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          width: '30px',
          height: '30px',
          borderTop: '2px solid #00d9ff',
          borderLeft: '2px solid #00d9ff',
          opacity: 0.6,
          animation: 'bracketPulse 2s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          width: '30px',
          height: '30px',
          borderTop: '2px solid #00d9ff',
          borderRight: '2px solid #00d9ff',
          opacity: 0.6,
          animation: 'bracketPulse 2s ease-in-out infinite',
          animationDelay: '0.5s'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          width: '30px',
          height: '30px',
          borderBottom: '2px solid #00d9ff',
          borderLeft: '2px solid #00d9ff',
          opacity: 0.6,
          animation: 'bracketPulse 2s ease-in-out infinite',
          animationDelay: '1s'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          width: '30px',
          height: '30px',
          borderBottom: '2px solid #00d9ff',
          borderRight: '2px solid #00d9ff',
          opacity: 0.6,
          animation: 'bracketPulse 2s ease-in-out infinite',
          animationDelay: '1.5s'
        }} />

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'rgba(0, 217, 255, 0.7)',
            transition: 'all 0.3s ease',
            zIndex: 3,
            padding: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#00d9ff';
            e.currentTarget.style.transform = 'rotate(90deg) scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(0, 217, 255, 0.7)';
            e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
          }}
        >
          <X size={24} strokeWidth={2.5} />
        </button>

        {/* SECTION 1: PROOF (Hero) */}
        <div style={{
          marginBottom: '2rem',
          textAlign: 'center',
          animation: 'sectionFadeIn 0.6s ease-out',
          animationDelay: '0.4s',
          animationFillMode: 'both',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1rem'
          }}>
            <TrendingUp size={isMobile ? 32 : 40} color="#00d9ff" strokeWidth={2.5} style={{
              filter: 'drop-shadow(0 0 10px #00d9ff)',
              animation: 'iconFloat 3s ease-in-out infinite'
            }} />
            <h1 style={{
              fontSize: isMobile ? '2.5rem' : '3rem',
              fontWeight: '800',
              color: '#00d9ff',
              margin: 0,
              textShadow: '0 0 20px rgba(0, 217, 255, 0.6)',
              letterSpacing: '-0.03em',
              lineHeight: '1',
              background: 'linear-gradient(135deg, #00d9ff 0%, #00aaff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: loading ? 'shimmer 2s linear infinite' : 'none',
              backgroundSize: '200% 100%'
            }}>
              {roiCounter}% ROI
            </h1>
          </div>
          <p style={{
            fontSize: isMobile ? '0.875rem' : '1rem',
            color: '#00d9ff',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
            fontWeight: '700',
            textShadow: '0 0 10px rgba(0, 217, 255, 0.5)'
          }}>
            SINCE {startDate.toUpperCase()}
          </p>
          <div style={{
            fontSize: isMobile ? '1.125rem' : '1.25rem',
            color: 'rgba(255, 255, 255, 0.95)',
            lineHeight: '1.6',
            fontWeight: '600',
            marginBottom: '0.5rem'
          }}>
            That means {dollarGrowth} in ~{weeks} weeks.
          </div>
          <p style={{
            fontSize: isMobile ? '0.938rem' : '1rem',
            color: 'rgba(255, 255, 255, 0.75)',
            lineHeight: '1.6',
            margin: 0
          }}>
            Every pick tracked publicly. <strong style={{ color: '#ffffff' }}>Zero bullshit.</strong>
          </p>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(0, 217, 255, 0.4), transparent)',
          marginBottom: '2rem',
          boxShadow: '0 0 10px rgba(0, 217, 255, 0.3)',
          animation: 'dividerGlow 3s ease-in-out infinite'
        }} />

        {/* SECTION 2: PAIN POINTS */}
        <div style={{
          background: 'rgba(255, 107, 107, 0.06)',
          border: '1px solid rgba(255, 107, 107, 0.25)',
          borderRadius: '12px',
          padding: isMobile ? '1.5rem' : '1.75rem',
          marginBottom: '2rem',
          animation: 'sectionFadeIn 0.6s ease-out',
          animationDelay: '0.6s',
          animationFillMode: 'both',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Warning pattern */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255, 107, 107, 0.02) 10px, rgba(255, 107, 107, 0.02) 20px)',
            pointerEvents: 'none'
          }} />
          
          <h2 style={{
            fontSize: isMobile ? '1.25rem' : '1.5rem',
            fontWeight: '700',
            color: '#ffffff',
            marginTop: 0,
            marginBottom: '1.25rem',
            letterSpacing: '-0.02em',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            position: 'relative',
            zIndex: 1
          }}>
            <span style={{
              fontSize: '1.5rem',
              animation: 'rotateX 2s ease-in-out infinite'
            }}>❌</span>
            WHAT YOU'RE DOING WRONG
          </h2>
          <p style={{
            fontSize: isMobile ? '0.938rem' : '1rem',
            color: 'rgba(255, 255, 255, 0.9)',
            lineHeight: '1.7',
            marginBottom: '1rem',
            fontWeight: '600',
            position: 'relative',
            zIndex: 1
          }}>
            The public:
          </p>
          <ul style={{
            fontSize: isMobile ? '0.875rem' : '0.938rem',
            color: 'rgba(255, 255, 255, 0.85)',
            lineHeight: '2',
            margin: 0,
            paddingLeft: '1.5rem',
            position: 'relative',
            zIndex: 1,
            listStyle: 'none'
          }}>
            {[
              { text: 'Hammers overs', sub: '(ignoring defensive matchups)' },
              { text: 'Bets heavy favorites', sub: '(inflating their odds)' },
              { text: 'Chases star players', sub: '(McDavid, Matthews)' },
              { text: 'Follows Twitter touts', sub: '(fake records)' }
            ].map((item, i) => (
              <li key={i} style={{
                marginBottom: '0.75rem',
                animation: 'bulletFadeIn 0.4s ease-out',
                animationDelay: `${0.8 + (i * 0.1)}s`,
                animationFillMode: 'both'
              }}>
                <strong style={{ color: '#ff6b6b', fontWeight: '700' }}>{item.text}</strong> <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{item.sub}</span>
              </li>
            ))}
          </ul>
          <p style={{
            fontSize: isMobile ? '1rem' : '1.125rem',
            color: '#ff6b6b',
            fontWeight: '700',
            marginTop: '1.25rem',
            marginBottom: 0,
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            Result: <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>📉 Long-term losses</span>
          </p>
        </div>

        {/* SECTION 3: SOLUTION */}
        <div style={{
          background: 'rgba(0, 217, 255, 0.04)',
          border: '1px solid rgba(0, 217, 255, 0.25)',
          borderRadius: '12px',
          padding: isMobile ? '1.5rem' : '1.75rem',
          marginBottom: '2rem',
          animation: 'sectionFadeIn 0.6s ease-out',
          animationDelay: '1s',
          animationFillMode: 'both',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Data grid pattern */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              linear-gradient(rgba(0, 217, 255, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 217, 255, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '15px 15px',
            pointerEvents: 'none',
            animation: 'gridShift 20s linear infinite'
          }} />
          
          <h2 style={{
            fontSize: isMobile ? '1.25rem' : '1.5rem',
            fontWeight: '700',
            color: '#ffffff',
            marginTop: 0,
            marginBottom: '1.25rem',
            letterSpacing: '-0.02em',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            position: 'relative',
            zIndex: 1
          }}>
            <span style={{ fontSize: '1.5rem' }}>✅</span>
            WHAT WE DO DIFFERENTLY
          </h2>
          <p style={{
            fontSize: isMobile ? '0.938rem' : '1rem',
            color: 'rgba(255, 255, 255, 0.9)',
            lineHeight: '1.7',
            marginBottom: '1.25rem',
            position: 'relative',
            zIndex: 1
          }}>
            Our algorithm analyzes <strong style={{ color: '#00d9ff', fontWeight: '700' }}>10,000+ data points per game</strong> to find where the public creates mispricing:
          </p>
          
          <ul style={{
            fontSize: isMobile ? '0.875rem' : '0.938rem',
            color: 'rgba(255, 255, 255, 0.85)',
            lineHeight: '2',
            margin: 0,
            paddingLeft: '1.5rem',
            position: 'relative',
            zIndex: 1,
            listStyle: 'none'
          }}>
            {[
              'Goalie matchups (save %, recent form)',
              'Rest & travel (back-to-backs, road trips)',
              'Line movement (sharp vs. public money)',
              'Public betting % (when everyone\'s on one side)',
              'Expected goals (xG models, shot quality)'
            ].map((item, i) => (
              <li key={i} style={{
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                animation: 'slideInLeft 0.5s ease-out',
                animationDelay: `${1.2 + (i * 0.1)}s`,
                animationFillMode: 'both'
              }}>
                <span style={{
                  fontSize: '1.125rem',
                  flexShrink: 0,
                  filter: 'drop-shadow(0 0 5px #00d9ff)'
                }}>📊</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          
          <p style={{
            fontSize: isMobile ? '1rem' : '1.125rem',
            color: 'rgba(255, 255, 255, 0.95)',
            fontWeight: '600',
            marginTop: '1.25rem',
            marginBottom: 0,
            position: 'relative',
            zIndex: 1
          }}>
            Then we show you the picks with <strong style={{ color: '#10B981', textShadow: '0 0 10px rgba(16, 185, 129, 0.5)' }}>PROVEN EDGE</strong>—before the market moves.
          </p>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(0, 217, 255, 0.4), transparent)',
          marginBottom: '2rem',
          boxShadow: '0 0 10px rgba(0, 217, 255, 0.3)'
        }} />

        {/* SECTION 4: TONIGHT'S PICKS */}
        <div style={{
          marginBottom: '2rem',
          animation: 'sectionFadeIn 0.6s ease-out',
          animationDelay: '1.4s',
          animationFillMode: 'both'
        }}>
          <h2 style={{
            fontSize: isMobile ? '1.25rem' : '1.5rem',
            fontWeight: '700',
            color: '#ffffff',
            marginTop: 0,
            marginBottom: '1.5rem',
            letterSpacing: '-0.02em',
            textAlign: 'center',
            textShadow: '0 0 15px rgba(0, 217, 255, 0.5)'
          }}>
            🎯 TONIGHT: {picksToday.length} EDGE{picksToday.length !== 1 ? 'S' : ''} IDENTIFIED
          </h2>

          {picksToday.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {picksToday.slice(0, 2).map((game, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(0, 217, 255, 0.03)',
                    border: '1px solid rgba(0, 217, 255, 0.25)',
                    borderRadius: '10px',
                    padding: isMobile ? '1.25rem' : '1.5rem',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    animation: 'cardFadeIn 0.5s ease-out',
                    animationDelay: `${1.6 + (index * 0.2)}s`,
                    animationFillMode: 'both'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 217, 255, 0.06)';
                    e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.5)';
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 217, 255, 0.03)';
                    e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.25)';
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    fontSize: isMobile ? '1rem' : '1.125rem',
                    color: '#00d9ff',
                    fontWeight: '700',
                    marginBottom: '0.75rem',
                    textShadow: '0 0 10px rgba(0, 217, 255, 0.5)'
                  }}>
                    +{game.bestEdge.ev.toFixed(1)}% Expected Value
                  </div>
                  <div style={{
                    fontSize: isMobile ? '0.875rem' : '0.938rem',
                    color: 'rgba(255, 255, 255, 0.85)',
                    marginBottom: '0.5rem'
                  }}>
                    🎯 {Math.round(game.bestEdge.winProbability * 100)}% Model Confidence
                  </div>
                  <div style={{
                    fontSize: isMobile ? '0.813rem' : '0.875rem',
                    color: 'rgba(255, 255, 255, 0.7)',
                    marginBottom: '1rem'
                  }}>
                    Edge: {getEdgeType(game)}
                  </div>
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    borderRadius: '8px',
                    padding: '1rem',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    border: '1px solid rgba(0, 217, 255, 0.2)'
                  }}>
                    <Lock size={isMobile ? 18 : 20} color="rgba(255, 255, 255, 0.6)" strokeWidth={2.5} style={{
                      animation: 'lockPulse 2s ease-in-out infinite'
                    }} />
                    <span style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: isMobile ? '0.875rem' : '0.938rem',
                      fontWeight: '600',
                      letterSpacing: '0.05em'
                    }}>
                      TEAM & LINE LOCKED
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              background: 'rgba(0, 217, 255, 0.03)',
              border: '1px solid rgba(0, 217, 255, 0.2)',
              borderRadius: '10px',
              padding: isMobile ? '1.5rem' : '2rem',
              textAlign: 'center'
            }}>
              <p style={{
                fontSize: isMobile ? '0.938rem' : '1rem',
                color: 'rgba(255, 255, 255, 0.85)',
                lineHeight: '1.7',
                margin: 0
              }}>
                Today's picks will be posted by 5:00 PM ET.
                <br /><br />
                Sign up now to get instant access when they drop.
              </p>
            </div>
          )}
        </div>

        {/* SECTION 5: CTA */}
        <button
          onClick={handleUnlock}
          style={{
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            border: '2px solid #F59E0B',
            borderRadius: '12px',
            padding: isMobile ? '1.125rem 1.75rem' : '1.25rem 2rem',
            color: '#0a0e1a',
            fontSize: isMobile ? '1.125rem' : '1.25rem',
            fontWeight: '800',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            width: '100%',
            boxShadow: '0 0 30px rgba(245, 158, 11, 0.6)',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
            letterSpacing: '0.02em',
            position: 'relative',
            overflow: 'hidden',
            animation: 'ctaPulse 2s ease-in-out infinite, sectionFadeIn 0.6s ease-out 1.8s both'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 0 50px rgba(245, 158, 11, 0.9)';
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 0 30px rgba(245, 158, 11, 0.6)';
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px) scale(0.98)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
          }}
        >
          {/* Shimmer effect */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
            animation: 'shimmer 3s infinite'
          }} />
          
          <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
            <Lock size={isMobile ? 20 : 22} strokeWidth={3} />
            Unlock Tonight's Picks - Start Free
          </span>
        </button>

        <p style={{
          fontSize: isMobile ? '0.813rem' : '0.875rem',
          color: 'rgba(255, 255, 255, 0.6)',
          textAlign: 'center',
          marginTop: '1.25rem',
          marginBottom: 0,
          lineHeight: '1.6',
          animation: 'sectionFadeIn 0.6s ease-out',
          animationDelay: '2s',
          animationFillMode: 'both'
        }}>
          No card · Instant access · Cancel anytime
        </p>

        {/* Advanced Keyframes */}
        <style>{`
          @keyframes backdropFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes modalSlideUp {
            from {
              opacity: 0;
              transform: translateY(40px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          @keyframes sectionFadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes bulletFadeIn {
            from {
              opacity: 0;
              transform: translateX(-10px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes cardFadeIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          
          @keyframes scanline {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
          
          @keyframes gridPulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.7; }
          }
          
          @keyframes gridShift {
            0% { backgroundPosition: 0 0; }
            100% { backgroundPosition: 20px 20px; }
          }
          
          @keyframes bracketPulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.7; }
          }
          
          @keyframes dividerGlow {
            0%, 100% { boxShadow: 0 0 5px rgba(0, 217, 255, 0.2); }
            50% { boxShadow: 0 0 15px rgba(0, 217, 255, 0.5); }
          }
          
          @keyframes iconFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
          }
          
          @keyframes rotateX {
            0%, 100% { transform: rotateX(0deg); }
            50% { transform: rotateX(180deg); }
          }
          
          @keyframes lockPulse {
            0%, 100% { transform: scale(1); opacity: 0.6; }
            50% { transform: scale(1.1); opacity: 1; }
          }
          
          @keyframes ctaPulse {
            0%, 100% {
              boxShadow: 0 0 30px rgba(245, 158, 11, 0.6);
            }
            50% {
              boxShadow: 0 0 40px rgba(245, 158, 11, 0.8);
            }
          }
          
          @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 200%; }
          }
        `}</style>
      </div>
    </div>
  );
};

// Helper function to determine edge type from game data
function getEdgeType(game) {
  const factors = [];
  
  if (game.goalieEdge) factors.push('Goalie');
  if (game.restAdvantage) factors.push('Rest');
  if (game.publicBetting) factors.push('Public');
  if (game.lineMovement) factors.push('Line Movement');
  
  if (factors.length === 0) return 'Advanced Metrics';
  return factors.join(' + ');
}

export default WelcomePopupModal;
