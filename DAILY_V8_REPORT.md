# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-05-16 ET
**Completed Picks**: 826 | **V8 Era Picks**: 264 | **V8 Since**: 2026-04-18
**Universe**: All locked picks across ML, Spread, Total markets

## Executive Summary

- **Overall**: MONITORING
- **Ranking health**: DEGRADED
- **Sizing health**: HEALTHY
- **Environment health**: HEALTHY
- **Most important takeaway**: Star calibration is not monotonic — higher stars must beat lower stars before tuning anything else.

---

## 1. Intervention Triggers

| Trigger | Status | Detail |
|---|---|---|
| Star inversion | ⚠️ | 2.5★ WR (42.4%) beats 3★ (36.4%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 24 | 50.0% | -0.56u | -2.3% | -0.74u | -1.2% | 0.21% | -1.15% |  |
| 7-Day | 60 | 53.3% | -0.27u | -0.5% | -3.10u | -2.3% | 0.15% | -0.56% |  |
| 14-Day | 94 | 53.2% | -0.45u | -0.5% | 0.89u | 0.5% | -0.26% | -0.42% |  |
| 30-Day | 285 | 49.1% | -15.10u | -5.3% | -16.63u | -3.7% | -0.01% | -0.41% |  |
| V8 Era | 264 | 49.6% | -11.18u | -4.2% | -9.75u | -2.4% | -0.04% | -0.41% |  |
| All Time | 826 | 52.3% | -40.70u | -4.9% | -54.63u | -4.3% | -0.31% | -0.09% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=264)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 73 | 54.0% | 54.0% | 53.4% | -0.6% | -3.7% | 0.6% | 2.73 | 0.19% | Fair |
| 4.5 | 23 | 51.3% | 51.3% | 56.5% | +5.2% | 14.0% | 6.6% | 2.63 | -0.78% | Strong |
| 4 | 41 | 52.8% | 52.8% | 48.8% | -4.0% | -6.3% | -9.3% | 1.26 | 0.20% | Weak |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 22 | 55.2% | 55.2% | 36.4% | -18.9% | -29.7% | -32.2% | 1.05 | -0.02% | Failing |
| 2.5 | 33 | 52.7% | 52.7% | 42.4% | -10.3% | -16.8% | -30.5% | 0.68 | -0.25% | Failing |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 53.4% | 56.5% | -3.1% | INVERTED |
| 4.5★ vs 4★ | 56.5% | 48.8% | +7.7% | Correct |
| 4★ vs 3.5★ | 48.8% | 51.5% | -2.7% | Flat |
| 3.5★ vs 3★ | 51.5% | 36.4% | +15.1% | Correct |
| 3★ vs 2.5★ | 36.4% | 42.4% | -6.0% | INVERTED |
| 2.5★ vs 2★ | 42.4% | 0.0% | +42.4% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.893 |
| Spearman: Stars vs Flat ROI | 0.786 |
| Spearman: Stars vs CLV | -0.214 |
| Brier Score | 0.2480 |
| Monotonicity Score | 0.00 |

