/**
 * NCAA API Integration
 * Fetches live scores and game data via Firebase Cloud Function proxy (avoids CORS)
 */

// Use Firebase Cloud Function proxy to avoid CORS
// v2 functions use Cloud Run URLs
const NCAA_PROXY_URL = 'https://ncaaproxy-lviwud3q2q-uc.a.run.app';

/**
 * Fetch today's D1 Men's Basketball games
 * @param {string} date - YYYYMMDD format (e.g., '20231125')
 * @returns {Promise<Array>} - Array of game objects
 */
export async function fetchTodaysGames(date = null) {
  if (!date) {
    // Format today's date as YYYYMMDD
    const today = new Date();
    date = today.toISOString().split('T')[0].replace(/-/g, '');
  }
  
  try {
    // Use Firebase Cloud Function proxy to avoid CORS
    const response = await fetch(`${NCAA_PROXY_URL}?date=${date}`);
    
    if (!response.ok) {
      throw new Error(`NCAA Proxy error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Parse the games from the response
    const games = data.games || [];
    
    console.log(`📊 NCAA API (via proxy): Fetched ${games.length} games for ${date}`);
    
    return games.map(game => parseNCAAgame(game));
  } catch (error) {
    console.error('Error fetching NCAA games:', error);
    return [];
  }
}

/**
 * Parse NCAA game object to our format
 * @param {object} game - Raw NCAA API game object (wrapper with game.game nested structure)
 * @returns {object} - Parsed game object
 */
function parseNCAAgame(game) {
  // NCAA API returns nested structure: { game: { home: {...}, away: {...}, ... } }
  const gameData = game.game || {};
  const homeTeam = gameData.home || {};
  const awayTeam = gameData.away || {};
  
  return {
    id: gameData.gameID || game.id,
    status: gameData.gameState, // 'pre', 'live', 'final'
    startTime: gameData.startTime,
    startTimeEpoch: gameData.startTimeEpoch,
    
    // Teams
    awayTeam: awayTeam.names?.short || awayTeam.names?.full || '',
    awayTeamFull: awayTeam.names?.full || '',
    awayScore: parseInt(awayTeam.score) || 0,
    awayRank: awayTeam.rank || null,
    
    homeTeam: homeTeam.names?.short || homeTeam.names?.full || '',
    homeTeamFull: homeTeam.names?.full || '',
    homeScore: parseInt(homeTeam.score) || 0,
    homeRank: homeTeam.rank || null,
    
    // Game state
    period: gameData.currentPeriod || null,
    clock: gameData.contestClock || null,
    
    // TV/Network
    network: gameData.network || null,
    
    // Metadata
    venue: gameData.venue || null,
    neutral: gameData.neutralSite || false,
    
    // Raw data (for debugging)
    _raw: game
  };
}

/**
 * Match NCAA game to our prediction game
 * @param {object} ncaaGame - NCAA API game
 * @param {object} ourGame - Our prediction game
 * @param {Map} teamMappings - CSV team mappings with ncaa_name column
 * @returns {boolean} - True if games match
 */
export function matchGames(ncaaGame, ourGame, teamMappings) {
  // Try to find mappings for our teams
  const ourAwayMapping = findTeamInMappings(teamMappings, ourGame.awayTeam, 'oddstrader');
  const ourHomeMapping = findTeamInMappings(teamMappings, ourGame.homeTeam, 'oddstrader');
  
  if (!ourAwayMapping || !ourHomeMapping) {
    return false;
  }
  
  // Get NCAA names from mappings
  const expectedAwayNCAA = ourAwayMapping.ncaa_name;
  const expectedHomeNCAA = ourHomeMapping.ncaa_name;
  
  if (!expectedAwayNCAA || !expectedHomeNCAA) {
    return false;
  }
  
  // Check if teams match (try both normal and reversed)
  const normalMatch = 
    teamNamesMatch(ncaaGame.awayTeam, expectedAwayNCAA) &&
    teamNamesMatch(ncaaGame.homeTeam, expectedHomeNCAA);
  
  const reversedMatch = 
    teamNamesMatch(ncaaGame.awayTeam, expectedHomeNCAA) &&
    teamNamesMatch(ncaaGame.homeTeam, expectedAwayNCAA);
  
  return normalMatch || reversedMatch;
}

/**
 * Check if two team names match (fuzzy)
 * @param {string} name1 
 * @param {string} name2 
 * @returns {boolean}
 */
function teamNamesMatch(name1, name2) {
  if (!name1 || !name2) return false;
  
  const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return normalize(name1) === normalize(name2);
}

/**
 * Find team in mappings by source column
 * @param {Map} mappings 
 * @param {string} teamName 
 * @param {string} source 
 * @returns {object|null}
 */
function findTeamInMappings(mappings, teamName, source) {
  const searchName = teamName.toLowerCase().trim();
  
  for (const [normalized, mapping] of mappings) {
    const sourceValue = mapping[source];
    if (sourceValue && sourceValue.toLowerCase() === searchName) {
      return mapping;
    }
  }
  
  return null;
}

/**
 * Get live scores for our games
 * @param {Array} ourGames - Our prediction games
 * @param {Map} teamMappings - CSV team mappings
 * @returns {Promise<Array>} - Our games enriched with live scores
 */
export async function getLiveScores(ourGames, teamMappings) {
  const ncaaGames = await fetchTodaysGames();
  
  const enrichedGames = ourGames.map(ourGame => {
    // Find matching NCAA game
    const ncaaGame = ncaaGames.find(ng => matchGames(ng, ourGame, teamMappings));
    
    if (ncaaGame) {
      return {
        ...ourGame,
        liveScore: {
          status: ncaaGame.status,
          awayScore: ncaaGame.awayScore,
          homeScore: ncaaGame.homeScore,
          period: ncaaGame.period,
          clock: ncaaGame.clock,
          network: ncaaGame.network,
          lastUpdated: new Date().toISOString()
        }
      };
    }
    
    return ourGame;
  });
  
  const matchedCount = enrichedGames.filter(g => g.liveScore).length;
  console.log(`🎯 Matched ${matchedCount}/${ourGames.length} games to NCAA API`);
  
  return enrichedGames;
}

/**
 * Start polling for live scores
 * @param {Array} games - Games to poll
 * @param {Map} teamMappings - Team mappings
 * @param {Function} callback - Called with updated games
 * @param {number} intervalMs - Polling interval (default 60s)
 * @returns {Function} - Cleanup function to stop polling
 */
export function startScorePolling(games, teamMappings, callback, intervalMs = 60000) {
  console.log(`🔄 Starting live score polling (every ${intervalMs / 1000}s)`);
  
  // Initial fetch
  getLiveScores(games, teamMappings).then(callback);
  
  // Set up interval
  const intervalId = setInterval(() => {
    getLiveScores(games, teamMappings).then(callback);
  }, intervalMs);
  
  // Return cleanup function
  return () => {
    console.log('⏹️  Stopping live score polling');
    clearInterval(intervalId);
  };
}

