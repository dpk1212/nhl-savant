/**
 * syncPickStateAuthoritative.js — Server-side recompute of every today's
 * Sharp Intel pick on every fetch cycle.
 *
 * WHY: The browser-driven sync (src/pages/SharpFlow.jsx → syncPickHealth)
 * only fires when a tab is open and the computed status differs from the
 * last stamped value. If nobody opens the dashboard between a transient
 * mute and T-15 freeze, the bad state sticks. Audit (2026-05-01 slate) found
 * 7 of 15 LOCKED/LEAN sides in stale states.
 *
 * THIS SCRIPT runs in the GitHub Actions fetch loop every ~8 min, reads the
 * just-written JSON snapshots (same data the browser sees) plus
 * sharpWalletProfiles + sharpFlowPicks/Spreads/Totals from Firestore,
 * recomputes the canonical state for every pick side pre-T-15, and writes
 * back. Last-write-wins; the browser sync continues to write too — they
 * apply identical logic so they agree.
 *
 * BEHAVIOUR (the contract):
 *   • Every cycle is independent. Live consensus is recomputed from current
 *     sharp_action_positions; the canonical state is whatever the v7.4
 *     ladder says about *right now*. No hysteresis, no confirmation counts,
 *     no debouncing — if dw flipped to -2 this cycle, the pick is CANCELLED
 *     this cycle.
 *   • v7.4 — single floor display contract (post-2026-05-02 picks):
 *       LOCK iff HC_m ≥ +1  OR  (Σ ≥ 5 ∧ dw,dq ≥ +1).
 *     Anything else (including the v7.3 LEAN cohort and v6.6 Σ ∈ {3,4})
 *     gets lockStage='SHADOW' written back so the locked-list display gate
 *     hides them automatically. Recovery is instant: a SHADOW side that
 *     re-crosses the floor flips back to lockStage='LOCKED' the same cycle.
 *   • Status, lockTier, units, HC margin, and stamps are all free to flip
 *     in any direction (ACTIVE↔MUTED↔CANCELLED↔ACTIVE, SHADOW↔LOCKED↔ELITE,
 *     up or down on units) up until T-15. Cancel is *not* sticky pre-T-15.
 *   • HC rescue freshness re-evaluates every cycle: if a pick was promoted
 *     via v73-hc-rescue and live HC margin drops < +1 (with v6.6 floor
 *     failing), it demotes that same cycle. If HC recovers, it re-promotes.
 *   • Always restamps v8_walletConsensusVersion = 9 (kills the Lightning
 *     consVer=6 stuck-on-v6 bug seen in the 2026-05-01 audit).
 *
 * T-15 freeze is the ONLY gate. Once now >= commenceTime - 15 min, writes
 * are skipped so the doc state is a stable record at lock-in time. Same
 * window the browser uses, so client and server agree on the cutoff.
 *
 * Usage:
 *   node scripts/syncPickStateAuthoritative.js                    # today
 *   node scripts/syncPickStateAuthoritative.js --date=2026-05-02
 *   node scripts/syncPickStateAuthoritative.js --dry-run          # log only
 *   node scripts/syncPickStateAuthoritative.js --force            # bypass T-15
 *                                                                   freeze (one-shot
 *                                                                   fix for stuck
 *                                                                   post-freeze state)
 */

import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, '../public');

// ── Constants (mirror src/pages/SharpFlow.jsx — keep in sync) ───────────────
const HC_RATIO = 1.5;
const QUALITY_CONTRIB_CUT = 30;
const WHITELIST_CONSENSUS_VERSION = 9;
const V6_CUTOVER = '2026-04-18';
const V7_1_CUTOVER_DATE = '2026-04-30';
const V7_2_CUTOVER_DATE = '2026-04-30';
const V7_3_CUTOVER_DATE = '2026-04-30';
// v7.4 — single floor display contract. (HC_m ≥ +1) OR
// (Σ ≥ 5 ∧ dw,dq ≥ +1) → LOCKED. Anything else → SHADOW. dw ≤ -2 still
// CANCELS. LEAN tier eliminated entirely. Server cron writes lockStage
// every cycle so the doc state is always in lock-step with live data
// pre-T-15. HC route is GOLDEN STANDARD: HC margin alone passes the
// floor regardless of dw/dq (no money-split or quality-margin guards).
const V7_4_CUTOVER_DATE = '2026-05-02';
const V7_4_SIGMA_FLOOR = 5;
const V7_4_HC_MARGIN_FLOOR = 1;
const V7_4_ELITE_SIGMA = 7;

