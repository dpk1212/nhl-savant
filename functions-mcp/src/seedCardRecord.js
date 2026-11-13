/**
 * One-shot base for the connector's graded record.
 * Reads staked locks from 2026-06-01 through 2026-11-09.
 * The live function adds only the days after `through`.
 */
const admin = require('firebase-admin');
const sa = require('/Users/dalekolnitys/NHL Savant/nhl-savant/serviceAccountKey.json');
const { gradedStake, emptyRecord, accumulate } = require('./sharpflowPublic');

const THROUGH = '2026-11-09';
const COLLECTIONS = [
  ['sharpFlowPicks', 'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals', 'TOTAL'],
];

if (!admin.apps.length) admin.initializeApp({ credential: admin.credential.cert(sa) });
const db = admin.firestore();

(async () => {
  const t = Date.now();
  const record = emptyRecord();
  for (const [col, market] of COLLECTIONS) {
    const snap = await db.collection(col)
      .where('date', '>=', '2026-06-01')
      .where('date', '<=', THROUGH)
      .select('sport', 'date', 'sides')
      .get();
    for (const doc of snap.docs) {
      const pick = doc.data() || {};
      for (const sideKey of Object.keys(pick.sides || {})) {
        accumulate(record, gradedStake(pick, sideKey, market));
      }
    }
    console.log(col, snap.size);
  }
  await db.collection('sharpflowMcpCache').doc('cardRecord').set({
    through: THROUGH,
    at: Date.now(),
    buckets: record,
  });
  console.log('wrote', record.all, 'ms', Date.now() - t);
  process.exit(0);
})().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
