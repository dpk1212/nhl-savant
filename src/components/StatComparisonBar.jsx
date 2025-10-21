import { useState, useEffect } from 'react';

/**
 * StatComparisonBar - Visual comparison of team stats with color-coded bars
 * 
 * @param {string} label - Display label for the stat
 * @param {string} team1Name - First team abbreviation
 * @param {number} team1Value - First team stat value
 * @param {string} team2Name - Second team abbreviation
 * @param {number} team2Value - Second team stat value
 * @param {string} metric - Metric name (e.g., "xGF/60")
 * @param {boolean} higherIsBetter - True if higher value is better (offense), false if lower is better (defense)
 * @param {string} note1 - Optional note for team 1
 * @param {string} note2 - Optional note for team 2
 */
const StatComparisonBar = ({ 
  label, 
  team1Name, 
  team1Value, 
  team2Name, 
  team2Value, 
  metric,
  higherIsBetter = true,
  note1 = '',
  note2 = ''
}) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Determine which team has advantage
  const team1Better = higherIsBetter 
    ? team1Value > team2Value 
    : team1Value < team2Value;
  
  const team2Better = higherIsBetter
    ? team2Value > team1Value
    : team2Value < team1Value;

  // Calculate bar widths (scale to max value)
  const maxValue = Math.max(Math.abs(team1Value), Math.abs(team2Value));
  const team1Width = maxValue > 0 ? (Math.abs(team1Value) / maxValue) * 100 : 0;
  const team2Width = maxValue > 0 ? (Math.abs(team2Value) / maxValue) * 100 : 0;

  // Color logic - green for advantage, gray for disadvantage
  const getBarColor = (isBetter) => {
    if (isBetter) {
      return {
        bg: 'linear-gradient(90deg, #10B981 0%, #059669 100%)',
        glow: '0 0 8px rgba(16, 185, 129, 0.3)'
      };
    }
    return {
      bg: 'linear-gradient(90deg, #64748B 0%, #475569 100%)',
      glow: 'none'
    };
  };

  const team1Colors = getBarColor(team1Better);
  const team2Colors = getBarColor(team2Better);

  return (
    <div style={{
      margin: '1rem 0',
      padding: '0.75rem 0',
      borderBottom: '1px solid rgba(100, 116, 139, 0.1)'
    }}>
      {/* Label */}
      <div style={{
        fontSize: '0.75rem',
        fontWeight: '700',
        color: 'var(--color-text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        {label}
        <span style={{
          fontSize: '0.688rem',
          fontWeight: '500',
          color: 'var(--color-text-subtle)',
          textTransform: 'none',
          letterSpacing: '0'
        }}>
          ({metric})
        </span>
      </div>

      {/* Team 1 Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '0.5rem'
      }}>
        <div style={{
          minWidth: '45px',
          fontSize: '0.813rem',
          fontWeight: '600',
          color: team1Better ? 'var(--color-success)' : 'var(--color-text-secondary)',
          textAlign: 'left'
        }}>
          {team1Name}
        </div>
        
        <div style={{
          flex: 1,
          height: '20px',
          background: 'rgba(100, 116, 139, 0.2)',
          borderRadius: '4px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div style={{
            height: '100%',
            width: animated ? `${team1Width}%` : '0%',
            background: team1Colors.bg,
            borderRadius: '4px',
            transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: team1Colors.glow
          }} />
        </div>

        <div style={{
          minWidth: '55px',
          textAlign: 'right',
          fontSize: '0.813rem',
          fontWeight: '600',
          fontFeatureSettings: "'tnum'",
          color: 'var(--color-text-primary)'
        }}>
          {team1Value.toFixed(2)}
          {team1Better && (
            <span style={{ 
              marginLeft: '0.25rem', 
              color: 'var(--color-success)',
              fontSize: '0.75rem'
            }}>✓</span>
          )}
        </div>
      </div>

      {/* Note for team 1 */}
      {note1 && (
        <div style={{
          fontSize: '0.688rem',
          color: 'var(--color-text-muted)',
          marginLeft: '52px',
          marginBottom: '0.5rem',
          fontStyle: 'italic'
        }}>
          {note1}
        </div>
      )}

      {/* Team 2 Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <div style={{
          minWidth: '45px',
          fontSize: '0.813rem',
          fontWeight: '600',
          color: team2Better ? 'var(--color-success)' : 'var(--color-text-secondary)',
          textAlign: 'left'
        }}>
          {team2Name}
        </div>
        
        <div style={{
          flex: 1,
          height: '20px',
          background: 'rgba(100, 116, 139, 0.2)',
          borderRadius: '4px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div style={{
            height: '100%',
            width: animated ? `${team2Width}%` : '0%',
            background: team2Colors.bg,
            borderRadius: '4px',
            transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: team2Colors.glow
          }} />
        </div>

        <div style={{
          minWidth: '55px',
          textAlign: 'right',
          fontSize: '0.813rem',
          fontWeight: '600',
          fontFeatureSettings: "'tnum'",
          color: 'var(--color-text-primary)'
        }}>
          {team2Value.toFixed(2)}
          {team2Better && (
            <span style={{ 
              marginLeft: '0.25rem', 
              color: 'var(--color-success)',
              fontSize: '0.75rem'
            }}>✓</span>
          )}
        </div>
      </div>

      {/* Note for team 2 */}
      {note2 && (
        <div style={{
          fontSize: '0.688rem',
          color: 'var(--color-text-muted)',
          marginLeft: '52px',
          marginTop: '0.25rem',
          fontStyle: 'italic'
        }}>
          {note2}
        </div>
      )}
    </div>
  );
};

export default StatComparisonBar;

