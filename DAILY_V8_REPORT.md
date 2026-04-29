# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-04-29 ET
**Completed Picks**: 708 | **V8 Era Picks**: 146 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (62.5%) beats 5★ (52.6%) |
| Model P/L vs flat P/L | ⚠️ | Model trails flat by 2.2u — sizing amplifying losses |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 50 | 52.0% | -2.06u | -4.1% | -1.50u | -2.1% | -0.25% | -0.24% |  |
| 7-Day | 94 | 48.9% | -8.53u | -9.1% | -7.13u | -5.2% | 0.09% | -0.37% |  |
| 14-Day | 188 | 46.3% | -20.04u | -10.7% | -29.77u | -10.8% | 0.23% | -0.44% |  |
| 30-Day | 624 | 51.6% | -43.45u | -7.0% | -57.96u | -6.3% | -0.32% | -0.07% |  |
| V8 Era | 146 | 47.9% | -9.38u | -6.4% | -11.63u | -5.9% | 0.11% | -0.43% |  |
| All Time | 708 | 52.4% | -38.90u | -5.5% | -56.51u | -5.3% | -0.32% | -0.06% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=146)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 38 | 54.0% | 54.0% | 52.6% | -1.4% | -6.7% | -3.1% | 2.32 | 0.33% | Weak |
| 4.5 | 8 | 50.4% | 50.4% | 62.5% | +12.1% | 39.2% | 34.8% | 1.94 | -0.68% | Strong |
| 4 | 19 | 56.5% | 56.5% | 47.4% | -9.2% | -13.0% | -11.0% | 1.34 | 0.03% | Weak |
| 3.5 | 37 | 50.1% | 50.1% | 51.4% | +1.3% | 10.1% | 6.8% | 0.78 | 0.14% | Strong |
| 3 | 21 | 55.6% | 55.6% | 38.1% | -17.6% | -26.4% | -28.3% | 1.05 | -0.02% | Failing |
| 2.5 | 22 | 53.5% | 53.5% | 40.9% | -12.6% | -21.4% | -34.9% | 0.80 | 0.09% | Failing |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 52.6% | 62.5% | -9.9% | INVERTED |
| 4.5★ vs 4★ | 62.5% | 47.4% | +15.1% | Correct |
| 4★ vs 3.5★ | 47.4% | 51.4% | -4.0% | INVERTED |
| 3.5★ vs 3★ | 51.4% | 38.1% | +13.3% | Correct |
| 3★ vs 2.5★ | 38.1% | 40.9% | -2.8% | Flat |
| 2.5★ vs 2★ | 40.9% | 0.0% | +40.9% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.893 |
| Spearman: Stars vs Flat ROI | 0.786 |
| Spearman: Stars vs CLV | -0.286 |
| Brier Score | 0.2546 |
| Monotonicity Score | 0.00 |

