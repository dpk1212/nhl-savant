# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-06-12 ET
**Completed Picks**: 1240 | **V8 Era Picks**: 678 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (65.9%) beats 5★ (48.8%) |
| Single-wallet dependency | ⚠️ | 33% of picks are single-wallet (WR: 55.9%, ROI: 6.2%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 55 | 45.5% | -5.00u | -9.1% | 2.85u | 2.5% | -1.06% | 0.56% |  |
| 7-Day | 124 | 53.2% | 3.13u | 2.5% | 25.88u | 10.1% | -0.52% | 1.25% |  |
| 14-Day | 230 | 52.2% | -0.26u | -0.1% | 26.64u | 5.7% | -0.51% | -0.17% |  |
| 30-Day | 438 | 52.1% | -6.60u | -1.5% | 4.46u | 0.5% | -0.23% | -0.45% |  |
| V8 Era | 678 | 51.2% | -17.23u | -2.5% | -4.55u | -0.4% | -0.17% | -0.41% |  |
| All Time | 1240 | 52.3% | -46.74u | -3.8% | -49.43u | -2.3% | -0.29% | -0.15% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=678)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 215 | 53.5% | 53.5% | 48.8% | -4.7% | -10.7% | -5.8% | 3.01 | -0.04% | Weak |
| 4.5 | 88 | 53.3% | 53.3% | 65.9% | +12.7% | 25.5% | 20.5% | 2.63 | -1.05% | Strong |
| 4 | 128 | 53.0% | 53.0% | 46.9% | -6.2% | -9.7% | -3.1% | 1.33 | -0.00% | Weak |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 84 | 53.4% | 53.4% | 51.2% | -2.2% | -0.6% | -10.9% | 0.87 | 0.13% | Fair |
| 2.5 | 82 | 53.4% | 53.4% | 48.8% | -4.6% | -6.1% | -11.9% | 0.64 | -0.23% | Weak |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 9 | 54.3% | 54.3% | 44.4% | -9.9% | -19.3% | 14.3% | 0.53 | -0.01% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 48.8% | 65.9% | -17.1% | INVERTED |
| 4.5★ vs 4★ | 65.9% | 46.9% | +19.0% | Correct |
| 4★ vs 3.5★ | 46.9% | 51.5% | -4.6% | INVERTED |
| 3.5★ vs 3★ | 51.5% | 51.2% | +0.3% | Correct |
| 3★ vs 2.5★ | 51.2% | 48.8% | +2.4% | Correct |
| 2.5★ vs 2★ | 48.8% | 0.0% | +48.8% | Correct |
| 2★ vs 1★ | 0.0% | 44.4% | -44.4% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.524 |
| Spearman: Stars vs Flat ROI | 0.476 |
| Spearman: Stars vs CLV | -0.405 |
| Brier Score | 0.2481 |
| Monotonicity Score | -0.14 |

### All Time (n=1240)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 228 | 53.8% | 53.8% | 49.1% | -4.7% | -10.6% | -6.2% | 2.99 | 0.01% | Weak |
| 4.5 | 122 | 54.5% | 54.5% | 61.5% | +7.0% | 14.9% | 10.4% | 2.63 | -0.41% | Strong |
| 4 | 243 | 54.4% | 54.4% | 50.2% | -4.2% | -6.6% | -3.4% | 1.71 | -0.32% | Weak |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 244 | 54.6% | 54.6% | 49.6% | -5.0% | -8.7% | -10.9% | 1.09 | -0.32% | Weak |
| 2.5 | 189 | 54.0% | 54.0% | 52.4% | -1.6% | -3.0% | -3.3% | 0.69 | -0.55% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 9 | 54.3% | 54.3% | 44.4% | -9.9% | -19.3% | 14.3% | 0.53 | -0.01% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 49.1% | 61.5% | -12.4% | INVERTED |
| 4.5★ vs 4★ | 61.5% | 50.2% | +11.3% | Correct |
| 4★ vs 3.5★ | 50.2% | 56.5% | -6.3% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 49.6% | +6.9% | Correct |
| 3★ vs 2.5★ | 49.6% | 52.4% | -2.8% | Flat |
| 2.5★ vs 2★ | 52.4% | 0.0% | +52.4% | Correct |
| 2★ vs 1★ | 0.0% | 44.4% | -44.4% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.500 |
| Spearman: Stars vs Flat ROI | 0.500 |
| Spearman: Stars vs CLV | -0.190 |
| Brier Score | 0.2387 |
| Monotonicity Score | 0.14 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.121 | -0.029 | Tune |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.181 | -0.123 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.085 | -0.051 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.152 | -0.055 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | -0.040 | 0.003 | Monitor |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | -0.010 | 0.029 | Monitor |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | -0.140 | -0.039 | Tune |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.188 | -0.087 | Tune |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.013 | 0.049 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.162 | -0.089 | Tune |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | -0.024 | -0.003 | Monitor |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.206 | 0.113 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.214 | 0.121 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.185 | -0.099 | Tune |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (11.60–35.25) | 111 | 55.0% | -1.4% | 3.2% | -0.05% |  |
| p20-40 (35.40–43.12) | 112 | 56.3% | 10.1% | 10.5% | -0.30% |  |
| p40-60 (43.23–48.41) | 112 | 50.0% | -6.3% | -2.7% | -0.48% |  |
| p60-80 (48.47–54.05) | 111 | 45.9% | -12.6% | -8.0% | 0.19% |  |
| p80-95 (54.27–62.10) | 112 | 50.0% | 2.0% | -3.6% | -0.08% |  |
| p95+ (62.20–83.30) | 112 | 49.1% | -8.0% | -6.9% | -0.33% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 251 | 47.8% | -9.3% | -6.2% | -0.45% |  |
| 0.90-1.05 | 232 | 48.3% | -8.8% | -8.5% | -0.00% |  |
| 1.05-1.20 | 131 | 63.4% | 24.3% | 28.8% | 0.04% |  |
| 1.20-1.35 | 36 | 50.0% | -7.7% | -16.1% | 0.16% |  |
| 1.35-1.50 | 11 | 45.5% | -15.6% | -42.1% | -0.34% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-2.06–0.26) | 93 | 50.5% | -5.3% | 0.9% | -0.30% |  |
| 20-40% (0.27–0.63) | 94 | 61.7% | 14.8% | 14.0% | 0.13% |  |
| 40-60% (0.63–0.90) | 94 | 48.9% | -7.8% | 2.8% | -0.93% |  |
| 60-80% (0.91–1.22) | 94 | 52.1% | 3.9% | -3.1% | 0.27% |  |
| 80-95% (1.23–1.69) | 94 | 42.6% | -15.7% | -11.2% | 0.04% |  |
| 95%+ (1.69–6.68) | 94 | 44.7% | -17.3% | -11.6% | 0.07% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 32 | 34.4% | -29.9% | -33.6% | 0.21% | Broad support |
| 0.25-0.40 | 112 | 46.4% | -8.8% | -9.7% | 0.23% | Healthy support |
| 0.40-0.60 | 173 | 48.0% | -8.6% | 0.2% | -0.33% | Concentrated |
| 0.60-0.80 | 119 | 58.8% | 9.5% | 10.5% | -0.23% | Very concentrated |
| 0.80-1.00 | 127 | 52.0% | -2.3% | -2.5% | -0.12% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 62 | 33.9% | -37.0% | -35.3% | -0.14% | 4.3 |
| Broad battle | 236 | 48.3% | -6.1% | -0.1% | 0.05% | 3.9 |
| One-wallet nuke | 242 | 54.1% | 2.3% | 3.3% | -0.26% | 3.8 |
| Thin support | 408 | 54.4% | 2.5% | 1.9% | -0.28% | 3.8 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=678)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 25 | 52.0% | -6.1% | 15.1% | 0.31% | 4.2 | 88.0% |
| SMALL_MOVE | 145 | 48.3% | -8.8% | -2.6% | -0.74% | 4.1 | 100.0% |
| CLEAR_MOVE | 135 | 54.8% | 1.2% | 4.2% | 0.15% | 4.1 | 100.0% |
| NEAR_START | 266 | 48.9% | -4.6% | -7.1% | 0.05% | 3.8 | 100.0% |

**All Time** (n=1240)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 542 | 53.7% | -5.2% | -3.6% | -0.46% | 3.3 | 5.5% |
| SMALL_MOVE | 148 | 48.0% | -9.3% | -4.1% | -0.68% | 4.1 | 98.0% |
| CLEAR_MOVE | 161 | 54.7% | 1.1% | 3.8% | 0.06% | 4.1 | 100.0% |
| NEAR_START | 282 | 48.9% | -5.1% | -7.4% | 0.06% | 3.8 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 13 / 61.5% / 7.1% | 73 / 50.7% / -8.2% | 67 / 58.2% / 4.5% | 107 / 49.5% / -4.5% |
| 3.5-4★ | 8 / 37.5% / -29.6% | 47 / 51.1% / 0.7% | 39 / 46.2% / -14.5% | 72 / 54.2% / 10.1% |
| 2.5-3★ | 4 / 50.0% / -1.6% | 21 / 38.1% / -23.6% | 29 / 58.6% / 14.7% | 80 / 43.8% / -16.4% |
| 1.0-2★ | — | 4 / 25.0% / -51.2% | — | 7 / 42.9% / -24.2% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 675 | 51.1% | -2.7% | -0.5% | 4.0 | -0.18% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 725 | 51.2% | -2.9% | -0.8% | 4.0 | -0.17% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 1092 | 100% |
| LOCKED (direct) | 94 | 8.6% |
| Promoted (SHADOW→LOCKED) | 691 | 63.3% |
| Rejected (stayed SHADOW) | 184 | 16.8% |
| Superseded (side flipped) | 118 | 10.8% |
| Muted | 387 | 35.4% |
| Cancelled | 20 | 1.8% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=678)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -4.55u | -0.4% | — |
| Flat 1.0u | -17.23u | -2.5% | +12.68u |
| Lock units only | 7.27u | — | -11.82u |
| Units change only on star change | 11.68u | — | -16.23u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 215 | 3.01 | -10.7% | -5.8% | -14.34u | Sizing hurts |
| 4.5 | 88 | 2.63 | 25.5% | 20.5% | +25.16u | Sizing helps |
| 4 | 128 | 1.33 | -9.7% | -3.1% | +7.02u | Sizing helps |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 84 | 0.87 | -0.6% | -10.9% | -7.52u | Sizing hurts |
| 2.5 | 82 | 0.64 | -6.1% | -11.9% | -1.26u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 9 | 0.53 | -19.3% | 14.3% | +2.42u | Sizing helps |

