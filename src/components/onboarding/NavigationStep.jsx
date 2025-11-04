import { motion } from 'framer-motion';
import { Target, LineChart, BarChart3, TrendingUp, BookOpen } from 'lucide-react';

/**
 * Navigation Guide Step - Shows users how to navigate the site
 * Highlights key dashboard sections
 */
export default function NavigationStep() {
  const sections = [
    {
      icon: Target,
      title: "Today's Games",
      subtitle: 'Start here daily',
      description: 'Best bets for tonight • Live odds and edges • One-click analysis',
      color: '#D4AF37',
      path: '/'
    },
    {
      icon: LineChart,
      title: 'Hot Takes',
      subtitle: 'AI Expert Analysis',
      description: 'Deep dives on key matchups • Hidden edges explained • Shareable insights',
      color: '#EF4444',
      path: '/matchup-insights'
    },
    {
      icon: BarChart3,
      title: 'Dashboard',
      subtitle: 'Quick Overview',
      description: 'Top opportunities • League-wide trends • Performance metrics',
      color: '#3B82F6',
      path: '/dashboard'
    },
    {
      icon: TrendingUp,
      title: 'Performance',
      subtitle: 'Track Results',
      description: 'Historical win rates • Closing line value • Transparent results',
      color: '#10B981',
      path: '/performance'
    },
    {
      icon: BookOpen,
      title: 'Methodology',
      subtitle: 'How We Win',
      description: 'Model explanation • Statistical foundation • Trust through transparency',
      color: '#8B5CF6',
      path: '/methodology'
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
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '800',
          color: '#D4AF37',
          marginBottom: '0.75rem',
          letterSpacing: '-0.025em'
        }}>
          Your Dashboard Tour
        </h2>
        <p style={{
          fontSize: '1rem',
          color: 'rgba(255, 255, 255, 0.7)',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Navigate like a pro - here's where everything lives
        </p>
      </motion.div>

      {/* Navigation Cards */}
      <div 
        className="navigation-cards"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          width: '100%',
          maxWidth: '700px'
        }}
      >
        {sections.map((section, index) => {
          const Icon = section.icon;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.2 + index * 0.1,
                duration: 0.4
              }}
              whileHover={{
                x: 8,
                transition: { duration: 0.2 }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                padding: '1.5rem',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #1A1F2E 0%, #151923 100%)',
                border: '1.5px solid rgba(255, 255, 255, 0.12)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              {/* Color accent bar */}
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '4px',
                  background: section.color,
                  transformOrigin: 'top'
                }}
              />

              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: 0.4 + index * 0.1,
                  type: 'spring',
                  stiffness: 200
                }}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  background: `${section.color}20`,
                  border: `2px solid ${section.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: `0 4px 20px ${section.color}30`
                }}
              >
                <Icon size={28} color={section.color} strokeWidth={2.5} />
              </motion.div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '800',
                    color: '#fff',
                    margin: 0,
                    letterSpacing: '-0.01em'
                  }}>
                    {section.title}
                  </h3>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: section.color,
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    background: `${section.color}20`,
                    border: `1px solid ${section.color}40`
                  }}>
                    {section.subtitle}
                  </span>
                </div>
                <p style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: 'rgba(255, 255, 255, 0.7)',
                  margin: 0,
                  lineHeight: 1.5
                }}>
                  {section.description}
                </p>
              </div>

              {/* Arrow indicator */}
              <motion.div
                initial={{ x: -5, opacity: 0 }}
                animate={{ x: 0, opacity: 0.5 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                style={{
                  fontSize: '1.5rem',
                  color: section.color,
                  fontWeight: '300'
                }}
              >
                →
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Pro Tip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        style={{
          marginTop: '2rem',
          padding: '1rem 1.5rem',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05))',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          maxWidth: '700px',
          width: '100%'
        }}
      >
        <div style={{
          fontSize: '0.75rem',
          fontWeight: '700',
          color: '#D4AF37',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '0.5rem'
        }}>
          💡 Pro Tip
        </div>
        <p style={{
          fontSize: '0.875rem',
          color: 'rgba(255, 255, 255, 0.8)',
          margin: 0,
          lineHeight: 1.6
        }}>
          Start with <strong>Today's Games</strong> to see tonight's opportunities, then dive into <strong>Hot Takes</strong> for deeper analysis on key matchups.
        </p>
      </motion.div>
    </div>
  );
}

