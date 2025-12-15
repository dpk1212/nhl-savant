/**
 * Barttorvik Data Parser
 * Parses Barttorvik team stats from markdown table
 * Returns structured data with key metrics for each team
 */

/**
 * Parse Barttorvik markdown into structured team data
 * @param {string} markdown - Barttorvik markdown content
 * @returns {Object} Dictionary of team stats keyed by team name
 */
export function parseBarttorvik(markdown) {
  const teams = {};
  const lines = markdown.split('\n');
  
  for (const line of lines) {
    // Skip non-data lines
    if (!line.startsWith('|') || line.includes('---') || line.includes('[Rk]')) {
      continue;
    }
    
    // Parse table row: | rank | [TeamName](...) | [Conf](...) | stats... |
    const cells = line.split('|').map(c => c.trim()).filter(c => c);
    
    if (cells.length < 19) continue; // Need 19 columns for complete data
    
    try {
      // Extract rank (column 0)
      const rank = parseInt(cells[0].trim());
      if (isNaN(rank)) continue;
      
      // Extract team name from URL parameter (cleaner than markdown text which includes next opponent)
      const teamCell = cells[1].trim();
      // Match team name from URL: team.php?team=North+Alabama
      const urlMatch = teamCell.match(/team=([^&\)]+)/);
      if (!urlMatch) continue;
      
      // Decode URL encoding (+ to space, %26 to &)
      const teamName = decodeURIComponent(urlMatch[1].replace(/\+/g, ' '));
      
      // Extract conference
      const confCell = cells[2].trim();
      const confMatch = confCell.match(/\[([^\]]+)\]/);
      const conference = confMatch ? confMatch[1] : '';
      
      // Extract stats (format: "value<br>rank")
      const parseStatCell = (cell) => {
        const parts = cell.trim().split('<br>');
        return {
          value: parseFloat(parts[0]) || 0,
          rank: parts[1] ? parseInt(parts[1]) : null
        };
      };
      
      // Column indices for key stats
      const adjOff = parseStatCell(cells[3]);      // Adj. Off Efficiency
      const adjDef = parseStatCell(cells[4]);      // Adj. Def Efficiency
      const eFG_off = parseStatCell(cells[5]);     // eFG% Offense
      const eFG_def = parseStatCell(cells[6]);     // eFG% Defense
      const to_off = parseStatCell(cells[7]);      // Turnover% Offense
      const to_def = parseStatCell(cells[8]);      // Turnover% Defense
      const oreb_off = parseStatCell(cells[9]);    // Off Reb% Offense
      const oreb_def = parseStatCell(cells[10]);   // Off Reb% Defense
      const ftRate_off = parseStatCell(cells[11]); // FT Rate Offense
      const ftRate_def = parseStatCell(cells[12]); // FT Rate Defense
      const ft_off = parseStatCell(cells[13]);     // FT% Offense
      const ft_def = parseStatCell(cells[14]);     // FT% Defense
      const twoP_off = parseStatCell(cells[15]);   // 2P% Offense
      const twoP_def = parseStatCell(cells[16]);   // 2P% Defense
      const threeP_off = parseStatCell(cells[17]); // 3P% Offense
      const threeP_def = parseStatCell(cells[18]); // 3P% Defense
      
      // Store comprehensive team data
      teams[teamName] = {
        rank,
        teamName,
        conference,
        
        // Efficiency metrics (most important)
        adjOff: adjOff.value,
        adjOff_rank: adjOff.rank,
        adjDef: adjDef.value,
        adjDef_rank: adjDef.rank,
        
        // Shooting efficiency
        eFG_off: eFG_off.value,
        eFG_off_rank: eFG_off.rank,
        eFG_def: eFG_def.value,
        eFG_def_rank: eFG_def.rank,
        
        // Turnovers
        to_off: to_off.value,
        to_off_rank: to_off.rank,
        to_def: to_def.value,
        to_def_rank: to_def.rank,
        
        // Rebounding
        oreb_off: oreb_off.value,
        oreb_off_rank: oreb_off.rank,
        oreb_def: oreb_def.value,
        oreb_def_rank: oreb_def.rank,
        
        // Free throws
        ftRate_off: ftRate_off.value,
        ftRate_off_rank: ftRate_off.rank,
        ftRate_def: ftRate_def.value,
        ftRate_def_rank: ftRate_def.rank,
        ft_off: ft_off.value,
        ft_off_rank: ft_off.rank,
        ft_def: ft_def.value,
        ft_def_rank: ft_def.rank,
        
        // Shooting splits
        twoP_off: twoP_off.value,
        twoP_off_rank: twoP_off.rank,
        twoP_def: twoP_def.value,
        twoP_def_rank: twoP_def.rank,
        threeP_off: threeP_off.value,
        threeP_off_rank: threeP_off.rank,
        threeP_def: threeP_def.value,
        threeP_def_rank: threeP_def.rank
      };
      
    } catch (error) {
      // Skip malformed rows
      continue;
    }
  }
  
  console.log(`📊 Parsed Barttorvik data for ${Object.keys(teams).length} teams`);
  
  // DEBUG: Log sample teams for troubleshooting
  const sampleTeams = ['East Texas A&M', 'Southeastern Louisiana', 'Alabama A&M', 'North Alabama'];
  sampleTeams.forEach(team => {
    if (teams[team]) {
      console.log(`✅ Found ${team}:`, {
        rank: teams[team].rank,
        adjOff: teams[team].adjOff,
        adjDef: teams[team].adjDef
      });
    } else {
      console.log(`❌ Missing ${team}`);
    }
  });
  
  return teams;
}

