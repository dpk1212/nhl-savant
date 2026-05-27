# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-05-27 ET
**Completed Picks**: 983 | **V8 Era Picks**: 421 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (60.6%) beats 5★ (51.5%) |
| Model P/L vs flat P/L | ⚠️ | Model trails flat by 12.0u — sizing amplifying losses |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 59 | 54.2% | -0.97u | -1.7% | 3.98u | 3.1% | -0.23% | -0.71% |  |
| 7-Day | 124 | 54.0% | -0.29u | -0.2% | -7.92u | -3.3% | 0.08% | -0.60% |  |
| 14-Day | 181 | 52.5% | -2.65u | -1.5% | -16.25u | -4.3% | 0.06% | -0.64% |  |
| 30-Day | 306 | 52.3% | -5.39u | -1.8% | -12.66u | -2.2% | -0.10% | -0.48% |  |
| V8 Era | 421 | 50.8% | -13.28u | -3.2% | -25.26u | -3.5% | -0.01% | -0.45% |  |
| All Time | 983 | 52.4% | -42.79u | -4.4% | -70.14u | -4.4% | -0.24% | -0.13% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=421)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 132 | 54.2% | 54.2% | 51.5% | -2.7% | -7.3% | -5.7% | 2.85 | 0.05% | Weak |
| 4.5 | 33 | 52.9% | 52.9% | 60.6% | +7.7% | 17.0% | 10.8% | 2.71 | -0.62% | Strong |
| 4 | 69 | 53.6% | 53.6% | 47.8% | -5.7% | -9.6% | -4.3% | 1.50 | 0.33% | Weak |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 53 | 53.2% | 53.2% | 49.1% | -4.2% | -3.5% | -12.1% | 1.02 | 0.19% | Fair |
| 2.5 | 57 | 52.2% | 52.2% | 49.1% | -3.1% | -4.2% | -16.8% | 0.73 | -0.32% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 5 | 52.1% | 52.1% | 40.0% | -12.1% | -26.0% | 12.3% | 0.60 | 0.21% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 51.5% | 60.6% | -9.1% | INVERTED |
| 4.5★ vs 4★ | 60.6% | 47.8% | +12.8% | Correct |
| 4★ vs 3.5★ | 47.8% | 51.5% | -3.7% | INVERTED |
| 3.5★ vs 3★ | 51.5% | 49.1% | +2.4% | Correct |
| 3★ vs 2.5★ | 49.1% | 49.1% | 0.0% | Flat |
| 2.5★ vs 2★ | 49.1% | 0.0% | +49.1% | Correct |
| 2★ vs 1★ | 0.0% | 40.0% | -40.0% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.714 |
| Spearman: Stars vs Flat ROI | 0.524 |
| Spearman: Stars vs CLV | -0.429 |
| Brier Score | 0.2462 |
| Monotonicity Score | 0.00 |

