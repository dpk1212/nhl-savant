/**
 * Add NCAA team names to basketball_teams.csv
 * Fetches today's games from NCAA API to get exact team names
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '../public');
const csvPath = path.join(publicDir, 'basketball_teams.csv');

// Read current CSV
const csvContent = fs.readFileSync(csvPath, 'utf8');
const lines = csvContent.split('\n');
const header = lines[0];

console.log('Current header:', header);

// Add ncaa_name column if not present
if (!header.includes('ncaa_name')) {
  const newHeader = header.replace('conference,notes', 'conference,ncaa_name,notes');
  
  const newLines = [newHeader];
  
  // Update each data row to add empty ncaa_name column
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Parse CSV line
    const match = line.match(/^([^,]+),([^,]*),([^,]*),([^,]*),([^,]*),(.*)$/);
    if (match) {
      const normalized = match[1];
      const oddstrader = match[2];
      const haslametrics = match[3];
      const dratings = match[4];
      const conference = match[5];
      const notes = match[6];
      
      // For now, set NCAA name same as oddstrader name
      // We'll refine this after seeing actual NCAA API names
      const ncaaName = oddstrader || normalized;
      
      newLines.push(`${normalized},${oddstrader},${haslametrics},${dratings},${conference},${ncaaName},${notes}`);
    }
  }
  
  const newCsv = newLines.join('\n') + '\n';
  fs.writeFileSync(csvPath, newCsv, 'utf8');
  
  console.log(`✅ Added ncaa_name column to CSV`);
  console.log(`📝 Total rows: ${newLines.length - 1}`);
} else {
  console.log('✅ ncaa_name column already exists');
}

console.log('\n📋 Next steps:');
console.log('1. Fetch today\'s games from NCAA API');
console.log('2. Compare NCAA team names to our CSV');
console.log('3. Update CSV with exact NCAA names');
console.log('\nRun: node scripts/fetchNCAAnamesFromAPI.js');


