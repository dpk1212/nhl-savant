# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-06-18 ET
**Completed Picks**: 1342 | **V8 Era Picks**: 780 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (59.6%) beats 5★ (49.6%) |
| Single-wallet dependency | ⚠️ | 37% of picks are single-wallet (WR: 54.0%, ROI: 2.8%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 53 | 49.1% | -5.25u | -9.9% | 6.18u | 6.0% | -0.69% | -0.87% |  |
| 7-Day | 111 | 51.4% | -5.15u | -4.6% | -3.19u | -1.5% | -0.29% | -0.81% |  |
| 14-Day | 239 | 52.7% | -0.25u | -0.1% | 20.95u | 4.3% | -0.45% | 0.27% |  |
| 30-Day | 491 | 52.1% | -10.41u | -2.1% | 4.57u | 0.5% | -0.30% | -0.44% |  |
| V8 Era | 780 | 51.3% | -20.65u | -2.6% | -6.57u | -0.5% | -0.19% | -0.43% |  |
| All Time | 1342 | 52.2% | -50.17u | -3.7% | -51.45u | -2.2% | -0.29% | -0.17% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=780)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 236 | 53.6% | 53.6% | 49.6% | -4.0% | -8.9% | -4.6% | 3.14 | -0.07% | Weak |
| 4.5 | 114 | 53.3% | 53.3% | 59.6% | +6.4% | 13.0% | 13.1% | 2.66 | -0.87% | Strong |
| 4 | 155 | 52.9% | 52.9% | 47.7% | -5.1% | -8.4% | -2.5% | 1.27 | -0.12% | Weak |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 96 | 53.6% | 53.6% | 52.1% | -1.6% | -0.5% | -7.5% | 0.83 | 0.09% | Fair |
| 2.5 | 97 | 53.5% | 53.5% | 50.5% | -3.0% | -3.4% | -10.9% | 0.58 | -0.19% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 10 | 53.9% | 53.9% | 50.0% | -3.9% | -7.6% | 13.6% | 0.50 | -0.01% | Weak |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 49.6% | 59.6% | -10.0% | INVERTED |
| 4.5★ vs 4★ | 59.6% | 47.7% | +11.9% | Correct |
| 4★ vs 3.5★ | 47.7% | 51.5% | -3.8% | INVERTED |
| 3.5★ vs 3★ | 51.5% | 52.1% | -0.6% | Flat |
| 3★ vs 2.5★ | 52.1% | 50.5% | +1.6% | Correct |
| 2.5★ vs 2★ | 50.5% | 0.0% | +50.5% | Correct |
| 2★ vs 1★ | 0.0% | 50.0% | -50.0% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.214 |
| Spearman: Stars vs Flat ROI | 0.190 |
| Spearman: Stars vs CLV | -0.571 |
| Brier Score | 0.2475 |
| Monotonicity Score | 0.14 |