### All Time (n=983)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 145 | 54.6% | 54.6% | 51.7% | -2.9% | -7.5% | -6.4% | 2.84 | 0.12% | Weak |
| 4.5 | 67 | 55.3% | 55.3% | 55.2% | -0.1% | 2.1% | -2.6% | 2.66 | 0.40% | Fair |
| 4 | 184 | 55.1% | 55.1% | 51.6% | -3.4% | -5.6% | -3.9% | 1.89 | -0.29% | Weak |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 213 | 54.7% | 54.7% | 48.8% | -5.9% | -10.6% | -11.1% | 1.16 | -0.38% | Weak |
| 2.5 | 164 | 53.7% | 53.7% | 53.0% | -0.6% | -1.9% | -4.2% | 0.73 | -0.64% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 5 | 52.1% | 52.1% | 40.0% | -12.1% | -26.0% | 12.3% | 0.60 | 0.21% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 51.7% | 55.2% | -3.5% | INVERTED |
| 4.5★ vs 4★ | 55.2% | 51.6% | +3.6% | Correct |
| 4★ vs 3.5★ | 51.6% | 56.5% | -4.9% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 48.8% | +7.7% | Correct |
| 3★ vs 2.5★ | 48.8% | 53.0% | -4.2% | INVERTED |
| 2.5★ vs 2★ | 53.0% | 0.0% | +53.0% | Correct |
| 2★ vs 1★ | 0.0% | 40.0% | -40.0% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.595 |
| Spearman: Stars vs Flat ROI | 0.595 |
| Spearman: Stars vs CLV | -0.048 |
| Brier Score | 0.2355 |
| Monotonicity Score | 0.14 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.151 | -0.045 | Tune |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.134 | -0.093 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.083 | -0.051 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.172 | -0.075 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | 0.019 | 0.068 | Monitor |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | 0.046 | 0.096 | Keep |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | -0.098 | -0.003 | Tune |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.117 | -0.017 | Tune |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.016 | 0.072 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.071 | -0.018 | Tune |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.037 | 0.067 | Keep |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.153 | 0.042 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.172 | 0.058 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.114 | -0.023 | Tune |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (12.30–40.62) | 68 | 52.9% | -2.5% | -10.7% | -0.23% |  |
| p20-40 (41.30–48.00) | 69 | 53.6% | 0.1% | 9.6% | 0.01% |  |
| p40-60 (48.05–52.29) | 69 | 49.3% | -8.8% | -7.4% | 0.22% |  |
| p60-80 (52.50–57.97) | 69 | 53.6% | 14.5% | 3.0% | 0.24% |  |
| p80-95 (58.03–64.92) | 69 | 52.2% | -4.1% | -2.9% | -0.03% |  |
| p95+ (65.00–83.30) | 69 | 42.0% | -19.5% | -22.8% | -0.27% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 136 | 48.5% | -9.8% | -2.1% | -0.02% |  |
| 0.90-1.05 | 142 | 43.7% | -17.3% | -22.8% | -0.06% |  |
| 1.05-1.20 | 92 | 64.1% | 27.1% | 25.9% | 0.14% |  |
| 1.20-1.35 | 26 | 53.8% | 1.2% | -16.2% | 0.34% |  |
| 1.35-1.50 | 10 | 40.0% | -19.5% | -54.5% | -0.38% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.54) | 60 | 50.0% | -6.7% | -2.1% | -0.28% |  |
| 20-40% (0.54–0.85) | 61 | 54.1% | 0.1% | 12.5% | 0.15% |  |
| 40-60% (0.85–1.10) | 61 | 50.8% | 4.1% | 1.7% | -0.21% |  |
| 60-80% (1.11–1.36) | 60 | 45.0% | -12.8% | -22.8% | 0.27% |  |
| 80-95% (1.38–1.97) | 61 | 49.2% | -6.2% | -3.8% | -0.06% |  |
| 95%+ (1.98–4.76) | 61 | 49.2% | -7.8% | -6.0% | 0.21% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 24 | 41.7% | -14.5% | -29.7% | 0.41% | Broad support |
| 0.25-0.40 | 89 | 50.6% | -0.4% | -4.1% | 0.23% | Healthy support |
| 0.40-0.60 | 120 | 45.8% | -11.2% | -0.6% | -0.18% | Concentrated |
| 0.60-0.80 | 72 | 55.6% | 2.8% | -0.5% | 0.08% | Very concentrated |
| 0.80-1.00 | 59 | 52.5% | -3.8% | -3.0% | -0.16% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 48 | 35.4% | -33.3% | -31.7% | -0.02% | 4.4 |
| Broad battle | 170 | 47.1% | -7.0% | -4.4% | -0.01% | 3.9 |
| One-wallet nuke | 116 | 55.2% | 1.8% | 1.5% | -0.16% | 3.5 |
| Thin support | 220 | 53.6% | -0.3% | -1.1% | 0.01% | 3.6 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=421)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 16 | 50.0% | -11.6% | 12.4% | 0.27% | 4.3 | 81.3% |
| SMALL_MOVE | 84 | 45.2% | -15.8% | -10.4% | -0.22% | 4.0 | 100.0% |
| CLEAR_MOVE | 113 | 57.5% | 6.6% | 10.0% | 0.14% | 4.1 | 100.0% |
| NEAR_START | 159 | 47.2% | -5.7% | -13.4% | 0.02% | 3.7 | 100.0% |

