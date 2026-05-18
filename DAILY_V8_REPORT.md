# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-05-18 ET
**Completed Picks**: 841 | **V8 Era Picks**: 279 | **V8 Since**: 2026-04-18
**Universe**: All locked picks across ML, Spread, Total markets

## Executive Summary

- **Overall**: MONITORING
- **Ranking health**: DEGRADED
- **Sizing health**: MARGINAL
- **Environment health**: HEALTHY
- **Most important takeaway**: Star calibration is not monotonic — higher stars must beat lower stars before tuning anything else.

---

## 1. Intervention Triggers

| Trigger | Status | Detail |
|---|---|---|
| Star inversion | ⚠️ | 4.5★ WR (58.3%) beats 5★ (51.9%) |
| Star inversion | ⚠️ | 2.5★ WR (44.4%) beats 3★ (39.1%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 23 | 56.5% | 2.70u | 11.8% | 0.96u | 2.3% | 0.34% | -0.57% | Strong |
| 7-Day | 58 | 51.7% | -1.97u | -3.4% | -10.68u | -8.0% | 0.38% | -0.68% |  |
| 14-Day | 100 | 54.0% | 1.97u | 2.0% | 4.42u | 2.1% | -0.14% | -0.52% |  |
| 30-Day | 279 | 50.2% | -8.22u | -2.9% | -8.43u | -1.9% | -0.01% | -0.41% |  |
| V8 Era | 279 | 50.2% | -8.22u | -2.9% | -8.43u | -1.9% | -0.01% | -0.41% |  |
| All Time | 841 | 52.4% | -37.73u | -4.5% | -53.31u | -4.1% | -0.29% | -0.09% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=279)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 79 | 53.6% | 53.6% | 51.9% | -1.7% | -5.4% | -1.9% | 2.74 | 0.24% | Weak |
| 4.5 | 24 | 51.4% | 51.4% | 58.3% | +6.9% | 17.2% | 9.5% | 2.62 | -0.68% | Strong |
| 4 | 45 | 53.2% | 53.2% | 51.1% | -2.1% | -3.3% | -1.9% | 1.34 | 0.24% | Fair |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 23 | 54.5% | 54.5% | 39.1% | -15.3% | -21.3% | -27.2% | 1.06 | -0.01% | Failing |
| 2.5 | 36 | 52.4% | 52.4% | 44.4% | -7.9% | -12.9% | -27.8% | 0.66 | -0.28% | Weak |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 51.9% | 58.3% | -6.4% | INVERTED |
| 4.5★ vs 4★ | 58.3% | 51.1% | +7.2% | Correct |
| 4★ vs 3.5★ | 51.1% | 51.5% | -0.4% | Flat |
| 3.5★ vs 3★ | 51.5% | 39.1% | +12.4% | Correct |
| 3★ vs 2.5★ | 39.1% | 44.4% | -5.3% | INVERTED |
| 2.5★ vs 2★ | 44.4% | 0.0% | +44.4% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.893 |
| Spearman: Stars vs Flat ROI | 0.714 |
| Spearman: Stars vs CLV | -0.214 |
| Brier Score | 0.2478 |
| Monotonicity Score | 0.00 |

