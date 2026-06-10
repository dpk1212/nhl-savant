# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-06-10 ET
**Completed Picks**: 1206 | **V8 Era Picks**: 644 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (67.1%) beats 5★ (49.8%) |
| Single-wallet dependency | ⚠️ | 32% of picks are single-wallet (WR: 57.1%, ROI: 7.7%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 58 | 55.2% | 4.31u | 7.4% | 27.65u | 23.2% | -0.97% | 9.46% | Strong |
| 7-Day | 122 | 56.6% | 9.66u | 7.9% | 35.02u | 14.0% | -0.63% | 2.69% | Strong |
| 14-Day | 223 | 52.9% | 0.33u | 0.1% | 31.94u | 7.2% | -0.48% | 0.07% |  |
| 30-Day | 423 | 52.5% | -6.70u | -1.6% | 4.43u | 0.5% | -0.20% | -0.23% |  |
| V8 Era | 644 | 51.6% | -12.95u | -2.0% | 6.68u | 0.6% | -0.17% | -0.31% |  |
| All Time | 1206 | 52.5% | -42.47u | -3.5% | -38.20u | -1.9% | -0.29% | -0.11% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=644)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 205 | 53.6% | 53.6% | 49.8% | -3.8% | -9.1% | -4.2% | 2.96 | -0.05% | Weak |
| 4.5 | 82 | 53.3% | 53.3% | 67.1% | +13.8% | 27.5% | 22.5% | 2.61 | -1.11% | Strong |
| 4 | 118 | 53.3% | 53.3% | 46.6% | -6.6% | -11.3% | -4.5% | 1.37 | 0.01% | Weak |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 81 | 53.4% | 53.4% | 51.9% | -1.6% | 1.1% | -10.2% | 0.89 | 0.13% | Fair |
| 2.5 | 77 | 53.4% | 53.4% | 48.1% | -5.3% | -7.4% | -12.9% | 0.67 | -0.21% | Weak |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 9 | 54.3% | 54.3% | 44.4% | -9.9% | -19.3% | 14.3% | 0.53 | -0.01% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 49.8% | 67.1% | -17.3% | INVERTED |
| 4.5★ vs 4★ | 67.1% | 46.6% | +20.5% | Correct |
| 4★ vs 3.5★ | 46.6% | 51.5% | -4.9% | INVERTED |
| 3.5★ vs 3★ | 51.5% | 51.9% | -0.4% | Flat |
| 3★ vs 2.5★ | 51.9% | 48.1% | +3.8% | Correct |
| 2.5★ vs 2★ | 48.1% | 0.0% | +48.1% | Correct |
| 2★ vs 1★ | 0.0% | 44.4% | -44.4% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.619 |
| Spearman: Stars vs Flat ROI | 0.524 |
| Spearman: Stars vs CLV | -0.405 |
| Brier Score | 0.2474 |
| Monotonicity Score | 0.14 |

