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
