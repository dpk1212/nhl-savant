# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-05-04 ET
**Completed Picks**: 741 | **V8 Era Picks**: 179 | **V8 Since**: 2026-04-18
**Universe**: All locked picks across ML, Spread, Total markets

## Executive Summary

- **Overall**: MONITORING
- **Ranking health**: HEALTHY
- **Sizing health**: MARGINAL
- **Environment health**: HEALTHY
- **Most important takeaway**: Sizing is amplifying losses — consider flattening unit assignments until ranking layer stabilizes.

---

## 1. Intervention Triggers

| Trigger | Status | Detail |
|---|---|---|
| Model P/L vs flat P/L | ⚠️ | Model trails flat by 2.7u — sizing amplifying losses |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 19 | 47.4% | -1.77u | -9.3% | -7.21u | -44.7% | -0.23% | -0.30% |  |
| 7-Day | 64 | 50.0% | -2.31u | -3.6% | -0.25u | -0.3% | -0.23% | -0.33% |  |
| 14-Day | 159 | 47.2% | -11.67u | -7.3% | -19.00u | -9.3% | 0.02% | -0.35% |  |
| 30-Day | 536 | 50.2% | -39.26u | -7.3% | -59.43u | -7.8% | -0.26% | -0.05% |  |
| V8 Era | 179 | 48.0% | -10.19u | -5.7% | -12.85u | -5.6% | 0.06% | -0.38% |  |
| All Time | 741 | 52.2% | -39.71u | -5.4% | -57.73u | -5.2% | -0.31% | -0.07% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=179)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 45 | 53.4% | 53.4% | 53.3% | -0.1% | -3.1% | 0.3% | 2.28 | 0.24% | Fair |
| 4.5 | 9 | 49.5% | 49.5% | 55.6% | +6.1% | 23.7% | 13.0% | 2.06 | -0.68% | Strong |
| 4 | 25 | 52.7% | 52.7% | 52.0% | -0.7% | 1.0% | -7.1% | 1.25 | 0.24% | Fair |
| 3.5 | 46 | 50.3% | 50.3% | 47.8% | -2.4% | 1.1% | 2.8% | 0.69 | 0.17% | Fair |
| 3 | 21 | 55.6% | 55.6% | 38.1% | -17.6% | -26.4% | -28.3% | 1.05 | -0.02% | Failing |
| 2.5 | 29 | 53.3% | 53.3% | 41.4% | -11.9% | -20.4% | -34.8% | 0.73 | -0.22% | Failing |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 53.3% | 55.6% | -2.3% | Flat |
| 4.5★ vs 4★ | 55.6% | 52.0% | +3.6% | Correct |
| 4★ vs 3.5★ | 52.0% | 47.8% | +4.2% | Correct |
| 3.5★ vs 3★ | 47.8% | 38.1% | +9.7% | Correct |
| 3★ vs 2.5★ | 38.1% | 41.4% | -3.3% | INVERTED |
| 2.5★ vs 2★ | 41.4% | 0.0% | +41.4% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.929 |
| Spearman: Stars vs Flat ROI | 0.714 |
| Spearman: Stars vs CLV | -0.179 |
| Brier Score | 0.2520 |
| Monotonicity Score | -0.33 |

