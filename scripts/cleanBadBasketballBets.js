/**
 * Clean Bad Basketball Bets from Firebase
 * Deletes bets with suspicious 25% EV (garbage data)
 */

import admin from 'firebase-admin';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function cleanBadBets() {
  console.log('\n🧹 CLEANING BAD BASKETBALL BETS');
  console.log('==========================================\n');
  
  const today = '2025-12-22';
  
  try {
    // Get today's bets
    const betsSnapshot = await db.collection('basketball_bets')
      .where('date', '==', today)
      .get();
    
    console.log(`Found ${betsSnapshot.size} bets for ${today}\n`);
    
    const toDelete = [];
    const toKeep = [];
    
    betsSnapshot.docs.forEach(doc => {
      const bet = doc.data();
      const ev = bet.prediction?.evPercent || 0;
      
      // Flag suspicious bets (25% EV or extreme longshots with high EV)
      const isSuspicious = ev >= 24.5 || (bet.bet?.odds >= 1000 && ev >= 15);
      
      if (isSuspicious) {
        toDelete.push({ id: doc.id, ...bet });
      } else {
        toKeep.push({ id: doc.id, ...bet });
      }
    });
    
    console.log(`🗑️  Bets to DELETE (suspicious data): ${toDelete.length}`);
    toDelete.forEach(bet => {
      console.log(`   ❌ ${bet.game.awayTeam} @ ${bet.game.homeTeam} - ${bet.prediction.evPercent}% EV`);
    });
    
    console.log(`\n✅ Bets to KEEP (quality data): ${toKeep.length}`);
    toKeep.forEach(bet => {
      console.log(`   ✓ ${bet.game.awayTeam} @ ${bet.game.homeTeam} - ${bet.prediction.evPercent}% EV`);
    });
    
    if (toDelete.length === 0) {
      console.log('\n✅ No bad bets to delete!');
      return;
    }
    
    // Delete bad bets
    console.log(`\n🗑️  Deleting ${toDelete.length} bad bets...`);
    const batch = db.batch();
    toDelete.forEach(bet => {
      const ref = db.collection('basketball_bets').doc(bet.id);
      batch.delete(ref);
    });
    
    await batch.commit();
    console.log(`✅ Deleted ${toDelete.length} bad bets`);
    console.log(`✅ Kept ${toKeep.length} quality bets\n`);
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

cleanBadBets()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });


