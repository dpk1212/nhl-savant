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
  
  // Loading animation state
  const [loadingMessage, setLoadingMessage] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Swipe gesture state
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Celebration modal state (for post-CTA wheel)
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);

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
      // Fetch ALL performance stats (EXACT SAME as Performance Dashboard)
      getPerformanceStats().then(perfStats => {
        console.log('📊 Quiz Funnel - Using Dashboard Stats:', perfStats);
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

  // CTA button handler - Show celebration modal first
  const handleUnlock = () => {
    logEvent('quiz_cta_click', { painPoint, commitmentLevel });
    triggerHaptic();
    setShowCelebrationModal(true);
  };

  // Handle spin completion - Navigate to pricing after discount revealed
  const handleSpinComplete = (code) => {
    setDiscountCode(code);
    logEvent('quiz_discount_revealed', { code, painPoint, commitmentLevel });
    
    // Wait 4 seconds to show the code, then navigate
    setTimeout(() => {
      onClose();
      navigate('/pricing');
    }, 4000);
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
            {/* Header - Ultra Compact */}
            <div style={{
              textAlign: 'center',
              marginBottom: isMobile ? '0.5rem' : '1.5rem',
              marginTop: isMobile ? '0.375rem' : '1.5rem'
            }}>
              <p style={{
                fontSize: isMobile ? '0.75rem' : '0.938rem',
                background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #F4C430 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                fontWeight: '800',
                textShadow: '0 0 30px rgba(212, 175, 55, 0.3)'
              }}>
                Your Personalized Profile
              </p>
            </div>

            {/* LAYER 1: Hero Stats - ULTRA PREMIUM (COMPRESSED) */}
            <div style={{
              position: 'relative',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(212, 175, 55, 0.15), rgba(16, 185, 129, 0.08))',
              backdropFilter: 'blur(24px) saturate(200%)',
              WebkitBackdropFilter: 'blur(24px) saturate(200%)',
              border: '3px solid transparent',
              backgroundImage: `
                linear-gradient(rgba(17, 24, 39, 0.8), rgba(17, 24, 39, 0.8)),
                linear-gradient(135deg, #D4AF37, #10B981, #D4AF37)
              `,
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
              borderRadius: isMobile ? '14px' : '18px',
              padding: isMobile ? '0.75rem' : '1.375rem',
              textAlign: 'center',
              overflow: 'hidden',
              boxShadow: `
                0 0 0 1px rgba(212, 175, 55, 0.1),
                0 8px 32px rgba(212, 175, 55, 0.25),
                0 16px 64px rgba(16, 185, 129, 0.15),
                inset 0 1px 0 rgba(255, 255, 255, 0.15),
                inset 0 -1px 0 rgba(0, 0, 0, 0.2)
              `,
              marginBottom: isMobile ? '0.625rem' : '1rem'
            }}>
              {/* Animated shimmer overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: `
                  linear-gradient(110deg, 
                    transparent 20%, 
                    rgba(212, 175, 55, 0.08) 40%, 
                    rgba(16, 185, 129, 0.08) 50%,
                    rgba(212, 175, 55, 0.08) 60%, 
                    transparent 80%
                  )
                `,
                backgroundSize: '200% 100%',
                animation: 'shimmerMove 3s linear infinite',
                pointerEvents: 'none'
              }} />
              
              {/* Radial glow background */}
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `
                  radial-gradient(circle at 30% 50%, rgba(16, 185, 129, 0.12) 0%, transparent 50%),
                  radial-gradient(circle at 70% 50%, rgba(212, 175, 55, 0.12) 0%, transparent 50%)
                `,
                animation: 'pulse 4s ease-in-out infinite',
                pointerEvents: 'none'
              }} />
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  fontSize: isMobile ? '2.125rem' : '3rem',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #10B981 0%, #34D399 50%, #10B981 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 24px rgba(16, 185, 129, 0.6))',
                  animation: 'countUp 2s ease-out',
                  lineHeight: 1,
                  letterSpacing: '-0.02em'
                }}>
                  +{roiCounter}%
                </div>
                <div style={{
                  fontSize: isMobile ? '0.688rem' : '0.813rem',
                  color: 'rgba(241, 245, 249, 0.85)',
                  marginTop: isMobile ? '0.313rem' : '0.438rem',
                  fontWeight: '600',
                  letterSpacing: '0.02em'
                }}>
                  ROI since Oct 2025 • <span style={{ color: '#D4AF37' }}>{stats?.moneylineBets || 0} bets</span>
                </div>
              </div>
            </div>

            {/* LAYER 2: Personalized Profile - PREMIUM RED (COMPRESSED) */}
            <div style={{
              position: 'relative',
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(220, 38, 38, 0.08), rgba(239, 68, 68, 0.06))',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderLeft: '4px solid #EF4444',
              borderRadius: isMobile ? '10px' : '12px',
              padding: isMobile ? '0.625rem' : '0.875rem',
              fontSize: isMobile ? '0.75rem' : '0.875rem',
              marginBottom: isMobile ? '0.625rem' : '0.875rem',
              boxShadow: `
                0 4px 20px rgba(239, 68, 68, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.1),
                inset 0 -1px 0 rgba(0, 0, 0, 0.1)
              `,
              overflow: 'hidden'
            }}>
              {/* Subtle gradient overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at 80% 20%, rgba(239, 68, 68, 0.08) 0%, transparent 50%)',
                pointerEvents: 'none'
              }} />
              
              <div style={{ 
                display: 'flex', 
                gap: isMobile ? '0.5rem' : '0.75rem', 
                alignItems: 'flex-start',
                position: 'relative',
                zIndex: 1
              }}>
                <div style={{ 
                  fontSize: isMobile ? '1.25rem' : '1.625rem', 
                  flexShrink: 0, 
                  lineHeight: 1,
                  filter: 'drop-shadow(0 2px 8px rgba(239, 68, 68, 0.4))'
                }}>❌</div>
                <div style={{ color: 'rgba(241, 245, 249, 0.95)', lineHeight: isMobile ? 1.4 : 1.6 }}>
                  <strong style={{ 
                    fontSize: isMobile ? '0.813rem' : '0.938rem',
                    color: '#FCA5A5',
                    display: 'block',
                    marginBottom: '0.188rem'
                  }}>
                    Losing to:
                  </strong>
                  <div style={{ 
                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                    color: 'rgba(241, 245, 249, 0.9)'
                  }}>
                    "{painPointDetails[painPoint]?.issue}"
                  </div>
                  <div style={{ 
                    marginTop: isMobile ? '0.313rem' : '0.438rem', 
                    color: 'rgba(241, 245, 249, 0.7)',
                    fontSize: isMobile ? '0.688rem' : '0.813rem',
                    fontStyle: 'italic'
                  }}>
                    {painPointDetails[painPoint]?.message}
                  </div>
                </div>
              </div>
            </div>

            {/* PRESCRIPTION: Why they lose + How we fix it - PREMIUM GREEN (COMPRESSED) */}
            <div style={{
              position: 'relative',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(5, 150, 105, 0.08), rgba(16, 185, 129, 0.06))',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              borderLeft: '4px solid #10B981',
              borderRadius: isMobile ? '10px' : '12px',
              padding: isMobile ? '0.625rem' : '0.875rem',
              fontSize: isMobile ? '0.75rem' : '0.875rem',
              marginBottom: isMobile ? '0.625rem' : '0.875rem',
              boxShadow: `
                0 4px 20px rgba(16, 185, 129, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.1),
                inset 0 -1px 0 rgba(0, 0, 0, 0.1)
              `,
              overflow: 'hidden'
            }}>
              {/* Glow overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at 20% 30%, rgba(16, 185, 129, 0.12) 0%, transparent 60%)',
                pointerEvents: 'none'
              }} />
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ 
                  marginBottom: isMobile ? '0.438rem' : '0.563rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{ 
                    fontSize: isMobile ? '1.25rem' : '1.5rem',
                    filter: 'drop-shadow(0 2px 8px rgba(16, 185, 129, 0.4))',
                    lineHeight: 1
                  }}>✅</span>
                  <strong style={{ 
                    color: '#34D399', 
                    fontSize: isMobile ? '0.813rem' : '0.938rem',
                    fontWeight: '700',
                    letterSpacing: '0.01em'
                  }}>
                    Your Fix:
                  </strong>
                </div>
                
                <div style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: isMobile ? '0.438rem' : '0.563rem'
                }}>
                  {/* Problem Box */}
                  <div style={{
                    padding: isMobile ? '0.5rem' : '0.625rem',
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(220, 38, 38, 0.08))',
                    borderLeft: '3px solid #EF4444',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem'
                  }}>
                    <span style={{ 
                      fontSize: isMobile ? '1.063rem' : '1.25rem', 
                      flexShrink: 0,
                      filter: 'drop-shadow(0 2px 4px rgba(239, 68, 68, 0.3))',
                      lineHeight: 1
                    }}>❌</span>
                    <div style={{ flex: 1 }}>
                      <strong style={{ 
                        color: '#FCA5A5',
                        fontSize: isMobile ? '0.75rem' : '0.875rem',
                        display: 'block',
                        marginBottom: '0.188rem'
                      }}>
                        {painPoint === 'parlays' && 'Parlay trap'}
                        {painPoint === 'cappers' && 'Fake cappers'}
                        {painPoint === 'hype' && 'Public hype'}
                        {painPoint === 'vibes' && 'Gut feelings'}
                      </strong>
                      <span style={{ 
                        fontSize: isMobile ? '0.688rem' : '0.813rem',
                        color: 'rgba(241, 245, 249, 0.8)',
                        lineHeight: 1.4
                      }}>
                        {painPoint === 'parlays' && '6-leg @ -110 each = 1.5% win, -18% EV'}
                        {painPoint === 'cappers' && 'Post 4-0, hide 0-3 = Cherry-picked BS'}
                        {painPoint === 'hype' && '-180 favorites = 64.3% implied, often -EV'}
                        {painPoint === 'vibes' && '50/50 coin flip, house edge always wins'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Solution Box */}
                  <div style={{
                    padding: isMobile ? '0.5rem' : '0.625rem',
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(5, 150, 105, 0.08))',
                    borderLeft: '3px solid #10B981',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem'
                  }}>
                    <span style={{ 
                      fontSize: isMobile ? '1.063rem' : '1.25rem', 
                      flexShrink: 0,
                      filter: 'drop-shadow(0 2px 4px rgba(16, 185, 129, 0.3))',
                      lineHeight: 1
                    }}>✅</span>
                    <div style={{ flex: 1 }}>
                      <strong style={{ 
                        color: '#34D399',
                        fontSize: isMobile ? '0.75rem' : '0.875rem',
                        display: 'block',
                        marginBottom: '0.188rem'
                      }}>
                        {painPoint === 'parlays' && 'Smart singles'}
                        {painPoint === 'cappers' && 'Full transparency'}
                        {painPoint === 'hype' && '+EV underdogs'}
                        {painPoint === 'vibes' && 'Data-driven edge'}
                      </strong>
                      <span style={{ 
                        fontSize: isMobile ? '0.688rem' : '0.813rem',
                        color: 'rgba(241, 245, 249, 0.8)',
                        lineHeight: 1.4
                      }}>
                        {painPoint === 'parlays' && 'Single +4-6% EV bets = Consistent profit'}
                        {painPoint === 'cappers' && `All ${stats?.totalBets || 153} bets tracked publicly`}
                        {painPoint === 'hype' && 'Find undervalued underdogs market misses'}
                        {painPoint === 'vibes' && '70/30 MoneyPuck blend + EV filtering'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* URGENCY LINE - If games available */}
            {gamesWithEdges.length > 0 && (
              <div style={{
                textAlign: 'center',
                fontSize: isMobile ? '0.813rem' : '0.938rem',
                color: '#D4AF37',
                fontWeight: '600',
                marginBottom: isMobile ? '0.5rem' : '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: isMobile ? '1.125rem' : '1.25rem' }}>🏒</span>
                Tonight's picks are ready — unlock to see
              </div>
            )}

            {/* CTA - MEGA PREMIUM GOLD (MOVED UP) */}
            <button
              onClick={handleUnlock}
              style={{
                width: '100%',
                padding: isMobile ? '0.75rem 1.25rem' : '1rem 1.75rem',
                fontSize: isMobile ? '0.938rem' : '1.188rem',
                fontWeight: '900',
                background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 25%, #FFF4B0 50%, #FFD700 75%, #D4AF37 100%)',
                backgroundSize: '300% 100%',
                border: '3px solid rgba(212, 175, 55, 0.8)',
                borderRadius: isMobile ? '12px' : '16px',
                color: 'rgba(15, 23, 42, 1)',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: `
                  0 6px 24px rgba(212, 175, 55, 0.4),
                  0 0 0 1px rgba(212, 175, 55, 0.2),
                  inset 0 2px 0 rgba(255, 255, 255, 0.4),
                  inset 0 -2px 0 rgba(0, 0, 0, 0.1)
                `,
                animation: 'glow 2s ease-in-out infinite',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: isMobile ? '0.5rem' : '0.75rem',
                letterSpacing: '0.02em',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                marginBottom: isMobile ? '0.75rem' : '1rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `
                  0 12px 40px rgba(212, 175, 55, 0.6),
                  0 0 0 1px rgba(212, 175, 55, 0.3),
                  inset 0 2px 0 rgba(255, 255, 255, 0.5),
                  inset 0 -2px 0 rgba(0, 0, 0, 0.1)
                `;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `
                  0 6px 24px rgba(212, 175, 55, 0.4),
                  0 0 0 1px rgba(212, 175, 55, 0.2),
                  inset 0 2px 0 rgba(255, 255, 255, 0.4),
                  inset 0 -2px 0 rgba(0, 0, 0, 0.1)
                `;
              }}
            >
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(110deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%)',
                backgroundSize: '200% 100%',
                animation: 'shimmerMove 3s linear infinite'
              }} />
              <span style={{ position: 'relative', zIndex: 1 }}>
                Start 7-Day Free Trial
              </span>
              <span style={{ 
                position: 'relative', 
                zIndex: 1,
                fontSize: isMobile ? '1.125rem' : '1.375rem',
                animation: 'bounce 2s infinite'
              }}>→</span>
            </button>

            {/* Pricing Anchor */}
            <div style={{
              textAlign: 'center',
              fontSize: isMobile ? '0.688rem' : '0.813rem',
              color: 'rgba(212, 175, 55, 0.75)',
              marginBottom: isMobile ? '0.75rem' : '1rem',
              fontWeight: '600',
              lineHeight: 1.5
            }}>
              {isMobile ? (
                <>Less than 1 coffee/day (87¢/day) • Cancel anytime</>
              ) : (
                <>Less than 1 coffee/day (87¢/day) • 7-day free trial • Cancel anytime</>
              )}
            </div>

            {/* TODAY'S REAL VALUE - ULTRA PREMIUM GOLD (COMPRESSED) */}
            {gamesWithEdges.length > 0 && (
              <div style={{
                position: 'relative',
                marginBottom: isMobile ? '0.625rem' : '0.875rem',
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08), rgba(255, 215, 0, 0.06), rgba(212, 175, 55, 0.04))',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                borderRadius: isMobile ? '10px' : '12px',
                padding: isMobile ? '0.625rem' : '0.875rem',
                boxShadow: `
                  0 4px 24px rgba(212, 175, 55, 0.2),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1),
                  inset 0 -1px 0 rgba(0, 0, 0, 0.1)
                `,
                overflow: 'hidden'
              }}>
                {/* Shimmer effect */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(110deg, 
                    transparent 30%, 
                    rgba(212, 175, 55, 0.06) 50%, 
                    transparent 70%
                  )`,
                  backgroundSize: '200% 100%',
                  animation: 'shimmerMove 4s linear infinite',
                  pointerEvents: 'none'
                }} />
                
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <h3 style={{
                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                    fontWeight: '800',
                    background: 'linear-gradient(135deg, #D4AF37, #FFD700, #D4AF37)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginBottom: isMobile ? '0.5rem' : '0.625rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.438rem'
                  }}>
                    <span style={{ filter: 'grayscale(0)', fontSize: isMobile ? '1rem' : '1.125rem' }}>📊</span> Today's Available Plays
                  </h3>
                  
                  {gamesWithEdges.slice(0, isMobile ? 2 : 3).map((game, idx) => {
                    const edge = game.bestEdge;
                    const isAPLus = edge.qualityGrade === 'A+';
                    return (
                      <div key={idx} style={{
                        padding: isMobile ? '0.5rem' : '0.625rem',
                        marginBottom: idx < (isMobile ? 1 : 2) ? (isMobile ? '0.438rem' : '0.563rem') : 0,
                        background: isAPLus 
                          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.08))'
                          : 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(255, 215, 0, 0.08))',
                        borderRadius: '10px',
                        borderLeft: `4px solid ${isAPLus ? '#10B981' : '#D4AF37'}`,
                        boxShadow: isAPLus
                          ? '0 2px 12px rgba(16, 185, 129, 0.15)'
                          : '0 2px 12px rgba(212, 175, 55, 0.15)'
                      }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '0.313rem'
                        }}>
                          <span style={{
                            fontSize: isMobile ? '0.75rem' : '0.875rem',
                            fontWeight: '700',
                            color: '#F1F5F9',
                            letterSpacing: '0.01em'
                          }}>
                            {game.awayTeam} @ {game.homeTeam}
                          </span>
                          <span style={{
                            fontSize: isMobile ? '0.625rem' : '0.75rem',
                            padding: '0.25rem 0.5rem',
                            background: isAPLus 
                              ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(5, 150, 105, 0.2))'
                              : 'linear-gradient(135deg, rgba(212, 175, 55, 0.25), rgba(255, 215, 0, 0.2))',
                            color: isAPLus ? '#34D399' : '#FFD700',
                            borderRadius: '6px',
                            fontWeight: '800',
                            letterSpacing: '0.02em',
                            border: `1px solid ${isAPLus ? 'rgba(16, 185, 129, 0.3)' : 'rgba(212, 175, 55, 0.3)'}`,
                            boxShadow: isAPLus
                              ? '0 2px 8px rgba(16, 185, 129, 0.2)'
                              : '0 2px 8px rgba(212, 175, 55, 0.2)'
                          }}>
                            {edge.qualityGrade}
                          </span>
                        </div>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: isMobile ? '0.625rem' : '0.75rem',
                          color: 'rgba(241, 245, 249, 0.75)',
                          gap: '0.5rem',
                          fontWeight: '500'
                        }}>
                          <span>Model: <strong style={{ color: 'rgba(241, 245, 249, 0.95)' }}>{edge.modelProb ? (edge.modelProb * 100).toFixed(1) : '--'}%</strong></span>
                          <span>Odds: <strong style={{ color: 'rgba(241, 245, 249, 0.95)' }}>{edge.odds > 0 ? '+' : ''}{edge.odds}</strong></span>
                          <span style={{ 
                            color: '#34D399', 
                            fontWeight: '700',
                            textShadow: '0 0 10px rgba(16, 185, 129, 0.4)'
                          }}>
                            +{edge.evPercent.toFixed(1)}% EV
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  
                  <p style={{
                    fontSize: isMobile ? '0.625rem' : '0.688rem',
                    color: 'rgba(212, 175, 55, 0.7)',
                    marginTop: isMobile ? '0.438rem' : '0.563rem',
                    marginBottom: 0,
                    textAlign: 'center',
                    fontStyle: 'italic',
                    fontWeight: '500'
                  }}>
                    Real odds. Real edge. Verify yourself.
                  </p>
                </div>
              </div>
            )}

            {/* METHODOLOGY - PREMIUM BLUE (COMPRESSED) */}
            <div style={{
              position: 'relative',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(37, 99, 235, 0.06))',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: isMobile ? '10px' : '12px',
              padding: isMobile ? '0.625rem' : '0.875rem',
              marginBottom: isMobile ? '0.625rem' : '0.875rem',
              boxShadow: `
                0 4px 20px rgba(59, 130, 246, 0.15),
                inset 0 1px 0 rgba(255, 255, 255, 0.1),
                inset 0 -1px 0 rgba(0, 0, 0, 0.1)
              `,
              overflow: 'hidden'
            }}>
              {/* Glow */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.08) 0%, transparent 60%)',
                pointerEvents: 'none'
              }} />
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h4 style={{
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                  fontWeight: '800',
                  color: '#60A5FA',
                  marginBottom: isMobile ? '0.5rem' : '0.625rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{ fontSize: isMobile ? '1.125rem' : '1.25rem' }}>🔬</span> How We Find Edge
                </h4>
                <div style={{
                  fontSize: isMobile ? '0.688rem' : '0.813rem',
                  color: 'rgba(241, 245, 249, 0.85)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: isMobile ? '0.313rem' : '0.438rem',
                  fontWeight: '500'
                }}>
                  {[
                    { icon: '📊', text: 'Ensemble model finds 2.5%+ edge minimum' },
                    { icon: '💎', text: 'Quality grades A+ through C by confidence' },
                    { icon: '⭐', text: 'Average pick: +6.2% EV vs market' }
                  ].map((item, idx) => (
                    <div key={idx} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      padding: isMobile ? '0.313rem 0.438rem' : '0.375rem 0.5rem',
                      background: 'rgba(59, 130, 246, 0.08)',
                      borderRadius: '6px',
                      borderLeft: '2px solid rgba(96, 165, 250, 0.4)'
                    }}>
                      <span style={{ fontSize: isMobile ? '0.938rem' : '1rem' }}>{item.icon}</span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* HONEST RISK DISCLOSURE - PREMIUM AMBER (COMPRESSED) */}
            <div style={{
              position: 'relative',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(217, 119, 6, 0.08))',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '2px solid rgba(245, 158, 11, 0.4)',
              borderRadius: isMobile ? '8px' : '10px',
              padding: isMobile ? '0.5rem 0.625rem' : '0.625rem 0.75rem',
              marginBottom: 0,
              fontSize: isMobile ? '0.688rem' : '0.813rem',
              color: 'rgba(241, 245, 249, 0.9)',
              lineHeight: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              boxShadow: `
                0 4px 20px rgba(245, 158, 11, 0.25),
                inset 0 1px 0 rgba(255, 255, 255, 0.1)
              `,
              overflow: 'hidden'
            }}>
              {/* Pulsing glow */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.08) 0%, transparent 70%)',
                animation: 'pulse 3s ease-in-out infinite',
                pointerEvents: 'none'
              }} />
              
              <span style={{ 
                fontSize: isMobile ? '1.375rem' : '1.625rem',
                flexShrink: 0,
                filter: 'drop-shadow(0 2px 8px rgba(245, 158, 11, 0.5))',
                position: 'relative',
                zIndex: 1,
                lineHeight: 1
              }}>
                ⚠️
              </span>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <strong style={{ 
                  color: '#FDE047', 
                  marginRight: '0.25rem',
                  fontSize: 'inherit',
                  fontWeight: '700'
                }}>
                  You can still lose.
                </strong>
                <span style={{ fontWeight: '500' }}>
                  Even with +{roiCounter}% ROI, streaks happen. Test it 7 days.
                </span>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Celebration Modal with Discount Wheel - Shows AFTER CTA click */}
      {showCelebrationModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.92)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2147483648,
            padding: isMobile ? '1rem' : '2rem',
            animation: 'backdropFadeIn 0.3s ease-out'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowCelebrationModal(false);
            }
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '2px solid rgba(212, 175, 55, 0.4)',
              borderRadius: isMobile ? '16px' : '24px',
              padding: isMobile ? '2rem 1.5rem' : '3rem 2.5rem',
              maxWidth: '500px',
              width: '100%',
              textAlign: 'center',
              position: 'relative',
              boxShadow: `
                0 25px 50px -12px rgba(0, 0, 0, 0.6),
                0 0 0 1px rgba(212, 175, 55, 0.2),
                0 8px 32px rgba(212, 175, 55, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.1)
              `,
              animation: 'modalSlideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{
              fontSize: isMobile ? '1.5rem' : '2rem',
              fontWeight: '700',
              color: '#F1F5F9',
              marginBottom: '1rem',
              lineHeight: 1.2
            }}>
              🎉 Welcome to NHL Savant!
            </h2>
            
            <p style={{
              fontSize: isMobile ? '0.938rem' : '1.125rem',
              color: 'rgba(241, 245, 249, 0.8)',
              marginBottom: '2rem',
              lineHeight: 1.5
            }}>
              Spin the wheel for your exclusive discount
            </p>

            <DiscountLottery onCodeRevealed={handleSpinComplete} />

            {discountCode && (
              <div style={{
                marginTop: '2rem',
                padding: '1rem',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(212, 175, 55, 0.15))',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                borderRadius: '12px',
                animation: 'fadeInUp 0.5s ease-out'
              }}>
                <div style={{
                  fontSize: isMobile ? '1.125rem' : '1.25rem',
                  fontWeight: '700',
                  color: '#10B981',
                  marginBottom: '0.5rem'
                }}>
                  {discountCode} Applied!
                </div>
                <div style={{
                  fontSize: isMobile ? '0.813rem' : '0.875rem',
                  color: 'rgba(241, 245, 249, 0.8)'
                }}>
                  Redirecting to pricing...
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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
