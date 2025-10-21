/**
 * Team Name Mapper - Convert full team names to abbreviations
 * Used for backtesting where game results use full names but model uses codes
 */

export const TEAM_NAME_MAP = {
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
  'Utah Hockey Club': 'UTA',
  'Vancouver Canucks': 'VAN',
  'Vegas Golden Knights': 'VGK',
  'Washington Capitals': 'WSH',
  'Winnipeg Jets': 'WPG'
};

// Reverse mapping (code -> full name)
export const CODE_TO_NAME = Object.fromEntries(
  Object.entries(TEAM_NAME_MAP).map(([name, code]) => [code, name])
);

/**
 * Convert full team name to abbreviation
 * @param {string} fullName - Full team name (e.g., "Boston Bruins")
 * @returns {string|null} Team code (e.g., "BOS") or null if not found
 */
export function getTeamCode(fullName) {
  return TEAM_NAME_MAP[fullName] || null;
}

/**
 * Convert team code to full name
 * @param {string} code - Team code (e.g., "BOS")
 * @returns {string|null} Full name (e.g., "Boston Bruins") or null if not found
 */
export function getTeamName(code) {
  return CODE_TO_NAME[code] || null;
}

/**
 * Check if a team name/code is valid
 * @param {string} team - Team name or code
 * @returns {boolean} True if valid
 */
export function isValidTeam(team) {
  return TEAM_NAME_MAP[team] !== undefined || CODE_TO_NAME[team] !== undefined;
}

