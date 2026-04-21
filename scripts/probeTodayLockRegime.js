import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
if (!admin.apps.length) {
  const sakPath = join(__dirname, '..', 'serviceAccountKey.json');
  admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(sakPath, 'utf8'))) });
}
const db = admin.firestore();

const todayET = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });

function meanBaseF(v8Scoring, sideKey) {
  const wd = v8Scoring?.walletDetails;
  if (!Array.isArray(wd) || !wd.length) return null;
  const consensusSide = v8Scoring?.consensusSide || sideKey;
  const forW = wd.filter(w => w.side === consensusSide);
  if (!forW.length) return null;
  return forW.reduce((s, w) => s + (w.walletBase ?? 0), 0) / forW.length;
}

async function dump(coll, label) {
  const target = todayET();
  const snap = await db.collection(coll).get();
  const todays = snap.docs.filter(d => d.id.startsWith(target));
  console.log(`\n=== ${label} — ${todays.length} doc(s) for ${target} ===`);
  for (const doc of todays) {
    const data = doc.data();
    const sport = data.sport || '?';
    const away = data.away || '?';
    const home = data.home || '?';
    for (const [side, sd] of Object.entries(data.sides || {})) {
      if (sd.lockStage === 'SHADOW' || sd.superseded) continue;
      const peak = sd.peak || sd.lock || {};
      const lock = sd.lock || {};
      const stars = peak.stars ?? lock.stars ?? 0;
      if (stars < 2.5) continue;
      const peakRegime = peak.regime || null;
      const lockRegime = lock.regime || null;
      const peakMB = meanBaseF(peak.v8Scoring, side);
      const lockMB = meanBaseF(lock.v8Scoring, side);
      const isTopPick = peakRegime === 'CLEAR_MOVE' || lockRegime === 'CLEAR_MOVE';
      const isSuper =
        (peakRegime === 'CLEAR_MOVE' && peakMB != null && peakMB >= 55) ||
        (lockRegime === 'CLEAR_MOVE' && lockMB != null && lockMB >= 55);
      const mb = peakMB ?? lockMB;
      console.log(
        `  [${sport}] ${away} vs ${home} | ${side} ${stars}★ | ` +
        `regime(peak/lock)=${peakRegime}/${lockRegime} | ` +
        `meanBase(peak/lock)=${peakMB != null ? peakMB.toFixed(1) : 'n/a'}/${lockMB != null ? lockMB.toFixed(1) : 'n/a'} | ` +
        `→ ${isSuper ? '⚡ SUPER' : isTopPick ? '★ TOP' : '—'}`
      );
    }
  }
}

await dump('sharpFlowPicks',   'sharpFlowPicks (ML)');
await dump('sharpFlowSpreads', 'sharpFlowSpreads');
await dump('sharpFlowTotals',  'sharpFlowTotals');
process.exit(0);
