// Wallet-by-wallet receipts for the 4 picks demoted on 2026-05-10.
// For each pick:
//   §1 lock-time wallet stack (frozen in peak.v8Scoring.walletDetails)
//   §2 cron-stamped current consensus (v8_*)
//   §3 per-wallet status NOW: still in / exited / scanner gap
//   §4 verdict: legit / scanner-driven / floor-too-aggressive

import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync } from 'fs';

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(readFileSync('serviceAccountKey.json','utf8'))),
});
const db = admin.firestore();

const TARGETS = [
  ['sharpFlowPicks',  '2026-05-10_MLB_laa_tor',          'home', 'MLB Toronto Blue Jays ML', 'mlb'],
  ['sharpFlowTotals', '2026-05-10_MLB_col_phi_total',    'over', 'MLB COL/PHI OVER',         'mlb'],
  ['sharpFlowTotals', '2026-05-10_MLB_hou_cin_total',    'over', 'MLB HOU/CIN OVER',         'mlb'],
  ['sharpFlowPicks',  '2026-05-10_MLB_tbr_bos',          'away', 'MLB Tampa Bay Rays ML',    'mlb'],
  ['sharpFlowPicks',  '2026-05-10_MLB_chc_tex',          'home', 'MLB Texas Rangers ML (still LOCKED — control)', 'mlb'],
];

const TARGET_DATE = '2026-05-10';
const NOW = Date.now();

const tsMs = (t) => {
  if (!t) return 0;
  if (typeof t === 'number') return t;
  if (typeof t.toMillis === 'function') return t.toMillis();
  if (t._seconds) return t._seconds*1000;
  if (t.seconds) return t.seconds*1000;
  return 0;
};
const fmt = (ms) => ms ? new Date(ms).toLocaleString('en-US',{timeZone:'America/New_York', month:'short', day:'numeric', hour:'numeric', minute:'2-digit'}) : 'null';

async function loadProvenSet(sport) {
  const snap = await db.collection('sharpWalletProfiles').where('sport','==',sport.toLowerCase()).get();
  const proven = new Map();
  snap.forEach(d => {
    const data = d.data();
    const tier = data.whitelistTier || data.profile?.whitelistTier;
    if (tier === 'CONFIRMED' || tier === 'FLAT') {
      proven.set(d.id, { tier, source: data.whitelistSource || '?' });
    }
  });
  return proven;
}

