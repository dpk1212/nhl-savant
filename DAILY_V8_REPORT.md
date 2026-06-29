# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-06-29 ET
**Completed Picks**: 1576 | **V8 Era Picks**: 1014 | **V8 Since**: 2026-04-18
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
| Single-wallet dependency | ⚠️ | 43% of picks are single-wallet (WR: 52.2%, ROI: -1.2%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 69 | 47.8% | -12.87u | -18.6% | -3.26u | -3.0% | -0.06% | 0.14% |  |
| 7-Day | 157 | 49.0% | -18.65u | -11.9% | -7.41u | -2.6% | 0.11% | 1.61% |  |
| 14-Day | 287 | 49.1% | -29.60u | -10.3% | 5.59u | 1.1% | 0.13% | 0.38% |  |
| 30-Day | 543 | 51.0% | -25.53u | -4.7% | 24.56u | 2.4% | -0.10% | 0.02% |  |
| V8 Era | 1014 | 50.8% | -45.00u | -4.4% | -7.16u | -0.4% | -0.08% | -0.34% |  |
| All Time | 1576 | 51.8% | -74.51u | -4.7% | -52.04u | -1.9% | -0.20% | -0.14% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=1014)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 278 | 53.8% | 53.8% | 50.4% | -3.4% | -8.3% | -4.0% | 3.23 | -0.21% | Weak |
| 4.5 | 199 | 52.1% | 52.1% | 53.3% | +1.2% | 0.4% | 6.6% | 2.53 | 0.22% | Fair |
| 4 | 189 | 52.5% | 52.5% | 48.1% | -4.3% | -8.0% | 2.8% | 1.22 | -0.38% | Weak |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 127 | 52.5% | 52.5% | 50.4% | -2.1% | -4.0% | -6.4% | 0.75 | 0.53% | Fair |
| 2.5 | 134 | 53.4% | 53.4% | 50.7% | -2.7% | -4.7% | -16.7% | 0.49 | -0.41% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 15 | 52.7% | 52.7% | 60.0% | +7.3% | 5.8% | 20.8% | 0.40 | 0.11% | Strong |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 50.4% | 53.3% | -2.9% | Flat |
| 4.5★ vs 4★ | 53.3% | 48.1% | +5.2% | Correct |
| 4★ vs 3.5★ | 48.1% | 51.5% | -3.4% | INVERTED |
| 3.5★ vs 3★ | 51.5% | 50.4% | +1.1% | Correct |
| 3★ vs 2.5★ | 50.4% | 50.7% | -0.3% | Flat |
| 2.5★ vs 2★ | 50.7% | 0.0% | +50.7% | Correct |
| 2★ vs 1★ | 0.0% | 60.0% | -60.0% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | -0.143 |
| Spearman: Stars vs Flat ROI | -0.214 |
| Spearman: Stars vs CLV | -0.286 |
| Brier Score | 0.2412 |
| Monotonicity Score | 0.14 |

**⚠️ RANKING LAYER IS MISCALIBRATED** — higher stars are not producing better ROI

### All Time (n=1576)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 291 | 54.0% | 54.0% | 50.5% | -3.5% | -8.3% | -4.3% | 3.20 | -0.16% | Weak |
| 4.5 | 233 | 52.9% | 52.9% | 52.8% | -0.1% | -1.5% | 3.3% | 2.54 | 0.39% | Fair |
| 4 | 304 | 53.8% | 53.8% | 50.3% | -3.5% | -6.2% | -0.5% | 1.56 | -0.51% | Weak |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 287 | 54.0% | 54.0% | 49.5% | -4.5% | -9.0% | -9.4% | 1.00 | -0.03% | Weak |
| 2.5 | 241 | 53.9% | 53.9% | 52.7% | -1.2% | -2.9% | -6.2% | 0.60 | -0.58% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 15 | 52.7% | 52.7% | 60.0% | +7.3% | 5.8% | 20.8% | 0.40 | 0.11% | Strong |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 50.5% | 52.8% | -2.3% | Flat |
| 4.5★ vs 4★ | 52.8% | 50.3% | +2.5% | Correct |
| 4★ vs 3.5★ | 50.3% | 56.5% | -6.2% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 49.5% | +7.0% | Correct |
| 3★ vs 2.5★ | 49.5% | 52.7% | -3.2% | INVERTED |
| 2.5★ vs 2★ | 52.7% | 0.0% | +52.7% | Correct |
| 2★ vs 1★ | 0.0% | 60.0% | -60.0% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | -0.048 |
| Spearman: Stars vs Flat ROI | -0.095 |
| Spearman: Stars vs CLV | -0.214 |
| Brier Score | 0.2363 |
| Monotonicity Score | 0.14 |

