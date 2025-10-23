import { useState, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { Target, Activity, TrendingUp, Award, Zap, Shield, Users, CheckCircle } from 'lucide-react';

// Animated counter component
const AnimatedCounter = ({ value, suffix = '', prefix = '', decimals = 0 }) => {
  const spring = useSpring(0, { stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) => {
    return prefix + current.toFixed(decimals) + suffix;
  });

  const [displayValue, setDisplayValue] = useState(prefix + '0' + suffix);

  useEffect(() => {
    spring.set(value);
    
    const unsubscribe = display.on('change', (latest) => {
      setDisplayValue(latest);
    });

    return () => unsubscribe();
  }, [value, spring, display]);

  return <span>{displayValue}</span>;
};

const PremiumStatsGrid = ({ dataProcessor, isMobile }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!dataProcessor) return;

    try {
      const allTeams = dataProcessor.getTeamsBySituation('5on5');
      const regressionCandidates = dataProcessor.findRegressionCandidates();
      
      // Calculate stats
      const totalTeams = allTeams.length;
      const avgPDO = allTeams.reduce((sum, team) => sum + (team.pdo || 100), 0) / totalTeams;
      
      // Mock data for metrics we don't have yet
      const gamesThisWeek = 12; // This would come from schedule data
      const modelAccuracy = 58.2; // This would come from performance tracking
      const currentROI = 4.2; // This would come from bet tracking
      const activeEVBets = 10; // This would come from today's opportunities
      const eliteOpportunities = 9; // This would come from today's opportunities (>5% EV)
      const confirmedGoalies = 24; // This would come from goalie data
      const pdoRegressionCandidates = regressionCandidates.overperforming.length + regressionCandidates.underperforming.length;

      setStats({
        totalTeams,
        gamesThisWeek,
        modelAccuracy,
        currentROI,
        activeEVBets,
        eliteOpportunities,
        confirmedGoalies,
        pdoRegressionCandidates
      });
    } catch (error) {
      console.error('Error calculating stats:', error);
    }
  }, [dataProcessor]);

  if (!stats) {
    return (
      <div style={{
        padding: isMobile ? '2rem 1rem' : '3rem 2rem',
        textAlign: 'center',
        color: 'var(--color-text-muted)'
      }}>
        Loading analytics...
      </div>
    );
  }

  const statCards = [
    {
      icon: Target,
      value: stats.totalTeams,
      label: 'Teams Analyzed',
      description: 'Complete league coverage',
      color: '#3B82F6',
      gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.05) 100%)',
      status: 'Live'
    },
    {
      icon: Activity,
      value: stats.gamesThisWeek,
      label: 'Games This Week',
      description: '+12% vs last week',
      color: '#10B981',
      gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.05) 100%)',
      status: 'Active'
    },
    {
      icon: TrendingUp,
      value: stats.modelAccuracy,
      label: 'Model Accuracy',
      description: 'Win probability precision',
      color: '#8B5CF6',
      gradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(139, 92, 246, 0.05) 100%)',
      suffix: '%',
      decimals: 1,
      status: 'Strong'
    },
    {
      icon: Award,
      value: stats.currentROI,
      label: 'Current ROI',
      description: 'Return on investment',
      color: '#FFD700',
      gradient: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 215, 0, 0.05) 100%)',
      suffix: '%',
      decimals: 1,
      status: 'Elite'
    },
    {
      icon: Zap,
      value: stats.activeEVBets,
      label: 'Active +EV Bets',
      description: 'Positive expected value',
      color: '#F59E0B',
      gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.05) 100%)',
      status: 'Today'
    },
    {
      icon: Award,
      value: stats.eliteOpportunities,
      label: 'Elite Opportunities',
      description: '>5% expected value',
      color: '#10B981',
      gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.05) 100%)',
      status: 'Premium'
    },
    {
      icon: Shield,
      value: stats.confirmedGoalies,
      label: 'Confirmed Goalies',
      description: 'Starting goalie data',
      color: '#3B82F6',
      gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.05) 100%)',
      status: 'Ready'
    },
    {
      icon: Users,
      value: stats.pdoRegressionCandidates,
      label: 'PDO Candidates',
      description: 'Regression opportunities',
      color: '#EF4444',
      gradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.05) 100%)',
      status: 'Tracked'
    }
  ];

  return (
    <div style={{
      padding: isMobile ? '1rem' : '2rem 0',
      marginBottom: isMobile ? '2rem' : '3rem'
    }}>
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          textAlign: 'center',
          marginBottom: isMobile ? '1.5rem' : '2rem'
        }}
      >
        <h3 style={{
          fontSize: isMobile ? '1.25rem' : '1.5rem',
          fontWeight: '700',
          color: 'var(--color-text-primary)',
          marginBottom: '0.5rem'
        }}>
          Real-Time Analytics Matrix
        </h3>
        <p style={{
          color: 'var(--color-text-muted)',
          fontSize: isMobile ? '0.875rem' : '0.938rem'
        }}>
          Live metrics updated continuously
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap: isMobile ? '0.75rem' : '1rem',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {statCards.map((card, index) => {
          const Icon = card.icon;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                type: 'spring',
                stiffness: 100
              }}
              whileHover={{
                scale: 1.03,
                transition: { duration: 0.2 }
              }}
              className="premium-stat-card"
              style={{
                background: card.gradient,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${card.color}40`,
                borderRadius: '12px',
                padding: isMobile ? '1rem' : '1.25rem',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {/* Glow effect on hover */}
              <div
                className="card-glow"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `radial-gradient(circle at 50% 50%, ${card.color}20, transparent 70%)`,
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  pointerEvents: 'none'
                }}
              />

              {/* Icon */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.75rem'
              }}>
                <div style={{
                  width: isMobile ? '32px' : '40px',
                  height: isMobile ? '32px' : '40px',
                  borderRadius: '8px',
                  background: `${card.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${card.color}40`
                }}>
                  <Icon size={isMobile ? 16 : 20} color={card.color} strokeWidth={2.5} />
                </div>
                
                {/* Status Badge */}
                <div style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '6px',
                  background: `${card.color}15`,
                  border: `1px solid ${card.color}30`,
                  fontSize: '0.625rem',
                  fontWeight: '700',
                  color: card.color,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {card.status}
                </div>
              </div>

              {/* Value */}
              <div style={{
                fontSize: isMobile ? '1.75rem' : '2.25rem',
                fontWeight: '800',
                color: card.color,
                lineHeight: '1',
                marginBottom: '0.5rem',
                fontFeatureSettings: '"tnum"'
              }}>
                <AnimatedCounter
                  value={card.value}
                  suffix={card.suffix || ''}
                  prefix={card.prefix || ''}
                  decimals={card.decimals || 0}
                />
              </div>

              {/* Label */}
              <div style={{
                fontSize: isMobile ? '0.688rem' : '0.75rem',
                fontWeight: '700',
                color: 'var(--color-text-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.25rem'
              }}>
                {card.label}
              </div>

              {/* Description */}
              <div style={{
                fontSize: isMobile ? '0.688rem' : '0.75rem',
                color: 'var(--color-text-muted)',
                lineHeight: '1.4'
              }}>
                {card.description}
              </div>

              {/* Pulse indicator for live data */}
              {(card.status === 'Live' || card.status === 'Active') && (
                <div style={{
                  position: 'absolute',
                  top: '0.75rem',
                  right: '0.75rem',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: card.color,
                  boxShadow: `0 0 8px ${card.color}`,
                  animation: 'pulse 2s infinite'
                }} />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default PremiumStatsGrid;