### All Time (n=1342)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 249 | 53.8% | 53.8% | 49.8% | -4.0% | -8.9% | -5.0% | 3.12 | -0.02% | Weak |
| 4.5 | 148 | 54.3% | 54.3% | 57.4% | +3.1% | 7.1% | 6.5% | 2.65 | -0.39% | Strong |
| 4 | 270 | 54.2% | 54.2% | 50.4% | -3.8% | -6.2% | -3.1% | 1.64 | -0.36% | Weak |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 256 | 54.6% | 54.6% | 50.0% | -4.6% | -8.3% | -9.9% | 1.06 | -0.31% | Weak |
| 2.5 | 204 | 54.0% | 54.0% | 52.9% | -1.1% | -2.0% | -3.1% | 0.66 | -0.50% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 10 | 53.9% | 53.9% | 50.0% | -3.9% | -7.6% | 13.6% | 0.50 | -0.01% | Weak |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 49.8% | 57.4% | -7.6% | INVERTED |
| 4.5★ vs 4★ | 57.4% | 50.4% | +7.0% | Correct |
| 4★ vs 3.5★ | 50.4% | 56.5% | -6.1% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 50.0% | +6.5% | Correct |
| 3★ vs 2.5★ | 50.0% | 52.9% | -2.9% | Flat |
| 2.5★ vs 2★ | 52.9% | 0.0% | +52.9% | Correct |
| 2★ vs 1★ | 0.0% | 50.0% | -50.0% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.262 |
| Spearman: Stars vs Flat ROI | 0.262 |
| Spearman: Stars vs CLV | -0.357 |
| Brier Score | 0.2391 |
| Monotonicity Score | 0.14 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.087 | -0.011 | Tune |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.180 | -0.119 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.091 | -0.054 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.133 | -0.044 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | -0.064 | -0.017 | Tune |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | -0.033 | 0.012 | Monitor |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | -0.136 | -0.040 | Tune |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.179 | -0.086 | Tune |
| AgainstSide | Opposition | Force against side | Higher → worse | -0.007 | 0.032 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.141 | -0.076 | Tune |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | -0.020 | -0.007 | Monitor |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.194 | 0.112 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.198 | 0.118 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.165 | -0.092 | Tune |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (11.60–35.00) | 128 | 50.8% | -8.6% | -5.2% | -0.06% |  |
| p20-40 (35.20–41.83) | 129 | 58.9% | 11.8% | 13.1% | -0.09% |  |
| p40-60 (41.83–47.43) | 129 | 48.8% | -6.5% | -0.1% | -0.81% |  |
| p60-80 (47.45–53.15) | 128 | 47.7% | -10.4% | -8.1% | 0.13% |  |
| p80-95 (53.18–61.30) | 129 | 49.6% | 0.4% | -7.1% | -0.06% |  |
| p95+ (61.33–83.30) | 129 | 51.2% | -3.4% | -0.3% | -0.30% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 306 | 47.7% | -9.7% | -8.8% | -0.42% |  |
| 0.90-1.05 | 263 | 49.4% | -6.9% | -4.9% | -0.06% |  |
| 1.05-1.20 | 141 | 63.1% | 23.1% | 28.9% | 0.01% |  |
| 1.20-1.35 | 38 | 47.4% | -12.6% | -18.7% | 0.17% |  |
| 1.35-1.50 | 12 | 41.7% | -22.6% | -40.2% | -0.33% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-2.06–0.20) | 104 | 47.1% | -10.6% | -4.6% | -0.31% |  |
| 20-40% (0.21–0.57) | 105 | 61.0% | 12.0% | 19.4% | 0.09% |  |
| 40-60% (0.58–0.86) | 104 | 51.0% | -4.3% | 4.7% | -0.58% |  |
| 60-80% (0.86–1.18) | 105 | 53.3% | 4.0% | -7.1% | 0.06% |  |
| 80-95% (1.19–1.65) | 104 | 46.2% | -9.9% | -4.5% | 0.05% |  |
| 95%+ (1.65–6.68) | 105 | 45.7% | -15.1% | -9.3% | 0.01% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 34 | 35.3% | -29.3% | -30.3% | 0.23% | Broad support |
| 0.25-0.40 | 122 | 48.4% | -6.2% | -5.6% | 0.14% | Healthy support |
| 0.40-0.60 | 189 | 48.1% | -8.7% | 0.1% | -0.26% | Concentrated |
| 0.60-0.80 | 129 | 59.7% | 10.4% | 10.1% | -0.19% | Very concentrated |
| 0.80-1.00 | 153 | 51.6% | -3.0% | -0.7% | -0.14% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 69 | 37.7% | -30.4% | -31.8% | -0.18% | 4.2 |
| Broad battle | 256 | 48.4% | -6.4% | 0.0% | 0.05% | 3.8 |
| One-wallet nuke | 306 | 52.6% | -0.1% | 0.5% | -0.33% | 3.9 |
| Thin support | 491 | 53.6% | 1.0% | 0.5% | -0.29% | 3.9 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=780)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 28 | 53.6% | -2.8% | 23.3% | 0.20% | 4.2 | 89.3% |
| SMALL_MOVE | 164 | 50.0% | -6.4% | -0.1% | -0.59% | 4.1 | 100.0% |
| CLEAR_MOVE | 138 | 54.3% | 0.1% | 2.8% | 0.18% | 4.1 | 100.0% |
| NEAR_START | 305 | 49.5% | -4.3% | -5.6% | -0.01% | 3.8 | 100.0% |

