/**
 * Onboarding Utilities
 * Handles localStorage management and analytics tracking for first-time visitor experience
 */

const STORAGE_KEY = 'nhl_savant_onboarding_completed';
const VERSION_KEY = 'nhl_savant_onboarding_version';
const CURRENT_VERSION = '1.0';

/**
 * Check if user has completed onboarding
 */
export function hasCompletedOnboarding() {
  try {
    const completed = localStorage.getItem(STORAGE_KEY);
    const version = localStorage.getItem(VERSION_KEY);
    
    // Show onboarding again if version changed
    return completed === 'true' && version === CURRENT_VERSION;
  } catch (error) {
    console.warn('localStorage not available:', error);
    return false;
  }
}

/**
 * Mark onboarding as completed
 */
export function markOnboardingCompleted() {
  try {
    localStorage.setItem(STORAGE_KEY, 'true');
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
    trackOnboardingEvent('onboarding_completed');
  } catch (error) {
    console.warn('Could not save onboarding state:', error);
  }
}

/**
 * Reset onboarding (for testing or re-watching)
 */
export function resetOnboarding() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(VERSION_KEY);
  } catch (error) {
    console.warn('Could not reset onboarding:', error);
  }
}

/**
 * Track onboarding events
 */
export function trackOnboardingEvent(eventName, properties = {}) {
  try {
    // Use existing analytics if available
    if (window.analytics && typeof window.analytics.track === 'function') {
      window.analytics.track(eventName, properties);
    }
    
    // Also log to console for debugging
    console.log(`🎯 Onboarding Event: ${eventName}`, properties);
  } catch (error) {
    console.warn('Could not track onboarding event:', error);
  }
}

/**
 * Track step view
 */
export function trackStepView(stepNumber, stepName) {
  trackOnboardingEvent('onboarding_step_viewed', {
    step: stepNumber,
    step_name: stepName,
    timestamp: Date.now()
  });
}

/**
 * Track skip event
 */
export function trackSkip(atStep, stepName) {
  trackOnboardingEvent('onboarding_skipped', {
    at_step: atStep,
    step_name: stepName,
    timestamp: Date.now()
  });
  
  // Still mark as "completed" to not show again
  markOnboardingCompleted();
}

/**
 * Track start event
 */
export function trackStart() {
  trackOnboardingEvent('onboarding_started', {
    timestamp: Date.now()
  });
}

