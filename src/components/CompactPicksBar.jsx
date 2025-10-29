import { ChevronDown, TrendingUp } from 'lucide-react';

function getGradeColor(grade) {
  switch (grade) {
    case 'A+':
      return '#D4AF37';
    case 'A':
      return '#10B981';
    case 'B+':
      return '#3B82F6';
    case 'B':
      return '#8B5CF6';
    default:
      return '#64748B';
  }
}

function getMarketIcon(market) {
  if (market === 'MONEYLINE') return '🎯';
  if (market === 'TOTAL') return '📊';
  return '🎲';
}

export default function CompactPicksBar({ gameGroups, onViewAll }) {
  if (!gameGroups || gameGroups.length === 0) {
    return null;
  }

  const scrollToGames = () => {
    if (onViewAll) {
      onViewAll();
    }
  };

  const totalPicks = gameGroups.reduce((sum, group) => sum + group.bets.length, 0);

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
        background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
        padding: '0.5rem 1rem',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        flexShrink: 0,
        fontWeight: '600',
        fontSize: '0.9rem',
        boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
      }}>
        <TrendingUp size={18} />
        <span>TODAY'S PICKS</span>
        <span style={{
          background: 'rgba(255, 255, 255, 0.2)',
          padding: '0.125rem 0.5rem',
          borderRadius: '12px',
          fontSize: '0.85rem'
        }}>
          {totalPicks}
        </span>
      </div>

      {/* Games with Grouped Picks */}
      <div className="compact-picks-scroll" style={{
        display: 'flex',
        gap: '1rem',
        flex: 1,
        overflow: 'auto',
        padding: '0.25rem 0'
      }}>
        {gameGroups.map((gameGroup, groupIndex) => (
          <div
            key={groupIndex}
            style={{
              background: 'rgba(31, 41, 55, 0.6)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '10px',
              padding: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              flexShrink: 0,
              minWidth: '280px'
            }}
          >
            {/* Game Header */}
            <div style={{
              fontSize: '0.75rem',
              color: '#94A3B8',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
              paddingBottom: '0.5rem'
            }}>
              {gameGroup.game}
            </div>

            {/* Picks for this game */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {gameGroup.bets.map((bet, betIndex) => (
                <div
                  key={betIndex}
                  className="compact-pick-badge"
                  style={{
                    background: `linear-gradient(135deg, ${getGradeColor(bet.grade)}15 0%, ${getGradeColor(bet.grade)}25 100%)`,
                    border: `1.5px solid ${getGradeColor(bet.grade)}`,
                    borderRadius: '6px',
                    padding: '0.5rem 0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.85rem',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onClick={scrollToGames}
                >
                  {/* Market Icon */}
                  <span style={{ fontSize: '1rem' }}>{getMarketIcon(bet.market)}</span>

                  {/* Pick Text */}
                  <span style={{ fontWeight: '600', whiteSpace: 'nowrap', flex: 1 }}>
                    {bet.pick}
                  </span>

                  {/* Grade Badge */}
                  <span style={{
                    background: getGradeColor(bet.grade),
                    color: '#000',
                    padding: '0.125rem 0.4rem',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: '700'
                  }}>
                    {bet.grade}
                  </span>

                  {/* Odds */}
                  <span style={{ color: '#94A3B8', fontWeight: '500', fontSize: '0.8rem' }}>
                    {bet.odds > 0 ? `+${bet.odds}` : bet.odds}
                  </span>

                  {/* Edge */}
                  <span style={{
                    color: getGradeColor(bet.grade),
                    fontWeight: '600',
                    fontSize: '0.75rem'
                  }}>
                    • {bet.edge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
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
