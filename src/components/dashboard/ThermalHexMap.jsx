/**
 * Thermal Hexagon Map - Sophisticated NHL Player Performance Visualization
 * 150 elite players displayed as tessellated hexagon clusters with dynamic thermal response
 */

import React, { useState, useEffect, useMemo } from 'react';
import { getTop150PlayersWithLensScores } from '../../utils/playerDataProcessor';

const ThermalHexMap = ({ isMobile }) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeLens, setActiveLens] = useState('overall');
  const [hoveredPlayer, setHoveredPlayer] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Load player data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const data = await getTop150PlayersWithLensScores();
        setPlayers(data);
        console.log(`✅ Thermal Hexmap: ${data.length} players loaded`);
      } catch (err) {
        console.error('❌ Error loading thermal hexmap data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Hexagon geometry constants
  const HEX_SIZE = isMobile ? 12 : 16; // Radius of individual hexagon
  const HEX_CLUSTER_SIZE = HEX_SIZE * 3.5; // Size of 7-hex cluster
  const COLS = isMobile ? 10 : 15;
  const ROWS = isMobile ? 15 : 10;

  // Get thermal color based on score (0-100)
  const getThermalColor = (score) => {
    if (score >= 85) return '#ffffff'; // Hot: White
    if (score >= 70) return '#00d9ff'; // Warm: Cyan
    if (score >= 50) return '#4488ff'; // Cool: Blue
    if (score >= 30) return '#1a3a5f'; // Cold: Dark blue
    return '#0a0e1a'; // Frozen: Near black
  };

  // Get thermal glow intensity based on score
  const getThermalGlow = (score) => {
    if (score >= 85) return '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(0, 217, 255, 0.6)';
    if (score >= 70) return '0 0 15px rgba(0, 217, 255, 0.7), 0 0 30px rgba(0, 217, 255, 0.4)';
    if (score >= 50) return '0 0 10px rgba(68, 136, 255, 0.5)';
    if (score >= 30) return '0 0 5px rgba(26, 58, 95, 0.3)';
    return 'none';
  };

  // Get score for current lens
  const getScoreForLens = (player) => {
    switch (activeLens) {
      case 'offense': return player.offenseScore;
      case 'defense': return player.defenseScore;
      case 'special': return player.specialTeamsScore;
      case 'efficiency': return player.efficiencyScore;
      default: return player.overallScore;
    }
  };

  // Filter players by search term
  const filteredPlayers = useMemo(() => {
    if (!searchTerm) return players;
    const term = searchTerm.toLowerCase();
    return players.filter(p => 
      p.name.toLowerCase().includes(term) ||
      p.team.toLowerCase().includes(term)
    );
  }, [players, searchTerm]);

  // Sort players by current lens score for top 10 identification
  const sortedByLens = useMemo(() => {
    return [...filteredPlayers].sort((a, b) => getScoreForLens(b) - getScoreForLens(a));
  }, [filteredPlayers, activeLens]);

  const top10PlayerIds = useMemo(() => {
    return new Set(sortedByLens.slice(0, 10).map(p => p.playerId));
  }, [sortedByLens]);

  // Generate hexagon path (pointy-top orientation)
  const getHexagonPath = (cx, cy, size) => {
    const angles = [30, 90, 150, 210, 270, 330];
    const points = angles.map(angle => {
      const rad = (angle * Math.PI) / 180;
      const x = cx + size * Math.cos(rad);
      const y = cy + size * Math.sin(rad);
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')} Z`;
  };

  // Generate 7-hexagon cluster positions for a player
  const getHexClusterPositions = (centerX, centerY) => {
    const hexHeight = HEX_SIZE * Math.sqrt(3);
    const positions = [
      { x: centerX, y: centerY }, // Center hex
      { x: centerX + HEX_SIZE * 1.5, y: centerY - hexHeight / 2 }, // Top right
      { x: centerX + HEX_SIZE * 1.5, y: centerY + hexHeight / 2 }, // Bottom right
      { x: centerX, y: centerY + hexHeight }, // Bottom
      { x: centerX - HEX_SIZE * 1.5, y: centerY + hexHeight / 2 }, // Bottom left
      { x: centerX - HEX_SIZE * 1.5, y: centerY - hexHeight / 2 }, // Top left
      { x: centerX, y: centerY - hexHeight } // Top
    ];
    return positions;
  };

  // Calculate grid position for player index
  const getPlayerGridPosition = (index) => {
    const row = Math.floor(index / COLS);
    const col = index % COLS;
    
    // Offset every other row for proper hexagon tessellation
    const xOffset = (row % 2) * (HEX_CLUSTER_SIZE * 0.75);
    const x = col * (HEX_CLUSTER_SIZE * 1.5) + xOffset + HEX_CLUSTER_SIZE;
    const y = row * (HEX_CLUSTER_SIZE * Math.sqrt(3) * 0.75) + HEX_CLUSTER_SIZE;
    
    return { x, y };
  };

  // SVG viewBox dimensions
  const svgWidth = COLS * HEX_CLUSTER_SIZE * 1.5 + HEX_CLUSTER_SIZE;
  const svgHeight = ROWS * HEX_CLUSTER_SIZE * Math.sqrt(3) * 0.75 + HEX_CLUSTER_SIZE;

  if (loading) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #0a0e1a 0%, #0f1419 100%)',
        border: '1px solid rgba(0, 217, 255, 0.3)',
        borderRadius: '12px',
        padding: '3rem',
        textAlign: 'center',
        minHeight: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>
          <div style={{
            fontSize: '1rem',
            color: '#00d9ff',
            marginBottom: '1rem',
            letterSpacing: '0.1em',
            textShadow: '0 0 10px rgba(0, 217, 255, 0.6)'
          }}>
            INITIALIZING THERMAL SCANNER...
          </div>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid rgba(0, 217, 255, 0.3)',
            borderTop: '3px solid #00d9ff',
            borderRadius: '50%',
            margin: '0 auto',
            animation: 'spin 1s linear infinite',
            boxShadow: '0 0 20px rgba(0, 217, 255, 0.4)'
          }} />
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error || filteredPlayers.length === 0) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #0a0e1a 0%, #0f1419 100%)',
        border: '1px solid rgba(255, 68, 68, 0.3)',
        borderRadius: '12px',
        padding: '2rem',
        textAlign: 'center',
        color: '#ff4444'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
        <div style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
          {error ? 'Error loading thermal map' : 'No players found'}
        </div>
        <div style={{ fontSize: '0.875rem', color: '#7aa3b8' }}>
          {error || 'Try adjusting your search'}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0a0e1a 0%, #0f1419 100%)',
      border: '1px solid rgba(0, 217, 255, 0.3)',
      borderRadius: '12px',
      padding: isMobile ? '1rem' : '1.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background grid pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'linear-gradient(rgba(0, 217, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 217, 255, 0.02) 1px, transparent 1px)',
        backgroundSize: '30px 30px',
        opacity: 0.5,
        pointerEvents: 'none'
      }} />

      {/* Header */}
      <div style={{ position: 'relative', zIndex: 2, marginBottom: '1.5rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h2 style={{
              fontSize: isMobile ? '1.25rem' : '1.5rem',
              fontWeight: '800',
              color: '#00d9ff',
              marginBottom: '0.25rem',
              letterSpacing: '0.05em',
              textShadow: '0 0 15px rgba(0, 217, 255, 0.6)'
            }}>
              🔥 THERMAL PLAYER MAP
            </h2>
            <div style={{
              fontSize: '0.813rem',
              color: '#7aa3b8',
              letterSpacing: '0.03em'
            }}>
              {filteredPlayers.length} elite players • Dynamic thermal response
            </div>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Search player or team..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              background: 'rgba(0, 217, 255, 0.05)',
              border: '1px solid rgba(0, 217, 255, 0.2)',
              borderRadius: '8px',
              padding: '0.5rem 0.75rem',
              fontSize: '0.875rem',
              color: '#ffffff',
              outline: 'none',
              width: isMobile ? '100%' : '250px'
            }}
          />
        </div>

        {/* Lens Switcher */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'overall', label: 'Overall Impact', icon: '⚡' },
            { id: 'offense', label: 'Offense', icon: '🎯' },
            { id: 'defense', label: 'Defense', icon: '🛡️' },
            { id: 'special', label: 'Special Teams', icon: '⭐' },
            { id: 'efficiency', label: 'Efficiency', icon: '💎' }
          ].map(lens => (
            <button
              key={lens.id}
              onClick={() => setActiveLens(lens.id)}
              style={{
                background: activeLens === lens.id 
                  ? 'linear-gradient(135deg, rgba(0, 217, 255, 0.2) 0%, rgba(0, 217, 255, 0.1) 100%)'
                  : 'rgba(0, 217, 255, 0.05)',
                border: `2px solid ${activeLens === lens.id ? '#00d9ff' : 'rgba(0, 217, 255, 0.2)'}`,
                borderRadius: '20px',
                padding: isMobile ? '0.5rem 0.75rem' : '0.5rem 1rem',
                fontSize: isMobile ? '0.75rem' : '0.813rem',
                color: activeLens === lens.id ? '#00d9ff' : '#7aa3b8',
                fontWeight: '700',
                letterSpacing: '0.05em',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: activeLens === lens.id ? '0 0 15px rgba(0, 217, 255, 0.4)' : 'none',
                textShadow: activeLens === lens.id ? '0 0 10px rgba(0, 217, 255, 0.6)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem'
              }}
            >
              <span>{lens.icon}</span>
              <span>{isMobile ? lens.label.split(' ')[0] : lens.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Thermal Hexagon Grid */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        overflow: 'auto',
        maxHeight: isMobile ? '500px' : '700px'
      }}>
        <svg
          width="100%"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{
            display: 'block',
            minHeight: isMobile ? '400px' : '600px'
          }}
        >
          {/* Scanline animation overlay */}
          <defs>
            <linearGradient id="scanline" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(0, 217, 255, 0)" />
              <stop offset="50%" stopColor="rgba(0, 217, 255, 0.3)" />
              <stop offset="100%" stopColor="rgba(0, 217, 255, 0)" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Render player hexagon clusters */}
          {filteredPlayers.map((player, index) => {
            const { x, y } = getPlayerGridPosition(index);
            const clusterPositions = getHexClusterPositions(x, y);
            const score = getScoreForLens(player);
            const color = getThermalColor(score);
            const isTop10 = top10PlayerIds.has(player.playerId);
            const isHovered = hoveredPlayer?.playerId === player.playerId;

            return (
              <g
                key={player.playerId}
                onMouseEnter={() => setHoveredPlayer(player)}
                onMouseLeave={() => setHoveredPlayer(null)}
                onClick={() => setSelectedPlayer(player)}
                style={{ cursor: 'pointer' }}
              >
                {/* 7-hexagon cluster */}
                {clusterPositions.map((pos, hexIndex) => (
                  <path
                    key={hexIndex}
                    d={getHexagonPath(pos.x, pos.y, HEX_SIZE * 0.95)}
                    fill={color}
                    stroke={isHovered ? '#00d9ff' : 'rgba(0, 217, 255, 0.1)'}
                    strokeWidth={isHovered ? 2 : 0.5}
                    filter={isTop10 || isHovered ? 'url(#glow)' : 'none'}
                    opacity={isHovered ? 1 : (score < 30 ? 0.4 : 0.8)}
                    style={{
                      transition: 'all 0.5s ease',
                      animation: isTop10 ? 'pulse 2s ease-in-out infinite' : 'none'
                    }}
                  />
                ))}
                
                {/* Player name on hover */}
                {isHovered && (
                  <text
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#ffffff"
                    fontSize={isMobile ? "8" : "10"}
                    fontWeight="800"
                    style={{
                      pointerEvents: 'none',
                      textShadow: '0 0 8px rgba(0, 0, 0, 0.8)'
                    }}
                  >
                    {player.name.split(' ').pop()}
                  </text>
                )}
              </g>
            );
          })}

          {/* Scanline animation */}
          <rect
            x="0"
            y="0"
            width={svgWidth}
            height="20"
            fill="url(#scanline)"
            opacity="0.6"
          >
            <animate
              attributeName="y"
              from="0"
              to={svgHeight}
              dur="3s"
              repeatCount="indefinite"
            />
          </rect>
        </svg>
      </div>

      {/* Hover Tooltip */}
      {hoveredPlayer && (
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.15) 0%, rgba(0, 217, 255, 0.05) 100%)',
          border: '2px solid #00d9ff',
          borderRadius: '12px',
          padding: '1rem 1.5rem',
          boxShadow: '0 0 30px rgba(0, 217, 255, 0.5)',
          backdropFilter: 'blur(10px)',
          zIndex: 10,
          minWidth: isMobile ? '80%' : '400px'
        }}>
          <div style={{
            fontSize: '1.125rem',
            fontWeight: '800',
            color: '#ffffff',
            marginBottom: '0.5rem',
            textShadow: '0 0 10px rgba(0, 217, 255, 0.6)'
          }}>
            {hoveredPlayer.name}
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.5rem',
            fontSize: '0.813rem'
          }}>
            <div>
              <span style={{ color: '#7aa3b8' }}>Team: </span>
              <span style={{ color: '#ffffff', fontWeight: '700' }}>{hoveredPlayer.team}</span>
            </div>
            <div>
              <span style={{ color: '#7aa3b8' }}>Position: </span>
              <span style={{ color: '#ffffff', fontWeight: '700' }}>{hoveredPlayer.position}</span>
            </div>
            <div>
              <span style={{ color: '#7aa3b8' }}>Thermal: </span>
              <span style={{ 
                color: getThermalColor(getScoreForLens(hoveredPlayer)), 
                fontWeight: '800',
                textShadow: `0 0 8px ${getThermalColor(getScoreForLens(hoveredPlayer))}`
              }}>
                {getScoreForLens(hoveredPlayer)}/100
              </span>
            </div>
            <div>
              <span style={{ color: '#7aa3b8' }}>Points: </span>
              <span style={{ color: '#ffffff', fontWeight: '700' }}>{hoveredPlayer.points}</span>
            </div>
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: '#7aa3b8',
            marginTop: '0.5rem',
            fontStyle: 'italic'
          }}>
            Click for detailed breakdown
          </div>
        </div>
      )}

      {/* Player Detail Modal */}
      {selectedPlayer && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
          onClick={() => setSelectedPlayer(null)}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #0a0e1a 0%, #0f1419 100%)',
              border: '2px solid #00d9ff',
              borderRadius: '16px',
              padding: isMobile ? '1.5rem' : '2rem',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: '0 0 50px rgba(0, 217, 255, 0.6)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '1.5rem'
            }}>
              <div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '800',
                  color: '#00d9ff',
                  marginBottom: '0.25rem',
                  textShadow: '0 0 15px rgba(0, 217, 255, 0.6)'
                }}>
                  {selectedPlayer.name}
                </h3>
                <div style={{ fontSize: '0.875rem', color: '#7aa3b8' }}>
                  {selectedPlayer.team} • {selectedPlayer.position} • {selectedPlayer.gamesPlayed} GP
                </div>
              </div>
              <button
                onClick={() => setSelectedPlayer(null)}
                style={{
                  background: 'rgba(255, 68, 68, 0.1)',
                  border: '2px solid #ff4444',
                  borderRadius: '8px',
                  padding: '0.5rem 1rem',
                  color: '#ff4444',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                Close
              </button>
            </div>

            {/* Lens Scores */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{
                fontSize: '0.813rem',
                color: '#00d9ff',
                fontWeight: '700',
                marginBottom: '0.75rem',
                letterSpacing: '0.05em'
              }}>
                THERMAL SIGNATURES
              </div>
              {[
                { label: 'Overall Impact', value: selectedPlayer.overallScore },
                { label: 'Offense', value: selectedPlayer.offenseScore },
                { label: 'Defense', value: selectedPlayer.defenseScore },
                { label: 'Special Teams', value: selectedPlayer.specialTeamsScore },
                { label: 'Efficiency', value: selectedPlayer.efficiencyScore }
              ].map(({ label, value }) => (
                <div key={label} style={{ marginBottom: '0.75rem' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.25rem',
                    fontSize: '0.813rem'
                  }}>
                    <span style={{ color: '#7aa3b8' }}>{label}</span>
                    <span style={{ 
                      color: getThermalColor(value),
                      fontWeight: '800',
                      textShadow: `0 0 8px ${getThermalColor(value)}`
                    }}>
                      {value}/100
                    </span>
                  </div>
                  <div style={{
                    height: '8px',
                    background: 'rgba(0, 0, 0, 0.5)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    border: '1px solid rgba(0, 217, 255, 0.2)'
                  }}>
                    <div style={{
                      width: `${value}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, ${getThermalColor(value)} 0%, ${getThermalColor(value)}cc 100%)`,
                      boxShadow: getThermalGlow(value),
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Raw Stats */}
            <div>
              <div style={{
                fontSize: '0.813rem',
                color: '#00d9ff',
                fontWeight: '700',
                marginBottom: '0.75rem',
                letterSpacing: '0.05em'
              }}>
                RAW STATISTICS
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.75rem',
                fontSize: '0.875rem'
              }}>
                {[
                  { label: 'Points', value: selectedPlayer.points },
                  { label: 'Goals', value: selectedPlayer.goals },
                  { label: 'Assists', value: selectedPlayer.assists },
                  { label: 'Shots', value: selectedPlayer.shots },
                  { label: 'Blocks', value: selectedPlayer.blocks },
                  { label: 'Hits', value: selectedPlayer.hits },
                  { label: 'Takeaways', value: selectedPlayer.takeaways },
                  { label: 'PP Points', value: selectedPlayer.ppPoints }
                ].map(({ label, value }) => (
                  <div key={label}>
                    <span style={{ color: '#7aa3b8' }}>{label}: </span>
                    <span style={{ color: '#ffffff', fontWeight: '700' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pulse animation for top 10 */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default ThermalHexMap;

