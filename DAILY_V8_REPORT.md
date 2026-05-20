# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-05-20 ET
**Completed Picks**: 859 | **V8 Era Picks**: 297 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (61.5%) beats 5★ (49.4%) |
| Model P/L vs flat P/L | ⚠️ | Model trails flat by 4.4u — sizing amplifying losses |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 27 | 44.4% | -3.75u | -13.9% | -9.00u | -14.6% | -0.40% | -0.53% | Cold streak |
| 7-Day | 57 | 49.1% | -2.36u | -4.1% | -8.33u | -6.0% | 0.03% | -0.73% |  |
| 14-Day | 106 | 53.8% | 1.78u | 1.7% | 0.83u | 0.4% | 0.06% | -0.57% |  |
| 30-Day | 277 | 49.1% | -14.46u | -5.2% | -23.49u | -5.1% | -0.08% | -0.39% |  |
| V8 Era | 297 | 49.5% | -12.99u | -4.4% | -17.34u | -3.5% | -0.05% | -0.42% |  |
| All Time | 859 | 52.2% | -42.50u | -4.9% | -62.22u | -4.6% | -0.30% | -0.10% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=297)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 85 | 53.9% | 53.9% | 49.4% | -4.5% | -10.5% | -7.8% | 2.82 | 0.18% | Weak |
| 4.5 | 26 | 51.5% | 51.5% | 61.5% | +10.1% | 22.8% | 17.7% | 2.69 | -0.71% | Strong |
| 4 | 48 | 53.1% | 53.1% | 50.0% | -3.1% | -5.3% | -3.6% | 1.40 | 0.24% | Weak |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 25 | 54.0% | 54.0% | 44.0% | -10.0% | -10.9% | -14.7% | 1.08 | 0.03% | Weak |
| 2.5 | 40 | 52.3% | 52.3% | 42.5% | -9.8% | -16.7% | -29.9% | 0.69 | -0.50% | Failing |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 1 | 47.4% | 47.4% | 0.0% | -47.4% | -100.0% | -100.0% | 0.50 | 3.10% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 49.4% | 61.5% | -12.1% | INVERTED |
| 4.5★ vs 4★ | 61.5% | 50.0% | +11.5% | Correct |
| 4★ vs 3.5★ | 50.0% | 51.5% | -1.5% | Flat |
| 3.5★ vs 3★ | 51.5% | 44.0% | +7.5% | Correct |
| 3★ vs 2.5★ | 44.0% | 42.5% | +1.5% | Correct |
| 2.5★ vs 2★ | 42.5% | 0.0% | +42.5% | Correct |
| 2★ vs 1★ | 0.0% | 0.0% | 0.0% | Flat |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.810 |
| Spearman: Stars vs Flat ROI | 0.810 |
| Spearman: Stars vs CLV | -0.476 |
| Brier Score | 0.2484 |
| Monotonicity Score | -0.29 |

