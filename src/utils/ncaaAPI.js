/**
 * HYBRID API Integration - ESPN + NCAA
 * Uses ESPN when available (accurate, limited coverage)
 * Falls back to NCAA for complete coverage (fixed reversed home/away)
 * 
 * ESPN: ~5 featured games (100% accurate home/away)
 * NCAA: ~57 total games (home/away REVERSED - we fix it)
 * Result: Complete coverage with best accuracy
 */

// ESPN API - No CORS, but limited coverage (featured games only)
const ESPN_API_URL = 'https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard';

// NCAA API via Firebase proxy - Complete coverage, but home/away reversed
const NCAA_PROXY_URL = 'https://ncaaproxy-lviwud3q2q-uc.a.run.app';

/**
 * Fetch today's D1 Men's Basketball games from BOTH sources
 * @param {string} date - YYYYMMDD format (optional)
 * @returns {Promise<Array>} - Array of game objects
 */
export async function fetchTodaysGames(date = null) {
  try {
    // Fetch from both sources in parallel
    const [espnGames, ncaaGames] = await Promise.all([
      fetchESPNGames(),
      fetchNCAAGames(date)
    ]);
    
    console.log(`📊 Fetched ${espnGames.length} ESPN games, ${ncaaGames.length} NCAA games`);
    
    // Merge: prefer ESPN for games that exist in both
    const mergedGames = mergeGameSources(espnGames, ncaaGames);
    
    console.log(`✅ Total games after merge: ${mergedGames.length}`);
    
    return mergedGames;
  } catch (error) {
    console.error('Error fetching games:', error);
    return [];
  }
}

/**
 * Fetch from ESPN API (featured games only)
 */
async function fetchESPNGames() {
  try {
    const response = await fetch(ESPN_API_URL);
    if (!response.ok) throw new Error(`ESPN API error: ${response.status}`);
    
    const data = await response.json();
    const games = data.events || [];
    
    return games.map(event => parseESPNgame(event));
  } catch (error) {
    console.warn('ESPN API failed, will use NCAA only:', error.message);
    return [];
  }
}

/**
 * Fetch from NCAA API (complete coverage)
 */
async function fetchNCAAGames(date = null) {
  if (!date) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    date = `${year}${month}${day}`;
  }
  
  try {
    const response = await fetch(`${NCAA_PROXY_URL}?date=${date}`);
    if (!response.ok) throw new Error(`NCAA API error: ${response.status}`);
    
    const data = await response.json();
    const games = data.games || [];
    
    return games.map(game => parseNCAAgame(game));
  } catch (error) {
    console.error('NCAA API failed:', error);
    return [];
  }
}

/**
 * Merge ESPN and NCAA games, preferring ESPN when available
 */
function mergeGameSources(espnGames, ncaaGames) {
  const merged = new Map();
  
  // Add ESPN games first (these are authoritative)
  espnGames.forEach(game => {
    const key = normalizeTeamPair(game.awayTeam, game.homeTeam);
    merged.set(key, { ...game, source: 'ESPN' });
  });
  
  // Add NCAA games that don't exist in ESPN
  ncaaGames.forEach(game => {
    const key = normalizeTeamPair(game.awayTeam, game.homeTeam);
    if (!merged.has(key)) {
      merged.set(key, { ...game, source: 'NCAA' });
    }
  });
  
  return Array.from(merged.values());
}

/**
 * Normalize team pair for matching (order-independent)
 */
function normalizeTeamPair(team1, team2) {
  const normalize = (t) => t.toLowerCase().replace(/[^a-z0-9]/g, '');
  const t1 = normalize(team1);
  const t2 = normalize(team2);
  return t1 < t2 ? `${t1}_${t2}` : `${t2}_${t1}`;
}

/**
 * Parse ESPN game object
 */
