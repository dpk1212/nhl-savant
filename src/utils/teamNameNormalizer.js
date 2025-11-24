/**
 * Team Name Normalizer for College Basketball
 * Handles variations in team names across different data sources
 * 
 * Sources use different formats:
 * - OddsTrader: "Kansas", "St. John's", "North Carolina State"
 * - Haslametrics: "Kansas Jayhawks", "St. John's Red Storm", "NC State Wolfpack"
 * - D-Ratings: "Kansas Jayhawks", "St. John's Red Storm", "NC State Wolfpack"
 */

// Top 75 teams from major conferences (covers ~80% of games)
const TEAM_MAP = {
  // ACC
  'duke': { normalized: 'Duke', fullName: 'Duke Blue Devils', conference: 'ACC' },
  'duke blue devils': { normalized: 'Duke', fullName: 'Duke Blue Devils', conference: 'ACC' },
  'north carolina': { normalized: 'North Carolina', fullName: 'North Carolina Tar Heels', conference: 'ACC' },
  'north carolina tar heels': { normalized: 'North Carolina', fullName: 'North Carolina Tar Heels', conference: 'ACC' },
  'unc': { normalized: 'North Carolina', fullName: 'North Carolina Tar Heels', conference: 'ACC' },
  'nc state': { normalized: 'NC State', fullName: 'NC State Wolfpack', conference: 'ACC' },
  'nc state wolfpack': { normalized: 'NC State', fullName: 'NC State Wolfpack', conference: 'ACC' },
  'north carolina state': { normalized: 'NC State', fullName: 'NC State Wolfpack', conference: 'ACC' },
  'virginia': { normalized: 'Virginia', fullName: 'Virginia Cavaliers', conference: 'ACC' },
  'virginia cavaliers': { normalized: 'Virginia', fullName: 'Virginia Cavaliers', conference: 'ACC' },
  'clemson': { normalized: 'Clemson', fullName: 'Clemson Tigers', conference: 'ACC' },
  'clemson tigers': { normalized: 'Clemson', fullName: 'Clemson Tigers', conference: 'ACC' },
  'miami': { normalized: 'Miami', fullName: 'Miami Hurricanes', conference: 'ACC' },
  'miami hurricanes': { normalized: 'Miami', fullName: 'Miami Hurricanes', conference: 'ACC' },
  'syracuse': { normalized: 'Syracuse', fullName: 'Syracuse Orange', conference: 'ACC' },
  'syracuse orange': { normalized: 'Syracuse', fullName: 'Syracuse Orange', conference: 'ACC' },
  'louisville': { normalized: 'Louisville', fullName: 'Louisville Cardinals', conference: 'ACC' },
  'louisville cardinals': { normalized: 'Louisville', fullName: 'Louisville Cardinals', conference: 'ACC' },
  
  // Big Ten
  'purdue': { normalized: 'Purdue', fullName: 'Purdue Boilermakers', conference: 'Big Ten' },
  'purdue boilermakers': { normalized: 'Purdue', fullName: 'Purdue Boilermakers', conference: 'Big Ten' },
  'illinois': { normalized: 'Illinois', fullName: 'Illinois Fighting Illini', conference: 'Big Ten' },
  'illinois fighting illini': { normalized: 'Illinois', fullName: 'Illinois Fighting Illini', conference: 'Big Ten' },
  'michigan': { normalized: 'Michigan', fullName: 'Michigan Wolverines', conference: 'Big Ten' },
  'michigan wolverines': { normalized: 'Michigan', fullName: 'Michigan Wolverines', conference: 'Big Ten' },
  'michigan state': { normalized: 'Michigan State', fullName: 'Michigan State Spartans', conference: 'Big Ten' },
  'michigan state spartans': { normalized: 'Michigan State', fullName: 'Michigan State Spartans', conference: 'Big Ten' },
  'msu': { normalized: 'Michigan State', fullName: 'Michigan State Spartans', conference: 'Big Ten' },
  'wisconsin': { normalized: 'Wisconsin', fullName: 'Wisconsin Badgers', conference: 'Big Ten' },
  'wisconsin badgers': { normalized: 'Wisconsin', fullName: 'Wisconsin Badgers', conference: 'Big Ten' },
  'indiana': { normalized: 'Indiana', fullName: 'Indiana Hoosiers', conference: 'Big Ten' },
  'indiana hoosiers': { normalized: 'Indiana', fullName: 'Indiana Hoosiers', conference: 'Big Ten' },
  'ohio state': { normalized: 'Ohio State', fullName: 'Ohio State Buckeyes', conference: 'Big Ten' },
  'ohio state buckeyes': { normalized: 'Ohio State', fullName: 'Ohio State Buckeyes', conference: 'Big Ten' },
  'iowa': { normalized: 'Iowa', fullName: 'Iowa Hawkeyes', conference: 'Big Ten' },
  'iowa hawkeyes': { normalized: 'Iowa', fullName: 'Iowa Hawkeyes', conference: 'Big Ten' },
  'nebraska': { normalized: 'Nebraska', fullName: 'Nebraska Cornhuskers', conference: 'Big Ten' },
  'nebraska cornhuskers': { normalized: 'Nebraska', fullName: 'Nebraska Cornhuskers', conference: 'Big Ten' },
  'northwestern': { normalized: 'Northwestern', fullName: 'Northwestern Wildcats', conference: 'Big Ten' },
  'northwestern wildcats': { normalized: 'Northwestern', fullName: 'Northwestern Wildcats', conference: 'Big Ten' },
  'rutgers': { normalized: 'Rutgers', fullName: 'Rutgers Scarlet Knights', conference: 'Big Ten' },
  'rutgers scarlet knights': { normalized: 'Rutgers', fullName: 'Rutgers Scarlet Knights', conference: 'Big Ten' },
  
  // Big 12
  'kansas': { normalized: 'Kansas', fullName: 'Kansas Jayhawks', conference: 'Big 12' },
  'kansas jayhawks': { normalized: 'Kansas', fullName: 'Kansas Jayhawks', conference: 'Big 12' },
  'ku': { normalized: 'Kansas', fullName: 'Kansas Jayhawks', conference: 'Big 12' },
  'iowa state': { normalized: 'Iowa State', fullName: 'Iowa State Cyclones', conference: 'Big 12' },
  'iowa state cyclones': { normalized: 'Iowa State', fullName: 'Iowa State Cyclones', conference: 'Big 12' },
  'baylor': { normalized: 'Baylor', fullName: 'Baylor Bears', conference: 'Big 12' },
  'baylor bears': { normalized: 'Baylor', fullName: 'Baylor Bears', conference: 'Big 12' },
  'texas': { normalized: 'Texas', fullName: 'Texas Longhorns', conference: 'Big 12' },
  'texas longhorns': { normalized: 'Texas', fullName: 'Texas Longhorns', conference: 'Big 12' },
  'texas tech': { normalized: 'Texas Tech', fullName: 'Texas Tech Red Raiders', conference: 'Big 12' },
  'texas tech red raiders': { normalized: 'Texas Tech', fullName: 'Texas Tech Red Raiders', conference: 'Big 12' },
  'kansas state': { normalized: 'Kansas State', fullName: 'Kansas State Wildcats', conference: 'Big 12' },
  'kansas state wildcats': { normalized: 'Kansas State', fullName: 'Kansas State Wildcats', conference: 'Big 12' },
  'byu': { normalized: 'BYU', fullName: 'BYU Cougars', conference: 'Big 12' },
  'byu cougars': { normalized: 'BYU', fullName: 'BYU Cougars', conference: 'Big 12' },
  
  // SEC
  'tennessee': { normalized: 'Tennessee', fullName: 'Tennessee Volunteers', conference: 'SEC' },
  'tennessee volunteers': { normalized: 'Tennessee', fullName: 'Tennessee Volunteers', conference: 'SEC' },
  'alabama': { normalized: 'Alabama', fullName: 'Alabama Crimson Tide', conference: 'SEC' },
  'alabama crimson tide': { normalized: 'Alabama', fullName: 'Alabama Crimson Tide', conference: 'SEC' },
  'kentucky': { normalized: 'Kentucky', fullName: 'Kentucky Wildcats', conference: 'SEC' },
  'kentucky wildcats': { normalized: 'Kentucky', fullName: 'Kentucky Wildcats', conference: 'SEC' },
  'auburn': { normalized: 'Auburn', fullName: 'Auburn Tigers', conference: 'SEC' },
  'auburn tigers': { normalized: 'Auburn', fullName: 'Auburn Tigers', conference: 'SEC' },
  'florida': { normalized: 'Florida', fullName: 'Florida Gators', conference: 'SEC' },
  'florida gators': { normalized: 'Florida', fullName: 'Florida Gators', conference: 'SEC' },
  'arkansas': { normalized: 'Arkansas', fullName: 'Arkansas Razorbacks', conference: 'SEC' },
  'arkansas razorbacks': { normalized: 'Arkansas', fullName: 'Arkansas Razorbacks', conference: 'SEC' },
  'lsu': { normalized: 'LSU', fullName: 'LSU Tigers', conference: 'SEC' },
  'lsu tigers': { normalized: 'LSU', fullName: 'LSU Tigers', conference: 'SEC' },
  'mississippi state': { normalized: 'Mississippi State', fullName: 'Mississippi State Bulldogs', conference: 'SEC' },
  'mississippi state bulldogs': { normalized: 'Mississippi State', fullName: 'Mississippi State Bulldogs', conference: 'SEC' },
  'ole miss': { normalized: 'Ole Miss', fullName: 'Ole Miss Rebels', conference: 'SEC' },
  'ole miss rebels': { normalized: 'Ole Miss', fullName: 'Ole Miss Rebels', conference: 'SEC' },
  'georgia': { normalized: 'Georgia', fullName: 'Georgia Bulldogs', conference: 'SEC' },
  'georgia bulldogs': { normalized: 'Georgia', fullName: 'Georgia Bulldogs', conference: 'SEC' },
  'missouri': { normalized: 'Missouri', fullName: 'Missouri Tigers', conference: 'SEC' },
  'missouri tigers': { normalized: 'Missouri', fullName: 'Missouri Tigers', conference: 'SEC' },
  'vanderbilt': { normalized: 'Vanderbilt', fullName: 'Vanderbilt Commodores', conference: 'SEC' },
  'vanderbilt commodores': { normalized: 'Vanderbilt', fullName: 'Vanderbilt Commodores', conference: 'SEC' },
  
  // Big East
  'uconn': { normalized: 'UConn', fullName: 'UConn Huskies', conference: 'Big East' },
  'uconn huskies': { normalized: 'UConn', fullName: 'UConn Huskies', conference: 'Big East' },
  'connecticut': { normalized: 'UConn', fullName: 'UConn Huskies', conference: 'Big East' },
  'creighton': { normalized: 'Creighton', fullName: 'Creighton Bluejays', conference: 'Big East' },
  'creighton bluejays': { normalized: 'Creighton', fullName: 'Creighton Bluejays', conference: 'Big East' },
  "st. john's": { normalized: "St. John's", fullName: "St. John's Red Storm", conference: 'Big East' },
  "st. john's red storm": { normalized: "St. John's", fullName: "St. John's Red Storm", conference: 'Big East' },
  "st john's": { normalized: "St. John's", fullName: "St. John's Red Storm", conference: 'Big East' },
  'villanova': { normalized: 'Villanova', fullName: 'Villanova Wildcats', conference: 'Big East' },
  'villanova wildcats': { normalized: 'Villanova', fullName: 'Villanova Wildcats', conference: 'Big East' },
  'marquette': { normalized: 'Marquette', fullName: 'Marquette Golden Eagles', conference: 'Big East' },
  'marquette golden eagles': { normalized: 'Marquette', fullName: 'Marquette Golden Eagles', conference: 'Big East' },
  'xavier': { normalized: 'Xavier', fullName: 'Xavier Musketeers', conference: 'Big East' },
  'xavier musketeers': { normalized: 'Xavier', fullName: 'Xavier Musketeers', conference: 'Big East' },
  'butler': { normalized: 'Butler', fullName: 'Butler Bulldogs', conference: 'Big East' },
  'butler bulldogs': { normalized: 'Butler', fullName: 'Butler Bulldogs', conference: 'Big East' },
  'seton hall': { normalized: 'Seton Hall', fullName: 'Seton Hall Pirates', conference: 'Big East' },
  'seton hall pirates': { normalized: 'Seton Hall', fullName: 'Seton Hall Pirates', conference: 'Big East' },
  
  // Pac-12 / West Coast
  'arizona': { normalized: 'Arizona', fullName: 'Arizona Wildcats', conference: 'Big 12' },
  'arizona wildcats': { normalized: 'Arizona', fullName: 'Arizona Wildcats', conference: 'Big 12' },
  'ucla': { normalized: 'UCLA', fullName: 'UCLA Bruins', conference: 'Big Ten' },
  'ucla bruins': { normalized: 'UCLA', fullName: 'UCLA Bruins', conference: 'Big Ten' },
  'usc': { normalized: 'USC', fullName: 'USC Trojans', conference: 'Big Ten' },
  'usc trojans': { normalized: 'USC', fullName: 'USC Trojans', conference: 'Big Ten' },
  'oregon': { normalized: 'Oregon', fullName: 'Oregon Ducks', conference: 'Big Ten' },
  'oregon ducks': { normalized: 'Oregon', fullName: 'Oregon Ducks', conference: 'Big Ten' },
  'gonzaga': { normalized: 'Gonzaga', fullName: 'Gonzaga Bulldogs', conference: 'WCC' },
  'gonzaga bulldogs': { normalized: 'Gonzaga', fullName: 'Gonzaga Bulldogs', conference: 'WCC' },
  "saint mary's": { normalized: "Saint Mary's", fullName: "Saint Mary's Gaels", conference: 'WCC' },
  "saint mary's gaels": { normalized: "Saint Mary's", fullName: "Saint Mary's Gaels", conference: 'WCC' },
  "st. mary's": { normalized: "Saint Mary's", fullName: "Saint Mary's Gaels", conference: 'WCC' },
  
  // Additional notable teams
  'houston': { normalized: 'Houston', fullName: 'Houston Cougars', conference: 'Big 12' },
  'houston cougars': { normalized: 'Houston', fullName: 'Houston Cougars', conference: 'Big 12' },
  'cincinnati': { normalized: 'Cincinnati', fullName: 'Cincinnati Bearcats', conference: 'Big 12' },
  'cincinnati bearcats': { normalized: 'Cincinnati', fullName: 'Cincinnati Bearcats', conference: 'Big 12' },
  'notre dame': { normalized: 'Notre Dame', fullName: 'Notre Dame Fighting Irish', conference: 'ACC' },
  'notre dame fighting irish': { normalized: 'Notre Dame', fullName: 'Notre Dame Fighting Irish', conference: 'ACC' },
  'memphis': { normalized: 'Memphis', fullName: 'Memphis Tigers', conference: 'AAC' },
  'memphis tigers': { normalized: 'Memphis', fullName: 'Memphis Tigers', conference: 'AAC' },
  'san diego state': { normalized: 'San Diego State', fullName: 'San Diego State Aztecs', conference: 'MWC' },
  'san diego state aztecs': { normalized: 'San Diego State', fullName: 'San Diego State Aztecs', conference: 'MWC' },
  'sdsu': { normalized: 'San Diego State', fullName: 'San Diego State Aztecs', conference: 'MWC' },
  
  // Smaller schools that appear in data
  'toledo': { normalized: 'Toledo', fullName: 'Toledo Rockets', conference: 'MAC' },
  'toledo rockets': { normalized: 'Toledo', fullName: 'Toledo Rockets', conference: 'MAC' },
  'troy': { normalized: 'Troy', fullName: 'Troy Trojans', conference: 'Sun Belt' },
  'troy trojans': { normalized: 'Troy', fullName: 'Troy Trojans', conference: 'Sun Belt' },
  'towson': { normalized: 'Towson', fullName: 'Towson Tigers', conference: 'CAA' },
  'towson tigers': { normalized: 'Towson', fullName: 'Towson Tigers', conference: 'CAA' },
  'rhode island': { normalized: 'Rhode Island', fullName: 'Rhode Island Rams', conference: 'A-10' },
  'rhode island rams': { normalized: 'Rhode Island', fullName: 'Rhode Island Rams', conference: 'A-10' },
  'stony brook': { normalized: 'Stony Brook', fullName: 'Stony Brook Seawolves', conference: 'CAA' },
  'stony brook seawolves': { normalized: 'Stony Brook', fullName: 'Stony Brook Seawolves', conference: 'CAA' },
  'pacific': { normalized: 'Pacific', fullName: 'Pacific Tigers', conference: 'WCC' },
  'pacific tigers': { normalized: 'Pacific', fullName: 'Pacific Tigers', conference: 'WCC' },
  'bowling green': { normalized: 'Bowling Green', fullName: 'Bowling Green Falcons', conference: 'MAC' },
  'bowling green falcons': { normalized: 'Bowling Green', fullName: 'Bowling Green Falcons', conference: 'MAC' },
  'bucknell': { normalized: 'Bucknell', fullName: 'Bucknell Bison', conference: 'Patriot' },
  'bucknell bison': { normalized: 'Bucknell', fullName: 'Bucknell Bison', conference: 'Patriot' },
  'massachusetts': { normalized: 'UMass', fullName: 'UMass Minutemen', conference: 'A-10' },
  'umass': { normalized: 'UMass', fullName: 'UMass Minutemen', conference: 'A-10' },
  'umass minutemen': { normalized: 'UMass', fullName: 'UMass Minutemen', conference: 'A-10' },
  'oregon state': { normalized: 'Oregon State', fullName: 'Oregon State Beavers', conference: 'WCC' },
  'oregon state beavers': { normalized: 'Oregon State', fullName: 'Oregon State Beavers', conference: 'WCC' },
  'vermont': { normalized: 'Vermont', fullName: 'Vermont Catamounts', conference: 'America East' },
  'vermont catamounts': { normalized: 'Vermont', fullName: 'Vermont Catamounts', conference: 'America East' },
  'liberty': { normalized: 'Liberty', fullName: 'Liberty Flames', conference: 'CUSA' },
  'liberty flames': { normalized: 'Liberty', fullName: 'Liberty Flames', conference: 'CUSA' },
  'belmont': { normalized: 'Belmont', fullName: 'Belmont Bruins', conference: 'MVC' },
  'belmont bruins': { normalized: 'Belmont', fullName: 'Belmont Bruins', conference: 'MVC' },
  'uab': { normalized: 'UAB', fullName: 'UAB Blazers', conference: 'AAC' },
  'uab blazers': { normalized: 'UAB', fullName: 'UAB Blazers', conference: 'AAC' },
  'southern illinois': { normalized: 'Southern Illinois', fullName: 'Southern Illinois Salukis', conference: 'MVC' },
  'southern illinois salukis': { normalized: 'Southern Illinois', fullName: 'Southern Illinois Salukis', conference: 'MVC' },
  'boise state': { normalized: 'Boise State', fullName: 'Boise State Broncos', conference: 'MWC' },
  'boise state broncos': { normalized: 'Boise State', fullName: 'Boise State Broncos', conference: 'MWC' },
  'temple': { normalized: 'Temple', fullName: 'Temple Owls', conference: 'AAC' },
  'temple owls': { normalized: 'Temple', fullName: 'Temple Owls', conference: 'AAC' },
  'uc san diego': { normalized: 'UC San Diego', fullName: 'UC San Diego Tritons', conference: 'Big West' },
  'uc san diego tritons': { normalized: 'UC San Diego', fullName: 'UC San Diego Tritons', conference: 'Big West' },
};

