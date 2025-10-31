import { GoalieProcessor } from '../src/utils/goalieProcessor.js';
import Papa from 'papaparse';
import { readFileSync } from 'fs';

console.log('🥅 Testing Goalie Processor Integration\n');
console.log('=' .repeat(60));

const goaliesData = Papa.parse(readFileSync('public/goalies.csv', 'utf-8'), {
  header: true,
  skipEmptyLines: true,
  dynamicTyping: true
}).data;

console.log(`\nLoaded ${goaliesData.length} goalie records from CSV\n`);

const goalieProcessor = new GoalieProcessor(goaliesData);

// Test goalies from MoneyPuck scrape (Oct 30, 2025 games)
const testGoalies = [
  { name: 'Alex Lyon', team: 'BUF' },
  { name: 'Joonas Korpisalo', team: 'BOS' },
  { name: 'Jake Oettinger', team: 'DAL' },
  { name: 'Andrei Vasilevskiy', team: 'TBL' },
  { name: 'Linus Ullmark', team: 'OTT' }
];

console.log('Testing goalies from Oct 30 games:\n');

let foundCount = 0;
let totalGSAE = 0;

for (const goalie of testGoalies) {
  console.log(`\n${goalie.name} (${goalie.team}):`);
  console.log('-'.repeat(40));
  
  // Test name-only lookup
  const statsByName = goalieProcessor.getGoalieStats(goalie.name);
  const statsByTeam = goalieProcessor.getGoalieStats(goalie.name, goalie.team);
  
  // Test GSAE calculation with different situations
  const gsaeAll = goalieProcessor.calculateGSAE(goalie.name, 'all');
  const gsae5on5 = goalieProcessor.calculateGSAE(goalie.name, '5on5');
  
  const found = statsByName !== null || statsByTeam !== null;
  if (found) {
    foundCount++;
    console.log(`  ✅ Found: YES`);
    console.log(`  GSAE (all):   ${gsaeAll !== null ? gsaeAll.toFixed(3) : 'N/A'}`);
    console.log(`  GSAE (5on5):  ${gsae5on5 !== null ? gsae5on5.toFixed(3) : 'N/A'}`);
    
    if (statsByTeam) {
      console.log(`  Games:        ${statsByTeam.gamesPlayed || 0}`);
      console.log(`  Team:         ${statsByTeam.team || 'N/A'}`);
      console.log(`  xGA:          ${statsByTeam.xGoalsAgainst ? Number(statsByTeam.xGoalsAgainst).toFixed(2) : 'N/A'}`);
      console.log(`  GA:           ${statsByTeam.goalsAgainst || 'N/A'}`);
      
      if (gsaeAll) totalGSAE += gsaeAll;
    }
  } else {
    console.log(`  ❌ Found: NO - GOALIE NOT FOUND IN PROCESSOR`);
  }
}

console.log('\n' + '='.repeat(60));
console.log(`\n📊 Summary:`);
console.log(`   Found: ${foundCount}/${testGoalies.length} goalies`);
console.log(`   Average GSAE: ${foundCount > 0 ? (totalGSAE / foundCount).toFixed(3) : 'N/A'}`);

if (foundCount === testGoalies.length) {
  console.log('\n✅ SUCCESS: All goalies found and GSAE calculated!');
} else {
  console.log('\n⚠️  WARNING: Some goalies not found - name matching issue?');
}

console.log('\n' + '='.repeat(60));
console.log('\n🔍 Next Step: Check if EdgeCalculator passes these goalies to predictions\n');

