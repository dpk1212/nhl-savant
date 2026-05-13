# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-05-13 ET
**Completed Picks**: 802 | **V8 Era Picks**: 240 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (57.9%) beats 5★ (52.4%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 31 | 51.6% | -1.86u | -6.0% | -6.73u | -11.0% | 0.14% | -0.23% |  |
| 7-Day | 49 | 59.2% | 4.14u | 8.5% | 9.16u | 9.4% | 0.09% | -0.35% | Strong |
| 14-Day | 94 | 52.1% | -1.24u | -1.3% | 2.62u | 1.7% | -0.35% | -0.26% |  |
| 30-Day | 340 | 48.2% | -26.89u | -7.9% | -28.07u | -5.6% | -0.05% | -0.44% |  |
| V8 Era | 240 | 49.6% | -10.63u | -4.4% | -9.01u | -2.6% | -0.07% | -0.38% |  |
| All Time | 802 | 52.4% | -40.14u | -5.0% | -53.89u | -4.4% | -0.33% | -0.08% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=240)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 63 | 54.3% | 54.3% | 52.4% | -1.9% | -7.4% | -2.3% | 2.56 | 0.09% | Weak |
| 4.5 | 19 | 50.6% | 50.6% | 57.9% | +7.3% | 18.3% | 14.3% | 2.43 | -0.86% | Strong |
| 4 | 36 | 52.8% | 52.8% | 50.0% | -2.8% | -2.7% | -5.6% | 1.20 | 0.27% | Fair |
| 3.5 | 67 | 51.2% | 51.2% | 52.2% | +1.0% | 6.3% | 9.8% | 0.80 | -0.07% | Strong |
| 3 | 21 | 55.6% | 55.6% | 38.1% | -17.6% | -26.4% | -28.3% | 1.05 | -0.02% | Failing |
| 2.5 | 30 | 53.2% | 53.2% | 40.0% | -13.2% | -23.0% | -36.3% | 0.73 | -0.28% | Failing |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 52.4% | 57.9% | -5.5% | INVERTED |
| 4.5★ vs 4★ | 57.9% | 50.0% | +7.9% | Correct |
| 4★ vs 3.5★ | 50.0% | 52.2% | -2.2% | Flat |
| 3.5★ vs 3★ | 52.2% | 38.1% | +14.1% | Correct |
| 3★ vs 2.5★ | 38.1% | 40.0% | -1.9% | Flat |
| 2.5★ vs 2★ | 40.0% | 0.0% | +40.0% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.893 |
| Spearman: Stars vs Flat ROI | 0.714 |
| Spearman: Stars vs CLV | -0.214 |
| Brier Score | 0.2474 |
| Monotonicity Score | 0.00 |

