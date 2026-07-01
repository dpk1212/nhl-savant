# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-07-01 ET
**Completed Picks**: 1626 | **V8 Era Picks**: 1064 | **V8 Since**: 2026-04-18
**Universe**: All locked picks across ML, Spread, Total markets

## Executive Summary

- **Overall**: NEEDS ATTENTION
- **Ranking health**: BROKEN
- **Sizing health**: HEALTHY
- **Environment health**: HEALTHY
- **Most important takeaway**: Star calibration is not monotonic — higher stars must beat lower stars before tuning anything else.

---

## 1. Intervention Triggers

| Trigger | Status | Detail |
|---|---|---|
| Single-wallet dependency | ⚠️ | 43% of picks are single-wallet (WR: 51.6%, ROI: -2.0%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 75 | 49.3% | -5.53u | -7.4% | 20.30u | 24.2% | 0.84% | -0.51% |  |
| 7-Day | 163 | 51.5% | -10.91u | -6.7% | 16.99u | 6.9% | -0.07% | 1.20% |  |
| 14-Day | 296 | 50.3% | -22.32u | -7.5% | 25.87u | 5.1% | 0.18% | 0.43% |  |
| 30-Day | 560 | 51.2% | -22.59u | -4.0% | 49.77u | 4.9% | -0.09% | 0.19% |  |
| V8 Era | 1064 | 50.9% | -43.82u | -4.1% | 17.34u | 0.9% | -0.08% | -0.34% |  |
| All Time | 1626 | 51.8% | -73.33u | -4.5% | -27.54u | -1.0% | -0.19% | -0.14% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=1064)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 280 | 53.8% | 53.8% | 50.4% | -3.4% | -8.5% | -3.9% | 3.23 | -0.21% | Weak |
| 4.5 | 209 | 51.9% | 51.9% | 52.6% | +0.7% | -0.6% | 6.5% | 2.54 | 0.19% | Fair |
| 4 | 195 | 52.4% | 52.4% | 49.2% | -3.1% | -5.7% | 5.9% | 1.21 | -0.37% | Weak |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 140 | 52.6% | 52.6% | 50.7% | -1.9% | -3.4% | -7.3% | 0.72 | 0.54% | Fair |
| 2.5 | 153 | 53.3% | 53.3% | 51.0% | -2.3% | -4.4% | 8.7% | 0.46 | -0.41% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 15 | 52.7% | 52.7% | 60.0% | +7.3% | 5.8% | 20.8% | 0.40 | 0.11% | Strong |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 50.4% | 52.6% | -2.2% | Flat |
| 4.5★ vs 4★ | 52.6% | 49.2% | +3.4% | Correct |
| 4★ vs 3.5★ | 49.2% | 51.5% | -2.3% | Flat |
| 3.5★ vs 3★ | 51.5% | 50.7% | +0.8% | Correct |
| 3★ vs 2.5★ | 50.7% | 51.0% | -0.3% | Flat |
| 2.5★ vs 2★ | 51.0% | 0.0% | +51.0% | Correct |
| 2★ vs 1★ | 0.0% | 60.0% | -60.0% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | -0.143 |
| Spearman: Stars vs Flat ROI | -0.214 |
| Spearman: Stars vs CLV | -0.286 |
| Brier Score | 0.2410 |
| Monotonicity Score | 0.14 |

**⚠️ RANKING LAYER IS MISCALIBRATED** — higher stars are not producing better ROI

