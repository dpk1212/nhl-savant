/**
 * Player Data Processor - Elite Player Threat Matrix
 * Parses skaters.csv and ranks players across key categories
 */

import Papa from 'papaparse';

/**
 * Load and parse skaters.csv
 */
export async function loadPlayerData() {
  try {
    const response = await fetch('/skaters.csv');
    const csvText = await response.text();
    
    const result = Papa.parse(csvText, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true
    });
    
    return result.data;
  } catch (error) {
    console.error('Error loading player data:', error);
    return [];
  }
}

/**
 * Get top offensive threats
 * Sort by total points (I_F_points)
 */
export function getOffensiveThreats(players, limit = 8) {
  const allSituation = players.filter(p => 
    p.situation === 'all' && 
    p.games_played >= 5 && // Minimum games played
    p.I_F_points > 0
  );
  
  return allSituation
    .sort((a, b) => b.I_F_points - a.I_F_points)
    .slice(0, limit)
    .map(p => ({
      playerId: p.playerId,
      name: p.name,
      team: p.team,
      position: p.position,
      points: p.I_F_points,
      goals: p.I_F_goals,
      highDangerxGoals: p.I_F_highDangerxGoals,
      gameScore: p.gameScore,
      gamesPlayed: p.games_played,
      category: 'offensive'
    }));
}

/**
 * Get top defensive anchors
 * Sort by defensive impact: blocks + low on-ice xGA
 */
export function getDefensiveAnchors(players, limit = 8) {
  const allSituation = players.filter(p => 
    p.situation === 'all' && 
    p.games_played >= 5 &&
    p.shotsBlockedByPlayer > 0
  );
  
  // Calculate defensive impact score
  const withScore = allSituation.map(p => {
    const blocksPerGame = p.shotsBlockedByPlayer / p.games_played;
    const xGAPerGame = p.OnIce_A_xGoals / p.games_played;
    const hitsPerGame = p.I_F_hits / p.games_played;
    
    // Higher blocks and hits = better, lower xGA = better
    const defensiveScore = (blocksPerGame * 2) + (hitsPerGame * 0.5) - (xGAPerGame * 0.3);
    
    return {
      ...p,
      defensiveScore,
      blocksPerGame,
      xGAPerGame,
      hitsPerGame
    };
  });
  
  return withScore
    .sort((a, b) => b.defensiveScore - a.defensiveScore)
    .slice(0, limit)
    .map(p => ({
      playerId: p.playerId,
      name: p.name,
      team: p.team,
      position: p.position,
      blocks: p.shotsBlockedByPlayer,
      hits: p.I_F_hits,
      onIceXGA: p.OnIce_A_xGoals,
      takeaways: p.I_F_takeaways,
      gamesPlayed: p.games_played,
      defensiveScore: p.defensiveScore,
      category: 'defensive'
    }));
}

/**
 * Get top power play specialists
 * Filter to 5on4 situations, sort by PP points
 */
export function getPowerPlaySpecialists(players, limit = 8) {
  const powerPlay = players.filter(p => 
    p.situation === '5on4' && 
    p.games_played >= 5 &&
    p.I_F_points > 0
  );
  
  return powerPlay
    .sort((a, b) => b.I_F_points - a.I_F_points)
    .slice(0, limit)
    .map(p => ({
      playerId: p.playerId,
      name: p.name,
      team: p.team,
      position: p.position,
      ppPoints: p.I_F_points,
      ppGoals: p.I_F_goals,
      ppxGoals: p.I_F_xGoals,
      ppIceTime: Math.round(p.icetime / 60), // Convert to minutes
      gamesPlayed: p.games_played,
      category: 'powerplay'
    }));
}

/**
 * Get top two-way forces
 * Sort by gameScore and on-ice xG%
 */
export function getTwoWayForces(players, limit = 8) {
  const allSituation = players.filter(p => 
    p.situation === 'all' && 
    p.games_played >= 5 &&
    p.gameScore > 0 &&
    p.onIce_xGoalsPercentage > 0
  );
  
  // Calculate two-way score: combination of gameScore and on-ice dominance
  const withScore = allSituation.map(p => {
    const twoWayScore = (p.gameScore * 0.6) + (p.onIce_xGoalsPercentage * 100 * 0.4);
    return {
      ...p,
      twoWayScore
    };
  });
  
  return withScore
    .sort((a, b) => b.twoWayScore - a.twoWayScore)
    .slice(0, limit)
    .map(p => ({
      playerId: p.playerId,
      name: p.name,
      team: p.team,
      position: p.position,
      gameScore: p.gameScore,
      onIceXGPercent: p.onIce_xGoalsPercentage,
      points: p.I_F_points,
      plusMinus: (p.OnIce_F_goals || 0) - (p.OnIce_A_goals || 0),
      gamesPlayed: p.games_played,
      twoWayScore: p.twoWayScore,
      category: 'twoway'
    }));
}

/**
 * Get all elite players by category
 */
export async function getElitePlayers(limit = 8) {
  const players = await loadPlayerData();
  
  if (!players || players.length === 0) {
    return {
      offensive: [],
      defensive: [],
      powerplay: [],
      twoway: []
    };
  }
  
  return {
    offensive: getOffensiveThreats(players, limit),
    defensive: getDefensiveAnchors(players, limit),
    powerplay: getPowerPlaySpecialists(players, limit),
    twoway: getTwoWayForces(players, limit)
  };
}

