# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-06-05 ET
**Completed Picks**: 1116 | **V8 Era Picks**: 554 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (63.2%) beats 5★ (48.4%) |
| Model P/L vs flat P/L | ⚠️ | Model trails flat by 10.1u — sizing amplifying losses |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 42 | 52.4% | 0.37u | 0.9% | -0.14u | -0.2% | -0.48% | -0.61% |  |
| 7-Day | 106 | 50.9% | -3.39u | -3.2% | 0.76u | 0.4% | -0.50% | -0.69% |  |
| 14-Day | 235 | 51.9% | -7.48u | -3.2% | -10.66u | -2.4% | -0.21% | -0.72% |  |
| 30-Day | 363 | 52.6% | -5.59u | -1.5% | -12.26u | -1.7% | -0.09% | -0.67% |  |
| V8 Era | 554 | 50.7% | -20.36u | -3.7% | -30.43u | -3.1% | -0.09% | -0.53% |  |
| All Time | 1116 | 52.2% | -49.88u | -4.5% | -75.31u | -4.1% | -0.26% | -0.19% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=554)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 184 | 53.6% | 53.6% | 48.4% | -5.2% | -11.9% | -8.2% | 2.81 | -0.01% | Weak |
| 4.5 | 57 | 53.3% | 53.3% | 63.2% | +9.8% | 19.0% | 14.5% | 2.53 | -0.56% | Strong |
| 4 | 100 | 53.0% | 53.0% | 50.0% | -3.0% | -4.2% | 1.4% | 1.44 | 0.04% | Fair |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 67 | 53.8% | 53.8% | 49.3% | -4.5% | -4.1% | -13.9% | 0.97 | 0.12% | Fair |
| 2.5 | 66 | 53.0% | 53.0% | 50.0% | -3.0% | -3.7% | -12.0% | 0.74 | -0.35% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 8 | 55.0% | 55.0% | 37.5% | -17.5% | -35.0% | -10.1% | 0.47 | -0.01% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 48.4% | 63.2% | -14.8% | INVERTED |
| 4.5★ vs 4★ | 63.2% | 50.0% | +13.2% | Correct |
| 4★ vs 3.5★ | 50.0% | 51.5% | -1.5% | Flat |
| 3.5★ vs 3★ | 51.5% | 49.3% | +2.2% | Correct |
| 3★ vs 2.5★ | 49.3% | 50.0% | -0.7% | Flat |
| 2.5★ vs 2★ | 50.0% | 0.0% | +50.0% | Correct |
| 2★ vs 1★ | 0.0% | 37.5% | -37.5% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.500 |
| Spearman: Stars vs Flat ROI | 0.452 |
| Spearman: Stars vs CLV | -0.405 |
| Brier Score | 0.2466 |
| Monotonicity Score | 0.14 |