### All Time (n=1626)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 293 | 54.0% | 54.0% | 50.5% | -3.5% | -8.5% | -4.2% | 3.21 | -0.16% | Weak |
| 4.5 | 243 | 52.7% | 52.7% | 52.3% | -0.5% | -2.3% | 3.2% | 2.55 | 0.35% | Fair |
| 4 | 310 | 53.7% | 53.7% | 51.0% | -2.8% | -4.8% | 1.1% | 1.55 | -0.49% | Fair |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 300 | 54.0% | 54.0% | 49.7% | -4.3% | -8.5% | -9.6% | 0.98 | 0.00% | Weak |
| 2.5 | 260 | 53.8% | 53.8% | 52.7% | -1.1% | -2.9% | 5.4% | 0.57 | -0.57% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 15 | 52.7% | 52.7% | 60.0% | +7.3% | 5.8% | 20.8% | 0.40 | 0.11% | Strong |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 50.5% | 52.3% | -1.8% | Flat |
| 4.5★ vs 4★ | 52.3% | 51.0% | +1.3% | Correct |
| 4★ vs 3.5★ | 51.0% | 56.5% | -5.5% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 49.7% | +6.8% | Correct |
| 3★ vs 2.5★ | 49.7% | 52.7% | -3.0% | INVERTED |
| 2.5★ vs 2★ | 52.7% | 0.0% | +52.7% | Correct |
| 2★ vs 1★ | 0.0% | 60.0% | -60.0% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | -0.190 |
| Spearman: Stars vs Flat ROI | -0.190 |
| Spearman: Stars vs CLV | -0.214 |
| Brier Score | 0.2363 |
| Monotonicity Score | 0.14 |

**⚠️ RANKING LAYER IS MISCALIBRATED** — higher stars are not producing better ROI


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.092 | -0.020 | Tune |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.158 | -0.101 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.099 | -0.050 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.126 | -0.036 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | -0.053 | -0.008 | Tune |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | -0.031 | 0.012 | Monitor |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | -0.130 | -0.036 | Tune |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.154 | -0.077 | Tune |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.007 | 0.040 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.123 | -0.072 | Tune |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.020 | 0.006 | Monitor |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.139 | 0.087 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.142 | 0.092 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.121 | -0.075 | Tune |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (10.10–32.60) | 176 | 47.2% | -14.2% | -1.1% | 0.15% |  |
| p20-40 (32.63–38.52) | 176 | 51.7% | -5.0% | 6.9% | -0.01% |  |
| p40-60 (38.53–44.30) | 176 | 59.7% | 14.3% | 7.1% | -0.77% |  |
| p60-80 (44.30–50.29) | 176 | 49.4% | -8.5% | 2.1% | -0.17% |  |
| p80-95 (50.30–57.97) | 176 | 49.4% | -2.1% | -4.7% | 0.57% |  |
| p95+ (58.00–83.30) | 176 | 47.7% | -9.9% | -8.8% | -0.25% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 466 | 48.1% | -9.4% | -2.2% | -0.33% |  |
| 0.90-1.05 | 341 | 49.6% | -8.1% | -5.1% | 0.15% |  |
| 1.05-1.20 | 175 | 63.4% | 22.6% | 27.8% | -0.10% |  |
| 1.20-1.35 | 45 | 44.4% | -18.5% | -23.2% | 1.21% |  |
| 1.35-1.50 | 13 | 38.5% | -28.6% | -47.4% | -0.54% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-2.06–0.19) | 130 | 46.9% | -10.7% | -1.3% | -0.39% |  |
| 20-40% (0.19–0.51) | 130 | 58.5% | 7.7% | 15.0% | -0.21% |  |
| 40-60% (0.51–0.79) | 130 | 53.8% | 0.8% | 4.9% | 0.01% |  |
| 60-80% (0.79–1.11) | 130 | 50.8% | -3.0% | 3.5% | 0.16% |  |
| 80-95% (1.11–1.60) | 130 | 46.9% | -10.4% | -7.8% | -0.03% |  |
| 95%+ (1.60–6.68) | 131 | 48.9% | -10.6% | -6.7% | -0.09% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 43 | 41.9% | -18.8% | -17.6% | 0.07% | Broad support |
| 0.25-0.40 | 149 | 50.3% | -4.9% | -0.1% | 0.01% | Healthy support |
| 0.40-0.60 | 245 | 49.0% | -8.0% | -1.6% | -0.14% | Concentrated |
| 0.60-0.80 | 149 | 57.7% | 6.3% | 11.0% | -0.19% | Very concentrated |
| 0.80-1.00 | 195 | 50.8% | -4.3% | 0.9% | -0.05% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 89 | 39.3% | -30.5% | -31.1% | -0.28% | 4.2 |
| Broad battle | 318 | 50.0% | -4.5% | 5.0% | -0.01% | 3.8 |
| One-wallet nuke | 478 | 50.8% | -3.8% | 1.4% | -0.05% | 3.9 |
| Thin support | 700 | 52.0% | -2.1% | 1.2% | -0.09% | 3.9 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=1064)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 35 | 54.3% | -2.8% | 33.4% | 1.05% | 4.0 | 91.4% |
| SMALL_MOVE | 199 | 50.3% | -5.9% | 1.6% | -0.51% | 4.1 | 100.0% |
| CLEAR_MOVE | 148 | 54.1% | -0.9% | 3.0% | 0.05% | 4.1 | 100.0% |
| NEAR_START | 407 | 50.1% | -4.8% | -3.8% | -0.03% | 3.7 | 100.0% |

