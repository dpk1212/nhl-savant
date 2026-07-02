# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-07-02 ET
**Completed Picks**: 1647 | **V8 Era Picks**: 1085 | **V8 Since**: 2026-04-18
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
| 3-Day | 71 | 53.5% | 2.23u | 3.1% | 12.94u | 13.1% | -0.09% | -0.59% |  |
| 7-Day | 154 | 50.0% | -13.92u | -9.0% | 4.85u | 2.1% | 0.12% | 0.99% |  |
| 14-Day | 300 | 50.3% | -21.25u | -7.1% | 12.35u | 2.4% | 0.21% | 0.38% |  |
| 30-Day | 573 | 51.3% | -22.04u | -3.8% | 36.07u | 3.4% | -0.09% | 0.20% |  |
| V8 Era | 1085 | 51.0% | -42.77u | -3.9% | 5.78u | 0.3% | -0.08% | -0.35% |  |
| All Time | 1647 | 51.9% | -72.29u | -4.4% | -39.10u | -1.4% | -0.19% | -0.14% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=1085)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 286 | 53.8% | 53.8% | 50.0% | -3.8% | -9.1% | -5.0% | 3.26 | -0.24% | Weak |
| 4.5 | 214 | 51.9% | 51.9% | 53.3% | +1.3% | 0.6% | 6.4% | 2.55 | 0.16% | Fair |
| 4 | 198 | 52.3% | 52.3% | 49.5% | -2.8% | -5.0% | 7.9% | 1.21 | -0.38% | Weak |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 143 | 52.5% | 52.5% | 51.0% | -1.4% | -1.7% | -4.9% | 0.72 | 0.67% | Fair |
| 2.5 | 156 | 53.2% | 53.2% | 50.0% | -3.2% | -6.2% | -2.7% | 0.46 | -0.42% | Weak |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 16 | 54.2% | 54.2% | 62.5% | +8.3% | 7.2% | 17.9% | 0.44 | 0.10% | Strong |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 50.0% | 53.3% | -3.3% | INVERTED |
| 4.5★ vs 4★ | 53.3% | 49.5% | +3.8% | Correct |
| 4★ vs 3.5★ | 49.5% | 51.5% | -2.0% | Flat |
| 3.5★ vs 3★ | 51.5% | 51.0% | +0.5% | Correct |
| 3★ vs 2.5★ | 51.0% | 50.0% | +1.0% | Correct |
| 2.5★ vs 2★ | 50.0% | 0.0% | +50.0% | Correct |
| 2★ vs 1★ | 0.0% | 62.5% | -62.5% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | -0.119 |
| Spearman: Stars vs Flat ROI | -0.143 |
| Spearman: Stars vs CLV | -0.286 |
| Brier Score | 0.2413 |
| Monotonicity Score | -0.14 |

**⚠️ RANKING LAYER IS MISCALIBRATED** — higher stars are not producing better ROI

### All Time (n=1647)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 299 | 54.1% | 54.1% | 50.2% | -3.9% | -9.1% | -5.3% | 3.23 | -0.19% | Weak |
| 4.5 | 248 | 52.7% | 52.7% | 52.8% | +0.1% | -1.1% | 3.3% | 2.56 | 0.33% | Fair |
| 4 | 313 | 53.7% | 53.7% | 51.1% | -2.5% | -4.4% | 2.1% | 1.55 | -0.50% | Fair |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 303 | 53.9% | 53.9% | 49.8% | -4.1% | -7.7% | -8.8% | 0.97 | 0.08% | Weak |
| 2.5 | 263 | 53.7% | 53.7% | 52.1% | -1.6% | -4.0% | 0.0% | 0.57 | -0.57% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 16 | 54.2% | 54.2% | 62.5% | +8.3% | 7.2% | 17.9% | 0.44 | 0.10% | Strong |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 50.2% | 52.8% | -2.6% | Flat |
| 4.5★ vs 4★ | 52.8% | 51.1% | +1.7% | Correct |
| 4★ vs 3.5★ | 51.1% | 56.5% | -5.4% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 49.8% | +6.7% | Correct |
| 3★ vs 2.5★ | 49.8% | 52.1% | -2.3% | Flat |
| 2.5★ vs 2★ | 52.1% | 0.0% | +52.1% | Correct |
| 2★ vs 1★ | 0.0% | 62.5% | -62.5% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | -0.095 |
| Spearman: Stars vs Flat ROI | -0.190 |
| Spearman: Stars vs CLV | -0.214 |
| Brier Score | 0.2366 |
| Monotonicity Score | 0.14 |

