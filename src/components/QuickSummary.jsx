import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { BetTypeBadge, EVDisplay, EdgeIndicator, TimeDisplay, ViewButton } from './PremiumComponents';

const QuickSummary = ({ allEdges, dataProcessor, onGameClick }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get best bet for each game
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
          <span>🎯 Opportunities ({opportunities.length})</span>
          <ChevronDown size={20} color="var(--color-accent)" />
        </button>
      </div>
    );
  }

  return (
    <div style={{
      position: isMobile ? 'relative' : 'sticky',
      top: isMobile ? '0' : '60px',
      zIndex: 10,
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: '8px',
      marginBottom: '1.5rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-hover) 100%)',
        padding: '1rem',
        color: 'var(--color-background)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.25rem' }}>
          🎯 Today's Betting Opportunities
        </div>
        <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
          {opportunities.length} Games • {highValueCount} High Value
        </div>
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

      {/* Desktop: Table */}
      {!isMobile ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--color-background)' }}>
              <th style={headerStyle}>Game</th>
              <th style={headerStyle}>Time</th>
              <th style={headerStyle}>Best Bet</th>
              <th style={headerStyle}>Edge</th>
              <th style={headerStyle}>EV</th>
              <th style={headerStyle}></th>
            </tr>
          </thead>
          <tbody>
            {opportunities.map((opp, i) => (
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
                  background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.08) 0%, transparent 100%)',
                  zIndex: 0,
                  pointerEvents: 'none'
                }} />
                
                <td style={{...cellStyle, position: 'relative', zIndex: 1}}>
                  <span style={{ fontWeight: '600' }}>{opp.game}</span>
                </td>
                
                <td style={{...cellStyle, position: 'relative', zIndex: 1}}>
                  <TimeDisplay time={opp.time} />
                </td>
                
                <td style={{...cellStyle, position: 'relative', zIndex: 1}}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BetTypeBadge type={opp.bestBet.type} />
                    <span style={{ fontWeight: '600' }}>{opp.bestBet.pick}</span>
                  </div>
                </td>
                
                <td style={{...cellStyle, position: 'relative', zIndex: 1}}>
                  <EdgeIndicator edge={opp.edge} />
                </td>
                
                <td style={{...cellStyle, position: 'relative', zIndex: 1}}>
                  <EVDisplay evPercent={opp.bestBet.evPercent} showConfidence />
                </td>
                
                <td style={{...cellStyle, position: 'relative', zIndex: 1}}>
                  <ViewButton onClick={() => onGameClick(opp.game)} game={opp.game} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        // Mobile: Cards
        <div style={{ padding: '0.5rem' }}>
          {opportunities.map((opp, i) => (
            <div key={i} style={{
              background: 'var(--color-background)',
              borderRadius: '6px',
              padding: '0.75rem',
              marginBottom: '0.5rem',
              border: '1px solid var(--color-border)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: '700' }}>{opp.game}</span>
                <span style={{ fontSize: '0.813rem', color: 'var(--color-text-muted)' }}>{opp.time}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: '600', fontSize: '0.938rem' }}>{opp.bestBet.pick}</span>
                <span style={{ 
                  padding: '0.125rem 0.5rem',
                  background: 'var(--color-success-bg)',
                  color: 'var(--color-success)',
                  borderRadius: '4px',
                  fontSize: '0.813rem',
                  fontWeight: '700'
                }}>
                  +{opp.bestBet.evPercent.toFixed(1)}% EV
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.813rem', color: 'var(--color-text-secondary)' }}>
                  Edge: {opp.edge > 0 ? '+' : ''}{opp.edge.toFixed(1)}
                </span>
                <button
                  onClick={() => onGameClick(opp.game)}
                  style={{
                    padding: '0.375rem 0.75rem',
                    background: 'var(--color-accent)',
                    color: 'var(--color-background)',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.813rem',
                    fontWeight: '600'
                  }}
                >
                  View →
                </button>
              </div>
            </div>
          ))}
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

