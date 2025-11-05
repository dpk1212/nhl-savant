import { useState } from 'react';
import { Bookmark } from 'lucide-react';

/**
 * Premium bookmark button component
 * @param {Object} props
 * @param {boolean} props.isBookmarked - Whether the item is currently bookmarked
 * @param {Function} props.onClick - Click handler
 * @param {string} props.size - Size variant: 'small' (20px), 'medium' (24px), 'large' (28px)
 * @param {boolean} props.disabled - Disabled state
 */
const BookmarkButton = ({ 
  isBookmarked = false, 
  onClick, 
  size = 'medium',
  disabled = false 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const sizeMap = {
    small: 22,
    medium: 28,
    large: 32
  };
  
  const paddingMap = {
    small: '0.5rem',
    medium: '0.625rem',
    large: '0.75rem'
  };
  
  const iconSize = sizeMap[size] || 28;
  const padding = paddingMap[size] || '0.625rem';
  
  const handleClick = (e) => {
    e.stopPropagation(); // Prevent event bubbling to parent cards
    
    if (disabled) return;
    
    // Trigger animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    
    onClick?.();
  };
  
  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled}
      aria-label={isBookmarked ? "Remove from My Picks" : "Save to My Picks"}
      title={isBookmarked ? "Remove from My Picks" : "Save to My Picks"}
      style={{
        background: isBookmarked 
          ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.25) 0%, rgba(212, 175, 55, 0.15) 100%)'
          : isHovered 
          ? 'rgba(212, 175, 55, 0.12)'
          : 'rgba(212, 175, 55, 0.08)',
        border: isBookmarked 
          ? '2px solid rgba(212, 175, 55, 0.5)' 
          : '2px solid rgba(212, 175, 55, 0.3)',
        borderRadius: '10px',
        padding: padding,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isAnimating 
          ? 'scale(1.15) rotate(12deg)' 
          : isHovered 
          ? 'scale(1.08)' 
          : 'scale(1)',
        opacity: disabled ? 0.5 : 1,
        boxShadow: isBookmarked 
          ? '0 6px 16px rgba(212, 175, 55, 0.4), 0 0 24px rgba(212, 175, 55, 0.25) inset'
          : isHovered
          ? '0 4px 12px rgba(212, 175, 55, 0.3)'
          : '0 2px 6px rgba(212, 175, 55, 0.15)',
        position: 'relative',
        overflow: 'hidden',
        animation: !isBookmarked && !disabled ? 'subtle-pulse 3s ease-in-out infinite' : 'none'
      }}
    >
      {/* Animated shimmer effect when bookmarked */}
      {isBookmarked && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.3), transparent)',
          animation: 'shimmer 3s infinite'
        }} />
      )}
      
      <Bookmark 
        size={iconSize}
        fill={isBookmarked ? '#D4AF37' : 'none'}
        stroke={isBookmarked ? '#D4AF37' : 'rgba(212, 175, 55, 0.7)'}
        strokeWidth={2.5}
        style={{
          transition: 'all 0.3s ease',
          position: 'relative',
          zIndex: 1,
          filter: isBookmarked ? 'drop-shadow(0 0 6px rgba(212, 175, 55, 0.7))' : 'none'
        }}
      />
      
      {/* Add shimmer and pulse animation keyframes */}
      <style>{`
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        
        @keyframes subtle-pulse {
          0%, 100% { 
            border-color: rgba(212, 175, 55, 0.3);
            box-shadow: 0 2px 6px rgba(212, 175, 55, 0.15);
          }
          50% { 
            border-color: rgba(212, 175, 55, 0.45);
            box-shadow: 0 4px 10px rgba(212, 175, 55, 0.25);
          }
        }
      `}</style>
    </button>
  );
};

export default BookmarkButton;