**⚠️ RANKING LAYER IS MISCALIBRATED** — higher stars are not producing better ROI


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.086 | -0.015 | Tune |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.160 | -0.102 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.102 | -0.053 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.121 | -0.031 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | -0.053 | -0.011 | Tune |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | -0.031 | 0.009 | Monitor |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | -0.126 | -0.033 | Tune |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.147 | -0.075 | Tune |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.008 | 0.038 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.120 | -0.072 | Tune |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.024 | 0.006 | Monitor |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.135 | 0.085 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.140 | 0.091 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.116 | -0.074 | Tune |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (10.10–32.60) | 179 | 46.9% | -14.0% | -3.5% | 0.12% |  |
| p20-40 (32.60–38.60) | 180 | 51.7% | -5.6% | 6.0% | -0.02% |  |
| p40-60 (38.60–44.18) | 179 | 59.2% | 13.5% | 7.4% | -0.80% |  |
| p60-80 (44.20–50.25) | 180 | 50.6% | -6.6% | 3.4% | -0.19% |  |
| p80-95 (50.26–57.83) | 179 | 49.2% | -2.1% | -5.8% | 0.68% |  |
| p95+ (57.85–83.30) | 180 | 47.8% | -9.4% | -9.7% | -0.26% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 474 | 48.3% | -8.8% | -2.0% | -0.34% |  |
| 0.90-1.05 | 347 | 49.6% | -7.6% | -6.4% | 0.20% |  |
| 1.05-1.20 | 179 | 63.1% | 21.5% | 27.1% | -0.12% |  |
| 1.20-1.35 | 48 | 43.8% | -19.6% | -21.6% | 1.04% |  |
| 1.35-1.50 | 13 | 38.5% | -28.6% | -47.4% | -0.54% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-2.06–0.19) | 132 | 47.7% | -9.1% | -0.1% | -0.39% |  |
| 20-40% (0.19–0.52) | 132 | 57.6% | 6.1% | 12.8% | -0.17% |  |
| 40-60% (0.52–0.80) | 132 | 54.5% | 1.1% | 5.1% | -0.03% |  |
| 60-80% (0.80–1.11) | 132 | 51.5% | -0.1% | 2.4% | 0.34% |  |
| 80-95% (1.11–1.60) | 132 | 46.2% | -11.3% | -6.7% | -0.10% |  |
| 95%+ (1.60–6.68) | 133 | 48.9% | -10.7% | -6.2% | -0.12% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 43 | 41.9% | -18.8% | -17.6% | 0.07% | Broad support |
| 0.25-0.40 | 152 | 50.7% | -3.6% | 1.3% | 0.12% | Healthy support |
| 0.40-0.60 | 250 | 49.2% | -7.7% | -0.8% | -0.17% | Concentrated |
| 0.60-0.80 | 152 | 57.2% | 5.4% | 7.9% | -0.18% | Very concentrated |
| 0.80-1.00 | 196 | 51.0% | -3.7% | 0.9% | -0.05% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 90 | 40.0% | -28.8% | -28.1% | -0.30% | 4.2 |
| Broad battle | 323 | 50.2% | -3.9% | 4.4% | 0.05% | 3.7 |
| One-wallet nuke | 488 | 50.8% | -3.7% | 0.1% | -0.07% | 3.9 |
| Thin support | 710 | 52.0% | -2.1% | 0.2% | -0.11% | 3.9 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=1085)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 35 | 54.3% | -2.8% | 33.4% | 1.05% | 4.0 | 91.4% |
| SMALL_MOVE | 203 | 50.2% | -6.0% | -0.3% | -0.50% | 4.0 | 100.0% |
| CLEAR_MOVE | 148 | 54.1% | -0.9% | 3.0% | 0.05% | 4.1 | 100.0% |
| NEAR_START | 415 | 50.4% | -4.0% | -2.6% | 0.00% | 3.7 | 100.0% |

