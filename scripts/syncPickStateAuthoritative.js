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

import {
  AGS_FALLBACK_CALIBRATION,
  AGS_MIN_PROVEN_WALLETS,
  AGS_V12_FALLBACK_CALIBRATION,
  HC_RATIO,
  HC_MINI_FLOOR,
  aggregateSideProven,
  aggregateSideV12,
  agsSizeMultiplier,
  agsTierFromValue,
  agsV12HcStake,
  agsV12SizeMultiplier,
  agsV12TierFromValue,
  computeAgs,
  computeAgsFromPositions,
  computeAgsV12,
  meetsAgsHardMute,
  meetsAgsLockFloor,
  positionToWalletDetail,
} from '../src/lib/ags.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, '../public');

// ── Constants ───────────────────────────────────────────────────────────────
// AGS-Unified v9 — every gate (lock, mute, tier, sizing) reads ONLY from the
// AGS-U composite + calibration quintiles. The legacy v7.x routes (HC margin,
// Δw≥2, Δw=1+AGS, ags-rescue, Σ-floor, etc.) and their per-version cutover
// constants are gone. The 5 features driving AGS-U live in src/lib/ags.js;
// see that file for design rationale + holdout backtest evidence.
const QUALITY_CONTRIB_CUT = 30;
const WHITELIST_CONSENSUS_VERSION = 9;

// Base unit sizing per market (multiplied by agsSizeMultiplier(ags) to get
// final units). These are the LOCK-tier (q60..q80) defaults; ELITE/PREMIUM
// scale up via the multiplier (≥ q90 → 2.00×, ≥ q80 → 1.50×) and
// LEAN/WEAK scale down (≥ q40 → 0.50×, ≥ q20 → 0.20×, < q20 → 0).
const BASE_UNITS_ML            = 2.50;
const BASE_UNITS_SPREAD_TOTAL  = 1.50;

// Odds caps — never bet too much on a long underdog (size relative to
// expected drawdown matters more than EV alone). Applied after AGS sizing.
function oddsCap(units, odds) {
  if (!Number.isFinite(odds)) return units;
  if (odds >= 200) return Math.min(units, 1.0);
  if (odds >= 151) return Math.min(units, 1.5);
  if (odds >= 100) return Math.min(units, 2.5);
  return units;
}

// T-15 freeze window (matches browser).
const T_MINUS_15_MIN_MS = 15 * 60 * 1000;

// CLI args. --force is the only override; it bypasses the T-15 freeze for
// one-shot fixes of state that got stuck post-freeze in an old broken cycle.
const argv = process.argv.slice(2);
const DRY_RUN = argv.includes('--dry-run');
const FORCE = argv.includes('--force');
const dateArg = argv.find(a => a.startsWith('--date='));
// ET date — picks/positions are date-tagged in America/New_York, not UTC.
// Without this, after ~8 PM ET we'd target tomorrow's date and find no
// positions (positions are still being written under today's ET date).
const TARGET_DATE = dateArg
  ? dateArg.split('=')[1]
  : new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });

// ── AGS-Unified v9 helpers ─────────────────────────────────────────────────
// Every helper here reads ONLY the AGS-U composite + calibration. Δw,
// HC margin, and Δq are computed for diagnostic stamping (so the v6
// daily report can still slice cohorts by them) but they are never
// consulted to make a lock/mute/sizing decision.

// Stars from AGS-U value — quintile-based, monotone with composite.
//   ≥ q90 → 5.0   (ELITE)
//   ≥ q80 → 4.5   (PREMIUM)
//   ≥ q60 → 4.0   (LOCK)
//   ≥ q40 → 3.0   (LEAN)
//   ≥ q20 → 2.5   (WEAK)
//   <  q20 → 1.0  (FADE)
function starsFromAgs(ags, calibration) {
  if (ags == null || !Number.isFinite(ags)) return 1.0;
  const q = (calibration && calibration.quintiles) ? calibration.quintiles : AGS_FALLBACK_CALIBRATION.quintiles;
  if (ags >= q.q90) return 5.0;
  if (ags >= q.q80) return 4.5;
  if (ags >= q.q60) return 4.0;
  if (ags >= q.q40) return 3.0;
  if (ags >= q.q20) return 2.5;
  return 1.0;
}

// v12 stars from tier label. Tier already encodes the quintile band so we
// don't need to re-quintize the raw score. Tier names match v11 vocabulary
// (ELITE/PREMIUM/LOCK/LEAN/WEAK/FADE) — semantics changed but labels stable.
//   ELITE   → 5.0
//   PREMIUM → 4.5
//   LOCK    → 4.0
//   LEAN    → 3.0
//   WEAK    → 2.5
//   FADE    → 1.0
function starsFromTierV12(tier) {
  switch (tier) {
    case 'ELITE': return 5.0;
    case 'PREMIUM': return 4.5;
    case 'LOCK': return 4.0;
    case 'LEAN': return 3.0;
    case 'WEAK': return 2.5;
    case 'FADE':
    default: return 1.0;
  }
}

// Lock tier from AGS-U value. Wraps src/lib/ags::agsTierFromValue so the
// label and cutoffs stay in lockstep with the client. Six tiers map 1:1 to
// the agsSizeMultiplier sizing bands.
function lockTierFromAgs(ags, calibration) {
  return agsTierFromValue(ags, calibration);
}

// Health status from AGS-U value.
//   AGS-U missing                       → MUTED  (no_ags_signal)
//   < AGS_MIN_PROVEN_WALLETS proven     → MUTED  (insufficient_proven_wallets)
//   < q20 (calibrated hard mute floor)  → MUTED  (ags_hard_mute, "FADE" tier)
//   else                                → ACTIVE
//
// No CANCELLED state — the legacy `winners_killed` (Δw ≤ -2) was a proxy
// for "the proven-wallet stack overwhelmingly opposes this side", which
// AGS-U captures directly (any pick with strongly opposing wallets has
// AGS-U ≪ q20 and trips the hard mute). One signal, one decision.
function evaluateBaseHealth({ ags, agsProvenTotal, calibration }) {
  if (ags == null || !Number.isFinite(ags)) {
    return { status: 'MUTED', reason: 'no_ags_signal' };
  }
  if (Number.isFinite(agsProvenTotal) && agsProvenTotal < AGS_MIN_PROVEN_WALLETS) {
    return { status: 'MUTED', reason: 'insufficient_proven_wallets' };
  }
  if (meetsAgsHardMute(ags, calibration)) {
    return { status: 'MUTED', reason: 'ags_hard_mute' };
  }
  return { status: 'ACTIVE', reason: null };
}

// Sizing — base × AGS-U sizing multiplier × odds cap.
// AGS-U < q20 returns 0 via agsSizeMultiplier (HARD MUTE).
// Same formula for ML, SPREAD, TOTAL — only the base differs.
// v11 path — preserved for reference/shadow stamps only. v12 is now
// authoritative for finalUnits (see unitsFromAgsV12 below).
function unitsFromAgs(ags, marketType, odds, calibration) {
  if (ags == null || !Number.isFinite(ags)) return 0;
  const m = agsSizeMultiplier(ags, calibration);
  if (m === 0) return 0;
  const base = (marketType === 'SPREAD' || marketType === 'TOTAL')
    ? BASE_UNITS_SPREAD_TOTAL
    : BASE_UNITS_ML;
  const capped = oddsCap(base * m, odds);
  return Math.round(capped * 100) / 100;
}

// v12 sizing — agsV12SizeMultiplier returns ABSOLUTE units (the ladder is
// the answer, not a multiplier on top of a per-market base). Mute rule:
// score ≤ 0 → 0. Ladder: 0.25/0.50/1.00/3.00/5.00 for SMALL/LEAN/LOCK/
// PREMIUM/ELITE. Same odds-cap as v11 so long underdogs don't get sized up.
function unitsFromAgsV12(scoreV12, odds, calibration) {
  if (scoreV12 == null || !Number.isFinite(scoreV12) || scoreV12 <= 0) return 0;
  const units = agsV12SizeMultiplier(scoreV12, calibration);
  if (units === 0) return 0;
  const capped = oddsCap(units, odds);
  return Math.round(capped * 100) / 100;
}

// ── AGS-Unified v12.1 — HC-margin staking cutover ───────────────────────────
// V12 still SELECTS the side (score > 0). From this date forward the STAKE +
// display tier come from the HC margin (see agsV12HcStake in src/lib/ags.js):
//   margin 2 → SUPER 6u, margin 1 → TOP 4u, margin ≥3 → CONFIRMED 1u,
//   non-HC or WEAK-tier HC → MONITORING 0u (visible, never staked).
// Picks dated before this keep their score-quintile ladder so the dashboard
// can split the eras cleanly (history is never rewritten).
const V12_1_EFFECTIVE_FROM = '2026-06-15';
function isV121Eligible(pickDate) {
  if (!pickDate || typeof pickDate !== 'string') return false;
  // ISO YYYY-MM-DD strings compare lexicographically == chronologically.
  return pickDate >= V12_1_EFFECTIVE_FROM;
}

// v12.1 sizing — derive { stakeTier, units } from the HC margin via
// agsV12HcStake, then apply the same odds cap as the score ladder. MONITORING
// and FADE return 0u. Returns post-cap, rounded units alongside the stake tier.
function hcStakeFromV12({ scoreV12, scoreTier, hcMargin, miniHcMargin, odds, calibration }) {
  const { stakeTier, unitsRaw } = agsV12HcStake({
    score: scoreV12,
    scoreTier,
    hcMargin,
    miniHcMargin,
    calibration,
  });
  if (!unitsRaw) return { stakeTier, units: 0 };
  const capped = oddsCap(unitsRaw, odds);
  return { stakeTier, units: Math.round(capped * 100) / 100 };
}

// v12 health — score ≤ 0 is MUTED by rule (no separate calibrated mute
// floor; the mute IS the rule). Active otherwise.
function evaluateBaseHealthV12({ scoreV12 }) {
  if (scoreV12 == null || !Number.isFinite(scoreV12)) {
    return { status: 'MUTED', reason: 'no_agsv12_signal' };
  }
  if (scoreV12 <= 0) {
    return { status: 'MUTED', reason: 'agsv12_mute_below_zero' };
  }
  return { status: 'ACTIVE', reason: null };
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
    miniHcConfFor: 0, miniHcConfAg: 0, miniHcMargin: 0,
  };
  if (!Array.isArray(rawPositions) || !mySide || !sport) return out;
  const positions = dedupBySide(rawPositions);
  let qFor = 0, qAg = 0, forW = 0, agW = 0, hcF = 0, hcA = 0, mhcF = 0, mhcA = 0;
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
    } else if (tier === 'CONFIRMED' && sr >= HC_MINI_FLOOR) {
      // Mini-HC band: CONFIRMED + sized HC_MINI_FLOOR ≤ sizeRatio < HC_RATIO.
      if (p.side === mySide) mhcF++;
      else if (p.side) mhcA++;
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
  out.miniHcConfFor = mhcF;
  out.miniHcConfAg = mhcA;
  out.miniHcMargin = mhcF - mhcA;
  return out;
}

// ── AGS calibration + per-wallet tier lookup ────────────────────────────────
// Loaded once per main() invocation. Writes back nothing — purely a read of
// the calibration doc the daily cron maintains. Falls back to the
// hardcoded last-known-good values in src/lib/ags.js if Firestore is empty
// (cold start, cron failure, etc.) so AGS computation never blocks the
// lock pipeline.
async function loadAgsCalibration(db) {
  try {
    const d = await db.collection('agsCalibration').doc('current').get();
    if (d.exists) {
      const data = d.data();
      if (data && data.normalizers) {
        return { ...data, source: data.source || 'firestore' };
      }
    }
    console.warn('[ags] agsCalibration/current missing or malformed — using fallback calibration');
    return AGS_FALLBACK_CALIBRATION;
  } catch (e) {
    console.warn('[ags] failed to load calibration, using fallback:', e.message);
    return AGS_FALLBACK_CALIBRATION;
  }
}

// Builds an `isProven(walletShort, sport)` predicate from the loaded
// sharpWalletProfiles map. Walletshort is the last-6 hex of the wallet
// (matches walletDetails entries). CONFIRMED + FLAT only.
function buildIsProvenFn(walletProfiles) {
  return (walletShort, sport) => {
    if (!walletShort || !sport) return false;
    const key = String(walletShort).toLowerCase();
    const profile = walletProfiles.get(key) || walletProfiles.get(key.toUpperCase());
    const tier = profile?.bySport?.[sport]?.whitelistTier;
    return tier === 'CONFIRMED' || tier === 'FLAT';
  };
}

// HC eligibility — CONFIRMED tier only. The sizeRatio ≥ HC_RATIO threshold
// is enforced inside aggregateSideProven. This is strictly stricter than
// isProven (FLAT-tier wallets count toward proven aggregates but not toward
// HC subset features).
function buildIsHcEligibleFn(walletProfiles) {
  return (walletShort, sport) => {
    if (!walletShort || !sport) return false;
    const key = String(walletShort).toLowerCase();
    const profile = walletProfiles.get(key) || walletProfiles.get(key.toUpperCase());
    return profile?.bySport?.[sport]?.whitelistTier === 'CONFIRMED';
  };
}

// v11 — returns the wallet's top-level `profile.picks` aggregate (any-sport
// featured-pick history) at scoring time. Drives the AGS-U v11 dWinnerCtPreA
// feature. `profile.picks` is refreshed every cron cycle by exportWalletProfiles.js
// so this is near-causal in production (lag = time since last profile export).
function buildWalletStatsFn(walletProfiles) {
  return (walletShort) => {
    if (!walletShort) return null;
    const key = String(walletShort).toLowerCase();
    const profile = walletProfiles.get(key) || walletProfiles.get(key.toUpperCase());
    const picks = profile?.picks;
    if (!picks) return null;
    return {
      picksN: Number(picks.n) || 0,
      picksFlatRoi: Number(picks.flatRoi) || 0,
    };
  };
}

// v12 — returns the wallet's per-sport prior stats { tier, priorN, priorRoi }
// from profile.bySport[sport]. Drives the agsV12 quality formula. Same
// near-causal property as v11's walletStatsFn (lag = time since last
// exportWalletProfiles cron cycle, ~8 min).
function buildWalletPriorStatsFn(walletProfiles) {
  return (walletShort, sport) => {
    if (!walletShort || !sport) return null;
    const key = String(walletShort).toLowerCase();
    const profile = walletProfiles.get(key) || walletProfiles.get(key.toUpperCase());
    const sportRec = profile?.bySport?.[sport];
    if (!sportRec) return null;
    return walletPriorStatsFromSportRec(sportRec);
  };
}

