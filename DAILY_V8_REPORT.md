# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-05-17 ET
**Completed Picks**: 832 | **V8 Era Picks**: 270 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 2.5★ WR (44.1%) beats 3★ (36.4%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 21 | 42.9% | -3.44u | -16.4% | -14.98u | -34.8% | 0.68% | -1.50% | Cold streak |
| 7-Day | 61 | 52.5% | -0.47u | -0.8% | -6.06u | -4.4% | 0.28% | -0.65% |  |
| 14-Day | 98 | 54.1% | 1.57u | 1.6% | 4.23u | 2.1% | -0.16% | -0.42% |  |
| 30-Day | 281 | 49.1% | -14.56u | -5.2% | -15.49u | -3.5% | -0.01% | -0.40% |  |
| V8 Era | 270 | 50.0% | -9.24u | -3.4% | -8.34u | -2.0% | -0.01% | -0.41% |  |
| All Time | 832 | 52.4% | -38.76u | -4.7% | -53.22u | -4.1% | -0.30% | -0.09% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=270)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 76 | 53.7% | 53.7% | 53.9% | +0.3% | -1.7% | 1.4% | 2.74 | 0.28% | Fair |
| 4.5 | 23 | 51.3% | 51.3% | 56.5% | +5.2% | 14.0% | 6.6% | 2.63 | -0.78% | Strong |
| 4 | 43 | 53.0% | 53.0% | 48.8% | -4.2% | -7.0% | -10.0% | 1.27 | 0.22% | Weak |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 22 | 55.2% | 55.2% | 36.4% | -18.9% | -29.7% | -32.2% | 1.05 | -0.02% | Failing |
| 2.5 | 34 | 52.7% | 52.7% | 44.1% | -8.6% | -13.4% | -27.7% | 0.68 | -0.25% | Weak |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 53.9% | 56.5% | -2.6% | Flat |
| 4.5★ vs 4★ | 56.5% | 48.8% | +7.7% | Correct |
| 4★ vs 3.5★ | 48.8% | 51.5% | -2.7% | Flat |
| 3.5★ vs 3★ | 51.5% | 36.4% | +15.1% | Correct |
| 3★ vs 2.5★ | 36.4% | 44.1% | -7.7% | INVERTED |
| 2.5★ vs 2★ | 44.1% | 0.0% | +44.1% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.893 |
| Spearman: Stars vs Flat ROI | 0.786 |
| Spearman: Stars vs CLV | -0.143 |
| Brier Score | 0.2479 |
| Monotonicity Score | 0.00 |

