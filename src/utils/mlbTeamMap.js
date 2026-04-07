/**
 * MLB Team Name Normalization
 *
 * Maps every known variant (Odds API, DRatings, Dimers, abbreviations,
 * city-only, mascot-only) to a canonical lowercase 3-letter code that
 * matches the codes used in snapshotPinnacle.js.
 */

const CANONICAL = {
  'Arizona Diamondbacks': 'ari', 'Diamondbacks': 'ari', 'D-Backs': 'ari', 'ARI': 'ari', 'Arizona': 'ari',
  'Atlanta Braves': 'atl', 'Braves': 'atl', 'ATL': 'atl', 'Atlanta': 'atl',
  'Baltimore Orioles': 'bal', 'Orioles': 'bal', 'BAL': 'bal', 'Baltimore': 'bal',
  'Boston Red Sox': 'bos', 'Red Sox': 'bos', 'BOS': 'bos', 'Boston': 'bos',
  'Chicago Cubs': 'chc', 'Cubs': 'chc', 'CHC': 'chc',
  'Chicago White Sox': 'cws', 'White Sox': 'cws', 'CWS': 'cws',
  'Cincinnati Reds': 'cin', 'Reds': 'cin', 'CIN': 'cin', 'Cincinnati': 'cin',
  'Cleveland Guardians': 'cle', 'Guardians': 'cle', 'CLE': 'cle', 'Cleveland': 'cle',
  'Colorado Rockies': 'col', 'Rockies': 'col', 'COL': 'col', 'Colorado': 'col',
  'Detroit Tigers': 'det', 'Tigers': 'det', 'DET': 'det', 'Detroit': 'det',
  'Houston Astros': 'hou', 'Astros': 'hou', 'HOU': 'hou', 'Houston': 'hou',
  'Kansas City Royals': 'kcr', 'Royals': 'kcr', 'KCR': 'kcr', 'KC': 'kcr', 'Kansas City': 'kcr',
  'Los Angeles Angels': 'laa', 'Angels': 'laa', 'LAA': 'laa',
  'Los Angeles Dodgers': 'lad', 'Dodgers': 'lad', 'LAD': 'lad',
  'Miami Marlins': 'mia', 'Marlins': 'mia', 'MIA': 'mia', 'Miami': 'mia',
  'Milwaukee Brewers': 'mil', 'Brewers': 'mil', 'MIL': 'mil', 'Milwaukee': 'mil',
  'Minnesota Twins': 'min', 'Twins': 'min', 'MIN': 'min', 'Minnesota': 'min',
  'New York Mets': 'nym', 'Mets': 'nym', 'NYM': 'nym',
  'New York Yankees': 'nyy', 'Yankees': 'nyy', 'NYY': 'nyy',
  'Oakland Athletics': 'oak', 'Athletics': 'oak', 'OAK': 'oak', 'Oakland': 'oak',
  'Sacramento Athletics': 'oak',
  'Philadelphia Phillies': 'phi', 'Phillies': 'phi', 'PHI': 'phi', 'Philadelphia': 'phi',
  'Pittsburgh Pirates': 'pit', 'Pirates': 'pit', 'PIT': 'pit', 'Pittsburgh': 'pit',
  'San Diego Padres': 'sdp', 'Padres': 'sdp', 'SDP': 'sdp', 'SD': 'sdp', 'San Diego': 'sdp',
  'San Francisco Giants': 'sfg', 'Giants': 'sfg', 'SFG': 'sfg', 'SF': 'sfg', 'San Francisco': 'sfg',
  'Seattle Mariners': 'sea', 'Mariners': 'sea', 'SEA': 'sea', 'Seattle': 'sea',
  'St. Louis Cardinals': 'stl', 'St Louis Cardinals': 'stl', 'Cardinals': 'stl', 'STL': 'stl', 'St. Louis': 'stl',
  'Tampa Bay Rays': 'tbr', 'Rays': 'tbr', 'TBR': 'tbr', 'TB': 'tbr', 'Tampa Bay': 'tbr',
  'Texas Rangers': 'tex', 'Rangers': 'tex', 'TEX': 'tex', 'Texas': 'tex',
  'Toronto Blue Jays': 'tor', 'Blue Jays': 'tor', 'TOR': 'tor', 'Toronto': 'tor',
  'Washington Nationals': 'wsh', 'Nationals': 'wsh', 'WSH': 'wsh', 'Washington': 'wsh',
};

const CODE_TO_FULL = {
  ari: 'Arizona Diamondbacks', atl: 'Atlanta Braves', bal: 'Baltimore Orioles',
  bos: 'Boston Red Sox', chc: 'Chicago Cubs', cws: 'Chicago White Sox',
  cin: 'Cincinnati Reds', cle: 'Cleveland Guardians', col: 'Colorado Rockies',
  det: 'Detroit Tigers', hou: 'Houston Astros', kcr: 'Kansas City Royals',
  laa: 'Los Angeles Angels', lad: 'Los Angeles Dodgers', mia: 'Miami Marlins',
  mil: 'Milwaukee Brewers', min: 'Minnesota Twins', nym: 'New York Mets',
  nyy: 'New York Yankees', oak: 'Oakland Athletics', phi: 'Philadelphia Phillies',
  pit: 'Pittsburgh Pirates', sdp: 'San Diego Padres', sfg: 'San Francisco Giants',
  sea: 'Seattle Mariners', stl: 'St. Louis Cardinals', tbr: 'Tampa Bay Rays',
  tex: 'Texas Rangers', tor: 'Toronto Blue Jays', wsh: 'Washington Nationals',
};

/**
 * Normalize any team name variant to a canonical 3-letter lowercase code.
 * Returns null if no match is found.
 */
export function normalizeMLBTeam(name) {
  if (!name) return null;
  const trimmed = name.trim();

  // Direct lookup first
  if (CANONICAL[trimmed]) return CANONICAL[trimmed];

  // Case-insensitive fallback
  const lower = trimmed.toLowerCase();
  for (const [key, code] of Object.entries(CANONICAL)) {
    if (key.toLowerCase() === lower) return code;
  }

  // Partial match: check if the input contains a known mascot or city
  for (const [key, code] of Object.entries(CANONICAL)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return code;
    }
  }

  return null;
}

/**
 * Get full team name from a canonical code.
 */
export function fullTeamName(code) {
  return CODE_TO_FULL[code] || code;
}

export { CANONICAL, CODE_TO_FULL };
