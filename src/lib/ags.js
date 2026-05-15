// AGS-Unified v9 — single source of truth for client (SharpFlow.jsx) and
// server (scripts/syncPickStateAuthoritative.js, calibration jobs).
//
// AGS-U is a composite z-score over five frozen per-side aggregate features
// computed from `peak.v8Scoring.walletDetails[]`. Each feature contributes
// sign·z(value), summed. The composite drives EVERY action — lock/mute,
// sizing, tier label — so there is exactly one number per side that decides
// what the system does. There are no parallel matrices, no special-case
// route logic, no separate Δw / HC-margin gates.
//
// Feature design (chosen via L1 Lasso + Spearman + VIF on a 334-pick V6+
// sample, holdout-validated):
//
//   COUNT consensus      → dCount        (proven wallet count margin)
//   COUNT consensus (HC) → dHcCount      (HC-tier wallet count margin)
//   INTENSITY            → dConvictionAvg (avg sizeRatio·convictionMult margin)
//   INTENSITY (HC)       → dHcSizeRatio  (HC sizeRatio sum margin)
//   DOMINANCE            → forContribShare (this side's share of total contribution)
//
// HC = CONFIRMED tier ∧ wallet sizeRatio ≥ 1.5×.
//
// Validation (HOLDOUT N=67, 2026-05-06 → 2026-05-14):
//   AGS-U ≥ q60 (LOCK)    → 65-69% WR, +22-28% ROI/pick
//   AGS-U ≥ q80 (PREMIUM) → 75% WR,  +35% ROI/pick
//   AGS-U ≥ q90 (ELITE)   → 80% WR,  +41% ROI/pick
//   AGS-U <  q20 (FADE)   → bottom-quintile cohort: 9% WR historically
//                           → HARD MUTE (size = 0)
//
// Holdout vs current matrix on same 67-pick sample:
//   Matrix all-shipped:    +5.93u  ( 8.9% ROI/pick)
//   AGS-U aggressive sizing: +18.77u (24.0% ROI/unit, 100% volume preserved)
//
// Calibration is recomputed daily by scripts/computeAgsCalibration.js so the
// quintile boundaries (q20/q40/q60/q80/q90) and per-feature normalizers
// (mean/sd) track distribution drift.

// ────────────────────────────────────────────────────────────────────────
// Feature definitions — order is display-only.
// All five features are positive ρ in the V6+ calibration. Signs are
// re-validated daily; if a feature flips negative on a fresh sample the
// calibration job logs a warning but does not auto-flip the sign.
// ────────────────────────────────────────────────────────────────────────
export const AGS_FEATURES = [
  { key: 'dCount',           label: 'Δcount',         family: 'COUNT',     sign: +1 },
  { key: 'dHcCount',         label: 'ΔHCcount',       family: 'COUNT_HC',  sign: +1 },
  { key: 'dConvictionAvg',   label: 'ΔavgConviction', family: 'INTENSITY', sign: +1 },
  { key: 'dHcSizeRatio',     label: 'ΔHCsizeRatio',   family: 'INTENSITY_HC', sign: +1 },
  { key: 'forContribShare',  label: 'forShare',       family: 'DOMINANCE', sign: +1 },
];

// HC eligibility threshold — wallet must be CONFIRMED tier AND have
// sizeRatio ≥ HC_RATIO to count toward HC features. Mirrors the production
// threshold in syncPickStateAuthoritative.js.
export const HC_RATIO = 1.5;

// Minimum proven-wallet count gate. Prevents single-wallet z-spikes from
// driving locks. A pick with only 1 proven wallet has too little signal
// for the composite to be trusted, regardless of how high its AGS-U is.
export const AGS_MIN_PROVEN_WALLETS = 2;

// Absolute (non-calibration) safety floor. AGS-U values below this trigger
// HARD MUTE regardless of where calibration's q20 sits. Protects against
// pathological calibration runs (e.g. tiny sample on cold start) that could
// place q20 too low and accidentally permit toxic picks to ship.
export const AGS_ABSOLUTE_MUTE_FLOOR = -3.0;

