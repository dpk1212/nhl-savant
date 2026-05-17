/**
 * One-off inspector for today's Cavaliers/Pistons total — diff what the
 * locked card shows vs what the live card shows so we can find where the
 * AGS-U / signal numbers diverge.
 */
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(join(REPO_ROOT, 'serviceAccountKey.json'), 'utf8'))) });
}
const db = admin.firestore();

const TODAY = process.argv[2] || new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
const COLLECTIONS = ['sharpFlowPicks', 'sharpFlowSpreads', 'sharpFlowTotals'];

async function findCavsPistons() {
  for (const col of COLLECTIONS) {
    const snap = await db.collection(col).where('date', '==', TODAY).where('sport', '==', 'NBA').get();
    for (const d of snap.docs) {
      const data = d.data();
      const teams = `${data.away||''} ${data.home||''}`.toLowerCase();
      if (teams.includes('cav') && teams.includes('piston')) {
        console.log(`\n══════ ${col} / ${d.id} ══════`);
        console.log(`${data.away} @ ${data.home} · status=${data.status} · date=${data.date}`);
        for (const [sideKey, s] of Object.entries(data.sides || {})) {
          console.log(`\n──── side: ${sideKey} ────`);
          console.log(`  team:              ${s.team}`);
          console.log(`  superseded:        ${s.superseded}`);
          console.log(`  lockStage:         ${s.lockStage}`);
          console.log(`  promotedBy:        ${s.promotedBy}`);
          console.log(`  promotedAt:        ${s.promotedAt ? new Date(s.promotedAt).toLocaleString('en-US',{timeZone:'America/New_York'}) : null}`);
          console.log(`  health.status:     ${s.health?.status}`);
          console.log(`  finalUnits:        ${s.finalUnits}`);
          console.log('');
          console.log(`  ── LOCK snapshot ──`);
          console.log(`  lock.stars:        ${s.lock?.stars}`);
          console.log(`  lock.units:        ${s.lock?.units}`);
          console.log(`  lock.odds:         ${s.lock?.odds}`);
          console.log(`  lock.pinnacleOdds: ${s.lock?.pinnacleOdds}`);
          console.log(`  lock.line:         ${s.lock?.line}`);
          console.log(`  lock.timestamp:    ${s.lock?.timestamp ? new Date(s.lock.timestamp).toLocaleString('en-US',{timeZone:'America/New_York'}) : null}`);
          console.log('');
          console.log(`  ── PEAK snapshot (most recent) ──`);
          console.log(`  peak.stars:        ${s.peak?.stars}`);
          console.log(`  peak.units:        ${s.peak?.units}`);
          console.log(`  peak.odds:         ${s.peak?.odds}`);
          console.log(`  peak.line:         ${s.peak?.line}`);
          console.log(`  peak.timestamp:    ${s.peak?.timestamp ? new Date(s.peak.timestamp).toLocaleString('en-US',{timeZone:'America/New_York'}) : null}`);
          console.log('');
          console.log(`  ── AGS-U (v8/v9 fields) ──`);
          console.log(`  v8_ags:            ${s.v8_ags}`);
          console.log(`  v8_agsTier:        ${s.v8_agsTier}`);
          console.log(`  v8_agsQuintile:    ${s.v8_agsQuintile}`);
          console.log(`  v8_lockTier:       ${s.v8_lockTier}`);
          console.log(`  v8_agsUnitsApplied:${s.v8_agsUnitsApplied}`);
          console.log(`  v8_agsComponents:  ${JSON.stringify(s.v8_agsComponents)}`);
          console.log(`  v8_systemVersion:  ${s.v8_systemVersion}`);
          console.log(`  v8_hcConfFor:      ${s.v8_hcConfFor}`);
          console.log(`  v8_hcConfAg:       ${s.v8_hcConfAg}`);
          console.log(`  v8_hcMargin:       ${s.v8_hcMargin}`);
          console.log(`  v8_hcDominant:     ${s.v8_hcDominant}`);
          console.log(`  v8_walletConsensusForW: ${s.v8_walletConsensusForW}`);
          console.log(`  v8_walletConsensusAgW:  ${s.v8_walletConsensusAgW}`);
          console.log(`  v8_walletConsensusDelta:${s.v8_walletConsensusDelta}`);
          console.log(`  v8_walletConsensusQualityMargin: ${s.v8_walletConsensusQualityMargin}`);
          console.log(`  v8_agsProvenForCount: ${s.v8_agsProvenForCount}`);
          console.log(`  v8_agsProvenAgCount:  ${s.v8_agsProvenAgCount}`);
          console.log('');
          console.log(`  ── Sharp money (lock snapshot) ──`);
          console.log(`  lock.sharpCount:     ${s.lock?.sharpCount}`);
          console.log(`  lock.totalInvested:  ${s.lock?.totalInvested}`);
          console.log(`  lock.consensusStrength: ${JSON.stringify(s.lock?.consensusStrength)}`);
          console.log(`  peak.sharpCount:     ${s.peak?.sharpCount}`);
          console.log(`  peak.totalInvested:  ${s.peak?.totalInvested}`);
          console.log(`  peak.consensusStrength: ${JSON.stringify(s.peak?.consensusStrength)}`);
          console.log(`  peak.updatedAt:      ${s.peak?.updatedAt ? new Date(s.peak.updatedAt).toLocaleString('en-US',{timeZone:'America/New_York'}) : null}`);
          console.log(`  lock.lockedAt:       ${s.lock?.lockedAt ? new Date(s.lock.lockedAt).toLocaleString('en-US',{timeZone:'America/New_York'}) : null}`);
          console.log('');
          console.log(`  ── Raw / live signal counters ──`);
          console.log(`  sharpCount:        ${s.sharpCount ?? data.sharpCount}`);
          console.log(`  sharpInvested:     ${s.sharpInvested ?? data.sharpInvested}`);
          console.log(`  sharpPctSide:      ${s.sharpPctSide}`);
          console.log(`  walletDetails.len: ${(s.walletDetails || []).length}`);
          console.log(`  recentlyComputedAt:${s.recentlyComputedAt ? new Date(s.recentlyComputedAt).toLocaleString('en-US',{timeZone:'America/New_York'}) : null}`);
          console.log(`  lastEvaluatedAt:   ${s.lastEvaluatedAt ? new Date(s.lastEvaluatedAt).toLocaleString('en-US',{timeZone:'America/New_York'}) : null}`);
        }
        // Top-level signal fields
        console.log(`\n── top-level signals ──`);
        for (const k of Object.keys(data)) {
          if (k === 'sides') continue;
          const v = data[k];
          if (v == null) continue;
          if (typeof v === 'object') {
            console.log(`  ${k}: ${JSON.stringify(v).slice(0, 200)}`);
          } else {
            console.log(`  ${k}: ${v}`);
          }
        }
      }
    }
  }
}
await findCavsPistons();
process.exit(0);
