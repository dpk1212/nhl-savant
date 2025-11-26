/**
 * Basketball CSV Audit Tool
 * 
 * Comprehensive diagnostic tool to verify basketball_teams.csv accuracy
 * Reports match success rate and identifies all mapping issues
 * 
 * Usage: npm run audit-basketball-csv
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

async function auditBasketballCSV() {
  console.log('\n' + '='.repeat(80));
  console.log('🔍 BASKETBALL CSV AUDIT - COMPREHENSIVE DIAGNOSTIC');
  console.log('='.repeat(80) + '\n');
  
  try {
    // 1. Load all data files
    console.log('📂 Loading data files...\n');
    const oddsMarkdown = await readFile(join(__dirname, '../public/basketball_odds.md'), 'utf8');
    const haslaMarkdown = await readFile(join(__dirname, '../public/haslametrics.md'), 'utf8');
    const drateMarkdown = await readFile(join(__dirname, '../public/dratings.md'), 'utf8');
    const csvContent = await readFile(join(__dirname, '../public/basketball_teams.csv'), 'utf8');
    
    // 2. Parse all sources
    console.log('🔄 Parsing data from all sources...\n');
    const oddsGames = parseBasketballOdds(oddsMarkdown);
    const haslaData = parseHaslametrics(haslaMarkdown);
    const dratePreds = parseDRatings(drateMarkdown);
    
    console.log(`✅ OddsTrader:   ${oddsGames.length} games`);
    console.log(`✅ Haslametrics: ${haslaData.games.length} games`);
    console.log(`✅ D-Ratings:    ${dratePreds.length} predictions\n`);
    
    // 3. Load CSV mappings
    const teamMappings = loadTeamMappings(csvContent);
    console.log(`✅ CSV Mappings: ${teamMappings.size} teams\n`);
    
    // 4. Extract all unique team names from each source
    const oddsTeams = new Set();
    const haslaTeamsRaw = new Set();
    const drateTeams = new Set();
    
    oddsGames.forEach(g => {
      oddsTeams.add(g.awayTeam);
      oddsTeams.add(g.homeTeam);
    });
    
    haslaData.games.forEach(g => {
      haslaTeamsRaw.add(g.awayTeamRaw);
      haslaTeamsRaw.add(g.homeTeamRaw);
    });
    
    dratePreds.forEach(p => {
      drateTeams.add(p.awayTeam);
      drateTeams.add(p.homeTeam);
    });
    
    console.log('📊 UNIQUE TEAMS PER SOURCE:');
    console.log('='.repeat(80));
    console.log(`OddsTrader:   ${oddsTeams.size} unique teams`);
    console.log(`Haslametrics: ${haslaTeamsRaw.size} unique teams (raw names)`);
    console.log(`D-Ratings:    ${drateTeams.size} unique teams\n`);
    
    // 5. Audit each OddsTrader game (OddsTrader is BASE)
    console.log('🔍 AUDITING EACH ODDSTRADER GAME:');
    console.log('='.repeat(80) + '\n');
    
    const auditResults = {
      totalGames: oddsGames.length,
      fullMatches: 0,
      haslaOnly: 0,
      drateOnly: 0,
      oddsOnly: 0,
      games: []
    };
    
    const issues = {
      missingFromCSV: new Set(),
      wrongHaslaMapping: [],
      wrongDrateMapping: [],
      haslaNotInData: [],
      drateNotInData: []
    };
    
    for (const game of oddsGames) {
      const awayTeam = game.awayTeam;
      const homeTeam = game.homeTeam;
      const matchup = `${awayTeam} @ ${homeTeam}`;
      
      // Look up in CSV
      const awayMapping = findTeamMapping(teamMappings, awayTeam, 'oddstrader');
      const homeMapping = findTeamMapping(teamMappings, homeTeam, 'oddstrader');
      
      const gameResult = {
        matchup,
        awayTeam,
        homeTeam,
        csvFound: {
          away: !!awayMapping,
          home: !!homeMapping
        },
        haslaMatch: false,
        drateMatch: false,
        issues: []
      };
      
      // Check if teams are in CSV
      if (!awayMapping) {
        issues.missingFromCSV.add(awayTeam);
        gameResult.issues.push(`MISSING CSV: ${awayTeam}`);
      }
      if (!homeMapping) {
        issues.missingFromCSV.add(homeTeam);
        gameResult.issues.push(`MISSING CSV: ${homeTeam}`);
      }
      
      // If both in CSV, try to match Haslametrics
      if (awayMapping && homeMapping) {
        if (awayMapping.haslametrics && homeMapping.haslametrics) {
          // Check if this exact game exists in Haslametrics data
          const haslaGame = haslaData.games.find(g => 
            g.awayTeamRaw === awayMapping.haslametrics && 
            g.homeTeamRaw === homeMapping.haslametrics
          );
          
          if (haslaGame) {
            gameResult.haslaMatch = true;
          } else {
            // Check if team names exist in Haslametrics at all
            const awayExists = Array.from(haslaTeamsRaw).some(t => t === awayMapping.haslametrics);
            const homeExists = Array.from(haslaTeamsRaw).some(t => t === homeMapping.haslametrics);
            
            if (!awayExists) {
              issues.wrongHaslaMapping.push({
                team: awayTeam,
                csvValue: awayMapping.haslametrics,
                available: Array.from(haslaTeamsRaw).filter(t => 
                  t.toLowerCase().includes(awayTeam.toLowerCase()) ||
                  awayTeam.toLowerCase().includes(t.toLowerCase())
                )
              });
              gameResult.issues.push(`WRONG HASLA CSV: ${awayTeam} → "${awayMapping.haslametrics}" not in data`);
            }
            if (!homeExists) {
              issues.wrongHaslaMapping.push({
                team: homeTeam,
                csvValue: homeMapping.haslametrics,
                available: Array.from(haslaTeamsRaw).filter(t => 
                  t.toLowerCase().includes(homeTeam.toLowerCase()) ||
                  homeTeam.toLowerCase().includes(t.toLowerCase())
                )
              });
              gameResult.issues.push(`WRONG HASLA CSV: ${homeTeam} → "${homeMapping.haslametrics}" not in data`);
            }
            
            if (awayExists && homeExists) {
              issues.haslaNotInData.push({
                matchup,
                awayHasla: awayMapping.haslametrics,
                homeHasla: homeMapping.haslametrics
              });
              gameResult.issues.push('Hasla teams exist but this matchup not covered today');
            }
          }
        } else {
          // CSV has missing Haslametrics names
          if (!awayMapping.haslametrics) {
            gameResult.issues.push(`EMPTY HASLA CSV: ${awayTeam}`);
          }
          if (!homeMapping.haslametrics) {
            gameResult.issues.push(`EMPTY HASLA CSV: ${homeTeam}`);
          }
        }
        
        // Try to match D-Ratings
        if (awayMapping.dratings && homeMapping.dratings) {
          const dratePred = dratePreds.find(p =>
            p.awayTeam === awayMapping.dratings &&
            p.homeTeam === homeMapping.dratings
          );
          
          if (dratePred) {
            gameResult.drateMatch = true;
          } else {
            // Check if team names exist in D-Ratings at all
            const awayExists = drateTeams.has(awayMapping.dratings);
            const homeExists = drateTeams.has(homeMapping.dratings);
            
            if (!awayExists) {
              issues.wrongDrateMapping.push({
                team: awayTeam,
                csvValue: awayMapping.dratings,
                available: Array.from(drateTeams).filter(t => 
                  t.toLowerCase().includes(awayTeam.toLowerCase()) ||
                  awayTeam.toLowerCase().includes(t.toLowerCase())
                )
              });
              gameResult.issues.push(`WRONG DRATE CSV: ${awayTeam} → "${awayMapping.dratings}" not in data`);
            }
            if (!homeExists) {
              issues.wrongDrateMapping.push({
                team: homeTeam,
                csvValue: homeMapping.dratings,
                available: Array.from(drateTeams).filter(t => 
                  t.toLowerCase().includes(homeTeam.toLowerCase()) ||
                  homeTeam.toLowerCase().includes(t.toLowerCase())
                )
              });
              gameResult.issues.push(`WRONG DRATE CSV: ${homeTeam} → "${homeMapping.dratings}" not in data`);
            }
            
            if (awayExists && homeExists) {
              issues.drateNotInData.push({
                matchup,
                awayDrate: awayMapping.dratings,
                homeDrate: homeMapping.dratings
              });
              gameResult.issues.push('D-Ratings teams exist but this matchup not covered today');
            }
          }
        } else {
          // CSV has missing D-Ratings names
          if (!awayMapping.dratings) {
            gameResult.issues.push(`EMPTY DRATE CSV: ${awayTeam}`);
          }
          if (!homeMapping.dratings) {
            gameResult.issues.push(`EMPTY DRATE CSV: ${homeTeam}`);
          }
        }
      }
      
      // Count matches
      if (gameResult.haslaMatch && gameResult.drateMatch) {
        auditResults.fullMatches++;
      } else if (gameResult.haslaMatch) {
        auditResults.haslaOnly++;
      } else if (gameResult.drateMatch) {
        auditResults.drateOnly++;
      } else {
        auditResults.oddsOnly++;
      }
      
      auditResults.games.push(gameResult);
      
      // Print game status
      const haslaIcon = gameResult.haslaMatch ? '✅' : '❌';
      const drateIcon = gameResult.drateMatch ? '✅' : '❌';
      console.log(`${haslaIcon} ${drateIcon} ${matchup}`);
      if (gameResult.issues.length > 0) {
        gameResult.issues.forEach(issue => console.log(`     ⚠️  ${issue}`));
      }
    }
    
    // 6. Print summary
    console.log('\n' + '='.repeat(80));
    console.log('📊 AUDIT SUMMARY');
    console.log('='.repeat(80) + '\n');
    
    const fullMatchPct = (auditResults.fullMatches / auditResults.totalGames * 100).toFixed(1);
    const twoSourcePct = ((auditResults.fullMatches + auditResults.haslaOnly + auditResults.drateOnly) / auditResults.totalGames * 100).toFixed(1);
    
    console.log(`Total Games (OddsTrader): ${auditResults.totalGames}`);
    console.log(`Full Matches (all 3):     ${auditResults.fullMatches} (${fullMatchPct}%)`);
    console.log(`Haslametrics Only:        ${auditResults.haslaOnly}`);
    console.log(`D-Ratings Only:           ${auditResults.drateOnly}`);
    console.log(`Odds Only (NO DATA):      ${auditResults.oddsOnly}`);
    console.log(`At Least 2 Sources:       ${auditResults.fullMatches + auditResults.haslaOnly + auditResults.drateOnly} (${twoSourcePct}%)\n`);
    
    // 7. Print detailed issues
    if (issues.missingFromCSV.size > 0) {
      console.log('❌ TEAMS MISSING FROM CSV:');
      console.log('='.repeat(80));
      Array.from(issues.missingFromCSV).sort().forEach(team => {
        console.log(`   - "${team}"`);
      });
      console.log('');
    }
    
    if (issues.wrongHaslaMapping.length > 0) {
      console.log('❌ WRONG HASLAMETRICS MAPPINGS IN CSV:');
      console.log('='.repeat(80));
      issues.wrongHaslaMapping.forEach(issue => {
        console.log(`\n   Team: ${issue.team}`);
        console.log(`   CSV has: "${issue.csvValue}"`);
        console.log(`   Available in Haslametrics data:`);
        if (issue.available.length > 0) {
          issue.available.forEach(name => console.log(`      - "${name}"`));
        } else {
          console.log(`      (no similar names found - this team may not be in Haslametrics today)`);
        }
      });
      console.log('');
    }
    
    if (issues.wrongDrateMapping.length > 0) {
      console.log('❌ WRONG D-RATINGS MAPPINGS IN CSV:');
      console.log('='.repeat(80));
      issues.wrongDrateMapping.forEach(issue => {
        console.log(`\n   Team: ${issue.team}`);
        console.log(`   CSV has: "${issue.csvValue}"`);
        console.log(`   Available in D-Ratings data:`);
        if (issue.available.length > 0) {
          issue.available.forEach(name => console.log(`      - "${name}"`));
        } else {
          console.log(`      (no similar names found - this team may not be in D-Ratings today)`);
        }
      });
      console.log('');
    }
    
    if (issues.haslaNotInData.length > 0) {
      console.log('ℹ️  MATCHUPS NOT IN HASLAMETRICS (legitimate data gap):');
      console.log('='.repeat(80));
      issues.haslaNotInData.forEach(issue => {
        console.log(`   ${issue.matchup}`);
        console.log(`      CSV: ${issue.awayHasla} @ ${issue.homeHasla}`);
      });
      console.log('');
    }
    
    if (issues.drateNotInData.length > 0) {
      console.log('ℹ️  MATCHUPS NOT IN D-RATINGS (legitimate data gap):');
      console.log('='.repeat(80));
      issues.drateNotInData.forEach(issue => {
        console.log(`   ${issue.matchup}`);
        console.log(`      CSV: ${issue.awayDrate} @ ${issue.homeDrate}`);
      });
      console.log('');
    }
    
    // 8. Print actionable fix list
    console.log('='.repeat(80));
    console.log('🔧 ACTIONABLE FIXES NEEDED');
    console.log('='.repeat(80) + '\n');
    
    const csvFixes = [];
    
    if (issues.missingFromCSV.size > 0) {
      console.log('1. ADD THESE TEAMS TO CSV:\n');
      Array.from(issues.missingFromCSV).sort().forEach(team => {
        console.log(`   ${team},${team},<FIND IN HASLA>,<FIND IN DRATE>,TBD,NEW`);
        csvFixes.push({
          action: 'ADD',
          team: team,
          reason: 'Missing from CSV'
        });
      });
      console.log('');
    }
    
    if (issues.wrongHaslaMapping.length > 0) {
      console.log('2. FIX HASLAMETRICS COLUMN IN CSV:\n');
      const uniqueHasla = [...new Map(issues.wrongHaslaMapping.map(i => [i.team, i])).values()];
      uniqueHasla.forEach(issue => {
        const suggestion = issue.available.length > 0 ? issue.available[0] : '<FIND CORRECT NAME>';
        console.log(`   ${issue.team}: Change "${issue.csvValue}" → "${suggestion}"`);
        csvFixes.push({
          action: 'FIX_HASLA',
          team: issue.team,
          currentValue: issue.csvValue,
          suggestedValue: suggestion
        });
      });
      console.log('');
    }
    
    if (issues.wrongDrateMapping.length > 0) {
      console.log('3. FIX D-RATINGS COLUMN IN CSV:\n');
      const uniqueDrate = [...new Map(issues.wrongDrateMapping.map(i => [i.team, i])).values()];
      uniqueDrate.forEach(issue => {
        const suggestion = issue.available.length > 0 ? issue.available[0] : '<FIND CORRECT NAME>';
        console.log(`   ${issue.team}: Change "${issue.csvValue}" → "${suggestion}"`);
        csvFixes.push({
          action: 'FIX_DRATE',
          team: issue.team,
          currentValue: issue.csvValue,
          suggestedValue: suggestion
        });
      });
      console.log('');
    }
    
    // 9. Write JSON report
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalGames: auditResults.totalGames,
        fullMatches: auditResults.fullMatches,
        fullMatchPercentage: parseFloat(fullMatchPct),
        twoSourceMatches: auditResults.fullMatches + auditResults.haslaOnly + auditResults.drateOnly,
        twoSourcePercentage: parseFloat(twoSourcePct)
      },
      issues: {
        missingFromCSV: Array.from(issues.missingFromCSV).sort(),
        wrongHaslaMapping: issues.wrongHaslaMapping,
        wrongDrateMapping: issues.wrongDrateMapping,
        haslaDataGaps: issues.haslaNotInData,
        drateDataGaps: issues.drateNotInData
      },
      fixes: csvFixes,
      allGames: auditResults.games,
      availableTeams: {
        oddstrader: Array.from(oddsTeams).sort(),
        haslametrics: Array.from(haslaTeamsRaw).sort(),
        dratings: Array.from(drateTeams).sort()
      }
    };
    
    await writeFile(
      join(__dirname, '../public/basketball_csv_audit.json'),
      JSON.stringify(report, null, 2),
      'utf8'
    );
    
    console.log('✅ Detailed report saved to: public/basketball_csv_audit.json\n');
    
    // 10. Exit code based on success
    if (auditResults.fullMatches === auditResults.totalGames) {
      console.log('🎉 SUCCESS! 100% MATCH RATE ACHIEVED!\n');
      process.exit(0);
    } else {
      console.log(`⚠️  AUDIT COMPLETE - ${csvFixes.length} issues found requiring manual fixes\n`);
      process.exit(1);
    }
    
  } catch (error) {
    console.error('\n❌ AUDIT FAILED:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

auditBasketballCSV().catch(console.error);

