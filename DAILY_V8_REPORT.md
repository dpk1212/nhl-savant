# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-06-01 ET
**Completed Picks**: 1066 | **V8 Era Picks**: 504 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (65.2%) beats 5★ (47.7%) |
| Model P/L vs flat P/L | ⚠️ | Model trails flat by 11.2u — sizing amplifying losses |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 56 | 50.0% | -4.26u | -7.6% | -1.24u | -1.1% | -0.63% | -0.69% |  |
| 7-Day | 122 | 53.3% | -4.51u | -3.7% | 6.76u | 2.7% | -0.42% | -0.77% |  |
| 14-Day | 225 | 51.1% | -13.01u | -5.8% | -24.00u | -5.5% | -0.14% | -0.69% |  |
| 30-Day | 334 | 52.1% | -10.50u | -3.1% | -21.79u | -3.3% | -0.14% | -0.62% |  |
| V8 Era | 504 | 50.6% | -21.23u | -4.2% | -32.43u | -3.7% | -0.07% | -0.52% |  |
| All Time | 1066 | 52.2% | -50.75u | -4.8% | -77.31u | -4.4% | -0.26% | -0.18% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=504)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 172 | 53.7% | 53.7% | 47.7% | -6.1% | -14.0% | -9.3% | 2.71 | 0.01% | Weak |
| 4.5 | 46 | 53.6% | 53.6% | 65.2% | +11.6% | 23.2% | 16.2% | 2.48 | -0.40% | Strong |
| 4 | 88 | 53.1% | 53.1% | 51.1% | -2.0% | -2.9% | 3.0% | 1.50 | -0.02% | Fair |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 59 | 53.6% | 53.6% | 47.5% | -6.1% | -7.4% | -16.1% | 1.03 | 0.17% | Weak |
| 2.5 | 60 | 52.5% | 52.5% | 50.0% | -2.5% | -3.5% | -12.1% | 0.79 | -0.32% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 7 | 53.4% | 53.4% | 42.9% | -10.5% | -25.7% | -3.7% | 0.50 | -0.06% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 47.7% | 65.2% | -17.5% | INVERTED |
| 4.5★ vs 4★ | 65.2% | 51.1% | +14.1% | Correct |
| 4★ vs 3.5★ | 51.1% | 51.5% | -0.4% | Flat |
| 3.5★ vs 3★ | 51.5% | 47.5% | +4.0% | Correct |
| 3★ vs 2.5★ | 47.5% | 50.0% | -2.5% | Flat |
| 2.5★ vs 2★ | 50.0% | 0.0% | +50.0% | Correct |
| 2★ vs 1★ | 0.0% | 42.9% | -42.9% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.667 |
| Spearman: Stars vs Flat ROI | 0.571 |
| Spearman: Stars vs CLV | -0.190 |
| Brier Score | 0.2442 |
| Monotonicity Score | 0.14 |