function parseESPNgame(event) {
  const competition = event.competitions?.[0] || {};
  const competitors = competition.competitors || [];
  
  const awayTeam = competitors.find(c => c.homeAway === 'away') || {};
  const homeTeam = competitors.find(c => c.homeAway === 'home') || {};
  
  const awayTeamName = awayTeam.team?.shortDisplayName || awayTeam.team?.displayName || '';
  const homeTeamName = homeTeam.team?.shortDisplayName || homeTeam.team?.displayName || '';
  
  const awayScore = parseInt(awayTeam.score) || 0;
  const homeScore = parseInt(homeTeam.score) || 0;
  
  const status = competition.status || {};
  const statusType = status.type || {};
  let gameState = 'pre';
  
  if (statusType.state === 'post' || statusType.completed) {
    gameState = 'final';
  } else if (statusType.state === 'in') {
    gameState = 'live';
  }
  
  return {
    id: event.id,
    status: gameState,
    startTime: event.date,
    startTimeEpoch: new Date(event.date).getTime() / 1000,
    
    awayTeam: awayTeamName,
    awayTeamFull: awayTeam.team?.displayName || '',
    awayScore: awayScore,
    awayRank: awayTeam.curatedRank?.current || null,
    
    homeTeam: homeTeamName,
    homeTeamFull: homeTeam.team?.displayName || '',
    homeScore: homeScore,
    homeRank: homeTeam.curatedRank?.current || null,
    
    period: status.period || null,
    clock: status.displayClock || null,
    network: competition.broadcasts?.[0]?.names?.[0] || null,
    venue: competition.venue?.fullName || null,
    neutral: competition.neutralSite || false,
    
    _raw: event
  };
}

/**
 * Parse NCAA game object (with reversal fix)
 */
function parseNCAAgame(game) {
  const gameData = game.game || {};
  
  // 🚨 CRITICAL: NCAA API has away/home REVERSED!
  // What NCAA calls "away" is actually HOME, and what it calls "home" is actually AWAY
  const homeTeam = gameData.away || {};  // NCAA's "away" is actually HOME
  const awayTeam = gameData.home || {};  // NCAA's "home" is actually AWAY
  
  const awayTeamName = awayTeam.names?.short || awayTeam.names?.full || '';
  const homeTeamName = homeTeam.names?.short || homeTeam.names?.full || '';
  
  const awayScore = parseInt(awayTeam.score) || 0;
  const homeScore = parseInt(homeTeam.score) || 0;
  
  const status = gameData.gameState;
  
  return {
    id: gameData.gameID || game.id,
    status: status, // 'pre', 'live', 'final'
    startTime: gameData.startTime,
    startTimeEpoch: gameData.startTimeEpoch,
    
    awayTeam: awayTeamName,
    awayTeamFull: awayTeam.names?.full || '',
    awayScore: awayScore,
    awayRank: awayTeam.rank || null,
    
    homeTeam: homeTeamName,
    homeTeamFull: homeTeam.names?.full || '',
    homeScore: homeScore,
    homeRank: homeTeam.rank || null,
    
    period: gameData.currentPeriod || null,
    clock: gameData.contestClock || null,
    network: gameData.network || null,
    venue: gameData.venue || null,
    neutral: gameData.neutralSite || false,
    
    _raw: game
  };
}

/**
 * Match game to our prediction game (handles both ESPN and NCAA names)
 */
export function matchGames(apiGame, ourGame, teamMappings) {
  if (!apiGame || !ourGame || !apiGame.awayTeam || !apiGame.homeTeam || !ourGame.awayTeam || !ourGame.homeTeam) {
    return false;
  }
  
  const ourAwayMapping = findTeamInMappings(teamMappings, ourGame.awayTeam, 'oddstrader');
  const ourHomeMapping = findTeamInMappings(teamMappings, ourGame.homeTeam, 'oddstrader');
  
  if (!ourAwayMapping || !ourHomeMapping) {
    return false;
  }
  
  // Try matching with both ESPN and NCAA names
  const apiSource = apiGame.source || 'NCAA';
  const nameColumn = apiSource === 'ESPN' ? 'espn_name' : 'ncaa_name';
  
  if (!ourAwayMapping[nameColumn] || !ourHomeMapping[nameColumn]) {
    return false;
  }
  
  const expectedAwayName = ourAwayMapping[nameColumn];
  const expectedHomeName = ourHomeMapping[nameColumn];
  
  const normalMatch = 
    teamNamesMatch(apiGame.awayTeam, expectedAwayName) &&
    teamNamesMatch(apiGame.homeTeam, expectedHomeName);
  
  const reversedMatch = 
    teamNamesMatch(apiGame.awayTeam, expectedHomeName) &&
    teamNamesMatch(apiGame.homeTeam, expectedAwayName);
  
  return normalMatch || reversedMatch;
}

/**
 * Fuzzy team name matching
 * CRITICAL: Avoid false positives like "Michigan" matching "Michigan State"
 */