### All Time (n=708)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 51 | 55.2% | 55.2% | 52.9% | -2.2% | -7.2% | -6.1% | 2.40 | 0.47% | Weak |
| 4.5 | 42 | 56.3% | 56.3% | 52.4% | -3.9% | -2.6% | -8.5% | 2.48 | 1.08% | Fair |
| 4 | 134 | 56.0% | 56.0% | 53.0% | -3.1% | -4.6% | -4.4% | 2.01 | -0.62% | Fair |
| 3.5 | 155 | 55.2% | 55.2% | 57.4% | +2.2% | 2.8% | 3.3% | 1.53 | -0.23% | Fair |
| 3 | 181 | 55.2% | 55.2% | 47.5% | -7.7% | -14.5% | -12.6% | 1.19 | -0.54% | Weak |
| 2.5 | 129 | 54.3% | 54.3% | 52.7% | -1.6% | -4.2% | -4.3% | 0.74 | -0.66% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 52.9% | 52.4% | +0.5% | Correct |
| 4.5★ vs 4★ | 52.4% | 53.0% | -0.6% | Flat |
| 4★ vs 3.5★ | 53.0% | 57.4% | -4.4% | INVERTED |
| 3.5★ vs 3★ | 57.4% | 47.5% | +9.9% | Correct |
| 3★ vs 2.5★ | 47.5% | 52.7% | -5.2% | INVERTED |
| 2.5★ vs 2★ | 52.7% | 0.0% | +52.7% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.500 |
| Spearman: Stars vs Flat ROI | 0.357 |
| Spearman: Stars vs CLV | 0.286 |
| Brier Score | 0.2331 |
| Monotonicity Score | 0.00 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | 0.146 | 0.110 | Keep |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.051 | -0.078 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | 0.009 | -0.046 | Monitor |
| WalletBase | Wallet quality | Composite skill score | Higher → better | 0.075 | 0.021 | Keep |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | 0.116 | 0.130 | Keep |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | 0.152 | 0.169 | Keep |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | 0.169 | 0.140 | Keep |
| ForSide | Side support | Total wallet force on side | Higher → better | 0.055 | 0.093 | Keep |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.112 | 0.125 | Tune |
| NetEdge | Core side edge | For minus discounted against | Higher → better | 0.030 | 0.031 | Keep |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.133 | 0.142 | Keep |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | -0.002 | -0.075 | Monitor |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.011 | -0.052 | Monitor |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | 0.032 | 0.075 | Keep |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (37.88–50.29) | 23 | 39.1% | -16.7% | -12.6% | 0.18% |  |
| p20-40 (50.40–53.53) | 23 | 47.8% | -11.4% | -5.1% | 0.59% |  |
| p40-60 (53.90–57.83) | 23 | 60.9% | 34.9% | 17.9% | 0.15% |  |
| p60-80 (57.92–62.40) | 23 | 43.5% | -12.3% | 1.1% | 0.52% |  |
| p80-95 (62.57–65.33) | 23 | 47.8% | -19.7% | -25.1% | -0.38% |  |
| p95+ (65.40–74.70) | 23 | 43.5% | -19.1% | -31.3% | -0.39% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 55 | 40.0% | -23.6% | -20.0% | -0.11% |  |
| 0.90-1.05 | 40 | 47.5% | -10.7% | -12.9% | 0.20% |  |
| 1.05-1.20 | 30 | 60.0% | 29.3% | 26.2% | 0.41% |  |
| 1.20-1.35 | 7 | 57.1% | 11.2% | -23.4% | -0.01% |  |
| 1.35-1.50 | 4 | 25.0% | -55.8% | -66.0% | 0.88% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.77) | 23 | 43.5% | -15.8% | -14.3% | 0.60% |  |
| 20-40% (0.78–0.98) | 23 | 52.2% | 3.0% | 33.8% | -0.54% |  |
| 40-60% (1.00–1.24) | 23 | 56.5% | 27.7% | -15.0% | 0.19% |  |
| 60-80% (1.24–1.57) | 23 | 34.8% | -40.5% | -22.4% | 0.08% |  |
| 80-95% (1.58–2.17) | 23 | 43.5% | -22.2% | -24.2% | -0.39% |  |
| 95%+ (2.22–4.76) | 23 | 52.2% | 3.6% | -2.5% | 0.72% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 11 | 45.5% | 1.6% | -7.5% | 0.56% | Broad support |
| 0.25-0.40 | 49 | 51.0% | -0.3% | -9.0% | 0.30% | Healthy support |
| 0.40-0.60 | 48 | 41.7% | -15.9% | -8.1% | -0.10% | Concentrated |
| 0.60-0.80 | 27 | 51.9% | -5.5% | -5.8% | -0.05% | Very concentrated |
| 0.80-1.00 | 3 | 33.3% | -36.6% | -59.6% | 0.07% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 23 | 34.8% | -34.6% | -33.0% | -0.34% | 3.9 |
| Broad battle | 84 | 51.2% | 3.4% | 3.9% | 0.25% | 3.8 |
| One-wallet nuke | 11 | 54.5% | -2.5% | 18.5% | 0.06% | 3.9 |
| Thin support | 55 | 49.1% | -9.1% | -7.2% | 0.12% | 3.5 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=146)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 8 | 50.0% | -3.0% | 8.4% | 0.43% | 4.4 | 62.5% |
| SMALL_MOVE | 23 | 30.4% | -44.3% | -47.5% | 0.30% | 3.9 | 100.0% |
| CLEAR_MOVE | 42 | 57.1% | -1.0% | 7.1% | -0.09% | 3.9 | 100.0% |
| NEAR_START | 73 | 47.9% | 2.0% | -4.3% | 0.12% | 3.6 | 100.0% |

