# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-06-23 ET
**Completed Picks**: 1417 | **V8 Era Picks**: 855 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (57.9%) beats 5★ (50.6%) |
| Single-wallet dependency | ⚠️ | 40% of picks are single-wallet (WR: 53.7%, ROI: 2.2%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 47 | 48.9% | -3.59u | -7.6% | 6.03u | 6.2% | -0.51% | -1.14% |  |
| 7-Day | 111 | 53.2% | -0.91u | -0.8% | 13.23u | 5.5% | -0.43% | -0.98% |  |
| 14-Day | 232 | 50.9% | -8.25u | -3.6% | 12.95u | 2.7% | -0.52% | -0.39% |  |
| 30-Day | 493 | 52.3% | -8.17u | -1.7% | 34.79u | 3.5% | -0.38% | -0.47% |  |
| V8 Era | 855 | 51.5% | -20.47u | -2.4% | 5.55u | 0.3% | -0.21% | -0.44% |  |
| All Time | 1417 | 52.3% | -49.99u | -3.5% | -39.33u | -1.6% | -0.30% | -0.17% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=855)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 253 | 53.6% | 53.6% | 50.6% | -3.0% | -7.0% | -3.7% | 3.20 | -0.11% | Weak |
| 4.5 | 145 | 53.2% | 53.2% | 57.9% | +4.8% | 9.3% | 11.1% | 2.63 | -0.66% | Strong |
| 4 | 164 | 53.0% | 53.0% | 47.6% | -5.5% | -9.1% | 0.2% | 1.26 | -0.16% | Weak |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 105 | 53.5% | 53.5% | 52.4% | -1.1% | 0.4% | -7.1% | 0.80 | 0.07% | Fair |
| 2.5 | 105 | 53.0% | 53.0% | 49.5% | -3.5% | -4.4% | -10.6% | 0.56 | -0.29% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 11 | 54.2% | 54.2% | 54.5% | +0.4% | 0.1% | 13.6% | 0.45 | 0.01% | Fair |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 50.6% | 57.9% | -7.3% | INVERTED |
| 4.5★ vs 4★ | 57.9% | 47.6% | +10.3% | Correct |
| 4★ vs 3.5★ | 47.6% | 51.5% | -3.9% | INVERTED |
| 3.5★ vs 3★ | 51.5% | 52.4% | -0.9% | Flat |
| 3★ vs 2.5★ | 52.4% | 49.5% | +2.9% | Correct |
| 2.5★ vs 2★ | 49.5% | 0.0% | +49.5% | Correct |
| 2★ vs 1★ | 0.0% | 54.5% | -54.5% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.119 |
| Spearman: Stars vs Flat ROI | 0.190 |
| Spearman: Stars vs CLV | -0.571 |
| Brier Score | 0.2468 |
| Monotonicity Score | 0.14 |