### All Time (n=1066)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 185 | 54.1% | 54.1% | 48.1% | -6.0% | -13.6% | -9.6% | 2.71 | 0.07% | Weak |
| 4.5 | 80 | 55.3% | 55.3% | 58.8% | +3.4% | 8.1% | 2.1% | 2.53 | 0.35% | Strong |
| 4 | 203 | 54.7% | 54.7% | 52.7% | -2.0% | -3.1% | -1.3% | 1.85 | -0.40% | Fair |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 219 | 54.7% | 54.7% | 48.4% | -6.3% | -11.5% | -12.1% | 1.16 | -0.37% | Weak |
| 2.5 | 167 | 53.8% | 53.8% | 53.3% | -0.5% | -1.7% | -3.0% | 0.75 | -0.63% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 7 | 53.4% | 53.4% | 42.9% | -10.5% | -25.7% | -3.7% | 0.50 | -0.06% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 48.1% | 58.8% | -10.7% | INVERTED |
| 4.5★ vs 4★ | 58.8% | 52.7% | +6.1% | Correct |
| 4★ vs 3.5★ | 52.7% | 56.5% | -3.8% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 48.4% | +8.1% | Correct |
| 3★ vs 2.5★ | 48.4% | 53.3% | -4.9% | INVERTED |
| 2.5★ vs 2★ | 53.3% | 0.0% | +53.3% | Correct |
| 2★ vs 1★ | 0.0% | 42.9% | -42.9% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.500 |
| Spearman: Stars vs Flat ROI | 0.500 |
| Spearman: Stars vs CLV | 0.071 |
| Brier Score | 0.2354 |
| Monotonicity Score | 0.14 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.189 | -0.056 | Tune |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.138 | -0.081 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.065 | -0.028 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.196 | -0.065 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | -0.021 | 0.029 | Monitor |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | 0.008 | 0.056 | Monitor |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | -0.150 | -0.021 | Tune |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.183 | -0.059 | Tune |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.003 | 0.050 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.137 | -0.052 | Tune |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.013 | 0.047 | Monitor |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.186 | 0.073 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.203 | 0.089 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.167 | -0.060 | Tune |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (11.60–36.50) | 82 | 57.3% | 3.1% | -1.5% | -0.13% |  |
| p20-40 (36.70–44.80) | 83 | 45.8% | -13.6% | -13.4% | 0.10% |  |
| p40-60 (44.82–50.40) | 83 | 54.2% | 0.6% | 17.7% | -0.77% |  |
| p60-80 (50.50–56.13) | 82 | 48.8% | 0.5% | -3.8% | 0.45% |  |
| p80-95 (56.15–64.10) | 83 | 51.8% | -1.9% | -5.5% | 0.02% |  |
| p95+ (64.44–83.30) | 83 | 44.6% | -15.2% | -18.0% | -0.14% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 167 | 49.1% | -9.2% | -2.2% | -0.20% |  |
| 0.90-1.05 | 170 | 45.3% | -14.0% | -18.9% | -0.05% |  |
| 1.05-1.20 | 111 | 60.4% | 18.1% | 21.5% | 0.10% |  |
| 1.20-1.35 | 29 | 51.7% | -2.6% | -18.9% | 0.36% |  |
| 1.35-1.50 | 11 | 45.5% | -15.6% | -42.1% | -0.34% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.47) | 74 | 56.8% | 1.5% | 5.6% | -0.20% |  |
| 20-40% (0.47–0.75) | 75 | 49.3% | -6.9% | -4.0% | -0.29% |  |
| 40-60% (0.76–1.01) | 74 | 55.4% | 3.9% | 12.9% | -0.29% |  |
| 60-80% (1.01–1.28) | 75 | 46.7% | -3.8% | -18.0% | 0.43% |  |
| 80-95% (1.29–1.85) | 74 | 43.2% | -16.3% | -3.5% | -0.13% |  |
| 95%+ (1.85–4.76) | 75 | 46.7% | -12.8% | -11.2% | 0.15% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 27 | 37.0% | -24.0% | -32.3% | 0.27% | Broad support |
| 0.25-0.40 | 95 | 49.5% | -2.7% | -6.7% | 0.22% | Healthy support |
| 0.40-0.60 | 142 | 45.8% | -12.2% | -0.1% | -0.09% | Concentrated |
| 0.60-0.80 | 103 | 56.3% | 4.5% | -0.3% | -0.29% | Very concentrated |
| 0.80-1.00 | 80 | 52.5% | -4.8% | -3.0% | -0.13% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 53 | 34.0% | -36.1% | -35.6% | -0.07% | 4.4 |
| Broad battle | 190 | 46.8% | -8.3% | -5.1% | 0.01% | 3.9 |
| One-wallet nuke | 137 | 54.7% | 0.4% | 0.7% | -0.15% | 3.5 |
| Thin support | 273 | 53.5% | -1.2% | -3.8% | -0.12% | 3.7 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=504)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 19 | 47.4% | -15.7% | 14.8% | 0.22% | 4.3 | 84.2% |
| SMALL_MOVE | 110 | 45.5% | -15.7% | -9.7% | -0.46% | 4.1 | 100.0% |
| CLEAR_MOVE | 128 | 56.3% | 4.0% | 6.2% | 0.12% | 4.2 | 100.0% |
| NEAR_START | 198 | 48.5% | -4.8% | -10.3% | 0.03% | 3.8 | 100.0% |

