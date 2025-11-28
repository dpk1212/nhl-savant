/**
 * Batch update NCAA names in basketball_teams.csv
 */

import { readFileSync, writeFileSync } from 'fs';

const csvPath = '/Users/dalekolnitys/NHL Savant/nhl-savant/public/basketball_teams.csv';
const mappingsPath = '/tmp/ncaa_mappings.json';

// Load mappings
const mappings = JSON.parse(readFileSync(mappingsPath, 'utf8'));

// Load CSV
const csvContent = readFileSync(csvPath, 'utf8');
const lines = csvContent.split('\n');

console.log('\n🔄 UPDATING NCAA NAMES IN CSV');
console.log('='.repeat(70));

let updatedCount = 0;
const updatedLines = [];

// Process each line
for (let i = 0; i < lines.length; i++) {
  if (i === 0) {
    // Header
    updatedLines.push(lines[i]);
    continue;
  }
  
  const line = lines[i].trim();
  if (!line) {
    updatedLines.push('');
    continue;
  }
  
  const parts = line.split(',');
  if (parts.length < 6) {
    updatedLines.push(line);
    continue;
  }
  
  const oddstraderName = parts[1]; // Column 2 is oddstrader_name
  const currentNcaaName = parts[5]; // Column 6 is ncaa_name
  
  // Check if this team needs NCAA mapping
  if (mappings[oddstraderName] && !currentNcaaName) {
    parts[5] = mappings[oddstraderName];
    updatedLines.push(parts.join(','));
    console.log(`✅ ${oddstraderName} → ncaa_name: "${mappings[oddstraderName]}"`);
    updatedCount++;
  } else {
    updatedLines.push(line);
  }
}

// Also fix North Dakota dratings_name
for (let i = 1; i < updatedLines.length; i++) {
  const line = updatedLines[i].trim();
  if (!line) continue;
  
  const parts = line.split(',');
  if (parts[1] === 'North Dakota' && !parts[3]) {
    parts[3] = 'North Dakota Fighting Hawks';
    updatedLines[i] = parts.join(',');
    console.log(`✅ North Dakota → dratings_name: "North Dakota Fighting Hawks"`);
    updatedCount++;
  }
}

// Write back to CSV
writeFileSync(csvPath, updatedLines.join('\n'));

console.log('\n' + '='.repeat(70));
console.log(`✅ Updated ${updatedCount} team entries in CSV`);
console.log('='.repeat(70));

