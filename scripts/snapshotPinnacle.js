/**
 * Sharp Odds Snapshot — captures Pinnacle (fair value) + retail book
 * prices every 15 minutes for all active sports. Piggybacked on the
 * fetch-polymarket workflow.
 *
 * For each game: tracks Pinnacle opener, current, movement, plus the
 * best retail price per side and which book offers it. The UI uses
 * this to calculate EV = best_retail_implied - pinnacle_implied.
 *
 * Usage: node scripts/snapshotPinnacle.js
 */

import * as dotenv from 'dotenv';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
dotenv.config({ path: join(ROOT, '.env') });

const API_KEY = process.env.ODDS_API_KEY;
if (!API_KEY) {
  console.log('⚠️ No ODDS_API_KEY — skipping odds snapshot');
  process.exit(0);
}

const SPORTS = [
  { key: 'icehockey_nhl', label: 'NHL' },
  { key: 'basketball_ncaab', label: 'CBB' },
  { key: 'baseball_mlb', label: 'MLB' },
];

const BOOKMAKERS = 'pinnacle,draftkings,fanduel,betmgm,caesars';
const RETAIL_BOOKS = ['draftkings', 'fanduel', 'betmgm', 'caesars'];
const MAX_HISTORY = 24;
const STALE_HOURS = 36;
const COMPLETED_HOURS = 6;
const OUT_PATH = join(ROOT, 'public', 'pinnacle_history.json');

const NHL_CODES = {
  'Anaheim Ducks': 'ana', 'Boston Bruins': 'bos', 'Buffalo Sabres': 'buf',
  'Calgary Flames': 'cgy', 'Carolina Hurricanes': 'car', 'Chicago Blackhawks': 'chi',
  'Colorado Avalanche': 'col', 'Columbus Blue Jackets': 'cbj', 'Dallas Stars': 'dal',
  'Detroit Red Wings': 'det', 'Edmonton Oilers': 'edm', 'Florida Panthers': 'fla',
  'Los Angeles Kings': 'lak', 'Minnesota Wild': 'min', 'Montreal Canadiens': 'mtl',
  'Montréal Canadiens': 'mtl', 'Nashville Predators': 'nsh', 'New Jersey Devils': 'njd',
  'New York Islanders': 'nyi', 'New York Rangers': 'nyr', 'Ottawa Senators': 'ott',
  'Philadelphia Flyers': 'phi', 'Pittsburgh Penguins': 'pit', 'San Jose Sharks': 'sjs',
  'Seattle Kraken': 'sea', 'St. Louis Blues': 'stl', 'St Louis Blues': 'stl',
  'Tampa Bay Lightning': 'tbl', 'Toronto Maple Leafs': 'tor',
  'Utah Hockey Club': 'uta', 'Utah Mammoth': 'uta',
  'Vancouver Canucks': 'van', 'Vegas Golden Knights': 'vgk',
  'Washington Capitals': 'wsh', 'Winnipeg Jets': 'wpg',
};

const MLB_CODES = {
  'Arizona Diamondbacks': 'ari', 'Atlanta Braves': 'atl', 'Baltimore Orioles': 'bal',
  'Boston Red Sox': 'bos', 'Chicago Cubs': 'chc', 'Chicago White Sox': 'cws',
  'Cincinnati Reds': 'cin', 'Cleveland Guardians': 'cle', 'Colorado Rockies': 'col',
  'Detroit Tigers': 'det', 'Houston Astros': 'hou', 'Kansas City Royals': 'kcr',
  'Los Angeles Angels': 'laa', 'Los Angeles Dodgers': 'lad', 'Miami Marlins': 'mia',
  'Milwaukee Brewers': 'mil', 'Minnesota Twins': 'min', 'New York Mets': 'nym',
  'New York Yankees': 'nyy', 'Oakland Athletics': 'oak', 'Philadelphia Phillies': 'phi',
  'Pittsburgh Pirates': 'pit', 'San Diego Padres': 'sdp', 'San Francisco Giants': 'sfg',
  'Seattle Mariners': 'sea', 'St. Louis Cardinals': 'stl', 'St Louis Cardinals': 'stl',
  'Tampa Bay Rays': 'tbr', 'Texas Rangers': 'tex', 'Toronto Blue Jays': 'tor',
  'Washington Nationals': 'wsh',
};

const BOOK_DISPLAY = {
  draftkings: 'DraftKings',
  fanduel: 'FanDuel',
  betmgm: 'BetMGM',
  caesars: 'Caesars',
  pinnacle: 'Pinnacle',
};

const normalize = s => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

