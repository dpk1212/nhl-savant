# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-06-03 ET
**Completed Picks**: 1084 | **V8 Era Picks**: 522 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (66.0%) beats 5★ (48.0%) |
| Model P/L vs flat P/L | ⚠️ | Model trails flat by 5.7u — sizing amplifying losses |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 30 | 46.7% | -3.44u | -11.5% | 5.06u | 8.7% | -0.08% | -0.72% |  |
| 7-Day | 101 | 48.5% | -9.33u | -9.2% | -3.08u | -1.6% | -0.29% | -0.78% |  |
| 14-Day | 225 | 51.6% | -9.62u | -4.3% | -11.00u | -2.6% | -0.09% | -0.71% |  |
| 30-Day | 343 | 51.6% | -12.42u | -3.6% | -15.49u | -2.3% | -0.13% | -0.66% |  |
| V8 Era | 522 | 50.4% | -22.61u | -4.3% | -28.34u | -3.1% | -0.06% | -0.53% |  |
| All Time | 1084 | 52.0% | -52.12u | -4.8% | -73.22u | -4.1% | -0.25% | -0.19% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=522)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 177 | 53.6% | 53.6% | 48.0% | -5.5% | -12.6% | -8.4% | 2.74 | 0.06% | Weak |
| 4.5 | 50 | 53.7% | 53.7% | 66.0% | +12.3% | 24.2% | 18.2% | 2.52 | -0.49% | Strong |
| 4 | 93 | 53.0% | 53.0% | 49.5% | -3.5% | -5.6% | 0.9% | 1.47 | -0.00% | Weak |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 61 | 53.6% | 53.6% | 47.5% | -6.1% | -7.2% | -15.9% | 1.01 | 0.16% | Weak |
| 2.5 | 61 | 52.8% | 52.8% | 49.2% | -3.6% | -5.0% | -12.6% | 0.78 | -0.37% | Weak |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 8 | 55.0% | 55.0% | 37.5% | -17.5% | -35.0% | -10.1% | 0.47 | -0.01% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 48.0% | 66.0% | -18.0% | INVERTED |
| 4.5★ vs 4★ | 66.0% | 49.5% | +16.5% | Correct |
| 4★ vs 3.5★ | 49.5% | 51.5% | -2.0% | Flat |
| 3.5★ vs 3★ | 51.5% | 47.5% | +4.0% | Correct |
| 3★ vs 2.5★ | 47.5% | 49.2% | -1.7% | Flat |
| 2.5★ vs 2★ | 49.2% | 0.0% | +49.2% | Correct |
| 2★ vs 1★ | 0.0% | 37.5% | -37.5% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.667 |
| Spearman: Stars vs Flat ROI | 0.500 |
| Spearman: Stars vs CLV | -0.190 |
| Brier Score | 0.2459 |
| Monotonicity Score | 0.14 |

### All Time (n=1084)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 190 | 53.9% | 53.9% | 48.4% | -5.5% | -12.3% | -8.7% | 2.73 | 0.11% | Weak |
| 4.5 | 84 | 55.3% | 55.3% | 59.5% | +4.2% | 9.4% | 4.1% | 2.56 | 0.25% | Strong |
| 4 | 208 | 54.6% | 54.6% | 51.9% | -2.7% | -4.3% | -2.0% | 1.83 | -0.38% | Fair |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 221 | 54.7% | 54.7% | 48.4% | -6.3% | -11.4% | -12.1% | 1.15 | -0.37% | Weak |
| 2.5 | 168 | 53.9% | 53.9% | 53.0% | -0.9% | -2.3% | -3.2% | 0.75 | -0.64% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 8 | 55.0% | 55.0% | 37.5% | -17.5% | -35.0% | -10.1% | 0.47 | -0.01% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 48.4% | 59.5% | -11.1% | INVERTED |
| 4.5★ vs 4★ | 59.5% | 51.9% | +7.6% | Correct |
| 4★ vs 3.5★ | 51.9% | 56.5% | -4.6% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 48.4% | +8.1% | Correct |
| 3★ vs 2.5★ | 48.4% | 53.0% | -4.6% | INVERTED |
| 2.5★ vs 2★ | 53.0% | 0.0% | +53.0% | Correct |
| 2★ vs 1★ | 0.0% | 37.5% | -37.5% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.500 |
| Spearman: Stars vs Flat ROI | 0.500 |
| Spearman: Stars vs CLV | 0.071 |
| Brier Score | 0.2364 |
| Monotonicity Score | 0.14 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.184 | -0.060 | Tune |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.149 | -0.092 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.071 | -0.032 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.194 | -0.071 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | -0.023 | 0.028 | Monitor |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | 0.009 | 0.057 | Monitor |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | -0.154 | -0.031 | Tune |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.175 | -0.053 | Tune |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.000 | 0.049 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.124 | -0.042 | Tune |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.022 | 0.055 | Monitor |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.171 | 0.061 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.185 | 0.074 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.152 | -0.047 | Tune |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (11.60–35.52) | 85 | 55.3% | -0.0% | 0.2% | -0.04% |  |
| p20-40 (35.67–44.55) | 86 | 48.8% | -6.3% | -7.1% | -0.01% |  |
| p40-60 (44.63–49.95) | 86 | 53.5% | -1.0% | 12.6% | -0.64% |  |
| p60-80 (50.15–55.50) | 85 | 45.9% | -6.8% | -6.6% | 0.37% |  |
| p80-95 (55.63–63.77) | 86 | 52.3% | 0.5% | -6.2% | 0.07% |  |
| p95+ (63.80–83.30) | 86 | 45.3% | -13.8% | -17.6% | -0.18% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 176 | 47.7% | -11.6% | -5.6% | -0.22% |  |
| 0.90-1.05 | 175 | 45.7% | -13.0% | -16.2% | -0.03% |  |
| 1.05-1.20 | 114 | 61.4% | 20.8% | 23.6% | 0.16% |  |
| 1.20-1.35 | 30 | 50.0% | -5.9% | -19.3% | 0.25% |  |
| 1.35-1.50 | 11 | 45.5% | -15.6% | -42.1% | -0.34% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.44) | 76 | 52.6% | -4.5% | 6.2% | -0.18% |  |
| 20-40% (0.45–0.73) | 77 | 53.2% | -0.3% | 1.3% | -0.17% |  |
| 40-60% (0.73–1.00) | 77 | 51.9% | -2.6% | 7.6% | -0.37% |  |
| 60-80% (1.00–1.27) | 76 | 50.0% | 3.2% | -11.1% | 0.46% |  |
| 80-95% (1.27–1.84) | 77 | 42.9% | -16.7% | -6.2% | -0.09% |  |
| 95%+ (1.85–4.76) | 77 | 46.8% | -12.5% | -10.4% | 0.17% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 27 | 37.0% | -24.0% | -32.3% | 0.27% | Broad support |
| 0.25-0.40 | 97 | 49.5% | -2.0% | -5.2% | 0.30% | Healthy support |
| 0.40-0.60 | 148 | 46.6% | -10.4% | 2.3% | -0.11% | Concentrated |
| 0.60-0.80 | 104 | 56.7% | 5.7% | 1.6% | -0.27% | Very concentrated |
| 0.80-1.00 | 84 | 50.0% | -9.3% | -6.2% | -0.11% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 53 | 34.0% | -36.1% | -35.6% | -0.07% | 4.4 |
| Broad battle | 194 | 46.9% | -7.7% | -3.5% | 0.05% | 3.9 |
| One-wallet nuke | 146 | 52.7% | -3.2% | -3.5% | -0.18% | 3.6 |
| Thin support | 285 | 53.0% | -1.8% | -3.6% | -0.12% | 3.7 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=522)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 19 | 47.4% | -15.7% | 14.8% | 0.22% | 4.3 | 84.2% |
| SMALL_MOVE | 116 | 44.8% | -16.4% | -6.8% | -0.42% | 4.1 | 100.0% |
| CLEAR_MOVE | 129 | 55.8% | 3.2% | 5.8% | 0.11% | 4.2 | 100.0% |
| NEAR_START | 204 | 49.0% | -3.4% | -8.6% | 0.07% | 3.8 | 100.0% |