**⚠️ RANKING LAYER IS MISCALIBRATED** — higher stars are not producing better ROI


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.083 | -0.015 | Tune |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.152 | -0.094 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.086 | -0.041 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.121 | -0.033 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | -0.060 | -0.011 | Tune |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | -0.035 | 0.012 | Monitor |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | -0.126 | -0.031 | Tune |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.173 | -0.091 | Tune |
| AgainstSide | Opposition | Force against side | Higher → worse | -0.002 | 0.034 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.135 | -0.082 | Tune |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | -0.005 | -0.013 | Monitor |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.171 | 0.109 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.173 | 0.114 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.147 | -0.094 | Tune |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (10.60–33.33) | 167 | 44.9% | -18.7% | -6.6% | 0.12% |  |
| p20-40 (33.35–39.00) | 168 | 55.4% | 1.4% | 8.6% | -0.04% |  |
| p40-60 (39.13–44.70) | 168 | 56.0% | 8.1% | -3.2% | -0.70% |  |
| p60-80 (44.70–50.92) | 167 | 50.9% | -4.9% | 9.2% | -0.19% |  |
| p80-95 (50.93–58.30) | 168 | 50.0% | -1.9% | -3.0% | 0.56% |  |
| p95+ (58.36–83.30) | 168 | 47.0% | -11.3% | -9.9% | -0.21% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 444 | 48.0% | -10.0% | -4.0% | -0.35% |  |
| 0.90-1.05 | 323 | 48.9% | -8.8% | -7.0% | 0.18% |  |
| 1.05-1.20 | 165 | 64.2% | 24.1% | 28.7% | -0.08% |  |
| 1.20-1.35 | 45 | 44.4% | -18.5% | -23.2% | 1.21% |  |
| 1.35-1.50 | 13 | 38.5% | -28.6% | -47.4% | -0.54% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-2.06–0.19) | 124 | 49.2% | -6.2% | -1.3% | -0.39% |  |
| 20-40% (0.19–0.51) | 125 | 56.8% | 4.1% | 9.0% | -0.17% |  |
| 40-60% (0.52–0.80) | 125 | 53.6% | -0.0% | 5.3% | -0.05% |  |
| 60-80% (0.80–1.11) | 125 | 51.2% | -2.1% | -1.0% | 0.26% |  |
| 80-95% (1.11–1.60) | 125 | 45.6% | -12.2% | -8.4% | -0.09% |  |
| 95%+ (1.60–6.68) | 125 | 48.0% | -12.0% | -7.3% | -0.03% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 39 | 38.5% | -26.0% | -25.6% | 0.18% | Broad support |
| 0.25-0.40 | 141 | 48.2% | -8.1% | -2.8% | 0.07% | Healthy support |
| 0.40-0.60 | 234 | 49.1% | -7.8% | -2.4% | -0.18% | Concentrated |
| 0.60-0.80 | 145 | 57.9% | 6.6% | 8.0% | -0.16% | Very concentrated |
| 0.80-1.00 | 190 | 51.6% | -2.7% | 0.9% | -0.04% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 84 | 39.3% | -30.5% | -32.5% | -0.28% | 4.2 |
| Broad battle | 302 | 48.7% | -6.8% | 0.8% | 0.01% | 3.8 |
| One-wallet nuke | 455 | 51.2% | -3.2% | 1.3% | -0.06% | 3.9 |
| Thin support | 670 | 52.4% | -1.5% | 0.7% | -0.10% | 3.9 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=1014)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 35 | 54.3% | -2.8% | 33.4% | 1.05% | 4.0 | 91.4% |
| SMALL_MOVE | 192 | 50.0% | -6.8% | -1.0% | -0.54% | 4.1 | 100.0% |
| CLEAR_MOVE | 148 | 54.1% | -0.9% | 3.0% | 0.05% | 4.1 | 100.0% |
| NEAR_START | 382 | 49.7% | -5.0% | -6.3% | 0.01% | 3.7 | 100.0% |

