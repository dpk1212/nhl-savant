// AGS (AggregateScore) — single source of truth for both client (SharpFlow.jsx)
// and server (scripts/syncPickStateAuthoritative.js, calibration jobs).
//
// AGS is a composite score over six frozen per-side aggregate features
// computed from `peak.v8Scoring.walletDetails[]` filtered to whitelist-proven
// (CONFIRMED + FLAT) wallets. Each feature contributes sign·z(value), summed.
//
// Validation history (whitelist-filtered, V6 cutover, dashboard-truth sample
// N=104 graded picks 2026-04-18 → 2026-05-04):
//   AGS ≥ +7  →  4-0   (100% WR, +172% flat ROI)   ← top of all V6
//   AGS ≥ +5  →  13-1  ( 92.9% WR, +106% flat ROI)
//   AGS ≥ +3  →  28-10 ( 73.7% WR,  +48% flat ROI)
//   Q5 (top)  →  18-2  ( 90.0% WR)
//   Q1 (bot)  →  4-17  ( 19.0% WR)   ← anti-signal
//
// Caveat: tier-at-pick-time isn't stored, so we proxy with today's
// `whitelistTier` from sharpWalletProfiles. This is far less leaky than
// aggregating over WR50 / untracked wallets that the v8 engine writes into
// walletDetails. Calibration is recomputed daily so normalizers track drift.

// ────────────────────────────────────────────────────────────────────────
// Feature definitions — order matters only for display.
// Sign is the direction the composite uses; all six are positive ρ in the
// 2026-05-05 calibration. Signs are revisited daily in the calibration job.
// ────────────────────────────────────────────────────────────────────────
export const AGS_FEATURES = [
  { key: 'dCount',          label: 'Δcount',         family: 'TOTAL',         sign: +1 },
  { key: 'dContribution',   label: 'ΔcontribSum',    family: 'TOTAL',         sign: +1 },
  { key: 'dBestContrib',    label: 'ΔbestContrib',   family: 'CONCENTRATION', sign: +1 },
  { key: 'dBestWalletBase', label: 'ΔbestBase',      family: 'CONCENTRATION', sign: +1 },
  { key: 'dConvictionAvg',  label: 'ΔavgConviction', family: 'BLENDED',       sign: +1 },
  { key: 'dRoiNormAvg',     label: 'ΔavgRoiNorm',    family: 'BLENDED',       sign: +1 },
];

// ────────────────────────────────────────────────────────────────────────
// Decision thresholds — read by both client and server lock/health logic.
// Tuned conservatively against the N=104 sample. Phase-3 rollout, not Phase-1.
//
// 2026-05-13: lock floor switched from static +5 to dynamic q50 (above
// median) from the daily calibration. Empirically the +3..+5 band hits
// 82% WR / +0.60u flat per pick at ~3x the throughput of the +5 floor —
// the median is the right place to draw the line. `AGS_LOCK_FLOOR = 5.0`
// is retained as (a) cold-start fallback when calibration lacks q50, and
// (b) the "STRONG AGS" semantic threshold for the ELITE-tier inline check
// and the LOCK badge in contribTier — both of which mean "AGS clears the
// historical strong-signal bar," not "this pick gets locked."
// ────────────────────────────────────────────────────────────────────────
export const AGS_LOCK_FLOOR = 5.0;        // legacy fallback + ELITE/STRONG-AGS label threshold
export const AGS_ELITE_FLOOR = 5.0;       // alias — used by ELITE-tier inline checks
export const AGS_MUTE_FLOOR = -1.0;       // confirmation gate (route B): AGS < -1 → MUTE
// v7.5 — Δw=+1 confirmation floor. The Σ ≥ +5 sum route was retired
// (2026-05-05) because Δq (quality margin) is too sparse to be meaningful
// once we filter walletDetails to whitelist-only wallets. Δw=+1 alone is
// thin signal but a positive aggregate over the proven wallet stack
// (AGS ≥ +3, "STRONG" tier) is enough confirmation to ship. The
// AGS_MIN_PROVEN_WALLETS guard still applies so a single wallet z-spike
// can't drive a Δw=+1 lock.
//   • AGS ≥ +5 → AGS rescue route (locks regardless of Δw, requires Δw > -2)
//   • AGS ≥ +3 → Δw=+1 confirmation route (this constant)
//   • AGS < -1 → confirmation gate veto on otherwise-locking sides
export const AGS_DW1_FLOOR = 3.0;
// Rescue requires ≥AGS_MIN_PROVEN_WALLETS proven wallets in walletDetails
// (anti thin-sample noise). Lowered from 3 → 2 (2026-05-05) because MLB/NHL
// stacks routinely show genuine signal with only 2 proven wallets backing —
// e.g. Lakers SPREAD with AGS=+5.19 and 2 wallets FOR / 0 AGAINST is real
// signal, not noise. The same guard still protects against single-wallet
// z-spikes driving rescues.
export const AGS_MIN_PROVEN_WALLETS = 2;

