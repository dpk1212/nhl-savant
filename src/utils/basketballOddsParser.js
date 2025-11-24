/**
 * Basketball Odds Parser
 * Parses OddsTrader NCAAB odds markdown data
 * 
 * Extracts: teams, records, moneylines, game times
 */

import { normalizeTeamName } from './teamNameNormalizer.js';

/**
 * Parse basketball odds from OddsTrader markdown
 * @param {string} markdown - Raw markdown from OddsTrader
 * @returns {array} - Array of game objects with odds
 */
export function parseBasketballOdds(markdown) {
  if (!markdown || typeof markdown !== 'string') {
    console.warn('Invalid markdown provided to parseBasketballOdds');
    return [];
  }
  
  const games = [];
  const lines = markdown.split('\n');
  
  let currentAwayTeam = null;
  let currentAwayRecord = null;
  let currentAwayOdds = null;
  let currentGameTime = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) continue;
    
    // Look for game time (e.g., "MON 11/24 1:00 PM" or "STARTS IN 00:28:57")
    if (line.includes('MON 11/24') || line.includes('STARTS IN')) {
      const timeMatch = line.match(/(\d{1,2}:\d{2}\s*(?:AM|PM))/);
      if (timeMatch) {
        currentGameTime = timeMatch[1];
      }
    }
    
    // Look for away team lines (first team in matchup)
    // Format: Team name followed by record like "3-2" and odds like "+140"
    if (line.includes('![](https://logos.oddstrader.com/') && !line.includes('#') && line.includes('-')) {
      // Extract team name
      const teamMatch = line.match(/!\[]\([^)]+\)<br>([^<\n]+)/);
      if (!teamMatch) continue;
      
      const teamName = teamMatch[1].trim();
      
      // Extract record (e.g., "3-2")
      const recordMatch = line.match(/(\d+-\d+)/);
      const record = recordMatch ? recordMatch[1] : null;
      
      // Extract moneyline odds (e.g., "+140", "-185")
      const oddsMatch = line.match(/([+-]\d+)(?:Caesars|Bet365|BetMGM|BetRivers|SugarHouse|FanDuel)/);
      const odds = oddsMatch ? parseInt(oddsMatch[1]) : null;
      
      // Check if this is away or home team
      // Away team is typically first (100% indicator sometimes present)
      // Home team is second (0% indicator sometimes present)
      if (line.includes('100%') || !currentAwayTeam) {
        // This is an away team
        currentAwayTeam = teamName;
        currentAwayRecord = record;
        currentAwayOdds = odds;
      } else if (currentAwayTeam && !line.includes('100%')) {
        // This is a home team - complete the game
        const homeTeam = teamName;
        const homeRecord = record;
        const homeOdds = odds;
        
        if (currentAwayTeam && homeTeam) {
          games.push({
            awayTeam: normalizeTeamName(currentAwayTeam),
            awayTeamRaw: currentAwayTeam,
            awayRecord: currentAwayRecord,
            awayOdds: currentAwayOdds,
            homeTeam: normalizeTeamName(homeTeam),
            homeTeamRaw: homeTeam,
            homeRecord: homeRecord,
            homeOdds: homeOdds,
            gameTime: currentGameTime,
            source: 'OddsTrader',
            matchup: `${normalizeTeamName(currentAwayTeam)} @ ${normalizeTeamName(homeTeam)}`
          });
        }
        
        // Reset for next game
        currentAwayTeam = null;
        currentAwayRecord = null;
        currentAwayOdds = null;
      }
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

