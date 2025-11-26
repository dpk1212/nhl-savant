/**
 * Match NCAA API names to existing CSV teams
 * Shows which teams are truly new vs which just need ncaa_name filled in
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fetch NCAA games
async function fetchNCAAGames() {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
  
  const url = `https://ncaa-api.henrygd.me/scoreboard/basketball-men/d1/${dateStr}`;
  const response = await fetch(url);
  const data = await response.json();
  
  const teams = new Set();
  (data.games || []).forEach(g => {
    if (g.game?.away?.names?.short) teams.add(g.game.away.names.short);
    if (g.game?.home?.names?.short) teams.add(g.game.home.names.short);
  });
  
  return Array.from(teams).sort();
}

// Load CSV
async function loadCSV() {
  const csvPath = path.join(__dirname, '../public/basketball_teams.csv');
  const csvContent = await fs.readFile(csvPath, 'utf8');
  const lines = csvContent.trim().split('\n');
  
  const mappings = [];
  const header = lines[0].split(',');
  const ncaaIndex = header.indexOf('ncaa_name');
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const parts = line.split(',');
    mappings.push({
      lineNum: i + 1,
      normalized: parts[0],
      oddstrader: parts[1],
      haslametrics: parts[2],
      dratings: parts[3],
      conference: parts[4],
      ncaa: ncaaIndex !== -1 && parts[ncaaIndex] ? parts[ncaaIndex] : '',
      notes: parts[parts.length - 1]
    });
  }
  
  return mappings;
}

// Smart match NCAA team to CSV
function smartMatch(ncaaTeam, csvMappings) {
  // 1. Exact NCAA match
  for (const mapping of csvMappings) {
    if (mapping.ncaa === ncaaTeam) {
      return { mapping, matchType: 'exact_ncaa' };
    }
  }
  
  // 2. Exact oddstrader match
  for (const mapping of csvMappings) {
    if (mapping.oddstrader === ncaaTeam) {
      return { mapping, matchType: 'exact_oddstrader' };
    }
  }
  
  // 3. Normalized fuzzy match (handles St. vs State, abbreviations, etc.)
  const norm = ncaaTeam.toLowerCase()
    .replace(/\bst\b\.?/g, 'state')  // St. → state
    .replace(/\./g, '')  // Remove dots
    .replace(/[^a-z0-9]/g, '');
  
  for (const mapping of csvMappings) {
    const normOdds = (mapping.oddstrader || '').toLowerCase()
      .replace(/\bstate\b/g, 'state')
      .replace(/[^a-z0-9]/g, '');
    
    const normNorm = (mapping.normalized || '').toLowerCase()
      .replace(/\bstate\b/g, 'state')
      .replace(/[^a-z0-9]/g, '');
    
    if (normOdds === norm || normNorm === norm) {
      return { mapping, matchType: 'fuzzy' };
    }
  }
  
  // 4. Partial match (for tricky cases)
  const cleanNcaa = ncaaTeam.toLowerCase().replace(/[^a-z]/g, '');
  for (const mapping of csvMappings) {
    const cleanOdds = (mapping.oddstrader || '').toLowerCase().replace(/[^a-z]/g, '');
    const cleanNorm = (mapping.normalized || '').toLowerCase().replace(/[^a-z]/g, '');
    
    // Must match at least 70% of the shorter name
    const minLen = Math.min(cleanNcaa.length, Math.max(cleanOdds.length, cleanNorm.length));
    const matchLen = Math.max(
      longestCommonSubstring(cleanNcaa, cleanOdds),
      longestCommonSubstring(cleanNcaa, cleanNorm)
    );
    
    if (matchLen >= minLen * 0.7 && minLen > 5) {
      return { mapping, matchType: 'partial' };
    }
  }
  
  return null;
}

function longestCommonSubstring(str1, str2) {
  let longest = 0;
  for (let i = 0; i < str1.length; i++) {
    for (let j = 0; j < str2.length; j++) {
      let len = 0;
      while (i + len < str1.length && j + len < str2.length && str1[i + len] === str2[j + len]) {
        len++;
      }
      longest = Math.max(longest, len);
    }
  }
  return longest;
}

async function matchNCAAtoCSV() {
  console.log('=' .repeat(100));
  console.log('MATCH NCAA API NAMES TO EXISTING CSV TEAMS');
  console.log('=' .repeat(100));
  console.log('\n');
  
  const ncaaTeams = await fetchNCAAGames();
  const csvMappings = await loadCSV();
  
  console.log(`📊 ${ncaaTeams.length} unique teams in NCAA API today`);
  console.log(`📋 ${csvMappings.length} teams in CSV\n`);
  
  console.log('=' .repeat(100));
  console.log('MATCHING RESULTS:');
  console.log('=' .repeat(100));
  console.log('\n');
  
  const results = {
    exactMatch: [],
    needsUpdate: [],
    notInCSV: [],
    ambiguous: []
  };
  
  ncaaTeams.forEach((ncaaTeam, idx) => {
    const match = smartMatch(ncaaTeam, csvMappings);
    
    if (!match) {
      results.notInCSV.push(ncaaTeam);
      console.log(`${idx + 1}. ❌ "${ncaaTeam}" → NOT IN CSV (truly new team)`);
    } else if (match.matchType === 'exact_ncaa') {
      results.exactMatch.push({ ncaaTeam, mapping: match.mapping });
      console.log(`${idx + 1}. ✅ "${ncaaTeam}" → "${match.mapping.normalized}" (PERFECT)`);
    } else if (match.matchType === 'exact_oddstrader') {
      results.exactMatch.push({ ncaaTeam, mapping: match.mapping });
      console.log(`${idx + 1}. ✅ "${ncaaTeam}" → "${match.mapping.normalized}" (EXACT ODDSTRADER MATCH)`);
    } else if (match.matchType === 'fuzzy') {
      results.needsUpdate.push({ ncaaTeam, mapping: match.mapping });
      console.log(`${idx + 1}. ⚠️  "${ncaaTeam}" → "${match.mapping.normalized}" (NEEDS ncaa_name UPDATE)`);
    } else {
      results.ambiguous.push({ ncaaTeam, mapping: match.mapping });
      console.log(`${idx + 1}. ❓ "${ncaaTeam}" → "${match.mapping.normalized}"? (AMBIGUOUS - VERIFY!)`);
    }
  });
  
  console.log('\n' + '=' .repeat(100));
  console.log('SUMMARY:');
  console.log('=' .repeat(100));
  console.log(`\n✅ ${results.exactMatch.length} teams already mapped correctly`);
  console.log(`⚠️  ${results.needsUpdate.length} teams need ncaa_name updated in CSV`);
  console.log(`❓ ${results.ambiguous.length} teams are ambiguous (need manual verification)`);
  console.log(`❌ ${results.notInCSV.length} teams truly NOT IN CSV (need to add)\n`);
  
  if (results.needsUpdate.length > 0) {
    console.log('=' .repeat(100));
    console.log('TEAMS NEEDING NCAA_NAME UPDATE:');
    console.log('=' .repeat(100));
    console.log('\n');
    results.needsUpdate.forEach(r => {
      console.log(`Line ${r.mapping.lineNum}: "${r.mapping.normalized}"`);
      console.log(`  Current ncaa_name: "${r.mapping.ncaa}"`);
      console.log(`  Should be: "${r.ncaaTeam}"`);
      console.log(`  Update: Change column 6 from "${r.mapping.ncaa}" to "${r.ncaaTeam}"`);
      console.log('');
    });
  }
  
  if (results.ambiguous.length > 0) {
    console.log('=' .repeat(100));
    console.log('AMBIGUOUS MATCHES (VERIFY THESE!):');
    console.log('=' .repeat(100));
    console.log('\n');
    results.ambiguous.forEach(r => {
      console.log(`NCAA: "${r.ncaaTeam}" → CSV: "${r.mapping.normalized}"?`);
      console.log(`  Is this correct? If YES, update ncaa_name to "${r.ncaaTeam}"`);
      console.log('');
    });
  }
  
  if (results.notInCSV.length > 0) {
    console.log('=' .repeat(100));
    console.log('TRULY NEW TEAMS (ADD TO CSV):');
    console.log('=' .repeat(100));
    console.log('\n');
    results.notInCSV.forEach(team => {
      console.log(`${team},${team},,,,${team},NEW`);
    });
  }
  
  console.log('\n' + '=' .repeat(100));
}

matchNCAAtoCSV();

