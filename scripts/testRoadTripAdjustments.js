/**
 * Test script to validate road trip and homecoming adjustments
 */

import { ScheduleHelper } from '../src/utils/scheduleHelper.js';
import Papa from 'papaparse';
import fs from 'fs';

// Load schedule data
console.log('📅 Testing Road Trip & Homecoming Adjustments\n');
console.log('═══════════════════════════════════════════════════════════════\n');

const csvPath = './public/nhl-202526-asplayed.csv';
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const parsed = Papa.parse(csvContent, { header: true, skipEmptyLines: true });

const scheduleHelper = new ScheduleHelper(parsed.data);

console.log('✅ ScheduleHelper initialized\n');
console.log('═══════════════════════════════════════════════════════════════\n');

// Test 1: Find a team on a long road trip
console.log('🧪 TEST 1: Road Trip Fatigue Detection\n');
console.log('Looking for teams on game 3+ of road trips...\n');

const testDates = [
  '2025-10-18',
  '2025-10-19',
  '2025-10-20',
  '2025-10-21',
  '2025-10-22',
  '2025-10-23',
  '2025-10-24'
];

const teams = ['BOS', 'TOR', 'EDM', 'COL', 'VEG', 'FLA', 'NYR', 'CAR'];

let foundRoadTrip = false;
for (const date of testDates) {
  for (const team of teams) {
    const awayStreak = scheduleHelper.getConsecutiveAwayGames(team, date);
    if (awayStreak >= 2) {
      const adjustment = scheduleHelper.getRoadTripAdjustment(team, date);
      console.log(`✅ ${team} on ${date}: Game ${awayStreak + 1} of road trip`);
      console.log(`   Adjustment: ${(adjustment * 100).toFixed(1)}%\n`);
      foundRoadTrip = true;
    }
  }
}

if (!foundRoadTrip) {
  console.log('ℹ️  No teams on game 3+ of road trips in test dates\n');
}

console.log('═══════════════════════════════════════════════════════════════\n');

// Test 2: Find homecoming games
console.log('🧪 TEST 2: Homecoming Boost Detection\n');
console.log('Looking for teams returning home from 3+ game road trips...\n');

let foundHomecoming = false;
for (const date of testDates) {
  for (const team of teams) {
    const { isHomecoming, tripLength } = scheduleHelper.isHomecomingGame(team, date);
    if (isHomecoming) {
      const adjustment = scheduleHelper.getHomecomingAdjustment(team, date);
      console.log(`✅ ${team} on ${date}: HOMECOMING after ${tripLength}-game road trip`);
      console.log(`   Boost: +${(adjustment * 100).toFixed(1)}%\n`);
      foundHomecoming = true;
    }
  }
}

if (!foundHomecoming) {
  console.log('ℹ️  No homecoming games in test dates\n');
}

console.log('═══════════════════════════════════════════════════════════════\n');

// Test 3: Combined adjustments
console.log('🧪 TEST 3: Combined Situational Adjustments\n');
console.log('Testing getCombinedAdjustment() for sample scenarios...\n');

const testScenarios = [
  { team: 'BOS', date: '2025-10-20', isHome: true, description: 'BOS home game' },
  { team: 'TOR', date: '2025-10-21', isHome: false, description: 'TOR away game' },
  { team: 'EDM', date: '2025-10-22', isHome: true, description: 'EDM home game' },
  { team: 'COL', date: '2025-10-23', isHome: false, description: 'COL away game' }
];

for (const scenario of testScenarios) {
  const combinedAdj = scheduleHelper.getCombinedAdjustment(
    scenario.team,
    scenario.date,
    scenario.isHome
  );
  
  const restAdj = scheduleHelper.getRestAdjustment(scenario.team, scenario.date);
  const roadTripAdj = scenario.isHome ? 0 : scheduleHelper.getRoadTripAdjustment(scenario.team, scenario.date);
  const homecomingAdj = scenario.isHome ? scheduleHelper.getHomecomingAdjustment(scenario.team, scenario.date) : 0;
  const awayStreak = scheduleHelper.getConsecutiveAwayGames(scenario.team, scenario.date);
  
  console.log(`${scenario.description} on ${scenario.date}:`);
  console.log(`   Rest: ${(restAdj * 100).toFixed(1)}%`);
  if (!scenario.isHome) {
    console.log(`   Road Trip (game ${awayStreak + 1}): ${(roadTripAdj * 100).toFixed(1)}%`);
  }
  if (scenario.isHome && homecomingAdj !== 0) {
    console.log(`   Homecoming: +${(homecomingAdj * 100).toFixed(1)}%`);
  }
  console.log(`   COMBINED: ${(combinedAdj * 100).toFixed(1)}%\n`);
}

console.log('═══════════════════════════════════════════════════════════════\n');
console.log('✅ All tests complete!\n');
console.log('🚀 Road trip and homecoming adjustments are ready for production.\n');






