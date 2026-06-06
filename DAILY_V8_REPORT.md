# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-06-06 ET
**Completed Picks**: 1134 | **V8 Era Picks**: 572 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (64.4%) beats 5★ (48.9%) |
| Model P/L vs flat P/L | ⚠️ | Model trails flat by 3.4u — sizing amplifying losses |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 50 | 60.0% | 6.82u | 13.6% | 9.12u | 9.8% | -0.36% | -0.67% | Strong |
| 7-Day | 101 | 54.5% | 3.68u | 3.6% | 12.50u | 6.3% | -0.27% | -0.73% |  |
| 14-Day | 233 | 54.1% | 1.86u | 0.8% | 17.72u | 4.0% | -0.27% | -0.73% |  |
| 30-Day | 377 | 53.1% | -2.64u | -0.7% | -4.78u | -0.6% | -0.09% | -0.68% |  |
| V8 Era | 572 | 51.2% | -15.79u | -2.8% | -19.22u | -1.9% | -0.09% | -0.54% |  |
| All Time | 1134 | 52.4% | -45.30u | -4.0% | -64.10u | -3.4% | -0.26% | -0.20% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=572)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 188 | 53.6% | 53.6% | 48.9% | -4.7% | -10.9% | -7.0% | 2.84 | -0.01% | Weak |
| 4.5 | 59 | 53.4% | 53.4% | 64.4% | +11.0% | 21.2% | 17.2% | 2.55 | -0.56% | Strong |
| 4 | 104 | 53.3% | 53.3% | 50.0% | -3.3% | -4.8% | 0.8% | 1.42 | 0.05% | Fair |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 71 | 53.6% | 53.6% | 52.1% | -1.5% | 2.0% | -10.4% | 0.94 | 0.10% | Fair |
| 2.5 | 69 | 53.3% | 53.3% | 47.8% | -5.5% | -7.9% | -13.3% | 0.72 | -0.32% | Weak |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 9 | 54.3% | 54.3% | 44.4% | -9.9% | -19.3% | 14.3% | 0.53 | -0.01% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 48.9% | 64.4% | -15.5% | INVERTED |
| 4.5★ vs 4★ | 64.4% | 50.0% | +14.4% | Correct |
| 4★ vs 3.5★ | 50.0% | 51.5% | -1.5% | Flat |
| 3.5★ vs 3★ | 51.5% | 52.1% | -0.6% | Flat |
| 3★ vs 2.5★ | 52.1% | 47.8% | +4.3% | Correct |
| 2.5★ vs 2★ | 47.8% | 0.0% | +47.8% | Correct |
| 2★ vs 1★ | 0.0% | 44.4% | -44.4% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.643 |
| Spearman: Stars vs Flat ROI | 0.548 |
| Spearman: Stars vs CLV | -0.405 |
| Brier Score | 0.2470 |
| Monotonicity Score | 0.14 |

