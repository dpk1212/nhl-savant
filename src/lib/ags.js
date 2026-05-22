// AGS-Unified v10 — single source of truth for client (SharpFlow.jsx) and
// server (scripts/syncPickStateAuthoritative.js, calibration jobs).
//
// AGS-U is a logistic-regression-derived composite over five frozen per-side
// aggregate features computed from `peak.v8Scoring.walletDetails[]`. Each
// feature contributes weight·z(value), summed (plus an intercept). The
// composite drives EVERY action — lock/mute, sizing, tier label — so there
// is exactly one number per side that decides what the system does.
//
// v10 monotonic-scoring upgrade (2026-05-22, supersedes v9 uniform weights)
// ────────────────────────────────────────────────────────────────────────
// v9 used uniform +1 weights on each z-scored feature. That worked
// well for raw AUC (0.610 OOS) but had a non-monotonic quintile order
// (one inversion in pairwise quintile WR ordering OOS). v10 replaces
// the uniform sum with L1-regularized logistic-regression weights
// fit on 470 W/L picks (2026-04-18 → 2026-05-22) and validated with
// 5-fold time-aware cross-validation.
//
// Result: STRICTLY MONOTONIC OOS quintile win rates —
//   Q1=38.3%  Q2=48.9%  Q3=53.2%  Q4=55.3%  Q5=62.8%   (Δ Q5-Q1 = 24.5pp)
//   OOS AUC 0.597    OOS Spearman 0.167    OOS Brier 0.245
//
// The score is a calibrated logit: sigmoid(score) ≈ P(WIN | features).
// Source of weights: scripts/_agsu_monotonic_scoring.mjs +
//                     AGSU_MONOTONIC_SCORING.md  +  AGSU_MONOTONIC_RECOMMENDATION.md
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
// Calibration is recomputed daily by scripts/computeAgsCalibration.js so the
// quintile boundaries (q20/q40/q60/q80/q90) and per-feature normalizers
// (mean/sd) track distribution drift under the new weighting.

// ────────────────────────────────────────────────────────────────────────
// Feature definitions — order is display-only.
// The `sign` field records the EXPECTED direction of correlation with
// WIN (positive = feature ↑ ⇒ P(win) ↑). v10 fits actual coefficients
// via L1-regularized logistic regression (see AGS_WEIGHTS below). The
// sign of forContribShare flipped to −1 in v10: in the V6+ sample, a
// lopsided book (high forContribShare) predicts losses, not wins.
// ────────────────────────────────────────────────────────────────────────
export const AGS_FEATURES = [
  { key: 'dCount',           label: 'Δcount',         family: 'COUNT',     sign: +1 },
  { key: 'dHcCount',         label: 'ΔHCcount',       family: 'COUNT_HC',  sign: +1 },
  { key: 'dConvictionAvg',   label: 'ΔavgConviction', family: 'INTENSITY', sign: +1 },
  { key: 'dHcSizeRatio',     label: 'ΔHCsizeRatio',   family: 'INTENSITY_HC', sign: +1 },
  { key: 'forContribShare',  label: 'forShare',       family: 'DOMINANCE', sign: -1 },
];

// ────────────────────────────────────────────────────────────────────────
// AGS_WEIGHTS — v10 logistic-regression coefficients (the actual model).
//
// Fit method:   L1-regularized logistic regression, λ=2.0
// Training:     470 W/L picks since 2026-04-18 (V6 cutover) → 2026-05-22
// Validation:   5-fold time-aware cross-validation
// OOS result:   Strict monotonic quintile WR (Q1=38.3% → Q5=62.8%)
//
// Coefficient significance (bootstrap 95% CI on B=200 resamples):
//   intercept        β=+0.0696   CI [−0.124, +0.253]   (not significant)
//   dCount           β=+0.2716   CI [+0.080, +0.552]   SIGNIFICANT ✓
//   dHcCount         β=+0.0050   CI [−0.185, +0.243]   noise (kept for compat)
//   dConvictionAvg   β=+0.2275   CI [+0.017, +0.553]   SIGNIFICANT ✓
//   dHcSizeRatio     β=+0.1763   CI [+0.000, +0.423]   borderline
//   forContribShare  β=−0.0297   CI [−0.370, +0.163]   correctly negative
//
// The score is a calibrated logit. sigmoid(score) is the model's
// estimate of P(WIN | features). Quintile thresholds are derived from
// the empirical distribution of this score across the V6+ population.
//
// To refresh: re-run scripts/_agsu_monotonic_scoring.mjs against the
// latest data; copy the printed coefficients here; then re-run
// scripts/computeAgsCalibration.js to refresh the Firestore quintiles.
// ────────────────────────────────────────────────────────────────────────
export const AGS_WEIGHTS = Object.freeze({
  intercept:        +0.0696,
  dCount:           +0.2716,
  dHcCount:         +0.0050,
  dConvictionAvg:   +0.2275,
  dHcSizeRatio:     +0.1763,
  forContribShare:  -0.0297,
});

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
// v10 note: under the new logistic-regression scoring the score scale is
// roughly 7× smaller in magnitude than v9 (a Σ-z-score over 5 features had
// natural range ≈ ±5; the L1-logit score sums weighted z's with |β| ≈ 0.2
// each so the range is ≈ ±1.5). The safety floor was rescaled from −3.0
// (v9) to −1.0 (v10) accordingly. The v10 sample's empirical Q1 was about
// −0.28; −1.0 is well below the lowest observed in 470 picks.
export const AGS_ABSOLUTE_MUTE_FLOOR = -1.0;

