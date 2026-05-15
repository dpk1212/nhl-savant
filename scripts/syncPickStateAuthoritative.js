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
  HC_RATIO,
  aggregateSideProven,
  agsSizeMultiplier,
  agsTierFromValue,
  computeAgs,
  meetsAgsHardMute,
  meetsAgsLockFloor,
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
    for (const sport of ['NBA', 'MLB', 'NHL', 'CBB']) {
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
        meta.set(key, cur);
      }
    }
  } catch (e) {
    console.warn('[meta] polymarket_data.json unreadable:', e.message);
  }
  try {
    const pinn = JSON.parse(readFileSync(join(PUBLIC, 'pinnacle_history.json'), 'utf8'));
    for (const sport of ['NBA', 'MLB', 'NHL', 'CBB']) {
      const games = pinn[sport] || {};
      for (const [gk, g] of Object.entries(games)) {
        const key = `${sport}|${gk}`;
        const cur = meta.get(key) || {};
        const cT = g.opener?.t ?? g.current?.t ?? null;
        if (cT && !cur.commenceTime) cur.commenceTime = cT * 1000;
        if (g.current) {
          cur.mlOdds = { away: g.current.away, home: g.current.home };
        } else if (g.opener) {
          cur.mlOdds = { away: g.opener.away, home: g.opener.home };
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

// Convert a sharp_action_positions doc into a walletDetails entry the
// way the browser writes it into peak.v8Scoring.walletDetails. This
// shape is what aggregateSideProven + computeAgs expect.
function positionToWalletDetail(p) {
  return {
    wallet: p.walletShort || (p.wallet || '').slice(-6).toLowerCase(),
    side: p.side,
    invested: Number(p.invested || 0),
    contribution: Number(p.v8_walletContribution || 0),
    walletBase: Number(p.v8_walletBase || 0),
    roi: Number(p.sportROI || 0),
    pnl: Number(p.sportPnlTotal || p.totalPnl || 0),
    sizeRatio: Number(p.v8_sizeRatio || (p.avgSportBet > 0 ? p.invested / p.avgSportBet : 0)),
    convictionMult: Number(p.v8_convictionMult || 0),
    rank: p.leaderboardRank ?? null,
    roiNorm: Number(p.v8_walletRoiNorm || 0),
    pnlNorm: Number(p.v8_walletPnlNorm || 0),
    rankNorm: Number(p.v8_walletRankNorm || 0),
    topShare: Number(p.v8_topShare || 0),
    contribTier: 'TBD',
  };
}

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
function computeSideAnalytics(positions, side, sport, walletProfiles, agsCalibration, isProvenFn, isHcEligibleFn) {
  if (!Array.isArray(positions) || positions.length === 0) return null;
  const live = computeWalletConsensus(positions, side, sport, walletProfiles);
  if (live.forW === 0 && live.agW === 0 && live.hcConfFor === 0 && live.hcConfAg === 0) {
    return null;
  }
  const walletDetails = positions.map(positionToWalletDetail);
  const agg = aggregateSideProven(walletDetails, side, sport, isProvenFn, isHcEligibleFn);
  const agsRes = agg ? computeAgs(agg, agsCalibration) : null;
  const out = {
    ags: agsRes && Number.isFinite(agsRes.ags) ? agsRes.ags : null,
    agsTier: agsRes ? (agsRes.tier ?? null) : null,
    agsQuintile: agsRes ? (agsRes.quintile ?? null) : null,
    agsProvenForCount: agsRes ? (agsRes.provenForCount || 0) : 0,
    agsProvenAgCount: agsRes ? (agsRes.provenAgCount || 0) : 0,
    agsComponents: agsRes ? (agsRes.components || null) : null,
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
function computeBothSidesAnalytics(positions, marketType, sport, walletProfiles, agsCalibration, isProvenFn, isHcEligibleFn) {
  const sides = marketType === 'TOTAL' ? ['over', 'under'] : ['away', 'home'];
  const out = {};
  let any = false;
  for (const side of sides) {
    const stamp = computeSideAnalytics(positions, side, sport, walletProfiles, agsCalibration, isProvenFn, isHcEligibleFn);
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

    const sides = marketType === 'TOTAL' ? ['over', 'under'] : ['away', 'home'];
    const newSides = {};
    for (const side of sides) {
      const live = computeWalletConsensus(positions, side, sport, walletProfiles);
      // Quick-skip: no whitelist activity at all on this side.
      if (live.forW === 0 && live.agW === 0 && live.hcConfFor === 0 && live.hcConfAg === 0) continue;

      // Build walletDetails for AGS-U.
      const walletDetails = positions.map(positionToWalletDetail);
      const agg = aggregateSideProven(walletDetails, side, sport, isProvenFn, isHcEligibleFn);
      const agsRes = agg ? computeAgs(agg, agsCalibration) : null;
      const agsValue = agsRes && Number.isFinite(agsRes.ags) ? agsRes.ags : null;
      const agsProvenTotal = agsRes ? (agsRes.provenForCount || 0) + (agsRes.provenAgCount || 0) : 0;

      // Single AGS-U gate. Must clear the SHIP floor (q20 = hard mute
      // boundary) AND have ≥ AGS_MIN_PROVEN_WALLETS proven wallets.
      // Sizing band (ELITE/PREMIUM/LOCK/LEAN/WEAK) determines stake.
      // Anything below q20 (FADE) or below the proven-wallet floor is a
      // hard mute — never auto-create.
      if (agsValue == null) continue;
      if (agsProvenTotal < AGS_MIN_PROVEN_WALLETS) {
        skipped.push({ docId, side, reason: 'insufficient_proven_wallets', count: agsProvenTotal });
        continue;
      }
      if (meetsAgsHardMute(agsValue, agsCalibration)) {
        skipped.push({ docId, side, reason: 'ags_hard_mute', ags: agsValue });
        continue;
      }

      const promotedBy = 'ags-unified-v9';
      const finalTier = lockTierFromAgs(agsValue, agsCalibration);
      const peakStars = starsFromAgs(agsValue, agsCalibration);
      // ── Pinnacle odds + line. ML uses live mlOdds; SPREAD uses the
      // pinnacle opener (pinnacle_history doesn't track spreads over
      // time); TOTAL falls back to -110 (no Pinnacle source for totals
      // in pinnacle_history.json — browser sync writes the live retail
      // book number, but the cron only has Pinnacle ML).
      let odds = null;
      let line = null;
      if (marketType === 'ML') {
        odds = side === 'home' ? meta.mlOdds?.home : meta.mlOdds?.away;
      } else if (marketType === 'SPREAD') {
        odds = side === 'home' ? meta.spreadOpener?.homeOdds : meta.spreadOpener?.awayOdds;
        if (odds == null) odds = -110;
        const openerLine = side === 'home' ? meta.spreadOpener?.homeLine : meta.spreadOpener?.awayLine;
        line = consensusLine(positions, side, sport, 'SPREAD') ?? openerLine ?? null;
      } else if (marketType === 'TOTAL') {
        odds = -110;
        line = consensusLine(positions, side, sport, 'TOTAL') ?? null;
      }
      const peakUnits = unitsFromAgs(agsValue, marketType, odds ?? null, agsCalibration);
      const agsUnitsMult = agsSizeMultiplier(agsValue, agsCalibration);

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
        team = side === 'home' ? meta.home : meta.away;
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
        units: peakUnits,
        unitTier: unitTierLabel(peakUnits),
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
        v8_lockTier: finalTier,
      };
      if (agsRes) {
        v8Stamps.v8_ags = agsRes.ags;
        v8Stamps.v8_agsTier = agsRes.tier;
        v8Stamps.v8_agsQuintile = agsRes.quintile;
        v8Stamps.v8_agsComponents = agsRes.components;
        v8Stamps.v8_agsProvenForCount = agsRes.provenForCount;
        v8Stamps.v8_agsProvenAgCount = agsRes.provenAgCount;
        v8Stamps.v8_agsCalibrationSource = agsRes.calibrationSource || 'firestore';
        v8Stamps.v8_agsEvaluatedAt = now;
        v8Stamps.v8_agsUnitsMult = agsUnitsMult;
        v8Stamps.v8_agsUnitsBase = (marketType === 'SPREAD' || marketType === 'TOTAL') ? BASE_UNITS_SPREAD_TOTAL : BASE_UNITS_ML;
        v8Stamps.v8_agsUnitsApplied = peakUnits;
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
        finalUnits: peakUnits,
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
        peakStars, peakUnits, team,
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
      positions, marketType, sport, walletProfiles, agsCalibration, isProvenFn, isHcEligibleFn,
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
function reconcileSide({ sd, side, pick, mkt, group, walletProfiles, now, force, agsCalibration, isProvenFn, isHcEligibleFn }) {
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
    return { skipped: true, reason: 'within_t_minus_15' };
  }

  // Reconstruct live wallet consensus — Δw / Δq / HC margin computed
  // for diagnostic stamping ONLY. AGS-U is the sole decision input.
  const live = computeWalletConsensus(group, side, sport, walletProfiles);

  // ─── AGS-U — recompute from current walletDetails every cycle ─────────
  // Reads frozen walletDetails[] from peak.v8Scoring (fall back to
  // lock.v8Scoring) and aggregates with the HC subset. Single composite
  // drives status, lockStage, tier, and sizing — no other gate is consulted.
  let agsResult = null;
  const wd = sd.peak?.v8Scoring?.walletDetails || sd.lock?.v8Scoring?.walletDetails || null;
  if (Array.isArray(wd) && wd.length > 0 && agsCalibration && isProvenFn) {
    const agg = aggregateSideProven(wd, side, pick.sport, isProvenFn, isHcEligibleFn);
    if (agg) agsResult = computeAgs(agg, agsCalibration);
  }
  const agsValueLive = agsResult && Number.isFinite(agsResult.ags) ? agsResult.ags : null;
  const agsTotalProven = agsResult ? (agsResult.provenForCount || 0) + (agsResult.provenAgCount || 0) : 0;

  const baseHealth = evaluateBaseHealth({
    ags: agsValueLive,
    agsProvenTotal: agsTotalProven,
    calibration: agsCalibration,
  });

  // No hysteresis. Whatever evaluateBaseHealth says this cycle is what we
  // write. ACTIVE ↔ MUTED is free to flip every cycle until T-15.
  let appliedStatus = baseHealth.status;
  let appliedReason = baseHealth.reason;
  const mutedByAgs = appliedReason === 'ags_hard_mute';

  // Compute tier / stars / units — all derived from the same AGS-U value.
  const liveStars = starsFromAgs(agsValueLive, agsCalibration);
  const liveTier = lockTierFromAgs(agsValueLive, agsCalibration);
  const sideOdds = sd.peak?.odds ?? sd.lock?.odds ?? null;
  const liveUnits = appliedStatus === 'ACTIVE'
    ? unitsFromAgs(agsValueLive, mkt, sideOdds, agsCalibration)
    : 0;
  // Sizing-multiplier stamp (informational — equals liveUnits/baseUnits).
  const agsUnitsMult = agsValueLive != null
    ? agsSizeMultiplier(agsValueLive, agsCalibration)
    : 0;
  const liveUnitsPreAgs = (mkt === 'SPREAD' || mkt === 'TOTAL') ? BASE_UNITS_SPREAD_TOTAL : BASE_UNITS_ML;

  // ─── lockStage promote/demote — single AGS-U gate ─────────────────────
  // Ship floor is q20 (the hard-mute boundary). Picks above q20 with
  // ≥ AGS_MIN_PROVEN_WALLETS proven wallets LOCK; sizing band (ELITE 2.00×
  // → PREMIUM 1.50× → LOCK 1.10× → LEAN 0.50× → WEAK 0.20×) determines
  // stake. This matches the backtest's 100% volume / +18.77u profile —
  // LEAN/WEAK picks ship at reduced size rather than getting SHADOWed.
  // < q20 (FADE) and insufficient-proven-wallets ⇒ SHADOW (hidden).
  let appliedLockStage = lockStage;
  let lockStageReason = null;
  const passesShipFloor = appliedStatus === 'ACTIVE'
    && agsValueLive != null
    && agsTotalProven >= AGS_MIN_PROVEN_WALLETS;
  if (passesShipFloor) {
    if (lockStage !== 'LOCKED') {
      appliedLockStage = 'LOCKED';
      lockStageReason = 'agsu_floor_recovered';
    } else {
      appliedLockStage = 'LOCKED';
    }
  } else {
    if (lockStage !== 'SHADOW') {
      appliedLockStage = 'SHADOW';
      lockStageReason = mutedByAgs
        ? 'agsu_hard_mute'
        : (appliedReason === 'insufficient_proven_wallets'
            ? 'agsu_insufficient_wallets'
            : 'agsu_no_signal');
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
  };
  // Phase 3 — explicit mutedBy / unmutedBy stamps so the dashboard can
  // distinguish AGS quality-veto mutes from the legacy dw/dq health
  // mutes. Cleared when the gate is no longer firing.
  if (mutedByAgs) {
    patch.mutedBy = 'ags-quality-veto';
  } else if (sd.mutedBy === 'ags-quality-veto') {
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
  patch.v8_lockTier = liveTier;

  // AGS-Unified v9 — write canonical lockStage every cycle.
  patch.lockStage = appliedLockStage;
  if (lockStageReason) {
    patch.lockStageLastChange = {
      reason: lockStageReason, at: now,
      ags: agsResult?.ags ?? null,
      agsTier: agsResult?.tier ?? null,
      provenTotal: agsTotalProven,
      // Diagnostic-only — old gate inputs preserved for v6 report cohort
      // analysis. NOT consulted for any decision.
      dw: live.delta, dq: live.qualityMargin, hcMargin: live.hcMargin,
    };
  }
  if (stampedLockStage !== appliedLockStage) {
    changes.push(`lockStage: ${stampedLockStage || '∅'} → ${appliedLockStage}${lockStageReason ? ` (${lockStageReason})` : ''}`);
  }
  // Promotion route — every active LOCK in v9 is 'ags-unified-v9'. We
  // overwrite stale legacy values (v74-hc-margin / v75-* / ags-rescue)
  // exactly once on first-promote so historical picks migrate cleanly.
  if (passesShipFloor && sd.promotedBy !== 'ags-unified-v9') {
    const stampedPromotedBy = sd.promotedBy || null;
    patch.promotedBy = 'ags-unified-v9';
    changes.push(`promotedBy: ${stampedPromotedBy || '∅'} → ags-unified-v9 (AGS=${agsResult.ags.toFixed(2)})`);
  }

  // AGS stamp (Phase 1: read-only, no behavior change). Always overwritten
  // each cycle so the displayed value tracks the current calibration +
  // current proven-wallet roster. Null AGS is also stamped so the field is
  // always present and consumers can render "—".
  if (agsResult) {
    patch.v8_ags = agsResult.ags;
    patch.v8_agsTier = agsResult.tier;
    patch.v8_agsQuintile = agsResult.quintile;
    patch.v8_agsComponents = agsResult.components;
    patch.v8_agsProvenForCount = agsResult.provenForCount;
    patch.v8_agsProvenAgCount = agsResult.provenAgCount;
    patch.v8_agsCalibrationSource = agsResult.calibrationSource || 'firestore';
    patch.v8_agsEvaluatedAt = now;
    patch.v8_agsUnitsMult = agsUnitsMult;
    patch.v8_agsUnitsBase = liveUnitsPreAgs;
    patch.v8_agsUnitsApplied = liveUnits;
    // CANONICAL bet size — single source of truth used by grader and
    // dashboard. Overwritten every cycle pre-T-15; once T-15 freezes,
    // the cron stops writing and the value sticks as the final lock size.
    // The grader reads ONLY this; no peak.units / v8_agsUnitsApplied
    // fallback chains, no AGS-multiplier divergence between live and
    // graded display.
    patch.finalUnits = liveUnits;
    const stampedAgs = sd.v8_ags;
    const agsValueChanged = stampedAgs == null
      || !Number.isFinite(stampedAgs)
      || Math.abs(stampedAgs - agsResult.ags) >= 0.05;
    const agsUnitsFieldsMissing = sd.v8_agsUnitsApplied == null
      || sd.v8_agsUnitsBase == null
      || sd.v8_agsUnitsMult == null;
    const agsUnitsDrifted = !agsUnitsFieldsMissing
      && Math.abs((sd.v8_agsUnitsApplied || 0) - liveUnits) >= 0.05;
    if (agsValueChanged) {
      changes.push(`AGS-U: ${stampedAgs == null ? '∅' : stampedAgs.toFixed(2)} → ${agsResult.ags.toFixed(2)} (${agsResult.tier}, ×${agsUnitsMult.toFixed(2)} → ${liveUnits}u)`);
    } else if (agsUnitsFieldsMissing) {
      changes.push(`AGS-U units backfill (${liveUnits}u, ×${agsUnitsMult.toFixed(2)} of ${liveUnitsPreAgs}u base)`);
    } else if (agsUnitsDrifted) {
      changes.push(`AGS-U units: → ${liveUnits}u (×${agsUnitsMult.toFixed(2)} of ${liveUnitsPreAgs}u base)`);
    }
  } else {
    if (sd.v8_ags != null) {
      // walletDetails missing or no proven wallets — clear stale AGS so
      // the UI doesn't show an out-of-date number.
      patch.v8_ags = admin.firestore.FieldValue.delete();
      patch.v8_agsTier = admin.firestore.FieldValue.delete();
      patch.v8_agsQuintile = admin.firestore.FieldValue.delete();
      patch.v8_agsComponents = admin.firestore.FieldValue.delete();
      changes.push(`AGS: ${sd.v8_ags.toFixed(2)} → ∅ (no proven wallets)`);
    }
    // No AGS computed (no proven wallets) — finalUnits == liveUnits with
    // no AGS multiplier applied. Still the canonical bet size.
    patch.finalUnits = liveUnits;
  }
  // finalUnits drift logging — flag any time the canonical bet size changes
  // by ≥0.05u so cycle output makes the change visible.
  if (Number.isFinite(sd.finalUnits) && Math.abs(sd.finalUnits - liveUnits) >= 0.05) {
    changes.push(`finalUnits: ${sd.finalUnits}u → ${liveUnits}u`);
  } else if (sd.finalUnits == null) {
    changes.push(`finalUnits backfill: ${liveUnits}u`);
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
  // AGS-U is the SOLE decision input — drives lock/mute/sizing for every pick.
  const agsCalibration = await loadAgsCalibration(db);
  const isProvenFn = buildIsProvenFn(walletProfiles);
  const isHcEligibleFn = buildIsHcEligibleFn(walletProfiles);
  console.log(`AGS-U calibration: source=${agsCalibration.source} sampleSize=${agsCalibration.sampleSize ?? '?'} computedAt=${agsCalibration.computedAt ?? '?'}`);
  if (agsCalibration.quintiles) {
    const q = agsCalibration.quintiles;
    console.log(`AGS-U quintiles:   q20=${q.q20?.toFixed?.(2) ?? '?'}(MUTE) q60=${q.q60?.toFixed?.(2) ?? '?'}(LOCK) q80=${q.q80?.toFixed?.(2) ?? '?'}(PREMIUM) q90=${q.q90?.toFixed?.(2) ?? '?'}(ELITE)`);
  }

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
      for (const [sideKey, sd] of Object.entries(sides)) {
        if (!sd) continue;
        stats.examined++;
        const groupKey = `${pick.sport}|${pick.gameKey}|${mkt}`;
        const group = groups.get(groupKey) || [];
        const result = reconcileSide({
          sd, side: sideKey, pick, mkt, group, walletProfiles, now,
          force: FORCE,
          agsCalibration, isProvenFn, isHcEligibleFn,
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
        if (result.agsuDemoted) stats.agsu_demoted_to_shadow++;
        if (result.agsuPromoted) stats.agsu_promoted_to_locked++;
        if (result.expectedReason === 'ags_hard_mute') stats.agsu_hard_muted++;
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
          group, mkt, pick.sport, walletProfiles, agsCalibration, isProvenFn, isHcEligibleFn,
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
    existingDocIds, gameMeta, now,
    dryRun: DRY_RUN, force: FORCE,
  });
  stats.created_missing = cm.created.length;
  if (cm.created.length === 0) {
    console.log(`  No missing locked picks to create.`);
  } else {
    for (const c of cm.created) {
      const agsLabel = c.ags != null ? c.ags.toFixed(2) : '∅';
      console.log(`  + ${c.col.replace('sharpFlow', '').toUpperCase()} ${c.docId} / ${c.side} (${c.team}) — route=${c.route}  AGS-U=${agsLabel} (proven=${c.agsTotal})  stars=${c.peakStars} units=${c.peakUnits}u`);
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