### All Time (n=826)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 86 | 54.7% | 54.7% | 53.5% | -1.2% | -4.4% | -1.5% | 2.71 | 0.30% | Fair |
| 4.5 | 57 | 55.1% | 55.1% | 52.6% | -2.5% | -1.7% | -6.9% | 2.62 | 0.53% | Fair |
| 4 | 156 | 55.1% | 55.1% | 52.6% | -2.6% | -4.0% | -4.6% | 1.90 | -0.46% | Fair |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 182 | 55.2% | 55.2% | 47.3% | -7.9% | -15.0% | -13.1% | 1.19 | -0.54% | Failing |
| 2.5 | 140 | 54.1% | 54.1% | 52.1% | -1.9% | -4.5% | -4.9% | 0.72 | -0.68% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 53.5% | 52.6% | +0.9% | Correct |
| 4.5★ vs 4★ | 52.6% | 52.6% | 0.0% | Flat |
| 4★ vs 3.5★ | 52.6% | 56.5% | -3.9% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 47.3% | +9.2% | Correct |
| 3★ vs 2.5★ | 47.3% | 52.1% | -4.8% | INVERTED |
| 2.5★ vs 2★ | 52.1% | 0.0% | +52.1% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.714 |
| Spearman: Stars vs Flat ROI | 0.643 |
| Spearman: Stars vs CLV | 0.179 |
| Brier Score | 0.2340 |
| Monotonicity Score | -0.17 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.019 | 0.007 | Monitor |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.034 | -0.035 | Monitor |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.051 | -0.056 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.067 | -0.046 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | 0.192 | 0.182 | Keep |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | 0.223 | 0.222 | Keep |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | 0.099 | 0.107 | Keep |
| ForSide | Side support | Total wallet force on side | Higher → better | 0.004 | 0.049 | Monitor |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.041 | 0.088 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | 0.023 | 0.017 | Monitor |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.114 | 0.121 | Keep |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.053 | -0.019 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.069 | -0.002 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.006 | 0.037 | Monitor |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (21.47–48.22) | 42 | 47.6% | -9.9% | -0.4% | -0.37% |  |
| p20-40 (48.47–52.50) | 43 | 51.2% | -3.6% | 9.1% | 0.38% |  |
| p40-60 (52.51–56.63) | 43 | 55.8% | 20.6% | 12.6% | 0.15% |  |
| p60-80 (56.73–62.10) | 42 | 45.2% | -10.0% | -10.8% | 0.33% |  |
| p80-95 (62.35–65.66) | 43 | 48.8% | -14.4% | -17.6% | -0.30% |  |
| p95+ (65.93–83.30) | 43 | 46.5% | -11.2% | -16.5% | -0.45% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 81 | 40.7% | -22.7% | -10.9% | -0.14% |  |
| 0.90-1.05 | 89 | 42.7% | -19.9% | -23.7% | -0.03% |  |
| 1.05-1.20 | 58 | 69.0% | 39.9% | 43.1% | 0.22% |  |
| 1.20-1.35 | 16 | 56.3% | 7.8% | -13.2% | -0.16% |  |
| 1.35-1.50 | 8 | 50.0% | 0.6% | -40.8% | -0.46% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.70) | 39 | 46.2% | -10.0% | -7.7% | -0.27% |  |
| 20-40% (0.71–0.93) | 39 | 46.2% | -12.2% | 4.4% | -0.61% |  |
| 40-60% (0.94–1.23) | 39 | 64.1% | 31.5% | -1.3% | 0.32% |  |
| 60-80% (1.24–1.53) | 39 | 35.9% | -32.0% | -22.3% | 0.27% |  |
| 80-95% (1.53–2.07) | 39 | 46.2% | -14.9% | 6.6% | -0.15% |  |
| 95%+ (2.11–4.76) | 40 | 52.5% | 1.7% | -6.3% | 0.32% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 19 | 42.1% | -15.4% | -28.0% | 0.49% | Broad support |
| 0.25-0.40 | 75 | 52.0% | 2.0% | 1.7% | 0.18% | Healthy support |
| 0.40-0.60 | 79 | 44.3% | -12.1% | 4.6% | 0.06% | Concentrated |
| 0.60-0.80 | 42 | 54.8% | -0.0% | -7.2% | -0.32% | Very concentrated |
| 0.80-1.00 | 20 | 45.0% | -15.1% | -37.2% | -0.96% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 37 | 40.5% | -22.4% | -13.8% | -0.04% | 4.2 |
| Broad battle | 134 | 47.8% | -4.7% | -0.2% | -0.02% | 3.9 |
| One-wallet nuke | 49 | 53.1% | -0.4% | -1.7% | -0.51% | 3.7 |
| Thin support | 116 | 50.9% | -4.7% | -8.1% | -0.18% | 3.6 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=264)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 11 | 45.5% | -18.7% | 4.1% | 0.26% | 4.3 | 72.7% |
| SMALL_MOVE | 45 | 40.0% | -24.2% | -30.1% | 0.14% | 4.0 | 100.0% |
| CLEAR_MOVE | 72 | 58.3% | 5.1% | 16.1% | -0.12% | 4.0 | 100.0% |
| NEAR_START | 115 | 47.0% | -3.4% | -6.7% | -0.06% | 3.7 | 100.0% |

