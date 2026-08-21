/**
 * gradeSharpActions.js — Grade Today's Action positions with game results
 *
 * Queries PENDING positions from `sharp_action_positions`, plus EXITED
 * tickets that were still on after first pitch (asset dropped from the
 * scan once the market resolved). Pre-game exits stay ungraded.
 * Fetches finals from NHL API / ESPN / NCAA, then grades WIN / LOSS / PUSH.
 *
 * Also captures closing Pinnacle odds from pinnacle_history.json for CLV.
 *
 * Usage: node scripts/gradeSharpActions.js
 * Schedule: run every 30 min (after games finish)
 */

import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { execFileSync } from 'child_process';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';
import { resolveSOCTeam } from './lib/soccerTeams.js';
import {
  resolveUFCFighter,
  fightersMatch,
  isGradableUFCMainML,
} from './lib/ufcFighters.js';
import { resolveWNBATeam, wnbaTeamsMatch } from './lib/wnbaTeams.js';
import { resolveNFLTeam, nflTeamsMatch } from './lib/nflTeams.js';
import { captureTicketTape, applyActionTicketTape, hoursUntilMs } from '../src/lib/ticketTapeCapture.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, '../public');
const COLLECTION = 'sharp_action_positions';

const NHL_SCHEDULE_URL = 'https://api-web.nhle.com/v1/schedule';
const NCAA_API_URL = 'https://ncaa-api.henrygd.me/scoreboard/basketball-men/d1';
const ESPN_MLB_URL = 'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard';
const STATSAPI_MLB_URL = 'https://statsapi.mlb.com/api/v1/schedule';
const ESPN_NBA_URL = 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard';
const ESPN_WNBA_URL = 'https://site.api.espn.com/apis/site/v2/sports/basketball/wnba/scoreboard';
const ESPN_NFL_URL = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard';
const ESPN_SOC_URLS = [
  'https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard',
  'https://site.api.espn.com/apis/site/v2/sports/soccer/esp.1/scoreboard',
];
const ESPN_UFC_URL = 'https://site.api.espn.com/apis/site/v2/sports/mma/ufc/scoreboard';
// ESPN 403s Node's default fetch UA and browser Chrome UAs.
// `curl/8.x` is what their scoreboard currently allows (confirmed 2026-08-21).
const ESPN_HEADERS = {
  'User-Agent': 'curl/8.7.1',
  'Accept': 'application/json',
};

const _espnCache = new Map();

function looksLikeEspnScoreboard(data) {
  return !!(data && (Array.isArray(data.events) || Array.isArray(data.leagues)));
}

async function espnJson(url) {
  if (_espnCache.has(url)) return _espnCache.get(url);
  let data = null;
  try {
    const res = await fetch(url, { headers: ESPN_HEADERS });
    if (res.ok) {
      const parsed = await res.json();
      if (looksLikeEspnScoreboard(parsed)) data = parsed;
      else console.warn(`ESPN unexpected JSON ${url}`);
    } else {
      console.warn(`ESPN HTTP ${res.status} ${url}`);
    }
  } catch (e) {
    console.warn(`ESPN fetch error: ${e.message}`);
  }
  if (!data) {
    try {
      const raw = execFileSync('curl', [
        '-sS', '-f', '-L', '--max-time', '20',
        '-A', ESPN_HEADERS['User-Agent'],
        url,
      ], {
        encoding: 'utf8',
        timeout: 25000,
      });
      const parsed = JSON.parse(raw);
      if (looksLikeEspnScoreboard(parsed)) data = parsed;
      else console.warn(`ESPN curl unexpected JSON ${url}`);
    } catch (e) {
      console.warn(`ESPN curl fallback failed: ${e.message}`);
    }
  }
  if (data) _espnCache.set(url, data);
  return data;
}

function recentScoreboardDates(dateSet) {
  const floor = etDateMinusDays(2);
  const keep = [...dateSet].filter((d) => d && String(d) >= floor);
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
  const yday = etDateMinusDays(1);
  if (!keep.includes(today)) keep.push(today);
  if (!keep.includes(yday)) keep.push(yday);
  return keep;
}

const ABBREV_MAP = {
  bos: 'BOS', tor: 'TOR', mtl: 'MTL', ott: 'OTT', buf: 'BUF', det: 'DET',
  tbl: 'TBL', fla: 'FLA', car: 'CAR', wsh: 'WSH', pit: 'PIT', phi: 'PHI',
  njd: 'NJD', cbj: 'CBJ', nsh: 'NSH', wpg: 'WPG', chi: 'CHI', min: 'MIN',
  dal: 'DAL', stl: 'STL', col: 'COL', uta: 'UTA', vgk: 'VGK', lak: 'LAK',
  ana: 'ANA', sjs: 'SJS', cgy: 'CGY', edm: 'EDM', van: 'VAN', sea: 'SEA',
  nyr: 'NYR', nyi: 'NYI',
};

const ESPN_MLB_TO_CODE = {
  ARI: 'ari', ATL: 'atl', BAL: 'bal', BOS: 'bos', CHC: 'chc', CWS: 'cws',
  CIN: 'cin', CLE: 'cle', COL: 'col', DET: 'det', HOU: 'hou', KC: 'kcr',
  LAA: 'laa', LAD: 'lad', MIA: 'mia', MIL: 'mil', MIN: 'min', NYM: 'nym',
  NYY: 'nyy', OAK: 'oak', ATH: 'oak', PHI: 'phi', PIT: 'pit', SD: 'sdp', SF: 'sfg',
  SEA: 'sea', STL: 'stl', TB: 'tbr', TEX: 'tex', TOR: 'tor', WSH: 'wsh',
};

const STATSAPI_MLB_TO_CODE = {
  ARI: 'ari', AZ: 'ari', ATL: 'atl', BAL: 'bal', BOS: 'bos', CHC: 'chc', CWS: 'cws',
  CIN: 'cin', CLE: 'cle', COL: 'col', DET: 'det', HOU: 'hou', KC: 'kcr',
  LAA: 'laa', LAD: 'lad', MIA: 'mia', MIL: 'mil', MIN: 'min', NYM: 'nym',
  NYY: 'nyy', OAK: 'oak', ATH: 'oak', PHI: 'phi', PIT: 'pit', SD: 'sdp',
  SF: 'sfg', SEA: 'sea', STL: 'stl', TB: 'tbr', TEX: 'tex', TOR: 'tor', WSH: 'wsh',
};

const ESPN_NBA_TO_CODE = {
  ATL: 'atl', BOS: 'bos', BKN: 'bkn', CHA: 'cha', CHI: 'chi', CLE: 'cle',
  DAL: 'dal', DEN: 'den', DET: 'det', GS: 'gsw', HOU: 'hou', IND: 'ind',
  LAC: 'lac', LAL: 'lal', MEM: 'mem', MIA: 'mia', MIL: 'mil', MIN: 'min',
  NO: 'nop', NY: 'nyk', NYK: 'nyk', OKC: 'okc', ORL: 'orl', PHI: 'phi',
  PHX: 'phx', POR: 'por', SAC: 'sac', SA: 'sas', SAS: 'sas', TOR: 'tor',
  UTAH: 'uth', UTA: 'uth', WAS: 'was', WSH: 'was',
  GSW: 'gsw', NOP: 'nop',
};

