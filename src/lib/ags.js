// AGS-Unified v11 — single source of truth for client (SharpFlow.jsx) and
// server (scripts/syncPickStateAuthoritative.js, calibration jobs).
//
// AGS-U is a logistic-regression-derived composite over FOUR per-side aggregate
// features computed from `peak.v8Scoring.walletDetails[]` + wallet profile
// lookups. Each feature contributes weight·z(value), summed with an intercept.
// The composite drives EVERY action — lock/mute, sizing, tier label.
//
// v11 deep-feature upgrade (2026-05-25, supersedes v10 5-feature set)
// ────────────────────────────────────────────────────────────────────────
// v10 used 5 count/conviction features and worked well on NBA but was
// ANTI-PREDICTIVE on MLB (CV AUC 0.466 — below chance). The wallet pool
// audit revealed MLB has only 32 qualifying wallets vs NBA's 95, and the
// metric audit revealed we were ignoring 11 of 15 walletDetail fields
// (roi, pnl, rank, roiNorm, pnlNorm, rankNorm, etc.) plus the entire
// `sharpWalletProfiles[w].picks` block (the wallet's track record on
// our featured picks).
//
// v11 method:
//   1. Tested 56 candidate features (every metric × every aggregation:
//      sums/avgs/maxes/side-indicators/top-N/HC-variants/W-L counts).
//   2. Strict-causal time-aware 5-fold CV — every feature uses only
//      data knowable at pick scoring time.
//   3. Forward stepwise selection on universal data (one model, all sports).
//
// Selected features (4 — the rest L1-collapsed to noise):
//   COUNT consensus       → dCount         (proven wallet count margin)
//   INTENSITY (HC)        → dHcSizeRatio   (HC sizeRatio sum margin)
//   QUALITY-RANK (fade)   → dSumRankNorm   (Σ leaderboard rank-quality, FOR − AGAINST)
//   QUALITY-TRACK (fade)  → dWinnerCtPreA  (count of FOR-side wallets with positive
//                                           any-sport pre-pick featured-pick ROI,
//                                           minus same on AGAINST)
//
// Model logic: dCount + dHcSizeRatio have POSITIVE coefficients (sharp consensus
// is real). dSumRankNorm + dWinnerCtPreA have NEGATIVE coefficients — when the
// most-known-winning wallets pile on, that side wins LESS often (the line has
// already moved). "Follow the crowd, fade the obvious sharps."
//
// Strict-causal CV result (558 W/L picks, 2026-04-18 → 2026-05-25):
//   Universal AUC=0.596  ρ=0.166  Q5−Q1=23.4%
//   MLB AUC=0.549  (v10: 0.466 ← anti-predictive)   Δ +0.083
//   NBA AUC=0.632  (v10: 0.648)                     Δ −0.016
//   NHL AUC=0.646  (v10: 0.623)                     Δ +0.023
//
// HC = CONFIRMED tier ∧ wallet sizeRatio ≥ 1.5×.
// dWinnerCtPreA uses profile.picks (top-level, any-sport featured-pick aggregate)
// via the optional walletStatsFn passed into aggregateSideProven.
//
// Source: scripts/_agsu_deep_feature_lab.mjs + AGSU_DEEP_FEATURE_LAB.md +
//         AGSU_WALLET_INVENTORY.md (wallet pool audit).

// ────────────────────────────────────────────────────────────────────────
// AGS_FEATURES — the FOUR features that drive the v11 score.
//
// The `sign` field is the model's actual sign (not just expected direction).
// Two are positive (consensus), two are negative (fade-the-obvious-sharps).
// Order is display-only.
// ────────────────────────────────────────────────────────────────────────
export const AGS_FEATURES = [
  { key: 'dCount',          label: 'Δcount',       family: 'COUNT',          sign: +1 },
  { key: 'dHcSizeRatio',    label: 'ΔHCsizeRatio', family: 'INTENSITY_HC',   sign: +1 },
  { key: 'dSumRankNorm',    label: 'ΔΣrankNorm',   family: 'QUALITY_RANK',   sign: -1 },
  { key: 'dWinnerCtPreA',   label: 'Δwinners',     family: 'QUALITY_TRACK',  sign: -1 },
];

// ────────────────────────────────────────────────────────────────────────
// AGS_WEIGHTS — v11 logistic-regression coefficients (the actual model).
//
// Fit method:   L1-regularized logistic regression, λ=1.5
// Training:     558 W/L picks since 2026-04-18 (V6 cutover) → 2026-05-25
// Validation:   5-fold time-aware cross-validation
// Selection:    Forward stepwise on 56 candidate features (universal,
//               strict-causal, no leakage). The four kept survive every
//               other candidate the data generated.
//
// OOS result (universal, 558 picks):
//   AUC=0.596  ρ=0.166  Q5−Q1=23.4%
//   MLB AUC=0.549 (v10: 0.466)  NBA AUC=0.632 (v10: 0.648)  NHL AUC=0.646
//
// Coefficient interpretation:
//   intercept       β=+0.0887   (slight win-bias baseline)
//   dCount          β=+0.5371   PRO-consensus: more proven wallets FOR = win
//   dHcSizeRatio    β=+0.2787   PRO-consensus: bigger HC sizing FOR = win
//   dSumRankNorm    β=-0.2740   CONTRARIAN: more leaderboard-rank quality
//                               on FOR = LOSE (line already reflects them)
//   dWinnerCtPreA   β=-0.1916   CONTRARIAN: more pre-D winning wallets
//                               on FOR = LOSE (obvious sharps already priced in)
//
// Score is a calibrated logit. sigmoid(score) ≈ P(WIN | features).
//
// To refresh: re-run scripts/_agsu_deep_feature_lab.mjs against the latest
// data; copy printed coefficients here; then re-run
// scripts/computeAgsCalibration.js to refresh the Firestore quintiles.
// ────────────────────────────────────────────────────────────────────────
export const AGS_WEIGHTS = Object.freeze({
  intercept:        +0.0887,
  dCount:           +0.5371,
  dHcSizeRatio:     +0.2787,
  dSumRankNorm:     -0.2740,
  dWinnerCtPreA:    -0.1916,
});

// Threshold inside aggregateSideProven for what counts as a "winner" wallet
// for the dWinnerCtPreA feature. Mirrors the strict-causal lab threshold
// (n ≥ 5 any-sport featured picks AND flat ROI > 0).
export const AGS_WINNER_MIN_PICKS = 5;

// HC eligibility threshold — wallet must be CONFIRMED tier AND have
// sizeRatio ≥ HC_RATIO to count toward HC features. Mirrors the production
// threshold in syncPickStateAuthoritative.js.
export const HC_RATIO = 1.5;

