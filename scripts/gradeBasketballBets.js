import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { parseBasketballResults } from '../src/utils/basketballResultsParser.js';
import { getETGameDate } from '../src/utils/dateUtils.js';
import * as dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

// Firebase Client SDK config
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('❌ Missing Firebase credentials in .env file');
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log(`✅ Firebase initialized: ${firebaseConfig.projectId}`);

async function gradeBasketballBets() {
  console.log('\n🏀 BASKETBALL BET GRADING SCRIPT');
  console.log('==================================\n');
  
  try {
    // 1. Load OddsTrader data from local file
    console.log('📂 Loading OddsTrader data...');
    const oddsPath = join(__dirname, '../public/basketball_odds.md');
    const oddsMarkdown = await fs.readFile(oddsPath, 'utf8');
    console.log('✅ Loaded basketball_odds.md\n');
    
    // 2. Parse results (ONLY completed games)
    console.log('🔍 Parsing final scores...');
    const results = parseBasketballResults(oddsMarkdown);
    console.log(`✅ Found ${results.length} completed games\n`);
    
    if (results.length === 0) {
      console.log('⏭️  No completed games found. Exiting.');
      return 0;
    }
    
    // 3. Fetch pending basketball bets from Firebase
    console.log('📊 Fetching pending bets from Firebase...');
    const gameDate = getETGameDate();
    const betsQuery = query(
      collection(db, 'basketball_bets'),
      where('status', '==', 'PENDING'),
      where('date', '==', gameDate)
    );
    const betsSnapshot = await getDocs(betsQuery);
    console.log(`✅ Found ${betsSnapshot.size} pending bets for ${gameDate}\n`);
    
    if (betsSnapshot.empty) {
      console.log('⏭️  No pending bets to grade. Exiting.');
      return 0;
    }
    
    // 4. Match bets to results and grade
    console.log('🎯 Grading bets...\n');
    let gradedCount = 0;
    
    for (const betDoc of betsSnapshot.docs) {
      const bet = betDoc.data();
      const betId = betDoc.id;
      
      // Normalize team names for fuzzy matching
      const normalizeTeam = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      // Find matching result
      const matchingResult = results.find(result => {
        const awayMatch = normalizeTeam(result.awayTeam) === normalizeTeam(bet.game.awayTeam);
        const homeMatch = normalizeTeam(result.homeTeam) === normalizeTeam(bet.game.homeTeam);
        return awayMatch && homeMatch;
      });
      
      if (!matchingResult) {
        console.log(`⏭️  No result found for: ${bet.game.awayTeam} @ ${bet.game.homeTeam}`);
        continue;
      }
      
      // Determine outcome
      const betTeam = bet.bet.team;
      const normalizedBetTeam = normalizeTeam(betTeam);
      const normalizedWinner = normalizeTeam(matchingResult.winnerTeam);
      const outcome = normalizedBetTeam === normalizedWinner ? 'WIN' : 'LOSS';
      
      // Calculate profit (1 unit flat bet)
      const profit = outcome === 'WIN' 
        ? (bet.bet.odds < 0 ? 100 / Math.abs(bet.bet.odds) : bet.bet.odds / 100)
        : -1;
      
      // Update bet in Firebase
      await updateDoc(doc(db, 'basketball_bets', betId), {
        'result.winner': matchingResult.winner,
        'result.winnerTeam': matchingResult.winnerTeam,
        'result.outcome': outcome,
        'result.profit': profit,
        'result.fetched': true,
        'result.fetchedAt': Date.now(),
        'result.source': 'OddsTrader',
        'status': 'COMPLETED'
      });
      
      gradedCount++;
      console.log(`✅ ${outcome}: ${bet.game.awayTeam} @ ${bet.game.homeTeam}`);
      console.log(`   Pick: ${betTeam} (${bet.bet.odds > 0 ? '+' : ''}${bet.bet.odds})`);
      console.log(`   Winner: ${matchingResult.winnerTeam}`);
      console.log(`   Profit: ${profit > 0 ? '+' : ''}${profit.toFixed(2)}u\n`);
    }
    
    console.log('==================================');
    console.log(`🎉 Graded ${gradedCount}/${betsSnapshot.size} bets\n`);
    return gradedCount;
    
  } catch (error) {
    console.error('❌ Error grading bets:', error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  gradeBasketballBets()
    .then(() => {
      console.log('✅ Script completed successfully\n');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed!');
      process.exit(1);
    });
}

export { gradeBasketballBets };

