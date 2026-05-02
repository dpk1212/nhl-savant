# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-05-02 ET
**Completed Picks**: 732 | **V8 Era Picks**: 170 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (62.5%) beats 5★ (53.3%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 24 | 45.8% | -1.35u | -5.6% | 0.99u | 4.2% | -0.09% | -0.24% |  |
| 7-Day | 84 | 47.6% | -7.59u | -9.0% | -7.80u | -7.0% | -0.10% | -0.22% |  |
| 14-Day | 170 | 47.6% | -10.73u | -6.3% | -10.64u | -4.8% | 0.08% | -0.40% |  |
| 30-Day | 574 | 50.7% | -40.87u | -7.1% | -55.63u | -6.7% | -0.30% | -0.03% |  |
| V8 Era | 170 | 47.6% | -10.73u | -6.3% | -10.64u | -4.8% | 0.08% | -0.40% |  |
| All Time | 732 | 52.2% | -40.24u | -5.5% | -55.52u | -5.1% | -0.32% | -0.07% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=170)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 45 | 53.4% | 53.4% | 53.3% | -0.1% | -3.1% | 0.3% | 2.28 | 0.24% | Fair |
| 4.5 | 8 | 50.4% | 50.4% | 62.5% | +12.1% | 39.2% | 34.8% | 1.94 | -0.68% | Strong |
| 4 | 22 | 55.1% | 55.1% | 54.5% | -0.6% | 6.0% | -6.2% | 1.30 | 0.10% | Strong |
| 3.5 | 46 | 50.3% | 50.3% | 47.8% | -2.4% | 1.1% | 2.8% | 0.69 | 0.17% | Fair |
| 3 | 21 | 55.6% | 55.6% | 38.1% | -17.6% | -26.4% | -28.3% | 1.05 | -0.02% | Failing |
| 2.5 | 27 | 53.4% | 53.4% | 37.0% | -16.4% | -28.8% | -39.6% | 0.76 | -0.12% | Failing |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 53.3% | 62.5% | -9.2% | INVERTED |
| 4.5★ vs 4★ | 62.5% | 54.5% | +8.0% | Correct |
| 4★ vs 3.5★ | 54.5% | 47.8% | +6.7% | Correct |
| 3.5★ vs 3★ | 47.8% | 38.1% | +9.7% | Correct |
| 3★ vs 2.5★ | 38.1% | 37.0% | +1.1% | Correct |
| 2.5★ vs 2★ | 37.0% | 0.0% | +37.0% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.893 |
| Spearman: Stars vs Flat ROI | 0.786 |
| Spearman: Stars vs CLV | -0.143 |
| Brier Score | 0.2552 |
| Monotonicity Score | -0.67 |