/**
 * Calculate matchup advantages between two teams
 * @param {Object} awayTeam - Away team Barttorvik stats
 * @param {Object} homeTeam - Home team Barttorvik stats
 * @returns {Object} Matchup analysis with advantages
 */
export function calculateMatchupAdvantages(awayTeam, homeTeam) {
  if (!awayTeam || !homeTeam) {
    return null;
  }
  
  return {
    // Overall ranking advantage
    rankAdvantage: awayTeam.rank < homeTeam.rank ? 'away' : 'home',
    rankDiff: Math.abs(awayTeam.rank - homeTeam.rank),
    
    // Offensive efficiency advantage
    offensiveAdvantage: awayTeam.adjOff > homeTeam.adjOff ? 'away' : 'home',
    offensiveDiff: Math.abs(awayTeam.adjOff - homeTeam.adjOff).toFixed(1),
    
    // Defensive efficiency advantage (lower is better)
    defensiveAdvantage: awayTeam.adjDef < homeTeam.adjDef ? 'away' : 'home',
    defensiveDiff: Math.abs(awayTeam.adjDef - homeTeam.adjDef).toFixed(1),
    
    // Shooting matchup (away offense vs home defense)
    awayOffVsHomeDef: {
      eFG: (awayTeam.eFG_off - homeTeam.eFG_def).toFixed(1),
      advantage: awayTeam.eFG_off > homeTeam.eFG_def ? 'away' : 'home'
    },
    
    // Shooting matchup (home offense vs away defense)
    homeOffVsAwayDef: {
      eFG: (homeTeam.eFG_off - awayTeam.eFG_def).toFixed(1),
      advantage: homeTeam.eFG_off > awayTeam.eFG_def ? 'home' : 'away'
    },
    
    // Turnover battle
    turnoverAdvantage: {
      away: (awayTeam.to_off - homeTeam.to_def).toFixed(1), // Lower is better
      home: (homeTeam.to_off - awayTeam.to_def).toFixed(1)
    },
    
    // Rebounding battle  
    reboundAdvantage: {
      away: (awayTeam.oreb_off - homeTeam.oreb_def).toFixed(1),
      home: (homeTeam.oreb_off - awayTeam.oreb_def).toFixed(1),
      advantage: (awayTeam.oreb_off - homeTeam.oreb_def) > (homeTeam.oreb_off - awayTeam.oreb_def) ? 'away' : 'home'
    },
    
    // Overall strength rating (simple heuristic)
    awayStrength: awayTeam.adjOff - awayTeam.adjDef,
    homeStrength: homeTeam.adjOff - homeTeam.adjDef
  };
}

export default {
  parseBarttorvik,
  calculateMatchupAdvantages
};

