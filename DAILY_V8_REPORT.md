# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-05-30 ET
**Completed Picks**: 1033 | **V8 Era Picks**: 471 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (65.1%) beats 5★ (48.4%) |
| Model P/L vs flat P/L | ⚠️ | Model trails flat by 12.2u — sizing amplifying losses |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 50 | 48.0% | -6.19u | -12.4% | -6.46u | -7.4% | -0.40% | -0.82% |  |
| 7-Day | 132 | 53.8% | -1.82u | -1.4% | 5.22u | 2.1% | -0.26% | -0.73% |  |
| 14-Day | 207 | 51.7% | -8.29u | -4.0% | -21.97u | -5.5% | -0.06% | -0.67% |  |
| 30-Day | 315 | 51.7% | -10.13u | -3.2% | -26.56u | -4.4% | -0.12% | -0.59% |  |
| V8 Era | 471 | 50.5% | -19.47u | -4.1% | -31.72u | -3.9% | -0.05% | -0.50% |  |
| All Time | 1033 | 52.2% | -48.99u | -4.7% | -76.60u | -4.6% | -0.25% | -0.16% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=471)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 157 | 53.8% | 53.8% | 48.4% | -5.4% | -13.0% | -9.0% | 2.72 | 0.05% | Weak |
| 4.5 | 43 | 53.8% | 53.8% | 65.1% | +11.4% | 22.9% | 15.4% | 2.51 | -0.35% | Strong |
| 4 | 80 | 53.4% | 53.4% | 50.0% | -3.4% | -5.4% | 0.7% | 1.48 | -0.03% | Weak |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 55 | 53.3% | 53.3% | 49.1% | -4.2% | -3.5% | -11.3% | 1.00 | 0.21% | Fair |
| 2.5 | 58 | 52.2% | 52.2% | 48.3% | -3.9% | -5.8% | -19.9% | 0.75 | -0.34% | Weak |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 6 | 51.2% | 51.2% | 33.3% | -17.8% | -38.4% | -3.7% | 0.58 | 0.02% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 48.4% | 65.1% | -16.7% | INVERTED |
| 4.5★ vs 4★ | 65.1% | 50.0% | +15.1% | Correct |
| 4★ vs 3.5★ | 50.0% | 51.5% | -1.5% | Flat |
| 3.5★ vs 3★ | 51.5% | 49.1% | +2.4% | Correct |
| 3★ vs 2.5★ | 49.1% | 48.3% | +0.8% | Correct |
| 2.5★ vs 2★ | 48.3% | 0.0% | +48.3% | Correct |
| 2★ vs 1★ | 0.0% | 33.3% | -33.3% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.714 |
| Spearman: Stars vs Flat ROI | 0.548 |
| Spearman: Stars vs CLV | -0.310 |
| Brier Score | 0.2447 |
| Monotonicity Score | -0.14 |

