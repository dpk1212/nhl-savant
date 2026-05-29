# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-05-29 ET
**Completed Picks**: 1010 | **V8 Era Picks**: 448 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (64.9%) beats 5★ (49.7%) |
| Model P/L vs flat P/L | ⚠️ | Model trails flat by 14.2u — sizing amplifying losses |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 47 | 55.3% | 0.15u | 0.3% | 7.95u | 9.0% | -0.09% | -0.86% | Strong |
| 7-Day | 129 | 52.7% | -4.09u | -3.2% | -11.42u | -4.7% | 0.03% | -0.75% |  |
| 14-Day | 192 | 52.1% | -6.05u | -3.1% | -21.80u | -5.9% | 0.06% | -0.68% |  |
| 30-Day | 302 | 52.0% | -7.59u | -2.5% | -19.56u | -3.4% | -0.05% | -0.55% |  |
| V8 Era | 448 | 50.7% | -16.97u | -3.8% | -31.19u | -4.0% | 0.00% | -0.49% |  |
| All Time | 1010 | 52.3% | -46.49u | -4.6% | -76.07u | -4.6% | -0.23% | -0.15% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=448)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 147 | 54.0% | 54.0% | 49.7% | -4.3% | -10.5% | -7.7% | 2.75 | 0.05% | Weak |
| 4.5 | 37 | 53.7% | 53.7% | 64.9% | +11.1% | 22.9% | 14.4% | 2.63 | -0.44% | Strong |
| 4 | 75 | 53.6% | 53.6% | 49.3% | -4.3% | -7.2% | -1.9% | 1.48 | 0.35% | Weak |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 54 | 53.3% | 53.3% | 48.1% | -5.2% | -5.3% | -14.0% | 1.02 | 0.18% | Weak |
| 2.5 | 58 | 52.2% | 52.2% | 48.3% | -3.9% | -5.8% | -19.9% | 0.75 | -0.34% | Weak |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 5 | 52.1% | 52.1% | 40.0% | -12.1% | -26.0% | 12.3% | 0.60 | 0.21% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 49.7% | 64.9% | -15.2% | INVERTED |
| 4.5★ vs 4★ | 64.9% | 49.3% | +15.6% | Correct |
| 4★ vs 3.5★ | 49.3% | 51.5% | -2.2% | Flat |
| 3.5★ vs 3★ | 51.5% | 48.1% | +3.4% | Correct |
| 3★ vs 2.5★ | 48.1% | 48.3% | -0.2% | Flat |
| 2.5★ vs 2★ | 48.3% | 0.0% | +48.3% | Correct |
| 2★ vs 1★ | 0.0% | 40.0% | -40.0% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.833 |
| Spearman: Stars vs Flat ROI | 0.476 |
| Spearman: Stars vs CLV | -0.429 |
| Brier Score | 0.2454 |
| Monotonicity Score | 0.14 |

