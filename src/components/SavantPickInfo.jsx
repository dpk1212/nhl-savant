import { useState } from 'react';

/**
 * 🎯 SAVANT PICK INFO TOOLTIP
 * A ? icon that explains the difference between model picks and Savant Picks
 * Shows on hover with a clean popover explanation
 */
const SavantPickInfo = ({ isMobile = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      {/* ? Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => !isMobile && setIsOpen(true)}
        onMouseLeave={() => !isMobile && setIsOpen(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: isMobile ? '22px' : '24px',
          height: isMobile ? '22px' : '24px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.12) 0%, rgba(245, 158, 11, 0.06) 100%)',
          border: '1px solid rgba(251, 191, 36, 0.25)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          padding: 0,
        }}
        aria-label="Learn about Savant Picks"
      >
        <span style={{
          fontSize: isMobile ? '0.75rem' : '0.813rem',
          fontWeight: '700',
          color: 'rgba(251, 191, 36, 0.85)',
        }}>
          ?
        </span>
      </button>
      
      {/* Info Popover */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          {isMobile && (
            <div
              onClick={() => setIsOpen(false)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                zIndex: 998,
              }}
            />
          )}
          
          <div
            style={{
              position: isMobile ? 'fixed' : 'absolute',
              top: isMobile ? '50%' : '100%',
              left: isMobile ? '50%' : 'auto',
              right: isMobile ? 'auto' : 0,
              transform: isMobile ? 'translate(-50%, -50%)' : 'none',
              marginTop: isMobile ? 0 : '10px',
              width: isMobile ? 'calc(100vw - 48px)' : '320px',
              maxWidth: '360px',
              padding: isMobile ? '1.25rem' : '1rem',
              background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.99) 0%, rgba(30, 41, 59, 0.99) 100%)',
              border: '1px solid rgba(251, 191, 36, 0.2)',
              borderRadius: '14px',
              boxShadow: '0 12px 48px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
              zIndex: 999,
              animation: 'slideIn 0.25s ease',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <span style={{ fontSize: '1.25rem' }}>⭐</span>
                <span style={{
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: 'rgba(251, 191, 36, 0.95)',
                }}>
                  What is a Savant Pick?
                </span>
              </div>
              
              {isMobile && (
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    padding: '0',
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              )}
            </div>
            
            {/* Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Model Picks Explanation */}
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.4rem',
                }}>
                  <span style={{
                    fontSize: '0.875rem',
                    color: '#60A5FA',
                  }}>🤖</span>
                  <span style={{
                    fontSize: '0.813rem',
                    fontWeight: '700',
                    color: '#60A5FA',
                  }}>
                    Model Picks
                  </span>
                </div>
                <p style={{
                  fontSize: '0.75rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                  lineHeight: 1.6,
                  margin: 0,
                }}>
                  Pure math-driven analysis. Our algorithms process team stats, odds movements, and historical patterns to identify value plays automatically.
                </p>
              </div>
              
              {/* Savant Picks Explanation */}
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.4rem',
                }}>
                  <span style={{
                    fontSize: '0.875rem',
                  }}>⭐</span>
                  <span style={{
                    fontSize: '0.813rem',
                    fontWeight: '700',
                    color: 'rgba(251, 191, 36, 0.95)',
                  }}>
                    Savant Picks
                  </span>
                </div>
                <p style={{
                  fontSize: '0.75rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                  lineHeight: 1.6,
                  margin: 0,
                }}>
                  Human-curated selections. Our analysts layer in context the models can't see—injuries, matchups, motivation, weather—to find the <strong style={{ color: 'rgba(251, 191, 36, 0.9)' }}>sharpest edges</strong>.
                </p>
              </div>
              
              {/* Bottom Note */}
              <div style={{
                marginTop: '0.5rem',
                padding: '0.625rem 0.75rem',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '8px',
              }}>
                <p style={{
                  fontSize: '0.688rem',
                  color: 'rgba(16, 185, 129, 0.9)',
                  lineHeight: 1.5,
                  margin: 0,
                  fontWeight: '500',
                }}>
                  💡 Tip: Savant Picks are designed to complement model picks with human insight for an extra edge.
                </p>
              </div>
            </div>
            
            <style>{`
              @keyframes slideIn {
                from { 
                  opacity: 0; 
                  transform: ${isMobile ? 'translate(-50%, -48%)' : 'translateY(-8px)'};
                }
                to { 
                  opacity: 1; 
                  transform: ${isMobile ? 'translate(-50%, -50%)' : 'translateY(0)'};
                }
              }
            `}</style>
          </div>
        </>
      )}
    </div>
  );
};

export default SavantPickInfo;