### All Time (n=859)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 98 | 54.5% | 54.5% | 50.0% | -4.5% | -10.3% | -8.6% | 2.80 | 0.27% | Weak |
| 4.5 | 60 | 55.0% | 55.0% | 55.0% | +0.0% | 2.9% | -1.2% | 2.65 | 0.49% | Fair |
| 4 | 163 | 55.1% | 55.1% | 52.8% | -2.4% | -3.9% | -3.6% | 1.91 | -0.42% | Fair |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 185 | 55.0% | 55.0% | 48.1% | -6.9% | -12.7% | -11.3% | 1.19 | -0.52% | Weak |
| 2.5 | 147 | 53.9% | 53.9% | 51.7% | -2.2% | -5.1% | -6.0% | 0.72 | -0.72% | Weak |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 1 | 47.4% | 47.4% | 0.0% | -47.4% | -100.0% | -100.0% | 0.50 | 3.10% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 50.0% | 55.0% | -5.0% | INVERTED |
| 4.5★ vs 4★ | 55.0% | 52.8% | +2.2% | Correct |
| 4★ vs 3.5★ | 52.8% | 56.5% | -3.7% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 48.1% | +8.4% | Correct |
| 3★ vs 2.5★ | 48.1% | 51.7% | -3.6% | INVERTED |
| 2.5★ vs 2★ | 51.7% | 0.0% | +51.7% | Correct |
| 2★ vs 1★ | 0.0% | 0.0% | 0.0% | Flat |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.619 |
| Spearman: Stars vs Flat ROI | 0.667 |
| Spearman: Stars vs CLV | -0.214 |
| Brier Score | 0.2347 |
| Monotonicity Score | 0.00 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.030 | 0.014 | Monitor |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.082 | -0.071 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.098 | -0.091 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.092 | -0.054 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | 0.145 | 0.148 | Keep |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | 0.178 | 0.187 | Keep |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | 0.038 | 0.066 | Keep |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.005 | 0.042 | Monitor |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.034 | 0.086 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | 0.024 | 0.015 | Monitor |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.119 | 0.125 | Keep |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.050 | -0.024 | Monitor |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.073 | -0.004 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.006 | 0.037 | Monitor |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (21.47–46.88) | 48 | 41.7% | -20.7% | -9.4% | -0.21% |  |
| p20-40 (47.00–51.38) | 48 | 54.2% | 1.9% | 13.1% | -0.52% |  |
| p40-60 (51.40–55.42) | 48 | 54.2% | 15.2% | 4.3% | 0.72% |  |
| p60-80 (55.46–61.37) | 48 | 45.8% | -8.8% | -14.8% | 0.34% |  |
| p80-95 (61.38–65.33) | 48 | 54.2% | -2.8% | 7.0% | -0.22% |  |
| p95+ (65.37–83.30) | 49 | 44.9% | -13.3% | -23.3% | -0.44% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 91 | 42.9% | -18.9% | -6.6% | -0.14% |  |
| 0.90-1.05 | 101 | 41.6% | -20.8% | -25.6% | -0.11% |  |
| 1.05-1.20 | 66 | 69.7% | 40.0% | 44.3% | 0.24% |  |
| 1.20-1.35 | 18 | 50.0% | -4.2% | -36.5% | -0.05% |  |
| 1.35-1.50 | 9 | 44.4% | -10.6% | -49.9% | -0.34% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.72) | 43 | 41.9% | -18.4% | -16.5% | -0.33% |  |
| 20-40% (0.73–0.95) | 44 | 50.0% | -5.2% | 15.4% | -0.41% |  |
| 40-60% (0.96–1.23) | 44 | 63.6% | 30.7% | 9.3% | 0.37% |  |
| 60-80% (1.23–1.53) | 44 | 36.4% | -29.3% | -26.3% | 0.16% |  |
| 80-95% (1.53–2.06) | 44 | 43.2% | -18.3% | -6.4% | -0.24% |  |
| 95%+ (2.07–4.76) | 44 | 52.3% | -1.4% | -7.1% | 0.30% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 22 | 40.9% | -14.9% | -33.3% | 0.51% | Broad support |
| 0.25-0.40 | 80 | 50.0% | -1.6% | -4.9% | 0.21% | Healthy support |
| 0.40-0.60 | 90 | 46.7% | -8.3% | 8.0% | -0.11% | Concentrated |
| 0.60-0.80 | 47 | 53.2% | -2.2% | -4.8% | -0.16% | Very concentrated |
| 0.80-1.00 | 24 | 41.7% | -21.4% | -28.6% | -0.70% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 41 | 41.5% | -22.0% | -16.6% | -0.09% | 4.3 |
| Broad battle | 147 | 46.3% | -7.2% | -3.5% | 0.04% | 3.9 |
| One-wallet nuke | 58 | 53.4% | 0.1% | -1.1% | -0.42% | 3.7 |
| Thin support | 131 | 51.1% | -3.9% | -6.8% | -0.12% | 3.6 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=297)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 12 | 41.7% | -25.5% | 3.7% | 0.34% | 4.3 | 75.0% |
| SMALL_MOVE | 51 | 41.2% | -20.9% | -26.6% | 0.02% | 4.0 | 100.0% |
| CLEAR_MOVE | 84 | 59.5% | 8.8% | 15.1% | -0.13% | 4.1 | 100.0% |
| NEAR_START | 124 | 44.4% | -8.9% | -12.5% | -0.01% | 3.7 | 100.0% |

