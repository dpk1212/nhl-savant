# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-05-03 ET
**Completed Picks**: 734 | **V8 Era Picks**: 172 | **V8 Since**: 2026-04-18
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
| 3-Day | 16 | 43.8% | -1.46u | -9.1% | -7.41u | -47.0% | -0.09% | -0.46% | Cold streak |
| 7-Day | 76 | 50.0% | -3.49u | -4.6% | -2.44u | -2.4% | -0.20% | -0.25% |  |
| 14-Day | 160 | 47.5% | -9.46u | -5.9% | -15.24u | -7.3% | 0.06% | -0.36% |  |
| 30-Day | 548 | 50.0% | -42.15u | -7.7% | -57.96u | -7.4% | -0.26% | -0.05% |  |
| V8 Era | 172 | 47.7% | -10.81u | -6.3% | -12.57u | -5.6% | 0.07% | -0.40% |  |
| All Time | 734 | 52.2% | -40.33u | -5.5% | -57.45u | -5.2% | -0.32% | -0.07% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=172)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 45 | 53.4% | 53.4% | 53.3% | -0.1% | -3.1% | 0.3% | 2.28 | 0.24% | Fair |
| 4.5 | 9 | 49.5% | 49.5% | 55.6% | +6.1% | 23.7% | 13.0% | 2.06 | -0.68% | Strong |
| 4 | 23 | 55.0% | 55.0% | 56.5% | +1.5% | 9.8% | -2.4% | 1.29 | 0.11% | Strong |
| 3.5 | 46 | 50.3% | 50.3% | 47.8% | -2.4% | 1.1% | 2.8% | 0.69 | 0.17% | Fair |
| 3 | 21 | 55.6% | 55.6% | 38.1% | -17.6% | -26.4% | -28.3% | 1.05 | -0.02% | Failing |
| 2.5 | 27 | 53.4% | 53.4% | 37.0% | -16.4% | -28.8% | -39.6% | 0.76 | -0.12% | Failing |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 53.3% | 55.6% | -2.3% | Flat |
| 4.5★ vs 4★ | 55.6% | 56.5% | -0.9% | Flat |
| 4★ vs 3.5★ | 56.5% | 47.8% | +8.7% | Correct |
| 3.5★ vs 3★ | 47.8% | 38.1% | +9.7% | Correct |
| 3★ vs 2.5★ | 38.1% | 37.0% | +1.1% | Correct |
| 2.5★ vs 2★ | 37.0% | 0.0% | +37.0% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.857 |
| Spearman: Stars vs Flat ROI | 0.786 |
| Spearman: Stars vs CLV | -0.143 |
| Brier Score | 0.2546 |
| Monotonicity Score | -0.33 |