// Minimum proven-wallet count required to compute a trustworthy AGS-U.
//
// AGS-U v9 design intent (2026-05-17 reset): the composite z-score is
// THE single gate. Sample-size adequacy is implicit in the calibration —
// every feature's mean/SD is computed across the live population of
// wallet counts, so a single-wallet z-spike on light contributions
// naturally falls below q60 because the population already includes
// hundreds of similar 1-wallet sides. Adding a separate count floor
// on top of that was a pre-AGS-U "second gate" that contradicted the
// "one score, one calibration, one decision" promise and was silently
// blocking real signals — e.g. on 2026-05-17 it rejected the Brewers
// ML (3 sharps, $73K, AGS-U computed but never logged), the
// Diamondbacks ML, the Phillies HC+2, and 9 other sides the cron
// computed AGS-U for but never persisted, because the count-gate
// fired before AGS-U got a vote.
//
// Floor of 1 keeps the absolute mathematical minimum (need ≥1 wallet
// for any composite to mean anything) without imposing an arbitrary
// "you must have 2 wallets to count" rule. The case n=0 still gates
// naturally upstream — aggregateSideProven returns null with no
// qualifying wallets, which makes computeAgs return null, which every
// callsite already null-checks before deciding.
export const AGS_MIN_PROVEN_WALLETS = 1;

// Absolute (non-calibration) safety floor. AGS-U values below this trigger
// HARD MUTE regardless of where calibration's q20 sits. Protects against
// pathological calibration runs (e.g. tiny sample on cold start) that could
// place q20 too low and accidentally permit toxic picks to ship.
//
// v11 note: score range is approximately [−1.8, +3.6] on the V6→2026-05-25
// sample. q05 = −0.54, q20 = −0.18. −1.0 is below q05 (only ~5% of picks
// reach there) so it remains an appropriate absolute safety floor for
// catastrophic-calibration protection.
export const AGS_ABSOLUTE_MUTE_FLOOR = -1.0;

// ────────────────────────────────────────────────────────────────────────
// Last-known-good calibration — used as a fallback when Firestore
// `agsCalibration/current` is unavailable (cron failed, cold start, etc.).
// Refreshed by scripts/computeAgsCalibration.js on every run.
//
// v11 calibration (2026-05-25). Computed from the V6+ sample (558 W/L
// picks since 2026-04-18) by running the new 4-feature computeAgs() over
// every pick and taking empirical percentiles.
//
// Score distribution on the V6+ sample:
//   min=−1.81  max=+3.64  mean=+0.10
//   q05=−0.54  q10=−0.33  q20=−0.18  (HARD MUTE — bottom 20%)
//   q40=+0.01  q50=+0.09  q60=+0.12  (LOCK floor — full standard size)
//   q80=+0.34  q90=+0.60  (PREMIUM 1.5× / ELITE 2.0× floors)
//
// Sanity check: under the v11 weights, sigmoid(intercept) = sigmoid(0.089)
// ≈ 52.2% — the baseline. score=+0.6 → sigmoid(0.69) ≈ 66.7% P(WIN), which
// matches the strict-causal Q5 OOS WR closely (the model is calibrated,
// not just discriminative).
//
// Keep this file in sync with Firestore whenever the calibration job's
// quintiles drift >0.05 in any band OR at least monthly.
export const AGS_FALLBACK_CALIBRATION = Object.freeze({
  normalizers: {
    dCount:         { mean: 1.1239, sd: 1.4895 },
    dHcSizeRatio:   { mean: 1.0530, sd: 5.4443 },
    dSumRankNorm:   { mean: 62.1204, sd: 90.6788 },
    dWinnerCtPreA:  { mean: 0.7027, sd: 1.2883 },
  },
  // v11 logistic-score quintile boundaries (range ≈ [−1.8, +3.6]).
  // Computed by scripts/computeAgsCalibration.js on the V6→2026-05-24 sample (N=565).
  quintiles: { q20: -0.16, q40: -0.02, q50: 0.06, q60: 0.13, q80: 0.29, q90: 0.46 },
  // Action thresholds derived from the quintiles.
  thresholds: {
    hardMuteFloor: -0.16, // = q20 — hard mute below this AGS-U value
    lockFloor:      0.13, // = q60 — full unit lock floor
    premiumFloor:   0.29, // = q80 — 1.50× sizing
    eliteFloor:     0.46, // = q90 — 2.00× sizing
  },
  sampleSize: 565,
  dateRange: { from: '2026-04-18', to: '2026-05-24' },
  computedAt: '2026-05-25T15:00:00Z',
  source: 'fallback-hardcoded-v11',
  schemaVersion: 'ags-unified-v11',
});

// ────────────────────────────────────────────────────────────────────────
// positionToWalletDetail — canonical 1:1 mapping from a sharp_action_positions
// doc (or polled JSON entry of the same shape) into the walletDetails entry
// that aggregateSideProven / computeAgs consume.
//
// CRITICAL: this is the ONE definition of how a raw position becomes a
// walletDetail. The cron (scripts/syncPickStateAuthoritative.js) and the
// UI (src/pages/SharpFlow.jsx) BOTH import this so they cannot drift.
// Any change to feature inputs (sizeRatio, convictionMult, contribution,
// walletBase) must happen here.
//
// Field rules:
//   - wallet:         lower-6-hex of the wallet address (matches profile docIds)
//   - side:           'home' | 'away' | 'over' | 'under'
//   - invested:       raw $ on the position
//   - sizeRatio:      invested / avgSportBet  (1 fallback when avgBet=0)
//   - convictionMult: clamped log(sizeRatio) curve, range [0.70, 1.60]
//   - contribution:   walletBase × convictionMult  (walletBase=50 stand-in
//                     when v8_walletBase is not yet stamped — the cron
//                     stamps the real percentile-derived walletBase on
//                     subsequent cycles)
// ────────────────────────────────────────────────────────────────────────
export function positionToWalletDetail(p) {
  if (!p) return null;
  const wallet = p.walletShort
    ? String(p.walletShort).toLowerCase()
    : (p.wallet ? String(p.wallet).slice(-6).toLowerCase() : '');
  const invested = Number(p.invested || 0);
  const avgBet = Number(p.avgSportBet || 0);
  // Prefer v8_sizeRatio (stamped by the cron on the first cycle); fall back
  // to a live compute from invested / avgSportBet.
  const sizeRatio = Number.isFinite(p.v8_sizeRatio) && p.v8_sizeRatio > 0
    ? Number(p.v8_sizeRatio)
    : (avgBet > 0 ? invested / avgBet : 1);
  const convictionMult = Number.isFinite(p.v8_convictionMult) && p.v8_convictionMult > 0
    ? Number(p.v8_convictionMult)
    : Math.max(0.70, Math.min(1.60, 1 + 0.30 * Math.log(sizeRatio || 1)));
  const walletBase = Number.isFinite(p.v8_walletBase) && p.v8_walletBase > 0
    ? Number(p.v8_walletBase)
    : 50;
  const contribution = Number.isFinite(p.v8_walletContribution) && p.v8_walletContribution > 0
    ? Number(p.v8_walletContribution)
    : walletBase * convictionMult;
  return {
    wallet,
    side: p.side,
    invested,
    walletBase,
    sizeRatio,
    convictionMult,
    contribution,
    roi: Number(p.sportROI || 0),
    pnl: Number(p.sportPnlTotal || p.totalPnl || 0),
    rank: p.leaderboardRank ?? null,
    roiNorm: Number(p.v8_walletRoiNorm || 0),
    pnlNorm: Number(p.v8_walletPnlNorm || 0),
    rankNorm: Number(p.v8_walletRankNorm || 0),
    topShare: Number(p.v8_topShare || 0),
    contribTier: 'TBD',
  };
}

