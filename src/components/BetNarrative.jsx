import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { generateBetNarrative } from '../utils/narrativeGenerator';

/**
 * BetNarrative Component - Displays narrative explanations for betting picks
 * @param {Object} game - Game data
 * @param {Object} edge - Edge/bet data
 * @param {Object} dataProcessor - Data processor instance
 * @param {string} variant - 'compact' (for tables) or 'full' (for cards)
 * @param {boolean} expandable - Whether narrative can be expanded/collapsed
 */
const BetNarrative = ({ game, edge, dataProcessor, variant = 'full', expandable = false }) => {
  const [isExpanded, setIsExpanded] = useState(!expandable);

  const narrative = generateBetNarrative(game, edge, dataProcessor);

  if (!narrative) return null;

  // Compact variant for table rows
  if (variant === 'compact') {
    return (
      <div style={{ 
        fontSize: '0.813rem', 
        color: 'var(--color-text-secondary)',
        lineHeight: '1.5',
        padding: '0.5rem 0'
      }}>
        <span style={{ marginRight: '0.5rem' }}>{narrative.icon}</span>
        <span>{narrative.headline}</span>
      </div>
    );
  }

  // Full variant for game cards
  return (
    <div style={{
      backgroundColor: 'rgba(212, 175, 55, 0.08)',
      border: '1px solid rgba(212, 175, 55, 0.2)',
      borderRadius: '6px',
      padding: '1rem',
      marginBottom: '1rem'
    }}>
      {expandable ? (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            textAlign: 'left'
          }}
        >
          <div style={{ 
            fontSize: '1rem',
            fontWeight: '600',
            color: 'var(--color-text-primary)',
            lineHeight: '1.5',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem'
          }}>
            <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{narrative.icon}</span>
            <span>{narrative.headline}</span>
          </div>
          {isExpanded ? 
            <ChevronUp size={20} color="var(--color-accent)" style={{ flexShrink: 0, marginLeft: '0.5rem' }} /> : 
            <ChevronDown size={20} color="var(--color-accent)" style={{ flexShrink: 0, marginLeft: '0.5rem' }} />
          }
        </button>
      ) : (
        <div style={{ 
          fontSize: '1rem',
          fontWeight: '600',
          color: 'var(--color-text-primary)',
          lineHeight: '1.5',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.5rem',
          marginBottom: '0.75rem'
        }}>
          <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{narrative.icon}</span>
          <span>{narrative.headline}</span>
        </div>
      )}

      {isExpanded && narrative.bullets.length > 0 && (
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: expandable ? '0.75rem 0 0 0' : '0.5rem 0 0 0',
          fontSize: '0.875rem',
          lineHeight: '1.8',
          color: 'var(--color-text-secondary)'
        }}>
          {narrative.bullets.map((bullet, index) => (
            <li key={index} style={{ 
              paddingLeft: '1.5rem',
              position: 'relative',
              marginBottom: '0.25rem'
            }}>
              <span style={{
                position: 'absolute',
                left: '0',
                color: 'var(--color-accent)',
                fontWeight: '700'
              }}>•</span>
              {bullet}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BetNarrative;

