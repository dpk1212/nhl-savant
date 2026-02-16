/**
 * Generate Barttorvik Matchup Intelligence for Today's Picks
 * 
 * Pulls today's bets from Firebase, matches them with Barttorvik T-Rank
 * and Shooting Splits data, and outputs a formatted matchup report
 * ready to copy/paste into an LLM for Twitter content.
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

// Initialize Firebase
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

// Load CSV team mappings
async function loadTeamMappings() {
  const csv = await fs.readFile(join(__dirname, '../public/basketball_teams.csv'), 'utf8');
  const mappings = new Map();
  const lines = csv.split('\n').slice(1); // skip header
  for (const line of lines) {
    if (!line.trim()) continue;
    const values = line.split(',');
    const mapping = {
      normalized: values[0]?.trim() || '',
      oddstrader: values[1]?.trim() || '',
      haslametrics: values[2]?.trim() || '',
      dratings: values[3]?.trim() || '',
      conference: values[4]?.trim() || '',
      ncaa_name: values[5]?.trim() || '',
      notes: values[6]?.trim() || '',
      espn_name: values[7]?.trim() || '',
      barttorvik: values[8]?.trim() || ''
    };
    if (mapping.normalized) {
      mappings.set(mapping.normalized.toLowerCase(), mapping);
    }
    if (mapping.oddstrader && mapping.oddstrader !== mapping.normalized) {
      mappings.set(mapping.oddstrader.toLowerCase(), mapping);
    }
  }
  return mappings;
}

function findBartName(teamName, mappings) {
  const key = teamName.toLowerCase().trim();
  const mapping = mappings.get(key);
  return mapping?.barttorvik || teamName;
}

function tierLabel(rank) {
  if (rank <= 25) return 'ELITE';
  if (rank <= 75) return 'STRONG';
  if (rank <= 150) return 'AVERAGE';
  if (rank <= 250) return 'BELOW AVG';
  return 'WEAK';
}

function edgeLabel(diff) {
  const abs = Math.abs(diff);
  if (abs >= 10) return 'MASSIVE';
  if (abs >= 5) return 'STRONG';
  if (abs >= 2) return 'MODERATE';
  return 'SLIM';
}

async function generateMatchups() {
  console.log('🏀 BARTTORVIK MATCHUP INTELLIGENCE GENERATOR\n');

  // 1. Load Barttorvik data
  const bartMd = await fs.readFile(join(__dirname, '../public/Bart.md'), 'utf8');
  const pbpMd = await fs.readFile(join(__dirname, '../public/bart_pbp.md'), 'utf8');
  const bartData = parseBarttorvik(bartMd);
  const pbpData = parseBarttorvikPBP(pbpMd);
  const mappings = await loadTeamMappings();

  console.log(`📊 Loaded ${Object.keys(bartData).length} teams (T-Rank), ${Object.keys(pbpData).length} teams (PBP)\n`);

  // Compute per-stat ranks from PBP data (rank 1 = best)
  const pbpTeams = Object.values(pbpData);
  const pbpRanks = {};
  const rankStats = [
    { key: 'close2_off_fg', higher: true }, { key: 'close2_def_fg', higher: false },
    { key: 'far2_off_fg', higher: true }, { key: 'far2_def_fg', higher: false },
    { key: 'three_off_fg', higher: true }, { key: 'three_def_fg', higher: false },
    { key: 'close2_off_share', higher: true }, { key: 'close2_def_share', higher: false },
    { key: 'far2_off_share', higher: true }, { key: 'far2_def_share', higher: false },
    { key: 'three_off_share', higher: true }, { key: 'three_def_share', higher: false },
  ];
  for (const { key, higher } of rankStats) {
    const sorted = [...pbpTeams].sort((a, b) => higher ? (b[key] || 0) - (a[key] || 0) : (a[key] || 0) - (b[key] || 0));
    sorted.forEach((t, i) => {
      if (!pbpRanks[t.teamName]) pbpRanks[t.teamName] = {};
      pbpRanks[t.teamName][key] = i + 1;
    });
  }
  const r = (team, stat) => pbpRanks[team]?.[stat] ? `#${pbpRanks[team][stat]}` : '';

  // 2. Fetch today's bets from Firebase
  const today = new Date().toISOString().split('T')[0];
  const betsSnap = await getDocs(query(collection(db, 'basketball_bets'), where('date', '==', today)));
  
  const bets = [];
  betsSnap.forEach(docSnap => {
    bets.push({ id: docSnap.id, ...docSnap.data() });
  });

  if (bets.length === 0) {
    console.log('❌ No bets found for today. Run fetch-prime-picks first.');
    process.exit(1);
  }

  // Deduplicate by game (keep highest unit bet per matchup)
  const gameMap = new Map();
  for (const bet of bets) {
    const key = `${bet.game?.awayTeam}_${bet.game?.homeTeam}`;
    const existing = gameMap.get(key);
    if (!existing || (bet.unitSize || 0) > (existing.unitSize || 0)) {
      gameMap.set(key, bet);
    }
  }

  const games = Array.from(gameMap.values()).sort((a, b) => (b.unitSize || 0) - (a.unitSize || 0));
  console.log(`📋 ${games.length} games with picks today (${bets.length} total bets)\n`);

  // 3. Build formatted output
  const lines = [];
  const dateFmt = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  
  lines.push(`BARTTORVIK MATCHUP INTELLIGENCE — ${dateFmt}`);
  lines.push(`${'='.repeat(70)}`);
  lines.push(`${games.length} games with active picks | Data: barttorvik.com T-Rank + Shooting Splits`);
  lines.push('');

  for (const bet of games) {
    const away = bet.game?.awayTeam || 'Unknown';
    const home = bet.game?.homeTeam || 'Unknown';
    const awayBartName = findBartName(away, mappings);
    const homeBartName = findBartName(home, mappings);

    const awayBart = bartData[awayBartName];
    const homeBart = bartData[homeBartName];
    const awayPbp = pbpData[awayBartName];
    const homePbp = pbpData[homeBartName];

    const stars = bet.prediction?.stars || Math.round(bet.unitSize || 1);
    const units = bet.unitSize || stars;
    const pick = bet.prediction?.team || bet.team || home;
    const betType = bet.betType || 'ML';
    const spread = bet.prediction?.spread || '';
    const ev = bet.prediction?.ev ? `${bet.prediction.ev.toFixed(1)}%` : '';
    const mos = bet.prediction?.marginOverSpread ? `+${bet.prediction.marginOverSpread.toFixed(1)}` : '';

    lines.push(`${'─'.repeat(70)}`);
    lines.push(`${'★'.repeat(stars)} ${away} @ ${home}`);
    lines.push(`PICK: ${pick} ${betType}${spread ? ` ${spread}` : ''} | ${units}u | EV: ${ev} | MOS: ${mos}`);
    lines.push('');

    if (!awayBart || !homeBart) {
      lines.push(`  ⚠️  Barttorvik data missing for ${!awayBart ? awayBartName : ''}${!awayBart && !homeBart ? ' & ' : ''}${!homeBart ? homeBartName : ''}`);
      lines.push('');
      continue;
    }

    // T-RANK OVERVIEW
    lines.push(`  T-RANK OVERVIEW`);
    lines.push(`  ${away.padEnd(25)} #${awayBart.rank} (${tierLabel(awayBart.rank)})    OFF #${awayBart.adjOff_rank} (${awayBart.adjOff})  DEF #${awayBart.adjDef_rank} (${awayBart.adjDef})`);
    lines.push(`  ${home.padEnd(25)} #${homeBart.rank} (${tierLabel(homeBart.rank)})    OFF #${homeBart.adjOff_rank} (${homeBart.adjOff})  DEF #${homeBart.adjDef_rank} (${homeBart.adjDef})`);
    
    const rankDiff = Math.abs(awayBart.rank - homeBart.rank);
    const better = awayBart.rank < homeBart.rank ? away : home;
    lines.push(`  → ${better} +${rankDiff} ranks overall`);
    lines.push('');

    // FOUR FACTORS
    lines.push(`  FOUR FACTORS (The Keys to the Game)`);
    
    // eFG%
    const efgAwayEdge = awayBart.eFG_off - homeBart.eFG_def;
    const efgHomeEdge = homeBart.eFG_off - awayBart.eFG_def;
    lines.push(`  SHOOTING (eFG%)`);
    lines.push(`    ${away}: OFF ${awayBart.eFG_off}% (#${awayBart.eFG_off_rank}) vs ${home} DEF ${homeBart.eFG_def}% (#${homeBart.eFG_def_rank}) → ${efgAwayEdge > 0 ? '+' : ''}${efgAwayEdge.toFixed(1)} edge`);
    lines.push(`    ${home}: OFF ${homeBart.eFG_off}% (#${homeBart.eFG_off_rank}) vs ${away} DEF ${awayBart.eFG_def}% (#${awayBart.eFG_def_rank}) → ${efgHomeEdge > 0 ? '+' : ''}${efgHomeEdge.toFixed(1)} edge`);
    
    // Turnovers
    lines.push(`  TURNOVERS`);
    lines.push(`    ${away}: TO rate ${awayBart.to_off}% (#${awayBart.to_off_rank}) | Forces TO ${awayBart.to_def}% (#${awayBart.to_def_rank})`);
    lines.push(`    ${home}: TO rate ${homeBart.to_off}% (#${homeBart.to_off_rank}) | Forces TO ${homeBart.to_def}% (#${homeBart.to_def_rank})`);
    
    // Rebounding
    lines.push(`  REBOUNDING (ORB%)`);
    lines.push(`    ${away}: OFF ${awayBart.oreb_off}% (#${awayBart.oreb_off_rank}) | DEF ${awayBart.oreb_def}% (#${awayBart.oreb_def_rank})`);
    lines.push(`    ${home}: OFF ${homeBart.oreb_off}% (#${homeBart.oreb_off_rank}) | DEF ${homeBart.oreb_def}% (#${homeBart.oreb_def_rank})`);
    
    // FT Rate
    lines.push(`  FREE THROW RATE`);
    lines.push(`    ${away}: Gets to line ${awayBart.ftRate_off} (#${awayBart.ftRate_off_rank}) | Sends opp ${awayBart.ftRate_def} (#${awayBart.ftRate_def_rank})`);
    lines.push(`    ${home}: Gets to line ${homeBart.ftRate_off} (#${homeBart.ftRate_off_rank}) | Sends opp ${homeBart.ftRate_def} (#${homeBart.ftRate_def_rank})`);
    lines.push('');

    // SHOOTING SPLITS (PBP)
    if (awayPbp && homePbp) {
      const aN = awayBartName;
      const hN = homeBartName;
      lines.push(`  SHOT DISTRIBUTION & EFFICIENCY`);
      lines.push(`  ${away} OFFENSE:`);
      lines.push(`    Close 2: ${awayPbp.close2_off_fg}% FG (${r(aN,'close2_off_fg')}) — ${awayPbp.close2_off_share}% of shots | 3PT: ${awayPbp.three_off_fg}% FG (${r(aN,'three_off_fg')}) — ${awayPbp.three_off_share}% of shots | Mid: ${awayPbp.far2_off_fg}% FG (${r(aN,'far2_off_fg')}) — ${awayPbp.far2_off_share}% of shots`);
      lines.push(`  ${home} OFFENSE:`);
      lines.push(`    Close 2: ${homePbp.close2_off_fg}% FG (${r(hN,'close2_off_fg')}) — ${homePbp.close2_off_share}% of shots | 3PT: ${homePbp.three_off_fg}% FG (${r(hN,'three_off_fg')}) — ${homePbp.three_off_share}% of shots | Mid: ${homePbp.far2_off_fg}% FG (${r(hN,'far2_off_fg')}) — ${homePbp.far2_off_share}% of shots`);
      lines.push('');
      
      lines.push(`  DEFENSIVE SHOT PROFILE (what they ALLOW)`);
      lines.push(`    ${away} allows: Close 2 ${awayPbp.close2_def_fg}% (${r(aN,'close2_def_fg')}) | 3PT ${awayPbp.three_def_fg}% (${r(aN,'three_def_fg')}) | Mid ${awayPbp.far2_def_fg}% (${r(aN,'far2_def_fg')})`);
      lines.push(`    ${home} allows: Close 2 ${homePbp.close2_def_fg}% (${r(hN,'close2_def_fg')}) | 3PT ${homePbp.three_def_fg}% (${r(hN,'three_def_fg')}) | Mid ${homePbp.far2_def_fg}% (${r(hN,'far2_def_fg')})`);
      lines.push('');

      // Key matchup: where does each team shoot vs what opponent allows
      const awayPrefers3 = awayPbp.three_off_share > 35;
      const homePrefers3 = homePbp.three_off_share > 35;
      const awayPrefersClose = awayPbp.close2_off_share > 35;
      const homePrefersClose = homePbp.close2_off_share > 35;

      lines.push(`  SHOT MATCHUP KEYS`);
      if (awayPrefers3) {
        const edge = awayPbp.three_off_fg - homePbp.three_def_fg;
        lines.push(`    ${away} is 3PT-heavy (${awayPbp.three_off_share}%) → ${home} allows ${homePbp.three_def_fg}% from 3 → ${edge > 0 ? 'ADVANTAGE' : 'TOUGH'} (${edge > 0 ? '+' : ''}${edge.toFixed(1)})`);
      }
      if (homePrefers3) {
        const edge = homePbp.three_off_fg - awayPbp.three_def_fg;
        lines.push(`    ${home} is 3PT-heavy (${homePbp.three_off_share}%) → ${away} allows ${awayPbp.three_def_fg}% from 3 → ${edge > 0 ? 'ADVANTAGE' : 'TOUGH'} (${edge > 0 ? '+' : ''}${edge.toFixed(1)})`);
      }
      if (awayPrefersClose) {
        const edge = awayPbp.close2_off_fg - homePbp.close2_def_fg;
        lines.push(`    ${away} attacks inside (${awayPbp.close2_off_share}%) → ${home} allows ${homePbp.close2_def_fg}% close 2 → ${edge > 0 ? 'ADVANTAGE' : 'TOUGH'} (${edge > 0 ? '+' : ''}${edge.toFixed(1)})`);
      }
      if (homePrefersClose) {
        const edge = homePbp.close2_off_fg - awayPbp.close2_def_fg;
        lines.push(`    ${home} attacks inside (${homePbp.close2_off_share}%) → ${away} allows ${awayPbp.close2_def_fg}% close 2 → ${edge > 0 ? 'ADVANTAGE' : 'TOUGH'} (${edge > 0 ? '+' : ''}${edge.toFixed(1)})`);
      }
      lines.push('');
    }

    // TEMPO & STYLE
    lines.push(`  TEMPO & STYLE`);
    lines.push(`    ${away}: ${awayBart.adjTempo} possessions (#${awayBart.adjTempo_rank}) | Net: ${(awayBart.adjOff - awayBart.adjDef).toFixed(1)}`);
    lines.push(`    ${home}: ${homeBart.adjTempo} possessions (#${homeBart.adjTempo_rank}) | Net: ${(homeBart.adjOff - homeBart.adjDef).toFixed(1)}`);
    
    const tempoDiff = Math.abs(awayBart.adjTempo - homeBart.adjTempo);
    if (tempoDiff > 3) {
      const faster = awayBart.adjTempo > homeBart.adjTempo ? away : home;
      lines.push(`    → TEMPO MISMATCH: ${faster} wants to push pace (+${tempoDiff.toFixed(1)} gap)`);
    }
    lines.push('');

    // EDGE SUMMARY
    lines.push(`  WHY WE LIKE ${pick.toUpperCase()}`);
    const pickBart = pick === home ? homeBart : awayBart;
    const oppBart = pick === home ? awayBart : homeBart;
    const advantages = [];
    if (pickBart.rank < oppBart.rank) advantages.push(`+${Math.abs(pickBart.rank - oppBart.rank)} T-Rank spots`);
    if (pickBart.adjOff > oppBart.adjOff) advantages.push(`Better offense (#${pickBart.adjOff_rank} vs #${oppBart.adjOff_rank})`);
    if (pickBart.adjDef < oppBart.adjDef) advantages.push(`Better defense (#${pickBart.adjDef_rank} vs #${oppBart.adjDef_rank})`);
    if (pickBart.eFG_off > oppBart.eFG_off) advantages.push(`Better shooting (${pickBart.eFG_off}% vs ${oppBart.eFG_off}% eFG)`);
    if (pickBart.to_off < oppBart.to_off) advantages.push(`Fewer turnovers`);
    if (pickBart.oreb_off > oppBart.oreb_off) advantages.push(`Better offensive rebounding`);
    
    for (const adv of advantages) {
      lines.push(`    ✓ ${adv}`);
    }
    lines.push('');
  }

  lines.push(`${'─'.repeat(70)}`);
  lines.push('');
  lines.push('Use this data to create engaging, insight-driven Twitter posts about today\'s picks.');
  lines.push('Focus on the specific matchup advantages and shot profile mismatches.');
  lines.push('');

  const output = lines.join('\n');
  
  // Print to console
  console.log('\n' + output);

  // Also save to file for easy copy
  const outputPath = join(__dirname, '../public/bart_matchups_today.txt');
  await fs.writeFile(outputPath, output, 'utf8');
  console.log(`\n📄 Saved to: public/bart_matchups_today.txt`);

  process.exit(0);
}

generateMatchups().catch(err => {
  console.error('❌ ERROR:', err.message);
  process.exit(1);
});
