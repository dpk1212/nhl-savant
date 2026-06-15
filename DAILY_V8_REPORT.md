# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-06-15 ET
**Completed Picks**: 1289 | **V8 Era Picks**: 727 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (61.4%) beats 5★ (49.3%) |
| Single-wallet dependency | ⚠️ | 35% of picks are single-wallet (WR: 54.7%, ROI: 4.1%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 49 | 55.1% | 1.83u | 3.7% | -8.20u | -8.2% | 0.06% | -0.79% | Strong |
| 7-Day | 116 | 50.9% | -1.59u | -1.4% | 4.67u | 1.9% | -0.49% | -0.20% |  |
| 14-Day | 223 | 53.4% | 5.84u | 2.6% | 19.68u | 4.3% | -0.36% | 0.13% |  |
| 30-Day | 463 | 52.5% | -4.21u | -0.9% | -3.00u | -0.3% | -0.22% | -0.44% |  |
| V8 Era | 727 | 51.4% | -15.40u | -2.1% | -12.75u | -1.0% | -0.16% | -0.42% |  |
| All Time | 1289 | 52.4% | -44.91u | -3.5% | -57.63u | -2.6% | -0.27% | -0.16% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=727)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 225 | 53.5% | 53.5% | 49.3% | -4.2% | -9.3% | -4.8% | 3.07 | -0.02% | Weak |
| 4.5 | 101 | 53.1% | 53.1% | 61.4% | +8.3% | 16.9% | 12.3% | 2.66 | -0.87% | Strong |
| 4 | 142 | 53.0% | 53.0% | 47.9% | -5.1% | -8.3% | -2.7% | 1.30 | -0.04% | Weak |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 88 | 53.6% | 53.6% | 53.4% | -0.2% | 2.9% | -8.6% | 0.86 | 0.11% | Fair |
| 2.5 | 89 | 53.5% | 53.5% | 49.4% | -4.0% | -5.2% | -11.3% | 0.61 | -0.21% | Weak |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 10 | 53.9% | 53.9% | 50.0% | -3.9% | -7.6% | 13.6% | 0.50 | -0.01% | Weak |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 49.3% | 61.4% | -12.1% | INVERTED |
| 4.5★ vs 4★ | 61.4% | 47.9% | +13.5% | Correct |
| 4★ vs 3.5★ | 47.9% | 51.5% | -3.6% | INVERTED |
| 3.5★ vs 3★ | 51.5% | 53.4% | -1.9% | Flat |
| 3★ vs 2.5★ | 53.4% | 49.4% | +4.0% | Correct |
| 2.5★ vs 2★ | 49.4% | 0.0% | +49.4% | Correct |
| 2★ vs 1★ | 0.0% | 50.0% | -50.0% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.167 |
| Spearman: Stars vs Flat ROI | 0.190 |
| Spearman: Stars vs CLV | -0.476 |
| Brier Score | 0.2480 |
| Monotonicity Score | 0.14 |