**All Time** (n=1576)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 552 | 53.8% | -5.0% | -2.1% | -0.39% | 3.3 | 7.2% |
| SMALL_MOVE | 195 | 49.7% | -7.3% | -2.2% | -0.50% | 4.1 | 98.5% |
| CLEAR_MOVE | 174 | 54.0% | -0.7% | 2.8% | -0.02% | 4.1 | 100.0% |
| NEAR_START | 398 | 49.7% | -5.3% | -6.5% | 0.02% | 3.7 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 16 / 62.5% / 5.6% | 97 / 50.5% / -8.5% | 74 / 58.1% / 3.7% | 146 / 49.3% / -7.1% |
| 3.5-4★ | 11 / 36.4% / -29.3% | 55 / 56.4% / 8.7% | 43 / 44.2% / -19.0% | 96 / 53.1% / 6.0% |
| 2.5-3★ | 7 / 57.1% / 11.2% | 35 / 40.0% / -23.8% | 31 / 58.1% / 13.3% | 129 / 47.3% / -10.9% |
| 1.0-2★ | 1 / 100.0% / 57.1% | 5 / 40.0% / -25.6% | — | 11 / 54.5% / -3.9% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 1011 | 50.7% | -4.5% | -0.5% | 4.0 | -0.08% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 1061 | 50.8% | -4.6% | -0.7% | 4.0 | -0.08% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 1694 | 100% |
| LOCKED (direct) | 105 | 6.2% |
| Promoted (SHADOW→LOCKED) | 1127 | 66.5% |
| Rejected (stayed SHADOW) | 201 | 11.9% |
| Superseded (side flipped) | 256 | 15.1% |
| Muted | 586 | 34.6% |
| Cancelled | 20 | 1.2% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=1014)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -7.16u | -0.4% | — |
| Flat 1.0u | -45.00u | -4.4% | +37.84u |
| Lock units only | -36.01u | — | +28.85u |
| Units change only on star change | -31.61u | — | +24.45u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 278 | 3.23 | -8.3% | -4.0% | -12.40u | Sizing hurts |
| 4.5 | 199 | 2.53 | 0.4% | 6.6% | +32.74u | Sizing helps |
| 4 | 189 | 1.22 | -8.0% | 2.8% | +21.60u | Sizing helps |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 127 | 0.75 | -4.0% | -6.4% | -1.03u | Sizing hurts |
| 2.5 | 134 | 0.49 | -4.7% | -16.7% | -4.66u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 15 | 0.40 | 5.8% | 20.8% | +0.38u | Neutral |

