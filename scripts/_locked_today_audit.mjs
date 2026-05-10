// Snapshot of what the Locked Picks page SHOULD show today, computed from
// the same rules the cron + client both run:
//   v7.4 display gate:  HC_m ≥ +1  OR  (Σ ≥ 5 ∧ Δw ≥ +1 ∧ Δq ≥ +1)
//   AGS rescue:         AGS ≥ +5 with ≥ AGS_MIN_PROVEN_WALLETS proven AND
//                       Δw > -2 AND v7.4 floor failing
//   Display gate:       lockStage='LOCKED' AND health.status='ACTIVE'
//                       AND passes the live floor (or AGS rescue)
//
// Read-only — no writes. Use after `node scripts/syncPickStateAuthoritative.js
// --force` so the stamp matches the live data.

import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import {
  AGS_FALLBACK_CALIBRATION,
  AGS_MIN_PROVEN_WALLETS,
  aggregateSideProven,
  computeAgs,
  agsSizeMultiplier,
  meetsAgsLockFloor,
  failsAgsConfirmationGate,
} from '../src/lib/ags.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
if (!admin.apps.length) {
  const sak = join(REPO_ROOT, 'serviceAccountKey.json');
  if (existsSync(sak)) admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(sak, 'utf8'))) });
}
const db = admin.firestore();

const TODAY = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
const NOW = Date.now();

function meetsV74Floor(dw, dq, hc) {
  const sum = (dw || 0) + (dq || 0);
  return (hc >= 1) || (dw >= 1 && dq >= 1 && sum >= 5);
}

// Load AGS calibration + proven map (mirrors syncPickStateAuthoritative.js)
const calDoc = await db.collection('agsCalibration').doc('current').get();
const cal = calDoc.exists && calDoc.data()?.normalizers ? calDoc.data() : AGS_FALLBACK_CALIBRATION;
const profSnap = await db.collection('sharpWalletProfiles').get();
const tierMap = new Map();
for (const d of profSnap.docs) {
  const p = d.data();
  if (!p?.bySport) continue;
  const m = {};
  for (const [s, r] of Object.entries(p.bySport)) if (r?.whitelistTier) m[s] = r.whitelistTier;
  tierMap.set(d.id, m);
}
const isProven = (short, sport) => {
  const t = tierMap.get(short)?.[sport];
  return t === 'CONFIRMED' || t === 'FLAT';
};

const COLLECTIONS = [
  ['sharpFlowPicks',   'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals',  'TOTAL'],
];

const sides = [];
for (const [col, mkt] of COLLECTIONS) {
  const snap = await db.collection(col).where('date', '==', TODAY).get();
  for (const doc of snap.docs) {
    const d = doc.data();
    for (const [k, sd] of Object.entries(d.sides || {})) {
      if (!sd) continue;
      const ct = typeof d.commenceTime === 'number' ? d.commenceTime
               : d.commenceTime?.toMillis ? d.commenceTime.toMillis()
               : d.commenceTime?._seconds ? d.commenceTime._seconds * 1000
               : null;
      const minsToGame = ct != null ? (ct - NOW) / 60000 : null;
      const wd = sd.peak?.v8Scoring?.walletDetails || sd.lock?.v8Scoring?.walletDetails || [];
      const agg = wd.length ? aggregateSideProven(wd, k, d.sport, isProven) : null;
      const agsRes = agg ? computeAgs(agg, cal) : null;
      const dw = sd.v8_walletConsensusDelta;
      const dq = sd.v8_walletConsensusQualityMargin;
      const hc = sd.v8_hcMargin || 0;
      const passesV74 = meetsV74Floor(dw, dq, hc);
      const provenTotal = agsRes ? (agsRes.provenForCount + agsRes.provenAgCount) : 0;
      const agsRescue = agsRes && (dw > -2) && provenTotal >= AGS_MIN_PROVEN_WALLETS
                       && meetsAgsLockFloor(agsRes.ags, provenTotal) && !passesV74;
      const agsVeto = agsRes && passesV74 && provenTotal >= AGS_MIN_PROVEN_WALLETS
                     && failsAgsConfirmationGate(agsRes.ags);
      const passesDisplay = (passesV74 || agsRescue)
                          && sd.lockStage === 'LOCKED'
                          && sd.health?.status === 'ACTIVE'
                          && !sd.superseded;
      sides.push({
        sport: d.sport, mkt,
        teamLine: `${d.away} @ ${d.home}`,
        side: k, team: sd.team || k,
        lockStage: sd.lockStage, status: sd.health?.status, promotedBy: sd.promotedBy || null,
        dw, dq, hc, ags: agsRes?.ags ?? null, provenTotal,
        passesV74, agsRescue, agsVeto,
        units: sd.v8_agsUnitsApplied ?? null,
        tier: sd.v8_lockTier ?? null,
        peakUnits: sd.peak?.units ?? null,
        odds: sd.peak?.odds ?? sd.lock?.odds ?? null,
        passesDisplay, minsToGame,
      });
    }
  }
}

