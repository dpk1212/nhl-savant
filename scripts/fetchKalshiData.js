/**
 * Kalshi Data Fetcher — CBB & NHL
 *
 * Fetches game-winner markets, spreads, and totals from Kalshi.
 * Matches to games using basketball_teams.csv (CBB) and NHL team map.
 * ONLY outputs data for games in today's OddsTrader schedule.
 * Outputs JSON to public/kalshi_data.json for UI consumption.
 *
 * Usage: node scripts/fetchKalshiData.js
 */

import * as dotenv from 'dotenv';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parseOddsTrader } from '../src/utils/oddsTraderParser.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
dotenv.config({ path: join(ROOT, '.env') });

const BASE = 'https://api.elections.kalshi.com/trade-api/v2';
const ODDS_API_KEY = process.env.ODDS_API_KEY;

const httpFetch = typeof globalThis.fetch === 'function'
  ? globalThis.fetch
  : (await import('node-fetch')).default;

async function get(path, retries = 3) {
  const url = BASE + path;
  for (let attempt = 0; attempt < retries; attempt++) {
    const res = await httpFetch(url, { headers: { Accept: 'application/json' } });
    if (res.status === 429) {
      const wait = 2000 * (attempt + 1);
      console.warn(`   ⏳ Rate-limited (429), waiting ${wait}ms…`);
      await new Promise(r => setTimeout(r, wait));
      continue;
    }
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    return res.json();
  }
  throw new Error(`429 after ${retries} retries: ${url}`);
}

// ─── Fetch all open events for a series (with pagination) ─────────────────
async function fetchEvents(seriesTicker, maxPages = 5) {
  const all = [];
  let cursor = '';
  for (let page = 0; page < maxPages; page++) {
    const params = new URLSearchParams({
      with_nested_markets: 'true',
      status: 'open',
      limit: '200',
      series_ticker: seriesTicker,
    });
    if (cursor) params.set('cursor', cursor);
    try {
      const data = await get(`/events?${params}`);
      const events = data.events || [];
      all.push(...events);
      cursor = data.cursor || '';
      if (!cursor || events.length === 0) break;
    } catch (err) {
      console.warn(`   ⚠️ fetchEvents error for ${seriesTicker}: ${err.message}`);
      break;
    }
  }
  return all;
}

// ─── Fetch recent trades for a market ticker ──────────────────────────────
async function fetchAllTrades(marketTicker) {
  const all = [];
  let cursor = '';
  while (true) {
    try {
      let url = `/markets/trades?ticker=${marketTicker}&limit=200`;
      if (cursor) url += `&cursor=${cursor}`;
      const data = await get(url);
      const batch = data.trades || [];
      if (batch.length === 0) break;
      all.push(...batch);
      cursor = data.cursor || '';
      if (!cursor || batch.length < 200) break;
    } catch (err) {
      console.warn(`   ⚠️ fetchAllTrades error for ${marketTicker}: ${err.message}`);
      break;
    }
  }
  return all;
}

// ─── Fetch candlestick price history for trend line ──────────────────────
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function fetchCandlesticks(seriesTicker, marketTicker) {
  const now = Math.floor(Date.now() / 1000);
  const oneDayAgo = now - 86400;
  const url = `/series/${seriesTicker}/markets/${marketTicker}/candlesticks?start_ts=${oneDayAgo}&end_ts=${now}&period_interval=60`;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const data = await get(url);
      return data.candlesticks || [];
    } catch (e) {
      if (String(e).includes('429') && attempt < 2) {
        await sleep(1000 * (attempt + 1));
        continue;
      }
      return [];
    }
  }
  return [];
}

function buildPriceHistory(candles) {
  if (!candles || candles.length < 2) return null;
  const prices = candles.map(c => {
    const close = parseFloat(c.price?.close_dollars || '0');
    return Number((close * 100).toFixed(1));
  });
  const step = Math.max(1, Math.floor(prices.length / 12));
  const sampled = [];
  for (let i = 0; i < prices.length; i += step) {
    sampled.push(prices[i]);
  }
  const last = prices[prices.length - 1];
  if (sampled[sampled.length - 1] !== last) sampled.push(last);
  const allPrices = prices.filter(p => p > 0);
  if (allPrices.length < 2) return null;
  if (prices[0] === 0 && last === 0) return null;
  return {
    points: sampled,
    open: prices[0],
    current: last,
    high: Number(Math.max(...allPrices).toFixed(1)),
    low: Number(Math.min(...allPrices).toFixed(1)),
    change: Number((last - prices[0]).toFixed(1)),
  };
}

