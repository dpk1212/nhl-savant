/**
 * teamIdentity — crest abbreviation + brand colors for NHL / NBA / MLB.
 *
 * Powers the premium pick-card crest (the colored monogram tile). Keyed by
 * full team name; resolver tolerates partial / last-word matches and falls
 * back to a league-tinted crest with a derived monogram so an unknown team
 * (or a totals pick with no side) never breaks the card.
 */

// { c1: primary, c2: secondary, abbr }
const TEAMS = {
  // ── NHL ──
  'Anaheim Ducks':        { abbr: 'ANA', c1: '#F47A38', c2: '#B09862' },
  'Boston Bruins':        { abbr: 'BOS', c1: '#FFB81C', c2: '#111111' },
  'Buffalo Sabres':       { abbr: 'BUF', c1: '#003087', c2: '#FFB81C' },
  'Calgary Flames':       { abbr: 'CGY', c1: '#D2001C', c2: '#FAAF19' },
  'Carolina Hurricanes':  { abbr: 'CAR', c1: '#CC0000', c2: '#111111' },
  'Chicago Blackhawks':   { abbr: 'CHI', c1: '#CF0A2C', c2: '#111111' },
  'Colorado Avalanche':   { abbr: 'COL', c1: '#6F263D', c2: '#236192' },
  'Columbus Blue Jackets':{ abbr: 'CBJ', c1: '#002654', c2: '#CE1126' },
  'Dallas Stars':         { abbr: 'DAL', c1: '#006847', c2: '#111111' },
  'Detroit Red Wings':    { abbr: 'DET', c1: '#CE1126', c2: '#FFFFFF' },
  'Edmonton Oilers':      { abbr: 'EDM', c1: '#FF4C00', c2: '#041E42' },
  'Florida Panthers':     { abbr: 'FLA', c1: '#C8102E', c2: '#041E42' },
  'Los Angeles Kings':    { abbr: 'LAK', c1: '#111111', c2: '#A2AAAD' },
  'Minnesota Wild':       { abbr: 'MIN', c1: '#154734', c2: '#A6192E' },
  'Montreal Canadiens':   { abbr: 'MTL', c1: '#AF1E2D', c2: '#192168' },
  'Nashville Predators':  { abbr: 'NSH', c1: '#FFB81C', c2: '#041E42' },
  'New Jersey Devils':    { abbr: 'NJD', c1: '#CE1126', c2: '#111111' },
  'New York Islanders':   { abbr: 'NYI', c1: '#00539B', c2: '#F47D30' },
  'New York Rangers':     { abbr: 'NYR', c1: '#0038A8', c2: '#CE1126' },
  'Ottawa Senators':      { abbr: 'OTT', c1: '#C8102E', c2: '#C2912C' },
  'Philadelphia Flyers':  { abbr: 'PHI', c1: '#F74902', c2: '#111111' },
  'Pittsburgh Penguins':  { abbr: 'PIT', c1: '#FCB514', c2: '#111111' },
  'San Jose Sharks':      { abbr: 'SJS', c1: '#006D75', c2: '#EA7200' },
  'Seattle Kraken':       { abbr: 'SEA', c1: '#001628', c2: '#99D9D9' },
  'St. Louis Blues':      { abbr: 'STL', c1: '#002F87', c2: '#FCB514' },
  'Tampa Bay Lightning':  { abbr: 'TBL', c1: '#002868', c2: '#FFFFFF' },
  'Toronto Maple Leafs':  { abbr: 'TOR', c1: '#00205B', c2: '#FFFFFF' },
  'Utah Hockey Club':     { abbr: 'UTA', c1: '#69BE28', c2: '#010101' },
  'Utah Mammoth':         { abbr: 'UTA', c1: '#69BE28', c2: '#010101' },
  'Vancouver Canucks':    { abbr: 'VAN', c1: '#00205B', c2: '#00843D' },
  'Vegas Golden Knights': { abbr: 'VGK', c1: '#B4975A', c2: '#333F42' },
  'Washington Capitals':  { abbr: 'WSH', c1: '#041E42', c2: '#C8102E' },
  'Winnipeg Jets':        { abbr: 'WPG', c1: '#041E42', c2: '#004C97' },

  // ── NBA ──
  'Atlanta Hawks':            { abbr: 'ATL', c1: '#E03A3E', c2: '#26282A' },
  'Boston Celtics':           { abbr: 'BOS', c1: '#007A33', c2: '#BA9653' },
  'Brooklyn Nets':            { abbr: 'BKN', c1: '#111111', c2: '#FFFFFF' },
  'Charlotte Hornets':        { abbr: 'CHA', c1: '#1D1160', c2: '#00788C' },
  'Chicago Bulls':            { abbr: 'CHI', c1: '#CE1141', c2: '#111111' },
  'Cleveland Cavaliers':      { abbr: 'CLE', c1: '#860038', c2: '#FDBB30' },
  'Dallas Mavericks':         { abbr: 'DAL', c1: '#00538C', c2: '#002B5E' },
  'Denver Nuggets':           { abbr: 'DEN', c1: '#0E2240', c2: '#FEC524' },
  'Detroit Pistons':          { abbr: 'DET', c1: '#C8102E', c2: '#1D42BA' },
  'Golden State Warriors':    { abbr: 'GSW', c1: '#1D428A', c2: '#FFC72C' },
  'Houston Rockets':          { abbr: 'HOU', c1: '#CE1141', c2: '#111111' },
  'Indiana Pacers':           { abbr: 'IND', c1: '#002D62', c2: '#FDBB30' },
  'LA Clippers':              { abbr: 'LAC', c1: '#C8102E', c2: '#1D428A' },
  'Los Angeles Clippers':     { abbr: 'LAC', c1: '#C8102E', c2: '#1D428A' },
  'Los Angeles Lakers':       { abbr: 'LAL', c1: '#552583', c2: '#FDB927' },
  'Memphis Grizzlies':        { abbr: 'MEM', c1: '#5D76A9', c2: '#12173F' },
  'Miami Heat':               { abbr: 'MIA', c1: '#98002E', c2: '#F9A01B' },
  'Milwaukee Bucks':          { abbr: 'MIL', c1: '#00471B', c2: '#EEE1C6' },
  'Minnesota Timberwolves':   { abbr: 'MIN', c1: '#0C2340', c2: '#236192' },
  'New Orleans Pelicans':     { abbr: 'NOP', c1: '#0C2340', c2: '#C8102E' },
  'New York Knicks':          { abbr: 'NYK', c1: '#006BB6', c2: '#F58426' },
  'Oklahoma City Thunder':    { abbr: 'OKC', c1: '#007AC1', c2: '#EF3B24' },
  'Orlando Magic':            { abbr: 'ORL', c1: '#0077C0', c2: '#111111' },
  'Philadelphia 76ers':       { abbr: 'PHI', c1: '#006BB6', c2: '#ED174C' },
  'Phoenix Suns':             { abbr: 'PHX', c1: '#1D1160', c2: '#E56020' },
  'Portland Trail Blazers':   { abbr: 'POR', c1: '#E03A3E', c2: '#111111' },
  'Sacramento Kings':         { abbr: 'SAC', c1: '#5A2D81', c2: '#63727A' },
  'San Antonio Spurs':        { abbr: 'SAS', c1: '#111111', c2: '#C4CED4' },
  'Toronto Raptors':          { abbr: 'TOR', c1: '#CE1141', c2: '#111111' },
  'Utah Jazz':                { abbr: 'UTA', c1: '#002B5C', c2: '#F9A01B' },
  'Washington Wizards':       { abbr: 'WAS', c1: '#002B5C', c2: '#E31837' },

  // ── MLB ──
  'Arizona Diamondbacks':     { abbr: 'AZ',  c1: '#A71930', c2: '#E3D4AD' },
  'Atlanta Braves':           { abbr: 'ATL', c1: '#CE1141', c2: '#13274F' },
  'Baltimore Orioles':        { abbr: 'BAL', c1: '#DF4601', c2: '#111111' },
  'Boston Red Sox':           { abbr: 'BOS', c1: '#BD3039', c2: '#0C2340' },
  'Chicago Cubs':             { abbr: 'CHC', c1: '#0E3386', c2: '#CC3433' },
  'Chicago White Sox':        { abbr: 'CWS', c1: '#27251F', c2: '#C4CED4' },
  'Cincinnati Reds':          { abbr: 'CIN', c1: '#C6011F', c2: '#111111' },
  'Cleveland Guardians':      { abbr: 'CLE', c1: '#00385D', c2: '#E50022' },
  'Colorado Rockies':         { abbr: 'COL', c1: '#33006F', c2: '#C4CED4' },
  'Detroit Tigers':           { abbr: 'DET', c1: '#0C2340', c2: '#FA4616' },
  'Houston Astros':           { abbr: 'HOU', c1: '#002D62', c2: '#EB6E1F' },
  'Kansas City Royals':       { abbr: 'KC',  c1: '#004687', c2: '#BD9B60' },
  'Los Angeles Angels':       { abbr: 'LAA', c1: '#003263', c2: '#BA0021' },
  'Los Angeles Dodgers':      { abbr: 'LAD', c1: '#005A9C', c2: '#EF3E42' },
  'Miami Marlins':            { abbr: 'MIA', c1: '#00A3E0', c2: '#111111' },
  'Milwaukee Brewers':        { abbr: 'MIL', c1: '#12284B', c2: '#FFC52F' },
  'Minnesota Twins':          { abbr: 'MIN', c1: '#002B5C', c2: '#D31145' },
  'New York Mets':            { abbr: 'NYM', c1: '#002D72', c2: '#FF5910' },
  'New York Yankees':         { abbr: 'NYY', c1: '#0C2340', c2: '#FFFFFF' },
  'Athletics':                { abbr: 'ATH', c1: '#003831', c2: '#EFB21E' },
  'Oakland Athletics':        { abbr: 'OAK', c1: '#003831', c2: '#EFB21E' },
  'Philadelphia Phillies':    { abbr: 'PHI', c1: '#E81828', c2: '#002D72' },
  'Pittsburgh Pirates':       { abbr: 'PIT', c1: '#27251F', c2: '#FDB827' },
  'San Diego Padres':         { abbr: 'SD',  c1: '#2F241D', c2: '#FFC425' },
  'San Francisco Giants':     { abbr: 'SF',  c1: '#FD5A1E', c2: '#27251F' },
  'Seattle Mariners':         { abbr: 'SEA', c1: '#0C2C56', c2: '#005C5C' },
  'St. Louis Cardinals':      { abbr: 'STL', c1: '#C41E3A', c2: '#0C2340' },
  'Tampa Bay Rays':           { abbr: 'TB',  c1: '#092C5C', c2: '#8FBCE6' },
  'Texas Rangers':            { abbr: 'TEX', c1: '#003278', c2: '#C0111F' },
  'Toronto Blue Jays':        { abbr: 'TOR', c1: '#134A8E', c2: '#1D2D5C' },
  'Washington Nationals':     { abbr: 'WSH', c1: '#AB0003', c2: '#14225A' },
};