### All Time (n=1206)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 218 | 53.9% | 53.9% | 50.0% | -3.9% | -9.1% | -4.7% | 2.94 | 0.01% | Weak |
| 4.5 | 116 | 54.6% | 54.6% | 62.1% | +7.5% | 15.8% | 11.2% | 2.61 | -0.43% | Strong |
| 4 | 233 | 54.6% | 54.6% | 50.2% | -4.4% | -7.3% | -4.0% | 1.74 | -0.33% | Weak |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 241 | 54.6% | 54.6% | 49.8% | -4.8% | -8.2% | -10.7% | 1.10 | -0.32% | Weak |
| 2.5 | 184 | 54.0% | 54.0% | 52.2% | -1.8% | -3.5% | -3.6% | 0.71 | -0.55% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 9 | 54.3% | 54.3% | 44.4% | -9.9% | -19.3% | 14.3% | 0.53 | -0.01% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 50.0% | 62.1% | -12.1% | INVERTED |
| 4.5★ vs 4★ | 62.1% | 50.2% | +11.9% | Correct |
| 4★ vs 3.5★ | 50.2% | 56.5% | -6.3% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 49.8% | +6.7% | Correct |
| 3★ vs 2.5★ | 49.8% | 52.2% | -2.4% | Flat |
| 2.5★ vs 2★ | 52.2% | 0.0% | +52.2% | Correct |
| 2★ vs 1★ | 0.0% | 44.4% | -44.4% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.595 |
| Spearman: Stars vs Flat ROI | 0.500 |
| Spearman: Stars vs CLV | -0.190 |
| Brier Score | 0.2381 |
| Monotonicity Score | 0.14 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.141 | -0.041 | Tune |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.175 | -0.118 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.076 | -0.048 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.167 | -0.066 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | -0.038 | 0.006 | Monitor |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | -0.004 | 0.035 | Monitor |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | -0.147 | -0.042 | Tune |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.195 | -0.086 | Tune |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.006 | 0.042 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.167 | -0.085 | Tune |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | -0.027 | 0.000 | Monitor |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.213 | 0.111 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.222 | 0.119 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.192 | -0.096 | Tune |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (11.60–35.25) | 106 | 55.7% | -0.1% | 4.5% | -0.04% |  |
| p20-40 (35.50–43.57) | 106 | 57.5% | 11.9% | 8.0% | -0.34% |  |
| p40-60 (43.57–48.60) | 106 | 52.8% | -1.0% | 5.0% | -0.46% |  |
| p60-80 (48.73–54.51) | 106 | 43.4% | -13.8% | -6.9% | 0.16% |  |
| p80-95 (54.60–62.57) | 106 | 50.9% | -0.1% | -1.9% | -0.03% |  |
| p95+ (62.63–83.30) | 106 | 48.1% | -10.0% | -11.5% | -0.34% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 235 | 48.1% | -9.1% | -5.1% | -0.47% |  |
| 0.90-1.05 | 219 | 48.9% | -7.9% | -7.7% | 0.00% |  |
| 1.05-1.20 | 127 | 63.0% | 23.6% | 28.4% | 0.04% |  |
| 1.20-1.35 | 35 | 51.4% | -5.1% | -15.9% | 0.21% |  |
| 1.35-1.50 | 11 | 45.5% | -15.6% | -42.1% | -0.34% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.29) | 90 | 51.1% | -6.6% | 5.7% | -0.23% |  |
| 20-40% (0.29–0.64) | 91 | 63.7% | 20.3% | 18.2% | -0.62% |  |
| 40-60% (0.65–0.92) | 91 | 46.2% | -14.2% | -2.5% | -0.21% |  |
| 60-80% (0.92–1.23) | 91 | 56.0% | 12.0% | 0.8% | 0.24% |  |
| 80-95% (1.24–1.69) | 91 | 40.7% | -19.8% | -11.3% | 0.09% |  |
| 95%+ (1.70–6.68) | 91 | 45.1% | -16.3% | -12.3% | 0.06% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 30 | 33.3% | -31.6% | -33.1% | 0.26% | Broad support |
| 0.25-0.40 | 110 | 47.3% | -7.2% | -9.6% | 0.24% | Healthy support |
| 0.40-0.60 | 169 | 47.9% | -8.5% | 1.6% | -0.35% | Concentrated |
| 0.60-0.80 | 117 | 59.0% | 9.8% | 9.2% | -0.21% | Very concentrated |
| 0.80-1.00 | 119 | 52.9% | -1.7% | 2.2% | -0.12% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 61 | 34.4% | -36.0% | -35.3% | -0.15% | 4.3 |
| Broad battle | 230 | 48.3% | -6.2% | 0.4% | 0.07% | 3.9 |
| One-wallet nuke | 218 | 55.0% | 3.4% | 6.2% | -0.28% | 3.8 |
| Thin support | 379 | 55.1% | 3.6% | 3.9% | -0.29% | 3.8 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=644)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 24 | 54.2% | -2.1% | 28.0% | 0.32% | 4.2 | 87.5% |
| SMALL_MOVE | 136 | 47.8% | -10.8% | -2.4% | -0.75% | 4.1 | 100.0% |
| CLEAR_MOVE | 134 | 55.2% | 2.0% | 6.2% | 0.15% | 4.1 | 100.0% |
| NEAR_START | 259 | 49.4% | -3.5% | -7.0% | 0.04% | 3.8 | 100.0% |

