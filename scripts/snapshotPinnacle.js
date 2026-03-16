/**
 * Pinnacle Line History — snapshots Pinnacle moneyline odds for
 * all active sports every 15 minutes. Piggybacked on the
 * fetch-polymarket workflow.
 *
 * Reads/merges with existing pinnacle_history.json, tracks opener,
 * current, history array, and movement per game.
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
  console.log('⚠️ No ODDS_API_KEY — skipping Pinnacle snapshot');
  process.exit(0);
}

const SPORTS = [
  { key: 'icehockey_nhl', label: 'NHL' },
  { key: 'basketball_ncaab', label: 'CBB' },
];

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

function makeGameKey(away, home, sportLabel) {
  if (sportLabel === 'NHL') {
    const a = NHL_CODES[away] || away.toLowerCase().replace(/[^a-z]/g, '').slice(0, 3);
    const h = NHL_CODES[home] || home.toLowerCase().replace(/[^a-z]/g, '').slice(0, 3);
    return `${a}_${h}`;
  }
  const normalize = s => s.toLowerCase().replace(/[^a-z]/g, '');
  return `${normalize(away)}_${normalize(home)}`;
}

function americanOdds(decimal) {
  if (!decimal || decimal <= 1) return null;
  return decimal >= 2
    ? Math.round((decimal - 1) * 100)
    : Math.round(-100 / (decimal - 1));
}

async function fetchPinnacle(sportKey) {
  const url = `https://api.the-odds-api.com/v4/sports/${sportKey}/odds?apiKey=${API_KEY}&bookmakers=pinnacle&markets=h2h&oddsFormat=decimal`;
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

async function run() {
  console.log('📌 Pinnacle line snapshot\n');
  const now = Math.floor(Date.now() / 1000);
  const history = loadHistory();
  const staleCutoff = now - STALE_HOURS * 3600;

  for (const { key: sportKey, label } of SPORTS) {
    if (!history[label]) history[label] = {};

    const games = await fetchPinnacle(sportKey);
    for (const game of games) {
      const pinnacle = game.bookmakers?.find(b => b.key === 'pinnacle');
      if (!pinnacle) continue;

      const h2h = pinnacle.markets?.find(m => m.key === 'h2h');
      if (!h2h || !h2h.outcomes || h2h.outcomes.length < 2) continue;

      const awayName = game.away_team;
      const homeName = game.home_team;
      const gameKey = makeGameKey(awayName, homeName, label);

      const awayOutcome = h2h.outcomes.find(o => o.name === awayName);
      const homeOutcome = h2h.outcomes.find(o => o.name === homeName);
      if (!awayOutcome || !homeOutcome) continue;

      const awayOdds = americanOdds(awayOutcome.price);
      const homeOdds = americanOdds(homeOutcome.price);
      if (awayOdds == null || homeOdds == null) continue;

      const existing = history[label][gameKey] || {};
      const snapshot = { t: now, away: awayOdds, home: homeOdds };

      if (!existing.opener) {
        existing.opener = { ...snapshot };
      }

      existing.current = { away: awayOdds, home: homeOdds };

      const hist = existing.history || [];
      hist.push(snapshot);
      if (hist.length > MAX_HISTORY) hist.splice(0, hist.length - MAX_HISTORY);
      existing.history = hist;

      const opAway = existing.opener.away;
      const opHome = existing.opener.home;
      existing.movement = {
        away: awayOdds - opAway,
        home: homeOdds - opHome,
        direction: Math.abs(awayOdds) < Math.abs(opAway) ? 'away' : Math.abs(homeOdds) < Math.abs(opHome) ? 'home' : null,
      };

      existing.awayTeam = awayName;
      existing.homeTeam = homeName;

      history[label][gameKey] = existing;
    }

    // Purge stale games
    for (const [gk, gd] of Object.entries(history[label])) {
      const lastT = gd.history?.[gd.history.length - 1]?.t || 0;
      if (lastT < staleCutoff) delete history[label][gk];
    }
  }

  writeFileSync(OUT_PATH, JSON.stringify(history, null, 2), 'utf8');

  let totalGames = 0;
  for (const sport of Object.values(history)) totalGames += Object.keys(sport).length;
  console.log(`\n✅ Wrote ${OUT_PATH} — ${totalGames} games tracked`);
}

run().catch(e => { console.error(e); process.exit(1); });
