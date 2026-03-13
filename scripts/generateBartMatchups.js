/**
 * Generate Matchup Intelligence for Today's Picks — CBB + NHL
 * 
 * Deep analytical context for social media writers:
 * - D1 average comparisons with percentile context
 * - Home/away framing throughout
 * - Matchup-specific narratives (offense vs opposing defense)
 * - Style clash analysis and vulnerability mapping
 * - Go-to zone breakdowns with exploitability ratings
 * - PREDICTION MARKET intelligence (Polymarket + Kalshi)
 *   - Whale trades, smart money flow, consensus probabilities
 *   - Kalshi spreads & totals
 * - NHL game analysis with model edges and market data
 * 
 * Usage: node scripts/generateBartMatchups.js
 */

import fs from 'fs/promises';
import * as dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { parseBarttorvik, parseBarttorvikPBP } from '../src/utils/barttorvik Parser.js';
import { parseBothFiles } from '../src/utils/oddsTraderParser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const TOTAL = 365;
const D1 = { eFG: 50.0, to: 17.0, oreb: 28.0, ftRate: 32.0, tempo: 67.5, close2: 52.0, far2: 36.0, three: 34.0 };

async function loadTeamMappings() {
  const csv = await fs.readFile(join(__dirname, '../public/basketball_teams.csv'), 'utf8');
  const mappings = new Map();
  for (const line of csv.split('\n').slice(1)) {
    if (!line.trim()) continue;
    const v = line.split(',');
    const m = { normalized: v[0]?.trim() || '', oddstrader: v[1]?.trim() || '', barttorvik: v[8]?.trim() || '' };
    if (m.normalized) mappings.set(m.normalized.toLowerCase(), m);
    if (m.oddstrader && m.oddstrader !== m.normalized) mappings.set(m.oddstrader.toLowerCase(), m);
  }
  return mappings;
}

function findBartName(teamName, mappings) {
  return mappings.get(teamName.toLowerCase().trim())?.barttorvik || teamName;
}

function pct(rank) { return Math.round(((TOTAL - rank) / TOTAL) * 100); }

function tier(rank) {
  const p = pct(rank);
  if (p >= 93) return 'elite (top 7%)';
  if (p >= 80) return 'strong (top 20%)';
  if (p >= 60) return 'above avg (top 40%)';
  if (p >= 40) return 'average';
  if (p >= 20) return 'below avg (bottom 40%)';
  return 'weak (bottom 20%)';
}

function vsAvg(val, avg, higherBetter) {
  const diff = val - avg;
  const sign = diff > 0 ? '+' : '';
  const quality = higherBetter
    ? (diff > 4 ? 'well above' : diff > 1.5 ? 'above' : diff > -1.5 ? 'near' : diff > -4 ? 'below' : 'well below')
    : (diff < -4 ? 'well above' : diff < -1.5 ? 'above' : diff < 1.5 ? 'near' : diff < 4 ? 'below' : 'well below');
  return `${sign}${diff.toFixed(1)} vs D1 avg (${quality} average)`;
}

function styleTag(team) {
  const threeRate = team.threeP_rate_off || 0;
  const tempo = team.adjTempo || 67.5;
  const tags = [];
  if (threeRate > 40) tags.push('3PT-heavy');
  else if (threeRate < 28) tags.push('paint-focused');
  if (tempo > 70) tags.push('up-tempo');
  else if (tempo < 65) tags.push('half-court');
  if ((team.to_off || 17) < 15) tags.push('ball-secure');
  else if ((team.to_off || 17) > 20) tags.push('turnover-prone');
  if ((team.oreb_off || 28) > 32) tags.push('glass-crashers');
  if ((team.ftRate_off || 32) > 38) tags.push('foul-drawers');
  return tags.length ? tags.join(', ') : 'balanced';
}

// Rank-driven matchup narrative — ranks are the truth, raw gaps lie
function matchupVerdict(offRank, defRank) {
  // Parse numeric rank from "#124" format
  const oR = typeof offRank === 'string' ? parseInt(offRank.replace('#', '')) : offRank;
  const dR = typeof defRank === 'string' ? parseInt(defRank.replace('#', '')) : defRank;
  if (!oR || !dR) return { label: 'NO DATA', detail: '' };

  const offTier = tier(oR);
  const defTier = tier(dR);
  const offGood = oR <= 100;
  const defGood = dR <= 100;
  const offElite = oR <= 50;
  const defElite = dR <= 50;
  const offWeak = oR > 250;
  const defWeak = dR > 250;

  if (offElite && defWeak) return { label: 'MAJOR MISMATCH', detail: `Elite offense (${offTier}) vs weak defense (${defTier}) — expect big numbers here` };
  if (offWeak && defElite) return { label: 'LOCKDOWN', detail: `Weak offense (${offTier}) vs elite defense (${defTier}) — this zone is shut down` };
  if (offElite && defElite) return { label: 'ELITE VS ELITE', detail: `Both are top-tier here (off ${offTier}, def ${defTier}) — unstoppable force meets immovable object` };
  if (offGood && defWeak) return { label: 'CLEAR ADVANTAGE', detail: `Strong offense (${offTier}) vs poor defense (${defTier}) — exploitable` };
  if (offWeak && defGood) return { label: 'TOUGH', detail: `Poor offense (${offTier}) against solid defense (${defTier}) — low efficiency expected` };
  if (offGood && defGood) return { label: 'COMPETITIVE', detail: `Both competent here (off ${offTier}, def ${defTier}) — execution decides this` };
  if (offWeak && defWeak) return { label: 'SLOPPY', detail: `Neither team excels (off ${offTier}, def ${defTier}) — ugly but unpredictable` };
  
  // Mixed / average
  const gap = oR - dR; // negative = offense ranked higher (better)
  if (gap < -80) return { label: 'OFFENSE FAVORED', detail: `Offense significantly better ranked (#${oR} vs #${dR} defense)` };
  if (gap > 80) return { label: 'DEFENSE FAVORED', detail: `Defense significantly better ranked (#${dR} vs #${oR} offense)` };
  return { label: 'TOSS-UP', detail: `Similar quality (off #${oR} vs def #${dR}) — no clear edge` };
}

