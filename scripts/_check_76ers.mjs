import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sak = join(__dirname, '..', 'serviceAccountKey.json');
admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(sak, 'utf8'))) });
const db = admin.firestore();

const docId = '2026-05-02_NBA_phi_bos';
console.log(`\n=== ${docId} (76ers ML) ===\n`);

const docSnap = await db.collection('sharpFlowPicks').doc(docId).get();
if (!docSnap.exists) { console.log('NOT FOUND'); process.exit(0); }
const doc = docSnap.data();

const sd = doc.sides?.away;
console.log('Away side (76ers):');
console.log(`  lockStage     = ${sd.lockStage}`);
console.log(`  v8_lockTier   = ${sd.v8_lockTier}`);
console.log(`  health.status = ${sd.health?.status}  (reasons: ${JSON.stringify(sd.health?.reasons)})`);
console.log(`  promotedBy    = ${sd.promotedBy}`);
console.log('');
console.log('Live consensus (from cron):');
console.log(`  dw = ${sd.v8_walletConsensusDelta}`);
console.log(`  dq = ${sd.v8_walletConsensusQualityMargin}`);
console.log(`  Σ  = ${(sd.v8_walletConsensusDelta || 0) + (sd.v8_walletConsensusQualityMargin || 0)}`);
console.log(`  HC = ${sd.v8_hcMargin}  (hcDominant=${sd.v8_hcDominant}, hcConfFor=${sd.v8_hcConfFor}, hcConfAg=${sd.v8_hcConfAg})`);
console.log(`  forW = ${sd.v8_walletConsensusForW}, agW = ${sd.v8_walletConsensusAgW}`);
console.log(`  qFor = ${sd.v8_walletConsensusQualityForT30}, qAg = ${sd.v8_walletConsensusQualityAgT30}`);
console.log('');
console.log('Lock snapshot (locked at):');
console.log(`  units  = ${sd.lock?.units}`);
console.log(`  stars  = ${sd.lock?.stars}`);
console.log(`  odds   = ${sd.lock?.odds} @ ${sd.lock?.book}`);
console.log('');
console.log('Peak snapshot (highest point):');
console.log(`  units  = ${sd.peak?.units}`);
console.log(`  stars  = ${sd.peak?.stars}`);
console.log(`  odds   = ${sd.peak?.odds} @ ${sd.peak?.book}`);
console.log('');

// Compute what unit math SHOULD say right now
const dw = sd.v8_walletConsensusDelta || 0;
const dq = sd.v8_walletConsensusQualityMargin || 0;
const hc = sd.v8_hcMargin || 0;
const sum = dw + dq;
const odds = sd.peak?.odds ?? sd.lock?.odds;

let liveStars;
if (dw >= 1 && dq >= 1) {
  if (sum >= 6) liveStars = 5.0;
  else if (sum === 5) liveStars = 4.5;
  else if (sum === 4) liveStars = 4.0;
  else if (sum === 3) liveStars = 3.5;
  else liveStars = 2.5;
} else liveStars = 2.5;

let liveTier;
if (sum >= 7 && dw >= 1 && dq >= 1) liveTier = 'ELITE';
else if ((hc >= 1 && dw >= 0 && dq >= 0) || (dw >= 1 && dq >= 1 && sum >= 5)) liveTier = 'LOCKED';
else liveTier = 'MUTED';

let units;
if (liveTier === 'ELITE') units = 4.00;
else if (liveStars >= 5.0) units = 3.00;
else if (liveStars >= 4.5) units = 2.00;
else if (liveStars >= 4.0) units = 1.25;
else if (liveStars >= 3.5) units = 0.75;
else units = 0;

console.log('=== LIVE UNIT MATH (from current Firestore state) ===');
console.log(`  Step 1: vaultStar(dw=${dw}, dq=${dq}) = ${liveStars}★`);
console.log(`  Step 2: lockTier = ${liveTier} (need Σ≥7 for ELITE; Σ=${sum})`);
console.log(`  Step 3: base units from ladder = ${units}u`);

let capped = units;
if (odds != null && odds >= 200) capped = Math.min(units, liveTier === 'ELITE' ? 1.0 : 0.5);
else if (odds != null && odds >= 151) capped = Math.min(units, liveTier === 'ELITE' ? 2.0 : 1.0);
else if (odds != null && odds >= 100) capped = Math.min(units, liveTier === 'ELITE' ? 3.0 : 2.0);
console.log(`  Step 4: odds ${odds > 0 ? '+' : ''}${odds} cap → ${capped}u`);

let final = capped;
if (hc >= 2) {
  final = Math.min(capped * 1.75, liveTier === 'ELITE' ? 4.5 : 3.5);
  console.log(`  Step 5: HC×1.75 multiplier (HC_m=${hc}) → ${final}u`);
} else if (hc >= 1) {
  final = Math.min(capped * 1.5, liveTier === 'ELITE' ? 4.5 : 3.5);
  console.log(`  Step 5: HC×1.5 multiplier (HC_m=${hc}) → ${final}u`);
} else {
  console.log(`  Step 5: HC_m=0, no multiplier → ${final}u`);
}
console.log(`\n  → MATH SAYS: ${Math.round(final * 100) / 100}u @ ${odds > 0 ? '+' : ''}${odds}`);

process.exit(0);
