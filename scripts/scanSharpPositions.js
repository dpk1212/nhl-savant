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
const TIERS_TO_SCAN = ['ELITE', 'PROVEN', 'ACTIVE'];

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
  CBB: ['ncaa', 'march madness', 'college basketball', 'bulldogs',
    'wildcats', 'tigers', 'eagles', 'bears', 'blue devils', 'tar heels',
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

// ─── Build today's game lookup ──────────────────────────────────────────────
// Keys are sport-prefixed ("NHL:bos_tor") to prevent collisions when
// NHL and MLB share 3-letter city codes (bos, tor, min, col, etc.)
function buildTodaysGames(polyData) {
  const games = {};
  for (const sport of ['NHL', 'CBB', 'MLB', 'NBA']) {
    const sportGames = polyData?.[sport] || {};
    for (const [key, g] of Object.entries(sportGames)) {
      const away = g.awayTeam || '';
      const home = g.homeTeam || '';
      games[`${sport}:${key}`] = { sport, away, home, key, title: g.title || '' };
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

  // Load supplementary sports sharps (top sport-profitable bettors discovered separately)
  let sportsSharps = {};
  const sharpsFile = join(ROOT, 'public', 'sports_sharps.json');
  if (existsSync(sharpsFile)) {
    try {
      const raw = JSON.parse(readFileSync(sharpsFile, 'utf-8'));
      const { _meta, ...wallets } = raw;
      sportsSharps = wallets;
      console.log(`Loaded ${Object.keys(sportsSharps).length} supplementary sport sharps from sports_sharps.json`);
    } catch (e) {
      console.log(`sports_sharps.json parse error — skipping: ${e.message}`);
    }
  }

  const cbbMap = loadCBBTeamMap();
  const todaysGames = buildTodaysGames(polyData);
  const gameKeys = Object.keys(todaysGames);
  console.log(`Today's games: ${gameKeys.length} (${gameKeys.filter(k => todaysGames[k].sport === 'NHL').length} NHL, ${gameKeys.filter(k => todaysGames[k].sport === 'CBB').length} CBB, ${gameKeys.filter(k => todaysGames[k].sport === 'MLB').length} MLB, ${gameKeys.filter(k => todaysGames[k].sport === 'NBA').length} NBA)\n`);

  if (gameKeys.length === 0) {
    console.log('No games today — skipping scan');
    const outPath = join(ROOT, 'public', 'sharp_positions.json');
    writeFileSync(outPath, JSON.stringify({ NHL: {}, CBB: {}, MLB: {}, NBA: {}, scannedAt: new Date().toISOString(), walletsScanned: 0 }, null, 2), 'utf8');
    return;
  }

  // Existing pipeline: tier + mmScore + sport PnL floor
  const MM_THRESHOLD = 40;
  const SPORT_PNL_FLOOR = -100000;

  const allEligible = Object.entries(profiles)
    .filter(([, p]) => TIERS_TO_SCAN.includes(p.tier));

  const isExcluded = (p) => {
    if ((p.mmScore || 0) > MM_THRESHOLD) return 'mm';
    const sportPnl = Object.values(p.sportPnl || {}).reduce((s, v) => s + v, 0);
    if (sportPnl < SPORT_PNL_FLOOR) return 'sport_loser';
    return false;
  };

  const mmFiltered = allEligible.filter(([, p]) => isExcluded(p) === 'mm');
  const sportLosers = allEligible.filter(([, p]) => isExcluded(p) === 'sport_loser');
  const baseWallets = allEligible
    .filter(([, p]) => !isExcluded(p))
    .map(([addr, p]) => ({ addr, name: p.name, tier: p.tier, totalPnl: p.totalPnl, sportPnl: p.sportPnl || {}, mmScore: p.mmScore || 0 }));

  // Merge in sport sharps that aren't already in the base list
  const baseAddrs = new Set(baseWallets.map(w => w.addr));
  let supplementalCount = 0;
  for (const [addr, p] of Object.entries(sportsSharps)) {
    if (!baseAddrs.has(addr)) {
      baseWallets.push({ addr, name: p.name, tier: 'SHARP', totalPnl: p.totalPnl, sportPnl: p.sportPnl || {}, sportPnlTotal: p.sportPnlTotal || 0, mmScore: 0 });
      supplementalCount++;
    }
  }

  const walletsToScan = baseWallets.sort((a, b) => b.totalPnl - a.totalPnl);
  console.log(`Scanning ${walletsToScan.length} sharp wallets (${mmFiltered.length} MMs + ${sportLosers.length} sport losers excluded, ${supplementalCount} added from sport sharps)...\n`);

  // Build lookup of previous firstSeen timestamps to preserve across rescans
  const prevData = loadJSON('sharp_positions.json');
  const prevPositions = {};
  if (prevData) {
    for (const sport of ['NHL', 'CBB', 'MLB', 'NBA']) {
      for (const [gameKey, game] of Object.entries(prevData[sport] || {})) {
        for (const pos of (game.positions || [])) {
          if (pos.firstSeen) {
            prevPositions[`${pos.wallet}_${gameKey}_${pos.side}`] = pos.firstSeen;
          }
        }
      }
    }
  }

  const result = { NHL: {}, CBB: {}, MLB: {}, NBA: {} };
  let matchCount = 0;
  let errorCount = 0;

  for (const wallet of walletsToScan) {
    process.stdout.write(`  ${wallet.tier === 'ELITE' ? '***' : '**'} ${wallet.name || wallet.addr.slice(0, 10)}: `);

    const positions = await fetchWithRetry(
      `${DATA_API}/positions?user=${wallet.addr}&limit=500`
    );
    await sleep(DELAY_MS);

    if (!positions || !Array.isArray(positions)) {
      console.log('no data');
      errorCount++;
      continue;
    }

    let walletMatches = 0;

    for (const pos of positions) {
      const title = pos.title || '';
      const match = matchPositionToGame(title, todaysGames, cbbMap);
      if (!match) continue;

      const outcome = pos.outcome || '';
      const outcomeNorm = normalize(outcome);

      // Skip totals/props — only want moneyline positions
      if (['over', 'under'].includes(outcomeNorm)) continue;

      const curPrice = parseFloat(pos.curPrice || '0');
      // Skip resolved positions (price collapsed to 0 or 1)
      if (curPrice <= 0.01 || curPrice >= 0.99) continue;

      const game = todaysGames[`${match.sport}:${match.key}`];
      const sport = match.sport;
      const side = resolveOutcomeSide(outcome, game.away, game.home, title);

      const size = parseFloat(pos.size || '0');
      const avgPrice = parseFloat(pos.avgPrice || '0');
      const cashPnl = parseFloat(pos.cashPnl || '0');
      const invested = Math.round(size * avgPrice);
      const currentValue = Math.round(size * curPrice);

      if (!result[sport][match.key]) {
        result[sport][match.key] = {
          away: game.away,
          home: game.home,
          positions: [],
          summary: { sharpAway: 0, sharpHome: 0, awayInvested: 0, homeInvested: 0 },
        };
      }

      const posKey = `${wallet.addr}_${match.key}_${side}`;
      const prevFirstSeen = prevPositions[posKey] || null;

      result[sport][match.key].positions.push({
        wallet: wallet.addr,
        name: wallet.name,
        tier: wallet.tier,
        totalPnl: wallet.totalPnl,
        outcome,
        side,
        size: Math.round(size),
        avgPrice: +avgPrice.toFixed(3),
        invested,
        curPrice: +curPrice.toFixed(3),
        currentValue,
        pnl: Math.round(cashPnl),
        firstSeen: prevFirstSeen || new Date().toISOString(),
      });

      const summary = result[sport][match.key].summary;
      if (side === 'away') {
        summary.sharpAway++;
        summary.awayInvested += invested;
      } else {
        summary.sharpHome++;
        summary.homeInvested += invested;
      }

      walletMatches++;
      matchCount++;
    }

    if (walletMatches > 0) {
      console.log(`${walletMatches} position(s) on today's games`);
    } else {
      console.log('no positions on today');
    }
  }

  // Sort positions within each game by invested amount
  for (const sport of Object.values(result)) {
    if (typeof sport !== 'object' || sport === null) continue;
    for (const game of Object.values(sport)) {
      if (game.positions) {
        game.positions.sort((a, b) => b.invested - a.invested);
        const s = game.summary;
        s.consensus = s.awayInvested > s.homeInvested ? 'away'
                    : s.homeInvested > s.awayInvested ? 'home'
                    : null;
        s.totalInvested = s.awayInvested + s.homeInvested;
      }
    }
  }

  result.scannedAt = new Date().toISOString();
  result.walletsScanned = walletsToScan.length;
  result.mmExcluded = mmFiltered.length;
  result.sportLosersExcluded = sportLosers.length;
  result.totalExcluded = mmFiltered.length + sportLosers.length;

  const outPath = join(ROOT, 'public', 'sharp_positions.json');
  writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf8');

  let totalGamesWithPositions = 0;
  for (const sport of ['NHL', 'CBB', 'MLB', 'NBA']) {
    totalGamesWithPositions += Object.keys(result[sport]).length;
  }

  console.log(`\nDone — ${matchCount} sharp positions found across ${totalGamesWithPositions} games`);
  console.log(`Wrote ${outPath}`);
  if (errorCount > 0) console.log(`(${errorCount} wallets failed to fetch)`);
}

run().catch(e => { console.error(e); process.exit(1); });
