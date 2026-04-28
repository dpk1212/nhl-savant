# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-04-28 ET
**Completed Picks**: 692 | **V8 Era Picks**: 130 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (62.5%) beats 5★ (55.6%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 44 | 50.0% | -3.40u | -7.7% | -5.64u | -9.4% | -0.08% | -0.10% |  |
| 7-Day | 94 | 46.8% | -7.64u | -8.1% | -11.42u | -8.7% | 0.21% | -0.39% |  |
| 14-Day | 201 | 46.3% | -20.96u | -10.4% | -28.48u | -10.0% | 0.22% | -0.46% |  |
| 30-Day | 620 | 51.8% | -42.48u | -6.9% | -61.16u | -6.7% | -0.33% | -0.06% |  |
| V8 Era | 130 | 48.5% | -6.54u | -5.0% | -8.48u | -5.0% | 0.14% | -0.42% |  |
| All Time | 692 | 52.6% | -36.06u | -5.2% | -53.36u | -5.1% | -0.33% | -0.05% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=130)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 27 | 55.4% | 55.4% | 55.6% | +0.2% | -3.7% | -1.8% | 2.39 | 0.55% | Fair |
| 4.5 | 8 | 50.4% | 50.4% | 62.5% | +12.1% | 39.2% | 34.8% | 1.94 | -0.68% | Strong |
| 4 | 18 | 55.0% | 55.0% | 50.0% | -5.0% | -8.2% | -6.4% | 1.34 | 0.27% | Weak |
| 3.5 | 33 | 49.6% | 49.6% | 51.5% | +2.0% | 12.2% | 8.7% | 0.78 | 0.05% | Strong |
| 3 | 21 | 55.6% | 55.6% | 38.1% | -17.6% | -26.4% | -28.3% | 1.05 | -0.02% | Failing |
| 2.5 | 22 | 53.5% | 53.5% | 40.9% | -12.6% | -21.4% | -34.9% | 0.80 | 0.09% | Failing |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 55.6% | 62.5% | -6.9% | INVERTED |
| 4.5★ vs 4★ | 62.5% | 50.0% | +12.5% | Correct |
| 4★ vs 3.5★ | 50.0% | 51.5% | -1.5% | Flat |
| 3.5★ vs 3★ | 51.5% | 38.1% | +13.4% | Correct |
| 3★ vs 2.5★ | 38.1% | 40.9% | -2.8% | Flat |
| 2.5★ vs 2★ | 40.9% | 0.0% | +40.9% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.893 |
| Spearman: Stars vs Flat ROI | 0.786 |
| Spearman: Stars vs CLV | -0.214 |
| Brier Score | 0.2543 |
| Monotonicity Score | 0.00 |

