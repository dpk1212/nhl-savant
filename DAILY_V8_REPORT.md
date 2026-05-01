# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-05-01 ET
**Completed Picks**: 722 | **V8 Era Picks**: 160 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (62.5%) beats 5★ (55.8%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 30 | 46.7% | -1.88u | -6.3% | 5.81u | 13.2% | -0.10% | -0.29% |  |
| 7-Day | 84 | 50.0% | -3.99u | -4.7% | 1.94u | 1.6% | -0.01% | -0.23% |  |
| 14-Day | 171 | 46.8% | -13.75u | -8.0% | -9.82u | -4.2% | 0.09% | -0.38% |  |
| 30-Day | 589 | 51.4% | -35.82u | -6.1% | -41.74u | -4.9% | -0.31% | -0.04% |  |
| V8 Era | 160 | 48.1% | -8.43u | -5.3% | -2.67u | -1.2% | 0.10% | -0.39% |  |
| All Time | 722 | 52.4% | -37.94u | -5.3% | -47.55u | -4.4% | -0.32% | -0.06% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=160)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 43 | 53.2% | 53.2% | 55.8% | +2.6% | 1.5% | 5.4% | 2.27 | 0.25% | Fair |
| 4.5 | 8 | 50.4% | 50.4% | 62.5% | +12.1% | 39.2% | 34.8% | 1.94 | -0.68% | Strong |
| 4 | 21 | 55.2% | 55.2% | 52.4% | -2.8% | 2.1% | 4.2% | 1.34 | 0.08% | Fair |
| 3.5 | 42 | 50.3% | 50.3% | 47.6% | -2.7% | 1.4% | 1.3% | 0.75 | 0.14% | Fair |
| 3 | 21 | 55.6% | 55.6% | 38.1% | -17.6% | -26.4% | -28.3% | 1.05 | -0.02% | Failing |
| 2.5 | 24 | 53.6% | 53.6% | 37.5% | -16.1% | -27.9% | -40.1% | 0.79 | 0.09% | Failing |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 55.8% | 62.5% | -6.7% | INVERTED |
| 4.5★ vs 4★ | 62.5% | 52.4% | +10.1% | Correct |
| 4★ vs 3.5★ | 52.4% | 47.6% | +4.8% | Correct |
| 3.5★ vs 3★ | 47.6% | 38.1% | +9.5% | Correct |
| 3★ vs 2.5★ | 38.1% | 37.5% | +0.6% | Correct |
| 2.5★ vs 2★ | 37.5% | 0.0% | +37.5% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.964 |
| Spearman: Stars vs Flat ROI | 0.893 |
| Spearman: Stars vs CLV | -0.286 |
| Brier Score | 0.2549 |
| Monotonicity Score | -0.67 |