for (const [col, docId, sideKey, label, sport] of TARGETS) {
  const snap = await db.collection(col).doc(docId).get();
  if (!snap.exists) { console.log(`\n${label} — DOC NOT FOUND\n`); continue; }
  const d = snap.data();
  const ct = tsMs(d.commenceTime);
  const sd = d.sides?.[sideKey] || {};
  const lock = sd.lock || {};
  const peak = sd.peak || {};

  console.log('\n' + '═'.repeat(110));
  console.log(`  ${label}`);
  console.log(`  doc=${col}/${docId}  side=${sideKey}`);
  console.log(`  commenceTime ${fmt(ct)} ET   |   lockedAt ${fmt(tsMs(lock.lockedAt))} ET`);
  console.log(`  CURRENT: lockStage=${sd.lockStage}  health.status=${sd.health?.status}  reasons=[${(sd.health?.reasons||[]).join(',')}]`);
  console.log('═'.repeat(110));

  // ─── §1 lock-time wallet stack (frozen) ───
  const lockedDetails = peak.v8Scoring?.walletDetails || lock.v8Scoring?.walletDetails || [];
  const lockSide = sideKey;
  const lockedFor = lockedDetails.filter(w => w.side === lockSide);
  const lockedAg  = lockedDetails.filter(w => w.side !== lockSide);

  console.log(`\n§1 LOCK-TIME WALLET STACK (frozen in peak.v8Scoring.walletDetails @ ${fmt(tsMs(peak.updatedAt))} ET)`);
  console.log(`   FOR ${sideKey}: ${lockedFor.length} wallets   |   AGAINST: ${lockedAg.length} wallets`);
  if (lockedFor.length === 0 && lockedAg.length === 0) {
    console.log(`   ⚠️  NO walletDetails frozen — pick was promoted by a non-v8 path`);
  } else {
    console.log(`   ──── FOR (${sideKey}) ────`);
    for (const w of lockedFor) {
      const addr = (w.wallet || '').slice(0,8);
      console.log(`     ${addr.padEnd(10)} tier=${(w.whitelistTier||'?').padEnd(10)} sizeRatio=${(w.v8_sizeRatio||0).toFixed(2)}x size=$${Math.round(w.size||0).toLocaleString().padStart(7)}  bets=${w.bets||'?'}`);
    }
    if (lockedAg.length > 0) {
      console.log(`   ──── AGAINST ────`);
      for (const w of lockedAg) {
        const addr = (w.wallet || '').slice(0,8);
        console.log(`     ${addr.padEnd(10)} tier=${(w.whitelistTier||'?').padEnd(10)} sizeRatio=${(w.v8_sizeRatio||0).toFixed(2)}x size=$${Math.round(w.size||0).toLocaleString().padStart(7)}`);
      }
    }
  }

  // ─── §2 cron-stamped current consensus ───
  console.log(`\n§2 CURRENT CRON-STAMPED CONSENSUS (v8_* — frozen at last cron tick before T-15)`);
  console.log(`   forW=${sd.v8_walletConsensusForW ?? '∅'}  agW=${sd.v8_walletConsensusAgW ?? '∅'}  Δw=${sd.v8_walletConsensusDelta ?? '∅'}`);
  console.log(`   qualForT30=${sd.v8_walletConsensusQualityForT30 ?? '∅'}  qualAgT30=${sd.v8_walletConsensusQualityAgT30 ?? '∅'}  Δq=${sd.v8_walletConsensusQualityMargin ?? '∅'}`);
  console.log(`   hcConfFor=${sd.v8_hcConfFor ?? '∅'}  hcConfAg=${sd.v8_hcConfAg ?? '∅'}  HCm=${sd.v8_hcMargin ?? '∅'}`);
  console.log(`   lockTier=${sd.v8_lockTier ?? '∅'}  promotedBy=${sd.promotedBy ?? '∅'}`);

  // Δw at lock vs now:
  const lockDw = lock.v8?.delta ?? lock.v8Scoring?.delta ?? peak.v8Scoring?.delta ?? null;
  console.log(`\n   📊 Δw transition: lock=${lockDw ?? '∅'} → current=${sd.v8_walletConsensusDelta ?? '∅'}`);

  // ─── §3 live position check per-wallet ───
  console.log(`\n§3 PER-WALLET LIVE STATUS — does each lock-time wallet still have an OPEN position right now?`);
  const allFor = [...lockedFor];
  for (const w of allFor) {
    const addr = w.wallet;
    if (!addr) continue;
    const sportLower = (sport || '').toLowerCase();

    // Find ALL sharp_action_positions for this wallet on this game-side, today
    const matchSnap = await db.collection('sharp_action_positions')
      .where('date','==',TARGET_DATE)
      .where('walletId','==', addr)
      .get();
    const positions = [];
    matchSnap.forEach(d => positions.push({ _id: d.id, ...d.data() }));

    // Filter to this market/side
    const matKey = String(d.matchupKey || `${d.away?.toLowerCase()}_${d.home?.toLowerCase()}`);
    const marketType = (col === 'sharpFlowPicks' ? 'ML' : col === 'sharpFlowSpreads' ? 'SPREAD' : 'TOTAL');
    const sameMatchup = positions.filter(p =>
      (p.matchupKey || `${(p.away||'').toLowerCase()}_${(p.home||'').toLowerCase()}`).includes(d.away?.toLowerCase()||'') ||
      (p.matchupKey || '').includes(d.home?.toLowerCase()||'')
    );
    const sameMarket = sameMatchup.filter(p => (p.marketType || '').toUpperCase() === marketType);
    const onSide = sameMarket.filter(p => (p.side || '').toLowerCase() === sideKey.toLowerCase());

    const lastUpdated = onSide.length > 0
      ? Math.max(...onSide.map(p => tsMs(p.updatedAt)))
      : 0;

    // freshness: latest update across ALL positions today (max over rawPositions)
    const allSnap = await db.collection('sharp_action_positions').where('date','==',TARGET_DATE).get();
    let maxAll = 0;
    allSnap.forEach(p => { const ms = tsMs(p.data().updatedAt); if (ms > maxAll) maxAll = ms; });
    const isFresh = lastUpdated >= maxAll - 90*1000;

    const verdict = onSide.length === 0
      ? '❌ EXITED (no position on this side anywhere today)'
      : isFresh
        ? `✅ ACTIVE (last scan ${Math.round((maxAll - lastUpdated)/1000)}s ago — within freshness window)`
        : `⚠️  STALE (last scan @ ${fmt(lastUpdated)} ET, ${Math.round((maxAll-lastUpdated)/60000)} min behind newest scan)`;

    const addr8 = addr.slice(0,8);
    console.log(`     ${addr8.padEnd(10)}  ${verdict}`);
    if (onSide.length > 0) {
      const p = onSide[onSide.length-1];
      console.log(`        last position: $${Math.round(p.size||0).toLocaleString()} @ ${fmt(tsMs(p.updatedAt))} ET (entryLine=${p.entryLine ?? '∅'} sizeRatio=${(p.v8_sizeRatio || p.sizeRatio || 0).toFixed(2)}x)`);
    }

    // Also check OPPOSITE side — did wallet flip?
    const oppositeSide = sideKey === 'home' ? 'away' : sideKey === 'over' ? 'under' : sideKey === 'under' ? 'over' : 'home';
    const onOpposite = sameMarket.filter(p => (p.side || '').toLowerCase() === oppositeSide.toLowerCase());
    if (onOpposite.length > 0) {
      const p = onOpposite[onOpposite.length-1];
      console.log(`        🔄 FLIPPED to ${oppositeSide}: $${Math.round(p.size||0).toLocaleString()} @ ${fmt(tsMs(p.updatedAt))} ET`);
    }
  }

  // ─── §4 verdict ───
  console.log(`\n§4 VERDICT`);
  const live = sd.v8_walletConsensusForW ?? 0;
  const lockTimeFor = lockedFor.length;
  if (live === lockTimeFor) {
    console.log(`   ✅ Wallet count unchanged (${live} for at lock = ${live} for now). Demotion likely from HC margin / quality drop.`);
  } else if (live < lockTimeFor) {
    const dropped = lockTimeFor - live;
    console.log(`   ⚠️  ${dropped} of ${lockTimeFor} lock-time proven wallets no longer counted. See §3 for which ones.`);
  } else {
    console.log(`   📈 More wallets backing now (${live}) than at lock (${lockTimeFor}). Demotion not from for-side erosion.`);
  }
  console.log('');
}

console.log('\n═══════════════════════════════════════════════════════════════════════════════════════');
console.log('  Done. Run `node scripts/_audit_demotion_receipts.mjs > /tmp/receipts.txt 2>&1` to capture.');
console.log('═══════════════════════════════════════════════════════════════════════════════════════');

process.exit(0);
