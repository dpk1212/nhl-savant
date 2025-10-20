// OddsTrader Parser - Simple parser for OddsTrader markdown format

// Team name mapping from OddsTrader to our CSV codes
const TEAM_NAME_MAP = {
  'Minnesota': 'MIN',
  'N.Y. Rangers': 'NYR',
  'Seattle': 'SEA',
  'Philadelphia': 'PHI',
  'Buffalo': 'BUF',
  'Montreal': 'MTL',
  'Winnipeg': 'WPG',
  'Calgary': 'CGY',
  'Carolina': 'CAR',
  'Vegas': 'VGK',
  'San Jose': 'SJS',
  'N.Y. Islanders': 'NYI',
  'New Jersey': 'NJD',
  'Toronto': 'TOR',
  'Vancouver': 'VAN',
  'Pittsburgh': 'PIT',
  'Washington': 'WSH',
  'Edmonton': 'EDM',
  'Ottawa': 'OTT',
  'Florida': 'FLA',
  'Boston': 'BOS',
  'Los Angeles': 'LAK',
  'St. Louis': 'STL',
  'Columbus': 'CBJ',
  'Dallas': 'DAL',
  'Anaheim': 'ANA',
  'Nashville': 'NSH',
  'Colorado': 'COL',
  'Utah': 'UTA'
};

/**
 * Parse OddsTrader markdown to extract game data
 * Format: Table rows with <br> separators containing date, teams, and odds
 */
export function parseOddsTrader(markdownText) {
  if (!markdownText || markdownText.trim() === '') {
    console.warn('No odds data provided');
    return [];
  }

  const games = [];
  const lines = markdownText.split('\n');
  
  console.log('🏒 Starting OddsTrader parser...');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Look for today's games (MON 10/20)
    if (line.includes('MON 10/20')) {
      console.log(`\n📅 Found game line at ${i}: ${line.substring(0, 100)}...`);
      
      // Extract time from the current line
      const timeMatch = line.match(/(\d{1,2}:\d{2} [AP]M)/);
      if (!timeMatch) {
        console.log('  ⚠️ No time found, skipping');
        continue;
      }
      
      const gameTime = timeMatch[1];
      console.log(`  ⏰ Time: ${gameTime}`);
      
      // Parse AWAY team from current line (i)
      let awayTeam = null;
      let awayOdds = null;
      
      for (const [fullName, code] of Object.entries(TEAM_NAME_MAP)) {
        if (line.includes(fullName)) {
          awayTeam = code;
          console.log(`  🏒 Away team: ${fullName} (${code})`);
          break;
        }
      }
      
      // Check for totals first (o5½ -110 or u5½ +100)
      const totalMatch = line.match(/(o|u)(\d+(?:½)?)\s*([-+]\d{3,})[A-Za-z]/);
      if (totalMatch) {
        const overOrUnder = totalMatch[1]; // 'o' or 'u'
        const lineValue = totalMatch[2].replace('½', '.5'); // "5½" -> "5.5"
        const odds = parseInt(totalMatch[3]);
        
        if (overOrUnder === 'o') {
          currentGame.total.line = parseFloat(lineValue);
          currentGame.total.over = odds;
          console.log(`  📊 OVER ${lineValue} ${odds}`);
        } else {
          if (!currentGame.total.line) {
            currentGame.total.line = parseFloat(lineValue);
          }
          currentGame.total.under = odds;
          console.log(`  📊 UNDER ${lineValue} ${odds}`);
        }
      } else {
        // If not a total, try moneyline
        const awayOddsMatch = line.match(/([-+]\d{3,})[A-Za-z]/);
        if (awayOddsMatch) {
          awayOdds = parseInt(awayOddsMatch[1]);
          console.log(`  💰 Away odds: ${awayOdds}`);
        }
      }
      
      // Parse HOME team from NEXT line (i+1)
      const nextLine = lines[i + 1];
      if (!nextLine) {
        console.log('  ⚠️ No next line found for home team, skipping');
        continue;
      }
      
      let homeTeam = null;
      let homeOdds = null;
      
      for (const [fullName, code] of Object.entries(TEAM_NAME_MAP)) {
        if (nextLine.includes(fullName)) {
          homeTeam = code;
          console.log(`  🏒 Home team: ${fullName} (${code})`);
          break;
        }
      }
      
      // Check for totals first (under line for home team row)
      const homeTotalMatch = nextLine.match(/(o|u)(\d+(?:½)?)\s*([-+]\d{3,})[A-Za-z]/);
      if (homeTotalMatch) {
        const overOrUnder = homeTotalMatch[1];
        const lineValue = homeTotalMatch[2].replace('½', '.5');
        const odds = parseInt(homeTotalMatch[3]);
        
        if (overOrUnder === 'o') {
          currentGame.total.line = parseFloat(lineValue);
          currentGame.total.over = odds;
          console.log(`  📊 OVER ${lineValue} ${odds}`);
        } else {
          if (!currentGame.total.line) {
            currentGame.total.line = parseFloat(lineValue);
          }
          currentGame.total.under = odds;
          console.log(`  📊 UNDER ${lineValue} ${odds}`);
        }
      } else {
        // If not a total, try moneyline
        const homeOddsMatch = nextLine.match(/([-+]\d{3,})[A-Za-z]/);
        if (homeOddsMatch) {
          homeOdds = parseInt(homeOddsMatch[1]);
          console.log(`  💰 Home odds: ${homeOdds}`);
        }
      }
      
      // Create game if we have all data
      if (awayTeam && homeTeam && awayOdds !== null && homeOdds !== null) {
        const game = {
          gameTime: gameTime,
          awayTeam: awayTeam,
          homeTeam: homeTeam,
          moneyline: {
            away: awayOdds,
            home: homeOdds
          },
          // OddsTrader only shows moneyline in this format
          // We don't have puck line or totals
          puckLine: {
            away: { spread: null, odds: null },
            home: { spread: null, odds: null }
          },
          total: {
            line: null,
            over: null,
            under: null
          }
        };
        
        games.push(game);
        console.log(`  ✅ Added game: ${awayTeam} @ ${homeTeam}`);
      } else {
        console.log(`  ❌ Missing data - awayTeam: ${awayTeam}, homeTeam: ${homeTeam}, awayOdds: ${awayOdds}, homeOdds: ${homeOdds}`);
      }
    }
    
    // Stop when we hit tomorrow's games (TUE 10/21)
    if (line.includes('TUE 10/21')) {
      console.log('\n🛑 Reached tomorrow\'s games, stopping parser');
      break;
    }
  }
  
  console.log(`\n✅ Parsed ${games.length} games from OddsTrader`);
  if (games.length > 0) {
    console.log('📋 Games:', games.map(g => `${g.awayTeam} @ ${g.homeTeam}`).join(', '));
  }
  
  return games;
}

