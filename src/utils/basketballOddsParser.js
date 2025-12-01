/**
 * Basketball Odds Parser
 * Parses OddsTrader NCAAB odds markdown data
 * 
 * Extracts: teams, records, moneylines, game times
 */

import { normalizeTeamName } from './teamNameNormalizer.js';

/**
 * Get today's day abbreviation (MON, TUE, WED, etc.)
 */
function getTodayDayAbbr() {
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  return days[new Date().getDay()];
}

/**
 * Get today's month/day with leading zeros (e.g., "12/01")
 */
function getTodayMonthDay() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  return `${month}/${day.toString().padStart(2, '0')}`;
}

/**
 * Check if a game line is for TODAY
 */
function isTodayGame(line) {
  // LIVE games or "STARTS IN" are always today
  if (line.includes('LIVE') || line.includes('STARTS IN')) {
    return true;
  }
  
  // Check if date matches today (e.g., "THU 11/27")
  const todayDay = getTodayDayAbbr();
  const todayDate = getTodayMonthDay();
  const datePattern = `${todayDay} ${todayDate}`;
  
  return line.includes(datePattern);
}

/**
 * Parse basketball odds from OddsTrader markdown
 * @param {string} markdown - Raw markdown from OddsTrader
 * @returns {array} - Array of game objects with odds (TODAY ONLY)
 */
export function parseBasketballOdds(markdown) {
  if (!markdown || typeof markdown !== 'string') {
    console.warn('Invalid markdown provided to parseBasketballOdds');
    return [];
  }
  
  const games = [];
  const lines = markdown.split('\n');
  
  console.log(`📅 Filtering for TODAY: ${getTodayDayAbbr()} ${getTodayMonthDay()}`);
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line || !line.startsWith('|')) continue;
    
    // Look for AWAY team line (has ![bell] and time marker)
    if (line.includes('![bell]') && 
        (line.match(/(?:MON|TUE|WED|THU|FRI|SAT|SUN)\s+\d{1,2}\/\d{1,2}/) || 
         line.includes('STARTS IN') ||
         line.includes('LIVE'))) {
      
      // ✅ FILTER: Only parse games for TODAY
      if (!isTodayGame(line)) {
        continue;
      }
      
      // Extract time (handle all date formats and live games)
      const timeMatch = line.match(/(?:MON|TUE|WED|THU|FRI|SAT|SUN)\s+\d{1,2}\/\d{1,2}(\d{1,2}:\d{2}\s*(?:AM|PM))/);
      const startsInMatch = line.match(/STARTS\s+IN[^\d]*(\d{1,2}:\d{2}\s*(?:AM|PM))/);
      const liveMatch = line.match(/LIVE/);
      const gameTime = timeMatch ? timeMatch[1] : startsInMatch ? startsInMatch[1] : liveMatch ? 'LIVE' : 'TBD';
      
      // Extract away team info - line contains BOTH bell and team logo
      // Split on 'logos.oddstrader.com' to find the team logo
      const parts = line.split('![](https://logos.oddstrader.com/');
      if (parts.length < 2) continue;
      
      const teamSection = parts[1];
      
      // Team name is between logo and record: <br>TeamName<br>
      // Handle both .png and .PNG (case insensitive)
      const teamMatch = teamSection.match(/\.(?:png|PNG)\?d=100x100\)<br>([^<]+)<br>/);
      if (!teamMatch) continue;
      
      let awayTeamName = teamMatch[1].trim();
      
      // Remove rank prefix if present (e.g., "#20Tennessee" -> "Tennessee")
      awayTeamName = awayTeamName.replace(/^#\d+/, '').trim();
      
      // Extract record
      const recordMatch = teamSection.match(/<br>(\d+-\d+)<br>/);
      const awayRecord = recordMatch ? recordMatch[1] : null;
      
      // Extract odds (look for +/- number before sportsbook name)
      const oddsMatch = teamSection.match(/([+-]\d+)(?:Caesars|Bet365|BetMGM|BetRivers|SugarHouse|FanDuel)/);
      const awayOdds = oddsMatch ? parseInt(oddsMatch[1]) : null;
      
      // Now look at NEXT line for HOME team
      const nextLine = lines[i + 1];
      if (!nextLine || !nextLine.trim().startsWith('|')) continue;
      
      const homeSection = nextLine.split('![](https://logos.oddstrader.com/')[1];
      if (!homeSection) continue;
      
      // Extract home team info
      const homeTeamMatch = homeSection.match(/\.(?:png|PNG)\?d=100x100\)<br>([^<]+)<br>/);
      if (!homeTeamMatch) continue;
      
      let homeTeamName = homeTeamMatch[1].trim();
      homeTeamName = homeTeamName.replace(/^#\d+/, '').trim();
      
      const homeRecordMatch = homeSection.match(/<br>(\d+-\d+)<br>/);
      const homeRecord = homeRecordMatch ? homeRecordMatch[1] : null;
      
      const homeOddsMatch = homeSection.match(/([+-]\d+)(?:Caesars|Bet365|BetMGM|BetRivers|SugarHouse|FanDuel)/);
      const homeOdds = homeOddsMatch ? parseInt(homeOddsMatch[1]) : null;
      
      // Create game object
      games.push({
        awayTeam: awayTeamName, // EXACT NAME from OddsTrader (no normalization)
        awayTeamRaw: awayTeamName,
        awayRecord: awayRecord,
        awayOdds: awayOdds,
        homeTeam: homeTeamName, // EXACT NAME from OddsTrader (no normalization)
        homeTeamRaw: homeTeamName,
        homeRecord: homeRecord,
        homeOdds: homeOdds,
        gameTime: gameTime,
        source: 'OddsTrader',
        matchup: `${awayTeamName} @ ${homeTeamName}` // Use exact names
      });
      
      // Skip the home team line we just processed
      i++;
    }
  }
  
  console.log(`✅ Parsed ${games.length} games from OddsTrader`);
  return games;
}

/**
 * Convert moneyline odds to implied probability
 * @param {number} odds - Moneyline odds (e.g., +140 or -185)
 * @returns {number} - Implied probability (0-1)
 */
export function oddsToProb(odds) {
  if (!odds) return null;
  
  if (odds > 0) {
    // Positive odds (underdog)
    return 100 / (odds + 100);
  } else {
    // Negative odds (favorite)
    return Math.abs(odds) / (Math.abs(odds) + 100);
  }
}

/**
 * Get consensus odds from multiple sportsbooks
 * @param {array} gamesWithOdds - Array of game objects with odds
 * @returns {array} - Games with consensus odds
 */
export function getConsensusOdds(gamesWithOdds) {
  // For now, just use the odds as provided
  // Future: scrape multiple books and average
  return gamesWithOdds.map(game => ({
    ...game,
    awayProb: oddsToProb(game.awayOdds),
    homeProb: oddsToProb(game.homeOdds)
  }));
}

