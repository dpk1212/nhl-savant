import { formatGameStatus } from '../utils/basketballGrading';

/**
 * Basketball Live Score Component
 * Displays live score, game status, and clock
 */
export function BasketballLiveScore({ liveScore, prediction }) {
  if (!liveScore) {
    return null;
  }
  
  const status = formatGameStatus(liveScore.status);
  const isLive = liveScore.status === 'live';
  const isFinal = liveScore.status === 'final';
  
  return (
    <div style={{
      background: isLive 
        ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.15))'
        : 'rgba(15, 23, 42, 0.5)',
      border: isLive ? '2px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(71, 85, 105, 0.3)',
      borderRadius: '12px',
      padding: '16px',
      marginTop: '12px'
    }}>
      {/* Status Badge */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '12px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
          fontWeight: 'bold',
          color: status.color
        }}>
          <span style={{ fontSize: '16px' }}>{status.icon}</span>
          {status.text}
          {isLive && liveScore.period && (
            <span style={{ color: '#94a3b8', marginLeft: '8px' }}>
              {formatPeriod(liveScore.period)}
            </span>
          )}
        </div>
        
        {isLive && liveScore.clock && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.2)',
            color: '#ef4444',
            padding: '4px 12px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            {liveScore.clock}
          </div>
        )}
      </div>
      
      {/* Score Display */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        gap: '16px',
        alignItems: 'center'
      }}>
        {/* Away Team */}
        <TeamScore
          team="away"
          score={liveScore.awayScore}
          predicted={prediction.dratings?.awayScore || prediction.haslametrics?.awayScore}
          isWinning={liveScore.awayScore > liveScore.homeScore}
        />
        
        {/* VS */}
        <div style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#64748b'
        }}>
          @
        </div>
        
        {/* Home Team */}
        <TeamScore
          team="home"
          score={liveScore.homeScore}
          predicted={prediction.dratings?.homeScore || prediction.haslametrics?.homeScore}
          isWinning={liveScore.homeScore > liveScore.awayScore}
        />
      </div>
      
      {/* Network/TV */}
      {liveScore.network && (
        <div style={{
          marginTop: '12px',
          fontSize: '12px',
          color: '#94a3b8',
          textAlign: 'center'
        }}>
          📺 {liveScore.network}
        </div>
      )}
      
      {/* Last Updated */}
      {liveScore.lastUpdated && (
        <div style={{
          marginTop: '8px',
          fontSize: '11px',
          color: '#64748b',
          textAlign: 'center'
        }}>
          Updated {new Date(liveScore.lastUpdated).toLocaleTimeString()}
        </div>
      )}
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

