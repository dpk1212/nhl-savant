#!/usr/bin/env node
/**
 * Remove Duplicate Bets Script
 * 
 * Finds and removes duplicate bets created when odds were scraped on different days
 * Keeps the most recent bet for each unique game+market combination
 * 
 * Run: node scripts/removeDuplicateBets.js
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, deleteDoc } from 'firebase/firestore';

// Firebase config
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

console.log('🧹 Starting duplicate bet cleanup...\n');

async function removeDuplicates() {
  try {
    // Get all bets
    const betsSnapshot = await getDocs(collection(db, 'bets'));
    const bets = betsSnapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
    
    console.log(`📊 Found ${bets.length} total bets\n`);
    
    // Group bets by unique game+market combination
    const betGroups = new Map();
    
    bets.forEach(bet => {
      // Create unique key based on matchup + market + team/side (NOT date!)
      let key;
      if (bet.bet?.market === 'MONEYLINE') {
        key = `${bet.game?.awayTeam}_${bet.game?.homeTeam}_MONEYLINE_${bet.bet.team}`;
      } else if (bet.bet?.market === 'TOTAL') {
        key = `${bet.game?.awayTeam}_${bet.game?.homeTeam}_TOTAL_${bet.bet.side}`;
      } else {
        key = `${bet.game?.awayTeam}_${bet.game?.homeTeam}_${bet.bet?.market}_${bet.bet?.pick}`;
      }
      
      if (!betGroups.has(key)) {
        betGroups.set(key, []);
      }
      betGroups.get(key).push(bet);
    });
    
    console.log(`🔍 Found ${betGroups.size} unique bet groups\n`);
    
    let duplicatesFound = 0;
    let duplicatesDeleted = 0;
    
    // Process each group
    for (const [key, group] of betGroups.entries()) {
      if (group.length > 1) {
        duplicatesFound++;
        console.log(`\n📦 Duplicate group: ${key}`);
        console.log(`   ${group.length} bets found:`);
        
        // Sort by timestamp (most recent first)
        group.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        
        // Keep the first (most recent), delete the rest
        const toKeep = group[0];
        const toDelete = group.slice(1);
        
        group.forEach((bet, i) => {
          const marker = i === 0 ? '✅ KEEP' : '❌ DELETE';
          console.log(`   ${marker} - ${bet.date} (${bet.docId.substring(0, 20)}...)`);
        });
        
        // Delete old duplicates
        for (const bet of toDelete) {
          await deleteDoc(doc(db, 'bets', bet.docId));
          duplicatesDeleted++;
          console.log(`   🗑️  Deleted ${bet.docId}`);
        }
      }
    }
    
    console.log('\n' + '='.repeat(60));
    if (duplicatesFound === 0) {
      console.log(`✅ No duplicates found! Database is clean.`);
    } else {
      console.log(`✅ Cleanup complete!`);
      console.log(`   Duplicate groups found: ${duplicatesFound}`);
      console.log(`   Bets deleted: ${duplicatesDeleted}`);
      console.log(`   Bets remaining: ${bets.length - duplicatesDeleted}`);
    }
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

removeDuplicates();

