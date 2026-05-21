# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-05-21 ET
**Completed Picks**: 869 | **V8 Era Picks**: 307 | **V8 Since**: 2026-04-18
**Universe**: All locked picks across ML, Spread, Total markets

## Executive Summary

- **Overall**: MONITORING
- **Ranking health**: DEGRADED
- **Sizing health**: MARGINAL
- **Environment health**: HEALTHY
- **Most important takeaway**: Star calibration is not monotonic — higher stars must beat lower stars before tuning anything else.

---

## 1. Intervention Triggers

| Trigger | Status | Detail |
|---|---|---|
| Star inversion | ⚠️ | 4.5★ WR (61.5%) beats 5★ (50.6%) |
| Model P/L vs flat P/L | ⚠️ | Model trails flat by 2.5u — sizing amplifying losses |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 28 | 46.4% | -4.01u | -14.3% | -6.28u | -9.8% | -0.18% | -0.52% |  |
| 7-Day | 58 | 46.6% | -6.43u | -11.1% | -21.35u | -17.0% | 0.16% | -0.66% |  |
| 14-Day | 112 | 53.6% | 0.91u | 0.8% | -0.27u | -0.1% | 0.09% | -0.57% |  |
| 30-Day | 271 | 49.4% | -13.33u | -4.9% | -17.65u | -3.8% | -0.02% | -0.41% |  |
| V8 Era | 307 | 49.8% | -12.23u | -4.0% | -14.71u | -2.9% | -0.03% | -0.42% |  |
| All Time | 869 | 52.2% | -41.75u | -4.8% | -59.59u | -4.3% | -0.29% | -0.10% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=307)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 89 | 54.0% | 54.0% | 50.6% | -3.4% | -8.6% | -5.9% | 2.83 | 0.21% | Weak |
| 4.5 | 26 | 51.5% | 51.5% | 61.5% | +10.1% | 22.8% | 17.7% | 2.69 | -0.71% | Strong |
| 4 | 51 | 53.1% | 53.1% | 49.0% | -4.1% | -7.7% | -5.2% | 1.44 | 0.32% | Weak |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 25 | 54.0% | 54.0% | 44.0% | -10.0% | -10.9% | -14.7% | 1.08 | 0.03% | Weak |
| 2.5 | 43 | 52.6% | 52.6% | 44.2% | -8.4% | -13.6% | -27.0% | 0.70 | -0.52% | Weak |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 1 | 47.4% | 47.4% | 0.0% | -47.4% | -100.0% | -100.0% | 0.50 | 3.10% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 50.6% | 61.5% | -10.9% | INVERTED |
| 4.5★ vs 4★ | 61.5% | 49.0% | +12.5% | Correct |
| 4★ vs 3.5★ | 49.0% | 51.5% | -2.5% | Flat |
| 3.5★ vs 3★ | 51.5% | 44.0% | +7.5% | Correct |
| 3★ vs 2.5★ | 44.0% | 44.2% | -0.2% | Flat |
| 2.5★ vs 2★ | 44.2% | 0.0% | +44.2% | Correct |
| 2★ vs 1★ | 0.0% | 0.0% | 0.0% | Flat |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.833 |
| Spearman: Stars vs Flat ROI | 0.810 |
| Spearman: Stars vs CLV | -0.476 |
| Brier Score | 0.2478 |
| Monotonicity Score | 0.00 |