/**
 * Normalize team name to consistent format
 * @param {string} teamName - Raw team name from data source
 * @returns {string} - Normalized team name
 */
export function normalizeTeamName(teamName) {
  if (!teamName) return null;
  
  // Clean the input
  const cleaned = teamName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')  // Normalize whitespace
    .replace(/[#0-9]+/g, '') // Remove rankings like "#1" or "#20"
    .replace(/\([^)]*\)/g, '') // Remove parentheses and contents like "(5-0)"
    .trim();
  
  // Direct lookup
  if (TEAM_MAP[cleaned]) {
    return TEAM_MAP[cleaned].normalized;
  }
  
  // Try partial matches (e.g., "Kansas" matches "Kansas Jayhawks")
  for (const [key, value] of Object.entries(TEAM_MAP)) {
    if (key.includes(cleaned) || cleaned.includes(key)) {
      return value.normalized;
    }
  }
  
  // If no match found, return titlecased version
  return teamName
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Get full team information
 * @param {string} teamName - Raw or normalized team name
 * @returns {object|null} - Team info or null
 */
export function getTeamInfo(teamName) {
  const normalized = normalizeTeamName(teamName);
  if (!normalized) return null;
  
  // Find by normalized name
  for (const value of Object.values(TEAM_MAP)) {
    if (value.normalized === normalized) {
      return value;
    }
  }
  
  return null;
}

/**
 * Check if two team names refer to the same team
 * @param {string} team1 - First team name
 * @param {string} team2 - Second team name
 * @returns {boolean} - True if same team
 */
export function isSameTeam(team1, team2) {
  const norm1 = normalizeTeamName(team1);
  const norm2 = normalizeTeamName(team2);
  return norm1 && norm2 && norm1 === norm2;
}

export { TEAM_MAP };