// ────────────────────────────────────────────────────────────────────────
// Last-known-good calibration — used as a fallback when Firestore
// `agsCalibration/current` is unavailable (cron failed, cold start, etc.).
// Refreshed by scripts/computeAgsCalibration.js on every run.
//
// Values below come from the AGS-U v9 backtest TRAIN set (N=267,
// 2026-04-18 → 2026-05-06, V6+ universe with SHADOW included). The
// quintile values are the SUMMED z-score boundaries (each feature
// contributes ±~1, five features sum to ±~5).
// ────────────────────────────────────────────────────────────────────────
export const AGS_FALLBACK_CALIBRATION = Object.freeze({
  normalizers: {
    dCount:           { mean: 1.05, sd: 1.55 },
    dHcCount:         { mean: 0.55, sd: 0.95 },
    dConvictionAvg:   { mean: 0.50, sd: 0.70 },
    dHcSizeRatio:     { mean: 1.00, sd: 2.00 },
    forContribShare:  { mean: 0.60, sd: 0.28 },
  },
  // Summed-z-score quintile boundaries. Five features summed.
  quintiles: { q20: -2.60, q40: 0.20, q50: 0.50, q60: 1.00, q80: 2.40, q90: 3.55 },
  // Action thresholds derived from the quintiles.
  thresholds: {
    hardMuteFloor: -2.60, // = q20 — hard mute below this AGS-U value
    lockFloor:      1.00, // = q60 — full unit lock floor
    premiumFloor:   2.40, // = q80 — 1.50× sizing
    eliteFloor:     3.55, // = q90 — 2.00× sizing
  },
  sampleSize: 267,
  dateRange: { from: '2026-04-18', to: '2026-05-06' },
  computedAt: '2026-05-14T23:50:00Z',
  source: 'fallback-hardcoded',
});

// ────────────────────────────────────────────────────────────────────────
// Whitelist-filtered side aggregator with HC subset.
//
// Args:
//   walletDetails: peak.v8Scoring.walletDetails[] frozen at scoring time
//   sideKey:       'home' | 'away' | 'over' | 'under' (the FOR side)
//   sport:         e.g. 'NBA' / 'MLB' — used for tier lookup
//   isProvenFn:    fn(walletShort, sport) => boolean
//                  (true if wallet is CONFIRMED or FLAT for sport)
//   isHcEligibleFn:fn(walletShort, sport) => boolean
//                  (true if wallet is CONFIRMED for sport — strictly stricter
//                   than isProvenFn). HC additionally requires
//                   wallet.sizeRatio ≥ HC_RATIO. Optional: when omitted, all
//                   HC features are 0 (back-compat for callers pre-v9).
//
// Returns null if no proven wallets are present on either side.
// ────────────────────────────────────────────────────────────────────────
export function aggregateSideProven(walletDetails, sideKey, sport, isProvenFn, isHcEligibleFn = null) {
  if (!Array.isArray(walletDetails) || walletDetails.length === 0) return null;

  const empty = () => ({
    count: 0, contribution: 0, sumConviction: 0, hcCount: 0, hcSumSizeRatio: 0,
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

    const sideBucket = (w.side === sideKey) ? f : a;
    const sizeRatio = Number(w.sizeRatio || 0);
    sideBucket.count        += 1;
    sideBucket.contribution += Number(w.contribution || 0);
    sideBucket.sumConviction += Number(w.convictionMult || 0);

    // HC subset — CONFIRMED tier + sizeRatio ≥ HC_RATIO.
    if (isHcEligibleFn && isHcEligibleFn(w.wallet, sport) && sizeRatio >= HC_RATIO) {
      sideBucket.hcCount += 1;
      sideBucket.hcSumSizeRatio += sizeRatio;
    }
  }

  if ((f.count + a.count) === 0) return null;

  const avg = (x, n) => n > 0 ? x / n : 0;
  const totalContribution = f.contribution + a.contribution;

  return {
    forCount: f.count,
    agCount:  a.count,
    forHcCount: f.hcCount,
    agHcCount:  a.hcCount,
    forContribution: f.contribution,
    agContribution:  a.contribution,
    totalRaw,
    provenRaw,

    // The five AGS-U features. Order matches AGS_FEATURES.
    dCount:           f.count - a.count,
    dHcCount:         f.hcCount - a.hcCount,
    dConvictionAvg:   avg(f.sumConviction, f.count) - avg(a.sumConviction, a.count),
    dHcSizeRatio:     f.hcSumSizeRatio - a.hcSumSizeRatio,
    forContribShare:  totalContribution > 0 ? f.contribution / totalContribution : 0.5,
  };
}

// ────────────────────────────────────────────────────────────────────────
// computeAgs — z-score the five features and sum (with sign).
// Returns { ags, components, tier, quintile, ... } or null if agg missing.
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
    tier: agsTierFromValue(total, cal),
    quintile: agsQuintileFromValue(total, cal),
    provenForCount: agg.forCount || 0,
    provenAgCount:  agg.agCount  || 0,
    provenTotalCount: (agg.forCount || 0) + (agg.agCount || 0),
    provenRaw: agg.provenRaw || 0,
    totalRaw:  agg.totalRaw  || 0,
    calibrationSource: cal.source || (cal === AGS_FALLBACK_CALIBRATION ? 'fallback' : 'firestore'),

    // Raw feature values — exposed so the UI can render plain-English
    // "drivers" (proven backing / HC confirming / money concentration)
    // without having to recompute aggregateSideProven downstream.
    featureValues: {
      dCount:          agg.dCount          || 0,
      dHcCount:        agg.dHcCount        || 0,
      dConvictionAvg:  agg.dConvictionAvg  || 0,
      dHcSizeRatio:    agg.dHcSizeRatio    || 0,
      forContribShare: Number.isFinite(agg.forContribShare) ? agg.forContribShare : 0.5,
      forCount:        agg.forCount        || 0,
      agCount:         agg.agCount         || 0,
      forHcCount:      agg.forHcCount      || 0,
      agHcCount:       agg.agHcCount       || 0,
    },
  };
}