### All Time (n=832)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 89 | 54.4% | 54.4% | 53.9% | -0.5% | -2.7% | -0.8% | 2.73 | 0.36% | Fair |
| 4.5 | 57 | 55.1% | 55.1% | 52.6% | -2.5% | -1.7% | -6.9% | 2.62 | 0.53% | Fair |
| 4 | 158 | 55.2% | 55.2% | 52.5% | -2.6% | -4.3% | -4.8% | 1.89 | -0.45% | Fair |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 182 | 55.2% | 55.2% | 47.3% | -7.9% | -15.0% | -13.1% | 1.19 | -0.54% | Failing |
| 2.5 | 141 | 54.0% | 54.0% | 52.5% | -1.6% | -3.8% | -4.4% | 0.72 | -0.67% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 53.9% | 52.6% | +1.3% | Correct |
| 4.5★ vs 4★ | 52.6% | 52.5% | +0.1% | Correct |
| 4★ vs 3.5★ | 52.5% | 56.5% | -4.0% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 47.3% | +9.2% | Correct |
| 3★ vs 2.5★ | 47.3% | 52.5% | -5.2% | INVERTED |
| 2.5★ vs 2★ | 52.5% | 0.0% | +52.5% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.643 |
| Spearman: Stars vs Flat ROI | 0.607 |
| Spearman: Stars vs CLV | 0.179 |
| Brier Score | 0.2341 |
| Monotonicity Score | -0.33 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.026 | 0.002 | Monitor |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.056 | -0.053 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.076 | -0.081 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.088 | -0.066 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | 0.185 | 0.179 | Keep |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | 0.221 | 0.225 | Keep |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | 0.080 | 0.091 | Keep |
| ForSide | Side support | Total wallet force on side | Higher → better | 0.003 | 0.047 | Monitor |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.043 | 0.089 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | 0.023 | 0.017 | Monitor |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.117 | 0.123 | Keep |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.051 | -0.023 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.066 | -0.006 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.006 | 0.038 | Monitor |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (21.47–48.10) | 43 | 46.5% | -11.4% | 0.7% | -0.29% |  |
| p20-40 (48.15–52.21) | 44 | 56.8% | 7.3% | 15.9% | 0.40% |  |
| p40-60 (52.28–56.56) | 44 | 56.8% | 22.3% | 14.7% | 0.21% |  |
| p60-80 (56.62–62.08) | 43 | 41.9% | -16.5% | -16.1% | 0.38% |  |
| p80-95 (62.10–65.60) | 44 | 47.7% | -16.5% | -20.9% | -0.38% |  |
| p95+ (65.66–83.30) | 44 | 47.7% | -8.7% | -15.1% | -0.39% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 83 | 41.0% | -22.7% | -11.2% | -0.12% |  |
| 0.90-1.05 | 91 | 42.9% | -19.2% | -23.4% | 0.02% |  |
| 1.05-1.20 | 60 | 70.0% | 42.1% | 45.0% | 0.24% |  |
| 1.20-1.35 | 16 | 56.3% | 7.8% | -13.2% | -0.16% |  |
| 1.35-1.50 | 8 | 50.0% | 0.6% | -40.8% | -0.46% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.70) | 39 | 46.2% | -10.0% | -7.7% | -0.27% |  |
| 20-40% (0.71–0.93) | 40 | 47.5% | -9.0% | 10.6% | -0.55% |  |
| 40-60% (0.94–1.24) | 40 | 62.5% | 28.2% | -3.8% | 0.27% |  |
| 60-80% (1.24–1.53) | 39 | 35.9% | -32.0% | -23.5% | 0.31% |  |
| 80-95% (1.53–2.07) | 40 | 47.5% | -11.4% | 7.9% | -0.03% |  |
| 95%+ (2.11–4.76) | 40 | 52.5% | 1.7% | -6.3% | 0.32% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 19 | 42.1% | -15.4% | -28.0% | 0.49% | Broad support |
| 0.25-0.40 | 76 | 52.6% | 3.6% | 2.6% | 0.23% | Healthy support |
| 0.40-0.60 | 79 | 44.3% | -12.1% | 4.6% | 0.06% | Concentrated |
| 0.60-0.80 | 44 | 54.5% | 0.3% | -6.1% | -0.25% | Very concentrated |
| 0.80-1.00 | 20 | 45.0% | -15.1% | -37.2% | -0.96% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 37 | 40.5% | -22.4% | -13.8% | -0.04% | 4.2 |
| Broad battle | 135 | 48.1% | -3.7% | 0.5% | 0.01% | 3.9 |
| One-wallet nuke | 52 | 53.8% | 0.7% | -1.9% | -0.46% | 3.7 |
| Thin support | 121 | 51.2% | -3.9% | -7.6% | -0.15% | 3.6 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=270)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 11 | 45.5% | -18.7% | 4.1% | 0.26% | 4.3 | 72.7% |
| SMALL_MOVE | 45 | 40.0% | -24.2% | -30.1% | 0.14% | 4.0 | 100.0% |
| CLEAR_MOVE | 74 | 59.5% | 8.2% | 18.5% | -0.03% | 4.1 | 100.0% |
| NEAR_START | 116 | 46.6% | -4.2% | -8.0% | -0.05% | 3.7 | 100.0% |