### All Time (n=1134)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 201 | 54.0% | 54.0% | 49.3% | -4.7% | -10.8% | -7.4% | 2.83 | 0.04% | Weak |
| 4.5 | 93 | 55.0% | 55.0% | 59.1% | +4.2% | 8.9% | 4.9% | 2.57 | 0.13% | Strong |
| 4 | 219 | 54.7% | 54.7% | 52.1% | -2.6% | -4.0% | -2.0% | 1.79 | -0.33% | Fair |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 231 | 54.7% | 54.7% | 49.8% | -4.9% | -8.4% | -10.7% | 1.12 | -0.36% | Weak |
| 2.5 | 176 | 54.0% | 54.0% | 52.3% | -1.8% | -3.5% | -3.6% | 0.73 | -0.61% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 9 | 54.3% | 54.3% | 44.4% | -9.9% | -19.3% | 14.3% | 0.53 | -0.01% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 49.3% | 59.1% | -9.8% | INVERTED |
| 4.5★ vs 4★ | 59.1% | 52.1% | +7.0% | Correct |
| 4★ vs 3.5★ | 52.1% | 56.5% | -4.4% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 49.8% | +6.7% | Correct |
| 3★ vs 2.5★ | 49.8% | 52.3% | -2.5% | Flat |
| 2.5★ vs 2★ | 52.3% | 0.0% | +52.3% | Correct |
| 2★ vs 1★ | 0.0% | 44.4% | -44.4% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.500 |
| Spearman: Stars vs Flat ROI | 0.500 |
| Spearman: Stars vs CLV | 0.119 |
| Brier Score | 0.2373 |
| Monotonicity Score | 0.14 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.182 | -0.062 | Tune |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.167 | -0.114 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.059 | -0.034 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.195 | -0.077 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | -0.030 | 0.016 | Monitor |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | 0.001 | 0.041 | Monitor |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | -0.163 | -0.049 | Tune |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.188 | -0.071 | Tune |
| AgainstSide | Opposition | Force against side | Higher → worse | -0.008 | 0.042 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.142 | -0.063 | Tune |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | -0.003 | 0.027 | Monitor |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.190 | 0.083 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.202 | 0.093 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.168 | -0.070 | Tune |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (11.60–35.20) | 94 | 54.3% | -2.2% | -1.9% | 0.01% |  |
| p20-40 (35.20–43.88) | 94 | 57.4% | 10.1% | 10.0% | -0.08% |  |
| p40-60 (43.90–49.20) | 94 | 54.3% | 1.0% | 6.1% | -0.49% |  |
| p60-80 (49.23–54.87) | 94 | 43.6% | -12.6% | -8.9% | 0.22% |  |
| p80-95 (54.90–63.40) | 94 | 51.1% | 0.7% | -5.8% | 0.14% |  |
| p95+ (63.49–83.30) | 94 | 45.7% | -14.6% | -21.8% | -0.39% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 203 | 48.8% | -8.6% | -6.5% | -0.25% |  |
| 0.90-1.05 | 189 | 47.1% | -10.9% | -13.9% | -0.03% |  |
| 1.05-1.20 | 121 | 62.0% | 21.4% | 24.7% | 0.06% |  |
| 1.20-1.35 | 32 | 50.0% | -7.2% | -14.4% | 0.34% |  |
| 1.35-1.50 | 11 | 45.5% | -15.6% | -42.1% | -0.34% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.35) | 82 | 54.9% | 0.9% | 13.2% | -0.15% |  |
| 20-40% (0.36–0.70) | 83 | 56.6% | 5.7% | 2.2% | -0.29% |  |
| 40-60% (0.70–0.94) | 83 | 48.2% | -10.8% | 3.3% | -0.28% |  |
| 60-80% (0.95–1.25) | 83 | 53.0% | 7.3% | -6.9% | 0.36% |  |
| 80-95% (1.25–1.79) | 83 | 45.8% | -10.6% | -2.9% | -0.01% |  |
| 95%+ (1.79–6.68) | 83 | 44.6% | -16.8% | -14.0% | 0.16% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 29 | 34.5% | -29.2% | -32.9% | 0.26% | Broad support |
| 0.25-0.40 | 102 | 51.0% | 0.1% | -4.4% | 0.28% | Healthy support |
| 0.40-0.60 | 155 | 47.1% | -9.9% | 1.1% | -0.09% | Concentrated |
| 0.60-0.80 | 110 | 57.3% | 6.5% | 4.8% | -0.23% | Very concentrated |
| 0.80-1.00 | 101 | 52.5% | -3.7% | -1.3% | -0.15% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 56 | 35.7% | -33.1% | -34.9% | -0.09% | 4.3 |
| Broad battle | 205 | 47.3% | -7.1% | -1.9% | 0.05% | 3.9 |
| One-wallet nuke | 176 | 54.0% | 0.4% | -0.6% | -0.28% | 3.7 |
| Thin support | 323 | 53.9% | 0.5% | -1.9% | -0.18% | 3.8 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=572)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 22 | 54.5% | -1.3% | 25.3% | 0.34% | 4.3 | 86.4% |
| SMALL_MOVE | 125 | 47.2% | -12.3% | -2.0% | -0.43% | 4.1 | 100.0% |
| CLEAR_MOVE | 132 | 56.1% | 3.5% | 6.7% | 0.13% | 4.1 | 100.0% |
| NEAR_START | 226 | 49.1% | -3.7% | -10.3% | 0.05% | 3.8 | 100.0% |