### All Time (n=841)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 92 | 54.3% | 54.3% | 52.2% | -2.2% | -5.9% | -3.5% | 2.73 | 0.33% | Weak |
| 4.5 | 58 | 55.1% | 55.1% | 53.4% | -1.6% | -0.1% | -5.4% | 2.61 | 0.55% | Fair |
| 4 | 160 | 55.2% | 55.2% | 53.1% | -2.1% | -3.2% | -3.3% | 1.90 | -0.43% | Fair |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 183 | 55.1% | 55.1% | 47.5% | -7.5% | -14.0% | -12.7% | 1.19 | -0.53% | Weak |
| 2.5 | 143 | 53.9% | 53.9% | 52.4% | -1.5% | -3.8% | -4.6% | 0.72 | -0.67% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 52.2% | 53.4% | -1.2% | Flat |
| 4.5★ vs 4★ | 53.4% | 53.1% | +0.3% | Correct |
| 4★ vs 3.5★ | 53.1% | 56.5% | -3.4% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 47.5% | +9.0% | Correct |
| 3★ vs 2.5★ | 47.5% | 52.4% | -4.9% | INVERTED |
| 2.5★ vs 2★ | 52.4% | 0.0% | +52.4% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.464 |
| Spearman: Stars vs Flat ROI | 0.464 |
| Spearman: Stars vs CLV | 0.179 |
| Brier Score | 0.2342 |
| Monotonicity Score | 0.00 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.029 | 0.010 | Monitor |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.060 | -0.059 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.090 | -0.092 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.091 | -0.062 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | 0.171 | 0.172 | Keep |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | 0.205 | 0.214 | Keep |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | 0.065 | 0.086 | Keep |
| ForSide | Side support | Total wallet force on side | Higher → better | 0.006 | 0.057 | Monitor |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.045 | 0.097 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | 0.028 | 0.022 | Monitor |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.124 | 0.134 | Keep |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.039 | -0.037 | Monitor |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.057 | -0.019 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | 0.005 | 0.050 | Monitor |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (21.47–47.65) | 45 | 42.2% | -18.8% | -5.3% | -0.17% |  |
| p20-40 (47.73–51.75) | 45 | 57.8% | 8.7% | 17.9% | 0.18% |  |
| p40-60 (51.90–56.27) | 45 | 57.8% | 24.7% | 14.4% | 0.27% |  |
| p60-80 (56.30–61.50) | 45 | 42.2% | -17.4% | -19.4% | 0.46% |  |
| p80-95 (61.97–65.40) | 45 | 53.3% | -4.4% | -4.6% | -0.47% |  |
| p95+ (65.52–83.30) | 46 | 45.7% | -12.7% | -18.5% | -0.34% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 87 | 41.4% | -22.1% | -10.6% | -0.14% |  |
| 0.90-1.05 | 93 | 44.1% | -16.0% | -22.6% | -0.02% |  |
| 1.05-1.20 | 62 | 69.4% | 40.6% | 45.4% | 0.32% |  |
| 1.20-1.35 | 16 | 56.3% | 7.8% | -13.2% | -0.16% |  |
| 1.35-1.50 | 9 | 44.4% | -10.6% | -49.9% | -0.34% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.72) | 41 | 43.9% | -14.4% | -11.5% | -0.24% |  |
| 20-40% (0.73–0.95) | 41 | 48.8% | -6.6% | 11.1% | -0.46% |  |
| 40-60% (0.95–1.24) | 41 | 63.4% | 29.2% | -1.4% | 0.25% |  |
| 60-80% (1.24–1.52) | 41 | 36.6% | -28.9% | -23.3% | 0.16% |  |
| 80-95% (1.53–2.07) | 41 | 48.8% | -9.0% | 10.4% | 0.11% |  |
| 95%+ (2.07–4.76) | 41 | 51.2% | -0.8% | -8.4% | 0.33% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 20 | 45.0% | -6.4% | -25.6% | 0.46% | Broad support |
| 0.25-0.40 | 76 | 52.6% | 3.6% | 2.6% | 0.23% | Healthy support |
| 0.40-0.60 | 84 | 45.2% | -10.8% | 5.5% | 0.06% | Concentrated |
| 0.60-0.80 | 44 | 54.5% | 0.3% | -6.1% | -0.25% | Very concentrated |
| 0.80-1.00 | 22 | 40.9% | -22.9% | -45.3% | -0.74% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 39 | 41.0% | -21.5% | -14.8% | 0.01% | 4.3 |
| Broad battle | 139 | 48.2% | -3.2% | 1.3% | 0.03% | 3.9 |
| One-wallet nuke | 55 | 52.7% | -1.3% | -5.7% | -0.45% | 3.6 |
| Thin support | 125 | 51.2% | -4.1% | -7.8% | -0.16% | 3.6 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=279)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 11 | 45.5% | -18.7% | 4.1% | 0.26% | 4.3 | 72.7% |
| SMALL_MOVE | 47 | 42.6% | -18.2% | -24.4% | 0.11% | 4.0 | 100.0% |
| CLEAR_MOVE | 76 | 59.2% | 7.8% | 19.0% | -0.04% | 4.1 | 100.0% |
| NEAR_START | 120 | 45.8% | -5.9% | -9.9% | 0.00% | 3.8 | 100.0% |