**All Time** (n=826)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 528 | 53.6% | -5.4% | -4.6% | -0.49% | 3.2 | 3.0% |
| SMALL_MOVE | 48 | 39.6% | -24.9% | -32.6% | 0.27% | 4.0 | 93.8% |
| CLEAR_MOVE | 98 | 57.1% | 3.9% | 11.9% | -0.19% | 4.0 | 100.0% |
| NEAR_START | 131 | 47.3% | -4.4% | -7.4% | -0.01% | 3.7 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 7 / 57.1% / 0.8% | 15 / 33.3% / -48.1% | 30 / 66.7% / 18.6% | 37 / 51.4% / 5.5% |
| 3.5-4★ | 2 / 0.0% / -100.0% | 26 / 42.3% / -15.0% | 29 / 48.3% / -12.8% | 39 / 59.0% / 23.6% |
| 2.5-3★ | 2 / 50.0% / -5.8% | 3 / 66.7% / 40.6% | 13 / 61.5% / 13.9% | 38 / 31.6% / -37.3% |
| 1.0-2★ | — | 1 / 0.0% / -100.0% | — | 1 / 0.0% / -100.0% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 261 | 49.4% | -4.6% | -2.9% | 3.9 | -0.05% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 311 | 49.8% | -4.8% | -3.2% | 3.9 | -0.06% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 419 | 100% |
| LOCKED (direct) | 65 | 15.5% |
| Promoted (SHADOW→LOCKED) | 210 | 50.1% |
| Rejected (stayed SHADOW) | 105 | 25.1% |
| Superseded (side flipped) | 34 | 8.1% |
| Muted | 186 | 44.4% |
| Cancelled | 20 | 4.8% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=264)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -9.75u | -2.4% | — |
| Flat 1.0u | -11.18u | -4.2% | +1.43u |
| Lock units only | -2.98u | — | -6.77u |
| Units change only on star change | -1.16u | — | -8.59u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 73 | 2.73 | -3.7% | 0.6% | +3.93u | Sizing helps |
| 4.5 | 23 | 2.63 | 14.0% | 6.6% | +0.78u | Sizing helps |
| 4 | 41 | 1.26 | -6.3% | -9.3% | -2.19u | Sizing hurts |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 22 | 1.05 | -29.7% | -32.2% | -0.92u | Sizing hurts |
| 2.5 | 33 | 0.68 | -16.8% | -30.5% | -1.36u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |

### All Time (n=826)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -54.63u | -4.3% | — |
| Flat 1.0u | -40.70u | -4.9% | -13.93u |
| Lock units only | -37.09u | — | -17.54u |
| Units change only on star change | -45.20u | — | -9.43u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 86 | 2.71 | -4.4% | -1.5% | +0.33u | Neutral |
| 4.5 | 57 | 2.62 | -1.7% | -6.9% | -9.24u | Sizing hurts |
| 4 | 156 | 1.90 | -4.0% | -4.6% | -7.43u | Sizing hurts |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 182 | 1.19 | -15.0% | -13.1% | -1.07u | Sizing hurts |
| 2.5 | 140 | 0.72 | -4.5% | -4.9% | +1.36u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 264 | 52.8% | 49.6% | -3.2% | -4.2% | -0.04% | Below market |
| 4.5-5★ | 96 | 53.4% | 54.2% | +0.8% | 0.5% | -0.04% | Neutral |
| 3.5-4★ | 109 | 51.8% | 50.5% | -1.4% | 0.6% | 0.03% | Neutral |
| 2.5-3★ | 57 | 53.7% | 42.1% | -11.6% | -18.2% | -0.18% | Below market |
| CLEAR_MOVE only | 72 | 54.4% | 58.3% | +3.9% | 5.1% | -0.12% | Beating market |
| NO_MOVE only | 11 | 55.7% | 45.5% | -10.2% | -18.7% | 0.26% | Below market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=40)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 56.480 | 49.754 | 0.62 |  |
| Rank_norm | 64.753 | 68.070 | 0.20 |  |
| PnL_norm | 55.545 | 48.342 | 0.46 |  |
| WalletBase | 57.149 | 50.374 | 0.70 |  |
| SizeRatio | 1.700 | 1.686 | 0.01 |  |
| ConvictionMult | 0.991 | 1.021 | 0.18 |  |
| WalletCountFor | 3.443 | 3.625 | 0.10 |  |
| TopShare | 0.489 | 0.534 | 0.21 |  |
| ForSide | 193.915 | 182.440 | 0.11 |  |
| AgainstSide | 64.145 | 61.353 | 0.03 |  |
| NetEdge | 1.394 | 1.303 | 0.10 |  |
| WalletPlayScore | 2.028 | 1.787 | 0.11 |  |

