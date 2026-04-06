/**
 * Polymarket Data Fetcher — CBB & NHL
 *
 * Fetches events, volume, trades, price movement from Polymarket.
 * Matches to games using basketball_teams.csv (CBB) and NHL team map.
 * ONLY outputs data for games in today's OddsTrader schedule.
 * Outputs JSON to public/polymarket_data.json for UI consumption.
 *
 * Usage: node scripts/fetchPolymarketData.js
 */

import * as dotenv from 'dotenv';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parseOddsTrader } from '../src/utils/oddsTraderParser.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
dotenv.config({ path: join(ROOT, '.env') });

const GAMMA = 'https://gamma-api.polymarket.com';
const ODDS_API_KEY = process.env.ODDS_API_KEY;
const DATA = 'https://data-api.polymarket.com';
const CLOB = 'https://clob.polymarket.com';

const httpFetch = typeof globalThis.fetch === 'function' ? globalThis.fetch : (await import('node-fetch')).default;

async function get(path, base = GAMMA) {
  const url = base + path;
  const res = await httpFetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

/** List active events by tag with pagination. Client-side sort by volume. */
async function listEvents(tagSlug, maxResults = 200) {
  const all = [];
  for (let offset = 0; offset < maxResults; offset += 100) {
    const params = new URLSearchParams({ active: 'true', closed: 'false', limit: '100', offset: String(offset) });
    if (tagSlug) params.set('tag_slug', tagSlug);
    try {
      const events = await get(`/events?${params}`);
      const arr = Array.isArray(events) ? events : [];
      all.push(...arr);
      if (arr.length < 100) break;
    } catch { break; }
  }
  all.sort((a, b) => (b.volume_24hr ?? b.volume ?? 0) - (a.volume_24hr ?? a.volume ?? 0));
  return all;
}

async function getLiveVolume(eventId) {
  const data = await get(`/live-volume?id=${eventId}`, DATA);
  return Array.isArray(data) ? data[0] : data;
}

async function getAllTrades(eventId) {
  const PAGE = 500;
  let all = [];
  let offset = 0;
  while (true) {
    const params = new URLSearchParams({ eventId: String(eventId), limit: String(PAGE), offset: String(offset) });
    try {
      const batch = await get(`/trades?${params}`, DATA);
      if (!Array.isArray(batch) || batch.length === 0) break;
      all = all.concat(batch);
      if (batch.length < PAGE) break;
      offset += batch.length;
    } catch {
      break;
    }
  }
  return all;
}

async function getWhaleTrades(eventId, minCash = 500, limit = 50) {
  const params = new URLSearchParams({
    eventId: String(eventId), limit: String(limit),
    filterType: 'CASH', filterAmount: String(minCash),
  });
  try {
    const trades = await get(`/trades?${params}`, DATA);
    return Array.isArray(trades) ? trades : [];
  } catch { return []; }
}

async function getPriceHistory(tokenId, interval = '1h') {
  const params = new URLSearchParams({ market: tokenId, interval });
  const data = await get(`/prices-history?${params}`, CLOB);
  return data?.history || [];
}

function aggregateTrades(trades, awayRaw, homeRaw) {
  let totalCash = 0;
  let awayCash = 0, homeCash = 0;
  let awayTickets = 0, homeTickets = 0;
  const nAway = normalize(awayRaw);
  const nHome = normalize(homeRaw);

  for (const t of trades) {
    const cash = (t.size || 0) * (t.price || 0);
    totalCash += cash;
    const outcome = normalize(t.outcome || '');
    const isAway = outcome.includes(nAway) || nAway.includes(outcome) || outcome === 'yes';
    const isHome = outcome.includes(nHome) || nHome.includes(outcome) || outcome === 'no';

    if (isAway) { awayCash += cash; awayTickets++; }
    else if (isHome) { homeCash += cash; homeTickets++; }
    else { awayCash += cash; awayTickets++; }
  }
  const totalTickets = awayTickets + homeTickets;
  return {
    totalCash: Math.round(totalCash),
    awayMoneyPct: totalCash > 0 ? Number((awayCash / totalCash * 100).toFixed(1)) : 0,
    homeMoneyPct: totalCash > 0 ? Number((homeCash / totalCash * 100).toFixed(1)) : 0,
    awayTicketPct: totalTickets > 0 ? Number((awayTickets / totalTickets * 100).toFixed(1)) : 0,
    homeTicketPct: totalTickets > 0 ? Number((homeTickets / totalTickets * 100).toFixed(1)) : 0,
    ticketCount: trades.length,
  };
}

function priceMovePct(history) {
  if (!history || history.length < 2) return null;
  const first = history[0].p;
  const last = history[history.length - 1].p;
  if (first <= 0) return null;
  return Number(((last - first) / first * 100).toFixed(1));
}

function normalize(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

// ─── CBB: Team name mapping from basketball_teams.csv ──────────────────────
function loadCBBTeamMap() {
  const csvPath = join(ROOT, 'public', 'basketball_teams.csv');
  let csv;
  try {
    csv = readFileSync(csvPath, 'utf8');
  } catch { return new Map(); }
  const lines = csv.split('\n').filter(Boolean);
  const headers = lines[0].toLowerCase().split(',');
  const map = new Map(); // normalizedToken -> oddstrader_name (canonical)
  for (let i = 1; i < lines.length; i++) {
    const vals = parseCSVLine(lines[i]);
    const row = {};
    headers.forEach((h, j) => { row[h.trim()] = vals[j]?.trim() || ''; });
    const oddstrader = row.oddstrader_name || row.normalized_name || '';
    if (!oddstrader) continue;
    const names = [
      oddstrader,
      row.normalized_name,
      row.haslametrics_name,
      row.dratings_name,
      row.ncaa_name,
      row.espn_name,
      row.barttorvik_name,
      row.odds_api_name,
      row.cbbd_name,
    ].filter(Boolean);
    for (const n of names) {
      const nrm = normalize(n);
      if (nrm.length >= 2) map.set(nrm, oddstrader);
    }
  }
  return map;
}

function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else current += char;
  }
  values.push(current.trim());
  return values;
}

// ─── MLB: Polymarket names -> team codes ─────────────────────────────────────
const MLB_NAME_TO_CODE = {
  'Arizona': 'ARI', 'Atlanta': 'ATL', 'Baltimore': 'BAL', 'Boston': 'BOS',
  'Chicago Cubs': 'CHC', 'Chicago White Sox': 'CWS', 'Cincinnati': 'CIN',
  'Cleveland': 'CLE', 'Colorado': 'COL', 'Detroit': 'DET', 'Houston': 'HOU',
  'Kansas City': 'KCR', 'Los Angeles Angels': 'LAA', 'Los Angeles Dodgers': 'LAD',
  'Miami': 'MIA', 'Milwaukee': 'MIL', 'Minnesota': 'MIN', 'New York Mets': 'NYM',
  'New York Yankees': 'NYY', 'Oakland': 'OAK', 'Athletics': 'OAK',
  'Sacramento Athletics': 'OAK', 'Philadelphia': 'PHI',
  'Pittsburgh': 'PIT', 'San Diego': 'SDP', 'San Francisco': 'SFG',
  'Seattle': 'SEA', 'St. Louis': 'STL', 'Tampa Bay': 'TBR', 'Texas': 'TEX',
  'Toronto': 'TOR', 'Washington': 'WSH',
};
const MLB_MAP = {
  diamondbacks: 'ARI', dbacks: 'ARI', braves: 'ATL', orioles: 'BAL',
  redsox: 'BOS', cubs: 'CHC', whitesox: 'CWS', reds: 'CIN',
  guardians: 'CLE', rockies: 'COL', tigers: 'DET', astros: 'HOU',
  royals: 'KCR', angels: 'LAA', dodgers: 'LAD', marlins: 'MIA',
  brewers: 'MIL', twins: 'MIN', mets: 'NYM', yankees: 'NYY',
  athletics: 'OAK', as: 'OAK', sacramentoathletics: 'OAK', phillies: 'PHI', pirates: 'PIT',
  padres: 'SDP', giants: 'SFG', mariners: 'SEA', cardinals: 'STL',
  stlouis: 'STL', rays: 'TBR', tampabay: 'TBR', rangers: 'TEX',
  bluejays: 'TOR', nationals: 'WSH',
};
Object.entries(MLB_NAME_TO_CODE).forEach(([name, code]) => {
  const n = normalize(name);
  if (!MLB_MAP[n]) MLB_MAP[n] = code;
});

function resolveMLBTeam(raw) {
  const n = normalize(raw);
  if (MLB_MAP[n]) return MLB_MAP[n];
  const words = raw.split(/\s+/);
  for (const w of words) {
    const wn = normalize(w);
    if (MLB_MAP[wn]) return MLB_MAP[wn];
  }
  return null;
}