**All Time** (n=841)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 528 | 53.6% | -5.4% | -4.6% | -0.49% | 3.2 | 3.0% |
| SMALL_MOVE | 50 | 42.0% | -19.2% | -27.5% | 0.24% | 4.0 | 94.0% |
| CLEAR_MOVE | 102 | 57.8% | 6.0% | 14.2% | -0.13% | 4.0 | 100.0% |
| NEAR_START | 136 | 46.3% | -6.6% | -10.1% | 0.04% | 3.7 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 7 / 57.1% / 0.8% | 15 / 33.3% / -48.1% | 34 / 67.6% / 23.1% | 40 / 47.5% / -2.4% |
| 3.5-4★ | 2 / 0.0% / -100.0% | 27 / 44.4% / -11.9% | 29 / 48.3% / -12.8% | 40 / 60.0% / 25.2% |
| 2.5-3★ | 2 / 50.0% / -5.8% | 4 / 75.0% / 71.7% | 13 / 61.5% / 13.9% | 39 / 30.8% / -38.9% |
| 1.0-2★ | — | 1 / 0.0% / -100.0% | — | 1 / 0.0% / -100.0% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 276 | 50.0% | -3.3% | -2.4% | 3.9 | -0.02% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 326 | 50.3% | -3.7% | -2.7% | 3.9 | -0.03% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 464 | 100% |
| LOCKED (direct) | 65 | 14.0% |
| Promoted (SHADOW→LOCKED) | 235 | 50.6% |
| Rejected (stayed SHADOW) | 119 | 25.6% |
| Superseded (side flipped) | 40 | 8.6% |
| Muted | 209 | 45.0% |
| Cancelled | 20 | 4.3% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=279)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -8.43u | -1.9% | — |
| Flat 1.0u | -8.22u | -2.9% | -0.21u |
| Lock units only | -2.39u | — | -6.04u |
| Units change only on star change | 4.48u | — | -12.91u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 79 | 2.74 | -5.4% | -1.9% | +0.17u | Neutral |
| 4.5 | 24 | 2.62 | 17.2% | 9.5% | +1.86u | Sizing helps |
| 4 | 45 | 1.34 | -3.3% | -1.9% | +0.32u | Neutral |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 23 | 1.06 | -21.3% | -27.2% | -1.77u | Sizing hurts |
| 2.5 | 36 | 0.66 | -12.9% | -27.8% | -1.99u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |

### All Time (n=841)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -53.31u | -4.1% | — |
| Flat 1.0u | -37.73u | -4.5% | -15.58u |
| Lock units only | -36.51u | — | -16.80u |
| Units change only on star change | -39.56u | — | -13.75u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 92 | 2.73 | -5.9% | -3.5% | -3.43u | Sizing hurts |
| 4.5 | 58 | 2.61 | -0.1% | -5.4% | -8.16u | Sizing hurts |
| 4 | 160 | 1.90 | -3.2% | -3.3% | -4.92u | Sizing hurts |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 183 | 1.19 | -14.0% | -12.7% | -1.92u | Sizing hurts |
| 2.5 | 143 | 0.72 | -3.8% | -4.6% | +0.73u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 279 | 52.7% | 50.2% | -2.5% | -2.9% | -0.01% | Below market |
| 4.5-5★ | 103 | 53.1% | 53.4% | +0.3% | -0.2% | 0.03% | Neutral |
| 3.5-4★ | 113 | 52.0% | 51.3% | -0.7% | 1.6% | 0.05% | Neutral |
| 2.5-3★ | 61 | 53.2% | 44.3% | -8.9% | -12.8% | -0.19% | Below market |
| CLEAR_MOVE only | 76 | 54.2% | 59.2% | +5.0% | 7.8% | -0.04% | Beating market |
| NO_MOVE only | 11 | 55.7% | 45.5% | -10.2% | -18.7% | 0.26% | Below market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=44)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 56.056 | 47.961 | 0.73 |  |
| Rank_norm | 64.538 | 70.345 | 0.33 |  |
| PnL_norm | 54.920 | 47.459 | 0.47 |  |
| WalletBase | 56.703 | 48.480 | 0.84 |  |
| SizeRatio | 1.674 | 1.434 | 0.16 |  |
| ConvictionMult | 0.990 | 0.992 | 0.01 |  |
| WalletCountFor | 3.431 | 3.705 | 0.15 |  |
| TopShare | 0.491 | 0.505 | 0.07 |  |
| ForSide | 192.456 | 179.325 | 0.12 |  |
| AgainstSide | 63.173 | 57.432 | 0.07 |  |
| NetEdge | 1.388 | 1.305 | 0.10 |  |
| WalletPlayScore | 2.013 | 1.969 | 0.02 |  |

### V8 Era (n=246)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 56.056 | 56.323 | 0.02 |  |
| Rank_norm | 64.538 | 65.670 | 0.06 |  |
| PnL_norm | 54.920 | 55.205 | 0.02 |  |
| WalletBase | 56.703 | 56.771 | 0.01 |  |
| SizeRatio | 1.674 | 1.598 | 0.05 |  |
| ConvictionMult | 0.990 | 0.984 | 0.04 |  |
| WalletCountFor | 3.431 | 3.431 | 0.00 |  |
| TopShare | 0.491 | 0.491 | 0.00 |  |
| ForSide | 192.456 | 192.456 | 0.00 |  |
| AgainstSide | 63.173 | 63.173 | 0.00 |  |
| NetEdge | 1.388 | 1.388 | 0.00 |  |
| WalletPlayScore | 2.013 | 2.013 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=279)

- **Gate issue**: NO_MOVE ROI (-18.7%) significantly trails CLEAR_MOVE (7.8%)

### 7-Day (n=58)

- **Ranking issue**: ≤3★ WR (63%) beats ≥4★ (49%)
- **Sizing issue**: Model P/L (-10.68u) trails flat (-1.97u) by 8.71u
- **Concentration issue**: 13 high-concentration picks (TopShare>0.6) at -31.5% ROI

### All Time (n=841)

- **Sizing issue**: Model P/L (-53.31u) trails flat (-37.73u) by 15.58u
- **Environment issue**: 62.8% NO_MOVE (WR: 53.6%, ROI: -5.4%)


---

## 12. Action Board

| Priority | Issue | Evidence | Action | Owner | Status |
|---|---|---|---|---|---|
| P1 | _Review after data accumulates_ | — | — | — | Pending |
| P2 | _Review after data accumulates_ | — | — | — | Pending |

_Fill this in manually after reviewing the diagnostic sections above._

---

## 13. Keep / Tune / Cut Rules

### Keep
- Variables with stable monotonic improvement across 7-day, 14-day, and V8-era windows
- Variables that improve both flat ROI and CLV
- Variables that work inside supportive regimes without needing heroic overrides

### Tune
- Variables with mixed direction by sport or odds band
- Variables that improve WR but not ROI
- Variables that work only when paired with low concentration or supportive gate conditions

### Cut
- Variables with repeated inversion
- Variables that only add value through noise or one hot streak
- Overrides that increase size without improving rank quality

