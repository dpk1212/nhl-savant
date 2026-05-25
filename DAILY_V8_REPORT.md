# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-05-25 ET
**Completed Picks**: 944 | **V8 Era Picks**: 382 | **V8 Since**: 2026-04-18
**Universe**: All locked picks across ML, Spread, Total markets

## Executive Summary

- **Overall**: NEEDS ATTENTION
- **Ranking health**: DEGRADED
- **Sizing health**: DEGRADED
- **Environment health**: HEALTHY
- **Most important takeaway**: Star calibration is not monotonic — higher stars must beat lower stars before tuning anything else.

---

## 1. Intervention Triggers

| Trigger | Status | Detail |
|---|---|---|
| Star inversion | ⚠️ | 4.5★ WR (59.4%) beats 5★ (48.6%) |
| Model P/L vs flat P/L | ⚠️ | Model trails flat by 22.5u — sizing amplifying losses |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 63 | 49.2% | -3.84u | -6.1% | -19.42u | -19.3% | 0.29% | -0.34% |  |
| 7-Day | 103 | 48.5% | -8.50u | -8.3% | -30.76u | -16.7% | 0.18% | -0.49% |  |
| 14-Day | 161 | 49.7% | -10.47u | -6.5% | -41.44u | -13.0% | 0.25% | -0.55% |  |
| 30-Day | 296 | 50.3% | -13.58u | -4.6% | -36.35u | -7.0% | -0.02% | -0.35% |  |
| V8 Era | 382 | 49.7% | -16.72u | -4.4% | -39.19u | -6.2% | 0.04% | -0.42% |  |
| All Time | 944 | 52.0% | -46.24u | -4.9% | -84.07u | -5.6% | -0.23% | -0.11% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=382)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 107 | 54.0% | 54.0% | 48.6% | -5.4% | -12.3% | -10.7% | 2.82 | 0.21% | Weak |
| 4.5 | 32 | 52.4% | 52.4% | 59.4% | +6.9% | 16.0% | 9.8% | 2.72 | -0.54% | Strong |
| 4 | 64 | 53.3% | 53.3% | 48.4% | -4.8% | -7.3% | -4.9% | 1.47 | 0.32% | Weak |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 52 | 53.3% | 53.3% | 50.0% | -3.3% | -1.6% | -7.3% | 0.99 | 0.17% | Fair |
| 2.5 | 54 | 52.2% | 52.2% | 46.3% | -5.9% | -9.5% | -28.9% | 0.68 | -0.29% | Weak |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 1 | 47.4% | 47.4% | 0.0% | -47.4% | -100.0% | -100.0% | 0.50 | 3.10% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 48.6% | 59.4% | -10.8% | INVERTED |
| 4.5★ vs 4★ | 59.4% | 48.4% | +11.0% | Correct |
| 4★ vs 3.5★ | 48.4% | 51.5% | -3.1% | INVERTED |
| 3.5★ vs 3★ | 51.5% | 50.0% | +1.5% | Correct |
| 3★ vs 2.5★ | 50.0% | 46.3% | +3.7% | Correct |
| 2.5★ vs 2★ | 46.3% | 0.0% | +46.3% | Correct |
| 2★ vs 1★ | 0.0% | 0.0% | 0.0% | Flat |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.714 |
| Spearman: Stars vs Flat ROI | 0.548 |
| Spearman: Stars vs CLV | -0.476 |
| Brier Score | 0.2492 |
| Monotonicity Score | -0.29 |