### All Time (n=1289)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 238 | 53.8% | 53.8% | 49.6% | -4.2% | -9.3% | -5.2% | 3.05 | 0.03% | Weak |
| 4.5 | 135 | 54.2% | 54.2% | 58.5% | +4.3% | 9.6% | 5.3% | 2.65 | -0.34% | Strong |
| 4 | 257 | 54.3% | 54.3% | 50.6% | -3.7% | -6.0% | -3.2% | 1.67 | -0.33% | Weak |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 248 | 54.6% | 54.6% | 50.4% | -4.2% | -7.3% | -10.2% | 1.08 | -0.32% | Weak |
| 2.5 | 196 | 54.0% | 54.0% | 52.6% | -1.5% | -2.7% | -3.2% | 0.68 | -0.53% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 10 | 53.9% | 53.9% | 50.0% | -3.9% | -7.6% | 13.6% | 0.50 | -0.01% | Weak |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 49.6% | 58.5% | -8.9% | INVERTED |
| 4.5★ vs 4★ | 58.5% | 50.6% | +7.9% | Correct |
| 4★ vs 3.5★ | 50.6% | 56.5% | -5.9% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 50.4% | +6.1% | Correct |
| 3★ vs 2.5★ | 50.4% | 52.6% | -2.2% | Flat |
| 2.5★ vs 2★ | 52.6% | 0.0% | +52.6% | Correct |
| 2★ vs 1★ | 0.0% | 50.0% | -50.0% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.333 |
| Spearman: Stars vs Flat ROI | 0.333 |
| Spearman: Stars vs CLV | -0.190 |
| Brier Score | 0.2390 |
| Monotonicity Score | 0.14 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.096 | -0.020 | Tune |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.179 | -0.121 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.090 | -0.054 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.134 | -0.049 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | -0.056 | -0.009 | Tune |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | -0.025 | 0.018 | Monitor |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | -0.134 | -0.039 | Tune |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.191 | -0.091 | Tune |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.002 | 0.039 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.157 | -0.086 | Tune |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | -0.026 | -0.006 | Monitor |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.201 | 0.112 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.205 | 0.117 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.179 | -0.096 | Tune |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (11.60–35.50) | 119 | 54.6% | -1.7% | -1.1% | -0.06% |  |
| p20-40 (35.52–42.98) | 120 | 56.7% | 10.5% | 11.2% | -0.21% |  |
| p40-60 (43.00–48.26) | 120 | 50.8% | -4.2% | -0.7% | -0.45% |  |
| p60-80 (48.41–54.42) | 120 | 45.8% | -12.9% | -6.8% | 0.18% |  |
| p80-95 (54.47–61.87) | 120 | 48.3% | -2.8% | -10.8% | -0.06% |  |
| p95+ (61.97–83.30) | 120 | 51.7% | -2.5% | -1.5% | -0.35% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 279 | 48.0% | -9.0% | -8.8% | -0.38% |  |
| 0.90-1.05 | 246 | 49.6% | -6.4% | -5.5% | -0.01% |  |
| 1.05-1.20 | 136 | 62.5% | 22.4% | 27.4% | 0.03% |  |
| 1.20-1.35 | 37 | 48.6% | -10.2% | -19.4% | 0.15% |  |
| 1.35-1.50 | 11 | 45.5% | -15.6% | -42.1% | -0.34% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-2.06–0.24) | 98 | 51.0% | -4.4% | -3.6% | -0.24% |  |
| 20-40% (0.24–0.62) | 99 | 61.6% | 15.0% | 19.9% | 0.11% |  |
| 40-60% (0.62–0.89) | 99 | 47.5% | -10.4% | -0.4% | -0.70% |  |
| 60-80% (0.89–1.21) | 99 | 53.5% | 4.7% | -5.9% | 0.13% |  |
| 80-95% (1.21–1.67) | 99 | 46.5% | -9.0% | -6.0% | 0.06% |  |
| 95%+ (1.67–6.68) | 99 | 44.4% | -16.9% | -11.6% | 0.03% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 33 | 33.3% | -32.0% | -33.9% | 0.17% | Broad support |
| 0.25-0.40 | 117 | 47.9% | -6.4% | -9.4% | 0.22% | Healthy support |
| 0.40-0.60 | 181 | 48.6% | -7.4% | -0.5% | -0.29% | Concentrated |
| 0.60-0.80 | 124 | 59.7% | 10.5% | 11.0% | -0.22% | Very concentrated |
| 0.80-1.00 | 138 | 52.2% | -1.7% | -0.8% | -0.09% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 65 | 36.9% | -31.4% | -34.1% | -0.13% | 4.2 |
| Broad battle | 249 | 48.6% | -5.8% | -1.0% | 0.07% | 3.9 |
| One-wallet nuke | 272 | 53.3% | 1.1% | 1.4% | -0.24% | 3.9 |
| Thin support | 447 | 54.4% | 2.5% | 1.2% | -0.25% | 3.9 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=727)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 26 | 53.8% | -2.1% | 19.8% | 0.31% | 4.2 | 88.5% |
| SMALL_MOVE | 154 | 50.0% | -5.7% | -0.9% | -0.66% | 4.1 | 100.0% |
| CLEAR_MOVE | 137 | 54.0% | -0.3% | 2.8% | 0.17% | 4.1 | 100.0% |
| NEAR_START | 284 | 49.6% | -3.6% | -7.3% | 0.04% | 3.8 | 100.0% |

