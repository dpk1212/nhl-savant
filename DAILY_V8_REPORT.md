# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-05-23 ET
**Completed Picks**: 901 | **V8 Era Picks**: 339 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (60.7%) beats 5★ (49.0%) |
| Model P/L vs flat P/L | ⚠️ | Model trails flat by 19.3u — sizing amplifying losses |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 42 | 47.6% | -4.66u | -11.1% | -19.60u | -25.5% | 0.56% | -0.53% |  |
| 7-Day | 75 | 48.0% | -6.47u | -8.6% | -27.19u | -17.9% | 0.27% | -0.53% |  |
| 14-Day | 135 | 50.4% | -6.74u | -5.0% | -30.29u | -10.6% | 0.22% | -0.54% |  |
| 30-Day | 276 | 50.0% | -13.96u | -5.1% | -31.13u | -6.3% | 0.02% | -0.38% |  |
| V8 Era | 339 | 49.3% | -17.65u | -5.2% | -36.94u | -6.5% | 0.03% | -0.43% |  |
| All Time | 901 | 51.9% | -47.17u | -5.2% | -81.82u | -5.7% | -0.25% | -0.11% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=339)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 100 | 53.9% | 53.9% | 49.0% | -4.9% | -11.4% | -11.2% | 2.82 | 0.23% | Weak |
| 4.5 | 28 | 51.9% | 51.9% | 60.7% | +8.8% | 20.9% | 14.5% | 2.73 | -0.62% | Strong |
| 4 | 55 | 53.8% | 53.8% | 49.1% | -4.7% | -8.2% | -6.8% | 1.47 | 0.38% | Weak |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 37 | 53.4% | 53.4% | 43.2% | -10.1% | -13.4% | -18.9% | 1.04 | 0.16% | Weak |
| 2.5 | 46 | 52.4% | 52.4% | 45.7% | -6.7% | -9.9% | -24.2% | 0.67 | -0.43% | Weak |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 1 | 47.4% | 47.4% | 0.0% | -47.4% | -100.0% | -100.0% | 0.50 | 3.10% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 49.0% | 60.7% | -11.7% | INVERTED |
| 4.5★ vs 4★ | 60.7% | 49.1% | +11.6% | Correct |
| 4★ vs 3.5★ | 49.1% | 51.5% | -2.4% | Flat |
| 3.5★ vs 3★ | 51.5% | 43.2% | +8.3% | Correct |
| 3★ vs 2.5★ | 43.2% | 45.7% | -2.5% | Flat |
| 2.5★ vs 2★ | 45.7% | 0.0% | +45.7% | Correct |
| 2★ vs 1★ | 0.0% | 0.0% | 0.0% | Flat |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.786 |
| Spearman: Stars vs Flat ROI | 0.667 |
| Spearman: Stars vs CLV | -0.476 |
| Brier Score | 0.2497 |
| Monotonicity Score | 0.00 |

