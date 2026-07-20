/**
 * scanWhitelistedWallets.js — guarantee-coverage scan for proven wallets.
 *
 * The MAIN scanner (scanSharpPositions.js) builds its wallet list from
 * public/whale_profiles.json + public/sports_sharps.json, then filters
 * through MM / sport_loser / unverified gates. ~44% of wallets that the
 * promotion pipeline (sharpWalletProfiles, Source A+B) considers PROVEN
 * are silently dropped from the main scanner every cycle — for reasons
 * that have nothing to do with whether they're profitable.
 *
 * This script is the parallel safety net. It runs every fetch cycle
 * AFTER scanSharpPositions and:
 *
 *   1. Loads the live whitelist (`sharpWalletProfiles` from Firestore).
 *   2. Reads what the main scanner produced (public/sharp_positions.json
 *      + sharp_spread_positions.json + sharp_total_positions.json).
 *   3. For every promoted wallet NOT already covered, attempts a
 *      direct Polymarket data-api scan with retry + back-off identical
 *      to the main scanner's mechanics.
 *   4. Merges any recovered positions into the appropriate
 *      sharp_positions*.json bucket so the existing
 *      writeSharpActions → Firestore pipeline picks them up on the
 *      same cycle. Atomic file writes with JSON-parse validation
 *      before swap, so a bug in this script cannot corrupt the
 *      scanner output.
 *   5. Writes `public/whitelist_scan_diagnostics.json` with per-wallet
 *      status so every cycle is auditable in git history.
 *
 * Address resolution chain (most authoritative first):
 *   1. public/whale_profiles.json   (suffix-matched against walletShort)
 *   2. public/sports_sharps.json    (same)
 *   3. sharpWalletProfiles.walletAddress  (the canonical store)
 *
 * avgSportBet resolution chain (writeSharpActions's SHADOW gate
 * depends on this being non-zero — without it the recovered position
 * gets silently dropped):
 *   1. sports_sharps.json[addr].avgSportBet (the value the main
 *      scanner would have used)
 *   2. sharpWalletProfiles[short].byMarket[market].positions.invested
 *      / .n  (derived per-market avg bet)
 *
 * Failure mode: the cycle bash loop catches non-zero exits via `|| echo`
 * so this script failing has zero downstream impact — the main
 * scanner's output is preserved exactly as it was before this script
 * ran (file writes are atomic via .tmp → rename).
 *
 * Usage:
 *   node scripts/scanWhitelistedWallets.js               (full Phase 2 — recover + merge)
 *   node scripts/scanWhitelistedWallets.js --no-merge    (diagnostic only, do not modify sharp_positions*.json)
 *   node scripts/scanWhitelistedWallets.js --verbose     (per-wallet stdout)
 *
 * The position-extraction helpers (NHL_MAP, MLB_MAP, NBA_MAP,
 * extractTeamsFromTitle, matchPositionToGame, matchSpreadTitle,
 * resolveOutcomeSide, buildTodaysGames, fetchWithRetry) are
 * intentionally duplicated from scanSharpPositions.js. Long-term we
 * should factor them into scripts/lib/walletScanHelpers.js so the two
 * scanners can't drift; that refactor is deferred to keep this change
 * additive-only and zero-risk to the main scanner.
 */

import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, writeFileSync, existsSync, unlinkSync, renameSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { matchSoccerPositionTitle, resolveSoccerSide } from './lib/soccerTeams.js';
import { matchUFCPositionTitle } from './lib/ufcFighters.js';
import { matchWNBAPositionTitle, resolveWNBATeam, WNBA_NAME_TO_CODE } from './lib/wnbaTeams.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');
const PUBLIC = join(ROOT, 'public');
const DATA_API = 'https://data-api.polymarket.com';

const argv = new Set(process.argv.slice(2));
const VERBOSE = argv.has('--verbose');
// Phase 2 (merge) is the default behavior. --no-merge falls back to
// diagnostic-only mode (still writes the diagnostics JSON but does NOT
// touch sharp_positions*.json) — useful for offline analysis runs.
const MERGE = !argv.has('--no-merge');

const httpFetch = typeof globalThis.fetch === 'function'
  ? globalThis.fetch
  : (await import('node-fetch')).default;

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const normalize = s => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

const DELAY_MS = 800;
const RETRY_LIMIT = 3;
// In-flight supplemental fetches. fetchWithRetry still backs off per request
// on 429, so a burst self-throttles. Override via SCAN_CONCURRENCY env.
const SCAN_CONCURRENCY = Number(process.env.SCAN_CONCURRENCY) || 4;

// Bounded-concurrency async map: runs `worker(item, idx)` for every item with
// at most `concurrency` promises in flight. Workers here never throw
// (fetchWithRetry returns {ok:false} on failure).
async function mapPool(items, concurrency, worker) {
  let cursor = 0;
  const runNext = async () => {
    while (cursor < items.length) {
      const i = cursor++;
      await worker(items[i], i);
    }
  };
  const lanes = Array.from({ length: Math.min(concurrency, items.length) }, runNext);
  await Promise.all(lanes);
}

