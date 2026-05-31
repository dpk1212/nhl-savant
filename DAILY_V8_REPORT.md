# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-05-31 ET
**Completed Picks**: 1054 | **V8 Era Picks**: 492 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (66.7%) beats 5★ (47.9%) |
| Model P/L vs flat P/L | ⚠️ | Model trails flat by 14.2u — sizing amplifying losses |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 52 | 50.0% | -2.65u | -5.1% | -0.44u | -0.4% | -0.53% | -0.73% |  |
| 7-Day | 130 | 51.5% | -6.86u | -5.3% | -4.16u | -1.6% | -0.31% | -0.78% |  |
| 14-Day | 222 | 51.4% | -9.93u | -4.5% | -25.06u | -5.8% | -0.13% | -0.68% |  |
| 30-Day | 332 | 51.8% | -10.74u | -3.2% | -27.76u | -4.3% | -0.14% | -0.62% |  |
| V8 Era | 492 | 50.6% | -19.17u | -3.9% | -33.40u | -3.9% | -0.06% | -0.52% |  |
| All Time | 1054 | 52.2% | -48.68u | -4.6% | -78.28u | -4.5% | -0.26% | -0.17% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=492)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 167 | 53.8% | 53.8% | 47.9% | -5.9% | -13.6% | -10.2% | 2.72 | 0.02% | Weak |
| 4.5 | 45 | 53.7% | 53.7% | 66.7% | +12.9% | 25.9% | 17.7% | 2.48 | -0.38% | Strong |
| 4 | 87 | 53.2% | 53.2% | 51.7% | -1.4% | -1.8% | 4.2% | 1.51 | -0.03% | Fair |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 57 | 53.4% | 53.4% | 47.4% | -6.0% | -6.9% | -13.6% | 1.00 | 0.18% | Weak |
| 2.5 | 58 | 52.2% | 52.2% | 48.3% | -3.9% | -5.8% | -19.9% | 0.75 | -0.34% | Weak |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 6 | 51.2% | 51.2% | 33.3% | -17.8% | -38.4% | -3.7% | 0.58 | 0.02% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 47.9% | 66.7% | -18.8% | INVERTED |
| 4.5★ vs 4★ | 66.7% | 51.7% | +15.0% | Correct |
| 4★ vs 3.5★ | 51.7% | 51.5% | +0.2% | Correct |
| 3.5★ vs 3★ | 51.5% | 47.4% | +4.1% | Correct |
| 3★ vs 2.5★ | 47.4% | 48.3% | -0.9% | Flat |
| 2.5★ vs 2★ | 48.3% | 0.0% | +48.3% | Correct |
| 2★ vs 1★ | 0.0% | 33.3% | -33.3% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.690 |
| Spearman: Stars vs Flat ROI | 0.571 |
| Spearman: Stars vs CLV | -0.476 |
| Brier Score | 0.2451 |
| Monotonicity Score | -0.14 |