**All Time** (n=983)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 533 | 53.7% | -5.4% | -4.2% | -0.48% | 3.3 | 3.9% |
| SMALL_MOVE | 87 | 44.8% | -16.5% | -12.6% | -0.13% | 4.0 | 96.6% |
| CLEAR_MOVE | 139 | 56.8% | 5.4% | 8.5% | 0.04% | 4.1 | 100.0% |
| NEAR_START | 175 | 47.4% | -6.3% | -13.3% | 0.05% | 3.7 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 8 / 62.5% / 6.3% | 36 / 47.2% / -19.3% | 54 / 63.0% / 13.9% | 56 / 46.4% / -8.9% |
| 3.5-4★ | 6 / 33.3% / -37.2% | 34 / 44.1% / -14.1% | 35 / 45.7% / -17.0% | 44 / 59.1% / 22.9% |
| 2.5-3★ | 2 / 50.0% / -5.8% | 11 / 45.5% / -4.6% | 24 / 62.5% / 24.5% | 55 / 40.0% / -21.6% |
| 1.0-2★ | — | 3 / 33.3% / -34.9% | — | 4 / 25.0% / -56.3% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 418 | 50.7% | -3.4% | -3.8% | 3.9 | -0.01% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 468 | 50.9% | -3.6% | -3.9% | 3.9 | -0.02% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 698 | 100% |
| LOCKED (direct) | 77 | 11.0% |
| Promoted (SHADOW→LOCKED) | 390 | 55.9% |
| Rejected (stayed SHADOW) | 160 | 22.9% |
| Superseded (side flipped) | 66 | 9.5% |
| Muted | 285 | 40.8% |
| Cancelled | 20 | 2.9% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=421)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -25.26u | -3.5% | — |
| Flat 1.0u | -13.28u | -3.2% | -11.98u |
| Lock units only | -15.80u | — | -9.46u |
| Units change only on star change | -11.39u | — | -13.87u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 132 | 2.85 | -7.3% | -5.7% | -11.75u | Sizing hurts |
| 4.5 | 33 | 2.71 | 17.0% | 10.8% | +4.04u | Sizing helps |
| 4 | 69 | 1.50 | -9.6% | -4.3% | +2.17u | Sizing helps |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 53 | 1.02 | -3.5% | -12.1% | -4.67u | Sizing hurts |
| 2.5 | 57 | 0.73 | -4.2% | -16.8% | -4.65u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 5 | 0.60 | -26.0% | 12.3% | +1.67u | Sizing helps |

### All Time (n=983)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -70.14u | -4.4% | — |
| Flat 1.0u | -42.79u | -4.4% | -27.35u |
| Lock units only | -49.92u | — | -20.22u |
| Units change only on star change | -55.44u | — | -14.70u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 145 | 2.84 | -7.5% | -6.4% | -15.34u | Sizing hurts |
| 4.5 | 67 | 2.66 | 2.1% | -2.6% | -5.97u | Sizing hurts |
| 4 | 184 | 1.89 | -5.6% | -3.9% | -3.07u | Sizing hurts |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 213 | 1.16 | -10.6% | -11.1% | -4.82u | Sizing hurts |
| 2.5 | 164 | 0.73 | -1.9% | -4.2% | -1.94u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 5 | 0.60 | -26.0% | 12.3% | +1.67u | Sizing helps |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 421 | 53.1% | 50.8% | -2.3% | -3.2% | -0.01% | Below market |
| 4.5-5★ | 165 | 53.9% | 53.3% | -0.6% | -2.5% | -0.08% | Neutral |
| 3.5-4★ | 137 | 52.4% | 49.6% | -2.8% | -2.5% | 0.14% | Below market |
| 2.5-3★ | 112 | 52.7% | 50.0% | -2.7% | -2.2% | -0.09% | Below market |
| CLEAR_MOVE only | 113 | 54.1% | 57.5% | +3.4% | 6.6% | 0.14% | Beating market |
| NO_MOVE only | 16 | 55.1% | 50.0% | -5.1% | -11.6% | 0.27% | Below market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=101)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 50.675 | 36.357 | 0.95 |  |
| Rank_norm | 62.289 | 62.108 | 0.01 |  |
| PnL_norm | 53.494 | 52.653 | 0.05 |  |
| WalletBase | 52.548 | 42.686 | 0.78 |  |
| SizeRatio | 1.574 | 1.425 | 0.10 |  |
| ConvictionMult | 0.980 | 0.963 | 0.10 |  |
| WalletCountFor | 3.176 | 2.485 | 0.38 |  |
| TopShare | 0.548 | 0.692 | 0.62 |  |
| ForSide | 170.236 | 113.142 | 0.52 |  |
| AgainstSide | 54.426 | 30.670 | 0.28 |  |
| NetEdge | 1.240 | 0.871 | 0.45 |  |
| WalletPlayScore | 1.521 | 0.271 | 0.56 |  |

