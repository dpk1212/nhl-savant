/**
 * Team CSV Loader
 * Loads and queries basketball_teams.csv for mapping team names across sources
 */

/**
 * Load team mappings from CSV
 * @param {string} csvContent - Raw CSV content
 * @returns {Map} - Map of normalized_name -> mapping object
 */
export function loadTeamMappings(csvContent) {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',');
  
  const mappings = new Map();
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = parseCSVLine(line);
    if (values.length < 4) continue;
    
    const mapping = {
      normalized: values[0],
      oddstrader: values[1],
      haslametrics: values[2],
      dratings: values[3],
      conference: values[4] || '',
      ncaa_name: values[5] || '', // FIXED: Column 5 is NCAA name, not notes
      notes: values[6] || '' // FIXED: Column 6 is notes
    };
    
    mappings.set(mapping.normalized, mapping);
  }
  
  console.log(`✅ Loaded ${mappings.size} team mappings with NCAA names`);
  return mappings;
}

/**
 * Find team mapping by source name
 * @param {Map} mappings - Team mappings from loadTeamMappings
 * @param {string} teamName - Team name to find
 * @param {string} source - Source column ('oddstrader', 'haslametrics', 'dratings')
 * @returns {object|null} - Mapping object or null
 */
export function findTeamMapping(mappings, teamName, source = 'oddstrader') {
  if (!teamName) return null;
  
  // Normalize input
  const searchName = teamName.trim().toLowerCase();
  
  // Search by source column
  for (const [normalized, mapping] of mappings) {
    const sourceValue = mapping[source];
    if (!sourceValue) continue;
    
    if (sourceValue.toLowerCase() === searchName) {
      return mapping;
    }
  }
  
  // Fallback: partial match
  for (const [normalized, mapping] of mappings) {
    const sourceValue = mapping[source];
    if (!sourceValue) continue;
    
    if (sourceValue.toLowerCase().includes(searchName) || 
        searchName.includes(sourceValue.toLowerCase())) {
      return mapping;
    }
  }
  
  return null;
}

/**
 * Parse CSV line handling quoted values
 * @param {string} line - CSV line
 * @returns {array} - Array of values
 */
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

/**
 * Find D-Ratings prediction by team names
 * @param {array} predictions - D-Ratings predictions
 * @param {string} awayDRateName - Away team D-Ratings name
 * @param {string} homeDRateName - Home team D-Ratings name
 * @returns {object|null} - Prediction or null
 */
export function findDRatingsPrediction(predictions, awayDRateName, homeDRateName) {
  if (!awayDRateName || !homeDRateName) return null;
  
  return predictions.find(pred =>
    pred.awayTeam === awayDRateName && pred.homeTeam === homeDRateName
  );
}

/**
 * Find Haslametrics game by team names
 * @param {array} games - Haslametrics games
 * @param {string} awayHaslaName - Away team Haslametrics name
 * @param {string} homeHaslaName - Home team Haslametrics name
 * @returns {object|null} - Game or null
 */
export function findHaslametricsGame(games, awayHaslaName, homeHaslaName) {
  if (!awayHaslaName || !homeHaslaName) return null;
  
  return games.find(game =>
    game.awayTeamRaw === awayHaslaName && game.homeTeamRaw === homeHaslaName
  );
}

