/**
 * Sharp Odds Snapshot — captures fair-value + retail book prices every
 * ~4 minutes for all active sports. Piggybacked on the fetch-polymarket
 * workflow.
 *
 * Fair book = most reputable quote available per game (not Pinnacle-only):
 *   pinnacle → circa → bookmaker → lowvig → betonlineag
 * Prices still land in opener/current/history so CLV/lock/close plumbing
 * stays compatible. Each game stamps `fairBook` with the source key.
 *
 * When PINNAPI_KEY is set, enriches matched games with true Pinnacle prices
 * + max stake (max / maxMoneyLine / maxSpread / maxTotal) from pinnapi.com.
 * Missing key or rate limits are non-fatal — Odds API path continues alone.
 *
 * Usage: node scripts/snapshotPinnacle.js
 */

import * as dotenv from 'dotenv';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { resolveSOCTeam } from './lib/soccerTeams.js';
import { makeUFCGameKey } from './lib/ufcFighters.js';
import { makeWNBAGameKey } from './lib/wnbaTeams.js';
import { makeNFLGameKey } from './lib/nflTeams.js';
import { fetchPinnapiIndex, fetchRecentDrops, normalizeDrop, PINNAPI_SPORT_ID } from './lib/pinnapi.js';
import { pickMainSpreadFromBoard, pickMainTotalFromBoard, linesClose } from '../src/lib/pinnacleMain.js';

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
  { key: 'basketball_nba', label: 'NBA' },
  // World Cup 2026 — h2h is 3-way (home/draw/away). We store the Draw price
  // too so soccer flows through the same pipeline as 2-way sports (a draw is
  // a first-class pickable side).
  { key: 'soccer_fifa_world_cup', label: 'SOC' },
  // UFC fight cards — h2h only (no spreads/totals on Odds API for MMA).
  { key: 'mma_mixed_martial_arts', label: 'UFC', markets: 'h2h' },
  // WNBA — full NBA-style markets (ML + spreads + totals).
  { key: 'basketball_wnba', label: 'WNBA', markets: 'h2h,spreads,totals' },
  // NFL — preseason + regular season (ML + spreads + totals).
  { key: 'americanfootball_nfl_preseason', label: 'NFL', markets: 'h2h,spreads,totals' },
  { key: 'americanfootball_nfl', label: 'NFL', markets: 'h2h,spreads,totals' },
];

// Reputation order for fair line (highest → lowest). First with both sides wins.
const FAIR_BOOKS = ['pinnacle', 'circa', 'bookmaker', 'lowvig', 'betonlineag'];
const RETAIL_BOOKS = ['draftkings', 'fanduel', 'betmgm', 'caesars'];
const BOOKMAKERS = [...FAIR_BOOKS, ...RETAIL_BOOKS].join(',');
const ODDS_REGIONS = 'us,uk,eu';
// Tape retention: NFL openers sit for days — keep a full week of odds + max.
// ~4 min cadence → ~2520 pts/week; hard cap is a safety valve only.
const HISTORY_KEEP_HOURS = 168; // 7 days
const MAX_HISTORY = 8000; // multi-line totals/spreads ≈ 3–6 prints/cycle
const STALE_HOURS = 36;
const COMPLETED_HOURS = 6;
const OUT_PATH = join(ROOT, 'public', 'pinnacle_history.json');
const STEAM_PATH = join(ROOT, 'public', 'pinnacle_steam.json');
const STEAM_KEEP_SEC = 6 * 3600;

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
  'New York Yankees': 'nyy', 'Oakland Athletics': 'oak',
  'Athletics': 'oak', 'Sacramento Athletics': 'oak', 'Philadelphia Phillies': 'phi',
  'Pittsburgh Pirates': 'pit', 'San Diego Padres': 'sdp', 'San Francisco Giants': 'sfg',
  'Seattle Mariners': 'sea', 'St. Louis Cardinals': 'stl', 'St Louis Cardinals': 'stl',
  'Tampa Bay Rays': 'tbr', 'Texas Rangers': 'tex', 'Toronto Blue Jays': 'tor',
  'Washington Nationals': 'wsh',
};