### V8 Era (n=235)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 56.480 | 56.601 | 0.01 |  |
| Rank_norm | 64.753 | 65.134 | 0.02 |  |
| PnL_norm | 55.545 | 55.397 | 0.01 |  |
| WalletBase | 57.149 | 57.048 | 0.01 |  |
| SizeRatio | 1.700 | 1.610 | 0.06 |  |
| ConvictionMult | 0.991 | 0.983 | 0.05 |  |
| WalletCountFor | 3.443 | 3.443 | 0.00 |  |
| TopShare | 0.489 | 0.489 | 0.00 |  |
| ForSide | 193.915 | 193.915 | 0.00 |  |
| AgainstSide | 64.145 | 64.145 | 0.00 |  |
| NetEdge | 1.394 | 1.394 | 0.00 |  |
| WalletPlayScore | 2.028 | 2.028 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=264)

- **Gate issue**: NO_MOVE ROI (-18.7%) significantly trails CLEAR_MOVE (5.1%)

### 7-Day (n=60)

- **Sizing issue**: Model P/L (-3.10u) trails flat (-0.27u) by 2.83u
- **Concentration issue**: 13 high-concentration picks (TopShare>0.6) at -17.6% ROI

### All Time (n=826)

- **Sizing issue**: Model P/L (-54.63u) trails flat (-40.70u) by 13.93u
- **Environment issue**: 63.9% NO_MOVE (WR: 53.6%, ROI: -5.4%)


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
| V8 era picks | 264 |
| V8 flat ROI | -4.2% |
| V8 model ROI | -2.4% |
| V8 star monotonicity score | 0.00 |
| 4.5-5★ ROI | 0.5% |
| 2.5-3★ ROI | -18.2% |
| CLEAR_MOVE ROI | 5.1% |
| NO_MOVE ROI | -18.7% |
| Single-wallet play rate | 18.2% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: 0.19% | 4.5★: -0.78% | 4★: 0.20% | 3.5★: -0.07% | 3★: -0.02% | 2.5★: -0.25% | 2★: 0.67% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=264)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 188 | 71.2% | 47.3% | -6.0% | -8.9% | -0.04% |
| MUTED | 65 | 24.6% | 55.4% | 0.5% | 17.9% | -0.08% |
| CANCELLED | 11 | 4.2% | 54.5% | -2.8% | -10.4% | 0.16% |

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

### 7-Day (n=60)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 42 | 70.0% | 47.6% | -7.9% | -17.1% | -0.22% |
| MUTED | 15 | 25.0% | 73.3% | 26.7% | 30.0% | 0.98% |
| CANCELLED | 3 | 5.0% | 33.3% | -32.7% | -24.3% | 1.04% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| ags_quality_veto | 13 | 69.2% |
| v73_hc_rescue | 6 | 83.3% |
| winners_killed | 3 | 33.3% |
| opp_side_stronger_diag | 3 | 66.7% |
| winners_faded | 1 | 100.0% |
| wps_flipped_diag | 1 | 100.0% |
| dw1_no_ags_support | 1 | 100.0% |

### All Time (n=826)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 748 | 90.6% | 51.9% | -5.8% | -6.3% | -0.32% |
| MUTED | 65 | 7.9% | 55.4% | 0.5% | 17.9% | -0.08% |
| CANCELLED | 13 | 1.6% | 61.5% | 17.8% | 4.8% | -0.95% |

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