// ────────────────────────────────────────────────────────────────────────
// Last-known-good calibration — used as a fallback when Firestore
// `agsCalibration/current` is unavailable (cron failed, cold start, etc.).
// Refreshed by scripts/computeAgsCalibration.js daily. Values below come
// from the 2026-05-05 N=104 V6 dashboard-filtered, whitelist-only run.
// ────────────────────────────────────────────────────────────────────────
export const AGS_FALLBACK_CALIBRATION = Object.freeze({
  normalizers: {
    dCount:          { mean: 1.28,  sd: 1.55 },
    dContribution:   { mean: 75.06, sd: 89.13 },
    dBestContrib:    { mean: 37.80, sd: 47.38 },
    dBestWalletBase: { mean: 36.17, sd: 40.49 },
    dConvictionAvg:  { mean: 0.51,  sd: 0.68 },
    dRoiNormAvg:     { mean: 32.79, sd: 40.63 },
  },
  // q60 is the active LOCK floor as of 2026-05-13. Historical fallback
  // value (+2.58) preserved here so cold-start matches the last-known
  // empirical 60th percentile from the N=104 sample. The daily
  // calibration overwrites this with a fresh q60 on each run.
  quintiles: { q20: -4.77, q40: -0.46, q50: 1.00, q60: 2.58, q80: 4.21, q90: 5.20 },
  thresholds: { lockFloor: AGS_LOCK_FLOOR, eliteFloor: AGS_ELITE_FLOOR, muteFloor: AGS_MUTE_FLOOR },
  sampleSize: 104,
  dateRange: { from: '2026-04-18', to: '2026-05-04' },
  computedAt: '2026-05-05T18:00:00Z',
  source: 'fallback-hardcoded',
});

