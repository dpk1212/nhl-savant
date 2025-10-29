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
      const date = row.Date; // Format: "10/7/2025" or "2025-10-07"
      const awayName = row.Visitor; // Full name, e.g., "New York Rangers"
      const homeName = row.Home; // Full name, e.g., "Boston Bruins"
      const awayScore = parseInt(row.Score_1) || 0; // Away team score
      const homeScore = parseInt(row.Score_2) || 0; // Home team score
      const status = row.Status; // "Final", "Final OT", "Final SO", or null for upcoming games

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

      // Determine result for away team
      let awayResult = null;
      let awayGoalDiff = null;
      if (status && status.includes('Final')) {
        awayGoalDiff = awayScore - homeScore;
        if (awayScore > homeScore) {
          awayResult = 'W';
        } else if (awayScore < homeScore) {
          awayResult = status.includes('OT') || status.includes('SO') ? 'OTL' : 'L';
        } else {
          awayResult = 'T'; // Tie (rare in modern NHL)
        }
      }

      // Determine result for home team
      let homeResult = null;
      let homeGoalDiff = null;
      if (status && status.includes('Final')) {
        homeGoalDiff = homeScore - awayScore;
        if (homeScore > awayScore) {
          homeResult = 'W';
        } else if (homeScore < awayScore) {
          homeResult = status.includes('OT') || status.includes('SO') ? 'OTL' : 'L';
        } else {
          homeResult = 'T';
        }
      }

      gamesByTeam[away].push({
        date,
        opponent: home,
        location: 'away',
        timestamp: this.parseDate(date),
        result: awayResult,
        score: status ? `${awayScore}-${homeScore}` : null,
        goalDifferential: awayGoalDiff
      });

      gamesByTeam[home].push({
        date,
        opponent: away,
        location: 'home',
        timestamp: this.parseDate(date),
        result: homeResult,
        score: status ? `${homeScore}-${awayScore}` : null,
        goalDifferential: homeGoalDiff
      });
    });

    // Sort each team's games by date
    Object.values(gamesByTeam).forEach(games => {
      games.sort((a, b) => a.timestamp - b.timestamp);
    });

    console.log(`✅ Indexed schedule for ${Object.keys(gamesByTeam).length} teams (2025-26 season)`);
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
   * Count consecutive away games before this game
   * Used for road trip fatigue detection
   * @param {string} team - Team code
   * @param {string} gameDate - Game date
   * @returns {number} Number of consecutive away games (0 if home game or first away)
   */
  getConsecutiveAwayGames(team, gameDate) {
    const games = this.gamesByTeam[team];
    if (!games || games.length === 0) return 0;

    const targetTimestamp = this.parseDate(gameDate);
    if (!targetTimestamp) return 0;

    // Get all games before this one, sorted newest first
    const prevGames = games
      .filter(g => g.timestamp < targetTimestamp)
      .sort((a, b) => b.timestamp - a.timestamp);

    // Count consecutive away games
    let awayStreak = 0;
    for (const game of prevGames) {
      if (game.location === 'away') {
        awayStreak++;
      } else {
        break; // Hit a home game, stop counting
      }
    }

    return awayStreak;
  }

  /**
   * Calculate road trip fatigue adjustment
   * Research: Teams on game 3+ of road trip show 3-8% performance decline
   * @param {string} team - Team code
   * @param {string} gameDate - Game date
   * @returns {number} Adjustment value (negative for fatigue)
   */
  getRoadTripAdjustment(team, gameDate) {
    const awayStreak = this.getConsecutiveAwayGames(team, gameDate);

    // No penalty for home games or first 2 away games
    if (awayStreak < 2) return 0;

    // Progressive fatigue penalty
    if (awayStreak === 2) return -0.03; // 3rd game of trip: -3%
    if (awayStreak === 3) return -0.05; // 4th game: -5%
    if (awayStreak >= 4) return -0.08; // 5th+ game: -8%

    return 0;
  }

  /**
   * Check if team is returning home from a long road trip
   * @param {string} team - Team code
   * @param {string} gameDate - Game date
   * @returns {Object} { isHomecoming: boolean, tripLength: number }
   */
  isHomecomingGame(team, gameDate) {
    const games = this.gamesByTeam[team];
    if (!games || games.length === 0) {
      return { isHomecoming: false, tripLength: 0 };
    }

    const targetTimestamp = this.parseDate(gameDate);
    if (!targetTimestamp) {
      return { isHomecoming: false, tripLength: 0 };
    }

    // Current game must be home
    const currentGame = games.find(g => g.timestamp === targetTimestamp);
    if (!currentGame || currentGame.location !== 'home') {
      return { isHomecoming: false, tripLength: 0 };
    }

    // Count previous consecutive away games
    const prevGames = games
      .filter(g => g.timestamp < targetTimestamp)
      .sort((a, b) => b.timestamp - a.timestamp);

    let awayStreak = 0;
    for (const game of prevGames) {
      if (game.location === 'away') {
        awayStreak++;
      } else {
        break;
      }
    }

    return {
      isHomecoming: awayStreak >= 3, // Only if trip was 3+ games
      tripLength: awayStreak
    };
  }

  /**
   * Calculate homecoming boost adjustment
   * Research: Teams return home from 3+ game trips with +3-6% boost
   * Fresh crowd energy, familiar surroundings, own bed
   * @param {string} team - Team code
   * @param {string} gameDate - Game date
   * @returns {number} Adjustment value (positive for boost)
   */
  getHomecomingAdjustment(team, gameDate) {
    const { isHomecoming, tripLength } = this.isHomecomingGame(team, gameDate);

    if (!isHomecoming) return 0;

    // Longer trip = bigger homecoming boost
    if (tripLength === 3) return 0.03; // +3% boost
    if (tripLength === 4) return 0.05; // +5% boost
    if (tripLength >= 5) return 0.06; // +6% boost (rare but powerful)

    return 0;
  }

  /**
   * Get COMBINED situational adjustment
   * Includes: B2B/rest, road trip fatigue, homecoming boost
   * @param {string} team - Team code
   * @param {string} gameDate - Game date
   * @param {boolean} isHome - Whether team is home or away
   * @returns {number} Combined adjustment value
   */
  getCombinedAdjustment(team, gameDate, isHome) {
    let adjustment = 0;

    // Base rest adjustment (B2B, extra rest)
    adjustment += this.getRestAdjustment(team, gameDate);

    if (isHome) {
      // Check for homecoming boost
      const homecomingAdj = this.getHomecomingAdjustment(team, gameDate);
      if (homecomingAdj !== 0) {
        adjustment += homecomingAdj;
      }
    } else {
      // Check for road trip fatigue
      const roadTripAdj = this.getRoadTripAdjustment(team, gameDate);
      if (roadTripAdj !== 0) {
        adjustment += roadTripAdj;
      }
    }

    return adjustment;
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

  /**
   * Get team's recent games with results
   * Used for TrendMomentumChart to show real W/L/OTL record
   * NOTE: This returns COMPLETED games only - no result = not included
   * @param {string} team - Team code (e.g., "BOS", "NYR")
   * @param {number} numGames - Number of recent games to return (default 10)
   * @returns {Array} Recent games with result, opponent, goal differential
   */
  getTeamRecentGames(team, numGames = 10) {
    const games = this.gamesByTeam[team];
    if (!games || games.length === 0) return [];

    const now = Date.now();
    
    // Get completed games (in the past) sorted newest to oldest
    const completedGames = games
      .filter(g => g.timestamp < now && g.result) // Only games with results
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, numGames);

    return completedGames;
  }
}
