import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

/**
 * CollapsibleGameCard - Wrapper for game cards with expand/collapse functionality
 * 
 * Usage:
 * <CollapsibleGameCard header={<YourHeader />}>
 *   <YourContent />
 * </CollapsibleGameCard>
 */
const CollapsibleGameCard = ({ header, children, defaultExpanded = false, index = 0, isMobile = false, onToggle, id, ...otherProps }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    const newState = !isExpanded;
    
    // If onToggle returns false, prevent expansion (for disclaimer, etc.)
    if (onToggle) {
      const shouldExpand = onToggle(newState);
      if (shouldExpand === false && newState === true) {
        return; // Don't expand if callback says no
      }
    }
    
    setIsExpanded(newState);
  };

  return (
    <div 
      id={id}
      {...otherProps}
      className="elevated-card game-card hover-lift"
      style={{
        animationDelay: `${index * 0.1}s`,
        position: 'relative',
        overflow: 'hidden',
        // Optimized collapsed state styling - less visual weight
        background: isExpanded 
          ? 'var(--color-bg-secondary)' 
          : 'linear-gradient(135deg, rgba(16, 185, 129, 0.03) 0%, rgba(59, 130, 246, 0.03) 100%)',
        border: isExpanded 
          ? '1px solid var(--color-border)' 
          : '1px solid rgba(16, 185, 129, 0.15)',
        borderRadius: '10px', // Tightened from default
        transition: 'all 0.3s ease',
        scrollMarginTop: '80px' // Offset for fixed headers
      }}
    >
      {/* Clickable Header */}
      <div 
        onClick={handleToggle}
        style={{
          cursor: 'pointer',
          position: 'relative',
          // Enhanced hover effect when collapsed
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          if (!isExpanded) {
            e.currentTarget.style.background = 'rgba(16, 185, 129, 0.08)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isExpanded) {
            e.currentTarget.style.background = 'transparent';
          }
        }}
      >
        {/* Pass isExpanded state to header via cloneElement if needed */}
        <div style={{ position: 'relative', paddingRight: isMobile ? '44px' : '50px' }}>
          {/* Clone header and inject isCollapsed prop */}
          {React.cloneElement(header, { isCollapsed: !isExpanded })}
          
          {/* Chevron Icon - Optimized, cleaner design */}
          <div style={{
            position: 'absolute',
            top: '50%',
            right: isMobile ? '0.625rem' : '0.875rem',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: isMobile ? '30px' : '36px',
            height: isMobile ? '30px' : '36px',
            borderRadius: '8px',
            background: isExpanded 
              ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.18) 0%, rgba(16, 185, 129, 0.12) 100%)' 
              : 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(16, 185, 129, 0.12) 100%)',
            border: `1.5px solid ${isExpanded ? 'rgba(16, 185, 129, 0.35)' : 'rgba(59, 130, 246, 0.25)'}`,
            boxShadow: isExpanded 
              ? '0 2px 6px rgba(16, 185, 129, 0.18)' 
              : '0 2px 6px rgba(59, 130, 246, 0.18)',
            transition: 'all 0.3s ease',
            pointerEvents: 'none',
            zIndex: 10
          }}>
            {isExpanded ? (
              <ChevronUp size={isMobile ? 16 : 20} color="#10B981" strokeWidth={2.5} />
            ) : (
              <ChevronDown size={isMobile ? 16 : 20} color="#3B82F6" strokeWidth={2.5} />
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

