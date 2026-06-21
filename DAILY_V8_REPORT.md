# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-06-21 ET
**Completed Picks**: 1382 | **V8 Era Picks**: 820 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (58.6%) beats 5★ (50.4%) |
| Single-wallet dependency | ⚠️ | 38% of picks are single-wallet (WR: 53.8%, ROI: 2.3%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 40 | 60.0% | 4.43u | 11.1% | 8.12u | 9.5% | -0.13% | -1.07% | Strong |
| 7-Day | 106 | 52.8% | -2.94u | -2.8% | -1.77u | -0.8% | -0.36% | -0.86% |  |
| 14-Day | 234 | 53.0% | 1.04u | 0.4% | 22.52u | 4.7% | -0.43% | 0.40% |  |
| 30-Day | 501 | 52.9% | -3.34u | -0.7% | 21.32u | 2.1% | -0.30% | -0.45% |  |
| V8 Era | 820 | 51.7% | -16.22u | -2.0% | 1.55u | 0.1% | -0.19% | -0.44% |  |
| All Time | 1382 | 52.5% | -45.74u | -3.3% | -43.33u | -1.8% | -0.29% | -0.17% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=820)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 242 | 53.7% | 53.7% | 50.4% | -3.3% | -7.6% | -4.6% | 3.17 | -0.11% | Weak |
| 4.5 | 133 | 53.2% | 53.2% | 58.6% | +5.4% | 10.9% | 12.5% | 2.67 | -0.70% | Strong |
| 4 | 160 | 53.0% | 53.0% | 48.1% | -4.8% | -8.1% | -0.2% | 1.27 | -0.14% | Weak |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 102 | 53.6% | 53.6% | 52.9% | -0.7% | 1.1% | -7.3% | 0.81 | 0.07% | Fair |
| 2.5 | 101 | 53.0% | 53.0% | 50.5% | -2.6% | -2.7% | -10.7% | 0.57 | -0.13% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 10 | 53.9% | 53.9% | 50.0% | -3.9% | -7.6% | 13.6% | 0.50 | -0.01% | Weak |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 50.4% | 58.6% | -8.2% | INVERTED |
| 4.5★ vs 4★ | 58.6% | 48.1% | +10.5% | Correct |
| 4★ vs 3.5★ | 48.1% | 51.5% | -3.4% | INVERTED |
| 3.5★ vs 3★ | 51.5% | 52.9% | -1.4% | Flat |
| 3★ vs 2.5★ | 52.9% | 50.5% | +2.4% | Correct |
| 2.5★ vs 2★ | 50.5% | 0.0% | +50.5% | Correct |
| 2★ vs 1★ | 0.0% | 50.0% | -50.0% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.381 |
| Spearman: Stars vs Flat ROI | 0.238 |
| Spearman: Stars vs CLV | -0.643 |
| Brier Score | 0.2465 |
| Monotonicity Score | 0.14 |

