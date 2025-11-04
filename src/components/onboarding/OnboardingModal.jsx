import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import WelcomeStep from './WelcomeStep';
import ThreePillarsStep from './ThreePillarsStep';
import LiveDemoStep from './LiveDemoStep';
import NavigationStep from './NavigationStep';
import SuccessFormulaStep from './SuccessFormulaStep';
import ProgressIndicator from './ProgressIndicator';
import {
  trackStart,
  trackStepView,
  trackSkip,
  markOnboardingCompleted
} from './onboardingUtils';
import './onboardingStyles.css';

/**
 * Main Onboarding Modal - Premium first-time visitor experience
 * 5-step walkthrough with smooth animations and keyboard navigation
 */
export default function OnboardingModal({ isOpen, onClose, onComplete }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
  const totalSteps = 5;

  // Track when onboarding starts
  useEffect(() => {
    if (isOpen) {
      trackStart();
      trackStepView(1, 'welcome');
    }
  }, [isOpen]);

  // Track step views
  useEffect(() => {
    if (isOpen && currentStep > 1) {
      const stepNames = ['welcome', 'pillars', 'demo', 'navigation', 'success'];
      trackStepView(currentStep, stepNames[currentStep - 1]);
    }
  }, [currentStep, isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleSkip();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (currentStep < totalSteps) {
          handleNext();
        } else {
          handleComplete();
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentStep > 1) {
          handleBack();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStep]);

  const handleNext = useCallback(() => {
    if (currentStep < totalSteps) {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleStepClick = useCallback((stepNumber) => {
    if (stepNumber !== currentStep) {
      setDirection(stepNumber > currentStep ? 1 : -1);
      setCurrentStep(stepNumber);
    }
  }, [currentStep]);

  const handleSkip = useCallback(() => {
    const stepNames = ['welcome', 'pillars', 'demo', 'navigation', 'success'];
    trackSkip(currentStep, stepNames[currentStep - 1]);
    onClose();
  }, [currentStep, onClose]);

  const handleComplete = useCallback(() => {
    markOnboardingCompleted();
    if (onComplete) {
      onComplete();
    }
    onClose();
  }, [onComplete, onClose]);

  const handleViewMethodology = useCallback(() => {
    markOnboardingCompleted();
    onClose();
    // Navigate to methodology page
    window.location.hash = '#/methodology';
  }, [onClose]);

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.9,
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      y: 10,
      transition: { duration: 0.2 }
    }
  };

  const stepVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut'
      }
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: 'easeIn'
      }
    })
  };

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <WelcomeStep />;
      case 2:
        return <ThreePillarsStep />;
      case 3:
        return <LiveDemoStep />;
      case 4:
        return <NavigationStep />;
      case 5:
        return (
          <SuccessFormulaStep
            onComplete={handleComplete}
            onViewMethodology={handleViewMethodology}
          />
        );
      default:
        return <WelcomeStep />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - Premium radial gradient */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={handleSkip}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'radial-gradient(circle at center, rgba(11, 15, 31, 0.92) 0%, rgba(0, 0, 0, 0.95) 100%)',
              backdropFilter: 'blur(16px) saturate(120%)',
              zIndex: 9998,
              cursor: 'pointer'
            }}
          />

          {/* Modal - Premium institutional-grade container */}
          <motion.div
            className="onboarding-modal"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, #151923 0%, #0B0F1F 100%)',
              borderRadius: '24px',
              border: '2px solid rgba(212, 175, 55, 0.35)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 10px 40px rgba(212, 175, 55, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px) saturate(180%)',
              zIndex: 9999,
              cursor: 'default',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Gold accent border */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #D4AF37, #FFD700, #D4AF37)',
              boxShadow: '0 0 20px rgba(212, 175, 55, 0.6)'
            }} />

            {/* Skip Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSkip}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
                transition: 'all 0.2s ease'
              }}
              aria-label="Skip tour"
            >
              <X size={20} color="rgba(255, 255, 255, 0.7)" />
            </motion.button>

            {/* Content Area */}
            <div 
              className="onboarding-content"
              style={{
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer with Progress and Navigation */}
            <div 
              className="onboarding-footer"
              style={{
                flexShrink: 0,
                background: 'rgba(17, 24, 39, 0.98)',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                backdropFilter: 'blur(10px)'
              }}
            >
              {/* Progress Indicator */}
              <ProgressIndicator
                currentStep={currentStep}
                totalSteps={totalSteps}
                onStepClick={handleStepClick}
              />

              {/* Navigation Buttons */}
              {currentStep !== 5 && (
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '1rem'
                }}>
                  {/* Back Button - Glassmorphism */}
                  <motion.button
                    whileHover={{ 
                      scale: currentStep === 1 ? 1 : 1.05,
                      background: currentStep === 1 ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.08)'
                    }}
                    whileTap={{ scale: currentStep === 1 ? 1 : 0.95 }}
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '12px',
                      background: currentStep === 1 
                        ? 'rgba(255, 255, 255, 0.03)' 
                        : 'rgba(255, 255, 255, 0.06)',
                      border: currentStep === 1
                        ? '1.5px solid rgba(255, 255, 255, 0.08)'
                        : '1.5px solid rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      fontSize: '0.875rem',
                      fontWeight: '700',
                      color: currentStep === 1 
                        ? 'rgba(255, 255, 255, 0.3)' 
                        : 'rgba(255, 255, 255, 0.8)',
                      cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      opacity: currentStep === 1 ? 0.5 : 1,
                      boxShadow: currentStep === 1 ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    <ChevronLeft size={18} />
                    BACK
                  </motion.button>

                  {/* Next Button - Premium Gold Gradient */}
                  <motion.button
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: '0 6px 24px rgba(212, 175, 55, 0.6)'
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 2rem',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #FFD700 0%, #D4AF37 100%)',
                      border: 'none',
                      fontSize: '0.875rem',
                      fontWeight: '800',
                      letterSpacing: '0.05em',
                      color: '#000',
                      cursor: 'pointer',
                      boxShadow: '0 6px 20px rgba(212, 175, 55, 0.5), 0 2px 8px rgba(212, 175, 55, 0.3)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {currentStep === totalSteps - 1 ? 'FINAL STEP' : 'NEXT'}
                    <ChevronRight size={18} />
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