### All Time (n=869)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 102 | 54.5% | 54.5% | 51.0% | -3.6% | -8.6% | -6.9% | 2.80 | 0.29% | Weak |
| 4.5 | 60 | 55.0% | 55.0% | 55.0% | +0.0% | 2.9% | -1.2% | 2.65 | 0.49% | Fair |
| 4 | 166 | 55.1% | 55.1% | 52.4% | -2.7% | -4.6% | -4.0% | 1.91 | -0.37% | Fair |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 185 | 55.0% | 55.0% | 48.1% | -6.9% | -12.7% | -11.3% | 1.19 | -0.52% | Weak |
| 2.5 | 150 | 53.9% | 53.9% | 52.0% | -1.9% | -4.4% | -5.6% | 0.72 | -0.73% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 1 | 47.4% | 47.4% | 0.0% | -47.4% | -100.0% | -100.0% | 0.50 | 3.10% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 51.0% | 55.0% | -4.0% | INVERTED |
| 4.5★ vs 4★ | 55.0% | 52.4% | +2.6% | Correct |
| 4★ vs 3.5★ | 52.4% | 56.5% | -4.1% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 48.1% | +8.4% | Correct |
| 3★ vs 2.5★ | 48.1% | 52.0% | -3.9% | INVERTED |
| 2.5★ vs 2★ | 52.0% | 0.0% | +52.0% | Correct |
| 2★ vs 1★ | 0.0% | 0.0% | 0.0% | Flat |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.619 |
| Spearman: Stars vs Flat ROI | 0.595 |
| Spearman: Stars vs CLV | -0.214 |
| Brier Score | 0.2347 |
| Monotonicity Score | 0.00 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.036 | 0.022 | Monitor |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.073 | -0.069 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.088 | -0.082 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.094 | -0.045 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | 0.144 | 0.143 | Keep |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | 0.171 | 0.177 | Keep |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | 0.035 | 0.068 | Keep |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.001 | 0.046 | Monitor |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.030 | 0.080 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | 0.026 | 0.022 | Monitor |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.124 | 0.129 | Keep |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.051 | -0.025 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.078 | -0.003 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.002 | 0.044 | Monitor |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (21.47–45.40) | 49 | 42.9% | -19.4% | -10.8% | -0.22% |  |
| p20-40 (45.99–50.85) | 50 | 52.0% | 1.0% | 11.7% | -0.37% |  |
| p40-60 (50.93–55.10) | 50 | 56.0% | 14.0% | 9.3% | 0.63% |  |
| p60-80 (55.30–61.30) | 50 | 46.0% | -8.6% | -13.4% | 0.36% |  |
| p80-95 (61.33–65.30) | 50 | 54.0% | -2.1% | 6.7% | -0.17% |  |
| p95+ (65.33–83.30) | 50 | 46.0% | -11.5% | -21.6% | -0.45% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 92 | 42.4% | -19.8% | -7.2% | -0.11% |  |
| 0.90-1.05 | 105 | 43.8% | -16.8% | -22.4% | -0.15% |  |
| 1.05-1.20 | 69 | 68.1% | 36.7% | 41.1% | 0.28% |  |
| 1.20-1.35 | 20 | 50.0% | -6.5% | -30.6% | 0.19% |  |
| 1.35-1.50 | 9 | 44.4% | -10.6% | -49.9% | -0.34% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.71) | 45 | 42.2% | -18.8% | -14.4% | -0.13% |  |
| 20-40% (0.72–0.93) | 45 | 48.9% | -7.5% | 14.1% | -0.50% |  |
| 40-60% (0.94–1.23) | 46 | 63.0% | 28.2% | 9.0% | 0.35% |  |
| 60-80% (1.23–1.52) | 45 | 37.8% | -26.4% | -25.5% | 0.16% |  |
| 80-95% (1.53–2.05) | 45 | 44.4% | -15.9% | -5.9% | -0.21% |  |
| 95%+ (2.06–4.76) | 46 | 52.2% | -1.4% | -4.9% | 0.31% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 22 | 40.9% | -14.9% | -33.3% | 0.51% | Broad support |
| 0.25-0.40 | 81 | 50.6% | -1.0% | -3.3% | 0.22% | Healthy support |
| 0.40-0.60 | 92 | 47.8% | -6.1% | 10.5% | -0.13% | Concentrated |
| 0.60-0.80 | 49 | 51.0% | -6.2% | -10.2% | -0.11% | Very concentrated |
| 0.80-1.00 | 28 | 42.9% | -20.6% | -25.0% | -0.48% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 41 | 41.5% | -22.0% | -16.6% | -0.09% | 4.3 |
| Broad battle | 151 | 46.4% | -7.4% | -3.4% | 0.05% | 3.9 |
| One-wallet nuke | 63 | 54.0% | 0.9% | -1.0% | -0.33% | 3.7 |
| Thin support | 137 | 51.1% | -4.1% | -7.1% | -0.10% | 3.6 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=307)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 13 | 46.2% | -20.1% | 10.2% | 0.43% | 4.3 | 76.9% |
| SMALL_MOVE | 53 | 41.5% | -20.8% | -24.6% | -0.07% | 3.9 | 100.0% |
| CLEAR_MOVE | 86 | 59.3% | 8.5% | 14.7% | -0.08% | 4.1 | 100.0% |
| NEAR_START | 128 | 44.5% | -8.9% | -12.6% | 0.03% | 3.7 | 100.0% |