### All Time (n=1054)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 180 | 54.1% | 54.1% | 48.3% | -5.8% | -13.2% | -10.4% | 2.72 | 0.08% | Weak |
| 4.5 | 79 | 55.4% | 55.4% | 59.5% | +4.1% | 9.4% | 2.7% | 2.53 | 0.38% | Strong |
| 4 | 202 | 54.8% | 54.8% | 53.0% | -1.8% | -2.6% | -0.9% | 1.86 | -0.40% | Fair |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 217 | 54.7% | 54.7% | 48.4% | -6.3% | -11.4% | -11.5% | 1.15 | -0.37% | Weak |
| 2.5 | 165 | 53.7% | 53.7% | 52.7% | -0.9% | -2.5% | -5.5% | 0.74 | -0.64% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 6 | 51.2% | 51.2% | 33.3% | -17.8% | -38.4% | -3.7% | 0.58 | 0.02% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 48.3% | 59.5% | -11.2% | INVERTED |
| 4.5★ vs 4★ | 59.5% | 53.0% | +6.5% | Correct |
| 4★ vs 3.5★ | 53.0% | 56.5% | -3.5% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 48.4% | +8.1% | Correct |
| 3★ vs 2.5★ | 48.4% | 52.7% | -4.3% | INVERTED |
| 2.5★ vs 2★ | 52.7% | 0.0% | +52.7% | Correct |
| 2★ vs 1★ | 0.0% | 33.3% | -33.3% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.571 |
| Spearman: Stars vs Flat ROI | 0.500 |
| Spearman: Stars vs CLV | 0.071 |
| Brier Score | 0.2357 |
| Monotonicity Score | 0.14 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.189 | -0.059 | Tune |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.141 | -0.083 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.068 | -0.028 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.197 | -0.069 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | -0.019 | 0.030 | Monitor |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | 0.012 | 0.057 | Monitor |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | -0.148 | -0.023 | Tune |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.182 | -0.063 | Tune |
| AgainstSide | Opposition | Force against side | Higher → worse | -0.000 | 0.050 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.134 | -0.055 | Tune |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.016 | 0.046 | Monitor |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.185 | 0.074 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.201 | 0.088 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.165 | -0.062 | Tune |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (11.60–37.88) | 80 | 53.8% | -2.6% | -8.8% | -0.09% |  |
| p20-40 (37.93–45.15) | 81 | 49.4% | -6.8% | -4.9% | -0.24% |  |
| p40-60 (45.15–50.80) | 81 | 51.9% | -3.0% | 11.2% | -0.42% |  |
| p60-80 (50.85–56.32) | 80 | 53.8% | 9.7% | 3.4% | 0.49% |  |
| p80-95 (56.33–64.44) | 81 | 49.4% | -6.7% | -10.0% | -0.03% |  |
| p95+ (64.60–83.30) | 81 | 44.4% | -15.1% | -19.0% | -0.14% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 164 | 48.8% | -9.3% | -1.7% | -0.20% |  |
| 0.90-1.05 | 162 | 45.1% | -14.1% | -21.3% | -0.03% |  |
| 1.05-1.20 | 110 | 60.9% | 19.2% | 22.4% | 0.09% |  |
| 1.20-1.35 | 29 | 51.7% | -2.6% | -18.9% | 0.36% |  |
| 1.35-1.50 | 11 | 45.5% | -15.6% | -42.1% | -0.34% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.50) | 72 | 54.2% | -2.3% | 6.9% | -0.18% |  |
| 20-40% (0.50–0.76) | 73 | 52.1% | -1.0% | -1.6% | -0.28% |  |
| 40-60% (0.77–1.02) | 72 | 55.6% | 4.9% | 10.2% | -0.27% |  |
| 60-80% (1.03–1.29) | 73 | 45.2% | -7.0% | -20.0% | 0.38% |  |
| 80-95% (1.30–1.86) | 72 | 43.1% | -16.6% | -7.1% | -0.06% |  |
| 95%+ (1.87–4.76) | 73 | 47.9% | -10.4% | -8.3% | 0.12% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 27 | 37.0% | -24.0% | -32.3% | 0.27% | Broad support |
| 0.25-0.40 | 95 | 49.5% | -2.7% | -6.7% | 0.22% | Healthy support |
| 0.40-0.60 | 135 | 45.9% | -11.4% | -0.8% | -0.09% | Concentrated |
| 0.60-0.80 | 101 | 56.4% | 4.7% | -0.1% | -0.29% | Very concentrated |
| 0.80-1.00 | 77 | 51.9% | -5.1% | -2.6% | -0.11% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 51 | 35.3% | -33.6% | -34.7% | -0.09% | 4.4 |
| Broad battle | 187 | 46.5% | -8.6% | -5.3% | 0.01% | 4.0 |
| One-wallet nuke | 134 | 54.5% | 0.3% | 1.1% | -0.14% | 3.6 |
| Thin support | 264 | 53.4% | -0.8% | -3.3% | -0.11% | 3.7 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=492)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 19 | 47.4% | -15.7% | 14.8% | 0.22% | 4.3 | 84.2% |
| SMALL_MOVE | 109 | 45.9% | -14.9% | -8.5% | -0.46% | 4.1 | 100.0% |
| CLEAR_MOVE | 126 | 55.6% | 3.2% | 5.2% | 0.13% | 4.2 | 100.0% |
| NEAR_START | 189 | 48.7% | -4.0% | -11.1% | 0.05% | 3.8 | 100.0% |

