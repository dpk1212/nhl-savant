/**
 * Custom Tooltip Component
 * Displays helpful explanations on hover
 */

import { useState } from 'react';
import { HelpCircle } from 'lucide-react';

export default function Tooltip({ text, children, icon = true }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <span
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        style={{
          cursor: 'help',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem'
        }}
      >
        {children}
        {icon && <HelpCircle size={14} style={{ opacity: 0.5 }} />}
      </span>

      {isVisible && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '0.5rem',
          padding: '0.75rem',
          background: 'rgba(15, 23, 42, 0.98)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          borderRadius: '8px',
          color: '#F1F5F9',
          fontSize: '0.75rem',
          lineHeight: '1.4',
          minWidth: '200px',
          maxWidth: '300px',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
          pointerEvents: 'none',
          animation: 'fadeIn 0.2s ease'
        }}>
          {text}
          {/* Arrow */}
          <div style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '6px solid rgba(15, 23, 42, 0.98)'
          }} />
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-4px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}

