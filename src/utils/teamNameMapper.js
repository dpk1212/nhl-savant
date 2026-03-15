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
  'Utah Mammoth': 'UTA',  // Alternative name for Utah
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

const NHL_CANON = {};
for (const [fullName, code] of Object.entries(TEAM_NAME_MAP)) {
  const parts = fullName.toLowerCase().split(/\s+/);
  NHL_CANON[code.toLowerCase()] = code;
  NHL_CANON[fullName.toLowerCase()] = code;
  for (const p of parts) {
    if (p.length >= 4 && !NHL_CANON[p]) NHL_CANON[p] = code;
  }
}
Object.assign(NHL_CANON, {
  ana: 'ANA', mtl: 'MTL', sjs: 'SJS', stl: 'STL', lak: 'LAK',
  tbl: 'TBL', tb: 'TBL', vgk: 'VGK', cbj: 'CBJ', njd: 'NJD',
  nyi: 'NYI', nyr: 'NYR', wsh: 'WSH', wpg: 'WPG', phi: 'PHI',
  pit: 'PIT', ott: 'OTT', det: 'DET', dal: 'DAL', col: 'COL',
  chi: 'CHI', car: 'CAR', cgy: 'CGY', buf: 'BUF', bos: 'BOS',
  edm: 'EDM', fla: 'FLA', min: 'MIN', nsh: 'NSH', sea: 'SEA',
  tor: 'TOR', uta: 'UTA', van: 'VAN',
  jose: 'SJS', 'st.': 'STL',
});

/**
 * Resolve a team name variant (abbreviation, city, nickname) to a canonical code.
 * Works for NHL; returns null for unrecognized names.
 */
export function canonicalizeTeam(name) {
  if (!name) return null;
  return NHL_CANON[name.toLowerCase().trim()] || null;
}

/**
 * Determine if an outcome string (from Polymarket/Kalshi trade data) matches
 * the away or home team. Handles abbreviations, city names, and nicknames
 * across different data sources without false-positive substring matches.
 *
 * @returns {'away' | 'home' | null}
 */
export function resolveOutcomeSide(outcome, away, home) {
  if (!outcome) return null;
  const o = outcome.toLowerCase().trim();
  if (o === 'yes') return 'away';
  if (o === 'no') return 'home';

  const canonOut = canonicalizeTeam(outcome);
  if (canonOut) {
    if (canonOut === canonicalizeTeam(away)) return 'away';
    if (canonOut === canonicalizeTeam(home)) return 'home';
  }

  const nO = o.replace(/[^a-z0-9]/g, '');
  const awayWords = away.toLowerCase().split(/\s+/).filter(w => w.length >= 4);
  const homeWords = home.toLowerCase().split(/\s+/).filter(w => w.length >= 4);
  for (const w of awayWords) { if (nO.includes(w) || w.includes(nO)) return 'away'; }
  for (const w of homeWords) { if (nO.includes(w) || w.includes(nO)) return 'home'; }

  return null;
}