### All Time (n=901)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 113 | 54.5% | 54.5% | 49.6% | -4.9% | -11.1% | -11.5% | 2.80 | 0.30% | Weak |
| 4.5 | 62 | 55.1% | 55.1% | 54.8% | -0.2% | 2.6% | -1.9% | 2.67 | 0.49% | Fair |
| 4 | 170 | 55.3% | 55.3% | 52.4% | -2.9% | -4.8% | -4.4% | 1.91 | -0.34% | Fair |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 197 | 54.8% | 54.8% | 47.7% | -7.1% | -13.0% | -12.2% | 1.17 | -0.45% | Weak |
| 2.5 | 153 | 53.8% | 53.8% | 52.3% | -1.5% | -3.5% | -5.0% | 0.71 | -0.69% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 1 | 47.4% | 47.4% | 0.0% | -47.4% | -100.0% | -100.0% | 0.50 | 3.10% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 49.6% | 54.8% | -5.2% | INVERTED |
| 4.5★ vs 4★ | 54.8% | 52.4% | +2.4% | Correct |
| 4★ vs 3.5★ | 52.4% | 56.5% | -4.1% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 47.7% | +8.8% | Correct |
| 3★ vs 2.5★ | 47.7% | 52.3% | -4.6% | INVERTED |
| 2.5★ vs 2★ | 52.3% | 0.0% | +52.3% | Correct |
| 2★ vs 1★ | 0.0% | 0.0% | 0.0% | Flat |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.619 |
| Spearman: Stars vs Flat ROI | 0.595 |
| Spearman: Stars vs CLV | -0.214 |
| Brier Score | 0.2358 |
| Monotonicity Score | 0.00 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.062 | 0.008 | Tune |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.105 | -0.093 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.095 | -0.075 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.109 | -0.048 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | 0.116 | 0.125 | Keep |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | 0.145 | 0.155 | Keep |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | 0.008 | 0.049 | Monitor |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.026 | 0.040 | Monitor |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.032 | 0.088 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | 0.010 | 0.023 | Monitor |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.091 | 0.117 | Keep |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.085 | -0.011 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.112 | 0.011 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.032 | 0.033 | Monitor |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (14.10–44.93) | 55 | 45.5% | -14.7% | -14.7% | 0.31% |  |
| p20-40 (45.17–50.40) | 55 | 52.7% | 0.4% | 5.0% | -0.66% |  |
| p40-60 (50.50–54.90) | 55 | 52.7% | 7.7% | 5.8% | 0.56% |  |
| p60-80 (54.96–60.94) | 55 | 47.3% | -4.8% | -16.8% | 0.34% |  |
| p80-95 (61.05–65.37) | 55 | 52.7% | -4.5% | 1.0% | -0.23% |  |
| p95+ (65.40–83.30) | 56 | 42.9% | -17.5% | -22.8% | -0.18% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 101 | 42.6% | -19.9% | -11.2% | -0.02% |  |
| 0.90-1.05 | 116 | 44.0% | -15.5% | -22.0% | -0.04% |  |
| 1.05-1.20 | 78 | 65.4% | 30.3% | 26.5% | 0.23% |  |
| 1.20-1.35 | 23 | 47.8% | -11.8% | -34.0% | 0.20% |  |
| 1.35-1.50 | 9 | 44.4% | -10.6% | -49.9% | -0.34% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.67) | 49 | 42.9% | -19.8% | -11.0% | 0.06% |  |
| 20-40% (0.67–0.93) | 50 | 48.0% | -9.1% | 4.8% | -0.28% |  |
| 40-60% (0.93–1.21) | 49 | 57.1% | 16.9% | -2.9% | 0.33% |  |
| 60-80% (1.21–1.46) | 50 | 42.0% | -17.1% | -22.2% | 0.16% |  |
| 80-95% (1.47–2.04) | 49 | 46.9% | -10.6% | -7.9% | -0.14% |  |
| 95%+ (2.05–4.76) | 50 | 50.0% | -5.4% | -5.7% | 0.31% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 23 | 39.1% | -18.6% | -39.0% | 0.54% | Broad support |
| 0.25-0.40 | 84 | 50.0% | -1.7% | -4.9% | 0.24% | Healthy support |
| 0.40-0.60 | 100 | 46.0% | -9.5% | 1.8% | -0.10% | Concentrated |
| 0.60-0.80 | 51 | 52.9% | -2.2% | -5.0% | -0.05% | Very concentrated |
| 0.80-1.00 | 39 | 46.2% | -15.7% | -17.5% | 0.04% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 44 | 38.6% | -27.3% | -25.1% | -0.05% | 4.3 |
| Broad battle | 157 | 45.9% | -8.0% | -6.2% | 0.07% | 3.9 |
| One-wallet nuke | 81 | 53.1% | -1.7% | -5.5% | -0.12% | 3.6 |
| Thin support | 159 | 50.9% | -4.8% | -9.5% | 0.01% | 3.6 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=339)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 14 | 50.0% | -12.7% | 13.9% | 0.40% | 4.3 | 78.6% |
| SMALL_MOVE | 60 | 40.0% | -23.6% | -26.8% | -0.05% | 4.0 | 100.0% |
| CLEAR_MOVE | 97 | 58.8% | 7.7% | 12.0% | 0.11% | 4.1 | 100.0% |
| NEAR_START | 134 | 44.0% | -9.8% | -16.4% | 0.06% | 3.7 | 100.0% |

