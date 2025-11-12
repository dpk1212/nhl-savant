/**
 * Player Matchup Analyzer
 * 
 * Takes OddsTrader baseline player props and enhances them with sophisticated
 * matchup analysis including defense quality, goalie matchup, pace, PP opportunity,
 * and more to show users WHY each player has value.
 */

export class PlayerMatchupAnalyzer {
  constructor(dataProcessor, goalieData, startingGoalies) {
    this.dataProcessor = dataProcessor;
    this.goalieData = goalieData;
    this.startingGoalies = startingGoalies;
    
    // Map OddsTrader abbreviations to NHL stats abbreviations
    this.teamAbbreviationMap = {
      'TB': 'TBL',   // Tampa Bay Lightning
      'NJ': 'NJD',   // New Jersey Devils
      'LA': 'LAK',   // Los Angeles Kings
      'SJ': 'SJS',   // San Jose Sharks
      'VEG': 'VGK'   // Vegas Golden Knights
    };
    
    // Calculate and cache league averages and rankings (only once)
    this.leagueAvg = this.calculateLeagueAverages();
    this.defenseRankings = this.calculateDefenseRankings();
  }
  
  /**
   * Convert OddsTrader team abbreviation to NHL stats abbreviation
   */
  normalizeTeamAbbr(abbr) {
    return this.teamAbbreviationMap[abbr] || abbr;
  }

  /**
   * Calculate and cache defense rankings (only once)
   */
  calculateDefenseRankings() {
    const teams = this.dataProcessor.getTeamsBySituation('all');
    
    // Sort by xGA_per60 (lower = better defense)
    const sortedByDefense = teams
      .filter(t => t.xGA_per60 != null)
      .sort((a, b) => (a.xGA_per60 || 999) - (b.xGA_per60 || 999));
    
    // Create a map of team -> rank
    const rankMap = {};
    sortedByDefense.forEach((team, index) => {
      rankMap[team.team] = {
        rank: index + 1,
        xGA_per60: team.xGA_per60,
        teamName: team.name
      };
    });
    
    console.log('📊 Defense Rankings Calculated:', Object.keys(rankMap).length, 'teams');
    console.log('   Best Defense:', sortedByDefense[0]?.team, 'xGA/60:', sortedByDefense[0]?.xGA_per60?.toFixed(2));
    console.log('   Worst Defense:', sortedByDefense[sortedByDefense.length - 1]?.team, 'xGA/60:', sortedByDefense[sortedByDefense.length - 1]?.xGA_per60?.toFixed(2));
    
    return rankMap;
  }

  /**
   * Calculate league-wide averages for comparison
   */
  calculateLeagueAverages() {
    // Get all teams in 'all' situation
    const teams = this.dataProcessor.getTeamsBySituation('all');
    
    const totalXGA = teams.reduce((sum, team) => sum + (team.xGA_per60 || 0), 0);
    const totalShotsAgainst = teams.reduce((sum, team) => sum + (team.shotsOnGoalAgainst_per60 || 0), 0);
    const totalPIM = teams.reduce((sum, team) => sum + (team.penalityMinutes || 0) / (team.gamesPlayed || 1), 0);
    const totalPace = teams.reduce((sum, team) => sum + (team.shotAttempts_per60 || 0), 0);
    
    const avgXGA = totalXGA / teams.length;
    const avgShots = totalShotsAgainst / teams.length;
    const avgPIM = totalPIM / teams.length;
    const avgPace = totalPace / teams.length;
    
    console.log('📊 League Averages Calculated:');
    console.log('   xGA/60:', avgXGA.toFixed(2));
    console.log('   Shots Against/60:', avgShots.toFixed(1));
    console.log('   PIM/game:', avgPIM.toFixed(1));
    console.log('   Pace (SA/60):', avgPace.toFixed(1));
    
    return {
      xGA_per60: avgXGA,
      shotsAgainst_per60: avgShots,
      pim_per_game: avgPIM,
      pace_per60: avgPace
    };
  }

  /**
   * Analyze all players with props for tonight's games
   */
  analyzeAllPlayers(playerProps, skatersData) {
    if (!playerProps || !playerProps.players) {
      return [];
    }

    return playerProps.players.map(player => {
      return this.analyzePlayer(player, skatersData);
    }).filter(Boolean); // Remove any null results
  }

