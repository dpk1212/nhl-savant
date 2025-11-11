/**
 * Integrate Real L10 Data from games.csv
 * 
 * Merges the REAL last 10 games stats (from Natural Stat Trick) with teams.csv
 * 
 * Usage: node scripts/integrateRealL10Data.js
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔗 INTEGRATING REAL L10 DATA FROM GAMES.CSV');
console.log('='.repeat(80));

// Load games.csv (L10 data)
const gamesCSV = readFileSync(join(__dirname, '../public/games.csv'), 'utf-8');
const gamesData = Papa.parse(gamesCSV, { header: true }).data;

console.log(`✅ Loaded L10 data for ${gamesData.length} teams\n`);

// Load existing teams.csv
const teamsCSV = readFileSync(join(__dirname, '../public/teams_original_backup.csv'), 'utf-8');
const teamsData = Papa.parse(teamsCSV, { header: true }).data;

console.log(`✅ Loaded ${teamsData.length} team records from teams.csv\n`);

// Team name mapping (games.csv uses full names, teams.csv uses codes)
const TEAM_NAME_TO_CODE = {
  'Anaheim Ducks': 'ANA',
  'Boston Bruins': 'BOS',
  'Buffalo Sabres': 'BUF',
  'Calgary Flames': 'CGY',
  'Carolina Hurricanes': 'CAR',
  'Chicago Blackhawks': 'CHI',
  'Colorado Avalanche': 'COL',
  'Columbus Blue Jackets': 'CBJ',
  'Dallas Stars': 'DAL',
  'Detroit Red Wings': 'DET',
  'Edmonton Oilers': 'EDM',
  'Florida Panthers': 'FLA',
  'Los Angeles Kings': 'LAK',
  'Minnesota Wild': 'MIN',
  'Montreal Canadiens': 'MTL',
  'Nashville Predators': 'NSH',
  'New Jersey Devils': 'NJD',
  'New York Islanders': 'NYI',
  'New York Rangers': 'NYR',
  'Ottawa Senators': 'OTT',
  'Philadelphia Flyers': 'PHI',
  'Pittsburgh Penguins': 'PIT',
  'San Jose Sharks': 'SJS',
  'Seattle Kraken': 'SEA',
  'St Louis Blues': 'STL',
  'St. Louis Blues': 'STL',
  'Tampa Bay Lightning': 'TBL',
  'Toronto Maple Leafs': 'TOR',
  'Utah Mammoth': 'UTA',
  'Vancouver Canucks': 'VAN',
  'Vegas Golden Knights': 'VGK',
  'Washington Capitals': 'WSH',
  'Winnipeg Jets': 'WPG'
};

// Process L10 data into a lookup map
const l10Map = {};

for (const game of gamesData) {
  if (!game.Team) continue;
  
  const teamCode = TEAM_NAME_TO_CODE[game.Team];
  if (!teamCode) {
    console.warn(`⚠️ Unknown team: ${game.Team}`);
    continue;
  }
  
  // Parse key stats
  const TOI = parseFloat(game.TOI) || 0;
  const xGF = parseFloat(game.xGF) || 0;
  const xGA = parseFloat(game.xGA) || 0;
  const GF = parseFloat(game.GF) || 0;
  const GA = parseFloat(game.GA) || 0;
  
  // Calculate per-60 rates
  // TOI is in minutes for 10 games, convert to hours, then to per-60
  const TOI_hours = TOI / 60;
  const L10_xGF_per60 = TOI > 0 ? (xGF / TOI_hours) : 0;
  const L10_xGA_per60 = TOI > 0 ? (xGA / TOI_hours) : 0;
  const L10_GF_per60 = TOI > 0 ? (GF / TOI_hours) : 0;
  const L10_GA_per60 = TOI > 0 ? (GA / TOI_hours) : 0;
  
  // Store L10 stats
  l10Map[teamCode] = {
    L10_GP: game.GP,
    L10_W: game.W,
    L10_L: game.L,
    L10_OTL: game.OTL,
    L10_xGF: xGF.toFixed(2),
    L10_xGA: xGA.toFixed(2),
    L10_xGF_per60: L10_xGF_per60.toFixed(2),
    L10_xGA_per60: L10_xGA_per60.toFixed(2),
    L10_GF: GF.toFixed(2),
    L10_GA: GA.toFixed(2),
    L10_GF_per60: L10_GF_per60.toFixed(2),
    L10_GA_per60: L10_GA_per60.toFixed(2),
    L10_CF_pct: game['CF%'],
    L10_xGF_pct: game['xGF%'],
    L10_HDCF: game.HDCF,
    L10_HDCA: game.HDCA,
    L10_PDO: game.PDO,
    L10_record: `${game.W}-${game.L}-${game.OTL}`
  };
  
  console.log(`✅ ${teamCode}: L10 record ${game.W}-${game.L}-${game.OTL}, xGF=${xGF.toFixed(1)}, xGA=${xGA.toFixed(1)}, xGF/60=${L10_xGF_per60.toFixed(2)}`);
}

console.log('\n' + '='.repeat(80));
console.log('📊 L10 DATA PROCESSED');
console.log('='.repeat(80));

// Merge L10 data with teams.csv
let addedCount = 0;
for (const team of teamsData) {
  const teamCode = team.team;
  const l10Data = l10Map[teamCode];
  
  if (l10Data) {
    Object.assign(team, l10Data);
    addedCount++;
  }
}

console.log(`\n✅ Added L10 stats to ${addedCount} team records\n`);

// Write to new CSV
const headers = Object.keys(teamsData[0]);
const csvContent = Papa.unparse(teamsData, { columns: headers });

const outputPath = join(__dirname, '../public/teams.csv');
writeFileSync(outputPath, csvContent);

console.log('='.repeat(80));
console.log('✅ SUCCESS! teams.csv updated with REAL L10 data');
console.log('='.repeat(80));
console.log('\n📋 NEW L10 COLUMNS ADDED:');
console.log('  - L10_xGF_per60, L10_xGA_per60 (REAL expected goals per 60 min)');
console.log('  - L10_GF_per60, L10_GA_per60 (actual goals per 60 min)');
console.log('  - L10_W, L10_L, L10_OTL (last 10 record)');
console.log('  - L10_xGF_pct (xG percentage)');
console.log('  - L10_HDCF, L10_HDCA (high danger chances)');
console.log('  - L10_PDO (puck luck indicator)');

console.log('\n🎯 NEXT STEP:');
console.log('  Run backtest: node scripts/comprehensiveBacktest.js');
console.log('\n');

