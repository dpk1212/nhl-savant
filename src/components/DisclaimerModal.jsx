/**
 * Disclaimer Modal Component
 * First-time user acknowledgment - must accept before using site
 */

import { useState, useEffect } from 'react';
import { AlertTriangle, Shield, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const DisclaimerModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAcknowledged, setHasAcknowledged] = useState(false);

  useEffect(() => {
    // Check if user has previously acknowledged
    const acknowledged = localStorage.getItem('nhl_savant_disclaimer_acknowledged');
    if (!acknowledged) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    if (!hasAcknowledged) {
      alert('Please check the box to confirm you understand the terms.');
      return;
    }

    // Save acknowledgment
    localStorage.setItem('nhl_savant_disclaimer_acknowledged', 'true');
    localStorage.setItem('nhl_savant_disclaimer_date', new Date().toISOString());
    setIsVisible(false);
  };

  const handleDecline = () => {
    // Redirect away or show message
    alert('You must accept the terms to use NHL Savant. Redirecting...');
    window.location.href = 'https://www.google.com';
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 9998,
        animation: 'fadeIn 0.3s ease'
      }} />

      {/* Modal */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '85vh',
        backgroundColor: 'var(--color-bg-secondary)',
        borderRadius: '16px',
        border: '2px solid rgba(239, 68, 68, 0.4)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '2px solid rgba(239, 68, 68, 0.3)',
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem'
          }}>
            <AlertTriangle size={32} color="#EF4444" style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '900',
                color: '#EF4444',
                margin: '0 0 0.5rem 0',
                textTransform: 'uppercase',
                letterSpacing: '0.02em'
              }}>
                Important Legal Notice
              </h2>
              <p style={{
                fontSize: '0.875rem',
                color: 'var(--color-text-muted)',
                margin: 0,
                lineHeight: '1.5'
              }}>
                You must read and accept these terms before using NHL Savant
              </p>
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.5rem'
        }}>
          {/* Warning Box */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(239, 68, 68, 0.05) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem'
          }}>
            <p style={{
              fontSize: '0.938rem',
              lineHeight: '1.6',
              color: 'var(--color-text-primary)',
              margin: 0,
              fontWeight: '600'
            }}>
              <strong>⚠️ SPORTS BETTING INVOLVES FINANCIAL RISK</strong><br />
              Only bet what you can afford to lose. This site is for entertainment and educational purposes only.
            </p>
          </div>

          {/* Key Points */}
          <div style={{
            fontSize: '0.875rem',
            lineHeight: '1.7',
            color: 'var(--color-text-primary)'
          }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '800',
              color: 'var(--color-text-primary)',
              margin: '0 0 0.75rem 0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Shield size={20} color="#10B981" />
              You Acknowledge That:
            </h3>

            <ul style={{
              margin: '0 0 1.5rem 0',
              paddingLeft: '1.5rem',
              listStyleType: 'disc'
            }}>
              <li style={{ marginBottom: '0.625rem' }}>
                <strong>This is NOT betting advice.</strong> All content is for entertainment and educational purposes only.
              </li>
              <li style={{ marginBottom: '0.625rem' }}>
                <strong>We make NO guarantees.</strong> Past performance does not predict future results. You may lose money.
              </li>
              <li style={{ marginBottom: '0.625rem' }}>
                <strong>You are solely responsible</strong> for your betting decisions and their financial consequences.
              </li>
              <li style={{ marginBottom: '0.625rem' }}>
                <strong>We are NOT a sportsbook.</strong> We do not accept bets or wagers of any kind.
              </li>
              <li style={{ marginBottom: '0.625rem' }}>
                <strong>Age requirement:</strong> You are 21+ years old (or 18+ if legal in your jurisdiction).
              </li>
              <li style={{ marginBottom: '0.625rem' }}>
                <strong>Legal compliance:</strong> Sports betting is legal in your jurisdiction and you will verify applicable laws.
              </li>
              <li style={{ marginBottom: '0.625rem' }}>
                <strong>Gambling problem?</strong> Call 1-800-GAMBLER or visit <a href="https://www.ncpgambling.org" target="_blank" rel="noopener noreferrer" style={{ color: '#3B82F6' }}>ncpgambling.org</a>
              </li>
            </ul>

            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
              padding: '1rem',
              marginTop: '1rem'
            }}>
              <p style={{
                fontSize: '0.813rem',
                color: 'var(--color-text-muted)',
                margin: 0,
                lineHeight: '1.6'
              }}>
                For complete terms, see our <Link to="/disclaimer" style={{ color: '#3B82F6', fontWeight: '700' }}>Legal Disclaimer & Terms of Use</Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer - Actions */}
        <div style={{
          padding: '1.5rem',
          borderTop: '1px solid var(--color-border)',
          backgroundColor: 'rgba(0, 0, 0, 0.2)'
        }}>
          {/* Checkbox */}
          <label style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            marginBottom: '1rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
            lineHeight: '1.5',
            color: 'var(--color-text-primary)'
          }}>
            <input
              type="checkbox"
              checked={hasAcknowledged}
              onChange={(e) => setHasAcknowledged(e.target.checked)}
              style={{
                width: '20px',
                height: '20px',
                marginTop: '2px',
                cursor: 'pointer',
                accentColor: '#10B981'
              }}
            />
            <span>
              <strong>I am 21+ years old,</strong> I have read and understand these terms, and I accept full responsibility for my betting decisions.
            </span>
          </label>

          {/* Buttons */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem'
          }}>
            <button
              onClick={handleDecline}
              style={{
                padding: '0.875rem 1.5rem',
                backgroundColor: 'transparent',
                border: '2px solid var(--color-border)',
                borderRadius: '8px',
                fontSize: '0.938rem',
                fontWeight: '700',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#EF4444';
                e.target.style.color = '#EF4444';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = 'var(--color-border)';
                e.target.style.color = 'var(--color-text-secondary)';
              }}
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              disabled={!hasAcknowledged}
              style={{
                padding: '0.875rem 1.5rem',
                background: hasAcknowledged 
                  ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                  : 'rgba(100, 116, 139, 0.3)',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.938rem',
                fontWeight: '800',
                color: hasAcknowledged ? 'white' : 'rgba(255, 255, 255, 0.5)',
                cursor: hasAcknowledged ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
                boxShadow: hasAcknowledged ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (hasAcknowledged) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (hasAcknowledged) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                }
              }}
            >
              I Accept & Continue
            </button>
          </div>
        </div>

        {/* Animations */}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translate(-50%, -45%);
            }
            to {
              opacity: 1;
              transform: translate(-50%, -50%);
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default DisclaimerModal;

