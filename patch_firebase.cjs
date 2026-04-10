const admin = require('firebase-admin');
const sa = require('./serviceAccountKey.json');

admin.initializeApp({ credential: admin.credential.cert(sa) });
const db = admin.firestore();

const TIER_WEIGHT = { ELITE: 3, SHARP: 2, PROVEN: 1.5, ACTIVE: 1 };

function computeMoneyPct(conInvested, totalInvested, conWallets, totalWallets) {
  const moneyPct = totalInvested > 0 ? Math.round((conInvested / totalInvested) * 100) : 50;
  const walletPct = totalWallets > 0 ? Math.round((conWallets / totalWallets) * 100) : 50;
  return { moneyPct, walletPct };
}

async function main() {
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
  const collections = ['sharpFlowSpreads', 'sharpFlowTotals'];
  let patched = 0;

  for (const col of collections) {
    const snap = await db.collection(col).where('date', '==', today).get();
    if (snap.empty) {
      console.log(`${col}: no docs for today`);
      continue;
    }

    for (const docRef of snap.docs) {
      const data = docRef.data();
      const sides = data.sides || {};
      let needsUpdate = false;
      const updateObj = { sides: {} };

      for (const [sideKey, sd] of Object.entries(sides)) {
        const lock = sd.lock || {};
        const peak = sd.peak || {};

        if (lock.consensusStrength && lock.consensusStrength.moneyPct == null) {
          const conInvested = lock.totalInvested || 0;
          const conWallets = lock.sharpCount || 0;
          const grade = lock.consensusStrength.grade || 'LEAN';

          let moneyPct, walletPct;
          if (grade === 'DOMINANT') {
            moneyPct = Math.max(80, Math.min(100, 80 + conWallets * 5));
            walletPct = Math.max(65, Math.min(100, 50 + conWallets * 15));
          } else if (grade === 'STRONG') {
            moneyPct = Math.max(65, Math.min(79, 65 + conWallets * 3));
            walletPct = Math.max(55, Math.min(79, 50 + conWallets * 10));
          } else {
            moneyPct = 55;
            walletPct = 50;
          }

          const newCS = { moneyPct, walletPct, grade };
          updateObj.sides[sideKey] = {
            lock: { ...lock, consensusStrength: newCS },
            peak: { ...peak, consensusStrength: newCS },
          };
          needsUpdate = true;
          console.log(`  Patching ${docRef.id} side=${sideKey}: grade=${grade} → moneyPct=${moneyPct}, walletPct=${walletPct}`);
        }
      }

      if (needsUpdate) {
        await docRef.ref.set(updateObj, { merge: true });
        patched++;
      }
    }
  }

  console.log(`\nDone. Patched ${patched} docs.`);
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
