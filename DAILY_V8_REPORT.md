# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-04-26 ET
**Completed Picks**: 658 | **V8 Era Picks**: 96 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (62.5%) beats 5★ (53.3%) |
| Star inversion | ⚠️ | 3.5★ WR (55.6%) beats 4★ (36.4%) |
| Model P/L vs flat P/L | ⚠️ | Model trails flat by 2.8u — sizing amplifying losses |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 33 | 45.5% | -3.63u | -11.0% | -4.32u | -8.3% | 0.70% | -0.42% |  |
| 7-Day | 84 | 45.2% | -5.97u | -7.1% | -12.80u | -11.6% | 0.31% | -0.46% |  |
| 14-Day | 247 | 47.0% | -26.46u | -10.7% | -39.64u | -11.3% | 0.01% | -0.34% |  |
| 30-Day | 627 | 51.8% | -45.53u | -7.3% | -65.38u | -7.0% | -0.33% | -0.07% |  |
| V8 Era | 96 | 45.8% | -7.32u | -7.6% | -10.13u | -8.0% | 0.30% | -0.52% |  |
| All Time | 658 | 52.4% | -36.84u | -5.6% | -55.01u | -5.5% | -0.33% | -0.05% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=96)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 15 | 54.8% | 54.8% | 53.3% | -1.5% | -6.2% | -4.6% | 2.37 | 1.14% | Weak |
| 4.5 | 8 | 50.4% | 50.4% | 62.5% | +12.1% | 39.2% | 34.8% | 1.94 | -0.68% | Strong |
| 4 | 11 | 53.5% | 53.5% | 36.4% | -17.1% | -30.1% | -18.8% | 1.63 | 0.65% | Failing |
| 3.5 | 18 | 48.0% | 48.0% | 55.6% | +7.5% | 27.9% | 17.7% | 0.92 | 0.40% | Strong |
| 3 | 21 | 55.6% | 55.6% | 38.1% | -17.6% | -26.4% | -28.3% | 1.05 | -0.02% | Failing |
| 2.5 | 22 | 53.5% | 53.5% | 40.9% | -12.6% | -21.4% | -34.9% | 0.80 | 0.09% | Failing |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 53.3% | 62.5% | -9.2% | INVERTED |
| 4.5★ vs 4★ | 62.5% | 36.4% | +26.1% | Correct |
| 4★ vs 3.5★ | 36.4% | 55.6% | -19.2% | INVERTED |
| 3.5★ vs 3★ | 55.6% | 38.1% | +17.5% | Correct |
| 3★ vs 2.5★ | 38.1% | 40.9% | -2.8% | Flat |
| 2.5★ vs 2★ | 40.9% | 0.0% | +40.9% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.607 |
| Spearman: Stars vs Flat ROI | 0.607 |
| Spearman: Stars vs CLV | 0.071 |
| Brier Score | 0.2625 |
| Monotonicity Score | 0.00 |

