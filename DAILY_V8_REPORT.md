# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-06-02 ET
**Completed Picks**: 1074 | **V8 Era Picks**: 512 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (66.7%) beats 5★ (47.7%) |
| Model P/L vs flat P/L | ⚠️ | Model trails flat by 9.6u — sizing amplifying losses |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 41 | 51.2% | -1.26u | -3.1% | 1.43u | 1.7% | -0.19% | -0.78% |  |
| 7-Day | 111 | 52.3% | -3.61u | -3.3% | 8.85u | 4.1% | -0.34% | -0.77% |  |
| 14-Day | 223 | 51.6% | -10.49u | -4.7% | -19.15u | -4.5% | -0.12% | -0.70% |  |
| 30-Day | 340 | 52.1% | -9.92u | -2.9% | -17.72u | -2.6% | -0.13% | -0.63% |  |
| V8 Era | 512 | 50.6% | -20.73u | -4.0% | -30.29u | -3.4% | -0.06% | -0.53% |  |
| All Time | 1074 | 52.1% | -50.24u | -4.7% | -75.17u | -4.3% | -0.25% | -0.19% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=512)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 174 | 53.6% | 53.6% | 47.7% | -5.9% | -13.5% | -9.6% | 2.72 | 0.04% | Weak |
| 4.5 | 48 | 53.7% | 53.7% | 66.7% | +13.0% | 25.4% | 19.4% | 2.50 | -0.42% | Strong |
| 4 | 90 | 53.0% | 53.0% | 51.1% | -1.9% | -2.4% | 3.2% | 1.48 | -0.02% | Fair |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 60 | 53.7% | 53.7% | 46.7% | -7.0% | -8.9% | -16.8% | 1.02 | 0.16% | Weak |
| 2.5 | 60 | 52.5% | 52.5% | 50.0% | -2.5% | -3.5% | -12.1% | 0.79 | -0.32% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 8 | 55.0% | 55.0% | 37.5% | -17.5% | -35.0% | -10.1% | 0.47 | -0.01% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 47.7% | 66.7% | -19.0% | INVERTED |
| 4.5★ vs 4★ | 66.7% | 51.1% | +15.6% | Correct |
| 4★ vs 3.5★ | 51.1% | 51.5% | -0.4% | Flat |
| 3.5★ vs 3★ | 51.5% | 46.7% | +4.8% | Correct |
| 3★ vs 2.5★ | 46.7% | 50.0% | -3.3% | INVERTED |
| 2.5★ vs 2★ | 50.0% | 0.0% | +50.0% | Correct |
| 2★ vs 1★ | 0.0% | 37.5% | -37.5% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.667 |
| Spearman: Stars vs Flat ROI | 0.571 |
| Spearman: Stars vs CLV | -0.310 |
| Brier Score | 0.2452 |
| Monotonicity Score | 0.14 |