  /**
   * Analyze a single player's matchup
   */
  analyzePlayer(playerProp, skatersData) {
    try {
      // Normalize team abbreviations (OddsTrader uses TB, NJ etc; our data uses TBL, NJD etc)
      const normalizedOpponent = this.normalizeTeamAbbr(playerProp.opponent);
      const normalizedTeam = this.normalizeTeamAbbr(playerProp.team);
      
      // Get opponent team data (processedData is an array, use getTeamData)
      const opponentTeam = this.dataProcessor.getTeamData(normalizedOpponent, 'all');
      if (!opponentTeam) {
        console.warn(`No data found for opponent: ${playerProp.opponent} (normalized: ${normalizedOpponent})`);
        return null;
      }

      // Get starting goalie for opponent
      const opponentGoalie = this.getOpponentGoalie(playerProp.matchup, playerProp.opponent);

      // Find player stats from skaters data
      const playerStats = this.findPlayerStats(playerProp.name, skatersData);

      // Calculate all matchup factors
      const matchupFactors = {
        // 1. Opponent Defense Rank
        defense: this.analyzeDefense(opponentTeam),
        
        // 2. Shot Blocking
        shotBlocking: this.analyzeShotBlocking(opponentTeam),
        
        // 3. Pace Factor
        pace: this.analyzePace(opponentTeam),
        
        // 4. PP Opportunity
        ppOpportunity: this.analyzePPOpportunity(opponentTeam),
        
        // 5. Goalie Quality
        goalie: this.analyzeGoalie(opponentGoalie),
        
        // 6. Rebound Control
        rebounds: this.analyzeRebounds(opponentGoalie),
        
        // 7. Player Shot Volume
        playerShots: this.analyzePlayerShots(playerStats)
      };

      // Calculate adjusted EV based on matchup factors
      const adjustedEV = this.calculateAdjustedEV(playerProp.otEV, matchupFactors);

      // Calculate overall matchup grade
      const grade = this.calculateMatchupGrade(matchupFactors);

      // Generate reasons why this matchup is favorable/unfavorable
      const reasons = this.generateReasons(matchupFactors, opponentTeam.name);

      return {
        // Original player prop data
        ...playerProp,
        
        // Matchup analysis
        matchupFactors,
        adjustedEV,
        grade,
        reasons,
        
        // Additional context
        opponentTeamName: opponentTeam.name,
        opponentGoalieName: opponentGoalie?.name || 'TBD',
        playerStats: playerStats ? {
          position: playerStats.position,
          goalsPerGame: playerStats.goalsPerGame,
          shotsPerGame: playerStats.shotsPerGame,
          xGoalsPerGame: playerStats.xGoalsPerGame,
          highDangerRate: playerStats.highDangerRate,
          shootingPercentage: playerStats.shootingPercentage
        } : null
      };
    } catch (error) {
      console.error(`Error analyzing player ${playerProp.name}:`, error);
      return null;
    }
  }

  /**
   * 1. Analyze opponent defense quality
   */
  analyzeDefense(opponentTeam) {
    const xGA_per60 = opponentTeam.xGA_per60 || 0;
    const leagueAvg = this.leagueAvg.xGA_per60;
    
    // Use cached rankings
    const rankInfo = this.defenseRankings[opponentTeam.team];
    const rank = rankInfo?.rank || 99;
    
    // Grade based on rank (higher rank = worse defense = easier matchup)
    let grade;
    if (rank > 24) grade = 'A+';      // Bottom 8 teams (easy)
    else if (rank > 16) grade = 'A';  // 17-24
    else if (rank > 8) grade = 'B';   // 9-16
    else grade = 'C';                 // Top 8 (elite defense)
    
    const vsAvg = ((xGA_per60 / leagueAvg - 1) * 100).toFixed(1);
    
    console.log(`   Defense: ${opponentTeam.team} rank #${rank}, xGA/60: ${xGA_per60.toFixed(2)} (${vsAvg}% vs avg)`);
    
    return {
      rank,
      grade,
      xGA_per60: xGA_per60.toFixed(2),
      vsLeague: `${vsAvg > 0 ? '+' : ''}${vsAvg}%`,
      isFavorable: rank > 16 // Easier than average
    };
  }

