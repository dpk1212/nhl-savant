/**
 * Check which games are NOT matching to NCAA API
 */

import fs from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Today's 12 games from OddsTrader
const TODAYS_GAMES = [
  { away: 'South Carolina State', home: 'Chicago State' },
  { away: 'Temple', home: 'Villanova' },
  { away: 'Tarleton State', home: 'Cincinnati' },
  { away: 'Iona', home: 'Delaware' },
  { away: 'North Alabama', home: 'Jacksonville State' },
  { away: 'West Georgia', home: 'Troy' },
  { away: 'St. Francis (PA)', home: 'Xavier' },
  { away: 'UAB', home: 'Middle Tennessee' },
  { away: 'McNeese State', home: 'Incarnate Word' },
  { away: 'Bowling Green', home: 'Kansas State' },
  { away: 'California Baptist', home: 'Colorado' },
  { away: 'Portland', home: 'Stanford' }
];

// Games that ARE matching (from console log)
const MATCHED_GAMES = [
  'Bowling Green @ Kansas State',
  'St. Francis (PA) @ Xavier',
  'Portland @ Stanford',
  'Iona @ Delaware',
  'North Alabama @ Jacksonville State',
  'Temple @ Villanova',
  'California Baptist @ Colorado',
  'Tarleton State @ Cincinnati'
];

async function checkMatching() {
  console.log('\n🔍 NCAA API MATCHING DIAGNOSTIC\n');
  console.log('═'.repeat(80));
  
  // Load CSV
  const csvContent = await fs.readFile(join(__dirname, '../public/basketball_teams.csv'), 'utf8');
  const lines = csvContent.trim().split('\n');
  
  // Parse CSV
  const teamMap = {};
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    const parts = line.split(',');
    if (parts.length < 8) continue;
    
    const oddstraderName = parts[1]?.trim();
    const ncaaName = parts[5]?.trim();
    const espnName = parts[7]?.trim();
    
    if (oddstraderName) {
      teamMap[oddstraderName] = {
        ncaa: ncaaName || null,
        espn: espnName || null
      };
    }
  }
  
  console.log('TODAY\'S GAMES MATCHING STATUS:');
  console.log('═'.repeat(80));
  
  let matchedCount = 0;
  let missingCount = 0;
  const missingTeams = [];
  
  TODAYS_GAMES.forEach((game, i) => {
    const gameStr = `${game.away} @ ${game.home}`;
    const isMatched = MATCHED_GAMES.some(m => m === gameStr);
    
    console.log(`\n${i + 1}. ${gameStr}`);
    
    if (isMatched) {
      console.log('   ✅ MATCHED - Live scores working');
      matchedCount++;
    } else {
      console.log('   ❌ NOT MATCHED - No live scores');
      missingCount++;
      
      // Check CSV mappings
      const awayMapping = teamMap[game.away];
      const homeMapping = teamMap[game.home];
      
      console.log(`   Away (${game.away}):`);
      console.log(`      NCAA Name: ${awayMapping?.ncaa || '❌ MISSING'}`);
      console.log(`      ESPN Name: ${awayMapping?.espn || '❌ MISSING'}`);
      
      console.log(`   Home (${game.home}):`);
      console.log(`      NCAA Name: ${homeMapping?.ncaa || '❌ MISSING'}`);
      console.log(`      ESPN Name: ${homeMapping?.espn || '❌ MISSING'}`);
      
      if (!awayMapping?.espn) missingTeams.push(game.away);
      if (!homeMapping?.espn) missingTeams.push(game.home);
    }
  });
  
  console.log('\n' + '═'.repeat(80));
  console.log('SUMMARY');
  console.log('═'.repeat(80));
  console.log(`✅ Matched:     ${matchedCount}/12 games`);
  console.log(`❌ Not Matched: ${missingCount}/12 games`);
  
  if (missingTeams.length > 0) {
    console.log('\n📝 TEAMS NEEDING ESPN/NCAA NAMES:');
    [...new Set(missingTeams)].forEach(t => console.log(`   - ${t}`));
  }
  
  console.log('\n💡 NEXT STEP:');
  console.log('   Check NCAA API output to get exact team names for missing teams\n');
}

checkMatching().catch(console.error);