**All Time** (n=1342)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 545 | 53.8% | -5.0% | -3.0% | -0.47% | 3.3 | 6.1% |
| SMALL_MOVE | 167 | 49.7% | -6.9% | -1.5% | -0.54% | 4.1 | 98.2% |
| CLEAR_MOVE | 164 | 54.3% | 0.1% | 2.6% | 0.09% | 4.1 | 100.0% |
| NEAR_START | 321 | 49.5% | -4.7% | -5.9% | 0.01% | 3.8 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 14 / 64.3% / 13.6% | 78 / 50.0% / -9.7% | 68 / 57.4% / 2.9% | 118 / 50.0% / -4.1% |
| 3.5-4★ | 9 / 33.3% / -37.5% | 53 / 56.6% / 9.2% | 41 / 46.3% / -15.0% | 81 / 51.9% / 4.6% |
| 2.5-3★ | 5 / 60.0% / 13.9% | 29 / 41.4% / -19.8% | 29 / 58.6% / 14.7% | 98 / 46.9% / -11.5% |
| 1.0-2★ | — | 4 / 25.0% / -51.2% | — | 8 / 50.0% / -8.9% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 777 | 51.2% | -2.8% | -0.6% | 4.0 | -0.20% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 827 | 51.3% | -2.9% | -0.8% | 4.0 | -0.19% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 1294 | 100% |
| LOCKED (direct) | 98 | 7.6% |
| Promoted (SHADOW→LOCKED) | 846 | 65.4% |
| Rejected (stayed SHADOW) | 191 | 14.8% |
| Superseded (side flipped) | 154 | 11.9% |
| Muted | 466 | 36.0% |
| Cancelled | 20 | 1.5% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=780)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -6.57u | -0.5% | — |
| Flat 1.0u | -20.65u | -2.6% | +14.08u |
| Lock units only | -11.41u | — | +4.84u |
| Units change only on star change | -7.00u | — | +0.43u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 236 | 3.14 | -8.9% | -4.6% | -13.32u | Sizing hurts |
| 4.5 | 114 | 2.66 | 13.0% | 13.1% | +25.14u | Sizing helps |
| 4 | 155 | 1.27 | -8.4% | -2.5% | +8.09u | Sizing helps |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 96 | 0.83 | -0.5% | -7.5% | -5.54u | Sizing hurts |
| 2.5 | 97 | 0.58 | -3.4% | -10.9% | -2.93u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 10 | 0.50 | -7.6% | 13.6% | +1.44u | Sizing helps |

