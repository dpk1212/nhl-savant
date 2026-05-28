# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-05-28 ET
**Completed Picks**: 1002 | **V8 Era Picks**: 440 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (63.9%) beats 5★ (49.6%) |
| Model P/L vs flat P/L | ⚠️ | Model trails flat by 16.4u — sizing amplifying losses |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 58 | 56.9% | 0.20u | 0.4% | 6.23u | 4.9% | -0.35% | -0.82% | Strong |
| 7-Day | 133 | 52.6% | -4.28u | -3.2% | -18.25u | -7.4% | 0.03% | -0.71% |  |
| 14-Day | 191 | 50.8% | -10.71u | -5.6% | -39.60u | -10.6% | 0.07% | -0.70% |  |
| 30-Day | 310 | 51.6% | -9.98u | -3.2% | -24.48u | -4.2% | -0.07% | -0.53% |  |
| V8 Era | 440 | 50.7% | -16.52u | -3.8% | -32.96u | -4.4% | -0.01% | -0.49% |  |
| All Time | 1002 | 52.3% | -46.03u | -4.6% | -77.84u | -4.8% | -0.24% | -0.15% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=440)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 141 | 54.0% | 54.0% | 49.6% | -4.4% | -10.7% | -8.3% | 2.79 | 0.01% | Weak |
| 4.5 | 36 | 53.8% | 53.8% | 63.9% | +10.1% | 20.8% | 12.4% | 2.64 | -0.49% | Strong |
| 4 | 75 | 53.6% | 53.6% | 49.3% | -4.3% | -7.2% | -1.9% | 1.48 | 0.35% | Weak |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 54 | 53.3% | 53.3% | 48.1% | -5.2% | -5.3% | -14.0% | 1.02 | 0.18% | Weak |
| 2.5 | 57 | 52.2% | 52.2% | 49.1% | -3.1% | -4.2% | -16.8% | 0.73 | -0.32% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 5 | 52.1% | 52.1% | 40.0% | -12.1% | -26.0% | 12.3% | 0.60 | 0.21% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 49.6% | 63.9% | -14.3% | INVERTED |
| 4.5★ vs 4★ | 63.9% | 49.3% | +14.6% | Correct |
| 4★ vs 3.5★ | 49.3% | 51.5% | -2.2% | Flat |
| 3.5★ vs 3★ | 51.5% | 48.1% | +3.4% | Correct |
| 3★ vs 2.5★ | 48.1% | 49.1% | -1.0% | Flat |
| 2.5★ vs 2★ | 49.1% | 0.0% | +49.1% | Correct |
| 2★ vs 1★ | 0.0% | 40.0% | -40.0% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.833 |
| Spearman: Stars vs Flat ROI | 0.452 |
| Spearman: Stars vs CLV | -0.429 |
| Brier Score | 0.2454 |
| Monotonicity Score | 0.14 |

