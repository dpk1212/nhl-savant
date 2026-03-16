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
];

const BOOKMAKERS = 'pinnacle,draftkings,fanduel,betmgm,caesars';
const RETAIL_BOOKS = ['draftkings', 'fanduel', 'betmgm', 'caesars'];
const MAX_HISTORY = 24;
const STALE_HOURS = 36;
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

const BOOK_DISPLAY = {
  draftkings: 'DraftKings',
  fanduel: 'FanDuel',
  betmgm: 'BetMGM',
  caesars: 'Caesars',
  pinnacle: 'Pinnacle',
};

function makeGameKey(away, home, sportLabel) {
  if (sportLabel === 'NHL') {
    const a = NHL_CODES[away] || away.toLowerCase().replace(/[^a-z]/g, '').slice(0, 3);
    const h = NHL_CODES[home] || home.toLowerCase().replace(/[^a-z]/g, '').slice(0, 3);
    return `${a}_${h}`;
  }
  const normalize = s => s.toLowerCase().replace(/[^a-z]/g, '');
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

      // Pinnacle movement
      const opAway = existing.opener.away;
      const opHome = existing.opener.home;
      existing.movement = {
        away: pinnAway - opAway,
        home: pinnHome - opHome,
        direction: Math.abs(pinnAway) < Math.abs(opAway) ? 'away'
                 : Math.abs(pinnHome) < Math.abs(opHome) ? 'home'
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

      history[label][gameKey] = existing;
    }

    // Purge stale
    for (const [gk, gd] of Object.entries(history[label])) {
      const lastT = gd.history?.[gd.history.length - 1]?.t || 0;
      if (lastT < staleCutoff) delete history[label][gk];
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