const LEAGUE_FALLBACK = {
  NHL: { c1: '#1f3a5f', c2: '#0b1f33' },
  NBA: { c1: '#c8553d', c2: '#3a1f1a' },
  WNBA: { c1: '#F472B6', c2: '#3b1028' },
  MLB: { c1: '#1d3557', c2: '#0d1b2a' },
  CBB: { c1: '#FF6B35', c2: '#2a1206' },
  SOC: { c1: '#2ECC71', c2: '#0d3320' },
  UFC: { c1: '#C0392B', c2: '#2a0f0c' },
};

function deriveAbbr(name) {
  if (!name) return '?';
  const clean = String(name).replace(/\b(Over|Under)\b.*/i, '').trim();
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  const last = words[words.length - 1];
  return last.slice(0, 3).toUpperCase();
}

/**
 * Resolve a crest identity for a team name within a sport/league.
 * @returns {{ abbr: string, c1: string, c2: string }}
 */
export function getTeamIdentity(name, sport) {
  const league = (sport || '').toUpperCase();
  if (name && TEAMS[name]) return TEAMS[name];

  // Tolerant match: exact-insensitive, then last-word / inclusion.
  if (name) {
    const lower = name.toLowerCase();
    for (const key of Object.keys(TEAMS)) {
      const k = key.toLowerCase();
      if (k === lower || lower.includes(k) || k.includes(lower)) return TEAMS[key];
    }
    const lastWord = name.trim().split(/\s+/).pop()?.toLowerCase();
    if (lastWord && lastWord.length > 3) {
      for (const key of Object.keys(TEAMS)) {
        if (key.toLowerCase().endsWith(lastWord)) return TEAMS[key];
      }
    }
  }

  const fb = LEAGUE_FALLBACK[league] || { c1: '#334155', c2: '#1e293b' };
  return { abbr: name ? deriveAbbr(name) : league.slice(0, 3) || '—', c1: fb.c1, c2: fb.c2 };
}
