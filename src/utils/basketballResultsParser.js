/**
 * Basketball Results Parser
 * Extracts final scores from OddsTrader using 100%/0% markers
 * ONLY parses COMPLETED games (with win percentage indicators)
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
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip non-table lines
    if (!line || !line.startsWith('|')) continue;
    
    // Look for AWAY team line with WIN/LOSS indicator
    // Pattern: <br>100%<br> or <br>0%<br>
    if (line.includes('![bell]') && 
        (line.includes('MON 11/24') || line.includes('TUE 11/25') || line.includes('WED 11/26') || 
         line.includes('THU 11/27') || line.includes('FRI 11/28') || line.includes('SAT 11/29') || 
         line.includes('SUN 11/30') || line.includes('STARTS IN')) &&
        (line.includes('<br>100%<br>') || line.includes('<br>0%<br>'))) {
      
      // Extract away team
      const awayTeamMatch = line.match(/\.(?:png|PNG)\?d=100x100\)<br>([^<]+)<br>/);
      if (!awayTeamMatch) continue;
      
      let awayTeam = awayTeamMatch[1].trim().replace(/^#\d+/, '').trim();
      
      // Extract away team win percentage
      const awayWinMatch = line.match(/<br>(\d+)%<br>/);
      const awayWon = awayWinMatch && awayWinMatch[1] === '100';
      
      // Get HOME team from next line
      const nextLine = lines[i + 1];
      if (!nextLine || !nextLine.trim().startsWith('|')) continue;
      
      const homeTeamMatch = nextLine.match(/\.(?:png|PNG)\?d=100x100\)<br>([^<]+)<br>/);
      if (!homeTeamMatch) continue;
      
      let homeTeam = homeTeamMatch[1].trim().replace(/^#\d+/, '').trim();
      
      // Extract home team win percentage
      const homeWinMatch = nextLine.match(/<br>(\d+)%<br>/);
      const homeWon = homeWinMatch && homeWinMatch[1] === '100';
      
      // Only include games with a winner (100%/0% pattern)
      if (awayWon || homeWon) {
        results.push({
          awayTeam: awayTeam,
          homeTeam: homeTeam,
          winner: awayWon ? 'AWAY' : 'HOME',
          winnerTeam: awayWon ? awayTeam : homeTeam,
          loserTeam: awayWon ? homeTeam : awayTeam,
          source: 'OddsTrader',
          scrapedAt: Date.now()
        });
        
        console.log(`✅ Found result: ${awayTeam} ${awayWon ? 'WON' : 'LOST'} @ ${homeTeam}`);
      }
      
      i++; // Skip home team line
    }
  }
  
  return results;
}