// ESPN WNBA abbreviation → our lowercased codes (never reuse NBA_MAP).
const ESPN_WNBA_TO_CODE = {
  ATL: 'atl', CHI: 'chi', CON: 'con', DAL: 'dal', GS: 'gsv', GSV: 'gsv',
  IND: 'ind', LV: 'lva', LVA: 'lva', LA: 'las', LAS: 'las', MIN: 'min',
  NY: 'nyl', NYL: 'nyl', PHX: 'pho', PHO: 'pho', POR: 'por', SEA: 'sea',
  TOR: 'tor', WAS: 'was', WSH: 'was',
};

// ESPN NFL abbreviation → our lowercased codes (never reuse NBA/MLB maps).
const ESPN_NFL_TO_CODE = {
  ARI: 'ari', ATL: 'atl', BAL: 'bal', BUF: 'buf', CAR: 'car', CHI: 'chi',
  CIN: 'cin', CLE: 'cle', DAL: 'dal', DEN: 'den', DET: 'det', GB: 'gb',
  HOU: 'hou', IND: 'ind', JAC: 'jax', JAX: 'jax', KC: 'kc', LV: 'lv',
  LAC: 'lac', LAR: 'lar', MIA: 'mia', MIN: 'min', NE: 'ne', NO: 'no',
  NYG: 'nyg', NYJ: 'nyj', PHI: 'phi', PIT: 'pit', SEA: 'sea', SF: 'sf',
  TB: 'tb', TEN: 'ten', WAS: 'was', WSH: 'was',
};

function initFirebase() {
  if (!admin.apps.length) {
    const sakPath = join(__dirname, '../serviceAccountKey.json');
    if (existsSync(sakPath)) {
      admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(sakPath, 'utf8'))) });
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
  db.settings({ ignoreUndefinedProperties: true });
  return db;
}

function impliedProb(odds) {
  if (!odds || odds === 0) return null;
  return odds < 0 ? Math.abs(odds) / (Math.abs(odds) + 100) : 100 / (odds + 100);
}

function normalizeName(s) {
  return (s || '').toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\bsaint\b/g, 'st')
    .replace(/\bstate\b/g, 'st')
    .replace(/\s+/g, '')
    .trim();
}

function teamNamesMatch(a, b) {
  const na = normalizeName(a);
  const nb = normalizeName(b);
  if (!na || !nb) return false;
  if (na === nb) return true;
  const shorter = na.length <= nb.length ? na : nb;
  const longer = na.length <= nb.length ? nb : na;
  if (shorter.length >= 4 && longer.startsWith(shorter)) return true;
  if (shorter.length >= 5 && longer.includes(shorter)) {
    if (shorter.length / longer.length >= 0.4) return true;
  }
  return false;
}

// ─── Score fetchers ──────────────────────────────────────────────────────────

async function fetchNHLFinalGames(dateStr) {
  try {
    const res = await fetch(`${NHL_SCHEDULE_URL}/${dateStr}`);
    if (!res.ok) return [];
    const data = await res.json();
    const games = [];
    for (const day of data.gameWeek || []) {
      for (const g of day.games || []) {
        if (g.gameState !== 'OFF' && g.gameState !== 'FINAL') continue;
        const away = ABBREV_MAP[g.awayTeam?.abbrev?.toLowerCase()] || g.awayTeam?.abbrev;
        const home = ABBREV_MAP[g.homeTeam?.abbrev?.toLowerCase()] || g.homeTeam?.abbrev;
        games.push({
          awayTeam: away, homeTeam: home,
          awayScore: g.awayTeam?.score || 0, homeScore: g.homeTeam?.score || 0,
        });
      }
    }
    return games;
  } catch (e) {
    console.error('NHL fetch error:', e.message);
    return [];
  }
}

