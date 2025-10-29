import { ChevronDown, TrendingUp } from 'lucide-react';

function getGradeColor(grade) {
  switch (grade) {
    case 'A+':
      return { bg: 'rgba(212, 175, 55, 0.15)', text: '#D4AF37', border: 'rgba(212, 175, 55, 0.3)' };
    case 'A':
      return { bg: 'rgba(16, 185, 129, 0.15)', text: '#10B981', border: 'rgba(16, 185, 129, 0.3)' };
    case 'B+':
      return { bg: 'rgba(59, 130, 246, 0.15)', text: '#3B82F6', border: 'rgba(59, 130, 246, 0.3)' };
    case 'B':
      return { bg: 'rgba(139, 92, 246, 0.15)', text: '#8B5CF6', border: 'rgba(139, 92, 246, 0.3)' };
    default:
      return { bg: 'rgba(100, 116, 139, 0.15)', text: '#64748B', border: 'rgba(100, 116, 139, 0.3)' };
  }
}

function getMarketIcon(market) {
  if (market === 'MONEYLINE') return '🎯';
  if (market === 'TOTAL') return '📊';
  return '🎲';
}

export default function CompactPicksBar({ picks, onViewAll }) {
  if (!picks || picks.length === 0) {
    return null;
  }

  const scrollToGames = () => {
    if (onViewAll) {
      onViewAll();
    }
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.98) 0%, rgba(31, 41, 55, 0.98) 100%)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      borderRadius: '12px',
      padding: '0.875rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      flexWrap: 'nowrap',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(59, 130, 246, 0.1)',
      animation: 'fadeInSlide 0.4s ease-out'
    }}
    className="compact-picks-bar">
      {/* Count Badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        flexShrink: 0,
        fontSize: '0.875rem',
        fontWeight: '600',
        color: 'var(--color-text-primary)',
        paddingRight: '1rem',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <TrendingUp size={16} color="#3B82F6" />
        <span>TODAY'S PICKS</span>
        <span style={{
          background: 'rgba(59, 130, 246, 0.2)',
          color: '#3B82F6',
          padding: '0.125rem 0.5rem',
          borderRadius: '0.75rem',
          fontSize: '0.75rem',
          fontWeight: '700'
        }}>
          {picks.length}
        </span>
      </div>

      {/* Picks Badges - Horizontal Scroll */}
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        overflowX: 'auto',
        overflowY: 'hidden',
        flex: 1,
        padding: '0.25rem 0',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch'
      }}
      className="compact-picks-scroll">
        {picks.map((pick, index) => {
          const colors = getGradeColor(pick.grade);
          const icon = getMarketIcon(pick.market);
          
          return (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.875rem',
                background: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: colors.text,
                whiteSpace: 'nowrap',
                flexShrink: 0,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              className="compact-pick-badge"
              onClick={scrollToGames}
            >
              <span>{icon}</span>
              <span>{pick.pick}</span>
              <span style={{
                background: colors.border,
                padding: '0.125rem 0.375rem',
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
                fontWeight: '700'
              }}>
                {pick.grade}
              </span>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                {pick.odds > 0 ? '+' : ''}{pick.odds}
              </span>
              {pick.edge && (
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>
                  • {pick.edge}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* View All Button */}
      <button
        onClick={scrollToGames}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.375rem',
          padding: '0.5rem 0.875rem',
          background: 'rgba(59, 130, 246, 0.15)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '0.5rem',
          color: '#3B82F6',
          fontSize: '0.875rem',
          fontWeight: '600',
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'all 0.2s ease'
        }}
        className="view-all-button"
      >
        View All
        <ChevronDown size={14} />
      </button>

      <style>{`
        @keyframes fadeInSlide {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .compact-picks-bar {
          will-change: transform;
        }
        
        .compact-picks-scroll::-webkit-scrollbar {
          display: none;
        }
        
        .compact-pick-badge {
          will-change: transform;
        }
        
        .compact-pick-badge:hover {
          transform: translateY(-1px) scale(1.02);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
        }
        
        .view-all-button {
          will-change: transform;
        }
        
        .view-all-button:hover {
          background: rgba(59, 130, 246, 0.25);
          border-color: rgba(59, 130, 246, 0.5);
          transform: translateY(-1px);
        }
        
        @media (max-width: 768px) {
          .compact-picks-bar {
            padding: 0.75rem 1rem;
            gap: 0.75rem;
          }
          
          .compact-picks-scroll {
            flex: 1;
            min-width: 0;
          }
        }
      `}</style>
    </div>
  );
}

