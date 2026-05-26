# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-05-26 ET
**Completed Picks**: 963 | **V8 Era Picks**: 401 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (60.6%) beats 5★ (49.2%) |
| Model P/L vs flat P/L | ⚠️ | Model trails flat by 22.0u — sizing amplifying losses |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 62 | 54.8% | 0.53u | 0.9% | -2.20u | -1.9% | -0.08% | -0.61% |  |
| 7-Day | 112 | 50.9% | -6.88u | -6.1% | -28.00u | -13.1% | 0.08% | -0.53% |  |
| 14-Day | 172 | 50.6% | -9.29u | -5.4% | -41.37u | -11.6% | 0.18% | -0.59% |  |
| 30-Day | 305 | 51.5% | -9.80u | -3.2% | -29.01u | -5.2% | -0.08% | -0.39% |  |
| V8 Era | 401 | 50.1% | -17.12u | -4.3% | -39.14u | -5.7% | 0.01% | -0.44% |  |
| All Time | 963 | 52.1% | -46.63u | -4.8% | -84.02u | -5.4% | -0.24% | -0.12% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=401)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 120 | 54.3% | 54.3% | 49.2% | -5.1% | -11.6% | -10.6% | 2.85 | 0.11% | Weak |
| 4.5 | 33 | 52.9% | 52.9% | 60.6% | +7.7% | 17.0% | 10.8% | 2.71 | -0.62% | Strong |
| 4 | 68 | 53.6% | 53.6% | 48.5% | -5.1% | -8.3% | -2.7% | 1.53 | 0.34% | Weak |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 52 | 53.3% | 53.3% | 50.0% | -3.3% | -1.6% | -7.3% | 0.99 | 0.17% | Fair |
| 2.5 | 55 | 52.2% | 52.2% | 47.3% | -5.0% | -7.8% | -24.1% | 0.72 | -0.30% | Weak |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 1 | 47.4% | 47.4% | 0.0% | -47.4% | -100.0% | -100.0% | 0.50 | 3.10% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 49.2% | 60.6% | -11.4% | INVERTED |
| 4.5★ vs 4★ | 60.6% | 48.5% | +12.1% | Correct |
| 4★ vs 3.5★ | 48.5% | 51.5% | -3.0% | INVERTED |
| 3.5★ vs 3★ | 51.5% | 50.0% | +1.5% | Correct |
| 3★ vs 2.5★ | 50.0% | 47.3% | +2.7% | Correct |
| 2.5★ vs 2★ | 47.3% | 0.0% | +47.3% | Correct |
| 2★ vs 1★ | 0.0% | 0.0% | 0.0% | Flat |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.714 |
| Spearman: Stars vs Flat ROI | 0.476 |
| Spearman: Stars vs CLV | -0.571 |
| Brier Score | 0.2477 |
| Monotonicity Score | -0.29 |