### All Time (n=802)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 76 | 55.0% | 55.0% | 52.6% | -2.4% | -7.6% | -4.3% | 2.58 | 0.22% | Weak |
| 4.5 | 53 | 55.1% | 55.1% | 52.8% | -2.3% | -1.4% | -5.7% | 2.54 | 0.62% | Fair |
| 4 | 151 | 55.2% | 55.2% | 53.0% | -2.2% | -3.1% | -4.0% | 1.90 | -0.47% | Fair |
| 3.5 | 185 | 54.8% | 54.8% | 56.8% | +2.0% | 2.6% | 4.3% | 1.41 | -0.25% | Fair |
| 3 | 181 | 55.2% | 55.2% | 47.5% | -7.7% | -14.5% | -12.6% | 1.19 | -0.54% | Weak |
| 2.5 | 137 | 54.2% | 54.2% | 51.8% | -2.4% | -5.6% | -5.9% | 0.73 | -0.69% | Weak |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 52.6% | 52.8% | -0.2% | Flat |
| 4.5★ vs 4★ | 52.8% | 53.0% | -0.2% | Flat |
| 4★ vs 3.5★ | 53.0% | 56.8% | -3.8% | INVERTED |
| 3.5★ vs 3★ | 56.8% | 47.5% | +9.3% | Correct |
| 3★ vs 2.5★ | 47.5% | 51.8% | -4.3% | INVERTED |
| 2.5★ vs 2★ | 51.8% | 0.0% | +51.8% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.607 |
| Spearman: Stars vs Flat ROI | 0.464 |
| Spearman: Stars vs CLV | 0.179 |
| Brier Score | 0.2334 |
| Monotonicity Score | 0.33 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | 0.028 | 0.039 | Monitor |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.046 | -0.044 | Monitor |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | 0.004 | -0.033 | Monitor |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.013 | -0.014 | Monitor |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | 0.186 | 0.182 | Keep |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | 0.240 | 0.236 | Keep |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | 0.146 | 0.139 | Keep |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.016 | 0.027 | Monitor |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.049 | 0.088 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.010 | -0.014 | Monitor |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.081 | 0.090 | Keep |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.088 | 0.012 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.104 | 0.030 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.043 | 0.003 | Monitor |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (21.47–49.25) | 38 | 52.6% | 1.5% | 6.2% | -0.53% |  |
| p20-40 (49.40–53.18) | 39 | 41.0% | -26.2% | -10.9% | 0.50% |  |
| p40-60 (53.23–57.44) | 39 | 61.5% | 34.3% | 22.5% | 0.16% |  |
| p60-80 (57.50–63.03) | 38 | 47.4% | -6.2% | -10.6% | 0.40% |  |
| p80-95 (63.17–66.05) | 39 | 43.6% | -25.7% | -25.2% | -0.57% |  |
| p95+ (66.26–83.30) | 39 | 48.7% | -7.1% | -7.7% | -0.41% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 75 | 40.0% | -24.4% | -19.7% | -0.20% |  |
| 0.90-1.05 | 77 | 41.6% | -23.5% | -26.1% | -0.17% |  |
| 1.05-1.20 | 56 | 69.6% | 41.6% | 46.6% | 0.30% |  |
| 1.20-1.35 | 13 | 61.5% | 21.3% | -1.0% | -0.12% |  |
| 1.35-1.50 | 7 | 42.9% | -12.3% | -50.6% | 0.03% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.70) | 36 | 50.0% | -2.6% | 5.7% | -0.37% |  |
| 20-40% (0.71–0.93) | 36 | 47.2% | -8.9% | 4.9% | -0.60% |  |
| 40-60% (0.94–1.23) | 36 | 63.9% | 31.4% | 4.9% | 0.29% |  |
| 60-80% (1.23–1.53) | 36 | 36.1% | -31.6% | -28.2% | -0.01% |  |
| 80-95% (1.55–2.11) | 36 | 38.9% | -30.0% | -19.1% | -0.18% |  |
| 95%+ (2.11–4.76) | 37 | 54.1% | 3.3% | -0.2% | 0.41% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 17 | 41.2% | -19.9% | -22.2% | 0.48% | Broad support |
| 0.25-0.40 | 68 | 51.5% | 1.1% | -3.5% | 0.07% | Healthy support |
| 0.40-0.60 | 73 | 43.8% | -13.2% | 1.7% | 0.04% | Concentrated |
| 0.60-0.80 | 41 | 53.7% | -1.2% | -10.1% | -0.24% | Very concentrated |
| 0.80-1.00 | 18 | 50.0% | -5.7% | -17.8% | -1.21% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 33 | 36.4% | -30.8% | -25.0% | -0.14% | 4.1 |
| Broad battle | 124 | 48.4% | -3.9% | 0.5% | -0.10% | 3.9 |
| One-wallet nuke | 41 | 56.1% | 5.2% | 14.6% | -0.56% | 3.6 |
| Thin support | 106 | 51.9% | -2.4% | -2.5% | -0.16% | 3.6 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=240)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 11 | 45.5% | -18.7% | 4.1% | 0.26% | 4.3 | 72.7% |
| SMALL_MOVE | 41 | 36.6% | -31.0% | -35.3% | 0.23% | 4.0 | 100.0% |
| CLEAR_MOVE | 66 | 59.1% | 5.8% | 15.2% | -0.22% | 4.0 | 100.0% |
| NEAR_START | 107 | 47.7% | -1.9% | -7.1% | -0.13% | 3.7 | 100.0% |

