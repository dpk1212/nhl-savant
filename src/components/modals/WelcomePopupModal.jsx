import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { 
  calculateROI, 
  getStartDate, 
  calculateDollarGrowth,
  getWeeksSinceStart 
} from '../../utils/performanceStats';

const WelcomePopupModal = ({ isOpen, onClose, todaysGames, isMobile }) => {
  const navigate = useNavigate();
  const [roi, setRoi] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      // Fetch dynamic ROI stats
      calculateROI().then(roiValue => {
        setRoi(roiValue);
        setLoading(false);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUnlock = () => {
    onClose();
    navigate('/pricing');
  };

  // Calculate dynamic stats
  const startDate = getStartDate();
  const weeks = getWeeksSinceStart();
  const dollarGrowth = roi ? calculateDollarGrowth(1000, roi) : '$1,000 → $1,260';
  const roiDisplay = roi ? `${Math.round(roi)}%` : '26%';

  // Filter today's games for picks with positive EV
  const picksToday = todaysGames?.filter(game => 
    game.bestEdge && game.bestEdge.ev > 0
  ) || [];

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
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '1rem',
        animation: 'fadeIn 0.3s ease-out'
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #0a0e1a 0%, #0f1419 100%)',
          border: '1px solid rgba(0, 217, 255, 0.3)',
          borderRadius: '15px',
          maxWidth: isMobile ? '95%' : '650px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: isMobile ? '1.5rem' : '2.5rem',
          position: 'relative',
          boxShadow: '0 0 60px rgba(0, 217, 255, 0.3)',
          color: '#ffffff',
          animation: 'slideUp 0.4s ease-out'
        }}
      >
        {/* Scanline effect */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #00d9ff, transparent)',
          animation: 'scanline 3s linear infinite',
          opacity: 0.7,
          zIndex: 2
        }} />

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'rgba(0, 217, 255, 0.7)',
            transition: 'color 0.3s ease',
            zIndex: 3,
            padding: '0.5rem'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#00d9ff'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(0, 217, 255, 0.7)'}
        >
          <X size={24} />
        </button>

        {/* ROI Hero Section */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{
            fontSize: isMobile ? '2rem' : '2.5rem',
            fontWeight: '800',
            color: '#00d9ff',
            marginBottom: '1rem',
            textShadow: '0 0 20px rgba(0, 217, 255, 0.6)',
            letterSpacing: '-0.03em',
            lineHeight: '1.1'
          }}>
            🏆 {roiDisplay} ROI SINCE {startDate.toUpperCase()}
          </h1>
          <p style={{
            fontSize: isMobile ? '1rem' : '1.125rem',
            color: 'rgba(255, 255, 255, 0.9)',
            lineHeight: '1.6',
            margin: 0
          }}>
            That means {dollarGrowth} in ~{weeks} weeks.
            <br />
            Every pick tracked publicly. Zero bullshit.
          </p>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(0, 217, 255, 0.3), transparent)',
          marginBottom: '2rem'
        }} />

        {/* Pain Points Section */}
        <div style={{
          background: 'rgba(255, 107, 107, 0.05)',
          border: '1px solid rgba(255, 107, 107, 0.2)',
          borderRadius: '12px',
          padding: isMobile ? '1.25rem' : '1.5rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: isMobile ? '1.25rem' : '1.5rem',
            fontWeight: '700',
            color: '#ffffff',
            marginTop: 0,
            marginBottom: '1rem',
            letterSpacing: '-0.02em'
          }}>
            ❌ WHAT YOU'RE DOING WRONG
          </h2>
          <p style={{
            fontSize: isMobile ? '0.938rem' : '1rem',
            color: 'rgba(255, 255, 255, 0.85)',
            lineHeight: '1.7',
            marginBottom: '1rem'
          }}>
            The public:
          </p>
          <ul style={{
            fontSize: isMobile ? '0.875rem' : '0.938rem',
            color: 'rgba(255, 255, 255, 0.85)',
            lineHeight: '1.8',
            margin: 0,
            paddingLeft: '1.5rem'
          }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong style={{ color: '#ff6b6b' }}>Hammers overs</strong> (ignoring defensive matchups)
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong style={{ color: '#ff6b6b' }}>Bets heavy favorites</strong> (inflating their odds)
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong style={{ color: '#ff6b6b' }}>Chases star players</strong> (McDavid, Matthews)
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong style={{ color: '#ff6b6b' }}>Follows Twitter touts</strong> (fake records)
            </li>
          </ul>
          <p style={{
            fontSize: isMobile ? '0.938rem' : '1rem',
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: '600',
            marginTop: '1rem',
            marginBottom: 0
          }}>
            Result: 📉 Long-term losses
          </p>
        </div>

        {/* Model Differentiation Section */}
        <div style={{
          background: 'rgba(0, 217, 255, 0.05)',
          border: '1px solid rgba(0, 217, 255, 0.2)',
          borderRadius: '12px',
          padding: isMobile ? '1.25rem' : '1.5rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: isMobile ? '1.25rem' : '1.5rem',
            fontWeight: '700',
            color: '#ffffff',
            marginTop: 0,
            marginBottom: '1rem',
            letterSpacing: '-0.02em'
          }}>
            ✅ WHAT WE DO DIFFERENTLY
          </h2>
          <p style={{
            fontSize: isMobile ? '0.938rem' : '1rem',
            color: 'rgba(255, 255, 255, 0.85)',
            lineHeight: '1.7',
            marginBottom: '1rem'
          }}>
            Our algorithm analyzes <strong style={{ color: '#00d9ff' }}>10,000+ data points per game</strong> to find where the public creates mispricing:
          </p>
          <ul style={{
            fontSize: isMobile ? '0.875rem' : '0.938rem',
            color: 'rgba(255, 255, 255, 0.85)',
            lineHeight: '1.8',
            margin: 0,
            paddingLeft: '1.5rem'
          }}>
            <li style={{ marginBottom: '0.5rem' }}>
              📊 Goalie matchups (save %, recent form)
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              📊 Rest & travel (back-to-backs, road trips)
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              📊 Line movement (sharp vs. public money)
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              📊 Public betting % (when everyone's on one side)
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              📊 Expected goals (xG models, shot quality)
            </li>
          </ul>
          <p style={{
            fontSize: isMobile ? '0.938rem' : '1rem',
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: '600',
            marginTop: '1rem',
            marginBottom: 0
          }}>
            Then we show you the picks with <strong style={{ color: '#10B981' }}>PROVEN EDGE</strong>—before the market moves.
          </p>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(0, 217, 255, 0.3), transparent)',
          marginBottom: '2rem'
        }} />

        {/* Tonight's Picks Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{
            fontSize: isMobile ? '1.25rem' : '1.5rem',
            fontWeight: '700',
            color: '#ffffff',
            marginTop: 0,
            marginBottom: '1.5rem',
            letterSpacing: '-0.02em',
            textAlign: 'center'
          }}>
            🎯 TONIGHT: {picksToday.length} EDGE{picksToday.length !== 1 ? 'S' : ''} IDENTIFIED
          </h2>

          {picksToday.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {picksToday.slice(0, 2).map((game, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(0, 217, 255, 0.03)',
                    border: '1px solid rgba(0, 217, 255, 0.2)',
                    borderRadius: '10px',
                    padding: isMobile ? '1rem' : '1.25rem'
                  }}
                >
                  <div style={{
                    fontSize: isMobile ? '0.875rem' : '0.938rem',
                    color: '#00d9ff',
                    fontWeight: '600',
                    marginBottom: '0.75rem'
                  }}>
                    +{game.bestEdge.ev.toFixed(1)}% Expected Value
                  </div>
                  <div style={{
                    fontSize: isMobile ? '0.813rem' : '0.875rem',
                    color: 'rgba(255, 255, 255, 0.85)',
                    marginBottom: '0.75rem'
                  }}>
                    🎯 {Math.round(game.bestEdge.winProbability * 100)}% Model Confidence
                  </div>
                  <div style={{
                    fontSize: isMobile ? '0.813rem' : '0.875rem',
                    color: 'rgba(255, 255, 255, 0.75)',
                    marginBottom: '1rem'
                  }}>
                    Edge: {getEdgeType(game)}
                  </div>
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '8px',
                    padding: '1rem',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ fontSize: '1.125rem' }}>🔒</span>
                    <span style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: isMobile ? '0.813rem' : '0.875rem',
                      fontWeight: '600'
                    }}>
                      TEAM & LINE LOCKED
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              background: 'rgba(0, 217, 255, 0.03)',
              border: '1px solid rgba(0, 217, 255, 0.2)',
              borderRadius: '10px',
              padding: isMobile ? '1.25rem' : '1.5rem',
              textAlign: 'center'
            }}>
              <p style={{
                fontSize: isMobile ? '0.938rem' : '1rem',
                color: 'rgba(255, 255, 255, 0.85)',
                lineHeight: '1.7',
                margin: 0
              }}>
                Today's picks will be posted by 5:00 PM ET.
                <br /><br />
                Sign up now to get instant access when they drop.
              </p>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <button
          onClick={handleUnlock}
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
            letterSpacing: '0.02em',
            animation: 'pulseGlow 2s ease-in-out infinite'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 0 40px rgba(245, 158, 11, 0.8)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 0 30px rgba(245, 158, 11, 0.5)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          🔓 Unlock Tonight's Picks - Start Free
        </button>

        <p style={{
          fontSize: isMobile ? '0.813rem' : '0.875rem',
          color: 'rgba(255, 255, 255, 0.6)',
          textAlign: 'center',
          marginTop: '1.25rem',
          marginBottom: 0,
          lineHeight: '1.6'
        }}>
          No card · Instant access · Cancel anytime
        </p>

        {/* Keyframes for animations */}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes scanline {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          @keyframes pulseGlow {
            0%, 100% { box-shadow: 0 0 30px rgba(245, 158, 11, 0.5); }
            50% { box-shadow: 0 0 40px rgba(245, 158, 11, 0.7); }
          }
        `}</style>
      </div>
    </div>
  );
};

// Helper function to determine edge type from game data
function getEdgeType(game) {
  const factors = [];
  
  if (game.goalieEdge) factors.push('Goalie');
  if (game.restAdvantage) factors.push('Rest');
  if (game.publicBetting) factors.push('Public');
  if (game.lineMovement) factors.push('Line Movement');
  
  if (factors.length === 0) return 'Advanced Metrics';
  return factors.join(' + ');
}

export default WelcomePopupModal;

