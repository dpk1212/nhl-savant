/**
 * Friday Nov 28 Mapping Audit
 * Goes through EVERY game 1-by-1 to verify CSV mappings
 */

import { readFileSync } from 'fs';

const basePath = '/Users/dalekolnitys/NHL Savant/nhl-savant/public';

console.log('\n🔍 FRIDAY NOVEMBER 28 MAPPING AUDIT');
console.log('=' .repeat(70));
console.log('Going through EVERY game 1-by-1...\n');

// Read files
const oddsContent = readFileSync(`${basePath}/basketball_odds.md`, 'utf8');
const haslaContent = readFileSync(`${basePath}/haslametrics.md`, 'utf8');
const drateContent = readFileSync(`${basePath}/dratings.md`, 'utf8');
const csvContent = readFileSync(`${basePath}/basketball_teams.csv`, 'utf8');

// Parse CSV
const csvLines = csvContent.split('\n');
const csvMap = new Map();

for (let i = 1; i < csvLines.length; i++) {
  const line = csvLines[i].trim();
  if (!line) continue;
  
  const parts = line.split(',');
  if (parts.length < 6) continue;
  
  const normalized = parts[0];
  const oddstrader = parts[1];
  const haslametrics = parts[2];
  const dratings = parts[3];
  const conference = parts[4];
  const ncaa_name = parts[5];
  
  csvMap.set(oddstrader, {
    normalized,
    oddstrader,
    haslametrics,
    dratings,
    ncaa_name
  });
}

console.log(`✅ Loaded ${csvMap.size} teams from CSV\n`);

// Extract Friday games from OddsTrader
const oddsLines = oddsContent.split('\n');
const fridayGames = [];

for (let i = 0; i < oddsLines.length; i++) {
  const line = oddsLines[i];
  
  // Look for Friday games
  if (line.includes('FRI 11/28') || (line.includes('backgroundLayer') && line.includes('STARTS IN'))) {
    // Extract away team
    const awayMatch = line.match(/<br>(#?\d+)?([A-Za-z\s\(\)\.]+)<br>\d+-\d+/);
    if (awayMatch && oddsLines[i + 1]) {
      const awayTeam = awayMatch[2].trim();
      
      // Extract home team from next line
      const homeLine = oddsLines[i + 1];
      const homeMatch = homeLine.match(/<br>(#?\d+)?([A-Za-z\s\(\)\.]+)<br>\d+-\d+/);
      
      if (homeMatch) {
        const homeTeam = homeMatch[2].trim();
        fridayGames.push({ awayTeam, homeTeam });
      }
    }
  }
}

console.log(`🏀 Found ${fridayGames.length} games on Friday\n`);
console.log('=' .repeat(70));
console.log('CHECKING EACH GAME:\n');

// Check each game
let gameNum = 1;
const missingMappings = [];
const incompleteMappings = [];

for (const game of fridayGames) {
  console.log(`\n${gameNum}. ${game.awayTeam} @ ${game.homeTeam}`);
  console.log('-'.repeat(70));
  
  // Check away team
  const awayMapping = csvMap.get(game.awayTeam);
  if (!awayMapping) {
    console.log(`   ❌ ${game.awayTeam}: NOT IN CSV`);
    missingMappings.push(game.awayTeam);
  } else {
    console.log(`   ✅ ${game.awayTeam}: IN CSV`);
    console.log(`      - haslametrics_name: "${awayMapping.haslametrics}"`);
    console.log(`      - dratings_name: "${awayMapping.dratings}"`);
    console.log(`      - ncaa_name: "${awayMapping.ncaa_name}"`);
    
    if (!awayMapping.haslametrics || awayMapping.haslametrics === 'TBD' || awayMapping.haslametrics === '') {
      console.log(`      ⚠️  NEEDS haslametrics_name`);
      incompleteMappings.push(`${game.awayTeam} (needs Hasla)`);
    }
    if (!awayMapping.dratings || awayMapping.dratings === 'TBD' || awayMapping.dratings === '') {
      console.log(`      ⚠️  NEEDS dratings_name`);
      incompleteMappings.push(`${game.awayTeam} (needs DRate)`);
    }
  }
  
  // Check home team
  const homeMapping = csvMap.get(game.homeTeam);
  if (!homeMapping) {
    console.log(`   ❌ ${game.homeTeam}: NOT IN CSV`);
    missingMappings.push(game.homeTeam);
  } else {
    console.log(`   ✅ ${game.homeTeam}: IN CSV`);
    console.log(`      - haslametrics_name: "${homeMapping.haslametrics}"`);
    console.log(`      - dratings_name: "${homeMapping.dratings}"`);
    console.log(`      - ncaa_name: "${homeMapping.ncaa_name}"`);
    
    if (!homeMapping.haslametrics || homeMapping.haslametrics === 'TBD' || homeMapping.haslametrics === '') {
      console.log(`      ⚠️  NEEDS haslametrics_name`);
      incompleteMappings.push(`${game.homeTeam} (needs Hasla)`);
    }
    if (!homeMapping.dratings || homeMapping.dratings === 'TBD' || homeMapping.dratings === '') {
      console.log(`      ⚠️  NEEDS dratings_name`);
      incompleteMappings.push(`${game.homeTeam} (needs DRate)`);
    }
  }
  
  gameNum++;
}

console.log('\n' + '='.repeat(70));
console.log('SUMMARY:');
console.log('='.repeat(70));
console.log(`Total Games: ${fridayGames.length}`);
console.log(`Teams Missing from CSV: ${missingMappings.length}`);
console.log(`Teams with Incomplete Mappings: ${incompleteMappings.length}`);

if (missingMappings.length > 0) {
  console.log('\n❌ TEAMS TO ADD TO CSV:');
  [...new Set(missingMappings)].forEach(t => console.log(`   - ${t}`));
}

if (incompleteMappings.length > 0) {
  console.log('\n⚠️  TEAMS NEEDING MAPPING UPDATES:');
  [...new Set(incompleteMappings)].forEach(t => console.log(`   - ${t}`));
}

console.log('\n' + '='.repeat(70) + '\n');


