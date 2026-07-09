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
const ESPN_WNBA_URL = "https://site.api.espn.com/apis/site/v2/sports/basketball/wnba/scoreboard";
const ESPN_SOC_URL = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard";
const ESPN_UFC_URL = "https://site.api.espn.com/apis/site/v2/sports/mma/ufc/scoreboard";

// ESPN WNBA abbreviation → our lowercased codes (mirrors gradeSharpActions.js).
const ESPN_WNBA_TO_CODE = {
  ATL: "atl", CHI: "chi", CON: "con", DAL: "dal", GS: "gsv", GSV: "gsv",
  IND: "ind", LV: "lva", LVA: "lva", LA: "las", LAS: "las", MIN: "min",
  NY: "nyl", NYL: "nyl", PHX: "pho", PHO: "pho", POR: "por", SEA: "sea",
  TOR: "tor", WAS: "was", WSH: "was",
};

const WNBA_NAME_TO_CODE = {
  atlantadream: "ATL", atlanta: "ATL", dream: "ATL",
  chicagosky: "CHI", chicago: "CHI", sky: "CHI",
  connecticutsun: "CON", connecticut: "CON", sun: "CON",
  dallaswings: "DAL", dallas: "DAL", wings: "DAL",
  goldenstatevalkyries: "GSV", goldenstate: "GSV", valkyries: "GSV", gsv: "GSV", gs: "GSV",
  indianafever: "IND", indiana: "IND", fever: "IND",
  losangelessparks: "LAS", lasparks: "LAS", losangeles: "LAS", sparks: "LAS", las: "LAS", la: "LAS",
  lasvegasaces: "LVA", lasvegas: "LVA", aces: "LVA", lva: "LVA", lv: "LVA",
  minnesotalynx: "MIN", minnesota: "MIN", lynx: "MIN",
  newyorkliberty: "NYL", newyork: "NYL", liberty: "NYL", nyl: "NYL", ny: "NYL",
  phoenixmercury: "PHO", phoenix: "PHO", mercury: "PHO", pho: "PHO", phx: "PHO",
  portlandfire: "POR", portland: "POR", fire: "POR",
  seattlestorm: "SEA", seattle: "SEA", storm: "SEA",
  torontotempo: "TOR", toronto: "TOR", tempo: "TOR",
  washingtonmystics: "WAS", washington: "WAS", mystics: "WAS", was: "WAS", wsh: "WAS",
};

