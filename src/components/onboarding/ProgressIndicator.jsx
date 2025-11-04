import { motion } from 'framer-motion';

/**
 * Progress Indicator - Shows user's position in onboarding flow
 * Premium design with gold accent for current step
 */
export default function ProgressIndicator({ currentStep, totalSteps, onStepClick }) {
  return (
    <div style={{
      display: 'flex',
      gap: '0.75rem',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '1.5rem 0'
    }}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isPast = stepNumber < currentStep;
        
        return (
          <motion.button
            key={stepNumber}
            onClick={() => onStepClick && onStepClick(stepNumber)}
            disabled={!onStepClick}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: onStepClick ? 1.2 : 1 }}
            whileTap={{ scale: onStepClick ? 0.9 : 1 }}
            style={{
              width: isActive ? '2.5rem' : '0.875rem',
              height: '0.875rem',
              borderRadius: '9999px',
              border: 'none',
              background: isActive 
                ? 'linear-gradient(135deg, #FFD700 0%, #D4AF37 100%)'
                : isPast
                ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.6), rgba(212, 175, 55, 0.4))'
                : 'rgba(255, 255, 255, 0.25)',
              cursor: onStepClick ? 'pointer' : 'default',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: isActive 
                ? '0 0 24px rgba(212, 175, 55, 0.7), 0 2px 8px rgba(212, 175, 55, 0.4)'
                : isPast
                ? '0 2px 4px rgba(0, 0, 0, 0.2)'
                : 'none',
              position: 'relative',
              overflow: 'hidden'
            }}
            aria-label={`Step ${stepNumber} of ${totalSteps}`}
            aria-current={isActive ? 'step' : undefined}
          >
            {isActive && (
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear'
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)'
                }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