### All Time (n=1382)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 255 | 53.9% | 53.9% | 50.6% | -3.3% | -7.6% | -5.0% | 3.14 | -0.06% | Weak |
| 4.5 | 167 | 54.1% | 54.1% | 56.9% | +2.7% | 6.1% | 6.8% | 2.66 | -0.31% | Strong |
| 4 | 275 | 54.2% | 54.2% | 50.5% | -3.7% | -6.0% | -2.1% | 1.62 | -0.37% | Weak |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 262 | 54.6% | 54.6% | 50.4% | -4.2% | -7.5% | -9.8% | 1.05 | -0.31% | Weak |
| 2.5 | 208 | 53.8% | 53.8% | 52.9% | -0.9% | -1.7% | -3.1% | 0.65 | -0.47% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 10 | 53.9% | 53.9% | 50.0% | -3.9% | -7.6% | 13.6% | 0.50 | -0.01% | Weak |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 50.6% | 56.9% | -6.3% | INVERTED |
| 4.5★ vs 4★ | 56.9% | 50.5% | +6.4% | Correct |
| 4★ vs 3.5★ | 50.5% | 56.5% | -6.0% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 50.4% | +6.1% | Correct |
| 3★ vs 2.5★ | 50.4% | 52.9% | -2.5% | Flat |
| 2.5★ vs 2★ | 52.9% | 0.0% | +52.9% | Correct |
| 2★ vs 1★ | 0.0% | 50.0% | -50.0% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.643 |
| Spearman: Stars vs Flat ROI | 0.333 |
| Spearman: Stars vs CLV | -0.333 |
| Brier Score | 0.2388 |
| Monotonicity Score | 0.14 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.091 | -0.015 | Tune |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.191 | -0.130 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.098 | -0.064 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.142 | -0.052 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | -0.076 | -0.019 | Tune |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | -0.045 | 0.008 | Monitor |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | -0.151 | -0.049 | Tune |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.180 | -0.087 | Tune |
| AgainstSide | Opposition | Force against side | Higher → worse | -0.008 | 0.031 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.141 | -0.077 | Tune |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | -0.007 | 0.002 | Monitor |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.178 | 0.102 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.182 | 0.108 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.156 | -0.086 | Tune |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (10.60–34.90) | 135 | 51.1% | -7.7% | -4.6% | -0.09% |  |
| p20-40 (34.95–41.02) | 135 | 59.3% | 11.6% | 15.1% | -0.14% |  |
| p40-60 (41.08–47.06) | 136 | 48.5% | -6.7% | -4.1% | -0.68% |  |
| p60-80 (47.07–52.66) | 135 | 51.9% | -2.8% | -1.4% | 0.10% |  |
| p80-95 (52.70–60.80) | 135 | 49.6% | 0.1% | -6.8% | -0.14% |  |
| p95+ (60.93–83.30) | 136 | 49.3% | -7.1% | -1.7% | -0.20% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 333 | 48.6% | -8.2% | -5.5% | -0.39% |  |
| 0.90-1.05 | 273 | 49.8% | -6.1% | -6.4% | -0.07% |  |
| 1.05-1.20 | 143 | 63.6% | 23.7% | 29.7% | 0.01% |  |
| 1.20-1.35 | 38 | 47.4% | -12.6% | -18.7% | 0.17% |  |
| 1.35-1.50 | 12 | 41.7% | -22.6% | -40.2% | -0.33% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-2.06–0.20) | 107 | 48.6% | -7.5% | -3.1% | -0.30% |  |
| 20-40% (0.21–0.56) | 108 | 58.3% | 7.7% | 13.0% | 0.11% |  |
| 40-60% (0.57–0.85) | 107 | 53.3% | -1.0% | 9.2% | -0.62% |  |
| 60-80% (0.85–1.17) | 108 | 52.8% | 3.2% | -4.8% | 0.15% |  |
| 80-95% (1.17–1.64) | 107 | 46.7% | -9.0% | -4.7% | 0.04% |  |
| 95%+ (1.65–6.68) | 108 | 47.2% | -12.7% | -6.7% | 0.03% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 34 | 35.3% | -29.3% | -30.3% | 0.23% | Broad support |
| 0.25-0.40 | 126 | 50.0% | -3.4% | -1.6% | 0.15% | Healthy support |
| 0.40-0.60 | 200 | 49.0% | -7.1% | 0.7% | -0.23% | Concentrated |
| 0.60-0.80 | 129 | 59.7% | 10.4% | 10.1% | -0.19% | Very concentrated |
| 0.80-1.00 | 156 | 51.3% | -3.7% | -0.7% | -0.13% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 71 | 39.4% | -27.9% | -29.4% | -0.14% | 4.2 |
| Broad battle | 269 | 48.7% | -5.9% | 1.2% | 0.07% | 3.9 |
| One-wallet nuke | 331 | 52.6% | -0.4% | 0.2% | -0.34% | 3.9 |
| Thin support | 523 | 53.5% | 0.9% | -0.3% | -0.29% | 3.9 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=820)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 28 | 53.6% | -2.8% | 23.3% | 0.20% | 4.2 | 89.3% |
| SMALL_MOVE | 166 | 50.0% | -6.4% | 0.7% | -0.56% | 4.1 | 100.0% |
| CLEAR_MOVE | 140 | 55.0% | 1.3% | 3.8% | 0.17% | 4.1 | 100.0% |
| NEAR_START | 319 | 50.2% | -3.3% | -4.3% | -0.00% | 3.8 | 100.0% |