### All Time (n=1002)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 154 | 54.4% | 54.4% | 50.0% | -4.4% | -10.5% | -8.7% | 2.78 | 0.08% | Weak |
| 4.5 | 70 | 55.7% | 55.7% | 57.1% | +1.5% | 4.7% | -1.3% | 2.63 | 0.42% | Fair |
| 4 | 190 | 55.0% | 55.0% | 52.1% | -2.9% | -4.8% | -3.1% | 1.87 | -0.27% | Fair |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 214 | 54.7% | 54.7% | 48.6% | -6.1% | -11.0% | -11.5% | 1.16 | -0.38% | Weak |
| 2.5 | 164 | 53.7% | 53.7% | 53.0% | -0.6% | -1.9% | -4.2% | 0.73 | -0.64% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 5 | 52.1% | 52.1% | 40.0% | -12.1% | -26.0% | 12.3% | 0.60 | 0.21% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 50.0% | 57.1% | -7.1% | INVERTED |
| 4.5★ vs 4★ | 57.1% | 52.1% | +5.0% | Correct |
| 4★ vs 3.5★ | 52.1% | 56.5% | -4.4% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 48.6% | +7.9% | Correct |
| 3★ vs 2.5★ | 48.6% | 53.0% | -4.4% | INVERTED |
| 2.5★ vs 2★ | 53.0% | 0.0% | +53.0% | Correct |
| 2★ vs 1★ | 0.0% | 40.0% | -40.0% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.595 |
| Spearman: Stars vs Flat ROI | 0.595 |
| Spearman: Stars vs CLV | -0.048 |
| Brier Score | 0.2353 |
| Monotonicity Score | 0.14 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.167 | -0.048 | Tune |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.148 | -0.097 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.077 | -0.044 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.188 | -0.077 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | 0.012 | 0.057 | Monitor |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | 0.042 | 0.085 | Keep |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | -0.122 | -0.013 | Tune |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.142 | -0.029 | Tune |
| AgainstSide | Opposition | Force against side | Higher → worse | -0.000 | 0.063 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.088 | -0.023 | Tune |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.020 | 0.059 | Monitor |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.162 | 0.046 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.176 | 0.057 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.129 | -0.030 | Tune |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (11.60–39.80) | 72 | 55.6% | 0.3% | -7.5% | -0.21% |  |
| p20-40 (39.88–47.06) | 72 | 47.2% | -10.9% | -5.3% | -0.02% |  |
| p40-60 (47.10–51.80) | 72 | 52.8% | -2.6% | 4.7% | 0.09% |  |
| p60-80 (51.90–57.50) | 72 | 52.8% | 11.8% | 3.6% | 0.33% |  |
| p80-95 (57.55–64.77) | 72 | 50.0% | -6.6% | -7.3% | -0.07% |  |
| p95+ (64.80–83.30) | 72 | 44.4% | -16.1% | -19.3% | -0.18% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 143 | 48.3% | -10.3% | -1.8% | -0.04% |  |
| 0.90-1.05 | 147 | 43.5% | -17.6% | -23.8% | -0.03% |  |
| 1.05-1.20 | 97 | 63.9% | 25.9% | 24.5% | 0.11% |  |
| 1.20-1.35 | 27 | 51.9% | -2.5% | -18.0% | 0.32% |  |
| 1.35-1.50 | 11 | 45.5% | -15.6% | -42.1% | -0.34% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.53) | 63 | 54.0% | -2.1% | 0.9% | -0.23% |  |
| 20-40% (0.54–0.82) | 64 | 50.0% | -7.0% | 6.9% | 0.19% |  |
| 40-60% (0.83–1.07) | 64 | 54.7% | 11.3% | 5.4% | -0.23% |  |
| 60-80% (1.07–1.35) | 64 | 43.8% | -15.2% | -23.8% | 0.21% |  |
| 80-95% (1.36–1.96) | 64 | 45.3% | -14.6% | -5.7% | -0.08% |  |
| 95%+ (1.96–4.76) | 64 | 50.0% | -4.9% | -7.1% | 0.22% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 24 | 41.7% | -14.5% | -29.7% | 0.41% | Broad support |
| 0.25-0.40 | 94 | 50.0% | -1.6% | -6.1% | 0.22% | Healthy support |
| 0.40-0.60 | 124 | 45.2% | -12.7% | -2.7% | -0.16% | Concentrated |
| 0.60-0.80 | 77 | 54.5% | 1.4% | -0.7% | 0.05% | Very concentrated |
| 0.80-1.00 | 64 | 54.7% | -1.8% | -0.7% | -0.16% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 50 | 36.0% | -32.2% | -33.2% | -0.06% | 4.4 |
| Broad battle | 175 | 46.3% | -8.5% | -7.2% | -0.00% | 3.9 |
| One-wallet nuke | 121 | 56.2% | 2.6% | 2.4% | -0.16% | 3.5 |
| Thin support | 229 | 54.1% | 0.2% | -0.4% | 0.00% | 3.6 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=440)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 17 | 47.1% | -16.8% | 12.4% | 0.26% | 4.2 | 82.4% |
| SMALL_MOVE | 89 | 46.1% | -14.5% | -10.6% | -0.21% | 4.1 | 100.0% |
| CLEAR_MOVE | 115 | 57.4% | 5.8% | 9.5% | 0.14% | 4.1 | 100.0% |
| NEAR_START | 170 | 47.1% | -6.5% | -14.7% | 0.02% | 3.8 | 100.0% |

**All Time** (n=1002)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 534 | 53.6% | -5.5% | -4.2% | -0.48% | 3.3 | 4.1% |
| SMALL_MOVE | 92 | 45.7% | -15.2% | -12.7% | -0.13% | 4.1 | 96.7% |
| CLEAR_MOVE | 141 | 56.7% | 4.8% | 8.1% | 0.04% | 4.1 | 100.0% |
| NEAR_START | 186 | 47.3% | -6.9% | -14.5% | 0.05% | 3.8 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 8 / 62.5% / 6.3% | 39 / 46.2% / -21.1% | 55 / 63.6% / 14.1% | 64 / 45.3% / -11.6% |
| 3.5-4★ | 7 / 28.6% / -46.2% | 36 / 47.2% / -8.7% | 35 / 45.7% / -17.0% | 47 / 59.6% / 22.6% |
| 2.5-3★ | 2 / 50.0% / -5.8% | 11 / 45.5% / -4.6% | 25 / 60.0% / 19.5% | 55 / 40.0% / -21.6% |
| 1.0-2★ | — | 3 / 33.3% / -34.9% | — | 4 / 25.0% / -56.3% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 437 | 50.6% | -4.0% | -4.6% | 3.9 | -0.01% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 487 | 50.7% | -4.2% | -4.6% | 3.9 | -0.02% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 721 | 100% |
| LOCKED (direct) | 78 | 10.8% |
| Promoted (SHADOW→LOCKED) | 407 | 56.4% |
| Rejected (stayed SHADOW) | 161 | 22.3% |
| Superseded (side flipped) | 70 | 9.7% |
| Muted | 290 | 40.2% |
| Cancelled | 20 | 2.8% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=440)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -32.96u | -4.4% | — |
| Flat 1.0u | -16.52u | -3.8% | -16.44u |
| Lock units only | -24.69u | — | -8.27u |
| Units change only on star change | -20.29u | — | -12.67u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 141 | 2.79 | -10.7% | -8.3% | -17.41u | Sizing hurts |
| 4.5 | 36 | 2.64 | 20.8% | 12.4% | +4.35u | Sizing helps |
| 4 | 75 | 1.48 | -7.2% | -1.9% | +3.32u | Sizing helps |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 54 | 1.02 | -5.3% | -14.0% | -4.92u | Sizing hurts |
| 2.5 | 57 | 0.73 | -4.2% | -16.8% | -4.65u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 5 | 0.60 | -26.0% | 12.3% | +1.67u | Sizing helps |

### All Time (n=1002)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -77.84u | -4.8% | — |
| Flat 1.0u | -46.03u | -4.6% | -31.81u |
| Lock units only | -58.81u | — | -19.03u |
| Units change only on star change | -64.33u | — | -13.51u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 154 | 2.78 | -10.5% | -8.7% | -21.00u | Sizing hurts |
| 4.5 | 70 | 2.63 | 4.7% | -1.3% | -5.67u | Sizing hurts |
| 4 | 190 | 1.87 | -4.8% | -3.1% | -1.92u | Sizing hurts |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 214 | 1.16 | -11.0% | -11.5% | -5.07u | Sizing hurts |
| 2.5 | 164 | 0.73 | -1.9% | -4.2% | -1.94u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 5 | 0.60 | -26.0% | 12.3% | +1.67u | Sizing helps |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 440 | 53.2% | 50.7% | -2.5% | -3.8% | -0.01% | Below market |
| 4.5-5★ | 177 | 54.0% | 52.5% | -1.4% | -4.3% | -0.09% | Neutral |
| 3.5-4★ | 143 | 52.5% | 50.3% | -2.1% | -1.5% | 0.15% | Below market |
| 2.5-3★ | 113 | 52.8% | 49.6% | -3.2% | -3.1% | -0.09% | Below market |
| CLEAR_MOVE only | 115 | 54.4% | 57.4% | +3.0% | 5.8% | 0.14% | Beating market |
| NO_MOVE only | 17 | 54.8% | 47.1% | -7.7% | -16.8% | 0.26% | Below market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=111)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 49.637 | 34.564 | 0.96 |  |
| Rank_norm | 62.144 | 60.800 | 0.07 |  |
| PnL_norm | 53.308 | 52.054 | 0.07 |  |
| WalletBase | 51.826 | 41.507 | 0.79 |  |
| SizeRatio | 1.565 | 1.273 | 0.20 |  |
| ConvictionMult | 0.981 | 0.963 | 0.11 |  |
| WalletCountFor | 3.149 | 2.495 | 0.36 |  |
| TopShare | 0.553 | 0.685 | 0.56 |  |
| ForSide | 167.030 | 109.756 | 0.52 |  |
| AgainstSide | 52.897 | 28.460 | 0.29 |  |
| NetEdge | 1.221 | 0.856 | 0.45 |  |
| WalletPlayScore | 1.469 | 0.285 | 0.53 |  |

### V8 Era (n=383)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 49.637 | 49.232 | 0.03 |  |
| Rank_norm | 62.144 | 64.484 | 0.12 |  |
| PnL_norm | 53.308 | 53.877 | 0.03 |  |
| WalletBase | 51.826 | 51.645 | 0.01 |  |
| SizeRatio | 1.565 | 1.542 | 0.02 |  |
| ConvictionMult | 0.981 | 0.981 | 0.00 |  |
| WalletCountFor | 3.149 | 3.149 | 0.00 |  |
| TopShare | 0.553 | 0.553 | 0.00 |  |
| ForSide | 167.030 | 167.030 | 0.00 |  |
| AgainstSide | 52.897 | 52.897 | 0.00 |  |
| NetEdge | 1.221 | 1.221 | 0.00 |  |
| WalletPlayScore | 1.469 | 1.469 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=440)

- **Sizing issue**: Model P/L (-32.96u) trails flat (-16.52u) by 16.44u
- **Gate issue**: NO_MOVE ROI (-16.8%) significantly trails CLEAR_MOVE (5.8%)

### 7-Day (n=133)

- **Sizing issue**: Model P/L (-18.25u) trails flat (-4.28u) by 13.97u

### All Time (n=1002)

- **Sizing issue**: Model P/L (-77.84u) trails flat (-46.03u) by 31.81u
- **Environment issue**: 53.3% NO_MOVE (WR: 53.6%, ROI: -5.5%)


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
| V8 era picks | 440 |
| V8 flat ROI | -3.8% |
| V8 model ROI | -4.4% |
| V8 star monotonicity score | 0.14 |
| 4.5-5★ ROI | -4.3% |
| 2.5-3★ ROI | -3.1% |
| CLEAR_MOVE ROI | 5.8% |
| NO_MOVE ROI | -16.8% |
| Single-wallet play rate | 24.8% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: 0.01% | 4.5★: -0.49% | 4★: 0.35% | 3.5★: -0.07% | 3★: 0.18% | 2.5★: -0.32% | 2★: 0.67% | 1★: 0.21% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=440)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 356 | 80.9% | 49.7% | -4.6% | -8.1% | 0.01% |
| MUTED | 73 | 16.6% | 54.8% | 0.1% | 17.9% | -0.13% |
| CANCELLED | 11 | 2.5% | 54.5% | -2.8% | -10.4% | 0.16% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| v73_hc_rescue | 21 | 52.4% |
| wps_flipped_diag | 18 | 38.9% |
| ags_quality_veto | 18 | 66.7% |
| winners_below_floor | 14 | 42.9% |
| opp_side_stronger_diag | 13 | 46.2% |
| winners_faded | 12 | 66.7% |
| winners_killed | 9 | 55.6% |
| ags_hard_mute | 8 | 50.0% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 7 | 57.1% |
| whitelist_fade_weak | 3 | 66.7% |
| sum_below_floor | 3 | 33.3% |
| whitelist_fade_strong | 2 | 50.0% |
| dw1_no_ags_support | 1 | 100.0% |

### 7-Day (n=133)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 127 | 95.5% | 52.0% | -4.7% | -8.4% | 0.07% |
| MUTED | 6 | 4.5% | 66.7% | 29.1% | 25.1% | -0.84% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| ags_hard_mute | 6 | 66.7% |
| wps_flipped_diag | 4 | 50.0% |
| opp_side_stronger_diag | 3 | 33.3% |

### All Time (n=1002)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 916 | 91.4% | 52.0% | -5.3% | -6.6% | -0.24% |
| MUTED | 73 | 7.3% | 54.8% | 0.1% | 17.9% | -0.13% |
| CANCELLED | 13 | 1.3% | 61.5% | 17.8% | 4.8% | -0.95% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| v73_hc_rescue | 21 | 52.4% |
| wps_flipped_diag | 18 | 38.9% |
| ags_quality_veto | 18 | 66.7% |
| winners_below_floor | 14 | 42.9% |
| opp_side_stronger_diag | 13 | 46.2% |
| winners_faded | 12 | 66.7% |
| winners_killed | 9 | 55.6% |
| ags_hard_mute | 8 | 50.0% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 7 | 57.1% |
| whitelist_fade_weak | 3 | 66.7% |
| sum_below_floor | 3 | 33.3% |
| opposition_building | 2 | 100.0% |
| mid_tier_or_lower | 2 | 100.0% |
| whitelist_fade_strong | 2 | 50.0% |
| dw1_no_ags_support | 1 | 100.0% |
