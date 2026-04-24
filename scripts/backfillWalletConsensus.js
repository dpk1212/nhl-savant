/**
 * backfillWalletConsensus.js
 *
 * v6 (Two-Factor Overhaul) admin-SDK backfill for wallet-consensus
 * attribution fields on sharpFlowPicks / sharpFlowSpreads / sharpFlowTotals
 * sides. Mirrors computeWalletConsensus / stampWalletConsensus /
 * vaultStarFromDeltas from src/pages/SharpFlow.jsx.
 *
 * Writes per side:
 *   v8_walletConsensusVersion / Sport / Enabled
 *   v8_walletConsensusForW / AgW / Delta / Verdict
 *   v8_walletConsensusQualityForT30 / QualityAgT30 / QualityMargin
 *   v8_walletConsensusStarBonus    (kept for legacy readers; always 0 in v6)
 *   v8_walletConsensusMuteTriggered / CancelTriggered / PromotionTriggered
 *   v8_walletConsensusBaseStars
 *   v8_vaultStar                   (two-factor Vault Star)
 *
 * Also reconciles side.health: picks whose stored mute/cancel reason is
 * a two-factor/whitelist tag that the current Δ no longer justifies are
 * flipped back to ACTIVE. Picks that should now be MUTED/CANCELLED per
 * v6 rules but aren't yet are updated accordingly.
 *
 * Usage:
 *   node scripts/backfillWalletConsensus.js                 # just today (ET)
 *   node scripts/backfillWalletConsensus.js 2026-04-22      # one date
 *   node scripts/backfillWalletConsensus.js 2026-04-20 2026-04-22  # range
 *   node scripts/backfillWalletConsensus.js --dry           # no writes
 *   node scripts/backfillWalletConsensus.js --all           # every date
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

// Lockstep with src/pages/SharpFlow.jsx.
const WHITELIST_CONSENSUS_VERSION = 6;
const QUALITY_CONTRIB_CUT = 30;
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
const ALL = flags.includes('--all');

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

const dates = ALL
  ? null
  : (args.length === 0
    ? [todayET()]
    : args.length === 1 ? [args[0]] : dateRange(args[0], args[1]));

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

// v6 two-factor Vault star — MUST match src/pages/SharpFlow.jsx.
function vaultStarFromDeltas(dw, dq) {
  if (dw >= 3 || (dw >= 2 && dq >= 1)) return 5.0;
  let base;
  if (dw <= -2) base = 1.0;
  else if (dw === -1) base = 1.5;
  else if (dw === 0) base = 2.5;
  else if (dw === 1) base = 3.5;
  else base = 4.5;
  let adj = 0;
  if (dq <= -2) adj = -1.0;
  else if (dq <= 0) adj = -0.5;
  else if (dq >= 3) adj = 0.5;
  return Math.max(1.0, Math.min(5.0, base + adj));
}

function computeWalletConsensus(walletDetails, sport, sideKey, profiles) {
  const cfg = WHITELIST_INTERVENTION[sport] || { bonus: false, mute: false, cancel: false, promote: false };
  const result = {
    forW: 0, agW: 0, delta: 0, verdict: 'NEUTRAL',
    qualityForT30: 0, qualityAgT30: 0, qualityMargin: 0,
    unitBonus: 0, lockAction: null, promotionEligible: false,
    enabled: !!WHITELIST_INTERVENTION[sport], sportConfig: cfg, sport,
  };
  if (!Array.isArray(walletDetails) || !sport || !sideKey) return result;

  // Δ_quality (whitelist-independent, contribution ≥ T30)
  let qFor = 0, qAg = 0;
  for (const d of walletDetails) {
    if ((d?.contribution ?? 0) < QUALITY_CONTRIB_CUT) continue;
    if (d.side === sideKey) qFor++;
    else if (d.side) qAg++;
  }
  result.qualityForT30 = qFor;
  result.qualityAgT30 = qAg;
  result.qualityMargin = qFor - qAg;

  // Δ_winner (whitelist-gated)
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

  // v6.3 lockAction — pure Δ-driven, lock-floor symmetric (mirrors SharpFlow.jsx)
  //   CANCEL: Δw ≤ −2
  //   MUTE:   Δw ≤ 0                (below lock floor on winner axis)
  //   MUTE:   Δw ≥ +1 AND Δq ≤ 0    (below lock floor on quality axis)
  //   PROMOTE: Δw ≥ +1 AND Δq ≥ +1  (Floor G)
  const dw = delta;
  const dq = result.qualityMargin;
  if (dw <= -2) {
    if (cfg.cancel) result.lockAction = 'CANCEL';
    else if (cfg.mute) result.lockAction = 'MUTE';
  } else if (dw <= 0) {
    if (cfg.mute) result.lockAction = 'MUTE';
  } else if (dq <= 0) {
    if (cfg.mute) result.lockAction = 'MUTE';
  } else if (dw >= 1 && dq >= 1 && cfg.promote) {
    result.promotionEligible = true;
  }
  return result;
}

function buildStampFields(wc, sport, baseStars, promotedBy) {
  const vaultStar = (wc.forW || wc.agW || wc.qualityMargin !== 0)
    ? vaultStarFromDeltas(wc.delta, wc.qualityMargin)
    : null;
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
    v8_walletConsensusPromotionTriggered: promotedBy === 'two-factor-floor' || promotedBy === 'whitelist',
    v8_walletConsensusBaseStars: baseStars || 0,
    v8_walletConsensusQualityForT30: wc.qualityForT30,
    v8_walletConsensusQualityAgT30: wc.qualityAgT30,
    v8_walletConsensusQualityMargin: wc.qualityMargin,
    v8_vaultStar: vaultStar,
  };
}

// Reconcile stored health against live Δ's.
// v6.3 engine — lock-floor symmetric. Returns { status, reasons } or null
// to keep stored as-is. Matches evaluatePickHealth in SharpFlow.jsx.
//
// v6.5 — adds an optional `commenceTime` (ms epoch). Inside the T-15 lock-in
// window, mute/cancel decisions are suppressed and any v6 mute is restored
// to ACTIVE so the play rides into kickoff at its peak recommendation.
function reconcileHealth(stored, wc, commenceTime = null) {
  const dw = wc.delta;
  const dq = wc.qualityMargin;
  const storedStatus = stored?.status || 'ACTIVE';
  const storedReasons = Array.isArray(stored?.reasons) ? stored.reasons : [];
  const TWO_FACTOR_REASONS = new Set(['winners_killed', 'winners_faded', 'winners_below_floor', 'quality_below_floor', 'quality_faded', 'whitelist_fade_weak', 'whitelist_fade_strong']);
  const onlyTwoFactor = storedReasons.length > 0 && storedReasons.every(r => TWO_FACTOR_REASONS.has(r));

  const minsToGame = commenceTime ? (commenceTime - Date.now()) / 60000 : null;
  const inLockInWindow = minsToGame != null && minsToGame <= 15;

  // v6.5 — lock-in window: restore v6 mutes to ACTIVE; do not initiate any
  // new mute/cancel. CANCELLED stays cancelled (those are confirmed kills).
  if (inLockInWindow) {
    if (storedStatus === 'MUTED' && onlyTwoFactor) {
      return { status: 'ACTIVE', reasons: [] };
    }
    return null;
  }

  // Rule 1: live Δw ≤ −2 → CANCELLED (winners_killed)
  if (dw <= -2) {
    if (storedStatus !== 'CANCELLED') return { status: 'CANCELLED', reasons: ['winners_killed'] };
    return null;
  }
  // Rule 2: live Δw = −1 → MUTED (winners_faded)
  if (dw === -1) {
    if (storedStatus !== 'MUTED' || !storedReasons.includes('winners_faded')) {
      return { status: 'MUTED', reasons: ['winners_faded'] };
    }
    return null;
  }
  // Rule 3: live Δw = 0 → MUTED (winners_below_floor) — v6.3
  if (dw === 0) {
    if (storedStatus !== 'MUTED' || !storedReasons.includes('winners_below_floor')) {
      return { status: 'MUTED', reasons: ['winners_below_floor'] };
    }
    return null;
  }
  // Rule 4: live Δw ≥ +1 AND Δq ≤ 0 → MUTED (quality_below_floor) — v6.3
  if (dw >= 1 && dq <= 0) {
    if (storedStatus !== 'MUTED' || !storedReasons.includes('quality_below_floor')) {
      return { status: 'MUTED', reasons: ['quality_below_floor'] };
    }
    return null;
  }
  // Rule 5: nothing triggers mute/cancel — if stored carries only two-factor
  // reasons, flip back to ACTIVE.
  if (storedStatus !== 'ACTIVE' && onlyTwoFactor) {
    return { status: 'ACTIVE', reasons: [] };
  }
  return null;
}

async function loadAllDates() {
  const allDates = new Set();
  for (const [col] of PICK_COLS) {
    const snap = await db.collection(col).select('date').get();
    for (const d of snap.docs) {
      const dt = d.data().date;
      if (dt) allDates.add(dt);
    }
  }
  return [...allDates].sort();
}

(async () => {
  console.log(`\nv6 Two-Factor wallet-consensus backfill${DRY ? ' (DRY RUN)' : ''}`);
  const runDates = ALL ? await loadAllDates() : dates;
  console.log(`Dates: ${runDates.length <= 10 ? runDates.join(', ') : `${runDates.length} dates (${runDates[0]} .. ${runDates[runDates.length - 1]})`}\n`);

  const profSnap = await db.collection('sharpWalletProfiles').get();
  const profiles = new Map();
  for (const d of profSnap.docs) profiles.set(d.id, d.data());
  console.log(`Loaded ${profiles.size} wallet profiles\n`);

  let total = 0, stampedNow = 0, skippedAlreadyFresh = 0, noDetails = 0;
  let healthChanged = 0;
  const strongFor = [], leanFor = [], fadeWeak = [], fadeStrong = [];

  for (const date of runDates) {
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

          const wc = computeWalletConsensus(wd, sport, sideKey, profiles);
          const promotedBy = side.promotedBy;
          const baseStars = peak?.stars || 0;
          const fields = buildStampFields(wc, sport, baseStars, promotedBy);

          const stored = side.health || null;
          // v6.5 — pass commenceTime so the T-15 lock-in window is honored
          // by the backfill too. doc.commenceTime is stored as ms epoch.
          const healthDelta = reconcileHealth(stored, wc, d.commenceTime ?? null);

          const stale = (side.v8_walletConsensusVersion ?? 0) < WHITELIST_CONSENSUS_VERSION;
          if (!stale && !healthDelta) { skippedAlreadyFresh++; continue; }

          if (wc.verdict === 'STRONG_FOR') strongFor.push({ col, id: doc.id, sideKey, sport, wc });
          else if (wc.verdict === 'LEAN_FOR') leanFor.push({ col, id: doc.id, sideKey, sport, wc });
          else if (wc.verdict === 'FADE_WEAK') fadeWeak.push({ col, id: doc.id, sideKey, sport, wc });
          else if (wc.verdict === 'FADE_STRONG') fadeStrong.push({ col, id: doc.id, sideKey, sport, wc });

          const payload = { sides: { [sideKey]: { ...fields } }, lastWriteAt: Date.now(), lastAction: 'consensus_backfill_v6' };
          if (healthDelta) {
            payload.sides[sideKey].health = healthDelta;
            healthChanged++;
          }
          if (!DRY) {
            await db.collection(col).doc(doc.id).set(payload, { merge: true });
          }
          stampedNow++;

          if (healthDelta || wc.verdict !== 'NEUTRAL') {
            console.log(`[${mkt}] ${doc.id}  side=${sideKey}  sport=${sport}  stars=${baseStars}  stage=${side.lockStage}  promotedBy=${promotedBy || '—'}`);
            console.log(`       Δw=${wc.delta >= 0 ? '+' : ''}${wc.delta} (forW=${wc.forW} agW=${wc.agW})  Δq=${wc.qualityMargin >= 0 ? '+' : ''}${wc.qualityMargin} (qFor=${wc.qualityForT30} qAg=${wc.qualityAgT30})  ${wc.verdict}  lockAction=${wc.lockAction || '—'}  vaultStar=${fields.v8_vaultStar ?? '—'}${healthDelta ? `  health→${healthDelta.status}` : ''}`);
          }
        }
      }
    }
  }

  console.log(`\n─── Summary ───`);
  console.log(`Total sides scanned:          ${total}`);
  console.log(`Had walletDetails:            ${total - noDetails}`);
  console.log(`Stamped${DRY ? ' (dry)' : ''}:${' '.repeat(DRY ? 19 : 24)}${stampedNow}`);
  console.log(`Health reconciled:            ${healthChanged}`);
  console.log(`Already fresh (skipped):      ${skippedAlreadyFresh}`);
  console.log(`No walletDetails (skipped):   ${noDetails}`);
  console.log(``);
  console.log(`STRONG_FOR:  ${strongFor.length}`);
  console.log(`LEAN_FOR:    ${leanFor.length}`);
  console.log(`FADE_WEAK:   ${fadeWeak.length}`);
  console.log(`FADE_STRONG: ${fadeStrong.length}`);

  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
