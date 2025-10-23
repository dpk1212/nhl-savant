/**
 * Schedule Helper - Track team rest and B2B games
 * Uses nhl-202526-asplayed.csv to calculate days since last game
 * Applies rest-based adjustments to predictions
 */

export class ScheduleHelper {
  constructor(scheduleData) {
    this.teamNameToCode = this.buildTeamMapping();
    this.gamesByTeam = this.indexSchedule(scheduleData);
  }

  /**
   * Map full team names to team codes
   * Schedule CSV uses full names (e.g., "New York Rangers")
   * Model uses team codes (e.g., "NYR")
   */
  buildTeamMapping() {
    return {
      'Anaheim Ducks': 'ANA',
      'Arizona Coyotes': 'ARI',
      'Boston Bruins': 'BOS',
      'Buffalo Sabres': 'BUF',
      'Calgary Flames': 'CGY',
      'Carolina Hurricanes': 'CAR',
      'Chicago Blackhawks': 'CHI',
      'Colorado Avalanche': 'COL',
      'Columbus Blue Jackets': 'CBJ',
      'Dallas Stars': 'DAL',
      'Detroit Red Wings': 'DET',
      'Edmonton Oilers': 'EDM',
      'Florida Panthers': 'FLA',
      'Los Angeles Kings': 'LAK',
      'Minnesota Wild': 'MIN',
      'Montreal Canadiens': 'MTL',
      'Nashville Predators': 'NSH',
      'New Jersey Devils': 'NJ',
      'New York Islanders': 'NYI',
      'New York Rangers': 'NYR',
      'Ottawa Senators': 'OTT',
      'Philadelphia Flyers': 'PHI',
      'Pittsburgh Penguins': 'PIT',
      'San Jose Sharks': 'SJ',
      'Seattle Kraken': 'SEA',
      'St. Louis Blues': 'STL',
      'Tampa Bay Lightning': 'TB',
      'Toronto Maple Leafs': 'TOR',
      'Utah Mammoth': 'UTA',
      'Vancouver Canucks': 'VAN',
      'Vegas Golden Knights': 'VEG',
      'Washington Capitals': 'WSH',
      'Winnipeg Jets': 'WPG'
    };
  }

  /**
   * Index schedule by team and date for quick lookups
   * @param {Array} csvData - Parsed CSV rows from nhl-202526-asplayed.csv
   * @returns {Object} Games indexed by team code
   */
  indexSchedule(csvData) {
    const gamesByTeam = {};

    if (!csvData || !Array.isArray(csvData)) {
      console.warn('⚠️ Schedule data invalid, B2B disabled');
      return gamesByTeam;
    }

    csvData.forEach(row => {
      const date = row.Date; // Format: "10/7/2025"
      const awayName = row.Visitor; // Full name, e.g., "New York Rangers"
      const homeName = row.Home; // Full name, e.g., "Boston Bruins"

      // Convert full team names to team codes
      const away = this.teamNameToCode[awayName];
      const home = this.teamNameToCode[homeName];

      if (!date || !away || !home) {
        if (awayName || homeName) {
          console.warn(`⚠️ Could not map team names: ${awayName} vs ${homeName}`);
        }
        return; // Skip invalid rows
      }

      if (!gamesByTeam[away]) gamesByTeam[away] = [];
      if (!gamesByTeam[home]) gamesByTeam[home] = [];

      gamesByTeam[away].push({
        date,
        opponent: home,
        location: 'away',
        timestamp: this.parseDate(date)
      });

      gamesByTeam[home].push({
        date,
        opponent: away,
        location: 'home',
        timestamp: this.parseDate(date)
      });
    });

    // Sort each team's games by date
    Object.values(gamesByTeam).forEach(games => {
      games.sort((a, b) => a.timestamp - b.timestamp);
    });

    console.log(`✅ Indexed schedule for ${Object.keys(gamesByTeam).length} teams (2025-26 season)`);
    console.log(`   📈 Valid games: ${validGames}, Skipped rows: ${skippedRows}`);
    return gamesByTeam;
  }

  /**
   * Parse date string "10/7/2025" or "2024-10-04" to timestamp
   */
  parseDate(dateStr) {
    if (!dateStr) return 0;
    
    // Handle YYYY-MM-DD format (from CSV)
    if (dateStr.includes('-')) {
      const [year, month, day] = dateStr.split('-');
      return new Date(year, month - 1, day).getTime();
    }
    
    // Handle MM/DD/YYYY format (legacy)
    if (dateStr.includes('/')) {
      const [month, day, year] = dateStr.split('/');
      return new Date(year, month - 1, day).getTime();
    }
    
    return 0;
  }

  /**
   * Get days of rest before a game
   * @param {string} team - Team code (e.g., "BOS", "NYR")
   * @param {string} gameDate - Game date "10/7/2025"
   * @returns {number|null} Days since last game, null if season start
   */
  getDaysRest(team, gameDate) {
    const games = this.gamesByTeam[team];
    if (!games || games.length === 0) return null;

    const targetTimestamp = this.parseDate(gameDate);
    if (!targetTimestamp) return null;

    // Find most recent game BEFORE gameDate
    const prevGame = games
      .filter(g => g.timestamp < targetTimestamp)
      .sort((a, b) => b.timestamp - a.timestamp)[0];

    if (!prevGame) return null; // Season start

    const daysDiff = Math.floor((targetTimestamp - prevGame.timestamp) / (1000 * 60 * 60 * 24));
    return daysDiff;
  }

  /**
   * Check if team is playing back-to-back
   */
  isBackToBack(team, gameDate) {
    const rest = this.getDaysRest(team, gameDate);
    return rest === 1;
  }

  /**
   * Calculate rest-based adjustment to apply to predicted goals
   * B2B: -3% (fatigue)
   * 1 day rest: 0% (normal)
   * 2+ days rest: +4% (extra rest advantage)
   * Season start: 0% (no adjustment)
   * 
   * @param {string} team - Team code
   * @param {string} gameDate - Game date
   * @returns {number} Adjustment multiplier (0.97 for -3%, 1.04 for +4%, etc)
   */
  getRestAdjustment(team, gameDate) {
    const rest = this.getDaysRest(team, gameDate);

    if (rest === null) {
      return 0; // Season start, no adjustment
    }

    if (rest === 1) {
      return -0.03; // B2B: -3%
    }

    if (rest === 2) {
      return 0; // Normal rest
    }

    if (rest >= 3) {
      return 0.04; // Extra rest: +4%
    }

    if (rest <= 0) {
      return -0.04; // Back-to-back-to-back or same day (shouldn't happen): -4%
    }

    return 0;
  }

  /**
   * Get detailed rest info (for debugging/display)
   */
  getRestInfo(team, gameDate) {
    const rest = this.getDaysRest(team, gameDate);
    const adjustment = this.getRestAdjustment(team, gameDate);

    return {
      daysRest: rest,
      isB2B: rest === 1,
      adjustment,
      description:
        rest === null
          ? 'Season start'
          : rest === 1
            ? 'Back-to-back'
            : rest === 2
              ? 'Normal rest'
              : rest >= 3
                ? `Extra rest (${rest} days)`
                : 'Unknown'
    };
  }
}
