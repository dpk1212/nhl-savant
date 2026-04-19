/**
 * gradeSharpActions.js — Grade Today's Action positions with game results
 *
 * Queries PENDING positions from `sharp_action_positions`, fetches final
 * scores from NHL API / ESPN (MLB, NBA) / NCAA API (CBB), then grades
 * each position WIN / LOSS / PUSH and records CLV where closing odds exist.
 *
 * Also captures closing Pinnacle odds from pinnacle_history.json for CLV.
 *
 * Usage: node scripts/gradeSharpActions.js
 * Schedule: run every 30 min (after games finish)
 */

import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, '../public');
const COLLECTION = 'sharp_action_positions';

const NHL_SCHEDULE_URL = 'https://api-web.nhle.com/v1/schedule';
const NCAA_API_URL = 'https://ncaa-api.henrygd.me/scoreboard/basketball-men/d1';
const ESPN_MLB_URL = 'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard';
const ESPN_NBA_URL = 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard';

const ABBREV_MAP = {
  bos: 'BOS', tor: 'TOR', mtl: 'MTL', ott: 'OTT', buf: 'BUF', det: 'DET',
  tbl: 'TBL', fla: 'FLA', car: 'CAR', wsh: 'WSH', pit: 'PIT', phi: 'PHI',
  njd: 'NJD', cbj: 'CBJ', nsh: 'NSH', wpg: 'WPG', chi: 'CHI', min: 'MIN',
  dal: 'DAL', stl: 'STL', col: 'COL', uta: 'UTA', vgk: 'VGK', lak: 'LAK',
  ana: 'ANA', sjs: 'SJS', cgy: 'CGY', edm: 'EDM', van: 'VAN', sea: 'SEA',
  nyr: 'NYR', nyi: 'NYI',
};

const ESPN_MLB_TO_CODE = {
  ARI: 'ari', ATL: 'atl', BAL: 'bal', BOS: 'bos', CHC: 'chc', CWS: 'cws',
  CIN: 'cin', CLE: 'cle', COL: 'col', DET: 'det', HOU: 'hou', KC: 'kcr',
  LAA: 'laa', LAD: 'lad', MIA: 'mia', MIL: 'mil', MIN: 'min', NYM: 'nym',
  NYY: 'nyy', OAK: 'oak', PHI: 'phi', PIT: 'pit', SD: 'sdp', SF: 'sfg',
  SEA: 'sea', STL: 'stl', TB: 'tbr', TEX: 'tex', TOR: 'tor', WSH: 'wsh',
};

const ESPN_NBA_TO_CODE = {
  ATL: 'atl', BOS: 'bos', BKN: 'bkn', CHA: 'cha', CHI: 'chi', CLE: 'cle',
  DAL: 'dal', DEN: 'den', DET: 'det', GS: 'gsw', HOU: 'hou', IND: 'ind',
  LAC: 'lac', LAL: 'lal', MEM: 'mem', MIA: 'mia', MIL: 'mil', MIN: 'min',
  NO: 'nop', NY: 'nyk', NYK: 'nyk', OKC: 'okc', ORL: 'orl', PHI: 'phi',
  PHX: 'phx', POR: 'por', SAC: 'sac', SA: 'sas', SAS: 'sas', TOR: 'tor',
  UTAH: 'uth', UTA: 'uth', WAS: 'was', WSH: 'was',
  GSW: 'gsw', NOP: 'nop',
};

function initFirebase() {
  if (!admin.apps.length) {
    const sakPath = join(__dirname, '../serviceAccountKey.json');
    if (existsSync(sakPath)) {
      admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(sakPath, 'utf8'))) });
    } else {
      admin.initializeApp({
        credential: admin.credential.cert({
          project_id: process.env.VITE_FIREBASE_PROJECT_ID,
          client_email: process.env.FIREBASE_CLIENT_EMAIL,
          private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    }
  }
  const db = admin.firestore();
  db.settings({ ignoreUndefinedProperties: true });
  return db;
}

function impliedProb(odds) {
  if (!odds || odds === 0) return null;
  return odds < 0 ? Math.abs(odds) / (Math.abs(odds) + 100) : 100 / (odds + 100);
}

function normalizeName(s) {
  return (s || '').toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\bsaint\b/g, 'st')
    .replace(/\bstate\b/g, 'st')
    .replace(/\s+/g, '')
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
    if (shorter.length / longer.length >= 0.4) return true;
  }
  return false;
}

