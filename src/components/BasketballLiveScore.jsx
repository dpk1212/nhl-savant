import { formatGameStatus } from '../utils/basketballGrading';

/**
 * Basketball Live Score Component
 * Displays live score, game status, and clock
 */
export function BasketballLiveScore({ liveScore, prediction, awayTeam, homeTeam }) {
  if (!liveScore) {
    return null;
  }
  
  const status = formatGameStatus(liveScore.status);
  const isLive = liveScore.status === 'live';
  const isFinal = liveScore.status === 'final';
  
  const isMobile = window.innerWidth < 768;
  
  return (
    <div style={{
      background: isLive 
        ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(220, 38, 38, 0.12))'
        : 'rgba(15, 23, 42, 0.4)',
      border: isLive ? '1.5px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(71, 85, 105, 0.25)',
      borderRadius: '8px',
      padding: isMobile ? '6px 8px' : '8px',
      marginTop: '6px'
    }}>
      {/* Compact Single Line: Status + Score + Clock */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        gap: '8px'
      }}>
        {/* Left: Status Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: isMobile ? '11px' : '12px',
          fontWeight: '700',
          color: status.color,
          flexShrink: 0
        }}>
          <span style={{ fontSize: isMobile ? '12px' : '14px' }}>{status.icon}</span>
          {status.text}
        </div>
        
        {/* Center: Compact Score */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? '6px' : '8px',
          fontSize: isMobile ? '16px' : '18px',
          fontWeight: '900',
          flex: 1,
          justifyContent: 'center'
        }}>
          <span style={{ 
            fontSize: isMobile ? '11px' : '12px',
            color: liveScore.awayScore > liveScore.homeScore ? '#10b981' : 'rgba(255,255,255,0.7)',
            fontWeight: '600'
          }}>
            {awayTeam.length > 12 ? awayTeam.substring(0, 10) + '...' : awayTeam}
          </span>
          <span style={{ color: liveScore.awayScore > liveScore.homeScore ? '#10b981' : '#f1f5f9' }}>
            {liveScore.awayScore}
          </span>
          <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '700' }}>-</span>
          <span style={{ color: liveScore.homeScore > liveScore.awayScore ? '#10b981' : '#f1f5f9' }}>
            {liveScore.homeScore}
          </span>
          <span style={{ 
            fontSize: isMobile ? '11px' : '12px',
            color: liveScore.homeScore > liveScore.awayScore ? '#10b981' : 'rgba(255,255,255,0.7)',
            fontWeight: '600'
          }}>
            {homeTeam.length > 12 ? homeTeam.substring(0, 10) + '...' : homeTeam}
          </span>
        </div>
        
        {/* Right: Clock + Period */}
        {isLive && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: isMobile ? '10px' : '11px',
            fontWeight: '700',
            color: '#ef4444',
            flexShrink: 0
          }}>
            {liveScore.period && (
              <span style={{ color: '#94a3b8' }}>
                {formatPeriod(liveScore.period)}
              </span>
            )}
            {liveScore.clock && (
              <span>{liveScore.clock}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TeamScore({ team, score, predicted, isWinning }) {
  const diff = predicted ? score - predicted : null;
  
  return (
    <div style={{
      textAlign: team === 'away' ? 'right' : 'left'
    }}>
      {/* Actual Score */}
      <div style={{
        fontSize: '36px',
        fontWeight: 'bold',
        color: isWinning ? '#10b981' : '#f1f5f9',
        lineHeight: '1'
      }}>
        {score}
      </div>
      
      {/* Predicted Score & Diff */}
      {predicted !== null && predicted !== undefined && (
        <div style={{
          fontSize: '12px',
          color: '#94a3b8',
          marginTop: '4px'
        }}>
          Predicted: {predicted.toFixed(1)}
          {diff !== null && (
            <span style={{
              marginLeft: '6px',
              color: Math.abs(diff) <= 5 ? '#10b981' : '#ef4444'
            }}>
              ({diff > 0 ? '+' : ''}{diff.toFixed(1)})
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function formatPeriod(period) {
  if (period === 1) return '1st Half';
  if (period === 2) return '2nd Half';
  if (period > 2) return `OT${period - 2}`;
  return '';
}

/**
 * Game Status Filter Component
 * Allows filtering games by status
 */
export function GameStatusFilter({ currentFilter, onFilterChange, counts }) {
  const filters = [
    { value: 'all', label: 'All Games', icon: '🏀' },
    { value: 'pre', label: 'Scheduled', icon: '🕐' },
    { value: 'live', label: 'Live', icon: '🔴' },
    { value: 'final', label: 'Final', icon: '✅' }
  ];
  
  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      marginBottom: '20px',
      flexWrap: 'wrap'
    }}>
      {filters.map(filter => {
        const count = counts[filter.value] || 0;
        const isActive = currentFilter === filter.value;
        
        return (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            style={{
              background: isActive 
                ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                : 'rgba(15, 23, 42, 0.5)',
              border: isActive 
                ? '2px solid #3b82f6'
                : '1px solid rgba(71, 85, 105, 0.3)',
              color: isActive ? '#ffffff' : '#cbd5e1',
              padding: '10px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              if (!isActive) {
                e.target.style.background = 'rgba(30, 41, 59, 0.8)';
                e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)';
              }
            }}
            onMouseLeave={e => {
              if (!isActive) {
                e.target.style.background = 'rgba(15, 23, 42, 0.5)';
                e.target.style.borderColor = 'rgba(71, 85, 105, 0.3)';
              }
            }}
          >
            <span>{filter.icon}</span>
            <span>{filter.label}</span>
            {count > 0 && (
              <span style={{
                background: isActive ? 'rgba(255, 255, 255, 0.2)' : 'rgba(71, 85, 105, 0.5)',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                marginLeft: '4px'
              }}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}


