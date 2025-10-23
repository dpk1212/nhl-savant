import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

const Observatory = ({ dataProcessor, isMobile }) => {
  const [hoveredTeam, setHoveredTeam] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      const container = document.getElementById('observatory-container');
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: isMobile ? 400 : 600
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [isMobile]);

  // Calculate team positions and properties
  const teamData = useMemo(() => {
    if (!dataProcessor) return [];

    const teams = dataProcessor.getTeamsBySituation('5on5');
    if (!teams || teams.length === 0) return [];

    // Find min/max for normalization
    const xGF_values = teams.map(t => t.xGF_per60 || 0).filter(v => v > 0);
    const xGA_values = teams.map(t => t.xGA_per60 || 0).filter(v => v > 0);
    const pdo_values = teams.map(t => t.pdo || 100).filter(v => v > 0);

    const minXGF = Math.min(...xGF_values);
    const maxXGF = Math.max(...xGF_values);
    const minXGA = Math.min(...xGA_values);
    const maxXGA = Math.max(...xGA_values);
    const minPDO = Math.min(...pdo_values);
    const maxPDO = Math.max(...pdo_values);

    // Helper functions
    const normalizeToRange = (value, min, max, rangeMin, rangeMax) => {
      if (max === min) return (rangeMin + rangeMax) / 2;
      return ((value - min) / (max - min)) * (rangeMax - rangeMin) + rangeMin;
    };

    const getPerformanceColor = (team) => {
      const pdo = team.pdo || 100;
      if (pdo > 102) return '#10B981'; // Hot (green)
      if (pdo < 98) return '#EF4444'; // Cold (red)
      return '#3B82F6'; // Neutral (blue)
    };

    const getGlowIntensity = (team) => {
      const pdo = team.pdo || 100;
      const deviation = Math.abs(pdo - 100);
      return Math.min(deviation / 5, 1); // 0-1 scale
    };

    return teams.map(team => ({
      team: team.team,
      name: team.name || team.team,
      // X: Offensive xG/60 (10-90% of width for padding)
      x: normalizeToRange(team.xGF_per60 || 0, minXGF, maxXGF, 10, 90),
      // Y: Defensive xG/60 (inverted - lower is better, so flip)
      y: normalizeToRange(team.xGA_per60 || 0, minXGA, maxXGA, 90, 10),
      // Size: PDO (20-60px range)
      size: normalizeToRange(team.pdo || 100, minPDO, maxPDO, 20, 60),
      color: getPerformanceColor(team),
      glowIntensity: getGlowIntensity(team),
      // Stats for tooltip
      stats: {
        xGF: (team.xGF_per60 || 0).toFixed(2),
        xGA: (team.xGA_per60 || 0).toFixed(2),
        xGD: ((team.xGF_per60 || 0) - (team.xGA_per60 || 0)).toFixed(2),
        pdo: (team.pdo || 100).toFixed(1),
        gamesPlayed: team.gamesPlayed || 0
      }
    }));
  }, [dataProcessor]);

  // Limit teams on mobile
  const displayedTeams = useMemo(() => {
    if (isMobile && teamData.length > 16) {
      // Show top 16 by PDO deviation
      return teamData
        .sort((a, b) => b.glowIntensity - a.glowIntensity)
        .slice(0, 16);
    }
    return teamData;
  }, [teamData, isMobile]);

  if (!dataProcessor || teamData.length === 0) {
    return (
      <div style={{
        padding: isMobile ? '2rem 1rem' : '4rem 2rem',
        textAlign: 'center',
        color: 'var(--color-text-muted)'
      }}>
        Loading observatory data...
      </div>
    );
  }

  return (
    <div 
      id="observatory-container"
      className="observatory-hero"
      style={{
        position: 'relative',
        padding: isMobile ? '2rem 1rem' : '3rem 2rem',
        marginBottom: isMobile ? '2rem' : '3rem',
        background: 'linear-gradient(180deg, #0A0E1A 0%, #1A1F2E 100%)',
        borderRadius: '16px',
        overflow: 'hidden',
        minHeight: isMobile ? '400px' : '600px'
      }}
    >
      {/* Starry background effect */}
      <div className="stars-background" />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          textAlign: 'center',
          marginBottom: isMobile ? '1.5rem' : '2rem',
          position: 'relative',
          zIndex: 2
        }}
      >
        <h2 style={{
          fontSize: isMobile ? '1.5rem' : '2rem',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '0.5rem',
          letterSpacing: '-0.02em'
        }}>
          NHL Analytics Constellation
        </h2>
        <p style={{
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: isMobile ? '0.875rem' : '1rem',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          {displayedTeams.length} teams positioned by offensive vs defensive performance
        </p>
      </motion.div>

      {/* Constellation Canvas */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: dimensions.height,
        marginTop: isMobile ? '1rem' : '2rem'
      }}>
        {/* Quadrant Background Overlays - CORRECTED: Better defense (low xGA) is at TOP */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '50%',
          height: '50%',
          background: 'linear-gradient(45deg, rgba(16, 185, 129, 0.08) 0%, transparent 100%)',
          pointerEvents: 'none',
          borderLeft: '1px dashed rgba(16, 185, 129, 0.2)',
          borderTop: '1px dashed rgba(16, 185, 129, 0.2)'
        }} />
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '50%',
          height: '50%',
          background: 'linear-gradient(225deg, rgba(239, 68, 68, 0.08) 0%, transparent 100%)',
          pointerEvents: 'none',
          borderRight: '1px dashed rgba(239, 68, 68, 0.2)',
          borderBottom: '1px dashed rgba(239, 68, 68, 0.2)'
        }} />

        {/* Quadrant Labels - CORRECTED */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          padding: '0.5rem 0.75rem',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '6px',
          fontSize: isMobile ? '0.688rem' : '0.75rem',
          fontWeight: '700',
          color: '#10B981',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          pointerEvents: 'none'
        }}>
          ✓ ELITE ZONE
        </div>
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          padding: '0.5rem 0.75rem',
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '6px',
          fontSize: isMobile ? '0.688rem' : '0.75rem',
          fontWeight: '700',
          color: '#EF4444',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          pointerEvents: 'none'
        }}>
          ✗ WEAK ZONE
        </div>

        {/* Axis Labels */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          fontSize: '0.688rem',
          color: 'rgba(255, 255, 255, 0.5)',
          textAlign: 'right',
          fontWeight: '600'
        }}>
          <div>Better Offense →</div>
        </div>
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          fontSize: '0.688rem',
          color: 'rgba(255, 255, 255, 0.5)',
          textAlign: 'left',
          fontWeight: '600'
        }}>
          <div>↑ Better Defense</div>
        </div>

        {/* Team Orbs */}
        {displayedTeams.map((team, index) => {
          const isHovered = hoveredTeam === team.team;
          const xPos = (team.x / 100) * dimensions.width;
          const yPos = (team.y / 100) * dimensions.height;

          return (
            <motion.div
              key={team.team}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: index * 0.02,
                type: 'spring',
                stiffness: 200
              }}
              whileHover={{ scale: 1.2, zIndex: 100 }}
              onHoverStart={() => setHoveredTeam(team.team)}
              onHoverEnd={() => setHoveredTeam(null)}
              style={{
                position: 'absolute',
                left: `${xPos}px`,
                top: `${yPos}px`,
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
                zIndex: isHovered ? 100 : 1
              }}
            >
              {/* Team Orb */}
              <div
                className="team-orb"
                style={{
                  width: `${team.size}px`,
                  height: `${team.size}px`,
                  borderRadius: '50%',
                  background: `radial-gradient(circle at 30% 30%, ${team.color}, ${team.color}dd)`,
                  boxShadow: `
                    0 0 ${team.size * 0.5}px ${team.color}${Math.floor(team.glowIntensity * 255).toString(16).padStart(2, '0')},
                    0 0 ${team.size * 1}px ${team.color}${Math.floor(team.glowIntensity * 128).toString(16).padStart(2, '0')},
                    inset 0 0 ${team.size * 0.3}px rgba(255, 255, 255, 0.3)
                  `,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: `${Math.max(team.size * 0.3, 10)}px`,
                  fontWeight: '700',
                  color: 'white',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
                  transition: 'all 0.3s ease'
                }}
              >
                {team.team}
              </div>

              {/* Hover Tooltip */}
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginTop: '10px',
                    padding: '0.75rem 1rem',
                    background: 'rgba(10, 14, 26, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: `2px solid ${team.color}`,
                    borderRadius: '8px',
                    minWidth: '200px',
                    boxShadow: `0 4px 12px rgba(0, 0, 0, 0.5), 0 0 20px ${team.color}40`,
                    pointerEvents: 'none',
                    zIndex: 1000
                  }}
                >
                  <div style={{ fontSize: '0.875rem', fontWeight: '700', marginBottom: '0.5rem', color: team.color }}>
                    {team.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.5' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span>xGF/60:</span>
                      <span style={{ fontWeight: '600', color: '#10B981' }}>{team.stats.xGF}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span>xGA/60:</span>
                      <span style={{ fontWeight: '600', color: '#EF4444' }}>{team.stats.xGA}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span>xGD/60:</span>
                      <span style={{ fontWeight: '600', color: parseFloat(team.stats.xGD) > 0 ? '#10B981' : '#EF4444' }}>
                        {parseFloat(team.stats.xGD) > 0 ? '+' : ''}{team.stats.xGD}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span>PDO:</span>
                      <span style={{ fontWeight: '600' }}>{team.stats.pdo}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Games:</span>
                      <span style={{ fontWeight: '600' }}>{team.stats.gamesPlayed}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        style={{
          marginTop: isMobile ? '1.5rem' : '2rem',
          display: 'flex',
          justifyContent: 'center',
          gap: isMobile ? '1rem' : '2rem',
          flexWrap: 'wrap',
          position: 'relative',
          zIndex: 2
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
          <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Hot (PDO &gt; 102)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3B82F6', boxShadow: '0 0 8px #3B82F6' }} />
          <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Neutral</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444', boxShadow: '0 0 8px #EF4444' }} />
          <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Cold (PDO &lt; 98)</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Observatory;