### All Time (n=1576)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -52.04u | -1.9% | — |
| Flat 1.0u | -74.51u | -4.7% | +22.47u |
| Lock units only | -70.13u | — | +18.09u |
| Units change only on star change | -75.65u | — | +23.61u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 291 | 3.20 | -8.3% | -4.3% | -15.99u | Sizing hurts |
| 4.5 | 233 | 2.54 | -1.5% | 3.3% | +22.73u | Sizing helps |
| 4 | 304 | 1.56 | -6.2% | -0.5% | +16.36u | Sizing helps |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 287 | 1.00 | -9.0% | -9.4% | -1.18u | Sizing hurts |
| 2.5 | 241 | 0.60 | -2.9% | -6.2% | -1.95u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 15 | 0.40 | 5.8% | 20.8% | +0.38u | Neutral |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 1014 | 52.8% | 50.8% | -2.0% | -4.4% | -0.08% | Below market |
| 4.5-5★ | 477 | 53.0% | 51.6% | -1.5% | -4.7% | -0.03% | Neutral |
| 3.5-4★ | 257 | 52.1% | 49.0% | -3.1% | -4.7% | -0.30% | Below market |
| 2.5-3★ | 263 | 53.0% | 51.0% | -2.0% | -3.6% | 0.05% | Below market |
| CLEAR_MOVE only | 148 | 54.1% | 54.1% | -0.1% | -0.9% | 0.05% | Neutral |
| NO_MOVE only | 35 | 52.9% | 54.3% | +1.4% | -2.8% | 1.05% | Neutral |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=81)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 43.939 | 38.145 | 0.32 |  |
| Rank_norm | 49.268 | 36.255 | 0.49 |  |
| PnL_norm | 46.052 | 35.274 | 0.51 |  |
| WalletBase | 45.649 | 39.374 | 0.49 |  |
| SizeRatio | 1.268 | 1.247 | 0.02 |  |
| ConvictionMult | 0.935 | 0.930 | 0.03 |  |
| WalletCountFor | 2.861 | 3.284 | 0.22 |  |
| TopShare | 0.612 | 0.612 | 0.00 |  |
| ForSide | 134.305 | 116.998 | 0.16 |  |
| AgainstSide | 47.768 | 35.784 | 0.16 |  |
| NetEdge | 0.937 | 0.866 | 0.08 |  |
| WalletPlayScore | 0.810 | 0.823 | 0.01 |  |

### V8 Era (n=749)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 43.939 | 42.455 | 0.08 |  |
| Rank_norm | 49.268 | 57.244 | 0.30 |  |
| PnL_norm | 46.052 | 50.446 | 0.21 |  |
| WalletBase | 45.649 | 46.186 | 0.04 |  |
| SizeRatio | 1.268 | 1.342 | 0.06 |  |
| ConvictionMult | 0.935 | 0.954 | 0.12 |  |
| WalletCountFor | 2.861 | 2.861 | 0.00 |  |
| TopShare | 0.612 | 0.612 | 0.00 |  |
| ForSide | 134.305 | 134.305 | 0.00 |  |
| AgainstSide | 47.768 | 47.768 | 0.00 |  |
| NetEdge | 0.937 | 0.937 | 0.00 |  |
| WalletPlayScore | 0.810 | 0.810 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=1014)

No major failure modes detected.

### 7-Day (n=157)

- **Ranking issue**: ≤3★ WR (53%) beats ≥4★ (47%)
- **Concentration issue**: 36 high-concentration picks (TopShare>0.6) at -18.5% ROI

### All Time (n=1576)

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
| V8 era picks | 1014 |
| V8 flat ROI | -4.4% |
| V8 model ROI | -0.4% |
| V8 star monotonicity score | 0.14 |
| 4.5-5★ ROI | -4.7% |
| 2.5-3★ ROI | -3.6% |
| CLEAR_MOVE ROI | -0.9% |
| NO_MOVE ROI | -2.8% |
| Single-wallet play rate | 42.9% |
| Whale override win rate | 80.0% |
| Avg CLV by star bucket | 5★: -0.21% | 4.5★: 0.22% | 4★: -0.38% | 3.5★: -0.07% | 3★: 0.53% | 2.5★: -0.41% | 2★: 0.67% | 1★: 0.11% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=1014)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 928 | 91.5% | 50.3% | -5.0% | -1.7% | -0.08% |
| MUTED | 75 | 7.4% | 56.0% | 2.2% | 20.8% | -0.11% |
| CANCELLED | 11 | 1.1% | 54.5% | -2.8% | -10.4% | 0.16% |

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

### 7-Day (n=157)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 157 | 100.0% | 49.0% | -11.9% | -2.6% | 0.11% |

### All Time (n=1576)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 1488 | 94.4% | 51.5% | -5.3% | -3.0% | -0.19% |
| MUTED | 75 | 4.8% | 56.0% | 2.2% | 20.8% | -0.11% |
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
