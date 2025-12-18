import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import * as dotenv from 'dotenv';

dotenv.config();

const app = initializeApp({
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
});

const db = getFirestore(app);

const betsRef = collection(db, 'basketball_bets');
const q = query(betsRef, where('game.awayTeam', '==', 'Creighton'));

const snapshot = await getDocs(q);
snapshot.forEach(doc => {
  const bet = doc.data();
  console.log('\n🏀 CREIGHTON BET:');
  console.log('Date:', bet.date);
  console.log('Units Stored:', bet.prediction?.unitSize);
  console.log('Dynamic Units:', bet.prediction?.dynamicUnits);
  console.log('Static Units:', bet.prediction?.staticUnitSize);
  console.log('Odds:', bet.bet?.odds);
  console.log('Result:', bet.result?.outcome);
  console.log('Profit:', bet.result?.profit);
  console.log('Result Units:', bet.result?.units);
});
