import { motion } from 'framer-motion';
import { BarChart3, Sparkles, Activity } from 'lucide-react';

/**
 * Three Pillars Step - Shows the core value propositions
 * Animated cards that reveal NHL Savant's competitive advantages
 */
export default function ThreePillarsStep() {
  const pillars = [
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      points: [
        '100+ NHL metrics analyzed',
        'Expected Goals (xG), PDO, high-danger chances',
        'Goes deeper than Vegas'
      ],
      color: '#10B981',
      gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.04) 100%)',
      shadowColor: 'rgba(16, 185, 129, 0.15)'
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Insights',
      points: [
        'Expert analysis for every game',
        'Hot Takes identify hidden edges',
        'Narrative-driven recommendations'
      ],
      color: '#D4AF37',
      gradient: 'linear-gradient(135deg, #FFD700 0%, #D4AF37 100%)',
      bgGradient: 'linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(212, 175, 55, 0.04) 100%)',
      shadowColor: 'rgba(212, 175, 55, 0.15)'
    },
    {
      icon: Activity,
      title: 'Real-Time Data',
      points: [
        'Live odds integration',
        'Starting goalie updates',
        'Performance tracking'
      ],
      color: '#3B82F6',
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
      bgGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.04) 100%)',
      shadowColor: 'rgba(59, 130, 246, 0.15)'
    }
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem',
      minHeight: '500px'
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center', marginBottom: '3rem' }}
      >
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '800',
          color: '#D4AF37',
          marginBottom: '0.75rem',
          letterSpacing: '-0.025em'
        }}>
          How NHL Savant Gives You an Edge
        </h2>
        <p style={{
          fontSize: '1rem',
          color: 'rgba(255, 255, 255, 0.7)',
          maxWidth: '600px'
        }}>
          Three pillars of betting intelligence working together
        </p>
      </motion.div>

      {/* Pillar Cards */}
      <div 
        className="pillar-cards"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          width: '100%',
          maxWidth: '1000px'
        }}
      >
        {pillars.map((pillar, index) => {
          const Icon = pillar.icon;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, rotateY: -15 }}
              animate={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{
                delay: 0.2 + index * 0.15,
                duration: 0.6,
                type: 'spring',
                stiffness: 100
              }}
              whileHover={{
                y: -8,
                transition: { duration: 0.2 }
              }}
              style={{
                background: pillar.bgGradient,
                borderRadius: '16px',
                padding: '2rem',
                border: `1.5px solid ${pillar.color}4D`,
                boxShadow: `0 4px 16px rgba(0, 0, 0, 0.4), 0 2px 8px ${pillar.shadowColor}`,
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(10px)'
              }}
            >
              {/* Gradient overlay */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: pillar.gradient
              }} />

              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: 0.4 + index * 0.15,
                  type: 'spring',
                  stiffness: 200
                }}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '12px',
                  background: pillar.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                  boxShadow: `0 4px 20px ${pillar.shadowColor}`
                }}
              >
                <Icon size={32} color="#fff" strokeWidth={2.5} />
              </motion.div>

              {/* Title */}
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '800',
                color: '#fff',
                marginBottom: '1rem',
                letterSpacing: '-0.01em'
              }}>
                {pillar.title}
              </h3>

              {/* Points */}
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                {pillar.points.map((point, pointIndex) => (
                  <motion.li
                    key={pointIndex}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.6 + index * 0.15 + pointIndex * 0.1
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'start',
                      gap: '0.75rem',
                      fontSize: '0.875rem',
                      color: 'rgba(255, 255, 255, 0.8)',
                      lineHeight: 1.6
                    }}
                  >
                    <span style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: pillar.gradient,
                      flexShrink: 0,
                      marginTop: '0.5rem',
                      boxShadow: `0 0 8px ${pillar.shadowColor}`
                    }} />
                    {point}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

