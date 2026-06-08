# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-06-08 ET
**Completed Picks**: 1173 | **V8 Era Picks**: 611 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (66.2%) beats 5★ (48.2%) |
| Model P/L vs flat P/L | ⚠️ | Model trails flat by 3.6u — sizing amplifying losses |
| Single-wallet dependency | ⚠️ | 30% of picks are single-wallet (WR: 56.8%, ROI: 6.5%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 57 | 59.6% | 6.56u | 11.5% | 13.01u | 11.4% | -0.11% | 2.96% | Strong |
| 7-Day | 107 | 56.1% | 7.43u | 6.9% | 15.01u | 7.1% | -0.22% | 0.41% | Strong |
| 14-Day | 229 | 54.6% | 2.92u | 1.3% | 21.77u | 4.7% | -0.32% | -0.47% |  |
| 30-Day | 407 | 53.1% | -2.89u | -0.7% | -10.77u | -1.3% | -0.10% | -0.48% |  |
| V8 Era | 611 | 51.6% | -13.80u | -2.3% | -17.42u | -1.6% | -0.10% | -0.44% |  |
| All Time | 1173 | 52.5% | -43.32u | -3.7% | -62.30u | -3.2% | -0.25% | -0.16% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=611)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 197 | 53.6% | 53.6% | 48.2% | -5.4% | -12.2% | -8.3% | 2.90 | -0.05% | Weak |
| 4.5 | 71 | 53.7% | 53.7% | 66.2% | +12.5% | 23.9% | 20.4% | 2.61 | -0.54% | Strong |
| 4 | 110 | 53.3% | 53.3% | 50.0% | -3.3% | -4.9% | 0.5% | 1.40 | 0.02% | Fair |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 78 | 53.3% | 53.3% | 51.3% | -2.1% | 0.2% | -10.9% | 0.90 | 0.15% | Fair |
| 2.5 | 74 | 53.5% | 53.5% | 50.0% | -3.5% | -3.6% | -11.6% | 0.69 | -0.24% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 9 | 54.3% | 54.3% | 44.4% | -9.9% | -19.3% | 14.3% | 0.53 | -0.01% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 48.2% | 66.2% | -18.0% | INVERTED |
| 4.5★ vs 4★ | 66.2% | 50.0% | +16.2% | Correct |
| 4★ vs 3.5★ | 50.0% | 51.5% | -1.5% | Flat |
| 3.5★ vs 3★ | 51.5% | 51.3% | +0.2% | Correct |
| 3★ vs 2.5★ | 51.3% | 50.0% | +1.3% | Correct |
| 2.5★ vs 2★ | 50.0% | 0.0% | +50.0% | Correct |
| 2★ vs 1★ | 0.0% | 44.4% | -44.4% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.476 |
| Spearman: Stars vs Flat ROI | 0.476 |
| Spearman: Stars vs CLV | -0.405 |
| Brier Score | 0.2467 |
| Monotonicity Score | -0.14 |

