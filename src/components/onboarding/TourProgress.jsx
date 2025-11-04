import { motion } from 'framer-motion';

/**
 * Tour Progress Indicator
 * Shows dots representing tour progress
 */
const TourProgress = ({ currentStep, totalSteps }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '8px 0'
    }}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isActive = index === currentStep;
        const isPast = index < currentStep;
        
        return (
          <motion.div
            key={index}
            initial={{ scale: 0 }}
            animate={{ 
              scale: isActive ? 1.2 : 1,
              backgroundColor: isActive 
                ? 'var(--color-accent)' 
                : isPast 
                ? 'rgba(212, 175, 55, 0.5)' 
                : 'rgba(148, 163, 184, 0.3)'
            }}
            transition={{ duration: 0.3 }}
            style={{
              width: isActive ? '12px' : '8px',
              height: isActive ? '12px' : '8px',
              borderRadius: '50%',
              boxShadow: isActive ? '0 0 12px rgba(212, 175, 55, 0.6)' : 'none'
            }}
          />
        );
      })}
    </div>
  );
};

export default TourProgress;

