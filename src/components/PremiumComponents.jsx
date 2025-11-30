import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

// Live Clock Component
export const LiveClock = () => {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.375rem',
      padding: '0.25rem 0.625rem',
      background: 'rgba(16, 185, 129, 0.1)',
      border: '1px solid rgba(16, 185, 129, 0.3)',
      borderRadius: '4px'
    }}>
      <div style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: 'var(--color-success)',
        animation: 'pulse 2s infinite'
      }} />
      <span style={{
        fontSize: '0.75rem',
        fontWeight: '600',
        color: 'var(--color-success)',
        fontFeatureSettings: "'tnum'"
      }}>
        {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </span>
    </div>
  );
};

// Sparkle Effect Component
export const SparkleEffect = () => {
  return (
    <>
      <div className="sparkle" style={{ top: '20%', left: '15%', animationDelay: '0s' }} />
      <div className="sparkle" style={{ top: '60%', right: '20%', animationDelay: '0.5s' }} />
      <div className="sparkle" style={{ bottom: '30%', left: '30%', animationDelay: '1s' }} />
    </>
  );
};

// Animated Stat Pill Component
export const AnimatedStatPill = ({ icon, value, label, color, sparkle }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    // Animate count from 0 to value
    const duration = 1000;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value]);
  
  const colorMap = {
    'success': { rgb: '16, 185, 129', var: 'var(--color-success)' },
    'info': { rgb: '59, 130, 246', var: 'var(--color-info)' }
  };
  
  const colorConfig = colorMap[color] || colorMap['info'];
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 0.875rem',
      background: `rgba(${colorConfig.rgb}, 0.1)`,
      border: `1px solid rgba(${colorConfig.rgb}, 0.3)`,
      borderRadius: '8px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {sparkle && <SparkleEffect />}
      
      <div style={{ color: colorConfig.var }}>
        {icon}
      </div>
      
      <div>
        <div style={{ 
          fontSize: '1.25rem',
          fontWeight: '700',
          color: colorConfig.var,
          fontFeatureSettings: "'tnum'",
          lineHeight: '1'
        }}>
          {displayValue}
        </div>
        <div style={{ 
          fontSize: '0.625rem',
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontWeight: '600'
        }}>
          {label}
        </div>
      </div>
    </div>
  );
};

// Bet Type Badge Component
export const BetTypeBadge = ({ type }) => {
  const config = {
    'ML': { label: 'ML', color: '#3B82F6', icon: '⚡' },
    'MONEYLINE': { label: 'ML', color: '#3B82F6', icon: '⚡' },
    'TOTAL': { label: 'O/U', color: '#8B5CF6', icon: '📊' },
    'PL': { label: 'PL', color: '#EC4899', icon: '🎯' },
    'PUCK LINE': { label: 'PL', color: '#EC4899', icon: '🎯' }
  };
  
  const { label, color, icon } = config[type] || config['TOTAL'];
  
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem',
      padding: '0.125rem 0.5rem',
      background: `${color}15`,
      border: `1px solid ${color}40`,
      borderRadius: '4px',
      fontSize: '0.688rem',
      fontWeight: '700',
      color: color,
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    }}>
      <span>{icon}</span>
      <span>{label}</span>
    </span>
  );
};

