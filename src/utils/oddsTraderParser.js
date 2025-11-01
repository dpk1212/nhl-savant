// OddsTrader Parser - Simple parser for OddsTrader markdown format

// Team name mapping from OddsTrader to our CSV codes
const TEAM_NAME_MAP = {
  'Minnesota': 'MIN',
  'N.Y. Rangers': 'NYR',
  'Seattle': 'SEA',
  'Philadelphia': 'PHI',
  'Buffalo': 'BUF',
  'Detroit': 'DET',
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
  'Utah': 'UTA',
  'Tampa Bay': 'TBL',
  'Chicago': 'CHI'
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
  
  // Generate today's date pattern dynamically (e.g., "WED 10/22" or "WED 10/2")
  const today = new Date();
  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const dayOfWeek = dayNames[today.getDay()];
  const month = today.getMonth() + 1; // 0-indexed
  const day = today.getDate();
  const todayPattern = `${dayOfWeek} ${month}/${day}`;
  const todayPatternPadded = `${dayOfWeek} ${month}/${day.toString().padStart(2, '0')}`; // With leading zero
  
  // Also include yesterday's games - this handles when today's games are live/finished
  // and OddsTrader has moved them off the main page
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayDayOfWeek = dayNames[yesterday.getDay()];
  const yesterdayMonth = yesterday.getMonth() + 1;
  const yesterdayDay = yesterday.getDate();
  const yesterdayPattern = `${yesterdayDayOfWeek} ${yesterdayMonth}/${yesterdayDay}`;
  const yesterdayPatternPadded = `${yesterdayDayOfWeek} ${yesterdayMonth}/${yesterdayDay.toString().padStart(2, '0')}`;
  
  // Only include yesterday's games before 6 AM ET (for late night games)
  const currentHour = today.getHours();
  const includeYesterday = currentHour < 6;
  
  console.log(`🏒 Starting OddsTrader parser... Looking for: ${todayPattern} or ${todayPatternPadded}`);
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Look for today's games (and yesterday's if before 6 AM)
    // Note: LIVE games are detected but skipped since betting markets are closed
    // Check both padded and non-padded date formats (e.g., "SAT 11/1" and "SAT 11/01")
    const isMatchingDate = line.includes(todayPattern) || line.includes(todayPatternPadded) || 
                          (includeYesterday && (line.includes(yesterdayPattern) || line.includes(yesterdayPatternPadded))) || 
                          line.includes('LIVE');
    
    if (isMatchingDate) {
      console.log(`\n📅 Found game line at ${i}: ${line.substring(0, 100)}...`);
      
      // Extract time from the current line
      let gameTime;
      
      // Check if it's a LIVE game
      if (line.includes('LIVE')) {
        console.log(`  🔴 LIVE GAME - Skipping (no betting markets available)`);
        continue; // Skip LIVE games - betting markets are closed
      } else {
        // Pattern matches time that comes AFTER the date (e.g., "10/227:00 PM" -> "7:00 PM")
        const timeMatch = line.match(/\/\d{1,2}(\d{1,2}:\d{2} [AP]M)/);
        if (!timeMatch) {
          console.log('  ⚠️ No time found, skipping');
          continue;
        }
        gameTime = timeMatch[1];
        console.log(`  ⏰ Time: ${gameTime}`);
      }
      
      // CREATE currentGame object IMMEDIATELY
      const currentGame = {
        gameTime: gameTime,
        awayTeam: null,
        homeTeam: null,
        moneyline: { away: null, home: null },
        puckLine: {
          away: { spread: null, odds: null },
          home: { spread: null, odds: null }
        },
        total: { 
          line: null,  // Will use average of over/under lines if different
          overLine: null,  // Specific line for OVER
          underLine: null,  // Specific line for UNDER
          over: null, 
          under: null 
        }
      };
      
      // Parse AWAY team from current line (i)
      for (const [fullName, code] of Object.entries(TEAM_NAME_MAP)) {
        if (line.includes(fullName)) {
          currentGame.awayTeam = code;
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
          currentGame.total.overLine = parseFloat(lineValue);
          currentGame.total.over = odds;
          console.log(`  📊 OVER ${lineValue} ${odds}`);
        } else {
          currentGame.total.underLine = parseFloat(lineValue);
          currentGame.total.under = odds;
          console.log(`  📊 UNDER ${lineValue} ${odds}`);
        }
      } else {
        // If not a total, try moneyline (match odds immediately before sportsbook name)
        const awayOddsMatch = line.match(/([-+]\d{3,})(Bet365|Caesars|BetMGM|BetRivers|SugarHouse|FanDuel)/);
        if (awayOddsMatch) {
          currentGame.moneyline.away = parseInt(awayOddsMatch[1]);
          console.log(`  💰 Away odds: ${currentGame.moneyline.away} (from ${awayOddsMatch[2]})`);
        }
      }
      
      // Parse HOME team from NEXT line (i+1)
      const nextLine = lines[i + 1];
      if (!nextLine) {
        console.log('  ⚠️ No next line found for home team, skipping');
        continue;
      }
      
      for (const [fullName, code] of Object.entries(TEAM_NAME_MAP)) {
        if (nextLine.includes(fullName)) {
          currentGame.homeTeam = code;
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
          currentGame.total.overLine = parseFloat(lineValue);
          currentGame.total.over = odds;
          console.log(`  📊 OVER ${lineValue} ${odds}`);
        } else {
          currentGame.total.underLine = parseFloat(lineValue);
          currentGame.total.under = odds;
          console.log(`  📊 UNDER ${lineValue} ${odds}`);
        }
      } else {
        // If not a total, try moneyline (match odds immediately before sportsbook name)
        const homeOddsMatch = nextLine.match(/([-+]\d{3,})(Bet365|Caesars|BetMGM|BetRivers|SugarHouse|FanDuel)/);
        if (homeOddsMatch) {
          currentGame.moneyline.home = parseInt(homeOddsMatch[1]);
          console.log(`  💰 Home odds: ${currentGame.moneyline.home} (from ${homeOddsMatch[2]})`);
        }
      }
      
      // Add game if we have team data
      if (currentGame.awayTeam && currentGame.homeTeam) {
        // Set the main 'line' value: use overLine if same, otherwise use average
        if (currentGame.total.overLine && currentGame.total.underLine) {
          if (currentGame.total.overLine === currentGame.total.underLine) {
            currentGame.total.line = currentGame.total.overLine;
          } else {
            // Different lines - use the OVER line as the primary line
            currentGame.total.line = currentGame.total.overLine;
          }
        } else if (currentGame.total.overLine) {
          currentGame.total.line = currentGame.total.overLine;
        } else if (currentGame.total.underLine) {
          currentGame.total.line = currentGame.total.underLine;
        }
        
        // Add date to game for Firebase tracking (YYYY-MM-DD format)
        currentGame.date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        
        games.push(currentGame);
        console.log(`  ✅ Added game: ${currentGame.awayTeam} @ ${currentGame.homeTeam}`);
        console.log(`     Moneyline: ${currentGame.moneyline.away}/${currentGame.moneyline.home}`);
        console.log(`     Total: ${currentGame.total.line ? `O/U ${currentGame.total.line} (${currentGame.total.over}/${currentGame.total.under})` : 'N/A'}`);
      } else {
        console.log(`  ❌ Missing team data - away: ${currentGame.awayTeam}, home: ${currentGame.homeTeam}`);
      }
    }
    
    // Stop when we hit tomorrow's games (calculate dynamically)
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDayOfWeek = dayNames[tomorrow.getDay()];
    const tomorrowMonth = tomorrow.getMonth() + 1;
    const tomorrowDay = tomorrow.getDate();
    const tomorrowPattern = `${tomorrowDayOfWeek} ${tomorrowMonth}/${tomorrowDay}`;
    
    if (line.includes(tomorrowPattern)) {
      console.log(`\n🛑 Reached tomorrow's games (${tomorrowPattern}), stopping parser`);
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

/**
 * Extract simple games list for admin goalie selection
 * Returns array of {away, home, time} objects
 */
export function extractGamesListFromOdds(mergedGames) {
  if (!mergedGames || mergedGames.length === 0) {
    return [];
  }
  
  return mergedGames.map(game => ({
    away: game.awayTeam,
    home: game.homeTeam,
    time: game.gameTime || 'TBD' // FIX: Changed from game.time to game.gameTime
  }));
}