  /**
   * 2. Analyze opponent shot blocking
   */
  analyzeShotBlocking(opponentTeam) {
    const blockedShots = opponentTeam.blockedShotsAgainst || 0;
    const gamesPlayed = opponentTeam.gamesPlayed || 1;
    const blocksPerGame = blockedShots / gamesPlayed;
    
    // Lower blocks = better for shooter
    const isFavorable = blocksPerGame < 12.5;
    
    return {
      blocksPerGame: blocksPerGame.toFixed(1),
      level: blocksPerGame < 11 ? 'Low' : blocksPerGame < 13 ? 'Average' : 'High',
      isFavorable
    };
  }

  /**
   * 3. Analyze game pace
   */
  analyzePace(opponentTeam) {
    const pace = opponentTeam.shotAttempts_per60 || 0;
    const leagueAvg = this.leagueAvg.pace_per60;
    const paceRatio = pace / leagueAvg;
    const vsAvg = ((paceRatio - 1) * 100).toFixed(1);
    
    let level;
    if (paceRatio > 1.05) level = 'Fast';
    else if (paceRatio < 0.95) level = 'Slow';
    else level = 'Average';
    
    console.log(`   Pace: ${opponentTeam.team} ${pace.toFixed(1)} SA/60 (${vsAvg}% vs avg) - ${level}`);
    
    return {
      pace: pace.toFixed(1),
      vsLeague: `${vsAvg > 0 ? '+' : ''}${vsAvg}%`,
      level,
      isFavorable: paceRatio > 1.03 // Fast pace = more shots = more opportunities
    };
  }

  /**
   * 4. Analyze PP opportunity (opponent penalty minutes)
   */
  analyzePPOpportunity(opponentTeam) {
    const pim = opponentTeam.penalityMinutes || 0;
    const gamesPlayed = opponentTeam.gamesPlayed || 1;
    const pimPerGame = pim / gamesPlayed;
    
    // More penalties = more PP opportunities
    const isFavorable = pimPerGame > 9; // ~2.25 penalties per game
    
    let level;
    if (pimPerGame > 12) level = 'High';
    else if (pimPerGame < 8) level = 'Low';
    else level = 'Average';
    
    console.log(`   PP Opp: ${opponentTeam.team} ${pimPerGame.toFixed(1)} PIM/gm - ${level}`);
    
    return {
      pimPerGame: pimPerGame.toFixed(1),
      level,
      isFavorable
    };
  }

  /**
   * 5. Analyze goalie quality
   */
  analyzeGoalie(goalie) {
    if (!goalie || goalie.gsae === undefined || goalie.gsae === null) {
      return {
        name: 'TBD',
        gsae: 0,
        level: 'Unknown',
        isFavorable: false
      };
    }

    const gsae = typeof goalie.gsae === 'number' ? goalie.gsae : parseFloat(goalie.gsae) || 0;
    
    let level;
    if (gsae > 5) level = 'Elite';
    else if (gsae > 2) level = 'Above Avg';
    else if (gsae > -2) level = 'Average';
    else if (gsae > -5) level = 'Below Avg';
    else level = 'Struggling';
    
    return {
      name: goalie.name,
      gsae: parseFloat(gsae.toFixed(1)),
      level,
      isFavorable: gsae < -2 // Negative GSAE = allowing more goals than expected
    };
  }

  /**
   * 6. Analyze goalie rebound control
   */
  analyzeRebounds(goalie) {
    if (!goalie) {
      return {
        rate: 'Unknown',
        level: 'Unknown',
        isFavorable: false
      };
    }

    // Estimate rebound rate from goalie stats
    // (This is a placeholder - ideally we'd have actual rebound data)
    const reboundRate = 0.85; // Average NHL rebound rate
    
    return {
      rate: reboundRate.toFixed(2),
      level: reboundRate > 0.90 ? 'High' : reboundRate < 0.80 ? 'Low' : 'Average',
      isFavorable: reboundRate > 0.88 // High rebounds = second chance opportunities
    };
  }