**All Time** (n=1289)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 543 | 53.8% | -5.0% | -3.3% | -0.46% | 3.3 | 5.7% |
| SMALL_MOVE | 157 | 49.7% | -6.3% | -2.3% | -0.61% | 4.1 | 98.1% |
| CLEAR_MOVE | 163 | 54.0% | -0.2% | 2.6% | 0.08% | 4.1 | 100.0% |
| NEAR_START | 300 | 49.7% | -4.1% | -7.6% | 0.05% | 3.8 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 14 / 64.3% / 13.6% | 75 / 50.7% / -8.2% | 68 / 57.4% / 2.9% | 110 / 49.1% / -5.4% |
| 3.5-4★ | 8 / 37.5% / -29.6% | 51 / 54.9% / 7.0% | 40 / 45.0% / -16.6% | 78 / 53.8% / 8.7% |
| 2.5-3★ | 4 / 50.0% / -1.6% | 24 / 41.7% / -17.5% | 29 / 58.6% / 14.7% | 88 / 46.6% / -11.8% |
| 1.0-2★ | — | 4 / 25.0% / -51.2% | — | 8 / 50.0% / -8.9% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 724 | 51.4% | -2.3% | -1.1% | 4.0 | -0.16% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 774 | 51.4% | -2.5% | -1.3% | 4.0 | -0.16% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 1198 | 100% |
| LOCKED (direct) | 96 | 8.0% |
| Promoted (SHADOW→LOCKED) | 779 | 65.0% |
| Rejected (stayed SHADOW) | 189 | 15.8% |
| Superseded (side flipped) | 129 | 10.8% |
| Muted | 430 | 35.9% |
| Cancelled | 20 | 1.7% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=727)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -12.75u | -1.0% | — |
| Flat 1.0u | -15.40u | -2.1% | +2.65u |
| Lock units only | -0.43u | — | -12.32u |
| Units change only on star change | 3.98u | — | -16.73u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 225 | 3.07 | -9.3% | -4.8% | -12.34u | Sizing hurts |
| 4.5 | 101 | 2.66 | 16.9% | 12.3% | +16.08u | Sizing helps |
| 4 | 142 | 1.30 | -8.3% | -2.7% | +6.89u | Sizing helps |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 88 | 0.86 | 2.9% | -8.6% | -9.06u | Sizing hurts |
| 2.5 | 89 | 0.61 | -5.2% | -11.3% | -1.57u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 10 | 0.50 | -7.6% | 13.6% | +1.44u | Sizing helps |