### All Time (n=732)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 58 | 54.6% | 54.6% | 53.4% | -1.1% | -4.3% | -3.2% | 2.36 | 0.38% | Fair |
| 4.5 | 42 | 56.3% | 56.3% | 52.4% | -3.9% | -2.6% | -8.5% | 2.48 | 1.08% | Fair |
| 4 | 137 | 55.8% | 55.8% | 54.0% | -1.8% | -1.7% | -3.9% | 1.99 | -0.58% | Fair |
| 3.5 | 164 | 55.0% | 55.0% | 56.1% | +1.1% | 0.6% | 2.8% | 1.46 | -0.20% | Fair |
| 3 | 181 | 55.2% | 55.2% | 47.5% | -7.7% | -14.5% | -12.6% | 1.19 | -0.54% | Weak |
| 2.5 | 134 | 54.3% | 54.3% | 51.5% | -2.8% | -6.4% | -6.2% | 0.74 | -0.67% | Weak |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 53.4% | 52.4% | +1.0% | Correct |
| 4.5★ vs 4★ | 52.4% | 54.0% | -1.6% | Flat |
| 4★ vs 3.5★ | 54.0% | 56.1% | -2.1% | Flat |
| 3.5★ vs 3★ | 56.1% | 47.5% | +8.6% | Correct |
| 3★ vs 2.5★ | 47.5% | 51.5% | -4.0% | INVERTED |
| 2.5★ vs 2★ | 51.5% | 0.0% | +51.5% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.643 |
| Spearman: Stars vs Flat ROI | 0.607 |
| Spearman: Stars vs CLV | 0.286 |
| Brier Score | 0.2339 |
| Monotonicity Score | 0.00 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | 0.147 | 0.095 | Keep |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.082 | -0.087 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.027 | -0.062 | Monitor |
| WalletBase | Wallet quality | Composite skill score | Higher → better | 0.035 | -0.016 | Keep |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | 0.127 | 0.153 | Keep |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | 0.165 | 0.195 | Keep |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | 0.155 | 0.143 | Keep |
| ForSide | Side support | Total wallet force on side | Higher → better | 0.025 | 0.069 | Monitor |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.097 | 0.135 | Tune |
| NetEdge | Core side edge | For minus discounted against | Higher → better | 0.005 | -0.006 | Monitor |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.110 | 0.126 | Keep |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.016 | -0.059 | Monitor |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.027 | -0.044 | Monitor |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | 0.018 | 0.056 | Monitor |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (37.88–50.55) | 27 | 40.7% | -14.3% | -10.2% | 0.16% |  |
| p20-40 (50.70–54.51) | 27 | 55.6% | 19.2% | 13.0% | 0.64% |  |
| p40-60 (54.60–57.83) | 27 | 59.3% | 18.9% | 8.1% | 0.15% |  |
| p60-80 (57.92–62.76) | 27 | 37.0% | -25.3% | -12.3% | 0.55% |  |
| p80-95 (62.80–65.33) | 27 | 51.9% | -10.3% | -12.1% | -0.56% |  |
| p95+ (65.40–74.70) | 27 | 37.0% | -31.1% | -33.3% | -0.45% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 65 | 40.0% | -23.6% | -19.8% | -0.13% |  |
| 0.90-1.05 | 47 | 46.8% | -12.0% | -14.5% | 0.23% |  |
| 1.05-1.20 | 36 | 61.1% | 33.7% | 31.1% | 0.29% |  |
| 1.20-1.35 | 7 | 57.1% | 11.2% | -23.4% | -0.01% |  |
| 1.35-1.50 | 4 | 25.0% | -55.8% | -66.0% | 0.88% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.76) | 27 | 44.4% | -9.2% | 3.2% | 0.32% |  |
| 20-40% (0.77–0.94) | 27 | 51.9% | -0.2% | 28.5% | -0.53% |  |
| 40-60% (0.98–1.24) | 27 | 63.0% | 36.2% | -3.2% | 0.29% |  |
| 60-80% (1.24–1.52) | 27 | 29.6% | -45.1% | -37.1% | -0.07% |  |
| 80-95% (1.53–2.13) | 27 | 37.0% | -35.5% | -29.8% | -0.09% |  |
| 95%+ (2.17–4.76) | 27 | 55.6% | 11.0% | 3.8% | 0.56% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 14 | 35.7% | -20.2% | -26.7% | 0.45% | Broad support |
| 0.25-0.40 | 56 | 51.8% | 3.8% | -3.8% | 0.27% | Healthy support |
| 0.40-0.60 | 58 | 43.1% | -14.0% | -0.4% | -0.07% | Concentrated |
| 0.60-0.80 | 30 | 50.0% | -8.6% | -8.7% | -0.10% | Very concentrated |
| 0.80-1.00 | 4 | 50.0% | -4.8% | -49.1% | -0.36% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 25 | 36.0% | -32.0% | -30.0% | -0.24% | 3.9 |
| Broad battle | 101 | 48.5% | -1.1% | 3.0% | 0.18% | 3.9 |
| One-wallet nuke | 12 | 58.3% | 5.2% | 18.0% | -0.08% | 3.8 |
| Thin support | 64 | 50.0% | -6.0% | -2.9% | 0.02% | 3.5 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=170)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 9 | 44.4% | -13.8% | 5.1% | 0.41% | 4.3 | 66.7% |
| SMALL_MOVE | 27 | 33.3% | -36.8% | -39.4% | 0.24% | 3.9 | 100.0% |
| CLEAR_MOVE | 50 | 56.0% | 1.0% | 6.5% | -0.12% | 4.0 | 100.0% |
| NEAR_START | 84 | 47.6% | -0.1% | -3.1% | 0.11% | 3.5 | 100.0% |