**All Time** (n=1382)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 545 | 53.8% | -5.0% | -3.0% | -0.47% | 3.3 | 6.1% |
| SMALL_MOVE | 169 | 49.7% | -6.9% | -0.7% | -0.51% | 4.1 | 98.2% |
| CLEAR_MOVE | 166 | 54.8% | 1.2% | 3.4% | 0.08% | 4.1 | 100.0% |
| NEAR_START | 335 | 50.1% | -3.7% | -4.7% | 0.01% | 3.8 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 14 / 64.3% / 13.6% | 79 / 49.4% / -10.8% | 69 / 58.0% / 4.2% | 129 / 51.2% / -2.5% |
| 3.5-4★ | 9 / 33.3% / -37.5% | 54 / 57.4% / 10.7% | 41 / 46.3% / -15.0% | 83 / 51.8% / 4.0% |
| 2.5-3★ | 5 / 60.0% / 13.9% | 29 / 41.4% / -19.8% | 30 / 60.0% / 17.1% | 99 / 47.5% / -9.8% |
| 1.0-2★ | — | 4 / 25.0% / -51.2% | — | 8 / 50.0% / -8.9% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 817 | 51.7% | -2.1% | -0.0% | 4.0 | -0.19% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 867 | 51.7% | -2.3% | -0.3% | 4.0 | -0.19% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 1385 | 100% |
| LOCKED (direct) | 99 | 7.1% |
| Promoted (SHADOW→LOCKED) | 917 | 66.2% |
| Rejected (stayed SHADOW) | 196 | 14.2% |
| Superseded (side flipped) | 168 | 12.1% |
| Muted | 486 | 35.1% |
| Cancelled | 20 | 1.4% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=820)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | 1.55u | 0.1% | — |
| Flat 1.0u | -16.22u | -2.0% | +17.77u |
| Lock units only | 0.23u | — | +1.32u |
| Units change only on star change | 4.64u | — | -3.09u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 242 | 3.17 | -7.6% | -4.6% | -16.71u | Sizing hurts |
| 4.5 | 133 | 2.67 | 10.9% | 12.5% | +29.86u | Sizing helps |
| 4 | 160 | 1.27 | -8.1% | -0.2% | +12.53u | Sizing helps |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 102 | 0.81 | 1.1% | -7.3% | -7.13u | Sizing hurts |
| 2.5 | 101 | 0.57 | -2.7% | -10.7% | -3.42u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 10 | 0.50 | -7.6% | 13.6% | +1.44u | Sizing helps |