### All Time (n=722)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 56 | 54.5% | 54.5% | 55.4% | +0.9% | -0.9% | 0.4% | 2.36 | 0.39% | Fair |
| 4.5 | 42 | 56.3% | 56.3% | 52.4% | -3.9% | -2.6% | -8.5% | 2.48 | 1.08% | Fair |
| 4 | 136 | 55.8% | 55.8% | 53.7% | -2.2% | -2.4% | -2.9% | 2.00 | -0.60% | Fair |
| 3.5 | 160 | 55.1% | 55.1% | 56.3% | +1.2% | 0.7% | 2.6% | 1.49 | -0.22% | Fair |
| 3 | 181 | 55.2% | 55.2% | 47.5% | -7.7% | -14.5% | -12.6% | 1.19 | -0.54% | Weak |
| 2.5 | 131 | 54.3% | 54.3% | 51.9% | -2.4% | -5.7% | -5.8% | 0.74 | -0.64% | Weak |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 55.4% | 52.4% | +3.0% | Correct |
| 4.5★ vs 4★ | 52.4% | 53.7% | -1.3% | Flat |
| 4★ vs 3.5★ | 53.7% | 56.3% | -2.6% | Flat |
| 3.5★ vs 3★ | 56.3% | 47.5% | +8.8% | Correct |
| 3★ vs 2.5★ | 47.5% | 51.9% | -4.4% | INVERTED |
| 2.5★ vs 2★ | 51.9% | 0.0% | +51.9% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.714 |
| Spearman: Stars vs Flat ROI | 0.714 |
| Spearman: Stars vs CLV | 0.286 |
| Brier Score | 0.2335 |
| Monotonicity Score | 0.00 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | 0.166 | 0.112 | Keep |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.054 | -0.069 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.037 | -0.079 | Monitor |
| WalletBase | Wallet quality | Composite skill score | Higher → better | 0.058 | 0.001 | Keep |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | 0.149 | 0.162 | Keep |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | 0.189 | 0.206 | Keep |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | 0.187 | 0.159 | Keep |
| ForSide | Side support | Total wallet force on side | Higher → better | 0.069 | 0.100 | Keep |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.125 | 0.156 | Tune |
| NetEdge | Core side edge | For minus discounted against | Higher → better | 0.030 | 0.007 | Monitor |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.147 | 0.152 | Keep |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | -0.016 | -0.087 | Monitor |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | -0.000 | -0.068 | Monitor |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | 0.050 | 0.079 | Keep |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (37.88–50.53) | 25 | 36.0% | -23.4% | -21.6% | 0.18% |  |
| p20-40 (50.55–54.05) | 25 | 56.0% | 4.4% | 9.4% | 0.78% |  |
| p40-60 (54.47–57.83) | 26 | 61.5% | 40.4% | 31.9% | 0.07% |  |
| p60-80 (57.92–62.57) | 25 | 40.0% | -19.3% | -2.4% | 0.49% |  |
| p80-95 (62.76–65.13) | 25 | 48.0% | -18.2% | -21.3% | -0.41% |  |
| p95+ (65.33–74.70) | 26 | 42.3% | -21.7% | -29.5% | -0.47% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 59 | 39.0% | -25.6% | -20.9% | -0.14% |  |
| 0.90-1.05 | 44 | 47.7% | -10.4% | -7.6% | 0.28% |  |
| 1.05-1.20 | 36 | 61.1% | 33.7% | 36.8% | 0.29% |  |
| 1.20-1.35 | 7 | 57.1% | 11.2% | -23.4% | -0.01% |  |
| 1.35-1.50 | 4 | 25.0% | -55.8% | -66.0% | 0.88% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.77) | 25 | 48.0% | -2.6% | 7.5% | 0.60% |  |
| 20-40% (0.78–1.00) | 25 | 48.0% | -5.3% | 17.1% | -0.48% |  |
| 40-60% (1.00–1.25) | 26 | 57.7% | 25.1% | -5.2% | 0.07% |  |
| 60-80% (1.26–1.57) | 25 | 36.0% | -33.3% | -11.4% | 0.07% |  |
| 80-95% (1.58–2.13) | 25 | 36.0% | -37.7% | -35.0% | -0.32% |  |
| 95%+ (2.17–4.76) | 26 | 57.7% | 15.2% | 8.3% | 0.62% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 12 | 41.7% | -6.8% | -10.5% | 0.51% | Broad support |
| 0.25-0.40 | 54 | 51.9% | 4.2% | -0.2% | 0.24% | Healthy support |
| 0.40-0.60 | 55 | 43.6% | -12.9% | -1.2% | 0.00% | Concentrated |
| 0.60-0.80 | 28 | 50.0% | -8.8% | -7.3% | -0.16% | Very concentrated |
| 0.80-1.00 | 3 | 33.3% | -36.6% | -59.6% | 0.07% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 25 | 36.0% | -32.0% | -30.0% | -0.24% | 3.9 |
| Broad battle | 95 | 50.5% | 3.1% | 9.6% | 0.20% | 3.9 |
| One-wallet nuke | 11 | 54.5% | -2.5% | 18.5% | 0.06% | 3.9 |
| Thin support | 58 | 50.0% | -6.3% | -3.0% | 0.10% | 3.6 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=160)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 9 | 44.4% | -13.8% | 5.1% | 0.41% | 4.3 | 66.7% |
| SMALL_MOVE | 26 | 34.6% | -34.3% | -30.7% | 0.34% | 4.0 | 100.0% |
| CLEAR_MOVE | 46 | 56.5% | 1.2% | 13.5% | -0.10% | 4.0 | 100.0% |
| NEAR_START | 79 | 48.1% | 1.5% | -2.6% | 0.10% | 3.6 | 100.0% |

