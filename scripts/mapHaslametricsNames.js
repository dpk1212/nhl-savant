/**
 * Map Haslametrics Names to CSV
 * Auto-fills missing haslametrics_name columns by fuzzy matching with today's data
 */

import { readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
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

function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  values.push(current.trim());
  return values;
}

function escapeCSV(value) {
  if (!value) return '';
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

async function mapHaslametricsNames() {
  console.log('\n🗺️  MAPPING HASLAMETRICS NAMES');
  console.log('==========================================\n');
  
  // Load Haslametrics data
  const haslaMarkdown = await readFile(join(__dirname, '../public/haslametrics.md'), 'utf8');
  const haslaData = parseHaslametrics(haslaMarkdown);
  const haslaGames = haslaData.games || [];
  
  // Extract all Haslametrics team names
  const haslaTeams = new Set();
  haslaGames.forEach(g => {
    haslaTeams.add(g.awayTeamRaw);
    haslaTeams.add(g.homeTeamRaw);
  });
  
  console.log(`📊 Loaded ${haslaTeams.size} unique Haslametrics teams\n`);
  
  // Load current CSV
  const csvPath = join(__dirname, '../public/basketball_teams.csv');
  const csvContent = await readFile(csvPath, 'utf8');
  const lines = csvContent.split('\n');
  const headers = parseCSVLine(lines[0]);
  
  console.log(`📋 CSV Headers: ${headers.join(', ')}\n`);
  
  // Find column indices
  const oddstraderIdx = headers.findIndex(h => h.toLowerCase().includes('oddstrader'));
  const haslametricsIdx = headers.findIndex(h => h.toLowerCase().includes('haslametrics'));
  const ncaaIdx = headers.findIndex(h => h.toLowerCase().includes('ncaa'));
  
  console.log(`Column indices: oddstrader=${oddstraderIdx}, haslametrics=${haslametricsIdx}, ncaa=${ncaaIdx}\n`);
  
  const updatedLines = [lines[0]]; // Keep header
  let fillCount = 0;
  let skipCount = 0;
  let alreadyHasCount = 0;
  
  console.log('🔍 Processing teams...\n');
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      updatedLines.push('');
      continue;
    }
    
    const values = parseCSVLine(line);
    if (values.length < 4) {
      updatedLines.push(line);
      continue;
    }
    
    const oddstraderName = values[oddstraderIdx];
    const currentHaslaName = values[haslametricsIdx];
    
    // Skip if already has Haslametrics name
    if (currentHaslaName && currentHaslaName.length > 0) {
      alreadyHasCount++;
      updatedLines.push(line);
      continue;
    }
    
    // Skip if no OddsTrader name (not a primary team)
    if (!oddstraderName || oddstraderName.length === 0) {
      updatedLines.push(line);
      continue;
    }
    
    // Find best match in Haslametrics
    let bestMatch = null;
    let bestConfidence = 0;
    
    Array.from(haslaTeams).forEach(haslaTeam => {
      const confidence = fuzzyMatch(oddstraderName, haslaTeam);
      if (confidence > bestConfidence) {
        bestConfidence = confidence;
        bestMatch = haslaTeam;
      }
    });
    
    // Auto-fill if confidence >= 80%
    if (bestMatch && bestConfidence >= 80) {
      values[haslametricsIdx] = bestMatch;
      
      // Also fill NCAA name if empty and confidence is 100%
      if ((!values[ncaaIdx] || values[ncaaIdx].length === 0) && bestConfidence === 100) {
        values[ncaaIdx] = bestMatch;
      }
      
      const newLine = values.map(escapeCSV).join(',');
      updatedLines.push(newLine);
      
      console.log(`✅ ${oddstraderName} → "${bestMatch}" (${bestConfidence}% confidence)`);
      fillCount++;
    } else if (bestMatch && bestConfidence >= 50) {
      updatedLines.push(line);
      console.log(`⚠️  ${oddstraderName} → "${bestMatch}" (${bestConfidence}% confidence) - NEEDS MANUAL REVIEW`);
      skipCount++;
    } else {
      updatedLines.push(line);
      console.log(`❌ ${oddstraderName} → NO MATCH`);
      skipCount++;
    }
  }
  
  // Write updated CSV
  const updatedCSV = updatedLines.join('\n');
  await writeFile(csvPath, updatedCSV, 'utf8');
  
  console.log('\n\n📊 SUMMARY:');
  console.log('==========================================');
  console.log(`Already had Haslametrics name: ${alreadyHasCount}`);
  console.log(`Auto-filled (80%+ confidence): ${fillCount}`);
  console.log(`Skipped (no match or low confidence): ${skipCount}`);
  console.log(`\n✅ CSV updated: ${csvPath}\n`);
  
  return { fillCount, skipCount, alreadyHasCount };
}

mapHaslametricsNames()
  .then(result => {
    console.log('✅ Mapping complete!\n');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error);
    console.error(error.stack);
    process.exit(1);
  });