async function fetchNCAAFinalGames(dateStr) {
  try {
    const formatted = dateStr.replace(/-/g, '/');
    const res = await fetch(`${NCAA_API_URL}/${formatted}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.games || [])
      .filter(g => g.game?.gameState === 'final')
      .map(g => ({
        awayTeam: g.game.away?.names?.short || '',
        homeTeam: g.game.home?.names?.short || '',
        awayScore: parseInt(g.game.away?.score) || 0,
        homeScore: parseInt(g.game.home?.score) || 0,
      }));
  } catch (e) {
    console.error('NCAA fetch error:', e.message);
    return [];
  }
}

// ET calendar date of an ESPN event ('YYYY-MM-DD'), or null when the event
// carries no timestamp. Positions are keyed by ET game date, so finals must
// be matched on the same calendar.
function espnEventDateET(e) {
  if (!e?.date) return null;
  const d = new Date(e.date);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}

async function fetchMLBFinalsFromStatsApi(dateStr) {
  if (!dateStr) return [];
  try {
    const url = `${STATSAPI_MLB_URL}?sportId=1&date=${dateStr}&hydrate=linescore,team`;
    const res = await fetch(url, { headers: { 'User-Agent': 'nhl-savant' } });
    if (!res.ok) {
      console.warn(`MLB StatsAPI HTTP ${res.status} for ${dateStr}`);
      return [];
    }
    const data = await res.json();
    const games = [];
    for (const day of data.dates || []) {
      const dateET = day.date || dateStr;
      for (const g of day.games || []) {
        const st = String(g.status?.detailedState || '');
        if (!/Final|Game Over|Completed/i.test(st)) continue;
        const away = g.teams?.away;
        const home = g.teams?.home;
        const awayAbbr = away?.team?.abbreviation || '';
        const homeAbbr = home?.team?.abbreviation || '';
        games.push({
          dateET,
          awayCode: STATSAPI_MLB_TO_CODE[awayAbbr] || awayAbbr.toLowerCase(),
          homeCode: STATSAPI_MLB_TO_CODE[homeAbbr] || homeAbbr.toLowerCase(),
          awayTeam: away?.team?.name || awayAbbr,
          homeTeam: home?.team?.name || homeAbbr,
          awayScore: parseInt(away?.score, 10) || 0,
          homeScore: parseInt(home?.score, 10) || 0,
        });
      }
    }
    return games;
  } catch (e) {
    console.warn(`MLB StatsAPI error: ${e.message}`);
    return [];
  }
}

async function fetchMLBFinalGames(dateStr) {
  try {
    const ymd = dateStr ? `?dates=${String(dateStr).replace(/-/g, '')}` : '';
    const data = await espnJson(`${ESPN_MLB_URL}${ymd}`);
    const espnGames = !data ? [] : (data.events || [])
      .filter(e => {
        const st = e.competitions?.[0]?.status?.type;
        return st?.state === 'post' || st?.completed;
      })
      .map(e => {
        const comp = e.competitions[0];
        const comps = comp.competitors || [];
        const away = comps.find(c => c.homeAway === 'away') || {};
        const home = comps.find(c => c.homeAway === 'home') || {};
        return {
          dateET: espnEventDateET(e),
          awayCode: ESPN_MLB_TO_CODE[away.team?.abbreviation] || away.team?.abbreviation?.toLowerCase(),
          homeCode: ESPN_MLB_TO_CODE[home.team?.abbreviation] || home.team?.abbreviation?.toLowerCase(),
          awayTeam: away.team?.displayName || '',
          homeTeam: home.team?.displayName || '',
          awayScore: parseInt(away.score) || 0,
          homeScore: parseInt(home.score) || 0,
        };
      });
    if (espnGames.length) return espnGames;
  } catch (e) {
    console.error('ESPN MLB fetch error:', e.message);
  }
  const stats = await fetchMLBFinalsFromStatsApi(dateStr);
  if (stats.length) console.log(`  MLB StatsAPI fallback: ${stats.length} finals for ${dateStr || 'undated'}`);
  return stats;
}

async function fetchNBAFinalGames(dateStr) {
  try {
    const ymd = dateStr ? `?dates=${String(dateStr).replace(/-/g, '')}` : '';
    const data = await espnJson(`${ESPN_NBA_URL}${ymd}`);
    if (!data) return [];
    return (data.events || [])
      .filter(e => {
        const st = e.competitions?.[0]?.status?.type;
        return st?.state === 'post' || st?.completed;
      })
      .map(e => {
        const comp = e.competitions[0];
        const comps = comp.competitors || [];
        const away = comps.find(c => c.homeAway === 'away') || {};
        const home = comps.find(c => c.homeAway === 'home') || {};
        return {
          dateET: espnEventDateET(e),
          awayCode: ESPN_NBA_TO_CODE[away.team?.abbreviation] || away.team?.abbreviation?.toLowerCase(),
          homeCode: ESPN_NBA_TO_CODE[home.team?.abbreviation] || home.team?.abbreviation?.toLowerCase(),
          awayTeam: away.team?.displayName || '',
          homeTeam: home.team?.displayName || '',
          awayScore: parseInt(away.score) || 0,
          homeScore: parseInt(home.score) || 0,
        };
      });
  } catch (e) {
    console.error('ESPN NBA fetch error:', e.message);
    return [];
  }
}

async function fetchWNBAFinalGames(dateStr) {
  try {
    const ymd = dateStr ? `?dates=${String(dateStr).replace(/-/g, '')}` : '';
    const data = await espnJson(`${ESPN_WNBA_URL}${ymd}`);
    if (!data) return [];
    return (data.events || [])
      .filter(e => {
        const st = e.competitions?.[0]?.status?.type;
        return st?.state === 'post' || st?.completed;
      })
      .map(e => {
        const comp = e.competitions[0];
        const comps = comp.competitors || [];
        const away = comps.find(c => c.homeAway === 'away') || {};
        const home = comps.find(c => c.homeAway === 'home') || {};
        const awayAbbr = away.team?.abbreviation || '';
        const homeAbbr = home.team?.abbreviation || '';
        const awayName = away.team?.displayName || '';
        const homeName = home.team?.displayName || '';
        return {
          dateET: espnEventDateET(e),
          awayCode: ESPN_WNBA_TO_CODE[awayAbbr]
            || (resolveWNBATeam(awayName) || '').toLowerCase()
            || awayAbbr.toLowerCase(),
          homeCode: ESPN_WNBA_TO_CODE[homeAbbr]
            || (resolveWNBATeam(homeName) || '').toLowerCase()
            || homeAbbr.toLowerCase(),
          awayTeam: awayName,
          homeTeam: homeName,
          awayScore: parseInt(away.score) || 0,
          homeScore: parseInt(home.score) || 0,
        };
      });
  } catch (e) {
    console.error('ESPN WNBA fetch error:', e.message);
    return [];
  }
}

function mapEspnNflEvent(e) {
  const st = e.competitions?.[0]?.status?.type;
  if (!(st?.state === 'post' || st?.completed || String(st?.name || '').startsWith('STATUS_FINAL'))) {
    return null;
  }
  const comp = e.competitions[0];
  const comps = comp.competitors || [];
  const away = comps.find(c => c.homeAway === 'away') || {};
  const home = comps.find(c => c.homeAway === 'home') || {};
  const awayAbbr = away.team?.abbreviation || '';
  const homeAbbr = home.team?.abbreviation || '';
  const awayName = away.team?.displayName || '';
  const homeName = home.team?.displayName || '';
  return {
    dateET: espnEventDateET(e),
    awayCode: ESPN_NFL_TO_CODE[awayAbbr]
      || (resolveNFLTeam(awayName) || '').toLowerCase()
      || awayAbbr.toLowerCase(),
    homeCode: ESPN_NFL_TO_CODE[homeAbbr]
      || (resolveNFLTeam(homeName) || '').toLowerCase()
      || homeAbbr.toLowerCase(),
    awayTeam: awayName,
    homeTeam: homeName,
    awayScore: parseInt(away.score) || 0,
    homeScore: parseInt(home.score) || 0,
  };
}

let _oddsNflCache = null;

async function fetchNFLFinalsFromOddsApi() {
  if (_oddsNflCache) return _oddsNflCache;
  const key = process.env.ODDS_API_KEY;
  if (!key) {
    _oddsNflCache = [];
    return _oddsNflCache;
  }
  const out = [];
  const seen = new Set();
  for (const sportKey of ['americanfootball_nfl_preseason', 'americanfootball_nfl']) {
    try {
      const url = `https://api.the-odds-api.com/v4/sports/${sportKey}/scores/?daysFrom=3&apiKey=${key}`;
      const res = await fetch(url, { headers: { 'User-Agent': 'nhl-savant-grader/1.0' } });
      if (!res.ok) {
        console.warn(`Odds API NFL scores HTTP ${res.status} (${sportKey})`);
        continue;
      }
      const data = await res.json();
      for (const g of Array.isArray(data) ? data : []) {
        if (!g?.completed || !Array.isArray(g.scores)) continue;
        const awayName = g.away_team || '';
        const homeName = g.home_team || '';
        const awayScore = parseInt(g.scores.find(s => s.name === awayName)?.score, 10);
        const homeScore = parseInt(g.scores.find(s => s.name === homeName)?.score, 10);
        if (!Number.isFinite(awayScore) || !Number.isFinite(homeScore)) continue;
        const dateET = g.commence_time
          ? new Date(g.commence_time).toLocaleDateString('en-CA', { timeZone: 'America/New_York' })
          : null;
        const row = {
          dateET,
          awayCode: (resolveNFLTeam(awayName) || '').toLowerCase(),
          homeCode: (resolveNFLTeam(homeName) || '').toLowerCase(),
          awayTeam: awayName,
          homeTeam: homeName,
          awayScore,
          homeScore,
        };
        if (!row.awayCode || !row.homeCode) continue;
        const k = `${row.dateET || ''}|${row.awayCode}|${row.homeCode}`;
        if (seen.has(k)) continue;
        seen.add(k);
        out.push(row);
      }
    } catch (e) {
      console.warn(`Odds API NFL scores error (${sportKey}): ${e.message}`);
    }
  }
  _oddsNflCache = out;
  if (out.length) console.log(`Odds API NFL scores: ${out.length} completed`);
  return out;
}

async function fetchNFLFinalGames(dateStr) {
  try {
    const ymd = dateStr ? String(dateStr).replace(/-/g, '') : '';
    const urls = ymd
      ? [
        `${ESPN_NFL_URL}?dates=${ymd}`,
        `${ESPN_NFL_URL}?dates=${ymd}&seasontype=1`,
        `${ESPN_NFL_URL}?dates=${ymd}&seasontype=2`,
      ]
      : [ESPN_NFL_URL, `${ESPN_NFL_URL}?seasontype=1`];
    const seen = new Set();
    const out = [];
    for (const url of urls) {
      const data = await espnJson(url);
      for (const e of data?.events || []) {
        const g = mapEspnNflEvent(e);
        if (!g || !g.awayCode || !g.homeCode) continue;
        const k = `${g.dateET || ''}|${g.awayCode}|${g.homeCode}`;
        if (seen.has(k)) continue;
        seen.add(k);
        out.push(g);
      }
      if (out.length) break;
    }
    if (!out.length) {
      const odds = await fetchNFLFinalsFromOddsApi();
      return dateStr ? odds.filter(g => g.dateET === dateStr) : odds;
    }
    return out;
  } catch (e) {
    console.error('ESPN NFL fetch error:', e.message);
    return [];
  }
}

