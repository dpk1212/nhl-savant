/**
 * Premium Onboarding Tour - Step Configuration
 * Defines all tour steps with targets, content, and positioning
 */

export const tourSteps = [
  // TODAY'S GAMES PAGE STEPS
  {
    id: 'welcome',
    target: null, // Center screen, no specific target
    title: '🏒 Welcome to NHL Savant',
    description: 'Your institutional-grade NHL betting analytics platform. Let us show you around in just 60 seconds.',
    page: '/',
    position: 'center',
    showBeacon: false
  },
  {
    id: 'performance-stats',
    target: '[data-tour-id="performance-stats"]',
    title: '📊 Today\'s Performance Dashboard',
    description: 'Track your daily picks, +EV opportunities, elite bets, total plays, and real-time profit. All metrics update live.',
    page: '/',
    position: 'bottom',
    showBeacon: true
  },
  {
    id: 'picks-summary',
    target: '[data-tour-id="picks-summary"]',
    title: '🎯 Today\'s Picks Section',
    description: 'View all today\'s betting opportunities with our AI-powered picks. Click to expand and see detailed analysis for each game.',
    page: '/',
    position: 'bottom',
    showBeacon: true
  },
  {
    id: 'game-card',
    target: '[data-tour-id="game-card"]',
    title: '🎮 Game Cards',
    description: 'Each game card shows matchup details, our AI rating, predicted winner, best betting opportunities, and live odds from top sportsbooks.',
    page: '/',
    position: 'right',
    showBeacon: true
  },
  {
    id: 'rating-badge',
    target: '[data-tour-id="rating-badge"]',
    title: '⭐ Confidence Rating',
    description: 'Our AI rates each opportunity from C to A+. Higher grades indicate stronger statistical edges and higher confidence predictions.',
    page: '/',
    position: 'right',
    showBeacon: true
  },
  {
    id: 'win-probability',
    target: '[data-tour-id="win-probability"]',
    title: '📈 Win Probabilities',
    description: 'See our model\'s predicted win probability for each team based on advanced analytics, recent form, and matchup factors.',
    page: '/',
    position: 'top',
    showBeacon: true
  },
  {
    id: 'share-button',
    target: '[data-tour-id="share-button"]',
    title: '📤 Share Your Picks',
    description: 'Share your betting slips as beautiful images on social media. Track your record and show off your wins!',
    page: '/',
    position: 'left',
    showBeacon: true
  },
  {
    id: 'navigation',
    target: '[data-tour-id="navigation"]',
    title: '🧭 Explore More Features',
    description: 'Check out the Dashboard for league-wide analytics, Performance page for historical results, and Methodology to understand our edge.',
    page: '/',
    position: 'bottom',
    showBeacon: true
  },
  {
    id: 'completion',
    target: null,
    title: '🎉 You\'re All Set!',
    description: 'You\'ve completed the tour. Click the help icon (?) in the navigation anytime to replay this guide. Good luck with your picks!',
    page: '/',
    position: 'center',
    showBeacon: false
  }
];

/**
 * Get steps for a specific page
 */
export const getStepsForPage = (pathname) => {
  return tourSteps.filter(step => !step.page || step.page === pathname);
};

/**
 * Get total number of steps (excluding welcome/completion center modals)
 */
export const getTotalSteps = () => {
  return tourSteps.filter(step => step.target !== null).length;
};

/**
 * Position configurations for tour card placement
 */
export const TOUR_POSITIONS = {
  top: { 
    placement: 'top',
    offset: { x: 0, y: -20 }
  },
  bottom: { 
    placement: 'bottom',
    offset: { x: 0, y: 20 }
  },
  left: { 
    placement: 'left',
    offset: { x: -20, y: 0 }
  },
  right: { 
    placement: 'right',
    offset: { x: 20, y: 0 }
  },
  center: { 
    placement: 'center',
    offset: { x: 0, y: 0 }
  }
};

/**
 * Mobile-specific adjustments
 */
export const MOBILE_TOUR_CONFIG = {
  cardPosition: 'bottom', // Always position at bottom on mobile
  simplifiedSpotlight: true, // Full element highlight instead of cutout
  largerTouchTargets: true,
  condensedDescriptions: true
};