  /**
   * 7. Analyze player shot volume and quality
   */
  analyzePlayerShots(playerStats) {
    if (!playerStats) {
      return {
        shotsPerGame: 'N/A',
        highDangerRate: 'N/A',
        level: 'Unknown',
        isFavorable: false
      };
    }

    const shotsPerGame = playerStats.shotsPerGame || 0;
    const highDangerRate = playerStats.highDangerRate || 0;
    
    let level;
    if (shotsPerGame > 3.5 && highDangerRate > 0.35) level = 'Elite Volume';
    else if (shotsPerGame > 2.5) level = 'Good Volume';
    else level = 'Low Volume';
    
    return {
      shotsPerGame: shotsPerGame.toFixed(1),
      highDangerRate: (highDangerRate * 100).toFixed(0) + '%',
      level,
      isFavorable: shotsPerGame > 2.5 // Good shot volume
    };
  }

  /**
   * Calculate adjusted EV based on matchup factors
   */
  calculateAdjustedEV(otEV, factors) {
    // Parse OddsTrader EV (e.g., "+9.4%" -> 9.4)
    let baseEV = parseFloat(otEV.replace('%', '').replace('+', ''));
    
    // Apply adjustments based on favorable factors
    if (factors.defense.isFavorable) baseEV += 2.0;      // Weak defense
    if (factors.goalie.isFavorable) baseEV += 1.5;       // Struggling goalie
    if (factors.ppOpportunity.isFavorable) baseEV += 1.0; // High penalties
    if (factors.pace.isFavorable) baseEV += 0.5;          // Fast pace
    if (factors.playerShots.isFavorable) baseEV += 0.5;   // High shot volume
    
    // Apply penalties for unfavorable factors
    if (factors.defense.grade === 'C') baseEV -= 2.0;     // Elite defense
    if (factors.goalie.level === 'Elite') baseEV -= 1.5;  // Elite goalie
    
    return `${baseEV > 0 ? '+' : ''}${baseEV.toFixed(1)}%`;
  }

  /**
   * Calculate overall matchup grade
   */
  calculateMatchupGrade(factors) {
    const favorableCount = [
      factors.defense.isFavorable,
      factors.goalie.isFavorable,
      factors.ppOpportunity.isFavorable,
      factors.pace.isFavorable,
      factors.playerShots.isFavorable
    ].filter(Boolean).length;
    
    if (favorableCount >= 4) return 'A+';
    if (favorableCount === 3) return 'A';
    if (favorableCount === 2) return 'B+';
    return 'B';
  }

  /**
   * Generate human-readable reasons for matchup quality
   */
  generateReasons(factors, opponentName) {
    const reasons = [];
    
    if (factors.defense.isFavorable) {
      reasons.push(`Faces #${factors.defense.rank} ranked defense (${factors.defense.vsLeague} vs league avg)`);
    }
    
    if (factors.goalie.isFavorable) {
      reasons.push(`${factors.goalie.name} allowing ${factors.goalie.gsae} GSAE (${factors.goalie.level})`);
    }
    
    if (factors.ppOpportunity.isFavorable) {
      reasons.push(`${opponentName} takes ${factors.ppOpportunity.pimPerGame} PIM/game (PP opportunity)`);
    }
    
    if (factors.pace.isFavorable) {
      reasons.push(`Fast-paced game (${factors.pace.vsLeague} vs league avg shots)`);
    }
    
    if (factors.playerShots.isFavorable) {
      reasons.push(`Player generates ${factors.playerShots.shotsPerGame} shots/game (${factors.playerShots.level})`);
    }
    
    if (reasons.length === 0) {
      reasons.push('Average matchup - no standout favorable factors');
    }
    
    return reasons;
  }