// ────────────────────────────────────────────────────────────────────────
// Tier mapping — quintile-based. Used for the AGS-U badge in the UI and
// `v8_agsTier` in Firestore. Six tiers map 1:1 onto sizing bands.
//   ELITE   ≥ q90  (2.00×)
//   PREMIUM ≥ q80  (1.50×)
//   LOCK    ≥ q60  (1.10×)  ← lock floor
//   LEAN    ≥ q40  (0.50×)
//   WEAK    ≥ q20  (0.20×)
//   FADE    < q20  (HARD MUTE — units = 0)
// ────────────────────────────────────────────────────────────────────────
export function agsTierFromValue(ags, calibration = null) {
  if (ags == null || !Number.isFinite(ags)) return 'UNKNOWN';
  if (ags < AGS_ABSOLUTE_MUTE_FLOOR) return 'FADE';
  const q = (calibration && calibration.quintiles) ? calibration.quintiles : AGS_FALLBACK_CALIBRATION.quintiles;
  if (ags >= q.q90) return 'ELITE';
  if (ags >= q.q80) return 'PREMIUM';
  if (ags >= q.q60) return 'LOCK';
  if (ags >= q.q40) return 'LEAN';
  if (ags >= q.q20) return 'WEAK';
  return 'FADE';
}

// Quintile placement (1..5) relative to active calibration distribution.
// 1 = bottom 20%, 5 = top 20%.
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
// Sizing multiplier — calibration-aware 6-band aggressive ladder.
// HARD MUTE below q20 (returns 0, NOT a token stake) — these picks are
// historically sub-15% WR. Multiplier ladder validated against a
// 67-pick holdout (turned +5.93u baseline into +18.77u with 100% volume).
//
//   ≥ q90     → 2.00×  (ELITE — top decile, ~80% WR historically)
//   ≥ q80     → 1.50×  (PREMIUM — q80..q90 band, ~75% WR)
//   ≥ q60     → 1.10×  (LOCK — full standard size, ~65-70% WR)
//   ≥ q40     → 0.50×  (LEAN — half stake, neutral cohort)
//   ≥ q20     → 0.20×  (WEAK — quarter stake, visible signal but small risk)
//   <  q20    → 0.00×  (FADE — HARD MUTE; do not ship)
//
// Calibration MUST be passed. The fallback calibration's quintiles will
// be used if `calibration` is null (cold start / cron failure), so the
// function never crashes — but production callers should always pass
// a fresh calibration loaded from Firestore.
// ────────────────────────────────────────────────────────────────────────
export function agsSizeMultiplier(ags, calibration = null) {
  if (ags == null || !Number.isFinite(ags)) return 0;
  if (ags < AGS_ABSOLUTE_MUTE_FLOOR) return 0;
  const q = (calibration && calibration.quintiles) ? calibration.quintiles : AGS_FALLBACK_CALIBRATION.quintiles;
  if (Number.isFinite(q.q90) && ags >= q.q90) return 2.00;
  if (Number.isFinite(q.q80) && ags >= q.q80) return 1.50;
  if (Number.isFinite(q.q60) && ags >= q.q60) return 1.10;
  if (Number.isFinite(q.q40) && ags >= q.q40) return 0.50;
  if (Number.isFinite(q.q20) && ags >= q.q20) return 0.20;
  return 0; // < q20 → HARD MUTE
}

