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

// Load wallet profiles
const profiles = new Map();
const ps = await db.collection('sharpWalletProfiles').get();
ps.forEach(d => profiles.set(d.id.toLowerCase(), d.data()));

// Load today's positions
const posSnap = await db.collection('sharp_action_positions').where('date', '==', TARGET_DATE).get();
const positions = [];
posSnap.forEach(d => positions.push(d.data()));

// Group by sport|gameKey|marketType|side
const groups = new Map();
for (const p of positions) {
  const k = `${p.sport}|${p.gameKey}|${p.marketType}`;
  if (!groups.has(k)) groups.set(k, []);
  groups.get(k).push(p);
}

console.log(`Loaded ${profiles.size} profiles, ${positions.length} positions, ${groups.size} game-market clusters\n`);

// Compute consensus per side and find HC+1 candidates
const candidates = [];
for (const [k, group] of groups) {
  const [sport, gameKey, marketType] = k.split('|');
  const sides = new Map();
  for (const p of group) {
    const s = p.side;
    if (!s) continue;
    if (!sides.has(s)) sides.set(s, { forCount: 0, againstCount: 0 });
  }
  for (const side of sides.keys()) {
    let hcF = 0, hcA = 0, forW = 0, agW = 0, qFor = 0, qAg = 0;
    for (const p of group) {
      const short = String(p.walletShort || p.wallet || '').slice(-6).toLowerCase();
      const profile = profiles.get(short) || profiles.get(short.toUpperCase());
      const tier = profile?.bySport?.[sport]?.whitelistTier || null;
      const sr = p.v8_sizeRatio != null ? p.v8_sizeRatio : (p.avgSportBet > 0 ? (p.invested || 0) / p.avgSportBet : 0);
      const c = p.v8_walletContribution ?? 0;
      if (c >= 30) {
        if (p.side === side) qFor++;
        else if (p.side) qAg++;
      }
      if (tier === 'CONFIRMED' || tier === 'FLAT') {
        if (p.side === side) forW++;
        else if (p.side) agW++;
      }
      if (tier === 'CONFIRMED' && sr >= HC_RATIO) {
        if (p.side === side) hcF++;
        else if (p.side) hcA++;
      }
    }
    const dw = forW - agW;
    const dq = qFor - qAg;
    const hc = hcF - hcA;
    const sum = dw + dq;
    const hcRoute = hc >= 1 && dw >= 0 && dq >= 0;
    const sumRoute = dw >= 1 && dq >= 1 && sum >= 5;
    if (hcRoute || sumRoute) {
      candidates.push({ sport, gameKey, marketType, side, dw, dq, hc, hcF, hcA, sum, hcRoute, sumRoute });
    }
  }
}

console.log(`========== V7.4-QUALIFYING SIDES IN sharp_action_positions ==========\n`);
if (candidates.length === 0) console.log('  (none)');
for (const c of candidates) {
  const route = c.hcRoute ? `HC_ROUTE(HC=${c.hc} dw=${c.dw} dq=${c.dq})` : `SUM_ROUTE(Σ=${c.sum})`;
  console.log(`  ${c.sport.padEnd(4)} ${c.marketType.padEnd(7)} ${c.gameKey} :: ${c.side.padEnd(28)}  ${route}`);
}

console.log(`\n========== CHECK: are these in sharpFlow* docs? ==========\n`);
for (const c of candidates) {
  const colName = c.marketType === 'ML' ? 'sharpFlowPicks'
                : c.marketType === 'SPREAD' ? 'sharpFlowSpreads'
                : c.marketType === 'TOTAL' ? 'sharpFlowTotals'
                : null;
  if (!colName) continue;
  const docId = c.marketType === 'ML' ? `${TARGET_DATE}_${c.sport}_${c.gameKey}` : `${TARGET_DATE}_${c.sport}_${c.gameKey}_${c.marketType.toLowerCase()}`;
  const docSnap = await db.collection(colName).doc(docId).get();
  if (!docSnap.exists) {
    console.log(`  ✗ MISSING DOC: ${colName}/${docId}  (side=${c.side})`);
    continue;
  }
  const sd = docSnap.data().sides?.[c.side];
  if (!sd) {
    console.log(`  ✗ MISSING SIDE: ${colName}/${docId}/${c.side}`);
    continue;
  }
  console.log(`  → ${colName}/${docId}/${c.side}: lockStage=${sd.lockStage} status=${sd.health?.status} hasLock=${!!sd.lock} hasPeak=${!!sd.peak}`);
}
process.exit(0);
