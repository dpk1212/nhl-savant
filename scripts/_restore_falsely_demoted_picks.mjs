// Manual restoration for the 4 picks falsely demoted on 2026-05-10
// by the 90-second freshness filter prematurely pruning still-open
// proven-wallet positions.
//
// All 4 picks are PAST commenceTime (or past T-15) so the cron's freeze
// gate will keep these manual writes in place. The freshness filter has
// since been widened to 30 min (band-aid) and a per-wallet scan
// heartbeat is the long-term fix (TODO_SCANNER_HEARTBEAT.md).
//
// What this restores:
//   • sides[sideKey].lockStage         → LOCKED
//   • sides[sideKey].health.status     → ACTIVE
//   • sides[sideKey].health.reasons    → []
//   • sides[sideKey].mutedBy           → deleted
//   • sides[sideKey].v8_walletConsensus*  → recomputed from live positions
//                                            (no freshness filter applied)
//   • sides[sideKey].lockStageLastChange → diagnostic stamp explaining
//                                            why we manually restored

import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync } from 'fs';

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(readFileSync('serviceAccountKey.json','utf8'))),
});
const db = admin.firestore();

const TARGETS = [
  { col: 'sharpFlowPicks',  doc: '2026-05-10_MLB_laa_tor',       gameKey: 'laa_tor', sport: 'mlb', market: 'ML',    sideKey: 'home', label: 'Toronto Blue Jays ML' },
  { col: 'sharpFlowTotals', doc: '2026-05-10_MLB_col_phi_total', gameKey: 'col_phi', sport: 'mlb', market: 'TOTAL', sideKey: 'over', label: 'COL/PHI OVER' },
  { col: 'sharpFlowTotals', doc: '2026-05-10_MLB_hou_cin_total', gameKey: 'hou_cin', sport: 'mlb', market: 'TOTAL', sideKey: 'over', label: 'HOU/CIN OVER' },
  { col: 'sharpFlowPicks',  doc: '2026-05-10_MLB_tbr_bos',       gameKey: 'tbr_bos', sport: 'mlb', market: 'ML',    sideKey: 'away', label: 'Tampa Bay Rays ML' },
];

const TARGET_DATE = '2026-05-10';
const NOW = Date.now();

const tsMs = (t) => {
  if (!t) return 0;
  if (typeof t === 'number') return t;
  if (typeof t.toMillis === 'function') return t.toMillis();
  if (t._seconds) return t._seconds*1000;
  return 0;
};

// Load proven wallet set — schema is per-sport arrays (confirmedSports, flatSports)
async function loadProvenSet(sportUpper) {
  const snap = await db.collection('sharpWalletProfiles').get();
  const proven = new Map(); // walletShort → { tier, source }
  snap.forEach(d => {
    const data = d.data();
    const isConfirmed = Array.isArray(data.confirmedSports) && data.confirmedSports.includes(sportUpper);
    const isFlat      = Array.isArray(data.flatSports)      && data.flatSports.includes(sportUpper);
    if (isConfirmed || isFlat) {
      const short = data.walletShort || d.id;
      const source = data.whitelistSourceBySport?.[sportUpper] || '?';
      proven.set(short, { tier: isConfirmed ? 'CONFIRMED' : 'FLAT', source, fullAddr: data.walletAddress });
    }
  });
  return proven;
}

const provenMlb = await loadProvenSet('MLB');
console.log(`Loaded ${provenMlb.size} proven MLB wallets (CONFIRMED + FLAT)`);

