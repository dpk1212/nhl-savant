/**
 * Elite Player Hex Grid - Player Discovery & Analysis Tool
 * Hexagonal heatmap visualization focused on individual player analysis
 */

import { useState, useEffect } from 'react';
import { Search, X, TrendingUp, Award, Zap } from 'lucide-react';
import { getElitePlayers } from '../../utils/playerDataProcessor';

const ElitePlayerHexGrid = ({ isMobile }) => {
  const [allPlayers, setAllPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [filterTeam, setFilterTeam] = useState('all');
  const [filterPosition, setFilterPosition] = useState('all');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const data = await getElitePlayers(10); // Get top 10 per category
        
        // Add rank within category
        const withRanks = {
          offensive: data.offensive.map((p, i) => ({ ...p, categoryRank: i + 1 })),
          defensive: data.defensive.map((p, i) => ({ ...p, categoryRank: i + 1 })),
          powerplay: data.powerplay.map((p, i) => ({ ...p, categoryRank: i + 1 })),
          twoway: data.twoway.map((p, i) => ({ ...p, categoryRank: i + 1 }))
        };
        
        // Combine all players into one array with category
        const combined = [
          ...withRanks.offensive,
          ...withRanks.defensive,
          ...withRanks.powerplay,
          ...withRanks.twoway
        ];
        
        console.log('🎯 Elite players loaded:', combined.length);
        setAllPlayers(combined);
        setFilteredPlayers(combined);
      } catch (err) {
        console.error('❌ Error loading players:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter players based on search and filters
  useEffect(() => {
    let filtered = allPlayers;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.team.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Team filter
    if (filterTeam !== 'all') {
      filtered = filtered.filter(p => p.team === filterTeam);
    }

    // Position filter
    if (filterPosition !== 'all') {
      filtered = filtered.filter(p => p.position === filterPosition);
    }

    setFilteredPlayers(filtered);
  }, [searchTerm, filterTeam, filterPosition, allPlayers]);

  // Get unique teams and positions for filters
  const teams = [...new Set(allPlayers.map(p => p.team))].sort();
  const positions = [...new Set(allPlayers.map(p => p.position))].sort();

  if (loading) {
    return <LoadingState isMobile={isMobile} />;
  }

  if (error) {
    return <ErrorState error={error} isMobile={isMobile} />;
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0a0e1a 0%, #0f1419 100%)',
      borderRadius: '16px',
      padding: isMobile ? '1.5rem 1rem' : '2.5rem 2rem',
      marginBottom: isMobile ? '1.5rem' : '2rem',
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid rgba(0, 217, 255, 0.3)',
      boxShadow: '0 0 40px rgba(0, 217, 255, 0.15)'
    }}>
      {/* Background effects */}
      <BackgroundEffects />

      {/* Header */}
      <div style={{ marginBottom: isMobile ? '1.5rem' : '2rem', position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          marginBottom: '0.75rem'
        }}>
          <Award size={24} color="#00d9ff" style={{ filter: 'drop-shadow(0 0 8px #00d9ff)' }} />
          <h2 style={{
            fontSize: isMobile ? '1.5rem' : '2rem',
            fontWeight: '800',
            margin: 0,
            color: '#00d9ff',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            textShadow: '0 0 20px rgba(0, 217, 255, 0.8)'
          }}>
            Elite Player Radar
          </h2>
        </div>
        <p style={{
          fontSize: isMobile ? '0.75rem' : '0.813rem',
          color: '#7aa3b8',
          textAlign: 'center',
          margin: '0 0 1rem 0',
          letterSpacing: '0.05em',
          textTransform: 'uppercase'
        }}>
          {filteredPlayers.length} Elite Players • Click to analyze
        </p>

        {/* Search & Filters */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {/* Search */}
          <div style={{
            position: 'relative',
            flex: isMobile ? '1 1 100%' : '1 1 300px',
            maxWidth: isMobile ? '100%' : '400px'
          }}>
            <Search 
              size={16} 
              color="#00d9ff" 
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                filter: 'drop-shadow(0 0 4px #00d9ff)'
              }}
            />
            <input
              type="text"
              placeholder="Search player or team..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.625rem 0.75rem 0.625rem 2.5rem',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(0, 217, 255, 0.3)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '0.875rem',
                outline: 'none'
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <X size={16} color="#7aa3b8" />
              </button>
            )}
          </div>

          {/* Team Filter */}
          <select
            value={filterTeam}
            onChange={(e) => setFilterTeam(e.target.value)}
            style={{
              padding: '0.625rem 0.75rem',
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(0, 217, 255, 0.3)',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '0.875rem',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="all">All Teams</option>
            {teams.map(team => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>

          {/* Position Filter */}
          <select
            value={filterPosition}
            onChange={(e) => setFilterPosition(e.target.value)}
            style={{
              padding: '0.625rem 0.75rem',
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(0, 217, 255, 0.3)',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '0.875rem',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="all">All Positions</option>
            {positions.map(pos => (
              <option key={pos} value={pos}>{pos}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Key Insights Panel */}
      {filteredPlayers.length > 0 && (
        <InsightsPanel players={filteredPlayers} isMobile={isMobile} />
      )}

      {/* Hexagonal Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile 
          ? 'repeat(auto-fill, minmax(140px, 1fr))'
          : 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: isMobile ? '1rem' : '1.5rem',
        position: 'relative',
        zIndex: 1
      }}>
        {filteredPlayers.map((player, index) => (
          <PlayerHexagon
            key={`${player.playerId}-${player.category}`}
            player={player}
            onClick={() => setSelectedPlayer(player)}
            isMobile={isMobile}
            delay={index * 0.05}
          />
        ))}
      </div>

      {/* Player Detail Modal */}
      {selectedPlayer && (
        <PlayerDetailModal
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          isMobile={isMobile}
        />
      )}
    </div>
  );
};

const InsightsPanel = ({ players, isMobile }) => {
  // Calculate key insights
  const byCategory = {
    offensive: players.filter(p => p.category === 'offensive'),
    defensive: players.filter(p => p.category === 'defensive'),
    powerplay: players.filter(p => p.category === 'powerplay'),
    twoway: players.filter(p => p.category === 'twoway')
  };

  const byTeam = players.reduce((acc, p) => {
    acc[p.team] = (acc[p.team] || 0) + 1;
    return acc;
  }, {});

  const topTeam = Object.entries(byTeam).sort((a, b) => b[1] - a[1])[0];
  const topScorer = byCategory.offensive[0];
  const topDefender = byCategory.defensive[0];
  const avgPoints = byCategory.offensive.length > 0
    ? (byCategory.offensive.reduce((sum, p) => sum + (p.points || 0), 0) / byCategory.offensive.length).toFixed(1)
    : 0;

  const insights = [
    { icon: '🔥', text: topScorer ? `${topScorer.name} leads all scorers (${topScorer.points} PTS in ${topScorer.gamesPlayed} GP)` : null },
    { icon: '🛡️', text: topDefender ? `${topDefender.name} defensive anchor (${topDefender.blocks} BLK)` : null },
    { icon: '🏒', text: topTeam ? `${topTeam[0]} has ${topTeam[1]} elite player${topTeam[1] > 1 ? 's' : ''} (most in league)` : null },
    { icon: '📊', text: `Average elite scorer: ${avgPoints} points` }
  ].filter(i => i.text);

  return (
    <div style={{
      background: 'rgba(0, 217, 255, 0.05)',
      border: '1px solid rgba(0, 217, 255, 0.2)',
      borderRadius: '12px',
      padding: isMobile ? '1rem' : '1.25rem',
      marginBottom: '1.5rem',
      position: 'relative',
      zIndex: 1
    }}>
      <div style={{
        fontSize: '0.75rem',
        color: '#00d9ff',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        marginBottom: '0.75rem',
        textShadow: '0 0 8px rgba(0, 217, 255, 0.6)'
      }}>
        ⚡ KEY INSIGHTS
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: '0.75rem'
      }}>
        {insights.map((insight, i) => (
          <div
            key={i}
            style={{
              fontSize: isMobile ? '0.813rem' : '0.875rem',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span style={{ fontSize: '1.25rem' }}>{insight.icon}</span>
            <span>{insight.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const PlayerHexagon = ({ player, onClick, isMobile, delay }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Get category color
  const categoryColors = {
    offensive: { primary: '#ff4444', secondary: '#ff8800' },
    defensive: { primary: '#4488ff', secondary: '#00d9ff' },
    powerplay: { primary: '#aa44ff', secondary: '#dd66ff' },
    twoway: { primary: '#00d9ff', secondary: '#ffffff' }
  };

  const colors = categoryColors[player.category] || { primary: '#00d9ff', secondary: '#ffffff' };

  // Determine elite tier based on rank
  const getEliteTier = () => {
    if (player.categoryRank === 1) return { label: 'ELITE', badge: '👑', color: '#FFD700' };
    if (player.categoryRank <= 3) return { label: 'SUPERIOR', badge: '⭐', color: '#C0C0C0' };
    if (player.categoryRank <= 5) return { label: 'STRONG', badge: '💪', color: '#CD7F32' };
    return null;
  };

  const tier = getEliteTier();

  // Scale card for top 3
  const isTopThree = player.categoryRank <= 3;
  const cardScale = player.categoryRank === 1 ? 1.05 : isTopThree ? 1.02 : 1;

  // Get primary stat based on category
  const getPrimaryStat = () => {
    switch (player.category) {
      case 'offensive':
        return { label: 'PTS', value: player.points };
      case 'defensive':
        return { label: 'BLK', value: player.blocks };
      case 'powerplay':
        return { label: 'PP PTS', value: player.ppPoints };
      case 'twoway':
        return { label: 'GS', value: player.gameScore?.toFixed(1) };
      default:
        return { label: '---', value: 0 };
    }
  };

  const primaryStat = getPrimaryStat();

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: `linear-gradient(135deg, ${colors.primary}${isTopThree ? '22' : '15'} 0%, ${colors.primary}${isTopThree ? '11' : '08'} 100%)`,
        border: `${isTopThree ? '3px' : '2px'} solid ${colors.primary}${isHovered ? '88' : isTopThree ? '66' : '44'}`,
        borderRadius: '12px',
        padding: isMobile ? '1rem 0.75rem' : '1.25rem 1rem',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: `scale(${isHovered ? cardScale * 1.02 : cardScale}) ${isHovered ? 'translateY(-4px)' : ''}`,
        boxShadow: isHovered 
          ? `0 0 ${isTopThree ? '40px' : '30px'} ${colors.primary}${isTopThree ? '77' : '66'}, 0 8px 16px rgba(0,0,0,0.4)`
          : `0 0 ${isTopThree ? '25px' : '15px'} ${colors.primary}${isTopThree ? '33' : '22'}`,
        position: 'relative',
        overflow: 'hidden',
        animation: `fadeInUp 0.5s ease ${delay}s both`
      }}
    >
      {/* Hexagon glow effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '80px',
        height: '80px',
        background: `radial-gradient(circle, ${colors.secondary}20, transparent)`,
        opacity: isHovered ? 1 : 0.5,
        transition: 'opacity 0.3s ease',
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        {/* Elite Tier Badge */}
        {tier && (
          <div style={{
            position: 'absolute',
            top: '-0.5rem',
            right: '-0.5rem',
            background: `linear-gradient(135deg, ${tier.color} 0%, ${tier.color}cc 100%)`,
            borderRadius: '20px',
            padding: '0.25rem 0.5rem',
            fontSize: '0.625rem',
            fontWeight: '800',
            color: '#0a0e1a',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            boxShadow: `0 0 15px ${tier.color}88`,
            zIndex: 2
          }}>
            <span>{tier.badge}</span>
            <span>{tier.label}</span>
          </div>
        )}
        
        {/* Category Rank */}
        <div style={{
          position: 'absolute',
          top: '-0.5rem',
          left: '-0.5rem',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.75rem',
          fontWeight: '900',
          color: '#0a0e1a',
          boxShadow: `0 0 12px ${colors.primary}88`,
          zIndex: 2
        }}>
          #{player.categoryRank}
        </div>
        
        {/* Player Name */}
        <div style={{
          fontSize: isMobile ? '0.875rem' : '0.938rem',
          fontWeight: '800',
          color: '#ffffff',
          marginBottom: '0.375rem',
          textShadow: `0 0 ${isTopThree ? '12px' : '10px'} ${colors.primary}${isTopThree ? '99' : '88'}`,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {player.name}
        </div>

        {/* Team & Position */}
        <div style={{
          fontSize: '0.75rem',
          color: colors.primary,
          fontWeight: '700',
          marginBottom: '0.75rem',
          textShadow: `0 0 6px ${colors.primary}66`
        }}>
          {player.team} • {player.position}
        </div>

        {/* Primary Stat - BIG */}
        <div style={{
          fontSize: isMobile ? '1.75rem' : '2.25rem',
          fontWeight: '900',
          color: colors.primary,
          textShadow: `0 0 20px ${colors.primary}aa`,
          marginBottom: '0.25rem',
          lineHeight: 1
        }}>
          {primaryStat.value}
        </div>

        {/* Stat Label */}
        <div style={{
          fontSize: '0.688rem',
          color: '#7aa3b8',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          {primaryStat.label}
        </div>

        {/* Games Played */}
        <div style={{
          fontSize: '0.625rem',
          color: '#7aa3b8',
          marginTop: '0.5rem'
        }}>
          {player.gamesPlayed} GP
        </div>
      </div>

      {/* Hover indicator */}
      {isHovered && (
        <div style={{
          position: 'absolute',
          bottom: '0.5rem',
          right: '0.5rem',
          fontSize: '0.625rem',
          color: colors.primary,
          fontWeight: '700',
          textShadow: `0 0 6px ${colors.primary}88`
        }}>
          CLICK TO VIEW
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

const PlayerDetailModal = ({ player, onClose, isMobile }) => {
  const categoryColors = {
    offensive: { primary: '#ff4444', secondary: '#ff8800' },
    defensive: { primary: '#4488ff', secondary: '#00d9ff' },
    powerplay: { primary: '#aa44ff', secondary: '#dd66ff' },
    twoway: { primary: '#00d9ff', secondary: '#ffffff' }
  };

  const colors = categoryColors[player.category];

  // Get all stats for this player
  const getDetailedStats = () => {
    switch (player.category) {
      case 'offensive':
        return [
          { label: 'Points', value: player.points, max: 50 },
          { label: 'Goals', value: player.goals, max: 30 },
          { label: 'High Danger xG', value: player.highDangerxGoals?.toFixed(2), max: 10 },
          { label: 'Game Score', value: player.gameScore?.toFixed(1), max: 40 }
        ];
      case 'defensive':
        return [
          { label: 'Blocks', value: player.blocks, max: 50 },
          { label: 'Hits', value: player.hits, max: 100 },
          { label: 'Takeaways', value: player.takeaways, max: 25 },
          { label: 'On-Ice xGA', value: player.onIceXGA?.toFixed(1), max: 20, inverse: true }
        ];
      case 'powerplay':
        return [
          { label: 'PP Points', value: player.ppPoints, max: 20 },
          { label: 'PP Goals', value: player.ppGoals, max: 12 },
          { label: 'PP xGoals', value: player.ppxGoals?.toFixed(2), max: 8 },
          { label: 'PP TOI (min)', value: player.ppIceTime, max: 120 }
        ];
      case 'twoway':
        return [
          { label: 'Game Score', value: player.gameScore?.toFixed(1), max: 40 },
          { label: 'On-Ice xG%', value: (player.onIceXGPercent * 100)?.toFixed(1) + '%', max: 100 },
          { label: 'Points', value: player.points, max: 50 },
          { label: 'Plus/Minus', value: player.plusMinus > 0 ? '+' + player.plusMinus : player.plusMinus, showBar: false }
        ];
      default:
        return [];
    }
  };

  const stats = getDetailedStats();

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease'
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #0a0e1a 0%, #0f1419 100%)',
          border: `2px solid ${colors.primary}66`,
          borderRadius: '16px',
          padding: isMobile ? '1.5rem' : '2rem',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: `0 0 60px ${colors.primary}44`,
          position: 'relative',
          animation: 'scaleIn 0.3s ease'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 0.2s ease'
          }}
        >
          <X size={20} color="#ffffff" />
        </button>

        {/* Player Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            fontSize: isMobile ? '1.5rem' : '2rem',
            fontWeight: '900',
            color: '#ffffff',
            marginBottom: '0.5rem',
            textShadow: `0 0 20px ${colors.primary}88`
          }}>
            {player.name}
          </div>
          <div style={{
            fontSize: '1rem',
            color: colors.primary,
            fontWeight: '700',
            marginBottom: '0.5rem',
            textShadow: `0 0 10px ${colors.primary}66`
          }}>
            {player.team} • {player.position} • {player.gamesPlayed} GP
          </div>
          <div style={{
            display: 'inline-block',
            padding: '0.375rem 0.75rem',
            background: `${colors.primary}22`,
            border: `1px solid ${colors.primary}44`,
            borderRadius: '20px',
            fontSize: '0.75rem',
            color: colors.primary,
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {player.category.replace('powerplay', 'power play')}
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {stats.map((stat, index) => (
            <div key={index}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '0.5rem'
              }}>
                <span style={{
                  color: '#7aa3b8',
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}>
                  {stat.label}
                </span>
                <span style={{
                  color: '#ffffff',
                  fontSize: '1rem',
                  fontWeight: '800',
                  textShadow: `0 0 8px ${colors.primary}66`
                }}>
                  {stat.value}
                </span>
              </div>
              {stat.showBar !== false && (
                <div style={{
                  height: '8px',
                  background: 'rgba(0, 0, 0, 0.5)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${Math.min((parseFloat(stat.value) / stat.max) * 100, 100)}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
                    boxShadow: `0 0 10px ${colors.primary}88`,
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

const LoadingState = ({ isMobile }) => (
  <div style={{
    background: 'linear-gradient(135deg, #0a0e1a 0%, #0f1419 100%)',
    borderRadius: '16px',
    padding: isMobile ? '2rem 1rem' : '3rem 2rem',
    marginBottom: isMobile ? '1.5rem' : '2rem',
    textAlign: 'center',
    color: '#00d9ff',
    border: '1px solid rgba(0, 217, 255, 0.2)'
  }}>
    <div style={{ fontSize: '0.875rem', letterSpacing: '0.1em' }}>SCANNING ELITE PLAYERS...</div>
  </div>
);

const ErrorState = ({ error, isMobile }) => (
  <div style={{
    background: 'linear-gradient(135deg, #1a0a0e 0%, #190f14 100%)',
    borderRadius: '16px',
    padding: isMobile ? '2rem 1rem' : '3rem 2rem',
    marginBottom: isMobile ? '1.5rem' : '2rem',
    textAlign: 'center',
    color: '#ff4444',
    border: '1px solid rgba(255, 68, 68, 0.3)'
  }}>
    <div style={{ fontSize: '0.875rem', letterSpacing: '0.05em' }}>⚠️ PLAYER DATA UNAVAILABLE</div>
    <div style={{ fontSize: '0.75rem', color: '#7aa3b8', marginTop: '0.5rem' }}>{error}</div>
  </div>
);

const BackgroundEffects = () => (
  <>
    {/* Scanline */}
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '2px',
      background: 'linear-gradient(90deg, transparent, #00d9ff, transparent)',
      animation: 'scanline 3s linear infinite',
      opacity: 0.6
    }} />
    
    {/* Grid pattern */}
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: 'linear-gradient(rgba(0, 217, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 217, 255, 0.03) 1px, transparent 1px)',
      backgroundSize: '20px 20px',
      opacity: 0.4,
      pointerEvents: 'none'
    }} />

    <style>{`
      @keyframes scanline {
        0% { transform: translateY(0); }
        100% { transform: translateY(800px); }
      }
    `}</style>
  </>
);

export default ElitePlayerHexGrid;

