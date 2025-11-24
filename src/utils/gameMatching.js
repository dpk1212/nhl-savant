/**
 * Game Matching Algorithm
 * Matches games across OddsTrader, Haslametrics, and D-Ratings
 * 
 * Uses normalized team names and time windows for matching
 */

import { isSameTeam, normalizeTeamName } from './teamNameNormalizer.js';

/**
 * Match games from all three sources
 * @param {array} oddsGames - Parsed odds from OddsTrader
 * @param {object} haslametricsTeams - Team database from Haslametrics
 * @param {array} dratePredictions - Predictions from D-Ratings
 * @returns {array} - Matched games with all data
 */
export function matchGames(oddsGames, haslametricsTeams, dratePredictions) {
  const matchedGames = [];
  
  console.log('\n🔗 Matching games across sources...');
  console.log(`   - OddsTrader games: ${oddsGames.length}`);
  console.log(`   - Haslametrics teams: ${Object.keys(haslametricsTeams).length}`);
  console.log(`   - D-Ratings predictions: ${dratePredictions.length}`);
  
  // Iterate through odds games (our base)
  for (const oddsGame of oddsGames) {
    const awayNorm = oddsGame.awayTeam;
    const homeNorm = oddsGame.homeTeam;
    
    // Find matching D-Ratings prediction
    const dratePred = dratePredictions.find(pred =>
      isSameTeam(pred.awayTeam, awayNorm) && 
      isSameTeam(pred.homeTeam, homeNorm)
    );
    
    // Find matching Haslametrics data
    const awayHasla = haslametricsTeams[awayNorm];
    const homeHasla = haslametricsTeams[homeNorm];
    
    // Track which sources we have data from
    const sources = ['odds'];
    if (dratePred) sources.push('dratings');
    if (awayHasla && homeHasla) sources.push('haslametrics');
    
    // Only include games where we have at least odds + one prediction source
    if (sources.length >= 2) {
      matchedGames.push({
        // Teams
        awayTeam: awayNorm,
        homeTeam: homeNorm,
        matchup: `${awayNorm} @ ${homeNorm}`,
        
        // Odds data
        odds: {
          awayOdds: oddsGame.awayOdds,
          homeOdds: oddsGame.homeOdds,
          awayProb: oddsToProb(oddsGame.awayOdds),
          homeProb: oddsToProb(oddsGame.homeOdds),
          gameTime: oddsGame.gameTime
        },
        
        // D-Ratings data (60% weight)
        dratings: dratePred ? {
          awayWinProb: dratePred.awayWinProb,
          homeWinProb: dratePred.homeWinProb,
          awayScore: dratePred.awayScore,
          homeScore: dratePred.homeScore,
          spread: dratePred.spread
        } : null,
        
        // Haslametrics data (40% weight)
        haslametrics: {
          awayOffEff: awayHasla?.offensiveEff || null,
          homeOffEff: homeHasla?.offensiveEff || null
        },
        
        // Metadata
        sources: sources,
        dataQuality: calculateDataQuality(sources),
        timestamp: new Date().toISOString()
      });
    }
  }
  
  console.log(`✅ Matched ${matchedGames.length} games with sufficient data`);
  console.log(`   - Full data (3 sources): ${matchedGames.filter(g => g.sources.length === 3).length}`);
  console.log(`   - Partial data (2 sources): ${matchedGames.filter(g => g.sources.length === 2).length}`);
  
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
 * Calculate data quality score based on available sources
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
    missing: ['odds', 'dratings', 'haslametrics'].filter(s => !game.sources.includes(s))
  }));
}

