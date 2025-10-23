import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, TrendingUp, Activity } from 'lucide-react';

const NeuralNetwork = ({ dataProcessor, isMobile }) => {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [hoveredConnection, setHoveredConnection] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPrediction, setCurrentPrediction] = useState(0);
  const canvasRef = useRef(null);

  // Calculate network data
  const networkData = useMemo(() => {
    if (!dataProcessor) return null;

    const teams = dataProcessor.getTeamsBySituation('5on5');
    if (!teams || teams.length === 0) return null;

    // Calculate league averages for input layer
    const avgXGF = teams.reduce((sum, t) => sum + (t.xGF_per60 || 0), 0) / teams.length;
    const avgXGA = teams.reduce((sum, t) => sum + (t.xGA_per60 || 0), 0) / teams.length;
    const avgPDO = teams.reduce((sum, t) => sum + (t.pdo || 100), 0) / teams.length;
    
    // Get goalie data
    const goalieStats = teams.reduce((sum, t) => {
      const gsax = parseFloat(t.gsax) || 0;
      return sum + gsax;
    }, 0) / teams.length;

    // Calculate possession and special teams
    const avgPossession = teams.reduce((sum, t) => sum + (t.corsi_for_pct || 50), 0) / teams.length;
    const avgSpecialTeams = teams.reduce((sum, t) => {
      const pp = parseFloat(t.pp_pct) || 0;
      const pk = parseFloat(t.pk_pct) || 0;
      return sum + ((pp + (100 - pk)) / 2);
    }, 0) / teams.length;

    // Home ice advantage (fixed value)
    const homeIce = 5.8; // 5.8% advantage

    // Get top betting opportunity for output
    const opportunities = dataProcessor.getTopBettingOpportunities();
    const topBet = opportunities[0] || {};

    return {
      inputs: [
        { id: 'xgf', label: 'xGF', value: avgXGF, unit: '/60', color: '#3B82F6' },
        { id: 'xga', label: 'xGA', value: avgXGA, unit: '/60', color: '#3B82F6' },
        { id: 'gsax', label: 'GSAx', value: goalieStats, unit: '', color: '#3B82F6' },
        { id: 'home', label: 'Home Ice', value: homeIce, unit: '%', color: '#3B82F6' },
        { id: 'poss', label: 'Possession', value: avgPossession, unit: '%', color: '#3B82F6' },
        { id: 'special', label: 'Special Teams', value: avgSpecialTeams, unit: '%', color: '#3B82F6' }
      ],
      outputs: [
        { 
          id: 'win', 
          label: 'WIN %', 
          value: topBet.winProb ? (topBet.winProb * 100) : 52.5, 
          unit: '%', 
          color: '#F59E0B',
          icon: TrendingUp
        },
        { 
          id: 'total', 
          label: 'TOTAL', 
          value: topBet.total || 6.2, 
          unit: ' goals', 
          color: '#F59E0B',
          icon: Activity
        },
        { 
          id: 'ev', 
          label: 'EV', 
          value: topBet.ev ? Math.abs(topBet.ev) : 12.5, 
          unit: '%', 
          color: '#10B981',
          icon: Zap
        }
      ],
      game: topBet.game || 'League Average'
    };
  }, [dataProcessor]);

  // Auto-cycle through predictions
  useEffect(() => {
    if (isPaused || !dataProcessor) return;

    const interval = setInterval(() => {
      setCurrentPrediction(prev => (prev + 1) % 3);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, dataProcessor]);

  if (!networkData) return null;

  // Layout configuration
  const nodeSize = isMobile ? 24 : 40;
  const layerSpacing = isMobile ? 120 : 200;
  const nodeSpacing = isMobile ? 60 : 80;

  // Calculate layer positions
  const inputLayer = networkData.inputs.map((node, i) => ({
    ...node,
    x: isMobile ? 50 : 100,
    y: 100 + i * nodeSpacing,
    layer: 'input'
  }));

  // Hidden layer 1 (4 nodes)
  const hidden1 = Array.from({ length: 4 }, (_, i) => ({
    id: `h1-${i}`,
    x: isMobile ? 50 + layerSpacing : 100 + layerSpacing,
    y: 150 + i * (nodeSpacing * 1.2),
    layer: 'hidden1',
    color: '#8B5CF6'
  }));

  // Hidden layer 2 (3 nodes)
  const hidden2 = Array.from({ length: 3 }, (_, i) => ({
    id: `h2-${i}`,
    x: isMobile ? 50 + layerSpacing * 2 : 100 + layerSpacing * 2,
    y: 180 + i * (nodeSpacing * 1.5),
    layer: 'hidden2',
    color: '#A78BFA'
  }));

  // Output layer
  const outputLayer = networkData.outputs.map((node, i) => ({
    ...node,
    x: isMobile ? 50 + layerSpacing * 3 : 100 + layerSpacing * 3,
    y: 180 + i * (nodeSpacing * 1.5),
    layer: 'output'
  }));

  const allNodes = [...inputLayer, ...hidden1, ...hidden2, ...outputLayer];

  // Generate connections
  const connections = [];
  
  // Input to Hidden1
  inputLayer.forEach(input => {
    hidden1.forEach(h1 => {
      const weight = Math.random() * 0.8 + 0.2; // 0.2 to 1.0
      const isPositive = Math.random() > 0.3; // 70% positive
      connections.push({
        from: input,
        to: h1,
        weight,
        isPositive,
        id: `${input.id}-${h1.id}`
      });
    });
  });

  // Hidden1 to Hidden2
  hidden1.forEach(h1 => {
    hidden2.forEach(h2 => {
      const weight = Math.random() * 0.8 + 0.2;
      const isPositive = Math.random() > 0.3;
      connections.push({
        from: h1,
        to: h2,
        weight,
        isPositive,
        id: `${h1.id}-${h2.id}`
      });
    });
  });

  // Hidden2 to Output
  hidden2.forEach(h2 => {
    outputLayer.forEach(output => {
      const weight = Math.random() * 0.8 + 0.2;
      const isPositive = Math.random() > 0.4;
      connections.push({
        from: h2,
        to: output,
        weight,
        isPositive,
        id: `${h2.id}-${output.id}`
      });
    });
  });

  const containerHeight = isMobile ? 600 : 500;
  const containerWidth = isMobile ? '100%' : '100%';

  return (
    <div
      style={{
        marginBottom: '3rem',
        background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.95) 100%)',
        borderRadius: '16px',
        border: '1px solid rgba(139, 92, 246, 0.2)',
        padding: isMobile ? '1.5rem 1rem' : '2rem',
        boxShadow: '0 8px 32px rgba(139, 92, 246, 0.15)',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Header */}
      <div style={{ position: 'relative', zIndex: 1, marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)'
          }}>
            <Brain size={22} color="white" strokeWidth={2.5} />
          </div>
          <h2 style={{
            fontSize: isMobile ? '1.5rem' : '1.75rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 50%, #F59E0B 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: 0
          }}>
            THE NEURAL ENGINE
          </h2>
        </div>
        <p style={{
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: isMobile ? '0.813rem' : '0.875rem',
          margin: 0,
          marginLeft: isMobile ? '0' : '56px'
        }}>
          Watch the AI process data in real-time • {networkData.game}
        </p>
      </div>

      {/* Neural Network Visualization */}
      <div style={{
        position: 'relative',
        height: `${containerHeight}px`,
        width: containerWidth,
        zIndex: 1
      }}>
        <svg
          width="100%"
          height={containerHeight}
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <defs>
            {/* Glow filter for connections */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Render connections */}
          {connections.map(conn => {
            const isHovered = hoveredConnection === conn.id;
            const opacity = isHovered ? 0.9 : conn.weight * 0.4;
            const strokeWidth = isHovered ? 3 : conn.weight * 2;
            const color = conn.isPositive ? '#10B981' : '#3B82F6';

            return (
              <motion.line
                key={conn.id}
                x1={conn.from.x}
                y1={conn.from.y}
                x2={conn.to.x}
                y2={conn.to.y}
                stroke={color}
                strokeWidth={strokeWidth}
                opacity={opacity}
                strokeDasharray="5,5"
                filter="url(#glow)"
                animate={{
                  strokeDashoffset: isPaused ? 0 : [0, -10]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
                onMouseEnter={() => setHoveredConnection(conn.id)}
                onMouseLeave={() => setHoveredConnection(null)}
                style={{ cursor: 'pointer' }}
              />
            );
          })}
        </svg>

        {/* Render nodes */}
        {allNodes.map(node => {
          const isHovered = hoveredNode === node.id;
          const isInput = node.layer === 'input';
          const isOutput = node.layer === 'output';
          const isHidden = node.layer.includes('hidden');

          return (
            <motion.div
              key={node.id}
              style={{
                position: 'absolute',
                left: `${node.x}px`,
                top: `${node.y}px`,
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
                zIndex: isHovered ? 10 : 1
              }}
              animate={{
                scale: isHovered ? 1.2 : [1, 1.05, 1]
              }}
              transition={{
                scale: {
                  duration: isHovered ? 0.2 : 2,
                  repeat: isHovered ? 0 : Infinity,
                  ease: "easeInOut"
                }
              }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Node circle */}
              <div style={{
                width: `${nodeSize}px`,
                height: `${nodeSize}px`,
                borderRadius: '50%',
                background: isOutput 
                  ? 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)'
                  : isInput
                  ? 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)'
                  : 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
                boxShadow: isHovered
                  ? `0 0 20px ${node.color || '#8B5CF6'}, 0 0 40px ${node.color || '#8B5CF6'}`
                  : `0 0 10px ${node.color || '#8B5CF6'}`,
                border: '2px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                {isOutput && node.icon && (
                  <node.icon size={isMobile ? 12 : 16} color="white" strokeWidth={2.5} />
                )}
              </div>

              {/* Node label */}
              {(isInput || isOutput) && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: isInput ? `${nodeSize + 10}px` : 'auto',
                  right: isOutput ? `${nodeSize + 10}px` : 'auto',
                  transform: 'translateY(-50%)',
                  whiteSpace: 'nowrap',
                  fontSize: isMobile ? '0.688rem' : '0.75rem',
                  fontWeight: '600',
                  color: 'rgba(255, 255, 255, 0.9)',
                  textAlign: isInput ? 'left' : 'right',
                  pointerEvents: 'none'
                }}>
                  {node.label}
                  {isHovered && node.value !== undefined && (
                    <div style={{
                      fontSize: isMobile ? '0.625rem' : '0.688rem',
                      color: 'rgba(255, 255, 255, 0.6)',
                      marginTop: '2px'
                    }}>
                      {node.value.toFixed(1)}{node.unit}
                    </div>
                  )}
                </div>
              )}

              {/* Output value display */}
              {isOutput && !isHovered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: `${nodeSize + 10}px`,
                    transform: 'translateY(-50%)',
                    fontSize: isMobile ? '1.25rem' : '1.5rem',
                    fontWeight: '800',
                    color: node.id === 'ev' ? '#10B981' : '#F59E0B',
                    textShadow: `0 0 10px ${node.id === 'ev' ? '#10B981' : '#F59E0B'}`,
                    marginRight: isMobile ? '60px' : '80px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <CountUp value={node.value} unit={node.unit} />
                </motion.div>
              )}
            </motion.div>
          );
        })}

        {/* Layer labels */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: isMobile ? '1rem' : '2rem',
          fontSize: isMobile ? '0.625rem' : '0.688rem',
          color: 'rgba(255, 255, 255, 0.4)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontWeight: '600'
        }}>
          <div>Input Layer</div>
          <div>Hidden Layers</div>
          <div>Output Layer</div>
        </div>
      </div>

      {/* Hover tooltip */}
      <AnimatePresence>
        {hoveredConnection && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{
              position: 'absolute',
              bottom: '60px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(17, 24, 39, 0.95)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              fontSize: '0.75rem',
              color: 'rgba(255, 255, 255, 0.8)',
              zIndex: 100,
              pointerEvents: 'none',
              whiteSpace: 'nowrap'
            }}
          >
            Connection strength: {(connections.find(c => c.id === hoveredConnection)?.weight * 100).toFixed(0)}%
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Count-up animation component
const CountUp = ({ value, unit }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current += increment;
      if (step >= steps) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <>
      {displayValue.toFixed(1)}
      <span style={{ fontSize: '0.7em', opacity: 0.8 }}>{unit}</span>
    </>
  );
};

export default NeuralNetwork;