### All Time (n=1417)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 266 | 53.8% | 53.8% | 50.8% | -3.1% | -7.1% | -4.1% | 3.17 | -0.07% | Weak |
| 4.5 | 179 | 54.0% | 54.0% | 56.4% | +2.4% | 5.2% | 6.0% | 2.63 | -0.30% | Strong |
| 4 | 279 | 54.2% | 54.2% | 50.2% | -4.1% | -6.7% | -1.9% | 1.62 | -0.37% | Weak |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 265 | 54.5% | 54.5% | 50.2% | -4.3% | -7.7% | -9.7% | 1.04 | -0.30% | Weak |
| 2.5 | 212 | 53.7% | 53.7% | 52.4% | -1.4% | -2.6% | -3.1% | 0.65 | -0.54% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 11 | 54.2% | 54.2% | 54.5% | +0.4% | 0.1% | 13.6% | 0.45 | 0.01% | Fair |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 50.8% | 56.4% | -5.6% | INVERTED |
| 4.5★ vs 4★ | 56.4% | 50.2% | +6.2% | Correct |
| 4★ vs 3.5★ | 50.2% | 56.5% | -6.3% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 50.2% | +6.3% | Correct |
| 3★ vs 2.5★ | 50.2% | 52.4% | -2.2% | Flat |
| 2.5★ vs 2★ | 52.4% | 0.0% | +52.4% | Correct |
| 2★ vs 1★ | 0.0% | 54.5% | -54.5% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.143 |
| Spearman: Stars vs Flat ROI | 0.190 |
| Spearman: Stars vs CLV | -0.333 |
| Brier Score | 0.2391 |
| Monotonicity Score | 0.14 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.088 | -0.014 | Tune |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.184 | -0.124 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.091 | -0.056 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.137 | -0.049 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | -0.069 | -0.017 | Tune |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | -0.038 | 0.010 | Monitor |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | -0.142 | -0.047 | Tune |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.182 | -0.092 | Tune |
| AgainstSide | Opposition | Force against side | Higher → worse | -0.008 | 0.030 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.143 | -0.080 | Tune |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | -0.014 | -0.007 | Monitor |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.186 | 0.110 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.189 | 0.116 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.159 | -0.091 | Tune |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (10.60–34.50) | 141 | 48.9% | -10.6% | -0.6% | -0.03% |  |
| p20-40 (34.58–40.35) | 141 | 58.2% | 7.8% | 13.5% | -0.24% |  |
| p40-60 (40.45–46.20) | 141 | 51.1% | -1.1% | -5.4% | -0.69% |  |
| p60-80 (46.23–52.13) | 141 | 50.4% | -5.3% | -1.5% | -0.00% |  |
| p80-95 (52.20–60.23) | 141 | 51.8% | 4.2% | -1.2% | -0.09% |  |
| p95+ (60.40–83.30) | 142 | 47.9% | -10.0% | -7.4% | -0.23% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 357 | 48.2% | -8.9% | -4.7% | -0.42% |  |
| 0.90-1.05 | 279 | 49.1% | -7.4% | -6.9% | -0.07% |  |
| 1.05-1.20 | 146 | 64.4% | 25.1% | 31.5% | -0.00% |  |
| 1.20-1.35 | 39 | 48.7% | -10.0% | -18.7% | 0.16% |  |
| 1.35-1.50 | 12 | 41.7% | -22.6% | -40.2% | -0.33% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-2.06–0.20) | 110 | 50.0% | -4.9% | -0.3% | -0.28% |  |
| 20-40% (0.20–0.52) | 111 | 56.8% | 4.7% | 8.3% | -0.07% |  |
| 40-60% (0.53–0.83) | 111 | 54.1% | 1.4% | 10.8% | -0.48% |  |
| 60-80% (0.83–1.15) | 111 | 50.5% | -1.7% | -9.6% | 0.09% |  |
| 80-95% (1.16–1.62) | 111 | 48.6% | -5.5% | 3.0% | 0.04% |  |
| 95%+ (1.62–6.68) | 111 | 46.8% | -13.3% | -9.4% | 0.02% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 34 | 35.3% | -29.3% | -30.3% | 0.23% | Broad support |
| 0.25-0.40 | 126 | 50.0% | -3.4% | -1.6% | 0.15% | Healthy support |
| 0.40-0.60 | 207 | 48.3% | -8.6% | -0.2% | -0.22% | Concentrated |
| 0.60-0.80 | 130 | 59.2% | 9.6% | 10.1% | -0.19% | Very concentrated |
| 0.80-1.00 | 168 | 52.4% | -1.1% | 1.1% | -0.19% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 72 | 40.3% | -26.1% | -26.3% | -0.14% | 4.2 |
| Broad battle | 275 | 48.4% | -6.8% | 0.7% | 0.06% | 3.9 |
| One-wallet nuke | 358 | 52.5% | -0.3% | 1.2% | -0.38% | 3.9 |
| Thin support | 553 | 53.2% | 0.3% | -0.1% | -0.32% | 3.9 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=855)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 28 | 53.6% | -2.8% | 23.3% | 0.20% | 4.2 | 89.3% |
| SMALL_MOVE | 175 | 50.9% | -4.3% | 2.1% | -0.52% | 4.1 | 100.0% |
| CLEAR_MOVE | 142 | 54.2% | -0.1% | 3.7% | 0.07% | 4.1 | 100.0% |
| NEAR_START | 328 | 50.0% | -3.7% | -4.8% | -0.00% | 3.8 | 100.0% |

**All Time** (n=1417)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 545 | 53.8% | -5.0% | -3.0% | -0.47% | 3.3 | 6.1% |
| SMALL_MOVE | 178 | 50.6% | -4.9% | 0.7% | -0.47% | 4.1 | 98.3% |
| CLEAR_MOVE | 168 | 54.2% | -0.0% | 3.4% | -0.00% | 4.1 | 100.0% |
| NEAR_START | 344 | 50.0% | -4.1% | -5.2% | 0.01% | 3.8 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 14 / 64.3% / 13.6% | 85 / 50.6% / -7.7% | 69 / 58.0% / 4.2% | 133 / 51.1% / -3.0% |
| 3.5-4★ | 9 / 33.3% / -37.5% | 54 / 57.4% / 10.7% | 42 / 45.2% / -17.1% | 85 / 51.8% / 3.8% |
| 2.5-3★ | 5 / 60.0% / 13.9% | 31 / 41.9% / -17.8% | 31 / 58.1% / 13.3% | 102 / 47.1% / -10.4% |
| 1.0-2★ | — | 5 / 40.0% / -25.6% | — | 8 / 50.0% / -8.9% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 852 | 51.4% | -2.5% | 0.2% | 4.0 | -0.21% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 902 | 51.4% | -2.7% | -0.0% | 4.0 | -0.21% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 1451 | 100% |
| LOCKED (direct) | 101 | 7.0% |
| Promoted (SHADOW→LOCKED) | 963 | 66.4% |
| Rejected (stayed SHADOW) | 196 | 13.5% |
| Superseded (side flipped) | 186 | 12.8% |
| Muted | 507 | 34.9% |
| Cancelled | 20 | 1.4% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=855)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | 5.55u | 0.3% | — |
| Flat 1.0u | -20.47u | -2.4% | +26.02u |
| Lock units only | -3.28u | — | +8.83u |
| Units change only on star change | 1.13u | — | +4.42u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 253 | 3.20 | -7.0% | -3.7% | -12.39u | Sizing hurts |
| 4.5 | 145 | 2.63 | 9.3% | 11.1% | +29.00u | Sizing helps |
| 4 | 164 | 1.26 | -9.1% | 0.2% | +15.42u | Sizing helps |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 105 | 0.80 | 0.4% | -7.1% | -6.36u | Sizing hurts |
| 2.5 | 105 | 0.56 | -4.4% | -10.6% | -1.52u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 11 | 0.45 | 0.1% | 13.6% | +0.67u | Sizing helps |

