/**
 * Haslametrics Parser
 * Parses team efficiency ratings and tempo-free analytics
 * 
 * Extracts: offensive efficiency, defensive efficiency, tempo, rankings
 */

import { normalizeTeamName } from './teamNameNormalizer.js';

/**
 * Parse Haslametrics ratings from markdown
 * @param {string} markdown - Raw markdown from Haslametrics
 * @returns {object} - Team database with efficiency ratings
 */
export function parseHaslametrics(markdown) {
  if (!markdown || typeof markdown !== 'string') {
    console.warn('Invalid markdown provided to parseHaslametrics');
    return {};
  }
  
  const teams = {};
  const lines = markdown.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Look for team data rows
    // Format: | 1 | [Duke](link)(7-0) | 127.39 | ... |
    if (line.startsWith('|') && line.includes('[') && line.includes('](https://haslametrics')) {
      const cells = line.split('|').map(c => c.trim()).filter(c => c);
      
      if (cells.length < 3) continue;
      
      // Extract team name from markdown link
      const teamMatch = cells[1].match(/\[([^\]]+)\]/);
      if (!teamMatch) continue;
      
      const teamName = teamMatch[1];
      const normalizedName = normalizeTeamName(teamName);
      
      // Extract record
      const recordMatch = cells[1].match(/\((\d+-\d+)\)/);
      const record = recordMatch ? recordMatch[1] : null;
      
      // Extract offensive efficiency (usually 3rd column)
      const offEff = parseFloat(cells[2]) || null;
      
      teams[normalizedName] = {
        name: normalizedName,
        rawName: teamName,
        record: record,
        offensiveEff: offEff,
        source: 'Haslametrics'
      };
    }
  }
  
  console.log(`✅ Parsed ${Object.keys(teams).length} teams from Haslametrics`);
  return teams;
}

/**
 * Get game prediction using tempo-free calculations
 * @param {string} awayTeam - Away team name
 * @param {string} homeTeam - Home team name
 * @param {object} haslametricsData - Team database
 * @returns {object} - Predicted scores and win probability
 */
export function getGamePrediction(awayTeam, homeTeam, haslametricsData) {
  const away = haslametricsData[normalizeTeamName(awayTeam)];
  const home = haslametricsData[normalizeTeamName(homeTeam)];
  
  if (!away || !home) {
    return null;
  }
  
  // Simplified prediction using offensive efficiency
  // In reality, this would use tempo-free calculations
  // For now, use a basic model
  const avgPossessions = 70; // Average possessions per game
  const homeAdvantage = 3; // Points
  
  const awayScore = (away.offensiveEff || 100) * avgPossessions / 100;
  const homeScore = (home.offensiveEff || 100) * avgPossessions / 100 + homeAdvantage;
  
  // Simple win probability based on score differential
  const diff = homeScore - awayScore;
  const homeWinProb = 1 / (1 + Math.exp(-diff / 5));
  
  return {
    awayScore: Math.round(awayScore * 10) / 10,
    homeScore: Math.round(homeScore * 10) / 10,
    awayWinProb: Math.round((1 - homeWinProb) * 1000) / 1000,
    homeWinProb: Math.round(homeWinProb * 1000) / 1000,
    source: 'Haslametrics'
  };
}

