# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-05-22 ET
**Completed Picks**: 881 | **V8 Era Picks**: 319 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (63.0%) beats 5★ (49.5%) |
| Model P/L vs flat P/L | ⚠️ | Model trails flat by 6.9u — sizing amplifying losses |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 30 | 50.0% | -2.64u | -8.8% | -8.63u | -14.8% | 0.04% | -0.49% |  |
| 7-Day | 63 | 50.8% | -1.96u | -3.1% | -10.38u | -8.3% | 0.12% | -0.56% |  |
| 14-Day | 122 | 52.5% | -1.58u | -1.3% | -9.25u | -3.5% | 0.14% | -0.57% |  |
| 30-Day | 267 | 50.6% | -12.03u | -4.5% | -15.27u | -3.3% | -0.04% | -0.40% |  |
| V8 Era | 319 | 49.8% | -12.88u | -4.0% | -19.77u | -3.7% | -0.01% | -0.43% |  |
| All Time | 881 | 52.2% | -42.40u | -4.8% | -64.65u | -4.6% | -0.28% | -0.11% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=319)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 91 | 53.8% | 53.8% | 49.5% | -4.4% | -10.6% | -7.9% | 2.83 | 0.19% | Weak |
| 4.5 | 27 | 51.5% | 51.5% | 63.0% | +11.5% | 25.3% | 20.4% | 2.70 | -0.67% | Strong |
| 4 | 53 | 53.6% | 53.6% | 49.1% | -4.5% | -8.2% | -7.2% | 1.47 | 0.36% | Weak |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 31 | 53.4% | 53.4% | 45.2% | -8.2% | -9.0% | -13.7% | 1.06 | 0.10% | Weak |
| 2.5 | 44 | 52.6% | 52.6% | 45.5% | -7.1% | -11.3% | -25.9% | 0.69 | -0.50% | Weak |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 1 | 47.4% | 47.4% | 0.0% | -47.4% | -100.0% | -100.0% | 0.50 | 3.10% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 49.5% | 63.0% | -13.5% | INVERTED |
| 4.5★ vs 4★ | 63.0% | 49.1% | +13.9% | Correct |
| 4★ vs 3.5★ | 49.1% | 51.5% | -2.4% | Flat |
| 3.5★ vs 3★ | 51.5% | 45.2% | +6.3% | Correct |
| 3★ vs 2.5★ | 45.2% | 45.5% | -0.3% | Flat |
| 2.5★ vs 2★ | 45.5% | 0.0% | +45.5% | Correct |
| 2★ vs 1★ | 0.0% | 0.0% | 0.0% | Flat |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.833 |
| Spearman: Stars vs Flat ROI | 0.714 |
| Spearman: Stars vs CLV | -0.476 |
| Brier Score | 0.2479 |
| Monotonicity Score | 0.00 |

