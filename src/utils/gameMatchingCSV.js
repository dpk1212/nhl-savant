/**
 * CSV-Based Game Matching Algorithm
 * Uses ODDSTRADER as the base (games with betting markets)
 * Maps to Haslametrics and D-Ratings using CSV team mappings
 */

import { loadTeamMappings, findTeamMapping, findDRatingsPrediction, findHaslametricsGame } from './teamCSVLoader.js';

/**
 * Match games using CSV-based team mappings - ODDSTRADER AS BASE
 * @param {array} oddsGames - Parsed odds from OddsTrader
 * @param {object} haslametricsData - { games: [], teams: {} } from Haslametrics
 * @param {array} dratePredictions - Predictions from D-Ratings
 * @param {object} barttorвikData - Barttorvik team stats keyed by team name
 * @param {string} csvContent - CSV content from basketball_teams.csv
 * @returns {array} - Matched games with all data
 */
export function matchGamesWithCSV(oddsGames, haslametricsData, dratePredictions, barttorвikData, csvContent) {
  const matchedGames = [];
  
  // Load CSV mappings
  const teamMappings = loadTeamMappings(csvContent);
  
  const haslaGames = haslametricsData.games || [];
  const haslaTeams = haslametricsData.teams || {};
  
  // Track unmapped teams for diagnostics
  const unmappedOddsTeams = new Set();
  const missingHaslaNames = new Set(); // Teams in CSV but missing haslametrics_name
  const missingDrateNames = new Set(); // Teams in CSV but missing dratings_name
  const missingNcaaNames = new Set(); // Teams in CSV but missing ncaa_name
  const unmatchedHaslaGames = new Set();
  const unmatchedDrateGames = new Set();
  
  let fullMatches = 0;
  let haslaOnly = 0;
  let drateOnly = 0;
  let noMatches = 0;
  
  // Use OddsTrader as BASE
  for (const oddsGame of oddsGames) {
    const awayTeam = oddsGame.awayTeam;
    const homeTeam = oddsGame.homeTeam;
    
    // Look up teams in CSV
    const awayMapping = findTeamMapping(teamMappings, awayTeam, 'oddstrader');
    const homeMapping = findTeamMapping(teamMappings, homeTeam, 'oddstrader');
    
    if (!awayMapping || !homeMapping) {
      if (!awayMapping) unmappedOddsTeams.add(awayTeam);
      if (!homeMapping) unmappedOddsTeams.add(homeTeam);
      noMatches++;
      continue;
    }
    
    // Find in Haslametrics using CSV mapping
    let haslaGame = null;
    if (awayMapping.haslametrics && homeMapping.haslametrics) {
      haslaGame = findHaslametricsGame(
        haslaGames,
        awayMapping.haslametrics,
        homeMapping.haslametrics
      );
      
      // Try reversed if not found
      if (!haslaGame) {
        haslaGame = findHaslametricsGame(
          haslaGames,
          homeMapping.haslametrics,
          awayMapping.haslametrics
        );
        if (haslaGame) {
          // Reverse the data to match our base
          haslaGame = {
            ...haslaGame,
            awayTeam: awayMapping.haslametrics,
            homeTeam: homeMapping.haslametrics,
            awayRating: haslaGame.homeRating,
            homeRating: haslaGame.awayRating,
            awayRank: haslaGame.homeRank,
            homeRank: haslaGame.awayRank,
            _reversed: true
          };
        }
      }
      
      // Track if not found
      if (!haslaGame) {
        unmatchedHaslaGames.add(`${awayTeam} @ ${homeTeam}`);
      }
    } else {
      // Track teams missing Haslametrics names in CSV
      if (!awayMapping.haslametrics) missingHaslaNames.add(awayTeam);
      if (!homeMapping.haslametrics) missingHaslaNames.add(homeTeam);
    }
    
    // Find in D-Ratings using CSV mapping
    let dratePred = null;
    if (awayMapping.dratings && homeMapping.dratings) {
      dratePred = findDRatingsPrediction(
        dratePredictions,
        awayMapping.dratings,
        homeMapping.dratings
      );
      
      // Try reversed if not found
      if (!dratePred) {
        dratePred = findDRatingsPrediction(
          dratePredictions,
          homeMapping.dratings,
          awayMapping.dratings
        );
        if (dratePred) {
          // Reverse the data to match our base
          dratePred = {
            ...dratePred,
            awayTeam: awayMapping.dratings,
            homeTeam: homeMapping.dratings,
            awayWinProb: dratePred.homeWinProb,
            homeWinProb: dratePred.awayWinProb,
            awayScore: dratePred.homeScore,
            homeScore: dratePred.awayScore,
            _reversed: true
          };
        }
      }
      
      // Track if not found
      if (!dratePred) {
        unmatchedDrateGames.add(`${awayTeam} @ ${homeTeam}`);
      }
    } else {
      // Track teams missing D-Ratings names in CSV
      if (!awayMapping.dratings) missingDrateNames.add(awayTeam);
      if (!homeMapping.dratings) missingDrateNames.add(homeTeam);
    }
    
    // Track teams missing NCAA names in CSV
    if (!awayMapping.ncaa_name) missingNcaaNames.add(awayTeam);
    if (!homeMapping.ncaa_name) missingNcaaNames.add(homeTeam);
    
    // Find in Barttorvik using CSV mapping
    let awayBartt = null;
    let homeBartt = null;
    if (awayMapping.barttorvik && homeMapping.barttorvik) {
      awayBartt = barttorвikData[awayMapping.barttorvik];
      homeBartt = barttorвikData[homeMapping.barttorvik];
    }
    
    // Track data sources
    const sources = ['odds']; // Always have odds (it's our base)
    if (haslaGame) sources.push('haslametrics');
    if (dratePred) sources.push('dratings');
    
    // Count matches
    if (haslaGame && dratePred) fullMatches++;
    else if (haslaGame) haslaOnly++;
    else if (dratePred) drateOnly++;
    else noMatches++;
    
    // Get team ratings from Haslametrics (use Haslametrics name, not normalized!)
    const awayTeamData = haslaTeams[awayMapping.haslametrics];
    const homeTeamData = haslaTeams[homeMapping.haslametrics];
    
    // Build matched game object
    const matchedGame = {
      // Teams (using OddsTrader names as canonical)
      awayTeam: awayTeam,
      homeTeam: homeTeam,
      matchup: `${awayTeam} @ ${homeTeam}`,
      
      // Haslametrics data (40% weight in ensemble)
      haslametrics: haslaGame ? {
        gameTime: haslaGame.gameTime,
        awayRating: haslaGame.awayRating,  // This IS the predicted score
        homeRating: haslaGame.homeRating,  // This IS the predicted score
        awayRank: haslaGame.awayRank,
        homeRank: haslaGame.homeRank,
        awayOffEff: awayTeamData?.offensiveEff || null,
        homeOffEff: homeTeamData?.offensiveEff || null,
        awayScore: haslaGame.awayRating,  // Alias rating as score
        homeScore: haslaGame.homeRating   // Alias rating as score
      } : null,
      
      // D-Ratings data (60% weight - PRIMARY)
      dratings: dratePred ? {
        awayWinProb: dratePred.awayWinProb,
        homeWinProb: dratePred.homeWinProb,
        awayScore: dratePred.awayScore,
        homeScore: dratePred.homeScore,
        gameTime: dratePred.gameTime
      } : null,
      
      // Barttorvik advanced stats
      barttorvik: (awayBartt && homeBartt) ? {
        away: {
          rank: awayBartt.rank,
          adjOff: awayBartt.adjOff,
          adjOff_rank: awayBartt.adjOff_rank,
          adjDef: awayBartt.adjDef,
          adjDef_rank: awayBartt.adjDef_rank,
          eFG_off: awayBartt.eFG_off,
          eFG_def: awayBartt.eFG_def,
          to_off: awayBartt.to_off,
          to_def: awayBartt.to_def,
          oreb_off: awayBartt.oreb_off,
          oreb_def: awayBartt.oreb_def,
          twoP_off: awayBartt.twoP_off,
          twoP_def: awayBartt.twoP_def,
          threeP_off: awayBartt.threeP_off,
          threeP_def: awayBartt.threeP_def
        },
        home: {
          rank: homeBartt.rank,
          adjOff: homeBartt.adjOff,
          adjOff_rank: homeBartt.adjOff_rank,
          adjDef: homeBartt.adjDef,
          adjDef_rank: homeBartt.adjDef_rank,
          eFG_off: homeBartt.eFG_off,
          eFG_def: homeBartt.eFG_def,
          to_off: homeBartt.to_off,
          to_def: homeBartt.to_def,
          oreb_off: homeBartt.oreb_off,
          oreb_def: homeBartt.oreb_def,
          twoP_off: homeBartt.twoP_off,
          twoP_def: homeBartt.twoP_def,
          threeP_off: homeBartt.threeP_off,
          threeP_def: homeBartt.threeP_def
        },
        matchup: {
          rankAdvantage: awayBartt.rank < homeBartt.rank ? 'away' : 'home',
          rankDiff: Math.abs(awayBartt.rank - homeBartt.rank),
          offAdvantage: awayBartt.adjOff > homeBartt.adjOff ? 'away' : 'home',
          offDiff: Math.abs(awayBartt.adjOff - homeBartt.adjOff).toFixed(1),
          defAdvantage: awayBartt.adjDef < homeBartt.adjDef ? 'away' : 'home',
          awayOffVsHomeDef: (awayBartt.eFG_off - homeBartt.eFG_def).toFixed(1),
          homeOffVsAwayDef: (homeBartt.eFG_off - awayBartt.eFG_def).toFixed(1)
        }
      } : null,
      
      // Odds data (for edge calculation)
      odds: {
        awayOdds: oddsGame.awayOdds,
        homeOdds: oddsGame.homeOdds,
        awayProb: oddsToProb(oddsGame.awayOdds),
        homeProb: oddsToProb(oddsGame.homeOdds),
        // PRIORITIZE Haslametrics time (more reliable format), fallback to OddsTrader
        gameTime: haslaGame?.gameTime || oddsGame.gameTime || 'TBD'
      },
      
      // Metadata
      sources: sources,
      dataQuality: calculateDataQuality(sources),
      csvMappings: {
        away: awayMapping.normalized,
        home: homeMapping.normalized
      },
      timestamp: new Date().toISOString()
    };
    
    matchedGames.push(matchedGame);
  }
  
  // All logging removed for security - prevents users from discovering data sources
  
  return matchedGames;
}

/**
 * Convert moneyline odds to probability
 * @param {number} odds - Moneyline odds
 * @returns {number} - Probability (0-1)
 */
function oddsToProb(odds) {
  if (!odds) return null;
  
  if (odds > 0) {
    return 100 / (odds + 100);
  } else {
    return Math.abs(odds) / (Math.abs(odds) + 100);
  }
}

/**
 * Calculate data quality score
 * @param {array} sources - Array of source names
 * @returns {string} - Quality rating
 */
function calculateDataQuality(sources) {
  if (sources.length === 3) return 'HIGH';
  if (sources.length === 2) return 'MEDIUM';
  return 'LOW';
}

/**
 * Filter games by data quality
 * @param {array} games - Matched games
 * @param {string} minQuality - Minimum quality ('HIGH', 'MEDIUM', 'LOW')
 * @returns {array} - Filtered games
 */
export function filterByQuality(games, minQuality = 'MEDIUM') {
  const qualityLevels = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
  const minLevel = qualityLevels[minQuality] || 2;
  
  return games.filter(game => 
    qualityLevels[game.dataQuality] >= minLevel
  );
}