const NBA_CODES = {
  'Atlanta Hawks': 'atl', 'Boston Celtics': 'bos', 'Brooklyn Nets': 'bkn',
  'Charlotte Hornets': 'cha', 'Chicago Bulls': 'chi', 'Cleveland Cavaliers': 'cle',
  'Dallas Mavericks': 'dal', 'Denver Nuggets': 'den', 'Detroit Pistons': 'det',
  'Golden State Warriors': 'gsw', 'Houston Rockets': 'hou', 'Indiana Pacers': 'ind',
  'Los Angeles Clippers': 'lac', 'Los Angeles Lakers': 'lal', 'Memphis Grizzlies': 'mem',
  'Miami Heat': 'mia', 'Milwaukee Bucks': 'mil', 'Minnesota Timberwolves': 'min',
  'New Orleans Pelicans': 'nop', 'New York Knicks': 'nyk', 'Oklahoma City Thunder': 'okc',
  'Orlando Magic': 'orl', 'Philadelphia 76ers': 'phi', 'Phoenix Suns': 'phx',
  'Portland Trail Blazers': 'por', 'Sacramento Kings': 'sac', 'San Antonio Spurs': 'sas',
  'Toronto Raptors': 'tor', 'Utah Jazz': 'uth', 'Washington Wizards': 'was',
};

const BOOK_DISPLAY = {
  draftkings: 'DraftKings',
  fanduel: 'FanDuel',
  betmgm: 'BetMGM',
  caesars: 'Caesars',
  pinnacle: 'Pinnacle',
  circa: 'Circa',
  bookmaker: 'Bookmaker',
  lowvig: 'LowVig',
  betonlineag: 'BetOnline',
};

function fairBookDisplayName(key) {
  return BOOK_DISPLAY[key] || (key ? String(key) : 'Fair');
}

const normalize = s => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

