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
  
  const awayTeamName = awayTeam.names?.short || awayTeam.names?.full || '';
  const homeTeamName = homeTeam.names?.short || homeTeam.names?.full || '';
  const awayScore = parseInt(awayTeam.score) || 0;
  const homeScore = parseInt(homeTeam.score) || 0;
  const status = gameData.gameState;
  
  // VERIFICATION LOGGING: Confirm score mapping is correct
  if (status === 'final' || status === 'live') {
    console.log(`✅ NCAA Score: ${awayTeamName} (away) ${awayScore} @ ${homeTeamName} (home) ${homeScore} [${status}]`);
  }
  
  return {
    id: gameData.gameID || game.id,
    status: status, // 'pre', 'live', 'final'
    startTime: gameData.startTime,
    startTimeEpoch: gameData.startTimeEpoch,
    
    // Teams
    awayTeam: awayTeamName,
    awayTeamFull: awayTeam.names?.full || '',
    awayScore: awayScore,
    awayRank: awayTeam.rank || null,
    
    homeTeam: homeTeamName,
    homeTeamFull: homeTeam.names?.full || '',
    homeScore: homeScore,
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
  
  // Strategy 1: Use CSV mappings (most reliable)
  if (ourAwayMapping && ourHomeMapping && ourAwayMapping.ncaa_name && ourHomeMapping.ncaa_name) {
    const expectedAwayNCAA = ourAwayMapping.ncaa_name;
    const expectedHomeNCAA = ourHomeMapping.ncaa_name;
    
    // Check if teams match (try both normal and reversed)
    const normalMatch = 
      teamNamesMatch(ncaaGame.awayTeam, expectedAwayNCAA) &&
      teamNamesMatch(ncaaGame.homeTeam, expectedHomeNCAA);
    
    const reversedMatch = 
      teamNamesMatch(ncaaGame.awayTeam, expectedHomeNCAA) &&
      teamNamesMatch(ncaaGame.homeTeam, expectedAwayNCAA);
    
    if (normalMatch || reversedMatch) {
      return true;
    }
  }
  
  // Strategy 2: Direct fuzzy matching as fallback (for teams not in CSV or missing ncaa_name)
  const directNormalMatch = 
    teamNamesMatch(ncaaGame.awayTeam, ourGame.awayTeam) &&
    teamNamesMatch(ncaaGame.homeTeam, ourGame.homeTeam);
  
  const directReversedMatch = 
    teamNamesMatch(ncaaGame.awayTeam, ourGame.homeTeam) &&
    teamNamesMatch(ncaaGame.homeTeam, ourGame.awayTeam);
  
  if (directNormalMatch || directReversedMatch) {
    console.log(`✅ Fuzzy matched: ${ourGame.awayTeam} @ ${ourGame.homeTeam} ↔ ${ncaaGame.awayTeam} @ ${ncaaGame.homeTeam}`);
    return true;
  }
  
  return false;
}

/**
 * Check if two team names match (fuzzy)
 * @param {string} name1 
 * @param {string} name2 
 * @returns {boolean}
 */
function teamNamesMatch(name1, name2) {
  if (!name1 || !name2) return false;
  
  const normalize = (str) => {
    let normalized = str
      .toLowerCase()
      .trim()
      // Common NCAA abbreviations
      .replace(/\butsa\b/g, 'texassanantonio')
      .replace(/\butep\b/g, 'texaselpaso')
      .replace(/\butrgv\b/g, 'texasriograndevalley')
      .replace(/\bole miss\b/g, 'mississippi')
      .replace(/\bcal baptist\b/g, 'californiabaptist')
      .replace(/\bcal poly\b/g, 'californiapoly')
      .replace(/\buc\b/g, 'california')
      .replace(/\bucsb\b/g, 'californiasantabarbara')
      .replace(/\bucsd\b/g, 'californiasandiego')
      .replace(/\buci\b/g, 'californiairvine')
      .replace(/\bucd\b/g, 'californiadavis')
      .replace(/\bucr\b/g, 'californiariverside')
      .replace(/\bfiu\b/g, 'floridainternational')
      .replace(/\bfau\b/g, 'floridaatlantic')
      .replace(/\bfgcu\b/g, 'floridagulfcoast')
      .replace(/\bliu\b/g, 'longisland')
      .replace(/\bsmu\b/g, 'southernmethodist')
      .replace(/\btcu\b/g, 'texaschristian')
      .replace(/\buab\b/g, 'alabamabirmingham')
      .replace(/\bumbc\b/g, 'marylandbaltimore')
      .replace(/\bvmi\b/g, 'virginiamelitaryinstitute')
      .replace(/\bniu\b/g, 'northernillinois')
      .replace(/\bunlv\b/g, 'nevadaelasvegas')
      // State abbreviations
      .replace(/\bst\b/g, 'st')
      .replace(/\bstate\b/g, 'st')
      .replace(/\bsaint\b/g, 'st')
      // Remove common words
      .replace(/\buniversity\b/g, '')
      .replace(/\bcollege\b/g, '')
      .replace(/\bof\b/g, '')
      .replace(/\bthe\b/g, '')
      // Clean up
      .replace(/[^a-z0-9]/g, '');
    
    return normalized;
  };
  
  const norm1 = normalize(name1);
  const norm2 = normalize(name2);
  
  // Exact match
  if (norm1 === norm2) return true;
  
  // One contains the other (for cases like "North Carolina" vs "UNC")
  if (norm1.length >= 4 && norm2.length >= 4) {
    if (norm1.includes(norm2) || norm2.includes(norm1)) return true;
  }
  
  return false;
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
  
  console.log(`🔍 Matching ${ourGames.length} our games against ${ncaaGames.length} NCAA games`);
  
  // Log first few NCAA games for debugging
  if (ncaaGames.length > 0) {
    console.log('📋 Sample NCAA games:', ncaaGames.slice(0, 3).map(g => 
      `${g.awayTeam} @ ${g.homeTeam} (${g.status})`
    ));
  }
  
  const enrichedGames = ourGames.map(ourGame => {
    // Find matching NCAA game
    const ncaaGame = ncaaGames.find(ng => matchGames(ng, ourGame, teamMappings));
    
    if (ncaaGame) {
      console.log(`✅ Match: ${ourGame.awayTeam} @ ${ourGame.homeTeam} → ${ncaaGame.awayScore}-${ncaaGame.homeScore} (${ncaaGame.status})`);
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
    } else {
      console.log(`❌ No match: ${ourGame.awayTeam} @ ${ourGame.homeTeam}`);
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

