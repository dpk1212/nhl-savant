/**
 * Quick Verification - Is Recency Weighting Active?
 * 
 * Run: node scripts/quickVerify.js
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 QUICK VERIFICATION CHECK');
console.log('='.repeat(60));

// Check 1: games.csv exists
try {
  const gamesCSV = readFileSync(join(__dirname, '../public/games.csv'), 'utf-8');
  console.log('✅ games.csv exists');
} catch (e) {
  console.log('❌ games.csv NOT FOUND');
}

// Check 2: teams.csv has L10 columns
try {
  const teamsCSV = readFileSync(join(__dirname, '../public/teams.csv'), 'utf-8');
  if (teamsCSV.includes('L10_xGF_per60')) {
    console.log('✅ teams.csv has L10 columns');
  } else {
    console.log('❌ teams.csv missing L10 columns');
  }
} catch (e) {
  console.log('❌ teams.csv NOT FOUND');
}

// Check 3: dataProcessing.js has recency code
try {
  const code = readFileSync(join(__dirname, '../src/utils/dataProcessing.js'), 'utf-8');
  if (code.includes('L10_xGF_per60') && code.includes('Recency weighting')) {
    console.log('✅ dataProcessing.js has recency weighting code');
  } else {
    console.log('❌ dataProcessing.js missing recency weighting code');
  }
} catch (e) {
  console.log('❌ dataProcessing.js NOT FOUND');
}

// Check 4: Check if built
try {
  const distExists = readFileSync(join(__dirname, '../dist/index.html'), 'utf-8');
  console.log('✅ Production build exists (dist/ folder)');
} catch (e) {
  console.log('⚠️  No production build yet (need to run: npm run build)');
}

console.log('='.repeat(60));
console.log('\n💡 TO VERIFY ON LIVE SITE:');
console.log('   1. Open site in browser');
console.log('   2. Press F12 → Console tab');
console.log('   3. Look for: "🔄 Recency weighting"');
console.log('\n');

