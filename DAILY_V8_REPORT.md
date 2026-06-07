# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-06-07 ET
**Completed Picks**: 1148 | **V8 Era Picks**: 586 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (67.2%) beats 5★ (48.2%) |
| Model P/L vs flat P/L | ⚠️ | Model trails flat by 3.7u — sizing amplifying losses |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 45 | 57.8% | 3.15u | 7.0% | 6.55u | 6.9% | -0.27% | -0.67% | Strong |
| 7-Day | 94 | 54.3% | 1.91u | 2.0% | 12.43u | 6.6% | -0.26% | -0.71% |  |
| 14-Day | 224 | 52.7% | -4.96u | -2.2% | 8.27u | 1.8% | -0.29% | -0.75% |  |
| 30-Day | 389 | 52.7% | -5.96u | -1.5% | -10.45u | -1.3% | -0.09% | -0.68% |  |
| V8 Era | 586 | 51.2% | -17.26u | -2.9% | -20.97u | -2.0% | -0.10% | -0.54% |  |
| All Time | 1148 | 52.4% | -46.77u | -4.1% | -65.85u | -3.4% | -0.26% | -0.20% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=586)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 193 | 53.6% | 53.6% | 48.2% | -5.4% | -12.3% | -8.8% | 2.87 | -0.03% | Weak |
| 4.5 | 64 | 53.7% | 53.7% | 67.2% | +13.4% | 25.5% | 22.6% | 2.58 | -0.50% | Strong |
| 4 | 106 | 53.3% | 53.3% | 49.1% | -4.2% | -6.6% | -0.5% | 1.41 | 0.04% | Weak |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 72 | 53.6% | 53.6% | 51.4% | -2.2% | 0.6% | -11.1% | 0.93 | 0.10% | Fair |
| 2.5 | 70 | 53.3% | 53.3% | 48.6% | -4.8% | -6.5% | -12.8% | 0.71 | -0.31% | Weak |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 9 | 54.3% | 54.3% | 44.4% | -9.9% | -19.3% | 14.3% | 0.53 | -0.01% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 48.2% | 67.2% | -19.0% | INVERTED |
| 4.5★ vs 4★ | 67.2% | 49.1% | +18.1% | Correct |
| 4★ vs 3.5★ | 49.1% | 51.5% | -2.4% | Flat |
| 3.5★ vs 3★ | 51.5% | 51.4% | +0.1% | Correct |
| 3★ vs 2.5★ | 51.4% | 48.6% | +2.8% | Correct |
| 2.5★ vs 2★ | 48.6% | 0.0% | +48.6% | Correct |
| 2★ vs 1★ | 0.0% | 44.4% | -44.4% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.548 |
| Spearman: Stars vs Flat ROI | 0.476 |
| Spearman: Stars vs CLV | -0.405 |
| Brier Score | 0.2468 |
| Monotonicity Score | -0.14 |

