/**
 * D-Ratings Parser  
 * Parses D-Ratings game predictions (PRIMARY 60% SOURCE)
 * 
 * Format: [Rhode Island Rams](link)(4-1)<br>[Towson Tigers](link)(3-2) | 55.0%<br>45.0% | ... | 72.9<br>70.9
 * 
 * EXTRACTS EXACT NAMES - CSV handles all mappings!
 */

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
    // DYNAMIC: Check for current year OR next year (handles year transition)
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    const hasValidYear = line.includes(`/${currentYear}`) || line.includes(`/${nextYear}`);
    if (line.startsWith('|') && hasValidYear && line.includes('%<br>')) {
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
        
        // Extract EXACT team names from D-Ratings (no modifications!)
        const awayTeam = teamMatches[0][1];
        const homeTeam = teamMatches[1][1];
        
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
        
        // Extract predicted scores from "Points" column
        // Format: 72.9<br>70.9 (two decimal numbers separated by <br>)
        // NOTE: Column index varies when Best ML is empty, so find by pattern matching
        let awayScore = null;
        let homeScore = null;
        
        // Find the Points cell: contains exactly 2 decimal numbers with <br> separator
        // This distinguishes it from Total Points (single number) and other columns
        for (let cellIdx = 3; cellIdx < cells.length; cellIdx++) {
          const cell = cells[cellIdx];
          // Pattern: two decimal numbers separated by <br> (e.g., "78.5<br>72.8")
          const pointsPattern = /^([\d.]+)<br>([\d.]+)$/;
          const match = cell.match(pointsPattern);
          if (match) {
            awayScore = parseFloat(match[1]);
            homeScore = parseFloat(match[2]);
            break;
          }
        }
        
        predictions.push({
          awayTeam: awayTeam,  // EXACT name from D-Ratings (e.g., "Richmond Spiders")
          homeTeam: homeTeam,  // EXACT name from D-Ratings (e.g., "Furman Paladins")
          awayWinProb: awayWinProb,
          homeWinProb: homeWinProb,
          awayScore: awayScore,
          homeScore: homeScore,
          gameTime: gameTime,
          source: 'D-Ratings',
          matchup: `${awayTeam} @ ${homeTeam}`
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
 * "Florida Gulf Coast Eagles" -> "Florida Gulf Coast" (NOT "Florida")
 */
function extractSchoolName(fullName) {
  // Special cases - multi-word schools that end with common words
  // These must be checked BEFORE mascot removal
  const specialCases = {
    'Central Connecticut Blue Devils': 'Central Connecticut',
    'Florida Gulf Coast Eagles': 'Florida Gulf Coast',
    'Missouri State Bears': 'Missouri State',
    'Arkansas State Red Wolves': 'Arkansas State',
    'Georgia Southern Eagles': 'Georgia Southern',
    'Northern Arizona Lumberjacks': 'Northern Arizona',
    'McNeese State Cowboys': 'McNeese',
    'Bradley University Braves': 'Bradley',
    'Appalachian State Mountaineers': 'Appalachian State',
    'Evansville Purple Aces': 'Evansville',
    'Holy Cross Crusaders': 'Holy Cross',
    'FIU Golden Panthers': 'FIU',
    'Florida Atlantic Owls': 'Florida Atlantic',
    'George Washington Colonials': 'George Washington',
    'Kennesaw State Owls': 'Kennesaw State',
    'Bowling Green Falcons': 'Bowling Green',
    'Stony Brook Seawolves': 'Stony Brook',
    'Wisconsin Green Bay Phoenix': 'Wisconsin Green Bay',
    'UC San Diego Tritons': 'UC San Diego',
    'UC Riverside Highlanders': 'UC Riverside',
    'Bethune Cookman Wildcats': 'Bethune Cookman',
    'Fairleigh Dickinson Knights': 'Fairleigh Dickinson',
    'Texas A&M Commerce Lions': 'Texas A&M Commerce',
    'St. Francis Red Flash': 'St. Francis',
    'Oral Roberts Golden Eagles': 'Oral Roberts',
    'Oakland Golden Grizzlies': 'Oakland',
    'William & Mary Tribe': 'William & Mary',
    'George Mason Patriots': 'George Mason'
  };
  
  // Check special cases first
  if (specialCases[fullName]) {
    return specialCases[fullName];
  }
  
  // Common mascot patterns (single word)
  const mascots = [
    'Rams', 'Tigers', 'Eagles', 'Wildcats', 'Bears', 'Bulldogs', 'Cardinals',
    'Warriors', 'Panthers', 'Lions', 'Cougars', 'Huskies', 'Knights', 'Falcons',
    'Hawks', 'Trojans', 'Spartans', 'Bruins', 'Aggies', 'Rebels', 'Commodores',
    'Volunteers', 'Jayhawks', 'Terrapins', 'Hoosiers', 'Buckeyes', 'Wolverines',
    'Badgers', 'Hawkeyes', 'Boilermakers', 'Illini', 'Cornhuskers',
    'Gophers', 'Mountaineers', 'Cyclones', 'Sooners', 'Longhorns',
    'Razorbacks', 'Gamecocks', 'Seminoles', 'Hurricanes', 'Cavaliers', 'Hokies',
    'Orange', 'Orangemen', 'Musketeers', 'Friars', 'Bluejays', 'Gaels',
    'Flyers', 'Explorers', 'Billikens', 'Bonnies', 'Dukes', 'Bison', 'Greyhounds',
    'Seawolves', 'Rockets', 'Zips', 'Bulls', 'Owls', 'Miners', 'Blazers', 'Dolphins',
    'Phoenix', 'Peacocks', 'Grizzlies', 'Bearcats', 'Shockers', 'Salukis', 'Redbirds',
    'Sycamores', 'Penguins', 'Colonials', 'Minutemen', 'Spiders', 'Highlanders',
    'Retrievers', 'Catamounts', 'Statesmen', 'Kangaroos', 'Leathernecks',
    'Flames', 'Warhawks', 'Jaguars', 'Hatters', 'Privateers', 'Roadrunners',
    'Saints', 'Buffaloes', 'Mustangs', 'Vaqueros', 'Sharks', 'Paladins', 'Aztecs',
    'Tritons', 'Keydets', 'Racers', 'Cowboys', 'Lumberjacks'
  ];
  
  // Try to remove mascot from end (single word only)
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