### All Time (n=1074)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 187 | 54.0% | 54.0% | 48.1% | -5.9% | -13.2% | -9.9% | 2.72 | 0.10% | Weak |
| 4.5 | 82 | 55.4% | 55.4% | 59.8% | +4.4% | 9.8% | 4.3% | 2.54 | 0.32% | Strong |
| 4 | 205 | 54.7% | 54.7% | 52.7% | -2.0% | -2.9% | -1.2% | 1.84 | -0.39% | Fair |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 220 | 54.8% | 54.8% | 48.2% | -6.6% | -11.9% | -12.3% | 1.15 | -0.37% | Weak |
| 2.5 | 167 | 53.8% | 53.8% | 53.3% | -0.5% | -1.7% | -3.0% | 0.75 | -0.63% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 8 | 55.0% | 55.0% | 37.5% | -17.5% | -35.0% | -10.1% | 0.47 | -0.01% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 48.1% | 59.8% | -11.7% | INVERTED |
| 4.5★ vs 4★ | 59.8% | 52.7% | +7.1% | Correct |
| 4★ vs 3.5★ | 52.7% | 56.5% | -3.8% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 48.2% | +8.3% | Correct |
| 3★ vs 2.5★ | 48.2% | 53.3% | -5.1% | INVERTED |
| 2.5★ vs 2★ | 53.3% | 0.0% | +53.3% | Correct |
| 2★ vs 1★ | 0.0% | 37.5% | -37.5% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.500 |
| Spearman: Stars vs Flat ROI | 0.500 |
| Spearman: Stars vs CLV | 0.071 |
| Brier Score | 0.2359 |
| Monotonicity Score | 0.14 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.189 | -0.058 | Tune |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.146 | -0.091 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.072 | -0.035 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.198 | -0.070 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | -0.014 | 0.037 | Monitor |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | 0.016 | 0.064 | Monitor |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | -0.150 | -0.023 | Tune |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.177 | -0.051 | Tune |
| AgainstSide | Opposition | Force against side | Higher → worse | -0.001 | 0.049 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.128 | -0.042 | Tune |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.020 | 0.055 | Monitor |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.178 | 0.063 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.196 | 0.080 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.158 | -0.049 | Tune |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (11.60–36.43) | 84 | 56.0% | 0.2% | -1.5% | -0.21% |  |
| p20-40 (36.50–44.70) | 84 | 47.6% | -8.5% | -11.8% | 0.23% |  |
| p40-60 (44.72–50.26) | 84 | 54.8% | 1.6% | 20.2% | -0.72% |  |
| p60-80 (50.29–55.77) | 84 | 46.4% | -5.2% | -9.7% | 0.37% |  |
| p80-95 (56.02–64.10) | 84 | 52.4% | 0.3% | -4.1% | 0.04% |  |
| p95+ (64.10–83.30) | 84 | 45.2% | -14.0% | -17.5% | -0.14% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 170 | 48.2% | -10.8% | -4.6% | -0.22% |  |
| 0.90-1.05 | 172 | 45.3% | -13.9% | -18.2% | -0.06% |  |
| 1.05-1.20 | 114 | 61.4% | 20.8% | 23.6% | 0.16% |  |
| 1.20-1.35 | 29 | 51.7% | -2.6% | -18.9% | 0.36% |  |
| 1.35-1.50 | 11 | 45.5% | -15.6% | -42.1% | -0.34% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.47) | 75 | 56.0% | 0.2% | 5.9% | -0.21% |  |
| 20-40% (0.47–0.75) | 76 | 48.7% | -8.1% | -4.8% | -0.28% |  |
| 40-60% (0.76–1.01) | 75 | 54.7% | 2.5% | 11.9% | -0.30% |  |
| 60-80% (1.01–1.28) | 76 | 48.7% | 0.6% | -12.9% | 0.51% |  |
| 80-95% (1.28–1.85) | 75 | 44.0% | -14.3% | -3.9% | -0.11% |  |
| 95%+ (1.85–4.76) | 76 | 46.1% | -13.9% | -11.5% | 0.15% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 27 | 37.0% | -24.0% | -32.3% | 0.27% | Broad support |
| 0.25-0.40 | 97 | 49.5% | -2.0% | -5.2% | 0.30% | Healthy support |
| 0.40-0.60 | 145 | 46.2% | -11.3% | 0.7% | -0.10% | Concentrated |
| 0.60-0.80 | 103 | 56.3% | 4.5% | -0.3% | -0.29% | Very concentrated |
| 0.80-1.00 | 81 | 51.9% | -6.0% | -3.5% | -0.14% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 53 | 34.0% | -36.1% | -35.6% | -0.07% | 4.4 |
| Broad battle | 192 | 46.9% | -7.9% | -4.4% | 0.05% | 3.9 |
| One-wallet nuke | 140 | 54.3% | -0.4% | -0.7% | -0.17% | 3.6 |
| Thin support | 276 | 53.3% | -1.6% | -4.4% | -0.13% | 3.7 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=512)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 19 | 47.4% | -15.7% | 14.8% | 0.22% | 4.3 | 84.2% |
| SMALL_MOVE | 112 | 44.6% | -17.2% | -10.1% | -0.46% | 4.1 | 100.0% |
| CLEAR_MOVE | 128 | 56.3% | 4.0% | 6.2% | 0.12% | 4.2 | 100.0% |
| NEAR_START | 202 | 49.0% | -3.5% | -8.5% | 0.06% | 3.8 | 100.0% |