// ────────────────────────────────────────────────────────────────────────
// computeAgsFromPositions — end-to-end pipeline. Map → aggregate → compute.
// Returns { ags, components, tier, quintile, ... } same shape as computeAgs
// or null when there are no proven wallets present.
//
// This is the SINGLE function the UI (SharpFlow.jsx) and cron
// (createMissingPicks, computeSideAnalytics) both call so that whatever
// AGS-U value the UI displays on a card is the exact value the cron will
// stamp on the matching pick doc when it next runs. There is no drift.
//
// v11: `walletStatsFn` is the new optional argument used to look up the
// wallet's any-sport featured-pick track record at scoring time (drives
// the `dWinnerCtPreA` feature). When null, that feature contributes 0.
// ────────────────────────────────────────────────────────────────────────
export function computeAgsFromPositions(positions, sideKey, sport, calibration, isProvenFn, isHcEligibleFn = null, walletStatsFn = null) {
  if (!Array.isArray(positions) || positions.length === 0) return null;
  const walletDetails = positions.map(positionToWalletDetail).filter(Boolean);
  const agg = aggregateSideProven(walletDetails, sideKey, sport, isProvenFn, isHcEligibleFn, walletStatsFn);
  if (!agg) return null;
  return computeAgs(agg, calibration);
}