### All Time (n=1010)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 160 | 54.4% | 54.4% | 50.0% | -4.4% | -10.4% | -8.2% | 2.74 | 0.11% | Weak |
| 4.5 | 71 | 55.6% | 55.6% | 57.7% | +2.1% | 6.0% | -0.1% | 2.62 | 0.43% | Strong |
| 4 | 190 | 55.0% | 55.0% | 52.1% | -2.9% | -4.8% | -3.1% | 1.87 | -0.27% | Fair |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 214 | 54.7% | 54.7% | 48.6% | -6.1% | -11.0% | -11.5% | 1.16 | -0.38% | Weak |
| 2.5 | 165 | 53.7% | 53.7% | 52.7% | -0.9% | -2.5% | -5.5% | 0.74 | -0.64% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 5 | 52.1% | 52.1% | 40.0% | -12.1% | -26.0% | 12.3% | 0.60 | 0.21% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 50.0% | 57.7% | -7.7% | INVERTED |
| 4.5★ vs 4★ | 57.7% | 52.1% | +5.6% | Correct |
| 4★ vs 3.5★ | 52.1% | 56.5% | -4.4% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 48.6% | +7.9% | Correct |
| 3★ vs 2.5★ | 48.6% | 52.7% | -4.1% | INVERTED |
| 2.5★ vs 2★ | 52.7% | 0.0% | +52.7% | Correct |
| 2★ vs 1★ | 0.0% | 40.0% | -40.0% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.595 |
| Spearman: Stars vs Flat ROI | 0.595 |
| Spearman: Stars vs CLV | -0.048 |
| Brier Score | 0.2354 |
| Monotonicity Score | 0.14 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.180 | -0.058 | Tune |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.150 | -0.100 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.090 | -0.054 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.202 | -0.087 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | 0.005 | 0.053 | Monitor |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | 0.033 | 0.080 | Keep |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | -0.138 | -0.024 | Tune |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.155 | -0.039 | Tune |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.012 | 0.070 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.107 | -0.038 | Tune |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.030 | 0.064 | Monitor |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.163 | 0.049 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.181 | 0.062 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.139 | -0.038 | Tune |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (11.60–38.70) | 73 | 57.5% | 4.4% | -2.9% | -0.12% |  |
| p20-40 (39.33–46.93) | 73 | 47.9% | -10.0% | -5.5% | 0.02% |  |
| p40-60 (47.00–51.72) | 74 | 51.4% | -4.6% | 4.7% | 0.03% |  |
| p60-80 (51.73–57.33) | 73 | 52.1% | 10.6% | 2.6% | 0.23% |  |
| p80-95 (57.44–64.75) | 73 | 49.3% | -8.9% | -9.1% | -0.02% |  |
| p95+ (64.77–83.30) | 74 | 44.6% | -15.6% | -19.7% | -0.13% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 149 | 48.3% | -10.2% | -2.1% | -0.03% |  |
| 0.90-1.05 | 148 | 43.9% | -16.8% | -22.7% | 0.00% |  |
| 1.05-1.20 | 98 | 63.3% | 24.6% | 24.5% | 0.11% |  |
| 1.20-1.35 | 27 | 51.9% | -2.5% | -18.0% | 0.32% |  |
| 1.35-1.50 | 11 | 45.5% | -15.6% | -42.1% | -0.34% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.53) | 65 | 56.9% | 3.9% | 8.1% | -0.14% |  |
| 20-40% (0.53–0.82) | 65 | 49.2% | -8.4% | 3.3% | 0.12% |  |
| 40-60% (0.82–1.07) | 65 | 52.3% | 6.3% | 4.2% | -0.19% |  |
| 60-80% (1.07–1.34) | 65 | 46.2% | -10.7% | -20.3% | 0.23% |  |
| 80-95% (1.35–1.94) | 65 | 44.6% | -16.0% | -7.5% | -0.07% |  |
| 95%+ (1.96–4.76) | 66 | 48.5% | -7.8% | -8.7% | 0.21% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 25 | 40.0% | -17.9% | -29.7% | 0.41% | Broad support |
| 0.25-0.40 | 94 | 50.0% | -1.6% | -6.1% | 0.22% | Healthy support |
| 0.40-0.60 | 129 | 45.7% | -11.7% | -1.3% | -0.10% | Concentrated |
| 0.60-0.80 | 79 | 54.4% | 1.3% | -2.1% | 0.04% | Very concentrated |
| 0.80-1.00 | 64 | 54.7% | -1.8% | -0.7% | -0.16% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 50 | 36.0% | -32.2% | -33.2% | -0.06% | 4.4 |
| Broad battle | 179 | 46.9% | -7.5% | -4.6% | 0.03% | 3.9 |
| One-wallet nuke | 121 | 56.2% | 2.6% | 2.4% | -0.16% | 3.5 |
| Thin support | 231 | 53.7% | -0.7% | -1.3% | 0.00% | 3.6 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=448)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 17 | 47.1% | -16.8% | 12.4% | 0.26% | 4.2 | 82.4% |
| SMALL_MOVE | 93 | 46.2% | -14.3% | -8.3% | -0.20% | 4.1 | 100.0% |
| CLEAR_MOVE | 116 | 56.9% | 4.9% | 8.3% | 0.13% | 4.1 | 100.0% |
| NEAR_START | 173 | 47.4% | -5.8% | -14.0% | 0.06% | 3.8 | 100.0% |