function normalizeWNBAName(s) {
  return (s || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
}

function resolveWNBATeam(raw) {
  if (!raw) return null;
  const cleaned = String(raw)
      .replace(/\s*\((?:w|women|wnba)\)\s*$/i, "")
      .replace(/^wnba\s*:\s*/i, "")
      .trim();
  const n = normalizeWNBAName(cleaned);
  if (WNBA_NAME_TO_CODE[n]) return WNBA_NAME_TO_CODE[n];
  let best = null;
  let bestLen = 0;
  for (const [alias, code] of Object.entries(WNBA_NAME_TO_CODE)) {
    if (alias.length < 3) continue;
    if ((n === alias || n.startsWith(alias) || n.includes(alias)) && alias.length > bestLen) {
      best = code;
      bestLen = alias.length;
    }
  }
  return best;
}

function wnbaTeamsMatch(rawA, rawB) {
  const a = resolveWNBATeam(rawA);
  const b = resolveWNBATeam(rawB);
  return !!(a && b && a === b);
}

// UFC fighter helpers (mirrors scripts/lib/ufcFighters.js — functions/ is CJS).
const UFC_ALIASES = {
  benoitsaintdenis: "benoitsaintdenis",
  terrancemckinney: "terrancemckinney",
  bobbygreen: "kinggreen",
  kinggreen: "kinggreen",
};

function normalizeFighterName(s) {
  return (s || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
}

function resolveUFCFighter(raw) {
  if (!raw) return null;
  const cleaned = String(raw)
      .replace(/\s*\([^)]*\)\s*$/g, "")
      .replace(/^ufc\s*\d+\s*:\s*/i, "")
      .trim();
  const n = normalizeFighterName(cleaned);
  if (!n || n.length < 3) return null;
  return UFC_ALIASES[n] || n;
}

function fightersMatch(rawA, rawB) {
  const a = resolveUFCFighter(rawA);
  const b = resolveUFCFighter(rawB);
  return !!(a && b && a === b);
}

function isGradableUFCMainML(pos) {
  if (!pos) return false;
  const mt = (pos.marketType || pos.market || "ml").toString().toLowerCase();
  if (mt && mt !== "ml" && mt !== "moneyline" && mt !== "h2h") return false;
  const blob = [
    pos.title, pos.marketTitle, pos.outcome, pos.teamName, pos.team, pos.sideLabel,
  ].filter(Boolean).join(" ");
  if (/win by|go the distance|method|ko\/?tko|submission|decision|rounds?\b|o\/u\s*\d|over\/under|parlay|champion|fight next/i.test(blob)) {
    return false;
  }
  return true;
}

function espnEventDateET(e) {
  if (!e?.date) return null;
  const d = new Date(e.date);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-CA", {timeZone: "America/New_York"});
}

// World Cup country name → FIFA code (mirrors scripts/lib/soccerTeams.js —
// functions/ is CommonJS so it can't import that ESM module directly).
// Covers Polymarket, ESPN, and Odds API spelling variants.
const SOC_NAME_TO_CODE = {
  "algeria": "ALG", "argentina": "ARG", "australia": "AUS", "austria": "AUT",
  "belgium": "BEL", "bosniaherzegovina": "BIH", "bosniaandherzegovina": "BIH", "bosnia": "BIH",
  "brazil": "BRA", "canada": "CAN", "capeverde": "CPV", "caboverde": "CPV",
  "colombia": "COL",
  "cotedivoire": "CIV", "ivorycoast": "CIV",
  "drcongo": "COD", "congodr": "COD", "democraticrepublicofthecongo": "COD",
  "croatia": "CRO", "curacao": "CUW", "czechia": "CZE", "czechrepublic": "CZE",
  "ecuador": "ECU", "egypt": "EGY", "england": "ENG", "spain": "ESP",
  "france": "FRA", "germany": "GER", "ghana": "GHA", "haiti": "HAI",
  "iriran": "IRN", "iran": "IRN", "iraq": "IRQ", "italy": "ITA",
  "jordan": "JOR", "japan": "JPN",
  "korearepublic": "KOR", "southkorea": "KOR", "republicofkorea": "KOR",
  "saudiarabia": "KSA", "morocco": "MAR", "mexico": "MEX",
  "netherlands": "NED", "holland": "NED", "norway": "NOR", "newzealand": "NZL",
  "panama": "PAN", "paraguay": "PAR", "peru": "PER", "portugal": "POR",
  "qatar": "QAT", "southafrica": "RSA", "scotland": "SCO", "senegal": "SEN",
  "switzerland": "SUI", "sweden": "SWE", "tunisia": "TUN",
  "turkiye": "TUR", "turkey": "TUR",
  "uruguay": "URU", "usa": "USA", "unitedstates": "USA", "unitedstatesofamerica": "USA",
  "uzbekistan": "UZB",
};

function resolveSOCCode(raw) {
  const n = (raw || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
  return SOC_NAME_TO_CODE[n] || null;
}

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

// ── Phantom-score guard ───────────────────────────────────────────────
// ESPN's `status.type` carries `state: "post"` for ANY past-the-clock
// game — including ones that never actually played (postponed by weather,
// canceled, suspended without a makeup). When the game didn't play,
// ESPN returns no scores, which `parseInt(undefined) || 0` quietly turns
// into 0-0. Down the pipe `calculateOutcome` then grades ML 0-0 as LOSS
// for the AWAY side and grades RUNLINE/PUCKLINE picks based on the
// phantom 0-0 — pure invented outcomes (e.g. ATL @ CWS 2026-06-11
// rained out, picks shipped as -3.0u of fake LOSSes).
//
// `STATUS_FINAL` is the only name that's safe to grade for MLB/NBA.
// We also accept the rare hockey/baseball completed-game variants
// (FINAL_OT, FINAL_PEN, FINAL_SO, FINAL_DELAYED) by allow-listing
// any name starting with "STATUS_FINAL".
//
// We DENY-list the four no-play states explicitly so a typo in a
// future ESPN status (e.g. STATUS_RAIN_DELAY) doesn't slip a no-play
// game through.
const isActuallyFinal = (statusType) => {
  if (!statusType) return false;
  const name = statusType.name || '';
  if (name.startsWith('STATUS_POSTPONED')) return false;
  if (name.startsWith('STATUS_CANCELED'))  return false;
  if (name.startsWith('STATUS_CANCELLED')) return false;
  if (name.startsWith('STATUS_SUSPENDED')) return false;
  if (name.startsWith('STATUS_RAIN_DELAY')) return false;
  if (name.startsWith('STATUS_DELAYED'))   return false;
  if (name.startsWith('STATUS_FORFEIT'))   return false;
  // Only after the deny-list — accept canonical finished states.
  return name.startsWith('STATUS_FINAL')
      || statusType.completed === true
      || statusType.state === 'post';
};

async function fetchMLBFinalGames() {
  try {
    const res = await fetch(ESPN_MLB_URL);
    if (!res.ok) { logger.warn(`ESPN MLB API ${res.status}`); return []; }
    const data = await res.json();
    let postponedCount = 0;
    const games = (data.events || [])
        .filter((e) => {
          const st = e.competitions?.[0]?.status?.type;
          const ok = isActuallyFinal(st);
          if (!ok && (st?.state === 'post' || st?.completed)) {
            postponedCount++;
            const comp = e.competitions[0];
            const comps = comp.competitors || [];
            const away = comps.find((c) => c.homeAway === 'away') || {};
            const home = comps.find((c) => c.homeAway === 'home') || {};
            logger.warn(`[grader] SKIP MLB no-play game (${st?.name}): ${away.team?.displayName} @ ${home.team?.displayName}`);
          }
          return ok;
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
    if (postponedCount > 0) {
      logger.info(`[grader] MLB: ${games.length} truly final, ${postponedCount} no-play skipped`);
    }
    return games;
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
    let postponedCount = 0;
    const games = (data.events || [])
        .filter((e) => {
          const st = e.competitions?.[0]?.status?.type;
          const ok = isActuallyFinal(st);
          if (!ok && (st?.state === 'post' || st?.completed)) {
            postponedCount++;
            const comp = e.competitions[0];
            const comps = comp.competitors || [];
            const away = comps.find((c) => c.homeAway === 'away') || {};
            const home = comps.find((c) => c.homeAway === 'home') || {};
            logger.warn(`[grader] SKIP NBA no-play game (${st?.name}): ${away.team?.displayName} @ ${home.team?.displayName}`);
          }
          return ok;
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
    if (postponedCount > 0) {
      logger.info(`[grader] NBA: ${games.length} truly final, ${postponedCount} no-play skipped`);
    }
    return games;
  } catch (e) {
    logger.error("ESPN NBA fetch error:", e.message);
    return [];
  }
}

async function fetchWNBAFinalGames() {
  try {
    const res = await fetch(ESPN_WNBA_URL);
    if (!res.ok) { logger.warn(`ESPN WNBA API ${res.status}`); return []; }
    const data = await res.json();
    let postponedCount = 0;
    const games = (data.events || [])
        .filter((e) => {
          const st = e.competitions?.[0]?.status?.type;
          const ok = isActuallyFinal(st);
          if (!ok && (st?.state === "post" || st?.completed)) {
            postponedCount++;
            const comp = e.competitions[0];
            const comps = comp.competitors || [];
            const away = comps.find((c) => c.homeAway === "away") || {};
            const home = comps.find((c) => c.homeAway === "home") || {};
            logger.warn(`[grader] SKIP WNBA no-play game (${st?.name}): ${away.team?.displayName} @ ${home.team?.displayName}`);
          }
          return ok;
        })
        .map((e) => {
          const comp = e.competitions[0];
          const comps = comp.competitors || [];
          const away = comps.find((c) => c.homeAway === "away") || {};
          const home = comps.find((c) => c.homeAway === "home") || {};
          const awayAbbr = away.team?.abbreviation || "";
          const homeAbbr = home.team?.abbreviation || "";
          const awayName = away.team?.displayName || awayAbbr;
          const homeName = home.team?.displayName || homeAbbr;
          return {
            dateET: espnEventDateET(e),
            awayCode: ESPN_WNBA_TO_CODE[awayAbbr]
              || (resolveWNBATeam(awayName) || "").toLowerCase()
              || awayAbbr.toLowerCase(),
            homeCode: ESPN_WNBA_TO_CODE[homeAbbr]
              || (resolveWNBATeam(homeName) || "").toLowerCase()
              || homeAbbr.toLowerCase(),
            awayTeam: awayName,
            homeTeam: homeName,
            awayScore: parseInt(away.score) || 0,
            homeScore: parseInt(home.score) || 0,
          };
        });
    if (postponedCount > 0) {
      logger.info(`[grader] WNBA: ${games.length} truly final, ${postponedCount} no-play skipped`);
    }
    return games;
  } catch (e) {
    logger.error("ESPN WNBA fetch error:", e.message);
    return [];
  }
}

async function fetchSOCFinalGames(dateStr) {
  // FIFA World Cup via ESPN. Polymarket's 3-way match market resolves on the
  // 90-minute result. Group stage is always STATUS_FULL_TIME, so the final
  // score IS the regulation score. Knockout rounds, however, can go to extra
  // time (STATUS_FINAL_AET) or penalties (STATUS_FINAL_PEN) — and ESPN's
  // `score` then INCLUDES extra-time goals (shootout goals live in a separate
  // shootoutScore field). A knockout that reached ET/pens was, by definition,
  // level after 90 minutes, so its 90-minute result is a DRAW. We flag those
  // games (wentBeyond90) so calculateOutcome / winner grade them as a draw
  // regardless of the ET-inflated score below.
  try {
    const ymd = dateStr ? `?dates=${dateStr.replace(/-/g, "")}` : "";
    const res = await fetch(`${ESPN_SOC_URL}${ymd}`);
    if (!res.ok) { logger.warn(`ESPN SOC API ${res.status}`); return []; }
    const data = await res.json();
    return (data.events || [])
        .filter((e) => isActuallyFinal(e.competitions?.[0]?.status?.type))
        .map((e) => {
          const comp = e.competitions[0];
          const comps = comp.competitors || [];
          const away = comps.find((c) => c.homeAway === "away") || {};
          const home = comps.find((c) => c.homeAway === "home") || {};
          const awayName = away.team?.displayName || away.team?.name || "";
          const homeName = home.team?.displayName || home.team?.name || "";
          const stName = comp.status?.type?.name || "";
          const wentBeyond90 =
            stName === "STATUS_FINAL_AET" || stName === "STATUS_FINAL_PEN";
          return {
            awayCode: (resolveSOCCode(awayName) || "").toLowerCase(),
            homeCode: (resolveSOCCode(homeName) || "").toLowerCase(),
            awayTeam: awayName,
            homeTeam: homeName,
            awayScore: parseInt(away.score) || 0,
            homeScore: parseInt(home.score) || 0,
            wentBeyond90,
          };
        });
  } catch (e) {
    logger.error("ESPN SOC fetch error:", e.message);
    return [];
  }
}

/**
 * UFC fight card via ESPN MMA scoreboard.
 * One event = full card; each competition = one bout.
 * Competitors use athlete.displayName; homeAway is usually null.
 * Winner → synthetic 1/0 scores. No Contest (neither winner) skipped.
 */
async function fetchUFCFinalFights(dateStr) {
  try {
    const ymd = dateStr ? `?dates=${dateStr.replace(/-/g, "")}` : "";
    const res = await fetch(`${ESPN_UFC_URL}${ymd}`);
    if (!res.ok) { logger.warn(`ESPN UFC API ${res.status}`); return []; }
    const data = await res.json();
    const fights = [];
    for (const ev of data.events || []) {
      const cardDateET = espnEventDateET(ev);
      for (const comp of ev.competitions || []) {
        const st = comp.status?.type;
        if (!isActuallyFinal(st)) continue;
        const comps = comp.competitors || [];
        if (comps.length < 2) continue;
        const fighterName = (c) =>
          c.athlete?.displayName || c.team?.displayName || c.team?.name || "";
        const f0 = fighterName(comps[0]);
        const f1 = fighterName(comps[1]);
        const w0 = comps[0].winner === true;
        const w1 = comps[1].winner === true;
        if (!w0 && !w1) continue; // NC — stay PENDING
        const code0 = resolveUFCFighter(f0);
        const code1 = resolveUFCFighter(f1);
        if (!code0 || !code1) continue;
        fights.push({
          dateET: espnEventDateET(comp) || cardDateET,
          awayCode: code0,
          homeCode: code1,
          awayFighter: f0,
          homeFighter: f1,
          awayTeam: f0,
          homeTeam: f1,
          awayScore: w0 ? 1 : 0,
          homeScore: w1 ? 1 : 0,
        });
      }
    }
    return fights;
  } catch (e) {
    logger.error("ESPN UFC fetch error:", e.message);
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

    // ─── Fetch scores for all grading (ML, spread, total) ────────────
    // Build date string for NCAA API (today ET)
    const nowET = new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
    });
    const etDate = new Date(nowET);

    // Collect all PENDING docs from all three collections
    const sfSnapshot = await admin.firestore()
        .collection("sharpFlowPicks")
        .where("status", "==", "PENDING")
        .get();
    const spreadSnapshot = await admin.firestore()
        .collection("sharpFlowSpreads")
        .where("status", "==", "PENDING")
        .get();
    const totalSnapshot = await admin.firestore()
        .collection("sharpFlowTotals")
        .where("status", "==", "PENDING")
        .get();

    const allDocs = [
      ...sfSnapshot.docs,
      ...spreadSnapshot.docs,
      ...totalSnapshot.docs,
    ];

    const allSports = new Set();
    const allCbbDates = new Set();
    const allSocDates = new Set();
    const allUfcDates = new Set();
    allDocs.forEach((d) => {
      const p = d.data();
      allSports.add(p.sport);
      if (p.sport === "CBB" && p.date) allCbbDates.add(p.date);
      if (p.sport === "SOC" && p.date) allSocDates.add(p.date);
      if (p.sport === "UFC" && p.date) allUfcDates.add(p.date);
    });

    let cbbFinalByDate = {};
    if (allSports.has("CBB")) {
      for (const d of allCbbDates) {
        const games = await fetchNCAAFinalGames(d);
        cbbFinalByDate[d] = games;
        logger.info(`NCAA API: ${games.length} final CBB games for ${d}`);
      }
    }
    const cbbFinalGames = Object.values(cbbFinalByDate).flat();

    let mlbFinalGames = [];
    if (allSports.has("MLB")) {
      mlbFinalGames = await fetchMLBFinalGames();
      logger.info(`ESPN MLB API: ${mlbFinalGames.length} final MLB games`);
    }

    let nbaFinalGames = [];
    if (allSports.has("NBA")) {
      nbaFinalGames = await fetchNBAFinalGames();
      logger.info(`ESPN NBA API: ${nbaFinalGames.length} final NBA games`);
    }

    let wnbaFinalGames = [];
    if (allSports.has("WNBA")) {
      wnbaFinalGames = await fetchWNBAFinalGames();
      logger.info(`ESPN WNBA API: ${wnbaFinalGames.length} final WNBA games`);
    }

    let socFinalGames = [];
    if (allSports.has("SOC")) {
      for (const d of allSocDates) {
        const games = await fetchSOCFinalGames(d);
        socFinalGames.push(...games);
        logger.info(`ESPN SOC API: ${games.length} final World Cup games for ${d}`);
      }
    }

    let ufcFinalGames = [];
    if (allSports.has("UFC")) {
      for (const d of allUfcDates) {
        const fights = await fetchUFCFinalFights(d);
        ufcFinalGames.push(...fights);
        logger.info(`ESPN UFC API: ${fights.length} final fights for ${d}`);
      }
    }

    // ─── Grade Sharp Flow ML Picks ───────────────────────────────────
    try {
      if (!sfSnapshot.empty) {
        logger.info(`Found ${sfSnapshot.size} pending Sharp Flow ML picks`);
        let sfGraded = 0;

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
          } else if (sport === "WNBA") {
            const rawKey = (pick.gameKey || "").replace(/^WNBA:/, "");
            const parts = rawKey.split("_");
            const dated = wnbaFinalGames.filter((g) =>
              !pick.date || (g.dateET != null && g.dateET === pick.date),
            );
            if (parts.length === 2) {
              matchingGame = dated.find((g) =>
                g.awayCode === parts[0] && g.homeCode === parts[1],
              );
            }
            if (!matchingGame) {
              for (const g of dated) {
                if (wnbaTeamsMatch(pick.away, g.awayTeam) &&
                    wnbaTeamsMatch(pick.home, g.homeTeam)) {
                  matchingGame = g;
                  break;
                }
                if (teamNamesMatch(pick.away, g.awayTeam) &&
                    teamNamesMatch(pick.home, g.homeTeam)) {
                  matchingGame = g;
                  break;
                }
              }
            }
          } else if (sport === "SOC") {
            const rawKey = (pick.gameKey || "").replace(/^SOC:/, "");
            const parts = rawKey.split("_");
            if (parts.length === 2) {
              matchingGame = socFinalGames.find((g) =>
                g.awayCode === parts[0] && g.homeCode === parts[1],
              );
              // ESPN home/away may not match our key order — flip scores
              if (!matchingGame) {
                const flipped = socFinalGames.find((g) =>
                  g.awayCode === parts[1] && g.homeCode === parts[0],
                );
                if (flipped) {
                  matchingGame = {
                    awayScore: flipped.homeScore,
                    homeScore: flipped.awayScore,
                    wentBeyond90: flipped.wentBeyond90,
                  };
                }
              }
            }
          } else if (sport === "UFC") {
            if (!isGradableUFCMainML(pick)) continue;
            const rawKey = (pick.gameKey || "").replace(/^UFC:/, "");
            const parts = rawKey.split("_");
            if (parts.length < 2) continue;
            const dated = ufcFinalGames.filter((g) =>
              !pick.date || (g.dateET != null && g.dateET === pick.date),
            );
            for (const g of dated) {
              if (g.awayCode === parts[0] && g.homeCode === parts[1]) {
                matchingGame = g;
                break;
              }
              if (g.awayCode === parts[1] && g.homeCode === parts[0]) {
                matchingGame = {
                  ...g,
                  awayScore: g.homeScore,
                  homeScore: g.awayScore,
                };
                break;
              }
            }
            if (!matchingGame) {
              for (const g of dated) {
                if (fightersMatch(pick.away, g.awayFighter) &&
                    fightersMatch(pick.home, g.homeFighter)) {
                  matchingGame = g;
                  break;
                }
                if (fightersMatch(pick.away, g.homeFighter) &&
                    fightersMatch(pick.home, g.awayFighter)) {
                  matchingGame = {
                    ...g,
                    awayScore: g.homeScore,
                    homeScore: g.awayScore,
                  };
                  break;
                }
              }
            }
            // No decisive winner (shouldn't reach here after NC skip) — stay PENDING
            if (matchingGame &&
                matchingGame.awayScore === matchingGame.homeScore) {
              matchingGame = null;
            }
          }

          if (!matchingGame) continue;

          // SOC knockout: a match that reached extra time / penalties was a
          // draw at 90 min, so the 3-way market settles DRAW regardless of the
          // ET-inflated score. (wentBeyond90 is only ever set for SOC games.)
          const winner = matchingGame.wentBeyond90 ? "draw" :
            matchingGame.awayScore > matchingGame.homeScore ?
            "away" : matchingGame.homeScore > matchingGame.awayScore ?
            "home" : "draw";

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
                sport === "NBA" ? "ESPN_NBA_API" :
                sport === "WNBA" ? "ESPN_WNBA_API" :
                sport === "SOC" ? "ESPN_SOC_API" :
                sport === "UFC" ? "ESPN_UFC_API" : "ESPN_MLB_API",
            };
            let allSidesGraded = true;

            for (const [side, sideData] of Object.entries(pick.sides)) {
              if (sideData.status === "COMPLETED") continue;

              const sideUpper = side === "away" ? "AWAY" :
                side === "draw" ? "DRAW" : "HOME";
              const outcome = calculateOutcome(matchingGame, {
                market: "MONEYLINE",
                side: sideUpper,
              });
              // CANONICAL bet size under AGS-Unified v9: finalUnits is the
              // single source of truth — written every cycle by the cron
              // (syncPickStateAuthoritative.js) and frozen at T-15. It
              // already encodes the AGS tier × sizing ladder (ELITE 2.0×,
              // PREMIUM 1.5×, LOCK 1.1×, LEAN 0.5×, WEAK 0.2×, FADE 0.0×).
              // Legacy docs (pre-finalUnits) fall back through
              // v8_agsUnitsApplied → peak.units. ?? (not ||) so a hard-mute
              // 0u play stays at 0u instead of cascading to peak.units.
              const units = sideData.finalUnits
                ?? sideData.v8_agsUnitsApplied
                ?? sideData.peak?.units
                ?? sideData.lock?.units
                ?? 0;
              const odds = sideData.peak?.odds || sideData.lock?.odds || 0;
              // A play is "tracked" (0u, MUTED display) ONLY when AGS-U
              // hard-muted it — i.e. cron stamped 0 units. Do NOT treat
              // LEAN-tier or any other shipped tier as automatic tracked,
              // because under v9 LEAN ships at 0.5× (non-zero) units.
              const isTracked = !units;
              const profit = isTracked ? 0 :
                calculateProfit(outcome, odds, units);
              const team = sideData.team || side;

              updates[`sides.${side}.status`] = "COMPLETED";
              updates[`sides.${side}.result.outcome`] = outcome;
              updates[`sides.${side}.result.profit`] =
                parseFloat(profit.toFixed(2));
              updates[`sides.${side}.result.tracked`] = isTracked;
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
                sport === "NBA" ? "ESPN_NBA_API" :
                sport === "WNBA" ? "ESPN_WNBA_API" :
                sport === "SOC" ? "ESPN_SOC_API" :
                sport === "UFC" ? "ESPN_UFC_API" : "ESPN_MLB_API",
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

        logger.info(`Sharp Flow: Graded ${sfGraded} ML picks`);
      }
    } catch (sfError) {
      logger.error("Error grading Sharp Flow ML picks:", sfError);
    }

    // ─── Grade Sharp Flow Spread Picks ────────────────────────────────
    try {
      if (!spreadSnapshot.empty) {
        logger.info(
            `Found ${spreadSnapshot.size} pending spread picks`,
        );
        let spreadGraded = 0;

        for (const sfDoc of spreadSnapshot.docs) {
          const pick = sfDoc.data();
          const sport = pick.sport;
          if (pick.commenceTime && pick.commenceTime > Date.now()) continue;

          let matchingGame = null;
          if (sport === "NHL") {
            const rawKey = (pick.gameKey || "").replace(/^NHL:/, "");
            const parts = rawKey.split("_");
            if (parts.length !== 2) continue;
            const awayAbbrev = ABBREV_MAP[parts[0]] || parts[0].toUpperCase();
            const homeAbbrev = ABBREV_MAP[parts[1]] || parts[1].toUpperCase();
            matchingGame = finalGames.find(
                (g) => g.awayTeam === awayAbbrev && g.homeTeam === homeAbbrev,
            );
          } else if (sport === "CBB") {
            for (const g of Object.values(cbbFinalByDate || {}).flat()) {
              if (teamNamesMatch(pick.away, g.awayTeam) &&
                  teamNamesMatch(pick.home, g.homeTeam)) {
                matchingGame = {awayScore: g.awayScore, homeScore: g.homeScore};
                break;
              }
              if (teamNamesMatch(pick.away, g.homeTeam) &&
                  teamNamesMatch(pick.home, g.awayTeam)) {
                matchingGame = {awayScore: g.homeScore, homeScore: g.awayScore};
                break;
              }
            }
          } else if (sport === "MLB") {
            const rawKey = (pick.gameKey || "").replace(/^MLB:/, "");
            const parts = rawKey.split("_");
            if (parts.length === 2) {
              matchingGame = mlbFinalGames.find(
                  (g) => g.awayCode === parts[0] && g.homeCode === parts[1],
              );
            }
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
              matchingGame = nbaFinalGames.find(
                  (g) => g.awayCode === parts[0] && g.homeCode === parts[1],
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
          } else if (sport === "WNBA") {
            const rawKey = (pick.gameKey || "").replace(/^WNBA:/, "");
            const parts = rawKey.split("_");
            const dated = wnbaFinalGames.filter((g) =>
              !pick.date || (g.dateET != null && g.dateET === pick.date),
            );
            if (parts.length === 2) {
              matchingGame = dated.find(
                  (g) => g.awayCode === parts[0] && g.homeCode === parts[1],
              );
            }
            if (!matchingGame) {
              for (const g of dated) {
                if (wnbaTeamsMatch(pick.away, g.awayTeam) &&
                    wnbaTeamsMatch(pick.home, g.homeTeam)) {
                  matchingGame = g;
                  break;
                }
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

          if (pick.sides) {
            const updates = {
              "result.awayScore": matchingGame.awayScore,
              "result.homeScore": matchingGame.homeScore,
              "result.winner": winner,
              "result.source": "SPREAD_GRADER",
            };
            let allSidesGraded = true;

            for (const [side, sideData] of Object.entries(pick.sides)) {
              if (sideData.status === "COMPLETED") continue;
              const line = sideData.peak?.line || sideData.lock?.line || 0;
              const sideUpper = side === "away" ? "AWAY" : "HOME";
              const outcome = calculateOutcome(matchingGame, {
                market: "PUCK_LINE",
                side: sideUpper,
                line: line,
              });
              // CANONICAL bet size — see ML grader above for full notes.
              // AGS-U v9: tracked iff hard-muted (units=0), never by tier.
              const units = sideData.finalUnits
                ?? sideData.v8_agsUnitsApplied
                ?? sideData.peak?.units
                ?? sideData.lock?.units
                ?? 0;
              const odds = sideData.peak?.odds || sideData.lock?.odds || 0;
              const isTracked = !units;
              const profit = isTracked ? 0 :
                calculateProfit(outcome, odds, units);

              updates[`sides.${side}.status`] = "COMPLETED";
              updates[`sides.${side}.result.outcome`] = outcome;
              updates[`sides.${side}.result.profit`] =
                parseFloat(profit.toFixed(2));
              updates[`sides.${side}.result.tracked`] = isTracked;
              updates[`sides.${side}.result.gradedAt`] =
                admin.firestore.FieldValue.serverTimestamp();

              const betOddsForCLV = sideData.peak?.odds || sideData.lock?.odds;
              const closeOdds = sideData.closingOdds;
              if (betOddsForCLV && closeOdds) {
                const lockProb = impliedProbability(betOddsForCLV);
                const closeProb = impliedProbability(closeOdds);
                if (lockProb != null && closeProb != null) {
                  updates[`sides.${side}.result.clv`] =
                    +(closeProb - lockProb).toFixed(4);
                }
              }
              spreadGraded++;
              logger.info(
                  `🔒 ${sport} SPREAD: ${sideData.team} ${line} ` +
                  `${odds} (${units}u) → ${outcome}`,
              );
            }

            for (const [side, sideData] of Object.entries(pick.sides)) {
              if (sideData.status !== "COMPLETED" &&
                !updates[`sides.${side}.status`]) {
                allSidesGraded = false;
              }
            }
            if (allSidesGraded) updates["status"] = "COMPLETED";
            await sfDoc.ref.update(updates);
          }
        }
        logger.info(`Sharp Flow: Graded ${spreadGraded} spread picks`);
      }
    } catch (spreadError) {
      logger.error("Error grading spread picks:", spreadError);
    }

    // ─── Grade Sharp Flow Total (O/U) Picks ──────────────────────────
    try {
      if (!totalSnapshot.empty) {
        logger.info(
            `Found ${totalSnapshot.size} pending total picks`,
        );
        let totalGraded = 0;

        for (const sfDoc of totalSnapshot.docs) {
          const pick = sfDoc.data();
          const sport = pick.sport;
          if (pick.commenceTime && pick.commenceTime > Date.now()) continue;

          let matchingGame = null;
          if (sport === "NHL") {
            const rawKey = (pick.gameKey || "").replace(/^NHL:/, "");
            const parts = rawKey.split("_");
            if (parts.length !== 2) continue;
            const awayAbbrev = ABBREV_MAP[parts[0]] || parts[0].toUpperCase();
            const homeAbbrev = ABBREV_MAP[parts[1]] || parts[1].toUpperCase();
            matchingGame = finalGames.find(
                (g) => g.awayTeam === awayAbbrev && g.homeTeam === homeAbbrev,
            );
          } else if (sport === "CBB") {
            for (const g of Object.values(cbbFinalByDate || {}).flat()) {
              if (teamNamesMatch(pick.away, g.awayTeam) &&
                  teamNamesMatch(pick.home, g.homeTeam)) {
                matchingGame = {awayScore: g.awayScore, homeScore: g.homeScore};
                break;
              }
              if (teamNamesMatch(pick.away, g.homeTeam) &&
                  teamNamesMatch(pick.home, g.awayTeam)) {
                matchingGame = {awayScore: g.homeScore, homeScore: g.awayScore};
                break;
              }
            }
          } else if (sport === "MLB") {
            const rawKey = (pick.gameKey || "").replace(/^MLB:/, "");
            const parts = rawKey.split("_");
            if (parts.length === 2) {
              matchingGame = mlbFinalGames.find(
                  (g) => g.awayCode === parts[0] && g.homeCode === parts[1],
              );
            }
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
              matchingGame = nbaFinalGames.find(
                  (g) => g.awayCode === parts[0] && g.homeCode === parts[1],
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
          } else if (sport === "WNBA") {
            const rawKey = (pick.gameKey || "").replace(/^WNBA:/, "");
            const parts = rawKey.split("_");
            const dated = wnbaFinalGames.filter((g) =>
              !pick.date || (g.dateET != null && g.dateET === pick.date),
            );
            if (parts.length === 2) {
              matchingGame = dated.find(
                  (g) => g.awayCode === parts[0] && g.homeCode === parts[1],
              );
            }
            if (!matchingGame) {
              for (const g of dated) {
                if (wnbaTeamsMatch(pick.away, g.awayTeam) &&
                    wnbaTeamsMatch(pick.home, g.homeTeam)) {
                  matchingGame = g;
                  break;
                }
                if (teamNamesMatch(pick.away, g.awayTeam) &&
                    teamNamesMatch(pick.home, g.homeTeam)) {
                  matchingGame = g;
                  break;
                }
              }
            }
          }

          if (!matchingGame) continue;

          if (pick.sides) {
            const updates = {
              "result.awayScore": matchingGame.awayScore,
              "result.homeScore": matchingGame.homeScore,
              "result.source": "TOTAL_GRADER",
            };
            let allSidesGraded = true;

            for (const [side, sideData] of Object.entries(pick.sides)) {
              if (sideData.status === "COMPLETED") continue;
              const line = sideData.peak?.line || sideData.lock?.line || 0;
              const sideUpper = side === "over" ? "OVER" : "UNDER";
              const outcome = calculateOutcome(matchingGame, {
                market: "TOTAL",
                side: sideUpper,
                line: line,
              });
              // CANONICAL bet size — see ML grader above for full notes.
              // AGS-U v9: tracked iff hard-muted (units=0), never by tier.
              const units = sideData.finalUnits
                ?? sideData.v8_agsUnitsApplied
                ?? sideData.peak?.units
                ?? sideData.lock?.units
                ?? 0;
              const odds = sideData.peak?.odds || sideData.lock?.odds || 0;
              const isTracked = !units;
              const profit = isTracked ? 0 :
                calculateProfit(outcome, odds, units);

              updates[`sides.${side}.status`] = "COMPLETED";
              updates[`sides.${side}.result.outcome`] = outcome;
              updates[`sides.${side}.result.profit`] =
                parseFloat(profit.toFixed(2));
              updates[`sides.${side}.result.tracked`] = isTracked;
              updates[`sides.${side}.result.gradedAt`] =
                admin.firestore.FieldValue.serverTimestamp();

              const betOddsForCLV = sideData.peak?.odds || sideData.lock?.odds;
              const closeOdds = sideData.closingOdds;
              if (betOddsForCLV && closeOdds) {
                const lockProb = impliedProbability(betOddsForCLV);
                const closeProb = impliedProbability(closeOdds);
                if (lockProb != null && closeProb != null) {
                  updates[`sides.${side}.result.clv`] =
                    +(closeProb - lockProb).toFixed(4);
                }
              }
              totalGraded++;
              logger.info(
                  `🔒 ${sport} TOTAL: ${side === "over" ? "Over" : "Under"} ` +
                  `${line} ${odds} (${units}u) → ${outcome}`,
              );
            }

            for (const [side, sideData] of Object.entries(pick.sides)) {
              if (sideData.status !== "COMPLETED" &&
                !updates[`sides.${side}.status`]) {
                allSidesGraded = false;
              }
            }
            if (allSidesGraded) updates["status"] = "COMPLETED";
            await sfDoc.ref.update(updates);
          }
        }
        logger.info(`Sharp Flow: Graded ${totalGraded} total picks`);
      }
    } catch (totalError) {
      logger.error("Error grading total picks:", totalError);
    }

    // ─── Grade MLB Model Picks (mlb_bets collection) ──────────────────
    try {
      const mlbBetsSnapshot = await admin.firestore()
          .collection("mlb_bets")
          .where("status", "==", "PENDING")
          .get();

      if (!mlbBetsSnapshot.empty) {
        // Fetch MLB finals if not already fetched
        let mlbFinals = mlbFinalGames;
        if (mlbFinals.length === 0) {
          mlbFinals = await fetchMLBFinalGames();
          logger.info(
              `ESPN MLB API (for mlb_bets): ${mlbFinals.length} final games`,
          );
        }

        logger.info(
            `Found ${mlbBetsSnapshot.size} pending MLB model picks`,
        );
        let mlbBetsGraded = 0;

        for (const betDoc of mlbBetsSnapshot.docs) {
          const pick = betDoc.data();

          // Skip evaluations (non-bets)
          if (pick.type === "EVALUATION" || !pick.isLocked) continue;

          // Skip if game hasn't started yet
          const ct = pick.game?.commenceTime;
          if (ct) {
            const gameStart = new Date(ct).getTime();
            if (gameStart > Date.now()) continue;
          }

          const awayCode = pick.game?.awayCode ||
            pick.bet?.pickCode; // fallback
          const homeCode = pick.game?.homeCode;
          if (!awayCode || !homeCode) continue;

          // Match by team codes
          let matchingGame = mlbFinals.find(
              (g) => g.awayCode === awayCode && g.homeCode === homeCode,
          );

          // Fallback: fuzzy match on display names
          if (!matchingGame) {
            for (const g of mlbFinals) {
              if (teamNamesMatch(pick.game?.awayTeam, g.awayTeam) &&
                  teamNamesMatch(pick.game?.homeTeam, g.homeTeam)) {
                matchingGame = g;
                break;
              }
            }
          }

          if (!matchingGame) continue;

          const winner = matchingGame.awayScore > matchingGame.homeScore ?
            "away" : "home";
          const betSide = (pick.bet?.side || "").toUpperCase();
          const outcome = calculateOutcome(matchingGame, {
            market: "MONEYLINE",
            side: betSide === "AWAY" ? "AWAY" : "HOME",
          });
          const units = pick.bet?.units || 1;
          const odds = pick.bet?.odds || 0;
          const profit = calculateProfit(outcome, odds, units);

          await betDoc.ref.update({
            "result.awayScore": matchingGame.awayScore,
            "result.homeScore": matchingGame.homeScore,
            "result.totalScore":
              matchingGame.awayScore + matchingGame.homeScore,
            "result.winner": winner,
            "result.outcome": outcome,
            "result.profit": parseFloat(profit.toFixed(2)),
            "result.units": units,
            "result.fetched": true,
            "result.fetchedAt":
              admin.firestore.FieldValue.serverTimestamp(),
            "result.source": "ESPN_MLB_API",
            "status": "COMPLETED",
          });

          mlbBetsGraded++;
          const pickTeam = pick.bet?.pick || pick.bet?.pickCode || betSide;
          logger.info(
              `⚾ MLB Model: ${pickTeam} ML ${odds} (${units}u) → ` +
              `${outcome} (${profit >= 0 ? "+" : ""}` +
              `${profit.toFixed(2)}u)`,
          );
        }

        logger.info(`MLB Model: Graded ${mlbBetsGraded} picks`);
      }
    } catch (mlbBetsError) {
      logger.error("Error grading MLB model picks:", mlbBetsError);
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
  // SOC knockout: a game that went to extra time / penalties (wentBeyond90,
  // only ever set for World Cup games) was level at 90 minutes, which is what
  // Polymarket's 3-way market settles on — so treat it as a draw for the
  // moneyline regardless of ESPN's ET-inflated score.
  const awayWin = game.wentBeyond90 ? false : game.awayScore > game.homeScore;
  const homeWin = game.wentBeyond90 ? false : game.homeScore > game.awayScore;

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
      // 3-way soccer support: DRAW is its own side; team sides lose on draws
      // (already the behavior here — a tie grades LOSS for HOME and AWAY).
      if (bet.side === "DRAW") {
        return (!awayWin && !homeWin) ? "WIN" : "LOSS";
      }
      if (bet.side === "HOME") {
        return homeWin ? "WIN" : "LOSS";
      } else {
        return awayWin ? "WIN" : "LOSS";
      }

    case "PUCK_LINE":
    case "PUCKLINE": {
      const spread = bet.line || 1.5;
      if (bet.side === "HOME") {
        const adjusted = (game.homeScore - game.awayScore) + spread;
        if (adjusted > 0) return "WIN";
        if (adjusted < 0) return "LOSS";
        return "PUSH";
      } else {
        const adjusted = (game.awayScore - game.homeScore) + spread;
        if (adjusted > 0) return "WIN";
        if (adjusted < 0) return "LOSS";
        return "PUSH";
      }
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

