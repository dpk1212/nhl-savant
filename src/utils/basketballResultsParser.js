/**
 * Basketball Results Parser
 * Parses ALL games from OddsTrader, then filters for completed ones (100%/0% markers)
 * Uses same parsing logic as basketballOddsParser.js
 */

/**
 * Parse basketball results from OddsTrader markdown
 * @param {string} markdown - Raw markdown from OddsTrader
 * @returns {array} - Array of completed game results
 */
export function parseBasketballResults(markdown) {
  if (!markdown || typeof markdown !== 'string') {
    console.warn('Invalid markdown provided to parseBasketballResults');
    return [];
  }
  
  const results = [];
  const lines = markdown.split('\n');
  
  // Parse ALL games using same logic as basketballOddsParser
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line || !line.startsWith('|')) continue;
    
    // Look for lines with team logos (indicates a game row)
    // Match both upcoming games (with ![bell]) and completed games (without ![bell])
    if (line.includes('logos.oddstrader.com') && 
        line.includes('<br>') &&
        (line.includes('![bell]') || line.includes('%<br>'))) {
      
      // Extract away team info
      const parts = line.split('![](https://logos.oddstrader.com/');
      if (parts.length < 2) continue;
      
      const teamSection = parts[1];
      
      // Team name is between logo and record: <br>TeamName<br>
      const teamMatch = teamSection.match(/\.(?:png|PNG)\?d=100x100\)<br>([^<]+)<br>/);
      if (!teamMatch) continue;
      
      let awayTeamName = teamMatch[1].trim().replace(/^#\d+/, '').trim();
      
      // Check if this game is completed (has 100% or 0% marker)
      const awayWinMatch = line.match(/<br>(\d+)%<br>/);
      if (!awayWinMatch) continue; // Not a completed game
      
      const awayWinPct = parseInt(awayWinMatch[1]);
      if (awayWinPct !== 100 && awayWinPct !== 0) continue; // Not a completed game
      
      const awayWon = awayWinPct === 100;
      
      // Get HOME team from next line
      const nextLine = lines[i + 1];
      if (!nextLine || !nextLine.trim().startsWith('|')) continue;
      
      const homeSection = nextLine.split('![](https://logos.oddstrader.com/')[1];
      if (!homeSection) continue;
      
      // Extract home team info
      const homeTeamMatch = homeSection.match(/\.(?:png|PNG)\?d=100x100\)<br>([^<]+)<br>/);
      if (!homeTeamMatch) continue;
      
      let homeTeamName = homeTeamMatch[1].trim().replace(/^#\d+/, '').trim();
      
      // Verify home team also has completion marker
      const homeWinMatch = nextLine.match(/<br>(\d+)%<br>/);
      if (!homeWinMatch) continue;
      
      const homeWinPct = parseInt(homeWinMatch[1]);
      const homeWon = homeWinPct === 100;
      
      // Add completed game result
      results.push({
        awayTeam: awayTeamName,
        homeTeam: homeTeamName,
        winner: awayWon ? 'AWAY' : 'HOME',
        winnerTeam: awayWon ? awayTeamName : homeTeamName,
        loserTeam: awayWon ? homeTeamName : awayTeamName,
        awayWinPct: awayWinPct,
        homeWinPct: homeWinPct,
        source: 'OddsTrader',
        scrapedAt: Date.now()
      });
      
      console.log(`✅ Found result: ${awayTeamName} ${awayWon ? 'WON' : 'LOST'} @ ${homeTeamName}`);
      
      // Skip home team line
      i++;
    }
  }
  
  return results;
}

