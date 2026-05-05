# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-05-05 ET
**Completed Picks**: 749 | **V8 Era Picks**: 187 | **V8 Since**: 2026-04-18
**Universe**: All locked picks across ML, Spread, Total markets

## Executive Summary

- **Overall**: MONITORING
- **Ranking health**: HEALTHY
- **Sizing health**: MARGINAL
- **Environment health**: HEALTHY
- **Most important takeaway**: Sizing is amplifying losses — consider flattening unit assignments until ranking layer stabilizes.

---

## 1. Intervention Triggers

**No intervention triggers fired.** System operating within parameters.


---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 17 | 47.1% | -1.93u | -11.3% | -3.22u | -12.9% | -1.51% | -0.20% |  |
| 7-Day | 57 | 45.6% | -6.11u | -10.7% | -5.38u | -7.0% | -0.54% | -0.31% |  |
| 14-Day | 151 | 46.4% | -13.75u | -9.1% | -16.80u | -8.1% | -0.08% | -0.36% |  |
| 30-Day | 515 | 48.9% | -48.07u | -9.3% | -75.53u | -10.5% | -0.28% | -0.07% |  |
| V8 Era | 187 | 47.6% | -12.66u | -6.8% | -13.86u | -5.6% | -0.07% | -0.39% |  |
| All Time | 749 | 52.1% | -42.17u | -5.6% | -58.74u | -5.3% | -0.35% | -0.07% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=187)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 50 | 53.4% | 53.4% | 52.0% | -1.4% | -4.9% | 0.7% | 2.31 | 0.10% | Fair |
| 4.5 | 9 | 49.5% | 49.5% | 55.6% | +6.1% | 23.7% | 13.0% | 2.06 | -0.68% | Strong |
| 4 | 26 | 52.7% | 52.7% | 50.0% | -2.7% | -2.9% | -10.3% | 1.24 | 0.23% | Fair |
| 3.5 | 48 | 50.8% | 50.8% | 47.9% | -2.9% | 0.2% | 1.3% | 0.71 | -0.21% | Fair |
| 3 | 21 | 55.6% | 55.6% | 38.1% | -17.6% | -26.4% | -28.3% | 1.05 | -0.02% | Failing |
| 2.5 | 29 | 53.3% | 53.3% | 41.4% | -11.9% | -20.4% | -34.8% | 0.73 | -0.22% | Failing |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 52.0% | 55.6% | -3.6% | INVERTED |
| 4.5★ vs 4★ | 55.6% | 50.0% | +5.6% | Correct |
| 4★ vs 3.5★ | 50.0% | 47.9% | +2.1% | Correct |
| 3.5★ vs 3★ | 47.9% | 38.1% | +9.8% | Correct |
| 3★ vs 2.5★ | 38.1% | 41.4% | -3.3% | INVERTED |
| 2.5★ vs 2★ | 41.4% | 0.0% | +41.4% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.929 |
| Spearman: Stars vs Flat ROI | 0.714 |
| Spearman: Stars vs CLV | -0.214 |
| Brier Score | 0.2541 |
| Monotonicity Score | -0.33 |