async function fetchSOCFinalGames(dateStr) {
  // EPL (eng.1) + La Liga (esp.1). Polymarket 3-way match markets resolve on
  // the 90-minute result. League games are almost always STATUS_FULL_TIME;
  // cup extra-time still flags wentBeyond90 so we grade a DRAW.
  const ymd = dateStr ? `?dates=${dateStr.replace(/-/g, '')}` : '';
  const out = [];
  for (const base of ESPN_SOC_URLS) {
    try {
      const data = await espnJson(`${base}${ymd}`);
      if (!data) continue;
      for (const e of data.events || []) {
        const st = e.competitions?.[0]?.status?.type;
        if (!(st?.state === 'post' || st?.completed)) continue;
        const comp = e.competitions[0];
        const comps = comp.competitors || [];
        const away = comps.find(c => c.homeAway === 'away') || {};
        const home = comps.find(c => c.homeAway === 'home') || {};
        const awayName = away.team?.displayName || away.team?.name || '';
        const homeName = home.team?.displayName || home.team?.name || '';
        const stName = comp.status?.type?.name || '';
        const wentBeyond90 = stName === 'STATUS_FINAL_AET' || stName === 'STATUS_FINAL_PEN';
        out.push({
          awayCode: (resolveSOCTeam(awayName) || '').toLowerCase(),
          homeCode: (resolveSOCTeam(homeName) || '').toLowerCase(),
          awayTeam: awayName,
          homeTeam: homeName,
          awayScore: parseInt(away.score) || 0,
          homeScore: parseInt(home.score) || 0,
          wentBeyond90,
        });
      }
    } catch (e) {
      console.error('ESPN SOC fetch error:', e.message);
    }
  }
  return out;
}

/**
 * UFC fight card via ESPN MMA scoreboard.
 * One ESPN event = full card; each competition = one bout.
 * Competitors use athlete.displayName; homeAway is usually null — order is
 * arbitrary, so findMatchingGame must flip. Winner is competitor.winner
 * (boolean), mapped to synthetic 1/0 scores for the shared ML grader.
 * No Contest (neither winner) is skipped — stay PENDING.
 */
async function fetchUFCFinalFights(dateStr) {
  try {
    const ymd = dateStr ? `?dates=${dateStr.replace(/-/g, '')}` : '';
    const data = await espnJson(`${ESPN_UFC_URL}${ymd}`);
    if (!data) return [];
    const fights = [];
    for (const ev of data.events || []) {
      const cardDateET = espnEventDateET(ev);
      for (const comp of ev.competitions || []) {
        const st = comp.status?.type;
        const name = st?.name || '';
        if (name.startsWith('STATUS_POSTPONED') || name.startsWith('STATUS_CANCELED')
          || name.startsWith('STATUS_CANCELLED') || name.startsWith('STATUS_SUSPENDED')) {
          continue;
        }
        if (st?.state !== 'post' && !st?.completed && !name.startsWith('STATUS_FINAL')) continue;
        const comps = comp.competitors || [];
        if (comps.length < 2) continue;
        const fighterName = (c) => c.athlete?.displayName || c.team?.displayName || c.team?.name || '';
        const f0 = fighterName(comps[0]);
        const f1 = fighterName(comps[1]);
        const w0 = comps[0].winner === true;
        const w1 = comps[1].winner === true;
        if (!w0 && !w1) continue; // NC / no decisive result — do not invent a grade
        const code0 = resolveUFCFighter(f0);
        const code1 = resolveUFCFighter(f1);
        if (!code0 || !code1) continue;
        const boutDate = espnEventDateET(comp) || cardDateET;
        fights.push({
          dateET: boutDate,
          awayCode: code0,
          homeCode: code1,
          awayFighter: f0,
          homeFighter: f1,
          awayTeam: f0,
          homeTeam: f1,
          awayScore: w0 ? 1 : 0,
          homeScore: w1 ? 1 : 0,
        });
      }
    }
    return fights;
  } catch (e) {
    console.error('ESPN UFC fetch error:', e.message);
    return [];
  }
}

// ─── Outcome calculation (mirrors betTracking.js) ───────────────────────────

function calculateOutcome(game, marketType, side, line, sport = null) {
  const totalScore = game.awayScore + game.homeScore;
  const awayWin = game.awayScore > game.homeScore;
  const homeWin = game.homeScore > game.awayScore;

  if (marketType === 'TOTAL') {
    if (!line) return null;
    if (side === 'over') {
      if (totalScore > line) return 'WIN';
      if (totalScore < line) return 'LOSS';
      return 'PUSH';
    } else {
      if (totalScore < line) return 'WIN';
      if (totalScore > line) return 'LOSS';
      return 'PUSH';
    }
  }

  if (marketType === 'SPREAD') {
    if (line == null) return null;
    if (side === 'home') {
      const adjusted = (game.homeScore - game.awayScore) + line;
      if (adjusted > 0) return 'WIN';
      if (adjusted < 0) return 'LOSS';
      return 'PUSH';
    } else {
      const adjusted = (game.awayScore - game.homeScore) + line;
      if (adjusted > 0) return 'WIN';
      if (adjusted < 0) return 'LOSS';
      return 'PUSH';
    }
  }

  // ML — soccer is 3-way: Draw is its own side, so a drawn match is a LOSS
  // for team-side bets and a WIN for draw-side bets (never a PUSH).
  //
  // Knockout correctness: Polymarket's 3-way match market resolves on the
  // 90-minute result. A World Cup game that reached extra time or penalties
  // (game.wentBeyond90) was level at 90 by definition, so its 90-minute
  // result is a DRAW — regardless of ESPN's full-time `score`, which includes
  // extra-time goals. Without this override, an ET/shootout winner's ML would
  // be mis-graded WIN even though Polymarket settled the match as Draw.
  let mlAwayWin = awayWin, mlHomeWin = homeWin;
  if (sport === 'SOC' && game.wentBeyond90) { mlAwayWin = false; mlHomeWin = false; }
  if (side === 'draw') return (!mlAwayWin && !mlHomeWin) ? 'WIN' : 'LOSS';
  if (side === 'home') return mlHomeWin ? 'WIN' : (mlAwayWin ? 'LOSS' : (sport === 'SOC' ? 'LOSS' : 'PUSH'));
  return mlAwayWin ? 'WIN' : (mlHomeWin ? 'LOSS' : (sport === 'SOC' ? 'LOSS' : 'PUSH'));
}

function calculateProfit(outcome, odds, units = 0) {
  if (!units || outcome === 'PUSH' || !outcome) return 0;
  if (outcome === 'WIN') {
    return odds < 0 ? units * (100 / Math.abs(odds)) : units * (odds / 100);
  }
  return -units;
}

// ─── Match a position's gameKey to a final game ─────────────────────────────