### V8 Era (n=364)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 50.675 | 50.389 | 0.02 |  |
| Rank_norm | 62.289 | 64.775 | 0.12 |  |
| PnL_norm | 53.494 | 54.118 | 0.04 |  |
| WalletBase | 52.548 | 52.454 | 0.01 |  |
| SizeRatio | 1.574 | 1.550 | 0.02 |  |
| ConvictionMult | 0.980 | 0.980 | 0.00 |  |
| WalletCountFor | 3.176 | 3.176 | 0.00 |  |
| TopShare | 0.548 | 0.548 | 0.00 |  |
| ForSide | 170.236 | 170.236 | 0.00 |  |
| AgainstSide | 54.426 | 54.426 | 0.00 |  |
| NetEdge | 1.240 | 1.240 | 0.00 |  |
| WalletPlayScore | 1.521 | 1.521 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=421)

- **Sizing issue**: Model P/L (-25.26u) trails flat (-13.28u) by 11.98u
- **Gate issue**: NO_MOVE ROI (-11.6%) significantly trails CLEAR_MOVE (6.6%)

### 7-Day (n=124)

- **Ranking issue**: ≤3★ WR (57%) beats ≥4★ (52%)
- **Sizing issue**: Model P/L (-7.92u) trails flat (-0.29u) by 7.63u

### All Time (n=983)

- **Sizing issue**: Model P/L (-70.14u) trails flat (-42.79u) by 27.35u
- **Environment issue**: 54.2% NO_MOVE (WR: 53.7%, ROI: -5.4%)


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
| V8 era picks | 421 |
| V8 flat ROI | -3.2% |
| V8 model ROI | -3.5% |
| V8 star monotonicity score | 0.00 |
| 4.5-5★ ROI | -2.5% |
| 2.5-3★ ROI | -2.2% |
| CLEAR_MOVE ROI | 6.6% |
| NO_MOVE ROI | -11.6% |
| Single-wallet play rate | 24.7% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: 0.05% | 4.5★: -0.62% | 4★: 0.33% | 3.5★: -0.07% | 3★: 0.19% | 2.5★: -0.32% | 2★: 0.67% | 1★: 0.21% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=421)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 337 | 80.0% | 49.9% | -3.9% | -7.2% | 0.01% |
| MUTED | 73 | 17.3% | 54.8% | 0.1% | 17.9% | -0.13% |
| CANCELLED | 11 | 2.6% | 54.5% | -2.8% | -10.4% | 0.16% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| v73_hc_rescue | 21 | 52.4% |
| wps_flipped_diag | 18 | 38.9% |
| ags_quality_veto | 18 | 66.7% |
| winners_below_floor | 14 | 42.9% |
| opp_side_stronger_diag | 13 | 46.2% |
| winners_faded | 12 | 66.7% |
| winners_killed | 9 | 55.6% |
| ags_hard_mute | 8 | 50.0% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 7 | 57.1% |
| whitelist_fade_weak | 3 | 66.7% |
| sum_below_floor | 3 | 33.3% |
| whitelist_fade_strong | 2 | 50.0% |
| dw1_no_ags_support | 1 | 100.0% |

### 7-Day (n=124)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 118 | 95.2% | 53.4% | -1.7% | -4.2% | 0.12% |
| MUTED | 6 | 4.8% | 66.7% | 29.1% | 25.1% | -0.84% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| ags_hard_mute | 6 | 66.7% |
| wps_flipped_diag | 4 | 50.0% |
| opp_side_stronger_diag | 3 | 33.3% |

### All Time (n=983)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 897 | 91.3% | 52.1% | -5.0% | -6.2% | -0.24% |
| MUTED | 73 | 7.4% | 54.8% | 0.1% | 17.9% | -0.13% |
| CANCELLED | 13 | 1.3% | 61.5% | 17.8% | 4.8% | -0.95% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| v73_hc_rescue | 21 | 52.4% |
| wps_flipped_diag | 18 | 38.9% |
| ags_quality_veto | 18 | 66.7% |
| winners_below_floor | 14 | 42.9% |
| opp_side_stronger_diag | 13 | 46.2% |
| winners_faded | 12 | 66.7% |
| winners_killed | 9 | 55.6% |
| ags_hard_mute | 8 | 50.0% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 7 | 57.1% |
| whitelist_fade_weak | 3 | 66.7% |
| sum_below_floor | 3 | 33.3% |
| opposition_building | 2 | 100.0% |
| mid_tier_or_lower | 2 | 100.0% |
| whitelist_fade_strong | 2 | 50.0% |
| dw1_no_ags_support | 1 | 100.0% |
