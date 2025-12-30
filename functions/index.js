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
    // CRITICAL FIX: Use ET timezone for date calculation
    // NHL operates on Eastern Time, so we need to use ET for consistency
    const now = new Date();
    
    // Convert to ET and extract hour
    const etTime = now.toLocaleString('en-US', {
      timeZone: 'America/New_York',
      hour: 'numeric',
      hour12: false
    });
    const etHour = parseInt(etTime);
    
    // Get ET date
    const etDateStr = now.toLocaleString('en-US', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const [month, day, year] = etDateStr.split('/');
    let dateStr = `${year}-${month}-${day}`;
    
    // If before 6 AM ET, fetch yesterday's games
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

/**
 * Scheduled function: Updates bet results with game outcomes
 *
 * Runs: Every 10 minutes
 * Purpose: Grade PENDING bets when games finish (FINAL status)
 */
exports.updateBetResults = onSchedule({
  schedule: "every 10 minutes",
  timeZone: "America/New_York",
  memory: "256MiB",
  timeoutSeconds: 120,
}, async () => {
  logger.info("Starting bet result update...");

  try {
    // Get all PENDING bets
    const betsSnapshot = await admin.firestore()
        .collection("bets")
        .where("status", "==", "PENDING")
        .get();

    if (betsSnapshot.empty) {
      logger.info("No pending bets to update");
      return null;
    }

    logger.info(`Found ${betsSnapshot.size} pending bets`);

    // Get current live scores
    const liveScoresDoc = await admin.firestore()
        .collection("live_scores")
        .doc("current")
        .get();

    const liveGames = liveScoresDoc.data()?.games || [];

    // Only process FINAL games
    const finalGames = liveGames.filter((g) => g.status === "FINAL");
    logger.info(`Found ${finalGames.length} FINAL games`);

    if (finalGames.length === 0) {
      logger.info("No final games yet");
      return null;
    }

    let updatedCount = 0;

    // Process each pending bet
    for (const betDoc of betsSnapshot.docs) {
      const bet = betDoc.data();
      const betId = betDoc.id;

      // Find matching final game
      const matchingGame = finalGames.find((g) =>
        g.awayTeam === bet.game.awayTeam && g.homeTeam === bet.game.homeTeam
      );

      if (!matchingGame) {
        continue; // Game not final yet
      }

      logger.info(`Updating bet ${betId}: ${bet.bet.pick} for ${matchingGame.awayTeam} @ ${matchingGame.homeTeam} (${matchingGame.awayScore}-${matchingGame.homeScore})`);

      // Calculate outcome
      const outcome = calculateOutcome(matchingGame, bet.bet);
      
      // 🎯 USE STORED DYNAMIC UNITS from when bet was written
      // Priority: prediction.dynamicUnits > fallback to 1.0u
      const units = bet.prediction?.dynamicUnits || 1.0;
      const profit = calculateProfit(outcome, bet.bet.odds, units);

      // Update bet in Firestore
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
            "result.unitsRisked": units, // Store units used for tracking
            "result.fetched": true,
            "result.fetchedAt": admin.firestore.FieldValue.serverTimestamp(),
            "result.source": "NHL_API",
            "result.periodType": matchingGame.periodType || "REG",
            "status": "COMPLETED",
          });

      updatedCount++;
      logger.info(`✅ Updated ${betId}: ${outcome} → ${profit > 0 ? "+" : ""}${profit.toFixed(2)}u (${units}u risked)`);
    }

    logger.info(`Finished: Updated ${updatedCount} bets`);
    return null;
  } catch (error) {
    logger.error("Error updating bet results:", error);
    return null;
  }
});

/**
 * Manual trigger endpoint for bet result updates
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
 * Helper: Calculate profit based on outcome, odds, and units risked
 * @param {string} outcome - WIN/LOSS/PUSH
 * @param {number} odds - American odds
 * @param {number} units - Units risked (default 1.0 for backwards compatibility)
 */
function calculateProfit(outcome, odds, units = 1.0) {
  if (outcome === "PUSH") return 0;
  if (outcome === "LOSS") return -units; // Lose the amount risked

  // WIN - profit based on odds and units risked
  if (odds < 0) {
    return units * (100 / Math.abs(odds)); // e.g., -110 with 1.5u → 1.36u profit
  } else {
    return units * (odds / 100); // e.g., +150 with 1.5u → 2.25u profit
  }
}

/**
 * TEST - Simple test function to verify Firebase detection
 */
exports.testBasketballDeploy = onRequest(async (request, response) => {
  response.send("Basketball functions are deploying!");
});

/**
 * NCAA API Proxy - Avoid CORS errors from frontend
 * GET /ncaaProxy?date=YYYYMMDD
 */
