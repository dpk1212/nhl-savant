import admin from 'firebase-admin';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      project_id: process.env.VITE_FIREBASE_PROJECT_ID,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  });
}
const db = admin.firestore();

const TARGET_DATE = '2026-02-28';
const NCAA_API = `https://ncaa-api.henrygd.me/scoreboard/basketball-men/d1/2026/02/28`;
const norm = name => name.toLowerCase().replace(/[^a-z0-9]/g, '');

async function main() {
  // 1. Fetch scores
  console.log(`Fetching NCAA scores for ${TARGET_DATE}...`);
  const res = await fetch(NCAA_API);
  const data = await res.json();
  const games = (data.games || []).filter(g => g.game?.gameState === 'final');

  const scoreLookup = [];
  for (const g of games) {
    const gd = g.game;
    const a = gd.away || {};
    const h = gd.home || {};
    scoreLookup.push({
      team1: norm(a.names?.short || a.names?.full || ''),
      team1Full: a.names?.short || a.names?.full || '?',
      score1: parseInt(a.score) || 0,
      team2: norm(h.names?.short || h.names?.full || ''),
      team2Full: h.names?.short || h.names?.full || '?',
      score2: parseInt(h.score) || 0,
    });
  }
  console.log(`Found ${scoreLookup.length} final games\n`);

  // 2. Get ungraded official bets
  const snap = await db.collection('basketball_bets')
    .where('date', '==', TARGET_DATE)
    .where('status', '==', 'PENDING')
    .get();

  const bets = [];
  for (const doc of snap.docs) {
    const d = doc.data();
    if (d.betStatus === 'KILLED' || d.betStatus === 'FLAGGED') continue;
    const units = d.bet?.units || d.prediction?.unitSize || 0;
    if (units <= 0) continue;
    bets.push({ id: doc.id, ref: doc.ref, data: d });
  }
  console.log(`Found ${bets.length} ungraded official bets\n`);

  let wins = 0, losses = 0, pushes = 0, noMatch = 0, totalProfit = 0;

  for (const { id, ref, data: bet } of bets) {
    const betAway = norm(bet.game?.awayTeam || '');
    const betHome = norm(bet.game?.homeTeam || '');
    const gameLabel = `${bet.game?.awayTeam} @ ${bet.game?.homeTeam}`;

    const match = scoreLookup.find(s =>
      (s.team1.includes(betAway) || betAway.includes(s.team1) || s.team2.includes(betAway) || betAway.includes(s.team2)) &&
      (s.team1.includes(betHome) || betHome.includes(s.team1) || s.team2.includes(betHome) || betHome.includes(s.team2))
    );

    if (!match) {
      console.log(`⏭️  No score found: ${gameLabel}`);
      noMatch++;
      continue;
    }

    const awayIsTeam1 = match.team1.includes(betAway) || betAway.includes(match.team1);
    const awayScore = awayIsTeam1 ? match.score1 : match.score2;
    const homeScore = awayIsTeam1 ? match.score2 : match.score1;
    const totalScore = awayScore + homeScore;
    const winnerTeam = awayScore > homeScore ? bet.game.awayTeam : bet.game.homeTeam;

    const isTotalsBet = bet.betRecommendation?.type === 'TOTAL' || bet.isTotalsPick || bet.bet?.market === 'TOTAL';
    const isATSBet = bet.betRecommendation?.type === 'ATS' || bet.isATSPick || bet.bet?.market === 'SPREAD';

    let outcome, detail;
    if (isTotalsBet) {
      const direction = bet.bet?.pick || bet.totalsAnalysis?.direction || bet.betRecommendation?.totalDirection;
      const line = bet.bet?.total || bet.totalsAnalysis?.marketTotal || bet.betRecommendation?.totalLine;
      outcome = direction === 'OVER'
        ? (totalScore > line ? 'WIN' : totalScore === line ? 'PUSH' : 'LOSS')
        : (totalScore < line ? 'WIN' : totalScore === line ? 'PUSH' : 'LOSS');
      detail = `${direction} ${line} → actual ${totalScore}`;
    } else if (isATSBet) {
      const spread = bet.betRecommendation?.atsSpread || bet.spreadAnalysis?.spread || bet.bet?.spread;
      const betTeam = norm(bet.bet?.team || '');
      const isAway = betTeam === betAway || betAway.includes(betTeam) || betTeam.includes(betAway);
      const picked = isAway ? awayScore : homeScore;
      const opp = isAway ? homeScore : awayScore;
      const adjusted = (picked - opp) + spread;
      outcome = adjusted > 0 ? 'WIN' : adjusted === 0 ? 'PUSH' : 'LOSS';
      detail = `${bet.bet?.team} ${spread > 0 ? '+' : ''}${spread}, margin ${picked - opp}, adj ${adjusted}`;
    } else {
      const betTeam = norm(bet.bet?.team || '');
      const winner = norm(winnerTeam);
      outcome = betTeam.includes(winner) || winner.includes(betTeam) ? 'WIN' : 'LOSS';
      detail = `ML: ${bet.bet?.team}`;
    }

    const units = bet.bet?.units || bet.prediction?.unitSize || 1;
    const odds = (isATSBet || isTotalsBet) ? -110 : (bet.bet?.odds || -110);
    let profit;
    if (outcome === 'WIN') { profit = units * (odds > 0 ? odds / 100 : 100 / Math.abs(odds)); }
    else if (outcome === 'PUSH') { profit = 0; }
    else { profit = -units; }

    await ref.update({
      'result.awayScore': awayScore,
      'result.homeScore': homeScore,
      'result.totalScore': totalScore,
      'result.winner': awayScore > homeScore ? 'AWAY' : 'HOME',
      'result.winnerTeam': winnerTeam,
      'result.outcome': outcome,
      'result.profit': Math.round(profit * 100) / 100,
      'result.units': units,
      'result.fetched': true,
      'result.fetchedAt': Date.now(),
      'result.source': 'NCAA_BACKFILL',
      'status': 'COMPLETED',
      'gradedAt': Date.now()
    });

    const emoji = outcome === 'WIN' ? '✅' : outcome === 'PUSH' ? '🔄' : '❌';
    if (outcome === 'WIN') wins++;
    else if (outcome === 'PUSH') pushes++;
    else losses++;
    totalProfit += profit;

    console.log(`${emoji} ${outcome.padEnd(4)} ${(profit > 0 ? '+' : '') + profit.toFixed(2)}u | ${detail} | ${gameLabel} (${awayScore}-${homeScore})`);
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`SUMMARY: ${wins}W - ${losses}L - ${pushes}P | ${totalProfit > 0 ? '+' : ''}${totalProfit.toFixed(2)}u profit`);
  if (noMatch > 0) console.log(`⚠️  ${noMatch} bets had no score match`);
  console.log(`${'='.repeat(60)}`);

  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