### All Time (n=1173)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 210 | 53.9% | 53.9% | 48.6% | -5.4% | -12.0% | -8.6% | 2.89 | 0.00% | Weak |
| 4.5 | 105 | 55.0% | 55.0% | 61.0% | +5.9% | 12.2% | 8.6% | 2.61 | 0.07% | Strong |
| 4 | 225 | 54.6% | 54.6% | 52.0% | -2.6% | -4.0% | -2.1% | 1.77 | -0.33% | Fair |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 238 | 54.6% | 54.6% | 49.6% | -5.0% | -8.7% | -10.9% | 1.11 | -0.32% | Weak |
| 2.5 | 181 | 54.0% | 54.0% | 53.0% | -1.0% | -1.9% | -3.1% | 0.72 | -0.57% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 9 | 54.3% | 54.3% | 44.4% | -9.9% | -19.3% | 14.3% | 0.53 | -0.01% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 48.6% | 61.0% | -12.4% | INVERTED |
| 4.5★ vs 4★ | 61.0% | 52.0% | +9.0% | Correct |
| 4★ vs 3.5★ | 52.0% | 56.5% | -4.5% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 49.6% | +6.9% | Correct |
| 3★ vs 2.5★ | 49.6% | 53.0% | -3.4% | INVERTED |
| 2.5★ vs 2★ | 53.0% | 0.0% | +53.0% | Correct |
| 2★ vs 1★ | 0.0% | 44.4% | -44.4% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.500 |
| Spearman: Stars vs Flat ROI | 0.500 |
| Spearman: Stars vs CLV | 0.071 |
| Brier Score | 0.2375 |
| Monotonicity Score | 0.14 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.170 | -0.062 | Tune |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.166 | -0.111 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.053 | -0.027 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.182 | -0.075 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | -0.034 | 0.011 | Monitor |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | -0.000 | 0.039 | Monitor |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | -0.159 | -0.048 | Tune |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.201 | -0.085 | Tune |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.001 | 0.045 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.164 | -0.081 | Tune |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | -0.021 | 0.008 | Monitor |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.210 | 0.105 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.221 | 0.114 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.190 | -0.091 | Tune |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (11.60–34.97) | 100 | 55.0% | -1.3% | -0.2% | -0.03% |  |
| p20-40 (35.00–43.70) | 101 | 57.4% | 10.3% | 8.3% | 0.07% |  |
| p40-60 (43.70–49.09) | 100 | 55.0% | 1.6% | 7.4% | -0.47% |  |
| p60-80 (49.14–54.76) | 101 | 42.6% | -14.1% | -12.3% | 0.15% |  |
| p80-95 (54.80–62.76) | 100 | 52.0% | 2.5% | -1.9% | 0.09% |  |
| p95+ (62.80–83.30) | 101 | 46.5% | -13.5% | -20.7% | -0.41% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 220 | 48.6% | -8.9% | -6.3% | -0.29% |  |
| 0.90-1.05 | 205 | 47.8% | -9.8% | -12.9% | 0.03% |  |
| 1.05-1.20 | 124 | 62.9% | 23.5% | 26.6% | 0.06% |  |
| 1.20-1.35 | 35 | 51.4% | -5.1% | -15.9% | 0.21% |  |
| 1.35-1.50 | 11 | 45.5% | -15.6% | -42.1% | -0.34% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.30) | 87 | 52.9% | -3.0% | 8.0% | -0.19% |  |
| 20-40% (0.30–0.67) | 87 | 60.9% | 13.4% | 11.7% | -0.17% |  |
| 40-60% (0.67–0.92) | 87 | 48.3% | -10.3% | 2.3% | -0.25% |  |
| 60-80% (0.93–1.23) | 87 | 56.3% | 12.9% | -0.1% | 0.28% |  |
| 80-95% (1.24–1.69) | 87 | 41.4% | -18.3% | -12.6% | 0.10% |  |
| 95%+ (1.70–6.68) | 88 | 46.6% | -13.5% | -10.7% | 0.06% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 29 | 34.5% | -29.2% | -32.9% | 0.26% | Broad support |
| 0.25-0.40 | 105 | 49.5% | -2.8% | -6.5% | 0.26% | Healthy support |
| 0.40-0.60 | 162 | 47.5% | -9.8% | 1.0% | -0.06% | Concentrated |
| 0.60-0.80 | 115 | 58.3% | 8.4% | 6.2% | -0.21% | Very concentrated |
| 0.80-1.00 | 112 | 54.5% | 1.0% | 3.0% | -0.14% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 58 | 36.2% | -32.6% | -32.9% | -0.12% | 4.3 |
| Broad battle | 220 | 47.7% | -6.9% | -3.1% | 0.08% | 3.9 |
| One-wallet nuke | 200 | 54.5% | 1.9% | 0.4% | -0.29% | 3.7 |
| Thin support | 356 | 54.5% | 1.7% | -0.6% | -0.17% | 3.8 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=611)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 22 | 54.5% | -1.3% | 25.3% | 0.34% | 4.3 | 86.4% |
| SMALL_MOVE | 130 | 47.7% | -11.8% | -2.5% | -0.44% | 4.1 | 100.0% |
| CLEAR_MOVE | 134 | 55.2% | 2.0% | 6.2% | 0.15% | 4.1 | 100.0% |
| NEAR_START | 245 | 50.6% | -1.0% | -7.4% | 0.06% | 3.8 | 100.0% |

