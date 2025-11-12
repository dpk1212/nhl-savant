import { useState, useMemo } from 'react';
import { Target } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import PlayerRankingsTable from '../components/PlayerRankingsTable';
import UpgradeModal from '../components/UpgradeModal';
import { getETDate } from '../utils/dateUtils';

/**
 * Top Scorers Tonight Page
 * 
 * Premium feature showing players with the best goal-scoring matchups tonight,
 * powered by sophisticated matchup analysis and advanced modeling
 */
function TopScorersTonight({ playerMatchups, dataProcessor }) {
  const { user } = useAuth();
  const { isPremium } = useSubscription(user);
  
  const [selectedGame, setSelectedGame] = useState('all');
  const [positionFilter, setPositionFilter] = useState('all');
  const [sortBy, setSortBy] = useState('modelEV'); // modelEV, defense, goalie, shots, pace
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Paywall: Entire page is premium-only
  if (!isPremium) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #0f172a, #1e293b)',
        padding: '2rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          maxWidth: '600px',
          background: 'rgba(30, 41, 59, 0.5)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(100, 116, 139, 0.2)',
          borderRadius: '1rem',
          padding: '3rem 2rem',
          textAlign: 'center'
        }}>
          <Target size={64} color="#fbbf24" style={{ margin: '0 auto 1.5rem' }} />
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#f1f5f9',
            marginBottom: '1rem'
          }}>
            Premium Feature
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: '#94a3b8',
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}>
            Top Scoring Matchups is an exclusive feature for Premium subscribers. Get access to advanced player matchup analysis powered by our sophisticated models.
          </p>
          <button
            onClick={() => setShowUpgradeModal(true)}
            style={{
              background: 'linear-gradient(to right, #fbbf24, #f59e0b)',
              color: '#1e293b',
              fontWeight: '700',
              padding: '1rem 2rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.125rem',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = 0.9}
            onMouseLeave={(e) => e.currentTarget.style.opacity = 1}
          >
            Upgrade to Premium
          </button>
        </div>
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          user={user}
        />
      </div>
    );
  }

  // Get unique games for filtering
  const games = useMemo(() => {
    if (!playerMatchups) return [];
    const uniqueGames = [...new Set(playerMatchups.map(p => p.matchup))];
    return uniqueGames;
  }, [playerMatchups]);

  // Filter and sort players
  const filteredPlayers = useMemo(() => {
    if (!playerMatchups) return [];
    
    let players = [...playerMatchups];
    
    // Filter by game
    if (selectedGame !== 'all') {
      players = players.filter(p => p.matchup === selectedGame);
    }
    
    // Filter by position (forwards vs defense)
    if (positionFilter === 'forwards') {
      players = players.filter(p => {
        const pos = p.playerStats?.position || '';
        return pos === 'C' || pos === 'L' || pos === 'R' || pos === 'F';
      });
    } else if (positionFilter === 'defense') {
      players = players.filter(p => {
        const pos = p.playerStats?.position || '';
        return pos === 'D';
      });
    }
    
    // Sort
    players.sort((a, b) => {
      switch(sortBy) {
        case 'modelEV':
          return parseFloat(b.evPercent) - parseFloat(a.evPercent);
        case 'defense':
          // Higher rank = weaker defense = better for scorer
          return (b.matchupFactors?.defense?.rank || 0) - (a.matchupFactors?.defense?.rank || 0);
        case 'goalie':
          // Lower GSAE = struggling goalie = better for scorer
          return (a.matchupFactors?.goalie?.gsae || 0) - (b.matchupFactors?.goalie?.gsae || 0);
        case 'shots':
          return (b.playerStats?.shotsPerGame || 0) - (a.playerStats?.shotsPerGame || 0);
        case 'pace':
          return parseFloat(b.matchupFactors?.pace?.pace || 0) - parseFloat(a.matchupFactors?.pace?.pace || 0);
        case 'shotPct':
          return (b.playerStats?.shootingPercentage || 0) - (a.playerStats?.shootingPercentage || 0);
        default:
          return 0;
      }
    });
    
    return players;
  }, [playerMatchups, selectedGame, positionFilter, sortBy]);

  // All players visible (page is premium-only)
  const visiblePlayers = filteredPlayers;

  if (!playerMatchups || playerMatchups.length === 0) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #0f172a, #1e293b)',
        padding: '2rem 1rem'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          textAlign: 'center',
          padding: '3rem 0'
        }}>
          <Target size={64} color="#64748b" style={{ margin: '0 auto 1.5rem' }} />
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#f1f5f9',
            marginBottom: '1rem'
          }}>
            No Player Props Available
          </h1>
          <p style={{
            fontSize: '1.125rem',
            color: '#94a3b8',
            marginBottom: '2rem'
          }}>
            Run <code style={{ 
              background: '#1e293b', 
              padding: '0.25rem 0.5rem', 
              borderRadius: '0.25rem',
              color: '#fbbf24'
            }}>npm run fetch-player-props</code> to scrape today's props
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #0f172a, #1e293b)',
      padding: '2rem 1rem'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Target size={32} color="#fbbf24" />
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#f1f5f9',
              margin: 0
            }}>
              Top Scoring Matchups
            </h1>
          </div>
          <p style={{
            fontSize: '1rem',
            color: '#94a3b8',
            margin: 0
          }}>
            {getETDate()} • {playerMatchups.length} players analyzed
          </p>
        </div>

        {/* Filter Bar */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(100, 116, 139, 0.2)',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            {/* Game Filter */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#94a3b8',
                marginBottom: '0.5rem'
              }}>
                Game
              </label>
              <select
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  background: '#1e293b',
                  border: '1px solid rgba(100, 116, 139, 0.3)',
                  borderRadius: '0.5rem',
                  color: '#f1f5f9',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                <option value="all">All Matchups ({playerMatchups.length})</option>
                {games.map(game => (
                  <option key={game} value={game}>{game}</option>
                ))}
              </select>
            </div>

            {/* Position Filter */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#94a3b8',
                marginBottom: '0.5rem'
              }}>
                Position
              </label>
              <div style={{
                display: 'flex',
                gap: '0.5rem'
              }}>
                <button
                  onClick={() => setPositionFilter('all')}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    background: positionFilter === 'all' ? '#3b82f6' : '#1e293b',
                    border: '1px solid rgba(100, 116, 139, 0.3)',
                    borderRadius: '0.5rem',
                    color: '#f1f5f9',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  All
                </button>
                <button
                  onClick={() => setPositionFilter('forwards')}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    background: positionFilter === 'forwards' ? '#3b82f6' : '#1e293b',
                    border: '1px solid rgba(100, 116, 139, 0.3)',
                    borderRadius: '0.5rem',
                    color: '#f1f5f9',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Forwards
                </button>
                <button
                  onClick={() => setPositionFilter('defense')}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    background: positionFilter === 'defense' ? '#3b82f6' : '#1e293b',
                    border: '1px solid rgba(100, 116, 139, 0.3)',
                    borderRadius: '0.5rem',
                    color: '#f1f5f9',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Defense
                </button>
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#94a3b8',
                marginBottom: '0.5rem'
              }}>
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  background: '#1e293b',
                  border: '1px solid rgba(100, 116, 139, 0.3)',
                  borderRadius: '0.5rem',
                  color: '#f1f5f9',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                <option value="modelEV">Model EV (Best Value)</option>
                <option value="defense">Opponent Defense (Weakest First)</option>
                <option value="goalie">Goalie GSAE (Worst First)</option>
                <option value="shots">Player SOG (Highest First)</option>
                <option value="pace">Game Pace (Fastest First)</option>
                <option value="shotPct">Shooting % (Highest First)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Visual Legend */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(100, 116, 139, 0.2)',
          borderRadius: '0.75rem',
          padding: '1rem 1.5rem',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                borderRadius: '2px', 
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid #10b981'
              }} />
              <span style={{ color: '#94a3b8' }}>
                <strong style={{ color: '#10b981' }}>Green</strong> = Favorable (weak defense, cold goalie, high volume)
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                borderRadius: '2px', 
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid #ef4444'
              }} />
              <span style={{ color: '#94a3b8' }}>
                <strong style={{ color: '#ef4444' }}>Red</strong> = Unfavorable (strong defense, hot goalie)
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ 
                width: '100%', 
                height: '3px', 
                borderRadius: '2px', 
                background: 'rgba(16, 185, 129, 0.15)'
              }} />
              <span style={{ color: '#94a3b8', fontSize: '0.8125rem', fontStyle: 'italic', whiteSpace: 'nowrap' }}>
                Row highlighted = Elite matchup (3+ favorable factors)
              </span>
            </div>
          </div>
        </div>

        {/* Player Rankings Table */}
        <PlayerRankingsTable 
          players={visiblePlayers}
          isPremium={isPremium}
        />
      </div>
    </div>
  );
}

export default TopScorersTonight;

