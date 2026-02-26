/**
 * 📈 CLV Badge Component
 * 
 * Professional NHL Savant branded badge to display Closing Line Value
 * Shows how much the line moved in the bettor's favor (or against them)
 */

import React from 'react';

/**
 * Get CLV tier styling based on value
 */
const getCLVTierStyle = (clv) => {
  if (clv >= 5) {
    return {
      tier: 'ELITE',
      emoji: '🔥',
      label: 'Elite CLV',
      color: '#10B981',
      bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.08) 100%)',
      borderColor: 'rgba(16, 185, 129, 0.4)',
      glowColor: 'rgba(16, 185, 129, 0.3)'
    };
  }
  if (clv >= 3) {
    return {
      tier: 'GREAT',
      emoji: '💪',
      label: 'Great CLV',
      color: '#14B8A6',
      bgGradient: 'linear-gradient(135deg, rgba(20, 184, 166, 0.12) 0%, rgba(13, 148, 136, 0.06) 100%)',
      borderColor: 'rgba(20, 184, 166, 0.35)',
      glowColor: 'rgba(20, 184, 166, 0.25)'
    };
  }
  if (clv >= 1) {
    return {
      tier: 'GOOD',
      emoji: '✅',
      label: 'Good CLV',
      color: '#3B82F6',
      bgGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.10) 0%, rgba(37, 99, 235, 0.05) 100%)',
      borderColor: 'rgba(59, 130, 246, 0.30)',
      glowColor: 'rgba(59, 130, 246, 0.2)'
    };
  }
  if (clv >= 0) {
    return {
      tier: 'NEUTRAL',
      emoji: '➖',
      label: 'Neutral',
      color: '#94A3B8',
      bgGradient: 'linear-gradient(135deg, rgba(148, 163, 184, 0.08) 0%, rgba(100, 116, 139, 0.04) 100%)',
      borderColor: 'rgba(148, 163, 184, 0.25)',
      glowColor: 'rgba(148, 163, 184, 0.15)'
    };
  }
  if (clv >= -2) {
    return {
      tier: 'SLIGHT_FADE',
      emoji: '📉',
      label: 'Slight Fade',
      color: '#F59E0B',
      bgGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.10) 0%, rgba(217, 119, 6, 0.05) 100%)',
      borderColor: 'rgba(245, 158, 11, 0.30)',
      glowColor: 'rgba(245, 158, 11, 0.2)'
    };
  }
  return {
    tier: 'FADE',
    emoji: '🔴',
    label: 'Faded',
    color: '#EF4444',
    bgGradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.10) 0%, rgba(220, 38, 38, 0.05) 100%)',
    borderColor: 'rgba(239, 68, 68, 0.30)',
    glowColor: 'rgba(239, 68, 68, 0.2)'
  };
};

/**
 * Format CLV for display
 */
const formatCLV = (clv, market) => {
  const sign = clv >= 0 ? '+' : '';
  const suffix = market === 'SPREAD' ? ' pts' : '%';
  return `${sign}${clv.toFixed(1)}${suffix}`;
};

/**
 * CLV Badge Component
 * 
 * @param {Object} props
 * @param {Object} props.clvData - CLV data from Firebase { value, originalOdds, currentOdds, movement, tier }
 * @param {boolean} props.compact - Use compact display mode
 * @param {boolean} props.showDetails - Show original/current odds
 */
