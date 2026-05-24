# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-05-24 ET
**Completed Picks**: 924 | **V8 Era Picks**: 362 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (63.3%) beats 5★ (48.6%) |
| Model P/L vs flat P/L | ⚠️ | Model trails flat by 16.9u — sizing amplifying losses |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 55 | 52.7% | -0.07u | -0.1% | -14.53u | -16.4% | 0.31% | -0.46% |  |
| 7-Day | 92 | 51.1% | -3.06u | -3.3% | -20.90u | -12.2% | 0.13% | -0.50% |  |
| 14-Day | 153 | 51.6% | -3.54u | -2.3% | -26.96u | -8.8% | 0.19% | -0.54% |  |
| 30-Day | 286 | 51.4% | -7.87u | -2.8% | -24.63u | -4.9% | -0.02% | -0.36% |  |
| V8 Era | 362 | 50.3% | -12.31u | -3.4% | -29.24u | -4.9% | 0.03% | -0.42% |  |
| All Time | 924 | 52.3% | -41.82u | -4.5% | -74.12u | -5.0% | -0.25% | -0.11% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=362)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 105 | 54.0% | 54.0% | 48.6% | -5.5% | -12.4% | -11.9% | 2.82 | 0.18% | Weak |
| 4.5 | 30 | 52.5% | 52.5% | 63.3% | +10.8% | 23.8% | 19.0% | 2.68 | -0.54% | Strong |
| 4 | 58 | 53.5% | 53.5% | 51.7% | -1.8% | -2.0% | 1.8% | 1.46 | 0.36% | Fair |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 45 | 53.3% | 53.3% | 48.9% | -4.4% | -2.5% | -9.4% | 0.99 | 0.15% | Fair |
| 2.5 | 51 | 52.5% | 52.5% | 45.1% | -7.4% | -12.0% | -29.0% | 0.70 | -0.35% | Weak |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 1 | 47.4% | 47.4% | 0.0% | -47.4% | -100.0% | -100.0% | 0.50 | 3.10% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 48.6% | 63.3% | -14.7% | INVERTED |
| 4.5★ vs 4★ | 63.3% | 51.7% | +11.6% | Correct |
| 4★ vs 3.5★ | 51.7% | 51.5% | +0.2% | Correct |
| 3.5★ vs 3★ | 51.5% | 48.9% | +2.6% | Correct |
| 3★ vs 2.5★ | 48.9% | 45.1% | +3.8% | Correct |
| 2.5★ vs 2★ | 45.1% | 0.0% | +45.1% | Correct |
| 2★ vs 1★ | 0.0% | 0.0% | 0.0% | Flat |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.738 |
| Spearman: Stars vs Flat ROI | 0.595 |
| Spearman: Stars vs CLV | -0.476 |
| Brier Score | 0.2492 |
| Monotonicity Score | -0.57 |

