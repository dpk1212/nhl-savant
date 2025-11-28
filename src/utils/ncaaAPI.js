/**
 * ESPN API Integration (formerly NCAA API)
 * Fetches live scores from ESPN's public API
 * MIGRATED: Nov 28, 2025 - Switched from NCAA API (had reversed home/away) to ESPN API (accurate)
 */

// ESPN API - No CORS issues, no proxy needed!
const ESPN_API_URL = 'https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard';

/**
 * Fetch today's D1 Men's Basketball games from ESPN
 * @param {string} date - YYYYMMDD format (optional, defaults to today)
 * @returns {Promise<Array>} - Array of game objects
 */
export async function fetchTodaysGames(date = null) {
  try {
    // ESPN API doesn't need date parameter - always returns today's games
    const response = await fetch(ESPN_API_URL);
    
    if (!response.ok) {
      throw new Error(`ESPN API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Parse the games from ESPN's structure
    const games = data.events || [];
    
    return games.map(event => parseESPNgame(event));
  } catch (error) {
    console.error('Error fetching ESPN games:', error);
    return [];
  }
}

/**
 * Parse ESPN game object to our standard format
 * @param {object} event - Raw ESPN API event object
 * @returns {object} - Parsed game object
 */
function parseESPNgame(event) {
  const competition = event.competitions?.[0] || {};
  const competitors = competition.competitors || [];
  
  // Find home and away teams using explicit homeAway field (ESPN does this correctly!)
  const awayTeam = competitors.find(c => c.homeAway === 'away') || {};
  const homeTeam = competitors.find(c => c.homeAway === 'home') || {};
  
  const awayTeamName = awayTeam.team?.shortDisplayName || awayTeam.team?.displayName || '';
  const homeTeamName = homeTeam.team?.shortDisplayName || homeTeam.team?.displayName || '';
  
  // Parse scores
  const awayScore = parseInt(awayTeam.score) || 0;
  const homeScore = parseInt(homeTeam.score) || 0;
  
  // Parse status
  const status = competition.status || {};
  const statusType = status.type || {};
  let gameState = 'pre';
  
  // Map ESPN status to our format
  if (statusType.state === 'post' || statusType.completed) {
    gameState = 'final';
  } else if (statusType.state === 'in') {
    gameState = 'live';
  }
  
  return {
    id: event.id,
    status: gameState, // 'pre', 'live', 'final'
    startTime: event.date,
    startTimeEpoch: new Date(event.date).getTime() / 1000,
    
    // Teams
    awayTeam: awayTeamName,
    awayTeamFull: awayTeam.team?.displayName || '',
    awayScore: awayScore,
    awayRank: awayTeam.curatedRank?.current || null,
    
    homeTeam: homeTeamName,
    homeTeamFull: homeTeam.team?.displayName || '',
    homeScore: homeScore,
    homeRank: homeTeam.curatedRank?.current || null,
    
    // Game state
    period: status.period || null,
    clock: status.displayClock || null,
    
    // TV/Network
    network: competition.broadcasts?.[0]?.names?.[0] || null,
    
    // Metadata
    venue: competition.venue?.fullName || null,
    neutral: competition.neutralSite || false,
    
    // Raw data (for debugging)
    _raw: event
  };
}

/**
 * Match ESPN game to our prediction game
 * @param {object} espnGame - ESPN API game
 * @param {object} ourGame - Our prediction game
 * @param {Map} teamMappings - CSV team mappings with espn_name column
 * @returns {boolean} - True if games match
 */
export function matchGames(espnGame, ourGame, teamMappings) {
  // ROBUSTNESS: Validate inputs
  if (!espnGame || !ourGame) {
    console.error('❌ matchGames: Invalid game objects');
    return false;
  }
  
  if (!espnGame.awayTeam || !espnGame.homeTeam || !ourGame.awayTeam || !ourGame.homeTeam) {
    return false;
  }
  
  // Find CSV mappings for our teams
  const ourAwayMapping = findTeamInMappings(teamMappings, ourGame.awayTeam, 'oddstrader');
  const ourHomeMapping = findTeamInMappings(teamMappings, ourGame.homeTeam, 'oddstrader');
  
  // Check if teams are in CSV and have ESPN mappings
  if (!ourAwayMapping || !ourHomeMapping || !ourAwayMapping.espn_name || !ourHomeMapping.espn_name) {
    // Silent failure - only log CSV errors during development/audit
    return false;
  }
  
  // Use ONLY CSV mappings - no fuzzy matching!
  const expectedAwayESPN = ourAwayMapping.espn_name;
  const expectedHomeESPN = ourHomeMapping.espn_name;
  
  // Check if teams match (normal or reversed)
  const normalMatch = 
    teamNamesMatch(espnGame.awayTeam, expectedAwayESPN) &&
    teamNamesMatch(espnGame.homeTeam, expectedHomeESPN);
  
  const reversedMatch = 
    teamNamesMatch(espnGame.awayTeam, expectedHomeESPN) &&
    teamNamesMatch(espnGame.homeTeam, expectedAwayESPN);
  
  if (normalMatch || reversedMatch) {
    return true;
  }
  
  // No match - game not in ESPN API (this is OK for some games)
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
    return str
      .toLowerCase()
      .trim()
      // Remove common words
      .replace(/\buniversity\b/g, '')
      .replace(/\bcollege\b/g, '')
      .replace(/\bof\b/g, '')
      .replace(/\bthe\b/g, '')
      .replace(/\bstate\b/g, 'st')
      .replace(/\bsaint\b/g, 'st')
      .replace(/\bst\./g, 'st')
      // Clean up
      .replace(/[^a-z0-9]/g, '');
  };
  
  const norm1 = normalize(name1);
  const norm2 = normalize(name2);
  
  // Exact match
  if (norm1 === norm2) return true;
  
  // One contains the other (for cases like "UConn" vs "UConn Huskies")
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
  const espnGames = await fetchTodaysGames();
  
  let matchedCount = 0;
  let preservedCount = 0;
  const unmatchedGames = [];
  
  const enrichedGames = ourGames.map(ourGame => {
    // If game already has a FINAL score, KEEP IT! (all-day persistence)
    if (ourGame.liveScore && ourGame.liveScore.status === 'final') {
      preservedCount++;
      return ourGame;
    }
    
    // Find matching ESPN game using CSV mappings
    const espnGame = espnGames.find(eg => matchGames(eg, ourGame, teamMappings));
    
    if (espnGame) {
      matchedCount++;
      
      // ✅ PURE TEAM-TO-TEAM MAPPING (NO POSITION LOGIC)
      // Create a map: ESPN team name → score
      const espnTeamScores = new Map();
      espnTeamScores.set(espnGame.awayTeam.toLowerCase().trim(), espnGame.awayScore);
      espnTeamScores.set(espnGame.homeTeam.toLowerCase().trim(), espnGame.homeScore);
      
      // Get CSV mappings for OUR teams
      const ourAwayMapping = findTeamInMappings(teamMappings, ourGame.awayTeam, 'oddstrader');
      const ourHomeMapping = findTeamInMappings(teamMappings, ourGame.homeTeam, 'oddstrader');
      
      // 🔍 DIAGNOSTIC LOGGING
      console.log(`\n🏀 SCORE MAPPING: ${ourGame.awayTeam} @ ${ourGame.homeTeam}`);
      console.log(`   ESPN API: ${espnGame.awayTeam} (${espnGame.awayScore}) @ ${espnGame.homeTeam} (${espnGame.homeScore})`);
      console.log(`   Our Away (${ourGame.awayTeam}) → ESPN name: ${ourAwayMapping?.espn_name || 'MISSING'}`);
      console.log(`   Our Home (${ourGame.homeTeam}) → ESPN name: ${ourHomeMapping?.espn_name || 'MISSING'}`);
      
      // Extract scores for OUR teams by matching ESPN names from CSV
      let ourAwayScore = 0;
      let ourHomeScore = 0;
      
      // Match our away team to ESPN score
      if (ourAwayMapping && ourAwayMapping.espn_name) {
        const espnAwayName = ourAwayMapping.espn_name.toLowerCase().trim();
        for (const [espnTeam, score] of espnTeamScores) {
          if (teamNamesMatch(espnTeam, espnAwayName)) {
            ourAwayScore = score;
            console.log(`   ✅ Matched ${ourGame.awayTeam} to ESPN ${espnTeam} → score ${score}`);
            break;
          }
        }
      }
      
      // Match our home team to ESPN score
      if (ourHomeMapping && ourHomeMapping.espn_name) {
        const espnHomeName = ourHomeMapping.espn_name.toLowerCase().trim();
        for (const [espnTeam, score] of espnTeamScores) {
          if (teamNamesMatch(espnTeam, espnHomeName)) {
            ourHomeScore = score;
            console.log(`   ✅ Matched ${ourGame.homeTeam} to ESPN ${espnTeam} → score ${score}`);
            break;
          }
        }
      }
      
      console.log(`   📊 FINAL MAPPING: ${ourGame.awayTeam} ${ourAwayScore} - ${ourHomeScore} ${ourGame.homeTeam}`);
      
      return {
        ...ourGame,
        liveScore: {
          status: espnGame.status,
          awayScore: ourAwayScore,  // ✅ Direct team-to-score map
          homeScore: ourHomeScore,  // ✅ Direct team-to-score map
          period: espnGame.period,
          clock: espnGame.clock,
          network: espnGame.network,
          lastUpdated: new Date().toISOString()
        }
      };
    }
    
    // Track unmapped games
    unmatchedGames.push({
      away: ourGame.awayTeam,
      home: ourGame.homeTeam,
      awayMapping: findTeamInMappings(teamMappings, ourGame.awayTeam, 'oddstrader'),
      homeMapping: findTeamInMappings(teamMappings, ourGame.homeTeam, 'oddstrader')
    });
    
    return ourGame;
  });
  
  // Detailed ESPN API matching report
  const notMatched = ourGames.length - matchedCount - preservedCount;
  
  // Logging removed for security - prevents users from discovering API sources
  
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
  // Initial fetch
  getLiveScores(games, teamMappings).then(callback);
  
  // Set up interval
  const intervalId = setInterval(() => {
    getLiveScores(games, teamMappings).then(callback);
  }, intervalMs);
  
  // Return cleanup function
  return () => clearInterval(intervalId);
}
