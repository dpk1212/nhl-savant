/**
 * Examine Basketball Bets in Firebase
 * Shows what grades, units, and profit calculations are stored
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { getUnitSize, calculateUnitProfit } from '../src/utils/staggeredUnits.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

// Initialize Firebase Admin
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
const app = initializeApp({
  credential: cert(serviceAccount)
});
const db = getFirestore(app);

async function examineBasketballBets() {
  console.log('\n🔍 EXAMINING BASKETBALL BETS IN FIREBASE');
  console.log('==========================================\n');
  
  try {
    // Get all basketball bets
    const betsSnapshot = await db.collection('basketball_bets').get();
    
    if (betsSnapshot.empty) {
      console.log('❌ No bets found in Firebase!');
      return;
    }
    
    console.log(`📊 Found ${betsSnapshot.size} total bets\n`);
    
    // Organize by status
    const pending = [];
    const completed = [];
    
    betsSnapshot.docs.forEach(doc => {
      const bet = { id: doc.id, ...doc.data() };
      if (bet.result?.outcome) {
        completed.push(bet);
      } else {
        pending.push(bet);
      }
    });
    
    console.log(`✅ Completed: ${completed.length}`);
    console.log(`⏳ Pending: ${pending.length}\n`);
    
    // Examine PENDING bets
    if (pending.length > 0) {
      console.log('═════════════════════════════════════════');
      console.log('⏳ PENDING BETS (will reconcile later)');
      console.log('═════════════════════════════════════════\n');
      
      pending.forEach((bet, i) => {
        const grade = bet.prediction?.grade || 'N/A';
        const units = getUnitSize(grade);
        const odds = bet.bet?.odds || 0;
        
        console.log(`${i + 1}. ${bet.game?.awayTeam} @ ${bet.game?.homeTeam}`);
        console.log(`   Pick: ${bet.bet?.team} (${odds > 0 ? '+' : ''}${odds})`);
        console.log(`   Grade: ${grade} → Risk ${units}u`);
        console.log(`   Status: ${bet.status}`);
        console.log(`   Date: ${bet.date}`);
        
        // Calculate POTENTIAL profit/loss
        const potentialWin = calculateUnitProfit(grade, odds, true);
        const potentialLoss = calculateUnitProfit(grade, odds, false);
        console.log(`   If WIN: +${potentialWin.toFixed(2)}u`);
        console.log(`   If LOSS: ${potentialLoss.toFixed(2)}u\n`);
      });
    }
    
    // Examine COMPLETED bets
    if (completed.length > 0) {
      console.log('═════════════════════════════════════════');
      console.log('✅ COMPLETED BETS (already graded)');
      console.log('═════════════════════════════════════════\n');
      
      let totalProfit = 0;
      let totalRisked = 0;
      let wins = 0;
      let losses = 0;
      
      completed.forEach((bet, i) => {
        const grade = bet.prediction?.grade || 'N/A';
        const units = getUnitSize(grade);
        const outcome = bet.result?.outcome;
        const profit = bet.result?.profit || 0;
        
        if (outcome === 'WIN') wins++;
        if (outcome === 'LOSS') losses++;
        
        totalProfit += profit;
        totalRisked += units;
        
        console.log(`${i + 1}. ${bet.game?.awayTeam} @ ${bet.game?.homeTeam}`);
        console.log(`   Pick: ${bet.bet?.team} (${bet.bet?.odds > 0 ? '+' : ''}${bet.bet?.odds})`);
        console.log(`   Grade: ${grade} → ${units}u risked`);
        console.log(`   Result: ${outcome} → ${profit > 0 ? '+' : ''}${profit.toFixed(2)}u`);
        console.log(`   Date: ${bet.date}\n`);
      });
      
      console.log('═════════════════════════════════════════');
      console.log('📈 SUMMARY STATS');
      console.log('═════════════════════════════════════════');
      console.log(`Record: ${wins}-${losses} (${wins + losses} graded)`);
      console.log(`Win Rate: ${((wins / (wins + losses)) * 100).toFixed(1)}%`);
      console.log(`Total Units Risked: ${totalRisked.toFixed(2)}u`);
      console.log(`Total Profit: ${totalProfit > 0 ? '+' : ''}${totalProfit.toFixed(2)}u`);
      console.log(`ROI: ${((totalProfit / totalRisked) * 100).toFixed(1)}%`);
    }
    
    console.log('\n==========================================');
    console.log('✅ EXAMINATION COMPLETE');
    console.log('==========================================\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

// Run
examineBasketballBets()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