### All Time (n=881)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 104 | 54.4% | 54.4% | 50.0% | -4.4% | -10.4% | -8.6% | 2.80 | 0.28% | Weak |
| 4.5 | 61 | 55.0% | 55.0% | 55.7% | +0.8% | 4.3% | 0.4% | 2.65 | 0.49% | Fair |
| 4 | 168 | 55.2% | 55.2% | 52.4% | -2.8% | -4.8% | -4.5% | 1.92 | -0.35% | Fair |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 191 | 54.9% | 54.9% | 48.2% | -6.7% | -12.3% | -11.3% | 1.18 | -0.48% | Weak |
| 2.5 | 151 | 53.9% | 53.9% | 52.3% | -1.6% | -3.8% | -5.4% | 0.72 | -0.72% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 1 | 47.4% | 47.4% | 0.0% | -47.4% | -100.0% | -100.0% | 0.50 | 3.10% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 50.0% | 55.7% | -5.7% | INVERTED |
| 4.5★ vs 4★ | 55.7% | 52.4% | +3.3% | Correct |
| 4★ vs 3.5★ | 52.4% | 56.5% | -4.1% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 48.2% | +8.3% | Correct |
| 3★ vs 2.5★ | 48.2% | 52.3% | -4.1% | INVERTED |
| 2.5★ vs 2★ | 52.3% | 0.0% | +52.3% | Correct |
| 2★ vs 1★ | 0.0% | 0.0% | 0.0% | Flat |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.619 |
| Spearman: Stars vs Flat ROI | 0.595 |
| Spearman: Stars vs CLV | -0.214 |
| Brier Score | 0.2349 |
| Monotonicity Score | 0.00 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.047 | 0.015 | Monitor |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.103 | -0.082 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.108 | -0.085 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.111 | -0.053 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | 0.128 | 0.131 | Keep |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | 0.158 | 0.166 | Keep |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | 0.011 | 0.051 | Monitor |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.010 | 0.043 | Monitor |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.032 | 0.084 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | 0.016 | 0.020 | Monitor |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.108 | 0.121 | Keep |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.063 | -0.018 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.088 | 0.001 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.013 | 0.040 | Monitor |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (21.47–45.17) | 51 | 45.1% | -15.4% | -11.5% | 0.25% |  |
| p20-40 (45.30–50.70) | 52 | 51.9% | 0.0% | 11.3% | -0.75% |  |
| p40-60 (50.80–54.97) | 52 | 53.8% | 9.9% | 4.4% | 0.64% |  |
| p60-80 (55.10–61.05) | 52 | 48.1% | -3.9% | -10.7% | 0.28% |  |
| p80-95 (61.12–65.30) | 52 | 53.8% | -2.4% | 6.1% | -0.09% |  |
| p95+ (65.33–83.30) | 52 | 44.2% | -14.9% | -23.7% | -0.45% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 96 | 42.7% | -19.4% | -9.6% | -0.13% |  |
| 0.90-1.05 | 108 | 44.4% | -15.1% | -21.3% | -0.09% |  |
| 1.05-1.20 | 72 | 66.7% | 33.7% | 36.5% | 0.26% |  |
| 1.20-1.35 | 22 | 50.0% | -7.8% | -29.1% | 0.26% |  |
| 1.35-1.50 | 9 | 44.4% | -10.6% | -49.9% | -0.34% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.68) | 47 | 44.7% | -14.6% | -12.1% | 0.04% |  |
| 20-40% (0.70–0.93) | 47 | 46.8% | -11.5% | 6.9% | -0.48% |  |
| 40-60% (0.93–1.23) | 47 | 61.7% | 25.5% | 8.0% | 0.33% |  |
| 60-80% (1.23–1.52) | 47 | 38.3% | -25.5% | -22.4% | 0.17% |  |
| 80-95% (1.53–2.05) | 47 | 44.7% | -14.6% | -6.6% | -0.19% |  |
| 95%+ (2.06–4.76) | 47 | 51.1% | -3.5% | -7.6% | 0.29% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 22 | 40.9% | -14.9% | -33.3% | 0.51% | Broad support |
| 0.25-0.40 | 82 | 50.0% | -2.2% | -5.2% | 0.21% | Healthy support |
| 0.40-0.60 | 96 | 46.9% | -7.7% | 6.9% | -0.09% | Concentrated |
| 0.60-0.80 | 50 | 52.0% | -4.2% | -6.1% | -0.10% | Very concentrated |
| 0.80-1.00 | 32 | 43.8% | -19.2% | -23.3% | -0.25% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 43 | 39.5% | -25.6% | -21.2% | -0.06% | 4.3 |
| Broad battle | 154 | 46.1% | -7.7% | -4.4% | 0.05% | 3.9 |
| One-wallet nuke | 69 | 55.1% | 2.5% | -0.5% | -0.26% | 3.6 |
| Thin support | 144 | 52.1% | -2.4% | -5.3% | -0.08% | 3.6 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=319)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 13 | 46.2% | -20.1% | 10.2% | 0.43% | 4.3 | 76.9% |
| SMALL_MOVE | 57 | 40.4% | -23.0% | -25.1% | -0.05% | 3.9 | 100.0% |
| CLEAR_MOVE | 90 | 60.0% | 10.2% | 15.4% | 0.01% | 4.0 | 100.0% |
| NEAR_START | 130 | 43.8% | -10.3% | -14.9% | 0.02% | 3.8 | 100.0% |