**All Time** (n=1626)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 552 | 53.8% | -5.0% | -2.1% | -0.39% | 3.3 | 7.2% |
| SMALL_MOVE | 202 | 50.0% | -6.3% | 0.3% | -0.47% | 4.1 | 98.5% |
| CLEAR_MOVE | 174 | 54.0% | -0.7% | 2.8% | -0.02% | 4.1 | 100.0% |
| NEAR_START | 423 | 50.1% | -5.1% | -4.1% | -0.01% | 3.7 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 16 / 62.5% / 5.6% | 99 / 50.5% / -8.2% | 74 / 58.1% / 3.7% | 153 / 49.7% / -6.8% |
| 3.5-4★ | 11 / 36.4% / -29.3% | 57 / 56.1% / 8.4% | 43 / 44.2% / -19.0% | 97 / 53.6% / 6.9% |
| 2.5-3★ | 7 / 57.1% / 11.2% | 38 / 42.1% / -18.8% | 31 / 58.1% / 13.3% | 146 / 47.9% / -10.5% |
| 1.0-2★ | 1 / 100.0% / 57.1% | 5 / 40.0% / -25.6% | — | 11 / 54.5% / -3.9% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 1061 | 50.9% | -4.2% | 0.8% | 3.9 | -0.08% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 1111 | 50.9% | -4.3% | 0.6% | 3.9 | -0.08% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 1780 | 100% |
| LOCKED (direct) | 106 | 6.0% |
| Promoted (SHADOW→LOCKED) | 1180 | 66.3% |
| Rejected (stayed SHADOW) | 201 | 11.3% |
| Superseded (side flipped) | 288 | 16.2% |
| Muted | 613 | 34.4% |
| Cancelled | 20 | 1.1% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=1064)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | 17.34u | 0.9% | — |
| Flat 1.0u | -43.82u | -4.1% | +61.16u |
| Lock units only | -38.49u | — | +55.83u |
| Units change only on star change | -34.08u | — | +51.42u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 280 | 3.23 | -8.5% | -3.9% | -11.40u | Sizing hurts |
| 4.5 | 209 | 2.54 | -0.6% | 6.5% | +35.60u | Sizing helps |
| 4 | 195 | 1.21 | -5.7% | 5.9% | +25.12u | Sizing helps |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 140 | 0.72 | -3.4% | -7.3% | -2.59u | Sizing hurts |
| 2.5 | 153 | 0.46 | -4.4% | 8.7% | +12.84u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 15 | 0.40 | 5.8% | 20.8% | +0.38u | Neutral |

