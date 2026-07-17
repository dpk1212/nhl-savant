/**
 * Scan Sharp Positions — checks which tracked ELITE/PROVEN wallets
 * hold open positions on today's games. Fundamentally more reliable
 * than catching trades in a 15-min polling window.
 *
 * For each game today: shows which sharp wallets are positioned,
 * which side they're on, their investment size, and current P&L.
 *
 * Usage: node scripts/scanSharpPositions.js
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { matchSoccerPositionTitle, resolveSoccerSide } from './lib/soccerTeams.js';
import { matchUFCPositionTitle } from './lib/ufcFighters.js';
import { matchWNBAPositionTitle, resolveWNBATeam, WNBA_NAME_TO_CODE } from './lib/wnbaTeams.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DATA_API = 'https://data-api.polymarket.com';

const httpFetch = typeof globalThis.fetch === 'function'
  ? globalThis.fetch
  : (await import('node-fetch')).default;

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const normalize = s => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

const DELAY_MS = 800;
const RETRY_LIMIT = 3;
// Number of wallet position fetches kept in flight at once. The Polymarket
// data-api tolerates modest parallelism; fetchWithRetry still backs off per
// request on 429 so a burst self-throttles. Tune down if 429s appear.
const SCAN_CONCURRENCY = Number(process.env.SCAN_CONCURRENCY) || 4;
const TIERS_TO_SCAN = ['ELITE', 'PROVEN', 'ACTIVE'];

// Bounded-concurrency async map: runs `worker(item, idx)` for every item with
// at most `concurrency` promises in flight. Results are returned in input
// order regardless of completion order, so downstream processing can stay
// deterministic. Errors from a worker reject the whole pool (workers here
// never throw — fetchWithRetry returns null on failure).
async function mapPool(items, concurrency, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  const runNext = async () => {
    while (cursor < items.length) {
      const i = cursor++;
      results[i] = await worker(items[i], i);
    }
  };
  const lanes = Array.from({ length: Math.min(concurrency, items.length) }, runNext);
  await Promise.all(lanes);
  return results;
}

// ─── NHL team resolution ──────────────────────────────────────────────────────
const NHL_MAP = {
  bruins: 'bos', mapleleafs: 'tor', leafs: 'tor',
  rangers: 'nyr', islanders: 'nyi',
  canadiens: 'mtl', habs: 'mtl',
  senators: 'ott', sabres: 'buf', redwings: 'det',
  lightning: 'tbl', bolts: 'tbl', tampabay: 'tbl',
  panthers: 'fla', hurricanes: 'car',
  capitals: 'wsh', caps: 'wsh',
  penguins: 'pit', pens: 'pit',
  flyers: 'phi', devils: 'njd', newjersey: 'njd',
  bluejackets: 'cbj', jackets: 'cbj',
  predators: 'nsh', preds: 'nsh',
  jets: 'wpg', blackhawks: 'chi', hawks: 'chi',
  wild: 'min', stars: 'dal', blues: 'stl', stlouis: 'stl',
  avalanche: 'col', avs: 'col',
  coyotes: 'ari', utah: 'uta',
  knights: 'vgk', goldenknights: 'vgk', vegas: 'vgk',
  kings: 'lak', losangeles: 'lak',
  ducks: 'ana', sharks: 'sjs', sanjose: 'sjs',
  flames: 'cgy', oilers: 'edm',
  canucks: 'van', kraken: 'sea',
  boston: 'bos', toronto: 'tor', montreal: 'mtl', ottawa: 'ott',
  buffalo: 'buf', detroit: 'det', florida: 'fla', carolina: 'car',
  washington: 'wsh', pittsburgh: 'pit', philadelphia: 'phi',
  columbus: 'cbj', nashville: 'nsh', winnipeg: 'wpg',
  chicago: 'chi', minnesota: 'min', dallas: 'dal',
  colorado: 'col', anaheim: 'ana', seattle: 'sea',
  calgary: 'cgy', edmonton: 'edm', vancouver: 'van',
};

function resolveNHLCode(raw) {
  const n = normalize(raw);
  if (NHL_MAP[n]) return NHL_MAP[n];
  for (const w of raw.split(/\s+/)) {
    const wn = normalize(w);
    if (NHL_MAP[wn]) return NHL_MAP[wn];
  }
  return null;
}

// ─── CBB team resolution ──────────────────────────────────────────────────────
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

// ─── MLB team resolution ──────────────────────────────────────────────────────
const MLB_MAP = {
  diamondbacks: 'ari', dbacks: 'ari', arizona: 'ari',
  braves: 'atl', atlanta: 'atl',
  orioles: 'bal', baltimore: 'bal',
  redsox: 'bos', boston: 'bos',
  cubs: 'chc', chicagocubs: 'chc',
  whitesox: 'cws', chicagowhitesox: 'cws',
  reds: 'cin', cincinnati: 'cin',
  guardians: 'cle', cleveland: 'cle',
  rockies: 'col', colorado: 'col',
  tigers: 'det', detroit: 'det',
  astros: 'hou', houston: 'hou',
  royals: 'kcr', kansascity: 'kcr',
  angels: 'laa', losangelesangels: 'laa',
  dodgers: 'lad', losangelesdodgers: 'lad',
  marlins: 'mia', miami: 'mia',
  brewers: 'mil', milwaukee: 'mil',
  twins: 'min', minnesota: 'min',
  mets: 'nym', newyorkmets: 'nym',
  yankees: 'nyy', newyorkyankees: 'nyy',
  athletics: 'oak', oakland: 'oak', as: 'oak',
  phillies: 'phi', philadelphia: 'phi',
  pirates: 'pit', pittsburgh: 'pit',
  padres: 'sdp', sandiego: 'sdp',
  giants: 'sfg', sanfrancisco: 'sfg',
  mariners: 'sea', seattle: 'sea',
  cardinals: 'stl', stlouis: 'stl',
  rays: 'tbr', tampabay: 'tbr',
  rangers: 'tex', texas: 'tex',
  bluejays: 'tor', toronto: 'tor',
  nationals: 'wsh', washington: 'wsh',
};

function resolveMLBCode(raw) {
  const n = normalize(raw);
  if (MLB_MAP[n]) return MLB_MAP[n];
  for (const w of raw.split(/\s+/)) {
    const wn = normalize(w);
    if (MLB_MAP[wn]) return MLB_MAP[wn];
  }
  return null;
}

// ─── NBA team resolution ──────────────────────────────────────────────────────
const NBA_MAP = {
  hawks: 'atl', atlanta: 'atl',
  celtics: 'bos', boston: 'bos',
  nets: 'bkn', brooklyn: 'bkn',
  hornets: 'cha', charlotte: 'cha',
  bulls: 'chi', chicago: 'chi',
  cavaliers: 'cle', cavs: 'cle', cleveland: 'cle',
  mavericks: 'dal', mavs: 'dal', dallas: 'dal',
  nuggets: 'den', denver: 'den',
  pistons: 'det', detroit: 'det',
  warriors: 'gsw', dubs: 'gsw', goldenstate: 'gsw',
  rockets: 'hou', houston: 'hou',
  pacers: 'ind', indiana: 'ind',
  clippers: 'lac', losangelesclippers: 'lac', laclippers: 'lac',
  lakers: 'lal', losangeleslakers: 'lal', lalakers: 'lal',
  grizzlies: 'mem', memphis: 'mem',
  heat: 'mia', miami: 'mia',
  bucks: 'mil', milwaukee: 'mil',
  timberwolves: 'min', wolves: 'min', minnesota: 'min',
  pelicans: 'nop', neworleans: 'nop',
  knicks: 'nyk', newyork: 'nyk', newyorkknicks: 'nyk',
  thunder: 'okc', oklahomacity: 'okc',
  magic: 'orl', orlando: 'orl',
  '76ers': 'phi', sixers: 'phi', philadelphia: 'phi',
  suns: 'phx', phoenix: 'phx',
  trailblazers: 'por', blazers: 'por', portland: 'por',
  kings: 'sac', sacramento: 'sac',
  spurs: 'sas', sanantonio: 'sas',
  raptors: 'tor', toronto: 'tor',
  jazz: 'uth', utah: 'uth',
  wizards: 'was', washington: 'was',
};

function resolveNBACode(raw) {
  const n = normalize(raw);
  if (NBA_MAP[n]) return NBA_MAP[n];
  for (const w of raw.split(/\s+/)) {
    const wn = normalize(w);
    if (NBA_MAP[wn]) return NBA_MAP[wn];
  }
  return null;
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

// ─── Title parsing (reused from fetchPolymarketData.js) ──────────────────────
function extractTeamsFromTitle(title) {
  const t = (title || '').trim();
  const patterns = [
    /(.+?)\s+vs\.?\s+(.+?)(?:\s*\([Ww]\))?\s*$/,
    /(.+?)\s+@\s+(.+?)\s*$/,
    /(.+?)\s+at\s+(.+?)\s*$/,
    /will\s+(?:the\s+)?(.+?)\s+beat\s+(?:the\s+)?(.+?)(?:\?|$)/i,
    /(.+?)\s+beat\s+(.+?)(?:\?|$)/i,
  ];
  for (const pattern of patterns) {
    const m = t.match(pattern);
    if (m) {
      const a = m[1].trim().replace(/\s+/g, ' ');
      const b = m[2].trim().replace(/\s+/g, ' ');
      if (a.length >= 2 && b.length >= 2) return [a, b];
    }
  }
  return null;
}

// ─── Sport classification by keywords ────────────────────────────────────────
const SPORT_KEYWORDS = {
  NHL: ['nhl', 'hockey', 'bruins', 'rangers', 'maple leafs', 'canadiens',
    'oilers', 'panthers', 'avalanche', 'stars', 'jets', 'hurricanes', 'devils',
    'islanders', 'penguins', 'capitals', 'lightning', 'flames', 'senators',
    'predators', 'blues', 'wild', 'kraken', 'ducks', 'sharks', 'blackhawks',
    'sabres', 'flyers', 'kings', 'red wings', 'blue jackets'],
  MLB: ['mlb', 'baseball', 'yankees', 'mets', 'dodgers', 'angels', 'astros',
    'braves', 'orioles', 'red sox', 'cubs', 'white sox', 'reds', 'guardians',
    'rockies', 'tigers', 'marlins', 'brewers', 'twins', 'phillies', 'pirates',
    'padres', 'giants', 'mariners', 'cardinals', 'rays', 'rangers', 'blue jays',
    'nationals', 'royals', 'athletics', 'diamondbacks'],
  CBB: ['ncaa', 'march madness', 'college basketball', 'bulldogs',
    'wildcats', 'eagles', 'bears', 'blue devils', 'tar heels',
    'jayhawks', 'spartans', 'wolverines', 'buckeyes', 'crimson tide'],
  NBA: ['nba', 'lakers', 'celtics', 'warriors', 'bucks', 'nuggets', 'heat',
    'suns', '76ers', 'sixers', 'nets', 'knicks', 'clippers', 'mavericks',
    'grizzlies', 'timberwolves', 'pelicans', 'rockets', 'spurs', 'raptors',
    'pacers', 'hawks', 'hornets', 'pistons', 'wizards', 'magic', 'trail blazers',
    'cavaliers', 'thunder'],
};

function classifySport(title) {
  const t = title.toLowerCase();
  for (const [sport, keywords] of Object.entries(SPORT_KEYWORDS)) {
    for (const kw of keywords) {
      if (t.includes(kw)) return sport;
    }
  }
  return null;
}

// ─── Network ────────────────────────────────────────────────────────────────
async function fetchWithRetry(url, retries = RETRY_LIMIT) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await httpFetch(url, { headers: { Accept: 'application/json' } });
      if (res.status === 429) {
        const wait = Math.pow(2, i + 1) * 1000;
        console.warn(`  Rate limited, waiting ${wait / 1000}s...`);
        await sleep(wait);
        continue;
      }
      if (!res.ok) throw new Error(`${res.status} ${url}`);
      return await res.json();
    } catch (e) {
      if (i === retries) {
        console.warn(`  Failed after ${retries + 1} attempts: ${e.message}`);
        return null;
      }
      await sleep(1000 * (i + 1));
    }
  }
  return null;
}

function loadJSON(filename) {
  const path = join(ROOT, 'public', filename);
  if (!existsSync(path)) return null;
  try { return JSON.parse(readFileSync(path, 'utf8')); } catch { return null; }
}

/** Persistent allowlist — directional wallets falsely tagged MM/trader by heuristics. */
function loadForceIncludeSet() {
  const doc = loadJSON('sharp_intel_force_include.json');
  const list = Array.isArray(doc?.wallets) ? doc.wallets : [];
  return new Set(
    list.map((w) => String(w?.addr || w || '').toLowerCase()).filter(Boolean),
  );
}

