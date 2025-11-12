/**
 * MoneyPuck Predictions Parser
 * 
 * Parses win probabilities from MoneyPuck HTML/markdown scrapes
 * Used to calibrate your model with MoneyPuck's established predictions
 */

export function parseMoneyPuckPredictions(markdownText) {
  const games = [];
  const lines = markdownText.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Look for game rows with probabilities
    // Pattern: "### Chance of Winning:<br>## 50.2%"
    if (line.includes('Chance of Winning') && line.includes('##')) {
      try {
        // Extract away team probability and team code
        const awayProbMatch = line.match(/Chance of Winning:.*?##\s*(\d+\.\d+)%/);
        const awayTeamMatch = line.match(/!\[([^\]]+)\].*?logos\/([A-Z]{2,3})\.png/);
        
        if (!awayProbMatch || !awayTeamMatch) continue;
        
        const awayProb = parseFloat(awayProbMatch[1]) / 100;
        const awayTeam = awayTeamMatch[2]; // Team code (e.g., "TOR")
        
        // Find home team in same row or next row
        let homeTeamMatch, homeProbMatch;
        
        // Check current line for second team (after first match)
        const remainingLine = line.substring(line.indexOf(awayProbMatch[0]) + awayProbMatch[0].length);
        homeTeamMatch = remainingLine.match(/!\[([^\]]+)\].*?logos\/([A-Z]{2,3})\.png/);
        homeProbMatch = remainingLine.match(/##\s*(\d+\.\d+)%/);
        
        // If not found in current line, check next line
        if ((!homeTeamMatch || !homeProbMatch) && i + 1 < lines.length) {
          const nextLine = lines[i + 1];
          if (!homeTeamMatch) {
            homeTeamMatch = nextLine.match(/!\[([^\]]+)\].*?logos\/([A-Z]{2,3})\.png/);
          }
          if (!homeProbMatch) {
            homeProbMatch = nextLine.match(/##\s*(\d+\.\d+)%/);
          }
        }
        
        if (!homeTeamMatch || !homeProbMatch) continue;
        
        const homeProb = parseFloat(homeProbMatch[1]) / 100;
        const homeTeam = homeTeamMatch[2];
        
        // Validate probabilities sum to ~100% (accounting for rounding)
        const totalProb = awayProb + homeProb;
        if (totalProb < 0.95 || totalProb > 1.05) {
          console.warn(`⚠️ Invalid probabilities for ${awayTeam} @ ${homeTeam}: ${(totalProb * 100).toFixed(1)}%`);
          continue;
        }
        
        // Skip if we already have this game (prevents duplicates)
        const isDuplicate = games.some(g => 
          g.awayTeam === awayTeam && g.homeTeam === homeTeam
        );
        if (isDuplicate) {
          console.log(`⏭️ Skipping duplicate: ${awayTeam} @ ${homeTeam}`);
          continue;
        }
        
        games.push({
          awayTeam: awayTeam,
          homeTeam: homeTeam,
          awayProb: awayProb,
          homeProb: homeProb,
          source: 'MoneyPuck',
          scrapedAt: Date.now()
        });
        
        console.log(`✅ Parsed: ${awayTeam} (${(awayProb * 100).toFixed(1)}%) @ ${homeTeam} (${(homeProb * 100).toFixed(1)}%)`);
        
      } catch (error) {
        console.error(`❌ Error parsing game at line ${i}:`, error);
      }
    }
  }
  
  console.log(`📊 Total MoneyPuck predictions parsed: ${games.length}`);
  return games;
}

/**
 * Helper to normalize team codes between different sources
 * MoneyPuck uses 3-letter codes (e.g., "TOR", "MTL")
 */
export function normalizeTeamCode(teamCode) {
  const teamMap = {
    'TOR': 'TOR',
    'MTL': 'MTL',
    'BOS': 'BOS',
    'TBL': 'TBL',
    'NYR': 'NYR',
    'NYI': 'NYI',
    'PHI': 'PHI',
    'PIT': 'PIT',
    'WSH': 'WSH',
    'CAR': 'CAR',
    'CBJ': 'CBJ',
    'NJD': 'NJD',
    'FLA': 'FLA',
    'DET': 'DET',
    'BUF': 'BUF',
    'OTT': 'OTT',
    'CHI': 'CHI',
    'MIN': 'MIN',
    'WPG': 'WPG',
    'NSH': 'NSH',
    'STL': 'STL',
    'DAL': 'DAL',
    'COL': 'COL',
    'ARI': 'ARI',
    'UTA': 'UTA', // Utah Hockey Club
    'VGK': 'VGK',
    'SEA': 'SEA',
    'CGY': 'CGY',
    'EDM': 'EDM',
    'VAN': 'VAN',
    'LAK': 'LAK',
    'ANA': 'ANA',
    'SJS': 'SJS'
  };
  
  return teamMap[teamCode] || teamCode;
}

export default parseMoneyPuckPredictions;