**All Time** (n=1173)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 539 | 53.8% | -5.0% | -3.3% | -0.47% | 3.3 | 5.0% |
| SMALL_MOVE | 133 | 47.4% | -12.4% | -4.2% | -0.38% | 4.1 | 97.7% |
| CLEAR_MOVE | 160 | 55.0% | 1.7% | 5.5% | 0.06% | 4.1 | 100.0% |
| NEAR_START | 261 | 50.6% | -1.7% | -7.6% | 0.07% | 3.8 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 11 / 63.6% / 10.4% | 64 / 51.6% / -8.9% | 66 / 59.1% / 6.1% | 100 / 49.0% / -5.4% |
| 3.5-4★ | 8 / 37.5% / -29.6% | 43 / 48.8% / -6.5% | 39 / 46.2% / -14.5% | 63 / 60.3% / 22.6% |
| 2.5-3★ | 3 / 66.7% / 31.2% | 19 / 36.8% / -25.7% | 29 / 58.6% / 14.7% | 75 / 45.3% / -12.9% |
| 1.0-2★ | — | 4 / 25.0% / -51.2% | — | 7 / 42.9% / -24.2% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 608 | 51.5% | -2.4% | -1.8% | 4.0 | -0.10% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 658 | 51.5% | -2.7% | -2.0% | 4.0 | -0.10% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 1002 | 100% |
| LOCKED (direct) | 87 | 8.7% |
| Promoted (SHADOW→LOCKED) | 620 | 61.9% |
| Rejected (stayed SHADOW) | 178 | 17.8% |
| Superseded (side flipped) | 112 | 11.2% |
| Muted | 370 | 36.9% |
| Cancelled | 20 | 2.0% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=611)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -17.42u | -1.6% | — |
| Flat 1.0u | -13.80u | -2.3% | -3.62u |
| Lock units only | -5.77u | — | -11.65u |
| Units change only on star change | -1.36u | — | -16.06u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 197 | 2.90 | -12.2% | -8.3% | -23.30u | Sizing hurts |
| 4.5 | 71 | 2.61 | 23.9% | 20.4% | +20.96u | Sizing helps |
| 4 | 110 | 1.40 | -4.9% | 0.5% | +6.17u | Sizing helps |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 78 | 0.90 | 0.2% | -10.9% | -7.82u | Sizing hurts |
| 2.5 | 74 | 0.69 | -3.6% | -11.6% | -3.25u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 9 | 0.53 | -19.3% | 14.3% | +2.42u | Sizing helps |

