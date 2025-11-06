import { useState } from 'react';
import { TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';

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

export default function CompactPicksBar({ gameGroups, onViewAll, onGameClick, opportunityStats }) {
  const [isExpanded, setIsExpanded] = useState(false); // COLLAPSED BY DEFAULT

  if (!gameGroups || gameGroups.length === 0) {
    return null;
  }

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
    <div className="elevated-card" style={{
      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      border: '1px solid rgba(148, 163, 184, 0.1)',
      borderRadius: '16px',
      padding: '1.5rem',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      marginBottom: '1.5rem',
      animation: 'fadeIn 0.4s ease-out'
    }}>
      {/* Header with Icon, Count, and Toggle */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          paddingBottom: isExpanded ? '1rem' : '0',
          borderBottom: isExpanded ? '1px solid rgba(148, 163, 184, 0.1)' : 'none',
          marginBottom: isExpanded ? '1.25rem' : '0',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
      >
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
        }}>
          <TrendingUp size={20} color="#fff" strokeWidth={2.5} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{
            margin: 0,
            fontSize: '1.125rem',
            fontWeight: '700',
            color: '#F1F5F9',
            letterSpacing: '-0.01em'
          }}>
            Today's Picks
          </h3>
        </div>
        
        {/* Opportunity Stats - Integrated */}
        {opportunityStats && (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <div style={{
              background: 'rgba(59, 130, 246, 0.12)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '6px',
              padding: '0.25rem 0.5rem',
              fontSize: '0.75rem',
              fontWeight: '700',
              color: '#60A5FA',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <span style={{ fontSize: '0.875rem' }}>{opportunityStats.total}</span>
              <span style={{ fontSize: '0.625rem', opacity: 0.8, textTransform: 'uppercase' }}>+EV</span>
            </div>
            
            {opportunityStats.elite > 0 && (
              <div style={{
                background: 'rgba(212, 175, 55, 0.12)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '6px',
                padding: '0.25rem 0.5rem',
                fontSize: '0.75rem',
                fontWeight: '700',
                color: '#D4AF37',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <span style={{ fontSize: '0.875rem' }}>{opportunityStats.elite}</span>
                <span style={{ fontSize: '0.625rem', opacity: 0.8, textTransform: 'uppercase' }}>Elite</span>
              </div>
            )}
          </div>
        )}
        
        <div style={{
          background: 'rgba(59, 130, 246, 0.15)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '8px',
          padding: '0.375rem 0.75rem',
          fontSize: '0.875rem',
          fontWeight: '700',
          color: '#60A5FA'
        }}>
          {totalPicks} {totalPicks === 1 ? 'Pick' : 'Picks'}
        </div>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease'
        }}>
          {isExpanded ? (
            <ChevronUp size={20} color="#60A5FA" strokeWidth={2.5} />
          ) : (
            <ChevronDown size={20} color="#60A5FA" strokeWidth={2.5} />
          )}
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
            marginBottom: '1rem',
            padding: '0.5rem 0.75rem',
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
            margin: '0 -1.5rem',
            padding: '0 1.5rem 0.5rem 1.5rem',
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
                  padding: '1rem',
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