// ─── Score fetchers ──────────────────────────────────────────────────────────

async function fetchNHLFinalGames(dateStr) {
  try {
    const res = await fetch(`${NHL_SCHEDULE_URL}/${dateStr}`);
    if (!res.ok) return [];
    const data = await res.json();
    const games = [];
    for (const day of data.gameWeek || []) {
      for (const g of day.games || []) {
        if (g.gameState !== 'OFF' && g.gameState !== 'FINAL') continue;
        const away = ABBREV_MAP[g.awayTeam?.abbrev?.toLowerCase()] || g.awayTeam?.abbrev;
        const home = ABBREV_MAP[g.homeTeam?.abbrev?.toLowerCase()] || g.homeTeam?.abbrev;
        games.push({
          awayTeam: away, homeTeam: home,
          awayScore: g.awayTeam?.score || 0, homeScore: g.homeTeam?.score || 0,
        });
      }
    }
    return games;
  } catch (e) {
    console.error('NHL fetch error:', e.message);
    return [];
  }
}

async function fetchNCAAFinalGames(dateStr) {
  try {
    const formatted = dateStr.replace(/-/g, '/');
    const res = await fetch(`${NCAA_API_URL}/${formatted}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.games || [])
      .filter(g => g.game?.gameState === 'final')
      .map(g => ({
        awayTeam: g.game.away?.names?.short || '',
        homeTeam: g.game.home?.names?.short || '',
        awayScore: parseInt(g.game.away?.score) || 0,
        homeScore: parseInt(g.game.home?.score) || 0,
      }));
  } catch (e) {
    console.error('NCAA fetch error:', e.message);
    return [];
  }
}

async function fetchMLBFinalGames() {
  try {
    const res = await fetch(ESPN_MLB_URL);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.events || [])
      .filter(e => {
        const st = e.competitions?.[0]?.status?.type;
        return st?.state === 'post' || st?.completed;
      })
      .map(e => {
        const comp = e.competitions[0];
        const comps = comp.competitors || [];
        const away = comps.find(c => c.homeAway === 'away') || {};
        const home = comps.find(c => c.homeAway === 'home') || {};
        return {
          awayCode: ESPN_MLB_TO_CODE[away.team?.abbreviation] || away.team?.abbreviation?.toLowerCase(),
          homeCode: ESPN_MLB_TO_CODE[home.team?.abbreviation] || home.team?.abbreviation?.toLowerCase(),
          awayTeam: away.team?.displayName || '',
          homeTeam: home.team?.displayName || '',
          awayScore: parseInt(away.score) || 0,
          homeScore: parseInt(home.score) || 0,
        };
      });
  } catch (e) {
    console.error('ESPN MLB fetch error:', e.message);
    return [];
  }
}

async function fetchNBAFinalGames() {
  try {
    const res = await fetch(ESPN_NBA_URL);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.events || [])
      .filter(e => {
        const st = e.competitions?.[0]?.status?.type;
        return st?.state === 'post' || st?.completed;
      })
      .map(e => {
        const comp = e.competitions[0];
        const comps = comp.competitors || [];
        const away = comps.find(c => c.homeAway === 'away') || {};
        const home = comps.find(c => c.homeAway === 'home') || {};
        return {
          awayCode: ESPN_NBA_TO_CODE[away.team?.abbreviation] || away.team?.abbreviation?.toLowerCase(),
          homeCode: ESPN_NBA_TO_CODE[home.team?.abbreviation] || home.team?.abbreviation?.toLowerCase(),
          awayTeam: away.team?.displayName || '',
          homeTeam: home.team?.displayName || '',
          awayScore: parseInt(away.score) || 0,
          homeScore: parseInt(home.score) || 0,
        };
      });
  } catch (e) {
    console.error('ESPN NBA fetch error:', e.message);
    return [];
  }
}

// ─── Outcome calculation (mirrors betTracking.js) ───────────────────────────

function calculateOutcome(game, marketType, side, line) {
  const totalScore = game.awayScore + game.homeScore;
  const awayWin = game.awayScore > game.homeScore;
  const homeWin = game.homeScore > game.awayScore;

  if (marketType === 'TOTAL') {
    if (!line) return null;
    if (side === 'over') {
      if (totalScore > line) return 'WIN';
      if (totalScore < line) return 'LOSS';
      return 'PUSH';
    } else {
      if (totalScore < line) return 'WIN';
      if (totalScore > line) return 'LOSS';
      return 'PUSH';
    }
  }

  if (marketType === 'SPREAD') {
    if (line == null) return null;
    if (side === 'home') {
      const adjusted = (game.homeScore - game.awayScore) + line;
      if (adjusted > 0) return 'WIN';
      if (adjusted < 0) return 'LOSS';
      return 'PUSH';
    } else {
      const adjusted = (game.awayScore - game.homeScore) + line;
      if (adjusted > 0) return 'WIN';
      if (adjusted < 0) return 'LOSS';
      return 'PUSH';
    }
  }

  // ML
  if (side === 'home') return homeWin ? 'WIN' : (awayWin ? 'LOSS' : 'PUSH');
  return awayWin ? 'WIN' : (homeWin ? 'LOSS' : 'PUSH');
}

// ─── Match a position's gameKey to a final game ─────────────────────────────

function findMatchingGame(pos, nhlFinals, cbbFinals, mlbFinals, nbaFinals) {
  const rawKey = (pos.gameKey || '').replace(/^(NHL|NBA|MLB|CBB):/, '');
  const parts = rawKey.split('_');

  if (pos.sport === 'NHL') {
    if (parts.length < 2) return null;
    const awayAbbr = ABBREV_MAP[parts[0]] || parts[0].toUpperCase();
    const homeAbbr = ABBREV_MAP[parts[1]] || parts[1].toUpperCase();
    return nhlFinals.find(g => g.awayTeam === awayAbbr && g.homeTeam === homeAbbr) || null;
  }

  if (pos.sport === 'MLB') {
    if (parts.length >= 2) {
      const match = mlbFinals.find(g => g.awayCode === parts[0] && g.homeCode === parts[1]);
      if (match) return match;
    }
    for (const g of mlbFinals) {
      if (teamNamesMatch(pos.away, g.awayTeam) && teamNamesMatch(pos.home, g.homeTeam)) return g;
    }
    return null;
  }

  if (pos.sport === 'NBA') {
    if (parts.length >= 2) {
      const match = nbaFinals.find(g => g.awayCode === parts[0] && g.homeCode === parts[1]);
      if (match) return match;
    }
    for (const g of nbaFinals) {
      if (teamNamesMatch(pos.away, g.awayTeam) && teamNamesMatch(pos.home, g.homeTeam)) return g;
    }
    return null;
  }

  if (pos.sport === 'CBB') {
    for (const g of cbbFinals) {
      const normalMatch = teamNamesMatch(pos.away, g.awayTeam) && teamNamesMatch(pos.home, g.homeTeam);
      const reversedMatch = teamNamesMatch(pos.away, g.homeTeam) && teamNamesMatch(pos.home, g.awayTeam);
      if (normalMatch) return { awayScore: g.awayScore, homeScore: g.homeScore };
      if (reversedMatch) return { awayScore: g.homeScore, homeScore: g.awayScore };
    }
    return null;
  }

  return null;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const db = initFirebase();
  console.log('\n=== gradeSharpActions ===\n');

  // Load closing pinnacle odds for CLV
  const pinnacleHistory = (() => {
    const p = join(PUBLIC, 'pinnacle_history.json');
    if (!existsSync(p)) return {};
    return JSON.parse(readFileSync(p, 'utf8'));
  })();

  // Query all pending positions
  const snapshot = await db.collection(COLLECTION)
    .where('status', '==', 'PENDING')
    .get();

  if (snapshot.empty) {
    console.log('No pending positions to grade.');
    return;
  }
  console.log(`Found ${snapshot.size} pending positions to grade`);

  // Determine which sports / dates we need scores for
  const sports = new Set();
  const cbbDates = new Set();
  const nhlDates = new Set();
  snapshot.forEach(doc => {
    const d = doc.data();
    sports.add(d.sport);
    if (d.sport === 'CBB' && d.date) cbbDates.add(d.date);
    if (d.sport === 'NHL' && d.date) nhlDates.add(d.date);
  });

  // Fetch scores
  let nhlFinals = [];
  if (sports.has('NHL')) {
    for (const d of nhlDates) {
      const games = await fetchNHLFinalGames(d);
      nhlFinals.push(...games);
      console.log(`NHL API: ${games.length} final games for ${d}`);
    }
  }

  let cbbFinals = [];
  if (sports.has('CBB')) {
    for (const d of cbbDates) {
      const games = await fetchNCAAFinalGames(d);
      cbbFinals.push(...games);
      console.log(`NCAA API: ${games.length} final CBB games for ${d}`);
    }
  }

  let mlbFinals = [];
  if (sports.has('MLB')) {
    mlbFinals = await fetchMLBFinalGames();
    console.log(`ESPN MLB API: ${mlbFinals.length} final MLB games`);
  }

  let nbaFinals = [];
  if (sports.has('NBA')) {
    nbaFinals = await fetchNBAFinalGames();
    console.log(`ESPN NBA API: ${nbaFinals.length} final NBA games`);
  }

  // Grade each position
  let graded = 0, noGame = 0, errors = 0;
  const BATCH_SIZE = 400;
  const docs = snapshot.docs;

  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    const chunk = docs.slice(i, i + BATCH_SIZE);
    const batch = db.batch();
    let batchOps = 0;

    for (const doc of chunk) {
      const pos = doc.data();

      const game = findMatchingGame(pos, nhlFinals, cbbFinals, mlbFinals, nbaFinals);
      if (!game) {
        noGame++;
        continue;
      }

      let line = pos.marketType === 'SPREAD' ? (pos.spreadLine ?? pos.entryLine ?? null)
        : pos.marketType === 'TOTAL' ? (pos.totalLine ?? pos.entryLine ?? null)
        : null;

      // Fallback: look up line from pinnacle_history when stored line is null
      if (line == null && (pos.marketType === 'SPREAD' || pos.marketType === 'TOTAL')) {
        const pinnFallback = pinnacleHistory?.[pos.sport]?.[pos.gameKey];
        if (pinnFallback) {
          if (pos.marketType === 'SPREAD') {
            const sc = pinnFallback.spreadCurrent || pinnFallback.spreadOpener;
            line = pos.side === 'away' ? sc?.awayLine : sc?.homeLine;
            if (line == null) line = pos.side === 'away' ? pinnFallback.awaySpread : pinnFallback.homeSpread;
          } else {
            const tc = pinnFallback.totalCurrent || pinnFallback.totalOpener;
            line = tc?.line ?? pinnFallback.totalLine ?? null;
          }
          if (line != null) {
            console.log(`  [fallback] Using pinnacle line ${line} for ${doc.id}`);
          }
        }
      }

      const outcome = calculateOutcome(game, pos.marketType, pos.side, line);
      if (!outcome) {
        errors++;
        console.warn(`  Could not calculate outcome for ${doc.id} (line=${line})`);
        continue;
      }

      // CLV: compare entry odds to closing pinnacle
      let clv = null, closingPinnacleOdds = null;
      const pinnGame = pinnacleHistory?.[pos.sport]?.[pos.gameKey];
      if (pinnGame) {
        if (pos.marketType === 'ML') {
          closingPinnacleOdds = pos.side === 'away'
            ? (pinnGame.current?.away ?? pinnGame.awayOdds)
            : (pinnGame.current?.home ?? pinnGame.homeOdds);
        } else if (pos.marketType === 'SPREAD') {
          const sc = pinnGame.spreadCurrent;
          closingPinnacleOdds = pos.side === 'away'
            ? (sc?.awayOdds ?? pinnGame.awaySpreadOdds)
            : (sc?.homeOdds ?? pinnGame.homeSpreadOdds);
        } else {
          const tc = pinnGame.totalCurrent;
          closingPinnacleOdds = pos.side === 'over'
            ? (tc?.overOdds ?? pinnGame.overOdds)
            : (tc?.underOdds ?? pinnGame.underOdds);
        }

        if (closingPinnacleOdds && pos.pinnacleOdds) {
          const entryProb = impliedProb(pos.pinnacleOdds);
          const closeProb = impliedProb(closingPinnacleOdds);
          if (entryProb != null && closeProb != null) {
            clv = +((closeProb - entryProb) * 100).toFixed(2);
          }
        }
      }

      // Polymarket P&L calc (entry price vs outcome)
      const entryPrice = pos.avgPrice || 0;
      const settledPrice = outcome === 'WIN' ? 1.0 : outcome === 'LOSS' ? 0.0 : entryPrice;
      const settledPnl = Math.round((settledPrice - entryPrice) * (pos.size || 0));

      const pnlEmoji = outcome === 'WIN' ? '✅' : outcome === 'LOSS' ? '❌' : '⏸️';
      console.log(`  ${pnlEmoji} ${pos.sport} ${pos.teamName} ${pos.marketType} — ${outcome} | ` +
        `${pos.away} ${game.awayScore}-${game.homeScore} ${pos.home} | ` +
        `Invested: $${pos.invested} | P&L: $${settledPnl}` +
        (clv != null ? ` | CLV: ${clv > 0 ? '+' : ''}${clv}%` : ''));

      batch.update(doc.ref, {
        status: 'GRADED',
        result: outcome,
        'score.away': game.awayScore,
        'score.home': game.homeScore,
        settledPnl,
        settledPrice,
        closingPinnacleOdds,
        clv,
        gradedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      batchOps++;
      graded++;
    }

    if (batchOps > 0) await batch.commit();
  }

  console.log(`\nResults:`);
  console.log(`  Graded:     ${graded}`);
  console.log(`  No game:    ${noGame} (game not final yet)`);
  console.log(`  Errors:     ${errors}`);
  console.log(`  Remaining:  ${snapshot.size - graded} still pending`);

  // ─── Summary stats for graded positions ────────────────────────────────
  if (graded > 0) {
    const gradedDocs = await db.collection(COLLECTION)
      .where('status', '==', 'GRADED')
      .get();

    if (!gradedDocs.empty) {
      let wins = 0, losses = 0, pushes = 0, totalInvested = 0, totalSettledPnl = 0;
      let clvSum = 0, clvCount = 0;
      const byLabel = {};

      gradedDocs.forEach(doc => {
        const d = doc.data();
        if (d.result === 'WIN') wins++;
        else if (d.result === 'LOSS') losses++;
        else pushes++;
        totalInvested += d.invested || 0;
        totalSettledPnl += d.settledPnl || 0;
        if (d.clv != null) { clvSum += d.clv; clvCount++; }

        const lbl = d.label || 'SHARP_POSITION';
        if (!byLabel[lbl]) byLabel[lbl] = { w: 0, l: 0, p: 0, inv: 0, pnl: 0 };
        if (d.result === 'WIN') byLabel[lbl].w++;
        else if (d.result === 'LOSS') byLabel[lbl].l++;
        else byLabel[lbl].p++;
        byLabel[lbl].inv += d.invested || 0;
        byLabel[lbl].pnl += d.settledPnl || 0;
      });

      const total = wins + losses + pushes;
      const wr = total > 0 ? ((wins / (wins + losses)) * 100).toFixed(1) : '—';
      const roi = totalInvested > 0 ? ((totalSettledPnl / totalInvested) * 100).toFixed(1) : '—';
      const avgClv = clvCount > 0 ? (clvSum / clvCount).toFixed(2) : '—';

      console.log(`\n─── All-Time Sharp Action Performance ───`);
      console.log(`  Record:    ${wins}W-${losses}L-${pushes}P (${wr}% WR)`);
      console.log(`  Invested:  $${totalInvested.toLocaleString()}`);
      console.log(`  P&L:       $${totalSettledPnl.toLocaleString()}`);
      console.log(`  ROI:       ${roi}%`);
      console.log(`  Avg CLV:   ${avgClv}%`);

      console.log(`\n  By Label:`);
      for (const [lbl, s] of Object.entries(byLabel)) {
        const lWr = (s.w + s.l) > 0 ? ((s.w / (s.w + s.l)) * 100).toFixed(1) : '—';
        const lRoi = s.inv > 0 ? ((s.pnl / s.inv) * 100).toFixed(1) : '—';
        console.log(`    ${lbl}: ${s.w}W-${s.l}L-${s.p}P (${lWr}%) | $${s.inv.toLocaleString()} inv | $${s.pnl.toLocaleString()} P&L (${lRoi}% ROI)`);
      }
    }
  }

  console.log('\nDone.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
