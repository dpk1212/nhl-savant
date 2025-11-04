import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const TourContext = createContext(null);

const TOUR_STORAGE_KEY = 'nhl-savant-tour';
const TOUR_VERSION = '1.0';

/**
 * Get tour data from localStorage
 */
const getTourData = () => {
  try {
    const data = localStorage.getItem(TOUR_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.warn('Failed to read tour data from localStorage:', error);
    return null;
  }
};

/**
 * Save tour data to localStorage
 */
const saveTourData = (data) => {
  try {
    localStorage.setItem(TOUR_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save tour data to localStorage:', error);
  }
};

/**
 * Tour Context Provider
 * Manages onboarding tour state and persistence
 */
export const TourProvider = ({ children }) => {
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCompletedTour, setHasCompletedTour] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  // Initialize tour state from localStorage
  useEffect(() => {
    const tourData = getTourData();
    
    if (!tourData) {
      // First-time visitor
      setIsNewUser(true);
      setHasCompletedTour(false);
    } else if (tourData.tourVersion !== TOUR_VERSION) {
      // Tour version updated - treat as new user for new features
      setIsNewUser(true);
      setHasCompletedTour(false);
    } else {
      setHasCompletedTour(tourData.hasCompletedTour || false);
      setIsNewUser(false);
    }
  }, []);

  /**
   * Start the tour
   */
  const startTour = useCallback(() => {
    setIsTourActive(true);
    setCurrentStep(0);
  }, []);

  /**
   * End the tour
   */
  const endTour = useCallback(() => {
    setIsTourActive(false);
    setCurrentStep(0);
  }, []);

  /**
   * Complete the tour and save to localStorage
   */
  const completeTour = useCallback(() => {
    setIsTourActive(false);
    setCurrentStep(0);
    setHasCompletedTour(true);
    setIsNewUser(false);
    
    saveTourData({
      hasCompletedTour: true,
      lastTourDate: new Date().toISOString(),
      tourVersion: TOUR_VERSION
    });
  }, []);

  /**
   * Skip the tour
   */
  const skipTour = useCallback(() => {
    completeTour();
  }, [completeTour]);

  /**
   * Go to next step
   */
  const nextStep = useCallback(() => {
    setCurrentStep(prev => prev + 1);
  }, []);

  /**
   * Go to previous step
   */
  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  }, []);

  /**
   * Go to specific step
   */
  const goToStep = useCallback((stepIndex) => {
    setCurrentStep(stepIndex);
  }, []);

  /**
   * Reset tour data (for testing or user request)
   */
  const resetTour = useCallback(() => {
    setHasCompletedTour(false);
    setIsNewUser(true);
    setIsTourActive(false);
    setCurrentStep(0);
    
    try {
      localStorage.removeItem(TOUR_STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to reset tour data:', error);
    }
  }, []);

  const value = {
    // State
    isTourActive,
    currentStep,
    hasCompletedTour,
    isNewUser,
    
    // Actions
    startTour,
    endTour,
    completeTour,
    skipTour,
    nextStep,
    prevStep,
    goToStep,
    resetTour
  };

  return (
    <TourContext.Provider value={value}>
      {children}
    </TourContext.Provider>
  );
};

/**
 * Hook to use tour context
 */
export const useTourContext = () => {
  const context = useContext(TourContext);
  
  if (!context) {
    throw new Error('useTourContext must be used within a TourProvider');
  }
  
  return context;
};

export default TourContext;