**All Time** (n=832)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 528 | 53.6% | -5.4% | -4.6% | -0.49% | 3.2 | 3.0% |
| SMALL_MOVE | 48 | 39.6% | -24.9% | -32.6% | 0.27% | 4.0 | 93.8% |
| CLEAR_MOVE | 100 | 58.0% | 6.2% | 13.8% | -0.12% | 4.0 | 100.0% |
| NEAR_START | 132 | 47.0% | -5.2% | -8.5% | -0.01% | 3.7 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 7 / 57.1% / 0.8% | 15 / 33.3% / -48.1% | 32 / 68.8% / 24.9% | 38 / 50.0% / 2.7% |
| 3.5-4★ | 2 / 0.0% / -100.0% | 26 / 42.3% / -15.0% | 29 / 48.3% / -12.8% | 39 / 59.0% / 23.6% |
| 2.5-3★ | 2 / 50.0% / -5.8% | 3 / 66.7% / 40.6% | 13 / 61.5% / 13.9% | 38 / 31.6% / -37.3% |
| 1.0-2★ | — | 1 / 0.0% / -100.0% | — | 1 / 0.0% / -100.0% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 267 | 49.8% | -3.8% | -2.4% | 3.9 | -0.02% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 317 | 50.2% | -4.1% | -2.8% | 3.9 | -0.03% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 430 | 100% |
| LOCKED (direct) | 65 | 15.1% |
| Promoted (SHADOW→LOCKED) | 218 | 50.7% |
| Rejected (stayed SHADOW) | 106 | 24.7% |
| Superseded (side flipped) | 36 | 8.4% |
| Muted | 190 | 44.2% |
| Cancelled | 20 | 4.7% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=270)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -8.34u | -2.0% | — |
| Flat 1.0u | -9.24u | -3.4% | +0.90u |
| Lock units only | -2.20u | — | -6.14u |
| Units change only on star change | 4.58u | — | -12.92u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 76 | 2.74 | -1.7% | 1.4% | +4.17u | Sizing helps |
| 4.5 | 23 | 2.63 | 14.0% | 6.6% | +0.78u | Sizing helps |
| 4 | 43 | 1.27 | -7.0% | -10.0% | -2.47u | Sizing hurts |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 22 | 1.05 | -29.7% | -32.2% | -0.92u | Sizing hurts |
| 2.5 | 34 | 0.68 | -13.4% | -27.7% | -1.85u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |

### All Time (n=832)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -53.22u | -4.1% | — |
| Flat 1.0u | -38.76u | -4.7% | -14.46u |
| Lock units only | -36.32u | — | -16.90u |
| Units change only on star change | -39.46u | — | -13.76u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 89 | 2.73 | -2.7% | -0.8% | +0.57u | Sizing helps |
| 4.5 | 57 | 2.62 | -1.7% | -6.9% | -9.24u | Sizing hurts |
| 4 | 158 | 1.89 | -4.3% | -4.8% | -7.71u | Sizing hurts |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 182 | 1.19 | -15.0% | -13.1% | -1.07u | Sizing hurts |
| 2.5 | 141 | 0.72 | -3.8% | -4.4% | +0.87u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 270 | 52.8% | 50.0% | -2.8% | -3.4% | -0.01% | Below market |
| 4.5-5★ | 99 | 53.1% | 54.5% | +1.4% | 1.9% | 0.03% | Neutral |
| 3.5-4★ | 111 | 51.9% | 50.5% | -1.5% | 0.2% | 0.04% | Neutral |
| 2.5-3★ | 58 | 53.7% | 43.1% | -10.6% | -16.2% | -0.18% | Below market |
| CLEAR_MOVE only | 74 | 54.2% | 59.5% | +5.3% | 8.2% | -0.03% | Beating market |
| NO_MOVE only | 11 | 55.7% | 45.5% | -10.2% | -18.7% | 0.26% | Below market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=41)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 56.373 | 48.816 | 0.69 |  |
| Rank_norm | 64.109 | 67.182 | 0.18 |  |
| PnL_norm | 55.115 | 46.734 | 0.53 |  |
| WalletBase | 56.937 | 49.262 | 0.78 |  |
| SizeRatio | 1.685 | 1.569 | 0.07 |  |
| ConvictionMult | 0.990 | 1.009 | 0.11 |  |
| WalletCountFor | 3.433 | 3.683 | 0.14 |  |
| TopShare | 0.490 | 0.510 | 0.10 |  |
| ForSide | 193.240 | 182.495 | 0.10 |  |
| AgainstSide | 63.537 | 56.300 | 0.08 |  |
| NetEdge | 1.392 | 1.346 | 0.05 |  |
| WalletPlayScore | 2.023 | 1.971 | 0.02 |  |