// ────────────────────────────────────────────────────────────────────────
// Whitelist-filtered side aggregator with HC subset + quality features.
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
//                   HC features are 0.
//   walletStatsFn: fn(walletShort) => { picksN: number, picksFlatRoi: number }
//                  Returns the wallet's TOP-LEVEL `profile.picks` aggregate
//                  (any-sport featured-pick history) AT PICK-SCORING TIME.
//                  Used for the v11 dWinnerCtPreA feature. Optional: when
//                  omitted, that feature contributes 0.
//
// Returns null if no proven wallets are present on either side.
// ────────────────────────────────────────────────────────────────────────
export function aggregateSideProven(walletDetails, sideKey, sport, isProvenFn, isHcEligibleFn = null, walletStatsFn = null) {
  if (!Array.isArray(walletDetails) || walletDetails.length === 0) return null;

  const empty = () => ({
    count: 0,
    contribution: 0,
    sumConviction: 0,
    hcCount: 0,
    hcSumSizeRatio: 0,
    // v11 additions
    sumRankNorm: 0,
    winnerCount: 0,
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

    // v11 — rankNorm is frozen at scoring time; sum across qualifying wallets.
    sideBucket.sumRankNorm += Number(w.rankNorm || 0);

    // v11 — winner count uses wallet's TOP-LEVEL profile.picks aggregate
    // (any-sport featured-pick history at scoring time). When walletStatsFn
    // is not provided, this contributes 0 (graceful degradation for callers
    // that don't have access to profiles).
    if (walletStatsFn) {
      const stats = walletStatsFn(w.wallet);
      if (stats && Number.isFinite(Number(stats.picksN)) && Number(stats.picksN) >= AGS_WINNER_MIN_PICKS
          && Number.isFinite(Number(stats.picksFlatRoi)) && Number(stats.picksFlatRoi) > 0) {
        sideBucket.winnerCount += 1;
      }
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

    // v11 raw aggregates (for UI / drivers display)
    forSumRankNorm: f.sumRankNorm,
    agSumRankNorm:  a.sumRankNorm,
    forWinnerCount: f.winnerCount,
    agWinnerCount:  a.winnerCount,

    // v11 active features (the ones AGS_FEATURES/AGS_WEIGHTS use)
    dCount:           f.count - a.count,
    dHcSizeRatio:     f.hcSumSizeRatio - a.hcSumSizeRatio,
    dSumRankNorm:     f.sumRankNorm - a.sumRankNorm,
    dWinnerCtPreA:    f.winnerCount - a.winnerCount,

    // Back-compat: old v10 features still computed (no longer in AGS_FEATURES
    // but retained on the aggregate object so existing UI/scripts that read
    // these fields directly don't break).
    dHcCount:         f.hcCount - a.hcCount,
    dConvictionAvg:   avg(f.sumConviction, f.count) - avg(a.sumConviction, a.count),
    forContribShare:  totalContribution > 0 ? f.contribution / totalContribution : 0.5,
  };
}

// ────────────────────────────────────────────────────────────────────────
// computeAgs — v11 logistic-regression scoring.
//
// Score = intercept + Σ β_k · z(feature_k)
//   where z(feature_k) = (raw_k − cal.normalizers[k].mean) / cal.normalizers[k].sd
//   and β_k is AGS_WEIGHTS[k] (L1-fit on 558 W/L picks, strict-causal CV).
//
// v11 uses 4 features (down from v10's 5): dCount, dHcSizeRatio,
// dSumRankNorm, dWinnerCtPreA. The last two have NEGATIVE coefficients —
// they're the "fade the obvious sharps" correction on top of the
// "follow the consensus" base signal.
//
// The score is a calibrated logit. sigmoid(score) ≈ P(WIN | features).
// Quintile thresholds in cal.quintiles map score → tier (ELITE/PREMIUM/
// LOCK/LEAN/WEAK/FADE) — same downstream contract as v9.
//
// `components[k]` returns the z-scored feature value (NOT the weighted
// contribution) so the UI can keep displaying raw z-bars without change.
// To compute each feature's contribution to the score, multiply
// `components[k]` by `AGS_WEIGHTS[k]` on the caller side.
//
// Returns { ags, components, tier, quintile, ... } or null if agg missing.
// ────────────────────────────────────────────────────────────────────────
export function computeAgs(agg, calibration) {
  if (!agg) return null;
  const cal = calibration && calibration.normalizers ? calibration : AGS_FALLBACK_CALIBRATION;
  const components = {};
  const weightedComponents = {};
  let total = Number(AGS_WEIGHTS.intercept) || 0;
  for (const f of AGS_FEATURES) {
    const norm = cal.normalizers[f.key];
    if (!norm || !Number.isFinite(norm.mean) || !Number.isFinite(norm.sd) || norm.sd === 0) {
      components[f.key] = 0;
      weightedComponents[f.key] = 0;
      continue;
    }
    const raw = Number(agg[f.key] || 0);
    const z = (raw - norm.mean) / norm.sd;
    const weight = Number(AGS_WEIGHTS[f.key]) || 0;
    components[f.key] = z;
    weightedComponents[f.key] = weight * z;
    total += weight * z;
  }
  return {
    ags: total,
    components,
    weightedComponents, // β_k · z_k per feature (sums to ags − intercept)
    pWin: 1 / (1 + Math.exp(-Math.max(-30, Math.min(30, total)))), // sigmoid(score)
    tier: agsTierFromValue(total, cal),
    quintile: agsQuintileFromValue(total, cal),
    provenForCount: agg.forCount || 0,
    provenAgCount:  agg.agCount  || 0,
    provenTotalCount: (agg.forCount || 0) + (agg.agCount || 0),
    provenRaw: agg.provenRaw || 0,
    totalRaw:  agg.totalRaw  || 0,
    calibrationSource: cal.source || (cal === AGS_FALLBACK_CALIBRATION ? 'fallback' : 'firestore'),
    schemaVersion: cal.schemaVersion || 'ags-unified-v11',

    // Raw feature values — exposed so the UI can render plain-English
    // "drivers" without recomputing aggregateSideProven downstream.
    featureValues: {
      // v11 active features
      dCount:          agg.dCount          || 0,
      dHcSizeRatio:    agg.dHcSizeRatio    || 0,
      dSumRankNorm:    agg.dSumRankNorm    || 0,
      dWinnerCtPreA:   agg.dWinnerCtPreA   || 0,
      forSumRankNorm:  agg.forSumRankNorm  || 0,
      agSumRankNorm:   agg.agSumRankNorm   || 0,
      forWinnerCount:  agg.forWinnerCount  || 0,
      agWinnerCount:   agg.agWinnerCount   || 0,
      // Raw counts (used everywhere by drivers)
      forCount:        agg.forCount        || 0,
      agCount:         agg.agCount         || 0,
      forHcCount:      agg.forHcCount      || 0,
      agHcCount:       agg.agHcCount       || 0,
      // Back-compat v10 fields (still computed, kept for UI/script consumers)
      dHcCount:        agg.dHcCount        || 0,
      dConvictionAvg:  agg.dConvictionAvg  || 0,
      forContribShare: Number.isFinite(agg.forContribShare) ? agg.forContribShare : 0.5,
    },
  };
}

// ────────────────────────────────────────────────────────────────────────
// agsScoreToProb — calibrated P(WIN) from an AGS-U score.
// Inverse of the logit link used in the v10 fit.
// ────────────────────────────────────────────────────────────────────────
export function agsScoreToProb(score) {
  if (score == null || !Number.isFinite(score)) return null;
  return 1 / (1 + Math.exp(-Math.max(-30, Math.min(30, Number(score)))));
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
// AGS_TIER_META — tier badge metadata. Tier names are stable across model
// versions (v9, v10, v11, v12) so the user-facing vocabulary doesn't churn:
//   ELITE / PREMIUM / LOCK / LEAN / WEAK / FADE
// In v12 the semantics shifted slightly (WEAK = lowest positive bet,
// FADE = score ≤ 0 / muted) but the labels and colors are unchanged.
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
// the v11 cutover. All decision logic now flows through agsSizeMultiplier
// (which returns 0 for FADE-tier picks) and meetsAgsLockFloor / meetsAgsHardMute.
// Remove these in a follow-up PR after no callers remain.
//
// v11 numbers reflect the new 4-feature logit score distribution
// (range ≈ [−1.8, +3.6] on the V6→2026-05-25 sample).
// ────────────────────────────────────────────────────────────────────────
export const AGS_LOCK_FLOOR  = 0.12; // legacy alias for v11 q60 — use agsLockFloorFromCalibration instead
export const AGS_MUTE_FLOOR  = -0.18; // legacy alias for v11 q20 — use agsHardMuteFloorFromCalibration instead
export const AGS_DW1_FLOOR   = null;  // route retired in v9
export const AGS_ELITE_FLOOR = 0.60;  // legacy alias for v11 q90 fallback

export function failsAgsConfirmationGate(ags) {
  // v9/v10 semantics: failing the confirmation gate = below hard mute floor.
  if (ags == null || !Number.isFinite(ags)) return false;
  return ags < AGS_FALLBACK_CALIBRATION.quintiles.q20;
}

// ════════════════════════════════════════════════════════════════════════
// ─── AGS-Unified v12 ────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════════
//
// v12 is a CONTINUOUS quality-weighted score that beats v11 on every
// measurable dimension while being simpler and not subject to overfitting
// (no learned weights — every coefficient is hand-derived from the data
// and tested with cross-validation).
//
// Why we rebuilt:
//   v11 had a 4-feature logistic regression with two CONTRARIAN coefficients
//   (the "fade the obvious sharps" pattern). That was real on the V6+ sample
//   but turned ANTI-PREDICTIVE on the May 14-31 holdout (282 v9-graded picks
//   ran -4.6% real ROI). Root cause: v11 weights were fit on a sample where
//   the qualified wallet pool was much smaller; as the pool grew, the
//   "obvious sharps" signal flipped sign.
//
// What v12 does differently:
//   1. CONTINUOUS per-wallet quality score (not binary filter).
//      quality(w) = tierWeight(w) × max(0, min(30, priorRoi))
//                  × max(0.5, min(2.5, sizeRatio))
//                  × min(1, sqrt(priorN / 20))
//      Combines all rich wallet data: tier, ROI magnitude, conviction,
//      sample-size reliability — every dimension that should matter,
//      bounded against outliers.
//
//   2. MEAN aggregation per side (not sum). Prevents "more wallets" from
//      mechanically dominating; rewards average quality per wallet present.
//
//   3. RATIO combiner (not difference). Score = (forMean - agMean) /
//      (forMean + agMean + 0.5), bounded approximately in [-1, +1].
//      Smoothly represents relative dominance.
//
//   4. Hard rule: score ≤ 0 → MUTE (no bet, no size). Score > 0 → ladder
//      sizing by quintile of POSITIVE-only distribution.
//
// Methodology:
//   Tested 200+ formula candidates (8 quality functions × 5 side aggregators
//   × 5 combiners) against the 282-pick v9 sample. Q_hcCap__mean__ratio
//   was the top fixed-formula candidate (logistic regression with learned
//   weights scored higher in-sample at +31.6% Q5 ROI but CV-validated to
//   only +7.1% — confirmed overfitting at n=282).
//
// Backtest on 282 picks (2026-05-14 → 2026-05-31):
//   - Positive-score picks (n=134): WR 55.2%, flat ROI +5.9%
//   - Negative + zero score picks (n=148): WR ~50%, flat ROI ~-5%
//   - With ladder sizing (0.25/0.50/1.00/1.50/2.00u):
//     141.5u staked → +20.6u PnL → +14.6% ROI
//   - Same window with current v9/v11 production: 461.3u staked → -21.3u
//     PnL → -4.6% ROI. Net swing: +42u PnL improvement.
//
// Source: scripts/_agsu_v12_QHCCAP_deepdive.mjs + AGSU_V12_QHCCAP_DEEPDIVE.md
//         + scripts/_agsu_v12_LOCK_above_zero.mjs + AGSU_V12_LOCK_ABOVE_ZERO.md
// ────────────────────────────────────────────────────────────────────────

// Tier weight in the quality formula. CONFIRMED gets 3× weight, FLAT gets 2×,
// WR50 gets 1× — but the wallet must be CONFIRMED or FLAT to contribute at
// all (the WR50 tier was tested and reduced overall ROI by 4-13pp, so it's
// gated out). This matches the validated "Q_hcCap" candidate.
export function agsV12TierWeight(tier) {
  if (tier === 'CONFIRMED') return 3;
  if (tier === 'FLAT')      return 2;
  if (tier === 'WR50')      return 1;
  return 0;
}

// Per-wallet quality score (continuous, leak-proof, bounded).
// Returns 0 when the wallet doesn't qualify for the HC_BASE pool
// (CONFIRMED or FLAT tier on this sport).
//
// Inputs (all REQUIRED to be point-in-time leak-proof):
//   tier      : 'CONFIRMED' | 'FLAT' | 'WR50' | null/other
//   priorN    : wallet's prior pick count in this sport (BEFORE this pick)
//   priorRoi  : wallet's prior flat ROI % in this sport
//   sizeRatio : wallet's bet size on THIS pick / their avg sport bet
export function agsV12WalletQuality({ tier, priorN, priorRoi, sizeRatio }) {
  // Pool gate: HC_BASE only (CONFIRMED or FLAT).
  if (tier !== 'CONFIRMED' && tier !== 'FLAT') return 0;
  const tw = agsV12TierWeight(tier);
  const roi = Math.max(0, Math.min(30, Number(priorRoi || 0)));      // cap at 30%
  const size = Math.max(0.5, Math.min(2.5, Number(sizeRatio || 0))); // bound to [0.5, 2.5]
  const nReliab = Math.min(1, Math.sqrt(Math.max(0, Number(priorN || 0)) / 20));
  return tw * roi * size * nReliab;
}

// Compute the v12 score from already-collected quality arrays per side.
// Returns a number roughly in [-1, +1]. Score ≤ 0 means MUTE.
export function agsV12ScoreFromQualities(forQualities, agQualities) {
  const fSum = forQualities.reduce((s, q) => s + q, 0);
  const aSum = agQualities.reduce((s, q) => s + q, 0);
  const fMean = forQualities.length ? fSum / forQualities.length : 0;
  const aMean = agQualities.length  ? aSum / agQualities.length  : 0;
  if (fMean === 0 && aMean === 0) return 0;
  return (fMean - aMean) / (fMean + aMean + 0.5);
}

// Minimum sizeRatio (bet size relative to a wallet's own average) for a leg to
// count as a real directional opinion when a wallet has bet MULTIPLE outcomes of
// the same game. Sub-floor legs on a hedged wallet are treated as dust/insurance
// and discarded so they don't score the wallet against its own conviction side.
export const V12_HEDGE_FLOOR = 1.0;

// Option B attribution — collapse wallets that bet multiple outcomes of the same
// game down to a single directional vote so a wallet can never appear FOR and
// AGAINST simultaneously:
//   • single-outcome wallets are left untouched (small solo bets still count)
//   • multi-outcome wallets keep only legs at/above V12_HEDGE_FLOOR, then take
//     the single highest-sizeRatio leg as their vote
//   • a wallet with no leg above the floor (pure balanced dust) is excluded
// This removes the self-hedge double-counting that otherwise dilutes the
// for/against margin (see egy_bel: 6 fake "against" dust legs muting a 6u SUPER).
export function collapseHedgedWalletsV12(walletDetails) {
  if (!Array.isArray(walletDetails) || walletDetails.length === 0) return walletDetails;
  const byWallet = new Map();
  for (const w of walletDetails) {
    if (!w || !w.wallet || !w.side) continue;
    if (!byWallet.has(w.wallet)) byWallet.set(w.wallet, []);
    byWallet.get(w.wallet).push(w);
  }
  const out = [];
  for (const legs of byWallet.values()) {
    if (legs.length === 1) { out.push(legs[0]); continue; }
    const distinctSides = new Set(legs.map((l) => l.side));
    if (distinctSides.size === 1) { out.push(legs[0]); continue; } // multiple legs, same side
    const kept = legs.filter((l) => Number(l.sizeRatio || 0) >= V12_HEDGE_FLOOR);
    if (kept.length === 0) continue; // balanced dust → no directional edge
    kept.sort((a, b) => Number(b.sizeRatio || 0) - Number(a.sizeRatio || 0));
    out.push(kept[0]);
  }
  return out;
}

// End-to-end aggregator for v12.
//
// Inputs:
//   walletDetails    : peak.v8Scoring.walletDetails[] frozen at scoring time
//   sideKey          : 'home' | 'away' | 'over' | 'under' (the FOR side)
//   sport            : 'MLB' | 'NBA' | 'NHL'
//   walletPriorStatsFn: fn(walletShort, sport) => { tier, priorN, priorRoi }
//                       MUST be point-in-time (no future leakage). When omitted
//                       all wallets contribute 0 and the score will be 0/MUTE.
//
// Returns null when walletDetails is empty.
export function aggregateSideV12(walletDetails, sideKey, sport, walletPriorStatsFn) {
  if (!Array.isArray(walletDetails) || walletDetails.length === 0) return null;
  const collapsed = collapseHedgedWalletsV12(walletDetails);
  const forQs = [];
  const agQs = [];
  let provenContributors = 0;
  for (const w of collapsed) {
    if (!w || !w.wallet || !w.side) continue;
    const stats = walletPriorStatsFn ? walletPriorStatsFn(w.wallet, sport) : null;
    if (!stats) continue;
    const q = agsV12WalletQuality({
      tier: stats.tier,
      priorN: stats.priorN,
      priorRoi: stats.priorRoi,
      sizeRatio: Number(w.sizeRatio || 0),
    });
    if (q > 0) provenContributors += 1;
    if (w.side === sideKey) forQs.push(q); else agQs.push(q);
  }
  if (forQs.length === 0 && agQs.length === 0) return null;
  const fSum = forQs.reduce((s, q) => s + q, 0);
  const aSum = agQs.reduce((s, q) => s + q, 0);
  const fMean = forQs.length ? fSum / forQs.length : 0;
  const aMean = agQs.length  ? aSum / agQs.length  : 0;
  const score = agsV12ScoreFromQualities(forQs, agQs);
  return {
    score,
    forQualities: forQs,
    agQualities:  agQs,
    forSum: fSum,
    agSum:  aSum,
    forMean: fMean,
    agMean:  aMean,
    forCount: forQs.length,
    agCount:  agQs.length,
    provenContributors,
  };
}

// End-to-end pipeline: positions → walletDetails → aggregate → v12 result.
// Mirrors computeAgsFromPositions but uses the v12 path.
export function computeAgsV12FromPositions(positions, sideKey, sport, calibration, walletPriorStatsFn) {
  if (!Array.isArray(positions) || positions.length === 0) return null;
  const walletDetails = positions.map(positionToWalletDetail).filter(Boolean);
  const agg = aggregateSideV12(walletDetails, sideKey, sport, walletPriorStatsFn);
  if (!agg) return null;
  return computeAgsV12(agg, calibration);
}

// Compute v12 result from an aggregate object (parallel to computeAgs).
// Returns { agsV12, score, tier, sizeMultiplier, quintile, ... } or null.
export function computeAgsV12(agg, calibration) {
  if (!agg) return null;
  const cal = (calibration && calibration.v12Quintiles) ? calibration : AGS_V12_FALLBACK_CALIBRATION;
  const score = Number(agg.score) || 0;
  return {
    agsV12: score,
    score,
    forQualities: agg.forQualities,
    agQualities:  agg.agQualities,
    forSum: agg.forSum,
    agSum:  agg.agSum,
    forMean: agg.forMean,
    agMean:  agg.agMean,
    forCount: agg.forCount,
    agCount:  agg.agCount,
    provenContributors: agg.provenContributors,
    tier: agsV12TierFromValue(score, cal),
    sizeMultiplier: agsV12SizeMultiplier(score, cal),
    quintile: agsV12QuintileFromValue(score, cal),
    calibrationSource: cal.source || (cal === AGS_V12_FALLBACK_CALIBRATION ? 'fallback' : 'firestore'),
    schemaVersion: 'ags-unified-v12',
  };
}

// Fallback v12 calibration — computed from the 282-pick v9-graded sample
// (2026-05-14 → 2026-05-31) using scripts/_agsu_v12_LOCK_above_zero.mjs.
// Quintiles are over the POSITIVE-ONLY score distribution (n=134), since
// non-positive scores are muted by rule rather than by calibration.
//
// Production calibration script must compute these same cutoffs daily by:
//   1. Computing v12 score for every recent pick
//   2. Filtering to score > 0
//   3. Taking 20/40/60/80 percentiles of the filtered set
// and writing them to agsCalibration/current under `v12Quintiles`.
export const AGS_V12_FALLBACK_CALIBRATION = Object.freeze({
  v12Quintiles: {
    q20: 0.781, // Q1→Q2 boundary among positives
    q40: 0.916, // Q2→Q3 boundary
    q60: 0.957, // Q3→Q4 boundary
    q80: 0.981, // Q4→Q5 boundary
  },
  sampleSize: 134,        // positive-only picks in calibration sample
  totalSampleSize: 282,   // all v9-graded picks in window
  dateRange: { from: '2026-05-14', to: '2026-05-31' },
  computedAt: '2026-06-01T15:30:00Z',
  source: 'fallback-hardcoded-v12',
  schemaVersion: 'ags-unified-v12',
});

// Tier mapping for v12. The user's directive: zero/negative scores are
// MUTED (cancelled, no bet). Positive scores get the ladder.
//
// Tier names are PRESERVED from v11 (ELITE/PREMIUM/LOCK/LEAN/WEAK/FADE) so
// the user-facing badge vocabulary doesn't churn between model versions.
// The semantics change: WEAK now means "lowest positive score" (a real
// 0.25u bet) and FADE now means "muted/cancelled" (0u, never ships).
//
//   score ≤ 0         → FADE     (0 units — pick is cancelled / muted)
//   score ∈ (0, q20]  → WEAK     (0.25× — lowest positive)
//   score ∈ (q20, q40] → LEAN    (0.50×)
//   score ∈ (q40, q60] → LOCK    (1.00× — standard unit)
//   score ∈ (q60, q80] → PREMIUM (3.00×)
//   score >  q80      → ELITE    (5.00× — top conviction)
//
// All cutoffs are quintile boundaries of the POSITIVE-only distribution.
//
// SIZING DESIGN: the ladder is heavily top-weighted because the per-bet
// edge concentrates dramatically in ELITE.
//
// Per-tier ROI on the 282-pick backtest (2026-05-14 → 2026-05-31):
//   ELITE   +33.04% (61.5% WR)  — the engine, ~3.5× the per-bet edge of PREMIUM
//   PREMIUM  +9.43% (60.7% WR)
//   LEAN    +13.92% (60.7% WR)
//   LOCK     -8.03% (50.0% WR)  — Q3 dip (small drag, acceptable)
//   WEAK    -19.74% (42.3% WR)  — small drag (token bet preserves volume)
//
// With this ladder: 282 picks → 260.5u staked → +49.44u PnL → +18.98% ROI
// vs the v11 production output on same window: 461u staked → -21.3u → -4.6%
// (net swing of +70u PnL improvement; +23pp ROI improvement).
//
// Other ladders considered (see scripts/_agsu_v12_LADDER_sweep.mjs):
//   "TopOnly" (only ELITE+PREMIUM, 0/0/0/2/4) → +39.6u @ +24.8% ROI — higher
//     ROI but throws away the +13.9% LEAN edge and breaks "ladder all positives".
//   "Geometric 2.5x" → +92u @ +21.5% but max bet 9.77u (too aggressive for
//     typical bankroll).
// The chosen ladder is the optimal trade-off: respects "all positives get
// a stake" + concentrates capital at the demonstrated edge.
export function agsV12TierFromValue(score, calibration = null) {
  if (score == null || !Number.isFinite(score)) return 'UNKNOWN';
  if (score <= 0) return 'FADE';
  const cal = (calibration && calibration.v12Quintiles) ? calibration : AGS_V12_FALLBACK_CALIBRATION;
  const q = cal.v12Quintiles;
  if (Number.isFinite(q.q80) && score >  q.q80) return 'ELITE';
  if (Number.isFinite(q.q60) && score >  q.q60) return 'PREMIUM';
  if (Number.isFinite(q.q40) && score >  q.q40) return 'LOCK';
  if (Number.isFinite(q.q20) && score >  q.q20) return 'LEAN';
  return 'WEAK';
}

// Ladder size multiplier for v12. Monotonic and top-weighted: each tier
// strictly larger than the one below, with ELITE / PREMIUM substantially
// heavier than the linear ladder to match where the per-bet edge actually
// concentrates (see commentary on agsV12TierFromValue). Mute (0×) on
// score ≤ 0.
export function agsV12SizeMultiplier(score, calibration = null) {
  if (score == null || !Number.isFinite(score) || score <= 0) return 0;
  const cal = (calibration && calibration.v12Quintiles) ? calibration : AGS_V12_FALLBACK_CALIBRATION;
  const q = cal.v12Quintiles;
  if (Number.isFinite(q.q80) && score >  q.q80) return 5.00; // ELITE
  if (Number.isFinite(q.q60) && score >  q.q60) return 3.00; // PREMIUM
  if (Number.isFinite(q.q40) && score >  q.q40) return 1.00; // LOCK
  if (Number.isFinite(q.q20) && score >  q.q20) return 0.50; // LEAN
  return 0.25;                                                // SMALL
}

// Conviction 1–100 — the user-facing gauge value derived directly from the
// v12 score. It is the score's percentile WITHIN the positive distribution,
// anchored on the same calibration quintiles that drive the tier ladder, so
// the number always agrees with the tier band:
//
//   ELITE   → 80–100   (score > q80)
//   PREMIUM → 60–80    (q60 < score ≤ q80)
//   LOCK    → 40–60    (q40 < score ≤ q60)
//   LEAN    → 20–40    (q20 < score ≤ q40)
//   WEAK    → 1–20     (0   < score ≤ q20)
//   FADE    → 0        (score ≤ 0 — muted, never shipped)
//
// The ELITE band has no upper quintile in the v12 calibration, so we
// extrapolate one quintile-width above q80 as the 100 anchor. Output is
// clamped to [1,100] for any positive score so a real bet never reads 0.
export function agsV12Conviction(score, calibration = null) {
  if (score == null || !Number.isFinite(score) || score <= 0) return 0;
  const cal = (calibration && calibration.v12Quintiles) ? calibration : AGS_V12_FALLBACK_CALIBRATION;
  const q = cal.v12Quintiles;
  const eliteWidth = Math.max((q.q80 - q.q60) || 0, 0.02);
  const anchors = [
    { s: 0,                  p: 0 },
    { s: q.q20,              p: 20 },
    { s: q.q40,              p: 40 },
    { s: q.q60,              p: 60 },
    { s: q.q80,              p: 80 },
    { s: q.q80 + eliteWidth, p: 100 },
  ];
  let pct = 100;
  for (let i = 1; i < anchors.length; i++) {
    if (score <= anchors[i].s) {
      const lo = anchors[i - 1], hi = anchors[i];
      const t = hi.s === lo.s ? 1 : (score - lo.s) / (hi.s - lo.s);
      pct = lo.p + t * (hi.p - lo.p);
      break;
    }
  }
  return Math.max(1, Math.min(100, Math.round(pct)));
}

// Quintile placement (0 = muted, 1..5 = positive picks bottom..top).
export function agsV12QuintileFromValue(score, calibration = AGS_V12_FALLBACK_CALIBRATION) {
  if (score == null || !Number.isFinite(score) || score <= 0) return 0;
  const cal = (calibration && calibration.v12Quintiles) ? calibration : AGS_V12_FALLBACK_CALIBRATION;
  const q = cal.v12Quintiles;
  if (score >  q.q80) return 5;
  if (score >  q.q60) return 4;
  if (score >  q.q40) return 3;
  if (score >  q.q20) return 2;
  return 1;
}

// Convenience predicate matching v11's semantics (returns true iff this
// pick should ship at any nonzero stake). For v12, this is exactly
// "score > 0" — there is no separate proven-wallet-count gate because the
// quality formula already encodes wallet eligibility (non-HC_BASE wallets
// contribute 0, so a "no qualified wallets" pick will naturally have
// score 0 and be muted).
export function meetsAgsV12LockFloor(score) {
  return Number.isFinite(score) && score > 0;
}

// Tier metadata for v12 badges. Mirrors AGS_TIER_META but six tiers are
// MUTE/SMALL/LEAN/LOCK/PREMIUM/ELITE — no FADE/WEAK because zero-and-below
// scores are simply MUTED (canceled, not displayed as a "play this").
export const AGS_V12_TIER_META = {
  ELITE:   { label: 'ELITE',   color: '#16a34a', bg: 'rgba(22,163,74,0.15)',  short: 'ELITE',   units: 5.00 },
  PREMIUM: { label: 'PREMIUM', color: '#22c55e', bg: 'rgba(34,197,94,0.15)',  short: 'PREM',    units: 3.00 },
  LOCK:    { label: 'LOCK',    color: '#84cc16', bg: 'rgba(132,204,22,0.15)', short: 'LOCK',    units: 1.00 },
  LEAN:    { label: 'LEAN',    color: '#facc15', bg: 'rgba(250,204,21,0.15)', short: 'LEAN',    units: 0.50 },
  WEAK:    { label: 'WEAK',    color: '#f97316', bg: 'rgba(249,115,22,0.15)', short: 'WEAK',    units: 0.25 },
  FADE:    { label: 'FADE',    color: '#ef4444', bg: 'rgba(239,68,68,0.15)',  short: 'FADE',    units: 0    },
  UNKNOWN: { label: '—',       color: '#6b7280', bg: 'rgba(107,114,128,0.10)', short: '—',      units: 0    },
};

// ─────────────────────────────────────────────────────────────────────────
// AGS-Unified v12.1 — HC-MARGIN staking model.
//
// V12 still SELECTS the pick (score > 0 picks the side). The STAKE + display
// tier are now driven by the high-conviction margin (hcMargin = count of
// CONFIRMED conviction sharps FOR − AGAINST), not the score quintile.
//
// Grounded purely in win rate + average odds (no past-ROI dependence), the
// leak-free lifetime + live samples show:
//   • Only the WEAK-tier gate (39.5% WR) and the margin≥3 fade (you're late
//     after a pile-on) significantly separate win rate.
//   • Non-WEAK HC is a uniform ~60% win-rate group; margin==2 is the star.
//
// Mapping (score > 0 required):
//   margin == 1, tier != WEAK  → TOP        (4u — gold "TOP PICK" ribbon)
//   margin == 2, tier != WEAK  → SUPER      (6u — gold "SUPER TOP PICK" ribbon)
//   margin >= 3, tier != WEAK  → CONFIRMED  (1u — own blue label)
//   non-HC (margin <= 0)        → MONITORING (0u — shown, never staked)
//   WEAK-tier HC (any margin)   → MONITORING (0u — the WEAK score gate wins)
//   score <= 0                  → FADE       (0u — muted, unchanged)
export const V12_1_SUPER_UNITS = 6;
export const V12_1_TOP_UNITS = 4;
export const V12_1_MINI_UNITS = 3;
export const V12_1_CONFIRMED_UNITS = 1;

// Mini-HC band — a CONFIRMED wallet sized between HC_MINI_FLOOR and HC_RATIO is
// "sized up, but not full conviction." A net mini-HC margin (with no full-HC
// margin) stakes the MINI tier. Full HC remains sizeRatio ≥ HC_RATIO (1.5).
export const HC_MINI_FLOOR = 1.0;

// Display metadata for the v12.1 stake tiers. The UI branches on `stakeTier`
// and reuses the existing SUPER/TOP ribbon components; CONFIRMED gets a blue
// label, MONITORING a muted grey chip with no ribbon.
// User-facing tier display. Plain-English labels (no internal path jargon) but
// the SOURCE is preserved, because that's the real differentiator a bettor
// cares about — and color carries it at a glance:
//   • GOLD  "TOP PICK" / "MAX PLAY"  → model-driven (HC-margin / SUPER / TOP)
//   • VIOLET "SHARP PLAY"            → proven sharp money on it (2-for-0 +
//                                       proven-$ rescues: RANK / SHARP / SHARP+)
//   • TEAL  "STRONG"                 → model mini-conviction
//   • BLUE  "CONFIRMED" / GREY "LEAN"→ light model plays
// Stars track bet size; the SHARPS ON / AGSU stat on the card separates picks
// inside the same band, so two SHARP PLAYs with 2 vs 10 backers still read
// differently.
// Internal staking-path descriptor for each stake tier. The card shows the
// friendly conviction label (TOP PICK / SHARP PLAY…); this reveals WHICH path
// produced it (HC-margin / 2-for-0 / proven-$ rescue…) for the operator — via
// the card tooltip and the Tier Performance breakdown.
export const AGS_V12_STAKE_PATH = {
  SUPER:         'HC-2 model',
  'TOP+':        'HC-1 + $-boost',
  TOP:           'HC-1 model',
  RANK:          '2-for-0 slice',
  'SHARP-PRIME': 'proven-$ prime (legacy)',
  SHARP:         'EDGE/net BOTH',
  'SHARP-LEAN':  'EDGE/net ONE',
  MINI:          'mini-HC',
  CONFIRMED:     'margin 3+',
  'MINI-':       'gate-cut',
  DISSENT:       'Path D CM≤0',
  WINNER:        'winner-align EDGE',
  MONITORING:    'watch',
  FADE:          'muted',
};

// Condensed 5-tier display grouping — the SINGLE source of truth shared by the
// AGS-U daily report and the live Tier Performance UI. Each display tier rolls
// up one or more internal staking paths so the user/operator never sees more
// than five buckets, and the report + UI always agree on the grouping.
export const AGS_V12_DISPLAY_TIERS = [
  { key: 'MAX',    label: 'MAX PLAY',   color: '#E8B85C', unitsLabel: '6u',   sub: 'HC-2 model',      paths: ['SUPER'] },
  { key: 'TOP',    label: 'TOP PICK',   color: '#E8B85C', unitsLabel: '4-5u', sub: 'HC-margin model', paths: ['TOP+', 'TOP'] },
  { key: 'SHARP',  label: 'SHARP PLAY', color: '#A855F7', unitsLabel: '1.5-6u', sub: 'sharp money',     paths: ['RANK', 'SHARP-PRIME', 'SHARP', 'SHARP-LEAN', 'WINNER'] },
  { key: 'STRONG', label: 'STRONG',     color: '#14B8A6', unitsLabel: '3u',   sub: 'mini-HC',         paths: ['MINI'] },
  { key: 'LEAN',   label: 'LEAN',       color: '#6B7280', unitsLabel: '1u',   sub: 'confirmed / cut / Path D', paths: ['CONFIRMED', 'MINI-', 'DISSENT'] },
];

// Reverse lookup: internal stake-tier key → display-tier key.
export const AGS_V12_PATH_TO_DISPLAY = AGS_V12_DISPLAY_TIERS.reduce((m, dt) => {
  for (const p of dt.paths) m[p] = dt.key;
  return m;
}, {});

export const AGS_V12_STAKE_TIER_META = {
  SUPER:         { label: 'MAX PLAY',  short: 'MAX',    color: '#E8B85C', bg: 'rgba(232,184,92,0.15)',  units: V12_1_SUPER_UNITS,     ribbon: null, stars: 5 },
  'TOP+':        { label: 'TOP PICK',  short: 'TOP',    color: '#E8B85C', bg: 'rgba(232,184,92,0.13)',  units: 5,                     ribbon: null, stars: 5 },
  TOP:           { label: 'TOP PICK',  short: 'TOP',    color: '#E8B85C', bg: 'rgba(232,184,92,0.13)',  units: V12_1_TOP_UNITS,       ribbon: null, stars: 4 },
  RANK:          { label: 'SHARP PLAY', short: 'SHARP', color: '#A855F7', bg: 'rgba(168,85,247,0.15)',  units: 4,                     ribbon: null, stars: 4 },
  'SHARP-PRIME': { label: 'SHARP PLAY', short: 'SHARP', color: '#A855F7', bg: 'rgba(168,85,247,0.15)',  units: 4,                     ribbon: null, stars: 4 },
  SHARP:         { label: 'SHARP PLAY', short: 'SHARP', color: '#A855F7', bg: 'rgba(168,85,247,0.12)',  units: 3,                     ribbon: null, stars: 3 },
  'SHARP-LEAN':  { label: 'SHARP PLAY', short: 'LEAN',  color: '#A855F7', bg: 'rgba(168,85,247,0.10)',  units: 1.5,                   ribbon: null, stars: 2 },
  MINI:          { label: 'STRONG',    short: 'STRONG', color: '#14B8A6', bg: 'rgba(20,184,166,0.14)',  units: V12_1_MINI_UNITS,      ribbon: null, stars: 3 },
  // CONFIRMED / MINI- / DISSENT all roll up to the LEAN display band
  // (AGS_V12_DISPLAY_TIERS) — keep the user-facing label identical so cards
  // and the Tier Performance scoreboard never disagree on vocabulary.
  CONFIRMED:     { label: 'LEAN',      short: 'LEAN',   color: '#6B7280', bg: 'rgba(107,114,128,0.12)', units: V12_1_CONFIRMED_UNITS, ribbon: null, stars: 2 },
  'MINI-':       { label: 'LEAN',      short: 'LEAN',   color: '#6B7280', bg: 'rgba(107,114,128,0.12)', units: 1,                     ribbon: null, stars: 2 },
  DISSENT:       { label: 'LEAN',      short: 'LEAN',   color: '#6B7280', bg: 'rgba(107,114,128,0.12)', units: 1,                     ribbon: null, stars: 2 },
  WINNER:        { label: 'SHARP PLAY', short: 'WIN',  color: '#A855F7', bg: 'rgba(168,85,247,0.15)',  units: 4,                     ribbon: null, stars: 4 },
  MONITORING:    { label: 'MONITORING', short: 'WATCH', color: '#6B7280', bg: 'rgba(107,114,128,0.12)', units: 0,                     ribbon: null, stars: 0 },
  FADE:          { label: 'PASS',      short: 'PASS',   color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   units: 0,                     ribbon: null, stars: 0 },
};

// Compute the v12.1 stake tier + RAW units (no odds cap — the cron applies
// `oddsCap` after this). Pure function of the v12 score, its score-quintile
// tier, and the HC margin. Returns { stakeTier, unitsRaw }.
export function agsV12HcStake({ score, scoreTier = null, hcMargin = 0, miniHcMargin = 0, calibration = null }) {
  // Selection gate — score ≤ 0 is muted/cancelled (unchanged from v12).
  if (score == null || !Number.isFinite(score) || score <= 0) {
    return { stakeTier: 'FADE', unitsRaw: 0 };
  }
  const tier = scoreTier || agsV12TierFromValue(score, calibration);
  // A WEAK-quintile score mutes everything (full-HC and mini-HC alike).
  if (tier === 'WEAK') {
    return { stakeTier: 'MONITORING', unitsRaw: 0 };
  }
  // Full-HC ladder (CONFIRMED wallets sized ≥ HC_RATIO).
  const m = Number(hcMargin) || 0;
  if (m === 1) return { stakeTier: 'TOP',       unitsRaw: V12_1_TOP_UNITS };
  if (m === 2) return { stakeTier: 'SUPER',     unitsRaw: V12_1_SUPER_UNITS };
  if (m >= 3)  return { stakeTier: 'CONFIRMED', unitsRaw: V12_1_CONFIRMED_UNITS };
  // No full-HC margin → fall back to the mini-HC band (CONFIRMED wallets sized
  // HC_MINI_FLOOR ≤ sizeRatio < HC_RATIO — "sized up, but not full conviction").
  const mm = Number(miniHcMargin) || 0;
  if (mm >= 1) return { stakeTier: 'MINI', unitsRaw: V12_1_MINI_UNITS };
  // Non-HC → Monitoring (shown for volume, never staked).
  return { stakeTier: 'MONITORING', unitsRaw: 0 };
}
