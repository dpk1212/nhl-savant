import { useEffect, useCallback } from 'react';
import { useTourContext } from '../contexts/TourContext';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook for tour functionality
 * Handles auto-triggering and tour control
 */
export const useTour = () => {
  const location = useLocation();
  const tourContext = useTourContext();
  
  const {
    isTourActive,
    currentStep,
    hasCompletedTour,
    isNewUser,
    startTour,
    endTour,
    completeTour,
    skipTour,
    nextStep,
    prevStep,
    goToStep,
    resetTour
  } = tourContext;

  /**
   * Auto-trigger tour for new users on home page
   */
  useEffect(() => {
    // DISABLED FOR NOW - causing issues
    // Only auto-trigger on home page
    // if (location.pathname === '/' && isNewUser && !hasCompletedTour && !isTourActive) {
    //   // Small delay to ensure page is fully loaded
    //   const timer = setTimeout(() => {
    //     startTour();
    //   }, 1500);
    //   
    //   return () => clearTimeout(timer);
    // }
  }, [location.pathname, isNewUser, hasCompletedTour, isTourActive, startTour]);

  /**
   * Check if user should see the tour
   */
  const shouldShowTour = useCallback(() => {
    return isNewUser && !hasCompletedTour;
  }, [isNewUser, hasCompletedTour]);

  /**
   * Manually start tour (from help button)
   */
  const triggerTour = useCallback(() => {
    startTour();
  }, [startTour]);

  return {
    // State
    isTourActive,
    currentStep,
    hasCompletedTour,
    isNewUser,
    shouldShowTour: shouldShowTour(),
    
    // Actions
    startTour: triggerTour,
    endTour,
    completeTour,
    skipTour,
    nextStep,
    prevStep,
    goToStep,
    resetTour
  };
};

export default useTour;