// ────────────────────────────────────────────────────────────────────────
// Lock and mute predicates. Single source of truth — no other gate
// (v74 / v75 / ags-rescue / dw-1 / hc-margin) is consulted.
// ────────────────────────────────────────────────────────────────────────

// Returns the live LOCK floor — q60 of the calibration distribution.
export function agsLockFloorFromCalibration(calibration) {
  const cal = calibration && calibration.quintiles ? calibration : AGS_FALLBACK_CALIBRATION;
  const q60 = cal.quintiles?.q60;
  return Number.isFinite(q60) ? q60 : AGS_FALLBACK_CALIBRATION.quintiles.q60;
}

// Returns the live HARD MUTE floor — q20 of the calibration distribution.
// AGS-U values below this trigger size = 0 (no shipping), regardless of
// any other signal. Bound below by the absolute safety floor so a
// pathological calibration can't open the gate to FADE-tier picks.
export function agsHardMuteFloorFromCalibration(calibration) {
  const cal = calibration && calibration.quintiles ? calibration : AGS_FALLBACK_CALIBRATION;
  const q20 = cal.quintiles?.q20;
  const q20Effective = Number.isFinite(q20) ? q20 : AGS_FALLBACK_CALIBRATION.quintiles.q20;
  return Math.max(q20Effective, AGS_ABSOLUTE_MUTE_FLOOR);
}

// True iff this pick clears the LOCK floor AND has enough proven wallets
// to be a real signal (not a single-wallet z-spike).
export function meetsAgsLockFloor(ags, provenWalletCount, calibration = null) {
  if (ags == null || !Number.isFinite(ags)) return false;
  if (provenWalletCount != null && provenWalletCount < AGS_MIN_PROVEN_WALLETS) return false;
  return ags >= agsLockFloorFromCalibration(calibration);
}

// True iff this pick is in the FADE tier (hard mute zone). Used by the
// sync script to force size = 0 even on picks that another override might
// otherwise want to ship.
export function meetsAgsHardMute(ags, calibration = null) {
  if (ags == null || !Number.isFinite(ags)) return false;
  return ags < agsHardMuteFloorFromCalibration(calibration);
}

// ────────────────────────────────────────────────────────────────────────
// Tier display helpers — colors and short labels for badges.
// ────────────────────────────────────────────────────────────────────────
export const AGS_TIER_META = {
  ELITE:   { label: 'ELITE',   color: '#16a34a', bg: 'rgba(22,163,74,0.15)',  short: 'ELITE'   },
  PREMIUM: { label: 'PREMIUM', color: '#22c55e', bg: 'rgba(34,197,94,0.15)',  short: 'PREM'    },
  LOCK:    { label: 'LOCK',    color: '#84cc16', bg: 'rgba(132,204,22,0.15)', short: 'LOCK'    },
  LEAN:    { label: 'LEAN',    color: '#facc15', bg: 'rgba(250,204,21,0.15)', short: 'LEAN'    },
  WEAK:    { label: 'WEAK',    color: '#f97316', bg: 'rgba(249,115,22,0.15)', short: 'WEAK'    },
  FADE:    { label: 'FADE',    color: '#ef4444', bg: 'rgba(239,68,68,0.15)',  short: 'FADE'    },
  UNKNOWN: { label: '—',       color: '#6b7280', bg: 'rgba(107,114,128,0.10)', short: '—'      },
};

// ────────────────────────────────────────────────────────────────────────
// DEPRECATED — kept as no-op exports so old call sites don't crash during
// the v9 cutover. All decision logic now flows through agsSizeMultiplier
// (which returns 0 for FADE-tier picks) and meetsAgsLockFloor / meetsAgsHardMute.
// Remove these in a follow-up PR after no callers remain.
// ────────────────────────────────────────────────────────────────────────
export const AGS_LOCK_FLOOR  = 1.00; // legacy constant — use agsLockFloorFromCalibration instead
export const AGS_MUTE_FLOOR  = -2.60; // legacy constant — use agsHardMuteFloorFromCalibration instead
export const AGS_DW1_FLOOR   = null;  // route retired in v9
export const AGS_ELITE_FLOOR = 3.55;  // legacy alias for q90 fallback

export function failsAgsConfirmationGate(ags) {
  // v9 semantics: failing the confirmation gate = below hard mute floor.
  if (ags == null || !Number.isFinite(ags)) return false;
  return ags < AGS_FALLBACK_CALIBRATION.quintiles.q20;
}