for (const t of TARGETS) {
  console.log('\n' + '─'.repeat(80));
  console.log(`  ${t.label}  (${t.col}/${t.doc})`);
  console.log('─'.repeat(80));

  const snap = await db.collection(t.col).doc(t.doc).get();
  if (!snap.exists) { console.log(`  ❌ DOC NOT FOUND, skipping`); continue; }
  const docData = snap.data();
  const sd = docData.sides?.[t.sideKey] || {};

  console.log(`  Before: lockStage=${sd.lockStage}  health.status=${sd.health?.status}  reasons=[${(sd.health?.reasons||[]).join(',')}]`);
  console.log(`          v8_walletConsensus: forW=${sd.v8_walletConsensusForW} agW=${sd.v8_walletConsensusAgW} Δw=${sd.v8_walletConsensusDelta}`);

  // ─── Recompute consensus from LIVE positions, NO freshness filter ───
  const posSnap = await db.collection('sharp_action_positions')
    .where('date', '==', TARGET_DATE)
    .where('gameKey', '==', t.gameKey)
    .where('marketType', '==', t.market)
    .get();
  const allPositions = [];
  posSnap.forEach(d => allPositions.push(d.data()));

  const oppSide = t.sideKey === 'home' ? 'away' : t.sideKey === 'over' ? 'under' : t.sideKey === 'under' ? 'over' : 'home';

  const forSidePositions = allPositions.filter(p => (p.side||'').toLowerCase() === t.sideKey);
  const agSidePositions  = allPositions.filter(p => (p.side||'').toLowerCase() === oppSide);

  // Filter to proven only
  const provenForPositions = forSidePositions.filter(p => provenMlb.has(p.walletShort));
  const provenAgPositions  = agSidePositions.filter(p => provenMlb.has(p.walletShort));

  const forW = provenForPositions.length;
  const agW  = provenAgPositions.length;
  const dw   = forW - agW;

  // HC margin: count of wallets ≥1.5x avg bet size on each side, then diff
  const avgBetForSide = (positions) => {
    if (positions.length === 0) return 0;
    const sum = positions.reduce((s,p) => s + (p.size||0), 0);
    return sum / positions.length;
  };
  const avgFor = avgBetForSide(provenForPositions);
  const avgAg  = avgBetForSide(provenAgPositions);
  const hcConfFor = provenForPositions.filter(p => avgFor > 0 && (p.size||0) >= 1.5 * avgFor).length;
  const hcConfAg  = provenAgPositions.filter(p => avgAg > 0 && (p.size||0) >= 1.5 * avgAg).length;
  const hcMargin = hcConfFor - hcConfAg;

  console.log(`  LIVE consensus (no freshness filter):`);
  console.log(`    For (${t.sideKey}):     ${forW} proven wallets — ${provenForPositions.map(p => `${p.walletShort}($${Math.round(p.size||0).toLocaleString()})`).join(', ')}`);
  console.log(`    Against (${oppSide}):  ${agW} proven wallets — ${provenAgPositions.map(p => `${p.walletShort}($${Math.round(p.size||0).toLocaleString()})`).join(', ')}`);
  console.log(`    Δw=${dw}  HCm=${hcMargin}  (avg for=$${Math.round(avgFor).toLocaleString()}, avg ag=$${Math.round(avgAg).toLocaleString()})`);

  // ─── Decide restoration ───
  if (dw < -1) {
    console.log(`  ⛔ Δw=${dw} is genuinely bad — NOT restoring (true winners-killed)`);
    continue;
  }
  if (forW === 0) {
    console.log(`  ⛔ No proven wallets on for-side — NOT restoring`);
    continue;
  }

  // ─── Build patch ───
  const patch = {
    [`sides.${t.sideKey}.lockStage`]: 'LOCKED',
    [`sides.${t.sideKey}.health`]: {
      status: 'ACTIVE',
      reasons: [],
      walletDelta: dw,
      qualityMargin: 0,
      hcMargin: hcMargin,
      evaluatedAt: NOW,
      syncedBy: 'manual-restore-scanner-gap',
      ags: sd.v8_ags ?? null,
      currentStars: sd.v8_lockTier === 'ELITE' ? 5.0 : 3.5,
    },
    [`sides.${t.sideKey}.v8_walletConsensusForW`]: forW,
    [`sides.${t.sideKey}.v8_walletConsensusAgW`]: agW,
    [`sides.${t.sideKey}.v8_walletConsensusDelta`]: dw,
    [`sides.${t.sideKey}.v8_hcConfFor`]: hcConfFor,
    [`sides.${t.sideKey}.v8_hcConfAg`]: hcConfAg,
    [`sides.${t.sideKey}.v8_hcMargin`]: hcMargin,
    [`sides.${t.sideKey}.v8_hcDominant`]: hcMargin >= 1,
    [`sides.${t.sideKey}.v8_lockTier`]: hcMargin >= 1 || dw >= 2 ? 'LOCKED' : 'LOCKED',
    [`sides.${t.sideKey}.lockStageLastChange`]: {
      reason: 'manual_restore_scanner_gap_2026_05_10',
      at: NOW,
      dw: dw,
      hcMargin: hcMargin,
      previousStatus: sd.health?.status || 'unknown',
      previousLockStage: sd.lockStage || 'unknown',
      note: 'Demoted 2026-05-10 by 90s freshness filter pruning still-open positions. Filter widened to 30 min; this row manually restored.',
    },
    [`sides.${t.sideKey}.mutedBy`]: admin.firestore.FieldValue.delete(),
  };

  await db.collection(t.col).doc(t.doc).update(patch);
  console.log(`  ✅ RESTORED to LOCKED/ACTIVE  (forW=${forW}, agW=${agW}, Δw=${dw}, HCm=${hcMargin})`);
}

console.log('\n' + '═'.repeat(80));
console.log('  Restoration complete.');
console.log('═'.repeat(80));

process.exit(0);