// v7.3 unit floors for HC-promoted sub-Σ-3 picks.
const V7_3_SIGMA1_LOCK_UNITS_ML = 0.5;
const V7_3_SIGMA2_LOCK_UNITS_ML = 0.5;
const V7_3_SIGMA1_LOCK_UNITS_ST = 0.5;
const V7_3_SIGMA2_LOCK_UNITS_ST = 0.5;
const V7_2_SIGMA2_LOCK_UNITS_ML = 0.5;
const V7_2_SIGMA2_LOCK_UNITS_ST = 0.5;

// HC margin multipliers + caps (v7.2).
const V7_2_HC_M1_MULT = 1.5;
const V7_2_HC_M2_MULT = 1.75;
const V7_2_HC_CAP_ML_ELITE = 4.5;
const V7_2_HC_CAP_ML_NON   = 3.5;
const V7_2_HC_CAP_ST_ELITE = 3.5;
const V7_2_HC_CAP_ST_NON   = 2.0;

// T-15 freeze window (matches browser).
const T_MINUS_15_MIN_MS = 15 * 60 * 1000;

// CLI args. --force is the only override; it bypasses the T-15 freeze for
// one-shot fixes of state that got stuck post-freeze in an old broken cycle.
const argv = process.argv.slice(2);
const DRY_RUN = argv.includes('--dry-run');
const FORCE = argv.includes('--force');
const dateArg = argv.find(a => a.startsWith('--date='));
const TARGET_DATE = dateArg ? dateArg.split('=')[1] : new Date().toISOString().slice(0, 10);

// ── Helpers (ported from SharpFlow.jsx) ─────────────────────────────────────
const isV71Eligible = (d) => d && d >= V7_1_CUTOVER_DATE;
const isV72Eligible = (d) => d && d >= V7_2_CUTOVER_DATE;
const isV73Eligible = (d) => d && d >= V7_3_CUTOVER_DATE;
const isV74Eligible = (d) => d && d >= V7_4_CUTOVER_DATE;

// v7.4 single-floor gate. Mirror of SharpFlow.jsx::meetsV74Floor.
//
// HC GOLDEN STANDARD (2026-05-02): HC margin ≥ +1 alone passes the floor —
// no dw/dq guards. A confirmed-tier proven winner sized at ≥1.5× their
// normal bet on this side, with zero confirmed sharps oversized on the
// other side, is the strongest single signal in the system. dw ≤ -2 still
// cancels through evaluateBaseHealth as a safety net.
function meetsV74Floor(dw, dq, hcMargin) {
  if (!Number.isFinite(dw) || !Number.isFinite(dq)) return false;
  const hc = Number.isFinite(hcMargin) ? hcMargin : 0;
  const sum = dw + dq;
  const hcRoute  = hc >= V7_4_HC_MARGIN_FLOOR;
  const sumRoute = dw >= 1 && dq >= 1 && sum >= V7_4_SIGMA_FLOOR;
  return hcRoute || sumRoute;
}

function vaultStarFromDeltas(dw, dq) {
  if (dw >= 1 && dq >= 1) {
    const sum = dw + dq;
    if (sum >= 6) return 5.0;
    if (sum === 5) return 4.5;
    if (sum === 4) return 4.0;
    if (sum === 3) return 3.5;
    return 2.5;
  }
  let base;
  if (dw <= -2) base = 1.0;
  else if (dw === -1) base = 1.5;
  else if (dw === 0) base = 2.5;
  else base = 3.0;
  let adj = 0;
  if (dq <= -2) adj = -0.5;
  else if (dq <= 0) adj = -0.25;
  return Math.max(1.0, Math.min(5.0, base + adj));
}

function lockTierFromDeltas(dw, dq, hcDominant, opts = {}) {
  if (!Number.isFinite(dw) || !Number.isFinite(dq)) return 'MUTED';
  const sum = dw + dq;
  const hcMargin = Number.isFinite(opts.hcMargin) ? opts.hcMargin : (hcDominant ? 1 : 0);
  const v73 = isV73Eligible(opts.pickDate);
  const v74 = isV74Eligible(opts.pickDate);
  if (v74) {
    if (sum >= V7_4_ELITE_SIGMA && dw >= 1 && dq >= 1) return 'ELITE';
    if (meetsV74Floor(dw, dq, hcMargin)) return 'LOCKED';
    return 'MUTED';
  }
  if (v73 && hcMargin >= 1 && dw >= 0 && dq >= 0 && sum >= 1) {
    if (sum >= 7) return 'ELITE';
    return 'LOCKED';
  }
  if (dw < 1 || dq < 1) return 'MUTED';
  if (sum === 2 && isV72Eligible(opts.pickDate)) {
    if (hcMargin >= 2) return 'LOCKED';
    if (hcMargin >= 1) return 'LEAN';
  }
  if (sum >= 7) return 'ELITE';
  if (sum >= 5) return 'LOCKED';
  if (sum >= 3) {
    if (isV72Eligible(opts.pickDate) && hcMargin >= 1) return 'LOCKED';
    return (isV71Eligible(opts.pickDate) && hcDominant) ? 'LOCKED' : 'LEAN';
  }
  return 'MUTED';
}

