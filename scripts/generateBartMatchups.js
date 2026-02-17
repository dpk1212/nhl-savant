/**
 * Generate Barttorvik Matchup Intelligence for Today's Picks
 * 
 * Deep analytical context for social media writers:
 * - D1 average comparisons with percentile context
 * - Home/away framing throughout
 * - Matchup-specific narratives (offense vs opposing defense)
 * - Style clash analysis and vulnerability mapping
 * - Go-to zone breakdowns with exploitability ratings
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

function shotZoneNarrative(offFg, defFg, zone, offTeam, defTeam, offRank, defRank) {
  const edge = offFg - defFg;
  const offVsAvg = offFg - (zone === 'close2' ? D1.close2 : zone === 'three' ? D1.three : D1.far2);
  const defVsAvg = defFg - (zone === 'close2' ? D1.close2 : zone === 'three' ? D1.three : D1.far2);
  const zoneName = zone === 'close2' ? 'at the rim/close 2' : zone === 'three' ? 'from 3PT' : 'from mid-range';
  
  let narrative = `${offTeam} shoots ${offFg}% ${zoneName} (${offRank} in D1, `;
  narrative += offVsAvg > 0 ? `+${offVsAvg.toFixed(1)}% above D1 avg` : `${offVsAvg.toFixed(1)}% below D1 avg`;
  narrative += `). ${defTeam} allows ${defFg}% ${zoneName} (${defRank} in D1, `;
  narrative += defVsAvg > 0 ? `+${defVsAvg.toFixed(1)}% worse than D1 avg — vulnerable` : `${defVsAvg.toFixed(1)}% better than D1 avg — tough`;
  narrative += `). `;
  
  if (edge > 5) narrative += `MAJOR MISMATCH: ${offTeam}'s strength directly exploits ${defTeam}'s weakness here.`;
  else if (edge > 2) narrative += `FAVORABLE: ${offTeam} should find success in this zone.`;
  else if (edge > -2) narrative += `NEUTRAL: Neither team has a clear edge — execution matters.`;
  else if (edge > -5) narrative += `DIFFICULT: ${defTeam}'s defense is better than ${offTeam}'s offense in this zone.`;
  else narrative += `LOCKDOWN: ${defTeam} dominates this zone defensively. ${offTeam} must avoid this area.`;
  
  return narrative;
}

async function generateMatchups() {
  console.log('🏀 BARTTORVIK MATCHUP INTELLIGENCE GENERATOR v2\n');

  const bartMd = await fs.readFile(join(__dirname, '../public/Bart.md'), 'utf8');
  const pbpMd = await fs.readFile(join(__dirname, '../public/bart_pbp.md'), 'utf8');
  const bartData = parseBarttorvik(bartMd);
  const pbpData = parseBarttorvikPBP(pbpMd);
  const mappings = await loadTeamMappings();

  console.log(`📊 Loaded ${Object.keys(bartData).length} teams (T-Rank), ${Object.keys(pbpData).length} teams (PBP)\n`);

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

  // Fetch today's bets
  const today = new Date().toISOString().split('T')[0];
  const betsSnap = await getDocs(query(collection(db, 'basketball_bets'), where('date', '==', today)));
  const bets = [];
  betsSnap.forEach(d => bets.push({ id: d.id, ...d.data() }));

  if (bets.length === 0) {
    console.log('❌ No bets found for today.');
    process.exit(1);
  }

  const gameMap = new Map();
  for (const bet of bets) {
    const key = `${bet.game?.awayTeam}_${bet.game?.homeTeam}`;
    const existing = gameMap.get(key);
    if (!existing || (bet.unitSize || 0) > (existing.unitSize || 0)) gameMap.set(key, bet);
  }
  const games = Array.from(gameMap.values()).sort((a, b) => (b.unitSize || 0) - (a.unitSize || 0));

  const L = [];
  const dateFmt = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  
  L.push(`BARTTORVIK MATCHUP INTELLIGENCE — ${dateFmt}`);
  L.push('='.repeat(80));
  L.push(`${games.length} games with active picks | Source: barttorvik.com T-Rank + Shooting Splits`);
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

    const stars = bet.prediction?.stars || Math.round(bet.unitSize || 1);
    const units = bet.unitSize || stars;
    const pick = bet.prediction?.team || bet.team || home;
    const opp = pick === home ? away : home;
    const pickIsHome = pick === home;
    const betType = bet.betType || 'ML';
    const spread = bet.prediction?.spread || '';
    const ev = bet.prediction?.ev ? `${bet.prediction.ev.toFixed(1)}%` : 'N/A';
    const mos = bet.prediction?.marginOverSpread ? `+${bet.prediction.marginOverSpread.toFixed(1)}` : 'N/A';

    L.push('─'.repeat(80));
    L.push(`${'★'.repeat(stars)} ${away} (AWAY) @ ${home} (HOME)`);
    L.push(`PICK: ${pick} ${betType}${spread ? ` ${spread}` : ''} | ${units}u | EV: ${ev} | MOS: ${mos}`);
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
      const edge = off.eFG_off - def.eFG_def;
      L.push(`    ${offTeam} offense: ${off.eFG_off}% eFG (#${off.eFG_off_rank}, ${tier(off.eFG_off_rank)})`);
      L.push(`      ${vsAvg(off.eFG_off, D1.eFG, true)}`);
      L.push(`      vs ${defTeam} defense: allows ${def.eFG_def}% eFG (#${def.eFG_def_rank}, ${tier(def.eFG_def_rank)})`);
      L.push(`      ${vsAvg(def.eFG_def, D1.eFG, false)}`);
      L.push(`      → Matchup edge: ${edge > 0 ? '+' : ''}${edge.toFixed(1)} (${edge > 3 ? 'BIG advantage for offense' : edge > 0 ? 'slight advantage for offense' : edge > -3 ? 'slight advantage for defense' : 'defense dominates'})`);
      L.push('');
    }

    // Turnovers
    L.push(`  TURNOVER BATTLE`);
    for (const [offTeam, off, defTeam, def] of [[away, aB, home, hB], [home, hB, away, aB]]) {
      L.push(`    ${offTeam} commits ${off.to_off} TOs/100 (#${off.to_off_rank}, ${tier(off.to_off_rank)}) — ${vsAvg(off.to_off, D1.to, false)}`);
      L.push(`    ${defTeam} forces ${def.to_def} TOs/100 (#${def.to_def_rank}, ${tier(def.to_def_rank)}) — ${vsAvg(def.to_def, D1.to, true)}`);
      const risk = off.to_off > 19 && def.to_def > 19 ? 'HIGH RISK: Careless offense meets aggressive defense — expect live-ball turnovers and transition points'
        : off.to_off < 15 && def.to_def < 16 ? 'LOW RISK: Secure ball-handler vs passive defense — clean possessions expected'
        : off.to_off > 19 ? `WATCH: ${offTeam} is turnover-prone even vs average pressure`
        : def.to_def > 20 ? `WATCH: ${defTeam}'s pressure causes problems for everyone`
        : 'NEUTRAL: No major turnover storyline here';
      L.push(`      → ${risk}`);
      L.push('');
    }

    // Rebounding
    L.push(`  REBOUNDING (ORB%)`);
    for (const [offTeam, off, defTeam, def] of [[away, aB, home, hB], [home, hB, away, aB]]) {
      L.push(`    ${offTeam} crashes: ${off.oreb_off}% ORB (#${off.oreb_off_rank}, ${tier(off.oreb_off_rank)}) — ${vsAvg(off.oreb_off, D1.oreb, true)}`);
      L.push(`    ${defTeam} protects: ${def.oreb_def}% allowed (#${def.oreb_def_rank}, ${tier(def.oreb_def_rank)}) — ${vsAvg(def.oreb_def, D1.oreb, false)}`);
      const edge = off.oreb_off - def.oreb_def;
      L.push(`      → ${edge > 4 ? `SECOND CHANCES: ${offTeam} should dominate the offensive glass here` : edge > 0 ? `Slight rebounding edge for ${offTeam}` : edge > -4 ? `${defTeam} should limit second chances` : `${defTeam} controls the glass — one-and-done possessions`}`);
      L.push('');
    }

    // FT Rate
    L.push(`  FREE THROW RATE (FTA/FGA)`);
    for (const [offTeam, off, defTeam, def] of [[away, aB, home, hB], [home, hB, away, aB]]) {
      L.push(`    ${offTeam} draws: ${off.ftRate_off} FTA/FGA (#${off.ftRate_off_rank}, ${tier(off.ftRate_off_rank)}) — ${vsAvg(off.ftRate_off, D1.ftRate, true)}`);
      L.push(`    ${defTeam} allows: ${def.ftRate_def} FTA/FGA (#${def.ftRate_def_rank}, ${tier(def.ftRate_def_rank)}) — ${vsAvg(def.ftRate_def, D1.ftRate, false)}`);
      const foulGame = off.ftRate_off > 36 && def.ftRate_def > 36;
      L.push(`      → ${foulGame ? `FOUL TROUBLE: ${offTeam} attacks aggressively and ${defTeam} is foul-prone — bonus situations likely` : off.ftRate_off > 36 ? `${offTeam} lives at the line — could be a factor` : def.ftRate_def < 28 ? `${defTeam} is very disciplined — ${offTeam} won't get cheap points` : 'Standard free throw expectations'}`);
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

        // Vulnerability spotlight
        const defWeakest = [
          { zone: 'close 2', fg: defPbp.close2_def_fg, avg: D1.close2, diff: defPbp.close2_def_fg - D1.close2 },
          { zone: '3PT', fg: defPbp.three_def_fg, avg: D1.three, diff: defPbp.three_def_fg - D1.three },
          { zone: 'mid-range', fg: defPbp.far2_def_fg, avg: D1.far2, diff: defPbp.far2_def_fg - D1.far2 },
        ].sort((a, b) => b.diff - a.diff);

        if (defWeakest[0].diff > 1) {
          L.push(`    🎯 VULNERABILITY: ${defTeam}'s biggest defensive weakness is ${defWeakest[0].zone} (allows ${defWeakest[0].fg}%, +${defWeakest[0].diff.toFixed(1)}% above D1 avg).`);
          const offShootsWell = defWeakest[0].zone === 'close 2' ? offPbp.close2_off_fg > D1.close2
            : defWeakest[0].zone === '3PT' ? offPbp.three_off_fg > D1.three
            : offPbp.far2_off_fg > D1.far2;
          if (offShootsWell) {
            L.push(`    → ${offTeam} CAN exploit this — they shoot above D1 avg in this zone.`);
          } else {
            L.push(`    → ${offTeam} may NOT exploit this — they shoot below D1 avg here despite the defensive weakness.`);
          }
        } else {
          L.push(`    ✅ ${defTeam} has no major shot-zone vulnerabilities (all zones at or below D1 avg allowed).`);
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
        { name: 'Close 2', offFg: pickP.close2_off_fg, defFg: oppP.close2_def_fg, share: pickP.close2_off_share, avg: D1.close2 },
        { name: '3PT', offFg: pickP.three_off_fg, defFg: oppP.three_def_fg, share: pickP.three_off_share, avg: D1.three },
        { name: 'Mid', offFg: pickP.far2_off_fg, defFg: oppP.far2_def_fg, share: pickP.far2_off_share, avg: D1.far2 },
      ];
      
      for (const z of zones) {
        const edge = z.offFg - z.defFg;
        const offVsAvg = z.offFg - z.avg;
        if (Math.abs(edge) > 2 && z.share > 15) {
          L.push(`    ${edge > 0 ? '✓' : '✗'} ${z.name}: ${pick} shoots ${z.offFg}% (${offVsAvg > 0 ? 'above' : 'below'} D1 avg), ${opp} allows ${z.defFg}% → ${edge > 0 ? '+' : ''}${edge.toFixed(1)} edge (${z.share}% of ${pick}'s shots)`);
        }
      }
      
      // Opponent's biggest vulnerability our pick can exploit
      const oppVulnerabilities = [
        { zone: 'close 2', fg: oppP.close2_def_fg, avg: D1.close2, pickFg: pickP.close2_off_fg },
        { zone: '3PT', fg: oppP.three_def_fg, avg: D1.three, pickFg: pickP.three_off_fg },
        { zone: 'mid', fg: oppP.far2_def_fg, avg: D1.far2, pickFg: pickP.far2_off_fg },
      ].filter(v => v.fg - v.avg > 1.5).sort((a, b) => (b.fg - b.avg) - (a.fg - a.avg));
      
      if (oppVulnerabilities.length > 0) {
        const v = oppVulnerabilities[0];
        L.push(`    🎯 ${opp}'s weakest zone: ${v.zone} (allows ${v.fg}%, +${(v.fg - v.avg).toFixed(1)} above D1 avg). ${pick} shoots ${v.pickFg}% here.`);
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

    // Betting context
    L.push(`  BETTING CONTEXT:`);
    L.push(`    EV: ${ev} — ${parseFloat(ev) > 5 ? 'strong market mispricing' : parseFloat(ev) > 3 ? 'meaningful edge over closing line' : 'moderate edge'}`);
    L.push(`    MOS: ${mos} — model projects ${pick} to cover by this margin beyond the spread`);
    L.push(`    Confidence: ${'★'.repeat(stars)}${'☆'.repeat(5 - stars)} (${units}u)`);
    L.push('');
  }

  L.push('─'.repeat(80));
  L.push('');
  L.push('WRITING GUIDANCE:');
  L.push('- Lead with the most dramatic matchup mismatch (shot zone exploits, elite vs weak)');
  L.push('- Use specific numbers: "shoots 60.4% at the rim (#124 in D1)" > "good at scoring inside"');
  L.push('- Frame as offense vs defense: "GW\'s elite 3PT shooting meets VCU\'s top-30 rim protection"');
  L.push('- Include D1 context: "5 points above D1 average" tells the reader HOW good, not just good');
  L.push('- Mention home/away — it matters for narrative and the 3-4 point swing');
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