/** Keep tape points for HISTORY_KEEP_HOURS (and never more than MAX_HISTORY). */
function trimHistorySeries(arr, nowSec) {
  if (!Array.isArray(arr) || !arr.length) return [];
  const cutoff = nowSec - HISTORY_KEEP_HOURS * 3600;
  const kept = arr.filter((h) => {
    const t = Number(h?.t);
    if (!Number.isFinite(t)) return true;
    const sec = t > 1e12 ? t / 1000 : t;
    return sec >= cutoff;
  });
  if (kept.length > MAX_HISTORY) return kept.slice(kept.length - MAX_HISTORY);
  return kept;
}

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
  if (sportLabel === 'NBA') {
    const a = NBA_CODES[away] || away.toLowerCase().replace(/[^a-z]/g, '').slice(0, 3);
    const h = NBA_CODES[home] || home.toLowerCase().replace(/[^a-z]/g, '').slice(0, 3);
    return `${a}_${h}`;
  }
  if (sportLabel === 'SOC') {
    // Key by FIFA code so it matches fetchPolymarketData's SOC convention
    // (normalize(resolveSOCTeam(away))_normalize(resolveSOCTeam(home))).
    // Returns null when a country can't be resolved — caller skips it.
    const a = resolveSOCTeam(away);
    const h = resolveSOCTeam(home);
    if (!a || !h) return null;
    return `${normalize(a)}_${normalize(h)}`;
  }
  if (sportLabel === 'UFC') {
    return makeUFCGameKey(away, home);
  }
  if (sportLabel === 'WNBA') {
    return makeWNBAGameKey(away, home);
  }
  if (sportLabel === 'NFL') {
    return makeNFLGameKey(away, home);
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

async function fetchOdds(sportKey, markets = 'h2h,spreads,totals') {
  const url = `https://api.the-odds-api.com/v4/sports/${sportKey}/odds`
    + `?apiKey=${API_KEY}&regions=${ODDS_REGIONS}&bookmakers=${BOOKMAKERS}`
    + `&markets=${markets}&oddsFormat=american`;
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

/**
 * Best available h2h quote for ticket/CLV plumbing.
 * Prefer sharp fair books; if none quote the game, fall through to retail
 * (and finally any bookmaker). Real incident 2026-08-09 Athletics @ Red Sox:
 * Odds API returned only DK/FD — FAIR_BOOKS-only skip left oak_bos out of
 * pinnacle_history and locked picks stamped with null odds.
 */
function pickFairH2h(game) {
  const awayName = game.away_team;
  const homeName = game.home_team;
  const byKey = Object.fromEntries((game.bookmakers || []).map(b => [b.key, b]));
  const order = [
    ...FAIR_BOOKS,
    ...RETAIL_BOOKS,
    ...Object.keys(byKey).filter((k) => !FAIR_BOOKS.includes(k) && !RETAIL_BOOKS.includes(k)),
  ];
  for (const key of order) {
    const bk = byKey[key];
    if (!bk) continue;
    const h2h = bk.markets?.find(m => m.key === 'h2h');
    if (!h2h) continue;
    const aw = h2h.outcomes.find(o => o.name === awayName);
    const hm = h2h.outcomes.find(o => o.name === homeName);
    if (!aw || !hm || aw.price == null || hm.price == null) continue;
    const dr = h2h.outcomes.find(o => o.name === 'Draw');
    return {
      fairBook: key,
      fairAway: aw.price,
      fairHome: hm.price,
      fairDraw: dr?.price ?? null,
    };
  }
  return null;
}

function pickFairSpread(game, preferBook = null) {
  const awayName = game.away_team;
  const homeName = game.home_team;
  const byKey = Object.fromEntries((game.bookmakers || []).map(b => [b.key, b]));
  // Odds API `spreads` is the labeled main (alts are `alternate_spreads`).
  // Retail last — we need the LINE even when no fair book quotes it.
  const order = preferBook
    ? [preferBook, ...FAIR_BOOKS.filter(k => k !== preferBook), ...RETAIL_BOOKS]
    : [...FAIR_BOOKS, ...RETAIL_BOOKS];
  for (const key of order) {
    const bk = byKey[key];
    if (!bk) continue;
    const spreadMkt = bk.markets?.find(m => m.key === 'spreads');
    if (!spreadMkt) continue;
    const aw = spreadMkt.outcomes.find(o => o.name === awayName);
    const hm = spreadMkt.outcomes.find(o => o.name === homeName);
    if (!aw || !hm || aw.price == null || hm.price == null) continue;
    return {
      fairBook: key,
      fairSpread: {
        awayLine: aw.point, awayOdds: aw.price,
        homeLine: hm.point, homeOdds: hm.price,
      },
    };
  }
  return null;
}

function pickFairTotal(game, preferBook = null) {
  const byKey = Object.fromEntries((game.bookmakers || []).map(b => [b.key, b]));
  const order = preferBook
    ? [preferBook, ...FAIR_BOOKS.filter(k => k !== preferBook), ...RETAIL_BOOKS]
    : [...FAIR_BOOKS, ...RETAIL_BOOKS];
  for (const key of order) {
    const bk = byKey[key];
    if (!bk) continue;
    const totalMkt = bk.markets?.find(m => m.key === 'totals');
    if (!totalMkt) continue;
    const over = totalMkt.outcomes.find(o => o.name === 'Over');
    const under = totalMkt.outcomes.find(o => o.name === 'Under');
    if (!over || !under || over.price == null || under.price == null) continue;
    return {
      fairBook: key,
      fairTotal: { line: over.point, overOdds: over.price, underOdds: under.price },
    };
  }
  return null;
}

function extractBookOdds(game) {
  const awayName = game.away_team;
  const homeName = game.home_team;

  let bestAway = null, bestHome = null, bestDraw = null;
  let bestAwayBook = null, bestHomeBook = null, bestDrawBook = null;
  const allBooks = {};

  for (const bk of (game.bookmakers || [])) {
    const h2h = bk.markets?.find(m => m.key === 'h2h');
    if (!h2h) continue;

    const aw = h2h.outcomes.find(o => o.name === awayName);
    const hm = h2h.outcomes.find(o => o.name === homeName);
    const dr = h2h.outcomes.find(o => o.name === 'Draw');
    if (!aw || !hm) continue;

    const bookName = BOOK_DISPLAY[bk.key] || bk.title;
    allBooks[bk.key] = { away: aw.price, home: hm.price, name: bookName };
    if (dr) allBooks[bk.key].draw = dr.price;

    if (RETAIL_BOOKS.includes(bk.key)) {
      if (bestAway === null || aw.price > bestAway) {
        bestAway = aw.price;
        bestAwayBook = bookName;
      }
      if (bestHome === null || hm.price > bestHome) {
        bestHome = hm.price;
        bestHomeBook = bookName;
      }
      if (dr && (bestDraw === null || dr.price > bestDraw)) {
        bestDraw = dr.price;
        bestDrawBook = bookName;
      }
    }
  }

  const fair = pickFairH2h(game);
  return {
    fairBook: fair?.fairBook || null,
    fairAway: fair?.fairAway ?? null,
    fairHome: fair?.fairHome ?? null,
    fairDraw: fair?.fairDraw ?? null,
    bestAway, bestHome, bestDraw, bestAwayBook, bestHomeBook, bestDrawBook, allBooks,
  };
}

function extractSpreadOdds(game, preferFairBook = null) {
  const awayName = game.away_team;
  const homeName = game.home_team;
  let bestAwaySpread = null, bestHomeSpread = null;

  for (const bk of (game.bookmakers || [])) {
    const spreadMkt = bk.markets?.find(m => m.key === 'spreads');
    if (!spreadMkt) continue;
    const aw = spreadMkt.outcomes.find(o => o.name === awayName);
    const hm = spreadMkt.outcomes.find(o => o.name === homeName);
    if (!aw || !hm) continue;

    if (RETAIL_BOOKS.includes(bk.key)) {
      const bookName = BOOK_DISPLAY[bk.key] || bk.title;
      if (bestAwaySpread === null || aw.price > bestAwaySpread.odds) {
        bestAwaySpread = { line: aw.point, odds: aw.price, book: bookName };
      }
      if (bestHomeSpread === null || hm.price > bestHomeSpread.odds) {
        bestHomeSpread = { line: hm.point, odds: hm.price, book: bookName };
      }
    }
  }
  const fair = pickFairSpread(game, preferFairBook);
  return {
    fairSpread: fair?.fairSpread || null,
    fairSpreadBook: fair?.fairBook || null,
    bestAwaySpread,
    bestHomeSpread,
  };
}

function extractTotalOdds(game, preferFairBook = null) {
  let bestOver = null, bestUnder = null;
  const allTotalBooks = {};

  for (const bk of (game.bookmakers || [])) {
    const totalMkt = bk.markets?.find(m => m.key === 'totals');
    if (!totalMkt) continue;
    const over = totalMkt.outcomes.find(o => o.name === 'Over');
    const under = totalMkt.outcomes.find(o => o.name === 'Under');
    if (!over || !under || !Number.isFinite(over.point)) continue;

    const bookName = BOOK_DISPLAY[bk.key] || bk.title || bk.key;
    allTotalBooks[bk.key] = {
      over: over.price,
      under: under.price,
      line: over.point,
      name: bookName,
    };

    if (RETAIL_BOOKS.includes(bk.key)) {
      if (bestOver === null || over.price > bestOver.odds) {
        bestOver = { line: over.point, odds: over.price, book: bookName };
      }
      if (bestUnder === null || under.price > bestUnder.odds) {
        bestUnder = { line: under.point, odds: under.price, book: bookName };
      }
    }
  }
  const fair = pickFairTotal(game, preferFairBook);
  return {
    fairTotal: fair?.fairTotal || null,
    fairTotalBook: fair?.fairBook || null,
    bestOver,
    bestUnder,
    allTotalBooks,
  };
}

async function run() {
  console.log('📌 Sharp odds snapshot (fair book cascade + retail)\n');
  console.log(`   Fair order: ${FAIR_BOOKS.join(' → ')}`);
  console.log(`   Regions: ${ODDS_REGIONS}`);
  console.log(`   pinnapi: ${process.env.PINNAPI_KEY ? 'enabled' : 'off (no PINNAPI_KEY)'}\n`);
  const now = Math.floor(Date.now() / 1000);
  const history = loadHistory();
  const staleCutoff = now - STALE_HOURS * 3600;
  const fairSourceCounts = {};
  let pinnapiMatched = 0;
  let pinnapiWithMax = 0;

  // Cache per label (NBA/CBB/WNBA each filter their own leagues from sport_id 3).
  const pinnapiCache = new Map();

  async function pinnapiFor(label) {
    if (pinnapiCache.has(label)) return pinnapiCache.get(label);
    const idx = await fetchPinnapiIndex(label, makeGameKey);
    pinnapiCache.set(label, idx);
    if (idx.size) console.log(`  📡 pinnapi ${label}: ${idx.size} events indexed`);
    return idx;
  }

  for (const { key: sportKey, label, markets } of SPORTS) {
    if (!history[label]) history[label] = {};
    let sportFair = 0;
    let sportSkip = 0;
    const pinIdx = await pinnapiFor(label);

    const games = await fetchOdds(sportKey, markets || 'h2h,spreads,totals');
    for (const game of games) {
      let {
        fairBook, fairAway, fairHome, fairDraw,
        bestAway, bestHome, bestDraw, bestAwayBook, bestHomeBook, bestDrawBook, allBooks,
      } = extractBookOdds(game);
      if (fairAway == null || fairHome == null || !fairBook) {
        sportSkip++;
        continue;
      }

      const awayName = game.away_team;
      const homeName = game.home_team;
      const gameKey = makeGameKey(awayName, homeName, label);
      if (!gameKey) continue; // SOC country we can't resolve to a FIFA code

      const existing = history[label][gameKey] || {};

      if (existing.apiId && existing.apiId !== game.id) {
        const existingDist = Math.abs(new Date(existing.commence).getTime() - Date.now());
        const newDist = Math.abs(new Date(game.commence_time).getTime() - Date.now());
        if (existingDist <= newDist) continue;
        delete existing.opener;
        delete existing.history;
        delete existing.movement;
        delete existing.spreadOpener;
        delete existing.spreadHistory;
        delete existing.totalOpener;
        delete existing.totalHistory;
      }

      // Prefer true Pinnacle from pinnapi when we can match the game.
      const pin = pinIdx.get(gameKey) || null;
      let max = null;
      let maxMoneyLine = null;
      let maxSpread = null;
      let maxTotal = null;
      if (pin) {
        pinnapiMatched++;
        fairAway = pin.away;
        fairHome = pin.home;
        if (pin.draw != null) fairDraw = pin.draw;
        fairBook = 'pinnacle';
        allBooks = {
          ...allBooks,
          pinnacle: {
            away: pin.away,
            home: pin.home,
            name: 'Pinnacle',
            ...(pin.draw != null ? { draw: pin.draw } : {}),
          },
        };
        max = pin.max;
        maxMoneyLine = pin.maxMoneyLine;
        maxSpread = pin.maxSpread;
        maxTotal = pin.maxTotal;
        if (max != null) pinnapiWithMax++;
      }

      // ML history (draw stored only when present — 3-way soccer).
      const snapshot = { t: now, away: fairAway, home: fairHome, fairBook };
      if (fairDraw != null) snapshot.draw = fairDraw;
      if (max != null) snapshot.max = max;
      if (maxMoneyLine != null) snapshot.maxMoneyLine = maxMoneyLine;
      if (maxSpread != null) snapshot.maxSpread = maxSpread;
      if (maxTotal != null) snapshot.maxTotal = maxTotal;
      if (!existing.opener) {
        existing.opener = { ...snapshot };
      }
      existing.current = fairDraw != null
        ? { away: fairAway, home: fairHome, draw: fairDraw }
        : { away: fairAway, home: fairHome };
      if (max != null) existing.current.max = max;
      if (maxMoneyLine != null) existing.current.maxMoneyLine = maxMoneyLine;
      if (maxSpread != null) existing.current.maxSpread = maxSpread;
      if (maxTotal != null) existing.current.maxTotal = maxTotal;
      existing.fairBook = fairBook;
      if (max != null) existing.max = max;
      if (maxMoneyLine != null) existing.maxMoneyLine = maxMoneyLine;
      if (maxSpread != null) existing.maxSpread = maxSpread;
      if (maxTotal != null) existing.maxTotal = maxTotal;

      const hist = existing.history || [];
      hist.push(snapshot);
      existing.history = trimHistorySeries(hist, now);

      const opAway = existing.opener.away;
      const opHome = existing.opener.home;
      const currAwayProb = impliedProb(fairAway);
      const openAwayProb = impliedProb(opAway);
      const currHomeProb = impliedProb(fairHome);
      const openHomeProb = impliedProb(opHome);
      existing.movement = {
        away: fairAway - opAway,
        home: fairHome - opHome,
        direction: currAwayProb > openAwayProb ? 'away'
                 : currHomeProb > openHomeProb ? 'home'
                 : null,
      };

      existing.bestAway = bestAway;
      existing.bestHome = bestHome;
      existing.bestAwayBook = bestAwayBook;
      existing.bestHomeBook = bestHomeBook;
      if (bestDraw != null) { existing.bestDraw = bestDraw; existing.bestDrawBook = bestDrawBook; }

      const fairAwayProb = impliedProb(fairAway);
      const fairHomeProb = impliedProb(fairHome);
      const bestAwayProb = impliedProb(bestAway);
      const bestHomeProb = impliedProb(bestHome);

      existing.ev = {
        away: (fairAwayProb && bestAwayProb) ? +((fairAwayProb - bestAwayProb) * 100).toFixed(1) : null,
        home: (fairHomeProb && bestHomeProb) ? +((fairHomeProb - bestHomeProb) * 100).toFixed(1) : null,
      };

      existing.allBooks = allBooks;
      existing.awayTeam = awayName;
      existing.homeTeam = homeName;
      existing.commence = game.commence_time;
      existing.apiId = game.id;

      // Spread data — Odds API `spreads` is the labeled main. Do not replace
      // that LINE with pinnapi's unlabeled bag (closest-to-0 was picking MLB +1
      // over the 1.5 run line). Attach Pinnacle odds at the labeled line.
      let { fairSpread, fairSpreadBook, bestAwaySpread, bestHomeSpread } = extractSpreadOdds(game, fairBook);
      const labeledHomeLine = fairSpread?.homeLine;
      if (pin?.allSpreads?.length && Number.isFinite(labeledHomeLine)) {
        const pinOnLabeled = pin.allSpreads.find((s) => linesClose(s.homeLine, labeledHomeLine));
        if (pinOnLabeled) {
          fairSpread = {
            homeLine: pinOnLabeled.homeLine,
            awayLine: pinOnLabeled.awayLine,
            homeOdds: pinOnLabeled.homeOdds,
            awayOdds: pinOnLabeled.awayOdds,
          };
          fairSpreadBook = 'pinnacle';
        }
      } else if (!fairSpread && pin?.fairSpread?.awayOdds != null && pin.fairSpread.homeOdds != null) {
        fairSpread = pin.fairSpread;
        fairSpreadBook = 'pinnacle';
      }
      const spreadSnapsByLine = new Map();
      const pushSpreadSnap = (snap) => {
        if (!snap || !Number.isFinite(snap.homeLine)) return;
        const key = Number(snap.homeLine).toFixed(3);
        const prev = spreadSnapsByLine.get(key);
        if (prev && prev.fairBook === 'pinnacle' && snap.fairBook !== 'pinnacle') return;
        spreadSnapsByLine.set(key, snap);
      };
      if (fairSpread) {
        const sSnap = { t: now, ...fairSpread, fairBook: fairSpreadBook };
        if (maxSpread != null) sSnap.max = maxSpread;
        pushSpreadSnap(sSnap);
        if (!existing.spreadOpener) {
          existing.spreadOpener = { ...sSnap };
        }
        existing.spreadCurrent = { ...fairSpread };
        if (maxSpread != null) existing.spreadCurrent.max = maxSpread;
        existing.fairSpreadBook = fairSpreadBook;
        existing.spreadMovement = {
          awayLine: fairSpread.awayLine - (existing.spreadOpener.awayLine || 0),
          awayOdds: fairSpread.awayOdds - (existing.spreadOpener.awayOdds || 0),
          homeOdds: fairSpread.homeOdds - (existing.spreadOpener.homeOdds || 0),
        };
      }
      for (const alt of (pin?.allSpreads || [])) {
        if (!Number.isFinite(alt.homeLine) || !Number.isFinite(alt.homeOdds) || !Number.isFinite(alt.awayOdds)) continue;
        pushSpreadSnap({
          t: now,
          homeLine: alt.homeLine,
          awayLine: alt.awayLine,
          homeOdds: alt.homeOdds,
          awayOdds: alt.awayOdds,
          fairBook: 'pinnacle',
          max: alt.max ?? maxSpread ?? null,
        });
      }
      if (spreadSnapsByLine.size) {
        const labeled = Number.isFinite(labeledHomeLine) ? labeledHomeLine : null;
        const boardMain = labeled != null
          ? ([...spreadSnapsByLine.values()].find((s) => linesClose(s.homeLine, labeled))
            || pickMainSpreadFromBoard([...spreadSnapsByLine.values()]))
          : pickMainSpreadFromBoard([...spreadSnapsByLine.values()]);
        for (const snap of spreadSnapsByLine.values()) {
          snap.isMain = !!(boardMain && linesClose(snap.homeLine, boardMain.homeLine));
        }
        if (boardMain) {
          existing.spreadCurrent = {
            homeLine: boardMain.homeLine,
            awayLine: boardMain.awayLine,
            homeOdds: boardMain.homeOdds,
            awayOdds: boardMain.awayOdds,
            max: boardMain.max ?? existing.spreadCurrent?.max ?? null,
            isMain: true,
          };
        }
        const sHist = existing.spreadHistory || [];
        for (const snap of spreadSnapsByLine.values()) sHist.push(snap);
        existing.spreadHistory = trimHistorySeries(sHist, now);
        existing.spreadLines = [...spreadSnapsByLine.values()]
          .map((s) => ({
            homeLine: s.homeLine,
            awayLine: s.awayLine,
            homeOdds: s.homeOdds,
            awayOdds: s.awayOdds,
            max: s.max ?? null,
            fairBook: s.fairBook || null,
            t: s.t,
            isMain: !!s.isMain,
          }))
          .sort((a, b) => Math.abs(a.homeLine) - Math.abs(b.homeLine));
      }
      if (bestAwaySpread) existing.bestAwaySpread = bestAwaySpread;
      if (bestHomeSpread) existing.bestHomeSpread = bestHomeSpread;

      // Total data — Odds API `totals` is the labeled main. Same as spreads:
      // keep that LINE, attach Pinnacle odds at it. Alts go on the board.
      let { fairTotal, fairTotalBook, bestOver, bestUnder, allTotalBooks } = extractTotalOdds(game, fairBook);
      const labeledTotalLine = fairTotal?.line;
      if (pin?.allTotals?.length && Number.isFinite(labeledTotalLine)) {
        const pinOnLabeled = pin.allTotals.find((t) => linesClose(t.line, labeledTotalLine));
        if (pinOnLabeled) {
          fairTotal = {
            line: pinOnLabeled.line,
            overOdds: pinOnLabeled.overOdds,
            underOdds: pinOnLabeled.underOdds,
          };
          fairTotalBook = 'pinnacle';
        }
      } else if (!fairTotal && pin?.fairTotal?.overOdds != null && pin.fairTotal.underOdds != null) {
        fairTotal = pin.fairTotal;
        fairTotalBook = 'pinnacle';
      }
      const totalSnapsByLine = new Map();
      const pushTotalSnap = (snap) => {
        if (!snap || !Number.isFinite(snap.line)) return;
        const key = Number(snap.line).toFixed(3);
        // Prefer pinnacle over soft-book for the same line in one cycle.
        const prev = totalSnapsByLine.get(key);
        if (prev && prev.fairBook === 'pinnacle' && snap.fairBook !== 'pinnacle') return;
        totalSnapsByLine.set(key, snap);
      };
      if (fairTotal) {
        const tSnap = { t: now, ...fairTotal, fairBook: fairTotalBook };
        if (maxTotal != null) tSnap.max = maxTotal;
        pushTotalSnap(tSnap);
        if (!existing.totalOpener) {
          existing.totalOpener = { ...tSnap };
        }
        existing.totalCurrent = { ...fairTotal };
        if (maxTotal != null) existing.totalCurrent.max = maxTotal;
        existing.fairTotalBook = fairTotalBook;
        existing.totalMovement = {
          line: fairTotal.line - (existing.totalOpener.line || 0),
          overOdds: fairTotal.overOdds - (existing.totalOpener.overOdds || 0),
          underOdds: fairTotal.underOdds - (existing.totalOpener.underOdds || 0),
        };
      }
      // Pinnacle alts (full totals board from pinnapi).
      for (const alt of (pin?.allTotals || [])) {
        if (!Number.isFinite(alt.line) || !Number.isFinite(alt.overOdds) || !Number.isFinite(alt.underOdds)) continue;
        pushTotalSnap({
          t: now,
          line: alt.line,
          overOdds: alt.overOdds,
          underOdds: alt.underOdds,
          fairBook: 'pinnacle',
          max: alt.max ?? maxTotal ?? null,
        });
      }
      // Soft-book prints at non-main lines (helps when Pinnacle dropped the alt).
      for (const b of Object.values(allTotalBooks || {})) {
        if (!b || !Number.isFinite(b.line) || !Number.isFinite(b.over) || !Number.isFinite(b.under)) continue;
        if (fairTotal && Math.abs(b.line - fairTotal.line) <= 0.051) continue;
        pushTotalSnap({
          t: now,
          line: b.line,
          overOdds: b.over,
          underOdds: b.under,
          fairBook: String(b.name || 'retail').toLowerCase(),
          // Soft books rarely expose alt max — stamp book totals max so the
          // dual-axis tape still has a liquidity series on vault alts.
          max: maxTotal ?? null,
        });
      }
      if (totalSnapsByLine.size) {
        const labeled = Number.isFinite(labeledTotalLine) ? labeledTotalLine : null;
        const boardMain = labeled != null
          ? ([...totalSnapsByLine.values()].find((s) => linesClose(s.line, labeled))
            || pickMainTotalFromBoard([...totalSnapsByLine.values()]))
          : pickMainTotalFromBoard([...totalSnapsByLine.values()]);
        for (const snap of totalSnapsByLine.values()) {
          snap.isMain = !!(boardMain && linesClose(snap.line, boardMain.line));
        }
        if (boardMain) {
          existing.totalCurrent = {
            line: boardMain.line,
            overOdds: boardMain.overOdds,
            underOdds: boardMain.underOdds,
            max: boardMain.max ?? existing.totalCurrent?.max ?? null,
            isMain: true,
          };
        }
        const tHist = existing.totalHistory || [];
        for (const snap of totalSnapsByLine.values()) tHist.push(snap);
        existing.totalHistory = trimHistorySeries(tHist, now);
        existing.totalLines = [...totalSnapsByLine.values()]
          .map((s) => ({
            line: s.line,
            overOdds: s.overOdds,
            underOdds: s.underOdds,
            max: s.max ?? null,
            fairBook: s.fairBook || null,
            t: s.t,
            isMain: !!s.isMain,
          }))
          .sort((a, b) => a.line - b.line);
      }
      if (bestOver) existing.bestOver = bestOver;
      if (bestUnder) existing.bestUnder = bestUnder;
      if (allTotalBooks && Object.keys(allTotalBooks).length) {
        existing.allTotalBooks = allTotalBooks;
      }

      history[label][gameKey] = existing;
      sportFair++;
      fairSourceCounts[fairBook] = (fairSourceCounts[fairBook] || 0) + 1;
    }

    if (sportFair > 0 || sportSkip > 0) {
      console.log(`  ${label}: ${sportFair} with fair book, ${sportSkip} skipped (no fair quote)`);
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

  // Edge REST drops → stamp steam onto matched games (cron-friendly; SSE is optional elsewhere).
  let steamStamped = 0;
  if (process.env.PINNAPI_KEY) {
    const sportIds = [...new Set(Object.values(PINNAPI_SPORT_ID))];
    const rawDrops = [];
    for (const sportId of sportIds) {
      const batch = await fetchRecentDrops({
        mode: 'prematch',
        sportId,
        minDropPct: 3,
        maxAgeSec: 7200,
        markets: 'moneyline,spread,total',
        periods: '0',
        limit: 200,
      });
      rawDrops.push(...batch);
    }
    const seen = new Set();
    const normalized = [];
    for (const raw of rawDrops) {
      const n = normalizeDrop(raw, now);
      if (!n || !n.home || !n.away || !Number.isFinite(n.dropPct)) continue;
      const dedupe = `${n.eventId}|${n.market}|${n.side}|${n.points}|${n.t}|${n.toOdds}`;
      if (seen.has(dedupe)) continue;
      seen.add(dedupe);
      normalized.push(n);
    }

    const LABEL_BY_SPORT_HINT = [
      [/hockey|nhl/i, 'NHL'],
      [/baseball|mlb/i, 'MLB'],
      [/basketball.*wnba|wnba/i, 'WNBA'],
      [/basketball|nba|ncaa/i, 'NBA'],
      [/football|nfl/i, 'NFL'],
      [/soccer|football.*uefa|epl/i, 'SOC'],
      [/mma|ufc|combat/i, 'UFC'],
    ];
    const guessLabel = (n) => {
      const blob = `${n.sportName || ''} ${n.league || ''}`;
      for (const [re, label] of LABEL_BY_SPORT_HINT) {
        if (re.test(blob)) {
          if (label === 'NBA' && /wnba/i.test(blob)) return 'WNBA';
          if (label === 'NBA' && /ncaa|college|ncaab/i.test(blob)) return 'CBB';
          return label;
        }
      }
      return null;
    };

    for (const n of normalized) {
      const labels = [];
      const guessed = guessLabel(n);
      if (guessed) labels.push(guessed);
      // Also try all labels — makeGameKey is sport-aware for SOC/UFC/etc.
      for (const lab of ['MLB', 'NHL', 'NBA', 'NFL', 'CBB', 'WNBA', 'SOC', 'UFC']) {
        if (!labels.includes(lab)) labels.push(lab);
      }
      let attached = false;
      for (const label of labels) {
        if (!history[label]) continue;
        const gk = makeGameKey(n.away, n.home, label);
        if (!gk || !history[label][gk]) continue;
        const gd = history[label][gk];
        const prev = Array.isArray(gd.steamDrops) ? gd.steamDrops : [];
        const next = [...prev, {
          t: n.t,
          market: n.market,
          side: n.side,
          points: n.points,
          fromOdds: n.fromOdds,
          toOdds: n.toOdds,
          dropPct: n.dropPct,
          nvp: n.nvp,
        }].filter((d) => Number.isFinite(d.t) && d.t >= now - STEAM_KEEP_SEC);
        // Dedupe near-identical prints
        const uniq = [];
        const uk = new Set();
        for (const d of next.sort((a, b) => (a.t || 0) - (b.t || 0))) {
          const k = `${d.market}|${d.side}|${d.points}|${d.toOdds}|${Math.floor((d.t || 0) / 30)}`;
          if (uk.has(k)) continue;
          uk.add(k);
          uniq.push(d);
        }
        gd.steamDrops = uniq.slice(-40);
        history[label][gk] = gd;
        steamStamped++;
        attached = true;
        break;
      }
      if (!attached) {
        // keep in aggregate file even if unmatched
      }
    }

    writeFileSync(STEAM_PATH, JSON.stringify({
      updatedAt: new Date().toISOString(),
      count: normalized.length,
      stamped: steamStamped,
      drops: normalized.slice(0, 300),
    }, null, 2), 'utf8');
    console.log(`  ⚡ steam drops: ${normalized.length} pulled, ${steamStamped} matched to games`);
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
  const srcLine = Object.entries(fairSourceCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([k, n]) => `${k}=${n}`)
    .join(', ') || 'none';
  console.log(`\n✅ ${totalGames} games tracked, ${evSpots} with +EV retail lines`);
  console.log(`   Fair sources this cycle: ${srcLine}`);
  if (process.env.PINNAPI_KEY) {
    console.log(`   pinnapi matched=${pinnapiMatched} withMax=${pinnapiWithMax}`);
  }
}

run().catch(e => { console.error(e); process.exit(1); });
