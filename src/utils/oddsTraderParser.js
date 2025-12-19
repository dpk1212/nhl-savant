// NEW OddsTrader Parser for Table Format (Dec 2024)
import { getETDate } from './dateUtils.js';

// Team name mapping
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
 * Parse OddsTrader NEW TABLE FORMAT (Dec 2024)
 * Format: | ...FRI 12/197:00 PM<br>...Carolina<br>... | -115 | -135 | ...
 */
export function parseOddsTrader(markdownText) {
  if (!markdownText || markdownText.trim() === '') {
    console.warn('No odds data provided');
    return [];
  }

  const games = [];
  const lines = markdownText.split('\n');
  
  // Generate today's date pattern
  const today = new Date();
  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const dayOfWeek = dayNames[today.getDay()];
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const todayPattern = `${dayOfWeek} ${month}/${day}`;
  
  console.log(`🏒 NEW TABLE PARSER - Looking for: ${todayPattern}`);
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Find rows with today's date
    if (!line.startsWith('|') || !line.includes(todayPattern)) {
      continue;
    }
    
    console.log(`\n📅 Found game at line ${i}`);
    
    // Extract time
    const timeMatch = line.match(/(\d+:\d+\s*[AP]M)/);
    if (!timeMatch) {
      console.log('  ⚠️ No time found');
      continue;
    }
    const gameTime = timeMatch[1];
    console.log(`  ⏰ ${gameTime}`);
    
    // Extract away team
    let awayTeam = null;
    for (const [fullName, code] of Object.entries(TEAM_NAME_MAP)) {
      if (line.includes(`<br>${fullName}<br>`)) {
        awayTeam = code;
        console.log(`  🏒 Away: ${fullName} (${code})`);
        break;
      }
    }
    
    if (!awayTeam) {
      console.log('  ❌ Away team not found');
      continue;
    }
    
    // Extract away odds (first column with just a number)
    const cols = line.split('|').map(c => c.trim()).filter(c => c);
    let awayOdds = null;
    for (let j = 1; j < cols.length; j++) {
      if (/^[-+]\d{3,}$/.test(cols[j])) {
        awayOdds = parseInt(cols[j]);
        console.log(`  💰 Away odds: ${awayOdds}`);
        break;
      }
    }
    
    // HOME TEAM (next line)
    const nextLine = lines[i + 1];
    if (!nextLine || !nextLine.startsWith('|')) {
      console.log('  ⚠️ No home line');
      continue;
    }
    
    // Extract home team
    let homeTeam = null;
    for (const [fullName, code] of Object.entries(TEAM_NAME_MAP)) {
      if (nextLine.includes(`<br>${fullName}<br>`)) {
        homeTeam = code;
        console.log(`  🏒 Home: ${fullName} (${code})`);
        break;
      }
    }
    
    if (!homeTeam) {
      console.log('  ❌ Home team not found');
      continue;
    }
    
    // Extract home odds
    const homeCols = nextLine.split('|').map(c => c.trim()).filter(c => c);
    let homeOdds = null;
    for (let j = 1; j < homeCols.length; j++) {
      if (/^[-+]\d{3,}$/.test(homeCols[j])) {
        homeOdds = parseInt(homeCols[j]);
        console.log(`  💰 Home odds: ${homeOdds}`);
        break;
      }
    }
    
    // Create game
    if (awayTeam && homeTeam && awayOdds && homeOdds) {
      games.push({
        gameTime,
        awayTeam,
        homeTeam,
        moneyline: { away: awayOdds, home: homeOdds },
        puckLine: { away: { spread: null, odds: null }, home: { spread: null, odds: null } },
        total: { line: null, over: null, under: null },
        date: getETDate()
      });
      console.log(`  ✅ ${awayTeam} @ ${homeTeam} (${awayOdds}/${homeOdds})`);
    }
    
    // Skip home line
    i++;
  }
  
  console.log(`\n✅ Parsed ${games.length} games`);
  return games;
}

// Export other needed functions
export function getTeamCode(teamName) {
  return TEAM_NAME_MAP[teamName] || null;
}

export function getTeamName(code) {
  for (const [name, teamCode] of Object.entries(TEAM_NAME_MAP)) {
    if (teamCode === code) return name;
  }
  return null;
}

export function parseBothFiles(moneyText, totalText) {
  // For now, just parse money file (totals disabled anyway)
  return parseOddsTrader(moneyText);
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
    time: game.gameTime || 'TBD'
  }));
}