export const CLVBadge = ({ clvData, compact = false, showDetails = false }) => {
  if (!clvData || clvData.value === undefined) {
    return null;
  }
  
  const market = clvData.market || 'MONEYLINE';
  const style = getCLVTierStyle(clvData.value);
  const formattedCLV = formatCLV(clvData.value, market);
  
  // Compact badge for inline display
  if (compact) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem',
          padding: '0.125rem 0.375rem',
          background: style.bgGradient,
          border: `1px solid ${style.borderColor}`,
          borderRadius: '4px',
          fontSize: '0.75rem',
          fontWeight: '600',
          color: style.color,
          fontFeatureSettings: "'tnum'"
        }}
        title={`CLV: ${formattedCLV} - ${style.label}`}
      >
        <span>{style.emoji}</span>
        <span>{formattedCLV}</span>
      </span>
    );
  }
  
  // Full badge with details
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.375rem',
        padding: '0.625rem 0.75rem',
        background: style.bgGradient,
        border: `1.5px solid ${style.borderColor}`,
        borderRadius: '10px',
        boxShadow: `0 4px 12px ${style.glowColor}`,
        backdropFilter: 'blur(8px)'
      }}
    >
      {/* Header row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.5rem'
      }}>
        {/* Label */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          fontSize: '0.65rem',
          fontWeight: '700',
          color: 'rgba(148, 163, 184, 0.9)',
          letterSpacing: '0.05em',
          textTransform: 'uppercase'
        }}>
          📈 CLOSING LINE VALUE
        </div>
        
        {/* Movement indicator */}
        {clvData.movement && (
          <div style={{
            fontSize: '0.625rem',
            fontWeight: '600',
            color: clvData.movement === 'STEAM' ? '#10B981' : 
                   clvData.movement === 'FADE' ? '#EF4444' : '#94A3B8',
            letterSpacing: '0.03em'
          }}>
            {clvData.movement === 'STEAM' && '✅ STEAM'}
            {clvData.movement === 'FADE' && '🔴 FADE'}
            {clvData.movement === 'UNCHANGED' && '➖ HOLD'}
          </div>
        )}
      </div>
      
      {/* CLV Value */}
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: '0.375rem'
      }}>
        <span style={{ fontSize: '0.875rem' }}>{style.emoji}</span>
        <span style={{
          fontSize: '1.5rem',
          fontWeight: '900',
          color: style.color,
          letterSpacing: '-0.02em',
          fontFeatureSettings: "'tnum'",
          textShadow: `0 2px 8px ${style.glowColor}`
        }}>
          {formattedCLV}
        </span>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: '600',
          color: 'rgba(148, 163, 184, 0.8)',
          marginLeft: '0.25rem'
        }}>
          {style.label}
        </span>
      </div>
      
      {/* Line comparison (optional) */}
      {showDetails && (() => {
        const isSpread = market === 'SPREAD';
        const origVal = isSpread ? clvData.originalSpread : clvData.originalOdds;
        const currVal = isSpread ? clvData.currentSpread : clvData.currentOdds;
        if (origVal == null || currVal == null) return null;
        const fmtVal = (v) => (v > 0 ? '+' : '') + v;
        return (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '0.25rem',
            paddingTop: '0.375rem',
            borderTop: '1px solid rgba(148, 163, 184, 0.15)'
          }}>
            <div style={{ fontSize: '0.7rem', color: 'rgba(148, 163, 184, 0.7)' }}>
              <span style={{ color: 'rgba(148, 163, 184, 0.5)' }}>Opened: </span>
              <span style={{ fontWeight: '600', fontFeatureSettings: "'tnum'" }}>
                {fmtVal(origVal)}
              </span>
            </div>
            <span style={{ color: 'rgba(148, 163, 184, 0.3)' }}>→</span>
            <div style={{ fontSize: '0.7rem', color: 'rgba(148, 163, 184, 0.7)' }}>
              <span style={{ color: 'rgba(148, 163, 184, 0.5)' }}>Current: </span>
              <span style={{ 
                fontWeight: '600', 
                fontFeatureSettings: "'tnum'",
                color: clvData.value > 0 ? style.color : 'rgba(148, 163, 184, 0.8)'
              }}>
                {fmtVal(currVal)}
              </span>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

/**
 * Inline CLV indicator for bet cards
 */
export const CLVIndicator = ({ clvData }) => {
  if (!clvData || clvData.value === undefined) {
    return null;
  }
  
  const market = clvData.market || 'MONEYLINE';
  const style = getCLVTierStyle(clvData.value);
  const formattedCLV = formatCLV(clvData.value, market);
  
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.375rem',
        padding: '0.25rem 0.5rem',
        background: style.bgGradient,
        border: `1px solid ${style.borderColor}`,
        borderRadius: '6px'
      }}
      title={`CLV: ${formattedCLV}`}
    >
      <span style={{ fontSize: '0.75rem' }}>{style.emoji}</span>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: '0'
      }}>
        <span style={{
          fontSize: '0.6rem',
          fontWeight: '600',
          color: 'rgba(148, 163, 184, 0.6)',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          lineHeight: 1
        }}>
          CLV
        </span>
        <span style={{
          fontSize: '0.875rem',
          fontWeight: '700',
          color: style.color,
          fontFeatureSettings: "'tnum'",
          lineHeight: 1.1
        }}>
          {formattedCLV}
        </span>
      </div>
    </div>
  );
};

export default CLVBadge;
