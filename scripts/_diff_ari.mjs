import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sak = join(__dirname, '..', 'serviceAccountKey.json');
admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(sak, 'utf8'))) });
const db = admin.firestore();
const TODAY = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
const HC_RATIO = 1.5;
const QUALITY_CONTRIB_CUT = 30;

console.log(`\n=== ARI/CHC ML — three sources, side by side (${TODAY}) ===\n`);

console.log('1) sharpFlowPicks doc (last cron write):');
const fbDoc = await db.collection('sharpFlowPicks').doc(`${TODAY}_MLB_ari_chc`).get();
if (fbDoc.exists) {
  const sd = fbDoc.data().sides?.away;
  console.log(`   lockStage = ${sd.lockStage}`);
  console.log(`   v8_lockTier = ${sd.v8_lockTier}`);
  console.log(`   dw = ${sd.v8_walletConsensusDelta}, dq = ${sd.v8_walletConsensusQualityMargin}, HC = ${sd.v8_hcMargin}`);
  console.log(`   health = ${JSON.stringify(sd.health)}`);
  console.log(`   lastSyncAt = ${fbDoc.data().lastSyncAt ? new Date(fbDoc.data().lastSyncAt).toISOString() : 'n/a'}`);
}

console.log('\n2) sharp_action_positions for ari_chc/ML (Firestore — what cron reads):');
const posSnap = await db.collection('sharp_action_positions')
  .where('date', '==', TODAY)
  .where('sport', '==', 'MLB')
  .where('gameKey', '==', 'ari_chc')
  .where('marketType', '==', 'ML')
  .get();

const profilesSnap = await db.collection('sharpWalletProfiles').get();
const profiles = new Map();
profilesSnap.forEach(d => profiles.set(d.id.toLowerCase(), d.data()));

let forW = 0, agW = 0, qFor = 0, qAg = 0, hcF = 0, hcA = 0;
const posList = [];
posSnap.forEach(d => {
  const p = d.data();
  const short = String(p.walletShort || p.wallet || '').slice(-6).toLowerCase();
  const profile = profiles.get(short);
  const tier = profile?.bySport?.['MLB']?.whitelistTier || null;
  const sr = p.v8_sizeRatio != null ? p.v8_sizeRatio : (p.avgSportBet > 0 ? (p.invested || 0) / p.avgSportBet : 0);
  const c = p.v8_walletContribution ?? 0;
  posList.push({ wallet: short, side: p.side, invested: p.invested, tier, sizeRatio: sr, contrib: c });
  if (c >= QUALITY_CONTRIB_CUT) {
    if (p.side === 'away') qFor++;
    else if (p.side) qAg++;
  }
  if (tier === 'CONFIRMED' || tier === 'FLAT') {
    if (p.side === 'away') forW++;
    else if (p.side) agW++;
  }
  if (tier === 'CONFIRMED' && sr >= HC_RATIO) {
    if (p.side === 'away') hcF++;
    else if (p.side) hcA++;
  }
});
console.log(`   ${posList.length} positions:`);
posList.forEach(p => console.log(`     ${p.wallet} ${p.side.padEnd(5)} $${p.invested?.toLocaleString().padStart(8)} tier=${(p.tier || 'none').padEnd(10)} sr=${p.sizeRatio?.toFixed(2)} contrib=${p.contrib?.toFixed(1)}`));
console.log(`   COMPUTED: forW=${forW} agW=${agW} dw=${forW - agW} | qFor=${qFor} qAg=${qAg} dq=${qFor - qAg} | hcF=${hcF} hcA=${hcA} HCm=${hcF - hcA}`);

console.log('\n3) public/sharp_positions.json (what browser reads):');
const sp = JSON.parse(readFileSync(join(__dirname, '..', 'public', 'sharp_positions.json'), 'utf8'));
const game = sp?.MLB?.ari_chc;
if (game) {
  console.log(`   summary.consensus = ${game.summary?.consensus}`);
  console.log(`   ${game.positions?.length || 0} positions:`);
  game.positions?.forEach(p => {
    const short = String(p.walletShort || p.wallet || '').slice(-6).toLowerCase();
    const profile = profiles.get(short);
    const tier = profile?.bySport?.['MLB']?.whitelistTier || null;
    console.log(`     ${short} ${p.side?.padEnd(5)} $${p.invested?.toLocaleString().padStart(8)} tier=${(tier || 'none')} contrib=${p.v8_walletContribution?.toFixed(1)}`);
  });
} else {
  console.log('   NOT FOUND');
}

process.exit(0);
