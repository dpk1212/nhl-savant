const admin = require('firebase-admin');
const sa = require('./serviceAccountKey.json');

admin.initializeApp({ credential: admin.credential.cert(sa) });
const db = admin.firestore();

async function main() {
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
  const SPREAD_TOTAL_MIN = 5000;
  const ML_MIN = 7000;
  let deleted = 0;

  for (const col of ['sharpFlowSpreads', 'sharpFlowTotals']) {
    const snap = await db.collection(col).where('date', '==', today).get();
    for (const docRef of snap.docs) {
      const data = docRef.data();
      const sides = data.sides || {};
      for (const [sideKey, sd] of Object.entries(sides)) {
        const invested = sd.lock?.totalInvested || sd.peak?.totalInvested || 0;
        if (invested < SPREAD_TOTAL_MIN) {
          console.log(`DELETING ${docRef.id} (side=${sideKey}, invested=$${invested}, threshold=$${SPREAD_TOTAL_MIN})`);
          await docRef.ref.delete();
          deleted++;
          break;
        } else {
          console.log(`  OK ${docRef.id} (side=${sideKey}, invested=$${invested})`);
        }
      }
    }
  }

  // Also check ML picks
  const mlSnap = await db.collection('sharpFlowPicks').where('date', '==', today).get();
  for (const docRef of mlSnap.docs) {
    const data = docRef.data();
    const sides = data.sides || {};
    for (const [sideKey, sd] of Object.entries(sides)) {
      const invested = sd.lock?.totalInvested || sd.peak?.totalInvested || 0;
      if (invested < ML_MIN) {
        console.log(`DELETING ML ${docRef.id} (side=${sideKey}, invested=$${invested}, threshold=$${ML_MIN})`);
        await docRef.ref.delete();
        deleted++;
        break;
      } else {
        console.log(`  OK ML ${docRef.id} (side=${sideKey}, invested=$${invested})`);
      }
    }
  }

  console.log(`\nDone. Deleted ${deleted} docs below threshold.`);
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