**All Time** (n=1647)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 552 | 53.8% | -5.0% | -2.1% | -0.39% | 3.3 | 7.2% |
| SMALL_MOVE | 206 | 50.0% | -6.4% | -1.5% | -0.46% | 4.0 | 98.5% |
| CLEAR_MOVE | 174 | 54.0% | -0.7% | 2.8% | -0.02% | 4.1 | 100.0% |
| NEAR_START | 431 | 50.3% | -4.3% | -2.9% | 0.01% | 3.7 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 16 / 62.5% / 5.6% | 101 / 50.5% / -7.7% | 74 / 58.1% / 3.7% | 156 / 50.0% / -6.3% |
| 3.5-4★ | 11 / 36.4% / -29.3% | 57 / 56.1% / 8.4% | 43 / 44.2% / -19.0% | 99 / 53.5% / 6.9% |
| 2.5-3★ | 7 / 57.1% / 11.2% | 39 / 41.0% / -20.9% | 31 / 58.1% / 13.3% | 149 / 48.3% / -8.8% |
| 1.0-2★ | 1 / 100.0% / 57.1% | 6 / 50.0% / -16.4% | — | 11 / 54.5% / -3.9% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 1082 | 50.9% | -4.0% | 0.2% | 3.9 | -0.08% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 1132 | 51.0% | -4.1% | -0.0% | 3.9 | -0.08% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 1819 | 100% |
| LOCKED (direct) | 107 | 5.9% |
| Promoted (SHADOW→LOCKED) | 1202 | 66.1% |
| Rejected (stayed SHADOW) | 203 | 11.2% |
| Superseded (side flipped) | 302 | 16.6% |
| Muted | 627 | 34.5% |
| Cancelled | 20 | 1.1% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=1085)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | 5.78u | 0.3% | — |
| Flat 1.0u | -42.77u | -3.9% | +48.55u |
| Lock units only | -43.07u | — | +48.85u |
| Units change only on star change | -38.66u | — | +44.44u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 286 | 3.26 | -9.1% | -5.0% | -20.43u | Sizing hurts |
| 4.5 | 214 | 2.55 | 0.6% | 6.4% | +33.49u | Sizing helps |
| 4 | 198 | 1.21 | -5.0% | 7.9% | +28.91u | Sizing helps |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 143 | 0.72 | -1.7% | -4.9% | -2.54u | Sizing hurts |
| 2.5 | 156 | 0.46 | -6.2% | -2.7% | +7.84u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 16 | 0.44 | 7.2% | 17.9% | +0.09u | Neutral |

