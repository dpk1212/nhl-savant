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
    console.log('🏒 Loading skaters.csv...');
    const response = await fetch('/skaters.csv');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const csvText = await response.text();
    console.log(`📊 CSV loaded: ${csvText.length} characters`);
    
    const result = Papa.parse(csvText, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim()
    });
    
    console.log(`✅ Parsed ${result.data.length} player records`);
    
    if (result.errors.length > 0) {
      console.warn('⚠️ Parse warnings:', result.errors.slice(0, 5));
    }
    
    return result.data;
  } catch (error) {
    console.error('❌ Error loading player data:', error);
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

/**
 * THERMAL HEXMAP - Normalize value to 0-100 scale
 */
function normalize(value, min, max) {
  if (max === min) return 50; // Avoid division by zero
  return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
}

/**
 * THERMAL HEXMAP - Get top 150 players with lens scores
 */
export async function getTop150PlayersWithLensScores() {
  const allPlayers = await loadPlayerData();
  
  if (!allPlayers || allPlayers.length === 0) {
    return [];
  }

  // Filter: all situation, min 5 games, min 10 min/game
  const eligible = allPlayers.filter(p => 
    p.situation === 'all' && 
    p.games_played >= 5 &&
    (p.icetime / p.games_played / 60) >= 10 // Min 10 minutes per game
  );

  // Sort by total ice time and take top 150
  const top150 = eligible
    .sort((a, b) => b.icetime - a.icetime)
    .slice(0, 150);

  // Find min/max for each metric category for normalization
  const metrics = {
    // Offense
    points: top150.map(p => p.I_F_points || 0),
    goals: top150.map(p => p.I_F_goals || 0),
    shots: top150.map(p => p.I_F_shots || 0),
    xGF: top150.map(p => p.I_F_xGoals || 0),
    
    // Defense
    blocks: top150.map(p => p.shotsBlockedByPlayer || 0),
    hits: top150.map(p => p.I_F_hits || 0),
    takeaways: top150.map(p => p.I_F_takeaways || 0),
    
    // Special Teams (need to cross-reference 5on4 data)
    icetime: top150.map(p => p.icetime || 0),
    
    // Efficiency
    pointsPerTOI: top150.map(p => (p.I_F_points || 0) / ((p.icetime / 60) || 1)),
    shootingPct: top150.map(p => {
      const shots = p.I_F_shots || 0;
      const goals = p.I_F_goals || 0;
      return shots > 0 ? (goals / shots) * 100 : 0;
    })
  };

  const ranges = {};
  for (const [key, values] of Object.entries(metrics)) {
    ranges[key] = {
      min: Math.min(...values),
      max: Math.max(...values)
    };
  }

  // Get power play data for cross-reference
  const ppData = allPlayers.filter(p => p.situation === '5on4');
  const ppMap = new Map();
  ppData.forEach(p => {
    ppMap.set(p.playerId, {
      ppPoints: p.I_F_points || 0,
      ppIceTime: p.icetime || 0
    });
  });

  // Calculate lens scores for each player
  const playersWithScores = top150.map(p => {
    const pp = ppMap.get(p.playerId) || { ppPoints: 0, ppIceTime: 0 };
    
    // Normalize individual metrics
    const normPoints = normalize(p.I_F_points || 0, ranges.points.min, ranges.points.max);
    const normGoals = normalize(p.I_F_goals || 0, ranges.goals.min, ranges.goals.max);
    const normShots = normalize(p.I_F_shots || 0, ranges.shots.min, ranges.shots.max);
    const normXGF = normalize(p.I_F_xGoals || 0, ranges.xGF.min, ranges.xGF.max);
    
    const normBlocks = normalize(p.shotsBlockedByPlayer || 0, ranges.blocks.min, ranges.blocks.max);
    const normHits = normalize(p.I_F_hits || 0, ranges.hits.min, ranges.hits.max);
    const normTakeaways = normalize(p.I_F_takeaways || 0, ranges.takeaways.min, ranges.takeaways.max);
    
    const pointsPerTOI = (p.I_F_points || 0) / ((p.icetime / 60) || 1);
    const shootingPct = (p.I_F_shots || 0) > 0 ? ((p.I_F_goals || 0) / (p.I_F_shots || 0)) * 100 : 0;
    const normEfficiency = normalize(pointsPerTOI, ranges.pointsPerTOI.min, ranges.pointsPerTOI.max);
    const normShootingPct = normalize(shootingPct, ranges.shootingPct.min, ranges.shootingPct.max);
    
    // Calculate lens scores
    const offenseScore = (normPoints * 0.4) + (normGoals * 0.3) + (normShots * 0.15) + (normXGF * 0.15);
    const defenseScore = (normBlocks * 0.5) + (normHits * 0.3) + (normTakeaways * 0.2);
    const specialTeamsScore = normalize(pp.ppPoints + (pp.ppIceTime / 60), 0, 
      Math.max(...top150.map(pl => {
        const ppd = ppMap.get(pl.playerId) || { ppPoints: 0, ppIceTime: 0 };
        return ppd.ppPoints + (ppd.ppIceTime / 60);
      }))
    );
    const efficiencyScore = (normEfficiency * 0.6) + (normShootingPct * 0.4);
    const overallScore = (offenseScore * 0.4) + (defenseScore * 0.3) + (specialTeamsScore * 0.2) + (efficiencyScore * 0.1);

    return {
      playerId: p.playerId,
      name: p.name,
      team: p.team,
      position: p.position,
      gamesPlayed: p.games_played,
      
      // Raw stats
      points: p.I_F_points || 0,
      goals: p.I_F_goals || 0,
      assists: p.I_F_primaryAssists + p.I_F_secondaryAssists || 0,
      shots: p.I_F_shots || 0,
      blocks: p.shotsBlockedByPlayer || 0,
      hits: p.I_F_hits || 0,
      takeaways: p.I_F_takeaways || 0,
      ppPoints: pp.ppPoints,
      icetime: p.icetime,
      
      // Lens scores (0-100)
      offenseScore: Math.round(offenseScore),
      defenseScore: Math.round(defenseScore),
      specialTeamsScore: Math.round(specialTeamsScore),
      efficiencyScore: Math.round(efficiencyScore),
      overallScore: Math.round(overallScore)
    };
  });

  console.log(`🔥 Thermal Hexmap: Processed ${playersWithScores.length} elite players`);
  console.log(`📊 Sample scores:`, playersWithScores.slice(0, 3).map(p => ({
    name: p.name,
    offense: p.offenseScore,
    defense: p.defenseScore,
    overall: p.overallScore
  })));

  return playersWithScores;
}

