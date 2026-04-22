# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-04-22 ET
**Completed Picks**: 614 | **V8 Era Picks**: 52 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (57.1%) beats 5★ (50.0%) |
| Star inversion | ⚠️ | 3.5★ WR (37.5%) beats 4★ (25.0%) |
| Star inversion | ⚠️ | 2.5★ WR (56.3%) beats 3★ (38.5%) |
| Model P/L vs flat P/L | ⚠️ | Model trails flat by 3.6u — sizing amplifying losses |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 40 | 45.0% | 0.49u | 1.2% | -7.17u | -16.0% | 0.10% | -0.40% |  |
| 7-Day | 94 | 43.6% | -11.51u | -12.2% | -22.64u | -16.5% | 0.37% | -0.51% | Cold streak |
| 14-Day | 311 | 48.9% | -27.51u | -8.8% | -49.87u | -11.5% | -0.24% | -0.18% |  |
| 30-Day | 614 | 52.9% | -30.37u | -4.9% | -49.38u | -5.3% | -0.41% | -0.02% |  |
| V8 Era | 52 | 46.2% | -0.86u | -1.6% | -4.50u | -7.4% | 0.14% | -0.53% |  |
| All Time | 614 | 52.9% | -30.37u | -4.9% | -49.38u | -5.3% | -0.41% | -0.02% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=52)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 4 | 61.8% | 61.8% | 50.0% | -11.8% | -19.0% | -22.5% | 2.50 | 1.66% | Failing |
| 4.5 | 7 | 50.4% | 50.4% | 57.1% | +6.8% | 31.0% | 26.0% | 1.93 | -0.85% | Strong |
| 4 | 4 | 58.0% | 58.0% | 25.0% | -33.0% | -51.4% | -33.6% | 1.44 | 0.09% | Failing |
| 3.5 | 8 | 41.2% | 41.2% | 37.5% | -3.7% | 21.8% | -9.0% | 1.00 | 0.72% | Strong |
| 3 | 13 | 56.6% | 56.6% | 38.5% | -18.1% | -25.0% | -27.7% | 0.98 | 0.08% | Failing |
| 2.5 | 16 | 53.2% | 53.2% | 56.3% | +3.0% | 8.1% | 3.8% | 0.69 | -0.04% | Strong |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 50.0% | 57.1% | -7.1% | INVERTED |
| 4.5★ vs 4★ | 57.1% | 25.0% | +32.1% | Correct |
| 4★ vs 3.5★ | 25.0% | 37.5% | -12.5% | INVERTED |
| 3.5★ vs 3★ | 37.5% | 38.5% | -1.0% | Flat |
| 3★ vs 2.5★ | 38.5% | 56.3% | -17.8% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.086 |
| Spearman: Stars vs Flat ROI | 0.086 |
| Spearman: Stars vs CLV | 0.371 |
| Brier Score | 0.2781 |
| Monotonicity Score | 0.60 |

### All Time (n=614)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 17 | 59.4% | 59.4% | 52.9% | -6.4% | -11.2% | -15.7% | 2.62 | 1.08% | Weak |
| 4.5 | 41 | 56.4% | 56.4% | 51.2% | -5.2% | -5.0% | -10.5% | 2.49 | 1.10% | Weak |
| 4 | 119 | 56.0% | 56.0% | 52.9% | -3.1% | -4.9% | -4.4% | 2.10 | -0.71% | Fair |
| 3.5 | 126 | 55.8% | 55.8% | 57.9% | +2.1% | 1.8% | 2.4% | 1.71 | -0.30% | Fair |
| 3 | 173 | 55.3% | 55.3% | 48.0% | -7.3% | -13.9% | -11.9% | 1.19 | -0.57% | Weak |
| 2.5 | 123 | 54.3% | 54.3% | 55.3% | +1.0% | 0.4% | 2.7% | 0.73 | -0.72% | Fair |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 52.9% | 51.2% | +1.7% | Correct |
| 4.5★ vs 4★ | 51.2% | 52.9% | -1.7% | Flat |
| 4★ vs 3.5★ | 52.9% | 57.9% | -5.0% | INVERTED |
| 3.5★ vs 3★ | 57.9% | 48.0% | +9.9% | Correct |
| 3★ vs 2.5★ | 48.0% | 55.3% | -7.3% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | -0.257 |
| Spearman: Stars vs Flat ROI | -0.314 |
| Spearman: Stars vs CLV | 0.771 |
| Brier Score | 0.2318 |
| Monotonicity Score | 0.20 |

