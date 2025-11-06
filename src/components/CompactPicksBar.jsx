import { useState } from 'react';
import { TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';

// Add CSS keyframes for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }
  
  @keyframes ping {
    0% {
      transform: scale(1);
      opacity: 0.8;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.4;
    }
    100% {
      transform: scale(1);
      opacity: 0.8;
    }
  }
`;
if (!document.getElementById('compact-picks-bar-animations')) {
  style.id = 'compact-picks-bar-animations';
  document.head.appendChild(style);
}

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

export default function CompactPicksBar({ gameGroups, onViewAll, onGameClick, opportunityStats, isFree, hasReachedLimit, isPremium, onUpgradeClick }) {
  const [isExpanded, setIsExpanded] = useState(false); // COLLAPSED BY DEFAULT
  
  // Detect mobile for compact layout
  const isMobile = window.innerWidth <= 768;

  if (!gameGroups || gameGroups.length === 0) {
    return null;
  }

  const handleToggleExpand = () => {
    // FREE USERS: Show paywall when trying to expand
    if (!isPremium && !isExpanded) {
      if (onUpgradeClick) {
        onUpgradeClick();
      }
      return;
    }
    
    // PREMIUM USERS: Toggle normally
    setIsExpanded(!isExpanded);
  };

  const scrollToGames = () => {
    if (onViewAll) {
      onViewAll();
    }
  };

  const handleGameClick = (game) => {
    if (onGameClick) {
      onGameClick(game);
    }
  };

  const totalPicks = gameGroups.reduce((sum, group) => sum + group.bets.length, 0);

  return (
    <div style={{
      background: 'rgba(17, 24, 39, 0.4)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(148, 163, 184, 0.08)',
      borderRadius: '12px',
      padding: isMobile ? '0.625rem' : '1.25rem',
      marginBottom: isMobile ? '1rem' : '1.5rem',
      transition: 'all 0.3s ease'
    }}>
      {/* PREMIUM Sleek Header - Clean & Minimal */}
      <div 
        onClick={handleToggleExpand}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(212, 175, 55, 0.03)';
          e.currentTarget.style.borderRadius = '8px';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: isMobile ? '0.75rem' : '1rem',
          paddingBottom: isExpanded ? (isMobile ? '0.625rem' : '0.875rem') : '0',
          paddingTop: isMobile ? '0.25rem' : '0.375rem',
          paddingLeft: isMobile ? '0.375rem' : '0.5rem',
          paddingRight: isMobile ? '0.375rem' : '0.5rem',
          marginLeft: isMobile ? '-0.375rem' : '-0.5rem',
          marginRight: isMobile ? '-0.375rem' : '-0.5rem',
          marginTop: isMobile ? '-0.375rem' : '-0.5rem',
          borderBottom: isExpanded ? '1px solid rgba(148, 163, 184, 0.08)' : 'none',
          marginBottom: isExpanded ? (isMobile ? '0.625rem' : '0.875rem') : (isMobile ? '-0.375rem' : '-0.5rem'),
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          userSelect: 'none'
        }}
      >
        {/* Left: Icon + Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
          <TrendingUp size={isMobile ? 14 : 16} color="#D4AF37" strokeWidth={2.5} />
          <h3 style={{
            margin: 0,
            fontSize: isMobile ? '0.875rem' : '0.938rem',
            fontWeight: '700',
            color: '#D4AF37',
            letterSpacing: '-0.015em',
            whiteSpace: 'nowrap'
          }}>
            Today's Picks
          </h3>
        </div>
        
        {/* Right: Compact Stats + Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.75rem' : '1rem', flexShrink: 0 }}>
          {/* Single Combined Stat */}
          {opportunityStats && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              padding: '0.25rem 0.625rem',
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              borderRadius: '6px'
            }}>
              {opportunityStats.elite > 0 && (
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                  <span style={{ fontSize: isMobile ? '0.813rem' : '0.875rem', fontWeight: '700', color: '#D4AF37' }}>
                    {opportunityStats.elite}
                  </span>
                  <span style={{ fontSize: '0.625rem', color: 'rgba(212, 175, 55, 0.7)', fontWeight: '600', textTransform: 'lowercase' }}>
                    elite
                  </span>
                </div>
              )}
              
              {opportunityStats.elite > 0 && opportunityStats.total > opportunityStats.elite && (
                <div style={{ width: '1px', height: '10px', background: 'rgba(212, 175, 55, 0.3)' }} />
              )}
              
              {opportunityStats.total > opportunityStats.elite && (
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                  <span style={{ fontSize: isMobile ? '0.813rem' : '0.875rem', fontWeight: '700', color: '#94A3B8' }}>
                    {totalPicks}
                  </span>
                  <span style={{ fontSize: '0.625rem', color: 'rgba(148, 163, 184, 0.7)', fontWeight: '600', textTransform: 'lowercase' }}>
                    {totalPicks === 1 ? 'pick' : 'picks'}
                  </span>
                </div>
              )}
            </div>
          )}
          
          {/* Minimal Toggle Button */}
          <div 
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)';
              e.currentTarget.style.transform = 'scale(1.05)';
              e.stopPropagation();
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(212, 175, 55, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.25)';
              e.currentTarget.style.transform = 'scale(1)';
              e.stopPropagation();
            }}
            style={{
              width: isMobile ? '28px' : '32px',
              height: isMobile ? '28px' : '32px',
              borderRadius: '8px',
              background: 'rgba(212, 175, 55, 0.08)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
          >
            {isExpanded ? (
              <ChevronUp size={isMobile ? 16 : 18} color="#D4AF37" strokeWidth={2.5} />
            ) : (
              <ChevronDown size={isMobile ? 16 : 18} color="#D4AF37" strokeWidth={2.5} />
            )}
          </div>
        </div>
      </div>

      {/* Collapsible Content */}
      {isExpanded && (
        <div style={{
          animation: 'expandDown 0.3s ease-out'
        }}>
          {/* Disclaimer */}
          <div style={{
            fontSize: '0.6875rem',
            color: '#94A3B8',
            marginBottom: '0.625rem',
            padding: isMobile ? '0.375rem 0.625rem' : '0.5rem 0.75rem',
            background: 'rgba(100, 116, 139, 0.06)',
            border: '1px solid rgba(100, 116, 139, 0.12)',
            borderRadius: '6px',
            lineHeight: '1.5',
            letterSpacing: '0.01em'
          }}>
            Algorithm scans live odds throughout the day. Picks shown were flagged at favorable odds—game cards may no longer display these as recommended if odds have shifted.
          </div>

          {/* Game Groups - Horizontal Scroll */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            overflowX: 'auto',
            overflowY: 'hidden',
            margin: isMobile ? '0 -0.875rem' : '0 -1.5rem',
            padding: isMobile ? '0 0.875rem 0.375rem 0.875rem' : '0 1.5rem 0.5rem 1.5rem',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
          className="picks-scroll">
            {gameGroups.map((gameGroup, groupIndex) => (
              <div
                key={groupIndex}
                onClick={() => handleGameClick(gameGroup.game)}
                style={{
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid rgba(148, 163, 184, 0.08)',
                  borderRadius: '12px',
                  padding: isMobile ? '0.75rem' : '1rem',
                  minWidth: '280px',
                  maxWidth: '320px',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                className="game-group-card"
              >
                {/* Game Header */}
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: '#94A3B8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.875rem',
                  paddingBottom: '0.75rem',
                  borderBottom: '1px solid rgba(148, 163, 184, 0.08)'
                }}>
                  {gameGroup.game}
                </div>

                {/* Picks List */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.625rem'
                }}>
                  {gameGroup.bets.map((bet, betIndex) => (
                    <div
                      key={betIndex}
                      style={{
                        background: `linear-gradient(135deg, ${getGradeColor(bet.grade)}12 0%, ${getGradeColor(bet.grade)}08 100%)`,
                        border: `1px solid ${getGradeColor(bet.grade)}35`,
                        borderRadius: '8px',
                        padding: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.625rem',
                        transition: 'all 0.2s ease'
                      }}
                      className="pick-item"
                    >
                      {/* Market Icon */}
                      <span style={{
                        fontSize: '1.125rem',
                        flexShrink: 0,
                        opacity: 0.9
                      }}>
                        {getMarketIcon(bet.market)}
                      </span>

                      {/* Pick Details */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: '#F1F5F9',
                          marginBottom: '0.25rem',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {bet.pick}
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#94A3B8',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <span>{bet.odds > 0 ? `+${bet.odds}` : bet.odds}</span>
                          <span style={{ color: getGradeColor(bet.grade), fontWeight: '700' }}>
                            {bet.edge}
                          </span>
                        </div>
                      </div>

                      {/* Grade Badge */}
                      <div style={{
                        background: getGradeColor(bet.grade),
                        color: '#000',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        lineHeight: '1',
                        flexShrink: 0,
                        boxShadow: `0 2px 8px ${getGradeColor(bet.grade)}40`
                      }}>
                        {bet.grade}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes expandDown {
          from {
            opacity: 0;
            max-height: 0;
            transform: scaleY(0.95);
          }
          to {
            opacity: 1;
            max-height: 500px;
            transform: scaleY(1);
          }
        }

        .picks-scroll::-webkit-scrollbar {
          display: none;
        }

        .game-group-card:hover {
          border-color: rgba(148, 163, 184, 0.15);
          background: rgba(15, 23, 42, 0.7);
        }

        .pick-item:hover {
          transform: translateX(3px);
          border-color: ${getGradeColor('A')}60;
          background: linear-gradient(135deg, ${getGradeColor('A')}18 0%, ${getGradeColor('A')}12 100%);
        }

        @media (max-width: 768px) {
          .elevated-card {
            padding: 1.25rem !important;
            margin-bottom: 1.25rem !important;
          }

          .picks-scroll {
            margin: 0 -1.25rem !important;
            padding: 0 1.25rem 0.5rem 1.25rem !important;
          }

          .game-group-card {
            min-width: 260px !important;
            padding: 0.875rem !important;
          }
        }

        @media (max-width: 640px) {
          .elevated-card {
            padding: 1rem !important;
            margin-bottom: 1rem !important;
          }

          .picks-scroll {
            margin: 0 -1rem !important;
            padding: 0 1rem 0.5rem 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}
