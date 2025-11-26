/**
 * NCAA API Mapping Audit Tool
 * Verifies CSV mappings against actual NCAA API team names for bet grading
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fetch NCAA games for a specific date
async function fetchNCAAGames(dateStr = null) {
  if (!dateStr) {
    const today = new Date();
    dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
  }
  
  try {
    const url = `https://ncaa-api.henrygd.me/scoreboard/basketball-men/d1/${dateStr}`;
    console.log(`📡 Fetching NCAA API: ${url}\n`);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`NCAA API error: ${response.status}`);
    }
    
    const data = await response.json();
    const games = data.games || [];
    
    console.log(`✅ Fetched ${games.length} games from NCAA API\n`);
    
    return games.map(g => ({
      awayTeam: g.game?.away?.names?.short || '',
      homeTeam: g.game?.home?.names?.short || '',
      awayScore: g.game?.away?.score || '',
      homeScore: g.game?.home?.score || '',
      gameState: g.game?.gameState || 'pre',
      gameID: g.game?.gameID || ''
    }));
  } catch (error) {
    console.error('Error fetching NCAA games:', error);
    return [];
  }
}

// Load CSV mappings
async function loadCSVMappings() {
  const csvPath = path.join(__dirname, '../public/basketball_teams.csv');
  const csvContent = await fs.readFile(csvPath, 'utf8');
  const lines = csvContent.trim().split('\n');
  
  const mappings = new Map();
  const header = lines[0].split(',');
  
  // Check if ncaa_name column exists
  const ncaaIndex = header.indexOf('ncaa_name');
  const hasNcaaColumn = ncaaIndex !== -1;
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const parts = line.split(',');
    if (parts.length < 5) continue;
    
    const normalized = parts[0];
    const oddstrader = parts[1];
    const haslametrics = parts[2];
    const dratings = parts[3];
    const ncaa = hasNcaaColumn && parts[ncaaIndex] ? parts[ncaaIndex] : '';
    
    mappings.set(normalized, {
      normalized,
      oddstrader,
      haslametrics,
      dratings,
      ncaa
    });
  }
  
  return { mappings, hasNcaaColumn };
}

// Normalize team name for fuzzy matching
function normalizeTeam(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/state$/, 'st')
    .replace(/university/, '')
    .replace(/college/, '');
}

// Find mapping for NCAA team name
function findMapping(mappings, ncaaTeamName) {
  // First try exact NCAA name match
  for (const [key, mapping] of mappings) {
    if (mapping.ncaa && mapping.ncaa === ncaaTeamName) {
      return { mapping, matchType: 'exact_ncaa' };
    }
  }
  
  // Try oddstrader name match
  for (const [key, mapping] of mappings) {
    if (mapping.oddstrader === ncaaTeamName) {
      return { mapping, matchType: 'exact_oddstrader' };
    }
  }
  
  // Try fuzzy match on normalized names
  const normNcaa = normalizeTeam(ncaaTeamName);
  for (const [key, mapping] of mappings) {
    const normOdds = normalizeTeam(mapping.oddstrader || '');
    const normNorm = normalizeTeam(mapping.normalized || '');
    
    if (normOdds === normNcaa || normNorm === normNcaa) {
      return { mapping, matchType: 'fuzzy' };
    }
  }
  
  return null;
}

// Main audit function
async function auditNCAAMapping() {
  console.log('=' .repeat(100));
  console.log('NCAA API MAPPING AUDIT');
  console.log('=' .repeat(100));
  console.log('\n');
  
  // Load CSV
  const { mappings, hasNcaaColumn } = await loadCSVMappings();
  console.log(`📋 Loaded ${mappings.size} team mappings from CSV`);
  
  if (!hasNcaaColumn) {
    console.log('⚠️  WARNING: CSV does NOT have ncaa_name column yet!');
    console.log('   Run: node scripts/addNCAAnamestoCSV.js\n');
  } else {
    // Check how many teams have NCAA mappings
    let withNcaa = 0;
    let withoutNcaa = 0;
    for (const [key, mapping] of mappings) {
      if (mapping.ncaa) withNcaa++;
      else withoutNcaa++;
    }
    console.log(`   ✅ ${withNcaa} teams have ncaa_name`);
    console.log(`   ❌ ${withoutNcaa} teams missing ncaa_name\n`);
  }
  
  // Fetch today's NCAA games
  const ncaaGames = await fetchNCAAGames();
  
  if (ncaaGames.length === 0) {
    console.log('❌ No games fetched from NCAA API');
    return;
  }
  
  console.log('=' .repeat(100));
  console.log('GAME-BY-GAME NCAA API AUDIT');
  console.log('=' .repeat(100));
  console.log('\n');
  
  let perfectMatch = 0;
  let fuzzyMatch = 0;
  let notInCSV = 0;
  let missingNcaaName = 0;
  
  const teamsNotInCSV = new Set();
  const teamsMissingNcaa = new Set();
  
  ncaaGames.forEach((game, idx) => {
    console.log(`GAME ${idx + 1}: ${game.awayTeam} @ ${game.homeTeam} (${game.gameState})`);
    console.log('-'.repeat(100));
    
    // Check away team
    const awayResult = findMapping(mappings, game.awayTeam);
    if (!awayResult) {
      console.log(`  ❌ AWAY: "${game.awayTeam}" NOT IN CSV`);
      teamsNotInCSV.add(game.awayTeam);
      notInCSV++;
    } else if (awayResult.matchType === 'exact_ncaa') {
      console.log(`  ✅ AWAY: "${game.awayTeam}" → CSV: "${awayResult.mapping.normalized}" (EXACT NCAA MATCH)`);
      perfectMatch++;
    } else if (awayResult.matchType === 'exact_oddstrader') {
      console.log(`  ⚠️  AWAY: "${game.awayTeam}" → CSV: "${awayResult.mapping.normalized}" (MATCHED VIA ODDSTRADER)`);
      if (!awayResult.mapping.ncaa) {
        console.log(`     Missing ncaa_name in CSV!`);
        teamsMissingNcaa.add(awayResult.mapping.normalized);
        missingNcaaName++;
      }
      fuzzyMatch++;
    } else {
      console.log(`  ⚠️  AWAY: "${game.awayTeam}" → CSV: "${awayResult.mapping.normalized}" (FUZZY MATCH - UNRELIABLE!)`);
      if (!awayResult.mapping.ncaa) {
        console.log(`     Missing ncaa_name in CSV!`);
        teamsMissingNcaa.add(awayResult.mapping.normalized);
        missingNcaaName++;
      }
      fuzzyMatch++;
    }
    
    // Check home team
    const homeResult = findMapping(mappings, game.homeTeam);
    if (!homeResult) {
      console.log(`  ❌ HOME: "${game.homeTeam}" NOT IN CSV`);
      teamsNotInCSV.add(game.homeTeam);
      notInCSV++;
    } else if (homeResult.matchType === 'exact_ncaa') {
      console.log(`  ✅ HOME: "${game.homeTeam}" → CSV: "${homeResult.mapping.normalized}" (EXACT NCAA MATCH)`);
      perfectMatch++;
    } else if (homeResult.matchType === 'exact_oddstrader') {
      console.log(`  ⚠️  HOME: "${game.homeTeam}" → CSV: "${homeResult.mapping.normalized}" (MATCHED VIA ODDSTRADER)`);
      if (!homeResult.mapping.ncaa) {
        console.log(`     Missing ncaa_name in CSV!`);
        teamsMissingNcaa.add(homeResult.mapping.normalized);
        missingNcaaName++;
      }
      fuzzyMatch++;
    } else {
      console.log(`  ⚠️  HOME: "${game.homeTeam}" → CSV: "${homeResult.mapping.normalized}" (FUZZY MATCH - UNRELIABLE!)`);
      if (!homeResult.mapping.ncaa) {
        console.log(`     Missing ncaa_name in CSV!`);
        teamsMissingNcaa.add(homeResult.mapping.normalized);
        missingNcaaName++;
      }
      fuzzyMatch++;
    }
    
    console.log('');
  });
  
  console.log('=' .repeat(100));
  console.log('SUMMARY');
  console.log('=' .repeat(100));
  console.log(`\nTotal teams checked: ${ncaaGames.length * 2}`);
  console.log(`  ✅ Perfect NCAA matches: ${perfectMatch}`);
  console.log(`  ⚠️  Fuzzy matches (unreliable): ${fuzzyMatch}`);
  console.log(`  ❌ Not in CSV: ${notInCSV}`);
  console.log(`  ⚠️  Missing ncaa_name in CSV: ${missingNcaaName}`);
  
  const totalTeams = ncaaGames.length * 2;
  const matchRate = ((perfectMatch / totalTeams) * 100).toFixed(1);
  console.log(`\n📊 NCAA EXACT MATCH RATE: ${matchRate}% (TARGET: 100%)`);
  
  if (teamsNotInCSV.size > 0) {
    console.log(`\n❌ TEAMS NOT IN CSV (${teamsNotInCSV.size}):`);
    Array.from(teamsNotInCSV).sort().forEach(team => {
      console.log(`   "${team}"`);
    });
  }
  
  if (teamsMissingNcaa.size > 0) {
    console.log(`\n⚠️  TEAMS IN CSV BUT MISSING ncaa_name (${teamsMissingNcaa.size}):`);
    Array.from(teamsMissingNcaa).sort().forEach(team => {
      console.log(`   "${team}"`);
    });
  }
  
  console.log('\n' + '=' .repeat(100));
  console.log('NEXT STEPS:');
  console.log('=' .repeat(100));
  if (!hasNcaaColumn) {
    console.log('1. Add ncaa_name column: node scripts/addNCAAnamestoCSV.js');
    console.log('2. Re-run this audit to see which teams need NCAA names filled in');
  } else if (matchRate < 100) {
    console.log('1. For teams NOT IN CSV: Add them to basketball_teams.csv');
    console.log('2. For teams MISSING ncaa_name: Update their CSV row with exact NCAA API name');
    console.log('3. Go GAME BY GAME and fix each mapping');
    console.log('4. Re-run audit until 100% match rate');
  } else {
    console.log('✅ All teams mapped correctly! Bet grading will be accurate.');
  }
  console.log('=' .repeat(100));
}

auditNCAAMapping();