**All Time** (n=881)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 530 | 53.6% | -5.5% | -4.3% | -0.48% | 3.3 | 3.4% |
| SMALL_MOVE | 60 | 40.0% | -23.6% | -27.5% | 0.06% | 3.9 | 95.0% |
| CLEAR_MOVE | 116 | 58.6% | 8.1% | 12.3% | -0.08% | 4.0 | 100.0% |
| NEAR_START | 146 | 44.5% | -10.5% | -14.6% | 0.06% | 3.7 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 8 / 62.5% / 6.3% | 18 / 38.9% / -35.5% | 40 / 65.0% / 17.7% | 45 / 44.4% / -9.0% |
| 3.5-4★ | 3 / 0.0% / -100.0% | 30 / 43.3% / -15.2% | 30 / 50.0% / -10.4% | 42 / 57.1% / 19.3% |
| 2.5-3★ | 2 / 50.0% / -5.8% | 8 / 37.5% / -14.1% | 20 / 65.0% / 26.3% | 41 / 31.7% / -37.7% |
| 1.0-2★ | — | 1 / 0.0% / -100.0% | — | 2 / 0.0% / -100.0% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 316 | 49.7% | -4.4% | -4.1% | 3.9 | -0.02% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 366 | 50.0% | -4.5% | -4.2% | 3.9 | -0.03% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 550 | 100% |
| LOCKED (direct) | 69 | 12.5% |
| Promoted (SHADOW→LOCKED) | 280 | 50.9% |
| Rejected (stayed SHADOW) | 148 | 26.9% |
| Superseded (side flipped) | 48 | 8.7% |
| Muted | 249 | 45.3% |
| Cancelled | 20 | 3.6% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=319)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -19.77u | -3.7% | — |
| Flat 1.0u | -12.88u | -4.0% | -6.89u |
| Lock units only | -18.06u | — | -1.71u |
| Units change only on star change | -10.56u | — | -9.21u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 91 | 2.83 | -10.6% | -7.9% | -10.78u | Sizing hurts |
| 4.5 | 27 | 2.70 | 25.3% | 20.4% | +8.04u | Sizing helps |
| 4 | 53 | 1.47 | -8.2% | -7.2% | -1.24u | Sizing hurts |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 31 | 1.06 | -9.0% | -13.7% | -1.75u | Sizing hurts |
| 2.5 | 44 | 0.69 | -11.3% | -25.9% | -2.85u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 1 | 0.50 | -100.0% | -100.0% | +0.50u | Neutral |

### All Time (n=881)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -64.65u | -4.6% | — |
| Flat 1.0u | -42.40u | -4.8% | -22.25u |
| Lock units only | -52.18u | — | -12.47u |
| Units change only on star change | -54.60u | — | -10.05u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 104 | 2.80 | -10.4% | -8.6% | -14.37u | Sizing hurts |
| 4.5 | 61 | 2.65 | 4.3% | 0.4% | -1.98u | Sizing hurts |
| 4 | 168 | 1.92 | -4.8% | -4.5% | -6.48u | Sizing hurts |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 191 | 1.18 | -12.3% | -11.3% | -1.90u | Sizing hurts |
| 2.5 | 151 | 0.72 | -3.8% | -5.4% | -0.14u | Neutral |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 1 | 0.50 | -100.0% | -100.0% | +0.50u | Neutral |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 319 | 52.8% | 49.8% | -3.0% | -4.0% | -0.01% | Below market |
| 4.5-5★ | 118 | 53.3% | 52.5% | -0.8% | -2.4% | -0.00% | Neutral |
| 3.5-4★ | 121 | 52.3% | 50.4% | -1.9% | -0.9% | 0.12% | Neutral |
| 2.5-3★ | 77 | 52.9% | 46.8% | -6.2% | -7.8% | -0.26% | Below market |
| CLEAR_MOVE only | 90 | 54.1% | 60.0% | +5.9% | 10.2% | 0.01% | Beating market |
| NO_MOVE only | 13 | 55.9% | 46.2% | -9.8% | -20.1% | 0.43% | Below market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=53)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 54.933 | 48.567 | 0.55 |  |
| Rank_norm | 64.382 | 70.783 | 0.33 |  |
| PnL_norm | 54.016 | 48.965 | 0.30 |  |
| WalletBase | 55.594 | 48.979 | 0.64 |  |
| SizeRatio | 1.697 | 1.760 | 0.04 |  |
| ConvictionMult | 0.993 | 1.015 | 0.13 |  |
| WalletCountFor | 3.387 | 3.208 | 0.10 |  |
| TopShare | 0.506 | 0.579 | 0.34 |  |
| ForSide | 188.611 | 164.806 | 0.22 |  |
| AgainstSide | 61.434 | 51.766 | 0.11 |  |
| NetEdge | 1.364 | 1.208 | 0.19 |  |
| WalletPlayScore | 1.906 | 1.357 | 0.26 |  |