### All Time (n=734)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 58 | 54.6% | 54.6% | 53.4% | -1.1% | -4.3% | -3.2% | 2.36 | 0.38% | Fair |
| 4.5 | 43 | 56.0% | 56.0% | 51.2% | -4.8% | -4.8% | -11.0% | 2.49 | 1.03% | Fair |
| 4 | 138 | 55.8% | 55.8% | 54.3% | -1.5% | -1.1% | -3.5% | 1.99 | -0.58% | Fair |
| 3.5 | 164 | 55.0% | 55.0% | 56.1% | +1.1% | 0.6% | 2.8% | 1.46 | -0.20% | Fair |
| 3 | 181 | 55.2% | 55.2% | 47.5% | -7.7% | -14.5% | -12.6% | 1.19 | -0.54% | Weak |
| 2.5 | 134 | 54.3% | 54.3% | 51.5% | -2.8% | -6.4% | -6.2% | 0.74 | -0.67% | Weak |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 53.4% | 51.2% | +2.2% | Correct |
| 4.5★ vs 4★ | 51.2% | 54.3% | -3.1% | INVERTED |
| 4★ vs 3.5★ | 54.3% | 56.1% | -1.8% | Flat |
| 3.5★ vs 3★ | 56.1% | 47.5% | +8.6% | Correct |
| 3★ vs 2.5★ | 47.5% | 51.5% | -4.0% | INVERTED |
| 2.5★ vs 2★ | 51.5% | 0.0% | +51.5% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.500 |
| Spearman: Stars vs Flat ROI | 0.643 |
| Spearman: Stars vs CLV | 0.286 |
| Brier Score | 0.2338 |
| Monotonicity Score | 0.00 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | 0.145 | 0.091 | Keep |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.084 | -0.087 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.016 | -0.053 | Monitor |
| WalletBase | Wallet quality | Composite skill score | Higher → better | 0.033 | -0.020 | Keep |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | 0.128 | 0.155 | Keep |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | 0.171 | 0.199 | Keep |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | 0.160 | 0.144 | Keep |
| ForSide | Side support | Total wallet force on side | Higher → better | 0.026 | 0.069 | Monitor |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.107 | 0.142 | Tune |
| NetEdge | Core side edge | For minus discounted against | Higher → better | 0.000 | -0.011 | Monitor |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.111 | 0.126 | Keep |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.015 | -0.058 | Monitor |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.025 | -0.043 | Monitor |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | 0.016 | 0.052 | Monitor |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (37.88–50.55) | 27 | 40.7% | -14.3% | -10.2% | 0.16% |  |
| p20-40 (50.70–54.51) | 27 | 55.6% | 19.2% | 13.0% | 0.64% |  |
| p40-60 (54.60–57.92) | 28 | 57.1% | 14.7% | 4.2% | 0.04% |  |
| p60-80 (58.15–62.76) | 27 | 40.7% | -18.2% | -5.6% | 0.65% |  |
| p80-95 (62.80–65.33) | 27 | 51.9% | -10.3% | -12.1% | -0.56% |  |
| p95+ (65.40–74.70) | 28 | 35.7% | -33.6% | -38.6% | -0.45% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 65 | 40.0% | -23.6% | -19.8% | -0.13% |  |
| 0.90-1.05 | 49 | 46.9% | -11.7% | -16.4% | 0.21% |  |
| 1.05-1.20 | 36 | 61.1% | 33.7% | 31.1% | 0.29% |  |
| 1.20-1.35 | 7 | 57.1% | 11.2% | -23.4% | -0.01% |  |
| 1.35-1.50 | 4 | 25.0% | -55.8% | -66.0% | 0.88% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.76) | 27 | 44.4% | -9.2% | 3.2% | 0.32% |  |
| 20-40% (0.77–0.94) | 27 | 51.9% | -0.2% | 28.5% | -0.53% |  |
| 40-60% (0.98–1.24) | 28 | 60.7% | 31.3% | -6.1% | 0.18% |  |
| 60-80% (1.25–1.52) | 27 | 33.3% | -38.0% | -30.5% | 0.05% |  |
| 80-95% (1.53–2.13) | 27 | 37.0% | -35.5% | -29.8% | -0.09% |  |
| 95%+ (2.17–4.76) | 28 | 53.6% | 7.0% | -2.2% | 0.51% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 14 | 35.7% | -20.2% | -26.7% | 0.45% | Broad support |
| 0.25-0.40 | 58 | 51.7% | 3.5% | -5.9% | 0.25% | Healthy support |
| 0.40-0.60 | 58 | 43.1% | -14.0% | -0.4% | -0.07% | Concentrated |
| 0.60-0.80 | 30 | 50.0% | -8.6% | -8.7% | -0.10% | Very concentrated |
| 0.80-1.00 | 4 | 50.0% | -4.8% | -49.1% | -0.36% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 26 | 34.6% | -34.6% | -35.5% | -0.26% | 3.9 |
| Broad battle | 102 | 49.0% | -0.2% | 3.7% | 0.18% | 3.9 |
| One-wallet nuke | 12 | 58.3% | 5.2% | 18.0% | -0.08% | 3.8 |
| Thin support | 64 | 50.0% | -6.0% | -2.9% | 0.02% | 3.5 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=172)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 9 | 44.4% | -13.8% | 5.1% | 0.41% | 4.3 | 66.7% |
| SMALL_MOVE | 28 | 32.1% | -39.0% | -44.4% | 0.21% | 4.0 | 100.0% |
| CLEAR_MOVE | 51 | 56.9% | 2.7% | 7.8% | -0.11% | 4.0 | 100.0% |
| NEAR_START | 84 | 47.6% | -0.1% | -3.1% | 0.11% | 3.5 | 100.0% |

