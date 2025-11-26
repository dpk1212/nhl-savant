/**
 * Fix ambiguous NCAA matches
 * Updates good abbreviation matches and identifies wrong matches
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = path.join(__dirname, '../public/basketball_teams.csv');

// Read CSV
const csvContent = fs.readFileSync(csvPath, 'utf8');
const lines = csvContent.split('\n');

console.log('FIXING AMBIGUOUS NCAA MATCHES\n');
console.log('=' .repeat(100));

// GOOD MATCHES - Just abbreviations, update ncaa_name
const goodMatches = [
  { csv: 'Eastern Michigan', ncaa: 'Eastern Mich.' },
  { csv: 'Northern Arizona', ncaa: 'Northern Ariz.' },
  { csv: 'Northern Colorado', ncaa: 'Northern Colo.' },
  { csv: 'St. Francis', ncaa: 'Saint Francis' },
  { csv: 'Saint Mary\'s', ncaa: 'Saint Mary\'s (CA)' },
  { csv: 'South Florida', ncaa: 'South Fla.' },
  { csv: 'Southeast Missouri State', ncaa: 'Southeast Mo. St.' },
  { csv: 'Southeastern Louisiana', ncaa: 'Southeastern La.' },
  { csv: 'Southern Illinois', ncaa: 'Southern Ill.' },
  { csv: 'St. John\'s', ncaa: 'St. John\'s (NY)' },
  { csv: 'Massachusetts-lowell', ncaa: 'UMass Lowell' },
  { csv: 'Western Kentucky', ncaa: 'Western Ky.' }
];

// BAD MATCHES - Different schools, need to add as new
const badMatches = [
  'App State',  // NOT NC State
  'Columbia Int\'l',  // NOT Columbia
  'Delaware St.',  // NOT Delaware
  'Northern Ky.',  // NOT Northern Colorado
  'Sam Houston',  // NOT Houston
  'Southern California',  // NOT California
  'Southern Ind.',  // NOT Southern Illinois
  'St. Mary\'s (MD)',  // NOT Mt. St. Mary's
  'Texas Lutheran',  // NOT Texas A&M
  'Texas Southern',  // NOT Texas A&M
  'Virginia St.'  // NOT Virginia Commonwealth
];

// Update good matches
let updatedCount = 0;
const newLines = lines.map(line => {
  if (line.startsWith('normalized_name')) return line;
  if (!line.trim()) return line;
  
  const parts = line.split(',');
  if (parts.length < 7) return line;
  
  const normalized = parts[0];
  const ncaaIndex = 5;
  
  // Check if this team needs NCAA name update
  const match = goodMatches.find(m => m.csv === normalized);
  if (match) {
    parts[ncaaIndex] = match.ncaa;
    updatedCount++;
    console.log(`✅ ${normalized}: ncaa_name → "${match.ncaa}"`);
    return parts.join(',');
  }
  
  return line;
});

fs.writeFileSync(csvPath, newLines.join('\n'), 'utf8');

console.log(`\n✅ Updated ${updatedCount} NCAA names for good matches\n`);

console.log('=' .repeat(100));
console.log('BAD MATCHES - These are DIFFERENT SCHOOLS, not in CSV:');
console.log('=' .repeat(100));
console.log('\nThese need to be added as NEW teams:\n');

badMatches.forEach(team => {
  console.log(`${team},${team},,,,${team},NEW`);
});

console.log('\n');

