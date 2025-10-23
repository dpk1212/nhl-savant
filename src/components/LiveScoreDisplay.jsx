import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';

/**
 * LiveScoreDisplay Component
 * 
 * Displays live NHL scores fetched from live_scores.json
 * Updates automatically when file changes (no need to rescrape odds)
 */
const LiveScoreDisplay = ({ game }) => {
  const [liveScore, setLiveScore] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchLiveScores = async () => {
      try {
        const response = await fetch('/live_scores.json');
        if (!response.ok) {
          // File doesn't exist yet - no scores available
          setLoading(false);
          return;
        }
        
        const data = await response.json();
        
        // Find matching game
        const matchingGame = data.games.find(g => 
          g.awayTeam === game.awayTeam && g.homeTeam === game.homeTeam
        );
        
        if (matchingGame) {
          setLiveScore(matchingGame);
        }
        
        setLoading(false);
      } catch (error) {
        console.warn('Could not fetch live scores:', error);
        setLoading(false);
      }
    };
    
    // Initial fetch
    fetchLiveScores();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchLiveScores, 30000);
    
    return () => clearInterval(interval);
  }, [game.awayTeam, game.homeTeam]);
  
  // Don't show anything if no live score or loading
  if (loading || !liveScore) {
    return null;
  }
  
  // Only show if game has started or finished
  if (liveScore.status === 'SCHEDULED') {
    return null;
  }
  
  return (
    <div style={{
      background: liveScore.status === 'LIVE' 
        ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%)'
        : 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.05) 100%)',
      border: liveScore.status === 'LIVE' 
        ? '1px solid rgba(239, 68, 68, 0.3)'
        : '1px solid rgba(34, 197, 94, 0.3)',
      borderRadius: '8px',
      padding: '0.75rem 1rem',
      marginTop: '0.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem'
    }}>
      {/* Status Badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        {liveScore.status === 'LIVE' && (
          <>
            <Activity 
              size={16} 
              style={{ 
                color: '#EF4444',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              }} 
            />
            <span style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#EF4444',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              LIVE
            </span>
            {liveScore.period > 0 && (
              <span style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-muted)',
                marginLeft: '0.25rem'
              }}>
                P{liveScore.period} {liveScore.clock}
              </span>
            )}
          </>
        )}
        
        {liveScore.status === 'FINAL' && (
          <span style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#22C55E',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            FINAL
          </span>
        )}
      </div>
      
      {/* Score */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        fontSize: '1.125rem',
        fontWeight: '700',
        color: 'var(--color-text-primary)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{ 
            opacity: liveScore.awayScore > liveScore.homeScore ? 1 : 0.6 
          }}>
            {game.awayTeam}
          </span>
          <span style={{
            fontSize: '1.5rem',
            color: liveScore.awayScore > liveScore.homeScore ? '#10B981' : 'var(--color-text-muted)'
          }}>
            {liveScore.awayScore}
          </span>
        </div>
        
        <span style={{ 
          fontSize: '0.875rem', 
          color: 'var(--color-text-muted)',
          fontWeight: '400'
        }}>
          -
        </span>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{
            fontSize: '1.5rem',
            color: liveScore.homeScore > liveScore.awayScore ? '#10B981' : 'var(--color-text-muted)'
          }}>
            {liveScore.homeScore}
          </span>
          <span style={{ 
            opacity: liveScore.homeScore > liveScore.awayScore ? 1 : 0.6 
          }}>
            {game.homeTeam}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LiveScoreDisplay;

// Add pulse animation to your global CSS or App.css:
/*
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
*/