// ─── NHL: Polymarket names -> OddsTrader TEAM CODES (LAK, NYI, etc.) ────────
const NHL_NAME_TO_CODE = {
  'Boston': 'BOS', 'Toronto': 'TOR', 'Montreal': 'MTL', 'Ottawa': 'OTT',
  'Buffalo': 'BUF', 'Detroit': 'DET', 'Tampa Bay': 'TBL', 'Florida': 'FLA',
  'Carolina': 'CAR', 'Washington': 'WSH', 'Pittsburgh': 'PIT',
  'Philadelphia': 'PHI', 'New Jersey': 'NJD', 'Columbus': 'CBJ',
  'Nashville': 'NSH', 'Winnipeg': 'WPG', 'Chicago': 'CHI', 'Minnesota': 'MIN',
  'Dallas': 'DAL', 'St. Louis': 'STL', 'Colorado': 'COL', 'Arizona': 'ARI',
  'Utah': 'UTA', 'Vegas': 'VGK', 'Los Angeles': 'LAK', 'Anaheim': 'ANA',
  'San Jose': 'SJS', 'Calgary': 'CGY', 'Edmonton': 'EDM', 'Vancouver': 'VAN',
  'Seattle': 'SEA', 'N.Y. Rangers': 'NYR', 'N.Y. Islanders': 'NYI',
};
const NHL_MAP = {
  bruins: 'BOS', mapleleafs: 'TOR', leafs: 'TOR',
  rangers: 'NYR', islanders: 'NYI',
  newyorkr: 'NYR', newyorki: 'NYI',
  canadiens: 'MTL', habs: 'MTL',
  senators: 'OTT', sabres: 'BUF', redwings: 'DET',
  lightning: 'TBL', bolts: 'TBL', tampabay: 'TBL',
  panthers: 'FLA', hurricanes: 'CAR',
  capitals: 'WSH', caps: 'WSH',
  penguins: 'PIT', pens: 'PIT',
  flyers: 'PHI', devils: 'NJD', newjersey: 'NJD',
  bluejackets: 'CBJ', jackets: 'CBJ',
  predators: 'NSH', preds: 'NSH',
  jets: 'WPG', blackhawks: 'CHI', hawks: 'CHI',
  wild: 'MIN', stars: 'DAL', blues: 'STL', stlouis: 'STL',
  avalanche: 'COL', avs: 'COL',
  coyotes: 'ARI', utah: 'UTA',
  knights: 'VGK', goldenknights: 'VGK',
  kings: 'LAK', losangeles: 'LAK',
  ducks: 'ANA', sharks: 'SJS', sanjose: 'SJS',
  flames: 'CGY', oilers: 'EDM',
  canucks: 'VAN', kraken: 'SEA',
};
Object.entries(NHL_NAME_TO_CODE).forEach(([name, code]) => {
  const n = normalize(name);
  if (!NHL_MAP[n]) NHL_MAP[n] = code;
});

function resolveNHLTeam(raw) {
  const n = normalize(raw);
  if (NHL_MAP[n]) return NHL_MAP[n];
  const words = raw.split(/\s+/);
  for (const w of words) {
    const wn = normalize(w);
    if (NHL_MAP[wn]) return NHL_MAP[wn];
  }
  return null;
}

// ─── NBA: Polymarket names -> team codes ─────────────────────────────────────
const NBA_NAME_TO_CODE = {
  'Atlanta': 'ATL', 'Boston': 'BOS', 'Brooklyn': 'BKN', 'Charlotte': 'CHA',
  'Chicago': 'CHI', 'Cleveland': 'CLE', 'Dallas': 'DAL', 'Denver': 'DEN',
  'Detroit': 'DET', 'Golden State': 'GSW', 'Houston': 'HOU', 'Indiana': 'IND',
  'Los Angeles Clippers': 'LAC', 'Los Angeles Lakers': 'LAL', 'LA Clippers': 'LAC',
  'LA Lakers': 'LAL', 'Memphis': 'MEM', 'Miami': 'MIA', 'Milwaukee': 'MIL',
  'Minnesota': 'MIN', 'New Orleans': 'NOP', 'New York': 'NYK',
  'Oklahoma City': 'OKC', 'Orlando': 'ORL', 'Philadelphia': 'PHI',
  'Phoenix': 'PHX', 'Portland': 'POR', 'Sacramento': 'SAC',
  'San Antonio': 'SAS', 'Toronto': 'TOR', 'Utah': 'UTH', 'Washington': 'WAS',
};
const NBA_MAP = {
  hawks: 'ATL', celtics: 'BOS', nets: 'BKN', hornets: 'CHA',
  bulls: 'CHI', cavaliers: 'CLE', cavs: 'CLE',
  mavericks: 'DAL', mavs: 'DAL', nuggets: 'DEN', pistons: 'DET',
  warriors: 'GSW', dubs: 'GSW', rockets: 'HOU', pacers: 'IND',
  clippers: 'LAC', lakers: 'LAL', grizzlies: 'MEM',
  heat: 'MIA', bucks: 'MIL', timberwolves: 'MIN', wolves: 'MIN',
  pelicans: 'NOP', knicks: 'NYK', thunder: 'OKC',
  magic: 'ORL', '76ers': 'PHI', sixers: 'PHI',
  suns: 'PHX', trailblazers: 'POR', blazers: 'POR',
  kings: 'SAC', spurs: 'SAS', raptors: 'TOR',
  jazz: 'UTH', wizards: 'WAS',
};
Object.entries(NBA_NAME_TO_CODE).forEach(([name, code]) => {
  const n = normalize(name);
  if (!NBA_MAP[n]) NBA_MAP[n] = code;
});

