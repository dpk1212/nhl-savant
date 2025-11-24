/**
 * Debug Basketball Data Matching
 * Identifies mismatches between Haslametrics, D-Ratings, and OddsTrader
 */

import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parseBasketballOdds } from '../src/utils/basketballOddsParser.js';
import { parseHaslametrics } from '../src/utils/haslametricsParser.js';
import { parseDRatings } from '../src/utils/dratingsParser.js';
import { normalizeTeamName } from '../src/utils/teamNameNormalizer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function debugMatching() {
  console.log('\n🔍 BASKETBALL DATA MATCHING DEBUG');
  console.log('=====================================\n');
  
  // Load data files
  const oddsMarkdown = await readFile(join(__dirname, '../public/basketball_odds.md'), 'utf8');
  const haslaMarkdown = await readFile(join(__dirname, '../public/haslametrics.md'), 'utf8');
  const drateMarkdown = await readFile(join(__dirname, '../public/dratings.md'), 'utf8');
  
  // Parse each source
  const oddsGames = parseBasketballOdds(oddsMarkdown);
  const haslaData = parseHaslametrics(haslaMarkdown);
  const dratePreds = parseDRatings(drateMarkdown);
  
  console.log(`📊 Data Loaded:`);
  console.log(`   - Haslametrics: ${haslaData.games.length} games`);
  console.log(`   - D-Ratings: ${dratePreds.length} predictions`);
  console.log(`   - OddsTrader: ${oddsGames.length} games\n`);
  
  // Create team name sets for comparison
  const haslaTeams = new Set();
  haslaData.games.forEach(g => {
    haslaTeams.add(g.awayTeam);
    haslaTeams.add(g.homeTeam);
  });
  
  const drateTeams = new Set();
  dratePreds.forEach(g => {
    drateTeams.add(g.awayTeam);
    drateTeams.add(g.homeTeam);
  });
  
  const oddsTeams = new Set();
  oddsGames.forEach(g => {
    oddsTeams.add(g.awayTeam);
    oddsTeams.add(g.homeTeam);
  });
  
  console.log(`\n👥 Unique Teams:`);
  console.log(`   - Haslametrics: ${haslaTeams.size} teams`);
  console.log(`   - D-Ratings: ${drateTeams.size} teams`);
  console.log(`   - OddsTrader: ${oddsTeams.size} teams\n`);
  
  // Find unmatched D-Ratings games
  console.log(`\n🚫 D-RATINGS GAMES NOT IN HASLAMETRICS:`);
  console.log(`========================================\n`);
  
  const unmatchedDRate = [];
  dratePreds.forEach(drate => {
    const hasMatch = haslaData.games.some(hasla =>
      hasla.awayTeam === drate.awayTeam && hasla.homeTeam === drate.homeTeam
    );
    
    if (!hasMatch) {
      unmatchedDRate.push(drate);
      console.log(`❌ ${drate.awayTeamRaw} @ ${drate.homeTeamRaw}`);
      console.log(`   Normalized: ${drate.awayTeam} @ ${drate.homeTeam}`);
      console.log(`   Time: ${drate.gameTime}\n`);
    }
  });
  
  console.log(`\nTotal unmatched D-Ratings: ${unmatchedDRate.length}/${dratePreds.length}\n`);
  
  // Find unmatched Haslametrics games
  console.log(`\n🚫 HASLAMETRICS GAMES NOT IN D-RATINGS:`);
  console.log(`========================================\n`);
  
  const unmatchedHasla = [];
  haslaData.games.forEach(hasla => {
    const hasMatch = dratePreds.some(drate =>
      drate.awayTeam === hasla.awayTeam && drate.homeTeam === hasla.homeTeam
    );
    
    if (!hasMatch) {
      unmatchedHasla.push(hasla);
      console.log(`❌ ${hasla.awayTeamRaw} @ ${hasla.homeTeamRaw}`);
      console.log(`   Normalized: ${hasla.awayTeam} @ ${hasla.homeTeam}`);
      console.log(`   Time: ${hasla.gameTime}\n`);
    }
  });
  
  console.log(`\nTotal unmatched Haslametrics: ${unmatchedHasla.length}/${haslaData.games.length}\n`);
  
  // Check for close matches (potential normalization issues)
  console.log(`\n🔄 POTENTIAL NORMALIZATION ISSUES:`);
  console.log(`===================================\n`);
  
  unmatchedDRate.forEach(drate => {
    haslaData.games.forEach(hasla => {
      // Check if away teams are similar
      const awayMatch = similarity(drate.awayTeam.toLowerCase(), hasla.awayTeam.toLowerCase()) > 0.7 ||
                       similarity(drate.awayTeamRaw.toLowerCase(), hasla.awayTeamRaw.toLowerCase()) > 0.7;
      
      const homeMatch = similarity(drate.homeTeam.toLowerCase(), hasla.homeTeam.toLowerCase()) > 0.7 ||
                       similarity(drate.homeTeamRaw.toLowerCase(), hasla.homeTeamRaw.toLowerCase()) > 0.7;
      
      if (awayMatch && homeMatch) {
        console.log(`🔍 Possible match found:`);
        console.log(`   D-Ratings: ${drate.awayTeamRaw} @ ${drate.homeTeamRaw}`);
        console.log(`              (${drate.awayTeam} @ ${drate.homeTeam})`);
        console.log(`   Haslametrics: ${hasla.awayTeamRaw} @ ${hasla.homeTeamRaw}`);
        console.log(`                 (${hasla.awayTeam} @ ${hasla.homeTeam})\n`);
      }
    });
  });
  
  // Team name mapping suggestions
  console.log(`\n💡 SUGGESTED TEAM NORMALIZATIONS:`);
  console.log(`==================================\n`);
  
  const suggestions = [];
  
  // Find teams in D-Ratings not in Haslametrics
  drateTeams.forEach(drateTeam => {
    if (!haslaTeams.has(drateTeam)) {
      // Find similar Hasla team
      let closestMatch = null;
      let closestScore = 0;
      
      haslaTeams.forEach(haslaTeam => {
        const score = similarity(drateTeam.toLowerCase(), haslaTeam.toLowerCase());
        if (score > closestScore && score > 0.6) {
          closestScore = score;
          closestMatch = haslaTeam;
        }
      });
      
      if (closestMatch) {
        suggestions.push({
          drate: drateTeam,
          hasla: closestMatch,
          score: closestScore
        });
      }
    }
  });
  
  suggestions.sort((a, b) => b.score - a.score);
  suggestions.slice(0, 20).forEach(s => {
    console.log(`  '${s.drate.toLowerCase()}': { normalized: '${s.hasla}', ... },`);
  });
  
  console.log(`\n\n✅ Debug analysis complete!\n`);
}

// Simple string similarity function (Dice coefficient)
function similarity(s1, s2) {
  const set1 = new Set(bigrams(s1));
  const set2 = new Set(bigrams(s2));
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  
  return (2 * intersection.size) / (set1.size + set2.size);
}

function bigrams(str) {
  const bigrams = [];
  for (let i = 0; i < str.length - 1; i++) {
    bigrams.push(str.substring(i, i + 2));
  }
  return bigrams;
}

debugMatching().catch(console.error);