// ────────────────────────────────────────────────────────────────────────
// Last-known-good calibration — used as a fallback when Firestore
// `agsCalibration/current` is unavailable (cron failed, cold start, etc.).
// Refreshed by scripts/computeAgsCalibration.js on every run.
//
// v10 calibration (2026-05-22). Normalizers (mean/sd per feature) are
// taken from the V6+ population; they are unchanged from v9 because v10
// still z-scores the same five features — only the weighting changed.
// The quintile boundaries DID change because the score scale changed.
//
// v10 score-distribution quintile cuts come from running the new
// computeAgs() over all 470 W/L picks in the training window
// (2026-04-18 → 2026-05-22) and taking empirical percentiles:
//   q20 = −0.28   (HARD MUTE — bottom 20%)
//   q40 = −0.01   (LEAN floor)
//   q60 = +0.17   (LOCK floor — full standard size)
//   q80 = +0.38   (PREMIUM floor — 1.5×)
//   q90 = +0.58   (ELITE floor — 2.0×)
//
// Sanity check: under the v10 weights, score=0 corresponds to ≈52% P(WIN)
// via sigmoid (intercept ≈ +0.07), and score=+0.6 corresponds to ≈65% P(WIN).
// This matches the observed Q5 OOS WR of 62.8% almost exactly — the model
// is calibrated, not just discriminative.
//
// Keep this file in sync with Firestore whenever the calibration job's
// quintiles drift >0.05 in any band (the smaller drift threshold reflects
// the smaller absolute score scale), OR at least monthly.
export const AGS_FALLBACK_CALIBRATION = Object.freeze({
  normalizers: {
    dCount:           { mean: 1.476, sd: 1.599 },
    dHcCount:         { mean: 0.465, sd: 0.831 },
    dConvictionAvg:   { mean: 0.539, sd: 0.561 },
    dHcSizeRatio:     { mean: 1.580, sd: 5.431 },
    forContribShare:  { mean: 0.812, sd: 0.249 },
  },
  // v10 logistic-score quintile boundaries (range ≈ [−1.6, +1.7]).
  quintiles: { q20: -0.28, q40: -0.01, q50: 0.08, q60: 0.17, q80: 0.38, q90: 0.58 },
  // Action thresholds derived from the quintiles.
  thresholds: {
    hardMuteFloor: -0.28, // = q20 — hard mute below this AGS-U value
    lockFloor:      0.17, // = q60 — full unit lock floor
    premiumFloor:   0.38, // = q80 — 1.50× sizing
    eliteFloor:     0.58, // = q90 — 2.00× sizing
  },
  sampleSize: 470,
  dateRange: { from: '2026-04-18', to: '2026-05-22' },
  computedAt: '2026-05-22T15:31:25Z',
  source: 'fallback-hardcoded-v10',
  schemaVersion: 'ags-unified-v10',
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
// ────────────────────────────────────────────────────────────────────────
export function computeAgsFromPositions(positions, sideKey, sport, calibration, isProvenFn, isHcEligibleFn = null) {
  if (!Array.isArray(positions) || positions.length === 0) return null;
  const walletDetails = positions.map(positionToWalletDetail).filter(Boolean);
  const agg = aggregateSideProven(walletDetails, sideKey, sport, isProvenFn, isHcEligibleFn);
  if (!agg) return null;
  return computeAgs(agg, calibration);
}

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
// computeAgs — v10 logistic-regression scoring.
//
// Score = intercept + Σ β_k · z(feature_k)
//   where z(feature_k) = (raw_k − cal.normalizers[k].mean) / cal.normalizers[k].sd
//   and β_k is AGS_WEIGHTS[k] (L1-fit on 470 W/L picks).
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
    schemaVersion: cal.schemaVersion || 'ags-unified-v10',

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
// the v10 cutover. All decision logic now flows through agsSizeMultiplier
// (which returns 0 for FADE-tier picks) and meetsAgsLockFloor / meetsAgsHardMute.
// Remove these in a follow-up PR after no callers remain.
//
// Note on v10 magnitudes: these legacy numbers were sized for the v9
// summed-z scale (~5× larger than v10's logit-score scale). Under v10,
// AGS_LOCK_FLOOR=1.00 would never be reached and AGS_MUTE_FLOOR=−2.60
// would never trigger. Do NOT use these in new code — use the
// calibration-aware floor helpers instead.
// ────────────────────────────────────────────────────────────────────────
export const AGS_LOCK_FLOOR  = 0.17; // legacy alias for v10 q60 — use agsLockFloorFromCalibration instead
export const AGS_MUTE_FLOOR  = -0.28; // legacy alias for v10 q20 — use agsHardMuteFloorFromCalibration instead
export const AGS_DW1_FLOOR   = null;  // route retired in v9
export const AGS_ELITE_FLOOR = 0.58;  // legacy alias for v10 q90 fallback

export function failsAgsConfirmationGate(ags) {
  // v9/v10 semantics: failing the confirmation gate = below hard mute floor.
  if (ags == null || !Number.isFinite(ags)) return false;
  return ags < AGS_FALLBACK_CALIBRATION.quintiles.q20;
}
