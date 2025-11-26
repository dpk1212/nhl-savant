/**
 * Firebase Analytics Tracking Utility
 * 
 * Comprehensive event tracking for user behavior analysis:
 * - Page views and navigation
 * - User engagement and time spent
 * - Bet interactions and views
 * - Section interactions
 * - Error tracking
 * 
 * View analytics in Firebase Console → Analytics → Dashboard
 */

import { analytics, logEvent, setUserProperties } from '../firebase/config';

// Helper to safely log events (only if analytics is initialized)
const safeLogEvent = (eventName, params = {}) => {
  if (!analytics) {
    // Analytics not initialized (likely missing measurementId or in development)
    console.log(`📊 [Analytics] ${eventName}:`, params);
    return;
  }
  
  try {
    logEvent(analytics, eventName, params);
    console.log(`📊 [Analytics] ${eventName}:`, params);
  } catch (error) {
    console.error(`Failed to log event ${eventName}:`, error);
  }
};

// ============================================================================
// PAGE TRACKING
// ============================================================================

/**
 * Track page views
 * Automatically called when user navigates to a new page
 */
export const trackPageView = (pageName, additionalParams = {}) => {
  safeLogEvent('page_view', {
    page_title: pageName,
    page_location: window.location.href,
    page_path: window.location.pathname,
    ...additionalParams
  });
};

/**
 * Track user engagement time on a page
 * Called when user leaves a page
 */
export const trackEngagement = (pageName, timeSpentSeconds) => {
  if (timeSpentSeconds < 3) return; // Ignore very short visits (< 3 seconds)
  
  safeLogEvent('user_engagement', {
    page_name: pageName,
    engagement_time_msec: timeSpentSeconds * 1000,
    engagement_time_seconds: timeSpentSeconds
  });
};

/**
 * Track navigation between pages
 */
export const trackNavigation = (fromPage, toPage) => {
  safeLogEvent('navigation', {
    from_page: fromPage,
    to_page: toPage
  });
};

// ============================================================================
// BET INTERACTIONS
// ============================================================================

/**
 * Track when a user views a bet recommendation
 * Called when bets are displayed on Today's Games page
 */
export const trackBetView = (game, bet) => {
  safeLogEvent('bet_viewed', {
    away_team: game.awayTeam,
    home_team: game.homeTeam,
    matchup: `${game.awayTeam} @ ${game.homeTeam}`,
    market: bet.market,
    pick: bet.pick,
    ev_percent: parseFloat(bet.evPercent?.toFixed(2) || 0),
    odds: bet.odds,
    rating: bet.rating,
    tier: bet.tier
  });
};

/**
 * Track when a user expands a game card to see details
 * High-value engagement event
 */
export const trackBetExpand = (game) => {
  safeLogEvent('bet_expanded', {
    away_team: game.awayTeam,
    home_team: game.homeTeam,
    matchup: `${game.awayTeam} @ ${game.homeTeam}`,
    game_time: game.gameTime
  });
};

/**
 * Track when a user collapses a game card
 */
export const trackBetCollapse = (game) => {
  safeLogEvent('bet_collapsed', {
    matchup: `${game.awayTeam} @ ${game.homeTeam}`
  });
};

// ============================================================================
// SECTION INTERACTIONS (Inside Expanded Game Cards)
// ============================================================================

/**
 * Track which sections users view inside expanded cards
 * Helps understand what content is most valuable
 */
export const trackSectionView = (sectionName, game) => {
  safeLogEvent('section_viewed', {
    section: sectionName,
    matchup: `${game.awayTeam} @ ${game.homeTeam}`
  });
};

/**
 * Track when user expands Advanced Matchup Details (Step 6)
 */
export const trackAdvancedAnalyticsView = (game) => {
  safeLogEvent('advanced_analytics_viewed', {
    matchup: `${game.awayTeam} @ ${game.homeTeam}`
  });
};

// ============================================================================
// DASHBOARD & PERFORMANCE TRACKING
// ============================================================================

/**
 * Track methodology page view
 * Indicates user interest in understanding the model
 */
export const trackMethodologyView = () => {
  safeLogEvent('methodology_viewed');
};

/**
 * Track performance dashboard view
 * Shows user is tracking results
 */
export const trackPerformanceView = (stats = {}) => {
  safeLogEvent('performance_viewed', {
    total_bets: stats.totalBets || 0,
    win_rate: stats.winRate || 0,
    roi: stats.roi || 0
  });
};

