/**
 * Stat Display Names & Tooltips
 * Humanizes technical stat names for user-friendly display
 */

// Plain English names for all stats
export const STAT_DISPLAY_NAMES = {
  // Expected Goals
  'scoreAdj_xGF_per60': 'Expected Goals For',
  'scoreAdj_xGA_per60': 'Expected Goals Against',
  'xGF_per60': 'Expected Goals For (Raw)',
  'xGA_per60': 'Expected Goals Against (Raw)',
  'xGF': 'Expected Goals For',
  'xGA': 'Expected Goals Against',
  
  // High Danger
  'highDangerChancesFor': 'High-Danger Chances Created',
  'highDangerChancesAgainst': 'High-Danger Chances Allowed',
  'highDangerGoalsFor': 'High-Danger Goals Scored',
  'highDangerGoalsAgainst': 'High-Danger Goals Allowed',
  'highDangerSavePercentage': 'High-Danger Save %',
  
  // Rebounds
  'reboundsFor': 'Rebound Chances Created',
  'reboundsAgainst': 'Rebound Chances Allowed',
  'reboundGoalsFor': 'Rebound Goals Scored',
  'reboundGoalsAgainst': 'Rebound Goals Allowed',
  
  // Shot Quality
  'shotsFor_per60': 'Shots For per Hour',
  'shotsAgainst_per60': 'Shots Against per Hour',
  'shotAttemptsFor': 'Shot Attempts Created',
  'shotAttemptsAgainst': 'Shot Attempts Allowed',
  
  // Possession
  'corsiFor': 'Shot Attempts For (Corsi)',
  'corsiAgainst': 'Shot Attempts Against',
  'fenwickFor': 'Unblocked Shots For (Fenwick)',
  'fenwickAgainst': 'Unblocked Shots Against',
  'corsiPercentage': 'Possession % (Corsi)',
  'fenwickPercentage': 'Unblocked Shot %',
  
  // Zones
  'offensiveZoneTime': 'Offensive Zone Time',
  'defensiveZoneTime': 'Defensive Zone Time',
  'neutralZoneTime': 'Neutral Zone Time',
  'offensiveZoneStartPct': 'Offensive Zone Start %',
  
  // Faceoffs
  'faceoffWinPct': 'Faceoff Win %',
  'faceoffsWon': 'Faceoffs Won',
  'faceoffsLost': 'Faceoffs Lost',
  
  // Physical
  'hits': 'Hits',
  'hitsFor': 'Hits Delivered',
  'hitsAgainst': 'Hits Taken',
  'blockedShots': 'Shots Blocked',
  'takeaways': 'Takeaways',
  'giveaways': 'Giveaways',
  
  // Penalties
  'penaltiesDrawn': 'Penalties Drawn',
  'penaltiesTaken': 'Penalties Taken',
  'penaltiesDrawn_per60': 'Penalties Drawn per Hour',
  'penaltiesTaken_per60': 'Penalties Taken per Hour',
  
  // Special Teams
  'powerPlayGoalsFor': 'Power Play Goals',
  'powerPlayGoalsAgainst': 'Power Play Goals Allowed',
  'shorthandedGoalsFor': 'Shorthanded Goals',
  'shorthandedGoalsAgainst': 'Shorthanded Goals Allowed',
  'powerPlayPercentage': 'Power Play %',
  'penaltyKillPercentage': 'Penalty Kill %',
  
  // Luck Indicators
  'PDO': 'Luck Index (PDO)',
  'shootingPercentage': 'Shooting %',
  'savePercentage': 'Save %',
  'onIceShootingPercentage': 'On-Ice Shooting %',
  'onIceSavePercentage': 'On-Ice Save %',
  
  // Goalie
  'GSAE': 'Goals Saved Above Expected',
  'savePercentageHighDanger': 'High-Danger Save %',
  'goalieWinPct': 'Goalie Win %',
  
  // Game State
  'goalsFor': 'Goals Scored',
  'goalsAgainst': 'Goals Allowed',
  'wins': 'Wins',
  'losses': 'Losses',
  'otLosses': 'OT Losses',
  'points': 'Points',
  'gamesPlayed': 'Games Played'
};

