import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flame, Snowflake, TrendingUp, TrendingDown } from 'lucide-react';

const LeagueHeatmap = ({ dataProcessor, isMobile }) => {
  const [selectedConference, setSelectedConference] = useState('ALL');
  const [hoveredTeam, setHoveredTeam] = useState(null);

  // Team conference mapping
  const conferences = {
    EAST: ['BOS', 'BUF', 'CAR', 'CBJ', 'DET', 'FLA', 'MTL', 'NJD', 'NYI', 'NYR', 'OTT', 'PHI', 'PIT', 'TBL', 'TOR', 'WSH'],
    WEST: ['ANA', 'CGY', 'CHI', 'COL', 'DAL', 'EDM', 'LAK', 'MIN', 'NSH', 'SEA', 'SJS', 'STL', 'UTA', 'VAN', 'VGK', 'WPG']
  };

  // Calculate heatmap data
  const heatmapData = useMemo(() => {
    if (!dataProcessor) return { east: [], west: [], stats: {} };

    const teams = dataProcessor.getTeamsBySituation('5on5');
    if (!teams || teams.length === 0) return { east: [], west: [], stats: {} };

    // Calculate stats for each team
    const teamStats = {};
    teams.forEach(team => {
      const pdo = team.pdo || 100;
      const xGD = (team.xGF_per60 || 0) - (team.xGA_per60 || 0);
      
      // Determine temperature
      let temperature = 'neutral';
      let tempValue = 0;
      
      if (pdo > 102) {
        temperature = 'hot';
        tempValue = Math.min((pdo - 100) / 5, 1); // 0-1 scale
      } else if (pdo < 98) {
        temperature = 'cold';
        tempValue = Math.min((100 - pdo) / 5, 1); // 0-1 scale
      }

      // Determine betting value indicator and regression direction
      const hasValue = Math.abs(pdo - 100) > 2; // PDO anomaly
      let regressionDirection = null;
      if (pdo > 102) regressionDirection = 'FADE'; // Overperforming, bet against
      if (pdo < 98) regressionDirection = 'BACK'; // Underperforming, bet on

      teamStats[team.team] = {
        team: team.team,
        name: team.name || team.team,
        pdo: pdo.toFixed(1),
        xGD: xGD.toFixed(2),
        xGF: (team.xGF_per60 || 0).toFixed(2),
        xGA: (team.xGA_per60 || 0).toFixed(2),
        gamesPlayed: team.gamesPlayed || 0,
        temperature,
        tempValue,
        hasValue,
        regressionDirection
      };
    });

    // Split by conference
    const east = conferences.EAST
      .filter(code => teamStats[code])
      .map(code => teamStats[code]);
    
    const west = conferences.WEST
      .filter(code => teamStats[code])
      .map(code => teamStats[code]);

    return { east, west, stats: teamStats };
  }, [dataProcessor]);

  // Get temperature color
  const getTemperatureColor = (temp, tempValue) => {
    if (temp === 'hot') {
      const intensity = Math.floor(tempValue * 255);
      return `rgba(239, 68, 68, ${0.3 + tempValue * 0.5})`; // Red with varying opacity
    } else if (temp === 'cold') {
      const intensity = Math.floor(tempValue * 255);
      return `rgba(59, 130, 246, ${0.3 + tempValue * 0.5})`; // Blue with varying opacity
    }
    return 'rgba(148, 163, 184, 0.2)'; // Neutral gray
  };

  const getTemperatureBorder = (temp) => {
    if (temp === 'hot') return '2px solid rgba(239, 68, 68, 0.6)';
    if (temp === 'cold') return '2px solid rgba(59, 130, 246, 0.6)';
    return '1px solid rgba(148, 163, 184, 0.3)';
  };

  const getTemperatureIcon = (temp) => {
    if (temp === 'hot') return <Flame size={14} color="#EF4444" />;
    if (temp === 'cold') return <Snowflake size={14} color="#3B82F6" />;
    return null;
  };

  // Filter teams based on selection
  const displayedTeams = useMemo(() => {
    if (selectedConference === 'EAST') return { east: heatmapData.east, west: [] };
    if (selectedConference === 'WEST') return { east: [], west: heatmapData.west };
    return heatmapData;
  }, [selectedConference, heatmapData]);

  // Count hot/cold teams
  const temperatureCounts = useMemo(() => {
    const allTeams = [...heatmapData.east, ...heatmapData.west];
    return {
      hot: allTeams.filter(t => t.temperature === 'hot').length,
      cold: allTeams.filter(t => t.temperature === 'cold').length,
      neutral: allTeams.filter(t => t.temperature === 'neutral').length,
      value: allTeams.filter(t => t.hasValue).length
    };
  }, [heatmapData]);

  if (!dataProcessor || heatmapData.east.length === 0) {
    return (
      <div style={{
        padding: isMobile ? '2rem 1rem' : '3rem 2rem',
        textAlign: 'center',
        color: 'var(--color-text-muted)'
      }}>
        Loading league temperature data...
      </div>
    );
  }

  return (
    <div style={{
      padding: isMobile ? '2rem 1rem' : '3rem 2rem',
      marginBottom: isMobile ? '2rem' : '3rem',
      background: 'linear-gradient(180deg, rgba(26, 31, 46, 0.6) 0%, rgba(10, 14, 26, 0.8) 100%)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          textAlign: 'center',
          marginBottom: isMobile ? '1.5rem' : '2rem'
        }}
      >
        <h2 style={{
          fontSize: isMobile ? '1.5rem' : '2rem',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #EF4444 0%, #3B82F6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '0.5rem',
          letterSpacing: '-0.02em'
        }}>
          League Temperature Map
        </h2>
        <p style={{
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: isMobile ? '0.875rem' : '1rem',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          PDO-based performance tracking • Hot teams overperforming • Cold teams underperforming
        </p>
      </motion.div>

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: isMobile ? '0.75rem' : '1.5rem',
          marginBottom: isMobile ? '1.5rem' : '2rem',
          flexWrap: 'wrap'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          background: 'rgba(239, 68, 68, 0.15)',
          borderRadius: '8px',
          border: '1px solid rgba(239, 68, 68, 0.3)'
        }}>
          <Flame size={16} color="#EF4444" />
          <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#EF4444' }}>
            {temperatureCounts.hot} Hot
          </span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          background: 'rgba(148, 163, 184, 0.15)',
          borderRadius: '8px',
          border: '1px solid rgba(148, 163, 184, 0.3)'
        }}>
          <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#94A3B8' }}>
            {temperatureCounts.neutral} Neutral
          </span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          background: 'rgba(59, 130, 246, 0.15)',
          borderRadius: '8px',
          border: '1px solid rgba(59, 130, 246, 0.3)'
        }}>
          <Snowflake size={16} color="#3B82F6" />
          <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#3B82F6' }}>
            {temperatureCounts.cold} Cold
          </span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          background: 'rgba(255, 215, 0, 0.15)',
          borderRadius: '8px',
          border: '1px solid rgba(255, 215, 0, 0.3)'
        }}>
          <span style={{ fontSize: '1rem' }}>💎</span>
          <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#FFD700' }}>
            {temperatureCounts.value} Value
          </span>
        </div>
      </motion.div>

      {/* Conference Filter */}
      {!isMobile && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
          marginBottom: '2rem'
        }}>
          {['ALL', 'EAST', 'WEST'].map(conf => (
            <button
              key={conf}
              onClick={() => setSelectedConference(conf)}
              style={{
                padding: '0.5rem 1.5rem',
                borderRadius: '8px',
                border: selectedConference === conf 
                  ? '2px solid var(--color-accent)' 
                  : '1px solid rgba(255, 255, 255, 0.2)',
                background: selectedConference === conf 
                  ? 'rgba(212, 175, 55, 0.2)' 
                  : 'rgba(255, 255, 255, 0.05)',
                color: selectedConference === conf 
                  ? 'var(--color-accent)' 
                  : 'var(--color-text-secondary)',
                fontSize: '0.875rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              {conf}
            </button>
          ))}
        </div>
      )}

      {/* Heatmap Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile 
          ? '1fr' 
          : selectedConference === 'ALL' 
          ? '1fr 1fr' 
          : '1fr',
        gap: isMobile ? '1.5rem' : '2rem'
      }}>
        {/* Eastern Conference */}
        {displayedTeams.east.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 style={{
              fontSize: isMobile ? '1rem' : '1.125rem',
              fontWeight: '700',
              color: 'var(--color-text-primary)',
              marginBottom: '1rem',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              Eastern Conference
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(4, 1fr)' : 'repeat(4, 1fr)',
              gap: isMobile ? '0.5rem' : '0.75rem'
            }}>
              {displayedTeams.east.map((team, index) => (
                <motion.div
                  key={team.team}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  whileHover={{ scale: 1.05, zIndex: 10 }}
                  onHoverStart={() => setHoveredTeam(team.team)}
                  onHoverEnd={() => setHoveredTeam(null)}
                  style={{
                    aspectRatio: '1',
                    background: getTemperatureColor(team.temperature, team.tempValue),
                    border: getTemperatureBorder(team.temperature),
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    boxShadow: hoveredTeam === team.team 
                      ? `0 8px 24px ${team.temperature === 'hot' ? 'rgba(239, 68, 68, 0.4)' : team.temperature === 'cold' ? 'rgba(59, 130, 246, 0.4)' : 'rgba(148, 163, 184, 0.4)'}`
                      : 'none'
                  }}
                >
                  {/* Regression indicator */}
                  {team.regressionDirection && (
                    <div style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      fontSize: isMobile ? '0.5rem' : '0.563rem',
                      fontWeight: '800',
                      color: team.regressionDirection === 'FADE' ? '#EF4444' : '#10B981',
                      background: team.regressionDirection === 'FADE' 
                        ? 'rgba(239, 68, 68, 0.3)' 
                        : 'rgba(16, 185, 129, 0.3)',
                      padding: isMobile ? '0.125rem 0.2rem' : '0.125rem 0.25rem',
                      borderRadius: '3px',
                      border: `1px solid ${team.regressionDirection === 'FADE' ? 'rgba(239, 68, 68, 0.6)' : 'rgba(16, 185, 129, 0.6)'}`,
                      letterSpacing: '0.02em',
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                    }}>
                      {team.regressionDirection}
                    </div>
                  )}

                  {/* Temperature icon */}
                  {getTemperatureIcon(team.temperature) && (
                    <div style={{ marginBottom: '0.25rem' }}>
                      {getTemperatureIcon(team.temperature)}
                    </div>
                  )}

                  {/* Team code */}
                  <div style={{
                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                    fontWeight: '800',
                    color: 'var(--color-text-primary)',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                  }}>
                    {team.team}
                  </div>

                  {/* PDO */}
                  <div style={{
                    fontSize: isMobile ? '0.625rem' : '0.688rem',
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontWeight: '600'
                  }}>
                    {team.pdo}
                  </div>

                  {/* Hover tooltip */}
                  {hoveredTeam === team.team && !isMobile && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        marginTop: '8px',
                        padding: '0.75rem',
                        background: 'rgba(10, 14, 26, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: `2px solid ${team.temperature === 'hot' ? '#EF4444' : team.temperature === 'cold' ? '#3B82F6' : '#94A3B8'}`,
                        borderRadius: '8px',
                        minWidth: '180px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                        pointerEvents: 'none',
                        zIndex: 1000
                      }}
                    >
                      <div style={{ fontSize: '0.813rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
                        {team.name}
                      </div>
                      <div style={{ fontSize: '0.688rem', color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.5' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                          <span>PDO:</span>
                          <span style={{ fontWeight: '600' }}>{team.pdo}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                          <span>xGD/60:</span>
                          <span style={{ fontWeight: '600', color: parseFloat(team.xGD) > 0 ? '#10B981' : '#EF4444' }}>
                            {parseFloat(team.xGD) > 0 ? '+' : ''}{team.xGD}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                          <span>xGF/60:</span>
                          <span style={{ fontWeight: '600', color: '#10B981' }}>{team.xGF}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>xGA/60:</span>
                          <span style={{ fontWeight: '600', color: '#EF4444' }}>{team.xGA}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Western Conference */}
        {displayedTeams.west.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 style={{
              fontSize: isMobile ? '1rem' : '1.125rem',
              fontWeight: '700',
              color: 'var(--color-text-primary)',
              marginBottom: '1rem',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              Western Conference
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(4, 1fr)' : 'repeat(4, 1fr)',
              gap: isMobile ? '0.5rem' : '0.75rem'
            }}>
              {displayedTeams.west.map((team, index) => (
                <motion.div
                  key={team.team}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  whileHover={{ scale: 1.05, zIndex: 10 }}
                  onHoverStart={() => setHoveredTeam(team.team)}
                  onHoverEnd={() => setHoveredTeam(null)}
                  style={{
                    aspectRatio: '1',
                    background: getTemperatureColor(team.temperature, team.tempValue),
                    border: getTemperatureBorder(team.temperature),
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    boxShadow: hoveredTeam === team.team 
                      ? `0 8px 24px ${team.temperature === 'hot' ? 'rgba(239, 68, 68, 0.4)' : team.temperature === 'cold' ? 'rgba(59, 130, 246, 0.4)' : 'rgba(148, 163, 184, 0.4)'}`
                      : 'none'
                  }}
                >
                  {/* Regression indicator */}
                  {team.regressionDirection && (
                    <div style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      fontSize: isMobile ? '0.5rem' : '0.563rem',
                      fontWeight: '800',
                      color: team.regressionDirection === 'FADE' ? '#EF4444' : '#10B981',
                      background: team.regressionDirection === 'FADE' 
                        ? 'rgba(239, 68, 68, 0.3)' 
                        : 'rgba(16, 185, 129, 0.3)',
                      padding: isMobile ? '0.125rem 0.2rem' : '0.125rem 0.25rem',
                      borderRadius: '3px',
                      border: `1px solid ${team.regressionDirection === 'FADE' ? 'rgba(239, 68, 68, 0.6)' : 'rgba(16, 185, 129, 0.6)'}`,
                      letterSpacing: '0.02em',
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                    }}>
                      {team.regressionDirection}
                    </div>
                  )}

                  {/* Temperature icon */}
                  {getTemperatureIcon(team.temperature) && (
                    <div style={{ marginBottom: '0.25rem' }}>
                      {getTemperatureIcon(team.temperature)}
                    </div>
                  )}

                  {/* Team code */}
                  <div style={{
                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                    fontWeight: '800',
                    color: 'var(--color-text-primary)',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                  }}>
                    {team.team}
                  </div>

                  {/* PDO */}
                  <div style={{
                    fontSize: isMobile ? '0.625rem' : '0.688rem',
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontWeight: '600'
                  }}>
                    {team.pdo}
                  </div>

                  {/* Hover tooltip */}
                  {hoveredTeam === team.team && !isMobile && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        marginTop: '8px',
                        padding: '0.75rem',
                        background: 'rgba(10, 14, 26, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: `2px solid ${team.temperature === 'hot' ? '#EF4444' : team.temperature === 'cold' ? '#3B82F6' : '#94A3B8'}`,
                        borderRadius: '8px',
                        minWidth: '180px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                        pointerEvents: 'none',
                        zIndex: 1000
                      }}
                    >
                      <div style={{ fontSize: '0.813rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
                        {team.name}
                      </div>
                      <div style={{ fontSize: '0.688rem', color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.5' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                          <span>PDO:</span>
                          <span style={{ fontWeight: '600' }}>{team.pdo}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                          <span>xGD/60:</span>
                          <span style={{ fontWeight: '600', color: parseFloat(team.xGD) > 0 ? '#10B981' : '#EF4444' }}>
                            {parseFloat(team.xGD) > 0 ? '+' : ''}{team.xGD}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                          <span>xGF/60:</span>
                          <span style={{ fontWeight: '600', color: '#10B981' }}>{team.xGF}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>xGA/60:</span>
                          <span style={{ fontWeight: '600', color: '#EF4444' }}>{team.xGA}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        style={{
          marginTop: isMobile ? '1.5rem' : '2rem',
          padding: isMobile ? '1rem' : '1.5rem',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div style={{
          fontSize: '0.75rem',
          color: 'rgba(255, 255, 255, 0.6)',
          lineHeight: '1.6',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: 'var(--color-text-primary)' }}>PDO = Shooting % + Save %</strong> (League average: 100)
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            🔥 Hot (PDO &gt; 102) • 😐 Neutral (PDO 98-102) • ❄️ Cold (PDO &lt; 98)
          </div>
          <div>
            <span style={{ color: '#EF4444', fontWeight: '700' }}>FADE</span> = Overperforming (bet against) • 
            <span style={{ color: '#10B981', fontWeight: '700' }}> BACK</span> = Underperforming (bet on)
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LeagueHeatmap;