**All Time** (n=869)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 530 | 53.6% | -5.5% | -4.3% | -0.48% | 3.3 | 3.4% |
| SMALL_MOVE | 56 | 41.1% | -21.5% | -27.2% | 0.05% | 4.0 | 94.6% |
| CLEAR_MOVE | 112 | 58.0% | 6.6% | 11.6% | -0.15% | 4.0 | 100.0% |
| NEAR_START | 144 | 45.1% | -9.3% | -12.5% | 0.07% | 3.7 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 8 / 62.5% / 6.3% | 17 / 35.3% / -43.0% | 40 / 65.0% / 17.7% | 43 / 46.5% / -4.8% |
| 3.5-4★ | 3 / 0.0% / -100.0% | 29 / 44.8% / -12.3% | 29 / 48.3% / -12.8% | 42 / 57.1% / 19.3% |
| 2.5-3★ | 2 / 50.0% / -5.8% | 6 / 50.0% / 14.5% | 17 / 64.7% / 23.1% | 41 / 31.7% / -37.7% |
| 1.0-2★ | — | 1 / 0.0% / -100.0% | — | 2 / 0.0% / -100.0% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 304 | 49.7% | -4.3% | -3.3% | 3.9 | -0.03% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 354 | 50.0% | -4.5% | -3.5% | 3.9 | -0.04% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 526 | 100% |
| LOCKED (direct) | 65 | 12.4% |
| Promoted (SHADOW→LOCKED) | 263 | 50.0% |
| Rejected (stayed SHADOW) | 150 | 28.5% |
| Superseded (side flipped) | 43 | 8.2% |
| Muted | 245 | 46.6% |
| Cancelled | 20 | 3.8% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=307)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -14.71u | -2.9% | — |
| Flat 1.0u | -12.23u | -4.0% | -2.48u |
| Lock units only | -14.66u | — | -0.05u |
| Units change only on star change | -5.66u | — | -9.05u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 89 | 2.83 | -8.6% | -5.9% | -7.28u | Sizing hurts |
| 4.5 | 26 | 2.69 | 22.8% | 17.7% | +6.45u | Sizing helps |
| 4 | 51 | 1.44 | -7.7% | -5.2% | +0.11u | Neutral |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 25 | 1.08 | -10.9% | -14.7% | -1.25u | Sizing hurts |
| 2.5 | 43 | 0.70 | -13.6% | -27.0% | -2.21u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 1 | 0.50 | -100.0% | -100.0% | +0.50u | Neutral |

### All Time (n=869)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -59.59u | -4.3% | — |
| Flat 1.0u | -41.75u | -4.8% | -17.84u |
| Lock units only | -48.77u | — | -10.82u |
| Units change only on star change | -49.70u | — | -9.89u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 102 | 2.80 | -8.6% | -6.9% | -10.87u | Sizing hurts |
| 4.5 | 60 | 2.65 | 2.9% | -1.2% | -3.57u | Sizing hurts |
| 4 | 166 | 1.91 | -4.6% | -4.0% | -5.13u | Sizing hurts |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 185 | 1.19 | -12.7% | -11.3% | -1.40u | Sizing hurts |
| 2.5 | 150 | 0.72 | -4.4% | -5.6% | +0.50u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 1 | 0.50 | -100.0% | -100.0% | +0.50u | Neutral |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 307 | 52.8% | 49.8% | -3.0% | -4.0% | -0.03% | Below market |
| 4.5-5★ | 115 | 53.4% | 53.0% | -0.3% | -1.5% | 0.00% | Neutral |
| 3.5-4★ | 119 | 52.1% | 50.4% | -1.6% | -0.6% | 0.10% | Neutral |
| 2.5-3★ | 70 | 53.1% | 45.7% | -7.4% | -9.8% | -0.33% | Below market |
| CLEAR_MOVE only | 86 | 54.2% | 59.3% | +5.1% | 8.5% | -0.08% | Beating market |
| NO_MOVE only | 13 | 55.9% | 46.2% | -9.8% | -20.1% | 0.43% | Below market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=48)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 55.092 | 46.716 | 0.73 |  |
| Rank_norm | 64.593 | 69.978 | 0.29 |  |
| PnL_norm | 54.346 | 48.267 | 0.38 |  |
| WalletBase | 55.791 | 47.497 | 0.81 |  |
| SizeRatio | 1.712 | 1.794 | 0.05 |  |
| ConvictionMult | 0.994 | 1.017 | 0.14 |  |
| WalletCountFor | 3.415 | 3.313 | 0.06 |  |
| TopShare | 0.499 | 0.555 | 0.27 |  |
| ForSide | 190.403 | 165.763 | 0.23 |  |
| AgainstSide | 62.869 | 54.419 | 0.10 |  |
| NetEdge | 1.370 | 1.195 | 0.21 |  |
| WalletPlayScore | 1.953 | 1.505 | 0.21 |  |

