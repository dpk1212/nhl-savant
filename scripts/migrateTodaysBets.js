import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';

// Firebase config (same as in src/firebase/config.js)
const firebaseConfig = {
  apiKey: "AIzaSyDob4kKHtKUP2xyPC_5o-xqOWaJJmNa-Eo",
  authDomain: "nhl-savant.firebaseapp.com",
  projectId: "nhl-savant",
  storageBucket: "nhl-savant.firebasestorage.app",
  messagingSenderId: "622389724620",
  appId: "1:622389724620:web:4a2a1f7e8f0b0e0e0e0e0e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrateTodaysBets() {
  const today = new Date().toISOString().split('T')[0];
  console.log(`\n🔄 MIGRATING BETS FOR ${today}\n`);
  console.log('This will add history tracking to existing bets...\n');
  
  try {
    // Get all bets from today
    const betsRef = collection(db, 'bets');
    const q = query(betsRef, where('date', '==', today));
    const snapshot = await getDocs(q);
    
    console.log(`📊 Found ${snapshot.size} bets from today\n`);
    
    if (snapshot.size === 0) {
      console.log('✅ No bets to migrate. You\'re all set!');
      process.exit(0);
    }
    
    let migrated = 0;
    let skipped = 0;
    let errors = 0;
    
    for (const betDoc of snapshot.docs) {
      const betData = betDoc.data();
      const betId = betDoc.id;
      
      // Skip if already has history tracking
      if (betData.history && betData.firstRecommendedAt) {
        console.log(`⏭️  Skipped: ${betId}`);
        console.log(`   (Already has history tracking)\n`);
        skipped++;
        continue;
      }
      
      try {
        // Add history tracking fields
        const updateData = {
          firstRecommendedAt: betData.timestamp || Date.now(),
          initialOdds: betData.bet?.odds || 0,
          initialEV: betData.prediction?.evPercent || 0,
          history: [{
            timestamp: betData.timestamp || Date.now(),
            odds: betData.bet?.odds || 0,
            evPercent: betData.prediction?.evPercent || 0,
            modelProb: betData.prediction?.modelProb || 0,
            marketProb: betData.prediction?.marketProb || 0
          }]
        };
        
        await updateDoc(doc(db, 'bets', betId), updateData);
        
        console.log(`✅ Migrated: ${betId}`);
        console.log(`   Market: ${betData.bet?.market}`);
        console.log(`   Pick: ${betData.bet?.pick}`);
        console.log(`   Initial Odds: ${betData.bet?.odds}`);
        console.log(`   Initial EV: ${betData.prediction?.evPercent?.toFixed(1)}%\n`);
        
        migrated++;
      } catch (error) {
        console.error(`❌ Error migrating ${betId}:`, error.message);
        errors++;
      }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('🎉 MIGRATION COMPLETE!\n');
    console.log(`   ✅ Successfully migrated: ${migrated} bets`);
    console.log(`   ⏭️  Already had history: ${skipped} bets`);
    if (errors > 0) {
      console.log(`   ❌ Errors: ${errors} bets`);
    }
    console.log('='.repeat(50) + '\n');
    
    console.log('📊 Next steps:');
    console.log('   1. Refresh your site to see the updated bets');
    console.log('   2. Future odds changes will be tracked in history array');
    console.log('   3. You can now analyze opening vs closing odds\n');
    
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ MIGRATION FAILED:', error);
    console.error('\nError details:', error.message);
    process.exit(1);
  }
}

// Run the migration
migrateTodaysBets();

