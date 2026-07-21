/**
 * Sharp Odds Snapshot — captures fair-value + retail book prices every
 * 15 minutes for all active sports. Piggybacked on the fetch-polymarket
 * workflow.
 *
 * Fair book = most reputable quote available per game (not Pinnacle-only):
 *   pinnacle → circa → bookmaker → lowvig → betonlineag
 * Prices still land in opener/current/history so CLV/lock/close plumbing
 * stays compatible. Each game stamps `fairBook` with the source key.
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
];

// Reputation order for fair line (highest → lowest). First with both sides wins.
const FAIR_BOOKS = ['pinnacle', 'circa', 'bookmaker', 'lowvig', 'betonlineag'];
const RETAIL_BOOKS = ['draftkings', 'fanduel', 'betmgm', 'caesars'];
const BOOKMAKERS = [...FAIR_BOOKS, ...RETAIL_BOOKS].join(',');
const ODDS_REGIONS = 'us,uk,eu';
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

/** First FAIR_BOOKS entry with both away+home h2h prices. */
function pickFairH2h(game) {
  const awayName = game.away_team;
  const homeName = game.home_team;
  const byKey = Object.fromEntries((game.bookmakers || []).map(b => [b.key, b]));
  for (const key of FAIR_BOOKS) {
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
  const order = preferBook
    ? [preferBook, ...FAIR_BOOKS.filter(k => k !== preferBook)]
    : FAIR_BOOKS;
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
    ? [preferBook, ...FAIR_BOOKS.filter(k => k !== preferBook)]
    : FAIR_BOOKS;
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

  for (const bk of (game.bookmakers || [])) {
    const totalMkt = bk.markets?.find(m => m.key === 'totals');
    if (!totalMkt) continue;
    const over = totalMkt.outcomes.find(o => o.name === 'Over');
    const under = totalMkt.outcomes.find(o => o.name === 'Under');
    if (!over || !under) continue;

    if (RETAIL_BOOKS.includes(bk.key)) {
      const bookName = BOOK_DISPLAY[bk.key] || bk.title;
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
  };
}

async function run() {
  console.log('📌 Sharp odds snapshot (fair book cascade + retail)\n');
  console.log(`   Fair order: ${FAIR_BOOKS.join(' → ')}`);
  console.log(`   Regions: ${ODDS_REGIONS}\n`);
  const now = Math.floor(Date.now() / 1000);
  const history = loadHistory();
  const staleCutoff = now - STALE_HOURS * 3600;
  const fairSourceCounts = {};

  for (const { key: sportKey, label, markets } of SPORTS) {
    if (!history[label]) history[label] = {};
    let sportFair = 0;
    let sportSkip = 0;

    const games = await fetchOdds(sportKey, markets || 'h2h,spreads,totals');
    for (const game of games) {
      const {
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

      // ML history (draw stored only when present — 3-way soccer).
      const snapshot = { t: now, away: fairAway, home: fairHome, fairBook };
      if (fairDraw != null) snapshot.draw = fairDraw;
      if (!existing.opener) {
        existing.opener = { ...snapshot };
      }
      existing.current = fairDraw != null
        ? { away: fairAway, home: fairHome, draw: fairDraw }
        : { away: fairAway, home: fairHome };
      existing.fairBook = fairBook;

      const hist = existing.history || [];
      hist.push(snapshot);
      if (hist.length > MAX_HISTORY) hist.splice(0, hist.length - MAX_HISTORY);
      existing.history = hist;

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

      // Spread data — prefer same fair book as ML when possible
      const { fairSpread, fairSpreadBook, bestAwaySpread, bestHomeSpread } = extractSpreadOdds(game, fairBook);
      if (fairSpread) {
        if (!existing.spreadOpener) {
          existing.spreadOpener = { ...fairSpread, t: now, fairBook: fairSpreadBook };
        }
        existing.spreadCurrent = fairSpread;
        existing.fairSpreadBook = fairSpreadBook;
        existing.spreadMovement = {
          awayLine: fairSpread.awayLine - (existing.spreadOpener.awayLine || 0),
          awayOdds: fairSpread.awayOdds - (existing.spreadOpener.awayOdds || 0),
          homeOdds: fairSpread.homeOdds - (existing.spreadOpener.homeOdds || 0),
        };
        const sHist = existing.spreadHistory || [];
        sHist.push({ t: now, ...fairSpread, fairBook: fairSpreadBook });
        if (sHist.length > MAX_HISTORY) sHist.splice(0, sHist.length - MAX_HISTORY);
        existing.spreadHistory = sHist;
      }
      if (bestAwaySpread) existing.bestAwaySpread = bestAwaySpread;
      if (bestHomeSpread) existing.bestHomeSpread = bestHomeSpread;

      // Total data
      const { fairTotal, fairTotalBook, bestOver, bestUnder } = extractTotalOdds(game, fairBook);
      if (fairTotal) {
        if (!existing.totalOpener) {
          existing.totalOpener = { ...fairTotal, t: now, fairBook: fairTotalBook };
        }
        existing.totalCurrent = fairTotal;
        existing.fairTotalBook = fairTotalBook;
        existing.totalMovement = {
          line: fairTotal.line - (existing.totalOpener.line || 0),
          overOdds: fairTotal.overOdds - (existing.totalOpener.overOdds || 0),
          underOdds: fairTotal.underOdds - (existing.totalOpener.underOdds || 0),
        };
        const tHist = existing.totalHistory || [];
        tHist.push({ t: now, ...fairTotal, fairBook: fairTotalBook });
        if (tHist.length > MAX_HISTORY) tHist.splice(0, tHist.length - MAX_HISTORY);
        existing.totalHistory = tHist;
      }
      if (bestOver) existing.bestOver = bestOver;
      if (bestUnder) existing.bestUnder = bestUnder;

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
}

run().catch(e => { console.error(e); process.exit(1); });