/** MM + clear-trader addresses for Sharp Vault (same rules as scan / strip). */
function writeIntelExcludedWallets(mmAddrs, traderAddrs) {
  const norm = (a) => (a || '').toLowerCase();
  const force = loadForceIncludeSet();
  const mm = [...new Set((mmAddrs || []).map(norm))]
    .filter((a) => a && !force.has(a));
  const tr = [...new Set((traderAddrs || []).map(norm))]
    .filter((a) => a && !force.has(a));
  const excluded = [...new Set([...mm, ...tr])];
  const outPath = join(ROOT, 'public', 'sharp_intel_excluded_wallets.json');
  writeFileSync(
    outPath,
    JSON.stringify(
      {
        updatedAt: new Date().toISOString(),
        mmExcluded: mm,
        tradersExcluded: tr,
        excluded,
        forceIncludeSkipped: [...force],
      },
      null,
      2,
    ),
    'utf8',
  );
}

// ─── Build today's game lookup ──────────────────────────────────────────────
// Keys are sport-prefixed ("NHL:bos_tor") to prevent collisions when
// NHL and MLB share 3-letter city codes (bos, tor, min, col, etc.)
function buildTodaysGames(polyData) {
  const games = {};
  for (const sport of ['NHL', 'CBB', 'MLB', 'NBA', 'SOC', 'UFC', 'WNBA']) {
    const sportGames = polyData?.[sport] || {};
    for (const [key, g] of Object.entries(sportGames)) {
      const away = g.awayTeam || '';
      const home = g.homeTeam || '';
      games[`${sport}:${key}`] = { sport, away, home, key, title: g.title || '', commence: g.commence || null };
    }
  }
  return games;
}