// DATE GUARD — a final may only grade a position from the SAME ET calendar
// date. MLB/NBA finals come from a date-blind ESPN scoreboard fetch that
// still lists yesterday's completed games in the early-morning runs; teams
// play multi-game series, so team-code matching alone graded TODAY'S docs
// with YESTERDAY'S score. Real incident 2026-07-08 (NYY@TBR played 7/7 and
// 7/8): 5 of today's position docs were mis-graded pre-game, which froze
// their updatedAt (writeSharpActions doesn't refresh graded docs), which
// stale-pruned those wallets out of the staking cron's consensus/RANK math
// for the rest of the day. Finals with no parseable date are rejected when
// the position has a date (fail-closed: an ungraded doc self-heals next
// run; a mis-graded doc silently corrupts staking inputs all day).
function finalDateMatches(g, pos) {
  if (!pos.date) return true;      // legacy docs without a date — keep old behavior
  return g.dateET != null && g.dateET === pos.date;
}

function findMatchingGame(pos, nhlFinals, cbbFinals, mlbFinals, nbaFinals, socFinals = [], ufcFinals = [], wnbaFinals = [], nflFinals = []) {
  const rawKey = (pos.gameKey || '').replace(/^(NHL|NBA|MLB|CBB|SOC|UFC|WNBA|NFL):/, '');
  const parts = rawKey.split('_');

  if (pos.sport === 'NHL') {
    if (parts.length < 2) return null;
    const awayAbbr = ABBREV_MAP[parts[0]] || parts[0].toUpperCase();
    const homeAbbr = ABBREV_MAP[parts[1]] || parts[1].toUpperCase();
    return nhlFinals.find(g => g.awayTeam === awayAbbr && g.homeTeam === homeAbbr) || null;
  }

  if (pos.sport === 'MLB') {
    const dated = mlbFinals.filter(g => finalDateMatches(g, pos));
    if (parts.length >= 2) {
      const match = dated.find(g => g.awayCode === parts[0] && g.homeCode === parts[1]);
      if (match) return match;
    }
    for (const g of dated) {
      if (teamNamesMatch(pos.away, g.awayTeam) && teamNamesMatch(pos.home, g.homeTeam)) return g;
    }
    return null;
  }

  if (pos.sport === 'NBA') {
    const dated = nbaFinals.filter(g => finalDateMatches(g, pos));
    if (parts.length >= 2) {
      const match = dated.find(g => g.awayCode === parts[0] && g.homeCode === parts[1]);
      if (match) return match;
    }
    for (const g of dated) {
      if (teamNamesMatch(pos.away, g.awayTeam) && teamNamesMatch(pos.home, g.homeTeam)) return g;
    }
    return null;
  }

  if (pos.sport === 'WNBA') {
    const dated = wnbaFinals.filter(g => finalDateMatches(g, pos));
    if (parts.length >= 2) {
      const match = dated.find(g => g.awayCode === parts[0] && g.homeCode === parts[1]);
      if (match) return match;
    }
    for (const g of dated) {
      if (wnbaTeamsMatch(pos.away, g.awayTeam) && wnbaTeamsMatch(pos.home, g.homeTeam)) return g;
      if (teamNamesMatch(pos.away, g.awayTeam) && teamNamesMatch(pos.home, g.homeTeam)) return g;
    }
    return null;
  }

  if (pos.sport === 'NFL') {
    const dated = nflFinals.filter(g => finalDateMatches(g, pos));
    if (parts.length >= 2) {
      const match = dated.find(g => g.awayCode === parts[0] && g.homeCode === parts[1]);
      if (match) return match;
    }
    for (const g of dated) {
      if (nflTeamsMatch(pos.away, g.awayTeam) && nflTeamsMatch(pos.home, g.homeTeam)) return g;
      if (teamNamesMatch(pos.away, g.awayTeam) && teamNamesMatch(pos.home, g.homeTeam)) return g;
    }
    return null;
  }

  if (pos.sport === 'CBB') {
    for (const g of cbbFinals) {
      const normalMatch = teamNamesMatch(pos.away, g.awayTeam) && teamNamesMatch(pos.home, g.homeTeam);
      const reversedMatch = teamNamesMatch(pos.away, g.homeTeam) && teamNamesMatch(pos.home, g.awayTeam);
      if (normalMatch) return { awayScore: g.awayScore, homeScore: g.homeScore };
      if (reversedMatch) return { awayScore: g.homeScore, homeScore: g.awayScore };
    }
    return null;
  }

  if (pos.sport === 'SOC') {
    if (parts.length < 2) return null;
    for (const g of socFinals) {
      if (!g.awayCode || !g.homeCode) continue;
      if (g.awayCode === parts[0] && g.homeCode === parts[1]) return g;
      // ESPN home/away designation may not match our key order — flip scores
      // (carry wentBeyond90 through so the 90-min draw rule still applies).
      if (g.awayCode === parts[1] && g.homeCode === parts[0]) {
        return { awayScore: g.homeScore, homeScore: g.awayScore, wentBeyond90: g.wentBeyond90 };
      }
    }
    return null;
  }

  if (pos.sport === 'UFC') {
    if (!isGradableUFCMainML(pos)) return null;
    if (parts.length < 2) return null;
    const dated = ufcFinals.filter(g => finalDateMatches(g, pos));
    for (const g of dated) {
      if (g.awayCode === parts[0] && g.homeCode === parts[1]) return g;
      if (g.awayCode === parts[1] && g.homeCode === parts[0]) {
        return { ...g, awayScore: g.homeScore, homeScore: g.awayScore };
      }
    }
    for (const g of dated) {
      if (fightersMatch(pos.away, g.awayFighter) && fightersMatch(pos.home, g.homeFighter)) return g;
      if (fightersMatch(pos.away, g.homeFighter) && fightersMatch(pos.home, g.awayFighter)) {
        return { ...g, awayScore: g.homeScore, homeScore: g.awayScore };
      }
    }
    return null;
  }

  return null;
}

const EXITED_GRADE_LOOKBACK_DAYS = 30;
/** Never grade these — UTC siblings or a real other-game leftover. */
const EXITED_SKIP_REASONS = new Set([
  'date_calendar_retag',
  'slug_date_vs_board',
  'slug_date_mismatch',
  'slug_teams_mismatch',
  'slug_teams_mismatch_wnba',
]);

function etDateMinusDays(days) {
  return new Date(Date.now() - days * 86400000)
    .toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}

function exitedAtMs(pos) {
  const x = pos?.exitedAt;
  if (x == null) return null;
  if (typeof x.toMillis === 'function') return x.toMillis();
  if (Number.isFinite(x.seconds)) return x.seconds * 1000;
  if (typeof x === 'string') {
    const t = Date.parse(x);
    return Number.isFinite(t) ? t : null;
  }
  if (Number.isFinite(x)) return x > 1e12 ? x : x * 1000;
  return null;
}

/**
 * EXITED after first pitch still counts — the scan dropped a resolved
 * (or in-game sold) market. Pre-game exits and calendar/wrong-game retags
 * do not.
 *
 * minutesToCommence is stamped at exit: negative = held through commence.
 * Legacy eventId_mismatch after commence is cache churn, not a sell — grade it.
 */
