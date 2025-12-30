import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load service account
const serviceAccountPath = join(__dirname, '../nhl-savant-firebase-adminsdk.json');
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

function getETGameDate() {
  const now = new Date();
  const etDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const year = etDate.getFullYear();
  const month = String(etDate.getMonth() + 1).padStart(2, '0');
  const day = String(etDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function checkTodaysBets() {
  console.log('\n🏀 CHECKING TODAY\'S BASKETBALL BETS IN FIREBASE');
  console.log('='.repeat(50));
  
  try {
    const gameDate = getETGameDate();
    console.log(`\n📅 Game Date (ET): ${gameDate}\n`);
    
    // Query for today's bets
    const betsSnapshot = await db.collection('basketball_bets')
      .where('date', '==', gameDate)
      .get();
    
    console.log(`✅ Found ${betsSnapshot.size} total bets for ${gameDate}\n`);
    
    if (betsSnapshot.empty) {
      console.log('⚠️  No bets found in Firebase for today!');
      return;
    }
    
    // Group by status
    const pending = [];
    const completed = [];
    
    betsSnapshot.forEach((doc) => {
      const bet = doc.data();
      if (bet.status === 'PENDING') {
        pending.push({ id: doc.id, ...bet });
      } else {
        completed.push({ id: doc.id, ...bet });
      }
    });
    
    console.log(`📊 PENDING: ${pending.length} | COMPLETED: ${completed.length}\n`);
    
    if (pending.length > 0) {
      console.log('🔒 PENDING BETS (Should show as locked picks):');
      console.log('='.repeat(50));
      pending.forEach((bet, i) => {
        console.log(`\n${i + 1}. ${bet.game.awayTeam} @ ${bet.game.homeTeam}`);
        console.log(`   Pick: ${bet.bet.team} ${bet.bet.odds}`);
        console.log(`   Grade: ${bet.prediction?.grade || 'N/A'} | Units: ${bet.prediction?.unitSize || 'N/A'}`);
        console.log(`   EV: ${bet.prediction?.evPercent?.toFixed(1) || bet.initialEV?.toFixed(1) || 'N/A'}%`);
        console.log(`   Time: ${bet.game.gameTime || 'N/A'}`);
      });
    }
    
    if (completed.length > 0) {
      console.log('\n\n✅ COMPLETED BETS:');
      console.log('='.repeat(50));
      completed.forEach((bet, i) => {
        const outcome = bet.result?.outcome || 'N/A';
        const profit = bet.result?.profit?.toFixed(2) || 'N/A';
        console.log(`\n${i + 1}. ${bet.game.awayTeam} @ ${bet.game.homeTeam}`);
        console.log(`   Pick: ${bet.bet.team} ${bet.bet.odds}`);
        console.log(`   Result: ${outcome} | Profit: ${profit}u`);
      });
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ Check complete!\n');
    
  } catch (error) {
    console.error('❌ Error checking bets:', error);
  }
  
  process.exit(0);
}

checkTodaysBets();

