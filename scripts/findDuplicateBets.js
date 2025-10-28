/**
 * Diagnostic Script: Find Duplicate Bets in Firebase
 * 
 * This script identifies bets that are duplicates based on:
 * - Same date + game + market combination
 * 
 * Expected: 1 ML bet + 1 Total bet per game per day
 * If more than that exist, they're duplicates
 * 
 * Run with: node scripts/findDuplicateBets.js
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from parent directory
dotenv.config({ path: join(__dirname, '..', '.env') });

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

console.log('\n🔍 DUPLICATE BET DETECTOR');
console.log('=' .repeat(70));
console.log('\nAnalyzing Firebase bets for duplicates...\n');

async function findDuplicates() {
  try {
    // Get all bets
    const q = query(
      collection(db, 'bets'),
      orderBy('date', 'desc'),
      orderBy('timestamp', 'desc')
    );
    
    const snapshot = await getDocs(q);
    console.log(`📊 Total bets in Firebase: ${snapshot.size}\n`);
    
    if (snapshot.size === 0) {
      console.log('✅ No bets found. Database is empty.');
      process.exit(0);
    }
    
    // Group bets by date + game + market
    const grouped = {};
    
    snapshot.forEach(doc => {
      const bet = doc.data();
      const key = `${bet.date}_${bet.game?.awayTeam}_${bet.game?.homeTeam}_${bet.bet?.market}`;
      
      if (!grouped[key]) {
        grouped[key] = [];
      }
      
      grouped[key].push({
        docId: doc.id,
        ...bet
      });
    });
    
    // Find duplicates (groups with > 1 bet)
    const duplicates = Object.entries(grouped).filter(([key, bets]) => bets.length > 1);
    
    if (duplicates.length === 0) {
      console.log('✅ NO DUPLICATES FOUND!');
      console.log('\nAll games have exactly 1 bet per market. System is working correctly.\n');
      
      // Show summary
      console.log('📈 Summary by Date:');
      const byDate = {};
      Object.values(grouped).flat().forEach(bet => {
        if (!byDate[bet.date]) {
          byDate[bet.date] = { ml: 0, total: 0 };
        }
        if (bet.bet?.market === 'MONEYLINE') byDate[bet.date].ml++;
        if (bet.bet?.market === 'TOTAL') byDate[bet.date].total++;
      });
      
      Object.entries(byDate).sort().reverse().forEach(([date, counts]) => {
        console.log(`   ${date}: ${counts.ml} ML, ${counts.total} Total`);
      });
      
      process.exit(0);
    }
    
    // Display duplicates
    console.log(`❌ FOUND ${duplicates.length} DUPLICATE GROUPS:\n`);
    console.log('=' .repeat(70));
    
    let totalDuplicateBets = 0;
    
    duplicates.forEach(([key, bets], index) => {
      const [date, away, home, market] = key.split('_');
      
      console.log(`\n${index + 1}. ${away} @ ${home} (${date}) - ${market}`);
      console.log(`   ${bets.length} bets found (should be 1):\n`);
      
      totalDuplicateBets += bets.length - 1; // Count extras
      
      bets.forEach((bet, betIndex) => {
        console.log(`   ${String.fromCharCode(97 + betIndex)}) Document ID: ${bet.docId}`);
        console.log(`      Pick: ${bet.bet?.pick}`);
        console.log(`      Odds: ${bet.bet?.odds > 0 ? '+' : ''}${bet.bet?.odds}`);
        console.log(`      Line: ${bet.bet?.line || 'N/A'}`);
        console.log(`      EV: ${bet.prediction?.evPercent?.toFixed(1)}%`);
        console.log(`      Timestamp: ${new Date(bet.timestamp).toLocaleString()}`);
        console.log(`      Status: ${bet.status}`);
        if (bet.result?.outcome) {
          console.log(`      Result: ${bet.result.outcome} (${bet.result.profit > 0 ? '+' : ''}${bet.result.profit?.toFixed(2)}u)`);
        }
        console.log('');
      });
      
      console.log(`   💡 RECOMMENDATION: Keep the bet with most complete data/earliest timestamp`);
      console.log(`      Delete the other ${bets.length - 1} bet(s)`);
    });
    
    console.log('\n' + '='.repeat(70));
    console.log(`\n📊 SUMMARY:`);
    console.log(`   Duplicate groups: ${duplicates.length}`);
    console.log(`   Extra bets to remove: ${totalDuplicateBets}`);
    console.log(`\n⚠️  ACTION REQUIRED:`);
    console.log(`   1. Review each duplicate group above`);
    console.log(`   2. Decide which bet to keep (usually the earliest/most complete)`);
    console.log(`   3. Delete the extra bets manually in Firebase Console`);
    console.log(`   4. Re-run this script to verify all duplicates are removed\n`);
    console.log(`🔗 Firebase Console: https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore/data/~2Fbets\n`);
    
    process.exit(1); // Exit with error code since duplicates exist
    
  } catch (error) {
    console.error('\n❌ Error analyzing bets:', error);
    process.exit(1);
  }
}

findDuplicates();