**All Time** (n=732)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 526 | 53.6% | -5.3% | -4.6% | -0.49% | 3.2 | 2.7% |
| SMALL_MOVE | 30 | 33.3% | -36.6% | -41.9% | 0.44% | 4.0 | 90.0% |
| CLEAR_MOVE | 76 | 55.3% | 0.8% | 4.6% | -0.21% | 3.9 | 100.0% |
| NEAR_START | 100 | 48.0% | -2.0% | -5.1% | 0.15% | 3.6 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 6 / 50.0% / -2.1% | 8 / 37.5% / -42.3% | 22 / 59.1% / 4.4% | 17 / 58.8% / 25.3% |
| 3.5-4★ | 1 / 0.0% / -100.0% | 17 / 35.3% / -26.7% | 16 / 50.0% / -8.3% | 34 / 58.8% / 25.6% |
| 2.5-3★ | 2 / 50.0% / -5.8% | 1 / 0.0% / -100.0% | 12 / 58.3% / 7.0% | 33 / 30.3% / -39.6% |
| 1.0-2★ | — | 1 / 0.0% / -100.0% | — | — |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 167 | 47.3% | -7.0% | -5.8% | 3.8 | 0.07% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 217 | 48.4% | -6.7% | -5.4% | 3.8 | 0.03% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 269 | 100% |
| LOCKED (direct) | 58 | 21.6% |
| Promoted (SHADOW→LOCKED) | 111 | 41.3% |
| Rejected (stayed SHADOW) | 75 | 27.9% |
| Superseded (side flipped) | 20 | 7.4% |
| Muted | 116 | 43.1% |
| Cancelled | 13 | 4.8% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=170)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -10.64u | -4.8% | — |
| Flat 1.0u | -10.73u | -6.3% | +0.09u |
| Lock units only | -2.14u | — | -8.50u |
| Units change only on star change | -3.75u | — | -6.89u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 45 | 2.28 | -3.1% | 0.3% | +1.65u | Sizing helps |
| 4.5 | 8 | 1.94 | 39.2% | 34.8% | +2.27u | Sizing helps |
| 4 | 22 | 1.30 | 6.0% | -6.2% | -3.11u | Sizing hurts |
| 3.5 | 46 | 0.69 | 1.1% | 2.8% | +0.39u | Neutral |
| 3 | 21 | 1.05 | -26.4% | -28.3% | -0.67u | Sizing hurts |
| 2.5 | 27 | 0.76 | -28.8% | -39.6% | -0.34u | Neutral |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |

### All Time (n=732)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -55.52u | -5.1% | — |
| Flat 1.0u | -40.24u | -5.5% | -15.28u |
| Lock units only | -36.26u | — | -19.26u |
| Units change only on star change | -47.79u | — | -7.73u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 58 | 2.36 | -4.3% | -3.2% | -1.94u | Sizing hurts |
| 4.5 | 42 | 2.48 | -2.6% | -8.5% | -7.75u | Sizing hurts |
| 4 | 137 | 1.99 | -1.7% | -3.9% | -8.35u | Sizing hurts |
| 3.5 | 164 | 1.46 | 0.6% | 2.8% | +5.70u | Sizing helps |
| 3 | 181 | 1.19 | -14.5% | -12.6% | -0.82u | Sizing hurts |
| 2.5 | 134 | 0.74 | -6.4% | -6.2% | +2.37u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 170 | 52.9% | 47.6% | -5.3% | -6.3% | 0.08% | Below market |
| 4.5-5★ | 53 | 53.0% | 54.7% | +1.8% | 3.3% | 0.10% | Neutral |
| 3.5-4★ | 68 | 51.8% | 50.0% | -1.8% | 2.7% | 0.15% | Neutral |
| 2.5-3★ | 48 | 54.4% | 37.5% | -16.9% | -27.8% | -0.07% | Below market |
| CLEAR_MOVE only | 50 | 54.9% | 56.0% | +1.1% | 1.0% | -0.12% | Neutral |
| NO_MOVE only | 9 | 52.7% | 44.4% | -8.3% | -13.8% | 0.41% | Below market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=84)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 57.502 | 61.169 | 0.36 |  |
| Rank_norm | 64.627 | 65.372 | 0.05 |  |
| PnL_norm | 57.018 | 58.390 | 0.11 |  |
| WalletBase | 58.126 | 60.888 | 0.37 |  |
| SizeRatio | 1.588 | 1.366 | 0.14 |  |
| ConvictionMult | 0.965 | 0.944 | 0.13 |  |
| WalletCountFor | 3.531 | 3.357 | 0.10 |  |
| TopShare | 0.453 | 0.466 | 0.08 |  |
| ForSide | 201.265 | 194.129 | 0.06 |  |
| AgainstSide | 68.508 | 68.375 | 0.00 |  |
| NetEdge | 1.430 | 1.360 | 0.08 |  |
| WalletPlayScore | 2.266 | 2.084 | 0.09 |  |