---

## 14. Required Weekly Questions

1. Are higher V8 stars still beating lower V8 stars?
2. Is WalletPlayScore monotonic by WR, ROI, and CLV?
3. Is high conviction actually helping, or only in certain ranges?
4. Is concentration penalty strong enough to suppress fake one-wallet bombs?
5. Is the lock/shadow gate improving V8 or polluting it?
6. Are certain sports or odds bands breaking V8?
7. Is the whale override helping or leaking bad exposure?
8. Did the live wallet universe drift far enough to require threshold recalibration?

---

## 15. Minimal Dashboard KPIs

| KPI | Value |
|---|---|
| V8 era picks | 279 |
| V8 flat ROI | -2.9% |
| V8 model ROI | -1.9% |
| V8 star monotonicity score | 0.00 |
| 4.5-5★ ROI | -0.2% |
| 2.5-3★ ROI | -12.8% |
| CLEAR_MOVE ROI | 7.8% |
| NO_MOVE ROI | -18.7% |
| Single-wallet play rate | 18.6% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: 0.24% | 4.5★: -0.68% | 4★: 0.24% | 3.5★: -0.07% | 3★: -0.01% | 2.5★: -0.28% | 2★: 0.67% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=279)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 203 | 72.8% | 48.3% | -4.1% | -7.6% | 0.00% |
| MUTED | 65 | 23.3% | 55.4% | 0.5% | 17.9% | -0.08% |
| CANCELLED | 11 | 3.9% | 54.5% | -2.8% | -10.4% | 0.16% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| v73_hc_rescue | 21 | 52.4% |
| ags_quality_veto | 18 | 66.7% |
| winners_below_floor | 14 | 42.9% |
| wps_flipped_diag | 14 | 35.7% |
| winners_faded | 12 | 66.7% |
| opp_side_stronger_diag | 10 | 50.0% |
| winners_killed | 9 | 55.6% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 7 | 57.1% |
| whitelist_fade_weak | 3 | 66.7% |
| sum_below_floor | 3 | 33.3% |
| whitelist_fade_strong | 2 | 50.0% |
| dw1_no_ags_support | 1 | 100.0% |

### 7-Day (n=58)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 43 | 74.1% | 46.5% | -9.5% | -21.3% | 0.12% |
| MUTED | 14 | 24.1% | 71.4% | 22.1% | 25.2% | 1.27% |
| CANCELLED | 1 | 1.7% | 0.0% | -100.0% | -100.0% | -1.13% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| ags_quality_veto | 12 | 66.7% |
| v73_hc_rescue | 4 | 75.0% |
| winners_faded | 1 | 100.0% |
| opp_side_stronger_diag | 1 | 100.0% |
| wps_flipped_diag | 1 | 100.0% |
| winners_killed | 1 | 0.0% |
| dw1_no_ags_support | 1 | 100.0% |

### All Time (n=841)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 763 | 90.7% | 52.0% | -5.3% | -6.1% | -0.30% |
| MUTED | 65 | 7.7% | 55.4% | 0.5% | 17.9% | -0.08% |
| CANCELLED | 13 | 1.5% | 61.5% | 17.8% | 4.8% | -0.95% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| v73_hc_rescue | 21 | 52.4% |
| ags_quality_veto | 18 | 66.7% |
| winners_below_floor | 14 | 42.9% |
| wps_flipped_diag | 14 | 35.7% |
| winners_faded | 12 | 66.7% |
| opp_side_stronger_diag | 10 | 50.0% |
| winners_killed | 9 | 55.6% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 7 | 57.1% |
| whitelist_fade_weak | 3 | 66.7% |
| sum_below_floor | 3 | 33.3% |
| opposition_building | 2 | 100.0% |
| mid_tier_or_lower | 2 | 100.0% |
| whitelist_fade_strong | 2 | 50.0% |
| dw1_no_ags_support | 1 | 100.0% |
