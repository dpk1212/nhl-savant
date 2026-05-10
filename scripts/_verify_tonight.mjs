// Quick verification — print every LOCKED+ACTIVE side for today's date.
// Mirrors what the dashboard's locked-picks list will display.
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = join(__dirname, '..');
if (!admin.apps.length) {
  const sak = join(REPO, 'serviceAccountKey.json');
  if (existsSync(sak)) admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(sak, 'utf8'))) });
}
const db = admin.firestore();
const TODAY = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });

const rows = [];
for (const [col, mkt] of [['sharpFlowPicks', 'ML'], ['sharpFlowSpreads', 'SPR'], ['sharpFlowTotals', 'TOT']]) {
  const snap = await db.collection(col).where('date', '==', TODAY).get();
  for (const doc of snap.docs) {
    const d = doc.data();
    for (const [sk, sd] of Object.entries(d.sides || {})) {
      if (sd.lockStage !== 'LOCKED') continue;
      if (sd.health?.status !== 'ACTIVE') continue;
      const ags = sd.v8_ags;
      rows.push({
        sport: d.sport,
        mkt,
        team: sd.team || sk,
        game: `${d.away} @ ${d.home}`,
        units: sd.v8_agsUnitsApplied ?? sd.peak?.units ?? '?',
        stars: sd.v8_vaultStar ?? sd.peak?.stars ?? '?',
        tier: sd.v8_lockTier,
        dw: sd.v8_walletConsensusDelta,
        hc: sd.v8_hcMargin,
        ags: ags != null ? ags.toFixed(2) : '∅',
        promotedBy: sd.promotedBy || '?',
        cronCreated: !!sd.cronCreated,
      });
    }
  }
}
rows.sort((a, b) => (b.units || 0) - (a.units || 0));
console.log(`\nLOCKED + ACTIVE picks for ${TODAY}: ${rows.length}\n`);
console.log(`  ${'Sport'.padEnd(5)} ${'Mkt'.padEnd(4)} ${'Team'.padEnd(20)} ${'★'.padStart(5)} ${'units'.padStart(6)} ${'tier'.padEnd(6)} ${'Δw'.padStart(3)} ${'HC'.padStart(3)} ${'AGS'.padStart(7)} ${'route'.padEnd(15)} new`);
console.log(`  ${'─'.repeat(105)}`);
for (const r of rows) {
  console.log(`  ${r.sport.padEnd(5)} ${r.mkt.padEnd(4)} ${String(r.team).padEnd(20)} ${String(r.stars).padStart(5)} ${String(r.units).padStart(6)}u ${r.tier.padEnd(6)} ${(r.dw>=0?'+':'')+r.dw} ${(r.hc>=0?'+':'')+r.hc} ${r.ags.padStart(7)} ${r.promotedBy.padEnd(15)} ${r.cronCreated ? '★new' : ''}`);
}
process.exit(0);
