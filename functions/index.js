/**
 * NHL Savant - Firebase Cloud Functions
 *
 * Automatically fetches and updates live NHL scores every 5 minutes
 */

const {setGlobalOptions} = require("firebase-functions");
const {onSchedule} = require("firebase-functions/v2/scheduler");
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

// Initialize Firebase Admin
admin.initializeApp();

// For cost control
setGlobalOptions({maxInstances: 10});

/**
 * Scheduled function: Updates live NHL scores every 5 minutes
 *
 * Runs: Every 5 minutes during game hours (6 PM - 2 AM ET)
 * Cost: ~300 invocations/day = ~9000/month (well under 2M free tier)
 */
exports.updateLiveScores = onSchedule({
  schedule: "every 5 minutes",
  timeZone: "America/New_York",
  memory: "256MiB",
  timeoutSeconds: 60,
}, async () => {
  logger.info("Starting live scores update...");

  try {
    // Get today's date (or yesterday if before 6 AM)
    const now = new Date();
    const hour = now.getHours();
    const dateToFetch = new Date(now);

    if (hour < 6) {
      // Before 6 AM, fetch yesterday's games
      dateToFetch.setDate(dateToFetch.getDate() - 1);
      logger.info("Before 6 AM, fetching yesterday's games");
    }

    const dateStr = dateToFetch.toISOString().split("T")[0];
    const url = `https://api-web.nhle.com/v1/schedule/${dateStr}`;

    logger.info(`Fetching scores for ${dateStr} from NHL API`);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`NHL API returned ${response.status}`);
    }

    const data = await response.json();
    const gameWeek = data.gameWeek || [];

    if (gameWeek.length === 0) {
      logger.info("No games found for this date");
      return null;
    }

    const games = gameWeek[0]?.games || [];
          const processedGames = games.map((game) => ({
            gameId: game.id,
            date: dateStr,
            awayTeam: game.awayTeam.abbrev,
            homeTeam: game.homeTeam.abbrev,
            awayScore: game.awayTeam.score || 0,
            homeScore: game.homeTeam.score || 0,
            totalScore: (game.awayTeam.score || 0) + (game.homeTeam.score || 0),
            gameState: game.gameState || "FUT",
            status: ["OFF", "FINAL"].includes(game.gameState) ? "FINAL" :
                    game.gameState === "LIVE" ? "LIVE" : "SCHEDULED",
            period: game.period || 0,
            clock: game.clock?.timeRemaining || "",
            gameTime: game.startTimeUTC || "",
            // Premium data points
            venue: game.venue?.default || "",
            periodType: game.periodDescriptor?.periodType || "REG",
            winningGoalie: game.winningGoalie ? 
              `${game.winningGoalie.firstInitial?.default || ""} ${game.winningGoalie.lastName?.default || ""}`.trim() : null,
            winningGoalScorer: game.winningGoalScorer ? 
              `${game.winningGoalScorer.firstInitial?.default || ""} ${game.winningGoalScorer.lastName?.default || ""}`.trim() : null,
          }));

    // Save to Firestore
    await admin.firestore()
        .collection("live_scores")
        .doc("current")
        .set({
          games: processedGames,
          lastUpdate: admin.firestore.FieldValue.serverTimestamp(),
          date: dateStr,
          gamesCount: processedGames.length,
        });

    logger.info(`Updated ${processedGames.length} games in Firestore`);
    return null;
  } catch (error) {
    logger.error("Error updating scores:", error);
    return null;
  }
});

/**
 * Manual trigger endpoint for testing
 * Call: https://us-central1-YOUR_PROJECT.cloudfunctions.net/triggerScoreUpdate
 */
exports.triggerScoreUpdate = onRequest(async (request, response) => {
  logger.info("Manual score update triggered");

  try {
    // Trigger the scheduled function logic
    await exports.updateLiveScores.run({});
    response.send("Live scores updated successfully!");
  } catch (error) {
    logger.error("Error in manual trigger:", error);
    response.status(500).send("Error updating scores");
  }
});