// ─── Normalization ────────────────────────────────────────────────────────
function normalize(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

// ─── CBB Team Map (same logic as Polymarket fetcher) ─────────────────────
function loadCBBTeamMap() {
  const csvPath = join(ROOT, 'public', 'basketball_teams.csv');
  let csv;
  try { csv = readFileSync(csvPath, 'utf8'); } catch { return new Map(); }
  const lines = csv.split('\n').filter(Boolean);
  const headers = lines[0].toLowerCase().split(',');
  const map = new Map();
  for (let i = 1; i < lines.length; i++) {
    const vals = parseCSVLine(lines[i]);
    const row = {};
    headers.forEach((h, j) => { row[h.trim()] = vals[j]?.trim() || ''; });
    const oddstrader = row.oddstrader_name || row.normalized_name || '';
    if (!oddstrader) continue;
    const names = [
      oddstrader, row.normalized_name, row.haslametrics_name,
      row.dratings_name, row.ncaa_name, row.espn_name,
      row.barttorvik_name, row.odds_api_name, row.cbbd_name,
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

// ─── NHL Team Map ────────────────────────────────────────────────────────
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
  'New York': 'NYR',
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
  kings: 'LAK', losangeles: 'LAK', la: 'LAK',
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
  for (const w of raw.split(/\s+/)) {
    const wn = normalize(w);
    if (NHL_MAP[wn]) return NHL_MAP[wn];
  }
  return null;
}

// ─── NBA Team Map ─────────────────────────────────────────────────────────
const NBA_NAME_TO_CODE = {
  'Atlanta': 'ATL', 'Boston': 'BOS', 'Brooklyn': 'BKN', 'Charlotte': 'CHA',
  'Chicago': 'CHI', 'Cleveland': 'CLE', 'Dallas': 'DAL', 'Denver': 'DEN',
  'Detroit': 'DET', 'Golden State': 'GSW', 'Houston': 'HOU', 'Indiana': 'IND',
  'Los Angeles Clippers': 'LAC', 'Los Angeles Lakers': 'LAL', 'LA Clippers': 'LAC',
  'LA Lakers': 'LAL', 'Los Angeles L': 'LAL', 'Los Angeles C': 'LAC',
  'Memphis': 'MEM', 'Miami': 'MIA', 'Milwaukee': 'MIL',
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
  for (const w of raw.split(/\s+/)) {
    const wn = normalize(w);
    if (NBA_MAP[wn]) return NBA_MAP[wn];
  }
  return null;
}

// ─── Extract teams from Kalshi event title ("TeamA at TeamB") ────────────
function extractTeamsFromTitle(title) {
  const t = (title || '').trim()
    .replace(/:\s*(Spread|Total Points|First Half Spread)$/i, '')
    .replace(/^(SEC|ACC|Big\s*(?:Ten|10|12|East)|AAC|Atlantic\s*10|Ivy\s*League|American|Sun\s*Belt|Mountain\s*West|WCC|Patriot|Missouri\s*Valley|Big\s*Sky|Southern|SWAC|CAA|MEAC|NEC|Ohio\s*Valley|Horizon|Big\s*South|MAC|Summit|Big\s*West|WAC|Atlantic\s*Sun|Conference\s*USA)\s*(?:Championship|Tournament|Conf\.?\s*Tournament)\s*:\s*/i, '');
  const patterns = [
    /^(.+?)\s+at\s+(.+?)$/i,
    /^(.+?)\s+vs\.?\s+(.+?)$/i,
    /^(.+?)\s+@\s+(.+?)$/i,
  ];
  for (const p of patterns) {
    const m = t.match(p);
    if (m) {
      const a = m[1].trim();
      const b = m[2].trim();
      if (a.length >= 2 && b.length >= 2) return [a, b];
    }
  }
  return null;
}

function findCBBTeam(cbbMap, str) {
  const n = normalize(str);
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
  if (sport === 'NBA') {
    const aCode = resolveNBATeam(a);
    const bCode = resolveNBATeam(b);
    if (!aCode || !bCode) return null;
    return `${normalize(aCode)}_${normalize(bCode)}`;
  }
  return null;
}

// ─── Load today's schedule ───────────────────────────────────────────────
async function loadTodaysSchedule(cbbMap) {
  const validCBB = new Set();
  const validNHL = new Set();

  // CBB: use Odds API (reliable, structured) instead of scraping OddsTrader markdown
  if (ODDS_API_KEY) {
    try {
      const url = `https://api.the-odds-api.com/v4/sports/basketball_ncaab/odds/?apiKey=${ODDS_API_KEY}&regions=us&markets=spreads&oddsFormat=american&bookmakers=fanduel`;
      const res = await httpFetch(url);
      if (res.ok) {
        const games = await res.json();
        for (const g of games) {
          const away = findCBBTeam(cbbMap, g.away_team);
          const home = findCBBTeam(cbbMap, g.home_team);
          if (away && home) {
            validCBB.add(`${normalize(away)}_${normalize(home)}`);
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

  try {
    const nhlPath = join(ROOT, 'public', 'odds_money.md');
    const nhlMd = readFileSync(nhlPath, 'utf8');
    const nhlGames = parseOddsTrader(nhlMd);
    for (const g of nhlGames) {
      if (g.awayTeam && g.homeTeam) {
        validNHL.add(`${normalize(g.awayTeam)}_${normalize(g.homeTeam)}`);
      }
    }
    console.log(`📋 Today's NHL: ${nhlGames.length} games`);
  } catch (e) {
    console.warn('Could not load NHL schedule:', e.message);
  }
  // NBA: use Odds API
  const validNBA = new Set();
  if (ODDS_API_KEY) {
    try {
      const url = `https://api.the-odds-api.com/v4/sports/basketball_nba/odds/?apiKey=${ODDS_API_KEY}&regions=us&markets=h2h&oddsFormat=american&bookmakers=fanduel`;
      const res = await httpFetch(url);
      if (res.ok) {
        const games = await res.json();
        for (const g of games) {
          const away = resolveNBATeam(g.away_team);
          const home = resolveNBATeam(g.home_team);
          if (away && home) {
            validNBA.add(`${normalize(away)}_${normalize(home)}`);
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

  return { validCBB, validNHL, validNBA };
}

// ─── Extract win probabilities from Kalshi markets ──────────────────────
function extractGameProbs(markets, awayRaw, homeRaw) {
  if (!markets || markets.length < 2) return null;

  let awayMarket = null;
  let homeMarket = null;
  const nAway = normalize(awayRaw);
  const nHome = normalize(homeRaw);

  for (const m of markets) {
    const sub = normalize(m.yes_sub_title || '');
    // Use ticker SUFFIX (after last hyphen) for deterministic matching
    const rawTicker = m.ticker || '';
    const tickerSuffix = normalize(rawTicker.split('-').pop() || '');

    if (sub.includes(nAway) || (tickerSuffix && nAway.startsWith(tickerSuffix.slice(0, 3)))) {
      awayMarket = m;
    } else if (sub.includes(nHome) || (tickerSuffix && nHome.startsWith(tickerSuffix.slice(0, 3)))) {
      homeMarket = m;
    }
  }

  if (!awayMarket || !homeMarket) {
    // Fallback: assign whichever is unmatched
    if (awayMarket && !homeMarket) {
      homeMarket = markets.find(m => m !== awayMarket) || markets[1];
    } else if (homeMarket && !awayMarket) {
      awayMarket = markets.find(m => m !== homeMarket) || markets[0];
    } else {
      awayMarket = markets[0];
      homeMarket = markets[1];
    }
  }

  const parsePrice = (p) => {
    const v = parseFloat(p || '0');
    return isNaN(v) ? 0 : v;
  };

  const awayBid = parsePrice(awayMarket.yes_bid_dollars);
  const awayAsk = parsePrice(awayMarket.yes_ask_dollars);
  const awayLast = parsePrice(awayMarket.last_price_dollars);
  const awayPrev = parsePrice(awayMarket.previous_price_dollars);
  const awayVol = parseFloat(awayMarket.volume_24h_fp || '0');

  const homeBid = parsePrice(homeMarket.yes_bid_dollars);
  const homeAsk = parsePrice(homeMarket.yes_ask_dollars);
  const homeLast = parsePrice(homeMarket.last_price_dollars);
  const homePrev = parsePrice(homeMarket.previous_price_dollars);
  const homeVol = parseFloat(homeMarket.volume_24h_fp || '0');

  const awayMid = awayBid > 0 && awayAsk > 0
    ? (awayBid + awayAsk) / 2
    : awayLast || awayBid || awayAsk;
  const homeMid = homeBid > 0 && homeAsk > 0
    ? (homeBid + homeAsk) / 2
    : homeLast || homeBid || homeAsk;

  const awayProb = Number((awayMid * 100).toFixed(1));
  const homeProb = Number((homeMid * 100).toFixed(1));

  const awayPriceMove = awayPrev > 0
    ? Number(((awayLast - awayPrev) * 100).toFixed(1))
    : null;

  return {
    awayProb, homeProb,
    awayBid: Number((awayBid * 100).toFixed(1)),
    awayAsk: Number((awayAsk * 100).toFixed(1)),
    homeBid: Number((homeBid * 100).toFixed(1)),
    homeAsk: Number((homeAsk * 100).toFixed(1)),
    awayLast: Number((awayLast * 100).toFixed(1)),
    homeLast: Number((homeLast * 100).toFixed(1)),
    volume24h: Math.round(awayVol + homeVol),
    priceMove24h: awayPriceMove,
    awayTeamLabel: awayMarket.yes_sub_title || awayRaw,
    homeTeamLabel: homeMarket.yes_sub_title || homeRaw,
    awayTicker: awayMarket.ticker,
    homeTicker: homeMarket.ticker,
  };
}

// ─── Extract spread data from Kalshi spread markets ──────────────────────
function extractSpreadData(markets) {
  if (!markets || markets.length === 0) return null;
  const spreads = [];
  for (const m of markets) {
    const sub = m.yes_sub_title || '';
    const bid = parseFloat(m.yes_bid_dollars || '0');
    const ask = parseFloat(m.yes_ask_dollars || '0');
    const last = parseFloat(m.last_price_dollars || '0');
    const vol = parseFloat(m.volume_24h_fp || '0');
    const mid = bid > 0 && ask > 0 ? (bid + ask) / 2 : last || bid || ask;
    spreads.push({
      label: sub,
      prob: Number((mid * 100).toFixed(1)),
      volume: Math.round(vol),
    });
  }
  spreads.sort((a, b) => b.prob - a.prob);
  return spreads.slice(0, 4);
}

// ─── Extract total data from Kalshi total markets ────────────────────────
function extractTotalData(markets) {
  if (!markets || markets.length === 0) return null;
  const totals = [];
  for (const m of markets) {
    const sub = m.yes_sub_title || '';
    const bid = parseFloat(m.yes_bid_dollars || '0');
    const ask = parseFloat(m.yes_ask_dollars || '0');
    const last = parseFloat(m.last_price_dollars || '0');
    const vol = parseFloat(m.volume_24h_fp || '0');
    const mid = bid > 0 && ask > 0 ? (bid + ask) / 2 : last || bid || ask;
    totals.push({
      label: sub,
      prob: Number((mid * 100).toFixed(1)),
      volume: Math.round(vol),
    });
  }
  totals.sort((a, b) => b.prob - a.prob);
  return totals.slice(0, 4);
}

// ─── Main ────────────────────────────────────────────────────────────────
async function run() {
  const out = { CBB: {}, NHL: {}, NBA: {}, MLB: {}, updatedAt: new Date().toISOString() };
  const cbbMap = loadCBBTeamMap();
  const { validCBB, validNHL, validNBA } = await loadTodaysSchedule(cbbMap);

  // Series to fetch for game-level data
  const seriesConfig = [
    { ticker: 'KXNCAAMBGAME', sport: 'CBB', type: 'game' },
    { ticker: 'KXNCAAMBSEC', sport: 'CBB', type: 'game' },
    { ticker: 'KXNCAAMBACC', sport: 'CBB', type: 'game' },
    { ticker: 'KXNCAAMBBIG10', sport: 'CBB', type: 'game' },
    { ticker: 'KXNCAAMBBIG12', sport: 'CBB', type: 'game' },
    { ticker: 'KXNCAAMBBIGEAST', sport: 'CBB', type: 'game' },
    { ticker: 'KXNCAAMBA10', sport: 'CBB', type: 'game' },
    { ticker: 'KXNCAAMBIVY', sport: 'CBB', type: 'game' },
    { ticker: 'KXNCAAMBAMER', sport: 'CBB', type: 'game' },
    { ticker: 'KXNCAAMBSBELT', sport: 'CBB', type: 'game' },
    { ticker: 'KXNCAAMBWCC', sport: 'CBB', type: 'game' },
    { ticker: 'KXNCAAMBMW', sport: 'CBB', type: 'game' },
    { ticker: 'KXNCAAMBPAT', sport: 'CBB', type: 'game' },
    { ticker: 'KXNCAAMBMVAL', sport: 'CBB', type: 'game' },
    { ticker: 'KXNCAAMBBSKY', sport: 'CBB', type: 'game' },
    { ticker: 'KXNCAAMBSOCON', sport: 'CBB', type: 'game' },
    { ticker: 'KXNCAAMBSWAC', sport: 'CBB', type: 'game' },
    { ticker: 'KXNCAAMBCAA', sport: 'CBB', type: 'game' },
    { ticker: 'KXNCAAMBMEAC', sport: 'CBB', type: 'game' },
    { ticker: 'KXNCAAMBAE', sport: 'CBB', type: 'game' },
    { ticker: 'KXNCAAMBNEC', sport: 'CBB', type: 'game' },
    { ticker: 'KXNCAAMBOV', sport: 'CBB', type: 'game' },
    { ticker: 'KXNCAAMBHOR', sport: 'CBB', type: 'game' },
    { ticker: 'KXNCAAMBHL', sport: 'CBB', type: 'game' },
    { ticker: 'KXNCAAMBSLC', sport: 'CBB', type: 'game' },
    { ticker: 'KXNCAAMBSUM', sport: 'CBB', type: 'game' },
    { ticker: 'KXNCAAMBBWEST', sport: 'CBB', type: 'game' },
    { ticker: 'KXNCAAMBWAC', sport: 'CBB', type: 'game' },
    { ticker: 'KXNCAAMBASUN', sport: 'CBB', type: 'game' },
    { ticker: 'KXNCAAMBBSOU', sport: 'CBB', type: 'game' },
    { ticker: 'KXNCAAMBMAMER', sport: 'CBB', type: 'game' },
    { ticker: 'KXNCAAMBMAA', sport: 'CBB', type: 'game' },
    { ticker: 'KXNCAAMBUSA', sport: 'CBB', type: 'game' },
    { ticker: 'KXNCAAMBSPREAD', sport: 'CBB', type: 'spread' },
    { ticker: 'KXNHLGAME', sport: 'NHL', type: 'game' },
    { ticker: 'KXNHLSPREAD', sport: 'NHL', type: 'spread' },
    { ticker: 'KXNHLTOTAL', sport: 'NHL', type: 'total' },
    { ticker: 'KXNBAGAME', sport: 'NBA', type: 'game' },
    { ticker: 'KXNBASPREAD', sport: 'NBA', type: 'spread' },
    { ticker: 'KXNBATOTAL', sport: 'NBA', type: 'total' },
  ];

  const eventsByKey = { CBB: {}, NHL: {}, NBA: {} };

  let prevSport = '';
  for (let si = 0; si < seriesConfig.length; si++) {
    const { ticker, sport, type } = seriesConfig[si];
    if (si > 0 && sport !== prevSport) {
      console.log(`\n⏸️  Switching to ${sport} — pausing to avoid rate limits…`);
      await sleep(3000);
    } else if (si > 0) {
      await sleep(300);
    }
    prevSport = sport;
    console.log(`📡 Fetching ${ticker}...`);
    const events = await fetchEvents(ticker);
    console.log(`   ${events.length} events found`);

    for (const ev of events) {
      const title = ev.title || '';
      const teams = extractTeamsFromTitle(title);
      if (!teams) continue;

      const key = matchToGameKey(teams, cbbMap, sport);
      if (!key) continue;

      const validSet = sport === 'CBB' ? validCBB : sport === 'NBA' ? validNBA : validNHL;
      if (!validSet.has(key)) continue;

      if (!eventsByKey[sport][key]) {
        eventsByKey[sport][key] = {
          awayRaw: teams[0],
          homeRaw: teams[1],
          gameEvent: null,
          spreadEvent: null,
          totalEvent: null,
        };
      }

      const entry = eventsByKey[sport][key];
      if (type === 'game') entry.gameEvent = ev;
      else if (type === 'spread') entry.spreadEvent = ev;
      else if (type === 'total') entry.totalEvent = ev;
    }
  }

  // Build output for each matched game
  for (const sport of ['CBB', 'NHL', 'NBA']) {
    for (const [key, entry] of Object.entries(eventsByKey[sport])) {
      const { awayRaw, homeRaw, gameEvent, spreadEvent, totalEvent } = entry;

      const gameProbs = gameEvent
        ? extractGameProbs(gameEvent.markets, awayRaw, homeRaw)
        : null;

      const spreadData = spreadEvent
        ? extractSpreadData(spreadEvent.markets)
        : null;

      const totalData = totalEvent
        ? extractTotalData(totalEvent.markets)
        : null;

      // Fetch ALL trades for both away and home tickers → per-team flow + whales
      let tradeFlow = null;
      let kalshiWhales = null;
      const WHALE_MIN = 100;
      let awayTickets = 0, homeTickets = 0;
      let awayCash = 0, homeCash = 0;
      const bigTrades = [];

      const processTrades = (trades, yeaTeam, nayTeam) => {
        for (const t of trades) {
          const count = parseFloat(t.count_fp || '0');
          const yesPrice = parseFloat(t.yes_price_dollars || '0');
          const noPrice = parseFloat(t.no_price_dollars || '0');
          const isYes = t.taker_side === 'yes';
          const cash = isYes ? count * yesPrice : count * noPrice;
          const team = isYes ? yeaTeam : nayTeam;

          if (team === 'away') { awayTickets++; awayCash += cash; }
          else { homeTickets++; homeCash += cash; }

          if (cash >= WHALE_MIN) {
            bigTrades.push({
              amount: Math.round(cash),
              side: 'BUY',
              outcome: team === 'away' ? awayRaw : homeRaw,
              price: Math.round((isYes ? yesPrice : noPrice) * 100),
              ts: t.created_time ? new Date(t.created_time).getTime() : null,
            });
          }
        }
      };

      // Game-winner (moneyline) tickers
      if (gameProbs?.awayTicker || gameProbs?.homeTicker) {
        if (gameProbs.awayTicker) {
          await sleep(150);
          const trades = await fetchAllTrades(gameProbs.awayTicker);
          console.log(`   🎯 ML trades (${awayRaw}): ${trades.length} from ${gameProbs.awayTicker}`);
          processTrades(trades, 'away', 'home');
        }
        if (gameProbs.homeTicker) {
          await sleep(150);
          const trades = await fetchAllTrades(gameProbs.homeTicker);
          console.log(`   🎯 ML trades (${homeRaw}): ${trades.length} from ${gameProbs.homeTicker}`);
          processTrades(trades, 'home', 'away');
        }
      }
      // Also fetch spread market trades (always, for additional flow data)
      if (spreadEvent?.markets?.length > 0) {
        const nAway = normalize(awayRaw);
        const nHome = normalize(homeRaw);
        for (const m of spreadEvent.markets) {
          const sub = normalize(m.yes_sub_title || '');
          const favorsAway = sub.includes(nAway) || (nAway.length > 3 && sub.includes(nAway.slice(0, 4)));
          const favorsHome = sub.includes(nHome) || (nHome.length > 3 && sub.includes(nHome.slice(0, 4)));
          const yeaTeam = favorsAway ? 'away' : favorsHome ? 'home' : null;
          if (!yeaTeam || !m.ticker) continue;
          const nayTeam = yeaTeam === 'away' ? 'home' : 'away';
          await sleep(150);
          const trades = await fetchAllTrades(m.ticker);
          if (trades.length > 0) {
            console.log(`   📊 Spread trades: ${m.yes_sub_title} → ${trades.length} trades`);
          }
          processTrades(trades, yeaTeam, nayTeam);
        }
      }

      const totalTickets = awayTickets + homeTickets;
      const totalCash = awayCash + homeCash;
      if (totalTickets > 0) {
        tradeFlow = {
          awayTicketPct: Number((awayTickets / totalTickets * 100).toFixed(1)),
          homeTicketPct: Number((homeTickets / totalTickets * 100).toFixed(1)),
          awayMoneyPct: totalCash > 0 ? Number((awayCash / totalCash * 100).toFixed(1)) : 0,
          homeMoneyPct: totalCash > 0 ? Number((homeCash / totalCash * 100).toFixed(1)) : 0,
          tradeCount: totalTickets,
          sampleCash: Math.round(totalCash),
        };
      }

      if (bigTrades.length > 0) {
        bigTrades.sort((a, b) => b.amount - a.amount);
        const whaleCash = bigTrades.reduce((s, t) => s + t.amount, 0);
        kalshiWhales = {
          count: bigTrades.length,
          totalCash: whaleCash,
          largest: bigTrades[0].amount,
          topTrades: bigTrades.slice(0, 10),
        };
      }

      // Fetch candlestick price history for trend line
      let priceHistory = null;
      if (gameProbs?.awayTicker && gameEvent?.series_ticker) {
        await sleep(200);
        const candles = await fetchCandlesticks(gameEvent.series_ticker, gameProbs.awayTicker);
        priceHistory = buildPriceHistory(candles);
      }
      if (!priceHistory && spreadEvent?.series_ticker && spreadEvent?.markets?.length > 0) {
        await sleep(200);
        const spreadTicker = spreadEvent.markets[0].ticker;
        const candles = await fetchCandlesticks(spreadEvent.series_ticker, spreadTicker);
        priceHistory = buildPriceHistory(candles);
      }

      const totalVolume = (gameProbs?.volume24h || 0)
        + (spreadData ? spreadData.reduce((s, d) => s + d.volume, 0) : 0)
        + (totalData ? totalData.reduce((s, d) => s + d.volume, 0) : 0);

      out[sport][key] = {
        awayProb: gameProbs?.awayProb ?? null,
        homeProb: gameProbs?.homeProb ?? null,
        awayBid: gameProbs?.awayBid ?? null,
        awayAsk: gameProbs?.awayAsk ?? null,
        homeBid: gameProbs?.homeBid ?? null,
        homeAsk: gameProbs?.homeAsk ?? null,
        awayLast: gameProbs?.awayLast ?? null,
        homeLast: gameProbs?.homeLast ?? null,
        priceMove24h: gameProbs?.priceMove24h ?? null,
        priceHistory,
        volume24h: totalVolume,
        tradeFlow,
        whales: kalshiWhales,
        spreads: spreadData,
        totals: totalData,
        awayTeam: awayRaw,
        homeTeam: homeRaw,
        eventTicker: gameEvent?.event_ticker || spreadEvent?.event_ticker || null,
        title: (gameEvent?.title || spreadEvent?.title || '').substring(0, 80),
      };
    }
  }

  const outPath = join(ROOT, 'public', 'kalshi_data.json');
  writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
  const cbbCount = Object.keys(out.CBB).length;
  const nhlCount = Object.keys(out.NHL).length;
  const nbaCount = Object.keys(out.NBA).length;
  const mlbCount = Object.keys(out.MLB).length;
  console.log(`\n✅ Wrote ${outPath} — CBB: ${cbbCount}, NHL: ${nhlCount}, NBA: ${nbaCount}, MLB: ${mlbCount}`);
  if (cbbCount === 0 && nhlCount === 0 && nbaCount === 0 && mlbCount === 0) {
    console.log('(No Kalshi markets matched today\'s schedule)');
  }
}

run().catch(e => { console.error(e); process.exit(1); });