function resolveNBATeam(raw) {
  const n = normalize(raw);
  if (NBA_MAP[n]) return NBA_MAP[n];
  const words = raw.split(/\s+/);
  for (const w of words) {
    const wn = normalize(w);
    if (NBA_MAP[wn]) return NBA_MAP[wn];
  }
  return null;
}

// ─── Extract team names from Polymarket title ───────────────────────────────
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

// Find CBB team: Polymarket "Boston College Eagles" -> "Boston College" via longest prefix
function findCBBTeam(cbbMap, polymarketStr) {
  const n = normalize(polymarketStr);
  let best = null;
  let bestLen = 0;
  for (const [key, canon] of cbbMap) {
    if (n.startsWith(key) && key.length > bestLen) {
      best = canon;
      bestLen = key.length;
    }
    if (n === key) return canon;
  }
  return best || cbbMap.get(n);
}

// ─── Match event to game key ───────────────────────────────────────────────
function matchToGameKey(teams, cbbMap, sport) {
  if (!teams || teams.length !== 2) return null;
  const [a, b] = teams;
  if (sport === 'CBB') {
    const aCanon = findCBBTeam(cbbMap, a);
    const bCanon = findCBBTeam(cbbMap, b);
    if (!aCanon || !bCanon) return null;
    return `${normalize(aCanon)}_${normalize(bCanon)}`;
  }
  if (sport === 'NHL') {
    const aCode = resolveNHLTeam(a);
    const bCode = resolveNHLTeam(b);
    if (!aCode || !bCode) return null;
    return `${normalize(aCode)}_${normalize(bCode)}`;
  }
  if (sport === 'MLB') {
    const aCode = resolveMLBTeam(a);
    const bCode = resolveMLBTeam(b);
    if (!aCode || !bCode) return null;
    return `${normalize(aCode)}_${normalize(bCode)}`;
  }
  if (sport === 'NBA') {
    const aCode = resolveNBATeam(a);
    const bCode = resolveNBATeam(b);
    if (!aCode || !bCode) return null;
    return `${normalize(aCode)}_${normalize(bCode)}`;
  }
  return null;
}

