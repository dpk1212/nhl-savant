import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDob4kKHtKUP2xyPC_5o-xqOWaJJmNa-Eo",
  authDomain: "nhl-savant.firebaseapp.com",
  projectId: "nhl-savant",
  storageBucket: "nhl-savant.firebasestorage.app",
  messagingSenderId: "622389724620",
  appId: "1:622389724620:web:4a2a1f7e8f0b0e0e0e0e0e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function getETGameDate() {
  const now = new Date();
  const etDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const year = etDate.getFullYear();
  const month = String(etDate.getMonth() + 1).padStart(2, '0');
  const day = String(etDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function checkBets() {
  console.log('\n🏀 CHECKING FIREBASE BASKETBALL BETS');
  console.log('='.repeat(60));
  
  try {
    const gameDate = getETGameDate();
    console.log(`\n📅 Date: ${gameDate}\n`);
    
    const betsRef = collection(db, 'basketball_bets');
    const todayQuery = query(betsRef, where('date', '==', gameDate));
    const snapshot = await getDocs(todayQuery);
    
    console.log(`✅ Total bets: ${snapshot.size}\n`);
    
    const pending = [];
    const completed = [];
    
    snapshot.forEach((doc) => {
      const bet = doc.data();
      if (bet.status === 'PENDING') {
        pending.push({ id: doc.id, ...bet });
      } else {
        completed.push({ id: doc.id, ...bet });
      }
    });
    
    console.log(`🔒 PENDING: ${pending.length} | ✅ COMPLETED: ${completed.length}\n`);
    
    if (pending.length > 0) {
      console.log('PENDING BETS (should display as locked):');
      console.log('='.repeat(60));
      pending.forEach((bet, i) => {
        console.log(`\n${i + 1}. ${bet.game.awayTeam} @ ${bet.game.homeTeam}`);
        console.log(`   Pick: ${bet.bet.team} ${bet.bet.odds}`);
        console.log(`   Grade: ${bet.prediction?.grade || 'N/A'} | Units: ${bet.prediction?.unitSize || bet.bet?.units || 'N/A'}`);
        console.log(`   Time: ${bet.game.gameTime || 'N/A'}`);
      });
    }
    
    if (completed.length > 0) {
      console.log('\n\nCOMPLETED BETS:');
      console.log('='.repeat(60));
      completed.forEach((bet, i) => {
        console.log(`\n${i + 1}. ${bet.game.awayTeam} @ ${bet.game.homeTeam}`);
        console.log(`   Result: ${bet.result?.outcome || 'N/A'}`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkBets();

