/**
 * D-Ratings Parser  
 * Parses D-Ratings game predictions (PRIMARY 60% SOURCE)
 * 
 * Format: [Rhode Island Rams](link)(4-1)<br>[Towson Tigers](link)(3-2) | 55.0%<br>45.0% | ... | 72.9<br>70.9
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
    
    // Look for game rows: starts with |, contains date/time AND team links AND probabilities
    // Format: | [11/24/2025\<br>\<br>11:00 AM](...) | [Rhode Island Rams](...)(4-1)<br>[Towson Tigers](...)(3-2) | 55.0%<br>45.0% | ...
    // Skip header rows (contain | --- | or no date)
    if (line.startsWith('|') && line.includes('/2025') && line.includes('%<br>')) {
      const cells = line.split('|').map(c => c.trim()).filter(c => c);
      
      // Must have at least: time, teams, win%, odds, spread, points
      if (cells.length < 6) continue;
      
      try {
        // Extract game time from first cell
        const timeMatch = cells[0].match(/(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
        const gameTime = timeMatch ? timeMatch[1] : null;
        
        // Extract teams from second cell
        // Format: [Rhode Island Rams](...)(4-1)<br>[Towson Tigers](...)(3-2)
        const teamsCell = cells[1];
        
        // Find all team name links
        const teamMatches = [...teamsCell.matchAll(/\[([^\]]+)\]\([^\)]+\)/g)];
        if (teamMatches.length < 2) continue;
        
        let awayTeamFull = teamMatches[0][1];
        let homeTeamFull = teamMatches[1][1];
        
        // Remove mascot to get school name
        const awayTeam = extractSchoolName(awayTeamFull);
        const homeTeam = extractSchoolName(homeTeamFull);
        
        // Extract win probabilities from third cell
        // Format: 55.0%<br>45.0%
        const probCell = cells[2];
        const probMatch = probCell.match(/([\d.]+)%/g);
        
        if (!probMatch || probMatch.length < 2) continue;
        
        const awayWinProb = parseFloat(probMatch[0].replace('%', '')) / 100;
        const homeWinProb = parseFloat(probMatch[1].replace('%', '')) / 100;
        
        // Validate probabilities
        const probSum = awayWinProb + homeWinProb;
        if (probSum < 0.95 || probSum > 1.05) {
          console.warn(`⚠️  Invalid probabilities for ${awayTeam} @ ${homeTeam}: ${awayWinProb} + ${homeWinProb} = ${probSum}`);
          continue;
        }
        
        // Extract predicted scores from "Points" column (index 5)
        // Format: 72.9<br>70.9
        let awayScore = null;
        let homeScore = null;
        
        if (cells[5]) {
          const scoreMatches = cells[5].match(/([\d.]+)/g);
          if (scoreMatches && scoreMatches.length >= 2) {
            awayScore = parseFloat(scoreMatches[0]);
            homeScore = parseFloat(scoreMatches[1]);
          }
        }
        
        predictions.push({
          awayTeam: normalizeTeamName(awayTeam),
          awayTeamRaw: awayTeamFull,
          homeTeam: normalizeTeamName(homeTeam),
          homeTeamRaw: homeTeamFull,
          awayWinProb: awayWinProb,
          homeWinProb: homeWinProb,
          awayScore: awayScore,
          homeScore: homeScore,
          gameTime: gameTime,
          source: 'D-Ratings',
          matchup: `${normalizeTeamName(awayTeam)} @ ${normalizeTeamName(homeTeam)}`
        });
        
      } catch (error) {
        console.error(`Error parsing D-Ratings line ${i}:`, error.message);
      }
    }
  }
  
  console.log(`✅ Parsed ${predictions.length} predictions from D-Ratings`);
  
  // Log any suspicious probabilities
  const suspicious = predictions.filter(p => p.awayWinProb > 0.98 || p.homeWinProb > 0.98);
  if (suspicious.length > 0) {
    console.warn(`⚠️  ${suspicious.length} games have >98% win probability (possible blowouts)`);
  }
  
  return predictions;
}

/**
 * Extract school name from full team name
 * "Rhode Island Rams" -> "Rhode Island"
 * "Towson Tigers" -> "Towson"
 * "St. John's Red Storm" -> "St. John's"
 */
function extractSchoolName(fullName) {
  // Common mascot patterns
  const mascots = [
    'Rams', 'Tigers', 'Eagles', 'Wildcats', 'Bears', 'Bulldogs', 'Cardinals',
    'Warriors', 'Panthers', 'Lions', 'Cougars', 'Huskies', 'Knights', 'Falcons',
    'Hawks', 'Trojans', 'Spartans', 'Bruins', 'Aggies', 'Rebels', 'Commodores',
    'Volunteers', 'Jayhawks', 'Terrapins', 'Hoosiers', 'Buckeyes', 'Wolverines',
    'Badgers', 'Hawkeyes', 'Boilermakers', 'Illini', 'Cornhuskers', 'Scarlet Knights',
    'Nittany Lions', 'Gophers', 'Mountaineers', 'Cyclones', 'Sooners', 'Longhorns',
    'Red Raiders', 'Razorbacks', 'Gamecocks', 'Crimson Tide', 'Tar Heels', 'Blue Devils',
    'Demon Deacons', 'Yellow Jackets', 'Seminoles', 'Hurricanes', 'Cavaliers', 'Hokies',
    'Orange', 'Orangemen', 'Fighting Irish', 'Musketeers', 'Friars', 'Bluejays', 'Gaels',
    'Flyers', 'Explorers', 'Billikens', 'Bonnies', 'Dukes', 'Bison', 'Greyhounds',
    'Seawolves', 'Rockets', 'Zips', 'Bulls', 'Owls', 'Miners', 'Blazers', 'Dolphins',
    'Phoenix', 'Peacocks', 'Grizzlies', 'Bearcats', 'Shockers', 'Salukis', 'Redbirds',
    'Sycamores', 'Penguins', 'Colonials', 'Minutemen', 'Spiders', 'Highlanders',
    'Retrievers', 'Catamounts', 'River Hawks', 'Statesmen', 'Kangaroos', 'Leathernecks',
    'Flames', 'Warhawks', 'Jaguars', 'Hatters', 'Privateers', 'Roadrunners'
  ];
  
  // Try to remove mascot from end
  for (const mascot of mascots) {
    if (fullName.endsWith(` ${mascot}`)) {
      return fullName.substring(0, fullName.length - mascot.length - 1).trim();
    }
  }
  
  // If no mascot found, return as-is (might already be just school name)
  return fullName.trim();
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