// v12 prior stats — Source A (featured-pick history) is the primary ROI/N signal,
// but wallets that qualify on Source B alone (on-chain positions) have no Source A
// data, which would zero out their v12 quality (roi=0, nReliab=0) even though they
// are CONFIRMED. Fall back to the Source-B flat-ROI mirror + position count so the
// quality formula reflects their actual tracked edge. Threshold mirrors
// exportWalletProfiles WHITELIST_MIN_BETS (2): use Source A only when it is non-thin.
const V12_SOURCE_A_MIN = 2;
function walletPriorStatsFromSportRec(sportRec) {
  if (!sportRec) return null;
  const picksN = Number(sportRec.picks?.n) || 0;
  if (picksN >= V12_SOURCE_A_MIN) {
    return {
      tier: sportRec.whitelistTier || null,
      priorN: picksN,
      priorRoi: Number(sportRec.picks?.flatRoi) || 0,
    };
  }
  // Source-A thin → fall back to Source-B (on-chain) flat-ROI mirror.
  const posN = Number(sportRec.positions?.n) || 0;
  return {
    tier: sportRec.whitelistTier || null,
    priorN: posN,
    priorRoi: Number(sportRec.positions?.positionFlatRoi) || 0,
  };
}

// ── RANK-RESCUE (2-for-0 wallet slice) ──────────────────────────────────────
// A side "qualifies" when ≥2 ELIGIBLE whitelist wallets back it and 0 back the
// other side. Eligible = whitelistTier ∈ {CONFIRMED,FLAT,WR50} AND ≥ RANK_RESCUE
// _MIN_PICKS settled featured picks in-sport (profile.bySport[sport].picks.n).
// For a LIVE pick this current count is leak-free (today's games aren't settled).
// Backtest (v12 era, 20d): muted-&-qualifying picks went 62% / +17% flat, ~1.45/day,
// ROI-neutral to the HC book. Used ONLY to rescue HC-muted picks — NOT to up-size
// already-staked picks (the slice adds no edge inside the HC book).
const RANK_RESCUE_MIN_PICKS = 8;
const RANK_RESCUE_UNITS = 4;
function isRankEligible(profile, sport) {
  const rec = profile?.bySport?.[sport];
  if (!rec) return false;
  const tier = rec.whitelistTier;
  if (tier !== 'CONFIRMED' && tier !== 'FLAT' && tier !== 'WR50') return false;
  return (Number(rec.picks?.n) || 0) >= RANK_RESCUE_MIN_PICKS;
}
function computeRankSlice(walletDetails, mySide, sport, walletProfiles) {
  if (!Array.isArray(walletDetails) || !mySide || !sport) return { backing: 0, against: 0, qualifies: false };
  let backing = 0, against = 0;
  const seen = new Set();
  for (const w of walletDetails) {
    const short = String(w.walletShort || w.wallet || '').slice(-6).toLowerCase();
    if (!short || seen.has(short)) continue;            // one vote per wallet
    seen.add(short);
    const profile = walletProfiles.get(short) || walletProfiles.get(short.toUpperCase());
    if (!isRankEligible(profile, sport)) continue;
    if (w.side === mySide) backing++;
    else if (w.side) against++;
  }
  return { backing, against, qualifies: backing >= 2 && against === 0 };
}

