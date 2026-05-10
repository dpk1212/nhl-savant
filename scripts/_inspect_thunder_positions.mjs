import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync } from 'fs';

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync('serviceAccountKey.json', 'utf8'))) });
}
const db = admin.firestore();

const snap = await db.collection('sharp_action_positions')
  .where('sport', '==', 'NBA')
  .where('gameKey', '==', 'okc_lal')
  .where('marketType', '==', 'SPREAD')
  .get();

console.log(`Found ${snap.size} positions for okc_lal SPREAD\n`);
const bySide = { home: { count: 0, dollars: 0, wallets: [] }, away: { count: 0, dollars: 0, wallets: [] } };
snap.forEach(d => {
  const p = d.data();
  const s = p.side === 'home' ? 'home' : p.side === 'away' ? 'away' : null;
  if (!s) return;
  bySide[s].count++;
  bySide[s].dollars += (p.dollarsBet || p.invested || p.size || 0);
  bySide[s].wallets.push({
    wallet: p.walletAddr || p.wallet,
    dollars: p.dollarsBet || p.invested || p.size || 0,
    sizeRatio: p.sizeRatio,
    walletBase: p.walletBase,
  });
});
console.log(JSON.stringify(bySide, null, 2));
process.exit(0);
