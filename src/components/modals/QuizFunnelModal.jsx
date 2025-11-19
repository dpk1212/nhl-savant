import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, TrendingUp, Lock, ArrowRight, ChevronLeft } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, analytics, logEvent as firebaseLogEvent } from '../../firebase/config';
import { 
  getPerformanceStats,
  getStartDate, 
  calculateDollarGrowth,
  getWeeksSinceStart 
} from '../../utils/performanceStats';
import DiscountLottery from '../DiscountLottery';

const QuizFunnelModal = ({ isOpen, onClose, todaysGames, isMobile }) => {
  const navigate = useNavigate();
  
  // Quiz flow state
  const [currentScreen, setCurrentScreen] = useState(1);
  const [painPoint, setPainPoint] = useState(null);
  const [commitmentLevel, setCommitmentLevel] = useState(null);
  const [betSize, setBetSize] = useState('$100');
  
  // Stats state (same as old modal)
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roiCounter, setRoiCounter] = useState(0);
  const [discountCode, setDiscountCode] = useState(null);
  const [aPlusROI, setAPlusROI] = useState(14.3);
  const [aPlusBetCount, setAPlusBetCount] = useState(69);
  
  // Loading animation state
  const [loadingMessage, setLoadingMessage] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Swipe gesture state
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Analytics helper
  const logEvent = (eventName, params = {}) => {
    if (analytics) {
      firebaseLogEvent(analytics, eventName, params);
    }
  };

  // Haptic feedback helper
  const triggerHaptic = () => {
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  // Handle swipe gestures
  const handleSwipe = () => {
    if (touchStart - touchEnd > 50) {
      // Swiped left = advance
      if (currentScreen === 1 && painPoint) {
        triggerHaptic();
        setCurrentScreen(2);
      } else if (currentScreen === 2 && commitmentLevel) {
        triggerHaptic();
        setCurrentScreen(3);
      }
    }
    if (touchEnd - touchStart > 50) {
      // Swiped right = go back
      if (currentScreen === 2) {
        triggerHaptic();
        setCurrentScreen(1);
      } else if (currentScreen === 4) {
        triggerHaptic();
        setCurrentScreen(2);
      }
    }
  };

  // Fetch stats on mount (copied from old modal)
  useEffect(() => {
    if (isOpen) {
      // Fetch ALL performance stats (same as Performance Dashboard)
      getPerformanceStats().then(perfStats => {
        console.log('📊 Quiz Funnel - Performance Stats:', perfStats);
        setStats(perfStats);
        setLoading(false);
        
        // Animate Moneyline ROI counter
        if (perfStats?.moneylineROI) {
          let start = 0;
          const end = Math.round(perfStats.moneylineROI);
          const duration = 1500;
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

      // Fetch A+ rating ROI specifically for paywall
      const fetchAPlusROI = async () => {
        try {
          const q = query(
            collection(db, 'bets'),
            where('status', '==', 'COMPLETED')
          );
          
          const snapshot = await getDocs(q);
          const bets = snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
          
          // Filter for A+ bets (quality bets only, no totals)
          const aPlusBets = bets.filter(b => 
            (b.prediction?.rating === 'A+' || b.prediction?.qualityGrade === 'A+') &&
            b.bet?.market !== 'TOTAL' && 
            !b.bet?.market?.includes('TOTAL')
          );
          
          if (aPlusBets.length > 0) {
            const totalProfit = aPlusBets.reduce((sum, b) => sum + (b.result?.profit || 0), 0);
            
            // Calculate ROI same way as Performance page (flat $10 bets)
            const flatProfit = totalProfit * 10;
            const roi = (flatProfit / (aPlusBets.length * 10)) * 100;
            
            console.log('📊 A+ Stats:', { 
              bets: aPlusBets.length, 
              roi: roi.toFixed(1) + '%' 
            });
            
            setAPlusROI(roi);
            setAPlusBetCount(aPlusBets.length);
          }
        } catch (error) {
          console.error('❌ Error fetching A+ ROI:', error);
        }
      };
      
      fetchAPlusROI();
    } else {
      setRoiCounter(0);
    }
  }, [isOpen]);

  // Screen 3 auto-advance with loading animation
  useEffect(() => {
    if (currentScreen === 3) {
      logEvent('quiz_screen_3_viewed', { painPoint, commitmentLevel });
      
      // Cycle through loading messages
      const messages = [
        'Scanning 247 NHL games...',
        'Calculating +EV opportunities...',
        'Comparing to 1,000+ profitable bettors...',
        'Building your custom dashboard...'
      ];
      
      let messageIndex = 0;
      setLoadingMessage(messages[0]);
      setLoadingProgress(25);
      
      const messageTimer = setInterval(() => {
        messageIndex++;
        if (messageIndex < messages.length) {
          setLoadingMessage(messages[messageIndex]);
          setLoadingProgress((messageIndex + 1) * 25);
        }
      }, 700);
      
      // Auto-advance after 3 seconds
      const advanceTimer = setTimeout(() => {
        setCurrentScreen(4);
      }, 3000);
      
      return () => {
        clearInterval(messageTimer);
        clearTimeout(advanceTimer);
      };
    }
  }, [currentScreen, painPoint, commitmentLevel]);

  // Log when Screen 4 is viewed
  useEffect(() => {
    if (currentScreen === 4) {
      logEvent('quiz_paywall_viewed', { painPoint, commitmentLevel });
    }
  }, [currentScreen, painPoint, commitmentLevel]);

  if (!isOpen) return null;

  // Close handler
  const handleClose = () => {
    // Log abandonment analytics
    logEvent('quiz_abandoned', {
      lastScreen: currentScreen,
      painPoint: painPoint || 'none',
      commitmentLevel: commitmentLevel || 'none'
    });
    
    // Save quiz answers for future personalization (if user got past Screen 1)
    if (painPoint) {
      try {
        localStorage.setItem('nhlsavant_quiz_profile', JSON.stringify({
          painPoint,
          commitmentLevel: commitmentLevel || 'unknown',
          betSize,
          completedAt: Date.now(),
          completedScreen: currentScreen
        }));
      } catch (e) {
        console.warn('Could not save quiz profile:', e);
        // Fail silently, not critical
      }
    }
    
    onClose(); // Calls parent's close handler which sets localStorage 'nhlsavant_welcome_popup_seen'
  };

  // CTA button handler
  const handleUnlock = () => {
    logEvent('quiz_cta_click', { painPoint, commitmentLevel, discountCode });
    triggerHaptic();
    onClose(); // This sets localStorage and logs close event
    navigate('/pricing');
  };

  // Pain point details
  const painPointDetails = {
    parlays: {
      issue: "Parlays that never hit",
      message: "You're losing to -EV compounding. Our model finds SINGLE BETS with real edge (avg +6.2% EV)",
      icon: "📉",
      emoji: "📉"
    },
    cappers: {
      issue: "Twitter cappers who ghost",
      message: "You're tired of capper BS. We track EVERY bet publicly - no cherry-picking, no ghosts",
      icon: "🎭",
      emoji: "🎭"
    },
    hype: {
      issue: "Betting on hype & favorites",
      message: "You're paying too much juice. We find +EV on underdogs the public fades",
      icon: "🔥",
      emoji: "🔥"
    },
    vibes: {
      issue: "No strategy - just vibes",
      message: "You need a system. Our model uses advanced analytics to find edges bookies miss",
      icon: "🤷",
      emoji: "🤷"
    }
  };

  // Commitment details
  const commitmentDetails = {
    YES: {
      message: "Smart. Our data-driven approach finds consistent +EV opportunities the market misses"
    },
    MAYBE: {
      message: `Good call. Our ${roiCounter}% ROI since Oct 2025 speaks for itself - every bet tracked publicly`
    },
    NO: {
      message: "No pressure. Take your time to see how our model beats the closing lines consistently"
    }
  };

  // Calculate dynamic stats
  const startDate = getStartDate();
  const weeks = getWeeksSinceStart();
  const dollarGrowth = calculateDollarGrowth(stats);

  // Get top 3 games for locked picks display
  const gamesWithEdges = todaysGames
    ?.filter(g => g.bestEdge && g.bestEdge.evPercent > 0)
    .sort((a, b) => b.bestEdge.evPercent - a.bestEdge.evPercent)
    .slice(0, 3) || [];

  // Visual breadcrumb progress indicator
  const ProgressDots = () => (
    <div style={{
      display: 'flex',
      gap: '0.5rem',
      justifyContent: 'center',
      marginTop: '2rem',
      marginBottom: '0.5rem'
    }}>
      {[1, 2, 3].map(screen => (
        <div
          key={screen}
          style={{
            width: screen === currentScreen ? '32px' : '8px',
            height: '8px',
            borderRadius: '4px',
            background: screen <= currentScreen 
              ? 'linear-gradient(90deg, #D4AF37, #FFD700)'
              : 'rgba(148, 163, 184, 0.3)',
            transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            boxShadow: screen === currentScreen 
              ? '0 0 12px rgba(212, 175, 55, 0.6)'
              : 'none'
          }}
        />
      ))}
    </div>
  );

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2147483647,
        padding: isMobile ? '0.5rem' : '1rem',
        animation: 'backdropFadeIn 0.3s ease-out',
        overflow: 'auto'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      onTouchStart={(e) => setTouchStart(e.targetTouches[0].clientX)}
      onTouchMove={(e) => setTouchEnd(e.targetTouches[0].clientX)}
      onTouchEnd={handleSwipe}
    >
      <div 
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '2px solid rgba(212, 175, 55, 0.3)',
          borderRadius: isMobile ? '16px' : '24px',
          padding: 0,
          maxWidth: '620px',
          width: '100%',
          maxHeight: '95vh',
          position: 'relative',
          boxShadow: `
            0 25px 50px -12px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(212, 175, 55, 0.1),
            0 8px 32px rgba(212, 175, 55, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `,
          animation: 'modalSlideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Premium Decorative Background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            linear-gradient(135deg, transparent 0%, rgba(212, 175, 55, 0.03) 50%, transparent 100%),
            radial-gradient(ellipse at top right, rgba(16, 185, 129, 0.05) 0%, transparent 40%),
            radial-gradient(ellipse at bottom left, rgba(59, 130, 246, 0.05) 0%, transparent 40%)
          `,
          pointerEvents: 'none',
          zIndex: 0
        }} />
        
        {/* Grid Pattern Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(100, 116, 139, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100, 116, 139, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
          opacity: 0.3,
          zIndex: 0
        }} />
        
        {/* Fixed Header with Buttons */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          padding: isMobile ? '1rem 1rem 0.5rem' : '1.25rem 1.5rem 0.75rem',
          flexShrink: 0
        }}>
          {/* Close Button */}
          <button
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: isMobile ? '0.75rem' : '1rem',
              right: isMobile ? '0.75rem' : '1rem',
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.6)',
              cursor: 'pointer',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.2s ease',
              zIndex: 10
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 1)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
          >
            <X size={24} strokeWidth={2} />
          </button>

          {/* Back Button (visible on screens 2-4) */}
          {currentScreen > 1 && currentScreen !== 3 && (
            <button
              onClick={() => {
                triggerHaptic();
                setCurrentScreen(currentScreen === 4 ? 2 : currentScreen - 1);
              }}
              style={{
                position: 'absolute',
                top: isMobile ? '0.75rem' : '1rem',
                left: isMobile ? '0.75rem' : '1rem',
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.6)',
                cursor: 'pointer',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.875rem',
                transition: 'color 0.2s ease',
                zIndex: 10
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 1)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
            >
              <ChevronLeft size={20} />
              Back
            </button>
          )}
        </div>

        {/* Scrollable Content Area */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          flex: 1,
          padding: isMobile ? '0 1.5rem 1.5rem' : '0 2.5rem 2.5rem',
          WebkitOverflowScrolling: 'touch'
        }}>

        {/* Screen 1: Pain Point Selection */}
        {currentScreen === 1 && (
          <div style={{ animation: 'fadeInUp 0.5s ease-out' }}>
            <div style={{
              textAlign: 'center',
              marginBottom: isMobile ? '1.5rem' : '2rem',
              marginTop: '2rem'
            }}>
              <p style={{
                fontSize: isMobile ? '0.875rem' : '1rem',
                color: 'rgba(241, 245, 249, 0.6)',
                marginBottom: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: '600'
              }}>
                Before we show you today's picks...
              </p>
              <h2 style={{
                fontSize: isMobile ? '1.5rem' : '1.75rem',
                fontWeight: '700',
                color: '#F1F5F9',
                margin: '0 0 1rem 0',
                lineHeight: '1.2'
              }}>
                What's costing you the most money in sports betting?
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { key: 'parlays', title: 'Parlays that never hit', subtitle: '(-EV compounds, house always wins)', emoji: '📉' },
                { key: 'cappers', title: 'Twitter cappers who ghost', subtitle: '(4-0 picks posted, 0-3 buried)', emoji: '🎭' },
                { key: 'hype', title: 'Betting on hype & favorites', subtitle: '(-180 \'locks\' that cost more)', emoji: '🔥' },
                { key: 'vibes', title: 'No strategy - just vibes', subtitle: '(Gut feelings, no edge)', emoji: '🤷' }
              ].map((option, idx) => (
                <button
                  key={option.key}
                  onClick={() => {
                    setPainPoint(option.key);
                    logEvent('quiz_screen_1_complete', { painPoint: option.key });
                    triggerHaptic();
                    setCurrentScreen(2);
                  }}
                  style={{
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.7) 100%)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    borderRadius: '14px',
                    padding: '1.125rem 1.5rem',
                    minHeight: '76px',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                    animation: `fadeInUp 0.5s ease-out ${idx * 0.1}s both`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.6)';
                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.01)';
                    e.currentTarget.style.boxShadow = '0 12px 28px rgba(212, 175, 55, 0.3), 0 0 32px rgba(212, 175, 55, 0.1)';
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.85) 100%)';
                    const icon = e.currentTarget.querySelector('.option-icon');
                    if (icon) {
                      icon.style.transform = 'scale(1.15) rotate(5deg)';
                      icon.style.filter = 'brightness(1.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.2)';
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.25)';
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.7) 100%)';
                    const icon = e.currentTarget.querySelector('.option-icon');
                    if (icon) {
                      icon.style.transform = 'scale(1) rotate(0deg)';
                      icon.style.filter = 'brightness(1)';
                    }
                  }}
                >
                  {/* Shimmer effect */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.1), transparent)',
                    animation: 'shimmer 3s infinite',
                    pointerEvents: 'none'
                  }} />
                  
                  <span 
                    className="option-icon"
                    style={{ 
                      fontSize: '2.5rem',
                      display: 'inline-block',
                      transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      filter: 'brightness(1)'
                    }}
                  >
                    {option.emoji}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: isMobile ? '1rem' : '1.125rem',
                      fontWeight: '600',
                      color: '#F1F5F9',
                      marginBottom: '0.25rem'
                    }}>
                      {option.title}
                    </div>
                    <div style={{
                      fontSize: isMobile ? '0.813rem' : '0.875rem',
                      color: 'rgba(241, 245, 249, 0.5)',
                      fontStyle: 'italic'
                    }}>
                      {option.subtitle}
                    </div>
                  </div>
                  <ArrowRight size={20} color="rgba(212, 175, 55, 0.6)" />
                </button>
              ))}
            </div>

            <ProgressDots />
            
            {/* Tap hint */}
            <div style={{
              textAlign: 'center',
              marginTop: '0.75rem',
              opacity: 0.4,
              fontSize: '0.75rem',
              animation: 'pulse 2s infinite'
            }}>
              👆 Tap any card to continue
            </div>
          </div>
        )}

        {/* Screen 2: Commitment Question */}
        {currentScreen === 2 && (
          <div style={{ animation: 'fadeInUp 0.5s ease-out' }}>
            <div style={{
              textAlign: 'center',
              marginBottom: isMobile ? '1.5rem' : '2rem',
              marginTop: '2rem'
            }}>
              <p style={{
                fontSize: isMobile ? '0.875rem' : '1rem',
                color: '#ff6b6b',
                marginBottom: '0.75rem',
                fontWeight: '600'
              }}>
                You're losing money to {painPointDetails[painPoint]?.issue.toLowerCase()}
              </p>
              <h2 style={{
                fontSize: isMobile ? '1.25rem' : '1.5rem',
                fontWeight: '700',
                color: '#F1F5F9',
                margin: '0 0 0.5rem 0',
                lineHeight: '1.3'
              }}>
                If we could show you a model that:
              </h2>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: '0 0 1rem 0',
                fontSize: isMobile ? '0.875rem' : '0.938rem',
                color: 'rgba(241, 245, 249, 0.8)',
                textAlign: 'left',
                maxWidth: '400px',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}>
                <li style={{ marginBottom: '0.5rem' }}>✓ Has {roiCounter}% ROI since Oct 2025</li>
                <li style={{ marginBottom: '0.5rem' }}>✓ Beats closing lines consistently</li>
                <li style={{ marginBottom: '0.5rem' }}>✓ Finds +EV the books miss</li>
                <li style={{ marginBottom: '0.5rem' }}>✓ Tracks EVERY bet publicly (no BS)</li>
              </ul>
              <p style={{
                fontSize: isMobile ? '1rem' : '1.125rem',
                color: '#F1F5F9',
                fontWeight: '600',
                margin: 0
              }}>
                What are you looking for?
              </p>
            </div>

            {/* Confidence meter */}
            <div style={{
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
                fontSize: '0.75rem',
                opacity: 0.6
              }}>
                <span>🐌 Cautious</span>
                <span>🚀 Confident</span>
              </div>
              <div style={{
                height: '4px',
                background: 'linear-gradient(90deg, #EF4444, #F59E0B, #10B981)',
                borderRadius: '2px',
                opacity: 0.3
              }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { key: 'YES', text: 'Show me how it works', betSize: 'smart', color: 'green', badge: 'Recommended' },
                { key: 'MAYBE', text: 'I need to see the proof first', betSize: 'proof', color: 'blue', badge: null },
                { key: 'NO', text: 'Just exploring for now', betSize: 'exploring', color: 'gray', badge: null }
              ].map((option, idx) => {
                const colorStyles = {
                  green: {
                    border: '2px solid rgba(16, 185, 129, 0.5)',
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.08))',
                    boxShadow: '0 4px 16px rgba(16, 185, 129, 0.25)',
                    hoverBorder: 'rgba(16, 185, 129, 0.7)',
                    hoverShadow: '0 12px 28px rgba(16, 185, 129, 0.35)'
                  },
                  blue: {
                    border: '2px solid rgba(59, 130, 246, 0.4)',
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05))',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
                    hoverBorder: 'rgba(59, 130, 246, 0.6)',
                    hoverShadow: '0 12px 24px rgba(59, 130, 246, 0.3)'
                  },
                  gray: {
                    border: '1px solid rgba(148, 163, 184, 0.25)',
                    background: 'rgba(30, 41, 59, 0.5)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                    hoverBorder: 'rgba(212, 175, 55, 0.4)',
                    hoverShadow: '0 12px 24px rgba(212, 175, 55, 0.2)',
                    opacity: 0.85
                  }
                };
                
                const style = colorStyles[option.color];
                
                return (
                  <button
                    key={option.key}
                    onClick={() => {
                      setCommitmentLevel(option.key);
                      setBetSize(option.betSize);
                      logEvent('quiz_screen_2_complete', { painPoint, commitmentLevel: option.key });
                      triggerHaptic();
                      setCurrentScreen(3);
                    }}
                    style={{
                      background: style.background,
                      backdropFilter: 'blur(12px)',
                      border: style.border,
                      borderRadius: '14px',
                      padding: '1.125rem 1.5rem',
                      minHeight: '64px',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      fontSize: isMobile ? '1rem' : '1.125rem',
                      fontWeight: '700',
                      color: '#F1F5F9',
                      boxShadow: style.boxShadow,
                      letterSpacing: '0.01em',
                      position: 'relative',
                      opacity: style.opacity || 1,
                      animation: `fadeInUp 0.5s ease-out ${idx * 0.1}s both`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = style.hoverBorder;
                      e.currentTarget.style.transform = 'translateY(-4px) scale(1.01)';
                      e.currentTarget.style.boxShadow = style.hoverShadow;
                      e.currentTarget.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = style.border.split('solid ')[1];
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = style.boxShadow;
                      e.currentTarget.style.opacity = style.opacity || '1';
                    }}
                  >
                    {option.badge && (
                      <div style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '12px',
                        background: 'linear-gradient(135deg, #10B981, #059669)',
                        color: 'white',
                        fontSize: '0.625rem',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontWeight: '600',
                        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        {option.badge}
                      </div>
                    )}
                    {option.text}
                  </button>
                );
              })}
            </div>

            <ProgressDots />
          </div>
        )}

        {/* Screen 3: Loading Animation */}
        {currentScreen === 3 && (
          <div style={{ animation: 'fadeInUp 0.5s ease-out', textAlign: 'center', padding: '3rem 0' }}>
            {/* Animated rotating icon */}
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 2rem',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'pulse 1.5s infinite, rotate 3s linear infinite',
              boxShadow: '0 0 40px rgba(212, 175, 55, 0.6)'
            }}>
              <TrendingUp size={40} color="rgba(15, 23, 42, 0.9)" strokeWidth={3} />
            </div>

            <h2 style={{
              fontSize: isMobile ? '1.5rem' : '1.75rem',
              fontWeight: '700',
              color: '#F1F5F9',
              margin: '0 0 0.5rem 0'
            }}>
              {loadingMessage}
            </h2>

            {/* Checkmarks for completed steps */}
            <div style={{ 
              minHeight: '80px',
              fontSize: '0.875rem', 
              color: 'rgba(241, 245, 249, 0.7)',
              marginBottom: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              alignItems: 'center'
            }}>
              {loadingProgress >= 25 && <div style={{ animation: 'fadeInUp 0.3s ease-out' }}>✓ Games scanned</div>}
              {loadingProgress >= 50 && <div style={{ animation: 'fadeInUp 0.3s ease-out' }}>✓ +EV calculated</div>}
              {loadingProgress >= 75 && <div style={{ animation: 'fadeInUp 0.3s ease-out' }}>✓ Profile matched</div>}
              {loadingProgress === 100 && <div style={{ animation: 'fadeInUp 0.3s ease-out' }}>✓ Dashboard ready</div>}
            </div>

            {/* Multi-segment progress bar */}
            <div style={{
              width: '100%',
              height: '8px',
              background: 'rgba(148, 163, 184, 0.2)',
              borderRadius: '4px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                width: `${loadingProgress}%`,
                background: 'linear-gradient(90deg, #10B981 0%, #D4AF37 50%, #FFD700 100%)',
                borderRadius: '4px',
                transition: 'width 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
                boxShadow: loadingProgress > 75 ? '0 0 20px rgba(212, 175, 55, 0.6)' : '0 0 20px rgba(16, 185, 129, 0.4)'
              }}>
                {/* Shimmer effect that moves across */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                  animation: 'shimmerMove 1.5s infinite'
                }} />
              </div>
            </div>

            <ProgressDots />
          </div>
        )}

        {/* Screen 4: Personalized Paywall */}
        {currentScreen === 4 && (
          <div style={{ animation: 'fadeInUp 0.5s ease-out' }}>
            {/* Header */}
            <div style={{
              textAlign: 'center',
              marginBottom: isMobile ? '0.875rem' : '1.5rem',
              marginTop: isMobile ? '0.875rem' : '1.5rem'
            }}>
              <p style={{
                fontSize: isMobile ? '0.688rem' : '0.813rem',
                color: 'rgba(212, 175, 55, 0.8)',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontWeight: '700'
              }}>
                Your Personalized Betting Profile
              </p>
            </div>

            {/* LAYER 1: Hero Stats - Eye-catching ROI */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(212, 175, 55, 0.15))',
              border: '2px solid rgba(212, 175, 55, 0.4)',
              borderRadius: isMobile ? '12px' : '16px',
              padding: isMobile ? '1rem' : '1.5rem',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(212, 175, 55, 0.2)',
              marginBottom: isMobile ? '0.875rem' : '1.25rem'
            }}>
              {/* Animated background pattern */}
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `
                  radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
                  radial-gradient(circle at 80% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)
                `,
                animation: 'pulse 4s infinite',
                pointerEvents: 'none'
              }} />
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  fontSize: isMobile ? '2.25rem' : '3rem',
                  fontWeight: '700',
                  color: '#10B981',
                  textShadow: '0 0 20px rgba(16, 185, 129, 0.5)',
                  animation: 'countUp 2s ease-out'
                }}>
                  +{roiCounter}%
                </div>
                <div style={{
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                  color: 'rgba(241, 245, 249, 0.8)',
                  marginTop: '0.375rem'
                }}>
                  ROI since Oct 2025 • {aPlusBetCount} bets tracked
                </div>
              </div>
            </div>

            {/* LAYER 2: Personalized Profile (Colored box) */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05))',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderLeft: '4px solid #EF4444',
              borderRadius: isMobile ? '10px' : '12px',
              padding: isMobile ? '0.875rem' : '1.25rem',
              fontSize: isMobile ? '0.813rem' : '0.875rem',
              marginBottom: isMobile ? '0.875rem' : '1.25rem'
            }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', flexShrink: 0 }}>❌</div>
                <div style={{ color: 'rgba(241, 245, 249, 0.9)', lineHeight: '1.6' }}>
                  <strong>You're like thousands of bettors losing to:</strong>
                  <br />"{painPointDetails[painPoint]?.issue}"
                  <div style={{ marginTop: '0.5rem', color: 'rgba(241, 245, 249, 0.7)' }}>
                    {painPointDetails[painPoint]?.message}
                  </div>
                </div>
              </div>
            </div>

            {/* Today's Picks Preview (if available) */}
            {gamesWithEdges.length > 0 && (
              <div style={{ marginBottom: isMobile ? '0.75rem' : '1.25rem' }}>
                <h3 style={{
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                  fontWeight: '700',
                  color: '#F1F5F9',
                  marginBottom: isMobile ? '0.5rem' : '0.75rem',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  🔒 Today's Top Picks Locked
                </h3>
                {gamesWithEdges.slice(0, 2).map((game, idx) => {
                  const bestEdge = game.bestEdge;
                  
                  return (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(30, 41, 59, 0.6)',
                        border: '1px solid rgba(212, 175, 55, 0.25)',
                        borderRadius: isMobile ? '8px' : '10px',
                        padding: isMobile ? '0.625rem' : '0.75rem',
                        position: 'relative',
                        overflow: 'hidden',
                        marginBottom: isMobile ? '0.5rem' : '0.625rem'
                      }}
                    >
                      {/* Game Info */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.5rem',
                        position: 'relative',
                        zIndex: 1
                      }}>
                        <span style={{
                          fontSize: isMobile ? '0.75rem' : '0.813rem',
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontWeight: '600'
                        }}>
                          {game.awayTeam} @ {game.homeTeam}
                        </span>
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
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.375rem'
                      }}>
                        <Lock size={isMobile ? 24 : 28} color="#D4AF37" style={{ animation: 'lockPulse 2s ease-in-out infinite' }} />
                        <div style={{
                          fontSize: isMobile ? '0.75rem' : '0.813rem',
                          color: '#D4AF37',
                          fontWeight: '700'
                        }}>
                          {idx === 0 ? 'A+ PLAY' : 'A PLAY'}
                        </div>
                        <div style={{
                          fontSize: isMobile ? '0.938rem' : '1rem',
                          color: '#10B981',
                          fontWeight: '800'
                        }}>
                          +{bestEdge.evPercent.toFixed(1)}% EV
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* LAYER 3: Spin Wheel (Contained card) */}
            <div style={{
              background: 'rgba(30, 41, 59, 0.6)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              borderRadius: isMobile ? '10px' : '12px',
              padding: isMobile ? '0.875rem' : '1.25rem',
              textAlign: 'center',
              marginBottom: isMobile ? '0.75rem' : '1.25rem'
            }}>
              <h4 style={{
                fontSize: isMobile ? '0.75rem' : '0.875rem',
                fontWeight: '600',
                color: '#D4AF37',
                marginBottom: isMobile ? '0.75rem' : '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                🎁 Spin for Your Discount
              </h4>
              <DiscountLottery onCodeRevealed={(code) => setDiscountCode(code)} />
            </div>

            {/* LAYER 4: CTA (Massive, impossible to miss) */}
            <button
              onClick={handleUnlock}
              style={{
                width: '100%',
                padding: isMobile ? '1rem 1.5rem' : '1.25rem 2rem',
                fontSize: isMobile ? '1rem' : '1.25rem',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%)',
                backgroundSize: '200% 100%',
                border: '3px solid rgba(212, 175, 55, 0.8)',
                borderRadius: '16px',
                color: 'rgba(15, 23, 42, 0.95)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: `
                  0 8px 24px rgba(212, 175, 55, 0.4),
                  0 0 0 1px rgba(212, 175, 55, 0.2),
                  inset 0 1px 0 rgba(255, 255, 255, 0.3)
                `,
                animation: 'glow 2s infinite',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                letterSpacing: '0.02em'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                e.currentTarget.style.boxShadow = `
                  0 12px 32px rgba(212, 175, 55, 0.6),
                  0 0 40px rgba(212, 175, 55, 0.3)
                `;
                e.currentTarget.style.backgroundPosition = '100% 0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = `
                  0 8px 24px rgba(212, 175, 55, 0.4),
                  0 0 0 1px rgba(212, 175, 55, 0.2),
                  inset 0 1px 0 rgba(255, 255, 255, 0.3)
                `;
                e.currentTarget.style.backgroundPosition = '0% 0';
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {discountCode ? `Claim ${discountCode} Discount` : 'Start 7-Day Free Trial'}
                <ArrowRight size={isMobile ? 20 : 24} strokeWidth={3} style={{ animation: 'slideRight 1s infinite' }} />
              </span>
            </button>

            <p style={{
              fontSize: isMobile ? '0.75rem' : '0.813rem',
              color: 'rgba(255, 255, 255, 0.5)',
              textAlign: 'center',
              marginTop: isMobile ? '0.5rem' : '0.75rem',
              marginBottom: 0
            }}>
              Less than 1 coffee/day (87¢/day) • 7-day free trial • Cancel anytime
            </p>
          </div>
        )}
        </div>
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
        
        @keyframes lockPulse {
          0%, 100% { 
            transform: scale(1); 
            opacity: 0.6;
            filter: drop-shadow(0 0 8px rgba(212, 175, 55, 0.4));
          }
          50% { 
            transform: scale(1.1); 
            opacity: 1;
            filter: drop-shadow(0 0 16px rgba(212, 175, 55, 0.6));
          }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
        
        @keyframes shimmerMove {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes slideRight {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }
        
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 8px 24px rgba(212, 175, 55, 0.4);
          }
          50% {
            box-shadow: 0 8px 32px rgba(212, 175, 55, 0.6), 0 0 20px rgba(212, 175, 55, 0.3);
          }
        }
        
        @keyframes countUp {
          from { 
            opacity: 0; 
            transform: translateY(20px);
          }
          to { 
            opacity: 1; 
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default QuizFunnelModal;
