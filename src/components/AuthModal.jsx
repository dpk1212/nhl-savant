import { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const AuthModal = ({ isOpen, onClose, tier = null }) => {
  const { signInWithGoogle, loading, error } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  if (!isOpen) return null;

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const result = await signInWithGoogle();
      if (result) {
        // Wait a tiny bit for state to update, then close
        setTimeout(() => {
          onClose();
          setIsSigningIn(false);
        }, 500);
      } else {
        setIsSigningIn(false);
      }
    } catch (err) {
      console.error('Sign in failed:', err);
      setIsSigningIn(false);
    }
  };

  const tierNames = {
    scout: 'Scout',
    elite: 'Elite',
    pro: 'SAVANT PRO'
  };

  return (
    <div 
      style={{
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
          borderRadius: '20px',
          padding: window.innerWidth < 640 ? '1.5rem' : '2.5rem',
          maxWidth: '480px',
          width: '100%',
          margin: 'auto',
          position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          animation: 'slideUp 0.3s ease-out',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isSigningIn || loading}
          style={{
            position: 'absolute',
            top: window.innerWidth < 640 ? '1rem' : '1.5rem',
            right: window.innerWidth < 640 ? '1rem' : '1.5rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            width: window.innerWidth < 640 ? '32px' : '36px',
            height: window.innerWidth < 640 ? '32px' : '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: (isSigningIn || loading) ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            opacity: (isSigningIn || loading) ? 0.3 : 1
          }}
          onMouseEnter={(e) => {
            if (!isSigningIn && !loading) {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          <X size={window.innerWidth < 640 ? 18 : 20} color="#E2E8F0" />
        </button>

        {/* Logo/Branding */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: window.innerWidth < 640 ? '1.5rem' : '2rem' 
        }}>
          <div style={{
            fontSize: window.innerWidth < 640 ? '2rem' : '2.5rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em'
          }}>
            🏒 NHL Savant
          </div>
          <p style={{
            fontSize: window.innerWidth < 640 ? '1rem' : '1.125rem',
            fontWeight: '600',
            color: '#F1F5F9',
            margin: 0
          }}>
            {tier ? `Sign in to unlock ${tierNames[tier]}` : 'Sign in to continue'}
          </p>
        </div>

        {/* Benefits */}
        {tier && (
          <div style={{
            background: 'rgba(212, 175, 55, 0.08)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            borderRadius: '12px',
            padding: '1.25rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              fontSize: '0.875rem',
              color: 'rgba(241, 245, 249, 0.9)',
              lineHeight: '1.6'
            }}>
              <div style={{ fontWeight: '600', marginBottom: '0.75rem', color: '#D4AF37' }}>
                ✨ What you'll get:
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                <li>All daily +EV picks</li>
                <li>Performance tracking</li>
                <li>Expert analysis & insights</li>
                <li>Complete transparency</li>
                {tier === 'elite' && <li>Priority support</li>}
                {tier === 'pro' && (
                  <>
                    <li>Priority support</li>
                    <li>Annual performance reports</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        )}

        {/* Google Sign In Button */}
        <button
          onClick={handleSignIn}
          disabled={isSigningIn || loading}
          style={{
            width: '100%',
            padding: '1rem',
            background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%)',
            border: 'none',
            borderRadius: '12px',
            color: '#0A0E27',
            fontSize: '1rem',
            fontWeight: '700',
            cursor: isSigningIn || loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 14px 0 rgba(212, 175, 55, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            opacity: isSigningIn || loading ? 0.7 : 1,
            marginBottom: '1rem'
          }}
          onMouseEnter={(e) => {
            if (!isSigningIn && !loading) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px 0 rgba(212, 175, 55, 0.5)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(212, 175, 55, 0.4)';
          }}
        >
          {isSigningIn || loading ? (
            <>
              <div className="spinner" style={{
                width: '20px',
                height: '20px',
                border: '3px solid rgba(10, 14, 39, 0.3)',
                borderTopColor: '#0A0E27',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }} />
              Signing in...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </>
          )}
        </button>

        {/* Error message */}
        {error && (
          <div style={{
            padding: '0.875rem',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            color: '#FCA5A5',
            fontSize: '0.875rem',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Trust indicators */}
        <div style={{
          textAlign: 'center',
          fontSize: window.innerWidth < 640 ? '0.75rem' : '0.813rem',
          color: 'rgba(241, 245, 249, 0.6)',
          lineHeight: '1.5'
        }}>
          <div style={{ marginBottom: '0.5rem' }}>
            🔒 Secure sign-in with Google
          </div>
          <div style={{ 
            fontSize: window.innerWidth < 640 ? '0.688rem' : '0.813rem' 
          }}>
            52.9% Win Rate | 30.3% ROI | Cancel Anytime
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
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AuthModal;