// ─── Firebase init ─────────────────────────────────────────────────────────
if (!admin.apps.length) {
  const sak = join(ROOT, 'serviceAccountKey.json');
  if (existsSync(sak)) {
    admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(sak, 'utf8'))) });
  } else {
    admin.initializeApp({
      credential: admin.credential.cert({
        project_id: process.env.VITE_FIREBASE_PROJECT_ID,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
}
const db = admin.firestore();

// ─── Helpers duplicated from scanSharpPositions.js ─────────────────────────
// (kept in sync manually until factored to a shared lib)
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
  for (const w of (raw || '').split(/\s+/)) {
    const wn = normalize(w);
    if (NHL_MAP[wn]) return NHL_MAP[wn];
  }
  return null;
}

const MLB_MAP = {
  diamondbacks: 'ari', dbacks: 'ari', arizona: 'ari',
  braves: 'atl', atlanta: 'atl', orioles: 'bal', baltimore: 'bal',
  redsox: 'bos', boston: 'bos', cubs: 'chc', chicagocubs: 'chc',
  whitesox: 'cws', chicagowhitesox: 'cws', reds: 'cin', cincinnati: 'cin',
  guardians: 'cle', cleveland: 'cle', rockies: 'col', colorado: 'col',
  tigers: 'det', detroit: 'det', astros: 'hou', houston: 'hou',
  royals: 'kcr', kansascity: 'kcr', angels: 'laa', losangelesangels: 'laa',
  dodgers: 'lad', losangelesdodgers: 'lad', marlins: 'mia', miami: 'mia',
  brewers: 'mil', milwaukee: 'mil', twins: 'min', minnesota: 'min',
  mets: 'nym', newyorkmets: 'nym', yankees: 'nyy', newyorkyankees: 'nyy',
  athletics: 'oak', oakland: 'oak', as: 'oak', phillies: 'phi', philadelphia: 'phi',
  pirates: 'pit', pittsburgh: 'pit', padres: 'sdp', sandiego: 'sdp',
  giants: 'sfg', sanfrancisco: 'sfg', mariners: 'sea', seattle: 'sea',
  cardinals: 'stl', stlouis: 'stl', rays: 'tbr', tampabay: 'tbr',
  rangers: 'tex', texas: 'tex', bluejays: 'tor', toronto: 'tor',
  nationals: 'wsh', washington: 'wsh',
};
function resolveMLBCode(raw) {
  const n = normalize(raw);
  if (MLB_MAP[n]) return MLB_MAP[n];
  for (const w of (raw || '').split(/\s+/)) {
    const wn = normalize(w);
    if (MLB_MAP[wn]) return MLB_MAP[wn];
  }
  return null;
}

const NBA_MAP = {
  hawks: 'atl', atlanta: 'atl', celtics: 'bos', boston: 'bos',
  nets: 'bkn', brooklyn: 'bkn', hornets: 'cha', charlotte: 'cha',
  bulls: 'chi', chicago: 'chi', cavaliers: 'cle', cavs: 'cle', cleveland: 'cle',
  mavericks: 'dal', mavs: 'dal', dallas: 'dal', nuggets: 'den', denver: 'den',
  pistons: 'det', detroit: 'det', warriors: 'gsw', dubs: 'gsw', goldenstate: 'gsw',
  rockets: 'hou', houston: 'hou', pacers: 'ind', indiana: 'ind',
  clippers: 'lac', losangelesclippers: 'lac', laclippers: 'lac',
  lakers: 'lal', losangeleslakers: 'lal', lalakers: 'lal',
  grizzlies: 'mem', memphis: 'mem', heat: 'mia', miami: 'mia',
  bucks: 'mil', milwaukee: 'mil', timberwolves: 'min', wolves: 'min', minnesota: 'min',
  pelicans: 'nop', neworleans: 'nop', knicks: 'nyk', newyork: 'nyk', newyorkknicks: 'nyk',
  thunder: 'okc', oklahomacity: 'okc', magic: 'orl', orlando: 'orl',
  '76ers': 'phi', sixers: 'phi', philadelphia: 'phi', suns: 'phx', phoenix: 'phx',
  trailblazers: 'por', blazers: 'por', portland: 'por', kings: 'sac', sacramento: 'sac',
  spurs: 'sas', sanantonio: 'sas', raptors: 'tor', toronto: 'tor',
  jazz: 'uth', utah: 'uth', wizards: 'was', washington: 'was',
};
function resolveNBACode(raw) {
  const n = normalize(raw);
  if (NBA_MAP[n]) return NBA_MAP[n];
  for (const w of (raw || '').split(/\s+/)) {
    const wn = normalize(w);
    if (NBA_MAP[wn]) return NBA_MAP[wn];
  }
  return null;
}

function loadCBBTeamMap() {
  const csvPath = join(PUBLIC, 'basketball_teams.csv');
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

function matchPositionToGame(posTitle, todaysGames, cbbMap) {
  const teams = extractTeamsFromTitle(posTitle);
  if (!teams) return null;
  const [rawA, rawB] = teams;

  const nhlA = resolveNHLCode(rawA);
  const nhlB = resolveNHLCode(rawB);
  if (nhlA && nhlB) {
    const key = `${nhlA}_${nhlB}`;
    if (todaysGames[`NHL:${key}`]) return { key, sport: 'NHL', side: 'away', awayName: rawA, homeName: rawB };
    const rev = `${nhlB}_${nhlA}`;
    if (todaysGames[`NHL:${rev}`]) return { key: rev, sport: 'NHL', side: 'home', awayName: rawB, homeName: rawA };
  }
  const cbbA = findCBBTeam(cbbMap, rawA);
  const cbbB = findCBBTeam(cbbMap, rawB);
  if (cbbA && cbbB) {
    const key = `${normalize(cbbA)}_${normalize(cbbB)}`;
    if (todaysGames[`CBB:${key}`]) return { key, sport: 'CBB', side: 'away', awayName: cbbA, homeName: cbbB };
    const rev = `${normalize(cbbB)}_${normalize(cbbA)}`;
    if (todaysGames[`CBB:${rev}`]) return { key: rev, sport: 'CBB', side: 'home', awayName: cbbB, homeName: cbbA };
  }
  const mlbA = resolveMLBCode(rawA);
  const mlbB = resolveMLBCode(rawB);
  if (mlbA && mlbB) {
    const key = `${mlbA}_${mlbB}`;
    if (todaysGames[`MLB:${key}`]) return { key, sport: 'MLB', side: 'away', awayName: rawA, homeName: rawB };
    const rev = `${mlbB}_${mlbA}`;
    if (todaysGames[`MLB:${rev}`]) return { key: rev, sport: 'MLB', side: 'home', awayName: rawB, homeName: rawA };
  }
  // WNBA before NBA — shared nicknames (Sun, Sparks, Liberty, …)
  const wnbaA = resolveWNBATeam(rawA);
  const wnbaB = resolveWNBATeam(rawB);
  if (wnbaA && wnbaB) {
    const key = `${wnbaA.toLowerCase()}_${wnbaB.toLowerCase()}`;
    if (todaysGames[`WNBA:${key}`]) return { key, sport: 'WNBA', side: 'away', awayName: rawA, homeName: rawB };
    const rev = `${wnbaB.toLowerCase()}_${wnbaA.toLowerCase()}`;
    if (todaysGames[`WNBA:${rev}`]) return { key: rev, sport: 'WNBA', side: 'home', awayName: rawB, homeName: rawA };
  }
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

function matchSpreadTitle(posTitle, todaysGames, cbbMap) {
  const m = (posTitle || '').match(/^Spread:\s+(.+?)\s*\(([+-]?\d+\.?\d*)\)/i);
  if (!m) return null;
  const teamRaw = m[1].trim();
  const spreadLine = parseFloat(m[2]);
  const WNBA_MAP = Object.fromEntries(
    Object.entries(WNBA_NAME_TO_CODE).map(([k, v]) => [k, String(v).toLowerCase()]),
  );
  const SPORT_MAPS = { NHL: NHL_MAP, WNBA: WNBA_MAP, NBA: NBA_MAP, MLB: MLB_MAP };
  const candidates = [];
  const teamNorm = normalize(teamRaw);
  const words = teamRaw.split(/\s+/).map(w => normalize(w)).filter(w => w.length >= 3);
  for (const [sport, map] of Object.entries(SPORT_MAPS)) {
    let code = null, score = 0;
    if (map[teamNorm]) { code = map[teamNorm]; score = 3; }
    else {
      for (const w of words) {
        if (!map[w]) continue;
        const isCity = ['pittsburgh','detroit','chicago','boston','toronto','minnesota','colorado',
          'philadelphia','washington','seattle','cleveland','houston','dallas','denver','atlanta',
          'miami','milwaukee','cincinnati','oakland','newyork','losangeles','sanfrancisco','sandiego',
          'stlouis','tampabay','kansascity','columbus','nashville','winnipeg','anaheim','calgary',
          'edmonton','vancouver','charlotte','brooklyn','sacramento','portland','memphis',
          'neworleans','sanantonio','oklahomacity','indiana','orlando','utah','florida','carolina',
          'buffalo','ottawa','montreal','texas'].includes(w);
        const newScore = isCity ? 1 : 2;
        if (newScore > score) { code = map[w]; score = newScore; }
      }
    }
    if (!code) continue;
    for (const fullKey of Object.keys(todaysGames)) {
      if (!fullKey.startsWith(sport + ':')) continue;
      const gameKey = fullKey.slice(sport.length + 1);
      if (gameKey.includes(code)) candidates.push({ key: gameKey, sport, spreadLine, score });
    }
  }
  const cbbTeam = findCBBTeam(cbbMap, teamRaw);
  if (cbbTeam) {
    const normTeam = normalize(cbbTeam);
    for (const fullKey of Object.keys(todaysGames)) {
      if (!fullKey.startsWith('CBB:')) continue;
      const gameKey = fullKey.slice(4);
      if (gameKey.includes(normTeam)) candidates.push({ key: gameKey, sport: 'CBB', spreadLine, score: 2 });
    }
  }
  if (candidates.length === 0) return null;
  candidates.sort((a, b) => b.score - a.score);
  return candidates[0];
}

function resolveOutcomeSide(outcome, awayName, homeName, posTitle) {
  if (!outcome) return 'unknown';
  const o = normalize(outcome);
  const nAway = normalize(awayName);
  const nHome = normalize(homeName);
  if (o.includes(nAway) || nAway.includes(o) || o === 'yes') return 'away';
  if (o.includes(nHome) || nHome.includes(o) || o === 'no') return 'home';
  for (const word of (outcome || '').split(/\s+/)) {
    const w = normalize(word);
    if (w.length < 3) continue;
    if (nAway.includes(w)) return 'away';
    if (nHome.includes(w)) return 'home';
  }
  const titleTeams = extractTeamsFromTitle(posTitle);
  if (titleTeams) {
    const firstTeam = normalize(titleTeams[0]);
    if (o === 'yes' || o.includes(firstTeam)) return 'away';
  }
  return 'away';
}

async function fetchWithRetry(url, retries = RETRY_LIMIT) {
  let lastErr = null;
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await httpFetch(url, { headers: { Accept: 'application/json' } });
      if (res.status === 429) {
        const wait = Math.pow(2, i + 1) * 1000;
        await sleep(wait);
        continue;
      }
      if (!res.ok) { lastErr = `${res.status} ${url}`; throw new Error(lastErr); }
      return { ok: true, data: await res.json() };
    } catch (e) {
      lastErr = e.message;
      if (i === retries) return { ok: false, error: lastErr };
      await sleep(1000 * (i + 1));
    }
  }
  return { ok: false, error: lastErr || 'unknown' };
}

function loadJSON(filename) {
  const p = join(PUBLIC, filename);
  if (!existsSync(p)) return null;
  try { return JSON.parse(readFileSync(p, 'utf8')); } catch { return null; }
}

// ─── Wallet covered-set: who did the main scan already pick up? ────────────
// Returns a Set of lowercase full addresses present in any of the three
// scanner output files (ML, spread, total) for today's games.
function collectScannedWallets() {
  const set = new Set();
  for (const f of ['sharp_positions.json', 'sharp_spread_positions.json', 'sharp_total_positions.json']) {
    const data = loadJSON(f);
    if (!data) continue;
    for (const sport of ['NHL', 'CBB', 'MLB', 'NBA', 'SOC', 'UFC', 'WNBA']) {
      const games = data[sport] || {};
      if (typeof games !== 'object') continue;
      for (const g of Object.values(games)) {
        if (!g?.positions) continue;
        for (const pos of g.positions) {
          if (pos.wallet) set.add(String(pos.wallet).toLowerCase());
        }
      }
    }
  }
  return set;
}

// ─── Main ──────────────────────────────────────────────────────────────────
async function run() {
  const startMs = Date.now();
  console.log('=== Whitelist Coverage Scan ===');

  // 1. Load today's games (need polymarket_data.json for game lookup).
  const polyData = loadJSON('polymarket_data.json');
  if (!polyData) {
    console.log('Missing polymarket_data.json — main scanner has not run yet. Aborting (no harm done).');
    return;
  }
  const todaysGames = buildTodaysGames(polyData);
  const cbbMap = loadCBBTeamMap();
  const todayGamesCount = Object.keys(todaysGames).length;
  if (todayGamesCount === 0) {
    console.log('No games today — nothing to scan against. Writing empty diagnostic.');
    writeFileSync(
      join(PUBLIC, 'whitelist_scan_diagnostics.json'),
      JSON.stringify({
        scannedAt: new Date().toISOString(),
        summary: { reason: 'NO_GAMES_TODAY' },
        perWallet: [],
      }, null, 2),
    );
    return;
  }

  // 2. Load promotion whitelist from Firestore. sharpWalletProfiles is the
  //    canonical source: doc IDs are walletShort, and most docs also carry
  //    walletAddress (the full 0x... address) plus byMarket stats we can
  //    derive avgSportBet from when sports_sharps.json doesn't have it.
  const profilesSnap = await db.collection('sharpWalletProfiles').get();
  const whitelist = [];
  const profileByShort = new Map(); // suffix → full profile doc for stats lookup
  profilesSnap.forEach(d => {
    const x = d.data();
    const short = (x.walletShort || d.id || '').toLowerCase();
    profileByShort.set(short, x);
    const bySport = x.bySport || {};
    const anyTier = ['CONFIRMED', 'FLAT', 'WR50']
      .find(t => Object.values(bySport).some(s => s?.whitelistTier === t)) || null;
    if (anyTier) {
      whitelist.push({
        walletShort: short,
        anyTier,
        confirmedSports: x.confirmedSports || [],
        flatSports: x.flatSports || [],
        bySport,
        name: x.name || null,
      });
    }
  });

  // 3. Build the address-resolution map (suffix → full address). Three
  //    sources in priority order: the on-disk JSON files first (so we use
  //    the same addresses the main scanner sees), then sharpWalletProfiles
  //    as a fallback for wallets never written to those JSONs.
  const whaleProfiles = loadJSON('whale_profiles.json') || {};
  const sportsSharps = loadJSON('sports_sharps.json') || {};
  const addrBySuffix = new Map();
  const profileBySuffix = new Map();
  for (const [addr, p] of Object.entries(whaleProfiles)) {
    if (typeof addr !== 'string' || !addr.startsWith('0x')) continue;
    const s = addr.slice(-6).toLowerCase();
    addrBySuffix.set(s, addr.toLowerCase());
    profileBySuffix.set(s, { source: 'whale_profiles', name: p.name, tier: p.tier });
  }
  for (const [addr, p] of Object.entries(sportsSharps)) {
    if (addr === '_meta') continue;
    if (typeof addr !== 'string' || !addr.startsWith('0x')) continue;
    const s = addr.slice(-6).toLowerCase();
    if (!addrBySuffix.has(s)) addrBySuffix.set(s, addr.toLowerCase());
    if (!profileBySuffix.has(s)) profileBySuffix.set(s, { source: 'sports_sharps', name: p.name });
  }
  // Fallback: sharpWalletProfiles.walletAddress closes the gap for whitelisted
  // wallets that aren't in whale_profiles or sports_sharps. With this in place,
  // ADDRESS_NOT_FOUND drops to 0 for any wallet that's been profiled at all.
  for (const [short, p] of profileByShort.entries()) {
    if (addrBySuffix.has(short)) continue;
    const addr = p.walletAddress || p.address || null;
    if (typeof addr !== 'string' || !addr.startsWith('0x')) continue;
    addrBySuffix.set(short, addr.toLowerCase());
    profileBySuffix.set(short, { source: 'sharpWalletProfiles', name: p.name || null });
  }

  // Build a sports_sharps lookup keyed by suffix for stat derivation
  // (the main scanner uses lowercased full-address keys; we already have
  // a suffix index so reuse it here for the avgSportBet path).
  const sportsSharpsBySuffix = new Map();
  for (const [addr, p] of Object.entries(sportsSharps)) {
    if (addr === '_meta') continue;
    if (typeof addr !== 'string' || !addr.startsWith('0x')) continue;
    sportsSharpsBySuffix.set(addr.slice(-6).toLowerCase(), p);
  }

  // Per-wallet stats resolver for the recovered positions. Returns the
  // fields writeSharpActions reads to apply the SHADOW gate + tier scoring.
  // Without these, a recovered position would be silently dropped by
  // writeSharpActions's `if (rawMult < SHADOW_MIN_MULTIPLIER) continue;` —
  // which is exactly the failure mode this whole layer is trying to fix.
  function resolveWalletStats(suffix, sport) {
    const ss = sportsSharpsBySuffix.get(suffix);
    const swp = profileByShort.get(suffix);
    // Source 1: sports_sharps.json — the field the main scanner uses verbatim.
    if (ss?.avgSportBet > 0) {
      return {
        avgSportBet: ss.avgSportBet,
        sportPnlTotal: ss.sportPnlTotal || 0,
        sportROI: ss.sportROI || 0,
        sportVol: ss.sportVol || 0,
        sportVerified: ss.sportVerified ?? true,
        leaderboardRank: ss.leaderboardRank ?? null,
        sportsLbPercentileTop: ss.sportsLbPercentileTop ?? null,
        tier: ss.tier || 'PROVEN',
        totalPnl: ss.totalPnl || 0,
        source: 'sports_sharps',
      };
    }
    // Source 2: derive avgSportBet from sharpWalletProfiles.byMarket. Pick
    // the market that matches the position's market type when possible;
    // otherwise fall back to the wallet's topSport's ML market.
    if (swp) {
      const byMarket = swp.byMarket || {};
      const candidate =
        byMarket.ML?.positions ||
        byMarket.SPREAD?.positions ||
        byMarket.TOTAL?.positions ||
        null;
      const avgBet = (candidate?.invested && candidate?.n)
        ? Math.round(candidate.invested / candidate.n)
        : 0;
      const pc = swp.positionsContext || {};
      return {
        avgSportBet: avgBet,
        sportPnlTotal: pc.sportPnlTotal || 0,
        sportROI: pc.sportROI || 0,
        sportVol: pc.sportVol || 0,
        sportVerified: true,
        leaderboardRank: swp.latestLbRank ?? null,
        sportsLbPercentileTop: pc.sportsLbPercentileTop ?? null,
        tier: swp.tier || 'PROVEN',
        totalPnl: swp.latest?.lifetimePnl || 0,
        source: 'sharpWalletProfiles_derived',
      };
    }
    // Source 3: no profile data at all — return zeros so writeSharpActions
    // drops the position (this matches existing behavior for "unverified"
    // wallets). Mark for diagnostic visibility.
    return {
      avgSportBet: 0,
      sportPnlTotal: 0,
      sportROI: 0,
      sportVol: 0,
      sportVerified: false,
      leaderboardRank: null,
      sportsLbPercentileTop: null,
      tier: 'UNKNOWN',
      totalPnl: 0,
      source: 'none',
    };
  }

  // 4. Cross-reference whitelist against what the main scanner just produced.
  const mainScanned = collectScannedWallets();

  // 5. For each whitelisted wallet, classify and (when missing) supplemental scan.
  const perWallet = [];
  let coveredByMain = 0;
  let recovered = 0;
  let noPositions = 0;
  let addressNotFound = 0;
  let apiError = 0;
  let recoveredPositionsTotal = 0;
  const recoveredAll = []; // Flat list of all recovered positions (for merge step).
  // Supplemental-scan heartbeat — merged into sharp_positions*.json so
  // writeSharpActions can EXITED-stamp wallets the main scan missed.
  const heartbeatOkWallets = new Set();
  const heartbeatOpenAssets = {}; // walletLower → Set<assetId>

  console.log(`Promoted wallets total: ${whitelist.length}`);
  console.log(`Today's games: ${todayGamesCount}`);

  // ── Phase A: parallel supplemental fetch (bounded concurrency) ──────────
  // Only wallets the main scan missed need a network call. We fetch them in a
  // small concurrency pool (each request keeps fetchWithRetry's 429 backoff),
  // then the loop below consumes the cached results — turning ~130 serial
  // 800ms-spaced calls (~2.5 min) into ~30-40s. Wallets covered by the main
  // scan or with no known address are handled with zero network in the loop.
  const fetchedBySuffix = new Map();
  const toFetch = whitelist.filter((w) => {
    const fullAddr = addrBySuffix.get(w.walletShort);
    return fullAddr && !mainScanned.has(fullAddr);
  });
  console.log(`Supplemental fetch: ${toFetch.length} wallet(s) need a network call (concurrency=${SCAN_CONCURRENCY})...`);
  await mapPool(toFetch, SCAN_CONCURRENCY, async (w) => {
    const fullAddr = addrBySuffix.get(w.walletShort);
    const res = await fetchWithRetry(`${DATA_API}/positions?user=${fullAddr}&limit=500`);
    fetchedBySuffix.set(w.walletShort, res);
  });
  console.log('Processing supplemental scan results...\n');

  for (const w of whitelist) {
    const suffix = w.walletShort;
    const fullAddr = addrBySuffix.get(suffix);

    if (fullAddr && mainScanned.has(fullAddr)) {
      coveredByMain++;
      perWallet.push({
        walletShort: suffix,
        tier: w.anyTier,
        name: w.name || profileBySuffix.get(suffix)?.name || null,
        sports: [...new Set([...w.confirmedSports, ...w.flatSports])].join(','),
        status: 'COVERED_BY_MAIN',
      });
      if (VERBOSE) console.log(`  ✓ COVERED_BY_MAIN  ${suffix}  (${w.anyTier})`);
      continue;
    }

    if (!fullAddr) {
      addressNotFound++;
      perWallet.push({
        walletShort: suffix,
        tier: w.anyTier,
        name: w.name || null,
        sports: [...new Set([...w.confirmedSports, ...w.flatSports])].join(','),
        status: 'ADDRESS_NOT_FOUND',
        note: 'no full address in whale_profiles.json or sports_sharps.json — backfill required',
      });
      console.log(`  ⚠️ ADDRESS_NOT_FOUND  ${suffix}  (${w.anyTier})  — needs profile backfill`);
      continue;
    }

    // Supplemental scan result (prefetched in Phase A's concurrency pool).
    const fetched = fetchedBySuffix.get(suffix) || { ok: false, error: 'not prefetched' };

    if (!fetched.ok || !Array.isArray(fetched.data)) {
      apiError++;
      perWallet.push({
        walletShort: suffix,
        tier: w.anyTier,
        name: w.name || profileBySuffix.get(suffix)?.name || null,
        sports: [...new Set([...w.confirmedSports, ...w.flatSports])].join(','),
        status: 'API_ERROR',
        addr: fullAddr,
        error: fetched.error || 'non-array response',
      });
      console.log(`  ✗ API_ERROR        ${suffix}  (${w.anyTier})  — ${fetched.error || 'non-array response'}`);
      continue;
    }

    // Walk wallet's open positions, identify any that match today's games,
    // and build the full position object writeSharpActions expects.
    // Always record a successful fetch into the scan heartbeat (even when
    // nothing matches today) so writeSharpActions can stamp EXITED on
    // previously-open docs for this wallet.
    const wLower = fullAddr.toLowerCase();
    heartbeatOkWallets.add(wLower);
    const assetSet = heartbeatOpenAssets[wLower] || new Set();
    for (const p of fetched.data) {
      if (p?.asset != null && p.asset !== '') assetSet.add(String(p.asset));
    }
    heartbeatOpenAssets[wLower] = assetSet;

    const matched = [];
    for (const pos of fetched.data) {
      const title = pos.title || '';
      let match = matchPositionToGame(title, todaysGames, cbbMap)
        || matchSoccerPositionTitle(title, todaysGames)
        || matchUFCPositionTitle(title, todaysGames)
        || matchWNBAPositionTitle(title, todaysGames);
      let forcedSpread = false;
      if (!match) {
        const sm = matchSpreadTitle(title, todaysGames, cbbMap);
        if (sm) { match = sm; forcedSpread = true; }
        else continue;
      }
      const outcome = pos.outcome || '';
      const outcomeNorm = normalize(outcome);
      const curPrice = parseFloat(pos.curPrice || '0');
      if (curPrice <= 0.01 || curPrice >= 0.99) continue;
      const titleLower = title.toLowerCase();
      const isTotal = ['over', 'under'].includes(outcomeNorm);
      const isSpread = forcedSpread || (!isTotal && (titleLower.includes('spread') || /[+-]\d+\.?\d*/.test(outcome)));
      const marketType = isTotal ? 'total' : isSpread ? 'spread' : 'ml';
      const game = todaysGames[`${match.sport}:${match.key}`];
      let side;
      if (isTotal) {
        side = outcomeNorm === 'over' ? 'over' : 'under';
      } else if (match.sport === 'SOC') {
        // 3-way: side comes from the negRisk market itself + Yes outcome.
        side = resolveSoccerSide(match, outcome, game.away, game.home);
        if (!side) continue;
      } else if (match.sport === 'UFC' && match.side) {
        side = match.side;
      } else {
        side = resolveOutcomeSide(outcome, game.away, game.home, title);
      }

      // ── entryLine extraction (mirrors scanSharpPositions.js) ─────────
      // For spread/total, writeSharpActions reads entryLine to stamp
      // spreadLine/totalLine on the Firestore position doc, which the
      // dashboard uses to render the "Over 218.5" label.
      let entryLine = null;
      const polyGame = polyData?.[match.sport]?.[match.key];
      if (isSpread) {
        const titleLineMatch = title.match(/\(([+-]?\d+\.?\d*)\)/);
        if (titleLineMatch) {
          const titleLine = parseFloat(titleLineMatch[1]);
          const titleTeamMatch = title.match(/^Spread:\s+(.+?)\s*\(/i);
          if (titleTeamMatch) {
            const titleTeamNorm = normalize(titleTeamMatch[1]);
            entryLine = normalize(outcome).includes(titleTeamNorm) || titleTeamNorm.includes(normalize(outcome))
              ? titleLine : -titleLine;
          } else {
            entryLine = titleLine;
          }
        }
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
        // game — full game, F5, alt-lines (O/U 4.5, 5.5, 7.5, 8.5, ...).
        // Trusting polyGame.polyTotal.line first was the wrong call: it
        // pulled whichever sub-market fetchPolymarketData happened to
        // cache, NOT the line this specific wallet bet. Real incident
        // 2026-06-02 wallet 491f30 (tex_stl Under at line 7.5): main
        // scanner correctly stamped entryLine=7.5, this whitelist re-pass
        // then OVERWROTE it with polyTotal.line=4.5 (cache pointed at an
        // alt-line), and the UI shipped "Under 4.5 -110" — a price/line
        // combo that's mathematically impossible as a game total.
        // Mirrors scanSharpPositions.js → use the wallet's own title
        // first (regex captures "O/U 7.5" → 7.5) and only fall back to
        // polyTotal when the title carries no line.
        const totalMatch = title.match(/(?:O\/U|Over|Under|Total)[^\d]*(\d+\.?\d*)/i);
        if (totalMatch) {
          entryLine = parseFloat(totalMatch[1]);
        } else {
          const pt = polyGame?.polyTotal;
          const isGameTotal = pt && (pt.outcomes || []).some(o => /^over$/i.test(o));
          if (isGameTotal) entryLine = pt.line;
        }
      }

      const size = parseFloat(pos.size || '0');
      const avgPrice = parseFloat(pos.avgPrice || '0');
      const cashPnl = parseFloat(pos.cashPnl || '0');
      const invested = Math.round(size * avgPrice);
      const currentValue = Math.round(size * curPrice);

      // Resolve wallet stats so writeSharpActions's SHADOW gate accepts
      // the merged position. avgSportBet=0 here → silently dropped at write.
      const stats = resolveWalletStats(suffix, match.sport);

      // Skip games already commenced (matches the T-15 freeze gate logic
      // in the main scanner: a position first observed post-tipoff is
      // never useful for pre-game consensus).
      if (game.commence && Date.now() >= new Date(game.commence).getTime()) continue;

      matched.push({
        // Game / market fields
        gameKey: match.key,
        sport: match.sport,
        marketType,
        side,
        outcome,
        // Team names from the title-match — used by the merge step when
        // bootstrapping a game entry that the main scanner didn't create.
        awayName: match.awayName || '',
        homeName: match.homeName || '',
        // Position economics
        size: Math.round(size),
        avgPrice: +avgPrice.toFixed(3),
        invested,
        curPrice: +curPrice.toFixed(3),
        currentValue,
        pnl: Math.round(cashPnl),
        // Identity
        wallet: fullAddr,
        walletShort: suffix,
        name: w.name || profileBySuffix.get(suffix)?.name || null,
        // Stats (sources avgSportBet → critical for downstream filter)
        tier: stats.tier,
        totalPnl: stats.totalPnl,
        sportPnl: stats.sportPnlTotal,
        sportPnlTotal: stats.sportPnlTotal,
        sportROI: stats.sportROI,
        sportVerified: stats.sportVerified,
        sportVol: stats.sportVol,
        avgSportBet: stats.avgSportBet,
        leaderboardRank: stats.leaderboardRank,
        sportsLbPercentileTop: stats.sportsLbPercentileTop,
        // Provenance
        firstSeen: new Date().toISOString(),
        statsSource: stats.source,
        recoveredVia: 'whitelist_scan',
        ...(entryLine != null && { entryLine }),
        ...(pos.asset != null && pos.asset !== '' && { asset: String(pos.asset) }),
        ...(pos.conditionId != null && pos.conditionId !== '' && { conditionId: String(pos.conditionId) }),
        ...(pos.outcomeIndex != null && pos.outcomeIndex !== '' && { outcomeIndex: Number(pos.outcomeIndex) }),
        ...(pos.eventId != null && pos.eventId !== '' && { eventId: String(pos.eventId) }),
        title,
      });
    }

    if (matched.length === 0) {
      noPositions++;
      perWallet.push({
        walletShort: suffix,
        tier: w.anyTier,
        name: w.name || profileBySuffix.get(suffix)?.name || null,
        sports: [...new Set([...w.confirmedSports, ...w.flatSports])].join(','),
        status: 'SCANNED_NO_POSITIONS_TODAY',
        addr: fullAddr,
      });
      if (VERBOSE) console.log(`  · SCANNED_NO_POS  ${suffix}  (${w.anyTier})`);
      continue;
    }

    recovered++;
    recoveredPositionsTotal += matched.length;
    recoveredAll.push(...matched);
    const willPass = matched.filter(m => m.avgSportBet > 0 && m.invested / m.avgSportBet >= 0.10).length;
    const willDrop = matched.length - willPass;
    perWallet.push({
      walletShort: suffix,
      tier: w.anyTier,
      name: w.name || profileBySuffix.get(suffix)?.name || null,
      sports: [...new Set([...w.confirmedSports, ...w.flatSports])].join(','),
      status: 'RECOVERED_VIA_WHITELIST_SCAN',
      addr: fullAddr,
      positionsCount: matched.length,
      statsSource: matched[0]?.statsSource || null,
      avgSportBet: matched[0]?.avgSportBet ?? null,
      // Per-position breakdown so we can see exactly how many recovered
      // positions will reach Firestore vs. be dropped by the SHADOW gate.
      // SHADOW gate (writeSharpActions line 505): rawMult >= 0.10 where
      // rawMult = invested / avgSportBet. A small "toe-in" position below
      // that threshold is filtered out as low-conviction — which is the
      // correct behavior, but we want the visibility here.
      willPassShadowGate: willPass,
      willDropAtShadowGate: willDrop,
      positions: matched.map(p => ({
        sport: p.sport, gameKey: p.gameKey, marketType: p.marketType,
        side: p.side, invested: p.invested, entryLine: p.entryLine ?? null,
        passesShadow: p.avgSportBet > 0 && p.invested / p.avgSportBet >= 0.10,
      })),
    });
    const gateNote = willDrop > 0 ? `  (${willPass} reach Firestore, ${willDrop} dropped at SHADOW gate)` : '';
    console.log(`  + RECOVERED        ${suffix}  (${w.anyTier})  — ${matched.length} position(s)${gateNote}`);
  }

  const elapsedSec = ((Date.now() - startMs) / 1000).toFixed(1);
  const totalScanned = coveredByMain + recovered + noPositions; // wallets where we have certainty
  const coveragePct = whitelist.length > 0
    ? Math.round(100 * (coveredByMain + recovered + noPositions) / whitelist.length)
    : 0;

  // ── Summary stdout ──
  console.log('');
  console.log('───────────────────────────────────────────────────────────');
  console.log('  Whitelist coverage summary');
  console.log('───────────────────────────────────────────────────────────');
  console.log(`  Promoted wallets total:          ${whitelist.length}`);
  console.log(`  ✓ Covered by main scan:          ${coveredByMain}`);
  console.log(`  + Recovered (had positions):     ${recovered}  (+${recoveredPositionsTotal} positions on today's games)`);
  console.log(`  · Scanned, no positions today:   ${noPositions}`);
  console.log(`  ✗ API errors after 3 retries:    ${apiError}  ${apiError === 0 ? '✓' : '⚠️'}`);
  console.log(`  ⚠️ Address not found:             ${addressNotFound}  ${addressNotFound === 0 ? '✓' : '(needs profile backfill)'}`);
  console.log(`  Coverage:                        ${totalScanned} / ${whitelist.length}  (${coveragePct}%)`);
  console.log(`  Phase-2 merge:                   ${MERGE ? 'ENABLED (positions WILL be merged into sharp_positions*.json)' : 'OFF (diagnostic only, no downstream change)'}`);
  console.log(`  Elapsed:                         ${elapsedSec}s`);
  console.log('───────────────────────────────────────────────────────────');

  // ── Phase 2: merge recovered positions into the scanner output files ──
  // This is what actually closes the coverage gap — once positions reach
  // sharp_positions*.json, the existing writeSharpActions →
  // sharp_action_positions → syncPickStateAuthoritative pipeline picks
  // them up automatically, no further changes needed.
  let mergeStats = { ml: 0, spread: 0, total: 0, dropped_shadow_gate: 0, dropped_duplicate: 0 };
  if (MERGE && recoveredAll.length > 0) {
    mergeStats = mergeRecoveredIntoScanFiles(recoveredAll, polyData);
    console.log('');
    console.log('Merge results:');
    console.log(`  ML positions merged:        ${mergeStats.ml}`);
    console.log(`  Spread positions merged:    ${mergeStats.spread}`);
    console.log(`  Total positions merged:     ${mergeStats.total}`);
    console.log(`  Dropped (SHADOW gate ahead): ${mergeStats.dropped_shadow_gate}  (avgSportBet=0)`);
    console.log(`  Dropped (MM/trader excluded): ${mergeStats.dropped_excluded || 0}`);
    console.log(`  Dropped (already in file):   ${mergeStats.dropped_duplicate}`);
  } else if (!MERGE) {
    console.log('');
    console.log('Merge skipped (--no-merge flag) — sharp_positions*.json unchanged.');
  }

  // Always merge supplemental heartbeat (even when zero positions recovered)
  // so EXITED detection covers wallets scanned only by the whitelist pass.
  if (MERGE && heartbeatOkWallets.size > 0) {
    const hbMerged = mergeHeartbeatIntoScanFiles(heartbeatOkWallets, heartbeatOpenAssets);
    console.log(`  Heartbeat wallets merged:   ${hbMerged}`);
  }

  // ── Write diagnostic file (atomic) ──
  const diagPath = join(PUBLIC, 'whitelist_scan_diagnostics.json');
  const diagBody = {
    scannedAt: new Date().toISOString(),
    elapsedSec: Number(elapsedSec),
    phase: MERGE ? 'PHASE_2_MERGE_ENABLED' : 'PHASE_1_DIAGNOSTIC_ONLY',
    todayGamesCount,
    summary: {
      total: whitelist.length,
      coveredByMain,
      recovered,
      recoveredPositions: recoveredPositionsTotal,
      noPositions,
      apiError,
      addressNotFound,
      coveragePct,
      merge: mergeStats,
    },
    perWallet,
  };
  atomicWriteJSON(diagPath, diagBody);
  console.log(`Diagnostic written: ${diagPath}`);

  process.exit(0);
}

// ─── Atomic file write with parse-validation ──────────────────────────────
// Phase 2 modifies the same files the main scanner produces, so a corrupt
// write here would break the downstream pipeline for the rest of the
// cycle. Pattern: stringify → write to tmp → parse-verify → rename onto
// target. If anything fails we abort the swap and the original file is
// preserved exactly as the main scanner left it.
function atomicWriteJSON(path, body) {
  const tmp = path + '.tmp';
  writeFileSync(tmp, JSON.stringify(body, null, 2));
  // Parse-verify the written file before swap. If the body is malformed
  // (shouldn't be — but defensive), this throws before we touch `path`.
  JSON.parse(readFileSync(tmp, 'utf8'));
  // POSIX rename is atomic on the same filesystem, which matches all our
  // deployment targets (Linux CI runners + macOS dev).
  renameSync(tmp, path);
}

// ─── Merge recovered positions into scanner output JSON ───────────────────
// Each recovered position is bucketed by marketType into one of the three
// output files. We update both the per-game positions[] array AND the
// summary counters to match what the main scanner would have produced.
//
// Returns: { ml, spread, total, dropped_shadow_gate, dropped_excluded, dropped_duplicate }
function mergeRecoveredIntoScanFiles(positions, polyData) {
  const stats = { ml: 0, spread: 0, total: 0, dropped_shadow_gate: 0, dropped_excluded: 0, dropped_duplicate: 0 };
  // Same list writeSharpActions + Sharp Flow UI drop (MM ∪ clear-trader).
  // Recovering these into sharp_positions*.json recreated the fake "2 proven"
  // / UI-vs-cron census mismatch (e.g. mmExcluded wallet painted as proven).
  let excludedSet = null;
  try {
    const excl = loadJSON('sharp_intel_excluded_wallets.json');
    const xs = Array.isArray(excl?.excluded) ? excl.excluded : [];
    if (xs.length > 0) {
      excludedSet = new Set(xs.map((a) => String(a || '').toLowerCase()).filter(Boolean));
    }
  } catch { /* fail open — merge without exclusion if file unreadable */ }
  const buckets = {
    ml:     { file: 'sharp_positions.json',        positions: [] },
    spread: { file: 'sharp_spread_positions.json', positions: [] },
    total:  { file: 'sharp_total_positions.json',  positions: [] },
  };
  for (const pos of positions) {
    // Don't merge positions that will be dropped by writeSharpActions
    // anyway — that just inflates the file with noise. Better to flag
    // them in the diagnostic so the user knows the coverage gap exists.
    if (!(pos.avgSportBet > 0) || (pos.invested / pos.avgSportBet) < 0.10) {
      stats.dropped_shadow_gate++;
      continue;
    }
    const w = String(pos.wallet || '').toLowerCase();
    if (w && excludedSet?.has(w)) {
      stats.dropped_excluded++;
      continue;
    }
    buckets[pos.marketType]?.positions.push(pos);
  }

  for (const [marketType, bucket] of Object.entries(buckets)) {
    if (bucket.positions.length === 0) continue;
    const path = join(PUBLIC, bucket.file);
    let data = loadJSON(bucket.file);
    if (!data) {
      // If the main scanner didn't produce this file (e.g. no totals
      // today), bootstrap a minimal shape so we can still inject.
      data = { NHL: {}, CBB: {}, MLB: {}, NBA: {}, SOC: {}, UFC: {}, WNBA: {}, _whitelist_bootstrap: true };
    }

    for (const pos of bucket.positions) {
      const sport = pos.sport;
      data[sport] = data[sport] || {};
      if (!data[sport][pos.gameKey]) {
        // Game entry missing entirely (main scanner had no sharps on this
        // game for this market) — create the structure the dashboard
        // and writeSharpActions expect. Team names come from the
        // title-match (most reliable: same source the main scanner uses
        // when it bootstraps), with polyData.commence as a fallback for
        // commence time.
        const polyGame = polyData?.[sport]?.[pos.gameKey];
        data[sport][pos.gameKey] = {
          away: pos.awayName || polyGame?.awayTeam || '',
          home: pos.homeName || polyGame?.homeTeam || '',
          commence: polyGame?.commence || null,
          positions: [],
          summary: marketType === 'total'
            ? { sharpOver: 0, sharpUnder: 0, overInvested: 0, underInvested: 0 }
            : sport === 'SOC'
              ? { sharpAway: 0, sharpHome: 0, sharpDraw: 0, awayInvested: 0, homeInvested: 0, drawInvested: 0 }
              : { sharpAway: 0, sharpHome: 0, awayInvested: 0, homeInvested: 0 },
        };
      } else if (!data[sport][pos.gameKey].away && pos.awayName) {
        // Backfill empty names if the main scanner created the entry but
        // didn't populate teams (rare; just in case).
        data[sport][pos.gameKey].away = pos.awayName;
        data[sport][pos.gameKey].home = pos.homeName;
      }
      const game = data[sport][pos.gameKey];
      // De-dupe: if the main scanner already wrote this exact (wallet, side,
      // marketType) — which shouldn't happen because we only scan wallets
      // NOT in the main output, but defensively check — skip the merge.
      const existing = game.positions.find(p =>
        p.wallet === pos.wallet && p.side === pos.side && (p.marketType || marketType) === marketType,
      );
      if (existing) {
        // Preserve firstSeen from the existing record if we're updating.
        pos.firstSeen = existing.firstSeen || pos.firstSeen;
        // Replace the existing entry to reflect newest size/price/pnl.
        Object.assign(existing, {
          size: pos.size,
          avgPrice: pos.avgPrice,
          invested: pos.invested,
          curPrice: pos.curPrice,
          currentValue: pos.currentValue,
          pnl: pos.pnl,
          recoveredVia: 'whitelist_scan',
          ...(pos.entryLine != null && { entryLine: pos.entryLine }),
          ...(pos.asset != null && { asset: pos.asset }),
          ...(pos.conditionId != null && { conditionId: pos.conditionId }),
          ...(pos.outcomeIndex != null && { outcomeIndex: pos.outcomeIndex }),
          ...(pos.eventId != null && { eventId: pos.eventId }),
        });
        stats.dropped_duplicate++;
        continue;
      }

      // Append the recovered position. Field set matches what the main
      // scanner writes so writeSharpActions can't tell them apart.
      const out = {
        wallet: pos.wallet,
        name: pos.name,
        tier: pos.tier,
        totalPnl: pos.totalPnl,
        sportPnlTotal: pos.sportPnlTotal,
        outcome: pos.outcome,
        side: pos.side,
        marketType: pos.marketType,
        size: pos.size,
        avgPrice: pos.avgPrice,
        invested: pos.invested,
        curPrice: pos.curPrice,
        currentValue: pos.currentValue,
        pnl: pos.pnl,
        firstSeen: pos.firstSeen,
        sportPnl: pos.sportPnl,
        sportVerified: pos.sportVerified,
        sportROI: pos.sportROI,
        avgSportBet: pos.avgSportBet,
        leaderboardRank: pos.leaderboardRank,
        sportsLbPercentileTop: pos.sportsLbPercentileTop,
        sportVol: pos.sportVol,
        recoveredVia: 'whitelist_scan',
        ...(pos.entryLine != null && { entryLine: pos.entryLine }),
        ...(pos.asset != null && { asset: pos.asset }),
        ...(pos.conditionId != null && { conditionId: pos.conditionId }),
        ...(pos.outcomeIndex != null && { outcomeIndex: pos.outcomeIndex }),
        ...(pos.eventId != null && { eventId: pos.eventId }),
      };
      game.positions.push(out);
      // Update summary counters.
      if (marketType === 'total') {
        if (pos.side === 'over') { game.summary.sharpOver++; game.summary.overInvested += pos.invested; }
        else                     { game.summary.sharpUnder++; game.summary.underInvested += pos.invested; }
      } else {
        if (pos.side === 'away')      { game.summary.sharpAway++; game.summary.awayInvested += pos.invested; }
        else if (pos.side === 'draw') { game.summary.sharpDraw = (game.summary.sharpDraw || 0) + 1; game.summary.drawInvested = (game.summary.drawInvested || 0) + pos.invested; }
        else                          { game.summary.sharpHome++; game.summary.homeInvested += pos.invested; }
      }
      stats[marketType]++;
    }

    // Recompute summary FROM positions — incremental side-counter updates
    // left totalInvested stale after merges (e.g. WNBA nyl_dal $20.3K summary
    // vs $31.3K sum of positions) and missed invested changes on duplicates.
    for (const sportGames of Object.values(data)) {
      if (!sportGames || typeof sportGames !== 'object') continue;
      for (const game of Object.values(sportGames)) {
        if (!game?.positions) continue;
        if (marketType === 'total') {
          let sharpOver = 0, sharpUnder = 0, overInvested = 0, underInvested = 0;
          for (const p of game.positions) {
            if (p.side === 'over') { sharpOver++; overInvested += p.invested || 0; }
            else { sharpUnder++; underInvested += p.invested || 0; }
          }
          game.summary = {
            ...(game.summary || {}),
            sharpOver, sharpUnder, overInvested, underInvested,
            totalInvested: overInvested + underInvested,
            consensus: overInvested > underInvested ? 'over'
              : underInvested > overInvested ? 'under' : null,
          };
        } else {
          let sharpAway = 0, sharpHome = 0, sharpDraw = 0;
          let awayInvested = 0, homeInvested = 0, drawInvested = 0;
          for (const p of game.positions) {
            if (p.side === 'away') { sharpAway++; awayInvested += p.invested || 0; }
            else if (p.side === 'draw') { sharpDraw++; drawInvested += p.invested || 0; }
            else { sharpHome++; homeInvested += p.invested || 0; }
          }
          game.summary = {
            ...(game.summary || {}),
            sharpAway, sharpHome, ...(sharpDraw ? { sharpDraw } : {}),
            awayInvested, homeInvested, ...(drawInvested ? { drawInvested } : {}),
            totalInvested: awayInvested + homeInvested + drawInvested,
            consensus: (awayInvested > homeInvested && awayInvested > drawInvested) ? 'away'
              : (homeInvested > awayInvested && homeInvested > drawInvested) ? 'home'
              : (drawInvested > awayInvested && drawInvested > homeInvested) ? 'draw'
              : null,
          };
        }
      }
    }

    atomicWriteJSON(path, data);
  }
  return stats;
}

// Merge supplemental-scan heartbeat into scan_heartbeat.json (standalone file —
// the heartbeat no longer ships inside the three position files the browser
// downloads). Returns number of wallets newly added to okWallets.
function mergeHeartbeatIntoScanFiles(okWallets, openAssets) {
  if (!okWallets?.size) return 0;
  // Legacy fallback: read embedded heartbeat if the standalone file predates
  // the split (one transition cycle only).
  const hb = loadJSON('scan_heartbeat.json')
    || loadJSON('sharp_positions.json')?.scanHeartbeat
    || { scannedAt: new Date().toISOString(), okWallets: [], openAssets: {} };
  const okSet = new Set(Array.isArray(hb.okWallets) ? hb.okWallets.map((w) => String(w).toLowerCase()) : []);
  const assetsMap = hb.openAssets && typeof hb.openAssets === 'object' ? { ...hb.openAssets } : {};
  let added = 0;
  for (const w of okWallets) {
    const wl = String(w).toLowerCase();
    if (!okSet.has(wl)) {
      okSet.add(wl);
      added++;
    }
    const incoming = openAssets[wl];
    const prev = new Set(Array.isArray(assetsMap[wl]) ? assetsMap[wl] : []);
    if (incoming instanceof Set) {
      for (const a of incoming) prev.add(a);
    } else if (Array.isArray(incoming)) {
      for (const a of incoming) prev.add(a);
    }
    assetsMap[wl] = [...prev];
  }
  atomicWriteJSON(join(PUBLIC, 'scan_heartbeat.json'), {
    scannedAt: hb.scannedAt || new Date().toISOString(),
    okWallets: [...okSet],
    openAssets: assetsMap,
    whitelistMergedAt: new Date().toISOString(),
  });
  return added;
}

run().catch(e => {
  console.error('scanWhitelistedWallets failed:', e);
  process.exit(1);
});