// ── Print: 1) what SHOULD display, 2) muted/cancelled/shadow, 3) skipped ──
const fmt = (s) => {
  const ags = s.ags == null ? '   —  ' : (s.ags >= 0 ? `+${s.ags.toFixed(2)}` : s.ags.toFixed(2)).padStart(6);
  const dw = (s.dw >= 0 ? `+${s.dw}` : `${s.dw}`).padStart(3);
  const dq = (s.dq >= 0 ? `+${s.dq}` : `${s.dq}`).padStart(3);
  const hc = (s.hc >= 0 ? `+${s.hc}` : `${s.hc}`).padStart(3);
  const route = s.passesV74 ? (s.hc >= 1 && !(s.dw >= 1 && s.dq >= 1 && s.dw+s.dq >= 5) ? 'HC' : 'Σ') : (s.agsRescue ? 'AGS-rescue' : '—');
  const ttg = s.minsToGame == null ? ''
            : s.minsToGame > 60 ? `T-${(s.minsToGame/60).toFixed(1)}h`
            : `T-${s.minsToGame.toFixed(0)}m`;
  return { ags, dw, dq, hc, route, ttg };
};

const visible = sides.filter(s => s.passesDisplay).sort((a,b) => (b.units||0) - (a.units||0));
const mutedShadow = sides.filter(s => !s.passesDisplay)
  .sort((a,b) => {
    const order = { LOCKED: 0, LEAN: 1, SHADOW: 2 };
    return (order[a.lockStage] ?? 9) - (order[b.lockStage] ?? 9);
  });

console.log(`\n═══════════════════════════════════════════════════════════════════════════════`);
console.log(`  WHAT SHOULD DISPLAY ON LOCKED PICKS — ${TODAY}  (now=${new Date(NOW).toISOString()})`);
console.log(`═══════════════════════════════════════════════════════════════════════════════\n`);

console.log(`✅ VISIBLE (lockStage=LOCKED, health=ACTIVE, passes live floor): ${visible.length}\n`);
console.log(`  ${'Sport'.padEnd(5)} ${'Mkt'.padEnd(7)} ${'Team'.padEnd(18)} ${'Game time'.padEnd(8)} ${'Δw'.padStart(3)} ${'Δq'.padStart(3)} ${'HC'.padStart(3)} ${'AGS'.padStart(7)} ${'route'.padEnd(11)} ${'tier'.padEnd(7)} ${'units'.padStart(6)} ${'odds'.padStart(5)}`);
console.log(`  ${'─'.repeat(95)}`);
for (const s of visible) {
  const f = fmt(s);
  const u = s.units != null ? `${s.units.toFixed(2)}u`.padStart(6) : '   —  ';
  const odds = s.odds != null ? `${s.odds > 0 ? '+' : ''}${s.odds}`.padStart(5) : '    —';
  console.log(`  ${(s.sport||'').padEnd(5)} ${s.mkt.padEnd(7)} ${(s.team||s.side).padEnd(18)} ${f.ttg.padEnd(8)} ${f.dw} ${f.dq} ${f.hc} ${f.ags.padStart(7)} ${f.route.padEnd(11)} ${(s.tier||'').padEnd(7)} ${u} ${odds}`);
}

if (mutedShadow.length) {
  console.log(`\n❌ HIDDEN (muted, shadow, cancelled, or doesn't pass live floor): ${mutedShadow.length}\n`);
  console.log(`  ${'Sport'.padEnd(5)} ${'Mkt'.padEnd(7)} ${'Team'.padEnd(18)} ${'Δw'.padStart(3)} ${'Δq'.padStart(3)} ${'HC'.padStart(3)} ${'AGS'.padStart(7)} ${'lockStage'.padEnd(9)} ${'status'.padEnd(9)} ${'why hidden'}`);
  console.log(`  ${'─'.repeat(110)}`);
  for (const s of mutedShadow) {
    const f = fmt(s);
    let why;
    if (s.lockStage === 'SHADOW') why = 'SHADOW (below v7.4 floor)';
    else if (s.status === 'CANCELLED') why = 'CANCELLED (Δw≤-2)';
    else if (s.status === 'MUTED') why = `MUTED (${s.agsVeto ? 'ags_quality_veto' : (s.dw === -1 ? 'winners_faded' : (s.dw === 0 ? 'winners_below_floor' : 'sum_below_floor'))})`;
    else why = 'no live signal';
    console.log(`  ${(s.sport||'').padEnd(5)} ${s.mkt.padEnd(7)} ${(s.team||s.side).padEnd(18)} ${f.dw} ${f.dq} ${f.hc} ${f.ags.padStart(7)} ${(s.lockStage||'∅').padEnd(9)} ${(s.status||'∅').padEnd(9)} ${why}`);
  }
}

console.log(`\n═══════════════════════════════════════════════════════════════════════════════\n`);
process.exit(0);