### All Time (n=1033)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 170 | 54.2% | 54.2% | 48.8% | -5.4% | -12.7% | -9.3% | 2.72 | 0.12% | Weak |
| 4.5 | 77 | 55.5% | 55.5% | 58.4% | +2.9% | 7.3% | 1.2% | 2.55 | 0.41% | Strong |
| 4 | 195 | 54.9% | 54.9% | 52.3% | -2.6% | -4.1% | -2.2% | 1.86 | -0.42% | Fair |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 215 | 54.7% | 54.7% | 48.8% | -5.9% | -10.5% | -10.9% | 1.15 | -0.37% | Weak |
| 2.5 | 165 | 53.7% | 53.7% | 52.7% | -0.9% | -2.5% | -5.5% | 0.74 | -0.64% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 6 | 51.2% | 51.2% | 33.3% | -17.8% | -38.4% | -3.7% | 0.58 | 0.02% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 48.8% | 58.4% | -9.6% | INVERTED |
| 4.5★ vs 4★ | 58.4% | 52.3% | +6.1% | Correct |
| 4★ vs 3.5★ | 52.3% | 56.5% | -4.2% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 48.8% | +7.7% | Correct |
| 3★ vs 2.5★ | 48.8% | 52.7% | -3.9% | INVERTED |
| 2.5★ vs 2★ | 52.7% | 0.0% | +52.7% | Correct |
| 2★ vs 1★ | 0.0% | 33.3% | -33.3% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.500 |
| Spearman: Stars vs Flat ROI | 0.500 |
| Spearman: Stars vs CLV | 0.071 |
| Brier Score | 0.2353 |
| Monotonicity Score | 0.14 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.187 | -0.053 | Tune |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.152 | -0.100 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.087 | -0.052 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.205 | -0.081 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | -0.010 | 0.042 | Monitor |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | 0.018 | 0.067 | Monitor |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | -0.148 | -0.025 | Tune |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.176 | -0.053 | Tune |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.004 | 0.061 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.128 | -0.049 | Tune |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.022 | 0.056 | Monitor |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.176 | 0.061 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.191 | 0.072 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.156 | -0.051 | Tune |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (11.60–38.00) | 77 | 55.8% | 1.0% | -7.1% | -0.10% |  |
| p20-40 (38.00–45.40) | 77 | 49.4% | -7.4% | -3.4% | -0.38% |  |
| p40-60 (45.99–51.02) | 77 | 49.4% | -8.8% | 2.0% | -0.23% |  |
| p60-80 (51.27–56.62) | 77 | 51.9% | 8.4% | 3.0% | 0.55% |  |
| p80-95 (56.63–64.60) | 77 | 51.9% | -1.9% | -3.6% | -0.04% |  |
| p95+ (64.63–83.30) | 78 | 43.6% | -17.5% | -20.3% | -0.14% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 161 | 48.4% | -10.0% | -2.1% | -0.20% |  |
| 0.90-1.05 | 152 | 44.1% | -16.4% | -22.0% | 0.00% |  |
| 1.05-1.20 | 103 | 62.1% | 22.0% | 22.8% | 0.11% |  |
| 1.20-1.35 | 28 | 53.6% | 0.9% | -15.3% | 0.36% |  |
| 1.35-1.50 | 11 | 45.5% | -15.6% | -42.1% | -0.34% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.50) | 69 | 56.5% | 2.2% | 8.1% | -0.22% |  |
| 20-40% (0.51–0.79) | 69 | 52.2% | -1.4% | 7.3% | -0.12% |  |
| 40-60% (0.79–1.05) | 69 | 47.8% | -9.9% | -8.1% | -0.29% |  |
| 60-80% (1.05–1.31) | 69 | 47.8% | -1.8% | -13.9% | 0.34% |  |
| 80-95% (1.31–1.88) | 69 | 43.5% | -16.7% | -10.0% | -0.09% |  |
| 95%+ (1.88–4.76) | 69 | 49.3% | -6.9% | -6.8% | 0.18% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 25 | 40.0% | -17.9% | -29.7% | 0.41% | Broad support |
| 0.25-0.40 | 95 | 49.5% | -2.7% | -6.7% | 0.22% | Healthy support |
| 0.40-0.60 | 133 | 45.1% | -13.0% | -2.7% | -0.08% | Concentrated |
| 0.60-0.80 | 91 | 56.0% | 3.8% | 1.9% | -0.31% | Very concentrated |
| 0.80-1.00 | 70 | 52.9% | -4.4% | -1.1% | -0.10% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 50 | 36.0% | -32.2% | -33.2% | -0.06% | 4.4 |
| Broad battle | 183 | 46.4% | -8.5% | -5.9% | 0.03% | 3.9 |
| One-wallet nuke | 127 | 55.1% | 1.0% | 2.0% | -0.13% | 3.5 |
| Thin support | 248 | 53.6% | -0.7% | -1.2% | -0.11% | 3.7 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=471)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 18 | 44.4% | -21.4% | 9.7% | 0.23% | 4.3 | 83.3% |
| SMALL_MOVE | 98 | 44.9% | -17.1% | -10.8% | -0.48% | 4.1 | 100.0% |
| CLEAR_MOVE | 120 | 55.8% | 3.2% | 7.3% | 0.15% | 4.1 | 100.0% |
| NEAR_START | 186 | 48.9% | -3.4% | -10.8% | 0.06% | 3.8 | 100.0% |

