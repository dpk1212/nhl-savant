import { useEffect, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useTourContext } from '../../contexts/TourContext';
import { tourSteps } from '../../config/tourSteps';
import { 
  calculateTourCardPosition, 
  scrollToElement, 
  isElementInViewport,
  lockBodyScroll,
  unlockBodyScroll,
  isMobileDevice
} from '../../utils/tourHelpers';
import TourSpotlight from './TourSpotlight';
import TourCard from './TourCard';

/**
 * Premium Tour Component
 * Main orchestrator for the onboarding tour experience
 */
const PremiumTour = () => {
  const {
    isTourActive,
    currentStep,
    nextStep,
    prevStep,
    skipTour,
    completeTour
  } = useTourContext();

  const [targetElement, setTargetElement] = useState(null);
  const [cardPosition, setCardPosition] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  const currentStepData = tourSteps[currentStep];

  /**
   * Detect mobile on mount and resize
   */
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(isMobileDevice());
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  /**
   * Lock body scroll when tour is active
   */
  useEffect(() => {
    if (isTourActive) {
      lockBodyScroll();
    } else {
      unlockBodyScroll();
    }

    return () => {
      unlockBodyScroll();
    };
  }, [isTourActive]);

  /**
   * Handle keyboard navigation
   */
  useEffect(() => {
    if (!isTourActive) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        skipTour();
      } else if (e.key === 'ArrowRight') {
        if (currentStep < tourSteps.length - 1) {
          nextStep();
        } else {
          completeTour();
        }
      } else if (e.key === 'ArrowLeft' && currentStep > 0) {
        prevStep();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTourActive, currentStep, nextStep, prevStep, skipTour, completeTour]);

  /**
   * Update target element and position when step changes
   */
  useEffect(() => {
    if (!isTourActive || !currentStepData) return;

    const updateStepTarget = () => {
      // If no target (welcome/completion), center the card
      if (!currentStepData.target) {
        setTargetElement(null);
        setCardPosition({
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        });
        return;
      }

      // Find target element
      const element = document.querySelector(currentStepData.target);
      
      if (element) {
        setTargetElement(element);

        // Scroll to element if not in viewport
        if (!isElementInViewport(element)) {
          scrollToElement(element, isMobile ? 150 : 120);
        }

        // Calculate card position after a short delay to allow scroll
        setTimeout(() => {
          const position = calculateTourCardPosition(
            element,
            currentStepData.position,
            isMobile
          );
          setCardPosition(position);
        }, 300);
      } else {
        // Element not found - fall back to center
        console.warn(`Tour target not found: ${currentStepData.target}`);
        setTargetElement(null);
        setCardPosition({
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        });
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(updateStepTarget, 100);
    return () => clearTimeout(timer);
  }, [isTourActive, currentStep, currentStepData, isMobile]);

  /**
   * Handle next step
   */
  const handleNext = useCallback(() => {
    nextStep();
  }, [nextStep]);

  /**
   * Handle previous step
   */
  const handlePrev = useCallback(() => {
    prevStep();
  }, [prevStep]);

  /**
   * Handle skip/close
   */
  const handleSkip = useCallback(() => {
    skipTour();
  }, [skipTour]);

  /**
   * Handle completion
   */
  const handleComplete = useCallback(() => {
    completeTour();
  }, [completeTour]);

  if (!isTourActive || !currentStepData) {
    return null;
  }

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tourSteps.length - 1;
  
  // Calculate total steps (excluding welcome/completion if they have no target)
  const stepsWithTargets = tourSteps.filter(step => step.target !== null);
  const currentStepIndex = stepsWithTargets.findIndex(step => step.id === currentStepData.id);
  const totalSteps = stepsWithTargets.length;

  return (
    <AnimatePresence mode="wait">
      {isTourActive && (
        <>
          {/* Spotlight overlay with cutout */}
          <TourSpotlight
            targetElement={targetElement}
            isVisible={isTourActive}
            isMobile={isMobile}
          />

          {/* Floating tour card */}
          <div style={cardPosition}>
            <TourCard
              title={currentStepData.title}
              description={currentStepData.description}
              currentStep={currentStepIndex >= 0 ? currentStepIndex : 0}
              totalSteps={totalSteps}
              isFirstStep={isFirstStep}
              isLastStep={isLastStep}
              onNext={handleNext}
              onPrev={handlePrev}
              onSkip={handleSkip}
              onComplete={handleComplete}
              position={currentStepData.position}
              isMobile={isMobile}
            />
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PremiumTour;

