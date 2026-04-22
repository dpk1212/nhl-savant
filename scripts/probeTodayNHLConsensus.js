/**
 * probeTodayNHLConsensus.js — quick probe of today's NHL picks & wallets
 * against the Phase 2 wallet-consensus whitelist.
 *
 * For each NHL side doc in sharpFlowPicks/sharpFlowSpreads/sharpFlowTotals
 * dated today, print:
 *   - side / lock stage / stars / promotedBy
 *   - the full walletDetails list, flagging which wallets are CONFIRMED/FLAT
 *     for NHL on sharpWalletProfiles
 *   - the stamped v8_walletConsensus* fields (if the new code has run yet)
 *
 * Usage: node scripts/probeTodayNHLConsensus.js [YYYY-MM-DD]
 */
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

if (!admin.apps.length) {
  const sakPath = join(__dirname, '../serviceAccountKey.json');
  if (existsSync(sakPath)) {
    admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(sakPath, 'utf8'))) });
  } else {
    admin.initializeApp({
      credential: admin.credential.cert({
        project_id: process.env.VITE_FIREBASE_PROJECT_ID,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
}
const db = admin.firestore();

const todayET = () => {
  const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' });
  return fmt.format(new Date());
};
const DATE = process.argv[2] || todayET();
const SPORT = 'NHL';

const COLS = [
  ['sharpFlowPicks', 'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals', 'TOTAL'],
];

(async () => {
  console.log(`\n=== Probing ${SPORT} picks for ${DATE} ===\n`);

  // 1. Load wallet profiles keyed by walletShort
  const profSnap = await db.collection('sharpWalletProfiles').get();
  const PROFILES = new Map();
  let nhlConfirmed = 0, nhlFlat = 0, nhlWR50 = 0;
  for (const d of profSnap.docs) {
    const p = d.data();
    PROFILES.set(d.id, p);
    const tier = p?.bySport?.[SPORT]?.whitelistTier;
    if (tier === 'CONFIRMED') nhlConfirmed++;
    else if (tier === 'FLAT') nhlFlat++;
    else if (tier === 'WR50') nhlWR50++;
  }
  console.log(`Wallet profiles loaded: ${PROFILES.size} total (${nhlConfirmed} NHL CONFIRMED, ${nhlFlat} NHL FLAT, ${nhlWR50} NHL WR50)\n`);

  const nhlWhitelisted = new Set();
  for (const [walletShort, p] of PROFILES.entries()) {
    const tier = p?.bySport?.[SPORT]?.whitelistTier;
    if (tier === 'CONFIRMED' || tier === 'FLAT') nhlWhitelisted.add(walletShort);
  }

  let totalSides = 0;
  let sidesWithConsensusStamp = 0;
  let sidesWithWhitelistedWallet = 0;
  const summaries = [];

  for (const [col, mkt] of COLS) {
    const snap = await db.collection(col)
      .where('date', '==', DATE)
      .where('sport', '==', SPORT)
      .get();
    console.log(`\n── ${col} (${mkt}) — ${snap.size} docs for ${SPORT} ${DATE} ──`);
    for (const doc of snap.docs) {
      const d = doc.data();
      const sides = d.sides || {};
      for (const [sideKey, side] of Object.entries(sides)) {
        totalSides++;
        const peak = side.peak || side.lock;
        const wd = peak?.v8Scoring?.walletDetails || [];
        const consensusSide = peak?.v8Scoring?.consensusSide || sideKey;

        // Identify whitelisted wallets in walletDetails
        const hits = wd.filter(w => nhlWhitelisted.has(w.wallet));
        const forHits = hits.filter(w => w.side === consensusSide);
        const agHits = hits.filter(w => w.side && w.side !== consensusSide);

        if (hits.length) sidesWithWhitelistedWallet++;

        const stampedVersion = side.v8_walletConsensusVersion ?? side.peak?.v8_walletConsensusVersion;
        const stampedDelta = side.v8_walletConsensusDelta ?? side.peak?.v8_walletConsensusDelta;
        const stampedVerdict = side.v8_walletConsensusVerdict ?? side.peak?.v8_walletConsensusVerdict;
        const stampedForW = side.v8_walletConsensusForW ?? side.peak?.v8_walletConsensusForW;
        const stampedAgW = side.v8_walletConsensusAgW ?? side.peak?.v8_walletConsensusAgW;
        const stampedBonus = side.v8_walletConsensusStarBonus ?? side.peak?.v8_walletConsensusStarBonus;
        const muteTrig = side.v8_walletConsensusMuteTriggered ?? side.peak?.v8_walletConsensusMuteTriggered;
        const cancelTrig = side.v8_walletConsensusCancelTriggered ?? side.peak?.v8_walletConsensusCancelTriggered;
        const promoTrig = side.v8_walletConsensusPromotionTriggered ?? side.peak?.v8_walletConsensusPromotionTriggered;

        if (stampedVersion != null) sidesWithConsensusStamp++;

        summaries.push({
          market: mkt,
          game: d.gameKey || doc.id,
          side: sideKey,
          sideLabel: peak?.label || side.sideLabel || sideKey,
          lockStage: side.lockStage,
          promotedBy: side.promotedBy,
          stars: peak?.stars,
          units: peak?.units,
          forW_live: forHits.length,
          agW_live: agHits.length,
          deltaLive: forHits.length - agHits.length,
          forHits: forHits.map(w => `${w.wallet}(${PROFILES.get(w.wallet)?.bySport?.[SPORT]?.whitelistTier || '?'})`),
          agHits: agHits.map(w => `${w.wallet}(${PROFILES.get(w.wallet)?.bySport?.[SPORT]?.whitelistTier || '?'})`),
          stampedVersion,
          stampedDelta,
          stampedVerdict,
          stampedForW,
          stampedAgW,
          stampedBonus,
          muteTrig,
          cancelTrig,
          promoTrig,
          wdCount: wd.length,
        });
      }
    }
  }

  if (!totalSides) {
    console.log(`\nNo ${SPORT} sides found for ${DATE}.\n`);
    process.exit(0);
  }

  console.log(`\n=== Summary ===`);
  console.log(`Total sides:                  ${totalSides}`);
  console.log(`Stamped with v8_walletConsensus: ${sidesWithConsensusStamp}`);
  console.log(`Sides w/ ≥1 NHL-whitelisted wallet (live compute): ${sidesWithWhitelistedWallet}\n`);

  console.log(`=== Per-side detail ===\n`);
  for (const s of summaries) {
    console.log(`[${s.market}] ${s.game}  side=${s.sideLabel}  stage=${s.lockStage}  promotedBy=${s.promotedBy || '—'}  ★=${s.stars}  u=${s.units}`);
    console.log(`   walletDetails=${s.wdCount}   live Δ=${s.deltaLive} (forW=${s.forW_live}, agW=${s.agW_live})`);
    if (s.forHits.length) console.log(`   FOR whitelisted: ${s.forHits.join(', ')}`);
    if (s.agHits.length)  console.log(`   AG  whitelisted: ${s.agHits.join(', ')}`);
    if (s.stampedVersion != null) {
      console.log(`   stamped: v=${s.stampedVersion} verdict=${s.stampedVerdict} Δ=${s.stampedDelta} (forW=${s.stampedForW}, agW=${s.stampedAgW}) unitBonus=${s.stampedBonus}  mute=${s.muteTrig} cancel=${s.cancelTrig} promote=${s.promoTrig}`);
    } else {
      console.log(`   stamped: —  (Phase 2 fields not yet written on this side)`);
    }
    console.log('');
  }

  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
