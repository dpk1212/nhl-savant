/**
 * Script to fetch Tuesday 10/21 NHL game results and update Firebase
 * Run with: node updateTuesdayResults.js
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env') });

// Firebase config
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

console.log('🏒 NHL Result Fetcher - Tuesday 10/21/2025');
console.log('==========================================\n');

// Fetch game results from NHL API
async function fetchNHLResults(date) {
  const url = `https://api-web.nhle.com/v1/schedule/${date}`;
  
  try {
    console.log(`📡 Fetching results from NHL API: ${url}`);
    const response = await axios.get(url);
    const gameWeek = response.data.gameWeek || [];
    
    if (gameWeek.length === 0) {
      console.log('❌ No game data found for this date');
      return [];
    }
    
    const games = gameWeek[0]?.games || [];
    console.log(`✅ Found ${games.length} games\n`);
    
    return games.map(game => ({
      awayTeam: game.awayTeam.abbrev,
      homeTeam: game.homeTeam.abbrev,
      awayScore: game.awayTeam.score,
      homeScore: game.homeTeam.score,
      gameState: game.gameState,
      finished: game.gameState === 'OFF' || game.gameState === 'FINAL'
    }));
  } catch (error) {
    console.error('❌ Error fetching NHL results:', error.message);
    return [];
  }
}

// Calculate bet outcome
function calculateOutcome(result, bet) {
  const totalScore = result.awayScore + result.homeScore;
  
  switch (bet.market) {
    case 'TOTAL':
      if (bet.side === 'OVER') {
        if (totalScore > bet.line) return 'WIN';
        if (totalScore < bet.line) return 'LOSS';
        return 'PUSH';
      } else {
        if (totalScore < bet.line) return 'WIN';
        if (totalScore > bet.line) return 'LOSS';
        return 'PUSH';
      }
    
    case 'MONEYLINE':
      const winner = result.awayScore > result.homeScore ? 'AWAY' : 'HOME';
      if (bet.side === winner) return 'WIN';
      return 'LOSS';
    
    case 'PUCK_LINE':
    case 'PUCKLINE':
      const spread = bet.line || 1.5;
      if (bet.side === 'HOME') {
        const homeSpread = result.homeScore - result.awayScore;
        if (homeSpread > spread) return 'WIN';
        if (homeSpread < spread) return 'LOSS';
        return 'PUSH';
      } else {
        const awaySpread = result.awayScore - result.homeScore;
        if (awaySpread > spread) return 'WIN';
        if (awaySpread < spread) return 'LOSS';
        return 'PUSH';
      }
    
    case 'TEAM_TOTAL':
      const teamScore = bet.team === bet.game?.homeTeam ? result.homeScore : result.awayScore;
      if (bet.side === 'OVER') {
        if (teamScore > bet.line) return 'WIN';
        if (teamScore < bet.line) return 'LOSS';
        return 'PUSH';
      } else {
        if (teamScore < bet.line) return 'WIN';
        if (teamScore > bet.line) return 'LOSS';
        return 'PUSH';
      }
    
    default:
      return null;
  }
}

// Calculate profit in units
function calculateProfit(outcome, odds) {
  if (outcome === 'PUSH') return 0;
  if (outcome === 'LOSS') return -1;
  
  // WIN
  if (odds < 0) {
    return 100 / Math.abs(odds);
  } else {
    return odds / 100;
  }
}

// Main function
async function updateResults() {
  try {
    // Fetch Tuesday's results
    const results = await fetchNHLResults('2025-10-21');
    
    if (results.length === 0) {
      console.log('❌ No results found. Exiting.');
      process.exit(1);
    }
    
    // Get all pending bets from Tuesday
    console.log('📊 Fetching pending bets from Firebase...');
    const betsSnapshot = await getDocs(collection(db, 'bets'));
    const tuesdayBets = [];
    
    betsSnapshot.forEach(docSnap => {
      const bet = docSnap.data();
      if (bet.date === '2025-10-21' && bet.status === 'PENDING') {
        tuesdayBets.push({ id: docSnap.id, ...bet });
      }
    });
    
    console.log(`✅ Found ${tuesdayBets.length} pending Tuesday bets\n`);
    
    if (tuesdayBets.length === 0) {
      console.log('ℹ️  No pending Tuesday bets to update.');
      console.log('💡 Make sure you\'ve loaded Today\'s Games page to track predictions first!');
      process.exit(0);
    }
    
    // Update each bet
    let updated = 0;
    let errors = 0;
    
    for (const bet of tuesdayBets) {
      const gameResult = results.find(r => 
        r.awayTeam === bet.game.awayTeam && r.homeTeam === bet.game.homeTeam
      );
      
      if (!gameResult) {
        console.log(`⚠️  No result found for ${bet.game.awayTeam} @ ${bet.game.homeTeam}`);
        errors++;
        continue;
      }
      
      if (!gameResult.finished) {
        console.log(`⏳ Game not finished: ${bet.game.awayTeam} @ ${bet.game.homeTeam}`);
        continue;
      }
      
      const outcome = calculateOutcome(gameResult, bet.bet);
      const profit = calculateProfit(outcome, bet.bet.odds);
      
      try {
        const betRef = doc(db, 'bets', bet.id);
        
        console.log(`🔄 Updating ${bet.id}...`);
        
        await updateDoc(betRef, {
          'result.awayScore': gameResult.awayScore,
          'result.homeScore': gameResult.homeScore,
          'result.totalScore': gameResult.awayScore + gameResult.homeScore,
          'result.winner': gameResult.awayScore > gameResult.homeScore ? 'AWAY' : 'HOME',
          'result.outcome': outcome,
          'result.profit': profit,
          'result.fetched': true,
          'result.fetchedAt': Date.now(),
          'result.source': 'NHL_API',
          'status': 'COMPLETED'
        });
        
        console.log(`✅ ${bet.game.awayTeam} @ ${bet.game.homeTeam} (${gameResult.awayScore}-${gameResult.homeScore})`);
        console.log(`   Bet: ${bet.bet.pick} → ${outcome} (${profit > 0 ? '+' : ''}${profit.toFixed(2)}u)\n`);
        updated++;
      } catch (error) {
        console.error(`❌ Error updating bet ${bet.id}:`, error);
        console.error(`   Error code: ${error.code}`);
        console.error(`   Error message: ${error.message}`);
        errors++;
      }
    }
    
    console.log('\n==========================================');
    console.log(`✅ Updated: ${updated} bets`);
    if (errors > 0) {
      console.log(`❌ Errors: ${errors}`);
    }
    console.log('==========================================\n');
    
    // Wait a moment for Firestore writes to complete
    console.log('⏳ Waiting for Firebase writes to complete...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('🎯 Check the Performance Dashboard to see your results!');
    console.log('   http://localhost:5176/nhl-savant/#/performance\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

updateResults();

