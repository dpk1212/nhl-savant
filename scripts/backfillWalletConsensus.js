/**
 * backfillWalletConsensus.js
 *
 * One-off admin-SDK backfill for Phase 2 wallet-consensus attribution
 * fields on sharpFlowPicks / sharpFlowSpreads / sharpFlowTotals sides.
 *
 * Mirrors computeWalletConsensus() / stampWalletConsensus() from
 * src/pages/SharpFlow.jsx. Reads sharpWalletProfiles once, then walks
 * every side doc for the requested date range (default: today) and
 * writes:
 *   v8_walletConsensusVersion / Sport / Enabled
 *   v8_walletConsensusForW / AgW / Delta / Verdict
 *   v8_walletConsensusStarBonus (unit bonus)
 *   v8_walletConsensusMuteTriggered / CancelTriggered / PromotionTriggered
 *   v8_walletConsensusBaseStars
 *
 * Usage:
 *   node scripts/backfillWalletConsensus.js                 # just today (ET)
 *   node scripts/backfillWalletConsensus.js 2026-04-22      # one date
 *   node scripts/backfillWalletConsensus.js 2026-04-20 2026-04-22  # range
 *   node scripts/backfillWalletConsensus.js --dry           # no writes
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

// Keep in lockstep with src/pages/SharpFlow.jsx.
// v4 = universal sport config + STRONG_FOR bonus 0.25→0.50 (2026-04-22 backtest)
const WHITELIST_CONSENSUS_VERSION = 4;
const WHITELIST_INTERVENTION = {
  NBA: { bonus: true, mute: true, cancel: true, promote: true },
  MLB: { bonus: true, mute: true, cancel: true, promote: true },
  NHL: { bonus: true, mute: true, cancel: true, promote: true },
  CBB: { bonus: true, mute: true, cancel: true, promote: true },
  NFL: { bonus: true, mute: true, cancel: true, promote: true },
};

const args = process.argv.slice(2).filter(a => !a.startsWith('--'));
const flags = process.argv.slice(2).filter(a => a.startsWith('--'));
const DRY = flags.includes('--dry');

const todayET = () => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit',
}).format(new Date());

function dateRange(start, end) {
  const out = [];
  const d = new Date(start + 'T00:00:00Z');
  const endD = new Date(end + 'T00:00:00Z');
  while (d <= endD) {
    out.push(d.toISOString().slice(0, 10));
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return out;
}

const dates = args.length === 0
  ? [todayET()]
  : args.length === 1 ? [args[0]] : dateRange(args[0], args[1]);

const PICK_COLS = [
  ['sharpFlowPicks', 'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals', 'TOTAL'],
];

function classifyDelta(forW, agW) {
  const delta = forW - agW;
  const verdict =
    delta >= 2 ? 'STRONG_FOR' :
    delta === 1 ? 'LEAN_FOR' :
    delta === 0 ? 'NEUTRAL' :
    delta === -1 ? 'FADE_WEAK' : 'FADE_STRONG';
  return { delta, verdict };
}

function computeWalletConsensus(walletDetails, sport, sideKey, profiles) {
  const cfg = WHITELIST_INTERVENTION[sport] || { bonus: false, mute: false, cancel: false, promote: false };
  const result = { forW: 0, agW: 0, delta: 0, verdict: 'NEUTRAL', unitBonus: 0, lockAction: null, promotionEligible: false, enabled: !!WHITELIST_INTERVENTION[sport], sportConfig: cfg, sport };
  if (!Array.isArray(walletDetails) || !sport || !sideKey) return result;

  let forW = 0, agW = 0;
  for (const d of walletDetails) {
    if (!d?.wallet) continue;
    const tier = profiles.get(d.wallet)?.bySport?.[sport]?.whitelistTier;
    if (tier !== 'CONFIRMED' && tier !== 'FLAT') continue;
    if (d.side === sideKey) forW++;
    else if (d.side) agW++;
  }
  const { delta, verdict } = classifyDelta(forW, agW);
  result.forW = forW; result.agW = agW; result.delta = delta; result.verdict = verdict;

  if (verdict === 'FADE_STRONG') {
    if (cfg.cancel) result.lockAction = 'CANCEL';
    else if (cfg.mute) result.lockAction = 'MUTE';
    return result;
  }
  if (verdict === 'FADE_WEAK') {
    if (cfg.mute) result.lockAction = 'MUTE';
    return result;
  }
  if (verdict === 'STRONG_FOR') {
    if (cfg.bonus) result.unitBonus = 0.50;
    if (cfg.promote && agW === 0) result.promotionEligible = true;
    return result;
  }
  if (verdict === 'LEAN_FOR') {
    if (cfg.bonus) result.unitBonus = 0.10;
    return result;
  }
  return result;
}

function buildStampFields(wc, sport, baseStars, promotedBy) {
  return {
    v8_walletConsensusVersion: WHITELIST_CONSENSUS_VERSION,
    v8_walletConsensusSport: sport || null,
    v8_walletConsensusEnabled: !!WHITELIST_INTERVENTION[sport],
    v8_walletConsensusForW: wc.forW,
    v8_walletConsensusAgW: wc.agW,
    v8_walletConsensusDelta: wc.delta,
    v8_walletConsensusVerdict: wc.verdict,
    v8_walletConsensusStarBonus: wc.unitBonus,
    v8_walletConsensusMuteTriggered: wc.lockAction === 'MUTE',
    v8_walletConsensusCancelTriggered: wc.lockAction === 'CANCEL',
    v8_walletConsensusPromotionTriggered: promotedBy === 'whitelist',
    v8_walletConsensusBaseStars: baseStars || 0,
  };
}

(async () => {
  console.log(`\nPhase 2 wallet-consensus backfill${DRY ? ' (DRY RUN)' : ''}`);
  console.log(`Dates: ${dates.join(', ')}\n`);

  const profSnap = await db.collection('sharpWalletProfiles').get();
  const profiles = new Map();
  for (const d of profSnap.docs) profiles.set(d.id, d.data());
  console.log(`Loaded ${profiles.size} wallet profiles\n`);

  let total = 0, stampedNow = 0, skippedAlreadyFresh = 0, noDetails = 0;
  const strongFor = [], leanFor = [], fadeWeak = [], fadeStrong = [];

  for (const date of dates) {
    for (const [col, mkt] of PICK_COLS) {
      const snap = await db.collection(col).where('date', '==', date).get();
      for (const doc of snap.docs) {
        const d = doc.data();
        const sport = d.sport;
        for (const [sideKey, side] of Object.entries(d.sides || {})) {
          total++;
          const peak = side.peak || side.lock;
          const wd = peak?.v8Scoring?.walletDetails || [];
          if (!wd.length) { noDetails++; continue; }

          const stale = (side.v8_walletConsensusVersion ?? 0) < WHITELIST_CONSENSUS_VERSION;
          if (!stale) { skippedAlreadyFresh++; continue; }

          const consensusSide = peak?.v8Scoring?.consensusSide || sideKey;
          // IMPORTANT: we stamp the CURRENT pick side (sideKey), so "for" =
          // wallets on the pick side, "ag" = wallets on the opposite side.
          const wc = computeWalletConsensus(wd, sport, sideKey, profiles);
          const promotedBy = side.promotedBy;
          const baseStars = peak?.stars || 0;
          const fields = buildStampFields(wc, sport, baseStars, promotedBy);

          if (wc.verdict === 'STRONG_FOR') strongFor.push({ col, id: doc.id, sideKey, sport, wc });
          else if (wc.verdict === 'LEAN_FOR') leanFor.push({ col, id: doc.id, sideKey, sport, wc });
          else if (wc.verdict === 'FADE_WEAK') fadeWeak.push({ col, id: doc.id, sideKey, sport, wc });
          else if (wc.verdict === 'FADE_STRONG') fadeStrong.push({ col, id: doc.id, sideKey, sport, wc });

          if (!DRY) {
            await db.collection(col).doc(doc.id).set(
              { sides: { [sideKey]: fields }, lastWriteAt: Date.now(), lastAction: 'consensus_backfill_admin' },
              { merge: true },
            );
          }
          stampedNow++;

          console.log(`[${mkt}] ${doc.id}  side=${sideKey}  sport=${sport}  stars=${baseStars}  stage=${side.lockStage}  promotedBy=${promotedBy || '—'}`);
          console.log(`       forW=${wc.forW} agW=${wc.agW} Δ=${wc.delta} ${wc.verdict}  unitBonus=${wc.unitBonus}  lockAction=${wc.lockAction || '—'}  promotionEligible=${wc.promotionEligible}`);
        }
      }
    }
  }

  console.log(`\n─── Summary ───`);
  console.log(`Total sides scanned:          ${total}`);
  console.log(`Had walletDetails:            ${total - noDetails}`);
  console.log(`Stamped${DRY ? ' (dry)' : ''}:${' '.repeat(DRY ? 19 : 24)}${stampedNow}`);
  console.log(`Already fresh (skipped):      ${skippedAlreadyFresh}`);
  console.log(`No walletDetails (skipped):   ${noDetails}`);
  console.log(``);
  console.log(`STRONG_FOR:  ${strongFor.length}`);
  console.log(`LEAN_FOR:    ${leanFor.length}`);
  console.log(`FADE_WEAK:   ${fadeWeak.length}`);
  console.log(`FADE_STRONG: ${fadeStrong.length}`);

  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
