/**
 * Systematic NCAA API Game-by-Game Fixer
 * Goes through EVERY OddsTrader game and verifies NCAA API mapping
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseBasketballOdds } from '../src/utils/basketballOddsParser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fetch NCAA games for today
async function fetchNCAAGames() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const dateStr = `${year}/${month}/${day}`; // NCAA API needs slashes!
  
  const url = `https://ncaa-api.henrygd.me/scoreboard/basketball-men/d1/${dateStr}`;
  const response = await fetch(url);
  const data = await response.json();
  
  return (data.games || []).map(g => ({
    awayTeam: g.game?.away?.names?.short || '',
    homeTeam: g.game?.home?.names?.short || '',
    awayScore: g.game?.away?.score || '',
    homeScore: g.game?.home?.score || '',
    status: g.game?.gameState || 'pre'
  })).filter(g => g.awayTeam && g.homeTeam);
}

// Load CSV
async function loadCSV() {
  const csvPath = path.join(__dirname, '../public/basketball_teams.csv');
  const csvContent = await fs.readFile(csvPath, 'utf8');
  const lines = csvContent.trim().split('\n');
  
  const mappings = new Map();
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const parts = line.split(',');
    if (parts.length < 7) continue;
    
    mappings.set(parts[0], {
      normalized: parts[0],
      oddstrader: parts[1],
      haslametrics: parts[2],
      dratings: parts[3],
      conference: parts[4],
      ncaa: parts[5],
      notes: parts[6]
    });
  }
  
  return mappings;
}

// Load OddsTrader games using actual parser
async function loadOddsTraderGames() {
  const oddsPath = path.join(__dirname, '../public/basketball_odds.md');
  const content = await fs.readFile(oddsPath, 'utf8');
  
  const parsedGames = parseBasketballOdds(content);
  
  return parsedGames.map(g => ({
    awayTeam: g.awayTeam,
    homeTeam: g.homeTeam
  }));
}

// Find CSV mapping for team
function findMapping(mappings, teamName) {
  const search = teamName.toLowerCase().trim();
  
  for (const [key, mapping] of mappings) {
    if (mapping.oddstrader.toLowerCase() === search) {
      return mapping;
    }
  }
  
  return null;
}

// Check if NCAA game matches our game using CSV mappings
function findNCAAMatch(ourGame, ncaaGames, awayMapping, homeMapping) {
  if (!awayMapping?.ncaa || !homeMapping?.ncaa) {
    return null;
  }
  
  const expectedAwayNCAA = awayMapping.ncaa;
  const expectedHomeNCAA = homeMapping.ncaa;
  
  // Try normal match
  for (const ncaaGame of ncaaGames) {
    if (ncaaGame.awayTeam === expectedAwayNCAA && ncaaGame.homeTeam === expectedHomeNCAA) {
      return { game: ncaaGame, reversed: false };
    }
  }
  
  // Try reversed match
  for (const ncaaGame of ncaaGames) {
    if (ncaaGame.awayTeam === expectedHomeNCAA && ncaaGame.homeTeam === expectedAwayNCAA) {
      return { game: ncaaGame, reversed: true };
    }
  }
  
  return null;
}

// Main systematic fix
async function systematicNCAAFix() {
  console.log('╔════════════════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                    SYSTEMATIC NCAA API GAME-BY-GAME FIX                               ║');
  console.log('╚════════════════════════════════════════════════════════════════════════════════════════╝');
  console.log('\n');
  
  const [oddsGames, ncaaGames, mappings] = await Promise.all([
    loadOddsTraderGames(),
    fetchNCAAGames(),
    loadCSV()
  ]);
  
  console.log(`📊 Data Loaded:`);
  console.log(`   OddsTrader Games: ${oddsGames.length}`);
  console.log(`   NCAA API Games: ${ncaaGames.length}`);
  console.log(`   CSV Teams: ${mappings.size}`);
  console.log('\n');
  
  console.log('=' .repeat(100));
  console.log('GAME-BY-GAME VERIFICATION');
  console.log('=' .repeat(100));
  console.log('\n');
  
  let perfectMatches = 0;
  let reversedMatches = 0;
  let notInCSV = 0;
  let missingNcaaName = 0;
  let noNCAAMatch = 0;
  
  const issues = [];
  
  oddsGames.forEach((game, idx) => {
    console.log(`\n${'='.repeat(100)}`);
    console.log(`GAME ${idx + 1}/${oddsGames.length}: ${game.awayTeam} @ ${game.homeTeam}`);
    console.log('-'.repeat(100));
    
    // Find CSV mappings
    const awayMapping = findMapping(mappings, game.awayTeam);
    const homeMapping = findMapping(mappings, game.homeTeam);
    
    // Check CSV status
    if (!awayMapping || !homeMapping) {
      console.log(`❌ NOT IN CSV:`);
      if (!awayMapping) console.log(`   Away team "${game.awayTeam}" not found in CSV`);
      if (!homeMapping) console.log(`   Home team "${game.homeTeam}" not found in CSV`);
      notInCSV++;
      issues.push({
        type: 'not_in_csv',
        game,
        missingAway: !awayMapping,
        missingHome: !homeMapping
      });
      return;
    }
    
    if (!awayMapping.ncaa || !homeMapping.ncaa) {
      console.log(`❌ MISSING NCAA NAME IN CSV:`);
      if (!awayMapping.ncaa) console.log(`   Away team "${game.awayTeam}" has no ncaa_name`);
      if (!homeMapping.ncaa) console.log(`   Home team "${game.homeTeam}" has no ncaa_name`);
      missingNcaaName++;
      issues.push({
        type: 'missing_ncaa_name',
        game,
        awayMapping,
        homeMapping
      });
      return;
    }
    
    console.log(`✅ CSV Mappings Found:`);
    console.log(`   Away: "${game.awayTeam}" → ncaa_name="${awayMapping.ncaa}"`);
    console.log(`   Home: "${game.homeTeam}" → ncaa_name="${homeMapping.ncaa}"`);
    
    // Try to find matching NCAA game
    const ncaaMatch = findNCAAMatch(game, ncaaGames, awayMapping, homeMapping);
    
    if (ncaaMatch) {
      if (ncaaMatch.reversed) {
        console.log(`⚠️  FOUND (REVERSED):`);
        console.log(`   NCAA: ${ncaaMatch.game.awayTeam} @ ${ncaaMatch.game.homeTeam} (${ncaaMatch.game.status})`);
        console.log(`   Scores: ${ncaaMatch.game.awayScore} - ${ncaaMatch.game.homeScore}`);
        reversedMatches++;
      } else {
        console.log(`✅ PERFECT MATCH:`);
        console.log(`   NCAA: ${ncaaMatch.game.awayTeam} @ ${ncaaMatch.game.homeTeam} (${ncaaMatch.game.status})`);
        console.log(`   Scores: ${ncaaMatch.game.awayScore} - ${ncaaMatch.game.homeScore}`);
        perfectMatches++;
      }
    } else {
      console.log(`❌ NO NCAA MATCH:`);
      console.log(`   Looking for: "${awayMapping.ncaa}" @ "${homeMapping.ncaa}"`);
      console.log(`   This game is either:`);
      console.log(`     1. Not in NCAA API today (legitimately not covered)`);
      console.log(`     2. CSV ncaa_name is WRONG`);
      console.log(`\n   Available NCAA games with similar teams:`);
      
      // Show potential matches
      const potentialMatches = ncaaGames.filter(ng => 
        ng.awayTeam.toLowerCase().includes(game.awayTeam.toLowerCase().split(' ')[0]) ||
        ng.homeTeam.toLowerCase().includes(game.homeTeam.toLowerCase().split(' ')[0]) ||
        ng.awayTeam.toLowerCase().includes(game.homeTeam.toLowerCase().split(' ')[0]) ||
        ng.homeTeam.toLowerCase().includes(game.awayTeam.toLowerCase().split(' ')[0])
      ).slice(0, 3);
      
      if (potentialMatches.length > 0) {
        potentialMatches.forEach(pm => {
          console.log(`     - ${pm.awayTeam} @ ${pm.homeTeam}`);
        });
      } else {
        console.log(`     (none found - likely not in NCAA API)`);
      }
      
      noNCAAMatch++;
      issues.push({
        type: 'no_ncaa_match',
        game,
        awayMapping,
        homeMapping,
        potentialMatches
      });
    }
  });
  
  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                                    SUMMARY                                             ║');
  console.log('╚════════════════════════════════════════════════════════════════════════════════════════╝');
  console.log('\n');
  console.log(`Total OddsTrader Games: ${oddsGames.length}`);
  console.log(`\n✅ Perfect Matches: ${perfectMatches}`);
  console.log(`⚠️  Reversed Matches: ${reversedMatches}`);
  console.log(`❌ Not in CSV: ${notInCSV}`);
  console.log(`❌ Missing ncaa_name: ${missingNcaaName}`);
  console.log(`❌ No NCAA Match: ${noNCAAMatch}`);
  console.log(`\n📊 SUCCESS RATE: ${((perfectMatches + reversedMatches) / oddsGames.length * 100).toFixed(1)}%`);
  console.log(`🎯 TARGET: 100%`);
  
  if (issues.length > 0) {
    console.log('\n');
    console.log('╔════════════════════════════════════════════════════════════════════════════════════════╗');
    console.log('║                                  ISSUES TO FIX                                         ║');
    console.log('╚════════════════════════════════════════════════════════════════════════════════════════╝');
    console.log('\n');
    
    // Write issues to JSON for easier processing
    const issuesPath = path.join(__dirname, '../public/ncaa_issues.json');
    await fs.writeFile(issuesPath, JSON.stringify(issues, null, 2));
    console.log(`📝 Detailed issues saved to: public/ncaa_issues.json`);
  }
  
  console.log('\n');
  console.log('=' .repeat(100));
}

systematicNCAAFix();