### All Time (n=692)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 40 | 56.4% | 56.4% | 55.0% | -1.4% | -5.4% | -5.9% | 2.48 | 0.65% | Weak |
| 4.5 | 42 | 56.3% | 56.3% | 52.4% | -3.9% | -2.6% | -8.5% | 2.48 | 1.08% | Fair |
| 4 | 133 | 55.8% | 55.8% | 53.4% | -2.4% | -3.9% | -3.9% | 2.02 | -0.58% | Fair |
| 3.5 | 151 | 55.2% | 55.2% | 57.6% | +2.4% | 3.0% | 3.5% | 1.55 | -0.27% | Fair |
| 3 | 181 | 55.2% | 55.2% | 47.5% | -7.7% | -14.5% | -12.6% | 1.19 | -0.54% | Weak |
| 2.5 | 129 | 54.3% | 54.3% | 52.7% | -1.6% | -4.2% | -4.3% | 0.74 | -0.66% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 55.0% | 52.4% | +2.6% | Correct |
| 4.5★ vs 4★ | 52.4% | 53.4% | -1.0% | Flat |
| 4★ vs 3.5★ | 53.4% | 57.6% | -4.2% | INVERTED |
| 3.5★ vs 3★ | 57.6% | 47.5% | +10.1% | Correct |
| 3★ vs 2.5★ | 47.5% | 52.7% | -5.2% | INVERTED |
| 2.5★ vs 2★ | 52.7% | 0.0% | +52.7% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.571 |
| Spearman: Stars vs Flat ROI | 0.464 |
| Spearman: Stars vs CLV | 0.286 |
| Brier Score | 0.2325 |
| Monotonicity Score | 0.00 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | 0.183 | 0.155 | Keep |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.016 | -0.043 | Monitor |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | 0.022 | -0.035 | Monitor |
| WalletBase | Wallet quality | Composite skill score | Higher → better | 0.109 | 0.061 | Keep |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | 0.113 | 0.116 | Keep |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | 0.145 | 0.153 | Keep |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | 0.182 | 0.144 | Keep |
| ForSide | Side support | Total wallet force on side | Higher → better | 0.063 | 0.093 | Keep |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.103 | 0.108 | Tune |
| NetEdge | Core side edge | For minus discounted against | Higher → better | 0.047 | 0.047 | Keep |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.127 | 0.133 | Keep |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | -0.017 | -0.093 | Monitor |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | -0.013 | -0.084 | Monitor |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | 0.047 | 0.091 | Keep |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (37.88–49.40) | 20 | 45.0% | -4.2% | 1.5% | 0.16% |  |
| p20-40 (49.60–53.07) | 20 | 40.0% | -30.2% | -12.5% | 0.50% |  |
| p40-60 (53.18–57.23) | 21 | 52.4% | 23.3% | -1.2% | -0.01% |  |
| p60-80 (57.33–62.35) | 20 | 50.0% | -1.4% | 8.4% | 0.83% |  |
| p80-95 (62.76–65.40) | 20 | 50.0% | -13.5% | -22.7% | -0.38% |  |
| p95+ (65.60–74.70) | 21 | 47.6% | -11.4% | -21.5% | -0.18% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 45 | 40.0% | -22.7% | -22.0% | -0.11% |  |
| 0.90-1.05 | 36 | 47.2% | -11.8% | -12.3% | 0.14% |  |
| 1.05-1.20 | 29 | 58.6% | 27.0% | 23.1% | 0.43% |  |
| 1.20-1.35 | 7 | 57.1% | 11.2% | -23.4% | -0.01% |  |
| 1.35-1.50 | 4 | 25.0% | -55.8% | -66.0% | 0.88% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.76) | 20 | 40.0% | -24.0% | -22.1% | 0.60% |  |
| 20-40% (0.77–0.98) | 20 | 55.0% | 7.5% | 30.9% | -0.56% |  |
| 40-60% (1.00–1.25) | 21 | 47.6% | 16.7% | -24.8% | 0.07% |  |
| 60-80% (1.26–1.58) | 20 | 45.0% | -22.2% | -5.6% | 0.30% |  |
| 80-95% (1.58–2.22) | 20 | 50.0% | -9.4% | -7.2% | 0.04% |  |
| 95%+ (2.39–4.76) | 21 | 47.6% | -5.8% | -13.7% | 0.44% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 9 | 44.4% | 2.5% | -8.1% | 0.74% | Broad support |
| 0.25-0.40 | 44 | 54.5% | 8.4% | -1.1% | 0.37% | Healthy support |
| 0.40-0.60 | 41 | 41.5% | -17.2% | -10.0% | -0.01% | Concentrated |
| 0.60-0.80 | 25 | 48.0% | -12.5% | -17.6% | -0.19% | Very concentrated |
| 0.80-1.00 | 3 | 33.3% | -36.6% | -59.6% | 0.07% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 19 | 42.1% | -20.8% | -14.7% | -0.14% | 3.7 |
| Broad battle | 76 | 50.0% | 1.8% | 0.1% | 0.30% | 3.7 |
| One-wallet nuke | 11 | 54.5% | -2.5% | 18.5% | 0.06% | 3.9 |
| Thin support | 49 | 49.0% | -9.2% | -6.9% | 0.06% | 3.5 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=130)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 7 | 42.9% | -14.9% | -8.3% | 0.46% | 4.3 | 57.1% |
| SMALL_MOVE | 20 | 30.0% | -45.2% | -40.4% | 0.39% | 3.9 | 100.0% |
| CLEAR_MOVE | 36 | 61.1% | 7.1% | 17.3% | 0.01% | 3.9 | 100.0% |
| NEAR_START | 67 | 47.8% | 1.5% | -9.4% | 0.10% | 3.5 | 100.0% |