**All Time** (n=859)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 529 | 53.5% | -5.6% | -4.6% | -0.49% | 3.2 | 3.2% |
| SMALL_MOVE | 54 | 40.7% | -21.7% | -29.2% | 0.14% | 4.0 | 94.4% |
| CLEAR_MOVE | 110 | 58.2% | 6.8% | 11.8% | -0.19% | 4.0 | 100.0% |
| NEAR_START | 140 | 45.0% | -9.2% | -12.5% | 0.03% | 3.7 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 7 / 57.1% / 0.8% | 17 / 35.3% / -43.0% | 38 / 65.8% / 18.8% | 42 / 45.2% / -7.0% |
| 3.5-4★ | 3 / 0.0% / -100.0% | 28 / 42.9% / -15.1% | 29 / 48.3% / -12.8% | 40 / 60.0% / 25.2% |
| 2.5-3★ | 2 / 50.0% / -5.8% | 5 / 60.0% / 37.4% | 17 / 64.7% / 23.1% | 40 / 30.0% / -40.4% |
| 1.0-2★ | — | 1 / 0.0% / -100.0% | — | 2 / 0.0% / -100.0% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 294 | 49.3% | -4.7% | -4.0% | 3.9 | -0.05% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 344 | 49.7% | -4.9% | -4.1% | 3.9 | -0.06% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 499 | 100% |
| LOCKED (direct) | 66 | 13.2% |
| Promoted (SHADOW→LOCKED) | 250 | 50.1% |
| Rejected (stayed SHADOW) | 137 | 27.5% |
| Superseded (side flipped) | 41 | 8.2% |
| Muted | 228 | 45.7% |
| Cancelled | 20 | 4.0% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=297)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -17.34u | -3.5% | — |
| Flat 1.0u | -12.99u | -4.4% | -4.35u |
| Lock units only | -14.51u | — | -2.83u |
| Units change only on star change | -7.63u | — | -9.71u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 85 | 2.82 | -10.5% | -7.8% | -9.83u | Sizing hurts |
| 4.5 | 26 | 2.69 | 22.8% | 17.7% | +6.45u | Sizing helps |
| 4 | 48 | 1.40 | -5.3% | -3.6% | +0.16u | Neutral |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 25 | 1.08 | -10.9% | -14.7% | -1.25u | Sizing hurts |
| 2.5 | 40 | 0.69 | -16.7% | -29.9% | -1.59u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 1 | 0.50 | -100.0% | -100.0% | +0.50u | Neutral |

### All Time (n=859)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -62.22u | -4.6% | — |
| Flat 1.0u | -42.50u | -4.9% | -19.72u |
| Lock units only | -48.63u | — | -13.59u |
| Units change only on star change | -51.67u | — | -10.55u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 98 | 2.80 | -10.3% | -8.6% | -13.42u | Sizing hurts |
| 4.5 | 60 | 2.65 | 2.9% | -1.2% | -3.57u | Sizing hurts |
| 4 | 163 | 1.91 | -3.9% | -3.6% | -5.08u | Sizing hurts |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 185 | 1.19 | -12.7% | -11.3% | -1.40u | Sizing hurts |
| 2.5 | 147 | 0.72 | -5.1% | -6.0% | +1.12u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 1 | 0.50 | -100.0% | -100.0% | +0.50u | Neutral |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 297 | 52.7% | 49.5% | -3.2% | -4.4% | -0.05% | Below market |
| 4.5-5★ | 111 | 53.3% | 52.3% | -1.1% | -2.7% | -0.03% | Neutral |
| 3.5-4★ | 116 | 52.0% | 50.9% | -1.2% | 0.6% | 0.06% | Neutral |
| 2.5-3★ | 67 | 53.0% | 44.8% | -8.2% | -11.5% | -0.30% | Below market |
| CLEAR_MOVE only | 84 | 54.3% | 59.5% | +5.2% | 8.8% | -0.13% | Beating market |
| NO_MOVE only | 12 | 54.8% | 41.7% | -13.2% | -25.5% | 0.34% | Below market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=46)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 55.559 | 48.430 | 0.63 |  |
| Rank_norm | 64.520 | 70.302 | 0.32 |  |
| PnL_norm | 54.379 | 47.170 | 0.45 |  |
| WalletBase | 56.156 | 48.383 | 0.77 |  |
| SizeRatio | 1.667 | 1.452 | 0.14 |  |
| ConvictionMult | 0.992 | 1.000 | 0.05 |  |
| WalletCountFor | 3.441 | 3.696 | 0.14 |  |
| TopShare | 0.493 | 0.501 | 0.04 |  |
| ForSide | 192.162 | 182.589 | 0.09 |  |
| AgainstSide | 63.549 | 57.930 | 0.06 |  |
| NetEdge | 1.381 | 1.334 | 0.06 |  |
| WalletPlayScore | 2.001 | 2.004 | 0.00 |  |

