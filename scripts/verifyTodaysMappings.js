/**
 * Verify today's team mappings - check which teams need CSV fixes
 */

import fs from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Today's teams from OddsTrader (Mon 12/01/2025)
const TODAYS_TEAMS = [
  'South Carolina State',
  'Chicago State',
  'Temple',
  'Villanova',
  'Tarleton State',
  'Cincinnati',
  'Iona',
  'Delaware',
  'North Alabama',
  'Jacksonville State',
  'West Georgia',
  'Troy',
  'St. Francis (PA)',
  'Xavier',
  'UAB',
  'Middle Tennessee',
  'McNeese State',
  'Incarnate Word',
  'Bowling Green',
  'Kansas State',
  'California Baptist',
  'Colorado',
  'Portland',
  'Stanford'
];

async function verifyMappings() {
  console.log('\n🔍 VERIFYING TODAY\'S TEAM MAPPINGS\n');
  console.log(`📅 Checking ${TODAYS_TEAMS.length} teams from Mon 12/01\n`);
  
  // Load CSV
  const csvPath = join(__dirname, '../public/basketball_teams.csv');
  const csvContent = await fs.readFile(csvPath, 'utf8');
  const lines = csvContent.trim().split('\n');
  
  // Parse CSV into map: oddstrader_name -> {haslametrics_name, dratings_name, espn_name}
  const teamMap = {};
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    
    // CSV format: normalized_name,oddstrader_name,haslametrics_name,dratings_name,conference,ncaa_name,notes,espn_name
    const parts = line.split(',');
    if (parts.length < 8) continue;
    
    const oddstraderName = parts[1]?.trim();
    const haslaName = parts[2]?.trim();
    const drateName = parts[3]?.trim();
    const ncaaName = parts[5]?.trim();
    const espnName = parts[7]?.trim();
    
    if (oddstraderName) {
      teamMap[oddstraderName] = {
        haslametrics: haslaName || null,
        dratings: drateName || null,
        ncaa: ncaaName || null,
        espn: espnName || null
      };
    }
  }
  
  console.log(`✅ Loaded ${Object.keys(teamMap).length} teams from CSV\n`);
  console.log('═'.repeat(80));
  console.log('TEAM MAPPING VERIFICATION');
  console.log('═'.repeat(80));
  
  let allGood = 0;
  let missingInCSV = [];
  let missingHasla = [];
  let missingDrate = [];
  let missingESPN = [];
  
  for (const team of TODAYS_TEAMS) {
    const mapping = teamMap[team];
    
    if (!mapping) {
      console.log(`\n❌ ${team}`);
      console.log(`   NOT IN CSV - needs to be added!`);
      missingInCSV.push(team);
      continue;
    }
    
    let issues = [];
    if (!mapping.haslametrics) issues.push('❌ HASLA');
    if (!mapping.dratings) issues.push('❌ DRATE');
    if (!mapping.espn) issues.push('❌ ESPN');
    
    if (issues.length > 0) {
      console.log(`\n⚠️  ${team}`);
      console.log(`   ${issues.join(' ')}`);
      if (!mapping.haslametrics) missingHasla.push(team);
      if (!mapping.dratings) missingDrate.push(team);
      if (!mapping.espn) missingESPN.push(team);
    } else {
      console.log(`\n✅ ${team}`);
      console.log(`   HASLA: ${mapping.haslametrics}`);
      console.log(`   DRATE: ${mapping.dratings}`);
      console.log(`   ESPN:  ${mapping.espn}`);
      allGood++;
    }
  }
  
  console.log('\n' + '═'.repeat(80));
  console.log('SUMMARY');
  console.log('═'.repeat(80));
  console.log(`✅ Fully mapped:        ${allGood}/${TODAYS_TEAMS.length}`);
  console.log(`❌ Not in CSV:          ${missingInCSV.length}`);
  console.log(`⚠️  Missing Hasla:      ${missingHasla.length}`);
  console.log(`⚠️  Missing D-Ratings:  ${missingDrate.length}`);
  console.log(`⚠️  Missing ESPN:       ${missingESPN.length}`);
  
  if (missingInCSV.length > 0) {
    console.log('\n📝 TEAMS TO ADD TO CSV:');
    missingInCSV.forEach(t => console.log(`   - ${t}`));
  }
  
  if (missingHasla.length > 0) {
    console.log('\n📝 TEAMS NEEDING HASLAMETRICS NAME:');
    missingHasla.forEach(t => console.log(`   - ${t}`));
  }
  
  if (missingDrate.length > 0) {
    console.log('\n📝 TEAMS NEEDING D-RATINGS NAME:');
    missingDrate.forEach(t => console.log(`   - ${t}`));
  }
  
  if (missingESPN.length > 0) {
    console.log('\n📝 TEAMS NEEDING ESPN NAME:');
    missingESPN.forEach(t => console.log(`   - ${t}`));
  }
  
  console.log('\n');
}

verifyMappings().catch(console.error);

