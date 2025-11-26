/**
 * Migration Script: Recalculate Basketball Bet Profits with Staggered Units
 * CLIENT SDK VERSION - Runs in browser console
 * 
 * PROBLEM: Existing bets were graded with flat 1u profit calculations
 * SOLUTION: Recalculate all bet profits using staggered units based on grade
 * 
 * HOW TO RUN:
 * 1. Open your Basketball page in the browser
 * 2. Open Developer Console (F12 or Cmd+Option+I)
 * 3. Copy and paste this entire script
 * 4. Press Enter to run
 */

import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../src/firebase/config.js';
import { getUnitSize, calculateUnitProfit } from '../src/utils/staggeredUnits.js';

export async function migrateBasketballBetsClient() {
  try {
    console.log('🔄 Starting basketball bet profit migration (CLIENT)...\n');
    
    // Fetch all COMPLETED basketball bets
    const betsSnapshot = await getDocs(collection(db, 'basketball_bets'));
    const completedBets = betsSnapshot.docs.filter(doc => doc.data().status === 'COMPLETED');
    
    console.log(`📊 Found ${completedBets.length} completed bets to migrate\n`);
    
    if (completedBets.length === 0) {
      console.log('✅ No bets to migrate. Exiting.');
      return { migrated: 0, unchanged: 0 };
    }
    
    let migratedCount = 0;
    let unchangedCount = 0;
    
    for (const betDoc of completedBets) {
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
        const betRef = doc(db, 'basketball_bets', betId);
        await updateDoc(betRef, {
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
    console.log(`   📊 Total: ${completedBets.length} bets\n`);
    
    return { migrated: migratedCount, unchanged: unchangedCount };
    
  } catch (error) {
    console.error('❌ Migration error:', error);
    throw error;
  }
}

// Auto-run if imported
console.log('🚀 Migration script loaded! Running migration...\n');
migrateBasketballBetsClient()
  .then((result) => {
    console.log(`✅ Migration complete: ${result.migrated} migrated, ${result.unchanged} unchanged`);
  })
  .catch((error) => {
    console.error('❌ Migration failed:', error);
  });