### All Time (n=741)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 58 | 54.6% | 54.6% | 53.4% | -1.1% | -4.3% | -3.2% | 2.36 | 0.38% | Fair |
| 4.5 | 43 | 56.0% | 56.0% | 51.2% | -4.8% | -4.8% | -11.0% | 2.49 | 1.03% | Fair |
| 4 | 140 | 55.4% | 55.4% | 53.6% | -1.8% | -2.5% | -4.1% | 1.97 | -0.54% | Fair |
| 3.5 | 164 | 55.0% | 55.0% | 56.1% | +1.1% | 0.6% | 2.8% | 1.46 | -0.20% | Fair |
| 3 | 181 | 55.2% | 55.2% | 47.5% | -7.7% | -14.5% | -12.6% | 1.19 | -0.54% | Weak |
| 2.5 | 136 | 54.2% | 54.2% | 52.2% | -2.0% | -4.9% | -5.5% | 0.73 | -0.68% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 53.4% | 51.2% | +2.2% | Correct |
| 4.5★ vs 4★ | 51.2% | 53.6% | -2.4% | Flat |
| 4★ vs 3.5★ | 53.6% | 56.1% | -2.5% | Flat |
| 3.5★ vs 3★ | 56.1% | 47.5% | +8.6% | Correct |
| 3★ vs 2.5★ | 47.5% | 52.2% | -4.7% | INVERTED |
| 2.5★ vs 2★ | 52.2% | 0.0% | +52.2% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.500 |
| Spearman: Stars vs Flat ROI | 0.643 |
| Spearman: Stars vs CLV | 0.286 |
| Brier Score | 0.2334 |
| Monotonicity Score | 0.00 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | 0.146 | 0.091 | Keep |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.083 | -0.079 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.005 | -0.034 | Monitor |
| WalletBase | Wallet quality | Composite skill score | Higher → better | 0.032 | -0.014 | Keep |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | 0.134 | 0.156 | Keep |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | 0.189 | 0.211 | Keep |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | 0.158 | 0.144 | Keep |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.023 | 0.033 | Monitor |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.088 | 0.130 | Tune |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.039 | -0.040 | Monitor |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.057 | 0.084 | Keep |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.065 | -0.020 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.073 | -0.009 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.039 | 0.012 | Monitor |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (37.88–50.55) | 28 | 42.9% | -10.4% | -10.2% | 0.07% |  |
| p20-40 (50.70–54.76) | 29 | 55.2% | 17.4% | 10.8% | 0.51% |  |
| p40-60 (54.80–58.15) | 28 | 60.7% | 21.7% | 8.1% | 0.16% |  |
| p60-80 (58.36–63.03) | 29 | 41.4% | -16.9% | -6.1% | 0.68% |  |
| p80-95 (63.17–65.52) | 28 | 42.9% | -28.0% | -25.6% | -0.54% |  |
| p95+ (65.60–82.40) | 29 | 41.4% | -22.4% | -28.6% | -0.52% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 65 | 40.0% | -23.6% | -19.8% | -0.13% |  |
| 0.90-1.05 | 53 | 47.2% | -11.4% | -17.1% | 0.17% |  |
| 1.05-1.20 | 38 | 60.5% | 31.8% | 30.1% | 0.28% |  |
| 1.20-1.35 | 7 | 57.1% | 11.2% | -23.4% | -0.01% |  |
| 1.35-1.50 | 5 | 40.0% | -25.4% | -49.8% | 0.52% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.74) | 28 | 46.4% | -5.6% | 6.5% | 0.16% |  |
| 20-40% (0.75–0.93) | 29 | 55.2% | 6.1% | 30.7% | -0.54% |  |
| 40-60% (0.93–1.23) | 28 | 64.3% | 38.0% | -0.8% | 0.34% |  |
| 60-80% (1.24–1.52) | 29 | 31.0% | -42.2% | -35.5% | -0.10% |  |
| 80-95% (1.53–2.11) | 28 | 35.7% | -37.8% | -30.6% | -0.03% |  |
| 95%+ (2.13–4.76) | 29 | 51.7% | 3.3% | -4.1% | 0.55% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 14 | 35.7% | -20.2% | -26.7% | 0.45% | Broad support |
| 0.25-0.40 | 58 | 51.7% | 3.5% | -5.9% | 0.25% | Healthy support |
| 0.40-0.60 | 60 | 41.7% | -16.8% | -2.7% | -0.01% | Concentrated |
| 0.60-0.80 | 31 | 51.6% | -5.3% | -8.7% | -0.17% | Very concentrated |
| 0.80-1.00 | 8 | 62.5% | 18.7% | -3.1% | -0.54% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 26 | 34.6% | -34.6% | -35.5% | -0.26% | 3.9 |
| Broad battle | 107 | 48.6% | -1.4% | 2.9% | 0.19% | 3.8 |
| One-wallet nuke | 16 | 62.5% | 14.5% | 21.5% | -0.24% | 3.5 |
| Thin support | 69 | 52.2% | -1.8% | -1.2% | -0.06% | 3.5 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=179)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 9 | 44.4% | -13.8% | 5.1% | 0.41% | 4.3 | 66.7% |
| SMALL_MOVE | 29 | 34.5% | -35.0% | -41.9% | 0.19% | 3.9 | 100.0% |
| CLEAR_MOVE | 54 | 55.6% | 0.7% | 6.5% | -0.06% | 4.0 | 100.0% |
| NEAR_START | 87 | 48.3% | 1.0% | -3.1% | 0.06% | 3.5 | 100.0% |