### All Time (n=1342)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -51.45u | -2.2% | — |
| Flat 1.0u | -50.17u | -3.7% | -1.28u |
| Lock units only | -45.52u | — | -5.93u |
| Units change only on star change | -51.04u | — | -0.41u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 249 | 3.12 | -8.9% | -5.0% | -16.91u | Sizing hurts |
| 4.5 | 148 | 2.65 | 7.1% | 6.5% | +15.12u | Sizing helps |
| 4 | 270 | 1.64 | -6.2% | -3.1% | +2.85u | Sizing helps |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 256 | 1.06 | -8.3% | -9.9% | -5.69u | Sizing hurts |
| 2.5 | 204 | 0.66 | -2.0% | -3.1% | -0.21u | Neutral |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 10 | 0.50 | -7.6% | 13.6% | +1.44u | Sizing helps |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 780 | 53.2% | 51.3% | -1.9% | -2.6% | -0.19% | Neutral |
| 4.5-5★ | 350 | 53.5% | 52.9% | -0.6% | -1.8% | -0.33% | Neutral |
| 3.5-4★ | 223 | 52.4% | 48.9% | -3.5% | -4.4% | -0.11% | Below market |
| 2.5-3★ | 195 | 53.6% | 51.8% | -1.8% | -1.0% | -0.06% | Neutral |
| CLEAR_MOVE only | 138 | 54.2% | 54.3% | +0.1% | 0.1% | 0.18% | Neutral |
| NO_MOVE only | 28 | 54.6% | 53.6% | -1.0% | -2.8% | 0.20% | Neutral |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=68)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 45.067 | 40.348 | 0.26 |  |
| Rank_norm | 55.143 | 47.158 | 0.34 |  |
| PnL_norm | 50.318 | 45.346 | 0.26 |  |
| WalletBase | 47.684 | 42.610 | 0.39 |  |
| SizeRatio | 1.353 | 1.136 | 0.16 |  |
| ConvictionMult | 0.951 | 0.913 | 0.24 |  |
| WalletCountFor | 2.848 | 2.324 | 0.29 |  |
| TopShare | 0.607 | 0.679 | 0.28 |  |
| ForSide | 140.416 | 94.834 | 0.41 |  |
| AgainstSide | 50.151 | 44.575 | 0.07 |  |
| NetEdge | 0.978 | 0.569 | 0.47 |  |
| WalletPlayScore | 0.874 | -0.045 | 0.38 |  |

### V8 Era (n=627)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 45.067 | 43.300 | 0.10 |  |
| Rank_norm | 55.143 | 61.141 | 0.25 |  |
| PnL_norm | 50.318 | 53.338 | 0.16 |  |
| WalletBase | 47.684 | 47.552 | 0.01 |  |
| SizeRatio | 1.353 | 1.379 | 0.02 |  |
| ConvictionMult | 0.951 | 0.961 | 0.06 |  |
| WalletCountFor | 2.848 | 2.848 | 0.00 |  |
| TopShare | 0.607 | 0.607 | 0.00 |  |
| ForSide | 140.416 | 140.416 | 0.00 |  |
| AgainstSide | 50.151 | 50.151 | 0.00 |  |
| NetEdge | 0.978 | 0.978 | 0.00 |  |
| WalletPlayScore | 0.874 | 0.874 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=780)

No major failure modes detected.

### 7-Day (n=111)

- **Ranking issue**: ≤3★ WR (61%) beats ≥4★ (48%)

### All Time (n=1342)

- **Sizing issue**: Model P/L (-51.45u) trails flat (-50.17u) by 1.28u
- **Environment issue**: 40.6% NO_MOVE (WR: 53.8%, ROI: -5.0%)


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
| V8 era picks | 780 |
| V8 flat ROI | -2.6% |
| V8 model ROI | -0.5% |
| V8 star monotonicity score | 0.14 |
| 4.5-5★ ROI | -1.8% |
| 2.5-3★ ROI | -1.0% |
| CLEAR_MOVE ROI | 0.1% |
| NO_MOVE ROI | -2.8% |
| Single-wallet play rate | 37.1% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: -0.07% | 4.5★: -0.87% | 4★: -0.12% | 3.5★: -0.07% | 3★: 0.09% | 2.5★: -0.19% | 2★: 0.67% | 1★: -0.01% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=780)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 694 | 89.0% | 50.7% | -3.2% | -2.2% | -0.21% |
| MUTED | 75 | 9.6% | 56.0% | 2.2% | 20.8% | -0.11% |
| CANCELLED | 11 | 1.4% | 54.5% | -2.8% | -10.4% | 0.16% |

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
| ACTIVE | 111 | 100.0% | 51.4% | -4.6% | -1.5% | -0.29% |

### All Time (n=1342)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 1254 | 93.4% | 51.9% | -4.3% | -3.5% | -0.30% |
| MUTED | 75 | 5.6% | 56.0% | 2.2% | 20.8% | -0.11% |
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