**All Time** (n=1054)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 536 | 53.5% | -5.5% | -4.0% | -0.48% | 3.3 | 4.5% |
| SMALL_MOVE | 112 | 45.5% | -15.5% | -10.3% | -0.39% | 4.1 | 97.3% |
| CLEAR_MOVE | 152 | 55.3% | 2.7% | 4.6% | 0.04% | 4.1 | 100.0% |
| NEAR_START | 205 | 48.8% | -4.6% | -11.1% | 0.07% | 3.8 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 9 / 55.6% / -5.6% | 51 / 47.1% / -18.4% | 64 / 57.8% / 4.4% | 77 / 49.4% / -4.9% |
| 3.5-4★ | 8 / 37.5% / -29.6% | 41 / 48.8% / -5.6% | 37 / 48.6% / -9.9% | 51 / 58.8% / 20.6% |
| 2.5-3★ | 2 / 50.0% / -5.8% | 14 / 35.7% / -25.0% | 25 / 60.0% / 19.5% | 56 / 41.1% / -19.6% |
| 1.0-2★ | — | 3 / 33.3% / -34.9% | — | 5 / 20.0% / -65.1% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 489 | 50.5% | -4.1% | -4.1% | 4.0 | -0.07% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 539 | 50.6% | -4.2% | -4.2% | 4.0 | -0.07% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 785 | 100% |
| LOCKED (direct) | 78 | 9.9% |
| Promoted (SHADOW→LOCKED) | 458 | 58.3% |
| Rejected (stayed SHADOW) | 166 | 21.1% |
| Superseded (side flipped) | 78 | 9.9% |
| Muted | 302 | 38.5% |
| Cancelled | 20 | 2.5% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=492)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -33.40u | -3.9% | — |
| Flat 1.0u | -19.17u | -3.9% | -14.23u |
| Lock units only | -27.39u | — | -6.01u |
| Units change only on star change | -22.98u | — | -10.42u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 167 | 2.72 | -13.6% | -10.2% | -23.64u | Sizing hurts |
| 4.5 | 45 | 2.48 | 25.9% | 17.7% | +8.03u | Sizing helps |
| 4 | 87 | 1.51 | -1.8% | 4.2% | +7.12u | Sizing helps |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 57 | 1.00 | -6.9% | -13.6% | -3.82u | Sizing hurts |
| 2.5 | 58 | 0.75 | -5.8% | -19.9% | -5.30u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 6 | 0.58 | -38.4% | -3.7% | +2.17u | Sizing helps |

### All Time (n=1054)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -78.28u | -4.5% | — |
| Flat 1.0u | -48.68u | -4.6% | -29.60u |
| Lock units only | -61.50u | — | -16.78u |
| Units change only on star change | -67.02u | — | -11.26u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 180 | 2.72 | -13.2% | -10.4% | -27.23u | Sizing hurts |
| 4.5 | 79 | 2.53 | 9.4% | 2.7% | -1.99u | Sizing hurts |
| 4 | 202 | 1.86 | -2.6% | -0.9% | +1.88u | Sizing helps |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 217 | 1.15 | -11.4% | -11.5% | -3.96u | Sizing hurts |
| 2.5 | 165 | 0.74 | -2.5% | -5.5% | -2.59u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 6 | 0.58 | -38.4% | -3.7% | +2.17u | Sizing helps |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 492 | 53.0% | 50.6% | -2.4% | -3.9% | -0.06% | Below market |
| 4.5-5★ | 212 | 53.7% | 51.9% | -1.9% | -5.2% | -0.06% | Neutral |
| 3.5-4★ | 155 | 52.3% | 51.6% | -0.7% | 1.1% | -0.05% | Neutral |
| 2.5-3★ | 117 | 52.8% | 48.7% | -4.1% | -4.7% | -0.09% | Below market |
| CLEAR_MOVE only | 126 | 53.9% | 55.6% | +1.6% | 3.2% | 0.13% | Neutral |
| NO_MOVE only | 19 | 54.9% | 47.4% | -7.5% | -15.7% | 0.22% | Below market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=119)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 47.558 | 29.973 | 1.03 | ⚠️ |
| Rank_norm | 61.889 | 58.824 | 0.15 |  |
| PnL_norm | 53.305 | 52.029 | 0.07 |  |
| WalletBase | 50.477 | 38.644 | 0.87 |  |
| SizeRatio | 1.516 | 1.134 | 0.27 |  |
| ConvictionMult | 0.976 | 0.942 | 0.21 |  |
| WalletCountFor | 3.064 | 2.504 | 0.32 |  |
| TopShare | 0.569 | 0.674 | 0.44 |  |
| ForSide | 158.205 | 98.085 | 0.55 |  |
| AgainstSide | 49.918 | 27.566 | 0.28 |  |
| NetEdge | 1.158 | 0.746 | 0.51 |  |
| WalletPlayScore | 1.309 | 0.239 | 0.48 |  |