// Mirrors evaluatePickHealth's mute/cancel ladder (without the diagnostic-
// only flags that don't change status). v7.4 picks use Σ≥5 as the sum
// floor (was Σ≥3 under v6.6); HC route stays as is.
function evaluateBaseHealth({ dw, dq, hcMargin, pickDate }) {
  const v73HcOverride = isV73Eligible(pickDate) && hcMargin >= 1;
  const v74 = isV74Eligible(pickDate);
  const sumFloor = v74 ? V7_4_SIGMA_FLOOR : 3;
  if (dw <= -2) return { status: 'CANCELLED', reason: 'winners_killed' };
  if (dw === -1) return { status: 'MUTED', reason: 'winners_faded' };
  if (dw === 0 && !v73HcOverride) return { status: 'MUTED', reason: 'winners_below_floor' };
  if (dw >= 1 && dq <= 0 && !v73HcOverride) return { status: 'MUTED', reason: 'quality_below_floor' };
  if (dw >= 1 && dq >= 1 && (dw + dq) < sumFloor && !v73HcOverride) return { status: 'MUTED', reason: 'sum_below_floor' };
  if (v73HcOverride && (dw === 0 || dq <= 0 || (dw + dq) < sumFloor)) {
    return { status: 'ACTIVE', reason: 'v73_hc_rescue' };
  }
  return { status: 'ACTIVE', reason: null };
}

function calculateUnits(stars, lockTier, hcDominant, opts = {}) {
  if (lockTier === 'LEAN' || lockTier === 'MUTED') return 0;
  const v72 = isV72Eligible(opts.pickDate);
  const v73 = isV73Eligible(opts.pickDate);
  const hcMargin = Number.isFinite(opts.hcMargin) ? opts.hcMargin : (hcDominant ? 1 : 0);
  const sum = Number.isFinite(opts.sum) ? opts.sum : null;
  const odds = opts.odds;
  let units;
  if (lockTier === 'ELITE') units = 4.00;
  else if (stars >= 5.0) units = 3.00;
  else if (stars >= 4.5) units = 2.00;
  else if (stars >= 4.0) units = 1.25;
  else if (stars >= 3.5) units = 0.75;
  else if (lockTier === 'LOCKED' && v73 && hcMargin >= 1) {
    units = sum === 1 ? V7_3_SIGMA1_LOCK_UNITS_ML : V7_3_SIGMA2_LOCK_UNITS_ML;
  } else if (lockTier === 'LOCKED' && v72 && sum === 2 && hcMargin >= 2) {
    units = V7_2_SIGMA2_LOCK_UNITS_ML;
  } else units = 0;
  if (units === 0) return 0;
  if (odds != null && odds >= 200) units = Math.min(units, lockTier === 'ELITE' ? 1.0 : 0.5);
  else if (odds != null && odds >= 151) units = Math.min(units, lockTier === 'ELITE' ? 2.0 : 1.0);
  else if (odds != null && odds >= 100) units = Math.min(units, lockTier === 'ELITE' ? 3.0 : 2.0);
  if (v72 && hcMargin >= 2) {
    const cap = lockTier === 'ELITE' ? V7_2_HC_CAP_ML_ELITE : V7_2_HC_CAP_ML_NON;
    units = Math.min(units * V7_2_HC_M2_MULT, cap);
  } else if (v72 && hcMargin >= 1) {
    const cap = lockTier === 'ELITE' ? V7_2_HC_CAP_ML_ELITE : V7_2_HC_CAP_ML_NON;
    units = Math.min(units * V7_2_HC_M1_MULT, cap);
  }
  return Math.round(units * 100) / 100;
}

