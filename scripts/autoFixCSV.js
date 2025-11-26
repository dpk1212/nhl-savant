/**
 * Auto-Fix Basketball CSV
 * 
 * Automatically updates CSV with correct Haslametrics/D-Ratings names
 * based on today's scraped data
 */

import { readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parseBasketballOdds } from '../src/utils/basketballOddsParser.js';
import { parseHaslametrics } from '../src/utils/haslametricsParser.js';
import { parseDRatings } from '../src/utils/dratingsParser.js';
import { loadTeamMappings, findTeamMapping } from '../src/utils/teamCSVLoader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function autoFixCSV() {
  console.log('\n🤖 AUTO-FIX BASKETBALL CSV\n');
  
  // 1. Load all data
  const oddsMarkdown = await readFile(join(__dirname, '../public/basketball_odds.md'), 'utf8');
  const haslaMarkdown = await readFile(join(__dirname, '../public/haslametrics.md'), 'utf8');
  const drateMarkdown = await readFile(join(__dirname, '../public/dratings.md'), 'utf8');
  let csvContent = await readFile(join(__dirname, '../public/basketball_teams.csv'), 'utf8');
  
  // 2. Parse sources
  const oddsGames = parseBasketballOdds(oddsMarkdown);
  const haslaData = parseHaslametrics(haslaMarkdown);
  const dratePreds = parseDRatings(drateMarkdown);
  
  // 3. Build lookup maps
  const haslaMap = new Map();
  haslaData.games.forEach(g => {
    haslaMap.set(g.awayTeam, g.awayTeamRaw);
    haslaMap.set(g.homeTeam, g.homeTeamRaw);
  });
  
  const drateSet = new Set();
  dratePreds.forEach(p => {
    drateSet.add(p.awayTeam);
    drateSet.add(p.homeTeam);
  });
  
  // 4. Get all OddsTrader teams
  const oddsTeams = new Set();
  oddsGames.forEach(g => {
    oddsTeams.add(g.awayTeam);
    oddsTeams.add(g.homeTeam);
  });
  
  const lines = csvContent.split('\n');
  const newLines = [lines[0]]; // Keep header
  let updatedCount = 0;
  let addedCount = 0;
  
  // 5. Process existing CSV entries
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = parseCSVLine(line);
    if (values.length < 4) {
      newLines.push(line);
      continue;
    }
    
    const oddsName = values[1];
    let haslaName = values[2];
    let drateName = values[3];
    
    // Skip if not in today's OddsTrader games
    if (!oddsTeams.has(oddsName)) {
      newLines.push(line);
      continue;
    }
    
    let updated = false;
    
    // Update Haslametrics if empty
    if (!haslaName && haslaMap.has(oddsName)) {
      haslaName = haslaMap.get(oddsName);
      updated = true;
    }
    
    // Update D-Ratings if empty
    if (!drateName && drateSet.has(oddsName)) {
      drateName = oddsName; // Try exact match first
      updated = true;
    }
    
    if (updated) {
      const status = (haslaName && drateName) ? '✓' : 
                     (!haslaName && !drateName) ? 'MISSING_HASLA|MISSING_DRATE' :
                     !haslaName ? 'MISSING_HASLA' : 'MISSING_DRATE';
      
      const newLine = `${values[0]},${oddsName},${haslaName || ''},${drateName || ''},${values[4]},${status}`;
      newLines.push(newLine);
      updatedCount++;
      console.log(`✅ Updated: ${oddsName}`);
      if (haslaName) console.log(`   Hasla: "${haslaName}"`);
      if (drateName) console.log(`   DRate: "${drateName}"`);
    } else {
      newLines.push(line);
    }
  }
  
  // 6. Add missing teams
  for (const oddsTeam of oddsTeams) {
    const exists = lines.some(line => line.startsWith(oddsTeam + ','));
    if (!exists) {
      const haslaName = haslaMap.get(oddsTeam) || '';
      const drateName = drateSet.has(oddsTeam) ? oddsTeam : '';
      const status = (haslaName && drateName) ? '✓' : 
                     (!haslaName && !drateName) ? 'NEW|MISSING_ALL' :
                     !haslaName ? 'NEW|MISSING_HASLA' : 'NEW|MISSING_DRATE';
      
      const newLine = `${oddsTeam},${oddsTeam},${haslaName},${drateName},TBD,${status}`;
      newLines.push(newLine);
      addedCount++;
      console.log(`➕ Added: ${oddsTeam}`);
    }
  }
  
  // 7. Write updated CSV
  const newCSV = newLines.join('\n') + '\n';
  await writeFile(join(__dirname, '../public/basketball_teams.csv'), newCSV, 'utf8');
  
  console.log(`\n✅ AUTO-FIX COMPLETE!`);
  console.log(`   Updated: ${updatedCount} teams`);
  console.log(`   Added: ${addedCount} teams\n`);
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

autoFixCSV().catch(console.error);

