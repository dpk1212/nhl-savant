/**
 * Tour Helper Functions
 * Position calculations and utility functions for the onboarding tour
 */

/**
 * Calculate the position for the tour card based on target element
 */
export const calculateTourCardPosition = (targetElement, position, isMobile) => {
  if (!targetElement) {
    // Center position for welcome/completion screens
    return {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };
  }

  const rect = targetElement.getBoundingClientRect();
  const cardWidth = isMobile ? 320 : 400;
  const cardHeight = isMobile ? 200 : 180;
  const spacing = 20;

  // On mobile, always position at bottom
  if (isMobile) {
    return {
      bottom: spacing,
      left: '50%',
      transform: 'translateX(-50%)',
      maxWidth: `calc(100% - ${spacing * 2}px)`
    };
  }

  // Desktop positioning based on specified position
  switch (position) {
    case 'top':
      return {
        top: Math.max(spacing, rect.top - cardHeight - spacing),
        left: Math.max(spacing, Math.min(
          window.innerWidth - cardWidth - spacing,
          rect.left + rect.width / 2 - cardWidth / 2
        ))
      };
      
    case 'bottom':
      return {
        top: Math.min(
          window.innerHeight - cardHeight - spacing,
          rect.bottom + spacing
        ),
        left: Math.max(spacing, Math.min(
          window.innerWidth - cardWidth - spacing,
          rect.left + rect.width / 2 - cardWidth / 2
        ))
      };
      
    case 'left':
      return {
        top: Math.max(spacing, Math.min(
          window.innerHeight - cardHeight - spacing,
          rect.top + rect.height / 2 - cardHeight / 2
        )),
        left: Math.max(spacing, rect.left - cardWidth - spacing)
      };
      
    case 'right':
      return {
        top: Math.max(spacing, Math.min(
          window.innerHeight - cardHeight - spacing,
          rect.top + rect.height / 2 - cardHeight / 2
        )),
        left: Math.min(
          window.innerWidth - cardWidth - spacing,
          rect.right + spacing
        )
      };
      
    default:
      // Fallback to bottom
      return {
        top: Math.min(
          window.innerHeight - cardHeight - spacing,
          rect.bottom + spacing
        ),
        left: Math.max(spacing, Math.min(
          window.innerWidth - cardWidth - spacing,
          rect.left + rect.width / 2 - cardWidth / 2
        ))
      };
  }
};

/**
 * Get the bounding box for the spotlight cutout
 */
export const getSpotlightBounds = (targetElement, padding = 8) => {
  if (!targetElement) {
    return null;
  }

  const rect = targetElement.getBoundingClientRect();
  
  return {
    top: rect.top - padding,
    left: rect.left - padding,
    width: rect.width + padding * 2,
    height: rect.height + padding * 2,
    borderRadius: 12 // Smooth corners for spotlight
  };
};

/**
 * Scroll element into view smoothly
 */
export const scrollToElement = (targetElement, offset = 100) => {
  if (!targetElement) return;

  const rect = targetElement.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const targetPosition = rect.top + scrollTop - offset;

  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth'
  });
};

/**
 * Check if element is in viewport
 */
export const isElementInViewport = (element) => {
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/**
 * Get element by tour ID
 */
export const getTourElement = (tourId) => {
  if (!tourId) return null;
  return document.querySelector(`[data-tour-id="${tourId}"]`);
};

/**
 * Check if mobile device
 */
export const isMobileDevice = () => {
  return window.innerWidth <= 640;
};

/**
 * Prevent body scroll when tour is active
 */
export const lockBodyScroll = () => {
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = 'hidden';
  document.body.style.paddingRight = `${scrollbarWidth}px`;
};

/**
 * Re-enable body scroll
 */
export const unlockBodyScroll = () => {
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
};