### All Time (n=1647)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -39.10u | -1.4% | — |
| Flat 1.0u | -72.29u | -4.4% | +33.19u |
| Lock units only | -77.18u | — | +38.08u |
| Units change only on star change | -82.70u | — | +43.60u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 299 | 3.23 | -9.1% | -5.3% | -24.02u | Sizing hurts |
| 4.5 | 248 | 2.56 | -1.1% | 3.3% | +23.47u | Sizing helps |
| 4 | 313 | 1.55 | -4.4% | 2.1% | +23.66u | Sizing helps |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 303 | 0.97 | -7.7% | -8.8% | -2.69u | Sizing hurts |
| 2.5 | 263 | 0.57 | -4.0% | 0.0% | +10.55u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 16 | 0.44 | 7.2% | 17.9% | +0.09u | Neutral |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 1085 | 52.8% | 51.0% | -1.8% | -3.9% | -0.08% | Neutral |
| 4.5-5★ | 500 | 53.0% | 51.4% | -1.6% | -4.9% | -0.07% | Neutral |
| 3.5-4★ | 266 | 52.0% | 50.0% | -2.0% | -2.5% | -0.30% | Below market |
| 2.5-3★ | 301 | 52.8% | 50.8% | -2.0% | -3.5% | 0.10% | Below market |
| CLEAR_MOVE only | 148 | 54.1% | 54.1% | -0.1% | -0.9% | 0.05% | Neutral |
| NO_MOVE only | 35 | 52.9% | 54.3% | +1.4% | -2.8% | 1.05% | Neutral |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=89)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 43.466 | 36.999 | 0.36 |  |
| Rank_norm | 48.064 | 37.607 | 0.39 |  |
| PnL_norm | 44.819 | 32.416 | 0.58 |  |
| WalletBase | 44.942 | 37.521 | 0.57 |  |
| SizeRatio | 1.258 | 1.276 | 0.01 |  |
| ConvictionMult | 0.935 | 0.957 | 0.14 |  |
| WalletCountFor | 2.919 | 4.045 | 0.56 |  |
| TopShare | 0.606 | 0.523 | 0.33 |  |
| ForSide | 135.004 | 148.547 | 0.12 |  |
| AgainstSide | 47.851 | 43.760 | 0.06 |  |
| NetEdge | 0.943 | 1.113 | 0.19 |  |
| WalletPlayScore | 0.856 | 1.710 | 0.35 |  |

### V8 Era (n=793)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 43.466 | 42.160 | 0.07 |  |
| Rank_norm | 48.064 | 56.409 | 0.31 |  |
| PnL_norm | 44.819 | 49.474 | 0.22 |  |
| WalletBase | 44.942 | 45.695 | 0.06 |  |
| SizeRatio | 1.258 | 1.341 | 0.07 |  |
| ConvictionMult | 0.935 | 0.955 | 0.13 |  |
| WalletCountFor | 2.919 | 2.919 | 0.00 |  |
| TopShare | 0.606 | 0.606 | 0.00 |  |
| ForSide | 135.004 | 135.004 | 0.00 |  |
| AgainstSide | 47.851 | 47.851 | 0.00 |  |
| NetEdge | 0.943 | 0.943 | 0.00 |  |
| WalletPlayScore | 0.856 | 0.856 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=1085)

No major failure modes detected.

### 7-Day (n=154)

- **Concentration issue**: 28 high-concentration picks (TopShare>0.6) at -14.2% ROI

### All Time (n=1647)

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
| V8 era picks | 1085 |
| V8 flat ROI | -3.9% |
| V8 model ROI | 0.3% |
| V8 star monotonicity score | -0.14 |
| 4.5-5★ ROI | -4.9% |
| 2.5-3★ ROI | -3.5% |
| CLEAR_MOVE ROI | -0.9% |
| NO_MOVE ROI | -2.8% |
| Single-wallet play rate | 43.0% |
| Whale override win rate | 80.0% |
| Avg CLV by star bucket | 5★: -0.24% | 4.5★: 0.16% | 4★: -0.38% | 3.5★: -0.07% | 3★: 0.67% | 2.5★: -0.42% | 2★: 0.67% | 1★: 0.10% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=1085)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 999 | 92.1% | 50.6% | -4.4% | -0.9% | -0.08% |
| MUTED | 75 | 6.9% | 56.0% | 2.2% | 20.8% | -0.11% |
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

### 7-Day (n=154)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 154 | 100.0% | 50.0% | -9.0% | 2.1% | 0.12% |

### All Time (n=1647)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 1559 | 94.7% | 51.6% | -4.9% | -2.4% | -0.19% |
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