### All Time (n=1148)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 206 | 53.9% | 53.9% | 48.5% | -5.4% | -12.1% | -9.0% | 2.86 | 0.02% | Weak |
| 4.5 | 98 | 55.1% | 55.1% | 61.2% | +6.1% | 12.4% | 9.1% | 2.59 | 0.13% | Strong |
| 4 | 221 | 54.7% | 54.7% | 51.6% | -3.1% | -4.8% | -2.5% | 1.78 | -0.33% | Fair |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 232 | 54.7% | 54.7% | 49.6% | -5.1% | -8.8% | -10.9% | 1.12 | -0.36% | Weak |
| 2.5 | 177 | 54.0% | 54.0% | 52.5% | -1.5% | -3.0% | -3.5% | 0.73 | -0.61% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 9 | 54.3% | 54.3% | 44.4% | -9.9% | -19.3% | 14.3% | 0.53 | -0.01% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 48.5% | 61.2% | -12.7% | INVERTED |
| 4.5★ vs 4★ | 61.2% | 51.6% | +9.6% | Correct |
| 4★ vs 3.5★ | 51.6% | 56.5% | -4.9% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 49.6% | +6.9% | Correct |
| 3★ vs 2.5★ | 49.6% | 52.5% | -2.9% | Flat |
| 2.5★ vs 2★ | 52.5% | 0.0% | +52.5% | Correct |
| 2★ vs 1★ | 0.0% | 44.4% | -44.4% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.500 |
| Spearman: Stars vs Flat ROI | 0.500 |
| Spearman: Stars vs CLV | 0.119 |
| Brier Score | 0.2374 |
| Monotonicity Score | 0.14 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.179 | -0.061 | Tune |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.168 | -0.114 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.046 | -0.025 | Monitor |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.187 | -0.072 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | -0.035 | 0.011 | Monitor |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | -0.003 | 0.037 | Monitor |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | -0.160 | -0.046 | Tune |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.187 | -0.071 | Tune |
| AgainstSide | Opposition | Force against side | Higher → worse | -0.011 | 0.037 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.141 | -0.061 | Tune |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | -0.001 | 0.028 | Monitor |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.189 | 0.082 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.201 | 0.093 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.167 | -0.069 | Tune |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (11.60–35.00) | 96 | 54.2% | -2.7% | -1.6% | 0.01% |  |
| p20-40 (35.20–43.77) | 96 | 56.3% | 7.8% | 5.7% | -0.05% |  |
| p40-60 (43.78–49.20) | 97 | 55.7% | 3.4% | 9.7% | -0.51% |  |
| p60-80 (49.20–54.80) | 96 | 42.7% | -14.2% | -12.6% | 0.21% |  |
| p80-95 (54.86–63.20) | 96 | 51.0% | 1.0% | -4.2% | 0.15% |  |
| p95+ (63.25–83.30) | 97 | 46.4% | -14.1% | -19.5% | -0.41% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 208 | 48.6% | -9.0% | -7.3% | -0.26% |  |
| 0.90-1.05 | 197 | 47.7% | -10.0% | -11.5% | -0.02% |  |
| 1.05-1.20 | 121 | 62.0% | 21.4% | 24.7% | 0.06% |  |
| 1.20-1.35 | 33 | 48.5% | -10.0% | -20.6% | 0.31% |  |
| 1.35-1.50 | 11 | 45.5% | -15.6% | -42.1% | -0.34% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.33) | 84 | 51.2% | -5.9% | 6.1% | -0.20% |  |
| 20-40% (0.34–0.68) | 84 | 59.5% | 10.3% | 7.2% | -0.33% |  |
| 40-60% (0.68–0.93) | 85 | 48.2% | -10.7% | 2.3% | -0.22% |  |
| 60-80% (0.93–1.25) | 84 | 53.6% | 8.2% | -5.8% | 0.33% |  |
| 80-95% (1.25–1.72) | 84 | 44.0% | -14.1% | -8.0% | -0.00% |  |
| 95%+ (1.74–6.68) | 85 | 45.9% | -14.1% | -11.3% | 0.17% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 29 | 34.5% | -29.2% | -32.9% | 0.26% | Broad support |
| 0.25-0.40 | 102 | 51.0% | 0.1% | -4.4% | 0.28% | Healthy support |
| 0.40-0.60 | 158 | 47.5% | -9.6% | 0.6% | -0.10% | Concentrated |
| 0.60-0.80 | 112 | 57.1% | 6.3% | 3.5% | -0.22% | Very concentrated |
| 0.80-1.00 | 105 | 51.4% | -5.7% | -2.2% | -0.18% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 56 | 35.7% | -33.1% | -34.9% | -0.09% | 4.3 |
| Broad battle | 211 | 46.9% | -8.3% | -4.4% | 0.04% | 3.9 |
| One-wallet nuke | 185 | 53.5% | -0.4% | 0.1% | -0.28% | 3.7 |
| Thin support | 335 | 53.7% | 0.1% | -1.7% | -0.18% | 3.8 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=586)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 22 | 54.5% | -1.3% | 25.3% | 0.34% | 4.3 | 86.4% |
| SMALL_MOVE | 127 | 46.5% | -13.7% | -5.0% | -0.45% | 4.1 | 100.0% |
| CLEAR_MOVE | 133 | 55.6% | 2.7% | 6.3% | 0.12% | 4.1 | 100.0% |
| NEAR_START | 232 | 49.6% | -3.2% | -9.1% | 0.05% | 3.8 | 100.0% |

**All Time** (n=1148)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 539 | 53.8% | -5.0% | -3.3% | -0.47% | 3.3 | 5.0% |
| SMALL_MOVE | 130 | 46.2% | -14.2% | -6.7% | -0.39% | 4.1 | 97.7% |
| CLEAR_MOVE | 159 | 55.3% | 2.4% | 5.5% | 0.03% | 4.1 | 100.0% |
| NEAR_START | 248 | 49.6% | -3.8% | -9.3% | 0.07% | 3.8 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 11 / 63.6% / 10.4% | 61 / 49.2% / -12.6% | 66 / 59.1% / 6.1% | 96 / 49.0% / -6.2% |
| 3.5-4★ | 8 / 37.5% / -29.6% | 43 / 48.8% / -6.5% | 39 / 46.2% / -14.5% | 61 / 59.0% / 20.6% |
| 2.5-3★ | 3 / 66.7% / 31.2% | 19 / 36.8% / -25.7% | 28 / 60.7% / 18.8% | 68 / 42.6% / -18.2% |
| 1.0-2★ | — | 4 / 25.0% / -51.2% | — | 7 / 42.9% / -24.2% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 583 | 51.1% | -3.1% | -2.2% | 4.0 | -0.10% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 633 | 51.2% | -3.3% | -2.4% | 4.0 | -0.10% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 962 | 100% |
| LOCKED (direct) | 86 | 8.9% |
| Promoted (SHADOW→LOCKED) | 589 | 61.2% |
| Rejected (stayed SHADOW) | 178 | 18.5% |
| Superseded (side flipped) | 104 | 10.8% |
| Muted | 359 | 37.3% |
| Cancelled | 20 | 2.1% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=586)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -20.97u | -2.0% | — |
| Flat 1.0u | -17.26u | -2.9% | -3.71u |
| Lock units only | -9.29u | — | -11.68u |
| Units change only on star change | -4.89u | — | -16.08u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 193 | 2.87 | -12.3% | -8.8% | -24.79u | Sizing hurts |
| 4.5 | 64 | 2.58 | 25.5% | 22.6% | +21.03u | Sizing helps |
| 4 | 106 | 1.41 | -6.6% | -0.5% | +6.18u | Sizing helps |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 72 | 0.93 | 0.6% | -11.1% | -7.88u | Sizing hurts |
| 2.5 | 70 | 0.71 | -6.5% | -12.8% | -1.87u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 9 | 0.53 | -19.3% | 14.3% | +2.42u | Sizing helps |

