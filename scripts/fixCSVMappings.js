/**
 * Fix CSV Mappings - Direct approach
 * Maps teams based on actual file contents
 */

import { readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// EXACT MAPPINGS based on actual file inspection
const MANUAL_MAPPINGS = {
  // OddsTrader -> { haslametrics, dratings }
  'Alabama': { hasla: 'Alabama', drate: 'Alabama' },
  'Arizona State': { hasla: 'Arizona State', drate: 'Arizona State' },
  'Auburn': { hasla: 'Auburn', drate: 'Auburn' },
  'Baylor': { hasla: 'Baylor', drate: 'Baylor' },
  'Bradley': { hasla: 'Bradley', drate: 'Bradley' },
  'Georgia State': { hasla: 'Georgia State', drate: 'Georgia State' },
  'Gonzaga': { hasla: 'Gonzaga', drate: 'Gonzaga' },
  'Houston': { hasla: 'Houston', drate: 'Houston' },
  'Iowa State': { hasla: 'Iowa State', drate: 'Iowa State' },
  'Kansas': { hasla: 'Kansas', drate: 'Kansas' },
  'Liberty': { hasla: 'Liberty', drate: 'Liberty' },
  'Maryland': { hasla: 'Maryland', drate: 'Maryland' },
  'Michigan': { hasla: 'Michigan', drate: 'Michigan' },
  'NC State': { hasla: 'NC State', drate: 'NC State' },
  'Notre Dame': { hasla: 'Notre Dame', drate: 'Notre Dame' },
  'San Diego State': { hasla: 'San Diego State', drate: 'San Diego State' },
  'Seton Hall': { hasla: 'Seton Hall', drate: 'Seton Hall' },
  'St. John\'s': { hasla: 'St. John\'s', drate: 'St. Johns' },
  'Syracuse': { hasla: 'Syracuse', drate: 'Syracuse' },
  'Tennessee': { hasla: 'Tennessee', drate: 'Tennessee' },
  'USC': { hasla: 'USC', drate: 'USC' },
  
  // Teams with slight variations
  'Alabama State': { hasla: null, drate: 'Alabama State Hornets' },
  'Belmont': { hasla: null, drate: 'Belmont' },
  'Boston College': { hasla: null, drate: 'Boston College' },
  'Bowling Green': { hasla: null, drate: 'Bowling Green' },
  'Brown': { hasla: null, drate: 'Brown' },
  'Bucknell': { hasla: null, drate: 'Bucknell' },
  'Buffalo': { hasla: null, drate: 'Buffalo' },
  'Cal State Northridge': { hasla: null, drate: 'Cal State Northridge Matadors' },
  'Cincinnati': { hasla: null, drate: 'Cincinnati' },
  'Colorado State': { hasla: null, drate: 'Colorado State' },
  'Columbia': { hasla: null, drate: 'Columbia' },
  'Denver': { hasla: null, drate: 'Denver Pioneers' },
  'Eastern Michigan': { hasla: null, drate: 'Eastern Michigan' },
  'Fairfield': { hasla: null, drate: 'Fairfield Stags' },
  'Fresno State': { hasla: null, drate: 'Fresno State' },
  'Harvard': { hasla: null, drate: 'Harvard Crimson' },
  'Idaho': { hasla: null, drate: 'Idaho Vandals' },
  'Idaho State': { hasla: null, drate: 'Idaho State Bengals' },
  'Indiana State': { hasla: 'Indiana', drate: 'Indiana State' },
  'Jacksonville State': { hasla: 'Jacksonville', drate: 'Jacksonville State' },
  'Kentucky': { hasla: null, drate: 'Kentucky' },
  'Lipscomb': { hasla: null, drate: 'Lipscomb Bisons' },
  'Long Beach State': { hasla: null, drate: 'Long Beach State 49ers' },
  'Louisiana Tech': { hasla: null, drate: 'Louisiana Tech' },
  'Manhattan': { hasla: null, drate: 'Manhattan Jaspers' },
  'Marshall': { hasla: null, drate: 'Marshall' },
  'Memphis': { hasla: null, drate: 'Memphis' },
  'Mercer': { hasla: null, drate: 'Mercer' },
  'Navy': { hasla: null, drate: 'Navy Midshipmen' },
  'New Hampshire': { hasla: null, drate: 'New Hampshire' },
  'New Mexico': { hasla: 'New Mexico St.', drate: 'New Mexico Lobos' },
  'New Mexico State': { hasla: 'New Mexico St.', drate: 'New Mexico State' },
  'New Orleans': { hasla: null, drate: 'New Orleans' },
  'North Dakota State': { hasla: null, drate: 'North Dakota State' },
  'Northern Colorado': { hasla: null, drate: 'Northern Colorado' },
  'Northern Kentucky': { hasla: null, drate: 'Northern Kentucky Norse' },
  'Pepperdine': { hasla: null, drate: 'Pepperdine Waves' },
  'Portland': { hasla: 'Portland State', drate: 'Portland State Vikings' },
  'Robert Morris': { hasla: null, drate: 'Robert Morris' },
  'Sam Houston State': { hasla: null, drate: 'Sam Houston State Bearkats' },
  'South Florida': { hasla: null, drate: 'South Florida' },
  'Southeastern Louisiana': { hasla: null, drate: 'Southeastern Louisiana' },
  'Southern Illinois': { hasla: null, drate: 'Southern Illinois' },
  'Southern Indiana': { hasla: null, drate: 'Southern Indiana Screaming' },
  'St. Francis': { hasla: null, drate: 'St. Francis' },
  'Stonehill': { hasla: null, drate: 'Stonehill Skyhawks' },
  'Tennessee Tech': { hasla: null, drate: 'Tennessee Tech Golden' },
  'Texas': { hasla: 'Texas A&M', drate: 'Texas A&m' },
  'Texas Tech': { hasla: null, drate: 'Texas Tech' },
  'Toledo': { hasla: null, drate: 'Toledo' },
  'Troy': { hasla: null, drate: 'Troy' },
  'Valparaiso': { hasla: null, drate: 'Valparaiso Beacons' },
  'Vanderbilt': { hasla: null, drate: 'Vanderbilt' },
  'Virginia Tech': { hasla: null, drate: 'Virginia Tech' },
  'Wagner': { hasla: null, drate: 'Wagner Seahawks' },
  'Washington State': { hasla: 'Washington St.', drate: 'Washington State' },
  'Western Kentucky': { hasla: null, drate: 'Western Kentucky Hilltoppers' },
  'Wichita State': { hasla: null, drate: 'Wichita State' },
  'Wofford': { hasla: null, drate: 'Wofford Terriers' },
  'Wyoming': { hasla: null, drate: 'Wyoming' },
  'Air Force': { hasla: null, drate: 'Air Force' }
};

async function fixCSVMappings() {
  console.log('\n🔧 FIXING CSV MAPPINGS');
  console.log('==========================================\n');
  
  const csvPath = join(__dirname, '../public/basketball_teams.csv');
  const csvContent = await readFile(csvPath, 'utf8');
  const lines = csvContent.split('\n');
  
  const updatedLines = [];
  let updateCount = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (i === 0 || !line.trim()) {
      updatedLines.push(line);
      continue;
    }
    
    const values = line.split(',');
    if (values.length < 5) {
      updatedLines.push(line);
      continue;
    }
    
    const oddsName = values[1]; // oddstrader_name column
    
    if (MANUAL_MAPPINGS[oddsName]) {
      const mapping = MANUAL_MAPPINGS[oddsName];
      
      // Update haslametrics column if mapping exists
      if (mapping.hasla && (!values[2] || values[2].length === 0)) {
        values[2] = mapping.hasla;
        updateCount++;
        console.log(`✅ ${oddsName} → Hasla: "${mapping.hasla}"`);
      }
      
      // Update dratings column if mapping exists  
      if (mapping.drate && (!values[3] || values[3].length === 0)) {
        values[3] = mapping.drate;
        updateCount++;
        console.log(`✅ ${oddsName} → DRate: "${mapping.drate}"`);
      }
    }
    
    updatedLines.push(values.join(','));
  }
  
  await writeFile(csvPath, updatedLines.join('\n'), 'utf8');
  
  console.log(`\n✅ Updated ${updateCount} mappings in CSV\n`);
}

fixCSVMappings()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });

