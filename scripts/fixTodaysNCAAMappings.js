/**
 * Fix Today's NCAA API Mappings
 * Goes game-by-game and shows exactly what needs to be fixed in the CSV
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fetch NCAA games
async function fetchNCAAGames() {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
  
  const url = `https://ncaa-api.henrygd.me/scoreboard/basketball-men/d1/${dateStr}`;
  const response = await fetch(url);
  const data = await response.json();
  
  return (data.games || []).map(g => ({
    awayTeam: g.game?.away?.names?.short || '',
    homeTeam: g.game?.home?.names?.short || '',
    gameState: g.game?.gameState || 'pre'
  }));
}

// Load CSV mappings
async function loadCSV() {
  const csvPath = path.join(__dirname, '../public/basketball_teams.csv');
  const csvContent = await fs.readFile(csvPath, 'utf8');
  const lines = csvContent.trim().split('\n');
  
  const mappings = new Map();
  const header = lines[0].split(',');
  const ncaaIndex = header.indexOf('ncaa_name');
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const parts = line.split(',');
    const normalized = parts[0];
    const ncaa = ncaaIndex !== -1 && parts[ncaaIndex] ? parts[ncaaIndex] : '';
    
    mappings.set(normalized, {
      normalized,
      oddstrader: parts[1],
      ncaa
    });
  }
  
  return mappings;
}

// Find mapping for NCAA team
function findMapping(mappings, ncaaTeam) {
  // Try exact NCAA name
  for (const [key, mapping] of mappings) {
    if (mapping.ncaa === ncaaTeam) {
      return { mapping, exact: true };
    }
  }
  
  // Try exact oddstrader name
  for (const [key, mapping] of mappings) {
    if (mapping.oddstrader === ncaaTeam) {
      return { mapping, exact: false };
    }
  }
  
  // Try normalized fuzzy match
  const norm = ncaaTeam.toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const [key, mapping] of mappings) {
    const normOdds = (mapping.oddstrader || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (normOdds === norm) {
      return { mapping, exact: false };
    }
  }
  
  return null;
}

async function fixTodaysNCAAMappings() {
  console.log('=' .repeat(100));
  console.log('FIX TODAY\'S NCAA API MAPPINGS - GAME BY GAME');
  console.log('=' .repeat(100));
  console.log('\n');
  
  const mappings = await loadCSV();
  const games = await fetchNCAAGames();
  
  console.log(`📊 ${games.length} games from NCAA API today`);
  console.log(`📋 ${mappings.size} teams in CSV\n`);
  
  const issues = [];
  
  games.forEach((game, idx) => {
    const awayResult = findMapping(mappings, game.awayTeam);
    const homeResult = findMapping(mappings, game.homeTeam);
    
    let hasIssue = false;
    
    if (!awayResult || !homeResult || !awayResult.exact || !homeResult.exact) {
      hasIssue = true;
    }
    
    if (hasIssue) {
      issues.push({
        gameNum: idx + 1,
        game,
        awayResult,
        homeResult
      });
    }
  });
  
  if (issues.length === 0) {
    console.log('✅ ALL GAMES MAP CORRECTLY! 100% MATCH RATE!\n');
    return;
  }
  
  console.log(`❌ ${issues.length} games need fixing:\n`);
  console.log('=' .repeat(100));
  
  issues.forEach(issue => {
    console.log(`\nGAME ${issue.gameNum}: ${issue.game.awayTeam} @ ${issue.game.homeTeam} (${issue.game.gameState})`);
    console.log('-'.repeat(100));
    
    // Away team
    if (!issue.awayResult) {
      console.log(`  ❌ AWAY: "${issue.game.awayTeam}" NOT IN CSV`);
      console.log(`     ACTION: Add new line to CSV:`);
      console.log(`     ${issue.game.awayTeam},${issue.game.awayTeam},,,,${issue.game.awayTeam},NEW`);
    } else if (!issue.awayResult.exact) {
      console.log(`  ⚠️  AWAY: "${issue.game.awayTeam}" matched to CSV "${issue.awayResult.mapping.normalized}" via fuzzy matching`);
      console.log(`     Current CSV ncaa_name: "${issue.awayResult.mapping.ncaa}"`);
      console.log(`     ACTION: Update CSV ncaa_name from "${issue.awayResult.mapping.ncaa}" to "${issue.game.awayTeam}"`);
    }
    
    // Home team
    if (!issue.homeResult) {
      console.log(`  ❌ HOME: "${issue.game.homeTeam}" NOT IN CSV`);
      console.log(`     ACTION: Add new line to CSV:`);
      console.log(`     ${issue.game.homeTeam},${issue.game.homeTeam},,,,${issue.game.homeTeam},NEW`);
    } else if (!issue.homeResult.exact) {
      console.log(`  ⚠️  HOME: "${issue.game.homeTeam}" matched to CSV "${issue.homeResult.mapping.normalized}" via fuzzy matching`);
      console.log(`     Current CSV ncaa_name: "${issue.homeResult.mapping.ncaa}"`);
      console.log(`     ACTION: Update CSV ncaa_name from "${issue.homeResult.mapping.ncaa}" to "${issue.game.homeTeam}"`);
    }
  });
  
  console.log('\n' + '=' .repeat(100));
  console.log('SUMMARY OF FIXES NEEDED:');
  console.log('=' .repeat(100));
  
  const notInCSV = new Set();
  const needUpdate = new Map();
  
  issues.forEach(issue => {
    if (!issue.awayResult) {
      notInCSV.add(issue.game.awayTeam);
    } else if (!issue.awayResult.exact) {
      needUpdate.set(issue.awayResult.mapping.normalized, {
        current: issue.awayResult.mapping.ncaa,
        correct: issue.game.awayTeam
      });
    }
    
    if (!issue.homeResult) {
      notInCSV.add(issue.game.homeTeam);
    } else if (!issue.homeResult.exact) {
      needUpdate.set(issue.homeResult.mapping.normalized, {
        current: issue.homeResult.mapping.ncaa,
        correct: issue.game.homeTeam
      });
    }
  });
  
  if (notInCSV.size > 0) {
    console.log(`\n❌ ${notInCSV.size} teams NOT IN CSV (need to add):`);
    Array.from(notInCSV).sort().forEach(team => {
      console.log(`   "${team}"`);
    });
  }
  
  if (needUpdate.size > 0) {
    console.log(`\n⚠️  ${needUpdate.size} teams need ncaa_name updated:`);
    for (const [team, fix] of needUpdate) {
      console.log(`   "${team}": "${fix.current}" → "${fix.correct}"`);
    }
  }
  
  console.log('\n' + '=' .repeat(100));
}

fixTodaysNCAAMappings();

