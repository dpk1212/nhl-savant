/**
 * Test CSV Mapping - Show what needs to be fixed
 */

import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parseBasketballOdds } from '../src/utils/basketballOddsParser.js';
import { parseHaslametrics } from '../src/utils/haslametricsParser.js';
import { parseDRatings } from '../src/utils/dratingsParser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function testCSVMapping() {
  console.log('\n🧪 TESTING CSV MAPPINGS');
  console.log('==========================================\n');
  
  // Load data
  const oddsMarkdown = await readFile(join(__dirname, '../public/basketball_odds.md'), 'utf8');
  const haslaMarkdown = await readFile(join(__dirname, '../public/haslametrics.md'), 'utf8');
  const drateMarkdown = await readFile(join(__dirname, '../public/dratings.md'), 'utf8');
  const csvContent = await readFile(join(__dirname, '../public/basketball_teams.csv'), 'utf8');
  
  // Parse
  const oddsGames = parseBasketballOdds(oddsMarkdown);
  const haslaData = parseHaslametrics(haslaMarkdown);
  const dratePreds = parseDRatings(drateMarkdown);
  
  // Get unique teams from each source
  const haslaTeams = new Set();
  haslaData.games.forEach(g => {
    haslaTeams.add(g.awayTeamRaw);
    haslaTeams.add(g.homeTeamRaw);
  });
  
  const drateTeams = new Set();
  dratePreds.forEach(g => {
    drateTeams.add(g.awayTeam);
    drateTeams.add(g.homeTeam);
  });
  
  console.log(`📊 Data loaded:`);
  console.log(`   OddsTrader: ${oddsGames.length} games`);
  console.log(`   Haslametrics: ${haslaTeams.size} unique teams`);
  console.log(`   D-Ratings: ${drateTeams.size} unique teams\n`);
  
  // Parse CSV - properly handle quoted values
  const csvLines = csvContent.split('\n');
  const csvTeams = new Map();
  
  for (let i = 1; i < csvLines.length; i++) {
    const line = csvLines[i].trim();
    if (!line) continue;
    
    // Simple split (buildTeamCSV doesn't quote values)
    const parts = line.split(',');
    if (parts.length < 4) continue;
    
    const oddstraderName = parts[1]?.trim(); // oddstrader_name column
    const haslaName = parts[2]?.trim();      // haslametrics_name column
    const drateName = parts[3]?.trim();      // dratings_name column
    
    if (oddstraderName) {
      csvTeams.set(oddstraderName, {
        hasla: haslaName || '',
        drate: drateName || ''
      });
    }
  }
  
  console.log(`📋 CSV has ${csvTeams.size} OddsTrader teams\n`);
  
  // Get all unique OddsTrader teams from today
  const oddsTeams = new Set();
  oddsGames.forEach(g => {
    oddsTeams.add(g.awayTeam);
    oddsTeams.add(g.homeTeam);
  });
  
  console.log('🔍 CHECKING EACH ODDSTRADER TEAM:\n');
  console.log('==========================================\n');
  
  let needsMapping = [];
  let fullyMapped = 0;
  let missingHasla = 0;
  let missingDrate = 0;
  
  Array.from(oddsTeams).sort().forEach(team => {
    const mapping = csvTeams.get(team);
    
    if (!mapping) {
      console.log(`❌ "${team}" - NOT IN CSV AT ALL`);
      needsMapping.push({ team, issue: 'NOT_IN_CSV', hasla: null, drate: null });
      return;
    }
    
    const hasHasla = mapping.hasla && mapping.hasla.length > 0;
    const hasDrate = mapping.drate && mapping.drate.length > 0;
    
    if (hasHasla && hasDrate) {
      fullyMapped++;
    } else {
      let issues = [];
      if (!hasHasla) {
        issues.push('MISSING HASLA');
        missingHasla++;
      }
      if (!hasDrate) {
        issues.push('MISSING DRATE');
        missingDrate++;
      }
      
      console.log(`⚠️  "${team}" - ${issues.join(' + ')}`);
      console.log(`    CSV has: hasla="${mapping.hasla || ''}" drate="${mapping.drate || ''}"`);
      
      // Show available matches
      if (!hasHasla) {
        const haslaMatches = Array.from(haslaTeams).filter(h => 
          h.toLowerCase().includes(team.toLowerCase().split(' ')[0]) ||
          team.toLowerCase().includes(h.toLowerCase().split(' ')[0])
        ).slice(0, 3);
        if (haslaMatches.length > 0) {
          console.log(`    Available in Hasla: ${haslaMatches.map(m => `"${m}"`).join(', ')}`);
        }
      }
      
      if (!hasDrate) {
        const drateMatches = Array.from(drateTeams).filter(d => 
          d.toLowerCase().includes(team.toLowerCase().split(' ')[0]) ||
          team.toLowerCase().includes(d.toLowerCase().split(' ')[0])
        ).slice(0, 3);
        if (drateMatches.length > 0) {
          console.log(`    Available in DRate: ${drateMatches.map(m => `"${m}"`).join(', ')}`);
        }
      }
      console.log('');
      
      needsMapping.push({ 
        team, 
        issue: issues.join('+'),
        hasla: mapping.hasla || '',
        drate: mapping.drate || ''
      });
    }
  });
  
  console.log('\n📊 SUMMARY:');
  console.log('==========================================');
  console.log(`✅ Fully mapped: ${fullyMapped}/${oddsTeams.size}`);
  console.log(`⚠️  Missing Haslametrics: ${missingHasla}`);
  console.log(`⚠️  Missing D-Ratings: ${missingDrate}`);
  console.log(`❌ Not in CSV: ${needsMapping.filter(n => n.issue === 'NOT_IN_CSV').length}`);
  console.log(`\n📝 SCHOOLS THAT NEED FIXING: ${needsMapping.length}\n`);
  
  if (needsMapping.length > 0) {
    console.log('THESE TEAMS NEED TO BE ADDED TO CSV:');
    console.log('=====================================\n');
    needsMapping.forEach(item => {
      console.log(`"${item.team}" - ${item.issue}`);
    });
  }
}

testCSVMapping()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });

