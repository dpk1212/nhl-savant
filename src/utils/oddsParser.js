// Parse Oddschecker markdown file to extract NHL game odds

// Team name mapping from Oddschecker to our CSV codes
const TEAM_NAME_MAP = {
  'Anaheim Ducks': 'ANA',
  'Boston Bruins': 'BOS',
  'Buffalo Sabres': 'BUF',
  'Calgary Flames': 'CGY',
  'Carolina Hurricanes': 'CAR',
  'Chicago Blackhawks': 'CHI',
  'Colorado Avalanche': 'COL',
  'Columbus Blue Jackets': 'CBJ',
  'Dallas Stars': 'DAL',
  'Detroit Red Wings': 'DET',
  'Edmonton Oilers': 'EDM',
  'Florida Panthers': 'FLA',
  'Los Angeles Kings': 'LAK',
  'Minnesota Wild': 'MIN',
  'Montreal Canadiens': 'MTL',
  'Nashville Predators': 'NSH',
  'New Jersey Devils': 'NJD',
  'New York Islanders': 'NYI',
  'New York Rangers': 'NYR',
  'Ottawa Senators': 'OTT',
  'Philadelphia Flyers': 'PHI',
  'Pittsburgh Penguins': 'PIT',
  'San Jose Sharks': 'SJS',
  'Seattle Kraken': 'SEA',
  'St. Louis Blues': 'STL',
  'Tampa Bay Lightning': 'TBL',
  'Toronto Maple Leafs': 'TOR',
  'Utah Mammoth': 'UTA',
  'Vancouver Canucks': 'VAN',
  'Vegas Golden Knights': 'VGK',
  'Washington Capitals': 'WSH',
  'Winnipeg Jets': 'WPG'
};

/**
 * Parse odds markdown file to extract game data
 * @param {string} markdownText - Raw markdown content
 * @returns {Array} Array of game objects with odds
 */
export function parseOddsMarkdown(markdownText) {
  if (!markdownText || markdownText.trim() === '') {
    console.warn('No odds data provided');
    return [];
  }

  const games = [];
  const lines = markdownText.split('\n');
  
  let currentGame = null;
  let currentTime = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Extract game time (e.g., "7:00 PM EDT")
    if (line.match(/^\d{1,2}:\d{2} (AM|PM) (EDT|EST|PST|CST|MST)/)) {
      currentTime = line;
      continue;
    }
    
    // Look for game matchups in markdown links
    // Format: [Team1\n\n@ Team2](url)
    const matchupMatch = line.match(/\[(.*?)\]\(https:\/\/www\.oddschecker\.com\/us\/hockey\/nhl\/(.*?)\)/);
    
    if (matchupMatch && currentTime) {
      const linkText = matchupMatch[1];
      const urlSlug = matchupMatch[2];
      
      // Extract teams from the link text or URL slug
      let awayTeam = null;
      let homeTeam = null;
      
      // Try to parse from URL slug (e.g., "seattle-kraken-at-philadelphia-flyers")
      const slugMatch = urlSlug.match(/(.*?)-at-(.*?)(?:\s|$)/);
      if (slugMatch) {
        const awaySlug = slugMatch[1].split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        const homeSlug = slugMatch[2].split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        
        // Find matching team names
        for (const [fullName, code] of Object.entries(TEAM_NAME_MAP)) {
          if (fullName.toLowerCase() === awaySlug.toLowerCase() || 
              fullName.toLowerCase().includes(awaySlug.toLowerCase())) {
            awayTeam = code;
          }
          if (fullName.toLowerCase() === homeSlug.toLowerCase() || 
              fullName.toLowerCase().includes(homeSlug.toLowerCase())) {
            homeTeam = code;
          }
        }
      }
      
      if (awayTeam && homeTeam) {
        currentGame = {
          gameTime: currentTime,
          awayTeam,
          homeTeam,
          moneyline: { away: null, home: null },
          puckLine: { 
            away: { spread: null, odds: null }, 
            home: { spread: null, odds: null } 
          },
          total: { line: null, over: null, under: null }
        };
      }
    }
    
    // Parse odds values - look for patterns like "+115", "-135", "O 5.5-120", "U 5.5+105"
    if (currentGame) {
      // Total line (e.g., "O 5.5-120" or "U 5.5+105")
      const totalOverMatch = line.match(/O\s+(\d+\.?\d*)([-+]\d+)/);
      if (totalOverMatch) {
        currentGame.total.line = parseFloat(totalOverMatch[1]);
        currentGame.total.over = parseInt(totalOverMatch[2]);
      }
      
      const totalUnderMatch = line.match(/U\s+(\d+\.?\d*)([-+]\d+)/);
      if (totalUnderMatch) {
        if (!currentGame.total.line) {
          currentGame.total.line = parseFloat(totalUnderMatch[1]);
        }
        currentGame.total.under = parseInt(totalUnderMatch[2]);
      }
      
      // Moneyline odds (standalone odds like "+115" or "-135")
      const moneylineMatch = line.match(/^([-+]\d+)$/);
      if (moneylineMatch) {
        const odds = parseInt(moneylineMatch[1]);
        if (currentGame.moneyline.away === null) {
          currentGame.moneyline.away = odds;
        } else if (currentGame.moneyline.home === null) {
          currentGame.moneyline.home = odds;
        }
      }
      
      // Puck line (e.g., "+1-148" or "-1+123")
      const puckLineMatch = line.match(/^([-+]\d+\.?\d*)([-+]\d+)$/);
      if (puckLineMatch && !totalOverMatch && !totalUnderMatch) {
        const spread = parseFloat(puckLineMatch[1]);
        const odds = parseInt(puckLineMatch[2]);
        
        if (spread > 0) {
          currentGame.puckLine.away.spread = spread;
          currentGame.puckLine.away.odds = odds;
        } else {
          currentGame.puckLine.home.spread = spread;
          currentGame.puckLine.home.odds = odds;
        }
      }
      
      // Check if we've collected enough data and hit "More Odds" (end of game block)
      if (line.includes('More Odds') && currentGame.moneyline.away && currentGame.moneyline.home) {
        games.push(currentGame);
        currentGame = null;
      }
    }
  }
  
  // Add last game if exists
  if (currentGame && currentGame.moneyline.away && currentGame.moneyline.home) {
    games.push(currentGame);
  }
  
  console.log(`Parsed ${games.length} games from odds file`);
  return games;
}

/**
 * Get team code from full name
 * @param {string} teamName - Full team name
 * @returns {string|null} Team code or null
 */
export function getTeamCode(teamName) {
  return TEAM_NAME_MAP[teamName] || null;
}

/**
 * Get full team name from code
 * @param {string} code - Team code
 * @returns {string|null} Full team name or null
 */
export function getTeamName(code) {
  for (const [name, teamCode] of Object.entries(TEAM_NAME_MAP)) {
    if (teamCode === code) return name;
  }
  return null;
}