### V8 Era (n=238)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 56.373 | 56.618 | 0.02 |  |
| Rank_norm | 64.109 | 65.016 | 0.05 |  |
| PnL_norm | 55.115 | 55.259 | 0.01 |  |
| WalletBase | 56.937 | 56.994 | 0.01 |  |
| SizeRatio | 1.685 | 1.605 | 0.05 |  |
| ConvictionMult | 0.990 | 0.984 | 0.04 |  |
| WalletCountFor | 3.433 | 3.433 | 0.00 |  |
| TopShare | 0.490 | 0.490 | 0.00 |  |
| ForSide | 193.240 | 193.240 | 0.00 |  |
| AgainstSide | 63.537 | 63.537 | 0.00 |  |
| NetEdge | 1.392 | 1.392 | 0.00 |  |
| WalletPlayScore | 2.023 | 2.023 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=270)

- **Gate issue**: NO_MOVE ROI (-18.7%) significantly trails CLEAR_MOVE (8.2%)

### 7-Day (n=61)

- **Ranking issue**: ≤3★ WR (60%) beats ≥4★ (48%)
- **Sizing issue**: Model P/L (-6.06u) trails flat (-0.47u) by 5.59u
- **Concentration issue**: 13 high-concentration picks (TopShare>0.6) at -16.0% ROI

### All Time (n=832)

- **Sizing issue**: Model P/L (-53.22u) trails flat (-38.76u) by 14.46u
- **Environment issue**: 63.5% NO_MOVE (WR: 53.6%, ROI: -5.4%)


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
| V8 era picks | 270 |
| V8 flat ROI | -3.4% |
| V8 model ROI | -2.0% |
| V8 star monotonicity score | 0.00 |
| 4.5-5★ ROI | 1.9% |
| 2.5-3★ ROI | -16.2% |
| CLEAR_MOVE ROI | 8.2% |
| NO_MOVE ROI | -18.7% |
| Single-wallet play rate | 18.9% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: 0.28% | 4.5★: -0.78% | 4★: 0.22% | 3.5★: -0.07% | 3★: -0.02% | 2.5★: -0.25% | 2★: 0.67% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=270)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 194 | 71.9% | 47.9% | -4.8% | -8.0% | 0.00% |
| MUTED | 65 | 24.1% | 55.4% | 0.5% | 17.9% | -0.08% |
| CANCELLED | 11 | 4.1% | 54.5% | -2.8% | -10.4% | 0.16% |

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
| dw1_no_ags_support | 1 | 100.0% |

### 7-Day (n=61)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 44 | 72.1% | 45.5% | -10.2% | -20.7% | -0.02% |
| MUTED | 15 | 24.6% | 73.3% | 26.7% | 30.0% | 0.98% |
| CANCELLED | 2 | 3.3% | 50.0% | 1.0% | 21.3% | 1.56% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| ags_quality_veto | 13 | 69.2% |
| v73_hc_rescue | 6 | 83.3% |
| winners_killed | 2 | 50.0% |
| opp_side_stronger_diag | 2 | 100.0% |
| winners_faded | 1 | 100.0% |
| wps_flipped_diag | 1 | 100.0% |
| dw1_no_ags_support | 1 | 100.0% |

### All Time (n=832)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 754 | 90.6% | 52.0% | -5.5% | -6.1% | -0.30% |
| MUTED | 65 | 7.8% | 55.4% | 0.5% | 17.9% | -0.08% |
| CANCELLED | 13 | 1.6% | 61.5% | 17.8% | 4.8% | -0.95% |

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
| dw1_no_ags_support | 1 | 100.0% |
