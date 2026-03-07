/**
 * Grade specific yesterday bets using NCAA API scores
 */
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

const NCAA_PROXY = 'https://ncaaproxy-lviwud3q2q-uc.a.run.app';
const norm = name => name.toLowerCase().replace(/[^a-z0-9]/g, '');

// Bet IDs to grade
const BET_IDS = [
  '2026-02-26_HAWAII_UC_DAVIS_TOTAL_OVER',
  '2026-02-26_MERCYHURST_CENTRAL_CONNECTICUT_STATE_TOTAL_UNDER',
  '2026-02-26_NEW_HAVEN_WAGNER_TOTAL_UNDER',
];

async function main() {
  // 1. Fetch NCAA scores for yesterday
  const res = await fetch(`${NCAA_PROXY}?date=20260226`);
  const data = await res.json();
  const games = (data.games || []).filter(g => g.game?.gameState === 'final');

  // Build score lookup (try both orderings since NCAA reversal is inconsistent)
  const scoreLookup = [];
  for (const g of games) {
    const gd = g.game;
    const a = gd.away || {};
    const h = gd.home || {};
    scoreLookup.push({
      team1: norm(a.names?.short || ''), score1: parseInt(a.score) || 0,
      team2: norm(h.names?.short || ''), score2: parseInt(h.score) || 0,
    });
  }
  console.log(`Fetched ${scoreLookup.length} final NCAA games for 2026-02-26\n`);

  // 2. Grade each bet
  for (const betId of BET_IDS) {
    const betRef = db.collection('basketball_bets').doc(betId);
    const betDoc = await betRef.get();

    if (!betDoc.exists) {
      console.log(`❌ Bet not found: ${betId}`);
      continue;
    }

    const bet = betDoc.data();
    if (bet.status === 'COMPLETED') {
      console.log(`⏭️  Already graded: ${betId}`);
      continue;
    }

    const betAway = norm(bet.game?.awayTeam || '');
    const betHome = norm(bet.game?.homeTeam || '');
    console.log(`Looking for: ${bet.game?.awayTeam} @ ${bet.game?.homeTeam}`);

    // Find matching game (check both teams against both positions)
    const match = scoreLookup.find(s =>
      (s.team1.includes(betAway) || betAway.includes(s.team1) || s.team2.includes(betAway) || betAway.includes(s.team2)) &&
      (s.team1.includes(betHome) || betHome.includes(s.team1) || s.team2.includes(betHome) || betHome.includes(s.team2))
    );

    if (!match) {
      console.log(`  ⏭️ No score found. NCAA team names available:`);
      scoreLookup.forEach(s => console.log(`     ${s.team1} (${s.score1}) vs ${s.team2} (${s.score2})`));
      continue;
    }

    // Figure out which score belongs to which team
    const awayIsTeam1 = match.team1.includes(betAway) || betAway.includes(match.team1);
    const awayScore = awayIsTeam1 ? match.score1 : match.score2;
    const homeScore = awayIsTeam1 ? match.score2 : match.score1;
    const totalScore = awayScore + homeScore;
    const winnerTeam = awayScore > homeScore ? bet.game.awayTeam : bet.game.homeTeam;

    console.log(`  Score: ${bet.game.awayTeam} ${awayScore} - ${homeScore} ${bet.game.homeTeam} (Total: ${totalScore})`);

    const isTotalsBet = bet.betRecommendation?.type === 'TOTAL' || bet.isTotalsPick || bet.bet?.market === 'TOTAL';
    const isATSBet = bet.betRecommendation?.type === 'ATS' || bet.isATSPick || bet.bet?.market === 'SPREAD';

    let outcome;
    if (isTotalsBet) {
      const direction = bet.bet?.pick || bet.totalsAnalysis?.direction || bet.betRecommendation?.totalDirection;
      const line = bet.bet?.total || bet.totalsAnalysis?.marketTotal || bet.betRecommendation?.totalLine;
      outcome = direction === 'OVER'
        ? (totalScore > line ? 'WIN' : totalScore === line ? 'PUSH' : 'LOSS')
        : (totalScore < line ? 'WIN' : totalScore === line ? 'PUSH' : 'LOSS');
      console.log(`  ${direction} ${line} → actual ${totalScore} → ${outcome}`);
    } else if (isATSBet) {
      const spread = bet.betRecommendation?.atsSpread || bet.spreadAnalysis?.spread || bet.bet?.spread;
      const betTeam = norm(bet.bet?.team || '');
      const isAway = betTeam === betAway;
      const picked = isAway ? awayScore : homeScore;
      const opp = isAway ? homeScore : awayScore;
      const adjusted = (picked - opp) + spread;
      outcome = adjusted > 0 ? 'WIN' : adjusted === 0 ? 'PUSH' : 'LOSS';
      console.log(`  ATS: ${bet.bet?.team} ${spread}, margin ${picked - opp}, adjusted ${adjusted} → ${outcome}`);
    } else {
      const betTeam = norm(bet.bet?.team || '');
      const winner = norm(winnerTeam);
      outcome = betTeam === winner ? 'WIN' : 'LOSS';
      console.log(`  ML: ${bet.bet?.team} → winner ${winnerTeam} → ${outcome}`);
    }

    const units = bet.bet?.units || bet.prediction?.unitSize || 1;
    const odds = (isATSBet || isTotalsBet) ? -110 : (bet.bet?.odds || -110);
    let profit;
    if (outcome === 'WIN') {
      profit = units * (odds > 0 ? odds / 100 : 100 / Math.abs(odds));
    } else if (outcome === 'PUSH') {
      profit = 0;
    } else {
      profit = -units;
    }

    await betRef.update({
      'result.awayScore': awayScore,
      'result.homeScore': homeScore,
      'result.totalScore': totalScore,
      'result.winner': awayScore > homeScore ? 'AWAY' : 'HOME',
      'result.winnerTeam': winnerTeam,
      'result.outcome': outcome,
      'result.profit': profit,
      'result.units': units,
      'result.fetched': true,
      'result.fetchedAt': Date.now(),
      'result.source': 'NCAA_BACKFILL',
      'status': 'COMPLETED',
      'gradedAt': Date.now()
    });

    const emoji = outcome === 'WIN' ? '✅' : outcome === 'PUSH' ? '🔄' : '❌';
    console.log(`  ${emoji} GRADED: ${outcome} | ${profit > 0 ? '+' : ''}${profit.toFixed(2)}u\n`);
  }

  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
