/**
 * Build Team CSV - Extract all team names from all sources
 * Generates initial basketball_teams.csv with best-guess mappings
 */

import { readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parseBasketballOdds } from '../src/utils/basketballOddsParser.js';
import { parseHaslametrics } from '../src/utils/haslametricsParser.js';
import { parseDRatings } from '../src/utils/dratingsParser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function buildTeamCSV() {
  console.log('\n🏗️  BUILDING TEAM CSV FROM ALL SOURCES');
  console.log('==========================================\n');
  
  // Load data files
  const oddsMarkdown = await readFile(join(__dirname, '../public/basketball_odds.md'), 'utf8');
  const haslaMarkdown = await readFile(join(__dirname, '../public/haslametrics.md'), 'utf8');
  const drateMarkdown = await readFile(join(__dirname, '../public/dratings.md'), 'utf8');
  
  // Parse all sources
  const oddsGames = parseBasketballOdds(oddsMarkdown);
  const haslaData = parseHaslametrics(haslaMarkdown);
  const dratePreds = parseDRatings(drateMarkdown);
  
  console.log(`📊 Data loaded:`);
  console.log(`   - OddsTrader: ${oddsGames.length} games`);
  console.log(`   - Haslametrics: ${haslaData.games.length} games`);
  console.log(`   - D-Ratings: ${dratePreds.length} predictions\n`);
  
  // Extract all unique teams
  const teamMap = new Map(); // normalized_name -> {odds, hasla, drate, raw names}
  
  // Process OddsTrader teams
  console.log('🔵 Processing OddsTrader teams...');
  oddsGames.forEach(game => {
    [game.awayTeam, game.homeTeam].forEach(team => {
      if (!teamMap.has(team)) {
        teamMap.set(team, {
          normalized: team,
          oddstrader: team,
          oddstraderRaw: team,
          haslametrics: null,
          haslametricsRaw: [],
          dratings: null,
          dratingsRaw: [],
          conference: 'TBD',
          source: 'oddstrader'
        });
      }
    });
  });
  
  // Process Haslametrics teams
  console.log('🟢 Processing Haslametrics teams...');
  haslaData.games.forEach(game => {
    // Away team
    if (teamMap.has(game.awayTeam)) {
      const entry = teamMap.get(game.awayTeam);
      entry.haslametrics = game.awayTeamRaw;
      entry.haslametricsRaw.push(game.awayTeamRaw);
    } else {
      // Team in Hasla but not OddsTrader
      teamMap.set(game.awayTeam, {
        normalized: game.awayTeam,
        oddstrader: null,
        oddstraderRaw: null,
        haslametrics: game.awayTeamRaw,
        haslametricsRaw: [game.awayTeamRaw],
        dratings: null,
        dratingsRaw: [],
        conference: 'TBD',
        source: 'haslametrics'
      });
    }
    
    // Home team
    if (teamMap.has(game.homeTeam)) {
      const entry = teamMap.get(game.homeTeam);
      entry.haslametrics = game.homeTeamRaw;
      entry.haslametricsRaw.push(game.homeTeamRaw);
    } else {
      teamMap.set(game.homeTeam, {
        normalized: game.homeTeam,
        oddstrader: null,
        oddstraderRaw: null,
        haslametrics: game.homeTeamRaw,
        haslametricsRaw: [game.homeTeamRaw],
        dratings: null,
        dratingsRaw: [],
        conference: 'TBD',
        source: 'haslametrics'
      });
    }
  });
  
  // Process D-Ratings teams
  console.log('🟠 Processing D-Ratings teams...');
  dratePreds.forEach(pred => {
    // Away team
    if (teamMap.has(pred.awayTeam)) {
      const entry = teamMap.get(pred.awayTeam);
      entry.dratings = pred.awayTeamRaw;
      entry.dratingsRaw.push(pred.awayTeamRaw);
    } else {
      // Team in D-Ratings but not OddsTrader
      teamMap.set(pred.awayTeam, {
        normalized: pred.awayTeam,
        oddstrader: null,
        oddstraderRaw: null,
        haslametrics: null,
        haslametricsRaw: [],
        dratings: pred.awayTeamRaw,
        dratingsRaw: [pred.awayTeamRaw],
        conference: 'TBD',
        source: 'dratings'
      });
    }
    
    // Home team
    if (teamMap.has(pred.homeTeam)) {
      const entry = teamMap.get(pred.homeTeam);
      entry.dratings = pred.homeTeamRaw;
      entry.dratingsRaw.push(pred.homeTeamRaw);
    } else {
      teamMap.set(pred.homeTeam, {
        normalized: pred.homeTeam,
        oddstrader: null,
        oddstraderRaw: null,
        haslametrics: null,
        haslametricsRaw: [],
        dratings: pred.homeTeamRaw,
        dratingsRaw: [pred.homeTeamRaw],
        conference: 'TBD',
        source: 'dratings'
      });
    }
  });
  
  console.log(`\n✅ Extracted ${teamMap.size} unique teams\n`);
  
  // Build CSV
  const csvRows = ['normalized_name,oddstrader_name,haslametrics_name,dratings_name,conference,notes'];
  
  const teams = Array.from(teamMap.values()).sort((a, b) => {
    // Sort: OddsTrader teams first, then others
    if (a.oddstrader && !b.oddstrader) return -1;
    if (!a.oddstrader && b.oddstrader) return 1;
    return a.normalized.localeCompare(b.normalized);
  });
  
  let oddsTeamCount = 0;
  let completeMatchCount = 0;
  
  teams.forEach(team => {
    const isOddsTeam = team.oddstrader !== null;
    if (isOddsTeam) oddsTeamCount++;
    
    const hasComplete = team.oddstrader && team.haslametrics && team.dratings;
    if (hasComplete) completeMatchCount++;
    
    // Determine notes
    let notes = [];
    if (team.oddstrader && !team.haslametrics) notes.push('MISSING_HASLA');
    if (team.oddstrader && !team.dratings) notes.push('MISSING_DRATE');
    if (!team.oddstrader && team.haslametrics) notes.push('hasla_only');
    if (!team.oddstrader && team.dratings) notes.push('drate_only');
    if (hasComplete) notes.push('✓');
    
    const row = [
      escapeCSV(team.normalized),
      escapeCSV(team.oddstrader || ''),
      escapeCSV(team.haslametrics || ''),
      escapeCSV(team.dratings || ''),
      escapeCSV(team.conference),
      notes.join('|')
    ].join(',');
    
    csvRows.push(row);
  });
  
  // Write CSV
  const csvContent = csvRows.join('\n');
  await writeFile(join(__dirname, '../public/basketball_teams.csv'), csvContent, 'utf8');
  
  console.log('📊 CSV STATISTICS:');
  console.log('==================');
  console.log(`Total unique teams: ${teams.length}`);
  console.log(`OddsTrader teams: ${oddsTeamCount}`);
  console.log(`Complete matches (all 3 sources): ${completeMatchCount}`);
  console.log(`Missing Haslametrics: ${teams.filter(t => t.oddstrader && !t.haslametrics).length}`);
  console.log(`Missing D-Ratings: ${teams.filter(t => t.oddstrader && !t.dratings).length}`);
  console.log(`\n✅ CSV written to: public/basketball_teams.csv\n`);
  
  // Show OddsTrader teams missing matches
  const missing = teams.filter(t => t.oddstrader && (!t.haslametrics || !t.dratings));
  if (missing.length > 0) {
    console.log('\n⚠️  ODDSTRADER TEAMS NEEDING MANUAL MAPPING:');
    console.log('=============================================\n');
    missing.forEach(t => {
      console.log(`${t.normalized}`);
      console.log(`  OddsTrader: ✓ ${t.oddstrader}`);
      console.log(`  Haslametrics: ${t.haslametrics ? '✓ ' + t.haslametrics : '❌ MISSING'}`);
      console.log(`  D-Ratings: ${t.dratings ? '✓ ' + t.dratings : '❌ MISSING'}`);
      console.log('');
    });
  }
}

function escapeCSV(value) {
  if (!value) return '';
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

buildTeamCSV().catch(console.error);