  /**
   * Get opponent starting goalie
   */
  getOpponentGoalie(matchup, opponentTeam) {
    if (!this.startingGoalies || !this.startingGoalies.games) {
      return null;
    }

    // Find the game
    const game = this.startingGoalies.games.find(g => g.matchup === matchup);
    if (!game) {
      return null;
    }

    // Find which side the opponent is on
    const goalieInfo = game.away.team === opponentTeam ? game.away : 
                      game.home.team === opponentTeam ? game.home : null;
    
    if (!goalieInfo || !goalieInfo.goalie) {
      return null;
    }

    // Find goalie stats from goalieData (RAW CSV)
    if (this.goalieData) {
      const goalieStats = this.goalieData.find(g => 
        g.name && goalieInfo.goalie && g.situation === 'all' &&
        g.name.toLowerCase().includes(goalieInfo.goalie.toLowerCase())
      );
      
      if (goalieStats) {
        // Calculate GSAE from raw CSV fields
        const xGoals = parseFloat(goalieStats.xGoals) || 0;
        const goalsAllowed = parseFloat(goalieStats.goals) || 0;
        const gsae = xGoals - goalsAllowed;
        
        console.log(`   🥅 Goalie: ${goalieStats.name} - xG: ${xGoals.toFixed(1)}, GA: ${goalsAllowed.toFixed(1)}, GSAE: ${gsae.toFixed(1)}`);
        
        return {
          name: goalieInfo.goalie,
          gsae: gsae
        };
      }
    }

    console.log(`   ⚠️  Goalie ${goalieInfo.goalie} not found in goalies.csv`);
    return {
      name: goalieInfo.goalie,
      gsae: 0
    };
  }

  /**
   * Find player stats from skaters CSV data
   */
  findPlayerStats(playerName, skatersData) {
    if (!skatersData || skatersData.length === 0) {
      return null;
    }

    // Try to find player by name (case-insensitive partial match) AND situation='all'
    const player = skatersData.find(p => {
      if (!p.name || p.situation !== 'all') return false;
      const nameLower = p.name.toLowerCase();
      const searchLower = playerName.toLowerCase();
      return nameLower.includes(searchLower) || searchLower.includes(nameLower);
    });

    if (!player) {
      console.warn(`   ⚠️  Player not found in skaters.csv: ${playerName}`);
      return null;
    }

    // Calculate relevant stats
    const gamesPlayed = parseFloat(player.games_played) || 1;
    const goals = parseFloat(player.I_F_goals) || 0;
    const shots = parseFloat(player.I_F_shotsOnGoal) || 0;
    const xGoals = parseFloat(player.I_F_xGoals) || 0;
    const highDangerXG = parseFloat(player.I_F_highDangerxGoals) || 0;

    const shootingPct = shots > 0 ? (goals / shots) * 100 : 0;

    console.log(`   ✅ Found player: ${player.name} - ${shots} shots / ${gamesPlayed} GP = ${(shots/gamesPlayed).toFixed(1)} SOG/gm, ${shootingPct.toFixed(1)}% shooting`);

    return {
      name: player.name,
      team: player.team,
      position: player.position,
      goalsPerGame: goals / gamesPlayed,
      shotsPerGame: shots / gamesPlayed,
      xGoalsPerGame: xGoals / gamesPlayed,
      highDangerRate: xGoals > 0 ? highDangerXG / xGoals : 0,
      shootingPercentage: shootingPct,
      gamesPlayed: gamesPlayed
    };
  }

  /**
   * Get matchup summary emoji/icon
   */
  getMatchupIcon(grade) {
    switch(grade) {
      case 'A+': return '🔥'; // Elite matchup
      case 'A': return '⭐';  // Strong matchup
      case 'B+': return '✓';  // Good matchup
      default: return '➖';   // Average matchup
    }
  }
}

/**
 * Load player props from JSON file
 */
export async function loadPlayerProps() {
  try {
    const url = `${import.meta.env.BASE_URL}player_props.json`;
    console.log('📥 Loading player props from:', url);
    const response = await fetch(url);
    console.log('📥 Response status:', response.status, response.statusText);
    if (!response.ok) {
      console.warn('⚠️ No player props data available yet (HTTP', response.status, ')');
      return null;
    }
    const data = await response.json();
    console.log('✅ Loaded player props:', data.count || data.players?.length || 0, 'players');
    return data;
  } catch (error) {
    console.error('❌ Error loading player props:', error);
    return null;
  }
}

/**
 * Load skaters data from CSV
 */
export async function loadSkatersData() {
  try {
    const Papa = (await import('papaparse')).default;
    const response = await fetch(`${import.meta.env.BASE_URL}skaters.csv`);
    const csvText = await response.text();
    
    return new Promise((resolve) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log(`✅ Loaded ${results.data.length} skaters`);
          resolve(results.data);
        }
      });
    });
  } catch (error) {
    console.error('Error loading skaters data:', error);
    return [];
  }
}