function loadCBBTeamMap() {
  const csvPath = join(ROOT, 'public', 'basketball_teams.csv');
  let csv;
  try { csv = readFileSync(csvPath, 'utf8'); } catch { return new Map(); }
  const lines = csv.split('\n').filter(Boolean);
  const headers = lines[0].toLowerCase().split(',');
  const map = new Map();
  for (let i = 1; i < lines.length; i++) {
    const vals = lines[i].split(',');
    const row = {};
    headers.forEach((h, j) => { row[h.trim()] = vals[j]?.trim() || ''; });
    const canon = row.oddstrader_name || row.normalized_name || '';
    if (!canon) continue;
    for (const col of ['oddstrader_name', 'normalized_name', 'haslametrics_name',
      'dratings_name', 'ncaa_name', 'espn_name', 'barttorvik_name', 'odds_api_name', 'cbbd_name']) {
      const n = normalize(row[col] || '');
      if (n.length >= 2) map.set(n, canon);
    }
  }
  return map;
}

function findCBBTeam(cbbMap, name) {
  const n = normalize(name);
  if (cbbMap.has(n)) return cbbMap.get(n);
  let best = null, bestLen = 0;
  for (const [key, canon] of cbbMap) {
    if (n.startsWith(key) && key.length > bestLen) {
      best = canon;
      bestLen = key.length;
    }
  }
  return best;
}

const cbbMap = loadCBBTeamMap();

function makeGameKey(away, home, sportLabel) {
  if (sportLabel === 'NHL') {
    const a = NHL_CODES[away] || away.toLowerCase().replace(/[^a-z]/g, '').slice(0, 3);
    const h = NHL_CODES[home] || home.toLowerCase().replace(/[^a-z]/g, '').slice(0, 3);
    return `${a}_${h}`;
  }
  if (sportLabel === 'MLB') {
    const a = MLB_CODES[away] || away.toLowerCase().replace(/[^a-z]/g, '').slice(0, 3);
    const h = MLB_CODES[home] || home.toLowerCase().replace(/[^a-z]/g, '').slice(0, 3);
    return `${a}_${h}`;
  }
  const aCanon = findCBBTeam(cbbMap, away);
  const hCanon = findCBBTeam(cbbMap, home);
  if (aCanon && hCanon) {
    return `${normalize(aCanon)}_${normalize(hCanon)}`;
  }
  return `${normalize(away)}_${normalize(home)}`;
}

function impliedProb(american) {
  if (american == null) return null;
  if (american > 0) return 100 / (american + 100);
  return Math.abs(american) / (Math.abs(american) + 100);
}

async function fetchOdds(sportKey) {
  const url = `https://api.the-odds-api.com/v4/sports/${sportKey}/odds?apiKey=${API_KEY}&bookmakers=${BOOKMAKERS}&markets=h2h&oddsFormat=american`;
  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`  ⚠️ Odds API ${sportKey}: ${res.status}`);
    return [];
  }
  const data = await res.json();
  const remaining = res.headers.get('x-requests-remaining');
  if (remaining) console.log(`  📊 ${sportKey}: ${data.length} games (API credits remaining: ${remaining})`);
  return data;
}

function loadHistory() {
  if (!existsSync(OUT_PATH)) return {};
  try { return JSON.parse(readFileSync(OUT_PATH, 'utf8')); } catch { return {}; }
}

function extractBookOdds(game) {
  const awayName = game.away_team;
  const homeName = game.home_team;

  let pinnAway = null, pinnHome = null;
  let bestAway = null, bestHome = null;
  let bestAwayBook = null, bestHomeBook = null;
  const allBooks = {};

  for (const bk of (game.bookmakers || [])) {
    const h2h = bk.markets?.find(m => m.key === 'h2h');
    if (!h2h) continue;

    const aw = h2h.outcomes.find(o => o.name === awayName);
    const hm = h2h.outcomes.find(o => o.name === homeName);
    if (!aw || !hm) continue;

    const bookName = BOOK_DISPLAY[bk.key] || bk.title;
    allBooks[bk.key] = { away: aw.price, home: hm.price, name: bookName };

    if (bk.key === 'pinnacle') {
      pinnAway = aw.price;
      pinnHome = hm.price;
    }

    if (RETAIL_BOOKS.includes(bk.key)) {
      if (bestAway === null || aw.price > bestAway) {
        bestAway = aw.price;
        bestAwayBook = bookName;
      }
      if (bestHome === null || hm.price > bestHome) {
        bestHome = hm.price;
        bestHomeBook = bookName;
      }
    }
  }

  return { pinnAway, pinnHome, bestAway, bestHome, bestAwayBook, bestHomeBook, allBooks };
}