### All Time (n=1116)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 197 | 53.9% | 53.9% | 48.7% | -5.2% | -11.7% | -8.5% | 2.80 | 0.04% | Weak |
| 4.5 | 91 | 55.0% | 55.0% | 58.2% | +3.3% | 7.3% | 2.9% | 2.56 | 0.14% | Strong |
| 4 | 215 | 54.6% | 54.6% | 52.1% | -2.5% | -3.7% | -1.8% | 1.80 | -0.34% | Fair |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 227 | 54.8% | 54.8% | 48.9% | -5.9% | -10.3% | -11.6% | 1.13 | -0.36% | Weak |
| 2.5 | 173 | 53.9% | 53.9% | 53.2% | -0.7% | -1.8% | -3.1% | 0.74 | -0.63% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 8 | 55.0% | 55.0% | 37.5% | -17.5% | -35.0% | -10.1% | 0.47 | -0.01% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 48.7% | 58.2% | -9.5% | INVERTED |
| 4.5★ vs 4★ | 58.2% | 52.1% | +6.1% | Correct |
| 4★ vs 3.5★ | 52.1% | 56.5% | -4.4% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 48.9% | +7.6% | Correct |
| 3★ vs 2.5★ | 48.9% | 53.2% | -4.3% | INVERTED |
| 2.5★ vs 2★ | 53.2% | 0.0% | +53.2% | Correct |
| 2★ vs 1★ | 0.0% | 37.5% | -37.5% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.500 |
| Spearman: Stars vs Flat ROI | 0.500 |
| Spearman: Stars vs CLV | 0.119 |
| Brier Score | 0.2370 |
| Monotonicity Score | 0.14 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.180 | -0.066 | Tune |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.168 | -0.111 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.071 | -0.034 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.193 | -0.078 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | -0.029 | 0.020 | Monitor |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | 0.001 | 0.045 | Monitor |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | -0.160 | -0.044 | Tune |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.178 | -0.062 | Tune |
| AgainstSide | Opposition | Force against side | Higher → worse | -0.005 | 0.045 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.134 | -0.055 | Tune |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.010 | 0.038 | Monitor |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.176 | 0.071 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.188 | 0.081 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.158 | -0.060 | Tune |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (11.60–35.20) | 91 | 54.9% | -0.7% | -1.0% | 0.01% |  |
| p20-40 (35.20–44.18) | 91 | 54.9% | 5.6% | 4.9% | -0.10% |  |
| p40-60 (44.30–49.60) | 91 | 51.6% | -3.9% | 1.7% | -0.44% |  |
| p60-80 (49.60–55.30) | 91 | 45.1% | -9.5% | -8.7% | 0.23% |  |
| p80-95 (55.33–63.60) | 91 | 50.5% | -1.6% | -6.2% | 0.02% |  |
| p95+ (63.60–83.30) | 91 | 46.2% | -13.1% | -18.5% | -0.32% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 193 | 48.2% | -10.2% | -8.7% | -0.25% |  |
| 0.90-1.05 | 185 | 46.5% | -11.7% | -13.2% | -0.03% |  |
| 1.05-1.20 | 118 | 61.0% | 19.9% | 21.9% | 0.06% |  |
| 1.20-1.35 | 31 | 51.6% | -4.2% | -14.1% | 0.30% |  |
| 1.35-1.50 | 11 | 45.5% | -15.6% | -42.1% | -0.34% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.37) | 80 | 52.5% | -3.7% | 0.2% | -0.21% |  |
| 20-40% (0.37–0.71) | 81 | 56.8% | 5.7% | 5.1% | -0.20% |  |
| 40-60% (0.71–0.95) | 81 | 48.1% | -10.6% | 4.0% | -0.27% |  |
| 60-80% (0.95–1.25) | 80 | 52.5% | 7.0% | -7.9% | 0.35% |  |
| 80-95% (1.26–1.79) | 81 | 44.4% | -12.7% | -5.3% | -0.03% |  |
| 95%+ (1.83–6.68) | 81 | 45.7% | -14.8% | -12.1% | 0.11% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 28 | 35.7% | -26.7% | -32.6% | 0.21% | Broad support |
| 0.25-0.40 | 100 | 51.0% | 0.2% | -4.5% | 0.28% | Healthy support |
| 0.40-0.60 | 153 | 46.4% | -10.8% | 0.7% | -0.10% | Concentrated |
| 0.60-0.80 | 108 | 57.4% | 7.0% | 3.6% | -0.24% | Very concentrated |
| 0.80-1.00 | 95 | 50.5% | -7.7% | -7.4% | -0.14% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 55 | 34.5% | -35.4% | -35.4% | -0.11% | 4.4 |
| Broad battle | 200 | 47.5% | -6.7% | -3.1% | 0.06% | 3.9 |
| One-wallet nuke | 165 | 52.7% | -2.5% | -3.7% | -0.27% | 3.6 |
| Thin support | 310 | 53.2% | -0.9% | -3.6% | -0.17% | 3.8 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=554)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 22 | 54.5% | -1.3% | 25.3% | 0.34% | 4.3 | 86.4% |
| SMALL_MOVE | 120 | 45.0% | -16.2% | -6.6% | -0.44% | 4.1 | 100.0% |
| CLEAR_MOVE | 130 | 56.2% | 3.9% | 5.9% | 0.12% | 4.1 | 100.0% |
| NEAR_START | 220 | 49.1% | -3.7% | -10.4% | 0.04% | 3.8 | 100.0% |