**All Time** (n=1134)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 539 | 53.8% | -5.0% | -3.3% | -0.47% | 3.3 | 5.0% |
| SMALL_MOVE | 128 | 46.9% | -12.9% | -3.8% | -0.37% | 4.1 | 97.7% |
| CLEAR_MOVE | 158 | 55.7% | 3.0% | 5.9% | 0.04% | 4.1 | 100.0% |
| NEAR_START | 242 | 49.2% | -4.2% | -10.4% | 0.07% | 3.8 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 11 / 63.6% / 10.4% | 59 / 50.8% / -9.7% | 66 / 59.1% / 6.1% | 92 / 47.8% / -7.6% |
| 3.5-4★ | 8 / 37.5% / -29.6% | 43 / 48.8% / -6.5% | 38 / 47.4% / -12.2% | 61 / 59.0% / 20.6% |
| 2.5-3★ | 3 / 66.7% / 31.2% | 19 / 36.8% / -25.7% | 28 / 60.7% / 18.8% | 66 / 42.4% / -18.6% |
| 1.0-2★ | — | 4 / 25.0% / -51.2% | — | 7 / 42.9% / -24.2% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 569 | 51.1% | -2.9% | -2.1% | 4.0 | -0.10% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 619 | 51.2% | -3.2% | -2.3% | 4.0 | -0.10% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 924 | 100% |
| LOCKED (direct) | 87 | 9.4% |
| Promoted (SHADOW→LOCKED) | 557 | 60.3% |
| Rejected (stayed SHADOW) | 173 | 18.7% |
| Superseded (side flipped) | 102 | 11.0% |
| Muted | 345 | 37.3% |
| Cancelled | 20 | 2.2% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=572)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -19.22u | -1.9% | — |
| Flat 1.0u | -15.79u | -2.8% | -3.43u |
| Lock units only | -7.50u | — | -11.72u |
| Units change only on star change | -3.10u | — | -16.12u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 188 | 2.84 | -10.9% | -7.0% | -17.05u | Sizing hurts |
| 4.5 | 59 | 2.55 | 21.2% | 17.2% | +13.39u | Sizing helps |
| 4 | 104 | 1.42 | -4.8% | 0.8% | +6.18u | Sizing helps |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 71 | 0.94 | 2.0% | -10.4% | -8.38u | Sizing hurts |
| 2.5 | 69 | 0.72 | -7.9% | -13.3% | -1.20u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 9 | 0.53 | -19.3% | 14.3% | +2.42u | Sizing helps |