async function run() {
  console.log('📌 Sharp odds snapshot (Pinnacle + retail books)\n');
  const now = Math.floor(Date.now() / 1000);
  const history = loadHistory();
  const staleCutoff = now - STALE_HOURS * 3600;

  for (const { key: sportKey, label } of SPORTS) {
    if (!history[label]) history[label] = {};

    const games = await fetchOdds(sportKey);
    for (const game of games) {
      const { pinnAway, pinnHome, bestAway, bestHome, bestAwayBook, bestHomeBook, allBooks } = extractBookOdds(game);
      if (pinnAway == null || pinnHome == null) continue;

      const awayName = game.away_team;
      const homeName = game.home_team;
      const gameKey = makeGameKey(awayName, homeName, label);

      const existing = history[label][gameKey] || {};

      // Different game under the same key (e.g. back-to-back series)
      // The Odds API id is unique per game — use it to tell them apart
      if (existing.apiId && existing.apiId !== game.id) {
        const existingDist = Math.abs(new Date(existing.commence).getTime() - Date.now());
        const newDist = Math.abs(new Date(game.commence_time).getTime() - Date.now());
        if (existingDist <= newDist) continue; // existing game is closer to now, keep it
        // new game is closer — reset the entry so it starts fresh
        delete existing.opener;
        delete existing.history;
        delete existing.movement;
      }

      // Pinnacle history
      const snapshot = { t: now, away: pinnAway, home: pinnHome };
      if (!existing.opener) {
        existing.opener = { ...snapshot };
      }
      existing.current = { away: pinnAway, home: pinnHome };

      const hist = existing.history || [];
      hist.push(snapshot);
      if (hist.length > MAX_HISTORY) hist.splice(0, hist.length - MAX_HISTORY);
      existing.history = hist;

      // Pinnacle movement — use implied probability so it works for both favorites and underdogs
      const opAway = existing.opener.away;
      const opHome = existing.opener.home;
      const currAwayProb = impliedProb(pinnAway);
      const openAwayProb = impliedProb(opAway);
      const currHomeProb = impliedProb(pinnHome);
      const openHomeProb = impliedProb(opHome);
      existing.movement = {
        away: pinnAway - opAway,
        home: pinnHome - opHome,
        direction: currAwayProb > openAwayProb ? 'away'
                 : currHomeProb > openHomeProb ? 'home'
                 : null,
      };

      // Best retail prices + EV
      existing.bestAway = bestAway;
      existing.bestHome = bestHome;
      existing.bestAwayBook = bestAwayBook;
      existing.bestHomeBook = bestHomeBook;

      const pinnAwayProb = impliedProb(pinnAway);
      const pinnHomeProb = impliedProb(pinnHome);
      const bestAwayProb = impliedProb(bestAway);
      const bestHomeProb = impliedProb(bestHome);

      existing.ev = {
        away: (pinnAwayProb && bestAwayProb) ? +((pinnAwayProb - bestAwayProb) * 100).toFixed(1) : null,
        home: (pinnHomeProb && bestHomeProb) ? +((pinnHomeProb - bestHomeProb) * 100).toFixed(1) : null,
      };

      existing.allBooks = allBooks;
      existing.awayTeam = awayName;
      existing.homeTeam = homeName;
      existing.commence = game.commence_time;
      existing.apiId = game.id;

      history[label][gameKey] = existing;
    }

    // Purge stale and completed games
    const completedCutoff = now - COMPLETED_HOURS * 3600;
    for (const [gk, gd] of Object.entries(history[label])) {
      const lastT = gd.history?.[gd.history.length - 1]?.t || 0;
      if (lastT < staleCutoff) { delete history[label][gk]; continue; }
      if (gd.commence) {
        const commenceEpoch = Math.floor(new Date(gd.commence).getTime() / 1000);
        if (commenceEpoch < completedCutoff) { delete history[label][gk]; continue; }
      }
    }
  }

  writeFileSync(OUT_PATH, JSON.stringify(history, null, 2), 'utf8');

  let totalGames = 0;
  let evSpots = 0;
  for (const sport of Object.values(history)) {
    for (const gd of Object.values(sport)) {
      totalGames++;
      if ((gd.ev?.away > 0) || (gd.ev?.home > 0)) evSpots++;
    }
  }
  console.log(`\n✅ ${totalGames} games tracked, ${evSpots} with +EV retail lines`);
}

run().catch(e => { console.error(e); process.exit(1); });