**All Time** (n=901)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 531 | 53.7% | -5.4% | -4.1% | -0.48% | 3.3 | 3.6% |
| SMALL_MOVE | 63 | 39.7% | -24.2% | -28.9% | 0.06% | 4.0 | 95.2% |
| CLEAR_MOVE | 123 | 57.7% | 6.2% | 9.8% | -0.00% | 4.0 | 100.0% |
| NEAR_START | 150 | 44.7% | -10.0% | -15.9% | 0.10% | 3.7 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 8 / 62.5% / 6.3% | 21 / 38.1% / -35.6% | 45 / 64.4% / 16.4% | 46 / 43.5% / -11.0% |
| 3.5-4★ | 4 / 25.0% / -54.0% | 30 / 43.3% / -15.2% | 31 / 48.4% / -13.3% | 42 / 57.1% / 19.3% |
| 2.5-3★ | 2 / 50.0% / -5.8% | 8 / 37.5% / -14.1% | 21 / 61.9% / 20.3% | 44 / 34.1% / -32.2% |
| 1.0-2★ | — | 1 / 0.0% / -100.0% | — | 2 / 0.0% / -100.0% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 336 | 49.1% | -5.5% | -6.9% | 3.9 | 0.02% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 386 | 49.5% | -5.5% | -6.6% | 3.9 | 0.01% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 569 | 100% |
| LOCKED (direct) | 70 | 12.3% |
| Promoted (SHADOW→LOCKED) | 296 | 52.0% |
| Rejected (stayed SHADOW) | 147 | 25.8% |
| Superseded (side flipped) | 51 | 9.0% |
| Muted | 253 | 44.5% |
| Cancelled | 20 | 3.5% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=339)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -36.94u | -6.5% | — |
| Flat 1.0u | -17.65u | -5.2% | -19.29u |
| Lock units only | -33.65u | — | -3.29u |
| Units change only on star change | -28.62u | — | -8.32u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 100 | 2.82 | -11.4% | -11.2% | -20.12u | Sizing hurts |
| 4.5 | 28 | 2.73 | 20.9% | 14.5% | +5.29u | Sizing helps |
| 4 | 55 | 1.47 | -8.2% | -6.8% | -1.01u | Sizing hurts |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 37 | 1.04 | -13.4% | -18.9% | -2.29u | Sizing hurts |
| 2.5 | 46 | 0.67 | -9.9% | -24.2% | -2.86u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 1 | 0.50 | -100.0% | -100.0% | +0.50u | Neutral |

### All Time (n=901)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -81.82u | -5.7% | — |
| Flat 1.0u | -47.17u | -5.2% | -34.65u |
| Lock units only | -67.76u | — | -14.06u |
| Units change only on star change | -72.67u | — | -9.15u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 113 | 2.80 | -11.1% | -11.5% | -23.71u | Sizing hurts |
| 4.5 | 62 | 2.67 | 2.6% | -1.9% | -4.73u | Sizing hurts |
| 4 | 170 | 1.91 | -4.8% | -4.4% | -6.25u | Sizing hurts |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 197 | 1.17 | -13.0% | -12.2% | -2.43u | Sizing hurts |
| 2.5 | 153 | 0.71 | -3.5% | -5.0% | -0.15u | Neutral |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 1 | 0.50 | -100.0% | -100.0% | +0.50u | Neutral |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 339 | 52.9% | 49.3% | -3.6% | -5.2% | 0.03% | Below market |
| 4.5-5★ | 128 | 53.5% | 51.6% | -1.9% | -4.4% | 0.05% | Neutral |
| 3.5-4★ | 123 | 52.4% | 50.4% | -2.0% | -1.0% | 0.13% | Neutral |
| 2.5-3★ | 85 | 52.8% | 45.9% | -6.9% | -9.2% | -0.17% | Below market |
| CLEAR_MOVE only | 97 | 54.5% | 58.8% | +4.2% | 7.7% | 0.11% | Beating market |
| NO_MOVE only | 14 | 55.8% | 50.0% | -5.8% | -12.7% | 0.40% | Below market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=62)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 54.707 | 48.322 | 0.54 |  |
| Rank_norm | 64.302 | 71.914 | 0.37 |  |
| PnL_norm | 53.915 | 51.406 | 0.14 |  |
| WalletBase | 55.377 | 49.696 | 0.52 |  |
| SizeRatio | 1.681 | 1.755 | 0.05 |  |
| ConvictionMult | 0.993 | 1.019 | 0.16 |  |
| WalletCountFor | 3.343 | 2.968 | 0.20 |  |
| TopShare | 0.516 | 0.615 | 0.45 |  |
| ForSide | 186.389 | 157.863 | 0.26 |  |
| AgainstSide | 61.144 | 49.768 | 0.13 |  |
| NetEdge | 1.344 | 1.156 | 0.23 |  |
| WalletPlayScore | 1.825 | 1.054 | 0.36 |  |

