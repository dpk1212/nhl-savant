/**
 * Add all missing NCAA teams to CSV
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = path.join(__dirname, '../public/basketball_teams.csv');

// All teams to add (bad matches + truly new)
const teamsToAdd = [
  // Bad matches that are actually different schools
  'App State',
  'Columbia Int\'l',
  'Delaware St.',
  'Northern Ky.',
  'Sam Houston',
  'Southern California',
  'Southern Ind.',
  'St. Mary\'s (MD)',
  'Texas Lutheran',
  'Texas Southern',
  'Virginia St.',
  // Truly new teams
  'Army West Point',
  'Biblical Stud. (TX)',
  'Bryant',
  'CSUN',
  'Chaminade',
  'Cornell',
  'Duquesne',
  'FDU',
  'FGCU',
  'Holy Cross',
  'Howard',
  'Mercy',
  'Miami (OH)',
  'Misericordia',
  'Presbyterian',
  'The Citadel',
  'UIW',
  'UNCW',
  'UNI',
  'Worcester St.'
];

// Read current CSV
const csvContent = fs.readFileSync(csvPath, 'utf8');
const lines = csvContent.trim().split('\n');

console.log('ADDING MISSING NCAA TEAMS TO CSV\n');
console.log('=' .repeat(100));
console.log(`Current teams in CSV: ${lines.length - 1}`);
console.log(`Teams to add: ${teamsToAdd.length}\n`);

// Check which teams are already in CSV
const existingTeams = new Set();
lines.slice(1).forEach(line => {
  const parts = line.split(',');
  if (parts[0]) existingTeams.add(parts[0]);
});

const newTeams = teamsToAdd.filter(team => !existingTeams.has(team));

console.log(`Teams already in CSV: ${teamsToAdd.length - newTeams.length}`);
console.log(`New teams to add: ${newTeams.length}\n`);

if (newTeams.length === 0) {
  console.log('✅ All teams already in CSV!');
} else {
  // Add new teams
  newTeams.forEach(team => {
    // Format: normalized_name,oddstrader_name,haslametrics_name,dratings_name,conference,ncaa_name,notes
    const newLine = `${team},${team},,,,${team},NEW`;
    lines.push(newLine);
    console.log(`✅ Added: ${team}`);
  });
  
  // Write back to CSV
  fs.writeFileSync(csvPath, lines.join('\n') + '\n', 'utf8');
  
  console.log(`\n✅ Added ${newTeams.length} teams to CSV`);
  console.log(`Total teams now: ${lines.length - 1}\n`);
}

console.log('=' .repeat(100));

