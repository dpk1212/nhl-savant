/**
 * ONE-TIME SCRIPT: Recalculate ALL basketball bet profits in Firebase
 * Uses current staggered unit system to fix any incorrect profit calculations
 */

import admin from 'firebase-admin';
import { calculateUnitProfit, getUnitSize } from '../src/utils/staggeredUnits.js';

// Initialize Firebase Admin
const serviceAccount = {
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

console.log('\n🔧 RECALCULATING ALL BASKETBALL BET PROFITS');
console.log('='.repeat(70));

async function recalculateAllProfits() {
  try {
    // Fetch all basketball bets
    const betsSnapshot = await db.collection('basketball-bets').get();
    
    console.log(`\n📊 Found ${betsSnapshot.size} total bets in Firebase\n`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    const updates = [];
    
    for (const doc of betsSnapshot.docs) {
      const bet = doc.data();
      const docId = doc.id;
      
      // Only process bets that have been graded (have a result)
      if (!bet.result || !bet.result.outcome) {
        skippedCount++;
        continue;
      }
      
      const grade = bet.prediction?.grade || 'B'; // Default to B if no grade
      const odds = bet.bet?.odds || 0;
      const outcome = bet.result.outcome; // 'WIN' or 'LOSS'
      const isWin = outcome === 'WIN';
      
      // Calculate the CORRECT profit using staggered units
      const correctProfit = calculateUnitProfit(grade, odds, isWin);
      const currentProfit = bet.result.profit || 0;
      
      // Check if profit needs updating (allow for small floating point differences)
      const needsUpdate = Math.abs(correctProfit - currentProfit) > 0.01;
      
      if (needsUpdate) {
        const updateData = {
          'result.profit': correctProfit,
          'prediction.grade': grade, // Ensure grade is stored
          lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        };
        
        updates.push({
          docId,
          bet: `${bet.teams?.away || '?'} @ ${bet.teams?.home || '?'}`,
          grade,
          outcome,
          oldProfit: currentProfit.toFixed(2),
          newProfit: correctProfit.toFixed(2),
          units: getUnitSize(grade)
        });
        
        // Update in Firebase
        await db.collection('basketball-bets').doc(docId).update(updateData);
        updatedCount++;
        
        console.log(`✅ ${updatedCount}. ${bet.teams?.away || '?'} @ ${bet.teams?.home || '?'}`);
        console.log(`   Grade: ${grade} (${getUnitSize(grade)}u) | ${outcome}`);
        console.log(`   OLD: ${currentProfit.toFixed(2)}u → NEW: ${correctProfit.toFixed(2)}u`);
        console.log('');
      } else {
        skippedCount++;
      }
    }
    
    console.log('\n' + '='.repeat(70));
    console.log('📊 RECALCULATION SUMMARY');
    console.log('='.repeat(70));
    console.log(`Total Bets: ${betsSnapshot.size}`);
    console.log(`✅ Updated: ${updatedCount}`);
    console.log(`⏭️  Skipped (already correct or not graded): ${skippedCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    
    if (updates.length > 0) {
      console.log('\n📋 DETAILED UPDATE LOG:');
      console.log('='.repeat(70));
      updates.forEach(u => {
        console.log(`${u.bet}`);
        console.log(`  Grade: ${u.grade} (${u.units}u) | ${u.outcome}`);
        console.log(`  Profit: ${u.oldProfit}u → ${u.newProfit}u`);
      });
    }
    
    console.log('\n' + '='.repeat(70));
    console.log('✅ RECALCULATION COMPLETE!');
    console.log('='.repeat(70));
    
  } catch (error) {
    console.error('\n❌ ERROR:', error);
    throw error;
  } finally {
    // Close Firebase connection
    await admin.app().delete();
  }
}

// Run the script
recalculateAllProfits()
  .then(() => {
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });

