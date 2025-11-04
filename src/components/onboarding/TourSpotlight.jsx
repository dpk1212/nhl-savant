import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getSpotlightBounds } from '../../utils/tourHelpers';

/**
 * Tour Spotlight Component
 * Creates a dark overlay with a cutout highlighting the target element
 */
const TourSpotlight = ({ targetElement, isVisible, isMobile }) => {
  const [bounds, setBounds] = useState(null);

  useEffect(() => {
    if (targetElement && isVisible) {
      const spotlightBounds = getSpotlightBounds(targetElement, 12);
      setBounds(spotlightBounds);

      // Update bounds on window resize
      const handleResize = () => {
        const newBounds = getSpotlightBounds(targetElement, 12);
        setBounds(newBounds);
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    } else {
      setBounds(null);
    }
  }, [targetElement, isVisible]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9998,
          pointerEvents: 'none'
        }}
      >
        {/* Dark overlay with SVG cutout */}
        <svg
          width="100%"
          height="100%"
          style={{
            position: 'absolute',
            top: 0,
            left: 0
          }}
        >
          <defs>
            <mask id="spotlight-mask">
              {/* White background (visible) */}
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              
              {/* Black cutout (transparent) - only if we have bounds */}
              {bounds && (
                <motion.rect
                  initial={{
                    x: bounds.left,
                    y: bounds.top,
                    width: bounds.width,
                    height: bounds.height
                  }}
                  animate={{
                    x: bounds.left,
                    y: bounds.top,
                    width: bounds.width,
                    height: bounds.height
                  }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  rx={bounds.borderRadius}
                  ry={bounds.borderRadius}
                  fill="black"
                />
              )}
            </mask>
          </defs>
          
          {/* Dark overlay with mask applied */}
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(0, 0, 0, 0.85)"
            mask="url(#spotlight-mask)"
          />
        </svg>

        {/* Pulsing gold ring around highlighted element */}
        {bounds && (
          <motion.div
            initial={{
              top: bounds.top,
              left: bounds.left,
              width: bounds.width,
              height: bounds.height,
              opacity: 0
            }}
            animate={{
              top: bounds.top,
              left: bounds.left,
              width: bounds.width,
              height: bounds.height,
              opacity: 1
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              border: '2px solid var(--color-accent)',
              borderRadius: `${bounds.borderRadius}px`,
              boxShadow: `
                0 0 0 4px rgba(212, 175, 55, 0.3),
                0 0 20px rgba(212, 175, 55, 0.5),
                inset 0 0 20px rgba(212, 175, 55, 0.2)
              `,
              animation: 'pulse-glow 2s ease-in-out infinite',
              pointerEvents: 'none'
            }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default TourSpotlight;