### All Time (n=658)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 28 | 56.6% | 56.6% | 53.6% | -3.0% | -7.4% | -9.1% | 2.50 | 1.03% | Weak |
| 4.5 | 42 | 56.3% | 56.3% | 52.4% | -3.9% | -2.6% | -8.5% | 2.48 | 1.08% | Fair |
| 4 | 126 | 55.8% | 55.8% | 52.4% | -3.4% | -5.6% | -4.7% | 2.08 | -0.60% | Weak |
| 3.5 | 136 | 55.6% | 55.6% | 58.8% | +3.2% | 4.1% | 3.9% | 1.65 | -0.26% | Fair |
| 3 | 181 | 55.2% | 55.2% | 47.5% | -7.7% | -14.5% | -12.6% | 1.19 | -0.54% | Weak |
| 2.5 | 129 | 54.3% | 54.3% | 52.7% | -1.6% | -4.2% | -4.3% | 0.74 | -0.66% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 53.6% | 52.4% | +1.2% | Correct |
| 4.5★ vs 4★ | 52.4% | 52.4% | 0.0% | Flat |
| 4★ vs 3.5★ | 52.4% | 58.8% | -6.4% | INVERTED |
| 3.5★ vs 3★ | 58.8% | 47.5% | +11.3% | Correct |
| 3★ vs 2.5★ | 47.5% | 52.7% | -5.2% | INVERTED |
| 2.5★ vs 2★ | 52.7% | 0.0% | +52.7% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.464 |
| Spearman: Stars vs Flat ROI | 0.357 |
| Spearman: Stars vs CLV | 0.500 |
| Brier Score | 0.2326 |
| Monotonicity Score | -0.17 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | 0.072 | 0.096 | Keep |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | 0.073 | 0.037 | Keep |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.035 | -0.054 | Monitor |
| WalletBase | Wallet quality | Composite skill score | Higher → better | 0.068 | 0.064 | Keep |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | 0.131 | 0.127 | Keep |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | 0.167 | 0.179 | Keep |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | 0.165 | 0.166 | Keep |
| ForSide | Side support | Total wallet force on side | Higher → better | 0.041 | 0.101 | Keep |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.048 | 0.066 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | 0.049 | 0.094 | Keep |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.084 | 0.125 | Keep |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | -0.025 | -0.128 | Monitor |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | -0.028 | -0.128 | Monitor |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | 0.045 | 0.123 | Keep |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (37.88–48.22) | 14 | 35.7% | -32.7% | -26.9% | 0.25% |  |
| p20-40 (48.47–51.90) | 15 | 46.7% | -0.9% | 7.3% | 0.90% |  |
| p40-60 (52.20–54.96) | 15 | 46.7% | 13.6% | -16.7% | 0.00% |  |
| p60-80 (55.10–59.08) | 14 | 42.9% | -18.9% | -14.6% | 0.57% |  |
| p80-95 (59.22–63.65) | 15 | 60.0% | 16.1% | 22.1% | -0.02% |  |
| p95+ (64.63–74.70) | 15 | 33.3% | -35.0% | -55.1% | 0.32% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 31 | 38.7% | -24.6% | -25.3% | 0.12% |  |
| 0.90-1.05 | 24 | 41.7% | -22.0% | -26.0% | 0.07% |  |
| 1.05-1.20 | 24 | 50.0% | 18.4% | 15.6% | 0.73% |  |
| 1.20-1.35 | 5 | 60.0% | 16.6% | -23.7% | 0.27% |  |
| 1.35-1.50 | 3 | 33.3% | -41.0% | -36.9% | 0.72% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.72) | 14 | 35.7% | -32.4% | -32.8% | 0.67% |  |
| 20-40% (0.73–0.98) | 15 | 60.0% | 12.8% | 31.0% | -0.21% |  |
| 40-60% (1.00–1.24) | 15 | 46.7% | 24.1% | -25.5% | 0.44% |  |
| 60-80% (1.24–1.52) | 14 | 35.7% | -40.4% | -26.3% | -0.11% |  |
| 80-95% (1.60–2.39) | 15 | 40.0% | -21.1% | -14.7% | 0.72% |  |
| 95%+ (2.56–4.76) | 15 | 46.7% | -2.2% | -8.8% | 0.39% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 9 | 44.4% | 2.5% | -8.1% | 0.74% | Broad support |
| 0.25-0.40 | 34 | 50.0% | 5.3% | -2.7% | 0.38% | Healthy support |
| 0.40-0.60 | 28 | 35.7% | -29.6% | -19.0% | 0.23% | Concentrated |
| 0.60-0.80 | 14 | 50.0% | -5.5% | -37.9% | 0.18% | Very concentrated |
| 0.80-1.00 | 3 | 33.3% | -36.6% | -59.6% | 0.07% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 17 | 41.2% | -23.1% | -15.5% | 0.11% | 3.7 |
| Broad battle | 55 | 45.5% | -3.4% | -6.4% | 0.47% | 3.5 |
| One-wallet nuke | 11 | 54.5% | -2.5% | 18.5% | 0.06% | 3.9 |
| Thin support | 35 | 48.6% | -8.9% | -5.7% | 0.22% | 3.2 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=96)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 7 | 42.9% | -14.9% | -8.3% | 0.46% | 4.3 | 57.1% |
| SMALL_MOVE | 13 | 23.1% | -55.8% | -69.0% | 0.69% | 3.8 | 100.0% |
| CLEAR_MOVE | 22 | 63.6% | 12.5% | 30.4% | 0.49% | 3.6 | 100.0% |
| NEAR_START | 54 | 44.4% | -3.3% | -12.5% | 0.10% | 3.3 | 100.0% |

**All Time** (n=658)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 524 | 53.6% | -5.3% | -4.9% | -0.50% | 3.2 | 2.3% |
| SMALL_MOVE | 16 | 25.0% | -51.9% | -62.4% | 0.97% | 3.9 | 81.3% |
| CLEAR_MOVE | 48 | 58.3% | 6.0% | 13.0% | 0.01% | 3.7 | 100.0% |
| NEAR_START | 70 | 45.7% | -5.3% | -12.4% | 0.16% | 3.4 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 5 / 40.0% / -18.6% | 3 / 0.0% / -100.0% | 7 / 85.7% / 44.7% | 8 / 62.5% / 37.6% |
| 3.5-4★ | — | 8 / 37.5% / -28.2% | 4 / 50.0% / -8.1% | 17 / 52.9% / 25.2% |
| 2.5-3★ | 2 / 50.0% / -5.8% | 1 / 0.0% / -100.0% | 11 / 54.5% / -0.6% | 29 / 34.5% / -31.2% |
| 1.0-2★ | — | 1 / 0.0% / -100.0% | — | — |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 93 | 45.2% | -8.9% | -9.9% | 3.5 | 0.29% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 143 | 47.6% | -7.7% | -7.6% | 3.7 | 0.16% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 127 | 100% |
| LOCKED (direct) | 58 | 45.7% |
| Promoted (SHADOW→LOCKED) | 40 | 31.5% |
| Rejected (stayed SHADOW) | 19 | 15.0% |
| Superseded (side flipped) | 5 | 3.9% |
| Muted | 33 | 26.0% |
| Cancelled | 3 | 2.4% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=96)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -10.13u | -8.0% | — |
| Flat 1.0u | -7.32u | -7.6% | -2.81u |
| Lock units only | -8.05u | — | -2.08u |
| Units change only on star change | -8.33u | — | -1.80u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 15 | 2.37 | -6.2% | -4.6% | -0.72u | Sizing hurts |
| 4.5 | 8 | 1.94 | 39.2% | 34.8% | +2.27u | Sizing helps |
| 4 | 11 | 1.63 | -30.1% | -18.8% | -0.06u | Neutral |
| 3.5 | 18 | 0.92 | 27.9% | 17.7% | -2.09u | Sizing hurts |
| 3 | 21 | 1.05 | -26.4% | -28.3% | -0.67u | Sizing hurts |
| 2.5 | 22 | 0.80 | -21.4% | -34.9% | -1.43u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |

### All Time (n=658)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -55.01u | -5.5% | — |
| Flat 1.0u | -36.84u | -5.6% | -18.17u |
| Lock units only | -42.16u | — | -12.85u |
| Units change only on star change | -52.37u | — | -2.64u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 28 | 2.50 | -7.4% | -9.1% | -4.32u | Sizing hurts |
| 4.5 | 42 | 2.48 | -2.6% | -8.5% | -7.75u | Sizing hurts |
| 4 | 126 | 2.08 | -5.6% | -4.7% | -5.30u | Sizing hurts |
| 3.5 | 136 | 1.65 | 4.1% | 3.9% | +3.22u | Sizing helps |
| 3 | 181 | 1.19 | -14.5% | -12.6% | -0.82u | Sizing hurts |
| 2.5 | 129 | 0.74 | -4.2% | -4.3% | +1.28u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 96 | 52.9% | 45.8% | -7.1% | -7.6% | 0.30% | Below market |
| 4.5-5★ | 23 | 53.3% | 56.5% | +3.2% | 9.6% | 0.51% | Beating market |
| 3.5-4★ | 29 | 50.1% | 48.3% | -1.8% | 5.9% | 0.50% | Neutral |
| 2.5-3★ | 43 | 54.6% | 39.5% | -15.0% | -23.8% | 0.04% | Below market |
| CLEAR_MOVE only | 22 | 54.3% | 63.6% | +9.3% | 12.5% | 0.49% | Beating market |
| NO_MOVE only | 7 | 52.4% | 42.9% | -9.6% | -14.9% | 0.46% | Below market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=81)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 54.380 | 54.796 | 0.04 |  |
| Rank_norm | 64.784 | 65.683 | 0.06 |  |
| PnL_norm | 56.258 | 56.445 | 0.02 |  |
| WalletBase | 55.926 | 56.366 | 0.06 |  |
| SizeRatio | 1.875 | 1.839 | 0.02 |  |
| ConvictionMult | 0.990 | 0.982 | 0.05 |  |
| WalletCountFor | 3.682 | 3.716 | 0.02 |  |
| TopShare | 0.441 | 0.437 | 0.02 |  |
| ForSide | 209.824 | 212.878 | 0.03 |  |
| AgainstSide | 70.111 | 72.983 | 0.03 |  |
| NetEdge | 1.502 | 1.508 | 0.01 |  |
| WalletPlayScore | 2.437 | 2.490 | 0.03 |  |

