/**
 * Batch Fix NCAA Names Based on Issues JSON
 * Automatically fixes all CSV ncaa_name entries based on systematic audit
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// NCAA name fixes based on issues.json analysis
const NCAA_FIXES = [
  // From issues.json - exact NCAA API names
  { team: 'Virginia Military', ncaa: 'VMI' },
  { team: 'Illinois-chicago', ncaa: 'UIC' },
  { team: 'Appalachian State', ncaa: 'App State' },
  { team: 'Northern Kentucky', ncaa: 'Northern Ky.' },
  { team: 'Nebraska-omaha', ncaa: 'Omaha' },
  { team: 'Miami', ncaa: 'Miami (OH)' },
  { team: 'Virginia Commonwealth', ncaa: 'VCU' },
  { team: 'USC', ncaa: 'Southern California' },
  { team: 'New Mexico State', ncaa: 'New Mexico St.' },
  { team: 'Southern Indiana', ncaa: 'Southern Ind.' },
  { team: 'Northern Iowa', ncaa: 'UNI' },
  { team: 'Washington State', ncaa: 'Washington St.' },
  { team: 'Sam Houston State', ncaa: 'Sam Houston' },
  { team: 'Nc-wilmington', ncaa: 'UNCW' },
  { team: 'South Dakota State', ncaa: 'South Dakota St.' },
  { team: 'Cal State Northridge', ncaa: 'CSUN' }
];

async function batchFixNCAANames() {
  console.log('╔════════════════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                         BATCH FIX NCAA NAMES IN CSV                                    ║');
  console.log('╚════════════════════════════════════════════════════════════════════════════════════════╝');
  console.log('\n');
  
  const csvPath = path.join(__dirname, '../public/basketball_teams.csv');
  const csvContent = await fs.readFile(csvPath, 'utf8');
  const lines = csvContent.trim().split('\n');
  
  console.log(`📋 Loaded CSV with ${lines.length - 1} teams`);
  console.log(`🔧 Will apply ${NCAA_FIXES.length} NCAA name fixes\n`);
  
  let fixedCount = 0;
  const newLines = [lines[0]]; // Keep header
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const parts = line.split(',');
    if (parts.length < 7) {
      newLines.push(line);
      continue;
    }
    
    const normalized = parts[0];
    const fix = NCAA_FIXES.find(f => f.team === normalized);
    
    if (fix) {
      const oldNcaa = parts[5];
      parts[5] = fix.ncaa;
      console.log(`✅ ${normalized}:`);
      console.log(`   ncaa_name: "${oldNcaa}" → "${fix.ncaa}"`);
      fixedCount++;
      newLines.push(parts.join(','));
    } else {
      newLines.push(line);
    }
  }
  
  // Write back to CSV
  await fs.writeFile(csvPath, newLines.join('\n') + '\n', 'utf8');
  
  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                                   COMPLETE                                             ║');
  console.log('╚════════════════════════════════════════════════════════════════════════════════════════╝');
  console.log(`\n✅ Fixed ${fixedCount} NCAA names in CSV`);
  console.log(`📝 CSV updated: public/basketball_teams.csv`);
  console.log(`\n🔄 Next steps:`);
  console.log(`   1. Run: npm run systematic-ncaa-fix`);
  console.log(`   2. Verify success rate improved`);
  console.log(`   3. Commit changes if 100% success\n`);
}

batchFixNCAANames();