function calculateSpreadTotalUnits(stars, lockTier, hcDominant, opts = {}) {
  if (lockTier === 'LEAN' || lockTier === 'MUTED') return 0;
  const v72 = isV72Eligible(opts.pickDate);
  const v73 = isV73Eligible(opts.pickDate);
  const hcMargin = Number.isFinite(opts.hcMargin) ? opts.hcMargin : (hcDominant ? 1 : 0);
  const sum = Number.isFinite(opts.sum) ? opts.sum : null;
  const odds = opts.odds;
  let units;
  if (lockTier === 'ELITE') units = 2.50;
  else if (stars >= 5.0) units = 2.00;
  else if (stars >= 4.5) units = 1.50;
  else if (stars >= 4.0) units = 0.75;
  else if (stars >= 3.5) units = 0.50;
  else if (lockTier === 'LOCKED' && v73 && hcMargin >= 1) {
    units = sum === 1 ? V7_3_SIGMA1_LOCK_UNITS_ST : V7_3_SIGMA2_LOCK_UNITS_ST;
  } else if (lockTier === 'LOCKED' && v72 && sum === 2 && hcMargin >= 2) {
    units = V7_2_SIGMA2_LOCK_UNITS_ST;
  } else units = 0;
  if (units === 0) return 0;
  if (odds != null && odds >= 200) units = Math.min(units, lockTier === 'ELITE' ? 0.75 : 0.5);
  else if (odds != null && odds >= 151) units = Math.min(units, lockTier === 'ELITE' ? 1.25 : 0.75);
  else if (odds != null && odds >= 100) units = Math.min(units, lockTier === 'ELITE' ? 1.75 : 1.0);
  if (v72 && hcMargin >= 2) {
    const cap = lockTier === 'ELITE' ? V7_2_HC_CAP_ST_ELITE : V7_2_HC_CAP_ST_NON;
    units = Math.min(units * V7_2_HC_M2_MULT, cap);
  } else if (v72 && hcMargin >= 1) {
    const cap = lockTier === 'ELITE' ? V7_2_HC_CAP_ST_ELITE : V7_2_HC_CAP_ST_NON;
    units = Math.min(units * V7_2_HC_M1_MULT, cap);
  }
  return Math.round(units * 100) / 100;
}

// ── Wallet consensus reconstruction (mirrors UI computeWalletConsensus) ─────
function dedupBySide(positions) {
  const m = new Map();
  for (const p of positions) {
    if (!p.wallet || !p.side) continue;
    const k = `${String(p.wallet).toLowerCase()}|${p.side}`;
    const cur = m.get(k);
    if (!cur || (p.invested || 0) > (cur.invested || 0)) m.set(k, p);
  }
  return [...m.values()];
}

function computeWalletConsensus(rawPositions, mySide, sport, walletProfiles) {
  const out = {
    forW: 0, agW: 0, delta: 0,
    qualityForT30: 0, qualityAgT30: 0, qualityMargin: 0,
    hcConfFor: 0, hcConfAg: 0, hcDominant: false, hcMargin: 0,
  };
  if (!Array.isArray(rawPositions) || !mySide || !sport) return out;
  const positions = dedupBySide(rawPositions);
  let qFor = 0, qAg = 0, forW = 0, agW = 0, hcF = 0, hcA = 0;
  for (const p of positions) {
    const short = String(p.walletShort || p.wallet || '').slice(-6).toLowerCase();
    const profile = walletProfiles.get(short) || walletProfiles.get(short.toUpperCase());
    const tier = profile?.bySport?.[sport]?.whitelistTier || null;
    const sr = p.v8_sizeRatio != null
      ? p.v8_sizeRatio
      : (p.avgSportBet > 0 ? (p.invested || 0) / p.avgSportBet : 0);
    const c = p.v8_walletContribution ?? 0;
    if (c >= QUALITY_CONTRIB_CUT) {
      if (p.side === mySide) qFor++;
      else if (p.side) qAg++;
    }
    if (tier === 'CONFIRMED' || tier === 'FLAT') {
      if (p.side === mySide) forW++;
      else if (p.side) agW++;
    }
    if (tier === 'CONFIRMED' && sr >= HC_RATIO) {
      if (p.side === mySide) hcF++;
      else if (p.side) hcA++;
    }
  }
  out.forW = forW;
  out.agW = agW;
  out.delta = forW - agW;
  out.qualityForT30 = qFor;
  out.qualityAgT30 = qAg;
  out.qualityMargin = qFor - qAg;
  out.hcConfFor = hcF;
  out.hcConfAg = hcA;
  out.hcMargin = hcF - hcA;
  out.hcDominant = hcF >= 1 && hcA === 0;
  return out;
}