### All Time (n=944)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 120 | 54.5% | 54.5% | 49.2% | -5.3% | -11.9% | -11.0% | 2.81 | 0.28% | Weak |
| 4.5 | 66 | 55.1% | 55.1% | 54.5% | -0.6% | 1.4% | -3.2% | 2.66 | 0.46% | Fair |
| 4 | 179 | 55.0% | 55.0% | 52.0% | -3.1% | -4.7% | -4.0% | 1.89 | -0.32% | Fair |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 212 | 54.7% | 54.7% | 49.1% | -5.7% | -10.2% | -10.1% | 1.15 | -0.39% | Weak |
| 2.5 | 161 | 53.7% | 53.7% | 52.2% | -1.5% | -3.7% | -7.5% | 0.71 | -0.63% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 1 | 47.4% | 47.4% | 0.0% | -47.4% | -100.0% | -100.0% | 0.50 | 3.10% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 49.2% | 54.5% | -5.3% | INVERTED |
| 4.5★ vs 4★ | 54.5% | 52.0% | +2.5% | Correct |
| 4★ vs 3.5★ | 52.0% | 56.5% | -4.5% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 49.1% | +7.4% | Correct |
| 3★ vs 2.5★ | 49.1% | 52.2% | -3.1% | INVERTED |
| 2.5★ vs 2★ | 52.2% | 0.0% | +52.2% | Correct |
| 2★ vs 1★ | 0.0% | 0.0% | 0.0% | Flat |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.548 |
| Spearman: Stars vs Flat ROI | 0.452 |
| Spearman: Stars vs CLV | -0.214 |
| Brier Score | 0.2363 |
| Monotonicity Score | 0.00 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.102 | -0.020 | Tune |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.135 | -0.094 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.084 | -0.055 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.134 | -0.061 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | 0.054 | 0.093 | Keep |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | 0.084 | 0.126 | Keep |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | -0.050 | 0.021 | Tune |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.073 | 0.009 | Tune |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.017 | 0.073 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.032 | 0.002 | Monitor |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.052 | 0.081 | Keep |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.124 | 0.022 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.143 | 0.039 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.078 | -0.001 | Tune |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (12.30–43.85) | 62 | 53.2% | 0.9% | -7.1% | 0.13% |  |
| p20-40 (43.90–49.40) | 62 | 48.4% | -7.8% | -8.7% | -0.29% |  |
| p40-60 (49.53–53.53) | 63 | 46.0% | -14.1% | -3.1% | 0.46% |  |
| p60-80 (53.88–59.32) | 62 | 53.2% | 13.5% | -1.7% | 0.35% |  |
| p80-95 (59.50–65.13) | 62 | 51.6% | -6.1% | -1.3% | -0.06% |  |
| p95+ (65.30–83.30) | 63 | 44.4% | -14.2% | -21.7% | -0.35% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 120 | 46.7% | -13.1% | -9.0% | 0.02% |  |
| 0.90-1.05 | 127 | 43.3% | -16.8% | -23.5% | -0.05% |  |
| 1.05-1.20 | 86 | 62.8% | 26.1% | 25.1% | 0.25% |  |
| 1.20-1.35 | 26 | 53.8% | 1.2% | -16.2% | 0.34% |  |
| 1.35-1.50 | 10 | 40.0% | -19.5% | -54.5% | -0.38% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.62) | 54 | 48.1% | -9.5% | -9.6% | -0.09% |  |
| 20-40% (0.63–0.89) | 54 | 48.1% | -8.9% | 6.9% | 0.04% |  |
| 40-60% (0.89–1.17) | 54 | 53.7% | 11.7% | -0.2% | 0.20% |  |
| 60-80% (1.17–1.42) | 54 | 42.6% | -18.2% | -29.4% | 0.11% |  |
| 80-95% (1.43–1.99) | 54 | 48.1% | -6.4% | -2.3% | -0.11% |  |
| 95%+ (1.99–4.76) | 55 | 49.1% | -7.5% | -8.2% | 0.30% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 23 | 39.1% | -18.6% | -39.0% | 0.54% | Broad support |
| 0.25-0.40 | 88 | 50.0% | -1.5% | -4.1% | 0.23% | Healthy support |
| 0.40-0.60 | 105 | 44.8% | -11.9% | -2.5% | -0.04% | Concentrated |
| 0.60-0.80 | 61 | 54.1% | 1.2% | -2.6% | 0.00% | Very concentrated |
| 0.80-1.00 | 48 | 50.0% | -7.8% | -12.6% | -0.07% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 46 | 37.0% | -30.4% | -29.2% | 0.04% | 4.3 |
| Broad battle | 164 | 45.7% | -8.9% | -7.1% | 0.05% | 3.9 |
| One-wallet nuke | 105 | 54.3% | 0.6% | -2.0% | -0.12% | 3.6 |
| Thin support | 195 | 52.3% | -2.0% | -6.1% | 0.02% | 3.6 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=382)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 15 | 53.3% | -5.7% | 17.7% | 0.29% | 4.3 | 80.0% |
| SMALL_MOVE | 69 | 40.6% | -23.5% | -25.2% | -0.10% | 4.0 | 100.0% |
| CLEAR_MOVE | 105 | 57.1% | 6.0% | 9.5% | 0.20% | 4.0 | 100.0% |
| NEAR_START | 144 | 45.8% | -6.6% | -15.3% | 0.05% | 3.7 | 100.0% |