**⚠️ RANKING LAYER IS MISCALIBRATED** — higher stars are not producing better ROI


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | 0.207 | 0.235 | Keep |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | 0.250 | 0.188 | Keep |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | 0.108 | 0.113 | Keep |
| WalletBase | Wallet quality | Composite skill score | Higher → better | 0.260 | 0.262 | Keep |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | 0.079 | 0.136 | Keep |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | 0.116 | 0.187 | Keep |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | 0.219 | 0.305 | Keep |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.141 | 0.009 | Tune |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.070 | 0.053 | Tune |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.139 | -0.005 | Tune |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | -0.155 | -0.047 | Tune |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.151 | -0.020 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.105 | -0.054 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.140 | 0.022 | Tune |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (43.23–47.02) | 7 | 0.0% | -100.0% | -100.0% | 0.14% |  |
| p20-40 (47.73–50.40) | 8 | 62.5% | 42.8% | 52.0% | 0.32% |  |
| p40-60 (50.53–53.23) | 8 | 25.0% | -53.2% | -44.1% | 0.19% |  |
| p60-80 (53.53–54.87) | 8 | 62.5% | 71.0% | 13.2% | 0.30% |  |
| p80-95 (55.77–59.78) | 8 | 37.5% | -20.5% | -22.0% | 0.59% |  |
| p95+ (60.40–74.70) | 8 | 75.0% | 38.2% | 16.0% | -0.36% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 15 | 40.0% | -20.9% | -36.1% | -0.64% |  |
| 0.90-1.05 | 15 | 46.7% | -7.5% | -7.7% | 0.31% |  |
| 1.05-1.20 | 12 | 41.7% | 23.4% | -4.4% | 0.50% |  |
| 1.20-1.35 | 2 | 100.0% | 98.0% | 91.2% | 0.97% |  |
| 1.35-1.50 | 2 | 0.0% | -100.0% | -100.0% | 1.50% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.68) | 7 | 42.9% | -19.2% | -31.6% | 0.83% |  |
| 20-40% (0.73–0.98) | 8 | 75.0% | 35.7% | 23.8% | -1.19% |  |
| 40-60% (1.00–1.20) | 8 | 37.5% | 27.3% | -33.3% | 1.08% |  |
| 60-80% (1.21–1.38) | 8 | 37.5% | -23.6% | -24.1% | 0.34% |  |
| 80-95% (1.45–2.11) | 8 | 37.5% | -29.2% | -10.5% | -0.62% |  |
| 95%+ (2.13–4.76) | 8 | 37.5% | -2.5% | -4.3% | 0.80% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 5 | 40.0% | 17.2% | -7.1% | -0.55% | Broad support |
| 0.25-0.40 | 18 | 50.0% | 18.3% | 6.9% | 0.46% | Healthy support |
| 0.40-0.60 | 14 | 28.6% | -45.2% | -42.6% | 0.38% | Concentrated |
| 0.60-0.80 | 10 | 60.0% | 14.3% | -29.9% | -0.16% | Very concentrated |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 12 | 33.3% | -37.8% | -36.0% | 0.50% | 3.6 |
| Broad battle | 26 | 50.0% | 18.3% | 12.0% | 0.13% | 3.2 |
| One-wallet nuke | 5 | 60.0% | -2.3% | 24.8% | -0.30% | 4.5 |
| Thin support | 19 | 57.9% | 6.9% | -1.8% | 0.08% | 3.3 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=52)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 3 | 0.0% | -100.0% | -100.0% | 0.50% | 4.7 | 100.0% |
| SMALL_MOVE | 3 | 33.3% | -31.7% | -65.7% | 0.79% | 4.2 | 100.0% |
| CLEAR_MOVE | 13 | 61.5% | 9.6% | 27.6% | 0.54% | 3.3 | 100.0% |
| NEAR_START | 33 | 45.5% | 5.6% | -2.6% | -0.15% | 3.2 | 100.0% |

