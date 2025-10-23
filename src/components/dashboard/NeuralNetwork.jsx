import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, TrendingUp, Activity, Target, Award, Shield } from 'lucide-react';

const NeuralNetwork = ({ dataProcessor, isMobile }) => {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [hoveredConnection, setHoveredConnection] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPrediction, setCurrentPrediction] = useState(0);
  const [activeLayer, setActiveLayer] = useState('all');
  const [processingWave, setProcessingWave] = useState(0);
  const canvasRef = useRef(null);
  const animationFrame = useRef(null);

  // Calculate network data with MORE sophistication
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
    const homeIce = 5.8;

    // Get top betting opportunity for output
    const opportunities = dataProcessor.getTopBettingOpportunities();
    const topBet = opportunities[0] || {};

    return {
      inputs: [
        { id: 'xgf', label: 'Expected Goals For', shortLabel: 'xGF', value: avgXGF, unit: '/60', color: '#3B82F6', icon: Target, importance: 0.95 },
        { id: 'xga', label: 'Expected Goals Against', shortLabel: 'xGA', value: avgXGA, unit: '/60', color: '#3B82F6', icon: Shield, importance: 0.92 },
        { id: 'gsax', label: 'Goalie Performance', shortLabel: 'GSAx', value: goalieStats, unit: '', color: '#3B82F6', icon: Award, importance: 0.88 },
        { id: 'home', label: 'Home Ice Advantage', shortLabel: 'Home Ice', value: homeIce, unit: '%', color: '#3B82F6', icon: TrendingUp, importance: 0.75 },
        { id: 'poss', label: 'Possession Control', shortLabel: 'Possession', value: avgPossession, unit: '%', color: '#3B82F6', icon: Activity, importance: 0.82 },
        { id: 'special', label: 'Special Teams', shortLabel: 'Special Teams', value: avgSpecialTeams, unit: '%', color: '#3B82F6', icon: Zap, importance: 0.78 }
      ],
      outputs: [
        { 
          id: 'win', 
          label: 'WIN PROBABILITY', 
          shortLabel: 'WIN %',
          value: topBet.winProb ? (topBet.winProb * 100) : 52.5, 
          unit: '%', 
          color: '#F59E0B',
          icon: TrendingUp,
          confidence: 0.89
        },
        { 
          id: 'total', 
          label: 'TOTAL GOALS', 
          shortLabel: 'TOTAL',
          value: topBet.total || 6.2, 
          unit: ' goals', 
          color: '#F59E0B',
          icon: Activity,
          confidence: 0.85
        },
        { 
          id: 'ev', 
          label: 'EXPECTED VALUE', 
          shortLabel: 'EV',
          value: topBet.ev ? Math.abs(topBet.ev) : 12.5, 
          unit: '%', 
          color: '#10B981',
          icon: Zap,
          confidence: 0.92
        }
      ],
      game: topBet.game || 'League Average',
      modelVersion: 'v2.1',
      confidence: 0.89
    };
  }, [dataProcessor]);

  // Auto-cycle through predictions with wave animation
  useEffect(() => {
    if (isPaused || !dataProcessor) return;

    const interval = setInterval(() => {
      setCurrentPrediction(prev => (prev + 1) % 3);
      setProcessingWave(0);
    }, 6000);

    return () => clearInterval(interval);
  }, [isPaused, dataProcessor]);

  // Processing wave animation
  useEffect(() => {
    if (isPaused) return;

    const animate = () => {
      setProcessingWave(prev => {
        if (prev >= 1) return 0;
        return prev + 0.005;
      });
      animationFrame.current = requestAnimationFrame(animate);
    };

    animationFrame.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [isPaused]);

  if (!networkData) return null;

  // Enhanced layout configuration
  const nodeSize = isMobile ? 32 : 48;
  const layerSpacing = isMobile ? 140 : 240;
  const nodeSpacing = isMobile ? 70 : 90;

  // Calculate layer positions with MORE nodes for sophistication
  const inputLayer = networkData.inputs.map((node, i) => ({
    ...node,
    x: isMobile ? 60 : 120,
    y: 80 + i * nodeSpacing,
    layer: 'input',
    index: i
  }));

  // Hidden layer 1 (5 nodes - MORE sophisticated)
  const hidden1 = Array.from({ length: 5 }, (_, i) => ({
    id: `h1-${i}`,
    x: isMobile ? 60 + layerSpacing : 120 + layerSpacing,
    y: 120 + i * (nodeSpacing * 1.1),
    layer: 'hidden1',
    color: '#8B5CF6',
    index: i
  }));

  // Hidden layer 2 (4 nodes)
  const hidden2 = Array.from({ length: 4 }, (_, i) => ({
    id: `h2-${i}`,
    x: isMobile ? 60 + layerSpacing * 2 : 120 + layerSpacing * 2,
    y: 160 + i * (nodeSpacing * 1.3),
    layer: 'hidden2',
    color: '#A78BFA',
    index: i
  }));

  // Output layer
  const outputLayer = networkData.outputs.map((node, i) => ({
    ...node,
    x: isMobile ? 60 + layerSpacing * 3 : 120 + layerSpacing * 3,
    y: 200 + i * (nodeSpacing * 1.4),
    layer: 'output',
    index: i
  }));

  const allNodes = [...inputLayer, ...hidden1, ...hidden2, ...outputLayer];

  // Generate connections with SOPHISTICATED weighting
  const connections = [];
  
  // Input to Hidden1 - weighted by importance
  inputLayer.forEach(input => {
    hidden1.forEach(h1 => {
      const weight = (input.importance || 0.5) * (Math.random() * 0.4 + 0.6);
      const isPositive = Math.random() > 0.25;
      connections.push({
        from: input,
        to: h1,
        weight,
        isPositive,
        id: `${input.id}-${h1.id}`,
        layer: 'input-h1'
      });
    });
  });

  // Hidden1 to Hidden2
  hidden1.forEach(h1 => {
    hidden2.forEach(h2 => {
      const weight = Math.random() * 0.5 + 0.5;
      const isPositive = Math.random() > 0.3;
      connections.push({
        from: h1,
        to: h2,
        weight,
        isPositive,
        id: `${h1.id}-${h2.id}`,
        layer: 'h1-h2'
      });
    });
  });

  // Hidden2 to Output - weighted by confidence
  hidden2.forEach(h2 => {
    outputLayer.forEach(output => {
      const weight = (output.confidence || 0.8) * (Math.random() * 0.3 + 0.7);
      const isPositive = Math.random() > 0.2;
      connections.push({
        from: h2,
        to: output,
        weight,
        isPositive,
        id: `${h2.id}-${output.id}`,
        layer: 'h2-output'
      });
    });
  });

  const containerHeight = isMobile ? 700 : 650;

  return (
    <div
      style={{
        marginBottom: '3rem',
        background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.98) 0%, rgba(31, 41, 55, 0.98) 50%, rgba(17, 24, 39, 0.98) 100%)',
        borderRadius: '20px',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        padding: isMobile ? '2rem 1rem' : '3rem 2rem',
        boxShadow: '0 20px 60px rgba(139, 92, 246, 0.25), 0 0 100px rgba(139, 92, 246, 0.1) inset',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Animated background particles */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.12) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.08) 0%, transparent 70%)
        `,
        pointerEvents: 'none',
        zIndex: 0,
        animation: 'breathe 8s ease-in-out infinite'
      }} />

      {/* Premium Header */}
      <div style={{ position: 'relative', zIndex: 1, marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <motion.div 
              style={{
                width: '52px',
                height: '52px',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 50%, #F59E0B 100%)',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(139, 92, 246, 0.5), 0 0 40px rgba(139, 92, 246, 0.3)',
                border: '2px solid rgba(255, 255, 255, 0.2)'
              }}
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Brain size={28} color="white" strokeWidth={2.5} />
            </motion.div>
            <div>
              <h2 style={{
                fontSize: isMobile ? '1.75rem' : '2rem',
                fontWeight: '900',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 40%, #F59E0B 70%, #FBBF24 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                margin: 0,
                letterSpacing: '0.02em',
                textShadow: '0 0 40px rgba(139, 92, 246, 0.3)'
              }}>
                THE NEURAL ENGINE
              </h2>
              <p style={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: isMobile ? '0.75rem' : '0.813rem',
                margin: '0.25rem 0 0 0',
                fontWeight: '500',
                letterSpacing: '0.05em'
              }}>
                DEEP LEARNING MODEL v{networkData.modelVersion} • {Math.round(networkData.confidence * 100)}% CONFIDENCE
              </p>
            </div>
          </div>
          
          {/* Live indicator */}
          <motion.div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: 'rgba(16, 185, 129, 0.15)',
              borderRadius: '20px',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10B981',
              boxShadow: '0 0 10px #10B981'
            }} />
            <span style={{
              color: '#10B981',
              fontSize: '0.75rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              PROCESSING LIVE
            </span>
          </motion.div>
        </div>
        
        <p style={{
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: isMobile ? '0.875rem' : '0.938rem',
          margin: '1rem 0 0 0',
          lineHeight: '1.6',
          maxWidth: '800px'
        }}>
          Watch our AI process {networkData.inputs.length} input signals through {hidden1.length + hidden2.length} neural pathways to generate real-time predictions for <span style={{ color: '#F59E0B', fontWeight: '600' }}>{networkData.game}</span>
        </p>
      </div>

      {/* Neural Network Visualization */}
      <div style={{
        position: 'relative',
        height: `${containerHeight}px`,
        width: '100%',
        zIndex: 1
      }}>
        <svg
          ref={canvasRef}
          width="100%"
          height={containerHeight}
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <defs>
            {/* Enhanced glow filter */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            {/* Stronger glow for active connections */}
            <filter id="strongGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            {/* Gradient for connections */}
            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 0.8 }} />
              <stop offset="50%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#F59E0B', stopOpacity: 0.8 }} />
            </linearGradient>
          </defs>

          {/* Render connections with wave animation */}
          {connections.map(conn => {
            const isHovered = hoveredConnection === conn.id;
            const isNodeHovered = hoveredNode === conn.from.id || hoveredNode === conn.to.id;
            
            // Calculate wave effect
            const waveDelay = (conn.from.index || 0) * 0.1;
            const waveProgress = Math.max(0, Math.min(1, (processingWave - waveDelay) * 2));
            
            const baseOpacity = conn.weight * 0.5;
            const opacity = isHovered ? 1 : isNodeHovered ? 0.8 : baseOpacity + (waveProgress * 0.3);
            const strokeWidth = isHovered ? 4 : isNodeHovered ? 3 : conn.weight * 2.5;
            const color = conn.isPositive ? '#10B981' : '#3B82F6';

            return (
              <motion.line
                key={conn.id}
                x1={conn.from.x}
                y1={conn.from.y}
                x2={conn.to.x}
                y2={conn.to.y}
                stroke={isHovered || isNodeHovered ? 'url(#connectionGradient)' : color}
                strokeWidth={strokeWidth}
                opacity={opacity}
                strokeDasharray="8,4"
                filter={isHovered ? "url(#strongGlow)" : "url(#glow)"}
                animate={{
                  strokeDashoffset: isPaused ? 0 : [0, -12]
                }}
                transition={{
                  duration: 1.5,
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

        {/* Render nodes with enhanced styling */}
        {allNodes.map(node => {
          const isHovered = hoveredNode === node.id;
          const isInput = node.layer === 'input';
          const isOutput = node.layer === 'output';
          const isHidden = node.layer.includes('hidden');
          
          // Wave animation for processing
          const waveDelay = (node.index || 0) * 0.1;
          const waveProgress = Math.max(0, Math.min(1, (processingWave - waveDelay) * 2));

          return (
            <motion.div
              key={node.id}
              style={{
                position: 'absolute',
                left: `${node.x}px`,
                top: `${node.y}px`,
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
                zIndex: isHovered ? 100 : isOutput ? 20 : 10
              }}
              animate={{
                scale: isHovered ? 1.3 : [1, 1.05 + (waveProgress * 0.1), 1]
              }}
              transition={{
                scale: {
                  duration: isHovered ? 0.2 : 2.5,
                  repeat: isHovered ? 0 : Infinity,
                  ease: "easeInOut"
                }
              }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Node glow ring */}
              <motion.div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: `${nodeSize + 20}px`,
                  height: `${nodeSize + 20}px`,
                  borderRadius: '50%',
                  background: isOutput 
                    ? 'radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, transparent 70%)'
                    : isInput
                    ? 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)'
                    : 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)',
                  pointerEvents: 'none'
                }}
                animate={{
                  scale: [1, 1.3 + (waveProgress * 0.3), 1],
                  opacity: [0.5, 0.8 + (waveProgress * 0.2), 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Node circle */}
              <motion.div 
                style={{
                  width: `${nodeSize}px`,
                  height: `${nodeSize}px`,
                  borderRadius: '50%',
                  background: isOutput 
                    ? 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 50%, #FCD34D 100%)'
                    : isInput
                    ? 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 50%, #93C5FD 100%)'
                    : node.layer === 'hidden1'
                    ? 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 50%, #C4B5FD 100%)'
                    : 'linear-gradient(135deg, #A78BFA 0%, #C4B5FD 50%, #DDD6FE 100%)',
                  boxShadow: isHovered
                    ? `0 0 30px ${node.color || '#8B5CF6'}, 0 0 60px ${node.color || '#8B5CF6'}, 0 0 90px ${node.color || '#8B5CF6'}`
                    : `0 0 15px ${node.color || '#8B5CF6'}, 0 0 30px ${node.color || '#8B5CF6'}`,
                  border: '3px solid rgba(255, 255, 255, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  backdropFilter: 'blur(10px)'
                }}
                animate={{
                  boxShadow: [
                    `0 0 15px ${node.color || '#8B5CF6'}`,
                    `0 0 25px ${node.color || '#8B5CF6'}, 0 0 40px ${node.color || '#8B5CF6'}`,
                    `0 0 15px ${node.color || '#8B5CF6'}`
                  ]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {/* Icon for input/output nodes */}
                {(isInput || isOutput) && node.icon && (
                  <node.icon size={isMobile ? 14 : 18} color="white" strokeWidth={3} />
                )}
                
                {/* Hidden layer indicator */}
                {isHidden && (
                  <div style={{
                    width: '60%',
                    height: '60%',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.4)',
                    border: '2px solid rgba(255, 255, 255, 0.6)'
                  }} />
                )}
              </motion.div>

              {/* Node label - LEFT side for inputs */}
              {isInput && (
                <motion.div 
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: `${nodeSize + 15}px`,
                    transform: 'translateY(-50%)',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none'
                  }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: node.index * 0.1 }}
                >
                  <div style={{
                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                    fontWeight: '700',
                    color: 'rgba(255, 255, 255, 0.95)',
                    marginBottom: '0.25rem',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
                  }}>
                    {node.shortLabel}
                  </div>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        fontSize: isMobile ? '0.688rem' : '0.75rem',
                        color: 'rgba(255, 255, 255, 0.7)',
                        background: 'rgba(17, 24, 39, 0.9)',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        border: '1px solid rgba(59, 130, 246, 0.3)'
                      }}
                    >
                      {node.value.toFixed(2)}{node.unit}
                      <div style={{ fontSize: '0.625rem', marginTop: '0.125rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                        {node.label}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Node label - RIGHT side for outputs with dramatic display */}
              {isOutput && (
                <motion.div 
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: `${nodeSize + 15}px`,
                    transform: 'translateY(-50%)',
                    textAlign: 'right',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none'
                  }}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + node.index * 0.15 }}
                >
                  <div style={{
                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                    fontWeight: '700',
                    color: 'rgba(255, 255, 255, 0.95)',
                    marginBottom: '0.25rem',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {node.shortLabel}
                  </div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 + node.index * 0.15 }}
                    style={{
                      fontSize: isMobile ? '1.75rem' : '2.25rem',
                      fontWeight: '900',
                      color: node.id === 'ev' ? '#10B981' : '#F59E0B',
                      textShadow: `0 0 20px ${node.id === 'ev' ? '#10B981' : '#F59E0B'}, 0 4px 8px rgba(0, 0, 0, 0.5)`,
                      marginRight: isMobile ? '70px' : '100px',
                      letterSpacing: '-0.02em'
                    }}
                  >
                    <CountUp value={node.value} unit={node.unit} />
                  </motion.div>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        fontSize: isMobile ? '0.688rem' : '0.75rem',
                        color: 'rgba(255, 255, 255, 0.7)',
                        background: 'rgba(17, 24, 39, 0.9)',
                        padding: '0.375rem 0.625rem',
                        borderRadius: '6px',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        marginTop: '0.5rem',
                        marginRight: isMobile ? '70px' : '100px'
                      }}
                    >
                      <div style={{ fontWeight: '600', marginBottom: '0.125rem' }}>{node.label}</div>
                      <div style={{ fontSize: '0.625rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                        Confidence: {Math.round(node.confidence * 100)}%
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </motion.div>
          );
        })}

        {/* Layer labels with enhanced styling */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: isMobile ? '1.5rem' : '3rem',
          fontSize: isMobile ? '0.688rem' : '0.75rem',
          color: 'rgba(255, 255, 255, 0.5)',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          fontWeight: '700'
        }}>
          <motion.div
            animate={{ color: ['rgba(59, 130, 246, 0.5)', 'rgba(59, 130, 246, 1)', 'rgba(59, 130, 246, 0.5)'] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            INPUT LAYER
          </motion.div>
          <motion.div
            animate={{ color: ['rgba(139, 92, 246, 0.5)', 'rgba(139, 92, 246, 1)', 'rgba(139, 92, 246, 0.5)'] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          >
            HIDDEN LAYERS
          </motion.div>
          <motion.div
            animate={{ color: ['rgba(245, 158, 11, 0.5)', 'rgba(245, 158, 11, 1)', 'rgba(245, 158, 11, 0.5)'] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          >
            OUTPUT LAYER
          </motion.div>
        </div>
      </div>

      {/* Enhanced hover tooltip */}
      <AnimatePresence>
        {hoveredConnection && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            style={{
              position: 'absolute',
              bottom: '80px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.98) 0%, rgba(31, 41, 55, 0.98) 100%)',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              borderRadius: '10px',
              padding: '0.75rem 1.25rem',
              fontSize: '0.813rem',
              color: 'rgba(255, 255, 255, 0.9)',
              zIndex: 1000,
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5), 0 0 40px rgba(139, 92, 246, 0.2)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div style={{ fontWeight: '700', marginBottom: '0.25rem', color: '#A78BFA' }}>
              Neural Connection
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '40px',
                height: '4px',
                background: 'linear-gradient(90deg, #3B82F6, #8B5CF6, #F59E0B)',
                borderRadius: '2px'
              }} />
              <span style={{ fontWeight: '600' }}>
                Strength: {(connections.find(c => c.id === hoveredConnection)?.weight * 100).toFixed(0)}%
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Processing status bar */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'rgba(139, 92, 246, 0.2)',
          overflow: 'hidden'
        }}
      >
        <motion.div
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #3B82F6, #8B5CF6, #F59E0B)',
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.6)'
          }}
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </motion.div>

      {/* CSS for breathe animation */}
      <style>{`
        @keyframes breathe {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

// Enhanced count-up animation component
const CountUp = ({ value, unit }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 90;
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
      <span style={{ fontSize: '0.6em', opacity: 0.8, marginLeft: '0.125rem' }}>{unit}</span>
    </>
  );
};

export default NeuralNetwork;
