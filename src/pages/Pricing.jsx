import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Crown, Zap, Target, TrendingUp, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import { redirectToCheckout } from '../utils/stripe';
import { analytics, logEvent as firebaseLogEvent } from '../firebase/config';
import AuthModal from '../components/AuthModal';

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
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);

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

  const tiers = [
    {
      id: 'scout',
      name: 'Scout',
      icon: Target,
      price: '$7.99',
      period: 'week',
      trial: '5-day free trial',
      description: 'Test Drive +EV Betting',
      features: [
        'All daily +EV picks',
        'Performance tracking',
        'Expert analysis & insights',
        'Complete model transparency',
        'Win/loss profit tracking'
      ],
      cta: 'Start 5-Day Trial'
    },
    {
      id: 'elite',
      name: 'Elite',
      icon: Zap,
      price: '$25.99',
      period: 'month',
      trial: '7-day free trial',
      description: 'Serious +EV Hunter',
      popular: true,
      features: [
        'Everything in Scout',
        'Priority email support',
        'Advanced performance analytics',
        'Bet tracking & notifications',
        'Detailed matchup breakdowns',
        'Access to historical data'
      ],
      cta: 'Start 7-Day Trial'
    },
    {
      id: 'pro',
      name: 'SAVANT PRO',
      icon: Crown,
      price: '$150',
      period: 'year',
      trial: '10-day free trial',
      description: 'Professional Edge Seeker',
      savings: 'Save 50% vs Monthly',
      features: [
        'Everything in Elite',
        'Annual performance reports',
        'Priority support (24h response)',
        'Custom bet filters & alerts',
        'API access (coming soon)',
        'Best value - $12.50/month'
      ],
      cta: 'Start 10-Day Trial'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0A0E27 0%, #1A1F3A 50%, #0A0E27 100%)',
      padding: '4rem 1.5rem',
      paddingTop: '2rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{
            fontSize: '3rem',
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
            fontSize: '1.25rem',
            color: 'rgba(241, 245, 249, 0.8)',
            maxWidth: '700px',
            margin: '0 auto 2rem auto',
            lineHeight: '1.6'
          }}>
            Premium tools to find +EV, avoid -EV, and hold cappers accountable.
            <br />Cancel anytime.
          </p>
          
          {/* Trust Indicators */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '2rem',
            marginTop: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={20} color="#10B981" />
              <span style={{ color: '#10B981', fontWeight: '600', fontSize: '0.938rem' }}>26% ROI (38% Kelly) as of Nov 6</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={20} color="#D4AF37" />
              <span style={{ color: '#D4AF37', fontWeight: '600', fontSize: '0.938rem' }}>Tracked Since Oct 2025</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={20} color="#60A5FA" />
              <span style={{ color: '#60A5FA', fontWeight: '600', fontSize: '0.938rem' }}>Free Trial Included</span>
            </div>
          </div>
        </div>

        {/* Tier Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          marginBottom: '4rem'
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
                  borderRadius: '20px',
                  padding: '2.5rem',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  transform: tierInfo.popular ? 'scale(1.05)' : 'scale(1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = tierInfo.popular ? 'scale(1.08)' : 'scale(1.03)';
                  e.currentTarget.style.borderColor = tierInfo.popular ? 'rgba(212, 175, 55, 0.7)' : 'rgba(148, 163, 184, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = tierInfo.popular ? 'scale(1.05)' : 'scale(1)';
                  e.currentTarget.style.borderColor = tierInfo.popular ? 'rgba(212, 175, 55, 0.5)' : 'rgba(148, 163, 184, 0.2)';
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
                  <span style={{
                    fontSize: '3rem',
                    fontWeight: '800',
                    color: tierInfo.popular ? '#D4AF37' : '#F1F5F9',
                    lineHeight: '1'
                  }}>
                    {tierInfo.price}
                  </span>
                  <span style={{
                    fontSize: '1.125rem',
                    color: 'rgba(241, 245, 249, 0.6)',
                    marginLeft: '0.5rem'
                  }}>
                    /{tierInfo.period}
                  </span>
                </div>

                {/* Trial */}
                <div style={{
                  fontSize: '0.938rem',
                  color: '#10B981',
                  fontWeight: '600',
                  marginBottom: '2rem'
                }}>
                  ✨ {tierInfo.trial}
                </div>

                {/* Features */}
                <div style={{
                  marginBottom: '2rem',
                  minHeight: '200px'
                }}>
                  {tierInfo.features.map((feature, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      marginBottom: '0.875rem'
                    }}>
                      <Check size={18} color={tierInfo.popular ? '#D4AF37' : '#60A5FA'} strokeWidth={3} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{
                        fontSize: '0.938rem',
                        color: 'rgba(241, 245, 249, 0.9)',
                        lineHeight: '1.5'
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
    </div>
  );
};

export default Pricing;

