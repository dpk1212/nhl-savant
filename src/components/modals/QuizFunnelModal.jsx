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

  // Analytics helper
  const logEvent = (eventName, params = {}) => {
    if (analytics) {
      firebaseLogEvent(analytics, eventName, params);
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
      message: `Perfect. At ${betSize} units, today's picks = $29 expected value`
    },
    MAYBE: {
      message: "Smart. Here's our 31% ROI tracked since Oct 2025"
    },
    NO: {
      message: `No problem. Even at ${betSize} units, +EV compounds fast. Start small, scale up.`
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
              onClick={() => setCurrentScreen(currentScreen === 4 ? 2 : currentScreen - 1)}
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
                What's costing you the most money in NHL betting?
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { key: 'parlays', title: 'Parlays that never hit', subtitle: '(-EV compounds, house always wins)', emoji: '📉' },
                { key: 'cappers', title: 'Twitter cappers who ghost', subtitle: '(4-0 picks posted, 0-3 buried)', emoji: '🎭' },
                { key: 'hype', title: 'Betting on hype & favorites', subtitle: '(-180 \'locks\' that cost more)', emoji: '🔥' },
                { key: 'vibes', title: 'No strategy - just vibes', subtitle: '(Gut feelings, no edge)', emoji: '🤷' }
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => {
                    setPainPoint(option.key);
                    logEvent('quiz_screen_1_complete', { painPoint: option.key });
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
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.6)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(212, 175, 55, 0.25), 0 0 32px rgba(212, 175, 55, 0.1)';
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.85) 100%)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.2)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.25)';
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.7) 100%)';
                  }}
                >
                  <span style={{ fontSize: '2rem' }}>{option.emoji}</span>
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

            {/* Progress */}
            <div style={{
              textAlign: 'center',
              marginTop: '1.5rem',
              fontSize: '0.75rem',
              color: 'rgba(241, 245, 249, 0.4)'
            }}>
              1 of 3
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
                <li style={{ marginBottom: '0.5rem' }}>✓ Has 31% ROI since Oct 2025</li>
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
                Would you bet $100/game on it TODAY?
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { key: 'YES', text: 'YES - Show me the picks', betSize: '$100' },
                { key: 'MAYBE', text: 'MAYBE - I need to see proof', betSize: '$100' },
                { key: 'NO', text: 'NO - I only bet $10-25/game', betSize: '$10-25' }
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => {
                    setCommitmentLevel(option.key);
                    setBetSize(option.betSize);
                    logEvent('quiz_screen_2_complete', { painPoint, commitmentLevel: option.key });
                    setCurrentScreen(3);
                  }}
                  style={{
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.7) 100%)',
                    backdropFilter: 'blur(12px)',
                    border: '2px solid rgba(212, 175, 55, 0.25)',
                    borderRadius: '14px',
                    padding: '1.125rem 1.5rem',
                    minHeight: '64px',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    fontSize: isMobile ? '1rem' : '1.125rem',
                    fontWeight: '700',
                    color: '#F1F5F9',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                    letterSpacing: '0.01em'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.6)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(212, 175, 55, 0.25), 0 0 32px rgba(212, 175, 55, 0.1)';
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.85) 100%)';
                    e.currentTarget.style.color = '#D4AF37';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.25)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.25)';
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.7) 100%)';
                    e.currentTarget.style.color = '#F1F5F9';
                  }}
                >
                  {option.text}
                </button>
              ))}
            </div>

            {/* Progress */}
            <div style={{
              textAlign: 'center',
              marginTop: '1.5rem',
              fontSize: '0.75rem',
              color: 'rgba(241, 245, 249, 0.4)'
            }}>
              2 of 3
            </div>
          </div>
        )}

        {/* Screen 3: Loading Animation */}
        {currentScreen === 3 && (
          <div style={{ animation: 'fadeInUp 0.5s ease-out', textAlign: 'center', padding: '3rem 0' }}>
            <h2 style={{
              fontSize: isMobile ? '1.5rem' : '1.75rem',
              fontWeight: '700',
              color: '#F1F5F9',
              margin: '0 0 2rem 0'
            }}>
              Analyzing your profile...
            </h2>

            {/* Progress Bar */}
            <div style={{
              width: '100%',
              height: '6px',
              background: 'rgba(148, 163, 184, 0.2)',
              borderRadius: '100px',
              overflow: 'hidden',
              marginBottom: '2rem'
            }}>
              <div style={{
                width: `${loadingProgress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #D4AF37, #FFD700)',
                transition: 'width 0.7s ease',
                borderRadius: '100px'
              }} />
            </div>

            {/* Loading Messages */}
            <div style={{
              minHeight: '120px',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              alignItems: 'flex-start',
              maxWidth: '400px',
              margin: '0 auto'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: isMobile ? '0.938rem' : '1rem',
                color: '#F1F5F9',
                fontWeight: '500'
              }}>
                <span style={{
                  color: '#D4AF37',
                  fontSize: '1.25rem',
                  animation: 'pulse 1s ease-in-out infinite'
                }}>
                  ⚡
                </span>
                {loadingMessage}
              </div>
            </div>

            {/* Progress */}
            <div style={{
              textAlign: 'center',
              marginTop: '3rem',
              fontSize: '0.75rem',
              color: 'rgba(241, 245, 249, 0.4)'
            }}>
              3 of 3
            </div>
          </div>
        )}

        {/* Screen 4: Personalized Paywall */}
        {currentScreen === 4 && (
          <div style={{ animation: 'fadeInUp 0.5s ease-out' }}>
            {/* Header */}
            <div style={{
              textAlign: 'center',
              marginBottom: isMobile ? '1.5rem' : '2rem',
              marginTop: '1.5rem'
            }}>
              <p style={{
                fontSize: isMobile ? '0.75rem' : '0.813rem',
                color: 'rgba(212, 175, 55, 0.8)',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontWeight: '700'
              }}>
                Your Personalized Betting Profile
              </p>
              <h2 style={{
                fontSize: isMobile ? '1.125rem' : '1.25rem',
                fontWeight: '700',
                color: '#F1F5F9',
                margin: '0 0 1.5rem 0',
                lineHeight: '1.3'
              }}>
                You're like 1,247 other bettors who:
              </h2>
              
              {/* Profile Summary */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(239, 68, 68, 0.08) 100%)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 107, 107, 0.35)',
                borderRadius: '12px',
                padding: '1.125rem',
                marginBottom: '1rem',
                textAlign: 'left',
                boxShadow: '0 4px 12px rgba(255, 107, 107, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{
                  fontSize: isMobile ? '0.875rem' : '0.938rem',
                  color: 'rgba(241, 245, 249, 0.9)',
                  lineHeight: '1.6'
                }}>
                  <div style={{ marginBottom: '0.5rem' }}>❌ Lose money to <strong>{painPointDetails[painPoint]?.issue.toLowerCase()}</strong></div>
                  <div style={{ marginBottom: '0.5rem' }}>💰 Want to bet <strong>{betSize}/game</strong></div>
                  <div>📈 Need a <strong>proven, trackable system</strong></div>
                </div>
              </div>

              {/* Personalized Message */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.08) 100%)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: '12px',
                padding: '1.125rem',
                textAlign: 'left',
                marginBottom: '1.5rem',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}>
                <p style={{
                  fontSize: isMobile ? '0.875rem' : '0.938rem',
                  color: '#10B981',
                  margin: '0 0 0.5rem 0',
                  fontWeight: '600'
                }}>
                  {painPointDetails[painPoint]?.message}
                </p>
                <p style={{
                  fontSize: isMobile ? '0.875rem' : '0.938rem',
                  color: 'rgba(241, 245, 249, 0.8)',
                  margin: 0
                }}>
                  {commitmentDetails[commitmentLevel]?.message}
                </p>
              </div>
            </div>

            {/* Today's Picks Preview */}
            {gamesWithEdges.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{
                  fontSize: isMobile ? '1rem' : '1.125rem',
                  fontWeight: '700',
                  color: '#F1F5F9',
                  marginBottom: '1rem',
                  textAlign: 'center'
                }}>
                  HERE'S WHAT YOU GET TODAY:
                </h3>
                {gamesWithEdges.map((game, idx) => {
                  const bestEdge = game.bestEdge;
                  const isTopPick = idx === 0;
                  
                  return (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(30, 41, 59, 0.6)',
                        border: '1px solid rgba(212, 175, 55, 0.3)',
                        borderRadius: '10px',
                        padding: isMobile ? '0.875rem' : '1rem',
                        position: 'relative',
                        overflow: 'hidden',
                        marginBottom: '0.75rem'
                      }}
                    >
                      {/* Game Info */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.625rem'
                      }}>
                        <span style={{
                          fontSize: isMobile ? '0.813rem' : '0.875rem',
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontWeight: '600'
                        }}>
                          {game.awayTeam} @ {game.homeTeam}
                        </span>
                        {isTopPick && (
                          <span style={{
                            fontSize: '0.75rem',
                            color: '#D4AF37',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}>
                            🏆 A+ PLAY
                          </span>
                        )}
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
                        gap: '0.5rem'
                      }}>
                        <Lock size={isMobile ? 28 : 32} color="#D4AF37" style={{ animation: 'lockPulse 2s ease-in-out infinite' }} />
                        <div style={{
                          fontSize: isMobile ? '0.813rem' : '0.875rem',
                          color: '#D4AF37',
                          fontWeight: '700'
                        }}>
                          {isTopPick ? 'A+ PLAY LOCKED' : 'A PLAY LOCKED'}
                        </div>
                        <div style={{
                          fontSize: isMobile ? '1rem' : '1.125rem',
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

            {/* Track Record */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(37, 99, 235, 0.08) 100%)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              borderRadius: '12px',
              padding: '1.125rem',
              marginBottom: '1.5rem',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{
                fontSize: isMobile ? '0.75rem' : '0.813rem',
                color: 'rgba(241, 245, 249, 0.6)',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: '600'
              }}>
                TRACK RECORD FOR BETTORS LIKE YOU:
              </div>
              <div style={{ fontSize: isMobile ? '0.875rem' : '0.938rem', color: 'rgba(241, 245, 249, 0.9)', lineHeight: '1.6' }}>
                <div style={{ marginBottom: '0.375rem' }}>📊 A+ Plays: <strong style={{ color: '#10B981' }}>+{aPlusROI.toFixed(1)}% ROI</strong> ({aPlusBetCount} tracked)</div>
                <div>💸 Overall: <strong style={{ color: '#10B981' }}>{roiCounter}% ROI</strong> since {startDate}</div>
              </div>
            </div>

            {/* Discount Lottery */}
            <div style={{ marginBottom: '1.5rem' }}>
              <DiscountLottery onCodeRevealed={(code) => setDiscountCode(code)} />
            </div>

            {/* CTA Button */}
            <button
              onClick={handleUnlock}
              style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%)',
                border: '2px solid rgba(212, 175, 55, 0.8)',
                borderRadius: '14px',
                padding: isMobile ? '1.125rem 1.75rem' : '1.25rem 2rem',
                color: '#0a0e1a',
                fontSize: isMobile ? '1.0625rem' : '1.1875rem',
                fontWeight: '800',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                width: '100%',
                boxShadow: `
                  0 8px 24px rgba(212, 175, 55, 0.4),
                  0 0 0 1px rgba(212, 175, 55, 0.2),
                  inset 0 1px 0 rgba(255, 255, 255, 0.3)
                `,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                minHeight: '56px',
                position: 'relative',
                overflow: 'hidden',
                letterSpacing: '0.02em',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `
                  0 12px 36px rgba(212, 175, 55, 0.5),
                  0 0 48px rgba(212, 175, 55, 0.3),
                  0 0 0 1px rgba(212, 175, 55, 0.4),
                  inset 0 1px 0 rgba(255, 255, 255, 0.4)
                `;
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.01)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = `
                  0 8px 24px rgba(212, 175, 55, 0.4),
                  0 0 0 1px rgba(212, 175, 55, 0.2),
                  inset 0 1px 0 rgba(255, 255, 255, 0.3)
                `;
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
              }}
            >
              <ArrowRight size={isMobile ? 18 : 20} strokeWidth={3} />
              <span>{discountCode ? `Claim ${discountCode} Discount` : 'Start 7-Day Free Trial'}</span>
            </button>

            <p style={{
              fontSize: isMobile ? '0.813rem' : '0.875rem',
              color: 'rgba(255, 255, 255, 0.5)',
              textAlign: 'center',
              marginTop: isMobile ? '0.75rem' : '1rem',
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
        
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(212, 175, 55, 0.2);
          }
          50% {
            box-shadow: 0 0 40px rgba(212, 175, 55, 0.4);
          }
        }
      `}</style>
    </div>
  );
};

export default QuizFunnelModal;