**All Time** (n=1206)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 541 | 53.8% | -5.0% | -3.0% | -0.47% | 3.3 | 5.4% |
| SMALL_MOVE | 139 | 47.5% | -11.3% | -3.9% | -0.68% | 4.1 | 97.8% |
| CLEAR_MOVE | 160 | 55.0% | 1.7% | 5.5% | 0.06% | 4.1 | 100.0% |
| NEAR_START | 275 | 49.5% | -4.0% | -7.3% | 0.06% | 3.8 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 12 / 66.7% / 16.0% | 69 / 52.2% / -5.7% | 66 / 59.1% / 6.1% | 106 / 50.0% / -3.6% |
| 3.5-4★ | 8 / 37.5% / -29.6% | 44 / 47.7% / -8.6% | 39 / 46.2% / -14.5% | 68 / 55.9% / 13.6% |
| 2.5-3★ | 4 / 50.0% / -1.6% | 19 / 36.8% / -25.7% | 29 / 58.6% / 14.7% | 78 / 43.6% / -16.3% |
| 1.0-2★ | — | 4 / 25.0% / -51.2% | — | 7 / 42.9% / -24.2% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 641 | 51.5% | -2.2% | 0.4% | 4.0 | -0.18% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 691 | 51.5% | -2.4% | 0.0% | 4.0 | -0.17% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 1050 | 100% |
| LOCKED (direct) | 91 | 8.7% |
| Promoted (SHADOW→LOCKED) | 657 | 62.6% |
| Rejected (stayed SHADOW) | 182 | 17.3% |
| Superseded (side flipped) | 115 | 11.0% |
| Muted | 381 | 36.3% |
| Cancelled | 20 | 1.9% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=644)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | 6.68u | 0.6% | — |
| Flat 1.0u | -12.95u | -2.0% | +19.63u |
| Lock units only | 18.61u | — | -11.93u |
| Units change only on star change | 23.02u | — | -16.34u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 205 | 2.96 | -9.1% | -4.2% | -6.68u | Sizing hurts |
| 4.5 | 82 | 2.61 | 27.5% | 22.5% | +25.73u | Sizing helps |
| 4 | 118 | 1.37 | -11.3% | -4.5% | +6.17u | Sizing helps |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 81 | 0.89 | 1.1% | -10.2% | -8.21u | Sizing hurts |
| 2.5 | 77 | 0.67 | -7.4% | -12.9% | -1.00u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 9 | 0.53 | -19.3% | 14.3% | +2.42u | Sizing helps |