**All Time** (n=802)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 528 | 53.6% | -5.4% | -4.6% | -0.49% | 3.2 | 3.0% |
| SMALL_MOVE | 44 | 36.4% | -31.3% | -37.4% | 0.37% | 4.0 | 93.2% |
| CLEAR_MOVE | 92 | 57.6% | 4.3% | 10.8% | -0.27% | 4.0 | 100.0% |
| NEAR_START | 123 | 48.0% | -3.2% | -7.8% | -0.07% | 3.7 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 7 / 57.1% / 0.8% | 13 / 30.8% / -54.8% | 26 / 65.4% / 14.5% | 31 / 51.6% / 6.2% |
| 3.5-4★ | 2 / 0.0% / -100.0% | 25 / 40.0% / -17.5% | 27 / 51.9% / -6.4% | 39 / 59.0% / 23.6% |
| 2.5-3★ | 2 / 50.0% / -5.8% | 2 / 50.0% / -11.5% | 13 / 61.5% / 13.9% | 36 / 33.3% / -33.8% |
| 1.0-2★ | — | 1 / 0.0% / -100.0% | — | 1 / 0.0% / -100.0% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 237 | 49.4% | -4.9% | -3.2% | 3.9 | -0.08% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 287 | 49.8% | -5.0% | -3.4% | 3.9 | -0.08% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 388 | 100% |
| LOCKED (direct) | 65 | 16.8% |
| Promoted (SHADOW→LOCKED) | 185 | 47.7% |
| Rejected (stayed SHADOW) | 104 | 26.8% |
| Superseded (side flipped) | 29 | 7.5% |
| Muted | 177 | 45.6% |
| Cancelled | 20 | 5.2% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=240)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -9.01u | -2.6% | — |
| Flat 1.0u | -10.63u | -4.4% | +1.62u |
| Lock units only | -3.73u | — | -5.28u |
| Units change only on star change | -0.18u | — | -8.83u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 63 | 2.56 | -7.4% | -2.3% | +0.93u | Sizing helps |
| 4.5 | 19 | 2.43 | 18.3% | 14.3% | +3.12u | Sizing helps |
| 4 | 36 | 1.20 | -2.7% | -5.6% | -1.43u | Sizing hurts |
| 3.5 | 67 | 0.80 | 6.3% | 9.8% | +1.01u | Sizing helps |
| 3 | 21 | 1.05 | -26.4% | -28.3% | -0.67u | Sizing hurts |
| 2.5 | 30 | 0.73 | -23.0% | -36.3% | -1.02u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |

### All Time (n=802)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -53.89u | -4.4% | — |
| Flat 1.0u | -40.14u | -5.0% | -13.75u |
| Lock units only | -37.85u | — | -16.04u |
| Units change only on star change | -44.22u | — | -9.67u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 76 | 2.58 | -7.6% | -4.3% | -2.67u | Sizing hurts |
| 4.5 | 53 | 2.54 | -1.4% | -5.7% | -6.90u | Sizing hurts |
| 4 | 151 | 1.90 | -3.1% | -4.0% | -6.67u | Sizing hurts |
| 3.5 | 185 | 1.41 | 2.6% | 4.3% | +6.32u | Sizing helps |
| 3 | 181 | 1.19 | -14.5% | -12.6% | -0.82u | Sizing hurts |
| 2.5 | 137 | 0.73 | -5.6% | -5.9% | +1.69u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 240 | 52.9% | 49.6% | -3.3% | -4.4% | -0.07% | Below market |
| 4.5-5★ | 82 | 53.4% | 53.7% | +0.2% | -1.4% | -0.13% | Neutral |
| 3.5-4★ | 103 | 51.8% | 51.5% | -0.3% | 3.2% | 0.05% | Neutral |
| 2.5-3★ | 53 | 54.2% | 41.5% | -12.7% | -20.2% | -0.19% | Below market |
| CLEAR_MOVE only | 66 | 54.6% | 59.1% | +4.5% | 5.8% | -0.22% | Beating market |
| NO_MOVE only | 11 | 55.7% | 45.5% | -10.2% | -18.7% | 0.26% | Below market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=34)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 57.264 | 52.318 | 0.46 |  |
| Rank_norm | 65.268 | 63.980 | 0.08 |  |
| PnL_norm | 56.856 | 50.226 | 0.44 |  |
| WalletBase | 58.099 | 53.358 | 0.51 |  |
| SizeRatio | 1.682 | 1.827 | 0.09 |  |
| ConvictionMult | 0.989 | 1.051 | 0.37 |  |
| WalletCountFor | 3.387 | 3.147 | 0.13 |  |
| TopShare | 0.491 | 0.593 | 0.49 |  |
| ForSide | 194.191 | 171.935 | 0.21 |  |
| AgainstSide | 64.740 | 57.244 | 0.09 |  |
| NetEdge | 1.392 | 1.233 | 0.18 |  |
| WalletPlayScore | 2.001 | 1.289 | 0.33 |  |