### V8 Era (n=263)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 55.559 | 55.778 | 0.02 |  |
| Rank_norm | 64.520 | 65.739 | 0.07 |  |
| PnL_norm | 54.379 | 54.681 | 0.02 |  |
| WalletBase | 56.156 | 56.206 | 0.01 |  |
| SizeRatio | 1.667 | 1.599 | 0.05 |  |
| ConvictionMult | 0.992 | 0.986 | 0.03 |  |
| WalletCountFor | 3.441 | 3.441 | 0.00 |  |
| TopShare | 0.493 | 0.493 | 0.00 |  |
| ForSide | 192.162 | 192.162 | 0.00 |  |
| AgainstSide | 63.549 | 63.549 | 0.00 |  |
| NetEdge | 1.381 | 1.381 | 0.00 |  |
| WalletPlayScore | 2.001 | 2.001 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=297)

- **Sizing issue**: Model P/L (-17.34u) trails flat (-12.99u) by 4.35u
- **Gate issue**: NO_MOVE ROI (-25.5%) significantly trails CLEAR_MOVE (8.8%)

### 7-Day (n=57)

- **Sizing issue**: Model P/L (-8.33u) trails flat (-2.36u) by 5.97u
- **Concentration issue**: 12 high-concentration picks (TopShare>0.6) at -38.6% ROI

### All Time (n=859)

- **Sizing issue**: Model P/L (-62.22u) trails flat (-42.50u) by 19.72u
- **Environment issue**: 61.6% NO_MOVE (WR: 53.5%, ROI: -5.6%)


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
| V8 era picks | 297 |
| V8 flat ROI | -4.4% |
| V8 model ROI | -3.5% |
| V8 star monotonicity score | -0.29 |
| 4.5-5★ ROI | -2.7% |
| 2.5-3★ ROI | -11.5% |
| CLEAR_MOVE ROI | 8.8% |
| NO_MOVE ROI | -25.5% |
| Single-wallet play rate | 17.8% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: 0.18% | 4.5★: -0.71% | 4★: 0.24% | 3.5★: -0.07% | 3★: 0.03% | 2.5★: -0.50% | 2★: 0.67% | 1★: 3.10% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=297)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 219 | 73.7% | 47.9% | -5.0% | -9.0% | -0.05% |
| MUTED | 67 | 22.6% | 53.7% | -2.5% | 17.4% | -0.06% |
| CANCELLED | 11 | 3.7% | 54.5% | -2.8% | -10.4% | 0.16% |

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

### 7-Day (n=57)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 50 | 87.7% | 50.0% | -2.9% | -10.5% | -0.16% |
| MUTED | 7 | 12.3% | 42.9% | -12.7% | 19.0% | 1.41% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| ags_quality_veto | 5 | 60.0% |
| v73_hc_rescue | 3 | 100.0% |
| ags_hard_mute | 2 | 0.0% |
| wps_flipped_diag | 1 | 100.0% |

### All Time (n=859)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 779 | 90.7% | 51.9% | -5.5% | -6.5% | -0.31% |
| MUTED | 67 | 7.8% | 53.7% | -2.5% | 17.4% | -0.06% |
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
