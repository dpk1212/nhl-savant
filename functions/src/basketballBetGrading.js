/**
 * Basketball Bet Grading - Firebase Cloud Functions
 * 
 * Automatically grades basketball bets using NCAA API
 * Runs every 4 hours to check for completed games
 */

const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onRequest } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");

/**
 * Load CSV team mappings from Firebase Storage
 * Returns a map of normalized team names to their NCAA names
 */
async function loadTeamMappings() {
  try {
    // For Cloud Functions, we'll need to load from a known URL or Storage
    // For now, return a simplified mapping function
    return null;
  } catch (error) {
    logger.error("Error loading team mappings:", error);
    return null;
  }
}

/**
 * Fetch NCAA games for a specific date
 */
async function fetchNCAAGames(dateStr) {
  try {
    // Format: YYYY/MM/DD
    const formattedDate = dateStr.replace(/-/g, '/');
    const url = `https://ncaa-api.henrygd.me/scoreboard/basketball-men/d1/${formattedDate}`;
    
    logger.info(`Fetching NCAA games for ${formattedDate}`);
    
    const response = await fetch(url);
    if (!response.ok) {
      logger.error(`NCAA API error: ${response.status}`);
      return [];
    }
    
    const data = await response.json();
    const games = data.games || [];
    
    logger.info(`Fetched ${games.length} games from NCAA API`);
    
    const parsedGames = games.map(g => {
      // ROBUSTNESS: Validate game structure
      if (!g.game || !g.game.away || !g.game.home) {
        logger.warn(`⚠️ Invalid game structure:`, g);
        return null;
      }
      
      const awayScore = parseInt(g.game.away.score);
      const homeScore = parseInt(g.game.home.score);
      
      // Validate scores
      if (isNaN(awayScore) || isNaN(homeScore)) {
        logger.warn(`⚠️ Invalid scores: ${g.game.away.names?.short} (${g.game.away.score}) @ ${g.game.home.names?.short} (${g.game.home.score})`);
      }
      
      return {
        awayTeam: g.game.away.names.short,
        homeTeam: g.game.home.names.short,
        awayScore: awayScore || 0,
        homeScore: homeScore || 0,
        gameState: g.game.gameState,
        isFinal: g.game.gameState === 'final',
      };
    }).filter(g => g !== null); // Remove invalid games
    
    const finalCount = parsedGames.filter(g => g.isFinal).length;
    logger.info(`Parsed ${parsedGames.length} games, ${finalCount} are final`);
    if (finalCount > 0) {
      logger.info(`Sample final games with VERIFIED score mapping:`);
      parsedGames.filter(g => g.isFinal).slice(0, 3).forEach(g => {
        logger.info(`   ${g.awayTeam} (AWAY) ${g.awayScore} @ ${g.homeTeam} (HOME) ${g.homeScore}`);
      });
    }
    
    return parsedGames;
  } catch (error) {
    logger.error("Error fetching NCAA games:", error);
    return [];
  }
}

/**
 * Normalize team name for matching
 */
function normalizeTeamName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/state$/i, 'st')
    .replace(/university$/i, '');
}

/**
 * Scheduled function: Grade basketball bets every 4 hours
 * Checks NCAA API for completed games and updates Firebase
 */