**All Time** (n=1084)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 536 | 53.5% | -5.5% | -4.0% | -0.48% | 3.3 | 4.5% |
| SMALL_MOVE | 119 | 44.5% | -16.9% | -8.6% | -0.35% | 4.1 | 97.5% |
| CLEAR_MOVE | 155 | 55.5% | 2.7% | 5.1% | 0.03% | 4.1 | 100.0% |
| NEAR_START | 220 | 49.1% | -4.0% | -8.9% | 0.09% | 3.8 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 9 / 55.6% / -5.6% | 54 / 48.1% / -15.2% | 65 / 58.5% / 5.3% | 83 / 49.4% / -4.3% |
| 3.5-4★ | 8 / 37.5% / -29.6% | 42 / 47.6% / -7.9% | 38 / 47.4% / -12.2% | 55 / 56.4% / 16.1% |
| 2.5-3★ | 2 / 50.0% / -5.8% | 16 / 31.3% / -34.4% | 26 / 61.5% / 20.4% | 60 / 43.3% / -15.9% |
| 1.0-2★ | — | 4 / 25.0% / -51.2% | — | 6 / 33.3% / -45.9% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 519 | 50.3% | -4.5% | -3.3% | 4.0 | -0.07% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 569 | 50.4% | -4.6% | -3.4% | 4.0 | -0.07% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 859 | 100% |
| LOCKED (direct) | 83 | 9.7% |
| Promoted (SHADOW→LOCKED) | 507 | 59.0% |
| Rejected (stayed SHADOW) | 172 | 20.0% |
| Superseded (side flipped) | 92 | 10.7% |
| Muted | 332 | 38.6% |
| Cancelled | 20 | 2.3% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=522)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -28.34u | -3.1% | — |
| Flat 1.0u | -22.61u | -4.3% | -5.73u |
| Lock units only | -17.19u | — | -11.15u |
| Units change only on star change | -12.79u | — | -15.55u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 177 | 2.74 | -12.6% | -8.4% | -18.29u | Sizing hurts |
| 4.5 | 50 | 2.52 | 24.2% | 18.2% | +10.86u | Sizing helps |
| 4 | 93 | 1.47 | -5.6% | 0.9% | +6.47u | Sizing helps |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 61 | 1.01 | -7.2% | -15.9% | -5.44u | Sizing hurts |
| 2.5 | 61 | 0.78 | -5.0% | -12.6% | -2.95u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 8 | 0.47 | -35.0% | -10.1% | +2.42u | Sizing helps |

### All Time (n=1084)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -73.22u | -4.1% | — |
| Flat 1.0u | -52.12u | -4.8% | -21.10u |
| Lock units only | -51.31u | — | -21.91u |
| Units change only on star change | -56.83u | — | -16.39u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 190 | 2.73 | -12.3% | -8.7% | -21.88u | Sizing hurts |
| 4.5 | 84 | 2.56 | 9.4% | 4.1% | +0.84u | Sizing helps |
| 4 | 208 | 1.83 | -4.3% | -2.0% | +1.23u | Sizing helps |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 221 | 1.15 | -11.4% | -12.1% | -5.59u | Sizing hurts |
| 2.5 | 168 | 0.75 | -2.3% | -3.2% | -0.24u | Neutral |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 8 | 0.47 | -35.0% | -10.1% | +2.42u | Sizing helps |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 522 | 53.1% | 50.4% | -2.7% | -4.3% | -0.06% | Below market |
| 4.5-5★ | 227 | 53.6% | 52.0% | -1.6% | -4.5% | -0.06% | Neutral |
| 3.5-4★ | 161 | 52.3% | 50.3% | -1.9% | -1.2% | -0.03% | Neutral |
| 2.5-3★ | 124 | 53.2% | 49.2% | -4.0% | -4.6% | -0.11% | Below market |
| CLEAR_MOVE only | 129 | 54.1% | 55.8% | +1.7% | 3.2% | 0.11% | Neutral |
| NO_MOVE only | 19 | 54.9% | 47.4% | -7.5% | -15.7% | 0.22% | Below market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=96)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 46.379 | 27.584 | 1.07 | ⚠️ |
| Rank_norm | 61.330 | 58.980 | 0.12 |  |
| PnL_norm | 53.227 | 52.871 | 0.02 |  |
| WalletBase | 49.709 | 37.573 | 0.89 |  |
| SizeRatio | 1.502 | 1.219 | 0.20 |  |
| ConvictionMult | 0.975 | 0.957 | 0.11 |  |
| WalletCountFor | 3.017 | 2.417 | 0.34 |  |
| TopShare | 0.574 | 0.670 | 0.41 |  |
| ForSide | 153.846 | 91.701 | 0.58 |  |
| AgainstSide | 49.198 | 29.376 | 0.25 |  |
| NetEdge | 1.120 | 0.667 | 0.56 |  |
| WalletPlayScore | 1.234 | 0.146 | 0.49 |  |