// ── Firebase init ──────────────────────────────────────────────────────────
function initFirebase() {
  if (!admin.apps.length) {
    const sakPath = join(__dirname, '..', 'serviceAccountKey.json');
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
  db.settings({ ignoreUndefinedProperties: true });
  return db;
}

// ── Build position groups from sharp_action_positions for today ────────────
function buildPositionGroupsFromFirestore(positions) {
  const groups = new Map();
  for (const p of positions) {
    const k = `${p.sport}|${p.gameKey}|${p.marketType}`;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(p);
  }
  return groups;
}

// ── Main sync logic per side ───────────────────────────────────────────────
function reconcileSide({ sd, side, pick, mkt, group, walletProfiles, now, force }) {
  const pickDate = pick.date || TARGET_DATE;
  const sport = pick.sport;
  const lockStage = sd.lockStage || null;
  const currentStatus = sd.health?.status || sd.status || pick.status || null;
  const v74 = isV74Eligible(pickDate);

  // Gate: SHADOW sides are usually skipped (they're not shipping money).
  // But under v7.4 we ALSO process SHADOW sides that have prior lock data,
  // so a recovered pick can re-promote LOCKED → SHADOW → LOCKED in lock-step
  // with live data each cycle (pre-T-15).
  const isReprommotable = v74 && lockStage === 'SHADOW' && (sd.lock || sd.peak);
  if (lockStage !== 'LOCKED' && lockStage !== 'LEAN' && !isReprommotable) {
    return { skipped: true, reason: 'not_locked_or_lean' };
  }
  // Gate: never touch graded/completed picks.
  if (pick.status === 'COMPLETED' || currentStatus === 'COMPLETED') {
    return { skipped: true, reason: 'completed' };
  }
  // Gate: T-15 freeze. Once we're inside 15 min of commenceTime the doc is
  // a record of what was true at lock-in time and never moves again. --force
  // overrides for one-shot stuck-state repairs only.
  let ct = null;
  if (pick.commenceTime != null) {
    if (typeof pick.commenceTime === 'number') ct = pick.commenceTime;
    else if (pick.commenceTime?.toMillis) ct = pick.commenceTime.toMillis();
    else if (pick.commenceTime?._seconds) ct = pick.commenceTime._seconds * 1000;
    else if (pick.commenceTime instanceof Date) ct = pick.commenceTime.getTime();
    else if (typeof pick.commenceTime === 'string') ct = new Date(pick.commenceTime).getTime();
  }
  if (ct != null && now >= ct - T_MINUS_15_MIN_MS && !force) {
    return { skipped: true, reason: 'within_t_minus_15' };
  }

  // Reconstruct live consensus.
  const live = computeWalletConsensus(group, side, sport, walletProfiles);
  const baseHealth = evaluateBaseHealth({
    dw: live.delta,
    dq: live.qualityMargin,
    hcMargin: live.hcMargin,
    pickDate,
  });

  // No hysteresis. Whatever evaluateBaseHealth says this cycle is what we
  // write. dw <= -2 cancels immediately. ACTIVE↔MUTED↔CANCELLED↔ACTIVE all
  // free to flip in any direction every 8 min until T-15.
  let appliedStatus = baseHealth.status;
  let appliedReason = baseHealth.reason;

  // HC rescue freshness — re-evaluated every cycle. If the pick was lock-in
  // promoted via v73-hc-rescue and live HC margin has dropped below +1 with
  // the v6.6 floor failing, demote to MUTED this cycle (UI shows "RESCUE
  // EXPIRED"). If HC recovers next cycle, baseHealth.reason==='v73_hc_rescue'
  // and the pick re-promotes to ACTIVE automatically.
  const promotedBy = sd.promotedBy || null;
  let hcRescueDemoted = false;
  if (promotedBy === 'v73-hc-rescue' && live.hcMargin < 1
      && (live.delta === 0 || live.qualityMargin <= 0 || (live.delta + live.qualityMargin) < 3)
      && live.delta > -2) {
    appliedStatus = 'MUTED';
    appliedReason = 'v73_hc_rescue_expired';
    hcRescueDemoted = true;
  }

  // Compute live tier / units.
  const liveStars = vaultStarFromDeltas(live.delta, live.qualityMargin);
  const liveTier = lockTierFromDeltas(live.delta, live.qualityMargin, live.hcDominant, {
    pickDate, hcMargin: live.hcMargin,
  });
  const liveLadder = (mkt === 'SPREAD' || mkt === 'TOTAL') ? calculateSpreadTotalUnits : calculateUnits;
  const liveUnits = liveLadder(liveStars, liveTier, live.hcDominant, {
    pickDate, hcMargin: live.hcMargin, sum: live.delta + live.qualityMargin,
    odds: sd.peak?.odds ?? sd.lock?.odds ?? null,
  });

  // ─── v7.4 lockStage promote/demote ────────────────────────────────────
  // Single-floor display contract. Every cycle, recompute whether the pick
  // currently passes (HC ≥ +1 OR Σ ≥ 5 with positive axes). If yes →
  // lockStage='LOCKED'. If no → lockStage='SHADOW' (hidden). If dw ≤ -2 →
  // also flip to SHADOW (the CANCELLED health flag keeps it surfaceable
  // via the "Show cancelled" toggle).
  let appliedLockStage = lockStage;
  let lockStageReason = null;
  if (v74) {
    const passesFloor = meetsV74Floor(live.delta, live.qualityMargin, live.hcMargin);
    if (passesFloor) {
      if (lockStage !== 'LOCKED') {
        appliedLockStage = 'LOCKED';
        lockStageReason = 'v74_floor_recovered';
      } else {
        appliedLockStage = 'LOCKED';
      }
    } else {
      if (lockStage !== 'SHADOW') {
        appliedLockStage = 'SHADOW';
        lockStageReason = appliedStatus === 'CANCELLED' ? 'v74_cancelled' : 'v74_below_floor';
      } else {
        appliedLockStage = 'SHADOW';
      }
    }
  }

  // What the doc currently has stamped (so we can detect a real change).
  const stampedStatus = sd.health?.status || null;
  const stampedTier = sd.v8_lockTier || null;
  const stampedDw = sd.v8_walletConsensusDelta;
  const stampedDq = sd.v8_walletConsensusQualityMargin;
  const stampedHc = sd.v8_hcMargin;
  const stampedConsVer = sd.v8_walletConsensusVersion;
  const stampedLockStage = sd.lockStage || null;

  // Build the patch — only write fields that actually changed (or stale).
  const patch = {};
  let wroteAnything = false;
  const changes = [];

  // Health status / reasons — always overwritten with the current cycle's
  // truth. UI reads `health.status` to decide lock display state.
  const reasons = [];
  if (appliedReason) reasons.push(appliedReason);
  // Preserve diagnostic-only badge signals from prior cycles (they don't
  // change status but the UI uses them for chip rendering).
  if (sd.health?.reasons) {
    for (const r of sd.health.reasons) {
      if (['wps_flipped_diag', 'opp_side_stronger_diag'].includes(r) && !reasons.includes(r)) {
        reasons.push(r);
      }
    }
  }
  patch.health = {
    status: appliedStatus,
    reasons,
    currentStars: liveStars,
    walletDelta: live.delta,
    qualityMargin: live.qualityMargin,
    hcMargin: live.hcMargin,
    evaluatedAt: now,
    syncedBy: 'server-cron',
  };
  if (stampedStatus !== appliedStatus) {
    changes.push(`status: ${stampedStatus || '∅'} → ${appliedStatus}`);
  }

  // Strip any leftover hysteresis counter from older script versions so the
  // doc shape stays clean.
  if (sd.cancelConfirmCount != null) {
    patch.cancelConfirmCount = admin.firestore.FieldValue.delete();
  }

  // v8_walletConsensusVersion + delta + quality + HC restamp.
  // Always restamp on every cycle — keeps Firestore in lock-step with live.
  patch.v8_walletConsensusVersion = WHITELIST_CONSENSUS_VERSION;
  patch.v8_walletConsensusForW = live.forW;
  patch.v8_walletConsensusAgW = live.agW;
  patch.v8_walletConsensusDelta = live.delta;
  patch.v8_walletConsensusQualityForT30 = live.qualityForT30;
  patch.v8_walletConsensusQualityAgT30 = live.qualityAgT30;
  patch.v8_walletConsensusQualityMargin = live.qualityMargin;
  patch.v8_hcConfFor = live.hcConfFor;
  patch.v8_hcConfAg = live.hcConfAg;
  patch.v8_hcMargin = live.hcMargin;
  patch.v8_hcDominant = live.hcDominant;
  patch.v8_lockTier = liveTier;
  patch.v8_v73HcRescue = isV73Eligible(pickDate) && live.hcMargin >= 1
    && (live.delta === 0 || live.qualityMargin <= 0 || (live.delta + live.qualityMargin) < 3)
    && live.delta >= 0 && live.qualityMargin >= 0;

  // v7.4 — write canonical lockStage every cycle for v7.4 picks.
  if (v74) {
    patch.lockStage = appliedLockStage;
    if (lockStageReason) {
      patch.lockStageLastChange = { reason: lockStageReason, at: now, dw: live.delta, dq: live.qualityMargin, hcMargin: live.hcMargin };
    }
    if (stampedLockStage !== appliedLockStage) {
      changes.push(`lockStage: ${stampedLockStage || '∅'} → ${appliedLockStage}${lockStageReason ? ` (${lockStageReason})` : ''}`);
    }
  }

  if (stampedConsVer !== WHITELIST_CONSENSUS_VERSION) {
    changes.push(`consVer: ${stampedConsVer ?? '∅'} → ${WHITELIST_CONSENSUS_VERSION}`);
  }
  if (stampedDw !== live.delta) changes.push(`dw: ${stampedDw ?? '∅'} → ${live.delta}`);
  if (stampedDq !== live.qualityMargin) changes.push(`dq: ${stampedDq ?? '∅'} → ${live.qualityMargin}`);
  if (stampedHc !== live.hcMargin) changes.push(`HC_m: ${stampedHc ?? '∅'} → ${live.hcMargin}`);
  if (stampedTier && stampedTier !== liveTier) changes.push(`tier: ${stampedTier} → ${liveTier}`);

  wroteAnything = changes.length > 0 || stampedStatus !== appliedStatus;

  return {
    skipped: false,
    wrote: wroteAnything,
    patch,
    changes,
    live,
    expectedStatus: appliedStatus,
    expectedReason: appliedReason,
    expectedTier: liveTier,
    expectedUnits: liveUnits,
    expectedLockStage: appliedLockStage,
    lockStageReason,
    hcRescueDemoted,
    v74Demoted: v74 && stampedLockStage === 'LOCKED' && appliedLockStage === 'SHADOW',
    v74Promoted: v74 && stampedLockStage === 'SHADOW' && appliedLockStage === 'LOCKED',
  };
}

async function main() {
  const db = initFirebase();
  const now = Date.now();
  console.log(`\n=== syncPickStateAuthoritative — ${TARGET_DATE} ===`);
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no writes)' : 'WRITE'}${FORCE ? ' · FORCE (bypass T-15)' : ''}`);
  console.log(`now=${new Date(now).toISOString()}\n`);

  // Load wallet profiles.
  const walletProfiles = new Map();
  const profilesSnap = await db.collection('sharpWalletProfiles').get();
  profilesSnap.forEach(d => walletProfiles.set(d.id.toLowerCase(), d.data()));
  console.log(`Loaded ${walletProfiles.size} sharpWalletProfiles`);

  // Load today's positions (live wallet activity) from Firestore.
  // (Could also read from public/sharp_positions.json but Firestore stays
  // closer to truth post-writeSharpActions.)
  const posSnap = await db.collection('sharp_action_positions')
    .where('date', '==', TARGET_DATE)
    .get();
  const positions = [];
  posSnap.forEach(d => positions.push({ _id: d.id, ...d.data() }));
  const groups = buildPositionGroupsFromFirestore(positions);
  console.log(`Loaded ${positions.length} sharp_action_positions in ${groups.size} game-market clusters`);

  // Load today's pick docs.
  const collections = ['sharpFlowPicks', 'sharpFlowSpreads', 'sharpFlowTotals'];
  const collectionWrites = new Map(); // colName → [{ docId, sideKey, patch }]
  const stats = {
    examined: 0,
    skipped_not_locked: 0,
    skipped_completed: 0,
    skipped_t15: 0,
    wrote: 0,
    hc_rescue_demoted: 0,
    status_changes: 0,
    v74_demoted_to_shadow: 0,
    v74_promoted_to_locked: 0,
    no_change: 0,
  };
  const changeLog = [];

  for (const col of collections) {
    const snap = await db.collection(col).where('date', '==', TARGET_DATE).get();
    for (const docSnap of snap.docs) {
      const pick = { _id: docSnap.id, ...docSnap.data() };
      const mkt = col === 'sharpFlowSpreads' ? 'SPREAD' : col === 'sharpFlowTotals' ? 'TOTAL' : 'ML';
      const sides = pick.sides || {};
      for (const [sideKey, sd] of Object.entries(sides)) {
        if (!sd) continue;
        stats.examined++;
        const groupKey = `${pick.sport}|${pick.gameKey}|${mkt}`;
        const group = groups.get(groupKey) || [];
        const result = reconcileSide({
          sd, side: sideKey, pick, mkt, group, walletProfiles, now,
          force: FORCE,
        });
        if (result.skipped) {
          if (result.reason === 'not_locked_or_lean') stats.skipped_not_locked++;
          else if (result.reason === 'completed') stats.skipped_completed++;
          else if (result.reason === 'within_t_minus_15') stats.skipped_t15++;
          continue;
        }
        if (!result.wrote) {
          stats.no_change++;
          continue;
        }
        if (result.hcRescueDemoted) stats.hc_rescue_demoted++;
        if (result.v74Demoted) stats.v74_demoted_to_shadow++;
        if (result.v74Promoted) stats.v74_promoted_to_locked++;
        if (result.changes.some(c => c.startsWith('status:'))) stats.status_changes++;
        stats.wrote++;
        changeLog.push({
          col, docId: pick._id, side: sideKey, sport: pick.sport,
          team: sd.peak?.team || (sideKey === 'away' ? pick.away : sideKey === 'home' ? pick.home : sideKey),
          changes: result.changes,
          live: result.live,
          expectedLockStage: result.expectedLockStage,
          expected: { status: result.expectedStatus, reason: result.expectedReason, tier: result.expectedTier, units: result.expectedUnits },
        });
        // Build write payload — always merge: true on the side.
        if (!collectionWrites.has(col)) collectionWrites.set(col, []);
        collectionWrites.get(col).push({
          docId: pick._id,
          payload: {
            sides: { [sideKey]: result.patch },
            lastSyncAt: now,
          },
        });
      }
    }
  }

  // Print change log.
  console.log(`\n── Per-side changes ──`);
  if (changeLog.length === 0) {
    console.log(`  (no changes — every pick already in canonical state)`);
  }
  for (const c of changeLog) {
    console.log(`\n${c.sport} ${c.col.replace('sharpFlow', '').toUpperCase()} ${c.team} (${c.docId} / ${c.side})`);
    console.log(`  Live:     dw=${c.live.delta} dq=${c.live.qualityMargin} HC_m=${c.live.hcMargin} (HC ${c.live.hcConfFor}/${c.live.hcConfAg})`);
    console.log(`  Expected: lockStage=${c.expectedLockStage || '∅'} · status=${c.expected.status}${c.expected.reason ? ` · ${c.expected.reason}` : ''} tier=${c.expected.tier} units=${c.expected.units}`);
    console.log(`  Changes:  ${c.changes.join(', ')}`);
  }

  // Apply writes (unless dry run). Merge per-side patches into a single
  // payload per docId — Firestore batches keep only the LAST set() on a
  // given ref, so two sides of the same pick (home + away) would clobber
  // each other unless we coalesce up front.
  if (!DRY_RUN) {
    for (const [col, writes] of collectionWrites) {
      const merged = new Map(); // docId → coalesced payload
      for (const w of writes) {
        const cur = merged.get(w.docId) || { sides: {}, lastSyncAt: 0 };
        Object.assign(cur.sides, w.payload.sides || {});
        if ((w.payload.lastSyncAt || 0) > cur.lastSyncAt) cur.lastSyncAt = w.payload.lastSyncAt;
        merged.set(w.docId, cur);
      }
      const docPayloads = [...merged.entries()].map(([docId, payload]) => ({ docId, payload }));
      const BATCH_SIZE = 400;
      for (let i = 0; i < docPayloads.length; i += BATCH_SIZE) {
        const chunk = docPayloads.slice(i, i + BATCH_SIZE);
        const batch = db.batch();
        for (const w of chunk) {
          const ref = db.collection(col).doc(w.docId);
          batch.set(ref, w.payload, { merge: true });
        }
        await batch.commit();
      }
      const sideCount = writes.length;
      const docCount = docPayloads.length;
      console.log(`\nWrote ${sideCount} side(s) across ${docCount} doc(s) to ${col}`);
    }
  }

  console.log(`\n── Summary ──`);
  console.log(`  Sides examined:           ${stats.examined}`);
  console.log(`  Skipped (not locked/lean):${stats.skipped_not_locked}`);
  console.log(`  Skipped (completed):      ${stats.skipped_completed}`);
  console.log(`  Skipped (T-15 freeze):    ${stats.skipped_t15}`);
  console.log(`  No change needed:         ${stats.no_change}`);
  console.log(`  Wrote canonical state:    ${stats.wrote}`);
  console.log(`    of which status flips:  ${stats.status_changes}`);
  console.log(`    HC rescue demoted:      ${stats.hc_rescue_demoted}`);
  console.log(`    v7.4 → SHADOW (hidden): ${stats.v74_demoted_to_shadow}`);
  console.log(`    v7.4 → LOCKED (shown):  ${stats.v74_promoted_to_locked}`);
  console.log(`\n${DRY_RUN ? '[DRY RUN] No writes performed.' : 'Done.'}\n`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
