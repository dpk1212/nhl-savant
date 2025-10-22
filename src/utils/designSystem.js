/**
 * Design System Constants
 * Unified design tokens for consistent UI/UX
 */

// 3-Tier Elevation System
export const ELEVATION = {
  flat: {
    border: '1px solid rgba(100, 116, 139, 0.2)',
    shadow: 'none'
  },
  raised: {
    border: '1px solid rgba(212, 175, 55, 0.25)',
    shadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  },
  elevated: {
    border: '2px solid rgba(16, 185, 129, 0.3)',
    shadow: '0 4px 16px rgba(16, 185, 129, 0.15)'
  }
};

// Typography Scale
export const TYPOGRAPHY = {
  hero: {
    size: '1.5rem',      // Hero numbers (EV%, Edge)
    weight: '900',
    lineHeight: '1.2'
  },
  heading: {
    size: '1.125rem',    // Section titles (BEST VALUE, KEY ADVANTAGES)
    weight: '800',
    lineHeight: '1.3',
    letterSpacing: '-0.01em'
  },
  subheading: {
    size: '0.938rem',    // Subsection titles
    weight: '700',
    lineHeight: '1.4'
  },
  body: {
    size: '0.875rem',    // Team names, stats
    weight: '600',
    lineHeight: '1.5'
  },
  label: {
    size: '0.75rem',     // Labels (Model, Market, Our Edge)
    weight: '600',
    lineHeight: '1.4',
    letterSpacing: '0.03em',
    textTransform: 'uppercase'
  },
  caption: {
    size: '0.688rem',    // Explanations, ranks
    weight: '500',
    lineHeight: '1.5'
  }
};

// Mobile Spacing Constants
export const MOBILE_SPACING = {
  cardPadding: '0.875rem',
  sectionGap: '0.75rem',
  innerPadding: '0.75rem',
  borderRadius: '10px'
};

// Gradient Presets
export const GRADIENTS = {
  hero: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.04) 50%, rgba(16, 185, 129, 0.08) 100%)',
  factors: 'linear-gradient(180deg, rgba(212, 175, 55, 0.05) 0%, rgba(212, 175, 55, 0.02) 100%)',
  moneyline: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.02) 100%)',
  total: 'linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(168, 85, 247, 0.02) 100%)',
  accent: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-hover) 100%)'
};

// 5-Tier EV Color Scale
export const getEVColorScale = (evPercent) => {
  if (evPercent >= 10) return { 
    color: '#10B981', 
    bg: 'rgba(16, 185, 129, 0.15)',
    label: 'ELITE',
    intensity: 5
  };
  if (evPercent >= 5) return { 
    color: '#059669', 
    bg: 'rgba(5, 150, 105, 0.12)',
    label: 'STRONG',
    intensity: 4
  };
  if (evPercent >= 2) return { 
    color: '#0EA5E9', 
    bg: 'rgba(14, 165, 233, 0.12)',
    label: 'GOOD',
    intensity: 3
  };
  if (evPercent >= 0) return { 
    color: '#8B5CF6', 
    bg: 'rgba(139, 92, 246, 0.12)',
    label: 'SLIGHT',
    intensity: 2
  };
  return { 
    color: '#64748B', 
    bg: 'rgba(100, 116, 139, 0.08)',
    label: 'NEGATIVE',
    intensity: 1
  };
};

// Nuanced Comparison Bar Colors
export const getBarColor = (value, opponentValue, leagueAvg) => {
  const advantage = value - opponentValue;
  const vsLeague = value - leagueAvg;
  
  // Dominant advantage (>15% better than opponent AND >10% vs league)
  if (advantage > opponentValue * 0.15 && vsLeague > leagueAvg * 0.10) {
    return '#10B981'; // Bright green
  }
  // Clear advantage (>10% better than opponent)
  if (advantage > opponentValue * 0.10) {
    return '#059669'; // Medium green
  }
  // Slight advantage (>5% better)
  if (advantage > opponentValue * 0.05) {
    return '#0EA5E9'; // Blue
  }
  // Neutral/slight disadvantage
  if (Math.abs(advantage) <= opponentValue * 0.05) {
    return '#8B5CF6'; // Purple
  }
  // Disadvantage
  return '#64748B'; // Gray
};

// Confidence Level Calculator
export const getConfidenceLevel = (ev, prob) => {
  const spread = Math.abs(prob - 0.5);
  if (ev > 10 && spread > 0.15) return { level: 'VERY HIGH', color: '#10B981' };
  if (ev > 5 && spread > 0.10) return { level: 'HIGH', color: '#059669' };
  if (ev > 2) return { level: 'MEDIUM', color: '#0EA5E9' };
  return { level: 'LOW', color: '#8B5CF6' };
};

// Animation Delays
export const getStaggerDelay = (index, offset = 0) => `${index * 0.1 + offset}s`;

// Transition Presets
export const TRANSITIONS = {
  fast: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
  normal: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  slow: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
};

