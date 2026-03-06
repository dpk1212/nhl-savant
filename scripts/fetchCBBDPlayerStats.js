/**
 * Fetch CBBD Player Stats
 *
 * Pulls player season stats and adjusted efficiency ratings from
 * CollegeBasketballData.com API for all teams playing today.
 * Writes public/cbbd_players.json for the frontend to consume.
 *
 * Optimizations:
 * - Roster data (jersey numbers, height) is cached to cbbd_roster_cache.json
 *   and only re-fetched if the cache is older than 7 days.
 * - Adjusted ratings are fetched in a single bulk call (all teams).
 * - Player stats are fetched per-team (only for today's games).
 *
 * Usage: node scripts/fetchCBBDPlayerStats.js [--force-roster]
 */

import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const CBBD_KEY = process.env.CBBD_KEY;
const API_BASE = 'https://api.collegebasketballdata.com';
const SEASON = 2026;
const TOP_PLAYERS = 5;
const ROSTER_CACHE_FILE = join(__dirname, '../public/cbbd_roster_cache.json');
const OUTPUT_FILE = join(__dirname, '../public/cbbd_players.json');
const ROSTER_MAX_AGE_DAYS = 7;
const FORCE_ROSTER = process.argv.includes('--force-roster');

let apiCalls = 0;

async function cbbdFetch(endpoint) {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${CBBD_KEY}` },
  });
  apiCalls++;
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`CBBD ${endpoint} → ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json();
}

async function cbbdFetchSafe(endpoint) {
  try {
    return await cbbdFetch(endpoint);
  } catch (e) {
    console.error(`   CBBD error: ${e.message}`);
    return null;
  }
}