### All Time (n=924)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 118 | 54.5% | 54.5% | 49.2% | -5.4% | -12.0% | -12.1% | 2.80 | 0.26% | Weak |
| 4.5 | 64 | 55.3% | 55.3% | 56.3% | +1.0% | 4.6% | 0.6% | 2.64 | 0.50% | Fair |
| 4 | 173 | 55.1% | 55.1% | 53.2% | -2.0% | -2.8% | -2.3% | 1.90 | -0.33% | Fair |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 205 | 54.8% | 54.8% | 48.8% | -6.0% | -10.7% | -10.6% | 1.16 | -0.42% | Weak |
| 2.5 | 158 | 53.8% | 53.8% | 51.9% | -1.9% | -4.3% | -7.4% | 0.72 | -0.66% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 1 | 47.4% | 47.4% | 0.0% | -47.4% | -100.0% | -100.0% | 0.50 | 3.10% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 49.2% | 56.3% | -7.1% | INVERTED |
| 4.5★ vs 4★ | 56.3% | 53.2% | +3.1% | Correct |
| 4★ vs 3.5★ | 53.2% | 56.5% | -3.3% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 48.8% | +7.7% | Correct |
| 3★ vs 2.5★ | 48.8% | 51.9% | -3.1% | INVERTED |
| 2.5★ vs 2★ | 51.9% | 0.0% | +51.9% | Correct |
| 2★ vs 1★ | 0.0% | 0.0% | 0.0% | Flat |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.619 |
| Spearman: Stars vs Flat ROI | 0.571 |
| Spearman: Stars vs CLV | -0.214 |
| Brier Score | 0.2360 |
| Monotonicity Score | 0.00 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.090 | -0.004 | Tune |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.126 | -0.094 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.088 | -0.064 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.124 | -0.050 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | 0.079 | 0.110 | Keep |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | 0.104 | 0.139 | Keep |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | -0.026 | 0.040 | Monitor |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.063 | 0.019 | Tune |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.023 | 0.079 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.021 | 0.011 | Monitor |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.064 | 0.094 | Keep |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.117 | 0.012 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.139 | 0.031 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.067 | 0.012 | Tune |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (14.10–44.30) | 59 | 49.2% | -8.1% | -9.2% | 0.13% |  |
| p20-40 (44.33–49.68) | 59 | 52.5% | -0.6% | -0.9% | -0.45% |  |
| p40-60 (49.70–54.51) | 59 | 50.8% | 3.8% | 4.7% | 0.57% |  |
| p60-80 (54.60–60.44) | 59 | 52.5% | 5.5% | -5.4% | 0.29% |  |
| p80-95 (60.53–65.33) | 59 | 50.8% | -8.2% | -3.6% | -0.08% |  |
| p95+ (65.37–83.30) | 59 | 44.1% | -14.6% | -21.1% | -0.31% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 111 | 45.9% | -14.4% | -8.2% | -0.05% |  |
| 0.90-1.05 | 120 | 45.0% | -14.0% | -20.2% | -0.02% |  |
| 1.05-1.20 | 85 | 63.5% | 27.6% | 25.5% | 0.23% |  |
| 1.20-1.35 | 24 | 50.0% | -6.4% | -26.5% | 0.26% |  |
| 1.35-1.50 | 9 | 44.4% | -10.6% | -49.9% | -0.34% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.63) | 52 | 48.1% | -10.5% | -7.4% | -0.01% |  |
| 20-40% (0.63–0.89) | 53 | 50.9% | -4.2% | 12.2% | -0.28% |  |
| 40-60% (0.90–1.18) | 53 | 54.7% | 11.9% | 1.9% | 0.32% |  |
| 60-80% (1.19–1.43) | 52 | 42.3% | -16.5% | -28.6% | 0.23% |  |
| 80-95% (1.45–2.02) | 53 | 45.3% | -12.1% | -7.9% | -0.05% |  |
| 95%+ (2.03–4.76) | 53 | 50.9% | -4.0% | -3.5% | 0.26% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 23 | 39.1% | -18.6% | -39.0% | 0.54% | Broad support |
| 0.25-0.40 | 87 | 50.6% | -0.3% | -3.9% | 0.26% | Healthy support |
| 0.40-0.60 | 101 | 45.5% | -10.3% | 1.5% | -0.08% | Concentrated |
| 0.60-0.80 | 58 | 55.2% | 2.2% | -1.4% | -0.00% | Very concentrated |
| 0.80-1.00 | 47 | 48.9% | -10.1% | -12.6% | -0.07% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 45 | 37.8% | -28.9% | -27.3% | -0.01% | 4.3 |
| Broad battle | 161 | 46.6% | -7.2% | -5.0% | 0.05% | 3.9 |
| One-wallet nuke | 93 | 54.8% | 1.6% | -1.1% | -0.19% | 3.7 |
| Thin support | 179 | 52.5% | -1.9% | -5.7% | -0.02% | 3.6 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=362)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 15 | 53.3% | -5.7% | 17.7% | 0.29% | 4.3 | 80.0% |
| SMALL_MOVE | 67 | 41.8% | -21.2% | -22.0% | -0.13% | 4.0 | 100.0% |
| CLEAR_MOVE | 101 | 58.4% | 8.3% | 12.1% | 0.19% | 4.1 | 100.0% |
| NEAR_START | 141 | 45.4% | -7.8% | -15.7% | 0.07% | 3.7 | 100.0% |