/**
 * Track analytics dashboard view
 */
export const trackAnalyticsDashboardView = () => {
  safeLogEvent('analytics_dashboard_viewed');
};

/**
 * Track data inspector usage
 */
export const trackDataInspectorView = () => {
  safeLogEvent('data_inspector_viewed');
};

// ============================================================================
// FILTERS & SEARCH
// ============================================================================

/**
 * Track when users apply filters
 * Helps understand how users find specific games
 */
export const trackFilter = (filterType, filterValue) => {
  safeLogEvent('filter_applied', {
    filter_type: filterType,
    filter_value: filterValue
  });
};

/**
 * Track search usage (if you add search functionality)
 */
export const trackSearch = (searchTerm, resultCount) => {
  safeLogEvent('search', {
    search_term: searchTerm,
    result_count: resultCount
  });
};

// ============================================================================
// EXTERNAL INTERACTIONS
// ============================================================================

/**
 * Track external link clicks (e.g., to betting sites)
 */
export const trackExternalLink = (url, linkText = '') => {
  safeLogEvent('external_link_click', {
    url: url,
    link_text: linkText,
    link_domain: new URL(url).hostname
  });
};

/**
 * Track disclaimer acceptance
 * Important for legal compliance tracking
 */
export const trackDisclaimerAccepted = () => {
  safeLogEvent('disclaimer_accepted', {
    timestamp: new Date().toISOString()
  });
};

// ============================================================================
// ERROR TRACKING
// ============================================================================

/**
 * Track application errors
 * Helps identify and fix issues
 */
export const trackError = (errorType, errorMessage, errorStack = '') => {
  safeLogEvent('app_error', {
    error_type: errorType,
    error_message: errorMessage,
    error_stack: errorStack.substring(0, 500), // Limit stack trace length
    page_url: window.location.href
  });
};

/**
 * Track data loading errors
 */
export const trackDataLoadError = (dataType, errorMessage) => {
  safeLogEvent('data_load_error', {
    data_type: dataType,
    error_message: errorMessage
  });
};

// ============================================================================
// USER PROPERTIES (For Segmentation)
// ============================================================================

/**
 * Set user type for segmentation
 * Call once when you can determine if user is new/returning
 */
export const setUserType = (type) => {
  if (!analytics) return;
  
  try {
    setUserProperties(analytics, {
      user_type: type // 'new', 'returning', 'power_user'
    });
    console.log('📊 [Analytics] User type set:', type);
  } catch (error) {
    console.error('Failed to set user type:', error);
  }
};

/**
 * Set user preferences for segmentation
 */
export const setUserPreferences = (preferences) => {
  if (!analytics) return;
  
  try {
    setUserProperties(analytics, preferences);
    console.log('📊 [Analytics] User preferences set:', preferences);
  } catch (error) {
    console.error('Failed to set user preferences:', error);
  }
};

/**
 * Track first visit
 */
export const trackFirstVisit = () => {
  const hasVisited = localStorage.getItem('nhl_savant_visited');
  
  if (!hasVisited) {
    safeLogEvent('first_visit', {
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('nhl_savant_visited', 'true');
    localStorage.setItem('nhl_savant_first_visit', new Date().toISOString());
    setUserType('new');
  } else {
    setUserType('returning');
  }
};

// ============================================================================
// CONVERSION TRACKING
// ============================================================================

/**
 * Track when user completes key actions
 * (e.g., viewing their first bet, checking performance)
 */
export const trackConversion = (conversionType, value = null) => {
  safeLogEvent('conversion', {
    conversion_type: conversionType,
    value: value
  });
};

// ============================================================================
// BATCH TRACKING
// ============================================================================

/**
 * Track multiple bets viewed at once (Today's Games page load)
 */
export const trackBetsLoaded = (gamesCount, betsWithEV) => {
  safeLogEvent('bets_loaded', {
    games_count: gamesCount,
    bets_with_positive_ev: betsWithEV,
    load_timestamp: new Date().toISOString()
  });
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get page name from pathname
 */
export const getPageName = (pathname) => {
  const routes = {
    '/': 'Today\'s Games',
    '/dashboard': 'Analytics Dashboard',
    '/performance': 'Performance Dashboard',
    '/methodology': 'Methodology',
    '/inspector': 'Data Inspector',
    '/disclaimer': 'Legal Disclaimer'
  };
  return routes[pathname] || pathname;
};