**All Time** (n=1116)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 539 | 53.8% | -5.0% | -3.3% | -0.47% | 3.3 | 5.0% |
| SMALL_MOVE | 123 | 44.7% | -16.7% | -8.3% | -0.37% | 4.1 | 97.6% |
| CLEAR_MOVE | 156 | 55.8% | 3.3% | 5.2% | 0.03% | 4.1 | 100.0% |
| NEAR_START | 236 | 49.2% | -4.2% | -10.5% | 0.06% | 3.8 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 11 / 63.6% / 10.4% | 56 / 48.2% / -14.8% | 65 / 58.5% / 5.3% | 90 / 47.8% / -7.6% |
| 3.5-4★ | 8 / 37.5% / -29.6% | 42 / 47.6% / -7.9% | 38 / 47.4% / -12.2% | 60 / 58.3% / 19.7% |
| 2.5-3★ | 3 / 66.7% / 31.2% | 18 / 33.3% / -32.1% | 27 / 63.0% / 23.2% | 64 / 43.8% / -16.0% |
| 1.0-2★ | — | 4 / 25.0% / -51.2% | — | 6 / 33.3% / -45.9% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 551 | 50.6% | -3.9% | -3.3% | 4.0 | -0.10% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 601 | 50.7% | -4.0% | -3.4% | 4.0 | -0.10% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 903 | 100% |
| LOCKED (direct) | 85 | 9.4% |
| Promoted (SHADOW→LOCKED) | 542 | 60.0% |
| Rejected (stayed SHADOW) | 172 | 19.0% |
| Superseded (side flipped) | 99 | 11.0% |
| Muted | 344 | 38.1% |
| Cancelled | 20 | 2.2% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=554)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -30.43u | -3.1% | — |
| Flat 1.0u | -20.36u | -3.7% | -10.07u |
| Lock units only | -18.94u | — | -11.49u |
| Units change only on star change | -14.54u | — | -15.89u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 184 | 2.81 | -11.9% | -8.2% | -20.26u | Sizing hurts |
| 4.5 | 57 | 2.53 | 19.0% | 14.5% | +10.08u | Sizing helps |
| 4 | 100 | 1.44 | -4.2% | 1.4% | +6.21u | Sizing helps |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 67 | 0.97 | -4.1% | -13.9% | -6.28u | Sizing hurts |
| 2.5 | 66 | 0.74 | -3.7% | -12.0% | -3.45u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 8 | 0.47 | -35.0% | -10.1% | +2.42u | Sizing helps |