function shotZoneNarrative(offFg, defFg, zone, offTeam, defTeam, offRankStr, defRankStr) {
  const avg = zone === 'close2' ? D1.close2 : zone === 'three' ? D1.three : D1.far2;
  const offVsAvg = offFg - avg;
  const defVsAvg = defFg - avg;
  const zoneName = zone === 'close2' ? 'at the rim/close 2' : zone === 'three' ? 'from 3PT' : 'from mid-range';
  const verdict = matchupVerdict(offRankStr, defRankStr);
  
  let n = `${offTeam} shoots ${offFg}% ${zoneName} (${offRankStr} in D1, ${offVsAvg > 0 ? '+' : ''}${offVsAvg.toFixed(1)}% vs D1 avg). `;
  n += `${defTeam} allows ${defFg}% ${zoneName} (${defRankStr} in D1, ${defVsAvg > 0 ? '+' : ''}${defVsAvg.toFixed(1)}% vs D1 avg). `;
  n += `${verdict.label}: ${verdict.detail}`;
  return n;
}

// ─── Market Intelligence Helpers ──────────────────────────────────────────

async function loadMarketData() {
  const poly = await readJsonSafe(join(__dirname, '../public/polymarket_data.json'));
  const kalshi = await readJsonSafe(join(__dirname, '../public/kalshi_data.json'));
  return { poly, kalshi };
}

async function readJsonSafe(path) {
  try {
    const raw = await fs.readFile(path, 'utf8');
    return JSON.parse(raw);
  } catch { return { CBB: {}, NHL: {} }; }
}

function formatMarketSection(polyData, kalshiData, away, home, L) {
  if (!polyData && !kalshiData) return;

  L.push(`  ┌─ PREDICTION MARKET INTELLIGENCE ─────────────────────────┐`);
  L.push('');

  // Consensus probabilities
  const pAway = polyData?.awayProb;
  const pHome = polyData?.homeProb;
  const kAway = kalshiData?.awayProb;
  const kHome = kalshiData?.homeProb;

  if (pAway != null && kAway != null) {
    const consAway = ((pAway + kAway) / 2).toFixed(1);
    const consHome = ((pHome + kHome) / 2).toFixed(1);
    L.push(`  CONSENSUS WIN PROBABILITY (avg of Polymarket + Kalshi):`);
    L.push(`    ${away}: ${consAway}%  |  ${home}: ${consHome}%`);
    const diff = Math.abs(pAway - kAway);
    if (diff >= 5) {
      L.push(`    ⚡ ${diff.toFixed(1)}% DIVERGENCE between markets — potential opportunity`);
    }
    L.push(`    Polymarket: ${away} ${pAway}% / ${home} ${pHome}%`);
    L.push(`    Kalshi:     ${away} ${kAway}% / ${home} ${kHome}%`);
  } else if (pAway != null) {
    L.push(`  POLYMARKET WIN PROBABILITY:`);
    L.push(`    ${away}: ${pAway}%  |  ${home}: ${pHome}%`);
  } else if (kAway != null) {
    L.push(`  KALSHI WIN PROBABILITY:`);
    L.push(`    ${away}: ${kAway}%  |  ${home}: ${kHome}%`);
  }
  L.push('');

  // Volume
  const polyVol = polyData?.liveVolume ?? polyData?.volume24h ?? 0;
  const kalshiVol = kalshiData?.volume24h ?? 0;
  const totalVol = polyVol + kalshiVol;
  if (totalVol > 0) {
    const parts = [];
    if (polyVol > 0) parts.push(`Polymarket $${(polyVol / 1000).toFixed(1)}K`);
    if (kalshiVol > 0) parts.push(`Kalshi ${kalshiVol.toLocaleString()} contracts`);
    L.push(`  VOLUME: ${parts.join(' | ')} — total market activity: $${(totalVol / 1000).toFixed(1)}K`);
  }

  // Smart money flow (Polymarket)
  const mBuy = polyData?.moneyBuyPct ?? polyData?.buyPct;
  const tBuy = polyData?.ticketBuyPct;
  if (mBuy != null) {
    L.push(`  SMART MONEY FLOW (Polymarket):`);
    if (tBuy != null) {
      L.push(`    Tickets: ${tBuy}% Buy / ${(100 - tBuy).toFixed(1)}% Sell`);
    }
    L.push(`    Money:   ${mBuy}% Buy / ${(100 - mBuy).toFixed(1)}% Sell`);
    if (tBuy != null && mBuy > tBuy + 10) {
      L.push(`    💰 Money is MORE bullish than ticket count — big bettors loading up`);
    } else if (tBuy != null && tBuy > mBuy + 10) {
      L.push(`    🎫 More tickets than money — public betting one side, sharps may disagree`);
    }
  }

  // Kalshi trade flow
  const kFlow = kalshiData?.tradeFlow;
  if (kFlow && kFlow.tradeCount > 0) {
    L.push(`  KALSHI TRADE FLOW: ${kFlow.buyPct}% Buy / ${kFlow.sellPct}% Sell (${kFlow.tradeCount} trades)`);
  }
  L.push('');

  // Whale trades (Polymarket)
  const whales = polyData?.whales;
  if (whales && whales.count > 0) {
    L.push(`  🐋 WHALE TRADES (${whales.count} trades over $500 — $${(whales.totalCash / 1000).toFixed(1)}K total):`);
    const topTrades = whales.topTrades || [];
    for (const t of topTrades.slice(0, 5)) {
      const team = t.outcome || (t.side === 'BUY' ? away : home);
      L.push(`    ${t.side} ${team} — $${t.amount.toLocaleString()} @${t.price}¢${t.ts ? ` (${t.ts} UTC)` : ''}`);
    }
    L.push('');
  }

  // Price movement (Polymarket)
  const priceHist = polyData?.priceHistory;
  if (priceHist) {
    const change = priceHist.change;
    const direction = change > 0 ? '↑' : change < 0 ? '↓' : '→';
    const movingTeam = change > 0 ? away : home;
    L.push(`  24h PRICE MOVEMENT: ${away} ${priceHist.open}% → ${priceHist.current}% (${change > 0 ? '+' : ''}${change}%)`);
    if (change !== 0) {
      L.push(`    ${direction} ${movingTeam} gaining confidence — bettors are ${change > 0 ? 'buying' : 'selling'} ${away}`);
    }
    L.push(`    Range: Low ${priceHist.low}% / High ${priceHist.high}%`);
  }
  const move1h = polyData?.priceMove1h;
  if (move1h != null && move1h !== 0) {
    const toward = move1h > 0 ? away : home;
    L.push(`    Last 1h: ${move1h > 0 ? '+' : ''}${move1h}% toward ${toward}`);
  }
  L.push('');

  // Kalshi spreads
  const spreads = kalshiData?.spreads;
  if (spreads && spreads.length > 0) {
    L.push(`  KALSHI SPREAD MARKETS:`);
    for (const s of spreads) {
      L.push(`    ${s.label} — ${s.prob}% implied${s.volume > 0 ? ` (${s.volume} contracts)` : ''}`);
    }
    L.push('');
  }

  // Kalshi totals
  const totals = kalshiData?.totals;
  if (totals && totals.length > 0) {
    L.push(`  KALSHI GOAL/POINT TOTALS:`);
    for (const t of totals) {
      L.push(`    ${t.label} — ${t.prob}% implied${t.volume > 0 ? ` (${t.volume} contracts)` : ''}`);
    }
    L.push('');
  }
}

