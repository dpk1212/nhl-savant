/**
 * Basketball CSV Validation Script
 * 
 * Validates basketball_teams.csv structure and identifies issues:
 * - Duplicate entries
 * - Conflicting mappings
 * - Obviously wrong mappings
 * - Structural errors
 * 
 * Usage: npm run validate-basketball-csv
 */

import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function validateCSV() {
  console.log('\n' + '='.repeat(80));
  console.log('🔍 BASKETBALL CSV VALIDATION');
  console.log('='.repeat(80) + '\n');
  
  try {
    const csvContent = await readFile(join(__dirname, '../public/basketball_teams.csv'), 'utf8');
    const lines = csvContent.trim().split('\n');
    
    console.log(`📄 CSV File: public/basketball_teams.csv`);
    console.log(`📊 Total Lines: ${lines.length}`);
    console.log(`📊 Total Teams: ${lines.length - 1} (excluding header)\n`);
    
    const issues = {
      duplicates: [],
      conflicts: [],
      suspicious: [],
      structural: [],
      empty: []
    };
    
    // Parse CSV
    const teams = [];
    const headers = lines[0].split(',');
    
    console.log('📋 CSV Structure:');
    console.log(`   Columns: ${headers.join(', ')}\n`);
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = parseCSVLine(line);
      
      // Check column count
      if (values.length < 4) {
        issues.structural.push({
          line: i + 1,
          content: line,
          issue: `Only ${values.length} columns (expected 6)`
        });
        continue;
      }
      
      const team = {
        lineNumber: i + 1,
        normalized: values[0],
        oddstrader: values[1],
        haslametrics: values[2],
        dratings: values[3],
        conference: values[4] || '',
        notes: values[5] || ''
      };
      
      teams.push(team);
    }
    
    console.log('🔍 Running validation checks...\n');
    
    // 1. Check for duplicates
    console.log('1️⃣  Checking for duplicate entries...');
    const seenNormalized = new Map();
    const seenOdds = new Map();
    
    teams.forEach(team => {
      // Duplicate normalized names
      if (team.normalized) {
        if (seenNormalized.has(team.normalized)) {
          issues.duplicates.push({
            type: 'normalized_name',
            value: team.normalized,
            lines: [seenNormalized.get(team.normalized), team.lineNumber]
          });
        } else {
          seenNormalized.set(team.normalized, team.lineNumber);
        }
      }
      
      // Duplicate OddsTrader names
      if (team.oddstrader) {
        if (seenOdds.has(team.oddstrader)) {
          issues.duplicates.push({
            type: 'oddstrader_name',
            value: team.oddstrader,
            lines: [seenOdds.get(team.oddstrader), team.lineNumber]
          });
        } else {
          seenOdds.set(team.oddstrader, team.lineNumber);
        }
      }
    });
    
    console.log(`   Found ${issues.duplicates.length} duplicates\n`);
    
    // 2. Check for conflicting mappings
    console.log('2️⃣  Checking for conflicting mappings...');
    const haslaToOdds = new Map();
    const drateToOdds = new Map();
    
    teams.forEach(team => {
      // Multiple OddsTrader teams mapping to same Haslametrics name
      if (team.haslametrics && team.oddstrader) {
        if (haslaToOdds.has(team.haslametrics)) {
          const existing = haslaToOdds.get(team.haslametrics);
          if (existing.oddstrader !== team.oddstrader) {
            issues.conflicts.push({
              type: 'haslametrics',
              haslaName: team.haslametrics,
              teams: [
                { oddstrader: existing.oddstrader, line: existing.line },
                { oddstrader: team.oddstrader, line: team.lineNumber }
              ]
            });
          }
        } else {
          haslaToOdds.set(team.haslametrics, { oddstrader: team.oddstrader, line: team.lineNumber });
        }
      }
      
      // Multiple OddsTrader teams mapping to same D-Ratings name
      if (team.dratings && team.oddstrader) {
        if (drateToOdds.has(team.dratings)) {
          const existing = drateToOdds.get(team.dratings);
          if (existing.oddstrader !== team.oddstrader) {
            issues.conflicts.push({
              type: 'dratings',
              drateName: team.dratings,
              teams: [
                { oddstrader: existing.oddstrader, line: existing.line },
                { oddstrader: team.oddstrader, line: team.lineNumber }
              ]
            });
          }
        } else {
          drateToOdds.set(team.dratings, { oddstrader: team.oddstrader, line: team.lineNumber });
        }
      }
    });
    
    console.log(`   Found ${issues.conflicts.length} conflicts\n`);
    
    // 3. Check for suspicious mappings
    console.log('3️⃣  Checking for suspicious mappings...');
    
    teams.forEach(team => {
      if (!team.oddstrader) return;
      
      // Check if Haslametrics name is suspiciously different
      if (team.haslametrics) {
        const oddsLower = team.oddstrader.toLowerCase().replace(/[^a-z]/g, '');
        const haslaLower = team.haslametrics.toLowerCase().replace(/[^a-z]/g, '');
        
        // If they share less than 50% of characters, it's suspicious
        const similarity = calculateSimilarity(oddsLower, haslaLower);
        if (similarity < 0.3 && !team.notes.includes('VERIFIED')) {
          issues.suspicious.push({
            line: team.lineNumber,
            team: team.oddstrader,
            type: 'haslametrics',
            value: team.haslametrics,
            similarity: (similarity * 100).toFixed(0) + '%',
            reason: 'Names are very different (possible wrong mapping)'
          });
        }
      }
      
      // Check if D-Ratings name is suspiciously different
      if (team.dratings) {
        const oddsLower = team.oddstrader.toLowerCase().replace(/[^a-z]/g, '');
        const drateLower = team.dratings.toLowerCase().replace(/[^a-z]/g, '');
        
        const similarity = calculateSimilarity(oddsLower, drateLower);
        if (similarity < 0.3 && !team.notes.includes('VERIFIED')) {
          issues.suspicious.push({
            line: team.lineNumber,
            team: team.oddstrader,
            type: 'dratings',
            value: team.dratings,
            similarity: (similarity * 100).toFixed(0) + '%',
            reason: 'Names are very different (possible wrong mapping)'
          });
        }
      }
      
      // Check for obviously wrong patterns
      if (team.haslametrics && team.haslametrics.includes('State') && !team.oddstrader.includes('State')) {
        issues.suspicious.push({
          line: team.lineNumber,
          team: team.oddstrader,
          type: 'haslametrics',
          value: team.haslametrics,
          reason: 'Haslametrics has "State" but OddsTrader doesn\'t'
        });
      }
      
      if (team.dratings && team.dratings.includes('State') && !team.oddstrader.includes('State')) {
        issues.suspicious.push({
          line: team.lineNumber,
          team: team.oddstrader,
          type: 'dratings',
          value: team.dratings,
          reason: 'D-Ratings has "State" but OddsTrader doesn\'t'
        });
      }
    });
    
    console.log(`   Found ${issues.suspicious.length} suspicious entries\n`);
    
    // 4. Check for empty critical fields
    console.log('4️⃣  Checking for empty fields...');
    
    teams.forEach(team => {
      if (team.oddstrader && !team.haslametrics && !team.notes.includes('hasla_only') && !team.notes.includes('drate_only')) {
        issues.empty.push({
          line: team.lineNumber,
          team: team.oddstrader,
          field: 'haslametrics',
          note: team.notes
        });
      }
      
      if (team.oddstrader && !team.dratings && !team.notes.includes('hasla_only') && !team.notes.includes('drate_only')) {
        issues.empty.push({
          line: team.lineNumber,
          team: team.oddstrader,
          field: 'dratings',
          note: team.notes
        });
      }
    });
    
    console.log(`   Found ${issues.empty.length} teams with empty fields\n`);
    
    // Print detailed results
    console.log('='.repeat(80));
    console.log('📊 VALIDATION RESULTS');
    console.log('='.repeat(80) + '\n');
    
    let hasErrors = false;
    
    if (issues.structural.length > 0) {
      hasErrors = true;
      console.log('❌ STRUCTURAL ERRORS:');
      console.log('-'.repeat(80));
      issues.structural.forEach(issue => {
        console.log(`   Line ${issue.line}: ${issue.issue}`);
        console.log(`   Content: ${issue.content}\n`);
      });
    }
    
    if (issues.duplicates.length > 0) {
      hasErrors = true;
      console.log('❌ DUPLICATE ENTRIES:');
      console.log('-'.repeat(80));
      issues.duplicates.forEach(dup => {
        console.log(`   ${dup.type}: "${dup.value}"`);
        console.log(`   Found on lines: ${dup.lines.join(', ')}\n`);
      });
    }
    
    if (issues.conflicts.length > 0) {
      hasErrors = true;
      console.log('❌ CONFLICTING MAPPINGS:');
      console.log('-'.repeat(80));
      issues.conflicts.forEach(conflict => {
        if (conflict.type === 'haslametrics') {
          console.log(`   Haslametrics "${conflict.haslaName}" maps to multiple teams:`);
        } else {
          console.log(`   D-Ratings "${conflict.drateName}" maps to multiple teams:`);
        }
        conflict.teams.forEach(t => {
          console.log(`      - "${t.oddstrader}" (line ${t.line})`);
        });
        console.log('');
      });
    }
    
    if (issues.suspicious.length > 0) {
      console.log('⚠️  SUSPICIOUS MAPPINGS (may need review):');
      console.log('-'.repeat(80));
      issues.suspicious.forEach(sus => {
        console.log(`   Line ${sus.line}: ${sus.team}`);
        console.log(`      ${sus.type}: "${sus.value}"`);
        console.log(`      Reason: ${sus.reason}`);
        if (sus.similarity) {
          console.log(`      Similarity: ${sus.similarity}`);
        }
        console.log('');
      });
    }
    
    if (issues.empty.length > 0) {
      console.log('ℹ️  TEAMS WITH EMPTY FIELDS:');
      console.log('-'.repeat(80));
      issues.empty.forEach(empty => {
        console.log(`   Line ${empty.line}: ${empty.team}`);
        console.log(`      Missing: ${empty.field}`);
        if (empty.note) console.log(`      Notes: ${empty.note}`);
        console.log('');
      });
    }
    
    // Summary
    console.log('='.repeat(80));
    console.log('📝 SUMMARY');
    console.log('='.repeat(80) + '\n');
    
    console.log(`Total Teams: ${teams.length}`);
    console.log(`Structural Errors: ${issues.structural.length}`);
    console.log(`Duplicates: ${issues.duplicates.length}`);
    console.log(`Conflicts: ${issues.conflicts.length}`);
    console.log(`Suspicious: ${issues.suspicious.length}`);
    console.log(`Empty Fields: ${issues.empty.length}\n`);
    
    if (hasErrors) {
      console.log('❌ VALIDATION FAILED - Critical issues found\n');
      process.exit(1);
    } else if (issues.suspicious.length > 0 || issues.empty.length > 0) {
      console.log('⚠️  VALIDATION PASSED - But warnings present\n');
      process.exit(0);
    } else {
      console.log('✅ VALIDATION PASSED - No issues found\n');
      process.exit(0);
    }
    
  } catch (error) {
    console.error('\n❌ VALIDATION FAILED:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
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

function calculateSimilarity(str1, str2) {
  // Simple character overlap similarity
  const set1 = new Set(str1);
  const set2 = new Set(str2);
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  return (2 * intersection.size) / (set1.size + set2.size);
}

validateCSV().catch(console.error);