// EV Display with Confidence Meter
export const EVDisplay = ({ evPercent, showConfidence }) => {
  const getColor = (ev) => {
    if (ev >= 10) return '#10B981';
    if (ev >= 5) return '#059669';
    return '#34D399';
  };
  
  const getConfidenceLevel = (ev) => {
    if (ev >= 8) return 3;
    if (ev >= 4) return 2;
    return 1;
  };
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'flex-start' }}>
      <span style={{ 
        color: getColor(evPercent),
        fontWeight: '700',
        fontSize: '1rem',
        fontFeatureSettings: "'tnum'"
      }}>
        +{evPercent.toFixed(1)}%
      </span>
      
      {showConfidence && (
        <div style={{ display: 'flex', gap: '2px' }}>
          {[1, 2, 3].map(level => (
            <div 
              key={level}
              style={{
                width: '8px',
                height: '3px',
                borderRadius: '2px',
                background: level <= getConfidenceLevel(evPercent) 
                  ? getColor(evPercent)
                  : 'rgba(100, 116, 139, 0.3)',
                transition: 'all 0.3s'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Edge Indicator Component
export const EdgeIndicator = ({ edge }) => {
  const getColor = () => {
    if (Math.abs(edge) > 0.5) return 'var(--color-success)';
    if (Math.abs(edge) > 0.3) return 'var(--color-warning)';
    return 'var(--color-text-secondary)';
  };
  
  return (
    <span style={{ 
      color: getColor(),
      fontWeight: '600',
      fontFeatureSettings: "'tnum'",
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem'
    }}>
      {edge > 0 && <span style={{ fontSize: '0.75rem' }}>▲</span>}
      {edge < 0 && <span style={{ fontSize: '0.75rem' }}>▼</span>}
      {edge > 0 ? '+' : ''}{edge.toFixed(1)}
    </span>
  );
};

// Time Display Component
export const TimeDisplay = ({ time }) => {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem',
      padding: '0.125rem 0.5rem',
      background: 'rgba(59, 130, 246, 0.1)',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      borderRadius: '4px',
      fontSize: '0.813rem',
      fontWeight: '600',
      color: 'var(--color-info)',
      fontFeatureSettings: "'tnum'"
    }}>
      <span>🕐</span>
      <span>{time}</span>
    </div>
  );
};

// Enhanced View Button
export const ViewButton = ({ onClick, game }) => {
  return (
    <button
      onClick={onClick}
      className="view-button-enhanced"
    >
      <span>View</span>
      <ArrowRight size={14} />
    </button>
  );
};

// Team Score Component (for flip numbers)
const TeamScore = ({ team, score, align }) => (
  <div style={{ textAlign: align }}>
    <div style={{
      fontSize: '0.75rem',
      fontWeight: '600',
      color: 'var(--color-text-secondary)',
      marginBottom: '0.375rem',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    }}>
      {team}
    </div>
    <div style={{
      fontSize: '2.5rem',
      fontWeight: '800',
      color: 'var(--color-accent)',
      fontFeatureSettings: "'tnum'",
      lineHeight: '1',
      textShadow: '0 2px 16px rgba(212, 175, 55, 0.4)',
      letterSpacing: '-0.03em'
    }}>
      {score.toFixed(1)}
    </div>
  </div>
);

// Flip Numbers Component (Scoreboard Effect)
export const FlipNumbers = ({ awayTeam, awayScore, homeTeam, homeScore }) => {
  return (
    <div style={{ 
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      gap: '1rem',
      alignItems: 'center',
      marginBottom: '1rem'
    }}>
      <TeamScore team={awayTeam} score={awayScore} align="right" />
      
      <div style={{
        fontSize: '1.5rem',
        fontWeight: '300',
        color: 'var(--color-text-muted)'
      }}>
        vs
      </div>
      
      <TeamScore team={homeTeam} score={homeScore} align="left" />
    </div>
  );
};

// Game Countdown Component
export const GameCountdown = ({ firstGameTime }) => {
  const [timeLeft, setTimeLeft] = useState('');
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      // Parse time like "07:00 PM" into a Date object for today
      const [time, period] = firstGameTime.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      let hour24 = hours;
      if (period === 'PM' && hours !== 12) hour24 += 12;
      if (period === 'AM' && hours === 12) hour24 = 0;
      
      const gameTime = new Date();
      gameTime.setHours(hour24, minutes, 0, 0);
      
      const now = new Date();
      const diff = gameTime - now;
      
      if (diff <= 0) {
        return 'Game Starting Soon!';
      }
      
      const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
      const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      return `First game in ${hoursLeft}h ${minutesLeft}m`;
    };
    
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, [firstGameTime]);
  
  return (
    <div style={{
      marginTop: '1rem',
      padding: '0.75rem 1rem',
      background: 'rgba(59, 130, 246, 0.08)',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      borderRadius: '8px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem'
    }}>
      <span style={{ fontSize: '1.25rem' }}>⏱️</span>
      <span style={{
        fontSize: '0.875rem',
        fontWeight: '600',
        color: 'var(--color-info)',
        fontFeatureSettings: "'tnum'"
      }}>
        {timeLeft}
      </span>
    </div>
  );
};










