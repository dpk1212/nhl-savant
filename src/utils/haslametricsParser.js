/**
 * Haslametrics Parser
 * Parses today's games AND team efficiency ratings from Haslametrics
 * 
 * Haslametrics shows games in a grid format:
 * Row 1: Away teams with ratings
 * Row 2: Home teams with ratings  
 * Row 3: Game times with TV networks
 */

import { normalizeTeamName } from './teamNameNormalizer.js';

/**
 * Parse Haslametrics data - returns both games and team ratings
 * @param {string} markdown - Raw markdown from Haslametrics
 * @returns {object} - { games: [], teams: {} }
 */
export function parseHaslametrics(markdown) {
  if (!markdown || typeof markdown !== 'string') {
    console.warn('Invalid markdown provided to parseHaslametrics');
    return { games: [], teams: {} };
  }
  
  const games = [];
  const teams = {};
  const lines = markdown.split('\n');
  
  // Parse team ratings first (for ensemble model)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Look for team rating rows: | 1 | [Duke](link)(7-0) | 127.39 | ...
    if (line.startsWith('|') && line.includes('](https://haslametrics.com/ratings2.php')) {
      const cells = line.split('|').map(c => c.trim()).filter(c => c);
      
      if (cells.length < 3) continue;
      
      // Extract team name from markdown link
      const teamMatch = cells[1].match(/\[([^\]]+)\]/);
      if (!teamMatch) continue;
      
      const teamName = teamMatch[1];
      const normalizedName = normalizeTeamName(teamName);
      
      // Extract record
      const recordMatch = cells[1].match(/\((\d+-\d+)\)/);
      const record = recordMatch ? recordMatch[1] : null;
      
      // Extract offensive efficiency (3rd column)
      const offEff = parseFloat(cells[2]) || null;
      
      teams[normalizedName] = {
        name: normalizedName,
        rawName: teamName,
        record: record,
        offensiveEff: offEff,
        source: 'Haslametrics'
      };
    }
  }
  
  // Now parse today's games (under "THIS WEEK'S EXPECTED OUTCOMES")
  let inGamesSection = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Find games section
    if (line.includes("THIS WEEK'S EXPECTED OUTCOMES")) {
      inGamesSection = true;
      continue;
    }
    
    if (!inGamesSection) continue;
    
    // Look for away team rows (contain team links and ratings)
    // Format: | [Houston](link) 2[![](preview)] | 77.08 |  | [UTRGV](link) 221 | 65.68 | ...
    if (line.includes('](https://haslametrics.com/ratings2.php') && line.includes('![](https://haslametrics.com/images/preview')) {
      const awayLine = line;
      const homeLine = lines[i + 1] ? lines[i + 1].trim() : '';
      const timeLine = lines[i + 2] ? lines[i + 2].trim() : '';
      
      // Parse away teams from this row
      const awayTeams = extractTeamsFromRow(awayLine);
      
      // Parse home teams from next row
      const homeTeams = extractTeamsFromRow(homeLine);
      
      // Parse game times from third row
      const gameTimes = extractGameTimesFromRow(timeLine);
      
      // Match them up (each column is one game)
      const numGames = Math.min(awayTeams.length, homeTeams.length, gameTimes.length);
      
      for (let j = 0; j < numGames; j++) {
        if (awayTeams[j] && homeTeams[j]) {
          games.push({
            awayTeam: normalizeTeamName(awayTeams[j].name),
            awayTeamRaw: awayTeams[j].name,
            awayRating: awayTeams[j].rating,
            awayRank: awayTeams[j].rank,
            homeTeam: normalizeTeamName(homeTeams[j].name),
            homeTeamRaw: homeTeams[j].name,
            homeRating: homeTeams[j].rating,
            homeRank: homeTeams[j].rank,
            gameTime: gameTimes[j] || null,
            matchup: `${normalizeTeamName(awayTeams[j].name)} @ ${normalizeTeamName(homeTeams[j].name)}`,
            source: 'Haslametrics'
          });
        }
      }
      
      // Skip the lines we just processed
      i += 2;
    }
  }
  
  console.log(`✅ Parsed ${games.length} games and ${Object.keys(teams).length} teams from Haslametrics`);
  
  return { games, teams };
}

/**
 * Extract teams from a row
 * Format: | [Houston](link) 2[![](preview)] | 77.08 |  | [UTRGV](link) 221 | 65.68 | ...
 */
function extractTeamsFromRow(row) {
  const teams = [];
  
  // Find all team patterns: [TeamName](link) RANK
  const teamRegex = /\[([^\]]+)\]\(https:\/\/haslametrics\.com\/ratings2\.php[^\)]*\)\s*(\d+)/g;
  let match;
  
  while ((match = teamRegex.exec(row)) !== null) {
    const teamName = match[1];
    const rank = parseInt(match[2]);
    
    // Find the rating (next number after the team)
    const restOfRow = row.substring(match.index + match[0].length);
    const ratingMatch = restOfRow.match(/\|\s*([\d.]+)/);
    const rating = ratingMatch ? parseFloat(ratingMatch[1]) : null;
    
    teams.push({
      name: teamName,
      rank: rank,
      rating: rating
    });
  }
  
  return teams;
}

/**
 * Extract game times from a row
 * Format: | 6:00pm ET -- TNT |  |  | 8:00pm ET -- BTN | ...
 */
function extractGameTimesFromRow(row) {
  const times = [];
  
  // Find all time patterns: 6:00pm ET or 1:00pm ET
  const timeRegex = /(\d{1,2}:\d{2}[ap]m\s+ET)/gi;
  let match;
  
  while ((match = timeRegex.exec(row)) !== null) {
    times.push(match[1]);
  }
  
  return times;
}

/**
 * Get game prediction using tempo-free calculations
 * @param {string} awayTeam - Away team name
 * @param {string} homeTeam - Home team name  
 * @param {object} teamsData - Team database
 * @returns {object} - Predicted scores and win probability
 */
export function getGamePrediction(awayTeam, homeTeam, teamsData) {
  const away = teamsData[normalizeTeamName(awayTeam)];
  const home = teamsData[normalizeTeamName(homeTeam)];
  
  if (!away || !home) {
    return null;
  }
  
  // Simplified prediction using offensive efficiency
  const avgPossessions = 70;
  const homeAdvantage = 3;
  
  const awayScore = (away.offensiveEff || 100) * avgPossessions / 100;
  const homeScore = (home.offensiveEff || 100) * avgPossessions / 100 + homeAdvantage;
  
  // Win probability based on score differential
  const diff = homeScore - awayScore;
  const homeWinProb = 1 / (1 + Math.exp(-diff / 5));
  
  return {
    awayScore: Math.round(awayScore * 10) / 10,
    homeScore: Math.round(homeScore * 10) / 10,
    awayWinProb: Math.round((1 - homeWinProb) * 1000) / 1000,
    homeWinProb: Math.round(homeWinProb * 1000) / 1000,
    source: 'Haslametrics'
  };
}

