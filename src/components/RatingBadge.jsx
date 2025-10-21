import React from 'react';
import { Award, Star, TrendingUp } from 'lucide-react';

// Get rating for EV percentage
export const getRating = (evPercent) => {
  if (evPercent >= 10) return { 
    grade: 'A+', 
    tier: 'ELITE', 
    color: '#10B981', 
    bgColor: 'rgba(16, 185, 129, 0.15)', 
    borderColor: '#10B981',
    icon: Award
  };
  if (evPercent >= 7) return { 
    grade: 'A', 
    tier: 'EXCELLENT', 
    color: '#059669', 
    bgColor: 'rgba(5, 150, 105, 0.15)', 
    borderColor: '#059669',
    icon: Star
  };
  if (evPercent >= 5) return { 
    grade: 'B+', 
    tier: 'STRONG', 
    color: '#0EA5E9', 
    bgColor: 'rgba(14, 165, 233, 0.15)', 
    borderColor: '#0EA5E9',
    icon: TrendingUp
  };
  if (evPercent >= 3) return { 
    grade: 'B', 
    tier: 'GOOD', 
    color: '#8B5CF6', 
    bgColor: 'rgba(139, 92, 246, 0.15)', 
    borderColor: '#8B5CF6',
    icon: null
  };
  return { 
    grade: 'C', 
    tier: 'VALUE', 
    color: '#64748B', 
    bgColor: 'rgba(100, 116, 139, 0.15)', 
    borderColor: '#64748B',
    icon: null
  };
};

export const RatingBadge = ({ evPercent, size = 'default', showIcon = false, showTier = true }) => {
  const rating = getRating(evPercent);
  const Icon = rating.icon;
  
  const sizeConfig = {
    small: {
      padding: '0.25rem 0.5rem',
      gradeFont: '0.75rem',
      tierFont: '0.563rem',
      iconSize: 12,
      gap: '0.25rem'
    },
    default: {
      padding: '0.375rem 0.75rem',
      gradeFont: '0.875rem',
      tierFont: '0.625rem',
      iconSize: 14,
      gap: '0.25rem'
    },
    large: {
      padding: '0.5rem 1rem',
      gradeFont: '1.125rem',
      tierFont: '0.688rem',
      iconSize: 16,
      gap: '0.375rem'
    }
  };
  
  const config = sizeConfig[size];
  
  return (
    <div style={{
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: config.gap
    }}>
      <div style={{
        padding: config.padding,
        background: rating.bgColor,
        border: `1px solid ${rating.borderColor}`,
        borderRadius: '6px',
        fontWeight: '800',
        fontSize: config.gradeFont,
        color: rating.color,
        letterSpacing: '-0.01em',
        display: 'flex',
        alignItems: 'center',
        gap: '0.375rem',
        minWidth: size === 'small' ? '36px' : '42px',
        justifyContent: 'center'
      }}>
        {showIcon && Icon && <Icon size={config.iconSize} />}
        <span>{rating.grade}</span>
      </div>
      {showTier && (
        <div style={{
          fontSize: config.tierFont,
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: rating.color,
          opacity: 0.8
        }}>
          {rating.tier}
        </div>
      )}
    </div>
  );
};

export default RatingBadge;

