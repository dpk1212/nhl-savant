import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, TrendingUp, Lock, ArrowRight } from 'lucide-react';
import { 
  getPerformanceStats,
  getStartDate, 
  calculateDollarGrowth,
  getWeeksSinceStart 
} from '../../utils/performanceStats';

const WelcomePopupModal = ({ isOpen, onClose, todaysGames, isMobile }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roiCounter, setRoiCounter] = useState(0);

  useEffect(() => {
    if (isOpen) {
      // Fetch ALL performance stats (same as Performance Dashboard)
      getPerformanceStats().then(perfStats => {
        console.log('📊 Welcome Popup - Performance Stats:', perfStats);
        setStats(perfStats);
        setLoading(false);
        
        // Animate Moneyline ROI counter
        if (perfStats?.moneylineROI) {
          let start = 0;
          const end = Math.round(perfStats.moneylineROI);
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

  // Calculate dynamic stats (use Moneyline ROI, same as Performance page)
  const startDate = getStartDate();
  const weeks = getWeeksSinceStart();
  const roi = stats?.moneylineROI || 19.6; // Fallback to last known ML ROI
  const profit = stats?.totalProfit || 9.79;
  const betCount = stats?.moneylineBets || 120;
  const dollarGrowth = calculateDollarGrowth(1000, roi);
  const roiDisplay = `${roi.toFixed(1)}%`;

  // Get picks EXACTLY like TodaysGames does - games with bestEdge
  const picksToday = todaysGames?.filter(game => 
    game.bestEdge && game.bestEdge.evPercent >= 3 // B-rated or higher
  ) || [];

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
          border: '2px solid rgba(212, 175, 55, 0.35)',
          borderRadius: '16px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: isMobile ? '1.75rem 1.25rem' : '2.5rem 2rem',
          position: 'relative',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(212, 175, 55, 0.2)',
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
            linear-gradient(rgba(212, 175, 55, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212, 175, 55, 0.02) 1px, transparent 1px)
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
          background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.6), transparent)',
          animation: 'scanline 4s linear infinite',
          opacity: 0.5
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
            color: 'rgba(212, 175, 55, 0.6)',
            transition: 'all 0.3s ease',
            zIndex: 3,
            padding: '0.5rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#D4AF37';
            e.currentTarget.style.transform = 'rotate(90deg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(212, 175, 55, 0.6)';
            e.currentTarget.style.transform = 'rotate(0deg)';
          }}
        >
          <X size={24} strokeWidth={2.5} />
        </button>

        {/* HERO: ROI - Proof First */}
        <div style={{
          textAlign: 'center',
          marginBottom: isMobile ? '2rem' : '2.5rem',
          animation: 'fadeInUp 0.5s ease-out 0.3s both',
          position: 'relative',
          zIndex: 1
        }}>
          <h1 style={{
            fontSize: isMobile ? '2rem' : '2.5rem',
            fontWeight: '800',
            color: '#10B981',
            margin: 0,
            marginBottom: '1rem',
            textShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
            letterSpacing: '-0.03em',
            lineHeight: '1.2'
          }}>
            {roiCounter}% ROI SINCE {startDate.toUpperCase()}
          </h1>
          
          <p style={{
            fontSize: isMobile ? '1.25rem' : '1.5rem',
            color: '#ffffff',
            fontWeight: '700',
            marginBottom: '0.5rem',
            lineHeight: '1.4'
          }}>
            {dollarGrowth} in {weeks} weeks
          </p>
          
          <p style={{
            fontSize: isMobile ? '0.938rem' : '1rem',
            color: 'rgba(255, 255, 255, 0.8)',
            margin: 0,
            fontWeight: '500'
          }}>
            Every pick tracked publicly.
          </p>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.4), transparent)',
          marginBottom: isMobile ? '2rem' : '2.5rem',
          boxShadow: '0 0 8px rgba(212, 175, 55, 0.2)'
        }} />

        {/* PAIN: Why You're Losing */}
        <div style={{
          background: 'rgba(255, 107, 107, 0.08)',
          border: '1px solid rgba(255, 107, 107, 0.3)',
          borderRadius: '12px',
          padding: isMobile ? '1.5rem' : '1.75rem',
          marginBottom: isMobile ? '2rem' : '2.5rem',
          animation: 'fadeInUp 0.5s ease-out 0.5s both',
          position: 'relative',
          zIndex: 1
        }}>
          <h3 style={{
            fontSize: isMobile ? '1.125rem' : '1.25rem',
            fontWeight: '700',
            color: '#ff6b6b',
            marginTop: 0,
            marginBottom: '1rem',
            textShadow: '0 0 10px rgba(255, 107, 107, 0.5)',
            letterSpacing: '0.01em'
          }}>
            HERE'S WHY YOU'RE LOSING MONEY
          </h3>
          <ul style={{
            fontSize: isMobile ? '0.9rem' : '0.938rem',
            color: 'rgba(255, 255, 255, 0.85)',
            lineHeight: '1.9',
            margin: 0,
            paddingLeft: 0,
            listStyle: 'none'
          }}>
            {[
              "You're betting the favorites (bad odds)",
              "You're chasing the star players",
              "You're betting without understanding the edge"
            ].map((item, i) => (
              <li key={i} style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span style={{ color: '#ff6b6b', fontWeight: '700', fontSize: '1.1rem', marginTop: '0.1rem' }}>❌</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p style={{
            fontSize: isMobile ? '0.875rem' : '0.938rem',
            color: 'rgba(255, 255, 255, 0.7)',
            marginTop: '1.25rem',
            marginBottom: 0,
            lineHeight: '1.7',
            fontStyle: 'italic'
          }}>
            Most people don't even know what +EV means.<br/>
            <strong style={{ color: '#ff6b6b' }}>That's why they lose.</strong>
          </p>
        </div>

        {/* SOLUTION: What We Do */}
        <div style={{
          background: 'rgba(212, 175, 55, 0.06)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          borderRadius: '12px',
          padding: isMobile ? '1.5rem' : '1.75rem',
          marginBottom: isMobile ? '2rem' : '2.5rem',
          animation: 'fadeInUp 0.5s ease-out 0.7s both',
          position: 'relative',
          zIndex: 1
        }}>
          <h3 style={{
            fontSize: isMobile ? '1.125rem' : '1.25rem',
            fontWeight: '700',
            color: '#D4AF37',
            marginTop: 0,
            marginBottom: '1rem',
            textShadow: '0 2px 8px rgba(212, 175, 55, 0.3)',
            letterSpacing: '0.01em'
          }}>
            WE FIND THE +EV THE MARKET MISSES
          </h3>
          <p style={{
            fontSize: isMobile ? '0.875rem' : '0.938rem',
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '1.25rem',
            lineHeight: '1.7'
          }}>
            While you're looking at the scoreboard, we're looking at:
          </p>
          <ul style={{
            fontSize: isMobile ? '0.875rem' : '0.938rem',
            color: 'rgba(255, 255, 255, 0.85)',
            lineHeight: '1.9',
            margin: 0,
            paddingLeft: 0,
            listStyle: 'none',
            marginBottom: '1.25rem'
          }}>
            {[
              "Goalie matchups the line doesn't price in",
              "Rest advantages nobody's talking about",
              "Where sharp money actually went"
            ].map((item, i) => (
              <li key={i} style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span style={{ color: '#D4AF37', fontWeight: '700', fontSize: '1rem' }}>→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p style={{
            fontSize: isMobile ? '0.9rem' : '1rem',
            color: '#ffffff',
            margin: 0,
            fontWeight: '600',
            lineHeight: '1.6'
          }}>
            Then we show you the picks <strong style={{ color: '#D4AF37' }}>FIRST</strong>.
          </p>
        </div>

        {/* TONIGHT'S PICKS - Teaser with cards */}
        <div style={{
          marginBottom: isMobile ? '2rem' : '2.5rem',
          animation: 'fadeInUp 0.5s ease-out 0.9s both',
          position: 'relative',
          zIndex: 1
        }}>
          <h3 style={{
            fontSize: isMobile ? '1.125rem' : '1.25rem',
            fontWeight: '700',
            color: '#D4AF37',
            marginTop: 0,
            marginBottom: '1.25rem',
            textAlign: 'center',
            textShadow: '0 2px 8px rgba(212, 175, 55, 0.3)',
            letterSpacing: '0.01em'
          }}>
            TONIGHT: {picksToday.length > 0 ? `${picksToday.length} PLAYS IDENTIFIED` : 'PLAYS POST BY 5PM ET'}
          </h3>

          {picksToday.length > 0 ? (
            <>
              <p style={{
                fontSize: isMobile ? '0.875rem' : '0.938rem',
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '1.25rem',
                textAlign: 'center',
                fontWeight: '500'
              }}>
                Both with verified +EV.
              </p>

              {/* Pick Cards - EXACT copy from TodaysGames with lock overlay */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {picksToday.slice(0, 2).map((game, index) => {
                  const bestEdge = game.bestEdge;
                  
                  return (
                    <div
                      key={index}
                      style={{
                        background: 'linear-gradient(135deg, #1a2a3a 0%, #101a20 100%)',
                        border: '1px solid rgba(212, 175, 55, 0.3)',
                        borderRadius: '12px',
                        padding: isMobile ? '1rem' : '1.25rem',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Top row: Teams and Time */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.75rem'
                      }}>
                        <span style={{
                          fontSize: isMobile ? '0.875rem' : '0.938rem',
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontWeight: '600'
                        }}>
                          {game.awayTeam} @ {game.homeTeam}
                        </span>
                        <span style={{
                          fontSize: '0.813rem',
                          color: 'rgba(255, 255, 255, 0.6)'
                        }}>
                          {game.gameTime}
                        </span>
                      </div>

                      {/* Bottom row: Pick and EV */}
                      <div style={{
                        display: 'flex',
                        gap: '0.75rem',
                        alignItems: 'center'
                      }}>
                        {/* Pick Box */}
                        <div style={{
                          background: 'rgba(139, 92, 246, 0.15)',
                          border: '1px solid rgba(139, 92, 246, 0.3)',
                          borderRadius: '8px',
                          padding: '0.5rem 0.75rem',
                          flex: 1
                        }}>
                          <div style={{
                            fontSize: '0.75rem',
                            color: 'rgba(255, 255, 255, 0.6)',
                            marginBottom: '0.25rem'
                          }}>
                            {bestEdge.market}
                          </div>
                          <div style={{
                            fontSize: isMobile ? '0.938rem' : '1rem',
                            color: '#ffffff',
                            fontWeight: '700'
                          }}>
                            {bestEdge.pick} {bestEdge.odds > 0 ? '+' : ''}{bestEdge.odds}
                          </div>
                        </div>
                        
                        {/* EV Box */}
                        <div style={{
                          background: bestEdge.evPercent >= 8 ? 'rgba(16, 185, 129, 0.15)' : 
                                      bestEdge.evPercent >= 5 ? 'rgba(0, 217, 255, 0.15)' : 
                                      'rgba(139, 92, 246, 0.15)',
                          border: `1px solid ${bestEdge.evPercent >= 8 ? '#10B981' : 
                                                bestEdge.evPercent >= 5 ? '#00d9ff' : 
                                                '#8B5CF6'}`,
                          borderRadius: '8px',
                          padding: '0.5rem 0.75rem',
                          textAlign: 'center',
                          minWidth: '80px'
                        }}>
                          <div style={{
                            fontSize: isMobile ? '1rem' : '1.125rem',
                            color: bestEdge.evPercent >= 8 ? '#10B981' : 
                                   bestEdge.evPercent >= 5 ? '#00d9ff' : 
                                   '#8B5CF6',
                            fontWeight: '800',
                            whiteSpace: 'nowrap'
                          }}>
                            +{bestEdge.evPercent.toFixed(1)}%
                          </div>
                          <div style={{
                            fontSize: '0.688rem',
                            color: 'rgba(255, 255, 255, 0.6)',
                            marginTop: '0.125rem'
                          }}>
                            EV
                          </div>
                        </div>
                      </div>

                      {/* Lock Overlay */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.85)',
                        backdropFilter: 'blur(4px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem',
                        borderRadius: '12px'
                      }}>
                        <Lock size={isMobile ? 22 : 26} color="#D4AF37" strokeWidth={2.5} style={{
                          filter: 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.6))',
                          animation: 'lockPulse 2s ease-in-out infinite'
                        }} />
                        <span style={{
                          color: '#D4AF37',
                          fontSize: isMobile ? '1.125rem' : '1.25rem',
                          fontWeight: '800',
                          letterSpacing: '0.05em',
                          textShadow: '0 2px 8px rgba(212, 175, 55, 0.5)'
                        }}>
                          LOCKED
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <p style={{
              fontSize: isMobile ? '0.938rem' : '1rem',
              color: 'rgba(255, 255, 255, 0.8)',
              textAlign: 'center',
              fontWeight: '500',
              lineHeight: '1.7',
              padding: isMobile ? '1.5rem' : '2rem',
              background: 'rgba(212, 175, 55, 0.04)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              borderRadius: '12px'
            }}>
              Get instant access to all picks.
            </p>
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
            transition: 'all 0.2s ease',
            width: '100%',
            boxShadow: '0 4px 16px rgba(245, 158, 11, 0.4)',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
            letterSpacing: '0.02em',
            position: 'relative',
            overflow: 'hidden',
            animation: 'fadeInUp 0.5s ease-out 1.1s both',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(245, 158, 11, 0.5)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(245, 158, 11, 0.4)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <ArrowRight size={isMobile ? 20 : 22} strokeWidth={3} />
          <span>Start Free Trial</span>
        </button>

        <p style={{
          fontSize: '0.875rem',
          color: 'rgba(255, 255, 255, 0.5)',
          textAlign: 'center',
          marginTop: '1.25rem',
          marginBottom: '1.5rem',
          animation: 'fadeInUp 0.5s ease-out 1.3s both'
        }}>
          (3-day access. Cancel anytime.)
        </p>

        {/* Closing Question - Psychological Hook */}
        <div style={{
          textAlign: 'center',
          animation: 'fadeInUp 0.5s ease-out 1.5s both',
          padding: isMobile ? '1rem' : '1.25rem',
          borderTop: '1px solid rgba(212, 175, 55, 0.2)'
        }}>
          <p style={{
            fontSize: isMobile ? '0.938rem' : '1rem',
            color: 'rgba(255, 255, 255, 0.9)',
            margin: 0,
            lineHeight: '1.7',
            fontWeight: '500'
          }}>
            Real question: <strong style={{ color: '#D4AF37' }}>Are you ready to see what edge actually looks like?</strong>
          </p>
          <p style={{
            fontSize: isMobile ? '0.875rem' : '0.938rem',
            color: 'rgba(255, 107, 107, 0.9)',
            marginTop: '0.75rem',
            marginBottom: 0,
            lineHeight: '1.6',
            fontStyle: 'italic'
          }}>
            Or are you going back to losing money with the public?
          </p>
        </div>

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
            50% { transform: scale(1.1); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default WelcomePopupModal;
