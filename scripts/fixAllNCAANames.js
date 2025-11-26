/**
 * Fix all NCAA API names in CSV - adds column and updates all State → St. abbreviations
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = path.join(__dirname, '../public/basketball_teams.csv');

// Read CSV
const csvContent = fs.readFileSync(csvPath, 'utf8');
const lines = csvContent.trim().split('\n');
const header = lines[0];

console.log('Current header:', header);
console.log('');

// Check if ncaa_name column exists
const hasNcaaColumn = header.includes('ncaa_name');

if (hasNcaaColumn) {
  console.log('✅ NCAA column already exists. Fixing abbreviations...\n');
  
  // Just fix the abbreviations
  const newLines = lines.map((line, idx) => {
    if (idx === 0) return line; // Keep header
    
    const parts = line.split(',');
    if (parts.length < 7) return line;
    
    const ncaaIndex = 5; // Column 6 (0-indexed)
    const ncaaName = parts[ncaaIndex];
    
    // Fix State → St. abbreviations
    const fixes = [
      ['Alabama State', 'Alabama St.'],
      ['Arizona State', 'Arizona St.'],
      ['Boise State', 'Boise St.'],
      ['Colorado State', 'Colorado St.'],
      ['Fresno State', 'Fresno St.'],
      ['Georgia State', 'Georgia St.'],
      ['Idaho State', 'Idaho St.'],
      ['Indiana State', 'Indiana St.'],
      ['Iowa State', 'Iowa St.'],
      ['Jacksonville State', 'Jacksonville St.'],
      ['Kennesaw State', 'Kennesaw St.'],
      ['Long Beach State', 'Long Beach St.'],
      ['North Dakota State', 'North Dakota St.'],
      ['San Diego State', 'San Diego St.'],
      ['San Jose State', 'San Jose St.'],
      ['Njit', 'NJIT'],
      ['Uc Irvine', 'UC Irvine'],
      ['Gardner-webb', 'Gardner-Webb'],
      ['Uic', 'UIC'],
      ['Unlv', 'UNLV'],
      ['Vcu', 'VCU'],
      ['Wichita State', 'Wichita St.']
    ];
    
    let updated = false;
    fixes.forEach(([old, newer]) => {
      if (ncaaName === old) {
        parts[ncaaIndex] = newer;
        updated = true;
      }
    });
    
    return parts.join(',');
  });
  
  fs.writeFileSync(csvPath, newLines.join('\n') + '\n', 'utf8');
  console.log('✅ Fixed State → St. abbreviations in NCAA column!\n');
  
} else {
  console.log('❌ NCAA column does NOT exist. Adding it now...\n');
  
  // Add ncaa_name column and set initial values
  const newHeader = header.replace('conference,notes', 'conference,ncaa_name,notes');
  const newLines = [newHeader];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Parse line carefully
    const parts = line.split(',');
    if (parts.length < 6) {
      console.warn(`Skipping malformed line ${i}: ${line}`);
      continue;
    }
    
    const normalized = parts[0];
    const oddstrader = parts[1];
    const haslametrics = parts[2];
    const dratings = parts[3];
    const conference = parts[4];
    const notes = parts.slice(5).join(','); // Join remaining parts (in case notes have commas)
    
    // Set NCAA name with abbreviations
    let ncaaName = oddstrader || normalized;
    
    // Apply State → St. abbreviations
    const abbreviations = {
      'Alabama State': 'Alabama St.',
      'Arizona State': 'Arizona St.',
      'Boise State': 'Boise St.',
      'Colorado State': 'Colorado St.',
      'Fresno State': 'Fresno St.',
      'Georgia State': 'Georgia St.',
      'Idaho State': 'Idaho St.',
      'Indiana State': 'Indiana St.',
      'Iowa State': 'Iowa St.',
      'Jacksonville State': 'Jacksonville St.',
      'Kennesaw State': 'Kennesaw St.',
      'Long Beach State': 'Long Beach St.',
      'North Dakota State': 'North Dakota St.',
      'San Diego State': 'San Diego St.',
      'San Jose State': 'San Jose St.',
      'Njit': 'NJIT',
      'Uc Irvine': 'UC Irvine',
      'Gardner-webb': 'Gardner-Webb',
      'Uic': 'UIC',
      'Unlv': 'UNLV',
      'Vcu': 'VCU',
      'Wichita State': 'Wichita St.'
    };
    
    if (abbreviations[ncaaName]) {
      ncaaName = abbreviations[ncaaName];
    }
    
    newLines.push(`${normalized},${oddstrader},${haslametrics},${dratings},${conference},${ncaaName},${notes}`);
  }
  
  fs.writeFileSync(csvPath, newLines.join('\n') + '\n', 'utf8');
  console.log(`✅ Added ncaa_name column and set ${newLines.length - 1} team mappings!\n`);
}

// Verify the result
const verifyContent = fs.readFileSync(csvPath, 'utf8');
const verifyLines = verifyContent.trim().split('\n');
console.log('New header:', verifyLines[0]);
console.log(`Total rows: ${verifyLines.length - 1}`);
console.log('\nSample rows:');
console.log(verifyLines[4]); // Alabama State
console.log(verifyLines[33]); // Iowa State
console.log(verifyLines[24]); // Gardner-Webb


