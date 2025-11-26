import admin from 'firebase-admin';
import { parseBasketballResults } from '../src/utils/basketballResultsParser.js';
import { getETGameDate } from '../src/utils/dateUtils.js';
import { getUnitSize, calculateUnitProfit } from '../src/utils/staggeredUnits.js';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin SDK (EXACT pattern as updateBookmarkResults.js)
const serviceAccount = {
  project_id: process.env.VITE_FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
};

// Validate credentials
if (!serviceAccount.project_id || !serviceAccount.client_email || !serviceAccount.private_key) {
  console.error('❌ Missing Firebase credentials');
  console.error('Required environment variables:');
  console.error('  - VITE_FIREBASE_PROJECT_ID');
  console.error('  - FIREBASE_CLIENT_EMAIL');
  console.error('  - FIREBASE_PRIVATE_KEY');
  process.exit(1);
}

console.log(`✅ Service account loaded: ${serviceAccount.client_email}`);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function gradeBasketballBets() {
  console.log('\n🏀 BASKETBALL BET GRADING SCRIPT');
  console.log('==================================\n');
  
  try {
    // 1. Load OddsTrader data from file system (not HTTP - works in GitHub Actions)
    console.log('📂 Loading OddsTrader data from filesystem...');
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
    
    // 3. Fetch pending basketball bets from Firebase (using Admin SDK)
    console.log('📊 Fetching pending bets from Firebase...');
    const gameDate = getETGameDate();
    const betsSnapshot = await db.collection('basketball_bets')
      .where('status', '==', 'PENDING')
      .where('date', '==', gameDate)
      .get();
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
      
      // Calculate profit using staggered units based on grade
      const grade = bet.prediction?.grade || 'B'; // Default to B if no grade
      const units = getUnitSize(grade);
      const profit = calculateUnitProfit(grade, bet.bet.odds, outcome === 'WIN');
      
      // Update bet in Firebase (using Admin SDK)
      await db.collection('basketball_bets').doc(betId).update({
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
      console.log(`   Grade: ${grade} → ${units}u risked`);
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

