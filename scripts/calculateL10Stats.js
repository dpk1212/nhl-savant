/**
 * Calculate Last 10 Games (L10) Statistics
 * 
 * Reads game-by-game data from nhl-202526-asplayed.csv and calculates
 * rolling 10-game averages for each team.
 * 
 * Output: teams_with_L10.csv (enhanced teams data with L10 columns)
 * 
 * Usage: node scripts/calculateL10Stats.js
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('📊 CALCULATING LAST 10 GAMES (L10) STATISTICS');
console.log('='.repeat(80));

// Load game data
const gamesCSV = readFileSync(join(__dirname, '../public/nhl-202526-asplayed.csv'), 'utf-8');
const gamesData = Papa.parse(gamesCSV, { header: true }).data
  .filter(g => g.Status === 'Regulation' || g.Status === 'OT' || g.Status === 'SO');

console.log(`✅ Loaded ${gamesData.length} completed games\n`);

// Team mapping
const TEAM_MAPPING = {
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
  'St. Louis Blues': 'STL',
  'Tampa Bay Lightning': 'TBL',
  'Toronto Maple Leafs': 'TOR',
  'Utah Mammoth': 'UTA',
  'Vancouver Canucks': 'VAN',
  'Vegas Golden Knights': 'VGK',
  'Washington Capitals': 'WSH',
  'Winnipeg Jets': 'WPG'
};

function getTeamCode(teamName) {
  return TEAM_MAPPING[teamName] || teamName;
}

// Parse each game into team-game records
const teamGames = [];

for (const game of gamesData) {
  try {
    const homeTeam = getTeamCode(game.Home);
    const awayTeam = getTeamCode(game.Visitor);
    const awayScore = parseInt(game.Score);  // First Score column
    const homeScore = parseInt(game.Score_1); // Second Score column (Papa Parse renames to Score_1)
    
    if (isNaN(homeScore) || isNaN(awayScore)) continue;
    
    const date = game.Date;
    
    // Home team game
    teamGames.push({
      date,
      team: homeTeam,
      opponent: awayTeam,
      isHome: true,
      goalsFor: homeScore,
      goalsAgainst: awayScore,
      result: homeScore > awayScore ? 'W' : (homeScore < awayScore ? 'L' : 'OT')
    });
    
    // Away team game
    teamGames.push({
      date,
      team: awayTeam,
      opponent: homeTeam,
      isHome: false,
      goalsFor: awayScore,
      goalsAgainst: homeScore,
      result: awayScore > homeScore ? 'W' : (awayScore < homeScore ? 'L' : 'OT')
    });
  } catch (error) {
    console.error(`Error parsing game: ${error.message}`);
  }
}

// Sort by date
teamGames.sort((a, b) => new Date(a.date) - new Date(b.date));

console.log(`📝 Parsed ${teamGames.length} team-game records\n`);

// Calculate L10 stats for each team
const teamL10Stats = {};

// Get all unique teams
const allTeams = [...new Set(teamGames.map(g => g.team))];

for (const team of allTeams) {
  const teamGamesList = teamGames.filter(g => g.team === team);
  
  if (teamGamesList.length < 10) {
    console.log(`⚠️ ${team}: Only ${teamGamesList.length} games (need 10 for L10)`);
    continue;
  }
  
  // Get last 10 games
  const last10 = teamGamesList.slice(-10);
  
  // Calculate L10 stats
  const L10_W = last10.filter(g => g.result === 'W').length;
  const L10_L = last10.filter(g => g.result === 'L').length;
  const L10_OTL = last10.filter(g => g.result === 'OT').length;
  const L10_goals_for = last10.reduce((sum, g) => sum + g.goalsFor, 0);
  const L10_goals_against = last10.reduce((sum, g) => sum + g.goalsAgainst, 0);
  const L10_goals_for_per_game = L10_goals_for / 10;
  const L10_goals_against_per_game = L10_goals_against / 10;
  
  // Simple xG estimation (we don't have actual xG per game)
  // Estimate: xG ≈ 85% of actual goals (regressed to mean)
  const L10_xGF = L10_goals_for * 0.85;
  const L10_xGA = L10_goals_against * 0.85;
  const L10_xGF_per_game = L10_xGF / 10;
  const L10_xGA_per_game = L10_xGA / 10;
  
  // Convert to per-60 (assuming 60 min games)
  const L10_xGF_per60 = L10_xGF_per_game;
  const L10_xGA_per60 = L10_xGA_per_game;
  
  // Current streak
  let current_streak = 0;
  let current_streak_type = last10[9].result; // Last game result
  
  for (let i = 9; i >= 0; i--) {
    if (last10[i].result === current_streak_type) {
      current_streak++;
    } else {
      break;
    }
  }
  
  // Last 5 games record
  const last5 = last10.slice(-5);
  const L5_W = last5.filter(g => g.result === 'W').length;
  const L5_L = last5.filter(g => g.result === 'L').length;
  
  // Home/away streaks (simplified: just count consecutive games at current venue)
  const homeGames = last10.filter(g => g.isHome);
  const awayGames = last10.filter(g => !g.isHome);
  
  let home_streak = 0;
  let home_streak_type = 'N/A';
  if (homeGames.length > 0) {
    home_streak_type = homeGames[homeGames.length - 1].result;
    for (let i = homeGames.length - 1; i >= 0; i--) {
      if (homeGames[i].result === home_streak_type) {
        home_streak++;
      } else {
        break;
      }
    }
  }
  
  let away_streak = 0;
  let away_streak_type = 'N/A';
  if (awayGames.length > 0) {
    away_streak_type = awayGames[awayGames.length - 1].result;
    for (let i = awayGames.length - 1; i >= 0; i--) {
      if (awayGames[i].result === away_streak_type) {
        away_streak++;
      } else {
        break;
      }
    }
  }
  
  // PDO estimation (simplified)
  const shooting_pct = L10_goals_for / (L10_goals_for + L10_goals_against) * 100;
  const save_pct = (1 - (L10_goals_against / (L10_goals_for + L10_goals_against))) * 100;
  const L10_PDO = shooting_pct + save_pct;
  
  teamL10Stats[team] = {
    L10_xGF_per60: L10_xGF_per60.toFixed(2),
    L10_xGA_per60: L10_xGA_per60.toFixed(2),
    L10_W,
    L10_L,
    L10_OTL,
    L10_goals_for,
    L10_goals_against,
    L10_xGF: L10_xGF.toFixed(2),
    L10_xGA: L10_xGA.toFixed(2),
    L10_PDO: L10_PDO.toFixed(2),
    current_streak,
    current_streak_type,
    L5_W,
    L5_L,
    home_streak,
    home_streak_type,
    away_streak,
    away_streak_type,
    L10_record: `${L10_W}-${L10_L}-${L10_OTL}`
  };
  
  console.log(`✅ ${team}: L10 record ${L10_W}-${L10_L}-${L10_OTL}, GF/GA: ${L10_goals_for}/${L10_goals_against}, xGF/60: ${L10_xGF_per60.toFixed(2)}, Streak: ${current_streak_type}${current_streak}`);
}

console.log('\n' + '='.repeat(80));
console.log('📊 L10 STATISTICS CALCULATED');
console.log('='.repeat(80));

// Now merge with existing teams.csv
console.log('\n📄 Loading existing teams.csv...\n');

const teamsCSV = readFileSync(join(__dirname, '../public/teams.csv'), 'utf-8');
const teamsData = Papa.parse(teamsCSV, { header: true }).data;

// Add L10 columns to teams data
let addedCount = 0;
for (const team of teamsData) {
  const teamCode = team.team;
  const l10Data = teamL10Stats[teamCode];
  
  if (l10Data) {
    Object.assign(team, l10Data);
    addedCount++;
  }
}

console.log(`✅ Added L10 stats to ${addedCount} team records\n`);

// Write to new CSV
const headers = Object.keys(teamsData[0]);
const csvContent = Papa.unparse(teamsData, { columns: headers });

const outputPath = join(__dirname, '../public/teams_with_L10.csv');
writeFileSync(outputPath, csvContent);

console.log('='.repeat(80));
console.log('✅ SUCCESS! L10 data written to teams_with_L10.csv');
console.log('='.repeat(80));
console.log('\n📋 NEW COLUMNS ADDED:');
console.log('  - L10_xGF_per60, L10_xGA_per60 (for recency weighting)');
console.log('  - L10_W, L10_L, L10_OTL (for record tracking)');
console.log('  - L10_goals_for, L10_goals_against (for calibration)');
console.log('  - L10_xGF, L10_xGA (raw totals)');
console.log('  - L10_PDO (puck luck indicator)');
console.log('  - current_streak, current_streak_type (momentum tracking)');
console.log('  - L5_W, L5_L (last 5 games record)');
console.log('  - home_streak, home_streak_type (home venue momentum)');
console.log('  - away_streak, away_streak_type (away venue momentum)');
console.log('  - L10_record (formatted string)');

console.log('\n🎯 NEXT STEPS:');
console.log('  1. Review teams_with_L10.csv to verify data');
console.log('  2. Rename teams_with_L10.csv to teams.csv (backup original first!)');
console.log('  3. Run: node scripts/implementRecencyWeighting.js (I\'ll create this next)');
console.log('\n');