// ────────────────────────────────────────────────────────────────────────
// Whitelist-filtered side aggregator. Mirrors aggregateSide() in
// scripts/_walletStackScore.mjs exactly — keep the math identical.
//
// Args:
//   walletDetails: peak.v8Scoring.walletDetails[] frozen at scoring time
//   sideKey:       'home' | 'away' | 'over' | 'under' (the FOR side)
//   sport:         e.g. 'NBA' / 'MLB' — used to look up tier per-sport
//   isProvenFn:    fn(walletShort, sport) => boolean
//
// Returns null if no proven wallets are present on either side.
// ────────────────────────────────────────────────────────────────────────
export function aggregateSideProven(walletDetails, sideKey, sport, isProvenFn) {
  if (!Array.isArray(walletDetails) || walletDetails.length === 0) return null;

  const empty = () => ({
    count: 0, invested: 0, contribution: 0, walletBase: 0,
    roi: 0, pnl: 0, sizeRatio: 0, conviction: 0,
    bestRank: null, bestContrib: 0, bestWalletBase: 0,
    sumRoiNorm: 0, sumPnlNorm: 0, sumRankNorm: 0,
  });
  const f = empty();
  const a = empty();
  let totalRaw = 0;
  let provenRaw = 0;

  for (const w of walletDetails) {
    if (!w || !w.wallet || !w.side) continue;
    totalRaw += 1;
    if (!isProvenFn(w.wallet, sport)) continue;
    provenRaw += 1;

    const b = (w.side === sideKey) ? f : a;
    b.count        += 1;
    b.invested     += Number(w.invested || 0);
    b.contribution += Number(w.contribution || 0);
    b.walletBase   += Number(w.walletBase || 0);
    b.roi          += Number(w.roi || 0);
    b.pnl          += Number(w.pnl || 0);
    b.sizeRatio    += Number(w.sizeRatio || 0);
    b.conviction   += Number(w.convictionMult || 0);
    b.sumRoiNorm   += Number(w.roiNorm || 0);
    b.sumPnlNorm   += Number(w.pnlNorm || 0);
    b.sumRankNorm  += Number(w.rankNorm || 0);

    const r = Number(w.rank);
    if (Number.isFinite(r) && (b.bestRank == null || r < b.bestRank)) b.bestRank = r;
    const c = Number(w.contribution || 0);
    if (c > b.bestContrib) b.bestContrib = c;
    const wb = Number(w.walletBase || 0);
    if (wb > b.bestWalletBase) b.bestWalletBase = wb;
  }

  if ((f.count + a.count) === 0) return null;

  const avg = (x, n) => n > 0 ? x / n : 0;
  return {
    forCount: f.count,
    agCount: a.count,
    forInvested: f.invested,
    agInvested: a.invested,
    totalRaw,
    provenRaw,

    dCount:          f.count - a.count,
    dInvested:       f.invested - a.invested,
    dContribution:   f.contribution - a.contribution,
    dContribAvg:     avg(f.contribution, f.count) - avg(a.contribution, a.count),
    dWalletBaseAvg:  avg(f.walletBase, f.count) - avg(a.walletBase, a.count),
    dRoiAvg:         avg(f.roi, f.count) - avg(a.roi, a.count),
    dPnlAvg:         avg(f.pnl, f.count) - avg(a.pnl, a.count),
    dSizeRatioAvg:   avg(f.sizeRatio, f.count) - avg(a.sizeRatio, a.count),
    dConvictionAvg:  avg(f.conviction, f.count) - avg(a.conviction, a.count),
    dRoiNormAvg:     avg(f.sumRoiNorm, f.count) - avg(a.sumRoiNorm, a.count),
    dPnlNormAvg:     avg(f.sumPnlNorm, f.count) - avg(a.sumPnlNorm, a.count),
    dRankNormAvg:    avg(f.sumRankNorm, f.count) - avg(a.sumRankNorm, a.count),
    dBestRank:       (f.bestRank != null && a.bestRank != null) ? (a.bestRank - f.bestRank) : 0,
    dBestContrib:    f.bestContrib - a.bestContrib,
    dBestWalletBase: f.bestWalletBase - a.bestWalletBase,
  };
}

// ────────────────────────────────────────────────────────────────────────
// computeAgs — z-score the six features and sum (with sign).
// ────────────────────────────────────────────────────────────────────────
export function computeAgs(agg, calibration) {
  if (!agg) return null;
  const cal = calibration && calibration.normalizers ? calibration : AGS_FALLBACK_CALIBRATION;
  const components = {};
  let total = 0;
  for (const f of AGS_FEATURES) {
    const norm = cal.normalizers[f.key];
    if (!norm || !Number.isFinite(norm.mean) || !Number.isFinite(norm.sd) || norm.sd === 0) {
      components[f.key] = 0;
      continue;
    }
    const raw = Number(agg[f.key] || 0);
    const z = (raw - norm.mean) / norm.sd;
    components[f.key] = z;
    total += f.sign * z;
  }
  return {
    ags: total,
    components,
    tier: agsTierFromValue(total),
    quintile: agsQuintileFromValue(total, cal),
    provenForCount: agg.forCount || 0,
    provenAgCount: agg.agCount || 0,
    provenTotalCount: (agg.forCount || 0) + (agg.agCount || 0),
    provenRaw: agg.provenRaw || 0,
    totalRaw: agg.totalRaw || 0,
    calibrationSource: cal.source || (cal === AGS_FALLBACK_CALIBRATION ? 'fallback' : 'firestore'),
  };
}

