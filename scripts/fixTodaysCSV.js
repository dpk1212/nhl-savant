/**
 * Fix Today's Basketball CSV Mappings
 * 
 * Processes today's scraped data and identifies teams needing CSV mappings
 * Outputs clear instructions for what needs to be added/fixed
 * 
 * Usage: npm run fix-todays-csv
 */

import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parseBasketballOdds } from '../src/utils/basketballOddsParser.js';
import { parseHaslametrics } from '../src/utils/haslametricsParser.js';
import { parseDRatings } from '../src/utils/dratingsParser.js';
import { loadTeamMappings, findTeamMapping } from '../src/utils/teamCSVLoader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function fixTodaysCSV() {
  console.log('\n' + '='.repeat(80));
  console.log('🔧 FIX TODAY\'S BASKETBALL CSV MAPPINGS');
  console.log('='.repeat(80) + '\n');
  
  try {
    // 1. Load today's scraped data
    console.log('📂 Loading today\'s scraped data...\n');
    const oddsMarkdown = await readFile(join(__dirname, '../public/basketball_odds.md'), 'utf8');
    const haslaMarkdown = await readFile(join(__dirname, '../public/haslametrics.md'), 'utf8');
    const drateMarkdown = await readFile(join(__dirname, '../public/dratings.md'), 'utf8');
    const csvContent = await readFile(join(__dirname, '../public/basketball_teams.csv'), 'utf8');
    
    // 2. Parse all sources
    const oddsGames = parseBasketballOdds(oddsMarkdown);
    const haslaData = parseHaslametrics(haslaMarkdown);
    const dratePreds = parseDRatings(drateMarkdown);
    const teamMappings = loadTeamMappings(csvContent);
    
    console.log(`✅ OddsTrader:   ${oddsGames.length} games`);
    console.log(`✅ Haslametrics: ${haslaData.games.length} games`);
    console.log(`✅ D-Ratings:    ${dratePreds.length} predictions`);
    console.log(`✅ CSV:          ${teamMappings.size} teams mapped\n`);
    
    // 3. Extract all unique teams from today's data
    const oddsTeams = new Set();
    oddsGames.forEach(g => {
      oddsTeams.add(g.awayTeam);
      oddsTeams.add(g.homeTeam);
    });
    
    const haslaTeamsMap = new Map(); // normalized -> raw
    haslaData.games.forEach(g => {
      haslaTeamsMap.set(g.awayTeam, g.awayTeamRaw);
      haslaTeamsMap.set(g.homeTeam, g.homeTeamRaw);
    });
    
    const drateTeamsSet = new Set();
    dratePreds.forEach(p => {
      drateTeamsSet.add(p.awayTeam);
      drateTeamsSet.add(p.homeTeam);
    });
    
    console.log('📊 TODAY\'S UNIQUE TEAMS:');
    console.log('='.repeat(80));
    console.log(`OddsTrader:   ${oddsTeams.size} teams`);
    console.log(`Haslametrics: ${haslaTeamsMap.size} teams`);
    console.log(`D-Ratings:    ${drateTeamsSet.size} teams\n`);
    
    // 4. Identify teams needing mappings
    const teamsNeedingHelp = [];
    
    for (const oddsTeam of Array.from(oddsTeams).sort()) {
      const mapping = findTeamMapping(teamMappings, oddsTeam, 'oddstrader');
      
      if (!mapping) {
        teamsNeedingHelp.push({
          oddsTrader: oddsTeam,
          status: 'MISSING_FROM_CSV',
          hasla: null,
          drate: null
        });
        continue;
      }
      
      // Check if Haslametrics mapping is missing or wrong
      let haslaStatus = 'OK';
      let haslaSuggestions = [];
      
      if (!mapping.haslametrics) {
        haslaStatus = 'EMPTY';
        // Find similar teams in Haslametrics
        haslaSuggestions = Array.from(haslaTeamsMap.values()).filter(rawName => {
          const nameLower = rawName.toLowerCase();
          const oddsLower = oddsTeam.toLowerCase();
          return nameLower.includes(oddsLower.split(' ')[0]) || 
                 oddsLower.includes(nameLower.split(' ')[0]);
        });
      } else {
        // Check if the mapped name exists in today's data
        const exists = Array.from(haslaTeamsMap.values()).includes(mapping.haslametrics);
        if (!exists) {
          haslaStatus = 'WRONG';
          haslaSuggestions = Array.from(haslaTeamsMap.values()).filter(rawName => {
            const nameLower = rawName.toLowerCase();
            const oddsLower = oddsTeam.toLowerCase();
            return nameLower.includes(oddsLower.split(' ')[0]) || 
                   oddsLower.includes(nameLower.split(' ')[0]);
          });
        }
      }
      
      // Check if D-Ratings mapping is missing or wrong
      let drateStatus = 'OK';
      let drateSuggestions = [];
      
      if (!mapping.dratings) {
        drateStatus = 'EMPTY';
        // Find similar teams in D-Ratings
        drateSuggestions = Array.from(drateTeamsSet).filter(drateName => {
          const nameLower = drateName.toLowerCase();
          const oddsLower = oddsTeam.toLowerCase();
          return nameLower.includes(oddsLower.split(' ')[0]) || 
                 oddsLower.includes(nameLower.split(' ')[0]);
        });
      } else {
        // Check if the mapped name exists in today's data
        const exists = drateTeamsSet.has(mapping.dratings);
        if (!exists) {
          drateStatus = 'WRONG';
          drateSuggestions = Array.from(drateTeamsSet).filter(drateName => {
            const nameLower = drateName.toLowerCase();
            const oddsLower = oddsTeam.toLowerCase();
            return nameLower.includes(oddsLower.split(' ')[0]) || 
                   oddsLower.includes(nameLower.split(' ')[0]);
          });
        }
      }
      
      if (haslaStatus !== 'OK' || drateStatus !== 'OK') {
        teamsNeedingHelp.push({
          oddsTrader: oddsTeam,
          status: 'NEEDS_UPDATE',
          haslaStatus,
          haslaCurrent: mapping.haslametrics || null,
          haslaSuggestions,
          drateStatus,
          drateCurrent: mapping.dratings || null,
          drateSuggestions,
          csvLine: findCSVLine(csvContent, oddsTeam)
        });
      }
    }
    
    // 5. Display results
    if (teamsNeedingHelp.length === 0) {
      console.log('🎉 SUCCESS! All OddsTrader teams have correct CSV mappings!\n');
      process.exit(0);
    }
    
    console.log('='.repeat(80));
    console.log(`🔧 TEAMS NEEDING CSV UPDATES: ${teamsNeedingHelp.length}`);
    console.log('='.repeat(80) + '\n');
    
    teamsNeedingHelp.forEach((team, idx) => {
      console.log(`${idx + 1}. ${team.oddsTrader}`);
      
      if (team.status === 'MISSING_FROM_CSV') {
        console.log(`   ❌ NOT IN CSV - needs to be added`);
        console.log(`   Suggested line:`);
        console.log(`   ${team.oddsTrader},${team.oddsTrader},<FIND_HASLA>,<FIND_DRATE>,TBD,NEW\n`);
        return;
      }
      
      console.log(`   CSV Line: ${team.csvLine}`);
      
      // Haslametrics
      if (team.haslaStatus === 'EMPTY') {
        console.log(`   📊 HASLAMETRICS: Empty - needs mapping`);
        if (team.haslaSuggestions.length > 0) {
          console.log(`      Options from today's Haslametrics data:`);
          team.haslaSuggestions.forEach(s => console.log(`        - "${s}"`));
        } else {
          console.log(`      ⚠️  No similar teams found in today's Haslametrics`);
          console.log(`      This team may not be covered by Haslametrics`);
        }
      } else if (team.haslaStatus === 'WRONG') {
        console.log(`   📊 HASLAMETRICS: "${team.haslaCurrent}" ← NOT IN TODAY'S DATA`);
        if (team.haslaSuggestions.length > 0) {
          console.log(`      Options from today's data:`);
          team.haslaSuggestions.forEach(s => console.log(`        - "${s}"`));
        } else {
          console.log(`      ⚠️  No similar teams found - may not be covered today`);
        }
      } else {
        console.log(`   ✅ HASLAMETRICS: "${team.haslaCurrent}"`);
      }
      
      // D-Ratings
      if (team.drateStatus === 'EMPTY') {
        console.log(`   🎯 D-RATINGS: Empty - needs mapping`);
        if (team.drateSuggestions.length > 0) {
          console.log(`      Options from today's D-Ratings data:`);
          team.drateSuggestions.forEach(s => console.log(`        - "${s}"`));
        } else {
          console.log(`      ⚠️  No similar teams found in today's D-Ratings`);
          console.log(`      This team may not be covered by D-Ratings`);
        }
      } else if (team.drateStatus === 'WRONG') {
        console.log(`   🎯 D-RATINGS: "${team.drateCurrent}" ← NOT IN TODAY'S DATA`);
        if (team.drateSuggestions.length > 0) {
          console.log(`      Options from today's data:`);
          team.drateSuggestions.forEach(s => console.log(`        - "${s}"`));
        } else {
          console.log(`      ⚠️  No similar teams found - may not be covered today`);
        }
      } else {
        console.log(`   ✅ D-RATINGS: "${team.drateCurrent}"`);
      }
      
      console.log('');
    });
    
    // 6. Show all available team names for reference
    console.log('='.repeat(80));
    console.log('📋 ALL AVAILABLE TEAMS IN TODAY\'S DATA');
    console.log('='.repeat(80) + '\n');
    
    console.log('HASLAMETRICS (raw names):');
    console.log('-'.repeat(80));
    Array.from(haslaTeamsMap.values()).sort().forEach(name => {
      console.log(`  "${name}"`);
    });
    
    console.log('\nD-RATINGS (school names):');
    console.log('-'.repeat(80));
    Array.from(drateTeamsSet).sort().forEach(name => {
      console.log(`  "${name}"`);
    });
    
    console.log('\n' + '='.repeat(80));
    console.log('📝 NEXT STEPS');
    console.log('='.repeat(80));
    console.log('\n1. For each team listed above, identify the correct mapping');
    console.log('2. If team is not in Haslametrics/D-Ratings today, that\'s OK - leave empty');
    console.log('3. Update the CSV with the correct mappings');
    console.log('4. Re-run this script to verify\n');
    
    process.exit(1);
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

function findCSVLine(csvContent, oddsTeamName) {
  const lines = csvContent.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith(oddsTeamName + ',')) {
      return i + 1;
    }
  }
  return '?';
}

fixTodaysCSV().catch(console.error);