// ─── Load today's schedule ──────────────────────────────────────────────────
async function loadTodaysSchedule(cbbMap) {
  const validCBB = new Set();
  const validNHL = new Set();
  const validMLB = new Set();
  const commenceTimes = {};

  // CBB: use Odds API (reliable, structured) instead of scraping OddsTrader markdown
  if (ODDS_API_KEY) {
    try {
      const url = `https://api.the-odds-api.com/v4/sports/basketball_ncaab/odds/?apiKey=${ODDS_API_KEY}&regions=us&markets=spreads&oddsFormat=american&bookmakers=fanduel`;
      const res = await fetch(url);
      if (res.ok) {
        const games = await res.json();
        for (const g of games) {
          const away = findCBBTeam(cbbMap, g.away_team);
          const home = findCBBTeam(cbbMap, g.home_team);
          if (away && home) {
            const gk = `${normalize(away)}_${normalize(home)}`;
            validCBB.add(gk);
            if (g.commence_time && !commenceTimes[`CBB:${gk}`]) commenceTimes[`CBB:${gk}`] = g.commence_time;
          }
        }
        const remaining = res.headers.get('x-requests-remaining');
        console.log(`📋 Today's CBB (Odds API): ${validCBB.size} games [credits left: ${remaining}]`);
      } else {
        console.warn(`Odds API error: ${res.status}`);
      }
    } catch (e) {
      console.warn('Could not load CBB schedule from Odds API:', e.message);
    }
  } else {
    console.warn('⚠️  No ODDS_API_KEY — CBB schedule will be empty');
  }

  // NHL: use Odds API (like CBB/MLB/NBA) for reliable schedule + commence times
  if (ODDS_API_KEY) {
    try {
      const url = `https://api.the-odds-api.com/v4/sports/icehockey_nhl/odds/?apiKey=${ODDS_API_KEY}&regions=us&markets=h2h&oddsFormat=american&bookmakers=fanduel`;
      const res = await fetch(url);
      if (res.ok) {
        const games = await res.json();
        for (const g of games) {
          const away = resolveNHLTeam(g.away_team);
          const home = resolveNHLTeam(g.home_team);
          if (away && home) {
            const gk = `${normalize(away)}_${normalize(home)}`;
            validNHL.add(gk);
            if (g.commence_time && !commenceTimes[`NHL:${gk}`]) commenceTimes[`NHL:${gk}`] = g.commence_time;
          }
        }
        const remaining = res.headers.get('x-requests-remaining');
        console.log(`📋 Today's NHL (Odds API): ${validNHL.size} games [credits left: ${remaining}]`);
      } else {
        console.warn(`Odds API NHL error: ${res.status}`);
      }
    } catch (e) {
      console.warn('Could not load NHL schedule from Odds API:', e.message);
    }
  }

  // NHL fallback: OddsTrader markdown (no commence times, but better than nothing)
  if (validNHL.size === 0) {
    try {
      const nhlPath = join(ROOT, 'public', 'odds_money.md');
      const nhlMd = readFileSync(nhlPath, 'utf8');
      const nhlGames = parseOddsTrader(nhlMd);
      for (const g of nhlGames) {
        if (g.awayTeam && g.homeTeam) {
          validNHL.add(`${normalize(g.awayTeam)}_${normalize(g.homeTeam)}`);
        }
      }
      console.log(`📋 Today's NHL (OddsTrader fallback): ${validNHL.size} games`);
    } catch (e) {
      console.warn('Could not load NHL schedule:', e.message);
    }
  }

  // MLB: use Odds API
  if (ODDS_API_KEY) {
    try {
      const url = `https://api.the-odds-api.com/v4/sports/baseball_mlb/odds/?apiKey=${ODDS_API_KEY}&regions=us&markets=h2h&oddsFormat=american&bookmakers=fanduel`;
      const res = await fetch(url);
      if (res.ok) {
        const games = await res.json();
        for (const g of games) {
          const away = resolveMLBTeam(g.away_team);
          const home = resolveMLBTeam(g.home_team);
          if (away && home) {
            const gk = `${normalize(away)}_${normalize(home)}`;
            validMLB.add(gk);
            if (g.commence_time && !commenceTimes[`MLB:${gk}`]) commenceTimes[`MLB:${gk}`] = g.commence_time;
          }
        }
        const remaining = res.headers.get('x-requests-remaining');
        console.log(`📋 Today's MLB (Odds API): ${validMLB.size} games [credits left: ${remaining}]`);
      } else {
        console.warn(`Odds API MLB error: ${res.status}`);
      }
    } catch (e) {
      console.warn('Could not load MLB schedule from Odds API:', e.message);
    }
  }

  // NBA: use Odds API
  const validNBA = new Set();
  if (ODDS_API_KEY) {
    try {
      const url = `https://api.the-odds-api.com/v4/sports/basketball_nba/odds/?apiKey=${ODDS_API_KEY}&regions=us&markets=h2h&oddsFormat=american&bookmakers=fanduel`;
      const res = await fetch(url);
      if (res.ok) {
        const games = await res.json();
        for (const g of games) {
          const away = resolveNBATeam(g.away_team);
          const home = resolveNBATeam(g.home_team);
          if (away && home) {
            const gk = `${normalize(away)}_${normalize(home)}`;
            validNBA.add(gk);
            if (g.commence_time && !commenceTimes[`NBA:${gk}`]) commenceTimes[`NBA:${gk}`] = g.commence_time;
          }
        }
        const remaining = res.headers.get('x-requests-remaining');
        console.log(`📋 Today's NBA (Odds API): ${validNBA.size} games [credits left: ${remaining}]`);
      } else {
        console.warn(`Odds API NBA error: ${res.status}`);
      }
    } catch (e) {
      console.warn('Could not load NBA schedule from Odds API:', e.message);
    }
  }

  return { validCBB, validNHL, validMLB, validNBA, commenceTimes };
}

// ─── Main ─────────────────────────────────────────────────────────────────
async function run() {
  const out = { CBB: {}, NHL: {}, MLB: {}, NBA: {}, updatedAt: new Date().toISOString() };
  const cbbMap = loadCBBTeamMap();
  const { validCBB, validNHL, validMLB, validNBA, commenceTimes } = await loadTodaysSchedule(cbbMap);

  const tags = [
    { slug: 'sports', sport: null },
    { slug: 'ncaa', sport: 'CBB' },
    { slug: 'college-basketball', sport: 'CBB' },
    { slug: 'march-madness', sport: 'CBB' },
    { slug: 'basketball', sport: null },
    { slug: 'cbb', sport: 'CBB' },
    { slug: 'nhl', sport: 'NHL' },
    { slug: 'mlb', sport: 'MLB' },
    { slug: 'baseball', sport: 'MLB' },
    { slug: 'nba', sport: 'NBA' },
  ];

  const seenDates = new Map();  // key -> ET date string of accepted Poly event
  const events = [];

  function toETDate(iso) {
    if (!iso) return null;
    return new Date(iso).toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
  }

  for (const { slug, sport } of tags) {
    try {
      const list = await listEvents(slug, 300);
      console.log(`  📡 ${slug}: ${list.length} events`);
      for (const ev of list) {
        events.push({ ...ev, _tag: slug, _sport: sport || slug });
      }
    } catch (e) {
      console.warn(`Failed to fetch ${slug}:`, e.message);
    }
  }

  // Dedupe by event id
  const byId = new Map();
  for (const ev of events) {
    const id = ev.id ?? ev.slug;
    if (!byId.has(id)) byId.set(id, ev);
  }

  const nowMs = Date.now();
  const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

  for (const ev of byId.values()) {
    const id = ev.id ?? ev.slug;
    const title = ev.title || ev.question || '';
    const teams = extractTeamsFromTitle(title);
    if (!teams) continue;

    // Reject stale events (eventDate > 2 days in the past)
    const evDate = ev.eventDate ? new Date(ev.eventDate).getTime() : null;
    if (evDate && evDate < nowMs - TWO_DAYS_MS) continue;

    // Use event's own Polymarket tags for sport detection first
    const evTags = (ev.tags || []).map(t => (t.slug || t || '').toLowerCase());
    const hasNcaaTag = evTags.some(t => /ncaa|college|cbb|cwbb|ncaa-basketball/.test(t));
    const hasNbaTag = evTags.includes('nba');
    const hasNhlTag = evTags.includes('nhl') || evTags.includes('hockey');
    const hasMlbTag = evTags.includes('mlb') || evTags.includes('baseball');

    let sport = ev._sport === 'CBB' ? 'CBB' : ev._sport === 'ncaa' ? 'CBB' : ev._sport === 'nhl' ? 'NHL' : ev._sport === 'MLB' ? 'MLB' : ev._sport === 'mlb' ? 'MLB' : ev._sport === 'baseball' ? 'MLB' : ev._sport === 'nba' ? 'NBA' : ev._sport === 'NBA' ? 'NBA' : null;

    // If tag says ncaa/college, force CBB regardless of _sport from tag_slug
    if (!sport && hasNcaaTag && !hasNbaTag) sport = 'CBB';

    if (!sport) {
      const t = title.toLowerCase();
      if (/ncaa|college|basketball/.test(t) && !/nba|champion|winner|tournament winner/.test(t)) sport = 'CBB';
      else if (/nba/.test(t) && !/champion|winner|mvp|award/.test(t)) sport = 'NBA';
      else if (/nhl|hockey/.test(t) && !/champion|winner|stanley/.test(t)) sport = 'NHL';
      else if (/mlb|baseball/.test(t) && !/champion|winner|world series winner/.test(t)) sport = 'MLB';
      else if (hasNhlTag && !hasNcaaTag) sport = 'NHL';
      else if (hasMlbTag) sport = 'MLB';
      else if (hasNbaTag) sport = 'NBA';
      else {
        const revTeams = [teams[1], teams[0]];
        const cbbKey = matchToGameKey(teams, cbbMap, 'CBB');
        const cbbRevKey = matchToGameKey(revTeams, cbbMap, 'CBB');
        const nhlKey = matchToGameKey(teams, cbbMap, 'NHL');
        const nhlRevKey = matchToGameKey(revTeams, cbbMap, 'NHL');
        const mlbKey = matchToGameKey(teams, cbbMap, 'MLB');
        const mlbRevKey = matchToGameKey(revTeams, cbbMap, 'MLB');
        const nbaKey = matchToGameKey(teams, cbbMap, 'NBA');
        const nbaRevKey = matchToGameKey(revTeams, cbbMap, 'NBA');
        if ((cbbKey && validCBB.has(cbbKey)) || (cbbRevKey && validCBB.has(cbbRevKey))) sport = 'CBB';
        else if ((nhlKey && validNHL.has(nhlKey)) || (nhlRevKey && validNHL.has(nhlRevKey))) sport = 'NHL';
        else if ((mlbKey && validMLB.has(mlbKey)) || (mlbRevKey && validMLB.has(mlbRevKey))) sport = 'MLB';
        else if ((nbaKey && validNBA.has(nbaKey)) || (nbaRevKey && validNBA.has(nbaRevKey))) sport = 'NBA';
      }
    }
    if (!sport || !['CBB', 'NHL', 'MLB', 'NBA'].includes(sport)) continue;

    const key1 = matchToGameKey(teams, cbbMap, sport);
    const key2 = matchToGameKey([teams[1], teams[0]], cbbMap, sport);
    const validSet = sport === 'CBB' ? validCBB : sport === 'MLB' ? validMLB : sport === 'NBA' ? validNBA : validNHL;
    const keyReversed = !(key1 && validSet.has(key1)) && (key2 && validSet.has(key2));
    const key = keyReversed ? key2 : (key1 && validSet.has(key1)) ? key1 : null;
    if (!key) continue;
    if (keyReversed) teams.reverse();

    // Date-match: use Polymarket eventDate (actual game date, NOT endDate which is series end).
    // Filters wrong-day events and breaks ties when multiple events share the same key.
    const polyGameDate = ev.eventDate || toETDate(ev.startTime);
    const oddsGameDate = toETDate(commenceTimes[`${sport}:${key}`]);

    if (seenDates.has(key)) {
      const prevDate = seenDates.get(key);
      if (prevDate === oddsGameDate) continue;        // already accepted correct-day event
      if (polyGameDate !== oddsGameDate) continue;     // this one is also wrong day
      // This event matches today but the previous didn't — replace it below
    } else if (polyGameDate && oddsGameDate && polyGameDate !== oddsGameDate) {
      continue; // wrong day — skip, wait for correct-day event
    }

    seenDates.set(key, polyGameDate);

    const bucket = out[sport];

    try {
      const live = await getLiveVolume(id);
      const trades = await getAllTrades(id);
      const agg = aggregateTrades(trades, teams[0], teams[1]);

      let priceMove1h = null;
      let priceHistory = null;
      const markets = ev.markets || [];

      // Find the MONEYLINE market — skip O/U and Spread markets
      const mlMarket = markets.find(m => {
        const git = (m.groupItemTitle || '').toLowerCase();
        const q = (m.question || '').toLowerCase();
        if (git.includes('o/u') || git.includes('spread') || git.includes('over') || git.includes('under')) return false;
        if (q.includes('o/u') || q.includes('spread:')) return false;
        let outcomes = m.outcomes;
        if (typeof outcomes === 'string') try { outcomes = JSON.parse(outcomes); } catch { outcomes = []; }
        if (Array.isArray(outcomes) && outcomes.some(o => /^(over|under)$/i.test(o))) return false;
        return true;
      }) || markets[0];

      let tokenIds = mlMarket?.clobTokenIds;
      if (typeof tokenIds === 'string') tokenIds = JSON.parse(tokenIds || '[]').filter(Boolean);
      else if (mlMarket?.tokens) tokenIds = mlMarket.tokens.map(t => t.token_id);
      if (Array.isArray(tokenIds) && tokenIds.length > 0) {
        const hist1h = await getPriceHistory(tokenIds[0], '1h');
        priceMove1h = priceMovePct(hist1h);

        // 24h price history for sparkline (sample ~12 points)
        const hist24h = await getPriceHistory(tokenIds[0], '1d');
        if (hist24h && hist24h.length >= 2) {
          const step = Math.max(1, Math.floor(hist24h.length / 12));
          const sampled = [];
          for (let i = 0; i < hist24h.length; i += step) {
            sampled.push(Number((hist24h[i].p * 100).toFixed(1)));
          }
          const last = Number((hist24h[hist24h.length - 1].p * 100).toFixed(1));
          if (sampled[sampled.length - 1] !== last) sampled.push(last);
          priceHistory = {
            points: sampled,
            open: Number((hist24h[0].p * 100).toFixed(1)),
            current: last,
            high: Number((Math.max(...hist24h.map(h => h.p)) * 100).toFixed(1)),
            low: Number((Math.min(...hist24h.map(h => h.p)) * 100).toFixed(1)),
            change: Number(((last - sampled[0])).toFixed(1)),
          };
        }
      }

      // Whale trades ($500+) with individual trade details
      const whales = await getWhaleTrades(id, 500, 75);
      let whaleData = null;
      if (whales.length > 0) {
        let totalCash = 0, buyCount = 0, sellCount = 0;
        const tradeDetails = [];
        for (const t of whales) {
          const cash = (t.size || 0) * (t.price || 0);
          totalCash += cash;
          if (t.side === 'BUY') buyCount++; else sellCount++;
          tradeDetails.push({
            amount: Math.round(cash),
            side: t.side || 'BUY',
            outcome: t.outcome || null,
            price: t.price ? Number((t.price * 100).toFixed(0)) : null,
            ts: t.timestamp ? Number(t.timestamp) * 1000 : null,
            wallet: t.proxyWallet || null,
            traderName: t.name || t.pseudonym || null,
          });
        }
        tradeDetails.sort((a, b) => b.amount - a.amount);
        whaleData = {
          count: whales.length,
          totalCash: Math.round(totalCash),
          largest: tradeDetails[0]?.amount || 0,
          buyCount,
          sellCount,
          topTrades: tradeDetails.slice(0, 25),
        };
      }

      // Extract market-implied probabilities from outcomePrices
      let marketProbs = null;
      let outcomeNames = null;
      if (mlMarket) {
        let prices = mlMarket.outcomePrices;
        if (typeof prices === 'string') try { prices = JSON.parse(prices); } catch { prices = null; }
        let outcomes = mlMarket.outcomes;
        if (typeof outcomes === 'string') try { outcomes = JSON.parse(outcomes); } catch { outcomes = null; }
        if (Array.isArray(prices) && prices.length >= 2) {
          marketProbs = prices.map(Number);
          outcomeNames = Array.isArray(outcomes) ? outcomes : null;
        }
      }

      // Map probabilities to away/home using team extraction order
      const [awayRaw, homeRaw] = teams;
      let awayProb = null, homeProb = null;
      let token0IsAway = true;
      if (marketProbs && marketProbs.length >= 2) {
        if (outcomeNames && outcomeNames.length >= 2) {
          const n0 = normalize(outcomeNames[0]);
          const nAway = normalize(awayRaw);
          if (n0.includes(nAway) || nAway.includes(n0) || outcomeNames[0].toLowerCase() === 'yes') {
            awayProb = marketProbs[0];
            homeProb = marketProbs[1];
            token0IsAway = true;
          } else {
            awayProb = marketProbs[1];
            homeProb = marketProbs[0];
            token0IsAway = false;
          }
        } else {
          awayProb = marketProbs[0];
          homeProb = marketProbs[1];
        }
      }

      // Flip price history to always represent the AWAY team
      if (!token0IsAway && priceHistory) {
        priceHistory = {
          points: priceHistory.points.map(p => Number((100 - p).toFixed(1))),
          open: Number((100 - priceHistory.open).toFixed(1)),
          current: Number((100 - priceHistory.current).toFixed(1)),
          high: Number((100 - priceHistory.low).toFixed(1)),
          low: Number((100 - priceHistory.high).toFixed(1)),
          change: -priceHistory.change,
        };
        if (priceMove1h != null) priceMove1h = -priceMove1h;
      }

      const vol24 = ev.volume_24hr ?? ev.volume ?? 0;
      bucket[key] = {
        volume24h: Number(vol24),
        liveVolume: live?.total != null ? Number(live.total) : null,
        awayMoneyPct: agg.awayMoneyPct,
        homeMoneyPct: agg.homeMoneyPct,
        awayTicketPct: agg.awayTicketPct,
        homeTicketPct: agg.homeTicketPct,
        tradeCount: agg.ticketCount,
        sampleCash: agg.totalCash,
        priceMove1h,
        priceHistory,
        whales: whaleData,
        awayProb: awayProb != null ? Number((awayProb * 100).toFixed(1)) : null,
        homeProb: homeProb != null ? Number((homeProb * 100).toFixed(1)) : null,
        awayTeam: awayRaw,
        homeTeam: homeRaw,
        eventId: id,
        title: title.substring(0, 80),
        commence: commenceTimes[`${sport}:${key}`] || ev.startTime || null,
        polyGameTime: ev.startTime || null,
        polyGameDate: ev.eventDate || null,
      };
    } catch (e) {
      console.warn(`Failed to enrich ${title}:`, e.message);
    }
  }

  const outPath = join(ROOT, 'public', 'polymarket_data.json');
  writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
  const cbbCount = Object.keys(out.CBB).length;
  const nhlCount = Object.keys(out.NHL).length;
  const mlbCount = Object.keys(out.MLB).length;
  const nbaCount = Object.keys(out.NBA).length;
  console.log(`Wrote ${outPath} — CBB: ${cbbCount}, NHL: ${nhlCount}, MLB: ${mlbCount}, NBA: ${nbaCount}`);
  if (cbbCount === 0 && nhlCount === 0 && mlbCount === 0 && nbaCount === 0) {
    console.log('(No Polymarket markets matched today\'s schedule)');
  }
}

run().catch(e => { console.error(e); process.exit(1); });
