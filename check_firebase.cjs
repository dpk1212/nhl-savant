const admin = require('firebase-admin');
const sa = require('./serviceAccountKey.json');

admin.initializeApp({ credential: admin.credential.cert(sa) });
const db = admin.firestore();

async function main() {
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
  console.log('Today:', today);

  const collections = ['sharpFlowPicks', 'sharpFlowSpreads', 'sharpFlowTotals'];
  
  for (const col of collections) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Collection: ${col}`);
    console.log('='.repeat(60));
    
    const snap = await db.collection(col).where('date', '==', today).get();
    if (snap.empty) {
      console.log('  (no docs for today)');
      continue;
    }
    
    snap.forEach(doc => {
      const data = doc.data();
      console.log(`\n  Doc: ${doc.id}`);
      console.log(`  Sport: ${data.sport} | Market: ${data.marketType}`);
      console.log(`  Away: ${data.away} | Home: ${data.home}`);
      
      if (data.sides) {
        for (const [sideKey, sd] of Object.entries(data.sides)) {
          console.log(`\n    Side: ${sideKey} | Team: ${sd.team}`);
          
          const lock = sd.lock || {};
          const peak = sd.peak || {};
          
          console.log(`    Lock data:`);
          console.log(`      consensusStrength: ${JSON.stringify(lock.consensusStrength)}`);
          console.log(`      sharpCount: ${lock.sharpCount}`);
          console.log(`      totalInvested: ${lock.totalInvested}`);
          console.log(`      odds: ${lock.odds} | stars: ${lock.stars} | units: ${lock.units}`);
          console.log(`      evEdge: ${lock.evEdge}`);
          console.log(`      criteria: ${JSON.stringify(lock.criteria)}`);
          
          console.log(`    Peak data:`);
          console.log(`      consensusStrength: ${JSON.stringify(peak.consensusStrength)}`);
          console.log(`      sharpCount: ${peak.sharpCount}`);
          console.log(`      totalInvested: ${peak.totalInvested}`);
          console.log(`      odds: ${peak.odds} | stars: ${peak.stars} | units: ${peak.units}`);
        }
      }
    });
  }
  
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