// ─── Match a position title to one of today's game keys ──────────────────────
// Returns { key (unprefixed), sport, side, awayName, homeName } or null.
// Uses sport-prefixed lookups to avoid cross-sport collisions.
function matchPositionToGame(posTitle, todaysGames, cbbMap) {
  const teams = extractTeamsFromTitle(posTitle);
  if (!teams) return null;
  const [rawA, rawB] = teams;

  // Try NHL first
  const nhlA = resolveNHLCode(rawA);
  const nhlB = resolveNHLCode(rawB);
  if (nhlA && nhlB) {
    const key = `${nhlA}_${nhlB}`;
    if (todaysGames[`NHL:${key}`]) return { key, sport: 'NHL', side: 'away', awayName: rawA, homeName: rawB };
    const rev = `${nhlB}_${nhlA}`;
    if (todaysGames[`NHL:${rev}`]) return { key: rev, sport: 'NHL', side: 'home', awayName: rawB, homeName: rawA };
  }

  // Try CBB
  const cbbA = findCBBTeam(cbbMap, rawA);
  const cbbB = findCBBTeam(cbbMap, rawB);
  if (cbbA && cbbB) {
    const key = `${normalize(cbbA)}_${normalize(cbbB)}`;
    if (todaysGames[`CBB:${key}`]) return { key, sport: 'CBB', side: 'away', awayName: cbbA, homeName: cbbB };
    const rev = `${normalize(cbbB)}_${normalize(cbbA)}`;
    if (todaysGames[`CBB:${rev}`]) return { key: rev, sport: 'CBB', side: 'home', awayName: cbbB, homeName: cbbA };
  }

  // Try MLB
  const mlbA = resolveMLBCode(rawA);
  const mlbB = resolveMLBCode(rawB);
  if (mlbA && mlbB) {
    const key = `${mlbA}_${mlbB}`;
    if (todaysGames[`MLB:${key}`]) return { key, sport: 'MLB', side: 'away', awayName: rawA, homeName: rawB };
    const rev = `${mlbB}_${mlbA}`;
    if (todaysGames[`MLB:${rev}`]) return { key: rev, sport: 'MLB', side: 'home', awayName: rawB, homeName: rawA };
  }

  // Try WNBA before NBA (shared nicknames: Sun, Sparks, Liberty, …)
  const wnbaA = resolveWNBATeam(rawA);
  const wnbaB = resolveWNBATeam(rawB);
  if (wnbaA && wnbaB) {
    const key = `${wnbaA.toLowerCase()}_${wnbaB.toLowerCase()}`;
    if (todaysGames[`WNBA:${key}`]) return { key, sport: 'WNBA', side: 'away', awayName: rawA, homeName: rawB };
    const rev = `${wnbaB.toLowerCase()}_${wnbaA.toLowerCase()}`;
    if (todaysGames[`WNBA:${rev}`]) return { key: rev, sport: 'WNBA', side: 'home', awayName: rawB, homeName: rawA };
  }

  // Try NBA
  const nbaA = resolveNBACode(rawA);
  const nbaB = resolveNBACode(rawB);
  if (nbaA && nbaB) {
    const key = `${nbaA}_${nbaB}`;
    if (todaysGames[`NBA:${key}`]) return { key, sport: 'NBA', side: 'away', awayName: rawA, homeName: rawB };
    const rev = `${nbaB}_${nbaA}`;
    if (todaysGames[`NBA:${rev}`]) return { key: rev, sport: 'NBA', side: 'home', awayName: rawB, homeName: rawA };
  }

  return null;
}

// SOC titles name a single side ("Will Mexico win on 2026-06-18?"), so they
// need their own matcher — extractTeamsFromTitle can't parse them.
// UFC titles often include "UFC 329:" prefix — use dedicated fighter matcher.
// WNBA single-side "Will X win?" titles use matchWNBAPositionTitle.
function matchPositionToGameOrSoccer(posTitle, todaysGames, cbbMap) {
  return matchPositionToGame(posTitle, todaysGames, cbbMap)
    || matchSoccerPositionTitle(posTitle, todaysGames)
    || matchUFCPositionTitle(posTitle, todaysGames)
    || matchWNBAPositionTitle(posTitle, todaysGames);
}