### V8 Era (n=435)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 47.558 | 46.967 | 0.03 |  |
| Rank_norm | 61.889 | 63.917 | 0.10 |  |
| PnL_norm | 53.305 | 53.806 | 0.03 |  |
| WalletBase | 50.477 | 50.166 | 0.02 |  |
| SizeRatio | 1.516 | 1.490 | 0.02 |  |
| ConvictionMult | 0.976 | 0.976 | 0.00 |  |
| WalletCountFor | 3.064 | 3.064 | 0.00 |  |
| TopShare | 0.569 | 0.569 | 0.00 |  |
| ForSide | 158.205 | 158.205 | 0.00 |  |
| AgainstSide | 49.918 | 49.918 | 0.00 |  |
| NetEdge | 1.158 | 1.158 | 0.00 |  |
| WalletPlayScore | 1.309 | 1.309 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=492)

- **Sizing issue**: Model P/L (-33.40u) trails flat (-19.17u) by 14.23u
- **Gate issue**: NO_MOVE ROI (-15.7%) significantly trails CLEAR_MOVE (3.2%)

### 7-Day (n=130)

- **Gate issue**: NO_MOVE ROI (-53.4%) significantly trails CLEAR_MOVE (-17.3%)

### All Time (n=1054)

- **Sizing issue**: Model P/L (-78.28u) trails flat (-48.68u) by 29.60u
- **Environment issue**: 50.9% NO_MOVE (WR: 53.5%, ROI: -5.5%)


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
| V8 era picks | 492 |
| V8 flat ROI | -3.9% |
| V8 model ROI | -3.9% |
| V8 star monotonicity score | -0.14 |
| 4.5-5★ ROI | -5.2% |
| 2.5-3★ ROI | -4.7% |
| CLEAR_MOVE ROI | 3.2% |
| NO_MOVE ROI | -15.7% |
| Single-wallet play rate | 24.4% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: 0.02% | 4.5★: -0.38% | 4★: -0.03% | 3.5★: -0.07% | 3★: 0.18% | 2.5★: -0.34% | 2★: 0.67% | 1★: 0.02% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=492)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 406 | 82.5% | 49.5% | -5.1% | -7.7% | -0.06% |
| MUTED | 75 | 15.2% | 56.0% | 2.2% | 20.8% | -0.11% |
| CANCELLED | 11 | 2.2% | 54.5% | -2.8% | -10.4% | 0.16% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| v73_hc_rescue | 21 | 52.4% |
| wps_flipped_diag | 19 | 42.1% |
| ags_quality_veto | 18 | 66.7% |
| opp_side_stronger_diag | 15 | 53.3% |
| winners_below_floor | 14 | 42.9% |
| winners_faded | 12 | 66.7% |
| ags_hard_mute | 10 | 60.0% |
| winners_killed | 9 | 55.6% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 7 | 57.1% |
| whitelist_fade_weak | 3 | 66.7% |
| sum_below_floor | 3 | 33.3% |
| whitelist_fade_strong | 2 | 50.0% |
| dw1_no_ags_support | 1 | 100.0% |

### 7-Day (n=130)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 126 | 96.9% | 50.8% | -6.7% | -2.9% | -0.33% |
| MUTED | 4 | 3.1% | 75.0% | 38.9% | 27.5% | 0.20% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| ags_hard_mute | 4 | 75.0% |
| opp_side_stronger_diag | 4 | 75.0% |
| wps_flipped_diag | 2 | 100.0% |

### All Time (n=1054)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 966 | 91.7% | 51.8% | -5.5% | -6.5% | -0.26% |
| MUTED | 75 | 7.1% | 56.0% | 2.2% | 20.8% | -0.11% |
| CANCELLED | 13 | 1.2% | 61.5% | 17.8% | 4.8% | -0.95% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| v73_hc_rescue | 21 | 52.4% |
| wps_flipped_diag | 19 | 42.1% |
| ags_quality_veto | 18 | 66.7% |
| opp_side_stronger_diag | 15 | 53.3% |
| winners_below_floor | 14 | 42.9% |
| winners_faded | 12 | 66.7% |
| ags_hard_mute | 10 | 60.0% |
| winners_killed | 9 | 55.6% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 7 | 57.1% |
| whitelist_fade_weak | 3 | 66.7% |
| sum_below_floor | 3 | 33.3% |
| opposition_building | 2 | 100.0% |
| mid_tier_or_lower | 2 | 100.0% |
| whitelist_fade_strong | 2 | 50.0% |
| dw1_no_ags_support | 1 | 100.0% |