### All Time (n=749)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 63 | 54.5% | 54.5% | 52.4% | -2.1% | -5.7% | -2.6% | 2.38 | 0.25% | Weak |
| 4.5 | 43 | 56.0% | 56.0% | 51.2% | -4.8% | -4.8% | -11.0% | 2.49 | 1.03% | Fair |
| 4 | 141 | 55.4% | 55.4% | 53.2% | -2.2% | -3.2% | -4.4% | 1.96 | -0.53% | Fair |
| 3.5 | 166 | 55.1% | 55.1% | 56.0% | +1.0% | 0.4% | 2.6% | 1.46 | -0.32% | Fair |
| 3 | 181 | 55.2% | 55.2% | 47.5% | -7.7% | -14.5% | -12.6% | 1.19 | -0.54% | Weak |
| 2.5 | 136 | 54.2% | 54.2% | 52.2% | -2.0% | -4.9% | -5.5% | 0.73 | -0.68% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 52.4% | 51.2% | +1.2% | Correct |
| 4.5★ vs 4★ | 51.2% | 53.2% | -2.0% | Flat |
| 4★ vs 3.5★ | 53.2% | 56.0% | -2.8% | Flat |
| 3.5★ vs 3★ | 56.0% | 47.5% | +8.5% | Correct |
| 3★ vs 2.5★ | 47.5% | 52.2% | -4.7% | INVERTED |
| 2.5★ vs 2★ | 52.2% | 0.0% | +52.2% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.500 |
| Spearman: Stars vs Flat ROI | 0.429 |
| Spearman: Stars vs CLV | 0.357 |
| Brier Score | 0.2341 |
| Monotonicity Score | 0.00 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | 0.111 | 0.065 | Keep |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.092 | -0.080 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.013 | -0.033 | Monitor |
| WalletBase | Wallet quality | Composite skill score | Higher → better | 0.005 | -0.028 | Monitor |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | 0.140 | 0.156 | Keep |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | 0.198 | 0.212 | Keep |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | 0.135 | 0.129 | Keep |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.015 | 0.040 | Monitor |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.055 | 0.103 | Tune |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.013 | -0.015 | Monitor |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.067 | 0.094 | Keep |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.060 | -0.025 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.074 | -0.009 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.023 | 0.025 | Monitor |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (36.10–50.40) | 29 | 44.8% | -8.5% | -2.6% | -0.55% |  |
| p20-40 (50.53–54.60) | 30 | 56.7% | 20.6% | 15.4% | 0.47% |  |
| p40-60 (54.76–58.36) | 30 | 56.7% | 13.5% | 1.5% | 0.24% |  |
| p60-80 (58.48–63.25) | 30 | 40.0% | -19.7% | -9.8% | 0.54% |  |
| p80-95 (63.29–65.66) | 30 | 43.3% | -26.2% | -30.8% | -0.60% |  |
| p95+ (65.93–82.40) | 30 | 40.0% | -25.1% | -19.1% | -0.60% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 66 | 39.4% | -24.8% | -22.0% | -0.12% |  |
| 0.90-1.05 | 58 | 44.8% | -15.7% | -18.7% | -0.29% |  |
| 1.05-1.20 | 40 | 62.5% | 34.2% | 34.5% | 0.29% |  |
| 1.20-1.35 | 7 | 57.1% | 11.2% | -23.4% | -0.01% |  |
| 1.35-1.50 | 5 | 40.0% | -25.4% | -49.8% | 0.52% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.73) | 29 | 48.3% | -3.3% | 4.7% | -0.36% |  |
| 20-40% (0.73–0.93) | 30 | 50.0% | -3.7% | 14.1% | -0.81% |  |
| 40-60% (0.93–1.24) | 30 | 63.3% | 35.1% | -3.9% | 0.23% |  |
| 60-80% (1.24–1.53) | 30 | 30.0% | -44.2% | -38.5% | 0.07% |  |
| 80-95% (1.57–2.11) | 30 | 36.7% | -35.3% | -21.9% | -0.09% |  |
| 95%+ (2.13–4.76) | 30 | 53.3% | 6.4% | 2.1% | 0.53% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 14 | 35.7% | -20.2% | -26.7% | 0.45% | Broad support |
| 0.25-0.40 | 62 | 50.0% | 0.0% | -8.1% | 0.12% | Healthy support |
| 0.40-0.60 | 62 | 41.9% | -16.3% | 0.5% | 0.01% | Concentrated |
| 0.60-0.80 | 31 | 51.6% | -5.3% | -8.7% | -0.17% | Very concentrated |
| 0.80-1.00 | 10 | 60.0% | 11.0% | -7.8% | -2.19% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 28 | 35.7% | -32.3% | -28.0% | -0.23% | 4.0 |
| Broad battle | 110 | 47.3% | -4.1% | -0.7% | -0.05% | 3.8 |
| One-wallet nuke | 18 | 61.1% | 10.7% | 17.2% | -1.19% | 3.5 |
| Thin support | 72 | 51.4% | -3.6% | -3.2% | -0.30% | 3.5 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=187)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 9 | 44.4% | -13.8% | 5.1% | 0.41% | 4.3 | 66.7% |
| SMALL_MOVE | 30 | 33.3% | -37.2% | -43.6% | 0.18% | 3.9 | 100.0% |
| CLEAR_MOVE | 57 | 56.1% | 1.7% | 9.4% | -0.34% | 4.0 | 100.0% |
| NEAR_START | 91 | 47.3% | -1.3% | -5.3% | -0.03% | 3.6 | 100.0% |