### All Time (n=963)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 133 | 54.7% | 54.7% | 49.6% | -5.1% | -11.3% | -10.9% | 2.83 | 0.18% | Weak |
| 4.5 | 67 | 55.3% | 55.3% | 55.2% | -0.1% | 2.1% | -2.6% | 2.66 | 0.40% | Fair |
| 4 | 183 | 55.1% | 55.1% | 51.9% | -3.2% | -5.1% | -3.4% | 1.90 | -0.29% | Weak |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 212 | 54.7% | 54.7% | 49.1% | -5.7% | -10.2% | -10.1% | 1.15 | -0.39% | Weak |
| 2.5 | 162 | 53.7% | 53.7% | 52.5% | -1.2% | -3.1% | -6.4% | 0.73 | -0.63% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 1 | 47.4% | 47.4% | 0.0% | -47.4% | -100.0% | -100.0% | 0.50 | 3.10% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 49.6% | 55.2% | -5.6% | INVERTED |
| 4.5★ vs 4★ | 55.2% | 51.9% | +3.3% | Correct |
| 4★ vs 3.5★ | 51.9% | 56.5% | -4.6% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 49.1% | +7.4% | Correct |
| 3★ vs 2.5★ | 49.1% | 52.5% | -3.4% | INVERTED |
| 2.5★ vs 2★ | 52.5% | 0.0% | +52.5% | Correct |
| 2★ vs 1★ | 0.0% | 0.0% | 0.0% | Flat |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.548 |
| Spearman: Stars vs Flat ROI | 0.500 |
| Spearman: Stars vs CLV | -0.214 |
| Brier Score | 0.2359 |
| Monotonicity Score | 0.00 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.121 | -0.023 | Tune |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.128 | -0.086 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.084 | -0.053 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.149 | -0.058 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | 0.036 | 0.081 | Keep |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | 0.066 | 0.110 | Keep |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | -0.072 | 0.016 | Tune |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.097 | 0.002 | Tune |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.018 | 0.075 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.054 | -0.003 | Tune |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.041 | 0.076 | Keep |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.143 | 0.030 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.164 | 0.047 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.101 | -0.009 | Tune |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (12.30–43.35) | 65 | 52.3% | -2.4% | -10.2% | -0.04% |  |
| p20-40 (43.50–48.94) | 66 | 53.0% | -2.7% | -1.1% | -0.11% |  |
| p40-60 (48.98–52.70) | 65 | 44.6% | -16.1% | -8.5% | 0.26% |  |
| p60-80 (52.90–59.00) | 66 | 56.1% | 19.3% | 6.3% | 0.33% |  |
| p80-95 (59.08–65.05) | 65 | 50.8% | -7.5% | -5.7% | -0.08% |  |
| p95+ (65.05–83.30) | 66 | 42.4% | -18.1% | -23.2% | -0.29% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 125 | 47.2% | -12.1% | -7.8% | 0.00% |  |
| 0.90-1.05 | 137 | 43.8% | -16.9% | -21.3% | -0.07% |  |
| 1.05-1.20 | 89 | 62.9% | 25.2% | 23.0% | 0.21% |  |
| 1.20-1.35 | 26 | 53.8% | 1.2% | -16.2% | 0.34% |  |
| 1.35-1.50 | 10 | 40.0% | -19.5% | -54.5% | -0.38% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.58) | 57 | 52.6% | -2.5% | 4.3% | -0.24% |  |
| 20-40% (0.59–0.86) | 57 | 45.6% | -14.9% | -2.3% | 0.19% |  |
| 40-60% (0.86–1.13) | 58 | 55.2% | 12.8% | -3.6% | 0.06% |  |
| 60-80% (1.14–1.40) | 57 | 40.4% | -21.1% | -28.3% | -0.02% |  |
| 80-95% (1.41–1.98) | 57 | 50.9% | -2.7% | -0.6% | 0.01% |  |
| 95%+ (1.98–4.76) | 58 | 48.3% | -9.2% | -7.5% | 0.25% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 24 | 41.7% | -14.5% | -29.7% | 0.41% | Broad support |
| 0.25-0.40 | 88 | 50.0% | -1.5% | -4.1% | 0.23% | Healthy support |
| 0.40-0.60 | 113 | 44.2% | -13.5% | -4.8% | -0.13% | Concentrated |
| 0.60-0.80 | 68 | 54.4% | 0.6% | -5.3% | 0.08% | Very concentrated |
| 0.80-1.00 | 51 | 52.9% | -3.6% | -4.3% | -0.12% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 48 | 35.4% | -33.3% | -31.7% | -0.02% | 4.4 |
| Broad battle | 167 | 46.1% | -8.6% | -5.6% | 0.02% | 3.9 |
| One-wallet nuke | 108 | 55.6% | 2.3% | 1.2% | -0.15% | 3.6 |
| Thin support | 205 | 53.2% | -1.1% | -4.2% | 0.03% | 3.6 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=401)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 15 | 53.3% | -5.7% | 17.7% | 0.29% | 4.3 | 80.0% |
| SMALL_MOVE | 76 | 42.1% | -21.3% | -19.1% | -0.19% | 4.0 | 100.0% |
| CLEAR_MOVE | 109 | 56.0% | 3.8% | 6.0% | 0.20% | 4.1 | 100.0% |
| NEAR_START | 152 | 47.4% | -5.1% | -12.4% | 0.02% | 3.8 | 100.0% |