**All Time** (n=1010)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 534 | 53.6% | -5.5% | -4.2% | -0.48% | 3.3 | 4.1% |
| SMALL_MOVE | 96 | 45.8% | -14.9% | -10.4% | -0.12% | 4.1 | 96.9% |
| CLEAR_MOVE | 142 | 56.3% | 4.1% | 7.1% | 0.03% | 4.1 | 100.0% |
| NEAR_START | 189 | 47.6% | -6.3% | -13.9% | 0.09% | 3.8 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 8 / 62.5% / 6.3% | 42 / 47.6% / -18.1% | 56 / 62.5% / 12.0% | 67 / 46.3% / -9.7% |
| 3.5-4★ | 7 / 28.6% / -46.2% | 36 / 47.2% / -8.7% | 35 / 45.7% / -17.0% | 47 / 59.6% / 22.6% |
| 2.5-3★ | 2 / 50.0% / -5.8% | 12 / 41.7% / -12.5% | 25 / 60.0% / 19.5% | 55 / 40.0% / -21.6% |
| 1.0-2★ | — | 3 / 33.3% / -34.9% | — | 4 / 25.0% / -56.3% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 445 | 50.6% | -4.0% | -4.3% | 3.9 | -0.00% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 495 | 50.7% | -4.2% | -4.3% | 3.9 | -0.01% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 734 | 100% |
| LOCKED (direct) | 78 | 10.6% |
| Promoted (SHADOW→LOCKED) | 418 | 56.9% |
| Rejected (stayed SHADOW) | 162 | 22.1% |
| Superseded (side flipped) | 71 | 9.7% |
| Muted | 294 | 40.1% |
| Cancelled | 20 | 2.7% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=448)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -31.19u | -4.0% | — |
| Flat 1.0u | -16.97u | -3.8% | -14.22u |
| Lock units only | -21.67u | — | -9.52u |
| Units change only on star change | -17.27u | — | -13.92u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 147 | 2.75 | -10.5% | -7.7% | -15.79u | Sizing hurts |
| 4.5 | 37 | 2.63 | 22.9% | 14.4% | +5.60u | Sizing helps |
| 4 | 75 | 1.48 | -7.2% | -1.9% | +3.32u | Sizing helps |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 54 | 1.02 | -5.3% | -14.0% | -4.92u | Sizing hurts |
| 2.5 | 58 | 0.75 | -5.8% | -19.9% | -5.30u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 5 | 0.60 | -26.0% | 12.3% | +1.67u | Sizing helps |

### All Time (n=1010)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -76.07u | -4.6% | — |
| Flat 1.0u | -46.49u | -4.6% | -29.58u |
| Lock units only | -55.79u | — | -20.28u |
| Units change only on star change | -61.31u | — | -14.76u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 160 | 2.74 | -10.4% | -8.2% | -19.38u | Sizing hurts |
| 4.5 | 71 | 2.62 | 6.0% | -0.1% | -4.41u | Sizing hurts |
| 4 | 190 | 1.87 | -4.8% | -3.1% | -1.92u | Sizing hurts |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 214 | 1.16 | -11.0% | -11.5% | -5.07u | Sizing hurts |
| 2.5 | 165 | 0.74 | -2.5% | -5.5% | -2.59u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 5 | 0.60 | -26.0% | 12.3% | +1.67u | Sizing helps |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 448 | 53.2% | 50.7% | -2.5% | -3.8% | 0.00% | Below market |
| 4.5-5★ | 184 | 53.9% | 52.7% | -1.2% | -3.8% | -0.05% | Neutral |
| 3.5-4★ | 143 | 52.5% | 50.3% | -2.1% | -1.5% | 0.15% | Below market |
| 2.5-3★ | 114 | 52.8% | 49.1% | -3.6% | -3.9% | -0.10% | Below market |
| CLEAR_MOVE only | 116 | 54.3% | 56.9% | +2.6% | 4.9% | 0.13% | Beating market |
| NO_MOVE only | 17 | 54.8% | 47.1% | -7.7% | -16.8% | 0.26% | Below market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=109)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 49.310 | 32.629 | 1.05 | ⚠️ |
| Rank_norm | 62.254 | 60.616 | 0.08 |  |
| PnL_norm | 53.408 | 52.773 | 0.04 |  |
| WalletBase | 51.653 | 40.572 | 0.84 |  |
| SizeRatio | 1.554 | 1.227 | 0.22 |  |
| ConvictionMult | 0.978 | 0.950 | 0.17 |  |
| WalletCountFor | 3.151 | 2.541 | 0.34 |  |
| TopShare | 0.553 | 0.674 | 0.52 |  |
| ForSide | 166.149 | 108.036 | 0.53 |  |
| AgainstSide | 53.067 | 31.421 | 0.26 |  |
| NetEdge | 1.210 | 0.813 | 0.49 |  |
| WalletPlayScore | 1.460 | 0.307 | 0.52 |  |