**All Time** (n=741)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 526 | 53.6% | -5.3% | -4.6% | -0.49% | 3.2 | 2.7% |
| SMALL_MOVE | 32 | 34.4% | -35.0% | -43.7% | 0.38% | 4.0 | 90.6% |
| CLEAR_MOVE | 80 | 55.0% | 0.6% | 4.7% | -0.17% | 3.9 | 100.0% |
| NEAR_START | 103 | 48.5% | -1.0% | -5.0% | 0.10% | 3.5 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 6 / 50.0% / -2.1% | 9 / 33.3% / -48.7% | 22 / 59.1% / 4.4% | 17 / 58.8% / 25.3% |
| 3.5-4★ | 1 / 0.0% / -100.0% | 17 / 35.3% / -26.7% | 19 / 47.4% / -12.7% | 34 / 58.8% / 25.6% |
| 2.5-3★ | 2 / 50.0% / -5.8% | 2 / 50.0% / -11.5% | 13 / 61.5% / 13.9% | 35 / 34.3% / -31.9% |
| 1.0-2★ | — | 1 / 0.0% / -100.0% | — | 1 / 0.0% / -100.0% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 176 | 47.7% | -6.3% | -6.5% | 3.8 | 0.05% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 226 | 48.7% | -6.2% | -5.9% | 3.8 | 0.02% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 303 | 100% |
| LOCKED (direct) | 62 | 20.5% |
| Promoted (SHADOW→LOCKED) | 122 | 40.3% |
| Rejected (stayed SHADOW) | 91 | 30.0% |
| Superseded (side flipped) | 23 | 7.6% |
| Muted | 142 | 46.9% |
| Cancelled | 12 | 4.0% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=179)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -12.85u | -5.6% | — |
| Flat 1.0u | -10.19u | -5.7% | -2.66u |
| Lock units only | -4.69u | — | -8.16u |
| Units change only on star change | -5.95u | — | -6.90u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 45 | 2.28 | -3.1% | 0.3% | +1.65u | Sizing helps |
| 4.5 | 9 | 2.06 | 23.7% | 13.0% | +0.27u | Neutral |
| 4 | 25 | 1.25 | 1.0% | -7.1% | -2.45u | Sizing hurts |
| 3.5 | 46 | 0.69 | 1.1% | 2.8% | +0.39u | Neutral |
| 3 | 21 | 1.05 | -26.4% | -28.3% | -0.67u | Sizing hurts |
| 2.5 | 29 | 0.73 | -20.4% | -34.8% | -1.52u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |

### All Time (n=741)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -57.73u | -5.2% | — |
| Flat 1.0u | -39.71u | -5.4% | -18.02u |
| Lock units only | -38.81u | — | -18.92u |
| Units change only on star change | -49.99u | — | -7.74u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 58 | 2.36 | -4.3% | -3.2% | -1.94u | Sizing hurts |
| 4.5 | 43 | 2.49 | -4.8% | -11.0% | -9.75u | Sizing hurts |
| 4 | 140 | 1.97 | -2.5% | -4.1% | -7.70u | Sizing hurts |
| 3.5 | 164 | 1.46 | 0.6% | 2.8% | +5.70u | Sizing helps |
| 3 | 181 | 1.19 | -14.5% | -12.6% | -0.82u | Sizing hurts |
| 2.5 | 136 | 0.73 | -4.9% | -5.5% | +1.19u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 179 | 52.5% | 48.0% | -4.5% | -5.7% | 0.06% | Below market |
| 4.5-5★ | 54 | 52.8% | 53.7% | +0.9% | 1.4% | 0.09% | Neutral |
| 3.5-4★ | 71 | 51.1% | 49.3% | -1.8% | 1.1% | 0.20% | Neutral |
| 2.5-3★ | 52 | 54.3% | 42.3% | -11.9% | -18.7% | -0.15% | Below market |
| CLEAR_MOVE only | 54 | 53.7% | 55.6% | +1.9% | 0.7% | -0.06% | Neutral |
| NO_MOVE only | 9 | 52.7% | 44.4% | -8.3% | -13.8% | 0.41% | Below market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=64)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 58.041 | 61.774 | 0.36 |  |
| Rank_norm | 64.799 | 64.132 | 0.05 |  |
| PnL_norm | 57.323 | 56.254 | 0.08 |  |
| WalletBase | 58.537 | 60.601 | 0.26 |  |
| SizeRatio | 1.613 | 1.315 | 0.19 |  |
| ConvictionMult | 0.970 | 0.941 | 0.17 |  |
| WalletCountFor | 3.468 | 3.406 | 0.03 |  |
| TopShare | 0.465 | 0.477 | 0.06 |  |
| ForSide | 199.050 | 194.673 | 0.04 |  |
| AgainstSide | 67.340 | 71.980 | 0.05 |  |
| NetEdge | 1.418 | 1.335 | 0.09 |  |
| WalletPlayScore | 2.172 | 1.998 | 0.09 |  |