**All Time** (n=692)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 524 | 53.6% | -5.3% | -4.9% | -0.50% | 3.2 | 2.3% |
| SMALL_MOVE | 23 | 30.4% | -43.8% | -43.5% | 0.62% | 3.9 | 87.0% |
| CLEAR_MOVE | 62 | 58.1% | 4.3% | 9.9% | -0.16% | 3.9 | 100.0% |
| NEAR_START | 83 | 48.2% | -1.1% | -10.0% | 0.15% | 3.5 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 5 / 40.0% / -18.6% | 5 / 40.0% / -33.3% | 14 / 71.4% / 20.1% | 11 / 54.5% / 17.4% |
| 3.5-4★ | — | 13 / 30.8% / -41.3% | 11 / 54.5% / -1.6% | 27 / 59.3% / 30.0% |
| 2.5-3★ | 2 / 50.0% / -5.8% | 1 / 0.0% / -100.0% | 11 / 54.5% / -0.6% | 29 / 34.5% / -31.2% |
| 1.0-2★ | — | 1 / 0.0% / -100.0% | — | — |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 127 | 48.0% | -5.9% | -6.3% | 3.7 | 0.13% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 177 | 49.2% | -5.8% | -5.6% | 3.7 | 0.07% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 178 | 100% |
| LOCKED (direct) | 58 | 32.6% |
| Promoted (SHADOW→LOCKED) | 73 | 41.0% |
| Rejected (stayed SHADOW) | 33 | 18.5% |
| Superseded (side flipped) | 9 | 5.1% |
| Muted | 60 | 33.7% |
| Cancelled | 8 | 4.5% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=130)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -8.48u | -5.0% | — |
| Flat 1.0u | -6.54u | -5.0% | -1.94u |
| Lock units only | -6.11u | — | -2.37u |
| Units change only on star change | -6.46u | — | -2.02u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 27 | 2.39 | -3.7% | -1.8% | -0.14u | Neutral |
| 4.5 | 8 | 1.94 | 39.2% | 34.8% | +2.27u | Sizing helps |
| 4 | 18 | 1.34 | -8.2% | -6.4% | -0.08u | Neutral |
| 3.5 | 33 | 0.78 | 12.2% | 8.7% | -1.79u | Sizing hurts |
| 3 | 21 | 1.05 | -26.4% | -28.3% | -0.67u | Sizing hurts |
| 2.5 | 22 | 0.80 | -21.4% | -34.9% | -1.43u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |

### All Time (n=692)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -53.36u | -5.1% | — |
| Flat 1.0u | -36.06u | -5.2% | -17.30u |
| Lock units only | -40.22u | — | -13.14u |
| Units change only on star change | -50.51u | — | -2.85u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 40 | 2.48 | -5.4% | -5.9% | -3.73u | Sizing hurts |
| 4.5 | 42 | 2.48 | -2.6% | -8.5% | -7.75u | Sizing hurts |
| 4 | 133 | 2.02 | -3.9% | -3.9% | -5.32u | Sizing hurts |
| 3.5 | 151 | 1.55 | 3.0% | 3.5% | +3.52u | Sizing helps |
| 3 | 181 | 1.19 | -14.5% | -12.6% | -0.82u | Sizing hurts |
| 2.5 | 129 | 0.74 | -4.2% | -4.3% | +1.28u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 130 | 53.3% | 48.5% | -4.8% | -5.0% | 0.14% | Below market |
| 4.5-5★ | 35 | 54.3% | 57.1% | +2.9% | 6.1% | 0.27% | Beating market |
| 3.5-4★ | 51 | 51.5% | 51.0% | -0.5% | 5.0% | 0.13% | Neutral |
| 2.5-3★ | 43 | 54.6% | 39.5% | -15.0% | -23.8% | 0.04% | Below market |
| CLEAR_MOVE only | 36 | 55.4% | 61.1% | +5.7% | 7.1% | 0.01% | Beating market |
| NO_MOVE only | 7 | 52.4% | 42.9% | -9.6% | -14.9% | 0.46% | Below market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=91)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 56.479 | 57.533 | 0.10 |  |
| Rank_norm | 64.964 | 66.449 | 0.10 |  |
| PnL_norm | 57.777 | 58.838 | 0.08 |  |
| WalletBase | 57.634 | 58.794 | 0.15 |  |
| SizeRatio | 1.775 | 1.747 | 0.02 |  |
| ConvictionMult | 0.985 | 0.989 | 0.02 |  |
| WalletCountFor | 3.541 | 3.484 | 0.03 |  |
| TopShare | 0.455 | 0.462 | 0.04 |  |
| ForSide | 204.622 | 207.718 | 0.03 |  |
| AgainstSide | 67.293 | 68.980 | 0.02 |  |
| NetEdge | 1.474 | 1.491 | 0.02 |  |
| WalletPlayScore | 2.307 | 2.283 | 0.01 |  |

### V8 Era (n=122)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 56.479 | 56.479 | 0.00 |  |
| Rank_norm | 64.964 | 64.964 | 0.00 |  |
| PnL_norm | 57.777 | 57.777 | 0.00 |  |
| WalletBase | 57.634 | 57.634 | 0.00 |  |
| SizeRatio | 1.775 | 1.775 | 0.00 |  |
| ConvictionMult | 0.985 | 0.985 | 0.00 |  |
| WalletCountFor | 3.541 | 3.541 | 0.00 |  |
| TopShare | 0.455 | 0.455 | 0.00 |  |
| ForSide | 204.622 | 204.622 | 0.00 |  |
| AgainstSide | 67.293 | 67.293 | 0.00 |  |
| NetEdge | 1.474 | 1.474 | 0.00 |  |
| WalletPlayScore | 2.307 | 2.307 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=130)