### V8 Era (n=217)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 57.264 | 57.336 | 0.01 |  |
| Rank_norm | 65.268 | 64.809 | 0.03 |  |
| PnL_norm | 56.856 | 56.273 | 0.04 |  |
| WalletBase | 58.099 | 57.864 | 0.03 |  |
| SizeRatio | 1.682 | 1.630 | 0.03 |  |
| ConvictionMult | 0.989 | 0.983 | 0.04 |  |
| WalletCountFor | 3.387 | 3.387 | 0.00 |  |
| TopShare | 0.491 | 0.491 | 0.00 |  |
| ForSide | 194.191 | 194.191 | 0.00 |  |
| AgainstSide | 64.740 | 64.740 | 0.00 |  |
| NetEdge | 1.392 | 1.392 | 0.00 |  |
| WalletPlayScore | 2.001 | 2.001 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=240)

- **Gate issue**: NO_MOVE ROI (-18.7%) significantly trails CLEAR_MOVE (5.8%)

### 7-Day (n=49)

No major failure modes detected.

### All Time (n=802)

- **Sizing issue**: Model P/L (-53.89u) trails flat (-40.14u) by 13.75u
- **Environment issue**: 65.8% NO_MOVE (WR: 53.6%, ROI: -5.4%)


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
| V8 era picks | 240 |
| V8 flat ROI | -4.4% |
| V8 model ROI | -2.6% |
| V8 star monotonicity score | 0.00 |
| 4.5-5★ ROI | -1.4% |
| 2.5-3★ ROI | -20.2% |
| CLEAR_MOVE ROI | 5.8% |
| NO_MOVE ROI | -18.7% |
| Single-wallet play rate | 17.1% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: 0.09% | 4.5★: -0.86% | 4★: 0.27% | 3.5★: -0.07% | 3★: -0.02% | 2.5★: -0.28% | 2★: 0.67% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=240)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 169 | 70.4% | 47.3% | -5.6% | -8.3% | -0.02% |
| MUTED | 60 | 25.0% | 55.0% | -1.3% | 17.0% | -0.24% |
| CANCELLED | 11 | 4.6% | 54.5% | -2.8% | -10.4% | 0.16% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| v73_hc_rescue | 18 | 44.4% |
| winners_below_floor | 14 | 42.9% |
| wps_flipped_diag | 13 | 30.8% |
| ags_quality_veto | 13 | 69.2% |
| winners_faded | 12 | 66.7% |
| opp_side_stronger_diag | 10 | 50.0% |
| winners_killed | 9 | 55.6% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 7 | 57.1% |
| whitelist_fade_weak | 3 | 66.7% |
| sum_below_floor | 3 | 33.3% |
| whitelist_fade_strong | 2 | 50.0% |
| dw1_no_ags_support | 1 | 100.0% |

### 7-Day (n=49)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 31 | 63.3% | 54.8% | 8.3% | 0.1% | -0.19% |
| MUTED | 15 | 30.6% | 73.3% | 17.0% | 30.3% | 0.43% |
| CANCELLED | 3 | 6.1% | 33.3% | -32.7% | -24.3% | 1.04% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| ags_quality_veto | 13 | 69.2% |
| v73_hc_rescue | 5 | 60.0% |
| opp_side_stronger_diag | 4 | 75.0% |
| winners_killed | 3 | 33.3% |
| wps_flipped_diag | 1 | 0.0% |
| winners_faded | 1 | 100.0% |
| dw1_no_ags_support | 1 | 100.0% |

### All Time (n=802)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 729 | 90.9% | 52.0% | -5.7% | -6.1% | -0.32% |
| MUTED | 60 | 7.5% | 55.0% | -1.3% | 17.0% | -0.24% |
| CANCELLED | 13 | 1.6% | 61.5% | 17.8% | 4.8% | -0.95% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| v73_hc_rescue | 18 | 44.4% |
| winners_below_floor | 14 | 42.9% |
| wps_flipped_diag | 13 | 30.8% |
| ags_quality_veto | 13 | 69.2% |
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