### V8 Era (n=272)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 55.092 | 55.218 | 0.01 |  |
| Rank_norm | 64.593 | 65.927 | 0.07 |  |
| PnL_norm | 54.346 | 54.621 | 0.02 |  |
| WalletBase | 55.791 | 55.781 | 0.00 |  |
| SizeRatio | 1.712 | 1.651 | 0.04 |  |
| ConvictionMult | 0.994 | 0.989 | 0.03 |  |
| WalletCountFor | 3.415 | 3.415 | 0.00 |  |
| TopShare | 0.499 | 0.499 | 0.00 |  |
| ForSide | 190.403 | 190.403 | 0.00 |  |
| AgainstSide | 62.869 | 62.869 | 0.00 |  |
| NetEdge | 1.370 | 1.370 | 0.00 |  |
| WalletPlayScore | 1.953 | 1.953 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=307)

- **Sizing issue**: Model P/L (-14.71u) trails flat (-12.23u) by 2.48u
- **Concentration issue**: 77 high-concentration picks (TopShare>0.6) at -11.4% ROI
- **Gate issue**: NO_MOVE ROI (-20.1%) significantly trails CLEAR_MOVE (8.5%)

### 7-Day (n=58)

- **Ranking issue**: ≤3★ WR (56%) beats ≥4★ (44%)
- **Sizing issue**: Model P/L (-21.35u) trails flat (-6.43u) by 14.92u
- **Concentration issue**: 18 high-concentration picks (TopShare>0.6) at -40.4% ROI

### All Time (n=869)

- **Sizing issue**: Model P/L (-59.59u) trails flat (-41.75u) by 17.84u
- **Environment issue**: 61.0% NO_MOVE (WR: 53.6%, ROI: -5.5%)
- **Concentration issue**: 77 high-concentration picks (TopShare>0.6) at -11.4% ROI


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
| V8 era picks | 307 |
| V8 flat ROI | -4.0% |
| V8 model ROI | -2.9% |
| V8 star monotonicity score | 0.00 |
| 4.5-5★ ROI | -1.5% |
| 2.5-3★ ROI | -9.8% |
| CLEAR_MOVE ROI | 8.5% |
| NO_MOVE ROI | -20.1% |
| Single-wallet play rate | 17.9% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: 0.21% | 4.5★: -0.71% | 4★: 0.32% | 3.5★: -0.07% | 3★: 0.03% | 2.5★: -0.52% | 2★: 0.67% | 1★: 3.10% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=307)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 229 | 74.6% | 48.5% | -4.5% | -7.9% | -0.02% |
| MUTED | 67 | 21.8% | 53.7% | -2.5% | 17.4% | -0.06% |
| CANCELLED | 11 | 3.6% | 54.5% | -2.8% | -10.4% | 0.16% |

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
| whitelist_fade_strong | 2 | 50.0% |
| ags_hard_mute | 2 | 0.0% |
| dw1_no_ags_support | 1 | 100.0% |

### 7-Day (n=58)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 54 | 93.1% | 50.0% | -4.5% | -11.0% | 0.00% |
| MUTED | 4 | 6.9% | 0.0% | -100.0% | -100.0% | 2.24% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| ags_quality_veto | 2 | 0.0% |
| ags_hard_mute | 2 | 0.0% |
| wps_flipped_diag | 1 | 100.0% |

### All Time (n=869)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 789 | 90.8% | 52.0% | -5.4% | -6.2% | -0.30% |
| MUTED | 67 | 7.7% | 53.7% | -2.5% | 17.4% | -0.06% |
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
| opposition_building | 2 | 100.0% |
| mid_tier_or_lower | 2 | 100.0% |
| whitelist_fade_strong | 2 | 50.0% |
| ags_hard_mute | 2 | 0.0% |
| dw1_no_ags_support | 1 | 100.0% |