**All Time** (n=734)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 526 | 53.6% | -5.3% | -4.6% | -0.49% | 3.2 | 2.7% |
| SMALL_MOVE | 31 | 32.3% | -38.6% | -45.7% | 0.40% | 4.0 | 90.3% |
| CLEAR_MOVE | 77 | 55.8% | 2.0% | 5.4% | -0.21% | 3.9 | 100.0% |
| NEAR_START | 100 | 48.0% | -2.0% | -5.1% | 0.15% | 3.6 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 6 / 50.0% / -2.1% | 9 / 33.3% / -48.7% | 22 / 59.1% / 4.4% | 17 / 58.8% / 25.3% |
| 3.5-4★ | 1 / 0.0% / -100.0% | 17 / 35.3% / -26.7% | 17 / 52.9% / -2.4% | 34 / 58.8% / 25.6% |
| 2.5-3★ | 2 / 50.0% / -5.8% | 1 / 0.0% / -100.0% | 12 / 58.3% / 7.0% | 33 / 30.3% / -39.6% |
| 1.0-2★ | — | 1 / 0.0% / -100.0% | — | — |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 169 | 47.3% | -7.0% | -6.5% | 3.8 | 0.06% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 219 | 48.4% | -6.6% | -5.9% | 3.8 | 0.03% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 287 | 100% |
| LOCKED (direct) | 59 | 20.6% |
| Promoted (SHADOW→LOCKED) | 117 | 40.8% |
| Rejected (stayed SHADOW) | 87 | 30.3% |
| Superseded (side flipped) | 19 | 6.6% |
| Muted | 134 | 46.7% |
| Cancelled | 12 | 4.2% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=172)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -12.57u | -5.6% | — |
| Flat 1.0u | -10.81u | -6.3% | -1.76u |
| Lock units only | -4.45u | — | -8.12u |
| Units change only on star change | -5.71u | — | -6.86u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 45 | 2.28 | -3.1% | 0.3% | +1.65u | Sizing helps |
| 4.5 | 9 | 2.06 | 23.7% | 13.0% | +0.27u | Neutral |
| 4 | 23 | 1.29 | 9.8% | -2.4% | -2.95u | Sizing hurts |
| 3.5 | 46 | 0.69 | 1.1% | 2.8% | +0.39u | Neutral |
| 3 | 21 | 1.05 | -26.4% | -28.3% | -0.67u | Sizing hurts |
| 2.5 | 27 | 0.76 | -28.8% | -39.6% | -0.34u | Neutral |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |

### All Time (n=734)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -57.45u | -5.2% | — |
| Flat 1.0u | -40.33u | -5.5% | -17.12u |
| Lock units only | -38.57u | — | -18.88u |
| Units change only on star change | -49.75u | — | -7.70u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 58 | 2.36 | -4.3% | -3.2% | -1.94u | Sizing hurts |
| 4.5 | 43 | 2.49 | -4.8% | -11.0% | -9.75u | Sizing hurts |
| 4 | 138 | 1.99 | -1.1% | -3.5% | -8.20u | Sizing hurts |
| 3.5 | 164 | 1.46 | 0.6% | 2.8% | +5.70u | Sizing helps |
| 3 | 181 | 1.19 | -14.5% | -12.6% | -0.82u | Sizing hurts |
| 2.5 | 134 | 0.74 | -6.4% | -6.2% | +2.37u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 172 | 52.8% | 47.7% | -5.2% | -6.3% | 0.07% | Below market |
| 4.5-5★ | 54 | 52.8% | 53.7% | +0.9% | 1.4% | 0.09% | Neutral |
| 3.5-4★ | 69 | 51.8% | 50.7% | -1.1% | 4.0% | 0.15% | Neutral |
| 2.5-3★ | 48 | 54.4% | 37.5% | -16.9% | -27.8% | -0.07% | Below market |
| CLEAR_MOVE only | 51 | 54.8% | 56.9% | +2.1% | 2.7% | -0.11% | Beating market |
| NO_MOVE only | 9 | 52.7% | 44.4% | -8.3% | -13.8% | 0.41% | Below market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=76)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 57.685 | 61.512 | 0.37 |  |
| Rank_norm | 64.571 | 64.324 | 0.02 |  |
| PnL_norm | 56.981 | 57.818 | 0.06 |  |
| WalletBase | 58.215 | 60.865 | 0.36 |  |
| SizeRatio | 1.582 | 1.243 | 0.22 |  |
| ConvictionMult | 0.966 | 0.937 | 0.18 |  |
| WalletCountFor | 3.530 | 3.355 | 0.10 |  |
| TopShare | 0.452 | 0.464 | 0.07 |  |
| ForSide | 201.469 | 191.795 | 0.09 |  |
| AgainstSide | 68.087 | 65.742 | 0.03 |  |
| NetEdge | 1.436 | 1.359 | 0.09 |  |
| WalletPlayScore | 2.276 | 2.091 | 0.10 |  |