exports.ncaaProxy = onRequest({
  cors: true,
  memory: "256MiB",
  timeoutSeconds: 30,
}, async (request, response) => {
  try {
    const date = request.query.date;
    
    if (!date) {
      response.status(400).json({ error: "Missing date parameter (format: YYYYMMDD)" });
      return;
    }

    if (!/^\d{8}$/.test(date)) {
      response.status(400).json({ error: "Invalid date format. Use YYYYMMDD" });
      return;
    }

    logger.info(`Proxying NCAA API request for date: ${date}`);

    const url = `https://ncaa-api.henrygd.me/scoreboard/basketball-men/d1/${date}`;
    const ncaaResponse = await fetch(url);

    if (!ncaaResponse.ok) {
      logger.error(`NCAA API error: ${ncaaResponse.status}`);
      response.status(ncaaResponse.status).json({ error: "NCAA API error" });
      return;
    }

    const data = await ncaaResponse.json();
    logger.info(`Successfully fetched ${data.games?.length || 0} games for ${date}`);
    response.json(data);
  } catch (error) {
    logger.error("Error in NCAA proxy:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Basketball Bet Grading - Scheduled every 4 hours
 * Grades all ungraded basketball bets using NCAA API
 */
exports.updateBasketballBetResults = onSchedule({
  schedule: "0 */4 * * *",
  timeZone: "America/New_York",
  memory: "256MiB",
  timeoutSeconds: 120,
}, async () => {
  logger.info("Starting basketball bet grading...");

  try {
    const betsSnapshot = await admin.firestore().collection("basketball_bets").get();

    if (betsSnapshot.empty) {
      logger.info("No basketball bets found");
      return null;
    }

    logger.info(`Found ${betsSnapshot.size} total basketball bets`);

    const ungradedBets = betsSnapshot.docs.filter(doc => {
      const bet = doc.data();
      return !bet.result?.outcome || bet.status === 'PENDING';
    });

    if (ungradedBets.length === 0) {
      logger.info("No ungraded basketball bets");
      return null;
    }

    logger.info(`Found ${ungradedBets.length} ungraded basketball bets`);

    const betsByDate = {};
    ungradedBets.forEach(betDoc => {
      const bet = betDoc.data();
      const date = bet.date;
      if (!betsByDate[date]) betsByDate[date] = [];
      betsByDate[date].push({ id: betDoc.id, ...bet });
    });

    logger.info(`Bets span ${Object.keys(betsByDate).length} dates`);

    let updatedCount = 0;
    let notFoundCount = 0;

    for (const [date, bets] of Object.entries(betsByDate)) {
      logger.info(`Processing ${bets.length} bets for ${date}`);
      
      const formattedDate = date.replace(/-/g, '');
      const url = `https://ncaa-api.henrygd.me/scoreboard/basketball-men/d1/${formattedDate}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        logger.error(`NCAA API error for ${date}: ${response.status}`);
        continue;
      }
      
      const data = await response.json();
      const games = data.games || [];
      const finalGames = games.filter(g => g.game.gameState === 'final').map(g => ({
        awayTeam: g.game.away.names.short,
        homeTeam: g.game.home.names.short,
        awayScore: parseInt(g.game.away.score) || 0,
        homeScore: parseInt(g.game.home.score) || 0,
      }));
      
      logger.info(`Found ${finalGames.length} final games for ${date}`);

      for (const bet of bets) {
        const normalizeTeam = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/state$/i, 'st');
        
        const matchingGame = finalGames.find((g) => {
          const awayMatch = normalizeTeam(g.awayTeam).includes(normalizeTeam(bet.game.awayTeam)) ||
                          normalizeTeam(bet.game.awayTeam).includes(normalizeTeam(g.awayTeam));
          const homeMatch = normalizeTeam(g.homeTeam).includes(normalizeTeam(bet.game.homeTeam)) ||
                          normalizeTeam(bet.game.homeTeam).includes(normalizeTeam(g.homeTeam));
          return awayMatch && homeMatch;
        });

        if (!matchingGame) {
          notFoundCount++;
          continue;
        }

        const betTeam = bet.bet.team || bet.bet.pick;
        const isAway = normalizeTeam(betTeam).includes(normalizeTeam(matchingGame.awayTeam)) ||
                      normalizeTeam(matchingGame.awayTeam).includes(normalizeTeam(betTeam));
        const actualWinner = matchingGame.awayScore > matchingGame.homeScore ? "AWAY" : "HOME";
        const predictedWinner = isAway ? "AWAY" : "HOME";
        const outcome = actualWinner === predictedWinner ? "WIN" : "LOSS";
        
        const odds = bet.bet.odds;
        const profit = outcome === "LOSS" ? -1 : (odds < 0 ? 100 / Math.abs(odds) : odds / 100);

        await admin.firestore().collection("basketball_bets").doc(bet.id).update({
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
        logger.info(`✅ Graded ${bet.id}: ${outcome} → ${profit > 0 ? "+" : ""}${profit.toFixed(2)}u`);
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
 * Manual Basketball Bet Grading Trigger
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
