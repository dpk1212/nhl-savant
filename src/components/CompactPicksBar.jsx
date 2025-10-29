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
      background: 'rgba(17, 24, 39, 0.4)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      padding: '0.75rem',
      display: 'flex',
      alignItems: 'stretch',
      gap: '0.75rem',
      flexWrap: 'nowrap',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
      animation: 'fadeInSlide 0.3s ease-out'
    }}
    className="compact-picks-bar">
      {/* Count Badge - Subtle */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '0.5rem 0.75rem',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        flexShrink: 0,
        fontWeight: '600',
        fontSize: '0.8rem',
        color: '#94A3B8',
        minWidth: '140px'
      }}>
        <TrendingUp size={14} />
        <span style={{ letterSpacing: '0.5px' }}>PICKS</span>
        <span style={{
          background: 'rgba(59, 130, 246, 0.2)',
          color: '#3B82F6',
          padding: '0.125rem 0.5rem',
          borderRadius: '10px',
          fontSize: '0.7rem',
          fontWeight: '700'
        }}>
          {totalPicks}
        </span>
      </div>

      {/* Games with Grouped Picks - COMPACT */}
      <div className="compact-picks-scroll" style={{
        display: 'flex',
        gap: '0.75rem',
        flex: 1,
        overflowX: 'auto',
        overflowY: 'hidden',
        padding: '0.125rem 0',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>
        {gameGroups.map((gameGroup, groupIndex) => (
          <div
            key={groupIndex}
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '6px',
              padding: '0.5rem 0.65rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
              flexShrink: 0,
              minWidth: '240px',
              maxWidth: '280px'
            }}
          >
            {/* Game Header - COMPACT */}
            <div style={{
              fontSize: '0.65rem',
              color: '#64748B',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              paddingBottom: '0.35rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
            }}>
              {gameGroup.game}
            </div>

            {/* Picks for this game - COMPACT */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {gameGroup.bets.map((bet, betIndex) => (
                <div
                  key={betIndex}
                  className="compact-pick-badge"
                  style={{
                    background: `linear-gradient(90deg, ${getGradeColor(bet.grade)}10 0%, ${getGradeColor(bet.grade)}05 100%)`,
                    border: `1px solid ${getGradeColor(bet.grade)}40`,
                    borderRadius: '4px',
                    padding: '0.4rem 0.55rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.8rem',
                    transition: 'all 0.15s ease',
                    cursor: 'pointer'
                  }}
                  onClick={scrollToGames}
                >
                  {/* Market Icon */}
                  <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>{getMarketIcon(bet.market)}</span>

                  {/* Pick Text */}
                  <span style={{ 
                    fontWeight: '600', 
                    whiteSpace: 'nowrap', 
                    flex: 1,
                    color: '#E2E8F0',
                    fontSize: '0.8rem'
                  }}>
                    {bet.pick}
                  </span>

                  {/* Grade Badge - COMPACT */}
                  <span style={{
                    background: getGradeColor(bet.grade),
                    color: '#000',
                    padding: '0.1rem 0.35rem',
                    borderRadius: '3px',
                    fontSize: '0.65rem',
                    fontWeight: '800',
                    lineHeight: '1'
                  }}>
                    {bet.grade}
                  </span>

                  {/* Odds - COMPACT */}
                  <span style={{ 
                    color: '#94A3B8', 
                    fontWeight: '600', 
                    fontSize: '0.75rem',
                    minWidth: '40px',
                    textAlign: 'right'
                  }}>
                    {bet.odds > 0 ? `+${bet.odds}` : bet.odds}
                  </span>

                  {/* Edge - COMPACT */}
                  <span style={{
                    color: getGradeColor(bet.grade),
                    fontWeight: '700',
                    fontSize: '0.7rem',
                    minWidth: '42px',
                    textAlign: 'right'
                  }}>
                    {bet.edge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* View All Button - SUBTLE */}
      <button
        onClick={scrollToGames}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.25rem',
          padding: '0.5rem 0.75rem',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '6px',
          color: '#94A3B8',
          fontSize: '0.75rem',
          fontWeight: '600',
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'all 0.15s ease',
          minWidth: '70px'
        }}
        className="view-all-button"
      >
        <span>View</span>
        <ChevronDown size={12} />
      </button>

      <style>{`
        @keyframes fadeInSlide {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .compact-picks-bar {
          will-change: transform;
        }
        
        .compact-picks-scroll {
          -webkit-overflow-scrolling: touch;
        }
        
        .compact-picks-scroll::-webkit-scrollbar {
          display: none;
        }
        
        .compact-pick-badge {
          will-change: transform;
        }
        
        .compact-pick-badge:hover {
          transform: translateX(2px);
          border-color: rgba(59, 130, 246, 0.5);
          background: linear-gradient(90deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.08) 100%);
        }
        
        .view-all-button:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(59, 130, 246, 0.3);
          color: #3B82F6;
        }
        
        @media (max-width: 768px) {
          .compact-picks-bar {
            padding: 0.6rem;
            gap: 0.6rem;
          }
          
          .compact-picks-scroll {
            flex: 1;
            min-width: 0;
          }
        }
        
        @media (max-width: 640px) {
          .compact-picks-bar {
            padding: 0.5rem;
            gap: 0.5rem;
          }
          
          .compact-picks-bar > div:first-child {
            min-width: 100px;
            font-size: 0.7rem;
          }
          
          .compact-picks-bar > div:first-child span:first-child {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