**All Time** (n=749)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 526 | 53.6% | -5.3% | -4.6% | -0.49% | 3.2 | 2.7% |
| SMALL_MOVE | 33 | 33.3% | -37.0% | -45.1% | 0.36% | 4.0 | 90.9% |
| CLEAR_MOVE | 83 | 55.4% | 1.3% | 6.5% | -0.36% | 3.9 | 100.0% |
| NEAR_START | 107 | 47.7% | -2.9% | -6.7% | 0.03% | 3.6 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 6 / 50.0% / -2.1% | 9 / 33.3% / -48.7% | 23 / 60.9% / 8.5% | 21 / 52.4% / 10.7% |
| 3.5-4★ | 1 / 0.0% / -100.0% | 18 / 33.3% / -30.8% | 21 / 47.6% / -13.4% | 34 / 58.8% / 25.6% |
| 2.5-3★ | 2 / 50.0% / -5.8% | 2 / 50.0% / -11.5% | 13 / 61.5% / 13.9% | 35 / 34.3% / -31.9% |
| 1.0-2★ | — | 1 / 0.0% / -100.0% | — | 1 / 0.0% / -100.0% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 184 | 47.3% | -7.4% | -6.5% | 3.8 | -0.08% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 234 | 48.3% | -7.0% | -5.9% | 3.8 | -0.09% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 323 | 100% |
| LOCKED (direct) | 63 | 19.5% |
| Promoted (SHADOW→LOCKED) | 128 | 39.6% |
| Rejected (stayed SHADOW) | 101 | 31.3% |
| Superseded (side flipped) | 26 | 8.0% |
| Muted | 153 | 47.4% |
| Cancelled | 15 | 4.6% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=187)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -13.86u | -5.6% | — |
| Flat 1.0u | -12.66u | -6.8% | -1.20u |
| Lock units only | -8.11u | — | -5.75u |
| Units change only on star change | -6.76u | — | -7.10u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 50 | 2.31 | -4.9% | 0.7% | +3.29u | Sizing helps |
| 4.5 | 9 | 2.06 | 23.7% | 13.0% | +0.27u | Neutral |
| 4 | 26 | 1.24 | -2.9% | -10.3% | -2.58u | Sizing hurts |
| 3.5 | 48 | 0.71 | 0.2% | 1.3% | +0.33u | Neutral |
| 3 | 21 | 1.05 | -26.4% | -28.3% | -0.67u | Sizing hurts |
| 2.5 | 29 | 0.73 | -20.4% | -34.8% | -1.52u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |

### All Time (n=749)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -58.74u | -5.3% | — |
| Flat 1.0u | -42.17u | -5.6% | -16.57u |
| Lock units only | -42.22u | — | -16.52u |
| Units change only on star change | -50.80u | — | -7.94u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 63 | 2.38 | -5.7% | -2.6% | -0.30u | Neutral |
| 4.5 | 43 | 2.49 | -4.8% | -11.0% | -9.75u | Sizing hurts |
| 4 | 141 | 1.96 | -3.2% | -4.4% | -7.83u | Sizing hurts |
| 3.5 | 166 | 1.46 | 0.4% | 2.6% | +5.64u | Sizing helps |
| 3 | 181 | 1.19 | -14.5% | -12.6% | -0.82u | Sizing hurts |
| 2.5 | 136 | 0.73 | -4.9% | -5.5% | +1.19u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 187 | 52.7% | 47.6% | -5.1% | -6.8% | -0.07% | Below market |
| 4.5-5★ | 59 | 52.8% | 52.5% | -0.3% | -0.5% | -0.02% | Neutral |
| 3.5-4★ | 74 | 51.5% | 48.6% | -2.8% | -0.9% | -0.05% | Below market |
| 2.5-3★ | 52 | 54.3% | 42.3% | -11.9% | -18.7% | -0.15% | Below market |
| CLEAR_MOVE only | 57 | 54.0% | 56.1% | +2.1% | 1.7% | -0.34% | Beating market |
| NO_MOVE only | 9 | 52.7% | 44.4% | -8.3% | -13.8% | 0.41% | Below market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=57)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 58.265 | 62.088 | 0.37 |  |
| Rank_norm | 64.679 | 64.068 | 0.04 |  |
| PnL_norm | 56.902 | 55.028 | 0.13 |  |
| WalletBase | 58.531 | 60.452 | 0.23 |  |
| SizeRatio | 1.600 | 1.225 | 0.25 |  |
| ConvictionMult | 0.971 | 0.939 | 0.20 |  |
| WalletCountFor | 3.453 | 3.263 | 0.11 |  |
| TopShare | 0.469 | 0.498 | 0.16 |  |
| ForSide | 198.829 | 186.430 | 0.11 |  |
| AgainstSide | 66.950 | 66.216 | 0.01 |  |
| NetEdge | 1.419 | 1.301 | 0.13 |  |
| WalletPlayScore | 2.153 | 1.824 | 0.16 |  |