// ─── Match spread-formatted titles like "Spread: Knicks (-3.5)" ─────────────
function matchSpreadTitle(posTitle, todaysGames, cbbMap) {
  const m = (posTitle || '').match(/^Spread:\s+(.+?)\s*\(([+-]?\d+\.?\d*)\)/i);
  if (!m) return null;
  const teamRaw = m[1].trim();
  const spreadLine = parseFloat(m[2]);

  // WNBA_NAME_TO_CODE is normalized-alias → CODE; lower-case codes for keys.
  const WNBA_MAP = Object.fromEntries(
    Object.entries(WNBA_NAME_TO_CODE).map(([k, v]) => [k, String(v).toLowerCase()]),
  );
  const SPORT_MAPS = {
    NHL: NHL_MAP,
    WNBA: WNBA_MAP,
    NBA: NBA_MAP,
    MLB: MLB_MAP,
  };

  // Score each candidate: full-name match = 3, mascot word = 2, city word = 1
  const candidates = [];
  const teamNorm = normalize(teamRaw);
  const words = teamRaw.split(/\s+/).map(w => normalize(w)).filter(w => w.length >= 3);

  for (const [sport, map] of Object.entries(SPORT_MAPS)) {
    let code = null;
    let score = 0;

    if (map[teamNorm]) {
      code = map[teamNorm];
      score = 3;
    } else {
      for (const w of words) {
        if (!map[w]) continue;
        const isCity = ['pittsburgh', 'detroit', 'chicago', 'boston', 'toronto',
          'minnesota', 'colorado', 'philadelphia', 'washington', 'seattle',
          'cleveland', 'houston', 'dallas', 'denver', 'atlanta', 'miami',
          'milwaukee', 'cincinnati', 'oakland', 'newyork', 'losangeles',
          'sanfrancisco', 'sandiego', 'stlouis', 'tampabay', 'kansascity',
          'columbus', 'nashville', 'winnipeg', 'anaheim', 'calgary',
          'edmonton', 'vancouver', 'charlotte', 'brooklyn', 'sacramento',
          'portland', 'memphis', 'neworleans', 'sanantonio', 'oklahomacity',
          'indiana', 'orlando', 'utah', 'florida', 'carolina', 'buffalo',
          'ottawa', 'montreal', 'texas'].includes(w);
        const newScore = isCity ? 1 : 2;
        if (newScore > score) { code = map[w]; score = newScore; }
      }
    }

    if (!code) continue;
    for (const fullKey of Object.keys(todaysGames)) {
      if (!fullKey.startsWith(sport + ':')) continue;
      const gameKey = fullKey.slice(sport.length + 1);
      if (gameKey.includes(code)) {
        candidates.push({ key: gameKey, sport, spreadLine, score });
      }
    }
  }

  const cbbTeam = findCBBTeam(cbbMap, teamRaw);
  if (cbbTeam) {
    const normTeam = normalize(cbbTeam);
    for (const fullKey of Object.keys(todaysGames)) {
      if (!fullKey.startsWith('CBB:')) continue;
      const gameKey = fullKey.slice(4);
      if (gameKey.includes(normTeam)) {
        candidates.push({ key: gameKey, sport: 'CBB', spreadLine, score: 2 });
      }
    }
  }

  if (candidates.length === 0) return null;
  candidates.sort((a, b) => b.score - a.score);
  return candidates[0];
}