### All Time (n=1116)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -75.31u | -4.1% | — |
| Flat 1.0u | -49.88u | -4.5% | -25.43u |
| Lock units only | -53.06u | — | -22.25u |
| Units change only on star change | -58.58u | — | -16.73u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 197 | 2.80 | -11.7% | -8.5% | -23.85u | Sizing hurts |
| 4.5 | 91 | 2.56 | 7.3% | 2.9% | +0.06u | Neutral |
| 4 | 215 | 1.80 | -3.7% | -1.8% | +0.97u | Sizing helps |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 227 | 1.13 | -10.3% | -11.6% | -6.42u | Sizing hurts |
| 2.5 | 173 | 0.74 | -1.8% | -3.1% | -0.73u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 8 | 0.47 | -35.0% | -10.1% | +2.42u | Sizing helps |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 554 | 53.2% | 50.7% | -2.4% | -3.7% | -0.09% | Below market |
| 4.5-5★ | 241 | 53.5% | 51.9% | -1.7% | -4.6% | -0.15% | Neutral |
| 3.5-4★ | 168 | 52.3% | 50.6% | -1.7% | -0.6% | -0.00% | Neutral |
| 2.5-3★ | 135 | 53.4% | 50.4% | -3.1% | -2.6% | -0.12% | Below market |
| CLEAR_MOVE only | 130 | 54.1% | 56.2% | +2.1% | 3.9% | 0.12% | Beating market |
| NO_MOVE only | 22 | 54.8% | 54.5% | -0.2% | -1.3% | 0.34% | Neutral |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=93)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 45.527 | 27.164 | 1.03 | ⚠️ |
| Rank_norm | 60.742 | 58.078 | 0.13 |  |
| PnL_norm | 53.268 | 54.211 | 0.06 |  |
| WalletBase | 49.201 | 37.548 | 0.85 |  |
| SizeRatio | 1.473 | 1.163 | 0.23 |  |
| ConvictionMult | 0.971 | 0.946 | 0.15 |  |
| WalletCountFor | 2.994 | 2.333 | 0.37 |  |
| TopShare | 0.582 | 0.703 | 0.50 |  |
| ForSide | 151.542 | 90.131 | 0.55 |  |
| AgainstSide | 48.915 | 31.461 | 0.22 |  |
| NetEdge | 1.100 | 0.634 | 0.55 |  |
| WalletPlayScore | 1.166 | -0.069 | 0.54 |  |

### V8 Era (n=484)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 45.527 | 44.701 | 0.05 |  |
| Rank_norm | 60.742 | 63.299 | 0.13 |  |
| PnL_norm | 53.268 | 54.023 | 0.04 |  |
| WalletBase | 49.201 | 48.782 | 0.03 |  |
| SizeRatio | 1.473 | 1.459 | 0.01 |  |
| ConvictionMult | 0.971 | 0.972 | 0.01 |  |
| WalletCountFor | 2.994 | 2.994 | 0.00 |  |
| TopShare | 0.582 | 0.582 | 0.00 |  |
| ForSide | 151.542 | 151.542 | 0.00 |  |
| AgainstSide | 48.915 | 48.915 | 0.00 |  |
| NetEdge | 1.100 | 1.100 | 0.00 |  |
| WalletPlayScore | 1.166 | 1.166 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=554)

- **Sizing issue**: Model P/L (-30.43u) trails flat (-20.36u) by 10.07u

### 7-Day (n=106)

No major failure modes detected.

### All Time (n=1116)

- **Sizing issue**: Model P/L (-75.31u) trails flat (-49.88u) by 25.43u
- **Environment issue**: 48.3% NO_MOVE (WR: 53.8%, ROI: -5.0%)


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
| V8 era picks | 554 |
| V8 flat ROI | -3.7% |
| V8 model ROI | -3.1% |
| V8 star monotonicity score | 0.14 |
| 4.5-5★ ROI | -4.6% |
| 2.5-3★ ROI | -2.6% |
| CLEAR_MOVE ROI | 3.9% |
| NO_MOVE ROI | -1.3% |
| Single-wallet play rate | 27.3% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: -0.01% | 4.5★: -0.56% | 4★: 0.04% | 3.5★: -0.07% | 3★: 0.12% | 2.5★: -0.35% | 2★: 0.67% | 1★: -0.01% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=554)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 468 | 84.5% | 49.8% | -4.6% | -6.3% | -0.10% |
| MUTED | 75 | 13.5% | 56.0% | 2.2% | 20.8% | -0.11% |
| CANCELLED | 11 | 2.0% | 54.5% | -2.8% | -10.4% | 0.16% |

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

### 7-Day (n=106)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 106 | 100.0% | 50.9% | -3.2% | 0.4% | -0.50% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| opp_side_stronger_diag | 2 | 50.0% |
| wps_flipped_diag | 1 | 100.0% |

### All Time (n=1116)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 1028 | 92.1% | 51.8% | -5.2% | -5.9% | -0.26% |
| MUTED | 75 | 6.7% | 56.0% | 2.2% | 20.8% | -0.11% |
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