### V8 Era (n=282)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 54.933 | 55.151 | 0.02 |  |
| Rank_norm | 64.382 | 66.020 | 0.08 |  |
| PnL_norm | 54.016 | 54.444 | 0.03 |  |
| WalletBase | 55.594 | 55.660 | 0.01 |  |
| SizeRatio | 1.697 | 1.646 | 0.03 |  |
| ConvictionMult | 0.993 | 0.990 | 0.02 |  |
| WalletCountFor | 3.387 | 3.387 | 0.00 |  |
| TopShare | 0.506 | 0.506 | 0.00 |  |
| ForSide | 188.611 | 188.611 | 0.00 |  |
| AgainstSide | 61.434 | 61.434 | 0.00 |  |
| NetEdge | 1.364 | 1.364 | 0.00 |  |
| WalletPlayScore | 1.906 | 1.906 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=319)

- **Sizing issue**: Model P/L (-19.77u) trails flat (-12.88u) by 6.89u
- **Concentration issue**: 82 high-concentration picks (TopShare>0.6) at -10.1% ROI
- **Gate issue**: NO_MOVE ROI (-20.1%) significantly trails CLEAR_MOVE (10.2%)

### 7-Day (n=63)

- **Ranking issue**: ≤3★ WR (56%) beats ≥4★ (47%)
- **Sizing issue**: Model P/L (-10.38u) trails flat (-1.96u) by 8.42u
- **Concentration issue**: 22 high-concentration picks (TopShare>0.6) at -26.1% ROI

### All Time (n=881)

- **Sizing issue**: Model P/L (-64.65u) trails flat (-42.40u) by 22.25u
- **Environment issue**: 60.2% NO_MOVE (WR: 53.6%, ROI: -5.5%)
- **Concentration issue**: 82 high-concentration picks (TopShare>0.6) at -10.1% ROI


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
| V8 era picks | 319 |
| V8 flat ROI | -4.0% |
| V8 model ROI | -3.7% |
| V8 star monotonicity score | 0.00 |
| 4.5-5★ ROI | -2.4% |
| 2.5-3★ ROI | -7.8% |
| CLEAR_MOVE ROI | 10.2% |
| NO_MOVE ROI | -20.1% |
| Single-wallet play rate | 19.1% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: 0.19% | 4.5★: -0.67% | 4★: 0.36% | 3.5★: -0.07% | 3★: 0.10% | 2.5★: -0.50% | 2★: 0.67% | 1★: 3.10% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=319)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 240 | 75.2% | 48.3% | -4.8% | -8.9% | 0.01% |
| MUTED | 68 | 21.3% | 54.4% | -1.5% | 17.7% | -0.12% |
| CANCELLED | 11 | 3.4% | 54.5% | -2.8% | -10.4% | 0.16% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| v73_hc_rescue | 21 | 52.4% |
| ags_quality_veto | 18 | 66.7% |
| winners_below_floor | 14 | 42.9% |
| wps_flipped_diag | 14 | 35.7% |
| winners_faded | 12 | 66.7% |
| opp_side_stronger_diag | 10 | 50.0% |
| winners_killed | 9 | 55.6% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 7 | 57.1% |
| whitelist_fade_weak | 3 | 66.7% |
| sum_below_floor | 3 | 33.3% |
| ags_hard_mute | 3 | 33.3% |
| whitelist_fade_strong | 2 | 50.0% |
| dw1_no_ags_support | 1 | 100.0% |

### 7-Day (n=63)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 60 | 95.2% | 51.7% | -1.0% | -8.4% | 0.17% |
| MUTED | 3 | 4.8% | 33.3% | -45.8% | -2.4% | -0.93% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| ags_hard_mute | 3 | 33.3% |

### All Time (n=881)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 800 | 90.8% | 51.9% | -5.5% | -6.6% | -0.28% |
| MUTED | 68 | 7.7% | 54.4% | -1.5% | 17.7% | -0.12% |
| CANCELLED | 13 | 1.5% | 61.5% | 17.8% | 4.8% | -0.95% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| v73_hc_rescue | 21 | 52.4% |
| ags_quality_veto | 18 | 66.7% |
| winners_below_floor | 14 | 42.9% |
| wps_flipped_diag | 14 | 35.7% |
| winners_faded | 12 | 66.7% |
| opp_side_stronger_diag | 10 | 50.0% |
| winners_killed | 9 | 55.6% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 7 | 57.1% |
| whitelist_fade_weak | 3 | 66.7% |
| sum_below_floor | 3 | 33.3% |
| ags_hard_mute | 3 | 33.3% |
| opposition_building | 2 | 100.0% |
| mid_tier_or_lower | 2 | 100.0% |
| whitelist_fade_strong | 2 | 50.0% |
| dw1_no_ags_support | 1 | 100.0% |
