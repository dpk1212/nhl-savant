/**
 * Basketball Bet Grading - Firebase Cloud Functions
 * 
 * Automatically grades basketball bets using ESPN's unofficial API
 * Runs every 15 minutes to check for completed games
 */

const { onSchedule, onRequest } = require("firebase-functions/v2/scheduler");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");

/**
 * Scheduled function: Grade basketball bets every 15 minutes
 * Checks ESPN API for completed games and updates Firebase
 */
exports.updateBasketballBetResults = onSchedule({
  schedule: "*/15 * * * *", // Every 15 minutes
  timeZone: "America/New_York",
  memory: "256MiB",
  timeoutSeconds: 120,
}, async () => {
  logger.info("Starting basketball bet grading...");

  try {
    // 1. Fetch pending basketball bets from Firestore
    const betsSnapshot = await admin.firestore()
      .collection("basketball_bets")
      .where("status", "==", "PENDING")
      .get();

    if (betsSnapshot.empty) {
      logger.info("No pending basketball bets");
      return null;
    }

    logger.info(`Found ${betsSnapshot.size} pending basketball bets`);

    // 2. Fetch live scores from ESPN API (unofficial but free)
    logger.info("Fetching scores from ESPN API...");
    const espnResponse = await fetch(
      "https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard"
    );
    
    if (!espnResponse.ok) {
      logger.error(`ESPN API error: ${espnResponse.status} ${espnResponse.statusText}`);
      return null;
    }
    
    const espnData = await espnResponse.json();

    // 3. Parse final games only (status.type.state === 'post')
    const finalGames = espnData.events
      ?.filter((event) => event.status.type.state === "post")
      .map((event) => {
        const competitors = event.competitions[0].competitors;
        const awayTeam = competitors.find((c) => c.homeAway === "away");
        const homeTeam = competitors.find((c) => c.homeAway === "home");

        return {
          awayTeam: awayTeam.team.displayName,
          homeTeam: homeTeam.team.displayName,
          awayScore: parseInt(awayTeam.score || 0),
          homeScore: parseInt(homeTeam.score || 0),
          totalScore: parseInt(awayTeam.score || 0) + parseInt(homeTeam.score || 0),
        };
      }) || [];

    if (finalGames.length === 0) {
      logger.info("No final basketball games found on ESPN");
      return null;
    }

    logger.info(`Found ${finalGames.length} final basketball games`);

    let updatedCount = 0;
    let notFoundCount = 0;

    // 4. Match bets to final games and grade them
    for (const betDoc of betsSnapshot.docs) {
      const bet = betDoc.data();
      const betId = betDoc.id;

      // Find matching game (with fuzzy matching for team names)
      // ESPN team names may differ slightly from our data sources
      const matchingGame = finalGames.find((g) => {
        const awayMatch = 
          g.awayTeam.toLowerCase().includes(bet.game.awayTeam.toLowerCase()) ||
          bet.game.awayTeam.toLowerCase().includes(g.awayTeam.toLowerCase());
        const homeMatch = 
          g.homeTeam.toLowerCase().includes(bet.game.homeTeam.toLowerCase()) ||
          bet.game.homeTeam.toLowerCase().includes(g.homeTeam.toLowerCase());
        return awayMatch && homeMatch;
      });

      if (!matchingGame) {
        notFoundCount++;
        continue; // Game not final yet or not found
      }

      logger.info(
        `Grading bet ${betId}: ${bet.bet.pick} for ${matchingGame.awayTeam} @ ${matchingGame.homeTeam} (${matchingGame.awayScore}-${matchingGame.homeScore})`
      );

      // Calculate outcome (WIN/LOSS)
      const outcome = calculateOutcome(matchingGame, bet.bet);
      const profit = calculateProfit(outcome, bet.bet.odds);

      // Update bet in Firestore
      await admin.firestore()
        .collection("basketball_bets")
        .doc(betId)
        .update({
          "result.awayScore": matchingGame.awayScore,
          "result.homeScore": matchingGame.homeScore,
          "result.totalScore": matchingGame.totalScore,
          "result.winner": matchingGame.awayScore > matchingGame.homeScore ? "AWAY" : "HOME",
          "result.outcome": outcome,
          "result.profit": profit,
          "result.fetched": true,
          "result.fetchedAt": admin.firestore.FieldValue.serverTimestamp(),
          "result.source": "ESPN_API",
          "status": "COMPLETED",
        });

      updatedCount++;
      logger.info(
        `✅ Graded ${betId}: ${outcome} → ${profit > 0 ? "+" : ""}${profit.toFixed(2)}u`
      );
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
  // Determine if we bet on away or home team
  const betTeam = bet.team || bet.pick;
  const isAway = 
    betTeam.toLowerCase().includes(game.awayTeam.toLowerCase()) ||
    game.awayTeam.toLowerCase().includes(betTeam.toLowerCase());
  
  // Determine actual winner
  const actualWinner = game.awayScore > game.homeScore ? "AWAY" : "HOME";
  const predictedWinner = isAway ? "AWAY" : "HOME";

  return actualWinner === predictedWinner ? "WIN" : "LOSS";
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