// ─── Determine which side the outcome is on ─────────────────────────────────
function resolveOutcomeSide(outcome, awayName, homeName, posTitle) {
  if (!outcome) return 'unknown';
  const o = normalize(outcome);
  const nAway = normalize(awayName);
  const nHome = normalize(homeName);

  if (o.includes(nAway) || nAway.includes(o) || o === 'yes') return 'away';
  if (o.includes(nHome) || nHome.includes(o) || o === 'no') return 'home';

  // Check individual words
  for (const word of (outcome || '').split(/\s+/)) {
    const w = normalize(word);
    if (w.length < 3) continue;
    if (nAway.includes(w)) return 'away';
    if (nHome.includes(w)) return 'home';
  }

  // For binary markets, first team in title is typically "Yes"
  const titleTeams = extractTeamsFromTitle(posTitle);
  if (titleTeams) {
    const firstTeam = normalize(titleTeams[0]);
    if (o === 'yes' || o.includes(firstTeam)) return 'away';
  }

  return 'away';
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function run() {
  console.log('Scanning sharp wallet positions on today\'s games...\n');

  const polyData = loadJSON('polymarket_data.json');
  const profiles = loadJSON('whale_profiles.json');
  if (!polyData || !profiles) {
    console.log('Missing polymarket_data.json or whale_profiles.json');
    process.exit(0);
  }

  // Load supplementary sports sharps and build sport PnL lookup for ALL wallets
  let sportsSharps = {};
  const sportPnlLookup = {};
  const TIER_RANK = { ELITE: 4, SHARP: 3, PROVEN: 2, ACTIVE: 1 };
  const RANK_TO_TIER = { 4: 'ELITE', 3: 'SHARP', 2: 'PROVEN', 1: 'ACTIVE' };
  const sharpsFile = join(ROOT, 'public', 'sports_sharps.json');
  if (existsSync(sharpsFile)) {
    try {
      const raw = JSON.parse(readFileSync(sharpsFile, 'utf-8'));
      const { _meta, ...wallets } = raw;
      sportsSharps = wallets;
      for (const [addr, w] of Object.entries(wallets)) {
        sportPnlLookup[addr] = {
          sportPnlTotal: w.sportPnlTotal || 0,
          sportMarkets: w.sportMarkets || {},
          sportROI: w.sportROI || 0,
          avgSportBet: w.avgSportBet || 0,
          monthlyPnl: w.monthlyPnl || null,
          monthlyQualified: w.monthlyQualified || false,
          leaderboardRank: w.leaderboardRank ?? null,
          sportsLbPercentileTop: w.sportsLbPercentileTop ?? null,
          sportVol: w.vol || 0,
          leaderboardScope: w.leaderboardScope || null,
        };
      }
      console.log(`Loaded ${Object.keys(sportsSharps).length} supplementary sport sharps (${Object.keys(sportPnlLookup).length} with sport PnL data)`);
    } catch (e) {
      console.log(`sports_sharps.json parse error — skipping: ${e.message}`);
    }
  }

  const sportsSharpsLower = {};
  for (const [k, v] of Object.entries(sportsSharps)) {
    sportsSharpsLower[k.toLowerCase()] = v;
  }

  function lbExtras(lookup) {
    if (!lookup) {
      return {
        leaderboardRank: null, sportsLbPercentileTop: null, sportVol: 0, leaderboardScope: null,
      };
    }
    return {
      leaderboardRank: lookup.leaderboardRank ?? null,
      sportsLbPercentileTop: lookup.sportsLbPercentileTop ?? null,
      sportVol: lookup.sportVol || 0,
      leaderboardScope: lookup.leaderboardScope || null,
    };
  }

  function effectiveTier(baseTier, walletAddr, sport) {
    const baseRank = TIER_RANK[baseTier] || 1;
    const lookup = sportPnlLookup[walletAddr];
    const base = { sportROI: 0, avgSportBet: 0, ...lbExtras(null) };
    if (!lookup) return { tier: baseTier, sportPnl: null, sportVerified: false, monthlyPnl: null, monthlyQualified: false, ...base };
    const pnl = lookup.sportPnlTotal || 0;
    const extra = {
      monthlyPnl: lookup.monthlyPnl, monthlyQualified: lookup.monthlyQualified,
      sportROI: lookup.sportROI, avgSportBet: lookup.avgSportBet,
      ...lbExtras(lookup),
    };
    if (pnl <= 0) return { tier: baseTier, sportPnl: pnl, sportVerified: false, ...extra };
    const sportRank = pnl >= 50000 ? 4 : pnl >= 10000 ? 3 : 2;
    const finalRank = Math.max(baseRank, sportRank);
    return { tier: RANK_TO_TIER[finalRank] || baseTier, sportPnl: pnl, sportVerified: true, ...extra };
  }

  const cbbMap = loadCBBTeamMap();
  const todaysGames = buildTodaysGames(polyData);
  const gameKeys = Object.keys(todaysGames);
  console.log(`Today's games: ${gameKeys.length} (${gameKeys.filter(k => todaysGames[k].sport === 'NHL').length} NHL, ${gameKeys.filter(k => todaysGames[k].sport === 'CBB').length} CBB, ${gameKeys.filter(k => todaysGames[k].sport === 'MLB').length} MLB, ${gameKeys.filter(k => todaysGames[k].sport === 'NBA').length} NBA, ${gameKeys.filter(k => todaysGames[k].sport === 'SOC').length} SOC, ${gameKeys.filter(k => todaysGames[k].sport === 'UFC').length} UFC)\n`);

  // Existing pipeline: tier + mmScore + sport PnL floor (needed before no-games exit for Vault exclusions)
  const MM_THRESHOLD = 40;
  const SPORT_PNL_FLOOR = -50000;
  const forceInclude = loadForceIncludeSet();
  if (forceInclude.size > 0) {
    console.log(`Force-include allowlist: ${forceInclude.size} wallet(s) exempt from MM/trader exclusion`);
  }

  const allEligible = Object.entries(profiles)
    .filter(([, p]) => TIERS_TO_SCAN.includes(p.tier));

  const isExcluded = (p, addr) => {
    if (forceInclude.has((addr || '').toLowerCase())) return false;
    if ((p.mmScore || 0) > MM_THRESHOLD) return 'mm';
    const lookup = sportPnlLookup[addr];
    if (lookup) {
      if (lookup.sportPnlTotal > 0) return false;
      if (lookup.monthlyQualified) return false;
      return 'no_sport';
    }
    // Wallet not in sports_sharps.json — unverified.
    // whale_profiles sportPnl is raw payout (not net profit) and can't be trusted.
    // Only allow wallets that have been profiled by seed or enrichment.
    return 'unverified';
  };

  const mmFiltered = allEligible.filter(([addr, p]) => isExcluded(p, addr) === 'mm');
  const sportLosers = allEligible.filter(([addr, p]) => isExcluded(p, addr) === 'sport_loser');
  const noSport = allEligible.filter(([addr, p]) => isExcluded(p, addr) === 'no_sport');
  const unverified = allEligible.filter(([addr, p]) => isExcluded(p, addr) === 'unverified');
  const baseWallets = allEligible
    .filter(([addr, p]) => !isExcluded(p, addr))
    .map(([addr, p]) => ({ addr, name: p.name, tier: p.tier, totalPnl: p.totalPnl, sportPnl: p.sportPnl || {}, mmScore: p.mmScore || 0 }));

  // Merge in sport sharps that aren't already in the base list
  // Must have positive sport PnL OR be monthly-qualified to count
  // NEVER re-introduce wallets that were excluded as MMs (unless force-included)
  const baseAddrs = new Set(baseWallets.map(w => w.addr));
  const mmAddressSet = new Set(mmFiltered.map(([a]) => (a || '').toLowerCase()));
  let supplementalCount = 0;
  for (const [addr, p] of Object.entries(sportsSharps)) {
    if (addr === '_meta') continue;
    if (baseAddrs.has(addr)) continue;
    const al = (addr || '').toLowerCase();
    if (mmAddressSet.has(al) && !forceInclude.has(al)) continue;
    if ((p.sportPnlTotal || 0) <= 0 && !p.monthlyQualified && !forceInclude.has(al)) continue;
    baseWallets.push({ addr, name: p.name, tier: 'SHARP', totalPnl: p.totalPnl, sportPnl: {}, sportPnlTotal: p.sportPnlTotal || 0, mmScore: 0, monthlyQualified: p.monthlyQualified, monthlyPnl: p.monthlyPnl });
    supplementalCount++;
  }

  const walletsToScan = baseWallets.sort((a, b) => b.totalPnl - a.totalPnl);

  /** Clear-trader / arb-style heuristic (must match strip logic below). */
  const buildTraderVerdict = (addr, bothSidesMap) => {
    if (forceInclude.has((addr || '').toLowerCase())) return false;
    const w = sportsSharpsLower[(addr || '').toLowerCase()] || {};
    let score = 0;
    const vol = w.vol || 0;
    const sportPnl = w.sportPnlTotal || 0;
    const sportBets = w.sportBets || w.sportBetCount || 0;
    const marketsTraded = w.marketsTraded || 0;
    const sportROI = w.sportROI || 0;
    const sportWinRate = w.sportWinRate;
    const bs = bothSidesMap[addr] || bothSidesMap[(addr || '').toLowerCase()] || 0;

    const ratio = vol > 0 && sportPnl > 0 ? vol / sportPnl : 0;
    if (ratio > 200) score += 30; else if (ratio > 100) score += 20;
    if (sportBets > 1000) score += 25; else if (sportBets > 500) score += 15;
    if (marketsTraded > 100 && sportBets > 0) {
      const pct = sportBets / marketsTraded;
      if (pct < 0.02) score += 20; else if (pct < 0.05) score += 10;
    }
    if (sportROI < 1 && vol > 10e6) score += 15;
    if (bs >= 3) score += 20; else if (bs >= 2) score += 15;
    if (sportWinRate != null && sportWinRate < 5 && sportBets > 50) score += 15;

    // Protect genuine directional sharps using LB sportPnl/ROI only.
    // Do NOT trust perSport.pnl/roi from sports_sharps — those were historically
    // summed from REALIZEDPNL-sorted closed pages and do not reconcile to the
    // SPORTS leaderboard (winner-bias). Require low both-sides today + no
    // high-volume churn (vol/pnl > 100×).
    const highChurn = ratio > 100;
    const isProfitableSharp = bs < 2 && !highChurn && sportPnl > 10000 && sportROI > 10;
    return score >= 35 && !isProfitableSharp;
  };

  const writeVaultExclusionFile = (bothSidesMap) => {
    const mmAddresses = mmFiltered.map(([a]) => (a || '').toLowerCase());
    const vaultTraderSet = new Set();
    const elig = new Set([
      ...Object.keys(sportsSharps).filter((k) => k !== '_meta').map((k) => k.toLowerCase()),
      ...walletsToScan.map((w) => (w.addr || '').toLowerCase()),
    ]);
    for (const addr of elig) {
      if (buildTraderVerdict(addr, bothSidesMap || {})) vaultTraderSet.add(addr);
    }
    writeIntelExcludedWallets(mmAddresses, [...vaultTraderSet]);
    return vaultTraderSet;
  };

  if (gameKeys.length === 0) {
    console.log('No games today — skipping scan');
    const outPath = join(ROOT, 'public', 'sharp_positions.json');
    writeFileSync(outPath, JSON.stringify({ NHL: {}, CBB: {}, MLB: {}, NBA: {}, SOC: {}, UFC: {}, WNBA: {}, scannedAt: new Date().toISOString(), walletsScanned: 0 }, null, 2), 'utf8');
    writeVaultExclusionFile({});
    return;
  }

  console.log(`Scanning ${walletsToScan.length} sharp wallets (${mmFiltered.length} MMs + ${sportLosers.length} sport losers + ${noSport.length} non-sport excluded, ${supplementalCount} added from sport sharps)...\n`);

  // Build lookup of previous firstSeen timestamps to preserve across rescans
  const prevPositions = {};
  for (const filename of ['sharp_positions.json', 'sharp_spread_positions.json', 'sharp_total_positions.json']) {
    const prevData = loadJSON(filename);
    if (!prevData) continue;
    for (const sport of ['NHL', 'CBB', 'MLB', 'NBA', 'SOC', 'UFC', 'WNBA']) {
      for (const [gameKey, game] of Object.entries(prevData[sport] || {})) {
        for (const pos of (game.positions || [])) {
          if (pos.firstSeen) {
            const mt = pos.marketType || 'ml';
            prevPositions[`${pos.wallet}_${gameKey}_${pos.side}_${mt}`] = pos.firstSeen;
          }
        }
      }
    }
  }

  const result = { NHL: {}, CBB: {}, MLB: {}, NBA: {}, SOC: {}, UFC: {}, WNBA: {} };
  const spreadResult = { NHL: {}, CBB: {}, MLB: {}, NBA: {}, SOC: {}, UFC: {}, WNBA: {} };
  const totalResult = { NHL: {}, CBB: {}, MLB: {}, NBA: {}, SOC: {}, UFC: {}, WNBA: {} };
  // Per-wallet open-asset inventory from this scan — writeSharpActions uses
  // this to stamp EXITED when a previously-open token is gone after a
  // successful fetch (true exit), vs wallets that never appeared this cycle
  // (scanner silence — keep PENDING, freshness prune still applies).
  const heartbeatOkWallets = new Set();
  const heartbeatOpenAssets = {}; // walletLower → Set<assetId>
  let matchCount = 0;
  let spreadMatchCount = 0;
  let totalMatchCount = 0;
  let errorCount = 0;

  // ── Phase A: fetch every wallet's open positions in parallel (bounded) ──
  // The network call is the bottleneck (1 throttled request per wallet). A
  // small concurrency pool collapses what was ~6 min of serial 800ms-spaced
  // calls into ~1-2 min, while keeping the exact per-request retry / 429
  // backoff semantics of fetchWithRetry. Results are kept by index so Phase B
  // processes wallets in the original order — output is identical to the old
  // sequential scan.
  console.log(`Fetching positions for ${walletsToScan.length} wallets (concurrency=${SCAN_CONCURRENCY})...`);
  const fetchedPositions = await mapPool(
    walletsToScan,
    SCAN_CONCURRENCY,
    (wallet) => fetchWithRetry(`${DATA_API}/positions?user=${wallet.addr}&limit=500`),
  );

  // ── Phase B: process results sequentially in original order (no network) ──
  for (let wi = 0; wi < walletsToScan.length; wi++) {
    const wallet = walletsToScan[wi];
    const positions = fetchedPositions[wi];
    process.stdout.write(`  ${wallet.tier === 'ELITE' ? '***' : '**'} ${wallet.name || wallet.addr.slice(0, 10)}: `);

    if (!positions || !Array.isArray(positions)) {
      console.log('no data');
      errorCount++;
      continue;
    }

    const wLower = (wallet.addr || '').toLowerCase();
    if (wLower) {
      heartbeatOkWallets.add(wLower);
      const assetSet = heartbeatOpenAssets[wLower] || new Set();
      for (const p of positions) {
        if (p?.asset != null && p.asset !== '') assetSet.add(String(p.asset));
      }
      heartbeatOpenAssets[wLower] = assetSet;
    }

    let walletMatches = 0;

    for (const pos of positions) {
      const title = pos.title || '';
      let match = matchPositionToGameOrSoccer(title, todaysGames, cbbMap);
      let forcedSpread = false;

      if (!match) {
        const spreadMatch = matchSpreadTitle(title, todaysGames, cbbMap);
        if (spreadMatch) {
          match = spreadMatch;
          forcedSpread = true;
        } else {
          continue;
        }
      }

      const outcome = pos.outcome || '';
      const outcomeNorm = normalize(outcome);

      const curPrice = parseFloat(pos.curPrice || '0');
      if (curPrice <= 0.01 || curPrice >= 0.99) continue;

      // Classify market type from outcome and title
      const titleLower = title.toLowerCase();
      const isTotal = ['over', 'under'].includes(outcomeNorm);
      const isSpread = forcedSpread || (!isTotal && (titleLower.includes('spread') || /[+-]\d+\.?\d*/.test(outcome)));
      const marketType = isTotal ? 'total' : isSpread ? 'spread' : 'ml';

      let entryLine = null;
      if (isSpread || isTotal) {
        const polyGame = polyData?.[match.sport]?.[match.key];

        if (isSpread) {
          // PRIMARY: parse the line from the position's own title
          // e.g. "Spread: Celtics (-12.5)" → line = -12.5
          const titleLineMatch = title.match(/\(([+-]?\d+\.?\d*)\)/);
          if (titleLineMatch) {
            const titleLine = parseFloat(titleLineMatch[1]);
            // The title line is FROM the team's perspective named in the title.
            // If outcome matches that team, use as-is; if outcome is the other side, negate.
            const titleTeamMatch = title.match(/^Spread:\s+(.+?)\s*\(/i);
            if (titleTeamMatch) {
              const titleTeamNorm = normalize(titleTeamMatch[1]);
              entryLine = normalize(outcome).includes(titleTeamNorm) || titleTeamNorm.includes(normalize(outcome))
                ? titleLine : -titleLine;
            } else {
              entryLine = titleLine;
            }
          }

          // FALLBACK: polySpread data (can be wrong market type like 1H)
          if (entryLine == null && polyGame?.polySpread) {
            const ps = polyGame.polySpread;
            const outcomeIdx = (ps.outcomes || []).findIndex(o => normalize(o) === outcomeNorm);
            if (outcomeIdx === 0) entryLine = ps.line;
            else if (outcomeIdx === 1) entryLine = -ps.line;
            else if (match.spreadLine != null) entryLine = match.spreadLine;
          } else if (entryLine == null && match.spreadLine != null) {
            entryLine = match.spreadLine;
          }
        }

        if (isTotal) {
          // PRIMARY: parse the line from the wallet's OWN position title.
          // A single Polymarket "event" lists many O/U sub-markets per
          // game — full game, F5, alt-lines (O/U 4.5, 5.5, 7.5, 8.5, 9.5,
          // ...). fetchPolymarketData caches whichever O/U it sees first
          // into polyGame.polyTotal, which is frequently NOT the line the
          // sharp actually bet. The wallet's own position title is
          // self-evident truth ("Detroit Tigers vs. Tampa Bay Rays: O/U
          // 8.5" → 8.5) and is what AGS must score, what the UI must
          // display, and what the grader must compare against the final
          // score. Mirrors the spread branch which already parses from
          // the position title first.
          const titleTotalMatch = title.match(/(?:O\/U|Over|Under|Total)[^\d]*(\d+\.?\d*)/i);
          if (titleTotalMatch) {
            entryLine = parseFloat(titleTotalMatch[1]);
          } else {
            // FALLBACK: cached polyTotal — only when the position title
            // lacks a line (rare; usually a stripped/abbreviated title).
            const pt = polyGame?.polyTotal;
            const isGameTotal = pt && (pt.outcomes || []).some(o => /^over$/i.test(o));
            if (isGameTotal) entryLine = pt.line;
          }
        }
      }

      const game = todaysGames[`${match.sport}:${match.key}`];
      const sport = match.sport;

      let side;
      if (isTotal) {
        side = outcomeNorm === 'over' ? 'over' : 'under';
      } else if (sport === 'SOC') {
        // 3-way: side comes from the negRisk market itself + Yes outcome.
        // "No" on a single side (= home OR draw) isn't attributable — skip.
        side = resolveSoccerSide(match, outcome, game.away, game.home);
        if (!side) continue;
      } else if (sport === 'UFC' && match.side) {
        // Prop titles ("Will Holloway win by KO?") already carry the side.
        side = match.side;
      } else {
        side = resolveOutcomeSide(outcome, game.away, game.home, title);
      }

      const size = parseFloat(pos.size || '0');
      const avgPrice = parseFloat(pos.avgPrice || '0');
      const cashPnl = parseFloat(pos.cashPnl || '0');
      const invested = Math.round(size * avgPrice);
      const currentValue = Math.round(size * curPrice);

      const targetResult = marketType === 'total' ? totalResult : marketType === 'spread' ? spreadResult : result;

      if (!targetResult[sport][match.key]) {
        targetResult[sport][match.key] = {
          away: game.away,
          home: game.home,
          positions: [],
          summary: marketType === 'total'
            ? { sharpOver: 0, sharpUnder: 0, overInvested: 0, underInvested: 0 }
            : sport === 'SOC'
              ? { sharpAway: 0, sharpHome: 0, sharpDraw: 0, awayInvested: 0, homeInvested: 0, drawInvested: 0 }
              : { sharpAway: 0, sharpHome: 0, awayInvested: 0, homeInvested: 0 },
        };
      }

      const posKey = `${wallet.addr}_${match.key}_${side}_${marketType}`;
      const prevFirstSeen = prevPositions[posKey] || null;

      const posFirstSeen = prevFirstSeen ? new Date(prevFirstSeen).getTime() : Date.now();
      if (game.commence && posFirstSeen >= new Date(game.commence).getTime()) continue;

      const eff = effectiveTier(wallet.tier, wallet.addr, sport);
      targetResult[sport][match.key].positions.push({
        wallet: wallet.addr,
        name: wallet.name,
        tier: eff.tier,
        totalPnl: eff.sportPnl || wallet.totalPnl || 0,
        sportPnlTotal: eff.sportPnl || 0,
        outcome,
        side,
        marketType,
        size: Math.round(size),
        avgPrice: +avgPrice.toFixed(3),
        invested,
        curPrice: +curPrice.toFixed(3),
        currentValue,
        pnl: Math.round(cashPnl),
        firstSeen: prevFirstSeen || new Date().toISOString(),
        ...(entryLine != null && { entryLine }),
        // Polymarket position identity — used for deterministic EXITED stamps
        ...(pos.asset != null && pos.asset !== '' && { asset: String(pos.asset) }),
        ...(pos.conditionId != null && pos.conditionId !== '' && { conditionId: String(pos.conditionId) }),
        ...(pos.outcomeIndex != null && pos.outcomeIndex !== '' && { outcomeIndex: Number(pos.outcomeIndex) }),
        ...(pos.eventId != null && pos.eventId !== '' && { eventId: String(pos.eventId) }),
        sportPnl: eff.sportPnl,
        sportVerified: eff.sportVerified,
        sportROI: eff.sportROI,
        avgSportBet: eff.avgSportBet,
        leaderboardRank: eff.leaderboardRank ?? null,
        sportsLbPercentileTop: eff.sportsLbPercentileTop ?? null,
        sportVol: eff.sportVol || 0,
        ...(eff.monthlyQualified && { monthlyPnl: eff.monthlyPnl, monthlyQualified: true }),
      });

      const summary = targetResult[sport][match.key].summary;
      if (marketType === 'total') {
        if (side === 'over') { summary.sharpOver++; summary.overInvested += invested; }
        else { summary.sharpUnder++; summary.underInvested += invested; }
      } else {
        if (side === 'away') { summary.sharpAway++; summary.awayInvested += invested; }
        else if (side === 'draw') { summary.sharpDraw = (summary.sharpDraw || 0) + 1; summary.drawInvested = (summary.drawInvested || 0) + invested; }
        else { summary.sharpHome++; summary.homeInvested += invested; }
      }

      walletMatches++;
      if (marketType === 'spread') spreadMatchCount++;
      else if (marketType === 'total') totalMatchCount++;
      else matchCount++;
    }

    if (walletMatches > 0) {
      console.log(`${walletMatches} position(s) on today's games`);
    } else {
      console.log('no positions on today');
    }
  }

  // ─── Clear-trader filter (post-scan) ────────────────────────────────────────
  // Removes positions from wallets that are clearly non-directional actors
  // (bots, arb traders, market makers with no real sport conviction).
  // Protects profitable sharps (sportPnl > $10K AND sportROI > 10%) even if
  // they trip other signals, since those wallets are genuinely picking sides.
  let tradersRemoved = 0;
  {
    const bothSidesCount = {};
    for (const resSet of [result, spreadResult, totalResult]) {
      for (const sport of ['NHL', 'CBB', 'MLB', 'NBA', 'SOC', 'UFC', 'WNBA']) {
        for (const gd of Object.values(resSet[sport] || {})) {
          const walletSides = {};
          for (const pos of gd.positions || []) {
            if (!walletSides[pos.wallet]) walletSides[pos.wallet] = new Set();
            walletSides[pos.wallet].add(pos.side);
          }
          for (const [w, sides] of Object.entries(walletSides)) {
            const wl = (w || '').toLowerCase();
            if (sides.size > 1) bothSidesCount[wl] = (bothSidesCount[wl] || 0) + 1;
          }
        }
      }
    }

    const allWalletsInResults = new Set();
    for (const resSet of [result, spreadResult, totalResult]) {
      for (const sport of ['NHL', 'CBB', 'MLB', 'NBA', 'SOC', 'UFC', 'WNBA']) {
        for (const gd of Object.values(resSet[sport] || {})) {
          for (const pos of gd.positions || []) allWalletsInResults.add(pos.wallet);
        }
      }
    }

    const vaultTraderSet = writeVaultExclusionFile(bothSidesCount);
    const traderSet = new Set(
      [...allWalletsInResults]
        .filter((a) => {
          const al = (a || '').toLowerCase();
          return vaultTraderSet.has(al) || mmAddressSet.has(al);
        })
        .map((a) => (a || '').toLowerCase()),
    );

    let traderPosRemoved = 0;
    let traderDollarsRemoved = 0;

    function stripTraders(resSet, isTotalMarket = false) {
      for (const sport of ['NHL', 'CBB', 'MLB', 'NBA', 'SOC', 'UFC', 'WNBA']) {
        for (const [gameKey, gd] of Object.entries(resSet[sport] || {})) {
          const removed = gd.positions.filter(p => traderSet.has((p.wallet || '').toLowerCase()));
          gd.positions = gd.positions.filter(p => !traderSet.has((p.wallet || '').toLowerCase()));
          traderPosRemoved += removed.length;
          traderDollarsRemoved += removed.reduce((s, p) => s + (p.invested || 0), 0);

          if (gd.positions.length === 0) {
            delete resSet[sport][gameKey];
            continue;
          }

          if (removed.length > 0) {
            if (isTotalMarket) {
              gd.summary = { sharpOver: 0, sharpUnder: 0, overInvested: 0, underInvested: 0 };
              for (const p of gd.positions) {
                if (p.side === 'over') { gd.summary.sharpOver++; gd.summary.overInvested += p.invested; }
                else { gd.summary.sharpUnder++; gd.summary.underInvested += p.invested; }
              }
            } else {
              gd.summary = {
                sharpAway: 0, sharpHome: 0, awayInvested: 0, homeInvested: 0,
                ...(sport === 'SOC' && { sharpDraw: 0, drawInvested: 0 }),
              };
              for (const p of gd.positions) {
                if (p.side === 'away') { gd.summary.sharpAway++; gd.summary.awayInvested += p.invested; }
                else if (p.side === 'draw') { gd.summary.sharpDraw = (gd.summary.sharpDraw || 0) + 1; gd.summary.drawInvested = (gd.summary.drawInvested || 0) + p.invested; }
                else { gd.summary.sharpHome++; gd.summary.homeInvested += p.invested; }
              }
            }
          }
        }
      }
    }

    stripTraders(result);
    stripTraders(spreadResult);
    stripTraders(totalResult, true);
    tradersRemoved = traderSet.size;

    if (tradersRemoved > 0) {
      console.log(`\nTrader filter: excluded ${tradersRemoved} clear-trader wallets (${traderPosRemoved} positions, $${Math.round(traderDollarsRemoved / 1000)}K removed)`);
    }
  }

  // Sort and finalize all three result sets
  function finalizeResult(res, isTotalMarket = false) {
    for (const sport of Object.values(res)) {
      if (typeof sport !== 'object' || sport === null) continue;
      for (const game of Object.values(sport)) {
        if (game.positions) {
          game.positions.sort((a, b) => b.invested - a.invested);
          const s = game.summary;
          if (isTotalMarket) {
            s.consensus = s.overInvested > s.underInvested ? 'over'
                        : s.underInvested > s.overInvested ? 'under'
                        : null;
            s.totalInvested = s.overInvested + s.underInvested;
          } else {
            // 3-way aware (drawInvested is 0/absent for non-SOC sports)
            const dInv = s.drawInvested || 0;
            s.consensus = (s.awayInvested > s.homeInvested && s.awayInvested > dInv) ? 'away'
                        : (s.homeInvested > s.awayInvested && s.homeInvested > dInv) ? 'home'
                        : (dInv > s.awayInvested && dInv > s.homeInvested) ? 'draw'
                        : null;
            s.totalInvested = s.awayInvested + s.homeInvested + dInv;
          }
        }
      }
    }
  }

  finalizeResult(result);
  finalizeResult(spreadResult);
  finalizeResult(totalResult, true);

  const openAssetsOut = {};
  for (const [w, set] of Object.entries(heartbeatOpenAssets)) {
    openAssetsOut[w] = [...set];
  }
  const scanHeartbeat = {
    scannedAt: new Date().toISOString(),
    okWallets: [...heartbeatOkWallets],
    openAssets: openAssetsOut,
  };

  const meta = {
    scannedAt: scanHeartbeat.scannedAt,
    walletsScanned: walletsToScan.length,
    mmExcluded: mmFiltered.length,
    sportLosersExcluded: sportLosers.length,
    noSportExcluded: noSport.length,
    tradersExcluded: tradersRemoved,
    totalExcluded: mmFiltered.length + sportLosers.length + noSport.length + tradersRemoved,
    scanHeartbeat,
  };

  Object.assign(result, meta);
  Object.assign(spreadResult, meta);
  Object.assign(totalResult, meta);

  const outPath = join(ROOT, 'public', 'sharp_positions.json');
  writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf8');

  const spreadOutPath = join(ROOT, 'public', 'sharp_spread_positions.json');
  writeFileSync(spreadOutPath, JSON.stringify(spreadResult, null, 2), 'utf8');

  const totalOutPath = join(ROOT, 'public', 'sharp_total_positions.json');
  writeFileSync(totalOutPath, JSON.stringify(totalResult, null, 2), 'utf8');

  let totalGamesWithPositions = 0;
  let spreadGames = 0;
  let totalGames = 0;
  for (const sport of ['NHL', 'CBB', 'MLB', 'NBA', 'SOC', 'UFC', 'WNBA']) {
    totalGamesWithPositions += Object.keys(result[sport]).length;
    spreadGames += Object.keys(spreadResult[sport]).length;
    totalGames += Object.keys(totalResult[sport]).length;
  }

  console.log(`\nDone — ${matchCount} ML, ${spreadMatchCount} spread, ${totalMatchCount} total positions`);
  console.log(`Games: ${totalGamesWithPositions} ML, ${spreadGames} spread, ${totalGames} total`);
  console.log(`Wrote ${outPath}, ${spreadOutPath}, ${totalOutPath}`);
  if (errorCount > 0) console.log(`(${errorCount} wallets failed to fetch)`);
}

run().catch(e => { console.error(e); process.exit(1); });
