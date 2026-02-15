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
  cardPadding: '1.25rem',
  sectionGap: '1rem',
  innerPadding: '1rem',
  borderRadius: '12px'
};

// Gradient Presets
export const GRADIENTS = {
  hero: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.04) 50%, rgba(16, 185, 129, 0.08) 100%)',
  factors: 'linear-gradient(180deg, rgba(212, 175, 55, 0.05) 0%, rgba(212, 175, 55, 0.02) 100%)',
  moneyline: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.02) 100%)',
  total: 'linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(168, 85, 247, 0.02) 100%)',
  accent: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-hover) 100%)'
};

// Grade Color Scale (ENSEMBLE QUALITY GRADING)
// Maps letter grades (from ensemble agreement system) to colors
export const getGradeColorScale = (grade) => {
  switch (grade) {
    case 'A+':
      return {
        color: '#10B981',
        bg: 'rgba(16, 185, 129, 0.15)',
        bgColor: 'rgba(16, 185, 129, 0.15)',
        borderColor: '#10B981',
        label: 'ELITE',
        tier: 'ELITE',
        intensity: 5
      };
    case 'A':
      return {
        color: '#059669',
        bg: 'rgba(5, 150, 105, 0.12)',
        bgColor: 'rgba(5, 150, 105, 0.15)',
        borderColor: '#059669',
        label: 'EXCELLENT',
        tier: 'EXCELLENT',
        intensity: 4
      };
    case 'B+':
      return {
        color: '#0EA5E9',
        bg: 'rgba(14, 165, 233, 0.12)',
        bgColor: 'rgba(14, 165, 233, 0.15)',
        borderColor: '#0EA5E9',
        label: 'STRONG',
        tier: 'STRONG',
        intensity: 3
      };
    case 'B':
      return {
        color: '#8B5CF6',
        bg: 'rgba(139, 92, 246, 0.12)',
        bgColor: 'rgba(139, 92, 246, 0.15)',
        borderColor: '#8B5CF6',
        label: 'GOOD',
        tier: 'GOOD',
        intensity: 2
      };
    case 'C':
      return {
        color: '#F59E0B',
        bg: 'rgba(245, 158, 11, 0.12)',
        bgColor: 'rgba(245, 158, 11, 0.15)',
        borderColor: '#F59E0B',
        label: 'VALUE',
        tier: 'VALUE',
        intensity: 1
      };
    case 'D':
      return {
        color: '#EF4444',
        bg: 'rgba(239, 68, 68, 0.12)',
        bgColor: 'rgba(239, 68, 68, 0.15)',
        borderColor: '#EF4444',
        label: 'RISKY',
        tier: 'RISKY',
        intensity: 0
      };
    default:
      return {
        color: '#64748B',
        bg: 'rgba(100, 116, 139, 0.08)',
        bgColor: 'rgba(100, 116, 139, 0.15)',
        borderColor: '#64748B',
        label: 'N/A',
        tier: 'N/A',
        intensity: 0
      };
  }
};

// Star Rating System V5 — Composite MOS×EV scoring → 1-5 stars
// Accepts either star count (from Firebase prediction.stars) or unit size (backward compat)
// Stars stored in Firebase: 5★=3u, 4★=2.5u, 3★=2u, 2★=1.5u, 1★=1u
export const getStarRating = (unitSizeOrStars, storedStars) => {
  // If storedStars is provided directly (from Firebase prediction.stars), use it
  // Otherwise derive from unitSize for backward compatibility
  let starCount;
  if (storedStars != null) {
    starCount = storedStars;
  } else {
    // Backward compat: map unitSize → stars
    const u = unitSizeOrStars || 1;
    if (u >= 3) starCount = 5;
    else if (u >= 2.5) starCount = 4;
    else if (u >= 2) starCount = 3;
    else if (u >= 1.5) starCount = 2;
    else starCount = 1;
  }
  
  const fullStars = Math.min(5, Math.max(1, starCount));
  const hasHalf = false; // V5: clean integer stars only

  if (fullStars >= 5) {
    return {
      stars: 5, fullStars: 5, hasHalf,
      color: '#10B981',
      bg: 'rgba(16, 185, 129, 0.15)',
      bgColor: 'rgba(16, 185, 129, 0.15)',
      borderColor: '#10B981',
      label: 'ELITE',
      tier: 'ELITE',
      intensity: 5
    };
  }
  if (fullStars >= 4) {
    return {
      stars: 4, fullStars: 4, hasHalf,
      color: '#14B8A6',
      bg: 'rgba(20, 184, 166, 0.12)',
      bgColor: 'rgba(20, 184, 166, 0.15)',
      borderColor: '#14B8A6',
      label: 'STRONG',
      tier: 'STRONG',
      intensity: 4
    };
  }
  if (fullStars >= 3) {
    return {
      stars: 3, fullStars: 3, hasHalf,
      color: '#3B82F6',
      bg: 'rgba(59, 130, 246, 0.12)',
      bgColor: 'rgba(59, 130, 246, 0.15)',
      borderColor: '#3B82F6',
      label: 'SOLID',
      tier: 'SOLID',
      intensity: 3
    };
  }
  if (fullStars >= 2) {
    return {
      stars: 2, fullStars: 2, hasHalf,
      color: '#8B5CF6',
      bg: 'rgba(139, 92, 246, 0.12)',
      bgColor: 'rgba(139, 92, 246, 0.15)',
      borderColor: '#8B5CF6',
      label: 'STANDARD',
      tier: 'STANDARD',
      intensity: 2
    };
  }
  // 1 star — minimum qualifying pick
  return {
    stars: 1, fullStars: 1, hasHalf,
    color: '#94A3B8',
    bg: 'rgba(148, 163, 184, 0.10)',
    bgColor: 'rgba(148, 163, 184, 0.12)',
    borderColor: '#94A3B8',
    label: 'TRACKING',
    tier: 'TRACKING',
    intensity: 1
  };
};

// Renders star display as a string: "★★★☆☆" (for use in non-JSX contexts)
export const getStarString = (unitSize) => {
  const rating = getStarRating(unitSize);
  const filled = '★'.repeat(rating.fullStars);
  const half = rating.hasHalf ? '½' : '';
  const empty = '☆'.repeat(5 - rating.fullStars - (rating.hasHalf ? 1 : 0));
  return filled + half + empty;
};

// 5-Tier EV Color Scale (LEGACY - use getGradeColorScale for new code)
// Thresholds calibrated for MoneyPuck ensemble
export const getEVColorScale = (evPercent) => {
  if (evPercent >= 8) return { 
    color: '#10B981', 
    bg: 'rgba(16, 185, 129, 0.15)',
    label: 'ELITE',
    intensity: 5
  };
  if (evPercent >= 5) return { 
    color: '#059669', 
    bg: 'rgba(5, 150, 105, 0.12)',
    label: 'EXCELLENT',
    intensity: 4
  };
  if (evPercent >= 3) return { 
    color: '#0EA5E9', 
    bg: 'rgba(14, 165, 233, 0.12)',
    label: 'STRONG',
    intensity: 3
  };
  if (evPercent >= 2) return { 
    color: '#8B5CF6', 
    bg: 'rgba(139, 92, 246, 0.12)',
    label: 'GOOD',
    intensity: 2
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