### V8 Era (n=164)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 57.685 | 57.685 | 0.00 |  |
| Rank_norm | 64.571 | 64.571 | 0.00 |  |
| PnL_norm | 56.981 | 56.981 | 0.00 |  |
| WalletBase | 58.215 | 58.215 | 0.00 |  |
| SizeRatio | 1.582 | 1.582 | 0.00 |  |
| ConvictionMult | 0.966 | 0.966 | 0.00 |  |
| WalletCountFor | 3.530 | 3.530 | 0.00 |  |
| TopShare | 0.452 | 0.452 | 0.00 |  |
| ForSide | 201.469 | 201.469 | 0.00 |  |
| AgainstSide | 68.087 | 68.087 | 0.00 |  |
| NetEdge | 1.436 | 1.436 | 0.00 |  |
| WalletPlayScore | 2.276 | 2.276 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=172)

- **Sizing issue**: Model P/L (-12.57u) trails flat (-10.81u) by 1.76u
- **Gate issue**: NO_MOVE ROI (-13.8%) significantly trails CLEAR_MOVE (2.7%)

### 7-Day (n=76)

No major failure modes detected.

### All Time (n=734)

- **Sizing issue**: Model P/L (-57.45u) trails flat (-40.33u) by 17.12u
- **Environment issue**: 71.7% NO_MOVE (WR: 53.6%, ROI: -5.3%)


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
| V8 era picks | 172 |
| V8 flat ROI | -6.3% |
| V8 model ROI | -5.6% |
| V8 star monotonicity score | -0.33 |
| 4.5-5★ ROI | 1.4% |
| 2.5-3★ ROI | -27.8% |
| CLEAR_MOVE ROI | 2.7% |
| NO_MOVE ROI | -13.8% |
| Single-wallet play rate | 7.0% |
| Whale override win rate | — |
| Avg CLV by star bucket | 5★: 0.24% | 4.5★: -0.68% | 4★: 0.11% | 3.5★: 0.17% | 3★: -0.02% | 2.5★: -0.12% | 2★: 0.67% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=172)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 122 | 70.9% | 45.9% | -7.6% | -11.7% | 0.21% |
| MUTED | 43 | 25.0% | 48.8% | -7.6% | 9.5% | -0.41% |
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
| v73_hc_rescue | 3 | 33.3% |
| whitelist_fade_strong | 2 | 50.0% |

### 7-Day (n=76)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 45 | 59.2% | 46.7% | -10.8% | -16.1% | 0.04% |
| MUTED | 26 | 34.2% | 50.0% | -0.7% | 23.3% | -0.70% |
| CANCELLED | 5 | 6.6% | 80.0% | 31.4% | 31.2% | 0.18% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| winners_below_floor | 10 | 40.0% |
| winners_faded | 8 | 62.5% |
| wps_flipped_diag | 7 | 28.6% |
| quality_below_floor | 5 | 60.0% |
| winners_killed | 5 | 80.0% |
| sum_below_floor | 3 | 33.3% |
| v73_hc_rescue | 3 | 33.3% |
| opp_side_stronger_diag | 2 | 50.0% |

### All Time (n=734)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 682 | 92.9% | 52.1% | -6.1% | -6.5% | -0.30% |
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
| v73_hc_rescue | 3 | 33.3% |
| opposition_building | 2 | 100.0% |
| mid_tier_or_lower | 2 | 100.0% |
| whitelist_fade_strong | 2 | 50.0% |
