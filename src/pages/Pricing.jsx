import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Crown, Zap, Target, TrendingUp, Shield, Gift, X, Copy, Clock, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import { useCombinedStats } from '../hooks/useCombinedStats';
import { redirectToCheckout } from '../utils/stripe';
import { analytics, logEvent as firebaseLogEvent } from '../firebase/config';
import AuthModal from '../components/AuthModal';
import DiscountLottery from '../components/DiscountLottery';

// Prize definitions for calculating discounts
const PRIZES = [
  { code: 'Savant15', discount: 15 },
  { code: 'MVP25', discount: 25 },
  { code: 'NHL40', discount: 40 },
  { code: 'BANG55', discount: 55 }
];

// Wrapper for analytics logging
const logEvent = (eventName, params) => {
  if (analytics) {
    firebaseLogEvent(analytics, eventName, params);
  }
};

const Pricing = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { tier: currentTier, isPremium } = useSubscription(user);
  const { stats: combinedStats, loading: statsLoading } = useCombinedStats();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);
  const [showSpinModal, setShowSpinModal] = useState(false);
  const [spinsRemaining, setSpinsRemaining] = useState(2);
  const [activeDiscount, setActiveDiscount] = useState(null); // { code, discount, timeLeft }
  const [copied, setCopied] = useState(false);

  // Load spins remaining and check for active discount on mount
  useEffect(() => {
    const loadSpins = async () => {
      try {
        const { getDailySpins, checkAndResetDaily } = await import('../utils/spinTracker');
        checkAndResetDaily();
        const spinsData = await getDailySpins(user?.uid || null);
        setSpinsRemaining(spinsData.remaining);
      } catch (error) {
        console.error('Error loading spins:', error);
      }
    };
    loadSpins();

    // Check for existing discount in localStorage
    const checkExistingDiscount = () => {
      const stored = localStorage.getItem('nhl_savant_discount_spin');
      if (stored) {
        const data = JSON.parse(stored);
        const expiresAt = new Date(data.expiresAt);
        if (expiresAt > new Date()) {
          const timeLeft = Math.floor((expiresAt - new Date()) / 1000);
          setActiveDiscount({
            code: data.prize.code,
            discount: data.prize.discount,
            timeLeft
          });
        }
      }
    };
    checkExistingDiscount();
  }, [user]);

  // Countdown timer for active discount
  useEffect(() => {
    if (!activeDiscount || activeDiscount.timeLeft <= 0) return;

    const timer = setInterval(() => {
      setActiveDiscount(prev => {
        if (!prev || prev.timeLeft <= 1) {
          localStorage.removeItem('nhl_savant_discount_spin');
          return null;
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeDiscount?.code]);

  const handleSpinComplete = async (prizeCode) => {
    try {
      const { recordSpin } = await import('../utils/spinTracker');
      await recordSpin(user?.uid || null, prizeCode);
      setSpinsRemaining(prev => Math.max(0, prev - 1));
      
      // Find the prize details and set active discount
      const prize = PRIZES.find(p => p.code === prizeCode);
      if (prize) {
        setActiveDiscount({
          code: prize.code,
          discount: prize.discount,
          timeLeft: 600 // 10 minutes
        });
      }
      
      logEvent('pricing_spin_used', {
        code: prizeCode,
        spins_remaining: spinsRemaining - 1
      });
    } catch (error) {
      console.error('Error recording spin:', error);
    }
  };

  const handleCopyCode = async () => {
    if (activeDiscount?.code) {
      try {
        await navigator.clipboard.writeText(activeDiscount.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        logEvent('discount_code_copied', { code: activeDiscount.code });
      } catch (err) {
        console.error('Failed to copy code:', err);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate discounted price
  const getDiscountedPrice = (originalPrice, discount) => {
    const price = parseFloat(originalPrice.replace('$', ''));
    const discounted = price * (1 - discount / 100);
    return `$${discounted.toFixed(2)}`;
  };

  const handleSelectPlan = (tier) => {
    logEvent('pricing_page_click', { tier });
    
    if (!user) {
      // User needs to sign in first
      setSelectedTier(tier);
      setAuthModalOpen(true);
      return;
    }

    // Redirect to Stripe checkout
    redirectToCheckout(tier, user);
  };

  // All tiers get the same features - only commitment level differs
  const universalFeatures = [
    'All daily +EV picks with quality grades',
    'Advanced ensemble prediction model',
    'Live win probability tracking',
    'Expert AI analysis & insights',
    'Complete performance & ROI dashboard',
    'Top scorers & player trends',
    'Direct email support',
    'Full model transparency'
  ];

  const tiers = [
    {
      id: 'scout',
      name: 'Scout',
      icon: Target,
      price: '$7.99',
      period: 'week',
      trial: '5-day free trial',
      description: 'Test drive, no commitment',
      priceAnchor: 'Less than 1 Starbucks/day',
      pricePerDay: '$1.14/day',
      cta: 'Start 5-Day Trial',
      highlight: 'Week-to-week flexibility'
    },
    {
      id: 'elite',
      name: 'Elite',
      icon: Zap,
      price: '$25.99',
      period: 'month',
      trial: '7-day free trial',
      description: 'Best value for monthly',
      popular: true,
      priceAnchor: 'Less than 1 coffee/day',
      pricePerDay: '87¢/day',
      savings: 'Save $9/month vs weekly',
      cta: 'Start 7-Day Trial',
      highlight: 'Perfect for serious bettors'
    },
    {
      id: 'pro',
      name: 'SAVANT PRO',
      icon: Crown,
      price: '$150',
      period: 'year',
      trial: '10-day free trial',
      description: 'Maximum savings',
      priceAnchor: 'Less than 1 pizza/month',
      pricePerDay: '41¢/day',
      savings: 'Save $161.88/year',
      badge: 'Just $12.50/month',
      cta: 'Start 10-Day Trial',
      highlight: 'Season-long edge'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0A0E27 0%, #1A1F3A 50%, #0A0E27 100%)',
      padding: window.innerWidth < 640 ? '2rem 1rem' : '4rem 1.5rem',
      paddingTop: window.innerWidth < 640 ? '1.5rem' : '2rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: window.innerWidth < 640 ? '3rem' : '4rem' }}>
          <h1 style={{
            fontSize: window.innerWidth < 640 ? '1.875rem' : '3rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: '0 0 1rem 0',
            letterSpacing: '-0.02em',
            lineHeight: '1.1'
          }}>
            Stop Losing to Parlays.<br />
            Start Betting With Real Edge.
          </h1>
          <p style={{
            fontSize: window.innerWidth < 640 ? '1rem' : '1.25rem',
            color: 'rgba(241, 245, 249, 0.8)',
            maxWidth: '700px',
            margin: '0 auto 2rem auto',
            lineHeight: '1.6',
            padding: window.innerWidth < 640 ? '0 0.5rem' : '0'
          }}>
            Premium tools to find +EV, avoid -EV, and hold cappers accountable.
            <br />Cancel anytime.
          </p>
          
          {/* Trust Indicators */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: window.innerWidth < 640 ? '1rem' : '2rem',
            marginTop: '2rem',
            padding: window.innerWidth < 640 ? '0 0.5rem' : '0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={window.innerWidth < 640 ? 18 : 20} color="#10B981" />
              <span style={{ 
                color: '#10B981', 
                fontWeight: '600', 
                fontSize: window.innerWidth < 640 ? '0.813rem' : '0.938rem' 
              }}>
                {statsLoading ? (
                  'Loading performance...'
                ) : (
                  `NHL: ${combinedStats.nhl.roi >= 0 ? '+' : ''}${combinedStats.nhl.roi.toFixed(1)}% ROI | CBB: ${combinedStats.cbb.roi >= 0 ? '+' : ''}${combinedStats.cbb.roi.toFixed(1)}% ROI`
                )}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={window.innerWidth < 640 ? 18 : 20} color="#D4AF37" />
              <span style={{ 
                color: '#D4AF37', 
                fontWeight: '600', 
                fontSize: window.innerWidth < 640 ? '0.813rem' : '0.938rem' 
              }}>
                Tracked Since Oct 2025
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={window.innerWidth < 640 ? 18 : 20} color="#60A5FA" />
              <span style={{ 
                color: '#60A5FA', 
                fontWeight: '600', 
                fontSize: window.innerWidth < 640 ? '0.813rem' : '0.938rem' 
              }}>
                Free Trial Included
              </span>
            </div>
          </div>
        </div>

        {/* Spin for Discount Section - Show for non-premium users */}
        {!isPremium && (spinsRemaining > 0 || activeDiscount) && (
          <div style={{
            background: activeDiscount 
              ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(212, 175, 55, 0.15) 100%)'
              : 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
            border: activeDiscount 
              ? '2px solid rgba(16, 185, 129, 0.5)'
              : '2px solid rgba(212, 175, 55, 0.4)',
            borderRadius: '16px',
            padding: window.innerWidth < 640 ? '1.5rem' : '2rem',
            marginBottom: '3rem',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Animated shimmer */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: activeDiscount 
                ? 'linear-gradient(90deg, transparent, #10B981, transparent)'
                : 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
              animation: 'shimmer 2s ease-in-out infinite'
            }} />
            
            {/* Show active discount code */}
            {activeDiscount ? (
              <>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.75rem'
                }}>
                  <Sparkles size={24} color="#10B981" />
                  <h3 style={{
                    fontSize: window.innerWidth < 640 ? '1.25rem' : '1.5rem',
                    fontWeight: '800',
                    background: 'linear-gradient(135deg, #10B981 0%, #D4AF37 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    margin: 0
                  }}>
                    🎉 You Won {activeDiscount.discount}% Off!
                  </h3>
                </div>
                
                <p style={{
                  fontSize: window.innerWidth < 640 ? '0.938rem' : '1rem',
                  color: 'rgba(241, 245, 249, 0.8)',
                  marginBottom: '1rem',
                  lineHeight: '1.5'
                }}>
                  Use your discount code at checkout to save!
                </p>
                
                {/* Promo Code Display */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  marginBottom: '1rem'
                }}>
                  <span style={{
                    fontSize: '0.75rem',
                    color: '#94A3B8',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    CODE:
                  </span>
                  <span style={{
                    fontSize: window.innerWidth < 640 ? '1.25rem' : '1.5rem',
                    fontWeight: '800',
                    color: '#10B981',
                    fontFamily: 'monospace',
                    letterSpacing: '0.1em'
                  }}>
                    {activeDiscount.code}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    style={{
                      background: copied ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                      border: copied ? '1px solid #10B981' : '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s',
                      color: copied ? '#10B981' : '#F1F5F9',
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}
                    onMouseEnter={(e) => {
                      if (!copied) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!copied) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                      }
                    }}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                
                {/* Countdown */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  fontSize: '0.938rem',
                  color: '#F59E0B',
                  fontWeight: '700'
                }}>
                  <Clock size={18} />
                  <span>Expires in {formatTime(activeDiscount.timeLeft)}</span>
                </div>
                
                {/* Spin again if spins remaining */}
                {spinsRemaining > 0 && (
                  <button
                    onClick={() => {
                      logEvent('pricing_spin_again_click', { spins_remaining: spinsRemaining });
                      setShowSpinModal(true);
                    }}
                    style={{
                      marginTop: '1rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: 'rgba(212, 175, 55, 0.2)',
                      border: '1px solid rgba(212, 175, 55, 0.4)',
                      borderRadius: '8px',
                      padding: '0.5rem 1rem',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#D4AF37',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(212, 175, 55, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(212, 175, 55, 0.2)';
                    }}
                  >
                    🎲 Spin Again ({spinsRemaining} left) - Try for a bigger discount!
                  </button>
                )}
              </>
            ) : (
              <>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.75rem'
                }}>
                  <Gift size={24} color="#D4AF37" />
                  <h3 style={{
                    fontSize: window.innerWidth < 640 ? '1.25rem' : '1.5rem',
                    fontWeight: '800',
                    background: 'linear-gradient(135deg, #D4AF37 0%, #F59E0B 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    margin: 0
                  }}>
                    🎰 Spin for an Exclusive Discount!
                  </h3>
                </div>
                
                <p style={{
                  fontSize: window.innerWidth < 640 ? '0.938rem' : '1rem',
                  color: 'rgba(241, 245, 249, 0.8)',
                  marginBottom: '1rem',
                  lineHeight: '1.5'
                }}>
                  Try your luck! Win up to 55% off your subscription.
                </p>
                
                <button
                  onClick={() => {
                    logEvent('pricing_spin_button_click', { spins_remaining: spinsRemaining });
                    setShowSpinModal(true);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: window.innerWidth < 640 ? '0.875rem 1.5rem' : '1rem 2rem',
                    fontSize: window.innerWidth < 640 ? '1rem' : '1.125rem',
                    fontWeight: '700',
                    color: '#0A0E27',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 14px rgba(212, 175, 55, 0.4)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(212, 175, 55, 0.4)';
                  }}
                >
                  🎲 Spin the Wheel ({spinsRemaining} {spinsRemaining === 1 ? 'spin' : 'spins'} left)
                </button>
                
                <p style={{
                  fontSize: '0.813rem',
                  color: 'rgba(241, 245, 249, 0.5)',
                  marginTop: '0.75rem'
                }}>
                  {spinsRemaining} spins remaining today • Codes expire in 10 minutes
                </p>
              </>
            )}
            
            <style>{`
              @keyframes shimmer {
                0%, 100% { opacity: 0.3; }
                50% { opacity: 1; }
              }
            `}</style>
          </div>
        )}

        {/* Pricing Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: window.innerWidth < 640 ? '2rem' : '2.5rem',
            fontWeight: '700',
            color: '#F1F5F9',
            marginBottom: '0.75rem'
          }}>
            Choose Your Commitment Level
          </h2>
          <p style={{
            fontSize: window.innerWidth < 640 ? '1rem' : '1.125rem',
            color: 'rgba(241, 245, 249, 0.7)',
            maxWidth: '600px',
            margin: '0 auto 0.5rem auto',
            lineHeight: '1.6'
          }}>
            Every plan includes everything. Save more with longer commitments.
          </p>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(212, 175, 55, 0.1)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '100px',
            padding: '0.5rem 1rem',
            fontSize: window.innerWidth < 640 ? '0.813rem' : '0.875rem',
            color: '#D4AF37',
            fontWeight: '600'
          }}>
            <Shield size={16} />
            Cancel anytime • No hidden fees • Instant access
          </div>
        </div>

        {/* Tier Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth < 640 
            ? '1fr' 
            : window.innerWidth < 1024 
              ? 'repeat(auto-fit, minmax(280px, 1fr))' 
              : 'repeat(3, 1fr)',
          gap: window.innerWidth < 640 ? '1.5rem' : '2rem',
          marginBottom: '4rem',
          maxWidth: window.innerWidth < 640 ? '480px' : 'none',
          margin: window.innerWidth < 640 ? '0 auto 4rem auto' : '0 0 4rem 0'
        }}>
          {tiers.map((tierInfo) => {
            const Icon = tierInfo.icon;
            const isCurrentTier = currentTier === tierInfo.id;
            
            return (
              <div
                key={tierInfo.id}
                style={{
                  background: tierInfo.popular 
                    ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)'
                    : 'rgba(30, 41, 59, 0.6)',
                  backdropFilter: 'blur(20px)',
                  border: tierInfo.popular 
                    ? '2px solid rgba(212, 175, 55, 0.5)'
                    : '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: window.innerWidth < 640 ? '16px' : '20px',
                  padding: window.innerWidth < 640 ? '1.75rem' : '2.5rem',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  transform: window.innerWidth < 640 
                    ? 'scale(1)' 
                    : tierInfo.popular ? 'scale(1.05)' : 'scale(1)'
                }}
                onMouseEnter={(e) => {
                  if (window.innerWidth >= 640) {
                    e.currentTarget.style.transform = tierInfo.popular ? 'scale(1.08)' : 'scale(1.03)';
                    e.currentTarget.style.borderColor = tierInfo.popular ? 'rgba(212, 175, 55, 0.7)' : 'rgba(148, 163, 184, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (window.innerWidth >= 640) {
                    e.currentTarget.style.transform = tierInfo.popular ? 'scale(1.05)' : 'scale(1)';
                    e.currentTarget.style.borderColor = tierInfo.popular ? 'rgba(212, 175, 55, 0.5)' : 'rgba(148, 163, 184, 0.2)';
                  }
                }}
              >
                {/* Popular Badge */}
                {tierInfo.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '-14px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)',
                    color: '#0A0E27',
                    padding: '0.5rem 1.5rem',
                    borderRadius: '100px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    boxShadow: '0 4px 14px rgba(212, 175, 55, 0.4)'
                  }}>
                    Most Popular
                  </div>
                )}

                {/* Savings Badge */}
                {tierInfo.savings && (
                  <div style={{
                    position: 'absolute',
                    top: '1.5rem',
                    right: '1.5rem',
                    background: 'rgba(16, 185, 129, 0.2)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    color: '#10B981',
                    padding: '0.375rem 0.875rem',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {tierInfo.savings}
                  </div>
                )}

                {/* Current Tier Badge */}
                {isCurrentTier && isPremium && (
                  <div style={{
                    position: 'absolute',
                    top: '1.5rem',
                    right: '1.5rem',
                    background: 'rgba(59, 130, 246, 0.2)',
                    border: '1px solid rgba(59, 130, 246, 0.4)',
                    color: '#60A5FA',
                    padding: '0.375rem 0.875rem',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    Current Plan
                  </div>
                )}

                {/* Icon */}
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  background: tierInfo.popular 
                    ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(255, 215, 0, 0.2) 100%)'
                    : 'rgba(59, 130, 246, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <Icon size={28} color={tierInfo.popular ? '#D4AF37' : '#60A5FA'} strokeWidth={2} />
                </div>

                {/* Tier Name */}
                <h2 style={{
                  fontSize: '1.75rem',
                  fontWeight: '700',
                  color: '#F1F5F9',
                  marginBottom: '0.5rem'
                }}>
                  {tierInfo.name}
                </h2>

                {/* Description */}
                <p style={{
                  fontSize: '0.938rem',
                  color: 'rgba(241, 245, 249, 0.7)',
                  marginBottom: '1.5rem'
                }}>
                  {tierInfo.description}
                </p>

                {/* Price */}
                <div style={{ marginBottom: '1rem' }}>
                  {activeDiscount ? (
                    <>
                      {/* Original price crossed out */}
                      <span style={{
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        color: 'rgba(241, 245, 249, 0.4)',
                        textDecoration: 'line-through',
                        marginRight: '0.75rem'
                      }}>
                        {tierInfo.price}
                      </span>
                      {/* Discounted price */}
                      <span style={{
                        fontSize: '3rem',
                        fontWeight: '800',
                        color: '#10B981',
                        lineHeight: '1'
                      }}>
                        {getDiscountedPrice(tierInfo.price, activeDiscount.discount)}
                      </span>
                    </>
                  ) : (
                    <span style={{
                      fontSize: '3rem',
                      fontWeight: '800',
                      color: tierInfo.popular ? '#D4AF37' : '#F1F5F9',
                      lineHeight: '1'
                    }}>
                      {tierInfo.price}
                    </span>
                  )}
                  <span style={{
                    fontSize: '1.125rem',
                    color: 'rgba(241, 245, 249, 0.6)',
                    marginLeft: '0.5rem'
                  }}>
                    /{tierInfo.period}
                  </span>
                  
                  {/* Discount badge */}
                  {activeDiscount && (
                    <div style={{
                      display: 'inline-block',
                      background: 'rgba(16, 185, 129, 0.2)',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      marginLeft: '0.75rem',
                      fontSize: '0.875rem',
                      fontWeight: '700',
                      color: '#10B981'
                    }}>
                      {activeDiscount.discount}% OFF
                    </div>
                  )}
                </div>

                {/* Trial */}
                <div style={{
                  fontSize: '0.938rem',
                  color: '#10B981',
                  fontWeight: '600',
                  marginBottom: '1rem'
                }}>
                  ✨ {tierInfo.trial}
                </div>

                {/* Price Anchor */}
                <div style={{
                  fontSize: '0.875rem',
                  color: 'rgba(241, 245, 249, 0.6)',
                  fontStyle: 'italic',
                  marginBottom: '0.5rem'
                }}>
                  💭 {tierInfo.priceAnchor}
                </div>
                
                {/* Price Per Day */}
                <div style={{
                  fontSize: '1.125rem',
                  color: activeDiscount ? '#10B981' : (tierInfo.popular ? '#D4AF37' : '#60A5FA'),
                  fontWeight: '700',
                  marginBottom: tierInfo.badge ? '0.5rem' : '2rem'
                }}>
                  {activeDiscount ? (
                    <>
                      <span style={{
                        textDecoration: 'line-through',
                        color: 'rgba(241, 245, 249, 0.4)',
                        marginRight: '0.5rem',
                        fontSize: '0.938rem'
                      }}>
                        {tierInfo.pricePerDay}
                      </span>
                      {/* Calculate discounted daily price */}
                      {(() => {
                        const dailyPrice = parseFloat(tierInfo.pricePerDay.replace(/[^0-9.]/g, ''));
                        const discounted = dailyPrice * (1 - activeDiscount.discount / 100);
                        return tierInfo.pricePerDay.includes('¢') 
                          ? `${Math.round(discounted)}¢/day`
                          : `$${discounted.toFixed(2)}/day`;
                      })()}
                    </>
                  ) : (
                    tierInfo.pricePerDay
                  )}
                  {tierInfo.savings && !activeDiscount && (
                    <span style={{
                      fontSize: '0.813rem',
                      color: '#10B981',
                      marginLeft: '0.5rem',
                      fontWeight: '600'
                    }}>
                      • {tierInfo.savings}
                    </span>
                  )}
                </div>

                {/* Badge (for Pro tier) */}
                {tierInfo.badge && (
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#10B981',
                    fontWeight: '600',
                    marginBottom: '1.5rem'
                  }}>
                    {tierInfo.badge}
                  </div>
                )}

                {/* Highlight */}
                <div style={{
                  background: tierInfo.popular 
                    ? 'rgba(212, 175, 55, 0.1)' 
                    : 'rgba(59, 130, 246, 0.08)',
                  border: `1px solid ${tierInfo.popular ? 'rgba(212, 175, 55, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`,
                  borderRadius: '8px',
                  padding: '0.75rem',
                  marginBottom: '1.5rem',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '0.875rem',
                    color: tierInfo.popular ? '#D4AF37' : '#60A5FA',
                    fontWeight: '600'
                  }}>
                    ⚡ {tierInfo.highlight}
                  </div>
                </div>

                {/* Features - All Plans Include */}
                <div style={{
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'rgba(241, 245, 249, 0.5)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontWeight: '600',
                    marginBottom: '0.75rem',
                    textAlign: 'center'
                  }}>
                    Everything Included:
                  </div>
                  {universalFeatures.map((feature, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.625rem',
                      marginBottom: '0.625rem'
                    }}>
                      <Check 
                        size={16} 
                        color={tierInfo.popular ? '#D4AF37' : '#60A5FA'} 
                        strokeWidth={3} 
                        style={{ flexShrink: 0, marginTop: '2px' }} 
                      />
                      <span style={{
                        fontSize: window.innerWidth < 640 ? '0.813rem' : '0.875rem',
                        color: 'rgba(241, 245, 249, 0.85)',
                        lineHeight: '1.4'
                      }}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleSelectPlan(tierInfo.id)}
                  disabled={isCurrentTier && isPremium}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: tierInfo.popular
                      ? 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%)'
                      : isCurrentTier && isPremium
                      ? 'rgba(148, 163, 184, 0.2)'
                      : 'rgba(59, 130, 246, 0.2)',
                    border: tierInfo.popular 
                      ? 'none' 
                      : isCurrentTier && isPremium
                      ? '1px solid rgba(148, 163, 184, 0.3)'
                      : '1px solid rgba(59, 130, 246, 0.4)',
                    borderRadius: '12px',
                    color: tierInfo.popular ? '#0A0E27' : isCurrentTier && isPremium ? 'rgba(241, 245, 249, 0.5)' : '#60A5FA',
                    fontSize: '1rem',
                    fontWeight: '700',
                    cursor: isCurrentTier && isPremium ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: tierInfo.popular ? '0 4px 14px rgba(212, 175, 55, 0.3)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isCurrentTier || !isPremium) {
                      if (tierInfo.popular) {
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.5)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      } else {
                        e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)';
                      }
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isCurrentTier || !isPremium) {
                      if (tierInfo.popular) {
                        e.currentTarget.style.boxShadow = '0 4px 14px rgba(212, 175, 55, 0.3)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      } else {
                        e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
                      }
                    }
                  }}
                >
                  {isCurrentTier && isPremium ? 'Current Plan' : tierInfo.cta}
                </button>
              </div>
            );
          })}
        </div>

        {/* Value Props */}
        <div style={{
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 auto 3rem auto'
        }}>
          <h3 style={{
            fontSize: '1.75rem',
            fontWeight: '700',
            color: '#F1F5F9',
            marginBottom: '1.5rem'
          }}>
            Why NHL Savant?
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2rem',
            textAlign: 'left'
          }}>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
              <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#F1F5F9', marginBottom: '0.5rem' }}>
                Data-Driven, No BS
              </h4>
              <p style={{ fontSize: '0.938rem', color: 'rgba(241, 245, 249, 0.7)', lineHeight: '1.5' }}>
                Institutional-grade NHL betting model with complete transparency. Every pick tracked.
              </p>
            </div>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🚫</div>
              <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#F1F5F9', marginBottom: '0.5rem' }}>
                No Parlays, No Liars
              </h4>
              <p style={{ fontSize: '0.938rem', color: 'rgba(241, 245, 249, 0.7)', lineHeight: '1.5' }}>
                Stop throwing money away on longshot parlays and shady cappers. We show every pick.
              </p>
            </div>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
              <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#F1F5F9', marginBottom: '0.5rem' }}>
                Real +EV Edge
              </h4>
              <p style={{ fontSize: '0.938rem', color: 'rgba(241, 245, 249, 0.7)', lineHeight: '1.5' }}>
                Only recommend bets with proven positive expected value. Long-term profitability.
              </p>
            </div>
          </div>
        </div>

        {/* Final Trust Indicators */}
        <div style={{
          textAlign: 'center',
          fontSize: '0.938rem',
          color: 'rgba(241, 245, 249, 0.6)',
          lineHeight: '1.8'
        }}>
          <div style={{ marginBottom: '0.5rem' }}>
            🔒 Secure checkout with Stripe | Cancel anytime, no questions asked
          </div>
          <div>
            Full refund within 7 days if you're not satisfied
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => {
          setAuthModalOpen(false);
          setSelectedTier(null);
        }} 
        tier={selectedTier}
      />

      {/* Spin for Discount Modal */}
      {showSpinModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
            borderRadius: '20px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 100px rgba(212, 175, 55, 0.2)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            animation: 'slideUp 0.3s ease-out'
          }}>
            {/* Close Button */}
            <button
              onClick={() => setShowSpinModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#94A3B8',
                transition: 'all 0.2s',
                zIndex: 10
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                e.currentTarget.style.color = '#EF4444';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.color = '#94A3B8';
              }}
            >
              <X size={20} />
            </button>

            {/* Content */}
            <div style={{ padding: '32px 24px' }}>
              {/* Header */}
              <div style={{
                textAlign: 'center',
                marginBottom: '24px'
              }}>
                <h2 style={{
                  fontSize: '28px',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #D4AF37 0%, #F59E0B 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '12px',
                  lineHeight: '1.2'
                }}>
                  Spin for Your Discount! 🎰
                </h2>
                <p style={{
                  fontSize: '16px',
                  color: '#94A3B8',
                  lineHeight: '1.5'
                }}>
                  Win up to 55% off your premium subscription!
                </p>
              </div>

              {/* Spin Wheel */}
              <DiscountLottery 
                variant="daily-return"
                spinsRemaining={spinsRemaining}
                onSpinComplete={handleSpinComplete}
                onCodeRevealed={(code) => {
                  logEvent('pricing_spin_code_won', { code });
                }}
              />

              {/* Out of Spins Message */}
              {spinsRemaining === 0 && (
                <div style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginTop: '20px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '14px',
                    color: '#60A5FA',
                    lineHeight: '1.5'
                  }}>
                    Out of spins today! Come back tomorrow for 2 more chances.
                  </div>
                </div>
              )}
            </div>
          </div>

          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            
            @keyframes slideUp {
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
      )}
    </div>
  );
};

export default Pricing;