**All Time** (n=1066)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 536 | 53.5% | -5.5% | -4.0% | -0.48% | 3.3 | 4.5% |
| SMALL_MOVE | 113 | 45.1% | -16.2% | -11.5% | -0.39% | 4.1 | 97.3% |
| CLEAR_MOVE | 154 | 55.8% | 3.4% | 5.4% | 0.03% | 4.1 | 100.0% |
| NEAR_START | 214 | 48.6% | -5.4% | -10.4% | 0.06% | 3.8 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 9 / 55.6% / -5.6% | 52 / 46.2% / -20.0% | 65 / 58.5% / 5.3% | 81 / 48.1% / -7.1% |
| 3.5-4★ | 8 / 37.5% / -29.6% | 41 / 48.8% / -5.6% | 37 / 48.6% / -9.9% | 52 / 57.7% / 18.3% |
| 2.5-3★ | 2 / 50.0% / -5.8% | 14 / 35.7% / -25.0% | 26 / 61.5% / 20.4% | 59 / 42.4% / -17.9% |
| 1.0-2★ | — | 3 / 33.3% / -34.9% | — | 6 / 33.3% / -45.9% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 501 | 50.5% | -4.4% | -3.9% | 4.0 | -0.07% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 551 | 50.6% | -4.5% | -4.0% | 4.0 | -0.08% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 814 | 100% |
| LOCKED (direct) | 78 | 9.6% |
| Promoted (SHADOW→LOCKED) | 480 | 59.0% |
| Rejected (stayed SHADOW) | 169 | 20.8% |
| Superseded (side flipped) | 82 | 10.1% |
| Muted | 311 | 38.2% |
| Cancelled | 20 | 2.5% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=504)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -32.43u | -3.7% | — |
| Flat 1.0u | -21.23u | -4.2% | -11.20u |
| Lock units only | -22.73u | — | -9.70u |
| Units change only on star change | -18.32u | — | -14.11u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 172 | 2.71 | -14.0% | -9.3% | -19.19u | Sizing hurts |
| 4.5 | 46 | 2.48 | 23.2% | 16.2% | +7.78u | Sizing helps |
| 4 | 88 | 1.50 | -2.9% | 3.0% | +6.47u | Sizing helps |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 59 | 1.03 | -7.4% | -16.1% | -5.43u | Sizing hurts |
| 2.5 | 60 | 0.79 | -3.5% | -12.1% | -3.70u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 7 | 0.50 | -25.7% | -3.7% | +1.67u | Sizing helps |

### All Time (n=1066)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -77.31u | -4.4% | — |
| Flat 1.0u | -50.75u | -4.8% | -26.56u |
| Lock units only | -56.84u | — | -20.47u |
| Units change only on star change | -62.36u | — | -14.95u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 185 | 2.71 | -13.6% | -9.6% | -22.78u | Sizing hurts |
| 4.5 | 80 | 2.53 | 8.1% | 2.1% | -2.24u | Sizing hurts |
| 4 | 203 | 1.85 | -3.1% | -1.3% | +1.23u | Sizing helps |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 219 | 1.16 | -11.5% | -12.1% | -5.58u | Sizing hurts |
| 2.5 | 167 | 0.75 | -1.7% | -3.0% | -0.99u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 7 | 0.50 | -25.7% | -3.7% | +1.67u | Sizing helps |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 504 | 53.1% | 50.6% | -2.5% | -4.2% | -0.07% | Below market |
| 4.5-5★ | 218 | 53.7% | 51.4% | -2.3% | -6.2% | -0.08% | Below market |
| 3.5-4★ | 156 | 52.3% | 51.3% | -1.0% | 0.4% | -0.05% | Neutral |
| 2.5-3★ | 121 | 53.1% | 49.6% | -3.5% | -3.9% | -0.09% | Below market |
| CLEAR_MOVE only | 128 | 54.1% | 56.3% | +2.1% | 4.0% | 0.12% | Beating market |
| NO_MOVE only | 19 | 54.9% | 47.4% | -7.5% | -15.7% | 0.22% | Below market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=122)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 46.899 | 29.056 | 1.03 | ⚠️ |
| Rank_norm | 61.829 | 58.929 | 0.15 |  |
| PnL_norm | 53.438 | 52.794 | 0.04 |  |
| WalletBase | 50.113 | 38.386 | 0.86 |  |
| SizeRatio | 1.509 | 1.129 | 0.27 |  |
| ConvictionMult | 0.976 | 0.945 | 0.19 |  |
| WalletCountFor | 3.036 | 2.418 | 0.35 |  |
| TopShare | 0.572 | 0.679 | 0.46 |  |
| ForSide | 155.878 | 94.394 | 0.57 |  |
| AgainstSide | 49.321 | 26.879 | 0.28 |  |
| NetEdge | 1.140 | 0.715 | 0.52 |  |
| WalletPlayScore | 1.269 | 0.151 | 0.50 |  |