exports.updateBasketballBetResults = onSchedule({
  schedule: "0 */4 * * *", // Every 4 hours
  timeZone: "America/New_York",
  memory: "256MiB",
  timeoutSeconds: 120,
}, async () => {
  logger.info("Starting basketball bet grading...");

  try {
    // 1. Fetch pending basketball bets from Firestore
    const betsSnapshot = await admin.firestore()
      .collection("basketball_bets")
      .get(); // Get all bets, filter for pending/ungraded

    if (betsSnapshot.empty) {
      logger.info("No basketball bets found");
      return null;
    }

    logger.info(`Found ${betsSnapshot.size} total basketball bets`);

    // Filter for ungraded bets (no result.outcome field or status PENDING)
    const ungradedBets = betsSnapshot.docs.filter(doc => {
      const bet = doc.data();
      return !bet.result?.outcome || bet.status === 'PENDING';
    });

    if (ungradedBets.length === 0) {
      logger.info("No ungraded basketball bets");
      return null;
    }

    logger.info(`Found ${ungradedBets.length} ungraded basketball bets`);

    // 2. Group bets by date to minimize API calls
    const betsByDate = {};
    ungradedBets.forEach(betDoc => {
      const bet = betDoc.data();
      const date = bet.date;
      if (!betsByDate[date]) {
        betsByDate[date] = [];
      }
      betsByDate[date].push({ id: betDoc.id, ...bet });
    });

    logger.info(`Bets span ${Object.keys(betsByDate).length} dates`);

    let updatedCount = 0;
    let notFoundCount = 0;

    // 3. Process each date
    for (const [date, bets] of Object.entries(betsByDate)) {
      logger.info(`Processing ${bets.length} bets for ${date}`);
      
      const ncaaGames = await fetchNCAAGames(date);
      const finalGames = ncaaGames.filter(g => g.isFinal);
      
      logger.info(`Found ${finalGames.length} final games for ${date}`);

      // 4. Match and grade each bet
      for (const bet of bets) {
        // Find matching game using fuzzy team name matching
        // IMPORTANT: Handle BOTH normal and REVERSED home/away matchups!
        let matchingGame = null;
        let isReversed = false;
        
        for (const g of finalGames) {
          // ROBUSTNESS: Validate game has required fields
          if (!g.awayTeam || !g.homeTeam || g.awayScore === undefined || g.homeScore === undefined) {
            logger.warn(`⚠️ NCAA game missing required fields:`, g);
            continue;
          }
          
          const normBetAway = normalizeTeamName(bet.game.awayTeam);
          const normBetHome = normalizeTeamName(bet.game.homeTeam);
          const normGameAway = normalizeTeamName(g.awayTeam);
          const normGameHome = normalizeTeamName(g.homeTeam);
          
          // Strategy 1: Normal match (away->away, home->home)
          const normalMatch = 
            (normGameAway.includes(normBetAway) || normBetAway.includes(normGameAway)) &&
            (normGameHome.includes(normBetHome) || normBetHome.includes(normGameHome));
          
          // Strategy 2: Reversed match (away->home, home->away)
          const reversedMatch = 
            (normGameAway.includes(normBetHome) || normBetHome.includes(normGameAway)) &&
            (normGameHome.includes(normBetAway) || normBetAway.includes(normGameHome));
          
          if (normalMatch) {
            matchingGame = g;
            isReversed = false;
            logger.info(`✅ MATCH (NORMAL): Bet "${bet.game.awayTeam} @ ${bet.game.homeTeam}" ↔ NCAA "${g.awayTeam} @ ${g.homeTeam}"`);
            break;
          } else if (reversedMatch) {
            matchingGame = g;
            isReversed = true;
            logger.warn(`⚠️ MATCH (REVERSED): Bet "${bet.game.awayTeam} @ ${bet.game.homeTeam}" ↔ NCAA "${g.awayTeam} @ ${g.homeTeam}"`);
            logger.warn(`   Home/away are SWAPPED between our bet and NCAA API!`);
            break;
          }
        }

        if (!matchingGame) {
          notFoundCount++;
          logger.info(`❌ No final game found for: ${bet.game.awayTeam} @ ${bet.game.homeTeam}`);
          logger.info(`   Normalized bet: ${normalizeTeamName(bet.game.awayTeam)} @ ${normalizeTeamName(bet.game.homeTeam)}`);
          logger.info(`   Available final games (${finalGames.length}): ${finalGames.slice(0, 5).map(g => `${g.awayTeam} @ ${g.homeTeam}`).join(', ')}`);
          continue;
        }

        // CRITICAL: If reversed, we need to swap the scores when storing to bet
        let betAwayScore, betHomeScore;
        if (isReversed) {
          // NCAA has them backwards from our bet
          betAwayScore = matchingGame.homeScore; // NCAA home = our away
          betHomeScore = matchingGame.awayScore; // NCAA away = our home
          logger.warn(`   REVERSING SCORES: NCAA(${matchingGame.awayScore}-${matchingGame.homeScore}) → Bet(${betAwayScore}-${betHomeScore})`);
        } else {
          betAwayScore = matchingGame.awayScore;
          betHomeScore = matchingGame.homeScore;
        }

        logger.info(
          `📊 Grading bet ${bet.id}: ${bet.bet.pick} for ${bet.game.awayTeam} @ ${bet.game.homeTeam}`
        );
        logger.info(
          `   NCAA Game: ${matchingGame.awayTeam}(${matchingGame.awayScore}) @ ${matchingGame.homeTeam}(${matchingGame.homeScore})${isReversed ? ' [REVERSED]' : ''}`
        );
        logger.info(
          `   Bet Scores: ${bet.game.awayTeam}(${betAwayScore}) @ ${bet.game.homeTeam}(${betHomeScore})`
        );

        // Calculate outcome (WIN/LOSS) using the CORRECTED scores
        const outcome = calculateOutcome(bet.game, betAwayScore, betHomeScore, bet.bet);
        
        // ✅ USE STORED KELLY UNITS from prediction
        const units = bet.prediction?.unitSize || 1.0;
        const profit = calculateProfit(outcome, bet.bet.odds, units);

        logger.info(
          `   RESULT: ${bet.bet.pick} → ${outcome} (${profit > 0 ? "+" : ""}${profit.toFixed(2)}u on ${units}u risked)`
        );

        // Update bet in Firestore with CORRECTED scores
        await admin.firestore()
          .collection("basketball_bets")
          .doc(bet.id)
          .update({
            "result.awayScore": betAwayScore, // CORRECTED for reversal
            "result.homeScore": betHomeScore, // CORRECTED for reversal
            "result.totalScore": betAwayScore + betHomeScore,
            "result.winner": betAwayScore > betHomeScore ? bet.game.awayTeam : bet.game.homeTeam,
            "result.outcome": outcome,
            "result.profit": profit,
            "result.units": units, // ✅ Store units risked
            "result.fetched": true,
            "result.fetchedAt": admin.firestore.FieldValue.serverTimestamp(),
            "result.source": "NCAA_API",
            "result.isReversed": isReversed, // Track if reversal occurred
            "status": "COMPLETED",
          });

        updatedCount++;
        logger.info(
          `✅ Graded ${bet.id}: ${outcome} → ${profit > 0 ? "+" : ""}${profit.toFixed(2)}u`
        );
      }
    }

    logger.info(`Finished: Graded ${updatedCount} bets, ${notFoundCount} games not final yet`);
    return null;
  } catch (error) {
    logger.error("Error grading basketball bets:", error);
    return null;
  }
});