### V8 Era (n=179)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 58.265 | 58.265 | 0.00 |  |
| Rank_norm | 64.679 | 64.679 | 0.00 |  |
| PnL_norm | 56.902 | 56.902 | 0.00 |  |
| WalletBase | 58.531 | 58.531 | 0.00 |  |
| SizeRatio | 1.600 | 1.600 | 0.00 |  |
| ConvictionMult | 0.971 | 0.971 | 0.00 |  |
| WalletCountFor | 3.453 | 3.453 | 0.00 |  |
| TopShare | 0.469 | 0.469 | 0.00 |  |
| ForSide | 198.829 | 198.829 | 0.00 |  |
| AgainstSide | 66.950 | 66.950 | 0.00 |  |
| NetEdge | 1.419 | 1.419 | 0.00 |  |
| WalletPlayScore | 2.153 | 2.153 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=187)

- **Sizing issue**: Model P/L (-13.86u) trails flat (-12.66u) by 1.20u
- **Gate issue**: NO_MOVE ROI (-13.8%) significantly trails CLEAR_MOVE (1.7%)

### 7-Day (n=57)

- **Odds issue**: Avg CLV -0.54% — consistently getting bad closing lines

### All Time (n=749)

- **Sizing issue**: Model P/L (-58.74u) trails flat (-42.17u) by 16.57u
- **Environment issue**: 70.2% NO_MOVE (WR: 53.6%, ROI: -5.3%)


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
| V8 era picks | 187 |
| V8 flat ROI | -6.8% |
| V8 model ROI | -5.6% |
| V8 star monotonicity score | -0.33 |
| 4.5-5★ ROI | -0.5% |
| 2.5-3★ ROI | -18.7% |
| CLEAR_MOVE ROI | 1.7% |
| NO_MOVE ROI | -13.8% |
| Single-wallet play rate | 9.6% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: 0.10% | 4.5★: -0.68% | 4★: 0.23% | 3.5★: -0.21% | 3★: -0.02% | 2.5★: -0.22% | 2★: 0.67% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=187)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 135 | 72.2% | 45.9% | -8.1% | -9.4% | 0.06% |
| MUTED | 44 | 23.5% | 50.0% | -5.3% | 9.5% | -0.45% |
| CANCELLED | 8 | 4.3% | 62.5% | 8.4% | -7.4% | -0.17% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| winners_below_floor | 14 | 42.9% |
| v73_hc_rescue | 13 | 38.5% |
| wps_flipped_diag | 12 | 33.3% |
| winners_faded | 10 | 70.0% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 7 | 57.1% |
| opp_side_stronger_diag | 6 | 33.3% |
| winners_killed | 6 | 66.7% |
| whitelist_fade_weak | 3 | 66.7% |
| sum_below_floor | 3 | 33.3% |
| whitelist_fade_strong | 2 | 50.0% |

### 7-Day (n=57)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 42 | 73.7% | 45.2% | -11.6% | -8.2% | -0.28% |
| MUTED | 14 | 24.6% | 50.0% | -1.6% | 21.6% | -0.84% |
| CANCELLED | 1 | 1.8% | 0.0% | -100.0% | -100.0% | -7.24% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| v73_hc_rescue | 13 | 38.5% |
| winners_below_floor | 6 | 33.3% |
| wps_flipped_diag | 5 | 20.0% |
| opp_side_stronger_diag | 5 | 20.0% |
| quality_below_floor | 3 | 33.3% |
| winners_faded | 3 | 100.0% |
| sum_below_floor | 2 | 50.0% |
| winners_killed | 1 | 0.0% |

### All Time (n=749)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 695 | 92.8% | 51.9% | -6.2% | -6.2% | -0.32% |
| MUTED | 44 | 5.9% | 50.0% | -5.3% | 9.5% | -0.45% |
| CANCELLED | 10 | 1.3% | 70.0% | 32.9% | 10.4% | -1.54% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| winners_below_floor | 14 | 42.9% |
| v73_hc_rescue | 13 | 38.5% |
| wps_flipped_diag | 12 | 33.3% |
| winners_faded | 10 | 70.0% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 7 | 57.1% |
| opp_side_stronger_diag | 6 | 33.3% |
| winners_killed | 6 | 66.7% |
| whitelist_fade_weak | 3 | 66.7% |
| sum_below_floor | 3 | 33.3% |
| opposition_building | 2 | 100.0% |
| mid_tier_or_lower | 2 | 100.0% |
| whitelist_fade_strong | 2 | 50.0% |