### All Time (n=1134)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -64.10u | -3.4% | — |
| Flat 1.0u | -45.30u | -4.0% | -18.80u |
| Lock units only | -41.62u | — | -22.48u |
| Units change only on star change | -47.14u | — | -16.96u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 201 | 2.83 | -10.8% | -7.4% | -20.64u | Sizing hurts |
| 4.5 | 93 | 2.57 | 8.9% | 4.9% | +3.38u | Sizing helps |
| 4 | 219 | 1.79 | -4.0% | -2.0% | +0.94u | Sizing helps |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 231 | 1.12 | -8.4% | -10.7% | -8.53u | Sizing hurts |
| 2.5 | 176 | 0.73 | -3.5% | -3.6% | +1.52u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 9 | 0.53 | -19.3% | 14.3% | +2.42u | Sizing helps |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 572 | 53.2% | 51.2% | -2.0% | -2.8% | -0.09% | Below market |
| 4.5-5★ | 247 | 53.6% | 52.6% | -0.9% | -3.2% | -0.15% | Neutral |
| 3.5-4★ | 172 | 52.5% | 50.6% | -1.9% | -1.0% | -0.00% | Neutral |
| 2.5-3★ | 142 | 53.5% | 50.7% | -2.8% | -1.6% | -0.11% | Below market |
| CLEAR_MOVE only | 132 | 54.1% | 56.1% | +1.9% | 3.5% | 0.13% | Neutral |
| NO_MOVE only | 22 | 54.8% | 54.5% | -0.2% | -1.3% | 0.34% | Neutral |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=83)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 45.137 | 28.263 | 0.94 |  |
| Rank_norm | 60.635 | 58.840 | 0.09 |  |
| PnL_norm | 53.440 | 57.027 | 0.21 |  |
| WalletBase | 48.996 | 39.190 | 0.72 |  |
| SizeRatio | 1.459 | 1.240 | 0.16 |  |
| ConvictionMult | 0.969 | 0.962 | 0.04 |  |
| WalletCountFor | 2.984 | 2.386 | 0.33 |  |
| TopShare | 0.585 | 0.700 | 0.48 |  |
| ForSide | 151.098 | 101.424 | 0.44 |  |
| AgainstSide | 49.365 | 40.552 | 0.11 |  |
| NetEdge | 1.091 | 0.669 | 0.50 |  |
| WalletPlayScore | 1.139 | -0.033 | 0.51 |  |

### V8 Era (n=497)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 45.137 | 44.362 | 0.04 |  |
| Rank_norm | 60.635 | 63.317 | 0.13 |  |
| PnL_norm | 53.440 | 54.239 | 0.05 |  |
| WalletBase | 48.996 | 48.637 | 0.03 |  |
| SizeRatio | 1.459 | 1.452 | 0.00 |  |
| ConvictionMult | 0.969 | 0.972 | 0.02 |  |
| WalletCountFor | 2.984 | 2.984 | 0.00 |  |
| TopShare | 0.585 | 0.585 | 0.00 |  |
| ForSide | 151.098 | 151.098 | 0.00 |  |
| AgainstSide | 49.365 | 49.365 | 0.00 |  |
| NetEdge | 1.091 | 1.091 | 0.00 |  |
| WalletPlayScore | 1.139 | 1.139 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=572)

- **Sizing issue**: Model P/L (-19.22u) trails flat (-15.79u) by 3.43u

### 7-Day (n=101)

No major failure modes detected.

### All Time (n=1134)

- **Sizing issue**: Model P/L (-64.10u) trails flat (-45.30u) by 18.80u
- **Environment issue**: 47.5% NO_MOVE (WR: 53.8%, ROI: -5.0%)


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
| V8 era picks | 572 |
| V8 flat ROI | -2.8% |
| V8 model ROI | -1.9% |
| V8 star monotonicity score | 0.14 |
| 4.5-5★ ROI | -3.2% |
| 2.5-3★ ROI | -1.6% |
| CLEAR_MOVE ROI | 3.5% |
| NO_MOVE ROI | -1.3% |
| Single-wallet play rate | 28.1% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: -0.01% | 4.5★: -0.56% | 4★: 0.05% | 3.5★: -0.07% | 3★: 0.10% | 2.5★: -0.32% | 2★: 0.67% | 1★: -0.01% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=572)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 486 | 85.0% | 50.4% | -3.5% | -4.8% | -0.09% |
| MUTED | 75 | 13.1% | 56.0% | 2.2% | 20.8% | -0.11% |
| CANCELLED | 11 | 1.9% | 54.5% | -2.8% | -10.4% | 0.16% |

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
| ACTIVE | 101 | 100.0% | 54.5% | 3.6% | 6.3% | -0.27% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| opp_side_stronger_diag | 1 | 0.0% |

### All Time (n=1134)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 1046 | 92.2% | 52.0% | -4.7% | -5.1% | -0.26% |
| MUTED | 75 | 6.6% | 56.0% | 2.2% | 20.8% | -0.11% |
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