**All Time** (n=614)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 520 | 53.5% | -5.7% | -5.5% | -0.51% | 3.2 | 2.1% |
| SMALL_MOVE | 6 | 33.3% | -33.3% | -54.8% | 1.47% | 4.3 | 50.0% |
| CLEAR_MOVE | 39 | 56.4% | 3.5% | 8.1% | -0.09% | 3.7 | 100.0% |
| NEAR_START | 49 | 46.9% | -0.1% | -6.6% | 0.01% | 3.3 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 3 / 0.0% / -100.0% | 1 / 0.0% / -100.0% | 3 / 100.0% / 75.8% | 4 / 75.0% / 78.4% |
| 3.5-4★ | — | 2 / 50.0% / 2.5% | 2 / 0.0% / -100.0% | 8 / 37.5% / 20.5% |
| 2.5-3★ | — | — | 8 / 62.5% / 12.2% | 21 / 42.9% / -13.9% |
| 1.0-2★ | — | — | — | — |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 52 | 46.2% | -1.6% | -7.4% | 3.4 | 0.14% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 102 | 49.0% | -3.6% | -5.6% | 3.6 | 0.02% |
| SHADOW | 512 | 53.7% | -5.2% | -5.2% | 3.2 | -0.51% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 63 | 100% |
| LOCKED (direct) | 45 | 71.4% |
| Promoted (SHADOW→LOCKED) | 8 | 12.7% |
| Rejected (stayed SHADOW) | 9 | 14.3% |
| Superseded (side flipped) | 1 | 1.6% |
| Muted | 5 | 7.9% |
| Cancelled | 1 | 1.6% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=52)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -4.50u | -7.4% | — |
| Flat 1.0u | -0.86u | -1.6% | -3.64u |
| Lock units only | 0.81u | — | -5.31u |
| Units change only on star change | -4.49u | — | -0.01u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 4 | 2.50 | -19.0% | -22.5% | -1.49u | Sizing hurts |
| 4.5 | 7 | 1.93 | 31.0% | 26.0% | +1.34u | Sizing helps |
| 4 | 4 | 1.44 | -51.4% | -33.6% | +0.13u | Neutral |
| 3.5 | 8 | 1.00 | 21.8% | -9.0% | -2.46u | Sizing hurts |
| 3 | 13 | 0.98 | -25.0% | -27.7% | -0.28u | Neutral |
| 2.5 | 16 | 0.69 | 8.1% | 3.8% | -0.88u | Sizing hurts |

### All Time (n=614)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -49.38u | -5.3% | — |
| Flat 1.0u | -30.37u | -4.9% | -19.01u |
| Lock units only | -33.30u | — | -16.08u |
| Units change only on star change | -48.53u | — | -0.85u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 17 | 2.62 | -11.2% | -15.7% | -5.08u | Sizing hurts |
| 4.5 | 41 | 2.49 | -5.0% | -10.5% | -8.68u | Sizing hurts |
| 4 | 119 | 2.10 | -4.9% | -4.4% | -5.11u | Sizing hurts |
| 3.5 | 126 | 1.71 | 1.8% | 2.4% | +2.84u | Sizing helps |
| 3 | 173 | 1.19 | -13.9% | -11.9% | -0.42u | Neutral |
| 2.5 | 123 | 0.73 | 0.4% | 2.7% | +1.83u | Sizing helps |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 52 | 52.9% | 46.2% | -6.7% | -1.6% | 0.14% | Below market |
| 4.5-5★ | 11 | 54.5% | 54.5% | +0.0% | 12.8% | 0.07% | Neutral |
| 3.5-4★ | 12 | 46.8% | 33.3% | -13.5% | -2.6% | 0.49% | Below market |
| 2.5-3★ | 29 | 54.7% | 48.3% | -6.5% | -6.7% | 0.02% | Below market |
| CLEAR_MOVE only | 13 | 54.8% | 61.5% | +6.7% | 9.6% | 0.54% | Beating market |
| NO_MOVE only | 3 | 56.5% | 0.0% | -56.5% | -100.0% | 0.50% | Below market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=47)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 53.993 | 53.993 | 0.00 |  |
| Rank_norm | 61.136 | 61.136 | 0.00 |  |
| PnL_norm | 52.924 | 52.924 | 0.00 |  |
| WalletBase | 54.283 | 54.283 | 0.00 |  |
| SizeRatio | 1.971 | 1.971 | 0.00 |  |
| ConvictionMult | 0.981 | 0.981 | 0.00 |  |
| WalletCountFor | 3.702 | 3.702 | 0.00 |  |
| TopShare | 0.434 | 0.434 | 0.00 |  |
| ForSide | 201.643 | 201.643 | 0.00 |  |
| AgainstSide | 65.340 | 65.340 | 0.00 |  |
| NetEdge | 1.461 | 1.461 | 0.00 |  |
| WalletPlayScore | 2.428 | 2.428 | 0.00 |  |

