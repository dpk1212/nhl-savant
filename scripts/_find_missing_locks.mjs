import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sakPath = join(__dirname, '..', 'serviceAccountKey.json');
if (existsSync(sakPath)) {
  initializeApp({ credential: cert(JSON.parse(readFileSync(sakPath, 'utf8'))) });
} else {
  initializeApp({
    credential: cert({
      project_id: process.env.VITE_FIREBASE_PROJECT_ID,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();
db.settings({ ignoreUndefinedProperties: true });

const TARGET_DATE = '2026-05-02';
const HC_RATIO = 1.5;

// Load wallet profiles for whitelist tier lookup.
const profilesSnap = await db.collection('sharpWalletProfiles').get();
const walletProfiles = new Map();
profilesSnap.forEach(d => walletProfiles.set(d.id.toLowerCase(), d.data()));

// Load all today's positions.
const posSnap = await db.collection('sharp_action_positions').where('date', '==', TARGET_DATE).get();
const positions = [];
posSnap.forEach(d => positions.push({ _id: d.id, ...d.data() }));
console.log(`Loaded ${positions.length} positions, ${walletProfiles.size} wallet profiles\n`);

// Group by sport|gameKey|marketType.
const groups = new Map();
for (const p of positions) {
  const k = `${p.sport}|${p.gameKey}|${p.marketType}`;
  if (!groups.has(k)) groups.set(k, []);
  groups.get(k).push(p);
}

// Compute consensus for each (group, side) and find ones that pass v7.4.
function computeConsensus(group, mySide, sport) {
  let forW = 0, agW = 0, qFor = 0, qAg = 0, hcF = 0, hcA = 0;
  for (const p of group) {
    const short = String(p.walletShort || p.wallet || '').slice(-6).toLowerCase();
    const profile = walletProfiles.get(short);
    const tier = profile?.bySport?.[sport]?.whitelistTier || null;
    const sr = p.v8_sizeRatio != null
      ? p.v8_sizeRatio
      : (p.avgSportBet > 0 ? (p.invested || 0) / p.avgSportBet : 0);
    const c = p.v8_walletContribution ?? 0;
    if (c >= 30) {
      if (p.side === mySide) qFor++;
      else if (p.side) qAg++;
    }
    if (tier === 'CONFIRMED' || tier === 'FLAT') {
      if (p.side === mySide) forW++;
      else if (p.side) agW++;
    }
    if (tier === 'CONFIRMED' && sr >= HC_RATIO) {
      if (p.side === mySide) hcF++;
      else if (p.side) hcA++;
    }
  }
  return { forW, agW, qFor, qAg, hcF, hcA, dw: forW - agW, dq: qFor - qAg, hcMargin: hcF - hcA };
}

function meetsV74(dw, dq, hc) {
  const sum = dw + dq;
  return (hc >= 1) || (dw >= 1 && dq >= 1 && sum >= 5);
}

// Find every (game, market, side) where v7.4 floor passes.
const passes = [];
for (const [groupKey, group] of groups) {
  const [sport, gameKey, marketType] = groupKey.split('|');
  const sides = new Set();
  for (const p of group) if (p.side) sides.add(p.side);
  for (const side of sides) {
    const c = computeConsensus(group, side, sport);
    if (meetsV74(c.dw, c.dq, c.hcMargin)) {
      passes.push({ sport, gameKey, marketType, side, ...c });
    }
  }
}

console.log(`Found ${passes.length} (game, market, side) tuples currently passing v7.4 floor:\n`);
for (const p of passes) {
  const route = p.hcMargin >= 1 ? `HC_ROUTE(HC=${p.hcMargin})` : `SUM_ROUTE(Σ=${p.dw + p.dq})`;
  console.log(`  ${p.sport.padEnd(4)} ${p.marketType.padEnd(8)} ${p.gameKey.padEnd(20)} ${p.side.padEnd(8)} dw=${p.dw} dq=${p.dq} HC=${p.hcMargin} (HC ${p.hcF}/${p.hcA}) → ${route}`);
}

// Now check which of these have a corresponding LOCKED doc in Firestore.
console.log(`\n========== MISSING LOCK DOCS ==========\n`);
const collectionByMkt = { ML: 'sharpFlowPicks', SPREAD: 'sharpFlowSpreads', TOTAL: 'sharpFlowTotals' };
let missing = 0;
for (const p of passes) {
  const col = collectionByMkt[p.marketType];
  if (!col) { console.log(`  ⚠️ Unknown market type: ${p.marketType}`); continue; }
  const docId = p.marketType === 'ML' ? `${TARGET_DATE}_${p.sport}_${p.gameKey}` :
                p.marketType === 'SPREAD' ? `${TARGET_DATE}_${p.sport}_${p.gameKey}_spread` :
                `${TARGET_DATE}_${p.sport}_${p.gameKey}_total`;
  const snap = await db.collection(col).doc(docId).get();
  const exists = snap.exists;
  const sd = exists ? snap.data().sides?.[p.side] : null;
  const stage = sd?.lockStage || '∅';
  const status = sd?.health?.status || '∅';
  const ok = exists && (stage === 'LOCKED' || stage === 'LEAN');
  if (!ok) {
    missing++;
    console.log(`  MISSING  ${p.sport.padEnd(4)} ${col.replace('sharpFlow', '').padEnd(8)} ${docId} side=${p.side} doc.exists=${exists} stage=${stage} status=${status}`);
  }
}
console.log(`\n${missing} v7.4-qualifying sides have no LOCKED doc.`);

process.exit(0);
