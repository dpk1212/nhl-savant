import { motion } from 'framer-motion';
import { Award, TrendingUp, FileText, Sparkles } from 'lucide-react';

/**
 * Live Demo Step - Shows what users will see in the actual interface
 * Interactive preview with animated callouts
 */
export default function LiveDemoStep() {
  const callouts = [
    {
      icon: Award,
      label: 'Bet Rating',
      description: 'A-grade = 5%+ edge',
      color: '#10B981',
      position: { top: '10%', left: '5%' }
    },
    {
      icon: TrendingUp,
      label: 'Model Prediction',
      description: 'Our 64.7% win rate model',
      color: '#D4AF37',
      position: { top: '10%', right: '5%' }
    },
    {
      icon: FileText,
      label: 'Key Factors',
      description: 'Why we like this bet',
      color: '#3B82F6',
      position: { bottom: '30%', left: '5%' }
    },
    {
      icon: Sparkles,
      label: 'AI Analysis',
      description: 'Expert narrative for context',
      color: '#A855F7',
      position: { bottom: '30%', right: '5%' }
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
        style={{ textAlign: 'center', marginBottom: '2rem' }}
      >
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '800',
          color: '#D4AF37',
          marginBottom: '0.75rem',
          letterSpacing: '-0.025em'
        }}>
          Here's What You'll See Today
        </h2>
        <p style={{
          fontSize: '1rem',
          color: 'rgba(255, 255, 255, 0.7)',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Every game card gives you everything you need to make informed bets
        </p>
      </motion.div>

      {/* Mock Game Card with Callouts */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '700px',
        marginBottom: '2rem'
      }}>
        {/* Simplified Game Card Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{
            background: 'linear-gradient(135deg, #151923 0%, #0B0F1F 100%)',
            borderRadius: '20px',
            padding: '2rem',
            border: '2px solid rgba(212, 175, 55, 0.35)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6), 0 4px 16px rgba(212, 175, 55, 0.2)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Gradient accent */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #D4AF37, #FFD700, #D4AF37)'
          }} />

          {/* Mock Content */}
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            {/* Rating Badge */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10B981, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              fontWeight: '900',
              color: '#fff',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)'
            }}>
              A
            </div>

            {/* Game Info */}
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#fff',
                marginBottom: '0.5rem'
              }}>
                TOR @ BOS
              </div>
              <div style={{
                display: 'flex',
                gap: '1.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'rgba(255, 255, 255, 0.8)'
              }}>
                <span>🎯 Moneyline: TOR +145</span>
                <span>📊 Model: 52.3% win prob</span>
                <span style={{ 
                  color: '#10B981',
                  fontWeight: '700'
                }}>💰 Edge: +8.2%</span>
              </div>
            </div>
          </div>

          {/* Placeholder sections */}
          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem'
          }}>
            <div style={{
              padding: '1rem',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div style={{
                fontSize: '0.75rem',
                color: 'rgba(255, 255, 255, 0.5)',
                marginBottom: '0.5rem'
              }}>
                KEY FACTORS
              </div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                • Elite offense vs weak defense
              </div>
            </div>
            <div style={{
              padding: '1rem',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div style={{
                fontSize: '0.75rem',
                color: 'rgba(255, 255, 255, 0.5)',
                marginBottom: '0.5rem'
              }}>
                AI INSIGHT
              </div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                "Toronto's high-danger chances..."
              </div>
            </div>
          </div>
        </motion.div>

        {/* Animated Callout Pointers */}
        {callouts.map((callout, index) => {
          const Icon = callout.icon;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.2, type: 'spring' }}
              style={{
                position: 'absolute',
                ...callout.position,
                zIndex: 10
              }}
            >
              {/* Pointer line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.7 + index * 0.2 }}
                style={{
                  position: 'absolute',
                  height: '2px',
                  width: '40px',
                  background: callout.color,
                  transformOrigin: callout.position.left ? 'left' : 'right',
                  [callout.position.left ? 'right' : 'left']: '100%',
                  top: '50%'
                }}
              />

              {/* Callout card */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.98) 0%, rgba(11, 15, 31, 0.98) 100%)',
                  borderRadius: '12px',
                  padding: '0.75rem 1rem',
                  border: `2px solid ${callout.color}`,
                  boxShadow: `0 8px 24px ${callout.color}40, 0 2px 8px rgba(0, 0, 0, 0.4)`,
                  minWidth: '200px',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <Icon size={20} color={callout.color} />
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    color: '#fff'
                  }}>
                    {callout.label}
                  </span>
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                  lineHeight: 1.4
                }}>
                  {callout.description}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Feature List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        style={{
          maxWidth: '500px',
          padding: '1.5rem',
          borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <p style={{
          fontSize: '0.875rem',
          color: 'rgba(255, 255, 255, 0.7)',
          margin: 0,
          lineHeight: 1.6
        }}>
          <strong style={{ color: '#D4AF37' }}>Every game card shows:</strong><br />
          • Clear A-F rating (only bet A/B grades)<br />
          • Model's prediction vs market odds<br />
          • Statistical edge factors<br />
          • AI-generated insights
        </p>
      </motion.div>
    </div>
  );
}

