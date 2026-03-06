/**
 * Fetch CBBD Player Stats
 *
 * Pulls player season stats and adjusted efficiency ratings from
 * CollegeBasketballData.com API for all teams playing today.
 * Writes public/cbbd_players.json for the frontend to consume.
 *
 * Usage: node scripts/fetchCBBDPlayerStats.js
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

async function cbbdFetch(endpoint) {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${CBBD_KEY}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`CBBD ${endpoint} → ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json();
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

async function main() {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║       CBBD PLAYER STATS FETCHER                         ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  if (!CBBD_KEY) {
    console.error('❌ CBBD_KEY not found in environment. Skipping player stats.');
    await fs.writeFile(join(__dirname, '../public/cbbd_players.json'), '{}', 'utf8');
    return;
  }

  // 1. Read today's odds to find teams
  let oddsMarkdown;
  try {
    oddsMarkdown = await fs.readFile(join(__dirname, '../public/basketball_odds.md'), 'utf8');
  } catch {
    console.error('❌ Could not read basketball_odds.md. Run fetch-prime-picks first.');
    await fs.writeFile(join(__dirname, '../public/cbbd_players.json'), '{}', 'utf8');
    return;
  }

  const oddsTeams = extractTeamsFromOdds(oddsMarkdown);
  console.log(`📋 Found ${oddsTeams.length} teams in today's odds:\n   ${oddsTeams.join(', ')}\n`);

  if (!oddsTeams.length) {
    console.log('⚠️  No teams found. Writing empty JSON.');
    await fs.writeFile(join(__dirname, '../public/cbbd_players.json'), '{}', 'utf8');
    return;
  }

  // 2. Load CSV mappings for team name resolution
  let csvMappings = {};
  try {
    const csv = await fs.readFile(join(__dirname, '../public/basketball_teams.csv'), 'utf8');
    csvMappings = loadCSVMappings(csv);
  } catch {
    console.log('⚠️  Could not load basketball_teams.csv — using raw team names');
  }

  // 3. Fetch adjusted efficiency ratings (1 API call for ALL teams)
  let adjRatings = {};
  try {
    console.log('📊 Fetching adjusted efficiency ratings...');
    const ratings = await cbbd_fetch_safe(`/ratings/adjusted?season=${SEASON}`);
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

  // 4. Fetch player stats and rosters for each team
  const result = {};
  let matched = 0;
  let failed = 0;
  let apiCalls = 1; // 1 for ratings

  for (const otTeam of oddsTeams) {
    // Resolve CBBD name: alias → cbbd_name from CSV → normalized_name → raw
    const alias = CBBD_ALIASES[otTeam];
    const mapping = csvMappings[otTeam.toLowerCase()];
    const cbbdName = alias || mapping?.cbbdName || mapping?.normName || otTeam;
    const normKey = (mapping?.normName || otTeam).toLowerCase().replace(/[^a-z0-9]/g, '');

    try {
      const players = await cbbd_fetch_safe(
        `/stats/player/season?season=${SEASON}&team=${encodeURIComponent(cbbdName)}`
      );
      apiCalls++;

      if (!players || !players.length) {
        console.log(`   ⚠️  ${otTeam} → "${cbbdName}" — no player data`);
        failed++;
        continue;
      }

      // Fetch roster for jersey numbers
      let rosterMap = {};
      try {
        const rosterData = await cbbd_fetch_safe(
          `/teams/roster?team=${encodeURIComponent(cbbdName)}&season=${SEASON}`
        );
        apiCalls++;
        if (rosterData && Array.isArray(rosterData) && rosterData.length > 0) {
          const roster = rosterData[0];
          if (roster.players) {
            for (const rp of roster.players) {
              const key = (rp.name || '').toLowerCase().trim();
              rosterMap[key] = {
                jersey: rp.jersey || null,
                height: rp.height || null,
                weight: rp.weight || null,
              };
            }
          }
        }
      } catch (e) {
        console.log(`   ⚠️  ${otTeam} roster fetch failed: ${e.message}`);
      }

      // Sort by minutes (descending), take top N
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

      // Match adjusted ratings
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

    // Small delay to be respectful to the API
    await new Promise(r => setTimeout(r, 200));
  }

  // 5. Write output
  const outPath = join(__dirname, '../public/cbbd_players.json');
  await fs.writeFile(outPath, JSON.stringify(result, null, 2), 'utf8');

  console.log(`\n📊 SUMMARY:`);
  console.log(`   Teams matched: ${matched}/${oddsTeams.length}`);
  console.log(`   Failed: ${failed}`);
  console.log(`   API calls used: ${apiCalls}`);
  console.log(`   Output: public/cbbd_players.json (${Object.keys(result).length} teams)\n`);
}

async function cbbd_fetch_safe(endpoint) {
  try {
    return await cbbdFetch(endpoint);
  } catch (e) {
    console.error(`   CBBD error: ${e.message}`);
    return null;
  }
}

main().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