function shouldGradeExited(pos) {
  if (!pos || pos.status !== 'EXITED') return false;
  if (EXITED_SKIP_REASONS.has(String(pos.exitReason || ''))) return false;
  if (Number.isFinite(Number(pos.minutesToCommence)) && Number(pos.minutesToCommence) < 0) {
    return true;
  }
  const ct = Number(pos.commenceTime);
  const exited = exitedAtMs(pos);
  if (Number.isFinite(ct) && ct > 1e11 && Number.isFinite(exited) && exited >= ct) return true;
  return false;
}

function isLaterAssetClone(pos, earliestDateByAsset) {
  const wallet = String(pos?.wallet || '').toLowerCase();
  const asset = pos?.asset != null && pos.asset !== '' ? String(pos.asset) : null;
  const date = pos?.date ? String(pos.date) : null;
  if (!wallet || !asset || !date) return false;
  const earliest = earliestDateByAsset.get(`${wallet}|${asset}`);
  return Boolean(earliest && date > earliest);
}

async function loadEarliestGradedAssetDates(db) {
  const snap = await db.collection(COLLECTION).where('status', '==', 'GRADED').get();
  const earliest = new Map();
  for (const doc of snap.docs) {
    const d = doc.data() || {};
    const wallet = String(d.wallet || '').toLowerCase();
    const asset = d.asset != null && d.asset !== '' ? String(d.asset) : null;
    if (!wallet || !asset || !d.date) continue;
    const k = `${wallet}|${asset}`;
    const date = String(d.date);
    const prev = earliest.get(k);
    if (!prev || date < prev) earliest.set(k, date);
  }
  return earliest;
}

async function loadGradeCandidates(db) {
  const pendingSnap = await db.collection(COLLECTION).where('status', '==', 'PENDING').get();
  const exitedSnap = await db.collection(COLLECTION).where('status', '==', 'EXITED').get();
  const cutoff = etDateMinusDays(EXITED_GRADE_LOOKBACK_DAYS);
  const held = exitedSnap.docs.filter((doc) => {
    const d = doc.data() || {};
    if (d.date && String(d.date) < cutoff) return false;
    return shouldGradeExited(d);
  });
  return {
    docs: [...pendingSnap.docs, ...held],
    pending: pendingSnap.size,
    exitedHeld: held.length,
    exitedSkipped: exitedSnap.size - held.length,
  };
}

const PICK_SCORE_COLS = ['sharpFlowPicks', 'sharpFlowSpreads', 'sharpFlowTotals'];

function knownFinalKey(sport, date, gameKey) {
  const raw = String(gameKey || '').replace(/^(NHL|NBA|MLB|CBB|SOC|UFC|WNBA|NFL):/, '');
  return `${sport}|${date}|${raw}`;
}

/** PENDING featured-pick dates so we fetch scores even when actions already exited. */
async function collectPendingPickDates(db) {
  const sports = new Set();
  const bySport = {
    CBB: new Set(), NHL: new Set(), MLB: new Set(), NBA: new Set(),
    WNBA: new Set(), NFL: new Set(), SOC: new Set(), UFC: new Set(),
  };
  for (const col of PICK_SCORE_COLS) {
    const snap = await db.collection(col).where('status', '==', 'PENDING').get();
    for (const doc of snap.docs) {
      const d = doc.data() || {};
      if (!d.sport || !d.date) continue;
      sports.add(d.sport);
      bySport[d.sport]?.add(d.date);
    }
  }
  return { sports, bySport };
}

function pickSideNorm(side) {
  const s = String(side || '').toLowerCase();
  if (s === 'away' || s === 'home' || s === 'over' || s === 'under' || s === 'draw') return s;
  return s;
}