**All Time** (n=1074)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 536 | 53.5% | -5.5% | -4.0% | -0.48% | 3.3 | 4.5% |
| SMALL_MOVE | 115 | 44.3% | -17.7% | -11.8% | -0.39% | 4.1 | 97.4% |
| CLEAR_MOVE | 154 | 55.8% | 3.4% | 5.4% | 0.03% | 4.1 | 100.0% |
| NEAR_START | 218 | 49.1% | -4.1% | -8.8% | 0.08% | 3.8 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 9 / 55.6% / -5.6% | 52 / 46.2% / -20.0% | 65 / 58.5% / 5.3% | 83 / 49.4% / -4.3% |
| 3.5-4★ | 8 / 37.5% / -29.6% | 41 / 48.8% / -5.6% | 37 / 48.6% / -9.9% | 54 / 57.4% / 18.3% |
| 2.5-3★ | 2 / 50.0% / -5.8% | 15 / 33.3% / -30.0% | 26 / 61.5% / 20.4% | 59 / 42.4% / -17.9% |
| 1.0-2★ | — | 4 / 25.0% / -51.2% | — | 6 / 33.3% / -45.9% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 509 | 50.5% | -4.3% | -3.6% | 4.0 | -0.07% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 559 | 50.6% | -4.4% | -3.7% | 4.0 | -0.07% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 832 | 100% |
| LOCKED (direct) | 80 | 9.6% |
| Promoted (SHADOW→LOCKED) | 488 | 58.7% |
| Rejected (stayed SHADOW) | 172 | 20.7% |
| Superseded (side flipped) | 87 | 10.5% |
| Muted | 322 | 38.7% |
| Cancelled | 20 | 2.4% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=512)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -30.29u | -3.4% | — |
| Flat 1.0u | -20.73u | -4.0% | -9.56u |
| Lock units only | -19.47u | — | -10.82u |
| Units change only on star change | -15.06u | — | -15.23u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 174 | 2.72 | -13.5% | -9.6% | -22.06u | Sizing hurts |
| 4.5 | 48 | 2.50 | 25.4% | 19.4% | +11.04u | Sizing helps |
| 4 | 90 | 1.48 | -2.4% | 3.2% | +6.47u | Sizing helps |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 60 | 1.02 | -8.9% | -16.8% | -4.93u | Sizing hurts |
| 2.5 | 60 | 0.79 | -3.5% | -12.1% | -3.70u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 8 | 0.47 | -35.0% | -10.1% | +2.42u | Sizing helps |

### All Time (n=1074)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -75.17u | -4.3% | — |
| Flat 1.0u | -50.24u | -4.7% | -24.93u |
| Lock units only | -53.58u | — | -21.59u |
| Units change only on star change | -59.10u | — | -16.07u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 187 | 2.72 | -13.2% | -9.9% | -25.65u | Sizing hurts |
| 4.5 | 82 | 2.54 | 9.8% | 4.3% | +1.02u | Sizing helps |
| 4 | 205 | 1.84 | -2.9% | -1.2% | +1.23u | Sizing helps |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 220 | 1.15 | -11.9% | -12.3% | -5.08u | Sizing hurts |
| 2.5 | 167 | 0.75 | -1.7% | -3.0% | -0.99u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 8 | 0.47 | -35.0% | -10.1% | +2.42u | Sizing helps |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 512 | 53.1% | 50.6% | -2.5% | -4.0% | -0.06% | Below market |
| 4.5-5★ | 222 | 53.7% | 51.8% | -1.9% | -5.1% | -0.06% | Neutral |
| 3.5-4★ | 158 | 52.2% | 51.3% | -1.0% | 0.7% | -0.04% | Neutral |
| 2.5-3★ | 122 | 53.1% | 49.2% | -3.9% | -4.7% | -0.09% | Below market |
| CLEAR_MOVE only | 128 | 54.1% | 56.3% | +2.1% | 4.0% | 0.12% | Beating market |
| NO_MOVE only | 19 | 54.9% | 47.4% | -7.5% | -15.7% | 0.22% | Below market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=109)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 46.685 | 28.867 | 1.03 | ⚠️ |
| Rank_norm | 61.565 | 58.934 | 0.13 |  |
| PnL_norm | 53.277 | 52.718 | 0.03 |  |
| WalletBase | 49.919 | 38.275 | 0.85 |  |
| SizeRatio | 1.503 | 1.126 | 0.27 |  |
| ConvictionMult | 0.976 | 0.946 | 0.18 |  |
| WalletCountFor | 3.038 | 2.413 | 0.36 |  |
| TopShare | 0.571 | 0.677 | 0.45 |  |
| ForSide | 155.340 | 93.323 | 0.57 |  |
| AgainstSide | 49.340 | 27.981 | 0.27 |  |
| NetEdge | 1.134 | 0.695 | 0.54 |  |
| WalletPlayScore | 1.267 | 0.141 | 0.51 |  |