**All Time** (n=963)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 532 | 53.8% | -5.2% | -4.0% | -0.48% | 3.3 | 3.8% |
| SMALL_MOVE | 79 | 41.8% | -21.8% | -21.1% | -0.10% | 4.1 | 96.2% |
| CLEAR_MOVE | 135 | 55.6% | 3.1% | 5.1% | 0.08% | 4.0 | 100.0% |
| NEAR_START | 168 | 47.6% | -5.7% | -12.3% | 0.05% | 3.7 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 8 / 62.5% / 6.3% | 30 / 40.0% / -32.9% | 50 / 60.0% / 8.4% | 54 / 48.1% / -5.6% |
| 3.5-4★ | 5 / 40.0% / -24.7% | 34 / 44.1% / -14.1% | 35 / 45.7% / -17.0% | 44 / 59.1% / 22.9% |
| 2.5-3★ | 2 / 50.0% / -5.8% | 11 / 45.5% / -4.6% | 24 / 62.5% / 24.5% | 52 / 38.5% / -24.6% |
| 1.0-2★ | — | 1 / 0.0% / -100.0% | — | 2 / 0.0% / -100.0% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 398 | 50.0% | -4.5% | -6.1% | 3.9 | 0.01% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 448 | 50.2% | -4.7% | -5.9% | 3.9 | -0.00% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 669 | 100% |
| LOCKED (direct) | 75 | 11.2% |
| Promoted (SHADOW→LOCKED) | 369 | 55.2% |
| Rejected (stayed SHADOW) | 155 | 23.2% |
| Superseded (side flipped) | 65 | 9.7% |
| Muted | 278 | 41.6% |
| Cancelled | 20 | 3.0% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=401)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -39.14u | -5.7% | — |
| Flat 1.0u | -17.12u | -4.3% | -22.02u |
| Lock units only | -32.88u | — | -6.26u |
| Units change only on star change | -28.47u | — | -10.67u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 120 | 2.85 | -11.6% | -10.6% | -22.44u | Sizing hurts |
| 4.5 | 33 | 2.71 | 17.0% | 10.8% | +4.04u | Sizing helps |
| 4 | 68 | 1.53 | -8.3% | -2.7% | +2.82u | Sizing helps |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 52 | 0.99 | -1.6% | -7.3% | -2.92u | Sizing hurts |
| 2.5 | 55 | 0.72 | -7.8% | -24.1% | -5.22u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 1 | 0.50 | -100.0% | -100.0% | +0.50u | Neutral |

### All Time (n=963)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -84.02u | -5.4% | — |
| Flat 1.0u | -46.63u | -4.8% | -37.39u |
| Lock units only | -67.00u | — | -17.02u |
| Units change only on star change | -72.52u | — | -11.50u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 133 | 2.83 | -11.3% | -10.9% | -26.04u | Sizing hurts |
| 4.5 | 67 | 2.66 | 2.1% | -2.6% | -5.97u | Sizing hurts |
| 4 | 183 | 1.90 | -5.1% | -3.4% | -2.42u | Sizing hurts |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 212 | 1.15 | -10.2% | -10.1% | -3.07u | Sizing hurts |
| 2.5 | 162 | 0.73 | -3.1% | -6.4% | -2.51u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 1 | 0.50 | -100.0% | -100.0% | +0.50u | Neutral |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 401 | 53.1% | 50.1% | -3.0% | -4.3% | 0.01% | Below market |
| 4.5-5★ | 153 | 54.0% | 51.6% | -2.3% | -5.5% | -0.05% | Below market |
| 3.5-4★ | 136 | 52.4% | 50.0% | -2.4% | -1.8% | 0.14% | Below market |
| 2.5-3★ | 109 | 52.8% | 49.5% | -3.2% | -3.1% | -0.08% | Below market |
| CLEAR_MOVE only | 109 | 54.1% | 56.0% | +1.9% | 3.8% | 0.20% | Neutral |
| NO_MOVE only | 15 | 55.6% | 53.3% | -2.2% | -5.7% | 0.29% | Below market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=88)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 51.624 | 38.796 | 0.88 |  |
| Rank_norm | 62.518 | 64.226 | 0.08 |  |
| PnL_norm | 53.470 | 51.469 | 0.11 |  |
| WalletBase | 53.160 | 43.775 | 0.75 |  |
| SizeRatio | 1.611 | 1.597 | 0.01 |  |
| ConvictionMult | 0.985 | 0.990 | 0.03 |  |
| WalletCountFor | 3.235 | 2.705 | 0.29 |  |
| TopShare | 0.537 | 0.663 | 0.55 |  |
| ForSide | 174.991 | 129.056 | 0.42 |  |
| AgainstSide | 56.107 | 36.066 | 0.23 |  |
| NetEdge | 1.273 | 0.984 | 0.35 |  |
| WalletPlayScore | 1.624 | 0.588 | 0.47 |  |