### V8 Era (n=162)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 57.502 | 57.502 | 0.00 |  |
| Rank_norm | 64.627 | 64.627 | 0.00 |  |
| PnL_norm | 57.018 | 57.018 | 0.00 |  |
| WalletBase | 58.126 | 58.126 | 0.00 |  |
| SizeRatio | 1.588 | 1.588 | 0.00 |  |
| ConvictionMult | 0.965 | 0.965 | 0.00 |  |
| WalletCountFor | 3.531 | 3.531 | 0.00 |  |
| TopShare | 0.453 | 0.453 | 0.00 |  |
| ForSide | 201.265 | 201.265 | 0.00 |  |
| AgainstSide | 68.508 | 68.508 | 0.00 |  |
| NetEdge | 1.430 | 1.430 | 0.00 |  |
| WalletPlayScore | 2.266 | 2.266 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=170)

No major failure modes detected.

### 7-Day (n=84)

- **Concentration issue**: 20 high-concentration picks (TopShare>0.6) at -10.4% ROI

### All Time (n=732)

- **Sizing issue**: Model P/L (-55.52u) trails flat (-40.24u) by 15.28u
- **Environment issue**: 71.9% NO_MOVE (WR: 53.6%, ROI: -5.3%)


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
| V8 era picks | 170 |
| V8 flat ROI | -6.3% |
| V8 model ROI | -4.8% |
| V8 star monotonicity score | -0.67 |
| 4.5-5★ ROI | 3.3% |
| 2.5-3★ ROI | -27.8% |
| CLEAR_MOVE ROI | 1.0% |
| NO_MOVE ROI | -13.8% |
| Single-wallet play rate | 7.1% |
| Whale override win rate | — |
| Avg CLV by star bucket | 5★: 0.24% | 4.5★: -0.68% | 4★: 0.10% | 3.5★: 0.17% | 3★: -0.02% | 2.5★: -0.12% | 2★: 0.67% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=170)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 120 | 70.6% | 45.8% | -7.6% | -10.8% | 0.21% |
| MUTED | 43 | 25.3% | 48.8% | -7.6% | 9.5% | -0.41% |
| CANCELLED | 7 | 4.1% | 71.4% | 23.9% | 24.8% | 0.84% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| winners_below_floor | 13 | 38.5% |
| wps_flipped_diag | 11 | 36.4% |
| winners_faded | 10 | 70.0% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 7 | 57.1% |
| winners_killed | 5 | 80.0% |
| whitelist_fade_weak | 3 | 66.7% |
| opp_side_stronger_diag | 3 | 66.7% |
| sum_below_floor | 3 | 33.3% |
| whitelist_fade_strong | 2 | 50.0% |
| v73_hc_rescue | 2 | 0.0% |

### 7-Day (n=84)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 50 | 59.5% | 42.0% | -19.1% | -22.8% | 0.14% |
| MUTED | 29 | 34.5% | 51.7% | 1.3% | 24.9% | -0.57% |
| CANCELLED | 5 | 6.0% | 80.0% | 31.4% | 31.2% | 0.18% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| wps_flipped_diag | 10 | 30.0% |
| winners_faded | 10 | 70.0% |
| winners_below_floor | 10 | 40.0% |
| quality_below_floor | 6 | 50.0% |
| winners_killed | 5 | 80.0% |
| sum_below_floor | 3 | 33.3% |
| opp_side_stronger_diag | 2 | 50.0% |
| v73_hc_rescue | 2 | 0.0% |

### All Time (n=732)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 680 | 92.9% | 52.1% | -6.1% | -6.3% | -0.30% |
| MUTED | 43 | 5.9% | 48.8% | -7.6% | 9.5% | -0.41% |
| CANCELLED | 9 | 1.2% | 77.8% | 47.7% | 42.3% | -0.91% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| winners_below_floor | 13 | 38.5% |
| wps_flipped_diag | 11 | 36.4% |
| winners_faded | 10 | 70.0% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 7 | 57.1% |
| winners_killed | 5 | 80.0% |
| whitelist_fade_weak | 3 | 66.7% |
| opp_side_stronger_diag | 3 | 66.7% |
| sum_below_floor | 3 | 33.3% |
| opposition_building | 2 | 100.0% |
| mid_tier_or_lower | 2 | 100.0% |
| whitelist_fade_strong | 2 | 50.0% |
| v73_hc_rescue | 2 | 0.0% |
