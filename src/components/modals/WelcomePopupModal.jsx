import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, TrendingUp, Lock, ArrowRight } from 'lucide-react';
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

  useEffect(() => {
    if (isOpen) {
      // Fetch dynamic ROI stats
      calculateROI().then(roiValue => {
        setRoi(roiValue);
        setLoading(false);
        
        // Animate ROI counter
        if (roiValue) {
          let start = 0;
          const end = Math.round(roiValue);
          const duration = 1000;
          const increment = end / (duration / 16);
          
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

  // FIX: Filter for games with positive EV (evPercent, not ev)
  const picksToday = todaysGames?.filter(game => 
    game.bestEdge && game.bestEdge.evPercent > 0
  ) || [];

  console.log('🎯 Welcome Popup - Picks today:', picksToday.length, picksToday);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: isMobile ? '1rem' : '1.5rem',
        animation: 'backdropFadeIn 0.3s ease-out',
        overflow: 'auto'
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #0a0e1a 0%, #0f1419 100%)',
          border: '2px solid rgba(0, 217, 255, 0.4)',
          borderRadius: '16px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: isMobile ? '2rem 1.5rem' : '2.5rem 2rem',
          position: 'relative',
          boxShadow: '0 0 80px rgba(0, 217, 255, 0.5), inset 0 0 60px rgba(0, 217, 255, 0.03)',
          color: '#ffffff',
          animation: 'modalSlideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both'
        }}
      >
        {/* Grid overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(0, 217, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 217, 255, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px',
          opacity: 0.5,
          pointerEvents: 'none'
        }} />

        {/* Scanline */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #00d9ff, transparent)',
          animation: 'scanline 4s linear infinite',
          opacity: 0.6
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
            color: 'rgba(0, 217, 255, 0.6)',
            transition: 'all 0.3s ease',
            zIndex: 3,
            padding: '0.5rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#00d9ff';
            e.currentTarget.style.transform = 'rotate(90deg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(0, 217, 255, 0.6)';
            e.currentTarget.style.transform = 'rotate(0deg)';
          }}
        >
          <X size={24} strokeWidth={2.5} />
        </button>

        {/* HERO: ROI */}
        <div style={{
          textAlign: 'center',
          marginBottom: isMobile ? '2rem' : '2.5rem',
          animation: 'fadeInUp 0.5s ease-out 0.3s both',
          position: 'relative',
          zIndex: 1
        }}>
          <TrendingUp size={isMobile ? 36 : 48} color="#00d9ff" strokeWidth={2.5} style={{
            filter: 'drop-shadow(0 0 15px #00d9ff)',
            marginBottom: '1rem'
          }} />
          
          <h1 style={{
            fontSize: isMobile ? '3rem' : '4rem',
            fontWeight: '800',
            color: '#00d9ff',
            margin: 0,
            marginBottom: '0.5rem',
            textShadow: '0 0 30px rgba(0, 217, 255, 0.8)',
            letterSpacing: '-0.04em',
            lineHeight: '1'
          }}>
            {roiCounter}%
          </h1>
          
          <p style={{
            fontSize: isMobile ? '1rem' : '1.125rem',
            color: 'rgba(0, 217, 255, 0.9)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            fontWeight: '700',
            marginBottom: '1.5rem',
            textShadow: '0 0 10px rgba(0, 217, 255, 0.4)'
          }}>
            ROI SINCE {startDate.toUpperCase()}
          </p>
          
          <p style={{
            fontSize: isMobile ? '1.125rem' : '1.25rem',
            color: '#ffffff',
            fontWeight: '600',
            marginBottom: '0.75rem',
            lineHeight: '1.4'
          }}>
            {dollarGrowth} in ~{weeks} weeks
          </p>
          
          <p style={{
            fontSize: isMobile ? '0.938rem' : '1rem',
            color: 'rgba(255, 255, 255, 0.7)',
            margin: 0
          }}>
            Tracked publicly. <strong style={{ color: '#ffffff' }}>Zero bullshit.</strong>
          </p>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(0, 217, 255, 0.5), transparent)',
          marginBottom: isMobile ? '2rem' : '2.5rem',
          boxShadow: '0 0 15px rgba(0, 217, 255, 0.3)'
        }} />

        {/* PAIN → SOLUTION (Compact) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? '1.5rem' : '1rem',
          marginBottom: isMobile ? '2rem' : '2.5rem',
          animation: 'fadeInUp 0.5s ease-out 0.5s both',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Pain */}
          <div style={{
            background: 'rgba(255, 107, 107, 0.08)',
            border: '1px solid rgba(255, 107, 107, 0.3)',
            borderRadius: '12px',
            padding: isMobile ? '1.5rem' : '1.25rem',
            transition: 'all 0.3s ease'
          }}>
            <h3 style={{
              fontSize: isMobile ? '1.125rem' : '1rem',
              fontWeight: '700',
              color: '#ff6b6b',
              marginTop: 0,
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              textShadow: '0 0 10px rgba(255, 107, 107, 0.5)'
            }}>
              <span style={{ fontSize: '1.25rem' }}>❌</span>
              WHAT FAILS
            </h3>
            <ul style={{
              fontSize: '0.875rem',
              color: 'rgba(255, 255, 255, 0.8)',
              lineHeight: '1.9',
              margin: 0,
              paddingLeft: '1.25rem',
              listStyle: 'none'
            }}>
              {['Hammering overs', 'Betting favorites blindly', 'Chasing stars', 'Twitter touts'].map((item, i) => (
                <li key={i} style={{ marginBottom: '0.5rem' }}>
                  <strong style={{ color: '#ff6b6b' }}>•</strong> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Solution */}
          <div style={{
            background: 'rgba(0, 217, 255, 0.06)',
            border: '1px solid rgba(0, 217, 255, 0.3)',
            borderRadius: '12px',
            padding: isMobile ? '1.5rem' : '1.25rem',
            transition: 'all 0.3s ease'
          }}>
            <h3 style={{
              fontSize: isMobile ? '1.125rem' : '1rem',
              fontWeight: '700',
              color: '#00d9ff',
              marginTop: 0,
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              textShadow: '0 0 10px rgba(0, 217, 255, 0.5)'
            }}>
              <span style={{ fontSize: '1.25rem' }}>✅</span>
              WHAT WORKS
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: 'rgba(255, 255, 255, 0.85)',
              lineHeight: '1.7',
              margin: 0,
              marginBottom: '1rem'
            }}>
              <strong style={{ color: '#00d9ff' }}>10,000+ data points</strong> per game:
            </p>
            <ul style={{
              fontSize: '0.813rem',
              color: 'rgba(255, 255, 255, 0.75)',
              lineHeight: '1.8',
              margin: 0,
              paddingLeft: '1.25rem',
              listStyle: 'none'
            }}>
              {['Goalie matchups', 'Rest & travel', 'Line movement', 'Public betting %'].map((item, i) => (
                <li key={i} style={{ marginBottom: '0.4rem' }}>
                  <span style={{ color: '#00d9ff' }}>📊</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* TONIGHT'S PICKS */}
        <div style={{
          animation: 'fadeInUp 0.5s ease-out 0.7s both',
          marginBottom: isMobile ? '2rem' : '2.5rem',
          position: 'relative',
          zIndex: 1
        }}>
          <h2 style={{
            fontSize: isMobile ? '1.25rem' : '1.375rem',
            fontWeight: '700',
            color: '#ffffff',
            marginTop: 0,
            marginBottom: '1.5rem',
            textAlign: 'center',
            textShadow: '0 0 15px rgba(0, 217, 255, 0.5)'
          }}>
            🎯 TONIGHT: {picksToday.length} EDGE{picksToday.length !== 1 ? 'S' : ''} FOUND
          </h2>

          {picksToday.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {picksToday.slice(0, 2).map((game, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(0, 217, 255, 0.04)',
                    border: '1px solid rgba(0, 217, 255, 0.3)',
                    borderRadius: '10px',
                    padding: isMobile ? '1.25rem' : '1.5rem',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 217, 255, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.6)';
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 217, 255, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 217, 255, 0.04)';
                    e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      fontSize: isMobile ? '1.125rem' : '1.25rem',
                      color: '#00d9ff',
                      fontWeight: '700',
                      textShadow: '0 0 10px rgba(0, 217, 255, 0.5)'
                    }}>
                      +{game.bestEdge.evPercent.toFixed(1)}% EV
                    </div>
                    <div style={{
                      fontSize: isMobile ? '0.875rem' : '0.938rem',
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontWeight: '600'
                    }}>
                      {Math.round(game.bestEdge.winProbability * 100)}% confident
                    </div>
                  </div>
                  
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    borderRadius: '8px',
                    padding: '1rem',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    border: '1px solid rgba(0, 217, 255, 0.2)'
                  }}>
                    <Lock size={18} color="rgba(255, 255, 255, 0.6)" strokeWidth={2.5} style={{
                      animation: 'lockPulse 2s ease-in-out infinite'
                    }} />
                    <span style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      letterSpacing: '0.05em'
                    }}>
                      LOCKED
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              background: 'rgba(0, 217, 255, 0.04)',
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
                Picks post by 5:00 PM ET.
                <br /><br />
                <strong style={{ color: '#00d9ff' }}>Sign up now</strong> for instant access.
              </p>
            </div>
          )}
        </div>

        {/* CTA */}
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
            boxShadow: '0 0 40px rgba(245, 158, 11, 0.7)',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
            letterSpacing: '0.02em',
            position: 'relative',
            overflow: 'hidden',
            animation: 'fadeInUp 0.5s ease-out 0.9s both, ctaPulse 2s ease-in-out 1.5s infinite',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 0 60px rgba(245, 158, 11, 1)';
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 0 40px rgba(245, 158, 11, 0.7)';
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
          }}
        >
          <Lock size={isMobile ? 20 : 22} strokeWidth={3} />
          <span>Unlock Tonight's Picks</span>
          <ArrowRight size={isMobile ? 20 : 22} strokeWidth={3} />
        </button>

        <p style={{
          fontSize: '0.875rem',
          color: 'rgba(255, 255, 255, 0.5)',
          textAlign: 'center',
          marginTop: '1.25rem',
          marginBottom: 0,
          animation: 'fadeInUp 0.5s ease-out 1.1s both'
        }}>
          No card · Instant access · Cancel anytime
        </p>

        {/* Keyframes */}
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
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes scanline {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
          
          @keyframes lockPulse {
            0%, 100% { transform: scale(1); opacity: 0.6; }
            50% { transform: scale(1.15); opacity: 1; }
          }
          
          @keyframes ctaPulse {
            0%, 100% {
              boxShadow: 0 0 40px rgba(245, 158, 11, 0.7);
            }
            50% {
              boxShadow: 0 0 50px rgba(245, 158, 11, 0.9);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default WelcomePopupModal;
