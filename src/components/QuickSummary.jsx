import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Target, Clock, Zap } from 'lucide-react';
import { BetTypeBadge, EVDisplay, EdgeIndicator, TimeDisplay, ViewButton } from './PremiumComponents';

const QuickSummary = ({ allEdges, dataProcessor, onGameClick }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 640);
      setIsDesktop(window.innerWidth > 1024);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Opportunity Rating System
  // PROFESSIONAL CLASSIFICATION:
  // A+ (Elite):    EV > 10%  - Institutional-grade edge
  // A  (Excellent): EV 7-10% - Strong analytical advantage  
  // B+ (Strong):    EV 5-7%  - High-confidence opportunity
  // B  (Good):      EV 3-5%  - Solid value bet
  // C  (Value):     EV 0-3%  - Marginal edge
  const getRating = (evPercent) => {
    if (evPercent >= 10) return { grade: 'A+', tier: 'ELITE', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.15)', borderColor: '#10B981' };
    if (evPercent >= 7) return { grade: 'A', tier: 'EXCELLENT', color: '#059669', bgColor: 'rgba(5, 150, 105, 0.15)', borderColor: '#059669' };
    if (evPercent >= 5) return { grade: 'B+', tier: 'STRONG', color: '#0EA5E9', bgColor: 'rgba(14, 165, 233, 0.15)', borderColor: '#0EA5E9' };
    if (evPercent >= 3) return { grade: 'B', tier: 'GOOD', color: '#8B5CF6', bgColor: 'rgba(139, 92, 246, 0.15)', borderColor: '#8B5CF6' };
    return { grade: 'C', tier: 'VALUE', color: '#64748B', bgColor: 'rgba(100, 116, 139, 0.15)', borderColor: '#64748B' };
  };

  // Get best bet for each game
  // STANDARD DEFINITIONS:
  // - Opportunity = Any game with at least one bet having EV > 0%
  // - High Value = Any opportunity with best bet EV > 5%
  const opportunities = allEdges.map(game => {
    // Find highest EV bet across all markets
    let bestBet = null;
    let bestEV = 0;

    // Check moneyline
    if (game.edges.moneyline) {
      [game.edges.moneyline.away, game.edges.moneyline.home].forEach(bet => {
        if (bet && bet.evPercent > bestEV) {
          bestEV = bet.evPercent;
          bestBet = { ...bet, type: 'ML' };
        }
      });
    }

    // Check total
    if (game.edges.total) {
      [game.edges.total.over, game.edges.total.under].forEach(bet => {
        if (bet && bet.evPercent > bestEV) {
          bestEV = bet.evPercent;
          bestBet = { ...bet, type: 'TOTAL' };
        }
      });
    }

    return {
      game: game.game,
      time: game.gameTime,
      bestBet,
      edge: game.edges.total?.edge || 0
    };
  }).filter(opp => opp.bestBet && opp.bestBet.evPercent > 0);

  const highValueCount = opportunities.filter(o => o.bestBet.evPercent > 5).length;
  
  // Sort opportunities by EV to get top ones
  const topOpportunities = [...opportunities].sort((a, b) => b.bestBet.evPercent - a.bestBet.evPercent).slice(0, 3);

  // Desktop collapsed view - Compact bar
  if (isDesktop && !isExpanded) {
    return (
      <div style={{
        position: 'sticky',
        top: '60px',
        zIndex: 100,
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        borderRadius: '12px',
        padding: '1rem 1.5rem',
        marginBottom: '1.5rem',
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}
      onClick={() => setIsExpanded(true)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)';
      }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Target size={20} color="var(--color-accent)" />
            <span style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>
              Today's Opportunities
            </span>
            <span style={{ 
              fontSize: '0.875rem', 
              color: 'var(--color-text-muted)',
              fontWeight: '500'
            }}>
              {opportunities.length} Games • {highValueCount} High Value
            </span>
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: 'rgba(212, 175, 55, 0.2)',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: 'var(--color-accent)'
          }}>
            <span>Click to expand</span>
            <ChevronDown size={18} />
          </div>
        </div>
        
        {/* Top 3 opportunities as chips */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {topOpportunities.map((opp, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              padding: '0.5rem 1rem',
              background: 'linear-gradient(135deg, rgba(21, 25, 35, 0.8) 0%, rgba(26, 31, 46, 0.7) 100%)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}>
              <span style={{ fontWeight: '700', fontSize: '0.938rem', color: 'var(--color-text-primary)' }}>
                {opp.game}
              </span>
              <span style={{
                padding: '0.25rem 0.625rem',
                background: opp.bestBet.evPercent > 10 
                  ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                  : opp.bestBet.evPercent > 5
                  ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                  : 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
                color: 'white',
                borderRadius: '6px',
                fontSize: '0.813rem',
                fontWeight: '800',
                letterSpacing: '-0.01em'
              }}>
                +{opp.bestBet.evPercent.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Mobile collapsed view
  if (isMobile && !isExpanded) {
    return (
      <div style={{
        position: 'sticky',
        top: '60px',
        zIndex: 10,
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '8px',
        padding: '0.75rem 1rem',
        marginBottom: '1rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <button
          onClick={() => setIsExpanded(true)}
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-text-primary)',
            fontWeight: '600'
          }}
        >
          <Target size={18} color="var(--color-accent)" style={{ marginRight: '0.5rem' }} />
          <span>Opportunities ({opportunities.length})</span>
          <ChevronDown size={20} color="var(--color-accent)" />
        </button>
      </div>
    );
  }

  return (
    <div style={{
      position: isMobile ? 'relative' : 'sticky',
      top: isMobile ? '0' : '60px',
      zIndex: 100,
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: '8px',
      marginBottom: '1.5rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      overflow: 'hidden',
      backdropFilter: 'blur(8px)'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-hover) 100%)',
        padding: '1rem',
        color: 'var(--color-background)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Target size={20} />
            <span>Today's Betting Opportunities</span>
          </div>
          <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
            {opportunities.length} Games • {highValueCount} High Value
          </div>
        </div>
        
        {/* Collapse button for desktop */}
        {isDesktop && (
          <button
            onClick={() => setIsExpanded(false)}
            style={{
              padding: '0.5rem 1rem',
              background: 'rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '6px',
              cursor: 'pointer',
              color: 'white',
              fontSize: '0.813rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.2)';
            }}
          >
            <ChevronUp size={16} />
            Collapse
          </button>
        )}
      </div>

      {/* Mobile: Collapse button */}
      {isMobile && (
        <button
          onClick={() => setIsExpanded(false)}
          style={{
            width: '100%',
            padding: '0.5rem',
            background: 'rgba(212, 175, 55, 0.1)',
            border: 'none',
            borderBottom: '1px solid var(--color-border)',
            cursor: 'pointer',
            color: 'var(--color-text-secondary)',
            fontSize: '0.813rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ChevronUp size={16} style={{ marginRight: '0.25rem' }} />
          Collapse
        </button>
      )}

      {/* Desktop: Table - Fixed width constraints */}
      {!isMobile ? (
        <div className="table-container" style={{ overflowX: 'auto', overflowY: 'hidden' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            tableLayout: 'fixed',
            minWidth: '800px'
          }}>
            <colgroup>
              <col style={{ width: '20%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '13%' }} />
              <col style={{ width: '13%' }} />
              <col style={{ width: '12%' }} />
            </colgroup>
            <thead>
              <tr style={{ background: 'var(--color-background)' }}>
                <th style={headerStyle}>Game</th>
                <th style={headerStyle}>Time</th>
                <th style={headerStyle}>Best Bet</th>
                <th style={headerStyle}>Edge</th>
                <th style={headerStyle}>EV</th>
                <th style={headerStyle}>Rating</th>
                <th style={headerStyle}></th>
              </tr>
            </thead>
            <tbody>
              {opportunities.map((opp, i) => {
                const rating = getRating(opp.bestBet.evPercent);
                return (
                  <tr 
                    key={i}
                    className="summary-row"
                    style={{ 
                      borderTop: '1px solid var(--color-border)',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative'
                    }}
                  >
                    {/* EV Progress bar background */}
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: `${Math.min(opp.bestBet.evPercent * 3, 100)}%`,
                      background: `linear-gradient(90deg, ${rating.bgColor} 0%, transparent 100%)`,
                      zIndex: 0,
                      pointerEvents: 'none'
                    }} />
                    
                    <td style={{...cellStyle, position: 'relative', zIndex: 1}}>
                      <span style={{ fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>{opp.game}</span>
                    </td>
                    
                    <td style={{...cellStyle, position: 'relative', zIndex: 1}}>
                      <TimeDisplay time={opp.time} />
                    </td>
                    
                    <td style={{...cellStyle, position: 'relative', zIndex: 1}}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <BetTypeBadge type={opp.bestBet.type} />
                        <span style={{ fontWeight: '600', whiteSpace: 'nowrap' }}>{opp.bestBet.pick}</span>
                      </div>
                    </td>
                    
                    <td style={{...cellStyle, position: 'relative', zIndex: 1}}>
                      <EdgeIndicator edge={opp.edge} />
                    </td>
                    
                    <td style={{...cellStyle, position: 'relative', zIndex: 1}}>
                      <EVDisplay evPercent={opp.bestBet.evPercent} showConfidence />
                    </td>
                    
                    <td style={{...cellStyle, position: 'relative', zIndex: 1}}>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        <div style={{
                          padding: '0.375rem 0.75rem',
                          background: rating.bgColor,
                          border: `1px solid ${rating.borderColor}`,
                          borderRadius: '6px',
                          fontWeight: '800',
                          fontSize: '0.875rem',
                          color: rating.color,
                          letterSpacing: '-0.01em',
                          minWidth: '42px',
                          textAlign: 'center'
                        }}>
                          {rating.grade}
                        </div>
                        <div style={{
                          fontSize: '0.625rem',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          color: rating.color,
                          opacity: 0.8
                        }}>
                          {rating.tier}
                        </div>
                      </div>
                    </td>
                    
                    <td style={{...cellStyle, position: 'relative', zIndex: 1, textAlign: 'center'}}>
                      <ViewButton onClick={() => onGameClick(opp.game)} game={opp.game} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        // Mobile: Premium Cards
        <div style={{ padding: '1.25rem 1rem' }}>
          {opportunities.map((opp, i) => {
            const rating = getRating(opp.bestBet.evPercent);
            return (
              <div 
                key={i} 
                className="mobile-opp-card"
                style={{
                  background: 'linear-gradient(135deg, rgba(21, 25, 35, 0.95) 0%, rgba(26, 31, 46, 0.9) 100%)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  marginBottom: '1.25rem',
                  border: `1px solid ${rating.borderColor}`,
                  boxShadow: `0 8px 24px rgba(0, 0, 0, 0.3), 0 0 0 1px ${rating.borderColor}`,
                  position: 'relative',
                  overflow: 'hidden',
                  animation: 'slideInUp 0.4s ease-out',
                  animationDelay: `${i * 0.1}s`,
                  animationFillMode: 'both'
                }}>
                
                {/* Shimmer effect for high value bets */}
                {rating.tier === 'ELITE' || rating.tier === 'EXCELLENT' && (
                  <div className="shimmer-overlay" style={{
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: `linear-gradient(90deg, transparent, ${rating.bgColor}, transparent)`,
                    animation: 'shimmer 3s infinite'
                  }} />
                )}
                
                {/* Rating Badge - Top Right */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: '0.375rem'
                }}>
                  <div style={{
                    background: `linear-gradient(135deg, ${rating.color} 0%, ${rating.borderColor} 100%)`,
                    color: 'white',
                    padding: '0.5rem 0.875rem',
                    borderRadius: '8px',
                    fontSize: '1.25rem',
                    fontWeight: '900',
                    letterSpacing: '-0.02em',
                    boxShadow: `0 4px 12px ${rating.bgColor}`,
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                    minWidth: '52px',
                    textAlign: 'center'
                  }}>
                    {rating.grade}
                  </div>
                  <div style={{
                    fontSize: '0.688rem',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: rating.color,
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                  }}>
                    {rating.tier}
                  </div>
                  <div style={{
                    fontSize: '0.813rem',
                    fontWeight: '700',
                    color: 'white',
                    opacity: 0.9
                  }}>
                    +{opp.bestBet.evPercent.toFixed(1)}%
                  </div>
                </div>
              
              {/* Game Header */}
              <div style={{ marginBottom: '1.25rem', paddingRight: '5rem' }}>
                <div style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '800',
                  color: 'var(--color-text-primary)',
                  marginBottom: '0.5rem',
                  letterSpacing: '-0.02em'
                }}>
                  {opp.game}
                </div>
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.938rem',
                  color: 'var(--color-text-muted)',
                  fontWeight: '500'
                }}>
                  <Clock size={14} />
                  <span>{opp.time}</span>
                </div>
              </div>
              
              {/* Bet Type Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.625rem 1.125rem',
                background: opp.bestBet.type === 'ML' 
                  ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.15) 100%)'
                  : 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(126, 34, 206, 0.15) 100%)',
                border: opp.bestBet.type === 'ML'
                  ? '1px solid rgba(59, 130, 246, 0.4)'
                  : '1px solid rgba(168, 85, 247, 0.4)',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: opp.bestBet.type === 'ML' ? '#60A5FA' : '#A78BFA',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem'
                }}>
                  {opp.bestBet.type === 'ML' ? <Zap size={12} /> : <Target size={12} />}
                  <span>{opp.bestBet.type === 'ML' ? 'MONEYLINE' : 'TOTAL'}</span>
                </span>
              </div>
              
              {/* Pick */}
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '900',
                color: 'var(--color-accent)',
                marginBottom: '1.25rem',
                letterSpacing: '-0.03em',
                textShadow: '0 2px 8px rgba(212, 175, 55, 0.3)'
              }}>
                {opp.bestBet.pick}
              </div>
              
              {/* Edge Indicator */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '8px',
                marginBottom: '1.25rem',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <span style={{ 
                  fontSize: '0.813rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--color-text-muted)'
                }}>
                  Edge
                </span>
                <span style={{
                  fontSize: '1.25rem',
                  fontWeight: '900',
                  color: opp.edge > 0 ? 'var(--color-success)' : 'var(--color-danger)',
                  fontFeatureSettings: "'tnum'",
                  letterSpacing: '-0.02em'
                }}>
                  {opp.edge > 0 ? '+' : ''}{opp.edge.toFixed(1)}
                </span>
              </div>
              
              {/* View Button - Full Width Premium */}
              <button
                onClick={() => onGameClick(opp.game)}
                style={{
                  width: '100%',
                  padding: '1.125rem',
                  background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-hover) 100%)',
                  color: 'var(--color-background)',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '1.063rem',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  boxShadow: '0 6px 20px rgba(212, 175, 55, 0.4)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'scale(0.98)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                View Full Analysis →
              </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const headerStyle = {
  padding: '0.75rem 1rem',
  textAlign: 'left',
  fontSize: '0.75rem',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: 'var(--color-text-muted)'
};

const cellStyle = {
  padding: '0.875rem 1rem',
  fontSize: '0.875rem'
};

const getEVColor = (ev) => {
  if (ev >= 10) return '#10B981'; // Bright green
  if (ev >= 5) return '#059669';  // Medium green
  return '#34D399';               // Light green
};

export default QuickSummary;