function pickLine(sideData) {
  for (const v of [
    sideData?.peak?.line,
    sideData?.lock?.line,
    sideData?.line,
    sideData?.spread,
    sideData?.total,
  ]) {
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

async function gradePendingSharpFlowPicks(db, finals) {
  const now = Date.now();
  const colMarkets = [
    ['sharpFlowPicks', 'ML'],
    ['sharpFlowSpreads', 'SPREAD'],
    ['sharpFlowTotals', 'TOTAL'],
  ];
  let graded = 0;
  let skipped = 0;
  for (const [col, marketType] of colMarkets) {
    const snap = await db.collection(col).where('status', '==', 'PENDING').get();
    for (const doc of snap.docs) {
      const pick = doc.data() || {};
      if (pick.commenceTime && Number(pick.commenceTime) > now) {
        skipped++;
        continue;
      }
      const game = findMatchingGame(
        {
          sport: pick.sport,
          date: pick.date,
          gameKey: pick.gameKey,
          away: pick.away,
          home: pick.home,
        },
        finals.nhlFinals,
        finals.cbbFinals,
        finals.mlbFinals,
        finals.nbaFinals,
        finals.socFinals,
        finals.ufcFinals,
        finals.wnbaFinals,
        finals.nflFinals,
      );
      if (!game) {
        skipped++;
        continue;
      }
      const winner = game.wentBeyond90 ? 'draw'
        : game.awayScore > game.homeScore ? 'away'
          : game.homeScore > game.awayScore ? 'home' : 'draw';
      const source = pick.sport === 'NHL' ? 'NHL_API'
        : pick.sport === 'CBB' ? 'NCAA_API'
          : pick.sport === 'NBA' ? 'ESPN_NBA_API'
            : pick.sport === 'WNBA' ? 'ESPN_WNBA_API'
              : pick.sport === 'NFL' ? 'ESPN_NFL_API'
                : pick.sport === 'SOC' ? 'ESPN_SOC_API'
                  : pick.sport === 'UFC' ? 'ESPN_UFC_API' : 'ESPN_MLB_API';
      const updates = {
        'result.awayScore': game.awayScore,
        'result.homeScore': game.homeScore,
        'result.winner': winner,
        'result.source': source,
      };
      let allSidesGraded = true;
      const sides = pick.sides && typeof pick.sides === 'object' ? pick.sides : null;
      if (!sides) {
        skipped++;
        continue;
      }
      for (const [side, sideData] of Object.entries(sides)) {
        if (sideData?.status === 'COMPLETED') continue;
        const outcome = calculateOutcome(game, marketType, pickSideNorm(side), pickLine(sideData), pick.sport);
        if (!outcome) {
          allSidesGraded = false;
          continue;
        }
        const units = sideData.finalUnits
          ?? sideData.v8_agsUnitsApplied
          ?? sideData.peak?.units
          ?? sideData.lock?.units
          ?? 0;
        const odds = sideData.peak?.odds || sideData.lock?.odds || 0;
        const isTracked = !units;
        const profit = isTracked ? 0 : calculateProfit(outcome, odds, units);
        updates[`sides.${side}.status`] = 'COMPLETED';
        updates[`sides.${side}.result.outcome`] = outcome;
        updates[`sides.${side}.result.profit`] = parseFloat(profit.toFixed(2));
        updates[`sides.${side}.result.tracked`] = isTracked;
        updates[`sides.${side}.result.gradedAt`] = admin.firestore.FieldValue.serverTimestamp();
        const team = sideData.team || side;
        console.log(`  🔒 ${pick.sport} pick ${doc.id} ${team} ${marketType} ${units}u → ${outcome} (${profit >= 0 ? '+' : ''}${profit.toFixed(2)}u) ${game.awayScore}-${game.homeScore}`);
        graded++;
      }
      for (const [side, sideData] of Object.entries(sides)) {
        if (sideData?.status !== 'COMPLETED' && !updates[`sides.${side}.status`]) {
          allSidesGraded = false;
        }
      }
      if (allSidesGraded) updates.status = 'COMPLETED';
      await doc.ref.update(updates);
    }
  }
  console.log(`Featured picks graded: ${graded} sides (${skipped} still waiting)`);
}

/** Scores already stored on graded Source A picks — do not wait on ESPN. */
async function loadKnownFinalsFromPicks(db, dates) {
  const map = new Map();
  const dateList = [...dates].filter(Boolean);
  if (!dateList.length) return map;
  for (const date of dateList) {
    for (const col of PICK_SCORE_COLS) {
      const snap = await db.collection(col).where('date', '==', date).get();
      for (const doc of snap.docs) {
        const d = doc.data() || {};
        const away = d.result?.awayScore;
        const home = d.result?.homeScore;
        if (away == null || home == null) continue;
        const sport = d.sport;
        const gameKey = d.gameKey || '';
        if (!sport || !gameKey) continue;
        const key = knownFinalKey(sport, date, gameKey);
        if (map.has(key)) continue;
        const parts = String(gameKey).replace(/^(NHL|NBA|MLB|CBB|SOC|UFC|WNBA|NFL):/, '').split('_');
        map.set(key, {
          dateET: date,
          awayCode: parts[0] || null,
          homeCode: parts[1] || null,
          awayTeam: d.away || d.awayTeam || '',
          homeTeam: d.home || d.homeTeam || '',
          awayScore: Number(away),
          homeScore: Number(home),
        });
      }
    }
  }
  return map;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const db = initFirebase();
  console.log('\n=== gradeSharpActions ===\n');

  // Load closing pinnacle odds for CLV
  const pinnacleHistory = (() => {
    const p = join(PUBLIC, 'pinnacle_history.json');
    if (!existsSync(p)) return {};
    return JSON.parse(readFileSync(p, 'utf8'));
  })();

  const snapshot = await loadGradeCandidates(db);
  if (!snapshot.docs.length) {
    console.log('No pending or held-through-exit positions to grade.');
  } else {
    console.log(`Found ${snapshot.pending} pending + ${snapshot.exitedHeld} held-through-exit (skipped ${snapshot.exitedSkipped} other EXITED)`);
  }

  const earliestAssetDate = snapshot.docs.length
    ? await loadEarliestGradedAssetDates(db)
    : new Map();
  if (snapshot.docs.length) {
    console.log(`Graded asset index: ${earliestAssetDate.size} wallet+asset keys`);
  }

  // Determine which sports / dates we need scores for
  const sports = new Set();
  const cbbDates = new Set();
  const nhlDates = new Set();
  const mlbDates = new Set();
  const nbaDates = new Set();
  const wnbaDates = new Set();
  const nflDates = new Set();
  const socDates = new Set();
  const ufcDates = new Set();
  for (const doc of snapshot.docs) {
    const d = doc.data();
    sports.add(d.sport);
    if (d.sport === 'CBB' && d.date) cbbDates.add(d.date);
    if (d.sport === 'NHL' && d.date) nhlDates.add(d.date);
    if (d.sport === 'MLB' && d.date) mlbDates.add(d.date);
    if (d.sport === 'NBA' && d.date) nbaDates.add(d.date);
    if (d.sport === 'WNBA' && d.date) wnbaDates.add(d.date);
    if (d.sport === 'NFL' && d.date) nflDates.add(d.date);
    if (d.sport === 'SOC' && d.date) socDates.add(d.date);
    if (d.sport === 'UFC' && d.date) ufcDates.add(d.date);
  }

  const pendingPicks = await collectPendingPickDates(db);
  for (const s of pendingPicks.sports) sports.add(s);
  for (const d of pendingPicks.bySport.CBB) cbbDates.add(d);
  for (const d of pendingPicks.bySport.NHL) nhlDates.add(d);
  for (const d of pendingPicks.bySport.MLB) mlbDates.add(d);
  for (const d of pendingPicks.bySport.NBA) nbaDates.add(d);
  for (const d of pendingPicks.bySport.WNBA) wnbaDates.add(d);
  for (const d of pendingPicks.bySport.NFL) nflDates.add(d);
  for (const d of pendingPicks.bySport.SOC) socDates.add(d);
  for (const d of pendingPicks.bySport.UFC) ufcDates.add(d);

  const allDates = new Set([...cbbDates, ...nhlDates, ...mlbDates, ...nbaDates, ...wnbaDates, ...nflDates, ...socDates, ...ufcDates]);
  const knownFinals = await loadKnownFinalsFromPicks(db, allDates);
  console.log(`Source A known finals: ${knownFinals.size} games (already-graded picks)`);

  // Fetch scores
  let nhlFinals = [];
  if (sports.has('NHL')) {
    for (const d of nhlDates) {
      const games = await fetchNHLFinalGames(d);
      nhlFinals.push(...games);
      console.log(`NHL API: ${games.length} final games for ${d}`);
    }
  }

  let cbbFinals = [];
  if (sports.has('CBB')) {
    for (const d of cbbDates) {
      const games = await fetchNCAAFinalGames(d);
      cbbFinals.push(...games);
      console.log(`NCAA API: ${games.length} final CBB games for ${d}`);
    }
  }

  let mlbFinals = [];
  if (sports.has('MLB')) {
    for (const d of [null, ...recentScoreboardDates(mlbDates)]) {
      const games = await fetchMLBFinalGames(d);
      mlbFinals.push(...games);
      console.log(`ESPN MLB API: ${games.length} final MLB games${d ? ` for ${d}` : ''}`);
    }
  }

  let nbaFinals = [];
  if (sports.has('NBA')) {
    for (const d of [null, ...recentScoreboardDates(nbaDates)]) {
      const games = await fetchNBAFinalGames(d);
      nbaFinals.push(...games);
      console.log(`ESPN NBA API: ${games.length} final NBA games${d ? ` for ${d}` : ''}`);
    }
  }

  let wnbaFinals = [];
  if (sports.has('WNBA')) {
    for (const d of [null, ...recentScoreboardDates(wnbaDates)]) {
      const games = await fetchWNBAFinalGames(d);
      wnbaFinals.push(...games);
      console.log(`ESPN WNBA API: ${games.length} final WNBA games${d ? ` for ${d}` : ''}`);
    }
  }

  let nflFinals = [];
  if (sports.has('NFL')) {
    for (const d of [null, ...recentScoreboardDates(nflDates)]) {
      const games = await fetchNFLFinalGames(d);
      nflFinals.push(...games);
      console.log(`ESPN NFL API: ${games.length} final NFL games${d ? ` for ${d}` : ''}`);
    }
  }

  let socFinals = [];
  if (sports.has('SOC')) {
    for (const d of recentScoreboardDates(socDates)) {
      const games = await fetchSOCFinalGames(d);
      socFinals.push(...games);
      console.log(`ESPN SOC API: ${games.length} final EPL/La Liga games for ${d}`);
    }
  }

  let ufcFinals = [];
  if (sports.has('UFC')) {
    for (const d of recentScoreboardDates(ufcDates)) {
      const fights = await fetchUFCFinalFights(d);
      ufcFinals.push(...fights);
      console.log(`ESPN UFC API: ${fights.length} final fights for ${d}`);
    }
  }

  await gradePendingSharpFlowPicks(db, {
    nhlFinals, cbbFinals, mlbFinals, nbaFinals, socFinals, ufcFinals, wnbaFinals, nflFinals,
  });

  // Grade each position
  let graded = 0, noGame = 0, errors = 0, cloneSkip = 0;
  const BATCH_SIZE = 400;
  const docs = snapshot.docs;

  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    const chunk = docs.slice(i, i + BATCH_SIZE);
    const batch = db.batch();
    let batchOps = 0;

    for (const doc of chunk) {
      const pos = doc.data();

      if (isLaterAssetClone(pos, earliestAssetDate)) {
        cloneSkip++;
        continue;
      }

      let game = knownFinals.get(knownFinalKey(pos.sport, pos.date, pos.gameKey)) || null;
      if (!game) {
        game = findMatchingGame(pos, nhlFinals, cbbFinals, mlbFinals, nbaFinals, socFinals, ufcFinals, wnbaFinals, nflFinals);
      }
      if (!game) {
        noGame++;
        continue;
      }

      let line = pos.marketType === 'SPREAD' ? (pos.spreadLine ?? pos.entryLine ?? null)
        : pos.marketType === 'TOTAL' ? (pos.totalLine ?? pos.entryLine ?? null)
        : null;

      // Fallback: look up line from pinnacle_history when stored line is null
      if (line == null && (pos.marketType === 'SPREAD' || pos.marketType === 'TOTAL')) {
        const pinnFallback = pinnacleHistory?.[pos.sport]?.[pos.gameKey];
        if (pinnFallback) {
          if (pos.marketType === 'SPREAD') {
            const sc = pinnFallback.spreadCurrent || pinnFallback.spreadOpener;
            line = pos.side === 'away' ? sc?.awayLine : sc?.homeLine;
            if (line == null) line = pos.side === 'away' ? pinnFallback.awaySpread : pinnFallback.homeSpread;
          } else {
            const tc = pinnFallback.totalCurrent || pinnFallback.totalOpener;
            line = tc?.line ?? pinnFallback.totalLine ?? null;
          }
          if (line != null) {
            console.log(`  [fallback] Using pinnacle line ${line} for ${doc.id}`);
          }
        }
      }

      const outcome = calculateOutcome(game, pos.marketType, pos.side, line, pos.sport);
      if (!outcome) {
        errors++;
        console.warn(`  Could not calculate outcome for ${doc.id} (line=${line})`);
        continue;
      }

      // CLV: compare entry odds to closing pinnacle
      let clv = null, closingPinnacleOdds = null;
      const pinnGame = pinnacleHistory?.[pos.sport]?.[pos.gameKey];
      if (pinnGame) {
        if (pos.marketType === 'ML') {
          closingPinnacleOdds = pos.side === 'away'
            ? (pinnGame.current?.away ?? pinnGame.awayOdds)
            : (pinnGame.current?.home ?? pinnGame.homeOdds);
        } else if (pos.marketType === 'SPREAD') {
          const sc = pinnGame.spreadCurrent;
          closingPinnacleOdds = pos.side === 'away'
            ? (sc?.awayOdds ?? pinnGame.awaySpreadOdds)
            : (sc?.homeOdds ?? pinnGame.homeSpreadOdds);
        } else {
          const tc = pinnGame.totalCurrent;
          closingPinnacleOdds = pos.side === 'over'
            ? (tc?.overOdds ?? pinnGame.overOdds)
            : (tc?.underOdds ?? pinnGame.underOdds);
        }

        if (closingPinnacleOdds && pos.pinnacleOdds) {
          const entryProb = impliedProb(pos.pinnacleOdds);
          const closeProb = impliedProb(closingPinnacleOdds);
          if (entryProb != null && closeProb != null) {
            clv = +((closeProb - entryProb) * 100).toFixed(2);
          }
        }
      }

      // Polymarket P&L calc (entry price vs outcome)
      const entryPrice = pos.avgPrice || 0;
      const settledPrice = outcome === 'WIN' ? 1.0 : outcome === 'LOSS' ? 0.0 : entryPrice;
      const settledPnl = Math.round((settledPrice - entryPrice) * (pos.size || 0));

      const pnlEmoji = outcome === 'WIN' ? '✅' : outcome === 'LOSS' ? '❌' : '⏸️';
      console.log(`  ${pnlEmoji} ${pos.sport} ${pos.teamName} ${pos.marketType} — ${outcome} | ` +
        `${pos.away} ${game.awayScore}-${game.homeScore} ${pos.home} | ` +
        `Invested: $${pos.invested} | P&L: $${settledPnl}` +
        (clv != null ? ` | CLV: ${clv > 0 ? '+' : ''}${clv}%` : ''));

      const tapeMkt = String(pos.marketType || 'ML').toUpperCase() === 'SPREAD' ? 'spread'
        : String(pos.marketType || 'ML').toUpperCase() === 'TOTAL' ? 'total'
          : 'ml';
      const tapeLine = Number.isFinite(Number(pos.entryLine)) ? Number(pos.entryLine)
        : (Number.isFinite(Number(line)) ? Number(line) : null);
      const tapeOffer = Number.isFinite(Number(pos.ticketEvOffer)) ? Number(pos.ticketEvOffer)
        : (Number.isFinite(Number(pos.bestRetailOdds)) ? Number(pos.bestRetailOdds)
          : (Number.isFinite(Number(pos.pinnacleOdds)) ? Number(pos.pinnacleOdds) : null));
      const gradeTape = applyActionTicketTape({}, captureTicketTape({
        pinnGame: pinnGame || null,
        marketType: tapeMkt,
        sideNorm: pos.side,
        line: tapeLine,
        offerOdds: tapeOffer,
        commenceMs: pos.commenceTime,
      }), {
        existingLog: pos.ticketTapeLog,
        hoursUntilGame: hoursUntilMs(pos.commenceTime),
        isGrade: true,
      });

      batch.update(doc.ref, {
        status: 'GRADED',
        result: outcome,
        'score.away': game.awayScore,
        'score.home': game.homeScore,
        settledPnl,
        settledPrice,
        closingPinnacleOdds,
        clv,
        ticketTapeLog: gradeTape.ticketTapeLog,
        ticketEvPct: gradeTape.ticketEvPct,
        ticketEvFair: gradeTape.ticketEvFair,
        ticketEvOffer: gradeTape.ticketEvOffer,
        steam: gradeTape.steam,
        gradedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      batchOps++;
      graded++;
    }

    if (batchOps > 0) await batch.commit();
  }

  console.log(`\nResults:`);
  console.log(`  Graded:     ${graded}`);
  console.log(`  Clone skip: ${cloneSkip} (later date, same asset already GRADED)`);
  console.log(`  No game:    ${noGame} (game not final yet)`);
  console.log(`  Errors:     ${errors}`);
  console.log(`  Remaining:  ${snapshot.docs.length - graded} still open`);

  // All-time performance summary used to re-scan every GRADED doc (~22k reads).
  // Skip that — exportWalletProfiles already rebuilds the CLV ledger + profiles
  // from the same collection on this workflow. Per-run graded count above is enough.

  console.log('\nDone.');
}

// Exported for tests (tests/testGradeDateGuard.mjs) — pure helpers, no I/O.
export { espnEventDateET, finalDateMatches, findMatchingGame, teamNamesMatch, shouldGradeExited, calculateOutcome, isLaterAssetClone };

// Only run when executed directly (node scripts/gradeSharpActions.js), so
// tests can import the helpers without triggering a live grading pass.
const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isDirectRun) {
  main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}