/**
 * Manual trigger endpoint for testing
 * URL: https://us-central1-nhl-savant.cloudfunctions.net/triggerBasketballBetGrading
 */
exports.triggerBasketballBetGrading = onRequest(async (request, response) => {
  logger.info("Manual basketball bet grading triggered");

  try {
    await exports.updateBasketballBetResults.run({});
    response.send("Basketball bets graded successfully!");
  } catch (error) {
    logger.error("Error in manual trigger:", error);
    response.status(500).send("Error grading basketball bets");
  }
});

/**
 * Helper: Calculate outcome (WIN/LOSS)
 * 
 * @param {object} betGameInfo - Bet game info with awayTeam, homeTeam
 * @param {number} awayScore - Final away score (CORRECTED for reversal)
 * @param {number} homeScore - Final home score (CORRECTED for reversal)
 * @param {object} bet - Bet object with pick and team
 * @returns {string} - 'WIN' or 'LOSS'
 */
function calculateOutcome(betGameInfo, awayScore, homeScore, bet) {
  // ROBUSTNESS: Validate scores
  if (typeof awayScore !== 'number' || typeof homeScore !== 'number') {
    logger.error(`❌ Invalid scores in calculateOutcome: away=${awayScore}, home=${homeScore}`);
    return "LOSS";
  }
  
  // Determine which team we bet on
  const betTeam = bet.team || bet.pick;
  const normBetTeam = normalizeTeamName(betTeam);
  const normAwayTeam = normalizeTeamName(betGameInfo.awayTeam);
  const normHomeTeam = normalizeTeamName(betGameInfo.homeTeam);
  
  logger.info(`   🎯 OUTCOME CALCULATION:`);
  logger.info(`      Bet on: "${betTeam}" (normalized: "${normBetTeam}")`);
  logger.info(`      Away: "${betGameInfo.awayTeam}" (${awayScore}, normalized: "${normAwayTeam}")`);
  logger.info(`      Home: "${betGameInfo.homeTeam}" (${homeScore}, normalized: "${normHomeTeam}")`);
  
  // Check if our bet team matches away or home (using fuzzy matching)
  const isAway = normBetTeam.includes(normAwayTeam) || normAwayTeam.includes(normBetTeam);
  const isHome = normBetTeam.includes(normHomeTeam) || normHomeTeam.includes(normBetTeam);
  
  if (!isAway && !isHome) {
    logger.error(`❌ Cannot determine which team was bet on: ${betTeam} vs ${betGameInfo.awayTeam} @ ${betGameInfo.homeTeam}`);
    return "LOSS"; // Default to LOSS if we can't match
  }
  
  logger.info(`      Bet matched to: ${isAway ? 'AWAY' : 'HOME'} team`);
  
  // Determine actual winner based on score
  const awayWon = awayScore > homeScore;
  const homeWon = homeScore > awayScore;
  const tie = awayScore === homeScore;
  
  if (tie) {
    logger.warn(`⚠️ Game ended in a tie: ${awayScore}-${homeScore}`);
    return "PUSH";
  }
  
  logger.info(`      Actual winner: ${awayWon ? 'AWAY' : 'HOME'} (${awayScore}-${homeScore})`);
  
  // If we bet on away team and away won, OR we bet on home team and home won -> WIN
  if ((isAway && awayWon) || (isHome && homeWon)) {
    logger.info(`      ✅ BET WON: Our team (${betTeam}) won!`);
    return "WIN";
  } else {
    logger.info(`      ❌ BET LOST: Our team (${betTeam}) lost`);
    return "LOSS";
  }
}

/**
 * Helper: Calculate profit based on units risked
 * 
 * @param {string} outcome - 'WIN', 'LOSS', or 'PUSH'
 * @param {number} odds - American odds (e.g. -110, +150)
 * @param {number} units - Units risked (default 1.0)
 * @returns {number} - Profit in units
 */
function calculateProfit(outcome, odds, units = 1.0) {
  // ROBUSTNESS: Validate inputs
  if (!outcome || typeof odds !== 'number') {
    logger.error(`❌ Invalid profit calculation: outcome="${outcome}", odds=${odds}`);
    return -units;
  }
  
  if (outcome === "LOSS") return -units;
  if (outcome === "PUSH") return 0;

  // WIN - Calculate profit based on actual units risked
  if (odds < 0) {
    // Negative odds: Risk |odds| to win 100
    // Profit per unit = 100 / |odds|
    const profitPerUnit = 100 / Math.abs(odds);
    return units * profitPerUnit;
  } else if (odds > 0) {
    // Positive odds: Risk 100 to win odds
    // Profit per unit = odds / 100
    const profitPerUnit = odds / 100;
    return units * profitPerUnit;
  } else {
    logger.error(`❌ Invalid odds: ${odds}`);
    return -units;
  }
}

