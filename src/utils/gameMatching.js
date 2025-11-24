/**
 * Game Matching Algorithm  
 * Uses HASLAMETRICS as the base - it shows ALL games for the day
 * Then matches D-Ratings and OddsTrader to each Hasla game
 */

import { isSameTeam, normalizeTeamName } from './teamNameNormalizer.js';

/**
 * Match games from all three sources - HASLAMETRICS AS BASE
 * @param {array} oddsGames - Parsed odds from OddsTrader
 * @param {object} haslametricsData - { games: [], teams: {} } from Haslametrics
 * @param {array} dratePredictions - Predictions from D-Ratings
 * @returns {array} - Matched games with all data
 */
export function matchGames(oddsGames, haslametricsData, dratePredictions) {
  const matchedGames = [];
  
  // Extract games and teams from Haslametrics data
  const haslaGames = haslametricsData.games || [];
  const haslaTeams = haslametricsData.teams || {};
  
  console.log('\n🔗 Matching games across sources (Haslametrics as base)...');
  console.log(`   - Haslametrics games: ${haslaGames.length}`);
  console.log(`   - D-Ratings predictions: ${dratePredictions.length}`);
  console.log(`   - OddsTrader games: ${oddsGames.length}`);
  
  // Iterate through Haslametrics games (our base - shows ALL games)
  for (const haslaGame of haslaGames) {
    const awayNorm = haslaGame.awayTeam;
    const homeNorm = haslaGame.homeTeam;
    
    // Find matching D-Ratings prediction (check both home/away and reversed)
    let dratePred = dratePredictions.find(pred =>
      isSameTeam(pred.awayTeam, awayNorm) && 
      isSameTeam(pred.homeTeam, homeNorm)
    );
    
    // If not found, try reversed matchup
    if (!dratePred) {
      dratePred = dratePredictions.find(pred =>
        isSameTeam(pred.awayTeam, homeNorm) && 
        isSameTeam(pred.homeTeam, awayNorm)
      );
      if (dratePred) {
        // Flip the teams to match our base
        dratePred = {
          ...dratePred,
          awayTeam: awayNorm,
          homeTeam: homeNorm,
          awayWinProb: dratePred.homeWinProb,
          homeWinProb: dratePred.awayWinProb,
          awayScore: dratePred.homeScore,
          homeScore: dratePred.awayScore,
          matchup: `${awayNorm} @ ${homeNorm}`,
          _reversed: true
        };
      }
    }
    
    // Find matching OddsTrader odds (check both home/away and reversed)
    let oddsGame = oddsGames.find(odds =>
      isSameTeam(odds.awayTeam, awayNorm) && 
      isSameTeam(odds.homeTeam, homeNorm)
    );
    
    // If not found, try reversed matchup
    if (!oddsGame) {
      oddsGame = oddsGames.find(odds =>
        isSameTeam(odds.awayTeam, homeNorm) && 
        isSameTeam(odds.homeTeam, awayNorm)
      );
      if (oddsGame) {
        // Flip the odds to match our base
        oddsGame = {
          ...oddsGame,
          awayTeam: awayNorm,
          homeTeam: homeNorm,
          awayOdds: oddsGame.homeOdds,
          homeOdds: oddsGame.awayOdds,
          _reversed: true
        };
      }
    }
    
    // Get team efficiency ratings
    const awayTeamData = haslaTeams[awayNorm];
    const homeTeamData = haslaTeams[homeNorm];
    
    // Track which sources we have
    const sources = ['haslametrics']; // Always have Hasla (it's our base)
    if (dratePred) sources.push('dratings');
    if (oddsGame) sources.push('odds');
    
    // Build matched game object
    const matchedGame = {
      // Teams
      awayTeam: awayNorm,
      homeTeam: homeNorm,
      matchup: `${awayNorm} @ ${homeNorm}`,
      
      // Haslametrics data (BASE + 40% weight in ensemble)
      haslametrics: {
        gameTime: haslaGame.gameTime,
        awayRating: haslaGame.awayRating,
        homeRating: haslaGame.homeRating,
        awayRank: haslaGame.awayRank,
        homeRank: haslaGame.homeRank,
        awayOffEff: awayTeamData?.offensiveEff || null,
        homeOffEff: homeTeamData?.offensiveEff || null
      },
      
      // D-Ratings data (60% weight - PRIMARY)
      dratings: dratePred ? {
        awayWinProb: dratePred.awayWinProb,
        homeWinProb: dratePred.homeWinProb,
        awayScore: dratePred.awayScore,
        homeScore: dratePred.homeScore,
        gameTime: dratePred.gameTime
      } : null,
      
      // Odds data (for edge calculation)
      odds: oddsGame ? {
        awayOdds: oddsGame.awayOdds,
        homeOdds: oddsGame.homeOdds,
        awayProb: oddsToProb(oddsGame.awayOdds),
        homeProb: oddsToProb(oddsGame.homeOdds),
        gameTime: oddsGame.gameTime
      } : null,
      
      // Metadata
      sources: sources,
      dataQuality: calculateDataQuality(sources),
      timestamp: new Date().toISOString()
    };
    
    matchedGames.push(matchedGame);
  }
  
  console.log(`✅ Matched ${matchedGames.length} games`);
  console.log(`   - Full data (all 3 sources): ${matchedGames.filter(g => g.sources.length === 3).length}`);
  console.log(`   - With predictions (Hasla + DRatings): ${matchedGames.filter(g => g.sources.includes('dratings')).length}`);
  console.log(`   - With odds (Hasla + Odds): ${matchedGames.filter(g => g.sources.includes('odds')).length}`);
  console.log(`   - Hasla only: ${matchedGames.filter(g => g.sources.length === 1).length}`);
  
  // Log unmatched games for debugging
  const unmatchedInDRatings = dratePredictions.filter(pred => {
    return !haslaGames.some(hasla => 
      isSameTeam(hasla.awayTeam, pred.awayTeam) && 
      isSameTeam(hasla.homeTeam, pred.homeTeam)
    );
  });
  
  if (unmatchedInDRatings.length > 0) {
    console.warn(`⚠️  ${unmatchedInDRatings.length} D-Ratings games not found in Haslametrics:`);
    unmatchedInDRatings.slice(0, 5).forEach(pred => {
      console.warn(`     - ${pred.matchup}`);
    });
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

/**
 * Get games with missing data sources (for debugging)
 * @param {array} games - Matched games
 * @returns {array} - Games with incomplete data
 */
export function getIncompleteGames(games) {
  return games.filter(game => game.sources.length < 3).map(game => ({
    matchup: game.matchup,
    sources: game.sources,
    missing: ['haslametrics', 'dratings', 'odds'].filter(s => !game.sources.includes(s))
  }));
}