### All Time (n=1289)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -57.63u | -2.6% | — |
| Flat 1.0u | -44.91u | -3.5% | -12.72u |
| Lock units only | -34.54u | — | -23.09u |
| Units change only on star change | -40.06u | — | -17.57u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 238 | 3.05 | -9.3% | -5.2% | -15.93u | Sizing hurts |
| 4.5 | 135 | 2.65 | 9.6% | 5.3% | +6.07u | Sizing helps |
| 4 | 257 | 1.67 | -6.0% | -3.2% | +1.65u | Sizing helps |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 248 | 1.08 | -7.3% | -10.2% | -9.21u | Sizing hurts |
| 2.5 | 196 | 0.68 | -2.7% | -3.2% | +1.14u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 10 | 0.50 | -7.6% | 13.6% | +1.44u | Sizing helps |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 727 | 53.1% | 51.4% | -1.7% | -2.1% | -0.16% | Neutral |
| 4.5-5★ | 326 | 53.4% | 53.1% | -0.3% | -1.2% | -0.29% | Neutral |
| 3.5-4★ | 210 | 52.4% | 49.0% | -3.4% | -4.1% | -0.05% | Below market |
| 2.5-3★ | 179 | 53.5% | 52.0% | -1.6% | -0.2% | -0.06% | Neutral |
| CLEAR_MOVE only | 137 | 54.1% | 54.0% | -0.1% | -0.3% | 0.17% | Neutral |
| NO_MOVE only | 26 | 54.6% | 53.8% | -0.7% | -2.1% | 0.31% | Neutral |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=70)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 45.572 | 44.396 | 0.06 |  |
| Rank_norm | 56.791 | 55.433 | 0.06 |  |
| PnL_norm | 51.197 | 50.663 | 0.03 |  |
| WalletBase | 48.330 | 46.414 | 0.15 |  |
| SizeRatio | 1.363 | 1.104 | 0.20 |  |
| ConvictionMult | 0.956 | 0.925 | 0.19 |  |
| WalletCountFor | 2.884 | 2.557 | 0.18 |  |
| TopShare | 0.601 | 0.663 | 0.24 |  |
| ForSide | 143.744 | 114.257 | 0.26 |  |
| AgainstSide | 50.973 | 61.216 | 0.13 |  |
| NetEdge | 1.004 | 0.622 | 0.44 |  |
| WalletPlayScore | 0.939 | 0.137 | 0.34 |  |

### V8 Era (n=593)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 45.572 | 43.878 | 0.09 |  |
| Rank_norm | 56.791 | 62.469 | 0.25 |  |
| PnL_norm | 51.197 | 53.904 | 0.15 |  |
| WalletBase | 48.330 | 48.127 | 0.02 |  |
| SizeRatio | 1.363 | 1.395 | 0.02 |  |
| ConvictionMult | 0.956 | 0.965 | 0.06 |  |
| WalletCountFor | 2.884 | 2.884 | 0.00 |  |
| TopShare | 0.601 | 0.601 | 0.00 |  |
| ForSide | 143.744 | 143.744 | 0.00 |  |
| AgainstSide | 50.973 | 50.973 | 0.00 |  |
| NetEdge | 1.004 | 1.004 | 0.00 |  |
| WalletPlayScore | 0.939 | 0.939 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=727)

No major failure modes detected.

### 7-Day (n=116)

- **Ranking issue**: ≤3★ WR (58%) beats ≥4★ (49%)

### All Time (n=1289)

- **Sizing issue**: Model P/L (-57.63u) trails flat (-44.91u) by 12.72u
- **Environment issue**: 42.1% NO_MOVE (WR: 53.8%, ROI: -5.0%)


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
| V8 era picks | 727 |
| V8 flat ROI | -2.1% |
| V8 model ROI | -1.0% |
| V8 star monotonicity score | 0.14 |
| 4.5-5★ ROI | -1.2% |
| 2.5-3★ ROI | -0.2% |
| CLEAR_MOVE ROI | -0.3% |
| NO_MOVE ROI | -2.1% |
| Single-wallet play rate | 35.2% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: -0.02% | 4.5★: -0.87% | 4★: -0.04% | 3.5★: -0.07% | 3★: 0.11% | 2.5★: -0.21% | 2★: 0.67% | 1★: -0.01% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=727)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 641 | 88.2% | 50.9% | -2.6% | -2.9% | -0.17% |
| MUTED | 75 | 10.3% | 56.0% | 2.2% | 20.8% | -0.11% |
| CANCELLED | 11 | 1.5% | 54.5% | -2.8% | -10.4% | 0.16% |

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

### 7-Day (n=116)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 116 | 100.0% | 50.9% | -1.4% | 1.9% | -0.49% |

### All Time (n=1289)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 1201 | 93.2% | 52.0% | -4.1% | -4.0% | -0.28% |
| MUTED | 75 | 5.8% | 56.0% | 2.2% | 20.8% | -0.11% |
| CANCELLED | 13 | 1.0% | 61.5% | 17.8% | 4.8% | -0.95% |

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