**All Time** (n=722)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 526 | 53.6% | -5.3% | -4.6% | -0.49% | 3.2 | 2.7% |
| SMALL_MOVE | 29 | 34.5% | -34.4% | -35.0% | 0.53% | 4.0 | 89.7% |
| CLEAR_MOVE | 72 | 55.6% | 1.0% | 8.6% | -0.21% | 3.9 | 100.0% |
| NEAR_START | 95 | 48.4% | -0.8% | -4.7% | 0.14% | 3.6 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 6 / 50.0% / -2.1% | 8 / 37.5% / -42.3% | 20 / 65.0% / 14.8% | 17 / 58.8% / 25.3% |
| 3.5-4★ | 1 / 0.0% / -100.0% | 16 / 37.5% / -22.1% | 15 / 46.7% / -15.5% | 31 / 58.1% / 25.6% |
| 2.5-3★ | 2 / 50.0% / -5.8% | 1 / 0.0% / -100.0% | 11 / 54.5% / -0.6% | 31 / 32.3% / -35.7% |
| 1.0-2★ | — | 1 / 0.0% / -100.0% | — | — |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 157 | 47.8% | -6.0% | -2.2% | 3.8 | 0.09% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 207 | 48.8% | -5.9% | -2.9% | 3.8 | 0.04% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 246 | 100% |
| LOCKED (direct) | 58 | 23.6% |
| Promoted (SHADOW→LOCKED) | 103 | 41.9% |
| Rejected (stayed SHADOW) | 64 | 26.0% |
| Superseded (side flipped) | 16 | 6.5% |
| Muted | 99 | 40.2% |
| Cancelled | 12 | 4.9% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=160)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -2.67u | -1.2% | — |
| Flat 1.0u | -8.43u | -5.3% | +5.76u |
| Lock units only | 1.15u | — | -3.82u |
| Units change only on star change | -0.46u | — | -2.21u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 43 | 2.27 | 1.5% | 5.4% | +4.65u | Sizing helps |
| 4.5 | 8 | 1.94 | 39.2% | 34.8% | +2.27u | Sizing helps |
| 4 | 21 | 1.34 | 2.1% | 4.2% | +0.74u | Sizing helps |
| 3.5 | 42 | 0.75 | 1.4% | 1.3% | -0.20u | Neutral |
| 3 | 21 | 1.05 | -26.4% | -28.3% | -0.67u | Sizing hurts |
| 2.5 | 24 | 0.79 | -27.9% | -40.1% | -0.93u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |

### All Time (n=722)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -47.55u | -4.4% | — |
| Flat 1.0u | -37.94u | -5.3% | -9.61u |
| Lock units only | -32.97u | — | -14.58u |
| Units change only on star change | -44.50u | — | -3.05u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 56 | 2.36 | -0.9% | 0.4% | +1.06u | Sizing helps |
| 4.5 | 42 | 2.48 | -2.6% | -8.5% | -7.75u | Sizing hurts |
| 4 | 136 | 2.00 | -2.4% | -2.9% | -4.50u | Sizing hurts |
| 3.5 | 160 | 1.49 | 0.7% | 2.6% | +5.10u | Sizing helps |
| 3 | 181 | 1.19 | -14.5% | -12.6% | -0.82u | Sizing hurts |
| 2.5 | 131 | 0.74 | -5.7% | -5.8% | +1.78u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 160 | 52.9% | 48.1% | -4.8% | -5.3% | 0.10% | Below market |
| 4.5-5★ | 51 | 52.8% | 56.9% | +4.1% | 7.4% | 0.11% | Beating market |
| 3.5-4★ | 63 | 51.9% | 49.2% | -2.7% | 1.7% | 0.12% | Below market |
| 2.5-3★ | 45 | 54.5% | 37.8% | -16.8% | -27.2% | 0.04% | Below market |
| CLEAR_MOVE only | 46 | 54.9% | 56.5% | +1.6% | 1.2% | -0.10% | Neutral |
| NO_MOVE only | 9 | 52.7% | 44.4% | -8.3% | -13.8% | 0.41% | Below market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=84)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 57.112 | 60.633 | 0.36 |  |
| Rank_norm | 65.046 | 65.912 | 0.06 |  |
| PnL_norm | 57.473 | 59.244 | 0.14 |  |
| WalletBase | 58.041 | 60.903 | 0.38 |  |
| SizeRatio | 1.647 | 1.405 | 0.15 |  |
| ConvictionMult | 0.973 | 0.951 | 0.13 |  |
| WalletCountFor | 3.533 | 3.333 | 0.12 |  |
| TopShare | 0.450 | 0.469 | 0.12 |  |
| ForSide | 202.859 | 196.771 | 0.06 |  |
| AgainstSide | 67.280 | 68.049 | 0.01 |  |
| NetEdge | 1.457 | 1.389 | 0.08 |  |
| WalletPlayScore | 2.307 | 2.097 | 0.11 |  |