/**
 * Get team code from full name
 */
export function getTeamCode(teamName) {
  return TEAM_NAME_MAP[teamName] || null;
}

/**
 * Get full team name from code
 */
export function getTeamName(code) {
  for (const [name, teamCode] of Object.entries(TEAM_NAME_MAP)) {
    if (teamCode === code) return name;
  }
  return null;
}

/**
 * Parse BOTH Money and Total files and merge the data
 * @param {string} moneyText - Markdown from Money tab (has moneylines)
 * @param {string} totalText - Markdown from Total tab (has totals)
 * @returns {Array} Merged game objects with both moneylines and totals
 */
export function parseBothFiles(moneyText, totalText) {
  console.log('🔄 Merging moneylines + totals...');
  
  // Parse money file for moneylines
  const moneyGames = parseOddsTrader(moneyText);
  console.log(`✅ Parsed ${moneyGames.length} games from Money file`);
  
  // Parse total file for totals
  const totalGames = parseOddsTrader(totalText);
  console.log(`✅ Parsed ${totalGames.length} games from Total file`);
  
  // Merge: moneylines from money file + totals from total file
  const mergedGames = moneyGames.map((moneyGame, index) => {
    const totalGame = totalGames[index];
    
    if (totalGame && totalGame.total && totalGame.total.line) {
      return {
        ...moneyGame,
        total: totalGame.total
      };
    }
    
    return moneyGame;
  });
  
  console.log(`📋 Final merged games: ${mergedGames.map(g => `${g.awayTeam} @ ${g.homeTeam}`).join(', ')}`);
  
  return mergedGames;
}

