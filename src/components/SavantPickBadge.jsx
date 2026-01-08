import { useState } from 'react';

/**
 * 🏆 SAVANT PICK BADGE
 * A subtle, premium badge indicating a human-curated recommended play
 * Positioned in the top-right corner of game cards
 */
const SavantPickBadge = ({ isMobile = false, showTooltip = true }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badge Container */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
          padding: isMobile ? '0.3rem 0.5rem' : '0.35rem 0.6rem',
          borderRadius: '6px',
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.08) 100%)',
          border: '1px solid rgba(251, 191, 36, 0.35)',
          boxShadow: '0 2px 8px rgba(251, 191, 36, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(4px)',
          transition: 'all 0.3s ease',
          cursor: 'default',
        }}
      >
        {/* Star Icon */}
        <svg 
          width={isMobile ? "10" : "11"} 
          height={isMobile ? "10" : "11"} 
          viewBox="0 0 24 24" 
          fill="rgba(251, 191, 36, 0.9)"
          style={{
            filter: 'drop-shadow(0 1px 3px rgba(251, 191, 36, 0.4))',
          }}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        
        {/* Badge Text */}
        <span
          style={{
            fontSize: isMobile ? '0.625rem' : '0.688rem',
            fontWeight: '700',
            color: 'rgba(251, 191, 36, 0.95)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            lineHeight: 1,
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
          }}
        >
          Savant Pick
        </span>
      </div>
      
      {/* Tooltip on hover */}
      {showTooltip && isHovered && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '8px',
            width: isMobile ? '200px' : '240px',
            padding: '0.75rem',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 100%)',
            border: '1px solid rgba(251, 191, 36, 0.25)',
            borderRadius: '10px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div style={{
            fontSize: '0.75rem',
            fontWeight: '600',
            color: 'rgba(251, 191, 36, 0.95)',
            marginBottom: '0.4rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}>
            <span>⭐</span> Savant Pick
          </div>
          <div style={{
            fontSize: '0.688rem',
            color: 'rgba(255, 255, 255, 0.75)',
            lineHeight: 1.5,
          }}>
            Analyst-enhanced selection with additional situational conviction layered on our quantitative models.
          </div>
          
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-4px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default SavantPickBadge;