**All Time** (n=944)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 532 | 53.8% | -5.2% | -4.0% | -0.48% | 3.3 | 3.8% |
| SMALL_MOVE | 72 | 40.3% | -24.0% | -27.1% | -0.01% | 4.0 | 95.8% |
| CLEAR_MOVE | 131 | 56.5% | 4.9% | 7.9% | 0.08% | 4.0 | 100.0% |
| NEAR_START | 160 | 46.3% | -7.1% | -14.9% | 0.08% | 3.7 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 8 / 62.5% / 6.3% | 26 / 38.5% / -36.6% | 47 / 61.7% / 11.5% | 47 / 44.7% / -9.1% |
| 3.5-4★ | 5 / 40.0% / -24.7% | 32 / 43.8% / -13.5% | 34 / 47.1% / -14.6% | 43 / 58.1% / 22.3% |
| 2.5-3★ | 2 / 50.0% / -5.8% | 10 / 40.0% / -13.9% | 24 / 62.5% / 24.5% | 52 / 38.5% / -24.6% |
| 1.0-2★ | — | 1 / 0.0% / -100.0% | — | 2 / 0.0% / -100.0% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 379 | 49.6% | -4.7% | -6.6% | 3.9 | 0.04% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 429 | 49.9% | -4.8% | -6.3% | 3.9 | 0.02% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 648 | 100% |
| LOCKED (direct) | 75 | 11.6% |
| Promoted (SHADOW→LOCKED) | 355 | 54.8% |
| Rejected (stayed SHADOW) | 153 | 23.6% |
| Superseded (side flipped) | 60 | 9.3% |
| Muted | 273 | 42.1% |
| Cancelled | 20 | 3.1% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=382)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -39.19u | -6.2% | — |
| Flat 1.0u | -16.72u | -4.4% | -22.47u |
| Lock units only | -30.59u | — | -8.60u |
| Units change only on star change | -30.14u | — | -9.05u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 107 | 2.82 | -12.3% | -10.7% | -19.26u | Sizing hurts |
| 4.5 | 32 | 2.72 | 16.0% | 9.8% | +3.41u | Sizing helps |
| 4 | 64 | 1.47 | -7.3% | -4.9% | +0.03u | Neutral |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 52 | 0.99 | -1.6% | -7.3% | -2.92u | Sizing hurts |
| 2.5 | 54 | 0.68 | -9.5% | -28.9% | -5.42u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 1 | 0.50 | -100.0% | -100.0% | +0.50u | Neutral |

### All Time (n=944)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -84.07u | -5.6% | — |
| Flat 1.0u | -46.24u | -4.9% | -37.83u |
| Lock units only | -64.70u | — | -19.37u |
| Units change only on star change | -74.18u | — | -9.89u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 120 | 2.81 | -11.9% | -11.0% | -22.86u | Sizing hurts |
| 4.5 | 66 | 2.66 | 1.4% | -3.2% | -6.61u | Sizing hurts |
| 4 | 179 | 1.89 | -4.7% | -4.0% | -5.21u | Sizing hurts |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 212 | 1.15 | -10.2% | -10.1% | -3.07u | Sizing hurts |
| 2.5 | 161 | 0.71 | -3.7% | -7.5% | -2.71u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 1 | 0.50 | -100.0% | -100.0% | +0.50u | Neutral |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 382 | 52.9% | 49.7% | -3.2% | -4.4% | 0.04% | Below market |
| 4.5-5★ | 139 | 53.6% | 51.1% | -2.6% | -5.8% | 0.04% | Below market |
| 3.5-4★ | 132 | 52.2% | 50.0% | -2.2% | -1.1% | 0.12% | Below market |
| 2.5-3★ | 108 | 52.8% | 49.1% | -3.7% | -3.9% | -0.07% | Below market |
| CLEAR_MOVE only | 105 | 54.2% | 57.1% | +3.0% | 6.0% | 0.20% | Beating market |
| NO_MOVE only | 15 | 55.6% | 53.3% | -2.2% | -5.7% | 0.29% | Below market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=79)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 52.720 | 41.450 | 0.81 |  |
| Rank_norm | 62.772 | 65.465 | 0.13 |  |
| PnL_norm | 53.648 | 51.770 | 0.11 |  |
| WalletBase | 53.938 | 45.547 | 0.69 |  |
| SizeRatio | 1.633 | 1.669 | 0.02 |  |
| ConvictionMult | 0.986 | 0.999 | 0.08 |  |
| WalletCountFor | 3.268 | 2.759 | 0.28 |  |
| TopShare | 0.531 | 0.657 | 0.55 |  |
| ForSide | 178.958 | 136.925 | 0.39 |  |
| AgainstSide | 57.746 | 40.844 | 0.19 |  |
| NetEdge | 1.299 | 1.022 | 0.34 |  |
| WalletPlayScore | 1.688 | 0.677 | 0.46 |  |

