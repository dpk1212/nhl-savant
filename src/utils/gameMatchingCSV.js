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
 * @param {string} csvContent - CSV content from basketball_teams.csv
 * @returns {array} - Matched games with all data
 */
export function matchGamesWithCSV(oddsGames, haslametricsData, dratePredictions, csvContent) {
  const matchedGames = [];
  
  // Load CSV mappings
  const teamMappings = loadTeamMappings(csvContent);
  console.log(`\n📋 Loaded ${teamMappings.size} team mappings from CSV`);
  
  const haslaGames = haslametricsData.games || [];
  const haslaTeams = haslametricsData.teams || {};
  
  console.log('\n🔗 Matching games (OddsTrader as base, CSV mappings)...');
  console.log(`   - OddsTrader games: ${oddsGames.length}`);
  console.log(`   - Haslametrics games: ${haslaGames.length}`);
  console.log(`   - D-Ratings predictions: ${dratePredictions.length}`);
  
  // Track unmapped teams for diagnostics
  const unmappedOddsTeams = new Set();
  const unmatchedHaslaGames = new Set();
  const unmatchedDrateGames = new Set();
  
  // DIAGNOSTIC: Show all OddsTrader team names (normalized)
  console.log('\n📊 ALL ODDSTRADER TEAMS (normalized):');
  console.log('=====================================');
  const oddsTeamNames = new Set();
  oddsGames.forEach(g => {
    oddsTeamNames.add(g.awayTeam);
    oddsTeamNames.add(g.homeTeam);
  });
  Array.from(oddsTeamNames).sort().forEach(team => {
    console.log(`   - "${team}"`);
  });
  
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
      console.warn(`⚠️  No CSV mapping for: ${awayTeam} @ ${homeTeam}`);
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
      
      // Track if not found - WITH DETAILED LOGGING
      if (!haslaGame) {
        unmatchedHaslaGames.add(`${awayMapping.haslametrics} @ ${homeMapping.haslametrics}`);
        console.log(`   ❌ Haslametrics: CSV says "${awayMapping.haslametrics} @ ${homeMapping.haslametrics}" but NO GAME FOUND in today's data`);
        console.log(`      This game is NOT in Haslametrics today (legitimately not covered)`);
      }
    } else {
      if (!awayMapping.haslametrics && !homeMapping.haslametrics) {
        console.log(`   ⚠️  ${awayTeam} @ ${homeTeam}: CSV has NO haslametrics_name for either team`);
      } else if (!awayMapping.haslametrics) {
        console.log(`   ⚠️  ${awayTeam}: CSV has NO haslametrics_name (needs to be added)`);
      } else if (!homeMapping.haslametrics) {
        console.log(`   ⚠️  ${homeTeam}: CSV has NO haslametrics_name (needs to be added)`);
      }
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
        unmatchedDrateGames.add(`${awayMapping.dratings} @ ${homeMapping.dratings}`);
      }
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
    
    // Get team ratings from Haslametrics
    const awayTeamData = haslaTeams[awayMapping.normalized];
    const homeTeamData = haslaTeams[homeMapping.normalized];
    
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
  
  console.log(`\n✅ Matched ${matchedGames.length} games`);
  console.log(`   - Full data (all 3 sources): ${fullMatches} (${(fullMatches/oddsGames.length*100).toFixed(1)}%)`);
  console.log(`   - With Haslametrics only: ${haslaOnly}`);
  console.log(`   - With D-Ratings only: ${drateOnly}`);
  console.log(`   - No model data: ${noMatches}`);
  
  // DIAGNOSTIC: Show unmapped OddsTrader teams
  if (unmappedOddsTeams.size > 0) {
    console.log('\n❌ ODDSTRADER TEAMS WITH NO CSV MAPPING:');
    console.log('=====================================');
    Array.from(unmappedOddsTeams).sort().forEach(team => {
      console.log(`   - "${team}"`);
    });
  }
  
  // DIAGNOSTIC: Show all available Haslametrics teams
  console.log('\n📊 AVAILABLE HASLAMETRICS TEAMS (raw names):');
  console.log('=====================================');
  const haslaTeamNames = new Set();
  haslaGames.forEach(g => {
    haslaTeamNames.add(g.awayTeamRaw);
    haslaTeamNames.add(g.homeTeamRaw);
  });
  Array.from(haslaTeamNames).sort().forEach(team => {
    console.log(`   - "${team}"`);
  });
  
  // DIAGNOSTIC: Show all available D-Ratings teams
  console.log('\n📊 AVAILABLE D-RATINGS TEAMS (school names):');
  console.log('=====================================');
  const drateTeamNames = new Set();
  dratePredictions.forEach(p => {
    drateTeamNames.add(p.awayTeam);
    drateTeamNames.add(p.homeTeam);
  });
  Array.from(drateTeamNames).sort().forEach(team => {
    console.log(`   - "${team}"`);
  });
  
  // DIAGNOSTIC: Show unmatched Haslametrics games
  if (unmatchedHaslaGames.size > 0) {
    console.log('\n⚠️  HASLAMETRICS GAMES NOT MATCHED:');
    console.log('=====================================');
    Array.from(unmatchedHaslaGames).forEach(game => {
      console.log(`   - ${game}`);
    });
  }
  
  // DIAGNOSTIC: Show unmatched D-Ratings games
  if (unmatchedDrateGames.size > 0) {
    console.log('\n⚠️  D-RATINGS GAMES NOT MATCHED:');
    console.log('=====================================');
    Array.from(unmatchedDrateGames).forEach(game => {
      console.log(`   - ${game}`);
    });
  }
  
  // DETAILED MISSING DATA REPORT
  if (haslaOnly > 0 || drateOnly > 0 || noMatches > 0) {
    console.log('\n🔍 DETAILED MISSING DATA REPORT');
    console.log('=====================================');
    
    // Games with Haslametrics only (missing D-Ratings)
    if (haslaOnly > 0) {
      console.log(`\n⚠️  MISSING D-RATINGS (${haslaOnly} games):`);
      matchedGames
        .filter(g => g.haslametrics && !g.dratings)
        .forEach((g, i) => {
          console.log(`   ${i + 1}. ${g.matchup}`);
          console.log(`      ✅ Has Haslametrics`);
          console.log(`      ❌ Missing D-Ratings`);
        });
    }
    
    // Games with D-Ratings only (missing Haslametrics)
    if (drateOnly > 0) {
      console.log(`\n⚠️  MISSING HASLAMETRICS (${drateOnly} games):`);
      matchedGames
        .filter(g => !g.haslametrics && g.dratings)
        .forEach((g, i) => {
          console.log(`   ${i + 1}. ${g.matchup}`);
          console.log(`      ❌ Missing Haslametrics`);
          console.log(`      ✅ Has D-Ratings`);
        });
    }
    
    // Games with no model data
    if (noMatches > 0) {
      console.log(`\n❌ NO MODEL DATA (${noMatches} games):`);
      matchedGames
        .filter(g => !g.haslametrics && !g.dratings)
        .forEach((g, i) => {
          console.log(`   ${i + 1}. ${g.matchup}`);
          console.log(`      ❌ Missing Haslametrics`);
          console.log(`      ❌ Missing D-Ratings`);
        });
    }
    
    console.log('\n=====================================\n');
  }
  
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