// Tooltips explaining what each stat means
export const STAT_TOOLTIPS = {
  'scoreAdj_xGF_per60': 'Expected goals adjusted for score effects and game situation. Better predictor than raw xG.',
  'xGF_per60': 'Raw expected goals based on shot quality and location. Not adjusted for score effects.',
  'PDO': 'Sum of shooting % and save %. Values above 102 or below 98 suggest luck (regression likely).',
  'corsiFor': 'All shot attempts (shots + blocks + misses). Measures puck possession and pressure.',
  'fenwickFor': 'Unblocked shot attempts (shots + misses). Like Corsi but removes blocks.',
  'highDangerChancesFor': 'Scoring chances from high-danger areas (slot, crease). Most predictive of goals.',
  'highDangerChancesAgainst': 'High-danger chances allowed. Strong predictor of defensive quality.',
  'GSAE': 'Goals saved above expected based on shot quality. Positive = elite goalie performance.',
  'faceoffWinPct': 'Percentage of faceoffs won. Impacts possession and zone time.',
  'offensiveZoneStartPct': 'Percentage of shifts starting in offensive zone. Higher = easier matchups.',
  'reboundsFor': 'Rebound chances created. Indicates ability to generate second chances.',
  'blockedShots': 'Shots blocked by skaters. Indicates shot-blocking commitment.',
  'takeaways': 'Pucks stolen from opponents. Measures defensive activity.',
  'giveaways': 'Pucks turned over to opponents. Higher numbers may indicate high possession.',
  'penaltiesDrawn_per60': 'Penalties drawn per 60 minutes. Indicates ability to create power plays.',
  'powerPlayPercentage': 'Goals scored per power play opportunity. League average ~20%.',
  'penaltyKillPercentage': 'Power plays killed without allowing a goal. League average ~80%.',
  'shootingPercentage': 'Goals scored per shot on goal. Highly variable, regresses to ~10%.',
  'savePercentage': 'Shots saved per shot faced. Elite goalies above 92%.',
  'onIceShootingPercentage': 'Team shooting % when player is on ice. Heavily influenced by luck.',
  'onIceSavePercentage': 'Team save % when player is on ice. Reflects goalie and defense.'
};

// Get human-readable name
export const getStatDisplayName = (statKey) => {
  return STAT_DISPLAY_NAMES[statKey] || statKey;
};

// Get tooltip text
export const getStatTooltip = (statKey) => {
  return STAT_TOOLTIPS[statKey] || null;
};

// Color-code stat value relative to league average
export const getStatColorCode = (value, leagueAvg, higherIsBetter = true) => {
  if (!leagueAvg || leagueAvg === 0) {
    return { color: '#64748B', label: '', icon: '' };
  }
  
  const ratio = value / leagueAvg;
  
  if (higherIsBetter) {
    if (ratio >= 1.15) return { color: '#10B981', label: 'Elite', icon: '⬆️' };
    if (ratio >= 1.08) return { color: '#059669', label: 'Above Avg', icon: '⬆️' };
    if (ratio >= 0.95) return { color: '#64748B', label: 'Average', icon: '→' };
    if (ratio >= 0.85) return { color: '#F59E0B', label: 'Below Avg', icon: '⬇️' };
    return { color: '#EF4444', label: 'Poor', icon: '⬇️' };
  } else {
    // For stats where lower is better (e.g., goals against)
    if (ratio <= 0.85) return { color: '#10B981', label: 'Elite', icon: '⬇️' };
    if (ratio <= 0.92) return { color: '#059669', label: 'Above Avg', icon: '⬇️' };
    if (ratio <= 1.05) return { color: '#64748B', label: 'Average', icon: '→' };
    if (ratio <= 1.15) return { color: '#F59E0B', label: 'Below Avg', icon: '⬆️' };
    return { color: '#EF4444', label: 'Poor', icon: '⬆️' };
  }
};

// Format stat value with proper decimals
export const formatStatValue = (value, statKey) => {
  if (value === null || value === undefined) return 'N/A';
  
  // Percentages
  if (statKey.includes('Percentage') || statKey.includes('Pct')) {
    return `${value.toFixed(1)}%`;
  }
  
  // Whole numbers
  if (statKey.includes('wins') || statKey.includes('losses') || statKey.includes('games') || 
      statKey.includes('hits') || statKey.includes('blocks') || statKey.includes('takeaways')) {
    return Math.round(value).toString();
  }
  
  // Two decimals for most stats
  return value.toFixed(2);
};