// ────────────────────────────────────────────────────────────────────────
// Tier mapping — used for the AGS badge in the UI and `v8_agsTier` in
// Firestore. Boundaries are AGS thresholds, not quintile-relative.
// ────────────────────────────────────────────────────────────────────────
export function agsTierFromValue(ags) {
  if (ags == null || !Number.isFinite(ags)) return 'UNKNOWN';
  if (ags >= 7) return 'ELITE';
  if (ags >= 5) return 'LOCK';
  if (ags >= 3) return 'STRONG';
  if (ags >= 0) return 'NEUTRAL';
  if (ags >= -3) return 'WEAK';
  return 'FADE';
}

// ────────────────────────────────────────────────────────────────────────
// Quintile placement — relative to the active calibration's distribution.
// ────────────────────────────────────────────────────────────────────────
export function agsQuintileFromValue(ags, calibration = AGS_FALLBACK_CALIBRATION) {
  if (ags == null || !Number.isFinite(ags)) return null;
  const q = calibration.quintiles || AGS_FALLBACK_CALIBRATION.quintiles;
  if (ags <= q.q20) return 1;
  if (ags <= q.q40) return 2;
  if (ags <= q.q60) return 3;
  if (ags <= q.q80) return 4;
  return 5;
}

// ────────────────────────────────────────────────────────────────────────
// Sizing multiplier — Phase 2 of integration. Multiplies the existing
// peakUnits / liveUnits output of calculateUnits() / calculateSpreadTotalUnits().
//
// 2026-05-13: switched from a flat 4-band table capped at 1.0× to a
// calibration-aware 7-band ladder that goes ABOVE 1.0× for top-decile
// picks. This is the "AGS has more impact" lever — both upside (top-10%
// gets +50%, top-20% gets +25%) and downside (sub-LOCK cuts are sharper:
// q40..q60 is 0.65× vs old 0.85×, q20..q40 is 0.40× vs old 0.65×).
//
// Calibration-aware bands (when calibration provided):
//   ≥ q90   → 1.50×  (ELITE BONUS — historically ~100% WR top-decile)
//   ≥ q80   → 1.25×  (PREMIUM — captures the +3..+5 strong band)
//   ≥ q60   → 1.00×  (FULL — LOCK floor and above)
//   ≥ q40   → 0.65×  (REDUCED — sub-LOCK / neutral)
//   ≥ q20   → 0.40×  (WEAK — historically anti-signal)
//   ≥ mute  → 0.25×  (THIN — gate may fire, this is the fallback)
//   < mute  → 0.10×  (FADE — gate should fire; never zero out)
//
// Legacy path (no calibration) preserves pre-2026-05-13 behavior so
// callers that haven't been migrated yet keep their current sizing.
// ────────────────────────────────────────────────────────────────────────
export function agsSizeMultiplier(ags, calibration = null) {
  if (ags == null || !Number.isFinite(ags)) return 1.0;

  // Absolute floor — sizing must never reward a pick whose AGS is below
  // the mute floor (-1), even if a sample's q20 sits much lower (e.g.
  // q20 = -4.57 on the V6 sample). The confirmation gate should already
  // be muting these; if a wallet-consensus override keeps it active,
  // we ship at minimum stake while we wait for the gate to catch up.
  if (ags < AGS_MUTE_FLOOR) return 0.10;

  if (calibration && calibration.quintiles) {
    const q = calibration.quintiles;
    if (Number.isFinite(q.q90) && ags >= q.q90) return 1.50;
    if (Number.isFinite(q.q80) && ags >= q.q80) return 1.25;
    if (Number.isFinite(q.q60) && ags >= q.q60) return 1.00;
    if (Number.isFinite(q.q40) && ags >= q.q40) return 0.65;
    if (Number.isFinite(q.q20) && ags >= q.q20) return 0.40;
    return 0.25; // mute floor .. q20 — last band before the absolute floor
  }

  // Legacy path — matches pre-2026-05-13 behavior exactly.
  if (ags >= 5) return 1.0;
  if (ags >= 3) return 1.0;
  if (ags >= 0) return 0.85;
  if (ags >= AGS_MUTE_FLOOR) return 0.65;
  return 0.5;
}

