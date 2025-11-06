/**
 * StepSection Component
 * Reusable wrapper for numbered content sections with color-coded accents
 * Creates clear visual hierarchy and reading flow
 */

const StepSection = ({ 
  stepNumber, 
  title, 
  emoji,
  accentColor = '#D4AF37',
  children, 
  isMobile = false,
  className = ''
}) => {
  return (
    <div 
      className={className}
      style={{
        position: 'relative',
        marginBottom: isMobile ? '0.75rem' : '0.75rem',
        borderLeft: `4px solid ${accentColor}`,
        background: `linear-gradient(135deg, ${accentColor}08 0%, ${accentColor}03 100%)`,
        borderRadius: '0 12px 12px 0',
        overflow: 'hidden',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Step Header */}
      <div style={{
        padding: isMobile ? '0.75rem 1rem' : '0.875rem 1.25rem',
        borderBottom: `1px solid ${accentColor}30`,
        background: `${accentColor}10`,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        {/* Step Number Badge */}
        <div style={{
          minWidth: isMobile ? '28px' : '32px',
          height: isMobile ? '28px' : '32px',
          borderRadius: '8px',
          background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}CC 100%)`,
          color: 'rgba(0, 0, 0, 0.85)',
          fontWeight: '900',
          fontSize: isMobile ? '0.875rem' : '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 2px 8px ${accentColor}40`,
          letterSpacing: '-0.02em'
        }}>
          {stepNumber}
        </div>
        
        {/* Title */}
        <div style={{
          flex: 1,
          fontSize: isMobile ? '0.75rem' : '0.813rem',
          fontWeight: '800',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: accentColor,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          {emoji && <span style={{ fontSize: isMobile ? '1rem' : '1.125rem' }}>{emoji}</span>}
          <span>{title}</span>
        </div>
      </div>
      
      {/* Content */}
      <div style={{
        padding: isMobile ? '0.875rem' : '0.875rem'
      }}>
        {children}
      </div>
    </div>
  );
};

export default StepSection;



