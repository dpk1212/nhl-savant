/**
 * NHL Savant - Live Scores Functions
 * Automatically fetches and updates live NHL scores
 */

const {onSchedule} = require("firebase-functions/v2/scheduler");
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

/**
 * Scheduled function: Updates live NHL scores every 5 minutes
 */
exports.updateLiveScores = onSchedule({
  schedule: "every 5 minutes",
  timeZone: "America/New_York",
  memory: "256MiB",
  timeoutSeconds: 60,
  maxInstances: 10,
}, async () => {
  logger.info("Starting live scores update...");

  try {
    const now = new Date();
    
    const etTime = now.toLocaleString('en-US', {
      timeZone: 'America/New_York',
      hour: 'numeric',
      hour12: false
    });
    const etHour = parseInt(etTime);
    
    const etDateStr = now.toLocaleString('en-US', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const [month, day, year] = etDateStr.split('/');
    let dateStr = `${year}-${month}-${day}`;
    
    if (etHour < 6) {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayET = yesterday.toLocaleString('en-US', {
        timeZone: 'America/New_York',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      const [yMonth, yDay, yYear] = yesterdayET.split('/');
      dateStr = `${yYear}-${yMonth}-${yDay}`;
      logger.info(`Before 6 AM ET, fetching yesterday's games (${dateStr})`);
    }

    const url = `https://api-web.nhle.com/v1/schedule/${dateStr}`;
    logger.info(`Fetching scores for ${dateStr} (ET) from NHL API`);

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
      venue: game.venue?.default || "",
      periodType: game.periodDescriptor?.periodType || "REG",
      winningGoalie: game.winningGoalie ? 
        `${game.winningGoalie.firstInitial?.default || ""} ${game.winningGoalie.lastName?.default || ""}`.trim() : null,
      winningGoalScorer: game.winningGoalScorer ? 
        `${game.winningGoalScorer.firstInitial?.default || ""} ${game.winningGoalScorer.lastName?.default || ""}`.trim() : null,
    }));

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
 * Manual trigger endpoint
 */
exports.triggerScoreUpdate = onRequest(async (request, response) => {
  logger.info("Manual score update triggered");

  try {
    await exports.updateLiveScores.run({});
    response.send("Live scores updated successfully!");
  } catch (error) {
    logger.error("Error in manual trigger:", error);
    response.status(500).send("Error updating scores");
  }
});