### All Time (n=1148)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -65.85u | -3.4% | — |
| Flat 1.0u | -46.77u | -4.1% | -19.08u |
| Lock units only | -43.41u | — | -22.44u |
| Units change only on star change | -48.93u | — | -16.92u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 206 | 2.86 | -12.1% | -9.0% | -28.39u | Sizing hurts |
| 4.5 | 98 | 2.59 | 12.4% | 9.1% | +11.02u | Sizing helps |
| 4 | 221 | 1.78 | -4.8% | -2.5% | +0.94u | Sizing helps |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 232 | 1.12 | -8.8% | -10.9% | -8.03u | Sizing hurts |
| 2.5 | 177 | 0.73 | -3.0% | -3.5% | +0.84u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 9 | 0.53 | -19.3% | 14.3% | +2.42u | Sizing helps |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 586 | 53.3% | 51.2% | -2.1% | -2.9% | -0.10% | Below market |
| 4.5-5★ | 257 | 53.7% | 52.9% | -0.7% | -2.9% | -0.15% | Neutral |
| 3.5-4★ | 174 | 52.5% | 50.0% | -2.5% | -2.2% | -0.01% | Below market |
| 2.5-3★ | 144 | 53.5% | 50.7% | -2.8% | -1.6% | -0.11% | Below market |
| CLEAR_MOVE only | 133 | 54.1% | 55.6% | +1.5% | 2.7% | 0.12% | Neutral |
| NO_MOVE only | 22 | 54.8% | 54.5% | -0.2% | -1.3% | 0.34% | Neutral |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=71)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 45.075 | 26.775 | 1.02 | ⚠️ |
| Rank_norm | 60.404 | 60.201 | 0.01 |  |
| PnL_norm | 53.335 | 57.675 | 0.25 |  |
| WalletBase | 48.912 | 38.543 | 0.77 |  |
| SizeRatio | 1.448 | 1.197 | 0.19 |  |
| ConvictionMult | 0.968 | 0.948 | 0.12 |  |
| WalletCountFor | 2.962 | 2.338 | 0.35 |  |
| TopShare | 0.588 | 0.706 | 0.48 |  |
| ForSide | 149.964 | 99.475 | 0.45 |  |
| AgainstSide | 49.449 | 46.580 | 0.04 |  |
| NetEdge | 1.079 | 0.599 | 0.57 |  |
| WalletPlayScore | 1.103 | -0.157 | 0.54 |  |

### V8 Era (n=506)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 45.075 | 44.134 | 0.05 |  |
| Rank_norm | 60.404 | 63.384 | 0.15 |  |
| PnL_norm | 53.335 | 54.349 | 0.06 |  |
| WalletBase | 48.912 | 48.535 | 0.03 |  |
| SizeRatio | 1.448 | 1.449 | 0.00 |  |
| ConvictionMult | 0.968 | 0.972 | 0.02 |  |
| WalletCountFor | 2.962 | 2.962 | 0.00 |  |
| TopShare | 0.588 | 0.588 | 0.00 |  |
| ForSide | 149.964 | 149.964 | 0.00 |  |
| AgainstSide | 49.449 | 49.449 | 0.00 |  |
| NetEdge | 1.079 | 1.079 | 0.00 |  |
| WalletPlayScore | 1.103 | 1.103 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=586)

- **Sizing issue**: Model P/L (-20.97u) trails flat (-17.26u) by 3.71u

### 7-Day (n=94)

- **Ranking issue**: ≤3★ WR (60%) beats ≥4★ (52%)

### All Time (n=1148)

- **Sizing issue**: Model P/L (-65.85u) trails flat (-46.77u) by 19.08u
- **Environment issue**: 47.0% NO_MOVE (WR: 53.8%, ROI: -5.0%)


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
| V8 era picks | 586 |
| V8 flat ROI | -2.9% |
| V8 model ROI | -2.0% |
| V8 star monotonicity score | -0.14 |
| 4.5-5★ ROI | -2.9% |
| 2.5-3★ ROI | -1.6% |
| CLEAR_MOVE ROI | 2.7% |
| NO_MOVE ROI | -1.3% |
| Single-wallet play rate | 29.0% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: -0.03% | 4.5★: -0.50% | 4★: 0.04% | 3.5★: -0.07% | 3★: 0.10% | 2.5★: -0.31% | 2★: 0.67% | 1★: -0.01% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=586)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 500 | 85.3% | 50.4% | -3.7% | -4.7% | -0.10% |
| MUTED | 75 | 12.8% | 56.0% | 2.2% | 20.8% | -0.11% |
| CANCELLED | 11 | 1.9% | 54.5% | -2.8% | -10.4% | 0.16% |

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

### 7-Day (n=94)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 94 | 100.0% | 54.3% | 2.0% | 6.6% | -0.26% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| opp_side_stronger_diag | 1 | 0.0% |

### All Time (n=1148)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 1060 | 92.3% | 52.0% | -4.8% | -5.1% | -0.26% |
| MUTED | 75 | 6.5% | 56.0% | 2.2% | 20.8% | -0.11% |
| CANCELLED | 13 | 1.1% | 61.5% | 17.8% | 4.8% | -0.95% |

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