### All Time (n=1417)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -39.33u | -1.6% | — |
| Flat 1.0u | -49.99u | -3.5% | +10.66u |
| Lock units only | -37.39u | — | -1.94u |
| Units change only on star change | -42.92u | — | +3.59u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 266 | 3.17 | -7.1% | -4.1% | -15.99u | Sizing hurts |
| 4.5 | 179 | 2.63 | 5.2% | 6.0% | +18.98u | Sizing helps |
| 4 | 279 | 1.62 | -6.7% | -1.9% | +10.18u | Sizing helps |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 265 | 1.04 | -7.7% | -9.7% | -6.50u | Sizing hurts |
| 2.5 | 212 | 0.65 | -2.6% | -3.1% | +1.20u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 11 | 0.45 | 0.1% | 13.6% | +0.67u | Sizing helps |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 855 | 53.1% | 51.5% | -1.7% | -2.4% | -0.21% | Neutral |
| 4.5-5★ | 398 | 53.4% | 53.3% | -0.2% | -1.1% | -0.32% | Neutral |
| 3.5-4★ | 232 | 52.5% | 48.7% | -3.8% | -5.0% | -0.13% | Below market |
| 2.5-3★ | 212 | 53.3% | 51.4% | -1.8% | -1.2% | -0.11% | Neutral |
| CLEAR_MOVE only | 142 | 54.2% | 54.2% | +0.1% | -0.1% | 0.07% | Neutral |
| NO_MOVE only | 28 | 54.6% | 53.6% | -1.0% | -2.8% | 0.20% | Neutral |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=58)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 44.435 | 36.421 | 0.44 |  |
| Rank_norm | 53.090 | 37.930 | 0.61 |  |
| PnL_norm | 49.072 | 38.415 | 0.54 |  |
| WalletBase | 46.842 | 38.355 | 0.66 |  |
| SizeRatio | 1.297 | 0.982 | 0.25 |  |
| ConvictionMult | 0.943 | 0.887 | 0.34 |  |
| WalletCountFor | 2.811 | 2.241 | 0.31 |  |
| TopShare | 0.612 | 0.701 | 0.35 |  |
| ForSide | 136.597 | 77.926 | 0.54 |  |
| AgainstSide | 49.325 | 38.712 | 0.14 |  |
| NetEdge | 0.947 | 0.450 | 0.58 |  |
| WalletPlayScore | 0.805 | -0.290 | 0.46 |  |

### V8 Era (n=665)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 44.435 | 42.939 | 0.08 |  |
| Rank_norm | 53.090 | 59.796 | 0.27 |  |
| PnL_norm | 49.072 | 52.396 | 0.17 |  |
| WalletBase | 46.842 | 47.034 | 0.01 |  |
| SizeRatio | 1.297 | 1.351 | 0.04 |  |
| ConvictionMult | 0.943 | 0.957 | 0.09 |  |
| WalletCountFor | 2.811 | 2.811 | 0.00 |  |
| TopShare | 0.612 | 0.612 | 0.00 |  |
| ForSide | 136.597 | 136.597 | 0.00 |  |
| AgainstSide | 49.325 | 49.325 | 0.00 |  |
| NetEdge | 0.947 | 0.947 | 0.00 |  |
| WalletPlayScore | 0.805 | 0.805 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=855)

No major failure modes detected.

### 7-Day (n=111)

No major failure modes detected.

### All Time (n=1417)

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
| V8 era picks | 855 |
| V8 flat ROI | -2.4% |
| V8 model ROI | 0.3% |
| V8 star monotonicity score | 0.14 |
| 4.5-5★ ROI | -1.1% |
| 2.5-3★ ROI | -1.2% |
| CLEAR_MOVE ROI | -0.1% |
| NO_MOVE ROI | -2.8% |
| Single-wallet play rate | 39.9% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: -0.11% | 4.5★: -0.66% | 4★: -0.16% | 3.5★: -0.07% | 3★: 0.07% | 2.5★: -0.29% | 2★: 0.67% | 1★: 0.01% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=855)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 769 | 89.9% | 51.0% | -2.8% | -1.2% | -0.23% |
| MUTED | 75 | 8.8% | 56.0% | 2.2% | 20.8% | -0.11% |
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

### 7-Day (n=111)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 111 | 100.0% | 53.2% | -0.8% | 5.5% | -0.43% |

### All Time (n=1417)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 1329 | 93.8% | 52.0% | -4.1% | -2.8% | -0.30% |
| MUTED | 75 | 5.3% | 56.0% | 2.2% | 20.8% | -0.11% |
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