### All Time (n=1382)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -43.33u | -1.8% | — |
| Flat 1.0u | -45.74u | -3.3% | +2.41u |
| Lock units only | -33.88u | — | -9.45u |
| Units change only on star change | -39.40u | — | -3.93u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 255 | 3.14 | -7.6% | -5.0% | -20.31u | Sizing hurts |
| 4.5 | 167 | 2.66 | 6.1% | 6.8% | +19.84u | Sizing helps |
| 4 | 275 | 1.62 | -6.0% | -2.1% | +7.29u | Sizing helps |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 262 | 1.05 | -7.5% | -9.8% | -7.27u | Sizing hurts |
| 2.5 | 208 | 0.65 | -1.7% | -3.1% | -0.70u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 10 | 0.50 | -7.6% | 13.6% | +1.44u | Sizing helps |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 820 | 53.2% | 51.7% | -1.5% | -2.0% | -0.19% | Neutral |
| 4.5-5★ | 375 | 53.5% | 53.3% | -0.2% | -1.0% | -0.32% | Neutral |
| 3.5-4★ | 228 | 52.4% | 49.1% | -3.3% | -4.2% | -0.12% | Below market |
| 2.5-3★ | 205 | 53.3% | 52.2% | -1.1% | 0.1% | -0.04% | Neutral |
| CLEAR_MOVE only | 140 | 54.2% | 55.0% | +0.8% | 1.3% | 0.17% | Neutral |
| NO_MOVE only | 28 | 54.6% | 53.6% | -1.0% | -2.8% | 0.20% | Neutral |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=59)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 44.863 | 36.111 | 0.48 |  |
| Rank_norm | 53.927 | 38.152 | 0.64 |  |
| PnL_norm | 49.682 | 40.102 | 0.50 |  |
| WalletBase | 47.311 | 38.246 | 0.71 |  |
| SizeRatio | 1.320 | 1.024 | 0.23 |  |
| ConvictionMult | 0.946 | 0.897 | 0.30 |  |
| WalletCountFor | 2.840 | 2.407 | 0.24 |  |
| TopShare | 0.606 | 0.654 | 0.19 |  |
| ForSide | 139.060 | 87.961 | 0.47 |  |
| AgainstSide | 49.993 | 38.990 | 0.14 |  |
| NetEdge | 0.966 | 0.548 | 0.48 |  |
| WalletPlayScore | 0.863 | 0.090 | 0.33 |  |

### V8 Era (n=645)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 44.863 | 43.300 | 0.08 |  |
| Rank_norm | 53.927 | 60.298 | 0.26 |  |
| PnL_norm | 49.682 | 52.743 | 0.16 |  |
| WalletBase | 47.311 | 47.344 | 0.00 |  |
| SizeRatio | 1.320 | 1.364 | 0.03 |  |
| ConvictionMult | 0.946 | 0.959 | 0.08 |  |
| WalletCountFor | 2.840 | 2.840 | 0.00 |  |
| TopShare | 0.606 | 0.606 | 0.00 |  |
| ForSide | 139.060 | 139.060 | 0.00 |  |
| AgainstSide | 49.993 | 49.993 | 0.00 |  |
| NetEdge | 0.966 | 0.966 | 0.00 |  |
| WalletPlayScore | 0.863 | 0.863 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=820)

No major failure modes detected.

### 7-Day (n=106)

- **Ranking issue**: ≤3★ WR (59%) beats ≥4★ (51%)

### All Time (n=1382)

No major failure modes detected.


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
| V8 era picks | 820 |
| V8 flat ROI | -2.0% |
| V8 model ROI | 0.1% |
| V8 star monotonicity score | 0.14 |
| 4.5-5★ ROI | -1.0% |
| 2.5-3★ ROI | 0.1% |
| CLEAR_MOVE ROI | 1.3% |
| NO_MOVE ROI | -2.8% |
| Single-wallet play rate | 38.3% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: -0.11% | 4.5★: -0.70% | 4★: -0.14% | 3.5★: -0.07% | 3★: 0.07% | 2.5★: -0.13% | 2★: 0.67% | 1★: -0.01% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=820)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 734 | 89.5% | 51.2% | -2.4% | -1.5% | -0.20% |
| MUTED | 75 | 9.1% | 56.0% | 2.2% | 20.8% | -0.11% |
| CANCELLED | 11 | 1.3% | 54.5% | -2.8% | -10.4% | 0.16% |

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

### 7-Day (n=106)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 106 | 100.0% | 52.8% | -2.8% | -0.8% | -0.36% |

### All Time (n=1382)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 1294 | 93.6% | 52.2% | -3.8% | -3.0% | -0.29% |
| MUTED | 75 | 5.4% | 56.0% | 2.2% | 20.8% | -0.11% |
| CANCELLED | 13 | 0.9% | 61.5% | 17.8% | 4.8% | -0.95% |

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