### V8 Era (n=344)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 51.624 | 51.457 | 0.01 |  |
| Rank_norm | 62.518 | 65.186 | 0.13 |  |
| PnL_norm | 53.470 | 54.127 | 0.04 |  |
| WalletBase | 53.160 | 53.148 | 0.00 |  |
| SizeRatio | 1.611 | 1.591 | 0.01 |  |
| ConvictionMult | 0.985 | 0.986 | 0.01 |  |
| WalletCountFor | 3.235 | 3.235 | 0.00 |  |
| TopShare | 0.537 | 0.537 | 0.00 |  |
| ForSide | 174.991 | 174.991 | 0.00 |  |
| AgainstSide | 56.107 | 56.107 | 0.00 |  |
| NetEdge | 1.273 | 1.273 | 0.00 |  |
| WalletPlayScore | 1.624 | 1.624 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=401)

- **Sizing issue**: Model P/L (-39.14u) trails flat (-17.12u) by 22.02u

### 7-Day (n=112)

- **Ranking issue**: ≤3★ WR (56%) beats ≥4★ (48%)
- **Sizing issue**: Model P/L (-28.00u) trails flat (-6.88u) by 21.12u

### All Time (n=963)

- **Sizing issue**: Model P/L (-84.02u) trails flat (-46.63u) by 37.39u
- **Environment issue**: 55.2% NO_MOVE (WR: 53.8%, ROI: -5.2%)


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
| V8 era picks | 401 |
| V8 flat ROI | -4.3% |
| V8 model ROI | -5.7% |
| V8 star monotonicity score | -0.29 |
| 4.5-5★ ROI | -5.5% |
| 2.5-3★ ROI | -3.1% |
| CLEAR_MOVE ROI | 3.8% |
| NO_MOVE ROI | -5.7% |
| Single-wallet play rate | 24.2% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: 0.11% | 4.5★: -0.62% | 4★: 0.34% | 3.5★: -0.07% | 3★: 0.17% | 2.5★: -0.30% | 2★: 0.67% | 1★: 3.10% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=401)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 319 | 79.6% | 48.9% | -5.3% | -10.4% | 0.04% |
| MUTED | 71 | 17.7% | 54.9% | 0.2% | 20.0% | -0.12% |
| CANCELLED | 11 | 2.7% | 54.5% | -2.8% | -10.4% | 0.16% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| v73_hc_rescue | 21 | 52.4% |
| wps_flipped_diag | 18 | 38.9% |
| ags_quality_veto | 18 | 66.7% |
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

### 7-Day (n=112)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 107 | 95.5% | 50.5% | -7.2% | -14.8% | 0.10% |
| MUTED | 5 | 4.5% | 60.0% | 15.8% | 76.8% | -0.28% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| ags_hard_mute | 5 | 60.0% |
| wps_flipped_diag | 4 | 50.0% |
| opp_side_stronger_diag | 1 | 0.0% |

### All Time (n=963)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 879 | 91.3% | 51.8% | -5.6% | -7.4% | -0.24% |
| MUTED | 71 | 7.4% | 54.9% | 0.2% | 20.0% | -0.12% |
| CANCELLED | 13 | 1.3% | 61.5% | 17.8% | 4.8% | -0.95% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| v73_hc_rescue | 21 | 52.4% |
| wps_flipped_diag | 18 | 38.9% |
| ags_quality_veto | 18 | 66.7% |
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
