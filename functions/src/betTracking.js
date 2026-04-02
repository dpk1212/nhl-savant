/**
 * NHL Savant - Bet Tracking Functions
 * Updates bet results with game outcomes
 * Also grades Sharp Flow locked picks (NHL, CBB, MLB, NBA)
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

// ESPN abbreviation → our 3-letter MLB code
const ESPN_MLB_TO_CODE = {
  ARI: "ari", ATL: "atl", BAL: "bal", BOS: "bos", CHC: "chc", CWS: "cws",
  CIN: "cin", CLE: "cle", COL: "col", DET: "det", HOU: "hou", KC: "kcr",
  LAA: "laa", LAD: "lad", MIA: "mia", MIL: "mil", MIN: "min", NYM: "nym",
  NYY: "nyy", OAK: "oak", PHI: "phi", PIT: "pit", SD: "sdp", SF: "sfg",
  SEA: "sea", STL: "stl", TB: "tbr", TEX: "tex", TOR: "tor", WSH: "wsh",
};

// ESPN abbreviation → our 3-letter NBA code
const ESPN_NBA_TO_CODE = {
  ATL: "atl", BOS: "bos", BKN: "bkn", CHA: "cha", CHI: "chi", CLE: "cle",
  DAL: "dal", DEN: "den", DET: "det", GS: "gsw", HOU: "hou", IND: "ind",
  LAC: "lac", LAL: "lal", MEM: "mem", MIA: "mia", MIL: "mil", MIN: "min",
  NO: "nop", NY: "nyk", NYK: "nyk", OKC: "okc", ORL: "orl", PHI: "phi",
  PHX: "phx", POR: "por", SAC: "sac", SA: "sas", SAS: "sas", TOR: "tor",
  UTAH: "uth", UTA: "uth", WAS: "was", WSH: "was",
  GSW: "gsw", NOP: "nop",
};

const NCAA_API_URL = "https://ncaa-api.henrygd.me/scoreboard/basketball-men/d1";
const ESPN_MLB_URL = "https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard";
const ESPN_NBA_URL = "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard";

function impliedProbability(american) {
  if (!american || american === 0) return null;
  return american < 0
    ? Math.abs(american) / (Math.abs(american) + 100)
    : 100 / (american + 100);
}

function normalizeName(s) {
  return (s || "").toLowerCase()
      .replace(/\(.*?\)/g, "")
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\bsaint\b/g, "st")
      .replace(/\bstate\b/g, "st")
      .replace(/\bnc\b/g, "northcarolina")
      .replace(/\buconn\b/g, "connecticut")
      .replace(/\bole miss\b/g, "mississippi")
      .replace(/\bsmu\b/g, "southernmethodist")
      .replace(/\busc\b/g, "southerncalifornia")
      .replace(/\bucf\b/g, "centralflorida")
      .replace(/\btcu\b/g, "texaschristian")
      .replace(/\bbyu\b/g, "brighamyoung")
      .replace(/\blsu\b/g, "louisianast")
      .replace(/\bvcu\b/g, "virginiacommonwealth")
      .replace(/\s+/g, "")
      .trim();
}

function teamNamesMatch(a, b) {
  const na = normalizeName(a);
  const nb = normalizeName(b);
  if (!na || !nb) return false;
  if (na === nb) return true;
  const shorter = na.length <= nb.length ? na : nb;
  const longer = na.length <= nb.length ? nb : na;
  if (shorter.length >= 4 && longer.startsWith(shorter)) return true;
  if (shorter.length >= 5 && longer.includes(shorter)) {
    const ratio = shorter.length / longer.length;
    if (ratio >= 0.4) return true;
  }
  return false;
}

async function fetchNCAAFinalGames(dateStr) {
  try {
    const formatted = dateStr.replace(/-/g, "/");
    const res = await fetch(`${NCAA_API_URL}/${formatted}`);
    if (!res.ok) { logger.warn(`NCAA API ${res.status}`); return []; }
    const data = await res.json();
    return (data.games || [])
        .filter((g) => g.game?.gameState === "final")
        .map((g) => ({
          awayTeam: g.game.away?.names?.short || "",
          homeTeam: g.game.home?.names?.short || "",
          awayScore: parseInt(g.game.away?.score) || 0,
          homeScore: parseInt(g.game.home?.score) || 0,
        }));
  } catch (e) {
    logger.error("NCAA fetch error:", e.message);
    return [];
  }
}

async function fetchMLBFinalGames() {
  try {
    const res = await fetch(ESPN_MLB_URL);
    if (!res.ok) { logger.warn(`ESPN MLB API ${res.status}`); return []; }
    const data = await res.json();
    return (data.events || [])
        .filter((e) => {
          const st = e.competitions?.[0]?.status?.type;
          return st?.state === "post" || st?.completed;
        })
        .map((e) => {
          const comp = e.competitions[0];
          const comps = comp.competitors || [];
          const away = comps.find((c) => c.homeAway === "away") || {};
          const home = comps.find((c) => c.homeAway === "home") || {};
          const awayAbbr = away.team?.abbreviation || "";
          const homeAbbr = home.team?.abbreviation || "";
          return {
            awayCode: ESPN_MLB_TO_CODE[awayAbbr] || awayAbbr.toLowerCase(),
            homeCode: ESPN_MLB_TO_CODE[homeAbbr] || homeAbbr.toLowerCase(),
            awayTeam: away.team?.displayName || awayAbbr,
            homeTeam: home.team?.displayName || homeAbbr,
            awayScore: parseInt(away.score) || 0,
            homeScore: parseInt(home.score) || 0,
          };
        });
  } catch (e) {
    logger.error("ESPN MLB fetch error:", e.message);
    return [];
  }
}

async function fetchNBAFinalGames() {
  try {
    const res = await fetch(ESPN_NBA_URL);
    if (!res.ok) { logger.warn(`ESPN NBA API ${res.status}`); return []; }
    const data = await res.json();
    return (data.events || [])
        .filter((e) => {
          const st = e.competitions?.[0]?.status?.type;
          return st?.state === "post" || st?.completed;
        })
        .map((e) => {
          const comp = e.competitions[0];
          const comps = comp.competitors || [];
          const away = comps.find((c) => c.homeAway === "away") || {};
          const home = comps.find((c) => c.homeAway === "home") || {};
          const awayAbbr = away.team?.abbreviation || "";
          const homeAbbr = home.team?.abbreviation || "";
          return {
            awayCode: ESPN_NBA_TO_CODE[awayAbbr] || awayAbbr.toLowerCase(),
            homeCode: ESPN_NBA_TO_CODE[homeAbbr] || homeAbbr.toLowerCase(),
            awayTeam: away.team?.displayName || awayAbbr,
            homeTeam: home.team?.displayName || homeAbbr,
            awayScore: parseInt(away.score) || 0,
            homeScore: parseInt(home.score) || 0,
          };
        });
  } catch (e) {
    logger.error("ESPN NBA fetch error:", e.message);
    return [];
  }
}

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

    // ─── Grade NHL bets from live_scores ───────────────────────────────
    const liveScoresDoc = await admin.firestore()
        .collection("live_scores")
        .doc("current")
        .get();

    const liveGames = liveScoresDoc.data()?.games || [];
    const finalGames = liveGames.filter((g) => g.status === "FINAL");
    logger.info(`Found ${finalGames.length} FINAL NHL games`);

    if (!betsSnapshot.empty && finalGames.length > 0) {
      logger.info(`Found ${betsSnapshot.size} pending bets`);
      let updatedCount = 0;

      for (const betDoc of betsSnapshot.docs) {
        const bet = betDoc.data();
        const betId = betDoc.id;

        const matchingGame = finalGames.find((g) =>
          g.awayTeam === bet.game.awayTeam && g.homeTeam === bet.game.homeTeam,
        );

        if (!matchingGame) {
          continue;
        }

        logger.info(`Updating bet ${betId}: ${bet.bet.pick} for ${matchingGame.awayTeam} @ ${matchingGame.homeTeam} (${matchingGame.awayScore}-${matchingGame.homeScore})`);

        const outcome = calculateOutcome(matchingGame, bet.bet);
        const units = bet.prediction?.dynamicUnits ||
          bet.prediction?.recommendedUnit || 1;
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
              "result.units": units,
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
    }

    // ─── Grade Sharp Flow Locked Picks (NHL, CBB, MLB) ─────────────────
    try {
      const sfSnapshot = await admin.firestore()
          .collection("sharpFlowPicks")
          .where("status", "==", "PENDING")
          .get();

      if (!sfSnapshot.empty) {
        logger.info(`Found ${sfSnapshot.size} pending Sharp Flow picks`);
        let sfGraded = 0;

        // Build date string for NCAA API (today ET)
        const nowET = new Date().toLocaleString("en-US", {
          timeZone: "America/New_York",
        });
        const etDate = new Date(nowET);
        const todayStr = [
          etDate.getFullYear(),
          String(etDate.getMonth() + 1).padStart(2, "0"),
          String(etDate.getDate()).padStart(2, "0"),
        ].join("-");

        // Also check yesterday for late-finishing games
        const yestDate = new Date(etDate);
        yestDate.setDate(yestDate.getDate() - 1);
        const yestStr = [
          yestDate.getFullYear(),
          String(yestDate.getMonth() + 1).padStart(2, "0"),
          String(yestDate.getDate()).padStart(2, "0"),
        ].join("-");

        // Collect unique pick dates to fetch scores for
        const pickDates = new Set();
        sfSnapshot.docs.forEach((d) => {
          const date = d.data().date;
          if (date) pickDates.add(date);
        });

        // Determine which sport APIs we need
        const sports = new Set();
        sfSnapshot.docs.forEach((d) => sports.add(d.data().sport));

        let cbbFinalByDate = {};
        if (sports.has("CBB")) {
          const cbbDates = new Set();
          sfSnapshot.docs.forEach((d) => {
            const p = d.data();
            if (p.sport === "CBB" && p.date) cbbDates.add(p.date);
          });
          for (const d of cbbDates) {
            const games = await fetchNCAAFinalGames(d);
            cbbFinalByDate[d] = games;
            logger.info(`NCAA API: ${games.length} final CBB games for ${d}`);
          }
        }
        const cbbFinalGames = Object.values(cbbFinalByDate).flat();

        let mlbFinalGames = [];
        if (sports.has("MLB")) {
          mlbFinalGames = await fetchMLBFinalGames();
          logger.info(
              `ESPN MLB API: ${mlbFinalGames.length} final MLB games`,
          );
        }

        let nbaFinalGames = [];
        if (sports.has("NBA")) {
          nbaFinalGames = await fetchNBAFinalGames();
          logger.info(
              `ESPN NBA API: ${nbaFinalGames.length} final NBA games`,
          );
        }

        for (const sfDoc of sfSnapshot.docs) {
          const pick = sfDoc.data();
          const sport = pick.sport;

          if (pick.commenceTime && pick.commenceTime > Date.now()) continue;

          let matchingGame = null;

          if (sport === "NHL") {
            // Strip sport prefix if present
            const rawKey = (pick.gameKey || "").replace(/^NHL:/, "");
            const parts = rawKey.split("_");
            if (parts.length !== 2) continue;
            const awayAbbrev =
              ABBREV_MAP[parts[0]] || parts[0].toUpperCase();
            const homeAbbrev =
              ABBREV_MAP[parts[1]] || parts[1].toUpperCase();

            matchingGame = finalGames.find((g) =>
              g.awayTeam === awayAbbrev && g.homeTeam === homeAbbrev,
            );
          } else if (sport === "CBB") {
            // Fuzzy match pick.away / pick.home against NCAA final games
            // NCAA API may have away/home reversed, so check both
            for (const g of cbbFinalGames) {
              const normalMatch =
                teamNamesMatch(pick.away, g.awayTeam) &&
                teamNamesMatch(pick.home, g.homeTeam);
              const reversedMatch =
                teamNamesMatch(pick.away, g.homeTeam) &&
                teamNamesMatch(pick.home, g.awayTeam);

              if (normalMatch) {
                matchingGame = {
                  awayScore: g.awayScore,
                  homeScore: g.homeScore,
                };
                break;
              }
              if (reversedMatch) {
                matchingGame = {
                  awayScore: g.homeScore,
                  homeScore: g.awayScore,
                };
                break;
              }
            }
          } else if (sport === "MLB") {
            const rawKey = (pick.gameKey || "").replace(/^MLB:/, "");
            const parts = rawKey.split("_");
            if (parts.length === 2) {
              matchingGame = mlbFinalGames.find((g) =>
                g.awayCode === parts[0] && g.homeCode === parts[1],
              );
            }
            // Fallback: fuzzy match on team display names
            if (!matchingGame) {
              for (const g of mlbFinalGames) {
                if (teamNamesMatch(pick.away, g.awayTeam) &&
                    teamNamesMatch(pick.home, g.homeTeam)) {
                  matchingGame = g;
                  break;
                }
              }
            }
          } else if (sport === "NBA") {
            const rawKey = (pick.gameKey || "").replace(/^NBA:/, "");
            const parts = rawKey.split("_");
            if (parts.length === 2) {
              matchingGame = nbaFinalGames.find((g) =>
                g.awayCode === parts[0] && g.homeCode === parts[1],
              );
            }
            if (!matchingGame) {
              for (const g of nbaFinalGames) {
                if (teamNamesMatch(pick.away, g.awayTeam) &&
                    teamNamesMatch(pick.home, g.homeTeam)) {
                  matchingGame = g;
                  break;
                }
              }
            }
          }

          if (!matchingGame) continue;

          const winner = matchingGame.awayScore > matchingGame.homeScore ?
            "away" : "home";

          logger.info(
              `📊 ${sport}: ${pick.away} (${matchingGame.awayScore}) @ ` +
              `${pick.home} (${matchingGame.homeScore})`,
          );

          if (pick.sides) {
            const updates = {
              "result.awayScore": matchingGame.awayScore,
              "result.homeScore": matchingGame.homeScore,
              "result.winner": winner,
              "result.source": sport === "NHL" ? "NHL_API" :
                sport === "CBB" ? "NCAA_API" :
                sport === "NBA" ? "ESPN_NBA_API" : "ESPN_MLB_API",
            };
            let allSidesGraded = true;

            for (const [side, sideData] of Object.entries(pick.sides)) {
              if (sideData.status === "COMPLETED") continue;

              const sideUpper = side === "away" ? "AWAY" : "HOME";
              const outcome = calculateOutcome(matchingGame, {
                market: "MONEYLINE",
                side: sideUpper,
              });
              const units = sideData.peak?.units || sideData.lock?.units || 1;
              const odds = sideData.peak?.odds || sideData.lock?.odds || 0;
              const profit = calculateProfit(outcome, odds, units);
              const team = sideData.team || side;

              updates[`sides.${side}.status`] = "COMPLETED";
              updates[`sides.${side}.result.outcome`] = outcome;
              updates[`sides.${side}.result.profit`] =
                parseFloat(profit.toFixed(2));
              updates[`sides.${side}.result.gradedAt`] =
                admin.firestore.FieldValue.serverTimestamp();

              // CLV: compare actual bet odds (best retail) to closing Pinnacle
              const betOddsForCLV = sideData.peak?.odds || sideData.lock?.odds || sideData.peak?.pinnacleOdds || sideData.lock?.pinnacleOdds;
              const closeOdds = sideData.closingOdds;
              if (betOddsForCLV && closeOdds) {
                const lockProb = impliedProbability(betOddsForCLV);
                const closeProb = impliedProbability(closeOdds);
                if (lockProb != null && closeProb != null) {
                  const clv = +(closeProb - lockProb).toFixed(4);
                  updates[`sides.${side}.result.clv`] = clv;
                  updates[`sides.${side}.result.lockProb`] =
                    +lockProb.toFixed(4);
                  updates[`sides.${side}.result.closeProb`] =
                    +closeProb.toFixed(4);
                }
              }

              sfGraded++;
              logger.info(
                  `🔒 ${sport}: ${team} ML ${odds} (${units}u) → ` +
                  `${outcome} (${profit >= 0 ? "+" : ""}` +
                  `${profit.toFixed(2)}u)`,
              );
            }

            for (const [side, sideData] of Object.entries(pick.sides)) {
              if (sideData.status !== "COMPLETED" &&
                !updates[`sides.${side}.status`]) {
                allSidesGraded = false;
              }
            }

            if (allSidesGraded) {
              updates["status"] = "COMPLETED";
            }

            await sfDoc.ref.update(updates);
          } else {
            // Legacy flat format
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
              "result.winner": winner,
              "result.profit": parseFloat(profit.toFixed(2)),
              "result.source": sport === "NHL" ? "NHL_API" :
                sport === "CBB" ? "NCAA_API" :
                sport === "NBA" ? "ESPN_NBA_API" : "ESPN_MLB_API",
              "result.gradedAt":
                admin.firestore.FieldValue.serverTimestamp(),
              "status": "COMPLETED",
            });

            sfGraded++;
            logger.info(
                `🔒 ${sport}: ${pick.consensusTeam} ML ${pick.odds} → ` +
                `${outcome} (${profit >= 0 ? "+" : ""}` +
                `${profit.toFixed(2)}u)`,
            );
          }
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