- **Sizing issue**: Model P/L (-8.48u) trails flat (-6.54u) by 1.94u
- **Concentration issue**: 28 high-concentration picks (TopShare>0.6) at -15.1% ROI
- **Gate issue**: NO_MOVE ROI (-14.9%) significantly trails CLEAR_MOVE (7.1%)

### 7-Day (n=94)

- **Sizing issue**: Model P/L (-11.42u) trails flat (-7.64u) by 3.78u
- **Concentration issue**: 22 high-concentration picks (TopShare>0.6) at -36.9% ROI

### All Time (n=692)

- **Sizing issue**: Model P/L (-53.36u) trails flat (-36.06u) by 17.30u
- **Environment issue**: 75.7% NO_MOVE (WR: 53.6%, ROI: -5.3%)
- **Concentration issue**: 28 high-concentration picks (TopShare>0.6) at -15.1% ROI


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
| V8 era picks | 130 |
| V8 flat ROI | -5.0% |
| V8 model ROI | -5.0% |
| V8 star monotonicity score | 0.00 |
| 4.5-5★ ROI | 6.1% |
| 2.5-3★ ROI | -23.8% |
| CLEAR_MOVE ROI | 7.1% |
| NO_MOVE ROI | -14.9% |
| Single-wallet play rate | 8.5% |
| Whale override win rate | — |
| Avg CLV by star bucket | 5★: 0.55% | 4.5★: -0.68% | 4★: 0.27% | 3.5★: 0.05% | 3★: -0.02% | 2.5★: 0.09% | 2★: 0.67% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=130)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 93 | 71.5% | 46.2% | -6.6% | -10.0% | 0.23% |
| MUTED | 30 | 23.1% | 50.0% | -7.0% | 4.7% | -0.27% |
| CANCELLED | 7 | 5.4% | 71.4% | 23.9% | 24.8% | 0.84% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| winners_below_floor | 8 | 50.0% |
| below_lock_range | 7 | 28.6% |
| wps_flipped_diag | 7 | 42.9% |
| winners_faded | 7 | 57.1% |
| winners_killed | 5 | 80.0% |
| quality_below_floor | 4 | 75.0% |
| whitelist_fade_weak | 3 | 66.7% |
| whitelist_fade_strong | 2 | 50.0% |
| opp_side_stronger_diag | 1 | 100.0% |
| sum_below_floor | 1 | 0.0% |

### 7-Day (n=94)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 59 | 62.8% | 42.4% | -13.6% | -18.7% | 0.35% |
| MUTED | 28 | 29.8% | 50.0% | -4.6% | 7.7% | -0.24% |
| CANCELLED | 7 | 7.4% | 71.4% | 23.9% | 24.8% | 0.84% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| winners_below_floor | 8 | 50.0% |
| wps_flipped_diag | 7 | 42.9% |
| winners_faded | 7 | 57.1% |
| below_lock_range | 5 | 20.0% |
| winners_killed | 5 | 80.0% |
| quality_below_floor | 4 | 75.0% |
| whitelist_fade_weak | 3 | 66.7% |
| whitelist_fade_strong | 2 | 50.0% |
| opp_side_stronger_diag | 1 | 100.0% |
| sum_below_floor | 1 | 0.0% |

### All Time (n=692)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 653 | 94.4% | 52.4% | -5.9% | -6.0% | -0.32% |
| MUTED | 30 | 4.3% | 50.0% | -7.0% | 4.7% | -0.27% |
| CANCELLED | 9 | 1.3% | 77.8% | 47.7% | 42.3% | -0.91% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| winners_below_floor | 8 | 50.0% |
| below_lock_range | 7 | 28.6% |
| wps_flipped_diag | 7 | 42.9% |
| winners_faded | 7 | 57.1% |
| winners_killed | 5 | 80.0% |
| quality_below_floor | 4 | 75.0% |
| whitelist_fade_weak | 3 | 66.7% |
| opposition_building | 2 | 100.0% |
| mid_tier_or_lower | 2 | 100.0% |
| whitelist_fade_strong | 2 | 50.0% |
| opp_side_stronger_diag | 1 | 100.0% |
| sum_below_floor | 1 | 0.0% |
