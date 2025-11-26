/**
 * Game-by-Game CSV Checker
 * Goes through each OddsTrader game and verifies CSV mappings
 */

import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parseBasketballOdds } from '../src/utils/basketballOddsParser.js';
import { parseHaslametrics } from '../src/utils/haslametricsParser.js';
import { parseDRatings } from '../src/utils/dratingsParser.js';
import { loadTeamMappings, findTeamMapping } from '../src/utils/teamCSVLoader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function checkGameByGame() {
  // Load data
  const oddsMarkdown = await readFile(join(__dirname, '../public/basketball_odds.md'), 'utf8');
  const haslaMarkdown = await readFile(join(__dirname, '../public/haslametrics.md'), 'utf8');
  const drateMarkdown = await readFile(join(__dirname, '../public/dratings.md'), 'utf8');
  const csvContent = await readFile(join(__dirname, '../public/basketball_teams.csv'), 'utf8');
  
  const oddsGames = parseBasketballOdds(oddsMarkdown);
  const haslaData = parseHaslametrics(haslaMarkdown);
  const dratePreds = parseDRatings(drateMarkdown);
  const teamMappings = loadTeamMappings(csvContent);
  
  // Build lookup maps
  const haslaRawMap = new Map();
  haslaData.games.forEach(g => {
    haslaRawMap.set(g.awayTeam, g.awayTeamRaw);
    haslaRawMap.set(g.homeTeam, g.homeTeamRaw);
  });
  
  const drateSet = new Set();
  dratePreds.forEach(p => {
    drateSet.add(p.awayTeam);
    drateSet.add(p.homeTeam);
  });
  
  console.log('\n🔍 GAME-BY-GAME CSV CHECK\n');
  console.log(`Total Games: ${oddsGames.length}\n`);
  
  let issueCount = 0;
  
  for (let i = 0; i < oddsGames.length; i++) {
    const game = oddsGames[i];
    const gameNum = i + 1;
    
    // Check both teams
    const awayMapping = findTeamMapping(teamMappings, game.awayTeam, 'oddstrader');
    const homeMapping = findTeamMapping(teamMappings, game.homeTeam, 'oddstrader');
    
    let hasIssue = false;
    let issues = [];
    
    // Check away team
    if (!awayMapping) {
      hasIssue = true;
      issues.push(`❌ ${game.awayTeam} - NOT IN CSV`);
    } else {
      // Check Haslametrics
      if (!awayMapping.haslametrics) {
        const available = Array.from(haslaRawMap.values()).filter(name => 
          name.toLowerCase().includes(game.awayTeam.toLowerCase().split(' ')[0]) ||
          game.awayTeam.toLowerCase().includes(name.toLowerCase().split(' ')[0])
        );
        if (available.length > 0) {
          hasIssue = true;
          issues.push(`⚠️  ${game.awayTeam} - MISSING HASLA (available: ${available.join(', ')})`);
        }
      } else {
        // Check if mapped name exists in today's data
        const exists = Array.from(haslaRawMap.values()).includes(awayMapping.haslametrics);
        if (!exists) {
          hasIssue = true;
          issues.push(`❌ ${game.awayTeam} - WRONG HASLA: "${awayMapping.haslametrics}" not in data`);
        }
      }
      
      // Check D-Ratings
      if (!awayMapping.dratings) {
        if (drateSet.has(game.awayTeam)) {
          hasIssue = true;
          issues.push(`⚠️  ${game.awayTeam} - MISSING DRATE (found: ${game.awayTeam})`);
        }
      }
    }
    
    // Check home team
    if (!homeMapping) {
      hasIssue = true;
      issues.push(`❌ ${game.homeTeam} - NOT IN CSV`);
    } else {
      // Check Haslametrics
      if (!homeMapping.haslametrics) {
        const available = Array.from(haslaRawMap.values()).filter(name => 
          name.toLowerCase().includes(game.homeTeam.toLowerCase().split(' ')[0]) ||
          game.homeTeam.toLowerCase().includes(name.toLowerCase().split(' ')[0])
        );
        if (available.length > 0) {
          hasIssue = true;
          issues.push(`⚠️  ${game.homeTeam} - MISSING HASLA (available: ${available.join(', ')})`);
        }
      } else {
        // Check if mapped name exists in today's data
        const exists = Array.from(haslaRawMap.values()).includes(homeMapping.haslametrics);
        if (!exists) {
          hasIssue = true;
          issues.push(`❌ ${game.homeTeam} - WRONG HASLA: "${homeMapping.haslametrics}" not in data`);
        }
      }
      
      // Check D-Ratings
      if (!homeMapping.dratings) {
        if (drateSet.has(game.homeTeam)) {
          hasIssue = true;
          issues.push(`⚠️  ${game.homeTeam} - MISSING DRATE (found: ${game.homeTeam})`);
        }
      }
    }
    
    // Print game status
    if (hasIssue) {
      issueCount++;
      console.log(`GAME ${gameNum}: ${game.awayTeam} @ ${game.homeTeam}`);
      issues.forEach(issue => console.log(`  ${issue}`));
      console.log('');
    } else {
      console.log(`✅ GAME ${gameNum}: ${game.awayTeam} @ ${game.homeTeam}`);
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log(`SUMMARY: ${oddsGames.length - issueCount}/${oddsGames.length} games have correct mappings`);
  console.log(`Issues found: ${issueCount} games`);
  console.log('='.repeat(80) + '\n');
}

checkGameByGame().catch(console.error);

