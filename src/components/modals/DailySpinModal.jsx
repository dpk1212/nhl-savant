import { X } from 'lucide-react';
import DiscountLottery from '../DiscountLottery';
import { redirectToCheckout } from '../../utils/stripe';
import { analytics, logEvent as firebaseLogEvent } from '../../firebase/config';

const logEvent = (eventName, params) => {
  if (analytics) {
    firebaseLogEvent(analytics, eventName, params);
  }
};

/**
 * Daily Spin Modal
 * 
 * Shows returning non-subscribers a daily spin opportunity
 * Different messaging than the welcome popup
 */
export default function DailySpinModal({ 
  isOpen, 
  onClose, 
  spinsRemaining, 
  onSpinComplete,
  user 
}) {
  if (!isOpen) return null;

  const handleSpinComplete = (code) => {
    logEvent('daily_spin_completed', { code, spins_remaining: spinsRemaining - 1 });
    if (onSpinComplete) {
      onSpinComplete(code);
    }
  };

  const handleUpgrade = (tier = 'elite') => {
    logEvent('daily_spin_checkout_click', { tier, spins_remaining: spinsRemaining });
    
    if (user) {
      redirectToCheckout(tier, user);
    } else {
      // Close modal and let them sign in first
      onClose();
    }
  };

  // Log modal shown
  if (isOpen) {
    logEvent('daily_spin_modal_shown', { spins_remaining: spinsRemaining });
  }

  return (
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
          onClick={onClose}
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
              Welcome Back! 🎰
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#94A3B8',
              lineHeight: '1.5',
              marginBottom: '8px'
            }}>
              Still trying to win without a proven system?
            </p>
            <p style={{
              fontSize: '14px',
              color: '#60A5FA',
              fontWeight: '600'
            }}>
              Spin for an exclusive discount - Try Premium Risk-Free!
            </p>
          </div>

          {/* Spin Wheel */}
          <DiscountLottery 
            variant="daily-return"
            spinsRemaining={spinsRemaining}
            onSpinComplete={handleSpinComplete}
            onCodeRevealed={(code) => {
              logEvent('daily_spin_code_won', { code });
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
                marginBottom: '12px',
                lineHeight: '1.5'
              }}>
                Out of spins today! Come back tomorrow for 2 more chances, or unlock unlimited access with Premium.
              </div>
              <button
                onClick={() => handleUpgrade('elite')}
                style={{
                  background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  width: '100%'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Upgrade to Premium
              </button>
            </div>
          )}

          {/* CTA Section */}
          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: 'rgba(16, 185, 129, 0.05)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '12px'
          }}>
            <div style={{
              fontSize: '13px',
              color: '#94A3B8',
              marginBottom: '12px',
              textAlign: 'center',
              lineHeight: '1.5'
            }}>
              Try our proven system risk-free
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px'
            }}>
              <button
                onClick={() => handleUpgrade('scout')}
                style={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '8px',
                  padding: '10px',
                  color: '#A78BFA',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
                }}
              >
                Weekly Plan<br/>
                <span style={{ fontSize: '11px', opacity: 0.8 }}>$7.99/week</span>
              </button>
              <button
                onClick={() => handleUpgrade('elite')}
                style={{
                  background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: '#D4AF37',
                  color: '#1E293B',
                  fontSize: '9px',
                  fontWeight: '800',
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}>
                  POPULAR
                </div>
                Monthly Plan<br/>
                <span style={{ fontSize: '11px', opacity: 0.9 }}>$25.99/month</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            marginTop: '16px',
            textAlign: 'center',
            fontSize: '11px',
            color: '#64748B'
          }}>
            All plans include free trial • Cancel anytime
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
}

