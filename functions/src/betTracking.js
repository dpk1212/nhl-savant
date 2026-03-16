/**
 * NHL Savant - Bet Tracking Functions
 * Updates bet results with game outcomes
 * Also grades Sharp Flow locked picks
 */

const {onSchedule} = require("firebase-functions/v2/scheduler");
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

const ABBREV_MAP = {
  bos: "BOS", tor: "TOR", mtl: "MTL", ott: "OTT", buf: "BUF", det: "DET",
  tbl: "TBL", fla: "FLA", car: "CAR", wsh: "WSH", pit: "PIT", phi: "PHI",
  njd: "NJD", cbj: "CBJ", nsh: "NSH", wpg: "WPG", chi: "CHI", min: "MIN",
  dal: "DAL", stl: "STL", col: "COL", uta: "UTA", vgk: "VGK", lak: "LAK",
  ana: "ANA", sjs: "SJS", cgy: "CGY", edm: "EDM", van: "VAN", sea: "SEA",
  nyr: "NYR", nyi: "NYI",
};

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

    // ─── Grade Sharp Flow Locked Picks ─────────────────────────────────
    try {
      const sfSnapshot = await admin.firestore()
          .collection("sharpFlowPicks")
          .where("status", "==", "PENDING")
          .get();

      if (!sfSnapshot.empty) {
        logger.info(`Found ${sfSnapshot.size} pending Sharp Flow picks`);
        let sfGraded = 0;

        for (const sfDoc of sfSnapshot.docs) {
          const pick = sfDoc.data();
          if (pick.sport !== "NHL") continue;

          const parts = (pick.gameKey || "").split("_");
          if (parts.length !== 2) continue;
          const awayAbbrev = ABBREV_MAP[parts[0]] || parts[0].toUpperCase();
          const homeAbbrev = ABBREV_MAP[parts[1]] || parts[1].toUpperCase();

          const matchingGame = finalGames.find((g) =>
            g.awayTeam === awayAbbrev && g.homeTeam === homeAbbrev,
          );

          if (!matchingGame) continue;

          const side = pick.consensusSide === "away" ? "AWAY" : "HOME";
          const outcome = calculateOutcome(matchingGame, {
            market: "MONEYLINE",
            side: side,
          });
          const units = pick.units || 1;
          const profit = calculateProfit(outcome, pick.odds, units);

          await sfDoc.ref.update({
            "result.outcome": outcome,
            "result.awayScore": matchingGame.awayScore,
            "result.homeScore": matchingGame.homeScore,
            "result.winner": matchingGame.awayScore > matchingGame.homeScore ? "away" : "home",
            "result.profit": parseFloat(profit.toFixed(2)),
            "result.gradedAt": admin.firestore.FieldValue.serverTimestamp(),
            "status": "COMPLETED",
          });

          sfGraded++;
          logger.info(`🔒 Sharp Flow: ${pick.consensusTeam} ML ${pick.odds} → ${outcome} (${profit >= 0 ? "+" : ""}${profit.toFixed(2)}u)`);
        }

        logger.info(`Sharp Flow: Graded ${sfGraded} picks`);
      }
    } catch (sfError) {
      logger.error("Error grading Sharp Flow picks:", sfError);
    }

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

