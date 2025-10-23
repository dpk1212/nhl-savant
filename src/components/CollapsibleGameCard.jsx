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
const CollapsibleGameCard = ({ header, children, defaultExpanded = false, index = 0, isMobile = false }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div 
      className="elevated-card game-card hover-lift"
      style={{
        animationDelay: `${index * 0.1}s`,
        position: 'relative',
        overflow: 'hidden',
        // Premium collapsed state styling
        background: isExpanded 
          ? 'var(--color-bg-secondary)' 
          : 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
        border: isExpanded 
          ? '1px solid var(--color-border)' 
          : '1px solid rgba(16, 185, 129, 0.2)',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Clickable Header */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
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
        <div style={{ position: 'relative', paddingRight: isMobile ? '48px' : '56px' }}>
          {/* Clone header and inject isCollapsed prop */}
          {React.cloneElement(header, { isCollapsed: !isExpanded })}
          
          {/* Chevron Icon - Fixed positioning to avoid overlap */}
          <div style={{
            position: 'absolute',
            top: '50%',
            right: isMobile ? '0.75rem' : '1rem',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: isMobile ? '32px' : '40px',
            height: isMobile ? '32px' : '40px',
            borderRadius: '10px',
            background: isExpanded 
              ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.15) 100%)' 
              : 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)',
            border: `2px solid ${isExpanded ? 'rgba(16, 185, 129, 0.4)' : 'rgba(59, 130, 246, 0.3)'}`,
            boxShadow: isExpanded 
              ? '0 2px 8px rgba(16, 185, 129, 0.2)' 
              : '0 2px 8px rgba(59, 130, 246, 0.2)',
            transition: 'all 0.3s ease',
            pointerEvents: 'none',
            zIndex: 10
          }}>
            {isExpanded ? (
              <ChevronUp size={isMobile ? 18 : 22} color="#10B981" strokeWidth={2.5} />
            ) : (
              <ChevronDown size={isMobile ? 18 : 22} color="#3B82F6" strokeWidth={2.5} />
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

