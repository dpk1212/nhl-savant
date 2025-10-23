import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

/**
 * CollapsibleGameCard - Wrapper for game cards with expand/collapse functionality
 * 
 * Usage:
 * <CollapsibleGameCard header={<YourHeader />}>
 *   <YourContent />
 * </CollapsibleGameCard>
 */
const CollapsibleGameCard = ({ header, children, defaultExpanded = true, index = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div 
      className="elevated-card game-card hover-lift"
      style={{
        animationDelay: `${index * 0.1}s`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Clickable Header */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          cursor: 'pointer',
          position: 'relative'
        }}
      >
        {/* Pass isExpanded state to header via cloneElement if needed */}
        <div style={{ position: 'relative' }}>
          {header}
          
          {/* Chevron Icon Overlay */}
          <div style={{
            position: 'absolute',
            top: '50%',
            right: '1rem',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: isExpanded ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${isExpanded ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
            transition: 'all 0.2s ease',
            pointerEvents: 'none',
            zIndex: 10
          }}>
            {isExpanded ? (
              <ChevronUp size={20} color="#10B981" />
            ) : (
              <ChevronDown size={20} color="var(--color-text-muted)" />
            )}
          </div>
        </div>
      </div>

      {/* Collapsible Content */}
      <div style={{
        maxHeight: isExpanded ? '10000px' : '0',
        opacity: isExpanded ? 1 : 0,
        overflow: 'hidden',
        transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease'
      }}>
        {children}
      </div>
    </div>
  );
};

export default CollapsibleGameCard;

