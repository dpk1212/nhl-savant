/**
 * D-Ratings Parser  
 * Parses D-Ratings game predictions (PRIMARY 60% SOURCE)
 * 
 * Extracts: win probabilities, predicted scores, spreads
 */

import { normalizeTeamName } from './teamNameNormalizer.js';

/**
 * Parse D-Ratings predictions from markdown
 * @param {string} markdown - Raw markdown from D-Ratings
 * @returns {array} - Array of game predictions
 */
export function parseDRatings(markdown) {
  if (!markdown || typeof markdown !== 'string') {
    console.warn('Invalid markdown provided to parseDRatings');
    return [];
  }
  
  const predictions = [];
  const lines = markdown.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Look for game rows in the table
    // Format: | [11/24/2025...] | [Team1](link)(4-1)<br>[Team2](link)(3-2) | 55.0%<br>45.0% | ... | 72.9<br>70.9 | ...
    if (line.startsWith('|') && line.includes('[11/24/2025') && line.includes('%<br>')) {
      const cells = line.split('|').map(c => c.trim()).filter(c => c);
      
      if (cells.length < 5) continue;
      
      // Extract game time
      const timeMatch = cells[0].match(/(\d{1,2}:\d{2}\s*(?:AM|PM))/);
      const gameTime = timeMatch ? timeMatch[1] : null;
      
      // Extract teams from cells[1]
      // Format: [Team1](link)(4-1)<br>[Team2](link)(3-2)
      const teamMatches = [...cells[1].matchAll(/\[([^\]]+)\]/g)];
      if (teamMatches.length < 2) continue;
      
      const awayTeam = teamMatches[0][1];
      const homeTeam = teamMatches[1][1];
      
      // Extract win probabilities from cells[2]
      // Format: 55.0%<br>45.0%
      const probMatches = cells[2].match(/(\d+\.?\d*)%.*?(\d+\.?\d*)%/);
      if (!probMatches) continue;
      
      const awayWinProb = parseFloat(probMatches[1]) / 100;
      const homeWinProb = parseFloat(probMatches[2]) / 100;
      
      // Extract predicted scores from cells[5] (Points column)
      // Format: 72.9<br>70.9
      let awayScore = null;
      let homeScore = null;
      
      if (cells[5]) {
        const scoreMatches = cells[5].match(/(\d+\.?\d*)<br>(\d+\.?\d*)/);
        if (scoreMatches) {
          awayScore = parseFloat(scoreMatches[1]);
          homeScore = parseFloat(scoreMatches[2]);
        }
      }
      
      // Extract spread from cells[4] if available
      let spread = null;
      if (cells[4]) {
        const spreadMatch = cells[4].match(/([+-]?\d+\.?\d*)/);
        if (spreadMatch) {
          spread = parseFloat(spreadMatch[1]);
        }
      }
      
      predictions.push({
        awayTeam: normalizeTeamName(awayTeam),
        awayTeamRaw: awayTeam,
        homeTeam: normalizeTeamName(homeTeam),
        homeTeamRaw: homeTeam,
        awayWinProb: awayWinProb,
        homeWinProb: homeWinProb,
        awayScore: awayScore,
        homeScore: homeScore,
        spread: spread,
        gameTime: gameTime,
        source: 'D-Ratings',
        matchup: `${normalizeTeamName(awayTeam)} @ ${normalizeTeamName(homeTeam)}`
      });
    }
  }
  
  console.log(`✅ Parsed ${predictions.length} predictions from D-Ratings`);
  return predictions;
}

/**
 * Get prediction for a specific matchup
 * @param {string} awayTeam - Away team name
 * @param {string} homeTeam - Home team name
 * @param {array} dratingsData - Array of predictions
 * @returns {object|null} - Prediction or null
 */
export function getPrediction(awayTeam, homeTeam, dratingsData) {
  const normalizedAway = normalizeTeamName(awayTeam);
  const normalizedHome = normalizeTeamName(homeTeam);
  
  return dratingsData.find(pred => 
    pred.awayTeam === normalizedAway && 
    pred.homeTeam === normalizedHome
  ) || null;
}