### V8 Era (n=391)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 49.310 | 48.872 | 0.03 |  |
| Rank_norm | 62.254 | 64.559 | 0.11 |  |
| PnL_norm | 53.408 | 53.979 | 0.03 |  |
| WalletBase | 51.653 | 51.454 | 0.02 |  |
| SizeRatio | 1.554 | 1.529 | 0.02 |  |
| ConvictionMult | 0.978 | 0.978 | 0.00 |  |
| WalletCountFor | 3.151 | 3.151 | 0.00 |  |
| TopShare | 0.553 | 0.553 | 0.00 |  |
| ForSide | 166.149 | 166.149 | 0.00 |  |
| AgainstSide | 53.067 | 53.067 | 0.00 |  |
| NetEdge | 1.210 | 1.210 | 0.00 |  |
| WalletPlayScore | 1.460 | 1.460 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=448)

- **Sizing issue**: Model P/L (-31.19u) trails flat (-16.97u) by 14.22u
- **Gate issue**: NO_MOVE ROI (-16.8%) significantly trails CLEAR_MOVE (4.9%)

### 7-Day (n=129)

- **Sizing issue**: Model P/L (-11.42u) trails flat (-4.09u) by 7.33u

### All Time (n=1010)

- **Sizing issue**: Model P/L (-76.07u) trails flat (-46.49u) by 29.58u
- **Environment issue**: 52.9% NO_MOVE (WR: 53.6%, ROI: -5.5%)


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
| V8 era picks | 448 |
| V8 flat ROI | -3.8% |
| V8 model ROI | -4.0% |
| V8 star monotonicity score | 0.14 |
| 4.5-5★ ROI | -3.8% |
| 2.5-3★ ROI | -3.9% |
| CLEAR_MOVE ROI | 4.9% |
| NO_MOVE ROI | -16.8% |
| Single-wallet play rate | 24.3% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: 0.05% | 4.5★: -0.44% | 4★: 0.35% | 3.5★: -0.07% | 3★: 0.18% | 2.5★: -0.34% | 2★: 0.67% | 1★: 0.21% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=448)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 362 | 80.8% | 49.4% | -5.1% | -8.4% | 0.02% |
| MUTED | 75 | 16.7% | 56.0% | 2.2% | 20.8% | -0.11% |
| CANCELLED | 11 | 2.5% | 54.5% | -2.8% | -10.4% | 0.16% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| v73_hc_rescue | 21 | 52.4% |
| wps_flipped_diag | 18 | 38.9% |
| ags_quality_veto | 18 | 66.7% |
| winners_below_floor | 14 | 42.9% |
| opp_side_stronger_diag | 14 | 50.0% |
| winners_faded | 12 | 66.7% |
| ags_hard_mute | 10 | 60.0% |
| winners_killed | 9 | 55.6% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 7 | 57.1% |
| whitelist_fade_weak | 3 | 66.7% |
| sum_below_floor | 3 | 33.3% |
| whitelist_fade_strong | 2 | 50.0% |
| dw1_no_ags_support | 1 | 100.0% |

### 7-Day (n=129)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 122 | 94.6% | 51.6% | -5.6% | -7.6% | 0.03% |
| MUTED | 7 | 5.4% | 71.4% | 38.9% | 43.6% | -0.02% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| ags_hard_mute | 7 | 71.4% |
| wps_flipped_diag | 4 | 50.0% |
| opp_side_stronger_diag | 4 | 50.0% |

### All Time (n=1010)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 922 | 91.3% | 51.8% | -5.5% | -6.7% | -0.23% |
| MUTED | 75 | 7.4% | 56.0% | 2.2% | 20.8% | -0.11% |
| CANCELLED | 13 | 1.3% | 61.5% | 17.8% | 4.8% | -0.95% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| v73_hc_rescue | 21 | 52.4% |
| wps_flipped_diag | 18 | 38.9% |
| ags_quality_veto | 18 | 66.7% |
| winners_below_floor | 14 | 42.9% |
| opp_side_stronger_diag | 14 | 50.0% |
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