// ────────────────────────────────────────────────────────────────────────
// Lock-floor and confirmation-gate predicates — used by sync script and UI.
// ────────────────────────────────────────────────────────────────────────

// Returns the live AGS lock floor — q60 (60th percentile) of the
// calibration distribution, or the legacy AGS_LOCK_FLOOR constant if the
// calibration doc is missing. q60 was chosen over q50 (median) after the
// 2026-05-13 audit: q50 (≈+0.97 on the V6 cutover sample) sat in the 59%
// WR / +0.06u-per-pick band, while q60 (≈+2.01) captures the 71% WR /
// +0.41u-per-pick band — a meaningfully steeper edge per unit of volume.
// Caller is responsible for passing the same calibration object that
// drove the AGS value being gated — never mix calibrations.
export function agsLockFloorFromCalibration(calibration) {
  const cal = calibration && calibration.quintiles ? calibration : AGS_FALLBACK_CALIBRATION;
  const q60 = cal.quintiles?.q60;
  if (Number.isFinite(q60)) return q60;
  // Fallback path — pre-2026-05-13 calibrations or cold start. Use the
  // static AGS_LOCK_FLOOR (+5) so we never accidentally lock more
  // aggressively than the legacy behavior without a real calibration.
  return AGS_LOCK_FLOOR;
}

// `calibration` is optional for backward compat. When omitted, falls back
// to the static AGS_LOCK_FLOOR (preserves pre-2026-05-13 behavior for any
// caller that hasn't been migrated yet).
export function meetsAgsLockFloor(ags, provenWalletCount, calibration = null) {
  if (ags == null || !Number.isFinite(ags)) return false;
  if (provenWalletCount != null && provenWalletCount < AGS_MIN_PROVEN_WALLETS) return false;
  const floor = calibration ? agsLockFloorFromCalibration(calibration) : AGS_LOCK_FLOOR;
  return ags >= floor;
}

export function failsAgsConfirmationGate(ags) {
  if (ags == null || !Number.isFinite(ags)) return false; // missing → don't gate
  return ags < AGS_MUTE_FLOOR;
}

// ────────────────────────────────────────────────────────────────────────
// Tier display helpers — colors and short labels for badges.
// ────────────────────────────────────────────────────────────────────────
export const AGS_TIER_META = {
  ELITE:   { label: 'ELITE',   color: '#16a34a', bg: 'rgba(22,163,74,0.15)',  short: 'ELITE'   },
  LOCK:    { label: 'LOCK',    color: '#22c55e', bg: 'rgba(34,197,94,0.15)',  short: 'LOCK'    },
  STRONG:  { label: 'STRONG',  color: '#84cc16', bg: 'rgba(132,204,22,0.15)', short: 'STRONG'  },
  NEUTRAL: { label: 'NEUTRAL', color: '#facc15', bg: 'rgba(250,204,21,0.15)', short: 'NEUT'    },
  WEAK:    { label: 'WEAK',    color: '#f97316', bg: 'rgba(249,115,22,0.15)', short: 'WEAK'    },
  FADE:    { label: 'FADE',    color: '#ef4444', bg: 'rgba(239,68,68,0.15)',  short: 'FADE'    },
  UNKNOWN: { label: '—',       color: '#6b7280', bg: 'rgba(107,114,128,0.10)', short: '—'      },
};