### V8 Era (n=152)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 57.112 | 57.112 | 0.00 |  |
| Rank_norm | 65.046 | 65.046 | 0.00 |  |
| PnL_norm | 57.473 | 57.473 | 0.00 |  |
| WalletBase | 58.041 | 58.041 | 0.00 |  |
| SizeRatio | 1.647 | 1.647 | 0.00 |  |
| ConvictionMult | 0.973 | 0.973 | 0.00 |  |
| WalletCountFor | 3.533 | 3.533 | 0.00 |  |
| TopShare | 0.450 | 0.450 | 0.00 |  |
| ForSide | 202.859 | 202.859 | 0.00 |  |
| AgainstSide | 67.280 | 67.280 | 0.00 |  |
| NetEdge | 1.457 | 1.457 | 0.00 |  |
| WalletPlayScore | 2.307 | 2.307 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=160)

- **Concentration issue**: 31 high-concentration picks (TopShare>0.6) at -11.5% ROI

### 7-Day (n=84)

- **Concentration issue**: 19 high-concentration picks (TopShare>0.6) at -15.8% ROI

### All Time (n=722)

- **Sizing issue**: Model P/L (-47.55u) trails flat (-37.94u) by 9.61u
- **Environment issue**: 72.9% NO_MOVE (WR: 53.6%, ROI: -5.3%)
- **Concentration issue**: 31 high-concentration picks (TopShare>0.6) at -11.5% ROI


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
| V8 era picks | 160 |
| V8 flat ROI | -5.3% |
| V8 model ROI | -1.2% |
| V8 star monotonicity score | -0.67 |
| 4.5-5★ ROI | 7.4% |
| 2.5-3★ ROI | -27.2% |
| CLEAR_MOVE ROI | 1.2% |
| NO_MOVE ROI | -13.8% |
| Single-wallet play rate | 6.9% |
| Whale override win rate | — |
| Avg CLV by star bucket | 5★: 0.25% | 4.5★: -0.68% | 4★: 0.08% | 3.5★: 0.14% | 3★: -0.02% | 2.5★: 0.09% | 2★: 0.67% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=160)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 114 | 71.3% | 45.6% | -7.7% | -6.2% | 0.24% |
| MUTED | 39 | 24.4% | 51.3% | -3.2% | 9.7% | -0.43% |
| CANCELLED | 7 | 4.4% | 71.4% | 23.9% | 24.8% | 0.84% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| winners_below_floor | 12 | 41.7% |
| wps_flipped_diag | 10 | 40.0% |
| winners_faded | 9 | 66.7% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 6 | 66.7% |
| winners_killed | 5 | 80.0% |
| whitelist_fade_weak | 3 | 66.7% |
| opp_side_stronger_diag | 3 | 66.7% |
| whitelist_fade_strong | 2 | 50.0% |
| sum_below_floor | 2 | 50.0% |
| v73_hc_rescue | 2 | 0.0% |

### 7-Day (n=84)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 49 | 58.3% | 44.9% | -14.4% | -7.8% | 0.31% |
| MUTED | 30 | 35.7% | 53.3% | 5.0% | 17.2% | -0.57% |
| CANCELLED | 5 | 6.0% | 80.0% | 31.4% | 31.2% | 0.18% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| winners_below_floor | 12 | 41.7% |
| wps_flipped_diag | 10 | 40.0% |
| winners_faded | 9 | 66.7% |
| quality_below_floor | 6 | 66.7% |
| winners_killed | 5 | 80.0% |
| opp_side_stronger_diag | 3 | 66.7% |
| sum_below_floor | 2 | 50.0% |
| v73_hc_rescue | 2 | 0.0% |
| below_lock_range | 1 | 0.0% |

### All Time (n=722)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 674 | 93.4% | 52.1% | -6.1% | -5.6% | -0.30% |
| MUTED | 39 | 5.4% | 51.3% | -3.2% | 9.7% | -0.43% |
| CANCELLED | 9 | 1.2% | 77.8% | 47.7% | 42.3% | -0.91% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| winners_below_floor | 12 | 41.7% |
| wps_flipped_diag | 10 | 40.0% |
| winners_faded | 9 | 66.7% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 6 | 66.7% |
| winners_killed | 5 | 80.0% |
| whitelist_fade_weak | 3 | 66.7% |
| opp_side_stronger_diag | 3 | 66.7% |
| opposition_building | 2 | 100.0% |
| mid_tier_or_lower | 2 | 100.0% |
| whitelist_fade_strong | 2 | 50.0% |
| sum_below_floor | 2 | 50.0% |
| v73_hc_rescue | 2 | 0.0% |
