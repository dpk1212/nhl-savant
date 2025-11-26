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
    // Format today's date as YYYYMMDD - USE LOCAL TIMEZONE!
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    date = `${year}${month}${day}`;
    
    console.log(`📅 Fetching NCAA games for LOCAL date: ${year}-${month}-${day}`);
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
  
  // ROBUSTNESS: Validate scores are valid numbers
  const rawAwayScore = awayTeam.score;
  const rawHomeScore = homeTeam.score;
  const awayScore = parseInt(rawAwayScore) || 0;
  const homeScore = parseInt(rawHomeScore) || 0;
  
  // Warn if scores look suspicious
  if (rawAwayScore !== undefined && isNaN(parseInt(rawAwayScore))) {
    console.warn(`⚠️ Invalid away score for ${awayTeamName}: "${rawAwayScore}"`);
  }
  if (rawHomeScore !== undefined && isNaN(parseInt(rawHomeScore))) {
    console.warn(`⚠️ Invalid home score for ${homeTeamName}: "${rawHomeScore}"`);
  }
  
  const status = gameData.gameState;
  
  // VERIFICATION LOGGING: Confirm score mapping is correct
  if (status === 'final' || status === 'live') {
    console.log(`✅ NCAA API SCORE MAPPING: ${awayTeamName} (AWAY) ${awayScore} @ ${homeTeamName} (HOME) ${homeScore} [${status}]`);
    console.log(`   Raw NCAA data: away.score="${rawAwayScore}" → awayScore=${awayScore}, home.score="${rawHomeScore}" → homeScore=${homeScore}`);
  }
  
  return {
    id: gameData.gameID || game.id,
    status: status, // 'pre', 'live', 'final'
    startTime: gameData.startTime,
    startTimeEpoch: gameData.startTimeEpoch,
    
    // Teams - VERIFIED: NCAA API structure
    awayTeam: awayTeamName,
    awayTeamFull: awayTeam.names?.full || '',
    awayScore: awayScore, // VERIFIED: from g.game.away.score
    awayRank: awayTeam.rank || null,
    
    homeTeam: homeTeamName,
    homeTeamFull: homeTeam.names?.full || '',
    homeScore: homeScore, // VERIFIED: from g.game.home.score
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
  // ROBUSTNESS: Validate inputs
  if (!ncaaGame || !ourGame) {
    console.error('❌ matchGames called with null game objects');
    return false;
  }
  
  if (!ncaaGame.awayTeam || !ncaaGame.homeTeam) {
    console.warn(`⚠️ NCAA game missing team names:`, ncaaGame);
    return false;
  }
  
  if (!ourGame.awayTeam || !ourGame.homeTeam) {
    console.warn(`⚠️ Our game missing team names:`, ourGame);
    return false;
  }
  
  // Try to find mappings for our teams
  const ourAwayMapping = findTeamInMappings(teamMappings, ourGame.awayTeam, 'oddstrader');
  const ourHomeMapping = findTeamInMappings(teamMappings, ourGame.homeTeam, 'oddstrader');
  
  // LOGGING: Show what we're trying to match
  console.log(`\n🔍 MATCHING: Our "${ourGame.awayTeam} @ ${ourGame.homeTeam}" vs NCAA "${ncaaGame.awayTeam} @ ${ncaaGame.homeTeam}"`);
  
  // Strategy 1: Use CSV mappings (most reliable)
  if (ourAwayMapping && ourHomeMapping && ourAwayMapping.ncaa_name && ourHomeMapping.ncaa_name) {
    const expectedAwayNCAA = ourAwayMapping.ncaa_name;
    const expectedHomeNCAA = ourHomeMapping.ncaa_name;
    
    console.log(`   CSV Mappings: Away="${expectedAwayNCAA}" Home="${expectedHomeNCAA}"`);
    
    // Check if teams match (try both normal and reversed)
    const normalMatch = 
      teamNamesMatch(ncaaGame.awayTeam, expectedAwayNCAA) &&
      teamNamesMatch(ncaaGame.homeTeam, expectedHomeNCAA);
    
    const reversedMatch = 
      teamNamesMatch(ncaaGame.awayTeam, expectedHomeNCAA) &&
      teamNamesMatch(ncaaGame.homeTeam, expectedAwayNCAA);
    
    if (normalMatch) {
      console.log(`   ✅ CSV MATCH (NORMAL): Scores: ${ncaaGame.awayTeam}(${ncaaGame.awayScore}) @ ${ncaaGame.homeTeam}(${ncaaGame.homeScore})`);
      return true;
    }
    
    if (reversedMatch) {
      console.warn(`   ⚠️ CSV MATCH (REVERSED): NCAA has home/away swapped!`);
      console.warn(`      NCAA: ${ncaaGame.awayTeam}(${ncaaGame.awayScore}) @ ${ncaaGame.homeTeam}(${ncaaGame.homeScore})`);
      console.warn(`      Our:  ${ourGame.awayTeam} @ ${ourGame.homeTeam}`);
      console.warn(`      THIS MAY CAUSE SCORE MAPPING ERRORS!`);
      return true;
    }
  } else {
    if (!ourAwayMapping) console.log(`   ⚠️ No CSV mapping for away team: "${ourGame.awayTeam}"`);
    if (!ourHomeMapping) console.log(`   ⚠️ No CSV mapping for home team: "${ourGame.homeTeam}"`);
    if (ourAwayMapping && !ourAwayMapping.ncaa_name) console.log(`   ⚠️ CSV mapping missing ncaa_name for: "${ourGame.awayTeam}"`);
    if (ourHomeMapping && !ourHomeMapping.ncaa_name) console.log(`   ⚠️ CSV mapping missing ncaa_name for: "${ourGame.homeTeam}"`);
  }
  
  // Strategy 2: Direct fuzzy matching as fallback (for teams not in CSV or missing ncaa_name)
  console.log(`   Trying fuzzy matching...`);
  const directNormalMatch = 
    teamNamesMatch(ncaaGame.awayTeam, ourGame.awayTeam) &&
    teamNamesMatch(ncaaGame.homeTeam, ourGame.homeTeam);
  
  const directReversedMatch = 
    teamNamesMatch(ncaaGame.awayTeam, ourGame.homeTeam) &&
    teamNamesMatch(ncaaGame.homeTeam, ourGame.awayTeam);
  
  if (directNormalMatch) {
    console.log(`   ✅ FUZZY MATCH (NORMAL): ${ourGame.awayTeam} @ ${ourGame.homeTeam} ↔ ${ncaaGame.awayTeam} @ ${ncaaGame.homeTeam}`);
    console.log(`      Scores: ${ncaaGame.awayTeam}(${ncaaGame.awayScore}) @ ${ncaaGame.homeTeam}(${ncaaGame.homeScore})`);
    return true;
  }
  
  if (directReversedMatch) {
    console.warn(`   ⚠️ FUZZY MATCH (REVERSED): Home/away swapped!`);
    console.warn(`      NCAA: ${ncaaGame.awayTeam}(${ncaaGame.awayScore}) @ ${ncaaGame.homeTeam}(${ncaaGame.homeScore})`);
    console.warn(`      Our:  ${ourGame.awayTeam} @ ${ourGame.homeTeam}`);
    console.warn(`      THIS MAY CAUSE SCORE MAPPING ERRORS!`);
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
      // Common NCAA abbreviations (EXPANDED)
      .replace(/\butsa\b/g, 'texassanantonio')
      .replace(/\butep\b/g, 'texaselpaso')
      .replace(/\butrgv\b/g, 'texasriograndevalley')
      .replace(/\bole miss\b/g, 'mississippi')
      .replace(/\bcal baptist\b/g, 'californiabaptist')
      .replace(/\bcal poly\b/g, 'californiapoly')
      .replace(/\buc san diego\b/g, 'californiasandiego')
      .replace(/\buc irvine\b/g, 'californiairvine')
      .replace(/\buc davis\b/g, 'californiadavis')
      .replace(/\buc riverside\b/g, 'californiariverside')
      .replace(/\buc santa barbara\b/g, 'californiasantabarbara')
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
      .replace(/\bn\.?c\.?\b/g, 'northcarolina')
      .replace(/\bunc\b/g, 'northcarolina')
      .replace(/\busc\b/g, 'southerncalifornia')
      .replace(/\blmu\b/g, 'loyolamarymount')
      .replace(/\buni\b/g, 'northerniowa')
      // State/Location abbreviations used by NCAA API
      .replace(/\bill\./g, 'illinois')
      .replace(/\bark\./g, 'arkansas')
      .replace(/\bmo\./g, 'missouri')
      .replace(/\bga\./g, 'georgia')
      .replace(/\bfla\./g, 'florida')
      .replace(/\bmich\./g, 'michigan')
      .replace(/\bmiss\./g, 'mississippi')
      .replace(/\btenn\./g, 'tennessee')
      .replace(/\bwash\./g, 'washington')
      .replace(/\bore\./g, 'oregon')
      .replace(/\bcolo\./g, 'colorado')
      .replace(/\bconn\./g, 'connecticut')
      // State variations
      .replace(/\bst\./g, 'st')
      .replace(/\bstate\b/g, 'st')
      .replace(/\bsaint\b/g, 'st')
      // Direction words (normalize)
      .replace(/\bnorthern\b/g, 'north')
      .replace(/\bsouthern\b/g, 'south')
      .replace(/\beastern\b/g, 'east')
      .replace(/\bwestern\b/g, 'west')
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
    // If game already has a FINAL score, KEEP IT! Don't lose completed games
    // This ensures games "STAY ALL DAY" even after NCAA API stops returning them
    if (ourGame.liveScore && ourGame.liveScore.status === 'final') {
      console.log(`🔒 PRESERVING FINAL SCORE (all-day persistence): ${ourGame.awayTeam} @ ${ourGame.homeTeam}`);
      console.log(`   Preserved scores: Away=${ourGame.liveScore.awayScore}, Home=${ourGame.liveScore.homeScore}`);
      return ourGame; // Preserve completed game even if NCAA API no longer has it
    }
    
    // Find matching NCAA game
    const ncaaGame = ncaaGames.find(ng => matchGames(ng, ourGame, teamMappings));
    
    if (ncaaGame) {
      // SCORE UPDATE VERIFICATION
      const oldAway = ourGame.liveScore?.awayScore || 'none';
      const oldHome = ourGame.liveScore?.homeScore || 'none';
      const newAway = ncaaGame.awayScore;
      const newHome = ncaaGame.homeScore;
      
      console.log(`✅ SCORE UPDATE: ${ourGame.awayTeam} @ ${ourGame.homeTeam}`);
      console.log(`   Status: ${ncaaGame.status}`);
      console.log(`   Away: ${oldAway} → ${newAway} (NCAA ${ncaaGame.awayTeam})`);
      console.log(`   Home: ${oldHome} → ${newHome} (NCAA ${ncaaGame.homeTeam})`);
      
      // ROBUSTNESS: Validate scores before updating
      if (typeof newAway !== 'number' || typeof newHome !== 'number') {
        console.error(`❌ Invalid scores! Away=${newAway} (${typeof newAway}), Home=${newHome} (${typeof newHome})`);
      }
      
      return {
        ...ourGame,
        liveScore: {
          status: ncaaGame.status,
          awayScore: ncaaGame.awayScore, // VERIFIED: Maps from NCAA away → our away
          homeScore: ncaaGame.homeScore, // VERIFIED: Maps from NCAA home → our home
          period: ncaaGame.period,
          clock: ncaaGame.clock,
          network: ncaaGame.network,
          lastUpdated: new Date().toISOString()
        }
      };
    } else {
      console.log(`❌ No NCAA match found: ${ourGame.awayTeam} @ ${ourGame.homeTeam}`);
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