### V8 Era (n=88)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 54.380 | 54.380 | 0.00 |  |
| Rank_norm | 64.784 | 64.784 | 0.00 |  |
| PnL_norm | 56.258 | 56.258 | 0.00 |  |
| WalletBase | 55.926 | 55.926 | 0.00 |  |
| SizeRatio | 1.875 | 1.875 | 0.00 |  |
| ConvictionMult | 0.990 | 0.990 | 0.00 |  |
| WalletCountFor | 3.682 | 3.682 | 0.00 |  |
| TopShare | 0.441 | 0.441 | 0.00 |  |
| ForSide | 209.824 | 209.824 | 0.00 |  |
| AgainstSide | 70.111 | 70.111 | 0.00 |  |
| NetEdge | 1.502 | 1.502 | 0.00 |  |
| WalletPlayScore | 2.437 | 2.437 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=96)

- **Sizing issue**: Model P/L (-10.13u) trails flat (-7.32u) by 2.81u
- **Concentration issue**: 17 high-concentration picks (TopShare>0.6) at -11.0% ROI
- **Gate issue**: NO_MOVE ROI (-14.9%) significantly trails CLEAR_MOVE (12.5%)

### 7-Day (n=84)

- **Sizing issue**: Model P/L (-12.80u) trails flat (-5.97u) by 6.83u
- **Concentration issue**: 15 high-concentration picks (TopShare>0.6) at -12.8% ROI

### All Time (n=658)

- **Sizing issue**: Model P/L (-55.01u) trails flat (-36.84u) by 18.17u
- **Environment issue**: 79.6% NO_MOVE (WR: 53.6%, ROI: -5.3%)
- **Concentration issue**: 17 high-concentration picks (TopShare>0.6) at -11.0% ROI


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
| V8 era picks | 96 |
| V8 flat ROI | -7.6% |
| V8 model ROI | -8.0% |
| V8 star monotonicity score | 0.00 |
| 4.5-5★ ROI | 9.6% |
| 2.5-3★ ROI | -23.8% |
| CLEAR_MOVE ROI | 12.5% |
| NO_MOVE ROI | -14.9% |
| Single-wallet play rate | 11.5% |
| Whale override win rate | — |
| Avg CLV by star bucket | 5★: 1.14% | 4.5★: -0.68% | 4★: 0.65% | 3.5★: 0.40% | 3★: -0.02% | 2.5★: 0.09% | 2★: 0.67% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=96)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 77 | 80.2% | 45.5% | -5.6% | -8.8% | 0.31% |
| MUTED | 17 | 17.7% | 47.1% | -18.1% | -9.1% | 0.03% |
| CANCELLED | 2 | 2.1% | 50.0% | 5.0% | 15.4% | 2.49% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| below_lock_range | 7 | 28.6% |
| wps_flipped_diag | 4 | 50.0% |
| whitelist_fade_weak | 3 | 66.7% |
| winners_below_floor | 3 | 33.3% |
| whitelist_fade_strong | 2 | 50.0% |
| quality_below_floor | 2 | 50.0% |
| winners_faded | 2 | 100.0% |
| opp_side_stronger_diag | 1 | 100.0% |

### 7-Day (n=84)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 65 | 77.4% | 44.6% | -4.6% | -13.6% | 0.32% |
| MUTED | 17 | 20.2% | 47.1% | -18.1% | -9.1% | 0.03% |
| CANCELLED | 2 | 2.4% | 50.0% | 5.0% | 15.4% | 2.49% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| below_lock_range | 7 | 28.6% |
| wps_flipped_diag | 4 | 50.0% |
| whitelist_fade_weak | 3 | 66.7% |
| winners_below_floor | 3 | 33.3% |
| whitelist_fade_strong | 2 | 50.0% |
| quality_below_floor | 2 | 50.0% |
| winners_faded | 2 | 100.0% |
| opp_side_stronger_diag | 1 | 100.0% |

### All Time (n=658)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 637 | 96.8% | 52.4% | -5.7% | -5.8% | -0.33% |
| MUTED | 17 | 2.6% | 47.1% | -18.1% | -9.1% | 0.03% |
| CANCELLED | 4 | 0.6% | 75.0% | 68.0% | 53.3% | -2.27% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| below_lock_range | 7 | 28.6% |
| wps_flipped_diag | 4 | 50.0% |
| whitelist_fade_weak | 3 | 66.7% |
| winners_below_floor | 3 | 33.3% |
| opposition_building | 2 | 100.0% |
| mid_tier_or_lower | 2 | 100.0% |
| whitelist_fade_strong | 2 | 50.0% |
| quality_below_floor | 2 | 50.0% |
| winners_faded | 2 | 100.0% |
| opp_side_stronger_diag | 1 | 100.0% |