### V8 Era (n=297)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 54.707 | 54.873 | 0.01 |  |
| Rank_norm | 64.302 | 66.448 | 0.11 |  |
| PnL_norm | 53.915 | 54.564 | 0.04 |  |
| WalletBase | 55.377 | 55.514 | 0.01 |  |
| SizeRatio | 1.681 | 1.640 | 0.03 |  |
| ConvictionMult | 0.993 | 0.991 | 0.01 |  |
| WalletCountFor | 3.343 | 3.343 | 0.00 |  |
| TopShare | 0.516 | 0.516 | 0.00 |  |
| ForSide | 186.389 | 186.389 | 0.00 |  |
| AgainstSide | 61.144 | 61.144 | 0.00 |  |
| NetEdge | 1.344 | 1.344 | 0.00 |  |
| WalletPlayScore | 1.825 | 1.825 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=339)

- **Sizing issue**: Model P/L (-36.94u) trails flat (-17.65u) by 19.29u
- **Gate issue**: NO_MOVE ROI (-12.7%) significantly trails CLEAR_MOVE (7.7%)

### 7-Day (n=75)

- **Ranking issue**: ≤3★ WR (52%) beats ≥4★ (46%)
- **Sizing issue**: Model P/L (-27.19u) trails flat (-6.47u) by 20.72u
- **Concentration issue**: 28 high-concentration picks (TopShare>0.6) at -15.0% ROI

### All Time (n=901)

- **Sizing issue**: Model P/L (-81.82u) trails flat (-47.17u) by 34.65u
- **Environment issue**: 58.9% NO_MOVE (WR: 53.7%, ROI: -5.4%)


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
| V8 era picks | 339 |
| V8 flat ROI | -5.2% |
| V8 model ROI | -6.5% |
| V8 star monotonicity score | 0.00 |
| 4.5-5★ ROI | -4.4% |
| 2.5-3★ ROI | -9.2% |
| CLEAR_MOVE ROI | 7.7% |
| NO_MOVE ROI | -12.7% |
| Single-wallet play rate | 21.2% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: 0.23% | 4.5★: -0.62% | 4★: 0.38% | 3.5★: -0.07% | 3★: 0.16% | 2.5★: -0.43% | 2★: 0.67% | 1★: 3.10% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=339)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 259 | 76.4% | 47.9% | -5.9% | -11.7% | 0.06% |
| MUTED | 69 | 20.4% | 53.6% | -3.0% | 16.3% | -0.10% |
| CANCELLED | 11 | 3.2% | 54.5% | -2.8% | -10.4% | 0.16% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| v73_hc_rescue | 21 | 52.4% |
| ags_quality_veto | 18 | 66.7% |
| wps_flipped_diag | 15 | 33.3% |
| winners_below_floor | 14 | 42.9% |
| winners_faded | 12 | 66.7% |
| opp_side_stronger_diag | 10 | 50.0% |
| winners_killed | 9 | 55.6% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 7 | 57.1% |
| ags_hard_mute | 4 | 25.0% |
| whitelist_fade_weak | 3 | 66.7% |
| sum_below_floor | 3 | 33.3% |
| whitelist_fade_strong | 2 | 50.0% |
| dw1_no_ags_support | 1 | 100.0% |

### 7-Day (n=75)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 71 | 94.7% | 49.3% | -5.8% | -17.4% | 0.31% |
| MUTED | 4 | 5.3% | 25.0% | -59.4% | -51.2% | -0.49% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| ags_hard_mute | 4 | 25.0% |
| wps_flipped_diag | 1 | 0.0% |

### All Time (n=901)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 819 | 90.9% | 51.6% | -5.8% | -7.6% | -0.25% |
| MUTED | 69 | 7.7% | 53.6% | -3.0% | 16.3% | -0.10% |
| CANCELLED | 13 | 1.4% | 61.5% | 17.8% | 4.8% | -0.95% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| v73_hc_rescue | 21 | 52.4% |
| ags_quality_veto | 18 | 66.7% |
| wps_flipped_diag | 15 | 33.3% |
| winners_below_floor | 14 | 42.9% |
| winners_faded | 12 | 66.7% |
| opp_side_stronger_diag | 10 | 50.0% |
| winners_killed | 9 | 55.6% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 7 | 57.1% |
| ags_hard_mute | 4 | 25.0% |
| whitelist_fade_weak | 3 | 66.7% |
| sum_below_floor | 3 | 33.3% |
| opposition_building | 2 | 100.0% |
| mid_tier_or_lower | 2 | 100.0% |
| whitelist_fade_strong | 2 | 50.0% |
| dw1_no_ags_support | 1 | 100.0% |