### All Time (n=1206)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -38.20u | -1.9% | — |
| Flat 1.0u | -42.47u | -3.5% | +4.27u |
| Lock units only | -15.51u | — | -22.69u |
| Units change only on star change | -21.03u | — | -17.17u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 218 | 2.94 | -9.1% | -4.7% | -10.27u | Sizing hurts |
| 4.5 | 116 | 2.61 | 15.8% | 11.2% | +15.71u | Sizing helps |
| 4 | 233 | 1.74 | -7.3% | -4.0% | +0.93u | Sizing helps |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 241 | 1.10 | -8.2% | -10.7% | -8.35u | Sizing hurts |
| 2.5 | 184 | 0.71 | -3.5% | -3.6% | +1.71u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 9 | 0.53 | -19.3% | 14.3% | +2.42u | Sizing helps |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 644 | 53.2% | 51.6% | -1.6% | -2.0% | -0.17% | Neutral |
| 4.5-5★ | 287 | 53.5% | 54.7% | +1.2% | 1.4% | -0.35% | Neutral |
| 3.5-4★ | 186 | 52.5% | 48.4% | -4.1% | -5.4% | -0.02% | Below market |
| 2.5-3★ | 160 | 53.4% | 50.6% | -2.8% | -1.9% | -0.04% | Below market |
| CLEAR_MOVE only | 134 | 54.2% | 55.2% | +1.0% | 2.0% | 0.15% | Neutral |
| NO_MOVE only | 24 | 54.8% | 54.2% | -0.7% | -2.1% | 0.32% | Neutral |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=85)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 44.879 | 32.775 | 0.67 |  |
| Rank_norm | 59.262 | 61.778 | 0.12 |  |
| PnL_norm | 52.727 | 57.007 | 0.25 |  |
| WalletBase | 48.537 | 41.976 | 0.50 |  |
| SizeRatio | 1.408 | 1.065 | 0.26 |  |
| ConvictionMult | 0.963 | 0.930 | 0.21 |  |
| WalletCountFor | 2.925 | 2.424 | 0.28 |  |
| TopShare | 0.594 | 0.707 | 0.45 |  |
| ForSide | 147.113 | 110.673 | 0.33 |  |
| AgainstSide | 49.740 | 52.671 | 0.04 |  |
| NetEdge | 1.048 | 0.659 | 0.45 |  |
| WalletPlayScore | 1.030 | -0.075 | 0.47 |  |

### V8 Era (n=545)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 44.879 | 43.625 | 0.07 |  |
| Rank_norm | 59.262 | 63.267 | 0.19 |  |
| PnL_norm | 52.727 | 54.349 | 0.09 |  |
| WalletBase | 48.537 | 48.199 | 0.03 |  |
| SizeRatio | 1.408 | 1.416 | 0.01 |  |
| ConvictionMult | 0.963 | 0.968 | 0.03 |  |
| WalletCountFor | 2.925 | 2.925 | 0.00 |  |
| TopShare | 0.594 | 0.594 | 0.00 |  |
| ForSide | 147.113 | 147.113 | 0.00 |  |
| AgainstSide | 49.740 | 49.740 | 0.00 |  |
| NetEdge | 1.048 | 1.048 | 0.00 |  |
| WalletPlayScore | 1.030 | 1.030 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=644)

No major failure modes detected.

### 7-Day (n=122)

- **Odds issue**: Avg CLV -0.63% — consistently getting bad closing lines

### All Time (n=1206)

- **Environment issue**: 44.9% NO_MOVE (WR: 53.8%, ROI: -5.0%)


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
| V8 era picks | 644 |
| V8 flat ROI | -2.0% |
| V8 model ROI | 0.6% |
| V8 star monotonicity score | 0.14 |
| 4.5-5★ ROI | 1.4% |
| 2.5-3★ ROI | -1.9% |
| CLEAR_MOVE ROI | 2.0% |
| NO_MOVE ROI | -2.1% |
| Single-wallet play rate | 31.5% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: -0.05% | 4.5★: -1.11% | 4★: 0.01% | 3.5★: -0.07% | 3★: 0.13% | 2.5★: -0.21% | 2★: 0.67% | 1★: -0.01% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=644)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 558 | 86.6% | 50.9% | -2.6% | -1.5% | -0.19% |
| MUTED | 75 | 11.6% | 56.0% | 2.2% | 20.8% | -0.11% |
| CANCELLED | 11 | 1.7% | 54.5% | -2.8% | -10.4% | 0.16% |

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

### 7-Day (n=122)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 122 | 100.0% | 56.6% | 7.9% | 14.0% | -0.63% |

### All Time (n=1206)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 1118 | 92.7% | 52.1% | -4.2% | -3.3% | -0.30% |
| MUTED | 75 | 6.2% | 56.0% | 2.2% | 20.8% | -0.11% |
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
