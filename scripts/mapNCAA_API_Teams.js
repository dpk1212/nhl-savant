/**
 * Map OddsTrader team names to NCAA API names
 * Uses LIVE NCAA API data to get exact names
 */

import https from 'https';
import { readFileSync, writeFileSync } from 'fs';

// Teams that need NCAA mapping from the console
const teamsNeedingMapping = [
  'Alabama A&M', 'Albany', 'Alcorn State', 'American University', 'Arkansas State',
  'Ball State', 'Butler', 'Charleston Southern', 'Chicago State', 'Clemson',
  'Cleveland State', 'Colgate', 'Connecticut', 'Davidson', 'DePaul',
  'Drake', 'Eastern Illinois', 'Georgia Tech', 'Hawaii', 'Hofstra',
  'Illinois', 'Jackson State', 'LSU', 'La Salle', 'Lafayette',
  'Le Moyne', 'Lehigh', 'Longwood', 'Louisiana', 'Loyola Marymount',
  'Maine', 'Marquette', 'Merrimack', 'Mississippi State', 'Missouri',
  'Monmouth', 'N.J.I.T.', 'Nicholls State', 'North Carolina A&T', 'North Dakota',
  'Northeastern', 'Ohio State', 'Oklahoma', 'Pennsylvania', 'Pittsburgh',
  'Purdue', 'Queens University of Charlotte', 'SMU', 'Seattle', 'Siena',
  'South Carolina', 'Southern Utah', 'Stony Brook', 'Texas A&M', 'Texas A&M-CC',
  'Texas State', 'Tulane', 'UC Santa Barbara', 'Virginia', 'Wright State', 'Xavier'
];

// Manual mappings for teams not playing today or with special cases
const manualMappings = {
  'Alabama A&M': 'Alabama A&M',
  'Alcorn State': 'Alcorn St.',
  'Arkansas State': 'Arkansas St.',
  'Cal State Northridge': 'Cal State Northridge',
  'Charleston Southern': 'Charleston Southern',
  'Connecticut': 'UConn',
  'Georgia Tech': 'Georgia Tech',
  'Hofstra': 'Hofstra',
  'Jackson State': 'Jackson St.',
  'La Salle': 'La Salle',
  'Lafayette': 'Lafayette',
  'Le Moyne': 'Le Moyne',
  'Lehigh': 'Lehigh',
  'Longwood': 'Longwood',
  'Loyola Marymount': 'Loyola Marymount',
  'Maine': 'Maine',
  'Merrimack': 'Merrimack',
  'Nicholls State': 'Nicholls St.',
  'North Carolina A&T': 'N.C. A&T',
  'North Dakota': 'North Dakota',
  'Pennsylvania': 'Penn',
  'Queens University of Charlotte': 'Queens',
  'Siena': 'Siena',
  'Southern Utah': 'Southern Utah',
  'Stony Brook': 'Stony Brook',
  'Texas A&M-CC': 'Texas A&M-CC',
  'Texas State': 'Texas State',
  'UC Santa Barbara': 'UC Santa Barbara',
  'Wright State': 'Wright State'
};

console.log('\n🔗 MAPPING ODDSTRADER TO NCAA API');
console.log('='.repeat(70));

const url = 'https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?limit=200&dates=20251128';

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    const ncaaTeams = new Map();
    
    // Extract all teams from NCAA API
    json.events.forEach(event => {
      event.competitions[0].competitors.forEach(comp => {
        const team = comp.team;
        ncaaTeams.set(team.location, team.shortDisplayName);
        
        // Also map alternate names
        if (team.location === 'UConn') ncaaTeams.set('Connecticut', 'UConn');
        if (team.location === 'Eastern Illinois') ncaaTeams.set('Eastern Illinois', 'E Illinois');
      });
    });
    
    console.log(`✅ Found ${ncaaTeams.size} teams in NCAA API today\n`);
    
    // Combine with manual mappings
    const finalMappings = {};
    
    teamsNeedingMapping.forEach(team => {
      if (ncaaTeams.has(team)) {
        finalMappings[team] = ncaaTeams.get(team);
        console.log(`✅ ${team} → ${ncaaTeams.get(team)} (from API)`);
      } else if (manualMappings[team]) {
        finalMappings[team] = manualMappings[team];
        console.log(`📋 ${team} → ${manualMappings[team]} (manual)`);
      } else {
        finalMappings[team] = team; // Use as-is
        console.log(`⚠️  ${team} → ${team} (no match, using as-is)`);
      }
    });
    
    console.log('\n' + '='.repeat(70));
    console.log('FINAL NCAA MAPPINGS:');
    console.log('='.repeat(70));
    Object.entries(finalMappings).sort().forEach(([odds, ncaa]) => {
      console.log(`${odds} → ${ncaa}`);
    });
    
    // Save to file for easy reference
    writeFileSync('/tmp/ncaa_mappings.json', JSON.stringify(finalMappings, null, 2));
    console.log('\n✅ Saved mappings to /tmp/ncaa_mappings.json');
  });
}).on('error', err => {
  console.error('❌ Error:', err);
});