### All Time (n=1240)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -49.43u | -2.3% | — |
| Flat 1.0u | -46.74u | -3.8% | -2.69u |
| Lock units only | -26.84u | — | -22.59u |
| Units change only on star change | -32.36u | — | -17.07u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 228 | 2.99 | -10.6% | -6.2% | -17.93u | Sizing hurts |
| 4.5 | 122 | 2.63 | 14.9% | 10.4% | +15.15u | Sizing helps |
| 4 | 243 | 1.71 | -6.6% | -3.4% | +1.77u | Sizing helps |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 244 | 1.09 | -8.7% | -10.9% | -7.66u | Sizing hurts |
| 2.5 | 189 | 0.69 | -3.0% | -3.3% | +1.45u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 9 | 0.53 | -19.3% | 14.3% | +2.42u | Sizing helps |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 678 | 53.1% | 51.2% | -2.0% | -2.5% | -0.17% | Neutral |
| 4.5-5★ | 303 | 53.4% | 53.8% | +0.4% | -0.2% | -0.34% | Neutral |
| 3.5-4★ | 196 | 52.4% | 48.5% | -3.9% | -4.7% | -0.03% | Below market |
| 2.5-3★ | 168 | 53.4% | 50.6% | -2.8% | -2.2% | -0.06% | Below market |
| CLEAR_MOVE only | 135 | 54.2% | 54.8% | +0.6% | 1.2% | 0.15% | Neutral |
| NO_MOVE only | 25 | 54.7% | 52.0% | -2.7% | -6.1% | 0.31% | Below market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=79)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 45.034 | 37.020 | 0.44 |  |
| Rank_norm | 57.995 | 59.676 | 0.08 |  |
| PnL_norm | 52.149 | 56.221 | 0.23 |  |
| WalletBase | 48.383 | 44.075 | 0.33 |  |
| SizeRatio | 1.396 | 1.109 | 0.22 |  |
| ConvictionMult | 0.961 | 0.937 | 0.15 |  |
| WalletCountFor | 2.909 | 2.392 | 0.28 |  |
| TopShare | 0.598 | 0.697 | 0.40 |  |
| ForSide | 145.682 | 109.780 | 0.32 |  |
| AgainstSide | 50.790 | 62.273 | 0.14 |  |
| NetEdge | 1.025 | 0.569 | 0.53 |  |
| WalletPlayScore | 0.985 | -0.123 | 0.47 |  |

### V8 Era (n=563)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 45.034 | 43.623 | 0.08 |  |
| Rank_norm | 57.995 | 62.780 | 0.22 |  |
| PnL_norm | 52.149 | 54.332 | 0.12 |  |
| WalletBase | 48.383 | 48.121 | 0.02 |  |
| SizeRatio | 1.396 | 1.410 | 0.01 |  |
| ConvictionMult | 0.961 | 0.967 | 0.04 |  |
| WalletCountFor | 2.909 | 2.909 | 0.00 |  |
| TopShare | 0.598 | 0.598 | 0.00 |  |
| ForSide | 145.682 | 145.682 | 0.00 |  |
| AgainstSide | 50.790 | 50.790 | 0.00 |  |
| NetEdge | 1.025 | 1.025 | 0.00 |  |
| WalletPlayScore | 0.985 | 0.985 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=678)

No major failure modes detected.

### 7-Day (n=124)

- **Odds issue**: Avg CLV -0.52% — consistently getting bad closing lines

### All Time (n=1240)

- **Sizing issue**: Model P/L (-49.43u) trails flat (-46.74u) by 2.69u
- **Environment issue**: 43.7% NO_MOVE (WR: 53.7%, ROI: -5.2%)


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
| V8 era picks | 678 |
| V8 flat ROI | -2.5% |
| V8 model ROI | -0.4% |
| V8 star monotonicity score | -0.14 |
| 4.5-5★ ROI | -0.2% |
| 2.5-3★ ROI | -2.2% |
| CLEAR_MOVE ROI | 1.2% |
| NO_MOVE ROI | -6.1% |
| Single-wallet play rate | 33.5% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: -0.04% | 4.5★: -1.05% | 4★: -0.00% | 3.5★: -0.07% | 3★: 0.13% | 2.5★: -0.23% | 2★: 0.67% | 1★: -0.01% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=678)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 592 | 87.3% | 50.5% | -3.1% | -2.4% | -0.19% |
| MUTED | 75 | 11.1% | 56.0% | 2.2% | 20.8% | -0.11% |
| CANCELLED | 11 | 1.6% | 54.5% | -2.8% | -10.4% | 0.16% |

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

### 7-Day (n=124)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 124 | 100.0% | 53.2% | 2.5% | 10.1% | -0.52% |

### All Time (n=1240)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 1152 | 92.9% | 51.9% | -4.4% | -3.8% | -0.29% |
| MUTED | 75 | 6.0% | 56.0% | 2.2% | 20.8% | -0.11% |
| CANCELLED | 13 | 1.0% | 61.5% | 17.8% | 4.8% | -0.95% |

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
