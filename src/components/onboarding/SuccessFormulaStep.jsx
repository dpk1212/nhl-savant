import { motion } from 'framer-motion';
import { Calendar, Award, Brain, CheckCircle2 } from 'lucide-react';

/**
 * Success Formula Step - Final step with winning strategy
 * 3-step formula for success with NHL Savant
 */
export default function SuccessFormulaStep({ onComplete, onViewMethodology }) {
  const steps = [
    {
      number: 1,
      icon: Calendar,
      title: 'Check Daily (Before Game Time)',
      points: [
        'New predictions every morning',
        'Odds update throughout day',
        'Best edges highlighted'
      ],
      color: '#3B82F6'
    },
    {
      number: 2,
      icon: Award,
      title: 'Focus on A/B Bets (5%+ Edge)',
      points: [
        'Our 64.7% win rate comes from discipline',
        'C/D grades = skip or small stakes',
        'Quality over quantity'
      ],
      color: '#D4AF37'
    },
    {
      number: 3,
      icon: Brain,
      title: 'Understand the Why',
      points: [
        'Read the factors (analytics matter)',
        'Check Hot Takes for context',
        'Trust the process, not every result'
      ],
      color: '#10B981'
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
        style={{ textAlign: 'center', marginBottom: '2.5rem' }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
            marginBottom: '1.5rem',
            boxShadow: '0 8px 32px rgba(212, 175, 55, 0.5)'
          }}
        >
          <CheckCircle2 size={48} color="#000" strokeWidth={3} />
        </motion.div>

        <h2 style={{
          fontSize: '2rem',
          fontWeight: '800',
          color: '#D4AF37',
          marginBottom: '0.75rem',
          letterSpacing: '-0.025em'
        }}>
          3 Steps to Winning with NHL Savant
        </h2>
        <p style={{
          fontSize: '1rem',
          color: 'rgba(255, 255, 255, 0.7)',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Follow this simple formula to maximize your edge
        </p>
      </motion.div>

      {/* Steps */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        width: '100%',
        maxWidth: '700px',
        marginBottom: '2rem'
      }}>
        {steps.map((step, index) => {
          const Icon = step.icon;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.3 + index * 0.15,
                duration: 0.5
              }}
              style={{
                display: 'flex',
                gap: '1.5rem',
                padding: '1.5rem',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #151923 0%, #0B0F1F 100%)',
                border: `2px solid ${step.color}4D`,
                boxShadow: `0 8px 32px ${step.color}20, 0 2px 8px rgba(0, 0, 0, 0.4)`,
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(10px)'
              }}
            >
              {/* Background gradient */}
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '200px',
                height: '100%',
                background: `linear-gradient(90deg, transparent, ${step.color}10)`,
                pointerEvents: 'none'
              }} />

              {/* Step Number & Icon */}
              <div style={{ position: 'relative' }}>
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: 0.5 + index * 0.15,
                    type: 'spring',
                    stiffness: 200
                  }}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '16px',
                    background: `linear-gradient(135deg, ${step.color}, ${step.color}CC)`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 8px 24px ${step.color}40`,
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Shimmer effect */}
                  <motion.div
                    animate={{
                      x: ['-100%', '100%']
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)'
                    }}
                  />
                  
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: '900',
                    color: '#fff',
                    lineHeight: 1
                  }}>
                    {step.number}
                  </div>
                  <Icon size={20} color="#fff" strokeWidth={2.5} style={{ marginTop: '0.25rem' }} />
                </motion.div>
              </div>

              {/* Content */}
              <div style={{ flex: 1, position: 'relative' }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '800',
                  color: '#fff',
                  marginBottom: '0.75rem',
                  letterSpacing: '-0.01em'
                }}>
                  {step.title}
                </h3>
                
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  {step.points.map((point, pointIndex) => (
                    <motion.li
                      key={pointIndex}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.7 + index * 0.15 + pointIndex * 0.1
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
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: 0.8 + index * 0.15 + pointIndex * 0.1,
                          type: 'spring'
                        }}
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: step.color,
                          flexShrink: 0,
                          marginTop: '0.5rem',
                          boxShadow: `0 0 8px ${step.color}`
                        }}
                      />
                      {point}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Final Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        style={{
          textAlign: 'center',
          padding: '2rem',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.05))',
          border: '2px solid rgba(212, 175, 55, 0.3)',
          maxWidth: '700px',
          width: '100%'
        }}
      >
        <div style={{
          fontSize: '1.125rem',
          fontWeight: '600',
          color: '#D4AF37',
          marginBottom: '0.75rem'
        }}>
          🎯 Ready to Start Winning?
        </div>
        <p style={{
          fontSize: '0.875rem',
          color: 'rgba(255, 255, 255, 0.8)',
          lineHeight: 1.6,
          marginBottom: '1.5rem'
        }}>
          You now have everything you need to use NHL Savant like a pro. Remember: discipline and understanding are the keys to long-term success.
        </p>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 10px 30px rgba(212, 175, 55, 0.6)'
            }}
            whileTap={{ scale: 0.95 }}
            onClick={onComplete}
            style={{
              padding: '0.875rem 2rem',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #FFD700 0%, #D4AF37 100%)',
              border: 'none',
              fontSize: '1rem',
              fontWeight: '800',
              letterSpacing: '0.05em',
              color: '#000',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(212, 175, 55, 0.5), 0 2px 8px rgba(212, 175, 55, 0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            START EXPLORING
          </motion.button>

          {onViewMethodology && (
            <motion.button
              whileHover={{ 
                scale: 1.05,
                background: 'rgba(255, 255, 255, 0.08)',
                borderColor: 'rgba(212, 175, 55, 0.5)'
              }}
              whileTap={{ scale: 0.95 }}
              onClick={onViewMethodology}
              style={{
                padding: '0.875rem 2rem',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '2px solid rgba(212, 175, 55, 0.35)',
                backdropFilter: 'blur(10px)',
                fontSize: '1rem',
                fontWeight: '700',
                letterSpacing: '0.02em',
                color: 'rgba(255, 255, 255, 0.9)',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              View Methodology
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

