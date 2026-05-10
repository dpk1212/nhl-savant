// Scan ALL of today's pick docs for the same "false demotion" pattern:
// lockStage=SHADOW or health.status=MUTED, but with proven wallets
// currently active on the for-side that the cron didn't see (because
// of the now-deprecated 90s freshness window).

import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync } from 'fs';

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(readFileSync('serviceAccountKey.json','utf8'))),
});
const db = admin.firestore();

const TARGET_DATE = '2026-05-10';

async function loadProvenSets() {
  const snap = await db.collection('sharpWalletProfiles').get();
  const sets = { MLB: new Map(), NBA: new Map(), NHL: new Map() };
  snap.forEach(d => {
    const data = d.data();
    for (const sport of ['MLB', 'NBA', 'NHL']) {
      const isConfirmed = Array.isArray(data.confirmedSports) && data.confirmedSports.includes(sport);
      const isFlat      = Array.isArray(data.flatSports)      && data.flatSports.includes(sport);
      if (isConfirmed || isFlat) {
        sets[sport].set(data.walletShort || d.id, { tier: isConfirmed ? 'CONFIRMED' : 'FLAT' });
      }
    }
  });
  return sets;
}

const provenSets = await loadProvenSets();
console.log(`Proven set sizes: MLB=${provenSets.MLB.size} NBA=${provenSets.NBA.size} NHL=${provenSets.NHL.size}\n`);

// Load all today's positions
const allPosSnap = await db.collection('sharp_action_positions').where('date','==',TARGET_DATE).get();
const positionsByGameMarket = new Map(); // `${gameKey}:${market}` → positions[]
allPosSnap.forEach(d => {
  const data = d.data();
  const k = `${data.gameKey}:${(data.marketType||'').toUpperCase()}`;
  if (!positionsByGameMarket.has(k)) positionsByGameMarket.set(k, []);
  positionsByGameMarket.get(k).push(data);
});

const collections = ['sharpFlowPicks', 'sharpFlowSpreads', 'sharpFlowTotals'];
const findings = [];

for (const col of collections) {
  const snap = await db.collection(col).where('date','==',TARGET_DATE).get();
  for (const docSnap of snap.docs) {
    const d = docSnap.data();
    const sport = (d.sport || '').toUpperCase();
    if (!provenSets[sport]) continue;

    const market = col === 'sharpFlowPicks' ? 'ML' : col === 'sharpFlowSpreads' ? 'SPREAD' : 'TOTAL';
    // gameKey in pick doc — try matchupKey, fallback to away_home
    const matchupKey = d.matchupKey || `${(d.away||'').toLowerCase()}_${(d.home||'').toLowerCase()}`;

    for (const [sideKey, sd] of Object.entries(d.sides || {})) {
      const lockStage = sd.lockStage;
      const status = sd.health?.status;
      const isDemoted = lockStage === 'SHADOW' || status === 'MUTED' || status === 'CANCELLED';
      if (!isDemoted) continue;
      // skip already-cancelled (no need to recover) unless we want to
      if (status === 'CANCELLED' && (sd.health?.reasons || []).includes('superseded')) continue;
      // Get live positions for this game-market
      const positions = positionsByGameMarket.get(`${matchupKey}:${market}`) || [];
      const oppSide = sideKey === 'home' ? 'away' : sideKey === 'over' ? 'under' : sideKey === 'under' ? 'over' : 'home';
      const forPositions = positions.filter(p => (p.side||'').toLowerCase() === sideKey);
      const agPositions  = positions.filter(p => (p.side||'').toLowerCase() === oppSide);
      const provenFor = forPositions.filter(p => provenSets[sport].has(p.walletShort));
      const provenAg  = agPositions.filter(p => provenSets[sport].has(p.walletShort));
      const dwLive = provenFor.length - provenAg.length;
      const dwStamped = sd.v8_walletConsensusDelta;

      // False demotion candidate: live Δw is healthier than stamped Δw
      // and meets some lock floor (Δw ≥ 1, or stamped is dramatically worse)
      const stampedSum = (sd.v8_walletConsensusForW || 0) + (sd.v8_walletConsensusAgW || 0);
      const liveSum = provenFor.length + provenAg.length;
      const wouldQualify = dwLive >= 2 || (dwLive >= 1 && provenFor.length >= 1);

      if (wouldQualify && (dwLive > dwStamped || liveSum > stampedSum + 1)) {
        findings.push({
          col, docId: docSnap.id, sideKey, sport, label: `${sport}/${market}/${sideKey} ${matchupKey}`,
          lockStage, status, reasons: sd.health?.reasons || [],
          dwStamped, dwLive,
          forStamped: sd.v8_walletConsensusForW, forLive: provenFor.length,
          agStamped: sd.v8_walletConsensusAgW, agLive: provenAg.length,
          provenForWallets: provenFor.map(p => `${p.walletShort}($${Math.round(p.size||0).toLocaleString()})`),
          provenAgWallets: provenAg.map(p => `${p.walletShort}($${Math.round(p.size||0).toLocaleString()})`),
        });
      }
    }
  }
}

if (findings.length === 0) {
  console.log('✅ No additional false-demotion candidates found.');
} else {
  console.log(`Found ${findings.length} additional false-demotion candidate(s):\n`);
  for (const f of findings) {
    console.log(`  ${f.label.padEnd(40)} | stamped Δw=${f.dwStamped} → live Δw=${f.dwLive} | ${f.lockStage}/${f.status} (${f.reasons.join(',')})`);
    console.log(`    For:     [${f.provenForWallets.join(', ')}]`);
    console.log(`    Against: [${f.provenAgWallets.join(', ')}]`);
    console.log(`    Doc:     ${f.col}/${f.docId}`);
    console.log();
  }
}

process.exit(0);
