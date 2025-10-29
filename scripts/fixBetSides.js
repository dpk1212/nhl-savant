#!/usr/bin/env node
/**
 * Fix Bet Sides Script
 * 
 * CRITICAL FIX: All ML bets were saved with wrong side due to missing (HOME)/(AWAY) labels
 * This script recalculates bet.side and bet.result for all bets in Firebase
 * 
 * Run: node scripts/fixBetSides.js
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Firebase config (from environment variables or hardcoded)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyDH8aWyZb3Z0i8MpV8gI6RxF6L-FpP-rqw",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "nhl-savant.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "nhl-savant",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "nhl-savant.firebasestorage.app",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1091668639932",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:1091668639932:web:3eb0d419b05bfb4f9e6e02"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log('🔧 Starting bet side fix...\n');

async function fixBetSides() {
  try {
    // Get all bets
    const betsSnapshot = await getDocs(collection(db, 'bets'));
    const bets = betsSnapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
    
    console.log(`📊 Found ${bets.length} total bets\n`);
    
    let fixed = 0;
    let skipped = 0;
    
    for (const bet of bets) {
      // Only fix MONEYLINE bets
      if (bet.bet?.market !== 'MONEYLINE') {
        skipped++;
        continue;
      }
      
      // Determine correct side based on team
      const isHome = bet.bet.team === bet.game?.homeTeam;
      const correctSide = isHome ? 'HOME' : 'AWAY';
      
      // Check if side is wrong
      if (bet.bet.side === correctSide) {
        skipped++;
        continue; // Already correct
      }
      
      console.log(`🔧 Fixing: ${bet.game?.awayTeam} @ ${bet.game?.homeTeam} - ${bet.bet.pick}`);
      console.log(`   Team: ${bet.bet.team}, Was: ${bet.bet.side}, Should be: ${correctSide}`);
      
      // Recalculate outcome if game is completed
      let newOutcome = bet.result?.outcome;
      let newProfit = bet.result?.profit;
      
      if (bet.status === 'COMPLETED' && bet.result?.awayScore != null && bet.result?.homeScore != null) {
        const awayWon = bet.result.awayScore > bet.result.homeScore;
        const homeWon = bet.result.homeScore > bet.result.awayScore;
        
        if (correctSide === 'HOME') {
          newOutcome = homeWon ? 'WIN' : 'LOSS';
        } else {
          newOutcome = awayWon ? 'WIN' : 'LOSS';
        }
        
        // Recalculate profit
        if (newOutcome === 'WIN') {
          if (bet.bet.odds < 0) {
            newProfit = 100 / Math.abs(bet.bet.odds);
          } else {
            newProfit = bet.bet.odds / 100;
          }
        } else {
          newProfit = -1;
        }
        
        console.log(`   Result: ${bet.result.outcome} → ${newOutcome}, Profit: ${bet.result.profit?.toFixed(2)} → ${newProfit.toFixed(2)}u`);
      }
      
      // Update Firebase
      await updateDoc(doc(db, 'bets', bet.docId), {
        'bet.side': correctSide,
        'bet.pick': `${bet.bet.team} ML (${correctSide})`, // Fix pick string too
        ...(bet.status === 'COMPLETED' && {
          'result.outcome': newOutcome,
          'result.profit': newProfit
        })
      });
      
      fixed++;
      console.log(`   ✅ Fixed\n`);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log(`✅ Complete!`);
    console.log(`   Fixed: ${fixed} bets`);
    console.log(`   Skipped: ${skipped} bets (already correct or not ML)`);
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixBetSides();