### V8 Era (n=47)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 53.993 | 53.993 | 0.00 |  |
| Rank_norm | 61.136 | 61.136 | 0.00 |  |
| PnL_norm | 52.924 | 52.924 | 0.00 |  |
| WalletBase | 54.283 | 54.283 | 0.00 |  |
| SizeRatio | 1.971 | 1.971 | 0.00 |  |
| ConvictionMult | 0.981 | 0.981 | 0.00 |  |
| WalletCountFor | 3.702 | 3.702 | 0.00 |  |
| TopShare | 0.434 | 0.434 | 0.00 |  |
| ForSide | 201.643 | 201.643 | 0.00 |  |
| AgainstSide | 65.340 | 65.340 | 0.00 |  |
| NetEdge | 1.461 | 1.461 | 0.00 |  |
| WalletPlayScore | 2.428 | 2.428 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=52)

- **Sizing issue**: Model P/L (-4.50u) trails flat (-0.86u) by 3.64u
- **Gate issue**: NO_MOVE ROI (-100.0%) significantly trails CLEAR_MOVE (9.6%)

### 7-Day (n=94)

- **Sizing issue**: Model P/L (-22.64u) trails flat (-11.51u) by 11.13u
- **Gate issue**: NO_MOVE ROI (-41.6%) significantly trails CLEAR_MOVE (-0.3%)

### All Time (n=614)

- **Sizing issue**: Model P/L (-49.38u) trails flat (-30.37u) by 19.01u
- **Environment issue**: 84.7% NO_MOVE (WR: 53.5%, ROI: -5.7%)


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
| V8 era picks | 52 |
| V8 flat ROI | -1.6% |
| V8 model ROI | -7.4% |
| V8 star monotonicity score | 0.60 |
| 4.5-5★ ROI | 12.8% |
| 2.5-3★ ROI | -6.7% |
| CLEAR_MOVE ROI | 9.6% |
| NO_MOVE ROI | -100.0% |
| Single-wallet play rate | 9.6% |
| Whale override win rate | — |
| Avg CLV by star bucket | 5★: 1.66% | 4.5★: -0.85% | 4★: 0.09% | 3.5★: 0.72% | 3★: 0.08% | 2.5★: -0.04% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=52)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 50 | 96.2% | 46.0% | -0.1% | -6.0% | 0.17% |
| MUTED | 2 | 3.8% | 50.0% | -40.7% | -60.7% | -0.71% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| below_lock_range | 2 | 50.0% |

### 7-Day (n=94)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 92 | 97.9% | 43.5% | -11.6% | -16.0% | 0.40% |
| MUTED | 2 | 2.1% | 50.0% | -40.7% | -60.7% | -0.71% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| below_lock_range | 2 | 50.0% |

### All Time (n=614)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 610 | 99.3% | 52.8% | -5.3% | -5.5% | -0.38% |
| MUTED | 2 | 0.3% | 50.0% | -40.7% | -60.7% | -0.71% |
| CANCELLED | 2 | 0.3% | 100.0% | 131.0% | 131.0% | -7.02% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| opposition_building | 2 | 100.0% |
| mid_tier_or_lower | 2 | 100.0% |
| below_lock_range | 2 | 50.0% |
