import { useNavigate } from 'react-router-dom';
import { Sparkles, TrendingUp } from 'lucide-react';

const UpgradePrompt = ({ type = 'inline', usedPicks = [], potentialProfit = null, isMobile }) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    navigate('/pricing');
  };

  // Inline prompt (shown after first free pick)
  if (type === 'inline') {
    return (
      <div style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: '12px',
        padding: isMobile ? '1.25rem' : '1.5rem',
        marginTop: '1.5rem',
        marginBottom: '1.5rem',
        boxShadow: '0 0 25px rgba(245, 158, 11, 0.15)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            borderRadius: '10px',
            padding: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 0 15px rgba(245, 158, 11, 0.4)'
          }}>
            <Sparkles size={isMobile ? 20 : 24} color="#0a0e1a" strokeWidth={2.5} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{
              fontSize: isMobile ? '1.125rem' : '1.25rem',
              fontWeight: '700',
              color: '#ffffff',
              margin: 0,
              marginBottom: '0.5rem',
              letterSpacing: '-0.01em'
            }}>
              You've seen the quality
            </h3>
            <p style={{
              fontSize: isMobile ? '0.875rem' : '0.938rem',
              color: 'rgba(255, 255, 255, 0.85)',
              lineHeight: '1.6',
              margin: 0
            }}>
              {usedPicks.length === 1 
                ? 'Unlock all picks. See every edge before the market moves.'
                : 'See every positive edge. Never miss value again.'}
            </p>
          </div>
        </div>

        <button
          onClick={handleUpgrade}
          style={{
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            border: '1px solid #F59E0B',
            borderRadius: '10px',
            padding: isMobile ? '0.875rem 1.25rem' : '1rem 1.5rem',
            color: '#0a0e1a',
            fontSize: isMobile ? '1rem' : '1.125rem',
            fontWeight: '800',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            width: '100%',
            boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
            letterSpacing: '0.02em'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 0 30px rgba(245, 158, 11, 0.6)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 0 20px rgba(245, 158, 11, 0.4)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Upgrade to Unlock All Picks
        </button>

        <p style={{
          fontSize: isMobile ? '0.75rem' : '0.813rem',
          color: 'rgba(255, 255, 255, 0.6)',
          textAlign: 'center',
          marginTop: '0.75rem',
          marginBottom: 0
        }}>
          7-day money-back guarantee · Cancel anytime
        </p>
      </div>
    );
  }

  // Modal prompt (shown after all 3 picks exhausted)
  if (type === 'modal') {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '1rem',
        animation: 'fadeIn 0.3s ease-out'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #0a0e1a 0%, #0f1419 100%)',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          borderRadius: '15px',
          maxWidth: isMobile ? '95%' : '500px',
          width: '100%',
          padding: isMobile ? '1.5rem' : '2rem',
          position: 'relative',
          boxShadow: '0 0 60px rgba(245, 158, 11, 0.3)',
          color: '#ffffff',
          animation: 'slideUp 0.4s ease-out'
        }}>
          {/* Icon */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              borderRadius: '50%',
              width: isMobile ? '60px' : '70px',
              height: isMobile ? '60px' : '70px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 30px rgba(245, 158, 11, 0.5)'
            }}>
              <TrendingUp size={isMobile ? 30 : 36} color="#0a0e1a" strokeWidth={2.5} />
            </div>
          </div>

          {/* Headline */}
          <h2 style={{
            fontSize: isMobile ? '1.5rem' : '1.875rem',
            fontWeight: '800',
            color: '#ffffff',
            marginBottom: '1rem',
            textAlign: 'center',
            letterSpacing: '-0.03em'
          }}>
            You've Used Your 3 Free Picks
          </h2>

          {/* Body */}
          <p style={{
            fontSize: isMobile ? '0.938rem' : '1rem',
            color: 'rgba(255, 255, 255, 0.85)',
            lineHeight: '1.7',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            {potentialProfit && potentialProfit > 0 ? (
              <>
                If you had bet those picks, you'd be up <strong style={{ color: '#10B981' }}>+${potentialProfit.toFixed(2)}</strong>.
                <br /><br />
                Upgrade now to keep getting these edges.
              </>
            ) : (
              <>
                You've seen the quality. You've seen the depth of analysis.
                <br /><br />
                Upgrade now to unlock every pick, every edge, every night.
              </>
            )}
          </p>

          {/* Stats Callout */}
          <div style={{
            background: 'rgba(0, 217, 255, 0.05)',
            border: '1px solid rgba(0, 217, 255, 0.2)',
            borderRadius: '10px',
            padding: isMobile ? '1rem' : '1.25rem',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: isMobile ? '1.5rem' : '1.75rem',
              fontWeight: '800',
              color: '#00d9ff',
              marginBottom: '0.5rem',
              textShadow: '0 0 15px rgba(0, 217, 255, 0.5)'
            }}>
              26% ROI
            </div>
            <div style={{
              fontSize: isMobile ? '0.813rem' : '0.875rem',
              color: 'rgba(255, 255, 255, 0.7)',
              fontWeight: '600'
            }}>
              Tracked publicly since Oct 2025
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleUpgrade}
            style={{
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              border: '1px solid #F59E0B',
              borderRadius: '12px',
              padding: isMobile ? '1rem 1.5rem' : '1.25rem 2rem',
              color: '#0a0e1a',
              fontSize: isMobile ? '1.125rem' : '1.25rem',
              fontWeight: '800',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              width: '100%',
              boxShadow: '0 0 30px rgba(245, 158, 11, 0.5)',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
              letterSpacing: '0.02em'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 40px rgba(245, 158, 11, 0.7)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(245, 158, 11, 0.5)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Upgrade Now
          </button>

          <p style={{
            fontSize: isMobile ? '0.813rem' : '0.875rem',
            color: 'rgba(255, 255, 255, 0.6)',
            textAlign: 'center',
            marginTop: '1rem',
            marginBottom: 0,
            lineHeight: '1.5'
          }}>
            7-day money-back guarantee · Cancel anytime
          </p>

          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(30px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return null;
};

export default UpgradePrompt;

