import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const CollapsibleSection = ({ title, children, defaultOpen = false, icon = null, badge = null }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div style={{
      border: '1px solid var(--color-border)',
      borderRadius: '8px',
      overflow: 'hidden',
      marginBottom: '1rem',
      transition: 'all 0.3s ease'
    }}>
      {/* Header - Always visible, clickable */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="interactive hover-glow"
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 1.25rem',
          background: isOpen ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(212, 175, 55, 0.03) 100%)' : 'var(--color-card)',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          borderBottom: isOpen ? '1px solid var(--color-border)' : 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {icon && <span style={{ color: 'var(--color-accent)' }}>{icon}</span>}
          <span style={{
            fontSize: '0.938rem',
            fontWeight: '700',
            color: 'var(--color-text-primary)',
            textAlign: 'left'
          }}>
            {title}
          </span>
          {badge && badge}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {isOpen ? 'Collapse' : 'Expand'}
          </span>
          {isOpen ? (
            <ChevronUp size={18} color="var(--color-accent)" />
          ) : (
            <ChevronDown size={18} color="var(--color-accent)" />
          )}
        </div>
      </button>
      
      {/* Content - Collapsible */}
      <div
        style={{
          maxHeight: isOpen ? '2000px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'translateY(0)' : 'translateY(-10px)',
          transitionProperty: 'max-height, opacity, transform',
          transitionDuration: '0.5s, 0.3s, 0.3s',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <div style={{ padding: '1.25rem' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default CollapsibleSection;

