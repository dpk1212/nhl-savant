/**
 * buildOddsApiMap.js — Auto-populate odds_api_name in basketball_teams.csv
 *
 * Fetches all current Odds API team names and maps them to our CSV.
 * Uses multi-strategy matching: exact → abbreviation expansion → fuzzy.
 * Self-healing: writes successful matches to column 10 for future exact lookups.
 *
 * Usage: node scripts/buildOddsApiMap.js
 */
import * as dotenv from 'dotenv';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CSV_PATH = join(__dirname, '../public/basketball_teams.csv');

const ODDS_API_KEY = process.env.ODDS_API_KEY;

const ABBREV_EXPAND = [
  [/\bSt\b/g, 'State'],
  [/\bSE\b/g, 'Southeast'],
  [/\bSW\b/g, 'Southwest'],
  [/\bNE\b/g, 'Northeast'],
  [/\bNW\b/g, 'Northwest'],
  [/\bCSU\b/g, 'Cal State'],
  [/\bInt'l\b/g, 'International'],
  [/\bUniv\./g, 'University'],
  [/\bTenn\b/g, 'Tennessee'],
  [/\bMiss\b/g, 'Mississippi'],
  [/\bFt\./g, 'Fort'],
  [/\bMt\./g, 'Mount'],
  [/Hawai'i/g, 'Hawaii'],
];

const ALIAS_MAP = {
  'Prairie View': 'Prairie View A&M',
  'American': 'American University',
  'Boston Univ.': 'Boston U',
  'Loyola (MD)': 'Loyola (MD)',
  'Miami (OH)': 'Miami (OH)',
  'St. Thomas (MN)': 'St. Thomas (MN)',
};

function norm(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function expandAbbreviations(name) {
  let expanded = name;
  for (const [pat, rep] of ABBREV_EXPAND) {
    expanded = expanded.replace(pat, rep);
  }
  return expanded;
}

function stripMascot(oddsApiName) {
  const parts = oddsApiName.split(' ');
  const candidates = [];
  for (let i = parts.length - 1; i >= 1; i--) {
    candidates.push(parts.slice(0, i).join(' '));
  }
  return candidates;
}

function findByName(name, csvRows) {
  const lc = name.toLowerCase();
  return csvRows.find(r =>
    r.normalizedName.toLowerCase() === lc ||
    r.oddstraderName.toLowerCase() === lc
  );
}

function matchTeam(oddsApiName, csvRows) {
  // Strategy 1: Exact match on existing odds_api_name
  const exact = csvRows.find(r => r.oddsApiName === oddsApiName);
  if (exact) return { row: exact, method: 'EXACT_COL10' };

  // Strategy 2: Strip mascot, try EXPANDED first then direct at each strip level
  // This ensures "Alabama St Hornets" tries "Alabama State" before "Alabama"
  const schoolCandidates = stripMascot(oddsApiName);
  for (const school of schoolCandidates) {
    // Try expanded FIRST (so "Alabama St" → "Alabama State" wins over raw "Alabama")
    const expanded = expandAbbreviations(school);
    if (expanded !== school) {
      const match = findByName(expanded, csvRows);
      if (match) return { row: match, method: `EXPANDED(${school}→${expanded})` };
    }

    // Then try direct match
    const match = findByName(school, csvRows);
    if (match) return { row: match, method: `SCHOOL_STRIP(${school})` };

    // Then check alias map
    if (ALIAS_MAP[school]) {
      const aliasMatch = findByName(ALIAS_MAP[school], csvRows);
      if (aliasMatch) return { row: aliasMatch, method: `ALIAS(${school}→${ALIAS_MAP[school]})` };
    }
  }

  // Strategy 3: Norm includes (last resort) using expanded name
  const expandedFull = expandAbbreviations(oddsApiName);
  const expandedNorm = norm(expandedFull);
  let bestMatch = null;
  let bestLen = 0;
  for (const row of csvRows) {
    for (const name of [row.normalizedName, row.oddstraderName, row.dratingsName, row.haslametricsName]) {
      const rNorm = norm(name);
      if (rNorm.length < 4) continue;
      if ((expandedNorm.includes(rNorm) || rNorm.includes(expandedNorm)) && rNorm.length > bestLen) {
        bestMatch = row;
        bestLen = rNorm.length;
      }
    }
  }
  if (bestMatch) return { row: bestMatch, method: `FUZZY_INCLUDES` };

  return null;
}

async function main() {
  if (!ODDS_API_KEY) {
    console.error('❌ No ODDS_API_KEY in .env');
    process.exit(1);
  }

  // Fetch Odds API teams
  console.log('📡 Fetching Odds API team names...');
  const url = `https://api.the-odds-api.com/v4/sports/basketball_ncaab/odds/?apiKey=${ODDS_API_KEY}&regions=us,eu&markets=spreads&oddsFormat=american&bookmakers=pinnacle,draftkings,fanduel,betmgm,caesars`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`❌ API error: ${res.status}`);
    process.exit(1);
  }
  const remaining = res.headers.get('x-requests-remaining');
  console.log(`   Credits remaining: ${remaining}`);

  const data = await res.json();
  const oddsTeams = new Set();
  for (const g of data) {
    oddsTeams.add(g.away_team);
    oddsTeams.add(g.home_team);
  }
  console.log(`   Found ${oddsTeams.size} unique teams in ${data.length} games\n`);

  // Load CSV
  const csvRaw = readFileSync(CSV_PATH, 'utf-8');
  const lines = csvRaw.trim().split('\n');
  const header = lines[0];
  const headerCols = header.split(',');
  const oddsApiIdx = headerCols.indexOf('odds_api_name');

  const csvRows = lines.slice(1).map((line, idx) => {
    const cols = line.split(',');
    return {
      lineIdx: idx + 1,
      raw: line,
      cols,
      normalizedName: (cols[0] || '').trim(),
      oddstraderName: (cols[1] || '').trim(),
      haslametricsName: (cols[2] || '').trim(),
      dratingsName: (cols[3] || '').trim(),
      oddsApiName: (cols[oddsApiIdx] || '').trim(),
    };
  });

  const matched = [];
  const unmatched = [];
  let newMappings = 0;

  for (const oddsName of [...oddsTeams].sort()) {
    const result = matchTeam(oddsName, csvRows);
    if (result) {
      matched.push({ oddsName, csvName: result.row.normalizedName, method: result.method });

      // Write mapping to CSV if not already there
      if (result.row.oddsApiName !== oddsName) {
        result.row.cols[oddsApiIdx] = oddsName;
        result.row.oddsApiName = oddsName;
        newMappings++;
      }
    } else {
      unmatched.push(oddsName);
    }
  }

  // Report
  console.log(`═══════════════════════════════════════════════════════`);
  console.log(`  MATCHED: ${matched.length}/${oddsTeams.size} teams`);
  console.log(`  NEW MAPPINGS: ${newMappings} (will be written to CSV)`);
  console.log(`  UNMATCHED: ${unmatched.length}`);
  console.log(`═══════════════════════════════════════════════════════\n`);

  if (matched.length > 0) {
    console.log('✅ MATCHED:');
    for (const m of matched) {
      const tag = m.method === 'EXACT_COL10' ? '' : ' [NEW]';
      console.log(`   ${m.oddsName.padEnd(42)} → ${m.csvName}${tag} (${m.method})`);
    }
  }

  if (unmatched.length > 0) {
    console.log('\n❌ UNMATCHED (need manual mapping):');
    for (const u of unmatched) {
      console.log(`   ${u}`);
    }
  }

  // Write updated CSV
  if (newMappings > 0) {
    const updatedLines = [header, ...csvRows.map(r => r.cols.join(','))];
    writeFileSync(CSV_PATH, updatedLines.join('\n') + '\n');
    console.log(`\n💾 CSV updated with ${newMappings} new odds_api_name mappings`);
  } else {
    console.log('\n💾 No new mappings to write');
  }

  const totalMapped = csvRows.filter(r => r.oddsApiName).length;
  console.log(`   Total teams with odds_api_name: ${totalMapped}/${csvRows.length}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