// ── SHARP-RESCUE / v12abc "c" — proven-$ + win-rate + 2-backer consensus ────
// A v12-shipped pick (score > 0) the HC sizer muted to 0u is staked when its FOR
// side carries the wallet-QUALITY signal, built from INTERNAL stats only:
//   • ≥1 FOR backer with positions.dollarRoi ≥ SHARP_MIN_QROI on ≥ SHARP_MIN_QN
//     settled positions  (our grading of their real-money Polymarket trades)
//   • mean picks.wr across FOR backers (each ≥ SHARP_MIN_PN settled picks) ≥ floor
//   • ≥ SHARP_MIN_FOR distinct sharps on the FOR side (dissent allowed)
// Profiles are read AT SCORING TIME for a LIVE pick (today's games unsettled), so
// — exactly like RANK-RESCUE — the read is leak-free / point-in-time.
// v12-era backtest: BASE +24.1% / 67% (holdout TEST +31.6%), PRIME +38.2% / 77%.
// Also drives two HC-book overlays: TOP boost (HC-1 + proven-$) and MINI cut
// (gate-fail MINI). Internal stats live at profile.positions.* / profile.picks.*.
const SHARP_LIVE_FROM   = '2026-06-26';  // cutover — history is never rewritten
const SHARP_MIN_QN      = 8;             // min settled positions for a $ROI read
const SHARP_MIN_QROI    = 10;            // positions.dollarRoi threshold (%)
const SHARP_MIN_PN      = 5;             // min settled picks to count toward wr
const SHARP_WR_BASE     = 50;            // mean picks.wr floor — SHARP
const SHARP_WR_PRIME    = 55;            // mean picks.wr floor — SHARP-PRIME boost
const SHARP_MIN_FOR     = 2;             // ≥2 distinct FOR-side sharps (consensus)
const SHARP_UNITS       = 3;             // SHARP rescue stake
const SHARP_PRIME_UNITS = 4;             // SHARP-PRIME rescue stake
const TOP_BOOST_UNITS   = 5;             // HC-1 TOP + proven-$ → boost 4u → 5u
const MINI_REDUCED_UNITS = 1;            // gate-fail MINI (no proven-$) → 3u → 1u
function isSharpRescueLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= SHARP_LIVE_FROM;
}
function computeSharpQuality(walletDetails, mySide, sport, walletProfiles) {
  const empty = { forCount: 0, maxQRoi: -Infinity, meanPWr: null, provenDollar: false, qualifies: false, prime: false };
  if (!Array.isArray(walletDetails) || !mySide) return empty;
  let forCount = 0, maxQRoi = -Infinity; const wrPool = [];
  const seen = new Set();
  for (const w of walletDetails) {
    const short = String(w.walletShort || w.wallet || '').slice(-6).toLowerCase();
    if (!short || seen.has(short)) continue;             // one vote per wallet
    seen.add(short);
    if (w.side !== mySide) continue;                     // FOR side only
    forCount++;
    const profile = walletProfiles.get(short) || walletProfiles.get(short.toUpperCase());
    if (!profile) continue;
    const q = profile.positions || {};
    if ((Number(q.n) || 0) >= SHARP_MIN_QN && Number.isFinite(Number(q.dollarRoi))) {
      maxQRoi = Math.max(maxQRoi, Number(q.dollarRoi));
    }
    const pk = profile.picks || {};
    if ((Number(pk.n) || 0) >= SHARP_MIN_PN && Number.isFinite(Number(pk.wr))) {
      wrPool.push(Number(pk.wr));
    }
  }
  const meanPWr = wrPool.length ? wrPool.reduce((s, x) => s + x, 0) / wrPool.length : null;
  const provenDollar = maxQRoi >= SHARP_MIN_QROI;
  const qualifies = provenDollar && meanPWr != null && meanPWr >= SHARP_WR_BASE && forCount >= SHARP_MIN_FOR;
  const prime = qualifies && meanPWr >= SHARP_WR_PRIME;
  return { forCount, maxQRoi, meanPWr, provenDollar, qualifies, prime };
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

// ── Game metadata sources (commenceTime + odds) ────────────────────────────
// For NEWLY CREATED pick docs (no browser sync ever ran), we need
// commenceTime and current odds. Browser-facing JSON files are the same
// data the UI reads, so we mirror that.
function loadGameMetadata() {
  const meta = new Map(); // key: `${sport}|${gameKey}` → { commenceTime, away, home, mlOdds: { away, home }, spread, total }
  try {
    const poly = JSON.parse(readFileSync(join(PUBLIC, 'polymarket_data.json'), 'utf8'));
    for (const sport of ['NBA', 'MLB', 'NHL', 'CBB', 'SOC', 'UFC']) {
      const games = poly[sport] || {};
      for (const [gk, g] of Object.entries(games)) {
        const key = `${sport}|${gk}`;
        const cur = meta.get(key) || {};
        // polymarket `commence` / `polyGameTime` is an ISO string.
        const ctRaw = g.commence || g.polyGameTime || null;
        if (ctRaw) {
          const ms = new Date(ctRaw).getTime();
          if (Number.isFinite(ms)) cur.commenceTime = ms;
        }
        cur.away = g.awayTeam || cur.away || null;
        cur.home = g.homeTeam || cur.home || null;
        cur.polyAwayProb = typeof g.awayProb === 'number' ? g.awayProb : null;
        cur.polyHomeProb = typeof g.homeProb === 'number' ? g.homeProb : null;
        cur.polyDrawProb = typeof g.drawProb === 'number' ? g.drawProb : null;
        meta.set(key, cur);
      }
    }
  } catch (e) {
    console.warn('[meta] polymarket_data.json unreadable:', e.message);
  }
  try {
    const pinn = JSON.parse(readFileSync(join(PUBLIC, 'pinnacle_history.json'), 'utf8'));
    for (const sport of ['NBA', 'MLB', 'NHL', 'CBB', 'SOC', 'UFC']) {
      const games = pinn[sport] || {};
      for (const [gk, g] of Object.entries(games)) {
        const key = `${sport}|${gk}`;
        const cur = meta.get(key) || {};
        const cT = g.opener?.t ?? g.current?.t ?? null;
        if (cT && !cur.commenceTime) cur.commenceTime = cT * 1000;
        if (g.current) {
          cur.mlOdds = { away: g.current.away, home: g.current.home, draw: g.current.draw ?? null };
        } else if (g.opener) {
          cur.mlOdds = { away: g.opener.away, home: g.opener.home, draw: g.opener.draw ?? null };
        }
        // Spread line + odds (Pinnacle opener — pinnacle_history doesn't
        // track spreads over time the way it does ML). Populated for the
        // cron's create-missing path so spread picks written without a
        // browser session still have peak.line and peak.odds set.
        if (g.spreadOpener) {
          cur.spreadOpener = {
            awayLine: g.spreadOpener.awayLine,
            awayOdds: g.spreadOpener.awayOdds,
            homeLine: g.spreadOpener.homeLine,
            homeOdds: g.spreadOpener.homeOdds,
          };
        }
        if (g.spreadCurrent) {
          cur.spreadCurrent = {
            awayLine: g.spreadCurrent.awayLine,
            awayOdds: g.spreadCurrent.awayOdds,
            homeLine: g.spreadCurrent.homeLine,
            homeOdds: g.spreadCurrent.homeOdds,
          };
        }
        meta.set(key, cur);
      }
    }
  } catch (e) {
    console.warn('[meta] pinnacle_history.json unreadable:', e.message);
  }
  return meta;
}

// Mode-of value across positions on a side. Used to compute the consensus
// line (entryLine) for SPREAD and TOTAL picks the cron auto-creates.
// Returns null if no positions agree on a value.
// Plausibility ranges by sport+market. Polymarket activity-feed entries
// occasionally surface placeholder values (entryLine=1 most commonly), and
// without a guard the cron will happily burn that into peak.line/lock.line
// — which then renders as "Over 1" on the dashboard instead of the real
// total. Real-world incident 2026-05-10 (NBA SAS/MIN total): one position
// had entryLine=1, consensusLine returned 1, the cron stamped lock.line=1
// and lock.team="Over 1", and the card showed "Over 1" until manually
// repaired. Reject anything outside the plausible band before voting.
const LINE_PLAUSIBILITY = {
  TOTAL: {
    NBA: { min: 150, max: 300 }, // typical 200-260
    MLB: { min: 4,   max: 25  }, // typical 6.5-12.5
    NHL: { min: 3,   max: 12  }, // typical 5-7
    SOC: { min: 0.5, max: 7.5 }, // soccer goals — typical 1.5-3.5
    DEFAULT: { min: 1.5, max: 400 }, // catch-all that still rejects 1
  },
  SPREAD: {
    DEFAULT: { min: -30, max: 30 }, // covers every NBA/NHL/MLB spread
  },
};
function isPlausibleLine(ln, sport, marketType) {
  if (!Number.isFinite(ln)) return false;
  const mt = (marketType || '').toUpperCase();
  const band = LINE_PLAUSIBILITY[mt]?.[(sport || '').toUpperCase()]
    ?? LINE_PLAUSIBILITY[mt]?.DEFAULT;
  if (!band) return true; // unknown market — trust whatever caller gave us
  return ln >= band.min && ln <= band.max;
}

function consensusLine(positions, side, sport = null, marketType = null) {
  const counts = new Map(); // line → count
  for (const p of positions) {
    if (p.side !== side) continue;
    const ln = p.entryLine ?? p.spreadLine ?? p.totalLine ?? null;
    if (ln == null) continue;
    // Sanity-gate per sport/market BEFORE voting so a single garbage
    // entryLine=1 can't outvote a single legit line.
    if ((sport || marketType) && !isPlausibleLine(ln, sport, marketType)) continue;
    counts.set(ln, (counts.get(ln) || 0) + 1);
  }
  if (counts.size === 0) return null;
  let bestLine = null, bestCount = -1;
  for (const [ln, c] of counts) {
    if (c > bestCount) { bestLine = ln; bestCount = c; }
  }
  return bestLine;
}

// Mirror of src/pages/SharpFlow.jsx → unitTier(units). Lives here so the
// cron's create-missing path can stamp peak.unitTier in the same shape
// the browser writes (otherwise the dashboard renders "undefined").
function unitTierLabel(units) {
  if (units >= 2.5) return 'MAX';
  if (units >= 1.5) return 'STRONG';
  return 'STANDARD';
}

// Build the peak fields the dashboard render reads — sharpCount,
// totalInvested, walletProfile, consensusStrength — from the proven
// positions backing this side. The browser computes these from a much
// richer client-side dataset; here we approximate from Firestore-stored
// position records. Output shape mirrors src/pages/SharpFlow.jsx
// → buildSideData / buildSpreadTotalSideData so the renderer never sees
// undefined fields and the "$null / Pistons null" bug can't recur.
function buildPeakStatsFromPositions(positions, side, isProvenFn, sport) {
  // isProvenFn expects the SHORT form of the wallet (last-6 hex,
  // lowercased) — that's the key shape walletProfiles is built with.
  // Passing p.wallet (full address) silently misses every wallet and
  // collapses totalInvested / sharpCount / consensusStrength to 0,
  // which renders as "$null" / "—" on the dashboard. Mirrors the
  // same shortOf() logic computeWalletConsensus already uses (line 398).
  const shortOf = (p) => String(p.walletShort || p.wallet || '').slice(-6).toLowerCase();
  const proven = positions.filter(p => p.side === side && isProvenFn(shortOf(p), sport));
  const opposing = positions.filter(p => p.side !== side && isProvenFn(shortOf(p), sport));
  const conWalletCount = proven.length;
  const oppWalletCount = opposing.length;
  const totalInvested = proven.reduce((s, p) => s + (Number(p.invested) || 0), 0);
  const oppInvested = opposing.reduce((s, p) => s + (Number(p.invested) || 0), 0);
  // Tier dominance — pick the highest tier present on the for side.
  const tierRank = { ELITE: 3, STRONG: 2, MOD: 1, NEW: 0 };
  let dominantTier = 'NEW';
  for (const p of proven) {
    const t = p.tier || 'NEW';
    if ((tierRank[t] ?? -1) > (tierRank[dominantTier] ?? -1)) dominantTier = t;
  }
  // Money/wallet split — total of invested across both sides.
  const totalMoney = totalInvested + oppInvested;
  const totalWallets = conWalletCount + oppWalletCount;
  const moneyPct = totalMoney > 0 ? Math.round((totalInvested / totalMoney) * 100) : 50;
  const walletPct = totalWallets > 0 ? Math.round((conWalletCount / totalWallets) * 100) : 50;
  let grade = 'LEAN';
  if (moneyPct >= 80 && walletPct >= 75) grade = 'DOMINANT';
  else if (moneyPct >= 65 && walletPct >= 60) grade = 'STRONG';
  // Concentration — top wallet's share of for-side $$$. 1.0 = single wallet.
  let topShare = 0;
  if (totalInvested > 0) {
    const top = Math.max(...proven.map(p => Number(p.invested) || 0));
    topShare = top / totalInvested;
  }
  // Conviction — average sizeRatio (avg-bet vs the wallet's typical bet).
  // Falls back to 1.0 when missing — the browser uses ~0.5–2.0 range.
  let conviction = 0;
  let sizeRatioSum = 0, sizeRatioN = 0;
  for (const p of proven) {
    const r = Number(p.betMultiplier ?? p.sizeRatio);
    if (Number.isFinite(r) && r > 0) { sizeRatioSum += r; sizeRatioN++; }
  }
  if (sizeRatioN > 0) conviction = +(sizeRatioSum / sizeRatioN).toFixed(3);
  return {
    sharpCount: conWalletCount,
    totalInvested: Math.round(totalInvested),
    consensusStrength: { moneyPct, walletPct, grade },
    walletProfile: {
      dominantTier,
      breadth: totalWallets > 0 ? +(conWalletCount / totalWallets).toFixed(3) : 0,
      conWalletCount,
      oppWalletCount,
      sportSharpCount: conWalletCount,
      concentration: +topShare.toFixed(3),
      conviction,
      consensusTier: grade,
      counterSharpScore: 0,
    },
  };
}

// positionToWalletDetail is imported from src/lib/ags.js so the cron and
// the UI share one definition of the position → walletDetail transform.
// Any change to feature inputs (sizeRatio, convictionMult, contribution,
// walletBase) MUST happen in src/lib/ags.js so both sides update together.

// ── Both-sides analytical sidecar ──────────────────────────────────────────
// Pure read-only metric computation for a single market-side, used to
// populate the doc-level `agsBothSides` analytical record (NOT inside the
// `sides` map). Mirrors the AGS / consensus / HC-margin path the active
// side uses, but never touches `sides[*]`, finalUnits, lockStage, status,
// or any grading field — purely a documentation-grade snapshot of what
// each side looked like at every cycle pre-T-15 so we can later analyze
// "we picked side A; was side B actually the better play?"
//
// Returns null when there's zero whitelist activity for or against this
// side (so we don't litter docs with empty {ags:null} stamps when the
// scanner has no proven-wallet signal yet).
function computeSideAnalytics(positions, side, sport, walletProfiles, agsCalibration, isProvenFn, isHcEligibleFn, walletStatsFn = null, walletPriorStatsFn = null) {
  if (!Array.isArray(positions) || positions.length === 0) return null;
  const live = computeWalletConsensus(positions, side, sport, walletProfiles);
  if (live.forW === 0 && live.agW === 0 && live.hcConfFor === 0 && live.hcConfAg === 0) {
    return null;
  }
  const walletDetails = positions.map(positionToWalletDetail);
  const agg = aggregateSideProven(walletDetails, side, sport, isProvenFn, isHcEligibleFn, walletStatsFn);
  const agsRes = agg ? computeAgs(agg, agsCalibration) : null;
  const aggV12 = walletPriorStatsFn ? aggregateSideV12(walletDetails, side, sport, walletPriorStatsFn) : null;
  const agsV12Res = aggV12 ? computeAgsV12(aggV12, agsCalibration) : null;
  const out = {
    ags: agsRes && Number.isFinite(agsRes.ags) ? agsRes.ags : null,
    agsTier: agsRes ? (agsRes.tier ?? null) : null,
    agsQuintile: agsRes ? (agsRes.quintile ?? null) : null,
    agsProvenForCount: agsRes ? (agsRes.provenForCount || 0) : 0,
    agsProvenAgCount: agsRes ? (agsRes.provenAgCount || 0) : 0,
    agsComponents: agsRes ? (agsRes.components || null) : null,
    // v12 sidecar — same shape but prefixed for clarity. Lets reports
    // compare "what v11 said about this side" vs "what v12 says".
    agsV12: agsV12Res && Number.isFinite(agsV12Res.agsV12) ? agsV12Res.agsV12 : null,
    agsV12Tier: agsV12Res ? (agsV12Res.tier ?? null) : null,
    agsV12Quintile: agsV12Res ? (agsV12Res.quintile ?? null) : null,
    agsV12ForCount: agsV12Res ? (agsV12Res.forCount || 0) : 0,
    agsV12AgCount: agsV12Res ? (agsV12Res.agCount || 0) : 0,
    agsV12ForMean: agsV12Res ? (agsV12Res.forMean || 0) : 0,
    agsV12AgMean: agsV12Res ? (agsV12Res.agMean || 0) : 0,
    dw: live.delta,
    dq: live.qualityMargin,
    hcMargin: live.hcMargin,
    hcConfFor: live.hcConfFor,
    hcConfAg: live.hcConfAg,
    hcDominant: live.hcDominant,
    walletForCount: live.forW,
    walletAgCount: live.agW,
  };
  return out;
}

// Convenience wrapper: compute analytics for BOTH sides of a given market
// at once and return a side-keyed record ready to merge as
// `agsBothSides` on the pick doc. Returns null when both sides are
// empty (nothing meaningful to record).
function computeBothSidesAnalytics(positions, marketType, sport, walletProfiles, agsCalibration, isProvenFn, isHcEligibleFn, walletStatsFn = null, walletPriorStatsFn = null) {
  const sides = marketType === 'TOTAL' ? ['over', 'under']
    : sport === 'SOC' ? ['away', 'home', 'draw']
    : ['away', 'home'];
  const out = {};
  let any = false;
  for (const side of sides) {
    const stamp = computeSideAnalytics(positions, side, sport, walletProfiles, agsCalibration, isProvenFn, isHcEligibleFn, walletStatsFn, walletPriorStatsFn);
    if (stamp) {
      out[side] = stamp;
      any = true;
    }
  }
  return any ? out : null;
}

// ── Auto-create missing locked-pick docs ───────────────────────────────────
// Architectural fix (2026-05-05): the cron only UPDATES existing pick
// docs; if a side first qualified for the floor when no browser was
// open, it never got written. This pass scans every (sport|gameKey|mkt)
// group of sharp_action_positions and, for any side that passes the
// v7.5 floor without an existing doc, builds + writes a minimal pick
// doc so subsequent reconcileSide() calls (next cycle) can take over.
//
// Build is intentionally minimal: lockStage='LOCKED' so reconcileSide
// processes it, peak.v8Scoring.walletDetails so AGS can compute, and
// enough top-level metadata (date/sport/gameKey/teams/commenceTime) for
// the dashboard to render. Browser-driven syncs will enrich any other
// fields (criteria, evEdge, etc.) the next time a user opens the page.
async function createMissingLockedPicks({
  db, groups, walletProfiles, agsCalibration, isProvenFn, isHcEligibleFn,
  walletStatsFn, walletPriorStatsFn,
  existingDocIds, gameMeta, now, dryRun, force,
}) {
  const created = []; // { col, docId, side, ags, agsTotal }
  const skipped = []; // { reason, ... }
  const writes = new Map(); // col → [{ docId, payload }]
  const PREGAME_BUFFER_MS = 5 * 60 * 1000;

  for (const [groupKey, positions] of groups.entries()) {
    const [sport, gameKey, marketType] = groupKey.split('|');
    const col = marketType === 'SPREAD' ? 'sharpFlowSpreads'
      : marketType === 'TOTAL' ? 'sharpFlowTotals'
      : 'sharpFlowPicks';
    // docId convention MUST match the browser's syncPickToFirebase /
    // syncSpreadPickToFirebase / syncTotalPickToFirebase paths, otherwise
    // we'll write a duplicate doc with a different ID. ML uses no
    // suffix; SPREAD appends "_spread"; TOTAL appends "_total".
    const suffix = marketType === 'SPREAD' ? '_spread'
      : marketType === 'TOTAL' ? '_total'
      : '';
    const docId = `${TARGET_DATE}_${sport}_${gameKey}${suffix}`;
    if (existingDocIds.has(`${col}|${docId}`)) continue; // already in Firestore

    const meta = gameMeta.get(`${sport}|${gameKey}`);
    if (!meta) {
      skipped.push({ docId, col, reason: 'no_metadata' });
      continue;
    }
    if (!meta.commenceTime) {
      skipped.push({ docId, col, reason: 'no_commenceTime' });
      continue;
    }
    // CRITICAL: only create picks for games actually happening on TARGET_DATE
    // (in ET). polymarket_data.json contains games for multiple days
    // (today + tomorrow); without this guard we'd write tomorrow's
    // games under today's date prefix.
    const gameDateET = new Date(meta.commenceTime).toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
    if (gameDateET !== TARGET_DATE) {
      skipped.push({ docId, col, reason: 'game_not_target_date', gameDateET });
      continue;
    }
    if (!force && now >= meta.commenceTime - PREGAME_BUFFER_MS) {
      skipped.push({ docId, col, reason: 'past_pregame_window' });
      continue;
    }

    const sides = marketType === 'TOTAL' ? ['over', 'under']
      : sport === 'SOC' ? ['away', 'home', 'draw']
      : ['away', 'home'];
    const newSides = {};
    for (const side of sides) {
      const live = computeWalletConsensus(positions, side, sport, walletProfiles);
      // Quick-skip: no whitelist activity at all on this side.
      if (live.forW === 0 && live.agW === 0 && live.hcConfFor === 0 && live.hcConfAg === 0) continue;

      // Build walletDetails for AGS-U.
      const walletDetails = positions.map(positionToWalletDetail);
      // v11 (informational / sidecar diagnostic)
      const agg = aggregateSideProven(walletDetails, side, sport, isProvenFn, isHcEligibleFn, walletStatsFn);
      const agsRes = agg ? computeAgs(agg, agsCalibration) : null;
      const agsValue = agsRes && Number.isFinite(agsRes.ags) ? agsRes.ags : null;
      const agsProvenTotal = agsRes ? (agsRes.provenForCount || 0) + (agsRes.provenAgCount || 0) : 0;
      // v12 (AUTHORITATIVE — drives ship gate, tier, units)
      const aggV12 = walletPriorStatsFn ? aggregateSideV12(walletDetails, side, sport, walletPriorStatsFn) : null;
      const agsV12Res = aggV12 ? computeAgsV12(aggV12, agsCalibration) : null;
      const scoreV12 = agsV12Res && Number.isFinite(agsV12Res.agsV12) ? agsV12Res.agsV12 : null;

      // v12 ship gate — score > 0. Wallet-pool adequacy is implicit in the
      // quality score (non-HC_BASE wallets contribute 0; no qualified
      // wallets → score 0 → muted). No separate proven-wallet floor needed.
      if (scoreV12 == null) {
        skipped.push({ docId, side, reason: 'agsv12_no_signal' });
        continue;
      }
      if (scoreV12 <= 0) {
        skipped.push({ docId, side, reason: 'agsv12_mute_below_zero', score: scoreV12 });
        continue;
      }

      const promotedBy = 'ags-unified-v12';
      const finalTier = agsV12Res.tier; // v12 tier becomes the authoritative label
      const peakStars = starsFromTierV12(finalTier);
      // ── Pinnacle odds + line. ML uses live mlOdds; SPREAD uses the
      // pinnacle opener (pinnacle_history doesn't track spreads over
      // time); TOTAL falls back to -110 (no Pinnacle source for totals
      // in pinnacle_history.json — browser sync writes the live retail
      // book number, but the cron only has Pinnacle ML).
      let odds = null;
      let line = null;
      if (marketType === 'ML') {
        // 3-way soccer: the draw is a first-class side and MUST use the draw
        // price — not the away fallback (which previously stamped the favorite's
        // odds onto draw picks, e.g. "Draw ML -1100"). Prefer Pinnacle's draw
        // line; if it hasn't been captured yet, derive from Polymarket draw prob.
        if (side === 'home') odds = meta.mlOdds?.home;
        else if (side === 'draw') {
          odds = meta.mlOdds?.draw ?? null;
          if (odds == null && Number.isFinite(meta.polyDrawProb) && meta.polyDrawProb > 0 && meta.polyDrawProb < 100) {
            const p = meta.polyDrawProb / 100;
            odds = p >= 0.5 ? -Math.round((p / (1 - p)) * 100) : Math.round(((1 - p) / p) * 100);
          }
        } else odds = meta.mlOdds?.away;
      } else if (marketType === 'SPREAD') {
        // Side/money = wallet consensus. The number on the ticket = Pinnacle
        // SPREAD juice — never ML. Do NOT default to -110: that is the
        // standard ML chalk price and was burned onto Braves -1.5 at
        // create-time (2026-07-09 atl_pit) while real spread juice was +139.
        // Leave odds null until spreadCurrent/Opener is available; reconcile
        // will backfill pre-T-15 once Pinnacle has the number.
        const pinnLine = side === 'home'
          ? (meta.spreadCurrent?.homeLine ?? meta.spreadOpener?.homeLine)
          : (meta.spreadCurrent?.awayLine ?? meta.spreadOpener?.awayLine);
        odds = (side === 'home'
          ? (meta.spreadCurrent?.homeOdds ?? meta.spreadOpener?.homeOdds)
          : (meta.spreadCurrent?.awayOdds ?? meta.spreadOpener?.awayOdds)) ?? null;
        line = pinnLine ?? consensusLine(positions, side, sport, 'SPREAD') ?? null;
      } else if (marketType === 'TOTAL') {
        odds = -110;
        line = consensusLine(positions, side, sport, 'TOTAL') ?? null;
      }
      // v12 ladder is the authoritative bet size. unitsFromAgsV12 applies
      // the mute-on-≤0 rule + the absolute ladder (0.25/0.50/1/3/5) +
      // the odds cap. v11 multiplier is recorded as a sidecar for
      // reference/back-compat with old reports.
      const peakUnits = unitsFromAgsV12(scoreV12, odds ?? null, agsCalibration);
      const agsUnitsMult = agsValue != null ? agsSizeMultiplier(agsValue, agsCalibration) : 0;
      const agsV12UnitsRaw = agsV12SizeMultiplier(scoreV12, agsCalibration);

      // ── v12.1 HC-margin staking overlay (going-forward) ─────────────────
      // Newly-created docs are dated TARGET_DATE; when on/after the cutover
      // the STAKE + product tier come from the HC margin. finalTier (score
      // quintile) is kept as a diagnostic; v8_hcStakeTier carries the product
      // tier and peakUnitsApplied is the HC-based, odds-capped size.
      const createV121Eligible = isV121Eligible(TARGET_DATE);
      let hcStakeTierCreate = null;
      let peakUnitsApplied = peakUnits;
      if (createV121Eligible) {
        const hc = hcStakeFromV12({
          scoreV12,
          scoreTier: finalTier,
          hcMargin: live.hcMargin,
          miniHcMargin: live.miniHcMargin,
          odds: odds ?? null,
          calibration: agsCalibration,
        });
        hcStakeTierCreate = hc.stakeTier;     // SUPER | TOP | MINI | CONFIRMED | MONITORING
        peakUnitsApplied = hc.units;          // odds-capped; MONITORING → 0u
      }

      // Determine team label for the side.
      //
      // For TOTAL picks: write the canonical "Over <line>" form ONLY when
      // line passes the per-sport plausibility check (real total, not a
      // Polymarket entryLine=1 placeholder). When line is null/garbage,
      // write the BARE 'Over'/'Under' label so LockedPickCard's defensive
      // renderer can synthesize the display from peak.line / closingLine
      // at render time. Burning "Over 1" into team here is a one-way
      // corruption — the renderer trusts non-bare values verbatim.
      let team;
      if (marketType === 'TOTAL') {
        const tot = side === 'over' ? 'Over' : 'Under';
        team = (line != null && isPlausibleLine(line, sport, 'TOTAL'))
          ? `${tot} ${line}`
          : tot;
      } else {
        team = side === 'draw' ? 'Draw' : side === 'home' ? meta.home : meta.away;
      }

      // Build the rich peak fields the dashboard render reads. Without
      // these the card showed "Pistons null / 0 · pinnacle / $null".
      //
      // CRITICAL: only write fields whose values we actually have. Firestore
      // setDoc({merge:true}) treats explicit null as "overwrite to null" —
      // only undefined is skipped. If the browser already wrote
      // peak.line=-3.5 / peak.odds=-105 and we then merge a payload with
      // peak.line=null, we wipe out the good data. Build the snapshot from
      // the always-present fields, then attach line/odds/pinnacleOdds only
      // when non-null so the existing values survive a race.
      const peakStats = buildPeakStatsFromPositions(positions, side, isProvenFn, sport);
      const peakSnapshot = {
        team: team || side,
        // 'Pinnacle' (capitalized) matches the browser's syncSpread/Total
        // path. Lowercase 'pinnacle' triggered "0 · pinnacle / Pistons null"
        // rendering on the dashboard before this fix.
        book: 'Pinnacle',
        stars: peakStars,
        units: peakUnitsApplied,
        unitTier: unitTierLabel(peakUnitsApplied),
        sharpCount: peakStats.sharpCount,
        totalInvested: peakStats.totalInvested,
        consensusStrength: peakStats.consensusStrength,
        walletProfile: peakStats.walletProfile,
        // We don't have live EV / criteria pipelines server-side; default
        // these to neutral values so the dashboard's chip row renders
        // (greyed) instead of breaking on undefined. Browser-driven
        // updates (when totalInvested clears the floor) will overwrite
        // with the real numbers.
        evEdge: 0,
        criteriaMet: 0,
        criteria: {
          invested10kPlus: peakStats.totalInvested >= 10000,
          sharps3Plus: peakStats.sharpCount >= 3,
          lineMovingWith: false,
          pinnacleConfirms: false,
          plusEV: false,
          predMarketAligns: false,
        },
        regime: 'PREGAME',
        qualityProxy: 0,
        v8Scoring: { walletDetails, consensusSide: side },
        updatedAt: now,
      };
      if (odds != null) {
        peakSnapshot.odds = odds;
        peakSnapshot.pinnacleOdds = odds;
      }
      if (line != null) {
        peakSnapshot.line = line;
      }
      // v8_* stamps — required by the dashboard's passesV74DisplayGate
      // for the side to render. Without these, a freshly auto-created
      // side is invisible on the dashboard for ~8 minutes (until the
      // next reconcile pass stamps them). Mirrors the reconcileSide
      // canonical patch so create + reconcile produce identical state.
      const v8Stamps = {
        v8_walletConsensusVersion: WHITELIST_CONSENSUS_VERSION,
        v8_walletConsensusForW: live.forW,
        v8_walletConsensusAgW: live.agW,
        v8_walletConsensusDelta: live.delta,
        v8_walletConsensusQualityForT30: live.qualityForT30,
        v8_walletConsensusQualityAgT30: live.qualityAgT30,
        v8_walletConsensusQualityMargin: live.qualityMargin,
        v8_hcConfFor: live.hcConfFor,
        v8_hcConfAg: live.hcConfAg,
        v8_hcMargin: live.hcMargin,
        v8_hcDominant: live.hcDominant,
        v8_miniHcConfFor: live.miniHcConfFor,
        v8_miniHcConfAg: live.miniHcConfAg,
        v8_miniHcMargin: live.miniHcMargin,
        v8_lockTier: finalTier,
      };
      if (agsRes) {
        // v11 (informational only after v12 cutover; still recorded for
        // historical reports / drift tracking).
        v8Stamps.v8_ags = agsRes.ags;
        v8Stamps.v8_agsTierV11 = agsRes.tier;
        v8Stamps.v8_agsQuintile = agsRes.quintile;
        v8Stamps.v8_agsComponents = agsRes.components;
        v8Stamps.v8_agsProvenForCount = agsRes.provenForCount;
        v8Stamps.v8_agsProvenAgCount = agsRes.provenAgCount;
        v8Stamps.v8_agsCalibrationSource = agsRes.calibrationSource || 'firestore';
        v8Stamps.v8_agsEvaluatedAt = now;
        v8Stamps.v8_agsUnitsMult = agsUnitsMult;
        v8Stamps.v8_agsUnitsBase = (marketType === 'SPREAD' || marketType === 'TOTAL') ? BASE_UNITS_SPREAD_TOTAL : BASE_UNITS_ML;
        v8Stamps.v8_agsUnitsApplied = peakUnitsApplied; // mirrored on finalUnits for the grader
      }
      // v12 (AUTHORITATIVE — v8_agsTier and finalUnits are v12-derived).
      v8Stamps.v8_agsTier = finalTier; // v12 tier (overwrites legacy v11 tier slot)
      v8Stamps.v8_agsV12 = scoreV12;
      v8Stamps.v8_agsV12Tier = finalTier;
      v8Stamps.v8_agsV12Quintile = agsV12Res.quintile;
      v8Stamps.v8_agsV12ForCount = agsV12Res.forCount;
      v8Stamps.v8_agsV12AgCount = agsV12Res.agCount;
      v8Stamps.v8_agsV12ForMean = agsV12Res.forMean;
      v8Stamps.v8_agsV12AgMean = agsV12Res.agMean;
      v8Stamps.v8_agsV12UnitsRaw = agsV12UnitsRaw; // ladder value pre-odds-cap
      v8Stamps.v8_agsV12UnitsApplied = peakUnitsApplied;  // post-odds-cap, == finalUnits
      v8Stamps.v8_agsV12CalibrationSource = agsV12Res.calibrationSource || 'fallback';
      v8Stamps.v8_agsV12EvaluatedAt = now;
      // v12.1 — product stake tier from the HC margin (going-forward only).
      if (createV121Eligible) {
        v8Stamps.v8_hcStakeTier = hcStakeTierCreate;
      }
      // Health stamp — gives the dashboard a non-undefined health.status
      // immediately. reconcileSide will overwrite next cycle (same shape).
      const healthStamp = {
        status: 'ACTIVE',
        reasons: [],
        walletDelta: live.delta,
        qualityMargin: live.qualityMargin,
        hcMargin: live.hcMargin,
        ags: agsValue,
        currentStars: peakStars,
        evaluatedAt: now,
        syncedBy: 'server-cron',
      };
      newSides[side] = {
        team: team || side,
        lockStage: 'LOCKED',
        promotedBy,
        promotedAt: now,
        promotedRegime: 'PREGAME',
        contribTier: finalTier,
        // peak + lock both stamped with the same snapshot. The render's
        // lockOddsValid path reads lock.odds; if we only set peak the
        // dashboard would still fall through to `cardOdds = 0` for the
        // first cycle.
        peak: peakSnapshot,
        lock: { ...peakSnapshot, lockedAt: now },
        maxEV: 0,
        maxEVAt: now,
        // Canonical bet size — same source of truth used by grader and dashboard.
        finalUnits: peakUnitsApplied,
        status: 'PENDING',
        result: { outcome: null, profit: null, gradedAt: null },
        // Flag so we know this came from the cron auto-create path.
        cronCreated: true,
        cronCreatedAt: now,
        ...v8Stamps,
        health: healthStamp,
      };
      created.push({
        col, docId, side, route: promotedBy,
        ags: agsValue, agsTotal: agsProvenTotal,
        agsV12: scoreV12, agsV12Tier: finalTier,
        hcStakeTier: hcStakeTierCreate,
        peakStars, peakUnits: peakUnitsApplied, team,
      });
    }
    if (Object.keys(newSides).length === 0) continue;

    // Both-sides analytical sidecar — purely documentary. Lets us later
    // analyze "we locked side A with AGS=+X; what was side B's AGS?"
    // without rerunning calibration on historical positions. Lives on
    // the doc top-level (NOT inside `sides`), is updated every cycle by
    // the post-reconcile refresh pass below, and is never read by
    // sizing / lock-promote / grader code paths.
    const bothSidesAtCreate = computeBothSidesAnalytics(
      positions, marketType, sport, walletProfiles, agsCalibration, isProvenFn, isHcEligibleFn, walletStatsFn, walletPriorStatsFn,
    );

    const docPayload = {
      date: TARGET_DATE,
      sport,
      gameKey,
      away: meta.away,
      home: meta.home,
      commenceTime: meta.commenceTime,
      lockType: 'PREGAME',
      // Doc-level marketType — mirrors the browser's syncSpread/Total
      // payload. The dashboard's BetHistoryPanel and pick-card render
      // both branch on marketType; missing field rendered as "?" before.
      marketType: marketType === 'SPREAD' ? 'spread'
        : marketType === 'TOTAL' ? 'total'
        : 'ml',
      sides: newSides,
      status: 'PENDING',
      result: { awayScore: null, homeScore: null, winner: null },
      source: 'cron-auto-create',
      createdAt: now,
      lastSyncAt: now,
    };
    if (bothSidesAtCreate) {
      docPayload.agsBothSides = { ...bothSidesAtCreate, updatedAt: now };
    }
    if (!writes.has(col)) writes.set(col, []);
    writes.get(col).push({ docId, payload: docPayload });
  }

  if (!dryRun) {
    // Race-safety: existingDocIds is a snapshot from the start of the run.
    // Between then and now the browser may have created the doc with full
    // peak data (line, odds, book, walletProfile, evEdge…). If we batch-set
    // our payload over it, even with merge:true, any explicit null we write
    // (e.g. peak.line=null when Pinnacle has no spread number for the game
    // yet) will clobber the browser's good value — that's exactly the
    // "delete → comes back perfect → later overwritten with null" bug.
    //
    // Per-doc fresh existence check closes the race. We pay one extra read
    // per missing-pick candidate, which is cheap (handful per cycle).
    for (const [col, items] of writes) {
      const filtered = [];
      for (const w of items) {
        const ref = db.collection(col).doc(w.docId);
        const cur = await ref.get();
        if (cur.exists) {
          // Ghost-doc recovery — if the doc exists but has zero live (non-
          // superseded) sides, treat it as a missing-side candidate and
          // let the merge:true write below repopulate sides. Without this,
          // a doc that lost its side(s) to a writer race is permanently
          // stranded with sides:{} and the LOCKED pick disappears from
          // the dashboard for the rest of the day.
          const cd = cur.data() || {};
          const sideEntries = Object.entries(cd.sides || {});
          const liveSides = sideEntries.filter(([, sd]) => sd && !sd.superseded);
          const isGhost = cd.status !== 'COMPLETED' && liveSides.length === 0;
          if (isGhost) {
            console.warn(`  ↻ Ghost-doc recovery: ${col}/${w.docId} exists with 0 live sides — re-stamping`);
            filtered.push(w);
            continue;
          }
          // Browser (or another writer) beat us to it — leave it alone.
          // Strip from `created` so the cron log doesn't lie about it.
          for (let i = created.length - 1; i >= 0; i--) {
            if (created[i].col === col && created[i].docId === w.docId) {
              skipped.push({ docId: w.docId, col, side: created[i].side, reason: 'race_existed_at_write' });
              created.splice(i, 1);
            }
          }
          continue;
        }
        filtered.push(w);
      }
      if (filtered.length === 0) continue;
      const batch = db.batch();
      for (const w of filtered) {
        batch.set(db.collection(col).doc(w.docId), w.payload, { merge: true });
      }
      await batch.commit();
    }
  }

  return { created, skipped, writes };
}

// ── Main sync logic per side ───────────────────────────────────────────────
/**
 * True when a SPREAD side's lock.odds looks like ML bleed / the -110 default
 * rather than real run-line juice. Peak or live Pinnacle spread odds are the
 * recovery source.
 */
function spreadLockLooksLikeMlBleed(lockOdds, peakOdds, spreadOdds, mlOdds) {
  if (lockOdds == null || !Number.isFinite(lockOdds)) return false;
  // Classic create-time default: lock stamped -110 while peak/spread is not.
  if (lockOdds === -110 && peakOdds != null && peakOdds !== -110) return true;
  if (lockOdds === -110 && spreadOdds != null && spreadOdds !== -110) return true;
  // Lock equals the ML price for this side, but Pinnacle's spread juice differs.
  if (mlOdds != null && lockOdds === mlOdds && spreadOdds != null
      && Math.abs(spreadOdds - mlOdds) >= 20) {
    return true;
  }
  return false;
}

function reconcileSide({ sd, side, pick, mkt, group, walletProfiles, now, force, agsCalibration, isProvenFn, isHcEligibleFn, walletStatsFn, walletPriorStatsFn, gameMeta = null }) {
  const pickDate = pick.date || TARGET_DATE;
  const sport = pick.sport;
  const lockStage = sd.lockStage || null;
  const currentStatus = sd.health?.status || sd.status || pick.status || null;

  // Gate: SHADOW sides with prior lock data are still processed so a
  // recovered pick can re-promote LOCKED → SHADOW → LOCKED in lock-step
  // with live AGS-U each cycle (pre-T-15).
  const isReprommotable = lockStage === 'SHADOW' && (sd.lock || sd.peak);
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
    // T-15 rescue stamp — surface the LOCKED/LEAN side with undefined
    // finalUnits to the caller as a special return code; the caller
    // owns the Firestore write (reconcileSide is intentionally NOT
    // async so it can stay a pure compute function). The rescue patch
    // forces finalUnits=0 + v8_agsTier='FADE' so the grader never sees
    // an undefined-units side; that's the PIT@ATL bug.
    if ((lockStage === 'LOCKED' || lockStage === 'LEAN')
        && (sd.finalUnits == null || !Number.isFinite(sd.finalUnits))) {
      return {
        skipped: true,
        reason: 'within_t_minus_15_needs_rescue',
        rescuePatch: {
          finalUnits: 0,
          v8_agsTier: 'FADE',
          v8_agsV12Tier: 'FADE',
          v8_hcStakeTier: 'FADE',
          v8_agsV12UnitsApplied: 0,
          v8_agsUnitsApplied: 0,
          _frozenFinalUnitsRescue: {
            at: now,
            reason: 'undefined_finalUnits_at_t_minus_15',
            priorLockStage: lockStage,
            priorAgsV12: sd.v8_agsV12 ?? null,
          },
        },
      };
    }
    return { skipped: true, reason: 'within_t_minus_15' };
  }

  // Reconstruct live wallet consensus — Δw / Δq / HC margin computed
  // for diagnostic stamping ONLY. AGS-U is the sole decision input.
  const live = computeWalletConsensus(group, side, sport, walletProfiles);

  // ─── AGS-U — recompute from current walletDetails every cycle ─────────
  // Reads frozen walletDetails[] from peak.v8Scoring (fall back to
  // lock.v8Scoring) and aggregates with the HC subset. v12 is now the
  // authoritative gate; v11 is computed in parallel and stamped for
  // back-compat / drift tracking.
  let agsResult = null;
  let agsV12Result = null;
  // ─── v12 SCORE now reads LIVE positions (cron-authoritative) ───────────
  // Previously this read ONLY the create-time-frozen snapshot. In cron-only
  // operation (the browser is read-only in production) that meant the v12
  // score never updated after lock — a 7 AM lock on a single wallet stayed
  // frozen all day while money piled in on the other side (Tampa Bay Rays /
  // LAD 2026-06-15: ELITE +0.99 frozen on 1 wallet, blind to a $17.4K
  // CONFIRMED conviction bet on the Dodgers). HC margin already reconstructs
  // from `group` live every cycle; the SCORE now does too, so both react to
  // the same live truth. Falls back to the frozen snapshot only when the
  // live group is empty (scanner gap / freshness prune wiped it), preserving
  // prior behavior for that edge. The T-15 freeze above still applies, so the
  // last pre-T-15 live re-score is what locks in near game time.
  const liveWd = Array.isArray(group) && group.length > 0
    ? group.map(positionToWalletDetail).filter(Boolean)
    : null;
  const frozenWd = sd.peak?.v8Scoring?.walletDetails || sd.lock?.v8Scoring?.walletDetails || null;
  const wd = (liveWd && liveWd.length > 0) ? liveWd : frozenWd;
  if (Array.isArray(wd) && wd.length > 0 && agsCalibration) {
    if (isProvenFn) {
      const agg = aggregateSideProven(wd, side, pick.sport, isProvenFn, isHcEligibleFn, walletStatsFn);
      if (agg) agsResult = computeAgs(agg, agsCalibration);
    }
    if (walletPriorStatsFn) {
      const aggV12 = aggregateSideV12(wd, side, pick.sport, walletPriorStatsFn);
      if (aggV12) agsV12Result = computeAgsV12(aggV12, agsCalibration);
    }
  }
  const agsValueLive = agsResult && Number.isFinite(agsResult.ags) ? agsResult.ags : null;
  const agsTotalProven = agsResult ? (agsResult.provenForCount || 0) + (agsResult.provenAgCount || 0) : 0;
  const scoreV12Live = agsV12Result && Number.isFinite(agsV12Result.agsV12) ? agsV12Result.agsV12 : null;

  // ─── v12 live side-flip detection (cron-authoritative) ─────────────────
  // If THIS side has gone non-positive on live data but the OPPOSITE side is
  // now the live-best with a positive score, the original lock is on the
  // WRONG side — it was locked early (e.g. 7 AM) before the sharp money
  // arrived on the other side. We supersede this side; the same-cycle
  // ghost-recovery + create-missing pass then rebuilds the live-best side
  // from current positions (reusing all the battle-tested side construction).
  // Conservative by design (no flapping): only fires when this side is ≤ 0
  // AND a different side is > 0, and only when we actually have live
  // positions to trust. We're already past the T-15 freeze gate here.
  let flipSupersede = false;
  let flipToSide = null;
  if (liveWd && liveWd.length > 0 && (scoreV12Live == null || scoreV12Live <= 0)) {
    const flipSides = mkt === 'TOTAL' ? ['over', 'under']
      : pick.sport === 'SOC' ? ['away', 'home', 'draw'] : ['away', 'home'];
    let bestOtherScore = -Infinity;
    for (const s of flipSides) {
      if (s === side) continue;
      const aggO = aggregateSideV12(liveWd, s, pick.sport, walletPriorStatsFn);
      const sc = aggO && Number.isFinite(aggO.score) ? aggO.score : null;
      if (sc != null && sc > bestOtherScore) { bestOtherScore = sc; flipToSide = s; }
    }
    if (bestOtherScore > 0) flipSupersede = true;
  }

  // v12 health gate is authoritative: score ≤ 0 → MUTED, score > 0 → ACTIVE.
  // v11 health is computed in parallel only for diagnostic purposes — its
  // result is not consulted for any decision.
  const baseHealth = evaluateBaseHealthV12({ scoreV12: scoreV12Live });
  const baseHealthV11Diagnostic = evaluateBaseHealth({
    ags: agsValueLive,
    agsProvenTotal: agsTotalProven,
    calibration: agsCalibration,
  });

  // No hysteresis. Whatever evaluateBaseHealthV12 says this cycle is what
  // we write. ACTIVE ↔ MUTED is free to flip every cycle until T-15.
  let appliedStatus = baseHealth.status;
  let appliedReason = baseHealth.reason;
  const mutedByAgs = appliedReason === 'agsv12_mute_below_zero'
                  || appliedReason === 'no_agsv12_signal';

  // Compute tier / stars / units — all derived from the v12 score now.
  const liveTier = agsV12Result ? agsV12Result.tier : 'FADE';
  const liveStars = starsFromTierV12(liveTier);
  const sideOdds = sd.peak?.odds ?? sd.lock?.odds ?? null;
  const liveUnits = appliedStatus === 'ACTIVE'
    ? unitsFromAgsV12(scoreV12Live, sideOdds, agsCalibration)
    : 0;
  // Sizing multiplier stamps (informational only; v8_agsUnitsMult is the
  // v11 multiplier, v8_agsV12UnitsRaw is the v12 ladder value pre-cap).
  const agsUnitsMult = agsValueLive != null
    ? agsSizeMultiplier(agsValueLive, agsCalibration)
    : 0;
  const agsV12UnitsRaw = scoreV12Live != null
    ? agsV12SizeMultiplier(scoreV12Live, agsCalibration)
    : 0;
  const liveUnitsPreAgs = (mkt === 'SPREAD' || mkt === 'TOTAL') ? BASE_UNITS_SPREAD_TOTAL : BASE_UNITS_ML;

  // ─── v12.1 HC-margin staking overlay (going-forward) ──────────────────
  // When the pick is on/after V12_1_EFFECTIVE_FROM, the STAKE + product tier
  // come from the HC margin (SUPER/TOP/CONFIRMED/MONITORING) rather than the
  // score quintile. liveTier (score quintile) is preserved as a diagnostic on
  // v8_agsV12Tier; v8_hcStakeTier carries the new product tier and finalUnits
  // reflects the HC-based size. Pre-cutover picks keep the score ladder.
  const v121Eligible = isV121Eligible(pickDate);
  let hcStakeTier = null;
  let finalUnitsApplied = liveUnits;
  if (v121Eligible && appliedStatus === 'ACTIVE' && scoreV12Live != null && scoreV12Live > 0) {
    const hc = hcStakeFromV12({
      scoreV12: scoreV12Live,
      scoreTier: liveTier,
      hcMargin: live.hcMargin,
      miniHcMargin: live.miniHcMargin,
      odds: sideOdds,
      calibration: agsCalibration,
    });
    hcStakeTier = hc.stakeTier;        // SUPER | TOP | MINI | CONFIRMED | MONITORING
    finalUnitsApplied = hc.units;      // odds-capped; MONITORING → 0u
  }

  // ─── v12abc HC-book overlays — TOP boost + MINI reduction ─────────────
  // Internal wallet-quality slice (proven-$ ROI + featured win-rate), same
  // point-in-time read as RANK-RESCUE. Computed once here, reused by the
  // SHARP-RESCUE block below. Inert before the SHARP_LIVE_FROM cutover.
  //   • TOP (HC margin 1) + proven-$ backer & mean wr ≥ floor → boost 4u → 5u
  //     (backtest: SHARP-pass TOP +41% vs +25% gate-fail).
  //   • MINI with NO proven-$ backer → cut 3u → 1u (gate-fail MINI ran −56%).
  let sharpQ = null;
  if (isSharpRescueLive(pickDate) && appliedStatus === 'ACTIVE'
      && scoreV12Live != null && scoreV12Live > 0) {
    sharpQ = computeSharpQuality(wd, side, pick.sport, walletProfiles);
    if (hcStakeTier === 'TOP' && sharpQ.provenDollar
        && sharpQ.meanPWr != null && sharpQ.meanPWr >= SHARP_WR_BASE) {
      finalUnitsApplied = Math.round(oddsCap(TOP_BOOST_UNITS, sideOdds) * 100) / 100;
      hcStakeTier = 'TOP+';
    } else if (hcStakeTier === 'MINI' && !sharpQ.provenDollar) {
      finalUnitsApplied = Math.round(oddsCap(MINI_REDUCED_UNITS, sideOdds) * 100) / 100;
      hcStakeTier = 'MINI-';
    }
  }

  // ─── Manual RANK-promotion override (wallet-rank coalition path) ──────
  // A pick explicitly promoted because the FOR side carried ≥2 top-ranked
  // whitelist wallets (point-in-time) is stamped with `sd.manualStake`. We
  // honor that bet size and tag the stake tier RANK, bypassing the HC sizer
  // — but ONLY while the base v12 signal is still ACTIVE and positive, so a
  // later side-flip or mute still demotes it honestly. Completely inert on
  // any doc that does not carry `manualStake`.
  if (Number.isFinite(sd.manualStake) && sd.manualStake > 0
      && appliedStatus === 'ACTIVE' && scoreV12Live != null && scoreV12Live > 0) {
    finalUnitsApplied = sd.manualStake;
    hcStakeTier = sd.manualStakeTier || 'RANK';
  }

  // ─── RANK-RESCUE: 2-for-0 wallet slice rescues an HC-muted pick ───────
  // When v12a's HC sizer muted a v12-shipped (score>0) pick to 0u but the FOR
  // side is 2-for-0 (≥2 eligible whitelist wallets backing, 0 against), promote
  // it to RANK_RESCUE_UNITS and tag the stake tier RANK. ONLY rescues muted
  // picks — never up-sizes an already-staked pick. manualStake (if present)
  // already set the size above, so we skip when one is in effect.
  //
  // The slice (and sharpQ below) are computed EVERY cycle — not just when a
  // rescue is possible — so the per-side census log always shows exactly what
  // the staking paths saw: how many whitelist wallets were visible, which
  // qualified, and why RANK / SHARP did or didn't fire. This is the audit
  // trail for "were all whitelisted positions counted this cycle?"
  let rankRescued = false;
  const rankSlice = computeRankSlice(wd, side, pick.sport, walletProfiles);
  if (v121Eligible && appliedStatus === 'ACTIVE' && scoreV12Live != null && scoreV12Live > 0
      && finalUnitsApplied === 0
      && !(Number.isFinite(sd.manualStake) && sd.manualStake > 0)) {
    if (rankSlice.qualifies) {
      finalUnitsApplied = RANK_RESCUE_UNITS;
      hcStakeTier = 'RANK';
      rankRescued = true;
    }
  }

  // ─── SHARP-RESCUE: v12abc "c" proven-$ + win-rate + 2-backer consensus ──
  // Rescues a v12-shipped pick the HC sizer (and RANK) left muted at 0u, when
  // the FOR side clears the internal wallet-quality gate. PRIME (mean wr ≥ 55)
  // sizes one notch up. Only ever rescues muted picks — never up-sizes.
  let sharpRescued = false;
  const sharpCensus = sharpQ || computeSharpQuality(wd, side, pick.sport, walletProfiles);
  if (isSharpRescueLive(pickDate) && appliedStatus === 'ACTIVE'
      && scoreV12Live != null && scoreV12Live > 0
      && finalUnitsApplied === 0 && !rankRescued
      && !(Number.isFinite(sd.manualStake) && sd.manualStake > 0)) {
    const q = sharpCensus;
    if (q.qualifies) {
      const u = q.prime ? SHARP_PRIME_UNITS : SHARP_UNITS;
      finalUnitsApplied = Math.round(oddsCap(u, sideOdds) * 100) / 100;
      hcStakeTier = q.prime ? 'SHARP-PRIME' : 'SHARP';
      sharpRescued = true;
    }
  }

  // ─── lockStage promote/demote — v12 gate ──────────────────────────────
  // Ship floor: v12 score > 0 (the mute boundary). Picks above 0 LOCK
  // with units determined by the ladder (SMALL 0.25u → ELITE 5u).
  // Picks at score ≤ 0 SHADOW (hidden). Wallet-pool adequacy is implicit
  // in the v12 score formula (non-HC_BASE wallets contribute 0).
  let appliedLockStage = lockStage;
  let lockStageReason = null;
  const passesShipFloor = appliedStatus === 'ACTIVE'
    && scoreV12Live != null
    && scoreV12Live > 0;
  if (passesShipFloor) {
    if (lockStage !== 'LOCKED') {
      appliedLockStage = 'LOCKED';
      lockStageReason = 'agsv12_positive_score';
    } else {
      appliedLockStage = 'LOCKED';
    }
  } else {
    if (lockStage !== 'SHADOW') {
      appliedLockStage = 'SHADOW';
      lockStageReason = appliedReason === 'agsv12_mute_below_zero'
        ? 'agsv12_mute_below_zero'
        : 'agsv12_no_signal';
    } else {
      appliedLockStage = 'SHADOW';
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
    ags: agsResult?.ags ?? null,
    agsV12: agsV12Result?.agsV12 ?? null,
    agsV12Tier: agsV12Result?.tier ?? null,
  };
  // Phase 3 — explicit mutedBy / unmutedBy stamps so the dashboard can
  // distinguish AGS quality-veto mutes from the legacy dw/dq health
  // mutes. Cleared when the gate is no longer firing.
  //
  // v12 cleanup: ALSO clear any lingering legacy `ags-hard-mute` value
  // written by the pre-v12 browser client-stamp path (the UI used to
  // overwrite `mutedBy` from a V11 hard-mute computation, which has been
  // removed but the stale string can still be sitting on a doc that
  // hasn't been visited since v12 went live). Without this clear, a pick
  // that v12 has un-muted to ELITE/5u still gets hidden by the UI's
  // `mutedBy != null` filter — manifesting as "biggest pick of the day
  // missing from the Locked Picks list".
  const LEGACY_UI_MUTE_VALUES = new Set(['ags-quality-veto', 'ags-hard-mute']);
  if (mutedByAgs) {
    patch.mutedBy = 'ags-quality-veto';
  } else if (LEGACY_UI_MUTE_VALUES.has(sd.mutedBy)) {
    patch.mutedBy = admin.firestore.FieldValue.delete();
  }
  if (stampedStatus !== appliedStatus) {
    const reasonNote = appliedReason ? ` (${appliedReason})` : '';
    changes.push(`status: ${stampedStatus || '∅'} → ${appliedStatus}${reasonNote}`);
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
  patch.v8_miniHcConfFor = live.miniHcConfFor;
  patch.v8_miniHcConfAg = live.miniHcConfAg;
  patch.v8_miniHcMargin = live.miniHcMargin;
  patch.v8_lockTier = liveTier;

  // AGS-Unified v12 — write canonical lockStage every cycle.
  patch.lockStage = appliedLockStage;
  if (lockStageReason) {
    patch.lockStageLastChange = {
      reason: lockStageReason, at: now,
      ags: agsResult?.ags ?? null,
      agsTier: agsResult?.tier ?? null,
      agsV12: agsV12Result?.agsV12 ?? null,
      agsV12Tier: agsV12Result?.tier ?? null,
      provenTotal: agsTotalProven,
      // Diagnostic-only — old gate inputs preserved for v6 report cohort
      // analysis. NOT consulted for any decision.
      dw: live.delta, dq: live.qualityMargin, hcMargin: live.hcMargin,
    };
  }
  if (stampedLockStage !== appliedLockStage) {
    changes.push(`lockStage: ${stampedLockStage || '∅'} → ${appliedLockStage}${lockStageReason ? ` (${lockStageReason})` : ''}`);
  }
  // Promotion route — every active LOCK is 'ags-unified-v12' (the
  // authoritative gate). Overwrite stale legacy values exactly once
  // on first-promote so historical picks migrate cleanly.
  if (passesShipFloor && sd.promotedBy !== 'ags-unified-v12') {
    const stampedPromotedBy = sd.promotedBy || null;
    patch.promotedBy = 'ags-unified-v12';
    changes.push(`promotedBy: ${stampedPromotedBy || '∅'} → ags-unified-v12 (v12=${scoreV12Live.toFixed(3)})`);
  }

  // v11 AGS stamp (informational only — still recorded every cycle so
  // historical reports + drift analysis continue to work, but no longer
  // consulted for any decision).
  if (agsResult) {
    patch.v8_ags = agsResult.ags;
    patch.v8_agsTierV11 = agsResult.tier;
    patch.v8_agsQuintile = agsResult.quintile;
    patch.v8_agsComponents = agsResult.components;
    patch.v8_agsProvenForCount = agsResult.provenForCount;
    patch.v8_agsProvenAgCount = agsResult.provenAgCount;
    patch.v8_agsCalibrationSource = agsResult.calibrationSource || 'firestore';
    patch.v8_agsEvaluatedAt = now;
    patch.v8_agsUnitsMult = agsUnitsMult;
    patch.v8_agsUnitsBase = liveUnitsPreAgs;
    // v8_agsUnitsApplied retained on the v11 logical block but mirrors the
    // authoritative applied units (so legacy consumers reading this field
    // see the same number as finalUnits).
    patch.v8_agsUnitsApplied = finalUnitsApplied;
  } else if (sd.v8_ags != null) {
    patch.v8_ags = admin.firestore.FieldValue.delete();
    patch.v8_agsTierV11 = admin.firestore.FieldValue.delete();
    patch.v8_agsQuintile = admin.firestore.FieldValue.delete();
    patch.v8_agsComponents = admin.firestore.FieldValue.delete();
  }

  // v12 AGS stamps — AUTHORITATIVE. v8_agsTier and finalUnits are the
  // single source of truth for the UI tier badge and grader bet size.
  if (agsV12Result) {
    patch.v8_agsTier = agsV12Result.tier;                  // authoritative tier
    patch.v8_agsV12 = agsV12Result.agsV12;
    patch.v8_agsV12Tier = agsV12Result.tier;
    patch.v8_agsV12Quintile = agsV12Result.quintile;
    patch.v8_agsV12ForCount = agsV12Result.forCount;
    patch.v8_agsV12AgCount = agsV12Result.agCount;
    patch.v8_agsV12ForMean = agsV12Result.forMean;
    patch.v8_agsV12AgMean = agsV12Result.agMean;
    patch.v8_agsV12UnitsRaw = agsV12UnitsRaw;              // ladder pre odds-cap
    patch.v8_agsV12UnitsApplied = finalUnitsApplied;       // mirrors finalUnits
    patch.v8_agsV12CalibrationSource = agsV12Result.calibrationSource || 'fallback';
    patch.v8_agsV12EvaluatedAt = now;
    // v12.1 — product stake tier from the HC margin (going-forward). Null
    // for pre-cutover picks so the dashboard/UI fall back to the score tier.
    if (v121Eligible) {
      patch.v8_hcStakeTier = hcStakeTier;
    }
    // CANONICAL bet size — grader + dashboard read only this. Under v12.1
    // this is the HC-based size (MONITORING → 0u); pre-cutover it's the ladder.
    patch.finalUnits = finalUnitsApplied;
    // Drift logging.
    const stampedV12 = sd.v8_agsV12;
    const v12Changed = stampedV12 == null
      || !Number.isFinite(stampedV12)
      || Math.abs(stampedV12 - agsV12Result.agsV12) >= 0.01;
    const stampedTierField = sd.v8_agsTier;
    const tierChanged = stampedTierField !== agsV12Result.tier;
    const v12UnitsDrifted = Math.abs((sd.finalUnits ?? 0) - finalUnitsApplied) >= 0.05;
    if (v12Changed || tierChanged || v12UnitsDrifted) {
      const tierNote = v121Eligible ? `${agsV12Result.tier}/${hcStakeTier}` : agsV12Result.tier;
      changes.push(`AGS-v12: ${stampedV12 == null ? '∅' : stampedV12.toFixed(3)} → ${agsV12Result.agsV12.toFixed(3)} (${tierNote} → ${finalUnitsApplied}u, ladder=${agsV12UnitsRaw.toFixed(2)}u)`);
    }
  } else {
    // No v12 result for ANY reason (missing walletDetails, missing
    // walletPriorStatsFn, aggregateSideV12 returned null, etc.). Treat
    // the side as fully unsignaled and stamp a DETERMINISTIC mute so
    // the grader never sees an undefined-units side later.
    //
    // CRITICAL: these stamps are unconditional. The previous version of
    // this branch only cleared `v8_agsV12` if it already existed and
    // only cleared `v8_agsTier` if it already existed — which meant a
    // brand-new side that the browser promoted but the cron's v12 path
    // failed on stayed in limbo (no v12 stamps, no tier, no
    // finalUnits). That's the PIT@ATL bug. Belt-and-suspenders with the
    // T-15 rescue stamp above.
    patch.v8_agsTier = 'FADE';
    patch.v8_agsV12Tier = 'FADE';
    patch.v8_agsV12UnitsApplied = 0;
    patch.finalUnits = 0;
    // v12.1 — no signal → FADE stake tier (going-forward), else clear stale.
    if (v121Eligible) {
      patch.v8_hcStakeTier = 'FADE';
    } else if (sd.v8_hcStakeTier != null) {
      patch.v8_hcStakeTier = admin.firestore.FieldValue.delete();
    }
    if (sd.v8_agsV12 != null) {
      patch.v8_agsV12 = admin.firestore.FieldValue.delete();
      patch.v8_agsV12Quintile = admin.firestore.FieldValue.delete();
      changes.push(`AGS-v12: ${(sd.v8_agsV12 ?? 0).toFixed?.(3) ?? sd.v8_agsV12} → ∅ (no v12 signal — muted)`);
    } else if (sd.v8_agsTier == null) {
      changes.push(`AGS-v12: ∅ → ∅ (no signal — defensively muted to FADE/0u)`);
    }
  }
  if (rankRescued) {
    changes.push(`RANK-RESCUE: 2-for-0 slice promoted HC-muted pick → ${RANK_RESCUE_UNITS}u`);
  }
  // finalUnits drift logging — flag any time the canonical bet size changes
  // by ≥0.05u so cycle output makes the change visible.
  if (Number.isFinite(sd.finalUnits) && Math.abs(sd.finalUnits - finalUnitsApplied) >= 0.05) {
    changes.push(`finalUnits: ${sd.finalUnits}u → ${finalUnitsApplied}u`);
  } else if (sd.finalUnits == null) {
    changes.push(`finalUnits backfill: ${finalUnitsApplied}u`);
  }

  // ── Descriptive peak stats refresh (display-only, every cycle authoritative).
  // Background: peak.{sharpCount, totalInvested, consensusStrength, walletProfile}
  // are the fields the locked-pick card renders ("$77.9K · 100% Pistons ·
  // 2 sharps backing"). Without this block they get frozen at lock-in
  // time — and if the doc was created during a JSON-load race or before
  // sharp_action_positions had been written for this game, those fields
  // stamp as 0 / 0 / 50% / LEAN and never recover. The browser's
  // peakShouldWrite gate only fires when units/stars rise, not when
  // descriptive stats were initialized broken-empty.
  //
  // Mirrors the v8_* re-stamp contract — recompute from live positions
  // every cycle pre-T-15 so the locked-pick card always shows current
  // wallet-stack reality. Skipped when the live group is empty AND we
  // have prior good data, so a hiccupping position scan never wipes a
  // healthy peak. Lock-time snapshot is also backfilled when detected as
  // broken-empty (totalInvested=0 ∧ sharpCount=0); legitimate frozen
  // lock snapshots with real $$$ at lock-in are preserved untouched.
  const groupHasPositions = Array.isArray(group) && group.length > 0;
  const priorPeakHadMoney = (sd.peak?.totalInvested ?? 0) > 0;
  const skipDescriptiveRefresh = !groupHasPositions && priorPeakHadMoney;
  if (!skipDescriptiveRefresh) {
    const peakStats = buildPeakStatsFromPositions(group || [], side, isProvenFn, sport);
    const peakSharpCountChanged = (sd.peak?.sharpCount ?? 0) !== peakStats.sharpCount;
    const peakInvestedChanged = (sd.peak?.totalInvested ?? 0) !== peakStats.totalInvested;
    const peakMoneyPctChanged = (sd.peak?.consensusStrength?.moneyPct ?? 50) !== peakStats.consensusStrength.moneyPct;
    const peakWalletPctChanged = (sd.peak?.consensusStrength?.walletPct ?? 50) !== peakStats.consensusStrength.walletPct;
    const peakGradeChanged = (sd.peak?.consensusStrength?.grade || 'LEAN') !== peakStats.consensusStrength.grade;
    const peakDrifted = peakSharpCountChanged || peakInvestedChanged
      || peakMoneyPctChanged || peakWalletPctChanged || peakGradeChanged;
    if (peakDrifted) {
      patch.peak = {
        ...(patch.peak || {}),
        sharpCount: peakStats.sharpCount,
        totalInvested: peakStats.totalInvested,
        consensusStrength: peakStats.consensusStrength,
        // Merge walletProfile — preserve any browser-written keys
        // (e.g. proPnLSum) the cron doesn't compute itself.
        walletProfile: { ...(sd.peak?.walletProfile || {}), ...peakStats.walletProfile },
        updatedAt: now,
      };
      const beforeMoney = Math.round(sd.peak?.totalInvested || 0).toLocaleString();
      const afterMoney = peakStats.totalInvested.toLocaleString();
      const beforePct = sd.peak?.consensusStrength?.moneyPct ?? '∅';
      const afterPct = peakStats.consensusStrength.moneyPct;
      changes.push(
          `peakStats: ${sd.peak?.sharpCount ?? '∅'}/$${beforeMoney}/${beforePct}% → `
        + `${peakStats.sharpCount}/$${afterMoney}/${afterPct}%`,
      );
    }
    // Lock backfill — only when stuck-empty (race condition at write time).
    // True frozen lock snapshots (with real $$$ at lock-in) are preserved.
    const lockStuckEmpty = (sd.lock?.totalInvested ?? 0) === 0
      && (sd.lock?.sharpCount ?? 0) === 0
      && peakStats.totalInvested > 0;
    if (lockStuckEmpty) {
      patch.lock = {
        ...(patch.lock || {}),
        sharpCount: peakStats.sharpCount,
        totalInvested: peakStats.totalInvested,
        consensusStrength: peakStats.consensusStrength,
        walletProfile: { ...(sd.lock?.walletProfile || {}), ...peakStats.walletProfile },
      };
      changes.push(
          `lockStats backfill: 0/$0/50% → `
        + `${peakStats.sharpCount}/$${peakStats.totalInvested.toLocaleString()}/${peakStats.consensusStrength.moneyPct}%`,
      );
    }
  }

  // ── SPREAD lock-odds repair (ML bleed / -110 default) ───────────────────
  // Real incident 2026-07-09 Braves -1.5: create stamped lock.odds=-110
  // (ML chalk / TOTAL-style default) while peak later correctly held +139
  // retail / +144 Pinnacle spread juice. Pre-T-15, rewrite lock from the
  // best available spread source so Locked / CLV / payout match the ticket.
  if (pick.status !== 'COMPLETED' && mkt === 'SPREAD') {
    const metaKey = `${sport}|${pick.gameKey}`;
    const meta = gameMeta?.get?.(metaKey) || null;
    const spreadOdds = side === 'home'
      ? (meta?.spreadCurrent?.homeOdds ?? meta?.spreadOpener?.homeOdds)
      : (meta?.spreadCurrent?.awayOdds ?? meta?.spreadOpener?.awayOdds);
    const mlOdds = side === 'home' ? meta?.mlOdds?.home : meta?.mlOdds?.away;
    const peakOdds = Number.isFinite(sd.peak?.odds) ? sd.peak.odds : null;
    const lockOdds = Number.isFinite(sd.lock?.odds) ? sd.lock.odds : null;
    const repairFrom = (Number.isFinite(spreadOdds) && spreadOdds !== -110)
      ? spreadOdds
      : (peakOdds != null && peakOdds !== -110 ? peakOdds : null);
    if (repairFrom != null
        && spreadLockLooksLikeMlBleed(lockOdds, peakOdds, spreadOdds, mlOdds)) {
      const pinnSpread = Number.isFinite(spreadOdds) ? spreadOdds : repairFrom;
      patch.lock = {
        ...(patch.lock || {}),
        odds: repairFrom,
        pinnacleOdds: pinnSpread,
        book: sd.lock?.book === 'Pinnacle' || !sd.lock?.book
          ? 'Pinnacle'
          : sd.lock.book,
      };
      // Keep peak.pinnacleOdds on the spread number too when it was ML-bleed.
      if (sd.peak?.pinnacleOdds === -110 || sd.peak?.pinnacleOdds === mlOdds) {
        patch.peak = {
          ...(patch.peak || {}),
          pinnacleOdds: pinnSpread,
          ...(peakOdds === -110 || peakOdds === mlOdds ? { odds: repairFrom } : {}),
          updatedAt: now,
        };
      }
      changes.push(
        `spreadOdds repair: lock ${lockOdds ?? '∅'} → ${repairFrom}`
        + ` (was ML-bleed/default; pinn spread ${pinnSpread})`,
      );
    }
  }

  // ── v12 peak/lock refresh (stars/units/unitTier/team) ───────────────────
  // The browser's pre-v12 syncPickToFirebase wrote peak.stars/units/unitTier
  // from v9's decideLockStage. When v12 disagrees (e.g. Nationals 2026-06-01
  // is v12=ELITE/5u but v9 was FADE/0u with peak.stars=1), the UI's display
  // gate / sizing fallbacks can hide or misrender the pick. Mirror cron's
  // authoritative v12 values into peak/lock every cycle so legacy-created
  // picks always render at their true v12 size. Skip COMPLETED picks (peak/
  // lock are frozen-at-grade-time records the dashboard depends on).
  if (pick.status !== 'COMPLETED' && agsV12Result && passesShipFloor) {
    const v12Stars = starsFromTierV12(agsV12Result.tier);
    const v12UnitTier = unitTierLabel(liveUnits);
    const sideTeam = side === 'away'
      ? pick.away
      : side === 'home'
        ? pick.home
        : null;
    const peakTeamCanonical = mkt === 'TOTAL'
      ? (sd.peak?.team || (side === 'over' ? 'Over' : 'Under'))
      : (sd.peak?.team || sideTeam || side);
    const peakStarsDrifted = (sd.peak?.stars ?? 0) !== v12Stars;
    const peakUnitsDrifted = Math.abs((sd.peak?.units ?? 0) - liveUnits) >= 0.05;
    const peakTierDrifted = (sd.peak?.unitTier || null) !== v12UnitTier;
    const peakTeamMissing = sd.peak?.team == null && peakTeamCanonical != null;
    if (peakStarsDrifted || peakUnitsDrifted || peakTierDrifted || peakTeamMissing) {
      patch.peak = {
        ...(patch.peak || {}),
        stars: v12Stars,
        units: liveUnits,
        unitTier: v12UnitTier,
        team: peakTeamCanonical,
        updatedAt: now,
      };
      changes.push(`v12 peak refresh: stars ${sd.peak?.stars ?? '∅'}→${v12Stars} · units ${sd.peak?.units ?? '∅'}→${liveUnits} · tier ${sd.peak?.unitTier ?? '∅'}→${v12UnitTier}`);
    }
    const lockStarsDrifted = (sd.lock?.stars ?? 0) !== v12Stars;
    const lockUnitsDrifted = Math.abs((sd.lock?.units ?? 0) - liveUnits) >= 0.05;
    const lockTierDrifted = (sd.lock?.unitTier || null) !== v12UnitTier;
    const lockTeamMissing = sd.lock?.team == null && peakTeamCanonical != null;
    if (lockStarsDrifted || lockUnitsDrifted || lockTierDrifted || lockTeamMissing) {
      patch.lock = {
        ...(patch.lock || {}),
        stars: v12Stars,
        units: liveUnits,
        unitTier: v12UnitTier,
        team: peakTeamCanonical,
      };
      changes.push(`v12 lock refresh: stars ${sd.lock?.stars ?? '∅'}→${v12Stars} · units ${sd.lock?.units ?? '∅'}→${liveUnits}`);
    }
  }

  if (stampedConsVer !== WHITELIST_CONSENSUS_VERSION) {
    changes.push(`consVer: ${stampedConsVer ?? '∅'} → ${WHITELIST_CONSENSUS_VERSION}`);
  }
  if (stampedDw !== live.delta) changes.push(`dw: ${stampedDw ?? '∅'} → ${live.delta}`);
  if (stampedDq !== live.qualityMargin) changes.push(`dq: ${stampedDq ?? '∅'} → ${live.qualityMargin}`);
  if (stampedHc !== live.hcMargin) changes.push(`HC_m: ${stampedHc ?? '∅'} → ${live.hcMargin}`);
  if (stampedTier && stampedTier !== liveTier) changes.push(`tier: ${stampedTier} → ${liveTier}`);

  // ─── v12 live side-flip — supersede the wrong side ─────────────────────
  // Mark this side superseded so the main loop can demote the doc to "ghost"
  // and let createMissingLockedPicks rebuild the live-best side this cycle.
  // The FADE/0u stamps from the mute path above still write alongside, so
  // the grader/record see an honest 0u faded side until it's superseded.
  if (flipSupersede && !sd.superseded) {
    patch.superseded = true;
    patch.supersededAt = now;
    patch.supersededReason = 'v12_live_side_flip';
    patch.supersededFlipTo = flipToSide;
    changes.push(`superseded: live side-flip → ${flipToSide} (this side ${scoreV12Live == null ? '∅' : scoreV12Live.toFixed(2)} ≤ 0)`);
  }

  wroteAnything = changes.length > 0 || stampedStatus !== appliedStatus;

  // Persist the refreshed live snapshot so peak.v8Scoring no longer carries
  // the stale create-time wallet set. This hardens the cron-only fallback:
  // on a future empty-group cycle we fall back to the LAST GOOD live snapshot
  // instead of the original (often single-wallet) create-time freeze. Only
  // written on cycles we're already writing, and only when live data exists.
  if (wroteAnything && liveWd && liveWd.length > 0) {
    patch.peak = {
      ...(patch.peak || {}),
      v8Scoring: { walletDetails: liveWd, consensusSide: side },
      updatedAt: now,
    };
  }

  return {
    skipped: false,
    wrote: wroteAnything,
    patch,
    changes,
    live,
    // Whitelist census — what the staking paths actually saw this cycle.
    // Printed for EVERY evaluated side (even no-change cycles) so cron logs
    // are a complete audit trail of position visibility. `wdSource` exposes
    // whether the score ran on live positions or the create-time freeze —
    // 'frozen' on a game with known live money means positions are being
    // lost upstream (scan gap / stale prune / mis-graded doc).
    census: {
      wdCount: Array.isArray(wd) ? wd.length : 0,
      wdSource: (liveWd && liveWd.length > 0) ? 'live' : (frozenWd && frozenWd.length > 0 ? 'frozen' : 'none'),
      forW: live.forW,
      agW: live.agW,
      hcMargin: live.hcMargin,
      rank: rankSlice,
      rankRescued,
      sharp: sharpCensus,
      sharpRescued,
      score: scoreV12Live,
      stakeTier: hcStakeTier,
      units: finalUnitsApplied,
    },
    expectedStatus: appliedStatus,
    expectedReason: appliedReason,
    expectedTier: liveTier,
    expectedUnits: liveUnits,
    expectedLockStage: appliedLockStage,
    lockStageReason,
    agsuDemoted: stampedLockStage === 'LOCKED' && appliedLockStage === 'SHADOW',
    agsuPromoted: stampedLockStage === 'SHADOW' && appliedLockStage === 'LOCKED',
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

  // Load AGS-U calibration + build the proven / HC-eligible predicates.
  // AGS-U v12 is the SOLE decision input — drives lock/mute/sizing for every
  // pick. v11 predicates + walletStatsFn are still built so the v11 score
  // can be computed in parallel for diagnostic stamping and the daily report.
  const agsCalibration = await loadAgsCalibration(db);
  const isProvenFn = buildIsProvenFn(walletProfiles);
  const isHcEligibleFn = buildIsHcEligibleFn(walletProfiles);
  const walletStatsFn = buildWalletStatsFn(walletProfiles); // v11 — drives dWinnerCtPreA
  const walletPriorStatsFn = buildWalletPriorStatsFn(walletProfiles); // v12 — drives quality formula
  console.log(`AGS-U calibration: source=${agsCalibration.source} sampleSize=${agsCalibration.sampleSize ?? '?'} computedAt=${agsCalibration.computedAt ?? '?'}`);
  if (agsCalibration.quintiles) {
    const q = agsCalibration.quintiles;
    console.log(`AGS-U v11 quintiles:   q20=${q.q20?.toFixed?.(2) ?? '?'}(MUTE) q60=${q.q60?.toFixed?.(2) ?? '?'}(LOCK) q80=${q.q80?.toFixed?.(2) ?? '?'}(PREMIUM) q90=${q.q90?.toFixed?.(2) ?? '?'}(ELITE)`);
  }
  const v12Q = agsCalibration.v12Quintiles || AGS_V12_FALLBACK_CALIBRATION.v12Quintiles;
  const v12Src = agsCalibration.v12Quintiles ? agsCalibration.source : 'fallback';
  console.log(`AGS-U v12 quintiles:   q20=${v12Q.q20.toFixed(3)}(WEAK→LEAN) q40=${v12Q.q40.toFixed(3)}(LEAN→LOCK) q60=${v12Q.q60.toFixed(3)}(LOCK→PREMIUM) q80=${v12Q.q80.toFixed(3)}(PREMIUM→ELITE)  source=${v12Src}  (positive-only; score≤0 → FADE/muted)`);

  // Load today's positions (live wallet activity) from Firestore.
  // (Could also read from public/sharp_positions.json but Firestore stays
  // closer to truth post-writeSharpActions.)
  const posSnap = await db.collection('sharp_action_positions')
    .where('date', '==', TARGET_DATE)
    .get();
  const rawPositions = [];
  posSnap.forEach(d => rawPositions.push({ _id: d.id, ...d.data() }));

  // ── Stale-position freshness filter ────────────────────────────────────
  // writeSharpActions doesn't delete positions when a wallet closes them
  // (the scanner only reports OPEN positions, so a closed position simply
  // disappears from subsequent scans without ever being marked closed in
  // Firestore). That's how 52aeeb on cle_det/SPREAD/home shows up at
  // updatedAt=6:04 PM (its last scan-of-record) while the wallet has
  // since flipped to away — the home doc is a phantom that
  // buildPeakStatsFromPositions would happily add into the proven-NBA
  // total, double-counting the same wallet on both sides and inflating
  // peak.totalInvested.
  //
  // 2026-05-10 — widened from 90s → 30 min. The original 90s window
  // assumed every wallet gets re-scanned every cycle. In reality the
  // Polymarket activity feed is rate-limited and noisy: wallets that
  // didn't trade this cycle simply don't reappear in the new scan,
  // even when they're still holding the same position. The 90s window
  // was treating "scanner silence" as "wallet exited" and pruning
  // legitimate live positions, which then demoted LOCKED picks to
  // SHADOW pre-T-15 (Tampa Bay Rays / Toronto Blue Jays / COL-PHI /
  // HOU-CIN incidents on 2026-05-10 all had this signature: forW
  // collapsed because b19a27 + others were stale-pruned despite
  // currently holding positions worth $20k–$269k each).
  //
  // 30 min ≈ 4 cron cycles, which is generous enough to ride out a
  // wallet that goes 2-3 scans without showing up in the activity feed
  // but still tight enough that an actually-closed position will fall
  // out within ~half a game window. The proper fix is a per-wallet
  // scan heartbeat in writeSharpActions so we can distinguish "wallet
  // scanned, no position" (true exit) from "wallet not scanned"
  // (presumed active) — see TODO_SCANNER_HEARTBEAT.md.
  const tsMs = (p) => {
    const ts = p.updatedAt;
    if (!ts) return 0;
    if (typeof ts.toMillis === 'function') return ts.toMillis();
    if (typeof ts._seconds === 'number') return ts._seconds * 1000;
    if (ts instanceof Date) return ts.getTime();
    return 0;
  };
  const maxUpdatedMs = rawPositions.reduce((m, p) => Math.max(m, tsMs(p)), 0);
  const FRESHNESS_WINDOW_MS = 30 * 60 * 1000; // 30 min — see comment above (was 90s pre-2026-05-10)
  let prunedStale = 0;
  const positions = maxUpdatedMs > 0
    ? rawPositions.filter(p => {
        const t = tsMs(p);
        if (t === 0) return true; // missing updatedAt — keep, can't judge
        const fresh = t >= maxUpdatedMs - FRESHNESS_WINDOW_MS;
        if (!fresh) prunedStale++;
        return fresh;
      })
    : rawPositions;
  if (prunedStale > 0) {
    console.log(`  ↳ pruned ${prunedStale} stale position(s) outside ${FRESHNESS_WINDOW_MS/60000}min of latest scan (${new Date(maxUpdatedMs).toISOString()})`);
  }

  const groups = buildPositionGroupsFromFirestore(positions);
  console.log(`Loaded ${positions.length} sharp_action_positions in ${groups.size} game-market clusters`);

  // Load today's pick docs.
  const collections = ['sharpFlowPicks', 'sharpFlowSpreads', 'sharpFlowTotals'];
  const collectionWrites = new Map(); // colName → [{ docId, sideKey, patch }]
  const existingDocIds = new Set();   // `${col}|${docId}` of every existing pick (for create-missing pass)
  const stats = {
    examined: 0,
    skipped_not_locked: 0,
    skipped_completed: 0,
    skipped_t15: 0,
    wrote: 0,
    status_changes: 0,
    agsu_demoted_to_shadow: 0,
    agsu_promoted_to_locked: 0,
    agsu_hard_muted: 0,
    no_change: 0,
    created_missing: 0,
    ags_both_sides_refreshed: 0,
  };
  const changeLog = [];
  const censusLog = [];   // whitelist-visibility audit — one row per evaluated side, every cycle

  // Helper — extract commenceTime ms across all the storage shapes Firestore
  // returns (Timestamp, number, _seconds, Date, ISO string). Identical to
  // the path inside reconcileSide so the T-15 freeze gate matches per-side
  // and per-doc behaviour exactly.
  const commenceMs = (val) => {
    if (val == null) return null;
    if (typeof val === 'number') return val;
    if (typeof val.toMillis === 'function') return val.toMillis();
    if (typeof val._seconds === 'number') return val._seconds * 1000;
    if (val instanceof Date) return val.getTime();
    if (typeof val === 'string') return new Date(val).getTime();
    return null;
  };

  // Track docs that exist but have NO live (non-superseded) sides — "ghost"
  // docs. Without this guard, createMissingLockedPicks skips these docs
  // (because the docId is in existingDocIds) and the cron can never recover
  // them. Real-world incident 2026-05-09: Thunder ATS doc showed
  // sides:{} after a writer race; the cron silently skipped it for hours
  // and the LOCKED pick disappeared from the dashboard right before tip.
  const ghostDocIds = new Set();
  for (const col of collections) {
    const snap = await db.collection(col).where('date', '==', TARGET_DATE).get();
    for (const docSnap of snap.docs) {
      const pick = { _id: docSnap.id, ...docSnap.data() };
      const mkt = col === 'sharpFlowSpreads' ? 'SPREAD' : col === 'sharpFlowTotals' ? 'TOTAL' : 'ML';
      const sides = pick.sides || {};
      // A doc is "ghost" if it has zero sides at all OR every side is
      // superseded (and not COMPLETED — a graded pick can have only
      // superseded sides legitimately). We let createMissingLockedPicks
      // re-evaluate by NOT adding it to existingDocIds.
      const sideEntries = Object.entries(sides);
      const liveSides = sideEntries.filter(([, sd]) => sd && !sd.superseded);
      const isGhost = pick.status !== 'COMPLETED' && liveSides.length === 0;
      if (isGhost) {
        ghostDocIds.add(`${col}|${pick._id}`);
        console.warn(`  ⚠ GHOST doc detected: ${col}/${pick._id} (${sideEntries.length} side(s), 0 live) — will let createMissingLockedPicks rebuild`);
      } else {
        existingDocIds.add(`${col}|${pick._id}`);
      }
      // Track sides reconcile superseded THIS cycle (v12 live side-flip) so we
      // can demote the doc to ghost below and rebuild the better side now.
      const newlySuperseded = new Set();
      for (const [sideKey, sd] of Object.entries(sides)) {
        if (!sd) continue;
        stats.examined++;
        const groupKey = `${pick.sport}|${pick.gameKey}|${mkt}`;
        const group = groups.get(groupKey) || [];
        const result = reconcileSide({
          sd, side: sideKey, pick, mkt, group, walletProfiles, now,
          force: FORCE,
          agsCalibration, isProvenFn, isHcEligibleFn, walletStatsFn, walletPriorStatsFn,
          gameMeta,
        });
        if (result.skipped) {
          if (result.reason === 'not_locked_or_lean') stats.skipped_not_locked++;
          else if (result.reason === 'completed') stats.skipped_completed++;
          else if (result.reason === 'within_t_minus_15') stats.skipped_t15++;
          else if (result.reason === 'within_t_minus_15_needs_rescue') {
            // T-15 rescue write — reconcileSide flagged an undefined
            // finalUnits on a LOCKED/LEAN side at freeze. Stamp the
            // deterministic 0u/FADE mute so the grader doesn't mark
            // the pick tracked=true. See PIT@ATL bug 2026-06-07.
            stats.skipped_t15++;
            if (!DRY_RUN && result.rescuePatch) {
              const ref = db.collection(col).doc(pick._id);
              await ref.set(
                { sides: { [sideKey]: result.rescuePatch }, lastWriteAt: now, lastAction: 'finalUnits_rescue_at_freeze' },
                { merge: true },
              );
              console.warn(`  ↻ T-15 RESCUE: ${col}/${pick._id} ${sideKey} — forced finalUnits=0 + v8_agsTier=FADE (undefined at freeze)`);
            }
          }
          continue;
        }
        if (result.census) {
          censusLog.push({ col, docId: pick._id, side: sideKey, census: result.census });
        }
        if (!result.wrote) {
          stats.no_change++;
          continue;
        }
        if (result.agsuDemoted) stats.agsu_demoted_to_shadow++;
        if (result.agsuPromoted) stats.agsu_promoted_to_locked++;
        if (result.expectedReason === 'agsv12_mute_below_zero') stats.agsu_hard_muted++;
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
        if (result.patch?.superseded === true) newlySuperseded.add(sideKey);
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

      // ── Same-cycle v12 side-flip → ghost demotion ─────────────────────
      // If reconcile superseded the last live side(s) this cycle, the doc now
      // carries 0 live sides. Remove it from existingDocIds so the
      // create-missing pass (which runs AFTER the supersede writes commit)
      // rebuilds the live-best side from current positions THIS cycle, instead
      // of leaving the game with no pick for a full cron cycle.
      if (pick.status !== 'COMPLETED' && newlySuperseded.size > 0) {
        const remainingLive = liveSides.filter(([k]) => !newlySuperseded.has(k));
        if (remainingLive.length === 0 && existingDocIds.has(`${col}|${pick._id}`)) {
          existingDocIds.delete(`${col}|${pick._id}`);
          ghostDocIds.add(`${col}|${pick._id}`);
          console.warn(`  ↻ v12 side-flip: ${col}/${pick._id} — superseded [${[...newlySuperseded].join(', ')}]; create-missing will add the live-best side this cycle`);
        }
      }

      // ── Both-sides analytical sidecar refresh ─────────────────────────
      // Independent of reconcileSide. Documents both sides' AGS / HC
      // margin / Δw / Δq into doc-level `agsBothSides` every cycle
      // pre-T-15 so we can later analyze the side we DIDN'T pick. NEVER
      // consulted by lock-promote / sizing / grader paths — purely an
      // analytical record. Skipped post-T-15 (matches per-side freeze)
      // and on graded picks (already final).
      const ct = commenceMs(pick.commenceTime);
      const isFrozen = ct != null && now >= ct - T_MINUS_15_MIN_MS && !FORCE;
      const isCompleted = pick.status === 'COMPLETED';
      if (!isFrozen && !isCompleted) {
        const groupKey = `${pick.sport}|${pick.gameKey}|${mkt}`;
        const group = groups.get(groupKey) || [];
        const stamps = computeBothSidesAnalytics(
          group, mkt, pick.sport, walletProfiles, agsCalibration, isProvenFn, isHcEligibleFn, walletStatsFn, walletPriorStatsFn,
        );
        if (stamps) {
          stats.ags_both_sides_refreshed++;
          if (!collectionWrites.has(col)) collectionWrites.set(col, []);
          collectionWrites.get(col).push({
            docId: pick._id,
            payload: {
              agsBothSides: { ...stamps, updatedAt: now },
              lastSyncAt: now,
            },
          });
        }
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

  // ── Whitelist census — the "were all whitelisted positions counted?" audit.
  // One line per evaluated side EVERY cycle (including no-change cycles):
  //   wd     = positions visible to the score (source: live | frozen | none)
  //   wl     = CONFIRMED/FLAT whitelist wallets for-against
  //   rank   = RANK-eligible (CONFIRMED/FLAT/WR50, ≥8 in-sport picks) backing-against
  //            [✓ marks a fired 2-for-0 rescue]
  //   sharp$ = best FOR-backer dollarRoi / mean picks.wr (proven-$ path inputs)
  //   →      = resulting stake tier + units this cycle
  // A 'frozen' wd source on a game with live money, or a rank slice that
  // undercounts wallets visible on the site, means positions are being lost
  // upstream (scan gap / stale prune / mis-graded position doc).
  console.log(`\n── Whitelist census (${censusLog.length} side(s)) ──`);
  for (const c of censusLog) {
    const cs = c.census;
    const rankMark = cs.rankRescued ? ' ✓RESCUED' : (cs.rank.qualifies ? ' (qualifies)' : '');
    const sharpRoi = Number.isFinite(cs.sharp?.maxQRoi) ? `${cs.sharp.maxQRoi.toFixed(1)}%` : '—';
    const sharpWr = cs.sharp?.meanPWr != null ? cs.sharp.meanPWr.toFixed(1) : '—';
    const sharpMark = cs.sharpRescued ? ' ✓RESCUED' : '';
    console.log(
      `  ${c.col.replace('sharpFlow', '').toUpperCase()} ${c.docId}/${c.side}: `
      + `wd=${cs.wdCount}(${cs.wdSource}) wl=${cs.forW}-${cs.agW} hc=${cs.hcMargin} `
      + `rank=${cs.rank.backing}-${cs.rank.against}${rankMark} `
      + `sharp$=${sharpRoi}/wr${sharpWr}${sharpMark} `
      + `→ ${cs.stakeTier || '∅'} ${cs.units}u (score=${cs.score == null ? '∅' : cs.score.toFixed(3)})`
    );
  }

  // Apply writes (unless dry run). Merge per-side patches into a single
  // payload per docId — Firestore batches keep only the LAST set() on a
  // given ref, so two sides of the same pick (home + away) would clobber
  // each other unless we coalesce up front.
  if (!DRY_RUN) {
    for (const [col, writes] of collectionWrites) {
      // Coalesce per-doc payloads. CRITICAL: we MUST NOT include `sides: {}`
      // in the final payload when there are no per-side patches for a doc.
      // Firestore's set({sides:{}}, {merge:true}) does NOT no-op the empty
      // map — it WIPES the entire `sides` field. That's how every doc with
      // an agsBothSides-only refresh ended up as a "ghost" (sides:{}) every
      // single cron cycle. Verified empirically 2026-05-09.
      const merged = new Map(); // docId → coalesced payload
      for (const w of writes) {
        const cur = merged.get(w.docId) || { lastSyncAt: 0 };
        if (w.payload.sides && Object.keys(w.payload.sides).length > 0) {
          if (!cur.sides) cur.sides = {};
          Object.assign(cur.sides, w.payload.sides);
        }
        // Doc-level analytical sidecar — last-write wins across the cycle.
        if (w.payload.agsBothSides) cur.agsBothSides = w.payload.agsBothSides;
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

  // ── Create-missing pass ────────────────────────────────────────────────
  // Scan every (sport|gameKey|mkt) group of sharp_action_positions and
  // write a fresh pick doc for any side that passes the v7.5 floor but
  // doesn't have an existing doc. Closes the "browser-only writer" gap.
  const gameMeta = loadGameMetadata();
  console.log(`\n── Create-missing pass ──`);
  console.log(`  Loaded metadata for ${gameMeta.size} games (commenceTime + odds source)`);
  const cm = await createMissingLockedPicks({
    db, groups, walletProfiles, agsCalibration, isProvenFn, isHcEligibleFn,
    walletStatsFn, walletPriorStatsFn,
    existingDocIds, gameMeta, now,
    dryRun: DRY_RUN, force: FORCE,
  });
  stats.created_missing = cm.created.length;
  if (cm.created.length === 0) {
    console.log(`  No missing locked picks to create.`);
  } else {
    for (const c of cm.created) {
      const agsLabel = c.ags != null ? c.ags.toFixed(2) : '∅';
      const stakeLabel = c.hcStakeTier ? ` stake=${c.hcStakeTier}` : '';
      console.log(`  + ${c.col.replace('sharpFlow', '').toUpperCase()} ${c.docId} / ${c.side} (${c.team}) — route=${c.route}  AGS-U=${agsLabel} (proven=${c.agsTotal})  stars=${c.peakStars} units=${c.peakUnits}u${stakeLabel}`);
    }
  }
  if (cm.skipped.length > 0) {
    const reasonCounts = cm.skipped.reduce((m, s) => { m[s.reason] = (m[s.reason] || 0) + 1; return m; }, {});
    console.log(`  Skipped: ${Object.entries(reasonCounts).map(([r, n]) => `${r}=${n}`).join(', ')}`);
  }

  console.log(`\n── Summary ──`);
  console.log(`  Sides examined:           ${stats.examined}`);
  console.log(`  Skipped (not locked/lean):${stats.skipped_not_locked}`);
  console.log(`  Skipped (completed):      ${stats.skipped_completed}`);
  console.log(`  Skipped (T-15 freeze):    ${stats.skipped_t15}`);
  console.log(`  No change needed:         ${stats.no_change}`);
  console.log(`  Wrote canonical state:    ${stats.wrote}`);
  console.log(`    of which status flips:  ${stats.status_changes}`);
  console.log(`    AGS-U → SHADOW (hidden): ${stats.agsu_demoted_to_shadow}`);
  console.log(`    AGS-U → LOCKED (shown):  ${stats.agsu_promoted_to_locked}`);
  console.log(`    AGS-U hard mutes (q20):  ${stats.agsu_hard_muted}`);
  console.log(`  Created-missing pass:     ${stats.created_missing} new pick doc(s)`);
  console.log(`  agsBothSides refreshed:   ${stats.ags_both_sides_refreshed} doc(s) (analytical sidecar)`);
  console.log(`\n${DRY_RUN ? '[DRY RUN] No writes performed.' : 'Done.'}\n`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