### V8 Era (n=171)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 58.041 | 58.041 | 0.00 |  |
| Rank_norm | 64.799 | 64.799 | 0.00 |  |
| PnL_norm | 57.323 | 57.323 | 0.00 |  |
| WalletBase | 58.537 | 58.537 | 0.00 |  |
| SizeRatio | 1.613 | 1.613 | 0.00 |  |
| ConvictionMult | 0.970 | 0.970 | 0.00 |  |
| WalletCountFor | 3.468 | 3.468 | 0.00 |  |
| TopShare | 0.465 | 0.465 | 0.00 |  |
| ForSide | 199.050 | 199.050 | 0.00 |  |
| AgainstSide | 67.340 | 67.340 | 0.00 |  |
| NetEdge | 1.418 | 1.418 | 0.00 |  |
| WalletPlayScore | 2.172 | 2.172 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=179)

- **Sizing issue**: Model P/L (-12.85u) trails flat (-10.19u) by 2.66u

### 7-Day (n=64)

No major failure modes detected.

### All Time (n=741)

- **Sizing issue**: Model P/L (-57.73u) trails flat (-39.71u) by 18.02u
- **Environment issue**: 71.0% NO_MOVE (WR: 53.6%, ROI: -5.3%)


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
| V8 era picks | 179 |
| V8 flat ROI | -5.7% |
| V8 model ROI | -5.6% |
| V8 star monotonicity score | -0.33 |
| 4.5-5★ ROI | 1.4% |
| 2.5-3★ ROI | -18.7% |
| CLEAR_MOVE ROI | 0.7% |
| NO_MOVE ROI | -13.8% |
| Single-wallet play rate | 8.9% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: 0.24% | 4.5★: -0.68% | 4★: 0.24% | 3.5★: 0.17% | 3★: -0.02% | 2.5★: -0.22% | 2★: 0.67% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=179)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 128 | 71.5% | 46.1% | -7.4% | -11.5% | 0.20% |
| MUTED | 44 | 24.6% | 50.0% | -5.3% | 9.5% | -0.45% |
| CANCELLED | 7 | 3.9% | 71.4% | 23.9% | 24.8% | 0.84% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| winners_below_floor | 14 | 42.9% |
| wps_flipped_diag | 12 | 33.3% |
| winners_faded | 10 | 70.0% |
| v73_hc_rescue | 9 | 44.4% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 7 | 57.1% |
| winners_killed | 5 | 80.0% |
| opp_side_stronger_diag | 4 | 50.0% |
| whitelist_fade_weak | 3 | 66.7% |
| sum_below_floor | 3 | 33.3% |
| whitelist_fade_strong | 2 | 50.0% |

### 7-Day (n=64)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 41 | 64.1% | 46.3% | -10.5% | -15.8% | 0.10% |
| MUTED | 21 | 32.8% | 52.4% | 4.1% | 35.5% | -0.81% |
| CANCELLED | 2 | 3.1% | 100.0% | 57.6% | 42.3% | -1.01% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| winners_below_floor | 10 | 50.0% |
| v73_hc_rescue | 9 | 44.4% |
| wps_flipped_diag | 6 | 33.3% |
| winners_faded | 5 | 80.0% |
| sum_below_floor | 3 | 33.3% |
| quality_below_floor | 3 | 33.3% |
| opp_side_stronger_diag | 3 | 33.3% |
| winners_killed | 2 | 100.0% |

### All Time (n=741)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 688 | 92.8% | 52.0% | -6.1% | -6.5% | -0.29% |
| MUTED | 44 | 5.9% | 50.0% | -5.3% | 9.5% | -0.45% |
| CANCELLED | 9 | 1.2% | 77.8% | 47.7% | 42.3% | -0.91% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| winners_below_floor | 14 | 42.9% |
| wps_flipped_diag | 12 | 33.3% |
| winners_faded | 10 | 70.0% |
| v73_hc_rescue | 9 | 44.4% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 7 | 57.1% |
| winners_killed | 5 | 80.0% |
| opp_side_stronger_diag | 4 | 50.0% |
| whitelist_fade_weak | 3 | 66.7% |
| sum_below_floor | 3 | 33.3% |
| opposition_building | 2 | 100.0% |
| mid_tier_or_lower | 2 | 100.0% |
| whitelist_fade_strong | 2 | 50.0% |