### V8 Era (n=453)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 46.685 | 46.021 | 0.04 |  |
| Rank_norm | 61.565 | 63.658 | 0.11 |  |
| PnL_norm | 53.277 | 53.788 | 0.03 |  |
| WalletBase | 49.919 | 49.569 | 0.03 |  |
| SizeRatio | 1.503 | 1.479 | 0.02 |  |
| ConvictionMult | 0.976 | 0.976 | 0.00 |  |
| WalletCountFor | 3.038 | 3.038 | 0.00 |  |
| TopShare | 0.571 | 0.571 | 0.00 |  |
| ForSide | 155.340 | 155.340 | 0.00 |  |
| AgainstSide | 49.340 | 49.340 | 0.00 |  |
| NetEdge | 1.134 | 1.134 | 0.00 |  |
| WalletPlayScore | 1.267 | 1.267 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=512)

- **Sizing issue**: Model P/L (-30.29u) trails flat (-20.73u) by 9.56u
- **Gate issue**: NO_MOVE ROI (-15.7%) significantly trails CLEAR_MOVE (4.0%)

### 7-Day (n=111)

- **Gate issue**: NO_MOVE ROI (-53.4%) significantly trails CLEAR_MOVE (5.1%)

### All Time (n=1074)

- **Sizing issue**: Model P/L (-75.17u) trails flat (-50.24u) by 24.93u
- **Environment issue**: 49.9% NO_MOVE (WR: 53.5%, ROI: -5.5%)


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
| V8 era picks | 512 |
| V8 flat ROI | -4.0% |
| V8 model ROI | -3.4% |
| V8 star monotonicity score | 0.14 |
| 4.5-5★ ROI | -5.1% |
| 2.5-3★ ROI | -4.7% |
| CLEAR_MOVE ROI | 4.0% |
| NO_MOVE ROI | -15.7% |
| Single-wallet play rate | 24.6% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: 0.04% | 4.5★: -0.42% | 4★: -0.02% | 3.5★: -0.07% | 3★: 0.16% | 2.5★: -0.32% | 2★: 0.67% | 1★: -0.01% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=512)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 426 | 83.2% | 49.5% | -5.2% | -6.9% | -0.06% |
| MUTED | 75 | 14.6% | 56.0% | 2.2% | 20.8% | -0.11% |
| CANCELLED | 11 | 2.1% | 54.5% | -2.8% | -10.4% | 0.16% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| v73_hc_rescue | 21 | 52.4% |
| wps_flipped_diag | 19 | 42.1% |
| ags_quality_veto | 18 | 66.7% |
| opp_side_stronger_diag | 16 | 50.0% |
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

### 7-Day (n=111)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 107 | 96.4% | 51.4% | -4.8% | 2.8% | -0.36% |
| MUTED | 4 | 3.6% | 75.0% | 38.9% | 27.5% | 0.20% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| opp_side_stronger_diag | 5 | 60.0% |
| ags_hard_mute | 4 | 75.0% |
| wps_flipped_diag | 1 | 100.0% |

### All Time (n=1074)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 986 | 91.8% | 51.7% | -5.5% | -6.1% | -0.25% |
| MUTED | 75 | 7.0% | 56.0% | 2.2% | 20.8% | -0.11% |
| CANCELLED | 13 | 1.2% | 61.5% | 17.8% | 4.8% | -0.95% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| v73_hc_rescue | 21 | 52.4% |
| wps_flipped_diag | 19 | 42.1% |
| ags_quality_veto | 18 | 66.7% |
| opp_side_stronger_diag | 16 | 50.0% |
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