// ─── NHL Section Helpers ──────────────────────────────────────────────────

const nk = (n) => (n || '').toLowerCase().replace(/[^a-z0-9]/g, '');

function americanToImplied(odds) {
  if (!odds) return null;
  if (odds < 0) return Number(((-odds) / (-odds + 100) * 100).toFixed(1));
  return Number((100 / (odds + 100) * 100).toFixed(1));
}

async function generateMatchups() {
  console.log('🏀🏒 MATCHUP INTELLIGENCE GENERATOR v3 (CBB + NHL + Markets)\n');

  const bartMd = await fs.readFile(join(__dirname, '../public/Bart.md'), 'utf8');
  const pbpMd = await fs.readFile(join(__dirname, '../public/bart_pbp.md'), 'utf8');
  const bartData = parseBarttorvik(bartMd);
  const pbpData = parseBarttorvikPBP(pbpMd);
  const mappings = await loadTeamMappings();
  const { poly: marketPoly, kalshi: marketKalshi } = await loadMarketData();

  console.log(`📊 Loaded ${Object.keys(bartData).length} teams (T-Rank), ${Object.keys(pbpData).length} teams (PBP)`);
  console.log(`📈 Market data: Poly CBB=${Object.keys(marketPoly?.CBB || {}).length} NHL=${Object.keys(marketPoly?.NHL || {}).length} | Kalshi CBB=${Object.keys(marketKalshi?.CBB || {}).length} NHL=${Object.keys(marketKalshi?.NHL || {}).length}\n`);

  // Compute per-stat PBP ranks
  const pbpTeams = Object.values(pbpData);
  const pbpRanks = {};
  const rankDefs = [
    { key: 'close2_off_fg', higher: true }, { key: 'close2_def_fg', higher: false },
    { key: 'far2_off_fg', higher: true }, { key: 'far2_def_fg', higher: false },
    { key: 'three_off_fg', higher: true }, { key: 'three_def_fg', higher: false },
    { key: 'close2_off_share', higher: true }, { key: 'far2_off_share', higher: true },
    { key: 'three_off_share', higher: true },
  ];
  for (const { key, higher } of rankDefs) {
    const sorted = [...pbpTeams].sort((a, b) => higher ? (b[key] || 0) - (a[key] || 0) : (a[key] || 0) - (b[key] || 0));
    sorted.forEach((t, i) => {
      if (!pbpRanks[t.teamName]) pbpRanks[t.teamName] = {};
      pbpRanks[t.teamName][key] = i + 1;
    });
  }
  const rk = (team, stat) => pbpRanks[team]?.[stat] ? `#${pbpRanks[team][stat]}` : 'N/A';
  const rkTier = (team, stat) => {
    const rank = pbpRanks[team]?.[stat];
    if (!rank) return '';
    return tier(rank);
  };

  // Fetch today's live picks only — must match what the site displays
  // Use ET date (matches Basketball.jsx logic)
  const now = new Date();
  const etString = now.toLocaleString('en-US', { timeZone: 'America/New_York' });
  const etDate = new Date(etString);
  const today = `${etDate.getFullYear()}-${String(etDate.getMonth() + 1).padStart(2, '0')}-${String(etDate.getDate()).padStart(2, '0')}`;
  console.log(`   Date (ET): ${today}`);

  const betsSnap = await getDocs(query(collection(db, 'basketball_bets'), where('date', '==', today)));
  const allBets = [];
  betsSnap.forEach(d => allBets.push({ id: d.id, ...d.data() }));

  // Same filter as Basketball.jsx (line 337): exclude FLAGGED, KILLED, EVALUATION
  const bets = allBets.filter(b =>
    b.type !== 'EVALUATION' &&
    b.betStatus !== 'KILLED' &&
    b.betStatus !== 'FLAGGED'
  );

  console.log(`   Found ${allBets.length} total documents, ${bets.length} live picks (filtered out ${allBets.length - bets.length} evaluations/killed/flagged)\n`);

  if (bets.length === 0) {
    console.log('❌ No posted plays found for today.');
    process.exit(1);
  }

  const gameMap = new Map();
  for (const bet of bets) {
    const key = `${bet.game?.awayTeam}_${bet.game?.homeTeam}`;
    const existing = gameMap.get(key);
    const betUnits = bet.bet?.units || bet.prediction?.unitSize || 0;
    const existingUnits = existing?.bet?.units || existing?.prediction?.unitSize || 0;
    if (!existing || betUnits > existingUnits) gameMap.set(key, bet);
  }
  const games = Array.from(gameMap.values()).sort((a, b) => 
    (b.bet?.units || b.prediction?.unitSize || 0) - (a.bet?.units || a.prediction?.unitSize || 0)
  );

  const L = [];
  const dateFmt = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  
  L.push(`BARTTORVIK MATCHUP INTELLIGENCE — ${dateFmt}`);
  L.push('='.repeat(80));
  L.push(`${games.length} posted plays (BET_NOW / HOLD only) | Source: barttorvik.com T-Rank + Shooting Splits`);
  L.push(`D1 Averages: eFG% ${D1.eFG} | TO Rate ${D1.to} | ORB% ${D1.oreb} | FT Rate ${D1.ftRate} | Tempo ${D1.tempo}`);
  L.push('');

  for (const bet of games) {
    const away = bet.game?.awayTeam || 'Unknown';
    const home = bet.game?.homeTeam || 'Unknown';
    const aN = findBartName(away, mappings);
    const hN = findBartName(home, mappings);
    const aB = bartData[aN];
    const hB = bartData[hN];
    const aP = pbpData[aN];
    const hP = pbpData[hN];

    const units = bet.bet?.units || bet.prediction?.unitSize || 1;
    const stars = Math.min(units, 5);
    const pick = bet.bet?.team || bet.bet?.pick || bet.prediction?.bestTeam || home;
    const opp = pick === home ? away : home;
    const pickIsHome = pick === home;
    const isATS = bet.isATSPick || bet.betRecommendation?.type === 'ATS' || bet.bet?.market === 'SPREAD';
    const isTotals = bet.isTotalsPick || bet.betRecommendation?.type === 'TOTAL' || bet.bet?.market === 'TOTAL';
    const betType = isTotals ? `${bet.bet?.pick || bet.totalsAnalysis?.direction || 'TOTAL'}` : isATS ? 'ATS' : 'ML';
    const spread = isATS ? (bet.bet?.spread || bet.spreadAnalysis?.spread || '') : isTotals ? (bet.bet?.total || bet.totalsAnalysis?.marketTotal || '') : '';
    const mos = bet.spreadAnalysis?.marginOverSpread || bet.betRecommendation?.marginOverSpread;
    const mot = bet.totalsAnalysis?.marginOverTotal || bet.betRecommendation?.marginOverTotal;
    const edgeStr = isTotals ? (mot != null ? `MOT +${mot}` : 'N/A') : (mos != null ? `MOS +${mos}` : 'N/A');
    const mvLabel = bet.spreadAnalysis?.movementLabel || bet.totalsAnalysis?.movementLabel || bet.betRecommendation?.movementLabel || '';
    const mvTier = bet.spreadAnalysis?.movementTier || bet.totalsAnalysis?.movementTier || bet.betRecommendation?.movementTier || '';

    L.push('─'.repeat(80));
    L.push(`${'★'.repeat(stars)} ${away} (AWAY) @ ${home} (HOME)`);
    L.push(`PICK: ${pick} ${betType}${spread ? ` ${spread}` : ''} | ${units}u | ${edgeStr}${mvLabel ? ` | ${mvLabel}` : ''}${mvTier ? ` [${mvTier}]` : ''}`);
    L.push(`${pick} is ${pickIsHome ? 'HOME' : 'AWAY'} — ${pickIsHome ? 'home court advantage in play' : 'must win on the road'}`);
    L.push('');

    if (!aB || !hB) {
      L.push(`  ⚠️  Barttorvik data missing — skipping deep analysis`);
      L.push('');
      continue;
    }

    // ═══════════════════════════════════════════════
    // SECTION 1: TEAM PROFILES
    // ═══════════════════════════════════════════════
    L.push(`  ┌─ TEAM PROFILES ────────────────────────────────────────────┐`);
    L.push('');
    
    for (const [team, b, label] of [[away, aB, 'AWAY'], [home, hB, 'HOME']]) {
      const net = (b.adjOff - b.adjDef).toFixed(1);
      L.push(`  ${team} (${label}) — T-Rank #${b.rank} (${tier(b.rank)})`);
      L.push(`    Style: ${styleTag(b)}`);
      L.push(`    Adj. Offense: ${b.adjOff} (#${b.adjOff_rank}, ${tier(b.adjOff_rank)})`);
      L.push(`    Adj. Defense: ${b.adjDef} (#${b.adjDef_rank}, ${tier(b.adjDef_rank)}) — lower = better`);
      L.push(`    Net Rating: ${net > 0 ? '+' : ''}${net} (offense minus defense efficiency)`);
      L.push(`    Barthag: ${b.bartholomew} (#${b.bartholomew_rank}) — predicted win% vs avg D1 team`);
      L.push(`    Tempo: ${b.adjTempo} poss/40 (#${b.adjTempo_rank}) — D1 avg is ${D1.tempo}`);
      L.push('');
    }

    const rankDiff = Math.abs(aB.rank - hB.rank);
    const better = aB.rank < hB.rank ? away : home;
    const worse = aB.rank < hB.rank ? home : away;
    L.push(`  POWER GAP: ${better} is ${rankDiff} T-Rank spots higher than ${worse}.`);
    if (rankDiff > 100) L.push(`  This is a significant talent gap. ${worse} is a clear underdog by the numbers.`);
    else if (rankDiff > 50) L.push(`  Meaningful separation — ${better} is clearly the stronger program this season.`);
    else if (rankDiff > 20) L.push(`  Moderate gap — ${better} has an edge but this is competitive.`);
    else L.push(`  Very close — these teams are essentially peers. Game script and matchups will decide this.`);
    L.push('');

    // ═══════════════════════════════════════════════
    // SECTION 2: FOUR FACTORS (offense vs opposing defense)
    // ═══════════════════════════════════════════════
    L.push(`  ┌─ FOUR FACTORS (Offense vs Opposing Defense) ──────────────┐`);
    L.push('');

    // eFG%
    L.push(`  SHOOTING (eFG%)`);
    for (const [offTeam, off, defTeam, def] of [[away, aB, home, hB], [home, hB, away, aB]]) {
      const v = matchupVerdict(off.eFG_off_rank, def.eFG_def_rank);
      L.push(`    ${offTeam} offense: ${off.eFG_off}% eFG (#${off.eFG_off_rank}, ${tier(off.eFG_off_rank)})`);
      L.push(`      ${vsAvg(off.eFG_off, D1.eFG, true)}`);
      L.push(`      vs ${defTeam} defense: allows ${def.eFG_def}% eFG (#${def.eFG_def_rank}, ${tier(def.eFG_def_rank)})`);
      L.push(`      ${vsAvg(def.eFG_def, D1.eFG, false)}`);
      L.push(`      → ${v.label}: ${v.detail}`);
      L.push('');
    }

    // Turnovers — rank-driven narrative
    L.push(`  TURNOVER BATTLE`);
    for (const [offTeam, off, defTeam, def] of [[away, aB, home, hB], [home, hB, away, aB]]) {
      const offR = off.to_off_rank;
      const defR = def.to_def_rank;
      L.push(`    ${offTeam} commits ${off.to_off} TOs/100 (#${offR}, ${tier(offR)}) — ${vsAvg(off.to_off, D1.to, false)}`);
      L.push(`    ${defTeam} forces ${def.to_def} TOs/100 (#${defR}, ${tier(defR)}) — ${vsAvg(def.to_def, D1.to, true)}`);
      let risk;
      if (offR > 250 && defR <= 75) risk = `HIGH RISK: ${offTeam} is turnover-prone (#${offR}) and ${defTeam}'s defense forces turnovers at an elite rate (#${defR}) — expect live balls and transition points`;
      else if (offR <= 75 && defR > 250) risk = `LOW RISK: ${offTeam} takes care of the ball (#${offR}) and ${defTeam}'s defense rarely creates turnovers (#${defR}) — clean possessions expected`;
      else if (offR > 250) risk = `WATCH: ${offTeam} is turnover-prone (#${offR}) regardless of opponent — any pressure could be damaging`;
      else if (defR <= 50) risk = `WATCH: ${defTeam}'s defense is elite at forcing turnovers (#${defR}) — even good ball-handlers struggle here`;
      else if (offR <= 75 && defR <= 75) risk = `COMPETITIVE: ${offTeam} protects the ball (#${offR}) but ${defTeam}'s pressure is legit (#${defR}) — execution battle`;
      else risk = `NEUTRAL: Neither team's turnover profile (#${offR} offense, #${defR} defense) creates a clear narrative`;
      L.push(`      → ${risk}`);
      L.push('');
    }

    // Rebounding — rank-driven
    L.push(`  REBOUNDING (ORB%)`);
    for (const [offTeam, off, defTeam, def] of [[away, aB, home, hB], [home, hB, away, aB]]) {
      const offR = off.oreb_off_rank;
      const defR = def.oreb_def_rank;
      L.push(`    ${offTeam} crashes: ${off.oreb_off}% ORB (#${offR}, ${tier(offR)}) — ${vsAvg(off.oreb_off, D1.oreb, true)}`);
      L.push(`    ${defTeam} protects: ${def.oreb_def}% allowed (#${defR}, ${tier(defR)}) — ${vsAvg(def.oreb_def, D1.oreb, false)}`);
      const v = matchupVerdict(offR, defR);
      L.push(`      → ${v.label}: ${v.detail}`);
      L.push('');
    }

    // FT Rate — rank-driven
    L.push(`  FREE THROW RATE (FTA/FGA)`);
    for (const [offTeam, off, defTeam, def] of [[away, aB, home, hB], [home, hB, away, aB]]) {
      const offR = off.ftRate_off_rank;
      const defR = def.ftRate_def_rank;
      L.push(`    ${offTeam} draws: ${off.ftRate_off} FTA/FGA (#${offR}, ${tier(offR)}) — ${vsAvg(off.ftRate_off, D1.ftRate, true)}`);
      L.push(`    ${defTeam} allows: ${def.ftRate_def} FTA/FGA (#${defR}, ${tier(defR)}) — ${vsAvg(def.ftRate_def, D1.ftRate, false)}`);
      const v = matchupVerdict(offR, defR);
      let extra = '';
      if (offR <= 50 && defR > 250) extra = ` ${offTeam} draws fouls at an elite rate (#${offR}) and ${defTeam} is foul-prone (#${defR}) — bonus situations likely.`;
      else if (offR > 250 && defR <= 50) extra = ` ${defTeam} is extremely disciplined (#${defR}) — ${offTeam} won't get cheap points at the line.`;
      L.push(`      → ${v.label}: ${v.detail}${extra}`);
      L.push('');
    }

    // ═══════════════════════════════════════════════
    // SECTION 3: SHOT PROFILE DEEP DIVE
    // ═══════════════════════════════════════════════
    if (aP && hP) {
      L.push(`  ┌─ SHOT PROFILE DEEP DIVE ────────────────────────────────┐`);
      L.push('');

      for (const [offTeam, offPbp, defTeam, defPbp, offName, defName] of [[away, aP, home, hP, aN, hN], [home, hP, away, aP, hN, aN]]) {
        const goTo = offPbp.close2_off_share >= offPbp.three_off_share ? 'close 2 / paint' : '3-point line';
        const avoids = offPbp.far2_off_share < 15 ? 'mid-range' : null;
        
        L.push(`  ${offTeam} OFFENSIVE IDENTITY (vs ${defTeam} defense):`);
        L.push(`    Shot distribution: Close 2 ${offPbp.close2_off_share}% | 3PT ${offPbp.three_off_share}% | Mid ${offPbp.far2_off_share}%`);
        L.push(`    Primary scoring zone: ${goTo}${avoids ? ` (avoids ${avoids} — only ${offPbp.far2_off_share}% of shots)` : ''}`);
        L.push('');

        // Close 2
        L.push(`    CLOSE 2 / PAINT:`);
        L.push(`      ${shotZoneNarrative(offPbp.close2_off_fg, defPbp.close2_def_fg, 'close2', offTeam, defTeam, rk(offName, 'close2_off_fg'), rk(defName, 'close2_def_fg'))}`);
        L.push('');

        // 3PT
        L.push(`    THREE-POINT:`);
        L.push(`      ${shotZoneNarrative(offPbp.three_off_fg, defPbp.three_def_fg, 'three', offTeam, defTeam, rk(offName, 'three_off_fg'), rk(defName, 'three_def_fg'))}`);
        L.push('');

        // Mid
        L.push(`    MID-RANGE:`);
        L.push(`      ${shotZoneNarrative(offPbp.far2_off_fg, defPbp.far2_def_fg, 'far2', offTeam, defTeam, rk(offName, 'far2_off_fg'), rk(defName, 'far2_def_fg'))}`);
        L.push('');

        // Vulnerability spotlight — RANK-DRIVEN, not raw avg gaps
        const defZoneRanks = [
          { zone: 'close 2', fg: defPbp.close2_def_fg, rank: pbpRanks[defName]?.close2_def_fg || 999, offFg: offPbp.close2_off_fg, offRank: pbpRanks[offName]?.close2_off_fg || 999 },
          { zone: '3PT', fg: defPbp.three_def_fg, rank: pbpRanks[defName]?.three_def_fg || 999, offFg: offPbp.three_off_fg, offRank: pbpRanks[offName]?.three_off_fg || 999 },
          { zone: 'mid-range', fg: defPbp.far2_def_fg, rank: pbpRanks[defName]?.far2_def_fg || 999, offFg: offPbp.far2_off_fg, offRank: pbpRanks[offName]?.far2_off_fg || 999 },
        ].sort((a, b) => b.rank - a.rank); // worst defensive rank first

        const weakest = defZoneRanks[0];
        const strongest = defZoneRanks[defZoneRanks.length - 1];

        if (weakest.rank > 200) {
          L.push(`    🎯 VULNERABILITY: ${defTeam}'s worst defensive zone is ${weakest.zone} — ranked #${weakest.rank} in D1 (allows ${weakest.fg}%).`);
          if (weakest.offRank <= 100) {
            L.push(`    → ${offTeam} CAN exploit this — they're ranked #${weakest.offRank} offensively in this zone (${weakest.offFg}%). This is a real mismatch.`);
          } else if (weakest.offRank <= 200) {
            L.push(`    → ${offTeam} is average here (#${weakest.offRank}, ${weakest.offFg}%) — they might benefit from the weak defense but it's not a true mismatch.`);
          } else {
            L.push(`    → ${offTeam} is also poor here (#${weakest.offRank}, ${weakest.offFg}%) — the defensive weakness exists but ${offTeam} can't exploit it.`);
          }
        } else if (weakest.rank > 150) {
          L.push(`    ⚠️ SOFT SPOT: ${defTeam}'s least effective zone is ${weakest.zone} (#${weakest.rank}, allows ${weakest.fg}%) — below average but not terrible.`);
        } else {
          L.push(`    ✅ ${defTeam} is solid across all zones — weakest is ${weakest.zone} at #${weakest.rank}. No clear vulnerabilities.`);
        }

        if (strongest.rank <= 50) {
          L.push(`    🛡️ STRENGTH: ${defTeam} is elite at defending ${strongest.zone} — ranked #${strongest.rank} (allows ${strongest.fg}%). ${offTeam} should avoid this zone.`);
        }
        L.push('');
      }
    }

    // ═══════════════════════════════════════════════
    // SECTION 4: TEMPO & STYLE CLASH
    // ═══════════════════════════════════════════════
    L.push(`  ┌─ TEMPO & STYLE CLASH ─────────────────────────────────────┐`);
    L.push('');
    L.push(`  ${away} (AWAY): ${aB.adjTempo} poss/40 (#${aB.adjTempo_rank}, ${tier(aB.adjTempo_rank)}) — ${vsAvg(aB.adjTempo, D1.tempo, true)}`);
    L.push(`  ${home} (HOME): ${hB.adjTempo} poss/40 (#${hB.adjTempo_rank}, ${tier(hB.adjTempo_rank)}) — ${vsAvg(hB.adjTempo, D1.tempo, true)}`);
    
    const tempoDiff = Math.abs(aB.adjTempo - hB.adjTempo);
    const expectedTempo = ((aB.adjTempo + hB.adjTempo) / 2).toFixed(1);
    L.push(`  Expected game tempo: ~${expectedTempo} possessions`);
    
    if (tempoDiff > 5) {
      const fast = aB.adjTempo > hB.adjTempo ? away : home;
      const slow = aB.adjTempo > hB.adjTempo ? home : away;
      L.push(`  ⚡ MAJOR TEMPO CLASH (+${tempoDiff.toFixed(1)} gap): ${fast} wants to run, ${slow} wants to grind.`);
      L.push(`  Whoever controls pace likely controls the game. Home team (${home}) typically dictates tempo.`);
    } else if (tempoDiff > 3) {
      const faster = aB.adjTempo > hB.adjTempo ? away : home;
      L.push(`  Moderate tempo difference — ${faster} prefers a faster pace (+${tempoDiff.toFixed(1)}).`);
    } else {
      L.push(`  Similar tempo preferences — no pace-of-play mismatch. Both comfortable at this speed.`);
    }
    
    // Style compatibility
    const awayStyle = styleTag(aB);
    const homeStyle = styleTag(hB);
    L.push(`  ${away} style: ${awayStyle}`);
    L.push(`  ${home} style: ${homeStyle}`);
    L.push('');

    // ═══════════════════════════════════════════════
    // SECTION 5: ANALYTICAL EDGE SUMMARY
    // ═══════════════════════════════════════════════
    const pickB = pick === home ? hB : aB;
    const oppB = pick === home ? aB : hB;
    const pickP = pick === home ? hP : aP;
    const oppP = pick === home ? aP : hP;
    const pickName = pick === home ? hN : aN;
    const oppName = pick === home ? aN : hN;

    L.push(`  ┌─ WHY WE LIKE ${pick.toUpperCase()} (${pickIsHome ? 'HOME' : 'AWAY'}) ──────────────────────────┐`);
    L.push('');

    // Efficiency edge
    const offEdge = pickB.adjOff - oppB.adjOff;
    const defEdge = oppB.adjDef - pickB.adjDef;
    const netEdge = (pickB.adjOff - pickB.adjDef) - (oppB.adjOff - oppB.adjDef);
    
    L.push(`  EFFICIENCY:`);
    if (offEdge > 0) L.push(`    ✓ Better offense: ${pickB.adjOff} vs ${oppB.adjOff} (#${pickB.adjOff_rank} vs #${oppB.adjOff_rank}) — +${offEdge.toFixed(1)} pts/100 poss advantage`);
    else L.push(`    ✗ Weaker offense: ${pickB.adjOff} vs ${oppB.adjOff} (#${pickB.adjOff_rank} vs #${oppB.adjOff_rank}) — ${offEdge.toFixed(1)} pts/100 poss`);
    
    if (defEdge > 0) L.push(`    ✓ Better defense: ${pickB.adjDef} vs ${oppB.adjDef} (#${pickB.adjDef_rank} vs #${oppB.adjDef_rank}) — allows ${defEdge.toFixed(1)} fewer pts/100 poss`);
    else L.push(`    ✗ Weaker defense: ${pickB.adjDef} vs ${oppB.adjDef} (#${pickB.adjDef_rank} vs #${oppB.adjDef_rank})`);
    
    L.push(`    Net rating edge: ${netEdge > 0 ? '+' : ''}${netEdge.toFixed(1)} — ${Math.abs(netEdge) > 10 ? 'massive gap' : Math.abs(netEdge) > 5 ? 'significant edge' : Math.abs(netEdge) > 2 ? 'moderate edge' : 'very close'}`);
    L.push('');

    // Four factors advantages
    L.push(`  FOUR FACTORS ADVANTAGES:`);
    const efgEdge = pickB.eFG_off - oppB.eFG_off;
    if (Math.abs(efgEdge) > 0.5) L.push(`    ${efgEdge > 0 ? '✓' : '✗'} Shooting: ${pickB.eFG_off}% vs ${oppB.eFG_off}% eFG (${efgEdge > 0 ? '+' : ''}${efgEdge.toFixed(1)})`);
    
    const toEdge = oppB.to_off - pickB.to_off;
    if (Math.abs(toEdge) > 1) L.push(`    ${toEdge > 0 ? '✓' : '✗'} Ball security: ${pickB.to_off} vs ${oppB.to_off} TO rate (${toEdge > 0 ? 'fewer' : 'more'} turnovers)`);
    
    const orebEdge = pickB.oreb_off - oppB.oreb_off;
    if (Math.abs(orebEdge) > 1) L.push(`    ${orebEdge > 0 ? '✓' : '✗'} Offensive boards: ${pickB.oreb_off}% vs ${oppB.oreb_off}% ORB`);
    
    const ftEdge = pickB.ftRate_off - oppB.ftRate_off;
    if (Math.abs(ftEdge) > 2) L.push(`    ${ftEdge > 0 ? '✓' : '✗'} Getting to the line: ${pickB.ftRate_off} vs ${oppB.ftRate_off} FT rate`);
    L.push('');

    // Shot profile matchup edge
    if (pickP && oppP) {
      L.push(`  KEY SHOT MATCHUP EDGES:`);
      
      const zones = [
        { name: 'Close 2', offFg: pickP.close2_off_fg, defFg: oppP.close2_def_fg, share: pickP.close2_off_share,
          offRank: pbpRanks[pickName]?.close2_off_fg || 999, defRank: pbpRanks[oppName]?.close2_def_fg || 999 },
        { name: '3PT', offFg: pickP.three_off_fg, defFg: oppP.three_def_fg, share: pickP.three_off_share,
          offRank: pbpRanks[pickName]?.three_off_fg || 999, defRank: pbpRanks[oppName]?.three_def_fg || 999 },
        { name: 'Mid', offFg: pickP.far2_off_fg, defFg: oppP.far2_def_fg, share: pickP.far2_off_share,
          offRank: pbpRanks[pickName]?.far2_off_fg || 999, defRank: pbpRanks[oppName]?.far2_def_fg || 999 },
      ];
      
      for (const z of zones) {
        if (z.share < 10) continue;
        const v = matchupVerdict(z.offRank, z.defRank);
        const favorable = z.offRank < z.defRank;
        const significant = Math.abs(z.offRank - z.defRank) > 50;
        if (significant || z.offRank <= 75 || z.defRank > 200) {
          L.push(`    ${favorable ? '✓' : '✗'} ${z.name}: ${pick} #${z.offRank} offense (${z.offFg}%) vs ${opp} #${z.defRank} defense (allows ${z.defFg}%) — ${v.label} (${z.share}% of shots)`);
        }
      }
      
      // Opponent's biggest vulnerability — by rank, not raw averages
      const oppWeakZones = [
        { zone: 'close 2', defRank: pbpRanks[oppName]?.close2_def_fg || 999, fg: oppP.close2_def_fg,
          pickOffRank: pbpRanks[pickName]?.close2_off_fg || 999, pickFg: pickP.close2_off_fg },
        { zone: '3PT', defRank: pbpRanks[oppName]?.three_def_fg || 999, fg: oppP.three_def_fg,
          pickOffRank: pbpRanks[pickName]?.three_off_fg || 999, pickFg: pickP.three_off_fg },
        { zone: 'mid', defRank: pbpRanks[oppName]?.far2_def_fg || 999, fg: oppP.far2_def_fg,
          pickOffRank: pbpRanks[pickName]?.far2_off_fg || 999, pickFg: pickP.far2_off_fg },
      ].sort((a, b) => b.defRank - a.defRank);
      
      if (oppWeakZones[0].defRank > 200) {
        const v = oppWeakZones[0];
        L.push(`    🎯 ${opp}'s weakest zone: ${v.zone} (#${v.defRank} defense, allows ${v.fg}%).`);
        if (v.pickOffRank <= 100) {
          L.push(`       ${pick} is #${v.pickOffRank} in this zone (${v.pickFg}%) — EXPLOITABLE MISMATCH`);
        } else {
          L.push(`       ${pick} is #${v.pickOffRank} here (${v.pickFg}%) — weak defense exists but ${pick} may not capitalize`);
        }
      }
      L.push('');
    }

    // Home court context
    if (pickIsHome) {
      L.push(`  HOME COURT: ${pick} has the crowd, familiar rims, and typically a 3-4 point built-in advantage.`);
    } else {
      L.push(`  ROAD GAME: ${pick} must overcome typical 3-4 point home court disadvantage. Our model's edge accounts for this.`);
    }
    L.push('');

    // ═══════════════════════════════════════════════
    // SECTION 6: PREDICTION MARKET INTELLIGENCE
    // ═══════════════════════════════════════════════
    const marketKey = `${nk(away)}_${nk(home)}`;
    const polyGame = marketPoly?.CBB?.[marketKey] || null;
    const kalshiGame = marketKalshi?.CBB?.[marketKey] || null;
    formatMarketSection(polyGame, kalshiGame, away, home, L);

    // Betting context
    L.push(`  BETTING CONTEXT:`);
    L.push(`    ${edgeStr} — model projects ${pick} to ${isTotals ? 'hit the ' + betType + ' by this margin' : 'cover by this margin beyond the spread'}`);
    if (mvLabel) L.push(`    Line Movement: ${mvLabel} [${mvTier}] — ${mvTier === 'CONFIRM' ? 'market confirms our thesis' : mvTier === 'FLAGGED' ? 'market moving against' : 'neutral'}`);
    L.push(`    Confidence: ${'★'.repeat(stars)}${'☆'.repeat(5 - stars)} (${units}u)`);
    L.push('');
  }

  L.push('─'.repeat(80));
  L.push('');

  // ══════════════════════════════════════════════════════════════════════
  // PART 2: NHL MATCHUP INTELLIGENCE
  // ══════════════════════════════════════════════════════════════════════

  // Load NHL schedule and bets
  let nhlGames = [];
  try {
    const moneyMd = await fs.readFile(join(__dirname, '../public/odds_money.md'), 'utf8');
    let totalMd = '';
    try { totalMd = await fs.readFile(join(__dirname, '../public/odds_total.md'), 'utf8'); } catch {}
    nhlGames = parseBothFiles(moneyMd, totalMd);
    console.log(`🏒 Loaded ${nhlGames.length} NHL games from today's schedule`);
  } catch (e) {
    console.warn('Could not load NHL schedule:', e.message);
  }

  // Fetch NHL bets from Firebase
  const nhlBetsSnap = await getDocs(query(collection(db, 'bets'), where('date', '==', today)));
  const allNhlBets = [];
  nhlBetsSnap.forEach(d => allNhlBets.push({ id: d.id, ...d.data() }));
  const nhlBets = allNhlBets.filter(b =>
    b.status !== 'KILLED' && b.status !== 'FLAGGED' &&
    b.bet?.market && b.game?.awayTeam && b.game?.homeTeam
  );

  // Group NHL bets by game
  const nhlBetsByGame = new Map();
  for (const bet of nhlBets) {
    const key = `${bet.game.awayTeam}_${bet.game.homeTeam}`;
    if (!nhlBetsByGame.has(key)) nhlBetsByGame.set(key, []);
    nhlBetsByGame.get(key).push(bet);
  }

  console.log(`🏒 Found ${nhlBets.length} NHL bets across ${nhlBetsByGame.size} games\n`);

  if (nhlGames.length > 0 || nhlBetsByGame.size > 0) {
    L.push('');
    L.push('═'.repeat(80));
    L.push(`NHL MATCHUP INTELLIGENCE — ${dateFmt}`);
    L.push('═'.repeat(80));
    L.push(`${nhlGames.length} games on today's slate | ${nhlBetsByGame.size} games with posted picks`);
    L.push('');

    // Process each NHL game that has a bet
    const processedNhlGames = [];
    for (const game of nhlGames) {
      const key = `${game.awayTeam}_${game.homeTeam}`;
      const gameBets = nhlBetsByGame.get(key) || [];
      if (gameBets.length === 0) continue;
      processedNhlGames.push({ game, bets: gameBets, key });
    }

    // Also include bets for games not in schedule (edge case)
    for (const [key, bets] of nhlBetsByGame) {
      if (!processedNhlGames.find(g => g.key === key)) {
        const [away, home] = key.split('_');
        processedNhlGames.push({
          game: { awayTeam: away, homeTeam: home, moneyline: {} },
          bets,
          key,
        });
      }
    }

    // Sort by highest-unit bet
    processedNhlGames.sort((a, b) => {
      const aMax = Math.max(...a.bets.map(bb => bb.prediction?.unitSize || bb.bet?.units || 0));
      const bMax = Math.max(...b.bets.map(bb => bb.prediction?.unitSize || bb.bet?.units || 0));
      return bMax - aMax;
    });

    for (const { game, bets, key } of processedNhlGames) {
      const away = game.awayTeam;
      const home = game.homeTeam;

      L.push('─'.repeat(80));
      L.push(`🏒 ${away} (AWAY) @ ${home} (HOME)${game.gameTime ? ` — ${game.gameTime}` : ''}`);
      L.push('');

      // Odds
      if (game.moneyline?.away || game.moneyline?.home) {
        const awayOdds = game.moneyline.away;
        const homeOdds = game.moneyline.home;
        const awayImpl = americanToImplied(awayOdds);
        const homeImpl = americanToImplied(homeOdds);
        L.push(`  ODDS:`);
        L.push(`    ${away}: ${awayOdds > 0 ? '+' : ''}${awayOdds} (${awayImpl}% implied)`);
        L.push(`    ${home}: ${homeOdds > 0 ? '+' : ''}${homeOdds} (${homeImpl}% implied)`);
      }
      if (game.total?.line) {
        L.push(`    Total: O/U ${game.total.line}${game.total.over ? ` (Over ${game.total.over > 0 ? '+' : ''}${game.total.over} / Under ${game.total.under > 0 ? '+' : ''}${game.total.under})` : ''}`);
      }
      if (game.puckLine?.away?.spread) {
        L.push(`    Puck Line: ${away} ${game.puckLine.away.spread} (${game.puckLine.away.odds}) | ${home} ${game.puckLine.home.spread} (${game.puckLine.home.odds})`);
      }
      L.push('');

      // Posted picks
      L.push(`  POSTED PICKS:`);
      for (const bet of bets) {
        const market = bet.bet?.market || 'MONEYLINE';
        const pick = bet.bet?.pick || bet.bet?.team || '?';
        const odds = bet.bet?.odds;
        const units = bet.prediction?.unitSize || bet.bet?.units || 1;
        const stars = Math.min(Math.round(units), 5);
        const modelProb = bet.prediction?.modelProb || bet.prediction?.awayWinProb;
        const ev = bet.prediction?.evPercent;
        const grade = bet.prediction?.qualityGrade || '';
        const confidence = bet.prediction?.confidence || '';

        L.push(`    ${'★'.repeat(stars)}${'☆'.repeat(5 - stars)} ${pick} (${market}) ${odds ? `@ ${odds > 0 ? '+' : ''}${odds}` : ''} — ${units}u`);
        if (modelProb) L.push(`      Model: ${(modelProb * 100).toFixed(1)}% win probability`);
        if (ev) L.push(`      EV: +${typeof ev === 'number' ? ev.toFixed(1) : ev}%${grade ? ` | Grade: ${grade}` : ''}${confidence ? ` | ${confidence}` : ''}`);
      }
      L.push('');

      // Market intelligence
      const mKey = `${nk(away)}_${nk(home)}`;
      const polyGame = marketPoly?.NHL?.[mKey] || null;
      const kalshiGame = marketKalshi?.NHL?.[mKey] || null;
      formatMarketSection(polyGame, kalshiGame, away, home, L);

      // Model vs Market comparison
      const bestBet = bets.sort((a, b) => (b.prediction?.evPercent || 0) - (a.prediction?.evPercent || 0))[0];
      const modelWin = bestBet?.prediction?.modelProb;
      const consAway = polyGame?.awayProb != null && kalshiGame?.awayProb != null
        ? (polyGame.awayProb + kalshiGame.awayProb) / 2
        : polyGame?.awayProb ?? kalshiGame?.awayProb;

      if (modelWin && consAway != null) {
        const pickIsAway = bestBet?.bet?.side === 'AWAY' || bestBet?.bet?.team === away;
        const marketPickProb = pickIsAway ? consAway : (100 - consAway);
        const modelPickProb = pickIsAway ? modelWin * 100 : (1 - modelWin) * 100;
        const agrees = marketPickProb > 50;
        const delta = Math.abs(marketPickProb - modelPickProb).toFixed(1);
        const pickTeam = pickIsAway ? away : home;

        L.push(`  MODEL vs MARKET:`);
        if (agrees) {
          L.push(`    ✓ AGREES: Both model and markets favor ${pickTeam}. Market at ${marketPickProb.toFixed(1)}%, model at ${modelPickProb.toFixed(1)}% (${delta}% gap)`);
        } else {
          L.push(`    ⚡ DIVERGES: Model picks ${pickTeam} but markets favor ${pickIsAway ? home : away}. Contrarian play — ${delta}% gap`);
        }
        L.push('');
      }
    }

    if (processedNhlGames.length === 0) {
      L.push('  No NHL picks posted for today.');
      L.push('');
    }
  }

  L.push('─'.repeat(80));
  L.push('');
  L.push('WRITING GUIDANCE:');
  L.push('- Lead with the most dramatic matchup mismatch (shot zone exploits, elite vs weak)');
  L.push('- Use specific numbers: "shoots 60.4% at the rim (#124 in D1)" > "good at scoring inside"');
  L.push('- Frame as offense vs defense: "GW\'s elite 3PT shooting meets VCU\'s top-30 rim protection"');
  L.push('- Include D1 context: "5 points above D1 average" tells the reader HOW good, not just good');
  L.push('- Mention home/away — it matters for narrative and the 3-4 point swing');
  L.push('- For NHL: Lead with model edge, market consensus, and any whale activity');
  L.push('- When markets DIVERGE from model, highlight the contrarian angle');
  L.push('- Use whale trade data to show "smart money" direction');
  L.push('');

  const output = L.join('\n');
  console.log('\n' + output);

  const outputPath = join(__dirname, '../public/bart_matchups_today.txt');
  await fs.writeFile(outputPath, output, 'utf8');
  console.log(`\n📄 Saved to: public/bart_matchups_today.txt`);
  process.exit(0);
}

generateMatchups().catch(err => {
  console.error('❌ ERROR:', err.message);
  process.exit(1);
});