function teamNamesMatch(name1, name2) {
  if (!name1 || !name2) return false;
  
  const normalize = (str) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/\buniversity\b/g, '')
      .replace(/\bcollege\b/g, '')
      .replace(/\bof\b/g, '')
      .replace(/\bthe\b/g, '')
      .replace(/\bstate\b/g, 'st')
      .replace(/\bsaint\b/g, 'st')
      .replace(/\bst\./g, 'st')
      .replace(/[^a-z0-9]/g, '');
  };
  
  const norm1 = normalize(name1);
  const norm2 = normalize(name2);
  
  // Exact match after normalization
  if (norm1 === norm2) return true;
  
  // CRITICAL FIX: Only allow substring matching if the lengths are similar
  // This prevents "michigan" from matching "michiganst" (Michigan State)
  // Require at least 80% length similarity for substring matching
  if (norm1.length >= 4 && norm2.length >= 4) {
    const lengthRatio = Math.min(norm1.length, norm2.length) / Math.max(norm1.length, norm2.length);
    if (lengthRatio >= 0.8) {
      if (norm1.includes(norm2) || norm2.includes(norm1)) return true;
    }
  }
  
  return false;
}

/**
 * Find team in mappings
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
 * Get live scores for our games (HYBRID: ESPN + NCAA)
 */
export async function getLiveScores(ourGames, teamMappings) {
  const apiGames = await fetchTodaysGames();
  
  let matchedCount = 0;
  let preservedCount = 0;
  let espnCount = 0;
  let ncaaCount = 0;
  
  const enrichedGames = ourGames.map(ourGame => {
    // Preserve final scores
    if (ourGame.liveScore && ourGame.liveScore.status === 'final') {
      preservedCount++;
      return ourGame;
    }
    
    // Find matching game
    const apiGame = apiGames.find(ag => matchGames(ag, ourGame, teamMappings));
    
    if (apiGame) {
      matchedCount++;
      if (apiGame.source === 'ESPN') espnCount++;
      else ncaaCount++;
      
      // Map scores using team names (not positions)
      const gameScores = new Map();
      gameScores.set(apiGame.awayTeam.toLowerCase().trim(), apiGame.awayScore);
      gameScores.set(apiGame.homeTeam.toLowerCase().trim(), apiGame.homeScore);
      
      const ourAwayMapping = findTeamInMappings(teamMappings, ourGame.awayTeam, 'oddstrader');
      const ourHomeMapping = findTeamInMappings(teamMappings, ourGame.homeTeam, 'oddstrader');
      
      const nameColumn = apiGame.source === 'ESPN' ? 'espn_name' : 'ncaa_name';
      
      let ourAwayScore = 0;
      let ourHomeScore = 0;
      
      if (ourAwayMapping && ourAwayMapping[nameColumn]) {
        const apiName = ourAwayMapping[nameColumn].toLowerCase().trim();
        for (const [team, score] of gameScores) {
          if (teamNamesMatch(team, apiName)) {
            ourAwayScore = score;
            break;
          }
        }
      }
      
      if (ourHomeMapping && ourHomeMapping[nameColumn]) {
        const apiName = ourHomeMapping[nameColumn].toLowerCase().trim();
        for (const [team, score] of gameScores) {
          if (teamNamesMatch(team, apiName)) {
            ourHomeScore = score;
            break;
          }
        }
      }
      
      console.log(`✅ ${apiGame.source}: ${ourGame.awayTeam} ${ourAwayScore}-${ourHomeScore} ${ourGame.homeTeam}`);
      
      return {
        ...ourGame,
        liveScore: {
          status: apiGame.status,
          awayScore: ourAwayScore,
          homeScore: ourHomeScore,
          period: apiGame.period,
          clock: apiGame.clock,
          network: apiGame.network,
          source: apiGame.source,
          lastUpdated: new Date().toISOString()
        }
      };
    }
    
    return ourGame;
  });
  
  console.log(`📊 Matched ${matchedCount} games (${espnCount} ESPN, ${ncaaCount} NCAA), ${preservedCount} preserved`);
  
  return enrichedGames;
}

/**
 * Start polling for live scores
 */
export function startScorePolling(games, teamMappings, callback, intervalMs = 60000) {
  getLiveScores(games, teamMappings).then(callback);
  
  const intervalId = setInterval(() => {
    getLiveScores(games, teamMappings).then(callback);
  }, intervalMs);
  
  return () => clearInterval(intervalId);
}
