/**
 * Barttorvik Data Fetcher using Firecrawl
 * Scrapes T-Rank team ratings + Shooting Splits (PBP) data
 * 
 * Sources:
 *   1. https://barttorvik.com/          - T-Rank (AdjOE, AdjDE, eFG%, TOR, ORB, FTR, 2P%, 3P%, Adj T, WAB)
 *   2. https://barttorvik.com/teampbp.php?year=2026&sort=1 - Shooting Splits (close 2s, far 2s, 3s breakdown)
 * 
 * Outputs:
 *   - public/Bart.md            (T-Rank raw markdown)
 *   - public/bart_pbp.md        (Shooting splits raw markdown)
 * 
 * Usage: node scripts/fetchBarttorvik.js
 */

import Firecrawl from '@mendable/firecrawl-js';
import fs from 'fs/promises';
import { readFileSync } from 'fs';
import * as dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

const firecrawl = new Firecrawl({ 
  apiKey: process.env.FIRECRAWL_API_KEY
});

console.log('📊 BARTTORVIK DATA FETCHER');
console.log('='.repeat(50));
console.log(`🕐 Started: ${new Date().toLocaleString()}\n`);

/**
 * Retry helper with exponential backoff
 */
async function retryWithBackoff(fn, retries = 3, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      const isLastAttempt = i === retries - 1;
      if (isLastAttempt) throw error;
      
      console.log(`   ⚠️  Attempt ${i + 1} failed: ${error.message}`);
      console.log(`   ⏳ Retrying in ${delay / 1000}s...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
}

/**
 * Parse T-Rank markdown into structured team data (quick validation version)
 */
function parseTRankData(markdown) {
  const teams = {};
  const lines = markdown.split('\n');
  
  for (const line of lines) {
    if (!line.startsWith('|') || line.includes('---') || line.includes('[Rk]')) continue;
    
    const cells = line.split('|').map(c => c.trim()).filter(c => c);
    if (cells.length < 24) continue;
    
    try {
      const rank = parseInt(cells[0].trim());
      if (isNaN(rank)) continue;
      
      const teamCell = cells[1].trim();
      const urlMatch = teamCell.match(/team=([^&\)]+)/);
      if (!urlMatch) continue;
      
      const teamName = decodeURIComponent(urlMatch[1].replace(/\+/g, ' '));
      
      const parseStatCell = (cell) => {
        const parts = cell.trim().split('<br>');
        return { value: parseFloat(parts[0]) || 0, rank: parts[1] ? parseInt(parts[1]) : null };
      };
      
      teams[teamName] = {
        rank,
        teamName,
        adjOff: parseStatCell(cells[5]).value,
        adjDef: parseStatCell(cells[6]).value,
        barthag: parseStatCell(cells[7]).value,
        eFG_off: parseStatCell(cells[8]).value,
        eFG_def: parseStatCell(cells[9]).value,
        to_off: parseStatCell(cells[10]).value,
        to_def: parseStatCell(cells[11]).value,
        oreb_off: parseStatCell(cells[12]).value,
        oreb_def: parseStatCell(cells[13]).value,
        ftRate_off: parseStatCell(cells[14]).value,
        ftRate_def: parseStatCell(cells[15]).value,
        twoP_off: parseStatCell(cells[16]).value,
        twoP_def: parseStatCell(cells[17]).value,
        threeP_off: parseStatCell(cells[18]).value,
        threeP_def: parseStatCell(cells[19]).value,
        threeP_rate_off: parseStatCell(cells[20]).value,
        threeP_rate_def: parseStatCell(cells[21]).value,
        adjTempo: parseStatCell(cells[22]).value,
        wab: parseStatCell(cells[23]).value
      };
    } catch {
      continue;
    }
  }
  
  return teams;
}

/**
 * Parse Shooting Splits (PBP) markdown into structured data
 * 
 * Firecrawl renders the multi-row header table with 20 stat values per team:
 * Each of the 4 categories (Dunks, Close 2s, Far 2s, 3s) has 5 cells:
 *   O FG%, O Share, D FG%, D FG% (duplicate from merged cell), D Share
 * 
 * Column mapping (cell indices after rank/team/conf):
 *   [3] Dunks O FG%     [4] Dunks O Share    [5] Dunks D FG%    [6] dup  [7] Dunks D Share
 *   [8] Close2 O FG%    [9] Close2 O Share   [10] Close2 D FG%  [11] dup [12] Close2 D Share
 *   [13] Far2 O FG%     [14] Far2 O Share    [15] Far2 D FG%    [16] dup [17] Far2 D Share
 *   [18] 3P O FG%       [19] 3P O Share      [20] 3P D FG%      [21] dup [22] 3P D Share
 */
function parsePBPData(markdown) {
  const teams = {};
  const lines = markdown.split('\n');
  
  for (const line of lines) {
    if (!line.startsWith('|')) continue;
    
    const cells = line.split('|').map(c => c.trim()).filter(c => c);
    
    // Skip separator and header rows
    if (cells.every(c => c.match(/^[-:]+$/))) continue;
    if (cells.length < 20) continue;
    
    try {
      const rank = parseInt(cells[0].trim());
      if (isNaN(rank)) continue;
      
      const teamCell = cells[1] || '';
      const urlMatch = teamCell.match(/team=([^&\)]+)/);
      if (!urlMatch) continue;
      
      const teamName = decodeURIComponent(urlMatch[1].replace(/\+/g, ' '));
      const p = (idx) => parseFloat(cells[idx]) || 0;
      
      teams[teamName] = {
        rank,
        teamName,
        // Dunks
        dunks_off_fg: p(3),
        dunks_off_share: p(4),
        dunks_def_fg: p(5),
        dunks_def_share: p(7),
        // Close Twos
        close2_off_fg: p(8),
        close2_off_share: p(9),
        close2_def_fg: p(10),
        close2_def_share: p(12),
        // Far Twos (mid-range)
        far2_off_fg: p(13),
        far2_off_share: p(14),
        far2_def_fg: p(15),
        far2_def_share: p(17),
        // Three Pointers
        three_off_fg: p(18),
        three_off_share: p(19),
        three_def_fg: p(20),
        three_def_share: p(22)
      };
    } catch {
      continue;
    }
  }
  
  return teams;
}

/**
 * Load team CSV mapping for validation
 */
function loadTeamMapping() {
  try {
    const csvPath = join(__dirname, '../public/basketball_teams.csv');
    const csvContent = readFileSync(csvPath, 'utf8');
    const lines = csvContent.split('\n').filter(l => l.trim());
    const headers = lines[0].split(',');
    
    const bartIdx = headers.indexOf('barttorvik_name');
    const normIdx = headers.indexOf('normalized_name');
    
    const mapping = {};
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',');
      const bartName = cols[bartIdx]?.trim();
      const normName = cols[normIdx]?.trim();
      if (bartName && normName) {
        mapping[bartName] = normName;
      }
    }
    
    return mapping;
  } catch (error) {
    console.log('⚠️  Could not load basketball_teams.csv for validation');
    return {};
  }
}

/**
 * Validate scraped teams against CSV mapping
 */
function validateTeamMatching(scrapedTeams, mapping, label) {
  const scrapedNames = Object.keys(scrapedTeams);
  const mappedNames = Object.keys(mapping);
  
  let matched = 0;
  let unmatched = [];
  
  for (const name of scrapedNames) {
    if (mapping[name]) {
      matched++;
    } else {
      unmatched.push(name);
    }
  }
  
  console.log(`\n📋 ${label} Team Matching:`);
  console.log(`   ✅ Matched: ${matched}/${scrapedNames.length}`);
  
  if (unmatched.length > 0) {
    console.log(`   ❌ Unmatched (${unmatched.length}):`);
    unmatched.slice(0, 20).forEach(name => {
      // Try to find close matches
      const close = mappedNames.find(m => 
        m.toLowerCase() === name.toLowerCase() ||
        m.toLowerCase().includes(name.toLowerCase()) ||
        name.toLowerCase().includes(m.toLowerCase())
      );
      console.log(`      - "${name}"${close ? ` (close: "${close}")` : ''}`);
    });
    if (unmatched.length > 20) {
      console.log(`      ... and ${unmatched.length - 20} more`);
    }
  }
  
  return { matched, unmatched, total: scrapedNames.length };
}


// ============================================================
// MAIN
// ============================================================

async function fetchBarttorvik() {
  const results = { trank: false, pbp: false };
  const cacheBuster = Date.now();
  
  // ──────────────────────────────────────────────
  // 1. Fetch T-Rank (main page)
  // ──────────────────────────────────────────────
  console.log('📊 [1/2] Fetching T-Rank data from barttorvik.com...');
  console.log('   URL: https://barttorvik.com/trank.php?year=2026');
  console.log('   ⏳ Timeout: 5 minutes\n');
  
  try {
    const trankResult = await retryWithBackoff(async () => {
      return await firecrawl.scrape(
        `https://barttorvik.com/trank.php?year=2026&_=${cacheBuster}`,
        {
          formats: ['markdown'],
          onlyMainContent: false,
          waitFor: 5000,        // Wait for JS table to render
          timeout: 300000,      // 5 min timeout
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        }
      );
    });
    
    const trankMd = trankResult.markdown;
    await fs.writeFile(join(__dirname, '../public/Bart.md'), trankMd, 'utf8');
    
    console.log(`   ✅ T-Rank saved to public/Bart.md`);
    console.log(`   📄 Size: ${(trankMd.length / 1024).toFixed(1)} KB`);
    
    // Quick parse to validate
    const trankTeams = parseTRankData(trankMd);
    const teamCount = Object.keys(trankTeams).length;
    console.log(`   🏀 Teams parsed: ${teamCount}`);
    
    if (teamCount > 0) {
      const top5 = Object.values(trankTeams).sort((a, b) => a.rank - b.rank).slice(0, 5);
      console.log(`   🏆 Top 5: ${top5.map(t => `${t.rank}. ${t.teamName}`).join(', ')}`);
      console.log(`   📈 Sample: ${top5[0].teamName} - AdjOE: ${top5[0].adjOff}, AdjDE: ${top5[0].adjDef}, eFG: ${top5[0].eFG_off}%`);
    }
    
    results.trank = true;
  } catch (error) {
    console.error(`   ❌ T-Rank fetch FAILED: ${error.message}`);
  }
  
  // ──────────────────────────────────────────────
  // 2. Fetch Shooting Splits (PBP page)
  // ──────────────────────────────────────────────
  console.log('\n📊 [2/2] Fetching Shooting Splits from barttorvik.com/teampbp.php...');
  console.log('   URL: https://barttorvik.com/teampbp.php?year=2026&sort=1');
  console.log('   ⏳ Timeout: 5 minutes\n');
  
  try {
    const pbpResult = await retryWithBackoff(async () => {
      return await firecrawl.scrape(
        `https://barttorvik.com/teampbp.php?year=2026&sort=1&_=${cacheBuster}`,
        {
          formats: ['markdown'],
          onlyMainContent: false,
          waitFor: 5000,        // Wait for JS table to render
          timeout: 300000,      // 5 min timeout
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        }
      );
    });
    
    const pbpMd = pbpResult.markdown;
    await fs.writeFile(join(__dirname, '../public/bart_pbp.md'), pbpMd, 'utf8');
    
    console.log(`   ✅ Shooting Splits saved to public/bart_pbp.md`);
    console.log(`   📄 Size: ${(pbpMd.length / 1024).toFixed(1)} KB`);
    
    // Quick parse to validate
    const pbpTeams = parsePBPData(pbpMd);
    const pbpCount = Object.keys(pbpTeams).length;
    console.log(`   🏀 Teams parsed: ${pbpCount}`);
    
    if (pbpCount > 0) {
      const sample = Object.values(pbpTeams).sort((a, b) => a.rank - b.rank)[0];
      const sampleKeys = Object.keys(sample).filter(k => k !== 'rank' && k !== 'teamName');
      console.log(`   📊 Stat columns: ${sampleKeys.length} (4 categories × 4 splits)`);
      console.log(`   📊 Categories: Dunks, Close 2s, Far 2s, 3-Pointers`);
      console.log(`   📊 Per category: O FG%, O Share, D FG%, D Share`);
      console.log(`   📊 Sample: ${sample.teamName} (Rk ${sample.rank})`);
      console.log(`      Close 2: O ${sample.close2_off_fg}% (${sample.close2_off_share}% share) | D ${sample.close2_def_fg}% (${sample.close2_def_share}% share)`);
      console.log(`      Far 2:   O ${sample.far2_off_fg}% (${sample.far2_off_share}% share)  | D ${sample.far2_def_fg}% (${sample.far2_def_share}% share)`);
      console.log(`      3-Pt:    O ${sample.three_off_fg}% (${sample.three_off_share}% share) | D ${sample.three_def_fg}% (${sample.three_def_share}% share)`);
      console.log(`      Dunks:   O ${sample.dunks_off_fg}% (${sample.dunks_off_share}% share) | D ${sample.dunks_def_fg}% (${sample.dunks_def_share}% share)`);
    } else {
      console.log(`   ⚠️  No teams parsed from PBP data - raw markdown preview:`);
      console.log(`   ${pbpMd.substring(0, 500)}...`);
    }
    
    results.pbp = true;
  } catch (error) {
    console.error(`   ❌ Shooting Splits fetch FAILED: ${error.message}`);
  }
  
  // ──────────────────────────────────────────────
  // 3. Validate team matching against CSV
  // ──────────────────────────────────────────────
  console.log('\n' + '='.repeat(50));
  console.log('🔍 TEAM MATCHING VALIDATION');
  console.log('='.repeat(50));
  
  const mapping = loadTeamMapping();
  console.log(`📋 CSV has ${Object.keys(mapping).length} barttorvik_name mappings`);
  
  if (results.trank) {
    const trankMd = await fs.readFile(join(__dirname, '../public/Bart.md'), 'utf8');
    const trankTeams = parseTRankData(trankMd);
    validateTeamMatching(trankTeams, mapping, 'T-Rank');
  }
  
  if (results.pbp) {
    const pbpMd = await fs.readFile(join(__dirname, '../public/bart_pbp.md'), 'utf8');
    const pbpTeams = parsePBPData(pbpMd);
    validateTeamMatching(pbpTeams, mapping, 'Shooting Splits');
  }
  
  // ──────────────────────────────────────────────
  // Summary
  // ──────────────────────────────────────────────
  console.log('\n' + '='.repeat(50));
  console.log('📊 FETCH SUMMARY');
  console.log('='.repeat(50));
  console.log(`   T-Rank:          ${results.trank ? '✅ SUCCESS' : '❌ FAILED'}`);
  console.log(`   Shooting Splits: ${results.pbp ? '✅ SUCCESS' : '❌ FAILED'}`);
  console.log(`   Completed:       ${new Date().toLocaleString()}`);
  
  if (results.trank || results.pbp) {
    console.log('\n📁 Output files:');
    if (results.trank) console.log('   ✓ public/Bart.md');
    if (results.pbp) console.log('   ✓ public/bart_pbp.md');
  }
  
  return results;
}

// Run
fetchBarttorvik()
  .then((results) => {
    const allGood = results.trank && results.pbp;
    console.log(allGood ? '\n🎉 All Barttorvik data fetched!\n' : '\n⚠️  Some fetches failed - check above.\n');
    process.exit(allGood ? 0 : 1);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error.message);
    process.exit(1);
  });