**All Time** (n=708)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 525 | 53.7% | -5.1% | -4.6% | -0.50% | 3.2 | 2.5% |
| SMALL_MOVE | 26 | 30.8% | -43.2% | -48.4% | 0.52% | 4.0 | 88.5% |
| CLEAR_MOVE | 68 | 55.9% | -0.4% | 4.7% | -0.21% | 3.9 | 100.0% |
| NEAR_START | 89 | 48.3% | -0.5% | -6.1% | 0.17% | 3.6 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 6 / 50.0% / -2.1% | 7 / 28.6% / -52.4% | 17 / 64.7% / 5.7% | 16 / 56.3% / 21.3% |
| 3.5-4★ | — | 14 / 35.7% / -32.3% | 14 / 50.0% / -9.5% | 28 / 57.1% / 25.4% |
| 2.5-3★ | 2 / 50.0% / -5.8% | 1 / 0.0% / -100.0% | 11 / 54.5% / -0.6% | 29 / 34.5% / -31.2% |
| 1.0-2★ | — | 1 / 0.0% / -100.0% | — | — |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 143 | 47.6% | -7.2% | -7.0% | 3.8 | 0.09% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 193 | 48.7% | -6.8% | -6.2% | 3.8 | 0.05% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 209 | 100% |
| LOCKED (direct) | 58 | 27.8% |
| Promoted (SHADOW→LOCKED) | 89 | 42.6% |
| Rejected (stayed SHADOW) | 45 | 21.5% |
| Superseded (side flipped) | 12 | 5.7% |
| Muted | 78 | 37.3% |
| Cancelled | 11 | 5.3% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=146)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -11.63u | -5.9% | — |
| Flat 1.0u | -9.38u | -6.4% | -2.25u |
| Lock units only | -7.93u | — | -3.70u |
| Units change only on star change | -9.54u | — | -2.09u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 38 | 2.32 | -6.7% | -3.1% | -0.22u | Neutral |
| 4.5 | 8 | 1.94 | 39.2% | 34.8% | +2.27u | Sizing helps |
| 4 | 19 | 1.34 | -13.0% | -11.0% | -0.33u | Neutral |
| 3.5 | 37 | 0.78 | 10.1% | 6.8% | -1.76u | Sizing hurts |
| 3 | 21 | 1.05 | -26.4% | -28.3% | -0.67u | Sizing hurts |
| 2.5 | 22 | 0.80 | -21.4% | -34.9% | -1.43u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |

### All Time (n=708)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -56.51u | -5.3% | — |
| Flat 1.0u | -38.90u | -5.5% | -17.61u |
| Lock units only | -42.05u | — | -14.46u |
| Units change only on star change | -53.58u | — | -2.93u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 51 | 2.40 | -7.2% | -6.1% | -3.81u | Sizing hurts |
| 4.5 | 42 | 2.48 | -2.6% | -8.5% | -7.75u | Sizing hurts |
| 4 | 134 | 2.01 | -4.6% | -4.4% | -5.57u | Sizing hurts |
| 3.5 | 155 | 1.53 | 2.8% | 3.3% | +3.54u | Sizing helps |
| 3 | 181 | 1.19 | -14.5% | -12.6% | -0.82u | Sizing hurts |
| 2.5 | 129 | 0.74 | -4.2% | -4.3% | +1.28u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 146 | 53.3% | 47.9% | -5.4% | -6.4% | 0.11% | Below market |
| 4.5-5★ | 46 | 53.4% | 54.3% | +1.0% | 1.3% | 0.16% | Neutral |
| 3.5-4★ | 56 | 52.3% | 50.0% | -2.3% | 2.2% | 0.11% | Below market |
| 2.5-3★ | 43 | 54.6% | 39.5% | -15.0% | -23.8% | 0.04% | Below market |
| CLEAR_MOVE only | 42 | 56.4% | 57.1% | +0.7% | -1.0% | -0.09% | Neutral |
| NO_MOVE only | 8 | 52.8% | 50.0% | -2.8% | -3.0% | 0.43% | Below market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=91)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 56.826 | 58.290 | 0.15 |  |
| Rank_norm | 65.013 | 67.015 | 0.15 |  |
| PnL_norm | 57.458 | 59.799 | 0.18 |  |
| WalletBase | 57.876 | 59.731 | 0.24 |  |
| SizeRatio | 1.660 | 1.499 | 0.10 |  |
| ConvictionMult | 0.971 | 0.965 | 0.03 |  |
| WalletCountFor | 3.514 | 3.418 | 0.06 |  |
| TopShare | 0.454 | 0.464 | 0.06 |  |
| ForSide | 200.964 | 200.614 | 0.00 |  |
| AgainstSide | 64.853 | 64.601 | 0.00 |  |
| NetEdge | 1.458 | 1.457 | 0.00 |  |
| WalletPlayScore | 2.286 | 2.213 | 0.04 |  |

