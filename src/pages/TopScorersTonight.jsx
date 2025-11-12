import { useState, useMemo } from 'react';
import { Target, TrendingUp, Filter } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import PlayerRankingsTable from '../components/PlayerRankingsTable';
import UpgradeModal from '../components/UpgradeModal';
import { getETDate } from '../utils/dateUtils';

/**
 * Top Scorers Tonight Page
 * 
 * Shows players with the best goal-scoring matchups tonight,
 * combining OddsTrader baseline with sophisticated matchup analysis
 */
function TopScorersTonight({ playerMatchups, dataProcessor }) {
  const { user } = useAuth();
  const { isPremium } = useSubscription(user);
  
  const [selectedGame, setSelectedGame] = useState('all');
  const [positionFilter, setPositionFilter] = useState('all');
  const [sortBy, setSortBy] = useState('otEV'); // otEV, defense, goalie, shots, pace
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

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
        case 'otEV':
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

  // Apply premium gate - free users see top 10
  const visiblePlayers = useMemo(() => {
    if (isPremium) {
      return filteredPlayers;
    }
    return filteredPlayers.slice(0, 10);
  }, [filteredPlayers, isPremium]);

  const isLimitReached = !isPremium && filteredPlayers.length > 10;

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
          {playerMatchups.length === 20 && (
            <p style={{
              fontSize: '0.875rem',
              color: '#64748b',
              margin: '0.5rem 0 0 0',
              fontStyle: 'italic'
            }}>
              Limited to 20 players (OddsTrader initial page load - "Load More" button requires manual scraping)
            </p>
          )}
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
                <option value="otEV">OddsTrader EV</option>
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

        {/* Premium Gate Message */}
        {isLimitReached && (
          <div style={{
            marginTop: '1.5rem',
            background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.1))',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            borderRadius: '0.75rem',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <TrendingUp size={48} color="#fbbf24" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#f1f5f9',
              marginBottom: '0.5rem'
            }}>
              See All {filteredPlayers.length} Players
            </h3>
            <p style={{
              fontSize: '1rem',
              color: '#94a3b8',
              marginBottom: '1.5rem'
            }}>
              Upgrade to premium to unlock all player matchups, detailed analysis, and more
            </p>
            <button
              onClick={() => setShowUpgradeModal(true)}
              style={{
                padding: '0.75rem 2rem',
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                border: 'none',
                borderRadius: '0.5rem',
                color: '#000',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Upgrade Now
            </button>
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        user={user}
      />
    </div>
  );
}

export default TopScorersTonight;