### V8 Era (n=447)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 46.899 | 46.252 | 0.04 |  |
| Rank_norm | 61.829 | 63.796 | 0.10 |  |
| PnL_norm | 53.438 | 53.940 | 0.03 |  |
| WalletBase | 50.113 | 49.770 | 0.03 |  |
| SizeRatio | 1.509 | 1.483 | 0.02 |  |
| ConvictionMult | 0.976 | 0.976 | 0.00 |  |
| WalletCountFor | 3.036 | 3.036 | 0.00 |  |
| TopShare | 0.572 | 0.572 | 0.00 |  |
| ForSide | 155.878 | 155.878 | 0.00 |  |
| AgainstSide | 49.321 | 49.321 | 0.00 |  |
| NetEdge | 1.140 | 1.140 | 0.00 |  |
| WalletPlayScore | 1.269 | 1.269 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=504)

- **Sizing issue**: Model P/L (-32.43u) trails flat (-21.23u) by 11.20u
- **Gate issue**: NO_MOVE ROI (-15.7%) significantly trails CLEAR_MOVE (4.0%)

### 7-Day (n=122)

- **Gate issue**: NO_MOVE ROI (-53.4%) significantly trails CLEAR_MOVE (-5.4%)

### All Time (n=1066)

- **Sizing issue**: Model P/L (-77.31u) trails flat (-50.75u) by 26.56u
- **Environment issue**: 50.3% NO_MOVE (WR: 53.5%, ROI: -5.5%)


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
| V8 era picks | 504 |
| V8 flat ROI | -4.2% |
| V8 model ROI | -3.7% |
| V8 star monotonicity score | 0.14 |
| 4.5-5★ ROI | -6.2% |
| 2.5-3★ ROI | -3.9% |
| CLEAR_MOVE ROI | 4.0% |
| NO_MOVE ROI | -15.7% |
| Single-wallet play rate | 24.4% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: 0.01% | 4.5★: -0.40% | 4★: -0.02% | 3.5★: -0.07% | 3★: 0.17% | 2.5★: -0.32% | 2★: 0.67% | 1★: -0.06% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=504)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 418 | 82.9% | 49.5% | -5.4% | -7.3% | -0.07% |
| MUTED | 75 | 14.9% | 56.0% | 2.2% | 20.8% | -0.11% |
| CANCELLED | 11 | 2.2% | 54.5% | -2.8% | -10.4% | 0.16% |

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

### 7-Day (n=122)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 118 | 96.7% | 52.5% | -5.1% | 1.5% | -0.44% |
| MUTED | 4 | 3.3% | 75.0% | 38.9% | 27.5% | 0.20% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| ags_hard_mute | 4 | 75.0% |
| opp_side_stronger_diag | 4 | 75.0% |
| wps_flipped_diag | 2 | 100.0% |

### All Time (n=1066)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 978 | 91.7% | 51.7% | -5.6% | -6.3% | -0.26% |
| MUTED | 75 | 7.0% | 56.0% | 2.2% | 20.8% | -0.11% |
| CANCELLED | 13 | 1.2% | 61.5% | 17.8% | 4.8% | -0.95% |

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