**All Time** (n=924)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 532 | 53.8% | -5.2% | -4.0% | -0.48% | 3.3 | 3.8% |
| SMALL_MOVE | 70 | 41.4% | -21.8% | -24.2% | -0.03% | 4.0 | 95.7% |
| CLEAR_MOVE | 127 | 57.5% | 6.7% | 9.9% | 0.07% | 4.0 | 100.0% |
| NEAR_START | 157 | 45.9% | -8.2% | -15.3% | 0.09% | 3.7 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 8 / 62.5% / 6.3% | 25 / 40.0% / -34.1% | 46 / 63.0% / 13.9% | 47 / 44.7% / -9.1% |
| 3.5-4★ | 5 / 40.0% / -24.7% | 31 / 45.2% / -10.7% | 32 / 50.0% / -9.2% | 42 / 57.1% / 19.3% |
| 2.5-3★ | 2 / 50.0% / -5.8% | 10 / 40.0% / -13.9% | 23 / 60.9% / 21.4% | 50 / 38.0% / -25.6% |
| 1.0-2★ | — | 1 / 0.0% / -100.0% | — | 2 / 0.0% / -100.0% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 359 | 50.1% | -3.7% | -5.3% | 3.9 | 0.02% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 409 | 50.4% | -3.9% | -5.1% | 3.9 | 0.01% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 610 | 100% |
| LOCKED (direct) | 75 | 12.3% |
| Promoted (SHADOW→LOCKED) | 322 | 52.8% |
| Rejected (stayed SHADOW) | 151 | 24.8% |
| Superseded (side flipped) | 57 | 9.3% |
| Muted | 267 | 43.8% |
| Cancelled | 20 | 3.3% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=362)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -29.24u | -4.9% | — |
| Flat 1.0u | -12.31u | -3.4% | -16.93u |
| Lock units only | -24.22u | — | -5.02u |
| Units change only on star change | -19.72u | — | -9.52u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 105 | 2.82 | -12.4% | -11.9% | -22.09u | Sizing hurts |
| 4.5 | 30 | 2.68 | 23.8% | 19.0% | +8.16u | Sizing helps |
| 4 | 58 | 1.46 | -2.0% | 1.8% | +2.65u | Sizing helps |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 45 | 0.99 | -2.5% | -9.4% | -3.08u | Sizing hurts |
| 2.5 | 51 | 0.70 | -12.0% | -29.0% | -4.27u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 1 | 0.50 | -100.0% | -100.0% | +0.50u | Neutral |

### All Time (n=924)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -74.12u | -5.0% | — |
| Flat 1.0u | -41.82u | -4.5% | -32.30u |
| Lock units only | -58.33u | — | -15.79u |
| Units change only on star change | -63.76u | — | -10.36u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 118 | 2.80 | -12.0% | -12.1% | -25.69u | Sizing hurts |
| 4.5 | 64 | 2.64 | 4.6% | 0.6% | -1.86u | Sizing hurts |
| 4 | 173 | 1.90 | -2.8% | -2.3% | -2.59u | Sizing hurts |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 205 | 1.16 | -10.7% | -10.6% | -3.22u | Sizing hurts |
| 2.5 | 158 | 0.72 | -4.3% | -7.4% | -1.56u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 1 | 0.50 | -100.0% | -100.0% | +0.50u | Neutral |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 362 | 53.0% | 50.3% | -2.7% | -3.4% | 0.03% | Below market |
| 4.5-5★ | 135 | 53.7% | 51.9% | -1.9% | -4.4% | 0.02% | Neutral |
| 3.5-4★ | 126 | 52.3% | 51.6% | -0.7% | 1.7% | 0.13% | Neutral |
| 2.5-3★ | 98 | 52.9% | 48.0% | -5.0% | -5.6% | -0.13% | Below market |
| CLEAR_MOVE only | 101 | 54.2% | 58.4% | +4.2% | 8.3% | 0.19% | Beating market |
| NO_MOVE only | 15 | 55.6% | 53.3% | -2.2% | -5.7% | 0.29% | Below market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=78)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 53.333 | 43.449 | 0.74 |  |
| Rank_norm | 63.770 | 68.524 | 0.23 |  |
| PnL_norm | 53.967 | 52.084 | 0.11 |  |
| WalletBase | 54.490 | 46.907 | 0.64 |  |
| SizeRatio | 1.655 | 1.681 | 0.02 |  |
| ConvictionMult | 0.990 | 1.006 | 0.10 |  |
| WalletCountFor | 3.275 | 2.795 | 0.26 |  |
| TopShare | 0.529 | 0.651 | 0.53 |  |
| ForSide | 180.845 | 143.026 | 0.35 |  |
| AgainstSide | 58.335 | 42.464 | 0.18 |  |
| NetEdge | 1.313 | 1.069 | 0.30 |  |
| WalletPlayScore | 1.712 | 0.764 | 0.43 |  |

