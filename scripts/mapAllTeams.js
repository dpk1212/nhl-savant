/**
 * Systematically map ALL teams between Haslametrics and D-Ratings
 * Creates a complete 1-to-1 mapping for every team
 */

import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parseHaslametrics } from '../src/utils/haslametricsParser.js';
import { parseDRatings } from '../src/utils/dratingsParser.js';
import { normalizeTeamName } from '../src/utils/teamNameNormalizer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function mapAllTeams() {
  console.log('\n🔍 COMPLETE TEAM MAPPING ANALYSIS');
  console.log('==========================================\n');
  
  // Load data
  const haslaMarkdown = await readFile(join(__dirname, '../public/haslametrics.md'), 'utf8');
  const drateMarkdown = await readFile(join(__dirname, '../public/dratings.md'), 'utf8');
  
  // Parse data
  const haslaData = parseHaslametrics(haslaMarkdown);
  const dratePreds = parseDRatings(drateMarkdown);
  
  // Extract ALL unique team names (raw and normalized)
  const haslaTeamsRaw = new Set();
  const haslaTeamsNorm = new Set();
  
  haslaData.games.forEach(g => {
    haslaTeamsRaw.add(g.awayTeamRaw);
    haslaTeamsRaw.add(g.homeTeamRaw);
    haslaTeamsNorm.add(g.awayTeam);
    haslaTeamsNorm.add(g.homeTeam);
  });
  
  const drateTeamsRaw = new Set();
  const drateTeamsNorm = new Set();
  
  dratePreds.forEach(g => {
    drateTeamsRaw.add(g.awayTeamRaw);
    drateTeamsRaw.add(g.homeTeamRaw);
    drateTeamsNorm.add(g.awayTeam);
    drateTeamsNorm.add(g.homeTeam);
  });
  
  console.log('📊 UNIQUE TEAMS FOUND:');
  console.log(`   Haslametrics: ${haslaTeamsRaw.size} raw → ${haslaTeamsNorm.size} normalized`);
  console.log(`   D-Ratings: ${drateTeamsRaw.size} raw → ${drateTeamsNorm.size} normalized\n`);
  
  // Find D-Ratings teams NOT in Haslametrics (after normalization)
  const unmatchedDRate = [];
  drateTeamsNorm.forEach(drateTeam => {
    if (!haslaTeamsNorm.has(drateTeam)) {
      // Find the raw name(s)
      const rawNames = [];
      dratePreds.forEach(p => {
        if (p.awayTeam === drateTeam) rawNames.push(p.awayTeamRaw);
        if (p.homeTeam === drateTeam) rawNames.push(p.homeTeamRaw);
      });
      
      unmatchedDRate.push({
        normalized: drateTeam,
        raw: [...new Set(rawNames)]
      });
    }
  });
  
  // Find Haslametrics teams NOT in D-Ratings (after normalization)
  const unmatchedHasla = [];
  haslaTeamsNorm.forEach(haslaTeam => {
    if (!drateTeamsNorm.has(haslaTeam)) {
      // Find the raw name(s)
      const rawNames = [];
      haslaData.games.forEach(g => {
        if (g.awayTeam === haslaTeam) rawNames.push(g.awayTeamRaw);
        if (g.homeTeam === haslaTeam) rawNames.push(g.homeTeamRaw);
      });
      
      unmatchedHasla.push({
        normalized: haslaTeam,
        raw: [...new Set(rawNames)]
      });
    }
  });
  
  console.log('\n❌ UNMATCHED D-RATINGS TEAMS:');
  console.log('================================\n');
  
  unmatchedDRate.forEach(team => {
    console.log(`D-Ratings: "${team.normalized}"`);
    console.log(`Raw names: ${team.raw.join(', ')}`);
    
    // Find best Hasla match
    let bestMatch = null;
    let bestScore = 0;
    
    haslaTeamsNorm.forEach(haslaTeam => {
      const score = similarity(team.normalized.toLowerCase(), haslaTeam.toLowerCase());
      if (score > bestScore) {
        bestScore = score;
        bestMatch = haslaTeam;
      }
    });
    
    if (bestMatch && bestScore > 0.5) {
      console.log(`→ Best Hasla match: "${bestMatch}" (${(bestScore * 100).toFixed(0)}% similar)`);
      
      // Find Hasla raw names
      const haslaRaw = [];
      haslaData.games.forEach(g => {
        if (g.awayTeam === bestMatch) haslaRaw.push(g.awayTeamRaw);
        if (g.homeTeam === bestMatch) haslaRaw.push(g.homeTeamRaw);
      });
      console.log(`   Hasla raw: ${[...new Set(haslaRaw)].join(', ')}`);
      
      // Generate mapping suggestion
      console.log(`\n   ADD TO NORMALIZER:`);
      team.raw.forEach(rawName => {
        console.log(`   '${rawName.toLowerCase()}': { normalized: '${bestMatch}', ... },`);
      });
    } else {
      console.log(`→ No good Hasla match found (best: ${(bestScore * 100).toFixed(0)}%)`);
    }
    console.log('');
  });
  
  console.log('\n❌ UNMATCHED HASLAMETRICS TEAMS:');
  console.log('===================================\n');
  
  unmatchedHasla.forEach(team => {
    console.log(`Haslametrics: "${team.normalized}"`);
    console.log(`Raw names: ${team.raw.join(', ')}`);
    
    // Find best D-Rate match
    let bestMatch = null;
    let bestScore = 0;
    
    drateTeamsNorm.forEach(drateTeam => {
      const score = similarity(team.normalized.toLowerCase(), drateTeam.toLowerCase());
      if (score > bestScore) {
        bestScore = score;
        bestMatch = drateTeam;
      }
    });
    
    if (bestMatch && bestScore > 0.5) {
      console.log(`→ Best D-Rate match: "${bestMatch}" (${(bestScore * 100).toFixed(0)}% similar)`);
      
      // Find D-Rate raw names
      const drateRaw = [];
      dratePreds.forEach(p => {
        if (p.awayTeam === bestMatch) drateRaw.push(p.awayTeamRaw);
        if (p.homeTeam === bestMatch) drateRaw.push(p.homeTeamRaw);
      });
      console.log(`   D-Rate raw: ${[...new Set(drateRaw)].join(', ')}`);
      
      // Generate mapping suggestion
      console.log(`\n   ADD TO NORMALIZER:`);
      team.raw.forEach(rawName => {
        console.log(`   '${rawName.toLowerCase()}': { normalized: '${team.normalized}', ... },`);
      });
    } else {
      console.log(`→ No good D-Rate match found`);
    }
    console.log('');
  });
  
  console.log('\n📋 SUMMARY:');
  console.log('===========');
  console.log(`Total D-Ratings teams: ${drateTeamsNorm.size}`);
  console.log(`Total Haslametrics teams: ${haslaTeamsNorm.size}`);
  console.log(`Unmatched D-Ratings: ${unmatchedDRate.length}`);
  console.log(`Unmatched Haslametrics: ${unmatchedHasla.length}`);
  console.log(`\nMatch rate: ${((1 - Math.max(unmatchedDRate.length, unmatchedHasla.length) / Math.max(drateTeamsNorm.size, haslaTeamsNorm.size)) * 100).toFixed(1)}%`);
  
  // Generate complete normalizer code
  console.log('\n\n📝 COMPLETE NORMALIZER MAPPINGS NEEDED:');
  console.log('=========================================\n');
  
  const allMappings = new Set();
  
  unmatchedDRate.forEach(team => {
    let bestMatch = null;
    let bestScore = 0;
    
    haslaTeamsNorm.forEach(haslaTeam => {
      const score = similarity(team.normalized.toLowerCase(), haslaTeam.toLowerCase());
      if (score > bestScore) {
        bestScore = score;
        bestMatch = haslaTeam;
      }
    });
    
    if (bestMatch && bestScore > 0.5) {
      team.raw.forEach(rawName => {
        allMappings.add(`  '${rawName.toLowerCase()}': { normalized: '${bestMatch}', fullName: '${rawName}', conference: 'TBD' },`);
      });
    }
  });
  
  unmatchedHasla.forEach(team => {
    team.raw.forEach(rawName => {
      allMappings.add(`  '${rawName.toLowerCase()}': { normalized: '${team.normalized}', fullName: '${rawName}', conference: 'TBD' },`);
    });
  });
  
  console.log([...allMappings].sort().join('\n'));
  
  console.log('\n\n✅ Analysis complete!\n');
}

// Dice coefficient similarity
function similarity(s1, s2) {
  const set1 = new Set(bigrams(s1));
  const set2 = new Set(bigrams(s2));
  
  if (set1.size === 0 && set2.size === 0) return 1;
  if (set1.size === 0 || set2.size === 0) return 0;
  
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

mapAllTeams().catch(console.error);


