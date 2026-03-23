import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, Shield, Zap, TrendingUp, BarChart3 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { redirectToCheckout } from '../utils/stripe';

const AuthModal = ({ isOpen, onClose, tier = null }) => {
  const { signInWithGoogle, loading, error } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  if (!isOpen) return null;

  const isMobile = window.innerWidth < 640;

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const result = await signInWithGoogle();
      if (result) {
        if (tier) {
          await redirectToCheckout(tier, result);
        } else {
          setTimeout(() => {
            onClose();
            setIsSigningIn(false);
          }, 500);
        }
      } else {
        setIsSigningIn(false);
      }
    } catch (err) {
      console.error('Sign in failed:', err);
      setIsSigningIn(false);
    }
  };

  const tierNames = { scout: 'Scout', elite: 'Elite', pro: 'SAVANT PRO' };
  const tierTrials = { scout: '5-day', elite: '7-day', pro: '10-day' };

  const features = [
    { icon: Zap, text: 'Verified sharp bettor tracking in real time' },
    { icon: TrendingUp, text: 'Daily +EV picks with quality grades' },
    { icon: BarChart3, text: 'Pinnacle fair value + best retail EV edge' },
    { icon: Shield, text: 'Full market flow, line moves, & whale action' },
  ];

  const modalContent = (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 2147483647, padding: '1rem',
        animation: 'fadeIn 0.2s ease-out',
        overflow: 'auto', isolation: 'isolate',
        WebkitTransform: 'translateZ(0)', transform: 'translateZ(0)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(212, 175, 55, 0.25)',
          borderRadius: '20px',
          padding: isMobile ? '1.5rem' : '2.5rem',
          maxWidth: '480px', width: '100%', margin: 'auto',
          position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(212, 175, 55, 0.08)',
          animation: 'slideUp 0.3s ease-out',
          maxHeight: '90vh', overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
          borderRadius: '20px 20px 0 0', overflow: 'hidden',
          background: 'linear-gradient(90deg, #D4AF37, #10B981, #D4AF37)',
        }} />

        {/* Close */}
        <button
          onClick={onClose}
          disabled={isSigningIn || loading}
          style={{
            position: 'absolute', top: isMobile ? '1rem' : '1.25rem',
            right: isMobile ? '1rem' : '1.25rem',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px', width: '32px', height: '32px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: (isSigningIn || loading) ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            opacity: (isSigningIn || loading) ? 0.3 : 1,
          }}
        >
          <X size={18} color="#E2E8F0" />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '1.25rem' : '1.75rem' }}>
          <div style={{
            fontSize: isMobile ? '1.75rem' : '2rem', fontWeight: 900,
            background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text', marginBottom: '0.5rem', letterSpacing: '-0.02em',
          }}>
            🏒 NHL Savant
          </div>
          <p style={{
            fontSize: isMobile ? '1.05rem' : '1.2rem', fontWeight: 700,
            color: '#F1F5F9', margin: '0 0 0.25rem 0',
          }}>
            {tier ? `Start your free ${tierTrials[tier] || ''} trial` : 'Sign in to continue'}
          </p>
          {tier && (
            <p style={{
              fontSize: '0.813rem', color: '#94A3B8', margin: 0, lineHeight: 1.5,
            }}>
              No charge today — cancel anytime before your trial ends
            </p>
          )}
        </div>

        {/* Features */}
        {tier && (
          <div style={{
            background: 'rgba(212, 175, 55, 0.05)',
            border: '1px solid rgba(212, 175, 55, 0.15)',
            borderRadius: '12px', padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
          }}>
            <div style={{
              fontSize: '0.688rem', fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.06em', color: '#D4AF37', marginBottom: '0.75rem',
            }}>
              Everything included
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {features.map(({ icon: Icon, text }, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <div style={{
                    width: '22px', height: '22px', borderRadius: '6px',
                    background: 'rgba(16, 185, 129, 0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Icon size={12} color="#10B981" />
                  </div>
                  <span style={{ fontSize: '0.875rem', color: '#CBD5E1', fontWeight: 500, lineHeight: 1.4 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Google Sign In */}
        <button
          onClick={handleSignIn}
          disabled={isSigningIn || loading}
          style={{
            width: '100%', padding: isMobile ? '0.875rem' : '1rem',
            background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%)',
            border: 'none', borderRadius: '12px',
            color: '#0A0E27', fontSize: '1rem', fontWeight: 700,
            cursor: isSigningIn || loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 14px rgba(212, 175, 55, 0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
            opacity: isSigningIn || loading ? 0.7 : 1,
            marginBottom: '1rem',
          }}
          onMouseEnter={(e) => {
            if (!isSigningIn && !loading) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.5)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(212, 175, 55, 0.4)';
          }}
        >
          {isSigningIn || loading ? (
            <>
              <div style={{
                width: '20px', height: '20px',
                border: '3px solid rgba(10,14,39,0.3)',
                borderTopColor: '#0A0E27', borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }} />
              {tier ? 'Signing in & starting checkout...' : 'Signing in...'}
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {tier ? 'Sign in & Start Free Trial' : 'Continue with Google'}
            </>
          )}
        </button>

        {/* Error */}
        {error && (
          <div style={{
            padding: '0.875rem',
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '8px', color: '#FCA5A5',
            fontSize: '0.875rem', marginBottom: '1rem', textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        {/* Trust */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
            fontSize: '0.75rem', color: 'rgba(241,245,249,0.5)', marginBottom: '0.625rem',
          }}>
            <Shield size={12} color="#94A3B8" />
            Secure sign-in with Google · No password needed
          </div>
          <div style={{
            display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
            gap: isMobile ? '0.5rem' : '1rem',
          }}>
            {[
              { label: 'Tracked Since Oct 2025', color: '#D4AF37' },
              { label: '200+ Sharp Wallets', color: '#10B981' },
              { label: 'Cancel Anytime', color: '#60A5FA' },
            ].map(({ label, color }, i) => (
              <span key={i} style={{
                fontSize: '0.688rem', fontWeight: 600, color,
                display: 'flex', alignItems: 'center', gap: '0.3rem',
              }}>
                <Check size={10} color={color} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default AuthModal;
