/**
 * Grade Basketball Bets for a Specific Date
 * 
 * Usage: node scripts/gradeBasketballBetsForDate.js 2025-11-24
 */

import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// Initialize Firebase Admin
const serviceAccount = JSON.parse(
  readFileSync(new URL('../nhl-savant-firebase-adminsdk.json', import.meta.url))
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

/**
 * Normalize team name for matching
 */
function normalizeTeamName(name) {
  return name
    .toLowerCase()
    .replace(/\bstate\b/g, 'st')
    .replace(/\bst\.\b/g, 'st')
    .replace(/\bsaint\b/g, 'st')
    .replace(/\buniversity\b/g, '')
    .replace(/\bcollege\b/g, '')
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Fetch NCAA games for a specific date
 */
async function fetchNCAAGames(dateStr) {
  try {
    const formattedDate = dateStr.replace(/-/g, '');
    const url = `https://ncaa-api.henrygd.me/scoreboard/basketball-men/d1/${formattedDate}`;
    
    console.log(`📡 Fetching NCAA games from: ${url}`);
    
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`❌ NCAA API error: ${response.status}`);
      return [];
    }
    
    const data = await response.json();
    const games = data.games || [];
    
    console.log(`✅ Fetched ${games.length} games from NCAA API`);
    
    return games
      .filter(g => g.game.gameState === 'final')
      .map(g => ({
        awayTeam: g.game.away.names.short,
        homeTeam: g.game.home.names.short,
        awayScore: parseInt(g.game.away.score) || 0,
        homeScore: parseInt(g.game.home.score) || 0,
        gameState: g.game.gameState,
      }));
  } catch (error) {
    console.error("❌ Error fetching NCAA games:", error);
    return [];
  }
}

/**
 * Calculate bet outcome
 */
function calculateOutcome(game, bet) {
  const betTeam = bet.team || bet.pick;
  
  // Normalize for matching
  const normBetTeam = normalizeTeamName(betTeam);
  const normAwayTeam = normalizeTeamName(game.awayTeam);
  const normHomeTeam = normalizeTeamName(game.homeTeam);
  
  // Determine which team we bet on
  const isAway = normBetTeam.includes(normAwayTeam) || normAwayTeam.includes(normBetTeam);
  const isHome = normBetTeam.includes(normHomeTeam) || normHomeTeam.includes(normBetTeam);
  
  if (!isAway && !isHome) {
    console.log(`⚠️  Could not match bet team "${betTeam}" to game teams "${game.awayTeam}" vs "${game.homeTeam}"`);
    return null;
  }
  
  // Determine actual winner
  const actualWinner = game.awayScore > game.homeScore ? "AWAY" : "HOME";
  const predictedWinner = isAway ? "AWAY" : "HOME";
  
  return actualWinner === predictedWinner ? "WIN" : "LOSS";
}

/**
 * Calculate profit
 */
function calculateProfit(outcome, odds) {
  if (outcome === "LOSS") return -1;
  if (outcome === "PUSH") return 0;
  
  // WIN
  if (odds < 0) {
    return 100 / Math.abs(odds);
  } else {
    return odds / 100;
  }
}

/**
 * Main grading function
 */
async function gradeBasketballBets(date) {
  console.log(`\n🏀 Grading Basketball Bets for ${date}\n`);
  console.log('='.repeat(60));
  
  try {
    // Fetch all bets for this date
    const betsSnapshot = await db
      .collection('basketball_bets')
      .where('date', '==', date)
      .get();
    
    if (betsSnapshot.empty) {
      console.log(`\n❌ No bets found for ${date}`);
      return;
    }
    
    const bets = [];
    betsSnapshot.forEach(doc => {
      bets.push({ id: doc.id, ...doc.data() });
    });
    
    console.log(`\n📊 Found ${bets.length} bets for ${date}`);
    
    // Fetch NCAA games
    const ncaaGames = await fetchNCAAGames(date);
    const finalGames = ncaaGames.filter(g => g.gameState === 'final');
    
    console.log(`\n🎯 Found ${finalGames.length} final games\n`);
    
    if (finalGames.length === 0) {
      console.log('❌ No final games found. Games may not be completed yet.');
      return;
    }
    
    let gradedCount = 0;
    let alreadyGradedCount = 0;
    let notFoundCount = 0;
    
    // Grade each bet
    for (const bet of bets) {
      console.log(`\n📍 Bet: ${bet.game.awayTeam} @ ${bet.game.homeTeam}`);
      console.log(`   Pick: ${bet.bet.pick || bet.bet.team} ML (${bet.bet.odds > 0 ? '+' : ''}${bet.bet.odds})`);
      
      // Skip if already graded
      if (bet.result?.outcome && bet.status === 'COMPLETED') {
        console.log(`   ⏭️  Already graded: ${bet.result.outcome}`);
        alreadyGradedCount++;
        continue;
      }
      
      // Find matching game
      const matchingGame = finalGames.find((g) => {
        const awayMatch = 
          normalizeTeamName(g.awayTeam).includes(normalizeTeamName(bet.game.awayTeam)) ||
          normalizeTeamName(bet.game.awayTeam).includes(normalizeTeamName(g.awayTeam));
        const homeMatch = 
          normalizeTeamName(g.homeTeam).includes(normalizeTeamName(bet.game.homeTeam)) ||
          normalizeTeamName(bet.game.homeTeam).includes(normalizeTeamName(g.homeTeam));
        return awayMatch && homeMatch;
      });
      
      if (!matchingGame) {
        console.log(`   ❌ No final game found`);
        notFoundCount++;
        continue;
      }
      
      console.log(`   📊 Final: ${matchingGame.awayTeam} ${matchingGame.awayScore} - ${matchingGame.homeScore} ${matchingGame.homeTeam}`);
      
      // Calculate outcome
      const outcome = calculateOutcome(matchingGame, bet.bet);
      
      if (!outcome) {
        console.log(`   ⚠️  Could not determine outcome`);
        notFoundCount++;
        continue;
      }
      
      const profit = calculateProfit(outcome, bet.bet.odds);
      
      // Update Firestore
      await db.collection('basketball_bets').doc(bet.id).update({
        'result.awayScore': matchingGame.awayScore,
        'result.homeScore': matchingGame.homeScore,
        'result.totalScore': matchingGame.awayScore + matchingGame.homeScore,
        'result.winner': matchingGame.awayScore > matchingGame.homeScore ? bet.game.awayTeam : bet.game.homeTeam,
        'result.outcome': outcome,
        'result.profit': profit,
        'result.fetched': true,
        'result.fetchedAt': admin.firestore.FieldValue.serverTimestamp(),
        'result.source': 'NCAA_API',
        'status': 'COMPLETED',
      });
      
      console.log(`   ${outcome === 'WIN' ? '✅' : '❌'} ${outcome} → ${profit > 0 ? '+' : ''}${profit.toFixed(2)}u`);
      gradedCount++;
    }
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('\n📈 GRADING SUMMARY:');
    console.log(`   ✅ Newly graded: ${gradedCount}`);
    console.log(`   ⏭️  Already graded: ${alreadyGradedCount}`);
    console.log(`   ❌ Not found: ${notFoundCount}`);
    console.log(`   📊 Total bets: ${bets.length}\n`);
    
  } catch (error) {
    console.error('\n❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

// Get date from command line or use yesterday
const args = process.argv.slice(2);
const date = args[0] || (() => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
})();

console.log('\n🏀 NCAA Basketball Bet Grader\n');
gradeBasketballBets(date);

