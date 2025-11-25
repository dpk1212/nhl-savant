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
    // Format: YYYYMMDD
    const formattedDate = dateStr.replace(/-/g, '');
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
    
    return games.map(g => ({
      awayTeam: g.game.away.names.short,
      homeTeam: g.game.home.names.short,
      awayScore: parseInt(g.game.away.score) || 0,
      homeScore: parseInt(g.game.home.score) || 0,
      gameState: g.game.gameState,
      isFinal: g.game.gameState === 'final',
    }));
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
        const matchingGame = finalGames.find((g) => {
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
          
          return normalMatch || reversedMatch;
        });

        if (!matchingGame) {
          notFoundCount++;
          logger.info(`No final game found for: ${bet.game.awayTeam} @ ${bet.game.homeTeam}`);
          continue;
        }

        logger.info(
          `Grading bet ${bet.id}: ${bet.bet.pick} for ${matchingGame.awayTeam} @ ${matchingGame.homeTeam} (${matchingGame.awayScore}-${matchingGame.homeScore})`
        );

        // Calculate outcome (WIN/LOSS)
        const outcome = calculateOutcome(matchingGame, bet.bet);
        const profit = calculateProfit(outcome, bet.bet.odds);

        // Update bet in Firestore
        await admin.firestore()
          .collection("basketball_bets")
          .doc(bet.id)
          .update({
            "result.awayScore": matchingGame.awayScore,
            "result.homeScore": matchingGame.homeScore,
            "result.totalScore": matchingGame.awayScore + matchingGame.homeScore,
            "result.winner": matchingGame.awayScore > matchingGame.homeScore ? bet.game.awayTeam : bet.game.homeTeam,
            "result.outcome": outcome,
            "result.profit": profit,
            "result.fetched": true,
            "result.fetchedAt": admin.firestore.FieldValue.serverTimestamp(),
            "result.source": "NCAA_API",
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
 * @param {object} game - Final game with awayScore, homeScore, awayTeam, homeTeam
 * @param {object} bet - Bet object with pick and team
 * @returns {string} - 'WIN' or 'LOSS'
 */
function calculateOutcome(game, bet) {
  // Determine which team we bet on
  const betTeam = bet.team || bet.pick;
  const normBetTeam = normalizeTeamName(betTeam);
  const normAwayTeam = normalizeTeamName(game.awayTeam);
  const normHomeTeam = normalizeTeamName(game.homeTeam);
  
  // Check if our bet team matches away or home (using fuzzy matching)
  const isAway = normBetTeam.includes(normAwayTeam) || normAwayTeam.includes(normBetTeam);
  const isHome = normBetTeam.includes(normHomeTeam) || normHomeTeam.includes(normBetTeam);
  
  if (!isAway && !isHome) {
    logger.warn(`Cannot determine which team was bet on: ${betTeam} vs ${game.awayTeam} @ ${game.homeTeam}`);
    return "LOSS"; // Default to LOSS if we can't match
  }
  
  // Determine actual winner based on score
  const awayWon = game.awayScore > game.homeScore;
  
  // If we bet on away team and away won, OR we bet on home team and home won -> WIN
  if ((isAway && awayWon) || (isHome && !awayWon)) {
    return "WIN";
  } else {
    return "LOSS";
  }
}

/**
 * Helper: Calculate profit (1 unit flat bet)
 * 
 * @param {string} outcome - 'WIN', 'LOSS', or 'PUSH'
 * @param {number} odds - American odds (e.g. -110, +150)
 * @returns {number} - Profit in units
 */
function calculateProfit(outcome, odds) {
  if (outcome === "LOSS") return -1;
  if (outcome === "PUSH") return 0;

  // WIN
  if (odds < 0) {
    // Negative odds: Risk |odds| to win 100
    // Profit = 100 / |odds|
    return 100 / Math.abs(odds);
  } else {
    // Positive odds: Risk 100 to win odds
    // Profit = odds / 100
    return odds / 100;
  }
}

