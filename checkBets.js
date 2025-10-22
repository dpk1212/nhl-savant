import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import * as dotenv from 'dotenv';

dotenv.config();

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

async function checkBets() {
  const snapshot = await getDocs(collection(db, 'bets'));
  console.log(`\n📊 Total bets in Firebase: ${snapshot.size}\n`);
  
  snapshot.forEach(doc => {
    const bet = doc.data();
    console.log(`ID: ${doc.id}`);
    console.log(`Date: ${bet.date}`);
    console.log(`Status: ${bet.status}`);
    console.log(`Game: ${bet.game?.awayTeam} @ ${bet.game?.homeTeam}`);
    console.log(`Bet: ${bet.bet?.pick}`);
    console.log(`---`);
  });
  
  process.exit(0);
}

checkBets();