### V8 Era (n=460)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 46.379 | 45.630 | 0.04 |  |
| Rank_norm | 61.330 | 63.549 | 0.11 |  |
| PnL_norm | 53.227 | 53.858 | 0.04 |  |
| WalletBase | 49.709 | 49.349 | 0.03 |  |
| SizeRatio | 1.502 | 1.481 | 0.01 |  |
| ConvictionMult | 0.975 | 0.975 | 0.00 |  |
| WalletCountFor | 3.017 | 3.017 | 0.00 |  |
| TopShare | 0.574 | 0.574 | 0.00 |  |
| ForSide | 153.846 | 153.846 | 0.00 |  |
| AgainstSide | 49.198 | 49.198 | 0.00 |  |
| NetEdge | 1.120 | 1.120 | 0.00 |  |
| WalletPlayScore | 1.234 | 1.234 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=522)

- **Sizing issue**: Model P/L (-28.34u) trails flat (-22.61u) by 5.73u
- **Gate issue**: NO_MOVE ROI (-15.7%) significantly trails CLEAR_MOVE (3.2%)

### 7-Day (n=101)

- **Gate issue**: NO_MOVE ROI (-37.9%) significantly trails CLEAR_MOVE (-21.0%)

### All Time (n=1084)

- **Sizing issue**: Model P/L (-73.22u) trails flat (-52.12u) by 21.10u
- **Environment issue**: 49.4% NO_MOVE (WR: 53.5%, ROI: -5.5%)


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
| V8 era picks | 522 |
| V8 flat ROI | -4.3% |
| V8 model ROI | -3.1% |
| V8 star monotonicity score | 0.14 |
| 4.5-5★ ROI | -4.5% |
| 2.5-3★ ROI | -4.6% |
| CLEAR_MOVE ROI | 3.2% |
| NO_MOVE ROI | -15.7% |
| Single-wallet play rate | 25.3% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: 0.06% | 4.5★: -0.49% | 4★: -0.00% | 3.5★: -0.07% | 3★: 0.16% | 2.5★: -0.37% | 2★: 0.67% | 1★: -0.01% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=522)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 436 | 83.5% | 49.3% | -5.5% | -6.5% | -0.06% |
| MUTED | 75 | 14.4% | 56.0% | 2.2% | 20.8% | -0.11% |
| CANCELLED | 11 | 2.1% | 54.5% | -2.8% | -10.4% | 0.16% |

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

### 7-Day (n=101)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 99 | 98.0% | 47.5% | -11.0% | -4.2% | -0.31% |
| MUTED | 2 | 2.0% | 100.0% | 80.1% | 64.1% | 0.66% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| opp_side_stronger_diag | 3 | 66.7% |
| ags_hard_mute | 2 | 100.0% |
| wps_flipped_diag | 1 | 100.0% |

### All Time (n=1084)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 996 | 91.9% | 51.6% | -5.6% | -5.9% | -0.25% |
| MUTED | 75 | 6.9% | 56.0% | 2.2% | 20.8% | -0.11% |
| CANCELLED | 13 | 1.2% | 61.5% | 17.8% | 4.8% | -0.95% |

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