### V8 Era (n=325)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 52.720 | 52.707 | 0.00 |  |
| Rank_norm | 62.772 | 65.622 | 0.14 |  |
| PnL_norm | 53.648 | 54.370 | 0.04 |  |
| WalletBase | 53.938 | 54.043 | 0.01 |  |
| SizeRatio | 1.633 | 1.615 | 0.01 |  |
| ConvictionMult | 0.986 | 0.988 | 0.01 |  |
| WalletCountFor | 3.268 | 3.268 | 0.00 |  |
| TopShare | 0.531 | 0.531 | 0.00 |  |
| ForSide | 178.958 | 178.958 | 0.00 |  |
| AgainstSide | 57.746 | 57.746 | 0.00 |  |
| NetEdge | 1.299 | 1.299 | 0.00 |  |
| WalletPlayScore | 1.688 | 1.688 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=382)

- **Sizing issue**: Model P/L (-39.19u) trails flat (-16.72u) by 22.47u

### 7-Day (n=103)

- **Ranking issue**: ≤3★ WR (54%) beats ≥4★ (44%)
- **Sizing issue**: Model P/L (-30.76u) trails flat (-8.50u) by 22.26u

### All Time (n=944)

- **Sizing issue**: Model P/L (-84.07u) trails flat (-46.24u) by 37.83u
- **Environment issue**: 56.4% NO_MOVE (WR: 53.8%, ROI: -5.2%)


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
| V8 era picks | 382 |
| V8 flat ROI | -4.4% |
| V8 model ROI | -6.2% |
| V8 star monotonicity score | -0.29 |
| 4.5-5★ ROI | -5.8% |
| 2.5-3★ ROI | -3.9% |
| CLEAR_MOVE ROI | 6.0% |
| NO_MOVE ROI | -5.7% |
| Single-wallet play rate | 24.6% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: 0.21% | 4.5★: -0.54% | 4★: 0.32% | 3.5★: -0.07% | 3★: 0.17% | 2.5★: -0.29% | 2★: 0.67% | 1★: 3.10% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=382)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 300 | 78.5% | 48.3% | -5.5% | -11.5% | 0.08% |
| MUTED | 71 | 18.6% | 54.9% | 0.2% | 20.0% | -0.12% |
| CANCELLED | 11 | 2.9% | 54.5% | -2.8% | -10.4% | 0.16% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| v73_hc_rescue | 21 | 52.4% |
| ags_quality_veto | 18 | 66.7% |
| wps_flipped_diag | 17 | 35.3% |
| winners_below_floor | 14 | 42.9% |
| winners_faded | 12 | 66.7% |
| opp_side_stronger_diag | 11 | 45.5% |
| winners_killed | 9 | 55.6% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 7 | 57.1% |
| ags_hard_mute | 6 | 50.0% |
| whitelist_fade_weak | 3 | 66.7% |
| sum_below_floor | 3 | 33.3% |
| whitelist_fade_strong | 2 | 50.0% |
| dw1_no_ags_support | 1 | 100.0% |

### 7-Day (n=103)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 97 | 94.2% | 48.5% | -8.5% | -18.7% | 0.23% |
| MUTED | 6 | 5.8% | 50.0% | -3.5% | 76.8% | -0.62% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| ags_hard_mute | 6 | 50.0% |
| wps_flipped_diag | 3 | 33.3% |
| opp_side_stronger_diag | 1 | 0.0% |

### All Time (n=944)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 860 | 91.1% | 51.6% | -5.7% | -7.7% | -0.23% |
| MUTED | 71 | 7.5% | 54.9% | 0.2% | 20.0% | -0.12% |
| CANCELLED | 13 | 1.4% | 61.5% | 17.8% | 4.8% | -0.95% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| v73_hc_rescue | 21 | 52.4% |
| ags_quality_veto | 18 | 66.7% |
| wps_flipped_diag | 17 | 35.3% |
| winners_below_floor | 14 | 42.9% |
| winners_faded | 12 | 66.7% |
| opp_side_stronger_diag | 11 | 45.5% |
| winners_killed | 9 | 55.6% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 7 | 57.1% |
| ags_hard_mute | 6 | 50.0% |
| whitelist_fade_weak | 3 | 66.7% |
| sum_below_floor | 3 | 33.3% |
| opposition_building | 2 | 100.0% |
| mid_tier_or_lower | 2 | 100.0% |
| whitelist_fade_strong | 2 | 50.0% |
| dw1_no_ags_support | 1 | 100.0% |
