/**
 * Migration Script: Recalculate Basketball Bet Profits with Staggered Units
 * 
 * PROBLEM: Existing bets were graded with flat 1u profit calculations
 * SOLUTION: Recalculate all bet profits using staggered units based on grade
 * 
 * Run with: npm run migrate-basketball-units
 */

import admin from 'firebase-admin';
import { getUnitSize, calculateUnitProfit } from '../src/utils/staggeredUnits.js';

// Initialize Firebase Admin SDK
const serviceAccount = {
  project_id: process.env.VITE_FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
};

if (!serviceAccount.project_id || !serviceAccount.client_email || !serviceAccount.private_key) {
  console.error('❌ Missing Firebase credentials');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function migrateBasketballBets() {
  try {
    console.log('🔄 Starting basketball bet profit migration...\n');
    
    // Fetch all COMPLETED basketball bets
    const betsSnapshot = await db.collection('basketball_bets')
      .where('status', '==', 'COMPLETED')
      .get();
    
    console.log(`📊 Found ${betsSnapshot.size} completed bets to migrate\n`);
    
    if (betsSnapshot.empty) {
      console.log('✅ No bets to migrate. Exiting.');
      return;
    }
    
    let migratedCount = 0;
    let unchangedCount = 0;
    
    for (const betDoc of betsSnapshot.docs) {
      const bet = betDoc.data();
      const betId = betDoc.id;
      
      // Get grade and outcome
      const grade = bet.prediction?.grade || 'B';
      const outcome = bet.result?.outcome;
      const odds = bet.bet?.odds;
      const oldProfit = bet.result?.profit || 0;
      
      if (!outcome || !odds) {
        console.log(`⏭️  Skipping ${betId}: Missing outcome or odds`);
        unchangedCount++;
        continue;
      }
      
      // Calculate NEW profit using staggered units
      const units = getUnitSize(grade);
      const newProfit = calculateUnitProfit(grade, odds, outcome === 'WIN');
      
      // Check if profit changed
      const profitChanged = Math.abs(oldProfit - newProfit) > 0.01;
      
      if (profitChanged) {
        // Update bet with new profit
        await db.collection('basketball_bets').doc(betId).update({
          'result.profit': newProfit,
          'result.migratedToStaggeredUnits': true,
          'result.migratedAt': Date.now(),
          'result.oldProfit': oldProfit
        });
        
        console.log(`✅ MIGRATED: ${bet.game.awayTeam} @ ${bet.game.homeTeam}`);
        console.log(`   Grade: ${grade} (${units}u risked)`);
        console.log(`   Outcome: ${outcome}`);
        console.log(`   Old profit: ${oldProfit > 0 ? '+' : ''}${oldProfit.toFixed(2)}u`);
        console.log(`   New profit: ${newProfit > 0 ? '+' : ''}${newProfit.toFixed(2)}u\n`);
        
        migratedCount++;
      } else {
        unchangedCount++;
      }
    }
    
    console.log('==================================');
    console.log(`🎉 Migration complete!`);
    console.log(`   ✅ Migrated: ${migratedCount} bets`);
    console.log(`   ⏭️  Unchanged: ${unchangedCount} bets`);
    console.log(`   📊 Total: ${betsSnapshot.size} bets\n`);
    
  } catch (error) {
    console.error('❌ Migration error:', error);
    throw error;
  }
}

// Run migration
migrateBasketballBets()
  .then(() => {
    console.log('✅ Migration script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration script failed:', error);
    process.exit(1);
  });