### V8 Era (n=138)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 56.826 | 56.826 | 0.00 |  |
| Rank_norm | 65.013 | 65.013 | 0.00 |  |
| PnL_norm | 57.458 | 57.458 | 0.00 |  |
| WalletBase | 57.876 | 57.876 | 0.00 |  |
| SizeRatio | 1.660 | 1.660 | 0.00 |  |
| ConvictionMult | 0.971 | 0.971 | 0.00 |  |
| WalletCountFor | 3.514 | 3.514 | 0.00 |  |
| TopShare | 0.454 | 0.454 | 0.00 |  |
| ForSide | 200.964 | 200.964 | 0.00 |  |
| AgainstSide | 64.853 | 64.853 | 0.00 |  |
| NetEdge | 1.458 | 1.458 | 0.00 |  |
| WalletPlayScore | 2.286 | 2.286 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=146)

- **Sizing issue**: Model P/L (-11.63u) trails flat (-9.38u) by 2.25u

### 7-Day (n=94)

- **Concentration issue**: 20 high-concentration picks (TopShare>0.6) at -20.0% ROI

### All Time (n=708)

- **Sizing issue**: Model P/L (-56.51u) trails flat (-38.90u) by 17.61u
- **Environment issue**: 74.2% NO_MOVE (WR: 53.7%, ROI: -5.1%)


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
| V8 era picks | 146 |
| V8 flat ROI | -6.4% |
| V8 model ROI | -5.9% |
| V8 star monotonicity score | 0.00 |
| 4.5-5★ ROI | 1.3% |
| 2.5-3★ ROI | -23.8% |
| CLEAR_MOVE ROI | -1.0% |
| NO_MOVE ROI | -3.0% |
| Single-wallet play rate | 7.5% |
| Whale override win rate | — |
| Avg CLV by star bucket | 5★: 0.33% | 4.5★: -0.68% | 4★: 0.03% | 3.5★: 0.14% | 3★: -0.02% | 2.5★: 0.09% | 2★: 0.67% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=146)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 103 | 70.5% | 45.6% | -8.1% | -10.9% | 0.23% |
| MUTED | 36 | 24.7% | 50.0% | -7.4% | 3.7% | -0.37% |
| CANCELLED | 7 | 4.8% | 71.4% | 23.9% | 24.8% | 0.84% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| winners_below_floor | 11 | 45.5% |
| wps_flipped_diag | 8 | 37.5% |
| winners_faded | 8 | 62.5% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 5 | 60.0% |
| winners_killed | 5 | 80.0% |
| whitelist_fade_weak | 3 | 66.7% |
| whitelist_fade_strong | 2 | 50.0% |
| opp_side_stronger_diag | 2 | 50.0% |
| sum_below_floor | 2 | 50.0% |

### 7-Day (n=94)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 53 | 56.4% | 45.3% | -15.7% | -14.3% | 0.28% |
| MUTED | 34 | 36.2% | 50.0% | -5.5% | 6.0% | -0.35% |
| CANCELLED | 7 | 7.4% | 71.4% | 23.9% | 24.8% | 0.84% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| winners_below_floor | 11 | 45.5% |
| wps_flipped_diag | 8 | 37.5% |
| winners_faded | 8 | 62.5% |
| below_lock_range | 5 | 20.0% |
| quality_below_floor | 5 | 60.0% |
| winners_killed | 5 | 80.0% |
| whitelist_fade_weak | 3 | 66.7% |
| whitelist_fade_strong | 2 | 50.0% |
| opp_side_stronger_diag | 2 | 50.0% |
| sum_below_floor | 2 | 50.0% |

### All Time (n=708)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 663 | 93.6% | 52.2% | -6.1% | -6.2% | -0.31% |
| MUTED | 36 | 5.1% | 50.0% | -7.4% | 3.7% | -0.37% |
| CANCELLED | 9 | 1.3% | 77.8% | 47.7% | 42.3% | -0.91% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| winners_below_floor | 11 | 45.5% |
| wps_flipped_diag | 8 | 37.5% |
| winners_faded | 8 | 62.5% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 5 | 60.0% |
| winners_killed | 5 | 80.0% |
| whitelist_fade_weak | 3 | 66.7% |
| opposition_building | 2 | 100.0% |
| mid_tier_or_lower | 2 | 100.0% |
| whitelist_fade_strong | 2 | 50.0% |
| opp_side_stronger_diag | 2 | 50.0% |
| sum_below_floor | 2 | 50.0% |
