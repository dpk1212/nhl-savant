import { motion } from 'framer-motion';
import { TrendingUp, Shield, Sparkles } from 'lucide-react';

/**
 * Welcome Step - First impression with trust signals
 * Showcases 64.7% win rate and establishes credibility
 */
export default function WelcomeStep() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      padding: '2rem',
      textAlign: 'center'
    }}>
      {/* Premium Badge with Win Rate */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          type: 'spring', 
          stiffness: 200, 
          damping: 20,
          delay: 0.2 
        }}
        style={{
          position: 'relative',
          marginBottom: '2rem'
        }}
      >
        <div style={{
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #FFD700 0%, #D4AF37 50%, #B8941F 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 80px rgba(255, 215, 0, 0.5), 0 0 40px rgba(212, 175, 55, 0.7), 0 8px 32px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.3)',
          border: '3px solid rgba(255, 255, 255, 0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Rotating shimmer effect */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'conic-gradient(from 0deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
              pointerEvents: 'none'
            }}
          />
          
          <div style={{ zIndex: 1 }}>
            <div style={{
              fontSize: '3rem',
              fontWeight: '900',
              color: '#000',
              lineHeight: 1,
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
            }}>
              64.7%
            </div>
            <div style={{
              fontSize: '0.875rem',
              fontWeight: '700',
              color: 'rgba(0, 0, 0, 0.8)',
              marginTop: '0.25rem',
              letterSpacing: '0.05em'
            }}>
              WIN RATE
            </div>
          </div>
        </div>
        
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-20, -40, -20],
              x: [0, Math.sin(i) * 20, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2 + i * 0.3,
              repeat: Infinity,
              delay: i * 0.4
            }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#FFD700',
              pointerEvents: 'none'
            }}
          />
        ))}
      </motion.div>

      {/* Welcome Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '900',
          background: 'linear-gradient(135deg, #FFD700 0%, #D4AF37 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '0.75rem',
          letterSpacing: '-0.025em'
        }}>
          Welcome to NHL Savant
        </h1>
        
        <p style={{
          fontSize: '1.125rem',
          color: 'rgba(255, 255, 255, 0.8)',
          marginBottom: '2rem',
          maxWidth: '500px',
          lineHeight: 1.6
        }}>
          Premium analytics powered by advanced statistics and AI
        </p>
      </motion.div>

      {/* Trust Signals */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="trust-cards"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
          marginTop: '1rem',
          width: '100%',
          maxWidth: '600px'
        }}
      >
        {[
          { icon: TrendingUp, label: '64.7% Moneyline Win Rate', color: '#10B981' },
          { icon: Shield, label: 'Professional-grade predictions', color: '#D4AF37' },
          { icon: Sparkles, label: 'Transparent methodology', color: '#3B82F6' }
        ].map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '1rem',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(212, 175, 55, 0.02) 100%)',
                border: '1.5px solid rgba(212, 175, 55, 0.25)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              <Icon size={24} color={item.color} strokeWidth={2.5} />
              <span style={{
                fontSize: '0.75rem',
                color: 'rgba(255, 255, 255, 0.7)',
                textAlign: 'center',
                lineHeight: 1.4
              }}>
                {item.label}
              </span>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