### All Time (n=1173)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -62.30u | -3.2% | — |
| Flat 1.0u | -43.32u | -3.7% | -18.98u |
| Lock units only | -39.88u | — | -22.42u |
| Units change only on star change | -45.40u | — | -16.90u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 210 | 2.89 | -12.0% | -8.6% | -26.89u | Sizing hurts |
| 4.5 | 105 | 2.61 | 12.2% | 8.6% | +10.95u | Sizing helps |
| 4 | 225 | 1.77 | -4.0% | -2.1% | +0.93u | Sizing helps |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 238 | 1.11 | -8.7% | -10.9% | -7.96u | Sizing hurts |
| 2.5 | 181 | 0.72 | -1.9% | -3.1% | -0.54u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 9 | 0.53 | -19.3% | 14.3% | +2.42u | Sizing helps |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 611 | 53.3% | 51.6% | -1.7% | -2.3% | -0.10% | Neutral |
| 4.5-5★ | 268 | 53.7% | 53.0% | -0.7% | -2.7% | -0.18% | Neutral |
| 3.5-4★ | 178 | 52.5% | 50.6% | -1.9% | -1.2% | -0.01% | Neutral |
| 2.5-3★ | 154 | 53.4% | 51.3% | -2.1% | -0.5% | -0.05% | Below market |
| CLEAR_MOVE only | 134 | 54.2% | 55.2% | +1.0% | 2.0% | 0.15% | Neutral |
| NO_MOVE only | 22 | 54.8% | 54.5% | -0.2% | -1.3% | 0.34% | Neutral |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=76)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 44.894 | 29.435 | 0.85 |  |
| Rank_norm | 60.040 | 61.339 | 0.06 |  |
| PnL_norm | 53.122 | 56.682 | 0.21 |  |
| WalletBase | 48.736 | 40.041 | 0.65 |  |
| SizeRatio | 1.432 | 1.149 | 0.21 |  |
| ConvictionMult | 0.966 | 0.940 | 0.16 |  |
| WalletCountFor | 2.927 | 2.289 | 0.36 |  |
| TopShare | 0.593 | 0.717 | 0.51 |  |
| ForSide | 147.690 | 99.533 | 0.44 |  |
| AgainstSide | 49.602 | 51.255 | 0.02 |  |
| NetEdge | 1.055 | 0.560 | 0.58 |  |
| WalletPlayScore | 1.046 | -0.264 | 0.56 |  |

### V8 Era (n=523)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 44.894 | 43.808 | 0.06 |  |
| Rank_norm | 60.040 | 63.431 | 0.16 |  |
| PnL_norm | 53.122 | 54.338 | 0.07 |  |
| WalletBase | 48.736 | 48.356 | 0.03 |  |
| SizeRatio | 1.432 | 1.434 | 0.00 |  |
| ConvictionMult | 0.966 | 0.971 | 0.03 |  |
| WalletCountFor | 2.927 | 2.927 | 0.00 |  |
| TopShare | 0.593 | 0.593 | 0.00 |  |
| ForSide | 147.690 | 147.690 | 0.00 |  |
| AgainstSide | 49.602 | 49.602 | 0.00 |  |
| NetEdge | 1.055 | 1.055 | 0.00 |  |
| WalletPlayScore | 1.046 | 1.046 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=611)

- **Sizing issue**: Model P/L (-17.42u) trails flat (-13.80u) by 3.62u

### 7-Day (n=107)

No major failure modes detected.

### All Time (n=1173)

- **Sizing issue**: Model P/L (-62.30u) trails flat (-43.32u) by 18.98u
- **Environment issue**: 46.0% NO_MOVE (WR: 53.8%, ROI: -5.0%)


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
| V8 era picks | 611 |
| V8 flat ROI | -2.3% |
| V8 model ROI | -1.6% |
| V8 star monotonicity score | -0.14 |
| 4.5-5★ ROI | -2.7% |
| 2.5-3★ ROI | -0.5% |
| CLEAR_MOVE ROI | 2.0% |
| NO_MOVE ROI | -1.3% |
| Single-wallet play rate | 30.3% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: -0.05% | 4.5★: -0.54% | 4★: 0.02% | 3.5★: -0.07% | 3★: 0.15% | 2.5★: -0.24% | 2★: 0.67% | 1★: -0.01% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=611)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 525 | 85.9% | 50.9% | -2.9% | -4.2% | -0.10% |
| MUTED | 75 | 12.3% | 56.0% | 2.2% | 20.8% | -0.11% |
| CANCELLED | 11 | 1.8% | 54.5% | -2.8% | -10.4% | 0.16% |

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

### 7-Day (n=107)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 107 | 100.0% | 56.1% | 6.9% | 7.1% | -0.22% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| opp_side_stronger_diag | 1 | 0.0% |

### All Time (n=1173)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 1085 | 92.5% | 52.2% | -4.4% | -4.8% | -0.25% |
| MUTED | 75 | 6.4% | 56.0% | 2.2% | 20.8% | -0.11% |
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