### V8 Era (n=316)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 53.333 | 53.367 | 0.00 |  |
| Rank_norm | 63.770 | 65.836 | 0.10 |  |
| PnL_norm | 53.967 | 54.475 | 0.03 |  |
| WalletBase | 54.490 | 54.504 | 0.00 |  |
| SizeRatio | 1.655 | 1.624 | 0.02 |  |
| ConvictionMult | 0.990 | 0.989 | 0.00 |  |
| WalletCountFor | 3.275 | 3.275 | 0.00 |  |
| TopShare | 0.529 | 0.529 | 0.00 |  |
| ForSide | 180.845 | 180.845 | 0.00 |  |
| AgainstSide | 58.335 | 58.335 | 0.00 |  |
| NetEdge | 1.313 | 1.313 | 0.00 |  |
| WalletPlayScore | 1.712 | 1.712 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=362)

- **Sizing issue**: Model P/L (-29.24u) trails flat (-12.31u) by 16.93u

### 7-Day (n=92)

- **Sizing issue**: Model P/L (-20.90u) trails flat (-3.06u) by 17.84u

### All Time (n=924)

- **Sizing issue**: Model P/L (-74.12u) trails flat (-41.82u) by 32.30u
- **Environment issue**: 57.6% NO_MOVE (WR: 53.8%, ROI: -5.2%)


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
| V8 era picks | 362 |
| V8 flat ROI | -3.4% |
| V8 model ROI | -4.9% |
| V8 star monotonicity score | -0.57 |
| 4.5-5★ ROI | -4.4% |
| 2.5-3★ ROI | -5.6% |
| CLEAR_MOVE ROI | 8.3% |
| NO_MOVE ROI | -5.7% |
| Single-wallet play rate | 22.7% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: 0.18% | 4.5★: -0.54% | 4★: 0.36% | 3.5★: -0.07% | 3★: 0.15% | 2.5★: -0.35% | 2★: 0.67% | 1★: 3.10% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=362)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 280 | 77.3% | 48.9% | -4.3% | -10.2% | 0.06% |
| MUTED | 71 | 19.6% | 54.9% | 0.2% | 20.0% | -0.12% |
| CANCELLED | 11 | 3.0% | 54.5% | -2.8% | -10.4% | 0.16% |

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

### 7-Day (n=92)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 86 | 93.5% | 51.2% | -3.3% | -14.2% | 0.18% |
| MUTED | 6 | 6.5% | 50.0% | -3.5% | 76.8% | -0.62% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| ags_hard_mute | 6 | 50.0% |
| wps_flipped_diag | 3 | 33.3% |
| opp_side_stronger_diag | 1 | 0.0% |

### All Time (n=924)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 840 | 90.9% | 51.9% | -5.3% | -7.1% | -0.25% |
| MUTED | 71 | 7.7% | 54.9% | 0.2% | 20.0% | -0.12% |
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
