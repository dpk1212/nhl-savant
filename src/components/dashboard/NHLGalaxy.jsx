import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Flame, Snowflake, Target, Zap } from 'lucide-react';

const NHLGalaxy = ({ dataProcessor, isMobile }) => {
  const [hoveredTeam, setHoveredTeam] = useState(null);
  const [lockedTeam, setLockedTeam] = useState(null);
  const [activeView, setActiveView] = useState('performance'); // performance, betting, divisions
  const [dimensions, setDimensions] = useState({ width: 1200, height: 700 });

  // Update dimensions on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      const container = document.getElementById('galaxy-container');
      if (container) {
        const width = container.offsetWidth;
        // Mobile: Taller canvas for better readability and to prevent cutoff
        // Desktop: Responsive height based on viewport
        const height = isMobile ? 600 : Math.min(700, window.innerHeight * 0.6);
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [isMobile]);

  // Calculate galaxy data
  const galaxyData = useMemo(() => {
    if (!dataProcessor) return { teams: [], stats: {} };

    const teams = dataProcessor.getTeamsBySituation('5on5');
    if (!teams || teams.length === 0) return { teams: [], stats: {} };

    // Find min/max for normalization
    const xGF_values = teams.map(t => t.xGF_per60 || 0);
    const xGA_values = teams.map(t => t.xGA_per60 || 0);
    const xGD_values = teams.map(t => (t.xGF_per60 || 0) - (t.xGA_per60 || 0));
    const minXGF = Math.min(...xGF_values);
    const maxXGF = Math.max(...xGF_values);
    const minXGA = Math.min(...xGA_values);
    const maxXGA = Math.max(...xGA_values);
    const minXGD = Math.min(...xGD_values);
    const maxXGD = Math.max(...xGD_values);

    // Process each team
    const processedTeams = teams.map(team => {
      const xGF = team.xGF_per60 || 0;
      const xGA = team.xGA_per60 || 0;
      const pdo = team.pdo || 100;
      const xGD = xGF - xGA;

      // Normalize positions with safe range to prevent cutoff
      // Mobile needs more padding due to smaller screen
      const paddingPercent = isMobile ? 15 : 10;
      const rangePercent = 100 - (paddingPercent * 2);
      
      // X-axis: Higher xGF (better offense) = further right
      const x = paddingPercent + ((xGF - minXGF) / (maxXGF - minXGF)) * rangePercent;
      
      // Y-axis: INVERTED so lower xGA (better defense) = bottom of graph
      // In CSS: Y=0 is top, Y=100 is bottom
      // Low xGA (good defense) should map to high Y value (bottom) = 85-90%
      // High xGA (bad defense) should map to low Y value (top) = 10-15%
      const maxY = 100 - paddingPercent;
      const minY = paddingPercent;
      const y = maxY - ((xGA - minXGA) / (maxXGA - minXGA)) * rangePercent;

      // Determine temperature
      let temperature = 'neutral';
      let tempValue = 0;
      if (pdo > 102) {
        temperature = 'hot';
        tempValue = Math.min((pdo - 100) / 5, 1);
      } else if (pdo < 98) {
        temperature = 'cold';
        tempValue = Math.min((100 - pdo) / 5, 1);
      }

      // Determine size based on xGD percentile (bigger = better differential)
      const sizeMin = isMobile ? 28 : 38;
      const sizeMax = isMobile ? 50 : 65;
      const normalizedXGD = (xGD - minXGD) / (maxXGD - minXGD); // 0-1 scale
      const size = sizeMin + normalizedXGD * (sizeMax - sizeMin);

      // Regression direction
      let regressionDirection = null;
      let regressionStrength = 0;
      if (pdo > 102) {
        regressionDirection = 'down';
        regressionStrength = Math.min((pdo - 102) / 5, 1);
      } else if (pdo < 98) {
        regressionDirection = 'up';
        regressionStrength = Math.min((98 - pdo) / 5, 1);
      }

      // Betting value
      const hasValue = Math.abs(pdo - 100) > 2;
      const bettingAction = pdo > 102 ? 'FADE' : pdo < 98 ? 'BACK' : null;

      return {
        team: team.team,
        name: team.name || team.team,
        x,
        y,
        size,
        temperature,
        tempValue,
        pdo: pdo.toFixed(1),
        xGF: xGF.toFixed(2),
        xGA: xGA.toFixed(2),
        xGD: xGD.toFixed(2),
        regressionDirection,
        regressionStrength,
        hasValue,
        bettingAction,
        gamesPlayed: team.gamesPlayed || 0
      };
    });

    return { teams: processedTeams, stats: { minXGF, maxXGF, minXGA, maxXGA } };
  }, [dataProcessor]);

  // Get team color based on temperature
  const getTeamColor = (temp, tempValue) => {
    if (temp === 'hot') {
      return `rgba(239, 68, 68, ${0.7 + tempValue * 0.3})`;
    } else if (temp === 'cold') {
      return `rgba(59, 130, 246, ${0.7 + tempValue * 0.3})`;
    }
    return 'rgba(148, 163, 184, 0.7)';
  };

  const getTeamGlow = (temp, tempValue) => {
    if (temp === 'hot') {
      return `0 0 ${20 + tempValue * 30}px rgba(239, 68, 68, ${0.6 + tempValue * 0.4})`;
    } else if (temp === 'cold') {
      return `0 0 ${20 + tempValue * 30}px rgba(59, 130, 246, ${0.6 + tempValue * 0.4})`;
    }
    return '0 0 15px rgba(148, 163, 184, 0.4)';
  };

  // Filter teams based on active view
  const displayedTeams = useMemo(() => {
    if (activeView === 'betting') {
      return galaxyData.teams.filter(t => t.hasValue);
    }
    return galaxyData.teams;
  }, [galaxyData.teams, activeView]);

  if (!dataProcessor || galaxyData.teams.length === 0) {
    return (
      <div style={{
        padding: isMobile ? '2rem 1rem' : '3rem 2rem',
        textAlign: 'center',
        color: 'var(--color-text-muted)'
      }}>
        Loading galaxy data...
      </div>
    );
  }

  return (
    <div
      id="galaxy-container"
      style={{
        padding: isMobile ? '2rem 1rem' : '4rem 2rem',
        marginBottom: isMobile ? '2rem' : '3rem',
        background: 'linear-gradient(180deg, #0A0E1A 0%, #1A1F2E 50%, #0A0E1A 100%)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 215, 0, 0.2)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      }}
    >
      {/* Animated background nebula */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(239, 68, 68, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 50%)
        `,
        pointerEvents: 'none',
        animation: 'nebulaPulse 10s ease-in-out infinite'
      }} />

      {/* Starfield effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          radial-gradient(2px 2px at 20% 30%, white, transparent),
          radial-gradient(2px 2px at 60% 70%, white, transparent),
          radial-gradient(1px 1px at 50% 50%, white, transparent),
          radial-gradient(1px 1px at 80% 10%, white, transparent),
          radial-gradient(2px 2px at 90% 60%, white, transparent),
          radial-gradient(1px 1px at 33% 80%, white, transparent),
          radial-gradient(1px 1px at 15% 90%, white, transparent)
        `,
        backgroundSize: '200% 200%',
        backgroundPosition: '0% 0%',
        opacity: 0.4,
        pointerEvents: 'none',
        animation: 'starTwinkle 20s linear infinite'
      }} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          textAlign: 'center',
          marginBottom: isMobile ? '2rem' : '3rem',
          position: 'relative',
          zIndex: 1
        }}
      >
        <h2 style={{
          fontSize: isMobile ? '2rem' : '3rem',
          fontWeight: '900',
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 25%, #FF6B6B 50%, #4ECDC4 75%, #FFD700 100%)',
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '1rem',
          letterSpacing: '-0.03em',
          filter: 'drop-shadow(0 0 30px rgba(255, 215, 0, 0.4))',
          animation: 'gradientShift 8s ease infinite'
        }}>
          THE NHL GALAXY
        </h2>
        <p style={{
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: isMobile ? '1rem' : '1.25rem',
          fontWeight: '500',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          marginBottom: '0.5rem'
        }}>
          Where Performance Meets Prediction
        </p>
        <p style={{
          color: 'rgba(255, 255, 255, 0.5)',
          fontSize: isMobile ? '0.875rem' : '1rem',
          fontWeight: '400'
        }}>
          {galaxyData.teams.length} teams • Live positioning • Regression analysis
        </p>
      </motion.div>

      {/* View Toggle */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '2rem',
            position: 'relative',
            zIndex: 1
          }}
        >
          {[
            { id: 'performance', label: 'Performance', icon: Target },
            { id: 'betting', label: 'Betting Value', icon: Zap }
          ].map(view => {
            const Icon = view.icon;
            const isActive = activeView === view.id;
            return (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id)}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  border: isActive 
                    ? '2px solid rgba(255, 215, 0, 0.6)' 
                    : '1px solid rgba(255, 255, 255, 0.2)',
                  background: isActive 
                    ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 165, 0, 0.1) 100%)'
                    : 'rgba(255, 255, 255, 0.05)',
                  color: isActive ? '#FFD700' : 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.875rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: isActive ? '0 4px 20px rgba(255, 215, 0, 0.3)' : 'none'
                }}
              >
                <Icon size={16} />
                {view.label}
              </button>
            );
          })}
        </motion.div>
      )}

      {/* The Galaxy Canvas */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: dimensions.height,
        marginTop: isMobile ? '1rem' : '2rem',
        background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.02) 0%, transparent 70%)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        overflow: 'hidden'
      }}>
        {/* Orbital Rings - Performance Tiers */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            opacity: 0.3
          }}
        >
          {/* Elite Ring */}
          <ellipse
            cx={dimensions.width * 0.75}
            cy={dimensions.height * 0.25}
            rx={dimensions.width * 0.2}
            ry={dimensions.height * 0.15}
            fill="none"
            stroke="rgba(16, 185, 129, 0.4)"
            strokeWidth="1"
            strokeDasharray="5,5"
            style={{
              animation: 'orbitRotate 30s linear infinite'
            }}
          />
          {/* Average Ring */}
          <ellipse
            cx={dimensions.width * 0.5}
            cy={dimensions.height * 0.5}
            rx={dimensions.width * 0.25}
            ry={dimensions.height * 0.2}
            fill="none"
            stroke="rgba(148, 163, 184, 0.3)"
            strokeWidth="1"
            strokeDasharray="5,5"
            style={{
              animation: 'orbitRotate 40s linear infinite reverse'
            }}
          />
          {/* Struggling Ring */}
          <ellipse
            cx={dimensions.width * 0.25}
            cy={dimensions.height * 0.75}
            rx={dimensions.width * 0.2}
            ry={dimensions.height * 0.15}
            fill="none"
            stroke="rgba(239, 68, 68, 0.4)"
            strokeWidth="1"
            strokeDasharray="5,5"
            style={{
              animation: 'orbitRotate 35s linear infinite'
            }}
          />
        </svg>

        {/* Zone overlays - CORRECTED */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '50%',
          height: '50%',
          background: 'linear-gradient(45deg, rgba(16, 185, 129, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
          borderLeft: '2px dashed rgba(16, 185, 129, 0.3)',
          borderTop: '2px dashed rgba(16, 185, 129, 0.3)'
        }} />
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '50%',
          height: '50%',
          background: 'linear-gradient(225deg, rgba(239, 68, 68, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
          borderRight: '2px dashed rgba(239, 68, 68, 0.3)',
          borderBottom: '2px dashed rgba(239, 68, 68, 0.3)'
        }} />

        {/* Zone labels - Positioned to avoid corner label overlap */}
        <div style={{
          position: 'absolute',
          bottom: isMobile ? '45px' : '55px',
          right: isMobile ? '15px' : '20px',
          padding: isMobile ? '0.5rem 1rem' : '0.625rem 1.25rem',
          background: 'rgba(16, 185, 129, 0.25)',
          backdropFilter: 'blur(12px)',
          border: '2px solid rgba(16, 185, 129, 0.5)',
          borderRadius: '10px',
          fontSize: isMobile ? '0.688rem' : '0.813rem',
          fontWeight: '900',
          color: '#10B981',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          pointerEvents: 'none',
          boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
        }}>
          ✓ ELITE ZONE
        </div>
        <div style={{
          position: 'absolute',
          top: isMobile ? '45px' : '55px',
          left: isMobile ? '15px' : '20px',
          padding: isMobile ? '0.5rem 1rem' : '0.625rem 1.25rem',
          background: 'rgba(239, 68, 68, 0.25)',
          backdropFilter: 'blur(12px)',
          border: '2px solid rgba(239, 68, 68, 0.5)',
          borderRadius: '10px',
          fontSize: isMobile ? '0.688rem' : '0.813rem',
          fontWeight: '900',
          color: '#EF4444',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          pointerEvents: 'none',
          boxShadow: '0 4px 16px rgba(239, 68, 68, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
        }}>
          ✗ DANGER ZONE
        </div>

        {/* Corner Labels - Clear quadrant descriptions */}
        {/* TOP-LEFT: Bad Offense + Bad Defense */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          fontSize: isMobile ? '0.625rem' : '0.75rem',
          color: 'rgba(239, 68, 68, 0.8)',
          fontWeight: '700',
          textAlign: 'left',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
          lineHeight: '1.3',
          maxWidth: isMobile ? '80px' : '100px'
        }}>
          BAD OFFENSE<br/>BAD DEFENSE
        </div>
        
        {/* TOP-RIGHT: Good Offense + Bad Defense */}
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          fontSize: isMobile ? '0.625rem' : '0.75rem',
          color: 'rgba(251, 191, 36, 0.8)',
          fontWeight: '700',
          textAlign: 'right',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
          lineHeight: '1.3',
          maxWidth: isMobile ? '80px' : '100px'
        }}>
          GOOD OFFENSE<br/>BAD DEFENSE
        </div>
        
        {/* BOTTOM-LEFT: Bad Offense + Good Defense */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          fontSize: isMobile ? '0.625rem' : '0.75rem',
          color: 'rgba(59, 130, 246, 0.8)',
          fontWeight: '700',
          textAlign: 'left',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
          lineHeight: '1.3',
          maxWidth: isMobile ? '80px' : '100px'
        }}>
          BAD OFFENSE<br/>GOOD DEFENSE
        </div>
        
        {/* BOTTOM-RIGHT: Good Offense + Good Defense */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          fontSize: isMobile ? '0.625rem' : '0.75rem',
          color: 'rgba(16, 185, 129, 0.8)',
          fontWeight: '700',
          textAlign: 'right',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
          lineHeight: '1.3',
          maxWidth: isMobile ? '80px' : '100px'
        }}>
          GOOD OFFENSE<br/>GOOD DEFENSE
        </div>

        {/* Team orbs */}
        <AnimatePresence>
          {displayedTeams.map((team, index) => {
            const isHovered = hoveredTeam === team.team;
            const isLocked = lockedTeam === team.team;
            const isActive = isHovered || isLocked;
            const shouldDim = (hoveredTeam || lockedTeam) && !isActive;
            const xPos = (team.x / 100) * dimensions.width;
            const yPos = (team.y / 100) * dimensions.height;

            return (
              <motion.div
                key={team.team}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: shouldDim ? 0.3 : 1, 
                  scale: 1
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.02,
                  type: 'spring',
                  stiffness: 100,
                  damping: 15
                }}
                whileHover={{ scale: 1.5, zIndex: 100 }}
                onHoverStart={() => !lockedTeam && !isMobile && setHoveredTeam(team.team)}
                onHoverEnd={() => !lockedTeam && !isMobile && setHoveredTeam(null)}
                onTap={() => {
                  // Mobile tap handling
                  if (isMobile) {
                    if (lockedTeam === team.team) {
                      setLockedTeam(null);
                    } else {
                      setLockedTeam(team.team);
                    }
                  }
                }}
                onClick={() => {
                  // Desktop click handling
                  if (!isMobile) {
                    if (lockedTeam === team.team) {
                      setLockedTeam(null);
                    } else {
                      setLockedTeam(team.team);
                      setHoveredTeam(null);
                    }
                  }
                }}
                style={{
                  position: 'absolute',
                  left: xPos,
                  top: yPos,
                  transform: 'translate(-50%, -50%)',
                  cursor: 'pointer',
                  zIndex: isActive ? 100 : 10
                }}
              >
                {/* Regression arrow */}
                {team.regressionDirection && (
                  <motion.div
                    initial={{ opacity: 0, y: 0 }}
                    animate={{
                      opacity: [0.5, 1, 0.5],
                      y: team.regressionDirection === 'up' ? [-10, -20, -10] : [10, 20, 10]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                    style={{
                      position: 'absolute',
                      top: team.regressionDirection === 'up' ? '-30px' : 'auto',
                      bottom: team.regressionDirection === 'down' ? '-30px' : 'auto',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      color: team.regressionDirection === 'up' ? '#10B981' : '#EF4444',
                      filter: `drop-shadow(0 0 8px ${team.regressionDirection === 'up' ? '#10B981' : '#EF4444'})`
                    }}
                  >
                    {team.regressionDirection === 'up' ? (
                      <TrendingUp size={20} strokeWidth={3} />
                    ) : (
                      <TrendingDown size={20} strokeWidth={3} />
                    )}
                  </motion.div>
                )}

                {/* Value badge */}
                {team.hasValue && activeView === 'betting' && (
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      fontSize: '1rem',
                      filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.8))'
                    }}
                  >
                    💎
                  </motion.div>
                )}

                {/* The orb */}
                <motion.div
                  animate={isActive ? {
                    boxShadow: [
                      getTeamGlow(team.temperature, team.tempValue),
                      `0 0 ${60}px ${getTeamColor(team.temperature, team.tempValue)}`,
                      getTeamGlow(team.temperature, team.tempValue)
                    ]
                  } : {
                    boxShadow: getTeamGlow(team.temperature, team.tempValue),
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: isActive ? 1 : 3, 
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  style={{
                    width: team.size,
                    height: team.size,
                    borderRadius: '50%',
                    background: `radial-gradient(circle at 30% 30%, ${getTeamColor(team.temperature, team.tempValue).replace('0.7', '1')}, ${getTeamColor(team.temperature, team.tempValue).replace('0.7', '0.6')})`,
                    border: `2px solid ${getTeamColor(team.temperature, team.tempValue)}`,
                    boxShadow: getTeamGlow(team.temperature, team.tempValue),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: isMobile ? '0.625rem' : '0.75rem',
                    fontWeight: '900',
                    color: '#FFFFFF',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Inner glow */}
                  <div style={{
                    position: 'absolute',
                    top: '10%',
                    left: '20%',
                    width: '40%',
                    height: '40%',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.3)',
                    filter: 'blur(8px)'
                  }} />
                  
                  {/* Team code */}
                  <span style={{ position: 'relative', zIndex: 1 }}>
                    {team.team}
                  </span>
                </motion.div>

                {/* Tooltip (hover or locked) - with smart positioning */}
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      position: 'absolute',
                      // Smart positioning: if team is in bottom half, show tooltip above; otherwise below
                      [yPos > dimensions.height / 2 ? 'bottom' : 'top']: '100%',
                      // Smart positioning: if team is on right half, align right; otherwise center
                      [xPos > dimensions.width * 0.7 ? 'right' : 'left']: xPos > dimensions.width * 0.7 ? 0 : '50%',
                      transform: xPos > dimensions.width * 0.7 ? 'none' : 'translateX(-50%)',
                      marginTop: yPos <= dimensions.height / 2 ? '16px' : '0',
                      marginBottom: yPos > dimensions.height / 2 ? '16px' : '0',
                      minWidth: isMobile ? '200px' : '240px',
                      maxWidth: isMobile ? '280px' : '320px',
                      padding: isMobile ? '0.875rem' : '1rem',
                      background: 'rgba(10, 14, 26, 0.98)',
                      backdropFilter: 'blur(20px)',
                      border: `2px solid ${getTeamColor(team.temperature, team.tempValue)}`,
                      borderRadius: '12px',
                      boxShadow: `0 8px 32px rgba(0, 0, 0, 0.8), 0 0 20px ${getTeamColor(team.temperature, team.tempValue)}`,
                      pointerEvents: isLocked ? 'auto' : 'none',
                      zIndex: 1000
                    }}
                  >
                    {/* Team name with lock indicator */}
                    <div style={{
                      fontSize: '1rem',
                      fontWeight: '800',
                      marginBottom: '0.75rem',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.5rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {team.name}
                        {team.temperature === 'hot' && <Flame size={16} color="#EF4444" />}
                        {team.temperature === 'cold' && <Snowflake size={16} color="#3B82F6" />}
                      </div>
                      {isLocked && (
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#FFD700',
                          background: 'rgba(255, 215, 0, 0.2)',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          border: '1px solid rgba(255, 215, 0, 0.4)'
                        }}>
                          🔒 LOCKED
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div style={{
                      fontSize: '0.813rem',
                      color: 'rgba(255, 255, 255, 0.8)',
                      lineHeight: '1.6',
                      marginBottom: '0.75rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span>PDO:</span>
                        <span style={{ fontWeight: '700', color: getTeamColor(team.temperature, team.tempValue) }}>
                          {team.pdo}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span>xGD/60:</span>
                        <span style={{
                          fontWeight: '700',
                          color: parseFloat(team.xGD) > 0 ? '#10B981' : '#EF4444'
                        }}>
                          {parseFloat(team.xGD) > 0 ? '+' : ''}{team.xGD}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span>xGF/60:</span>
                        <span style={{ fontWeight: '700', color: '#10B981' }}>{team.xGF}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>xGA/60:</span>
                        <span style={{ fontWeight: '700', color: '#EF4444' }}>{team.xGA}</span>
                      </div>
                    </div>

                    {/* Betting recommendation */}
                    {team.bettingAction && (
                      <div style={{
                        padding: '0.5rem',
                        borderRadius: '6px',
                        background: team.bettingAction === 'FADE' 
                          ? 'rgba(239, 68, 68, 0.2)' 
                          : 'rgba(16, 185, 129, 0.2)',
                        border: `1px solid ${team.bettingAction === 'FADE' ? '#EF4444' : '#10B981'}`,
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        textAlign: 'center',
                        color: team.bettingAction === 'FADE' ? '#EF4444' : '#10B981',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        {team.bettingAction === 'FADE' ? '🔻 FADE THIS TEAM' : '🔺 BACK THIS TEAM'}
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        style={{
          marginTop: isMobile ? '1.5rem' : '2rem',
          padding: isMobile ? '1rem' : '1.5rem',
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'relative',
          zIndex: 1
        }}
      >
        <div style={{
          fontSize: '0.813rem',
          color: 'rgba(255, 255, 255, 0.7)',
          lineHeight: '1.8',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap: '1rem'
        }}>
          <div>
            <strong style={{ color: '#FFD700' }}>Position:</strong> Offense (→) vs Defense (↑)
          </div>
          <div>
            <strong style={{ color: '#FFD700' }}>Size:</strong> xG Differential (bigger = better)
          </div>
          <div>
            <strong style={{ color: '#EF4444' }}>🔥 Hot:</strong> PDO &gt; 102 (overperforming)
          </div>
          <div>
            <strong style={{ color: '#3B82F6' }}>❄️ Cold:</strong> PDO &lt; 98 (underperforming)
          </div>
          <div>
            <strong style={{ color: '#10B981' }}>↑ Arrow:</strong> Will improve (BACK)
          </div>
          <div>
            <strong style={{ color: '#EF4444' }}>↓ Arrow:</strong> Will decline (FADE)
          </div>
        </div>
      </motion.div>

      {/* Add animations */}
      <style>{`
        @keyframes nebulaPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes starTwinkle {
          0% { opacity: 0.3; }
          50% { opacity: 0.6; }
          100% { opacity: 0.3; }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes orbitRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default NHLGalaxy;