function extractTeamsFromOdds(markdown) {
  const teams = new Set();
  const teamPattern = /\n\|.*?<br>([A-Z][A-Za-z' .&()-]+)<br>\d+-\d+/g;
  let m;
  while ((m = teamPattern.exec(markdown)) !== null) {
    const name = m[1].trim();
    if (name && name.length > 1 && !name.includes('bell') && !name.includes('logo')) {
      teams.add(name);
    }
  }
  return [...teams];
}

const CBBD_ALIASES = {
  'Sam Houston State': 'Sam Houston',
  'Tennessee-Martin': 'UT Martin',
  'Maryland-Eastern Shore': 'Maryland Eastern Shore',
  'Loyola (MD)': 'Loyola Maryland',
  'Texas-Arlington': 'UT Arlington',
  'Grambling State': 'Grambling',
  'St. Thomas (MN)': 'St. Thomas-Minnesota',
  'Hawaii': "Hawai'i",
  'UMass': 'Massachusetts',
  'UConn': 'Connecticut',
  'Ole Miss': 'Mississippi',
  'UTEP': 'UTEP',
  'SMU': 'Southern Methodist',
  'UCF': 'Central Florida',
  'USC': 'Southern California',
  'LSU': 'Louisiana State',
  'BYU': 'Brigham Young',
  'VCU': 'Virginia Commonwealth',
  'UNLV': 'Nevada-Las Vegas',
  'UNC': 'North Carolina',
  'UTSA': 'UT San Antonio',
  'LIU': 'Long Island University',
  'FIU': 'Florida International',
  'Southern University': 'Southern',
  'SIU Edwardsville': 'SIU-Edwardsville',
  'UT Rio Grande Valley': 'UTRGV',
  'Saint Mary\'s': "Saint Mary's (CA)",
  'Loyola Chicago': 'Loyola (IL)',
  'Loyola-Chicago': 'Loyola (IL)',
  'NC State': 'North Carolina State',
};

function loadCSVMappings(csvContent) {
  const lines = csvContent.split('\n').filter(l => l.trim());
  const header = lines[0].split(',');
  const cbbd_col = header.indexOf('cbbd_name');
  const ot_col = header.indexOf('oddstrader_name');
  const norm_col = header.indexOf('normalized_name');

  const map = {};
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    const normName = (cols[norm_col] || '').trim();
    const otName = (cols[ot_col] || '').trim();
    const cbbdName = cbbd_col >= 0 ? (cols[cbbd_col] || '').trim() : '';
    if (normName) {
      map[otName.toLowerCase()] = { normName, cbbdName };
      map[normName.toLowerCase()] = { normName, cbbdName };
    }
  }
  return map;
}

function perGame(total, games) {
  if (!games || games === 0) return 0;
  return Math.round((total / games) * 10) / 10;
}

function pct(val) {
  if (val == null) return 0;
  return Math.round(val * 10) / 10;
}

function formatPlayer(p) {
  const g = p.games || 1;
  const tsPctVal = p.trueShootingPct != null
    ? (p.trueShootingPct < 1 ? p.trueShootingPct * 100 : p.trueShootingPct)
    : 0;
  return {
    name: p.name || 'Unknown',
    position: p.position || '?',
    games: Math.round(p.games || 0),
    starts: Math.round(p.starts || 0),
    mpg: perGame(p.minutes, g),
    ppg: perGame(p.points, g),
    rpg: perGame((p.rebounds?.total ?? 0), g),
    apg: perGame(p.assists, g),
    spg: perGame(p.steals, g),
    bpg: perGame(p.blocks, g),
    topg: perGame(p.turnovers, g),
    usage: pct(p.usage),
    offRtg: pct(p.offensiveRating),
    defRtg: pct(p.defensiveRating),
    efgPct: pct(p.effectiveFieldGoalPct),
    tsPct: pct(tsPctVal),
    fgPct: pct(p.fieldGoals?.pct),
    threePct: pct(p.threePointFieldGoals?.pct),
    ftPct: pct(p.freeThrows?.pct),
    threeAtt: perGame(p.threePointFieldGoals?.attempted ?? 0, g),
  };
}

// ─── Roster Cache ────────────────────────────────────────────────────────────

async function loadRosterCache() {
  try {
    const raw = await fs.readFile(ROSTER_CACHE_FILE, 'utf8');
    const cache = JSON.parse(raw);
    const age = Date.now() - (cache._timestamp || 0);
    const ageDays = age / (1000 * 60 * 60 * 24);

    if (FORCE_ROSTER) {
      console.log('🔄 --force-roster flag set, will refresh roster cache');
      return null;
    }

    if (ageDays > ROSTER_MAX_AGE_DAYS) {
      console.log(`🔄 Roster cache is ${ageDays.toFixed(1)} days old (max ${ROSTER_MAX_AGE_DAYS}), will refresh`);
      return null;
    }

    const teamCount = Object.keys(cache).filter(k => k !== '_timestamp').length;
    console.log(`✅ Roster cache loaded (${teamCount} teams, ${ageDays.toFixed(1)} days old)`);
    return cache;
  } catch {
    console.log('📋 No roster cache found, will fetch fresh');
    return null;
  }
}

async function buildRosterCache(teams, csvMappings) {
  console.log(`\n🏀 Building roster cache for ${teams.length} teams...`);
  const cache = { _timestamp: Date.now() };
  let fetched = 0;

  for (const otTeam of teams) {
    const alias = CBBD_ALIASES[otTeam];
    const mapping = csvMappings[otTeam.toLowerCase()];
    const cbbdName = alias || mapping?.cbbdName || mapping?.normName || otTeam;
    const normKey = (mapping?.normName || otTeam).toLowerCase().replace(/[^a-z0-9]/g, '');

    try {
      const rosterData = await cbbdFetchSafe(
        `/teams/roster?team=${encodeURIComponent(cbbdName)}&season=${SEASON}`
      );

      if (rosterData && Array.isArray(rosterData) && rosterData.length > 0) {
        const roster = rosterData[0];
        if (roster.players) {
          const playerMap = {};
          for (const rp of roster.players) {
            const key = (rp.name || '').toLowerCase().trim();
            playerMap[key] = {
              jersey: rp.jersey || null,
              height: rp.height || null,
              weight: rp.weight || null,
            };
          }
          cache[normKey] = playerMap;
          // Also store under CBBD team name for flexible lookup
          cache[cbbdName.toLowerCase().replace(/[^a-z0-9]/g, '')] = playerMap;
          fetched++;
        }
      }
    } catch (e) {
      console.log(`   ⚠️  Roster for ${otTeam} failed: ${e.message}`);
    }

    await new Promise(r => setTimeout(r, 150));
  }

  await fs.writeFile(ROSTER_CACHE_FILE, JSON.stringify(cache, null, 2), 'utf8');
  console.log(`   ✅ Roster cache saved: ${fetched} teams (${apiCalls} API calls so far)\n`);
  return cache;
}

function lookupRoster(rosterCache, normKey, cbbdName) {
  if (!rosterCache) return {};
  return rosterCache[normKey]
    || rosterCache[cbbdName.toLowerCase().replace(/[^a-z0-9]/g, '')]
    || {};
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║       CBBD PLAYER STATS FETCHER  (optimized)             ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  if (!CBBD_KEY) {
    console.error('❌ CBBD_KEY not found in environment. Skipping player stats.');
    await fs.writeFile(OUTPUT_FILE, '{}', 'utf8');
    return;
  }

  // 1. Read today's odds to find teams
  let oddsMarkdown;
  try {
    oddsMarkdown = await fs.readFile(join(__dirname, '../public/basketball_odds.md'), 'utf8');
  } catch {
    console.error('❌ Could not read basketball_odds.md. Run fetch-prime-picks first.');
    await fs.writeFile(OUTPUT_FILE, '{}', 'utf8');
    return;
  }

  const oddsTeams = extractTeamsFromOdds(oddsMarkdown);
  console.log(`📋 Found ${oddsTeams.length} teams in today's odds\n`);

  if (!oddsTeams.length) {
    console.log('⚠️  No teams found. Writing empty JSON.');
    await fs.writeFile(OUTPUT_FILE, '{}', 'utf8');
    return;
  }

  // 2. Load CSV mappings
  let csvMappings = {};
  try {
    const csv = await fs.readFile(join(__dirname, '../public/basketball_teams.csv'), 'utf8');
    csvMappings = loadCSVMappings(csv);
  } catch {
    console.log('⚠️  Could not load basketball_teams.csv — using raw team names');
  }

  // 3. Load or build roster cache (saves ~73 API calls on subsequent runs)
  let rosterCache = await loadRosterCache();
  if (!rosterCache) {
    rosterCache = await buildRosterCache(oddsTeams, csvMappings);
  }

  // 4. Fetch adjusted efficiency ratings (1 API call for ALL teams)
  let adjRatings = {};
  try {
    console.log('📊 Fetching adjusted efficiency ratings...');
    const ratings = await cbbdFetchSafe(`/ratings/adjusted?season=${SEASON}`);
    if (ratings) {
      for (const r of ratings) {
        const key = r.team?.toLowerCase();
        if (key) {
          adjRatings[key] = {
            adjOff: pct(r.offensiveRating),
            adjDef: pct(r.defensiveRating),
            netRtg: pct(r.netRating),
            adjOffRank: r.rankings?.offense ?? null,
            adjDefRank: r.rankings?.defense ?? null,
            netRank: r.rankings?.net ?? null,
          };
        }
      }
      console.log(`   ✅ Loaded ratings for ${Object.keys(adjRatings).length} teams`);
    }
  } catch (e) {
    console.error(`   ❌ Ratings fetch failed: ${e.message}`);
  }

  // 5. Fetch player stats per team (1 call each — this is the only per-team call now)
  console.log(`\n📊 Fetching player stats for ${oddsTeams.length} teams...`);
  const result = {};
  let matched = 0;
  let failed = 0;

  for (const otTeam of oddsTeams) {
    const alias = CBBD_ALIASES[otTeam];
    const mapping = csvMappings[otTeam.toLowerCase()];
    const cbbdName = alias || mapping?.cbbdName || mapping?.normName || otTeam;
    const normKey = (mapping?.normName || otTeam).toLowerCase().replace(/[^a-z0-9]/g, '');

    try {
      const players = await cbbdFetchSafe(
        `/stats/player/season?season=${SEASON}&team=${encodeURIComponent(cbbdName)}`
      );

      if (!players || !players.length) {
        console.log(`   ⚠️  ${otTeam} → "${cbbdName}" — no player data`);
        failed++;
        continue;
      }

      const rosterMap = lookupRoster(rosterCache, normKey, cbbdName);

      const sorted = players
        .filter(p => p.minutes > 0)
        .sort((a, b) => (b.minutes || 0) - (a.minutes || 0));

      const topPlayers = sorted.slice(0, TOP_PLAYERS).map(p => {
        const formatted = formatPlayer(p);
        const rosterKey = (p.name || '').toLowerCase().trim();
        const rosterInfo = rosterMap[rosterKey];
        if (rosterInfo) {
          formatted.jersey = rosterInfo.jersey;
          formatted.height = rosterInfo.height;
        }
        return formatted;
      });
      const teamGames = sorted[0]?.games || 0;

      const ratingKey = cbbdName.toLowerCase();
      const ratings = adjRatings[ratingKey] || null;

      result[normKey] = {
        team: cbbdName,
        games: teamGames,
        ...(ratings || {}),
        players: topPlayers,
      };

      const rTag = ratings ? ` | AdjO ${ratings.adjOff} (#${ratings.adjOffRank}) AdjD ${ratings.adjDef} (#${ratings.adjDefRank})` : '';
      console.log(`   ✅ ${otTeam} → ${topPlayers.length} players${rTag}`);
      matched++;
    } catch (e) {
      console.log(`   ❌ ${otTeam} → "${cbbdName}" failed: ${e.message}`);
      failed++;
    }

    await new Promise(r => setTimeout(r, 200));
  }

  // 6. Write output
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(result, null, 2), 'utf8');

  console.log(`\n📊 SUMMARY:`);
  console.log(`   Teams matched: ${matched}/${oddsTeams.length}`);
  console.log(`   Failed: ${failed}`);
  console.log(`   API calls used: ${apiCalls}`);
  console.log(`   Output: public/cbbd_players.json (${Object.keys(result).length} teams)`);
  console.log(`   Roster cache: ${rosterCache ? 'REUSED (0 calls)' : 'REBUILT'}\n`);
}

main().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
