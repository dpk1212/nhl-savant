/**
 * Diagnose Haslametrics Coverage Today
 * Shows what games Haslametrics actually has and how they could match OddsTrader
 */

import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parseBasketballOdds } from '../src/utils/basketballOddsParser.js';
import { parseHaslametrics } from '../src/utils/haslametricsParser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function fuzzyMatch(str1, str2) {
  const norm1 = str1.toLowerCase().replace(/[^a-z0-9]/g, '');
  const norm2 = str2.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  if (norm1 === norm2) return 100;
  if (norm1.includes(norm2) || norm2.includes(norm1)) return 80;
  
  // Check for word overlap
  const words1 = str1.toLowerCase().split(/\s+/);
  const words2 = str2.toLowerCase().split(/\s+/);
  const commonWords = words1.filter(w => words2.includes(w));
  
  if (commonWords.length > 0) {
    return Math.round((commonWords.length / Math.max(words1.length, words2.length)) * 60);
  }
  
  return 0;
}

async function diagnoseHaslametricsToday() {
  console.log('\n🔍 DIAGNOSING HASLAMETRICS COVERAGE');
  console.log('==========================================\n');
  
  // Load data
  const oddsMarkdown = await readFile(join(__dirname, '../public/basketball_odds.md'), 'utf8');
  const haslaMarkdown = await readFile(join(__dirname, '../public/haslametrics.md'), 'utf8');
  
  // Parse
  const oddsGames = parseBasketballOdds(oddsMarkdown);
  const haslaData = parseHaslametrics(haslaMarkdown);
  const haslaGames = haslaData.games || [];
  
  console.log(`📊 Data Summary:`);
  console.log(`   OddsTrader: ${oddsGames.length} games`);
  console.log(`   Haslametrics: ${haslaGames.length} games\n`);
  
  // Extract all Haslametrics teams
  const haslaTeams = new Set();
  haslaGames.forEach(g => {
    haslaTeams.add(g.awayTeamRaw);
    haslaTeams.add(g.homeTeamRaw);
  });
  
  console.log(`📋 Unique Haslametrics teams: ${haslaTeams.size}\n`);
  
  // For each OddsTrader team, find potential Haslametrics matches
  const oddsTeams = new Set();
  oddsGames.forEach(g => {
    oddsTeams.add(g.awayTeam);
    oddsTeams.add(g.homeTeam);
  });
  
  console.log(`📋 Unique OddsTrader teams: ${oddsTeams.size}\n`);
  
  console.log('🔍 POTENTIAL MATCHES:');
  console.log('==========================================\n');
  
  const potentialMatches = new Map();
  let highConfidenceMatches = 0;
  let mediumConfidenceMatches = 0;
  let noMatches = 0;
  
  Array.from(oddsTeams).sort().forEach(oddsTeam => {
    const matches = [];
    
    Array.from(haslaTeams).forEach(haslaTeam => {
      const confidence = fuzzyMatch(oddsTeam, haslaTeam);
      if (confidence >= 50) {
        matches.push({ haslaTeam, confidence });
      }
    });
    
    matches.sort((a, b) => b.confidence - a.confidence);
    
    if (matches.length > 0) {
      potentialMatches.set(oddsTeam, matches[0]);
      
      if (matches[0].confidence >= 80) {
        highConfidenceMatches++;
        console.log(`✅ ${oddsTeam} → "${matches[0].haslaTeam}" (${matches[0].confidence}% confidence)`);
      } else {
        mediumConfidenceMatches++;
        console.log(`⚠️  ${oddsTeam} → "${matches[0].haslaTeam}" (${matches[0].confidence}% confidence)`);
      }
    } else {
      noMatches++;
      console.log(`❌ ${oddsTeam} → NO MATCH FOUND`);
    }
  });
  
  console.log('\n\n📊 SUMMARY:');
  console.log('==========================================');
  console.log(`High confidence (80%+): ${highConfidenceMatches} teams`);
  console.log(`Medium confidence (50-79%): ${mediumConfidenceMatches} teams`);
  console.log(`No match: ${noMatches} teams`);
  console.log(`\nPotential full matches: ${highConfidenceMatches} games (if CSV was complete)`);
  console.log(`Needs manual review: ${mediumConfidenceMatches} games`);
  console.log(`Legitimately missing: ${noMatches} games\n`);
  
  // Show game-by-game potential matches
  console.log('🎯 GAME-BY-GAME POTENTIAL MATCHES:');
  console.log('==========================================\n');
  
  let potentialFullMatches = 0;
  
  oddsGames.forEach((game, i) => {
    const awayMatch = potentialMatches.get(game.awayTeam);
    const homeMatch = potentialMatches.get(game.homeTeam);
    
    if (awayMatch && homeMatch) {
      // Check if this game exists in Haslametrics
      const haslaGame = haslaGames.find(g =>
        (g.awayTeamRaw === awayMatch.haslaTeam && g.homeTeamRaw === homeMatch.haslaTeam) ||
        (g.awayTeamRaw === homeMatch.haslaTeam && g.homeTeamRaw === awayMatch.haslaTeam)
      );
      
      if (haslaGame) {
        potentialFullMatches++;
        console.log(`${i + 1}. ✅ ${game.awayTeam} @ ${game.homeTeam}`);
        console.log(`   Haslametrics: "${haslaGame.awayTeamRaw}" @ "${haslaGame.homeTeamRaw}"`);
        console.log(`   Confidence: Away ${awayMatch.confidence}%, Home ${homeMatch.confidence}%\n`);
      }
    }
  });
  
  console.log(`\n💡 POTENTIAL IF CSV WAS COMPLETE: ${potentialFullMatches}/${oddsGames.length} games would have full data\n`);
  
  return {
    highConfidenceMatches,
    mediumConfidenceMatches,
    noMatches,
    potentialFullMatches,
    totalOddsGames: oddsGames.length,
    potentialMatches
  };
}

diagnoseHaslametricsToday()
  .then(result => {
    console.log('✅ Diagnosis complete!\n');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

export { diagnoseHaslametricsToday, fuzzyMatch };

