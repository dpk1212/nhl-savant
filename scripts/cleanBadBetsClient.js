/**
 * Clean Bad Basketball Bets (Client SDK)
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import * as dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

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

async function cleanBadBets() {
  console.log('\n🧹 CLEANING BAD BASKETBALL BETS\n');
  
  const today = '2025-12-22';
  
  const betsSnapshot = await getDocs(collection(db, 'basketball_bets'));
  
  const toDelete = [];
  const toKeep = [];
  
  betsSnapshot.forEach((docSnap) => {
    const bet = docSnap.data();
    if (bet.date !== today) return;
    
    const ev = bet.prediction?.evPercent || 0;
    const isSuspicious = ev >= 24.5 || (bet.bet?.odds >= 1000 && ev >= 15);
    
    if (isSuspicious) {
      toDelete.push({ id: docSnap.id, ...bet });
    } else {
      toKeep.push({ id: docSnap.id, ...bet });
    }
  });
  
  console.log(`❌ Deleting ${toDelete.length} bad bets:`);
  for (const bet of toDelete) {
    console.log(`   ${bet.game.awayTeam} @ ${bet.game.homeTeam} - ${bet.prediction.evPercent}% EV`);
    await deleteDoc(doc(db, 'basketball_bets', bet.id));
  }
  
  console.log(`\n✅ Keeping ${toKeep.length} quality bets:`);
  toKeep.forEach(bet => {
    console.log(`   ${bet.game.awayTeam} @ ${bet.game.homeTeam} - ${bet.prediction.evPercent}% EV`);
  });
  
  console.log(`\n✅ Cleaned up ${toDelete.length} bad bets!\n`);
  process.exit(0);
}

cleanBadBets().catch(err => {
  console.error(err);
  process.exit(1);
});


