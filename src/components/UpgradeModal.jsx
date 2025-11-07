import { X, Check } from 'lucide-react';
import { redirectToCheckout } from '../utils/stripe';
import { analytics, logEvent as firebaseLogEvent } from '../firebase/config';

// Wrapper for analytics logging
const logEvent = (eventName, params) => {
  if (analytics) {
    firebaseLogEvent(analytics, eventName, params);
  }
};

const UpgradeModal = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null;

  const handleUpgrade = (tier) => {
    logEvent('upgrade_modal_click', { tier });
    redirectToCheckout(tier, user);
  };

  const tiers = [
    {
      id: 'scout',
      name: 'Scout',
      price: '$7.99',
      period: 'week',
      trial: '2-day free trial',
      features: [
        'All +EV picks with Expected Value',
        'AI-powered matchup breakdowns',
        'Real-time profit tracking',
        'Elite predictive model access'
      ]
    },
    {
      id: 'elite',
      name: 'Elite',
      price: '$25.99',
      period: 'month',
      trial: '3-day free trial',
      popular: true,
      features: [
        'Unlimited daily +EV opportunities',
        'Full model performance metrics',
        'Advanced analytics & hot takes',
        'Priority model updates',
        'Best monthly value'
      ]
    },
    {
      id: 'pro',
      name: 'SAVANT PRO',
      price: '$150',
      period: 'year',
      trial: '5-day free trial',
      savings: 'Save 50%',
      features: [
        'Everything in Elite',
        'Season-long ROI tracking',
        'Exclusive annual insights',
        'Maximum savings (only $12.50/mo)'
      ]
    }
  ];

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
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out',
        overflow: 'auto',
        isolation: 'isolate',
        WebkitTransform: 'translateZ(0)',
        transform: 'translateZ(0)'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          borderRadius: window.innerWidth < 640 ? '14px' : '20px',
          padding: window.innerWidth < 640 ? '1.125rem' : '2rem',
          maxWidth: '900px',
          width: '100%',
          margin: 'auto',
          position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          animation: 'slideUp 0.3s ease-out',
          maxHeight: '95vh',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: window.innerWidth < 640 ? '1rem' : '1.25rem',
            right: window.innerWidth < 640 ? '1rem' : '1.25rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          <X size={18} color="#E2E8F0" />
        </button>

        {/* Header */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: window.innerWidth < 640 ? '1rem' : '1.75rem' 
        }}>
          <h2 style={{
            fontSize: window.innerWidth < 640 ? '1.25rem' : '1.75rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: '0 0 0.625rem 0',
            letterSpacing: '-0.02em'
          }}>
            Turn Data Into Profit
          </h2>
          <p style={{
            fontSize: window.innerWidth < 640 ? '0.8125rem' : '1rem',
            color: 'rgba(241, 245, 249, 0.8)',
            margin: '0 0 0.625rem 0',
            maxWidth: '650px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: '1.5'
          }}>
            You've used your <strong style={{ color: '#D4AF37' }}>1 free pick today</strong>. Upgrade to unlock our elite predictive model—<strong style={{ color: '#10B981' }}>20%+ ROI this season</strong>, tracked and verified since Oct 2025.
          </p>
          <p style={{
            fontSize: window.innerWidth < 640 ? '0.75rem' : '0.875rem',
            color: 'rgba(241, 245, 249, 0.6)',
            margin: 0,
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
            fontStyle: 'italic'
          }}>
            Stop guessing. Start winning with math-driven NHL betting intelligence.
          </p>
        </div>

        {/* Tier Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth < 640 ? '1fr' : 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: window.innerWidth < 640 ? '0.875rem' : '1.25rem',
          marginBottom: window.innerWidth < 640 ? '1rem' : '1.5rem'
        }}>
          {tiers.map((tier) => (
            <div
              key={tier.id}
              style={{
                background: tier.popular 
                  ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(59, 130, 246, 0.12) 100%)'
                  : 'rgba(30, 41, 59, 0.5)',
                border: tier.popular 
                  ? '2px solid rgba(212, 175, 55, 0.4)'
                  : '1px solid rgba(148, 163, 184, 0.15)',
                borderRadius: window.innerWidth < 640 ? '10px' : '14px',
                padding: window.innerWidth < 640 ? '1rem' : '1.375rem',
                position: 'relative',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = tier.popular ? 'rgba(212, 175, 55, 0.6)' : 'rgba(148, 163, 184, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = tier.popular ? 'rgba(212, 175, 55, 0.4)' : 'rgba(148, 163, 184, 0.15)';
              }}
            >
              {/* Popular badge */}
              {tier.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)',
                  color: '#0A0E27',
                  padding: '0.3125rem 0.875rem',
                  borderRadius: '100px',
                  fontSize: '0.6875rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Most Popular
                </div>
              )}

              {/* Savings badge */}
              {tier.savings && (
                <div style={{
                  position: 'absolute',
                  top: '0.75rem',
                  right: '0.75rem',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10B981',
                  padding: '0.1875rem 0.625rem',
                  borderRadius: '5px',
                  fontSize: '0.6875rem',
                  fontWeight: '600'
                }}>
                  {tier.savings}
                </div>
              )}

              {/* Tier name */}
              <div style={{
                fontSize: window.innerWidth < 640 ? '1.0625rem' : '1.125rem',
                fontWeight: '700',
                color: '#F1F5F9',
                marginBottom: '0.375rem'
              }}>
                {tier.name}
              </div>

              {/* Price */}
              <div style={{ marginBottom: '0.75rem' }}>
                <span style={{
                  fontSize: window.innerWidth < 640 ? '1.625rem' : '1.875rem',
                  fontWeight: '800',
                  color: tier.popular ? '#D4AF37' : '#F1F5F9'
                }}>
                  {tier.price}
                </span>
                <span style={{
                  fontSize: window.innerWidth < 640 ? '0.8125rem' : '0.9375rem',
                  color: 'rgba(241, 245, 249, 0.6)',
                  marginLeft: '0.25rem'
                }}>
                  /{tier.period}
                </span>
              </div>

              {/* Trial */}
              <div style={{
                fontSize: window.innerWidth < 640 ? '0.8125rem' : '0.875rem',
                color: '#10B981',
                fontWeight: '600',
                marginBottom: '0.875rem'
              }}>
                {tier.trial}
              </div>

              {/* Features */}
              <div style={{
                marginBottom: '1rem'
              }}>
                {tier.features.map((feature, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem',
                    fontSize: window.innerWidth < 640 ? '0.8125rem' : '0.8125rem',
                    color: 'rgba(241, 245, 249, 0.9)',
                    lineHeight: '1.3'
                  }}>
                    <Check size={14} color={tier.popular ? '#D4AF37' : '#60A5FA'} strokeWidth={3} />
                    {feature}
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handleUpgrade(tier.id)}
                style={{
                  width: '100%',
                  padding: window.innerWidth < 640 ? '0.75rem' : '0.8125rem',
                  background: tier.popular
                    ? 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%)'
                    : 'rgba(59, 130, 246, 0.15)',
                  border: tier.popular ? 'none' : '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '9px',
                  color: tier.popular ? '#0A0E27' : '#60A5FA',
                  fontSize: window.innerWidth < 640 ? '0.875rem' : '0.875rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (tier.popular) {
                    e.currentTarget.style.boxShadow = '0 6px 20px 0 rgba(212, 175, 55, 0.4)';
                  } else {
                    e.currentTarget.style.background = 'rgba(59, 130, 246, 0.25)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (tier.popular) {
                    e.currentTarget.style.boxShadow = 'none';
                  } else {
                    e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)';
                  }
                }}
              >
                Start {tier.trial.split(' ')[0]} Trial
              </button>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div style={{
          textAlign: 'center',
          fontSize: window.innerWidth < 640 ? '0.6875rem' : '0.8125rem',
          color: 'rgba(241, 245, 249, 0.6)',
          lineHeight: '1.6'
        }}>
          <div style={{ 
            marginBottom: '0.375rem',
            fontSize: window.innerWidth < 640 ? '0.75rem' : '0.875rem',
            color: 'rgba(241, 245, 249, 0.8)'
          }}>
            <strong style={{ color: '#10B981' }}>Verified Performance:</strong> 20%+ ROI this season | All results tracked publicly since Oct 2025
          </div>
          <div style={{ 
            fontSize: window.innerWidth < 640 ? '0.6875rem' : '0.8125rem'
          }}>
            🔒 Secure Stripe Checkout | Cancel Anytime
          </div>
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
  );
};

export default UpgradeModal;