### All Time (n=1626)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -27.54u | -1.0% | — |
| Flat 1.0u | -73.33u | -4.5% | +45.79u |
| Lock units only | -72.60u | — | +45.06u |
| Units change only on star change | -78.12u | — | +50.58u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 293 | 3.21 | -8.5% | -4.2% | -14.99u | Sizing hurts |
| 4.5 | 243 | 2.55 | -2.3% | 3.2% | +25.58u | Sizing helps |
| 4 | 310 | 1.55 | -4.8% | 1.1% | +19.88u | Sizing helps |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 300 | 0.98 | -8.5% | -9.6% | -2.74u | Sizing hurts |
| 2.5 | 260 | 0.57 | -2.9% | 5.4% | +15.55u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 15 | 0.40 | 5.8% | 20.8% | +0.38u | Neutral |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 1064 | 52.8% | 50.9% | -1.8% | -4.1% | -0.08% | Neutral |
| 4.5-5★ | 489 | 53.0% | 51.3% | -1.7% | -5.1% | -0.04% | Neutral |
| 3.5-4★ | 263 | 52.1% | 49.8% | -2.3% | -3.0% | -0.29% | Below market |
| 2.5-3★ | 295 | 53.0% | 51.2% | -1.8% | -3.3% | 0.04% | Neutral |
| CLEAR_MOVE only | 148 | 54.1% | 54.1% | -0.1% | -0.9% | 0.05% | Neutral |
| NO_MOVE only | 35 | 52.9% | 54.3% | +1.4% | -2.8% | 1.05% | Neutral |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=94)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 43.431 | 36.071 | 0.41 |  |
| Rank_norm | 48.452 | 36.913 | 0.43 |  |
| PnL_norm | 45.110 | 32.784 | 0.57 |  |
| WalletBase | 45.009 | 37.210 | 0.60 |  |
| SizeRatio | 1.254 | 1.260 | 0.00 |  |
| ConvictionMult | 0.934 | 0.940 | 0.04 |  |
| WalletCountFor | 2.904 | 3.766 | 0.43 |  |
| TopShare | 0.608 | 0.546 | 0.24 |  |
| ForSide | 134.533 | 134.159 | 0.00 |  |
| AgainstSide | 47.932 | 41.071 | 0.09 |  |
| NetEdge | 0.938 | 0.992 | 0.06 |  |
| WalletPlayScore | 0.842 | 1.402 | 0.23 |  |

### V8 Era (n=781)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 43.431 | 42.066 | 0.08 |  |
| Rank_norm | 48.452 | 56.611 | 0.30 |  |
| PnL_norm | 45.110 | 49.618 | 0.21 |  |
| WalletBase | 45.009 | 45.681 | 0.05 |  |
| SizeRatio | 1.254 | 1.336 | 0.06 |  |
| ConvictionMult | 0.934 | 0.954 | 0.13 |  |
| WalletCountFor | 2.904 | 2.904 | 0.00 |  |
| TopShare | 0.608 | 0.608 | 0.00 |  |
| ForSide | 134.533 | 134.533 | 0.00 |  |
| AgainstSide | 47.932 | 47.932 | 0.00 |  |
| NetEdge | 0.938 | 0.938 | 0.00 |  |
| WalletPlayScore | 0.842 | 0.842 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=1064)

No major failure modes detected.

### 7-Day (n=163)

- **Gate issue**: NO_MOVE ROI (4.8%) significantly trails CLEAR_MOVE (20.8%)

### All Time (n=1626)

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
| V8 era picks | 1064 |
| V8 flat ROI | -4.1% |
| V8 model ROI | 0.9% |
| V8 star monotonicity score | 0.14 |
| 4.5-5★ ROI | -5.1% |
| 2.5-3★ ROI | -3.3% |
| CLEAR_MOVE ROI | -0.9% |
| NO_MOVE ROI | -2.8% |
| Single-wallet play rate | 43.0% |
| Whale override win rate | 80.0% |
| Avg CLV by star bucket | 5★: -0.21% | 4.5★: 0.19% | 4★: -0.37% | 3.5★: -0.07% | 3★: 0.54% | 2.5★: -0.41% | 2★: 0.67% | 1★: 0.11% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=1064)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 978 | 91.9% | 50.5% | -4.6% | -0.3% | -0.08% |
| MUTED | 75 | 7.0% | 56.0% | 2.2% | 20.8% | -0.11% |
| CANCELLED | 11 | 1.0% | 54.5% | -2.8% | -10.4% | 0.16% |

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

### 7-Day (n=163)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 163 | 100.0% | 51.5% | -6.7% | 6.9% | -0.07% |

### All Time (n=1626)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 1538 | 94.6% | 51.6% | -5.0% | -2.0% | -0.19% |
| MUTED | 75 | 4.6% | 56.0% | 2.2% | 20.8% | -0.11% |
| CANCELLED | 13 | 0.8% | 61.5% | 17.8% | 4.8% | -0.95% |

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