**All Time** (n=1033)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 535 | 53.5% | -5.7% | -4.3% | -0.48% | 3.3 | 4.3% |
| SMALL_MOVE | 101 | 44.6% | -17.6% | -12.7% | -0.40% | 4.1 | 97.0% |
| CLEAR_MOVE | 146 | 55.5% | 2.7% | 6.3% | 0.05% | 4.1 | 100.0% |
| NEAR_START | 202 | 49.0% | -4.1% | -10.9% | 0.08% | 3.8 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 9 / 55.6% / -5.6% | 46 / 45.7% / -21.9% | 59 / 59.3% / 6.4% | 75 / 49.3% / -4.7% |
| 3.5-4★ | 7 / 28.6% / -46.2% | 37 / 45.9% / -11.2% | 36 / 47.2% / -13.2% | 50 / 60.0% / 23.0% |
| 2.5-3★ | 2 / 50.0% / -5.8% | 12 / 41.7% / -12.5% | 25 / 60.0% / 19.5% | 56 / 41.1% / -19.6% |
| 1.0-2★ | — | 3 / 33.3% / -34.9% | — | 5 / 20.0% / -65.1% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 468 | 50.4% | -4.4% | -4.2% | 4.0 | -0.06% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 518 | 50.6% | -4.5% | -4.2% | 4.0 | -0.06% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 758 | 100% |
| LOCKED (direct) | 78 | 10.3% |
| Promoted (SHADOW→LOCKED) | 439 | 57.9% |
| Rejected (stayed SHADOW) | 163 | 21.5% |
| Superseded (side flipped) | 73 | 9.6% |
| Muted | 296 | 39.1% |
| Cancelled | 20 | 2.6% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=471)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -31.72u | -3.9% | — |
| Flat 1.0u | -19.47u | -4.1% | -12.25u |
| Lock units only | -29.83u | — | -1.89u |
| Units change only on star change | -25.42u | — | -6.30u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 157 | 2.72 | -13.0% | -9.0% | -17.96u | Sizing hurts |
| 4.5 | 43 | 2.51 | 22.9% | 15.4% | +6.79u | Sizing helps |
| 4 | 80 | 1.48 | -5.4% | 0.7% | +5.17u | Sizing helps |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 55 | 1.00 | -3.5% | -11.3% | -4.32u | Sizing hurts |
| 2.5 | 58 | 0.75 | -5.8% | -19.9% | -5.30u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 6 | 0.58 | -38.4% | -3.7% | +2.17u | Sizing helps |

### All Time (n=1033)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -76.60u | -4.6% | — |
| Flat 1.0u | -48.99u | -4.7% | -27.61u |
| Lock units only | -63.94u | — | -12.66u |
| Units change only on star change | -69.46u | — | -7.14u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 170 | 2.72 | -12.7% | -9.3% | -21.56u | Sizing hurts |
| 4.5 | 77 | 2.55 | 7.3% | 1.2% | -3.23u | Sizing hurts |
| 4 | 195 | 1.86 | -4.1% | -2.2% | -0.07u | Neutral |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 215 | 1.15 | -10.5% | -10.9% | -4.46u | Sizing hurts |
| 2.5 | 165 | 0.74 | -2.5% | -5.5% | -2.59u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 6 | 0.58 | -38.4% | -3.7% | +2.17u | Sizing helps |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 471 | 53.1% | 50.5% | -2.5% | -4.1% | -0.05% | Below market |
| 4.5-5★ | 200 | 53.8% | 52.0% | -1.8% | -5.3% | -0.03% | Neutral |
| 3.5-4★ | 148 | 52.4% | 50.7% | -1.8% | -0.7% | -0.05% | Neutral |
| 2.5-3★ | 115 | 52.8% | 49.6% | -3.2% | -3.1% | -0.08% | Below market |
| CLEAR_MOVE only | 120 | 54.1% | 55.8% | +1.7% | 3.2% | 0.15% | Neutral |
| NO_MOVE only | 18 | 54.9% | 44.4% | -10.5% | -21.4% | 0.23% | Below market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=117)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 48.141 | 29.100 | 1.14 | ⚠️ |
| Rank_norm | 62.081 | 58.641 | 0.17 |  |
| PnL_norm | 53.169 | 51.435 | 0.10 |  |
| WalletBase | 50.818 | 37.882 | 0.95 |  |
| SizeRatio | 1.522 | 1.126 | 0.28 |  |
| ConvictionMult | 0.974 | 0.932 | 0.25 |  |
| WalletCountFor | 3.104 | 2.496 | 0.34 |  |
| TopShare | 0.562 | 0.678 | 0.50 |  |
| ForSide | 161.057 | 96.751 | 0.59 |  |
| AgainstSide | 51.132 | 25.716 | 0.31 |  |
| NetEdge | 1.176 | 0.749 | 0.52 |  |
| WalletPlayScore | 1.374 | 0.229 | 0.52 |  |

### V8 Era (n=414)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 48.141 | 47.589 | 0.03 |  |
| Rank_norm | 62.081 | 64.239 | 0.11 |  |
| PnL_norm | 53.169 | 53.680 | 0.03 |  |
| WalletBase | 50.818 | 50.531 | 0.02 |  |
| SizeRatio | 1.522 | 1.495 | 0.02 |  |
| ConvictionMult | 0.974 | 0.974 | 0.00 |  |
| WalletCountFor | 3.104 | 3.104 | 0.00 |  |
| TopShare | 0.562 | 0.562 | 0.00 |  |
| ForSide | 161.057 | 161.057 | 0.00 |  |
| AgainstSide | 51.132 | 51.132 | 0.00 |  |
| NetEdge | 1.176 | 1.176 | 0.00 |  |
| WalletPlayScore | 1.374 | 1.374 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=471)

- **Sizing issue**: Model P/L (-31.72u) trails flat (-19.47u) by 12.25u
- **Gate issue**: NO_MOVE ROI (-21.4%) significantly trails CLEAR_MOVE (3.2%)

### 7-Day (n=132)

- **Gate issue**: NO_MOVE ROI (-51.9%) significantly trails CLEAR_MOVE (-15.8%)

### All Time (n=1033)

- **Sizing issue**: Model P/L (-76.60u) trails flat (-48.99u) by 27.61u
- **Environment issue**: 51.8% NO_MOVE (WR: 53.5%, ROI: -5.7%)


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
| V8 era picks | 471 |
| V8 flat ROI | -4.1% |
| V8 model ROI | -3.9% |
| V8 star monotonicity score | -0.14 |
| 4.5-5★ ROI | -5.3% |
| 2.5-3★ ROI | -3.1% |
| CLEAR_MOVE ROI | 3.2% |
| NO_MOVE ROI | -21.4% |
| Single-wallet play rate | 24.0% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: 0.05% | 4.5★: -0.35% | 4★: -0.03% | 3.5★: -0.07% | 3★: 0.21% | 2.5★: -0.34% | 2★: 0.67% | 1★: 0.02% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=471)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 385 | 81.7% | 49.4% | -5.4% | -8.0% | -0.05% |
| MUTED | 75 | 15.9% | 56.0% | 2.2% | 20.8% | -0.11% |
| CANCELLED | 11 | 2.3% | 54.5% | -2.8% | -10.4% | 0.16% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| v73_hc_rescue | 21 | 52.4% |
| wps_flipped_diag | 19 | 42.1% |
| ags_quality_veto | 18 | 66.7% |
| opp_side_stronger_diag | 15 | 53.3% |
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

### 7-Day (n=132)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 126 | 95.5% | 52.4% | -4.4% | -0.9% | -0.26% |
| MUTED | 6 | 4.5% | 83.3% | 62.0% | 58.0% | -0.17% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| ags_hard_mute | 6 | 83.3% |
| opp_side_stronger_diag | 5 | 60.0% |
| wps_flipped_diag | 4 | 75.0% |

### All Time (n=1033)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 945 | 91.5% | 51.7% | -5.6% | -6.6% | -0.26% |
| MUTED | 75 | 7.3% | 56.0% | 2.2% | 20.8% | -0.11% |
| CANCELLED | 13 | 1.3% | 61.5% | 17.8% | 4.8% | -0.95% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| v73_hc_rescue | 21 | 52.4% |
| wps_flipped_diag | 19 | 42.1% |
| ags_quality_veto | 18 | 66.7% |
| opp_side_stronger_diag | 15 | 53.3% |
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
