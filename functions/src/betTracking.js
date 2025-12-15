/**
 * NHL Savant - Bet Tracking Functions
 * Updates bet results with game outcomes
 */

const {onSchedule} = require("firebase-functions/v2/scheduler");
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

/**
 * Scheduled function: Updates bet results with game outcomes
 */
exports.updateBetResults = onSchedule({
  schedule: "every 10 minutes",
  timeZone: "America/New_York",
  memory: "256MiB",
  timeoutSeconds: 120,
  maxInstances: 10,
}, async () => {
  logger.info("Starting bet result update...");

  try {
    const betsSnapshot = await admin.firestore()
        .collection("bets")
        .where("status", "==", "PENDING")
        .get();

    if (betsSnapshot.empty) {
      logger.info("No pending bets to update");
      return null;
    }

    logger.info(`Found ${betsSnapshot.size} pending bets`);

    const liveScoresDoc = await admin.firestore()
        .collection("live_scores")
        .doc("current")
        .get();

    const liveGames = liveScoresDoc.data()?.games || [];
    const finalGames = liveGames.filter((g) => g.status === "FINAL");
    logger.info(`Found ${finalGames.length} FINAL games`);

    if (finalGames.length === 0) {
      logger.info("No final games yet");
      return null;
    }

    let updatedCount = 0;

    for (const betDoc of betsSnapshot.docs) {
      const bet = betDoc.data();
      const betId = betDoc.id;

      const matchingGame = finalGames.find((g) =>
        g.awayTeam === bet.game.awayTeam && g.homeTeam === bet.game.homeTeam
      );

      if (!matchingGame) {
        continue;
      }

      logger.info(`Updating bet ${betId}: ${bet.bet.pick} for ${matchingGame.awayTeam} @ ${matchingGame.homeTeam} (${matchingGame.awayScore}-${matchingGame.homeScore})`);

      const outcome = calculateOutcome(matchingGame, bet.bet);
      // Use actual dynamic units from the bet (priority), then recommendedUnit, then fallback to 1
      const units = bet.prediction?.dynamicUnits || bet.prediction?.recommendedUnit || 1;
      const profit = calculateProfit(outcome, bet.bet.odds, units);

      await admin.firestore()
          .collection("bets")
          .doc(betId)
          .update({
            "result.awayScore": matchingGame.awayScore,
            "result.homeScore": matchingGame.homeScore,
            "result.totalScore": matchingGame.totalScore,
            "result.winner": matchingGame.awayScore > matchingGame.homeScore ? "AWAY" : "HOME",
            "result.outcome": outcome,
            "result.profit": profit,
            "result.units": units,  // Store actual units used for grading
            "result.fetched": true,
            "result.fetchedAt": admin.firestore.FieldValue.serverTimestamp(),
            "result.source": "NHL_API",
            "result.periodType": matchingGame.periodType || "REG",
            "status": "COMPLETED",
          });

      updatedCount++;
      logger.info(`✅ Updated ${betId}: ${outcome} @ ${units}u → ${profit > 0 ? "+" : ""}${profit.toFixed(2)}u`);
    }

    logger.info(`Finished: Updated ${updatedCount} bets`);
    return null;
  } catch (error) {
    logger.error("Error updating bet results:", error);
    return null;
  }
});

/**
 * Manual trigger endpoint
 */
exports.triggerBetUpdate = onRequest(async (request, response) => {
  logger.info("Manual bet update triggered");

  try {
    await exports.updateBetResults.run({});
    response.send("Bet results updated successfully!");
  } catch (error) {
    logger.error("Error in manual bet trigger:", error);
    response.status(500).send("Error updating bet results");
  }
});

/**
 * Helper: Calculate outcome (WIN/LOSS/PUSH)
 */
function calculateOutcome(game, bet) {
  const totalScore = game.awayScore + game.homeScore;
  const awayWin = game.awayScore > game.homeScore;
  const homeWin = game.homeScore > game.awayScore;

  switch (bet.market) {
    case "TOTAL":
      if (bet.side === "OVER") {
        if (totalScore > bet.line) return "WIN";
        if (totalScore < bet.line) return "LOSS";
        return "PUSH";
      } else {
        if (totalScore < bet.line) return "WIN";
        if (totalScore > bet.line) return "LOSS";
        return "PUSH";
      }

    case "MONEYLINE":
      if (bet.side === "HOME") {
        return homeWin ? "WIN" : "LOSS";
      } else {
        return awayWin ? "WIN" : "LOSS";
      }

    case "PUCK_LINE":
    case "PUCKLINE":
      const spread = bet.line || 1.5;
      if (bet.side === "HOME") {
        const homeSpread = game.homeScore - game.awayScore;
        if (homeSpread > spread) return "WIN";
        if (homeSpread < spread) return "LOSS";
        return "PUSH";
      } else {
        const awaySpread = game.awayScore - game.homeScore;
        if (awaySpread > spread) return "WIN";
        if (awaySpread < spread) return "LOSS";
        return "PUSH";
      }

    default:
      logger.warn(`Unknown market type: ${bet.market}`);
      return null;
  }
}

/**
 * Helper: Calculate profit in units
 * @param {string} outcome - WIN, LOSS, or PUSH
 * @param {number} odds - American odds
 * @param {number} units - Actual units staked (from dynamicUnits)
 */
function calculateProfit(outcome, odds, units = 1) {
  if (outcome === "PUSH") return 0;
  if (outcome === "LOSS") return -units;  // Lose actual units staked

  // WIN: Calculate profit based on actual units staked
  if (odds < 0) {
    // Favorite: profit = units * (100 / |odds|)
    return units * (100 / Math.abs(odds));
  } else {
    // Underdog: profit = units * (odds / 100)
    return units * (odds / 100);
  }
}

